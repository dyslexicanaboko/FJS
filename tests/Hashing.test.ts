import * as u from "../dist/utils.js";
import ComparableObject from "../dist/Entities/ComparableObject.js";
import DateTime from "../dist/System/DateTime.js";

const n = (someNumber: number): ComparableObject => {
  return new ComparableObject(someNumber);
};

const zero = n(0);
const one = n(1);

test.each([null, undefined])(
  "isNull - Given a value, When null or undefined, Then true is returned",
  (value) => {
    expect(u.isNull(value)).toBe(true);
  }
);

test.each(["a", " ", 1, [], new Date()])(
  "isNull - Given a value, When not null or undefined, Then false is returned",
  (value) => {
    expect(u.isNull(value)).toBe(false);
  }
);

test("defaultComparer - Given a value, When left is less than right, Then -1 is returned", () => {
  expect(u.defaultComparer(1, 2)).toBe(-1);
});

test("defaultComparer - Given a value, When left is equal to right, Then 0 is returned", () => {
  expect(u.defaultComparer(5, 5)).toBe(0);
});

test("defaultComparer - Given a value, When left is greater than right, Then 1 is returned", () => {
  expect(u.defaultComparer(7, 2)).toBe(1);
});

test("defaultEquals - Given a value, When left and right are undefined, Then true is returned", () => {
  expect(u.defaultEquals(undefined, undefined)).toBe(true);
});

test("defaultEquals - Given a value, When left is undefined and right is not, Then false is returned", () => {
  expect(u.defaultEquals(undefined, 0)).toBe(false);
});

test("defaultEquals - Given a value, When left is not undefined and right is, Then false is returned", () => {
  expect(u.defaultEquals(0, undefined)).toBe(false);
});

test("defaultEquals - Given a value that implements IEquatable<T>, When left is equal to right, Then true is returned", () => {
  expect(u.defaultEquals(zero, n(0))).toBe(true);
});

test("defaultEquals - Given a value that implements IEquatable<T>, When left does not equal right, Then false is returned", () => {
  expect(u.defaultEquals(one, zero)).toBe(false);
});

test("defaultEquals - Given a value that implements IEquatable<T>, When right does not equal left, Then false is returned", () => {
  expect(u.defaultEquals(zero, one)).toBe(false);
});

test("defaultEquals - Given a value that does not implement IEquatable<T>, When left does equal right, Then an error is raised", () => {
  expect(() => {
    u.defaultEquals(1, 1);
  }).toThrow();
});

test("has*Function - Given an object that does implement *Interface, When existence is tested, Then true is returned", () => {
  expect(u.hasEqualsFunction(one)).toBe(true);
  expect(u.hasCompareToFunction(one)).toBe(true);
  expect(u.hasGetHashCodeFunction(one)).toBe(true);
});

test("has*Function - Given an object that does not implement *Interface, When existence is tested, Then false is returned", () => {
  expect(u.hasEqualsFunction(1)).toBe(false);
  expect(u.hasCompareToFunction(1)).toBe(false);
  expect(u.hasGetHashCodeFunction(1)).toBe(false);
});

test.each([
  "string",
  -1,
  0,
  1,
  -1n,
  1n,
  true,
  false,
  Symbol("foo"),
  new Date(),
  DateTime.now,
])(
  "isPrimitiveType - Given any value, When it fits my bias of what a primitive is, Then true is returned",
  (value) => {
    expect(u.isPrimitiveType(value)).toBe(true);
  }
);

test("isPrimitiveType - Given any value, When it is a custom class, Then false is returned", () => {
  expect(u.isPrimitiveType(one)).toBe(false);
});
