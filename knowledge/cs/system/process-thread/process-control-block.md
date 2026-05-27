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
Any subset of the resources, typically at least the processor state, may be associated with each of the process' threads.

#### Definition

A process control block (PCB), also sometimes called a process descriptor, is a data structure used by a computer operating system to store all the information about a process.
When a process is created, the operating system creates a corresponding process control block.

#### Categories

Common elements fall in three main categories:
- Process identification
- Process state
- Process control

#### Process state

Process state data allowing the OS to restart it later.
This always includes the content of general-purpose CPU registers, the CPU process status word, stack and frame pointers, etc.

#### Process control

Process control information is used by the OS to manage the process itself. This includes:
- Process scheduling state – The state of the process in terms of "ready", "suspended", etc., and other scheduling information as well, such as priority value, the amount of time elapsed since the process gained control of the CPU or since it was suspended.
- CPU Scheduling Information – information scheduling CPU time;
- Accounting Information – amount of CPU used for process execution, time limits, execution ID etc.;
- Interprocess communication information – flags, signals and messages associated with the communication among independent processes;
- Process Privileges – allowed/disallowed access to system resources;
- Memory Management Information – page table, memory limits, segment table;
- I/O Status Information – list of I/O devices allocated to the process.

> #### User Annotation:
> 원래 저기에 더 있는데 이제까지 배웠던것들이라서 그냥 다 지움.

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
