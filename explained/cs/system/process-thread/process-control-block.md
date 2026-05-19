# PCB(프로세스 제어 블록)란 무엇인가?

## 도입

OS가 수십 개의 프로세스를 동시에 관리하려면, 각 프로세스에 대한 모든 정보를 어딘가에 정리해두어야 한다. 그 자료구조가 PCB(Process Control Block)다. 컨텍스트 스위치, 스케줄링, 프로세스 종료 — OS가 프로세스에 관해 하는 모든 작업이 PCB를 읽고 쓰는 것이다.

---

## 본문

### 전체 맥락

> The operating system holds most of this information about active processes in data structures called process control blocks.

"OS는 활성 프로세스에 대한 대부분의 정보를 프로세스 제어 블록이라 불리는 자료구조에 보관한다."

- **holds**: 단순히 "가지고 있다"가 아니라 OS가 직접 관리·유지한다는 의미. 프로세스 자신은 자기 PCB에 직접 접근할 수 없다.
- **active processes**: 현재 메모리에 올라와 있는 실행 중인 프로세스들. 종료된 프로세스의 PCB는 삭제된다.

> Any subset of the resources, typically at least the processor state, may be associated with each of the process' threads.

"자원의 일부가 스레드 단위에도 연결될 수 있으며, 최소한 프로세서 상태는 스레드별로 따로 관리된다."

스레드가 있는 OS에서는 PCB가 프로세스 전체 정보를 담고, 스레드별 정보(PC, 레지스터 등)는 TCB(Thread Control Block)에 별도로 저장된다.

---

### Definition (정의)

> A process control block (PCB), also sometimes called a process descriptor, is a data structure used by a computer operating system to store all the information about a process.

"PCB(프로세스 제어 블록)은 프로세스 디스크립터라고도 불리며, OS가 프로세스에 관한 모든 정보를 저장하기 위해 사용하는 자료구조다."

- **process descriptor**: 이름 그대로 "프로세스를 서술하는 것". 주민등록증처럼, 이 프로세스가 누구이고 어떤 상태인지를 기술한다.

> When a process is created, the operating system creates a corresponding process control block.

"프로세스가 생성되면 OS는 대응하는 PCB를 생성한다."

프로세스와 PCB는 1:1로 연결된다. `node app.js`를 실행하는 순간 OS는 프로세스와 그 PCB를 동시에 만든다.

---

### Categories (세 가지 범주)

> Common elements fall in three main categories:
> - Process identification
> - Process state
> - Process control

"PCB 공통 요소는 세 가지 범주로 나뉜다: 식별, 상태, 제어."

- **Process identification**: PID처럼 이 프로세스가 "누구인지" 식별하는 정보.
- **Process state**: 컨텍스트 스위치 시 저장해야 하는 CPU 레지스터 상태 등 "지금 어디까지 했는지" 정보.
- **Process control**: OS가 프로세스를 관리하는 데 필요한 스케줄링, IPC, 권한 정보 등.

---

### Process state (프로세스 상태 정보)

> Process state data allowing the OS to restart it later.
> This always includes the content of general-purpose CPU registers, the CPU process status word, stack and frame pointers, etc.

"프로세스 상태 데이터는 프로세스가 일시 중단됐을 때의 상태를 정의하여, OS가 나중에 재시작할 수 있게 한다.
여기에는 항상 범용 CPU 레지스터 내용, CPU 프로세스 상태 워드, 스택·프레임 포인터 등이 포함된다."

- **CPU process status word**: 조건 플래그, 인터럽트 마스크 등 CPU의 현재 실행 모드를 담은 레지스터.
- **stack and frame pointers**: 콜 스택의 현재 위치. 어떤 함수 안에 있는지, 지역변수가 어디에 있는지 추적.

이 정보가 없으면 재개 시 "어디서 이어야 하는지"를 몰라 프로세스를 처음부터 다시 실행해야 한다.

**CPU 레지스터 계층도**

```
CPU 레지스터
│
├── General Purpose Registers  ── 계산·데이터 이동 다목적
│   └── rax, rbx, rcx, rdx, rsi, rdi, r8~r15
│
├── Program Counter            ── 다음 실행할 명령어 주소
│   └── rip
│
├── Stack & Frame Pointers     ── 콜 스택 위치 추적
│   └── rsp, rbp
│
└── Status Register            ── CPU 현재 상태 플래그 모음
    └── rflags
```

