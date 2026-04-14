---
tags: [algorithm, concept]
---
# Questions
- [Lomuto Partition의 목표는?](#lomuto-partition의-목표는)
- [Lomuto Partition의 동작 방식은?](#lomuto-partition의-동작-방식은)

---

# Answers

## Lomuto Partition의 목표는?

### User Answer
1. pivot을 정한다 (랜덤, 중앙, 첫, 마지막 중 선택).
2. pivot 기준 좌측에 작은 것, 우측에 큰 것이 오도록 원본 배열을 직접 수정한다.
3. 그 pivot의 최종 index를 반환한다.

### Reference
- https://www.geeksforgeeks.org/dsa/lomuto-partition-algorithm/

---

## Lomuto Partition의 동작 방식은?

### User Answer
**Step 0. 포인터 2개 준비**

- `i`: 피벗보다 작은 요소들의 마지막 인덱스를 추적하는 포인터 (초기값: 시작 인덱스 - 1)
- `j`: 배열을 순회하는 포인터

**Step 1. 초기값 설정**

- pivot은 보통 마지막 요소로 설정한다.
- `i`는 low - 1로 초기화한다.

**Step 2. 순회하며 swap**

- `j`를 low부터 pivot 직전까지 순회한다.
- `arr[j] <= pivot`이면: `i++` 후 `arr[i]`와 `arr[j]`를 swap한다.
- `arr[j] > pivot`이면: swap하지 않고 `j++`만 한다.
  - swap하지 않더라도 `j++`를 하는 이유: 피벗보다 큰 요소는 건너뛰고 다음 요소로 이동해야 하기 때문이다.

**Step 3. 중간값과 pivot을 서로 swap**

- 순회가 끝나면 `arr[i+1]`과 pivot(`arr[high]`)을 swap한다.
- 이 위치가 pivot의 최종 위치가 된다.
- pivot의 최종 index(`i+1`)를 반환한다.

> #### AI Annotation:
> 순회가 끝났을 때 `i+1` 위치의 왼쪽에는 모두 pivot보다 작은 값, 오른쪽에는 모두 pivot보다 큰 값이 있다.
> 따라서 `arr[i+1]`에 pivot을 놓으면 pivot이 정렬된 배열에서의 올바른 위치에 놓이게 된다.

### Reference
- https://www.geeksforgeeks.org/dsa/lomuto-partition-algorithm/
