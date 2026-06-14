# Navigation이란 무엇이며 언제 발생하는가?

## 도입

브라우저가 새 페이지를 불러오는 일련의 과정 전체를 "navigation"이라고 부른다. URL 입력, 링크 클릭, 폼 제출 등 다양한 행위가 모두 navigation을 트리거한다. Web Performance 관점에서 navigation에 걸리는 시간을 최소화하는 것이 핵심 목표다.

---

## 본문

> Navigation is the first step in loading a web page. It occurs whenever a user requests a page by entering a URL into the address bar, clicking a link, submitting a form, as well as other actions.

"Navigation은 웹 페이지를 로드하는 첫 번째 단계다. 사용자가 주소창에 URL을 입력하거나, 링크를 클릭하거나, 폼을 제출하거나, 그 외의 동작을 수행할 때마다 발생한다."

- **first step**: Navigation이 끝나야 HTML을 받고, HTML을 받아야 파싱·렌더링이 시작된다. 렌더링 파이프라인의 시작점이다.
- **as well as other actions**: 뒤로 가기, 새로고침, JavaScript의 `history.pushState()` 등도 포함된다.

> One of the goals of web performance is to minimize the amount of time navigation takes to complete. In ideal conditions, this usually doesn't take too long, but latency and bandwidth are foes that can cause delays.

"웹 성능의 목표 중 하나는 navigation이 완료되는 데 걸리는 시간을 최소화하는 것이다. 이상적인 조건에서는 보통 오래 걸리지 않지만, latency와 bandwidth가 지연을 일으키는 적이 될 수 있다."

- **latency**: 요청과 응답 사이의 지연 시간. 물리적 거리, 네트워크 홉 수에 영향받는다.
- **bandwidth**: 단위 시간당 전송 가능한 데이터량. 파일 크기가 크거나 대역폭이 좁으면 전송이 느려진다.
- **foes**: "적"이라는 표현. 개발자가 제어하기 어려운 외부 요인이라는 뉘앙스를 담는다.

---

## 종합

Navigation은 사용자가 새 페이지를 요청하는 순간부터 HTML 바이트가 도착하기 직전까지다. DevTools Network 탭에서 첫 번째 요청(HTML 문서)의 Timing 섹션이 바로 navigation의 각 단계를 보여준다. Latency가 높으면 DNS lookup, TCP handshake, TLS negotiation 각각에서 시간이 낭비되고, bandwidth가 낮으면 HTML 자체의 전송이 느려진다. 이 두 요인이 TTFB를 끌어올리는 주범이다.

---

# 주소창에 URL을 입력하면 브라우저가 수행하는 전체 흐름은?

## 도입

브라우저가 URL 한 줄을 받았을 때 실제로 무슨 일이 일어나는지 큰 그림을 보여주는 질문이다. 도메인 이름 해석 → HTTP 요청 → 서버 응답 → 조각 수신 → 화면 조합의 순서다.

---

## 본문

> The browser goes to the DNS server and finds the real address of the server that the website lives on.

"브라우저는 DNS 서버에 접속하여 웹사이트가 있는 서버의 실제 주소를 찾는다."

- **DNS server**: 도메인 이름을 IP 주소로 변환해 주는 서버. `example.com` → `93.184.216.34` 같은 변환을 수행한다.

> The browser sends an HTTP request message to the server, asking it to send the website. The browser and the server exchange data over your internet using TCP/IP.

"브라우저는 서버에 HTTP 요청 메시지를 보내 웹사이트를 전송해달라고 요청한다. 브라우저와 서버는 TCP/IP를 사용해 인터넷을 통해 데이터를 교환한다."

> If the server approves the client's request, it sends a '200 OK' message along with the website's files, split into small chunks called data packets.

"서버가 클라이언트의 요청을 승인하면 '200 OK' 메시지와 함께 웹사이트 파일을 data packets라는 작은 청크로 나누어 전송한다."

- **200 OK**: HTTP 상태 코드. 요청이 성공적으로 처리됐다는 신호다.
- **data packets**: 네트워크 전송을 위해 분할된 작은 데이터 조각. TCP가 이 패킷들을 순서대로 재조립한다.

> The browser assembles the small chunks into a complete web page and displays it to you.

"브라우저는 작은 청크들을 완전한 웹 페이지로 조립하여 화면에 보여준다."

---

## 종합

```
URL 입력
  │
  ▼
DNS lookup → IP 주소 획득
  │
  ▼
TCP 연결 (+ HTTPS이면 TLS 협상)
  │
  ▼
HTTP 요청 전송
  │
  ▼
서버: 200 OK + HTML 패킷 전송
  │
  ▼
브라우저: 패킷 수신 → 조립 → 파싱 → 렌더링
```

