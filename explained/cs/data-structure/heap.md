# Heap이란 무엇인가?

## 도입

Heap은 완전 이진 트리(complete binary tree)이면서 "부모가 자식보다 항상 작거나(Min Heap) 크다(Max Heap)"는 조건을 만족하는 자료구조다. 이 조건 덕분에 루트에 항상 최솟값 또는 최댓값이 위치한다. 우선순위 큐(Priority Queue)를 구현할 때 쓰는 표준 자료구조다.

---

## 본문

> A Heap is a complete binary tree data structure that satisfies the heap property: for every node, the value of its children is greater than or equal to its own value. where the smallest (or largest) element is always at the root of the tree.

"Heap은 heap property를 만족하는 완전 이진 트리 자료구조다: 모든 노드에서 자식의 값이 자신의 값보다 크거나 같다. 트리의 루트에는 항상 가장 작은(또는 가장 큰) 원소가 위치한다."

- **complete binary tree**: 마지막 레벨을 제외한 모든 레벨이 완전히 채워져 있고, 마지막 레벨은 왼쪽부터 채워지는 이진 트리다. 이 구조 덕분에 배열로 효율적으로 표현할 수 있다.
- **heap property**: Min Heap에서는 부모 ≤ 자식, Max Heap에서는 부모 ≥ 자식이 모든 노드에서 성립한다.
- **smallest (or largest) element is always at the root**: 이것이 Heap을 우선순위 큐에 쓰는 이유다 — 가장 중요한 원소에 O(1) 접근이 가능하다.

```
Min Heap 예시:
        1          ← 루트 = 최솟값
      /   \
     3     2
    / \   / \
   7   5  4   6

배열 표현: [1, 3, 2, 7, 5, 4, 6]
인덱스:    [0, 1, 2, 3, 4, 5, 6]

부모(i): (i-1) / 2
왼쪽 자식: 2*i + 1
오른쪽 자식: 2*i + 2
```

User Annotation이 짚듯, 우선순위 큐를 만들 때 사용한다.

---

## 종합

Heap의 핵심 가치는 "최솟값 또는 최댓값을 O(1)에 조회하고, O(log n)에 삽입·삭제할 수 있다"는 점이다. 배열로 같은 기능을 구현하면 최솟값 조회가 O(n)이지만, Heap은 루트가 항상 답이라 O(1)이다. 삽입 후 heap property를 유지하는 과정(heapify)이 O(log n)인 것은 완전 이진 트리의 높이가 O(log n)이기 때문이다.

---

---

# [UNVERIFIED] Min Heap에서 원소가 정렬된 순서로 저장되어야 하는가?

## 도입

Heap은 정렬된 자료구조가 아니다. "부모가 자식보다 작거나 같다"는 조건만 만족하면 되고, 같은 레벨 사이의 순서는 정해져 있지 않다.

---

## 본문

`[1, 3, 2]`와 `[1, 2, 3]`은 둘 다 유효한 Min Heap이다.

```
[1, 3, 2]:
      1        ← 루트 = 최솟값 O
    /   \
   3     2     ← 부모(1) ≤ 자식(3, 2) O → Valid Min Heap

[1, 2, 3]:
      1        ← 루트 = 최솟값 O
    /   \
   2     3     ← 부모(1) ≤ 자식(2, 3) O → Valid Min Heap
```

두 경우 모두 heap property(부모 ≤ 자식)를 만족한다. 3과 2의 순서(왼쪽/오른쪽 자식)는 heap property와 무관하다.

Heap이 보장하는 것: 루트가 전체 최솟값이라는 것.
Heap이 보장하지 않는 것: 같은 레벨의 노드들 사이 순서.

---

## 종합

Heap은 "정렬 구조"가 아니라 "우선순위 구조"다. 전체를 정렬된 순서로 순회하려면 Heap Sort를 수행해야 하고, 이것은 O(n log n)이다. Heap의 강점은 "매번 삽입/삭제 후에도 최솟값(또는 최댓값)을 O(1)에 알 수 있다"는 점이지, 전체가 정렬되어 있다는 점이 아니다.

---

---

# Heap 자료구조의 장점은?

## 도입

Heap이 우선순위 큐의 표준 구현체로 쓰이는 이유는 세 가지 장점에서 온다 — 우선순위 기반 처리, 최솟값/최댓값 O(1) 조회, 삽입·삭제의 O(log n) 보장.

---

## 본문

> - **Priority-based**: Heaps allow elements to be processed based on priority.

"Priority-based: Heap은 우선순위에 따라 원소를 처리할 수 있다."

- **priority**: 도착 순서(FIFO)가 아니라 값의 크기(또는 임의 우선순위 기준)에 따라 처리 순서가 결정된다.

> - **Time Efficient**: The most important thing is, we can get the min or max in O(1) time.

"시간 효율적: 가장 중요한 점은 O(1)에 최솟값 또는 최댓값을 얻을 수 있다는 것이다."

루트가 항상 최솟값(Min Heap) 또는 최댓값(Max Heap)이므로, 조회는 `heap[0]` 하나의 접근으로 끝난다.

> - Heaps have an average time complexity of O(log n) for inserting and deleting elements.

"Heap은 원소 삽입과 삭제에 평균 O(log n)의 시간복잡도를 가진다."

- 삽입 후 heap property 복원(heapify up): 최악 트리 높이만큼 올라감 = O(log n).
- 루트 삭제 후 heap property 복원(heapify down): 최악 트리 높이만큼 내려감 = O(log n).

```
연산 비교:
              Array    Heap
최솟값 조회    O(n)     O(1)   ← Heap 압도적 우위
삽입          O(1)*    O(log n)
최솟값 삭제   O(n)     O(log n)

* 배열 끝에 추가하는 경우
```

User Annotation이 짚듯, k번째로 큰/작은 수를 구하는 문제에서 Heap이 유효하다 — Min Heap에서 k번 dequeue하면 k번째로 작은 수가 나온다. 배열로 같은 작업을 하면 매번 O(n) 탐색이 필요하다.

---

## 종합

Heap의 강점은 "최솟값/최댓값이 항상 루트에 있다"는 구조적 보장이다. 이 보장 덕분에 k번째로 작은 수 찾기, 중앙값 유지(Max Heap + Min Heap 조합), 다익스트라 알고리즘(최단 경로)처럼 "가장 우선순위 높은 것을 반복 추출"하는 패턴에서 핵심 도구가 된다. 배열 O(n) vs Heap O(log n)의 차이는 n이 커질수록 극적으로 벌어진다.
