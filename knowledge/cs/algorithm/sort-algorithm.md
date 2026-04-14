---
tags: [algorithm, concept]
---
# Questions
- [정렬 알고리즘을 알아야 하는 이유는?](#정렬-알고리즘을-알아야-하는-이유는)
- [Internal Sorting이란?](#internal-sorting이란)
- [External Sorting이란?](#external-sorting이란)
- [Stable Sorting이란?](#stable-sorting이란)
- [Hybrid Sorting이란?](#hybrid-sorting이란)

---

# Answers

## 정렬 알고리즘을 알아야 하는 이유는?

### User Answer
정렬해두면 탐색하기 쉬워지기 때문이다.
실생활도 다를 게 없다 — 정렬된 사전에서 단어를 찾는 것이 훨씬 빠르듯이.

### Reference
- https://www.geeksforgeeks.org/sorting-algorithms/

---

## Internal Sorting이란?

### Official Answer
Internal Sorting is when all the data is placed in the main memory or internal memory.
In internal sorting, the problem cannot take input beyond allocated memory size.

> #### AI Annotation:
> 모든 데이터가 메모리(RAM)에 올라와 있는 상태에서 정렬하는 방식.
> in-place / not in-place 둘 다 Internal Sorting에 포함될 수 있다.

### Reference
- https://www.geeksforgeeks.org/introduction-to-sorting-algorithm/

---

## External Sorting이란?

### Official Answer
External Sorting is when all the data that needs to be sorted need not to be placed in memory at a time, the sorting is called external sorting.
External Sorting is used for the massive amount of data.
For example Merge Sort can be used in external sorting as the whole array does not have to be present all the time in memory.

> #### Key Terms:
> - **auxiliary storage**: 보조 저장 장치 (디스크, SSD 등). 메모리에 올라가지 않은 데이터가 여기에 위치한다.

> #### User Annotation:
> 핵심은, 모든 데이터가 메모리에 안 올라가고 일부가 auxiliary storage에 들어간다는 점이다.

### Reference
- https://www.geeksforgeeks.org/external-sorting/

---

## Stable Sorting이란?

### Official Answer
When two same items appear in the same order in sorted data as in the original array called stable sort.
Examples: Merge Sort, Insertion Sort, Bubble Sort.

> #### AI Annotation:
> Unstable Sort의 대표 예: Quick Sort, Heap Sort.
> 동일한 값의 원래 순서를 보존해야 하는 경우 (예: 이름으로 정렬 후 나이 순 유지)에는 Stable Sort가 필요하다.

### Reference
- https://www.geeksforgeeks.org/stable-and-unstable-sorting-algorithms/

---

## Hybrid Sorting이란?

### Official Answer
A sorting algorithm is called Hybrid if it uses more than one standard sorting algorithms to sort the array.
The idea is to take advantages of multiple sorting algorithms.
For example IntroSort uses Insertion Sort and Quick Sort.

> #### AI Annotation:
> 각 알고리즘이 특정 조건에서 유리한 점을 조합하여 전반적인 성능을 높이는 전략이다.
> 예) 데이터가 작을 때는 Insertion Sort, 클 때는 Quick Sort를 사용.

### Reference
- https://www.geeksforgeeks.org/hybrid-sorting-algorithms/
