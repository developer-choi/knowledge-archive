# Binary Tree란 무엇인가?

## 도입

Tree는 노드가 여러 자식을 가질 수 있는 일반적인 자료구조다. Binary Tree는 "자식이 최대 2개"라는 제약을 추가한 특수한 Tree다. 이 제약 덕분에 수학적 성질이 명확해지고, 배열로도 표현할 수 있게 된다.

---

## 본문

> In a binary tree, each node can have a maximum of two children linked to it.

"이진 트리에서 각 노드는 최대 두 개의 자식을 가질 수 있다."

- **maximum of two children**: 0개, 1개, 2개 — 이 세 가지만 허용된다. 3개 이상은 Binary Tree가 아니다.
- 두 자식은 관례적으로 **왼쪽 자식(left child)**과 **오른쪽 자식(right child)**으로 구분한다.

```
Binary Tree 예시:
         1
        / \
       2   3
      / \
     4   5

- 노드 1: 자식 2개 (2, 3)
- 노드 2: 자식 2개 (4, 5)
- 노드 3: 자식 0개 (리프)
- 노드 4: 자식 0개 (리프)
- 노드 5: 자식 0개 (리프)
```

---

## 종합

"최대 2개"라는 제약이 Binary Tree의 모든 수학적 성질의 출발점이다. 높이 h인 레벨에 최대 노드 수, 전체 노드의 최대 수, 최소 높이 등이 모두 이 2라는 수에서 2의 거듭제곱으로 이어진다. BST, Heap, AVL Tree, Red-Black Tree 모두 Binary Tree를 기반으로 한다.

---

---

# 높이 h인 Binary Tree의 레벨 h에 최대 몇 개 노드가 존재할 수 있는가?

## 도입

Binary Tree는 각 노드가 최대 2개의 자식을 가지므로, 레벨이 내려갈수록 노드 수가 2배씩 늘어날 수 있다. 루트가 레벨 0이라면, 레벨 h에는 최대 2^h개의 노드가 존재한다.

---

## 본문

> A binary tree can have at most 2^h nodes at level h.

"이진 트리는 레벨 h에 최대 2^h개의 노드를 가질 수 있다."

```
레벨 0 (루트):   최대 2^0 = 1개
레벨 1:          최대 2^1 = 2개
레벨 2:          최대 2^2 = 4개
레벨 3:          최대 2^3 = 8개

      ○           레벨 0: 1개
     / \
    ○   ○          레벨 1: 2개
   /\ /\
  ○ ○ ○ ○         레벨 2: 4개
```

---

## 종합

레벨 h의 최대 노드 수가 2^h인 이유는 각 노드가 최대 2개의 자식을 가지기 때문이다 — 레벨 내려갈수록 이전 레벨 노드 수의 최대 2배가 된다. 이 기하급수적 증가가 Binary Tree에서 O(log n) 탐색이 가능한 수학적 근거다.

---

---

# 높이 h인 Binary Tree가 가질 수 있는 최대 노드 수는?

## 도입

높이 h인 Binary Tree의 전체 노드 최대 수는, 레벨 0부터 h까지 각 레벨의 최대 노드 수를 합친 값이다 — 등비급수 합 공식으로 계산한다.

---

## 본문

> A binary tree of height h can have at most 2^(h+1) - 1 nodes.

"높이 h인 이진 트리는 최대 2^(h+1) - 1개의 노드를 가질 수 있다."

계산 근거:
```
레벨 0: 2^0 = 1
레벨 1: 2^1 = 2
레벨 2: 2^2 = 4
...
레벨 h: 2^h

합계 = 2^0 + 2^1 + ... + 2^h = 2^(h+1) - 1
```

예: 높이 3인 Binary Tree의 최대 노드 수 = 2^4 - 1 = 15개.

---

## 종합

2^(h+1) - 1은 모든 레벨이 꽉 찬 경우(Perfect Binary Tree)의 노드 수다. 높이 h가 1 증가할 때마다 수용 가능한 최대 노드 수가 거의 두 배가 된다 — 이것이 Binary Tree 기반 자료구조가 O(log n) 탐색을 보장하는 이유다. 역으로, n개의 노드를 담으려면 최소 높이가 O(log n)이 된다.

---

---

# N개 노드를 가진 Binary Tree의 최소 높이는?

