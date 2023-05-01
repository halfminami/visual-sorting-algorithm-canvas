import { SIZE, WIDTH, HEIGHT } from "./setting.js";
import { randomArray, controlForms, wrapAll } from "./sortcommon.js";
import { Sort } from "./sortcore.js";

export function mountAll(size = SIZE, width = WIDTH, height = HEIGHT) {
  const sorts = wrapAll(size, width, height, new Array(size).fill(0));

  const first = document.querySelector(".sort-mounted");

  if (first) {
    const ret = controlForms(first);

    if (ret) {
      new Sort(randomArray(size), sorts, ret).mount();
    }
  }
}
