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

