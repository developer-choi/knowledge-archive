# 스트리밍이 없던 시절의 서버 렌더링은 무엇이 문제였는가?

## 도입

서버에서 HTML을 만들어 내려주는 방식은 오래된 기술이다. 문제는 "언제 내려주는가"에 있었다. 여기서는 스트리밍이 등장하기 전 서버 렌더링이 어떤 대기 구조를 가지고 있었는지를 본다.

---
## 본문

> In traditional server-side rendering, the server produces the full HTML document before sending anything.

"전통적인 서버 사이드 렌더링에서는, 서버가 무엇이든 보내기 전에 HTML 문서 전체를 다 만들어 낸다."

- **produces the full HTML document**: 문서를 부분이 아니라 통째로 완성한다는 뜻이다. 완성 전까지는 응답 본문이 한 글자도 나가지 않는다.
- **before sending anything**: "무엇이든 보내기 전에". 이 표현이 핵심이다. 완성과 전송이 순서대로 붙어 있어서, 완성이 늦으면 전송도 그만큼 늦는다.

> A single slow database query or API call can block the entire page.

"느린 데이터베이스 질의나 API 호출 하나가 페이지 전체를 막을 수 있다."

- **A single**: 딱 하나여도 충분하다는 강조다. 페이지의 99%가 즉시 준비돼도, 나머지 1%가 3초 걸리면 사용자는 3초 동안 빈 화면을 본다.
- **block**: 막는다. 여기서 막히는 대상은 느린 그 조각이 아니라 **페이지 전체**다.

```
스트리밍 없는 서버 렌더링의 시간축

서버:  [헤더 10ms][내비 5ms][추천 목록 3000ms] ──완성── ▶ 전송
브라우저:                                              ↑ 여기서 처음 픽셀
        └────────── 사용자는 이 구간 내내 빈 화면 ──────┘
```

이게 없으면(=완성 후 전송 구조를 못 벗어나면) 화면의 첫 픽셀 시각이 **가장 느린 데이터 하나**에 묶인다. 페이지를 아무리 잘 만들어도 느린 API 하나가 체감 속도를 결정한다.

---
## 종합

문제의 뿌리는 "완성 → 전송"이라는 두 단계가 직렬로 붙어 있다는 데 있다. 서버는 마지막 한 조각이 준비될 때까지 이미 준비된 조각들을 손에 쥐고 기다리고, 브라우저는 받을 게 없으니 그릴 것도 없다. 그 결과 페이지 전체의 속도가 가장 느린 조각의 속도로 수렴한다. 이후 질문들은 이 직렬 구조를 어떻게 끊어 내는지를 다룬다.

---

# 스트리밍은 그 문제를 어떤 방식으로 푸는가?

## 도입

앞의 문제는 "다 만들 때까지 아무것도 안 보낸다"였다. 그렇다면 해법은 "준비된 것부터 보낸다"가 된다. HTTP는 응답 본문을 여러 덩어리로 나눠 보내는 방식(chunked transfer encoding)을 원래부터 가지고 있고, 스트리밍은 그 위에서 동작한다.

---
## 본문

> Streaming changes this by using chunked transfer encoding to send parts of the response as they become ready.

"스트리밍은 chunked transfer encoding을 사용해 응답의 일부를 준비되는 대로 보냄으로써 이 상황을 바꾼다."

- **parts of the response**: 응답 전체가 아니라 그 일부. 하나의 HTTP 응답이 여러 번에 걸쳐 나눠 도착한다.
- **as they become ready**: "준비되는 대로". 순서를 미리 정해 두고 기다리는 게 아니라, 끝난 순서대로 나간다.

> The browser starts rendering HTML while the server is still generating the rest.

"브라우저는 서버가 나머지를 아직 만들고 있는 동안에 HTML 렌더링을 시작한다."

- **while**: 서버 작업과 브라우저 그리기가 겹친다는 뜻이다. 앞 질문의 직렬 구조가 여기서 겹침 구조로 바뀐다.
- **the rest**: 아직 안 끝난 나머지. 나머지가 늦어도 이미 도착한 부분은 화면에 나온다.

> This is especially impactful for pages that combine fast static content (headers, navigation, layout) with slower dynamic content (personalized data, analytics, recommendations).

"이 방식은 빠른 정적 콘텐츠(헤더, 내비게이션, 레이아웃)와 느린 동적 콘텐츠(개인화 데이터, 분석 지표, 추천)가 한 페이지에 섞여 있을 때 특히 효과가 크다."

- **static content**: 누가 요청하든 결과가 같아 미리 만들어 둘 수 있는 부분.
- **dynamic content**: 요청마다 결과가 달라지는 부분. 로그인한 사람이 누구인지, 그 사람의 추천 목록이 무엇인지 등 요청 시점에야 알 수 있는 것들이다.
- **especially impactful**: 두 종류가 섞여 있을수록 이득이 크다. 페이지가 전부 느린 데이터로만 돼 있으면 먼저 보낼 것 자체가 없다.

