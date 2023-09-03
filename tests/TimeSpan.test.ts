//https://medium.com/nerd-for-tech/testing-typescript-with-jest-290eaee9479d
//const DateTime = require("../dist/DateTime");
import TimeSpan from "../dist/TimeSpan.js";
import DateTime from "../dist/DateTime.js";

const assertComponents = (
  ts: TimeSpan,
  days: number = 0,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0,
  milliseconds: number = 0
) => {
  expect(ts.days()).toBe(days);
  expect(ts.hours()).toBe(hours);
  expect(ts.minutes()).toBe(minutes);
  expect(ts.seconds()).toBe(seconds);
  expect(ts.milliseconds()).toBe(milliseconds);
};

const getTimeSpan = (start: string, end: string): TimeSpan => {
  const dtmStart = DateTime.parse(start);
  const dtmEnd = DateTime.parse(end);

  return dtmEnd.subtract(dtmStart);
};

/* JavaScript doesn't believe in Dates having precision. This is documented here:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
 * Therefore a whole number is going to be returned most of the time. No fractions.
 * In this test of Day_n0 - Day_n1 a perfectly even integer of 86,400,000 milliseconds is returned every time.
 * This is exactly one day. This is accurate, but not precise and there is NOTHING you can do about it.
 *
 * In contrast, in C# here is what the output looks like WITH precision for the same test:
 *  var ts = DateTime.Now - DateTime.Now.AddDays(-1);
 *
 * Total milliseconds: 86,399,999.9773
 *
 * Output of `ts`:
 *  0.9999999997372685 days
 *  23.999999993694445 hours
 *  59.999999621666696 minutes
 *  59.999977300001774 seconds
 *  977.3000031709671  milliseconds */
test("Given today and yesterday, When subtracted, Then a difference of one day is returned", () => {
  const today = DateTime.now();
  const yesterday = today.addDays(-1);
  const ts = today.subtract(yesterday);

  assertComponents(ts, 1);
});

test("Given dates 2 hours apart, When subtracted, Then a difference of 2 hours is returned", () => {
  const ts = getTimeSpan("2023-08-09 00:00:00.000", "2023-08-09 02:00:00.000");

  assertComponents(ts, 0, 2);
});

test("Given dates 30 minutes apart, When subtracted, Then a difference of 30 minutes is returned", () => {
  const ts = getTimeSpan("2023-08-09 00:00:00.000", "2023-08-09 00:30:00.000");

  assertComponents(ts, 0, 0, 30);
});

test("Given dates 100 seconds apart, When subtracted, Then a difference of 1 minute and 40 seconds is returned", () => {
  const ts = getTimeSpan("2023-08-09 00:00:00.000", "2023-08-09 00:01:40.000");

  assertComponents(ts, 0, 0, 1, 40);
  expect(ts.totalSeconds()).toBe(100);
});
