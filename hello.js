// jshint esversion:6
{
    let x = 1;
    let y = 1.0;
    x === y; // true
    typeof x === typeof y; // true
    typeof NaN; // number
    NaN === NaN; // false
    isNaN(NaN); // true
    setImmediate(function A() {
        console.log(1);
        setImmediate(function B() {
            console.log(2);
        });
    });
    setTimeout(function timeout() {
        console.log('TIMEOUT FIRED');
    }, 1000);
    setTimeout(function timeout() {
        console.log('TIMEOUT2');
    }, 1000);
}

{
    // Js事件循环

    // Js是单线程的(多线程会造成同步互斥问题)
    // Js是通过事件循环(event loop)机制实现异步的

    // 首先判断代码段是同步还是异步，同步就进入主线程执行，异步就进入event table
    // 异步任务在event table中注册函数，当满足触发条件后，推入event queue
    // 同步任务进入主线程后一直执行，直到主线程空闲后才会去执行event queue的异步任务

    // 异步任务内部也有顺序
    // 1.process.nextTick(fn)是在当前执行栈尾部、异步任务之前添加回调，也就是说fn执行在所有异步任务之前
    // nextTick嵌套nextTick仍然是在当前事件循环中执行，不会推迟到下一个loop
    // 2.Promise.then()，如果嵌套立即resolve的promise，仍然在当前loop中执行
    // 3.setTimeout()和setInterval()，定时结束后尽量早的执行，可能在当前时间loop也可能在后面
    // 4.setImmediate()，如果里面有异步，则在下个loop执行

}





/*
███████ ███████  ██████
██      ██      ██
█████   ███████ ███████
██           ██ ██    ██
███████ ███████  ██████
*/



/*
var 声明的是全局变量，并且执行时会将声明提前，赋值不提前
var 声明的全局变量属于顶层变量（浏览器:window， node:global）
var a=1;
global.a; // 1

let 声明的变量与当前作用域绑定，声明不会提前
let 不允许在相同作用域内重复声明变量
let 作用域内声明的变量，在声明前是不可用的，即便外层有同名的全局var变量

const 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。
const 特性与let相同
let const 声明的全局变量不属于顶层变量


对于简单类型的数据（数值、字符串、布尔值），变量指向的内存地址中保存的就是实际值
但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针
*/



// 解构赋值
{
    // 数组的解构赋值
    // 按照位置的对应关系进行解构赋值，解构不成功则等于undefined
    // ...y表示将尾部的所有元素作为数组赋值给y ...y后面不允许有别的变量
    let [x, , ...y] = [1, 2, 3, 4, 5];
    // x  1
    // 2 被跳过
    // y  [3, 4, 5]

    // 默认值，生效条件是严格等于undefined
    let [head = "a", tail = "b"] = [1];
    // head 1
    // tail b


    // 对象的解构赋值
    // 按照对象键名来解构，不按顺序
    let {foo : bar} = {foo : "aaa", bar : "bbb"};
    // 意思是将右边键名为foo的值赋给左边的bar，所以bar的值为aaa
    // 然而左边的foo只是用作模式匹配，所以foo is not defined，这条语句只声明了bar一个变量
    // 也可以指定默认值 {foo = "abc"} = {foo: undefined}


    // 字符串的解构
    let [a,b,c,d,e] = "hello";
    // a==='h'   b==='e'  c==='l'  d==='l'  e==='o'
    let {length : len} = "hello";
    len; // 5
    // length; // length is not defined


    // 用途

    // 1.交换值
    [x, y] = [y, x];

    // 2.函数返回多个值，一般用对象返回，方便按照名字接受，也方便以后改变返回值不受顺序的影响
    function example() {
        return {
            foo1: 1,
            bar1: 2
        };
    }
    let { foo1, bar1 } = example();

    // 3.函数传参
    // 参数是一组有次序的值
    function f([x, y, z]) { }
    f([1, 2, 3]);
    // 参数是一组无次序的值
    function f({x, y, z}) { }
    f({z: 3, y: 2, x: 1});

    // 4.提取json对象数据

    // 5.遍历map
    const map = new Map();
    map.set('first', 'hello');
    map.set('second', 'world');
    // for iterator of iterable对象
    for (let [key, value] of map) {
        `${key} is ${value}`;
        // first is hello
        // second is world
    }


    // 6.加载模块的指定方法
    // const { SourceMapConsumer, SourceNode } = require("source-map");

}


/*
███████ ████████ ██████  ██ ███    ██  ██████
██         ██    ██   ██ ██ ████   ██ ██
███████    ██    ██████  ██ ██ ██  ██ ██   ███
     ██    ██    ██   ██ ██ ██  ██ ██ ██    ██
███████    ██    ██   ██ ██ ██   ████  ██████
*/

// 字符串
{
    /*
     字符串是基本类型，是不可变的，一旦字符串被创建，就永远无法改变它
     可以通过“+”来连接字符串，生成一个新的字符串
     两个字符串包含着完全相同的字符且字符顺序相同，则认为这两个字符串相同
    */
    //字符串的一些方法
    "helloworld".charAt(1);// e
    "helloworld".charCodeAt(1)   // 十进制的unicode 101，只能识别16位2字节存储格式
    "𠮷".codePointAt(0);    // 十进制的unicode 134071，可以识别32位4字节存储格式 ES6
    String.fromCharCode(101); // unicode转字符 e，只能识别16位2字节存储格式
    String.fromCodePoint(134071); // unicode转字符 𠮷，，可以识别32位4字节存储格式 ES6
    // 一般使用+运算符代替concat
    "hello".concat(' ','world')  // hello world
    "helloworld".indexOf('o', 1) // 4
    // stringObject.lastIndexOf(searchvalue,fromindex) 从fromindex开始往前搜，搜不到返回-1
    "helloworld".lastIndexOf('world',10) //5
    // match返回匹配字符串
    "helloworld".match(/l/)  //["l"]
    "helloworld".match(/l/g) // ["l", "l", "l"]
    // search返回第一个匹配的index
    "helloworld".search(/l/)  // 2
    "helloworld".search(/l?o/) //3
    // stringObject.replace(regexp/substr,replacement)
    "helloworld".replace('w','g') ; //hellogorld
    // stringObject.slice(start,end)  start和end可以为负数，表示从尾部开始计数
    "helloworld".slice(2,5) // llo
    // substring的参数不能使用负数，推荐使用slice
    "helloworld".substring(2,5) //llo
    // stringObject.split(separator,howmany)  howmany指定返回数组的最大长度
    "hello,world".split(',',2) ;  //["hello", "world"]
    "hello,world".split(',',1) ;  //["hello"]

    // ES6补充
    "hello".repeat(2); // hellohello
    "helloworld".includes("llo")  // true
    "helloworld".startsWith("llo", 2) // true
    "helloworld".endsWith("d", 1) // true
    "07-12".padStart(10, 'YYYY-MM-DD'); // 左边补全10长度 "YYYY-07-12"
    "2018".padEnd(10, 'YYYY-MM-DD'); // 左边补全10长度 "2018-MM-DD"

    // 模板字符串 反单引号，简化字符串和变量的拼接  ${表达式} 会转换成值
    // `str: ${s}`
}


