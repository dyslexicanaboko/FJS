# List{T}

Arrays in JavaScript... oof... calling these things arrays is too generous. Arrays in JS are a deceptive construct, not nearly as bad as the JS Date object, but nearly as bad. I have already called out JS for using poor naming conventions and behaving illogically on the front page, but I am just going to really drive the point home here.

> Arrays in JavaScript do not behave like a traditional array because they are `mutable`. Therefore, they are more like a weird list that also wants to be a map, that also wants to be a stack. This is a confused construct and in doing so it just confuses the end user.

## Lack of zero based indexing

JS Arrays do not enforce how its index is tracked. They do not have an internal index pointer for keeping track of what is the highest index available. To make matters worse, you can just provide whatever index you want at any time. Therefore, a JS Array is actually more of a Map than an array. The only constraint it has is that the index _should_ be a non-negative integer. I am saying _should_ as opposed to _must_ because in typically JS fashion it will let you hang yourself since it lacks structure.

Here is why this loose behavior is so bad, especially for people who aren't used to JS this is confusing:

```JavaScript
//Declare your empty array
const arr = [];

//Add something to it at index 7 because why not
arr[7] = 7;

//Add "is nice" to it the array at index "yourmom" because sure that makese sense
arr["yourmom"] = "is nice";

//Use a negative one index because it's not going to stop you
arr[-1] = -1;
```

Now if we take each of those things we just put into the array (map?) and recall them we get the following:

> This is formatted like the console output of Node.js

```JavaScript
> arr[7]
7
> arr["yourmom"]
'is nice'
>arr[-1]
-1
```

