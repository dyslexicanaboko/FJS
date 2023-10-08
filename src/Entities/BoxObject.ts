/**
 * This object exists without ways to perform equality and comparison on purpose to
 * demonstrate how to implement the IEqualityComparer<T> interface.
 * @class ComparableObject
 */
export default class ComparableObject {
  private _length: number;
  private _width: number;
  private _height: number;

  public constructor(length: number, width: number, height: number) {
    this._length = length;
    this._width = width;
    this._height = height;
  }

  get length(): number {
    return this._length;
  }

  set length(someNumber: number) {
    this._length = someNumber;
  }

  get width(): number {
    return this._width;
  }

  set width(someNumber: number) {
    this._width = someNumber;
  }

  get height(): number {
    return this._height;
  }

  set height(someNumber: number) {
    this._height = someNumber;
  }
}
