# M:1 스레딩 모델에서 멀티코어 CPU의 성능을 활용할 수 없는 이유는?

> An M:1 model implies that all application-level threads map to one kernel-level scheduled entity; the kernel has no knowledge of the application threads.
> One of the major drawbacks, however, is that it cannot benefit from the hardware acceleration on multithreaded processors or multi-processor computers: there is never more than one thread being scheduled at the same time.
> For example: If one of the threads needs to execute an I/O request, the whole process is blocked and the threading advantage cannot be used.

---

**도입**

M:1 모델은 "사용자 스레드 여러 개가 커널 스레드 1개에 묶이는" 구조입니다. 가벼움이 큰 장점이지만, 멀티코어 시대에는 치명적인 약점이 드러납니다 — 코어가 8개 있어도 동시에 1개의 스레드만 실행 가능. 왜 그런지 짚어봅니다.

---

**본문**

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

**종합**

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