/*
███    ██ ██    ██ ███    ███ ██████  ███████ ██████
████   ██ ██    ██ ████  ████ ██   ██ ██      ██   ██
██ ██  ██ ██    ██ ██ ████ ██ ██████  █████   ██████
██  ██ ██ ██    ██ ██  ██  ██ ██   ██ ██      ██   ██
██   ████  ██████  ██      ██ ██████  ███████ ██   ██
*/
// 数值
{

    // 八进制 0o开头
    0o767 === 503; // true
    // 二进制 0b开头
    0b111110111 === 503; // true
    // 转换为10进制要用Number
    Number(0o767); // 503

    // 全局方法模块化 Number
    // 如果参数类型不是数值，Number.isFinite一律返回false
    Number.isFinite(NaN); // false
    Number.isFinite('foo'); // false
    Number.isFinite('15'); // false 不会自动转换为数字
    Number.isFinite(Infinity); // false
    Number.isNaN(NaN); // true
    Number.isNaN("NaN"); // false
    Number.isNaN('15') // false
    Number.parseInt('12.34'); // 12
    Number.parseFloat('123.45#'); // 123.45
    Number.isInteger(25); // true
    Number.isInteger(25.0); // true 整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值
    Number.isInteger('15'); // false
    Number.EPSILON; // js能表示的最小精度，2E-52

    // Math
    Math.trunc(4.9); // 4 去除小数部分
    Math.trunc(-4.9); // -4
    Math.trunc('123.456'); // 123
    Math.cbrt('8'); // 2 立方根
    Math.hypot(3, 4); // 5 计算参数平方和的平方根


}


/*
███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██
██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██
█████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██
██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██
██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████
*/
// 函数
{
    // js函数是传值调用，即先求出参数的值，再讲值传入函数体
    // 另一种策略是传名调用，将表达式传入函数体，用到的时候才进行求值


    // 参数默认值，有默认值的参数一般写在后面，如果写在前面根本无法省略
    function foo(x, y = "world", z = x) {
        // 不能再let const声明x y变量
        // let x;  // error
        // const y;  // error
        console.log(`${x} ${y} ${z}`);

        // 函数调用的时候会形成一个单独的作用域，把传入的x给z
        // 如果有个全局变量x，也不会使用这个全局变量的值
    }

    // rest参数
    // 收集多余的传入参数
    function mypush(arr, ...values) {
        for (value of values) {
            arr.push(value);
        }
    }
    let arr = [];
    mypush(arr, 1, 2, 3); // arr [ 1, 2, 3 ]

    // Function.length 含义是该函数预期传入的参数个数，即没有默认值的参数个数，不包括rest参数
    foo.length; // 1
    mypush.length; // 1
    // Function.name 函数名

    // 箭头函数 如果函数多于一条语句，则在箭头后面加大括号，里面写函数语句
    var f = (x, y) => x + y;
    // 相当于
    var f = function(x, y) {
        return x + y;
    }
    // 箭头函数使得this指针固定化，指向定义时的对象，而非运行时的对象
    // this指向的固定化，并不是因为箭头函数内部有绑定this的机制，
    // 实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。
    // 正是因为它没有this，所以也就不能用作构造函数。
    // 除了this，箭头函数也不存在arguments、super、new.target，指向外层函数对应的变量
    function Timer() {
        this.s1 = 0;
        this.s2 = 0;
        setInterval(() => {
            this.s1++
        }, 1000);
        setInterval(function() {
            this.s2++;
        }, 1000);
    }
    // var timer = new Timer(); // 此时箭头函数this绑定到timer，而在执行下面的setTimeout时匿名函数this指向window
    // setTimeout(() => console.log(`${timer.s1} ${timer.s2}`), 2100); // 2 0
    // 因为箭头函数绑定this到定义时的对象timer，因此2秒后修改了2次timer.s1
    // 匿名函数中的this为执行时的对象window

    var id = 21; // 定义一个window下的全局变量id
    function foo() {
        setTimeout(function() {
            console.log(`anon ${this.id}`);
        }, 100); // 浏览器中输出21
        setTimeout(() => {
            console.log(`=> ${this.id}`);
        }, 100); // 41
    }
    foo.call({
        id: 41
    });


    // 尾调用:A函数的最后一步是调用另一个函数B
    // 尾调用不会保留A函数的调用帧，节约栈空间
    // 尾递归:递归最后调用自己
    // 正常递归会形成很大的调用栈，尾递归只有一个调用帧，只在strict模式下生效
    // 下面求n的阶乘的函数，不是尾递归，调用栈会保存n个调用帧
    function factorial(n) {
        if (n === 1) return 1;
        return n * factorial(n - 1);
    }
    // 下面的改写是尾递归，调用栈中只有一个调用帧
    function factorial(n, total = 1) {
        if (n === 1) {
            return total;
        }
        return factorial(n - 1, n * total);
    }


}


