
let arr = [1,4,7];
arr.splice(1,1);
console.log(arr);
let x = 5;
console.log(arr.indexOf(x));
let m = new Map();
m.set("str", []);
console.log(m.get("str").push("eat"));
for([k,v] of m){
	console.log(v);
}

let s = new Set();
s.add("aaa");
s.add("aaa");
console.log(Array.from(s));

let str = "hello";
console.log(str[1]);
for(v of str){
	console.log(v);
}
const obj = {
	"a":123,
	"v":444,
	"b":346,
}
Object.keys(obj).forEach((k,v) => {
	console.log(`${k} ${v}`);
})

let i = -91283472332+0;
console.log(i-0);

var fn = function(...arg) {
	console.log(arg);
};

fn("a");

// console.log(lll);
for(let lll = 0; lll<2; lll++){

}
console.log(lll);
function foobaaa() {
	var aaa = 1;
}
console.log(lll);
// console.log(aaa);
console.log(bbb);
var bbb = 9;
