//https://nodejs.dev/en/learn/nodejs-with-typescript/
import { DateTime } from './DateTime.js';

const d = new Date();

const dtm = new DateTime(d);

// console.log(dtm.getYear());
// console.log(dtm.getMonth());
// console.log(dtm.getDay());

console.log(dtm.addDays(1));
console.log(dtm.addMonths(1));
console.log(dtm.addYears(1));
console.log(dtm);
