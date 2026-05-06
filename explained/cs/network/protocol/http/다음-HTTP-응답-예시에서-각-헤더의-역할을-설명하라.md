# 다음 HTTP 응답 예시에서 각 헤더의 역할을 설명하라

> The ETag (entity tag) header field is used to determine if a cached version of the requested resource is identical to the current version of the resource on the server.
> The Content-Type header field specifies the Internet media type of the data conveyed by the HTTP message, and Content-Length indicates its length in bytes.
> The HTTP/1.1 webserver publishes its ability to respond to requests for a byte range of the resource by including Accept-Ranges: bytes.
> When Connection: close is sent, it means that the web server will close the TCP connection immediately after the end of the transfer of this response.
> When header Content-Length is missing from a response with a body, then this should be considered an error in HTTP/1.0 but it may not be an error in HTTP/1.1 if header Transfer-Encoding: chunked is present.
> Content-Encoding: gzip informs the client that the body is compressed per the gzip algorithm.

---

**도입**

브라우저가 받은 응답은 보통 이런 모양입니다:

```
HTTP/1.1 200 OK
Date: Mon, 23 May 2005 22:38:34 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 155
Last-Modified: Wed, 08 Jan 2003 23:11:55 GMT
Server: Apache/1.3.3.7 (Unix) (Red-Hat/Linux)
ETag: "3f80f-1b6-3e1cb03b"
Accept-Ranges: bytes
Connection: close
```

각 헤더가 클라이언트에게 어떤 메타정보를 알려주는지 정리합니다. Official Answer는 ETag, Content-Type, Content-Length, Accept-Ranges, Connection, Content-Encoding을 다룹니다.

---

**본문**

> The ETag (entity tag) header field is used to determine if a cached version of the requested resource is identical to the current version of the resource on the server.

`ETag`(entity tag) 헤더 필드는 캐시된 리소스 버전이 서버 상의 현재 버전과 동일한지 판별하는 데 사용된다.

- **ETag**: 리소스의 "지문". 콘텐츠의 해시나 버전 식별자.
- **cached version**: 클라이언트가 가진 캐시본.
- **identical to the current version**: 서버 현재 버전과 동일. 동일하면 재다운로드 불필요.

> The Content-Type header field specifies the Internet media type of the data conveyed by the HTTP message,

`Content-Type` 헤더 필드는 HTTP 메시지가 전달하는 데이터의 인터넷 미디어 타입을 명시한다.

- **Internet media type**: MIME 타입. `text/html`, `application/json`, `image/png` 등.
- **conveyed by the HTTP message**: 메시지가 운반하는. 본문의 형식 알림.

> and Content-Length indicates its length in bytes.

`Content-Length`는 길이를 바이트로 표시한다.

- **length in bytes**: 바이트 단위 길이. 클라이언트가 어디까지 읽으면 끝인지 판단하는 단서.

> The HTTP/1.1 webserver publishes its ability to respond to requests for a byte range of the resource by including Accept-Ranges: bytes.

HTTP/1.1 웹서버는 `Accept-Ranges: bytes`를 포함해 리소스의 바이트 범위 요청에 응답할 수 있는 능력을 알린다.

- **Accept-Ranges: bytes**: "나는 바이트 범위 요청을 받아들일 수 있다"는 광고. 클라이언트가 이걸 보고 `Range` 헤더로 일부만 요청 가능.
- **byte range**: 바이트 범위. 1MB 파일에서 500KB~700KB 구간만 같은 식.

> When Connection: close is sent, it means that the web server will close the TCP connection immediately after the end of the transfer of this response.

`Connection: close`가 전송되면, 웹서버가 이 응답 전송 종료 직후 TCP 연결을 닫는다는 의미다.

- **Connection: close**: 연결 닫기 신호. keep-alive와 반대.
- **immediately after the end of the transfer**: 전송 종료 직후. 다음 요청에 이 연결 못 씀.

> When header Content-Length is missing from a response with a body, then this should be considered an error in HTTP/1.0 but it may not be an error in HTTP/1.1 if header Transfer-Encoding: chunked is present.

본문이 있는 응답에서 `Content-Length` 헤더가 없으면 HTTP/1.0에서는 오류로 간주해야 하지만, HTTP/1.1에서는 `Transfer-Encoding: chunked` 헤더가 있으면 오류가 아닐 수 있다.

- **Content-Length missing**: 길이 헤더 없음. HTTP/1.0에선 명백한 오류.
- **Transfer-Encoding: chunked**: 청크 단위 전송. 길이 미상이어도 가능 — 각 청크가 자기 크기 명시.

> Content-Encoding: gzip informs the client that the body is compressed per the gzip algorithm.

`Content-Encoding: gzip`은 본문이 gzip 알고리즘으로 압축되었음을 클라이언트에게 알린다.

- **Content-Encoding**: 본문 인코딩(주로 압축). 클라이언트가 풀어서 사용해야 함.
- **gzip algorithm**: gzip 압축. 텍스트 응답에서 50~80% 절감.

---

**종합**

응답 예시의 모든 헤더 역할:

| 헤더 | 역할 | 설명 |
|---|---|---|
| `HTTP/1.1 200 OK` | 시작 줄 | 버전 + 상태 코드 + 사유 구문 |
| `Date: Mon, 23 May 2005 22:38:34 GMT` | 응답 시각 | 서버가 응답 생성한 시간 |
| `Content-Type: text/html; charset=UTF-8` | 본문 형식 | MIME 타입 + 인코딩 |
| `Content-Length: 155` | 본문 길이 | 바이트 단위 |
| `Last-Modified: Wed, 08 Jan 2003 23:11:55 GMT` | 마지막 수정 시각 | 조건부 GET용 |
| `Server: Apache/1.3.3.7 (Unix) (Red-Hat/Linux)` | 서버 식별 | 서버 소프트웨어 정보 (보안상 가리는 경우 많음) |
| `ETag: "3f80f-1b6-3e1cb03b"` | 리소스 지문 | 캐시 유효성 검증 |
| `Accept-Ranges: bytes` | 범위 요청 지원 | 클라이언트가 일부만 요청 가능 알림 |
| `Connection: close` | 연결 종료 신호 | 응답 후 TCP 연결 닫음 |

**ETag 활용 — 조건부 GET의 흐름**:

```
첫 요청:
  GET /article HTTP/1.1
  Host: example.com

응답:
  HTTP/1.1 200 OK
  ETag: "abc123"
  ...본문...

두 번째 요청 (이미 캐시된 상태):
  GET /article HTTP/1.1
  Host: example.com
  If-None-Match: "abc123"      ← 내가 가진 ETag

서버: 현재 ETag와 비교 → 동일
응답:
  HTTP/1.1 304 Not Modified    ← 본문 없음, 캐시 그대로 써
```

이 흐름으로 트래픽이 절감됩니다 — 변경 안 된 리소스는 본문 다운로드 안 함.

**JS 코드에서 응답 헤더 활용**:

```js
const res = await fetch('/api/users');

res.status;                              // 200 — 시작 줄의 상태 코드
res.headers.get('content-type');         // 'application/json'
res.headers.get('content-length');       // '155'
res.headers.get('etag');                 // '"abc123"' — 다음 요청에 If-None-Match로 활용
res.headers.get('cache-control');        // 'public, max-age=3600' (예시에는 없지만 흔함)

// gzip 응답은 브라우저가 자동 해제 — 코드에선 평문으로 보임
const text = await res.text();           // gzip 압축된 응답이라도 자동 디코딩
```

**Connection: close vs keep-alive**:

| Connection 값 | 의미 | HTTP 버전 기본 |
|---|---|---|
| `keep-alive` | 응답 후 연결 유지, 재사용 | HTTP/1.1 기본 |
| `close` | 응답 후 연결 닫기 | HTTP/1.0 기본 |

예시의 `Connection: close`는 HTTP/1.1이지만 명시적으로 keep-alive를 거부 — 서버가 부하를 분산하기 위해 의도적으로 연결을 끊는 경우 사용.

**Content-Length vs Transfer-Encoding: chunked**:

```
Content-Length 사용 (정적 콘텐츠):
  Content-Type: text/html
  Content-Length: 155
  ...155 바이트 본문...

Transfer-Encoding: chunked 사용 (동적/스트리밍):
  Content-Type: application/json
  Transfer-Encoding: chunked
  
  10                    ← 청크 1 크기 (16진수 = 16바이트)
  ...16바이트 데이터...
  20                    ← 청크 2 크기 (16진수 = 32바이트)
  ...32바이트 데이터...
  0                     ← 종료 청크
                        ← 끝
```

둘은 함께 쓰지 않습니다 — chunked일 때는 Content-Length 빠짐.

이게 없으면 어떻게 되는가:

- `ETag`/`Last-Modified`가 없다면 — 캐시 유효성을 알 수 없어 매번 전체 콘텐츠 다운로드. 트래픽 폭증.
- `Content-Length`가 없고 chunked도 없다면 — 클라이언트는 어디가 본문 끝인지 모름. HTTP/1.0의 "연결 종료 = 끝" 가정의 한계로 부분 콘텐츠 감지 불가.
- `Content-Encoding`이 없다면 — gzip 압축 사용 불가. 텍스트 응답이 50~80% 더 큼.

오개념 예방: `Server` 헤더는 보안 관점에서 가리는 게 권장됩니다. 예시의 `Apache/1.3.3.7` 같은 정보는 공격자에게 알려진 취약점 활용의 단서가 됩니다. 운영 서버는 보통 `Server: nginx`처럼 버전을 빼거나 아예 헤더를 제거합니다.

Official Annotation 보충: 응답은 다음 요소들로 구성됩니다 — HTTP 프로토콜 버전, 상태 코드(성공 여부와 이유), 상태 메시지(코드의 짧은 설명, 비공식적), 요청과 같은 HTTP 헤더들, 가져온 리소스를 담은 선택적 본문.

AI Annotation 보충: 응답 메시지 시각적 구조 — Status Line(Version | Code | Message), Headers, 빈 줄, Body(리소스, 선택적). 상태 메시지(`OK`, `Not Found` 등)는 "non-authoritative" — 표준이 아니라 서버가 자유롭게 바꿀 수 있어, 클라이언트는 코드(숫자)만 신뢰해야 합니다.
