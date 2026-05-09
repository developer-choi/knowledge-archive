# OS가 프로세스들을 서로 격리하는 이유와 격리 실패 시 문제, 그리고 격리된 프로세스 간 통신 방법은?

## 도입

`node app.js`를 두 번 실행하면 두 Node 프로세스가 만들어지는데, 한 쪽이 다른 쪽의 메모리를 들여다볼 수 없습니다. 왜 OS가 일부러 이렇게 칸을 막아둘까요? 한 쪽이 망가져도 다른 쪽은 무사하기 위해서입니다. 그리고 그렇게 막아두면서도 필요할 땐 통신할 수 있도록 OS가 별도의 통로(IPC)를 열어둡니다. 이 문항은 격리하는 이유와 그 효과, 그리고 격리된 프로세스가 어떻게 안전하게 통신하는지를 한 묶음으로 다룹니다.

---

## 본문

> The operating system keeps its processes separate and allocates the resources they need,

OS는 프로세스들을 서로 분리해 두고, 각 프로세스에 필요한 자원을 할당한다.

- **keeps its processes separate**: 각 프로세스에 별도의 가상 메모리 공간을 부여. A 프로세스의 변수와 B 프로세스의 변수는 같은 이름이라도 물리적으로 다른 RAM 영역에 저장됩니다.
- **allocates the resources they need**: OS가 자원의 분배자 역할. 메모리, 파일 핸들, 소켓 등 각 프로세스가 필요로 하는 만큼만 떼어줍니다. 분배자가 없으면 프로세스끼리 자원 쟁탈전이 벌어집니다.

> so that they are less likely to interfere with each other and cause system failures (e.g., deadlock or thrashing).

그래서 서로 간섭하거나 시스템 장애(예: 데드락, 스래싱)를 일으킬 가능성이 낮아진다.

- **interfere**: A 프로세스가 B의 메모리를 직접 망가뜨리거나, B가 쓰던 파일을 막 닫아버리는 상황. 격리되어 있지 않으면 한 프로세스의 버그가 다른 프로세스를 즉사시킵니다.
- **deadlock**: A가 B의 자원을 기다리고, B가 A의 자원을 기다려 둘 다 영원히 멈추는 상태. 식당에서 두 손님이 서로의 포크를 잡고 "먼저 놓아야지" 하며 영원히 안 먹는 그림.
- **thrashing**: 메모리가 부족해서 OS가 디스크와 RAM 사이에 페이지를 미친 듯이 옮기는 상태. 실제 작업보다 페이지 교체에 시간을 더 써서 시스템 전체가 거의 멈춥니다.

> For security and reliability, most modern operating systems prevent direct communication between independent processes, providing strictly mediated and controlled inter-process communication.

보안과 안정성을 위해, 대부분의 현대 OS는 독립된 프로세스 간의 직접 통신을 막고, 엄격하게 중재되고 통제된 프로세스 간 통신(IPC)을 제공한다.

- **for security and reliability**: 두 가지 목적. 보안 = A가 B의 비밀번호를 훔칠 수 없게. 안정성 = A의 버그가 B를 망가뜨릴 수 없게.
- **strictly mediated and controlled**: OS가 중간에서 모든 통신을 검사·중재. "이건 허락된 통신이니 통과", "저건 금지된 영역이니 차단".
- **inter-process communication (IPC)**: 파이프, 소켓, 공유 메모리, 메시지 큐 등의 형태. 모두 OS가 제공하는 시스템 콜을 거칩니다.

---

## 종합

격리가 없으면 어떻게 되는지 상상해보면 명확합니다. Chrome 탭 50개가 같은 메모리를 공유한다면, 1개 탭의 메모리 누수가 전체 브라우저를 죽일 수 있습니다. 실제로 Chrome은 이 문제를 해결하려고 탭마다 별도 프로세스를 띄웁니다 — 한 탭이 크래시해도 다른 탭은 살아있죠.

격리의 두 가지 효과:

- **보안**: A 프로세스가 B의 비밀번호를 메모리에서 훔쳐볼 수 없습니다.
- **안정성**: A가 죽어도 B는 무사. 한 프로세스의 SEGFAULT가 OS 전체를 다운시키지 않습니다.

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

격리 + IPC 구조를 다이어그램으로:

```
   사용자 공간 (User Space)

   +------------------+              +------------------+
   |   Process A      |              |   Process B      |
   |                  |              |                  |
   |  Memory:         |              |  Memory:         |
   |   - heap         |              |   - heap         |
   |   - stack        |              |   - stack        |
   |   - globals      |              |   - globals      |
   |                  |              |                  |
   |   X 직접 통신    |              |   X 직접 통신    |
   |   금지           |              |   금지           |
   +--------+---------+              +---------+--------+
            |                                  |
            | system call                      | system call
            v                                  v
   ===========================================================
                       Kernel Space (보호)
            +----------------------------------+
            |   IPC 메커니즘 (중재자)           |
            |   - Pipe       (ls | grep)       |
            |   - Socket     (TCP/UDP)         |
            |   - Shared mem (mmap)            |
            |   - Message Q  (mq_send)         |
            |   - Signal     (kill -9)         |
            +----------------+-----------------+
   ===========================================================
            ^                                  ^
            | 검증된 통신만 통과                 |
            +----------------------------------+
```

