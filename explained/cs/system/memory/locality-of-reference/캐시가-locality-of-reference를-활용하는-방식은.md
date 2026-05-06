# 캐시가 locality of reference를 활용하는 방식은?

> A cache is a simple example of exploiting temporal locality, because it is a specially designed, faster but smaller memory area, generally used to keep recently referenced data and data near recently referenced data, which can lead to potential performance increases.
> Temporal locality plays a role on the lowest level, since results that are referenced very closely together can be kept in the machine registers.

---

**도입**

캐시는 "Locality of Reference 원칙을 그대로 하드웨어로 구현한 것"이라 봐도 됩니다. 최근 참조한 데이터(temporal)와 그 주변 데이터(spatial)를 작지만 빠른 영역에 둬서 다음 접근을 빠르게. 이번 질문은 그 활용 방식을 두 측면(temporal + spatial)에서 살펴봅니다.

---

**본문**

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

**종합**

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