> The static parts can be prerendered and served from a CDN, painting instantly, while the dynamic parts stream in from the server as they become ready.

"정적인 부분은 미리 렌더링해 CDN에서 내려줄 수 있어 즉시 화면에 그려지고, 동적인 부분은 준비되는 대로 서버에서 흘러 들어온다."

- **prerendered**: 요청이 오기 전에 미리 HTML로 만들어 둔 것.
- **painting instantly**: 브라우저가 곧바로 픽셀을 찍는다는 뜻. 정적인 부분은 사용자와 가까운 CDN 서버에서 오므로 서버 계산 시간도, 먼 거리 왕복 시간도 거의 없다.
- **stream in**: 안으로 흘러 들어온다. 이미 그려진 화면의 빈자리로 나중에 채워진다는 어감이다.

```
스트리밍이 있을 때의 시간축

서버:  [헤더·내비 15ms] ▶ 전송 ─────────────── [추천 3000ms] ▶ 전송
브라우저:               ↑ 첫 픽셀(15ms)                       ↑ 추천 채움
```

---
## 종합

스트리밍의 아이디어 자체는 단순하다. 하나의 응답을 여러 덩어리로 쪼개, 끝난 것부터 내보낸다. 그러면 서버의 계산 시간과 브라우저의 그리기 시간이 겹치면서, 첫 화면이 나오는 시각이 가장 느린 데이터에서 풀려난다. 이 이득이 가장 큰 페이지는 빠른 부분과 느린 부분이 섞인 페이지다. 대시보드, 상품 상세, 개인화된 홈처럼 대부분의 실제 화면이 여기 해당한다. 남은 질문은 "그래서 무엇을 기준으로 쪼개느냐"다.

---

# 서버는 HTML을 어떤 기준으로 조각내는가?

## 도입

"준비된 것부터 보낸다"고 하려면 무엇이 하나의 덩어리인지 정해져 있어야 한다. React는 이 경계를 개발자가 코드로 직접 표시하게 했다. 그 표시가 `<Suspense>`다.

---
## 본문

> React's server renderer produces HTML in chunks aligned with `<Suspense>` boundaries.

"React의 서버 렌더러는 `<Suspense>` 경계에 맞춰 HTML을 덩어리 단위로 만들어 낸다."

- **aligned with**: 경계선을 맞춘다는 뜻이다. 덩어리의 시작과 끝이 `<Suspense>`가 감싼 범위와 일치한다.
- **boundaries**: 경계. `<Suspense>`로 감싼 지점이 "여기서 잘라도 된다"는 표시가 된다.

> Next.js integrates this into the App Router so streaming works without additional configuration.

"Next.js는 이것을 App Router에 통합해 두었기 때문에 별도 설정 없이 스트리밍이 동작한다."

- **without additional configuration**: 서버 설정이나 옵션을 켜는 절차가 없다는 뜻이다. `<Suspense>`를 쓰는 것 자체가 설정이다.

> Each `<Suspense>` boundary is an independent streaming point. Components inside different boundaries resolve and stream in independently. They don't block each other.

"각 `<Suspense>` 경계는 독립적인 스트리밍 지점이다. 서로 다른 경계 안의 컴포넌트들은 각자 완료되고 각자 흘러 들어온다. 서로를 막지 않는다."

- **independent streaming point**: 독립적으로 내보내지는 지점. 다른 경계의 진행 상황을 참조하지 않는다.
- **resolve**: (비동기 작업이) 끝나 값이 정해지는 것. `Promise`가 resolve되는 그 뜻과 같다.
- **They don't block each other**: 첫 질문의 "block the entire page"와 정확히 대비되는 문장이다. 막힘의 범위가 페이지 전체에서 경계 하나로 줄었다.

### route segment 단위와 헷갈리지 않기

"쪼개는 단위"를 두고 서술이 갈리는 것처럼 보이는 지점이 있다. [`../server-client/pipeline.md`](../server-client/pipeline.md)의 「Next.js는 서버에서 렌더링 작업을 어떤 단위로 쪼개는가?」는 route segment(layout·page)를 단위로 들고, 여기서는 `<Suspense>` 경계를 단위로 든다.

둘은 서로 배타적인 주장이 아니라 **층이 다른 이야기**다.

```
층이 다른 두 단위

route segment (layout·page)      ← 서버가 렌더링 '작업'을 나누는 단위
        │                          누가 무엇을 그릴지의 분할
        ▼
<Suspense> 경계                  ← 완성된 HTML을 '흘려보내는' 단위
                                   무엇을 언제 내보낼지의 분할
```

