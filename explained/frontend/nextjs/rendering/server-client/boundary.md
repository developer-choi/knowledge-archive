# Server Component를 쓰면 무엇이 좋은가?

## 도입

Server Component를 사용하면 Client Component만 쓸 때는 얻을 수 없는 여러 이점이 생긴다. 이 질문은 각 장점의 개요를 소개하고, 세부 메커니즘은 뒤따르는 질문들에서 Official Answer와 함께 다룬다.

---
## 본문

공식 문서는 Server Component를 골라야 하는 상황을 네 가지로 정리한다.

> Use **Server Components** when you need:
>
> - Fetch data from databases or APIs close to the source.
> - Use API keys, tokens, and other secrets without exposing them to the client.
> - Reduce the amount of JavaScript sent to the browser.
> - Improve the First Contentful Paint (FCP), and stream content progressively to the client.

"다음이 필요할 때 Server Component를 사용한다: 데이터 소스와 가까운 곳에서 데이터베이스나 API로부터 데이터를 가져올 때, API 키·토큰·기타 비밀 값을 클라이언트에 노출하지 않고 사용할 때, 브라우저로 보내는 JavaScript 양을 줄일 때, 첫 콘텐츠가 그려지는 시점(FCP)을 앞당기고 내용을 조금씩 이어서 클라이언트로 보낼 때."

- **close to the source**: 데이터가 실제로 저장된 곳 바로 옆에서 읽는다는 뜻이다. 사용자 기기에서 지구 반대편 DB를 부르는 대신, 같은 데이터센터 안에 있는 서버가 부른다.
- **without exposing them to the client**: 비밀 값이 브라우저로 내려가는 코드에 아예 섞이지 않는다는 뜻이다. 브라우저 개발자 도구로 들여다봐도 나오지 않는다.
- **First Contentful Paint (FCP)**: 화면에 첫 내용이 실제로 그려진 시점을 재는 지표. 이 값이 작을수록 사용자는 "빨리 떴다"고 느낀다.
- **stream content progressively**: 페이지 전체가 다 만들어질 때까지 기다렸다가 한 번에 보내는 대신, 준비된 부분부터 차례로 내려보낸다는 뜻이다.

SC가 제공하는 주요 장점 여섯 가지:

```
SC 장점
├── JS 번들 크기 감소 (+ Hydration 비용 감소)
├── 초기 페이지 로딩 속도 개선
├── 네트워크 비용 절감 (single round-trip)
├── Caching
├── 백엔드 데이터 직접 접근
└── 보안 (민감 정보 서버에 보존)
```

CC 위주로 앱을 구성하면 위 장점을 모두 잃는다. 반대로 비대화형 UI를 SC로 옮기는 것만으로도 다음 세 가지가 즉시 개선된다 — 번들 크기, 초기 로딩, hydration 비용.

---
## 종합

SC의 장점은 "서버가 할 수 있는 일을 서버에서 처리"한다는 단순한 원칙에서 나온다. 렌더링을 클라이언트에 맡기면 JS 다운로드·파싱·실행 비용이 사용자 기기에서 발생하고, 서버와의 네트워크 왕복이 늘어난다. SC는 이 비용을 서버로 옮겨 클라이언트 부담을 줄인다.

---

# 초기 페이지 로딩 속도가 어떻게 더 빨라지는가?

## 도입

SC를 쓰면 초기 페이지 로딩이 빨라진다고 하는데, 구체적으로 어떤 메커니즘으로 빨라지는가? 단순히 번들이 작아지는 것 이상의 이유가 있다.

---
## 본문

> On the server, we can generate HTML to allow users to view the page immediately, without waiting for the client to download, parse and execute the JavaScript needed to render the page.

"서버에서 HTML을 생성하면 사용자가 페이지를 렌더링하는 데 필요한 JavaScript를 클라이언트가 다운로드, 파싱, 실행하길 기다리지 않고 즉시 페이지를 볼 수 있다."

- **without waiting for the client**: CC만 있는 SPA에서 사용자가 뭔가를 보려면 JS 번들이 도착하고 실행될 때까지 기다려야 한다. SC는 서버에서 HTML을 미리 만들어 보내므로 JS 실행 전에 화면이 표시된다.

> Data for the entire page must be fetched from the server before any components can be shown. The only way around this is to fetch data client-side in a useEffect() hook, which has a longer roundtrip than server-side fetches and happens only after the component is rendered and hydrated.

