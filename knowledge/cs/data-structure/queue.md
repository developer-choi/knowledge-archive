---
tags: [data-structure, concept]
---

# Questions
- Queue란 무엇인가?
  - Queue에서 Front와 Rear는 각각 어디를 가리키며, Size와 Capacity의 차이는?
- Queue의 주요 연산과 시간복잡도는?
  - Queue의 Enqueue/Dequeue 연산에서 overflow와 underflow는 각각 언제 발생하는가?
- Deque(Double Ended Queue)란 무엇이며, 일반 Queue와 어떻게 다른가?
- Priority Queue란 무엇이며, 어떤 자료구조로 구현하는가?
- CircularQueue와 LinkedListQueue의 차이는?

---

# Answers

## Queue란 무엇인가?

### Official Answer
Queue is a linear data structure that follows FIFO (First In First Out) Principle.

### Reference
- https://www.geeksforgeeks.org/dsa/queue-data-structure/

---

## Queue에서 Front와 Rear는 각각 어디를 가리키며, Size와 Capacity의 차이는?

### Official Answer
- **Front / Head**: Position of the entry in a queue ready to be served, that is, the first entry that will be removed from the queue, is called the front of the queue.
It is also referred as the head of the queue.
- **Rear / Back / Tail**: Position of the last entry in the queue, that is, the one most recently added, is called the rear of the queue.
It is also referred as the tail of the queue.
- **Size**: Size refers to the current number of elements in the queue.
- **Capacity**: Capacity refers to the maximum number of elements the queue can hold.

### Reference
- https://www.geeksforgeeks.org/dsa/queue-data-structure/

---

## Queue의 주요 연산과 시간복잡도는?

### Official Answer

| Operations | Time Complexity | Space Complexity |
|---|---|---|
| enqueue | O(1) | O(1) |
| dequeue | O(1) | O(1) |
| front | O(1) | O(1) |
| size | O(1) | O(1) |
| isEmpty | O(1) | O(1) |
| isFull | O(1) | O(1) |

### Reference
- https://www.geeksforgeeks.org/dsa/queue-data-structure/

---

## Queue의 Enqueue/Dequeue 연산에서 overflow와 underflow는 각각 언제 발생하는가?

### Official Answer
- **Enqueue**: Adds an element to the end (rear) of the queue.
If the queue is full, an overflow error occurs.
- **Dequeue**: Removes the element from the front of the queue.
If the queue is empty, an underflow error occurs.
- **Peek/Front**: Returns the element at the front without removing it.
- **Size**: Returns the number of elements in the queue.
- **isEmpty**: Returns true if the queue is empty, otherwise false.
- **isFull**: Returns true if the queue is full, otherwise false.

### Reference
- https://www.geeksforgeeks.org/dsa/queue-data-structure/

---

## Deque(Double Ended Queue)란 무엇이며, 일반 Queue와 어떻게 다른가?

### Official Answer
- **Simple Queue**: Simple Queue simply follows FIFO Structure.
We can only insert the element at the back and remove the element from the front of the queue.
A simple queue is efficiently implemented either using a linked list or a circular array.
- **Deque (Double Ended Queue)**: The insertion and deletion operations, both can be performed from both ends.

### Reference
- https://www.geeksforgeeks.org/dsa/queue-data-structure/
- https://www.geeksforgeeks.org/dsa/deque-set-1-introduction-applications/

---

## Priority Queue란 무엇이며, 어떤 자료구조로 구현하는가?

### User Answer
dequeue할 때 우선순위에 맞게 값이 빠져나오는 큐.
힙(Heap) 자료구조로 구현한다.

### Reference
- https://www.geeksforgeeks.org/priority-queue-set-1-introduction/

---

## CircularQueue와 LinkedListQueue의 차이는?

### User Answer
CircularQueue / LinkedListQueue 둘 다 enqueue() dequeue()의 Time Complexity는 O(1)로 동일함.

하지만 차이는,
1. 서로 Fixed Size냐 Dynamic Size냐로 갈리고,
2. Contiguous냐 아니냐로 갈림.

**CircularQueue**
1. 크기 고정이라서 계속 집어넣다 초과하는게 별로임
2. 덜집어넣으면 낭비되는 공간이 있음
3. 하지만 Contiguous라서 캐시친화적임

**LinkedListQueue**
1. 크기 가변이라서 덜집어넣건 많이집어넣건 아주좋음
2. 하지만 메모리에 띄엄띄엄 할당되기 때문에 비교적 덜 캐시친화적임

### Reference
- https://www.geeksforgeeks.org/dsa/queue-data-structure/
- https://www.geeksforgeeks.org/dsa/queue-linked-list-implementation/
