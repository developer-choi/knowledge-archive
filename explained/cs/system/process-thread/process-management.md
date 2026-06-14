# OS가 프로세스들을 서로 격리하는 방법과 이유, 격리 실패 시 문제, 그리고 격리된 프로세스 간 통신 방법은?

## 도입

Chrome 탭 하나가 죽어도 다른 탭은 멀쩡하다. Node.js 서버가 크래시해도 같은 컴퓨터의 VS Code는 계속 돌아간다. 이것이 OS 프로세스 격리의 효과다. OS는 왜 프로세스를 격리하고, 어떻게 격리하며, 격리된 프로세스들이 어떻게 서로 소통하는지를 이 질문이 다룬다.

---

## 본문

> The operating system keeps its processes separate and allocates the resources they need, so that they are less likely to interfere with each other and cause system failures (e.g., deadlock or thrashing).

"OS는 프로세스들을 서로 격리하고 필요한 자원을 할당하여, 서로 간섭하거나 시스템 장애(예: 데드락, 스래싱)를 유발할 가능성을 줄인다."

- **keeps its processes separate**: OS가 각 프로세스에 독립적인 가상 주소 공간을 부여해 직접 메모리를 들여다보거나 쓸 수 없게 막는 것.
- **deadlock**: A 프로세스가 B의 자원을 기다리고, B가 A의 자원을 기다려서 둘 다 영원히 멈추는 상태. 격리가 없으면 A가 B의 자원을 강제로 가져가다가 이런 교착 상태가 쉽게 발생한다.
- **thrashing**: 메모리 부족으로 페이지 교체가 과도하게 발생하여, 실제 작업보다 교체에 시간을 더 쓰는 상태. 하나의 프로세스가 메모리를 독점하면 다른 프로세스들이 계속 페이지 폴트를 일으켜 스래싱이 생긴다.

> For security and reliability, most modern operating systems prevent direct communication between independent processes, providing strictly mediated and controlled inter-process communication.

"보안과 신뢰성을 위해 대부분의 현대 OS는 독립 프로세스 간 직접 통신을 막고, 엄격히 중재·통제된 프로세스 간 통신(IPC)을 제공한다."

- **strictly mediated**: OS가 중간에서 검열하고 통제한다는 의미. 프로세스 A가 프로세스 B에게 메시지를 보낼 때 OS 커널을 반드시 거쳐야 한다.
- **inter-process communication (IPC)**: 격리된 프로세스들이 안전하게 소통하기 위한 OS 제공 메커니즘.

> The operating system may also provide mechanisms for inter-process communication to enable processes to interact in safe and predictable ways.

"OS는 프로세스들이 안전하고 예측 가능한 방식으로 상호작용할 수 있도록 IPC 메커니즘도 제공할 수 있다."

> When processes need to communicate with each other they must share parts of their address spaces or use other forms of inter-process communication (IPC).
> For instance in a shell pipeline, the output of the first process needs to pass to the second one, and so on.

"프로세스들이 서로 통신해야 할 때는 주소 공간의 일부를 공유하거나 다른 형태의 IPC를 사용해야 한다. 예를 들어 셸 파이프라인에서는 첫 번째 프로세스의 출력이 두 번째 프로세스로 전달되어야 한다."

- **shell pipeline**: `ls | grep .md`를 실행하면 `ls`의 stdout이 파이프를 통해 `grep`의 stdin으로 전달된다. 두 프로세스는 격리되어 있지만 파이프라는 IPC 메커니즘으로 소통한다.
- **share parts of their address spaces**: 공유 메모리(shared memory) IPC. 특정 메모리 영역을 두 프로세스가 함께 읽고 쓰도록 OS가 허용하는 방식. 빠르지만 동기화 문제가 생길 수 있다.

---

## 종합

OS가 프로세스를 격리하는 이유는 두 가지다: **보안**(다른 프로세스의 메모리나 자원에 무단 접근 방지)과 **안정성**(하나가 죽어도 다른 것들은 살아남음). Chrome이 탭마다 별도 프로세스를 쓰는 이유가 바로 이것이다.

