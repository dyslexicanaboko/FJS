import {
  SecondsInOneDay,
  SecondsInOneHour,
  SecondsInOneMinute,
  MillisecondsInOneSecond,
  HoursInOneDay,
} from "./constants.js";
import { formatTimeSpan } from "./string-formats.js";

//https://learn.microsoft.com/en-us/dotnet/api/system.timespan?view=net-7.0
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
export class TimeSpan {
  private _totalDays: number;
  private _totalHours: number;
  private _totalMinutes: number;
  private _totalSeconds: number;
  private _totalMilliseconds: number;
  private _days: number;
  private _hours: number;
  private _minutes: number;
  private _seconds: number;
  private _milliseconds: number;

  public constructor(totalMilliseconds: number) {
    //Calculating the totals
    this._totalMilliseconds = totalMilliseconds;
    this._totalSeconds = this._totalMilliseconds / MillisecondsInOneSecond;
    this._totalMinutes = this._totalSeconds / SecondsInOneMinute;
    this._totalHours = this._totalMinutes / SecondsInOneMinute;
    this._totalDays = this._totalHours / HoursInOneDay;

    //Calculating the time stamp segments
    //WARNING: Because JavaScript's Date.prototype.getTime() return whole numbers only, precision is lost.
    //TODO: Look into getting precision to match C#'s - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
    this._days = this.getWholeNumber(this._totalSeconds / SecondsInOneDay);

    this._hours = this.getWholeNumber(this._totalSeconds / SecondsInOneHour);

    //Due to precision loss, this can be rounded up to 24 which is not practical
    if (this._hours === HoursInOneDay) {
      //If this was 24, then the `_days` property has the same rounding error
      this._hours = 0;
    }

    this._minutes = this.getWholeNumber(
      (this._totalSeconds % SecondsInOneHour) / SecondsInOneMinute
    );
    this._seconds = this.getWholeNumber(
      this._totalSeconds % SecondsInOneMinute
    );
    this._milliseconds = this.getWholeNumber(
      (this._totalMilliseconds % 1.0) * MillisecondsInOneSecond
    );
  }

  //The original idea of this function was to truncate the decimal, but JavaScript has non-existent precision
  //starting with the Date.prototype.getTime() function. Therefore, the whole number is already rounded up.
  private getWholeNumber(target: number): number {
    return Math.floor(target);
  }

  totalMilliseconds(): number {
    return this._totalMilliseconds;
  }

  totalSeconds(): number {
    return this._totalSeconds;
  }

  totalMinutes(): number {
    return this._totalMinutes;
  }

  totalHours(): number {
    return this._totalHours;
  }

  totalDays(): number {
    return this._totalDays;
  }

  milliseconds(): number {
    return this._milliseconds;
  }

  seconds(): number {
    return this._seconds;
  }

  minutes(): number {
    return this._minutes;
  }

  hours(): number {
    return this._hours;
  }

  days(): number {
    return this._days;
  }

  log(): void {
    console.log("Total days", this._totalDays);
    console.log("Total hours", this._totalHours);
    console.log("Total minutes", this._totalMinutes);
    console.log("Total seconds", this._totalSeconds);
    console.log("Total milliseconds", this._totalMilliseconds);

    console.log("days", this._days);
    console.log("hours", this._hours);
    console.log("minutes", this._minutes);
    console.log("seconds", this._seconds);
    console.log("milliseconds", this._milliseconds);
  }

  //C#'s output is more dynamic, but this is the basic idea: Ex: 1.23:59:59.9999980 -> Days.HH:mm:ss.fffffff
  //Years are not included in the output, just total number of days. C# won't include the days if it is zero.
  toString(): string {
    return formatTimeSpan(
      this._days,
      this._hours,
      this._minutes,
      this._seconds,
      this._milliseconds
    );
  }
}
