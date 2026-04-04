---
tags: [data-structure, concept]
---

# Questions
- [Tree 자료구조를 사용하는 이유는?](#tree-자료구조를-사용하는-이유는)
- [Tree의 DFS 순회 방법은?](#tree의-dfs-순회-방법은)
- [Tree의 BFS 순회 방법은?](#tree의-bfs-순회-방법은)
- [BST가 일반 Binary Tree보다 빠른 이유는?](#bst가-일반-binary-tree보다-빠른-이유는)
- [Tree의 기본 용어는?](#tree의-기본-용어는)

---

# Answers

## Tree 자료구조를 사용하는 이유는?

### Official Answer
One reason to use trees might be because you want to store information that naturally forms a hierarchy.

> #### User Annotation:
> 예: File System, HTML

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-tree-data-structure/

---

## Tree의 DFS 순회 방법은?

### Official Answer
Explore one branch fully before backtracking.

- **In-Order (LNR)**: Left → Node → Right (retrieves BST elements in sorted order).
- **Pre-Order (NLR)**: Node → Left → Right (used for tree reconstruction).
- **Post-Order (LRN)**: Left → Right → Node (helps in deleting or evaluating expressions).

### Reference
- https://www.geeksforgeeks.org/dsa/tree-traversals-inorder-preorder-and-postorder/
- https://www.geeksforgeeks.org/dsa/depth-first-search-or-dfs-for-a-graph/

---

## Tree의 BFS 순회 방법은?

### Official Answer
Visit nodes level by level.

- **Level-Order**: Processes nodes from top to bottom (used in shortest path algorithms).
- **Zig-Zag Traversal**: Alternates left-to-right and right-to-left at each level (used in hierarchical structures).

### Reference
- https://www.geeksforgeeks.org/dsa/breadth-first-search-or-bfs-for-a-graph/

---

## BST가 일반 Binary Tree보다 빠른 이유는?

### User Answer
어떤 연산 (순회, 최소값 찾기 등)을 하더라도 대체로 BST가 그냥 Binary Tree보다 더 빠름.
그냥 Tree는 모든 노드를 다 한번씩 찾아야하는데 BST는 Tree의 높이만큼만 찾아가면 되니까.

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-tree-data-structure/

---

## Tree의 기본 용어는?

### Official Answer
- **Leaf Node (External Node)**: The nodes which do not have any child nodes are called leaf nodes.
- **Ancestor of a Node**: Any predecessor nodes on the path of the root to that node are called Ancestors of that node.
- **Neighbour of a Node**: Parent or child nodes of that node are called neighbors of that node.
- **Sibling**: Children of the same parent node are called siblings.
- **Internal Node**: A node with at least one child is called Internal Node.
- **Subtree**: Any node of the tree along with its descendant.
- **Edge**: A connection between two nodes.

> #### User Annotation:
> Subtree = 트리의 어떤 노드든 그 노드의 자손들을 포함하는 것을 서브트리라고 함. (즉, 특정 노드를 루트로 하는 모든 하위 노드의 집합)
> Edge = 노드와 노드 사이를 연결하는 선

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-tree-data-structure/
