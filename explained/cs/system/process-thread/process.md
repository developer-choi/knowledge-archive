# 프로세스란 무엇이며, 프로그램과 어떻게 다른가?

> In computing, a process is the instance of a computer program that is being executed by one or many threads.
> While a computer program is typically stored in a file on disk, a process is the execution of those instructions after being loaded from the disk into memory.

---

**도입**

`node app.js`를 터미널에 입력하면 어떤 일이 일어나는지 생각해보세요. 디스크에 저장된 `app.js` 파일이 갑자기 "실행 중인 무언가"로 바뀝니다. 이 순간의 변환이 바로 프로그램 → 프로세스 전환입니다. 이 두 단어는 같은 코드를 가리키지만, 완전히 다른 상태를 의미합니다.

---

**본문**

> In computing, a process is the instance of a computer program that is being executed by one or many threads.

컴퓨팅에서 프로세스란, 하나 또는 여러 스레드에 의해 실행되고 있는 컴퓨터 프로그램의 **인스턴스(실행본)**다.

- **instance (실행본)**: 같은 `app.js` 파일을 `node app.js`로 두 번 실행하면 프로세스가 두 개 생깁니다. 파일은 1개지만 실행본은 2개인 것.
- **being executed by one or many threads**: 실제로 코드를 한 줄씩 실행하는 주체는 스레드입니다. 프로세스는 그 스레드들이 돌아갈 수 있는 환경/그릇을 제공합니다.

> While a computer program is typically stored in a file on disk, a process is the execution of those instructions after being loaded from the disk into memory.

컴퓨터 프로그램은 보통 디스크의 파일로 저장되어 있지만, 프로세스는 그 명령어들이 디스크에서 메모리로 적재된 후 **실행**되는 것이다.

- **stored in a file on disk**: `app.js`, `.exe`처럼 디스크에 가만히 있는 상태. 아무것도 하지 않는 수동적 파일.
- **loaded from the disk into memory**: `node app.js`를 입력하면 OS가 디스크의 코드를 RAM에 올립니다. CPU는 디스크를 직접 못 읽고 RAM만 읽을 수 있어서 반드시 이 단계가 필요합니다.
- **execution of those instructions**: 메모리에 올라온 명령어들을 CPU가 순서대로 처리하는 것. 이제야 비로소 코드가 "살아있는" 상태가 됩니다.

---

**종합**

프로그램은 디스크에 정지해 있는 파일이고, 프로세스는 그 파일이 메모리에 올라와 실행 중인 실체입니다.

핵심만 정리하면:

- **프로그램** = 디스크의 파일. `app.js`를 열어보면 그냥 텍스트 글자들. 아무것도 하지 않습니다.
- **프로세스** = 그 파일을 `node app.js`로 실행했을 때 OS가 만들어내는 "살아있는 실행본". 메모리(RAM)에 코드가 올라가고, CPU가 한 줄씩 처리하기 시작한 상태.

터미널 창 3개에서 각각 `node app.js`를 실행하면 `app.js` 파일은 디스크에 1개 그대로지만, Task Manager를 열면 `node.exe` 프로세스가 3개 보입니다. 파일 1개 → 프로세스 여러 개가 가능한 이유가 바로 이 구분 때문입니다.

OS가 관리하는 단위는 프로세스지 프로그램 파일이 아닙니다. Chrome이 탭마다 별도 프로세스를 띄우는 것도 프로세스 단위로 자원을 할당하고 격리하기 때문입니다.

User Annotation: 프로세스는 "잡(Job)"이라고도 불립니다. "잡 스케줄링 = 프로세스 스케줄링"이므로, CS 교재나 면접에서 두 단어를 같은 의미로 쓰는 경우가 많습니다.

---

# 프로세스는 무엇으로 구성되는가?

> A process comprises the program code, assigned system resources, physical and logical access permissions, and data structures to initiate, control and coordinate execution activity.

---

**도입**

앞에서 프로세스는 "실행 중인 프로그램"이라고 했죠. 근데 실행이 되려면 뭔가가 필요합니다. CPU가 읽을 코드, 데이터를 올릴 메모리, 파일을 열 권한, 그리고 "어디까지 실행했는지" 추적하는 장부까지. 프로세스는 이 모든 걸 하나로 묶은 패키지입니다.

---

**본문**

> A process comprises the program code, assigned system resources, physical and logical access permissions,

프로세스는 프로그램 코드, 할당된 시스템 자원, 물리적·논리적 접근 권한으로 구성된다.

- **comprises**: "~로 구성된다." 프로세스 = 코드 하나가 아니라 여러 요소의 묶음.
- **assigned system resources**: OS가 이 프로세스에게 할당해준 자원들. 메모리 공간, 파일 핸들(열린 파일 목록), 네트워크 소켓 등. `node app.js`가 `package.json`을 읽을 수 있는 건 OS가 파일 핸들을 이 프로세스에 할당해줬기 때문.
- **physical and logical access permissions**: 이 프로세스가 "어디에 접근할 수 있는가"에 대한 권한. Chrome 프로세스가 다른 프로세스의 메모리를 못 읽는 것도 여기서 막힘.

