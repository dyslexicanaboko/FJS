//https://learn.microsoft.com/en-us/dotnet/api/system.object
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
/* Originally I was trying to implement the System.Object class in TypeScript, but it was just
 * going to over complicate things, especially if I wanted backwards compatibility with JavaScript's
 * existing objects and primitive types. Therefore, I am trying to provide some OPTIONAL structure
 * for user defined classes that want to take advantage of equality and comparisons of the collections
 * I am implementing. */
export default interface IObject<T> {
  //https://learn.microsoft.com/en-us/dotnet/api/system.object.equals
  //This method is not exactly equal to System.Object.Equals because it's taking a typed parameter and not object
  //On the fence about implementing the original method because I don't see it as useful in a typed environment
  //This isn't the first instance where C# and JavaScript are going to have differences
  equals(other: T): boolean;

  //https://learn.microsoft.com/en-us/dotnet/api/system.object.gethashcode
  //JavaScript does not have a native way to hash anything so I am going to do my best to implement it myself
  getHashCode(): number;

  //https://learn.microsoft.com/en-us/dotnet/api/system.object.tostring
  //Not going to include toString() as part of the interface because it's already part of Object
  //as `Object.prototype.toString()`. Therefore, it can be overriden in any class by default.
  //toString(): string;
}
