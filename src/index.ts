//https://nodejs.dev/en/learn/nodejs-with-typescript/
//import { DateTime } from "./DateTime.js";
import DateTime from "./DateTime.js";
import List from "./List.js";
import ComparableObject from "./ComparableObject.js";

/*
  Permanent tests need to be put into Jest
  Use this space for debugging only.
*/

const getArray = (size: number): Array<ComparableObject> => {
  const arr = new Array<ComparableObject>(size);

  console.log("initialized array", arr);

  for (let i = 0; i < size; i++) {
    arr[i] = new ComparableObject(i);
  }

  return arr;
};

const lst = new List<ComparableObject>(getArray(10));
console.log("List", lst);

console.log("Contains 5", lst.contains(new ComparableObject(5)));

//lst.add(undefined);

// F5 attaches debugger (slow) - compiles and runs, but it's VERY slow
// Ctrl + F5 runs without attaching the debugger (faster) - it will not recompile anything first!
// https://stackoverflow.com/questions/29996145/visual-studio-code-compile-on-save
// Ctrl + Shift + B and use `tsc: watch - tsconfig.json` to start the watcher
// Change the Run and Debug to Launch Program (fastest)
console.log(`Finished @ ${DateTime.now}`);
