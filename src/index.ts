//https://nodejs.dev/en/learn/nodejs-with-typescript/
//import { DateTime } from "./DateTime.js";
import DateTime from "./DateTime.js";

/*
  Permanent tests need to be put into Jest
  Use this space for debugging only.
*/

/*
DateTime.parse("2024-01-31 23:59:59.999").addMonths(1)).toStrictEqual(
    DateTime.parse("2024-02-29 23:59:59.999")
*/
const dtm1 = DateTime.parse("2024-01-31 23:59:59.999");
const dtm2 = DateTime.parse("2024-02-29 23:59:59.999");
const dtm3 = dtm1.addMonths(1);
dtm3.log();

// console.log("dtm1", dtm1.toString());
// console.log("dtm2", dtm2.toString());
console.log("dtm3", dtm3.toString());
console.log("dtm3 month", dtm3.month());
console.log("are equal op?", dtm2 === dtm3);
console.log("are equal mt?", dtm2.equals(dtm3));

// F5 attaches debugger (slow) - compiles and runs, but it's VERY slow
// Ctrl + F5 runs without attaching the debugger (faster) - it will not recompile anything first!
//https://stackoverflow.com/questions/29996145/visual-studio-code-compile-on-save
// Ctrl + Shift + B and use `tsc: watch - tsconfig.json` to start the watcher
// Change the Run and Debug to Launch Program (fastest)
console.log(`Finished @ ${new Date()}`);
