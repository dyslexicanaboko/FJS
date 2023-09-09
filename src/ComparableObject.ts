import IObject from "./IObject.js";

export default class ComparableObject implements IObject<ComparableObject> {
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

  equals(other: ComparableObject) {
    return this._someNumber === other.someNumber;
  }

  getHashCode(): number {
    return -7;
  }

  toString(): string {
    return `TestObject: ${this._someNumber}`;
  }
}
