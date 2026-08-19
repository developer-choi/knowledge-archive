# react-native-webview에서 앱 코드와 웹뷰 안의 웹 페이지는 어느 방향으로 무엇을 주고받는가?

## 도입

앱 안에 웹 화면을 띄우는 구조에서는, 앱 코드와 그 안에 뜬 웹 페이지가 서로 다른 실행 환경에 산다. 브라우저 탭이 각자 격리된 채로 돌고 그 사이를 별도의 통로로만 오가는 것과 같은 그림이다.

읽기 전에 두 낱말만 구분해두면 된다. **prop**은 앱 쪽에서 `<WebView ... />` 컴포넌트에 넘기는 속성이고, **method**는 그 컴포넌트를 가리키는 참조(ref)에 대고 원하는 시점에 부르는 함수다. 이 둘의 차이가 웹 코드에 그대로 영향을 준다. 속성으로 넘기는 쪽은 페이지가 뜰 때 한 번 실행되고, 함수로 부르는 쪽은 앱이 원할 때마다 몇 번이든 실행되기 때문이다.

---

## 본문

### 통로는 세 갈래다

> 1. React Native -> Web: The `injectedJavaScript` prop
> 2. React Native -> Web: The `injectJavaScript` method
> 3. Web -> React Native: The `postMessage` method and `onMessage` prop

앱에서 웹으로 가는 길이 둘, 웹에서 앱으로 가는 길이 하나다.

- **prop** vs **method**: 앞의 둘이 이 축으로 갈린다. 속성으로 걸어두는 쪽은 앱이 실행 시점을 못 고르고, 참조에 대고 부르는 쪽은 고른다.

### 앱 → 웹: 페이지가 뜰 때 한 번 도는 코드

> This is a script that runs immediately after the web page loads for the first time.

웹 페이지가 처음 로드된 **직후에** 실행되는 스크립트다.

- **immediately after**: 로드가 끝난 바로 그때. "직전"이 아니라 "직후"라는 점이 뒤에 나올 갈래와 갈리는 지점이다.
- **for the first time**: 처음 로드될 때. 두 번째부터는 해당 없다는 뜻을 이미 품고 있다.

> It only runs once, even if the page is reloaded or navigated away.

페이지를 새로고침하거나 다른 주소로 이동해도 **딱 한 번만** 실행된다.

- **only ... once**: 이 갈래의 결정적 한계다. 앱 상태가 바뀔 때마다 웹에 알리는 용도로는 못 쓴다.
- **navigated away**: 웹뷰 안에서 다른 페이지로 넘어간 경우.

> An `onMessage` event is required as well to inject the JavaScript code into the WebView.

이 코드 주입이 동작하려면 앱 쪽에 `onMessage`도 함께 달려 있어야 한다.

- **required as well**: 이 갈래를 쓰려면 반대 방향(웹→앱) 통로용 속성도 같이 있어야 한다는 뜻이다. 세 번째 질문에서 다시 마주친다.

### 앱 → 웹: 웹 코드보다 먼저 도는 코드

> This is a script that runs **before** the web page loads for the first time.

웹 페이지가 로드되기 **전에** 실행되는 스크립트다. 앞 갈래와 이름이 거의 같고 뒤에 `BeforeContentLoaded`만 붙는데, 그 꼬리가 실행 시점 전체를 뒤집는다.

> This is useful if you want to inject anything into the window, localstorage, or document prior to the web code executing.

웹 코드가 돌기 전에 `window`·`localStorage`·`document`에 무언가를 심어두고 싶을 때 쓸모가 있다.

- **prior to the web code executing**: 웹 번들의 첫 줄보다 앞선다는 뜻이다. 웹 입장에서는 "내 코드가 시작될 때 이미 값이 거기 있다"가 된다.

> In this case, the value of `window.isNativeApp` will be set to true before the web code executes.

이 경우 `window.isNativeApp`이 웹 코드 실행 전에 `true`로 설정돼 있다.