핵심: A와 B는 직접 메모리에 손대지 못하고, 모든 통신은 커널의 IPC 메커니즘을 경유한다. "격리 (직접 침입 차단) + IPC (합법 통로)"의 조합이 보안과 안정성을 동시에 달성.

오개념 예방:

- 격리는 "절대 통신 불가"가 아니라 "통제된 통신만 허용"입니다. IPC 자체가 OS가 격리 규칙 안에서 합법적으로 열어둔 창구라서, 격리와 IPC는 반대 개념이 아니라 한 묶음으로 봐야 합니다.
- IPC와 스레드 통신은 다릅니다. 스레드는 같은 프로세스 안에 있으니 메모리를 그냥 공유합니다 (락이나 atomic 같은 동기화는 필요해도 OS 중재는 불필요). IPC는 별개 프로세스 간이라 OS를 반드시 거쳐야 합니다 — 그래서 일반적으로 스레드 간 통신보다 비용이 높습니다. "IPC가 항상 빠르겠지"가 아니라 "IPC는 안전하지만 약간의 오버헤드가 있다"가 정확한 이해입니다.

---

# 부모 프로세스와 자식 프로세스의 관계는 어떻게 형성되는가?

## 도입

모든 프로세스는 어딘가에서 만들어집니다. `node app.js`를 입력하면 셸 프로세스가 Node 프로세스를 만들고, Node 프로세스가 다시 워커 프로세스를 만들 수도 있죠. 이렇게 만든 쪽이 부모, 만들어진 쪽이 자식입니다. 가족 관계처럼 트리 구조를 이룹니다.

- **셸(shell)**: 터미널 창에서 명령어를 받아 실행해주는 프로그램. `bash`, `zsh` 등이 대표적인 셸 종류. 터미널을 열면 그 안에서 셸 프로세스가 실행 중입니다. `node app.js`를 입력하면 셸 프로세스가 OS에 "새 프로세스 만들어서 Node.js 실행해"라고 요청합니다 — 그래서 셸이 부모, Node가 자식이 됩니다.

---

## 본문

> It is usual to associate a single process with a main program, and child processes with any spin-off, parallel processes.

보통 하나의 프로세스를 메인 프로그램과 연결하고, 여기서 파생된 병렬 프로세스를 자식 프로세스와 연결한다.

- **single process with a main program**: 한 프로그램의 시작점은 보통 단일 프로세스. `node app.js`를 실행하면 처음에는 Node 프로세스 1개로 시작.
- **spin-off, parallel processes**: 메인에서 떨어져 나간 병렬 프로세스. 메인이 동영상 인코딩 같은 무거운 일을 직접 하는 대신, 자식 프로세스에 위임해 동시에 처리.

---

## 종합

JS에서 가장 익숙한 부모-자식 프로세스 패턴:

```js
const { fork } = require('child_process');
const child = fork('worker.js'); // 자식 프로세스 생성
child.on('message', (result) => { /* 결과 처리 */ }); // 자식이 끝내면 메시지로 옴
```

- **`const { fork } = require('child_process')`**: Node.js 내장 모듈에서 `fork` 함수를 꺼내옵니다. `child_process`는 새로운 OS 프로세스를 만드는 API 모음, `fork`는 그 중 "Node.js 스크립트를 자식 프로세스로 실행"하는 함수입니다. `fork('worker.js')` 호출 시 완전히 독립된 프로세스(별도 메모리 공간, 별도 V8 인스턴스, 별도 이벤트 루프)가 생성됩니다. Unix `fork()` 시스템 콜을 Node.js에서 추상화한 것.

부모(`app.js`)가 자식(`worker.js`)을 만들고, 자식은 별도 프로세스에서 자기 일을 합니다. 부모는 자식이 돌아가는 동안 기다리지 않고 다른 작업을 할 수 있죠. 결과는 메시지(IPC)로 받습니다.

User Annotation 보충: 자식은 부모의 자원 권한과 스케줄링 속성을 상속받지만, 부모가 가진 자원의 부분집합만 쓸 수 있습니다. 부모가 100MB 메모리 권한이면 자식은 그 안에서만 사용 가능 — 자식이 부모보다 더 많은 권한을 갖게 되는 일은 없습니다(권한 상승은 보안 사고).

오개념 예방:

- 자식 프로세스는 부모의 메모리를 공유하는 게 아닙니다. fork 시점의 메모리 상태를 복사해 자기 공간을 받습니다. 그래서 자식이 변수를 바꿔도 부모 변수는 안 바뀝니다 — 두 프로세스는 완전히 격리됩니다. 데이터 교환이 필요하면 IPC를 써야 합니다.
- 자식과 스레드는 다릅니다. 자식 프로세스는 별도 메모리 공간을 받는 진짜 별개 프로세스. 스레드는 같은 프로세스 안에서 메모리를 공유하는 실행 흐름. 격리 강도와 비용이 다릅니다.

