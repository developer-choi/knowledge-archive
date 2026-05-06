# HTTP에서 safe method란 무엇인가?

> A request method is safe if a request with that method has no intended effect on the server.
> The methods GET, HEAD, OPTIONS, and TRACE are defined as safe.
> In other words, safe methods are intended to be read-only.
> In contrast, the methods POST, PUT, DELETE, CONNECT, and PATCH are not safe.
> They may modify the state of the server or have other effects such as sending an email.

---

**도입**

브라우저가 페이지를 미리 가져오는 prefetch 기능이나 검색 엔진의 크롤러를 떠올려 보세요. 둘 다 사용자 의사 없이 자동으로 URL을 호출합니다. 이 자동 호출이 데이터를 삭제하거나 결제를 발생시키면 큰일입니다 — 그래서 HTTP는 "자동으로 호출해도 안전한 메서드"를 정해뒀습니다. 그게 safe method입니다.

---

**본문**

> A request method is safe if a request with that method has no intended effect on the server.

요청 메서드는 그 메서드의 요청이 서버에 의도된 효과(부작용)를 갖지 않으면 safe하다.

- **safe**: 안전한. "데이터를 변경하지 않는"이라는 약속.
- **no intended effect on the server**: 서버에 의도된 효과 없음. "의도된"이 핵심 — 로그 기록 같은 부수적 효과는 있을 수 있지만, 의도된 데이터 변경은 없어야 함.

> The methods GET, HEAD, OPTIONS, and TRACE are defined as safe.

GET, HEAD, OPTIONS, TRACE 메서드가 safe로 정의된다.

- **GET**: 리소스 조회. 가장 흔한 safe 메서드.
- **HEAD**: GET과 동일하지만 응답 헤더만 받음(본문 없음). 리소스 존재 여부·메타정보 확인용.
- **OPTIONS**: 서버가 어떤 메서드를 지원하는지 묻기. CORS preflight에서 사용.
- **TRACE**: 디버깅용. 요청을 받은 그대로 에코백. 보안 위험으로 거의 사용 안 됨.

> In other words, safe methods are intended to be read-only.

다시 말해, safe 메서드는 읽기 전용으로 의도된다.

- **read-only**: 읽기만. 데이터를 가져오는 것은 OK, 변경하는 것은 not OK.
- **intended**: 의도된. 약속이지 강제가 아님 — 서버가 GET 핸들러에 변경 코드를 넣을 수도 있지만, 그건 약속 위반.

> In contrast, the methods POST, PUT, DELETE, CONNECT, and PATCH are not safe.

반대로 POST, PUT, DELETE, CONNECT, PATCH 메서드는 safe하지 않다.

- **POST**: 새 리소스 생성, 결제 처리 등. 부작용 명시적.
- **PUT**: 전체 교체. 데이터 변경.
- **DELETE**: 삭제. 가장 명확한 변경.
- **CONNECT**: 프록시를 통한 터널링. 연결 생성 자체가 부작용.
- **PATCH**: 부분 수정. 데이터 변경.

> They may modify the state of the server or have other effects such as sending an email.

이들은 서버 상태를 수정하거나 이메일 전송 같은 다른 효과를 가질 수 있다.

- **modify the state of the server**: 서버 상태 변경. DB 레코드 추가/수정/삭제.
- **other effects such as sending an email**: 다른 부작용. 이메일 전송, 결제, 외부 API 호출 등 — 한 번 일어나면 되돌릴 수 없는 행위.

---

**종합**

safe와 not-safe 메서드의 비교:

| 메서드 | safe | 의도된 효과 |
|---|---|---|
| GET | ○ | 데이터 조회만 |
| HEAD | ○ | 헤더만 조회 |
| OPTIONS | ○ | 지원 메서드 확인 |
| TRACE | ○ | 요청 에코백 |
| POST | × | 처리·생성, 부작용 가능 |
| PUT | × | 전체 교체 |
| PATCH | × | 부분 수정 |
| DELETE | × | 삭제 |
| CONNECT | × | 터널 생성 |

safe method는 자동화 시스템의 안전 가드레일입니다:

- **브라우저 prefetch**: `<link rel="prefetch">`로 다음에 방문할 페이지를 미리 가져옴. GET만 자동 호출 — 데이터 변경 위험 없음.
- **검색 엔진 크롤러**: GET으로 페이지를 긁어 인덱싱. 사이트 데이터를 임의로 변경하지 않음.
- **링크 미리보기**: Slack, 카카오톡이 URL을 받으면 자동으로 GET해서 OG 태그를 가져옴. 이게 결제를 발생시키면 안 되니까.

JS 개발자에게 와닿는 사례:

```js
// 안전 — GET은 부작용 없어야 하므로 prefetch에 적합
await fetch('/api/users/123');                 // safe

// 위험 — GET으로 데이터 변경하면 prefetch가 의도치 않은 변경 발생
await fetch('/api/users/123/delete');          // 메서드가 GET이지만 URL이 동작 암시 → 위험!
// 차라리:
await fetch('/api/users/123', { method: 'DELETE' });
```

이게 없으면 어떻게 되는가:

- safe 메서드 약속이 없다면 — 브라우저 prefetch, 크롤러, 캐시 워밍 같은 자동화가 데이터를 망가뜨릴 위험이 있어 사실상 불가능했을 것.
- Google Web Accelerator 사건(2005): GET으로 데이터 변경(예: `/article/123/delete`)을 허용한 사이트가 있었습니다. Web Accelerator가 페이지의 모든 링크를 GET으로 미리 호출 → 게시물이 대량 삭제되는 사고. safe method 위반의 대표적 사례.

오개념 예방: safe하다고 캐싱 가능한 건 별개입니다. GET은 보통 캐시 가능하지만, `Cache-Control: no-store` 같은 헤더로 캐시 거부 가능. 반대로 safe하지 않은 메서드라도 응답에 따라 캐시 전략이 다를 수 있습니다.

safe와 idempotent의 관계: safe ⊂ idempotent. safe하면 자동으로 idempotent(여러 번 보내도 같은 결과 — 어차피 변경 없으니까). 하지만 idempotent라고 safe인 건 아닙니다 — DELETE는 idempotent이지만 safe하지 않습니다(여러 번 보내도 같은 결과지만 데이터 변경).
