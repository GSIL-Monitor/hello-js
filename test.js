setImmediate(() => {
    console.log('immediate');
    setImmediate(() => {
        console.log('immediate2');
    });
    setTimeout(() => {
        console.log('TIMEOUT in immediate');
    })
});

setTimeout(() => {
    console.log('TIMEOUT');
    setImmediate(() => {
        console.log('immediate in TIMEOUT');
    })
    setTimeout(() => {
        console.log('TIMEOUT2');
    })
});

new Promise((resolve, reject) => {
    resolve();
}).then((arg) => {
    console.log('then1');
});

process.nextTick(function A() {
    console.log(1);
    process.nextTick(function B() {
        console.log(2);
    });
});
setImmediate(function (){
  setImmediate(function A() {
    console.log(1);
    setImmediate(function B(){console.log(2);});
  });

  setTimeout(function timeout() {
    console.log('TIMEOUT FIRED');
  }, 0);
});
