import IObject from "./IObject.js";

export default class TestObject implements IObject<TestObject> {
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

  equals(other: TestObject) {
    return this._someNumber === other.someNumber;
  }

  getHashCode(): number {
    return -7;
  }

  toString(): string {
    return Object.prototype.toString();
  }
}
