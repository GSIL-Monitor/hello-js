//在JavaScript中，一个函数可以作为另一个函数的参数。
//我们可以先定义一个函数，然后传递，也可以在传递参数的地方直接定义函数。
function say(word){
    console.log(word);
}

function execute(someFunc,value){
    someFunc(value);
}

execute(say,"hello!");

//匿名函数,函数体直接作为参数传递
execute(function(word){
    console.log(word);
},"nihao!")