이 흐름은 DevTools Network 탭에서 첫 번째 요청의 Timing 섹션(DNS lookup, Initial connection, TTFB, Content Download)으로 각 단계를 직접 측정할 수 있다.

---

# HTTPS 사이트 접속 시 브라우저가 HTML 데이터를 받기 전까지 거치는 네트워크 단계와 왕복 횟수는?

## 도입

DNS로 IP를 알아낸 다음부터 실제 HTTP 요청을 보내기까지, HTTPS 접속에서는 생각보다 많은 왕복(round-trip)이 필요하다. TCP 연결 수립과 TLS 암호화 협상이 순차적으로 일어나기 때문이다.

---

## 본문

> Once the IP address is known, the browser sets up a connection to the server via a TCP three-way handshake. TCP's three-way handshaking technique is often referred to as "SYN-SYN-ACK" — or more accurately SYN, SYN-ACK, ACK — because there are three messages transmitted by TCP to negotiate and start a TCP session between two computers.

"IP 주소를 알게 되면 브라우저는 TCP 3-way handshake를 통해 서버와 연결을 수립한다. TCP의 3-way handshake는 'SYN-SYN-ACK'라고 불리며, 두 컴퓨터 간 TCP 세션을 협상하고 시작하기 위해 3개의 메시지가 전송되는 방식이다."

- **three-way handshake**: SYN(연결 요청) → SYN-ACK(요청 수락 + 응답) → ACK(확인)의 3단계. 양쪽이 서로 보내고 받을 준비가 됐는지 확인하는 과정이다.

> For secure connections established over HTTPS, another "handshake" is required. This handshake, or rather the TLS negotiation, determines which cipher will be used to encrypt the communication, verifies the server, and establishes that a secure connection is in place before beginning the actual transfer of data. This requires five more round trips to the server before the request for content is actually sent. After the eight round trips to the server, the browser is finally able to make the request.

"HTTPS로 수립된 보안 연결에는 추가 핸드셰이크가 필요하다. TLS negotiation은 통신 암호화에 사용할 cipher를 결정하고, 서버를 검증하며, 실제 데이터 전송 전에 보안 연결을 수립한다. 이를 위해 서버와 5번의 추가 왕복이 필요하며, 총 8번의 왕복 후에야 브라우저가 드디어 요청을 보낼 수 있다."

- **cipher**: 암호화 알고리즘. TLS 협상에서 클라이언트와 서버가 둘 다 지원하는 알고리즘을 합의한다.
- **verifies the server**: 서버 인증서(Certificate)가 신뢰할 수 있는 CA(인증 기관)에서 발급됐는지 확인하는 과정이다.
- **five more round trips**: TCP 3-way handshake(3번) + TLS 협상(5번) = 총 8왕복.

```
Client                                     Server
  │                                           │
  │   ①  DNS lookup (별도 DNS 서버)            │
  │                                           │
  │── ② SYN ─────────────────────────────────→│
  │                                           │  TCP
  │←──────────────────────────── ③ SYN-ACK ───│  3-way
  │                                           │  handshake
  │── ④ ACK ─────────────────────────────────→│
  │                                           │
  │── ⑤ ClientHello ─────────────────────────→│
  │                                           │
  │←──────────── ⑥ ServerHello + Certificate ─│  TLS
  │                                           │  negotiation
  │── ⑦ ClientKey ───────────────────────────→│
  │                                           │
  │←──────────────────────────── ⑧ Finished ──│
  │                                           │
  │── ⑨ Finished ────────────────────────────→│
  │                                           │
  │── HTTP Request ──────────────────────────→│  ← 드디어!
  │                                           │
```

---

## 종합

DNS lookup은 웹 서버와의 왕복 횟수에 포함되지 않는다(별도 DNS 서버와 통신). 그 이후 TCP(3회) + TLS(5회) = 8번의 왕복 후에야 첫 HTTP 요청이 출발한다. 단순히 요청 하나를 보내는 것처럼 보이지만, 실제로는 이렇게 많은 사전 작업이 필요하다. HTTP/2나 QUIC(HTTP/3)는 이 handshake 왕복 수를 줄여 초기 연결 지연을 단축하는 방향으로 발전해왔다.

---

# DNS lookup이란 무엇이며 왜 캐싱되는가?

## 도입

