# 스트리밍은 왜 TTFB와 FCP를 낮추는가?

## 도입

스트리밍의 이득을 지표로 확인하는 대목이다. TTFB는 요청 후 응답의 첫 바이트가 도착하기까지의 시간이고, FCP(First Contentful Paint)는 화면에 의미 있는 내용이 처음 그려지는 시각이다.

---
## 본문

> Without streaming, the server waits for all data before sending any HTML, so TTFB equals the slowest query.

"스트리밍이 없으면 서버는 HTML을 조금이라도 보내기 전에 모든 데이터를 기다리므로, TTFB가 가장 느린 질의 시간과 같아진다."

- **equals the slowest query**: 가장 느린 질의와 같다. 첫 질문의 "A single slow ... can block the entire page"를 지표로 환산한 문장이다.

> With streaming, the server sends the static shell as soon as it's ready. TTFB drops to the time it takes to render your layouts and fallbacks.

"스트리밍이 있으면 서버는 정적 껍데기가 준비되는 즉시 보낸다. TTFB는 레이아웃과 대체 화면을 렌더링하는 데 걸리는 시간으로 떨어진다."

- **drops to**: ~까지 떨어진다. 데이터 시간이 빠지고 껍데기 렌더링 시간만 남는다.
- 껍데기는 기다릴 것이 없으므로 이 시간은 보통 수십 밀리초 수준이다.

> The browser paints the static shell immediately, so FCP is decoupled from your data fetching time.

"브라우저는 정적 껍데기를 즉시 그리므로, FCP가 데이터 가져오는 시간에서 분리된다."

- **decoupled from**: ~에서 분리된다. 두 값이 함께 움직이던 관계가 끊어진다는 뜻이다. 데이터가 3초 걸려도 FCP는 그대로다.

```
지표가 무엇에 묶이는가

스트리밍 없음:  TTFB = 가장 느린 데이터 시간  → FCP도 그 뒤
스트리밍 있음:  TTFB = 껍데기 렌더링 시간     → FCP는 껍데기 도착 직후
                (느린 데이터는 뒤에 따로 도착)
```

주의할 점은 지표가 좋아진 만큼 데이터가 빨라진 건 아니라는 것이다. 느린 데이터는 여전히 느리게 도착하며, 달라진 것은 그 느림이 첫 화면을 붙잡지 않게 된 것뿐이다.

---
## 종합

스트리밍이 지표를 낮추는 원리는 "무엇이 무엇에 묶여 있는가"를 끊는 데 있다. 예전에는 첫 바이트도, 첫 픽셀도 전부 가장 느린 데이터에 묶여 있었다. 지금은 둘 다 정적 껍데기에만 묶인다. 그래서 껍데기를 두껍고 빠르게 유지하는 것이 곧 지표 개선이 되고, 반대로 layout 최상단에서 `await` 한 줄을 하면 껍데기가 사라지면서 두 지표가 함께 원래대로 되돌아간다.

---

# 가장 큰 요소(LCP)를 빨리 그리려면 경계를 어떻게 배치해야 하는가?

## 도입

LCP(Largest Contentful Paint)는 화면에서 가장 큰 콘텐츠 요소가 그려지는 시각을 재는 지표다. 보통 대표 이미지나 큰 제목이 그 대상이 된다. 이 요소가 경계 안에 들어가 있으면 지표가 나빠진다.

---
## 본문

> If your LCP element (a hero image, a main heading, a product photo) is inside a Suspense boundary, it can't paint until that boundary resolves.

"LCP 요소(대표 이미지, 주요 제목, 상품 사진)가 Suspense 경계 안에 있으면, 그 경계가 완료될 때까지 그려질 수 없다."

- **hero image**: 페이지 상단을 크게 차지하는 대표 이미지.
- **can't paint until**: 완료 전까지는 그려질 수 없다. 그 자리에는 대체 화면이 있을 뿐이다.

> * Keep LCP elements **outside** or **above** Suspense boundaries so they render as part of the static shell.

"LCP 요소를 Suspense 경계 **바깥**이나 **위쪽**에 두어 정적 껍데기의 일부로 렌더링되게 하라."

- **outside or above**: 경계 밖 또는 경계보다 위. 껍데기에 포함되는 조건이 이것이다.

> * Use the `preload` prop on `next/image` for LCP images. This injects a `<link rel="preload">` into the `<head>`, so the browser starts fetching the image from the very first chunk, before the `<img>` tag even appears in the HTML.

"LCP 이미지에는 `next/image`의 `preload` prop을 사용하라. 이것은 `<head>`에 `<link rel="preload">`를 넣어, 브라우저가 HTML에 `<img>` 태그가 나타나기도 전에 첫 덩어리부터 이미지를 받기 시작하게 한다."

- **preload**: 미리 받아 두기. 브라우저에게 "이 자원은 곧 필요하니 지금 받아라"라고 알리는 표시다.
- **before the `<img>` tag even appears**: `<img>` 태그가 등장하기도 전에. 보통 브라우저는 태그를 만나야 이미지를 받기 시작하는데, 이 표시가 그 순서를 앞당긴다.

> * For non-image LCP elements (text, headings), make sure they are not wrapped in a Suspense boundary that depends on slow data.

"이미지가 아닌 LCP 요소(텍스트, 제목)에 대해서는, 느린 데이터에 의존하는 Suspense 경계에 감싸이지 않았는지 확인하라."

- **that depends on slow data**: 느린 데이터에 의존하는. 경계 자체가 문제가 아니라, 느린 데이터를 기다리는 경계가 문제다.

```
LCP 요소의 위치

좋음                          나쁨
┌──────────────────┐          ┌──────────────────┐
│ [대표 이미지]     │ ← 껍데기  │ ┌ Suspense ────┐ │
│ ┌ Suspense ────┐ │          │ │ [스켈레톤]    │ │ ← 데이터 대기 중
│ │ 느린 목록     │ │          │ │ (대표 이미지) │ │   LCP도 대기
│ └──────────────┘ │          │ └──────────────┘ │
└──────────────────┘          └──────────────────┘
```

---
## 종합

LCP는 "가장 큰 것이 언제 보이는가"를 재므로, 가장 큰 것을 껍데기에 넣는 것이 유일한 정답에 가깝다. 경계 바깥이나 위쪽에 두면 첫 덩어리와 함께 나가고, 이미지라면 미리 받기 표시까지 붙여 다운로드 출발 시각도 앞당긴다. 반대로 편의상 화면 상단까지 통째로 경계 안에 넣으면, 다른 지표가 좋아 보여도 LCP만 느린 데이터에 묶여 남는다. 경계 배치는 스트리밍 속도만이 아니라 어떤 요소가 어느 지표에 묶이는지를 결정하는 선택이다.

---

# 임시 화면이 진짜 내용으로 바뀔 때 화면이 덜컹거리는 것을 막으려면 어떻게 해야 하는가?

## 도입

스트리밍은 화면을 여러 번 바꾼다. 바뀔 때마다 요소의 크기가 달라지면 주변 내용이 밀려나며 화면이 덜컹거린다. 이 흔들림을 재는 지표가 CLS(Cumulative Layout Shift)다.

---
## 본문

> When a Suspense fallback is replaced by the resolved content, the browser reflows the page.

"Suspense 대체 화면이 완료된 내용으로 교체되면, 브라우저는 페이지를 다시 배치한다."

- **reflows**: 요소들의 위치와 크기를 다시 계산해 배치하는 작업. 교체된 영역의 크기가 달라지면 그 아래 요소들의 좌표가 전부 다시 정해진다.

> If the fallback and the resolved content are different sizes, the surrounding layout shifts.

"대체 화면과 완료된 내용의 크기가 다르면, 주변 레이아웃이 밀린다."

- **shifts**: 밀린다. 사용자가 누르려던 버튼이 클릭 직전에 아래로 내려가는 상황이 대표적인 피해다.

> * Design skeleton fallbacks that **match the dimensions** of the content they represent. A skeleton with the same height and width as the final card grid prevents shifts.

"대체 스켈레톤을 그것이 대신하는 내용과 **크기가 일치하도록** 설계하라. 최종 카드 그리드와 높이·너비가 같은 스켈레톤은 밀림을 막는다."

- **match the dimensions**: 치수를 맞춘다. 모양이 아니라 크기가 관건이다. 회색 박스든 무엇이든 크기만 같으면 밀림이 없다.

> * Use fixed or min-height containers around Suspense boundaries so the space is reserved before content arrives.

"Suspense 경계 주위에 고정 높이나 최소 높이를 가진 컨테이너를 사용해, 내용이 도착하기 전에 공간이 미리 확보되게 하라."

- **the space is reserved**: 공간이 미리 잡혀 있다. 내용의 정확한 크기를 모를 때도 최소 높이를 지정해 두면 밀림 폭을 줄일 수 있다.

```
크기가 다를 때 vs 같을 때

대체 화면        →  실제 내용        결과
[  40px  ]          [  300px  ]      아래 내용이 260px 밀림
[ 300px  ]          [  300px  ]      밀림 없음
```

이 문제는 스트리밍을 세밀하게 쪼갤수록 잦아진다. 경계가 많다는 건 교체가 여러 번 일어난다는 뜻이고, 교체마다 밀림이 쌓일 수 있기 때문이다. 그래서 경계를 잘게 나누는 최적화와 대체 화면 크기를 맞추는 작업은 함께 가야 한다.

---
## 종합

스트리밍이 만드는 부작용은 화면 교체 그 자체가 아니라 교체 전후의 크기 차이다. 대체 화면을 진짜 내용과 같은 크기로 만들거나, 경계 주위 컨테이너에 높이를 지정해 자리를 미리 잡아 두면 밀림이 사라진다. "불러오는 중..." 같은 한 줄짜리 문구가 편해 보이지만, 그 자리에 300px짜리 표가 들어올 예정이라면 그 한 줄이 곧 흔들림의 원인이 된다.

---

# 화면 이동 직후 곧바로 띄우는 임시 화면은 무엇으로 채우는 것이 좋은가?

## 도입

앞 질문이 임시 화면의 크기를 다뤘다면, 이번은 그 안에 무엇을 그릴지의 문제다.

---
## 본문

> An instant loading state is fallback UI that is shown immediately to the user after navigation.

"즉각 로딩 상태란 화면 이동 직후 사용자에게 곧바로 보이는 대체 화면을 말한다."

- **instant**: 기다림 없이 그 자리에서.
- **loading state**: 데이터를 기다리는 동안의 화면 상태.

> For the best user experience, we recommend designing loading states that are meaningful and help users understand the app is responding. For example, you can use skeletons and spinners, or a small but meaningful part of future screens such as a cover photo, title, etc.

"최선의 사용자 경험을 위해서는 의미가 있고 앱이 반응하고 있음을 사용자가 알 수 있게 돕는 로딩 화면을 설계하기를 권한다. 예를 들어 스켈레톤이나 스피너를 쓰거나, 곧 나올 화면의 작지만 의미 있는 일부(표지 사진·제목 등)를 쓸 수 있다."

- **meaningful**: 의미가 있는. 그 자리에 무엇이 올지 짐작하게 해 준다는 뜻이다.
- **the app is responding**: 앱이 반응하고 있다. 멈춘 게 아니라는 신호.
- **skeleton**: 실제 내용이 들어갈 자리를 회색 덩어리로 잡아 둔 뼈대 화면.
- **spinner**: 빙글빙글 도는 대기 표시.

### 대기 화면이 실제로 하는 일

기술적으로는 자리를 채우는 것이지만, 사용자 쪽에서 보면 하는 일이 하나 더 있다. "네 클릭은 먹혔다"는 대답이다.

```
대기 화면이 없으면
  클릭 → 아무 변화 없음 → 사용자가 다시 클릭

대기 화면이 있으면
  클릭 → 즉시 반응 → 사용자가 기다린다
```

같은 2초라도 앞쪽은 고장으로 읽히고 뒤쪽은 로딩으로 읽힌다.

### 세 가지 선택지가 주는 정보량이 다르다

