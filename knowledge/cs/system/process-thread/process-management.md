---
tags: [os, concept]
source: official
---

# Questions
- OS가 프로세스들을 서로 격리하는 방법과 이유, 격리 실패 시 문제, 그리고 격리된 프로세스 간 통신 방법은?
- 부모 프로세스와 자식 프로세스의 관계는 어떻게 형성되는가?
  - [UNVERIFIED] 부모 프로세스가 자식 프로세스를 생성하고 종료하는 과정은 어떤 시스템 콜로 이루어지는가?
- 프로세스의 상태 전이(lifecycle) 전체 흐름과 각 상태의 의미는?

---

# Answers

## OS가 프로세스들을 서로 격리하는 방법과 이유, 격리 실패 시 문제, 그리고 격리된 프로세스 간 통신 방법은?

### Official Answer
The operating system keeps its processes separate and allocates the resources they need, so that they are less likely to interfere with each other and cause system failures (e.g., deadlock or thrashing).
For security and reliability, most modern operating systems prevent direct communication between independent processes, providing strictly mediated and controlled inter-process communication.
The operating system may also provide mechanisms for inter-process communication to enable processes to interact in safe and predictable ways.

> #### AI Annotation:
> deadlock = A가 B의 자원을 기다리고, B가 A의 자원을 기다려서 둘 다 영원히 멈추는 상태.
> thrashing = 메모리 부족으로 페이지 교체가 과도하게 발생하여, 실제 작업보다 교체에 시간을 더 쓰는 상태.
> 격리하되, 필요 시 IPC로 통제된 통신을 허용한다.

> #### User Annotation:
> 한 프로세스가 죽어도 다른 프로세스가 같이 망가지지 않는다. Chrome 탭 10개 중 1개에서 문제가 생겨도 나머지 9개는 계속 동작한다.

> #### AI Annotation:
> 프로세스끼리 직접 메모리를 들여다볼 수 없게 격리한다.
> A 프로세스가 B의 메모리를 마음대로 읽으면 보안 사고 → OS가 중간에서 통제하는 IPC(파이프, 소켓, 공유 메모리 등)만 허용한다.

> #### Official Annotation:
> When processes need to communicate with each other they must share parts of their address spaces or use other forms of inter-process communication (IPC).
> For instance in a shell pipeline, the output of the first process needs to pass to the second one, and so on.

> #### AI Annotation:
> `ls | grep .md`에서 `ls`의 stdout이 `grep`의 stdin으로 파이프로 연결되는 것이 IPC의 대표적 실례.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## 부모 프로세스와 자식 프로세스의 관계는 어떻게 형성되는가?

### Official Answer
It is usual to associate a single process with a main program, and child processes with any spin-off, parallel processes.

> #### AI Annotation:
> 메인 프로그램 = 부모 프로세스, 파생된 병렬 프로세스 = 자식 프로세스.
> Node.js에서 `child_process.fork()`로 무거운 작업을 별도 프로세스에 위임하는 것이 이 패턴.

> #### User Annotation:
> 자식 프로세스는 부모 프로세스로부터 리소스 권한과 스케줄링 속성을 상속받는다.
> 단, 부모가 가진 자원의 부분집합만을 사용하도록 제한된다.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## [UNVERIFIED] 부모 프로세스가 자식 프로세스를 생성하고 종료하는 과정은 어떤 시스템 콜로 이루어지는가?

### User Answer
일반적인 생성/종료 흐름:
- `fork()` (시스템 콜)로 새로운 프로세스(자식 프로세스)를 생성한다.
- `exec()` (시스템 콜)로 새로운 프로그램을 메모리에 적재해서 실행을 시작한다.
- 자식 프로세스가 종료될 때까지 부모 프로세스는 `wait()`으로 기다린다.
- 자식 프로세스는 `exit()`을 통해 종료된다.
  - `exit()`은 OS에게 프로세스가 할당받았던 자원을 반납하는 것이다.
  - OS에 의해 할당된 자원은 해제된다.
- 부모 프로세스는 실행을 재개한다.

예외적으로 `abort()`로 자식 프로세스를 강제 종료시키는 경우도 있다:
- 자식이 할당된 자원의 사용량을 초과하는 경우.
- 자식 task가 더 이상 필요하지 않은 경우.
- 부모가 종료되었는데 자식만 실행되는 경우.

---

## 프로세스의 상태 전이(lifecycle) 전체 흐름과 각 상태의 의미는?

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
