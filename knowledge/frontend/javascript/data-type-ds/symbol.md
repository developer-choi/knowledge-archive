---
tags: [javascript, concept]
source: official
publishable: true
---
# Questions
- Symbol이란 무엇이고, 다른 원시값과 결정적으로 다른 점은?
- Symbol을 객체의 속성 키로 쓰면 어떤 이점이 있는가?
- well-known Symbol이란 무엇이고 왜 도입됐는가?

---

# Answers

## Symbol이란 무엇이고, 다른 원시값과 결정적으로 다른 점은?

### Official Answer
Symbol is a built-in object whose constructor returns a symbol primitive — also called a Symbol value or just a Symbol — that's guaranteed to be unique.

Every Symbol() call is guaranteed to return a unique Symbol.

## Symbol을 객체의 속성 키로 쓰면 어떤 이점이 있는가?

### Official Answer
Symbols are often used to add unique property keys to an object that won't collide with keys any other code might add to the object, and which are hidden from any mechanisms other code will typically use to access the object.

## well-known Symbol이란 무엇이고 왜 도입됐는가?

### Official Answer
All static properties of the Symbol constructor are Symbols themselves, whose values are constant across realms. They are known as well-known Symbols, and their purpose is to serve as "protocols" for certain built-in JavaScript operations, allowing users to customize the language's behavior.

Prior to well-known Symbols, JavaScript used normal properties to implement certain built-in operations. However, as more operations are added to the language, designating each operation a "magic property" can break backward compatibility and make the language's behavior harder to reason with. Well-known Symbols allow the customizations to be "invisible" from normal code, which typically only read string properties.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
