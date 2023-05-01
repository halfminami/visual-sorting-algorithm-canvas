# make sorting visual (`canvas`)
This visualizes sorting algorithms like many other examples found when googling gif of sorts.
This uses `canvas`. It can record video on browser. (not yet)

# how to add sort
## in `sortfunc.ts`
- add function that satisfies type `SORTFUNC`
    - use `ArrayWrap` methods to compare/swap/copy and `await` them
    - `export` the function
    - implement like other sorts
## in `setting.ts`
- add sort into `sortDict` (import the function)
## in `index.html`
- add element that satisfies `sortDict` selector

# how to perform sort individually
- `new SortWrap()` all sorts
- put buttons and inputs to Object `: CONTROLS`
- `new Sort(...).mount()`
    - uncomment html and see `individual.ts`

# how to use
```bash
git clone https://github.com/halfminami/visual-sorting-algorithm.git
cd visual-sorting-algorithm
npm install
npm run tsc
```
For `script type="module"`, need to run a local server
```bash
npm run start
```
and enter the url into browser (only checked on chrome)

## notes
Clock for sorting (times to compare/swap/copy) is randomly chosen. The actual time differs by architecture.
