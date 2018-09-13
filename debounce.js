
// 防抖
// 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

// 防抖更像一个修饰函数，所以使用一次柯里化
// fn为要执行的回调，wait为触发等待时间
function debounce(fn, wait) {
	let timer = null;
	return function(...args) {
		let that = this;
		// 设置了定时器，说明在wait时间内又触发了一次事件，因此清除定时器，重新设定
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		// wait毫秒后执行fn
		timer = setTimeout(function() {
			fn.apply(that, args);
		}, wait);
	};
}

let fn1 = function() {
	console.log('回调函数1');
};

// 设置抖动间隔1000毫秒，时间500毫秒触发一次，所以一直重置定时器，不会执行fn
setInterval(debounce(fn1, 1000), 500);

// 防抖应用：
// DOM 元素的拖拽功能实现（mousemove）
// 射击游戏的 mousedown/keydown 事件（单位时间只能发射一颗子弹）
// 计算鼠标移动的距离（mousemove）
// Canvas 模拟画板功能（mousemove）
// 搜索联想（keyup）
// 监听滚动事件判断是否到页面底部自动加载更多：给 scroll 加了 debounce 后，只有用户停止滚动后，才会判断是否到了页面底部


// 节流
// 规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行
// 如果在同一个单位时间内某事件被触发多次，只有一次能生效。
function throttle(fn, gapTime) {
	let _lastTime = null;
	return function(...args) {
		let that = this;
		let _nowTime = new Date().getTime();
		// 如果没有执行过，或者现在时间到上次时间间隔大于gap，则执行fn
		if (!_lastTime || _nowTime - _lastTime > gapTime) {
			fn.apply(that, args);
			_lastTime = _nowTime;
		}
	};
}

let fn2 = function() {
	console.log('回调函数2');
};

// 设置节流时间1000毫秒，事件每200触发一次，但是最终每一秒只执行一次
setInterval(throttle(fn2, 1000), 300);

// 节流应用
// 每次 resize/scroll 触发统计事件
// 文本输入的验证（连续输入文字后发送 AJAX 请求进行验证，验证一次就好）
