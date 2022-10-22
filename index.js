const MQTT = require('mqtt');

class MM_mqtt {
	/**
	 * 构造函数
	 * @param {Object} config 配置参数
	 */
	constructor(config) {
		this.config = Object.assign({
			host: "127.0.0.1",
			port: "8083",
			protocol: "ws",
			clientId: "web123",
			username: "admin",
			password: "asd123",
			clean: false
		}, config);

		// mqtt客户端服务器
		this.client = null;

		/**
		 * message queue
		 */
		this.list_msg = [
			/*
			{
				// information ID
				id: "",
				// request method
				method: "",
				// message parameters
				params: {},
				// Callback
				func: function(res){}
			}
			*/
		];

		/**
		 * method collection
		 */
		this.methods = {
			/**
			 * Provide to the server to see how many open functions there are
			 */
			get_method: function() {
				return Object.keys(_this.methods)
			}
		};
	}
}

/**
 * 初始化
 * @param {Object} config 配置参数
 */
MM_mqtt.prototype.init = function(config) {
	this.config = Object.assign(this.config, config);
};

/**
 * 运行MQTT
 */
MM_mqtt.prototype.run = function() {
	this.client = MQTT.connect(this.config);
	return new Promise((resolve, reject) => {
		this.client.on('connect', (packet, err) => {
			if (err) {
				resolve(null);
				reject(err);
			} else {
				this.client.on('message', (topic, message) => {
					this.receive(topic, message.toString());
				});
				resolve(packet);
			}
		});
	});
};

/**
 * 监听事件
 * @param {String} eventName
 * @param {Function} func
 */
MM_mqtt.prototype.on = function(eventName, func) {
	this.client.on(eventName, func);
};

/**
 * 接收消息
 * @param {String} topic 订阅板块
 * @param {Object} msg 消息主体
 */
MM_mqtt.prototype.message = function(topic, msg) {
	console.log("一般消息", topic, msg);
}

/**
 * 接收消息
 * @param {String} topic 订阅
 * @param {Object} bodyStr 消息主体
 */
MM_mqtt.prototype.receive = function(topic, bodyStr) {
	var json;
	if (bodyStr && (bodyStr.indexOf('[') === 0) || bodyStr.indexOf('{') === 0) {
		try {
			json = JSON.parse(bodyStr);
		} catch {}
	}
	if (json) {
		var id = json.id;
		if (json.result && id) {
			var lt = this.list_msg;
			var len = lt.length;
			var has = false;
			for (var i = 0; i < len; i++) {
				var o = lt[i];
				if (id === o.id) {
					o.func(json.result);
					lt.splice(i, 1);
					has = true;
					break;
				}
			}
			if (has) {
				return;
			}
		} else if (json.method) {
			var func = this.methods[json.method];
			if (func) {
				var ret = func(json.params);
				if (ret) {
					var obj = {};
					if (id) {
						obj.id = id
					}
					obj.result = ret;
					this.send(JSON.stringify(obj));
				}
				return;
			}
		}
		this.message(topic, json);
		return
	}
	this.message(topic, bodyStr);
};

MM_mqtt.prototype.subscribe = function(topic) {
	this.client.subscribe(topic, {
		qos: 1
	});
}

MM_mqtt.prototype.end = function() {
	this.client.end();
};

MM_mqtt.prototype.publish = function(topic, message) {
	this.client.publish(topic, message, {
		qos: 1
	});
};

MM_mqtt.prototype.send = function(topic, msgObj) {
	this.publish(topic, JSON.stringify(msgObj));
};

MM_mqtt.prototype.req = function(topic, method, params, func) {
	var data = {
		id: this.client.options.clientId + "_" + Date.parse(new Date()),
		method,
		params
	};

	if (func) {
		data.func = func;
		this.list_msg.push(data);
	}
	this.send(topic, data);
};

/**
 * 同步请求 - 可及时取回消息
 * @param {String} method 请求方法
 * @param {Object} params 传递参数
 * @returns {Object} 返回响应结果
 */
MM_mqtt.prototype.reqASync = function(topic, method, params) {
	var _this = this;
	return new Promise((resolve, reject) => {
		var hasMsg;
		_this.req(topic, method, params, (res) => {
			hasMsg = true;
			resolve(res);
		});
		setTimeout(function() {
			if (!hasMsg) {
				resolve(null);
				reject("request timeout!");
			}
		}, 3000);
	});
};

module.exports = MM_mqtt;
