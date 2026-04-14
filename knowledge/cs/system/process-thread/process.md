---
tags: [os, concept]
---

# Questions
- 프로세스란 무엇이며, 프로그램과 어떻게 다른가?
  - OS가 프로세스를 관리하기 위해 묶어두는 구성 요소에는 무엇이 있는가?
    - 프로세스의 메모리 영역은 어떤 구성 요소를 포함하는가?
    - PCB(프로세스 제어 블록)란 무엇인가?
  - OS가 프로세스들을 서로 격리하는 이유와, 격리 실패 시 발생할 수 있는 문제는?
- 멀티태스킹이란 무엇이며, 하나의 CPU 코어에서 여러 프로세스가 동시에 실행되는 것처럼 보이는 원리는?
  - OS에서 컨텍스트 스위치(프로세스 전환)가 발생하는 시점은?
  - 현대 OS가 프로세스 간 직접 통신을 막고 IPC를 제공하는 이유는?
- 부모 프로세스와 자식 프로세스의 관계는 어떻게 형성되는가?
- 프로세스가 blocked 상태가 되는 조건과, 가상 메모리 시스템에서 blocked 프로세스의 메모리는 어떻게 처리되는가?
- 프로세스의 상태 전이(lifecycle)에서 waiting과 blocked의 차이는?

---

# Answers

## 프로세스란 무엇이며, 프로그램과 어떻게 다른가?

### Official Answer
In computing, a process is the instance of a computer program that is being executed by one or many threads.
While a computer program is a passive collection of instructions typically stored in a file on disk, a process is the execution of those instructions after being loaded from the disk into memory.

> #### AI Annotation:
> 프로그램 = 디스크에 저장된 정적 파일 (요리책), 프로세스 = 메모리에 올라가서 실행 중인 동적 실체 (요리하는 행위).
> OOP로 비유하면 프로그램이 클래스, 프로세스가 인스턴스.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## OS가 프로세스를 관리하기 위해 묶어두는 구성 요소에는 무엇이 있는가?

### Official Answer
Almost all processes (even entire virtual machines) are rooted in an operating system (OS) process which comprises the program code, assigned system resources, physical and logical access permissions, and data structures to initiate, control and coordinate execution activity.
Depending on the OS, a process may be made up of multiple threads of execution that execute instructions concurrently.

> #### AI Annotation:
> 프로세스는 단순히 "실행 중인 코드"가 아니라, 코드 + 자원 + 권한 + 제어 구조를 패키지로 묶은 것.
> Docker 컨테이너든, VM이든, 결국 호스트 OS의 프로세스 위에서 돌아간다.

> #### Official Annotation:
> A process is a unit of resources, while a thread is a unit of scheduling and execution.
> — https://en.wikipedia.org/wiki/Thread_(computing)

> #### Official Annotation:
> In general, a computer system process consists of (or is said to own) the following resources:
> - An image of the executable machine code associated with a program.
> - Memory (typically some region of virtual memory); which includes the executable code, process-specific data (input and output), a call stack (to keep track of active subroutines and/or other events), and a heap to hold intermediate computation data generated during run time.
> - Operating system descriptors of resources that are allocated to the process, such as file descriptors (Unix terminology) or handles (Windows), and data sources and sinks.
> - Security attributes, such as the process owner and the process' set of permissions (allowable operations).
> - Processor state (context), such as the content of registers and physical memory addressing.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## 프로세스의 메모리 영역은 어떤 구성 요소를 포함하는가?

### Official Answer
Memory (typically some region of virtual memory); which includes the executable code, process-specific data (input and output), a call stack (to keep track of active subroutines and/or other events), and a heap to hold intermediate computation data generated during run time.

> #### AI Annotation:
> 프로세스의 메모리 = 코드 + 데이터 + 콜 스택 + 힙.
> JS의 콜 스택(함수 호출 추적)과 힙(객체/배열 등 동적 데이터)이 바로 프로세스 메모리 영역에 해당한다.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## PCB(프로세스 제어 블록)란 무엇인가?

### Official Answer
The operating system holds most of this information about active processes in data structures called process control blocks.
Any subset of the resources, typically at least the processor state, may be associated with each of the process' threads in operating systems that support threads or child processes.

> #### AI Annotation:
> PCB = 프로세스 하나당 하나씩 존재하는 OS 내부 자료구조로, 코드·메모리·파일 디스크립터·권한·레지스터 상태를 모두 담고 있다.
> 컨텍스트 스위치 시 PCB에서 상태를 저장/복원한다.
> 스레드는 프로세스의 자원을 공유하되, 각 스레드마다 독립적인 프로세서 상태(레지스터, PC)를 가진다.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## OS가 프로세스들을 서로 격리하는 이유와, 격리 실패 시 발생할 수 있는 문제는?

### Official Answer
The operating system keeps its processes separate and allocates the resources they need, so that they are less likely to interfere with each other and cause system failures (e.g., deadlock or thrashing).
The operating system may also provide mechanisms for inter-process communication to enable processes to interact in safe and predictable ways.

