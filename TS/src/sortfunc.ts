/**
 * @file collection of sorting algorithm functions
 * implement with `ArrayWrap`'s methods, like other functions
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
// just `promise.all`ed above function
async function mergesort_core_parallel(
  arr: ArrayWrap,
  left: number,
  right: number
) {
  if (left == right) {
    return;
  }
  let mid = Math.floor(left + (right - left) / 2);
  await Promise.all([
    mergesort_core_parallel(arr, left, mid),
    mergesort_core_parallel(arr, mid + 1, right),
  ]);
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
export async function mergesort_parallel(arr: ArrayWrap) {
  await mergesort_core_parallel(arr, 0, arr.array.length - 1);
  return arr;
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
export async function insertionsort(arr: ArrayWrap) {
  for (let i = 0; i < arr.array.length - 1; ++i) {
    for (let j = i; j >= 0 && (await arr.leftBigger(j, j + 1)); --j) {
      await arr.swap(j, j + 1);
    }
  }

  return arr;
}
export async function insertionsort_bin(arr: ArrayWrap) {
  for (let i = 0; i < arr.array.length - 1; ++i) {
    if (await arr.leftBigger(i, i + 1)) {
      const to = await binary_search(arr, 0, i, arr.array[i + 1]);
      let j = i;
      for (; j >= to; --j) {
        await arr.swap(j, j + 1);
      }
      // since this binary search sometimes points wrong index, but why?
      j++;
      if (await arr.leftBigger(j, j + 1)) {
        await arr.swap(j, j + 1);
      }
    }
  }

  return arr;
}
/** includes left and right */
async function binary_search(
  arr: ArrayWrap,
  left: number,
  right: number,
  value: number
): Promise<number> {
  if (left >= right) {
    return left;
  }
  const mid = left + Math.floor((right - left) / 2);
  if (await arr.valueBigger(value, mid)) {
    const ret = await binary_search(arr, mid + 1, right, value);
    return ret;
  } else if (await arr.valueSmaller(value, mid)) {
    // in this case no same value exists
    // so checking if smaller is meaningless
    // but common binary search checks through, so this does too
    const ret = await binary_search(arr, left, mid - 1, value);
    return ret;
  } else {
    return mid;
  }
}

export async function selectionsort(arr: ArrayWrap) {
  for (let i = 0; i < arr.array.length - 1; ++i) {
    let max = 0;
    for (let j = 1; j < arr.array.length - i; ++j) {
      if (await arr.leftBigger(j, max)) {
        max = j;
      }
    }
    await arr.swap(max, arr.array.length - 1 - i);
  }

  return arr;
}
export async function selectionsort_double(arr: ArrayWrap) {
  for (
    let left = 0, right = arr.array.length - 1;
    left < right;
    ++left, --right
  ) {
    let min = left,
      max = left;
    for (let j = left + 1; j <= right; ++j) {
      if (await arr.leftBigger(j, max)) {
        max = j;
      }
      if (await arr.leftBigger(min, j)) {
        min = j;
      }
    }
    await arr.swap(min, left);
    if (left == max) {
      max = min;
    }
    await arr.swap(max, right);
  }

  return arr;
}

export async function shellsort_div2(arr: ArrayWrap) {
  let gap = Math.floor(arr.array.length / 2),
    div = 2;
  await shellsort(arr, gap, div);

  return arr;
}
/**
 * improved gap
 * @see {@link https://en.wikipedia.org/wiki/Shellsort}
 */
export async function shellsort_div3(arr: ArrayWrap) {
  let gap,
    div = 3;
  const calcGap = (x: number) => (3 ** x - 1) / 2;
  for (let i = 2; ; ++i) {
    if (Math.ceil(arr.array.length / 3) < calcGap(i)) {
      gap = Math.floor(calcGap(i - 1));
      break;
    }
  }
  await shellsort(arr, gap, div);

  return arr;
}
async function shellsort(arr: ArrayWrap, gap: number, div: number) {
  while (gap) {
    for (let i = 0; i < arr.array.length - gap; ++i) {
      for (let j = i; j >= 0 && (await arr.leftBigger(j, j + gap)); j -= gap) {
        await arr.swap(j, j + gap);
      }
    }

    gap = Math.floor(gap / div);
  }
}

/** @see {@link https://en.wikipedia.org/wiki/Comb_sort} */
export async function combsort(arr: ArrayWrap) {
  const shrink = 1.3;
  let gap = arr.array.length;
  while (1) {
    gap = Math.floor(gap / shrink);
    let sorted = false;
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }
    for (let i = 0; i < arr.array.length - gap; ++i) {
      if (await arr.leftBigger(i, i + gap)) {
        await arr.swap(i, i + gap);
        sorted = false;
      }
    }
    if (sorted) {
      break;
    }
  }

  return arr;
}

