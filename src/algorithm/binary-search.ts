/*
  Binary Search Algorithm
  Time Complexity: O(log n)
  Space Complexity: O(1)
*/

function checkSorted(arr: number[]) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      throw new Error("Array is not sorted in ascending order.");
    }
  }
  return true;
}

export function binarySearch(arr: number[], target: number) {
  checkSorted(arr);
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    console.log("mid", mid);
    console.log("arr[mid]:", arr[mid]);
    if (arr[mid] === target) return mid;
    if (target > arr[mid]) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

const array = new Array(100).fill(0).map((_, index) => index + 1);
console.log("Result: ", binarySearch([2, 4, 62, 3, 4], 150));
