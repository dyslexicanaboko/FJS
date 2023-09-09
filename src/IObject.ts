//https://learn.microsoft.com/en-us/dotnet/api/system.object
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
export default interface IObject<T> {
  //This method is not exactly equal to System.Object.Equals because it's taking a typed parameter and not object
  equals(other: T): boolean;

  getHashCode(): number;

  //Not going to include toString() as part of the interface because it's already part of Object
  //as `Object.prototype.toString()`. Therefore, it can be overriden in any class by default.
  //toString(): string;
}
