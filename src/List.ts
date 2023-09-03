//https://learn.microsoft.com/en-us/dotnet/api/system.array
//https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
//https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
export default class List<T> {
  private _arr: Array<T>;

  public constructor(array: Array<T>) {
    this._arr = array;
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

  //contains

  copyTo(array: Array<T>): void {
    array.push(...this._arr);
  }

  //exists

  //find

  //findAll

  //findIndex

  //getRange

  //indexOf

  //insert

  //insertRange

  //remove

  //removalAll

  //removeAt

  //removeRange

  //reverse

  //sort

  //toArray

  //trimExcess
}
