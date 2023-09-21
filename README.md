# FJS

> _I'll give you one guess what the F stands for..._

This is a sensible C# inspired take on JavaScript's crappier nearly unusable stock objects.

---

## High-level

The number of times I have had a head slapping moment using JS has formed a little crater in my forehead. For a language that we are all forced to use for web development, it's quite lacking. It has gotten better over the years, but there are still some things to this day that are just embarrassing. So I thought it would be fun to replicate C# objects using JS to see how far I could take irony of developing in JS to use C# objects in JS ultimately. If you haven't figured it out already this is mostly a joke. So if you are getting upset _don't_; I am just poking fun at the Stockholm syndrome of programming languages.

Below is a list of what I have implemented so far. I am only planning on adding things as needed.

### File organization

I am organizing the `TypeScript` classes and modules as logically as I can to follow C# namespacing. Therefore, everything will start in the `System` folder like it has done for many years in `mscorlib.dll`.

## DateTime

JavaScript's `Date` object is one of the most ubiquitously hated objects to use because there are some very unwelcomed biases that the creator(s) introduced. Unlike C#'s pristine example of what a `DateTime` library should be. I have written a wrapper around the nonsensical `Date` object to make it mirror the dot net `System.DateTime` struct.

- [JS Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [C# DateTime](https://learn.microsoft.com/en-us/dotnet/api/system.datetime)

There are so many problems with JS Date it gets its own [ReadMe](/docs/DateTime.md).

## TimeSpan

JavaScript's woefully lacking `Date` object does not support reasonable date math. Therefore, there is no exact JS equivalent `TimeSpan` object unlike the wonderous joy it is to use C#'s `System.TimeSpan` struct. The closest thing that JS has is the `getTime()` function which returns the total number of milliseconds since 01/01/1970 UTC which is a designated [epoch](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range).

- [JS Date.getTime()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)
- [C# TimeSpan](https://learn.microsoft.com/en-us/dotnet/api/system.timespan)

## IObject{T}

Everything in JS inherits from `Object.prototype`, just like everything in C# extends `System.Object`. The concepts are the same, but unfortunately there was no easy way to encapsulate this object without making life miserable. Therefore, I opted for making an interface instead to help provide guidance on getting closer to a C# object.

- [JS object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [C# object](https://learn.microsoft.com/en-us/dotnet/api/system.object)

Here is a list of key differences between the two `object` constructs:

| C# Method   | JS Function | Notes                                                                                                                     |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| Equals      | N/A         | Beyond using the `===` operator, that's it. There really isn't a way to perform equality checks on two user made objects. |
| GetHashCode | N/A         | This is totally a foreign concept in JS.                                                                                  |
| ToString    | toString    | This does exist and can be overridden (shadowed).                                                                         |

This interface accepts a generic of type `T` so that the equals function knows what it is trying to equate to. This [diverges from what C# does](https://learn.microsoft.com/en-us/dotnet/api/system.object.equals), but this exercise is never going to be perfectly replicate C#. It's just going to better than what JS has to offer today. Therefore, there isn't a benefit to implementing an equals method that takes `object.prototype` or `any` type as an argument for compare.

## IEquatable{T}

<https://learn.microsoft.com/en-us/dotnet/api/system.iequatable-1>

There is no equivalent in JS for this. I just wanted to follow the same pattern provided in C# where you would implement this interface to get additional benefits from collections and other objects that need the `Equals(T)` method.

There is overlap between this interface and `IObject{T}` and that's on purpose.

## IComparable{T}

<https://learn.microsoft.com/en-us/dotnet/api/system.icomparable-1>

There is no equivalent in JS for this. It is required for sorting objects.

## IEqualityComparer{T}

<https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.iequalitycomparer-1>

There is no equivalent in JS for this. I implemented it so I could use it with my `Dictionary<TKey, TValue>` implementation.

## KeyValuePair{TKey, TValue}

<https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.keyvaluepair-2>

You could argue that there are equivalents for this in JS, but not really. This is used in conjunction with my `Dictionary<TKey, TValue>` implementation.

## List{T}

This is an amalgamation of `System.Array` and `List<T>` to combat the inconsistencies of the thing called an Array in JS. You know this thing `[]`. The Arrays in JS are confused because they don't know if they want to be arrays or stacks.

The one glaring problem that became terribly clear to me while working on this humanitarian effort is that JS Arrays are _mutable_. I don't know why that never dawned on me before. Something always really bugged me about JS Arrays, but I have finally nailed it.

JS Arrays, really shouldn't be called Arrays - it's a poorly managed array that wants to be a stack sometimes at best.

- [JS Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [C# Array](https://learn.microsoft.com/en-us/dotnet/api/system.array)
- [C# List{T}](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1)

There are so many problems with JS Arrays it gets its own [ReadMe](/docs/List.md).

## Dictionary{TKey, TValue}

JS Maps are actually not that bad, but they still kind of suck for one reason. JS Maps, JS as a whole really, has zero clue how to index custom objects. If you are using anything other than a primitive for a key, your Map is absolutely useless. JS Maps will let you add duplicate keys, because again it has zero clue how to do comparisons. This is what I would refer to as an incomplete feature. I can't call it a bug because JS has no concept of hashing.

- [JS Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [C# Dictionary{TKey, TValue}](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2)

There are several problems with JS Maps, so it too gets its own [ReadMe](/docs/Dictionary.md).

## Hashing and Equality

Since hashing isn't a thing in JS I had to come up with some ways to do it. And when I say come up with ways to do it I mean rip off C# as best as I can. Shockingly I was able to implement equivalent hashing algorithms for both `System.DateTime` and `System.string`. I honestly didn't think it could be done, but alas here we are and we are better for it :D.

This is a complicated subject, so it gets its own [ReadMe](/docs/HashingAndEquality.md).

---

## I still don't know what the F stands for

What does the F stand for in BFG 9000? If you can't answer that question, you are making me feel old and that's rude.

## Final words

Lastly I just want to shout myself out for doing this for the world. It couldn't have been done without my selfless efforts.

_We can do better than JavaScript. Please, think of the children._

~ **YOU'RE WELCOME** ~

> Pascal I did it!
