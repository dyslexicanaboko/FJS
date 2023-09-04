//https://learn.microsoft.com/en-us/dotnet/api/system.array
//https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
//https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
export default class List<T> {
  private _arr: Array<T>;
  private _nextIndex: number;

  public constructor(array: Array<T> = []) {
    this._arr = array;

    //If an array is provided with an initial capacity, then all of its elements will be `undefined`
    if (this.any() && this._arr.every(this.allUndefined)) {
      //In this case - overwrite everything starting at index 0
      this._nextIndex = 0;
    } else {
      //If the whole array is not `undefined`, then just point to the next index at the end of the array
      // console.warn(
      //   "The provided array contains `undefined` elements. Was this intentional?"
      // );

      this._nextIndex = this.count();
    }
  }

  private allUndefined(element: T): boolean {
    return element === undefined;
  }

  //This comes from `System.Linq`, but it is so useful I am including it. I might move it to an extension library later.
  any(): boolean {
    return this.count() > 0;
  }

  count(): number {
    return this._arr.length;
  }

  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
   * There is another JavaScript crackhead problem I have rediscovered, but I am not sure how to deal with yet.
   * The push function will only append to the END of the array, it will not used pre-declared space if initial
   * capacity is specified. For example, if you provide an initialized array of size 3, then push 3 elements,
   * your array size is then 6. The crackhead array size initialization provides you with 3 elements of undefined (thanks?).
   * Then the 3 items you intended to add to the array increases the size to 6.
   *
   * JavaScript does not have a true add function, therefore you must overwrite items by index.
   * There is a lot of banter about setting the capacity of an array:
   * https://stackoverflow.com/questions/4852017/how-to-initialize-an-arrays-length-in-javascript */
  add(item: T): void {
    //Through the power of crackhead magic, this syntax functions as two things:
    //1. Store the supplied item at this index (overwrite).
    //2. Add a new element to the end of the array and increase the array's size by one
    //The Array object is not a true Array because it's mutable. It's just a poorly implemented list that sometimes wants to be a queue.
    this._arr[this._nextIndex] = item;

    this._nextIndex++;
  }

  addRange(items: Array<T>): void {
    items.forEach((item) => {
      this.add(item);
    });
  }

  clear(): void {
    const count = this.count();

    //Pop everything off into the ether
    for (let i = 0; i < count; i++) {
      this._arr.pop();
    }

    this._nextIndex = 0;
  }

  contains(item: T): boolean {
    return this._arr.includes(item);
  }

  copyTo(array: Array<T>): void {
    array.push(...this._arr);
  }

  exists(predicate: (item: T) => boolean): boolean {
    return this._arr.some(predicate);
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this._arr.find(predicate);
  }

  findAll(predicate: (item: T) => boolean): List<T> | undefined {
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
    return this._arr.indexOf(item);
  }

  insert(index: number, item: T): void {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    //It has always pissed me off that this was so similarly named to `slice`, also why not just call it `insert`?
    //Tells me the person who designed this was probably working with cassette tapes.
    this._arr.splice(index, 0, item);
  }

  insertRange(index: number, items: T[]): void {
    this._arr.splice(index, 0, ...items);
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

  removaAll(predicate: (item: T) => boolean): number {
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
    this._arr.splice(index, 1);

    this._nextIndex--;
  }

  removeRange(index: number, count: number): void {
    this._arr.splice(index, count);

    this._nextIndex = this.count();
  }

  reverse(): void {
    this._arr.reverse();
  }

  //Is left -1 <, 1 >, 0 = then right
  private defaultComparer(left: T, right: T): number {
    //If both are undefined then left = right
    if (!left && !right) return 0;

    //If left is undefined then left < right
    if (!left) return -1;

    //If right is undefined then left > right
    if (!right) return 1;

    //If neither is undefined, then do a proper compare
    if (left < right) return -1;

    if (left === right) return 0;

    //if(left > right)
    return 1;
  }

  sort(comparison: (left: T, right: T) => number | undefined): void {
    let comparer;

    if (!comparison) {
      comparer = this.defaultComparer;
    }

    this._arr.sort(comparer);
  }

  //Can be used to access the indexer too, which is not sexy
  toArray(): Array<T> {
    return this._arr;
  }

  //Not sure I can implement this considering JS can't really do it
  //I will try to look into it last
  //trimExcess
}
