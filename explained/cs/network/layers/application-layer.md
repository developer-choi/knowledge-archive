# [UNVERIFIED] Application Layer의 역할은 무엇인가?

## 도입

OSI 7계층 중 가장 상위 계층인 Application Layer는 사용자가 네트워크를 통해 서비스를 이용하는 창구다. 브라우저에서 URL을 입력하거나 `fetch()`를 호출할 때 시작되는 계층이 바로 Application Layer다. 교재에서는 Session Layer·Presentation Layer와 묶어 "사용자가 네트워크로 서비스를 이용할 수 있게 해준다"고 설명하기도 한다.

---

## 본문

Application Layer는 사용자가 네트워크로 서비스를 이용할 수 있게 해주는 계층이다. OSI 모델에서는 7계층이고, TCP/IP 모델에서는 가장 상위 계층이다.

이 계층에서 동작하는 데이터 단위는 "메시지(Message)"라고 부른다. 메시지가 하위 계층으로 내려가면서 세그먼트(Transport Layer), 패킷(Network Layer), 프레임(Data Link Layer), 비트(Physical Layer)로 이름이 바뀐다.

```
OSI 7계층에서 Application Layer의 위치

7. Application  ← 사용자 서비스 (HTTP, FTP, SMTP)
6. Presentation ← 데이터 형식 변환, 암호화 (TLS)
5. Session      ← 세션 수립·유지·종료
─────────────── ← Application Layer는 5~7을 포괄하기도 함
4. Transport    ← 포트, 분할·재조합, 신뢰성 (TCP/UDP)
3. Network      ← IP 라우팅
2. Data Link    ← MAC, 프레임
1. Physical     ← 비트·신호 전송
```

`fetch("https://example.com/api")`를 호출하면 Application Layer에서 HTTP 요청 메시지가 만들어지고, 이것이 하위 계층으로 전달되어 최종적으로 물리적 신호로 변환된다.

---

## 종합

Application Layer는 개발자가 가장 직접적으로 다루는 계층이다. REST API 호출(`fetch()`), WebSocket 연결, DNS 조회가 모두 이 계층에서 시작된다. 하위 계층이 "어떻게 보낼 것인가"를 담당한다면, Application Layer는 "무엇을 보낼 것인가"를 담당한다.

---

---

# [UNVERIFIED] Application Layer에서 사용되는 대표적인 프로토콜에는 어떤 것들이 있는가?

## 도입

Application Layer에서 동작하는 프로토콜은 각 서비스 유형별로 다르다. 같은 네트워크 스택(TCP/IP) 위에서 웹 서비스·파일 전송·이메일·원격 로그인이 각기 다른 프로토콜로 동작한다.

---

## 본문

Application Layer의 주요 프로토콜:

- **Telnet Protocol**: 원격 로그인. 평문으로 통신해 보안에 취약하며, 현재는 암호화된 SSH로 대체됐다.
- **FTP Protocol (File Transfer Protocol)**: 파일 전송. 현재는 SFTP(SSH 기반)나 HTTPS로 많이 대체됐다.
- **SMTP Protocol (Simple Mail Transfer Protocol)**: 이메일 송신. 이메일 클라이언트가 메일 서버로 메시지를 보낼 때 사용한다.
- **HTTP Protocol (HyperText Transfer Protocol)**: 웹 서비스. 브라우저의 `fetch()`, `XMLHttpRequest`, 웹 소켓 업그레이드 요청이 모두 HTTP 기반이다.

```
서비스별 프로토콜 매핑

서비스           프로토콜    기본 포트
원격 로그인       Telnet      23 (SSH: 22)
파일 전송        FTP         21
이메일 송신      SMTP        25, 587
웹 서비스        HTTP        80
웹 서비스 암호화  HTTPS       443
```

---

## 종합

개발자 관점에서 Application Layer는 곧 HTTP·HTTPS다. REST API, WebSocket, 서버사이드 렌더링 모두 HTTP 위에서 동작한다. DevTools의 Network 탭에서 보이는 모든 요청이 Application Layer 메시지다 — 하위 계층(TCP 핸드셰이크, IP 라우팅, MAC 전달)은 브라우저와 OS가 숨겨준다.
