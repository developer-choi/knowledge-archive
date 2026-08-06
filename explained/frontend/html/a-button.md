# `<a>` 대신 `<button>`을 써야 하는 경우는 언제인가?

## 도입

`<a>`와 `<button>`은 화면에서 둘 다 "누르는 것"으로 보인다. 그래서 어느 쪽을 써도 되는 것처럼 느껴지는데, 두 요소가 문서에 기록하는 내용은 정반대다.

MDN의 정의를 나란히 놓으면 갈리는 지점이 한 줄로 드러난다.

> The `<a>` HTML element (or *anchor* element), with its `href` attribute, creates a hyperlink to web pages, files, email addresses, locations in the same page, or anything else a URL can address.

"`<a>` 요소는 (다른 이름으로 *앵커* 요소), `href` 속성과 함께 쓰여 웹 페이지·파일·이메일 주소·같은 페이지 안의 위치, 그 밖에 URL로 가리킬 수 있는 모든 것으로 향하는 하이퍼링크를 만든다."

- **anchor**: 배의 닻. 문서 안의 한 지점을 찍어둔다는 뜻에서 온 이름이다.
- **address** (동사): 주소로 지목하다. `anything else a URL can address`는 "URL이라는 주소를 붙여 가리킬 수 있는 그 밖의 모든 것"이다.

> The `<button>` HTML element is an interactive element activated by a user with a mouse, keyboard, finger, voice command, or other assistive technology. Once activated, it then performs an action, such as submitting a form or opening a dialog.

"`<button>` 요소는 사용자가 마우스·키보드·손가락·음성 명령, 또는 그 밖의 보조 기술로 활성화하는 상호작용 요소다. 활성화되고 나면 폼을 제출하거나 대화상자를 여는 것 같은 동작을 수행한다."

- **activate**: 활성화하다. 클릭만이 아니라 키보드 엔터·음성 명령까지 담으려고 고른 넓은 낱말이다.
- **perform an action**: 동작을 수행한다. `<a>`의 정의에는 이 표현이 없고, 대신 "URL로 향하는 링크를 만든다"가 있다.

한쪽은 **주소로 간다**, 다른 쪽은 **동작을 한다**. 아래 원문은 이 경계를 흐렸을 때 무슨 일이 벌어지는지를 다룬다.

---

## 본문

> Anchor elements are often abused as fake buttons by setting their `href` to `#` or `javascript:void(0)` to prevent the page from refreshing, then listening for their `click` events.

"앵커 요소는 흔히 가짜 버튼으로 오용된다 — `href`를 `#`이나 `javascript:void(0)`로 두어 페이지가 새로 뜨는 것을 막아놓고, 그 `click` 이벤트를 붙잡아 쓰는 식이다."

- **abuse**: 오용하다. misuse보다 강한 낱말로, 잘못 썼다는 비난이 실려 있다.
- **fake buttons**: 가짜 버튼. 버튼처럼 보이고 버튼처럼 동작하지만 버튼이 아니라는 뜻이다.
- **prevent the page from refreshing**: 페이지가 새로 뜨는 것을 막는다. `<a>`는 누르면 이동하는 요소라서, 이동을 원하지 않으면 `href`에 갈 곳 없는 값을 넣어 막게 된다.
- **listening for their `click` events**: 클릭 이벤트를 붙잡아 쓴다. 이동 대신 자바스크립트 함수를 실행시킨다는 말이다.

`#`과 `javascript:void(0)`은 둘 다 "아무 데도 가지 않는다"를 표현하는 관용구다. 여기서 이미 신호가 하나 나와 있다 — 갈 곳이 없다는 것은 `<a>`를 고를 근거가 애초에 없었다는 뜻이다.

### 왜 문제인가 — 브라우저 쪽

> These bogus `href` values cause unexpected behavior when copying/dragging links, opening links in a new tab/window, bookmarking, or when JavaScript is loading, errors, or is disabled.

"이런 엉터리 `href` 값은 링크를 복사하거나 끌어놓을 때, 새 탭·새 창으로 열 때, 북마크할 때, 그리고 자바스크립트가 아직 로딩 중이거나 오류가 났거나 꺼져 있을 때 예상치 못한 동작을 일으킨다."