**JS는 싱글 스레드인데 어떻게 `fork`로 병렬 실행이 가능한가?**

싱글 스레드 ≠ 싱글 프로세스. JS 엔진(V8)은 하나의 프로세스 안에서 싱글 스레드로 동작하지만, `child_process.fork()`는 새로운 OS 프로세스를 만드는 것이라 각 프로세스가 각자 싱글 스레드 V8을 돌립니다. 이건 멀티 스레드가 아니라 **멀티 프로세스**입니다.

| 모델 | 메모리 | 동시성 단위 | JS API |
|---|---|---|---|
| 싱글 스레드 (기본) | 한 프로세스 안에서 단일 스레드 | 이벤트 루프 | (기본 동작) |
| 멀티 프로세스 | 프로세스마다 별도 메모리 | OS 프로세스 N개 | `child_process.fork()` |
| 멀티 스레드 | 한 프로세스 안에서 메모리 공유 | 스레드 N개 | `worker_threads` (10.5+) |

- 멀티 프로세스: 프로세스 간 메모리는 공유되지 않고, 데이터 교환은 IPC(`process.send()`)로만 가능. 격리가 강해 한쪽이 죽어도 다른 쪽은 무사하지만, 데이터 직렬화 비용이 듭니다.
- 멀티 스레드(`worker_threads`): 같은 프로세스 안에서 스레드 여러 개. 메모리 공유가 쉬운 대신 동기화 문제(레이스 컨디션 등)가 생깁니다.

브라우저 사례: Chrome의 메인 프로세스가 부모, 각 탭 프로세스가 자식. 한 탭(자식)이 죽어도 메인(부모)이 살아있어서 다른 탭은 무사합니다. 이게 부모-자식 격리의 실용적 가치 — 자식의 추락이 부모를 끌어내리지 않습니다.

부모-자식 프로세스 트리:

```
   init / systemd (PID 1)
        |
        +-- shell (bash, zsh)         PID 2451
        |       |
        |       +-- node app.js       PID 3120  <- 부모 (Node.js)
        |       |       |
        |       |       +-- worker-1.js   PID 3121  <- 자식 (fork)
        |       |       +-- worker-2.js   PID 3122  <- 자식 (fork)
        |       |       +-- ffmpeg        PID 3123  <- 자식 (spawn 외부 프로세스)
        |       |
        |       +-- vim                PID 2890
        |
        +-- chrome (메인)              PID 4001  <- 부모
                |
                +-- chrome (탭 1)      PID 4002  <- 자식
                +-- chrome (탭 2)      PID 4003  <- 자식
                +-- chrome (GPU)       PID 4004  <- 자식
                +-- chrome (Renderer)  PID 4005  <- 자식

   - 자식은 fork 시점의 부모 메모리를 복사
   - 자식은 부모 권한의 부분집합만 가능
   - 자식 종료 통신은 IPC (메시지/시그널)로
```

핵심: 모든 프로세스는 다른 프로세스(부모)에서 만들어지며, 종료 시까지 부모-자식 관계가 PCB에 기록된다. Chrome의 탭 격리, Node.js의 워커 분리 모두 이 모델 위에서 동작.

**그럼 스레드 vs 자식 프로세스, 언제 뭘 쓰나?**

항상 트레이드오프입니다. "격리가 필요 없을 때 스레드" 같은 단순한 기준은 없습니다 — 격리는 항상 필요하니까요. 진짜 질문은:

> **"격리를 포기할 만큼 공유 메모리/낮은 비용이 가치 있는가?"**

| | 스레드 | 자식 프로세스 |
|---|---|---|
| 데이터 공유 | 공유 메모리 — 직렬화 없음 | IPC 필수 — 직렬화 비용 |
| 크래시 전파 | 프로세스 전체 위험 | 자식만 죽고 나머지 무사 |
| 생성·전환 비용 | 가벼움 | 무거움 |
| 외부 프로그램 실행 | 불가 | 가능 (`exec` 계열) |

- 데이터를 자주 주고받고 비용이 부담된다 → 크래시 전파 위험을 감수하고 **스레드**
- 독립성·안정성이 더 중요하다, 또는 외부 프로그램을 실행해야 한다 → IPC 비용을 감수하고 **프로세스**

---

# 프로세스의 상태 전이(lifecycle) 전체 흐름과 각 상태의 의미는?

## 도입

프로세스는 태어나서 죽기까지 여러 상태를 거칩니다. CPU를 갖고 실행 중일 수도 있고, CPU를 기다리는 줄에 서 있을 수도 있고, 파일이 읽힐 때까지 멈춰 있을 수도 있죠. 이 상태들을 어떻게 옮겨다니는지가 lifecycle입니다. 핵심은 waiting(CPU 대기)과 blocked(자원 대기)의 차이입니다.

---

## 본문

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

## 종합

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

