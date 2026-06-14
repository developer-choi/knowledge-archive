# 스레드(thread)란 무엇이며, 프로세스와 어떤 관계인가?

## 도입

프로세스가 "자원의 묶음"이라면, 스레드는 그 자원을 실제로 사용해 코드를 실행하는 흐름이다. 하나의 프로세스 안에 여러 스레드가 있을 수 있고, 스레드들은 프로세스의 메모리를 공유하며 동시에 작업한다.

---

## 본문

> A thread is the smallest sequence of programmed instructions that can be managed independently by a scheduler.

"스레드는 스케줄러가 독립적으로 관리할 수 있는 프로그래밍된 명령어의 가장 작은 시퀀스다."

- **smallest**: 스케줄러가 관리하는 최소 단위. 더 잘게 쪼갤 수 없는 실행 단위다.
- **sequence**: 명령어들이 순서대로 이어지는 흐름. 스레드가 "thread(실)"인 이유다 — 명령어가 하나씩 이어진 실처럼 순서대로 실행된다.
- **managed independently**: 스레드마다 독립적으로 스케줄링된다. 프로세스 안에 스레드가 4개면 스케줄러가 그 4개를 각각 독립적으로 CPU에 올리고 내릴 수 있다.

> In many cases, a thread is a component of a process.

"대부분의 경우 스레드는 프로세스의 구성 요소다."

프로세스 = 자원의 단위(메모리, 파일 핸들 등), 스레드 = 실행의 단위(CPU 스케줄링). 프로세스가 메모리를 확보하면, 스레드가 그 위에서 코드를 한 줄씩 실행한다.

**비유:**

`node app.js`로 for 루프 1억 번 도는 프로그램을 실행하면:
- **프로세스가 하는 것**: 메모리 할당(`i` 변수 저장 공간), stdout 파일 핸들 확보, V8이 변환한 기계어 코드 적재
- **스레드가 하는 것**: `i = 0` → 조건 확인 → 본문 실행 → `i++` → ... 를 1억 번 순서대로 실행

스레드가 `i`를 읽고 쓸 수 있는 건, 프로세스가 메모리를 확보해뒀기 때문이다.

---

## 종합

프로세스와 스레드의 관계를 정리하면:

```
프로세스 (자원 단위)
├── 메모리 (텍스트, 데이터, 스택, 힙)
├── 파일 디스크립터
├── 권한
└── 스레드들 (실행 단위)
    ├── 스레드 A: 명령어 시퀀스 실행 중 (자체 스택, PC, 레지스터)
    ├── 스레드 B: 명령어 시퀀스 실행 중 (자체 스택, PC, 레지스터)
    └── 스레드 C: ...
```

스레드들은 프로세스의 메모리(힙, 코드, 전역변수)를 공유하지만, 각자 자신만의 스택과 Program Counter, 레지스터를 가진다.

---

# 같은 프로세스의 스레드들이 자원을 공유한다고 할 때, 구체적으로 어떤 데이터를 공유하고 어떤 데이터는 스레드마다 독립인가?

## 도입

스레드들이 메모리를 "공유한다"고 하면, 모든 것을 공유하는 건지 아닌지 헷갈린다. 공유하는 것과 독립인 것을 명확히 구분하는 것이 레이스 컨디션 이해의 출발점이다.

---

## 본문

> The multiple threads of a given process may be executed concurrently (via multithreading capabilities), sharing resources such as memory, while different processes do not share these resources.

"같은 프로세스의 여러 스레드는 메모리 같은 자원을 공유하면서 동시에 실행될 수 있다. 반면 다른 프로세스들은 이 자원을 공유하지 않는다."

이것이 스레드와 프로세스의 핵심 차이다. 같은 프로세스의 스레드들은 기본으로 메모리를 공유하지만, 다른 프로세스 간에는 IPC 없이는 메모리를 공유할 수 없다.

> In particular, the threads of a process share its executable code and the values of its dynamically allocated variables and global variables at any given time.

"특히 프로세스의 스레드들은 실행 코드, 동적 할당된 변수의 값, 전역 변수를 공유한다."

**공유하는 것 (스레드 간 동일):**
- **executable code**: 텍스트 영역의 기계어 코드. 모든 스레드가 같은 함수를 실행할 수 있다.
- **dynamically allocated variables**: 힙에 있는 객체/배열 등. `const arr = []`처럼 힙에 할당된 것.
- **global variables**: 데이터 영역의 전역 변수. `let count = 0`처럼 모듈 최상위 선언.

**독립인 것 (스레드마다 별도):**
- **스택**: 각 스레드마다 자신만의 콜 스택. 함수 호출, 지역변수, 반환 주소가 여기에 있다.
- **thread-local 변수**: `thread_local` 키워드 등으로 명시적으로 스레드별 독립 값을 가지게 한 변수.
- **Program Counter, 레지스터**: 각 스레드가 현재 어느 명령어를 실행 중인지, 레지스터 값은 무엇인지 — 각자 독립.

**JS 관점:**

JS의 Web Worker는 기본으로 메모리를 공유하지 않아서 `SharedArrayBuffer`를 명시적으로 사용해야 한다. 네이티브 스레드(C++, Java 등)는 기본이 공유다. 이 차이 때문에 JS는 기본적으로 레이스 컨디션이 없고, `SharedArrayBuffer`를 쓸 때만 `Atomics` API로 동기화가 필요하다.

---

## 종합

```
프로세스 메모리
├── 텍스트 영역 (코드)    ← 모든 스레드 공유
├── 데이터 영역 (전역변수) ← 모든 스레드 공유
├── 힙 (동적 할당)        ← 모든 스레드 공유 (← 레이스 컨디션 발생 지점)
└── 스택
    ├── 스레드 A의 스택   ← 스레드 A 전용
    ├── 스레드 B의 스택   ← 스레드 B 전용
    └── 스레드 C의 스택   ← 스레드 C 전용
```