## 도입

N개의 노드를 Binary Tree에 담을 때, 높이를 최소화하려면 모든 레벨을 최대한 채워야 한다. 이때 최소 높이는 ⌈log₂N⌉이다.

---

## 본문

> The minimum possible height for N nodes is ⌈log₂N⌉.

"N개 노드에서 가능한 최소 높이는 ⌈log₂N⌉이다."

- **⌈ ⌉ (올림, ceiling)**: log₂N이 정수가 아니면 올림한다.

예:
```
N = 7: ⌈log₂7⌉ = ⌈2.807⌉ = 3
→ 높이 3이면 최대 2^4 - 1 = 15개 수용 가능 → 7개 담기 충분

N = 8: ⌈log₂8⌉ = ⌈3⌉ = 3
→ 높이 3이면 최대 15개 수용 가능 → 8개 담기 충분
```

---

## 종합

최소 높이가 ⌈log₂N⌉이라는 것은 균형 잡힌 Binary Tree의 탐색이 O(log n)인 이유다. N개 노드를 담는 최소 높이 = 탐색 시 최악 비교 횟수 = O(log n). BST가 불균형해지면 높이가 O(n)으로 늘어나고 탐색도 O(n)이 된다 — 자가 균형 BST(AVL, Red-Black Tree)가 항상 O(log n) 높이를 유지하는 이유가 이것이다.

---

---

# L개의 리프 노드를 가진 Binary Tree의 최소 레벨 수는?

## 도입

리프 노드는 트리의 "끝점"이다. Binary Tree에서 레벨이 깊어질수록 더 많은 리프 노드를 수용할 수 있다. L개의 리프 노드를 담으려면 최소 ⌈log₂L⌉ 레벨이 필요하다.

---

## 본문

> A binary tree with L leaves must have at least ⌈log₂L⌉ levels.

"L개의 리프 노드를 가진 이진 트리는 최소 ⌈log₂L⌉ 레벨을 가져야 한다."

이 공식의 직관: 레벨 k에 최대 2^k개의 리프 노드가 있을 수 있다. L개의 리프를 수용하려면 2^k ≥ L를 만족하는 최소 k가 필요하다 → k ≥ log₂L → k_min = ⌈log₂L⌉.

```
L = 4: ⌈log₂4⌉ = 2 → 최소 2레벨 필요 (레벨 2에 최대 4개 리프 수용)
L = 5: ⌈log₂5⌉ = 3 → 최소 3레벨 필요 (레벨 2에 4개뿐 → 5개는 레벨 3 필요)
```

---

## 종합

이 공식은 Huffman 트리처럼 리프 노드 수가 설계 기준이 되는 자료구조를 이해할 때 유용하다. "L개의 서로 다른 문자를 인코딩하려면 최소 ⌈log₂L⌉비트가 필요하다"는 정보 이론의 기초도 같은 수식에서 나온다.

---

---

# N개 노드를 가진 Binary Tree의 총 간선(edge) 수는?

## 도입

Tree에서 간선(edge)은 부모와 자식을 연결하는 선이다. 루트를 제외한 모든 노드는 정확히 하나의 부모를 가지므로, 간선 수는 항상 노드 수 - 1이다.

---

## 본문

> In any non-empty binary tree with n nodes, the total number of edges is n - 1.

"비어 있지 않은 n개 노드의 이진 트리에서 간선의 총 수는 n - 1이다."

직관적 이유: 루트는 부모가 없으므로 간선이 없다. 나머지 n-1개 노드는 각자 정확히 하나의 부모를 향하는 간선을 가진다.

```
노드: 1, 2, 3, 4, 5 (n=5)

      1
     / \
    2   3
   / \
  4   5

간선: 1-2, 1-3, 2-4, 2-5 → 총 4개 = n - 1 = 5 - 1
```

---

## 종합

간선 수 = n - 1은 Binary Tree뿐 아니라 모든 Tree(방향 없는 연결 그래프에서 사이클 없음)에 공통으로 성립하는 성질이다. 알고리즘 문제에서 "n개 도시를 n-1개 도로로 연결하라"는 조건이 곧 Tree 구조를 요구하는 것이다 (최소 신장 트리 등).

---

---

# Self-Balancing BST의 활용은?

## 도입

