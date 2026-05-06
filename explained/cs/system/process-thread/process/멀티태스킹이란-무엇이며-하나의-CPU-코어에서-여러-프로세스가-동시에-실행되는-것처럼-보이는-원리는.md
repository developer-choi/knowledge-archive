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