브라우저가 `example.com`을 요청하려면 먼저 그 도메인이 어느 서버에 있는지 알아야 한다. 이 "도메인 이름 → IP 주소" 변환 과정이 DNS lookup이다. 한 번 조회한 IP는 이후 요청에서 재사용할 수 있도록 캐시된다.

---

## 본문

> The first step of navigating to a web page is finding where the assets for that page are located. If you navigate to https://example.com, the HTML page is located on the server with IP address of 93.184.216.34. If you've never visited this site, a DNS lookup must happen.

"웹 페이지로 이동하는 첫 번째 단계는 해당 페이지의 자산이 어디에 위치하는지 찾는 것이다. https://example.com으로 이동하면 HTML 페이지는 IP 주소 93.184.216.34의 서버에 있다. 이 사이트를 처음 방문한다면 DNS lookup이 발생해야 한다."

- **DNS lookup**: 도메인 이름을 IP 주소로 변환하는 조회 과정. 브라우저 캐시 → OS 캐시 → DNS 서버 순으로 조회한다.
- **assets**: HTML, CSS, JS, 이미지 등 페이지를 구성하는 모든 리소스.
- **If you've never visited this site**: 캐시가 없으면 DNS 서버까지 왕복해야 하고, 이 지연이 TTFB에 더해진다.

> A DNS lookup returns an IP address, which is cached to speed up future requests.

"DNS lookup은 IP 주소를 반환하며, 이는 이후 요청 속도를 높이기 위해 캐시된다."

- **cached**: 브라우저, OS, 라우터가 각각 DNS 응답을 캐시한다. TTL(Time To Live)이 만료되기 전까지는 DNS 서버에 재질의하지 않는다.

---

## 종합

DNS lookup은 HTTPS 접속 8번의 왕복 전에 별도로 발생하는 추가 지연이다. 처음 방문하는 사이트는 DNS lookup → TCP handshake → TLS negotiation → HTTP 요청의 전체 흐름을 거쳐야 하지만, 이후 방문에서는 DNS 캐시 덕분에 첫 단계를 건너뛴다. `<link rel="dns-prefetch">` 힌트로 리소스 도메인의 DNS를 미리 조회해두는 최적화가 이 원리를 활용한 것이다.

---

# Redirect는 왜 성능에 부정적인가?

## 도입

서버가 요청된 URL 대신 다른 URL을 가리키는 응답을 보낼 때 redirect가 발생한다. 사용자 입장에서는 투명하게 처리되지만, 브라우저 입장에서는 추가 HTTP 요청이 발생한다.

---

## 본문

> When a resource is requested, the server may respond with a redirect, either with a permanent redirect (a 301 Moved Permanently response) or a temporary one (a 302 Found response). Redirects slow down page load speed because it requires the browser to make an additional HTTP request at the new location to retrieve the resource.

"리소스가 요청될 때, 서버는 영구 리다이렉트(301 Moved Permanently)나 임시 리다이렉트(302 Found)로 응답할 수 있다. Redirect는 브라우저가 새 위치에서 리소스를 가져오기 위해 추가적인 HTTP 요청을 해야 하므로 페이지 로드 속도를 저하시킨다."

- **301 Moved Permanently**: 리소스가 영구적으로 새 URL로 이동했다는 신호. 브라우저는 이 결과를 캐시하여 이후 요청에서 중간 단계를 건너뛸 수 있다.
- **302 Found**: 리소스가 임시로 다른 URL에 있다는 신호. 캐시되지 않으므로 매번 redirect 응답을 받아야 한다.
- **additional HTTP request**: 원래 URL → redirect URL로의 추가 왕복. TCP/TLS handshake도 다시 필요할 수 있다.

---

## 종합

`http://example.com` → `https://example.com` → `https://www.example.com` 같은 체인 redirect는 TTFB를 두 배 이상 늘릴 수 있다. DevTools Network 탭에서 "Status: 301/302"로 보이는 요청이 redirect다. 운영 환경에서 `http://` → `https://` redirect는 불가피하지만, 체인이 쌓이지 않도록 하나의 최종 URL로 바로 이동하도록 서버를 설정하는 것이 중요하다.

---

# 페이지가 paint된 직후에도 브라우저가 'all set' 상태가 아닐 수 있는 이유는?

## 도입

화면이 그려졌다고 해서 브라우저가 사용자 입력에 바로 반응할 수 있는 건 아니다. 페인트 이후에도 메인 스레드가 바쁠 수 있기 때문이다. 이것이 FCP/LCP 이후에 TTI(Time to Interactive) 같은 지표가 따로 필요한 이유다.

---

## 본문

> Once the main thread is done painting the page, you would think we would be "all set." That isn't necessarily the case.

