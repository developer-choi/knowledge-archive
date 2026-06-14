# 배열이란 무엇인가?

## 도입

배열은 같은 타입의 값 여러 개를 하나의 이름으로 묶어 저장하는 자료구조다. JS에서 `[1, 2, 3]`을 선언하면 내부적으로 연속된 메모리 블록이 할당된다 — 각 원소는 정해진 크기로 옆에 붙어 있다. 이 연속성이 배열의 모든 특성(장점과 단점 모두)을 결정한다.

---

## 본문

> Array is a collection of items of the same variable type that are stored at contiguous memory locations.

"배열은 같은 변수 타입의 항목들을 연속된 메모리 위치에 저장하는 모음이다."

- **contiguous memory locations**: 원소들이 메모리에서 빈틈 없이 붙어 있다. 0번 원소 바로 다음 주소에 1번 원소가 있고, 그 다음에 2번 원소가 있다. Linked List처럼 "포인터로 다음 위치를 찾아가는" 방식이 아니다.

> When an array is created, it occupies a contiguous block of memory.

"배열이 생성되면 연속된 메모리 블록을 점유한다."

- **block**: 단일 덩어리. 배열 생성 시 OS에게 이 덩어리 전체를 한 번에 요청한다. 중간에 조각조각 늘릴 수 없고, 늘리려면 더 큰 블록을 새로 할당해야 한다.

> Each element can be accessed using its index.

"각 원소는 인덱스를 사용해 접근할 수 있다."

- **index**: 0부터 시작하는 정수 오프셋. 내부적으로 `base + index × size` 수식 하나로 원소의 정확한 주소를 계산한다.

```
메모리 주소:  1000  1004  1008  1012  1016
              [  0] [  1] [  2] [  3] [  4]   ← int 배열 (4바이트씩)
```

---

## 종합

배열의 핵심은 "연속 메모리"다. 덕분에 인덱스만 알면 주소 계산 한 번으로 어디서든 O(1)에 읽을 수 있고, CPU 캐시도 인접 원소를 미리 불러와 효율이 높다. 반면 이 연속성이 삽입·삭제를 비싸게 만든다 — 중간에 뭔가를 끼우려면 뒤의 원소를 모두 한 칸씩 밀어야 한다. JS `Array`는 내부적으로 이 동작을 런타임이 처리해주지만, 알고리즘 복잡도는 똑같이 O(n)이다.

---

# 부분 배열(Subarray)이란 무엇인가?

## 도입

배열에서 일부를 뽑아내는 방법은 세 가지 — subarray, subset, subsequence — 가 있는데 비슷해 보여서 혼용하기 쉽다. 셋의 결정적 차이는 "원소가 원래 배열에서 연속해 있어야 하는가"다.

---

## 본문

> A subarray is a contiguous part of an array, formed by selecting one or more consecutive elements while maintaining their original order.

"부분 배열은 배열의 연속된 부분으로, 하나 이상의 연속적인 원소를 원래 순서를 유지하면서 선택해 만들어진다."

- **contiguous**: subarray의 핵심 조건. 원래 배열에서 끊김 없이 붙어 있는 구간이어야 한다.
- **consecutive elements**: 인덱스가 연달아 있는 원소들. `i`번부터 `j`번까지 모두 포함한다.
- **maintaining their original order**: 뒤집거나 재배열하지 않는다. 원래 순서 그대로다.

`[1,2,3,4]`에서 `[2,3]`은 subarray지만 `[1,3]`은 아니다 — 2와 4를 건너뛰었기 때문이다. `[1,3]`은 subsequence다.

```
원배열:  [1, 2, 3, 4]

subarray:   [2, 3]     ← 인덱스 1~2, 연속 O
subsequence: [1, 3]    ← 인덱스 0, 2, 연속 X (사이 2를 건너뜀)
subset:      {3, 1}    ← 순서도 상관없음
```

---

## 종합

subarray는 "원래 배열 위에서 자른 슬라이스"다. JS의 `arr.slice(i, j)`가 반환하는 것이 정확히 subarray다 — 연속 구간을 순서 그대로 복사한다. 알고리즘 문제에서 "최대 subarray 합(Kadane's algorithm)" 같은 유형이 나오면, 연속성 조건 때문에 건너뛰거나 순서를 바꾸는 풀이는 틀린다는 점을 항상 기억한다.

---

# [UNVERIFIED] 배열이 왜 필요한가?

## 도입

배열이 없다면 여러 값을 저장하기 위해 변수를 개수만큼 만들어야 한다. 값의 수가 늘어나거나 줄어들 때 코드 전체를 바꿔야 하는 문제가 생긴다.

