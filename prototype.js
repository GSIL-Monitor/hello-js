/*
███    ██ ███████ ██     ██
████   ██ ██      ██     ██
██ ██  ██ █████   ██  █  ██
██  ██ ██ ██      ██ ███ ██
██   ████ ███████  ███ ███
*/

function Student(name, age) {
	// 构造函数中的 this 指向 new 出来的实例对象
	this.name = name; // this === s
	this.age = age; // this === s
}
Student.prototype = {
	// 使用new时，默认会在prototype中添加constructor来指向构造函数
	// 我们这里重新给prototype赋值一个新的对象，原有的constructor就没了，所以可以手动赋值
	// 如果不想覆盖掉prototype中原有的东西，就要使用Student.prototype.study = function() {} 这种形式赋值
	constructor: Student,
	type: 'student',
	study: function() {
		console.log('studing');
	}
}
let s = new Student("wtl", 22);
// new 是一个语法糖，具体执行如下
// 1.创建一个新对象，作为返回的对象实例
// var tempObj = {}
// 2.__proto__指向构造函数的prototype
// tempObj.__proto__ = Student.prototype
// 3.执行构造函数
// tempObj.name = name
// tempObj.age = age
// 4.返回对象实例
// return tempObj


/*
██████  ██████   ██████  ████████  ██████  ████████ ██    ██ ██████  ███████
██   ██ ██   ██ ██    ██    ██    ██    ██    ██     ██  ██  ██   ██ ██
██████  ██████  ██    ██    ██    ██    ██    ██      ████   ██████  █████
██      ██   ██ ██    ██    ██    ██    ██    ██       ██    ██      ██
██      ██   ██  ██████     ██     ██████     ██       ██    ██      ███████
*/
// 万物皆对象，对象都有__proto__，指向构造该对象的构造函数的prototype，用来构成原型链
// 构造函数，函数是特殊的对象，额外拥有prototype原型对象
// prototype 用于实现基于原型的继承与属性共享，规定了所有实例共享的属性和方法
function Person(name, age) {
	// 函数中的 this 指向 new 出来的实例对象
	this.name = name || "wuming";
	this.age = age || 18;
}
// 使用以下方法向prototype中添加属性和函数，不会破坏constructor
Person.prototype.gender = "DK";
Person.prototype.race = "DK";
Person.prototype.sayName = function() {
	console.log(`I'm ${this.name}`);
};

// 利用构造函数新建实例对象
let tom = new Person("tom"); // Person { name: 'tom', age: 18 }

// prototype与__proto__:
// 生产环境中不推荐用__proto__ 推荐使用Object.getPrototypeOf(obj)

const obj = {}
// obj直接由Object构造来，所以
obj.__proto__ === Object.prototype

// Object跟Person一样，都是构造函数，因此__proto__指向Function.prototype
Person.__proto__ === Function.prototype
Function.__proto__ === Function.prototype
Object.__proto__ === Function.prototype
// 函数的原型对象就是一个普通对象，因此其__proto__指向Object.prototype 这是原型链的最顶端
Function.prototype.__proto__ === Object.prototype
// tom由Person构造来，因此其__proto__指向Person的原型对象
tom.__proto__ === Person.prototype
// 原型对象有一个constructor属性，指回构造方法
Person.prototype.constructor = Person
// 可以参照proto.jpg理解


// 原型链在更新值时是不起作用的，只有在检索值的时候才会起作用
// 尝试获取某个对象的属性时，如果该对象没有该属性(通过this定义)，则会查找其原型对象(Person.prototype)中的属性
// 如果原型对象也没有该属性，则继续顺着原型链找(Person.prototype.__proto__)，直到终点Object.prototype
// 如果完全不存在于原型链中，则返回undefined
Person.prototype.wen = '111'
Object.prototype.wen = '222'
// tom本身没有this.wen，所以查找tom.__proto__即Person.prototype，找到了111
// 如果还没有，则继续查找tom.__proto__.__proto__即Person.prototype.__proto__即Object.prototype
console.log(tom.wen) // '111'

// 在tom中定义gender，属于实例属性，不影响原型链上的
tom.gender = "男"
// 再查找gender时，直接在自身就找到了，不用访问原型链
// 因此实例对象的gender为男
// 原型对象中的gender仍然是DK
tom.__proto__.gender // DK


// 直接输出，不包括原型链中的内容
console.log(tom); // Person { name: 'tom', age: 18, gender: '男' }
// typeof可以用来检查属性是否存在
typeof tom.xxx === "undefined"; // true
// hasOwnProperty只检查当前对象(通过this定义) 不会检查原型链
tom.hasOwnProperty("gender"); // true 因为前面通过tom.gender定义了
tom.hasOwnProperty("race"); // false

// for in 遍历对象，in操作符会查找原型链
for (let k in tom) {
	console.log(`${k}: ${tom[k]}`);
	/*
	name: tom
	age: 18
	gender: 男
	race: DK
	sayName: function() {
	    console.log(`I'm ${this.name}`);
	}
	wen: 111
	*/
}






// 实现多态:同一个操作作用于不同对象，得到不同的执行方式和结果
// 将“做什么” 和 “谁来做、怎么做” 分开
var shout = function(animal) {
	animal.shout();
};
var Duck = function() {};
Duck.prototype.shout = function() {
	console.log('gagaga');
};
var Chicken = function() {};
Chicken.prototype.shout = function() {
	console.log('jijiji');
};

shout(new Duck()); // gagaga
shout(new Chicken()); // jijiji