힙과 전역변수를 공유하기 때문에 빠른 통신이 가능하지만, 동시 접근 시 레이스 컨디션이 생긴다. 스택은 공유하지 않기 때문에 지역변수는 레이스 컨디션 걱정이 없다.

---

# 유저 스레드(user thread)란 무엇이며, 커널 스레드와 어떤 점에서 다른가?

## 도입

스레드에는 두 층위가 있다. OS 커널이 직접 관리하는 커널 스레드와, 유저 공간에서 런타임이 관리하는 유저 스레드다. Node.js 이벤트 루프와 Go의 goroutine이 유저 스레드(혹은 유사 메커니즘)의 예다.

---

## 본문

> At the kernel level, a process contains one or more kernel threads, which share the process's resources, such as memory and file handles – a process is a unit of resources, while a thread is a unit of scheduling and execution.

"커널 레벨에서 프로세스는 하나 이상의 커널 스레드를 포함하며, 이 스레드들은 메모리와 파일 핸들 같은 프로세스 자원을 공유한다. 프로세스는 자원의 단위이고, 스레드는 스케줄링과 실행의 단위다."

- **kernel threads**: OS 커널이 직접 알고 있는 스레드. 스케줄러가 이 단위로 CPU를 배분한다.

> Kernel scheduling is typically uniformly done preemptively or, less commonly, cooperatively.

"커널 스케줄링은 일반적으로 선점형으로, 드물게는 협력형으로 이루어진다."

> At the user level a process such as a runtime system can itself schedule multiple threads of execution.
> If these do not share data, as in Erlang, they are usually analogously called processes, while if they share data they are usually called (user) threads, particularly if preemptively scheduled.

"유저 레벨에서 런타임 시스템 같은 프로세스가 스스로 여러 실행 스레드를 스케줄링할 수 있다. 데이터를 공유하지 않으면(Erlang처럼) 보통 프로세스라 부르고, 데이터를 공유하면 (유저) 스레드라 부른다."

- **user threads**: 커널이 모르는 스레드. OS 관점에서는 그냥 하나의 프로세스(또는 커널 스레드)로 보인다. 유저 공간의 런타임이 자체 스케줄러로 유저 스레드들을 관리한다.

> As user thread implementations are typically entirely in userspace, context switching between user threads within the same process is extremely efficient because it does not require any interaction with the kernel at all.

"유저 스레드 구현은 보통 완전히 유저 공간에 있으므로, 같은 프로세스 내 유저 스레드 간 컨텍스트 스위치는 커널과의 상호작용이 전혀 없어 극도로 효율적이다."

- **does not require any interaction with the kernel**: 커널 스레드 전환은 시스템 콜이 필요하지만(유저 모드 → 커널 모드 전환), 유저 스레드 전환은 런타임이 직접 레지스터를 바꾸기만 하면 된다. 훨씬 빠르다.

**예시:**
- Node.js의 이벤트 루프: 하나의 커널 스레드 위에서 수천 개의 비동기 작업을 유저 공간에서 스케줄링한다.
- Go의 goroutine: M:N 모델로 수천 개의 goroutine을 소수의 커널 스레드에 매핑.

---

## 종합

| 구분 | 커널 스레드 | 유저 스레드 |
|---|---|---|
| 관리 주체 | OS 커널 | 유저 공간 런타임 |
| 커널 인지 여부 | 알고 있음 | 모름 |
| 컨텍스트 스위치 비용 | 시스템 콜 필요 (느림) | 런타임만 관여 (빠름) |
| 멀티코어 활용 | 가능 | 제한 (M:N 모델로 해결 가능) |
| 예시 | Linux pthread | Node.js 이벤트 루프, Go goroutine |

유저 스레드의 큰 단점은 블로킹 시스템 콜 시 문제가 생긴다는 것 — 다음 질문에서 다룬다.

---

# 커널 스레드가 소유하는 자원은 무엇이며, 프로세스와 비교해 생성/파괴가 저렴한 이유는?

## 도입

프로세스를 새로 만드는 것(fork)과 스레드를 새로 만드는 것의 비용 차이는 크다. 스레드가 훨씬 가볍다. 왜냐하면 스레드는 프로세스가 이미 확보한 자원을 공유하고, 자신만의 것은 최소한으로만 갖기 때문이다.

---

## 본문

> Kernel threads do not own resources except for a stack, a copy of the registers including the program counter, and thread-local storage (if any), and are thus relatively cheap to create and destroy.

"커널 스레드는 스택, 프로그램 카운터를 포함한 레지스터 복사본, 그리고 thread-local storage(있는 경우) 외에는 어떤 자원도 소유하지 않으므로 생성과 파괴가 상대적으로 저렴하다."

커널 스레드가 자신만 갖는 것:
- **stack**: 자체 콜 스택 (지역변수, 반환 주소)
- **registers + program counter**: 현재 실행 상태 (어디까지 했는지)
- **thread-local storage**: 스레드별 독립 변수 저장소

나머지 — 메모리(힙, 코드), 파일 디스크립터, 권한 — 는 프로세스 것을 그냥 공유한다.

반면 프로세스 생성 시 필요한 것:
- 새 가상 주소 공간 (별도 페이지 테이블)
- 파일 디스크립터 복사
- PCB 전체 초기화
- 메모리 영역 전체 할당

이 차이가 스레드 생성이 프로세스 생성보다 수십~수백 배 빠른 이유다.

