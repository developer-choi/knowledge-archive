# 멀티태스킹이란 무엇이며, 하나의 CPU 코어에서 여러 프로세스가 동시에 실행되는 것처럼 보이는 원리는?

> Multitasking is a method to allow multiple processes to share processors (CPUs) and other system resources.
> Each CPU (core) executes a single process at a time.
> In time-sharing systems, context switches are performed rapidly, which makes it seem like multiple processes are being executed simultaneously on the same processor.
> This seemingly-simultaneous execution of multiple processes is called concurrency.

---

**도입**

노트북에서 Chrome, VS Code, Slack을 동시에 켜놓아도 다 잘 돌아가는 것처럼 보입니다. 근데 CPU 코어가 4개뿐이라면 같은 순간 실제로 실행되는 건 4개일 텐데, 어떻게 수십 개 프로그램이 멈추지 않고 굴러가는 걸까요? 답은 "사실 동시는 아닌데 동시처럼 보이게 한다"입니다.

---

**본문**

> Multitasking is a method to allow multiple processes to share processors (CPUs) and other system resources.

멀티태스킹은 여러 프로세스가 CPU와 다른 시스템 자원을 공유할 수 있게 해주는 방법이다.

- **share processors**: 한 CPU를 여러 프로세스가 돌아가며 사용. 시간을 잘게 쪼개 나눠 갖는다고 보면 됩니다.
- **other system resources**: CPU만이 아니라 메모리·디스크 I/O·네트워크 대역폭도 공유 대상. 멀티태스킹은 자원 전반을 여러 프로세스가 나눠 쓰는 큰 그림.

> Each CPU (core) executes a single process at a time.

각 CPU(코어)는 한 번에 단 하나의 프로세스만 실행한다.

- **a single process at a time**: 물리적으로 동시에 두 프로세스를 실행할 수 없습니다. 1코어 = 1실행. 4코어면 같은 순간 최대 4개 프로세스만 실제로 돌아갑니다. 이게 없으면 다음 문장(시분할)이 왜 필요한지가 안 잡힙니다.

> In time-sharing systems, context switches are performed rapidly, which makes it seem like multiple processes are being executed simultaneously on the same processor.

시분할 시스템에서는 컨텍스트 스위치가 매우 빠르게 일어나서, 같은 프로세서 위에서 여러 프로세스가 동시에 실행되는 것처럼 보이게 한다.

- **time-sharing**: CPU 시간을 잘게(예: 10ms 단위) 쪼개 여러 프로세스에 번갈아 할당. 사용자 입장에서는 계속 실행되는 것처럼 느껴집니다.
- **context switches**: 한 프로세스에서 다른 프로세스로 CPU 점유를 전환하는 작업. OS가 CPU 하드웨어 안의 값들을 RAM의 PCB로 복사해두고, 다음 프로세스의 PCB 값을 CPU에 얹어줍니다. 저장되는 것은 두 가지입니다: **Program Counter**(어디서 이어받을지 — 명령어 주소)와 **레지스터 상태**(for문 `i`처럼 계산 중이던 값들). PC는 "책갈피(몇 페이지)", 레지스터는 "읽다 기억해둔 내용"으로 구분하면 됩니다.
- **rapidly**: 사람이 인지할 수 없을 만큼 빠르게. 1초에 수백~수천 번 일어나며, 그래서 우리는 모든 프로그램이 "계속 돌고 있다"고 느낍니다.

> This seemingly-simultaneous execution of multiple processes is called concurrency.

이렇게 동시에 실행되는 것처럼 보이는 것을 동시성(concurrency)이라고 한다.

- **seemingly-simultaneous**: "겉보기엔 동시"라는 게 핵심. 실제로는 시간 분할이지만, 빠르게 전환되어 동시처럼 보입니다.

---

**종합**

concurrency vs parallelism은 처음 헷갈리는 단골 주제입니다.

| 용어 | 의미 | 예시 |
|---|---|---|
| concurrency (동시성) | 동시에 진행되는 것처럼 보임 (실제로는 빠른 전환) | 1코어 CPU에서 Chrome + VS Code |
| parallelism (병렬성) | 물리적으로 동시 실행 | 4코어 CPU에서 4개 프로세스 동시 실행 |

---

# OS에서 컨텍스트 스위치(프로세스 전환)가 발생하는 시점은?

> Multitasking allows each processor to switch between tasks that are being executed without having to wait for each task to finish (preemption).
> Depending on the operating system implementation, switches could be performed when tasks initiate and wait for completion of input/output operations, when a task voluntarily yields the CPU, on hardware interrupts, and when the operating system scheduler decides that a process has expired its fair share of CPU time (e.g, by the Completely Fair Scheduler of the Linux kernel).

---

**도입**

