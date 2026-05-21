# Streaming — `loading.js`

> The special file `loading.js` helps you create meaningful Loading UI with [React Suspense](https://react.dev/reference/react/Suspense). With this convention, you can show an [instant loading state](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states) from the server while the content of a route segment loads. The new content is automatically swapped in once rendering is complete.

- `loading.js`는 Suspense임
- 즉시 로딩 보여줌
- 끝나면 교체됨

> Navigation is immediate, even with server-centric routing.

- 과거에는 SSR로 만든 페이지는 데이터 받아올 때까지 네비게이션이 완료되지 않았음.
- 이제는 그렇지 않음. 네비게이션 자체는 즉시 이뤄짐. (`loading.js`가 보일 뿐)

> Shared layouts remain interactive while new route segments load.

- Streaming 되고 있는 동안에도, 여전히 레이아웃은 상호작용 가능함.
