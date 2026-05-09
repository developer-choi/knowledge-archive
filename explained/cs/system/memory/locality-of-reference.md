# Locality of reference(참조 지역성)란 무엇인가?

> In computer science, locality of reference, also known as the principle of locality, is the tendency of a processor to access the same set of memory locations repetitively over a short period of time.
> There are two basic types of reference locality – temporal and spatial locality.
> Locality is a type of predictable behavior that occurs in computer systems.

---

## 도입

컴퓨터 메모리 시스템의 모든 캐시 설계는 한 가지 관찰에서 출발합니다 — "프로그램은 같은 곳 또는 가까운 곳을 자주 또 본다". 이 경향이 곧 locality of reference. 프로그램이 진짜로 무작위 메모리 접근만 한다면 캐시는 거의 무용지물이 됐을 것. 하지만 실제 프로그램은 "예측 가능"하게 행동합니다.

---

## 본문

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

## 종합

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

---

# Temporal locality란 무엇인가?

> Temporal locality refers to the reuse of specific data and/or resources within a relatively small time duration.
> Temporal locality is a special case of spatial locality, namely when the prospective location is identical to the present location.

---

## 도입

"방금 본 데이터를 곧 또 본다"는 단순한 경향이 temporal locality. 이걸 알면 캐시 동작이 한 번에 이해됩니다 — "최근에 쓴 거니까 잠깐 빠른 곳에 두자". for 루프 변수, 자주 쓰는 객체 참조 모두 이 패턴의 일상적 사례.

---

## 본문

> Temporal locality refers to the reuse of specific data and/or resources within a relatively small time duration.

Temporal locality는 비교적 짧은 시간 안에 특정 데이터/자원을 재사용하는 것을 의미한다.

- **temporal**: 시간적인. 시간 차원의 지역성.
- **reuse of specific data**: 특정 데이터를 다시 사용. 새 데이터가 아니라 같은 데이터.
- **within a relatively small time duration**: 짧은 시간 안에. 핵심은 "곧" — 1ms 후일 수도, 1초 후일 수도 있지만 하여튼 빠른 시간 안에 재접근.

> Temporal locality is a special case of spatial locality, namely when the prospective location is identical to the present location.

Temporal locality는 spatial locality의 특수한 경우로, 즉 미래 위치가 현재 위치와 동일한 경우다.

- **special case of spatial locality**: spatial의 특수 케이스. spatial이 "가까운 위치"라면, temporal은 "거리 0"인 케이스.
- **prospective location**: 앞으로 접근할 위치(미래의 접근).
- **identical to the present location**: 지금 접근한 위치와 똑같음. 같은 주소를 또 접근하는 것이니 거리 0의 spatial locality.

---

## 종합

temporal locality의 일상적 사례:

- **for 루프 카운터 `i`**: 매 반복마다 읽고 1 증가시켜 다시 쓰기. 같은 메모리 위치를 1억 번도 반복.
- **함수의 지역 변수**: 함수 안에서 여러 번 참조되는 변수.
- **자주 쓰이는 객체 참조**: `const config = { ... }`을 만들고 여러 곳에서 `config.x`를 읽으면 그 객체의 메모리 영역이 hot.

JS 예시:

```js
function sumArray(arr) {
  let sum = 0;            // sum: 매 반복마다 read/write → 강한 temporal locality
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];        // i, sum, arr.length: 모두 temporal
  }
  return sum;
}
```

`sum`은 1억 번 반복되어도 같은 메모리 위치에 머무릅니다. CPU 입장에서는 "이 주소를 또 읽네, 그럼 캐시(L1)에 둬야지" — 사실 V8이 영리하게 짜여서 `sum`을 레지스터에 고정해버리는 경우가 많습니다. 메모리에 갈 필요조차 없죠.

활용 메커니즘:

| 단계 | 무엇이 일어나는가 |
|---|---|
| 첫 접근 | RAM에서 캐시로 데이터 끌어올림(느림) |
| 곧 두 번째 접근 | 캐시에서 즉시 응답(매우 빠름) — temporal locality의 이득 실현 |
| 캐시 교체 정책 | LRU 등 — "최근 안 쓰인 것부터 밀어냄" — temporal 패턴을 직접 이용 |

