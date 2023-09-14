import ComparableObject from "../dist/Entities/ComparableObject.js";
import Dictionary from "../dist/System/Collections/Generic/Dictionary.js";

//Convenience function to reduce syntax length
const n = (someNumber: number): ComparableObject => {
  return new ComparableObject(someNumber);
};

const getMap = (size: number): Map<ComparableObject, ComparableObject> => {
  const map = new Map<ComparableObject, ComparableObject>();

  for (let i = 0; i < size; i++) {
    var kvp = i + 1;

    map.set(n(kvp), n(kvp));
  }

  return map;
};

const getDictionary = (
  size: number = 0
): Dictionary<ComparableObject, ComparableObject> =>
  new Dictionary<ComparableObject, ComparableObject>(getMap(size));

//There might be a need for this later, not sure though
// const assertAreEqual = (
//   actual: Dictionary<ComparableObject, ComparableObject>,
//   expected: Map<ComparableObject, ComparableObject>
// ): boolean => {
//   for (let i = 0; i < actual.count; i++) {
//     if (actual.get(n(i)) !== expected.get(n(i))) return false;
//   }

//   return true;
// };

const _ten = getDictionary(10);
const _someNumber = new ComparableObject(5829467163);

test("Given empty dictionary, When adding one element, Then one element exists", () => {
  const lst = getDictionary();

  lst.add(_someNumber, _someNumber);

  expect(lst.count).toBe(1);
  expect(lst.get(_someNumber)).toBe(_someNumber);
});

test("Given non-empty dictionary, When checking for an item the dictionary does contain, Then true is returned", () => {
  expect(_ten.containsKey(n(5))).toBe(true);
});

test("Given non-empty dictionary, When checking for an item the dictionary does not contain, Then false is returned", () => {
  expect(_ten.containsKey(n(20))).toBe(false);
});

test("Given map of ones, When an attempt is made to initialize the dictionary, An exception is raised because primitive indexers cannot be altered", () => {
  //Because this is a dictionary of object, the JS Map object doesn't know how to compare anything besides primitives.
  //With the primitives example, if the key is found again, it's just overwritten. With objects, duplicates will be added.
  //Therefore, with the Dictionary<TKey, TValue> implementation, the key will be hashed and there will be a collision immediately.
  expect(() => {
    new Dictionary<ComparableObject, ComparableObject>(
      new Map<ComparableObject, ComparableObject>([
        [n(1), n(1)],
        [n(1), n(1)],
        [n(1), n(1)],
      ])
    );
  }).toThrow();
});

test("Given dictionary sequence one through three, When using foreach to increment each element by one, Then a collision occurs", () => {
  const actual = new Dictionary<ComparableObject, ComparableObject>(
    new Map<ComparableObject, ComparableObject>([
      [n(1), n(1)],
      [n(2), n(2)],
      [n(3), n(3)],
    ])
  );
  const expected = new Map<ComparableObject, ComparableObject>([
    [n(1), n(1)],
    [n(2), n(2)],
    [n(3), n(3)],
  ]);

  expect(() => {
    actual.forEach((kvp) => {
      kvp.key.someNumber++;
      kvp.value!.someNumber++;
    });
  }).toThrow();
});

test("Given dictionary with one item, When removing the item, Then true is returned and the dictionary is empty", () => {
  const item = 1;
  const lst = new Dictionary<ComparableObject, ComparableObject>(
    new Map<ComparableObject, ComparableObject>([[n(item), n(item)]])
  );

  expect(lst.remove(n(item))).toBe(true);
  expect(lst.any()).toBe(false);
});