"페이지 전체의 데이터가 서버에서 패칭되어야 컴포넌트가 표시될 수 있다. 이를 우회하는 유일한 방법은 useEffect()에서 클라이언트 사이드 데이터 패칭인데, 이는 서버 사이드 패칭보다 왕복 시간이 길고 컴포넌트가 렌더링되고 hydrate된 후에야 발생한다."

- **longer roundtrip**: CC의 데이터 패칭 경로: 번들 다운로드 → 파싱 → 렌더링 → hydration → useEffect 실행 → API 호출. SC는 서버에서 직접 API 호출 후 HTML 생성. 경로가 훨씬 짧다.

```
CC useEffect 데이터 패칭 경로
브라우저 → 서버 (HTML 요청)
  → 빈 HTML 도착 (데이터 없음)
  → JS 번들 다운로드
  → 컴포넌트 렌더링 + hydration
  → useEffect 실행
  → API 서버 요청
  → 데이터 도착 → 화면 업데이트

SC 데이터 패칭 경로
브라우저 → 서버 (페이지 요청)
  → 서버에서 직접 API 호출 (빠른 경로)
  → 데이터 포함된 HTML 전송
  → 화면 즉시 표시
```

---
## 종합

SC의 초기 로딩 속도 개선은 두 방향에서 온다. 첫째, 서버에서 HTML을 미리 생성해 JS 실행 대기 없이 즉시 표시한다. 둘째, 데이터 패칭이 클라이언트 hydration 이후가 아닌 서버 렌더링 시점에 발생해 불필요한 네트워크 왕복이 제거된다.

---

# 네트워크 비용은 어떻게 절감되는가?

## 도입

클라이언트에서 여러 API를 호출하면 각각 별도의 네트워크 요청이 발생한다. SC는 이 여러 요청을 하나의 서버 왕복으로 압축할 수 있다.

---
## 본문

> 1. Perform multiple data fetches with single round-trip instead of multiple individual requests on the client.

"1. 클라이언트에서 여러 개별 요청 대신 단일 왕복으로 여러 데이터 패칭을 수행한다."

> 2. Depending on your region, data fetching can also happen closer to your data source, reducing latency and improving performance.

"2. 지역에 따라 데이터 패칭이 데이터 소스에 더 가까운 곳에서 발생할 수 있어 지연 시간을 줄이고 성능을 개선한다."

- **single round-trip**: 브라우저 → Next.js 서버로 한 번 요청하면, Next.js 서버가 백엔드 API들을 병렬로 호출하고 결과를 합쳐서 응답한다. 클라이언트 입장에서는 왕복 1회.
- **closer to your data source**: 프론트 서버와 API 서버가 같은 데이터센터 또는 VPC 내부에 있으면 물리적 거리가 가깝다. 클라이언트(사용자 기기)가 API 서버를 직접 호출하는 것보다 훨씬 낮은 지연이다.

```
CC 방식 (클라이언트에서 여러 요청)
사용자 기기 → API 1 (100ms)
사용자 기기 → API 2 (150ms)
사용자 기기 → API 3 (80ms)
합계: 150ms (병렬이어도 가장 느린 것에 의존)
+ 클라이언트-서버 거리 지연 추가

SC 방식 (서버에서 한 번에)
사용자 기기 → Next.js 서버 (30ms)
             Next.js 서버 → API 1 (10ms, 근거리)
             Next.js 서버 → API 2 (12ms, 근거리)
             Next.js 서버 → API 3 (8ms, 근거리)
전체: ~52ms
```

---
## 종합

SC의 네트워크 비용 절감은 "클라이언트-서버 거리 감소"와 "왕복 횟수 감소" 두 가지에서 온다. 사용자 기기에서 API 서버까지의 왕복 N번이 서버-서버 빠른 경로 1번으로 압축된다. 특히 사용자가 물리적으로 API 서버와 멀리 있는 경우(해외 사용자 등) 이 차이가 크다.

---

# Client Component는 언제 사용하는가?

## 도입

Next.js App Router에서 모든 컴포넌트는 기본적으로 Server Component다. Client Component는 특정 기능이 필요할 때만 선택적으로 사용한다. 언제 Client Component가 필요한지를 명확히 알아야 불필요하게 클라이언트 번들을 키우지 않는다.

---
## 본문

공식 문서는 Client Component가 필요한 상황을 네 가지로 든다 — 상태와 이벤트 처리(`onClick`, `onChange`), 생애주기 처리(`useEffect`), 브라우저에만 있는 기능(`localStorage`, `window`, `Navigator.geolocation`), 그리고 이것들을 쓰는 커스텀 훅이다.

- **상태와 이벤트 처리**: 서버는 화면을 만들어 보내는 시점에 실행되고 끝난다. 그 뒤에 사용자가 누르는 버튼을 처리하려면 브라우저에서 도는 코드가 있어야 한다.
- **브라우저에만 있는 기능**: `window`, `document`, `localStorage` 같은 것들은 브라우저 안에서만 존재한다. 서버에는 아예 없으므로 Server Component에서는 쓸 수 없다.
- **커스텀 훅**: 위의 것들을 안에서 쓰는 훅이라면, 그 훅을 쓰는 컴포넌트도 클라이언트 쪽이어야 한다.

이 네 가지 외에 `"use client"`가 필요한 경우는 없다. 상호작용도 없고 브라우저 API도 안 쓴다면 Server Component로 두는 것이 맞다.

```
Client Component를 써야 하는 경우    Server Component로 충분한 경우
──────────────────────────────────    ─────────────────────────────
useState, useReducer 사용             데이터 패칭 후 렌더링
useEffect, useLayoutEffect 사용       DB 직접 접근
onClick, onSubmit 이벤트 핸들러       정적 콘텐츠 표시
localStorage, window 접근             SEO 필요한 콘텐츠
React Context 생성/소비               레이아웃 컴포넌트
```

---
## 종합

Client Component는 "클라이언트에서만 할 수 있는 것"이 필요할 때만 사용한다. 상호작용 없이 데이터를 보여주기만 하는 컴포넌트는 Server Component로 두어 클라이언트 번들에서 제외하는 것이 기본 원칙이다. CC를 남용하면 번들 크기가 커지고 hydration 비용이 늘어난다.

---

# `"use client"` 지시어는 무엇이고 어디에 붙이는가?

## 도입

`"use client"`는 Server와 Client Component 사이의 경계를 선언하는 지시어다. 파일마다 붙여야 한다고 생각하기 쉽지만, 실제로는 경계의 "시작점"에만 붙이면 된다.

---
## 본문

> You can create a Client Component by adding the `"use client"` directive at the top of the file, above your imports.

"파일 맨 위, import보다 위에 `"use client"` 지시어를 적으면 그 파일은 Client Component가 된다."

> `"use client"` is used to declare a **boundary** between the Server and Client module graphs (trees).

"`"use client"`는 서버 쪽 모듈 관계망과 클라이언트 쪽 모듈 관계망 사이의 **경계**를 선언하는 데 쓰인다."

- **above your imports**: 파일의 가장 첫 줄에 있어야 한다. 다른 코드 아래에 넣으면 Next.js가 인식하지 못한다.
- **boundary**: 단순한 파일 표시가 아니라 실제 모듈 경계다. 이 경계를 기준으로 서버 번들과 클라이언트 번들이 갈린다.
- **module graphs (trees)**: 어떤 파일이 어떤 파일을 불러오는지 이어 놓은 관계망. 경계가 어디까지 미치는지는 이 관계망을 따라 정해진다.

경계가 관계망을 따라 정해지므로, 지시어는 경계가 시작되는 파일 하나에만 있으면 된다. 그 아래로 이어지는 파일들은 따로 적지 않아도 클라이언트 쪽으로 함께 넘어간다.

```
"use client" 전파 방식

ParentClient.tsx  ← "use client" 선언
  └── ChildA.tsx  ← "use client" 없어도 CC 취급
  └── ChildB.tsx  ← "use client" 없어도 CC 취급
        └── ChildC.tsx ← "use client" 없어도 CC 취급
```

---
## 종합

`"use client"`는 파일 단위가 아닌 모듈 트리 단위의 경계다. 최상위 CC 파일에 한 번 선언하면 그 파일에서 import하는 모든 하위 모듈이 클라이언트 번들에 포함된다. 이 전파 특성 때문에 `"use client"` 선언 위치를 신중하게 결정해야 한다 — 너무 상위에 두면 원래 SC로 두었을 컴포넌트들도 CC 취급되어 번들이 커진다.

---

# `"use client"`를 붙인 파일에서 그 선언은 어디까지 번지는가?

## 도입

`"use client"`는 붙인 그 파일 하나만 클라이언트로 만드는 표시가 아니다. 그 파일이 import한 것과 그 파일이 직접 그리는 컴포넌트까지 함께 클라이언트 번들로 딸려 들어간다. 그래서 경계를 "파일 하나"로 생각하면 실제 번들 크기를 잘못 예측하게 된다.

---
## 본문

