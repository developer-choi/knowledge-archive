# 스트리밍이 시작되면 응답에서 무엇을 더 이상 바꿀 수 없는가?

## 도입

스트리밍의 이득에는 대가가 따른다. HTTP 응답은 머리말(헤더)이 먼저 나가고 본문이 뒤따르는 구조다. 본문을 일찍 보내기 시작한다는 건 머리말을 이미 확정해 보냈다는 뜻이다.

---
## 본문

> Once streaming begins, the HTTP response headers (including the status code) have already been sent to the client.

"스트리밍이 시작되면, HTTP 응답 헤더(상태 코드 포함)는 이미 클라이언트로 전송된 상태다."

- **Once ... begins**: 시작되는 그 순간부터. 시작 시점이 곧 헤더 확정 시점이다.
- **including the status code**: 상태 코드를 포함해서. 200이냐 404냐 하는 값이 헤더에 들어 있으므로 함께 굳는다.

> **You cannot change the status code or headers after streaming starts.**

"**스트리밍이 시작된 뒤에는 상태 코드나 헤더를 바꿀 수 없다.**"

- 원문에서 굵게 강조된 문장이다. 프레임워크의 제약이 아니라 HTTP 프로토콜 자체의 성질이라 우회할 방법이 없다.

> Everything in this section flows from this fundamental constraint.

"이 절의 모든 내용이 이 근본적인 제약에서 흘러나온다."

- **flows from**: ~에서 파생된다. 뒤따르는 세 질문(언제 시작되는가 / 도중에 `notFound()`가 터지면 / 진짜 404를 내려면)이 전부 이 하나의 제약을 각도만 바꿔 본 것이라는 예고다.

```
HTTP 응답의 순서와 되돌릴 수 없는 지점

[상태 코드 + 헤더]  ← 한 번 나가면 수정 불가
        ↓
[본문 덩어리 1] [본문 덩어리 2] … ← 여기서 무슨 일이 생겨도 위를 못 고침
```

파생되는 세 가지 귀결을 미리 짚어 두면 이렇다. 첫째, 그렇다면 "시작 시점"이 정확히 언제인지를 알아야 한다. 둘째, 시작 후에 문제가 생기면(예: 페이지가 없다는 사실을 뒤늦게 알면) 상태 코드 대신 다른 수단을 써야 한다. 셋째, 진짜 상태 코드가 필요하면 시작 전에 판단을 끝내야 한다.

---
## 종합

스트리밍은 "본문을 일찍 내보내는" 최적화이고, HTTP에서 본문보다 앞서는 것은 머리말이다. 따라서 본문 전송을 앞당긴 만큼 머리말 확정 시점도 앞당겨진다. 이 교환은 되돌릴 수 없다. 이미 나간 바이트를 회수할 방법이 없기 때문이다. 이어지는 세 질문은 이 제약이 실제 상황에서 어떤 모습으로 나타나는지를 하나씩 짚는다.

---

# 스트리밍은 정확히 언제 시작되는가?

## 도입

앞 질문에서 "시작되면 헤더가 굳는다"고 했으니, 그 시작 시점을 정확히 아는 것이 중요해진다. 코드에서 어떤 일이 벌어질 때 응답 본문이 나가기 시작하는가를 본다.

---
## 본문

> The response body begins streaming when a Suspense fallback renders (for example, a `loading.tsx`) or when a component suspends under a `<Suspense>` boundary.

"응답 본문은 Suspense 대체 화면이 렌더링될 때(예를 들어 `loading.tsx`), 또는 `<Suspense>` 경계 아래의 컴포넌트가 중단될 때 스트리밍을 시작한다."

- **The response body**: 응답 본문. 헤더가 아니라 본문이 나가기 시작하는 시점을 말한다.
- **a component suspends**: 컴포넌트가 "아직 못 그리겠다"고 중단되는 것. 그 순간 그 자리를 대체 화면으로 채워 먼저 내보내야 하므로 전송이 출발한다.
- 두 조건은 사실상 같은 사건의 양면이다. 무언가 중단되면 대체 화면이 렌더링되고, 대체 화면이 나가려면 응답이 출발해야 한다.

