# 스레드(thread)란 무엇이며, 프로세스와 어떤 관계인가?

## 도입

프로세스가 "실행 환경(자원의 단위)"이라면, 스레드는 그 안에서 실제로 코드를 한 줄씩 처리해나가는 흐름입니다. JS 개발자에게 익숙한 비유로는, `node app.js`가 만든 프로세스 안에서 V8이 코드를 위에서 아래로 실행하는 그 "실행 흐름" 자체가 스레드.

---

## 본문

> A thread is the smallest sequence of programmed instructions

스레드는 프로그래밍된 명령어들의 가장 작은 시퀀스다.

- **smallest**: OS 스케줄러가 다룰 수 있는 가장 작은 실행 단위. 더 잘게 나눌 수 없는 최소 단위라는 의미.
- **sequence**: 명령어가 순서대로 하나씩 이어지는 흐름. JS의 `a(); b(); c();`가 한 줄씩 차례로 실행되는 그 흐름이 시퀀스의 본질입니다. 병렬이 아니라 순차.
- **programmed instructions**: 프로그램으로 작성된 기계어 명령들. CPU가 직접 처리할 수 있는 단위.

> that can be managed independently by a scheduler.

스케줄러에 의해 독립적으로 관리될 수 있다.

- **managed independently**: 다른 스레드의 진행 여부와 무관하게, 스케줄러가 이 스레드 하나만 따로 떼서 CPU에 올리거나 내릴 수 있다는 뜻. 같은 프로세스 안의 다른 스레드가 멈춰 있어도 이 스레드는 진행 가능.
- **scheduler**: OS가 "지금 어떤 스레드를 CPU에 올릴까"를 결정하는 컴포넌트. 프로세스가 아니라 스레드가 스케줄링 단위라는 점이 핵심.

> In many cases, a thread is a component of a process.

많은 경우, 스레드는 프로세스의 구성 요소다.

- **component of a process**: 스레드는 프로세스에 포함된 일부. 프로세스라는 그릇 안에 1개 이상의 스레드가 들어 있습니다. 스레드 단독으로는 메모리·파일 핸들 같은 자원을 가질 수 없으므로, 반드시 프로세스 안에 속해야 합니다.

---

**본문 (보충)**

스레드와 프로세스의 역할 구분을 한 줄로:

- **프로세스 = 자원의 단위**: 메모리, 파일 핸들, 권한 같은 "재산"을 소유.
- **스레드 = 실행의 단위**: 그 재산 위에서 실제로 코드를 한 줄씩 진행.

---

## 종합

`node app.js`로 1억 번 도는 for 루프를 실행한다고 합시다. 이때:

- **프로세스가 한 일**: 메모리 할당(`i` 변수 공간), `stdout` 파일 핸들 확보, V8이 변환한 기계어 코드 적재, 권한 설정.
- **스레드가 하는 일**: `i = 0` → 조건 확인 → 본문 → `i++` → 조건 확인 → ... 을 1억 번 순서대로 실행.

스레드가 `i`를 읽고 쓸 수 있는 건 프로세스가 메모리를 미리 확보해뒀기 때문입니다. 자원과 실행을 분리한 이 구조가 OS 설계의 핵심.

오개념 예방: "JS는 싱글스레드"라는 말은 정확히는 "JS 코드를 실행하는 메인 스레드가 1개"라는 뜻이지, Node.js 프로세스 전체에 스레드가 1개라는 뜻은 아닙니다. libuv가 내부적으로 추가 스레드를 띄우고, V8도 GC 스레드 등을 가집니다. 다만 사용자 코드는 한 스레드에서만 실행되므로 race condition 걱정이 없는 것.

User Annotation 보충: "잡(Job) 스케줄링" 같은 표현이 나와도 헷갈리지 마세요 — 그건 프로세스 단위 스케줄링이고, 여기서 말하는 스케줄링은 스레드 단위입니다. 현대 OS는 사실상 스레드 단위로 CPU를 분배합니다.

프로세스와 스레드의 포함 관계를 계층도로:

```
   +----------------------------------------+
   |  Process (자원의 단위)                   |
   |   - Memory (코드/데이터/힙)              |
   |   - File handles, Sockets              |
   |   - Permissions                        |
   |                                        |
   |  +----------+ +----------+ +---------+ |
   |  | Thread 1 | | Thread 2 | |Thread N | |
   |  | (실행)   | | (실행)   | | (실행)  | |
   |  |  -Stack  | |  -Stack  | | -Stack  | |
   |  |  -Reg    | |  -Reg    | | -Reg    | |
   |  |  -PC     | |  -PC     | | -PC     | |
   |  +----------+ +----------+ +---------+ |
   |     +------공유 자원 위에서 실행------+  |
   +----------------------------------------+

   프로세스 = 그릇 (자원 소유)
   스레드  = 그 안에서 코드를 한 줄씩 처리하는 흐름
   N >= 1 (최소 1개 메인 스레드 필수)
```

핵심: 프로세스가 자원을 소유하고, 스레드는 그 자원 위에서 실행만 한다. 스레드 단독으로는 메모리·파일을 가질 수 없어 반드시 프로세스 안에 속해야 한다.

---

# 같은 프로세스의 스레드들이 자원을 공유한다고 할 때, 구체적으로 어떤 데이터를 공유하고 어떤 데이터는 스레드마다 독립인가?

## 도입

스레드가 "프로세스 안의 실행 흐름"이라는 건 알았는데, 그 흐름들끼리 어떤 데이터를 같이 쓰고 어떤 데이터는 따로 가질까요? 이 구분이 스레드 프로그래밍의 모든 위험과 이점의 출발점입니다 — 공유하니까 빠르고, 공유하니까 race condition이 생깁니다.

---

## 본문

> The multiple threads of a given process may be executed concurrently (via multithreading capabilities),

한 프로세스의 여러 스레드는 (멀티스레딩 기능을 통해) 동시에 실행될 수 있다.

- **multiple threads of a given process**: 한 프로세스 안에 스레드가 여러 개 있다는 전제. 1프로세스 1스레드가 아니라, 1프로세스 N스레드가 가능합니다.
- **concurrently**: 동시에 진행되는 것처럼 보이는 것. 1코어에서는 시분할로, 멀티코어에서는 진짜 병렬로 실행될 수 있습니다.

> sharing resources such as memory,

메모리 같은 자원을 공유하면서.

- **sharing resources**: 같은 프로세스의 스레드들은 자원을 공유합니다. 이게 스레드의 존재 이유 — 새 자원을 할당하지 않고 기존 프로세스 자원에 얹혀가니 가볍고 빠릅니다.
- **memory**: 가장 대표적인 공유 자원. 같은 주소 공간을 본다는 뜻이라, 한 스레드가 변경한 변수 값을 다른 스레드가 즉시 볼 수 있습니다.

> while different processes do not share these resources.

반면 서로 다른 프로세스는 이런 자원을 공유하지 않는다.

- **different processes do not share**: 프로세스 간 격리. Chrome 탭 A가 탭 B의 메모리를 못 읽는 이유. 통신하려면 IPC라는 별도 메커니즘이 필요합니다.

> In particular, the threads of a process share its executable code and the values of its dynamically allocated variables and global variables at any given time.

특히, 한 프로세스의 스레드들은 실행 가능한 코드와, 동적으로 할당된 변수·전역 변수의 값을 매 시점 공유한다.

- **executable code**: 텍스트 영역(코드 영역). 같은 함수를 여러 스레드가 호출할 수 있는 이유 — 코드 자체는 공유.
- **dynamically allocated variables**: 힙에 할당된 변수들. JS로 치면 `const obj = {}`, `const arr = []` 같이 동적으로 만든 객체. 모든 스레드가 같은 힙을 봅니다.
- **global variables**: 전역 변수. 데이터 영역에 저장되며, 모든 스레드가 공유.
- **at any given time**: "어느 시점에든". 한 스레드가 값을 바꾸면 다른 스레드가 다음 순간 다른 값을 볼 수 있다는 뜻 — 동기화 문제의 핵심.

---

## 종합

공유/독립을 표로 정리:

| 데이터 | 위치 | 공유 여부 |
|---|---|---|
| 코드(텍스트) | 코드 영역 | 공유 |
| 전역 변수 | 데이터 영역 | 공유 |
| 동적 할당 객체 | 힙 | 공유 |
| 함수 호출 추적 | 스택 | **스레드마다 독립** |
| thread-local 변수 | TLS | **스레드마다 독립** |
| 레지스터(PC 포함) | CPU | **스레드마다 독립** |

스택이 독립이어야 하는 이유: 스레드 A가 `funcA()`를 호출 중이고 스레드 B가 `funcB()`를 호출 중인데, 둘이 같은 스택을 쓰면 누가 어디로 return해야 할지 알 수 없어집니다. 그래서 각 스레드는 자기만의 콜 스택을 가집니다.

JS 비유: Web Worker는 기본적으로 메모리를 공유하지 않습니다 (각 워커가 별도 스레드이지만 격리된 힙). `postMessage`로 데이터를 주고받을 때 구조적 복제(structured clone)가 일어나죠. 명시적으로 메모리를 공유하려면 `SharedArrayBuffer`를 써야 하고, 그때부터는 `Atomics` API로 동기화를 직접 관리해야 합니다. 반면 C/Java 같은 네이티브 스레드는 기본이 공유 — 그래서 mutex/lock이 일상적으로 필요합니다.

오개념 예방: "스레드는 모든 걸 공유한다"는 부정확합니다. 코드·힙·전역은 공유해도 스택과 레지스터는 독립이라는 점을 놓치면, 왜 함수 호출이 스레드마다 안 꼬이는지 설명이 안 됩니다. 공유와 독립의 경계를 정확히 아는 게 멀티스레드 디버깅의 출발점.

공유 vs 독립 데이터를 메모리 레이아웃으로:

```
   +================== Process Memory ==================+
   |                                                    |
   |   ============ 공유 영역 (모든 스레드) ============   |
   |                                                    |
   |   +------------------+                             |
   |   | Code (text)      |  실행 가능 기계어            |
   |   +------------------+                             |
   |   | Data             |  전역 변수                  |
   |   +------------------+                             |
   |   | Heap             |  동적 할당 객체 (new, malloc)|
   |   +------------------+                             |
   |                                                    |
   |   ============ 스레드별 독립 영역 ================   |
   |                                                    |
   |   +-------------+ +-------------+ +-------------+  |
   |   | Thread 1    | | Thread 2    | | Thread 3    |  |
   |   |  Stack      | |  Stack      | |  Stack      |  |
   |   |  Registers  | |  Registers  | |  Registers  |  |
   |   |  PC         | |  PC         | |  PC         |  |
   |   |  TLS        | |  TLS        | |  TLS        |  |
   |   +-------------+ +-------------+ +-------------+  |
   +====================================================+
```

핵심:
- 공유: Code, Data(전역), Heap → 한 스레드가 바꾸면 다른 스레드도 즉시 본다 (race condition의 토대)
- 독립: Stack, Registers, PC, TLS → 함수 호출이 스레드마다 안 섞이는 이유

---

# 유저 스레드(user thread)란 무엇이며, 커널 스레드와 어떤 점에서 다른가?

## 도입

스레드는 누가 스케줄링하느냐에 따라 두 종류로 갈립니다. OS 커널이 직접 관리하면 커널 스레드, 사용자 공간의 런타임이 알아서 굴리면 유저 스레드. JS 개발자에게 가장 친숙한 예는 Node.js 이벤트 루프 — 커널은 이벤트 루프 내부의 "작업 단위"를 모르고, libuv가 알아서 스케줄링합니다.

