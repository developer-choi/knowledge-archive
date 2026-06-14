# Queue란 무엇인가?

## 도입

Queue는 줄 서기와 같다 — 먼저 온 사람이 먼저 처리된다. Stack의 LIFO와 반대로, Queue는 FIFO(First In First Out) 원칙을 따른다. JS에서는 `Array.push()`로 뒤에 넣고 `Array.shift()`로 앞에서 꺼내는 방식이 Queue다 (단, `shift()`는 O(n)이라 실제 구현에서는 Deque를 쓰거나 포인터를 따로 관리한다).

---

## 본문

> Queue is a linear data structure that follows FIFO (First In First Out) Principle.

"Queue는 FIFO(선입선출) 원칙을 따르는 선형 자료구조다."

- **FIFO**: 먼저 들어온 것이 먼저 나간다. 네트워크 패킷 처리, 프린터 대기열, BFS(너비 우선 탐색)가 모두 Queue 구조를 사용한다.

```
enqueue →  [1, 2, 3, 4]  → dequeue
           (rear)  (front)

enqueue(5): [1, 2, 3, 4, 5]
dequeue():  반환값 1, 남은: [2, 3, 4, 5]
```

---

## 종합

Queue의 핵심은 "처리 순서가 도착 순서와 동일하다"는 점이다. Stack이 "가장 최근"을 우선하는 반면 Queue는 "가장 먼저"를 우선한다. BFS에서 Queue를 쓰는 이유가 바로 이것이다 — 현재 레벨의 모든 노드를 처리한 뒤에야 다음 레벨로 넘어가는 "먼저 넣은 것부터" 순서가 레벨 순회를 자연스럽게 만든다.

---

# Queue에서 Front와 Rear는 각각 어디를 가리키며, Size와 Capacity의 차이는?

## 도입

Queue는 양쪽 끝에서 동작한다 — 한쪽(Rear)으로 넣고 반대쪽(Front)에서 꺼낸다. 크기를 나타내는 용어도 두 가지가 있는데, 현재 들어있는 수(Size)와 최대로 들어갈 수 있는 수(Capacity)는 다른 개념이다.

---

## 본문

> **Front / Head**: Position of the entry in a queue ready to be served, that is, the first entry that will be removed from the queue.

"Front/Head: 처리될 준비가 된 항목의 위치, 즉 Queue에서 먼저 제거될 첫 번째 항목."

- **ready to be served**: dequeue 연산의 대상. 항상 가장 오래 기다린 원소가 있는 자리다.

> **Rear / Back / Tail**: Position of the last entry in the queue, that is, the one most recently added.

"Rear/Back/Tail: Queue에서 마지막 항목의 위치, 즉 가장 최근에 추가된 항목."

- **most recently added**: enqueue 연산의 대상. 새 원소는 항상 여기에 붙는다.

> **Size**: Size refers to the current number of elements in the queue.

"Size: Queue에 현재 들어있는 원소의 수."

> **Capacity**: Capacity refers to the maximum number of elements the queue can hold.

"Capacity: Queue가 담을 수 있는 최대 원소 수."

```
Capacity = 5인 Queue:
  Front                  Rear
    ↓                     ↓
  [ A,  B,  C, ___, ___ ]
  Size = 3, Capacity = 5, 여유 = 2
```

---

## 종합

Front와 Rear를 포인터로 추적하는 이유는 dequeue 후 남은 공간을 재사용하기 위해서다. 단순 배열 Queue는 Front를 이동할 때마다 앞 공간이 낭비된다 — 이것을 해결한 게 Circular Queue다. Size는 "현재 상태", Capacity는 "한계치"를 나타내며, `Size === Capacity`면 overflow, `Size === 0`이면 underflow 조건이 된다.

---

# Queue의 주요 연산과 시간복잡도는?

## 도입

Queue의 모든 핵심 연산은 O(1)이다. Front와 Rear 포인터만 갱신하면 되기 때문에 원소 수에 관계없이 일정 시간이 걸린다.

---

## 본문

OA 연산표:

| 연산 | Time Complexity | Space Complexity |
|---|---|---|
| enqueue | O(1) | O(1) |
| dequeue | O(1) | O(1) |
| front | O(1) | O(1) |
| size | O(1) | O(1) |
| isEmpty | O(1) | O(1) |
| isFull | O(1) | O(1) |

