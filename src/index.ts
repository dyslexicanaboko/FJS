//https://nodejs.dev/en/learn/nodejs-with-typescript/
//import { DateTime } from "./DateTime.js";
import DateTime from "./System/DateTime.js";
import ComparableObject from "./Entities/ComparableObject.js";
import Dictionary from "./System/Collections/Generic/Dictionary.js";
import * as u from "./utils.js";
import crypto from "crypto";

/*
  Permanent tests need to be put into Jest
  Use this space for debugging only.
*/

const n = (someNumber: number): ComparableObject => {
  return new ComparableObject(someNumber);
};

const getMap = (size: number): Map<ComparableObject, ComparableObject> => {
  const map = new Map<ComparableObject, ComparableObject>();

  for (let i = 0; i < size; i++) {
    var kvp = i + 1;

    console.log("kvp", kvp);

    map.set(n(kvp), n(kvp));
  }

  return map;
};

const getDictionary = (
  size: number = 0
): Dictionary<ComparableObject, ComparableObject> =>
  new Dictionary<ComparableObject, ComparableObject>(getMap(size));

//getDictionary(10);

//console.log(crypto.randomBytes(20).toString("hex"));
console.log(crypto.randomUUID());

// console.log("number", getHashCodeForAny(10));
// console.log("boolean", getHashCodeForAny(true));
// console.log("string", getHashCodeForAny("string"));
//console.log("DateTime", getHashCodeForDateTime(DateTime.today));
// const dict = new Dictionary<number, number>();
// dict.add(1, 1);
// dict.add(2, 2);
// dict.add(3, 3);

// console.log("Dict", dict);

// F5 attaches debugger (slow) - compiles and runs, but it's VERY slow
// Ctrl + F5 runs without attaching the debugger (faster) - it will not recompile anything first!
// https://stackoverflow.com/questions/29996145/visual-studio-code-compile-on-save
// Ctrl + Shift + B and use `tsc: watch - tsconfig.json` to start the watcher
// Change the Run and Debug to Launch Program (fastest)
console.log(`Finished @ ${DateTime.now}`);
