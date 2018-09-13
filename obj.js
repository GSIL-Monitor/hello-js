// jshint esversion:6
let person = {
	'name': 'nn',
	'age': 18,
};

// 获取对象属性值，使用||来提供默认值，就不会返回undefined了
let gender = person.gender || 'DK'; // DK
// person.family是undefined，访问其属性会报错，可以使用&&来避免报错
let s = person.family && person.family.son; // undefined

// 对象赋值是引用，x和person指向同一片内存
let x = person; // {'name':'nn', 'age':18,};
// js中的对象不会被复制，只会被引用，修改person的属性会影响x
person.name = 'wtl';
x.name; // wtl


// 通过prototype原型对象进行继承
// 构造函数 自带一个同名的原型对象Person{} 使用this添加实例属性、实例方法
function Person(name, age) {
	// 使用this是定义在实例上的，每个实例拥有自己的
	this.name = name || "wuming";
	this.age = 18;
}
// 定义在原型对象上的属性，所有实例共享
Person.prototype.gender = "DK";
Person.prototype.race = "DK";
// 定义在原型对象上的方法，所有实例共享
Person.prototype.sayName = function() {
	console.log(`I'm ${this.name}`);
};


// 利用构造函数新建实例对象
let tom = new Person("tom"); // Person { name: 'tom', age: 18 }
// prototype与__proto__:
// 生产环境中不推荐用__proto__ 推荐使用Object.getPrototypeOf(obj)
// js中万物皆对象，所有对象都有__proto__，它指向该对象的构造函数的原型对象(prototype)，用于构成原型链
// person直接由Object构造来，所以
person.__proto__ === Object.prototype; // true
// 函数(Function)是一种特殊的对象，他不仅有__proto__，还有一个特殊指针prototype，指向一个对象
// 这个特殊的对象叫这个函数的原型对象，用于实现基于原型的继承与属性共享，原型对象规定了所有实例共享的属性和方法
// Object也是函数，因此其__proto__也指向Function.prototype
Person.__proto__ === Function.prototype; // true
Function.__proto__ === Function.prototype; // true
Object.__proto__ === Function.prototype; // true
// 函数的原型对象就是一个普通对象，因此其__proto__指向Object.prototype 这是原型链的最顶端
Function.prototype.__proto__ === Object.prototype; // true
// tom由Person构造来，因此其__proto__指向Person的原型对象
tom.__proto__ === Person.prototype; // true
// 原型对象有一个constructor属性，指回构造方法
Person.prototype.constructor = Person; // true
// 可以参照proto.jpg理解


// 原型链在更新值时是不起作用的，只有在检索值的时候才会起作用
// 尝试获取某个对象的属性时，如果该对象没有该属性(通过this定义)，则会查找其原型对象(Person.prototype)中的属性
// 如果原型对象也没有该属性，则继续顺着原型链找(Person.prototype.__proto__)，直到终点Object.prototype
// 如果完全不存在于原型链中，则返回undefined
Person.prototype.wen = '111';
Object.prototype.wen = '222';
// tom本身没有this.wen，所以查找tom.__proto__即Person.prototype，找到了111
// 如果还没有，则继续查找tom.__proto__.__proto__即Person.prototype.__proto__即Object.prototype
console.log(tom.wen); // '111'

// 这里首先获取tom.gender，因为自身没有定义，所以到prototype去找
tom.gender; // DK
// 在tom中定义gender,相当于在构造函数中用this定义
tom.gender = "男";
// 再查找gender时，直接在自身就找到了，不用访问prototype
// 因此实例对象的gender为男
tom.gender; // 男
// 原型对象中的gender仍然是DK
Person.prototype.gender; // DK


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
