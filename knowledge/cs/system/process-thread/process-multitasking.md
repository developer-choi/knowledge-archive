---
tags: [os, concept]
---

# Questions
- 멀티태스킹이란 무엇이며, 하나의 CPU 코어에서 여러 프로세스가 동시에 실행되는 것처럼 보이는 원리는?
  - OS에서 컨텍스트 스위치(프로세스 전환)가 발생하는 시점은?

---

# Answers

## 멀티태스킹이란 무엇이며, 하나의 CPU 코어에서 여러 프로세스가 동시에 실행되는 것처럼 보이는 원리는?

### Official Answer
Multitasking is a method to allow multiple processes to share processors (CPUs) and other system resources.
Each CPU (core) executes a single process at a time.
In time-sharing systems, context switches are performed rapidly, which makes it seem like multiple processes are being executed simultaneously on the same processor.
This seemingly-simultaneous execution of multiple processes is called concurrency.

> #### AI Annotation:
> CPU 시간을 잘게 쪼개 여러 프로세스에 번갈아 할당(time-sharing)하고, 전환(context switch)이 워낙 빨라서 동시에 돌아가는 것처럼 보인다.
> 이것이 concurrency(동시성)이며, 물리적 동시 실행인 parallelism(병렬성)과 구분된다.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## OS에서 컨텍스트 스위치(프로세스 전환)가 발생하는 시점은?

### Official Answer
Multitasking allows each processor to switch between tasks that are being executed without having to wait for each task to finish (preemption).
Switches could be performed when tasks initiate and wait for completion of input/output operations, when a task voluntarily yields the CPU, on hardware interrupts, and when the operating system scheduler decides that a process has expired its fair share of CPU time (e.g, by the Completely Fair Scheduler of the Linux kernel).

> #### AI Annotation:
> 전환이 일어나는 4가지 시점:
> 1. I/O 대기 — 파일 읽기, 네트워크 응답 등을 기다릴 때
> 2. 자발적 양보 — 프로세스가 스스로 CPU를 내놓을 때
> 3. 하드웨어 인터럽트 — 키보드/마우스 같은 외부 이벤트
> 4. 타임 슬라이스 만료 — OS 스케줄러가 "네 차례 끝"이라고 판단할 때

> #### Official Annotation:
> Multi-user operating systems generally favor preemptive multithreading for its finer-grained control over execution time via context switching.
> However, preemptive scheduling may context-switch threads at moments unanticipated by programmers, thus causing lock convoy, priority inversion, or other side-effects.
> In contrast, cooperative multithreading relies on threads to relinquish control of execution, thus ensuring that threads run to completion.
> — https://en.wikipedia.org/wiki/Thread_(computing)

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)
