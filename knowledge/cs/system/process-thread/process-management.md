---
tags: [os, concept]
source: official
priority:
---

# Questions
- OS가 프로세스들을 서로 격리하는 방법과 이유, 격리 실패 시 문제, 그리고 격리된 프로세스 간 통신 방법은?
- 부모 프로세스와 자식 프로세스의 관계는 어떻게 형성되는가?
- 프로세스의 상태 전이(lifecycle) 전체 흐름과 각 상태의 의미는?

---

# Answers

## OS가 프로세스들을 서로 격리하는 방법과 이유, 격리 실패 시 문제, 그리고 격리된 프로세스 간 통신 방법은?

### Official Answer
The operating system keeps its processes separate and allocates the resources they need, so that they are less likely to interfere with each other and cause system failures (e.g., deadlock or thrashing).
For security and reliability, most modern operating systems prevent direct communication between independent processes, providing strictly mediated and controlled inter-process communication.
The operating system may also provide mechanisms for inter-process communication to enable processes to interact in safe and predictable ways.

When processes need to communicate with each other they must share parts of their address spaces or use other forms of inter-process communication (IPC).
For instance in a shell pipeline, the output of the first process needs to pass to the second one, and so on.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## 부모 프로세스와 자식 프로세스의 관계는 어떻게 형성되는가?

### Official Answer
It is usual to associate a single process with a main program, and child processes with any spin-off, parallel processes.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

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

### Review Note
- Official Answer가 8문장으로 긴 편이지만, 상태 전이 흐름을 순서대로 설명하는 연결된 내용이라 분리하면 오히려 흐름이 끊김

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)
