function sometime(n) {
	return new Promise((resove,reject) => {
		setTimeout(reject(n+200), n);
	});
}

async function test () {
	let res = await sometime(200);
	// console.dir(res);
	console.log(res);
}
test();