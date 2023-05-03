/**
 * @file config when using `mountAll()`
 */
import { SORTFUNC } from "./sortcommon.js";
import {
  bubbleSort,
  gnomesort,
  mergesort,
  radixsort,
  shakersort,
} from "./sortfunc.js";

export const WIDTH = 300;
export const HEIGHT = 250;
export const SIZE = 60;
export const videoType = "video/webm; codecs=vp8";

/** for `wrapAll()` only (not needed when mounting individually) */
export const sortDict: {
  [key: string]: {
    /** select which element to mount by `document.querySelector()` */
    selector: string;
    /** the sorting async function  */
    sortFunc: SORTFUNC;
    /** to show sorting name under sorting box */
    caption: string;
    /** to `console.log()` sorting name */
    name: string;
    /** recorded video name without ext */
    filename?: string;
  };
} = {
  bubblesort: {
    selector: ".bubblesort",
    sortFunc: bubbleSort,
    caption: "bubble sort.",
    name: "bubble sort",
    filename: "bubble_sort",
  },
  shakersort: {
    selector: ".shakersort",
    sortFunc: shakersort,
    caption: "(cocktail) shaker sort.",
    name: "shaker sort",
    filename: "cocktail_shaker_sort",
  },
  mergesort: {
    selector: ".mergesort",
    sortFunc: mergesort,
    caption: "merge sort.",
    name: "merge sort",
    filename: "merge_sort",
  },
  gnomesort: {
    selector: ".gnomesort",
    sortFunc: gnomesort,
    caption: "gnome sort.",
    name: "gnome sort",
    filename: "gnome_sort",
  },
  radixsort: {
    selector: ".radixsort",
    sortFunc: radixsort,
    caption: "radix sort (ABCDE)",
    name: "radix sort (5)",
    filename: "radix_sort_5",
  },
};
