# ISR(증분 정적 재생성)이란 무엇인가?

## 도입

정적 페이지는 빠르다. 미리 만들어두고 그대로 내주면 되니까. 문제는 내용이 바뀌었을 때다. 글 하나를 고쳤는데 사이트 전체를 다시 빌드해야 한다면, 페이지가 만 개인 블로그에서는 그 한 줄 수정이 몇십 분짜리 작업이 된다.

ISR은 그 지점을 푸는 장치다. 이름의 "증분"이 전부를 말한다 — 전부가 아니라 바뀐 것만.

---
## 본문

> Update static content without rebuilding the entire site

"사이트 전체를 다시 빌드하지 않고 정적 콘텐츠를 갱신한다."

> Reduce server load by serving prerendered, static pages for most requests

"대부분의 요청에 미리 만들어둔 정적 페이지를 내주어 서버 부하를 줄인다."

- **prerendered**: 요청이 오기 전에 미리 그려둔.

요청이 올 때마다 서버가 다시 그리는 방식과 견주면, 서버가 하는 일은 "파일을 찾아 내주기"로 줄어든다.

> Ensure proper `cache-control` headers are automatically added to pages

"페이지에 알맞은 `cache-control` 헤더가 자동으로 붙는 것을 보장한다."

- **cache-control**: 브라우저와 CDN에게 "이 응답을 얼마나 오래 보관해도 되는가"를 알려주는 HTTP 헤더.

직접 계산해 붙일 필요가 없다는 뜻이다. 갱신 주기를 정해두면 그에 맞는 헤더가 따라온다.

> Handle large amounts of content pages without long `next build` times

"콘텐츠 페이지가 아주 많아도 `next build` 시간이 길어지지 않게 감당한다."

빌드 때 전부 만들지 않고 일부만 만든 뒤 나머지는 요청받은 시점에 만들 수 있기 때문이다.

### 세 방식 사이의 어디쯤인가

```
빌드 때 한 번 만들고 끝        →  내용이 바뀌면 다시 빌드해야 함
ISR                            →  미리 만들되, 주기적·사건별로 낱개 교체
요청마다 그때그때 그림          →  항상 최신이지만 매번 서버가 일함
```

가운데 자리를 차지하는 것이 ISR이다. 정적의 속도를 유지하면서 "언제까지 낡아도 괜찮은가"만 정해주는 방식이다.

---
## 종합

ISR은 미리 만들어둔 정적 페이지를 통째로 다시 빌드하지 않고 낱개로 갈아끼우는 장치다. 그 덕에 대부분의 요청은 서버가 그리지 않고 파일을 내주는 것으로 끝나고, 콘텐츠가 아무리 많아도 빌드 시간이 그에 비례해 늘어나지 않는다.

---

# `revalidate = 60`이 걸린 라우트에서, 60초가 지난 뒤 들어온 첫 요청은 무엇을 받으며 새 페이지는 언제 만들어지는가?

## 도입

"60초마다 갱신"이라는 말을 들으면 자연스럽게 이렇게 상상하게 된다 — 60초가 지나면 캐시가 비워지고, 그다음 손님은 새 페이지가 만들어질 때까지 기다린다. 그렇다면 주기를 짧게 잡을수록 누군가는 자주 기다리게 될 것이다.

실제 동작은 그렇지 않다. **아무도 기다리지 않는다.**

---
## 본문

> During `next build`, all known blog posts are generated.

"`next build` 때 알려진 블로그 글이 전부 만들어진다."

- **all known**: 빌드 시점에 목록으로 넘어온 것 전부.

> All requests made to these pages (e.g. `/blog/1`) are cached and instantaneous.

"이 페이지들로 오는 모든 요청(예: `/blog/1`)은 캐시되어 즉시 응답된다."

- **instantaneous**: 서버가 그리는 시간 없이 곧바로.

> After 60 seconds has passed, the next request will still return the cached (now stale) page.

"60초가 지난 뒤 들어온 그다음 요청도 여전히 캐시된 페이지 — 이제는 낡은 — 를 돌려준다."

- **stale**: 유효기간이 지나 낡았지만 아직 버리지 않고 쓰는 상태.

여기가 핵심이다. 60초는 "이때부터 새 걸 준다"가 아니라 **"이때부터 새로 만들기 시작해도 된다"**는 신호다. 그 신호를 울린 요청 본인은 여전히 낡은 걸 받는다.

> The cache is invalidated and a new version of the page begins generating in the background.

"그러면서 캐시가 무효화되고, 페이지의 새 버전이 뒤에서 만들어지기 시작한다."

- **invalidated**: 더는 유효하지 않다고 표시되는 것. 지워지는 것과는 다르다.
- **in the background**: 그 요청을 붙잡아두지 않고 따로.

무효화가 곧 삭제가 아니라는 점이 이 방식의 전부다. 지워버렸다면 다음 손님에게 줄 것이 없어 기다리게 해야 한다.