> When a `<Suspense>` fallback renders or a component suspends, the server must commit to `200 OK` in order to start sending the HTML stream.

"`<Suspense>` 대체 화면이 렌더링되거나 컴포넌트가 중단되면, 서버는 HTML 스트림을 보내기 시작하기 위해 `200 OK`로 확정해야 한다."

- **must commit to**: ~로 확정해야 한다. 되돌릴 수 없는 선택을 한다는 어감이다.
- **`200 OK`**: 정상 응답을 뜻하는 상태 코드. 이 시점에는 뒤에 무슨 일이 생길지 아직 모르지만, 무언가는 보내야 하므로 일단 정상으로 선언한다.
- **in order to**: ~하기 위해서. 상태 코드 확정이 전송의 전제 조건이라는 인과가 이 표현에 담겨 있다.

```
시작 시점의 인과

컴포넌트 중단 발생
   → 대체 화면을 내보내야 함
   → 본문 전송 시작해야 함
   → 그러려면 헤더가 먼저 나가야 함
   → 상태 코드를 200으로 확정
   → (이 지점 이후 상태 코드 변경 불가)
```

여기서 알 수 있는 실무적 함의가 있다. 대체 화면이 뜬다는 것은 곧 상태 코드가 이미 200으로 굳었다는 뜻이다. 그래서 "로딩 화면이 잠깐 보였다가 404 페이지가 뜨는" 상황에서 실제 HTTP 상태 코드는 404가 아니라 200이다.

---
## 종합

스트리밍의 시작 방아쇠는 시간이나 크기가 아니라 "중단이 처음 일어난 순간"이다. 컴포넌트 하나가 중단되면 대체 화면을 내보내야 하고, 내보내려면 헤더가 먼저 나가야 하며, 헤더가 나가려면 상태 코드가 정해져야 한다. 이 연쇄 때문에 서버는 아직 결과를 다 모르는 상태에서 `200 OK`를 선언하게 된다. 앞 질문의 제약이 실제로 발효되는 지점이 바로 여기다.

---

# 스트리밍 도중에 `notFound()`가 터지면 어떻게 되는가?

## 도입

상태 코드가 이미 200으로 굳은 뒤에 "이 페이지는 없는 페이지였다"는 사실이 밝혀지면 어떻게 되는가. 제약은 그대로이므로, Next.js는 상태 코드 대신 본문 안에서 해결한다.

---
## 본문

> If a `notFound()` fires mid-stream, Next.js cannot go back and change the status to 404.

"스트리밍 도중에 `notFound()`가 발동하면, Next.js는 되돌아가서 상태를 404로 바꿀 수 없다."

- **mid-stream**: 스트리밍 도중. 이미 헤더와 첫 덩어리가 나간 뒤라는 뜻이다.
- **cannot go back**: 되돌아갈 수 없다. 이미 네트워크로 나간 바이트를 회수할 수단이 없다.

> Instead, it injects `<meta name="robots" content="noindex">` into the streamed HTML so that search engines don't index the page.

"대신 스트리밍되는 HTML 안에 `<meta name="robots" content="noindex">`를 주입해 검색 엔진이 그 페이지를 색인하지 않게 한다."

- **injects**: 주입한다. 아직 보내지 않은 본문에 태그를 끼워 넣는 것은 가능하다. 못 바꾸는 것은 이미 나간 헤더뿐이다.
- **noindex**: 검색 엔진에게 이 페이지를 검색 결과에 넣지 말라고 알리는 표시. 상태 코드로 못 알리니 본문의 태그로 알리는 것이다.
- **don't index**: 색인하지 않는다. 404의 목적 중 "없는 페이지가 검색에 잡히지 않게 한다"는 부분만 다른 수단으로 대신 달성한다.

> Similarly, a `redirect()` mid-stream becomes a client-side redirect rather than an HTTP redirect header.

"마찬가지로 스트리밍 도중의 `redirect()`는 HTTP 리다이렉트 헤더가 아니라 클라이언트 쪽 리다이렉트가 된다."

