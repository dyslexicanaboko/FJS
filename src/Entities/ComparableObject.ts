import IObject from "../System/IObject.js";
import IEquatable from "../System/IEquatable.js";
import IComparable from "../System/IComparable.js";
import { isNull, getHashCodeForNumber } from "../utils.js";

/**
 * Test object for demonstrating how to implement the IObject{T}, IEquatable{T}, and IComparable{T} interfaces.
 * This is just one step above using a number primitive directly. This way comparisons and equality aren't
 * available by default.
 */
export default class ComparableObject
  implements
    IObject<ComparableObject>,
    IEquatable<ComparableObject>,
    IComparable<ComparableObject>
{
  private _someNumber: number;

  /**
   * @constructor
   * Initialize someNumber to zero.
   */
  public constructor();
  /**
   * @constructor
   * Initialize someNumber.
   */
  public constructor(someNumber: number);
  public constructor(someNumber?: number) {
    this._someNumber = someNumber ?? 0;
  }

  /** @property {number} someNumber - a number */
  get someNumber(): number {
    return this._someNumber;
  }

  set someNumber(someNumber: number) {
    this._someNumber = someNumber;
  }

  /**
   * Compare the equality of two `ComparableObject`s. JavaScript does not have operator (===)
   * overloading, therefore methods are all that can be used.
   * @param {ComparableObject} other - A different object to compare equality to.
   * @returns {boolean} - True if the objects are equal, false otherwise.
   */
  equals(other: ComparableObject): boolean {
    //If other is undefined or null then return true
    if (isNull(other)) return true;

    //If other is the same instance then return true
    if (this === other) return true;

    //If other is not an instance of ComparableObject then return false
    if (!(other instanceof ComparableObject)) return false;

    return this._someNumber === other.someNumber;
  }

  /**
   * Compare the inequality of two `ComparableObject`s. JavaScript does not have operator (!==) overloading,
   * therefore methods are all that can be used. This is for convenience only and cannot be expected
   * to be implemented.
   * @param {ComparableObject} other - A different object to compare equality to.
   * @returns {boolean} - True if the objects are not equal, false otherwise.
   */
  notEquals(other: ComparableObject): boolean {
    return !this.equals(other);
  }

  /**
   * Get the hash code for this object. This is technically inherited from System.Object automatically in C#,
   * but since JavaScript does not have a notion of hashing, then I am using an interface to enforce it.
   * @returns {number} - A number representing the hash code for this object.
   */
  getHashCode(): number {
    return getHashCodeForNumber(this._someNumber);
  }

  /**
   * Compare two `ComparableObject`s to determine which is less than, equal to or greater than the other.
   * JavaScript does not have operator overloading (<, >, <=, >=), therefore the object's properties must
   * be tested directly.
   * @param {ComparableObject} other - A different object to compare against.
   * @returns {number} - One if this is greater than other, zero if they are equal, and negative one if this is less than other.
   */
  compareTo(other: ComparableObject): number {
    //If both are undefined then this = other
    if (isNull(other)) return 1;

    //If other is not undefined, then do a proper compare
    if (this.someNumber < other.someNumber) return -1;

    if (this.someNumber === other.someNumber) return 0;

    //if(this > other)
    return 1;
  }
}