웹 쪽에서 "지금 앱 안에서 뜬 화면인가, 그냥 브라우저인가"를 가르는 분기를 최상단에서 바로 쓸 수 있다는 뜻이다.

```js
// 웹 번들 최상단
if (window.isNativeApp) {
  hideHeader(); // 앱이 자체 헤더를 그리므로 웹 헤더는 숨긴다
}
```

### 앱 → 웹: 앱이 원할 때마다 부르는 수단

> While convenient, the downside to the previously mentioned `injectedJavaScript` prop is that it only runs once.

앞의 속성 방식은 편리하지만, 한 번만 실행된다는 단점이 있다.

- **downside**: 편의의 대가. 앱 상태가 바뀔 때마다 웹에 알리는 일을 못 한다.

> That's why we also expose a method on the webview ref called `injectJavaScript` (note the slightly different name!).

그래서 웹뷰 참조에 `injectJavaScript`라는 메서드도 함께 제공한다. 이름이 미세하게 다르다는 점에 주의하라는 경고가 원문에 붙어 있다.

- **slightly different name**: `injectedJavaScript`(과거분사)는 속성이고 `injectJavaScript`(동사원형)는 메서드다. 글자 두 개 차이라 문서를 읽을 때 어느 쪽 이야기인지 놓치기 쉽다.

이 메서드가 하는 일은 자바스크립트 **코드 문자열**을 웹뷰 안에서 실행시키는 것이다. 이 점이 다음 소주제의 전제가 된다.

### 앱이 웹의 함수를 부르는 모양

공식 가이드에 "웹이 만든 함수를 앱이 이름으로 호출한다"는 API는 없다. 있는 것은 방금 본 "코드 문자열을 웹뷰 안에서 실행시키는 수단"뿐이다. 그래서 실무에서는 웹이 전역에 함수를 걸어두고, 앱이 그 함수를 부르는 코드를 문자열로 밀어 넣는 모양이 된다.

```js
// 웹 코드: 앱이 부를 수 있도록 전역에 함수를 건다
window.onPermissionChanged = (state) => {
  setPushEnabled(state === 'granted');
};
```

앱 쪽은 `window.onPermissionChanged("granted"); true;` 라는 문자열을 웹뷰 안에서 실행시킨다. 이 용도는 한 번만 도는 속성 방식으로는 성립하지 않는다. 권한 값은 사용자가 설정을 바꿀 때마다 갱신돼야 하므로, 여러 번 부를 수 있는 메서드 쪽이어야 한다.

여기서 앱의 알림 권한 설정값처럼 "앱만 아는 값"을 웹이 받아 쓰는 실제 경로가 나온다.

- 초기값: 웹 코드가 뜨기 전에 심는다(로드 전 주입).
- 이후 변경: 앱이 위 방식으로 함수를 불러 알린다.

주입하는 코드 문자열의 마지막 줄이 `true;`여야 한다는 규칙도 함께 붙는다. 원문 예제에 달린 주석이 이유를 말한다.

> true; // note: this is required, or you'll sometimes get silent failures

- **silent failures**: 에러도 안 나고 그냥 아무 일도 일어나지 않는 실패. 원인을 찾기 가장 나쁜 종류라 원문이 굳이 주석으로 못 박아뒀다.

### 앱 → 웹: 코드 대신 값을 넘기는 갈래

> Due to the Android race condition mentioned above, this more reliable prop was added.

위에서 언급한 안드로이드 쪽 실행 순서 문제 때문에, 더 믿을 만한 속성이 추가됐다.

- **race condition**: 두 동작의 도착 순서가 보장되지 않아 결과가 그때그때 달라지는 상황. 코드를 주입하는 방식은 "웹 코드보다 먼저 도착한다"가 항상 지켜지지는 않았다는 뜻이다.
- **more reliable**: 그래서 순서에 기대지 않는 방식을 따로 만들었다.

