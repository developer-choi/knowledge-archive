# DevTools `Event Listeners` 패널 — 표시 순서

같은 요소에 여러 핸들러를 등록한 경우, DevTools `Event Listeners` 패널의 `click` 항목에 다음 순서로 나열됨:

```
▼ click
  ▶ button#main-btn   test.js:25
  ▶ button#main-btn   test.js:21
  ▶ button#main-btn   test.js:17
  ▶ button#main-btn   test.js:13
  ▶ button#main-btn   test.js:9
  ▶ button#main-btn   test.js:5
```

대응 JS 코드 (등록 순서):

```js
$("#main-btn").on("click", function() {
    console.log("mainBtn")
});

$("#main-btn").on("click", function() {
    console.log("mainBtn")
});

$("#main-btn").on("click", function() {
    console.log("mainBtn")
});

$("#main-btn").on("click", function() {
    console.log("mainBtn")
});

$("#main-btn").on("click", function() {
    console.log("mainBtn")
});

$("#main-btn").on("click", function() {
    console.log("mainBtn")
});
```

알고보니 이벤트가 실행되는 순서는 개발자 도구의 역방향순서였음.