---

## 본문

> At the kernel level, a process contains one or more kernel threads, which share the process's resources, such as memory and file handles

커널 수준에서, 프로세스는 하나 이상의 커널 스레드를 포함하며, 이 스레드들은 메모리와 파일 핸들 같은 프로세스 자원을 공유한다.

- **kernel level**: OS 커널 영역. 커널이 직접 인지하고 관리하는 계층.
- **kernel threads**: 커널이 스케줄링 대상으로 인식하는 스레드. 커널의 스레드 테이블에 등록되어 있고, OS가 직접 CPU를 분배합니다.
- **share the process's resources**: 프로세스가 가진 메모리·파일 핸들을 공유. 프로세스가 자원을 소유하고, 스레드는 그 자원 위에서 실행만 합니다.

> a process is a unit of resources, while a thread is a unit of scheduling and execution.

프로세스는 자원의 단위, 스레드는 스케줄링과 실행의 단위다.

- **unit of resources**: 메모리·파일·권한 같은 재산을 묶어 관리하는 단위. 자원 회계의 기본.
- **unit of scheduling and execution**: CPU 시간을 받고 실제로 명령어를 실행하는 주체. 자원과 실행을 분리한 게 현대 OS 설계.

> Kernel scheduling is typically uniformly done preemptively or, less commonly, cooperatively.

커널 스케줄링은 보통 일관되게 선점적으로 이루어지며, 협력적 방식은 드물다.

- **preemptively**: OS가 스레드의 동의 없이 강제로 CPU를 회수. 한 스레드가 무한루프에 빠져도 OS가 끊고 다음 스레드에 넘길 수 있습니다.
- **cooperatively**: 스레드가 자발적으로 양보해야만 전환. 한 스레드가 양보 안 하면 시스템 전체가 멈춥니다 — 그래서 현대 커널은 거의 안 씁니다.

> At the user level a process such as a runtime system can itself schedule multiple threads of execution.

사용자 수준에서, 런타임 시스템 같은 프로세스가 직접 여러 실행 스레드를 스케줄링할 수 있다.

- **user level**: 사용자 공간. 커널이 아닌 일반 프로세스 영역.
- **runtime system**: Node.js, JVM, Go 런타임처럼 프로그램 실행을 책임지는 소프트웨어. 자기 안에서 작업 단위들을 직접 굴립니다.
- **schedule multiple threads of execution**: 런타임이 자기만의 스케줄러를 가지고 작업들을 번갈아 실행. 커널은 이 작업들의 존재를 모릅니다.

> If these do not share data, as in Erlang, they are usually analogously called processes,

이들이 데이터를 공유하지 않는다면(Erlang이 그러하듯), 보통 유사하게 "프로세스"라고 불린다.

- **do not share data**: 각 실행 단위가 독립된 메모리를 가짐. 메시지 패싱으로만 통신.
- **as in Erlang**: Erlang의 액터 모델. 가벼운 실행 단위인데도 "프로세스"라 부르는 이유 — OS 프로세스처럼 격리되어 있기 때문.

> while if they share data they are usually called (user) threads, particularly if preemptively scheduled.

데이터를 공유하면 보통 (유저) 스레드라 불린다. 특히 선점적으로 스케줄링되는 경우.

- **share data**: 같은 메모리를 공유. 그래서 유저 "스레드"라는 명칭.
- **(user)**: "user"는 사용자 공간에서 동작한다는 강조. 커널이 모르는 스레드라는 뜻.

---

## 종합

용어를 매트릭스로:

| 종류 | 누가 스케줄링 | 데이터 공유 | 예시 |
|---|---|---|---|
| 커널 스레드 | OS 커널 | 같은 프로세스 내 공유 | pthread, Java Thread |
| 유저 스레드 | 런타임/라이브러리 | 공유 | Node.js의 작업 단위 |
| (격리된) 유저 단위 | 런타임 | 공유 안 함 | Erlang process, Go goroutine 채널 통신 |

JS 비유로 풀면: Node.js의 이벤트 루프는 콜백·Promise를 차례로 처리하는 사용자 공간 스케줄러입니다. 커널 입장에서 Node.js 프로세스는 그냥 메인 스레드 1개일 뿐, 그 안에서 수천 개의 비동기 작업이 돌아가는 건 모릅니다. libuv가 자체적으로 굴리는 것.

이게 없으면 어떻게 되는가: 유저 수준 스케줄링이 없으면 모든 동시성을 커널 스레드로 표현해야 합니다. 1만 개 동시 연결을 처리하려면 1만 개 커널 스레드 — 컨텍스트 스위치 비용·메모리(스레드당 스택)로 시스템이 무너집니다. Node.js가 1만 동시 연결을 손쉽게 처리하는 건 사용자 공간에서 가벼운 단위로 굴리기 때문.

Official Annotation 보충: 커널 스레드가 소유하는 건 스택·레지스터·TLS뿐(나머지는 프로세스 공유)이라 생성/파괴가 저렴합니다. 유저 스레드는 더 저렴 — 커널과 상호작용 없이 사용자 공간 안에서만 전환되니, 시스템 콜 자체가 안 일어납니다. 다만 다음 질문에서 다룰 블로킹 시스템 콜 문제가 트레이드오프로 따라옵니다.

---

# 커널 스레드가 소유하는 자원은 무엇이며, 프로세스와 비교해 생성/파괴가 저렴한 이유는?

## 도입

스레드가 "프로세스에 비해 가볍다"는 말을 자주 듣는데, 정확히 무엇이 가벼운지 따지는 질문입니다. 가벼움의 정체는 두 가지 — 생성 비용과 전환 비용. 이 둘이 왜 저렴한지를 자원 소유 구조에서 풀어냅니다.

---

## 본문

> Kernel threads do not own resources except for a stack, a copy of the registers including the program counter, and thread-local storage (if any),

커널 스레드는 스택, 프로그램 카운터를 포함한 레지스터의 복사본, 그리고 (있다면) 스레드 로컬 저장소를 제외하고는 자원을 소유하지 않는다.

- **do not own resources except for**: 스레드는 거의 아무것도 소유하지 않습니다. 메모리 주소 공간·파일 핸들·권한은 전부 프로세스 것을 빌려 씁니다.
- **a stack**: 콜 스택. 함수 호출 추적용으로 스레드마다 따로 가져야 합니다 (다른 스레드의 호출과 섞이면 안 되니까).
- **a copy of the registers including the program counter**: 레지스터 값의 사본. 특히 PC(다음에 실행할 명령어 주소)는 스레드마다 다른 위치를 가리키니 독립이 필수.
- **thread-local storage (TLS)**: 스레드 전용 저장소. 모든 스레드가 보는 전역 변수와 별개로, 각 스레드만 보는 변수 영역. JS의 `AsyncLocalStorage`가 비슷한 추상화입니다.

> and are thus relatively cheap to create and destroy.

따라서 생성과 파괴가 비교적 저렴하다.

- **cheap to create**: 새 스레드를 만들 때 스택·레지스터·TLS만 할당하면 끝. 주소 공간이나 파일 디스크립터 테이블을 새로 만들 필요가 없습니다.
- **destroy**: 파괴할 때도 마찬가지. 자기 소유물만 정리하면 됩니다.

> Thread switching is also relatively cheap: it requires a context switch (saving and restoring registers and stack pointer),

스레드 전환도 비교적 저렴하다 — 컨텍스트 스위치(레지스터와 스택 포인터의 저장/복원)가 필요하다.

- **saving and restoring registers and stack pointer**: 현재 스레드의 레지스터·SP를 저장하고, 다음 스레드의 것을 복원. 이 작업 자체는 어쩔 수 없이 일어납니다.

> but does not change virtual memory and is thus cache-friendly (leaving TLB valid).

하지만 가상 메모리는 변하지 않으므로 캐시 친화적이다(TLB가 유효하게 유지된다).

- **does not change virtual memory**: 같은 프로세스 안의 스레드들은 같은 주소 공간을 공유. 전환해도 메모리 매핑이 안 바뀝니다.
- **cache-friendly**: CPU 캐시(L1·L2 등)에 들어 있는 데이터가 그대로 유효. 새 스레드도 같은 메모리를 보니 캐시 미스가 적습니다.
- **TLB**: Translation Lookaside Buffer. 가상 주소 → 물리 주소 변환을 캐싱하는 하드웨어. 주소 공간이 안 바뀌면 TLB의 매핑 정보를 그대로 써도 됩니다.

---

## 종합

비용 구조를 정리:

| 항목 | 프로세스 생성/전환 | 스레드 생성/전환 |
|---|---|---|
| 주소 공간 | 새로 할당 / 전환 시 무효화 | 공유 / 그대로 유지 |
| 파일 디스크립터 테이블 | 새로 할당 | 공유 |
| 레지스터·스택 | 신규 | 신규 (스레드만의 것) |
| TLB | 전환 시 flush | 유효하게 유지 |
| 캐시 (L1/L2) | 사실상 cold 시작 | warm 유지 가능 |

집/방 비유: 프로세스 전환은 집을 옮기는 것입니다. 가구도 옮기고, 주소도 바뀌고, 새 동네에서는 길을 다시 외워야 합니다(TLB 무효). 스레드 전환은 같은 집에서 방만 바꾸는 것 — 짐도 그대로, 길도 그대로, 가구도 그대로.

JS 비유: Web Worker를 새로 띄우는 것은 별도 V8 isolate를 만드는 작업이라 사실상 무거운 편(스레드라기보다 별도 실행 컨텍스트에 가까움). 반면 같은 이벤트 루프 안에서 콜백을 전환하는 건 사용자 공간 작업이라 매우 저렴 — 커널 컨텍스트 스위치조차 일어나지 않습니다.

이게 없으면 어떻게 되는가: 만약 스레드도 자기만의 주소 공간을 가져야 했다면, 멀티스레딩의 가벼움이라는 핵심 장점이 사라집니다. 스레드를 1000개 띄우려면 메모리 매핑을 1000개 만들어야 하고, 전환할 때마다 TLB가 통째로 무효화되니, 사실상 프로세스를 1000개 띄우는 것과 다를 게 없죠. 자원 공유가 곧 스레드의 존재 이유.

AI Annotation 보충: 프로세스의 PCB는 메모리 맵·파일 디스크립터 테이블·권한 등 무거운 정보를 통째로 담지만, 스레드의 TCB(Thread Control Block)는 스택 포인터·PC·레지스터·TLS 정도로 끝입니다. 그래서 스레드 풀(미리 N개 만들어두고 재사용)이 실용적인 패턴이 되는 것.

---

# 유저 스레드에서 블로킹 시스템 콜이 문제가 되는 이유와, 이를 해결하는 방법은?

## 도입

유저 스레드는 커널이 모르기 때문에 가볍지만, 바로 그 "커널이 모름"이 결정적 약점을 만듭니다. 한 유저 스레드가 디스크나 네트워크를 기다리는 시스템 콜을 부르면, 커널은 프로세스 전체를 잠재워버립니다. 같은 프로세스 안의 다른 유저 스레드들도 같이 멈추는 거죠. Node.js가 왜 논블로킹 I/O를 기본으로 하는지의 답이 여기 있습니다.

---

## 본문

> However, the use of blocking system calls in user threads (as opposed to kernel threads) can be problematic.

그러나 (커널 스레드와 달리) 유저 스레드에서 블로킹 시스템 콜을 사용하는 것은 문제가 될 수 있다.

