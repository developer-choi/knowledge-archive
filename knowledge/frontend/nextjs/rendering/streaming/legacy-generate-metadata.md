---
tags: [react, nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- `generateMetadata`를 쓰면 페이지 로딩이 블로킹되는가?

---

# Answers

## `generateMetadata`를 쓰면 페이지 로딩이 블로킹되는가?

### Official Answer (v14)
Next.js will wait for data fetching inside `generateMetadata` to complete before streaming UI to the client.
This guarantees the first part of a streamed response includes `<head>` tags.

### Review Note
- **v16에서 답이 뒤집혔다.** v14는 무조건 기다린다고 했지만, v16은 정적 HTML만 긁어가는 봇(Twitterbot·Slackbot 등)에게만 기다리고 온전한 브라우저·크롤러에게는 메타데이터가 페이지 내용과 나란히 흘러간다. `htmlLimitedBots` 설정으로 어느 봇에게 기다리게 할지 바꾼다.
- 현행 답변은 [response.md](response.md)의 「`generateMetadata`는 스트리밍과 어떻게 맞물리는가?」에 있다. 이 문서는 틀린 답을 남기는 것이 아니라 **옛 동작의 기록**이다.

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming (버전 미고정 — v14 본문 없음)
