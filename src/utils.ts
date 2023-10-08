import DateTime from "./System/DateTime.js";
import Guid from "./System/Guid.js";

/**
 * Testing if an item is null or undefined.
 * @param item any object.
 * @returns true if it is null or undefined, false if it is not.
 */
export const isNull = (item: any): boolean =>
  item === null || item === undefined;

/**
 * Default object comparison function between left and right instances.
 * @param left left type T instance
 * @param right right type T instance
 * @returns Negative one if left is less than right. Zero if left and right are equal. One if left is greater than right.
 */
export const defaultComparer = <T>(left: T, right: T): number => {
  //If both are undefined then left = right
  if (isNull(left) && isNull(right)) return 0;

  //If left is undefined then left < right
  if (isNull(left)) return -1;

  //If right is undefined then left > right
  if (isNull(right)) return 1;

  //If neither is undefined, then do a proper compare
  if (left < right) return -1;

  if (left === right) return 0;

  //if(left > right)
  return 1;
};

/**
 * Default object equality function between left and right instances.
 * If both instances are null or undefined, then they are equal.
 * If one instance is null or undefined, then they are not equal.
 * Lastly, use the equals function provided by the left instance.
 * @param left left type T instance
 * @param right right type T instance
 * @returns true if they are equal, false if they are different.
 */