| 메모리 계층 | 접근 시간 | temporal locality가 좋을 때의 이점 |
|---|---|---|
| 레지스터 | < 1ns | 변수가 레지스터에 고정되면 사실상 무료 |
| L1 캐시 | ~1ns | 매번 거의 즉시 |
| L2/L3 | 수~수십 ns | 그래도 RAM보다 10배 빠름 |
| RAM | ~100ns | temporal 안 좋으면 매번 이 비용 |

이게 없으면 어떻게 되는가: 프로그램이 같은 메모리를 절대 두 번 안 쓴다면, 캐시는 한 번 들어왔다가 나가버리는 컨베이어가 됩니다. 사실상 캐시 효과 0 — 모든 접근이 RAM 직행. 다행히 실제 프로그램은 매우 강한 temporal locality를 가져서 캐시가 의미 있는 것.

오개념 예방: "지역 변수는 temporal locality가 있고 전역 변수는 없다"는 부정확. 위치(스택/힙/데이터)가 아니라 접근 패턴이 결정합니다. 자주 읽는 전역 객체도 temporal 강할 수 있고, 한 번만 쓰고 버리는 지역 변수는 temporal이 약함. 코드의 사용 패턴을 봐야 함.

Official Annotation 보충: temporal locality가 강하면 "이 데이터 사본을 더 빠른 메모리에 둬서 다음 접근의 지연을 줄이자"는 노력이 자연스럽게 정당화됩니다. 캐시의 존재 이유 그 자체.

AI Annotation 보충: for 루프 카운터 변수가 temporal locality의 교과서 사례라는 게 직관에 잘 맞습니다 — 코드 한 줄(`i++`)로 1억 번 같은 메모리를 건드리니, 이 패턴 없이는 빠른 루프가 성립하지 않습니다.

---

# Spatial locality란 무엇인가?

> Spatial locality (also termed data locality) refers to the use of data elements within relatively close storage locations.

---

## 도입

"이 주소를 봤다면 그 주변도 곧 볼 가능성이 높다" — 이게 spatial locality. 배열 순회가 가장 직관적인 예시입니다. `arr[0]`을 읽었다면 `arr[1]`, `arr[2]`도 곧 읽을 가능성이 매우 높죠. CPU와 캐시는 이 패턴을 적극 활용해, 한 주소를 가져올 때 인접 메모리를 통째로 끌어옵니다.

---

## 본문

> Spatial locality (also termed data locality) refers to the use of data elements within relatively close storage locations.

Spatial locality(데이터 지역성이라고도 함)는 비교적 가까운 저장 위치 안에 있는 데이터 요소들을 사용하는 것을 의미한다.

- **spatial**: 공간적인. 메모리 주소 공간 차원의 지역성.
- **data locality**: 동의어. 같은 개념을 다른 시각(데이터 차원)에서 부르는 명칭.
- **data elements**: 메모리에 저장된 데이터 항목들. 변수·배열 원소·구조체 필드 등.
- **relatively close storage locations**: 비교적 가까운 저장 위치들. 메모리 주소 차이가 작은 것들.

---

## 종합

spatial locality의 일상적 사례:

- **배열 순차 순회**: `arr[0]`, `arr[1]`, `arr[2]`... 를 차례로 읽기. 인접 주소.
- **구조체/객체 필드 접근**: `obj.x`, `obj.y`, `obj.z`를 차례로 읽기. 같은 객체의 필드는 메모리상 가까이 배치됨.
- **함수 명령어 실행**: 함수의 코드는 메모리에 연속으로 저장되니, 명령어 fetch 자체가 spatial.

CPU/캐시가 이를 활용하는 방식 — 캐시 라인:

```
배열 메모리 (1바이트 = 1칸):
[arr[0]][arr[1]][arr[2]] ... [arr[15]] ← 64바이트 캐시 라인 1개
                                         (보통 16개의 4바이트 정수 묶음)
```

