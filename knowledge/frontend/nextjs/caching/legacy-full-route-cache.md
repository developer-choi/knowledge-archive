---
tags: [nextjs, performance, principle]
source: official
publishable: false
priority:
---

# Questions
- Full Route Cache는 무엇을 저장하는가?
- Full Route Cache를 invalidate 하는 두 가지 방법은?
- Full Route Cache와 Data Cache의 배포(deployment) 간 지속성 차이는?
- Data Cache를 revalidate 하면 Full Route Cache는? 반대는?
- 한 페이지에서 fetch 요청 중 하나라도 cached가 아니면 라우트 전체는?

---

# Answers

## Full Route Cache는 무엇을 저장하는가?

### Official Answer
By default, the Full Route Cache is **persistent**.
This means that the render output is cached **across** user requests.

### Review Note
- 본 문서는 Next.js 14 기준 공식문서를 소스로 함.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#full-route-cache

---

## Full Route Cache를 invalidate 하는 두 가지 방법은?

### Official Answer
There are two ways you can invalidate the Full Route Cache:

- **Revalidating Data**: Revalidating the Data Cache, will in turn invalidate the Router Cache by re-rendering components on the server and caching the new render output.
- **Redeploying**: Unlike the Data Cache, which persists across deployments, the Full Route Cache is cleared on new deployments.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#invalidation

---

## Full Route Cache와 Data Cache의 배포(deployment) 간 지속성 차이는?

### Official Answer
Unlike the Data Cache, which persists across deployments, the Full Route Cache is cleared on new deployments.

### Review Note
- 이 문장은 바로 위 「invalidate 하는 두 가지 방법은?」 답변의 둘째 항목과 같은 문장이다. 그쪽은 무효화 방법 목록의 일부로, 이 질문은 두 캐시의 대비 자체를 묻는 자리로 나눠 뒀다.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#invalidation

---

## Data Cache를 revalidate 하면 Full Route Cache는? 반대는?

### Official Answer
Revalidating or opting out of the Data Cache **will** invalidate the Full Route Cache, as the render output depends on data.

Invalidating or opting out of the Full Route Cache **does not** affect the Data Cache.
You can dynamically render a route that has both cached and uncached data.
This is useful when most of your page uses cached data, but you have a few components that rely on data that needs to be fetched at request time.
You can dynamically render without worrying about the performance impact of re-fetching all the data.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#data-cache-and-full-route-cache

---

## 한 페이지에서 fetch 요청 중 하나라도 cached가 아니면 라우트 전체는?

### Official Answer
If a route has a `fetch` request that is not cached, this will opt the route out of the Full Route Cache.
The data for the specific `fetch` request will be fetched for every incoming request.
Other `fetch` requests that do not opt out of caching will still be cached in the Data Cache.

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#opting-out
