---
tags: [javascript, concept]
source: official
publishable: true
---
# Questions
- iteration protocol이란 무엇인가? 새로운 문법인가?
- 객체가 iterable이 되려면 무엇을 구현해야 하는가?
- iterator란 무엇이며, 어떤 메서드를 구현해야 iterator가 되는가?
- iterator의 next()는 무엇을 반환해야 하며, 그 반환 객체 안의 필드들은 각각 무엇을 의미하는가?

---

# Answers

## iteration protocol이란 무엇인가? 새로운 문법인가?

### Official Answer
Iteration protocols aren't new built-ins or syntax, but protocols. These protocols can be implemented by any object by following some conventions.

There are two protocols: The iterable protocol and the iterator protocol.

## 객체가 iterable이 되려면 무엇을 구현해야 하는가?

### Official Answer
In order to be iterable, an object must implement the [Symbol.iterator]() method, meaning that the object (or one of the objects up its prototype chain) must have a property with a [Symbol.iterator] key which is available via constant Symbol.iterator.

[Symbol.iterator]() is a zero-argument function that returns an object, conforming to the iterator protocol.

Whenever an object needs to be iterated (such as at the beginning of a for...of loop), its [Symbol.iterator]() method is called with no arguments, and the returned iterator is used to obtain the values to be iterated.

Note that when this zero-argument function is called, it is invoked as a method on the iterable object. Therefore inside of the function, the this keyword can be used to access the properties of the iterable object, to decide what to provide during the iteration.

This function can be an ordinary function, or it can be a generator function, so that when invoked, an iterator object is returned. Inside of this generator function, each entry can be provided by using yield.

## iterator란 무엇이며, 어떤 메서드를 구현해야 iterator가 되는가?

### Official Answer
The iterator protocol defines a standard way to produce a sequence of values (either finite or infinite), and potentially a return value when all values have been generated.

An object is an iterator when it implements a next() method with the following semantics.

## iterator의 next()는 무엇을 반환해야 하며, 그 반환 객체 안의 필드들은 각각 무엇을 의미하는가?

### Official Answer
next() is a function that accepts zero or one argument and returns an object conforming to the IteratorResult interface. If a non-object value gets returned (such as false or undefined) when a built-in language feature (such as for...of) is using the iterator, a TypeError ("iterator.next() returned a non-object value") will be thrown.

All iterator protocol methods (next(), return(), and throw()) are expected to return an object implementing the IteratorResult interface. It must have the following properties:

done — A boolean that's false if the iterator was able to produce the next value in the sequence. Has the value true if the iterator has completed its sequence. In this case, value optionally specifies the return value of the iterator.

value — Any JavaScript value returned by the iterator. Can be omitted when done is true.

In practice, neither property is strictly required; if an object without either property is returned, it's effectively equivalent to { done: false, value: undefined }.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
