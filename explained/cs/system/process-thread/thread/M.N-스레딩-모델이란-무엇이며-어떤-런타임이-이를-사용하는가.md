# M:N 스레딩 모델이란 무엇이며, 어떤 런타임이 이를 사용하는가?

> M:N maps some M number of application threads onto some N number of kernel entities, or "virtual processors."
> This is a compromise between kernel-level ("1:1") and user-level ("N:1") threading.
> In the M:N implementation, the threading library is responsible for scheduling user threads on the available schedulable entities; this makes context switching of threads very fast, as it avoids system calls.
> However, this increases complexity and the likelihood of priority inversion, as well as suboptimal scheduling without extensive (and expensive) coordination between the userland scheduler and the kernel scheduler.

---

**도입**

1:1은 멀티코어를 잘 쓰지만 스레드 생성·전환이 무겁고, M:1은 가볍지만 멀티코어를 못 씁니다. 둘의 장점을 합치자는 시도가 M:N — 사용자 스레드 M개를 커널 스레드 N개에 동적 매핑. Go의 goroutine이 이 모델의 가장 성공적인 사례입니다.

---

**본문**

> M:N maps some M number of application threads onto some N number of kernel entities, or "virtual processors."

M:N은 M개의 애플리케이션 스레드를 N개의 커널 단위(또는 "가상 프로세서")에 매핑한다.

- **M number of application threads**: 사용자 코드가 만든 가벼운 실행 단위. 수천~수만 개도 가능.
- **N number of kernel entities**: 커널이 인식하는 스케줄 단위. 보통 코어 수에 가까운 작은 수.
- **virtual processors**: M:N에서 N개의 커널 스레드를 부르는 별칭. 사용자 스레드 입장에서는 마치 가상의 CPU처럼 보입니다.

> This is a compromise between kernel-level ("1:1") and user-level ("N:1") threading.

이는 커널 수준 1:1 스레딩과 사용자 수준 N:1 스레딩 사이의 절충안이다.

- **compromise**: 두 극단의 장점만 취하려는 절충. 1:1의 멀티코어 활용 + N:1의 가벼운 전환.

> In the M:N implementation, the threading library is responsible for scheduling user threads on the available schedulable entities;

M:N 구현에서, 스레딩 라이브러리는 사용 가능한 스케줄 단위 위에서 사용자 스레드를 스케줄링할 책임을 진다.

- **threading library**: 런타임 안의 스케줄러. Go의 런타임 스케줄러, Erlang VM 등이 해당.
- **scheduling user threads on the available schedulable entities**: M개 사용자 스레드를 N개 커널 스레드 위에 동적으로 분배. 어느 사용자 스레드를 어느 커널 스레드에 올릴지 런타임이 결정합니다.

> this makes context switching of threads very fast, as it avoids system calls.

이로 인해 스레드 컨텍스트 스위치가 매우 빠르다 — 시스템 콜을 피할 수 있기 때문이다.

- **avoids system calls**: 사용자 스레드 간 전환은 사용자 공간에서만 일어나니, 커널을 건드릴 필요가 없습니다. 시스템 콜은 사용자→커널 모드 전환 비용이 있는데, 이걸 안 내도 됩니다.
- **very fast**: 1:1 모델의 커널 컨텍스트 스위치가 마이크로초 단위라면, M:N의 사용자 스레드 전환은 나노초 단위까지 떨어질 수 있습니다.

> However, this increases complexity and the likelihood of priority inversion,

그러나 이는 복잡성과 우선순위 역전 발생 가능성을 증가시킨다.

- **complexity**: 런타임이 자체 스케줄러를 가져야 하니 구현이 어렵습니다. 락·블로킹 콜·I/O 모두 사용자 공간에서 인터셉트해야.
- **priority inversion**: 낮은 우선순위 스레드가 락을 쥔 채 선점당해, 높은 우선순위 스레드가 그 락을 기다리며 진행 못 하는 현상. 두 계층의 스케줄러가 따로 돌면 더 잘 발생.

> as well as suboptimal scheduling without extensive (and expensive) coordination between the userland scheduler and the kernel scheduler.

또한 사용자 공간 스케줄러와 커널 스케줄러 사이의 광범위한(그리고 비싼) 조율 없이는 차선의 스케줄링이 발생한다.

- **userland scheduler**: 런타임이 사용자 공간에서 굴리는 스케줄러. 사용자 스레드를 커널 스레드에 매핑.
- **kernel scheduler**: OS 커널의 스케줄러. 커널 스레드를 CPU 코어에 매핑.
- **without extensive coordination ... suboptimal**: 두 스케줄러가 서로 모르면, 예를 들어 런타임이 "사용자 스레드 A에 일을 줬어"라고 결정한 직후 커널이 그 사용자 스레드를 담은 커널 스레드를 다른 코어로 옮겨버려서 캐시가 다 무효화되는 식의 충돌이 일어납니다.

---

**종합**

세 모델의 비교를 다시:

| 모델 | 매핑 | 멀티코어 | 전환 속도 | 복잡도 | 대표 |
|---|---|---|---|---|---|
| 1:1 | 1:1 | O | 보통 | 낮음 | Linux pthread |
| M:1 | M:1 | X | 매우 빠름 | 낮음 | 초창기 그린 스레드 |
| M:N | M:N | O | 빠름 | 높음 | Go goroutine |

Go의 goroutine이 대표적인 M:N 사례:

- 수천~수만 개의 goroutine을 만들어도 스택이 작아 메모리 효율적(goroutine 1개 = 초기 2KB).
- Go 런타임이 GOMAXPROCS(보통 코어 수)만큼의 OS 스레드를 운영하며 goroutine을 동적으로 매핑.
- goroutine이 채널 read나 시스템 콜로 블로킹되면, 런타임이 다른 goroutine을 같은 OS 스레드에 올려 진행 — Official Answer가 말한 "calling thread만 블로킹되고 프로세스는 안 됨"이 실현되는 사례.

JS/Node.js와의 차이: Node.js는 M:N이 아닌 "단일 메인 스레드 + libuv 스레드 풀" 모델입니다. 사용자 코드(JS)는 메인 스레드 1개에서만 돌고, libuv는 내부 스레드 풀로 블로킹 작업만 처리. M:N처럼 "사용자 코드 단위가 N개 OS 스레드에 분산"되는 것과는 다릅니다.

이게 없으면 어떻게 되는가: M:N이 없다면 Go에서 1만 개 goroutine을 만드는 게 1만 개 OS 스레드를 만드는 것과 같아져 시스템이 무너집니다. M:N이 사용자 코드의 동시성 단위와 OS 스케줄링 단위를 분리해줘서, 가벼운 동시성과 진짜 병렬 실행을 동시에 얻는 것.

오개념 예방: "M:N이 무조건 좋은 모델"은 아닙니다. 복잡도와 priority inversion 리스크 때문에, 시스템 프로그래밍의 일반적인 선택은 여전히 1:1입니다. M:N이 빛나는 건 (a) 동시성 단위가 매우 많고(수만 단위), (b) 런타임이 자체 스케줄러를 잘 만들 수 있는 환경(Go, Erlang). 일반 애플리케이션에는 과한 도구.

AI Annotation 보충: Go 외에 Erlang VM도 M:N의 또 다른 대표. 다만 Erlang의 "process"는 데이터를 공유하지 않는 액터 모델이라 race condition 위험이 없어 priority inversion 같은 문제도 자연스럽게 회피합니다 — 모델 설계가 동시성 안전성을 끌어올리는 사례.
