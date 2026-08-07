# HTTP 메시지의 기본 구조는 어떻게 구성되는가?

## 도입

HTTP 요청이든 응답이든 메시지 구조는 동일하다. 헤더와 바디, 두 부분으로 나뉜다. DevTools의 Headers/Payload 탭에서 보는 것이 바로 이 구조다.

---

## 본문

> At the highest level, a message consists of a header followed by a body.

"가장 높은 수준에서 메시지는 헤더 다음에 바디로 구성된다."

> A header consists of lines of ASCII text; each terminated with a carriage return and line feed sequence.

"헤더는 ASCII 텍스트 줄들로 구성되며, 각 줄은 캐리지 리턴과 줄 바꿈 시퀀스로 끝난다."

- **ASCII text**: HTTP/1.1 헤더는 사람이 읽을 수 있는 텍스트다. `curl -v`로 HTTP 요청을 보면 헤더가 그대로 텍스트로 보인다.
- **carriage return and line feed**: `\r\n` (CRLF). Windows 줄 끝과 동일하다.

> A body consists of data in any format; not limited to ASCII.

"바디는 어떤 형식의 데이터로도 구성되며, ASCII에 한정되지 않는다."

- **not limited to ASCII**: JSON, HTML, 이미지 이진 데이터, 동영상 등 어떤 형식이든 담을 수 있다.

> The format must match that specified by the Content-Type header field if the message contains one.

"메시지가 Content-Type 헤더 필드를 포함하면, 형식은 그것이 명시한 것과 일치해야 한다."

- `Content-Type: application/json`이면 바디는 유효한 JSON이어야 하고, `Content-Type: image/png`이면 PNG 이진 데이터여야 한다.

> A body is optional or, in other words, can be blank.

"바디는 선택적이다 — 즉 비어있을 수 있다."

GET 요청은 바디가 없고, 204 No Content 응답도 바디가 없다.

```
HTTP 메시지 구조

[헤더]
시작 줄 (요청 라인 또는 상태 라인)
헤더 필드 1: 값
헤더 필드 2: 값
...
빈 줄 (\r\n — 헤더 끝 표시)

[바디]
(어떤 형식이든, 선택적)
```

DevTools에서 요청을 클릭하면 "Headers" 탭이 헤더 부분이고, "Payload" 탭이 바디 부분이다.

---

## 종합

헤더와 바디를 구분하는 "빈 줄"이 핵심이다. 파서는 빈 줄을 만나는 순간 "이제 바디다"라고 판단한다. `Content-Type`이 형식을 알려주고, `Content-Length`나 `Transfer-Encoding`이 바디의 크기/끝을 알려준다. 이 구조는 HTTP/1.1의 텍스트 기반 프로토콜에서 그대로 유지되며, HTTP/2+는 이 메시지를 바이너리 프레임으로 변환하지만 논리적 구조는 동일하다.

---
# HTTP/1.1의 텍스트 기반 메시지와 HTTP/2+의 바이너리 프로토콜은 어떻게 다른가?

## 도입

HTTP의 메시지 구조와 의미(메서드, 상태 코드, 헤더의 의미)는 HTTP 버전이 바뀌어도 동일하다. 바뀌는 것은 "어떤 형태로 전송하는가"뿐이다. HTTP/1.1은 텍스트, HTTP/2+는 바이너리다.

---

## 본문

> Later versions, HTTP/2 and HTTP/3, use a binary protocol, where headers are encoded in a single HEADERS and zero or more CONTINUATION frames using HPACK (HTTP/2) or QPACK (HTTP/3), which both provide efficient header compression.

"이후 버전인 HTTP/2와 HTTP/3는 바이너리 프로토콜을 사용하며, 헤더는 HPACK(HTTP/2) 또는 QPACK(HTTP/3)을 사용하는 단일 HEADERS 및 0개 이상의 CONTINUATION 프레임에 인코딩된다."

- **binary protocol**: 사람이 읽을 수 없는 이진 포맷. 파싱이 빠르고 압축 효율이 높다.
- **HPACK/QPACK**: 헤더 압축 알고리즘. 자주 반복되는 헤더(예: `Content-Type: application/json`)는 처음 한 번만 보내고 이후엔 인덱스 번호만 전송한다.
- **frames**: HTTP/2의 전송 단위. 메시지를 여러 프레임으로 쪼개서 멀티플렉싱한다.

> The request or response line from HTTP/1 has also been replaced by several pseudo-header fields, each beginning with a colon (:).

"HTTP/1의 요청 또는 응답 라인은 각각 콜론(:)으로 시작하는 여러 pseudo-header 필드로 대체됐다."

