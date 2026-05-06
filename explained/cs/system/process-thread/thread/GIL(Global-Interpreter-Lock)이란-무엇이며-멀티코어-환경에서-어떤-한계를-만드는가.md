# GIL(Global Interpreter Lock)이란 무엇이며, 멀티코어 환경에서 어떤 한계를 만드는가?

> A few interpreted programming languages have implementations (e.g., Ruby MRI for Ruby, CPython for Python) which support threading and concurrency but not parallel execution of threads, due to a global interpreter lock (GIL).
> The GIL is a mutual exclusion lock held by the interpreter that can prevent the interpreter from simultaneously interpreting the application's code on two or more threads at once.
> This effectively limits the parallelism on multiple core systems.
> It also limits performance for processor-bound threads (which require the processor), but doesn't effect I/O-bound or network-bound ones as much.

---

**도입**

Python에서 멀티스레딩으로 4코어를 쓰려고 했더니 1코어 성능밖에 안 나오는 경험, Python 개발자라면 한 번씩 들어봤을 겁니다. 범인은 GIL — 인터프리터가 자체적으로 가진 큰 락 하나가 멀티스레드 병렬 실행을 막습니다. JS는 처음부터 단일 스레드 설계라 이 함정에 안 빠지는데, 그 차이를 짚어봅니다.

---

**본문**

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

**종합**

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
