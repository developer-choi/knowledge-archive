---
tags: [nextjs, performance, principle]
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

> #### Key Terms:
> - **persistent**: 영구적. 여러 요청 사이에 유지된다
> - **render output**: HTML과 RSC payload로 구성된 라우트 렌더링 결과

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

> #### Key Terms:
> - **Revalidating Data**: Data Cache를 갱신하면 그에 의존하는 Full Route Cache도 자동으로 무효화됨
> - **Redeploying**: 새 배포 시 Full Route Cache는 자동으로 비워짐

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#invalidation

---

## Full Route Cache와 Data Cache의 배포(deployment) 간 지속성 차이는?

### Official Answer
Unlike the Data Cache, which persists across deployments, the Full Route Cache is cleared on new deployments.

> #### Key Terms:
> - **persists across deployments**: Data Cache는 새 배포에도 유지된다
> - **cleared on new deployments**: Full Route Cache는 새 배포 때마다 비워진다

### Reference
- https://nextjs.org/docs/14/app/building-your-application/caching#invalidation