> Thread switching is also relatively cheap: it requires a context switch (saving and restoring registers and stack pointer), but does not change virtual memory and is thus cache-friendly (leaving TLB valid).

"스레드 전환도 상대적으로 저렴하다: 레지스터와 스택 포인터를 저장·복원하는 컨텍스트 스위치가 필요하지만, 가상 메모리를 바꾸지 않으므로 캐시 친화적이다(TLB가 유효한 채로 유지된다)."

- **TLB (Translation Lookaside Buffer)**: 가상 주소 → 물리 주소 변환을 캐싱하는 하드웨어 캐시. 프로세스 전환 시에는 주소 공간이 바뀌므로 TLB를 비워야 한다(비쌈). 스레드 전환 시에는 같은 주소 공간 안에 있으므로 TLB가 그대로 유효하다(쌈).

---

## 종합

스레드가 프로세스보다 생성/파괴/전환이 저렴한 이유:

```
프로세스 생성                 스레드 생성
- 새 주소 공간 할당 (비쌈)   - 스택만 새로 할당 (쌈)
- 파일 디스크립터 복사        - 프로세스 것 공유
- PCB 전체 초기화             - TCB만 초기화
- TLB 전체 무효화 (비쌈)     - TLB 유효 유지 (쌈)
```

웹 서버처럼 요청마다 작업 단위가 필요한 상황에서 매번 프로세스를 만들면 너무 느리다. 스레드 풀이나 이벤트 루프를 쓰는 이유다.

---

# 유저 스레드에서 블로킹 시스템 콜이 문제가 되는 이유와, 이를 해결하는 방법은?

## 도입

유저 스레드는 커널이 모른다. 그러면 유저 스레드 중 하나가 "잠깐만, 파일 읽어야 해"라고 블로킹 시스템 콜을 하면 어떻게 될까? 커널은 유저 스레드가 여러 개 있다는 걸 모르기 때문에 프로세스 전체를 멈춰버린다.

---

## 본문

> However, the use of blocking system calls in user threads (as opposed to kernel threads) can be problematic.
> If a user thread or a fiber performs a system call that blocks, the other user threads and fibers in the process are unable to run until the system call returns.

"그러나 유저 스레드에서 블로킹 시스템 콜을 사용하면 문제가 생길 수 있다. 유저 스레드나 파이버 중 하나가 블로킹 시스템 콜을 수행하면, 그 콜이 반환될 때까지 프로세스의 다른 모든 유저 스레드와 파이버가 실행될 수 없다."

왜? 커널은 유저 스레드의 존재를 모른다. 커널 눈에는 그냥 하나의 프로세스가 블로킹 시스템 콜을 한 것이다. 그래서 프로세스 전체를 blocked 상태로 만든다. 유저 스레드 런타임이 "나 대신 다른 유저 스레드 실행해줘"를 커널에게 요청할 방법이 없다.

> A common solution to this problem (used, in particular, by many green threads implementations) is providing an I/O API that implements an interface that blocks the calling thread, rather than the entire process, by using non-blocking I/O internally, and scheduling another user thread or fiber while the I/O operation is in progress.

"이 문제의 일반적인 해결책은 — 많은 그린 스레드 구현이 사용 — 내부적으로 논블로킹 I/O를 사용해 호출 스레드만 블록하고 프로세스 전체는 블록하지 않는 I/O API를 제공하고, I/O 작업 중에 다른 유저 스레드나 파이버를 스케줄링하는 것이다."

- **non-blocking I/O**: OS에 "파일 읽어줘, 다 되면 알려줘"라고 비동기로 요청하는 것. 기다리는 동안 CPU는 다른 유저 스레드를 실행할 수 있다.
- **green threads**: 유저 공간에서 관리되는 스레드. OS 스레드와 구별.

**Node.js가 이것을 해결하는 방법:**
libuv를 통해 내부적으로 논블로킹 I/O를 사용한다. `fs.readFile()`을 호출하면 OS에 비동기 I/O 요청을 보내고, I/O가 완료될 때까지 이벤트 루프가 다른 콜백을 처리한다. `async/await`는 이 논블로킹 I/O의 문법적 추상화다.

> Alternatively, the program can be written to avoid the use of synchronous I/O or other blocking system calls (in particular, using non-blocking I/O, including lambda continuations and/or async/await primitives).

"대안으로, 프로그램 자체를 동기 I/O나 블로킹 시스템 콜을 피하도록 작성할 수 있다(논블로킹 I/O, lambda continuations, async/await 등)."

Node.js에서 `fs.readFileSync()` 대신 `fs.readFile()` 또는 `fs.promises.readFile()`을 쓰는 이유가 바로 이것이다.

---

## 종합

유저 스레드의 블로킹 문제는 커널이 유저 스레드를 모른다는 사실에서 비롯된다. 해결책은 두 가지다:

- **내부 논블로킹 I/O**: 런타임이 블로킹 API 인터페이스를 유지하되 내부는 논블로킹으로 구현. I/O 대기 중 다른 유저 스레드를 실행.
- **명시적 논블로킹 코드 작성**: `async/await`, 콜백, Promise로 블로킹 콜 자체를 안 쓰기.

Node.js는 둘 다 사용한다: libuv가 내부적으로 논블로킹 I/O를 쓰고, JS 코드는 `async/await`로 논블로킹 스타일을 강제한다.

---

# 프로세스 전환(context switch)이 스레드 전환보다 비용이 큰 이유는?

## 도입

프로세스 전환은 "집을 이사하는 것"이고, 스레드 전환은 "같은 집에서 방만 바꾸는 것"이다. 집이 바뀌면 주소 체계 전체가 바뀌지만, 방만 바뀌면 주소 체계는 그대로다.

