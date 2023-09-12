import {
  hasEqualsFunction,
  hasGetHashCodeFunction,
  defaultGetHashCode,
  defaultEquals,
} from "../../../utils.js";
import IEqualityComparer from "./IEqualityComparer.js";
import KeyValuePair from "./KeyValuePair.js";
import { ComparerMode } from "../ElementType.js";

//https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
export default class Dictionary<TKey, TValue> {
  //number is the hashed TKey code
  //KeyValuePair is the TKey and TValue pair to be stored
  private _map: Map<number, KeyValuePair<TKey, TValue>>;
  private _comparer: IEqualityComparer<TKey> | undefined;
  private _getHashCode: (key: TKey) => number;
  private _comparerMode: ComparerMode;
  private _comparerModeTValue: ComparerMode = ComparerMode.Default;
  private _equals: (
    left: TValue | undefined,
    right: TValue | undefined
  ) => boolean;

  public constructor(map: Map<TKey, TValue>);
  public constructor(map: undefined, compare: IEqualityComparer<TKey>);
  public constructor(
    map?: Map<TKey, TValue>,
    compare?: IEqualityComparer<TKey> | undefined
  ) {
    this._map = new Map<number, KeyValuePair<TKey, TValue>>();

    if (map) {
      for (const [key, value] of map) {
        //If the provided map is malformed, meaning that it has duplicated keys, then an error will be thrown this cannot be helped
        this.add(key, value);
      }
    }

    this._equals = defaultEquals;

    this._comparer = compare;

    //Pass 1 at setting the hashing algorithm
    if (compare) {
      this._comparerMode = ComparerMode.External;

      this._getHashCode = compare.getHashCode;

      return;
    }

    this._comparerMode = ComparerMode.Default;

    this._getHashCode = (key: TKey) => {
      return defaultGetHashCode(key);
    };
  }

  any(): boolean {
    return this.count > 0;
  }

  get comparer(): IEqualityComparer<TKey> | undefined {
    return this._comparer;
  }

  get count(): number {
    return this._map.size;
  }

  //https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2.keycollection
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
  //The KeyCollection offers more, but I am not sure if it is needed in JS TBH - going to leave this alone for now
  //The map.keys() function will return a IterableIterator<TKey> which is what I wanted to do, but for now I will
  //return an Array<TKey> which is far simpler to achieve
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
  get values(): Array<TValue | undefined> {
    var values = new Array<TValue | undefined>();

    for (const v of this._map.values()) {
      values.push(v.value);
    }

    return values;
  }

  //Pass 2 at setting the hashing algorithm with potential lockout
  private testComparer(key: TKey): void {
    //If the comparer is set to something other than Default then don't change anything
    if (this._comparerMode !== ComparerMode.Default) return;

    //If the key does not supply a getHashCode function then the default compare is as good as it can be
    if (!hasGetHashCodeFunction(key)) {
      //Prevent any further redundant checks by locking out the comparer mode
      this._comparerMode = ComparerMode.DefaultLocked;

      return;
    }

    this._comparerMode = ComparerMode.Internal;

    this._getHashCode = (key as any).getHashCode;
  }

  //Since it's impossible to know which function will be called first, a test to see which comparer can
  //be used has to be performed first on each call.
  private hashKey(key: TKey): number {
    this.testComparer(key);

    return this._getHashCode(key);
  }

  add(key: TKey, value: TValue): void {
    const hashCode = this.hashKey(key);

    if (this._map.has(hashCode)) {
      throw new Error(
        `An item with the same key has already been added. Key: ${key}`
      );
    }

    this._map.set(hashCode, { key: key, value: value });
  }

  clear(): void {
    this._map.clear();
  }

  containsKey(key: TKey): boolean {
    const hashCode = this.hashKey(key);

    return this._map.has(hashCode);
  }

  private testTValueEquals(value: TValue): void {
    //If the comparer is set to something other than Default then don't change anything
    if (this._comparerModeTValue !== ComparerMode.Default) return;

    //If the TValue does not supply an equals function then the default compare is as good as it can be
    if (!hasEqualsFunction(value)) {
      //Prevent any further redundant checks by locking out the comparer mode
      this._comparerModeTValue = ComparerMode.DefaultLocked;

      return;
    }

    this._comparerModeTValue = ComparerMode.Internal;

    this._equals = (left: TValue | undefined, right: TValue | undefined) => {
      //If both are undefined then left = right
      if (!left && !right) return true;

      //If left is undefined then left < right
      if (!left) return false;

      //If right is undefined then left > right
      if (!right) return false;

      //If neither is undefined, then do a proper compare
      return (left as any).equals(right);
    };
  }

  //C# will use TValue's internal GetHashCode() and Equals(object) methods. Therefore, to increase its
  //chances of success the user needs to override those methods.
  containsValue(value: TValue): boolean {
    this.testTValueEquals(value);

    //https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html
    for (const kvp of this._map.values()) {
      const v = kvp.value;

      if (this._equals(value, v)) return true;
    }

    return false;
  }

  get(key: TKey): TValue | undefined {
    const hashCode = this.hashKey(key);

    return this._map.get(hashCode)?.value;
  }

  remove(key: TKey): boolean {
    const hashCode = this.hashKey(key);

    return this._map.delete(hashCode);
  }

  //Not worth implementing
  //tryAdd

  //Cannot safely implement out parameters in JavaScript because there is no explicit equivalent
  //tryGetValue
}