export async function quicksort(arr: ArrayWrap) {
  await quicksort_core(
    arr,
    0,
    arr.array.length - 1,
    (l: number[]) => (arr.array[l[0]] + arr.array[l[1]]) / 2
  );

  return arr;
}
/** includes left and right */
async function quicksort_core(
  arr: ArrayWrap,
  left: number,
  right: number,
  pivot: (arr: number[]) => number
) {
  if (left >= right) {
    return arr;
  }
  let lp = left,
    rp = right;
  while (1) {
    for (
      ;
      lp <= right && (await arr.valueBigger(pivot([left, right]), lp));
      ++lp
    ) {}
    for (
      ;
      rp >= left && (await arr.valueSmaller(pivot([left, right]), rp));
      --rp
    ) {}
    if (lp < rp) {
      arr.swap(lp, rp);
    } else {
      if (left == right - 1) {
        return arr;
      }
      if (lp == left) lp++; // avoid infinite recursion
      if (lp == right) lp--;
      await quicksort_core(arr, left, lp, pivot);
      await quicksort_core(arr, lp, right, pivot);
      return arr;
    }
  }

  return arr;
}
// simply `promise.all`ed above function
async function quicksort_core_parallel(
  arr: ArrayWrap,
  left: number,
  right: number,
  pivot: (arr: number[]) => number
) {
  if (left >= right) {
    return arr;
  }
  let lp = left,
    rp = right;
  while (1) {
    for (
      ;
      lp <= right && (await arr.valueBigger(pivot([left, right]), lp));
      ++lp
    ) {}
    for (
      ;
      rp >= left && (await arr.valueSmaller(pivot([left, right]), rp));
      --rp
    ) {}
    if (lp < rp) {
      arr.swap(lp, rp);
    } else {
      if (left == right - 1) {
        return arr;
      }
      if (lp == left) lp++; // avoid infinite recursion
      if (lp == right) lp--;
      await Promise.all([
        quicksort_core_parallel(arr, left, lp, pivot),
        quicksort_core_parallel(arr, lp, right, pivot),
      ]);
      return arr;
    }
  }

  return arr;
}
export async function quicksort_parallel(arr: ArrayWrap) {
  await quicksort_core_parallel(
    arr,
    0,
    arr.array.length - 1,
    (l: number[]) => (arr.array[l[0]] + arr.array[l[1]]) / 2
  );

  return arr;
}

export async function circlesort(arr: ArrayWrap) {
  for (; await circlesort_core(arr, 0, arr.array.length); );

  return arr;
}
/** includes left and right */
async function circlesort_core(
  arr: ArrayWrap,
  left: number,
  right: number
): Promise<boolean> {
  let swapped = false;
  let lp = left,
    rp = right;
  if (left >= right) {
    return swapped;
  }

  for (; lp < rp; ++lp, --rp) {
    if (await arr.leftBigger(lp, rp)) {
      await arr.swap(lp, rp);
      swapped = true;
    }
  }
  // for odd
  if (lp == rp) {
    if (await arr.leftBigger(lp, lp + 1)) {
      await arr.swap(lp, lp + 1);
      swapped = true;
    }
  }

  const mid = Math.floor(left + (right - left) / 2);
  const retleft = await circlesort_core(arr, left, mid);
  const retright = await circlesort_core(arr, mid + 1, right);

  return swapped || retleft || retright;
}

export async function heapsort(arr: ArrayWrap) {
  for (let i = arr.array.length - 1; i >= 0; --i) {
    await heapsort_heapify(arr, i, arr.array.length - 1);
  }
  for (let r = arr.array.length - 1; r >= 0; --r) {
    await heapsort_deletetop(arr, 0, r);
  }

  return arr;
}
/**
 * includes left
 * @param arr
 * @param top parent
 * @param right
 * @returns index to swap or -1
 */
async function heapsort_check(
  arr: ArrayWrap,
  top: number,
  right: number
): Promise<number> {
  const leftChild = top * 2 + 1,
    rightChild = top * 2 + 2;
  if (leftChild > right) {
    return -1;
  }
  if (rightChild > right) {
    return (await arr.leftBigger(top, leftChild)) ? -1 : leftChild;
  }

  let target = (await arr.leftBigger(leftChild, rightChild))
    ? leftChild
    : rightChild;
  return (await arr.leftBigger(top, target)) ? -1 : target;
}
/** includes left */
async function heapsort_heapify(arr: ArrayWrap, top: number, right: number) {
  let i;
  if ((i = await heapsort_check(arr, top, right)) != -1) {
    await arr.swap(top, i);
    await heapsort_heapify(arr, i, right);
  }
  return;
}
/** top goes to right and heap right becomes right-1 */
async function heapsort_deletetop(arr: ArrayWrap, top: number, right: number) {
  await arr.swap(top, right);
  await heapsort_heapify(arr, top, right - 1);
  return;
}

/** unlike other sorts, this does swap parallel
 * because that is the major difference from bubble sort.
 * this looks fast but same $O(n^2)$ as bubble sort */
export async function oddevensort(arr: ArrayWrap) {
  while (1) {
    let sorted = true;
    let promiseArr: Promise<any>[] = [];
    const compareAndSwap = async (idx1: number, idx2: number) => {
      if (await arr.leftBigger(idx1, idx2)) {
        await arr.swap(idx1, idx2);
        sorted = false;
      }
      return;
    };

    for (let i = 0; i < arr.array.length; i += 2) {
      promiseArr.push(compareAndSwap(i, i + 1));
    }
    await Promise.all(promiseArr);

    promiseArr = [];
    for (let i = 1; i < arr.array.length; i += 2) {
      promiseArr.push(compareAndSwap(i, i + 1));
    }
    await Promise.all(promiseArr);

    if (sorted) {
      break;
    }
  }
  return arr;
}

export async function cyclesort(arr: ArrayWrap) {
  for (let start = 0; start < arr.array.length - 1; ++start) {
    let cur = start;
    for (let i = start + 1; i < arr.array.length; ++i) {
      if (await arr.leftBigger(start, i)) {
        cur++;
      }
    }
    if (cur == start) {
      continue;
    }

    // in this case there's no duplicate
    // so this part is not necessary
    while (await arr.leftIsRight(start, cur)) {
      cur++;
    }

    await arr.swap(start, cur);

    while (1) {
      cur = start;
      for (let i = start + 1; i < arr.array.length; ++i) {
        if (await arr.leftBigger(start, i)) {
          cur++;
        }
      }

      if (cur == start) {
        break;
      }
      // this part is not necessary
      while (await arr.leftIsRight(start, cur)) {
        cur++;
      }

      await arr.swap(cur, start);
    }
  }

  return arr;
}
