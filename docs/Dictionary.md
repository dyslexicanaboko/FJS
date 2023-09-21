# Dictionary{TKey, TValue}

A JavaScript `Map` is surprisingly not that bad in comparison to all of the other JS objects I have worked with so far. They have limitations that are actually understandable.

1. A Map will only be able to uniquely index on primitive types. JavaScript has no concept of hashing and custom object equality.
2. A Map will replace the value of an existing key. Not surprising considering this is JavaScript. At least it has a dedication function for adding things to the collection unlike arrays.
3. Unlike arrays, it keeps an accurate count of items that have been added.
4. Unlike arrays, it doesn't fill the structure with `undefined` values to handle index tracking.

I'm honestly impressed at how not total shit this object is. It's what I would expect for them being added in ES6. It means the original creator, who badly needed access to an English dictionary, was not involved in its creation. It shows.

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/map>

The function it has are concise and descriptive. Bravo. Buuuuuut... this wouldn't be JavaScript without there being some problems right?

## Iteration

- There is different syntax for looping through a map, not a big deal.
- The iterator unfortunately isn't strict enough on what is happening to the collection while it is in use.

This is an example of normal iterative usage:

```JavaScript
const map = new Map();
map.set(1, 1);
map.set(2, 2);
map.set(3, 3);

for (const kvp of map) {
  console.log(kvp);
}
```

This is an example of shooting yourself in the foot because JS will let you do this:

```JavaScript
const map = new Map();
map.set(1, 1);

for (const kvp of map) {
  const i = kvp[0] + 1;

  map.set(i, i);

  console.log(kvp);
}
```

This above code will produce an infinite loop. C# prevents you from making such a mistake on two fronts.

### First front

The first is you cannot modify the enumerable while iterating over it. This is pretty much a default rule across all of dot net.

```CSharp
var dict = new Dictionary<int, int> { {1,1}};

foreach (var (key, value) in dict)
{
  var i = key + 1;

  dict.Add(i, i);
}
```

The above code will raise an `InvalidOperationException: Collection was modified; enumeration operation may not execute.`

### Second front

You cannot modify members of a collection while iterating through them. This is effectively _half_ true.

## Modifying indexers during iteration

As the theme continues to go, JavaScript will let you shoot yourself in the foot, whereas C# will not. C# will not allow you to modify the indexer of a collection while looping through them.

### Example 1

```CSharp
var dict = new Dictionary<int, int> { {1,1}};

foreach (var (key, value) in dict)
{
  key = key + 1;
}
```

The above code will not compile, if you attempt to it will give you `CS1656 Cannot assign to 'key' because it is a 'foreach iteration variable'`. However this is due to pattern matching being used which is a nice feature, but it's hiding the real problem which can be found in the original way to do this below.

### Example 2

```CSharp
var dict = new Dictionary<int, int> { {1,1}};

foreach (var kvp in dict)
{
  kvp.Key = kvp.Key + 1;
}
```

The above code will not compile, if you attempt to it will give you `CS0200 Property or indexer 'KeyValuePair<int, int>.Key' cannot be assigned to -- it is read only`.

### Why this is half true

Th is half true because if you use a complex object for your indexer, you can freely modify its properties without push back. It doesn't mean it won't have side effects, but that's up to you to be aware of. The rule of thumb is, only modify properties that are not part of the hash.

The following will run just fine because we are not modifying the object as a whole like we would be doing with a primitive:

```CSharp
public class Foo
{
  public int Number { get; set; }
}

//Notice there are two of the same elements
var dict = new Dictionary<Foo, int>
{
  { new Foo { Number = 1 }, 1},
  { new Foo { Number = 1 }, 1}
};

foreach (var kvp in dict)
{
  //You can modify this property with no push back because the Dictionary doesn't know how to hash this type of object
  kvp.Key.Number = kvp.Key.Number + 1;
}
```

Since the Dictionary doesn't know how to hash this type of object, then it means it's using its default hash code. The default hash code might as well be a random number which is assigned on instantiation. It won't change even if you modify the properties of the object. To change that we override the appropriate methods and implement the `IEquatable<T>` interface like so:

```CSharp
public class Foo : IEquatable<Foo>
{
  public int Number { get; set; }

  public override int GetHashCode()
  {
    return Number;
  }

  public override bool Equals(object obj)
  {
    return Equals((Foo)obj);
  }

  public bool Equals(Foo other)
  {
    return other.Number == Number;
  }
}

//Same as before
var dict = new Dictionary<Foo, int>
{
  { new Foo { Number = 1 }, 1},
  { new Foo { Number = 1 }, 1}
};

//This code will never be reached
foreach (var kvp in dict)
{
  kvp.Key.Number = kvp.Key.Number + 1;
}
```

The above code will have a runtime failure: `ArgumentException: An item with the same key has already been added. Key: Foo`. This is because the Dictionary knows how to hash the objects and found a collision. At this point you would expect the Dictionary object to prevent you from forcing two keys to exist in the same collection, but this is where the Dictionary class will let you screw yourself and why it's important not to modify properties that are involved in the hash (indexer).

```CSharp
var dict = new Dictionary<Foo, int>
{
  { new Foo { Number = 2 }, 1},
  { new Foo { Number = 1 }, 1}
};

foreach (var kvp in dict)
{
  if(kvp.Key.Number == 2) continue;

  kvp.Key.Number = 2;
}
```

If for some reason you were hell bent on screwing up this dictionary's integrity, then the above code will do it. This will not throw an exception, you can do this, but for obvious reasons you shouldn't. This would be considered a bug for all intents and purposes.

## Conclusion

The point here is that JS doesn't offer any of these protections and it only knows how to compare primitives. There is no such thing as hashing and equality for user created objects and classes.
