import DumbObject from "../dist/Entities/DumbObject.js";
import Dictionary from "../dist/System/Collections/Generic/Dictionary.js";

//Convenience function to reduce syntax length
const n = (someNumber: number): DumbObject => {
  return new DumbObject(someNumber);
};

const getMap = (size: number): Map<DumbObject, DumbObject> => {
  const map = new Map<DumbObject, DumbObject>();

  for (let i = 0; i < size; i++) {
    var kvp = i + 1;

    map.set(n(kvp), n(kvp));
  }

  return map;
};

const getDictionary = (size: number = 0): Dictionary<DumbObject, DumbObject> =>
  new Dictionary<DumbObject, DumbObject>(getMap(size));

const _ten = getDictionary(10);
const _someNumber = 5829467163;
const _someNumberRef = new DumbObject(_someNumber);

test("Given empty dictionary, When adding one element of the same reference, Then one element exists", () => {
  const lst = getDictionary();

  lst.add(_someNumberRef, _someNumberRef);

  expect(lst.count).toBe(1);
  expect(lst.get(_someNumberRef)!.getHashCode()).toBe(
    _someNumberRef.getHashCode()
  );
});

test("Given empty dictionary, When adding one element of different references, Then it is not found", () => {
  const lst = getDictionary();

  lst.add(n(_someNumber), n(_someNumber));

  expect(lst.count).toBe(1);
  expect(lst.get(n(_someNumber))).toBe(undefined);
});

test("Given non-empty dictionary, When checking for an item the dictionary does contain, Then false is returned because a compare cannot be performed", () => {
  expect(_ten.containsKey(n(5))).toBe(false);
});

test("Given non-empty dictionary, When checking for an item the dictionary does not contain, Then false is returned erroneously", () => {
  expect(_ten.containsKey(n(20))).toBe(false);
});

test("Given dictionary of ones, When using foreach to increment each element by one, Then all three objects are accepted since the hashes are random", () => {
  //Because this is a dictionary of object, the JS Map object doesn't know how to compare anything besides primitives.
  //With the primitives example, if the key is found again, it's just overwritten. With objects, duplicates will be added.
  //Therefore, with the Dictionary<TKey, TValue> implementation, the key will be hashed and there will be a collision immediately.
  const actual = new Dictionary<DumbObject, DumbObject>(
    new Map<DumbObject, DumbObject>([
      [n(1), n(1)],
      [n(1), n(1)],
      [n(1), n(1)],
    ])
  );

  //Same issue here, the objects all have random numbers for hash codes so there is no way to distinguish them from each other.
  expect(() => {
    actual.forEach((kvp) => {
      kvp.key.someNumber++;
      kvp.value!.someNumber++;
    });
  }).not.toThrow();
});

test("Given dictionary sequence one through three, When using foreach to increment each element by one, Then no collision occurs", () => {
  const actual = new Dictionary<DumbObject, DumbObject>(
    new Map<DumbObject, DumbObject>([
      [n(1), n(1)],
      [n(2), n(2)],
      [n(3), n(3)],
    ])
  );
  const expected = new Map<DumbObject, DumbObject>([
    [n(1), n(1)],
    [n(2), n(2)],
    [n(3), n(3)],
  ]);

  expect(() => {
    actual.forEach((kvp) => {
      kvp.key.someNumber++;
      kvp.value!.someNumber++;
    });
  }).not.toThrow();
});

test("Given dictionary with identical item ref, When removing the item, Then true is returned and the dictionary is empty", () => {
  const item = n(1);
  const lst = new Dictionary<DumbObject, DumbObject>(
    new Map<DumbObject, DumbObject>([[item, item]])
  );

  expect(lst.remove(item)).toBe(true);
  expect(lst.any()).toBe(false);
});

test("Given dictionary with one item different ref, When removing the item, Then false is returned and the dictionary is not empty", () => {
  const item = 1;
  const lst = new Dictionary<DumbObject, DumbObject>(
    new Map<DumbObject, DumbObject>([[n(item), n(item)]])
  );

  expect(lst.remove(n(item))).toBe(false);
  expect(lst.any()).toBe(true);
});