```
HTTP/1.1:
GET /api/users HTTP/1.1
Host: example.com

HTTP/2 pseudo-headers:
:method: GET
:path: /api/users
:scheme: https
:authority: example.com
```

> HTTP is generally designed to be human-readable, even with the added complexity introduced in HTTP/2. Even if only part of the original HTTP message is sent in this version of HTTP, the semantics of each message is unchanged and the client reconstitutes (virtually) the original HTTP/1.1 request.

"HTTP는 HTTP/2로 도입된 복잡성이 추가됐음에도 불구하고 일반적으로 사람이 읽을 수 있도록 설계됐다. 이 HTTP 버전에서는 원본 HTTP 메시지의 일부만 전송되더라도, 각 메시지의 의미는 변경되지 않으며 클라이언트는 (가상으로) 원본 HTTP/1.1 요청을 재구성한다."

- **semantics of each message is unchanged**: GET은 여전히 GET이고, `Content-Type`은 여전히 같은 의미다. 전송 방식만 바뀐 것이다.

---

## 종합

DevTools가 HTTP/2 요청도 HTTP/1.1 형식으로 보여주는 이유가 바로 "의미는 동일하기 때문"이다. `fetch()`로 코드를 작성할 때 HTTP/1.1인지 HTTP/2인지 신경 쓸 필요 없다 — 브라우저가 내부적으로 최적의 방식으로 전송한다. HTTP/2로 바꾸었을 때 개발자가 코드를 변경할 필요가 없었던 이유가 이것이다.

---
# HTTP 헤더 필드란 무엇이며, 어떤 형식으로 작성되는가?

## 도입

HTTP 메시지의 헤더는 요청과 응답에 대한 부가 정보(메타데이터)를 담는다. 어떤 언어를 원하는지, 어떤 형식의 데이터인지, 캐싱 정책은 어떤지 등이 헤더를 통해 전달된다.

---

## 본문

> A header field represents metadata about the containing message.

"헤더 필드는 포함하는 메시지에 대한 메타데이터를 나타낸다."

- **metadata**: 데이터 자체가 아니라 데이터에 대한 설명. 본문(body)이 실제 데이터라면, 헤더는 그 데이터를 어떻게 해석해야 하는지, 어디서 왔는지 등을 설명한다.

> A header field line is formatted as a name-value pair with a colon separator.

"헤더 필드 줄은 콜론 구분자를 가진 이름-값 쌍으로 형식화된다."

```
Content-Type: application/json
Authorization: Bearer eyJhbGci...
Cache-Control: no-cache
```

- **colon separator**: 이름과 값을 `:` 로 구분한다.

> Whitespace is not allowed around the name, but leading and trailing whitespace is ignored for the value part.

"이름 주변에는 공백이 허용되지 않지만, 값 부분의 앞뒤 공백은 무시된다."

```
Content-Type : application/json  ← 잘못됨 (이름 뒤 공백)
Content-Type:  application/json  ← 유효 (값 앞 공백은 무시)
Content-Type: application/json   ← 정상
```

> Unlike a method name that must match exactly (case-sensitive), a header field name is matched ignoring case although often shown with each word capitalized.

"정확히 일치해야 하는(대소문자 구분) 메서드 이름과 달리, 헤더 필드 이름은 보통 각 단어의 첫 글자를 대문자로 표시하지만 대소문자를 구분하지 않고 매칭된다."

- **case-sensitive method**: `GET`은 맞고 `get`은 틀리다.
- **ignoring case for headers**: `Content-Type`, `content-type`, `CONTENT-TYPE` 모두 동일하게 처리된다. `fetch()`에서 헤더를 소문자로 쓰든 대문자로 쓰든 관계없는 이유다.

---

## 종합

헤더는 HTTP 확장의 핵심이다. 새 기능이 필요하면 새 헤더를 정의하면 된다. `Authorization`, `Cache-Control`, `CORS` 관련 헤더들이 모두 이렇게 추가됐다. `fetch()` API에서 `headers: { 'Content-Type': 'application/json' }`처럼 직접 헤더를 설정하거나, 서버 응답에서 `response.headers.get('Content-Type')`으로 읽는 것이 일상적인 헤더 사용이다.

---
# HTTP 요청 메시지의 시작 줄은 어떻게 구성되며, 필수 헤더는 무엇인가?

## 도입

HTTP 요청 메시지의 첫 줄이 "무엇을 원하는가"를 담는 요청 라인이다. 메서드, 경로, 버전 세 요소로 이루어지며, HTTP/1.1에서는 `Host` 헤더 하나만 필수다.

