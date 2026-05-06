# 싱글스레드 프로그램에서 오래 걸리는 작업이 UI를 멈추게 하는 문제를, 멀티스레딩 없이도 해결할 수 있는가?

> Responsiveness: multithreading can allow an application to remain responsive to input.
> In a one-thread program, if the main execution thread blocks on a long-running task, the entire application can appear to freeze.
> By moving such long-running tasks to a worker thread that runs concurrently with the main execution thread, it is possible for the application to remain responsive to user input while executing tasks in the background.
> On the other hand, in most cases multithreading is not the only way to keep a program responsive, with non-blocking I/O and/or Unix signals being available for obtaining similar results.

---

**도입**

브라우저에서 큰 파일 처리하는 동안 클릭이 안 먹는 경험, 다들 한 번씩 해봤을 겁니다. 이게 "메인 스레드 블로킹" 현상. 이 문제의 정통 해법은 멀티스레딩(작업을 다른 스레드로 보내기)이지만, 사실 더 가벼운 해법도 있습니다 — 논블로킹 I/O. JS 개발자는 매일 두 번째 해법을 쓰고 있죠.

---

**본문**

> Responsiveness: multithreading can allow an application to remain responsive to input.

응답성: 멀티스레딩은 애플리케이션이 입력에 응답할 수 있게 해준다.

- **Responsiveness**: 사용자 입력에 즉각 반응하는 능력. UI 멈춤 방지의 핵심 지표.
- **remain responsive to input**: 작업이 진행 중이어도 클릭·키 입력 등에 계속 반응 가능한 상태 유지.

> In a one-thread program, if the main execution thread blocks on a long-running task, the entire application can appear to freeze.

싱글스레드 프로그램에서, 메인 실행 스레드가 오래 걸리는 작업에서 블로킹되면 애플리케이션 전체가 멈춘 것처럼 보일 수 있다.

- **one-thread program**: 사용자 코드를 실행하는 스레드가 1개인 프로그램. JS, Python(GIL), Ruby 등.
- **blocks on a long-running task**: 메인 스레드가 긴 작업(이미지 처리, 큰 데이터 계산)에 매여 있는 상태. 이 동안에는 다른 코드가 실행될 틈이 없음.
- **appear to freeze**: "멈춘 것처럼 보임"이 핵심. 실제로는 작업 중이지만 사용자는 클릭 무반응 = 멈춤으로 인식.

> By moving such long-running tasks to a worker thread that runs concurrently with the main execution thread,

이런 오래 걸리는 작업을 메인 실행 스레드와 동시에 실행되는 워커 스레드로 옮기면,

- **worker thread**: 백그라운드 작업 전담 스레드. 메인 UI 스레드와 별개로 굴러감.
- **runs concurrently**: 동시에 진행. 1코어라면 시분할로, 멀티코어라면 진짜 병렬로 실행.

> it is possible for the application to remain responsive to user input while executing tasks in the background.

백그라운드에서 작업을 실행하면서도 애플리케이션이 사용자 입력에 응답할 수 있게 된다.

- **executing tasks in the background**: 메인 스레드는 입력 처리에만 집중하고, 무거운 일은 워커가 다른 스레드에서 처리.

> On the other hand, in most cases multithreading is not the only way to keep a program responsive,

반면 대부분의 경우 멀티스레딩만이 프로그램을 응답성 있게 유지하는 유일한 방법은 아니다.

- **multithreading is not the only way**: 의외의 단서. 응답성 = 멀티스레드라는 단순 등식을 부정.

> with non-blocking I/O and/or Unix signals being available for obtaining similar results.

논블로킹 I/O나 Unix 시그널이 비슷한 결과를 얻기 위해 사용 가능하기 때문이다.

- **non-blocking I/O**: 블로킹되지 않는 I/O API. 호출 즉시 반환되고, 완료는 콜백/이벤트로 통지. JS의 `fetch`, Node.js의 `fs.promises.readFile` 같은 것.
- **Unix signals**: 비동기 알림 메커니즘. 외부 이벤트 발생 시 핸들러 함수를 즉시 실행하게 함.

---

**종합**

문제와 두 가지 해법:

| 해법 | 메커니즘 | 적합한 작업 |
|---|---|---|
| 멀티스레딩 | 작업을 다른 스레드로 분리 | CPU 집약 (이미지 처리, 큰 계산) |
| 논블로킹 I/O | 호출은 즉시 반환, 완료는 콜백 | I/O 집약 (네트워크, 디스크) |

JS/브라우저로 매핑:

- **CPU 집약 작업** → Web Worker. 큰 JSON 파싱, 이미지 처리, 암호 계산 같은 건 Worker로 보내야 메인 스레드가 안 막힙니다.
- **I/O 집약 작업** → `fetch`/`async-await`. 네트워크 응답 대기는 메인 스레드를 묶어두지 않아도 됨. JS 엔진이 콜백 큐로 처리.

```js
// 나쁨 — 메인 스레드 블로킹
const result = heavyMathSync(bigArray); // CPU 집약, 1초 동안 UI 멈춤

// 해법 1 — Web Worker로 분리
const worker = new Worker('heavy.js');
worker.postMessage(bigArray);
worker.onmessage = (e) => updateUI(e.data); // 메인 스레드는 계속 응답

// 해법 2 — I/O는 비동기로
const data = await fetch('/api/data'); // 메인 스레드 안 막음
```

Node.js의 응답성 비밀: Node.js는 사용자 코드 입장에서 싱글스레드인데도 동시에 수만 요청을 처리합니다. 이유는 사용자 작업 대부분이 I/O이기 때문 — 모든 I/O를 논블로킹으로 처리하니, 한 요청이 DB 응답을 기다리는 동안 메인 스레드는 다른 요청을 처리. 만약 Node.js가 동기 I/O를 강제했다면 멀티스레드 모델 없이는 살아남지 못했을 거예요.

이게 없으면 어떻게 되는가 — 두 해법 모두 없다면: 모든 응답성을 위해 항상 새 OS 스레드가 필요. 그런데 OS 스레드는 메모리·전환 비용이 있으니, 동시 1만 작업 = 1만 스레드 = 시스템 한계. 논블로킹 I/O 덕분에 "단일 스레드가 1만 작업을 처리"하는 모델이 가능해진 것.

오개념 예방: "JS는 싱글스레드라 응답성이 떨어진다"는 부정확. JS의 응답성은 논블로킹 I/O + 이벤트 루프 모델로 잘 작동합니다. 다만 CPU 집약 작업은 약점이 맞아서, 그때만 Worker가 필요. **약점은 CPU 집약 작업이지 I/O 집약 작업이 아닙니다.**

AI Annotation 보충: 두 해법은 적용 영역이 다르고 자주 함께 씁니다. 예를 들어 이미지 업로드 사이트에서: 업로드 자체는 논블로킹 I/O (fetch), 업로드된 이미지의 썸네일 생성은 Web Worker. 어느 한쪽으로 다 풀려는 게 아니라, 작업 종류에 따라 도구를 고르는 것.
