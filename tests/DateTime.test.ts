//https://medium.com/nerd-for-tech/testing-typescript-with-jest-290eaee9479d
//const DateTime = require("../dist/DateTime");
import { DateTime } from "../dist/DateTime";

const dtm = new DateTime(new Date("2023-08-30"));

test("Get year returns four digit year", () => {
  expect(dtm.year()).toBe(2023);
});
