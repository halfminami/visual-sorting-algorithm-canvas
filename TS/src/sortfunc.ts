/**
 * @file collection of sorting algorithms
 * implement with `ArrayWrap` methods, like other functions
 * i'm afraid i didn't implement some of them correctly
 */
import { ArrayWrap } from "./sortcore.js";

export async function bubbleSort(arr: ArrayWrap) {
  for (let i = 0; i < arr.array.length - 1; ++i) {
    let cnt = 0;
    for (let j = 0; j < arr.array.length - i - 1; ++j) {
      if (await arr.leftBigger(j, j + 1)) {
        cnt = 0;
        await arr.swap(j, j + 1);
      } else {
        cnt++;
      }
    }
    i += cnt;
  }
  return arr;
}

export async function shakersort(arr: ArrayWrap) {
  for (let left = 0, right = arr.array.length - 1; left <= right; ) {
    let rightcnt = 0;
    for (let i = left; i < right; ++i) {
      if (await arr.leftBigger(i, i + 1)) {
        rightcnt = 0;
        await arr.swap(i, i + 1);
      } else {
        rightcnt++;
      }
    }
    right -= rightcnt;
    right--;

    let leftcnt = 0;
    for (let i = right; i > left; --i) {
      if (await arr.leftBigger(i - 1, i)) {
        leftcnt = 0;
        await arr.swap(i - 1, i);
      } else {
        leftcnt++;
      }
    }
    left += leftcnt;
    left++;
  }
  return arr;
}

export async function mergesort(arr: ArrayWrap) {
  await mergesort_core(arr, 0, arr.array.length - 1);
  return arr;
}
/** includes left and right */
async function mergesort_core(arr: ArrayWrap, left: number, right: number) {
  if (left == right) {
    return;
  }
  let mid = Math.floor(left + (right - left) / 2);
  await mergesort_core(arr, left, mid);
  await mergesort_core(arr, mid + 1, right);
  const memo: number[] = [];
  let lp = left,
    rp = mid + 1;
  const le = mid,
    re = right;
  while (lp <= le && rp <= re) {
    if (await arr.leftBigger(lp, rp)) {
      memo.push(arr.array[rp]);
      rp++;
    } else {
      memo.push(arr.array[lp]);
      lp++;
    }
  }
  for (; lp <= le; ++lp) {
    memo.push(arr.array[lp]);
  }
  for (; rp <= re; ++rp) {
    memo.push(arr.array[rp]);
  }
  for (let i = 0; left <= right && i < memo.length; ++left, ++i) {
    await arr.equals(left, memo[i]);
  }
  return;
}

export async function gnomesort(arr: ArrayWrap) {
  let cur = 0;
  while (cur < arr.array.length) {
    if (cur == 0 || (await arr.leftBigger(cur, cur - 1))) {
      cur++;
    } else {
      await arr.swap(cur - 1, cur);
      cur--;
    }
  }

  return arr;
}

export async function radixsort(arr: ArrayWrap) {
  const base = "ABCDE";
  const memo: { [key: string]: [string, number][] } = {};
  const initmemo = () => {
    for (let c of base) {
      memo[c] = [];
    }
    memo[" "] = [];
  };
  const cparr: [string, number][] = [];
  for (let i = 0; i < arr.array.length; ++i) {
    cparr[i] = [convertRadix(arr.array[i], base), arr.array[i]];
  }

  let cur = 0;
  while (1) {
    initmemo();
    for (let item of cparr) {
      memo[item[0][item[0].length - 1 - cur] || " "].push(item);
    }
    if (memo[" "].length == arr.array.length) {
      break;
    }
    let p = 0;
    for (let item of memo[" "]) {
      cparr[p] = item;
      p++;
    }
    for (let c of base) {
      for (let item of memo[c]) {
        cparr[p] = item;
        p++;
      }
    }

    for (let i = 0; i < cparr.length; ++i) {
      await arr.equals(i, cparr[i][1]);
    }

    cur++;
  }

  return arr;
}
function convertRadix(n: number, base: string): string {
  let ret = "";
  while (n) {
    ret = base[n % base.length] + ret;
    n = Math.floor(n / base.length);
  }

  return ret;
}
