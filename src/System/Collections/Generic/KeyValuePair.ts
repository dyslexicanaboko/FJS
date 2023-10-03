/**
 * Modeled after .NET's KeyValuePair class
 * https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.keyvaluepair-2
 */
type KeyValuePair<TKey, TValue> = {
  key: TKey;
  value: TValue | undefined;
};

export default KeyValuePair;
