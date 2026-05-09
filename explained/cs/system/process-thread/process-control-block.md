# PCB(프로세스 제어 블록)란 무엇인가?

> The operating system holds most of this information about active processes in data structures called process control blocks.
> Any subset of the resources, typically at least the processor state, may be associated with each of the process' threads in operating systems that support threads or child processes.

---

## 도입

OS는 수십~수백 개의 프로세스를 동시에 돌립니다. 그러려면 각 프로세스의 상태(메모리, 권한, CPU 레지스터, 파일 핸들 등)를 어딘가에 정리해둬야 하죠. 그 "프로세스의 신분증 + 상태 보관함" 역할을 하는 자료구조가 PCB입니다. 컨텍스트 스위치도 결국 PCB를 읽고 쓰는 작업.

---

## 본문

> The operating system holds most of this information about active processes in data structures called process control blocks.

OS는 활성 프로세스에 관한 이 정보의 대부분을, 프로세스 제어 블록(PCB)이라 불리는 자료구조에 보관한다.

- **active processes**: 현재 실행 중이거나 실행 가능한 상태의 프로세스. 종료된 프로세스는 PCB도 회수됩니다.
- **most of this information**: 이전 문맥에서 언급된 프로세스 정보 — 메모리 매핑, 파일 디스크립터, 레지스터 상태 등. PCB가 거의 전부 담는다는 뜻.
- **data structures called process control blocks**: 자료구조의 이름이 PCB. 책에 따라 process descriptor라고도 부릅니다.

> Any subset of the resources, typically at least the processor state,

자원의 어떤 부분집합이라도, 보통 적어도 프로세서 상태는,

- **subset of the resources**: 프로세스 자원 중 일부. 전부가 아니라 골라서 분리할 수 있다는 뜻.
- **at least the processor state**: 최소한 프로세서 상태(레지스터 값, PC 등)는 반드시. 이건 실행을 재개하려면 필수.

> may be associated with each of the process' threads in operating systems that support threads or child processes.

스레드나 자식 프로세스를 지원하는 OS에서는 프로세스의 각 스레드와 연관될 수 있다.

- **associated with each of the process' threads**: 각 스레드가 자기만의 프로세서 상태를 따로 가짐. 같은 프로세스 안의 스레드들은 메모리는 공유하지만 레지스터·PC는 독립.
- **threads or child processes**: 스레드 지원 OS, 또는 자식 프로세스 모델을 지원하는 OS. 현대 OS는 둘 다 지원.

---

## 종합

PCB의 구성 요소를 정리(여러 Official Annotation을 종합):

| 카테고리 | 항목 | 역할 |
|---|---|---|
| Process identification | PID, 부모 PID, 사용자 ID | 프로세스 식별 |
| Process state | 레지스터, PC, 스택/프레임 포인터, 상태(new/ready/running/waiting/terminated) | 실행 재개에 필요한 모든 상태 |
| Process control | 우선순위, IPC 정보, 권한, 메모리 한계, 페이지 테이블, I/O 자원 목록 | 관리/스케줄링 정보 |

JS/Node.js와 매핑:

- `process.pid` → PCB의 Process Number(PID)
- `process.cwd()` → PCB의 current working directory
- `process.memoryUsage()` → PCB의 Memory Management Information 일부
- `process.uid()` (POSIX) → PCB의 user identifier

이 모든 값이 결국 OS 커널 안 PCB의 필드에서 읽어오는 거라고 보면 됩니다. `node app.js` 실행 시 OS가 PCB를 만들어주고, JS 코드가 `process.xxx`를 호출할 때 시스템 콜을 통해 그 PCB의 값을 가져오는 흐름.

컨텍스트 스위치와의 관계: 프로세스를 전환할 때 커널이 하는 일이 본질적으로 "현재 프로세스의 PCB에 CPU 상태를 저장하고, 다음 프로세스의 PCB에서 CPU 상태를 복원"입니다. PCB가 없으면 전환 자체가 불가능. 멀티태스킹의 물리적 기반.