> and data structures to initiate, control and coordinate execution activity.

그리고 실행 활동을 시작·통제·조율하기 위한 자료구조.

- **data structures**: 프로세스 실행 상태를 추적하는 장부들. 대표적인 게 PCB(프로세스 제어 블록) — 이 파일에서는 별도 문서(`process-control-block.md`)로 분리됨.
- **initiate** (시작): 프로세스를 처음 만드는 순간 OS가 해야 할 일 — 어디서 실행을 시작할지, 메모리를 얼마나 줄지, 어떤 권한을 부여할지. 이 정보들을 자료구조에 저장해야 프로세스를 "띄울 수" 있습니다.
- **control** (통제): 실행 중에 CPU를 빼고 돌려주는 순간 — for문 1억 번 돌던 프로세스에서 OS가 CPU를 빼앗을 때, 나중에 재개하려면 "어디까지 실행했는지"를 저장해둬야 합니다. Program Counter, 레지스터 상태가 여기에 해당하고, 이걸 저장·복원하는 게 컨텍스트 스위치입니다.
- **coordinate** (조율): 여러 프로세스가 동시에 돌아가는 상황 — 누가 먼저 CPU를 쓸지, 어느 프로세스가 대기 중인지, 부모-자식 관계가 어떻게 되는지 같은 정보도 자료구조에 저장됩니다.

---

**종합**

프로세스는 코드 실행 그 이상입니다. 네 가지가 같이 묶여야 "프로세스"라고 할 수 있습니다:

| 구성 요소 | 역할 | JS 예시 |
|---|---|---|
| 프로그램 코드 | CPU가 실행할 명령어 | V8이 컴파일한 `app.js` 기계어 |
| 시스템 자원 | 메모리, 파일 핸들, 소켓 | `fs.readFile`로 열린 파일 |
| 접근 권한 | 어디까지 접근 가능한가 | 다른 프로세스 메모리 접근 불가 |
| 제어 자료구조 | 실행 상태 추적 장부 | 현재 실행 위치(Program Counter) |

이 중 하나라도 없으면 실행이 불가능합니다. 자원 없이 코드만 있으면 변수를 저장할 메모리가 없고, 권한 없이 자원만 있으면 보안이 무너집니다.

---

# 프로세스의 메모리 영역은 어떤 구성 요소를 포함하는가?

> Memory (typically some region of virtual memory); which includes the executable code, process-specific data (input and output), a call stack (to keep track of active subroutines and/or other events), and a heap to hold intermediate computation data generated during run time.

---

**도입**

앞 질문에서 프로세스 구성요소 중 하나가 "할당된 시스템 자원(메모리 포함)"이었죠. 이번엔 그 메모리 내부가 어떻게 나뉘어 있는지 봅니다. JS 개발자라면 이미 콜 스택과 힙을 들어봤을 텐데, 그게 바로 여기서 나오는 개념입니다.

---

**본문**

> Memory (typically some region of virtual memory);

메모리 — 보통 가상 메모리의 특정 영역.

- **virtual memory**: 프로세스는 실제 물리 RAM이 아니라 OS가 추상화해준 "가상 메모리" 공간을 받습니다. 각 프로세스는 자기가 메모리 전체를 독점한 것처럼 동작하고, OS가 뒤에서 실제 RAM에 매핑해줍니다.

> which includes the executable code, process-specific data (input and output),

실행 가능한 코드, 프로세스 전용 데이터(입출력)를 포함한다.

- **executable code**: V8이 `app.js`를 컴파일한 기계어 코드가 여기 저장됩니다. 프로그램이 실행되는 동안 변하지 않는 영역. 흔히 "텍스트 영역"이라고도 부릅니다.
- **process-specific data**: 전역 변수처럼 프로그램 시작부터 종료까지 유지되는 데이터. Node.js의 `global.something = ...` 같은 것.

> a call stack (to keep track of active subroutines and/or other events),

활성 서브루틴(함수 호출)을 추적하기 위한 콜 스택.

- **call stack**: JS 개발자에게 익숙한 그것입니다. 함수가 호출되면 스택에 쌓이고, `return`하면 꺼냅니다. 재귀를 너무 깊이 쌓으면 `Maximum call stack size exceeded` 에러가 나는 이유가 이 스택의 크기 한계 때문.
- **active subroutines**: 현재 실행 중인 함수들. `a()`가 `b()`를 호출하면 스택에 `a → b` 순으로 쌓힙니다.

> and a heap to hold intermediate computation data generated during run time.

런타임에 생성되는 중간 계산 데이터를 담기 위한 힙.

- **heap**: 실행 중에 동적으로 할당되는 영역. JS에서 `const obj = {}`, `const arr = []` 하면 그 객체/배열이 힙에 저장됩니다.
- **generated during run time**: 컴파일 시점에 크기를 알 수 없는 데이터들. 얼마나 큰 배열이 만들어질지 실행 전엔 모르니까 런타임에 동적으로 할당합니다.

---

**종합**

4개 영역을 JS 코드로 매핑하면:

| 영역 | 저장되는 것 | JS 예시 |
|---|---|---|
| 텍스트(코드) | 실행할 기계어 | V8이 컴파일한 `app.js` |
| 데이터 | 전역 변수 | `global.config = ...` |
| 스택 | 함수 호출 추적 | `a() → b() → c()` 호출 스택 |
| 힙 | 동적 할당 데이터 | `const obj = {}`, `[]` |

오개념 예방 하나: `const arr = [1, 2, 3]`을 선언하면 — **배열 자체는 힙에**, `arr`라는 변수(배열을 가리키는 참조값)는 스택에 저장됩니다. 스택과 힙이 분리되어 있기 때문에 JS의 가비지 컬렉터가 힙만 청소해도 됩니다.

---

# OS가 프로세스들을 서로 격리하는 이유와, 격리 실패 시 발생할 수 있는 문제는?

> The operating system keeps its processes separate and allocates the resources they need, so that they are less likely to interfere with each other and cause system failures (e.g., deadlock or thrashing).
> The operating system may also provide mechanisms for inter-process communication to enable processes to interact in safe and predictable ways.

---

**도입**

`node app.js`를 두 번 실행하면 두 Node 프로세스가 만들어지는데, 한 쪽이 다른 쪽의 메모리를 들여다볼 수 없습니다. 왜 OS가 일부러 이렇게 칸을 막아둘까요? 한 쪽이 망가져도 다른 쪽은 무사하기 위해서입니다. 그리고 그렇게 막아두면서도 필요할 땐 통신할 수 있도록 OS가 별도의 통로(IPC)를 열어둡니다.

---

**본문**

> The operating system keeps its processes separate and allocates the resources they need,

OS는 프로세스들을 서로 분리해 두고, 각 프로세스에 필요한 자원을 할당한다.

- **keeps its processes separate**: 각 프로세스에 별도의 가상 메모리 공간을 부여. A 프로세스의 변수와 B 프로세스의 변수는 같은 이름이라도 물리적으로 다른 RAM 영역에 저장됩니다.
- **allocates the resources they need**: OS가 자원의 분배자 역할. 메모리, 파일 핸들, 소켓 등 각 프로세스가 필요로 하는 만큼만 떼어줍니다. 분배자가 없으면 프로세스끼리 자원 쟁탈전이 벌어집니다.

> so that they are less likely to interfere with each other and cause system failures (e.g., deadlock or thrashing).

그래서 서로 간섭하거나 시스템 장애(예: 데드락, 스래싱)를 일으킬 가능성이 낮아진다.

- **interfere**: A 프로세스가 B의 메모리를 직접 망가뜨리거나, B가 쓰던 파일을 막 닫아버리는 상황. 격리되어 있지 않으면 한 프로세스의 버그가 다른 프로세스를 즉사시킵니다.
- **deadlock**: A가 B의 자원을 기다리고, B가 A의 자원을 기다려 둘 다 영원히 멈추는 상태. 식당에서 두 손님이 서로의 포크를 잡고 "먼저 놓아야지" 하며 영원히 안 먹는 그림.
- **thrashing**: 메모리가 부족해서 OS가 디스크와 RAM 사이에 페이지를 미친 듯이 옮기는 상태. 실제 작업보다 페이지 교체에 시간을 더 써서 시스템 전체가 거의 멈춥니다.

> The operating system may also provide mechanisms for inter-process communication to enable processes to interact in safe and predictable ways.

OS는 또한 프로세스가 안전하고 예측 가능한 방식으로 상호작용할 수 있도록 IPC 메커니즘을 제공할 수 있다.

- **inter-process communication (IPC)**: 격리된 프로세스끼리 데이터를 주고받기 위한 통제된 통로. 파이프, 소켓, 공유 메모리, 메시지 큐 등의 형태로 OS가 중재합니다.
- **safe and predictable**: A가 B의 메모리를 함부로 읽지 못하고, OS가 정해둔 규칙대로만 데이터가 오갑니다. 무법지대가 아니라 검문소.

---

**종합**

격리가 없으면 어떻게 되는지 상상해보면 명확합니다. Chrome 탭 50개가 같은 메모리를 공유한다면, 1개 탭의 메모리 누수가 전체 브라우저를 죽일 수 있습니다. 실제로 Chrome은 이 문제를 해결하려고 탭마다 별도 프로세스를 띄웁니다 — 한 탭이 크래시해도 다른 탭은 살아있죠.

격리의 두 가지 효과:

- **보안**: A 프로세스가 B의 비밀번호를 메모리에서 훔쳐볼 수 없습니다.
- **안정성**: A가 죽어도 B는 무사. 한 프로세스의 SEGFAULT가 OS 전체를 다운시키지 않습니다.

격리만 하면 데이터를 주고받을 수 없으니, OS는 IPC라는 "공식 통로"를 제공합니다. `ls | grep .md`의 파이프가 IPC의 가장 익숙한 사례 — `ls` 프로세스의 stdout이 OS 커널의 파이프 버퍼를 거쳐 `grep` 프로세스의 stdin으로 전달됩니다. 두 프로세스가 직접 메모리를 공유하는 게 아니라 OS가 중간에서 데이터를 옮겨줍니다.

