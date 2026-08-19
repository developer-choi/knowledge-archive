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
