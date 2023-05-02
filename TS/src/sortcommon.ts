/**
 * @file collection of common function
 * mainly manipulates html
 */
import { sortDict } from "./setting.js";
import { ArrayWrap, SortWrap } from "./sortcore.js";

export type SORTFUNC = (arr: ArrayWrap) => Promise<ArrayWrap>;

export type CONTROLS = {
  shuffleBtn?: HTMLButtonElement | null;
  almostSortedChk?: HTMLInputElement | null;
  reverseChk?: HTMLInputElement | null;
  startBtn?: HTMLButtonElement | null;
  sleepInput?: HTMLInputElement | null;
};

/** create buttons and inputs */
export function controlForms(first: Element): CONTROLS | undefined {
  if (first.parentElement) {
    const div = first.parentElement.insertBefore(
      document.createElement("div"),
      first
    );
    const shuffleBtn = div.appendChild(document.createElement("button"));
    shuffleBtn.textContent = "shuffle";
    const almostSortedChk = document.createElement("input");
    almostSortedChk.type = "checkbox";
    {
      const label = div.appendChild(document.createElement("label"));
      label.textContent = "almost sorted";
      label.appendChild(almostSortedChk);
    }
    const reverseChk = document.createElement("input");
    reverseChk.type = "checkbox";
    {
      const label = div.appendChild(document.createElement("label"));
      label.textContent = "reverse array";
      label.appendChild(reverseChk);
    }
    const startBtn = div.appendChild(document.createElement("button"));
    startBtn.textContent = "sort start";
    const sleepInput = div.appendChild(document.createElement("input"));
    sleepInput.type = "range";
    sleepInput.min = "0";
    sleepInput.max = "200";
    sleepInput.value = "10";
    return { shuffleBtn, almostSortedChk, reverseChk, startBtn, sleepInput };
  }
  return undefined;
}

export function wrapAll(
  size: number,
  width: number,
  height: number,
  array: number[]
): SortWrap[] {
  const ret: SortWrap[] = [];
  for (let item in sortDict) {
    const divs = document.querySelectorAll<HTMLDivElement>(
      sortDict[item].selector
    );
    for (let div of divs) {
      div.classList.add("sort-mounted");
      const sortBox = insertSortBox(div, width, height, sortDict[item].caption);
      ret.push(
        new SortWrap(
          sortDict[item].name,
          sortBox,
          array,
          sortDict[item].sortFunc
        )
      );
    }
  }
  return ret;
}
function sleep(time: number) {
  return new Promise((res, rej) => {
    setTimeout(res, time);
  });
}

/**
 * random array (0~size-1) by *Algorithm P (Shuffling)*
 * @see {@link https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle}
 * @param size array size
 * @param almostSorted if true, the array is not shuffled completely
 * @param reverse if true, reverse the array (for `almostSorted=true`)
 */
export function randomArray(
  size = 0,
  almostSorted = false,
  reverse = false
): number[] {
  let cnt = -1;
  const ret = new Array(size).fill(0).map((item) => {
    cnt++;
    return cnt;
  });

  // randomise
  if (almostSorted) {
    // limit shuffle range
    const mgn = 3;
    for (let i = 0; i < size - 1; ++i) {
      arrswap(ret, i, mathrandint(i, Math.min(size - 1, i + mgn)));
    }
  } else {
    // shuffling
    for (let i = 0; i < size - 1; ++i) {
      arrswap(ret, i, mathrandint(i, size - 1));
    }
  }

  if (reverse) {
    for (let i = 0; i < Math.floor(size / 2); ++i) {
      arrswap(ret, i, size - 1 - i);
    }
  }
  return ret;
}

/** check if sort finished correctly */
export function isSorted(arr: number[]): boolean {
  let ret = true;
  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] != i) {
      ret = false;
    }
  }
  return ret;
}

/**
 * create `div.sort-box`
 * @param parent create element inside this
 * @param width box outline width (px)
 * @param height box outline height (px)
 * @param caption description under box (if `undefined`, no text)
 * @param padLeft box outline padding left and right
 * @param padTop box outline paddng top and bottom
 * @returns canvas with dataset
 */
