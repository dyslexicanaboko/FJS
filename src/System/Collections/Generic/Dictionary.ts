import {
  hasEqualsFunction,
  hasGetHashCodeFunction,
  getHashCodeForAny,
  defaultEquals,
  isPrimitiveType,
} from "../../../utils.js";
import IEqualityComparer from "./IEqualityComparer.js";
import KeyValuePair from "./KeyValuePair.js";
import { ComparerMode } from "../ElementType.js";

/**
 * JavaScript implementation of the C# Dictionary<TKey, TValue> class. Hashing is used to store and retrieve
 * key value pairs. Therefore the TKey must implement a getHashCode function to work effectively.
 * https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 * @class Dictionary
 */
export default class Dictionary<TKey, TValue> {
  //number is the hashed TKey code
  //KeyValuePair is the TKey and TValue pair to be stored
  private _map: Map<number, KeyValuePair<TKey, TValue>>;
  private _comparer: IEqualityComparer<TKey> | undefined;
  private _getHashCodeTKey: (key: TKey) => number;
  private _comparerModeTKey: ComparerMode;
  private _comparerModeTValue: ComparerMode = ComparerMode.Default;
  private _isTKeyPrimitiveType: boolean = false;
  private _equalsTValue: (
    left: TValue | undefined,
    right: TValue | undefined
  ) => boolean;

  /**
   * Initialize an empty dictionary
   * @constructor
   */
  public constructor();
  /**
   * Initialize a dictionary using an existing `Map` to copy from.
   * @constructor
   * @param {Map<TKey, TValue>} map - the `Map` to copy from. */
  public constructor(map: Map<TKey, TValue>);
  /**
   * Initialize a dictionary using an existing `Map` to copy from and explicitly provide a way to compare the {TKey}.
   * @constructor
   * @param {Map<TKey, TValue>} map - Initialize a dictionary using an existing `Map` to copy from.
   * @param {IEqualityComparer<TKey>} compare - Optional comparer for performing equality comparisons on the {TKey}*/
  public constructor(map: Map<TKey, TValue>, compare: IEqualityComparer<TKey>);
  public constructor(
    map?: Map<TKey, TValue>,
    compare?: IEqualityComparer<TKey> | undefined
  ) {
    this._map = new Map<number, KeyValuePair<TKey, TValue>>();

    this._equalsTValue = (
      left: TValue | undefined,
      right: TValue | undefined
    ) => {
      return defaultEquals(left, right);
    };

    this._comparer = compare;

    //Pass 1 at setting the hashing algorithm
    if (compare) {
      this._comparerModeTKey = ComparerMode.External;

      this._getHashCodeTKey = (key: TKey) => {
        return compare.getHashCode(key);
      };
    } else {
      this._comparerModeTKey = ComparerMode.Default;

      this._getHashCodeTKey = (key: TKey) => {
        return getHashCodeForAny(key);
      };
    }

    //This has to happen last because it depends on the comparer being set first
    if (map) {
      for (const [key, value] of map) {
        //If the provided map is malformed, meaning that it has duplicated keys, then an error will be thrown this cannot be helped
        this.add(key, value);
      }
    }
  }

  /**
   * Test if the dictionary contains any elements.
   * @returns {boolean} True if the dictionary has at least one element, false otherwise.
   */
  any(): boolean {
    return this.count > 0;
  }

  get comparer(): IEqualityComparer<TKey> | undefined {
    return this._comparer;
  }

  /**
   * Gets a count of the number of elements {TKey, TValue} in the dictionary.
   * @returns {number} The number of elements in the dictionary.
   */
  get count(): number {
    return this._map.size;
  }

  //https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2.keycollection
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
  //The KeyCollection offers more, but I am not sure if it is needed in JS TBH - going to leave this alone for now
  //The map.keys() function will return a IterableIterator<TKey> which is what I wanted to do, but for now I will
  //return an Array<TKey> which is far simpler to achieve

  /**
   * Gets an array of the keys in the dictionary.
   */
  get keys(): Array<TKey> {
    var keys = new Array<TKey>();

    for (const v of this._map.values()) {
      keys.push(v.key);
    }

    return keys;
  }

  //https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2.valuecollection
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
  //Read the notes from `keys()` above, same idea
  /**
   * Gets an array of the values in the dictionary.
   * Values can be `undefined` because there is no restriction on the TValue type.
   */
  get values(): Array<TValue | undefined> {
    var values = new Array<TValue | undefined>();

    for (const v of this._map.values()) {
      values.push(v.value);
    }

    return values;
  }

  /**
   * Pass 2 at setting the hashing algorithm for TKey with potential lockout. This is an attempt at efficiency.
   * If the key is a primitive type then it will be hashed using the default hashing algorithm. If the key is
   * a custom class then it will be hashed using the custom class's getHashCode. However, if the key is a custom
   * class that does not have a getHashCode function then the default hashing algorithm will be used. This is to
   * prevent checking if a hashing algorithm is available.
   * @param key TKey to test.
   */
  private testTKeyComparer(key: TKey): void {
    //If the comparer is set to something other than Default then don't change anything
    if (this._comparerModeTKey !== ComparerMode.Default) return;

    //Taking advantage that this will lockout to put this here
    this._isTKeyPrimitiveType = isPrimitiveType(key);

    //If the key does not supply a getHashCode function then the default compare is as good as it can be
    if (!hasGetHashCodeFunction(key)) {
      //Prevent any further redundant checks by locking out the comparer mode
      this._comparerModeTKey = ComparerMode.DefaultLocked;

      //If this is not a primitive and the equality function was not found, then a warning needs to be issued once.
      if (!this._isTKeyPrimitiveType) {
        console.warn(
          "Key of type TKey does not provide an `getHashCode(TKey)` function. Default hashing is being used."
        );
      }

      return;
    }

    this._comparerModeTKey = ComparerMode.Internal;

    this._getHashCodeTKey = (key: TKey) => {
      return (key as any).getHashCode();
    };
  }

