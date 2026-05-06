# Temporal locality란 무엇인가?

> Temporal locality refers to the reuse of specific data and/or resources within a relatively small time duration.
> Temporal locality is a special case of spatial locality, namely when the prospective location is identical to the present location.

---

**도입**

"방금 본 데이터를 곧 또 본다"는 단순한 경향이 temporal locality. 이걸 알면 캐시 동작이 한 번에 이해됩니다 — "최근에 쓴 거니까 잠깐 빠른 곳에 두자". for 루프 변수, 자주 쓰는 객체 참조 모두 이 패턴의 일상적 사례.

---

**본문**

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

**종합**

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
