# Sequential locality란 무엇인가?

> Sequential locality, a special case of spatial locality, occurs when data elements are arranged and accessed linearly, such as traversing the elements in a one-dimensional array.

---

**도입**

spatial locality가 "가까운 곳을 본다"라면, sequential locality는 "쭉 일렬로 본다"는 더 강한 패턴입니다. 1차원 배열을 처음부터 끝까지 순회하는 게 정확히 이 케이스. CPU 입장에서는 "다음에 어디 갈지" 정확히 예측 가능하니, 미리 캐시에 끌어오는(prefetch) 최적화까지 적용할 수 있습니다.

---

**본문**

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

**종합**

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