모든 연산이 O(1)인 이유: Queue는 Front와 Rear 두 포인터만으로 동작한다. enqueue는 `Rear` 위치에 원소를 놓고 Rear를 한 칸 이동, dequeue는 `Front` 위치 원소를 읽고 Front를 한 칸 이동 — 항상 단일 연산이다.

```
초기:   Front=0, Rear=0  []
enqueue(A): Rear=1      [A]
enqueue(B): Rear=2      [A, B]
dequeue():  Front=1, 반환 A  [B]
```

---

## 종합

Queue의 O(1) 연산은 Front/Rear 포인터 방식 덕분이다. 단, 일반 배열로 구현하면 dequeue 후 앞 공간이 낭비되고, Front가 배열 끝까지 가면 가득 찬 것처럼 보이는 문제가 생긴다. 이를 해결하기 위해 Circular Queue(모듈러 연산으로 인덱스 순환)나 Linked List 기반 Queue를 사용한다.

---

# Queue의 Enqueue/Dequeue 연산에서 overflow와 underflow는 각각 언제 발생하는가?

## 도입

Queue는 크기 제한이 있을 수 있고, 비어 있을 수 있다. 이 두 극단 상황에서 연산을 시도하면 오류가 발생한다.

---

## 본문

> **Enqueue**: Adds an element to the end (rear) of the queue. If the queue is full, an overflow error occurs.

"Enqueue: Queue의 끝(rear)에 원소를 추가한다. Queue가 가득 차면 overflow 오류가 발생한다."

- **overflow**: 담을 수 있는 한계(Capacity)를 초과하려 할 때. Fixed Size Queue에서 발생한다. Dynamic Size Queue(Linked List 기반)는 이 오류가 없다.

> **Dequeue**: Removes the element from the front of the queue. If the queue is empty, an underflow error occurs.

"Dequeue: Queue의 앞(front)에서 원소를 제거한다. Queue가 비어 있으면 underflow 오류가 발생한다."

- **underflow**: 꺼낼 원소가 없는데 dequeue를 시도할 때. isEmpty 체크가 선행되어야 한다.

```
Overflow:  Capacity=3, [A,B,C] → enqueue(D) → ERROR
Underflow: [] → dequeue() → ERROR
```

다른 연산 요약:
- **Peek/Front**: Front 원소를 제거하지 않고 읽기만 한다.
- **isEmpty**: `Size === 0` 여부 반환.
- **isFull**: `Size === Capacity` 여부 반환.

---

## 종합

overflow와 underflow는 Queue를 사용하는 코드에서 반드시 방어해야 하는 경계 조건이다. BFS 구현 시 Queue가 비어 있는지 확인하는 `while (queue.length > 0)` 루프가 underflow 방지의 전형적인 패턴이다. JS의 배열은 동적이라 overflow가 없지만, 알고리즘 문제에서 Fixed Size Queue를 직접 구현하면 두 조건을 명시적으로 처리해야 한다.

---

# Deque(Double Ended Queue)란 무엇이며, 일반 Queue와 어떻게 다른가?

## 도입

일반 Queue는 한 방향으로만 넣고 꺼낼 수 있다 — Rear로 넣고 Front에서 꺼낸다. Deque는 양쪽 끝 모두에서 넣거나 꺼낼 수 있어, Queue와 Stack의 기능을 합친 자료구조다.

---

## 본문

> **Simple Queue**: Simple Queue simply follows FIFO Structure. We can only insert the element at the back and remove the element from the front of the queue.

"단순 Queue는 FIFO 구조만 따른다. 뒤에만 삽입하고 앞에서만 제거할 수 있다."

> **Deque (Double Ended Queue)**: The insertion and deletion operations, both can be performed from both ends.

"Deque: 삽입과 삭제 연산 모두 양쪽 끝에서 수행할 수 있다."

- **both ends**: Front에서 넣거나 뺄 수 있고, Rear에서도 넣거나 뺄 수 있다. 총 4가지 연산이 가능하다.

```
단순 Queue:
  enqueue →  [A, B, C]  → dequeue
              Rear        Front

Deque:
  ← addFront   [A, B, C]   addRear →
  removeFront →              ← removeRear
```

Simple Queue는 내부적으로 Linked List나 Circular Array로 효율적으로 구현한다.

---

## 종합

