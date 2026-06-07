---
tags: [nextjs, performance, principle]
source: official
priority:
---

# Questions
- Full Route Cache는 무엇을 저장하는가?
- Full Route Cache를 invalidate 하는 두 가지 방법은?
- Full Route Cache와 Data Cache의 배포(deployment) 간 지속성 차이는?

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

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#invalidation
