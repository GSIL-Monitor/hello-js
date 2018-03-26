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