- **client-side redirect**: 브라우저가 페이지를 받은 뒤 JavaScript로 주소를 옮기는 방식. 헤더로 옮기는 것보다 한 박자 늦고, 이동 전 화면이 잠깐 보인다.

```
같은 의도, 다른 수단

스트리밍 전 판단              스트리밍 후 판단
notFound() → HTTP 404        notFound() → 200 + <meta noindex>
redirect() → HTTP 3xx 헤더    redirect() → 브라우저에서 주소 이동
```

여기서 잃는 것을 분명히 해 두는 게 좋다. 검색 엔진 색인 문제는 `noindex`로 막을 수 있지만, 상태 코드를 보고 동작하는 다른 것들(모니터링 도구의 오류 집계, 캐시 서버의 처리, API 소비자의 분기)은 여전히 이 응답을 정상으로 본다.

---
## 종합

스트리밍 도중의 `notFound()`는 상태 코드를 바꾸지 못하고, 그래서 Next.js는 본문 안에 색인 금지 표시를 넣는 우회로를 쓴다. `redirect()`도 마찬가지로 헤더 대신 브라우저 쪽 이동으로 바뀐다. 둘 다 "헤더는 이미 나갔다"는 하나의 제약에서 나온 결과이며, 목적의 일부만 대체 수단으로 달성한다는 공통점이 있다. 온전한 상태 코드가 필요하면 판단 시점 자체를 앞당기는 수밖에 없다. 그것이 다음 질문이다.

---

# 진짜 404 상태 코드를 내려면 어떻게 해야 하는가?

## 도입

앞 질문의 우회로는 절반의 해결이었다. 진짜 404를 내려면 방법은 하나뿐이다. 헤더가 나가기 전에, 즉 스트리밍이 시작되기 전에 "없는 페이지"라는 판단을 끝내는 것이다.

---
## 본문

> To get a real HTTP status code for errors, place `notFound()` **before** any `await` or `<Suspense>` boundary:

"오류에 대해 진짜 HTTP 상태 코드를 얻으려면, `notFound()`를 어떤 `await`이나 `<Suspense>` 경계보다도 **앞에** 두어라."

- **a real HTTP status code**: 진짜 상태 코드. 본문 안의 표시가 아니라 헤더에 실린 값을 말한다.
- **before any `await` or `<Suspense>` boundary**: 중단이 일어날 수 있는 모든 지점보다 앞. 중단이 곧 스트리밍 시작이므로, 그 전에 결론을 내야 한다.

```tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exists = await checkSlugExists(slug) // Fast existence check
  if (!exists) notFound() // Real 404, before any Suspense boundary

  return (
    <Suspense fallback={<p>Loading post...</p>}>
      <PostContent slug={slug} />
    </Suspense>
  )
}
```

여기서는 앞서 배운 "맨 위에서 `await`하지 말라"를 의도적으로 어긴다. 주석의 `Fast existence check`가 그 근거다. 존재 여부만 확인하는 빠른 조회를 위쪽에서 기다리는 대신, 무거운 본문 조회(`PostContent`)는 경계 안으로 미룬다. 첫 화면이 조금 늦어지는 것과 정확한 상태 코드를 맞바꾸는 선택이다.

```
비용과 이득의 맞교환

전부 경계 안:   TTFB 빠름, 상태 코드는 항상 200
존재 확인만 위: TTFB가 빠른 조회 시간만큼 늦음, 없는 글은 진짜 404
```

> You can also reject requests early using `proxy` (for redirects, rewrites, or returning a response) or `next.config.js` redirects.

"`proxy`(리다이렉트, 재작성, 응답 반환에 사용)나 `next.config.js`의 리다이렉트 설정으로 요청을 더 일찍 거절할 수도 있다."

- **reject requests early**: 요청을 일찍 거절한다. 페이지 코드에 도달하기도 전에 결론을 내는 방식이다.

> Both run before the page renders, so HTTP status codes are still available.

"둘 다 페이지가 렌더링되기 전에 실행되므로, HTTP 상태 코드를 여전히 쓸 수 있다."

