//JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。
//但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。

//写数据
var buf1 = new Buffer(128);
var len  = buf1.write("hello world!");
console.log("写入子字节： "+ len);

//读数据
var buf2 = new Buffer(26);
for(var i=0;i<26;i++){
    buf2[i] = i + 97;
}
console.log(buf2.toString('ascii'));
console.log(buf2.toString('ascii',0,5));
console.log(buf2.toString('utf-8',0,5));
console.log(buf2.toString(undefined,0,5));

//转换为JSON对象
var buf3 = new Buffer("www.wentianlin.top");
var json = buf3.toJSON(buf3);
console.log(json);

//缓冲区合并
var buf4 = new Buffer("aaa.wentianlin");
var buf5 = Buffer.concat([buf3, buf4]);
console.log("合并:"+buf5);

//缓冲区比较，结果类似于strcmp
var result = buf4.compare(buf3);
console.log("比较："+result);

//拷贝缓冲区
var buf6 = new Buffer(20);
buf3.copy(buf6);
console.log("拷贝："+buf6);

//缓冲区裁剪
var buf7 = buf3.slice(0,buf3.length);
console.log("裁剪："+buf7);



