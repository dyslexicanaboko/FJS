//https://nodejs.dev/en/learn/nodejs-with-typescript/
//import { DateTime } from "./DateTime.js";
import DateTime from "./System/DateTime.js";
import ComparableObject from "./Entities/ComparableObject.js";
import Dictionary from "./System/Collections/Generic/Dictionary.js";

/*
  Permanent tests need to be put into Jest
  Use this space for debugging only.
*/

const n = (someNumber: number): ComparableObject => {
  return new ComparableObject(someNumber);
};

const getMap = (size: number): Map<number, number> => {
  const map = new Map<number, number>();

  for (let i = 0; i < size; i++) {
    var kvp = i + 1;

    map.set(kvp, kvp);
  }

  return map;
};

const getDictionary = (size: number = 0): Dictionary<number, number> =>
  new Dictionary<number, number>(getMap(size));

const assertAreEqual = (
  actual: Dictionary<number, number>,
  expected: Map<number, number>
): boolean => {
  for (let i = 0; i < actual.count; i++) {
    if (actual.get(i) !== expected.get(i)) return false;
  }

  return true;
};

const _ten = getDictionary(10);

console.log("ten", _ten);

const dict = new Dictionary<number, number>();
dict.add(1, 1);
dict.add(2, 2);
dict.add(3, 3);

console.log("Dict", dict);

console.log("ContainsKey", dict.containsKey(3));

// F5 attaches debugger (slow) - compiles and runs, but it's VERY slow
// Ctrl + F5 runs without attaching the debugger (faster) - it will not recompile anything first!
// https://stackoverflow.com/questions/29996145/visual-studio-code-compile-on-save
// Ctrl + Shift + B and use `tsc: watch - tsconfig.json` to start the watcher
// Change the Run and Debug to Launch Program (fastest)
console.log(`Finished @ ${DateTime.now}`);
