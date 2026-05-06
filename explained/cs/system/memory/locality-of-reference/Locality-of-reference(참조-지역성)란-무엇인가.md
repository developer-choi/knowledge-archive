# Locality of reference(참조 지역성)란 무엇인가?

> In computer science, locality of reference, also known as the principle of locality, is the tendency of a processor to access the same set of memory locations repetitively over a short period of time.
> There are two basic types of reference locality – temporal and spatial locality.
> Locality is a type of predictable behavior that occurs in computer systems.

---

**도입**

컴퓨터 메모리 시스템의 모든 캐시 설계는 한 가지 관찰에서 출발합니다 — "프로그램은 같은 곳 또는 가까운 곳을 자주 또 본다". 이 경향이 곧 locality of reference. 프로그램이 진짜로 무작위 메모리 접근만 한다면 캐시는 거의 무용지물이 됐을 것. 하지만 실제 프로그램은 "예측 가능"하게 행동합니다.

---

**본문**

> In computer science, locality of reference, also known as the principle of locality,

컴퓨터 과학에서 참조 지역성(또는 지역성의 원칙)은,

- **locality of reference**: "참조에 지역성이 있다" — 메모리를 참조할 때 무작위가 아니라 어떤 영역에 모이는 경향이 있다.
- **principle of locality**: 동의어. "원칙"이라 불릴 만큼 광범위하게 관찰되는 보편적 패턴.

> is the tendency of a processor to access the same set of memory locations repetitively over a short period of time.

프로세서가 짧은 시간 동안 같은 메모리 위치들의 집합에 반복적으로 접근하는 경향이다.

- **tendency**: 절대적 법칙이 아니라 통계적 경향. 모든 프로그램이 그렇진 않지만 대다수가 그러함.
- **same set of memory locations**: 같은 메모리 위치들의 집합. 프로그램이 한정된 영역만 집중적으로 사용한다는 뜻.
- **repetitively**: 반복적으로. 한 번이 아니라 여러 번.
- **over a short period of time**: 짧은 시간 동안. 시간 창이 좁을수록 지역성이 명확.

> There are two basic types of reference locality – temporal and spatial locality.

참조 지역성에는 두 가지 기본 유형이 있다 — temporal(시간적)과 spatial(공간적) 지역성.

- **temporal locality**: 같은 위치를 짧은 시간 안에 또 본다. "최근 본 건 또 볼 가능성이 높다."
- **spatial locality**: 가까운 위치를 본다. "이 주소를 봤다면 그 주변도 곧 볼 가능성이 높다."

> Locality is a type of predictable behavior that occurs in computer systems.

지역성은 컴퓨터 시스템에서 발생하는 예측 가능한 행동의 한 유형이다.

- **predictable behavior**: 예측 가능한 행동. 무작위가 아니므로 미리 준비(prefetch, caching)할 수 있음.
- **occurs in computer systems**: 컴퓨터 시스템에서 자연스럽게 발생. 강제하지 않아도 프로그램들이 자연히 그렇게 행동.

---

**종합**

지역성이 왜 자연스럽게 발생하는가:

- **반복문**: for 루프의 카운터 변수 `i`는 매 반복마다 읽고 쓰임. 같은 변수 → temporal locality.
- **배열 순회**: `arr[0]`, `arr[1]`, `arr[2]`... 인접 메모리 → spatial locality.
- **함수 호출**: 한 함수의 코드 영역 안에서 명령어가 차례로 실행 → 코드의 spatial locality.

JS 코드로 보면:

```js
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let sum = 0;
for (let i = 0; i < arr.length; i++) {  // i: temporal locality
  sum += arr[i];                         // arr[0..9]: spatial locality
}
                                         // sum: temporal locality
```

- `i`와 `sum`은 매 반복마다 읽고 쓰니 temporal locality 매우 높음.
- `arr[0]` → `arr[1]` → ... 는 메모리상 인접하니 spatial locality 매우 높음.
- 이 짧은 코드 안의 메모리 접근이 거의 모두 같은 영역에 집중됨.

| 종류 | 정의 | 활용하는 메커니즘 |
|---|---|---|
| Temporal locality | 같은 주소를 곧 또 접근 | 캐시에 머물게 두기 (LRU 교체) |
| Spatial locality | 인접 주소를 곧 접근 | 캐시 라인(보통 64바이트)으로 인접 데이터 묶어 가져오기 |
| (Sequential locality) | spatial의 특수 케이스 — 순차 접근 | prefetch (다음 데이터 미리 가져오기) |

이게 없으면 어떻게 되는가 — 프로그램이 무작위로 메모리에 접근한다면: 캐시가 무용지물입니다. 한 번 쓴 데이터를 다시 쓰지 않으니 캐시에 둬봐야 의미 없고, 인접 데이터도 안 쓰니 같이 가져와봐야 낭비. 모든 메모리 접근이 RAM 직행 = 100ns 페널티 = CPU가 거의 노는 상태. 현대 CPU 성능의 대부분이 캐시에서 나오는데, 캐시는 locality의 산물.

오개념 예방: "Locality는 자동으로 보장되니 개발자가 신경 쓸 필요 없다"는 부정확. 자료구조 선택·순회 순서가 locality를 직접 결정합니다. 예: 2D 배열을 행 우선(row-major)으로 순회하면 spatial locality 좋음, 열 우선(column-major)으로 순회하면 캐시 미스 폭증. 같은 알고리즘인데 순회 방향만 바꿔도 10배 차이가 날 수 있음.

다음 두 질문에서 temporal과 spatial locality를 각각 자세히 봅니다 — 이 글은 "둘이 있다"는 큰 그림까지만.
