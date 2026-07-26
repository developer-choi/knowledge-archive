---
tags: [react, concept]
source: official
---
# Questions
- 깊이 중첩된 state를 업데이트할 때 무엇이 문제고 어떻게 해결하는가?

---

# Answers

## 깊이 중첩된 state를 업데이트할 때 무엇이 문제고 어떻게 해결하는가?

### Official Answer
Updating nested state involves making copies of objects all the way up from the part that changed.
If the state is too nested to update easily, consider making it "flat".
Instead of a tree-like structure where each place has an array of its child places, you can have each place hold an array of its child place IDs.
Then store a mapping from each place ID to the corresponding place.
Now that the state is "flat" (also known as "normalized"), updating nested items becomes easier.

In order to remove a place now, you only need to update two levels of state:
the updated version of its parent place should exclude the removed ID from its childIds array, and
the updated version of the root "table" object should include the updated version of the parent place.

You can nest state as much as you like, but making it "flat" can solve numerous problems.
It makes state easier to update, and it helps ensure you don't have duplication in different parts of a nested object.

### Reference
- https://react.dev/learn/choosing-the-state-structure

