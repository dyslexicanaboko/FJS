//https://nodejs.dev/en/learn/nodejs-with-typescript/
import { DateTime } from "./DateTime.js";

const d = new Date();

const dtm = DateTime.now();
//const dtm = DateTime.utcNow();
console.log("dtm", dtm.toString());
//console.log(dtm.toString());
//const dtm2 = dtm.addDays(-1);
//console.log("dtm2", dtm2);
//console.log(dtm2.toString());

console.log("1 Day", dtm.addDays(1).toString());
console.log("1 Month", dtm.addMonths(1).toString());
console.log("1 Year", dtm.addYears(1).toString());
// console.log(dtm);

//const ts = dtm.subtract(dtm2);
//ts.log();
//console.log(ts.toString());