route segment는 서버가 렌더링해야 할 일감을 나누는 기준이다. layout 하나, page 하나가 각각 렌더링 작업의 단위가 된다. `<Suspense>` 경계는 그렇게 만들어진 결과물을 네트워크로 내보낼 때의 자르는 지점이다. 그래서 layout 하나 안에 `<Suspense>`가 세 개 있으면, 렌더링 작업 단위는 여전히 그 layout이지만 전송 덩어리는 넷(껍데기 + 경계 세 개)이 된다.

정리하면 화면에 조각이 나타나는 타이밍을 결정하는 건 `<Suspense>` 경계 쪽이다. 그래서 스트리밍을 세밀하게 제어하고 싶을 때 손대는 것도 route segment가 아니라 `<Suspense>`의 위치다.

---
## 종합

스트리밍의 절단선은 프레임워크가 알아서 추측하는 게 아니라 개발자가 `<Suspense>`로 코드에 표시한다. 표시된 각 경계는 서로 독립적이라, 한 경계가 3초 걸려도 다른 경계는 자기 데이터가 준비되는 즉시 나간다. 이 독립성이 "느린 하나가 전체를 막는다"는 최초의 문제를 실제로 해소하는 장치다. 그리고 이 경계는 렌더링 작업을 나누는 route segment와는 다른 층의 개념이므로, 둘 중 하나가 맞고 하나가 틀린 게 아니라 각각 다른 질문(무엇을 그리나 / 무엇을 언제 보내나)에 답한다고 이해하면 된다.

---

# 정적 껍데기(static shell)란 무엇인가?

## 도입

스트리밍에서 가장 먼저 나가는 덩어리에는 이름이 있다. 이 첫 덩어리가 무엇으로 채워지는지가 곧 사용자가 처음 보는 화면의 내용이다.

---
## 본문

> Everything that renders before any async work resolves is called the **static shell**: your layouts, navigation, and the fallback UI defined by your `<Suspense>` boundaries.

"비동기 작업이 하나라도 끝나기 전에 렌더링되는 모든 것을 **static shell**이라고 부른다. 레이아웃, 내비게이션, 그리고 `<Suspense>` 경계에 정의해 둔 대체 UI가 여기 해당한다."

- **before any async work resolves**: 기다림이 필요한 작업이 하나도 끝나기 전. 즉 아무것도 기다리지 않고 곧바로 만들 수 있는 것들이다.
- **shell**: 껍데기. 내용물이 아직 안 들어찬 바깥 틀이라는 어감이다.
- **fallback UI**: `<Suspense fallback={...}>`에 넣어 둔, 진짜 내용이 오기 전까지 그 자리를 대신 지키는 화면. 스켈레톤이나 "불러오는 중..." 같은 것이다.

> It is sent immediately, giving the user something to see and interact with while dynamic content streams in.

"이것은 즉시 전송되어, 동적 콘텐츠가 흘러 들어오는 동안 사용자에게 볼 것과 조작할 것을 준다."

- **something to see and interact with**: 볼 것 **그리고 조작할 것**. 빈 화면을 면하는 데서 그치지 않고, 껍데기에 포함된 링크·버튼은 실제로 눌러 이동할 수 있다.

```
static shell의 구성

┌─────────────────────────────┐
│ 헤더 / 내비게이션            │ ← 기다릴 것 없음 → 껍데기
├─────────────────────────────┤
│ ┌─ Suspense fallback ─────┐ │
│ │ [ 스켈레톤 ]            │ │ ← fallback도 껍데기
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ 푸터                         │ ← 껍데기
└─────────────────────────────┘
   진짜 데이터는 나중에 이 안으로
```

- 정적 껍데기가 없다면(=전부 데이터에 의존하게 만들면) 첫 덩어리에 보낼 내용이 없어져, 스트리밍을 켜 두고도 첫 화면이 늦어진다.

---
## 종합

정적 껍데기는 "기다림 없이 만들 수 있는 전부"를 모아 놓은 첫 덩어리다. 중요한 건 대체 UI도 껍데기에 포함된다는 점이다. 아직 데이터가 없는 영역조차 "여기에 뭔가 온다"는 자리를 차지한 채로 먼저 도착한다. 그래서 사용자는 데이터 도착 전에도 페이지의 골격을 보고, 내비게이션을 눌러 다른 화면으로 갈 수도 있다. 뒤에 나오는 성능 지표 이야기(TTFB·FCP)도, 자원 로딩 이야기도 결국 이 첫 덩어리에 무엇이 담기느냐로 귀결된다.

---

# HTML 조각이 도착하면 브라우저는 그것을 화면에 어떻게 끼워 넣는가?

## 도입

나중에 도착한 조각이 어떻게 이미 그려진 화면의 정확한 자리로 들어가는지가 궁금해지는 대목이다. 답은 서버가 HTML만 보내는 게 아니라 그 자리를 바꿔치기하는 작은 스크립트를 함께 보낸다는 데 있다.

