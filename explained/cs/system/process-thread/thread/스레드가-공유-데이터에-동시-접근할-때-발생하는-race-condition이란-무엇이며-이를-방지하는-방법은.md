# 스레드가 공유 데이터에 동시 접근할 때 발생하는 race condition이란 무엇이며, 이를 방지하는 방법은?

> When shared between threads, however, even simple data structures become prone to race conditions if they require more than one CPU instruction to update: two threads may end up attempting to update the data structure at the same time and find it unexpectedly changing underfoot.
> Bugs caused by race conditions can be very difficult to reproduce and isolate.
> To prevent this, threading application programming interfaces (APIs) offer synchronization primitives such as mutexes to lock data structures against concurrent access.

---

**도입**

같은 메모리를 공유한다는 게 스레드의 핵심 특성인데, 여기서 가장 악명 높은 문제가 race condition입니다. `count++` 같이 한 줄짜리 코드도 CPU 입장에서는 여러 명령어로 쪼개지니, 두 스레드가 동시에 끼면 값이 꼬입니다. 멀티스레드 프로그래밍의 사실상 모든 동기화 도구가 이 문제 하나를 풀기 위해 존재합니다.

---

**본문**

> When shared between threads, however, even simple data structures become prone to race conditions if they require more than one CPU instruction to update:

스레드 간에 공유될 때는 그러나, 업데이트에 한 개 이상의 CPU 명령어가 필요한 경우 단순한 자료구조조차 race condition에 취약해진다.

- **even simple data structures**: 정수 카운터처럼 단순한 변수도 위험. 코드는 짧아도 CPU 명령어 단위로 쪼개지면 중간이 노출됨.
- **more than one CPU instruction**: `count++`는 (1) 메모리에서 읽기, (2) 1 더하기, (3) 메모리에 쓰기 — 최소 3개 명령어. 각각 사이가 끼어들 틈.
- **prone to race conditions**: race condition에 취약. 특정 명령어 사이에 다른 스레드가 끼어들면 결과가 달라짐.

> two threads may end up attempting to update the data structure at the same time and find it unexpectedly changing underfoot.

두 스레드가 같은 시점에 자료구조를 업데이트하려고 하다가, 발 밑에서 예기치 않게 변하는 것을 발견할 수 있다.

- **at the same time**: 멀티코어에서는 진짜 동시, 1코어에서는 시분할로 인터리브. 어느 쪽이든 두 스레드의 업데이트가 겹칩니다.
- **changing underfoot**: 발 밑에서 변한다 — 한 스레드가 "방금 0이었는데" 하고 1을 더하려는 순간, 다른 스레드가 이미 그 값을 1로 바꿔놓아 결과가 어긋나는 상황의 비유.

> Bugs caused by race conditions can be very difficult to reproduce and isolate.

race condition이 일으키는 버그는 재현하고 격리하기 매우 어렵다.

- **difficult to reproduce**: 스레드 인터리빙이 매번 달라서 같은 입력에도 결과가 다를 수 있음. 디버거 켜면 타이밍이 바뀌어 버그가 안 나기도 합니다(Heisenbug).
- **isolate**: 어느 두 스레드가 어느 시점에 충돌했는지 좁히기 어려움. 로그를 찍는 행위 자체가 타이밍을 바꾸니까.

> To prevent this, threading application programming interfaces (APIs) offer synchronization primitives such as mutexes to lock data structures against concurrent access.

이를 방지하기 위해, 스레딩 API는 mutex 같은 동기화 프리미티브를 제공해 자료구조를 동시 접근으로부터 락한다.

- **synchronization primitives**: 스레드 동기화의 기본 도구들. mutex, semaphore, condition variable 등.
- **mutexes**: Mutual Exclusion. "한 번에 한 스레드만"을 강제하는 락. 락을 잡은 스레드가 풀 때까지 다른 스레드는 대기.
- **lock data structures against concurrent access**: 자료구조 접근을 직렬화. 동시성을 막아 race를 원천 차단.

---

**종합**

`count++`의 race를 CPU 명령어 단위로 풀면:

```
스레드 A: load count → R1   (R1 = 0)
스레드 B: load count → R2   (R2 = 0)  ← A의 load와 B의 load 사이가 충돌 지점
스레드 A: R1 + 1 = 1
스레드 B: R2 + 1 = 1
스레드 A: store R1 → count  (count = 1)
스레드 B: store R2 → count  (count = 1)  ← 두 번 증가시켰는데 1이 됨
```

방지 방법을 정리:

| 방법 | 메커니즘 | 비용 |
|---|---|---|
| Mutex/Lock | 한 번에 한 스레드만 진입 | 컨텍스트 스위치, 데드락 위험 |
| Atomic 연산 | CPU 단일 명령으로 보장 | 빠르지만 단순 연산만 가능 |
| 메시지 패싱 | 공유 자체를 안 함 | 안전, 통신 비용 |
| Immutable 자료구조 | 변경 안 하니 race 없음 | 메모리·복사 비용 |

JS와의 관계:

- **순수 JS는 race condition이 없습니다** — 메인 스레드가 1개라 인터리빙이 일어날 틈이 없습니다. `count++`가 실행되는 동안 다른 코드가 끼어들지 못함.
- **Web Worker + SharedArrayBuffer** 사용 시에만 race가 가능. 이때 `Atomics.add()`, `Atomics.compareExchange()` 같은 원자 연산 API를 써야 합니다.
- **그래서 JS 개발자가 race condition을 자주 마주치지 않는 것**. 동기화의 "기본값"을 언어가 보장해준 셈.

오개념 예방: "JS는 비동기 코드를 쓰니 race condition이 있다"는 부정확. async/await의 인터리빙은 명시적 await 지점에서만 일어나고 메인 스레드는 여전히 1개라, 중간에 다른 코드가 변수 값을 바꿀 수 없습니다. 다만 두 비동기 함수가 같은 자원을 다른 순서로 변경하면 "논리적 race"는 가능합니다 (예: A가 fetch 결과를 쓰는데 B가 그 사이 같은 자원을 갱신). 이건 메모리 race가 아니라 흐름 race.

이게 없으면 어떻게 되는가 — 동기화 프리미티브가 없다면: 멀티스레드 프로그래밍은 사실상 불가능합니다. 모든 공유 자료구조 접근이 잠재적 버그가 되니, 실용적인 멀티스레드 코드는 성립할 수 없습니다. mutex가 OS·언어 차원에서 기본 제공되는 건 그래서.

AI Annotation 보충: Java의 `synchronized`, C의 `pthread_mutex_lock`, Rust의 `Mutex<T>` 모두 같은 mutex 추상화의 다른 옷. 언어가 다르더라도 OS 차원에서는 결국 같은 시스템 콜로 내려갑니다.