---

## 본문

> A process is a heavyweight unit of kernel scheduling, as creating, destroying, and switching processes is relatively expensive.

"프로세스는 커널 스케줄링의 무거운 단위다 — 프로세스 생성, 파괴, 전환이 상대적으로 비싸다."

- **heavyweight**: 스레드(lightweight)의 반대. 자원을 많이 갖고 있기 때문에 전환도 비싸다.

> Processes are typically preemptively multitasked, and process switching is relatively expensive, beyond basic cost of context switching, due to issues such as cache flushing (in particular, process switching changes virtual memory addressing, causing invalidation and thus flushing of an untagged translation lookaside buffer (TLB), notably on x86).

"프로세스는 일반적으로 선점형 멀티태스킹을 사용하며, 프로세스 전환은 기본적인 컨텍스트 스위치 비용 외에도 캐시 플러싱 같은 문제로 인해 상대적으로 비싸다. 특히 프로세스 전환은 가상 메모리 주소 체계를 변경하여 태그 없는 TLB를 무효화하고 플러싱을 야기한다."

- **TLB (Translation Lookaside Buffer)**: 가상 주소 → 물리 주소 변환을 캐싱하는 CPU 내 하드웨어 캐시. 자주 쓰는 주소 변환을 기억해두어 매번 페이지 테이블을 뒤지지 않아도 된다.
- **process switching changes virtual memory addressing**: 프로세스 A와 B는 각자 독립적인 가상 주소 공간을 가진다. 전환 시 주소 공간이 바뀌므로, A를 위해 캐싱된 TLB 항목들은 B에게 무의미하다.
- **invalidation and thus flushing**: 무의미한 TLB 항목들을 모두 비워야 한다. 그러면 B가 처음 메모리에 접근할 때마다 TLB 미스가 나고, 페이지 테이블을 다시 뒤져야 한다. 이 오버헤드가 크다.

스레드 전환은 같은 프로세스 안에서 일어나므로 주소 공간이 바뀌지 않는다 → TLB를 비울 필요가 없다 → 훨씬 빠르다.

---

## 종합

프로세스 전환과 스레드 전환의 비용 차이:

```
프로세스 전환                  스레드 전환
- 레지스터 저장/복원 (공통)   - 레지스터 저장/복원 (공통)
- 가상 주소 공간 전환 (비쌈)  - 가상 주소 공간 유지 (없음)
- TLB 전체 무효화 (비쌈)      - TLB 유효 유지 (없음)
- 새 주소 공간 워밍업 필요    - 캐시 대부분 재사용 가능
```

프로세스 = 집 이사 (주소 전체가 바뀜, 이삿짐 다 챙겨야 함), 스레드 = 같은 집에서 방만 이동 (주소 그대로, 이삿짐 불필요). 이 비용 차이 때문에 높은 동시성이 필요한 웹 서버에서 스레드나 이벤트 루프를 쓴다.

---

# 스레드가 같은 주소 공간을 공유하는 것의 위험성은 무엇이며, 실제 소프트웨어에서 이를 어떻게 회피하는가?

## 도입

스레드들이 같은 메모리를 공유하는 건 빠르지만 위험하다. 하나가 잘못되면 전체가 무너진다. 실제 소프트웨어에서는 이 위험을 어떻게 다루는가?

---

## 본문

> Thread crashes a process: due to threads sharing the same address space, an illegal operation performed by a thread can crash the entire process; therefore, one misbehaving thread can disrupt the processing of all the other threads in the application.

"스레드가 프로세스를 크래시시킨다: 스레드들이 같은 주소 공간을 공유하므로, 하나의 스레드가 불법 연산을 수행하면 프로세스 전체가 크래시할 수 있다. 따라서 하나의 비정상적인 스레드가 애플리케이션의 다른 모든 스레드 처리를 방해할 수 있다."

- **illegal operation**: 잘못된 메모리 주소 접근(null pointer dereference), 스택 오버플로우 등. 같은 주소 공간이니까 이런 오류가 프로세스 전체에 영향을 준다.
- **one misbehaving thread**: 스레드 하나의 버그가 프로세스 전체를 죽이는 것. 격리가 없다는 뜻이다.

**Chrome의 해결책 — 멀티프로세스 아키텍처:**

Chrome은 탭마다 별도 프로세스를 사용한다. 하나의 탭이 크래시해도 다른 탭은 살아있다. 스레드를 쓰면 빠르지만, 하나가 죽으면 전체가 죽는다. 프로세스를 쓰면 느리지만(IPC 필요), 격리가 완벽하다.

이것이 스레드의 공유 모델(빠르고 가벼움)과 프로세스의 격리 모델(안전함) 사이의 트레이드오프다.

---

## 종합

같은 주소 공간 공유의 위험성과 회피 전략:

| 위험 | 회피 방법 |
|---|---|
| 스레드 하나가 크래시 → 프로세스 전체 크래시 | 중요한 컴포넌트를 별도 프로세스로 격리 (Chrome 탭, Node.js 클러스터) |
| 레이스 컨디션 (공유 데이터 동시 수정) | 뮤텍스, 락, Atomics, 이벤트 루프 |
| 예측 불가능한 상태 변경 | 불변 데이터, 메시지 패싱(postMessage) |

Node.js가 싱글스레드 이벤트 루프를 쓰는 것도 이 위험을 아예 피하는 설계다 — 공유 메모리가 없으니 레이스 컨디션도 없다. CPU 바운드 작업은 `Worker Threads`로 분리하되, `SharedArrayBuffer` + `Atomics`로 필요할 때만 공유한다.

---