> #### AI Annotation:
> deadlock = A가 B의 자원을 기다리고, B가 A의 자원을 기다려서 둘 다 영원히 멈추는 상태.
> thrashing = 메모리 부족으로 페이지 교체가 과도하게 발생하여, 실제 작업보다 교체에 시간을 더 쓰는 상태.
> 격리하되, 필요 시 IPC로 통제된 통신을 허용한다.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

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
Depending on the operating system implementation, switches could be performed when tasks initiate and wait for completion of input/output operations, when a task voluntarily yields the CPU, on hardware interrupts, and when the operating system scheduler decides that a process has expired its fair share of CPU time (e.g, by the Completely Fair Scheduler of the Linux kernel).

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

---

## 현대 OS가 프로세스 간 직접 통신을 막고 IPC를 제공하는 이유는?

### Official Answer
For security and reliability, most modern operating systems prevent direct communication between independent processes, providing strictly mediated and controlled inter-process communication.

> #### AI Annotation:
> 프로세스끼리 직접 메모리를 들여다볼 수 없게 격리한다.
> A 프로세스가 B의 메모리를 마음대로 읽으면 보안 사고 → OS가 중간에서 통제하는 IPC(파이프, 소켓, 공유 메모리 등)만 허용한다.

> #### Official Annotation:
> When processes need to communicate with each other they must share parts of their address spaces or use other forms of inter-process communication (IPC).
> For instance in a shell pipeline, the output of the first process needs to pass to the second one, and so on.

> #### AI Annotation:
> `ls | grep .md`에서 `ls`의 stdout이 `grep`의 stdin으로 파이프로 연결되는 것이 IPC의 대표적 실례.

> #### Official Annotation:
> Simplified sharing and communication of threads: unlike processes, which require a message passing or shared memory mechanism to perform inter-process communication (IPC), threads can communicate through data, code and files they already share.
> — https://en.wikipedia.org/wiki/Thread_(computing)

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## 부모 프로세스와 자식 프로세스의 관계는 어떻게 형성되는가?

### Official Answer
It is usual to associate a single process with a main program, and child processes with any spin-off, parallel processes, which behave like asynchronous subroutines.

> #### AI Annotation:
> 메인 프로그램 = 부모 프로세스, 파생된 병렬 프로세스 = 자식 프로세스.
> 자식은 비동기 서브루틴처럼 독립적으로 실행된다.
> Node.js에서 `child_process.fork()`로 무거운 작업을 별도 프로세스에 위임하는 것이 이 패턴.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## 프로세스가 blocked 상태가 되는 조건과, 가상 메모리 시스템에서 blocked 프로세스의 메모리는 어떻게 처리되는가?

### Official Answer
If a process requests something for which it must wait, it will be blocked.
When the process is in the blocked state, it is eligible for swapping to disk, but this is transparent in a virtual memory system, where regions of a process's memory may be really on disk and not in main memory at any time.
Even portions of active processes/tasks (executing programs) are eligible for swapping to disk, if the portions have not been used recently.
Not all parts of an executing program and its data have to be in physical memory for the associated process to be active.

> #### AI Annotation:
> I/O 완료, 락 해제 등 기다려야 할 리소스가 있으면 blocked 상태가 된다.
> 가상 메모리 덕분에 프로세스 입장에서는 투명하게 디스크로 스와핑될 수 있다.
> 실행 중인 프로세스조차 전부 물리 메모리에 있을 필요 없이, 최근 사용되지 않은 부분은 디스크에 둔다.
> 프로그램이 4GB인데 RAM이 2GB여도 실행 가능한 이유.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## 프로세스의 상태 전이(lifecycle)에서 waiting과 blocked의 차이는?

### Official Answer
First, the process is "created" by being loaded from a secondary storage device (hard disk drive, CD-ROM, etc.) into main memory.
After that the process scheduler assigns it the "waiting" state.
While the process is "waiting", it waits for the scheduler to do a so-called context switch.
The context switch loads the process into the processor and changes the state to "running" while the previously "running" process is stored in a "waiting" state.
If a process in the "running" state needs to wait for a resource (wait for user input or file to open, for example), it is assigned the "blocked" state.
The process state is changed back to "waiting" when the process no longer needs to wait (in a blocked state).
Once the process finishes execution, or is terminated by the operating system, it is no longer needed.
The process is removed instantly or is moved to the "terminated" state.

> #### AI Annotation:
> 상태 전이 흐름:
> ```
> created → waiting → running → terminated
>                ↑        ↓
>                └─ blocked ←┘
> ```
> waiting = CPU 차례를 기다리는 준비 완료 상태 (= ready).
> blocked = I/O 등 외부 자원을 기다리는 상태 (아직 준비 안 됨).
> blocked에서 자원을 확보하면 running이 아니라 waiting으로 돌아가서 다시 스케줄러의 선택을 기다린다.

### Review Note
- Official Answer가 8문장으로 긴 편이지만, 상태 전이 흐름을 순서대로 설명하는 연결된 내용이라 분리하면 오히려 흐름이 끊김

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)