> While you cannot execute arbitrary JavaScript, you can make an arbitrary JS object available to the JS run in the webview prior to the page load completing.

임의의 자바스크립트를 실행시킬 수는 없지만, 임의의 JS 객체를 페이지 로드가 끝나기 전에 웹뷰 안의 JS가 쓸 수 있도록 놓아둘 수는 있다.

- **arbitrary JavaScript** vs **arbitrary JS object**: 앞은 코드, 뒤는 값이다. 이 갈래는 "코드를 실행"이 아니라 "값을 놓아둠"이라 실행 순서 다툼이 아예 생기지 않는다.

> Note: `ReactNativeWebView.injectedObjectJson()` returns the JSON encoded object passed in to `injectedJavaScriptObject`.

`ReactNativeWebView.injectedObjectJson()`은 앱이 넘긴 객체를 JSON으로 인코딩한 **문자열**을 돌려준다.

> It must be passed to `JSON.parse` before its properties can be accessed (but it may be `undefined`!).

속성에 접근하려면 먼저 `JSON.parse`에 넘겨야 하며, `undefined`일 수도 있다.

- **may be `undefined`**: 앱이 값을 안 넘겼거나 아직 없는 경우. 그래서 원문 예제가 파싱 전에 존재 여부부터 확인한다.

웹 쪽에서 값을 꺼내는 원문 예제다.

```html
<html>
  <head>
    <script>
      window.onload = (event) => {
        if (window.ReactNativeWebView.injectedObjectJson()) {
          document.getElementById('output').innerHTML = JSON.parse(
            window.ReactNativeWebView.injectedObjectJson(),
          ).customValue;
        }
      };
    </script>
  </head>
  <body>
    <p id="output">undefined</p>
  </body>
</html>
```

화면에 처음 찍혀 있는 글자가 `undefined`인 것도 우연이 아니다. 앱이 값을 안 넘겼으면 그대로 남는다.

값이 객체가 아니라 문자열로 건너오므로 웹이 직접 파싱해야 하고, 없을 수 있으므로 곧장 `JSON.parse`에 넣지 않고 존재부터 확인한다.

### 웹 쪽에서 이게 왜 중요한가: 최상단에서 읽어도 되는가

웹 코드가 앱이 심어준 값을 번들 최상단에서 바로 읽어도 되는지는, 앱이 **어느 수단으로 심었느냐**에 달려 있다.

```
[로드 전에 심은 경우]
  앱이 값·코드 심음 ──→ 웹 번들 첫 줄 실행
                          └─ 값이 이미 있다 → 그냥 읽으면 됨

[로드 후에 심은 경우]
  웹 번들 첫 줄 실행 ──→ 앱이 값·코드 심음
   └─ 아직 없다                 └─ 이제야 도착
      → undefined                  → 기다린 쪽이 받는다
```

로드 전에 심는 수단이면 최상단에서 바로 읽어도 되지만, 로드 후에 심는 수단이면 최상단에서는 `undefined`가 나온다. 웹에서는 이게 "가끔 `undefined`가 나온다"는 증상으로만 보인다. 기기가 빠르면 되고 느리면 안 되는 식이라 코드를 아무리 들여다봐도 원인이 안 잡힌다. 그래서 값을 못 읽었을 때 앱이 나중에 알려줄 때까지 기다리는 구조가 필요하다.

```js
// 로드 후에 심어지는 값이면, 최상단에서 읽는 대신 도착을 기다린다
let pushState = null;
window.onPermissionChanged = (state) => {
  pushState = state; // ← 앱이 이 함수를 부르는 시점에 비로소 채워진다
  render();
};
```

### 곁가지: `window.<이름>.<메서드>` 형태의 유래

안드로이드 네이티브에는 앱이 정한 이름을 웹의 `window`에 얹는 별도 방식이 있다.

> Applications should use the Android Native API `addJavascriptInterface(Object, String)` instead to persist JavaScript objects across navigations.