- **blocking system calls**: 결과가 나올 때까지 호출자를 멈춰 세우는 OS 호출. `read()`, `accept()` 같은 동기 I/O가 대표적.
- **as opposed to kernel threads**: 커널 스레드라면 한 스레드가 블로킹돼도 OS가 다른 커널 스레드를 CPU에 올려줍니다. 유저 스레드는 안 그렇습니다.

> If a user thread or a fiber performs a system call that blocks, the other user threads and fibers in the process are unable to run until the system call returns.

만약 유저 스레드나 파이버가 블로킹되는 시스템 콜을 수행하면, 같은 프로세스의 다른 유저 스레드와 파이버는 그 시스템 콜이 반환될 때까지 실행될 수 없다.

- **fiber**: 유저 스레드보다 더 가볍고, 보통 협력적으로 스케줄링되는 실행 단위.
- **the other user threads and fibers in the process are unable to run**: 핵심 문제. 커널은 유저 스레드의 존재를 모르니, 한 놈이 블로킹되면 그 놈이 올라타고 있던 커널 스레드 = 프로세스 전체를 멈춥니다. 다른 유저 스레드들은 CPU를 받을 길이 막힙니다.

> A common solution to this problem (used, in particular, by many green threads implementations)

이 문제의 일반적인 해결책은(특히 많은 그린 스레드 구현에서 사용),

- **green threads**: 사용자 공간에서 구현된 스레드의 일반 명칭. Java 초기 버전, Go의 goroutine 등이 해당.

> is providing an I/O API that implements an interface that blocks the calling thread, rather than the entire process,

호출 스레드를 블로킹하되 프로세스 전체는 블로킹하지 않는 인터페이스를 가진 I/O API를 제공하는 것이다.

- **blocks the calling thread, rather than the entire process**: 사용자 코드 입장에서는 "블로킹"처럼 보이지만, 실제로는 그 유저 스레드만 잠재우고 다른 유저 스레드는 계속 굴러가게 한다는 뜻. API의 환상(illusion)이 핵심.

> by using non-blocking I/O internally, and scheduling another user thread or fiber while the I/O operation is in progress.

내부적으로 논블로킹 I/O를 사용하고, I/O 작업이 진행되는 동안 다른 유저 스레드나 파이버를 스케줄링하는 것이다.

- **non-blocking I/O internally**: 커널에는 "I/O 시작만 하고 완료를 기다리지는 마라"고 알리는 시스템 콜(`epoll`, `kqueue`, `IOCP` 등)을 사용. 커널은 즉시 반환합니다.
- **scheduling another user thread or fiber while the I/O operation is in progress**: 그 사이 런타임은 다른 작업을 골라 CPU에 올림. I/O가 끝났다는 신호를 받으면 원래 스레드를 깨워 다시 진행.

> Alternatively, the program can be written to avoid the use of synchronous I/O or other blocking system calls (in particular, using non-blocking I/O, including lambda continuations and/or async/await primitives).

대안적으로, 프로그램을 동기 I/O나 다른 블로킹 시스템 콜을 피하도록 작성할 수 있다(특히 람다 연속(continuation)이나 async/await 프리미티브를 사용한 논블로킹 I/O를 활용해).

- **lambda continuations**: 콜백 기반 비동기 — "이 작업 끝나면 이 함수 실행해" 식으로 후속 작업을 람다로 넘기는 패턴.
- **async/await primitives**: 비동기 코드를 동기 코드처럼 쓰게 해주는 문법. 내부적으로는 위 continuation을 컴파일러가 자동 생성.

---

## 종합

문제와 해결을 한 문장으로: 유저 스레드는 커널이 모르니, 동기 I/O를 부르면 커널은 프로세스 전체를 재워버립니다. 해결책은 (a) "동기처럼 보이지만 내부적으로 논블로킹"인 I/O API를 런타임이 제공하거나, (b) 애초에 동기 I/O를 안 쓰고 async/await으로 작성하는 것.

JS/Node.js로 매핑:

```js
// 위험 (브라우저나 동기 API의 경우)
const data = readFileSync('big.json'); // 메인 스레드 = 프로세스 전체 멈춤

// 해결 1 — 비동기 API
const data = await readFile('big.json'); // 내부적으로 libuv가 논블로킹으로 처리
```

Node.js는 libuv의 이벤트 루프 + 스레드 풀을 통해 이 문제를 우회합니다. `fs.readFile()`을 부르면 libuv가 내부 워커 스레드 풀에 작업을 떠넘기고, 메인 스레드(이벤트 루프)는 즉시 다른 콜백을 처리하러 갑니다. 사용자 코드 입장에서는 그냥 `await`만 보이는데, 그 뒤에서 일어나는 일이 정확히 위 Official Answer의 메커니즘.

이게 없으면 어떻게 되는가: 만약 Node.js가 동기 I/O만 지원했다면, HTTP 요청 한 건이 디스크를 읽는 동안 다른 모든 요청이 대기해야 합니다. 1만 동시 연결은커녕 100 RPS도 힘들 거예요. async/await + 논블로킹 I/O가 Node.js 성능 모델의 본질.

오개념 예방: `await`이 "그 줄에서 멈추는" 것처럼 보이지만, 실제로는 그 함수의 나머지 부분을 continuation(콜백)으로 등록해두고 즉시 반환합니다. 이벤트 루프는 그 사이 다른 작업을 처리하다가, await한 Promise가 resolve되면 등록해둔 continuation을 큐에 넣어 재개합니다. "블로킹처럼 보이는 논블로킹"의 가장 깔끔한 추상화.

AI Annotation 보충: Go의 goroutine도 같은 원리입니다 — 사용자가 `time.Sleep()`이나 채널 read를 호출하면, Go 런타임은 해당 goroutine만 재우고 같은 OS 스레드 위에서 다른 goroutine을 굴립니다. 동기 코드처럼 보이지만 런타임이 비동기로 풀어내는 것.

문제와 해결의 흐름을 다이어그램으로:

```
   [문제: 블로킹 시스템 콜]

   Process (커널이 보는 스레드 1개)
   +-------------------------------------+
   | UT-1  UT-2  UT-3                    |
   |  |                                  |
   |  v  read() 동기 호출                 |
   +--|----------------------------------+
      v
   Kernel: "이 커널 스레드 잠재움"
      |
      v
   +-------------------------------------+
   | UT-1 (잠) UT-2 (X) UT-3 (X)         |
   |   blocked  멈춤    멈춤              |
   +-------------------------------------+
   결과: 한 유저 스레드 때문에 프로세스 전체 정지


   [해결: 논블로킹 I/O + 런타임 스케줄러]

   Process
   +-------------------------------------+
   | UT-1  UT-2  UT-3                    |
   |  |                                  |
   |  v  비동기 read 요청 등록             |
   +--|----------------------------------+
      v
   Kernel: 즉시 반환 (epoll/kqueue/IOCP)
      |
      v
   런타임: "UT-1만 잠재우고 UT-2 깨움"
   +-------------------------------------+
   | UT-1 (대기) UT-2 (실행) UT-3 (대기)  |
   +-------------------------------------+
      |
      |  I/O 완료 통지 도착
      v
   런타임: UT-1 깨움 → 결과 전달
```

핵심: 동기 호출은 "한 스레드가 자는 것"이 아니라 "프로세스 전체가 자는 것"이므로, 런타임이 내부적으로 논블로킹 I/O를 쓰고 다른 유저 스레드를 그 시간에 굴려야 한다.

---

# 프로세스 전환(context switch)이 스레드 전환보다 비용이 큰 이유는?

## 도입

스레드 전환과 프로세스 전환 모두 컨텍스트 스위치 — 레지스터 저장/복원이라는 기본 비용은 같습니다. 그런데도 프로세스 전환이 훨씬 비싸다는데, 그 추가 비용은 어디서 나올까요? 답은 한 단어 — 주소 공간이 바뀌기 때문.

---

## 본문

> A process is a heavyweight unit of kernel scheduling,

프로세스는 커널 스케줄링의 무거운(heavyweight) 단위다.

- **heavyweight**: 메모리 맵·파일 디스크립터 테이블·권한 등 통째로 묶인 자원의 단위. 스레드가 lightweight unit으로 불리는 것과 대조.
- **kernel scheduling**: OS 커널이 직접 관리·전환하는 단위. 사용자 공간의 작업과 다름.

> as creating, destroying, and switching processes is relatively expensive.

프로세스를 생성·파괴·전환하는 비용이 비교적 비싸기 때문이다.

- **creating, destroying, and switching**: 세 가지 모두 비쌉니다. 생성은 PCB·주소 공간·파일 테이블 신규 할당, 파괴는 그 회수, 전환은 아래 설명할 캐시 플러시.

> Processes are typically preemptively multitasked,

프로세스는 보통 선점적으로 멀티태스킹된다.

- **preemptively multitasked**: OS가 프로세스의 동의 없이 강제로 CPU를 회수해 다른 프로세스에 줌. 협력적 방식이 아니라는 점이 현대 OS의 표준.

> and process switching is relatively expensive, beyond basic cost of context switching,

프로세스 전환은 컨텍스트 스위치의 기본 비용을 넘어서 비교적 비싸다.

- **beyond basic cost of context switching**: 레지스터 저장/복원이라는 기본 작업은 스레드 전환에서도 똑같이 발생. 프로세스 전환에는 그것을 넘어서는 추가 비용이 붙는다는 뜻.

> due to issues such as cache flushing (in particular, process switching changes virtual memory addressing, causing invalidation and thus flushing of an untagged translation lookaside buffer (TLB), notably on x86).

캐시 플러시 같은 문제 때문이다(특히, 프로세스 전환은 가상 메모리 주소 매핑을 바꿔 untagged TLB의 무효화·플러시를 유발하며, 특히 x86에서 그렇다).

- **cache flushing**: 캐시에 들어 있던 내용을 비우는 작업. 다음 프로세스는 cold cache에서 시작해야 하니 메모리 접근이 느려집니다.
- **changes virtual memory addressing**: 프로세스마다 자기만의 가상 주소 공간을 가지므로, 전환 시 매핑이 통째로 바뀝니다.
- **TLB invalidation/flushing**: TLB는 가상 → 물리 주소 변환을 캐시한 하드웨어. 매핑이 바뀌면 기존 TLB 엔트리는 의미가 없어져 전부 무효화해야 합니다.
- **untagged TLB**: 프로세스 ID 태그가 없는 TLB. 어느 프로세스의 매핑인지 구분 못 하니 전환 시 통째로 비워야 함. 태그된 TLB(ARM 등)는 일부 회피 가능.
- **notably on x86**: x86 CPU는 전통적으로 untagged TLB여서 이 비용이 더 두드러집니다.

---

## 종합

비용 구성을 분해하면:

| 비용 항목 | 스레드 전환 | 프로세스 전환 |
|---|---|---|
| 레지스터 저장/복원 | 발생 | 발생 |
| 스택 포인터 전환 | 발생 | 발생 |
| 가상 메모리 매핑 변경 | **없음** | **있음** |
| TLB 플러시 | **없음** | **있음** |
| CPU 캐시 무효 | 거의 없음 | **사실상 cold start** |

집/방 비유: 스레드 전환은 같은 집의 방을 옮기는 것 — 가구·주소·길 다 그대로. 프로세스 전환은 이사하는 것 — 새 동네 길을 다시 외워야 하고(TLB), 짐을 새로 풀어야 하고(캐시), 우편함을 새로 등록해야 합니다(파일 디스크립터).