# 현대 OS(Linux, Windows, macOS)가 채택한 1:1 스레딩 모델이란 무엇인가?

## 도입

스레딩 모델은 유저 스레드와 커널 스레드를 어떻게 매핑하느냐에 따라 여러 종류가 있다. 현대 OS 대부분은 1:1 모델을 채택했다 — 가장 단순하고 멀티코어를 자연스럽게 활용하기 때문이다.

---

## 본문

> Threads created by the user in a 1:1 correspondence with schedulable entities in the kernel are the simplest possible threading implementation.

"유저가 생성한 스레드가 커널의 스케줄 가능한 엔티티와 1:1 대응하는 것은 가장 단순한 스레딩 구현이다."

- **1:1**: 유저가 만든 스레드 하나 = 커널 스레드 하나. 커널이 각 스레드를 직접 알고 스케줄링한다.

> OS/2 and Win32 used this approach from the start, while on Linux the GNU C Library implements this approach (via the NPTL or older LinuxThreads).
> This approach is also used by Solaris, NetBSD, FreeBSD, macOS, and iOS.

"OS/2와 Win32는 처음부터 이 방식을 사용했고, Linux에서는 GNU C 라이브러리가 NPTL(또는 구형 LinuxThreads)을 통해 이 방식을 구현한다. Solaris, NetBSD, FreeBSD, macOS, iOS도 이 방식을 사용한다."

1:1 모델의 장점:
- **단순성**: 커널이 직접 스레드를 관리하므로 런타임 복잡도가 없다.
- **멀티코어 자연 활용**: 커널이 각 스레드를 독립적으로 스케줄링하므로 여러 코어에 분산 배치된다.
- **블로킹 시스템 콜 OK**: 하나의 스레드가 블로킹되어도 커널이 다른 스레드를 계속 실행한다.

---

## 종합

1:1 모델은 "유저 스레드 = 커널 스레드"로 가장 직관적이다. `pthread_create()`를 호출하면 커널이 진짜 스레드를 하나 만들어준다. Node.js의 `new Worker()`도 내부적으로 1:1 커널 스레드를 만든다. 현대 OS가 거의 다 1:1을 쓰는 이유는 단순성과 멀티코어 활용이 가장 중요한 요소이기 때문이다.

---

# M:1 스레딩 모델에서 멀티코어 CPU의 성능을 활용할 수 없는 이유는?

## 도입

M:1 모델은 유저 스레드가 아무리 많아도 커널 스레드는 딱 하나다. 커널이 하나의 스레드만 알고 있으니, CPU 코어가 여러 개라도 동시에 하나의 코어만 쓸 수 있다.

---

## 본문

> An M:1 model implies that all application-level threads map to one kernel-level scheduled entity; the kernel has no knowledge of the application threads.

"M:1 모델은 모든 애플리케이션 레벨 스레드가 하나의 커널 레벨 스케줄 엔티티에 매핑됨을 의미한다. 커널은 애플리케이션 스레드에 대한 지식이 없다."

유저 스레드 10개가 있어도 커널 눈에는 프로세스 하나만 보인다. 스케줄러는 그 프로세스에 CPU 코어 하나만 배정한다.

> One of the major drawbacks, however, is that it cannot benefit from the hardware acceleration on multithreaded processors or multi-processor computers: there is never more than one thread being scheduled at the same time.

"주요 단점은 멀티스레드 프로세서나 멀티프로세서 컴퓨터의 하드웨어 가속을 활용할 수 없다는 것이다: 동시에 스케줄링되는 스레드가 절대 하나를 초과하지 않는다."

CPU 코어가 8개여도 M:1 모델에서는 항상 코어 1개만 쓴다.

> For example: If one of the threads needs to execute an I/O request, the whole process is blocked and the threading advantage cannot be used.

"예를 들어: 스레드 중 하나가 I/O 요청을 실행해야 하면, 프로세스 전체가 블록되어 스레딩의 장점을 활용할 수 없다."

---

## 종합

M:1 모델의 핵심 제약:

```
유저 스레드 10개
        ↓ (모두 매핑)
커널 스레드 1개
        ↓ (커널 스케줄러가 이것만 봄)
CPU 코어 1개만 사용
```

하나가 블로킹 → 전체 블로킹, 멀티코어 활용 불가. 이 단점을 보완한 것이 M:N 모델이다.

---

# M:N 스레딩 모델이란 무엇이며, 어떤 런타임이 이를 사용하는가?

## 도입

M:N 모델은 "유저 스레드 여러 개를 커널 스레드 여러 개에 매핑"한다. M:1(멀티코어 못 씀)과 1:1(커널 스레드 생성 비용 큼)의 타협점이다.

---

## 본문

> M:N maps some M number of application threads onto some N number of kernel entities, or "virtual processors."
> This is a compromise between kernel-level ("1:1") and user-level ("N:1") threading.

"M:N은 M개의 애플리케이션 스레드를 N개의 커널 엔티티(가상 프로세서)에 매핑한다. 이는 커널 레벨(1:1)과 유저 레벨(N:1) 스레딩의 타협점이다."

예: goroutine 10000개를 OS 스레드 8개에 매핑. 코어 8개를 전부 사용하면서(1:1의 장점), 스레드 생성 비용은 goroutine 단위로 저렴하다(M:1의 장점).

> In the M:N implementation, the threading library is responsible for scheduling user threads on the available schedulable entities; this makes context switching of threads very fast, as it avoids system calls.

"M:N 구현에서 스레딩 라이브러리가 유저 스레드를 사용 가능한 스케줄 엔티티에 스케줄링하는 역할을 한다. 이로써 시스템 콜을 피하므로 스레드 컨텍스트 스위치가 매우 빠르다."

