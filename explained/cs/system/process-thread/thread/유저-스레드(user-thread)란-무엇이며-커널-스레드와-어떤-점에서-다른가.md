# 유저 스레드(user thread)란 무엇이며, 커널 스레드와 어떤 점에서 다른가?

> At the kernel level, a process contains one or more kernel threads, which share the process's resources, such as memory and file handles – a process is a unit of resources, while a thread is a unit of scheduling and execution.
> Kernel scheduling is typically uniformly done preemptively or, less commonly, cooperatively.
> At the user level a process such as a runtime system can itself schedule multiple threads of execution.
> If these do not share data, as in Erlang, they are usually analogously called processes, while if they share data they are usually called (user) threads, particularly if preemptively scheduled.

---

**도입**

스레드는 누가 스케줄링하느냐에 따라 두 종류로 갈립니다. OS 커널이 직접 관리하면 커널 스레드, 사용자 공간의 런타임이 알아서 굴리면 유저 스레드. JS 개발자에게 가장 친숙한 예는 Node.js 이벤트 루프 — 커널은 이벤트 루프 내부의 "작업 단위"를 모르고, libuv가 알아서 스케줄링합니다.

---

**본문**

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

**종합**

용어를 매트릭스로:

| 종류 | 누가 스케줄링 | 데이터 공유 | 예시 |
|---|---|---|---|
| 커널 스레드 | OS 커널 | 같은 프로세스 내 공유 | pthread, Java Thread |
| 유저 스레드 | 런타임/라이브러리 | 공유 | Node.js의 작업 단위 |
| (격리된) 유저 단위 | 런타임 | 공유 안 함 | Erlang process, Go goroutine 채널 통신 |

JS 비유로 풀면: Node.js의 이벤트 루프는 콜백·Promise를 차례로 처리하는 사용자 공간 스케줄러입니다. 커널 입장에서 Node.js 프로세스는 그냥 메인 스레드 1개일 뿐, 그 안에서 수천 개의 비동기 작업이 돌아가는 건 모릅니다. libuv가 자체적으로 굴리는 것.

이게 없으면 어떻게 되는가: 유저 수준 스케줄링이 없으면 모든 동시성을 커널 스레드로 표현해야 합니다. 1만 개 동시 연결을 처리하려면 1만 개 커널 스레드 — 컨텍스트 스위치 비용·메모리(스레드당 스택)로 시스템이 무너집니다. Node.js가 1만 동시 연결을 손쉽게 처리하는 건 사용자 공간에서 가벼운 단위로 굴리기 때문.

Official Annotation 보충: 커널 스레드가 소유하는 건 스택·레지스터·TLS뿐(나머지는 프로세스 공유)이라 생성/파괴가 저렴합니다. 유저 스레드는 더 저렴 — 커널과 상호작용 없이 사용자 공간 안에서만 전환되니, 시스템 콜 자체가 안 일어납니다. 다만 다음 질문에서 다룰 블로킹 시스템 콜 문제가 트레이드오프로 따라옵니다.
