import IObject from "../System/IObject.js";
import IEquatable from "../System/IEquatable.js";
import IComparable from "../System/IComparable.js";

export default class ComparableObject
  implements
    IObject<ComparableObject>,
    IEquatable<ComparableObject>,
    IComparable<ComparableObject>
{
  private _someNumber: number;

  public constructor();
  public constructor(someNumber: number);
  public constructor(someNumber?: number) {
    this._someNumber = someNumber ?? 0;
  }

  get someNumber(): number {
    return this._someNumber;
  }

  set someNumber(someNumber: number) {
    this._someNumber = someNumber;
  }

  //Since JavaScript does not have operator overloading then we must use methods
  equals(other: ComparableObject) {
    //If other is undefined or null then return true
    if (other === undefined || other === null) return true;

    //If other is the same instance then return true
    if (this === other) return true;

    //If other is not an instance of ComparableObject then return false
    if (!(other instanceof ComparableObject)) return false;

    return this._someNumber === other.someNumber;
  }

  //This is for convenience only and cannot be expected to be implemented
  notEquals(other: ComparableObject) {
    return !this.equals(other);
  }

  //This is technically inherited from System.Object automatically, but since JavaScript
  //does not have a notion of hashing, then I am using an interface to enforce it.
  getHashCode(): number {
    return -7;
  }

  compareTo(other: ComparableObject): number {
    //If both are undefined then this = other
    if (!this && !other) return 0;

    //If this is undefined then this < other
    if (!this) return -1;

    //If other is undefined then this > other
    if (!other) return 1;

    //If neither is undefined, then do a proper compare
    if (this.someNumber < other.someNumber) return -1;

    if (this.someNumber === other.someNumber) return 0;

    //if(this > other)
    return 1;
  }
}
