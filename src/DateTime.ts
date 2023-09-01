import { TimeSpan } from "./TimeSpan.js";

//https://learn.microsoft.com/en-us/dotnet/api/system.datetime?view=net-7.0
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
export class DateTime {
  _dateTime: Date;

  public constructor(dateTime: Date) {
    this._dateTime = dateTime;
  }

  dateRef() {
    return this._dateTime;
  }

  cloneRef() {
    return new Date(this._dateTime);
  }

  getYear() : number {
    return this._dateTime.getFullYear();
  }

  getMonth() : number {
    return this._dateTime.getMonth() + 1;
  }

  getDay() : number {
    return this._dateTime.getDate();
  }

  //getTime() method returns the number of milliseconds since 01/01/1970 00:00:00
  getAsMilliseconds() : number {
    return this._dateTime.getTime();
  }

  addDays(days: number) : DateTime {
    const copy = this.cloneRef();

    copy.setDate(this.getDay() + days);

    return new DateTime(copy);
  }

  addMonths(months: number) : DateTime {
    const copy = this.cloneRef();

    copy.setMonth(this.getMonth() + months);

    return new DateTime(copy);
  }

  addYears(years: number) : DateTime {
    const copy = this.cloneRef();

    copy.setFullYear(this.getYear() + years);

    return new DateTime(copy);
  }

  subtract(dateTime: DateTime) : TimeSpan {
    const msDiff = this.getAsMilliseconds() - dateTime.getAsMilliseconds();

    return new TimeSpan(msDiff);
  }
}