JS 비유: Chrome이 탭마다 별도 프로세스를 띄우는 건 안전성(한 탭 크래시가 다른 탭에 영향 없음)을 위해서지만, 그 대가가 바로 이 컨텍스트 스위치 비용입니다. 탭 간 전환 시 OS가 프로세스를 갈아끼우니 캐시·TLB가 무효화되죠. 그래서 Chrome은 메모리·CPU를 많이 먹는 대신 안전한 격리를 얻은 셈.

이게 없으면 어떻게 되는가: 만약 OS가 프로세스 전환에서 TLB 플러시를 안 한다면, 새 프로세스가 이전 프로세스의 메모리를 잘못된 주소 변환으로 읽어 데이터 누설·크래시·보안 침해가 일어납니다. 비싸지만 필수 비용.

오개념 예방: "스레드는 가벼우니 무조건 좋다"는 부정확. 스레드 전환은 캐시는 살아 있어도 race condition 같은 동기화 비용이 새로 생깁니다. 가벼움(전환 비용)과 안전(격리·동기화)은 다른 차원의 트레이드오프.

AI Annotation 보충: TLB는 RAM보다 훨씬 빠른 하드웨어 캐시인데, 프로세스 전환 한 번에 전부 무효화되면 새 프로세스가 처음 몇 천 번의 메모리 접근에서 모두 풀 페이지 워크(가상 → 물리 변환을 페이지 테이블 따라 직접 계산)를 해야 합니다. 이게 "느림"의 정체.

---

# 스레드가 같은 주소 공간을 공유하는 것의 위험성은 무엇이며, 실제 소프트웨어에서 이를 어떻게 회피하는가?

## 도입

스레드의 가벼움은 메모리 공유에서 옵니다. 하지만 같은 메모리를 공유한다는 건, 한 스레드가 잘못된 메모리 접근을 하면 OS가 전체 프로세스를 죽인다는 뜻입니다. Chrome이 탭마다 프로세스를 분리하는 진짜 이유가 여기 있습니다.

---

## 본문

> Thread crashes a process:

스레드가 프로세스를 크래시시킨다 —

- **crashes a process**: 한 스레드의 잘못이 그 스레드만 죽이는 게 아니라 프로세스 전체를 죽인다는 진술. 격리가 안 되어 있다는 뜻.

> due to threads sharing the same address space,

스레드가 같은 주소 공간을 공유하기 때문에,

- **same address space**: 모든 스레드가 동일한 메모리 매핑을 봅니다. 한 스레드가 만든 객체를 다른 스레드가 같은 주소로 접근. 이게 빠른 통신과 위험성을 동시에 줍니다.
- **address space**: 가상 메모리의 주소 영역. 프로세스마다 하나씩, 그 안의 스레드들은 공유.

> an illegal operation performed by a thread can crash the entire process;

한 스레드가 수행한 불법 연산이 프로세스 전체를 크래시시킬 수 있다.

- **illegal operation**: null 포인터 역참조, 잘못된 주소 쓰기, 보호된 메모리 접근 같은 메모리 위반. OS가 SIGSEGV 같은 신호를 보냅니다.
- **crash the entire process**: OS는 프로세스 단위로 메모리 보호를 하니, 한 스레드의 위반이라도 프로세스 전체가 종료됩니다. 스레드만 죽이고 프로세스는 유지하는 식의 부분 회복은 OS가 보장하지 않습니다.

> therefore, one misbehaving thread can disrupt the processing of all the other threads in the application.

따라서 한 잘못 동작하는 스레드가 애플리케이션의 다른 모든 스레드의 처리를 방해할 수 있다.

- **misbehaving thread**: 버그가 있거나 악의적인 스레드. 직접적인 메모리 손상뿐 아니라, 락을 잡고 안 놓아 다른 스레드를 영원히 대기시키는 경우도 포함.
- **disrupt the processing of all the other threads**: 한 스레드의 영향이 모든 형제 스레드에 미친다는 점이 핵심. 격리 없음 = 신뢰성 없음.

---

## 종합

회피 방법은 본질적으로 "프로세스 단위로 격리"입니다. 같은 주소 공간을 공유하는 한 스레드 간 격리는 불가능에 가까우니, 자원이 비싸더라도 프로세스를 분리하는 거죠.

| 격리 수준 | 비용 | 한 컴포넌트 크래시 영향 | 예시 |
|---|---|---|---|
| 멀티스레드 | 가벼움 | 전체 프로세스 다운 | 일반 멀티스레드 앱 |
| 멀티프로세스 + IPC | 무거움 | 해당 프로세스만 다운 | Chrome 탭 분리 |
| 별도 머신 | 매우 무거움 | 해당 머신만 다운 | 마이크로서비스 |

JS 비유 — Chrome의 멀티프로세스 아키텍처:

- 각 탭이 별도 OS 프로세스. 한 탭의 JS가 무한루프에 빠지거나 메모리 위반을 일으켜도 다른 탭은 멀쩡합니다.
- 비용: 탭마다 V8 isolate, 메모리 매핑, 프로세스 컨텍스트가 따로 — Chrome이 메모리를 많이 먹는 이유.
- 이득: 한 탭의 악성 페이지가 다른 탭의 쿠키·세션을 못 봅니다(주소 공간 분리). 보안과 안정성을 동시에 얻음.

이게 없으면 어떻게 되는가: 만약 Chrome이 모든 탭을 한 프로세스의 스레드로 띄웠다면, 한 사이트의 메모리 버그가 다른 모든 탭을 죽이고, 한 사이트의 악성 코드가 다른 사이트의 메모리를 직접 읽을 수 있게 됩니다. 멀티프로세스가 비싸도 안 할 수가 없는 이유.

오개념 예방: "예외 처리(try/catch)로 스레드 크래시 격리할 수 있지 않나?"는 부분적으로만 맞습니다. JS의 throw 같은 언어 레벨 예외는 잡을 수 있지만, 메모리 위반(SIGSEGV)이나 stack overflow 같은 OS 레벨 신호는 try/catch가 못 잡습니다 — OS가 프로세스 자체를 종료시키니까. 진짜 격리는 프로세스 분리뿐.

AI Annotation 보충: 스레드의 공유 모델(빠르고 가볍고 통신 쉬움) vs 프로세스의 격리 모델(안전하지만 비싸고 IPC 필요) — 이 트레이드오프가 시스템 설계의 핵심 분기점입니다. 신뢰성·보안이 우선이면 프로세스, 성능·가벼움이 우선이면 스레드.

---

# 현대 OS(Linux, Windows, macOS)가 채택한 1:1 스레딩 모델이란 무엇인가?

## 도입

스레딩 모델은 "사용자가 만든 스레드 N개를 커널 스레드 몇 개에 매핑할 것인가"의 문제입니다. 현대 주류 OS는 1:1 — 사용자가 스레드 1개 만들면 커널도 스레드 1개 만들어 1:1로 짝짓습니다. 단순하지만 멀티코어 활용이 자연스럽다는 큰 장점이 있습니다.

---

## 본문

> Threads created by the user in a 1:1 correspondence with schedulable entities in the kernel are the simplest possible threading implementation.

사용자가 만든 스레드와 커널의 스케줄 가능한 단위가 1:1로 대응되는 것이 가장 단순한 스레딩 구현이다.

- **created by the user**: 사용자 코드(애플리케이션)가 만든 스레드. 예: `pthread_create()`, `new Thread()`.
- **1:1 correspondence**: 사용자 스레드 1개당 커널 스레드 1개. 사용자가 보는 스레드와 OS가 보는 스레드가 정확히 같은 단위.
- **schedulable entities in the kernel**: 커널이 스케줄링 대상으로 인식하는 단위. 즉, OS가 CPU에 직접 올릴 수 있는 객체.
- **simplest possible threading implementation**: 가장 단순한 구현. 매핑 로직이 거의 없으니 런타임 스케줄러를 따로 만들 필요 없음.

> OS/2 and Win32 used this approach from the start,

OS/2와 Win32는 처음부터 이 방식을 사용했고,

- **from the start**: 초기 설계부터 1:1을 채택. Windows의 일관된 스레드 모델.

> while on Linux the GNU C Library implements this approach (via the NPTL or older LinuxThreads).

리눅스에서는 GNU C 라이브러리가 이 방식을 구현한다(NPTL 또는 더 오래된 LinuxThreads를 통해).

- **GNU C Library (glibc)**: 리눅스의 표준 C 라이브러리. `pthread_create()` 호출이 결국 glibc를 거쳐 커널의 `clone()` 시스템 콜로 이어집니다.
- **NPTL (Native POSIX Thread Library)**: 현대 리눅스의 표준 스레드 라이브러리. LinuxThreads의 후속.
- **LinuxThreads**: 초기 리눅스 스레드 구현. NPTL로 대체됨.

> This approach is also used by Solaris, NetBSD, FreeBSD, macOS, and iOS.

이 방식은 Solaris, NetBSD, FreeBSD, macOS, iOS에서도 사용된다.

- **Solaris, NetBSD, FreeBSD, macOS, and iOS**: 사실상 우리가 쓰는 모든 주요 OS. 1:1이 표준이라는 강력한 증거.

---

## 종합

세 가지 스레딩 모델을 한눈에:

| 모델 | 매핑 | 멀티코어 활용 | 전환 비용 | 예시 |
|---|---|---|---|---|
| 1:1 | 유저 1 ↔ 커널 1 | 자연스럽게 가능 | 보통 | 현대 Linux/Windows/macOS pthread |
| M:1 | 유저 M ↔ 커널 1 | 불가능 (코어 1개만 사용) | 매우 빠름 | 초창기 그린 스레드 |
| M:N | 유저 M ↔ 커널 N | 가능 | 빠름 + 복잡 | Go goroutine, 초기 Solaris |

JS/Node.js와의 관계: Node.js의 Worker Thread API로 만든 워커 스레드는 결국 1:1 모델로 OS 커널 스레드에 매핑됩니다. `new Worker()`를 호출하면 커널에 스레드 1개가 만들어지고, OS가 직접 스케줄링. 그래서 멀티코어 CPU 위에서 Worker가 진짜 병렬로 돌 수 있는 것.

이게 없으면 어떻게 되는가 — M:1만 있다면: 모든 사용자 스레드가 커널 스레드 1개에 묶이니, 8코어 CPU여도 한 번에 1코어만 쓸 수 있습니다. 더 큰 문제는 한 스레드가 블로킹 시스템 콜을 부르면 그 커널 스레드 = 프로세스 전체가 멈춘다는 점. 그래서 현대 OS가 1:1로 옮긴 것.

오개념 예방: "1:1이 가장 단순하고 모두가 채택한다면 M:N은 의미 없는가?"는 너무 단순한 결론입니다. Go의 goroutine은 M:N으로 수만 개의 가벼운 실행 단위를 만들면서도 멀티코어를 활용합니다 — Go 런타임이 사용자 공간 스케줄러를 잘 만들었기 때문에 가능. 다만 OS 차원에서는 1:1이 합리적 기본값이라는 것.

AI Annotation 보충: 1:1 모델이 표준이 된 이유는 (a) 멀티코어 시대에 자연스럽게 병렬화되고, (b) 블로킹 시스템 콜 문제가 없으며(한 스레드 블로킹돼도 OS가 다른 커널 스레드를 굴림), (c) 구현이 단순하다는 세 가지가 합쳐진 결과입니다. CPU 코어 수가 늘어나는 추세에서 이 선택은 더 굳어지고 있습니다.

