# HTTP(Hypertext Transfer Protocol)란 무엇인가?

> HTTP (Hypertext Transfer Protocol) is an application layer protocol in the Internet protocol suite for distributed, collaborative, hypermedia information systems.
> HTTP is the foundation of data communication for the World Wide Web, where hypertext documents include hyperlinks to other resources that the user can easily access, for example by a mouse click or by tapping the screen in a web browser.

---

**도입**

브라우저 주소창에 `https://example.com`을 치면 어떻게 페이지가 떠오르는지 그 첫 단계가 HTTP입니다. HTTP는 OSI 7계층 중 가장 위, 애플리케이션 계층의 프로토콜입니다. 그 아래에 TCP가 있고 또 그 아래에 IP가 있습니다 — HTTP는 그 위에 얹혀서 "어떤 형식으로 요청하고 응답할지"의 규칙만 정의합니다.

---

**본문**

> HTTP (Hypertext Transfer Protocol) is an application layer protocol in the Internet protocol suite

HTTP는 인터넷 프로토콜 모음(TCP/IP) 중 애플리케이션 계층에 속하는 프로토콜이다.

- **application layer**: 가장 위 계층. 실제 애플리케이션(브라우저, 웹서버)이 다루는 데이터 형식과 의미를 정의합니다. 패킷을 어떻게 쪼개고 어디로 보낼지는 아래 계층(TCP, IP)이 알아서 합니다.
- **Internet protocol suite**: TCP/IP 모음을 가리키는 정식 명칭. HTTP는 그 안의 한 멤버이지 단독 표준이 아닙니다.

> for distributed, collaborative, hypermedia information systems.

분산형, 협력형, 하이퍼미디어 정보 시스템을 위한 것이다.

- **distributed**: 한 서버에 모든 자원이 있는 게 아니라 여러 서버에 흩어져 있다는 뜻. `<img src="https://cdn.example.com/...">`처럼 페이지 안의 이미지가 다른 서버에서 와도 정상 동작합니다.
- **hypermedia**: 텍스트뿐 아니라 이미지·영상·오디오까지 포함하고 서로 링크로 연결된 미디어. 단순 텍스트 전송 프로토콜이 아니라 멀티미디어 전반을 다룹니다.

> HTTP is the foundation of data communication for the World Wide Web,

HTTP는 월드와이드웹(WWW)의 데이터 통신 기반이다.

- **foundation**: WWW를 떠받치는 토대. 이게 없으면 웹페이지를 가져올 표준 방법이 없습니다. 다른 프로토콜(FTP, gopher)도 한때 후보였지만 HTTP가 표준으로 자리잡았습니다.

> where hypertext documents include hyperlinks to other resources that the user can easily access, for example by a mouse click or by tapping the screen in a web browser.

하이퍼텍스트 문서는 다른 리소스로 연결되는 하이퍼링크를 포함하며, 사용자는 브라우저에서 마우스 클릭이나 화면 터치로 쉽게 접근할 수 있다.

- **hyperlinks**: 다른 리소스로 점프할 수 있는 연결. `<a href="...">`가 그 구현체. 클릭 한 번으로 다른 서버의 다른 문서를 가져오는 게 웹의 본질입니다.
- **easily access**: 사용자는 URL을 외울 필요 없이 클릭만 합니다. 브라우저가 그 클릭을 HTTP 요청으로 변환해 서버에 보냅니다.

---

**종합**

HTTP를 한 문장으로 정리하면 "브라우저가 서버에게 리소스를 요청하고, 서버가 응답하는 규칙"입니다. 핵심은 세 가지 키워드입니다.

| 키워드 | 의미 | 실무 위치 |
|---|---|---|
| application layer | TCP/IP 위에서 의미·형식을 정의 | 브라우저, 웹서버 |
| hypermedia | HTML, 이미지, JSON, 비디오 모두 운반 | `Content-Type`으로 타입 명시 |
| hyperlinks | 다른 리소스로 점프 가능 | `<a>`, `<img>`, `<script src>` |

Chrome DevTools의 Network 탭을 열면 보이는 모든 요청이 HTTP 메시지입니다. `fetch('/api/users')` 한 줄을 실행하면 JS 런타임이 HTTP 요청 메시지를 만들고, 브라우저가 그걸 TCP 위에 실어 서버로 보냅니다 — 이 모든 것이 application layer 안에서 일어나는 일입니다.

오개념 예방: HTTP는 패킷을 직접 전송하지 않습니다. "패킷을 어떻게 신뢰성 있게 보낼지"는 TCP의 일이고, HTTP는 그 위에서 "메시지의 형식과 의미"만 정합니다. 그래서 HTTP/3에서 TCP 대신 QUIC을 쓸 수 있는 것도 — 메시지 형식은 그대로 두고 아래 계층만 갈아끼울 수 있기 때문입니다.

Official Annotation 보충: HTTP는 단순한 웹 브라우저-서버 통신만이 아니라 "확장 가능한(extensible) 프로토콜"로 설계됐습니다. 새 헤더의 의미를 클라이언트와 서버가 합의하기만 하면 새 기능을 추가할 수 있어서, 머신 간 통신, REST API, 서비스 메시 등으로 영역을 넓혀왔습니다.