```
스피너      "무언가 진행 중"          정보량 적음
스켈레톤    "여기에 카드 목록이 온다"   모양을 미리 알려 준다
실제 일부   "이 글의 제목은 이것이다"   내용까지 알려 준다
```

아래로 갈수록 좋지만 조건이 붙는다. 실제 일부를 보여 주려면 그 데이터만은 대기 없이 준비돼 있어야 한다. 제목은 이미 알고 본문만 기다리는 상황처럼, 데이터를 나눠 가져올 수 있을 때만 가능한 선택이다.

### 앞 질문과 이어 보기

앞 질문은 대기 화면과 실제 내용의 **크기**가 다르면 화면이 덜컹거린다고 했다. 이번 질문은 그 안의 **내용**을 다룬다. 둘을 합치면 좋은 대기 화면의 조건이 나온다. 들어올 내용과 같은 크기를 차지하면서, 무엇이 들어올지 알아볼 수 있는 모양일 것.

---
## 종합

대기 화면은 빈자리를 메우는 장치가 아니라 사용자에게 보내는 응답이다. 스피너보다 스켈레톤이, 스켈레톤보다 실제 내용의 일부가 더 많은 것을 알려 준다. 다만 뒤로 갈수록 그 부분의 데이터가 미리 준비돼 있어야 한다는 조건이 붙는다.

---

# `<Suspense>` 경계는 하이드레이션에 어떤 영향을 주는가?

## 도입

`<Suspense>` 경계는 HTML을 잘라 보내는 단위이기만 한 게 아니다. 서버가 보낸 HTML에 React가 이벤트 처리를 붙이는 작업, 즉 하이드레이션에서도 같은 경계가 단위로 쓰인다.

---
## 본문

> Streaming enables selective hydration: React hydrates components independently as they stream in, and prioritizes hydrating whatever the user is interacting with.

"스트리밍은 선택적 하이드레이션을 가능하게 한다. React는 컴포넌트들이 흘러 들어오는 대로 각각 독립적으로 하이드레이션하며, 사용자가 상호작용하고 있는 대상을 먼저 하이드레이션한다."

- **selective**: 선택적. 전부가 아니라 필요한 것부터 고른다는 뜻이다.
- **prioritizes**: 우선순위를 준다. 사용자가 클릭한 영역이 아직 하이드레이션 전이면 그 영역을 앞으로 당겨 처리한다.

> Each `<Suspense>` boundary is a hydration unit.

"각 `<Suspense>` 경계는 하이드레이션의 단위다."

- **hydration unit**: 하이드레이션이 이루어지는 하나의 묶음. 앞에서 본 "전송 단위"와 같은 경계가 여기서는 "되살리기 단위"로도 쓰인다.

> Without them, React hydrates the entire page in one blocking pass.

"경계가 없으면 React는 페이지 전체를 한 번의 막는 작업으로 하이드레이션한다."

- **one blocking pass**: 한 번에 쭉 훑는, 중간에 양보하지 않는 작업. 그동안 브라우저의 주 실행 흐름이 묶여 클릭·스크롤 반응이 늦어진다.

> With them, hydration is broken into smaller tasks that yield to the browser, keeping the main thread responsive.

"경계가 있으면 하이드레이션이 브라우저에 제어를 양보하는 더 작은 작업들로 쪼개져, 메인 스레드가 반응 가능한 상태로 유지된다."

- **yield to the browser**: 브라우저에게 잠깐 자리를 내준다. 작업 사이사이에 틈이 생겨 그동안 사용자 입력이 처리된다.
- **main thread responsive**: 메인 스레드가 응답 가능한 상태. 자바스크립트 실행과 화면 갱신이 같은 흐름에서 돌아가므로, 긴 작업 하나가 그 흐름을 독점하면 화면이 굳는다.

```
경계 유무에 따른 하이드레이션

경계 없음:  [────── 전체 하이드레이션 (긴 작업) ──────]
            그동안 클릭 반응 없음

경계 있음:  [A][틈][B][틈][C]
            틈마다 사용자 입력 처리됨, 클릭한 곳은 먼저 처리
```

