# PCB(프로세스 제어 블록)란 무엇인가?

> The operating system holds most of this information about active processes in data structures called process control blocks.
> Any subset of the resources, typically at least the processor state, may be associated with each of the process' threads in operating systems that support threads or child processes.

---

**도입**

OS는 수십~수백 개의 프로세스를 동시에 돌립니다. 그러려면 각 프로세스의 상태(메모리, 권한, CPU 레지스터, 파일 핸들 등)를 어딘가에 정리해둬야 하죠. 그 "프로세스의 신분증 + 상태 보관함" 역할을 하는 자료구조가 PCB입니다. 컨텍스트 스위치도 결국 PCB를 읽고 쓰는 작업.

---

**본문**

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

**종합**

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
