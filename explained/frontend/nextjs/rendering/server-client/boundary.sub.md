# 비-`NEXT_PUBLIC_` 환경 변수는 client code에서 어떻게 되는가?

## 도입

환경 변수 접두사 규칙을 모르면 서버에서 잘 동작하던 코드가 클라이언트에서 예상치 못하게 동작할 수 있다.

---
## 본문

> In Next.js, only environment variables prefixed with `NEXT_PUBLIC_` are included in the client bundle. If variables are not prefixed, Next.js replaces them with an empty string.

"Next.js에서는 `NEXT_PUBLIC_` 접두사가 붙은 환경 변수만 클라이언트 번들에 포함된다. 접두사가 없으면 Next.js가 그 값을 빈 문자열로 바꿔 넣는다."

- **included in the client bundle**: 브라우저로 내려가는 코드 안에 그 값이 실제로 박힌다는 뜻이다. 그래서 공개해도 되는 값에만 이 접두사를 붙인다.
- **replaces them with an empty string**: 값을 지우는 것이 아니라 빌드할 때 자리에 `""`를 대신 넣는다. 비밀 값이 브라우저로 새어 나가지 않게 하려는 처리다.

```
환경 변수 접근 규칙

NEXT_PUBLIC_ANALYTICS_ID   → 클라이언트 번들에 포함, 브라우저에서 접근 가능
DATABASE_URL               → 서버 전용, 클라이언트에서 "" (빈 문자열)
API_SECRET_KEY             → 서버 전용, 클라이언트에서 "" (빈 문자열)

// CC에서
process.env.DATABASE_URL   → "" (에러 없이 빈 문자열)
process.env.NEXT_PUBLIC_ID → "actual-id-value"
```

- **빈 문자열로 교체**: 에러가 발생하지 않아 문제를 늦게 발견할 수 있다. `API_KEY`가 빈 문자열이면 API 인증이 실패하지만, 그 이유가 환경 변수 접근 문제임을 바로 알기 어렵다.

---
## 종합

`NEXT_PUBLIC_` 없는 환경 변수는 서버 전용이다. 클라이언트 코드에서 접근하면 에러 없이 빈 문자열이 된다. 이 조용한 실패가 디버깅을 어렵게 한다. 서버 전용 환경 변수를 쓰는 함수는 `server-only` 패키지로 보호하고, 클라이언트에서 필요한 값은 반드시 `NEXT_PUBLIC_` 접두사를 붙여야 한다.

---

# `server-only` 패키지는 왜 필요한가?

## 도입

서버에서만 사용해야 할 코드(DB 연결, 비밀 API 키를 사용하는 함수 등)가 실수로 CC에 import되면 보안 문제가 생긴다. `server-only` 패키지는 이런 실수를 빌드 타임에 잡아준다.

---
## 본문

> JavaScript modules can be shared between both Server and Client Components modules. This means it's possible to accidentally import server-only code into the client.

"JavaScript 모듈은 Server Component 쪽과 Client Component 쪽이 함께 쓸 수 있다. 그래서 서버 전용 코드가 실수로 클라이언트에 import될 수 있다."

> As a result, even though `getData()` can be imported and executed on the client, it won't work as expected.

"그 결과 `getData()`는 클라이언트에서 import되어 실행될 수는 있지만, 기대한 대로 동작하지는 않는다."

- **shared between both**: 파일이 서버 전용인지 클라이언트 전용인지 코드만 봐서는 구분되지 않는다는 뜻이다. 편리한 동시에 사고의 원인이다.
- **won't work as expected**: 앞 질문에서 본 대로 서버 전용 환경 변수가 클라이언트에서는 빈 문자열이 되기 때문이다. 에러가 나는 게 아니라 조용히 이상하게 동작한다.

> To prevent accidental usage in Client Components, you can use the `server-only` package.
>
> Now, if you try to import the module into a Client Component, there will be a build-time error.

"Client Component에서 실수로 쓰이는 것을 막으려면 `server-only` 패키지를 쓰면 된다. 그러면 그 모듈을 Client Component에 import하려 할 때 빌드 타임 에러가 난다."

`server-only` 사용 예시:

```ts
// lib/data.ts
import 'server-only'; // 이 파일이 CC에 import되면 빌드 에러

export async function getData() {
  const data = await fetch('https://api.example.com', {
    headers: { Authorization: process.env.API_KEY },
  });
  return data.json();
}
```

---
## 종합

`server-only`는 "이 파일은 서버에서만 사용해야 한다"는 의도를 빌드 타임 검증으로 강제한다. 없으면 서버 전용 코드가 CC에 import되어도 빌드는 통과하고, 런타임에 빈 문자열 API 키로 실패하거나 서버 로직이 클라이언트에 노출된다. 민감한 로직이 있는 유틸 파일에는 `server-only`를 추가하는 것이 방어적 프로그래밍의 기본이다.

---

# `client-only` 패키지는 무엇을 표시하는가?

## 도입