export function insertSortBox(
  parent: HTMLDivElement,
  width: number,
  height: number,
  caption: string | undefined,
  padLeft: number = width / 10,
  padTop: number = height / 10
): HTMLCanvasElement {
  const upperLeft = [padLeft, padTop];
  const lowerRight = [padLeft + width, padTop + height];
  const strHeight = caption == undefined ? 0 : height / 10;
  const figure = parent.appendChild(document.createElement("figure"));
  const sortBox = figure.appendChild(document.createElement("canvas"));

  sortBox.width = lowerRight[0] + padLeft;
  sortBox.height = lowerRight[1] + padTop + strHeight;
  sortBox.dataset.left = upperLeft[0].toString();
  sortBox.dataset.top = upperLeft[1].toString();
  sortBox.dataset.right = lowerRight[0].toString();
  sortBox.dataset.bottom = lowerRight[1].toString();
  sortBox.dataset.strHeight = strHeight.toString();

  let ctx = sortBox.getContext("2d");
  ctx = assertCanvasContext(ctx);

  ctx.fillStyle = "white";
  ctx.fillRect(
    0,
    0,
    lowerRight[0] + padLeft,
    lowerRight[1] + padTop + strHeight
  );

  ctx.fillStyle = "black";
  if (caption) {
    ctx.textBaseline = "bottom";
    ctx.font = `${strHeight}px monospace`;
    ctx.fillText(caption, padLeft, lowerRight[1] + padTop + strHeight, width);
  }
  return sortBox;
}
/** set height of all existing units by array */
export function initUnit(box: HTMLCanvasElement, arr: number[]): number[] {
  let ctx = box.getContext("2d");
  ctx = assertCanvasContext(ctx);

  ctx.fillStyle = "white";
  ctx.fillRect(
    0,
    0,
    box.width,
    box.height - (parseInt(box.dataset.strHeight || "0") || 0)
  );

  const obj = parseDatasets(box);
  for (let i = 0; i < arr.length; ++i) {
    fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, i);
  }
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );
  return arr;
}

export async function arrswapClock(
  arr: number[],
  idx1: number,
  idx2: number,
  sortBox: HTMLCanvasElement,
  sleepCnt: () => number
) {
  arrswap(arr, idx1, idx2);
  let ctx = sortBox.getContext("2d");
  ctx = assertCanvasContext(ctx);
  const obj = parseDatasets(sortBox);

  for (let i of [idx1, idx2]) {
    fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, i, "green");
  }
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );

  await sleep(sleepCnt());

  for (let i of [idx1, idx2]) {
    fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, i);
  }
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );

  return;
}

export async function leftBiggerClock(
  arr: number[],
  idx1: number,
  idx2: number,
  sortBox: HTMLCanvasElement,
  sleepCnt: () => number
) {
  const ret = arr[idx1] > arr[idx2];
  let ctx = sortBox.getContext("2d");
  ctx = assertCanvasContext(ctx);
  const obj = parseDatasets(sortBox);

  for (let i of [idx1, idx2]) {
    fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, i, "green");
  }
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );

  await sleep(sleepCnt() / 2); // 2 is random number

  for (let i of [idx1, idx2]) {
    fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, i);
  }
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );

  return ret;
}

