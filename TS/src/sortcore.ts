/**
 * @file class for sorting
 */

import {
  SORTFUNC,
  initUnit,
  randomArray,
  CONTROLS,
  arrswapClock,
  leftBiggerClock,
  isSorted,
  equalsClock,
  valueBiggerClock,
  valueSmallerClock,
} from "./sortcommon.js";

export class Sort {
  /** represents array that is set before sorting starts */
  array: number[];
  components: SortWrap[];
  controls: CONTROLS;
  /**
   * call `mount()` method to handle sorts
   * @param array shuffled array; uses this length to generate new shuffled array
   * @param components all sorts that this handles
   * @param controls buttons and inputs; if one of them is not needed, simply delete it
   */
  constructor(array: number[], components: SortWrap[], controls: CONTROLS) {
    this.array = array;
    this.components = components;
    this.controls = controls;
  }
  /** update array and add event listener */
  mount() {
    for (let item of this.components) {
      item.setArray(this.array);
    }
    if (this.controls.sleepInput) {
      for (let item of this.components) {
        item.array.sleepInput = this.controls.sleepInput;
      }
    }

    this.controls.shuffleBtn?.addEventListener("click", () => {
      this.array = randomArray(
        this.array.length,
        this.controls.almostSortedChk?.checked ?? false,
        this.controls.reverseChk?.checked ?? false
      );
      for (let item of this.components) {
        item.setArray(this.array);
      }
    });

    this.controls.startBtn?.addEventListener("click", () => {
      if (this.controls.startBtn) {
        this.controls.startBtn.disabled = true;
      }
      if (this.controls.shuffleBtn) {
        this.controls.shuffleBtn.disabled = true;
      }
      console.log(`[${new Date().toLocaleTimeString()}]`, "sort start!");
      const promiseArr: Promise<any>[] = [];
      for (let item of this.components) {
        promiseArr.push(item.runSort());
      }
      Promise.all(promiseArr)
        .then(() => {
          console.log("all sorts finished!");
        })
        .catch((err) => console.log(err))
        .then(() => {
          if (this.controls.startBtn) {
            this.controls.startBtn.disabled = false;
          }
          if (this.controls.shuffleBtn) {
            this.controls.shuffleBtn.disabled = false;
          }
        });
    });
  }
}

export class SortWrap {
  sortBox: HTMLCanvasElement;
  /** sort function swaps this */
  array: ArrayWrap;
  name: string;
  sortFunc: SORTFUNC;
  /**
   * individual sort. pass this array to `Sort`
   * @param name to `console.log()` sort name
   * @param sortBox needs css and sorting value elements (call sortcommon.ts/`insertSortBox()`)
   * @param array any array is ok since `Sort` sets it
   * @param sortFunc sortig function (maybe in setting.ts/`sortDict` and import it)
   */
  constructor(
    name: string,
    sortBox: HTMLCanvasElement,
    array: number[],
    sortFunc: SORTFUNC
  ) {
    this.name = name;
    this.sortBox = sortBox;
    this.sortFunc = sortFunc;
    this.array = new ArrayWrap(array, this.sortBox);
    this.#setUnit();
  }
  /** copy array and update unit */
  setArray(arr: number[]): void {
    // this.array = new ArrayWrap(arr, this.sortBox);
    this.array.setArray(arr);
    this.#setUnit();
  }
  async runSort() {
    this.sortBox.classList.add("sorting");
    const ret = await this.sortFunc(this.array);
    console.log(
      `[${new Date().toLocaleTimeString()}]`,
      this.name,
      isSorted(ret.array) ? "sorted!" : "not sorted..."
    );
    this.sortBox.classList.remove("sorting");
    return ret;
  }
  #setUnit() {
    initUnit(this.sortBox, this.array.array);
  }
}

export class ArrayWrap {
  array: number[];
  sortBox: HTMLCanvasElement;
  sleepInput: HTMLInputElement | undefined;
  #swapClock = arrswapClock;
  constructor(arr: number[], box: HTMLCanvasElement) {
    this.array = arr.concat();
    this.sortBox = box;
    this.sleepInput = undefined;
  }

  #sleepCnt = () => (this.sleepInput && parseInt(this.sleepInput.value)) ?? 300;

  async swap(idx1: number, idx2: number) {
    await this.#swapClock(this.array, idx1, idx2, this.sortBox, this.#sleepCnt);
  }
  setArray(arr: number[]) {
    this.array = arr.concat();
  }
  /** @returns left>right */
  async leftBigger(idx1: number, idx2: number) {
    const ret = await leftBiggerClock(
      this.array,
      idx1,
      idx2,
      this.sortBox,
      this.#sleepCnt
    );
    return ret;
  }
  /** for copy (mergesort) */
  async equals(idx: number, value: number) {
    const ret = await equalsClock(
      this.array,
      idx,
      this.sortBox,
      this.#sleepCnt,
      value
    );
    return ret;
  }

  // REVIEW
  /** for binary search */
  async valueBigger(value: number, idx: number) {
    const ret = await valueBiggerClock(
      this.array,
      value,
      idx,
      this.sortBox,
      this.#sleepCnt
    );
    return ret;
  }
  async valueSmaller(value: number, idx: number) {
    const ret = await valueSmallerClock(
      this.array,
      value,
      idx,
      this.sortBox,
      this.#sleepCnt
    );
    return ret;
  }
}
