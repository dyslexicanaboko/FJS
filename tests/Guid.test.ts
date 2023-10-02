import Guid from "../dist/System/Guid.js";
import List from "../dist/System/Collections/Generic/List.js";
import { EmptyGuidString } from "../dist/constants.js";

const _someGuid: Guid = new Guid("a968a5b0-234a-4991-b349-6817c65ef181");

test.each([
  "",
  " ",
  "123",
  "[d2f6c248-ea97-45b8-8e2a-7e62a9b71c1d]", //Not supported
  "[1bf3a7b7-21e4-4d33-897f-c0f1a2ff4c88", //Opened not closed
  "6fe99842-f07b-4efb-bdf0-85f18ac8b632]", //Closed not opened
  "6fe99842-f07b-4efb-bdf0-85f18ac8b632-18ac8b632", //Bad format / too long
])(
  "constructor - given a non-guid string, When instantiating the Guid, Then an error is thrown",
  (guidString) => {
    //I'm suppressing the null check here on purpose
    expect(() => {
      new Guid(guidString);
    }).toThrow();
  }
);

test.each([
  EmptyGuidString, //Minimum
  "a968a5b0-234a-4991-b349-6817c65ef181",
  "c8f6bca7-6e77-4b98-9b0c-30890e65a08a",
  "a4926e2c-8a93-4e47-bb3c-5b45ef12e102",
  "3d1cc036-9e88-4e8e-b862-2d5f9a29d0f5",
  "ffffffff-ffff-ffff-ffff-ffffffffffff", //Maximum
])(
  "constructor - given a proper guid string, When instantiating the Guid, Then an object representation is returned.",
  (guidString) => {
    var guid = new Guid(guidString);

    expect(guid.toString()).toBe(guidString);
  }
);

test.each([null, undefined])(
  "constructor - given null or undefined, When instantiating the Guid, Then an Empty Guid is returned.",
  (guidString) => {
    var guid = new Guid(guidString);

    expect(guid.equals(Guid.empty)).toBe(true);
  }
);

test.each([`{${_someGuid}}`, `(${_someGuid})`])(
  "constructor - given a wrapped guid string, When instantiating the Guid, Then an object representation without the wrappers is returned.",
  (guidString) => {
    var guid = new Guid(guidString);

    expect(guid.equals(_someGuid)).toBe(true);
  }
);

test("newGuid, When getting a new Guid, Then a non-empty Guid is returned", () => {
  expect(Guid.newGuid().equals(Guid.empty)).toBe(false);
});

test("newGuid, When generating ten Guids, Then all of them are unique", () => {
  const capacity = 10;
  const lst = new List<Guid>();

  for (let i = 0; i < capacity; i++) {
    lst.add(Guid.newGuid());
  }

  expect(lst.distinct().count).toBe(capacity);
});