/*
 █████  ██████  ██████   █████  ██    ██
██   ██ ██   ██ ██   ██ ██   ██  ██  ██
███████ ██████  ██████  ███████   ████
██   ██ ██   ██ ██   ██ ██   ██    ██
██   ██ ██   ██ ██   ██ ██   ██    ██
*/
// 数组
{

    // 数组的若干方法
    // let arr1 = 'hello'.split('');
    // 下面这样写可以正确识别四字节的Unicode
    let arr1 = [..."hello"];
    arr1.indexOf('h'); // 0
    // 截取返回一个新数组 slice(start,end)
    arr1.slice(2, 5); // ["l", "l", "o"]
    // 数组中指定位置删除/添加项目，然后返回被删除的项目，改变原有数组 arrayObject.splice(index,howmany,item1,.....,itemX)
    [1, 2, 3].splice(1, 1); // 2  [1, 3]
    arr1.push(' who'); // ["h", "e", "l", "l", "o", " who"]
    arr1.pop(); // " who" ["h", "e", "l", "l", "o"]
    arr1.unshift('t', 'g'); // ["t", "g", "h", "e", "l", "l", "o"]
    arr1.shift(); // "t"   ["g", "h", "e", "l", "l", "o"]
    arr1.sort(); // ["e", "g", "h", "l", "l", "o"]
    // sort函数有一个缺陷：如果给数字排序并且包含负数例如[-1,-2,0,2]
    // 直接arr.sort()结果为[-1,-2,0,2]，因为按照字符串处理
    // -1 -2负号相同，比较后面的数字，1<2所以 -1<-2
    // 可以加比较函数来解决 arr.sort((a,b)=>a-b);

    // 扩展运算符 ... 将数组元素分割为一个个变量
    // 用扩展运算符可以大大减少apply函数的使用
    arr1.push(...[1, 2]) // ["e", "g", "h", "l", "l", "o", 1, 2]
    // 数组是复合的数据类型，因此变量指向的内存区域存的是数组所在内存的地址
    // 直接复制只是复制了一个指针，指向同一块内存，而不是在内存中克隆一份数组数据
    // 使用扩展运算符可以方便的克隆数组
    let arr2 = [...arr1];
    // 合并数组
    // let arr3 = arr1.concat(arr2);
    let arr3 = [...arr1, ...arr2];
    // concat和...都是浅拷贝，即数组的成员仍然是引用
    let arr4 = [{
        a: 1
    }];
    let arr5 = [...arr4];
    // 由于成员是引用，修改原成员会引起arr5成员的变化
    arr4[0].a = 2;
    arr5; // [ { a: 2 } ]

    // 对于实现了Iterator接口的对象，都可用...转换为数组
    // Map Set结构、 Generator函数等

    // Array.from() 用于将类数组数据结构(包含length属性即可)转换为数组
    // 例如操作DOM元素的NodeList、arguments、Set、String
    // 只要实现了Iterator接口的数据结构，都可用Array.from()

    // Array.of()用来构建新数组，替代Array() new Array()
    let arr6 = Array.of(..."hello"); // [ 'h', 'e', 'l', 'l', 'o' ]

    // 修改当前数组，将指定位置的成员复制到其他位置
    // Array.prototype.copyWithin(target, start = 0, end = this.length)
    [1, 2, 3, 4, 5].copyWithin(0, 3); // [4, 5, 3, 4, 5]

    // [].find(callback, thisArg); [].findIndex(); thisArg用于绑定callback中的this
    // 返回数组中第一个符合回调函数条件的成员(或index)
    [1, 5, 10, 15].find(function(value, index, arr) {
        return value > 9;
    }); // 10

    let arr7 = [1, 2, 3, 4, 5];

    // [].fill(value, start, end) 用于填充数组
    arr7.fill(7, 4); // [1, 2, 3, 4, 7]

    // [].entries(); [].keys(); [].values();返回一个迭代器，可用for of遍历

    arr7.includes(1); // true

    // 遍历 forEach()比for循环快
    arr7.forEach((item, index) => {
        // 只是遍历，不会改变原数组，也没有返回值
    });

    // 筛选
    let arr8 = arr7.filter((item, index) => {
        return item < 7;
    }); // [1, 2, 3, 4]
    // 检测数组中元素是否都满足条件
    arr8.every((item, index) => item < 5); // true
    // 检测数组中元素是否有满足条件的 arr.some(callback, thisArg)

    // “累加器” 依次对数组元素处理，最后缩减为一个值
    // reduce(callback, initValue)
    arr8.reduce((sum, item, index) => {
        return item * sum
    }, 1); // 24

    // 遍历arr7并创建按照callback创建新数组，length与原来一致，但是filter就可能减少
    let arr9 = arr8.map((item, index) => {
        return item * item
    });

}


/*
 ██████  ██████       ██ ███████  ██████ ████████
██    ██ ██   ██      ██ ██      ██         ██
██    ██ ██████       ██ █████   ██         ██
██    ██ ██   ██ ██   ██ ██      ██         ██
 ██████  ██████   █████  ███████  ██████    ██
*/
// 对象
{
    let birth = "1994-11-14";
    // 允许直接写入变量和函数(不需要加function关键字)，更加简洁
    const Person = {
        name: '张三',
        // 等同于birth: birth
        birth,
        // 等同于hello: function ()...
        hello() { console.log('我的名字是', this.name); },
        // 也可以 [表达式]:值 来定义 等同于"abc":123
        ["a" + "bc"]: 123,
    };
    // 输出模块更加简洁
    // module.exports = { getItem, setItem, clear }

    // Object.assign(target, source) 浅拷贝，
    // 并且只会克隆自身的值，不会克隆原型链上继承的值
    const target = { a: 1, b: 1 };
    const source1 = { b: 2, c: 2 };
    const source2 = { c: 3 };
    Object.assign(target, source1, source2);
    // 有同名属性 后面source会覆盖前面
    target; // {a:1, b:2, c:3}
    // 如果想要同时克隆原型链，可以用以下方法
    function clone(origin) {
        let originProto = Object.getPrototypeOf(origin);
        return Object.assign(Object.create(originProto), origin);
    }
    // 为对象添加属性、函数
    // Object.assign(SomeClass.prototype, {
    //     someMethod(arg1, arg2) {
    //         ···
    //     },
    //     anotherMethod() {
    //         ···
    //     }
    // });

    // 遍历
    // for...in循环: 只遍历对象自身的和继承的可枚举的属性。
    // Object.keys(): 返回对象自身的所有可枚举的属性的键名数组（不含 Symbol 属性）。
    // Object.getOwnPropertyNames(obj): 返回对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名
    // 我们一般只关心当前对象的属性，所以尽量用Object.keys(),速度比forin快很多
    Object.keys(Person).forEach((k) => {
        Person[k];
    })

    // __proto__ 与 prototype
    function Rectangle() { }
    let rec = new Rectangle();
    // 相当于rec.__proto__ = Object.prototype;
    Object.setPrototypeOf(rec, Object.prototype);
    // 相当于rec.__proto__
    Object.getPrototypeOf(rec); // {}

    // obj.hasOwnProperty(prop) 判断某个对象是否含有指定的属性,忽略掉那些从原型链上继承到的属性。


}


