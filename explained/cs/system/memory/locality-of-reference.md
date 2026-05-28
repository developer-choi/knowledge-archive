# Locality of reference(참조 지역성)란 무엇인가?

## 도입

캐시메모리가 효과를 발휘하려면 CPU가 조만간 사용할 데이터를 미리 캐시에 올려둬야 한다. 그런데 CPU는 어떻게 앞으로 무엇이 필요할지 예측할 수 있을까? 비밀은 "프로세서가 짧은 시간 안에 같은 메모리 위치를 반복해서 접근하는 경향이 있다"는 실증적 사실에 있다. 이것이 참조 지역성(Locality of Reference)이다.

---

## 본문

> In computer science, locality of reference, also known as the principle of locality, is the tendency of a processor to access the same set of memory locations repetitively over a short period of time.

"컴퓨터 과학에서, 참조 지역성은 프로세서가 짧은 시간 안에 같은 메모리 위치 집합을 반복적으로 접근하는 경향을 말한다."

- **tendency**: "경향". 법칙이 아니라 통계적 패턴이다. 모든 프로그램에 항상 성립하는 것은 아니지만, 실제 프로그램의 대다수가 이 패턴을 따른다.
- **repetitively**: 반복적으로. 한 번 접근한 위치를 곧 다시 접근하거나, 인접한 위치를 이어서 접근한다.
- **over a short period of time**: "짧은 시간 안에". 예측이 유효한 시간 범위가 좁다. 시간이 지나면 접근 패턴이 달라지기 때문이다.

> There are two basic types of reference locality – temporal and spatial locality.

"참조 지역성에는 두 가지 기본 유형이 있다 — 시간 지역성과 공간 지역성."

> Locality is a type of predictable behavior that occurs in computer systems.

"지역성은 컴퓨터 시스템에서 발생하는 예측 가능한 동작의 한 유형이다."

- **predictable behavior**: 이 단어가 핵심이다. 지역성은 캐시가 "무엇을 미리 올려둘지" 예측할 수 있게 해주는 근거다. 예측 불가능한 랜덤 접근 패턴이라면 캐시는 효과가 없다.

---

## 종합

지역성이 없다면 캐시는 운에 의존하는 기믹이 되어버린다. 실제 프로그램에서 for 루프가 같은 배열을 수백 번 순회하거나, 함수 내 지역 변수를 반복 사용하는 패턴이 지역성의 구체적 발현이다. V8이 자주 실행되는 코드를 JIT 컴파일해 최적화하는 것도 "시간 지역성이 높은 코드는 계속 실행된다"는 가정 위에 있다. 지역성 덕분에 하드웨어 캐시는 예측적으로 데이터를 선적재(prefetch)할 수 있고, 이것이 현대 CPU 성능의 상당 부분을 차지한다.

---

---

# Temporal locality란 무엇인가?

## 도입

두 가지 지역성 중 첫 번째가 시간 지역성이다. "한 번 사용한 데이터는 곧 다시 사용될 가능성이 높다"는 패턴이다. for 루프의 반복 카운터가 가장 직관적인 예다.

---

## 본문

> Temporal locality refers to the reuse of specific data and/or resources within a relatively small time duration.

"시간 지역성은 비교적 짧은 시간 안에 특정 데이터나 자원이 재사용되는 것을 말한다."

- **reuse**: 핵심 단어. 새로운 데이터에 접근하는 것이 아니라, 이미 접근했던 것을 다시 접근한다.
- **relatively small time duration**: "비교적 짧은 시간". 나노초~마이크로초 단위를 의미한다. 프로그램 시작부터 끝까지가 아니라 실행의 국소적 구간 안에서 반복된다.

> Temporal locality is a special case of spatial locality, namely when the prospective location is identical to the present location.

"시간 지역성은 공간 지역성의 특수한 케이스로, 예상되는 위치가 현재 위치와 동일한 경우다."

> In this case it is common to make efforts to store a copy of the referenced data in faster memory storage, to reduce the latency of subsequent references.

"이 경우 이후 참조의 지연을 줄이기 위해, 참조된 데이터의 복사본을 더 빠른 메모리 저장소에 보관하는 것이 일반적이다."

- **subsequent references**: "이후의 참조들". 곧 또 쓸 것을 알기 때문에 캐시에 올려두는 것이 합리적이다.

**JS 비유:** `for (let i = 0; i < 1000000; i++)` 에서 변수 `i`는 매 반복마다 읽고 쓴다. `i`는 시간 지역성이 극도로 높은 데이터다. CPU는 `i`를 레지스터나 L1 캐시에 올려두고 매번 RAM까지 가지 않는다.

