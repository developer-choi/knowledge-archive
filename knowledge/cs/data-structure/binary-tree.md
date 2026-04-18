---
tags: [data-structure, concept]
---

# Questions
- Binary Tree란 무엇인가?
- 높이 h인 Binary Tree의 레벨 h에 최대 몇 개 노드가 존재할 수 있는가?
- 높이 h인 Binary Tree가 가질 수 있는 최대 노드 수는?
- N개 노드를 가진 Binary Tree의 최소 높이는?
- L개의 리프 노드를 가진 Binary Tree의 최소 레벨 수는?
- N개 노드를 가진 Binary Tree의 총 간선(edge) 수는?
- Self-Balancing BST의 활용은?
- Complete Binary Tree와 Perfect Binary Tree의 차이는?
- Full Binary Tree란 무엇인가?
- Degenerate(Pathological) Binary Tree란 무엇이며, 왜 비효율적인가?
- Balanced Binary Tree란 무엇이며, 대표적인 예시는?
- Tree를 구현/표현하는 2가지 방법은?

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

## 높이 h인 Binary Tree의 레벨 h에 최대 몇 개 노드가 존재할 수 있는가?

### Official Answer
A binary tree can have at most 2^h nodes at level h.

### Reference
- https://www.geeksforgeeks.org/dsa/properties-of-binary-tree/

---

## 높이 h인 Binary Tree가 가질 수 있는 최대 노드 수는?

### Official Answer
A binary tree of height h can have at most 2^(h+1) - 1 nodes.

### Reference
- https://www.geeksforgeeks.org/dsa/properties-of-binary-tree/

---

## N개 노드를 가진 Binary Tree의 최소 높이는?

### Official Answer
The minimum possible height for N nodes is ⌈log₂N⌉.

### Reference
- https://www.geeksforgeeks.org/dsa/properties-of-binary-tree/

---

## L개의 리프 노드를 가진 Binary Tree의 최소 레벨 수는?

### Official Answer
A binary tree with L leaves must have at least ⌈log₂L⌉ levels.

### Reference
- https://www.geeksforgeeks.org/dsa/properties-of-binary-tree/

---

## N개 노드를 가진 Binary Tree의 총 간선(edge) 수는?

### Official Answer
In any non-empty binary tree with n nodes, the total number of edges is n - 1.

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

---

## Complete Binary Tree와 Perfect Binary Tree의 차이는?

### Official Answer
- **Complete Binary Tree**: A special type of binary tree where all the levels of the tree are filled completely except the lowest level nodes which are filled from as left as possible.
- **Perfect Binary Tree**: All levels are completely filled.
The number of leaf nodes equals the number of internal nodes plus one.

> #### User Annotation:
> - 마지막레벨 제외하고 다 채워져있으면 Complete Binary Tree
> - 마지막레벨 까지도 다 채워져있으면 Perfect Binary Tree가 됨.
> - Complete에서 마지막 레벨 노드가 왼쪽부터 채워져있지 않으면 해당안됨.

### Reference
- https://www.geeksforgeeks.org/dsa/types-of-trees-in-data-structures/
- https://www.geeksforgeeks.org/dsa/complete-binary-tree/
- https://www.geeksforgeeks.org/dsa/perfect-binary-tree/

---

## Full Binary Tree란 무엇인가?

### Official Answer
A binary tree where every node has either 0 or 2 children.

> #### User Annotation:
> 자식이 1개인 노드가 없으면 됨. 상위 레벨에서 자식이 없는 경우도 Full Binary Tree 자체는 맞음.

### Reference
- https://www.geeksforgeeks.org/dsa/types-of-trees-in-data-structures/

---

## Degenerate(Pathological) Binary Tree란 무엇이며, 왜 비효율적인가?

### Official Answer
A tree in which each parent node has only one child.
This essentially forms a linked list, which leads to inefficient operations.

### Reference
- https://www.geeksforgeeks.org/dsa/types-of-trees-in-data-structures/

---

## Balanced Binary Tree란 무엇이며, 대표적인 예시는?

### Official Answer
A binary tree where the difference in heights between the left and right subtrees of any node is minimal (often defined as at most 1).
Examples: AVL Tree, Red Black Tree, Splay Tree.

### Reference
- https://www.geeksforgeeks.org/dsa/types-of-trees-in-data-structures/

---

## Tree를 구현/표현하는 2가지 방법은?

### User Answer
**Linked List 방식**:
- 장점: 모든 종류의 Tree를 표현 가능.
- 단점: 노드에 데이터 뿐만 아니라 포인터도 같이 저장해야해서 메모리 크기가 증가함.
탐색이 Balance 정도에 따라 O(log n) ~ O(n)임.

**Array 방식**:
- 장점: 배열을 사용하기 때문에 Cache Friendly함.
Complete Binary Tree에 한해, Linked List 대비 메모리를 덜 사용할 수 있음 (포인터 저장 안하니까).
- 단점: 배열로 표현할 수 있으려면, Tree의 최대 자식노드갯수가 정해져있어야함 (Binary Tree 등).
Array에 낭비되는 메모리공간이 많아질 수 있어서, 효율적으로 쓰려면 Balanced하고 왼쪽부터 채워야함.
추가, 삭제 연산이 최악의 경우 O(n)임. 하지만 접근은 언제나 O(1)임.

> #### User Annotation:
> Array 인덱스 공식 (0부터 시작하는 인덱스 기준):
> - 부모: `parent(i) = (i - 1) / 2`
> - 왼쪽 자식: `left(i) = 2 * i + 1`
> - 오른쪽 자식: `right(i) = 2 * i + 2`

> #### AI Annotation:
> 배열은 주로 힙(Heap)이나 완전 이진 트리(Complete Binary Tree)처럼 구조가 꽉 찬 트리를 표현할 때 압도적으로 유리함.
> 일반적인 대부분의 트리, 특히 구조가 동적으로 변하거나 예측하기 어려운 경우에는 노드와 포인터(참조) 방식을 사용함.

### Reference
- https://www.geeksforgeeks.org/dsa/binary-tree-array-implementation/
