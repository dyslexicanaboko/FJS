import ElementType from "../ElementType.js";
import {
  defaultComparer,
  hasCompareToFunction,
  hasEqualsFunction,
} from "../../../utils.js";

//https://learn.microsoft.com/en-us/dotnet/api/system.array
//https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
//https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
export default class List<T> {
  private _arr: Array<T>;
  private _nextIndex: number;

  public constructor(array: Array<T> = []) {
    this._arr = array;

    //If an array is provided with an initial capacity, then all of its elements will be `undefined` because JavaScript
    if (this.any() && this._arr.every(this.allUndefined)) {
      //In this case - overwrite everything starting at index 0
      this._nextIndex = 0;
    } else {
      this._nextIndex = this.count;
    }
  }

  //I am going to use an O(n) linear search for now. I am not sure if I can improve it in JavaScript.
  //TODO: I ran into a problem where the array did not have a zero index. I think raising an error
  //is the best option at the moment.
  private linearSearch(item: any): ElementType<T> {
    for (let i = 0; i < this.count; i++) {
      const found = this._arr[i];

      if (item.equals(found)) return { index: i, value: found };
    }

    return { index: -1, value: undefined };
  }

  private allUndefined(element: T): boolean {
    return element === undefined;
  }

  //Keeping this for now because I might need it later
  // private isNull(item: any): void {
  //   if (item === null || item === undefined) {
  //     throw new Error("Object cannot be null or undefined.");
  //   }
  // }

  //This comes from `System.Linq`, but it is so useful I am including it. There isn't a notion of an extension function in JavaScript
  //So for now, unless I change my mind, these are staying inside the class.
  any(): boolean {
    return this.count > 0;
  }

  get count(): number {
    return this._arr.length;
  }

  //I considered implementing this method to mimic the Capacity property, but there isn't really an
  //equivalent in JavaScript without going through a lot of trouble for the sake of it and no gain.
  // capacity(): number {
  //   return this._arr.length;
  // }

  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
   * There is another JavaScript crackhead problem I have rediscovered, but I am not sure how to deal with yet.
   * The push function will only append to the END of the array, it will not used pre-declared space if initial
   * capacity is specified. For example, if you provide an initialized array of size 3, then push 3 elements,
   * your array size is then 6. The crackhead array size initialization provides you with 3 elements of undefined (thanks?).
   * Then the 3 items you intended to add to the array increases the size to 6.
   *
   * JavaScript does not have a true add function, therefore you must overwrite items by index.
   * Here is a lot of banter about setting the capacity of an array:
   * https://stackoverflow.com/questions/4852017/how-to-initialize-an-arrays-length-in-javascript */
  add(item: T): void {
    //Through the power of crackhead magic, this syntax functions as two things:
    //1. Store the supplied item at this index (overwrite).
    //2. Add a new element to the end of the array and increase the array's size by one
    //The Array object is not a true Array because it's mutable. It's just a poorly implemented list that sometimes wants to be a queue.
    //If this was done on a C# List<T>, even if there is Capacity, an `ArgumentOutOfRangeException` would be thrown.
    this._arr[this._nextIndex] = item;

    this._nextIndex++;
  }

  addRange(items: Array<T>): void {
    items.forEach((item) => {
      this.add(item);
    });
  }

  clear(): void {
    const count = this.count;

    //Pop everything off into the ether
    for (let i = 0; i < count; i++) {
      this._arr.pop();
    }

    this._nextIndex = 0;
  }

  contains(item: T): boolean {
    if (hasEqualsFunction(item)) {
      return this.linearSearch(item).value !== undefined;
    }

    return this._arr.includes(item);
  }

  copyTo(array: Array<T>): void {
    array.push(...this._arr);
  }

  //This comes from `System.Linq`, but it is so useful I am including it. Same as `any()` above.
  //Conscious decision to return another List<T> instead of IEnumerable<T> because that's a whole other can of worms.
  //I could return an Array, but I don't see the point if it's going to be turned right back into a List potentially.
  //There is the `toArray()` function if anything.
  distinct(): List<T> {
    const lst = new List<T>();

    //O(n^2) bubble search, not the most efficient way to do this, but okay for now
    this.forEach((item) => {
      if (!lst.contains(item)) {
        lst.add(item);
      }
    });

    return lst;
  }

  exists(predicate: (item: T) => boolean): boolean {
    return this._arr.some(predicate);
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this._arr.find(predicate);
  }

  findAll(predicate: (item: T) => boolean): List<T> {
    return new List<T>(this._arr.filter(predicate));
  }

  findIndex(predicate: (item: T) => boolean): number {
    return this._arr.findIndex(predicate);
  }

  forEach(action: (item: T) => void): void {
    this._arr.forEach((x) => {
      action(x);
    });
  }

