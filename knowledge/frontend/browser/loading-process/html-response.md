---
tags: [browser, performance, network]
---

# Questions
- TTFB가 웹페이지 성능에서 첫 단추로 중요한 이유는?
- HTML/JS/CSS/SVG 같은 텍스트 응답의 전송 크기를 줄이는 일반적인 방법은?
- HTML 응답을 캐싱할 때 고려해야 할 trade-off는?

---

# Answers

## TTFB가 웹페이지 성능에서 첫 단추로 중요한 이유는?

### Official Answer
The first step in building a website that loads quickly is to receive a timely response from the server for a page's HTML.
Reducing the time spent on each step gives you a faster Time to First Byte (TTFB).
While TTFB is not the sole metric you should focus on when it comes to how fast pages load, a high TTFB does make it challenging to reach the designated "good" thresholds for metrics such as Largest Contentful Paint (LCP) and First Contentful Paint (FCP).

> #### Key Terms:
> - **TTFB (Time to First Byte)**: 요청 후 첫 응답 바이트가 도착하기까지의 시간
> - **LCP (Largest Contentful Paint)**: 뷰포트 내 가장 큰 콘텐츠가 그려지기까지의 시간
> - **FCP (First Contentful Paint)**: 첫 콘텐츠 픽셀이 그려지기까지의 시간

> #### User Annotation:
> 웹페이지 성능개선 첫단추는 HTML 빨리 받는 것.
> 이걸 빨리 못 받으면 이후 모든 절차가 전부 다 소용이 없음.

### Reference
- https://web.dev/learn/performance/general-html-performance
- https://web.dev/articles/optimize-ttfb

---

## HTML/JS/CSS/SVG 같은 텍스트 응답의 전송 크기를 줄이는 일반적인 방법은?

### Official Answer
Text-based responses such as HTML, JavaScript, CSS, and SVG images should be compressed to reduce their transfer size over the network in order for them to download more quickly.
The most widely used compression algorithms are gzip and Brotli.
Brotli results in about a 15% to 20% improvement over gzip.

Getting compression right on your own is challenging, and it's often best to let a Content Delivery Network (CDN) to handle this for you.

> #### Key Terms:
> - **gzip**: 가장 널리 쓰이는 텍스트 압축 알고리즘
> - **Brotli**: gzip보다 압축률이 높은 차세대 압축 알고리즘
> - **CDN**: Content Delivery Network. 정적 자원 배포·압축을 대행해 주는 인프라

### Reference
- https://web.dev/learn/performance/general-html-performance#compression

---

## HTML 응답을 캐싱할 때 고려해야 할 trade-off는?

### User Answer
- 요청을 다시 안 해도 돼서 좋다.
- 어떤 조건으로 revalidation할지 생각해봐야 한다.
- personalized 정보는 캐싱하지 않는 게 좋다.
- HTML 캐싱할 때 응답 헤더의 ETag / Last-Modified를 사용하는 방법이 있다.
- 하지만 이 데이터가 stale한지 아닌지를 체크할 때 네트워크 지연이 발생한다 (= 캐싱이 무조건 정답은 아님).
- 캐싱을 하고 안 하고에 따라 trade-off가 있으니 잘 따져봐야 한다.

### Reference
- https://web.dev/learn/performance/general-html-performance#cache_html_responses
