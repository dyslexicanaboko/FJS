//https://learn.microsoft.com/en-us/dotnet/api/system.icomparable-1
/*
Less than zero - This instance precedes other in the sort order.
  this < other
Zero - This instance occurs in the same position in the sort order as other.
  this == other
Greater - than zero	This instance follows other in the sort order.
  this > other
*/
export default interface IComparable<T> {
  compareTo(other: T): number;
}