이 이야기는 "HTML 조각이 도착하면 브라우저는 그것을 화면에 어떻게 끼워 넣는가?"에서 본 구분과 이어진다. 화면 교체는 인라인 스크립트가 즉시 해치우고, 여기서 다루는 하이드레이션은 그 뒤에 경계 단위로 나뉘어 진행된다.

---
## 종합

`<Suspense>` 경계는 두 가지 일을 겸한다. 서버 쪽에서는 HTML을 잘라 보내는 지점이고, 브라우저 쪽에서는 하이드레이션을 잘라 처리하는 지점이다. 경계가 없으면 되살리기가 한 덩어리로 뭉쳐 브라우저를 오래 붙잡지만, 있으면 작은 작업으로 나뉘어 중간중간 사용자 입력에 자리를 내준다. 게다가 사용자가 건드린 영역이 먼저 처리되므로 체감 반응 속도가 올라간다. 경계를 세밀하게 두는 것이 전송 속도만이 아니라 상호작용 응답성에도 이득이 되는 이유다.

---

# 정적 껍데기가 첫 조각에 담기는 것이 자원 로딩에 왜 유리한가?

## 도입

첫 덩어리에 담기는 것은 눈에 보이는 화면만이 아니다. 어떤 CSS·JavaScript·폰트를 받아야 하는지를 알려주는 태그들도 함께 담긴다. 이 시점 차이가 로딩 시간을 겹치게 만든다.

---
## 본문

> The static shell includes `<link>` and `<script>` tags in the very first HTML chunk.

"정적 껍데기는 가장 첫 HTML 덩어리 안에 `<link>`와 `<script>` 태그를 포함한다."

- **the very first**: 다름 아닌 첫 번째. 자원 목록이 응답의 맨 앞에 실려 온다는 점이 요점이다.

> The browser discovers and starts fetching CSS, JavaScript, and fonts immediately, while the server is still generating content.

"브라우저는 CSS, JavaScript, 폰트를 즉시 발견해 받기 시작한다. 서버가 아직 콘텐츠를 만들고 있는 동안에 말이다."

- **discovers**: 발견한다. 브라우저는 HTML을 읽어 내려가다 태그를 만나야 그 자원의 존재를 알 수 있다. 태그가 늦게 오면 발견도 늦다.
- **while the server is still generating**: 서버가 아직 만드는 중일 때. 서버의 계산 시간과 브라우저의 다운로드 시간이 겹친다.

> Resources are fetched during server think time rather than after it.

"자원은 서버가 생각하는 시간이 끝난 뒤가 아니라 그 시간 **동안** 받아진다."

- **server think time**: 서버가 데이터를 기다리며 응답을 만드는 시간. 스트리밍이 없으면 이 시간 내내 브라우저는 할 일이 없다.
- **rather than after it**: 그 뒤가 아니라. 순차로 쌓이던 두 시간이 병렬로 겹친다는 뜻이다.

```
자원 다운로드가 시작되는 시점

스트리밍 없음:  [서버 생각 3s][HTML 도착][CSS·JS 다운로드 0.5s] → 총 3.5s
스트리밍 있음:  [껍데기 15ms][CSS·JS 다운로드 0.5s]
                            [서버 생각 3s              ] → 총 약 3s
```

이 이득은 앞의 LCP 이야기에 나온 미리 받기 표시와 같은 원리다. 브라우저가 "무엇을 받아야 하는지"를 일찍 알수록 다운로드 출발이 빨라진다.

---
## 종합

첫 덩어리는 화면의 첫인상만 결정하는 게 아니라 자원 다운로드의 출발 신호이기도 하다. 태그가 응답 맨 앞에 실려 오므로, 브라우저는 서버가 느린 데이터를 기다리는 동안 CSS·JavaScript·폰트를 미리 받아 둔다. 그 결과 서버 대기 시간과 다운로드 시간이 겹쳐 전체 완료 시각이 당겨진다. 반대로 껍데기가 비어 있으면(=최상단에서 `await`하면) 이 겹침이 사라지고, 브라우저는 서버가 다 끝낼 때까지 아무 자원도 받지 못한 채 기다린다.
