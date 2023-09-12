//Is left -1 <, 1 >, 0 = then right
export const defaultComparer = <T>(left: T, right: T): number => {
  //If both are undefined then left = right
  if (!left && !right) return 0;

  //If left is undefined then left < right
  if (!left) return -1;

  //If right is undefined then left > right
  if (!right) return 1;

  //If neither is undefined, then do a proper compare
  if (left < right) return -1;

  if (left === right) return 0;

  //if(left > right)
  return 1;
};

export const defaultEquals = (left: any, right: any): boolean => {
  //If both are undefined then left = right
  if (!left && !right) return true;

  //If left is undefined then left < right
  if (!left) return false;

  //If right is undefined then left > right
  if (!right) return false;

  //If neither is undefined, then do a proper compare
  return left.equals(right);
};

/* There isn't an available way to check if the type T being passed into this class:
 *   1. implements an interface
 *   2. extends another class
 *   3. is a primitive type
 *
 * There isn't a way to instantiate a type of T either. Doesn't matter if there is a
 * default constructor.
 *
 * There is no way to check if type T may or may not have a function with a particular name.
 * Therefore, I am using the old hacky JavaScript way of testing incoming objects as though
 * they are anonymous to gain lee way. I hope TypeScript improves this in the future. */
//Native to System.Object as Equals(object other), but also as IEquatable<T> as Equals(T other)
export const hasEqualsFunction = (item: any): boolean => {
  return typeof item.equals === "function";
};

//IComparable<T>
export const hasCompareToFunction = (item: any): boolean => {
  return typeof item.compareTo === "function";
};

//Native to System.Object as GetHashCode()
export const hasGetHashCodeFunction = (item: any): boolean => {
  return typeof item.getHashCode === "function";
};

export const defaultGetHashCode = (key: any): number => {
  //TODO: Primitives will have a default hashing algorithm, but complex types won't
  if (typeof key === "number") return key;

  //This is crappy, but it's the best you can have if you don't implement the getHashCode function
  //It will be as crappy in C# when you don't implement the GetHashCode function
  return Math.round(Math.random() * 100000000000);
};
