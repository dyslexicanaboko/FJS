import { hasEqualsFunction, hasGetHashCodeFunction } from "../../../utils.js";
import IEqualityComparer from "./IEqualityComparer.js";
import KeyValuePair from "./KeyValuePair.js";

//https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
export default class Dictionary<TKey, TValue> {
  private _map: Map<TKey, TValue>;
  private _comparer: IEqualityComparer<TKey> | undefined;

  public constructor(map: Map<TKey, TValue>) {
    this._map = map;
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
  get keys(): IterableIterator<TKey> {
    return this._map.keys();
  }

  //https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2.valuecollection
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
  //Same as `keys()`
  get values(): IterableIterator<TValue> {
    return this._map.values();
  }

  add(key: TKey, value: TValue): void {
    //Might have to hash the key here
    //Need to throw an error on duplicates
    this._map.set(key, value);
  }

  clear(): void {
    this._map.clear();
  }

  containsKey(key: TKey): boolean {
    if (hasGetHashCodeFunction(key)) {
      return this.linearSearchKey(key) !== undefined;
    }

    return this._map.has(key);
  }

  //TODO: I am not sure how C# handles search on values right now
  containsValue(value: TValue): boolean {
    //https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.equalitycomparer-1.default
    if (hasEqualsFunction(value)) {
      return this.linearSearchValue(value) !== undefined;
    }

    //https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html
    for (const v of this._map.values()) {
      if (v === value) return true;
    }

    return false;
  }

  get(key: TKey): TValue | undefined {
    if (hasGetHashCodeFunction(key)) {
      return this.linearSearchKey(key)?.value;
    }

    return this._map.get(key);
  }

  remove(key: TKey): boolean {
    if (!hasGetHashCodeFunction(key)) return this._map.delete(key);

    const kvp = this.linearSearchKey(key);

    if (!kvp) return false;

    return this._map.delete(kvp.key);
  }

  //Not worth implementing
  //tryAdd

  //Cannot safely implement out parameters in JavaScript because there is no explicit equivalent
  //tryGetValue

  private linearSearchKey(item: any): KeyValuePair<TKey, TValue> | undefined {
    for (const key of this._map.keys()) {
      if (item.equals(key)) return { key: key, value: this._map.get(key) };
    }

    return undefined;
  }

  private linearSearchValue(item: any): TValue | undefined {
    for (const value of this._map.values()) {
      if (item.equals(value)) return value;
    }

    return undefined;
  }
}
