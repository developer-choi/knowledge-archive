# HTTP 헤더 중 hop-by-hop 헤더와 end-to-end 헤더의 차이는?

> To allow intermediate HTTP nodes (proxy servers, web caches, etc.) to accomplish their functions, some of the HTTP headers (found in HTTP requests/responses) are managed hop-by-hop whereas other HTTP headers are managed end-to-end (managed only by the source client and by the target web server).

---

**도입**

앞에서 봤듯 HTTP 메시지는 클라이언트 → (프록시) → (캐시) → (또 다른 노드) → 서버를 거칩니다. 그런데 모든 헤더가 이 모든 노드에게 다 의미 있는 게 아닙니다. 어떤 헤더는 "지금 직접 연결된 다음 노드까지만" 유효하고, 어떤 헤더는 "출발지부터 도착지까지 끝-끝" 의미를 가집니다. 이 구분이 hop-by-hop과 end-to-end입니다.

---

**본문**

> To allow intermediate HTTP nodes (proxy servers, web caches, etc.) to accomplish their functions,

중간 HTTP 노드들(프록시 서버, 웹 캐시 등)이 자신의 기능을 수행할 수 있도록.

- **intermediate HTTP nodes**: 클라이언트와 최종 서버 사이의 모든 노드. 프록시, 캐시, 게이트웨이, 로드 밸런서.
- **accomplish their functions**: 각 노드는 고유한 역할이 있습니다 — 캐시는 캐싱, 프록시는 중계. 이 역할을 수행하려면 일부 헤더는 그 노드에서 끝나야 합니다.

> some of the HTTP headers (found in HTTP requests/responses) are managed hop-by-hop

일부 HTTP 헤더는 hop-by-hop으로 관리된다.

- **hop**: 한 노드에서 다음 노드로 한 번 점프하는 것. 클라이언트 → 프록시가 1 hop, 프록시 → 서버가 또 1 hop.
- **hop-by-hop**: 각 hop마다 처리되고, 다음 hop으로는 전달되지 않는 헤더. 예: `Connection`, `Keep-Alive`, `Transfer-Encoding`, `Upgrade`. 프록시는 이 헤더를 보고 자기 동작을 결정한 뒤, 다음 노드로는 자신의 새 `Connection` 헤더를 붙여 보냅니다.

> whereas other HTTP headers are managed end-to-end (managed only by the source client and by the target web server).

반면 다른 HTTP 헤더는 end-to-end로 관리되는데, 이는 출발지 클라이언트와 목적지 웹 서버에 의해서만 관리된다.

- **end-to-end**: 출발지(end)부터 도착지(end)까지. 중간 노드는 건드리지 않고 그대로 전달해야 합니다.
- **source client and target web server**: 양쪽 끝점만 관리 권한이 있습니다. 예: `Content-Type`, `Authorization`, `User-Agent`, `Accept`. 중간 프록시가 `Authorization` 헤더를 마음대로 바꾸면 보안이 무너집니다.
- **managed only by**: 중간에서 변경 금지. 다만 읽는 것은 가능합니다 (HTTP면) — 그래서 HTTPS가 필요한 것.

---

**종합**

hop-by-hop과 end-to-end의 비교:

| 분류 | 의미 | 대표 헤더 | 중간 노드의 권한 |
|---|---|---|---|
| hop-by-hop | 한 hop에서 끝 | `Connection`, `Keep-Alive`, `Transfer-Encoding`, `TE`, `Trailer`, `Proxy-Authorization` | 읽고, 처리하고, 변경하고, 다음 hop에 전달 안 함 |
| end-to-end | 출발지~도착지 | `Content-Type`, `Authorization`, `Accept`, `User-Agent`, `Cache-Control`(대부분) | 그대로 전달해야 함 (읽는 건 가능) |

JS 개발자에게 와닿는 예시:

```http
GET /api/users HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGc...    ← end-to-end (서버까지 그대로)
Connection: keep-alive               ← hop-by-hop (다음 프록시에서 소비)
Accept: application/json             ← end-to-end
```

`fetch()`로 요청을 보낼 때 `Authorization` 헤더가 회사 프록시를 거쳐서도 그대로 서버에 도달하는 이유는 end-to-end로 분류되어 있기 때문입니다. 만약 프록시가 마음대로 토큰을 바꾼다면 인증이 깨지겠죠.

이게 없으면 어떻게 되는가: 두 분류가 없다면 — 프록시가 `Connection: keep-alive`(클라이언트-프록시 간 연결 유지)를 다음 hop(프록시-서버)에까지 그대로 전달해버리면 의미가 꼬입니다. 클라이언트는 프록시와 keep-alive를 원했는데 서버까지 keep-alive가 전파되어 자원이 잘못 점유될 수 있습니다. hop-by-hop 분류는 "이 헤더는 너만 읽고 끝내라"라는 명시적 신호입니다.

오개념 예방: HTTPS에서는 중간 노드가 페이로드를 읽을 수 없습니다. 하지만 hop-by-hop/end-to-end 구분은 여전히 의미 있습니다 — TLS 종단(SSL termination) 지점에서 평문이 되어 노드가 헤더를 처리할 때, 이 분류가 적용됩니다. 사내 프록시·역방향 프록시(nginx, AWS ALB)에서 자주 마주칩니다.

AI Annotation 보충: `Connection`, `Keep-Alive`는 "나와 너 사이의 TCP 연결을 어떻게 다룰까"에 대한 신호이므로 다음 노드로 넘기면 안 됩니다. 반면 `Content-Type`, `Authorization`은 "내 요청이 무엇이며 누구의 권한인가"라는 의미이므로 끝까지 가야 합니다.