/*
███████ ██    ██ ███    ███ ██████   ██████  ██
██       ██  ██  ████  ████ ██   ██ ██    ██ ██
███████   ████   ██ ████ ██ ██████  ██    ██ ██
     ██    ██    ██  ██  ██ ██   ██ ██    ██ ██
███████    ██    ██      ██ ██████   ██████  ███████
*/
// Symbol
{
    // 新的原始数据类型Symbol，表示独一无二的值
    // 参数是对实例的描述
    let mySymbol = Symbol("description");
    mySymbol; // Symbol(description)

    // Symbol 值可以作为标识符，用于对象的属性名，能保证不会出现同名的属性
    // Symbol 值作为对象属性名时，不能用点运算符
    let a = {};
    a[mySymbol] = 'Hello!';
    // 第二种写法
    // let a = {
    //     [mySymbol]: 'Hello!'
    // };

    // Symbol作为属性名，不会被for...in for...of循环遍历
    // 也不会被Object.keys()、Object.getOwnPropertyNames()返回
    // 可以利用这个特性定义非私有的内部方法

    // 如果希望使用同一个symbol，需要使用Symbol.for()定义
    // Symbol.for("foo")会把foo登记在全局环境中，
    // 再次定义"foo"时就会先查找，如果有就返回同一个Symbol
    // 而Symbol("foo")就不会返回同一个
    let s1 = Symbol.for("foo");
    let s2 = Symbol.for("foo");
    s1 === s2; // true

    // 可以利用Symbol实现Singleton单例模式
    // 单例模式指调用一个类，任何时候返回的都是同一个实例
    // 例如node中模块文件可以看成一个类，每次执行这个模块想返回同一个实例，可以将实例放入global中
    // mod.js
    /*
    function A() {
        this.foo = 'hello';
    }
    if (!global._foo) {
        global._foo = new A();
    }
    module.exports = global._foo;
    */
    // 使用时
    // const a = require('./mod.js');
    // 以上代码实现的单例模式有缺陷，_foo可能会无意间被覆盖，所以可以使用Symbol来作为键名

    // mod.js
    /*
    const FOO_KEY = Symbol.for('foo');
    function A() {
        this.foo = 'hello';
    }
    if (!global[FOO_KEY]) {
        global[FOO_KEY] = new A();
    }
    module.exports = global[FOO_KEY];
    */

}