오개념 예방: 격리는 "절대 통신 불가"가 아니라 "통제된 통신만 허용"입니다. IPC 자체가 OS가 격리 규칙 안에서 합법적으로 열어둔 창구라서, 격리와 IPC는 반대 개념이 아니라 한 묶음으로 봐야 합니다.

---

# 멀티태스킹이란 무엇이며, 하나의 CPU 코어에서 여러 프로세스가 동시에 실행되는 것처럼 보이는 원리는?

> Multitasking is a method to allow multiple processes to share processors (CPUs) and other system resources.
> Each CPU (core) executes a single process at a time.
> In time-sharing systems, context switches are performed rapidly, which makes it seem like multiple processes are being executed simultaneously on the same processor.
> This seemingly-simultaneous execution of multiple processes is called concurrency.

---

**도입**

노트북에서 Chrome, VS Code, Slack을 동시에 켜놓아도 다 잘 돌아가는 것처럼 보입니다. 근데 CPU 코어가 4개뿐이라면 같은 순간 실제로 실행되는 건 4개일 텐데, 어떻게 수십 개 프로그램이 멈추지 않고 굴러가는 걸까요? 답은 "사실 동시는 아닌데 동시처럼 보이게 한다"입니다.

---

**본문**

> Multitasking is a method to allow multiple processes to share processors (CPUs) and other system resources.

멀티태스킹은 여러 프로세스가 CPU와 다른 시스템 자원을 공유할 수 있게 해주는 방법이다.

- **share processors**: 한 CPU를 여러 프로세스가 돌아가며 사용. 시간을 잘게 쪼개 나눠 갖는다고 보면 됩니다.
- **other system resources**: CPU만이 아니라 메모리·디스크 I/O·네트워크 대역폭도 공유 대상. 멀티태스킹은 자원 전반을 여러 프로세스가 나눠 쓰는 큰 그림.

> Each CPU (core) executes a single process at a time.

각 CPU(코어)는 한 번에 단 하나의 프로세스만 실행한다.

- **a single process at a time**: 물리적으로 동시에 두 프로세스를 실행할 수 없습니다. 1코어 = 1실행. 4코어면 같은 순간 최대 4개 프로세스만 실제로 돌아갑니다. 이게 없으면 다음 문장(시분할)이 왜 필요한지가 안 잡힙니다.

> In time-sharing systems, context switches are performed rapidly, which makes it seem like multiple processes are being executed simultaneously on the same processor.

시분할 시스템에서는 컨텍스트 스위치가 매우 빠르게 일어나서, 같은 프로세서 위에서 여러 프로세스가 동시에 실행되는 것처럼 보이게 한다.

- **time-sharing**: CPU 시간을 잘게(예: 10ms 단위) 쪼개 여러 프로세스에 번갈아 할당. 사용자 입장에서는 계속 실행되는 것처럼 느껴집니다.
- **context switches**: 한 프로세스에서 다른 프로세스로 CPU 점유를 전환하는 작업. 현재 실행 중인 프로세스의 상태(레지스터, Program Counter 등)를 저장하고, 다음 프로세스의 상태를 불러옵니다.
- **rapidly**: 사람이 인지할 수 없을 만큼 빠르게. 1초에 수백~수천 번 일어나며, 그래서 우리는 모든 프로그램이 "계속 돌고 있다"고 느낍니다.

> This seemingly-simultaneous execution of multiple processes is called concurrency.

이렇게 동시에 실행되는 것처럼 보이는 것을 동시성(concurrency)이라고 한다.

- **seemingly-simultaneous**: "겉보기엔 동시"라는 게 핵심. 실제로는 시간 분할이지만, 빠르게 전환되어 동시처럼 보입니다.

---

**종합**

concurrency vs parallelism은 처음 헷갈리는 단골 주제입니다.

| 용어 | 의미 | 예시 |
|---|---|---|
| concurrency (동시성) | 동시에 진행되는 것처럼 보임 (실제로는 빠른 전환) | 1코어 CPU에서 Chrome + VS Code |
| parallelism (병렬성) | 물리적으로 동시 실행 | 4코어 CPU에서 4개 프로세스 동시 실행 |

JS 개발자에게 익숙한 비유:

- 비동기 처리(`async/await`, `Promise`)는 동시성입니다. 한 스레드에서 작업을 잘게 쪼개 번갈아 처리. 실제로 동시에 두 가지를 하지는 않습니다.
- Web Worker로 별도 워커 스레드를 띄우면 그제야 진짜 병렬. 메인 스레드와 워커가 서로 다른 코어에서 동시에 돌아갑니다.

오개념 예방: "내 노트북 8코어니까 한 번에 8개씩 동시 실행되겠네"는 부분만 맞습니다. 8코어라도 프로세스가 100개면 92개는 어딘가 대기 중이고, OS가 빠르게 돌려가며 CPU를 분배합니다. concurrency가 본질이고 parallelism은 코어 수만큼만 가능한 옵션입니다.

