{
    let x= 1;
    let y=1.0;
    x==y; //true
    typeof x == typeof y; //true
    typeof NaN; // number
    NaN==NaN; //false
    'NaN'==NaN; //false
    isNaN('NaN'); //true
}


{
    /*
     字符串是不可变的，一旦字符串被创建，就永远无法改变它
     可以通过“+”来连接字符串，生成一个新的字符串
     两个字符串包含着完全相同的字符且字符顺序相同，则认为这两个字符串相同
    */
    //字符串有一些方法
    "helloworld".charAt(1);// e
    "helloworld".charCodeAt(1)   // 十进制的unicode 101，只能识别16位2字节存储格式
    "𠮷".codePointAt(0);    // 十进制的unicode 134071，可以识别32位4字节存储格式 ES6
    String.fromCharCode(101); // unicode转字符 e，只能识别16位2字节存储格式
    String.fromCodePoint(134071); // unicode转字符 𠮷，，可以识别32位4字节存储格式 ES6
    "hello".concat(' ','world')  // hello world
    "helloworld".indexOf('o', 1) // 4
    "helloworld".lastIndexOf('world',10) //5
    "helloworld".match(/l/)  //["l"]
    "helloworld".match(/l/g) // ["l", "l", "l"]
    "helloworld".replace('w','g') ; //hellogorld
    "helloworld".search(/l/)  // 2
    "helloworld".search(/l?o/) //3
    "helloworld".slice(2,5) // llo
    "hello,world".split(',',2) ;  //["hello", "world"]
    "hello,world".split(',',1) ;  //["hello"]
    "helloworld".substring(2,5) //llo
    // ES6补充
    "hello".repeat(2); // hellohello
    "helloworld".includes("llo")  // true
    "helloworld".startsWith("llo", 2) // true
    "helloworld".endsWith("d", 1) // true
    "07-12".padStart(10, 'YYYY-MM-DD'); // 左边补全10长度 "YYYY-07-12"
    "2018".padEnd(10, 'YYYY-MM-DD'); // 左边补全10长度 "2018-MM-DD"
}


{
    //数组的若干方法
    let arr = 'helloworld'.split('');
    arr.indexOf('h'); //0
    arr.slice(2,5); //["l", "l", "o"]
    arr.push(' who'); //["h", "e", "l", "l", "o", "w", "o", "r", "l", "d", " who"]
    arr.pop();//" who" ["h", "e", "l", "l", "o", "w", "o", "r", "l", "d"]
    arr.unshift('t','g');  //["t", "g", "h", "e", "l", "l", "o", "w", "o", "r", "l", "d"]
    arr.shift(); //"t"   ["g", "h", "e", "l", "l", "o", "w", "o", "r", "l", "d"]
    arr.sort();  //["d", "e", "g", "h", "l", "l", "l", "o", "o", "r", "w"]
}




/*
███████ ███████  ██████
██      ██      ██
█████   ███████ ███████
██           ██ ██    ██
███████ ███████  ██████
*/


/*
(param) => {
    "code"
}

相当于

function(param) {
    "code"
}
*/

/*
var 声明的是全局变量，并且执行时会将声明提前，赋值不提前
var 声明的全局变量属于顶层变量（浏览器:window， node:global）
var a=1;
global.a; // 1

let 声明的变量与当前作用域绑定，声明不会提前
let 不允许在相同作用域内重复声明变量
let 作用域内声明的变量，在声明前是不可用的，即便外层有同名的全局var变量

const 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。
const 特性与let相同
let const 声明的全局变量不属于顶层变量
*/


{
    // 数组的解构赋值
    // 按照位置的对应关系进行解构赋值，解构不成功则等于undefined
    // ...y表示将尾部的所有元素作为数组赋值给y ...y后面不允许有别的变量
    let [x, , ...y] = [1, 2, 3, 4, 5];
    console.log(y);
    // x  1
    // 2 被跳过
    // y  [3, 4, 5]

    // 默认值，生效条件是严格等于undefined
    let [head = "a", tail = "b"] = [1];
    console.log(`${head} ${tail}`);
    // head 1
    // tail b


    // 对象的解构赋值
    // 按照对象中键名来解构，不按顺序
    let {foo : bar} = {foo : "aaa", bar : "bbb"};
    // 意思是将右边键名为foo的值赋给左边的bar，所以bar的值为aaa
    console.log(bar);
    // 然而左边的foo只是用作模式匹配，所以error: foo is not defined，这条语句只声明了bar一个变量
    // 也可以指定默认值 {foo = "abc"} = {foo: undefined}


    // 字符串的解构
    let [a,b,c,d,e] = "hello";
    console.log(a); // h
    let {length : len} = "hello";
    console.log(len); // 5


    // 用途

    // 1.交换值
    [x, y] = [y, x];
    console.log(x);

    // 2.函数返回多个值
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

    // 4.提取json数据

    // 5.遍历map
    const map = new Map();
    map.set('first', 'hello');
    map.set('second', 'world');
    // for iterator of 遍历对象
    for (let [key, value] of map) {
        console.log(`${key} is ${value}`);
    }
    // first is hello
    // second is world

    // 6.加载模块的指定方法
    // const { SourceMapConsumer, SourceNode } = require("source-map");

}