> Once generated successfully, the next request will return the updated page and cache it for subsequent requests.

"새 버전이 성공적으로 만들어지면, 그다음 요청부터 갱신된 페이지를 돌려주고 이후 요청을 위해 그것을 캐시한다."

- **subsequent**: 뒤이어 오는.

같은 동작을 문서는 한 시간짜리 예로 한 번 더 설명한다.

> After an hour has passed, the next visitor will still receive the cached (stale) version of the page immediately for a fast response.

"한 시간이 지난 뒤 온 다음 방문자도 빠른 응답을 위해 캐시된(낡은) 버전을 즉시 받는다."

> Simultaneously, Next.js triggers regeneration of a fresh version in the background.

"동시에 Next.js가 뒤에서 새 버전의 재생성을 시작시킨다."

- **Simultaneously**: 낡은 것을 내주는 것과 같은 시점에.

> Once the new version is successfully generated, it replaces the cached version, and subsequent visitors will receive the updated content.

"새 버전이 성공적으로 만들어지면 캐시된 버전을 대체하고, 이후 방문자들은 갱신된 내용을 받는다."

### 손님과 진열대

편의점 진열대로 옮겨보면 이렇다. 유통기한이 지난 상품을 손님에게 그대로 건네면서, 직원은 뒤에서 새 물건을 채운다. 그 손님은 낡은 것을 받지만 **기다리지 않고** 받는다. 새 물건이 채워지면 그다음 손님부터 새것을 받는다.

```
요청 A (0초)      → 캐시된 것 즉시             (신선)
요청 B (30초)     → 캐시된 것 즉시             (신선)
요청 C (70초)     → 캐시된 것 즉시             (낡음) + 뒤에서 새로 만들기 시작
요청 D (75초)     → 새 것 즉시                 (재생성이 끝났다면)
```

이 이름이 붙은 방식을 **stale-while-revalidate**라 부른다 — "다시 검증하는 동안 낡은 걸 준다".

### 코드에서는 한 줄이다

```tsx
// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60
```

주석의 `at most once every 60 seconds`가 정확한 표현이다. 60초마다 자동으로 도는 타이머가 있는 게 아니라, **요청이 들어왔을 때** 60초가 지났는지 보고 그때 재생성을 건다. 아무도 안 들어오면 아무 일도 일어나지 않는다.

---
## 종합

60초가 지난 뒤 들어온 첫 요청도 낡은 캐시를 즉시 받는다. 그 요청이 방아쇠가 되어 뒤에서 새 버전이 만들어지고, 완성되면 그다음 요청부터 새것을 받는다. 그래서 갱신 주기를 짧게 잡아도 특정 손님만 느려지는 일은 없고, 대신 재생성이 그만큼 자주 돈다. 그리고 재생성은 시계가 아니라 요청이 부른다 — 방문이 없으면 갱신도 없다.

---

# 재검증 도중 에러가 나면 사용자는 무엇을 보게 되는가?

## 도입

뒤에서 페이지를 다시 만드는 중에 API가 죽었다. 그 순간 들어온 사용자는 에러 화면을 보게 될까?

---
## 본문

> If an error is thrown while attempting to revalidate data, the last successfully generated data will continue to be served from the cache.

"데이터를 재검증하려다 에러가 나면, 마지막으로 성공적으로 만들어진 데이터가 캐시에서 계속 제공된다."

- **is thrown**: 에러가 던져진다 — 코드가 실패해 위로 튀어 오르는 것.
- **the last successfully generated**: 마지막으로 성공한.

낡은 캐시를 지우지 않고 남겨두는 설계가 여기서 한 번 더 값을 한다. 재생성이 실패해도 내줄 것이 그대로 있으니, 사용자 쪽에서는 아무 일도 일어나지 않은 것처럼 보인다.

> On the next subsequent request, Next.js will retry revalidating the data.

"그다음 요청 때 Next.js가 재검증을 다시 시도한다."

- **retry**: 다시 시도한다.

실패했다고 포기하거나 뒤로 미루는 게 아니라, 다음 요청이 오면 또 시도한다. API가 살아나는 순간 자연히 복구된다.

### 뒤집어 보면 함정이기도 하다

화면이 멀쩡하다는 것은 **실패가 사용자에게 보이지 않는다**는 뜻이기도 하다. 데이터 소스가 몇 시간째 죽어 있어도 페이지는 계속 정상으로 보인다. 낡았다는 사실을 알아채려면 화면이 아니라 서버 로그나 모니터링을 봐야 한다.

---
## 종합

재검증에 실패하면 마지막으로 성공한 내용이 캐시에서 계속 제공되고, 다음 요청 때 다시 시도한다. 사용자는 장애를 겪지 않지만, 그만큼 장애가 화면에 드러나지 않으므로 낡은 내용이 계속 나가고 있다는 사실은 따로 감시해야 한다.