스레드와 PCB: 스레드가 있는 OS에서는 프로세스 자원(메모리, 파일 등) 대부분은 PCB에 한 번만 저장하고, 각 스레드는 자기만의 작은 TCB(Thread Control Block) — 스택 포인터, PC, 레지스터, TLS 정도 — 를 가집니다. 그래서 스레드 생성/전환이 프로세스보다 가벼운 것.

이게 없으면 어떻게 되는가: PCB가 없다면 OS가 "이 프로세스는 어디서 멈췄지?", "이 프로세스 메모리는 어디?", "권한은 뭐지?"를 매번 따로 찾아야 합니다. 사실상 멀티태스킹·멀티유저·보안 모두 불가능. PCB는 OS가 프로세스를 "관리할 수 있는 객체"로 다루기 위한 가장 기본적인 추상화.

User Annotation 보충: PCB는 프로세스 생성과 함께 만들어지고 종료와 함께 사라집니다. `fork()`나 `CreateProcess()`가 호출될 때 커널의 첫 작업 중 하나가 새 PCB 할당, `exit()` 시 마지막 작업 중 하나가 PCB 회수.

AI Annotation 보충: PCB는 한 프로세스당 하나씩만 존재하는 OS 내부 자료구조라, 일반 사용자 프로그램은 직접 보거나 수정할 수 없습니다. 시스템 콜 (`getpid()`, `getrlimit()` 등)이나 `/proc` 파일시스템(리눅스)을 통해 간접적으로만 일부 필드를 조회.

PCB의 구성 요소를 계층도로:

```
   PCB (Process Control Block)
   │
   ├── Process Identification
   │     ├── PID (Process ID)
   │     ├── Parent PID
   │     └── User ID
   │
   ├── Process State
   │     ├── CPU Registers (저장된 사본)
   │     ├── Program Counter (PC)
   │     ├── Stack Pointer (SP) / Frame Pointer
   │     └── State (new/ready/running/waiting/terminated)
   │
   └── Process Control
         ├── Priority (스케줄링 우선순위)
         ├── IPC 정보
         ├── 권한 / 메모리 한계
         ├── Page Table (가상→물리 매핑)
         ├── Open Files / I/O 자원 목록
         └── Current Working Directory
```

핵심: PCB는 "프로세스를 OS가 관리 가능한 객체로 다루기 위한 모든 정보"를 한 자료구조에 모은다. 컨텍스트 스위치 = PCB의 Process State 영역을 읽고 쓰는 작업.

---

# OS 커널은 실행 중인 모든 프로세스의 PCB를 어디에 모아서 관리하는가?

> An operating system kernel stores PCBs in a process table.

---

## 도입

PCB가 프로세스 1개당 하나씩 만들어진다면, 시스템에 100개 프로세스가 있으면 PCB도 100개. 이걸 어떻게 모아서 관리할까요? OS는 PCB들을 한 자료구조에 모아두고 인덱스처럼 활용합니다. 그게 process table — `ps`나 `top`이 출력하는 그 목록의 원본.

---

## 본문

> An operating system kernel stores PCBs in a process table.

OS 커널은 PCB들을 프로세스 테이블에 저장한다.

- **operating system kernel**: OS의 핵심 영역. 사용자 프로그램이 접근 못 하는 보호 영역에서 동작.
- **stores**: 단순히 한 곳에 두는 것이 아니라, 조회·삽입·삭제가 효율적이도록 보관.
- **process table**: 모든 PCB를 모아두는 컨테이너 자료구조. 보통 배열 + 해시맵, 또는 연결 리스트 형태.

---

## 종합

process table의 역할을 한 줄로: "OS가 시스템에 어떤 프로세스가 살아 있는지 한눈에 보는 인덱스".

JS 비유로 풀면: `Map<PID, PCB>`처럼 생각하면 직관적입니다. PID를 키로, PCB를 값으로 하는 맵. 스케줄러가 "다음에 어느 프로세스 돌릴까?"를 결정할 때, 부모 프로세스가 자식의 상태를 조회할 때, 시그널(`kill -9 1234`)을 보낼 때 — 모두 process table을 거칩니다.

