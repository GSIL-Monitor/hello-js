// 静态创建 /re/;
// 动态创建 new RegExp("re");

// 修饰符
// g global，全局匹配多次
// i ignoreCase，忽略大小写
// m multiline，匹配多行
var reg = /a/gim;
// re对象具有属性
console.log("global:"+reg.global);
console.log("ignoreCase:"+reg.ignoreCase);
console.log("multiline:"+reg.multiline);
// 正则表达式
console.log("source:"+reg.source);
// 下一次exec开始匹配的索引，初始是0
console.log("lastIndex:"+reg.lastIndex);

// ^开头  $结束
var patUrl = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
var url = 'http://www.dataguru.com:80/lession/sss?q#fragment';
// exec函数，执行一次匹配一个，返回一个数组，并且将重设lastIndex
// 数组的0号元素是匹配的字符串，1-n号元素是匹配的分组
// exec可以多次执行，每次从lastIndex开始匹配
var res = patUrl.exec(url);
console.log(res);

// test方法，返回true或false
console.log(patUrl.test(url));

// ()是一个分组，分组序号从1开始，按照左括号出现的顺序排序
// (?:)前面加上?:表示非捕获分组，正常进行匹配，但匹配字符串不会出现在结果数组中
// 量词  ?：零次或一次   *：零次或多次   +：一次或多次   {m,n}：m到n次
// 默认情况下，尽量多的匹配，如果量词后面加?，则是非贪婪匹配，匹配尽可能少的。(例外情况：?量词默认匹配0次)
// ()? 后面?表示此分组可以出现0次或1次，即这个分组是可选的
// reg1有两个分组，都会出现在结果数组中；reg2第一个分组不会出现在结果中
var reg1 = /(([A-Za-z]+):)?/;
var reg2 = /(?:([A-Za-z]+):)?/;
console.log("reg1:");
console.log(reg1.exec('http:xxx:')); //["http:", "http:", "http"]
console.log("reg2:");
console.log(reg2.exec('http:xxx:')); //["http:", "http"]

// 如果匹配到多次，结果数组中只会保留最后一次匹配的字符串
var reg3 = /(([A-Za-z]+):)+/;
console.log("reg3:");
console.log(reg3.exec('http:xxx:')); //["http:xxx:", "xxx:", "xxx"]

// [^?#]表示除了问号和井号都匹配，下面的分组会匹配：以斜杠开头，后面跟任意字符包括斜杠，直到碰到?或#结束
var reg4 = /(?:\/([^?#]*))/;
console.log("reg4:");
console.log(reg4.exec('www.wtl.cn/personal/sss?a=6'));

//正则表达式转义
/*
   \f 换页符
   \n 换行符
   \r 回车
   \t 制表符
   \b 不是退格符  \b 被指定一个字边界，方便用于对文本字边界进行匹配
   \d 表示数字，等同于[0-9] \D表示相反 [^0-9]
   \s  等同于[\f\n\r\t\u000B\u0020\u00A0\u2028\u2029] 这是Unicode空白符的一个不完全子集。\S 则表示与其相反：[^\f\n\r\t\u000B\u0020\u00A0\u2028\u2029]
   \w [0-9A-Z_a-z]  \W相反 [^0-9A-Z_a-z]
    [A-Za-z\u00C0-\u1FFF\u2800-\uFFFD],包括了所有的Unicode字母，但也包括成千上万非字母的字符
  
   \1 是指向分组1所捕获到的文本的一个引用，所以能再次被匹配，\2指向分组2的引用，\3以此类推
*/
var reg5 = /(\w+)\s+\1/g;
console.log(reg5.exec('hello hello'));

var reg6 = /\w、/;
console.log(reg6.exec('asf可是、hi、'));


