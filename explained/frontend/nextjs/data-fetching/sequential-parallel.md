# layout과 page의 데이터 요청은 서로 어떤 순서로 시작되는가?

## 도입

layout이 먼저 그려지고 그 안에 page가 들어가니, 데이터도 layout 것부터 순서대로 가져올 것 같다. 그렇지 않다.

---
## 본문

> By default, layouts and pages are rendered in parallel. So each segment starts fetching data as soon as possible.

"기본적으로 layout과 page는 병렬로 렌더링된다. 따라서 각 구간은 가능한 한 빨리 데이터 가져오기를 시작한다."

- **in parallel**: 나란히, 동시에.
- **segment**: 구간. 폴더 하나에 대응하는 경로 조각이며 여기서는 layout·page 각각을 가리킨다.
- **as soon as possible**: 가능한 한 빨리.

### 중첩과 실행 순서는 별개다

화면에서 layout이 page를 감싼다고 해서, 실행도 감싸는 순서를 따라야 하는 것은 아니다. 어느 구간이 어떤 데이터를 쓰는지는 서로 무관하기 때문이다.

```
화면 구조                  데이터 요청 시작 시점

layout                     layout  ■■■■■■
  └ page                   page    ■■■■■■■■
                                   ↑ 둘 다 여기서 함께 출발
```

만약 순서대로였다면 layout이 느린 라우트는 page가 그만큼 늦게 출발했을 것이다. 실제로는 각자 출발하므로 총 시간은 둘 중 느린 쪽에 맞춰진다.

### 그래서 순차가 되는 경우는 한 파일 안이다

구간끼리는 알아서 병렬이므로, 개발자가 실수로 줄을 세우게 되는 자리는 결국 컴포넌트 하나의 함수 몸통 안이다. 다음 질문이 그 이야기다.

---
## 종합

구간 사이는 기본이 병렬이라 손댈 게 없다. layout이 느리다고 page가 기다리지 않는다. 신경 써야 하는 건 한 컴포넌트 안에서 `await`를 어떻게 늘어놓느냐뿐이다.

---

# 뒤에 올 데이터 로딩이 앞의 `await` 때문에 늦어지는 것을 막으려면 어떻게 하는가?

## 도입

`await`를 두 번 연달아 쓰면 두 번째 요청은 첫 번째가 끝날 때까지 시작조차 못 한다. 서로 무관한 데이터인데도 그렇다. 푸는 방법은 두 가지이며, 둘 다 "시작"과 "기다림"을 떼어 놓는다는 점에서는 같다.

---
## 본문

> However, within any component, multiple `async`/`await` requests can still be sequential if placed after the other. For example, `getAlbums` will be blocked until `getArtist` is resolved:

"다만 어느 컴포넌트 안에서든 `async`/`await` 요청을 나란히 이어 쓰면 여전히 순차가 될 수 있다. 예를 들어 `getAlbums`는 `getArtist`가 끝날 때까지 막힌다."

- **within any component**: 어느 컴포넌트 안에서든. 구간 사이는 병렬이어도 함수 안은 아니라는 대비다.
- **placed after the other**: 하나 뒤에 다른 하나를 놓은.

```tsx
const artist = await getArtist(username)
const albums = await getAlbums(username)
```

> Start multiple requests by calling `fetch`, then await them with `Promise.all`. Requests begin as soon as `fetch` is called.

"`fetch`를 호출해 여러 요청을 시작한 다음 `Promise.all`로 함께 기다린다. 요청은 `fetch`가 불린 순간 시작된다."

- **begin as soon as**: 그 즉시 시작된다.

```tsx
const artistData = getArtist(username)
const albumsData = getAlbums(username)

const [artist, albums] = await Promise.all([artistData, albumsData])
```

> You can preload data by creating a utility function that you eagerly call above blocking requests. This lets you initiate data fetching early, so the data is already available by the time the component renders.

"막히는 요청보다 위에서 미리 부르는 유틸리티 함수를 만들어 데이터를 앞당겨 불러올 수 있다. 이렇게 하면 데이터 가져오기를 일찍 시작해, 컴포넌트가 렌더링될 시점에는 데이터가 이미 준비돼 있다."