`arr[0]`을 처음 접근하면 캐시는 **그 한 바이트만 가져오는 게 아니라**, 64바이트(캐시 라인 단위)를 통째로 끌어옵니다. 그래서 다음에 `arr[1]`, `arr[2]`...를 접근할 때 이미 캐시에 있어 즉시 응답. spatial locality의 자연스러운 활용.

JS 코드 예시:

```js
const arr = new Array(1000).fill(1);
let sum = 0;

// 빠름 — 순차 접근, spatial locality 매우 좋음
for (let i = 0; i < arr.length; i++) sum += arr[i];

// 느릴 수 있음 — 무작위 인덱스, spatial locality 약함
for (let i = 0; i < arr.length; i++) sum += arr[Math.floor(Math.random() * arr.length)];
```

- 첫 루프: `arr[i]`가 순차적이라 캐시 라인 1개당 16개 정수를 같이 가져와 16번 사용. 캐시 미스 1번 / 히트 15번 패턴.
- 둘째 루프: 인덱스가 무작위라 매번 다른 캐시 라인을 가져와야 함. 거의 매번 캐시 미스.

알고리즘에 미치는 영향:

| 자료구조 | spatial locality |
|---|---|
| 배열 (Array) | 매우 좋음 — 인접 메모리에 연속 배치 |
| 연결 리스트 (Linked List) | 나쁨 — 노드들이 힙 여기저기에 흩어짐 |
| 객체 필드 | 보통 — 같은 객체 안 필드들은 가까움 |
| 해시맵 키 순회 | 보통 — 키 분포에 따라 다름 |

대표적인 trade-off: 연결 리스트는 삽입/삭제가 O(1)이라는 장점이 있지만, 순회할 때 spatial locality가 끔찍해 실제 성능은 배열 + memmove보다 느린 경우가 많습니다. 이론적 시간복잡도와 실제 캐시 효율이 다른 답을 주는 사례.

이게 없으면 어떻게 되는가 — 프로그램이 spatial locality 없이 메모리를 무작위로 읽는다면: 캐시 라인 단위 가져오기가 무용지물. 64바이트를 끌어와도 1바이트만 쓰고 버리니 효율 1/64. RAM 대역폭만 낭비. 현대 CPU 성능 모델이 무너집니다.

오개념 예방: "JS의 배열은 진짜 연속 메모리가 아니라 객체"이긴 합니다. V8 같은 엔진은 가능하면 fast elements(연속 메모리 배열)로 최적화하지만, 배열에 다양한 타입이 섞이거나 hole이 생기면 dictionary 모드로 전환해 spatial locality가 약해집니다. 그래서 "타입 일관성"·"hole 만들지 않기"가 V8 성능 가이드의 단골 항목.

AI Annotation 보충: CPU는 cache line 단위(보통 64바이트)로 메모리를 가져오므로, `arr[0]`을 읽는 비용이 사실상 `arr[0..15]`(int32 기준)을 읽는 비용과 같습니다. 인접 데이터를 함께 쓰지 않으면 그 추가 데이터는 그냥 낭비된 셈. 자료구조와 순회 패턴 설계 시 이 사실을 기억하면 캐시 친화적 코드를 자연스럽게 짜게 됩니다.

---

# Sequential locality란 무엇인가?

> Sequential locality, a special case of spatial locality, occurs when data elements are arranged and accessed linearly, such as traversing the elements in a one-dimensional array.

---

## 도입

spatial locality가 "가까운 곳을 본다"라면, sequential locality는 "쭉 일렬로 본다"는 더 강한 패턴입니다. 1차원 배열을 처음부터 끝까지 순회하는 게 정확히 이 케이스. CPU 입장에서는 "다음에 어디 갈지" 정확히 예측 가능하니, 미리 캐시에 끌어오는(prefetch) 최적화까지 적용할 수 있습니다.

---

## 본문

> Sequential locality, a special case of spatial locality,

Sequential locality는 spatial locality의 특수한 경우로,

- **special case of spatial locality**: spatial의 한정적 형태. spatial은 "가까운"이지만 sequential은 "선형으로 이어지는".

> occurs when data elements are arranged and accessed linearly,

데이터 요소들이 선형으로 배치되고 접근될 때 발생한다.

