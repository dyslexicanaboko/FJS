//https://medium.com/nerd-for-tech/testing-typescript-with-jest-290eaee9479d
//const DateTime = require("../dist/DateTime");
import DateTime from "../dist/DateTime.js";

//Arbitrary dates - think of them as "some date" for argument's sake
const yesterday = DateTime.parse("2023-08-08 07:07:07.007");
const today = DateTime.parse("2023-08-09 07:07:07.007");
const tomorrow = DateTime.parse("2023-08-10 07:07:07.007");

test("Given some date, When year is YYYY, Then a four digit year YYYY is returned", () => {
  expect(today.year()).toBe(2023);
});

test("Given some date, When month is 0M, Then s single digit month M is returned", () => {
  expect(today.month()).toBe(8);
});

test("Given some date, When day is 0d, Then a single digit day d is returned", () => {
  expect(today.day()).toBe(9);
});

test("Given some date, When hour is 0H, Then a single digit hour H is returned", () => {
  expect(today.hour()).toBe(7);
});

test("Given some date, When minute is 0m, Then a single digit minute m is returned", () => {
  expect(today.minute()).toBe(7);
});

test("Given some date, When second is 0s, Then a single digit second s is returned", () => {
  expect(today.second()).toBe(7);
});

test("Given some date, When millisecond is 00f, Then a single digit millisecond f is returned", () => {
  expect(today.second()).toBe(7);
});

test("Given some date, When one day is subtracted, Then yesterday's date is returned", () => {
  expect(today.addDays(-1)).toStrictEqual(yesterday);
});

test("Given some date (today), When zero days are added, Then today's date is returned", () => {
  expect(today.addDays(0)).toStrictEqual(today);
});

test("Given some date, When one day is added, Then tomorrow's date is returned", () => {
  expect(today.addDays(1)).toStrictEqual(tomorrow);
});

const dateN0 = DateTime.parse("2023-12-31 23:59:59.999");

//The following are all focused on rolling a date over from one edge to the next
test("Given some date, When one year is added, Then the n+1 is returned", () => {
  expect(dateN0.addYears(1).year()).toBe(2024);
});

test("Given some date before the twenty-eigth day of the month, When one month is added, Then the following month is returned using the provided day of the original date", () => {
  //First of the month
  expect(DateTime.parse("2024-05-01 00:00:00.000").addMonths(1)).toStrictEqual(
    DateTime.parse("2024-06-01 00:00:00.000")
  );

  //Twenty-seventh of the month
  expect(DateTime.parse("2024-06-27 00:00:00.000").addMonths(1)).toStrictEqual(
    DateTime.parse("2024-07-27 00:00:00.000")
  );
});

test("Given some date on the last day of the month, When one month is added, Then the following month is returned using its last day of its month", () => {
  //Normal year - 2023 is not a leap year
  expect(DateTime.parse("2023-01-31 00:00:00.000").addMonths(1)).toStrictEqual(
    DateTime.parse("2023-02-28 00:00:00.000")
  );

  //Dreaded leap year - 2024 is a leap year
  expect(DateTime.parse("2024-01-31 23:59:59.999").addMonths(1)).toStrictEqual(
    DateTime.parse("2024-02-29 23:59:59.999")
  );

  // April has 30 days, May has 31 days, can take 30 because 30 < 31
  expect(DateTime.parse("2023-04-30 00:00:00.000").addMonths(1)).toStrictEqual(
    DateTime.parse("2023-05-30 00:00:00.000")
  );

  // May has 31 days, June has 30 days, must take 30 because 31 !< 30
  expect(DateTime.parse("2023-05-31 00:00:00.000").addMonths(1)).toStrictEqual(
    DateTime.parse("2023-06-30 00:00:00.000")
  );
});

test("Given some date, When one hour is added, Then the n+1 is returned", () => {
  expect(dateN0.addHours(1)).toStrictEqual(
    DateTime.parse("2024-01-01 00:59:59.999")
  );
});

test("Given some date, When one minute is added, Then the n+1 is returned", () => {
  expect(dateN0.addMinutes(1)).toStrictEqual(
    DateTime.parse("2024-01-01 00:00:59.999")
  );
});

test("Given some date, When one second is added, Then the n+1 is returned", () => {
  expect(dateN0.addSeconds(1)).toStrictEqual(
    DateTime.parse("2024-01-01 00:00:00.999")
  );
});

test("Given some date, When one millisecond is added, Then the n+1 is returned", () => {
  expect(dateN0.addMilliseconds(1)).toStrictEqual(
    DateTime.parse("2024-01-01 00:00:00.000")
  );
});
