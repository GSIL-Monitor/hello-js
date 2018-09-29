function f(n) {
  let arr = [1, 2];
  if(n > 1){

    for(let i = 2; i <= n; i++){
      arr[i] = arr[i-1] + arr[i-2];
    }

  }
  return arr[n];
}

console.log(f(3));