1차(종류): 역할이 비슷한 레지스터들의 묶음 이름
2차(개별): 실제 존재하는 레지스터 하나하나

CPU는 계산을 항상 레지스터에서 한다. `a + b` 같은 연산의 중간값이 전부 여기에 들어있다. 컨텍스트 스위치로 다른 프로세스에게 CPU를 넘기는 순간 레지스터 값이 덮어씌워지므로, 재개 시 이어서 계산하려면 PCB에 저장해뒀다가 복원해야 한다.

---

### Process control (프로세스 제어 정보)

> Process control information is used by the OS to manage the process itself.

"프로세스 제어 정보는 OS가 프로세스 자체를 관리하는 데 사용된다."

주요 항목을 하나씩 풀면:

- **Process scheduling state** (ready/suspended/etc. + 우선순위, CPU 점유 시간): 스케줄러가 "다음에 누구를 실행할지" 판단하는 근거.
- **Process structuring information** (자식 PID 목록): `child_process.fork()`로 만든 자식들의 PID. 부모가 자식의 종료를 기다리거나(wait) 신호를 보낼 때 사용.
- **Interprocess communication information** (flags, signals, messages): `ls | grep .md`의 파이프처럼, 프로세스 간 메시지를 전달하기 위한 메타데이터.
- **Process Privileges** (시스템 자원 접근 허용/거부): 이 프로세스가 네트워크 소켓을 열 수 있는지, 특정 파일을 읽을 수 있는지.
- **Process State** (new, ready, running, waiting, dead): 스케줄러가 `ready` 상태인 프로세스들 중에서만 다음 실행자를 고른다.
- **Process Number / PID**: 고유 식별 번호. Task Manager에서 보이는 숫자.
- **Program Counter (PC)**: 다음에 실행할 명령어 주소. 컨텍스트 스위치 시 저장되고, 재개 시 복원된다.
- **CPU Registers**: 실행 상태를 담은 레지스터 집합. for 루프의 `i` 값이 여기 있을 수 있다.
- **CPU Scheduling Information**: 우선순위, CPU 타임 슬라이스 만료 여부.
- **Memory Management Information** (page table, memory limits, segment table): 이 프로세스의 가상 주소 공간을 물리 메모리로 매핑하는 테이블.
- **Accounting Information** (CPU 사용량, 실행 시간 등): 공정 스케줄러가 "얼마나 썼는지" 판단하는 통계.
- **I/O Status Information** (할당된 I/O 장치 목록): 이 프로세스가 열어둔 파일, 소켓, 장치 목록.

---

## 종합

PCB는 OS가 프로세스를 관리하기 위한 "프로세스 주민등록부"다. 프로세스가 생성되면 PCB가 만들어지고, 프로세스가 종료되면 PCB가 삭제된다. 그 사이 모든 컨텍스트 스위치, 스케줄링 결정, IPC, 권한 검사에서 PCB가 참조된다.

```
PCB (프로세스 하나당 하나)
├── Process Identification
│   ├── PID (고유 식별 번호)
│   └── 부모 PID
├── Process State (컨텍스트 스위치 저장/복원)
│   ├── Program Counter (다음 실행 명령어 주소)
│   ├── CPU 범용 레지스터 (rax, rbx, ...)
│   ├── CPU 상태 워드 (조건 플래그 등)
│   └── 스택·프레임 포인터
└── Process Control (OS 관리용)
    ├── 스케줄링 상태 (ready/running/waiting/dead)
    ├── 우선순위, CPU 사용 통계
    ├── 자식 PID 목록
    ├── IPC 플래그·메시지 큐
    ├── 권한 (Privilege)
    ├── 메모리 관리 (page table, memory limits)
    └── I/O 장치 목록 (열린 파일 디스크립터)
```

Node.js에서 `process.pid`가 PID를, `process.cwd()`가 현재 작업 디렉토리(PCB에 저장된 속성)를 반환한다. OS 내부에서 이 값들은 모두 PCB에서 온다.

---

---

# PCB는 왜 프로세스 자신이 직접 읽거나 수정할 수 없는 보호된 메모리 영역에 보관되어야 하는가?

## 도입

