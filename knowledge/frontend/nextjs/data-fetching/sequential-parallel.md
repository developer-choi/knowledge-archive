---
tags: [nextjs, react, performance, principle]
source: official
publishable: true
priority:
---

# Questions
- layout과 page의 데이터 요청은 서로 어떤 순서로 시작되는가?
- 뒤에 올 데이터 로딩이 앞의 `await` 때문에 늦어지는 것을 막으려면 어떻게 하는가?

---

# Answers

## layout과 page의 데이터 요청은 서로 어떤 순서로 시작되는가?

### Official Answer
By default, layouts and pages are rendered in parallel. So each segment starts fetching data as soon as possible.

### Reference
- https://nextjs.org/docs/app/getting-started/fetching-data

---

## 뒤에 올 데이터 로딩이 앞의 `await` 때문에 늦어지는 것을 막으려면 어떻게 하는가?

### Official Answer
However, within any component, multiple `async`/`await` requests can still be sequential if placed after the other. For example, `getAlbums` will be blocked until `getArtist` is resolved:

```tsx
import { getArtist, getAlbums } from '@/app/lib/data'

export default async function Page({ params }) {
  // These requests will be sequential
  const { username } = await params
  const artist = await getArtist(username)
  const albums = await getAlbums(username)
  return <div>{artist.name}</div>
}
```

Start multiple requests by calling `fetch`, then await them with `Promise.all`. Requests begin as soon as `fetch` is called.

```tsx
const artistData = getArtist(username)
const albumsData = getAlbums(username)

const [artist, albums] = await Promise.all([artistData, albumsData])
```

You can preload data by creating a utility function that you eagerly call above blocking requests. This lets you initiate data fetching early, so the data is already available by the time the component renders.

Combine the `server-only` package with React's `cache` to create a reusable preload utility:

```ts
import { cache } from 'react'
import 'server-only'

export const getItem = cache(async (id: string) => {
  // ...
})

export const preload = (id: string) => {
  void getItem(id)
}
```

Then call `preload()` before any blocking work so the data starts loading immediately:

```tsx
import { getItem, preload, checkIsAvailable } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // Start loading item data
  preload(id)
  // Perform another asynchronous task
  const isAvailable = await checkIsAvailable()

  return isAvailable ? <Item id={id} /> : null
}

async function Item({ id }: { id: string }) {
  const result = await getItem(id)
  // ...
}
```

### Reference
- https://nextjs.org/docs/app/getting-started/fetching-data
- https://nextjs.org/docs/app/guides/caching-without-cache-components