/** for copy (mergesort) */
export async function equalsClock(
  arr: number[],
  idx1: number,
  sortBox: HTMLCanvasElement,
  sleepCnt: () => number,
  value: number
) {
  arr[idx1] = value;
  let ctx = sortBox.getContext("2d");
  ctx = assertCanvasContext(ctx);
  const obj = parseDatasets(sortBox);

  fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, idx1, "green");
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );

  await sleep(sleepCnt());

  fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, idx1);
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );
  return arr[idx1];
}
export async function leftEqualRightClock(
  arr: number[],
  idx1: number,
  idx2: number,
  sortBox: HTMLCanvasElement,
  sleepCnt: () => number
) {
  const ret = arr[idx1] == arr[idx2];
  let ctx = sortBox.getContext("2d");
  ctx = assertCanvasContext(ctx);
  const obj = parseDatasets(sortBox);
  fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, idx1, "green");
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );

  await sleep(sleepCnt() / 2); // 2 is random number
  fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, idx1);
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );
  return ret;
}
export async function valueBiggerClock(
  arr: number[],
  value: number,
  idx1: number,
  sortBox: HTMLCanvasElement,
  sleepCnt: () => number
) {
  const ret = value > arr[idx1];
  let ctx = sortBox.getContext("2d");
  ctx = assertCanvasContext(ctx);
  const obj = parseDatasets(sortBox);
  fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, idx1, "green");
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );

  await sleep(sleepCnt() / 2); // 2 is random number

  fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, idx1);
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );
  return ret;
}
export async function valueSmallerClock(
  arr: number[],
  value: number,
  idx1: number,
  sortBox: HTMLCanvasElement,
  sleepCnt: () => number
) {
  const ret = value < arr[idx1];
  let ctx = sortBox.getContext("2d");
  ctx = assertCanvasContext(ctx);
  const obj = parseDatasets(sortBox);
  fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, idx1, "green");
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );

  await sleep(sleepCnt() / 2); // 2 is random number

  fillBar(ctx, obj.left, obj.top, obj.right, obj.bottom, arr, idx1);
  strokeFrame(
    ctx,
    obj.top,
    obj.left,
    obj.right - obj.left,
    obj.bottom - obj.top
  );
  return ret;
}
/** includes begin and end */
function mathrandint(begin: number, end: number): number {
  end++;
  if (0 < end - begin && end - begin < 1) return Math.floor(end);
  begin = Math.ceil(begin);
  end = Math.floor(end);
  if (end - begin < 0) return 0;
  return Math.min(Math.floor(Math.random() * (end - begin)) + begin, end - 1);
}
function arrswap<T>(arr: T[], idx1: number, idx2: number): void {
  if (idx1 == idx2) {
    return;
  }
  if (idx1 < 0 || idx2 < 0 || idx1 > arr.length || idx2 > arr.length) {
    return;
  }
  const tmp = arr[idx2];
  arr[idx2] = arr[idx1];
  arr[idx1] = tmp;
  return;
}

/** need redrawing box frame after each bar is drawn */
function strokeFrame(
  ctx: CanvasRenderingContext2D,
  top: number,
  left: number,
  width: number,
  height: number,
  color = "black"
) {
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(left, top, width, height);
}
/** draw bar */
function fillBar(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  right: number,
  bottom: number,
  arr: number[],
  ind: number,
  color = "yellowgreen"
) {
  ctx.fillStyle = color;
  /** bar width */
  const w = () => (right - left) / arr.length;
  /** bar height */
  const H = (value: number) => ((bottom - top) / (arr.length - 1)) * value;
  /** bar x */
  const x = (indx: number) => left + w() * indx;
  /** bar y */
  const y = (value: number) => bottom - H(value);
  ctx.fillRect(x(ind), y(arr[ind]), w(), H(arr[ind]));
  ctx.fillStyle = "white";
  ctx.fillRect(x(ind), top, w(), bottom - top - H(arr[ind]));
}

function assertCanvasContext(a: CanvasRenderingContext2D | null) {
  if (!a) {
    throw new Error("canvas not supported");
  }
  return a;
}
function parseDatasets(c: HTMLCanvasElement) {
  const left = parseInt(c.dataset.left || "10") || 10;
  const top = parseInt(c.dataset.top || "10") || 10;
  const right = parseInt(c.dataset.right || "110") || 110;
  const bottom = parseInt(c.dataset.bottom || "110") || 110;
  const strHeight = parseInt(c.dataset.strHeight || "0") || 0;
  return {
    left,
    right,
    top,
    bottom,
    strHeight,
  };
}
