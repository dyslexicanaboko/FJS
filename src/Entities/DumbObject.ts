export default class DumbObject {
  private _someNumber: number;

  public constructor(someNumber: number) {
    this._someNumber = someNumber;
  }

  get someNumber(): number {
    return this._someNumber;
  }

  set someNumber(someNumber: number) {
    this._someNumber = someNumber;
  }

  equals(other: DumbObject) {
    return this._someNumber === other.someNumber;
  }

  getHashCode(): number {
    return -7;
  }

  toString(): string {
    return `TestObject: ${this._someNumber}`;
  }
}