---

# M:1 스레딩 모델에서 멀티코어 CPU의 성능을 활용할 수 없는 이유는?

## 도입

M:1 모델은 "사용자 스레드 여러 개가 커널 스레드 1개에 묶이는" 구조입니다. 가벼움이 큰 장점이지만, 멀티코어 시대에는 치명적인 약점이 드러납니다 — 코어가 8개 있어도 동시에 1개의 스레드만 실행 가능. 왜 그런지 짚어봅니다.

---

## 본문

> An M:1 model implies that all application-level threads map to one kernel-level scheduled entity;

M:1 모델은 모든 애플리케이션 수준 스레드가 단 하나의 커널 수준 스케줄 단위에 매핑됨을 의미한다.

- **application-level threads**: 사용자 코드에서 만든 스레드(M개). 런타임이 관리.
- **one kernel-level scheduled entity**: 커널이 인식하는 스케줄 대상 단 하나. 커널 입장에서 이 프로세스는 스레드 1개짜리.
- **M:1**: M개의 사용자 스레드를 커널 스레드 1개에 매핑. 커널 자원은 1개만 쓰니 매우 가볍.

> the kernel has no knowledge of the application threads.

커널은 애플리케이션 스레드의 존재를 알지 못한다.

- **no knowledge of the application threads**: 핵심 한계. 커널 입장에서 애플리케이션 스레드들은 그냥 한 커널 스레드의 내부 상태일 뿐. 그래서 커널은 그것들을 따로 스케줄링할 수도, 다른 코어로 분산할 수도 없습니다.

> One of the major drawbacks, however, is that it cannot benefit from the hardware acceleration on multithreaded processors or multi-processor computers:

그러나 주요 단점 중 하나는, 멀티스레드 프로세서나 멀티프로세서 컴퓨터의 하드웨어 가속의 이점을 누릴 수 없다는 점이다.

- **hardware acceleration**: 멀티코어·하이퍼스레딩처럼 하드웨어가 제공하는 병렬 실행 능력. 여러 스레드를 물리적으로 동시 실행할 수 있는 환경.
- **multithreaded processors or multi-processor computers**: 코어가 여러 개거나, CPU 자체가 여러 개인 컴퓨터. 즉, 진짜 병렬이 가능한 하드웨어.

> there is never more than one thread being scheduled at the same time.

같은 시간에 두 개 이상의 스레드가 스케줄링되는 일은 결코 없다.

- **never more than one thread being scheduled at the same time**: 핵심 결과. 커널은 스레드 1개로 인식하니, OS 스케줄러가 동시에 올릴 수 있는 건 그 1개뿐. 코어가 8개여도 7개는 놀고 있어야 합니다.

> For example: If one of the threads needs to execute an I/O request, the whole process is blocked and the threading advantage cannot be used.

예를 들어, 스레드 중 하나가 I/O 요청을 실행해야 하면 전체 프로세스가 블로킹되어 스레딩의 이점을 누릴 수 없다.

- **I/O request**: 디스크나 네트워크 같은 외부 장치 호출. 보통 시간이 오래 걸림.
- **the whole process is blocked**: 한 사용자 스레드가 동기 I/O를 부르면, 그 호출은 결국 커널 스레드 = 프로세스 전체를 잠재웁니다. 다른 사용자 스레드들도 같이 멈춥니다.
- **threading advantage cannot be used**: 멀티스레딩의 가장 중요한 이점(한 스레드가 기다리는 동안 다른 스레드가 진행)이 사라집니다.

---

## 종합

문제의 본질을 두 가지로:

1. **병렬 실행 불가능**: 커널이 1개 스레드만 보니 OS는 1코어에만 올림. 코어 N개 활용 불가.
2. **블로킹 시스템 콜 = 전체 정지**: 한 사용자 스레드의 동기 I/O가 프로세스 전체를 멈춤.

JS/Node.js와의 관계: Node.js의 메인 스레드 모델이 부분적으로 이 패턴과 닮았습니다 — 사용자 코드(콜백·async 함수)는 모두 한 스레드에서 돌아가고, 8코어 머신이라도 메인 스레드는 1코어만 씁니다. 그래서 CPU 집약 작업(이미지 처리, 큰 JSON 파싱)이 메인 스레드를 점유하면 모든 요청이 막히는 것.

해결책의 비교:

| 접근 | 메커니즘 | 한계 극복 |
|---|---|---|
| 1:1 모델 | 사용자 스레드 = 커널 스레드 | 멀티코어 활용 가능, 블로킹 콜이 전체 정지시키지 않음 |
| 비동기 I/O (Node.js) | M:1이지만 동기 I/O를 안 씀 | 블로킹 문제만 회피. 멀티코어는 여전히 못 씀 |
| Web Worker / Worker Thread | 별도 OS 스레드 추가 | CPU 집약 작업을 다른 코어로 보내 진짜 병렬화 |

이게 없으면 어떻게 되는가 — 1:1이나 M:N도 없이 M:1만 있다면: 8코어 서버를 사도 1코어 효과만 나고, 한 동기 호출이 모든 동시 요청을 멈춥니다. 멀티스레딩의 두 가지 이점(병렬·응답성)을 모두 잃는 셈.

오개념 예방: "Node.js가 멀티코어를 못 쓰니 M:1 모델이다"는 정확하지 않습니다. Node.js는 메인 스레드 1개 + libuv 스레드 풀로 구성된 하이브리드. CPU 코어를 풀로 활용하려면 `cluster` 모듈이나 Worker Thread를 명시적으로 써야 합니다. 모델을 강제로 M:1에 끼워 맞추기보다, "기본은 단일 메인 스레드 모델, 필요하면 추가 워커"라고 보는 게 정확합니다.

AI Annotation 보충: M:1은 사용자 공간 전환이 매우 빠르다는 장점이 있어 80~90년대 그린 스레드의 기본이었지만, 멀티코어 시대 들어 1:1과 M:N에 자리를 내줬습니다. 이제 M:1은 사실상 "비동기 이벤트 루프" 형태로만 남아 있다고 봐도 됩니다.

---

# M:N 스레딩 모델이란 무엇이며, 어떤 런타임이 이를 사용하는가?

## 도입

1:1은 멀티코어를 잘 쓰지만 스레드 생성·전환이 무겁고, M:1은 가볍지만 멀티코어를 못 씁니다. 둘의 장점을 합치자는 시도가 M:N — 사용자 스레드 M개를 커널 스레드 N개에 동적 매핑. Go의 goroutine이 이 모델의 가장 성공적인 사례입니다.

---

## 본문

> M:N maps some M number of application threads onto some N number of kernel entities, or "virtual processors."

M:N은 M개의 애플리케이션 스레드를 N개의 커널 단위(또는 "가상 프로세서")에 매핑한다.

- **M number of application threads**: 사용자 코드가 만든 가벼운 실행 단위. 수천~수만 개도 가능.
- **N number of kernel entities**: 커널이 인식하는 스케줄 단위. 보통 코어 수에 가까운 작은 수.
- **virtual processors**: M:N에서 N개의 커널 스레드를 부르는 별칭. 사용자 스레드 입장에서는 마치 가상의 CPU처럼 보입니다.

> This is a compromise between kernel-level ("1:1") and user-level ("N:1") threading.

이는 커널 수준 1:1 스레딩과 사용자 수준 N:1 스레딩 사이의 절충안이다.

- **compromise**: 두 극단의 장점만 취하려는 절충. 1:1의 멀티코어 활용 + N:1의 가벼운 전환.

> In the M:N implementation, the threading library is responsible for scheduling user threads on the available schedulable entities;

M:N 구현에서, 스레딩 라이브러리는 사용 가능한 스케줄 단위 위에서 사용자 스레드를 스케줄링할 책임을 진다.

- **threading library**: 런타임 안의 스케줄러. Go의 런타임 스케줄러, Erlang VM 등이 해당.
- **scheduling user threads on the available schedulable entities**: M개 사용자 스레드를 N개 커널 스레드 위에 동적으로 분배. 어느 사용자 스레드를 어느 커널 스레드에 올릴지 런타임이 결정합니다.

> this makes context switching of threads very fast, as it avoids system calls.

이로 인해 스레드 컨텍스트 스위치가 매우 빠르다 — 시스템 콜을 피할 수 있기 때문이다.

- **avoids system calls**: 사용자 스레드 간 전환은 사용자 공간에서만 일어나니, 커널을 건드릴 필요가 없습니다. 시스템 콜은 사용자→커널 모드 전환 비용이 있는데, 이걸 안 내도 됩니다.
- **very fast**: 1:1 모델의 커널 컨텍스트 스위치가 마이크로초 단위라면, M:N의 사용자 스레드 전환은 나노초 단위까지 떨어질 수 있습니다.

> However, this increases complexity and the likelihood of priority inversion,

그러나 이는 복잡성과 우선순위 역전 발생 가능성을 증가시킨다.

- **complexity**: 런타임이 자체 스케줄러를 가져야 하니 구현이 어렵습니다. 락·블로킹 콜·I/O 모두 사용자 공간에서 인터셉트해야.
- **priority inversion**: 낮은 우선순위 스레드가 락을 쥔 채 선점당해, 높은 우선순위 스레드가 그 락을 기다리며 진행 못 하는 현상. 두 계층의 스케줄러가 따로 돌면 더 잘 발생.

> as well as suboptimal scheduling without extensive (and expensive) coordination between the userland scheduler and the kernel scheduler.

또한 사용자 공간 스케줄러와 커널 스케줄러 사이의 광범위한(그리고 비싼) 조율 없이는 차선의 스케줄링이 발생한다.

- **userland scheduler**: 런타임이 사용자 공간에서 굴리는 스케줄러. 사용자 스레드를 커널 스레드에 매핑.
- **kernel scheduler**: OS 커널의 스케줄러. 커널 스레드를 CPU 코어에 매핑.
- **without extensive coordination ... suboptimal**: 두 스케줄러가 서로 모르면, 예를 들어 런타임이 "사용자 스레드 A에 일을 줬어"라고 결정한 직후 커널이 그 사용자 스레드를 담은 커널 스레드를 다른 코어로 옮겨버려서 캐시가 다 무효화되는 식의 충돌이 일어납니다.

---

## 종합

세 모델의 비교를 다시:

| 모델 | 매핑 | 멀티코어 | 전환 속도 | 복잡도 | 대표 |
|---|---|---|---|---|---|
| 1:1 | 1:1 | O | 보통 | 낮음 | Linux pthread |
| M:1 | M:1 | X | 매우 빠름 | 낮음 | 초창기 그린 스레드 |
| M:N | M:N | O | 빠름 | 높음 | Go goroutine |

Go의 goroutine이 대표적인 M:N 사례:

- 수천~수만 개의 goroutine을 만들어도 스택이 작아 메모리 효율적(goroutine 1개 = 초기 2KB).
- Go 런타임이 GOMAXPROCS(보통 코어 수)만큼의 OS 스레드를 운영하며 goroutine을 동적으로 매핑.
- goroutine이 채널 read나 시스템 콜로 블로킹되면, 런타임이 다른 goroutine을 같은 OS 스레드에 올려 진행 — Official Answer가 말한 "calling thread만 블로킹되고 프로세스는 안 됨"이 실현되는 사례.

JS/Node.js와의 차이: Node.js는 M:N이 아닌 "단일 메인 스레드 + libuv 스레드 풀" 모델입니다. 사용자 코드(JS)는 메인 스레드 1개에서만 돌고, libuv는 내부 스레드 풀로 블로킹 작업만 처리. M:N처럼 "사용자 코드 단위가 N개 OS 스레드에 분산"되는 것과는 다릅니다.

