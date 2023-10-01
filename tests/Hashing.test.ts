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

test("getHashCodeRandom - Given a random hashcode, When it is random, Then the hash is not zero and cannot be predicted", () => {
  expect(u.getHashCodeRandom()).not.toEqual(0);
});

test("getHashCodeForBoolean - Given a boolean, When it is false, Then 0 is the hash", () => {
  expect(u.getHashCodeForBoolean(false)).toBe(0);
});

test("getHashCodeForBoolean - Given a boolean, When it is true, Then 1 is the hash", () => {
  expect(u.getHashCodeForBoolean(true)).toBe(1);
});

test("getHashCodeForNumber - Given a number, When it is a number, Then that same number is returned as the hash", () => {
  expect(u.getHashCodeForNumber(1)).toBe(1);
});

test("getHashCodeForBigInt - Given a big integer, When it is a big integer, Then that same big integer is returned as the hash", () => {
  expect(u.getHashCodeForBigInt(1n)).toBe(1);
});

//In theory they shouldn't be predictable. The C# implementation actually makes sure of this because they
//don't want anyone to use the Hash as a primary key or some significant identifier.
test.each([
  ["a", 372029373],
  ["A", 372029405],
  ["b", 372029376],
  ["B", 372029408],
  ["c", 372029375],
  ["C", 372029407],
  ["d", 372029370],
  ["D", 372029402],
  ["e", 372029369],
  ["E", 372029401],
  ["f", 372029372],
  ["F", 372029404],
  ["g", 372029371],
  ["G", 372029403],
  ["h", 372029382],
  ["H", 372029414],
  ["i", 372029381],
  ["I", 372029413],
  ["j", 372029384],
  ["J", 372029416],
  ["k", 372029383],
  ["K", 372029415],
  ["l", 372029378],
  ["L", 372029410],
  ["m", 372029377],
  ["M", 372029409],
  ["n", 372029380],
  ["N", 372029412],
  ["o", 372029379],
  ["O", 372029411],
  ["p", 372029390],
  ["P", 372029422],
  ["q", 372029389],
  ["Q", 372029421],
  ["r", 372029392],
  ["R", 372029424],
  ["s", 372029391],
  ["S", 372029423],
  ["t", 372029386],
  ["T", 372029418],
  ["u", 372029385],
  ["U", 372029417],
  ["v", 372029388],
  ["V", 372029420],
  ["w", 372029387],
  ["W", 372029419],
  ["x", 372029398],
  ["X", 372029430],
  ["y", 372029397],
  ["Y", 372029429],
  ["z", 372029400],
  ["Z", 372029432],
])(
  "getHashCodeForString - Testing lowercase and uppercase letters to have predictable hashes",
  (letter, hash) => {
    expect(u.getHashCodeForString(letter)).toBe(hash);
  }
);

test.each([
  ["0001-01-01", 304934780], //0 in C#
  ["2000-12-01", 671224035], //-1065047744 in C#
  ["3000-01-01", -632488561], //1602339637 in C#
])(
  "getHashCodeForDate - Testing JS-Date AND DateTime to have predictable hashes",
  (dateString, hash) => {
    const date = new Date(dateString);

    expect(u.getHashCodeForDate(date)).toBe(hash);
    expect(u.getHashCodeForDateTime(new DateTime(date))).toBe(hash);
  }
);