> Once a file is marked with `"use client"`, **all of its imports and the components it directly renders are included in the client bundle**. This means you don’t need to add the directive to every component that is intended for the client.

"어떤 파일에 `"use client"`가 붙는 순간, 그 파일이 import한 모든 것과 그 파일이 직접 렌더하는 컴포넌트가 클라이언트 번들에 포함된다. 따라서 클라이언트에서 쓸 컴포넌트마다 지시어를 붙일 필요가 없다."

- **all of its imports**: 그 파일이 불러온 모든 모듈. 컴포넌트뿐 아니라 유틸 함수·라이브러리도 포함된다.
- **directly renders**: 그 파일 안에서 `<Child />`처럼 직접 JSX로 그리는 컴포넌트. 뒤에 나오는 "props로 건네받은 컴포넌트"와 구분되는 지점이다.
- **you don’t need to add the directive to every component**: 지시어는 경계가 시작되는 지점에 한 번만 있으면 된다. 하위 파일마다 반복해 붙이는 것은 불필요하다.

> This behavior applies to components that are part of the Client Component’s module graph, which includes the modules it imports and the components it renders directly.

"이 동작은 해당 Client Component의 모듈 그래프에 속한 컴포넌트에 적용되며, 여기에는 그 컴포넌트가 import한 모듈과 직접 렌더하는 컴포넌트가 포함된다."

- **module graph**: 어떤 파일이 어떤 파일을 import하는지 이어 놓은 관계망. 여기서 경계의 범위를 정하는 기준이 바로 이 관계망이다.

```
"use client"가 번지는 범위

ClientEntry.tsx   ← "use client" 여기 한 번
├── import Button.tsx        → 클라이언트 번들 포함
├── import formatDate.ts     → 클라이언트 번들 포함
└── <Panel /> 직접 렌더       → 클라이언트 번들 포함
      └── import Icon.tsx    → 클라이언트 번들 포함 (계속 이어짐)
```

이 범위를 모르면 어떤 일이 생기는가. 무거운 라이브러리를 쓰는 컴포넌트를 무심코 `"use client"` 파일 안에서 import하면, 그 라이브러리까지 통째로 브라우저로 내려간다. 지시어를 최상위 레이아웃에 붙였을 때 번들이 갑자기 커지는 이유가 이것이다.

---
## 종합

경계는 파일 하나가 아니라 import 관계를 타고 번지는 범위다. 지시어를 어디에 붙이느냐가 곧 "여기서부터 아래는 전부 브라우저로 보낸다"는 선언이므로, 상호작용이 실제로 필요한 가장 안쪽 파일에 붙이는 것이 번들을 작게 유지하는 방법이다. 다만 이 번짐에는 예외가 하나 있는데, 다음 질문에서 다룬다.

---

# `children`이나 props로 넘긴 Server Component도 client bundle에 포함되는가?

## 도입

앞 질문에서 `"use client"`가 import 관계를 타고 번진다고 했다. 그런데 Client Component가 `children`으로 받아 화면에 끼워 넣는 Server Component는 이 번짐의 대상이 아니다. 흔히 혼동하는 지점이라 규칙과 이유를 함께 봐두면 좋다.

---
## 본문

> It does not apply to Server Components passed as children or other props. Those components are not imported into the Client Component’s module graph. They are rendered on the server and passed to the Client Component as rendered output.

"이 규칙은 `children`이나 다른 props로 전달된 Server Component에는 적용되지 않는다. 그 컴포넌트들은 Client Component의 모듈 그래프에 import된 적이 없다. 그것들은 서버에서 렌더링된 뒤 이미 렌더링된 결과물로서 Client Component에 전달된다."

- **passed as children or other props**: Client Component가 직접 import해서 그리는 것이 아니라, 바깥(서버 쪽)에서 이미 만들어 넘겨주는 형태.
- **not imported into the module graph**: import 관계망에 아예 등장하지 않는다는 뜻. 번들에 무엇을 담을지는 이 관계망을 따라 결정되므로, 관계망 밖에 있으면 번들에도 담기지 않는다.
- **as rendered output**: 컴포넌트 코드가 아니라 이미 그려진 결과가 건너간다. Client Component는 그 결과를 어디에 배치할지만 정한다.

```
import한 경우 (번들에 포함)          children으로 받은 경우 (번들에 제외)
───────────────────────────         ─────────────────────────────────────
ClientBox.tsx                        Page.tsx (서버)
'use client'                           <ClientBox>
import Child from './Child'              <ServerContent />  ← 서버에서 먼저 그려짐
→ Child 코드가 브라우저로            </ClientBox>
                                     → ClientBox는 결과만 받아 배치
```