/*
███████ ███████ ████████     ███    ███  █████  ██████
██      ██         ██        ████  ████ ██   ██ ██   ██
███████ █████      ██        ██ ████ ██ ███████ ██████
     ██ ██         ██        ██  ██  ██ ██   ██ ██
███████ ███████    ██        ██      ██ ██   ██ ██
*/
// Set集合 Map映射
{
    // Set类似于数组，但是成员的值都是唯一的，没有重复的值。
    // Set()可以接受数组作为参数，可以用于去掉数组中的重复值
    const s = new Set();
    [2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
    s; // Set { 2, 3, 5, 4 }

    // s.size：返回Set实例的成员总数
    // add(value)：添加某个值，返回 Set 结构本身。
    // delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
    // has(value)：返回一个布尔值，表示该值是否为Set的成员。
    // clear()：清除所有成员，没有返回值。

    // 遍历Set 遍历顺序就是插入顺序
    // keys()：因为Set没有键名，所以同values
    // values()：返回键值的遍历器
    // entries()：返回键值对的遍历器
    // forEach()：使用回调函数遍历每个成员
    // for of，同values

    // WeakSet 只能用来存放对象，并且其成员不会计入引用计数


    // Map，类似于object，但是键可以是任何数据类型，不再局限于字符串
    const m = new Map();
    const o = {p: 'Hello World'};
    // 添加
    m.set(o, 'content'); // Map { { p: 'Hello World' } => 'content' }
    // 读取
    m.get(o); // "content"
    // 其他方法
    m.has(o); // true
    m.delete(o); // true
    m.has(o); // false
    m.clear();
    // 遍历
    for( [k,v] of m ){
        // ...
    }

    // WeakMap 键名只能是对象，键名不计入引用计数

}


/*
██████  ███████ ███████ ██      ███████  ██████ ████████
██   ██ ██      ██      ██      ██      ██         ██
██████  █████   █████   ██      █████   ██         ██
██   ██ ██      ██      ██      ██      ██         ██
██   ██ ███████ ██      ███████ ███████  ██████    ██
*/
// Reflect
{

    // 1.将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty）放到Reflect对象上
    // 2.修改某些Object方法的返回结果，让其变得更合理
    // Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，
    // 而Reflect.defineProperty(obj, name, desc)则会返回false
    /*
    // 老写法
    try {
        Object.defineProperty(target, property, attributes);
        // success
    } catch (e) {
        // failure
    }
    // 新写法
    if (Reflect.defineProperty(target, property, attributes)) {
        // success
    } else {
        // failure
    }
    */

    // 3.让Object操作都变成函数行为 in => Reflect.has(), delete => Reflect.deleteProperty()
    /*
    // 老写法
    'assign' in Object // true
    // 新写法
    Reflect.has(Object, 'assign') // true
    */

    // 4.Reflect对象的方法与Proxy对象的方法一一对应。写Proxy时完成默认行为，作为修改行为的基础。
    /*
    Proxy(target, {
        set: function(target, name, value, receiver) {
            var success = Reflect.set(target, name, value, receiver);
            if (success) {
                log('property ' + name + ' on ' + target + ' set to ' + value);
            }
            return success;
        }
    });
    */


    // Reflect的静态方法
    // Reflect.apply(target, thisArg, args);
    // Reflect.construct(target, args);
    // Reflect.get(target, name, receiver);
    // Reflect.set(target, name, value, receiver);
    // Reflect.defineProperty(target, name, desc);
    // Reflect.deleteProperty(target, name);
    // Reflect.has(target, name);
    // Reflect.ownKeys(target); // 基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和
    // Reflect.isExtensible(target);
    // Reflect.preventExtensions(target);
    // Reflect.getOwnPropertyDescriptor(target, name);
    // Reflect.getPrototypeOf(target);
    // Reflect.setPrototypeOf(target, prototype);
}


/*
██████  ██████   ██████  ██   ██ ██    ██
██   ██ ██   ██ ██    ██  ██ ██   ██  ██
██████  ██████  ██    ██   ███     ████
██      ██   ██ ██    ██  ██ ██     ██
██      ██   ██  ██████  ██   ██    ██
*/
// 代理
{
    // Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改
    // var proxy = new Proxy(target, handler);
    // target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。
    let handler = {
        set(target, key, value) {
            target[key] = "hhh";
            return true;
        }
    };
    let proxy = new Proxy({}, handler);
    // 注意，要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。
    // 以proxy为原型对象创建一个新对象
    let target = Object.create(proxy);
    // target没有a，所以到原型对象上去，触发proxy操作
    target.a = "123";
    target.a; // hhh

    // 一共支持13种拦截：
    // get(target, propKey, receiver)
    // 拦截对象属性的读取，比如proxy.foo和proxy['foo']。
    // set(target, propKey, value, receiver)
    // 拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
    // has(target, propKey)
    // 拦截propKey in proxy的操作，返回一个布尔值。
    // deleteProperty(target, propKey)
    // 拦截delete proxy[propKey]的操作，返回一个布尔值。
    // ownKeys(target)
    // 拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。
    // 该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
    // getOwnPropertyDescriptor(target, propKey)
    // 拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
    // defineProperty(target, propKey, propDesc)
    // 拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
    // preventExtensions(target)
    // 拦截Object.preventExtensions(proxy)，返回一个布尔值。
    // getPrototypeOf(target)
    // 拦截Object.getPrototypeOf(proxy)，返回一个对象。
    // isExtensible(target)
    // 拦截Object.isExtensible(proxy)，返回一个布尔值。
    // setPrototypeOf(target, proto)
    // 拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
    // apply(target, object, args)
    // 拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
    // construct(target, args)
    // 拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
}


/*
██ ████████ ███████ ██████   █████  ████████  ██████  ██████
██    ██    ██      ██   ██ ██   ██    ██    ██    ██ ██   ██
██    ██    █████   ██████  ███████    ██    ██    ██ ██████
██    ██    ██      ██   ██ ██   ██    ██    ██    ██ ██   ██
██    ██    ███████ ██   ██ ██   ██    ██     ██████  ██   ██
*/
// 遍历器
{
    // Iterator 接口
    /*
    interface Iterable {

        [Symbol.iterator](): Iterator,
    }

    interface Iterator {
        next(value ? : any): IterationResult,
    }

    interface IterationResult {
        value: any,
        done: boolean,
    }
    */

    // 原生具备 Iterator 接口的数据结构如下
    // Array
    // Map
    // Set
    // String
    // TypedArray
    // 函数的 arguments 对象
    // NodeList 对象


    // 为obj对象部署iterator接口
    let obj = {
        data: ['hello', 'world'],
        // Iterator 接口部署在数据结构的Symbol.iterator属性
        // 一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”（iterable）
        // Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数
        // 执行这个函数，就会返回一个遍历器
        [Symbol.iterator]() {
            const self = this;
            let index = 0;
            // 遍历器的根本特征就是具有next方法
            return {
                next() {
                    if (index < self.data.length) {
                        return {
                            value: self.data[index++],
                            done: false
                        };
                    } else {
                        return {
                            value: undefined,
                            done: true
                        };
                    }
                }
            };
        }
    };

    // 对于类似数组的对象（存在数值键名和length属性），部署 Iterator 接口，
    // 有一个简便方法，就是Symbol.iterator方法直接引用数组的 Iterator 接口。
    // obj.prototype[Symbol.iterator] = [][Symbol.iterator];
    let iterable = {
        0: 'a',
        1: 'b',
        2: 'c',
        length: 3,
        [Symbol.iterator]: Array.prototype[Symbol.iterator]
    };
    for (let res of iterable){
        res;
        // a
        // b
        // c
    }


    // 普通对象没有部署Iterator接口，不能使用for...of但可以使用for...in
    // 因为生成器函数(Generator)返回的是遍历器，可以使用生成器为普通对象部署Iterator
    let myIterable = {
        a:"a",
        b:"b",
        c:"c",
        [Symbol.iterator]: function* () {
            let keys = Object.keys(this);
            for (let key of keys) {
                yield [key, this[key]];
            }
        },
    }


}


/*
 ██████  ███████ ███    ██ ███████ ██████   █████  ████████  ██████  ██████
██       ██      ████   ██ ██      ██   ██ ██   ██    ██    ██    ██ ██   ██
██   ███ █████   ██ ██  ██ █████   ██████  ███████    ██    ██    ██ ██████
██    ██ ██      ██  ██ ██ ██      ██   ██ ██   ██    ██    ██    ██ ██   ██
 ██████  ███████ ██   ████ ███████ ██   ██ ██   ██    ██     ██████  ██   ██
*/
// 生成器
{
    // function关键字与函数名之间有一个星号，紧跟在function关键字后面
    // 执行 Generator 函数会返回一个遍历器对象，也就是说
    // Generator 函数除了是一个状态机，还是一个遍历器对象生成函数
    // Generator 返回遍历器对象，可以依次遍历 Generator 函数内部的每一个状态

    // 调用 Generator 函数后，该函数并不执行，返回的是一个指向内部状态的指针对象
    // 调用next会执行到yield暂停，并返回yield后面的值；再次next继续执行
    function* helloWorldGenerator() {
        yield 'hello';
        yield 'world';
        return 'ending';
    }
    let hw = helloWorldGenerator();
    hw.next(); // { value: 'hello', done: false }
    hw.next(); // { value: 'world', done: false }
    hw.next(); // { value: 'ending', done: true }


    // yield表达式返回值总是为undefined
    // next()函数的参数可以作为上次yield的返回值
    function* f() {
        for (var i = 0; true; i++) {
            // reset == undefined
            var reset = yield i;
            if (reset) {
                i = -1;
            }
        }
    }
    let g = f();
    g.next() // { value: 0, done: false }
    g.next() // { value: 1, done: false }
    // 此时reset == true，i=-1，i++，所以输出0
    g.next(true) // { value: 0, done: false }

    // yield* Generator/Iteratable表示进入后面对象的遍历
    function* foo() {
        yield 'a';
        yield 'b';
    }
    function* bar() {
        yield 'x';
        yield* foo();
        yield 'y';
    }
    // bar的遍历顺序是 x a b y

    let read = (function*() {
        yield 'test';
        // 因为String原生具有遍历器，会一个字符一个字符的返回
        yield* 'hello';
    })();  // test h e l l o
}


/*
 █████  ███████ ██    ██ ███    ██  ██████
██   ██ ██       ██  ██  ████   ██ ██
███████ ███████   ████   ██ ██  ██ ██
██   ██      ██    ██    ██  ██ ██ ██
██   ██ ███████    ██    ██   ████  ██████
*/
{
    // async 就是 Generator 的语法糖
    // * 替换成async   yield替换成await
    // async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。
    // async的改进：
    // 1.内置执行器，不用像Generator一样使用co模块
    // 2.async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）
    // 3.返回值是 Promise。async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖

    // async函数返回一个 Promise 对象，可以使用then方法添加回调函数。
    // 当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

    /*
    const fs = require('fs');
    const readFile = function(fileName) {
        return new Promise(function(resolve, reject) {
            fs.readFile(fileName, function(error, data) {
                if (error) return reject(error);
                resolve(data);
            });
        });
    };
    const asyncReadFile = async function() {
        const f1 = await readFile('./.babelrc');
        const f2 = await readFile('./test.js');
        console.log(f1.toString());
        console.log(f2.toString());
    };
    */


    // async函数return返回的值会被then方法的回调函数接收到
    // async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态，被catch回调函数接收
    /*
    async function getStockPriceByName(name) {
        const symbol = await getStockSymbol(name);
        const stockPrice = await getStockPrice(symbol);
        return stockPrice;
    }
    getStockPriceByName('goog').then(function(result) {
        console.log(result);
    });
    */
}


/*
 ██████ ██       █████  ███████ ███████
██      ██      ██   ██ ██      ██
██      ██      ███████ ███████ ███████
██      ██      ██   ██      ██      ██
 ██████ ███████ ██   ██ ███████ ███████
*/
// 类
{
    // 用于定义私有方法
    const bar = Symbol("bar");
    // 类的声明不存在变量提升，因为要保证子类在父类之后定义
    // 类可以看做是构造函数的另一种书写方式，语法糖
    class Point{
        // 类中的this指的是实例，this.x定义的是实例属性
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // 可以在构造方法中为类内方法绑定this为当前类
            this.toString = this.toString.bind(this);
            // new.target，返回当前 Class，如果子类继承则返回子类Class
            // 可以利用这个特性写出不能实例化的类
            // if(new.target === Point){
            //     throw new Error('本类不能实例化');
            // }

        }
        // ES6规定不能定义静态属性，以下定义会报错
        // xy = 41;
        // 只能在外部使用Point.xy = 41;来定义
        // 糟心啊。。。什么时候能直接定义属性，不用在constructor里定义

        // 类内定义方法不用加function关键字 属于原型对象
        toString() {
            return `(${this.x}, ${this.y})`;
        }
        // 如果是私有方法可以在前面加一个下划线标识，但是仍然可以被外部访问
        _privateFunc() { }
        // 可以使用Symbol来定义私有方法，类作为模块导出时外部就没法访问
        [bar]() { }
        // get set 关键字
        set distence(d){
            this.d = d;
        }
        get distence(){
            return this.d ? this.d : Math.sqrt(this.x**2 + this.y**2);
        }
        // 类中的Generator函数
        // Symbol.iterator返回类的默认遍历器，下面使用Generator修改类的默认遍历器，可以直接用for of遍历
        *[Symbol.iterator]() {
            yield this.x;
            yield this.y;
            // for (let v of new Point(2,3)) {
            //     console.log(v); // 2 3
            // }
        }
        // 静态方法static，可以直接用类调用
        // Point.staticFunc();
        static staticFunc() {
            return "hey";
        }
    }
    // 类的数据类型就是函数
    typeof Point; // function
    // 类本身就指向构造函数
    Point === Point.prototype.constructor; // true
    // 类的方法都定义在prototype对象上面，新方法可以添加在prototype对象上面。
    Point.prototype.fun1 = function() { }
    // Object.assign方法可以很方便地一次向类添加多个方法。
    Object.assign(Point.prototype, {
        func2() { },
        func3() { },
        // 可以在这里定义箭头函数，省去构造函数中的this绑定
        sayhi: () => {console.log("hi");},
    })
    Point.six = 6;
    // 使用new关键字来实例化对象
    let p = new Point(3, 4);
    Point.six;  // 6
    p.six;      // undefined
    p.distence; // 5
    // 建议使用Object.getPrototypeOf(obj)代替__proto__
    p.__proto__ === Object.getPrototypeOf(p); // true
    // 实例的__proto__指向类的原型对象
    p.__proto__ === Point.prototype; // true

    // in 运算符会遍历所有可枚举属性，包括原型链上继承的
    for (var k in p) {
        // hasOwnProperty只检测自身，不检测原型链
        if (p.hasOwnProperty(k)) {
            `${k}`;
            // x y toString
        }
    }
    // 可以写出立即执行的class
    let person = new class {
        constructor(name) {
            this.name = name;
        }
        sayName() {
            console.log(this.name);
        }
    }("张三");
    person.sayName(); // 张三

    // 继承
    class colorPoint extends Point{
        constructor(x, y, color){
            // 子类必须在constructor方法中调用super方法，否则新建实例时会报错
            // 只有调用super之后才能在子类中使用this
            // 因为ES6使用父类的构造函数来塑造this，然后再用子类的构造方法修改this
            super(x, y);
            // super当做函数时代表父类构造函数
            // super当做对象时，在静态方法之中指向父类，在普通方法之中指向父类的原型对象prototype
            this.color = color;
        }
        toString() {
            return `${this.color} ${super.toString()}`;
        }
    }
    let cp = new colorPoint(1,2,"red");
    cp.toString(); // red (1, 2)
    // 继承的内部实现
    // setPrototypeOf内部实现是将第一个参数的__proto__指向第二个参数
    // colorPoint.prototype.__proto__ 表示方法的继承,指向父类的prototype
    Object.setPrototypeOf(colorPoint.prototype, Point.prototype);
    // colorPoint.__proto__ 表示构造函数的继承,指向父类
    Object.setPrototypeOf(colorPoint, Point);
    // 因此
    // 子类的__proto__指向父类
    // Object.getPrototypeOf(colorPoint) === Point; // true
    colorPoint.__proto__ === Point;
    // 子类的原型对象就是独立的原型对象colorPoint{}，原型对象的__proto__指向父类原型对象
    // Object.getPrototypeOf(colorPoint.prototype) === Point.prototype; // true
    colorPoint.prototype.__proto__ === Point.prototype;
    // 类的实例的__proto__指向类的原型对象
    cp.__proto__ === colorPoint.prototype; // true
}

