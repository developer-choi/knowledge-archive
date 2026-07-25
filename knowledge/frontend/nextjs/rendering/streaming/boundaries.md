---
tags: [nextjs, react, performance, principle]
source: official
publishable: true
priority: 1
---

# Questions
- `loading.js` 파일을 두면 Next.js는 무엇을 대신 해주는가?
  - layout이 캐시되지 않은 데이터를 읽으면 같은 구간의 `loading.js`는 어떻게 동작하는가?
  - 화면 이동이 막히지 않게 하려면 어떻게 고치는가?
- `loading.js` 대신 `<Suspense>`를 직접 놓으면 무엇이 달라지는가?
- 미리 렌더링하는 쪽이 가변 작업을 만나면 어떻게 행동하는가?
- `params`나 `cookies()`를 layout·page 맨 위에서 `await`하면 무슨 일이 벌어지는가?
  - 그럼 그 값들을 어떻게 다뤄야 하는가?
- 서버에서 시작한 데이터 요청을 클라이언트 컴포넌트가 이어받게 하려면 어떻게 하는가?
  - 여러 컴포넌트가 같은 데이터를 필요로 하면 어떻게 하는가?

---

# Answers

## `loading.js` 파일을 두면 Next.js는 무엇을 대신 해주는가?

### Official Answer
The simplest way to add streaming is with a `loading.js` file. Place it alongside your `page.js` and Next.js automatically wraps the page content in a `<Suspense>` boundary, using your loading component as the fallback.

Behind the scenes, `loading.js` is nested inside `layout.js` and wraps `page.js` in a `<Suspense>` boundary:

* The layout renders immediately as part of the static shell.
* The loading skeleton is shown instantly as the Suspense fallback.
* When the page component finishes loading, its HTML replaces the skeleton.

`loading.js` is useful when there's nothing meaningful to show until the page's data resolves. If the page needs to await data before it can render anything, a full-page skeleton is a reasonable fallback.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## layout이 캐시되지 않은 데이터를 읽으면 같은 구간의 `loading.js`는 어떻게 동작하는가?

### Official Answer
Because of this, a layout that accesses uncached or runtime data (e.g. `cookies()`, `headers()`, or uncached fetches) does not fall back to a same route segment `loading.js`. Instead, it blocks navigation until the layout finishes rendering. Cache Components prevents this by guiding you with a build-time error.

### Reference
- https://nextjs.org/docs/app/getting-started/fetching-data

---

## 화면 이동이 막히지 않게 하려면 어떻게 고치는가?

### Official Answer
To fix this, wrap the uncached access in its own `<Suspense>` boundary with a fallback, or move the data fetching into `page.js` where `loading.js` can cover it.

This is why, while `loading.js` works well for streaming route segments, using `<Suspense>` closer to the runtime or uncached data access is recommended.

### Reference
- https://nextjs.org/docs/app/getting-started/fetching-data

---

## `loading.js` 대신 `<Suspense>`를 직접 놓으면 무엇이 달라지는가?

### Official Answer
`<Suspense>` lets you control exactly which parts of the page stream independently. Instead of a full-page skeleton, you can push fallbacks down into specific sections so the static shell includes more real content.

|                | `loading.js`                             | `<Suspense>`                     |
| -------------- | ---------------------------------------- | -------------------------------- |
| **Scope**      | Entire page                              | Any component                    |
| **Setup**      | Drop in a file                           | Wrap components explicitly       |
| **Navigation** | Prefetched as instant fallback           | Not prefetched by default        |
| **Best for**   | Pages where nothing renders without data | Most pages, for granular control |

Prefer explicit `<Suspense>` boundaries close to the dynamic access.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 미리 렌더링하는 쪽이 가변 작업을 만나면 어떻게 행동하는가?

### Official Answer
When the prerenderer encounters dynamic work, it walks up the tree looking for the nearest Suspense boundary. If none is found, the build fails with a blocking route error. A `loading.js` high in the tree is a valid boundary, so the framework finds it and stops, but now the entire page falls back to a full-page skeleton instead of streaming granularly.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## `params`나 `cookies()`를 layout·page 맨 위에서 `await`하면 무슨 일이 벌어지는가?

### Official Answer
The key to maximizing what streams instantly is to defer dynamic data access to the component that actually needs it. This applies to `params`, `searchParams`, `cookies()`, `headers()`, and data fetches. If you `await` any of these at the top of a layout or page, everything below that point becomes dynamic and cannot be prerendered as part of the static shell.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 그럼 그 값들을 어떻게 다뤄야 하는가?

### Official Answer
Instead, pass the promise down and let the consuming component resolve it inside a `<Suspense>` boundary:

```tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies() // Start the work, but don't await

  return (
    <div>
      <Nav>
        <Suspense fallback={<p>Loading user...</p>}>
          <UserMenu cookiePromise={cookieStore} />
        </Suspense>
      </Nav>
      {children}
    </div>
  )
}
```

In this example, `<Nav>` and `{children}` render as part of the static shell because nothing in the layout awaits. Only `<UserMenu>` suspends when it resolves the cookie promise. If the layout had called `await cookies()` at the top instead, the entire layout and all its children would be blocked from prerendering.

You can also unwrap the promise inline with `.then()`, so the child component receives a plain value instead of a promise:

```tsx
<Suspense fallback={<p>Loading products...</p>}>
  {params.then(({ category }) => (
    <ProductGrid category={category} />
  ))}
</Suspense>
```

This keeps `ProductGrid` simple (it takes a `string`, not a `Promise`) while still deferring the `params` access to inside the Suspense boundary.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 서버에서 시작한 데이터 요청을 클라이언트 컴포넌트가 이어받게 하려면 어떻게 하는가?

### Official Answer
You can start a fetch in a Server Component and pass the unresolved promise as a prop to a Client Component. The promise can be passed through as many layers as needed. Only the component that calls React's `use` API to read the value needs a `<Suspense>` boundary around it:

```tsx
export default function Dashboard() {
  // Start the fetch during server render, don't await it
  const statsPromise = getStats()

  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <StatsChart dataPromise={statsPromise} />
    </Suspense>
  )
}
```

```tsx
'use client'

import { use } from 'react'

export function StatsChart({ dataPromise }: { dataPromise: Promise<Stats> }) {
  const stats = use(dataPromise)

  return <div>{/* render chart with stats */}</div>
}
```

The fallback is sent immediately with the static shell. When the promise resolves, React streams the completed HTML into the page.

### Reference
- https://nextjs.org/docs/app/guides/streaming

---

## 여러 컴포넌트가 같은 데이터를 필요로 하면 어떻게 하는가?

### Official Answer
When multiple components need the same data, start the fetch once and pass the promise through a context provider so any component in the subtree can resolve it with `use()`:

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  const userPromise = getUser()

  return <UserProvider userPromise={userPromise}>{children}</UserProvider>
}
```

You can share fetched data across both Server and Client Components by combining `React.cache` with context providers.

### Reference
- https://nextjs.org/docs/app/guides/streaming
- https://nextjs.org/docs/app/getting-started/fetching-data