일반 BST는 불균형해지면 O(n)으로 퇴보한다. Self-Balancing BST는 삽입·삭제 후 자동으로 균형을 맞춰 O(log n)을 유지한다. 이 자료구조가 유용한 실제 사례 중 하나가 "양방향 우선순위 큐"다.

---

## 본문

> A Self-Balancing Binary Search Tree is used to implement doubly ended priority queue.

"Self-Balancing BST는 양방향 우선순위 큐를 구현하는 데 사용된다."

> With a Binary Heap, we can either implement a priority queue with support of extractMin() or with extractMax(). If we wish to support both the operations, we use a Self-Balancing Binary Search Tree to do both in O(Log n).

"Binary Heap으로는 extractMin() 또는 extractMax() 중 하나만 지원하는 우선순위 큐를 구현할 수 있다. 두 연산 모두를 지원하려면 Self-Balancing BST를 사용해 두 연산을 O(log n)에 처리한다."

- **doubly ended priority queue**: 최솟값과 최댓값 모두를 효율적으로 추출할 수 있는 자료구조.
- **extractMin() or extractMax()**: Min Heap은 최솟값 추출만, Max Heap은 최댓값 추출만 O(log n)으로 지원한다. 두 기능을 동시에 하려면 Heap 두 개를 유지하거나 Self-Balancing BST를 사용한다.

```
Min Heap: extractMin() → O(log n)  /  extractMax() → O(n) (탐색 필요)
Max Heap: extractMax() → O(log n)  /  extractMin() → O(n) (탐색 필요)

Self-Balancing BST (AVL, Red-Black Tree):
  - 가장 작은 값 = 가장 왼쪽 노드 → O(log n)
  - 가장 큰 값   = 가장 오른쪽 노드 → O(log n)
  두 연산 모두 O(log n) 보장
```

---

## 종합

Self-Balancing BST는 Heap보다 기능이 풍부한 대신 구현이 복잡하다. Heap은 최솟값 또는 최댓값 하나만 필요할 때 더 단순하고 효율적이다. 중앙값 유지 문제(Min Heap + Max Heap 조합)처럼 특수한 경우를 제외하면, 양방향 추출이 필요할 때는 Self-Balancing BST가 깔끔한 선택이다.

---

---

# Complete Binary Tree와 Perfect Binary Tree의 차이는?

## 도입

Binary Tree 종류 중 Complete와 Perfect는 이름이 헷갈린다. 핵심 차이는 "마지막 레벨이 꽉 찼는가"다.

---

## 본문

> - **Complete Binary Tree**: A special type of binary tree where all the levels of the tree are filled completely except the lowest level nodes which are filled from as left as possible.

"Complete Binary Tree: 마지막 레벨을 제외한 모든 레벨이 완전히 채워져 있고, 마지막 레벨 노드는 최대한 왼쪽부터 채워지는 특수한 이진 트리."

> - **Perfect Binary Tree**: All levels are completely filled. The number of leaf nodes equals the number of internal nodes plus one.

"Perfect Binary Tree: 모든 레벨이 완전히 채워진다. 리프 노드 수 = 내부 노드 수 + 1."

User Annotation이 짚듯:
- 마지막 레벨 제외하고 다 채워져 있으면 → Complete Binary Tree
- 마지막 레벨까지 다 채워져 있으면 → Perfect Binary Tree
- Complete에서 마지막 레벨 노드가 왼쪽부터 채워져 있지 않으면 → 해당 안 됨

```
Complete Binary Tree:
       1
      / \
     2   3
    / \  /
   4   5 6        ← 마지막 레벨, 왼쪽부터 채움 (7번 자리 없어도 OK)

Perfect Binary Tree:
       1
      / \
     2   3
    / \ / \
   4  5 6  7      ← 마지막 레벨까지 모두 꽉 참

NOT Complete (왼쪽부터 아님):
       1
      / \
     2   3
      \  /
       5  6       ← 2의 왼쪽 자식 없음 → Complete 조건 위반
```

---

## 종합

Complete Binary Tree는 Heap의 기반 구조다 — 배열로 빈틈 없이 표현할 수 있고, 부모/자식 인덱스를 공식으로 계산할 수 있다. Perfect Binary Tree는 Complete의 특수 케이스이고, 수학적 분석에서 이상적인 상태를 가정할 때 쓰인다. "왼쪽부터 채운다"는 조건이 Complete의 핵심이며, 이것이 깨지면 배열 표현의 인덱스 공식이 더 이상 성립하지 않는다.

