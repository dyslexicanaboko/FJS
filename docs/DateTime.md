# DateTime

Oh boy... where to begin? The JS Date object is probably one of the worst implementations of Date I have ever seen in my whole development career. I am happy to report that no one I have ever spoken too would dare disagree. It's a disaster. It's such a disaster there are too many libraries out there to help you avoid using it. The problem I have with all of those libraries is that none of them are like the `System.DateTime` struct from C#.

I am not kidding when I say that implementation is pretty good. I have never had a problem with it and it makes sense during use.

The biggest difference between JS Date and C# DateTime is that the JS Date likes to take UTC values, but then outputs everything as a localized version of the date. This is not helpful if you just want to store a date value and ensure what you put in comes back out unchanged. This is what I refer to as:

> Overcompensating for the user.

Don't assume you know what the user wants and don't make implied decisions for the user. It's a recipe for disaster.

The C# DateTime implementation doesn't assume what timezone you are using. It will default to your system's local timezone, but it will not alter the values you provide it. Therefore trust can be established between the programmer and the framework handling your data.

With JS Date there is no trust because you give it something and it gives you something else back. This is not only jarring, but upsetting because it shouldn't work this way. Normally, I don't like to fight established patterns because it's a losing battle, but JS has committed enough crimes for me to fight back.

## Precision

The JS Date object does not go past milliseconds. Therefore, it's less precise than the C# DateTime struct.

- The above isn't a criticism it's a fact.
- _THIS_ is a criticism:
  - For a language that prides itself on being able to handle 64-bit numbers by default it sure doesn't use them properly.

The C# DateTime class has Ticks which is defined as:

