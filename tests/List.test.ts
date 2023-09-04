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

const assertAreEqual = (list: List<number>, array: Array<number>): boolean => {
  for (let i = 0; i < list.count(); i++) {
    if (list.get(i) !== array[i]) return false;
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
