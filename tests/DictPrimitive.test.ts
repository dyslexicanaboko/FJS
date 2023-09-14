import Dictionary from "../dist/System/Collections/Generic/Dictionary.js";

const getMap = (size: number): Map<number, number> => {
  const map = new Map<number, number>();

  for (let i = 0; i < size; i++) {
    var kvp = i + 1;

    map.set(kvp, kvp);
  }

  return map;
};

const getDictionary = (size: number = 0): Dictionary<number, number> =>
  new Dictionary<number, number>(getMap(size));

const _ten = getDictionary(10);
const _empty = getDictionary();
const _someNumber: number = 5829467163;

test("Given dictionary with ten elements, When getting count, Then ten is returned", () => {
  expect(_ten.count).toBe(10);
});

test("Given non-empty dictionary, When any, Then true is returned", () => {
  expect(_ten.any()).toBe(true);
});

test("Given empty dictionary, When any, Then false is returned", () => {
  expect(_empty.any()).toBe(false);
});

test("Given empty dictionary, When adding one element, Then one element exists", () => {
  const lst = getDictionary();

  lst.add(_someNumber, _someNumber);

  expect(lst.count).toBe(1);
  expect(lst.get(_someNumber)).toBe(_someNumber);
});

test("Given non-empty dictionary, When clearing the dictionary, Then dictionary size is zero", () => {
  const lst = getDictionary(10);

  lst.clear();

  expect(lst.count).toBe(0);
});

test("Given non-empty dictionary, When checking for an item the dictionary does contain, Then true is returned", () => {
  expect(_ten.containsKey(5)).toBe(true);
});

test("Given non-empty dictionary, When checking for an item the dictionary does not contain, Then false is returned", () => {
  expect(_ten.containsKey(20)).toBe(false);
});

test("Given dictionary of ones, When using foreach to increment each element by one, An exception is raised because primitive indexers cannot be altered", () => {
  const actual = new Dictionary<number, number>(
    new Map<number, number>([
      [1, 1],
      [1, 1],
      [1, 1],
    ])
  );
  const expected = new Map<number, number>([
    [1, 1],
    [1, 1],
    [1, 1],
  ]);

  //Because this is a dictionary of primitives the values cannot be altered. Therefore an exception will be raised.
  //This is the same behavior in C#.
  expect(() => {
    actual.forEach((kvp) => {
      kvp.key++;
      kvp.value!++;
    });
  }).toThrow();
});

test("Given dictionary sequence one through three, When using foreach to increment each element by one, Then a collision occurs", () => {
  const actual = new Dictionary<number, number>(
    new Map<number, number>([
      [1, 1],
      [2, 2],
      [3, 3],
    ])
  );
  const expected = new Map<number, number>([
    [1, 1],
    [2, 2],
    [3, 3],
  ]);

  expect(() => {
    actual.forEach((kvp) => {
      kvp.key++;
      kvp.value!++;
    });
  }).toThrow();
});

test("Given dictionary with one item, When removing the item, Then true is returned and the dictionary is empty", () => {
  const item = 1;
  const lst = new Dictionary<number, number>(
    new Map<number, number>([[item, item]])
  );

  expect(lst.remove(item)).toBe(true);
  expect(lst.any()).toBe(false);
});

test("Given empty dictionary, When removing an item, Then false is returned", () => {
  expect(_empty.remove(1)).toBe(false);
});
