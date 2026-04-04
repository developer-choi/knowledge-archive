---
tags: [data-structure, concept]
---

# Questions
- [Linked List란 무엇인가?](#linked-list란-무엇인가)
- [Linked List와 Array의 차이는?](#linked-list와-array의-차이는)
- [Linked List의 종류는?](#linked-list의-종류는)
  - [Doubly Linked List가 Singly Linked List 대비 삽입/삭제에서 유리한 점은?](#doubly-linked-list가-singly-linked-list-대비-삽입삭제에서-유리한-점은)

---

# Answers

## Linked List란 무엇인가?

### Official Answer
Linked list is a linear data structure that stores data in nodes, which are connected by pointers.
Unlike arrays, nodes of linked lists are not stored in contiguous memory locations and can only be accessed sequentially, starting from the head of list.

### Reference
- https://www.geeksforgeeks.org/dsa/linked-list-data-structure/

---

## Linked List와 Array의 차이는?

### Official Answer

| Feature | Linked List | Array |
|---|---|---|
| Data Structure | Non-contiguous | Contiguous |
| Memory Allocation | Typically allocated one by one to individual elements | Typically allocated to the whole array |
| Insertion/Deletion | Efficient | Inefficient |
| Access | Sequential | Random |

### Reference
- https://www.geeksforgeeks.org/dsa/linked-list-data-structure/

---

## Linked List의 종류는?

### Official Answer
- **Doubly Linked List (DLL)**: Doubly linked lists allow for efficient traversal of the list in both directions, making it suitable for applications where frequent insertions and deletions are required.
- **Circular Linked List (CLL)**: We can traverse the list from any node and return to it without needing to restart from the head, which is useful in applications requiring a circular iteration.
In a circular linked list, each node has a reference to the next node in the sequence.
Although it doesn't have a direct reference to the previous node like a doubly linked list, we can still find the previous node by traversing the list.

> #### User Annotation:
> **Singly Linked List (SLL)**: head 포인터 하나만 있고 노드도 한쪽방향만 가리키는 케이스.

### Reference
- https://www.geeksforgeeks.org/dsa/linked-list-data-structure/
- https://www.geeksforgeeks.org/dsa/doubly-linked-list/
- https://www.geeksforgeeks.org/dsa/circular-linked-list/

---

## Doubly Linked List가 Singly Linked List 대비 삽입/삭제에서 유리한 점은?

### Official Answer
Easy insertion and deletion of nodes: The presence of pointers to both the previous and next nodes makes it easy to insert or delete nodes from the list, without having to traverse the entire list.

> #### User Annotation:
> 삭제해야할 노드의 주소값을 알 경우 O(1)로 삭제가능.
> Singly Linked List는 직전노드알아야되서 O(n).

### Reference
- https://www.geeksforgeeks.org/dsa/doubly-linked-list/
