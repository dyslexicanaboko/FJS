//https://nodejs.dev/en/learn/nodejs-with-typescript/
//import { DateTime } from "./DateTime.js";
import DateTime from "./System/DateTime.js";
import List from "./System/Collections/Generic/List.js";
import ComparableObject from "./Entities/ComparableObject.js";

/*
  Permanent tests need to be put into Jest
  Use this space for debugging only.
*/

const n = (someNumber: number): ComparableObject => {
  return new ComparableObject(someNumber);
};

const getArray = (size: number): Array<ComparableObject> => {
  //Initializing the array size
  const arr = new Array<ComparableObject>(size);

  for (let i = 0; i < size; i++) {
    //Do not use push, must assign directly by index
    arr[i] = n(i + 1);
  }

  return arr;
};

const getList = (size: number = 0): List<ComparableObject> =>
  new List<ComparableObject>(getArray(size));

const toList = (array: Array<number>): List<ComparableObject> => {
  const lst = new List<ComparableObject>();

  array.forEach((x) => {
    lst.add(n(x));
  });

  return lst;
};

const toArray = (list: Array<number>): Array<ComparableObject> => {
  const arr = new Array<ComparableObject>();

  list.forEach((x) => {
    arr.push(n(x));
  });

  return arr;
};

const assertAreEqual = (
  actual: List<ComparableObject>,
  expected: Array<ComparableObject>
): boolean => {
  for (let i = 0; i < actual.count; i++) {
    if (actual.get(i).notEquals(expected[i])) return false;
  }

  return true;
};

//const lst = new List<ComparableObject>(getArray(10));
//console.log("List", lst);

//console.log("Contains 5", lst.contains(new ComparableObject(5)));

//lst.add(undefined);

const lst = toList([1, 1, 1]);
const arr = toArray([1, 1, 1]);

lst.forEach((x) => {
  x.someNumber++;
});

console.log("Lst", lst);
console.log("Arr", arr);
console.log("assertion", assertAreEqual(lst, arr));

// F5 attaches debugger (slow) - compiles and runs, but it's VERY slow
// Ctrl + F5 runs without attaching the debugger (faster) - it will not recompile anything first!
// https://stackoverflow.com/questions/29996145/visual-studio-code-compile-on-save
// Ctrl + Shift + B and use `tsc: watch - tsconfig.json` to start the watcher
// Change the Run and Debug to Launch Program (fastest)
console.log(`Finished @ ${DateTime.now}`);
