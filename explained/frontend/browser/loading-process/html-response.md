# TTFB가 웹페이지 성능에서 첫 단추로 중요한 이유는?

## 도입

브라우저가 화면을 그리려면 HTML이 먼저 도착해야 한다. HTML이 없으면 DOM도, CSS 요청도, JS 실행도 시작할 수 없다. TTFB(Time to First Byte)는 바로 이 HTML의 첫 바이트가 도착하는 시점까지 걸린 시간이다.

---

## 본문

> The first step in building a website that loads quickly is to receive a timely response from the server for a page's HTML.

"빠르게 로드되는 웹사이트를 만들기 위한 첫 번째 단계는 페이지의 HTML에 대한 서버의 응답을 적시에 받는 것이다."

- **timely**: "제때에"라는 의미. 단순히 도착하는 것이 아니라 빠르게 도착해야 한다는 조건이 포함된다.

> Reducing the time spent on each step gives you a faster Time to First Byte (TTFB).

"각 단계에 소요되는 시간을 줄이면 더 빠른 Time to First Byte(TTFB)를 얻을 수 있다."

- **each step**: DNS lookup → TCP handshake → TLS negotiation → HTTP 요청/응답의 각 단계. TTFB는 이 단계들의 합산 지연이다.

> While TTFB is not the sole metric you should focus on when it comes to how fast pages load, a high TTFB does make it challenging to reach the designated "good" thresholds for metrics such as Largest Contentful Paint (LCP) and First Contentful Paint (FCP).

"TTFB가 페이지 로드 속도와 관련하여 집중해야 할 유일한 지표는 아니지만, 높은 TTFB는 LCP, FCP 같은 지표의 '좋음' 임계값에 도달하기 어렵게 만든다."

- **TTFB (Time to First Byte)**: 요청 후 첫 응답 바이트가 도착하기까지의 시간
- **LCP (Largest Contentful Paint)**: 뷰포트 내 가장 큰 콘텐츠 요소가 그려지기까지의 시간
- **FCP (First Contentful Paint)**: 첫 콘텐츠 픽셀이 그려지기까지의 시간
- **designated "good" thresholds**: Core Web Vitals의 기준선. LCP는 2.5초, FCP는 1.8초 이내가 "좋음"에 해당한다.

---

## 종합

DevTools Network 탭에서 첫 번째 요청의 "Waiting for server response(TTFB)" 항목이 바로 이 시간이다. HTML이 늦게 도착하면 그 이후 모든 리소스(CSS, JS, 이미지) 요청이 전부 뒤로 밀린다. TTFB가 높은 상태에서 FCP나 LCP를 개선하는 것은 빠진 모래 위에 집을 짓는 격이다. 서버 응답 속도를 먼저 확보하는 것이 성능 최적화의 출발점인 이유가 여기 있다.

---

# HTML/JS/CSS/SVG 같은 텍스트 응답의 전송 크기를 줄이는 일반적인 방법은?

## 도입

네트워크를 통해 전송되는 데이터 크기를 줄이면 다운로드 시간이 단축된다. 텍스트 기반 파일(HTML, JS, CSS, SVG)은 바이너리 이미지와 달리 압축 알고리즘으로 크기를 크게 줄일 수 있다.

---

## 본문

> Text-based responses such as HTML, JavaScript, CSS, and SVG images should be compressed to reduce their transfer size over the network in order for them to download more quickly.

"HTML, JavaScript, CSS, SVG 이미지 같은 텍스트 기반 응답은 더 빠르게 다운로드될 수 있도록 네트워크를 통한 전송 크기를 줄이기 위해 압축되어야 한다."

- **transfer size**: 서버에서 클라이언트로 실제 전송되는 바이트 수. 원본 파일 크기와 다르다. 압축되면 전송 크기가 줄어들고, 브라우저가 받은 뒤 해제한다.
- **compressed**: 압축. 텍스트는 반복 패턴이 많아 압축 효율이 높다. HTML의 들여쓰기, JS의 변수명 반복 같은 것들이 압축으로 제거된다.

> The most widely used compression algorithms are gzip and Brotli. Brotli results in about a 15% to 20% improvement over gzip.

"가장 널리 쓰이는 압축 알고리즘은 gzip과 Brotli다. Brotli는 gzip 대비 약 15~20% 향상된 결과를 제공한다."

