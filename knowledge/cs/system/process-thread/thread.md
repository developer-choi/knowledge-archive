---
tags: [os, concept]
---

# Questions
- [스레드(thread)란 무엇이며, 프로세스와 어떤 관계인가?](#스레드thread란-무엇이며-프로세스와-어떤-관계인가)
  - [같은 프로세스의 스레드들이 자원을 공유한다고 할 때, 구체적으로 어떤 데이터를 공유하고 어떤 데이터는 스레드마다 독립인가?](#같은-프로세스의-스레드들이-자원을-공유한다고-할-때-구체적으로-어떤-데이터를-공유하고-어떤-데이터는-스레드마다-독립인가)
- [유저 스레드(user thread)란 무엇이며, 커널 스레드와 어떤 점에서 다른가?](#유저-스레드user-thread란-무엇이며-커널-스레드와-어떤-점에서-다른가)
  - [커널 스레드가 소유하는 자원은 무엇이며, 프로세스와 비교해 생성/파괴가 저렴한 이유는?](#커널-스레드가-소유하는-자원은-무엇이며-프로세스와-비교해-생성파괴가-저렴한-이유는)
  - [유저 스레드에서 블로킹 시스템 콜이 문제가 되는 이유와, 이를 해결하는 방법은?](#유저-스레드에서-블로킹-시스템-콜이-문제가-되는-이유와-이를-해결하는-방법은)
- [프로세스 전환(context switch)이 스레드 전환보다 비용이 큰 이유는?](#프로세스-전환context-switch이-스레드-전환보다-비용이-큰-이유는)
- [스레드가 같은 주소 공간을 공유하는 것의 위험성은 무엇이며, 실제 소프트웨어에서 이를 어떻게 회피하는가?](#스레드가-같은-주소-공간을-공유하는-것의-위험성은-무엇이며-실제-소프트웨어에서-이를-어떻게-회피하는가)
- [현대 OS(Linux, Windows, macOS)가 채택한 1:1 스레딩 모델이란 무엇인가?](#현대-oslinux-windows-macos가-채택한-11-스레딩-모델이란-무엇인가)
  - [M:1 스레딩 모델에서 멀티코어 CPU의 성능을 활용할 수 없는 이유는?](#m1-스레딩-모델에서-멀티코어-cpu의-성능을-활용할-수-없는-이유는)
  - [M:N 스레딩 모델이란 무엇이며, 어떤 런타임이 이를 사용하는가?](#mn-스레딩-모델이란-무엇이며-어떤-런타임이-이를-사용하는가)
- [스레드가 공유 데이터에 동시 접근할 때 발생하는 race condition이란 무엇이며, 이를 방지하는 방법은?](#스레드가-공유-데이터에-동시-접근할-때-발생하는-race-condition이란-무엇이며-이를-방지하는-방법은)
- [스레드 풀(thread pool)이란 무엇이며, 매번 새 스레드를 생성하는 것과 비교해 어떤 이점이 있는가?](#스레드-풀thread-pool이란-무엇이며-매번-새-스레드를-생성하는-것과-비교해-어떤-이점이-있는가)
- [싱글스레드 프로그램에서 오래 걸리는 작업이 UI를 멈추게 하는 문제를, 멀티스레딩 없이도 해결할 수 있는가?](#싱글스레드-프로그램에서-오래-걸리는-작업이-ui를-멈추게-하는-문제를-멀티스레딩-없이도-해결할-수-있는가)
- [멀티스레드 프로그램이 본질적으로 테스트하기 어려운 이유와, 이를 완화하는 설계 패턴은?](#멀티스레드-프로그램이-본질적으로-테스트하기-어려운-이유와-이를-완화하는-설계-패턴은)
- [GIL(Global Interpreter Lock)이란 무엇이며, 멀티코어 환경에서 어떤 한계를 만드는가?](#gilglobal-interpreter-lock이란-무엇이며-멀티코어-환경에서-어떤-한계를-만드는가)

---

# Answers

## 스레드(thread)란 무엇이며, 프로세스와 어떤 관계인가?

### Official Answer
In computer science, a thread of execution is the smallest sequence of programmed instructions that can be managed independently by a scheduler, which is typically a part of the operating system.
In many cases, a thread is a component of a process.

> #### AI Annotation:
> 프로세스 = 자원의 단위(메모리, 파일 핸들 등), 스레드 = 실행의 단위(CPU 스케줄링).
> 하나의 프로세스 안에 스레드가 1개 이상 존재한다.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 같은 프로세스의 스레드들이 자원을 공유한다고 할 때, 구체적으로 어떤 데이터를 공유하고 어떤 데이터는 스레드마다 독립인가?

### Official Answer
The multiple threads of a given process may be executed concurrently (via multithreading capabilities), sharing resources such as memory, while different processes do not share these resources.
In particular, the threads of a process share its executable code and the values of its dynamically allocated variables and non-thread-local global variables at any given time.

> #### AI Annotation:
> 공유 = 코드 영역 + 힙(동적 할당) + 전역변수.
> 독립 = 스택 + thread-local 변수.
> JS의 Web Worker는 기본적으로 메모리를 공유하지 않아서 `SharedArrayBuffer`를 명시적으로 사용해야 하지만, 네이티브 스레드는 기본이 공유다.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 유저 스레드(user thread)란 무엇이며, 커널 스레드와 어떤 점에서 다른가?

### Official Answer
At the kernel level, a process contains one or more kernel threads, which share the process's resources, such as memory and file handles – a process is a unit of resources, while a thread is a unit of scheduling and execution.
Kernel scheduling is typically uniformly done preemptively or, less commonly, cooperatively.
At the user level a process such as a runtime system can itself schedule multiple threads of execution.
If these do not share data, as in Erlang, they are usually analogously called processes, while if they share data they are usually called (user) threads, particularly if preemptively scheduled.

> #### AI Annotation:
> 커널 스레드 = OS가 직접 스케줄링. 유저 스레드 = 런타임/라이브러리가 사용자 공간에서 스케줄링하며 커널은 존재를 모른다.
> Node.js의 이벤트 루프, Go의 goroutine이 유저 수준 스케줄링의 예.
> 데이터 공유 여부로 용어가 갈린다: 공유 O → 유저 스레드, 공유 X → 프로세스(Erlang 액터 모델).

> #### Official Annotation:
> Kernel threads do not own resources except for a stack, a copy of the registers including the program counter, and thread-local storage (if any), and are thus relatively cheap to create and destroy.
> As user thread implementations are typically entirely in userspace, context switching between user threads within the same process is extremely efficient because it does not require any interaction with the kernel at all.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 커널 스레드가 소유하는 자원은 무엇이며, 프로세스와 비교해 생성/파괴가 저렴한 이유는?

### Official Answer
Kernel threads do not own resources except for a stack, a copy of the registers including the program counter, and thread-local storage (if any), and are thus relatively cheap to create and destroy.
Thread switching is also relatively cheap: it requires a context switch (saving and restoring registers and stack pointer), but does not change virtual memory and is thus cache-friendly (leaving TLB valid).

> #### AI Annotation:
> 커널 스레드의 소유물 = 스택 + 레지스터(PC 포함) + TLS. 나머지(메모리, 파일 핸들)는 프로세스 것을 공유.
> 프로세스 생성 = 주소 공간·파일 디스크립터·PCB 전부 새로 할당해야 하므로 비쌈.
> 스레드 생성 = 스택과 레지스터만 할당하면 되므로 저렴.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 유저 스레드에서 블로킹 시스템 콜이 문제가 되는 이유와, 이를 해결하는 방법은?

### Official Answer
However, the use of blocking system calls in user threads (as opposed to kernel threads) can be problematic.
If a user thread or a fiber performs a system call that blocks, the other user threads and fibers in the process are unable to run until the system call returns.
A common solution to this problem (used, in particular, by many green threads implementations) is providing an I/O API that implements an interface that blocks the calling thread, rather than the entire process, by using non-blocking I/O internally, and scheduling another user thread or fiber while the I/O operation is in progress.
Alternatively, the program can be written to avoid the use of synchronous I/O or other blocking system calls (in particular, using non-blocking I/O, including lambda continuations and/or async/await primitives).

> #### AI Annotation:
> 커널은 유저 스레드의 존재를 모르기 때문에, 하나가 블로킹 시스템 콜을 하면 커널 입장에서 프로세스 전체를 블로킹시킨다.
> Node.js는 libuv를 통해 내부적으로 논블로킹 I/O를 사용하고, I/O 완료를 기다리는 동안 이벤트 루프가 다른 콜백을 처리한다.
> `async/await`도 같은 원리의 문법적 추상화.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 프로세스 전환(context switch)이 스레드 전환보다 비용이 큰 이유는?

### Official Answer
A process is a heavyweight unit of kernel scheduling, as creating, destroying, and switching processes is relatively expensive.
Processes are typically preemptively multitasked, and process switching is relatively expensive, beyond basic cost of context switching, due to issues such as cache flushing (in particular, process switching changes virtual memory addressing, causing invalidation and thus flushing of an untagged translation lookaside buffer (TLB), notably on x86).

> #### AI Annotation:
> TLB = 가상 주소 → 물리 주소 변환을 캐싱하는 하드웨어 캐시.
> 프로세스 전환 = 집을 옮기는 것(주소 공간 바뀜 → TLB 전체 무효화).
> 스레드 전환 = 같은 집에서 방만 바꾸는 것(주소 공간 유지 → TLB 유효).

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 스레드가 같은 주소 공간을 공유하는 것의 위험성은 무엇이며, 실제 소프트웨어에서 이를 어떻게 회피하는가?

### Official Answer
Thread crashes a process: due to threads sharing the same address space, an illegal operation performed by a thread can crash the entire process; therefore, one misbehaving thread can disrupt the processing of all the other threads in the application.

> #### AI Annotation:
> Chrome의 멀티프로세스 아키텍처 — 탭마다 별도 프로세스이므로 한 탭이 크래시해도 다른 탭에 영향 없음.
> 스레드의 공유 모델(빠르고 가벼움)과 프로세스의 격리 모델(안전함) 사이의 트레이드오프.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 현대 OS(Linux, Windows, macOS)가 채택한 1:1 스레딩 모델이란 무엇인가?

### Official Answer
Threads created by the user in a 1:1 correspondence with schedulable entities in the kernel are the simplest possible threading implementation.
OS/2 and Win32 used this approach from the start, while on Linux the GNU C Library implements this approach (via the NPTL or older LinuxThreads).
This approach is also used by Solaris, NetBSD, FreeBSD, macOS, and iOS.

> #### AI Annotation:
> 1:1 = 유저 스레드 1개당 커널 스레드 1개가 대응.
> 단순하고, 멀티코어를 자연스럽게 활용 가능.
> 현대 주요 OS(Linux, Windows, macOS, iOS)가 전부 이 모델을 사용한다.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## M:1 스레딩 모델에서 멀티코어 CPU의 성능을 활용할 수 없는 이유는?

### Official Answer
An M:1 model implies that all application-level threads map to one kernel-level scheduled entity; the kernel has no knowledge of the application threads.
One of the major drawbacks, however, is that it cannot benefit from the hardware acceleration on multithreaded processors or multi-processor computers: there is never more than one thread being scheduled at the same time.
For example: If one of the threads needs to execute an I/O request, the whole process is blocked and the threading advantage cannot be used.

> #### AI Annotation:
> M개의 유저 스레드가 커널 스레드 1개에 매핑되므로, 코어가 아무리 많아도 한 번에 하나의 스레드만 실행된다.
> I/O 블로킹 시 전체 프로세스가 멈추는 문제도 이 구조에서 발생한다.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## M:N 스레딩 모델이란 무엇이며, 어떤 런타임이 이를 사용하는가?

### Official Answer
M:N maps some M number of application threads onto some N number of kernel entities, or "virtual processors."
This is a compromise between kernel-level ("1:1") and user-level ("N:1") threading.
In the M:N implementation, the threading library is responsible for scheduling user threads on the available schedulable entities; this makes context switching of threads very fast, as it avoids system calls.
However, this increases complexity and the likelihood of priority inversion, as well as suboptimal scheduling without extensive (and expensive) coordination between the userland scheduler and the kernel scheduler.

> #### AI Annotation:
> Go의 goroutine이 M:N 모델의 대표 사례: 수천 개의 goroutine을 소수의 OS 스레드에 매핑.
> 전환이 빠르지만, 유저 스케줄러와 커널 스케줄러 간 조율이 복잡하다.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 스레드가 공유 데이터에 동시 접근할 때 발생하는 race condition이란 무엇이며, 이를 방지하는 방법은?

### Official Answer
When shared between threads, however, even simple data structures become prone to race conditions if they require more than one CPU instruction to update: two threads may end up attempting to update the data structure at the same time and find it unexpectedly changing underfoot.
Bugs caused by race conditions can be very difficult to reproduce and isolate.
To prevent this, threading application programming interfaces (APIs) offer synchronization primitives such as mutexes to lock data structures against concurrent access.

> #### AI Annotation:
> `count++`조차 read → increment → write 3단계라 중간에 다른 스레드가 끼면 값이 꼬인다.
> JS는 싱글스레드라 기본적으로 이 문제가 없지만, SharedArrayBuffer + Worker 사용 시 `Atomics` API로 동기화가 필요하다.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 스레드 풀(thread pool)이란 무엇이며, 매번 새 스레드를 생성하는 것과 비교해 어떤 이점이 있는가?

### Official Answer
A popular programming pattern involving threads is that of thread pools where a set number of threads are created at startup that then wait for a task to be assigned.
When a new task arrives, it wakes up, completes the task and goes back to waiting.
This avoids the relatively expensive thread creation and destruction functions for every task performed and takes thread management out of the application developer's hand and leaves it to a library or the operating system that is better suited to optimize thread management.

> #### AI Annotation:
> Node.js의 libuv가 기본 4개의 스레드 풀로 fs, DNS, 암호화 등 블로킹 작업을 처리한다.
> `UV_THREADPOOL_SIZE` 환경변수로 조정 가능.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 싱글스레드 프로그램에서 오래 걸리는 작업이 UI를 멈추게 하는 문제를, 멀티스레딩 없이도 해결할 수 있는가?

### Official Answer
Responsiveness: multithreading can allow an application to remain responsive to input.
In a one-thread program, if the main execution thread blocks on a long-running task, the entire application can appear to freeze.
By moving such long-running tasks to a worker thread that runs concurrently with the main execution thread, it is possible for the application to remain responsive to user input while executing tasks in the background.
On the other hand, in most cases multithreading is not the only way to keep a program responsive, with non-blocking I/O and/or Unix signals being available for obtaining similar results.

> #### AI Annotation:
> 브라우저에서 CPU 집약 작업 → Web Worker로 분리.
> I/O 집약 작업 → `fetch`/`async-await`로 논블로킹 처리.
> 둘 다 메인 스레드 블로킹을 피하는 방법이지만 메커니즘이 다르다.
> Node.js가 싱글스레드이면서도 응답성이 좋은 이유 — 논블로킹 I/O + 이벤트 루프.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## 멀티스레드 프로그램이 본질적으로 테스트하기 어려운 이유와, 이를 완화하는 설계 패턴은?

### Official Answer
Being untestable: In general, multithreaded programs are non-deterministic, and as a result, are untestable.
In other words, a multithreaded program can easily have bugs which never manifest on a test system, manifesting only in production.
This can be alleviated by restricting inter-thread communications to certain well-defined patterns (such as message-passing).

> #### AI Annotation:
> 비결정적 = 실행할 때마다 스레드 실행 순서가 달라져서, 같은 입력에도 다른 결과가 나올 수 있다.
> 메시지 패싱 = 공유 메모리 대신 메시지로 통신하여 race condition을 원천 차단.
> Web Worker의 `postMessage`, Erlang의 액터 모델이 이 패턴.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---

## GIL(Global Interpreter Lock)이란 무엇이며, 멀티코어 환경에서 어떤 한계를 만드는가?

### Official Answer
A few interpreted programming languages have implementations (e.g., Ruby MRI for Ruby, CPython for Python) which support threading and concurrency but not parallel execution of threads, due to a global interpreter lock (GIL).
The GIL is a mutual exclusion lock held by the interpreter that can prevent the interpreter from simultaneously interpreting the application's code on two or more threads at once.
This effectively limits the parallelism on multiple core systems.
It also limits performance for processor-bound threads (which require the processor), but doesn't effect I/O-bound or network-bound ones as much.

> #### AI Annotation:
> Python(CPython)이 대표적 예. 스레드가 여러 개여도 한 번에 하나만 파이썬 코드를 실행 가능.
> Node.js도 싱글스레드이지만 GIL과는 다르다 — Node.js는 설계상 싱글스레드이고, CPython은 멀티스레드를 지원하되 GIL로 인해 사실상 싱글스레드처럼 동작한다는 차이.

### Reference
- https://en.wikipedia.org/wiki/Thread_(computing)

---