이게 없으면 어떻게 되는가: M:N이 없다면 Go에서 1만 개 goroutine을 만드는 게 1만 개 OS 스레드를 만드는 것과 같아져 시스템이 무너집니다. M:N이 사용자 코드의 동시성 단위와 OS 스케줄링 단위를 분리해줘서, 가벼운 동시성과 진짜 병렬 실행을 동시에 얻는 것.

오개념 예방: "M:N이 무조건 좋은 모델"은 아닙니다. 복잡도와 priority inversion 리스크 때문에, 시스템 프로그래밍의 일반적인 선택은 여전히 1:1입니다. M:N이 빛나는 건 (a) 동시성 단위가 매우 많고(수만 단위), (b) 런타임이 자체 스케줄러를 잘 만들 수 있는 환경(Go, Erlang). 일반 애플리케이션에는 과한 도구.

AI Annotation 보충: Go 외에 Erlang VM도 M:N의 또 다른 대표. 다만 Erlang의 "process"는 데이터를 공유하지 않는 액터 모델이라 race condition 위험이 없어 priority inversion 같은 문제도 자연스럽게 회피합니다 — 모델 설계가 동시성 안전성을 끌어올리는 사례.

---

# 스레드가 공유 데이터에 동시 접근할 때 발생하는 race condition이란 무엇이며, 이를 방지하는 방법은?

## 도입

같은 메모리를 공유한다는 게 스레드의 핵심 특성인데, 여기서 가장 악명 높은 문제가 race condition입니다. `count++` 같이 한 줄짜리 코드도 CPU 입장에서는 여러 명령어로 쪼개지니, 두 스레드가 동시에 끼면 값이 꼬입니다. 멀티스레드 프로그래밍의 사실상 모든 동기화 도구가 이 문제 하나를 풀기 위해 존재합니다.

---

## 본문

> When shared between threads, however, even simple data structures become prone to race conditions if they require more than one CPU instruction to update:

스레드 간에 공유될 때는 그러나, 업데이트에 한 개 이상의 CPU 명령어가 필요한 경우 단순한 자료구조조차 race condition에 취약해진다.

- **even simple data structures**: 정수 카운터처럼 단순한 변수도 위험. 코드는 짧아도 CPU 명령어 단위로 쪼개지면 중간이 노출됨.
- **more than one CPU instruction**: `count++`는 (1) 메모리에서 읽기, (2) 1 더하기, (3) 메모리에 쓰기 — 최소 3개 명령어. 각각 사이가 끼어들 틈.
- **prone to race conditions**: race condition에 취약. 특정 명령어 사이에 다른 스레드가 끼어들면 결과가 달라짐.

> two threads may end up attempting to update the data structure at the same time and find it unexpectedly changing underfoot.

두 스레드가 같은 시점에 자료구조를 업데이트하려고 하다가, 발 밑에서 예기치 않게 변하는 것을 발견할 수 있다.

- **at the same time**: 멀티코어에서는 진짜 동시, 1코어에서는 시분할로 인터리브. 어느 쪽이든 두 스레드의 업데이트가 겹칩니다.
- **changing underfoot**: 발 밑에서 변한다 — 한 스레드가 "방금 0이었는데" 하고 1을 더하려는 순간, 다른 스레드가 이미 그 값을 1로 바꿔놓아 결과가 어긋나는 상황의 비유.

> Bugs caused by race conditions can be very difficult to reproduce and isolate.

race condition이 일으키는 버그는 재현하고 격리하기 매우 어렵다.

- **difficult to reproduce**: 스레드 인터리빙이 매번 달라서 같은 입력에도 결과가 다를 수 있음. 디버거 켜면 타이밍이 바뀌어 버그가 안 나기도 합니다(Heisenbug).
- **isolate**: 어느 두 스레드가 어느 시점에 충돌했는지 좁히기 어려움. 로그를 찍는 행위 자체가 타이밍을 바꾸니까.

> To prevent this, threading application programming interfaces (APIs) offer synchronization primitives such as mutexes to lock data structures against concurrent access.

이를 방지하기 위해, 스레딩 API는 mutex 같은 동기화 프리미티브를 제공해 자료구조를 동시 접근으로부터 락한다.

- **synchronization primitives**: 스레드 동기화의 기본 도구들. mutex, semaphore, condition variable 등.
- **mutexes**: Mutual Exclusion. "한 번에 한 스레드만"을 강제하는 락. 락을 잡은 스레드가 풀 때까지 다른 스레드는 대기.
- **lock data structures against concurrent access**: 자료구조 접근을 직렬화. 동시성을 막아 race를 원천 차단.

---

## 종합

`count++`의 race를 CPU 명령어 단위로 풀면:

```
스레드 A: load count → R1   (R1 = 0)
스레드 B: load count → R2   (R2 = 0)  ← A의 load와 B의 load 사이가 충돌 지점
스레드 A: R1 + 1 = 1
스레드 B: R2 + 1 = 1
스레드 A: store R1 → count  (count = 1)
스레드 B: store R2 → count  (count = 1)  ← 두 번 증가시켰는데 1이 됨
```

방지 방법을 정리:

| 방법 | 메커니즘 | 비용 |
|---|---|---|
| Mutex/Lock | 한 번에 한 스레드만 진입 | 컨텍스트 스위치, 데드락 위험 |
| Atomic 연산 | CPU 단일 명령으로 보장 | 빠르지만 단순 연산만 가능 |
| 메시지 패싱 | 공유 자체를 안 함 | 안전, 통신 비용 |
| Immutable 자료구조 | 변경 안 하니 race 없음 | 메모리·복사 비용 |

JS와의 관계:

- **순수 JS는 race condition이 없습니다** — 메인 스레드가 1개라 인터리빙이 일어날 틈이 없습니다. `count++`가 실행되는 동안 다른 코드가 끼어들지 못함.
- **Web Worker + SharedArrayBuffer** 사용 시에만 race가 가능. 이때 `Atomics.add()`, `Atomics.compareExchange()` 같은 원자 연산 API를 써야 합니다.
- **그래서 JS 개발자가 race condition을 자주 마주치지 않는 것**. 동기화의 "기본값"을 언어가 보장해준 셈.

오개념 예방: "JS는 비동기 코드를 쓰니 race condition이 있다"는 부정확. async/await의 인터리빙은 명시적 await 지점에서만 일어나고 메인 스레드는 여전히 1개라, 중간에 다른 코드가 변수 값을 바꿀 수 없습니다. 다만 두 비동기 함수가 같은 자원을 다른 순서로 변경하면 "논리적 race"는 가능합니다 (예: A가 fetch 결과를 쓰는데 B가 그 사이 같은 자원을 갱신). 이건 메모리 race가 아니라 흐름 race.

이게 없으면 어떻게 되는가 — 동기화 프리미티브가 없다면: 멀티스레드 프로그래밍은 사실상 불가능합니다. 모든 공유 자료구조 접근이 잠재적 버그가 되니, 실용적인 멀티스레드 코드는 성립할 수 없습니다. mutex가 OS·언어 차원에서 기본 제공되는 건 그래서.

AI Annotation 보충: Java의 `synchronized`, C의 `pthread_mutex_lock`, Rust의 `Mutex<T>` 모두 같은 mutex 추상화의 다른 옷. 언어가 다르더라도 OS 차원에서는 결국 같은 시스템 콜로 내려갑니다.

`count++`의 race를 시퀀스 다이어그램으로 (초기 count=0, 두 스레드가 각각 +1):

```
   시간   Thread A             공유 메모리       Thread B
    |
    v  load count  ──read──>  count: 0
       (R1 = 0)
                   ┌──read──   load count       (R2 = 0)
                   │           count: 0
       R1 + 1 = 1
                                                R2 + 1 = 1
       store R1   ──write──>   count: 1
                   ┌─write──    store R2        count: 1 (덮어쓰기)
                   │
                              최종 count: 1
                              (기대값: 2, 실제: 1)
```

핵심: A의 load와 store 사이에 B가 끼어들어 같은 0을 읽고 같은 1을 쓰는 바람에, 두 번 증가가 한 번 효과로 사라진다. 방지 = mutex로 load→store 구간을 한 스레드만 진입하게 락.

```
   [Mutex로 보호한 경우]

   Thread A: lock → load(0) → +1 → store(1) → unlock
                                                  |
                                                  v
   Thread B:                              lock → load(1) → +1 → store(2) → unlock

   최종 count: 2 (정상)
```

---

# 스레드 풀(thread pool)이란 무엇이며, 매번 새 스레드를 생성하는 것과 비교해 어떤 이점이 있는가?

## 도입

스레드는 프로세스보다 가볍다지만, "매 요청마다 새 스레드 생성"은 여전히 비쌉니다. 1만 개 요청에 1만 번 스레드를 만들고 부수는 것보다, 미리 N개를 만들어두고 돌려쓰는 게 합리적이죠. 이 패턴이 스레드 풀입니다. Node.js의 libuv, Java의 ExecutorService, .NET의 ThreadPool 모두 같은 발상.

---

## 본문

> A popular programming pattern involving threads is that of thread pools

스레드와 관련된 인기 있는 프로그래밍 패턴은 스레드 풀이다.

- **popular programming pattern**: 자주 쓰이는 설계 패턴. 라이브러리·런타임이 기본 제공.
- **thread pools**: 일정 개수의 스레드를 미리 만들어 풀(저장소)에 보관해두는 것.

> where a set number of threads are created at startup that then wait for a task to be assigned.

시작 시점에 정해진 수의 스레드가 만들어지고, 그 후 작업이 할당되기를 기다린다.

- **set number**: 미리 정한 N개. 보통 CPU 코어 수에 비례해 결정.
- **at startup**: 프로그램 시작 시점에 일괄 생성. 이후에는 추가 생성 안 함(또는 최소화).
- **wait for a task to be assigned**: 작업이 들어오기 전까지는 자고 있음. 대기 상태에서는 CPU를 거의 안 씁니다.

> When a new task arrives, it wakes up, completes the task and goes back to waiting.

새 작업이 도착하면, 깨어나서 작업을 완료하고 다시 대기 상태로 돌아간다.

- **wakes up**: OS가 대기 큐에서 풀 스레드를 깨워 작업을 줌. 컨텍스트 스위치 1회.
- **completes the task**: 작업 처리. 이 동안만 CPU를 적극 사용.
- **goes back to waiting**: 작업이 끝나면 다시 풀로 복귀. 스레드는 살아 있는 채로 다음 작업을 기다림.

> This avoids the relatively expensive thread creation and destruction functions for every task performed

이는 모든 작업마다 비교적 비싼 스레드 생성·파괴 함수를 호출하는 것을 피한다.

- **avoids ... thread creation and destruction**: 스레드 풀의 첫 번째 이점. N번 생성/파괴 → 1번 생성/N번 재사용.
- **for every task performed**: 매 작업마다 새 스레드를 만드는 식으로 짜면, 작업이 짧을수록 생성/파괴 오버헤드가 작업 자체보다 커지는 역전이 일어남.

> and takes thread management out of the application developer's hand and leaves it to a library or the operating system that is better suited to optimize thread management.

그리고 스레드 관리를 애플리케이션 개발자의 손에서 빼내 라이브러리나 OS에 맡기는데, 이는 스레드 관리를 더 잘 최적화하기에 적합하다.

