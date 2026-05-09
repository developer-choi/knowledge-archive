---
tags: [os, concept]
---

# Questions
- 프로세스란 무엇이며, 프로그램과 어떻게 다른가?
  - 프로세스는 무엇으로 구성되는가?
    - [UNVERIFIED] 프로세스를 처음 만들 때, OS는 자료구조에 무엇을 저장해야 하나요?
    - [UNVERIFIED] 프로세스 실행 중 컨텍스트 스위치가 발생할 때, OS는 자료구조에 무엇을 저장해야 하나요?
    - [UNVERIFIED] 여러 프로세스가 CPU를 동시에 원할 수 있는 상황에서, OS가 실행 순서를 정하려면 자료구조에 무엇을 저장해야 하나요?
    - 프로세스의 메모리 영역은 어떤 구성 요소를 포함하는가?
    - [PCB(프로세스 제어 블록)란 무엇인가?](process-control-block.md)

---

# Answers

## 프로세스란 무엇이며, 프로그램과 어떻게 다른가?

### Official Answer
In computing, a process is the instance of a computer program that is being executed by one or many threads.
While a computer program is typically stored in a file on disk, a process is the execution of those instructions after being loaded from the disk into memory.

> #### AI Annotation:
> 프로그램 = 디스크에 저장된 정적 파일 (요리책), 프로세스 = 메모리에 올라가서 실행 중인 동적 실체 (요리하는 행위).
> OOP로 비유하면 프로그램이 클래스, 프로세스가 인스턴스.

> #### User Annotation:
> 프로세스는 흔히 "잡(job)"이라는 단어로도 쓰인다.
> 잡 스케줄링 = 프로세스 스케줄링 같은 뜻이다.

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)

---

## 프로세스는 무엇으로 구성되는가?

### Official Answer
A process comprises the program code, assigned system resources, physical and logical access permissions, and data structures to initiate, control and coordinate execution activity.

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

## [UNVERIFIED] 프로세스를 처음 만들 때, OS는 자료구조에 무엇을 저장해야 하나요?

### AI Answer
`node app.js`를 치는 순간 OS는 PCB(프로세스 제어 블록)라는 자료구조를 만든다. 이 PCB가 없으면 OS는 이 프로세스의 존재 자체를 모른다.

OS가 이 시점에 저장해야 하는 것들:

- **Program Counter 초기값**: V8이 `app.js`를 컴파일한 기계어의 첫 번째 명령어 주소. 이게 없으면 OS가 CPU를 줄 때 "첫 줄이 어디야?"를 모른다.
- **PID(Process ID)**: OS가 수십 개 프로세스를 동시에 관리하니까 각각을 구분할 번호. Task Manager에서 보이는 그 숫자.
- **메모리 한도와 할당된 주소 범위**: 이게 없으면 `node app.js` 하나가 RAM 전체를 먹어버릴 수 있다.
- **부모 PID**: 셸에서 `node app.js`를 실행했으면 셸이 부모. 자식이 종료됐을 때 부모한테 알려줘야 하니까 기록해둔다.
- **권한 정보**: 파일 접근 권한, 소유자 정보. `app.js`가 `/etc/passwd`를 읽을 수 있는지 없는지가 여기서 결정된다.

요약: "이 프로세스가 누구고, 어디서 시작하고, 얼마나 쓸 수 있고, 누가 낳았고, 뭘 할 수 있는지"를 처음 만드는 순간 PCB에 다 적어둔다.

---

## [UNVERIFIED] 프로세스 실행 중 컨텍스트 스위치가 발생할 때, OS는 자료구조에 무엇을 저장해야 하나요?

### AI Answer
컨텍스트 스위치 시 갱신·저장되는 값들:
- Program Counter: 중단 시점의 명령어 주소로 덮어씌워짐. 이게 없으면 재개 시 어디서 이어야 할지 몰라 프로세스가 처음부터 다시 실행되거나 엉뚱한 주소에서 재개됩니다.
- CPU 레지스터 상태: 중단 시점 레지스터 값 전체 저장. for문 1억 번 돌다 중단됐을 때 `i` 값이 여기 들어있는데, 이게 없으면 재개 시 `i`가 날아가서 처음부터 다시 돕니다.

---

## [UNVERIFIED] 여러 프로세스가 CPU를 동시에 원할 수 있는 상황에서, OS가 실행 순서를 정하려면 자료구조에 무엇을 저장해야 하나요?

### AI Answer
OS가 여러 프로세스의 실행 순서를 정하려면 PCB에 스케줄링 우선순위, 현재 프로세스 상태(ready / running / blocked), CPU 사용 시간 통계를 저장해야 한다.
스케줄러는 ready 상태인 프로세스들 중에서만 다음 실행자를 고르고, 공정 스케줄러(Linux CFS 등)는 CPU를 가장 적게 받은 프로세스에게 우선권을 준다.

---

## 프로세스의 메모리 영역은 어떤 구성 요소를 포함하는가?

### Official Answer
Memory (typically some region of virtual memory); which includes the executable code, process-specific data (input and output), a call stack (to keep track of active subroutines and/or other events), and a heap to hold intermediate computation data generated during run time.

> #### AI Annotation:
> 프로세스의 메모리 = 코드 + 데이터 + 콜 스택 + 힙.
> JS의 콜 스택(함수 호출 추적)과 힙(객체/배열 등 동적 데이터)이 바로 프로세스 메모리 영역에 해당한다.

> #### User Annotation:
> 프로세스는 메모리상의 특정 위치를 OS에게 할당받고, 내부적으로 메모리 크기를 동적으로 조절한다.
> 네 영역으로 세분화하면:
> - 텍스트 영역: 실제 실행 코드가 들어있다.
> - 데이터 영역: 프로그램 실행부터 종료까지 지워지지 않는 데이터가 저장된다 (전역 변수 등).
> - 스택: 매개변수, 지역변수 등 임시 데이터가 저장된다. 컴파일 시점에 메모리 크기가 결정되고 주소값은 가장 위에 할당된다.
> - 힙: 프로그램 실행 시 동적으로 할당되는 영역 (= 런타임).

### Reference
- https://en.wikipedia.org/wiki/Process_(computing)
