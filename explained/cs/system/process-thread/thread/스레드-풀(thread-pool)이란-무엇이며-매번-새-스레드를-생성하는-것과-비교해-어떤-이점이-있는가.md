# 스레드 풀(thread pool)이란 무엇이며, 매번 새 스레드를 생성하는 것과 비교해 어떤 이점이 있는가?

> A popular programming pattern involving threads is that of thread pools where a set number of threads are created at startup that then wait for a task to be assigned.
> When a new task arrives, it wakes up, completes the task and goes back to waiting.
> This avoids the relatively expensive thread creation and destruction functions for every task performed and takes thread management out of the application developer's hand and leaves it to a library or the operating system that is better suited to optimize thread management.

---

**도입**

스레드는 프로세스보다 가볍다지만, "매 요청마다 새 스레드 생성"은 여전히 비쌉니다. 1만 개 요청에 1만 번 스레드를 만들고 부수는 것보다, 미리 N개를 만들어두고 돌려쓰는 게 합리적이죠. 이 패턴이 스레드 풀입니다. Node.js의 libuv, Java의 ExecutorService, .NET의 ThreadPool 모두 같은 발상.

---

**본문**

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

**종합**

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
