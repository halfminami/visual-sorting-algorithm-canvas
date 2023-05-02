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
    0.8
  );
  const sw = [new SortWrap("gnome sort", box, [0], gnomesort)];
  const obj: CONTROLS = {
    startBtn: document.querySelector<HTMLButtonElement>("#start"),
    shuffleBtn: document.querySelector<HTMLButtonElement>("#shuffle"),
  };
  new Sort(randomArray(SIZE), sw, obj).mount();
}
