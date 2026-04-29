---
tags: [browser, performance, best-practice]
---

# Questions

## preload vs prefetch
- `preload`랑 `prefetch` 차이는?
- `preload`를 너무 많이 쓰면 어떤 문제가 있나요?
- 폰트 preload에 `crossorigin` 속성이 왜 필요한가요?

## preconnect vs dns-prefetch
- `preconnect`랑 `dns-prefetch`는 언제 쓰나요?

---

# Answers

## `preload`랑 `prefetch` 차이는?

### AI Answer
둘 다 `<link>` 태그의 `rel` 속성으로 쓰는 리소스 힌트지만, **목적과 우선순위가 정반대**입니다.

**preload**: 현재 페이지에서 곧 필요할 리소스를 **높은 우선순위**로 미리 다운로드. 다운로드만 하고 실행은 안 함.
- 사용 예: 폰트, hero 이미지, critical CSS/JS
- `as` 속성 필수 — 브라우저가 어떤 우선순위로 fetch할지 결정하는 데 씀
- 폰트는 CORS 필요해서 `crossorigin` 속성 추가
```html
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="hero.jpg" as="image">
```

**prefetch**: **다음 페이지나 미래에 쓸 것 같은** 리소스를 **낮은 우선순위**로 idle 시간에 다운로드.
- 사용 예: 사용자가 다음 단계로 갈 가능성이 높은 페이지의 번들
- preload와 정반대 — preload는 "지금 곧", prefetch는 "나중에"
```html
<link rel="prefetch" href="/next-page.js">
```

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload
- https://web.dev/articles/preload-critical-assets

---

## `preload`를 너무 많이 쓰면 어떤 문제가 있나요?

### AI Answer
preload는 "지금 곧 쓴다"는 강한 신호라 브라우저가 다른 중요한 리소스(예: HTML 본체) 다운로드보다 우선순위를 줄 수 있어요. 그래서 모든 자원에 다 붙이면 정작 페이지 로드가 느려질 수 있습니다. 정말 critical한 것만 골라서 사용해야 합니다.

### Reference
- https://web.dev/articles/preload-critical-assets

---

## 폰트 preload에 `crossorigin` 속성이 왜 필요한가요?

### AI Answer
폰트는 스펙상 origin과 무관하게 항상 CORS anonymous 모드로 fetch됩니다. 그래서 preload에서 `crossorigin`을 명시하지 않으면 두 요청의 모드가 달라져 브라우저가 두 번 다운로드해요(preload 한 번, 실제 사용 시 또 한 번). `crossorigin` 속성을 맞춰주면 같은 요청으로 인식해서 캐시 재사용됩니다. **same-origin 폰트도 마찬가지**라는 점이 헷갈리기 쉽습니다.

### Reference
- https://web.dev/articles/preload-critical-assets
- https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload

---

## `preconnect`랑 `dns-prefetch`는 언제 쓰나요?

### AI Answer
**preconnect**: 특정 origin에 미리 **TCP/TLS 핸드셰이크와 DNS 조회**까지 해둠. 실제 다운로드는 안 함.
- 사용 예: 외부 API, CDN 도메인
- 너무 많이 쓰면 핸드셰이크 비용 자체가 부담이라 정말 곧 사용할 도메인만
```html
<link rel="preconnect" href="https://api.example.com">
```

**dns-prefetch**: **DNS 조회만** 미리 해둠. preconnect보다 가벼운 버전.
- 사용 예: 여러 서드파티 도메인이 있는데 다 preconnect 하기엔 무거울 때
```html
<link rel="dns-prefetch" href="https://cdn.example.com">
```

**관계 정리**: dns-prefetch ⊂ preconnect ⊂ 실제 fetch. preconnect는 HTTPS면 DNS + TCP + TLS, HTTP면 DNS + TCP까지를 미리 끝내고, dns-prefetch는 DNS만 해놓는 차이.

실무 권장 순서: 가장 중요한 외부 도메인은 `preconnect`, 그 외엔 `dns-prefetch`. 같은 도메인을 `preconnect`와 `dns-prefetch` 둘 다 쓰면 preconnect를 지원하지 않는 옛날 브라우저용 fallback으로 의미가 있긴 합니다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect
- https://web.dev/articles/preconnect-and-dns-prefetch