- **still available**: 여전히 사용 가능하다. 헤더가 아직 안 나갔으니 무엇이든 정할 수 있다는 뜻이다.

---
## 종합

진짜 상태 코드를 얻는 방법은 결국 "판단을 헤더보다 앞으로 옮기는 것" 하나로 수렴한다. 페이지 안에서라면 중단이 일어나기 전에 빠른 존재 확인을 끝내고, 페이지 밖이라면 요청이 페이지에 닿기 전 단계에서 걸러 낸다. 어느 쪽이든 스트리밍 시작 시각이 그만큼 늦어지므로 공짜는 아니다. 검색 노출이 중요한 공개 페이지에서는 이 비용을 치를 만하고, 로그인 뒤에서만 쓰이는 화면이라면 굳이 치를 이유가 적다.

---

# 스트리밍 도중에 오류가 나면 화면은 어떻게 되는가?

## 도입

없는 페이지가 아니라 실제 오류가 난 경우다. 여기서도 상태 코드는 이미 굳어 있으므로, 처리는 전부 본문 안에서 이루어진다.

---
## 본문

> If a component throws an error after streaming has started, the nearest `error.js` boundary catches it and renders the error UI in place of the failed component.

"스트리밍이 시작된 뒤에 컴포넌트가 오류를 던지면, 가장 가까운 `error.js` 경계가 그것을 잡아 실패한 컴포넌트 자리에 오류 화면을 렌더링한다."

- **the nearest**: 가장 가까운. `<Suspense>`와 마찬가지로 가장 가까운 경계에서 처리되므로 영향 범위가 최소화된다.
- **in place of**: ~을 대신하여 그 자리에. 페이지를 오류 화면으로 갈아 치우는 게 아니라 해당 구역만 바꾼다.

> The rest of the page remains intact, only the section that errored is replaced.

"페이지의 나머지는 그대로 유지되고, 오류가 난 구역만 교체된다."

- **remains intact**: 손상되지 않고 그대로 남는다. 이미 도착해 화면에 그려진 다른 구역은 영향을 받지 않는다.

> Because the HTTP status code (`200 OK`) has already been sent with the first chunk, it cannot be changed to a `4xx` or `5xx`.

"HTTP 상태 코드(`200 OK`)가 이미 첫 덩어리와 함께 전송됐기 때문에, `4xx`나 `5xx`로 바꿀 수 없다."

- **with the first chunk**: 첫 덩어리와 함께. 헤더는 본문의 첫 조각보다 앞서 나간다.
- **`4xx` or `5xx`**: 각각 클라이언트 오류·서버 오류를 뜻하는 상태 코드 대역.

> The error is handled entirely within the streamed HTML.

"오류는 전적으로 스트리밍된 HTML 안에서 처리된다."

- **entirely within**: 전적으로 그 안에서. 프로토콜 층에서는 아무 일도 없었던 것처럼 보이고, 오류의 흔적은 본문에만 남는다.

```
오류가 난 뒤의 화면

┌──────────────────┐
│ 헤더             │ ← 그대로
│ 매출 차트        │ ← 그대로
│ ┌ error.js ────┐ │
│ │ 문제가 발생   │ │ ← 이 구역만 교체
│ └──────────────┘ │
│ 추천 목록        │ ← 그대로
└──────────────────┘
HTTP 상태 코드: 200
```

---
## 종합

스트리밍 중 오류 처리는 두 가지 성격을 함께 가진다. 좋은 쪽은 피해가 격리된다는 것이다. 한 구역이 실패해도 나머지 화면은 살아 있으므로 사용자는 페이지 전체를 잃지 않는다. 감수해야 할 쪽은 상태 코드가 여전히 200이라는 것이다. 화면에는 오류가 표시되지만 프로토콜 상으로는 정상 응답이라, 상태 코드에 의존하는 감시 도구는 이 실패를 놓친다. 앞의 `notFound()` 사례와 같은 제약에서 나온 같은 모양의 결과다.

---

# `generateMetadata`는 스트리밍과 어떻게 맞물리는가?

## 도입