Deque는 Queue와 Stack의 슈퍼셋이다 — Front만 쓰면 Stack처럼, Rear 삽입 + Front 제거만 쓰면 Queue처럼 동작한다. 슬라이딩 윈도우 최대값 문제에서 Deque가 핵심 도구로 쓰인다 — 양쪽에서 불필요한 원소를 제거하면서 창 안의 최대값을 O(1)에 조회한다. JS에는 내장 Deque가 없어서 배열로 흉내내거나 이중 연결 리스트로 직접 구현한다.

---

# [UNVERIFIED] Priority Queue란 무엇이며, 어떤 자료구조로 구현하는가?

## 도입

일반 Queue는 먼저 들어온 순서대로 처리한다. Priority Queue는 "먼저 들어온 것"이 아니라 "우선순위가 높은 것"을 먼저 꺼낸다. 병원 응급실처럼 중증 환자가 먼저 처리되는 구조다.

---

## 본문

Priority Queue는 dequeue할 때 일반적인 FIFO 순서가 아니라 우선순위 기준으로 원소가 나온다. Min Priority Queue는 가장 작은 값이, Max Priority Queue는 가장 큰 값이 먼저 나온다.

구현 자료구조: **Heap(힙)**

Heap을 사용하는 이유:
- 삽입: O(log n) — 새 원소를 넣고 heap property를 유지하기 위해 위로 올린다(heapify up).
- 최솟값/최댓값 추출: O(log n) — root를 꺼내고 마지막 원소를 root로 올린 뒤 아래로 내린다(heapify down).
- 최솟값/최댓값 조회: O(1) — root가 항상 최소/최대값이다.

```js
// JS에는 내장 Priority Queue가 없어 직접 구현하거나 라이브러리 사용
// Min Heap 기반 Priority Queue 개념:
enqueue(5) → [5]
enqueue(2) → [2, 5]   ← 2가 루트로 올라감
enqueue(8) → [2, 5, 8]
dequeue()  → 반환 2, 남은: [5, 8]  ← 항상 최솟값이 나옴
```

---

## 종합

Priority Queue는 "가장 중요한 것부터 처리"하는 모든 시나리오에서 핵심 도구다. 다익스트라 알고리즘(최단 경로), 허프만 코딩(압축), CPU 스케줄링이 모두 Priority Queue를 사용한다. Heap으로 구현하면 삽입·추출 모두 O(log n)이라 효율적이다 — 정렬된 배열로 구현하면 삽입이 O(n)이 된다.

---

# [UNVERIFIED] CircularQueue와 LinkedListQueue의 차이는?

## 도입

Queue를 구현하는 방법은 크게 두 가지다 — 고정 크기 배열을 순환하여 사용하는 CircularQueue와, 동적으로 노드를 연결하는 LinkedListQueue. 두 방식 모두 enqueue/dequeue가 O(1)이지만 메모리 특성이 다르다.

---

## 본문

두 구현 방식의 비교:

**CircularQueue (배열 기반)**
- 크기 고정(Fixed Size): 처음 선언한 크기를 넘을 수 없다. 공간이 부족하면 overflow.
- 덜 채우면 낭비 공간 발생.
- Contiguous 메모리 → 캐시 친화적.

**LinkedListQueue (연결 리스트 기반)**
- 크기 가변(Dynamic Size): 필요한 만큼 노드를 추가하므로 overflow 없음.
- 메모리를 딱 필요한 만큼만 사용.
- Non-contiguous 메모리 → 상대적으로 캐시 비친화적.

```
CircularQueue (Capacity=5):
  [ A, B, C, _, _ ]  ← 2칸 낭비
  모듈러로 인덱스 순환: (rear + 1) % capacity

LinkedListQueue:
  [A] → [B] → [C] → null
  C 다음에 D 추가: [A] → [B] → [C] → [D] → null  ← 크기 동적 증가
```

공통점: enqueue, dequeue 모두 O(1).

---

## 종합

CircularQueue는 크기가 고정되고 캐시 효율이 좋아 임베디드, 실시간 시스템처럼 메모리를 미리 할당해야 하는 환경에 적합하다. LinkedListQueue는 유연하지만 포인터 저장 오버헤드와 캐시 미스가 있어 처리 속도가 약간 더 느릴 수 있다. JS에서 Queue를 구현할 때 배열을 그대로 쓰면 `shift()`가 O(n)이므로, 인덱스 포인터를 직접 관리하거나(CircularQueue 방식) 이중 연결 리스트로 구현(LinkedListQueue 방식)하는 것이 맞다.
