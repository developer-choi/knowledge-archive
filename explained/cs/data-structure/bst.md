# BST에서 임의의 노드를 골랐을 때, 왼쪽 서브트리와 오른쪽 서브트리의 값은 어떤 관계인가?

## 도입

Binary Search Tree(BST)는 일반 Binary Tree에 "정렬 규칙"을 추가한 자료구조다. 어느 노드를 기준으로 잡더라도 왼쪽은 작고 오른쪽은 크다는 규칙이 재귀적으로 성립한다. 이 규칙 하나가 탐색·삽입·삭제를 체계적으로 가능하게 한다.

---

## 본문

> - **Ordering Property**: For every node in the BST, all values in the left subtree are smaller, and all values in the right subtree are larger than the node's value. This rule holds recursively for all subtrees.

"Ordering Property: BST의 모든 노드에서 왼쪽 서브트리의 모든 값은 더 작고, 오른쪽 서브트리의 모든 값은 더 크다. 이 규칙은 모든 서브트리에 재귀적으로 성립한다."

- **all values**: 단순히 직접 연결된 자식뿐 아니라, 서브트리 전체의 모든 값에 대해 성립한다. 노드 하나가 아니라 구간이다.
- **recursively for all subtrees**: 어느 노드를 루트로 잡아도 그 서브트리가 다시 BST 조건을 만족한다.

> - **Recursive Nature**: Each left or right subtree of a node in a BST is itself a BST, allowing recursive algorithms to naturally process the tree.

"재귀적 성질: BST에서 어떤 노드의 왼쪽 또는 오른쪽 서브트리 각각은 그 자체로 BST다. 이것이 재귀 알고리즘이 트리를 자연스럽게 처리할 수 있게 한다."

```
BST 예시:
         8
        / \
       3   10
      / \    \
     1   6    14
        / \   /
       4   7  13

노드 8 기준: 왼쪽 {1,3,4,6,7} < 8, 오른쪽 {10,13,14} > 8 ✓
노드 3 기준: 왼쪽 {1} < 3, 오른쪽 {4,6,7} > 3 ✓
```

---

## 종합

Ordering Property는 BST에서 이진 탐색(Binary Search)을 가능하게 하는 핵심 조건이다. 어떤 값을 찾을 때, 현재 노드와 비교해 왼쪽 또는 오른쪽 서브트리 중 하나만 탐색하면 된다 — 매 단계에서 탐색 범위가 절반씩 줄어든다. 재귀적 성질 덕분에 탐색·삽입·삭제 알고리즘을 모두 같은 패턴의 재귀 함수로 구현할 수 있다.

---

# BST에 중복 값을 삽입할 수 있는가?

## 도입

BST의 기본 정의는 중복 값을 허용하지 않는다. 그러나 실제 구현에서는 중복을 처리하는 방법이 다양하며, 어떤 전략을 택할지는 구현자의 선택이다.

---

## 본문

> There must be no duplicate nodes (BST may have duplicate values with different handling approaches).

"중복 노드가 없어야 한다 (BST는 다양한 처리 방식으로 중복 값을 가질 수 있다)."

OA의 두 문장이 얼핏 모순처럼 보이지만, 핵심은 다음과 같다:
- **기본 BST 정의**: 중복 없음.
- **확장 구현**: 중복을 허용하되, 일관된 규칙 하나를 선택해서 처리한다.
  - 예: 중복은 항상 오른쪽 서브트리에 넣는다.
  - 예: 각 노드가 카운터를 가져 같은 값이 몇 번 삽입됐는지 기록한다.
  - 예: 중복을 그냥 무시한다 (Set 구현 시).

```
중복 허용 BST (중복을 오른쪽에 배치 규칙):
     5
    / \
   3   5   ← 중복 5를 오른쪽에 배치
  / \   \
 1   4    6
```

---

## 종합

알고리즘 문제에서는 대부분 중복 없는 기본 BST를 가정한다. 실무에서 중복을 허용해야 한다면 MultiSet 같은 변형을 쓰거나, 값 대신 (값, 삽입시간) 쌍을 키로 써서 유일성을 유지한다. 중복 처리 전략을 명확히 정하지 않으면 BST의 Ordering Property가 불분명해져 탐색 알고리즘이 올바르게 동작하지 않을 수 있다.

---

# BST의 장점은?

## 도입

BST는 탐색·삽입·삭제뿐 아니라 정렬 순회, 바닥값·천장값 찾기까지 지원한다. Self-Balancing BST를 쓰면 이 모든 연산이 O(log n)으로 보장된다.

---

## 본문

> A BST supports operations like search, insert, delete, maximum, minimum, floor, ceil, greater, smaller, etc in O(h) time where h is height of the BST.