비유하자면, 내 집 살림은 내가 사들인 물건만 해당한다. 세를 준 방에 세입자가 들여놓은 가구는 내 짐이 아니다. Client Component가 import한 것은 자기 살림이라 함께 옮겨지지만, `children` 자리에 남이 채워 넣은 것은 자기 짐이 아니라 그대로 두면 된다.

이 규칙은 같은 폴더의 조합 문서(`composition.md`)가 다루는 `children` 슬롯 패턴 — Client Component가 Server Component를 import하는 대신 `children`으로 받는 방식 — 이 왜 성립하는지의 근거이기도 하다. 넘겨받은 컴포넌트는 모듈 그래프 밖이라, 서버 전용 코드가 브라우저로 새어 나가지 않는다.

---
## 종합

번지는 범위를 정하는 기준은 "누가 import했는가"이지 "누가 화면 어디에 놓았는가"가 아니다. Client Component가 직접 import한 것은 코드째 브라우저로 가고, props로 건네받은 Server Component는 서버에서 결과까지 만들어진 뒤 그 결과만 건너간다. 이 예외가 없다면 Client Component 안쪽에는 서버 전용 코드를 한 조각도 놓을 수 없어, 대화형 껍데기와 서버 데이터를 섞어 쓰는 구성 자체가 불가능해진다.

---

# 클라이언트 번들을 줄이려면 `"use client"`를 어디에 붙여야 하는가?

## 도입

앞 질문에서 본 대로 `"use client"`는 붙인 자리에서 아래로 번진다. 그래서 지시어를 어디에 붙이느냐가 곧 브라우저로 내려보내는 코드의 양을 정한다.

---
## 본문

> To reduce the size of your client JavaScript bundles, add `'use client'` to specific interactive components instead of marking large parts of your UI as Client Components.

"클라이언트 JavaScript 번들 크기를 줄이려면, UI의 큰 덩어리를 통째로 Client Component로 표시하는 대신 상호작용이 필요한 특정 컴포넌트에만 `'use client'`를 붙인다."

- **specific interactive components**: 실제로 클릭·입력을 받는 그 컴포넌트 하나를 말한다. 그것을 감싸고 있는 바깥까지 함께 넘길 이유는 없다.
- **large parts of your UI**: 레이아웃이나 페이지처럼 위쪽에 있는 넓은 범위. 여기에 지시어를 붙이면 그 아래 전부가 브라우저로 딸려 간다.

> `<Search />` is interactive and needs to be a Client Component, however, the rest of the layout can remain a Server Component.

"`<Search />`는 상호작용이 필요하므로 Client Component여야 하지만, 레이아웃의 나머지는 Server Component로 남겨 둘 수 있다."

즉 화면을 작은 조각으로 나눠 두면, 상호작용이 필요한 조각만 클라이언트 쪽으로 넘기고 나머지는 서버 쪽에 그대로 둘 수 있다. 나누는 단위가 작을수록 브라우저로 내려가는 양이 줄어든다.

```
지시어를 붙이는 위치 비교

번들이 커지는 방식 — 레이아웃 전체를 CC로
'use client';
export default function Layout() {
  return (
    <div>
      <Logo />         {/* 정적, CC 불필요 */}
      <Nav />          {/* 정적, CC 불필요 */}
      <SearchBar />    {/* 상호작용 필요 */}
    </div>
  );
}

번들이 작아지는 방식 — 필요한 부분만 CC로
// Layout.tsx (SC)
export default function Layout() {
  return (
    <div>
      <Logo />      {/* SC */}
      <Nav />       {/* SC */}
      <SearchBar /> {/* CC (별도 파일) */}
    </div>
  );
}
```

---
## 종합

지시어는 상호작용이 실제로 필요한 가장 안쪽 컴포넌트에 붙인다. 로고, 링크, 정적 텍스트는 서버 쪽에 남겨 번들에서 빠지게 하고, 버튼·폼·검색바처럼 실제로 반응해야 하는 것만 별도 파일로 떼어 클라이언트로 넘긴다. 이 분리를 세밀하게 할수록 클라이언트 번들이 작아지고 hydration 비용이 줄어든다.

---

# Server Component에서 Client Component로 데이터를 어떻게 넘기는가?

## 도입

