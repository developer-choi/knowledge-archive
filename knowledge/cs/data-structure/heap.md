---
tags: [data-structure, concept]
---

# Questions
- Heap이란 무엇인가?
  - Min Heap에서 원소가 정렬된 순서로 저장되어야 하는가?
- Heap 자료구조의 장점은?

---

# Answers

## Heap이란 무엇인가?

### Official Answer
A Heap is a complete binary tree data structure that satisfies the heap property: for every node, the value of its children is greater than or equal to its own value.
where the smallest (or largest) element is always at the root of the tree.

> #### Key Terms:
> - **complete binary tree**: 마지막 레벨을 제외한 모든 레벨이 완전히 채워져 있고, 마지막 레벨은 왼쪽부터 채워지는 이진 트리
> - **heap property**: 부모 노드가 자식 노드보다 항상 크거나(Max Heap) 작은(Min Heap) 성질

> #### User Annotation:
> 우선순위 큐 만들 때 쓴다.

### Reference
- https://www.geeksforgeeks.org/dsa/heap-data-structure/

---

## Min Heap에서 원소가 정렬된 순서로 저장되어야 하는가?

### User Answer
[1, 3, 2]도 [1, 2, 3]도 둘 다 Min Heap이 맞음.

---

## Heap 자료구조의 장점은?

### Official Answer
- **Priority-based**: Heaps allow elements to be processed based on priority.
- **Time Efficient**: The most important thing is, we can get the min or max in O(1) time.
- Heaps have an average time complexity of O(log n) for inserting and deleting elements.

> #### User Annotation:
> k번째 큰 수 / 작은 수 구하는 문제에서 아주 유효함.
> 힙의 root가 제일 작거나 제일 큰 수가 되니까.
>
> array는 최대 최소값 얻으려면 O(n)임.

### Reference
- https://www.geeksforgeeks.org/dsa/heap-data-structure/
- https://www.geeksforgeeks.org/dsa/applications-advantages-and-disadvantages-of-heap/