유저 스레드 간 전환은 런타임(Go 스케줄러)이 담당하므로 시스템 콜 없이 빠르게 전환된다.

> However, this increases complexity and the likelihood of priority inversion, as well as suboptimal scheduling without extensive (and expensive) coordination between the userland scheduler and the kernel scheduler.

"그러나 이는 복잡성을 높이고 우선순위 역전 가능성을 높이며, 유저랜드 스케줄러와 커널 스케줄러 간의 광범위하고 비용이 큰 협력 없이는 최적이 아닌 스케줄링을 초래한다."

M:N의 단점: 두 개의 스케줄러(런타임 + 커널)가 서로 모르게 동작하므로, 최적 스케줄링이 어렵다. Go가 이것을 상당히 잘 해결했지만 구현 복잡도가 높다.

---

## 종합

| 모델 | 유저:커널 | 멀티코어 | 블로킹 문제 | 복잡도 |
|---|---|---|---|---|
| M:1 (N:1) | M개:1개 | 불가 | 있음 | 낮음 |
| 1:1 | 1개:1개 | 가능 | 없음 | 낮음 |
| M:N | M개:N개 | 가능 | 완화 | 높음 |

Go의 goroutine이 M:N의 대표 사례: goroutine 수천 개를 GOMAXPROCS만큼의 OS 스레드에 매핑. Node.js는 이벤트 루프(M:1과 유사)로 I/O를 처리하고, CPU 바운드 작업은 Worker Threads(1:1)로 분리한다.

---

# 스레드가 공유 데이터에 동시 접근할 때 발생하는 race condition이란 무엇이며, 이를 방지하는 방법은?

## 도입

두 스레드가 동시에 같은 변수를 읽고 쓰면 어떻게 될까? 아주 운 나쁜 타이밍에 두 스레드가 엇갈리면 예상치 못한 결과가 나온다. 이것이 race condition이다.

---

## 본문

> When shared between threads, however, even simple data structures become prone to race conditions if they require more than one CPU instruction to update: two threads may end up attempting to update the data structure at the same time and find it unexpectedly changing underfoot.

"스레드 간 공유 시, 업데이트에 두 개 이상의 CPU 명령어가 필요한 경우 간단한 자료구조도 레이스 컨디션에 취약해진다: 두 스레드가 동시에 자료구조를 업데이트하려 하면 예상치 못하게 변경된 값을 발견할 수 있다."

- **more than one CPU instruction**: `count++`는 사람 눈에 한 줄이지만 CPU에는 세 단계다:
  1. `count` 메모리에서 레지스터로 read
  2. 레지스터 값 +1 (increment)
  3. 레지스터 값을 `count` 메모리에 write

  두 스레드가 동시에 이 세 단계를 실행하면:
  ```
  스레드 A: read(count=0)
  스레드 B: read(count=0)  ← A가 아직 write 안 했음
  스레드 A: increment → 1, write(count=1)
  스레드 B: increment → 1, write(count=1)  ← 기대값 2인데 1이 됨
  ```

> Bugs caused by race conditions can be very difficult to reproduce and isolate.

"레이스 컨디션으로 인한 버그는 재현하고 격리하기 매우 어렵다."

타이밍에 따라 발생하고 안 발생하기를 반복하는 비결정적(non-deterministic) 버그. 테스트에서 안 나타나고 프로덕션에서만 나타나는 경우가 많다.

> To prevent this, threading application programming interfaces (APIs) offer synchronization primitives such as mutexes to lock data structures against concurrent access.

"이를 방지하기 위해 스레딩 API는 자료구조를 동시 접근으로부터 잠그는 뮤텍스 같은 동기화 프리미티브를 제공한다."

- **mutex (mutual exclusion lock)**: "내가 이 자원 쓰는 동안 다른 스레드는 못 들어와" 하는 잠금 장치. 뮤텍스를 잡은 스레드만 임계 구역에 들어갈 수 있고, 나올 때 풀어준다.

---

## 종합

레이스 컨디션은 "타이밍이 맞으면 안 생기고 안 맞으면 생기는" 비결정적 버그다. 방지 방법:

- **뮤텍스/락**: 임계 구역을 한 번에 하나의 스레드만 접근하게 잠근다.
- **Atomics**: CPU 레벨에서 read-modify-write를 원자적으로 실행. JS의 `Atomics.add()`.
- **싱글스레드 이벤트 루프**: Node.js처럼 아예 공유 상태를 싱글스레드로 처리 — 기본적으로 레이스 컨디션이 없다.
- **불변 데이터 + 메시지 패싱**: 공유 상태 대신 `postMessage`로 값 복사본을 전달.

JS는 싱글스레드라 기본적으로 레이스 컨디션이 없다. `SharedArrayBuffer` + `Worker Threads`를 쓸 때만 `Atomics`로 동기화가 필요하다.

---

# 스레드 풀(thread pool)이란 무엇이며, 매번 새 스레드를 생성하는 것과 비교해 어떤 이점이 있는가?

## 도입

HTTP 요청이 올 때마다 새 스레드를 생성하면 어떻게 될까? 초당 1000개 요청이면 스레드를 1000번 생성하고 파괴한다. 이 비용이 크기 때문에 스레드 풀을 사용한다.

---

## 본문

> A popular programming pattern involving threads is that of thread pools where a set number of threads are created at startup that then wait for a task to be assigned.

"스레드와 관련된 인기 있는 프로그래밍 패턴은 스레드 풀로, 시작 시점에 정해진 수의 스레드를 생성해 작업이 배정되기를 기다린다."

