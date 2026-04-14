---
tags: [algorithm, concept, comparison]
---
# Questions
- Auxiliary Space와 Space Complexity의 차이는?
  - 정렬 알고리즘 비교 시 Auxiliary Space를 기준으로 써야 하는 이유는?

---

# Answers

## Auxiliary Space와 Space Complexity의 차이는?

### Official Answer
The term Space Complexity is misused for Auxiliary Space at many places.
Following are the correct definitions of Auxiliary Space and Space Complexity.

Auxiliary Space is the **extra space** or **temporary space** used by an algorithm.

The space complexity of an algorithm is the **total space** taken by the algorithm with respect to the input size.
Space complexity includes both Auxiliary space and space used by input.

> #### Key Terms:
> - **Auxiliary Space**: 알고리즘이 실행 중 추가로 사용하는 임시 공간 (입력 제외)
> - **Space Complexity**: 입력 공간 + Auxiliary Space를 합산한 총 공간

> #### User Annotation:
> 누군가 "Space Complexity"라고 말하는 순간, 그게 진짜 Space Complexity인지 Auxiliary Space인지 따져봐야 한다.
> GeeksforGeeks에서도 혼용하는 경우가 있다.

### Reference
- https://www.geeksforgeeks.org/dsa/g-fact-86/
- https://www.geeksforgeeks.org/dsa/time-complexity-and-space-complexity/
- https://www.geeksforgeeks.org/dsa/what-is-the-difference-between-auxiliary-space-and-space-complexity/

---

## 정렬 알고리즘 비교 시 Auxiliary Space를 기준으로 써야 하는 이유는?

### Official Answer
For example, if we want to compare standard sorting algorithms on the basis of space, then **Auxiliary Space** would be a **better** criterion than **Space Complexity**.

- Auxiliary Space: Merge Sort uses O(n) auxiliary space, Insertion Sort and Heap Sort use **O(1)** auxiliary space.
- Space Complexity: The space complexity of all these sorting algorithms is **O(n)** though.

> #### AI Annotation:
> 모든 정렬 알고리즘은 입력 배열 자체가 O(n)을 차지하므로, Space Complexity로 비교하면 다 O(n)으로 동일하게 보인다.
> 실질적인 메모리 사용량 차이는 입력을 제외한 Auxiliary Space로 비교해야 드러난다.

### Reference
- https://www.geeksforgeeks.org/dsa/g-fact-86/
