# JSX란 무엇이며, HTML과 어떻게 다른가?

## 도입

React 코드를 처음 보면 HTML처럼 생긴 문법이 JS 파일 안에 있어 낯설다. 이것이 JSX다. HTML과 비슷하게 생겼지만 JS의 모든 표현식을 중괄호 `{}` 안에서 그대로 쓸 수 있다는 점에서 근본적으로 다르다.

---

## 본문

> JSX looks like HTML, but it can also write powerful features of Javascript.

"JSX는 HTML처럼 생겼지만, JavaScript의 강력한 기능들도 함께 작성할 수 있다."

- **looks like HTML**: 태그, 속성, 중첩 구조가 HTML과 유사하다. 그래서 브라우저가 이해할 것 같지만 그렇지 않다.
- **powerful features of Javascript**: 함수 호출, 조건식, 변수, 배열 순회 등 JS의 모든 표현식을 JSX 안에서 쓸 수 있다.

JSX가 HTML과 다른 점을 예시로 확인하면 명확하다:

```jsx
// 변수와 함수 호출
<div>{getValue()}</div>
<div>{someVariable}</div>

// 조건부 렌더링
<div>{isVisible ? <Foo /> : <Bar />}</div>

// attribute에 JS 표현식
<div className={someClassName}>...</div>

// 자식을 동적으로 구성
<div>{children}</div>
```

HTML에서는 이런 동적 표현식을 JSX처럼 쓸 수 없다. 값이 바뀌어도 HTML은 정적이기 때문이다.

---

## 종합

JSX는 UI 구조를 선언적으로 쓰면서 동시에 JS의 표현력을 활용할 수 있게 해준다. HTML이 "정적인 마크업"이라면 JSX는 "상태와 로직을 포함한 동적인 UI 묘사"다. 이 둘의 차이 때문에 브라우저는 JSX를 직접 실행하지 못한다 — 변환 과정이 필요하다.

---

# 브라우저는 JSX를 직접 실행할 수 있는가?

## 도입

JSX는 JS 문법 확장이지 브라우저 표준이 아니다. 브라우저 JS 엔진은 `<div>` 같은 태그 문법을 이해하지 못한다. 그래서 JSX를 브라우저가 실행하려면 반드시 일반 JS로 변환하는 단계가 먼저 있어야 한다.

---

## 본문

> But browsers don't understand JSX out of the box,
> so you'll need a JavaScript compiler, such as a Babel,
> to transform your JSX code into regular JavaScript.

"하지만 브라우저는 기본 상태로 JSX를 이해하지 못한다. 그래서 JSX 코드를 일반 JavaScript로 변환하기 위해 Babel 같은 JavaScript 컴파일러가 필요하다."

- **out of the box**: 별도 설정이나 도구 없이 기본 상태 그대로. 브라우저 자체에는 JSX 파서가 없다.
- **compiler**: 여기서는 Babel처럼 한 형태의 JS를 다른 형태의 JS로 변환하는 도구. JSX `<div>` → `React.createElement('div', ...)` 변환이 그 역할이다.
- **regular JavaScript**: 브라우저가 이해하는 표준 JS. `React.createElement` 호출 형태로 변환된다.

변환 결과를 직접 보면:

```jsx
// JSX (변환 전)
const element = <h1 className="greeting">Hello</h1>;

// 컴파일러가 변환한 결과 (일반 JS)
const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello'
);
```

---

## 종합

브라우저는 JSX를 이해하지 못하므로 Babel(또는 SWC, esbuild)이 빌드 시점에 JSX를 `React.createElement` 호출로 변환한다. Vite나 Next.js 같은 도구를 쓰면 이 변환이 자동으로 처리되어 개발자가 직접 신경 쓸 필요가 없다. JSX가 없으면 매번 `React.createElement`를 직접 작성해야 하므로 가독성이 크게 떨어진다.

```
JSX 코드         →  Babel/SWC 컴파일  →  React.createElement 호출  →  브라우저 실행
<div>Hello</div>  →  (변환)           →  createElement('div', ...) →  실제 DOM
```
