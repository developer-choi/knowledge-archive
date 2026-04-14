---
tags: [algorithm, concept]
---
# Questions
- In-place algorithm이란?
  - constant space란?
- In-place algorithm의 장점은?
- In-place algorithm 예시 — Bubble Sort란?
- In-place algorithm 예시 — Selection Sort란?

---

# Answers

## In-place algorithm이란?

### Official Answer
An **in-place** sorting algorithm uses **constant space** for producing the output (**modifies the given array only**).
However, a small constant extra space used for variables is allowed.

Examples: Bubble Sort, Selection Sort, Insertion Sort, Heapsort.
Not In-Place: Merge Sort. Note that merge sort requires O(n) extra space.

What about QuickSort? Why is it called In-Place?
QuickSort uses extra space for recursive function calls.
It is called in-place according to broad definition as extra space required is not used to manipulate input, but only for recursive calls.

> #### Key Terms:
> - **constant space**: 입력 크기와 무관하게 항상 일정한 추가 메모리 공간. Auxiliary Space로는 O(1)로 표기.

> #### User Annotation:
> 원래 데이터가 저장된 메모리 공간 외에 추가로 메모리가 필요하지 않은 경우를 뜻한다 (보조 배열 변수 등).
> **원본 배열을 직접 수정**하는 방식으로 구현한다.
>
> 예) reverse array:
> - 배열 변수 하나 더 만들고 거꾸로 저장하기 → not in-place (Auxiliary Space: O(n))
> - 배열 변수는 1개만 유지한 채로 swap하기 → in-place (Auxiliary Space: O(1))

### Reference
- https://www.geeksforgeeks.org/in-place-algorithm/

---

## constant space란?

### User Answer
알고리즘이 사용하는 추가적인 메모리 공간의 크기가 입력의 크기와 **무관하게 항상 일정**한 경우.
Auxiliary Space로는 O(1)로 표기한다.

### Reference
- https://www.geeksforgeeks.org/in-place-algorithm/

---

## In-place algorithm의 장점은?

### Official Answer
It does not require any additional memory space.

> #### AI Annotation:
> Auxiliary Space가 O(1)이므로, 메모리 효율이 높다.
> 특히 메모리가 제한된 환경에서 유리하다.

### Reference
- https://www.geeksforgeeks.org/in-place-algorithm/

---

## In-place algorithm 예시 — Bubble Sort란?

### User Answer
좌우를 비교해서 **계속 swap**해가며, 순회 한 번 할 때마다 **우측**에 정렬된 값이 쌓이게 하는 알고리즘.

- In-place 정렬이므로 Auxiliary Space: O(1)
- Best Case: O(n) — 1회차 루프에서 swap한 게 하나도 없으면 그대로 종료
- Worst Case: O(n²)
- 단점: 대용량 데이터에서 매우 느리다.

### Reference
- https://www.geeksforgeeks.org/bubble-sort-algorithm/

---

## In-place algorithm 예시 — Selection Sort란?

### User Answer
순회할 때마다 순회 기준 숫자와 우측에서 제일 작은 숫자를 swap하는 알고리즘.

- In-place 정렬이므로 Auxiliary Space: O(1)
- Bubble Sort보다 swap 횟수가 적다는 장점이 있다.

### Reference
- https://www.geeksforgeeks.org/selection-sort/