"메인 스레드가 페이지 페인팅을 완료하면 '다 됐다'고 생각할 것이다. 반드시 그런 것은 아니다."

- **main thread**: 브라우저가 렌더링·스크립트 실행을 처리하는 단일 스레드. 렌더링, 이벤트 처리, JS 실행이 모두 여기서 일어난다.

> If the load includes JavaScript, that was correctly deferred, and only executed after the onload event fires, the main thread might be busy, and not available for scrolling, touch, and other interactions.

"로드에 올바르게 deferred된 JavaScript가 포함되어 있고 onload 이벤트 발생 후에만 실행된다면, 메인 스레드가 바빠서 스크롤, 터치, 기타 인터랙션을 처리하지 못할 수 있다."

- **deferred**: `defer` 속성으로 HTML 파싱 후에 실행되도록 지연된 스크립트. 파싱을 블로킹하지 않지만, `onload` 이후 메인 스레드를 점유할 수 있다.
- **onload event**: 페이지의 모든 리소스(이미지, 스타일시트 등) 로드가 끝났을 때 발생하는 이벤트.
- **not available for scrolling, touch**: 메인 스레드가 JS 실행에 바쁘면 이벤트 핸들러를 처리할 여유가 없다. DevTools Performance 탭의 "Long Tasks"가 이 상황을 표시한다.

---

## 종합

화면이 그려진 것(FCP/LCP)과 인터랙션이 가능한 것(TTI, Total Blocking Time)은 다른 지표다. `defer`로 JS를 뒤로 미뤄도 그 JS가 `onload` 직후 무거운 작업을 실행하면, 사용자는 화면을 보면서도 클릭/스크롤이 먹히지 않는 경험을 하게 된다. 이것이 긴 JS 번들을 코드 스플리팅으로 쪼개는 이유다 — paint 이후 메인 스레드를 가능한 한 빨리 비워서 인터랙션이 가능한 상태로 만들기 위해서다.

---

# [UNVERIFIED] 브라우저 캐싱은 네비게이션 과정의 어떤 단계를 건너뛰게 하나?

## 도입

브라우저가 페이지를 요청할 때 거치는 단계(DNS lookup → TCP handshake → TLS negotiation → HTTP 요청/응답)는 각각 독립적인 비용이 있다. 캐싱의 종류와 수준에 따라 이 단계들 중 일부 또는 전부를 건너뛸 수 있다.

---

## 본문

캐싱 수준에 따라 건너뛰는 단계가 달라진다.

```
캐싱 없음 (첫 방문)
  DNS lookup → TCP handshake → TLS → HTTP 요청/응답

DNS 캐시만 있음 (OS/브라우저 캐시)
  [DNS 건너뜀] → TCP handshake → TLS → HTTP 요청/응답

HTTP 캐시 유효 (max-age 내)
  [DNS 건너뜀] → [TCP 건너뜀] → [TLS 건너뜀] → [HTTP 건너뜀]
  → 로컬 캐시에서 즉시 응답

HTTP 캐시 stale (ETag revalidation)
  [DNS 건너뜀] → TCP handshake → TLS → 조건부 요청 → 304 Not Modified
```

**DNS 캐시**: 한 번 조회한 IP 주소는 TTL(Time to Live)이 만료될 때까지 브라우저·OS에 캐시된다. 이후 요청에서는 DNS 서버까지 왕복하지 않아도 된다.

**HTTP 캐시 (메모리/디스크 캐시)**: `Cache-Control: max-age=86400` 같은 헤더가 있고 아직 유효한 경우, 브라우저는 네트워크 연결 자체를 하지 않고 로컬에 저장된 응답을 즉시 반환한다. DevTools Network 탭에서 "from memory cache" 또는 "from disk cache"로 표시되는 요청이 이에 해당한다.

**Service Worker 캐시**: 네트워크 요청 자체를 JS로 가로채서 캐시된 응답을 반환하는 방식이다. 오프라인에서도 동작하며, 전략(Cache First, Network First 등)을 세밀하게 제어할 수 있다.

---

## 종합

캐싱이 효과적일수록 네비게이션 단계가 줄어들고 TTFB가 낮아진다. HTTP 캐시가 완전히 유효하면 TCP/TLS 왕복 8회 전체를 생략할 수 있어 응답이 거의 즉각적이다. 반면 revalidation이 필요한 경우에는 여전히 네트워크 왕복이 발생하므로, 캐시 전략을 설계할 때는 "얼마나 자주 변경되는가"와 "최신 콘텐츠가 얼마나 중요한가"를 함께 고려해야 한다.