"BST는 탐색, 삽입, 삭제, 최댓값, 최솟값, floor, ceil, 더 큰 값, 더 작은 값 등의 연산을 BST의 높이 h에 해당하는 O(h) 시간에 지원한다."

- **O(h)**: 연산 시간이 트리 높이에 비례한다. 균형 BST라면 h = O(log n), 불균형이면 최악 h = O(n).

> To keep height less, self balancing BSTs are used in practice. These Self-Balancing BSTs maintain the height as O(Log n). Therefore all of the above mentioned operations become O(Log n).

"높이를 낮게 유지하기 위해 실무에서는 Self-Balancing BST를 사용한다. 이 BST들은 높이를 O(log n)으로 유지한다. 따라서 위의 모든 연산이 O(log n)이 된다."

> Together with these, BST also allows sorted order traversal of data in O(n) time.

"이 외에도 BST는 O(n) 시간에 데이터를 정렬된 순서로 순회할 수 있다."

In-Order 순회(왼쪽 → 노드 → 오른쪽)하면 자동으로 오름차순 출력이 된다.

Floor/Ceil 개념:
- **Floor(바닥)**: 데이터 집합에서 x보다 작거나 같은 수 중 가장 큰 값.
  - 예: {2,5,8,12,16,23}에서 13의 Floor = 12.
- **Ceil(천장)**: 데이터 집합에서 x보다 크거나 같은 수 중 가장 작은 값.
  - 예: {2,5,8,12,16,23}에서 13의 Ceil = 16.

```
지원 연산 요약:
  search(5)  → O(log n)   값 탐색
  insert(9)  → O(log n)   값 삽입
  delete(3)  → O(log n)   값 삭제
  min()      → O(log n)   가장 왼쪽 노드
  max()      → O(log n)   가장 오른쪽 노드
  floor(7)   → O(log n)   7 이하 최댓값
  ceil(7)    → O(log n)   7 이상 최솟값
  inorder()  → O(n)       정렬된 전체 순회
```

---

## 종합

BST의 강점은 탐색·삽입·삭제만이 아니라 "정렬 상태를 유지하면서 다양한 쿼리를 O(log n)에 처리"할 수 있다는 점이다. 단순 삽입·삭제·탐색만 필요하다면 Hash Table(평균 O(1))이 낫지만, Floor/Ceil 같은 범위 쿼리나 정렬 순회가 필요하다면 BST가 Hash Table보다 적합하다.

---

# BST가 Array보다 정렬된 데이터 관리에 유리한 이유는?

## 도입

배열도 정렬해두면 이진 탐색으로 O(log n) 검색이 가능하다. 그럼 BST가 왜 필요한가? 핵심은 "데이터가 계속 추가되고 삭제되는 동적인 상황"에서다.

---

## 본문

> A Self-Balancing Binary Search Tree is used to maintain sorted stream of data.

"Self-Balancing BST는 정렬된 데이터 스트림을 유지하는 데 사용된다."

- **maintain**: 단순히 "저장하고 있다(store)"가 아니라, 새 데이터가 계속 들어오고 기존 데이터가 삭제되는 상황에서도 정렬된 상태를 꾸준히 지킨다는 동적인 의미다.

> For example, suppose we are getting online orders placed and we want to maintain the live data in sorted order of prices.

"예를 들어, 온라인 주문이 들어오고 있고 실시간으로 가격순 정렬 상태를 유지하고 싶다고 가정하자."

핵심 비교:

배열은 정렬 후 순회는 O(n)으로 빠르지만, 새 데이터 삽입·삭제 시 정렬 상태 유지 비용이 O(n)이다. Self-Balancing BST는 삽입·삭제가 O(log n)이고, In-Order 순회로 O(n)에 정렬 출력이 가능하다.

```
온라인 주문 실시간 처리:

정렬된 배열 방식:
  새 주문 삽입 → 올바른 위치 찾기 O(log n) + 뒤 원소 밀기 O(n) → O(n)

Self-Balancing BST 방식:
  새 주문 삽입 → O(log n)
  가격 x 이하 주문 수 → floor 연산으로 O(log n)
  정렬 출력 → In-Order O(n)
```

---

## 종합

"정렬된 배열 + 이진 탐색"은 데이터가 정적일 때만 빛난다. 데이터가 동적으로 변한다면 삽입·삭제마다 O(n) 비용이 발생해 이점이 사라진다. Self-Balancing BST는 동적 데이터 환경에서 "정렬 상태 유지 + 범위 쿼리"를 모두 O(log n)에 처리하는 유일한 자료구조다. 리더보드, 경매 시스템, 거래 가격 추적처럼 실시간으로 데이터가 변하는 시나리오에서 배열보다 BST가 적합한 이유다.

---

# BST vs Hash Table 비교는?

## 도입

