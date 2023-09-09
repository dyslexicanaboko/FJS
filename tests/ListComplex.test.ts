import List from "../dist/List.js";
import ComparableObject from "../dist/ComparableObject.js";

//Convenience function to reduce syntax length
const n = (someNumber: number): ComparableObject => {
  return new ComparableObject(someNumber);
};

const getArray = (size: number): Array<ComparableObject> => {
  //Initializing the array size
  const arr = new Array<ComparableObject>(size);

  for (let i = 0; i < size; i++) {
    //Do not use push, must assign directly by index
    arr[i] = n(i + 1);
  }

  return arr;
};

const getList = (size: number = 0): List<ComparableObject> =>
  new List<ComparableObject>(getArray(size));

const toList = (array: Array<number>): List<ComparableObject> => {
  const lst = new List<ComparableObject>();

  array.forEach((x) => {
    lst.add(n(x));
  });

  return lst;
};

const toArray = (list: Array<number>): Array<ComparableObject> => {
  const arr = new Array<ComparableObject>(list.length);

  list.forEach((x) => {
    arr.push(n(x));
  });

  return arr;
};

const assertAreEqual = (
  actual: List<ComparableObject>,
  expected: Array<ComparableObject>
): boolean => {
  for (let i = 0; i < actual.count; i++) {
    if (actual.get(i) !== expected[i]) return false;
  }

  return true;
};

const _ten = getList(10);
const _someNumber = n(5829467163);

test("Given empty list, When adding one element, Then one element exists", () => {
  const lst = getList();

  lst.add(_someNumber);

  expect(lst.count).toBe(1);
  expect(lst.get(0)).toBe(_someNumber);
});

test("Given non-empty list, When checking for an item the list does contain, Then true is returned", () => {
  expect(_ten.contains(n(5))).toBe(true);
});

test("Given non-empty list, When checking for an item the list does not contain, Then false is returned", () => {
  expect(_ten.contains(n(20))).toBe(false);
});

test("Given non-empty list, When copying to a new empty array, Then array and list elements are identical", () => {
  const arr = new Array<ComparableObject>();

  _ten.copyTo(arr);

  expect(_ten.count).toBe(10);
  expect(arr.length).toBe(10);
  expect(assertAreEqual(_ten, arr)).toBe(true);
});

test("Given non-empty list, When checking for item existence the list does contain, Then true is returned", () => {
  expect(_ten.exists((x) => x > n(5))).toBe(true);
});

test("Given non-empty list, When checking for item existence the list does not contain, Then false is returned", () => {
  expect(_ten.exists((x) => x > n(20))).toBe(false);
});

test("Given non-empty list, When finding item the list does contains, Then item is returned", () => {
  expect(_ten.find((x) => x === n(5))).toBe(n(5));
});

test("Given non-empty list, When finding item the list does not contains, Then undefined is returned", () => {
  expect(_ten.find((x) => x === n(20))).toBe(undefined);
});

test("Given non-empty list, When finding all items the list does contain, Then all items are returned", () => {
  const actual = _ten.findAll((x) => x <= n(5));

  expect(actual.count).toBe(5);

  const expected = getArray(5);

  expect(assertAreEqual(actual, expected)).toBe(true);
});

test("Given non-empty list, When finding all items the list does not contain, Then zero items are returned", () => {
  const actual = _ten.findAll((x) => x > n(20));

  expect(actual.any()).toBe(false);
});

test("Given non-empty list, When finding index of item by searching criteria the list does contains, Then index is returned", () => {
  expect(_ten.findIndex((x) => x === n(5))).toBe(4);
});

test("Given non-empty list, When finding index of item by searching criteria the list does not contain, Then negative one is returned", () => {
  expect(_ten.findIndex((x) => x === n(100))).toBe(-1);
});

test("Given list of ones, When using foreach to increment each element by one, Then each element is two", () => {
  const actual = toList([1, 1, 1]);
  const expected = toArray([1, 1, 1]);

  actual.forEach((x) => {
    x.someNumber++;
  });

  //Because this is a list of primitives the values are not altered by the function. This is true in C# too.
  expect(assertAreEqual(actual, expected)).toBe(true);
});

test("Given non-empty list, When finding index of item by item the list does contains, Then index is returned", () => {
  expect(_ten.indexOf(n(5))).toBe(4);
});

test("Given non-empty list, When finding index of item by item the list does not contain, Then negative one is returned", () => {
  expect(_ten.indexOf(n(100))).toBe(-1);
});

test("Given list with one item, When removing the item, Then true is returned and the list is empty", () => {
  const item = n(1);
  const lst = new List<ComparableObject>([item]);

  expect(lst.remove(item)).toBe(true);
  expect(lst.any()).toBe(false);
});

test("Given non-empty list, When removing the items by search criteria the list contains, Then the number of items removed is returned", () => {
  const lst = getList(10);

  expect(lst.removeAll((x) => x > n(5))).toBe(5);
  expect(lst.count).toBe(5);
});

test("Given non-empty list, When removing the items by search criteria the list does not contains, Then the number of items removed is zero", () => {
  const lst = getList(10);

  expect(lst.removeAll((x) => x > n(15))).toBe(0);
  expect(lst.count).toBe(10);
});

test("Given non-empty list, When removing item by inbound index, Then list decreases size by one", () => {
  const expected = toArray([1]);

  const actual = toList([1, 3]);

  actual.removeAt(1);

  expect(actual.count).toBe(expected.length);
  expect(assertAreEqual(actual, expected)).toBe(true);
});

test("Given non-empty list, When removing a range of items by inbound index, Then list increases by range size", () => {
  const expected = toArray([1, 2, 3]);

  const actual = toList([1, 2, 3, 4, 5, 6]);

  actual.removeRange(3, 3);

  expect(actual.count).toBe(expected.length);
  expect(assertAreEqual(actual, expected)).toBe(true);
});

test("Given non-empty list, When removing a range of items by negative index, Then an error is raised", () => {
  const actual = toList([1, 3]);

  expect(() => {
    actual.removeRange(-1, 1);
  }).toThrow();
});

test("Given non-empty list, When removing a range of items by out of bound index, Then an error is raised", () => {
  const actual = toList([1, 3]);

  expect(() => {
    actual.removeRange(10, 1);
  }).toThrow();
});

test("Given non-empty list in descending order, When sorting the list using default compare, Then the list is sorted in ascending order", () => {
  const actual = toList([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
  const expected = getArray(10);

  actual.sort();

  expect(assertAreEqual(actual, expected)).toBe(true);
});

test("Given non-empty list of unordered items, When sorting the list using default compare, Then the list is sorted in ascending order", () => {
  const actual = toList([10, 1, 5, 7, 3, 9, 4, 8, 2, 6]);
  const expected = getArray(10);

  actual.sort();

  expect(assertAreEqual(actual, expected)).toBe(true);
});
