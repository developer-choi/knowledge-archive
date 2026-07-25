---
tags: [react, nextjs, principle]
source: official
publishable: false
---

# Questions
- 비-`NEXT_PUBLIC_` 환경 변수는 client code에서 어떻게 되는가?
- `server-only` 패키지는 왜 필요한가?
  - `client-only` 패키지는 무엇을 표시하는가?
  - `server-only`·`client-only`를 반드시 설치해야 하는가?

---

# Answers

## 비-`NEXT_PUBLIC_` 환경 변수는 client code에서 어떻게 되는가?

### Official Answer
In Next.js, only environment variables prefixed with `NEXT_PUBLIC_` are included in the client bundle. If variables are not prefixed, Next.js replaces them with an empty string.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## `server-only` 패키지는 왜 필요한가?

### Official Answer
JavaScript modules can be shared between both Server and Client Components modules. This means it's possible to accidentally import server-only code into the client.

As a result, even though `getData()` can be imported and executed on the client, it won't work as expected.

To prevent accidental usage in Client Components, you can use the `server-only` package.

Now, if you try to import the module into a Client Component, there will be a build-time error.

### User Answer
그래서 저 코드는 Client Side에서 동작하지 않는다.

의도하지 않은 동작이 없도록 하기 위해 `server-only` 패키지가 있다.

빌드 타임에서 에러를 내준다고 한다.

증명: https://github.com/developer-choi/test-playground/commit/45967fd3b8ca1244699da5839f60a901c8621889

잘 모르는 사람이 "어 왜 빈 문자열이야!" 하는 경우가 있을 수 있으니 경고가 나오는 게 합리적이다.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## `client-only` 패키지는 무엇을 표시하는가?

### Official Answer
The corresponding `client-only` package can be used to mark modules that contain client-only logic like code that accesses the `window` object.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components

---

## `server-only`·`client-only`를 반드시 설치해야 하는가?

### Official Answer
In Next.js, installing `server-only` or `client-only` is **optional**. However, if your linting rules flag extraneous dependencies, you may install them to avoid issues.

Next.js handles `server-only` and `client-only` imports internally to provide clearer error messages when a module is used in the wrong environment. The contents of these packages from NPM are not used by Next.js.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components