- **set number of threads**: 미리 고정 개수의 스레드를 만들어둔다. 늘리거나 줄이지 않는다(동적 풀도 있지만 기본 개념은 고정).
- **created at startup**: 서버 시작 시 한 번만 생성. 요청마다 생성하지 않는다.

> When a new task arrives, it wakes up, completes the task and goes back to waiting.

"새 작업이 도착하면, 스레드가 깨어나서 작업을 완료하고 다시 대기 상태로 돌아간다."

`wake up → execute → wait` 사이클. 스레드를 재사용하는 것이다.

> This avoids the relatively expensive thread creation and destruction functions for every task performed and takes thread management out of the application developer's hand and leaves it to a library or the operating system that is better suited to optimize thread management.

"이는 작업마다 스레드를 생성하고 파괴하는 비교적 비싼 함수 호출을 피하고, 스레드 관리를 애플리케이션 개발자의 손에서 꺼내어 스레드 관리 최적화에 더 적합한 라이브러리나 OS에 맡긴다."

- **relatively expensive thread creation**: 스레드 생성은 스택 할당, TCB 초기화, 커널 시스템 콜 등을 포함한다. 수천 번 반복하면 오버헤드가 누적된다.
- **takes thread management out of the developer's hand**: 개발자가 직접 스레드 수명을 관리하지 않아도 된다.

**Node.js 예시:**

Node.js의 libuv는 기본 4개의 스레드 풀(`UV_THREADPOOL_SIZE=4`)을 갖고 있다. `fs.readFile()`, `crypto.pbkdf2()`, `dns.lookup()` 같은 블로킹 작업들이 이 풀의 스레드에서 처리된다. 이벤트 루프는 메인 스레드에서 계속 돌고, 블로킹 작업만 풀에 위임한다.

---

## 종합

스레드 풀 vs 매번 생성:

| | 스레드 풀 | 매번 생성 |
|---|---|---|
| 작업당 오버헤드 | 거의 없음 (스레드 재사용) | 스레드 생성+파괴 비용 |
| 메모리 | 고정 (예측 가능) | 요청량에 따라 급증 |
| 관리 복잡도 | 라이브러리/OS가 담당 | 개발자가 직접 |
| 최대 동시 작업 | 풀 크기로 제한 (스로틀링 효과) | 제한 없음 (스레드 폭발 위험) |

Node.js libuv의 스레드 풀은 `UV_THREADPOOL_SIZE` 환경변수로 조정 가능하다. CPU 코어 수보다 훨씬 많이 잡으면 컨텍스트 스위치 오버헤드가, 너무 작으면 블로킹 작업 대기열이 쌓인다.

---

# 싱글스레드 프로그램에서 오래 걸리는 작업이 UI를 멈추게 하는 문제를, 멀티스레딩 없이도 해결할 수 있는가?

## 도입

브라우저에서 버튼을 클릭했는데 화면이 얼어붙은 경험이 있다면, 메인 스레드가 긴 작업에 막혀있는 것이다. 멀티스레딩이 직관적인 해결책처럼 보이지만, 유일한 방법은 아니다.

---

## 본문

> Responsiveness: multithreading can allow an application to remain responsive to input.
> In a one-thread program, if the main execution thread blocks on a long-running task, the entire application can appear to freeze.

"응답성: 멀티스레딩은 애플리케이션이 입력에 계속 응답할 수 있게 해준다. 싱글스레드 프로그램에서 메인 실행 스레드가 오래 걸리는 작업에 블로킹되면 애플리케이션 전체가 멈춘 것처럼 보일 수 있다."

JS에서 `while (true) { heavyComputation() }` 같은 코드가 메인 스레드에 있으면 브라우저가 멈추는 것이 이것이다.

> By moving such long-running tasks to a worker thread that runs concurrently with the main execution thread, it is possible for the application to remain responsive to user input while executing tasks in the background.

"이런 오래 걸리는 작업을 메인 실행 스레드와 동시에 실행되는 워커 스레드로 옮기면, 백그라운드에서 작업을 실행하면서도 사용자 입력에 응답성을 유지할 수 있다."

브라우저에서 CPU 집약 작업 → Web Worker로 분리. 이것이 멀티스레딩 해결책이다.

> On the other hand, in most cases multithreading is not the only way to keep a program responsive, with non-blocking I/O and/or Unix signals being available for obtaining similar results.

"반면, 대부분의 경우 멀티스레딩이 프로그램 응답성을 유지하는 유일한 방법은 아니다 — 논블로킹 I/O와/또는 Unix 시그널로도 유사한 결과를 얻을 수 있다."

- **non-blocking I/O**: I/O 작업을 기다리지 않고 완료 콜백을 등록하고 바로 리턴. 이벤트 루프가 나머지를 처리.

---

## 종합

오래 걸리는 작업의 종류에 따라 해결책이 다르다:

| 작업 종류 | 멀티스레딩 | 논블로킹 I/O |
|---|---|---|
| CPU 집약 (이미지 처리, 암호화) | Web Worker (브라우저), Worker Threads (Node.js) | 효과 없음 (CPU를 계속 써야 함) |
| I/O 집약 (파일 읽기, API 호출) | 가능하지만 과함 | `fetch`, `async/await`, `fs.readFile()` |

Node.js가 싱글스레드이면서도 응답성이 좋은 이유 — 대부분의 작업이 I/O 집약이고, 논블로킹 I/O + 이벤트 루프로 충분하다. CPU 집약 작업이 필요할 때만 Worker Threads를 꺼낸다.

---

# 멀티스레드 프로그램이 본질적으로 테스트하기 어려운 이유와, 이를 완화하는 설계 패턴은?

## 도입