export const defaultEquals = (left: any, right: any): boolean => {
  //Using explicit long compare because the short hand is not working
  //const num = 0;  will yield true when testing `!num`
  //const arr = []; will yield false when testing `!arr`
  //Not helpful JavaScript...

  //If both are undefined then for all intents and purposes they are equal
  if (isNull(left) && isNull(right)) return true;

  //If left is undefined then not equal
  if (isNull(left)) return false;

  //If right is undefined then not equal
  if (isNull(right)) return false;

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
/**
 * Check if the provided object has an equals function.
 * @param target object to test.
 * @returns true if the object has an equals function, false if it does not.
 */
export const hasEqualsFunction = (target: any): boolean => {
  return typeof target.equals === "function";
};

//IComparable<T>
/**
 * Check if the provided object has a compareTo function.
 * @param target object to test.
 * @returns true if the object has a compareTo function, false if it does not.
 */
export const hasCompareToFunction = (target: any): boolean => {
  return typeof target.compareTo === "function";
};

//Native to System.Object as GetHashCode()
/**
 * Check if the provided object has a getHashCode function.
 * @param target object to test.
 * @returns true if the object has a getHashCode function, false if it does not.
 */
export const hasGetHashCodeFunction = (target: any): boolean => {
  return typeof target.getHashCode === "function";
};

/**
 * Generate hash code for a number.
 * @param target the instance to get the hash code for.
 * @returns hash code.
 */
export const getHashCodeForNumber = (target: number): number => target;

/**
 * Generate hash code for a boolean.
 * @param target the instance to get the hash code for.
 * @returns hash code.
 */
export const getHashCodeForBoolean = (target: boolean): number =>
  target ? 1 : 0;

//https://github.com/Microsoft/referencesource/blob/master/mscorlib/system/string.cs#L833
//This is an adaptation of the C# algorithm. They cannot syntactically be the same because
//JavaScript doesn't have user accessible pointers
/**
 * Generate hash code for a string. This is an adaptation of the C# algorithm.
 * https://github.com/Microsoft/referencesource/blob/master/mscorlib/system/string.cs#L833
 * @param target the instance to get the hash code for.
 * @returns hash code.
 */
export const getHashCodeForString = (target: string): number => {
  let hash1 = 5381;
  let hash2 = hash1;

  let s = getCharCodes(target); //char *s = src;
  let c: number; //int c;

  //Based on what I currently understand, the C# algorithm takes the character array and iterates over it
  //by two bytes at a time. Each frame is hashed using the hash1 and hash2 variables.
  for (let i = 0; i < s.length; i++) {
    c = s[i]; //Get frame

    if (i % 2 === 0) {
      //Frame 1 gets the event indices
      hash1 = ((hash1 << 5) + hash1) ^ c;
    } else {
      //Frame 2 gets the odd indices
      hash2 = ((hash2 << 5) + hash2) ^ c;
    }
  }

  //https://stackoverflow.com/questions/23577810/simulate-a-32-bit-integer-overflow-in-javascript
  //The main difference between this and the C# algorithm is that the C# algorithm is running this
  //code in unchecked mode. This means that the integer overflow is ignored. In JavaScript you can
  //use the Math.imul() function to simulate this same behavior.
  return hash1 + Math.imul(hash2, 1566083941);
};

/**
 * Generate hash code for a BigInt. If an error occurs then a random hash code is returned.
 * A console warning will be issued if this happens.
 * @param target the instance to get the hash code for.
 * @returns hash code.
 */
export const getHashCodeForBigInt = (target: bigint): number => {
  try {
    //This is probably a bad idea, hence the try/catch
    return parseInt(target.toString());
  } catch (error) {
    console.warn(
      "BigInt conversion to int failed. A random hash code has been used instead."
    );

    return getHashCodeRandom();
  }
};

//DateTime is encapsulating a JS Date object, so it is going to use the same hashing algorithm
/**
 * Generate hash code for a DateTime. Based off of C#'s DateTime hashing algorithm.
 * https://github.com/Microsoft/referencesource/blob/master/mscorlib/system/datetime.cs#L979
 * @param target the instance to get the hash code for.
 * @returns hash code.
 */
export const getHashCodeForDateTime = (target: DateTime): number =>
  getHashCodeForTotalMilliseconds(target.totalMilliseconds);

//As stated before - there are no Ticks in JavaScript, so total milliseconds is as precise as it gets
/**
 * Generate hash code for a Date. Functionally equivalent to DateTime's getHashCodeForDateTime.
 * @param target the instance to get the hash code for.
 * @returns hash code.
 */
export const getHashCodeForDate = (target: Date): number =>
  getHashCodeForTotalMilliseconds(target.getTime());

//https://github.com/Microsoft/referencesource/blob/master/mscorlib/system/datetime.cs#L979
//This will not be one to one with the C# algorithm because JavaScript doesn't support the concept of ticks.
//Frankly it probably can, but I am not going to kill myself to get that to work.
/**
 * Generate hash code for a milliseconds. Driver for Date and DateTime.
 * @param target the instance to get the hash code for.
 * @returns hash code.
 */
const getHashCodeForTotalMilliseconds = (kindOfLikeTicks: number): number => {
  //Int64 ticks = InternalTicks;
  //return unchecked((int)ticks) ^ (int)(ticks >> 32);

  //The only way to properly shift the value was to use BigInt
  const shift = BigInt(kindOfLikeTicks) >> 32n;

  //This will simulate the overflow like the C# algorithm
  return kindOfLikeTicks ^ parseInt(shift.toString());
};

/**
 * Generate hash code for a any type. It's better to not use this function if you know what the type is already.
 * This is a catch all for any type that does not implement the getHashCode function and it will be inefficient.
 * @param target the instance to get the hash code for.
 * @returns hash code.
 */
export const getHashCodeForAny = (target: any): number => {
  //The if statements are ordered by most likely to least likely
  if (typeof target === "number") return getHashCodeForNumber(target);

  if (typeof target === "string") return getHashCodeForString(target);

  if (typeof target === "boolean") return getHashCodeForBoolean(target);

  if (target instanceof Date) return getHashCodeForDate(target);

  if (target instanceof DateTime) return getHashCodeForDateTime(target);

  if (typeof target === "bigint") return getHashCodeForBigInt(target);

  //This is the catch all for any object that does not implement the getHashCode function. A crappy random number
  //is returned, but it's the best you can have if you don't implement the getHashCode function. It will be as
  //crappy in C# when you don't implement the GetHashCode method.
  return getHashCodeRandom();
};

/**
 * Get the character codes for a string.
 * @param str target string.
 * @returns array of character codes.
 */
const getCharCodes = (str: string): number[] => {
  const charCodes: number[] = [];

  for (let i = 0; i < str.length; i++) {
    charCodes.push(str.charCodeAt(i));
  }

  return charCodes;
};

/**
 * Generate a meaningless crappy random number as a hash code. If you are using this, you are doing it wrong unless it's for
 * demonstrations or you have not implemented the getHashCode function yet. This is an implementation that mimics what
 * C# does when you don't implement the GetHashCode method. Instead C# uses the memory location of the object. Once the
 * hash code is set, it will not change regardless of how that object is mutated.
 * @param target the instance to get the random hash code for.
 * @returns random hash code.
 */
export const getHashCodeRandom = (): number => {
  //Hashcodes can be negative sometimes, so sure why not
  const polarity = (Math.random() * 100000) % 2 === 0 ? 1 : -1;

  //This is a crappy random number, but it's the best you can do if you don't implement the getHashCode function
  return polarity * Math.round(Math.random() * 100000000000);
};

//TODO: Should I have a separate function to just check established types? Essentially, types that are known to implement the getHashCode function?
/**
 * Determine if the provided object is a primitive type. This biased function includes the JavaScript definition,
 * but also purposely includes `Date` and `DateTime`. My bias is that if you are using certain types as globally
 * recognized building blocks, then they are primitive types. The only reason I can get away with this right now
 * is because there is no such official thing as hashing in JavaScript. This could change later.
 * @param target the instance to get the hash code for.
 * @returns hash code.
 */
export const isPrimitiveType = (target: any): boolean => {
  return (
    typeof target === "string" ||
    typeof target === "number" ||
    typeof target === "bigint" ||
    typeof target === "boolean" ||
    typeof target === "symbol" ||
    //These types will be put here for now... might change my mind later
    //This is not in-line with C#
    target instanceof Date ||
    target instanceof DateTime ||
    target instanceof Guid
  );
};
