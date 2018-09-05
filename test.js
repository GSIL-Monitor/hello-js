// jshint esversion:6

function debounce(fn, wait) {
    let timer = null;
    return function(...args) {
        let that = this;
        if (timer) {

        }
    };
}

var fn = function() {
    console.log('fn');
};

var f = debounce(fn, 500);
f();
