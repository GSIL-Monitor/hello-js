var events = require('events');
var eventEmitter = new events.EventEmitter();

//监听器1
var listener1 = function listener1(){
    console.log('监听器1执行。');
}

//监听器2
var listener2 = function listener2(){
    console.log('监听器2执行。');
}

//绑定connection事件 处理函数为listener1
eventEmitter.addListener('connection',listener1);

//绑定connection事件 处理函数为listener2
eventEmitter.on('connection',listener2);

var eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
console.log(eventListeners + "个监听器监听该事件");

//触发connection
eventEmitter.emit('connection');

//移除listener1
eventEmitter.removeListener('connection',listener1);
console.log('listener1 不再监听');

//触发connection
eventEmitter.emit('connection');

var eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
console.log(eventListeners + "个监听器监听该事件");

console.log('程序执行完毕');