이게 없으면 어떻게 되는가: 만약 시분할 + 컨텍스트 스위치가 없다면, 1코어 머신에서는 한 프로세스가 끝나야만 다음이 시작됩니다. Chrome을 켜놓으면 VS Code는 Chrome이 종료될 때까지 영원히 못 켜는 셈. 멀티태스킹은 OS가 사용자에게 "여러 일을 동시에 한다"는 환상을 합리적인 비용으로 제공하는 핵심 기능입니다.

---

# OS에서 컨텍스트 스위치(프로세스 전환)가 발생하는 시점은?

> Multitasking allows each processor to switch between tasks that are being executed without having to wait for each task to finish (preemption).
> Depending on the operating system implementation, switches could be performed when tasks initiate and wait for completion of input/output operations, when a task voluntarily yields the CPU, on hardware interrupts, and when the operating system scheduler decides that a process has expired its fair share of CPU time (e.g, by the Completely Fair Scheduler of the Linux kernel).

---

**도입**

컨텍스트 스위치는 "지금 돌고 있는 프로세스의 CPU를 빼고 다른 프로세스에 줘라"입니다. 그럼 OS는 언제 그 결정을 내릴까요? 제멋대로 끊으면 시스템이 혼란스러워지고, 안 끊으면 한 프로세스가 CPU를 독점합니다. OS는 정해진 4가지 시점에만 끊습니다.

---

**본문**

> Multitasking allows each processor to switch between tasks that are being executed without having to wait for each task to finish (preemption).

멀티태스킹은 각 프로세서가 실행 중인 작업이 끝날 때까지 기다리지 않고도 작업 사이를 전환할 수 있게 해준다(선점).

- **switch between tasks**: 작업 A → 작업 B로 CPU를 옮기는 것. 컨텍스트 스위치의 본질.
- **without having to wait for each task to finish**: 작업이 끝날 때까지 기다리지 않습니다. 진행 중인 작업도 강제로 끊을 수 있습니다.
- **preemption (선점)**: OS가 실행 중인 프로세스에서 CPU를 강제로 회수하는 권한. 이게 없으면 한 프로세스가 무한루프에 빠질 때 다른 프로세스가 영원히 못 돕니다.

> Depending on the operating system implementation, switches could be performed when tasks initiate and wait for completion of input/output operations,

OS 구현에 따라, 작업이 입출력 연산을 시작하고 그 완료를 기다릴 때 전환이 일어날 수 있다.

- **initiate and wait for completion of I/O**: I/O는 디스크 읽기, 네트워크 응답 같이 시간이 오래 걸리는 작업. CPU는 I/O가 끝나기를 기다리는 동안 놀게 되니, OS는 그 시간을 다른 프로세스에게 넘겨줍니다. 가장 자연스러운 전환 시점.

> when a task voluntarily yields the CPU,

작업이 자발적으로 CPU를 양보할 때.

- **voluntarily yields**: 프로세스가 스스로 "지금 할 일 없으니 다른 프로세스에게 넘겨줘"라고 OS에 요청. 협력적 멀티태스킹의 핵심 동작.

> on hardware interrupts,

하드웨어 인터럽트가 발생할 때.

- **hardware interrupts**: 키보드, 마우스, 네트워크 카드 같은 외부 장치가 "처리할 일이 생겼다"고 CPU에 신호를 보내는 것. CPU는 즉시 현재 작업을 중단하고 인터럽트 핸들러로 점프합니다.

> and when the operating system scheduler decides that a process has expired its fair share of CPU time (e.g, by the Completely Fair Scheduler of the Linux kernel).

그리고 OS 스케줄러가 어떤 프로세스가 자신의 공정한 CPU 시간 몫을 다 썼다고 판단할 때(예: 리눅스 커널의 CFS).

- **fair share of CPU time**: 각 프로세스에 할당된 시간 조각(time slice 또는 quantum). 보통 수 ms ~ 수십 ms.
- **expired**: 시간 조각이 다 떨어진 상태. 스케줄러가 강제로 다음 프로세스에 CPU를 넘깁니다.
- **Completely Fair Scheduler (CFS)**: 리눅스의 대표 스케줄러. 모든 프로세스가 "공정하게" CPU 시간을 받도록 설계됨.

---

**종합**

전환이 일어나는 4가지 시점을 묶으면:

| 시점 | 누가 트리거 | 예시 | 성격 |
|---|---|---|---|
| I/O 대기 | 프로세스가 I/O 호출 | `fs.readFile()` 결과 대기 | 협력적 (자연스러운 양보) |
| 자발적 양보 | 프로세스 본인 | 스레드의 `yield()` 호출 | 협력적 |
| 하드웨어 인터럽트 | 외부 장치 | 키보드 입력, 패킷 도착 | 외부 강제 |
| 시간 조각 만료 | OS 스케줄러 | 10ms quantum 소진 | 선점적 (강제 회수) |

JS 비유로 이해하기:

