const DateTime = require("../dist/DateTime");

const dtm = new DateTime(new Date("2023-08-30"));

test('Get year returns four digit year', () => {
  expect(dtm.getYear()).toBe(2023);
});
