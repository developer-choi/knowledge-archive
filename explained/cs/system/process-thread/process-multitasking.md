# 멀티태스킹이란 무엇이며, 하나의 CPU 코어에서 여러 프로세스가 동시에 실행되는 것처럼 보이는 원리는?

## 도입

지금 이 순간 컴퓨터에서 Chrome, VS Code, Spotify가 동시에 돌아가는 것처럼 보인다. 그런데 CPU 코어 하나는 한 번에 한 가지 명령어만 실행할 수 있다. 어떻게 동시에 돌아가는 것처럼 느껴지는 걸까? 멀티태스킹과 컨텍스트 스위치가 답이다.

---

## 본문

> Multitasking is a method to allow multiple processes to share processors (CPUs) and other system resources.

"멀티태스킹은 여러 프로세스가 프로세서(CPU)와 다른 시스템 자원을 공유할 수 있게 하는 방법이다."

- **share processors**: 여러 프로세스가 하나의 CPU를 번갈아 가며 쓰는 것. "내 것"이 아니라 OS가 시간을 쪼개서 나눠주는 것이다.

> Each CPU (core) executes a single process at a time.

"각 CPU(코어)는 한 번에 하나의 프로세스만 실행한다."

이것이 핵심 제약이다. 코어가 4개면 동시에 최대 4개 프로세스를 실행할 수 있지만, 프로세스가 100개면 여전히 번갈아가며 CPU를 써야 한다.

> In time-sharing systems, context switches are performed rapidly, which makes it seem like multiple processes are being executed simultaneously on the same processor.

"시분할 시스템에서는 컨텍스트 스위치가 빠르게 수행되어, 같은 프로세서에서 여러 프로세스가 동시에 실행되는 것처럼 보인다."

- **time-sharing**: CPU 시간을 짧은 슬라이스(타임 슬라이스)로 나눠 프로세스들에게 돌아가며 주는 방식. 각 프로세스는 자기 차례에만 CPU를 쓰지만, 전환이 너무 빨라서 사람 눈에는 동시에 돌아가는 것처럼 보인다.
- **context switches are performed rapidly**: 컨텍스트 스위치 자체는 마이크로초(μs) 단위의 짧은 시간 안에 완료된다.

> This seemingly-simultaneous execution of multiple processes is called concurrency.

"이렇게 여러 프로세스가 동시에 실행되는 것처럼 보이는 것을 동시성(concurrency)이라 한다."

- **concurrency (동시성)**: 빠른 전환으로 동시에 실행되는 것처럼 보이는 것. 물리적으로 동시에 실행되는 **parallelism(병렬성)**과 구분된다.
  - **concurrency**: 하나의 코어에서 빠르게 전환 — "동시에 보임"
  - **parallelism**: 여러 코어에서 진짜로 동시 실행 — "실제로 동시"

**비유:** 요리사 한 명이 파스타 끓이면서(대기 중) 샐러드를 자르고, 타이머 울리면 파스타 저어주는 것 → concurrency. 요리사 두 명이 각자 동시에 다른 음식을 만드는 것 → parallelism.

---

## 종합

멀티태스킹의 원리는 간단하다: CPU 시간을 아주 짧게 쪼개서 프로세스들에게 돌아가며 준다. 전환이 너무 빨라서(마이크로초 단위) 사람 눈에는 동시에 돌아가는 것처럼 보인다. 이것이 concurrency(동시성)다.

```
시간 축 ────────────────────────────────────────→
CPU: [Chrome][node.js][VS Code][Chrome][node.js][VS Code] ...
      ↑ 각 슬라이스는 마이크로초 단위

사람 눈: Chrome, node.js, VS Code가 동시에 돌아가는 것처럼 보임
```

Node.js가 싱글스레드 이벤트 루프로 수천 개의 동시 요청을 처리할 수 있는 것도 이 원리의 연장이다 — I/O 대기 중에 CPU를 다른 콜백에게 넘기는 concurrency 모델이다.

---

# OS에서 컨텍스트 스위치(프로세스 전환)가 발생하는 시점은?

## 도입

컨텍스트 스위치는 CPU의 주인이 바뀌는 순간이다. 언제 이 전환이 일어나는가? OA는 네 가지 시점을 제시한다. 또한 OS가 강제로 전환하는 선점형(preemptive)과 프로세스가 자발적으로 양보하는 협력형(cooperative) 방식의 차이도 다룬다.

---

## 본문

> Multitasking allows each processor to switch between tasks that are being executed without having to wait for each task to finish (preemption).

"멀티태스킹은 각 프로세서가 실행 중인 작업들 사이를 전환할 수 있게 해준다 — 각 작업이 완료될 때까지 기다리지 않고 (선점)."

- **preemption (선점)**: OS가 강제로 CPU를 빼앗는 것. 프로세스가 "아직 안 끝났어!"라고 해도 OS가 타임 슬라이스가 만료됐다고 판단하면 강제 전환한다.

