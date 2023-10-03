import { getHashCodeRandom } from "../utils.js";

/**
 * Test object for demonstrating the behavior of the object when the IObject{T}, IEquatable{T},
 * and IComparable{T} interfaces are not implemented.
 */
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

  //Initialized and locked in for the life of the object.
  private _hashCode: number = getHashCodeRandom();

  /**
   * This is the pseudo-equivalent of not implementing getHashCode() like in C#. In C# the memory location
   * is returned normally for objects who don't have a getHashCode() implementation. Additionally, the
   * HashCode the object is initialized with will not be altered even if the properties of the class are changed.
   * There is no way to do that in JS, so I am returning a random number instead.
   * @returns {number} - A random number.
   */
  getHashCode(): number {
    return this._hashCode;
  }

  /**
   * A not very useful `toString()` implementation.
   * @returns {string} - A string representation of the object.
   */
  toString(): string {
    return `TestObject: ${this._someNumber}`;
  }
}