/*
██████  ███████  ██████  ██████  ██████   █████  ████████  ██████  ██████
██   ██ ██      ██      ██    ██ ██   ██ ██   ██    ██    ██    ██ ██   ██
██   ██ █████   ██      ██    ██ ██████  ███████    ██    ██    ██ ██████
██   ██ ██      ██      ██    ██ ██   ██ ██   ██    ██    ██    ██ ██   ██
██████  ███████  ██████  ██████  ██   ██ ██   ██    ██     ██████  ██   ██
*/
// 修饰器
{
    // 修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。
    // 修饰器能在编译阶段运行代码。也就是说，修饰器本质就是编译时执行的函数。
    /*
    @testable
    class MyTestableClass {
        // ...
    }
    function testable(target) {
        // 这是添加的静态属性
        target.isTestable = true;
        // 如果想添加实例属性
        target.prototype.isTest = false;
    }
    MyTestableClass.isTestable; // true
    let t = new MyTestableClass();
    t.isTest; // false
    */

}

/*
███    ███  ██████  ██████  ██    ██ ██      ███████
████  ████ ██    ██ ██   ██ ██    ██ ██      ██
██ ████ ██ ██    ██ ██   ██ ██    ██ ██      █████
██  ██  ██ ██    ██ ██   ██ ██    ██ ██      ██
██      ██  ██████  ██████   ██████  ███████ ███████
*/
// ES6模块
// 见module_export.mjs/module_import.js
{
    // 浏览器对ES6模块的加载

    // 默认情况下浏览器中加载js脚本，遇到<script>标签就会停止渲染，转而下载执行js脚本
    // js执行完毕才会继续渲染页面，可能会导致页面加载时间过长
    // defer属性: 等到DOM结构完全生成，以及其他脚本执行完成，才会执行
    // <script src="path/to/myModule.js" defer></script>
    // async属性: 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染
    // <script src="path/to/myModule.js" async></script>
    // 浏览器中加载ES6模块，type属性要设置为module
    // 对于type为module的标签默认打开defer 异步加载
    // <script type="module" src="./module_export.js">

    // 浏览器还不支持ES6模块，可以用babel进行转码到ES5
    // 或者用es6-module-transpiler转为CommonJS的书写方法
    // 或者使用SystemJS垫片库


    // Node对ES6模块的加载
    // 因为Node有自己的CommonJS模块格式，与ES6模块不兼容
    // ES6模块(export/import 后缀.mjs)与CommonJS(module.exports/require 后缀.js)模块的区别
    // 1.CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用
    // CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
    // ES6 模块import会生成一个只读引用，等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值
    // 2.CommonJS 模块是运行时加载，ES6模块是编译时输出接口

    // 目前，Node 的import命令只支持加载本地模块（file:协议），不支持加载远程模块。加载顺序如下
    // 1.如果模块名不含路径，那么import命令会去node_modules目录寻找这个模块
    // 2.如果模块名包含路径，那么import命令会按照路径去寻找这个名字的脚本文件
    // 3.如果脚本文件省略了后缀名，比如import './foo'，Node 会依次尝试四个后缀名：
    // ./foo.mjs、./foo.js、./foo.json、./foo.node。
    // 4.如果这些脚本文件都不存在，Node 就会去加载./foo/package.json的main字段指定的脚本。
    // 5.如果./foo/package.json不存在或者没有main字段，那么就会依次加载
    // ./foo/index.mjs、./foo/index.js、./foo/index.json、./foo/index.node

    // ES6模块引入CommonJS模块时，直接使用default的格式
    // import defaultM from "./commonjs.js";
    // CommonJS引入ES6模块，使用import()函数
    // const es_namespace = await import('./es6.mjs');




    // CommonJS模块的加载
    // require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象
    /*
    {
        // 模块名
        id: '...',
        // 模块输出的各个接口
        exports: { "..." },
        // 该模块脚本是否执行完毕
        loaded: true,
        // ...
    }
    */
    // 以后用到该模块时就直接到exports属性中取缓存值，这也就是为什么CommonJS输出后不会反映实时情况

    // CommonJS循环加载的情况：a.js执行一半，中间require("b.js")；b.js执行一半又require("a.js")
    // CommonJS模块是执行到require语句才跳到脚本进行加载的，因此过程如下
    // 假设a.js先执行，a执行到一半，去require("b.js")，这时候调到b执行
    // b.js执行到一半发现需要加载a，就去内存中找a的缓存
    // 因为此时a只执行了一半，所以exports属性中只有前一半的输出，后面代码的变化是没有的
    // b取到a的缓存后继续执行，直到b执行完，再把执行权交还给a

    // ES6模块的循环加载: a中import from "b.mjs"; b中import from "a.mjs"
    // ES6模块是引用，加载的变量没有缓存，需要开发者自己保证真正取值的时候能取到值
    // 先执行a，发现需要import from b，于是转去执行b
    // 执行b的时候发现又要import foo from a，发生循环加载，
    // 这时引擎会默认foo接口已经存在了(开发者自己保证，多利用变量/函数提升在import之前)
    // 继续b往下执行，下面用到foo时如果发现没定义就会报错，否则执行完返回a继续执行
    // http://es6.ruanyifeng.com/#docs/module-loader#Node-%E5%8A%A0%E8%BD%BD
}


