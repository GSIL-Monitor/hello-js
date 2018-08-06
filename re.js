// 静态创建 /re/;
// 动态创建 new RegExp("re", "gimu");

// 修饰符
// g global，全局匹配多次
// i ignoreCase，忽略大小写
// m multiline，匹配多行
// u ES6 . \S可以匹配4字节unicode
// y ES6 sticky粘连匹配，与g类似，都是从lastIndex往后匹配
// 但是g只要后面存在即可匹配，y确保匹配必须从lastIndex后第一个字符开始就要匹配
// 实际上y就是加了头部匹配标志^的g
// s ES6 使通配符.可以匹配任何字符 包括换行\n、回车\r

var reg = /a/gimy;
// re对象具有属性
reg.global;     // true
reg.ignoreCase; // true
reg.multiline;  // true
reg.sticky;     // true
// 原正则表达式
reg.source;  // a
// 下一次exec开始匹配的索引，初始是0
reg.lastIndex;

// ^开头  $结束
var patUrl = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
var url = 'http://www.dataguru.com:80/lession/sss?userid=123#fragment';
// exec函数，执行一次匹配一个，返回一个数组，并且将重设lastIndex
// 数组的0号元素是整个正则表达式匹配的字符串，1-n号元素是匹配的分组
// exec可以多次执行，每次从lastIndex开始匹配
var res = patUrl.exec(url);
/*
[ 'http://www.dataguru.com:80/lession/sss?userid=123#fragment',
  'http',
  '//',
  'www.dataguru.com',
  '80',
  'lession/sss',
  'userid=123',
  'fragment',
  index: 0,
  input: 'http://www.dataguru.com:80/lession/sss?userid=123#fragment' ]
*/


// test方法，返回true或false
patUrl.test(url); // true

// ()是一个分组，分组序号从1开始，按照左括号出现的顺序排序
// (?:)前面加上?:表示非捕获分组，正常进行匹配，但匹配字符串不会出现在结果数组中
// 量词  ? 零次或一次   * 零次或多次   + 一次或多次   {m,n} m到n次
// 默认情况下，尽量多的匹配，如果量词后面加?，则是非贪婪匹配，匹配尽可能少的。(例外情况：?量词默认匹配0次)
// ()? 后面?表示此分组可以出现0次或1次，即这个分组是可选的
// reg1有两个分组，都会出现在结果数组中；reg2第一个分组不会出现在结果中
var reg1 = /(([A-Za-z]+):)?/;
var reg2 = /(?:([A-Za-z]+):)?/;
reg1.exec('http:xxx:'); //["http:", "http:", "http"]
reg2.exec('http:xxx:'); //["http:", "http"]

// 如果一个分组后面带有* +等可能匹配到多次，结果数组中只会保留最后一次匹配的分组
var reg3 = /([A-Za-z]+:)+/;
// 就一个分组，但这个分组匹配了两次http:和xxx:最后分组1会记录xxx:
reg3.exec('http:xxx:'); //["http:xxx:", "xxx:"]

// [^?#]表示除了问号和井号都匹配
// 下面的re会匹配 以斜杠开头，后面跟任意字符包括斜杠，直到碰到?或#结束
// 其中第一个分组是非捕获分组，不会出现在分组结果中
var reg4 = /(?:\/([^?#]*))/;
reg4.exec('www.wtl.cn/personal/sss?a=6');  // [ '/personal/sss', 'personal/sss' ]


//正则表达式转义
/*
   \f 换页符
   \n 换行符
   \r 回车
   \t 制表符
   \b 指定一个字边界，方便用于对文本字边界进行匹配  /\bt/会匹配'%&_tes'中的t
   \d 表示数字，等同于[0-9] \D表示相反 [^0-9]
   \s  等同于[\f\n\r\t\u000B\u0020\u00A0\u2028\u2029] 这是Unicode空白符的一个不完全子集。\S 则表示与其相反：[^\f\n\r\t\u000B\u0020\u00A0\u2028\u2029]
   \w [0-9A-Z_a-z]  \W相反 [^0-9A-Z_a-z]
    [A-Za-z\u00C0-\u1FFF\u2800-\uFFFD],包括了所有的Unicode字母，但也包括成千上万非字母的字符

   \1 是指向分组1所捕获到的文本的一个引用，所以能再次被匹配，\2指向分组2的引用，\3以此类推
*/
var reg5 = /(\w+)\s+\1/g;
console.log(reg5.exec('hello hello'));  // [ 'hello hello', 'hello' ]

var reg6 = /\w、/;
console.log(reg6.exec('asf可是、hi、'));  // [ 'i、' ]

var reg7 = /\bt/;
console.log(reg7.exec("123.tes")); // [ 't' ]


// match返回存放匹配结果的数组。该数组的内容依赖于 regexp 是否具有全局标志 g。
// stringObject.match(searchvalue)
// stringObject.match(regexp)
// "helloworld".match(/l/g) // ["l", "l", "l"]


// search会忽略g标志，并且永远从头开始搜索，返回第一个匹配的index
// stringObject.search(regexp)
// "helloworld".search(/l/)  // 2


// replace返回替换后的新字符串，有g标志会替换所有，没有g则替换第一个
// stringObject.replace(regexp/substr,replacement)