`ps aux` / Task Manager의 정체: 이 명령들이 출력하는 프로세스 목록의 본질이 process table을 읽은 결과입니다. 리눅스의 `/proc` 파일시스템도 마찬가지 — `/proc/1234/status` 같은 파일은 PID 1234 프로세스의 PCB 일부를 읽기 좋은 텍스트로 노출한 것.

Node.js와의 연결: `process.pid`가 반환하는 정수가 process table에서 이 프로세스를 찾는 키. `child_process.spawn()`으로 자식 프로세스를 띄우면, OS가 새 PCB를 만들어 process table에 등록하고, 그 PID를 부모(Node.js)에게 돌려줍니다.

이게 없으면 어떻게 되는가: process table이 없다면 "지금 시스템에 어떤 프로세스가 있는지" 조회할 방법이 없어집니다. 스케줄러는 다음 프로세스를 찾을 수 없고, `kill` 명령은 대상을 식별 못 하고, `ps`도 동작 안 함. 그냥 PCB만 메모리 어딘가에 흩어져 있으면 OS는 그것들을 통제할 수 없습니다. 프로세스 관리의 인덱스 = process table.

오개념 예방: "process table = 단순 배열"이라고 생각하면 큰 시스템에서 비효율적입니다. 현대 OS는 PID로 빠르게 찾을 해시 구조 + 부모/자식 관계를 따라갈 트리 구조 + 상태별(ready/waiting) 큐 구조를 함께 사용합니다. 한 자료구조가 아니라 여러 인덱스의 조합으로 PCB를 관리.

AI Annotation 보충: 리눅스에서 `ps aux`의 결과 한 줄 한 줄이 process table 한 항목 ≈ PCB 하나. 사용자가 직접 PCB를 못 봐도, `/proc/<pid>/`를 읽으면 PCB의 거의 모든 필드(상태, 메모리 사용량, 열린 파일 디스크립터, 환경 변수 등)를 텍스트로 확인 가능.

---

# 컨텍스트 스위치 시 커널이 실제로 수행하는 두 단계 작업은?

> During context switch, the running process is stopped and another process runs.
> The kernel must stop the execution of the running process, copy out the values in hardware registers to its PCB, and update the hardware registers with the values from the PCB of the new process.

---

## 도입

"컨텍스트 스위치"는 추상적으로 들리지만, 실제로는 메모리 복사 두 번입니다. CPU 레지스터에 들어 있는 현재 상태를 PCB로 저장(save), 다음 프로세스의 PCB에서 상태를 꺼내 CPU에 복원(restore). 이 두 동작이 멀티태스킹의 물리적 핵심.

---

## 본문

> During context switch, the running process is stopped and another process runs.

컨텍스트 스위치 동안, 실행 중인 프로세스는 멈추고 다른 프로세스가 실행된다.

- **context switch**: 한 프로세스에서 다른 프로세스로 CPU 점유를 옮기는 작업. "context"는 그 프로세스가 CPU 위에서 실행 중일 때의 상태(레지스터·PC 등) 묶음.
- **the running process is stopped**: 현재 CPU에서 돌고 있던 프로세스가 일시 중단. 종료가 아니라 일시 중단이라는 점이 중요.
- **another process runs**: 다른 프로세스가 그 자리를 받음. 이때 새로 시작이 아니라, 이전에 멈춰뒀던 지점부터 이어서 실행.

> The kernel must stop the execution of the running process,

커널은 실행 중인 프로세스의 실행을 멈춰야 한다.

- **kernel must stop**: 커널이 강제로 멈춤. 사용자 코드는 자기가 멈추는지도 모릅니다.

> copy out the values in hardware registers to its PCB,

하드웨어 레지스터의 값을 그 프로세스의 PCB로 복사해 내보낸다(저장 단계).

- **hardware registers**: CPU 안에 있는 초고속 저장 공간. 현재 실행 중인 프로세스가 사용 중인 모든 값(범용 레지스터, PC, SP, 플래그 등)이 들어 있음.
- **copy out ... to its PCB**: CPU에서 PCB로 값을 빼내는 방향. PCB는 메모리에 있고, 레지스터는 CPU에 있으니 일종의 "CPU → 메모리 덤프".
- **its PCB**: 멈춘 그 프로세스의 PCB. 다른 PCB가 아니라 자기 PCB에 저장해야 나중에 자기 상태를 찾을 수 있음.

