# absurdUID.js
Javascript function that generates a unique string based on the UNIX timestamp and the runtime.

# Why?

Today I ran into an issue. The guy sitting next to me in the university was trying out PouchDB and was confused by the identifiers. It was illogical for him why he had to determine the ID for each document himself.
In my last project I just generated a random number and asked if it already existed. Actually quite bad, but it worked. 

Then I asked my friend Google and came across a solution on Stackoverflow.

At that moment I was shocked how simple this approach was and how I never came up with this idea.

Just create an ID using the current UNIX Timestamp with `new Date().getTime()`

But after a short thought I asked myself a question. Does this approach still work when my code generates many records in a row?

For the demonstration I use PouchDB.

With PouchDB you can create a batch of documents with [`db.bulkDocs()`](https://pouchdb.com/api.html#batch_create)


```javascript
db.bulkDocs([
{
    title : 'Record 1', 
    _id: +new Date()
},
{
    title : 'Record 2', 
    _id: +new Date()
}
]).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.log(err);
});
```

As you might expect, only the first entry will be created and the second one will return an error because it is done in the same timestamp and end up with the same `_id`. 

I needed something more accurate than milliseconds. I was helped by `performance.now()`.

Unlike other timing data available to JavaScript (for example Date.now), the timestamps returned by performance.now() are not limited to one-millisecond resolution. Instead, they represent times as floating-point numbers with up to microsecond precision.

Also unlike Date.now(), the values returned by performance.now() always increase at a constant rate, independent of the system clock (which might be adjusted manually or skewed by software like NTP).

So if I combine these two methods, I should end up with a very accurate Unique Identifier.


Lets create this simple function:
```javascript
function uniqueID() {
    return new Date().getTime().toString().concat(performance.now());
}
```

And output some data:
```javascript
console.log(new Date().getTime());
// Output: 1568115683706

console.log(performance.now());
// Output: 218.28000000095926

console.log(uniqueID());
// Output: 1568115683706218.28000000095926
```

Even if this seems completely absurd in my eyes, I can hardly think of a possibility that he runs on an error because of an already existing ID.

Because in every millisecond of the current UNIX timestamp the value of five thousandths of a millisecond (5 microseconds) of the runtime is added.

Let's use above uniqueID() function like this:
```javascript
db.bulkDocs([
{
    title : 'Record 1', 
    _id: uniqueID() // 1568116510818456.76499999899534
},
{
    title : 'Record 2', 
    _id: uniqueID() // 1568116510819456.94000000003143
}
]).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.log(err);
});
```

As you can see, between the two entries, the difference from the results is large enough. 

Of course, this approach can lead to a problem if millions of users work with the same database. But on a small scale it shouldn't run into a problem.

I am always open for ideas or suggestions. What do you think about this approach? 
