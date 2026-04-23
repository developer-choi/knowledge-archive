---
tags: [os, concept]
---

# Questions
- PCB(프로세스 제어 블록)란 무엇인가?
  - OS 커널은 실행 중인 모든 프로세스의 PCB를 어디에 모아서 관리하는가?
  - 컨텍스트 스위치 시 커널이 실제로 수행하는 두 단계 작업은?
  - PCB는 왜 프로세스 자신이 직접 읽거나 수정할 수 없는 보호된 메모리 영역에 보관되어야 하는가?
- 터미널에서 `cd`를 실행하면 변경된 현재 디렉토리 경로는 OS가 어디에 보관하는가?

---

# Answers

## PCB(프로세스 제어 블록)란 무엇인가?

### Official Answer
The operating system holds most of this information about active processes in data structures called process control blocks.
Any subset of the resources, typically at least the processor state, may be associated with each of the process' threads in operating systems that support threads or child processes.

> #### Official Annotation:
> A process control block (PCB), also sometimes called a process descriptor, is a data structure used by a computer operating system to store all the information about a process.
> When a process is created (initialized or installed), the operating system creates a corresponding process control block, which specifies and tracks the process state (i.e. new, ready, running, waiting or terminated).
> Since it is used to track process information, the PCB plays a key role in context switching.
> — https://en.wikipedia.org/wiki/Process_control_block

> #### Official Annotation:
> In multitasking operating systems, the PCB stores data needed for correct and efficient process management.
> Though the details of these structures are system-dependent, common elements fall in three main categories:
> - Process identification
> - Process state
> - Process control
> — https://en.wikipedia.org/wiki/Process_control_block

> #### Official Annotation:
> Process identification data include a unique identifier for the process (almost invariably an integer) and, in a multiuser-multitasking system, data such as the identifier of the parent process, user identifier, user group identifier, etc.
> The process id is particularly relevant since it is often used to cross-reference the tables defined above, e.g. showing which process is using which I/O devices, or memory areas.
> — https://en.wikipedia.org/wiki/Process_control_block

> #### Official Annotation:
> Process state data define the status of a process when it is suspended, allowing the OS to restart it later.
> This always includes the content of general-purpose CPU registers, the CPU process status word, stack and frame pointers, etc.
> — https://en.wikipedia.org/wiki/Process_control_block

> #### Official Annotation:
> Process control information is used by the OS to manage the process itself. This includes:
> - Process scheduling state – The state of the process in terms of "ready", "suspended", etc., and other scheduling information as well, such as priority value, the amount of time elapsed since the process gained control of the CPU or since it was suspended.
> - Process structuring information – the process's children id's, or the id's of other processes related to the current one in some functional way;
> - Interprocess communication information – flags, signals and messages associated with the communication among independent processes;
> - Process Privileges – allowed/disallowed access to system resources;
> - Process State – new, ready, running, waiting, dead;
> - Process Number (PID) – unique identification number for each process;
> - Program Counter (PC) – a pointer to the address of the next instruction to be executed for this process;
> - CPU Registers – register set where process needs to be stored for execution for running state;
> - CPU Scheduling Information – information scheduling CPU time;
> - Memory Management Information – page table, memory limits, segment table;
> - Accounting Information – amount of CPU used for process execution, time limits, execution ID etc.;
> - I/O Status Information – list of I/O devices allocated to the process.
> — https://en.wikipedia.org/wiki/Process_control_block

> #### AI Annotation:
> PCB = 프로세스 하나당 하나씩 존재하는 OS 내부 자료구조로, 코드·메모리·파일 디스크립터·권한·레지스터 상태를 모두 담고 있다.
> 컨텍스트 스위치 시 PCB에서 상태를 저장/복원한다.
> 스레드는 프로세스의 자원을 공유하되, 각 스레드마다 독립적인 프로세서 상태(레지스터, PC)를 가진다.

> #### User Annotation:
> PCB는 프로세스가 생성될 때 같이 생성되고, 프로세스가 종료될 때 같이 소멸된다.
> 크게 다섯 개의 영역으로 구성된다:
> - Process State: 프로세스 상태를 나타내는 영역.
> - Program Counter: 프로세스가 다음에 실행할 명령어의 주소값. 인터럽트 발생 시 요청 작업 수행 후 기존 작업을 이어서 할 때 필요하다.
> - CPU 레지스터: Accumulator, Index Register, Stack Register 등.
> - Memory Limit.
> - CPU 스케줄링 정보: 프로세스 우선순위, 스케줄링 큐에 대한 포인터 등.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)
- https://en.wikipedia.org/wiki/Process_control_block

---

## OS 커널은 실행 중인 모든 프로세스의 PCB를 어디에 모아서 관리하는가?

### Official Answer
An operating system kernel stores PCBs in a process table.

> #### Key Terms:
> - **process table**: 커널이 모든 PCB를 담아두는 자료구조. 실행 중인 프로세스 전체를 조회할 때 사용

> #### AI Annotation:
> `ps aux` 명령이 출력하는 프로세스 목록이 사실상 process table을 읽은 결과다.
> process table이 없으면 OS가 "지금 어떤 프로세스가 실행 중인가"를 한눈에 파악할 방법이 없다.

### Reference
- https://en.wikipedia.org/wiki/Process_control_block

---

## 컨텍스트 스위치 시 커널이 실제로 수행하는 두 단계 작업은?

### Official Answer
During context switch, the running process is stopped and another process runs.
The kernel must stop the execution of the running process, copy out the values in hardware registers to its PCB, and update the hardware registers with the values from the PCB of the new process.

> #### Key Terms:
> - **hardware registers**: CPU 내부의 초고속 저장 공간. 실행 중인 프로세스가 현재 쓰고 있는 값들(PC, 레지스터 등)이 담겨있다

> #### AI Annotation:
> 두 단계 요약:
> 1. 현재 프로세스의 CPU 레지스터 값 전체 → 해당 프로세스의 PCB에 복사(저장)
> 2. 새 프로세스의 PCB에서 레지스터 값 꺼내 → CPU 하드웨어 레지스터에 덮어씌움(복원)
>
> `node app.js` 실행 중 OS 타임슬라이스가 만료되면 V8의 현재 PC·레지스터 값이 PCB에 저장되고, 다른 프로세스가 CPU를 받는다.
> 저장 단계가 없으면 이전 프로세스의 실행 위치가 사라지고, 복원 단계가 없으면 새 프로세스가 엉뚱한 CPU 상태에서 시작된다.

### Reference
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
