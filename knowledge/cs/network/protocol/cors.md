---
tags: [network, security, browser, concept]
source: google-doc
publishable: false
priority: 1
---
# Questions

- CORS가 무엇인가요?
- CORS 정책이 없으면 어떤 위험이 있으며, 정책이 있으면 어떻게 사고를 예방할 수 있나요?
- CORS만으로 막을 수 없는 사고는 무엇이 있나요?
- Preflight가 무엇인가요?
- [UNVERIFIED] Preflight 요청을 보내는 조건(Unsafe request 판단 기준)은 무엇인가요?
- Cross Origin에 요청을 보내고, 인증 정보(쿠키 등)도 함께 보내려면 어떻게 해야 하나요?

---

# Answers

## CORS가 무엇인가요?

### User Answer

Cross-Origin Resource Sharing의 약자로, 서로 다른 오리진(Origin) 간 리소스를 공유할 수 있도록 허용하는 정책이다.

브라우저는 요청 헤더의 `Origin`과 응답 헤더의 `Access-Control-Allow-Origin`을 비교하여, 값이 다르면 응답 데이터에 대한 접근을 막는다.

`Origin` 헤더는 모든 요청에 포함되지 않는다. 브라우저가 다른 오리진으로 요청을 보낼 때만 `Origin` 헤더를 자동으로 추가한다.

브라우저는 서버와 클라이언트 사이의 중재자 역할을 한다.

---

## CORS 정책이 없으면 어떤 위험이 있으며, 정책이 있으면 어떻게 사고를 예방할 수 있나요?

### User Answer

#### 정책이 없을 경우

CORS는 서버 사이드 보안이 아닌 클라이언트 사이드 보안이다. 정책이 없으면 사용자의 개인정보를 탈취하기 쉬워진다.

개발자 도구에서 해당 사이트가 어떤 방식으로 API를 호출하는지 파악할 수 있기 때문에, 해당 사이트와 동일하게 마크업한 피싱 페이지를 만들어 사용자의 아이디·비밀번호를 입력받으면 그 사용자의 더 많은 개인정보를 탈취할 수 있다.

#### 정책이 있을 경우

개발자 도구로 API 경로·메소드·요청 파라미터를 파악하더라도, API를 악용하기 번거로워진다.

위와 같은 피싱 시나리오를 구성하더라도, API 호출에서 정상 응답을 받더라도 브라우저가 그 응답을 버리기 때문에 사용자에게 정상적인 페이지를 보여줄 수 없게 된다.

---

## CORS만으로 막을 수 없는 사고는 무엇이 있나요?

### User Answer

CORS 위반 판단은 브라우저 스펙이다. 서버에는 요청이 정상적으로 들어가고 응답도 정상적으로 나온다. 브라우저가 그 응답을 버릴지 말지 판단하는 것이기 때문이다.

따라서 CORS에만 의존하면, 예를 들어 `www.maver.com` 같은 유사 도메인으로 사이트를 복제해 사용자 계정으로 비싼 물건을 구매하는 공격은 CORS로 막을 수 없다. (서버에 요청이 도달하고 처리되기 때문)

---

## Preflight가 무엇인가요?

### User Answer

Unsafe request를 보내기 전에 미리 서버에 보내는 사전 요청이다.

이 사전 요청을 통해 서버가 해당 요청을 수락할지 확인하고, 서버가 수락하지 않으면 실제 요청(Unsafe request)은 전송되지 않는다.

Preflight 요청은 `OPTIONS` 메소드를 사용한다. 대부분의 Cross Origin 요청 시나리오는 Preflight 방식으로 처리된다.

브라우저는 요청을 바로 서버로 보내지 않고, Preflight(예비 요청)와 본 요청을 순서대로 보낸다.

### Reference
- https://javascript.info/fetch-crossorigin#safe-requests

---

## [UNVERIFIED] Preflight 요청을 보내는 조건(Unsafe request 판단 기준)은 무엇인가요?

### Reference
- https://javascript.info/fetch-crossorigin#safe-requests

---

## Cross Origin에 요청을 보내고, 인증 정보(쿠키 등)도 함께 보내려면 어떻게 해야 하나요?

### User Answer

두 가지 조건이 모두 충족되어야 한다.

1. 서버가 `Access-Control-Allow-Origin`에 해당 오리진을 추가해야 요청 자체가 허용된다.
2. 클라이언트는 요청의 `credentials` 옵션을 활성화하고, 서버는 응답 헤더에 `Access-Control-Allow-Credentials: true`를 추가해야 한다.

#### 클라이언트 credentials 옵션 활성화 방법

- `XMLHttpRequest.withCredentials = true`
- `AxiosRequestConfig.withCredentials = true`
- `fetch()` → `credentials: 'include'`

`credentials` 값은 요청 헤더에 직접 넣는 것이 아니라 요청 객체의 옵션으로 지정하는 것이다. HTTP 헤더 목록에 `credentials` 헤더는 존재하지 않는다. 쿠키를 억지로 헤더에 직접 추가하려 해도 `Cookie`는 개발자가 설정할 수 없는 Forbidden header이므로 동작하지 않는다.

#### credentials 옵션 값별 동작

fetch API / Request 객체 (`include` / `same-origin` / `omit`):
- `same-origin`: 같은 출처 간 요청에만 인증 정보를 포함한다.
- `include`: 항상 인증 정보를 포함한다. 단, 서버에서 `Access-Control-Allow-Credentials: true`로 응답해야 한다.
- `omit`: 인증 정보를 포함하지 않는다.

XMLHttpRequest / Axios (`withCredentials`: `undefined` / `false` / `true`):
- `undefined`: 같은 출처 간 요청일 때만 인증 정보를 헤더에 담는다.
- `false`: 인증 정보를 헤더에 담지 않는다.
- `true`: 인증 정보를 헤더에 담는다. 단, 서버에서 `Access-Control-Allow-Credentials: true`로 응답해야 한다.

Axios의 옵션 키 이름은 `withCredentials`이지 `credentials`가 아님에 주의.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
- https://axios-http.com/docs/req_config
- https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
- https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name
- https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
