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
