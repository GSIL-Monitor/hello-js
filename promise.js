// Promise
// 所谓Promise ，简单说就是一个容器，里面保存着某个未来才会结束的事件(通常是一个异步操作）的结果。
// 从语法上说，Promise是一个对象，从它可以获取异步操作的消息。

// Promise对象是一个构造函数，用来生成Promise实例
var promist = new Promise(function(resolve, reject){
    if ("asynchronous success"){
        resolve("value");
    }
    else{
        reject("error");
    }
});
// resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved）
// 在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
// reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected）
// 在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

// Promise 实例生成以后，可以用then 方法分别指定resolved状态和rejected状态的回调函数
promist.then(function(value){
    "suucess";
}, function(error){
    "error"
});
// 或者通过then、catch分别制定resolved和rejected
promist.then(function (value){
    "success";
});
promist.catch(function (error){
    "error";
});


// 最简单的例子
var p = new Promise(function (resolve, reject) {
    console.log("Promise");
    var timeout = Math.random() * 2;
    if(timeout < 1){
        resolve(timeout);
    }
    else{
        reject(timeout);
    }
});
p.then(function (value) {
    console.log("resolved timeout: " + value);
}, function(value){
    console.log("rejected timeout: " + value);
});
console.log('Hi!');


// 利用Promise执行并行任务
// 例如从两个url获取信息，使用Promise.all实现
var p1 = new Promise(function(resolve, reject){
    // 利用setTimeout模拟网络请求
    setTimeout(resolve, 3000, "p1 result");
});
var p2 = new Promise(function(resolve, reject){
    setTimeout(resolve, 2000, "p2 result");
});
// 为两个promise指定resolve
Promise.all([p1,p2]).then(function(result){
    console.log("all: ");
    console.log(result);
    // 获得一个Array: ['p1 result', 'p2 result']
});


// 有时候多个异步任务为了容错，第一个执行完就不需要执行后面的
// 例如从两个url获取相同的信息，只要获得先返回的结果就可以
// Promise.race实现
Promise.race([p1, p2]).then(function(result){
    console.log("race: ");
    console.log(result);
});
