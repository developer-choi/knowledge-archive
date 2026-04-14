---
tags: [algorithm, concept]
---
# Questions
- Quick Sort란?
- Quick Sort의 핵심 요소 2가지는?
  - Pivot이란?
  - Partition이란?
- Quick Sort의 동작 방식은?
- Quick Sort의 시간복잡도와 Auxiliary Space는?
- Quick Sort의 장단점은?

---

# Answers

## Quick Sort란?

### Official Answer
QuickSort is a sorting algorithm that picks an element as a pivot and partitions the given array around the picked pivot by placing the pivot in its correct position in the sorted array.

> #### Key Terms:
> - **pivot**: 배열을 분할하는 기준이 되는 요소. pivot의 최종 위치가 정렬된 배열에서의 올바른 위치가 된다.

### Reference
- https://www.geeksforgeeks.org/quick-sort-algorithm/

---

## Quick Sort의 핵심 요소 2가지는?

### User Answer
1. **Pivot** — 무엇을 pivot으로 고르냐에 따라 달라진다.
2. **Partition** — 어떻게 분할하냐에 따라서도 달라진다.

즉, pivot 선택 방식과 partition 알고리즘의 조합에 따라 Quick Sort는 여러 종류가 될 수 있다.

### Reference
- https://www.geeksforgeeks.org/quick-sort-algorithm/

---

## Pivot이란?

### Official Answer
An element chosen from the array that is used as a reference point to divide the array into two sub-arrays.
Elements smaller than the pivot go to one sub-array, and elements larger go to the other.

> #### AI Annotation:
> **Pivot 선택 방식 종류:**
> 1. **항상 첫 번째(또는 마지막) 요소**: 구현이 단순하나, 이미 정렬된 배열에서 최악(O(n²))이 됨.
> 2. **무작위 요소**: 최악 케이스가 특정 패턴에 의존하지 않으므로 선호되는 방식.
> 3. **중앙값(Median)**: 이론적으로 이상적이지만, 중앙값을 구하는 데 연산이 많이 필요함 (high constants).

### Reference
- https://www.geeksforgeeks.org/quick-sort-algorithm/

---

## Partition이란?

### Official Answer
Rearrange the array around the pivot.
After partitioning, all elements smaller than the pivot will be on its left, and all elements greater than the pivot will be on its right.
The pivot is then in its correct position, and we obtain the index of the pivot.

The key process in quickSort is a partition(). There are three common algorithms to partition. All these algorithms have O(n) time complexity.

1. **Naive Partition**: Here we create copy of the array. First put all smaller elements and then all greater. Finally we copy the temporary array back to original array. This requires O(n) extra space.
2. **Lomuto Partition**: We keep track of index of smaller elements and keep swapping. Simple algorithm.
3. **Hoare's Partition**: This is the fastest of all. Here we traverse array from both sides and keep swapping greater element on left with smaller on right while the array is not partitioned.

> #### User Annotation:
> partition()의 목표를 정리하면:
> 1. pivot 정하고
> 2. pivot 기준 좌측에 작은 것, 우측에 큰 것이 오게 한 다음
> 3. 그 pivot의 index를 반환한다.

### Reference
- https://www.geeksforgeeks.org/quick-sort-algorithm/
- https://www.geeksforgeeks.org/dsa/lomuto-partition-algorithm/

---

## Quick Sort의 동작 방식은?

### Official Answer
**Step 1. Choose a Pivot**

Select an element from the array as the pivot.
There are many different choices for picking pivots.

**Step 2. Partition the Array**

Rearrange the array around the pivot.
After partitioning, all elements smaller than the pivot will be on its left, and all elements greater than the pivot will be on its right.
The pivot is then in its correct position, and we obtain the index of the pivot.

**Step 3. Recursively Call**

Next, we apply the same method recursively to the smaller sub-arrays on the left and right of the pivot.
Each time, we select new pivots and partition the arrays again.
This process continues until only one element is left, which is always sorted.
Once every element is in its correct position, the entire array is sorted.

> #### Official Annotation:
> The recursion stops when there is only one element left in the sub-array, as a single element is already sorted.

### Reference
- https://www.geeksforgeeks.org/quick-sort-algorithm/

---

## Quick Sort의 시간복잡도와 Auxiliary Space는?

### Official Answer
**Time Complexity:**
- **Best Case**: Ω(n log n) — Occurs when the pivot element divides the array into two equal halves.
- **Average Case**: θ(n log n) — On average, the pivot divides the array into two parts, but not necessarily equal.
- **Worst Case**: O(n²) — Occurs when the smallest or largest element is always chosen as the pivot (e.g., sorted arrays).

**Auxiliary Space**: O(n), due to recursive call stack.

> #### AI Annotation:
> Auxiliary Space가 O(n)인 이유: 재귀 호출 깊이가 최대 O(n)이 될 수 있어 콜 스택에 그만큼의 공간이 사용된다.
> pivot 선택을 랜덤으로 하면 평균적으로 O(log n) 깊이가 된다.

### Reference
- https://www.geeksforgeeks.org/dsa/time-and-space-complexity-analysis-of-quick-sort/

---

## Quick Sort의 장단점은?

### Official Answer
**Advantages:**

**Fastest** general purpose algorithm **for large data**.

Quicksort is a cache-friendly algorithm as it has a good locality of reference when used for arrays.

**Disadvantages:**

It is not a good choice for small data sets.

It is not a stable sort.
It is used almost everywhere where a stable sort is not needed.
For stability, Merge Sort is typically used.

> #### Key Terms:
> - **cache-friendly**: 메모리 접근 패턴이 CPU 캐시를 효율적으로 활용하는 특성. 연속된 메모리 접근이 많을수록 캐시 히트율이 높아진다.
> - **locality of reference**: 최근에 또는 인접하게 사용된 데이터가 다시 사용될 가능성이 높다는 원리.

### Reference
- https://www.geeksforgeeks.org/dsa/application-and-uses-of-quicksort/
