import List from "../dist/List.js";

const getArray = (size: number): Array<number> => {
  //Initializing the array size
  const arr = new Array<number>(size);

  for (let i = 0; i < size; i++) {
    //Do not use push, must assign directly by index
    arr[i] = i + 1;
  }

  return arr;
};

const getList = (size: number = 0): List<number> =>
  new List<number>(getArray(size));

const assertAreEqual = (
  actual: List<number>,
  expected: Array<number>
): boolean => {
  for (let i = 0; i < actual.count(); i++) {
    if (actual.get(i) !== expected[i]) return false;
  }

  return true;
};

const _ten = getList(10);
const _empty = getList();
const _someNumber: number = 5829467163;

test("Given list with ten elements, When getting count, Then ten is returned", () => {
  expect(_ten.count()).toBe(10);
});

test("Given non-empty list, When any, Then true is returned", () => {
  expect(_ten.any()).toBe(true);
});

test("Given empty list, When any, Then false is returned", () => {
  expect(_empty.any()).toBe(false);
});

test("Given empty list, When adding one element, Then one element exists", () => {
  const lst = getList();

  lst.add(_someNumber);

  expect(lst.count()).toBe(1);
  expect(lst.get(0)).toBe(_someNumber);
});

test("Given empty list, When adding range of elements, Then list size is equal to range count", () => {
  const lst = getList();
  const size = 5;
  const arr = getArray(size);

  lst.addRange(arr);

  expect(lst.count()).toBe(size);
});

test("Given non-empty list, When adding range of elements, Then list size is equal to original plus range counts", () => {
  const lst = getList(10);
  const arr = getArray(5);

  lst.addRange(arr);

  expect(lst.count()).toBe(15);
});

test("Given non-empty list, When clearing the list, Then list size is zero", () => {
  const lst = getList(10);

  lst.clear();

  expect(lst.count()).toBe(0);
});

test("Given non-empty list, When checking for an item the list does contain, Then true is returned", () => {
  expect(_ten.contains(5)).toBe(true);
});

test("Given non-empty list, When checking for an item the list does not contain, Then false is returned", () => {
  expect(_ten.contains(20)).toBe(false);
});

test("Given non-empty list, When copying to a new empty array, Then array and list elements are identical", () => {
  const arr = new Array<number>();

  _ten.copyTo(arr);

  expect(_ten.count()).toBe(10);
  expect(arr.length).toBe(10);
  expect(assertAreEqual(_ten, arr)).toBe(true);
});

test("Given non-empty list, When checking for item existence the list does contain, Then true is returned", () => {
  expect(_ten.exists((x) => x > 5)).toBe(true);
});

test("Given non-empty list, When checking for item existence the list does not contain, Then false is returned", () => {
  expect(_ten.exists((x) => x > 20)).toBe(false);
});

test("Given non-empty list, When finding item the list does contains, Then item is returned", () => {
  expect(_ten.find((x) => x === 5)).toBe(5);
});

test("Given non-empty list, When finding item the list does not contains, Then undefined is returned", () => {
  expect(_ten.find((x) => x === 20)).toBe(undefined);
});

test("Given non-empty list, When finding all items the list does contain, Then all items are returned", () => {
  const actual = _ten.findAll((x) => x <= 5);

  expect(actual.count()).toBe(5);

  const expected = getArray(5);

  expect(assertAreEqual(actual, expected)).toBe(true);
});

test("Given non-empty list, When finding all items the list does not contain, Then zero items are returned", () => {
  const actual = _ten.findAll((x) => x > 20);

  expect(actual.any()).toBe(false);
});

test("Given non-empty list, When finding index of item by searching criteria the list does contains, Then index is returned", () => {
  expect(_ten.findIndex((x) => x === 5)).toBe(4);
});

test("Given non-empty list, When finding index of item by searching criteria the list does not contain, Then negative one is returned", () => {
  expect(_ten.findIndex((x) => x === 100)).toBe(-1);
});

test("Given list of ones, When using foreach to increment each element by one, Then each element is two", () => {
  const actual = new List<number>([1, 1, 1]);
  const expected: Array<number> = [1, 1, 1];

  actual.forEach((x) => {
    x++;
  });

  //Because this is a list of primitives the values are not altered by the function. This is true in C# too.
  expect(assertAreEqual(actual, expected)).toBe(true);
});

test("Given non-empty list, When getting a range of elements inside the list, Then just those elements are returned", () => {
  const expected: Array<number> = [4, 5, 6];

  const actual = _ten.getRange(3, 3);

  expect(assertAreEqual(actual, expected)).toBe(true);
});

test("Given non-empty list, When getting a range of elements outside the list, Then an empty list is returned", () => {
  const actual = _ten.getRange(10, 3);

  expect(actual.any()).toBe(false);
});

test("Given non-empty list, When finding index of item by item the list does contains, Then index is returned", () => {
  expect(_ten.indexOf(5)).toBe(4);
});

test("Given non-empty list, When finding index of item by item the list does not contain, Then negative one is returned", () => {
  expect(_ten.indexOf(100)).toBe(-1);
});

test("Given non-empty list, When inserting item by inbound index, Then list increases size by one", () => {
  const expected: Array<number> = [1, 2, 3];

  const actual = new List<number>([1, 3]);

  actual.insert(1, 2);

  expect(actual.count()).toBe(expected.length);
  expect(assertAreEqual(actual, expected)).toBe(true);
});

test("Given non-empty list, When inserting item by negative index, Then an error is raised", () => {
  const actual = new List<number>([1, 3]);

  expect(() => {
    actual.insert(-1, 2);
  }).toThrow();
});

test("Given non-empty list, When inserting item by out of bound index, Then an error is raised", () => {
  const actual = new List<number>([1, 3]);

  expect(() => {
    actual.insert(10, 2);
  }).toThrow();
});

test("Given non-empty list, When inserting a range of items by inbound index, Then list increases by range size", () => {
  const expected: Array<number> = [1, 2, 3, 4, 5, 6];

  const actual = new List<number>([1, 6]);

  actual.insertRange(1, [2, 3, 4, 5]);

  expect(actual.count()).toBe(expected.length);
  expect(assertAreEqual(actual, expected)).toBe(true);
});

test("Given non-empty list, When inserting a range of items by negative index, Then an error is raised", () => {
  const actual = new List<number>([1, 3]);

  expect(() => {
    actual.insertRange(-1, [1]);
  }).toThrow();
});

test("Given non-empty list, When inserting a range of items by out of bound index, Then an error is raised", () => {
  const actual = new List<number>([1, 3]);

  expect(() => {
    actual.insertRange(10, [1]);
  }).toThrow();
});
