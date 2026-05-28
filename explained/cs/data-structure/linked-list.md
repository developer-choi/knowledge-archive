# Linked List란 무엇인가?

## 도입

배열이 원소들을 연속된 메모리에 나란히 저장한다면, Linked List는 원소마다 "다음 원소가 어디 있는지"를 직접 기록해서 연결하는 구조다. 각 원소(노드)는 데이터와 다음 노드의 주소(포인터) 두 가지를 함께 갖는다.

---

## 본문

> Linked list is a linear data structure that stores data in nodes, which are connected by pointers.

"Linked List는 노드에 데이터를 저장하는 선형 자료구조이며, 노드들은 포인터로 연결된다."

- **nodes**: 배열의 원소에 해당하는 단위지만, 배열과 달리 각 노드는 자체 메모리 공간에 독립적으로 할당된다.
- **pointers**: 다음 노드의 메모리 주소를 담는 참조값. JS에서는 객체 참조(`next: nodeObj`)로 구현한다.

> Unlike arrays, nodes of linked lists are not stored in contiguous memory locations and can only be accessed sequentially, starting from the head of list.

"배열과 달리, Linked List의 노드들은 연속된 메모리 위치에 저장되지 않으며, 리스트의 head에서 시작해 순차적으로만 접근할 수 있다."

- **not stored in contiguous memory locations**: 노드들이 메모리 곳곳에 흩어져 있다. 그래서 O(1) 랜덤 접근이 불가능하다.
- **sequentially**: head → node1 → node2 → ... 순서대로 포인터를 따라가야 원하는 노드에 도달한다.
- **head**: Linked List의 유일한 진입점. head를 잃으면 전체 리스트에 접근할 방법이 없다.

```
head
 ↓
[data: 1 | next: →] → [data: 2 | next: →] → [data: 3 | next: null]

메모리 주소:
  노드1: 0x100    노드2: 0x4F0    노드3: 0x230   (흩어져 있음)
```

---

## 종합

Linked List는 "포인터가 연결을 담당한다"는 구조 덕분에 중간 삽입·삭제가 O(1)이다 — 포인터만 바꾸면 된다. 하지만 n번째 노드에 가려면 head부터 n번 포인터를 따라가야 하므로 접근은 O(n)이다. 배열과 정확히 트레이드오프가 반전된 구조다.

---

---

# Linked List와 Array의 차이는?

## 도입

Linked List와 Array는 둘 다 선형 자료구조지만 메모리 구조가 근본적으로 다르고, 그 차이에서 성능 특성이 갈린다.

---

## 본문

OA가 제시한 비교표:

| Feature | Linked List | Array |
|---|---|---|
| Data Structure | Non-contiguous | Contiguous |
| Memory Allocation | 원소별 개별 할당 | 전체에 한꺼번에 할당 |
| Insertion/Deletion | 효율적 | 비효율적 |
| Access | Sequential | Random |

- **Non-contiguous vs Contiguous**: Linked List는 노드들이 메모리 곳곳에 흩어져 있고, Array는 연속된 블록 하나를 점유한다. 이 차이가 아래 Access 행의 차이를 만든다.
- **Insertion/Deletion 효율**: Linked List는 포인터만 바꾸면 되므로 O(1). Array는 원소들을 이동시켜야 하므로 O(n).
- **Sequential vs Random Access**: Linked List는 head부터 따라가야 하므로 O(n). Array는 인덱스 계산 한 번으로 O(1).

```
Array:  [1][2][3][4][5]  ← 연속, arr[3] = O(1)

Linked: [1]→[2]→[3]→[4]→[5]  ← 흩어짐, 3번째 = head부터 3번 이동
```

---

## 종합

Array와 Linked List는 정확히 반대의 강점을 가진다. 읽기가 빈번하면 Array, 삽입·삭제가 빈번하면 Linked List가 유리하다. 실무에서 JS 배열(`Array`)은 동적 배열로 구현되어 push/pop은 O(1)이지만 unshift/splice는 O(n)이다 — Linked List의 삽입 장점을 JS 배열에서 그대로 기대하면 안 된다.

---

---

# Linked List의 종류는?

## 도입

Linked List는 포인터가 어느 방향으로 연결되느냐에 따라 세 종류로 나뉜다. 기준은 "한 방향만 가리키는가, 양방향을 가리키는가, 끝이 다시 처음으로 연결되는가"다.

---

## 본문

> **Doubly Linked List (DLL)**: Doubly linked lists allow for efficient traversal of the list in both directions, making it suitable for applications where frequent insertions and deletions are required.

