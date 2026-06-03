---
tags: [programming-paradigm, concept]
source: official
publishable: true
---
# Questions
- 얕은 복사(shallow copy)란 무엇인가?
- 깊은 복사(deep copy)란 무엇인가?
- 깊은 복사와 얕은 복사가 결정적으로 다른 점은 무엇인가?

---

# Answers

## 얕은 복사(shallow copy)란 무엇인가?

### Official Answer
One method of copying an object is the shallow copy. In that case a new object B is created, and the fields values of A are copied over to B. This is also known as a field-by-field copy, field-for-field copy, or field copy. Shallow copies are simple and typically cheap, as they can usually be implemented by simply copying the bits exactly.

### Reference
- https://en.wikipedia.org/wiki/Object_copying

## 깊은 복사(deep copy)란 무엇인가?

### Official Answer
An alternative is a deep copy, meaning that fields are dereferenced: rather than references to objects being copied, new copy of objects are created for any referenced objects, and references to these are placed in B.

### Reference
- https://en.wikipedia.org/wiki/Object_copying

## 깊은 복사와 얕은 복사가 결정적으로 다른 점은 무엇인가?

### Official Answer
Later modifications to the contents remain unique to A or B, as the contents are not shared.

### Reference
- https://en.wikipedia.org/wiki/Object_copying