멀티스레드 코드는 같은 입력이 주어져도 실행할 때마다 결과가 다를 수 있다. 스레드 전환 타이밍이 OS 스케줄러에 달려있어서 결정론적(deterministic)이지 않기 때문이다.

---

## 본문

> Being untestable: In general, multithreaded programs are non-deterministic, and as a result, are untestable.

"테스트 불가: 일반적으로 멀티스레드 프로그램은 비결정적이라 테스트할 수 없다."

- **non-deterministic**: 같은 입력 → 같은 출력이 보장되지 않는 것. 스레드 전환 타이밍에 따라 결과가 달라질 수 있다.

> In other words, a multithreaded program can easily have bugs which never manifest on a test system, manifesting only in production.

"즉, 멀티스레드 프로그램은 테스트 시스템에서는 절대 나타나지 않다가 프로덕션에서만 나타나는 버그를 쉽게 가질 수 있다."

테스트 환경(부하 적음, 코어 수 다름)과 프로덕션(높은 부하, 다른 코어 수)에서 스레드 전환 타이밍이 다르게 나타난다. 테스트에서 수천 번 통과해도 프로덕션에서 처음으로 레이스 컨디션이 발현될 수 있다.

> This can be alleviated by restricting inter-thread communications to certain well-defined patterns (such as message-passing).

"이는 스레드 간 통신을 잘 정의된 특정 패턴(메시지 패싱 같은)으로 제한함으로써 완화할 수 있다."

- **message-passing**: 공유 메모리 대신 메시지를 주고받는 방식. 스레드들이 직접 메모리를 공유하지 않고 채널을 통해 값 복사본을 전달한다. 공유 상태가 없으면 레이스 컨디션이 없다.

**JS/브라우저 예시:**

Web Worker의 `postMessage()` — 메인 스레드와 Worker가 메모리를 공유하지 않고 메시지를 복사해서 전달한다. Erlang의 액터 모델도 같은 원리다.

---

## 종합

멀티스레드 프로그램이 테스트하기 어려운 이유: 비결정성. 타이밍에 의존하는 버그는 재현이 어렵다.

완화 전략:
- **메시지 패싱**: 공유 상태를 없애 레이스 컨디션 발생 조건 자체를 제거.
- **불변 데이터**: 읽기 전용 데이터는 동시 접근해도 안전.
- **액터 모델**: Erlang처럼 각 스레드(액터)가 자신의 상태만 갖고 메시지로 통신.
- **싱글스레드 이벤트 루프**: Node.js처럼 아예 멀티스레드를 쓰지 않는 설계.

---

# GIL(Global Interpreter Lock)이란 무엇이며, 멀티코어 환경에서 어떤 한계를 만드는가?

## 도입

Python이나 Ruby를 쓰다 보면 멀티스레딩을 해도 멀티코어를 제대로 활용하지 못한다는 이야기를 듣는다. 그 원인이 GIL이다. Node.js와는 다른 메커니즘이므로 구분이 필요하다.

---

## 본문

> A few interpreted programming languages have implementations (e.g., Ruby MRI for Ruby, CPython for Python) which support threading and concurrency but not parallel execution of threads, due to a global interpreter lock (GIL).

"일부 인터프리터 언어 구현(Ruby의 MRI, Python의 CPython)은 전역 인터프리터 락(GIL)으로 인해 스레딩과 동시성은 지원하지만 스레드의 병렬 실행은 지원하지 않는다."

- **GIL (Global Interpreter Lock)**: 인터프리터 전체에 걸린 단 하나의 뮤텍스. 이 락을 잡은 스레드만 Python/Ruby 코드를 실행할 수 있다.

> The GIL is a mutual exclusion lock held by the interpreter that can prevent the interpreter from simultaneously interpreting the application's code on two or more threads at once.

"GIL은 인터프리터가 보유한 상호 배제 락으로, 인터프리터가 두 개 이상의 스레드에서 동시에 애플리케이션 코드를 인터프리트하는 것을 막을 수 있다."

스레드를 10개 만들어도 GIL이 있는 동안 Python 코드는 한 번에 하나의 스레드만 실행한다.

> This effectively limits the parallelism on multiple core systems.
> It also limits performance for processor-bound threads (which require the processor), but doesn't effect I/O-bound or network-bound ones as much.

"이는 멀티코어 시스템에서 병렬성을 효과적으로 제한한다. CPU 바운드 스레드(프로세서가 필요한)의 성능을 제한하지만, I/O 바운드나 네트워크 바운드에는 그만큼 영향을 주지 않는다."

왜 I/O 바운드는 덜 영향받는가? I/O 대기 중에는 GIL을 잠깐 풀어주기 때문이다. I/O를 기다리는 동안 다른 스레드가 GIL을 잡고 Python 코드를 실행할 수 있다.

---

## 종합

GIL과 Node.js의 싱글스레드는 다르다:

| | CPython GIL | Node.js 싱글스레드 |
|---|---|---|
| 멀티스레드 지원 | O (스레드 만들 수 있음) | O (Worker Threads) |
| 멀티코어 병렬 실행 | X (GIL로 막힘) | O (Worker Threads 사용 시) |
| 설계 의도 | 멀티스레드를 지원하려다 GIL로 안전성 확보 | 처음부터 싱글스레드 이벤트 루프 설계 |
| CPU 바운드 한계 | 있음 | 있음 (메인 루프는 싱글스레드) |

CPython은 "멀티스레드를 지원하되 GIL로 인해 사실상 싱글스레드처럼 동작". Node.js는 "설계상 싱글스레드이고, 필요하면 Worker Threads로 명시적 병렬성". GIL 없는 Python은 PyPy나 CPython 3.12+의 per-interpreter GIL, 또는 `multiprocessing`으로 우회한다.
