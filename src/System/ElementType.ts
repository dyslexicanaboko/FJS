/* When searching an array, it is sometimes convenient to be able to return
 * the value and index if found. If they are not found then the default
 * values of undefined and -1 should be returned respectively. */
type ElementType<T> = {
  index: number;
  value: T | undefined;
};

export default ElementType;