  /* Indexer syntax doesn't appar to work on TypeScript classes. You can only use indexer syntax on interfaces,
   * but this class cannot implement it which defeats the purpose.
   *   https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
   *   https://stackoverflow.com/a/14851245/603807
   *
   * //Desired TypeScript code
   * [index: number] : T {
   *   return this._arr[index];
   * }
   *
   * It appears that in JavaScript it may be possible via a Proxy
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
   * https://stackoverflow.com/a/49095109/603807
   * https://github.com/ayonli/indexable  //Looks more complicated than it's worth
   * */
  //This is a compromise for there not being user accessible indexers in TypeScript/JavaScript SDK
  get(index: number): T {
    //Might want to use at(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at
    return this._arr[index];
  }

  getRange(index: number, count: number): List<T> {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
    //Slice uses start and end indices therefore this has to be accounted for like so:
    const end = index + count;

    return new List<T>(this._arr.slice(index, end));
  }

  indexOf(item: T): number {
    if (hasEqualsFunction(item)) {
      return this.linearSearch(item).index;
    }

    return this._arr.indexOf(item);
  }

  private isInBounds(index: number): void {
    if (index < 0) {
      throw new Error("Index must be greater than or equal to zero.");
    }

    if (index > this.count) {
      throw new Error("Index must be within the bounds of the List.");
    }
  }

  insert(index: number, item: T): void {
    this.isInBounds(index);

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    //It has always pissed me off that this was so similarly named to `slice`, also why not just call it `insert`?
    //Tells me the person who designed this was probably working with cassette tapes.
    this._arr.splice(index, 0, item);

    this._nextIndex++;
  }

  insertRange(index: number, items: T[]): void {
    this.isInBounds(index);

    this._arr.splice(index, 0, ...items);

    this._nextIndex = this.count;
  }

  remove(item: T): boolean {
    const i = this.indexOf(item);

    if (i < 0) return false;

    const deleted = this._arr.splice(i, 1);

    if (deleted && deleted.length > 0) {
      this._nextIndex--;

      return true;
    }

    return false;
  }

  removeAll(predicate: (item: T) => boolean): number {
    var found = this.findAll(predicate);

    if (!found) return 0;

    let c = 0;

    //TODO: This is not performant - will try to figure out a better method later
    found.forEach((item) => {
      if (this.remove(item)) {
        c++;
      }
    });

    return c;
  }

  removeAt(index: number): void {
    this.isInBounds(index);

    this._arr.splice(index, 1);

    this._nextIndex--;
  }

  removeRange(index: number, count: number): void {
    this.isInBounds(index);

    this._arr.splice(index, count);

    this._nextIndex = this.count;
  }

  reverse(): void {
    this._arr.reverse();
  }

  sort(comparison?: (left: T, right: T) => number): void {
    if (!this.any()) return;

    //Plan A. If the user provided a comparison function then use it
    if (comparison) {
      this._arr.sort(comparison);

      return;
    }

    //Otherwise, Plan B. attempt to use `IComparable<T>` from item of type T
    //Pull any surrogate item to test with, hopefully it's not undefined (WIP)
    let item = this.get(0);

    if (item) {
      //Check if the item has a compareTo function
      if (hasCompareToFunction(item)) {
        comparison = (left: T, right: T) => {
          return (left as any).compareTo(right);
        };

        this._arr.sort(comparison);

        return;
      }
    }

    //Finally, Plan C. use the default comparer which may not work for complex types.
    //The behavior in C# is to throw an exception if at least one type doesn't implement `IComparable<T>`
    this._arr.sort(defaultComparer);
  }

  //Can be used to access the indexer too, which is not sexy
  toArray(): Array<T> {
    return this._arr;
  }

  /* I was on the fence about implementing this function considering JS can't really do it. There isn't really a way to track
   * excess capacity in JS. Managed arrays (List<T>) in C# have a concept of capacity and count. Capacity is the total size of
   * the array, count is the number of elements in the array. The closest we can get to the concept of excess capacity in a
   * JS array is having undefined elements. The problem is it is that it is not possible to tell the difference between elements
   * that are intentionally undefined and an element that is undefined because it was never initialized as such.
   *
   * The only rational thing I can think of is to purge all undefined elements when working with primitives only.
   * My original hang up was that this is not going to be acceptable for complex types since they can legitamately be undefined.
   * But then I started thinking about how C# 8 handles things and realized I can make the same excuses it makes. TypeScript
   * already does this where it doesn't allow for undefined unless explicitly allowed. This is the same idea as nullable
   * reference types. Like a nullable string. */
  //https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1.trimexcess
  trimExcess(): void {
    //If the array is empty, then there is no excess capacity to trim
    if (!this.any()) return;

    //If the array is full, then there is no excess capacity to trim
    if (this.count === this._arr.length) return;

    //Find all undefined elements and remove them. The only way undefined elements can get into the List is if
    //the initial array provided has its size set.
    this.removeAll(this.allUndefined);
  }
}