---

## 본문

> A request is sent by a client to a server. The start line includes a method name, a request URI and the protocol version with a single space between each field.

"요청은 클라이언트가 서버에 보낸다. 시작 줄은 메서드 이름, 요청 URI, 프로토콜 버전을 각 필드 사이에 단일 공백으로 포함한다."

```
GET /api/users HTTP/1.1
│   │           └── 프로토콜 버전
│   └── 요청 URI (경로)
└── 메서드
```

> In the HTTP/1.1 protocol, all header fields except Host are optional.

"HTTP/1.1 프로토콜에서 Host를 제외한 모든 헤더 필드는 선택적이다."

- **Host만 필수**: 하나의 서버(IP)에 여러 도메인이 호스팅될 수 있으므로, 어느 도메인에 대한 요청인지 반드시 명시해야 한다. `Host: example.com`.

> Requests consist of the following elements: An HTTP method... The path of the resource to fetch... The version of the HTTP protocol. Optional headers that convey additional information for the servers. A body, for some methods like POST.

요청의 구성 요소:
- **HTTP method**: GET, POST, PUT 등
- **path**: 전체 URL에서 도메인과 포트를 제거한 경로 부분. `https://example.com:443/api/users?page=1`에서 `/api/users?page=1`이 경로다.
- **버전**: `HTTP/1.1`, `HTTP/2`
- **선택적 헤더들**: Content-Type, Authorization, Accept 등
- **바디**: GET에는 없고, POST/PUT에는 있다.

```
HTTP 요청 메시지 구조:

GET / HTTP/1.1
Host: developer.mozilla.org
Accept-Language: ko
User-Agent: Mozilla/5.0
                                    ← 빈 줄 (헤더 끝)
                                    ← 바디 (GET이면 없음)
```

---

## 종합

DevTools의 Headers 탭을 펼치면 "Request Headers" 섹션에서 이 구조를 그대로 볼 수 있다. `curl -v https://example.com`을 실행하면 실제 HTTP 메시지 텍스트가 `>` 화살표 앞에 그대로 출력된다. HTTP/2를 써도 의미 구조는 동일하고, `fetch()`를 쓸 때 `method`, `headers`, `body` 옵션이 이 요청 메시지의 각 부분에 대응된다.

---
# 다음 HTTP 요청 예시에서 각 헤더의 역할을 설명하라

## 도입

실제 HTTP 요청을 보면 여러 헤더가 함께 온다. 각 헤더가 어떤 역할을 하는지 분석하면 HTTP 메시지 구조가 명확해진다. OA에서 다루는 예시 요청을 헤더별로 분석한다.

---

## 본문

```
GET / HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
```

> The Host header field distinguishes between various DNS names sharing a single IP address, allowing name-based virtual hosting. While optional in HTTP/1.0, it is mandatory in HTTP/1.1.

"Host 헤더 필드는 단일 IP 주소를 공유하는 다양한 DNS 이름을 구별하여 이름 기반 가상 호스팅을 가능하게 한다. HTTP/1.0에서는 선택적이었지만 HTTP/1.1에서는 필수다."

- **name-based virtual hosting**: 같은 서버(같은 IP)에서 `example.com`과 `another.com`을 동시에 서비스하는 것. Host 헤더 없이는 서버가 어느 도메인에 대한 요청인지 알 수 없다.

**나머지 헤더들:**

- `User-Agent: Mozilla/5.0` — 요청을 보내는 클라이언트 소프트웨어 정보. 서버가 이 값으로 브라우저 버전을 판단하거나 봇을 필터링한다.
- `Accept: text/html,...` — 클라이언트가 받을 수 있는 응답 형식과 우선순위(`q` 값). `*/*;q=0.8`은 그 외 모든 형식도 받지만 우선순위가 낮다.
- `Accept-Language: en-GB,en;q=0.5` — 선호하는 언어. 다국어 서비스에서 서버가 참고한다.
- `Accept-Encoding: gzip, deflate, br` — 클라이언트가 지원하는 압축 방식. 서버가 gzip으로 응답을 압축하면 전송량이 줄어든다.
- `Connection: keep-alive` — 이 연결을 유지해달라. HTTP/1.1에서는 기본값이므로 생략해도 된다.

---

## 종합

