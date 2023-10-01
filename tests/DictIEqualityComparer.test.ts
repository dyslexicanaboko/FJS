import BoxObject from "../dist/Entities/BoxObject.js";
import BoxEqualityComparer from "../dist/Entities/BoxEqualityComparer.js";
import Dictionary from "../dist/System/Collections/Generic/Dictionary.js";

//These tests are basically identical to the scalar version using the ComplexObject.
//They are still linear tests because the values are all the same.

//Convenience function to reduce syntax length
const b = (length: number, width: number, height: number): BoxObject => {
  return new BoxObject(length, width, height);
};

const getMap = (size: number): Map<BoxObject, BoxObject> => {
  const map = new Map<BoxObject, BoxObject>();

  for (let i = 0; i < size; i++) {
    var n = i + 1;

    map.set(b(n, n, n), b(n, n, n));
  }

  return map;
};

const getDictionary = (size: number = 0): Dictionary<BoxObject, BoxObject> =>
  new Dictionary<BoxObject, BoxObject>(getMap(size), _boxComparer);

const getRandomBox = (): BoxObject => {
  const length = Math.floor(Math.random() * 1000);
  const width = Math.floor(Math.random() * 1000);
  const height = Math.floor(Math.random() * 1000);

  return b(length, width, height);
};

const _boxComparer = new BoxEqualityComparer();
const _ten = getDictionary(10);
const _someBox = b(12341234, 36346346345, 5829467163);

test("Given empty dictionary, When adding one element, Then one element exists", () => {
  const lst = getDictionary();

  lst.add(_someBox, _someBox);

  expect(lst.count).toBe(1);
  expect(lst.get(_someBox)).toBe(_someBox);
});

test("Given non-empty dictionary, When checking for an item the dictionary does contain, Then true is returned", () => {
  expect(_ten.containsKey(b(5, 5, 5))).toBe(true);
});

test("Given non-empty dictionary, When checking for an item the dictionary does not contain, Then false is returned", () => {
  expect(_ten.containsKey(b(20, 20, 20))).toBe(false);
});

test("Given map of ones, When an attempt is made to initialize the dictionary, An exception is raised because primitive indexers cannot be altered", () => {
  //Because this is a dictionary of object, the JS Map object doesn't know how to compare anything besides primitives.
  //With the primitives example, if the key is found again, it's just overwritten. With objects, duplicates will be added.
  //Therefore, with the Dictionary<TKey, TValue> implementation, the key will be hashed and there will be a collision immediately.
  expect(() => {
    new Dictionary<BoxObject, BoxObject>(
      new Map<BoxObject, BoxObject>([
        [b(1, 1, 1), b(1, 1, 1)],
        [b(1, 1, 1), b(1, 1, 1)],
        [b(1, 1, 1), b(1, 1, 1)],
      ]),
      _boxComparer
    );
  }).toThrow();
});

test("Given dictionary sequence one through three, When using foreach to increment each element by one, Then a collision occurs", () => {
  const actual = new Dictionary<BoxObject, BoxObject>(
    new Map<BoxObject, BoxObject>([
      [b(1, 1, 1), b(1, 1, 1)],
      [b(2, 2, 2), b(2, 2, 2)],
      [b(3, 3, 3), b(3, 3, 3)],
    ]),
    _boxComparer
  );
  const expected = new Map<BoxObject, BoxObject>([
    [b(1, 1, 1), b(1, 1, 1)],
    [b(2, 2, 2), b(2, 2, 2)],
    [b(3, 3, 3), b(3, 3, 3)],
  ]);

  expect(() => {
    actual.forEach((kvp) => {
      kvp.key.height++;
      kvp.value!.height++;
    });
  }).toThrow();
});

test("Given dictionary with one item, When removing the item, Then true is returned and the dictionary is empty", () => {
  const item = 1;
  const lst = new Dictionary<BoxObject, BoxObject>(
    new Map<BoxObject, BoxObject>([[b(item, item, item), b(item, item, item)]]),
    _boxComparer
  );

  expect(lst.remove(b(item, item, item))).toBe(true);
  expect(lst.any()).toBe(false);
});

test("Given dictionary of nine non-linear random box sizes, When checking if the dictionary contains a tenth known box, Then true is returned", () => {
  const nonLinearBoxes = new Dictionary<BoxObject, BoxObject>(
    new Map<BoxObject, BoxObject>([
      [getRandomBox(), getRandomBox()],
      [getRandomBox(), getRandomBox()],
      [getRandomBox(), getRandomBox()],
      [getRandomBox(), getRandomBox()],
      [_someBox, _someBox],
      [getRandomBox(), getRandomBox()],
      [getRandomBox(), getRandomBox()],
      [getRandomBox(), getRandomBox()],
      [getRandomBox(), getRandomBox()],
      [getRandomBox(), getRandomBox()],
    ]),
    _boxComparer
  );

  expect(nonLinearBoxes.containsKey(_someBox)).toBe(true);
});
