const fs = require("fs")

function closest(num, arr) {
  let curr = arr[0];
  let diff = Math.abs (num - curr);
  for (let i=0; i<arr.length; i++) {
    let newdiff = Math.abs (num - arr[i]);
    if (newdiff < diff) {
      diff = newdiff;
      curr = arr[i];
    }
  }
  return curr;
}

exports.closest = closest;
