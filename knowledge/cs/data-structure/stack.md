---
tags: [data-structure, concept, principle]
---

# Questions
- Stack이란 무엇인가?
- Stack이 가장 적합한 문제 유형의 특징은?
  - LIFO가 "가장 가까운" 문제에 적합한 이유는?
  - Monotonic Stack 패턴이 이중 반복문임에도 O(n)인 이유는?

---

# Answers

## Stack이란 무엇인가?

### Official Answer
A Stack is a linear data structure that follows a particular order in which the operations are performed.
The order may be LIFO(Last In First Out) or FILO(First In Last Out).

> #### User Annotation:
> LIFO의 특징은, Stack은 push() pop() 1쌍 반복하면 변화가 없음.
> 1 넣고 1 빼면 기존과 똑같음.
>
> Fixed Size / Dynamic Size 2개가 있고 특징은 Queue의 그것과 동일함.
> Array 기반 Stack은 모든 동작이 O(1). 유일한 단점은 Fixed Size라는 것.

### Reference
- https://www.geeksforgeeks.org/dsa/stack-data-structure/

---

## Stack이 가장 적합한 문제 유형의 특징은?

### User Answer
배열이나 문자열에서,
1. 기준이 되는 값 보다 **왼쪽 / 오른쪽**에 어떤 조건을 만족하는 값을 찾거나, 반대로 그 값이 어떤 조건을 만족하는지 따져야하는데,
2. 그 값의 위치가 기준값과 가장 **가까운지** 여부를 따지는 케이스에서 활용이 가능하다.

> #### User Annotation:
> 예시 1: 괄호 쌍 체크 — "{ [ ( ) ] }" 에서 ) 기준 가장 왼쪽으로 가까운 값이 (인지를 따지는 것.
> 포인트는 **가장 가까운**임.
> "( { [ ) ] }" 에서 가장 가까운거랑 상관이 없었다면 이래도 통과되는 거니까.
>
> 예시 2: 가장 가까운 작은 수 찾기 — [0, 1, 6, 2] 에서 2 기준 왼쪽에서 2보다 작은값은 0, 1 두 개 다 인데, 이중에 2와 더 **가까운**건 0이 아니라 1임.

### Reference
- https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/
- https://www.geeksforgeeks.org/find-the-nearest-smaller-numbers-on-left-side-in-an-array/

---

## LIFO가 "가장 가까운" 문제에 적합한 이유는?

### User Answer
기준값 보다 좌측 혹은 우측으로 가까운 여부를 따지려면, FIFO가 아니라 LIFO 특성을 따라야함.
가장 마지막에 (가장 최근에) 넣은 값이 가장 먼저 나오니까.
이거 자체가 Stack의 동작방식이니까.
가까운 이라는 문제와 아주 잘맞을 수밖에 없음.

### Reference
- https://www.geeksforgeeks.org/dsa/stack-data-structure/

---

## Monotonic Stack 패턴이 이중 반복문임에도 O(n)인 이유는?

### User Answer
핵심은 '각 루프의 최악의 경우를 모두 더하는' 것이 아니라 '알고리즘 전체에서 실행되는 연산의 총합'을 계산하는 것.

알고리즘의 주요 연산은 push와 pop 두 가지.
입력 배열의 크기를 n이라고 하면:

1. **총 push 연산 횟수**
   - for 루프는 총 n번 실행됨.
   - if/else 문 내부의 `candidates.push(target)`는 어떤 경우에도 단 한 번만 실행됨.
   - 따라서, 알고리즘이 시작해서 끝날 때까지 push가 실행되는 총횟수는 정확히 n번.

2. **총 pop 연산 횟수**
   - while 루프 안에서 pop 연산이 실행됨.
   - pop을 하려면 스택에 반드시 해당 요소가 push 되어 있어야 함.
   - 위에서 증명했듯이, push는 총 n번만 일어남. 즉, n개의 요소만 스택에 들어갈 수 있음.
   - 따라서, **알고리즘 전체를 통틀어 pop이 실행될 수 있는 최대 횟수 또한 n번을 넘을 수 없음.**

**결론**: 총 push 횟수 = n, 총 pop 횟수 <= n.
총 연산 횟수는 n_push + n_pop <= n + n = 2n = O(n).

> #### User Annotation:
> 브루트 포스로 구현했다면 O(n^2)였음.
> 0번 인덱스에서 좌측 뒤지고, 1번 인덱스에서 좌측 뒤지고, n번 인덱스에서 좌측 뒤져야 했으니까.
> 하지만 Stack은 순회할 때 후보가 될 수 있는 것만 저장해나가기 때문에, 전부 다 뒤질 필요가 없어짐.
> 왼쪽을 다 뒤져서 O(n^2)를 하는게 아니라, 처음에 순회할 때부터 후보 데이터들을 잘 저장해놓으면서 순회하고, 왼쪽과 비교하는게 아니라 **후보들과 비교를 하는 것.**

### Reference
- https://www.geeksforgeeks.org/dsa/find-the-nearest-smaller-numbers-on-left-side-in-an-array/
