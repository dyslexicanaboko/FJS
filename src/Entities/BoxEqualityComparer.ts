import IEqualityComparer from "../System/Collections/Generic/IEqualityComparer.js";
import { getHashCodeForNumber } from "../utils.js";
import BoxObject from "./BoxObject.js";

/**
 * This class is used to compare two BoxObject instances.
 * I am shamelessly copying the example from the documentation
 * https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.iequalitycomparer-1
 * https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.equalitycomparer-1
 * @class BoxEqualityComparer
 */
export default class BoxEqualityComparer
  implements IEqualityComparer<BoxObject>
{
  /**
   * Compare two BoxObject instances.
   * @param left left BoxObject.
   * @param right right BoxObject.
   * @returns true if they are equal, false if they are different.
   */
  public equals(
    left: BoxObject | undefined,
    right: BoxObject | undefined
  ): boolean {
    if (left === undefined && right === undefined) return true;

    if (left === undefined || right === undefined) return false;

    return (
      left.height === right.height &&
      left.length === right.length &&
      left.width === right.width
    );
  }

  /**
   * Get the hash code for a BoxObject instance.
   * @param obj BoxObject instance.
   * @returns hash code.
   */
  public getHashCode(obj: BoxObject): number {
    const hCode = obj.height ^ obj.length ^ obj.width;

    //This function call can be skipped, but it is here for demonstration purposes.
    return getHashCodeForNumber(hCode);
  }
}
