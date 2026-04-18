---
tags: [data-structure, concept]
---

# Questions
- 배열이란 무엇인가?
  - 부분 배열(Subarray)이란 무엇인가?
- 배열이 왜 필요한가?
- 배열의 장점은 무엇인가?
  - 임의 접근(Random Access)이란 무엇이고, 왜 O(1)인가?
  - 배열이 캐시 친화적인 이유는?
- 배열의 단점은 무엇인가?
  - 배열에서 삽입/삭제가 O(n)인 이유는?
    - 삽입 위치가 성능에 어떤 영향을 미치는가?


---

# Answers

## 배열이란 무엇인가?

### Official Answer
Array is a collection of items of the same variable type that are stored at contiguous memory locations.
When an array is created, it occupies a contiguous block of memory.
Each element can be accessed using its index.

### Reference
- https://www.geeksforgeeks.org/introduction-to-arrays-data-structure-and-algorithm-tutorials/

---

## 부분 배열(Subarray)이란 무엇인가?

### Official Answer
A subarray is a contiguous part of an array, formed by selecting one or more consecutive elements while maintaining their original order.

> #### User Annotation: subset이나 subsequence와 헷갈리면 안됨.
> subarray는 반드시 **연속된(contiguous)** 원소여야 함.
> 예: `[1,2,3,4]`에서 `[2,3]`은 subarray, `[1,3]`은 subarray가 아님 (subsequence임).

### Reference
- https://www.geeksforgeeks.org/subarraysubstring-vs-subsequence-and-programs-to-generate-them/

---

## 배열이 왜 필요한가?

### User Answer
학생 5명의 이름을 저장해야할 일이 있을 때 string 변수 5개 만들면 관리하기 너무힘들어짐. (6명된다거나 등등)

### Reference
- https://www.geeksforgeeks.org/introduction-to-arrays-data-structure-and-algorithm-tutorials/

---

## 배열의 장점은 무엇인가?

### Official Answer
1. **Random Access**: i-th item can be accessed in O(1) Time as we have the base address and every item or reference is of same size.
2. **Cache Friendliness**: Since items/references are stored at contiguous locations, we get the advantage of locality of reference.

### Reference
- https://www.geeksforgeeks.org/introduction-to-arrays-data-structure-and-algorithm-tutorials/

---

## 임의 접근(Random Access)이란 무엇이고, 왜 O(1)인가?

### Official Answer
i-th item can be accessed in O(1) Time as we have the base address and every item or reference is of same size.

> #### AI Annotation: 배열은 base address와 각 원소의 크기가 동일하므로, `base + index * size`로 주소를 계산하여 O(1)에 접근할 수 있다.

> #### User Annotation: "random"이 자료구조에서는 "예측할 수 없는"이 아니라 다른 뉘앙스임.
> 1. Non-sequential: 데이터를 찾기 위해 처음부터 탐색할 필요 없음.
> 2. Direct Access: 데이터가 저장된 위치로 바로 접근할 수 있음.
>
> 반대 개념은 Sequential Access (Linked List, Queue 등).
> 특정 인덱스에 접근하려면 처음부터 순서대로 다 접근해야 하니까.
>
> 배열에 10억 개가 있어도 특정 인덱스에 저장된 값을 즉시 읽을 수 있다는 게 정말 큰 장점임.

### Reference
- https://www.geeksforgeeks.org/introduction-to-arrays-data-structure-and-algorithm-tutorials/

---

## 배열이 캐시 친화적인 이유는?

### Official Answer
Since items/references are stored at contiguous memory locations, we get the advantage of locality of reference.

> #### User Annotation: 연속된 메모리에 저장되어 있으므로 CPU 캐시가 인접 데이터를 미리 가져올 수 있어 캐시 히트율이 높다.

### Reference
- https://www.geeksforgeeks.org/introduction-to-arrays-data-structure-and-algorithm-tutorials/

---

## 배열의 단점은 무엇인가?

### Official Answer
It is not useful in places where we have operations like insert in the middle, delete from middle and search in a unsorted data.

> #### User Annotation:
> 1. **Insertion/Deletion**: 삽입, 삭제가 O(n)임.
> 2. **Searching**: sorted array + binary search인 경우에 한해 O(log n)이지, 그 외 나머지 전부 O(n)임.

### Reference
- https://www.geeksforgeeks.org/introduction-to-arrays-data-structure-and-algorithm-tutorials/

---

## 배열에서 삽입/삭제가 O(n)인 이유는?

### Official Answer
Arrays are stored in contiguous memory locations, meaning elements are arranged in a sequential block.

Insertion:
1. **Identify the Position**: Determine where the new element should be inserted.
2. **Shift Elements**: Move the existing elements one position forward to create space for the new element.
3. **Insert the New Element**: Place the new value in the correct position.
4. **Update the Size**: If the array is dynamic, its size is increased.

> #### User Annotation: 삭제도 비슷하지만 반대 방향임.
> 처음 원소를 삭제하면 그 뒤의 모든 원소를 앞으로 한 칸씩 당겨야 함.

> #### User Annotation: 번외) 동적 배열에서 추가 시 기존 크기를 초과하면, 새 메모리를 할당하고 기존 값을 모두 복사한 뒤 새 원소를 추가해야 한다.
> https://youtu.be/NFETSCJON2M?si=B4TvQnDGVdLkE_7L&t=554

### Reference
- https://www.geeksforgeeks.org/inserting-elements-in-an-array-array-operations/

---

## 삽입 위치가 성능에 어떤 영향을 미치는가?

### Official Answer
- **Beginning (Index 0)**: Every element must shift one position right.
This is the least efficient case for large arrays as it affects all elements.
- **Specific Index**: Elements after the index shift right.
- **End**: The simplest case since no shifting is required.

> #### User Annotation: 삭제도 비슷하지만 반대 방향임.
> 처음꺼 삭제하면 그 뒤에꺼를 다 앞으로 한칸씩 땡겨야함.
> 배열엔 공백이 있으면 안되니까. (배열 순회같은거 할 때 큰일남)

### Reference
- https://www.geeksforgeeks.org/inserting-elements-in-an-array-array-operations/