- **bogus**: 가짜의, 엉터리인.
- **unexpected behavior**: 예상치 못한 동작. 오류 메시지가 뜨는 게 아니라 조용히 이상하게 굴어서 발견이 늦다는 어감이다.
- **disabled**: (기능이) 꺼진 상태.

여기 나열된 것은 전부 **브라우저가 `<a>`에게만 얹어주는 기본 기능**이다. 우클릭해서 주소 복사, 가운데 클릭으로 새 탭, 북마크에 저장 — 사용자는 링크라고 믿고 이 기능들을 쓰는데, 집어가는 주소는 `#`이라는 빈 값이다.

마지막에 붙은 조건이 특히 무겁다. 자바스크립트가 로딩 중이거나 오류가 났으면 클릭 이벤트를 붙잡을 코드 자체가 없다. `<button>`이었다면 최소한 아무 일도 일어나지 않고 끝나지만, `<a>`는 `href`로 이동해버린다.

### 왜 문제인가 — 보조 기술 쪽

> They also convey incorrect semantics to assistive technologies, like screen readers.

"또한 화면 낭독기 같은 보조 기술에 잘못된 의미를 전달한다."

- **convey**: 전달하다.
- **semantics**: 의미. 여기서는 "이 요소가 무엇인가"라는 태그의 역할 정보다.
- **assistive technologies**: 보조 기술. 화면 낭독기, 음성 제어 등이다.
- **incorrect**: 부정확한 정도가 아니라 틀렸다는 뜻이다.

화면 낭독기는 `<a>`를 만나면 "링크"라고 읽는다. 실제로는 눌러도 아무 데도 가지 않는데 링크라는 안내를 받는 셈이다.

낭독기 사용자는 페이지의 링크만 모아 훑는 기능도 쓰는데, 그 목록에 갈 곳 없는 항목들이 섞여 들어간다.

### 판정

> Use a `<button>` instead. In general, you should only use a hyperlink for navigation to a real URL.

"대신 `<button>`을 쓴다. 일반적으로, 하이퍼링크는 실제 URL로 이동할 때만 써야 한다."

- **instead**: (그것 말고) 대신에.
- **navigation**: 이동. 다른 문서나 위치로 옮겨가는 것이다.
- **a real URL**: 실제 URL. `#`이나 `javascript:void(0)` 같은 껍데기가 아니라 진짜 가리키는 곳이 있는 주소다.
- **only ... for**: ~할 때만. 권장이 아니라 범위를 잘라내는 제한이다.

`only`가 문장의 핵심이다. "이동에도 쓴다"가 아니라 "이동에만 쓴다"이므로, 이동이 아닌 경우는 전부 `<a>`의 바깥이 된다.

---

## 종합

두 요소를 가르는 질문은 하나다 — **누른 뒤에 주소가 바뀌는가.**

```
누르면 무슨 일이 일어나는가
├── 다른 주소로 간다 (페이지·파일·이메일·문서 안의 지점)  → <a href="실제 URL">
└── 그 자리에서 무언가 실행된다 (제출·열기·닫기·토글)      → <button>
```

`href`에 무엇을 넣을지 고민하게 되는 순간이 신호다. 갈 곳이 떠오르지 않아 `#`을 적고 있다면, 그건 `<a>`가 아니라 `<button>`이어야 할 자리다.

이 오용이 특히 오래 살아남는 이유는 **화면에서 아무 차이도 안 나기 때문**이다. CSS를 입히면 `<a>`도 버튼처럼 보이고, 클릭 이벤트를 붙이면 버튼처럼 동작한다. 눈으로 하는 검수는 전부 통과한다.

깨지는 것은 눈에 안 보이는 쪽 — 새 탭으로 열기, 북마크, 주소 복사, 자바스크립트가 죽은 상황, 그리고 화면 낭독기의 안내다.

같은 폴더의 [`div-span.md`](./div-span.md)에서 다룬 실수와 방향이 정확히 반대라는 점도 짚어둘 만하다. 그쪽은 의미가 있는 자리에 의미 없는 태그를 써서 정보를 **빠뜨리는** 실수였고, 이쪽은 이동이 아닌 자리에 `<a>`를 써서 **없는 정보를 지어내는** 실수다.

문서가 아무 말도 하지 않는 것보다, 사실이 아닌 말을 하는 쪽이 나쁘다.