- **arranged ... linearly**: 메모리상 선형으로 배치. 1번지, 2번지, 3번지... 식으로 일렬.
- **accessed linearly**: 그 순서대로 접근. 1번지 → 2번지 → 3번지...
- **arranged AND accessed linearly**: 둘 다 선형이어야 sequential. 배치가 선형이어도 무작위 접근이면 sequential 아님.

> such as traversing the elements in a one-dimensional array.

예를 들어 1차원 배열의 요소를 순회하는 것처럼.

- **traversing**: 처음부터 끝까지(또는 끝에서 처음까지) 차례로 방문.
- **one-dimensional array**: 1차원 배열. 메모리 배치가 가장 명확하게 선형.

---

## 종합

세 종류의 지역성을 한 줄에 비교:

| 종류 | 패턴 | 예시 |
|---|---|---|
| Temporal | 같은 주소를 또 본다 | 루프 카운터, sum 누적 변수 |
| Spatial | 가까운 주소를 본다 | 객체 필드 묶음 접근 |
| Sequential | 일렬로 다음 주소를 본다 | `arr[0]`, `arr[1]`, `arr[2]`... |

JS 예시 — sequential의 전형:

```js
const arr = new Array(1_000_000);
for (let i = 0; i < arr.length; i++) {
  arr[i] = i * 2;  // arr[0] → arr[1] → arr[2] → ... 완벽한 sequential
}
```

CPU의 prefetch 메커니즘 활용: CPU는 "이 프로그램이 sequential하게 진행 중이다"를 감지하면, 사용자가 요청하기 전에 다음 캐시 라인을 미리 RAM에서 끌어옵니다. 그래서 sequential 접근에서는 캐시 미스가 거의 없거나, 미스가 나더라도 latency가 prefetch로 가려져서 사실상 latency 0처럼 보입니다.

| 패턴 | 캐시 미스율 | 비고 |
|---|---|---|
| Sequential 순회 | 매우 낮음 | prefetch까지 작동, 거의 hit |
| Random 순회 | 매우 높음 | prefetch 무효 |
| Reverse sequential | 낮음 | 일부 CPU는 역방향 prefetch도 지원 |
| Stride 순회 (e.g., 매 16번째) | 낮음~중간 | stride prefetcher가 인지 |

sequential locality가 깨지는 함정:

- **2D 배열의 잘못된 순회 방향**: `arr[i][j]`를 행/열 순서를 바꿔 순회하면, 메모리상 sequential이 아니라 띄엄띄엄 점프. 같은 알고리즘도 10배 차이.
- **JS 배열에 sparse element**: `arr = [1,,,4]`처럼 hole이 있으면 V8이 dictionary 모드로 바꿔 메모리 배치가 선형이 아니게 됨.
- **링크드 리스트 순회**: 노드 간 포인터가 메모리 무작위 위치를 가리켜 sequential 안 됨.

이게 없으면 어떻게 되는가 — 프로그램이 sequential 패턴을 안 쓴다면: prefetch가 무용지물. 캐시 미스를 가릴 길이 없으니 RAM latency(100ns)가 매번 노출. 거대 데이터 처리 작업(이미지 처리, 통계 계산, 머신러닝)이 사실상 RAM 속도에 묶임. 실제 프로그램들이 sequential 패턴을 자주 쓰기 때문에 RAM-CPU 속도 격차에도 우리가 빠르게 일할 수 있는 것.

오개념 예방: "sequential locality는 자동으로 보장되지 않나?"는 부분적으로만 맞습니다. 자료구조 선택과 순회 순서가 결정합니다. 같은 데이터를 처리해도 sequential 친화적으로 짜면 단숨에 빨라지죠. 예: 전치(transpose) 후 순회, row-major 정렬 유지, 청크 단위 처리 등.

활용 팁:

- 큰 배열을 처리할 때 **항상 인덱스 증가 방향으로** 순회.
- 2D 배열은 **행 우선 언어(JS, C, Python)에서 row-major로 순회**.
- **링크드 리스트보다 배열**을 우선 고려 (특히 순회 위주 작업).
- typed array(`Int32Array`, `Float64Array`)는 V8이 진짜 연속 메모리로 만들어주니 sequential locality가 강함.