`fetch('/api/data')`처럼 간단한 호출에도 브라우저는 자동으로 `Host`, `User-Agent`, `Accept`, `Accept-Encoding` 등의 헤더를 붙인다. DevTools의 요청 헤더에서 이를 직접 확인할 수 있다. 명시적으로 설정하지 않은 헤더는 브라우저가 자동으로 관리한다 — 이것이 "HTTP가 확장 가능하다"는 설계가 실용적으로 드러나는 방식이다.

---
# 다음 HTTP 응답 예시에서 각 헤더의 역할을 설명하라

## 도입

응답 메시지도 요청과 구조가 같다 — 시작 줄(상태 라인) + 헤더 + 바디. OA가 실제 응답 예시를 분석하며 각 헤더의 역할을 설명한다.

---

## 본문

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

> The ETag (entity tag) header field is used to determine if a cached version of the requested resource is identical to the current version of the resource on the server.

"ETag(엔티티 태그) 헤더 필드는 요청된 리소스의 캐시된 버전이 서버의 현재 버전과 동일한지 결정하는 데 사용된다."

- **ETag**: 리소스 버전의 지문. 다음에 같은 리소스를 요청할 때 `If-None-Match: "3f80f-1b6-3e1cb03b"`로 보내면 서버가 `304 Not Modified`로 응답할 수 있다.

> The Content-Type header field specifies the Internet media type of the data conveyed by the HTTP message, and Content-Length indicates its length in bytes.

"Content-Type 헤더 필드는 HTTP 메시지가 전달하는 데이터의 인터넷 미디어 타입을 명시하고, Content-Length는 바이트 단위 길이를 나타낸다."

- `Content-Type: text/html; charset=UTF-8` — 브라우저가 바디를 UTF-8 HTML로 파싱한다.
- `Content-Length: 155` — 바디가 155바이트임을 알린다. 클라이언트가 언제 전송이 끝났는지 알 수 있다.

> The HTTP/1.1 webserver publishes its ability to respond to requests for a byte range of the resource by including Accept-Ranges: bytes.

"HTTP/1.1 웹서버는 `Accept-Ranges: bytes`를 포함하여 리소스의 바이트 범위 요청에 응답할 수 있다고 알린다."

- `Accept-Ranges: bytes` — "나는 `Range` 헤더를 지원한다"는 광고. 클라이언트가 이 헤더를 보면 대용량 파일을 분할 다운로드할 수 있다는 것을 안다.

> When Connection: close is sent, it means that the web server will close the TCP connection immediately after the end of the transfer of this response.

"Connection: close가 전송되면, 이 응답 전송이 끝난 후 웹서버가 즉시 TCP 연결을 닫는다는 의미다."

- HTTP/1.1의 기본은 연결 유지인데, `Connection: close`로 이번 응답 후 연결을 닫겠다고 명시하는 것이다.

**응답 구조 요약:**

```
HTTP/1.1 200 OK                        ← 상태 라인: 버전 | 코드 | 메시지
Date: ...                              ← 헤더들
Content-Type: text/html; charset=UTF-8
Content-Length: 155
ETag: "3f80f-1b6-3e1cb03b"
                                       ← 빈 줄
<!DOCTYPE html>...                     ← 바디 (155바이트)
```

---

## 종합

`fetch(url)`의 `response` 객체에서 `response.headers.get('Content-Type')`으로 헤더를 읽고, `response.status`로 상태 코드를 읽고, `response.json()`으로 바디를 파싱하는 것이 이 응답 메시지 구조에 대한 프로그래매틱 접근이다. 서버 헤더 설정 하나가 브라우저 캐싱(ETag, Cache-Control), 압축(Content-Encoding), 연결 관리(Connection) 등 여러 동작에 영향을 준다.

---
# 하나의 웹페이지를 표시하기 위해 브라우저는 HTTP 요청을 어떤 순서로 보내는가?

## 도입

사용자가 URL을 입력하고 엔터를 치면 단 하나의 HTTP 요청이 아닌 수십, 수백 개의 요청이 발생한다. 이 요청들이 어떤 순서로 발생하는지 이해하면 웹 성능 최적화의 맥락이 잡힌다.

---

## 본문

> To display a Web page, the browser sends an original request to fetch the HTML document that represents the page.

"웹 페이지를 표시하기 위해 브라우저는 페이지를 나타내는 HTML 문서를 가져오기 위한 첫 번째 요청을 보낸다."

HTML이 시작점이다. `example.com` 주소창에 치면 `GET / HTTP/1.1`이 처음 나간다.

> It then parses this file, making additional requests corresponding to execution scripts, layout information (CSS) to display, and sub-resources contained within the page (usually images and videos).