웹 개발자가 코드에서 보게 되는 `window.<앱이 정한 이름>.<메서드>` 형태가 여기서 나온다. 이름 유래만 알아두면 된다.

---

## 종합

세 갈래를 방향과 실행 시점으로 정리하면 이렇게 된다.

- **앱 → 웹, 로드 직후 한 번**: 페이지가 뜬 직후 코드가 한 번 돈다. 새로고침해도 다시 돌지 않는다.
- **앱 → 웹, 로드 전 한 번**: 웹 번들 첫 줄보다 먼저 돈다. `window`에 값을 미리 심어두는 용도다.
- **앱 → 웹, 값만 미리**: 코드가 아니라 객체를 JSON 문자열로 놓아둔다. 실행 순서 다툼이 없어 더 믿을 만하다.
- **앱 → 웹, 원할 때마다**: 웹뷰 참조의 메서드로, 앱이 원하는 시점에 몇 번이든 코드 문자열을 실행시킨다.
- **웹 → 앱**: 웹이 문자열을 던지고 앱이 콜백으로 받는다(다음 질문).

앱에서 웹으로 오는 길이 여럿인 이유는 하나의 축 때문이다. **언제, 몇 번 실행되는가**. 초기값처럼 한 번이면 충분한 것은 로드 전에 심고, 권한 설정처럼 계속 바뀌는 것은 여러 번 부를 수 있는 메서드로 알린다. 이 축이 없으면 앱은 웹이 뜬 뒤에 바뀐 값을 전달할 방법이 없어, 웹은 화면을 새로 로드해야만 최신 값을 볼 수 있게 된다.

웹 개발자에게 남는 실질적 부담은 두 가지다. 앱이 심어준 값을 **언제부터 읽어도 되는지** 알아야 하고(로드 전이면 최상단, 로드 후면 기다리는 구조), 값이 객체가 아니라 **문자열로 건너온다**는 것도 감안해야 한다. 이 둘을 모르면 "가끔 `undefined`"와 "객체인 줄 알았는데 문자열" 두 증상으로 마주치게 된다.

---

# 웹 페이지에서 React Native 앱 코드로 메시지를 보내려면 웹 코드에서 무엇을 부르며, 인자에 어떤 제약이 있는가?

## 도입

앞 질문의 세 갈래 중 웹에서 앱으로 가는 유일한 길이다. 웹 쪽 호출부는 한 줄이고, 앱 쪽은 웹뷰에 달아둔 콜백으로 받는다.

> This is where `window.ReactNativeWebView.postMessage` and the `onMessage` prop come in.

이 짝이 등장하는 자리가 바로 여기다. 웹이 부르는 함수와 앱이 다는 속성이 하나의 짝을 이룬다.

---

## 본문

### 인자 제약

> `window.ReactNativeWebView.postMessage` only accepts one argument which must be a string.

`window.ReactNativeWebView.postMessage`는 인자를 **하나만** 받으며, 그 인자는 **문자열이어야** 한다.

- **only ... one argument**: 인자가 하나뿐이라, "어느 기능을 부를지"와 "무슨 값을 넘길지"를 인자 자리로 나눠 담을 수 없다.
- **must be a string**: 객체·숫자를 그대로 넘길 수 없다.

웹 쪽 호출부는 이 한 줄이 전부다.

```js
window.ReactNativeWebView.postMessage('Hello!');
```

앱 쪽은 웹뷰에 콜백을 달아두고, 도착한 문자열을 `event.nativeEvent.data`에서 꺼낸다.

```
웹                                           앱
postMessage("Hello!") ──────────────→ onMessage(event)
                                        └─ event.nativeEvent.data === "Hello!"
```

객체를 보내고 싶으면 웹이 `JSON.stringify`로 문자열을 만들어 던지고, 앱이 받아서 되돌려 파싱한다. 이는 원문에 적힌 문장이 아니라 위 제약에서 곧장 따라 나오는 귀결이다.

