---
tags: [os, concept]
source: official
priority:
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

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## OS에서 컨텍스트 스위치(프로세스 전환)가 발생하는 시점은?

### Official Answer
Multitasking allows each processor to switch between tasks that are being executed without having to wait for each task to finish (preemption).
Switches could be performed when tasks initiate and wait for completion of input/output operations, when a task voluntarily yields the CPU, on hardware interrupts, and when the operating system scheduler decides that a process has expired its fair share of CPU time (e.g, by the Completely Fair Scheduler of the Linux kernel).

Multi-user operating systems generally favor preemptive multithreading for its finer-grained control over execution time via context switching.
However, preemptive scheduling may context-switch threads at moments unanticipated by programmers, thus causing lock convoy, priority inversion, or other side-effects.
In contrast, cooperative multithreading relies on threads to relinquish control of execution, thus ensuring that threads run to completion.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)
- https://en.wikipedia.org/wiki/Thread_(computing)