/*
███████ ███████ ██      ██ ███    ██ ████████
██      ██      ██      ██ ████   ██    ██
█████   ███████ ██      ██ ██ ██  ██    ██
██           ██ ██      ██ ██  ██ ██    ██
███████ ███████ ███████ ██ ██   ████    ██
*/
// 编程风格
{
    // let取代var

    // let和const之间，优先选用const，尤其是在全局环境
    // const提醒这是不能改变的值
    // const符合函数式编程思想，运算不改变值，只是新建值
    // 编译器会对const进行优化

    // 静态字符串一律使用单引号'foo'或反引号`foo`
    // 动态字符串使用反引号`${foo}`

    // 使用数组成员对变量赋值时优先使用解构赋值
    // const arr = [1, 2, 3];
    // const [a, b] = arr;
    // 函数参数如果是对象成员，优先使用解构赋值
    // function best({first, second}) {}
    // 如果函数返回多个值，优先使用对象返回，对象解构赋值接收；不推荐数组，便于以后更改顺序等
    // function processInput(input) {
    //     return {first, second, third};
    // }
    // const {third, second} = processInput(input);

    // 单行定义的对象，最后不以逗号结尾；多行定义的对象，最后以逗号结尾
    // 对象尽量静态化，避免动态添加属性，非要添加，使用Object.assign(target, source);
    // 定义时尽量使用简洁表达法（直接使用变量，不带冒号）

    // 使用...运算符拷贝数组(浅拷贝，成员是引用)
    // 使用Array.from()将类数组转换为数组

    // 需要使用函数表达式的场合，尽量用箭头函数代替。因为这样更简洁，而且绑定了this。
    // 箭头函数取代Function.prototype.bind，不应再用 self/_this/that 绑定 this
    // 简单的、单行的、不会复用的函数，建议采用箭头函数。如果函数复杂，还是应该采用传统的函数写法
    // 函数的配置项参数应该集中放在一个对象里，作为最后一个参数；布尔值不可以直接作为参数
    // function divide(a, b, { option = false } = {}) { }
    // 使用...args代替arguments，因为...显示表明想获取参数且提供数组，而arguments是类数组的对象

    // 总是使用class取代需要prototype的操作
    // 使用extends进行继承

    // Module语法是js的标准语法，使用import/export代替require/module.exports
    // 如果模块只有一个输出值，使用export default；有多个输出值，使用export
    // export default不要与export同时使用
    // 如果默认输出一个函数，首字母小写；默认输出一个对象，首字母大写
}


