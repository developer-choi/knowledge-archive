---
tags: [nextjs, performance]
---

# Questions
- App Router에서 `<Link>`의 기본 prefetch 동작은? (prefetch prop 미지정 시)
- `<Link>`의 `prefetch` prop을 true/false로 설정하면 각각 어떻게 동작하는가?
- App Router는 Pages Router의 prefetching 동작과 어떻게 다른가?
- Pages Router에 있던 hover prefetching이 App Router에서 빠졌을 때, 왜 직접 구현해야 한다고 판단했는가?
- hover prefetching을 prefetch prop 값에 따라 어떻게 다르게 적용해야 하는가?
- 왜 prefetch={false}일 때는 hover prefetching도 같이 꺼야 하는가?
- prefetch 옵션을 어떤 페이지에 우선 적용하는 것이 효과적인가?

---

# Answers

## App Router에서 `<Link>`의 기본 prefetch 동작은? (prefetch prop 미지정 시)

### Official Answer
The `<Link>`'s default prefetching behavior (i.e. when the prefetch prop is left unspecified or set to null) is different depending on your usage of loading.js.

Only the shared layout, down the rendered "tree" of components until the first loading.js file, is prefetched and cached for 30s.
This reduces the cost of fetching an entire dynamic route, and it means you can show an instant loading state for better visual feedback to users.

> #### Key Terms:
> - **shared layout**: 여러 페이지가 공유하는 layout.js
> - **loading.js**: 라우트 세그먼트의 로딩 UI를 정의하는 파일. prefetch 경계를 결정함
> - **instant loading state**: prefetch된 loading.js 덕분에 클릭 즉시 보여줄 수 있는 로딩 UI

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching

---

## `<Link>`의 `prefetch` prop을 true/false로 설정하면 각각 어떻게 동작하는가?

### Official Answer
You can disable prefetching by setting the prefetch prop to false.
Alternatively, you can prefetch the full page data beyond the loading boundaries by setting the prefetch prop to true.

> #### Key Terms:
> - **loading boundaries**: loading.js 파일을 기준으로 한 prefetch 경계

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching

---

## App Router는 Pages Router의 prefetching 동작과 어떻게 다른가?

### User Answer
Pages Router에는 마우스 오버 시점에 항상 무조건 prefetching하는 기능이 있었지만, App Router에서는 이 동작이 빠졌다.

대신 App Router에서는 SSR 느낌으로 만든 페이지조차도 prefetching이 된다.
즉, 뷰포트에 `<Link>`가 보이면 자동으로 prefetch된다.

> #### User Annotation:
> 참고: https://github.com/developer-choi/test-playground/commit/5bb1ca90ea5f21f3a72899d001508901614de313

---

## Pages Router에 있던 hover prefetching이 App Router에서 빠졌을 때, 왜 직접 구현해야 한다고 판단했는가?

### User Answer
직접 측정해본 결과, 마우스를 올리고 클릭하기까지 걸리는 시간이 0.2 ~ 0.5초였다.
- (마우스 올리자마자 바로 딱 눌러야지) 맘먹고 눌러도 0.16초 나왔음.

이 짧은 시간 동안에도 prefetching을 시작할 수 있다면 사용자 체감 속도가 의미 있게 빨라지므로, hover prefetching은 충분히 가치 있는 기능이라고 판단했다.

> #### User Annotation:
> 참고: https://github.com/developer-choi/test-playground/commit/6c95f111917a01f943295fde7d74eb4a1af61cb4

---

## hover prefetching을 prefetch prop 값에 따라 어떻게 다르게 적용해야 하는가?

### User Answer
prefetch prop 값에 따라 다음과 같이 적용한다.

1. prefetch가 undefined이면, hover 추가 O
2. prefetch가 false이면 hover 추가 X
3. prefetch가 true이면 hover 추가 X (호버 하기도 전에 이미 뷰포트에 보여서 prefetching 됨)

prefetch가 undefined일 때만 hover prefetching을 추가하는 이유는, Pages Router 제작 당시 스펙이 그랬기 때문에 (나보다 더 똑똑하신) 과거 설계자들의 스펙을 흉내내기 위함이다.

> #### User Annotation:
> 참고: https://github.com/developer-choi/react-playground/commit/b21a01b49eec3ec4d604eee87b53effd312da67d

---

## 왜 prefetch={false}일 때는 hover prefetching도 같이 꺼야 하는가?

### User Answer
prefetch={false}를 쓰는 대표적 상황은 다음과 같다.
- 리스트로 수십 개의 목록을 노출시키고 그 목록 각각이 링크로 된 경우 (예: 게시글 리스트 페이지)
- 내가 원하는 게시글을 마우스로 클릭하려고 맨 위 목록 ~ 원하는 항목까지 마우스를 쭉 움직일 때
- onMouseEnter()가 쭉 실행되면 매우 곤란해진다.

또한 GitHub 이슈에서도 "마우스 오버 prefetching을 끄고 싶은데 못 끈다"는 불만이 있었으므로, 어차피 prefetch={false}로 둘 만한 상황이면 hover도 같이 꺼져야 하는 게 맞다고 판단했다.

### Reference
- https://github.com/vercel/next.js/discussions/75738

---

## prefetch 옵션을 어떤 페이지에 우선 적용하는 것이 효과적인가?

### User Answer
prefetching이 App Router로 오면서 굉장해졌으므로, 진짜 진짜 중요한 페이지 위주로 조정해보면 좋다.

1. 홈 페이지 (로그인 성공 후 기본적으로 가게 되는 페이지)
2. 헤더나 바텀 네비게이션에 딸려있는 핵심 1뎁스 페이지들

> #### User Annotation:
> 참고: https://github.com/developer-choi/test-playground/commit/8d2a213357c2f9aed7d8413beeb2ffb0ac58e51d

### Reference
- https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching
