import TimeSpan from "./TimeSpan.js";
import { FirstDayOfTheMonth } from "./constants.js";
import { formatTimeStamp } from "./string-formats.js";

//https://learn.microsoft.com/en-us/dotnet/api/system.datetime?view=net-7.0
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
export default class DateTime {
  private _dateTime: Date;

  public constructor(dateTime: Date) {
    this._dateTime = dateTime;
  }

  static parse(dateTimeString: string) {
    return new DateTime(new Date(dateTimeString));
  }

  static now(): DateTime {
    return new DateTime(new Date()); //Local TimeZone by default
  }

  static utcNow(): DateTime {
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC
    //new Date(Date.UTC(1970, 0)) // This will instantiate a TZ localized version which is trash
    //Additionally, that constructor is useless because it requires two arguments instead of just
    //providing an empty constructor like they should have to represent NOW

    //To properly fake a UTC Now - getting the localized now
    const now = new Date();

    //Take the individual UTC components and use them as arguments for the constructor
    const utcNow = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );

    return new DateTime(utcNow);
  }

  static today(): DateTime {
    const now = this.now();

    return now.date();
  }

  //Reference to the Date object that is keeping track of everything
  dateRef(): Date {
    return this._dateTime;
  }

  private cloneRef(): Date {
    return new Date(this._dateTime);
  }

  date(): DateTime {
    const copy = this.cloneRef();

    copy.setHours(0);
    copy.setMinutes(0);
    copy.setSeconds(0);
    copy.setMilliseconds(0);

    return new DateTime(copy);
  }

  year(): number {
    return this._dateTime.getFullYear();
  }

  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth
   * The getMonth() method of Date instances returns the month for this date according to local time,
   * as a zero-based value (where zero indicates the first month of the year).
   *
   * getMonth() is actually an INDEX of month meaning 0 to 11 because a crack head designed this. */
  private getMonthIndex(): number {
    return this._dateTime.getMonth();
  }

  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth
   * The setMonth() method of Date instances changes the month and/or day of the month for this date
   * according to local time.
   *
   * And just like how getMonth() works, which is by index, setMonth() takes and index value 0 - 11 because
   * when you are on crack this makes sense. */
  //Cardinal Month means 1 - 12 like the rest of the planet is used to.
  private static setMonth(date: Date, cardinalMonth: number): void {
    /* To fit into the crackhead mentallity you need to SUBTRACT ONE from the cardinal value that is passed in
     * to get the crackhead month index.
     * Example:
     *  I have January index 0 and I want to move this to February index 1 then using normal human math that would be
     *  a cardinal 1 to represent January and a cardinal 1 to add one month unit yielding a 2 to represent February.
     *    setMonth(1 + 1 - 1) -> setMonth(1)
     *  This would be too easy if that were all. */
    const crackHeadMonthIndex = cardinalMonth - 1;

    /* Unfortunately, the crackheadedness continues. When working with the last day of the month edge case JavaScript
     * will add all days included in the current date and roll the whole date over to whatever that sum is. This is
     * instead of just using the last day of the destination month like one would assume SETTING A MONTH MEANS.
     *
     * JS does this:
     *  new Date("2024-01-31 23:59:59.999").setMonths(1) -> "2024-03-02 23:59:59.999"
     *    January, index 0, is set to index 1 which yields February
     *    BUT then it adds 31 days to February which is 31 - 29 = 2
     *    HENCE having that extra two days rolls it over to March giving March 2nd... CRACKHEAD MATH!
     *
     * C# on the other hand does this:
     *  DateTime.Parse("2024-01-31 23:59:59.999").AddMonths(1) -> "2024-02-29 23:59:59.999"
     *
     * To deal with the unwelcomed rollover of days no one asked for, the last day of the destination month is
     * determined. This way it prevents the rollover from happening. This is done by using the older than dirt
     * method of plus one month minus one day to get the last day of the prior month (destination month). */
    const lastDayOfMonth = new Date(
      date.getFullYear(),
      crackHeadMonthIndex + 1,
      FirstDayOfTheMonth
    );
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);

    date.setMonth(crackHeadMonthIndex, lastDayOfMonth.getDate());
  }

  month(): number {
    return this.getMonthIndex() + 1;
  }

  day(): number {
    return this._dateTime.getDate();
  }

  hour(): number {
    return this._dateTime.getHours();
  }

  minute(): number {
    return this._dateTime.getMinutes();
  }

  second(): number {
    return this._dateTime.getSeconds();
  }

  millisecond(): number {
    return this._dateTime.getMilliseconds();
  }

  /* getTime() method returns the number of milliseconds since 01/01/1970 00:00:00
   
   Milliseconds is going to be as close as we can get to ticks.
   https://learn.microsoft.com/en-us/dotnet/api/system.datetime.ticks?view=net-7.0#remarks
   A single tick represents one hundred nanoseconds or one ten-millionth of a second.
   There are 10,000 ticks in a millisecond (see TicksPerMillisecond) and 10 million ticks in a second.
   */
  private totalMilliseconds(): number {
    return this._dateTime.getTime();
  }

  private add(
    unit: number,
    operation: (unit: number, copy: Date) => void
  ): DateTime {
    const copy = this.cloneRef();

    operation(unit, copy);

    return new DateTime(copy);
  }

  addDays(days: number): DateTime {
    return this.add(days, (unit, copy) => {
      copy.setDate(this.day() + unit);
    });
  }

  addMonths(months: number): DateTime {
    return this.add(months, (unit, copy) => {
      //Using dedicated function for handling JavaScript crackhead month math
      DateTime.setMonth(copy, this.month() + unit);
    });
  }

  addYears(years: number): DateTime {
    return this.add(years, (unit, copy) => {
      copy.setFullYear(this.year() + unit);
    });
  }

  addHours(hours: number): DateTime {
    return this.add(hours, (unit, copy) => {
      copy.setHours(this.hour() + unit);
    });
  }

  addMinutes(minutes: number): DateTime {
    return this.add(minutes, (unit, copy) => {
      copy.setMinutes(this.minute() + unit);
    });
  }

  addSeconds(seconds: number): DateTime {
    return this.add(seconds, (unit, copy) => {
      copy.setSeconds(this.second() + unit);
    });
  }

  addMilliseconds(milliseconds: number): DateTime {
    return this.add(milliseconds, (unit, copy) => {
      copy.setMilliseconds(this.millisecond() + unit);
    });
  }

  subtract(other: DateTime): TimeSpan {
    const msDiff = this.totalMilliseconds() - other.totalMilliseconds();

    return new TimeSpan(msDiff);
  }

  log(): void {
    console.log("year", this.year());
    console.log("month", this.month());
    console.log("day", this.day());
    console.log("hour", this.hour());
    console.log("minute", this.minute());
    console.log("second", this.second());
    console.log("millisecond", this.millisecond());
  }

  //The default Date.toString() output is trash - I don't know ANYONE who thinks this is helpful
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toString
  //Ex: "Wed Oct 05 2011 16:48:00 GMT+0200 (CEST)"
  toString(): string {
    //C#'s DateTime.ToString() format depends on the user's OS's preferences. I am going to provide bias here for argument's sake.
    //M/d/yyy HH:mm:ss -> Ex: 9/1/2023 22:53:50

    return `${this.month()}/${this.day()}/${this.year()} ${formatTimeStamp(
      this.hour(),
      this.minute(),
      this.second()
    )}`;
  }

  equals(other: DateTime): boolean {
    return (
      this.year() === other.year() &&
      this.month() === other.month() &&
      this.day() === other.day() &&
      this.hour() === other.hour() &&
      this.minute() === other.minute() &&
      this.second() === other.second() &&
      this.millisecond() === other.millisecond()
    );
  }
}
