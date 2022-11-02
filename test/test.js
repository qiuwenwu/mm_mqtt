var MQTT = require('../index.js');
var mqtt = new MQTT();

mqtt.run();
mqtt.subscribe('test');
mqtt.methods.seting = function(param) {
	return {
		hi: "helloworld!"
	}
};
setInterval(() => {
	// 订阅板块，函数方法名，参数
	mqtt.req('test', "seting", {
		body: {
			helloworld: "你好"
		}
	});
}, 2000);