- `await fetch(...)` 만나면 이벤트 루프가 다른 작업 처리 → I/O 대기 시점과 비슷한 양보 동작입니다 (단, JS 이벤트 루프는 단일 스레드 안의 동시성이지 OS 차원의 컨텍스트 스위치는 아닙니다).
- 무한루프 `while(true) {}`에 빠진 JS는 그 스레드에서 다른 작업을 막아버립니다. OS가 시간 조각으로 강제 회수하지 않으면 시스템 전체가 멈추겠죠 — OS 선점이 그래서 중요합니다.

오개념 예방: 협력적 멀티태스킹(프로세스가 양보해줘야만 전환)에 의존하면 한 프로세스가 양보 안 할 때 다른 프로세스가 영원히 못 돕니다. 그래서 현대 OS는 선점적 방식이 기본입니다. Windows 95 이전 버전의 협력적 멀티태스킹이 한 프로그램 다운으로 OS 전체가 굳던 시절이 그 한계를 보여줍니다.

Official Annotation 보충: 선점적 방식은 시간 조각이 끝나는 정확한 순간을 프로그래머가 예측 못 하기 때문에 lock convoy(락을 잡은 채 선점당해 다른 스레드가 전부 막힘), priority inversion(낮은 우선순위 스레드가 락을 잡고 있어서 높은 우선순위가 못 진행) 같은 부작용이 있습니다. 동기화 코드를 짤 때 이 부작용을 가정해야 합니다.

---

# 현대 OS가 프로세스 간 직접 통신을 막고 IPC를 제공하는 이유는?

> For security and reliability, most modern operating systems prevent direct communication between independent processes, providing strictly mediated and controlled inter-process communication.

---

**도입**

앞서 OS가 프로세스를 격리한다고 했죠. 근데 정말 격리만 하면 프로세스끼리 데이터를 못 주고받습니다. `ls | grep .md`처럼 출력을 다음 명령에 넘기는 일도 못 하고요. 격리하되 안전하게 통신할 수 있게 OS가 직접 만들어준 통로가 IPC입니다.

---

**본문**

> For security and reliability, most modern operating systems prevent direct communication between independent processes, providing strictly mediated and controlled inter-process communication.

보안과 안정성을 위해, 대부분의 현대 OS는 독립된 프로세스 간의 직접 통신을 막고, 엄격하게 중재되고 통제된 프로세스 간 통신(IPC)을 제공한다.

- **for security and reliability**: 두 가지 목적. 보안 = A가 B의 비밀번호를 훔칠 수 없게. 안정성 = A의 버그가 B를 망가뜨릴 수 없게.
- **prevent direct communication**: A 프로세스가 B의 메모리에 직접 쓰거나 읽는 것을 OS 차원에서 금지. 가상 메모리로 분리되어 있기 때문에 시도조차 안 됩니다 (잘못된 주소 접근으로 SEGFAULT).
- **strictly mediated and controlled**: OS가 중간에서 모든 통신을 검사·중재. "이건 허락된 통신이니 통과", "저건 금지된 영역이니 차단".
- **inter-process communication (IPC)**: 파이프, 소켓, 공유 메모리, 메시지 큐 등의 형태. 모두 OS가 제공하는 시스템 콜을 거칩니다.

---

**종합**

만약 IPC가 없고 직접 통신만 가능하다면:

- A 프로세스가 B의 메모리를 직접 읽기 → 비밀번호 평문 노출 위험.
- A의 잘못된 포인터 쓰기가 B의 변수 영역 침범 → B 크래시.

OS는 격리 + IPC 조합으로 두 가지 목표를 동시에 달성합니다:

- 격리로 직접 침입 차단.
- IPC로 합법적 통신만 허용.

JS 개발자가 매일 마주하는 IPC 사례:

- 터미널 파이프 `ls | grep .md`: `ls` 프로세스의 stdout이 OS 커널의 파이프 버퍼를 거쳐 `grep` 프로세스의 stdin으로 전달됩니다. 두 프로세스가 직접 메모리를 공유하지 않고, OS가 중간에서 데이터를 옮겨줍니다.
- Node.js `child_process.fork()` + `process.send()`: 부모-자식 프로세스가 메시지로 통신. 이게 IPC.
- Chrome 탭 프로세스와 메인 프로세스 간 통신도 OS의 IPC 메커니즘을 사용합니다. 한 탭이 죽어도 메인이 무사한 이유의 절반은 격리, 절반은 통제된 IPC 덕분.

오개념 예방: IPC와 스레드 통신은 다릅니다. 스레드는 같은 프로세스 안에 있으니 메모리를 그냥 공유합니다 (락이나 atomic 같은 동기화는 필요해도 OS 중재는 불필요). IPC는 별개 프로세스 간이라 OS를 반드시 거쳐야 합니다 — 그래서 일반적으로 스레드 간 통신보다 비용이 높습니다. "IPC가 항상 빠르겠지"가 아니라 "IPC는 안전하지만 약간의 오버헤드가 있다"가 정확한 이해입니다.

---

# 부모 프로세스와 자식 프로세스의 관계는 어떻게 형성되는가?

> It is usual to associate a single process with a main program, and child processes with any spin-off, parallel processes, which behave like asynchronous subroutines.

