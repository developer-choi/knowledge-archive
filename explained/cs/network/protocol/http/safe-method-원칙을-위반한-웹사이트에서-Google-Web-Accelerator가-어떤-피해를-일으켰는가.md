# safe method 원칙을 위반한 웹사이트에서 Google Web Accelerator가 어떤 피해를 일으켰는가?

> Despite the prescribed safety of GET requests, in practice their handling by the server is not technically limited in any way.
> Careless or deliberately irregular programming can allow GET requests to cause non-trivial changes on the server.
> For example, a website might allow deletion of a resource through a URL such as https://example.com/article/1234/delete, which, if arbitrarily fetched, even using GET, would simply delete the article.
> A properly coded website would require a DELETE or POST method for this action, which non-malicious bots would not make.
> One example of this occurring in practice was during the short-lived Google Web Accelerator beta, which prefetched arbitrary URLs on the page a user was viewing, causing records to be automatically altered or deleted en masse.
> The beta was suspended only weeks after its first release, following widespread criticism.

---

**도입**

앞 질문에서 GET이 "safe"라는 약속을 가진 메서드라고 봤습니다. 하지만 약속은 강제가 아니라 합의입니다. 한 사이트의 잘못된 코드 + 브라우저의 정상 동작이 만나 대규모 데이터 손실 사고가 일어났던 게 2005년 Google Web Accelerator 사건입니다. safe method 약속을 깨면 어떤 일이 일어나는지 보여주는 가장 유명한 사례입니다.

---

**본문**

> Despite the prescribed safety of GET requests, in practice their handling by the server is not technically limited in any way.

GET 요청에 규정된 안전성에도 불구하고, 실제로 서버의 처리는 기술적으로 어떤 식으로도 제한되지 않는다.

- **prescribed safety**: 규정된 안전성. RFC 표준이 GET을 safe로 정의했음.
- **not technically limited**: 기술적으로 제한 안 됨. 서버 코드가 GET 핸들러에서 데이터를 변경하는 것을 막는 메커니즘이 없음. 약속이지 강제가 아님.

> Careless or deliberately irregular programming can allow GET requests to cause non-trivial changes on the server.

부주의하거나 의도적으로 비정상적인 프로그래밍으로 인해 GET 요청이 서버에 사소하지 않은 변경을 일으킬 수 있다.

- **careless**: 부주의. 개발자가 약속을 모르거나 무시.
- **non-trivial changes**: 사소하지 않은 변경. 데이터 삭제, 결제, 메일 발송 등 — 되돌릴 수 없는 변경.

> For example, a website might allow deletion of a resource through a URL such as https://example.com/article/1234/delete, which, if arbitrarily fetched, even using GET, would simply delete the article.

예를 들어, 어떤 웹사이트가 `https://example.com/article/1234/delete` 같은 URL을 통한 리소스 삭제를 허용한다면, 이 URL을 임의로 가져올 때(심지어 GET으로) 단순히 게시물이 삭제될 수 있다.

- **arbitrarily fetched**: 임의로 가져옴. 사용자 의도가 아니라 자동화 도구가 가져옴.
- **even using GET**: GET이라도. 이게 핵심 — GET이라 안전할 거라는 가정이 깨짐.
- **simply delete the article**: 단순히 게시물 삭제. 의도치 않은 데이터 손실.

> A properly coded website would require a DELETE or POST method for this action, which non-malicious bots would not make.

제대로 코딩된 웹사이트라면 이 동작에 DELETE나 POST 메서드를 요구하며, 악의 없는 봇은 그런 요청을 하지 않을 것이다.

- **properly coded**: 올바르게 작성된. safe method 원칙을 지킨.
- **DELETE or POST**: 데이터 변경에 적절한 메서드. 자동 호출되지 않음.
- **non-malicious bots would not make**: 악의 없는 봇은 안 보냄. 정상 봇은 GET만 자동 호출 — 데이터 변경 메서드를 임의로 보내지 않음.

> One example of this occurring in practice was during the short-lived Google Web Accelerator beta, which prefetched arbitrary URLs on the page a user was viewing, causing records to be automatically altered or deleted en masse.