---

---

# Full Binary Tree란 무엇인가?

## 도입

Full Binary Tree는 "중간에 어중간하게 자식이 1개인 노드가 없다"는 조건의 트리다. 각 노드는 자식이 정확히 0개(리프)이거나 2개여야 한다.

---

## 본문

> A binary tree where every node has either 0 or 2 children.

"모든 노드가 자식이 0개 또는 2개인 이진 트리."

User Annotation이 짚듯, 자식이 1개인 노드가 없으면 된다. 상위 레벨에서 자식이 없는 노드(리프 노드)가 있는 경우도 Full Binary Tree 조건을 만족한다.

```
Full Binary Tree:
       1
      / \
     2   3       ← 2개 자식
    / \
   4   5         ← 리프: 자식 0개

Full Binary Tree (리프가 중간에 있어도 OK):
       1
      / \
     2   3       ← 3은 자식 0개(리프), 2는 자식 2개
    / \
   4   5

Not Full:
       1
      / \
     2   3
    /             ← 2가 자식 1개 → Full 조건 위반
   4
```

---

## 종합

Full Binary Tree는 특정 수학적 성질 — 리프 노드 수 = 내부 노드 수 + 1 — 을 보장한다. 수식 트리(expression tree)가 Full Binary Tree의 전형적인 예시다 — 연산자는 자식 2개(피연산자), 피연산자는 리프(자식 0개)로 항상 Full 구조를 이룬다.

---

---

# Degenerate(Pathological) Binary Tree란 무엇이며, 왜 비효율적인가?

## 도입

Binary Tree가 최악의 형태로 편향되면 사실상 Linked List와 다름없어진다. 이 상태를 Degenerate(퇴화된) 또는 Pathological(병리적) Binary Tree라고 한다.

---

## 본문

> A tree in which each parent node has only one child. This essentially forms a linked list, which leads to inefficient operations.

"각 부모 노드가 자식이 하나뿐인 트리. 이것은 본질적으로 연결 리스트를 형성하며, 비효율적인 연산으로 이어진다."

- **only one child**: 모든 노드가 자식이 1개뿐이면 트리가 옆으로 퍼지지 않고 한 방향으로 길게 늘어진다.
- **essentially forms a linked list**: 구조가 Linked List와 동일해진다. 탐색 시 head부터 순서대로 따라가야 한다.

```
일반 BST:           Degenerate BST (Right-Skewed):
       5                 1
      / \                 \
     3   7                 2
    / \ / \                 \
   2  4 6  8                 3
                              \
                               4
                                \
                                 5
   탐색: O(log n)          탐색: O(n)
```

BST에 1, 2, 3, 4, 5를 순서대로 삽입하면 자동으로 Right-Skewed Degenerate Tree가 된다 — 각 노드가 이전 노드보다 크므로 항상 오른쪽 자식이 된다.

---

## 종합

Degenerate Tree는 BST가 "순서대로 삽입"될 때 가장 쉽게 발생한다. 이 문제를 막기 위해 AVL Tree, Red-Black Tree 같은 Self-Balancing BST가 고안되었다. 삽입·삭제 후 자동으로 회전(rotation)을 수행해 항상 O(log n) 높이를 유지한다.

---

---

# Balanced Binary Tree란 무엇이며, 대표적인 예시는?

## 도입

Binary Tree의 성능은 높이에 직결된다. 탐색이 O(log n)으로 보장되려면 높이가 O(log n)이어야 한다. Balanced Binary Tree는 이 높이 조건을 구조적으로 강제하는 트리다.

---

## 본문

> A binary tree where the difference in heights between the left and right subtrees of any node is minimal (often defined as at most 1). Examples: AVL Tree, Red Black Tree, Splay Tree.

"어떤 노드에서도 왼쪽과 오른쪽 서브트리의 높이 차이가 최소(보통 최대 1)인 이진 트리. 예시: AVL Tree, Red-Black Tree, Splay Tree."

