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