---

**도입**

모든 프로세스는 어딘가에서 만들어집니다. `node app.js`를 입력하면 셸 프로세스가 Node 프로세스를 만들고, Node 프로세스가 다시 워커 프로세스를 만들 수도 있죠. 이렇게 만든 쪽이 부모, 만들어진 쪽이 자식입니다. 가족 관계처럼 트리 구조를 이룹니다.

---

**본문**

> It is usual to associate a single process with a main program, and child processes with any spin-off, parallel processes, which behave like asynchronous subroutines.

보통 하나의 프로세스를 메인 프로그램과 연결하고, 자식 프로세스를 그로부터 파생된 병렬 프로세스와 연결한다. 자식은 비동기 서브루틴처럼 동작한다.

- **single process with a main program**: 한 프로그램의 시작점은 보통 단일 프로세스. `node app.js`를 실행하면 처음에는 Node 프로세스 1개로 시작.
- **spin-off, parallel processes**: 메인에서 떨어져 나간 병렬 프로세스. 메인이 동영상 인코딩 같은 무거운 일을 직접 하는 대신, 자식 프로세스에 위임해 동시에 처리.
- **asynchronous subroutines**: 비동기 서브루틴. 호출하면 결과가 즉시 안 오고, 자식이 자기 일을 끝낼 때까지 부모는 다른 일을 할 수 있습니다.
- **behave like**: "처럼 동작한다"의 의미가 중요. 함수처럼 한 줄에서 끝나는 게 아니라, 호출 후 한참 뒤에 결과가 돌아오는 비동기 패턴.

---

**종합**

JS에서 가장 익숙한 부모-자식 프로세스 패턴:

```js
const { fork } = require('child_process');
const child = fork('worker.js'); // 자식 프로세스 생성
child.on('message', (result) => { /* 결과 처리 */ }); // 자식이 끝내면 메시지로 옴
```

부모(`app.js`)가 자식(`worker.js`)을 만들고, 자식은 별도 프로세스에서 자기 일을 합니다. 부모는 자식이 돌아가는 동안 기다리지 않고 다른 작업을 할 수 있죠. 결과는 메시지(IPC)로 받습니다.

User Annotation 보충: 자식은 부모의 자원 권한과 스케줄링 속성을 상속받지만, 부모가 가진 자원의 부분집합만 쓸 수 있습니다. 부모가 100MB 메모리 권한이면 자식은 그 안에서만 사용 가능 — 자식이 부모보다 더 많은 권한을 갖게 되는 일은 없습니다(권한 상승은 보안 사고).

오개념 예방:

- 자식 프로세스는 부모의 메모리를 공유하는 게 아닙니다. fork 시점의 메모리 상태를 복사해 자기 공간을 받습니다 (실제 OS 구현은 Copy-on-Write로 최적화). 그래서 자식이 변수를 바꿔도 부모 변수는 안 바뀝니다 — 두 프로세스는 완전히 격리됩니다. 데이터 교환이 필요하면 IPC를 써야 합니다.
- 자식과 스레드는 다릅니다. 자식 프로세스는 별도 메모리 공간을 받는 진짜 별개 프로세스. 스레드는 같은 프로세스 안에서 메모리를 공유하는 실행 흐름. 격리 강도와 비용이 다릅니다.

브라우저 사례: Chrome의 메인 프로세스가 부모, 각 탭 프로세스가 자식. 한 탭(자식)이 죽어도 메인(부모)이 살아있어서 다른 탭은 무사합니다. 이게 부모-자식 격리의 실용적 가치 — 자식의 추락이 부모를 끌어내리지 않습니다.

---

# 프로세스의 상태 전이(lifecycle) 전체 흐름과 각 상태의 의미는?

> First, the process is "created" by being loaded from a secondary storage device (hard disk drive, CD-ROM, etc.) into main memory.
> After that the process scheduler assigns it the "waiting" state.
> While the process is "waiting", it waits for the scheduler to do a so-called context switch.
> The context switch loads the process into the processor and changes the state to "running" while the previously "running" process is stored in a "waiting" state.
> If a process in the "running" state needs to wait for a resource (wait for user input or file to open, for example), it is assigned the "blocked" state.
> The process state is changed back to "waiting" when the process no longer needs to wait (in a blocked state).
> Once the process finishes execution, or is terminated by the operating system, it is no longer needed.
> The process is removed instantly or is moved to the "terminated" state.

---

**도입**

프로세스는 태어나서 죽기까지 여러 상태를 거칩니다. CPU를 갖고 실행 중일 수도 있고, CPU를 기다리는 줄에 서 있을 수도 있고, 파일이 읽힐 때까지 멈춰 있을 수도 있죠. 이 상태들을 어떻게 옮겨다니는지가 lifecycle입니다. 핵심은 waiting(CPU 대기)과 blocked(자원 대기)의 차이입니다.

---

**본문**

> First, the process is "created" by being loaded from a secondary storage device (hard disk drive, CD-ROM, etc.) into main memory.

