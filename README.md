# Make sorting visual (`canvas`)
This visualizes sorting algorithms like many other examples found when googling gif of sorts.   
This uses `canvas`. It can record video on browser.

# How to add sort
## in `sortfunc.ts`
- add function that satisfies type `SORTFUNC`
    - use `ArrayWrap` methods to compare/swap/copy and `await` them
    - `export` the function
    - implement like other sorts
## in `setting.ts`
- add sort into `sortDict` (import the function)
## in `index.html`
- add element that satisfies `sortDict` selector

# How to perform sort individually
- `new SortWrap()` all sorts
- put buttons and inputs to Object `: CONTROLS`
- `new Sort(...).mount()`
    - uncomment html and see `individual.ts`

# How to use
```bash
git clone https://github.com/halfminami/visual-sorting-algorithm-canvas.git
cd visual-sorting-algorithm-canvas
npm install
npm run tsc
```
Because of using `script type="module"`, need to run a local server
```bash
npm run start
```
and enter the url into browser (only checked on chrome)

## notes
Clock for sorting (times to compare/swap/copy) was randomly chosen by me. The actual time differs by architecture.
