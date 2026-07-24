# JavaScript 코드가 실행되려면 어떤 두 소프트웨어가 협력해야 하며, 각각 무엇을 담당하는가?

## 도입

`console.log`를 찍으면 콘솔에 글자가 나오고, `fetch`로 서버 데이터를 받아오고, `document.querySelector`로 DOM을 만진다. 이 동작들을 전부 "JavaScript"가 한다고 뭉뚱그리기 쉽지만, 실제로는 성격이 다른 두 소프트웨어가 나눠 맡는다. 하나는 코드 자체를 읽고 실행하는 부분이고, 다른 하나는 바깥 세상(화면, 네트워크, 파일)과 이어주는 부분이다. 이 둘의 경계를 알아야 "왜 같은 V8인데 브라우저에선 `document`가 되고 Node에선 안 되는가" 같은 질문이 풀린다.

---

## 본문

> JavaScript execution requires the cooperation of two pieces of software: the JavaScript engine and the host environment.

의역: JavaScript를 실행하려면 두 개의 소프트웨어가 협력해야 한다. 바로 JavaScript 엔진과 호스트 환경이다.

- **execution**: 코드를 실제로 돌리는 것. 파일에 적힌 텍스트를 계산·동작으로 바꾸는 일.
- **cooperation**: 협력. 한쪽만으로는 안 되고 둘이 역할을 나눠 맡아야 한다는 뜻. 이 단어가 이 문장의 핵심이다. 엔진 홀로 JS를 완성하지 못한다.
- **host environment**: 호스트 환경. 엔진을 품어(host) 바깥 세상과 이어주는 쪽. 브라우저나 Node.js가 여기 해당한다.

> The JavaScript engine implements the ECMAScript (JavaScript) language, providing the core functionality. It takes source code, parses it, and executes it.

의역: JavaScript 엔진은 ECMAScript(=JavaScript) 언어 자체를 구현하며 핵심 기능을 제공한다. 소스 코드를 받아 해석하고 실행한다.

- **implements**: 구현한다. 명세(스펙)에 적힌 언어 규칙을 실제로 동작하는 프로그램으로 만들어낸다는 뜻. 변수, 함수, 객체, 연산자, `for`/`if` 같은 문법이 엔진의 몫이다.
- **ECMAScript**: JavaScript 언어의 공식 표준 이름. 엔진이 구현하는 대상은 이 표준까지다. `document`나 `fetch`는 이 표준에 없다(그래서 엔진의 일이 아니다).
- **parses**: 파싱한다. 텍스트로 된 소스 코드를 엔진이 이해할 수 있는 구조로 분해하는 단계.
- **core functionality**: 핵심 기능. 언어 그 자체, 곧 계산하고, 값을 저장하고, 함수를 호출하는 능력. 대표 엔진으로 Chrome·Node의 V8, Firefox의 SpiderMonkey가 있다.

> However, in order to interact with the outside world, such as to produce any meaningful output, to interface with external resources, or to implement security- or performance-related mechanisms, we need additional environment-specific mechanisms provided by the host environment.

의역: 하지만 바깥 세상과 상호작용하려면, 즉 눈에 보이는 출력을 내거나, 외부 자원과 연결하거나, 보안·성능 관련 장치를 두려면, 호스트 환경이 제공하는 그 환경 고유의 추가 장치가 필요하다.

- **interact with the outside world**: 바깥 세상과 상호작용. 엔진 안에서 계산만 하는 게 아니라 화면·네트워크·파일 같은 외부에 영향을 주고받는 것. 엔진만으로는 이게 안 된다.
- **meaningful output**: 의미 있는 출력. 콘솔 글자, 화면에 그려진 요소처럼 사람이 확인할 수 있는 결과. `console.log`조차 사실 호스트가 제공한다.
- **external resources**: 외부 자원. 서버(네트워크), 파일 시스템 등. `fetch`, Node의 `fs`가 이런 통로다.
- **environment-specific**: 환경마다 다른. 브라우저냐 서버냐에 따라 제공되는 장치가 달라진다는 뜻. `document`는 브라우저에만, `fs`는 Node에만 있는 이유가 이 단어에 담겨 있다.

