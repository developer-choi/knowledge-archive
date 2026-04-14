---
tags: [algorithm, concept]
---

# Questions
- Searching Algorithm이란?
- Binary Search란?
- Binary Search의 시간복잡도와 Auxiliary Space는?

---

# Answers

## Searching Algorithm이란?

### Official Answer
Searching algorithms are essential tools in computer science used to locate specific items within a collection of data.

When we search an item in an array, there are two most common algorithms used based on the type of input array:
- Linear Search Algorithms
- Binary Search Algorithms

> #### User Annotation:
> 주로 Array에서 많이 찾겠지만 꼭 Array만 있는건 아님.

### Reference
- https://www.geeksforgeeks.org/dsa/searching-algorithms/

---

## Binary Search란?

### Official Answer
Binary Search Algorithm is a searching algorithm used in a sorted array by repeatedly dividing the search interval in half.

**Preconditions**:
1. The data structure must be sorted.
2. Access to any element of the data structure should take constant time.

**Algorithm**:
1. Divide the search space into two halves by finding the middle index "mid".
2. Compare the middle element of the search space with the key.
3. If the key is found at middle element, the process is terminated.
4. If the key is not found at middle element, choose which half will be used as the next search space.
   - If the key is smaller than the middle element, then the left side is used for next search.
   - If the key is larger than the middle element, then the right side is used for next search.
5. This process is continued until the key is found or the total search space is exhausted.

> #### User Annotation:
> 적합한 자료구조: Array (어느 인덱스로 접근하던 O(1))
> 적합하지 않은 자료구조: Linked List (특정 위치의 요소에 바로 접근할 수 없음. head부터 순차적으로 따라가야 하므로 O(N))
>
> iterative / recursive 2가지로 구현 가능:
> - iterative: 1~4 체크하고 찾는게 없으면, 시작점과 종료점을 변경해서 또 다시 순회
> - recursive: 1~4 체크하고 찾는게 없으면, 시작점과 종료점을 변경해서 자기 자신을 다시 호출

> #### AI Annotation:
> "상수 시간(constant time)"은 O(1) 시간 복잡도를 의미.
> 데이터 구조의 크기(N)와 관계없이, 특정 요소에 접근하거나 값을 읽는 데 걸리는 시간이 항상 일정하다는 뜻.
> 이진 탐색은 매 단계마다 탐색 범위를 절반으로 줄여나가기 위해 정확히 '중간' 요소에 빠르게 접근해야 함.

### Reference
- https://www.geeksforgeeks.org/binary-search/

---

## Binary Search의 시간복잡도와 Auxiliary Space는?

### Official Answer
- **Time Complexity**: Best = O(1), Average = O(log n), Worst = O(log n)
- **Auxiliary Space**:
  - Iterative: O(1)
  - Recursive: O(log n)

> #### User Annotation:
> Recursive가 O(log n) 공간을 쓰는 이유: 콜스택으로 인해 생기는 변수들 때문에.

### Reference
- https://www.geeksforgeeks.org/complexity-analysis-of-binary-search/
