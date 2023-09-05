//https://nodejs.dev/en/learn/nodejs-with-typescript/
//import { DateTime } from "./DateTime.js";
import DateTime from "./DateTime.js";
import List from "./List.js";

/*
  Permanent tests need to be put into Jest
  Use this space for debugging only.
*/
const getList = (size: number = 0): List<number> =>
  new List<number>(getArray(size));

const getArray = (size: number): Array<number> => {
  //DON'T initialize the array size! It causes a stupid problem.
  const arr = new Array<number>(10);

  console.log("initialized array", arr);

  // for (let i = 1; i <= size; i++) {
  //   arr.push(i);
  // }

  return arr;
};

const lst = new List<number>([1, 2, 3, 4, 5, 6]);

lst.removeRange(2, 3);

console.log("List", lst);

// F5 attaches debugger (slow) - compiles and runs, but it's VERY slow
// Ctrl + F5 runs without attaching the debugger (faster) - it will not recompile anything first!
// https://stackoverflow.com/questions/29996145/visual-studio-code-compile-on-save
// Ctrl + Shift + B and use `tsc: watch - tsconfig.json` to start the watcher
// Change the Run and Debug to Launch Program (fastest)
console.log(`Finished @ ${DateTime.now()}`);