JS의 typed array는 머신러닝·이미지 처리 같은 sequential 의존 작업에서 일반 배열보다 성능이 크게 나옵니다 — 단순히 "타입이 명시되어서"가 아니라, 메모리 배치가 진짜 선형이라 CPU prefetch까지 잘 먹혀서.

---

# 캐시가 locality of reference를 활용하는 방식은?

> A cache is a simple example of exploiting temporal locality, because it is a specially designed, faster but smaller memory area, generally used to keep recently referenced data and data near recently referenced data, which can lead to potential performance increases.
> Temporal locality plays a role on the lowest level, since results that are referenced very closely together can be kept in the machine registers.

---

## 도입

캐시는 "Locality of Reference 원칙을 그대로 하드웨어로 구현한 것"이라 봐도 됩니다. 최근 참조한 데이터(temporal)와 그 주변 데이터(spatial)를 작지만 빠른 영역에 둬서 다음 접근을 빠르게. 이번 질문은 그 활용 방식을 두 측면(temporal + spatial)에서 살펴봅니다.

---

## 본문

> A cache is a simple example of exploiting temporal locality,

캐시는 temporal locality를 활용하는 단순한 예시이며,

- **simple example of exploiting temporal locality**: 가장 직관적인 응용. "최근에 본 거 또 본다"는 가정 위에 만들어짐.

> because it is a specially designed, faster but smaller memory area,

특별히 설계된, 더 빠르지만 더 작은 메모리 영역이기 때문이다.

- **specially designed**: 일반 RAM과 다르게 의도적으로 빠르게 만든 메모리. SRAM 같은 고속 메모리.
- **faster but smaller**: 빠름과 작음의 트레이드오프. 큰 빠른 메모리는 비싸 만들기 어려움.

> generally used to keep recently referenced data

일반적으로 최근에 참조된 데이터를 보관하는 데 사용된다.

- **recently referenced data**: 최근 참조 데이터 — temporal locality 그대로. "최근 봤으니 곧 또 볼 거다"라는 베팅.

> and data near recently referenced data,

그리고 최근 참조된 데이터의 인접 데이터.

- **data near recently referenced data**: 최근 참조 데이터 근처 — spatial locality. 한 주소를 가져올 때 인접 64바이트(캐시 라인)를 통째로.

> which can lead to potential performance increases.

이는 잠재적 성능 향상으로 이어질 수 있다.

- **potential performance increases**: 잠재적 — locality가 좋은 코드면 큰 향상, 나쁜 코드면 효과 적음. 보장이 아니라 가능성.

> Temporal locality plays a role on the lowest level,

Temporal locality는 가장 낮은(가장 빠른) 레벨에서도 역할을 한다.

- **lowest level**: 메모리 계층의 맨 위 — 레지스터 레벨. "낮은 레벨"이 빠른 쪽을 가리키는 표현(메모리 계층에서는 위/아래가 표현마다 반대일 수 있음에 주의).

> since results that are referenced very closely together can be kept in the machine registers.

매우 가깝게 참조되는 결과들은 머신 레지스터에 보관될 수 있기 때문이다.

- **referenced very closely together**: 시간적으로 매우 가까운 참조. 같은 코드 줄·같은 함수 안에서 연속 참조.
- **machine registers**: CPU 안 가장 빠른 저장소. 컴파일러/JIT가 자주 쓰는 변수를 레지스터에 고정.

---

## 종합

캐시가 두 종류 locality를 모두 활용하는 방식:

| Locality 종류 | 캐시의 활용 방식 |
|---|---|
| Temporal | 한번 캐시에 들어온 데이터는 일정 시간 머무름. LRU 같은 교체 정책으로 "최근 안 쓰인 것" 우선 추방 |
| Spatial | 한 바이트가 아니라 캐시 라인(보통 64바이트) 단위로 가져옴. 인접 데이터 자동 동반 |

레벨별로 어떻게 적용되는지:

| 레벨 | Locality 활용 |
|---|---|
| CPU 레지스터 | 매우 자주 쓰이는 변수 보관 (extreme temporal) |
| L1 캐시 | 최근 사용한 데이터 + 인접 데이터 |
| L2/L3 캐시 | L1보다 더 큰 윈도우의 최근/인접 데이터 |
| RAM | 캐시에 못 들어간 데이터의 본거지 |
| 디스크 | OS의 페이지 캐시도 같은 원리로 작동 |

JS 사례:

```js
function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];   // a[i], b[i]: spatial. sum, i: temporal
  }
  return sum;
}
```

이 함수가 실행될 때:

- `sum`, `i`: 매 반복마다 read/write — V8이 거의 확실히 레지스터에 고정 (extreme temporal locality 활용).
- `a[i]`, `b[i]`: 순차 접근 — 캐시 라인 단위 fetch로 다음 인접 원소까지 자동 캐시 (spatial locality 활용).
- 결과: 1억 원소 dot product도 매우 빠름.

만약 `a[Math.random()*length]`처럼 무작위 인덱스로 바꿨다면 spatial locality가 깨져 같은 작업이 10배 이상 느려질 수 있습니다. 알고리즘은 동일한데 캐시 친화도가 성능을 가르는 것.

이게 없으면 어떻게 되는가 — 캐시가 두 locality를 활용 안 한다면:

- **temporal 무시**: 매 접근마다 RAM에서 새로 읽어옴. for 루프 변수도 매번 RAM 왕복 — CPU가 거의 노는 상태.
- **spatial 무시**: 캐시 라인 단위가 아니라 1바이트씩 가져옴. 한 번 미스 비용이 그대로 노출. 배열 순회가 매우 느려짐.

두 가지를 같이 활용하기 때문에 현실적인 캐시 hit ratio가 90%대가 나오고, 평균 메모리 접근 시간이 RAM 단독 시의 10분의 1 이하로 떨어집니다.

오개념 예방: "캐시 = temporal만 활용"은 부정확. 캐시 라인 단위 가져오기가 spatial locality 활용 그 자체. 두 측면이 동시에 작동해야 캐시가 효과적입니다.

Official Annotation 보충: 데이터는 cache line 단위로 캐시에 들어옵니다. 한 원소를 참조했을 때 인접 원소들도 함께 캐시에 — spatial locality가 자동 활용되는 메커니즘. 한 바이트만 가져오는 게 아니라는 점이 spatial locality 활용의 핵심.

레지스터 활용의 의미: V8 같은 JIT 컴파일러가 "이 변수는 이 함수 안에서 매우 자주 쓰인다"고 판단하면 레지스터에 고정합니다. 이건 캐시조차 우회하는 가장 빠른 길 — 메모리에 갈 필요조차 없으니까. 함수 핫패스에서는 작은 변수를 많이 쓰는 게 큰 객체를 적게 쓰는 것보다 빠를 수 있는 이유.

---

# 캐시에 저장된 데이터는 메인 메모리에서 공간적으로 가까운 데이터끼리 모여있는가?

> Data elements in a cache do not necessarily correspond to data elements that are spatially close in the main memory; however, data elements are brought into cache one cache line at a time.

---

## 도입

직관적으로 "캐시 = 메인 메모리의 가까운 영역을 한 덩어리 복사한 것"이라고 생각하기 쉽습니다. 사실 정답은 둘 다 맞고 둘 다 틀려요 — 캐시 라인 안에서는 가깝지만, 캐시 전체로 보면 메인 메모리의 멀리 떨어진 영역들이 섞여 있습니다.

---

## 본문

> Data elements in a cache do not necessarily correspond to data elements that are spatially close in the main memory;

캐시 안의 데이터 요소들이 반드시 메인 메모리에서 공간적으로 가까운 데이터 요소들에 대응하는 것은 아니다.

- **do not necessarily correspond**: 반드시 그렇지는 않음. 캐시 전체가 메인 메모리의 한 영역을 통째로 옮긴 게 아니라는 뜻.
- **spatially close in the main memory**: 메인 메모리상 가까이 있음. 캐시에 들어온 항목들은 메인 메모리에서는 서로 멀리 떨어져 있을 수 있음.

> however, data elements are brought into cache one cache line at a time.