> and update the hardware registers with the values from the PCB of the new process.

그리고 새 프로세스의 PCB에 있는 값들로 하드웨어 레지스터를 갱신한다(복원 단계).

- **update the hardware registers**: 레지스터에 새 값을 덮어씀. CPU가 새 프로세스의 상태를 갖게 됨.
- **values from the PCB of the new process**: 다음으로 실행할 프로세스의 PCB에서 가져옴. 이전에 그 프로세스가 멈췄던 시점의 상태 그대로.

---

## 종합

두 단계를 시퀀스로:

```
1. SAVE
   현재 프로세스 (CPU 레지스터, PC, SP) → PCB(현재)

2. RESTORE
   PCB(다음 프로세스) → CPU 레지스터, PC, SP

→ CPU는 새 PC가 가리키는 명령어부터 실행 재개
```

JS/Node.js로 구체화: `node app.js`로 큰 for 루프를 돌고 있다고 합시다. OS의 시간 조각이 만료되면:

1. **SAVE**: V8이 지금 어느 명령어를 실행 중인지(PC), 루프 변수 `i`의 값이 들어 있던 레지스터, 스택 포인터 등을 모두 PCB에 복사. Node.js 프로세스의 PCB에 이 시점 상태가 그대로 박힘.
2. **RESTORE**: 다음 프로세스(예: Chrome 탭)의 PCB에서 그 프로세스가 이전에 멈췄던 시점의 PC·레지스터를 꺼내 CPU에 복원. CPU는 그 PC가 가리키는 곳부터 다시 실행.

나중에 OS가 다시 Node.js에 CPU를 주면, Node.js의 PCB에서 SAVE 단계 때 저장된 값을 RESTORE — for 루프가 정확히 멈췄던 자리에서 이어집니다. 사용자 입장에서는 "잠깐 멈췄다 이어진다"는 것조차 인지 못 하는데, 이 SAVE/RESTORE 메커니즘이 그 환상을 만듭니다.

주체별로 정리:

| 단계 | 누가 | 무엇을 | 어디로 |
|---|---|---|---|
| SAVE | 커널 | CPU 레지스터 값 | 현재 프로세스의 PCB |
| 스케줄링 결정 | 커널 (스케줄러) | 다음 프로세스 선정 | — |
| RESTORE | 커널 | 다음 프로세스의 PCB | CPU 레지스터 |

이게 없으면 어떻게 되는가:

- **SAVE 단계가 없다면**: 멈춘 프로세스의 실행 위치(PC), 진행 중이던 계산 값(레지스터)이 사라집니다. 다시 그 프로세스에 CPU가 와도 어디서 이어야 할지 모름. 모든 프로세스가 매번 처음부터 다시 시작되어야 함 — 멀티태스킹 불가.
- **RESTORE 단계가 없다면**: 새 프로세스가 이전 프로세스의 레지스터 값으로 시작합니다. 엉뚱한 메모리 주소를 읽고, 잘못된 PC로 점프해 시스템이 즉시 크래시.

SAVE/RESTORE는 "프로세스의 실행 상태를 일시 중단하고 정확히 복원할 수 있다"는 약속의 물리적 구현. 이 약속 없이는 OS가 프로세스 1개 이상을 동시에 다룰 수 없습니다.

오개념 예방: 컨텍스트 스위치를 "메모리 복사 두 번"으로 좁혀 보면 단순해 보이지만, 실제로는 캐시·TLB 무효화 같은 부가 비용이 더 크다는 점을 잊으면 안 됩니다. 프로세스 전환은 SAVE/RESTORE만이 아니라 가상 메모리 매핑 전환까지 포함되니, 같은 "두 단계 작업" 설명도 스레드 전환과 프로세스 전환의 비용은 다름.

AI Annotation 보충: x86에서는 이 SAVE/RESTORE 작업이 실제로 어셈블리 명령(예: `pushad`, `popad` 또는 더 현대적인 컨텍스트 스위치 루틴)으로 짧게 구현됩니다. 그러나 이 핵심 작업의 전후로 일어나는 권한 모드 전환·캐시·TLB 처리가 합쳐져 전체 비용이 결정됩니다.

