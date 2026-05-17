---
tags: [os, concept]
source: official
---

# Questions
- PCB(프로세스 제어 블록)란 무엇인가?
  - PCB는 왜 프로세스 자신이 직접 읽거나 수정할 수 없는 보호된 메모리 영역에 보관되어야 하는가?
- 터미널에서 `cd`를 실행하면 변경된 현재 디렉토리 경로는 OS가 어디에 보관하는가?

---

# Answers

## PCB(프로세스 제어 블록)란 무엇인가?

### Official Answer
The operating system holds most of this information about active processes in data structures called process control blocks.
Any subset of the resources, typically at least the processor state, may be associated with each of the process' threads in operating systems that support threads or child processes.

— https://en.wikipedia.org/wiki/Process_(computing)

#### Definition

A process control block (PCB), also sometimes called a process descriptor, is a data structure used by a computer operating system to store all the information about a process.
When a process is created (initialized or installed), the operating system creates a corresponding process control block, which specifies and tracks the process state (i.e. new, ready, running, waiting or terminated).
Since it is used to track process information, the PCB plays a key role in context switching.

— https://en.wikipedia.org/wiki/Process_control_block

#### Categories

In multitasking operating systems, the PCB stores data needed for correct and efficient process management.
Though the details of these structures are system-dependent, common elements fall in three main categories:
- Process identification
- Process state
- Process control

— https://en.wikipedia.org/wiki/Process_control_block

#### Process identification

Process identification data include a unique identifier for the process (almost invariably an integer) and, in a multiuser-multitasking system, data such as the identifier of the parent process, user identifier, user group identifier, etc.
The process id is particularly relevant since it is often used to cross-reference the tables defined above, e.g. showing which process is using which I/O devices, or memory areas.

— https://en.wikipedia.org/wiki/Process_control_block

#### Process state

Process state data define the status of a process when it is suspended, allowing the OS to restart it later.
This always includes the content of general-purpose CPU registers, the CPU process status word, stack and frame pointers, etc.

— https://en.wikipedia.org/wiki/Process_control_block

#### Process control

Process control information is used by the OS to manage the process itself. This includes:
- Process scheduling state – The state of the process in terms of "ready", "suspended", etc., and other scheduling information as well, such as priority value, the amount of time elapsed since the process gained control of the CPU or since it was suspended.
- Process structuring information – the process's children id's, or the id's of other processes related to the current one in some functional way;
- Interprocess communication information – flags, signals and messages associated with the communication among independent processes;
- Process Privileges – allowed/disallowed access to system resources;
- Process State – new, ready, running, waiting, dead;
- Process Number (PID) – unique identification number for each process;
- Program Counter (PC) – a pointer to the address of the next instruction to be executed for this process;
- CPU Registers – register set where process needs to be stored for execution for running state;
- CPU Scheduling Information – information scheduling CPU time;
- Memory Management Information – page table, memory limits, segment table;
- Accounting Information – amount of CPU used for process execution, time limits, execution ID etc.;
- I/O Status Information – list of I/O devices allocated to the process.

— https://en.wikipedia.org/wiki/Process_control_block

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)
- https://en.wikipedia.org/wiki/Process_control_block

---

## PCB는 왜 프로세스 자신이 직접 읽거나 수정할 수 없는 보호된 메모리 영역에 보관되어야 하는가?

### Official Answer
PCB must be kept in an area of memory protected from normal process access.
In some operating systems the PCB is placed at the bottom of the process stack.

> #### Key Terms:
> - **process stack**: 프로세스의 함수 콜 스택. PCB를 스택 맨 아래에 두면 스택 오버플로우가 발생해야만 PCB 영역에 도달한다

> #### AI Annotation:
> 프로세스가 자신의 PCB를 수정할 수 있다면 PID 변조, 권한(Privilege) 필드 상승, 스케줄링 우선순위 임의 변경 같은 보안 침해가 가능해진다.
> 커널만 PCB에 접근하게 격리함으로써 OS 프로세스 관리의 신뢰성을 보장한다.

### Reference
- https://en.wikipedia.org/wiki/Process_control_block

---

## 터미널에서 `cd`를 실행하면 변경된 현재 디렉토리 경로는 OS가 어디에 보관하는가?

### Official Answer
The current working directory of a process is one of the properties that the kernel stores in the process's PCB.

> #### Key Terms:
> - **current working directory**: 프로세스가 현재 작업 중인 디렉토리 경로. 상대 경로 해석의 기준점

> #### AI Annotation:
> Node.js의 `process.cwd()`가 반환하는 값이 정확히 이 PCB 속성이다.
> 터미널에서 `cd /home/user`를 실행하면 해당 shell 프로세스의 PCB에 저장된 CWD 값이 갱신된다.

### Reference
- https://en.wikipedia.org/wiki/Process_control_block