`generateMetadata`는 `<title>`이나 미리보기 카드용 태그처럼 문서 머리에 들어갈 정보를 만드는 함수다. 이 정보는 `<head>`에 들어가야 하므로 본문보다 앞서야 할 것처럼 보인다. 그런데 그렇게 되면 스트리밍의 이득이 사라진다. 이 긴장을 어떻게 푸는지가 이 질문의 내용이며, **버전에 따라 답이 달라진 항목**이다.

---
## 본문

> `generateMetadata` resolves before streaming begins for bots that only scrape static HTML (such as Twitterbot or Slackbot).

"`generateMetadata`는 정적 HTML만 긁어 가는 봇(Twitterbot이나 Slackbot 같은)에 대해서는 스트리밍이 시작되기 전에 완료된다."

- **scrape**: 페이지를 받아 내용을 긁어 간다. 이런 봇은 링크 미리보기 카드를 만들려고 문서 머리의 정보만 읽는다.
- **only scrape static HTML**: 정적 HTML만 긁는다. JavaScript를 실행하지 않으므로, 나중에 흘러 들어오는 조각을 처리하지 못한다. 그래서 이들에게는 처음부터 완성된 머리 정보를 줘야 한다.
- **before streaming begins**: 스트리밍이 시작되기 전에. 이 경우에는 메타데이터가 끝날 때까지 응답이 막힌다.

> For full browsers and capable crawlers, metadata can stream alongside the page content.

"온전한 브라우저와 처리 능력이 있는 크롤러에 대해서는, 메타데이터가 페이지 내용과 나란히 흘러갈 수 있다."

- **capable crawlers**: JavaScript를 실행할 수 있어 나중에 도착한 내용까지 처리하는 크롤러.
- **alongside**: 나란히. 메타데이터가 본문보다 먼저 완성되기를 기다리지 않고 함께 흘러간다.

여기가 버전 간 답이 갈리는 지점이다. Next.js 14 문서는 `generateMetadata`가 완료될 때까지 스트리밍이 무조건 막힌다고 설명했다. v16에서는 그 동작이 요청 주체에 따라 갈린다. 정적 HTML만 읽는 봇에게만 막고, 그 외에는 함께 흘려보낸다. "메타데이터는 언제나 스트리밍을 막는다"고 알고 있으면 현행 동작과 어긋난다.

```
요청 주체에 따라 갈리는 동작 (v16)

Twitterbot·Slackbot 등  →  [generateMetadata 완료 대기] → HTML 전송
브라우저·JS 실행 크롤러  →  [껍데기 전송] … [메타데이터] … [본문 조각]
```

> Next.js automatically detects user agents to choose the right behavior.

"Next.js는 user agent를 자동으로 감지해 알맞은 동작을 고른다."

- **user agent**: 요청을 보낸 쪽이 자신을 밝히는 문자열. 브라우저인지 어떤 봇인지가 여기 담긴다.
- **automatically**: 자동으로. 개발자가 분기 코드를 쓰지 않아도 된다.

> You can customize which bots receive blocking metadata with the `htmlLimitedBots` configuration option.

"`htmlLimitedBots` 설정 옵션으로 어떤 봇이 블로킹 메타데이터를 받을지 직접 정할 수 있다."

- **blocking metadata**: 스트리밍을 막고 먼저 완성되는 메타데이터. 기본 목록에 없는 봇을 추가하거나 조정할 때 쓴다.

---
## 종합

이 항목은 "메타데이터는 반드시 먼저 나가야 한다"는 요구와 "본문을 빨리 내보내고 싶다"는 요구가 충돌하는 자리다. v16의 해법은 둘 중 하나를 고르는 대신 요청 주체에 따라 나누는 것이다. 나중에 도착한 조각을 처리하지 못하는 봇에게만 기다림을 감수하고, 처리할 수 있는 브라우저·크롤러에게는 메타데이터도 본문과 함께 흘려보낸다. 이전 버전의 "무조건 블로킹"을 기억하고 있다면 그 지식이 그대로 맞지 않는다는 점을 알아 두는 것이 중요하다. 필요하면 `htmlLimitedBots` 설정으로 기다리게 할 대상을 조정할 수 있다.