```js
window.ReactNativeWebView.postMessage(
  JSON.stringify({ type: 'SHARE', url: location.href }),
);
```

### 이름이 같지만 웹 표준 `postMessage`가 아니다

브라우저에는 이미 `postMessage`라는 이름의 표준 기능이 있어 혼동하기 쉽다. 둘은 이름만 겹칠 뿐 다른 물건이다.

| | 웹 표준 `window.postMessage` | `window.ReactNativeWebView.postMessage` |
|---|---|---|
| 누가 넣었나 | 브라우저에 내장 | 라이브러리가 웹뷰의 `window`에 심어 넣음 |
| 일반 브라우저에서 열면 | 그대로 있음 | `window.ReactNativeWebView`가 `undefined` |
| 통신 상대 | 창과 창 (부모창-자식창, iframe) | 웹 페이지와 앱 코드 |
| 부르는 모양 | `상대창.postMessage(값, 상대출처)` | `window.ReactNativeWebView.postMessage(문자열)` |
| 받는 쪽 | `window.addEventListener("message", ...)` | 앱 코드의 `onMessage` |
| 값 제약 | 객체도 그대로 복제해 전달 | 인자 1개, 문자열만 |

react-native-webview 공식 가이드 어디에도 웹 표준 `window.postMessage`나 `window.addEventListener("message", ...)`는 등장하지 않는다. 웹 표준 쪽 지식을 그대로 옮겨와 리스너를 달아두면 아무것도 도착하지 않는다.

같은 페이지를 일반 브라우저에서 열면 `window.ReactNativeWebView`가 아예 없다는 점도 웹 코드에 그대로 영향을 준다. 앱 안에서만 도는 코드라면 부르기 전에 존재 여부를 확인해야 개발 중 브라우저에서 터지지 않는다.

```js
if (window.ReactNativeWebView) {
  window.ReactNativeWebView.postMessage('Hello!');
}
```

### 앱의 메서드를 이름으로 부르는 것이 아니다

이 창구를 처음 보면 "웹이 앱의 함수를 부르는 것"으로 읽기 쉬운데, 그렇지 않다. 인자가 하나뿐이고 문자열이어야 하므로 **어느 함수를 부를지 지정할 자리 자체가 없다**. 창구는 하나뿐이고, 그 하나로 모든 요청이 지나간다.

그래서 실무에서는 웹이 문자열 안에 "무슨 요청인지"를 담아 던지고, 앱이 그 문자열을 뜯어 분기한다.

```js
// 웹: 요청 종류를 문자열 안에 담는다
window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_CAMERA' }));
```

반환값도 없다. 부른 자리에서 앱의 답을 받을 수 없다.

---

## 종합

웹에서 앱으로 가는 통로는 웹이 부르는 함수 하나와 앱이 다는 콜백 하나로 이뤄진 짝이다. 웹 코드가 할 일은 문자열 한 개를 만들어 던지는 것뿐이고, 그 문자열이 앱 콜백의 `event.nativeEvent.data`로 도착한다.

인자가 하나·문자열이라는 제약이 나머지 모양을 전부 결정한다.

- 객체를 보내려면 웹이 문자열로 바꿔 던지고 앱이 되돌려 파싱한다.
- 함수 이름을 지정할 자리가 없으니, 요청 종류를 문자열 안에 담아 앱이 분기한다.
- 반환값이 없으니 부른 자리에서 답을 받을 수 없다.

**한계: 이 창구는 한 방향이다.** 웹이 "지금 알림 권한이 뭐냐"고 묻고 그 자리에서 답을 받는 흐름은 공식 가이드가 다루지 않는다. 필요하면 직접 짜야 한다. 통상적인 구현은 이런 모양이다 (공식 규정이 아니라 흔히 쓰는 방식이다).

