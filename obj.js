
var person = {
    'name':'nn',
    'age':18
};

// 获取对象属性值，使用||来提供默认值，就不会返回undefined了
var gender = person.gender || 'DK';
console.log(gender);
// 如果访问undefined的属性会报错，可以使用&&来避免报错
var son = person.family && person.family.son;
console.log(son);

// 对象赋值是复制还是引用？
var x = person;
x.name = 'wtl';
// js中的对象不会被复制，只会被引用，x与person是等价的
console.log("对象引用 : " + person.name);


// 通过prototype进行继承
// 要继承一个对象的属性，需要将其作为一个函数的原型来实现
// 首先要有构造函数
var Person = function(name) {
    this.name = name;
}
// 将该函数的原型设定为person
Person.prototype = person;
// Person.prototype.constructor = Person;
// 利用构造函数新建对象
anotherPerson = new Person("ttt");
// 修改父亲的属性（儿子没有定义过或修改过的属性）会影响儿子的值
person.gender = '男';
console.log("anotherPerson.gender : " + anotherPerson.gender);
// 修改儿子的值不会影响父亲的值
// 但是这么做以后，anotherPerson就拥有了age属性，再修改person的age属性就不会影响到anotherPerson的age
anotherPerson.age = 19;
console.log("anotherPerson.age : " + anotherPerson.age);
console.log("person.age : " + person.age);
// 这是原型链造成的结果，原型链在更新值时是不起作用的，只有在检索值的时候才会起作用
// 尝试获取某个对象的属性时，如果该对象没有该属性，则会查找其原型对象中的属性
// 如果原型对象也没有该属性，则继续顺着原型链找，直到终点Object.prototype
// 如果完全不存在于原型链中，则返回undefined

// 直接输出，不包括原型链中的内容
console.log(anotherPerson);
console.log(person);

// typeof可以用来检查属性是否存在
console.log(typeof person.xxx === "undefined");
// hasOwnProperty只检查当前对象不会检查原型链
console.log(anotherPerson.hasOwnProperty("name"));
console.log(anotherPerson.hasOwnProperty("gender"));

// for in 遍历对象，in操作符会查找原型链
console.log("遍历anotherPerson : ");
for(k in anotherPerson){
    console.log(k + ":" + anotherPerson[k]);
}


// prototype与__proto__
// js中万物皆对象，所有对象都有__proto__，它指向该对象的构造函数的原型对象(prototype)，用于构成原型链
// Function是一种特殊的对象，他不仅有__proto__，还有一个特殊指针prototype，指向一个对象
// 这个特殊的对象叫这个函数的原型对象，用于实现基于原型的继承与属性共享
// 原型对象规定了所有实例共享的属性和方法，原型对象有一个constructor属性，指回构造方法
// 可以参照proto.jpg理解

// anotherPerson是一个普通对象，他只有__proto__，指向其构造函数Person的prototype
console.log("anotherPerson.__proto__ : ");
console.log(anotherPerson.__proto__);
console.log(anotherPerson.__proto__ === Person.prototype);
// anotherPerson不是函数，不具有prototype属性
console.log("anotherPerson.prototype : ");
console.log(anotherPerson.prototype);
// Person有__proto__也有prototype
// Person的__proto__指向Function的prototype
console.log("Person.__proto__ === Function.prototype ? ");
console.log(Person.__proto__ === Function.prototype);
// Person的prototype指向person（我们自己设定的）
console.log("Person.prototype === person ?");
console.log(Person.prototype === person);


// 实现多态:同一个操作作用于不同对象，得到不同的执行方式和结果
// 将“做什么” 和 “谁来做、怎么做” 分开
var shout = function(animal) {
    animal.shout();
};
var Duck = function(){};
Duck.prototype.shout = function(){
    console.log('gagaga');
};
var Chicken = function(){};
Chicken.prototype.shout = function(){
    console.log('jijiji');
};

shout(new Duck());
shout(new Chicken());