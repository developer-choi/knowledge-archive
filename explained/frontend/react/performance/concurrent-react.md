# Concurrent React란 무엇인가? (React v18 공식 발표)

## 도입

React 18 이전까지는 렌더링이 한 번 시작되면 중간에 끊을 수 없었다. 무거운 컴포넌트가 CPU를 점유하는 동안 사용자의 키 입력이나 클릭은 처리되지 못하고 대기했다. Concurrent React는 이 "중단 불가 렌더링" 문제를 해결하기 위해 React가 렌더링 작업 자체를 인터럽트 가능하게 만든 내부 모델이다.

---

## 본문

> In React 18, we added support for concurrency. When concurrency is enabled, React is able to interrupt, pause, resume, or abandon a render.

"React 18에서는 동시성(concurrency) 지원을 추가했다. 동시성이 활성화되면 React는 렌더링을 인터럽트하거나, 일시 정지하거나, 재개하거나, 버릴 수 있다."

- **concurrency**: 복수의 작업을 물리적으로 동시에 처리하는 병렬(parallel)과 다르다. 한 번에 하나씩 처리하되, 우선순위에 따라 실행 순서를 조율한다. OS의 선점형 스케줄링과 구조적으로 같다 — CPU가 하나라도 여러 프로세스를 번갈아 실행하는 것처럼, React는 하나의 메인 스레드에서 렌더링 작업을 중단·재개하며 관리한다.
- **interrupt / pause / resume / abandon**: 네 동사가 각각 다른 상황이다. 높은 우선순위 업데이트(사용자 입력)가 들어오면 진행 중인 렌더링을 interrupt하고, 낮은 우선순위 작업은 pause 상태에 두었다가 나중에 resume한다. 더 이상 필요 없으면 abandon(폐기)한다.

```
기존 렌더링 모델 (동기, 중단 불가)
input 클릭 ──────→ [===SlowList 렌더링===] → input 반응
                         ↑ 이 구간 동안 input 이벤트 블로킹

Concurrent 렌더링 모델
input 클릭 ──────→ [=SlowList 렌더링 시작=]
                          ↓ input 이벤트 감지 → interrupt
                    [input 업데이트 즉시 처리]
                          ↓ 완료
                    [SlowList 렌더링 재개 또는 폐기]
```

---

## 종합

Concurrent React의 핵심은 React 내부에 우선순위 기반 스케줄러를 도입한 것이다. 사용자 입력처럼 즉각 반응이 필요한 업데이트는 높은 우선순위를 부여하고, 무거운 목록 렌더링 같은 작업은 낮은 우선순위로 백그라운드에서 처리된다. 이 모델이 없으면 입력창에 타이핑할 때마다 UI가 끊기는 janky 경험이 생긴다. `useTransition`, `useDeferredValue`, `<Suspense>`는 모두 이 Concurrent 모델 위에서 동작하는 API다.

---

---

# React 18의 concurrent rendering 도입 전략은 어떻게 설계되었는가? (The Plan for React 18)

## 도입

React 팀은 Concurrent Mode라는 이름으로 동시성 기능을 준비했지만, 실제 출시 전략은 크게 달라졌다. 점진적 채택을 가능하게 하기 위해 "Mode" 전환 방식 대신 개별 기능 단위로 opt-in하는 방향을 택했다. 이 전략의 핵심은 기존 코드를 건드리지 않아도 React 18로 업그레이드할 수 있도록 하는 것이었다.

---

## 본문

React 18 팀이 발표한 핵심 설계 원칙은 두 가지다.

첫째, **점진적 채택(gradual adoption)**. `createRoot`로 전환하기만 해도 React 18의 기반이 적용되지만, Concurrent 기능(`useTransition`, `useDeferredValue` 등)은 사용자가 명시적으로 호출해야만 활성화된다. 기존 `useState`·`useEffect` 코드는 그대로 동작한다.

둘째, **Concurrent Features vs Concurrent Mode**. 초기 계획은 애플리케이션 전체를 "Concurrent Mode"로 전환하는 것이었다. 그러나 이 방식은 라이브러리 호환성과 마이그레이션 부담이 너무 컸다. 대신 개별 기능(features) 단위로 선택적 도입이 가능하도록 API를 설계했다.

---

## 종합

이 전략의 실무적 의의는 "React 18 = 전면 리팩토링 필요"가 아니라는 것이다. `createRoot` 한 줄 변경으로 기반을 올린 뒤, 성능 병목이 실제로 발생하는 컴포넌트에만 `useTransition`·`useDeferredValue`를 선택적으로 적용할 수 있다. 기존 동기 렌더링 코드도 React 18에서 그대로 작동한다.

---

---

# "Concurrent Mode"는 왜 사라지고 "Concurrent Features"로 바뀌었는가?

## 도입

React 실험 버전에서는 `ReactDOM.unstable_ConcurrentMode`나 `createRoot` 전환으로 앱 전체를 하나의 "모드"로 바꾸는 방식이 제안됐다. 그러나 이 "All-or-Nothing" 접근은 생태계 라이브러리들이 Concurrent Mode에서 제대로 동작하는지 검증해야 한다는 부담을 만들었다.

---

## 본문

React 팀이 공개한 논의에서 핵심은 다음과 같다.