---

## 본문

학생 5명의 이름을 저장한다고 하면, 배열 없이 하면 `name1`, `name2`, ..., `name5` 변수 5개가 필요하다. 6명이 되는 순간 변수를 하나 더 추가하고, 그 변수를 참조하는 코드를 전부 찾아서 수정해야 한다.

```js
// 배열 없이
const name1 = 'Alice';
const name2 = 'Bob';
// ... name5까지

// 배열로
const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];
// 6번째 추가: names.push('Frank') 한 줄로 끝
```

배열을 쓰면 반복문 한 줄(`for`, `forEach`, `map`)로 전체를 순회할 수 있고, 인덱스로 특정 위치를 지정해 읽거나 바꿀 수 있다.

---

## 종합

배열의 필요성은 "동종 데이터의 집합을 하나의 단위로 다루기 위함"이다. 개수가 컴파일 타임에 고정돼 있어도, 런타임에 동적으로 변해도 배열 하나로 처리할 수 있다. JS의 `Array`는 실제로는 동적 배열(dynamic array)에 가까워 `push`/`pop`으로 크기를 늘리고 줄일 수 있다 — 내부적으로는 크기 초과 시 새 블록을 할당하고 복사한다.

---

# 배열의 장점은 무엇인가?

## 도입

배열이 "연속 메모리"에 저장된다는 구조적 특성은 두 가지 핵심 장점으로 이어진다 — 어떤 위치든 O(1)에 바로 읽는 임의 접근, 그리고 CPU 캐시가 미리 준비해주는 캐시 친화성이다.

---

## 본문

> 1. **Random Access**: i-th item can be accessed in O(1) Time as we have the base address and every item or reference is of same size.

"임의 접근: i번째 항목은 베이스 주소와 모든 항목 또는 참조가 같은 크기라는 사실을 이용해 O(1) 시간에 접근할 수 있다."

- **Random Access**: 여기서 "random"은 "예측 불가능한"이 아니라 "임의의(any) 위치에 직접 접근"을 뜻한다. Non-sequential, Direct Access라고도 한다. 반대는 Linked List처럼 처음부터 순서대로 따라가야 하는 Sequential Access다.
- **base address**: 배열 전체의 시작 주소. OS가 배열 생성 시 할당해주는 고정값이다.
- **every item of same size**: 각 원소가 같은 크기이므로 `base + index × size` 한 번의 곱셈·덧셈으로 정확한 주소를 계산한다. 10억 개짜리 배열이라도 999,999,999번 인덱스에 접근하는 데 걸리는 시간이 0번과 같다.

> 2. **Cache Friendliness**: Since items/references are stored at contiguous locations, we get the advantage of locality of reference.

"캐시 친화성: 항목/참조가 연속된 위치에 저장되어 있으므로 참조의 지역성(locality of reference) 이점을 얻는다."

- **locality of reference**: CPU는 메모리에서 데이터를 읽을 때 해당 주소만 읽는 게 아니라 주변 블록(캐시 라인)을 통째로 읽어온다. 배열은 원소들이 붙어 있으므로 `arr[0]`을 읽을 때 `arr[1]`, `arr[2]`도 함께 캐시에 들어온다 — 다음 접근 시 캐시 히트가 된다.

---

## 종합

Random Access와 캐시 친화성은 모두 "연속 메모리"라는 같은 뿌리에서 나온다. `arr[i]`에 접근하는 것은 단순 수식 계산 한 번이라 메모리 구조를 따라갈 필요가 없고, 한 번 접근하면 주변 원소가 이미 캐시에 올라와 있어 반복 순회가 빠르다. 알고리즘 문제에서 배열을 순회하는 for 루프가 실제로 느리지 않은 이유가 바로 이 두 가지다.

---

# 임의 접근(Random Access)이란 무엇이고, 왜 O(1)인가?

## 도입

"임의 접근"이라는 단어에서 "random"을 보고 무작위라고 오해하기 쉽다. 자료구조에서 Random Access는 "어느 위치든 직접 접근할 수 있다"는 의미다 — 처음부터 탐색하지 않아도 된다.

---

## 본문

> i-th item can be accessed in O(1) Time as we have the base address and every item or reference is of same size.

"i번째 항목은 베이스 주소와 모든 항목 또는 참조가 같은 크기라는 사실을 이용해 O(1) 시간에 접근할 수 있다."

O(1)인 근거: 주소 계산이 단 한 번의 산술 연산이기 때문이다.