"BST를 쓸까, Hash Table을 쓸까"는 자주 마주치는 선택이다. 결론은 "어떤 연산이 필요한가"에 달려 있다.

---

## 본문

> Search, insert and delete are faster than array and linked list and slower than hashing, but hashing does not allow sorted traversal, floor and ceil operations.

"탐색, 삽입, 삭제는 배열·Linked List보다 빠르고 해싱보다 느리다. 하지만 해싱은 정렬 순회, floor·ceil 연산을 허용하지 않는다."

> When we need only search, insert and delete and do not need other operations, we prefer Hash Table over BST as a Hash Table supports these operations in O(1) time on average.

"탐색, 삽입, 삭제만 필요하고 다른 연산이 필요 없다면, Hash Table이 이 연산들을 평균 O(1)에 지원하므로 BST보다 Hash Table을 선호한다."

BST가 Hash Table보다 유리한 연산들:
1. **정렬된 순회**: In-Order로 전체를 정렬 순서로 가져오는 것 → Hash Table은 불가능.
2. **최댓값/최솟값**: BST에서 가장 오른쪽/왼쪽 끝 → O(log n). Hash Table은 O(n) 탐색 필요.
3. **범위 검색**: "100 이상 500 이하" → BST에서 자연스러운 순회. Hash Table은 O(n).
4. **순서 통계량**: k번째 작은/큰 원소, Successor/Predecessor → BST O(log n), Hash Table O(n).

```
연산별 비교:
                      Hash Table   BST (Self-Balancing)
search/insert/delete  O(1) avg     O(log n)
정렬 순회              불가능         O(n)
최솟값/최댓값           O(n)          O(log n)
범위 검색              O(n)          O(log n)
floor/ceil            불가능         O(log n)
```

---

## 종합

Hash Table은 "키로 값을 빠르게 꺼내는" 단일 목적에서 BST를 압도한다. BST는 "정렬된 상태에서 다양한 범위 쿼리"가 필요할 때 Hash Table을 압도한다. JS에서 `Map`/`Set`(Hash Table)과 정렬된 배열+이진탐색을 쓸지, 커스텀 BST를 직접 구현할지 판단할 때 이 기준표가 출발점이 된다. 실무에서 대부분의 단순 키-값 저장·조회는 `Map`으로 충분하고, 정렬 기반 쿼리가 필요할 때 BST 계열 자료구조를 고려한다.

---

# [UNVERIFIED] BST가 불균형하면 어떤 일이 발생하는가?

## 도입

BST의 O(log n) 성능은 트리가 균형 잡혀 있을 때만 보장된다. 균형이 깨지면 최악의 경우 Linked List와 동일한 O(n) 성능으로 퇴보한다.

---

## 본문

세 가지 영향을 해설한다:

**1. 탐색 복잡도: O(log n) → O(n)**

BST는 각 단계에서 탐색 범위를 절반으로 줄인다 (왼쪽 또는 오른쪽만 탐색). 균형이 깨져 한 방향으로만 길어지면 절반 축소가 일어나지 않아 처음부터 끝까지 순서대로 따라가야 한다 → Linked List와 동일한 O(n).

**2. 보조 공간(Auxiliary Space): O(n)**

재귀로 BST를 탐색할 때 콜 스택이 트리 높이만큼 쌓인다. 균형 BST라면 O(log n)의 스택, 불균형이면 O(n)의 스택이 쌓인다.

**3. 삽입·삭제도 O(log n) → O(n)**

삽입·삭제 전에 올바른 위치를 찾는 탐색이 선행된다. 이 탐색이 O(n)이면 삽입·삭제도 O(n)이 된다.

```
균형 BST:                  불균형 BST (skewed right):
       5                    1
      / \                    \
     3   7                    2
    / \ / \                    \
   2  4 6  8                    3
                                 \
                                  4
                                   \
                                    5
탐색 O(log n)              탐색 O(n) = Linked List
```

BST는 조건(왼쪽 < 부모 < 오른쪽)만 만족하면 되고 균형은 보장되지 않는다. 1, 2, 3, 4, 5를 순서대로 삽입해도 BST 조건은 만족하지만 완전히 skewed tree가 된다. 이 문제를 해결하기 위해 AVL Tree, Red-Black Tree 같은 Self-Balancing BST가 고안되었다.

---

## 종합

불균형 BST의 핵심 위험은 "O(log n)을 기대하고 쓰다가 O(n)을 맞는 것"이다. 입력 순서가 정렬되어 있거나 반정렬되어 있으면 BST가 자동으로 skewed 구조가 된다. 실무에서 BST를 직접 구현한다면 Self-Balancing 메커니즘을 함께 구현해야 한다 — 아니면 처음부터 언어에서 제공하는 Self-Balancing 구현체(Java `TreeMap`, C++ `std::map`)를 사용하는 것이 안전하다.