격리의 부작용은 소통이 어려워진다는 것. 이를 해결하기 위해 OS는 IPC 메커니즘을 제공한다:

```
IPC 메커니즘 종류
├── 파이프 (pipe)        ls | grep .md — stdout → stdin 연결
├── 소켓 (socket)        네트워크 또는 로컬 소켓으로 메시지 교환
├── 공유 메모리          OS가 허가한 특정 주소 영역을 두 프로세스가 함께 사용
├── 메시지 큐            메시지를 버퍼에 넣고 순서대로 소비
└── 시그널 (signal)      kill -9 PID처럼 OS가 프로세스에 이벤트를 보내는 것
```

Node.js에서 `child_process.fork()`로 자식 프로세스를 만들면 `process.send()`와 `process.on('message')`로 IPC 채널이 자동으로 열린다 — 내부적으로 파이프 기반이다.

---

# 부모 프로세스와 자식 프로세스의 관계는 어떻게 형성되는가?

## 도입

OS에서 프로세스는 홀로 태어나지 않는다. 항상 다른 프로세스가 "낳아준다". 터미널에서 `node app.js`를 실행하면 터미널(셸) 프로세스가 부모고, 새로 생긴 Node.js 프로세스가 자식이다.

---

## 본문

> It is usual to associate a single process with a main program, and child processes with any spin-off, parallel processes.

"하나의 프로세스를 메인 프로그램과 연결하고, 자식 프로세스를 파생된 병렬 프로세스와 연결하는 것이 일반적이다."

- **spin-off**: 메인 프로그램에서 분리되어 독립적으로 실행되는 것. 메인이 계속 돌면서 무거운 작업을 자식에게 위임하는 구조.
- **parallel processes**: 자식 프로세스는 부모와 동시에(병렬로) 실행된다. 부모가 멈추지 않고 자식이 작업을 처리하는 동안 부모는 다른 일을 계속한다.

**Node.js 예시:**

```js
const { fork } = require('child_process');
const child = fork('./heavy-task.js'); // 자식 프로세스 생성
child.on('message', (result) => {      // 자식이 완료되면 결과 수신
  console.log('결과:', result);
});
// 부모는 여기서 멈추지 않고 계속 다른 요청을 처리
```

`heavy-task.js`가 CPU 집약적인 작업(이미지 처리, 대용량 파일 파싱 등)을 하는 동안 부모는 다른 HTTP 요청을 계속 처리할 수 있다. 이것이 "메인 프로그램 = 부모, 파생된 병렬 프로세스 = 자식" 패턴이다.

---

## 종합

부모-자식 관계는 OS가 프로세스를 계층 구조로 관리하는 방식이다. 부모는 자식을 생성하고(fork), 자식의 완료를 기다리거나(wait), 신호를 보낼 수 있다(kill). 자식은 부모의 파일 디스크립터와 환경 변수를 상속받지만, 메모리 주소 공간은 분리된다(copy-on-write). PCB의 "부모 PID" 필드가 이 계층 구조를 유지하는 핵심 데이터다. Task Manager에서 프로세스 트리를 보면 이 부모-자식 관계가 시각화된다.

---

# 프로세스의 상태 전이(lifecycle) 전체 흐름과 각 상태의 의미는?

## 도입

`node app.js`를 실행하면 프로세스가 태어나고, 결국 종료된다. 그 사이 프로세스는 여러 상태를 오간다. 스케줄러는 이 상태들을 보고 누가 CPU를 받을지 결정한다. 상태를 이해하면 "왜 내 프로세스가 느린가", "왜 응답이 없는가"를 진단할 수 있다.

---

## 본문

> First, the process is "created" by being loaded from a secondary storage device (hard disk drive, CD-ROM, etc.) into main memory.

"먼저 프로세스는 보조 저장 장치(HDD, CD-ROM 등)에서 메인 메모리로 로드되어 '생성(created)'된다."

- **created**: 프로세스 탄생. PCB가 만들어지고, 메모리가 할당되고, 코드가 RAM에 올라온다. `node app.js`를 치는 순간이 이 상태다.

> After that the process scheduler assigns it the "waiting" state.

"그 후 프로세스 스케줄러가 '대기(waiting)' 상태를 부여한다."

