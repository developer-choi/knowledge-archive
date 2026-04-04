---
tags: [algorithm, concept]
---

# Questions
- [Linear Search란?](#linear-search란)
- [Linear Search의 활용과 장점은?](#linear-search의-활용과-장점은)

---

# Answers

## Linear Search란?

### Official Answer
Linear search is defined as the searching algorithm where the list or data set is traversed from one end to find the desired value.
Linear search works by sequentially checking each element in the list until the desired value is found or the end of the list is reached.

It is used for an unsorted array.
It mainly does one by one comparison of the item to be search with array elements.

- **Time Complexity**: Best = O(1), Worst = O(n), Average = O(n)
- **Auxiliary Space**: O(1) as except for the variable to iterate through the list, no other variable is used.

> #### User Annotation:
> 찾는게 맨앞에 있을 때 O(1), 맨 뒤에 있을 때 O(n).

### Reference
- https://www.geeksforgeeks.org/dsa/linear-search/
- https://www.geeksforgeeks.org/dsa/what-is-linear-search/

---

## Linear Search의 활용과 장점은?

### Official Answer
**Applications**:
- **Unsorted Lists**: When we have an unsorted array or list, linear search is most commonly used to find any element in the collection.
- **Searching Linked Lists**: In linked list implementations, linear search is commonly used to find elements within the list.
Each node is checked sequentially until the desired element is found.
- **Finding Minimum and Maximum Values**: Linear search can be used to find the minimum and maximum values in an array or list.

**Advantages**:
- Linear search can be used irrespective of whether the array is sorted or not.
- It can be used on arrays of any data type.
- Linear Search is much easier to understand and implement as compared to Binary Search or Ternary Search.

### Reference
- https://www.geeksforgeeks.org/dsa/linear-search/
- https://www.geeksforgeeks.org/dsa/what-is-linear-search/
