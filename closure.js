
/*
████████ ██   ██ ██ ███████
   ██    ██   ██ ██ ██
   ██    ███████ ██ ███████
   ██    ██   ██ ██      ██
   ██    ██   ██ ██ ███████
*/
// 每个函数都有自己的 excution context，和 variable object。
// 这些环境用于储存上下文中的变量，函数声明，参数等。
// 只有函数才能制造作用域。for if else 不能创造作用域。
// 本质上来说，this 是一个指向函数执行环境的指针
// this 永远指向最后调用它的对象，并且在执行时才能获取值，定义时无法确认他的值。
let a = {
	name: "A",
	fn: function () {
		console.log(this.name);
	}
};
// a 调用了fn() 所以此时this为a
a.fn(); // this === a
// 使用 apply() 将 this 的值指定为 {name:"B"}
a.fn.apply({name : "B"}); // this === {name : "B"}
// 调用是由 window/global 调用，所以this 为 window/global
let fn1 = a.fn;
fn1(); // this === window || global


function Student(name, age) {
	this.name = name; // this === s
	this.age = age; // this === s
	// return this
}
let s = new Student("wtl", 30);
// new 首先会创建一个空对象，然后调用 apply 将 this 绑定到这个空对象，再执行构造函数


let name = "小明" , age = "17";
let obj = {
	name: "安妮",
	// 赋值立即执行，因为 this 在执行时绑定，所以现在 this 为全局作用域，所以 objAge == 17
	objAge: this.age,
	fun: function() {
		// 此处的 this 在执行 fun() 时才会绑定
		console.log(this.name + "今年" + this.age)
	}
};
console.log(obj.objAge); // 17
// 此时 this 绑定到 obj， 而 obj.age === undefined
obj.fun(); // 安妮今年undefined


/*
 ██████ ██       ██████  ███████ ██    ██ ██████  ███████
██      ██      ██    ██ ██      ██    ██ ██   ██ ██
██      ██      ██    ██ ███████ ██    ██ ██████  █████
██      ██      ██    ██      ██ ██    ██ ██   ██ ██
 ██████ ███████  ██████  ███████  ██████  ██   ██ ███████
*/
// 自我调用函数只执行一次。设置计数器为 0。并返回函数表达式"function () { return counter += 1; }"给add。
// add变量可以作为一个函数使用。非常棒的部分是它可以访问函数上一层作用域的计数器。
// 这个叫作 JavaScript 闭包。它使得函数拥有私有变量变成可能。
// 计数器受匿名函数的作用域保护，只能通过 add 方法修改。
// 闭包是可访问上一层函数作用域里变量的函数，即便上一层函数已经关闭。
let add = (function() {
	let counter = 0;
	return function() {
		counter += 1;
		console.log(counter);
	}
})();
add(); // 1
add(); // 2
add(); // 3
// 只要 add 不指向 null ，counter 就会一直存在于内存

// 闭包可以对变量进行封装，避免变量重名带来的冲突
// 例如有一个变量cache，只有在一个特定函数内部访问，那就可以利用闭包将其作用域限制在函数内
// 匿名自调用函数，里面定义需要封装的变量，然后返回函数的主体
// 下面这个函数返回连乘结果
let mult = (function() {
	// cache为函数内部变量，用作缓存
	// 键为数字拼成的字符串，值为结果
	let cache = {};
	// 返回函数主体
	return function(...args) {
		var key = args.join(',');
		if (cache[key]) {
			return cache[key];
		} else {
			var res = 1;
			for (var i = 0, len = args.length; i < len; i++) {
				res = res * args[i];
			}
			cache[key] = res;
			return res;
		}
	};
})();
console.log(mult(1, 2, 3, 4));

console.log(
	Object.prototype.toString.call([1, 2, 3])
);