---
## 본문

> React's server renderer produces progressive HTML chunks. The static parts of your page (layouts, navigation, Suspense fallbacks) render first and are sent immediately.

"React의 서버 렌더러는 점진적인 HTML 덩어리를 만들어 낸다. 페이지의 정적인 부분(레이아웃, 내비게이션, Suspense 대체 화면)이 먼저 렌더링되어 즉시 전송된다."

- **progressive**: 점진적. 한 번에 완성되는 게 아니라 시간에 걸쳐 조금씩 더해진다는 뜻이다.

> When an async Server Component resolves, React streams its completed HTML along with inline `<script>` tags: one that swaps the fallback DOM node with the new content, and another carrying the component payload so React can later hydrate it.

"비동기 Server Component가 완료되면, React는 완성된 HTML을 인라인 `<script>` 태그들과 함께 흘려보낸다. 하나는 대체 화면 자리의 DOM 노드를 새 내용으로 바꿔치기하는 스크립트이고, 다른 하나는 React가 나중에 하이드레이션할 수 있도록 컴포넌트 페이로드를 실어 나르는 스크립트다."

- **inline `<script>`**: 외부 파일을 불러오는 게 아니라 코드가 HTML 안에 직접 들어 있는 스크립트. 별도 다운로드가 필요 없으니 도착 즉시 실행된다.
- **swaps ... with**: 자리를 맞바꾼다. 대체 화면이 있던 DOM 노드를 새 내용으로 교체하는 몇 줄짜리 조작이다.
- **payload**: 실어 나르는 짐. 여기서는 그 컴포넌트를 나중에 되살리는 데 필요한 데이터를 말한다.
- **later hydrate**: 나중에 하이드레이션한다. "나중에"라는 말이 붙어 있다는 점이 중요하다. 화면 교체와 같은 시점이 아니다.

> The browser executes the swap instantly, without waiting for the page's JavaScript bundle to load or hydration to complete.

"브라우저는 이 바꿔치기를 즉시 실행한다. 페이지의 JavaScript 묶음이 다 받아지기를 기다리지도, 하이드레이션이 끝나기를 기다리지도 않는다."

- **instantly**: 조각이 도착하는 그 순간. 대기 조건이 붙지 않는다.
- **without waiting for ... bundle to load**: 애플리케이션 JavaScript가 아직 다운로드 중이어도 상관없다는 뜻이다. 바꿔치기 스크립트는 그 묶음에 들어 있는 게 아니라 HTML 안에 직접 실려 왔다.

여기가 직관에 반하는 지점이다. **화면이 바뀌는 것과 하이드레이션은 별개의 사건**이다.

```
두 사건은 다른 시점에 온다

t=15ms   껍데기 도착 ────────▶ 보인다 (아직 못 만짐)
t=200ms  조각 도착 + 인라인 스크립트 실행 ──▶ 화면 교체됨 (여전히 못 만질 수 있음)
t=?      JS 묶음 도착 → 하이드레이션 ───────▶ 이제 클릭·입력이 동작
```

"보이는 것"은 HTML과 몇 줄짜리 인라인 스크립트만으로 달성되고, "만져지는 것"은 애플리케이션 JavaScript가 도착해 하이드레이션을 마쳐야 달성된다. 그래서 스트리밍된 영역은 화면상으로는 완성돼 보이는데 버튼이 아직 반응하지 않는 짧은 구간이 존재할 수 있다.

> This is what the user *sees*: the page painting progressively, section by section.

"이것이 사용자가 *보는* 것이다. 페이지가 구역 단위로 점진적으로 그려지는 모습."

- **sees**: 원문에서 이 단어만 기울임으로 강조돼 있다. 사용자가 보는 것과 React 내부에서 진행 중인 것(하이드레이션)을 구분하려는 강조다.
- **section by section**: 구역 단위로. 자르는 단위가 `<Suspense>` 경계이므로, 사용자 눈에는 경계 하나가 곧 한 구역으로 보인다.

---
## 종합

스트리밍된 조각은 "HTML + 그 HTML을 제자리에 꽂는 인라인 스크립트 + 나중에 쓸 데이터"의 묶음으로 도착한다. 앞의 두 개만으로 화면 교체가 끝나기 때문에, 애플리케이션 JavaScript가 늦어도 그림은 계속 갱신된다. 세 번째 조각은 시점이 다른 일, 즉 하이드레이션을 위해 쌓여 있다가 나중에 쓰인다. 그래서 스트리밍에서는 **보이는 시점과 만져지는 시점이 분리된다**. 이 분리를 알고 있어야, "화면은 다 나왔는데 왜 클릭이 안 먹지"라는 상황을 버그가 아니라 정상 동작으로 해석할 수 있다.
