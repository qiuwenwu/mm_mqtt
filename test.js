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

mqtt.message = (topic, message) => {
	console.log("一般消息", topic, message);
};
mqtt.run();
mqtt.subscribe('test');
mqtt.methods.setting = function(param) {
	console.log("收到", param);
	return {
		hi: "hello world!"
	}
};

setInterval(() => {
	mqtt.send("test", "你好！");
	// 订阅板块，函数方法名，参数
	mqtt.req('test', "setting", {
		body: {
			helloworld: "你好"
		}
	});
}, 2000);