컨텍스트 스위치는 "지금 돌고 있는 프로세스의 CPU를 빼고 다른 프로세스에 줘라"입니다. 그럼 OS는 언제 그 결정을 내릴까요? 제멋대로 끊으면 시스템이 혼란스러워지고, 안 끊으면 한 프로세스가 CPU를 독점합니다. OS는 정해진 4가지 시점에만 끊습니다.

---

**본문**

> Multitasking allows each processor to switch between tasks that are being executed without having to wait for each task to finish (preemption).

멀티태스킹은 각 프로세서가 실행 중인 작업이 끝날 때까지 기다리지 않고도 작업 사이를 전환할 수 있게 해준다(선점).

- **switch between tasks**: 작업 A → 작업 B로 CPU를 옮기는 것. 컨텍스트 스위치의 본질.
- **without having to wait for each task to finish**: 작업이 끝날 때까지 기다리지 않습니다. 진행 중인 작업도 강제로 끊을 수 있습니다.
- **preemption (선점)**: OS가 실행 중인 프로세스에서 CPU를 강제로 회수하는 권한. 이게 없으면 한 프로세스가 무한루프에 빠질 때 다른 프로세스가 영원히 못 돕니다.

> Depending on the operating system implementation, switches could be performed when tasks initiate and wait for completion of input/output operations,

OS 구현에 따라, 작업이 입출력 연산을 시작하고 그 완료를 기다릴 때 전환이 일어날 수 있다.

- **initiate and wait for completion of I/O**: I/O는 디스크 읽기, 네트워크 응답 같이 시간이 오래 걸리는 작업. CPU는 I/O가 끝나기를 기다리는 동안 놀게 되니, OS는 그 시간을 다른 프로세스에게 넘겨줍니다. 가장 자연스러운 전환 시점.

> when a task voluntarily yields the CPU,

작업이 자발적으로 CPU를 양보할 때.

- **voluntarily yields**: 프로세스가 스스로 "지금 할 일 없으니 다른 프로세스에게 넘겨줘"라고 OS에 요청. 협력적 멀티태스킹의 핵심 동작.

> on hardware interrupts,

하드웨어 인터럽트가 발생할 때.

- **hardware interrupts**: 키보드, 마우스, 네트워크 카드 같은 외부 장치가 "처리할 일이 생겼다"고 CPU에 신호를 보내는 것. CPU는 즉시 현재 작업을 중단하고 인터럽트 핸들러로 점프합니다.

> and when the operating system scheduler decides that a process has expired its fair share of CPU time (e.g, by the Completely Fair Scheduler of the Linux kernel).

그리고 OS 스케줄러가 어떤 프로세스가 자신의 공정한 CPU 시간 몫을 다 썼다고 판단할 때(예: 리눅스 커널의 CFS).

- **fair share of CPU time**: 각 프로세스에 할당된 시간 조각(time slice 또는 quantum). 보통 수 ms ~ 수십 ms.
- **expired**: 시간 조각이 다 떨어진 상태. 스케줄러가 강제로 다음 프로세스에 CPU를 넘깁니다.
- **Completely Fair Scheduler (CFS)**: 리눅스의 대표 스케줄러. 모든 프로세스가 "공정하게" CPU 시간을 받도록 설계됨.

---

**종합**

전환이 일어나는 4가지 시점을 묶으면:

| 시점 | 누가 트리거 | 예시 | 성격 |
|---|---|---|---|
| I/O 대기 | 프로세스가 I/O 호출 | `fs.readFile()` 결과 대기 | 협력적 (자연스러운 양보) |
| 자발적 양보 | 프로세스 본인 | 스레드의 `yield()` 호출 | 협력적 |
| 하드웨어 인터럽트 | 외부 장치 | 키보드 입력, 패킷 도착 | 외부 강제 |
| 시간 조각 만료 | OS 스케줄러 | 10ms quantum 소진 | 선점적 (강제 회수) |

오개념 예방: 협력적 멀티태스킹(프로세스가 양보해줘야만 전환)에 의존하면 한 프로세스가 양보 안 할 때 다른 프로세스가 영원히 못 돕니다. 그래서 현대 OS는 선점적 방식이 기본입니다. Windows 95 이전 버전의 협력적 멀티태스킹이 한 프로그램 다운으로 OS 전체가 굳던 시절이 그 한계를 보여줍니다.

Official Annotation 보충: 선점적 방식은 시간 조각이 끝나는 정확한 순간을 프로그래머가 예측 못 하기 때문에 lock convoy(락을 잡은 채 선점당해 다른 스레드가 전부 막힘), priority inversion(낮은 우선순위 스레드가 락을 잡고 있어서 높은 우선순위가 못 진행) 같은 부작용이 있습니다. 동기화 코드를 짤 때 이 부작용을 가정해야 합니다.