"Concurrent Mode"는 앱 전체에 동시성을 활성화하는 단일 전환 스위치였다. 문제는 이 스위치를 켜면 라이브러리 하나라도 Concurrent 환경에서 버그가 있으면 전체 앱이 영향을 받는다는 것이었다. 특히 외부 상태 관리 라이브러리(예: `unstable_batchedUpdates`에 의존하는 코드)는 Concurrent Mode에서 tearing(화면 상태 불일치) 현상이 발생할 수 있었다.

"Concurrent Features"로의 전환은 이 문제를 해결한다. 동시성 기능은 API 호출 단위로만 활성화된다. `useTransition`을 쓰는 컴포넌트만 Concurrent 스케줄링 대상이 되고, 나머지는 이전과 동일하게 동기 렌더링으로 처리된다.

---

## 종합

이 변화는 React 생태계 전략의 실용적 선택이다. 모든 라이브러리가 Concurrent 준비를 마칠 때까지 기다리는 대신, 준비된 부분만 선택적으로 동시성의 이점을 누릴 수 있도록 했다. 개발자 입장에서는 `useTransition`과 `useDeferredValue`가 명시적 opt-in 포인트다 — 이것들을 쓰는 순간 해당 업데이트가 Concurrent 스케줄러 아래 들어간다.

---

---

# React 19의 stylesheet 지원은 어떻게 동작하는가?

## 도입

React 19 이전에는 컴포넌트가 특정 CSS를 필요로 해도 React 자체가 그 CSS의 로딩 순서를 보장할 방법이 없었다. CSS를 `<link>`로 직접 삽입하거나, CSS-in-JS 런타임에 의존하는 형태였다. React 19는 `<link rel="stylesheet">`를 컴포넌트 내부에서 선언할 수 있게 하고, 렌더링 전에 해당 스타일시트가 로드됨을 보장한다.

---

## 본문

> Stylesheets, both those with explicit precedence and those without, now receive special treatment in React.

"스타일시트 — 명시적 우선순위를 가진 것과 그렇지 않은 것 모두 — 이제 React에서 특별하게 처리된다."

- **precedence**: 여러 스타일시트가 있을 때 어떤 것이 먼저 적용될지를 결정하는 순서. React 19에서는 `precedence` prop으로 이 순서를 선언할 수 있다.
- **special treatment**: React가 스타일시트의 삽입 위치(`<head>`), 중복 제거, 로딩 완료 대기를 자동으로 처리한다는 뜻이다.

동작 방식은 두 단계다. 첫째, Suspense와 연동되어 스타일시트가 로드되기 전까지 해당 컴포넌트 트리의 렌더링을 블로킹한다. 둘째, 같은 `href`의 스타일시트가 여러 컴포넌트에서 선언되어도 중복 삽입 없이 한 번만 로드한다.

```jsx
function ComponentWithStyle() {
  return (
    <>
      <link rel="stylesheet" href="/component.css" precedence="default" />
      <div className="styled-content">...</div>
    </>
  );
}
```

---

## 종합

이 기능의 실무 의의는 컴포넌트와 스타일을 진정한 의미에서 함께 캡슐화할 수 있다는 것이다. 기존에는 `globals.css`에 몰아넣거나 CSS-in-JS 런타임 비용을 감수해야 했다. React 19의 stylesheet 지원은 정적 CSS 파일을 컴포넌트 단위로 선언하면서도 로딩 순서와 중복 제거를 React가 보장해준다. 없으면 FOUC(Flash of Unstyled Content) 위험이 남아있다.

---

---

# UI runtime 관점에서 React의 concurrent rendering은 어떻게 이해할 수 있는가?

## 도입

React를 "뷰 라이브러리"로만 보면 concurrent rendering이 왜 필요한지 직관적으로 잡히지 않는다. Dan Abramov의 "React as a UI Runtime" 관점에서 보면 React는 호스트 환경(브라우저 DOM)과 React 요소 트리 사이를 중재하는 런타임이다. 이 중재자 위치에 스케줄러가 들어간 것이 concurrent rendering이다.

---

## 본문

UI 런타임으로서 React가 하는 일은 React 요소 트리를 호스트 트리(DOM)에 동기화하는 것이다. 이 동기화 작업은 두 단계로 나뉜다: **render 단계**(어떤 변경이 필요한지 계산)와 **commit 단계**(실제 DOM을 수정).

Concurrent rendering은 render 단계를 인터럽트 가능하게 만들었다. commit 단계는 여전히 동기(atomic)다 — DOM이 절반만 수정된 채로 사용자에게 노출되면 안 되기 때문이다.

```
React 요소 트리                 호스트 트리 (DOM)
<App>                            <div id="root">
  <Header />        ──sync──→     <header>...</header>
  <SlowList />   ─concurrent─→   <ul>...</ul>  ← 인터럽트 가능
  <Footer />        ──sync──→     <footer>...</footer>
```

- **render phase** (인터럽트 가능): fiber 트리 순회, diff 계산, effect 수집
- **commit phase** (인터럽트 불가): DOM 반영, layout effect 실행

---

## 종합

이 관점에서 보면 `useTransition`은 "render 단계의 우선순위를 낮춰달라"는 힌트이고, `useDeferredValue`는 "이 값의 render 단계를 뒤로 미뤄달라"는 힌트다. React 런타임이 스케줄러를 통해 이 힌트를 실행한다. 없으면 모든 상태 업데이트가 동등한 우선순위로 처리되어 무거운 렌더링이 경량 이벤트를 블로킹하는 구조가 된다.
