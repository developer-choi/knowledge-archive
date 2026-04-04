---
tags: [data-structure, concept]
---

# Questions
- [Binary Tree란 무엇인가?](#binary-tree란-무엇인가)
- [Binary Tree의 주요 속성(Properties)은?](#binary-tree의-주요-속성properties은)
- [Self-Balancing BST의 활용은?](#self-balancing-bst의-활용은)

---

# Answers

## Binary Tree란 무엇인가?

### Official Answer
In a binary tree, each node can have a maximum of two children linked to it.

> #### User Annotation:
> 최대 2개.

### Reference
- https://www.geeksforgeeks.org/dsa/binary-tree-data-structure/

---

## Binary Tree의 주요 속성(Properties)은?

### Official Answer
- A binary tree can have at most 2^h nodes at level h.
- A binary tree of height h can have at most 2^(h+1) - 1 nodes.
- The minimum possible height for N nodes is ⌈log₂N⌉.
- A binary tree with L leaves must have at least ⌈log₂L⌉ levels.
- In any non-empty binary tree with n nodes, the total number of edges is n - 1.

### Reference
- https://www.geeksforgeeks.org/dsa/properties-of-binary-tree/

---

## Self-Balancing BST의 활용은?

### Official Answer
A Self-Balancing Binary Search Tree is used to implement doubly ended priority queue.
With a Binary Heap, we can either implement a priority queue with support of extractMin() or with extractMax().
If we wish to support both the operations, we use a Self-Balancing Binary Search Tree to do both in O(Log n).

### Reference
- https://www.geeksforgeeks.org/dsa/applications-of-bst/