- **waiting (= ready)**: CPU를 받을 준비가 다 됐지만 아직 차례가 오지 않은 상태. 스케줄러의 큐에 줄 서 있는 상태다. 이 상태의 프로세스는 언제든 CPU를 받으면 바로 실행할 수 있다.

> While the process is "waiting", it waits for the scheduler to do a so-called context switch.
> The context switch loads the process into the processor and changes the state to "running" while the previously "running" process is stored in a "waiting" state.

"프로세스가 '대기' 상태에 있는 동안 스케줄러가 컨텍스트 스위치를 수행하길 기다린다. 컨텍스트 스위치는 프로세스를 프로세서에 올려 '실행(running)' 상태로 바꾸고, 이전에 '실행' 중이던 프로세스는 '대기' 상태로 저장된다."

- **context switch**: CPU의 주인이 바뀌는 것. 이전 프로세스의 레지스터·PC를 PCB에 저장하고, 다음 프로세스의 PCB에서 복원한다.
- **running**: CPU를 실제로 점유해 명령어를 실행 중인 상태. 한 CPU 코어에서 동시에 하나의 프로세스만 running 상태일 수 있다.

> If a process in the "running" state needs to wait for a resource (wait for user input or file to open, for example), it is assigned the "blocked" state.

"'실행' 상태의 프로세스가 자원(예: 사용자 입력, 파일 열기)을 기다려야 하면 '블록(blocked)' 상태가 된다."

- **blocked**: I/O나 외부 이벤트를 기다리는 상태. 스케줄러 큐에서 완전히 빠져나와 기다린다. `fs.readFileSync()`가 파일을 읽는 동안 그 프로세스는 blocked 상태다. blocked 프로세스는 CPU를 받지 않는다 — 기다리는 중이니까.

> The process state is changed back to "waiting" when the process no longer needs to wait (in a blocked state).

"프로세스가 더 이상 기다릴 필요 없으면(블록 상태에서 벗어나면) 상태는 다시 '대기'로 바뀐다."

주의: blocked → running이 아니라 blocked → waiting이다. 자원을 확보했다고 바로 CPU를 받는 게 아니라, 다시 스케줄러 큐에 줄을 선다.

> Once the process finishes execution, or is terminated by the operating system, it is no longer needed.
> The process is removed instantly or is moved to the "terminated" state.

"프로세스가 실행을 마치거나 OS에 의해 강제 종료되면 더 이상 필요 없다. 프로세스는 즉시 제거되거나 '종료(terminated)' 상태로 이동한다."

- **terminated**: 프로세스가 종료됐지만 PCB가 아직 완전히 제거되지 않은 상태(좀비 프로세스). 부모가 자식의 종료 상태를 수집(wait)해야 완전히 삭제된다.

---

## 종합

프로세스 상태 전이를 한눈에 보면:

```
created → waiting → running → terminated
               ↑        ↓
               └─ blocked ←┘
```

각 상태의 핵심을 정리하면:

| 상태 | 의미 | CPU 점유 |
|---|---|---|
| created | 생성 중, PCB 초기화 | 없음 |
| waiting (ready) | CPU 준비 완료, 차례 기다림 | 없음 |
| running | CPU 점유해 명령어 실행 중 | 있음 |
| blocked | I/O 등 자원 대기 중 | 없음 |
| terminated | 종료됨, PCB 정리 대기 | 없음 |

오개념 포인트: `blocked`와 `waiting`을 혼동하기 쉽다. `waiting`(= ready)은 CPU만 없는 것이고, `blocked`는 I/O 등 외부 이벤트 자체를 기다리는 것이다. blocked에서 자원을 얻으면 바로 running이 되는 게 아니라 waiting으로 돌아가 다시 스케줄러의 선택을 기다린다.

Node.js가 싱글스레드이면서도 응답성이 좋은 이유도 여기서 설명된다: `fs.readFile()`을 호출하면 Node.js 내부적으로 논블로킹 I/O를 써서 메인 스레드를 blocked 상태로 만들지 않고, I/O가 완료되면 이벤트 루프가 콜백을 실행한다.
