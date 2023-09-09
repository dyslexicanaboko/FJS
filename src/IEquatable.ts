//https://learn.microsoft.com/en-us/dotnet/api/system.iequatable-1
interface IEquatable<T> {
  equals(other: T): boolean;
}
