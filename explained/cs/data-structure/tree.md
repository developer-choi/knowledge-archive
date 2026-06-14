# Tree 자료구조를 사용하는 이유는?

## 도입

배열이나 Linked List 같은 선형 자료구조는 데이터를 한 줄로 나열한다. 그런데 실제 세계의 많은 데이터는 "계층"을 이룬다 — 폴더 안에 파일이 있고, 파일 안에 내용이 있다. 이런 계층 구조를 자연스럽게 표현하기 위해 Tree를 쓴다.

---

## 본문

> One reason to use trees might be because you want to store information that naturally forms a hierarchy.

"트리를 사용하는 한 가지 이유는 자연적으로 계층을 형성하는 정보를 저장하고 싶기 때문이다."

- **hierarchy**: 부모-자식 관계가 재귀적으로 반복되는 구조. 루트가 하나 있고, 각 노드는 0개 이상의 자식을 가진다.
- **naturally forms**: 억지로 트리에 끼워 맞추는 것이 아니라, 데이터 자체가 이미 계층 구조를 가지고 있다는 의미다.

예시:
- **File System**: `/Users/alice/Documents/project/app.js` — 폴더 안에 폴더가 있는 계층 구조. DOM 트리를 생각해도 된다.
- **HTML**: `<html>` → `<body>` → `<div>` → `<p>` — 브라우저가 파싱하면 DOM 트리가 된다.

```
파일 시스템 Tree:
  /
  ├── Users/
  │   └── alice/
  │       └── Documents/
  │           └── app.js
  └── etc/

HTML DOM Tree:
  html
  ├── head
  │   └── title
  └── body
      ├── div
      │   └── p (텍스트)
      └── footer
```

---

## 종합

Tree가 필요한 이유는 계층 구조를 선형으로 표현하면 관계 정보가 손실되거나 코드가 복잡해지기 때문이다. 배열로 파일 시스템을 표현하려면 경로 문자열을 직접 파싱해야 하지만, Tree로 표현하면 "부모 노드로 이동", "자식 노드 목록 조회"가 자연스러운 연산이 된다. React의 Virtual DOM, Redux의 상태 트리, JSON 중첩 객체 모두 계층 구조를 Tree로 다루는 사례다.

---

# Tree의 DFS 순회 방법은?

## 도입

Tree를 순회하는 방법은 크게 두 가지다 — 한 가지를 끝까지 파고드는 DFS(Depth-First Search)와 레벨별로 처리하는 BFS(Breadth-First Search). DFS는 세 가지 순서로 나뉘며, 각각 다른 문제에 적합하다.

---

## 본문

> Explore one branch fully before backtracking.

"백트래킹하기 전에 한 가지를 완전히 탐색한다."

- **backtracking**: 막다른 곳(리프 노드)에 도달하면 부모 노드로 돌아가 다른 가지를 탐색하는 것.

세 가지 DFS 순서:

> - **In-Order (LNR)**: Left → Node → Right (retrieves BST elements in sorted order).

"In-Order: 왼쪽 → 노드 → 오른쪽 (BST 원소를 정렬된 순서로 가져온다)."

> - **Pre-Order (NLR)**: Node → Left → Right (used for tree reconstruction).

"Pre-Order: 노드 → 왼쪽 → 오른쪽 (트리 재건에 사용)."

> - **Post-Order (LRN)**: Left → Right → Node (helps in deleting or evaluating expressions).

"Post-Order: 왼쪽 → 오른쪽 → 노드 (삭제나 식 평가에 사용)."

```
예시 트리:
       A
      / \
     B   C
    / \
   D   E

In-Order  (LNR): D → B → E → A → C   (BST라면 정렬 순서)
Pre-Order (NLR): A → B → D → E → C   (루트가 먼저 = 복원에 유리)
Post-Order(LRN): D → E → B → C → A   (자식 처리 후 부모 = 삭제에 유리)
```

---

## 종합

세 DFS 순서는 노드를 "언제 처리하느냐"의 차이다. In-Order는 BST에서 정렬 출력이 필요할 때, Pre-Order는 트리를 직렬화(serialize)하거나 복원할 때, Post-Order는 하위 트리를 먼저 처리해야 하는 상황(디렉터리 삭제, 수식 트리 평가)에서 사용한다. 재귀 구현에서 `console.log(node.val)` 위치만 바꾸면 세 순서 모두 구현할 수 있다.

---

# Tree의 BFS 순회 방법은?

## 도입