컨텍스트 스위치의 흐름을 다이어그램으로:

```
   [프로세스 A 실행 중]
         │
         │  타임 슬라이스 만료 / 인터럽트 / I/O 대기
         v
   ┌─────────────────────────────────┐
   │ STEP 1: SAVE                    │
   │                                 │
   │   CPU                  PCB(A)   │
   │  ┌─────┐    copy      ┌─────┐  │
   │  │ PC  │──────────────>│ PC  │  │
   │  │ Reg │──────────────>│ Reg │  │
   │  │ SP  │──────────────>│ SP  │  │
   │  └─────┘               └─────┘  │
   └────────────┬────────────────────┘
                v
   ┌─────────────────────────────────┐
   │ STEP 2: 스케줄러 결정             │
   │                                 │
   │   ready queue → 다음 프로세스 B  │
   └────────────┬────────────────────┘
                v
   ┌─────────────────────────────────┐
   │ STEP 3: RESTORE                 │
   │                                 │
   │   PCB(B)               CPU      │
   │  ┌─────┐    copy      ┌─────┐  │
   │  │ PC  │──────────────>│ PC  │  │
   │  │ Reg │──────────────>│ Reg │  │
   │  │ SP  │──────────────>│ SP  │  │
   │  └─────┘               └─────┘  │
   └────────────┬────────────────────┘
                v
   [프로세스 B 실행 재개 — B의 PC가 가리키는 명령어부터]
```

핵심: SAVE = CPU→PCB(현재), RESTORE = PCB(다음)→CPU. 이 한 쌍이 멀티태스킹의 물리적 구현. PCB가 없으면 "어디서 멈췄는지"를 기록할 자리가 없어 재개 불가능.

---

# PCB는 왜 프로세스 자신이 직접 읽거나 수정할 수 없는 보호된 메모리 영역에 보관되어야 하는가?

> PCB must be kept in an area of memory protected from normal process access.
> In some operating systems the PCB is placed at the bottom of the process stack.

---

## 도입

PCB에는 PID, 권한, 메모리 한계, 스케줄링 우선순위 등이 들어 있습니다. 만약 프로세스가 자기 PCB를 직접 수정할 수 있다면? "내 권한을 root로 올리자", "내 우선순위를 최고로 하자" — OS의 모든 통제가 무너집니다. 그래서 PCB는 보호된 메모리에 둡니다.

---

## 본문

> PCB must be kept in an area of memory protected from normal process access.

PCB는 일반 프로세스 접근으로부터 보호된 메모리 영역에 보관되어야 한다.

- **must be kept**: 강한 의무. 선택이 아니라 보안상 강제 사항.
- **area of memory protected**: 보호된 메모리 영역. 보통 커널 영역(kernel space). 사용자 프로세스가 읽기/쓰기를 시도하면 OS가 거부하고 보통 SIGSEGV 같은 신호를 보냅니다.
- **normal process access**: 일반 사용자 프로세스의 접근. 커널 자체나 권한 있는 시스템 콜은 예외.

> In some operating systems the PCB is placed at the bottom of the process stack.

일부 OS에서는 PCB가 프로세스 스택의 맨 아래에 배치된다.

- **placed at the bottom of the process stack**: 스택의 맨 아래. 스택은 위에서 아래로 자라거나 그 반대인데, "맨 아래"는 일반 사용자 코드가 정상 사용 시 절대 도달 못 할 위치.
- 스택 오버플로우가 일어나야 PCB 영역에 닿을 정도. 정상적인 함수 호출로는 결코 닿지 않습니다.

---

## 종합

PCB가 보호되어야 하는 보안 위협을 구체적으로:

| 위협 | 시나리오 | 결과 |
|---|---|---|
| PID 변조 | 자기 PID를 다른 값으로 위장 | 프로세스 추적 불가, 로깅 우회 |
| Process Privilege 상승 | 권한 비트를 root/admin으로 변경 | OS 전체 탈취 |
| 우선순위 조작 | 자기 스케줄링 우선순위를 최대로 | CPU 독점, 다른 프로세스 starvation |
| 메모리 한계 변경 | Memory Limit을 무한으로 | 시스템 메모리 점유 |
| 부모 PID 위장 | 부모 프로세스 ID를 init으로 변경 | 종료 추적·시그널 흐름 교란 |

