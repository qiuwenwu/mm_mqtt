
var mqtt = 
mqtt.message = (topic, message) => {
	console.log("这就是消息", topic, message);
};
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
