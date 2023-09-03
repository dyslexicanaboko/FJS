//https://learn.microsoft.com/en-us/dotnet/api/system.array
//https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
//https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
export default class List<T> {
  private _arr: Array<T>;

  public constructor(array: Array<T>) {
    this._arr = array;
  }

  //This comes from `System.Linq`, but it is so useful I am including it. I might move it to an extension library later.
  any(): boolean {
    return this.count() > 0;
  }

  count(): number {
    return this._arr.length;
  }

  add(item: T): void {
    this._arr.push(item);
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

    return !deleted || deleted.length === 0;
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
  }

  removeRange(index: number, count: number): void {
    this._arr.splice(index, count);
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

  toArray(): Array<T> {
    return this._arr;
  }

  //Not sure I can implement this considering JS can't really do it
  //trimExcess
}