> A single tick represents one hundred nanoseconds or one ten-millionth of a second.
>
> There are 10,000 ticks in a millisecond (see [TicksPerMillisecond](https://learn.microsoft.com/en-us/dotnet/api/system.timespan.tickspermillisecond?view=net-7.0#system-timespan-tickspermillisecond)) and 10 million ticks in a second.

<https://learn.microsoft.com/en-us/dotnet/api/system.datetime.ticks?view=net-7.0#remarks>

| Language | Construct | Name      | Precision                                                                                                                                 |
| -------- | --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| C#       | Property  | Ticks     | Ticks represents the number of 100-nanosecond intervals that have elapsed since `01/01/0001 00:00:00 TZ`. Where `TZ` is `local` or `UTC`. |
| JS       | function  | getTime() | Returns the number of milliseconds since `01/01/1970 00:00:00 UTC`.                                                                       |

Finally, that means that in JavaScript, milliseconds is going to be as close as we can get to ticks.

## Getting the Year

This is a pet peeve of mine because like many things in JS the naming conventions are confusing and unhelpful. JS has been around for so long that it actually suffered the Y2K problem. Unfortunately, as a back-end developer, if you are not working with JS day in and day out like some people are then the subtlety of the naming will escape you.

JS has two functions for getting the year from a Date object.

- [getYear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getYear)
- [getFullYear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear)

### getYear

As you may have already picked up, no you shouldn't be using this function, it's deprecated and does not work. It happens. That's not the problem I have here - go to the next section.

### getFullYear

Since JS has terrible naming conventions it's hard to know that `getFullYear()` is actually a replacement for `getYear` when it sounds like it is just some crappy formatting decision between returning `two` digits versus `four` digits.

I don't know who is responsible for naming these things, but for the love of god this is the one time where using a version number would actually come in handy to denote there has been a replacement. They should have called it `getYear2()`. This really is the one times it's acceptable!

Even SQL Server did this with `DATETIME` and `DATETIME2` so what's JS's excuse?

## Getting the Day

One more terrible naming convention. For whatever reason, the JS designers thought it made sense to name an accessor function after the object. This is the hight of confusion and not helpful.

- [getDate()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate)
- [getDay()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay)

Reading those two function names it's hard to discern which one does what.

- `getDate()` sounds as if it should just return the Date part of a Date object, meaning it leaves the time out.
  - Instead, this returns the `DAY` part from a date. Meaning the `15` from this date `09/15/2023`.
  - WHY?!
- Wait a minute... if `getDate()` actually returns the day then what the hell does `getDay()` return?!
  - Oh well it returns the DAY OF THE WEEK as an indexed number naturally.
  - Why have a function called `getDayOfWeekIndex()` when you can just confuse everyone and make their lives harder?

## Getting the Month

JavaScript was designed to emulate Java, so the original sin of using indexes to represent real world things lies with the creators of Java. Apparently they are so smart they missed the lesson on what the purpose of object oriented programming is all about.

1. If you are supposed to represent real world things in your code (OOP), then why the hell are you using indices to represent the days of the week and months in a year?
2. Further more, why was this same decision not applied to days of the month? Why was 1 through 31 used and not 0 through 30?
3. How about displaying the month? Why not make that an index? Oh wait that doesn't make sense?

Contradictions and illogical crap. Yet it is the language we are all forced to use for web development. I hate it so much.

- [getMonth()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth)
- [setMonth()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth)

### getMonth

The only controversy surrounding this function is the fact that it returns an INDEX to represent the months. Just pointless.

### setMonth

You would think that the controversy would end with an index being required to set your month, but no. The `setMonth()` function has a logical bias embedded into it which I think is terrible. To be absolutely fair, the C# DateTime `AddMonth()` implementation has its own bias, but I think it makes FAR MORE SENSE.

First off, the naming convention once again is misleading. The `setMonth()` function isn't setting the month using a mutator as the name implies. It is performing a calculation based on the number of days in that month. Again, totally misleading and unwarranted. Why was this function named like an mutator, when it isn't. The appropriate name should have been `addMonth()`.

#### Examples

| Language | Construct | Name        | Code                                                      | Output                  |
| -------- | --------- | ----------- | --------------------------------------------------------- | ----------------------- |
| C#       | Method    | AddMonths   | `DateTime.Parse("2024-01-31 23:59:59.999").AddMonths(1);` | 2024-2-29 23:59:59      |
| JS       | function  | setMonths() | `new Date("2024-01-31 23:59:59.999").setMonths(1);`       | 2024-03-02 23:59:59.999 |

Anyone who is new to JavaScript should have a total WTF moment when they see this output. How the hell did setting my months to index 1 (02 - February) get my month to index 2 (03 - March) and to add insult to injury it modified my days too?! WHY!!!!

AH HA! You see, when you think using indices to represent months makes sense then you think the following makes sense too:

> The current day of month will have an impact on the behavior of this method. Conceptually it will add the number of days given by the current day of the month to the 1st day of the new month specified as the parameter, to return the new date.

Any sane person will tell you this is not a decision you should be making for anyone, but hey this is JS where up is down and left is right.

So then, why does the C# bias work correctly? This is obviously a _subjective_ statement, but this repository isn't celebrating the achievements of JS. Par for the course.

### DateTime.AddMonths()

The `System.DateTime.AddMonths()` method does two useful things:

1. It does not modify your original DateTime object and instead returns a new one.
2. It uses a superior bias to determine the days to use for your resultant Date.

<https://learn.microsoft.com/en-us/dotnet/api/system.datetime.addmonths?view=net-7.0#remarks>

- The `AddMonths()` method will adjust your month and days to make sure it fits in the desired destination month.
- It adjusts for leap year.

| Leap Year | Days | Example    |
| --------- | ---- | ---------- |
| No        | 28   | 02/28/2023 |
| Yes       | 29   | 02/29/2023 |

This means that you are guaranteed to not rollover days like JS does for you.

So for example if you want to change January to February in `2024-01-31` then you will get `2024-02-29` because 2024 is a leap year and there are only 29 days in February that year.

### Adding months in JS

Therefore, to combat JS's terrible bias it is important to realize there there is an overload for the `setMonth()` function. You should ignore the overload that only takes the month index and use the one that takes the "dateValue" which is actually the "day of the month" value.

`setMonth(monthValue, dateValue)` - by using this overload you specify the exact day you want to see in your new Date, but now this adds the complication of determining the number of days in the destination month exist including leap year. Don't worry I fixed it already.