So as we can see, there is no index zero as one would expect in an array. There is a negative one for an index, even though the documentation says it is [zero-indexed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#description). Additionally, I started my array at 7 to demonstrate the lack of constraints. Therefore, their definition is a generous one.

To complicate matters further, I was able to just add an arbitrary piece of text as an index. Now the documentation will correct me and say that this is not an index and actually a property stored on the array object.

```JavaScript
> arr.yourmom
'is nice'
```

Touché... That is technically correct, but it doesn't take away from the fact this is completely confusing and encourages reckless programming patterns. After all, is this an **ARRAY** or an object that has elements of _array_-like behavior embedded into it? This is the equivalent of calling a double-mocha-caramel-macchiato-half-sweet-almond-milk-late coffee. No it fucking isn't, that's a goddamned desert with coffee flavoring. Don't piss on my leg and tell me it's raining.

At this point you would think, "okay I have defeated the definition of an array here..."

> _evil guttural laughter ensues_

This is where JS has decided to stick to its guns on the definition of their so called Array.

Let me loop through my array now that I filled it with nonsense...

```JavaScript
> arr.forEach((x) => {console.log(x);})
7
undefined
```

_Wut?_

```JavaScript
> arr.length
8
```

**WHAT?**

```JavaScript
> arr
[ <7 empty items>, 7, '-1': -1, yourmom: 'is nice' ]
```

Frankly, at this point I would say this thing is a failure at being an Array. Let's recount what just happened here:

1. I added three elements
2. When asking for the length, it reports eight back
3. I do a `forEach` and it gives me back two elements, one of which is `undefined`
4. After inspecting the array's contents there are:
   1. seven "empty" items which really means `undefined`
   2. `yourmom` is a property
   3. the `-1` was changed to a string since it cannot be a self named property.

I would not consider, "Oh this is just how JavaScript does it though..." an acceptable explanation. No! It's crap, no one should do it like this. Somewhat unpredictable and it has no guard rails like the rest of the language. There are plenty of JavaScript apologists out there that will explain this behavior, I don't care what the reason is, JS Arrays are poorly designed as far as I am concerned.

## Initializing arrays with capacity

I want to start this section off by saying, **don't do this**. It's not worth the mind numbing problems that come with it. It's usually considered good practice to initialize your array's size if you know for a fact how large it's going to be. Well, JS doesn't think so.

When you initialize an Array with a capacity in JS you get an array full of `undefined`. This is helpful to no one, but that's how it works. _Gee Thanks_

To demonstrate how undesirable this is, here is a comparison between JS and C# on Arrays.

- [JS Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [C# System.Array](https://learn.microsoft.com/en-us/dotnet/api/system.array)

Initialization, Setting elements,
| Operation | JavaScript | C#|Comments |
| ---------- | ---------------------------- | --- | ----------------------------------------------------------------------------------------------------------------------------- |
| Initialization | `const arr = new Array(3);` |`var arr = new int[3];`| Setting the capacity. I plan on storing integers. |
| Setting elements | `arr[2] = 2;` |`arr[2] = 2;`| Setting index two to a value of two. |
| Output | `[<2 empty items>, 2]` |`[0, 0, 2]`|JS's array contains `undefined` and `number`. Where as C# contains all `int`.|

JS Arrays behave more like a C# [ArrayList](https://learn.microsoft.com/en-us/dotnet/api/system.collections.arraylist) which is a relic of the past. This is all that was available back in dot net 1 because generics didn't exist yet. Therefore, you had `ArrayList`s that had `null` and your struct/objects in it.

An argument can be made to use [Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays), but it says right in the documentation these are not a replacement for normal Arrays. My biggest pet peeve here is that JS Arrays are not Arrays even though that's their name. As much as it pains me to say this, it's closer to a managed array since it does all that whacky stuff shown in the previous section. It's just annoying because a real managed array won't fill automatically fill your memory space with crap. In the C# example, it fills the memory with the type's default value which happens to be zero. If it were an array of `string` then it would be `null`, but that's because a `string`'s default value is `null`.

Again, JS arrays are confused, they don't know what they want to be.

## Adding elements to your Array

> I want to make it very clear that JS Arrays DO NOT have an `add()` function.

This is a very important distinction to make because they do have a `push()` function which immediately makes people go, "Okay, I guess I use the `push()` function to add items to the array then?". That statement is half true. It can be used for adding items to the array, but the [documentation does say](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push):

> The `push()` method of `Array` instances adds the specified elements to the end of an array and returns the new length of the array.

There is a subtly here that is easy to miss. It has already been revealed in the previous sections the following things:

1. If you initialize an array's capacity, it is filled with `undefined`.
2. You can use any zero-based index and you don't have to start at zero.

Now since JS Arrays want to act like poorly managed arrays this is what happens when you assume that the `push()` function is an `add()` function from a real managed array.

```JavaScript
> arr = []
[]
> arr
[]
> arr[7] = 7
7
> arr
[ <7 empty items>, 7 ]
> arr.length
8
```

You start adding stuff to your array at index seven. JS automatically back fills the array with `undefined` and alas you have a `length` of eight. This is not how a **REAL** managed array behaves.

```csharp
var lst = new List<int>();
lst[7] = 7;
//Output: ArgumentOutOfRangeException: Index was out of range. Must be non-negative and less than the size of the collection. (Parameter 'index')
```

A **REAL** managed array will actually do the _management_ part by stopping you from accessing an index directly to add an element. If you wanted this ability, go use a **REAL** Array.

```csharp
var arr = new int[8];
arr[7] = 7;
//Output: [0, 0, 0, 0, 0, 0, 0, 7]
```

So now - what occurs if you use the `push()` function on a JS Array that has an initialized capacity of eight?

```JavaScript
> arr = new Array(8)
[ <8 empty items> ]
> arr.push(7)
9,
> arr
[ <8 empty items>, 7 ]
> arr.length
9
```

Again, this thing wants to be an array, managed array and a stack simultaneously; it's doing a horrible job. My expectation here is that it would start at zero which is why I am calling bullshit on this thing being a zero-indexed array. I understand why it works this way, I just think it's horribly misleading.

Here is the thought process written out:

1. I initialize an array to have a capacity of eight.
2. I push an item onto the empty array-stack.
3. I find out that my empty array-stack is actually filled with `undefined`.
4. The first item I added to the array using a `push()` function was appended to the end of a filled array...

Oh wait but there's more! If you just wanted to start adding things to the beginning of the array you can use  
[unshift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)!

You know, because when you think "add to the beginning of the array" the exact word "unshift" is what you are thinking.

Continuing with the same example, let's give `unshift()` a go...

```JavaScript
> arr.unshift(8)
10
> arr
[ 8, <8 empty items>, 7 ]
```

I see... so this too won't re-use the empty spots... Oh silly me, I should use [fill()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)! We fill arrays in JS...

```JavaScript
> arr.fill(9)
[
  9, 9, 9, 9, 9,
  9, 9, 9, 9, 9
]
```

Excellent! Now the whole array is trashed... thanks! All the values were replaced by the number nine. There are overloads for the `fill()` function, but at this point - no thanks! JS Arrays has every function available except one for actually adding items to an array properly. It's amazing. Therefore, here is the real solution I have learned to properly add items to an array.

```JavaScript
//Do not specify capacity
//Do not use the new operator
var arr = [];

//Using a zero index, sequentially assign values to the array
for (var i = 0; i < 8; i++) {
    arr[i] = i;
}
```

This is managing the array unlike what JS does. Notice the lack of a function call? JS is increasing the size of the array on each loop, but we are consistently adding integers sequentially to the array. There are no gaps of undefined values, there are no surprise lengths, it's exactly what we set out to do.

The take away here is:

> Do not use the `push()` function as if it is adding to the array unless you know for a fact your array was cleanly created.
