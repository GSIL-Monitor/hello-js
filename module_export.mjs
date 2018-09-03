// jshint esversion:6
// ES6模块设计尽量静态化，在编译阶段执行
// 模块中顶层this为undefined，无意义

let firstName = "wen";
let lastName = "dabei";

function sayName() {
    console.log(`I'm ${firstName} ${lastName}`);
}

export {
    firstName,
    lastName,
    sayName,
    // 可以使用as更换名字
    // sayName as myName,
}

// import时需要知道模块输出的变量名是什么，很不方便
// 用户未必愿意阅读文档去了解模块有哪些属性和方法。
// 用export default命令，为模块指定默认输出。
// 一个模块只能有一个默认输出，因此export default命令只能使用一次
// import命令后面不用加大括号，因为只可能唯一对应export default命令
let obj = {
    firstName,
    lastName,
    sayName,
};
export default obj;
