import List from "../dist/List.js";

const getList = (size: number = 0): List<number> =>
  new List<number>(getArray(size));
const getArray = (size: number): Array<number> => {
  //Initializing the array size
  const arr = new Array<number>(size);

  for (let i = 1; i <= size; i++) {
    arr.push(i);
  }

  return arr;
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
