import { TimeSpan } from "./TimeSpan.js";
import { formatTimeStamp } from "./string-formats.js";

//https://learn.microsoft.com/en-us/dotnet/api/system.datetime?view=net-7.0
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
export class DateTime {
  private _dateTime: Date;

  public constructor(dateTime: Date) {
    this._dateTime = dateTime;
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
  dateRef() {
    return this._dateTime;
  }

  private cloneRef() {
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

  private monthIndex(): number {
    //getMonth() is actually an INDEX of month meaning 0 to 11 because a crack head designed this
    return this._dateTime.getMonth();
  }

  month(): number {
    return this.monthIndex() + 1;
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
    //Have to work with the month INDEX because JavaScript
    return this.add(months, (unit, copy) => {
      copy.setMonth(this.monthIndex() + unit);
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

  subtract(dateTime: DateTime): TimeSpan {
    const msDiff = this.totalMilliseconds() - dateTime.totalMilliseconds();

    return new TimeSpan(msDiff);
  }

  log() {
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
  toString() {
    //C#'s DateTime.ToString() format depends on the user's OS's preferences. I am going to provide bias here for argument's sake.
    //M/d/yyy HH:mm:ss -> Ex: 9/1/2023 22:53:50

    return `${this.month()}/${this.day()}/${this.year()} ${formatTimeStamp(
      this.hour(),
      this.minute(),
      this.second()
    )}`;
  }
}