먼저, 프로세스는 보조 저장 장치(HDD, CD-ROM 등)에서 메인 메모리로 적재되면서 "생성(created)" 상태가 된다.

- **created**: 가장 첫 상태. `node app.js`를 입력한 직후 OS가 프로세스의 자료구조(PCB)를 만들고 코드를 메모리에 올리는 단계.
- **secondary storage → main memory**: 디스크에서 RAM으로의 이동. CPU는 RAM만 직접 읽을 수 있어서 이 적재는 필수.

> After that the process scheduler assigns it the "waiting" state.

그 후 프로세스 스케줄러가 "대기(waiting)" 상태를 부여한다.

- **waiting**: CPU 차례를 기다리는 상태. 다른 자료에서는 "ready" 또는 "준비 큐(ready queue)"라고도 부릅니다. 실행할 준비는 끝났고 CPU만 받으면 즉시 돌 수 있습니다.

> While the process is "waiting", it waits for the scheduler to do a so-called context switch.

waiting 상태인 동안 프로세스는 스케줄러의 컨텍스트 스위치를 기다린다.

- **context switch**: 스케줄러가 "이 프로세스 차례야"라고 판단해 CPU를 넘겨주는 작업.

> The context switch loads the process into the processor and changes the state to "running" while the previously "running" process is stored in a "waiting" state.

컨텍스트 스위치는 프로세스를 프로세서에 적재하고 상태를 "실행(running)"으로 바꾸며, 동시에 직전에 running이던 프로세스를 waiting 상태로 저장한다.

- **running**: CPU를 차지하고 실제로 명령어를 실행 중인 상태. 1코어당 한순간 1개 프로세스만 가능.
- **the previously "running" process is stored in a "waiting" state**: 자리바꿈. 새 프로세스가 running으로 들어가면, 원래 있던 running 프로세스는 waiting 큐로 돌아갑니다.

> If a process in the "running" state needs to wait for a resource (wait for user input or file to open, for example), it is assigned the "blocked" state.

running 상태인 프로세스가 자원(예: 사용자 입력, 파일 열기)을 기다려야 하면 "차단(blocked)" 상태가 부여된다.

- **blocked**: I/O나 외부 자원을 기다리는 상태. waiting과 다른 점: waiting은 "CPU만 받으면 바로 돌 수 있는 준비 완료" 상태, blocked는 "외부 자원이 와야만 진행 가능" 상태. CPU가 와도 못 돕니다.

> The process state is changed back to "waiting" when the process no longer needs to wait (in a blocked state).

차단 상태에서 더 이상 기다릴 필요가 없어지면 다시 waiting 상태로 바뀐다.

- **changed back to "waiting"**: blocked → waiting. 자원이 도착해도 곧장 running으로 가지 않습니다. 다른 프로세스가 CPU를 쓰고 있을 수 있으니, 다시 줄 서서 자기 차례를 기다립니다.

> Once the process finishes execution, or is terminated by the operating system, it is no longer needed.
> The process is removed instantly or is moved to the "terminated" state.

프로세스가 실행을 끝내거나 OS에 의해 종료되면 더 이상 필요하지 않다. 프로세스는 즉시 제거되거나 "종료(terminated)" 상태로 이동한다.

- **terminated**: 마지막 상태. `exit()`이 호출되거나 OS가 강제 종료. 자원을 OS에 반납하고 프로세스가 사라집니다.
- **removed instantly or moved to "terminated"**: 곧바로 사라지거나, 부모 프로세스가 종료 코드를 회수할 때까지 잠깐 좀비 상태로 남기도 합니다.

---

**종합**

전체 흐름을 다이어그램으로:

```
created → waiting ⇄ running → terminated
              ↑        ↓
              └─ blocked
```

가장 헷갈리는 두 상태의 차이:

| 상태 | 무엇을 기다리는가 | CPU가 와도 실행 가능? |
|---|---|---|
| waiting (= ready) | CPU 차례 | ✅ 즉시 실행 |
| blocked | 외부 자원 (I/O, 사용자 입력 등) | ❌ 자원 와야 가능 |

그래서 blocked → 자원 도착 시 곧장 running이 아니라 waiting으로 갑니다 (왜냐하면 다른 프로세스가 CPU를 잡고 있을 가능성이 크니까).

JS 비유로:

- `await fetch(...)` 호출 직후 → 응답을 기다리는 동안 그 작업은 blocked와 비슷한 상태.
- 응답 도착 → 이벤트 루프 큐에 들어감 (waiting 비슷).
- 이벤트 루프가 처리 시작 → running.

오개념 예방:

- waiting을 "기다리는 모든 상태"라고 오해하기 쉬운데, 정확히는 "CPU만 기다리는 준비된 상태"입니다. 외부 자원 대기는 blocked로 따로 분리합니다.
- terminated 직후에 자원이 즉시 회수되는 것 같지만, 부모 프로세스가 자식의 종료 코드를 `wait()`로 회수하기 전까지 좀비 프로세스(zombie)로 잠시 남습니다. 부모가 wait()를 안 하면 자식 자료구조가 영영 안 지워지는 게 좀비 누수.