- **difference in heights**: 높이 차이가 크면 한쪽이 길어져 Degenerate에 가까워진다. "최대 1"로 제한하면 높이가 O(log n)으로 보장된다.
- **AVL Tree**: 모든 노드에서 왼쪽-오른쪽 서브트리 높이 차가 1 이하. 가장 엄격한 균형 조건 → 탐색 빠름, 삽입/삭제 회전 비용 높음.
- **Red-Black Tree**: 느슨한 균형 (높이 차 최대 2배 허용). 삽입/삭제 회전 횟수가 적어 실무에서 더 많이 쓰인다. JS V8의 `Map`, Java의 `TreeMap`이 Red-Black Tree 기반.
- **Splay Tree**: 최근 접근한 노드를 루트로 올리는 방식. 캐시 지역성을 활용한 자가 조정 트리.

```
Balanced (AVL):
       4
      / \
     2   6
    / \ / \
   1  3 5  7   ← 모든 서브트리 높이 차 ≤ 1

Unbalanced:
       4
      /
     2
    /
   1            ← 왼쪽 높이 2, 오른쪽 높이 0 → 차이 2
```

---

## 종합

Balanced Binary Tree는 "최악의 경우도 O(log n)"을 보장하는 구조적 장치다. 일반 BST에서 O(log n)은 평균이고 최악은 O(n)이지만, Self-Balancing BST는 삽입·삭제 후 회전으로 균형을 복원해 항상 O(log n)을 유지한다. 실무에서 가장 많이 만나는 건 Red-Black Tree다 — JS `Map`, Java `TreeMap`, C++ `std::map` 모두 내부적으로 Red-Black Tree를 사용한다.

---

---

# [UNVERIFIED] Tree를 구현/표현하는 2가지 방법은?

## 도입

Tree를 코드로 구현할 때는 두 가지 방식이 있다 — 노드 객체를 포인터(참조)로 연결하는 Linked List 방식과, 인덱스 공식을 활용하는 배열 방식. 각각 장단점이 있고 적합한 Tree 유형도 다르다.

---

## 본문

**Linked List 방식 (노드 + 포인터)**

장점:
- 모든 종류의 Tree를 표현 가능 (자식 수가 가변인 경우 포함).

단점:
- 각 노드에 데이터와 포인터(참조)를 함께 저장해야 해서 메모리가 증가한다.
- 탐색이 균형 정도에 따라 O(log n) ~ O(n)이다.

```js
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;   // 포인터
    this.right = null;  // 포인터
  }
}
```

**배열 방식 (인덱스 공식)**

장점:
- 연속 메모리 → 캐시 친화적.
- Complete Binary Tree에 한해, 포인터를 저장하지 않아 Linked List보다 메모리를 덜 사용.

단점:
- 최대 자식 노드 수가 고정되어야 배열로 표현 가능 (Binary Tree처럼).
- 불균형하거나 성기게 채워진 경우 낭비 공간이 많아진다.
- 삽입·삭제가 최악 O(n), 하지만 접근은 O(1).

User Annotation이 짚은 인덱스 공식 (0-based index):
```
부모:       parent(i) = (i - 1) / 2
왼쪽 자식:  left(i)   = 2 * i + 1
오른쪽 자식: right(i)  = 2 * i + 2
```

```
배열:  [1, 2, 3, 4, 5, 6, 7]
인덱스: 0  1  2  3  4  5  6

      1(0)
     /      \
   2(1)    3(2)
   /  \    /  \
 4(3) 5(4) 6(5) 7(6)

left(1) = 2*1+1 = 3번 → 값 4  ✓
right(1) = 2*1+2 = 4번 → 값 5  ✓
parent(3) = (3-1)/2 = 1번 → 값 2  ✓
```

AI Annotation이 짚듯, 배열은 주로 Heap이나 Complete Binary Tree처럼 구조가 꽉 찬 트리에서 압도적으로 유리하다.

---

## 종합

일반적인 트리(구조가 동적으로 변하거나 예측 불가)는 Linked List 방식이 표준이다. 구조가 정형화된 Complete Binary Tree (특히 Heap)는 배열 방식이 캐시 효율과 메모리 절약 양쪽에서 유리하다. JS에서 Heap을 구현할 때 대부분 배열 하나로 구현하는 이유가 바로 이 인덱스 공식 덕분이다 — 노드 객체와 포인터 없이 배열 인덱스만으로 부모·자식 관계를 계산한다.
