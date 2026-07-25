---
tags: [nextjs, react, principle]
source: official
publishable: true
priority:
---

# Questions
- 같은 데이터가 여러 컴포넌트에서 필요할 때, 위에서 한 번 가져와 props로 내려보내지 않아도 되는 까닭은 무엇인가?
- `React.cache`로 감싼 함수를 한 화면에서 여러 번 호출하면 그때마다 실행되는가?
  - 그 재사용은 어디까지 유효한가?

---

# Answers

## 같은 데이터가 여러 컴포넌트에서 필요할 때, 위에서 한 번 가져와 props로 내려보내지 않아도 되는 까닭은 무엇인가?

### Official Answer
Identical fetch requests in a React component tree are memoized by default, so you can fetch data in the component that needs it instead of drilling props.

### Reference
- https://nextjs.org/docs/app/getting-started/fetching-data

---

## `React.cache`로 감싼 함수를 한 화면에서 여러 번 호출하면 그때마다 실행되는가?

### Official Answer
Since `getUser` is wrapped with `React.cache`, multiple calls within the same request return the same memoized result, whether called directly in Server Components or resolved via context in Client Components.

```tsx
import { getUser } from '../lib/user'

export default async function DashboardPage() {
  const user = await getUser() // Cached - same request, no duplicate fetch
  return <h1>Dashboard for {user.name}</h1>
}
```

### Reference
- https://nextjs.org/docs/app/getting-started/fetching-data

---

## 그 재사용은 어디까지 유효한가?

### Official Answer
`React.cache` is scoped to the current request only. Each request gets its own memoization scope with no sharing between requests.

### Reference
- https://nextjs.org/docs/app/getting-started/fetching-data