> For example, the HTML DOM is the host environment when JavaScript is executed in a web browser. Node.js is another host environment that allows JavaScript to be run on the server side.

의역: 예를 들어 웹 브라우저에서 JavaScript가 실행될 때는 HTML DOM이 호스트 환경이고, Node.js는 JavaScript를 서버 쪽에서 돌릴 수 있게 해주는 또 다른 호스트 환경이다.

- **HTML DOM**: 브라우저가 웹 문서를 객체로 표현한 것. 브라우저라는 호스트가 엔진에게 넘겨주는 대표적 장치.
- **server side**: 서버 쪽. 브라우저 없이 컴퓨터에서 JavaScript를 돌리는 환경. 같은 언어라도 호스트가 다르면 할 수 있는 일이 달라진다.

엔진과 호스트가 각각 무엇을 제공하는지 나란히 놓으면 경계가 뚜렷해진다.

```
             JS 엔진 (V8, SpiderMonkey)   │   호스트 환경 (브라우저 / Node.js)
─────────────────────────────────────────┼──────────────────────────────────────
 담당       ECMAScript 언어 자체           │   바깥 세상과의 연결
 제공        변수·함수·객체·연산자          │   브라우저: document, DOM, fetch,
             파싱 → 실행                   │             setTimeout, console
             Memory Heap / Call Stack      │   Node.js: fs, http, process,
                                           │            setTimeout, console
 표준        ECMAScript 명세               │   각 환경의 자체 명세 (WHATWG DOM 등)
 어디에      브라우저·Node 공통             │   환경마다 다름
─────────────────────────────────────────┴──────────────────────────────────────
        같은 V8이라도 어느 호스트에 얹히느냐에 따라
        브라우저에선 document, Node에선 fs 로 달라진다
```

주의할 점이 하나 있다. `setTimeout`, DOM, `fetch` 같은 것을 "JavaScript 엔진(또는 JS 런타임)의 기능"으로 묶어 생각하기 쉬운데, 표준상 이들은 엔진이 아니라 호스트 환경이 제공하는 장치다. 엔진이 구현하는 것은 ECMAScript 명세까지이고, `setTimeout`은 그 명세에 없다. 브라우저·Node가 각자 붙여준 것이다. 그래서 `setTimeout`은 브라우저와 Node 양쪽에 다 있지만(각 호스트가 따로 제공), `document`는 브라우저에만, `fs`는 Node에만 있다.

---

## 종합

JavaScript 한 줄이 동작하기까지는 성격이 다른 두 소프트웨어가 역할을 나눈다. 엔진은 언어 그 자체, 곧 코드를 파싱하고 실행하며 변수·함수·객체를 다루는 계산 능력을 담당한다. 하지만 엔진은 바깥 세상을 모른다. 화면에 글자를 찍는 일도, 서버에서 데이터를 받는 일도, 타이머를 재는 일도 엔진 혼자서는 못 한다. 그래서 엔진을 품은 호스트 환경이 그 환경 고유의 통로(브라우저의 DOM·`fetch`, Node의 `fs`·`http`)를 얹어준다.

이 경계가 실무에서 드러나는 지점이 "같은 V8인데 왜 되고 안 되는가"다. Chrome과 Node는 똑같은 V8 엔진을 쓰지만, 얹힌 호스트가 다르기 때문에 브라우저에선 `document`가 있고 Node에선 `fs`가 있다. 언어(엔진)는 같아도 바깥과의 연결(호스트)이 다른 것이다. 만약 호스트 없이 엔진만 있다면 계산은 되지만 그 결과를 밖으로 내보낼 방법이 전혀 없어, 실질적으로 아무 쓸모가 없다. 두 소프트웨어의 "협력"이 강조되는 이유가 여기에 있다.

---

# [UNVERIFIED] Q1. Javascript는 싱글스레드의 한계를 어떻게 극복했을까?

## 도입

