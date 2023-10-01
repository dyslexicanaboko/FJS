import DateTime from "./System/DateTime.js";

//Keeping this for now because I might need it later
export const isNull = (item: any): boolean =>
  item === null || item === undefined;

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
export const hasEqualsFunction = (target: any): boolean => {
  return typeof target.equals === "function";
};

//IComparable<T>
export const hasCompareToFunction = (target: any): boolean => {
  return typeof target.compareTo === "function";
};

//Native to System.Object as GetHashCode()
export const hasGetHashCodeFunction = (target: any): boolean => {
  return typeof target.getHashCode === "function";
};

export const getHashCodeForNumber = (target: number): number => target;

export const getHashCodeForBoolean = (target: boolean): number =>
  target ? 1 : 0;

//https://github.com/Microsoft/referencesource/blob/master/mscorlib/system/string.cs#L833
//This is an adaptation of the C# algorithm. They cannot syntactically be the same because
//JavaScript doesn't have user accessible pointers
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
export const getHashCodeForDateTime = (target: DateTime): number =>
  getHashCodeForTotalMilliseconds(target.totalMilliseconds);

//As stated before - there are no Ticks in JavaScript, so total milliseconds is as precise as it gets
export const getHashCodeForDate = (target: Date): number =>
  getHashCodeForTotalMilliseconds(target.getTime());

//https://github.com/Microsoft/referencesource/blob/master/mscorlib/system/datetime.cs#L979
//This will not be one to one with the C# algorithm because JavaScript doesn't support the concept of ticks.
//Frankly it probably can, but I am not going to kill myself to get that to work.
const getHashCodeForTotalMilliseconds = (kindOfLikeTicks: number): number => {
  //Int64 ticks = InternalTicks;
  //return unchecked((int)ticks) ^ (int)(ticks >> 32);

  //The only way to properly shift the value was to use BigInt
  const shift = BigInt(kindOfLikeTicks) >> 32n;

  //This will simulate the overflow like the C# algorithm
  return kindOfLikeTicks ^ parseInt(shift.toString());
};

//It's better to not use this function if you know what the type is already
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

const getCharCodes = (str: string): number[] => {
  const charCodes: number[] = [];

  for (let i = 0; i < str.length; i++) {
    charCodes.push(str.charCodeAt(i));
  }

  return charCodes;
};

//If you are using this, you are doing it wrong unless it's for demonstrations or you have not implemented the getHashCode function yet.
export const getHashCodeRandom = (): number => {
  //Hashcodes can be negative sometimes, so sure why not
  const polarity = (Math.random() * 100000) % 2 === 0 ? 1 : -1;

  //This is a crappy random number, but it's the best you can do if you don't implement the getHashCode function
  return polarity * Math.round(Math.random() * 100000000000);
};

export const isPrimitiveType = (target: any): boolean => {
  return (
    typeof target === "string" ||
    typeof target === "number" ||
    typeof target === "bigint" ||
    typeof target === "boolean" ||
    typeof target === "symbol" ||
    target instanceof Date ||
    target instanceof DateTime
  );
};