서버에서 실행되는 컴포넌트가 읽어 온 데이터를, 브라우저에서 실행되는 컴포넌트가 화면에 써야 하는 상황은 흔하다. 이때 쓰는 수단은 React에서 늘 쓰던 그것 — props다. 서버와 클라이언트 사이라고 해서 별도의 전달 장치가 따로 있는 것이 아니다.

---
## 본문

> You can pass data from Server Components to Client Components using props.

"Server Component에서 Client Component로 데이터를 넘길 때는 props를 사용한다."

- **using props**: 새로운 전달 수단이 아니라 평소 쓰던 그 props다. `<LikeButton likes={10} />`처럼 쓰면 된다.

서버 쪽 컴포넌트가 DB나 API를 직접 호출해 값을 읽고, 그중 화면에 필요한 것만 골라 자식에게 내려보내는 식이다. 가져온 것을 통째로 넘기는 것이 아니다.

```tsx
// page.tsx (서버)
import LikeButton from './like-button'

export default async function Page() {
  const post = await db.post.find(1)                        // 서버에서 조회
  return <LikeButton postId={post.id} likes={post.likes} /> // 필요한 값만 전달
}
```

```tsx
// like-button.tsx
'use client'

export default function LikeButton({ postId, likes }: { postId: number; likes: number }) {
  const [count, setCount] = useState(likes) // 넘겨받은 값을 초기 상태로
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

레코드 전체(`post`)를 그대로 넘기지 않고 `postId`·`likes`만 넘긴 데는 이유가 있다. 넘긴 값은 브라우저까지 실제로 전송되므로, 화면에 쓰지도 않는 필드까지 넘기면 그만큼 전송량이 늘고 서버에만 있어야 할 값이 딸려 나갈 수도 있다.

---
## 종합

서버에서 클라이언트로 데이터를 넘기는 일은 props 하나로 끝난다. 서버 쪽 컴포넌트가 데이터를 읽어 두고, 그중 화면에 필요한 값만 골라 자식 Client Component의 props로 내려보낸다. 덕분에 DB 접근이나 비밀 키를 쓰는 코드는 서버에 남고 브라우저에는 결과 값만 도착한다. 다만 이 경로에는 네트워크가 끼어 있어서 아무 값이나 그대로 넘길 수 있는 것은 아니며, 그 조건은 이어지는 질문에서 다룬다.

---

# 넘기는 값에는 어떤 제약이 있는가?

## 도입

SC에서 CC로 값을 넘길 때 아무 값이나 되는 것은 아니다. 넘길 수 있는 값에는 조건이 하나 붙는다.

---
## 본문

> Props passed to Client Components need to be serializable by React.

"Client Component로 전달되는 props는 React가 직렬화할 수 있어야 한다."

- **serializable**: 직렬화 가능한. 값을 네트워크로 전송 가능한 문자열/바이트 형태로 바꿀 수 있는 성질. JSON으로 표현 가능한 것들(string, number, boolean, null, array, plain object)이 해당한다.

이 조건이 붙는 이유는 SC와 CC 사이에 네트워크가 끼어 있기 때문이다.

```
서버                               클라이언트
────────────────────────           ──────────────────────────
SC 실행 → props 생성
         ↓ (네트워크 전송)
         RSC Payload에 포함        CC가 props를 받아 사용