```
웹                                    앱
{ id: 1, type: "GET_PERMISSION" }  ──→  요청 문자열 파싱
                                        권한 조회
window.__reply(1, "granted")       ←──  같은 번호를 달아 코드 주입
 └─ 번호 1로 짝을 맞춰 대기 중이던 곳에 답을 넘긴다
```

웹이 요청마다 번호를 붙여 던지고, 앱이 같은 번호를 달아 주입으로 되돌려주고, 웹이 그 번호로 요청과 응답의 짝을 맞춘다. 이 짝 맞추는 코드가 없으면 웹은 답이 어느 요청에 대한 것인지 알 수 없어, 요청이 두 개 이상 동시에 떠 있을 때 답이 뒤섞인다.

---

# 웹에서 `window.ReactNativeWebView.postMessage`를 불렀는데 그런 함수가 없다고 나온다. 원인은 무엇인가?

## 도입

앞 질문에서 본 짝은 한쪽만 있어도 되는 관계가 아니다. 웹이 부르는 함수는 브라우저에 원래 있던 것이 아니라 라이브러리가 웹뷰의 `window`에 심어주는 것인데, 그 심는 동작에 조건이 붙어 있다.

---

## 본문

> You _must_ set `onMessage` or the `window.ReactNativeWebView.postMessage` method will not be injected into the web page.

앱 쪽에 `onMessage`를 **반드시** 달아야 하며, 그러지 않으면 `window.ReactNativeWebView.postMessage` 메서드가 웹 페이지에 아예 주입되지 않는다.

- **must** (원문에서 강조 표시가 붙어 있다): 선택이 아니라 조건이다.
- **will not be injected**: "값이 전달되지 않는다"가 아니라 "메서드가 심어지지 않는다"이다. 이 차이가 증상을 가른다.

웹 쪽에서 보이는 증상은 이렇게 갈린다.

```
onMessage 달림     → window.ReactNativeWebView.postMessage 존재
                     → 부르면 앱에 도착

onMessage 없음     → 메서드 자체가 없음
                     → 부르면 "그런 함수 없음" 오류
                     (메시지가 전달만 안 되는 게 아니다)
```

메시지를 던졌는데 앱이 못 받는 것이 아니라, **던질 함수 자체가 없는 것**이다. 오류 메시지가 웹 코드 한 줄을 가리키기 때문에 웹 쪽 잘못으로 오해하기 쉽지만, 원인은 앱 쪽에 콜백이 안 달려 있는 데 있다. 웹 코드를 아무리 고쳐도 해결되지 않는다.

앱 쪽에서는 실제로 메시지를 쓸 생각이 없어도 빈 함수로 달아두면 주입은 된다.

```jsx
<WebView source={{ html }} onMessage={(event) => {}} />
```

공식 가이드의 코드 주입 예제가 실제로 이렇게 빈 콜백을 달고 있다. 앞 질문에서 본 "코드 주입에도 `onMessage`가 함께 필요하다"는 문장이 같은 이유에서 나온 것이다.

---

## 종합

웹이 부르는 함수는 브라우저가 제공하는 것이 아니라 라이브러리가 웹뷰의 `window`에 심어주는 것이고, 심는 조건이 앱 쪽 콜백의 존재다. 그래서 이 오류는 "메시지가 안 간다"가 아니라 "보낼 함수가 없다"로 나타난다.

웹 개발자가 이 증상을 만났을 때 확인할 순서는 이렇다.

- 지금 이 페이지가 앱 웹뷰 안에서 뜬 것이 맞는가. 일반 브라우저에서 열었으면 `window.ReactNativeWebView`가 없는 것이 정상이다.
- 앱 웹뷰 안이 맞다면, 앱 쪽 웹뷰에 콜백이 달려 있는가. 빈 함수라도 달려 있어야 한다.

둘 다 아니라면 웹 코드를 손댈 일이 아니다. 왜 이런 조건이 붙었는지는 공식 문서가 밝히지 않으므로, 조건 자체를 사실로 외워두면 된다.
