/**
 * Interface modeled after the .NET IEqualityComparer<T> interface.
 * https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.iequalitycomparer-1
 *
 * Normally I would follow this advice:
 * -----
 * https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.equalitycomparer-1
 * We recommend that you derive from the EqualityComparer<T> class instead of implementing the
 * IEqualityComparer<T> interface, because the EqualityComparer<T> class tests for equality using
 * the IEquatable<T>.Equals method instead of the Object.Equals method. This is consistent with
 * the Contains, IndexOf, LastIndexOf, and Remove methods of the Dictionary<TKey,TValue> class
 * and other generic collections.
 * -----
 *
 * But in this case using an interface will be fine since this is all a foreign concept anyhow.
 */
export default interface IEqualityComparer<T> {
  equals(x: T | undefined, y: T | undefined): boolean;
  getHashCode(obj: T): number;
}
