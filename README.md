# FJS

A sensible C# inspired take on JavaScript's crappier nearly unusable stock objects.

Here is a list of what I am fixing so far:

## DateTime

JavaScript's `Date` object is one of the most ubiquitously hated objects to use because there are some very unwelcomed biases that the creator(s) introduced. Unlike C#'s pristine example of what a `DateTime` library should be. I have written a wrapper around the nonsensical `Date` object to make it mirror the dot net `System.DateTime` struct.

- [JS Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [C# DateTime](https://learn.microsoft.com/en-us/dotnet/api/system.datetime)

## TimeSpan

JavaScript's woefully lacking `Date` object does not support reasonable date math. Therefore, there is no exact JS equivalent `TimeSpan` object unlike the wonderous joy it is to use C#'s `System.TimeSpan` struct. The closest thing that JS has is the `getTime()` function which returns the total number of milliseconds since 01/01/1970 UTC which is a designated [epoch](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range).

- [JS Date.getTime()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)
- [C# TimeSpan](https://learn.microsoft.com/en-us/dotnet/api/system.timespan)

---

More documentation to follow.