PCB에는 PID, 권한(Privilege), 스케줄링 우선순위 등 민감한 정보가 들어있다. 만약 프로세스가 자신의 PCB를 직접 수정할 수 있다면 어떤 일이 생길까? 보안 침해가 가능해진다. 이를 막기 위해 PCB는 반드시 보호된 메모리 영역에 있어야 한다.

---

## 본문

> PCB must be kept in an area of memory protected from normal process access.

"PCB는 일반 프로세스가 접근할 수 없는, 보호된 메모리 영역에 보관되어야 한다."

- **protected from normal process access**: OS 커널 모드에서만 접근 가능한 영역. 프로세스는 유저 모드로 실행되고, 커널 메모리에 직접 접근하려 하면 세그멘테이션 폴트(segmentation fault)로 강제 종료된다.

프로세스가 자신의 PCB를 수정할 수 있다면 발생 가능한 보안 침해:
- **PID 변조**: 다른 프로세스의 PID를 흉내내어 신호를 가로챌 수 있다.
- **Privilege 필드 상승**: 일반 사용자 권한을 루트 권한으로 바꿔치기.
- **스케줄링 우선순위 임의 변경**: 자신을 항상 highest priority로 설정해 CPU를 독점.

커널만 PCB에 접근하게 격리함으로써 OS 프로세스 관리의 신뢰성이 보장된다.

> In some operating systems the PCB is placed at the bottom of the process stack.

"일부 OS에서는 PCB를 프로세스 스택의 맨 아래에 배치한다."

- **Key Term — process stack**: 프로세스의 함수 콜 스택. PCB를 스택 맨 아래에 두면, 스택 오버플로우가 발생해 스택이 PCB 영역까지 침범해야만 PCB에 도달한다. 스택은 위에서 아래로 자라고, PCB는 최하단에 있으니 정상 동작으로는 절대 건드릴 수 없다.

---

## 종합

PCB를 보호된 메모리에 두는 것은 OS 보안의 기본 전제다. 프로세스는 자신의 PCB를 읽거나 쓸 수 없다 — 오직 OS 커널만 가능하다. 이 격리 덕분에 프로세스 간 독립성과 시스템 전체의 신뢰성이 유지된다. Node.js에서 `process.pid`를 읽을 수 있는 것은, Node.js 런타임이 커널에 시스템 콜을 날려 OS가 PCB에서 값을 꺼내 돌려주는 것이지, 프로세스가 PCB를 직접 읽는 것이 아니다.

---

---

# 터미널에서 `cd`를 실행하면 변경된 현재 디렉토리 경로는 OS가 어디에 보관하는가?

## 도입

`cd /home/user`를 입력하면 셸 프롬프트가 바뀐다. 이 "현재 위치"는 어딘가에 저장되어야 한다. 어디에? 바로 그 셸 프로세스의 PCB다.

---

## 본문

> The current working directory of a process is one of the properties that the kernel stores in the process's PCB.

"프로세스의 현재 작업 디렉토리는 커널이 프로세스 PCB에 저장하는 속성 중 하나다."

- **current working directory**: 프로세스가 현재 작업 중인 디렉토리 경로. 상대 경로 해석의 기준점이다. `./app.js`를 실행할 때 "`.`이 어디냐"를 PCB에서 읽어온다.
- **kernel stores**: OS 커널이 관리한다. 프로세스 자신이 변수에 저장하는 게 아니다.

`cd /home/user`를 실행하면:
1. 셸이 `chdir("/home/user")` 시스템 콜을 커널에 요청한다.
2. 커널이 셸 프로세스의 PCB에 저장된 CWD 값을 `/home/user`로 갱신한다.
3. 그 후 `./app.js` 같은 상대 경로를 쓰면 커널이 PCB의 CWD를 기준으로 절대 경로로 변환한다.

---

## 종합

현재 작업 디렉토리(CWD)는 프로세스마다 독립적으로 PCB에 저장된다. 그래서 터미널 창 A에서 `cd /tmp`를 해도 터미널 창 B의 경로는 바뀌지 않는다 — 두 셸은 별도의 프로세스이고, 각자 PCB에 자신의 CWD를 갖고 있기 때문이다.

Node.js의 `process.cwd()`가 반환하는 값이 정확히 이 PCB 속성이다. `process.chdir('/tmp')`를 호출하면 커널에 `chdir()` 시스템 콜이 날아가고 PCB의 CWD가 갱신된다.
