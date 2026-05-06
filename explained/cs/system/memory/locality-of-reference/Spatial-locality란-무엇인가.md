# Spatial locality란 무엇인가?

> Spatial locality (also termed data locality) refers to the use of data elements within relatively close storage locations.

---

**도입**

"이 주소를 봤다면 그 주변도 곧 볼 가능성이 높다" — 이게 spatial locality. 배열 순회가 가장 직관적인 예시입니다. `arr[0]`을 읽었다면 `arr[1]`, `arr[2]`도 곧 읽을 가능성이 매우 높죠. CPU와 캐시는 이 패턴을 적극 활용해, 한 주소를 가져올 때 인접 메모리를 통째로 끌어옵니다.

---

**본문**

> Spatial locality (also termed data locality) refers to the use of data elements within relatively close storage locations.

Spatial locality(데이터 지역성이라고도 함)는 비교적 가까운 저장 위치 안에 있는 데이터 요소들을 사용하는 것을 의미한다.

- **spatial**: 공간적인. 메모리 주소 공간 차원의 지역성.
- **data locality**: 동의어. 같은 개념을 다른 시각(데이터 차원)에서 부르는 명칭.
- **data elements**: 메모리에 저장된 데이터 항목들. 변수·배열 원소·구조체 필드 등.
- **relatively close storage locations**: 비교적 가까운 저장 위치들. 메모리 주소 차이가 작은 것들.

---

**종합**

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
