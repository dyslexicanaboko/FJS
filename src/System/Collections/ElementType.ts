/**
 * When searching an array, it is sometimes convenient to be able to return
 * the value and index if found. If they are not found then the default
 * values of `undefined` and `-1` should be returned respectively.
 * @type {ElementType<T>}
 */
export type ElementType<T> = {
  index: number;
  value: T | undefined;
};

/**
 * Enumeration for keeping track of which comparer mode is being used.
 * @enum {number}
 */
export enum ComparerMode {
  //Default comparer is always used initially unless it can be changed.
  Default,
  //Default locked indicates that the default comparer is being used and cannot be changed.
  //The type being checked does not provide functions for comparing equality or getting a hash code.
  //Therefore, checking more than once is pointless and therefore the check will be locked out.
  DefaultLocked,
  //External is used when the comparer was provided explicitly aside from the Type being worked with.
  External,
  //Internal is used when the comparer is provided by the Type being worked with.
  Internal,
}
