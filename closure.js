// 自我调用函数只执行一次。设置计数器为 0。并返回函数表达式"function () { return counter += 1; }"给add。
// add变量可以作为一个函数使用。非常棒的部分是它可以访问函数上一层作用域的计数器。
// 这个叫作 JavaScript 闭包。它使得函数拥有私有变量变成可能。
// 计数器受匿名函数的作用域保护，只能通过 add 方法修改。
// 闭包是可访问上一层函数作用域里变量的函数，即便上一层函数已经关闭。
var add = (function () {
    var counter = 0;
    return function () {
        counter += 1;
        console.log(counter);
    }
})();

add();
add();
add();

// 下面的写法等同于上面的匿名函数写法

function foo() {
    var counter = 0;
    function f() {
        counter++;
        console.log(counter);
    }
    return f;
}
var add1 = foo();

add1();
add1();
add1();

// 闭包可以对变量进行封装，避免变量重名带来的冲突
// 例如有一个变量cache，只有在一个特定函数内部访问，那就可以利用闭包将其作用域限制在函数内
// 匿名自调用函数，里面定义需要封装的变量，然后返回函数的主体
// 下面这个函数返回连乘结果
var mult = (function() {
    // cache为函数内部变量，用作缓存
    // 键为数字拼成的字符串，值为结果
    var cache = {};
    // 返回函数主体
    return function() {
        var key = [].join.call(arguments, ',');
        if (cache[key]){
            return cache[key];
        }
        else{
            var res = 1;
            for(var i = 0, len = arguments.length; i < len; i++){
                res = res * arguments[i];
            }
            cache[key] = res;
            return res;
        }
    };
})();
console.log(mult(1,2,3,4));

console.log(
    Object.prototype.toString.call([1,2,3])
);