/*
 █████  ██████  ██████   █████  ██    ██ ██████  ██    ██ ███████ ███████ ███████ ██████
██   ██ ██   ██ ██   ██ ██   ██  ██  ██  ██   ██ ██    ██ ██      ██      ██      ██   ██
███████ ██████  ██████  ███████   ████   ██████  ██    ██ █████   █████   █████   ██████
██   ██ ██   ██ ██   ██ ██   ██    ██    ██   ██ ██    ██ ██      ██      ██      ██   ██
██   ██ ██   ██ ██   ██ ██   ██    ██    ██████   ██████  ██      ██      ███████ ██   ██
*/
// ArrayBuffer(length字节)
{
    // ArrayBuffer提供直接操作连续内存的途径
    // ArrayBuffer本身不能直接操作内存，需要通过在其上建立“视图”
    // 同一段内存，不同数据有不同的解读方式，这就叫做“视图”（view）
    // 视图就是如何看待、解析这一片内存，是8位无符号整数还是32位浮点等
    // TypedArray视图，包括九种类型
    // DataView视图，可以自定义复合格式的视图，比如第一个字节是 Uint8，第二、三个字节是 Int16

    // 申请16字节的连续内存
    const buffer = new ArrayBuffer(16);
    // 在其上建立视图（可以在一个ArrayBuffer上建立多个视图，但是操作的都是同一片内存）
    const x1 = new Int16Array(buffer); // 一个元素占16位两个字节，x1.length === 8
    x1[0] = 1;
    x1[1] = 4;
    const x2 = new Uint8Array(buffer); // 一个元素占8位一个字节，x1.length === 16
    x2[5] = 2;
    x2; // Uint8Array [ 1, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    x1; // Int16Array [ 1, 4, 512, 0, 0, 0, 0, 0 ]
    // 为什么是512，x86体系是小端字节序，即小的数存在前面
    // 第五第六字节表示一个数，存的是0 2，由于是小端字节序，2表示高位，转为2进制就是10 00000000，即512

    // TypedArray很像普通数组，所有数组方法都可以用
    x1.buffer; // 返回视图对应的ArrayBuffer


    // DataView视图的设计目的，是用来处理网络设备传来的数据
    // 大端字节序或小端字节序是可以自行设定的
    // 默认情况下，DataView的get系列方法使用大端字节序解读数据
    // 如果需要使用小端字节序解读，必须在get方法的第二个参数指定true
    const dv = new DataView(buffer); // 内存字节 [ 1, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    dv.getUint16(0); // 1 0默认大端序读出来是 256
    // set系列方法，第一个参数指定开始写入的字节序号，第二个参数为写入的数据
    // 第三个参数可选，指定大小端序，默认大端序，true为小端序
    dv.setUint16(0, 512); // 内存字节 [ 2, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]



    // Web Worker
    // 主线程与用户交互，worker线程进行运算。他们之间通过postMessage/onmessage交互
    // 这种数据交互是通过复制实现的，如果有大量数据非常耗时
    // SharedArrayBuffer开辟一片共享内存，时间数据的快速交互
    /*
    // 主线程
    // 新建 1KB 共享内存
    const sharedBuffer = new SharedArrayBuffer(1024);
    // 主线程将共享内存的地址发送出去
    w.postMessage(sharedBuffer);
    // 在共享内存上建立视图，供写入数据
    const sharedArray = new Int32Array(sharedBuffer);

    // Worker 线程
    onmessage = function(ev) {
        // 主线程共享的数据，就是 1KB 的共享内存
        const sharedBuffer = ev.data;
        // 在共享内存上建立视图，方便读写
        const sharedArray = new Int32Array(sharedBuffer);
        // ...
    };
    */

    // 线程间的同步互斥机制可以通过Atomics对象实现
    // Atomics对象的各个方法保证了操作的原子性
    // Atomics.load(sharedArray, index)
    // Atomics.store(sharedArray, index, value)
    // Atomics.add(sharedArray, index, value)
    // Atomics.sub(sharedArray, index, value)
    // Atomics.and(sharedArray, index, value)
    // Atomics.or(sharedArray, index, value)
    // Atomics.xor(sharedArray, index, value)

    // wait wake相当于锁操作
    // 当sharedArray[index] === value时进入休眠,被wake或者time时间后唤醒
    // wake唤醒返回ok，time后自动唤醒返回time-out；不等于value直接返回not-equal不会进入休眠
    // Atomics.wait(sharedArray, index, value, time)
    // 唤醒等待在sharedArray[index]上的count个线程
    // Atomics.wake(sharedArray, index, count)


}
