---
tags: [data-structure, concept]
---

# Questions
- BST에서 임의의 노드를 골랐을 때, 왼쪽 서브트리와 오른쪽 서브트리의 값은 어떤 관계인가?
  - BST에 중복 값을 삽입할 수 있는가?
- BST의 장점은?
- BST가 Array보다 정렬된 데이터 관리에 유리한 이유는?
- BST vs Hash Table 비교는?
- BST가 불균형하면 어떤 일이 발생하는가?

---

# Answers

## BST에서 임의의 노드를 골랐을 때, 왼쪽 서브트리와 오른쪽 서브트리의 값은 어떤 관계인가?

### Official Answer
- **Ordering Property**: For every node in the BST, all values in the left subtree are smaller, and all values in the right subtree are larger than the node's value.
This rule holds recursively for all subtrees.
- **Recursive Nature**: Each left or right subtree of a node in a BST is itself a BST, allowing recursive algorithms to naturally process the tree.

### Reference
- https://www.geeksforgeeks.org/dsa/binary-search-tree-data-structure/

---

## BST에 중복 값을 삽입할 수 있는가?

### Official Answer
There must be no duplicate nodes (BST may have duplicate values with different handling approaches).

### Reference
- https://www.geeksforgeeks.org/dsa/binary-search-tree-data-structure/

---

## BST의 장점은?

### Official Answer
A BST supports operations like search, insert, delete, maximum, minimum, floor, ceil, greater, smaller, etc in O(h) time where h is height of the BST.
To keep height less, self balancing BSTs are used in practice.
These Self-Balancing BSTs maintain the height as O(Log n).
Therefore all of the above mentioned operations become O(Log n).
Together with these, BST also allows sorted order traversal of data in O(n) time.

> #### User Annotation:
> **Floor (바닥)**: x의 Floor는 데이터 집합에서 x보다 작거나 같은 수 중 가장 큰 값.
> **Ceil (천장)**: x의 Ceil은 데이터 집합에서 x보다 크거나 같은 수 중 가장 작은 값.
>
> 예시: 데이터 집합이 {2, 5, 8, 12, 16, 23}일 때,
> - 13의 Floor는 12. (13보다 작은 값들 {2, 5, 8, 12} 중 가장 큼)
> - 13의 Ceil은 16. (13보다 큰 값들 {16, 23} 중 가장 작음)
>
> 정렬된 순서대로 순회도 가능 (DFS의 in-order traversal 쓰면 됨).

### Reference
- https://www.geeksforgeeks.org/dsa/applications-advantages-and-disadvantages-of-binary-tree/

---

## BST가 Array보다 정렬된 데이터 관리에 유리한 이유는?

### Official Answer
A Self-Balancing Binary Search Tree is used to maintain sorted stream of data.

For example, suppose we are getting online orders placed and we want to maintain the live data in sorted order of prices.
For example, we wish to know number of items purchased at cost below a given cost at any moment.
Or we wish to know number of items purchased at higher cost than given cost.

> #### User Annotation:
> 배열도 정렬시켜놓고나서 순회하면 정렬된 상태로 O(n) 순회가 되는데?
> 데이터를 순회만 하는 경우는 별로없음.
> 넣고, 삭제 (유지=관리) 하는것도 같이 봐야함.
>
> Array는 삽입, 삭제가 O(n)임. 하지만 Self-Balancing BST는 O(log n)임.
> 정렬된 배열은 검색은 이진 탐색으로 O(log n)이라 빠르지만, 삽입하거나 삭제하려면 그 뒤의 모든 데이터를 한 칸씩 옮겨야 해서 O(n)의 비용이 듬.

> #### AI Annotation:
> 'maintain'은 단순히 '저장하고 있다'는 의미를 넘어섬.
> 새로운 데이터가 계속 추가되거나 기존 데이터가 삭제되는 상황에서도, 정렬된 상태를 꾸준히 지키고 유지한다는 동적인 의미를 내포.
>
> - **'저장하고 있다' (Store)**: 정적인 상태. 한 번 데이터를 넣으면 그 상태 그대로 있는 것.
> - **'유지하다' (Maintain)**: 동적인 상태. 데이터가 실시간으로 들어오고(삽입), 취소되더라도(삭제), BST는 항상 정렬된 상태를 유지해야 함.

### Reference
- https://www.geeksforgeeks.org/dsa/applications-advantages-and-disadvantages-of-binary-tree/

---

## BST vs Hash Table 비교는?

### Official Answer
Search, insert and delete are faster than array and linked list and slower than hashing, but hashing does not allow sorted traversal, floor and ceil operations.

When we need only search, insert and delete and do not need other operations, we prefer Hash Table over BST as a Hash Table supports these operations in O(1) time on average.

> #### User Annotation:
> insert, delete, search만 할거라면 Hash Table이 낫다.

> #### AI Annotation:
> 해시 테이블은 지원하지 않거나 비효율적이지만, BST는 효율적으로 지원하는 연산들:
> 1. **정렬된 순회**: 모든 데이터를 정렬된 순서로 가져오는 기능 (해시 테이블은 불가능)
> 2. **최대값/최소값 찾기**: BST에서는 가장 오른쪽/왼쪽 끝으로만 가면 되므로 O(Log n)에 가능
> 3. **범위 검색 (Range Search)**: 특정 범위(예: 100과 500 사이)에 있는 모든 데이터를 찾는 기능
> 4. **순서 통계량 찾기**: k번째로 작은/큰 원소를 찾거나, 특정 값보다 작거나 큰 원소(Successor/Predecessor)를 찾는 기능

### Reference
- https://www.geeksforgeeks.org/dsa/applications-advantages-and-disadvantages-of-binary-tree/

---

## BST가 불균형하면 어떤 일이 발생하는가?

### User Answer
탐색의 시간복잡도가 O(log n) → O(n)이 됨.
BST는 모든 노드를 탐색하지않기 때문에, BST는 O(log n)을 보장함.
하지만, 균형이 깨지면 결국 Linked List와 다를게 없기 때문에, 탐색이 O(n)이 됨.

탐색의 Auxiliary Space도 O(n)이 됨.
재귀도 n번 발생하기 때문에 재귀 스택도 n개 쌓일 수밖에 없음.

삽입, 삭제도 시간복잡도가 O(log n) → O(n)이 됨.
이미 깨져있는 Tree는 사실상 LinkedList이기 때문에,
끝에있는걸 삭제하거나, 끝에 뭔가를 삽입하려면 O(n)이 필요함.

> #### User Annotation:
> BST는 무조건 균형이 잡혀있지 않음.
> skewed tree도 BST 조건(왼쪽 < 부모 < 오른쪽)을 만족하면 BST임.
>
> 그래서 나온게 Self-balancing BST (AVL, Red-Black Tree).
> BST가 불균형해질 수 있기 때문에, 항상 효율적인 O(log n)의 성능을 보장하기 위해 자가 균형 이진 탐색 트리가 고안됨.

### Reference
- https://www.geeksforgeeks.org/dsa/balanced-binary-tree/
