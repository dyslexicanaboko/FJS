//https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.iequalitycomparer-1
export default interface IEqualityComparer<T> {
  equals(x: T | undefined, y: T | undefined): boolean;
  getHashCode(obj: T): number;
}
