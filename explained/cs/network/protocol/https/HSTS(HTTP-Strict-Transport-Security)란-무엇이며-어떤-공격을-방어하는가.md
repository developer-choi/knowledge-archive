# HSTS(HTTP Strict Transport Security)란 무엇이며, 어떤 공격을 방어하는가?

> It is recommended to use HTTP Strict Transport Security (HSTS) with HTTPS to protect users from man-in-the-middle attacks, especially SSL stripping.

---

**도입**

브라우저 주소창에 `example.com`만 입력하면 — 보통 브라우저는 먼저 `http://example.com`으로 시도합니다. 서버가 `https://`로 리다이렉트해주면 그제야 HTTPS로 갑니다. 이 짧은 사이에 공격자가 끼어들면 — 사용자가 영원히 HTTP에서 빠져나오지 못하게 만들 수 있습니다. HSTS는 이 틈을 막습니다.

---

**본문**

> It is recommended to use HTTP Strict Transport Security (HSTS) with HTTPS

HTTPS와 함께 HSTS(HTTP Strict Transport Security)를 사용하는 것이 권장된다.

- **HTTP Strict Transport Security (HSTS)**: HTTP 엄격 전송 보안. "이 사이트는 HTTPS로만 접속하라"는 강제 규칙을 브라우저에 알리는 메커니즘.
- **with HTTPS**: HTTPS와 함께. HSTS 자체는 HTTPS의 보완으로, HTTPS 없이는 의미 없음.

> to protect users from man-in-the-middle attacks, especially SSL stripping.

man-in-the-middle 공격, 특히 SSL stripping으로부터 사용자를 보호하기 위해서다.

- **MITM attacks**: 통신 중간에 공격자가 끼어드는 공격.
- **SSL stripping**: SSL 제거. 사용자가 HTTPS로 가려는 시도를 공격자가 가로채 HTTP로 강등시키는 공격.

---

**종합**

SSL stripping 공격의 흐름:

```
정상 흐름:
  사용자: example.com 입력
  브라우저: http://example.com 으로 시도 (기본)
  서버: 301 Redirect → https://example.com
  브라우저: https://example.com 으로 재접속
  → 안전한 HTTPS 통신

SSL stripping 공격:
  사용자: example.com 입력
  브라우저: http://example.com 으로 시도
  공격자(MITM): 요청 가로채기
    공격자 → 진짜 서버: https://example.com 으로 접속 (자기는 HTTPS 사용)
    공격자 → 사용자: 모든 응답을 HTTP로 보냄 (https → http로 변환)
  사용자는 HTTP로 통신 중이라는 사실을 모름
    (Official Annotation 인용: "they get to a secure site by clicking on a link,
     and thus are fooled into thinking that they are using HTTPS when in fact they are using HTTP")
  → 공격자가 모든 평문 트래픽을 가로챔
```

HSTS가 어떻게 막는가:

```
첫 방문 시:
  서버 응답에 헤더 포함:
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
                                    └─ 1년간 유효
  
  브라우저: "이 사이트는 앞으로 1년간 HTTPS로만 접속한다"고 기록

두 번째 방문 (HSTS 정책 활성):
  사용자: example.com 입력
  브라우저: HTTPS 정책이 있는지 확인
  → 있음! 즉시 https://example.com 으로 시도 (HTTP 시도조차 안 함)
  
  공격자가 SSL stripping 시도해도:
  → 브라우저가 HTTP 응답 자체를 거부
  → 사용자는 사이트 접속 실패를 보지만 공격자에게 정보 노출은 없음
```

HSTS 헤더의 옵션들:

| 옵션 | 의미 | 예 |
|---|---|---|
| `max-age=N` | N초간 정책 유지 | `max-age=31536000` (1년) |
| `includeSubDomains` | 서브도메인까지 적용 | `*.example.com` 모두 HTTPS 강제 |
| `preload` | 브라우저 preload 목록에 등록 신청 | 첫 방문 전부터 HTTPS 강제 가능 |

**HSTS preload 목록**

`preload` 옵션을 사용하면 — Chrome/Firefox 등이 관리하는 미리 로드된 HSTS 사이트 목록에 추가 신청 가능. 이 목록에 포함된 사이트는 — 사용자가 한 번도 방문 안 한 첫 방문에서도 — 브라우저가 HTTPS로만 접속. SSL stripping 공격이 첫 방문에서도 불가능.

google.com, facebook.com, github.com 같은 주요 사이트가 모두 preload 목록에 있습니다.

JS 개발자에게 와닿는 사례:

```js
// HSTS가 활성된 사이트로 fetch
await fetch('http://github.com/api');         // HTTP로 시도
// 브라우저: HSTS 정책 확인 → 자동으로 https://github.com/api 로 전환
// 또는 HTTP 요청 자체를 차단하고 에러 반환

// 첫 방문에서도 HSTS preload 목록에 있으면 HTTP 시도 자체를 안 함
```

서버에서 HSTS 헤더 설정 (Express 예):

```js
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  next();
});
```

이게 없으면 어떻게 되는가:

- HSTS가 없다면 — 사용자가 처음 사이트에 접속할 때마다 HTTP로 시도하는 짧은 창이 열려 있어 SSL stripping이 가능. Firesheep(2010) 같은 도구가 카페에서 손쉽게 세션 탈취.
- HSTS가 있어도 첫 방문은 보호 안 됨(서버에 도달해 헤더를 받아야 정책 활성화). 이를 메우는 게 HSTS preload — 브라우저에 미리 정책을 박아둠.

오개념 예방: HSTS는 SSL stripping의 모든 형태를 막지는 못합니다. 첫 방문(preload 없는 경우)에서는 여전히 취약. 그래서 주요 사이트는 preload 목록에 등재 신청을 합니다. 또한 HSTS 정책이 만료되면(max-age 지나면) 다시 첫 방문 상태로 돌아가므로 — 충분히 긴 max-age(보통 1년) 권장.

또 다른 오해: HSTS가 만능이 아니라는 점. HSTS는 "사용자 → 사이트" 방향에서 HTTP를 강제로 HTTPS로 만드는 것 — 이미 HTTPS인 통신의 보안을 강화하지는 않습니다. TLS 자체의 보안(인증서 검증, cipher suite 등)은 별개로 신경 써야 합니다.

Official Annotation 보충: SSL stripping 공격은 https 링크를 http 링크로 바꿔치기해서 HTTPS의 보안을 무력화시키는 공격입니다. "few Internet users actually type 'https' into their browser interface" — 대부분 사용자가 https를 직접 입력하지 않고 링크를 클릭해 사이트에 도달하기 때문에 — HTTPS를 사용 중이라고 착각하지만 실제로는 HTTP를 쓰는 상황이 만들어집니다. 공격자는 클라이언트와 평문으로 통신하면서 자신이 진짜 서버처럼 동작합니다.

AI Annotation 보충: SSL stripping은 공격자가 클라이언트와 서버 사이에서 HTTPS 링크를 HTTP로 바꿔치기하는 공격입니다. 사용자는 HTTP로 접속하고 있다는 사실을 모른 채 평문으로 통신하게 됩니다. HSTS는 서버가 브라우저에 "이 사이트는 앞으로 HTTPS로만 접속하라"고 알려주는 메커니즘입니다. 한 번 설정되면 브라우저가 HTTP 접속 자체를 거부하므로 SSL stripping이 불가능해집니다.