```
주소 = base + index × elementSize
예) base=1000, index=3, elementSize=4 → 주소=1012
```

배열에 원소가 10개든 10억 개든 이 공식은 한 번만 실행된다.

이것이 가능한 이유는 두 전제 조건이 동시에 충족되기 때문이다:
1. base address를 알고 있다 (배열 생성 시 고정)
2. 모든 원소의 크기가 동일하다 (같은 타입이므로)

Random의 반대는 Sequential Access다. Linked List에서 3번째 노드를 찾으려면 head → 1번 → 2번 → 3번 순서로 포인터를 세 번 따라가야 한다 — 인덱스가 커질수록 시간이 선형으로 늘어난다.

```
Random Access (Array):
  arr[999] → 1000 + 999 × 4 = 4996번지 직접 접근  → O(1)

Sequential Access (Linked List):
  head → node1 → node2 → ... → node999  → O(n)
```

---

## 종합

Random Access의 O(1) 보장은 배열이 알고리즘에서 가장 많이 쓰이는 근본 이유다. DP 테이블, 슬라이딩 윈도우, 투 포인터 모두 "인덱스로 바로 읽는다"는 것을 전제한다. 이 전제가 깨지면(Linked List 사용 시) 같은 알고리즘이 O(n²)로 폭발할 수 있다.

---

# 배열이 캐시 친화적인 이유는?

## 도입

CPU는 메모리에서 데이터를 읽을 때 딱 요청한 바이트만 읽지 않는다 — 그 주변 블록(캐시 라인, 보통 64바이트)을 통째로 읽어와 캐시에 저장한다. 배열은 이 동작을 최대한 활용하는 구조다.

---

## 본문

> Since items/references are stored at contiguous memory locations, we get the advantage of locality of reference.

"항목/참조가 연속된 메모리 위치에 저장되어 있으므로 참조의 지역성 이점을 얻는다."

- **locality of reference**: CPU 캐시가 "이 주소 근처는 곧 또 쓸 것"이라고 예측해 미리 불러오는 원리다. 배열은 원소가 붙어 있으므로 `arr[0]`을 읽으면 `arr[1]`~`arr[15]`(64바이트 기준, 4바이트 int라면 16개)까지 한 번에 캐시에 올라온다.

```
캐시 라인 (64바이트):
  [arr[0]] [arr[1]] [arr[2]] ... [arr[15]]  ← 한 번에 올라옴

Linked List:
  node0 → (다른 주소) → node1 → (다른 주소) → node2
  → 매 접근마다 캐시 미스 발생 가능
```

연속된 메모리에 저장되어 있으므로 CPU 캐시가 인접 데이터를 미리 가져올 수 있어 캐시 히트율이 높아진다.

---

## 종합

캐시 친화성은 이론적 시간복잡도가 같아도 실제 성능 차이를 만든다. O(n) 배열 순회와 O(n) Linked List 순회는 빅오 기호상 같지만, 실제 벤치마크에서 배열이 수십 배 빠를 수 있다 — 캐시 히트·미스 차이 때문이다. JS V8 엔진이 연속 숫자 배열(`Int32Array`, 또는 SMI 배열)에 특별 최적화를 적용하는 것도 같은 이유다.

---

# 배열의 단점은 무엇인가?

## 도입

배열의 연속 메모리 구조는 장점이기도 하지만 동시에 단점의 원인이다. 연속성을 유지하려면 중간 삽입·삭제 시 원소들을 이동해야 하고, 정렬되지 않은 배열에서 특정 값을 찾으려면 처음부터 훑어야 한다.

---

## 본문

> It is not useful in places where we have operations like insert in the middle, delete from middle and search in a unsorted data.

"중간 삽입, 중간 삭제, 정렬되지 않은 데이터 검색 같은 연산이 있는 곳에서는 유용하지 않다."

- **insert in the middle**: 중간에 원소를 끼우면 뒤에 있는 모든 원소를 한 칸씩 밀어야 한다. 이동 횟수가 배열 크기 n에 비례 → O(n).
- **delete from middle**: 삭제하면 빈 자리가 생기고, 뒤 원소들을 앞으로 당겨야 한다 (배열엔 공백이 있으면 순회가 망가진다). 역시 O(n).
- **search in unsorted data**: 정렬이 안 된 배열에서 값을 찾으려면 처음부터 끝까지 확인해야 한다 → O(n). (정렬된 배열은 이진 탐색으로 O(log n) 가능)