- **takes thread management out of the application developer's hand**: 두 번째 이점. 개발자가 스레드 수·수명·재사용을 직접 관리할 필요 없음.
- **leaves it to a library or the operating system**: libuv, JVM 같은 잘 검증된 코드가 처리. 코어 수·시스템 부하에 따라 동적으로 풀 크기 조정 등 정교한 최적화가 가능.

---

## 종합

이점을 정리:

| 항목 | 매번 생성 | 스레드 풀 |
|---|---|---|
| 작업당 오버헤드 | 생성+파괴 비용 매번 | 거의 없음 |
| 메모리 사용 | 변동 큼 | 안정적 (N개 고정) |
| 동시 스레드 수 제한 | 없음 (메모리 폭발 위험) | 풀 크기로 제한됨 |
| 로직 단순도 | 사용자가 수명 관리 | 라이브러리에 위임 |

Node.js/libuv 사례:

- libuv는 기본적으로 4개 스레드의 풀을 가집니다 (`UV_THREADPOOL_SIZE`로 조정).
- 이 풀이 처리하는 것: `fs.readFile`, `crypto.pbkdf2`, DNS 조회 같은 블로킹 작업.
- 메인 스레드(이벤트 루프)는 작업을 풀에 넘기고 즉시 다른 콜백 처리. 풀의 스레드가 작업을 끝내면 결과를 이벤트 루프에 돌려보냄.
- 결과: JS는 싱글스레드처럼 보이지만, 내부적으로는 멀티스레드 풀이 받쳐주고 있음.

다른 언어 사례:

| 환경 | 스레드 풀 추상화 |
|---|---|
| Java | `ExecutorService`, `ForkJoinPool` |
| .NET | `ThreadPool`, `Task.Run` |
| Python | `concurrent.futures.ThreadPoolExecutor` |
| Node.js (libuv) | 내부 워커 풀 4개 (조정 가능) |

이게 없으면 어떻게 되는가: HTTP 서버가 요청마다 스레드를 새로 만든다고 합시다. 스레드 생성 비용을 1ms로 잡아도, 1초당 1만 요청이면 그 자체로 10초어치 CPU 시간을 생성에만 쏟아붓는 셈. 게다가 동시 1만 스레드면 스택 메모리만 수 GB. 풀 없이는 고동시성 서버가 성립 안 합니다.

오개념 예방: "스레드 풀 = 스레드를 무한히 만드는 것"은 정반대. 스레드 풀의 핵심 가치 중 하나가 **개수 제한**입니다. 무제한으로 스레드를 만들면 컨텍스트 스위치 비용이 폭발해 처리량이 오히려 떨어지는 thrashing이 발생. 풀 크기를 코어 수의 1~2배 정도로 잡아 적정 동시성을 유지하는 게 일반적인 튜닝.

AI Annotation 보충: `UV_THREADPOOL_SIZE`를 늘리면 fs.readFile 같은 작업이 더 많이 동시 처리되지만, 메인 이벤트 루프와 OS 스케줄러의 경쟁이 늘어 효과가 비선형. 무작정 키우는 것보다 워크로드를 측정해서 정하는 게 좋습니다.

스레드 풀 사이클 흐름:

```
   [시작 시] Thread Pool (size = N, 미리 생성)

      +-------+ +-------+ +-------+ +-------+
      | T1    | | T2    | | T3    | | T4    |    <- 모두 idle (대기)
      | idle  | | idle  | | idle  | | idle  |
      +-------+ +-------+ +-------+ +-------+


   [작업 도착]

   Task Queue: [Task1] [Task2] [Task3] ...
                  |
                  v
                 +-> 풀의 idle 스레드 1개 깨움 (T1)


   [실행 사이클] (한 스레드 관점)

         +----------------+
         |                v
   +----------+     +-----------+     +----------+
   |  idle    | --> | wake up   | --> | execute  |
   | (대기)   |     | (작업 받음) |     | (처리)   |
   +----------+     +-----------+     +----------+
         ^                                  |
         |                                  |
         |          +--------------+        |
         +--------- | back to idle | <------+
                    | (작업 완료)   |
                    +--------------+

   스레드는 살아있는 채로 다음 작업 대기
   → 매번 생성/파괴 비용 0
```

핵심: N개 스레드를 미리 만들어두고 작업마다 idle→실행→idle 사이클을 반복. 생성/파괴 비용이 작업 수와 무관하게 N번으로 고정되고, 동시 스레드 수가 풀 크기로 자연스럽게 제한된다.

---

# 싱글스레드 프로그램에서 오래 걸리는 작업이 UI를 멈추게 하는 문제를, 멀티스레딩 없이도 해결할 수 있는가?

## 도입

브라우저에서 큰 파일 처리하는 동안 클릭이 안 먹는 경험, 다들 한 번씩 해봤을 겁니다. 이게 "메인 스레드 블로킹" 현상. 이 문제의 정통 해법은 멀티스레딩(작업을 다른 스레드로 보내기)이지만, 사실 더 가벼운 해법도 있습니다 — 논블로킹 I/O. JS 개발자는 매일 두 번째 해법을 쓰고 있죠.

---

## 본문

> Responsiveness: multithreading can allow an application to remain responsive to input.

응답성: 멀티스레딩은 애플리케이션이 입력에 응답할 수 있게 해준다.

- **Responsiveness**: 사용자 입력에 즉각 반응하는 능력. UI 멈춤 방지의 핵심 지표.
- **remain responsive to input**: 작업이 진행 중이어도 클릭·키 입력 등에 계속 반응 가능한 상태 유지.

> In a one-thread program, if the main execution thread blocks on a long-running task, the entire application can appear to freeze.

싱글스레드 프로그램에서, 메인 실행 스레드가 오래 걸리는 작업에서 블로킹되면 애플리케이션 전체가 멈춘 것처럼 보일 수 있다.

- **one-thread program**: 사용자 코드를 실행하는 스레드가 1개인 프로그램. JS, Python(GIL), Ruby 등.
- **blocks on a long-running task**: 메인 스레드가 긴 작업(이미지 처리, 큰 데이터 계산)에 매여 있는 상태. 이 동안에는 다른 코드가 실행될 틈이 없음.
- **appear to freeze**: "멈춘 것처럼 보임"이 핵심. 실제로는 작업 중이지만 사용자는 클릭 무반응 = 멈춤으로 인식.

> By moving such long-running tasks to a worker thread that runs concurrently with the main execution thread,

이런 오래 걸리는 작업을 메인 실행 스레드와 동시에 실행되는 워커 스레드로 옮기면,

- **worker thread**: 백그라운드 작업 전담 스레드. 메인 UI 스레드와 별개로 굴러감.
- **runs concurrently**: 동시에 진행. 1코어라면 시분할로, 멀티코어라면 진짜 병렬로 실행.

> it is possible for the application to remain responsive to user input while executing tasks in the background.

백그라운드에서 작업을 실행하면서도 애플리케이션이 사용자 입력에 응답할 수 있게 된다.

- **executing tasks in the background**: 메인 스레드는 입력 처리에만 집중하고, 무거운 일은 워커가 다른 스레드에서 처리.

> On the other hand, in most cases multithreading is not the only way to keep a program responsive,

반면 대부분의 경우 멀티스레딩만이 프로그램을 응답성 있게 유지하는 유일한 방법은 아니다.

- **multithreading is not the only way**: 의외의 단서. 응답성 = 멀티스레드라는 단순 등식을 부정.

> with non-blocking I/O and/or Unix signals being available for obtaining similar results.

논블로킹 I/O나 Unix 시그널이 비슷한 결과를 얻기 위해 사용 가능하기 때문이다.

- **non-blocking I/O**: 블로킹되지 않는 I/O API. 호출 즉시 반환되고, 완료는 콜백/이벤트로 통지. JS의 `fetch`, Node.js의 `fs.promises.readFile` 같은 것.
- **Unix signals**: 비동기 알림 메커니즘. 외부 이벤트 발생 시 핸들러 함수를 즉시 실행하게 함.

---

## 종합

문제와 두 가지 해법:

| 해법 | 메커니즘 | 적합한 작업 |
|---|---|---|
| 멀티스레딩 | 작업을 다른 스레드로 분리 | CPU 집약 (이미지 처리, 큰 계산) |
| 논블로킹 I/O | 호출은 즉시 반환, 완료는 콜백 | I/O 집약 (네트워크, 디스크) |

JS/브라우저로 매핑:

- **CPU 집약 작업** → Web Worker. 큰 JSON 파싱, 이미지 처리, 암호 계산 같은 건 Worker로 보내야 메인 스레드가 안 막힙니다.
- **I/O 집약 작업** → `fetch`/`async-await`. 네트워크 응답 대기는 메인 스레드를 묶어두지 않아도 됨. JS 엔진이 콜백 큐로 처리.

```js
// 나쁨 — 메인 스레드 블로킹
const result = heavyMathSync(bigArray); // CPU 집약, 1초 동안 UI 멈춤

// 해법 1 — Web Worker로 분리
const worker = new Worker('heavy.js');
worker.postMessage(bigArray);
worker.onmessage = (e) => updateUI(e.data); // 메인 스레드는 계속 응답

// 해법 2 — I/O는 비동기로
const data = await fetch('/api/data'); // 메인 스레드 안 막음
```

Node.js의 응답성 비밀: Node.js는 사용자 코드 입장에서 싱글스레드인데도 동시에 수만 요청을 처리합니다. 이유는 사용자 작업 대부분이 I/O이기 때문 — 모든 I/O를 논블로킹으로 처리하니, 한 요청이 DB 응답을 기다리는 동안 메인 스레드는 다른 요청을 처리. 만약 Node.js가 동기 I/O를 강제했다면 멀티스레드 모델 없이는 살아남지 못했을 거예요.

이게 없으면 어떻게 되는가 — 두 해법 모두 없다면: 모든 응답성을 위해 항상 새 OS 스레드가 필요. 그런데 OS 스레드는 메모리·전환 비용이 있으니, 동시 1만 작업 = 1만 스레드 = 시스템 한계. 논블로킹 I/O 덕분에 "단일 스레드가 1만 작업을 처리"하는 모델이 가능해진 것.

오개념 예방: "JS는 싱글스레드라 응답성이 떨어진다"는 부정확. JS의 응답성은 논블로킹 I/O + 이벤트 루프 모델로 잘 작동합니다. 다만 CPU 집약 작업은 약점이 맞아서, 그때만 Worker가 필요. **약점은 CPU 집약 작업이지 I/O 집약 작업이 아닙니다.**

AI Annotation 보충: 두 해법은 적용 영역이 다르고 자주 함께 씁니다. 예를 들어 이미지 업로드 사이트에서: 업로드 자체는 논블로킹 I/O (fetch), 업로드된 이미지의 썸네일 생성은 Web Worker. 어느 한쪽으로 다 풀려는 게 아니라, 작업 종류에 따라 도구를 고르는 것.

---

# 멀티스레드 프로그램이 본질적으로 테스트하기 어려운 이유와, 이를 완화하는 설계 패턴은?

## 도입

소프트웨어 테스트는 보통 "같은 입력 → 같은 결과"를 가정합니다. 그런데 멀티스레드 프로그램은 같은 입력에도 다른 결과가 나올 수 있어요. 스레드 인터리빙이 매번 달라지니까요. 이게 멀티스레드가 어렵다고 평가받는 진짜 이유 중 하나입니다.

---

## 본문

> Being untestable: In general, multithreaded programs are non-deterministic, and as a result, are untestable.