- **gzip**: 가장 역사가 길고 범용적인 텍스트 압축 알고리즘. 모든 브라우저가 지원한다.
- **Brotli**: Google이 만든 차세대 압축 알고리즘. 같은 압축 레벨에서 gzip보다 파일이 더 작다.

> Getting compression right on your own is challenging, and it's often best to let a Content Delivery Network (CDN) to handle this for you.

"직접 압축을 올바르게 설정하는 것은 어려울 수 있으며, Content Delivery Network(CDN)가 이를 대신 처리하도록 하는 것이 최선인 경우가 많다."

- **CDN**: 정적 자원을 엣지 서버에서 제공하는 네트워크. Brotli 지원과 압축 헤더 설정을 자동 처리해준다. Cloudflare, Vercel, Netlify 등이 여기 해당한다.

---

## 종합

DevTools Network 탭에서 리소스를 클릭하면 "Content-Encoding: br" 또는 "Content-Encoding: gzip" 헤더로 어떤 압축이 적용됐는지 확인할 수 있다. 같은 파일도 압축 여부에 따라 전송 크기가 수 배 차이날 수 있다. Vercel이나 Netlify를 쓰면 Brotli가 자동 적용되므로, CDN 활용만으로도 이 단계는 해결된다.

---

# [UNVERIFIED] HTML 응답을 캐싱할 때 고려해야 할 trade-off는?

## 도입

HTTP 캐싱은 네트워크 요청을 줄여 TTFB를 단축하는 강력한 수단이다. 그러나 HTML은 JS·CSS와 달리 **동적 콘텐츠**인 경우가 많아 캐싱 전략이 더 까다롭다. 캐시를 너무 오래 유지하면 오래된 콘텐츠가 노출되고, 너무 짧으면 캐싱의 이점이 사라진다.

---

## 본문

HTML 캐싱의 핵심 trade-off는 **속도 vs 신선도(freshness)**다.

**캐싱의 이점**

브라우저나 CDN 에지 서버가 HTML을 캐시하면, 원서버까지 요청을 보내지 않고도 응답할 수 있다. DNS lookup → TCP handshake → TLS negotiation → 서버 처리의 전체 왕복을 건너뛰므로 TTFB가 극적으로 줄어든다.

**revalidation 비용**

HTML이 stale한지 확인하려면 서버에 조건부 요청(conditional request)을 보내야 한다. `ETag` 또는 `Last-Modified` 헤더를 활용하는 방식이다.

```
브라우저 → 서버: GET /index.html If-None-Match: "abc123"
서버 → 브라우저: 304 Not Modified  (변경 없으면)
              또는 200 OK + 새 HTML (변경됐으면)
```

304 응답은 HTML 본문 없이 헤더만 오므로 전송량은 최소화된다. 하지만 **네트워크 왕복 자체는 여전히 발생**한다. 이것이 "캐싱이 무조건 정답은 아님"의 이유다 — revalidation 요청의 지연이 TTFB에 더해진다.

**personalized 콘텐츠의 위험**

로그인 사용자별로 다른 HTML(마이 페이지, 장바구니 등)을 캐시하면 다른 사용자에게 잘못된 콘텐츠가 노출될 수 있다. 이 경우 `Cache-Control: private`으로 브라우저 캐시만 허용하거나, 아예 캐싱하지 않는 것이 안전하다.

**캐싱 전략 선택 기준**

```
정적 마케팅 페이지     → Cache-Control: max-age=300 (5분)
자주 바뀌는 피드       → Cache-Control: no-cache (매번 revalidation)
로그인 사용자 페이지   → Cache-Control: private, no-store
```

---

## 종합

HTML 캐싱은 JS·CSS·이미지처럼 긴 `max-age`를 주기 어렵다. JS/CSS는 파일명에 content hash(`app.abc123.js`)를 넣어 변경 시 URL 자체를 바꾸는 방식으로 캐시 무효화 문제를 해결하지만, HTML은 URL이 고정되어 있어 이 방법을 쓸 수 없다. 결국 HTML 캐싱은 "얼마나 stale해도 괜찮은가"를 서비스 특성에 맞게 판단해서 설정해야 하는 신중한 결정이다.