정리:
1. 삽입/삭제: O(n)
2. 정렬 안 된 배열 검색: O(n). 정렬된 배열 + 이진 탐색이면 O(log n)이지만, 그것도 삽입/삭제가 O(n)이라 삽입·삭제가 빈번한 경우 비효율적이다.

---

## 종합

배열은 읽기(access)가 압도적으로 빠른 대신, 쓰기(삽입·삭제)가 비싸다는 트레이드오프를 가진다. 데이터가 한 번 채워지고 주로 읽히는 경우(룩업 테이블, DP 테이블 등)에는 최선의 선택이지만, 삽입·삭제가 빈번하다면 Linked List나 Hash Table을 고려해야 한다.

---

# 배열에서 삽입/삭제가 O(n)인 이유는?

## 도입

배열은 원소들이 연속 메모리에 빈틈 없이 붙어 있다. 그래서 중간에 원소를 끼우거나 빼려면 연속성을 유지하기 위해 주변 원소들을 이동시켜야 한다 — 그 이동 횟수가 O(n)이다.

---

## 본문

> Arrays are stored in contiguous memory locations, meaning elements are arranged in a sequential block.

"배열은 연속된 메모리 위치에 저장된다. 즉, 원소들은 순차적인 블록으로 배열된다."

삽입 과정 (OA):
1. **Identify the Position**: 새 원소를 삽입할 위치를 결정한다.
2. **Shift Elements**: 기존 원소들을 한 칸씩 앞으로 밀어 공간을 만든다.
3. **Insert the New Element**: 빈 자리에 새 값을 놓는다.
4. **Update the Size**: 동적 배열이라면 크기를 1 증가시킨다.

```
삽입 전:  [A, B, C, D, E]
인덱스 1에 X 삽입:
shift →   [A, B, B, C, D, E]  ← B,C,D,E를 한 칸씩 뒤로
insert →  [A, X, B, C, D, E]
```

삭제는 반대 방향 — 원소를 지우고 뒤의 원소들을 한 칸씩 앞으로 당긴다. 배열엔 공백이 있으면 안 되기 때문이다.

동적 배열 번외: 삽입 시 기존 크기를 초과하면, 더 큰 메모리 블록을 새로 할당하고 기존 값을 모두 복사한 뒤 새 원소를 추가해야 한다 — 이것도 O(n).

---

## 종합

삽입·삭제가 O(n)인 근본 원인은 "연속성 유지 의무"다. 배열의 가장 큰 강점(O(1) 랜덤 접근)이 바로 이 연속성에서 나오기 때문에, 연속성을 버리면 배열이 아니게 된다. 삽입·삭제가 잦은 자료구조가 필요하다면 Linked List(O(1) 삽입/삭제, 단 O(n) 탐색)나 Hash Table처럼 연속성 의무가 없는 구조를 선택한다.

---

# 삽입 위치가 성능에 어떤 영향을 미치는가?

## 도입

배열 삽입이 O(n)이라고 해도, 어디에 삽입하느냐에 따라 실제 이동 횟수가 달라진다. 최악은 맨 앞, 최선은 맨 뒤다.

---

## 본문

> - **Beginning (Index 0)**: Every element must shift one position right. This is the least efficient case for large arrays as it affects all elements.

"맨 앞(인덱스 0): 모든 원소를 한 칸 오른쪽으로 밀어야 한다. 모든 원소에 영향을 주므로 큰 배열에서 가장 비효율적이다."

> - **Specific Index**: Elements after the index shift right.

"특정 인덱스: 그 인덱스 이후의 원소들만 오른쪽으로 밀린다."

> - **End**: The simplest case since no shifting is required.

"맨 뒤: 밀 원소가 없으므로 가장 단순하다."

```
배열: [A, B, C, D, E]  (n=5)

맨 앞 삽입: A,B,C,D,E 5개 모두 이동 → 최악 O(n)
중간 삽입:  C,D,E 3개만 이동
맨 뒤 삽입: 이동 0개 → O(1)
```

삭제도 동일한 패턴이지만 반대 방향 — 맨 앞을 삭제하면 나머지 전체를 한 칸씩 앞으로 당긴다.

---

## 종합

빅오 표기상 삽입은 모두 O(n)으로 표기하지만, 상수 계수 차이가 있다. 맨 뒤 삽입(`arr.push`)은 O(1), 맨 앞 삽입(`arr.unshift`)은 O(n)이다. JS에서 배열 앞에 원소를 자주 추가해야 한다면 `unshift` 대신 역순으로 쌓고 마지막에 뒤집거나, 큐처럼 쓰는 자료구조(Deque)를 고려할 수 있다.