JS 엔진(V8) 자체는 싱글 스레드다 — Call Stack이 하나뿐이라 한 번에 하나의 코드만 실행한다. 무거운 함수가 돌고 있으면 그것이 끝날 때까지 아무것도 할 수 없다. 그럼에도 브라우저가 API 응답을 기다리면서 동시에 애니메이션을 돌리고 클릭을 처리할 수 있는 이유는, JS 엔진 바깥에 비동기를 가능하게 하는 구조가 있기 때문이다.

---

## 본문

JS 런타임은 OA 없이 실무 원칙으로 정리한다.

```
JS Runtime 구조 (브라우저 기준)

┌──────────────── JS 엔진 (V8) ────────────────┐
│                                              │
│  Memory Heap           Call Stack            │
│  ┌─────────┐          ┌─────────────┐       │
│  │ 객체,    │          │ 현재 실행 중 │       │
│  │ 변수 등  │          │ 함수들 (LIFO)│       │
│  └─────────┘          └─────────────┘       │
└──────────────────────────────────────────────┘
         ↕ JS 엔진이 직접 못 하는 일은 여기로
┌──────────────── Web APIs (브라우저) ──────────┐
│  DOM  │  AJAX (fetch/XHR)  │  setTimeout     │
│       │  기타 비동기 I/O     │                 │
└───────────────────────────┬──────────────────┘
                             ↓ 완료 시
               ┌─────────────────────────────┐
               │  Callback Queue (Macrotask) │
               │  Microtask Queue           │
               └──────────────┬─────────────┘
                               ↓
               ┌───────────────────────────┐
               │  Event Loop               │
               │  (Call Stack 비면 큐에서   │
               │   꺼내 Call Stack에 추가)  │
               └───────────────────────────┘
```

비동기와 콜백이 핵심 해법이다:
- `setTimeout(task, 10000)` → 10초 카운트는 Web API가 담당. JS 엔진은 즉시 다음 코드로.
- 10초 후 → task를 Callback Queue에 추가.
- Event Loop가 Call Stack이 비어있음을 확인하면 → task를 Call Stack에 올려 실행.

```js
console.log('1: 시작');

setTimeout(() => {
  console.log('3: setTimeout 콜백'); // Web API에서 처리 → Queue → 나중에 실행
}, 0);

console.log('2: 끝');

// 출력: 1: 시작 → 2: 끝 → 3: setTimeout 콜백
// setTimeout(fn, 0)도 즉시 실행이 아님 — Queue를 거쳐야 함
```

작은 함수로 분리하는 이유도 여기서 나온다. Call Stack에 오래 걸리는 함수가 있으면 그것이 끝날 때까지 Queue의 콜백을 꺼낼 수 없다. 따라서 무거운 작업은 잘게 쪼개 여러 태스크로 분산시켜야 Event Loop가 중간중간 렌더링과 이벤트 처리를 할 수 있다.

```js
// 나쁜 예 — Call Stack 독점
for (let i = 0; i < 1e9; i++) { /* 무한 루프 */ }
// 이 동안 브라우저는 아무것도 못 함

// 좋은 예 — 태스크 분산
function chunkedWork(start, end, step) {
  return new Promise(resolve => {
    function next(i) {
      if (i >= end) { resolve(); return; }
      // 작업 수행
      processItem(i);
      // 다음 청크를 다음 태스크로 미룸 — 사이에 렌더링 가능
      setTimeout(() => next(i + step), 0);
    }
    next(start);
  });
}
```

---

## 종합

JS가 싱글 스레드임에도 논블로킹 비동기 처리가 가능한 것은 V8 엔진 자체가 아니라, V8을 둘러싼 런타임(브라우저의 Web API, Node.js의 libuv)이 비동기 작업을 대신 처리해주기 때문이다. "서버에서 데이터가 오면 이 함수를 실행해줘! 난 그동안 다른 거 할게" — 이것이 비동기 + 콜백 모델의 핵심이다. Call Stack이 비어있어야 Queue에서 콜백을 꺼낼 수 있으므로, 오래 걸리는 작업을 Call Stack에 놔두면 Queue에 쌓인 콜백이 아무리 많아도 실행될 수 없다.
