var fs = require("fs");

//执行异步操作的函数将回调函数作为最后一个参数
//回调函数接收错误对象作为第一个参数
fs.readFile('input.txt', function (err, data) {
	if(err) return console.error(err);
	console.log(data.toString());
});

console.log('end of program');