---

## 종합

시간 지역성이 없는 프로그램, 예를 들어 매번 완전히 다른 메모리 위치에 랜덤하게 접근하는 코드는 캐시의 도움을 거의 받지 못한다. 반대로 루프 안에서 같은 변수를 집중적으로 사용하는 코드는 시간 지역성이 높아 캐시 히트율이 높고 실행이 빠르다. 성능 최적화에서 "핫 패스(hot path)의 데이터를 캐시에 유지하라"는 조언이 바로 이 원리를 활용하는 것이다.

---

---

# Spatial locality란 무엇인가?

## 도입

두 번째 지역성은 공간 지역성이다. "지금 접근한 위치 근처의 데이터도 곧 사용될 가능성이 높다"는 패턴이다. 배열을 순서대로 순회하는 코드가 전형적인 예다.

---

## 본문

> Spatial locality (also termed data locality) refers to the use of data elements within relatively close storage locations.

"공간 지역성(데이터 지역성이라고도 함)은 서로 비교적 가까운 저장 위치에 있는 데이터 요소들이 사용되는 것을 말한다."

- **relatively close storage locations**: 메모리 주소상 가까운 위치. 물리적 거리가 아니라 주소값의 차이가 작음을 의미한다.

**AI Annotation**: 배열 `arr[0]`을 읽으면 `arr[1]`, `arr[2]`도 곧 읽을 가능성이 높다. CPU는 이를 이용해 cache line 단위(보통 64바이트)로 인접 데이터를 함께 가져온다.

```
메모리 (연속된 주소)
[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]]...
    ↑ 접근 시 ──────────────────────────→
              이 범위(cache line)를 통째로 캐시에 로드
```

**JS 비유:** `arr.forEach(item => ...)` 로 배열을 순회하면 메모리상 연속된 위치를 순서대로 읽는다. 공간 지역성이 높아 캐시가 잘 작동한다. 반면 연결 리스트(linked list)는 다음 노드가 메모리상 멀리 있을 수 있어 공간 지역성이 낮다.

---

## 종합

공간 지역성 덕분에 CPU는 하나의 데이터 요소를 요청받았을 때 인접한 데이터까지 통째로 캐시에 올려둔다(cache line 단위 로드). 이것이 배열 순회가 연결 리스트 순회보다 빠른 근본 이유다. `Array.map()`이 `LinkedList.map()`보다 빠른 것은 JS 엔진의 최적화만의 공이 아니라 하드웨어 캐시의 공간 지역성 활용도 큰 역할을 한다.

---

---

# Sequential locality란 무엇인가?

## 도입

공간 지역성의 특수한 경우로, 데이터가 순서대로 배치되어 있고 순서대로 접근하는 패턴이 있다. 이것이 순차 지역성이다.

---

## 본문

> Sequential locality, a special case of spatial locality, occurs when data elements are arranged and accessed linearly, such as traversing the elements in a one-dimensional array.

"순차 지역성은 공간 지역성의 특수한 케이스로, 1차원 배열의 요소를 순회하는 것처럼 데이터 요소들이 선형으로 배치되어 있고 선형으로 접근될 때 발생한다."

- **arranged and accessed linearly**: 배치와 접근이 모두 선형(순서대로)이어야 한다. 배열처럼 메모리에 순서대로 저장되어 있고, `for` 루프로 `[0], [1], [2]...` 순서대로 읽는 것이 전형적이다.
- **special case of spatial locality**: 순차 지역성은 "항상 다음 인접 위치를 접근"하는 강한 공간 지역성이다. 일반 공간 지역성보다 예측이 더 쉽다.

---

## 종합

순차 지역성은 CPU의 하드웨어 프리페처(prefetcher)가 가장 잘 활용하는 패턴이다. 배열을 `for` 루프로 순회하면 프리페처가 패턴을 감지하고 다음 cache line을 미리 읽어두기 때문에 실질적인 접근 지연이 거의 없다. 문자열 처리, 버퍼 복사, 파일 스트림 읽기 등 대부분의 저수준 입출력 연산이 이 패턴에 해당한다.

---

---

# 캐시가 locality of reference를 활용하는 방식은?

## 도입

지역성은 이론적 관찰이고, 캐시는 그것을 실제로 활용하는 하드웨어 장치다. 캐시가 구체적으로 지역성의 두 유형을 어떻게 이용하는지를 이해하면 캐시가 왜 효과적인지가 명확해진다.

---

## 본문