JS/Node.js와의 연결: 사용자가 `process.pid = 1`처럼 PID를 바꿀 수 없는 게 이 보호 메커니즘의 결과입니다. JS에서 `process.xxx`를 통해 보이는 값은 사실 PCB의 사본(또는 커널이 내려준 일부)이라 수정해봐야 OS의 진짜 PCB는 변하지 않습니다. 권한이 있는 일부 변경(예: `process.chdir()`)은 시스템 콜을 통해 커널에게 부탁하는 형태로만 가능 — 직접 수정이 아니라.

권한 분리 구조:

```
┌────────────────────────────────┐
│       사용자 공간 (user)         │
│   - JS 코드, 변수, 객체           │
│   - process.pid (사본)           │
└──────────────┬─────────────────┘
               │ 시스템 콜 (보호 게이트)
┌──────────────▼─────────────────┐
│       커널 공간 (kernel)         │
│   - PCB (진짜 본체)              │
│   - process table               │
│   - 메모리 관리, 스케줄러          │
└────────────────────────────────┘
```

스택 맨 아래에 두는 이유: 메모리 레이아웃상 PCB를 스택 끝에 두면 (1) 사용자 코드가 정상 실행으로는 닿을 수 없고, (2) 스택 오버플로우가 발생하면 즉시 감지 가능. 일종의 "방어선 + 경보장치" 역할.

이게 없으면 어떻게 되는가 — PCB 보호가 없다면: 프로세스 격리·보안·권한 시스템이 통째로 무너집니다. 악성 사용자 프로세스가 자기 권한을 root로 올리면 OS는 "이 프로세스는 root 권한이 있다"고 믿고 모든 자원을 허용. 멀티유저 시스템·컨테이너·샌드박스 모두 PCB 보호 위에 세워진 추상화.

오개념 예방: "사용자가 `process.pid`를 보니 PCB를 본 것 아닌가?"는 부분적으로만 맞습니다. JS가 보는 건 PCB의 일부 필드의 사본 또는 시스템 콜로 가져온 값이지, PCB 메모리 자체에 직접 접근하는 게 아닙니다. 읽기는 시스템 콜로 허용, 쓰기는 거의 불가능 또는 매우 제한된 시스템 콜로만.

AI Annotation 보충: 컨테이너 보안(Docker), 샌드박스(Chrome 탭), 세분화된 권한(SELinux)도 결국 PCB(또는 그에 준하는 커널 자료구조)에 신뢰성 있는 권한 정보가 박혀 있고, 그것을 사용자 프로세스가 못 건드린다는 가정 위에서 작동. PCB 보호는 현대 컴퓨팅 보안의 가장 밑단 토대.

---

# 터미널에서 `cd`를 실행하면 변경된 현재 디렉토리 경로는 OS가 어디에 보관하는가?

> The current working directory of a process is one of the properties that the kernel stores in the process's PCB.

---

## 도입

터미널에서 `cd /home/user`를 실행한 뒤 `ls`를 치면 그 디렉토리의 파일 목록이 나옵니다. "지금 어느 디렉토리에 있는지"라는 정보는 어딘가에 저장되어 있을 텐데, 그 자리가 바로 PCB. 프로세스마다 따로 가지는 속성이라 셸 A에서 cd해도 셸 B의 현재 디렉토리는 변하지 않는 이유가 여기 있습니다.

---

## 본문

> The current working directory of a process is one of the properties that the kernel stores in the process's PCB.

프로세스의 현재 작업 디렉토리는, 커널이 그 프로세스의 PCB에 저장하는 속성 중 하나다.

- **current working directory (CWD)**: 프로세스가 현재 작업 중이라고 보는 디렉토리. 상대 경로 해석의 기준점.
- **one of the properties**: 여러 PCB 속성 중 하나. PID·메모리 한계·열린 파일 등과 같은 위계.
- **stores in the process's PCB**: 그 프로세스의 PCB에. 다른 프로세스의 PCB와는 격리되어 있어, 프로세스마다 자기만의 CWD를 가짐.