앞에서 본 `server-only`는 "이 파일은 서버에서만 써야 한다"를 표시한다. 그 반대편 짝이 `client-only`다. 브라우저에서만 존재하는 것에 기대는 코드가 서버로 끌려 들어가는 것을 막는 용도다.

---
## 본문

> The corresponding `client-only` package can be used to mark modules that contain client-only logic like code that accesses the `window` object.

"대응되는 `client-only` 패키지는 `window` 객체에 접근하는 코드처럼 클라이언트 전용 로직을 담은 모듈을 표시하는 데 쓸 수 있다."

- **corresponding**: `server-only`와 짝을 이룬다는 뜻. 막으려는 방향만 반대다.
- **mark**: 코드 동작을 바꾸는 것이 아니라 표시만 한다. 잘못된 쪽에서 불러 쓰면 그때 문제를 알려준다.
- **client-only logic**: 브라우저 런타임에만 존재하는 것에 기대는 코드. `window`, `document`, `localStorage` 접근이 대표적이다.

```
방향이 반대인 두 표시

server-only   서버 전용 파일에 표시 → Client Component가 불러 쓰면 에러
client-only   브라우저 전용 파일에 표시 → Server Component가 불러 쓰면 에러
```

이 표시가 없으면 어떻게 되는가. `window.matchMedia`를 쓰는 유틸을 서버에서 실행되는 컴포넌트가 불러 쓰면, 서버에는 `window`가 없으므로 화면을 그리는 도중에야 오류가 난다. `client-only`를 붙여 두면 그 파일이 서버 쪽으로 딸려 들어간 시점에 걸린다.

---
## 종합

`server-only`와 `client-only`는 같은 문제를 양쪽에서 막는 한 쌍이다. 코드가 서버와 클라이언트 양쪽에서 공유될 수 있다는 점이 편리한 동시에 사고의 원인이므로, "이 파일은 이쪽에서만"이라는 의도를 코드에 적어 두고 잘못된 쪽에서 부르는 순간 알려 주게 만드는 것이다. 실행해 보고 알아채는 대신 불러 쓰는 시점에 알아채게 하는 안전장치라고 보면 된다.

---

# `server-only`·`client-only`를 반드시 설치해야 하는가?

## 도입

이름이 NPM 패키지이다 보니 `npm install`부터 해야 쓸 수 있다고 읽기 쉽다. 실제로는 설치가 선택이고, Next.js는 그 import를 자체적으로 처리한다.

---
## 본문

> In Next.js, installing `server-only` or `client-only` is **optional**. However, if your linting rules flag extraneous dependencies, you may install them to avoid issues.

"Next.js에서 `server-only`나 `client-only`를 설치하는 것은 선택이다. 다만 린트 규칙이 선언되지 않은 의존성을 문제 삼는다면, 그 문제를 피하려고 설치할 수는 있다."

- **optional**: 필수가 아니라는 뜻. 설치하지 않고 `import 'server-only'`만 적어도 동작한다.
- **linting rules**: 코드를 검사해 규칙 위반을 알려 주는 도구의 규칙.
- **extraneous dependencies**: `package.json`에 적어 두지 않은 것을 import하고 있는 상태. 이 경우 설치는 Next.js가 요구해서가 아니라 검사 도구를 조용히 시키기 위한 것이다.

> Next.js handles `server-only` and `client-only` imports internally to provide clearer error messages when a module is used in the wrong environment. The contents of these packages from NPM are not used by Next.js.

"Next.js는 `server-only`와 `client-only`의 import를 내부적으로 처리해서, 모듈이 잘못된 환경에서 사용될 때 더 알아보기 쉬운 에러 메시지를 제공한다. NPM에 올라온 이 패키지들의 실제 내용물은 Next.js가 사용하지 않는다."

- **handles ... internally**: import 구문 자체를 Next.js가 신호로 읽고 처리한다는 뜻. 실제로 그 패키지의 코드를 불러다 실행하는 것이 아니다.
- **clearer error messages**: 이 표시가 없을 때 나오는 알쏭달쏭한 증상 대신, 어디가 잘못됐는지 바로 짚어 주는 메시지를 낸다.
- **contents ... are not used**: NPM에 올라간 패키지 본체는 쓰이지 않는다. 그래서 설치 여부가 동작을 좌우하지 않는다.

```
import 'server-only' 한 줄이 처리되는 경로

Next.js 빌드 → import 구문을 신호로 인식
             → 잘못된 환경에서 쓰였는지 판정
             → 알아보기 쉬운 에러 메시지

NPM 패키지 본체 → 사용되지 않음 (설치는 린트 대응용)
```

---
## 종합

설치가 필요한 것은 Next.js 때문이 아니라 검사 도구 때문이다. Next.js는 `import 'server-only'`라는 구문 자체를 신호로 읽어 잘못된 쪽에서 쓰였는지 판정하므로, 패키지가 없어도 의도한 보호가 그대로 동작한다. 린트 규칙이 "선언되지 않은 의존성"이라고 걸고넘어질 때만 설치해 두면 된다.