BFS(Breadth-First Search)는 DFS와 달리 깊이를 파고들기 전에 현재 레벨의 모든 노드를 처리한다. Queue를 사용해 구현하며, 최단 경로 탐색이나 레벨별 처리에 적합하다.

---

## 본문

> Visit nodes level by level.

"노드를 레벨별로 방문한다."

두 가지 BFS 방법:

> - **Level-Order**: Processes nodes from top to bottom (used in shortest path algorithms).

"Level-Order: 위에서 아래로 노드를 처리한다 (최단 경로 알고리즘에 사용)."

> - **Zig-Zag Traversal**: Alternates left-to-right and right-to-left at each level (used in hierarchical structures).

"지그재그 순회: 각 레벨에서 왼쪽-오른쪽과 오른쪽-왼쪽을 번갈아 처리한다 (계층 구조에 사용)."

```
예시 트리:
       A          레벨 0
      / \
     B   C        레벨 1
    / \   \
   D   E   F      레벨 2

Level-Order:    A → B → C → D → E → F
Zig-Zag:        A → C → B → D → E → F   (레벨 1은 오른쪽→왼쪽)
```

BFS 구현 핵심: Queue를 사용해 현재 레벨의 노드를 처리하면서 자식을 Queue에 추가한다.

```js
function bfs(root) {
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();       // Front에서 꺼냄
    console.log(node.val);
    if (node.left)  queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}
```

---

## 종합

BFS는 "레벨 순서대로 처리"가 필요한 모든 문제에 쓰인다. 최단 경로(두 노드 사이 최소 간선 수)는 BFS가 레벨 = 거리이기 때문에 자연스럽게 최단 경로를 보장한다. DFS가 "깊이를 먼저 파고드는 Stack" 방식이라면, BFS는 "현재 레벨을 먼저 처리하는 Queue" 방식이다 — 두 순회의 도구가 Stack vs Queue로 갈리는 이유다.

---

# Tree의 기본 용어는?

## 도입

Tree를 다루는 문서나 코드에서 공통으로 쓰이는 용어들이 있다. 한 번 정리해두면 BST, Heap, Trie 등 모든 트리 기반 자료구조에서 같은 단어를 만난다.

---

## 본문

> - **Leaf Node (External Node)**: The nodes which do not have any child nodes are called leaf nodes.

"리프 노드(외부 노드): 자식 노드가 없는 노드."

> - **Ancestor of a Node**: Any predecessor nodes on the path of the root to that node are called Ancestors of that node.

"노드의 조상: 루트에서 해당 노드까지의 경로에 있는 모든 선행 노드."

- **predecessor**: 해당 노드보다 먼저 나타나는 노드. 루트부터 해당 노드까지 이어지는 경로 위의 모든 노드가 조상이다.

> - **Neighbour of a Node**: Parent or child nodes of that node are called neighbors of that node.

"노드의 이웃: 해당 노드의 부모 또는 자식 노드."

> - **Sibling**: Children of the same parent node are called siblings.

"형제(Sibling): 같은 부모 노드의 자식들."

> - **Internal Node**: A node with at least one child is called Internal Node.

"내부 노드: 자식이 하나 이상인 노드. 리프 노드의 반대."

> - **Subtree**: Any node of the tree along with its descendant.

"서브트리: 트리의 어느 노드든, 그 노드와 자손들을 포함하는 것."

- **descendant**: 해당 노드의 자식, 자식의 자식, 그 이하 모든 노드.

> - **Edge**: A connection between two nodes.

"간선(Edge): 두 노드 사이의 연결."

```
트리 구조와 용어:
         A           ← Root, Internal Node (자식 있음)
        / \
       B   C         ← Siblings (A의 자식들)
      / \
     D   E           ← Leaf Nodes (자식 없음), B의 자식들

A, B는 D의 Ancestors
B는 D의 Neighbour (부모)
D, E는 B의 Neighbours (자식)
B를 루트로 하는 Subtree = {B, D, E}
A-B, A-C, B-D, B-E는 각각 Edge
```

---

## 종합

이 용어들은 트리 알고리즘 문제에서 조건을 읽을 때 정확히 이해해야 하는 단어들이다. "리프 노드의 합을 구하라"와 "내부 노드의 합을 구하라"는 완전히 다른 문제다. "조상 노드 중 최대값을 찾아라"와 "이웃 노드 중 최대값을 찾아라"도 탐색 범위가 다르다. 용어 하나를 잘못 이해하면 알고리즘 설계 자체가 틀려진다.
