var MQTT = require('./index.js');

var mqtt = new MQTT({
	host: "127.0.0.1",
	port: "1883",
	protocol: "mqtt",
	clientId: "test123",
	username: "admin",
	password: "asd123",
	clean: false
});

// mqtt.message = (topic, message) => {
// 	console.log("一般消息", topic, message);
// };

mqtt.run();
// 方法类订阅
mqtt.subscribe('client/test');
mqtt.methods.dir = {};
mqtt.methods.dir.try = function(param) {
	console.log("收到try", param);
	return {
		hi: "try again!"
	}
};

// 方法订阅
mqtt.subscribe('client/test');
mqtt.methods.setting = function(param) {
	console.log("收到", param);
	return {
		hi: "hello world!"
	}
};

// 指定主题订阅
mqtt.subscribe('test1', (msg) => {
	console.log('指定主题', msg);
});

setInterval(() => {
	mqtt.send("test1", "你好！");
	
	// 请求的标准格式
	mqtt.send("test1", {
		id: "168667",
		method: "示例",
		params: { pm1: "参数1", pm2: "参数2" }
	});
		
	// 订阅板块，函数方法名，参数
	mqtt.req('client/test', "setting", {
		body: {
			helloworld: "你好"
		}
	});
	
	// 订阅板块，函数方法名，参数
	mqtt.req('client/test', "dir.try", {
		body: {
			gain: "你好"
		}
	});
}, 2000);
