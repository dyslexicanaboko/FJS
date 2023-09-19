# Dictionary{TKey, TValue}

A JavaScript `Map` is surprisingly not that bad in comparison to all of the other objects I have come across. They have limitations that are actually understandable.

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

```JavaScript
const map = new Map();
map.set(1, 1);
map.set(2, 2);
map.set(3, 3);

for (const kvp of map) {
  console.log(kvp);
}
```
