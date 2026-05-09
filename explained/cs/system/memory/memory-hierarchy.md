# 메모리 계층 구조(Memory Hierarchy)란 무엇인가?

> The lower levels of the memory hierarchy tend to be slower, but larger.
> A program will achieve greater performance if it uses memory while it is cached in the upper levels of the memory hierarchy and avoids bringing other data into the upper levels of the hierarchy that will displace data that will be used shortly in the future.

---

## 도입

CPU는 매 클럭마다 데이터를 필요로 하는데, 큰 메모리는 느리고 빠른 메모리는 작습니다. 한 종류로는 둘 다 만족시킬 수 없으니, 컴퓨터는 여러 단계의 저장 공간을 쌓아 올려 사용합니다 — 빠르고 작은 것부터 느리고 큰 것 순으로. 이게 메모리 계층 구조(Memory Hierarchy). 프로그램 성능 최적화의 가장 근본적인 토대.

---

## 본문

> The lower levels of the memory hierarchy tend to be slower, but larger.

메모리 계층의 하위 레벨은 더 느리지만 더 크다.

- **lower levels**: 계층의 아래쪽 — RAM, 디스크, 원격 저장소 등. CPU에서 멀리 떨어진 쪽.
- **slower, but larger**: 트레이드오프. 속도와 크기를 동시에 갖기 어려움. 빠른 메모리는 비싸고 작고, 큰 메모리는 싸고 느림.

> A program will achieve greater performance if it uses memory while it is cached in the upper levels of the memory hierarchy

프로그램은 메모리 계층의 상위 레벨에 캐시된 동안 그 메모리를 사용한다면 더 큰 성능을 달성할 것이다.

- **upper levels**: 계층의 위쪽 — 레지스터, L1/L2/L3 캐시. CPU에 가까워 빠른 쪽.
- **cached in the upper levels**: 데이터가 상위 레벨로 끌어올려진 상태. 일단 끌어올리면 다음 접근은 매우 빠름.
- **uses memory while it is cached**: "캐시된 동안" 사용한다는 게 핵심. 끌어올린 직후에 자주 쓰면 효율이 극대화.

> and avoids bringing other data into the upper levels of the hierarchy that will displace data that will be used shortly in the future.

그리고 가까운 미래에 사용될 데이터를 밀어낼 다른 데이터를 상위 레벨로 가져오는 것을 피한다면.

- **bringing other data into the upper levels**: 새 데이터를 상위 캐시에 올림. 캐시는 작아서 새 데이터가 들어오면 기존 데이터가 밀려나야 함.
- **displace data**: 캐시에 있던 데이터를 쫓아냄. 다음에 그걸 또 쓰려면 다시 하위 레벨에서 가져와야 하니 비쌈.
- **used shortly in the future**: 곧 사용될. 캐시 교체 알고리즘이 "이 데이터 곧 또 쓸 것 같다"고 예측한 데이터.

---

## 종합

메모리 계층의 전형적인 구성:

| 레벨 | 종류 | 접근 시간(대략) | 크기 |
|---|---|---|---|
| 가장 위 | CPU 레지스터 | < 1 ns | 수백 바이트 |
|  | L1 캐시 | ~1 ns | KB 수십 |
|  | L2 캐시 | ~5 ns | KB 수백 |
|  | L3 캐시 | ~10 ns | MB 수십 |
|  | RAM (메인 메모리) | ~100 ns | GB 수~수십 |
|  | SSD/HDD | μs ~ ms | TB |
| 가장 아래 | 원격 (네트워크/클라우드) | ms 이상 | 무제한 |

레지스터 → 디스크는 속도 차이가 약 천만 배. 이 차이를 좁히기 위해 중간 캐시들이 존재.

JS 개발 관점:

- **JS 변수**가 핫 루프 안에서 자주 쓰일 때, V8은 최대한 그 변수 값을 레지스터/L1 캐시에 머물게 하려고 합니다.
- **큰 배열을 한 번 훑고 버리는 작업**은 캐시에 들어왔다가 곧 밀려나니 캐시 효과가 적음. 반대로 **작은 배열을 반복적으로 쓰는 작업**은 캐시가 잘 작동.
- **`fetch()`로 받은 큰 응답 데이터를 한 번 처리하고 GC**하는 패턴은 캐시 친화적인 편 — 처리 중에는 핫하게 캐시에 머물고, 끝나면 깔끔히 비워짐.

오개념 예방: "캐시는 OS나 CPU가 알아서 관리하니 개발자는 신경 안 써도 된다"는 부분적으로만 맞습니다. 캐시 교체는 자동이지만, 개발자가 작성하는 데이터 접근 패턴이 그 효율을 결정합니다. 예를 들어 2차원 배열을 column-major로 순회하는 것보다 row-major로 순회하는 게 캐시 라인 정렬상 훨씬 빠른 식. 자료구조 선택과 순회 순서가 곧 캐시 친화도.

이게 없으면 어떻게 되는가 — 메모리 계층이 단일 레벨이라면: 옵션 1) 모든 메모리를 레지스터처럼 빠른 종류로 만든다 → 비용·발열·물리적 한계로 1KB 이상 만들기 어려움. 옵션 2) 모든 메모리를 디스크처럼 느린 종류로 만든다 → CPU가 매 명령마다 ms 단위로 기다림 = 사실상 컴퓨터 정지. 계층화가 "빠름과 큼"의 양립 불가를 우회하는 유일한 길.

Official Annotation 보충: 현대 머신은 하위 메모리의 블록을 다음 상위 레벨로 끌어올립니다 — RAM에서 L3로 청크 단위로. 이때 기존 데이터가 밀려나면, OS는 "어떤 데이터가 가장 안 쓰일 것 같다"를 예측해 그걸 하위로 내려보냅니다(LRU 같은 교체 정책).

AI Annotation 보충: 계층의 핵심은 "위로 갈수록 빠르고 작고, 아래로 갈수록 느리고 크다"라는 단조 관계. Register → L1 → L2 → L3 → RAM → Disk → Remote. 이 단조성이 깨지지 않게 설계된 시스템 위에서 locality of reference 원칙(자주 쓰는 데이터를 위에 두자)이 작동.

메모리 계층을 피라미드로:

```
   빠름 / 작음 / 비쌈
   ▲
   │              ┌──┐
   │              │ R│  Register     <1ns    수백 B
   │            ┌─┴──┴─┐
   │            │  L1  │              ~1ns    수십 KB
   │          ┌─┴──────┴─┐
   │          │    L2    │            ~5ns    수백 KB
   │        ┌─┴──────────┴─┐
   │        │      L3      │          ~10ns   수십 MB
   │      ┌─┴──────────────┴─┐
   │      │       RAM        │        ~100ns  수~수십 GB
   │    ┌─┴──────────────────┴─┐
   │    │      SSD / HDD       │      μs~ms   TB
   │  ┌─┴──────────────────────┴─┐
   │  │  Remote (네트워크/클라우드) │   ms 이상  사실상 무제한
   │  └──────────────────────────┘
   ▼
   느림 / 큼 / 쌈

   위로 갈수록: 빠르고 / 작고 / 비싸고 / CPU에 가까움
   아래로 갈수록: 느리고 / 크고 / 싸고 / CPU에서 멈
```

핵심: 한 종류로 "빠름 + 큼"을 동시에 만족시킬 수 없으므로, 단조 계층을 쌓아 평균 접근 시간을 낮춘다. 자주 쓰는 데이터는 위로, 가끔 쓰는 데이터는 아래로.
