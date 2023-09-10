//https://learn.microsoft.com/en-us/dotnet/api/system.iequatable-1
export default interface IEquatable<T> {
  equals(other: T): boolean;
}
