# Hashing and Equality

As of 09/15/2023 this code is living inside of a module named [utils.ts](/src/utils.ts) because I am still aggregating everything together in one place. The truth is I don't know where to put it because the equivalent location in C# would be via the object hierarchy.

Therefore, until I have a better location it's all going to live in the root most level where it is easily accessible by everything inside of the `System` folder.

There are three categories being covered under hashing and equality:

1. Hashing
2. Equality
3. Comparisons

## Primitives

My definition of what a primitive is and what JS's idea of what a primitive is are different (_shocker_). This is actually one instance where C# and JS agree. Technically speaking they are right, practically speaking I think they are wrong and there should be a distinction made.

For this comparison I am only going to include the available types from JS because C# has way more so it's not relevant here.

- [JS Primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)
- [C# Built-in types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/built-in-types)

| JS Type   | Is Primitive | C# Type       | Is Primitive | Comments                                                                                                                                                                                         |
| --------- | ------------ | ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| string    | Yes          | string        | Yes          | This is a reference type in C# but it's treated like a primitive which pisses a lot of people off. I think it makes sense though and I will explain at the bottom.                               |
| number    | Yes          | Int32 & Int64 | Yes          | JS number is a 64-bit integer. In C# we normally default to `int` which is 32-bit and use `long` when we have to which is 64-bit.                                                                |
| bigint    | Yes          | BigInteger    | No           | Not sure how this is considered a primitive in JS. It is a complex type and not what I would consider a normal building block of a class.                                                        |
| boolean   | Yes          | bool          | Yes          |                                                                                                                                                                                                  |
| undefined | Yes          | null          | No           | I never understood why this was ever a thing and frankly there is no difference between it and null other than JS making everyones life difficult for _reasons_.No                               |
| symbol    | Yes          | Object-ish    | Yes          | There isn't really an equivalent in C#. You can argue it's Object, but not really. This is more like creating atoms in [Elixir](https://elixir-lang.org/getting-started/basic-types.html#atoms). |
| null      | Yes          | null          | No           | There is no valid discernible difference for having `undefined` and `null`.                                                                                                                      |
| Date      | No           | DateTime      | No           | Both JS and C# agree this is not a primitive. I disagree because it's a fundamental building block of classes.                                                                                   |
| Object    | No           | Object        | No           | This is the foundation for everything in both JS and C#.                                                                                                                                         |

Personally, I understand that things like `Date` and `DateTime` are not really primitives, but I consider them primitives since they are essential building blocks of a class. The same argument can be made for `strings`. They are not a simple structure, it's an immutable character array. Technically speaking it's a reference type in C#, but for the sake of convenience it's treated as a value type. I think this is the right answer because there is never going to be a time where you don't need to make a copy of a string. This is because it's a corner stone of class making.

Conversely, I do not consider something like `bigint` to be a primitive because it's not for your typical usage scenario like `number` is. This is more for representing extra large numbers and doing less common hacky integer shifting and overflow exercises.

What annoys me greatly about `null` and `undefined` coexisting is it's like someone saying a phrase with more emphasis to pretend that makes it two different phrases. Yes I know there is a technical difference between them, but I am saying there shouldn't be. All this has done is make people have to check if an object is `undefined` or `null` now which is IRRITATING. What did this accomplish? For all practical purposes they are the SAME.

## General concerns in JS

JS only has support for comparing primitive types. There is literally no such thing as `equals`, `getHashCode` and/or `compareTo` in JS. The only thing you have available to you are:

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness>

| Operation  | Example                      | Comments                                                                                                                      |
| ---------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ==         | `a == b`                     | loose equals - this is probably one of the worst things ever introduced into programming. Truthy/Falsy should not be a thing. |
| ===        | `a === b`                    | strict equals - this is what everyone wants because it MAKES SENSE.                                                           |
| typeof     | `typeof target === "number"` | Determining if a variable is of primitive type.                                                                               |
| instanceof | `target instanceof Date`     | Determining if a variable is of object type.                                                                                  |

> There are more types of comparisons, but for the purposes of this discussion these are what matter.

When you define your own objects in JS they unfortunately cannot be compared using the strict equals operator. To make matters worse, there is no way to override that operator either. Therefore, I came up with the idea of checking if an object/Type implements one of the three hashing and equality functions.

Sadly, in `TypeScript` you cannot:

- infer what a type is based on a generic type.
- test if a generic type implements an interface.
- initialize an object generically such as `const obj = new T();` where we are sure that T can be newed up.

In other words, you can only do this at runtime, which sucks. Hopefully this changes in the future.

## Contracts

Since this is a foreign concept in JS, that's why I provided the interfaces to help guide a pattern. Using `IObject{T}`, `IEquatable{T}` and `IComparable{T}` will give you the contract(s) needed to perform object:

1. equality
2. hashing
3. comparison

> These contracts are a helpful guide, but I cannot enforce that they be implemented via generics as previously mentioned. Therefore, it's on the responsibility of the user to make sure these methods exist if they want things to work properly.

## Default hash code

In C# the memory location is returned normally for objects who don't have a `GetHashCode()` implementation. The hash code the object is instantiated with will not be altered even if the properties of the class are changed.

The JS implementation is pseudo-equivalent to what C# does. This is the expected setup for a class that has not implemented the `getHashCode()` function yet.

```TypeScript
//Hashcode is generated once
private _hashCode: number = getHashCodeRandom();

//Hashcode is locked in and cannot change
getHashCode(): number {
  return this._hashCode;
}
```

This is the same behavior as what would happen in C#.

## Comparable object implementation

I created two objects for testing. One has the hashing and equality methods implemented and the other has them implemented too, but with minimal effort. Just like in C#, it's up to you how exact you want to be.

- [ComparableObject.ts](/src/Entities/ComparableObject.ts)
- [DumbObject.ts](/src/Entities/DumbObject.ts)

## Hashing algorithms

I am shamelessly copying the hashing algorithms from C# if I can port them over. So far I have been able to replicate `string` and `DateTime`. The results cannot be the same, but I know that the algorithms are identical after I cross tested values. I will produce some unit tests at a later time for this since this is an early implementation.

- [string.cs](https://github.com/Microsoft/referencesource/blob/master/mscorlib/system/string.cs#L833)
- [datetime.cs](https://github.com/microsoft/referencesource/blob/master/mscorlib/system/datetime.cs#L979)

These algorithms have been converted to JS equivalents.
