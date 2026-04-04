---
tags: [data-structure, concept]
---

# Questions
- [Tree 자료구조를 사용하는 이유는?](#tree-자료구조를-사용하는-이유는)
- [Tree의 DFS 순회 방법은?](#tree의-dfs-순회-방법은)
- [Tree의 BFS 순회 방법은?](#tree의-bfs-순회-방법은)
- [BST가 일반 Binary Tree보다 빠른 이유는?](#bst가-일반-binary-tree보다-빠른-이유는)

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