"이중 연결 리스트는 양방향 순회를 효율적으로 허용하며, 잦은 삽입과 삭제가 필요한 애플리케이션에 적합하다."

- **both directions**: 각 노드가 `next`와 `prev` 포인터 두 개를 가진다. 앞으로도, 뒤로도 이동할 수 있다.
- **efficient traversal**: 브라우저 히스토리처럼 앞·뒤로 이동이 잦은 구조에 자연스럽게 맞는다.

> **Circular Linked List (CLL)**: We can traverse the list from any node and return to it without needing to restart from the head, which is useful in applications requiring a circular iteration.

"어느 노드에서도 순회를 시작해 head로 돌아올 필요 없이 그 노드로 되돌아올 수 있어, 순환 반복이 필요한 애플리케이션에 유용하다."

- **circular iteration**: 마지막 노드의 `next`가 `null`이 아니라 head를 가리킨다. 순환 큐, 라운드 로빈 스케줄링 등에서 쓰인다.

User Annotation이 짚듯, **Singly Linked List (SLL)**은 head 포인터 하나만 있고 노드도 한 방향(next)만 가리킨다. 가장 단순한 형태다.

```
SLL:  head → [1] → [2] → [3] → null

DLL:  head → [1] ⇄ [2] ⇄ [3] → null

CLL:  head → [1] → [2] → [3] ─┐
                 ↑              │
                 └──────────────┘
```

---

## 종합

세 종류는 메모리 사용량과 기능의 트레이드오프다. SLL은 포인터 1개로 가장 가볍지만 역방향 이동이 불가능하다. DLL은 포인터 2개로 메모리가 더 들지만 삽입·삭제가 더 유연하다. CLL은 순환 구조가 필요한 특수 상황에 쓰인다. JS에서 `Map` 은 내부적으로 삽입 순서를 유지하기 위해 이중 연결 리스트를 사용하는 것으로 알려져 있다.

---

---

# Doubly Linked List가 Singly Linked List 대비 삽입/삭제에서 유리한 점은?

## 도입

SLL에서 특정 노드를 삭제하려면 "그 노드 바로 앞 노드"의 next 포인터를 바꿔야 한다. 삭제할 노드의 주소만 알고 있으면 앞 노드를 찾기 위해 head부터 탐색해야 한다 — O(n)이다. DLL은 이 문제를 `prev` 포인터로 해결한다.

---

## 본문

> Easy insertion and deletion of nodes: The presence of pointers to both the previous and next nodes makes it easy to insert or delete nodes from the list, without having to traverse the entire list.

"노드의 삽입과 삭제가 쉽다: 이전 노드와 다음 노드 양쪽 포인터가 있으므로 전체 리스트를 순회하지 않고도 삽입·삭제가 가능하다."

- **pointers to both the previous and next nodes**: 각 노드가 `prev`와 `next` 두 포인터를 가진다. 삭제 시 `prev.next = node.next`, `node.next.prev = node.prev` 두 줄로 끝난다.
- **without having to traverse the entire list**: SLL은 앞 노드를 찾기 위해 O(n) 탐색이 필요하지만, DLL은 이미 `prev`를 알고 있으므로 O(1)에 처리한다.

User Annotation이 짚듯, 삭제해야 할 노드의 주소값을 알고 있을 경우 DLL은 O(1), SLL은 O(n)이다.

```
SLL에서 node2 삭제 (node2 주소만 알 때):
  head → [node1] → [node2] → [node3]
  node1을 찾으려면 head부터 탐색 → O(n)

DLL에서 node2 삭제 (node2 주소만 알 때):
  node2.prev = node1  (이미 알고 있음)
  node2.next = node3  (이미 알고 있음)
  node1.next = node3  ← O(1)
  node3.prev = node1  ← O(1)
```

---

## 종합

DLL의 O(1) 삽입·삭제는 "노드의 주소를 이미 알고 있을 때"만 성립한다. 특정 값을 가진 노드를 찾는 탐색 자체는 여전히 O(n)이다. 실무에서 DLL이 빛나는 경우는 LRU 캐시처럼 "최근 접근한 노드를 빠르게 앞으로 이동"해야 하는 구조다 — Hash Map으로 노드 주소를 O(1)에 찾고, DLL로 O(1)에 위치를 바꾼다. JS에서는 `Map`이 키로 노드를 빠르게 찾고 DLL로 순서를 유지하는 패턴이 LRU 구현의 표준이다.
