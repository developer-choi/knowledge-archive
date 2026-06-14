---
tags: [react, concept, performance]
publishable: false
source: google-doc
priority: 1
---
# Questions

- React reconciliation이란 무엇인가? 왜 O(n³) 대신 O(n) 알고리즘을 쓰는가?
- React diffing 휴리스틱이 기반하는 두 가정은 무엇인가?
- React diffing 알고리즘은 두 트리를 구체적으로 어떻게 비교하는가?
- 리스트에서 항목을 앞에 삽입할 때 key prop이 없으면 어떤 비효율이 발생하는가?

---

# Answers

## React reconciliation이란 무엇인가? 왜 O(n³) 대신 O(n) 알고리즘을 쓰는가?

### Official Answer
When you use React, at a single point in time you can think of the **render()** function as creating a tree of **React elements.** On the next state or props update, that **render()** function will return a different tree of **React elements.**

React then needs to figure out how to efficiently update the UI to match the most recent tree.

There are some generic solutions to this algorithmic problem of generating the minimum number of operations to transform one tree into another. However, the state of the art algorithms have a complexity in the order of O(n³) where n is the number of elements in the tree.

If we used this in React, displaying 1000 elements would require in the order of one billion comparisons. This is far too expensive. Instead, React implements a heuristic O(n) algorithm based on two assumptions:

1. Two elements of different types will produce different trees.
2. The developer can hint at which child elements may be stable across different renders with a key prop.

### User Answer
변경된 부분만 "빠르게" 찾는 것. React는 이것을 "빠르게" 찾기 위해 2가지 가정을 했음.

### Reference
- https://reactjs.org/docs/reconciliation.html

---

## React diffing 휴리스틱이 기반하는 두 가정은 무엇인가?

### Official Answer
Instead, React implements a heuristic O(n) algorithm based on two assumptions:

1. Two elements of different types will produce different trees.
2. The developer can hint at which child elements may be stable across different renders with a key prop.

In practice, these assumptions are valid for almost all practical use cases.

### Reference
- https://legacy.reactjs.org/docs/reconciliation.html

---

## React diffing 알고리즘은 두 트리를 구체적으로 어떻게 비교하는가?

### User Answer
React는 두 개(변경 전후)의 React Element Tree를 비교할 때 root부터 비교하게 된다.

요약:
1. 컴포넌트 타입이 다르면 언마운트 시킨다
2. 같더라도 key props가 다르면 언마운트 시킨다
3. 바뀐 props를 찾아서 리렌더링 시킨다

상세:
1. 두 개의 루트 엘리먼트 타입이 다르면 이전 트리를 완전히 버리고 새로 만든다. 이전 트리를 만들었던 컴포넌트는 언마운트되고(state 전부 삭제), 새로운 트리를 만들었던 컴포넌트는 마운트된다(state 새로 생성). 단, 새로운 컴포넌트를 만들면 버리는 건 맞는데, 컴포넌트가 아닌 함수로 만들면 버리지 않음.
2. 타입이 같지만 key props가 다른 경우 → (1)과 동일.
3. 타입도 같고 key props도 변함없는 경우 → props만 업데이트함. 기존 컴포넌트도 언마운트되지 않고 리렌더링만 되며, 기존에 갖고 있던 State도 삭제되지 않음.

그래서 트리구조의 한참 밑에까지 탐색을 안 해도 됨.

---

## 리스트에서 항목을 앞에 삽입할 때 key prop이 없으면 어떤 비효율이 발생하는가?

### User Answer
key prop 없이 리스트 맨 앞에 항목을 삽입하면, React는 기존 항목들을 순서 기준으로 비교하므로 비효율적인 연산이 필요하다.

예: [Duke, Villanova] 앞에 Connecticut을 삽입하는 경우:
- Duke는 Connecticut과 비교해서 텍스트만 바뀌었으니 텍스트를 바꾸고
- Villanova도 같은 방식으로 Duke로 바꾸고
- 새롭게 li 태그에 Villanova 텍스트를 넣어서 추가하는 과정이 필요하다

key prop을 사용하면 Duke, Villanova 두 개의 li는 유지된 상태로 맨 앞에 Connecticut만 추가되도록 작동한다.
