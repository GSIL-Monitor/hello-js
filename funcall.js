// 函数有四种调用方式
// 1.方法调用模式：obj.function调用
// 2.函数调用模式：不是对象的方法，而直接调用
// 3.构造器调用模式：
// 4.apply调用模式：


// 1.方法调用模式，通过object.function()调用，this绑定到当前对象
var num = 10;
var obj = {
    num: 0,
    inc: function () {
        this.num++;
    },
    print1: function () {
        // this绑定到obj
        console.log('print1, this.num: ' + this.num);
    }
};
// 方法调用模式
obj.inc();
// 这里输出是2
obj.print1();


// 2.函数调用模式下(直接函数名调用)，this绑定到window
obj.print2 = function () {
    function foo() {
        // this绑定到window
        console.log('print2, this.num: ' + this.num);
    }
    // 函数调用模式
    foo();
};
// 浏览器中这里输出应该是10，在vscode中执行的话因为没有window，所以输出undefined
obj.print2();


// 3.构造器调用模式
// 函数前面带上new来调用，那么将会创建一个连接到该函数的prototype成员的新对象，同时this会被绑定都这个新对象上
// 构造函数
var Person = function(str) {
    this.name = str;
};
Person.prototype.getName = function() {
    return this.name;
};
var myPerson = new Person('wtl');
console.log(myPerson.getName());


// 4.apply调用模式(或call)
// apply是函数对象的一个方法，第一个参数指定this的值，第二个参数是传入的参数数组
// 可以借助apply或call来把一个方法“借”给别的对象使用
var add = function(x, y) {
    console.log("x + y = " + (x + y));
};
var arr = [3, 4];
// null不改变this的绑定
add.apply(null, arr);

newPerson = new Person('new');
// 指定this为newPerson，则输出new，可以利用这点实现多态的动态绑定
console.log(Person.prototype.getName.apply(newPerson));

// call与apply相似，第一个参数指定this，后面直接传参，不用数组
add.call(null, 3, 4);



// 高阶函数
// 1.函数作为参数传递
// 2.函数作为返回值

// 1.函数作为参数传递，可以达到策略与机制分离的效果
// 例如sort函数，排序的过程是不变的，只是按照什么策略排序（升序、降序）可以以函数作为参数传入
console.log([1,5,30,6,4].sort(function(a, b) {
    // 升序
    return a-b;
}));

// 例如设置回调函数，可以处理异步请求或者实现策略分离
// var appendDiv = function(callback){
//     for(var i = 0; i < 10; i++){
//         var div = document.createElement('div');
//         div.innerHTML = i;
//         document.body.appendChild(div);
//         // 如果传入参数是function，则对div执行function
//         if(typeof callback === 'function'){
//             callback(div);
//         }
//     }
// };
// // 比如可以添加div并使其隐藏（当这个策略改变时可以随时改变回调函数，比如改变颜色等）
// appendDiv(function(div){
//     div.style.display = 'none';
// });

// 2.作为返回值
// 判断类型主函数
var isType = function(type){
    return function(obj){
        return Object.prototype.toString.call(obj) === '[object '+type+']';
    };
};
// 构造一个判断string的函数
var isString = isType('String');
console.log(isString('123'));


// 利用高阶函数实现AOP
// 构造一个前置函数
Function.prototype.before = function(beforefn){
    // 保存调用before的函数对象（主函数），本例中是func
    var that = this;
    // 先执行beforefn，然后执行主函数，包装成一个函数返回（因为后面还是after）
    return function(){
        // 先执行beforefn
        beforefn.apply(this, arguments);
        // 执行主函数，可能有返回值，因此用一个return返回调用结果
        return that.apply(this, arguments);
    };
};
// 构造一个后置函数
Function.prototype.after = function(afterfn){
    // 保存调用after的函数对象，本例中是before返回的包装函数
    var that = this;
    // 执行before返回的包装函数，然后执行afterfn，最后返回返回值；将以上过程包装成一个函数返回
    return function(){
        // 执行前面的包装函数
        var ret = that.apply(this, arguments);
        // 执行afterfn
        afterfn.apply(this, arguments);
        return ret;
    };
};
// 创建主函数
var func = function(){
    console.log('log something...');
};
// 对func进行包装
func = func.before(function(){
    console.log('[LOG] ' + Date().toString());
}).after(function(){
    console.log('[/LOG]');
});
// 测试
func();


// 再举一个例子，例如我们需要一个函数，传入参数的时候只是保存参数值，不传入参数的时候才进行运算输出结果
var curry = function(fn){
    // 保存参数
    var args = [];
    return function(){
        if(arguments.length == 0){
            // 计算
            return fn.apply(this, args);
        }
        else{
            // 保存参数，注释掉的方法有缺陷，只能添加一个参数
            // args.push(arguments[0]);
            Array.prototype.push.apply(args, arguments);
        }
    };
};
// 自调用实现对sum的闭包
var calc = (function(){
    var sum = 0;
    return function(){
        for(var i = 0, len = arguments.length; i < len; i++){
            sum += arguments[i];
        }
        return sum;
    }
})();
calc = curry(calc);

calc(1);
calc(2,3);

console.log(calc());