> A cache is a simple example of exploiting temporal locality, because it is a specially designed, faster but smaller memory area, generally used to keep recently referenced data and data near recently referenced data, which can lead to potential performance increases.

"캐시는 시간 지역성을 활용하는 단순한 예다. 최근에 참조된 데이터와 그 근처 데이터를 보관하는 데 사용되는, 특별히 설계된 더 빠르고 작은 메모리 영역으로서, 잠재적인 성능 향상을 가져올 수 있다."

- **exploiting temporal locality**: 시간 지역성을 "이용"한다. 최근에 사용된 데이터를 빠른 캐시에 유지하면, 곧 다시 쓸 때 빠르게 제공할 수 있다.
- **recently referenced data**: 최근에 참조된 데이터. 캐시 교체 정책(LRU 등)이 "최근에 사용된 것을 유지"하는 방식으로 이 원리를 구현한다.

> Temporal locality plays a role on the lowest level, since results that are referenced very closely together can be kept in the machine registers.

"시간 지역성은 가장 낮은 수준(레지스터)에서도 역할을 한다. 매우 가까운 시간 안에 참조되는 결과들은 기계 레지스터에 보관될 수 있기 때문이다."

> Data elements are brought into cache one cache line at a time. This means that spatial locality is again important: if one element is referenced, a few neighboring elements will also be brought into cache.

"데이터 요소들은 한 번에 캐시 라인 하나씩 캐시로 가져온다. 이는 공간 지역성이 다시 중요해진다는 의미다: 하나의 요소가 참조되면, 몇 가지 인접한 요소들도 캐시로 가져온다."

- **cache line**: 캐시가 RAM에서 데이터를 가져오는 최소 단위. 보통 64바이트. `arr[0]` 하나만 요청해도 `arr[0]`~`arr[7]`(64바이트)이 통째로 캐시에 올라온다.

---

## 종합

캐시는 시간 지역성으로 "최근 사용 데이터를 가까이 보관"하고, 공간 지역성으로 "요청된 데이터 주변까지 통째로 미리 가져온다". 이 두 전략의 조합이 캐시의 실질적 효과다. `arr.map(fn)` 이 빠른 이유는 fn이 반복 호출되는 시간 지역성과, 배열 요소가 연속 메모리에 있는 공간 지역성이 동시에 작동하기 때문이다.

---

---

# 캐시에 저장된 데이터는 메인 메모리에서 공간적으로 가까운 데이터끼리 모여있는가?

## 도입

캐시에 올라온 데이터들이 원래 RAM에서 서로 붙어 있는 데이터들일 것 같지만, 실제로는 반드시 그렇지 않다. 캐시 라인 단위 로드와 캐시 내부 배치는 별개의 문제다.

---

## 본문

> Data elements in a cache do not necessarily correspond to data elements that are spatially close in the main memory; however, data elements are brought into cache one cache line at a time.

"캐시 안의 데이터 요소들은 메인 메모리에서 공간적으로 가까운 데이터 요소들과 반드시 일치하지는 않는다. 다만, 데이터 요소들은 한 번에 캐시 라인 하나씩 캐시로 가져온다."

- **do not necessarily correspond**: "반드시 일치하지는 않는다". 캐시는 RAM의 특정 범위를 통째로 미러링하는 것이 아니라, 최근 접근된 캐시 라인들을 집합적으로 보관한다. 배열의 첫 번째 요소와 전혀 다른 변수가 같은 캐시에 공존할 수 있다.
- **one cache line at a time**: 캐시 로드의 최소 단위는 캐시 라인(보통 64바이트)이다. RAM에서 1바이트만 필요해도 64바이트가 캐시에 올라온다.

```
RAM (원래 메모리)
[0x100: arr[0~7]]  [0x1000: obj.name]  [0x2000: i변수]
                      ↓ 각각 개별적으로 캐시에 올라올 수 있음
캐시
[cache line A: arr[0~7]]
[cache line B: obj.name 주변 64B]
[cache line C: i변수 주변 64B]
```

---

## 종합

캐시는 RAM의 연속된 공간을 그대로 복사하는 것이 아니라, 접근 패턴에 따라 서로 다른 위치의 cache line들을 선택적으로 보관하는 구조다. 배열의 앞부분과 전혀 다른 위치의 변수가 모두 캐시에 있을 수 있다. 중요한 것은 캐시 라인 단위로 인접 데이터가 함께 올라온다는 사실이며, 이 때문에 메모리 레이아웃을 연속적으로 설계하는 것이 캐시 효율에 영향을 미친다.