```

SC의 props는 RSC Payload에 실려 네트워크를 건너야 한다. 함수는 이 형태로 바꿀 수 없다 — 함수 코드를 브라우저에서 실행하려면 클라이언트 번들에 포함시켜야 하는데, 그것은 CC의 역할이다. 클래스의 인스턴스도 같은 이유로 넘어가지 않는다.

---
## 종합

SC → CC props 직렬화 제약은 RSC 아키텍처의 근본 제약이다. SC는 서버에서 실행되고 CC는 클라이언트에서 실행되어, 두 환경 사이에 네트워크가 있다. 네트워크를 건너는 데이터는 직렬화될 수 있어야 한다. 함수를 props로 넘기고 싶다면 그 컴포넌트 자체를 CC로 만들어야 한다.

---

# Client Component 안에 서버가 그린 UI를 넣으려면 어떻게 하는가?

## 도입

모달·탭·아코디언처럼 열고 닫는 껍데기는 브라우저 상태를 쓰므로 Client Component여야 한다. 그런데 그 안쪽에 들어갈 내용은 서버에서 데이터를 읽어 와야 한다면, Client Component가 Server Component를 직접 import해서 쓰면 될까. 그 길은 막혀 있다. 대신 안쪽 자리만 비워 두고, 그 자리를 바깥에서 채워 넣는 방법이 있다.

---
## 본문

> You can pass Server Components as a prop to a Client Component. This allows you to visually nest server-rendered UI within Client components.

"Server Component를 Client Component에 props로 넘길 수 있다. 그러면 서버에서 그려진 UI를 Client Component 안쪽에 겹쳐 넣을 수 있다."

- **as a prop**: 불러오는 관계가 아니라 건네주는 관계다. Client Component가 상대를 찾아가는 게 아니라, 바깥에서 만들어 손에 쥐여 준다.
- **visually nest**: 화면에서 보기에 안쪽에 들어가 있다는 뜻이다. 코드상의 포함 관계와는 별개다 — 뒤의 예시에서 모달 파일에는 장바구니라는 이름이 한 번도 등장하지 않는다.

> A common pattern is to use `children` to create a *slot* in a `<ClientComponent>`. For example, a `<Cart>` component that fetches data on the server, inside a `<Modal>` component that uses client state to toggle visibility.

"흔한 방식은 `children`을 써서 `<ClientComponent>` 안에 빈자리를 하나 만들어 두는 것이다. 예를 들어 서버에서 데이터를 가져오는 `<Cart>`를, 열고 닫는 상태를 가진 `<Modal>` 안에 넣는 경우가 그렇다."

- **slot**: 비워 둔 자리. Client Component는 "여기에 무언가 들어온다"는 위치만 정해 두고, 무엇이 들어올지는 정하지 않는다.
- **toggle visibility**: 보임과 숨김을 상태로 전환한다는 뜻. 이건 브라우저에서만 할 수 있는 일이라 모달 쪽이 Client Component여야 한다.

```tsx
'use client'

export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

```tsx
import Modal from './ui/modal'
import Cart from './ui/cart'

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

이 두 파일에서 눈여겨볼 지점은 **모달이 장바구니를 import하지 않는다**는 것이다. 모달이 아는 것은 `children`이라는 이름의 자리 하나뿐이고, 거기에 무엇이 들어올지는 모른다. 둘을 실제로 붙이는 쪽은 부모인 `Page` — 즉 Server Component다. 조립을 서버 쪽에서 하기 때문에, 장바구니는 서버에서 그려진 뒤 결과만 모달 안으로 들어간다.

```
Page (서버)  ← 여기서 둘을 조립
├── <Modal>            CC: 빈자리(children)만 만든다
│     └── children ─── 자리
└── <Cart />           SC: 서버에서 그려진 뒤 그 자리로 들어감

Modal 파일이 아는 것: children 하나
Modal 파일이 모르는 것: 그 자리에 Cart가 온다는 사실
```

이 방식이 왜 성립하는지 — 즉 넘겨받은 Server Component가 왜 브라우저 번들로 딸려 들어가지 않는지 — 는 같은 폴더의 [`boundary.md`](./boundary.md)의 「`children`이나 props로 넘긴 Server Component도 client bundle에 포함되는가?」에서 다룬다.

---
## 종합

막다른 길처럼 보이던 제약은 방향을 바꾸면 풀린다. Client Component가 안쪽 내용을 직접 불러오려 하면 막히지만, `children`으로 빈자리만 열어 두고 부모인 Server Component가 둘을 붙여 주면 그만이다. Client Component의 책임은 "무엇을 그릴지"가 아니라 "어디에 놓을지"로 줄어들고, 서버에서 데이터를 읽는 일은 그대로 서버에 남는다. 열고 닫는 동작은 브라우저가, 안에 담기는 내용은 서버가 맡는 식으로 역할이 깔끔하게 갈린다.

---

# Client Component에서 Server Component를 import할 수 없는 이유는?

## 도입

Server Component를 Client Component 안에서 import하면 에러가 발생한다. 이 제약은 단순한 기술 제약이 아니라 SC와 CC가 렌더링되는 시점과 환경의 차이에서 비롯된다.

---
## 본문

> Since Client Components are rendered after Server Components, you cannot import a Server Component into a Client Component module (since it would require a new request back to the server).

"Client Component는 Server Component 이후에 렌더링되므로, Client Component 모듈에 Server Component를 import할 수 없다(서버로 새 요청이 필요하기 때문이다)."

> Instead, you can pass a Server Component as props to a Client Component.

"대신, Server Component를 Client Component에 props로 전달할 수 있다."

- **rendered after**: CC는 hydration 시점에 클라이언트에서 실행된다. SC는 이미 서버에서 실행이 끝난 상태다. CC가 실행되는 시점에 서버 코드를 불러오려면 네트워크 요청이 필요한데, 이는 React 렌더링 모델에서 지원하지 않는다.

> `<ClientComponent>` doesn't know that children will eventually be filled in by the result of a Server Component. The only responsibility `<ClientComponent>` has is to decide where children will eventually be placed.

"`<ClientComponent>`는 children이 결국 Server Component의 결과로 채워진다는 것을 알지 못한다. `<ClientComponent>`의 유일한 책임은 children이 결국 어디에 배치될지를 결정하는 것이다."

props로 전달하는 패턴:

```tsx
// 올바른 패턴 — SC를 props로 전달
// ParentServer.tsx (SC)
import ClientContainer from './ClientContainer';
import ServerContent from './ServerContent';

