// 客户接收端
const mqtt = require("mqtt");
const client = mqtt.connect({
	host: "127.0.0.1",
	port: "1883",
	protocol: "mqtt",
	clientId: "test123",
	username: "admin",
	password: "asd123",
	clean: false
}) // 指定服务端地址和端口

console.log("连接");
client.on("connect", function(err){
    console.log("服务器连接成功");
	client.unsubscribe("test");
    client.subscribe("temperature", (err) => {
		console.log("错误", err);
	}) // 订阅主题为test的消息
})

client.on("message", function(top, message){
    console.log("当前topic:", top)
    console.log("当前温度：", message.toString())
})