이 일이 실제로 일어난 예가 잠시 운영된 Google Web Accelerator 베타로, 사용자가 보고 있는 페이지의 임의 URL을 prefetch해서 레코드가 대량으로 자동 변경 또는 삭제되도록 만들었다.

- **Google Web Accelerator**: 2005년 Google이 출시한 Firefox/IE 확장. 페이지의 링크들을 미리 가져와 캐시해 사용자 클릭 시 즉시 표시 — 좋은 의도의 성능 최적화.
- **prefetched arbitrary URLs**: 페이지의 모든 링크를 GET으로 미리 가져옴.
- **records altered or deleted en masse**: 레코드가 대량으로 변경·삭제. 사용자가 클릭하지 않았는데도.

> The beta was suspended only weeks after its first release, following widespread criticism.

베타는 광범위한 비판 끝에 첫 출시 몇 주 후에 중단되었다.

- **suspended only weeks after**: 몇 주 만에 중단. 빠른 철회.
- **widespread criticism**: 광범위한 비판. 운영자들의 피해 호소가 쏟아짐.

---

**종합**

이 사건의 인과 관계를 정리하면:

| 단계 | 주체 | 동작 |
|---|---|---|
| 1. 잘못된 사이트 코드 | 일부 웹사이트 | `GET /article/123/delete` 같은 URL이 실제 삭제 수행 |
| 2. 사용자 페이지 방문 | 사용자 | 관리 페이지 등에 위 URL의 링크들이 노출됨 |
| 3. Google Web Accelerator의 prefetch | Web Accelerator | 페이지의 모든 링크를 자동으로 GET 호출 |
| 4. 결과 | — | 사용자가 클릭하지 않았는데도 게시물 대량 삭제 |

이 사건의 교훈:

- **약속을 강제하지 않는 분산 시스템에서 약속은 기능적 제약과 거의 같다.** GET이 safe라는 약속을 깨면 그 사이트는 자동화의 모든 형태(브라우저 prefetch, 크롤러, 캐시 워밍, 링크 미리보기)에 취약해진다.
- **서버는 클라이언트가 누구인지 모른다.** 사용자의 의도적 클릭과 자동화 도구의 prefetch를 구분 못 하니, GET이라는 정보 외에는 의도를 알 수 없다.

JS 개발자가 만들 수 있는 안티패턴들:

```js
// 안티패턴 1: GET으로 데이터 변경
fetch('/api/articles/123/delete');  // 절대 안 됨

// 안티패턴 2: 링크로 데이터 변경
<a href="/articles/123/delete">삭제</a>  // 클릭 = GET. 위험!

// 정답: 데이터 변경은 명시적 메서드로
await fetch('/api/articles/123', { method: 'DELETE' });

// 또는 form POST
<form method="POST" action="/articles/123/delete">
  <button type="submit">삭제</button>
</form>
```

이게 없으면 어떻게 되는가: safe method 약속이 없었다면 — Google Web Accelerator 같은 도구뿐 아니라, 페이스북 미리보기, Slack 링크 unfurl, 검색 엔진 크롤러, 보안 스캐너 모두가 데이터를 망가뜨릴 위험이 있어 동작 불가. 웹의 자동화 인프라 전체가 성립 못 함.

오개념 예방: 이 사건이 Google의 잘못이라고 생각하기 쉽지만 — 실제로는 RFC 표준을 위반한 사이트들의 잘못이 더 큽니다. Google Web Accelerator는 GET이 safe라는 표준 약속을 신뢰했을 뿐. 다만 이 사건을 계기로 prefetch 기능이 더 보수적으로 설계되었고, 표준에 "심지어 사이트가 위반해도 prefetch는 안전해야 한다"는 가이드가 추가됐습니다.

이 사건이 남긴 또 다른 영향: REST API 설계에서 데이터 변경에는 반드시 POST/PUT/DELETE를 사용하라는 관행이 굳어진 결정적 사건이었습니다. 이전엔 단순함을 위해 GET으로 모든 걸 처리하는 사이트도 있었지만 — 이후 "그건 위험한 안티패턴"이라는 합의가 형성됐습니다.
