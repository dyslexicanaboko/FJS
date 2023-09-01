//https://learn.microsoft.com/en-us/dotnet/api/system.timespan?view=net-7.0
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
export class TimeSpan {
  _totalDays: number;
  _totalHours: number;
  _totalMinutes: number;
  _totalSeconds: number;
  _totalMilliseconds: number;

  public constructor(milliseconds: number) {
    this._totalMilliseconds = milliseconds;
    this._totalSeconds = this._totalMilliseconds / 1000;
    this._totalMinutes = this._totalSeconds / 60;
    this._totalHours = this._totalMinutes / 60;
    this._totalDays = this._totalHours / 24;
  }

  totalMilliseconds() {
    return this._totalMilliseconds;
  }
  
  totalSeconds() {
    return this._totalSeconds;
  }

  totalMinutes() {
    return this._totalMinutes;
  }

  totalHours() {
    return this._totalHours;
  }

  totalDays() {
    return this._totalDays;
  }
}
