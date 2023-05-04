/**
 * @file config when using `mountAll()`
 */
import { SORTFUNC } from "./sortcommon.js";
import {
  bubbleSort,
  circlesort,
  combsort,
  cyclesort,
  gnomesort,
  heapsort,
  insertionsort,
  insertionsort_bin,
  mergesort,
  mergesort_parallel,
  oddevensort,
  quicksort,
  quicksort_parallel,
  radixsort,
  selectionsort,
  selectionsort_double,
  shakersort,
  shellsort_div2,
  shellsort_div3,
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
  mergesortpara: {
    selector: ".mergesort-para",
    sortFunc: mergesort_parallel,
    caption: "parallel merge",
    name: "merge sort (parallel)",
    filename: "merge_sort_para",
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
  insertionsort: {
    selector: ".insertionsort",
    sortFunc: insertionsort,
    caption: "simple insertion sort",
    name: "insertion sort (simple compare)",
    filename: "insertion_sort",
  },
  insertionsort_bs: {
    selector: ".insertionsort-bin",
    sortFunc: insertionsort_bin,
    caption: "binary search insertion",
    name: "insertion sort (binary search)",
    filename: "insertion_sort_bin",
  },
  selectionsort: {
    selector: ".selectionsort",
    sortFunc: selectionsort,
    caption: "selection sort",
    name: "selection sort (simple)",
    filename: "selection_sort",
  },
  selectionsort_d: {
    selector: ".selectionsort-double",
    sortFunc: selectionsort_double,
    caption: "double selection",
    name: "selection sort (double)",
    filename: "double_selection_sort",
  },
  shellsort_div3: {
    selector: ".shellsort3",
    sortFunc: shellsort_div3,
    caption: "improved shell",
    name: "shell sort (div 3)",
    filename: "shell_sort_3",
  },
  shellsort_div2: {
    selector: ".shellsort2",
    sortFunc: shellsort_div2,
    caption: "shell sort",
    name: "shell sort (div 2)",
    filename: "shell_sort_2",
  },
  combsort: {
    selector: ".combsort",
    sortFunc: combsort,
    caption: "comb sort",
    name: "comb sort",
    filename: "comb_sort",
  },
  quicksort: {
    selector: ".quicksort",
    sortFunc: quicksort,
    caption: "quick sort",
    name: "quick sort ((left + right)/2)",
    filename: "quick_sort_ave",
  },
  quicksort_para: {
    selector: ".quicksort-para",
    sortFunc: quicksort_parallel,
    caption: "parallel quick sort",
    name: "quick sort ((left + right)/2) (parallel)",
    filename: "quick_sort_para",
  },
  circlesort: {
    selector: ".circlesort",
    sortFunc: circlesort,
    caption: "circle sort.",
    name: "circle sort",
    filename: "circle_sort",
  },
  heapsort: {
    selector: ".heapsort",
    sortFunc: heapsort,
    caption: "heap sort",
    name: "heap sort (max heap)",
    filename: "heap_sort_max",
  },
  oddevensort: {
    selector: ".oddevensort",
    sortFunc: oddevensort,
    caption: "odd even sort",
    name: "odd even sort (parallel)",
    filename: "oddeven_sort_para",
  },
  cyclesort: {
    selector: ".cyclesort",
    sortFunc: cyclesort,
    caption: "cycle sort",
    name: "cycle sort (simple)",
    filename: "cycle_sort",
  },
};