테스트 불가능성: 일반적으로 멀티스레드 프로그램은 비결정적이며, 그 결과 테스트하기 어렵다.

- **untestable**: 단정적인 표현. 완전히 못 한다기보다 전통적 의미의 "재현 가능한 테스트"가 성립하지 않는다는 뜻.
- **non-deterministic**: 비결정적. 같은 입력에도 매 실행마다 결과가 달라질 수 있음. 결정적(deterministic) 시스템의 반대.
- **as a result, are untestable**: 비결정적이면 테스트가 안 통하는 이유 — "이 입력에서 이 결과가 나와야 함"이라는 단언이 불가능. 결과가 매번 다르니까.

> In other words, a multithreaded program can easily have bugs which never manifest on a test system, manifesting only in production.

다시 말해, 멀티스레드 프로그램은 테스트 시스템에서는 한 번도 나타나지 않다가 운영 환경에서만 드러나는 버그를 쉽게 가질 수 있다.

- **never manifest on a test system**: 개발 환경에서는 부하가 낮고 타이밍이 좁아 race가 안 일어남. CI에서 1만 번 돌려도 통과.
- **manifesting only in production**: 운영에서는 부하·동시성·스케줄링이 달라 race가 노출됨. 새벽 3시에 한 번 발생하는 끔찍한 버그.

> This can be alleviated by restricting inter-thread communications to certain well-defined patterns (such as message-passing).

이는 스레드 간 통신을 명확히 정의된 패턴(예: 메시지 패싱)으로 제한함으로써 완화될 수 있다.

- **alleviated**: 해결이 아니라 완화. 멀티스레드의 비결정성을 완전히 제거할 수는 없지만 줄일 수는 있음.
- **inter-thread communications**: 스레드 간 통신. 공유 메모리 직접 접근, 락, 채널 등.
- **well-defined patterns**: 잘 정의된 패턴. 임의의 메모리 공유가 아니라 정해진 규칙으로만 통신.
- **message-passing**: 메시지 패싱. 데이터를 공유하지 않고, 메시지를 주고받음으로써 통신. 한 스레드가 다른 스레드의 메모리를 직접 건드리지 않음.

---

## 종합

비결정성의 정체:

```
스레드 A: x = 1; y = 2;
스레드 B: print(x + y);
```

`x + y`는 1, 2, 3 중 어느 값도 될 수 있습니다. B의 출력이 (a) A의 두 할당 전에, (b) 둘 사이에, (c) 둘 다 끝난 후에 일어나는지에 따라. 같은 코드 같은 입력인데 결과가 3가지.

완화 패턴 비교:

| 패턴 | 특징 | 비결정성 줄이는 방식 |
|---|---|---|
| 공유 메모리 + 락 | 자유롭지만 위험 | 락으로 일부 직렬화 (실수 시 race) |
| 메시지 패싱 | 메모리 공유 없음 | 통신 지점만 명시적 — race 원천 차단 |
| Immutable + 함수형 | 변경 불가 | 변경이 없으니 race 없음 |

JS/Node.js 사례:

- **Web Worker의 `postMessage`**: 메시지 패싱의 대표. 메인 스레드와 워커가 메모리를 직접 공유하지 않고, postMessage로 데이터를 보내면 구조적 복제(structured clone)로 복사. 양쪽이 서로의 메모리를 못 보니 race condition 자체가 불가능.
- **SharedArrayBuffer 미사용 시 워커 간 race가 없음**: JS의 기본 동시성 모델은 메시지 패싱 기반이라 안전성에 유리.

다른 사례 — Erlang/Actor 모델: 모든 actor는 자기만의 메일박스를 가지고, 메시지로만 통신. 메모리 공유 일체 없음. WhatsApp이 Erlang으로 짜인 이유 — 수십만 동시 연결을 안전하게 처리하기 위해.

이게 없으면 어떻게 되는가 — 메시지 패싱 같은 패턴이 없다면: 모든 멀티스레드 코드가 공유 메모리 + 락 의존. 락 누락 한 번이 production에서만 터지는 버그가 되니, 대규모 시스템 신뢰성이 무너집니다. 메시지 패싱이 등장한 이유는 "락은 인간이 실수 없이 못 다룬다"는 경험적 결론.

오개념 예방: "테스트를 1만 번 돌리면 race를 잡을 수 있을 것"은 부분적으로만 맞습니다. 실제로는 테스트 환경의 타이밍이 운영과 달라서, 운영에서만 나타나는 race를 테스트로 잡기 어렵습니다. 도구(ThreadSanitizer, race detector)나 모델(메시지 패싱) 차원의 접근이 필요한 이유.

AI Annotation 보충: JS의 단일 스레드 모델 + 메시지 패싱(Web Worker) 조합이 race condition을 거의 무시하고 코드를 짤 수 있게 해주는 큰 이유. "JS가 안전하다"기보다 "JS의 동시성 모델이 안전한 패턴을 강제한다"가 정확.

---

# GIL(Global Interpreter Lock)이란 무엇이며, 멀티코어 환경에서 어떤 한계를 만드는가?

## 도입

Python에서 멀티스레딩으로 4코어를 쓰려고 했더니 1코어 성능밖에 안 나오는 경험, Python 개발자라면 한 번씩 들어봤을 겁니다. 범인은 GIL — 인터프리터가 자체적으로 가진 큰 락 하나가 멀티스레드 병렬 실행을 막습니다. JS는 처음부터 단일 스레드 설계라 이 함정에 안 빠지는데, 그 차이를 짚어봅니다.

---

## 본문

> A few interpreted programming languages have implementations (e.g., Ruby MRI for Ruby, CPython for Python) which support threading and concurrency but not parallel execution of threads, due to a global interpreter lock (GIL).

몇몇 인터프리터형 프로그래밍 언어는 스레딩과 동시성은 지원하지만 스레드의 병렬 실행은 지원하지 않는 구현(예: Ruby의 Ruby MRI, Python의 CPython)을 가지고 있는데, 이는 글로벌 인터프리터 락(GIL) 때문이다.

- **interpreted programming languages**: 컴파일러가 아닌 인터프리터로 실행되는 언어. Python, Ruby 등.
- **support threading and concurrency**: 스레드 객체를 만들 수 있고, 동시성(번갈아 실행)은 가능. 즉 API는 멀쩡합니다.
- **but not parallel execution of threads**: 그러나 진짜 병렬 실행(다른 코어에서 동시 실행)은 안 됨. concurrency O, parallelism X.
- **CPython**: Python의 표준 구현. 우리가 일반적으로 쓰는 그 Python.
- **Ruby MRI**: Matz's Ruby Interpreter. Ruby의 표준 구현.

> The GIL is a mutual exclusion lock held by the interpreter that can prevent the interpreter from simultaneously interpreting the application's code on two or more threads at once.

GIL은 인터프리터가 보유하는 mutual exclusion lock으로, 인터프리터가 두 개 이상의 스레드에서 동시에 애플리케이션 코드를 해석하는 것을 막을 수 있다.

- **mutual exclusion lock**: mutex. 한 번에 한 스레드만 진입 가능한 락.
- **held by the interpreter**: 사용자 코드가 잡는 락이 아니라 인터프리터 자체가 잡고 있는 글로벌 락.
- **prevent ... simultaneously interpreting**: 동시에 인터프리트하는 것을 막음. CPython은 한 번에 한 스레드만 바이트코드를 실행할 수 있게 강제.

> This effectively limits the parallelism on multiple core systems.

이는 멀티코어 시스템에서 병렬성을 사실상 제한한다.

- **effectively limits the parallelism**: 결과적으로 코어가 많아도 한 번에 1코어만 활용. 8코어 머신에서 Python 스레드 8개를 띄워도 1/8의 효과.

> It also limits performance for processor-bound threads (which require the processor),

또한 프로세서 바운드 스레드(프로세서를 필요로 하는)의 성능도 제한한다.

- **processor-bound**: CPU 집약 작업. 행렬 곱, 이미지 처리, 암호 계산처럼 CPU 시간이 병목인 작업.
- **limits performance**: GIL이 있으니 코어를 1개만 쓰는 셈이라, CPU 작업 가속이 안 됩니다.

> but doesn't effect I/O-bound or network-bound ones as much.

그러나 I/O 바운드 또는 네트워크 바운드 작업에는 그만큼 영향을 주지 않는다.

- **I/O-bound or network-bound**: I/O 또는 네트워크가 병목인 작업. 디스크/네트워크 응답을 기다리는 시간이 대부분.
- **doesn't effect ... as much**: I/O 작업 동안 CPython은 GIL을 풀어줍니다. 그래서 한 스레드가 네트워크를 기다리는 동안 다른 스레드가 GIL을 잡고 코드를 실행 가능. I/O 집약 작업에는 멀티스레드가 여전히 유효.

---

## 종합

GIL의 영향을 작업 종류별로:

| 작업 종류 | GIL 영향 | 멀티스레드 효과 |
|---|---|---|
| CPU 집약 (행렬 곱, 압축) | 큼 | 거의 없음 (1코어만 사용) |
| I/O 집약 (HTTP, 파일) | 작음 | 있음 (대기 중 GIL 해제) |
| 네트워크 집약 (소켓 통신) | 작음 | 있음 |

해결책:

- **multiprocessing**: Python 표준 라이브러리. 스레드 대신 별도 프로세스를 띄워 GIL을 우회. 각 프로세스가 자기 GIL을 가지니 진짜 병렬 가능. 단, 메모리·IPC 비용이 큼.
- **C 확장 모듈**: NumPy, Pandas는 내부적으로 C 코드에서 GIL을 풀고 작업해 멀티코어 활용 가능.
- **PyPy, Jython**: GIL 없는 Python 구현(부분적). 호환성 한계.
- **No-GIL Python (PEP 703)**: 최근 진행 중인 GIL 제거 작업. 아직 표준은 아님.

JS와의 비교:

| 환경 | 동시성 모델 | 멀티코어 활용 |
|---|---|---|
| Python (CPython) | 멀티스레드 가능, GIL이 막음 | 어려움 (multiprocessing 필요) |
| Node.js | 명시적 단일 스레드 | 어려움 (cluster/Worker Thread 필요) |
| Go | M:N goroutine | 자연스러움 |
| Rust/C++ | 1:1 OS 스레드 | 자연스러움 |

오개념 예방: "Node.js도 단일 스레드니 GIL과 같은 문제가 있다"는 부분적으로 비슷하지만 본질이 다릅니다. Python은 "멀티스레드 API를 제공하지만 GIL로 사실상 단일 스레드"인 반면, Node.js는 "처음부터 단일 스레드 설계, 멀티스레드는 Worker Thread로 명시적 별도 도구". 전자는 함정(스레드를 만들면 빨라질 줄 알지만 안 빨라짐), 후자는 명확성(병렬은 명시적으로).

이게 없으면 어떻게 되는가 — GIL이 없다면: CPython의 메모리 관리(특히 참조 카운팅)에 동기화가 필요해집니다. 모든 객체 접근에 락 비용이 추가되니, 단일 스레드 성능이 오히려 떨어질 수 있습니다. GIL은 "단일 스레드 단순함"을 위해 멀티 스레드 병렬을 희생한 트레이드오프.

AI Annotation 보충: JS는 처음부터 단일 스레드 설계라 GIL 같은 게 없습니다. 멀티스레드를 쓰려면 Web Worker나 Worker Thread를 써야 하고, 이때는 메모리 격리가 기본이라 GIL 같은 락도 필요 없음. 언어 설계 차원에서 다른 길을 간 셈.