"그런 다음 이 파일을 파싱하며, 실행 스크립트, 표시할 레이아웃 정보(CSS), 그리고 페이지에 포함된 서브 리소스(보통 이미지와 비디오)에 해당하는 추가 요청을 만든다."

- **parses this file**: HTML을 파싱하면서 `<link rel="stylesheet">`, `<script src>`, `<img src>` 등을 만날 때마다 해당 리소스 요청을 추가로 보낸다.

> The Web browser then combines these resources to present the complete document, the Web page.

"웹 브라우저는 그런 다음 이 리소스들을 조합하여 완전한 문서, 즉 웹 페이지를 표시한다."

> Scripts executed by the browser can fetch more resources in later phases and the browser updates the Web page accordingly.

"브라우저가 실행하는 스크립트는 나중 단계에서 더 많은 리소스를 가져올 수 있으며 브라우저는 그에 따라 웹 페이지를 업데이트한다."

JS가 실행되면서 `fetch()`나 `XMLHttpRequest`로 추가 데이터를 받아오는 것이 이 단계다.

```
브라우저 요청 흐름:
1. GET /index.html → HTML 수신
2. HTML 파싱 시작
   ├── <link href="style.css"> 발견 → GET /style.css
   ├── <script src="app.js"> 발견 → GET /app.js
   └── <img src="hero.jpg"> 발견 → GET /hero.jpg
3. HTML 렌더링
4. app.js 실행
   └── fetch('/api/data') → GET /api/data (동적 데이터)
5. 데이터로 UI 업데이트
```

---

## 종합

웹페이지 하나 = 수십~수백 개의 HTTP 요청이다. 이것이 HTTP/2 멀티플렉싱과 HTTP/3가 중요한 이유다 — HTTP/1.1에서는 이 많은 요청을 도메인당 최대 6개 연결로만 처리했다. DevTools Network 탭에서 "Waterfall" 컬럼이 이 요청들의 타임라인을 보여준다. 첫 HTML 요청이 들어오고, 이후 CSS/JS가 병렬로 내려받아지고, 마지막으로 JS가 실행되며 API 요청이 추가로 발생하는 패턴을 직접 확인할 수 있다.

---
# HTTP/1.1에서 Host 헤더가 필수가 된 이유와, 이것이 가상 호스팅(virtual hosting)을 가능하게 하는 원리는?

## 도입

하나의 서버(IP)에서 여러 도메인을 서비스하는 것을 가상 호스팅이라 한다. HTTP/1.0에서는 IP 하나에 도메인 하나만 가능했지만, HTTP/1.1의 `Host` 헤더 덕분에 IP 하나에 수천 개의 도메인을 올릴 수 있게 됐다.

---

## 본문

> A server is not necessarily a single machine, but several server software instances can be hosted on the same machine.

"서버는 반드시 단일 머신일 필요가 없으며, 같은 머신에서 여러 서버 소프트웨어 인스턴스를 호스팅할 수 있다."

- 물리 서버 하나에 여러 웹사이트를 올리는 것이 호스팅 업체의 기본 모델이다.

> With HTTP/1.1 and the Host header, they may even share the same IP address.

"HTTP/1.1과 Host 헤더를 사용하면, 그것들은 같은 IP 주소를 공유할 수 있다."

**HTTP/1.0 한계:**

```
IP: 1.2.3.4

GET / HTTP/1.0
(Host 없음)

서버: "이 IP로 요청이 왔는데 어느 도메인에 대한 거지?"
→ 알 수 없음 → IP 하나에 도메인 하나만 가능
```

**HTTP/1.1 Host 헤더:**

```
IP: 1.2.3.4 (same)

GET / HTTP/1.1
Host: example.com

→ 서버: "example.com에 대한 요청이구나"

GET / HTTP/1.1
Host: another.com

→ 서버: "another.com에 대한 요청이구나"

같은 IP인데 다른 도메인 서비스 가능
```

AWS에서 EC2 하나에 nginx를 띄우고 여러 도메인을 서비스할 때, nginx가 `Host` 헤더를 보고 어느 가상 호스트 설정을 적용할지 결정한다.

---

## 종합

Host 헤더는 단순해 보이지만 현대 웹 인프라의 근간이다. 공유 호스팅(한 서버에 수백 사이트), CDN(같은 엣지 서버에서 수천 도메인 서비스), 마이크로서비스 API 게이트웨이 모두 Host 헤더를 기반으로 라우팅한다. HTTPS에서는 TLS 핸드셰이크가 HTTP보다 먼저 일어나 Host 헤더를 볼 수 없어, SNI(Server Name Indication)가 TLS 레벨에서 같은 역할을 수행한다.