그러나 데이터 요소들은 한 번에 한 캐시 라인 단위로 캐시에 들어온다.

- **brought into cache**: 캐시로 끌어올림. RAM → 캐시 방향.
- **one cache line at a time**: 한 번에 캐시 라인 1개. 즉, 인접한 64바이트(보통)를 함께. 한 바이트만 가져오지는 않음.

---

## 종합

이 말의 정확한 의미:

| 관점 | 답 |
|---|---|
| 캐시 라인 1개 안에서 | 메인 메모리의 인접 영역(보통 64바이트)이 통째로 들어옴 → 가까움 |
| 캐시 전체로 보면 | 여러 캐시 라인이 메인 메모리의 다양한 영역에서 끌려와 섞여 있음 → 멀리 떨어진 영역도 함께 존재 |

그림으로:

```
메인 메모리:
[영역 A ────] ... [영역 B ────] ... [영역 C ────]

캐시 (예: 32KB L1):
[A의 일부 64B][B의 일부 64B][C의 일부 64B]...
   캐시 라인     캐시 라인     캐시 라인
```

캐시는 "여러 영역의 캐시 라인이 모인 작업장"입니다. 라인 안은 인접하지만, 라인끼리는 메인 메모리 어디서 왔는지 무관.

JS 예시:

```js
function process(arr1, arr2) {
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += arr1[i] + arr2[i];
  }
  return sum;
}
```

`arr1`과 `arr2`는 메인 메모리에서 멀리 떨어진 영역에 있을 수 있습니다(서로 다른 시점에 할당됐을 테니). 그래도 캐시는 둘의 일부를 동시에 담아둘 수 있습니다 — `arr1`의 64바이트, `arr2`의 64바이트가 캐시의 다른 라인에 들어간 형태. 메인 메모리상으로는 멀어도, 캐시 안에서는 같이 살아갑니다.

이게 의미하는 것:

- **여러 자료구조를 동시에 핫하게 쓰는 게 가능**: 한 함수가 여러 배열·객체를 다뤄도, 각각의 자주 쓰는 부분이 캐시 라인으로 들어와 공존 가능.
- **단, 캐시 크기 한계가 있음**: 너무 많은 영역의 라인을 동시에 끌어오면 서로를 밀어냄(eviction). working set이 캐시 크기보다 커지면 thrashing 발생.
- **연관성(associativity) 제약**: 실제 캐시는 어떤 메모리 주소가 캐시의 어느 슬롯에 들어갈 수 있는지 규칙이 있어, 이론상 캐시에 자리가 있어도 들어가지 못하는 경우도 있음. 이건 더 깊이 들어가는 주제.

| 잘못된 직관 | 정확한 사실 |
|---|---|
| 캐시 = 메인 메모리의 한 영역 통째 복사 | 캐시 = 여러 영역의 캐시 라인 모음 |
| 캐시에 있으면 메인 메모리에서도 인접 | 같은 라인 안에서만 인접, 라인 간에는 무관 |

이게 없으면 어떻게 되는가 — 만약 캐시가 메인 메모리의 한 영역만 통째로 담을 수 있다면: 두 배열을 동시에 다루는 작업이 사실상 불가능. `arr1`을 캐시에 올리면 `arr2`는 캐시에 못 들어가고, `arr2`를 처리하려면 `arr1`을 통째 비워야 함. 실제로는 캐시가 라인 단위 모음이라서 다양한 데이터를 동시에 hot하게 쓸 수 있습니다.

오개념 예방: "캐시에 같이 있다면 메인 메모리에서도 가까이 있다"는 잘못된 추론. 캐시 안의 두 라인은 메인 메모리상 GB 단위로 떨어져 있을 수 있습니다. 다만 한 라인 안의 64바이트는 항상 메인 메모리에서 인접 64바이트.

활용 팁: "Cache-friendly"한 자료구조는 자주 같이 쓰는 데이터를 메모리상 인접 배치하는 것. 객체의 핫필드들을 가까이 두기, 배열 of 객체보다 객체 of 배열(SoA, Structure of Arrays) 패턴이 효율적인 경우 등 — 모두 캐시 라인 단위로 효율을 최대화하려는 시도.