> Switches could be performed when tasks initiate and wait for completion of input/output operations, when a task voluntarily yields the CPU, on hardware interrupts, and when the operating system scheduler decides that a process has expired its fair share of CPU time (e.g, by the Completely Fair Scheduler of the Linux kernel).

"컨텍스트 스위치는 다음 시점에 발생할 수 있다: 작업이 I/O 완료를 기다릴 때, 작업이 자발적으로 CPU를 양보할 때, 하드웨어 인터럽트가 발생할 때, 스케줄러가 프로세스의 공정한 CPU 시간 몫이 만료됐다고 판단할 때(예: Linux CFS)."

**네 가지 컨텍스트 스위치 발생 시점:**

- **I/O 대기 시**: `fs.readFileSync()`처럼 파일을 기다려야 하면 그 프로세스는 blocked 상태가 되고, CPU는 다른 프로세스에게 넘어간다. CPU가 아무것도 안 하며 기다리는 것보다 다른 일을 하는 게 효율적이다.

- **자발적 CPU 양보**: `sched_yield()` 시스템 콜처럼 프로세스가 "나 잠깐 쉴게"라고 스스로 CPU를 내놓는 것. 협력형 멀티태스킹의 핵심 메커니즘.

- **하드웨어 인터럽트**: 키보드 입력, 마우스 클릭, 네트워크 패킷 도착 등 하드웨어 이벤트가 발생하면 CPU가 현재 작업을 잠깐 멈추고 인터럽트 핸들러를 실행한 뒤 돌아온다.

- **타임 슬라이스 만료**: Linux CFS(Completely Fair Scheduler) 같은 스케줄러가 "이 프로세스가 자기 몫의 CPU 시간을 다 썼다"고 판단하면 강제로 전환한다.

---

**선점형 vs 협력형:**

> Multi-user operating systems generally favor preemptive multithreading for its finer-grained control over execution time via context switching.
> However, preemptive scheduling may context-switch threads at moments unanticipated by programmers, thus causing lock convoy, priority inversion, or other side-effects.

"멀티유저 OS는 일반적으로 컨텍스트 스위치를 통해 더 세밀하게 실행 시간을 제어할 수 있는 선점형 멀티스레딩을 선호한다. 그러나 선점형 스케줄링은 프로그래머가 예상하지 못한 순간에 스레드를 전환할 수 있어 락 컨보이, 우선순위 역전 등의 부작용을 일으킬 수 있다."

- **lock convoy**: 많은 스레드가 하나의 락을 순서대로 기다리며 병목이 생기는 현상.
- **priority inversion**: 낮은 우선순위 프로세스가 락을 잡고 있어서 높은 우선순위 프로세스가 기다려야 하는 현상. Mars Pathfinder 탐사선에서 실제 발생한 유명한 버그다.

> In contrast, cooperative multithreading relies on threads to relinquish control of execution, thus ensuring that threads run to completion.

"반대로 협력형 멀티스레딩은 스레드가 스스로 실행 제어를 양보하여, 스레드가 완료까지 실행되도록 보장한다."

- **cooperative**: 스레드가 자발적으로 양보해야만 전환이 일어난다. 양보하지 않으면 영원히 CPU를 독점할 수 있어 현대 OS는 거의 선점형을 쓴다.

---

## 종합

컨텍스트 스위치가 발생하는 시점을 정리하면:

| 시점 | 방식 | 예시 |
|---|---|---|
| I/O 대기 | 자동(blocking 시) | `fs.readFileSync()` 호출 |
| 자발적 양보 | 협력형 | `sched_yield()` 시스템 콜 |
| 하드웨어 인터럽트 | 자동 | 키보드 입력, 네트워크 패킷 |
| 타임 슬라이스 만료 | 선점형 | Linux CFS, Windows 스케줄러 |

방식 기준으로 묶으면:

```
컨텍스트 스위치 발생 시점
├── 자동 (외부 이벤트 기반)
│   ├── I/O 대기              fs.readFileSync() 등 blocking I/O 호출
│   └── 하드웨어 인터럽트     키보드/마우스/네트워크 패킷 도착
├── 협력형 (프로세스 자발적)
│   └── 자발적 양보           sched_yield() 시스템 콜
└── 선점형 (OS 강제)
    └── 타임 슬라이스 만료    Linux CFS, Windows 스케줄러
```

현대 멀티유저 OS(Linux, Windows, macOS)는 선점형을 기본으로 쓴다. 선점형이라 프로그래머가 "이 코드 실행 중에는 전환하지 마"를 보장받기 어렵고, 그래서 공유 자원에는 뮤텍스·락이 필요하다. Node.js가 싱글스레드 이벤트 루프를 쓰는 이유 중 하나도 이 복잡성을 피하기 위해서다 — 기본적으로 레이스 컨디션이 없다.