- **eagerly**: 결과가 당장 필요하지 않은데도 서둘러 부르는 것.
- **blocking**: `await`로 다음 줄을 멈춰 세우는 요청.

> Combine the `server-only` package with React's `cache` to create a reusable preload utility:

"`server-only` 패키지와 React의 `cache`를 조합해 재사용 가능한 preload 유틸리티를 만든다."

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

> Then call `preload()` before any blocking work so the data starts loading immediately:

"그런 다음 막히는 작업보다 먼저 `preload()`를 불러 데이터 로딩이 즉시 시작되게 한다."

```tsx
const { id } = await params
preload(id)
const isAvailable = await checkIsAvailable()

return isAvailable ? <Item id={id} /> : null
```

### 문제는 `await`의 줄 세우기다

`await`는 "이게 끝날 때까지 다음 줄로 안 간다"는 뜻이다. 그래서 서로 무관한 두 요청이 줄을 선다.

```
그냥 쓰면

checkIsAvailable  ■■■■■■
getItem                 ■■■■■■■■
                  └──────────────┘  총 시간

미리 띄워 두면

checkIsAvailable  ■■■■■■
getItem           ■■■■■■■■
                  └────────┘  총 시간
```

### 두 방법을 언제 나눠 쓰는가

`Promise.all`과 preload는 같은 원리를 쓰지만 쓰이는 자리가 다르다.

```
Promise.all
  결과를 둘 다 이 컴포넌트에서 쓸 때
  한자리에 모여 있어 읽기 쉽다

preload
  결과를 쓰는 곳이 다른 컴포넌트일 때
  또는 조건 때문에 결과가 안 쓰일 수도 있을 때
```

위 예시에서 `getItem`의 결과는 `<Item>` 안에서 쓰이고, `isAvailable`이 거짓이면 아예 안 쓰인다. `Promise.all`로 묶으려면 안 쓸지도 모르는 값을 이 자리에서 받아 놓아야 하므로 모양이 어색해진다. 그래서 "요청만 띄워 두는" preload가 맞는다.

### `void`로 결과를 버리는 이유

```ts
export const preload = (id: string) => {
  void getItem(id)
}
```

여기서 필요한 건 반환값이 아니라 **함수가 호출됐다는 사실**이다. `getItem`이 `cache`로 감싸져 있으므로, 한 번 호출되면 그 결과가 기억된다. 나중에 `<Item>` 안에서 같은 `getItem(id)`를 부르면 새 요청을 보내지 않고 기억된 것을 그대로 받는다.

`void`는 "이 값을 안 쓸 것"이라는 표시다. 없어도 동작은 같지만, 붙여 두면 린터가 "Promise를 받아 놓고 안 쓴다"고 경고하는 것을 막고 읽는 사람에게 의도를 알린다.

### 캐싱과는 다른 이야기다

preload가 쓰는 `cache`는 서버에 데이터를 저장해 두는 캐싱과 이름만 비슷하다. 이 기억은 **요청 하나가 처리되는 동안에만** 살아 있고 다음 요청에는 남지 않는다. 목적은 "다음에 또 쓰려고 저장"이 아니라 "지금 이 렌더 안에서 순서를 앞당기기"다.

### `server-only`가 붙는 이유

`import 'server-only'`는 이 파일이 클라이언트 번들에 실려 들어가면 빌드 타임에 에러를 내게 한다. 데이터베이스 접속 정보나 서버 전용 로직이 브라우저로 새는 것을 막는 안전장치다. preload 자체의 동작과는 무관하지만, 데이터 접근 유틸에는 붙여 두는 게 관례다.

---
## 종합

`await`가 무관한 요청까지 줄 세우는 게 문제이고, 답은 시작과 기다림을 떼어 놓는 것이다. 결과를 이 자리에서 다 쓴다면 먼저 호출해 두고 `Promise.all`로 함께 기다리면 되고, 결과를 다른 컴포넌트가 쓰거나 안 쓸 수도 있다면 결과를 안 받는 호출로 요청만 띄워 두면 된다.
