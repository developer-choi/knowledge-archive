# `generateMetadata`를 쓰면 페이지 로딩이 블로킹되는가?

## 도입

Next.js에서 SEO를 위해 `generateMetadata()`로 `<head>` 태그를 동적으로 생성할 때, Streaming 환경에서 메타데이터가 HTML의 어느 시점에 포함되는지가 중요하다. 스트림 도중에 `<head>`가 바뀌면 크롤러나 브라우저가 혼동할 수 있다.

---

## 본문

> Next.js will wait for data fetching inside generateMetadata to complete before streaming UI to the client.

"Next.js는 클라이언트로 UI를 스트리밍하기 전에 generateMetadata 내의 데이터 패칭이 완료되기를 기다린다."

> This guarantees the first part of a streamed response includes `<head>` tags.

"이것은 스트리밍 응답의 첫 부분에 `<head>` 태그가 포함됨을 보장한다."

- **wait for**: `generateMetadata()`가 완료될 때까지 Streaming 자체가 시작되지 않는다. 즉, `generateMetadata()` 안의 데이터 패칭이 페이지 전체 스트리밍의 블로킹 포인트가 된다.
- **first part of a streamed response**: 스트림의 첫 청크에 `<head>`가 포함된다. 크롤러와 브라우저 모두 스트림의 맨 처음에 메타데이터를 받아야 올바르게 처리할 수 있다.

```
generateMetadata()가 있을 때의 Streaming 타이밍

[generateMetadata 데이터 패칭] → 완료
         ↓
[<head> 태그 포함한 첫 청크 전송] → 스트리밍 시작
         ↓
[나머지 컴포넌트 청크들 순차 전송]
```

### 그래서 이 한 줄로 요약된다

이거 때문에 `generateMetadata()` 쓰면 페이지 로딩 자체가 블로킹된다.

---

## 종합

`generateMetadata()`를 사용하면 메타데이터 패칭이 완료될 때까지 Streaming 자체가 지연된다. 가벼운 메타데이터 조회라면 문제가 없지만, 느린 DB 쿼리를 `generateMetadata()` 안에서 실행하면 Streaming의 이점이 감소한다. 메타데이터에 필요한 데이터는 가능한 한 빠른 소스(캐시, 가벼운 조회)에서 가져오는 것이 권장된다.