  //Since it's impossible to know which function will be called first, a test to see which comparer can
  //be used has to be performed first on each call.
  private hashKey(key: TKey): number {
    this.testTKeyComparer(key);

    return this._getHashCodeTKey(key);
  }

  /**
   * Add a key value pair to the dictionary. If the key is not unique an error will be raised.
   * @param key unique key to add.
   * @param value value to add.
   */
  add(key: TKey, value: TValue): void {
    const hashCode = this.hashKey(key);

    if (this._map.has(hashCode)) {
      throw new Error(
        `A key with the same hash code has already been added. Key: ${key}`
      );
    }

    this._map.set(hashCode, { key: key, value: value });
  }

  /**
   * Remove all key value pairs from the dictionary.
   */
  clear(): void {
    this._map.clear();
  }

  /**
   * Check if the provided key is contained in the dictionary.
   * @param key
   * @returns Whether or not the key is contained in the dictionary.
   */
  containsKey(key: TKey): boolean {
    const hashCode = this.hashKey(key);

    return this._map.has(hashCode);
  }

  /**
   * Pass 2 at setting the equals algorithm for TValue with potential lockout. This is an attempt at efficiency.
   * Testing if the TValue has an equals function. If an equals function is not found or this is a primitive type
   * then the default equals function will be used. However, if this is a custom class that does not have an equals
   * function then the default equals function will be used. This is to prevent checking if an equals function is
   * available.
   * @param value TValue to test.
   */
  private testTValueEquals(value: TValue): void {
    //If the comparer is set to something other than Default then don't change anything
    if (this._comparerModeTValue !== ComparerMode.Default) return;

    //If the TValue does not supply an equals function then the default compare is as good as it can be
    if (!hasEqualsFunction(value)) {
      //Prevent any further redundant checks by locking out the comparer mode
      this._comparerModeTValue = ComparerMode.DefaultLocked;

      if (!isPrimitiveType(value)) {
        console.warn(
          "Type of TValue does not provide an `equals(TValue)` function. Default equality is being used."
        );
      }

      return;
    }

    this._comparerModeTValue = ComparerMode.Internal;

    this._equalsTValue = (
      left: TValue | undefined,
      right: TValue | undefined
    ) => {
      //If both are undefined then left = right
      if (left == undefined && right == undefined) return true;

      //If left is undefined then left < right
      if (left == undefined) return false;

      //If right is undefined then left > right
      if (right == undefined) return false;

      //If neither is undefined, then do a proper compare
      return (left as any).equals(right);
    };
  }

  //C# will use TValue's internal Equals(object) methods. Therefore, to increase its
  //chances of success the user needs to override those methods.
  /**
   * Check if the provided value is contained in the dictionary.
   * @param value value to check for.
   * @returns Whether or not the value is contained in the dictionary.
   */
  containsValue(value: TValue): boolean {
    this.testTValueEquals(value);

    //https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html
    for (const kvp of this._map.values()) {
      const v = kvp.value;

      if (this._equalsTValue(value, v)) return true;
    }

    return false;
  }

  /**
   * An action to perform on each element in the list.
   * @param action action to perform on each dictionary key value pair.
   */
  forEach(
    action: (keyValuePair: KeyValuePair<TKey, TValue | undefined>) => void
  ): void {
    /* C# won't let you change the iterator variable while you are looping via foreach:
     *   When the key is a primitive then the code won't even compile if you attempt do this.
     *   When you are using a custom class, then you can modify its properties.
     * I cannot prevent the user from modifying the key in either case, therefore the only thing I can do is raise
     * an error if they change the key's value which in turn is modifying the hashcode.
     * Therefore, a check for collisions must be made. */

    //To prevent an infinit loop from occurring, an array must be produced first to have a finite list to work with
    //JavaScript lets you modify a map while you are using the IterableIterator, this can cause an infinite loop to occur.
    const arr = Array.from(this._map.values());

    arr.forEach((kvp) => {
      const before = this.hashKey(kvp.key);

      action(kvp);

      const after = this.hashKey(kvp.key);

      //If the key has not changed then everything is fine
      if (before === after) return;

      //In C#, you cannot modify the key or value of a KeyValuePair of primitive types, but you can get away with
      //modifying the properties of a custom class.
      if (this._isTKeyPrimitiveType) {
        throw new Error(
          "Property or indexer cannot be assigned to -- it is read only"
        );
      }

      //If the key changed, then check to see if the new key already exists.
      const newEntry = this._map.get(after);

      //If the key already exists, this is a confirmed collision.
      if (newEntry) {
        throw new Error(
          `A key with the same hash code has already been added. Key: ${kvp.key}`
        );
      }

      //If the key does not exist, then this is a confirmed exchange
      this._map.delete(before); //Delete the old key
      this._map.set(after, kvp); //Add the new key
    });
  }

  /**
   * Get a key value pair from the dictionary using its key.
   * @param key key of the desired item.
   * @returns the item at the specified key.
   */
  get(key: TKey): TValue | undefined {
    const hashCode = this.hashKey(key);

    return this._map.get(hashCode)?.value;
  }

  /**
   * Key value pair to remove if found.
   * @param key to find and remove.
   * @returns true if the key was found and removed, false if the key was not found.
   */
  remove(key: TKey): boolean {
    const hashCode = this.hashKey(key);

    return this._map.delete(hashCode);
  }

  //Not worth implementing
  //tryAdd

  //Cannot safely implement `out` parameters in JavaScript because there is no explicit equivalent
  //tryGetValue
}