---

## 종합

CWD가 PCB에 저장된다는 사실의 실질적 함의:

- **상대 경로의 기준점**: `fs.readFile('config.json')`처럼 상대 경로로 파일을 열면, OS는 그 프로세스의 PCB에서 CWD를 읽어 절대 경로로 변환합니다. 즉 같은 코드를 다른 디렉토리에서 실행하면 다른 파일을 엽니다.
- **프로세스마다 독립**: 셸 A에서 `cd /tmp`를 해도 셸 B의 CWD는 변하지 않습니다. 각 셸 프로세스가 자기 PCB를 가지니까.
- **자식 프로세스로 상속**: 새 프로세스를 띄우면 부모의 CWD가 기본값으로 복사됨. 그래서 셸에서 띄운 프로그램이 셸과 같은 CWD를 가집니다.

JS/Node.js로 매핑:

```js
process.cwd();          // 현재 프로세스 PCB의 CWD를 읽어옴
process.chdir('/tmp');  // 시스템 콜을 통해 PCB의 CWD를 변경

fs.readFileSync('a.txt'); // 상대경로 → CWD + 'a.txt' 절대경로로 해석
```

`process.cwd()`가 반환하는 문자열이 사실상 PCB에 저장된 그 값. `process.chdir()`은 chdir 시스템 콜을 호출해 커널에게 "내 PCB의 CWD를 이걸로 바꿔줘"라고 부탁하는 셈.

`cd`의 정체:

| 무엇 | 어떻게 |
|---|---|
| `cd`는 외부 프로그램이 아닌 셸 빌트인 | 셸 자기 자신의 CWD를 바꿔야 하니, 자식 프로세스가 아닌 셸 안에서 처리해야 함 |
| 자식 프로세스가 `cd` 했다면 | 그 자식의 CWD만 바뀌고 셸은 그대로 — 셸이 종료되면 자식도 사라지니 변경 효과 없음 |

이 메커니즘 때문에 `cd`는 다른 명령(`ls`, `cp`)과 달리 셸 빌트인으로 구현되어 있습니다. 단순히 "어느 위치로 이동"이 아니라 "이 셸 프로세스의 PCB CWD를 바꾸라"는 동작.

스크립트 안에서 `cd`의 함정: 셸 스크립트(`script.sh`) 안에서 `cd /tmp` 했더라도, 스크립트가 끝나면 부모 셸의 CWD는 안 바뀝니다. 스크립트는 자식 프로세스로 실행되니 자기 PCB만 변경하고 종료, 부모 PCB는 그대로. 이 덕분에 `bash script.sh` 후에도 원래 디렉토리에 그대로 있을 수 있는 것.

이게 없으면 어떻게 되는가 — CWD가 PCB에 없다면: 모든 파일 접근은 절대 경로로만 해야 합니다. `fs.readFile('config.json')`이 안 되고 `fs.readFile('/home/user/project/config.json')`처럼 매번 풀 경로. 더 큰 문제는 한 시스템에 한 CWD만 있으면 셸 여러 개 동시 사용이 불가능 — 한 셸에서 cd하면 다른 셸도 같이 옮겨가는 비정상 동작.

오개념 예방: "CWD는 환경변수 같은 거 아닌가"는 비슷하지만 다릅니다. 환경변수는 PCB의 별도 영역(environment block)에 저장되고 자식에게 복사되는 건 비슷하지만, CWD는 단일 문자열이고 시스템 콜(`chdir`)로만 변경 가능한 별개 필드. PWD라는 환경변수도 있지만 그건 셸이 사용자 편의를 위해 따로 관리하는 사본이고, 진짜 CWD는 PCB에 있습니다.

AI Annotation 보충: `process.cwd()`가 반환하는 값과 `process.env.PWD`는 보통 같지만, 같은 게 아닙니다. PWD는 셸이 자기 환경변수에 자주 갱신하는 사본이고, `process.cwd()`는 커널 PCB의 진짜 CWD. 셸을 거치지 않고 띄운 프로세스에서는 PWD가 부정확할 수 있어요.
