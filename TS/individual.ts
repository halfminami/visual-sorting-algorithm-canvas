/**
 * @file example of performing sort individually
 */
import { CONTROLS, insertSortBox, randomArray } from "./src/sortcommon.js";
import { Sort, SortWrap } from "./src/sortcore.js";
import { gnomesort } from "./src/sortfunc.js";

const par = document.querySelector<HTMLDivElement>(".gnomesort-ind");
if (par) {
  const SIZE = 50;
  const box = insertSortBox(
    par,
    500,
    250,
    "it's gnomesort!!! short code!",
    undefined,
    undefined,
    0.5
  );
  const sw = [
    new SortWrap(
      "gnome sort",
      box,
      [0],
      gnomesort,
      "gnomeSort",
      document.querySelector<HTMLButtonElement>("#startrecord") || undefined,
      document.querySelector<HTMLButtonElement>("#stoprecord") || undefined,
      document.querySelector<HTMLButtonElement>("#download") || undefined,
      document.querySelector<HTMLVideoElement>("#video") || undefined
    ),
  ];
  const obj: CONTROLS = {
    startBtn: document.querySelector<HTMLButtonElement>("#start"),
    shuffleBtn: document.querySelector<HTMLButtonElement>("#shuffle"),
    sleepInput: document.querySelector<HTMLInputElement>("#clock"),
  };
  new Sort(randomArray(SIZE), sw, obj).mount();
}