export default function Page() {
  return (
    <ClientContainer>
      <ServerContent /> {/* SC가 미리 렌더링되어 children으로 전달 */}
    </ClientContainer>
  );
}

// ClientContainer.tsx (CC)
'use client';
export default function ClientContainer({ children }) {
  const [open, setOpen] = useState(false);
  return <div>{open && children}</div>;
}
```

- **lifted up**: "content lifting" 패턴. CC가 SC를 직접 알지 못하고, SC의 렌더링 결과만 children으로 받는다. CC와 SC가 독립적으로 렌더링된다.

---
## 종합

SC를 CC 안에 import할 수 없는 본질적 이유는 실행 환경의 분리다. SC는 서버에서만 실행되고, CC는 클라이언트에서 실행된다. 두 환경을 넘나드는 import는 불가능하다. children이나 props를 통해 SC의 렌더링 결과(이미 HTML/RSC Payload로 변환된 것)를 CC에 전달하는 것은 가능하다.

---

# props로 넘긴 Server Component는 언제 그려지는가?

## 도입

`children`으로 넘긴 Server Component가 언제 실행되는지는 헷갈리기 쉬운 지점이다. 모달이 브라우저에서 열리는 순간 안쪽이 그려지는 것처럼 보이지만, 실제 실행 시점은 그보다 훨씬 앞이다.

---
## 본문

> In this pattern, Server Components are rendered on the server ahead of time, even when passed as props to Client Components.

"이 방식에서 Server Component는 서버에서 미리 그려진다. Client Component에 props로 넘겨지는 경우에도 마찬가지다."

- **ahead of time**: 미리. Client Component가 브라우저에서 실행되기 한참 전에 이미 그리기가 끝나 있다.
- **even when passed as props**: props로 넘어간다고 해서 예외가 되지 않는다는 뜻이다. 넘어가는 것은 컴포넌트 함수가 아니라 이미 그려진 결과다.

> The React Server Component Payload contains the rendered result of those Server Components, plus placeholders for where Client Components should be rendered and references to their JavaScript files.

"React Server Component Payload에는 그렇게 그려진 Server Component의 결과물이 담기고, 여기에 더해 Client Component가 그려질 자리 표시와 그 코드가 들어 있는 JavaScript 파일의 주소가 함께 담긴다."

- **rendered result**: 실행이 끝난 결과. 브라우저는 이 결과를 받아 화면에 놓기만 하면 되고, 다시 그리지 않는다.
- **placeholders**: 자리 표시. "여기는 브라우저가 채운다"고 비워 둔 지점이다.
- **references to their JavaScript files**: 그 빈자리를 채울 Client Component 코드가 어느 파일에 있는지 알려 주는 주소. 브라우저는 이 주소를 보고 필요한 파일만 내려받는다.

```
서버                                     브라우저
──────────────────────────────           ──────────────────────────
Cart 실행 → 결과물 완성
Modal은 실행 안 됨 → 자리 표시만
        ↓ RSC Payload 전송
                                         Modal 코드 내려받아 실행
                                         자리에 Cart 결과물을 끼움
```

여기서 말하는 RSC Payload가 정확히 무엇인지는 같은 폴더 [`pipeline.md`](./pipeline.md)에서 다룬다.

---
## 종합

넘어가는 것은 코드가 아니라 결과다. Server Component는 클라이언트 컴포넌트의 props 자리로 들어가더라도 서버에서 먼저 실행을 마치고, 그 결과물만 전송에 실린다. 브라우저 쪽에는 "여기에 무언가 들어간다"는 표시와 그 위치에 놓을 완성품이 함께 도착하므로, 모달을 열어 보기 전에 이미 안쪽 내용은 만들어져 있는 셈이다. 이 순서를 알아야 "모달을 열 때 서버 요청이 한 번 더 나가는 것 아닌가" 하는 오해를 피할 수 있다.
