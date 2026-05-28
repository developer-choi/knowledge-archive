# [UNVERIFIED] Connection-oriented Communication이란 무엇이며, TCP는 이를 어떻게 사용하는가?

## 도입

데이터를 전송하는 방법에는 두 가지가 있다. 먼저 연결을 확립하고 데이터를 보내는 "연결형"과, 연결 없이 그냥 보내는 "비연결형"이다. TCP는 전자를 사용하며, 신뢰성을 대가로 얻는다.

---

## 본문

Connection-oriented Communication(연결 지향 통신)은 데이터를 전송하기 전에 먼저 가상의 연결 통로를 만들고, 그 통로를 통해 데이터를 주고받는 방식이다.

**TCP의 Connection-oriented 동작:**

- **가상회선(virtual circuit) 확립**: 실제 물리 선을 점유하는 것이 아니라 논리적인 연결 경로를 만든다. 두 호스트가 "서로 통신할 준비가 됐다"는 것을 확인한 상태다.

- **경로 재계산 없음**: 연결이 확립된 후 패킷들은 미리 설정된 경로를 따라간다. 라우터가 패킷마다 경로를 새로 계산할 필요가 없다.

- **연결 후 종료**: 모든 데이터가 전달된 후 명시적으로 연결을 끊는 절차가 있다.

```
비연결형 (UDP):
보낸다 ──► [라우터] ──► 도착 (확인 없음)

연결형 (TCP):
연결 확립 ──► 데이터 전송 ──► 확인 ──► 연결 종료
```

이 "정확성을 위해 여러 번 확인하는" 절차가 TCP의 신뢰성의 근원이다.

---

## 종합

HTTP가 TCP 위에서 동작하는 이유가 여기 있다. 웹페이지 HTML이 중간에 누락되거나 순서가 뒤바뀌면 안 된다. TCP의 신뢰성 있는 전달이 HTTP의 정확한 통신을 보장한다. 반면 게임 실시간 위치 데이터처럼 "약간 누락되어도 괜찮으니 빠른 것이 중요한" 경우에는 UDP를 선택한다.

---

---

# [UNVERIFIED] TCP의 3-way handshake란 무엇이며, 어떤 순서로 진행되는가?

## 도입

TCP 연결을 시작하려면 양쪽이 "통신할 준비가 됐다"는 것을 확인해야 한다. 이 확인 과정이 3-way handshake로, 패킷을 정확히 3번 교환한다.

---

## 본문

3-way handshake는 TCP Connection Establishment(TCP 연결 확립)의 다른 이름이다. 세 단계로 진행된다:

**1단계 — SYN (클라이언트 → 서버)**

클라이언트가 "연결하고 싶다"는 SYN 패킷을 보낸다. TCP 헤더의 code bits에서 SYN 비트에 1을 설정한다. 이때 클라이언트의 초기 Sequence Number도 포함된다.

**2단계 — SYN-ACK (서버 → 클라이언트)**

서버가 "요청 받았다(ACK), 나도 연결 준비됐다(SYN)"는 SYN-ACK 패킷을 보낸다. 서버의 초기 Sequence Number도 포함된다.

**3단계 — ACK (클라이언트 → 서버)**

클라이언트가 "확인했다(ACK)"는 패킷을 보낸다. 이 패킷이 도착하면 TCP 연결이 확립된다.

```
클라이언트                    서버
     │                          │
     │──── SYN ────────────────►│   (1) "연결하고 싶어"
     │                          │
     │◄─── SYN + ACK ───────────│   (2) "OK, 나도 준비됐어"
     │                          │
     │──── ACK ────────────────►│   (3) "확인"
     │                          │
     │══════ 연결 확립 ═══════════│
     │                          │
     │── HTTP 요청 ─────────────►│   (이제 데이터 교환)
```

"3번 신호를 주고받는다"고 해서 3-way handshake라고 부른다.

---

## 종합

`fetch('https://example.com')`을 호출하면 HTTP 요청이 가기 전에 이 3-way handshake가 먼저 일어난다. DevTools Network 탭의 Timing에서 "Initial connection" 항목이 이 시간이다. 이미 연결된 TCP를 재사용(keep-alive)하면 이 과정이 생략된다. HTTPS라면 TCP 핸드셰이크 후 TLS 핸드셰이크도 추가로 진행된다.

---

---

# [UNVERIFIED] 3-way handshake 과정에서 클라이언트와 서버는 어떤 정보를 교환하는가?

## 도입

3-way handshake는 단순히 "연결하겠다"는 신호를 교환하는 것이 아니다. 이후 데이터를 주고받을 때 필요한 핵심 정보를 이 과정에서 서로 알게 된다.

---

## 본문

핸드셰이크에서 교환하는 주요 정보는 두 가지다:

**Sequence Number / Acknowledgement Number**

각자의 초기 Sequence Number(ISN, Initial Sequence Number)를 교환한다. 이 번호로 이후 데이터가 몇 번째 데이터인지 추적한다. 데이터를 쪼개서 여러 패킷으로 보낼 때 순서를 맞추고, 누락된 것을 감지하는 데 사용된다.

**Window Size**

한 번에 얼마나 많은 데이터를 받을 수 있는지(버퍼 크기)를 서로에게 알린다. 수신 측이 처리할 수 있는 속도에 맞게 송신 측이 데이터를 보내도록 조절하는 기반이 된다(흐름 제어).

```
클라이언트                           서버
SYN (seq=1000)     ──────────────►
                   ◄────────────── SYN-ACK (seq=5000, ack=1001, win=8192)
ACK (ack=5001, win=4096) ────────►
                                    연결 확립

이후 데이터 교환에서:
클라이언트는 seq=1001부터 데이터를 시작
서버는 seq=5001부터 데이터를 시작
각자의 Window Size로 흐름 제어
```

---

## 종합

3-way handshake는 단순한 인사 교환이 아니라 통신의 기반 파라미터를 협상하는 과정이다. Sequence Number로 순서 보장과 누락 감지를, Window Size로 흐름 제어를 가능하게 한다. 이 정보 없이는 신뢰성 있는 데이터 전송이 불가능하다.

---

---

# [UNVERIFIED] TCP의 4-way handshake란 무엇이며, 어떤 순서로 진행되는가?

## 도입

TCP 연결을 종료할 때도 양쪽이 명시적으로 "끊겠다"는 절차를 거친다. 이것이 4-way handshake로, 연결 확립(3-way)보다 한 단계 더 많다.

---

## 본문

4-way handshake는 TCP Connection Termination(TCP 연결 종료)의 과정이다. 네 단계로 진행된다:

**1단계 — FIN (클라이언트 → 서버)**

클라이언트가 "더 이상 보낼 데이터가 없다"는 FIN 패킷을 보낸다. "나는 보내기를 끝냈어."

**2단계 — ACK (서버 → 클라이언트)**

서버가 "FIN 받았다"는 ACK를 보낸다. 하지만 서버는 아직 보낼 데이터가 남아있을 수 있다.

**3단계 — FIN (서버 → 클라이언트)**

서버가 자신의 데이터 전송을 마치면 "나도 보내기를 끝냈다"는 FIN을 보낸다.

**4단계 — ACK (클라이언트 → 서버)**

클라이언트가 "확인"하는 ACK를 보낸다. 이 ACK가 도착하면 연결이 완전히 종료된다.

```
클라이언트                        서버
     │                               │
     │──── FIN ──────────────────────►│   (1) "나 보내기 끝"
     │                               │
     │◄─── ACK ───────────────────────│   (2) "OK, 받았어"
     │                               │       (서버 아직 보낼 것 있을 수 있음)
     │                               │
     │◄─── FIN ───────────────────────│   (3) "나도 보내기 끝"
     │                               │
     │──── ACK ──────────────────────►│   (4) "확인, 연결 끊을게"
     │                               │
     │══════════ 연결 종료 ══════════════│
```

3-way와 달리 4-way인 이유: 연결 확립은 양쪽이 동시에 준비됐을 때만 가능하므로 SYN+ACK를 하나로 묶을 수 있다. 종료는 한쪽이 먼저 끝내도 상대가 아직 보낼 데이터가 있을 수 있어 ACK와 FIN을 분리한다.

---

## 종합

HTTP/1.1의 `Connection: close` 응답 후 TCP 연결 종료 시 이 4-way handshake가 일어난다. HTTP/1.1 keep-alive는 이 종료를 미루어 연결을 재사용한다. HTTP/2는 하나의 연결로 많은 요청을 처리하여 4-way handshake 횟수를 최소화한다.

---

---

# [UNVERIFIED] TCP에서 Segment란 무엇인가?

## 도입

네트워크 계층별로 데이터 단위의 이름이 다르다. TCP 계층에서의 데이터 단위가 Segment다.

---

## 본문

Segment는 상위 계층(응용 계층)에서 내려온 데이터에 TCP 헤더를 붙인 것이다. 계층별 데이터 단위를 비교하면:

```
응용 계층 (HTTP):    메시지 (HTTP request/response)
     ↓ (TCP 헤더 추가)
전송 계층 (TCP):     세그먼트 (Segment)
     ↓ (IP 헤더 추가)
네트워크 계층 (IP):  패킷 (Packet)
     ↓ (이더넷 헤더 추가)
링크 계층:           프레임 (Frame)
```

`fetch('/api/data')`로 큰 HTTP 요청을 보낼 때, 이 데이터는 TCP 계층에서 여러 Segment로 분할된다. 각 Segment에는 TCP 헤더(Sequence Number, Source/Destination Port 등)가 붙어 네트워크를 통해 개별적으로 전송된다.

**TCP 헤더 + 데이터 = Segment:**

```
┌─────────────────────────────────────────┐
│  TCP 헤더                                │
│  ├── Source Port     (16 bits)           │
│  ├── Destination Port (16 bits)          │
│  ├── Sequence Number  (32 bits)          │
│  ├── Acknowledgement Number (32 bits)    │
│  ├── Code bits (flags)                   │
│  ├── Window Size                         │
│  └── (기타 필드)                          │
├─────────────────────────────────────────┤
│  데이터 (응용 계층에서 내려온 것)           │
└─────────────────────────────────────────┘
```

---

## 종합

TCP가 Segment 단위로 데이터를 쪼개는 이유는 네트워크 경로마다 한 번에 보낼 수 있는 크기(MTU, Maximum Transmission Unit)가 제한되어 있기 때문이다. 수신 측은 Segment들의 Sequence Number를 보고 원래 순서로 재조립한다. Segment 하나라도 누락되면 TCP가 재전송을 요청한다.

---

---

# [UNVERIFIED] TCP Header의 code bits란 무엇이며, 어떤 플래그들이 있는가?

## 도입

TCP 헤더에는 연결 상태를 나타내는 제어 비트가 있다. 이 비트들(플래그)이 패킷의 목적을 알려준다 — 연결 요청인지, 확인 응답인지, 종료인지.

---

## 본문

Code bits(또는 Control bits, TCP flags)는 TCP 헤더의 연결 관련 제어 정보 필드다. 각 비트가 특정 의미를 갖는다.

**주요 플래그:**

**SYN (Synchronize)**

연결 요청. 3-way handshake의 1단계(클라이언트 → 서버)와 2단계(서버 → 클라이언트)에서 사용된다.

```
SYN = 1: "연결 요청이야" 또는 "연결 수락했어 + 나도 연결 요청"
```

**ACK (Acknowledgment)**

확인 응답. 상대가 보낸 데이터를 받았음을 알린다. 3-way handshake의 2단계, 3단계와 데이터 전송 중 사용된다.

```
ACK = 1: "Acknowledgement Number 필드가 유효해 — 이만큼 받았어"
```

**FIN (Finish)**

연결 종료 요청. 4-way handshake의 1단계, 3단계에서 사용된다.

```
FIN = 1: "나는 더 보낼 데이터가 없어, 연결 끊자"
```

```
플래그 조합과 의미:
SYN=1, ACK=0         → 3-way 1단계: 최초 연결 요청
SYN=1, ACK=1         → 3-way 2단계: 연결 수락 + 나도 연결 요청
ACK=1 (SYN=0, FIN=0) → 데이터 수신 확인
FIN=1, ACK=1         → 4-way 1/3단계: 종료 요청
ACK=1 (FIN=0)        → 4-way 2/4단계: 종료 요청 확인
```

---

## 종합

TCP 연결의 전체 라이프사이클이 code bits의 조합으로 표현된다. 네트워크 분석 도구(Wireshark)에서 TCP 패킷을 보면 `[SYN]`, `[SYN, ACK]`, `[ACK]`, `[FIN, ACK]` 같은 표시가 이 플래그들이다. DevTools Network 탭에서 직접 볼 수는 없지만, 브라우저가 서버와 통신하는 모든 과정의 기저에 이 플래그 교환이 있다.

---

---

# [UNVERIFIED] TCP Header의 Sequence Number와 Acknowledgement Number는 각각 무엇을 나타내는가?

## 도입

데이터를 여러 패킷으로 쪼개서 보내면 순서가 뒤바뀌거나 일부가 누락될 수 있다. TCP는 Sequence Number와 Acknowledgement Number로 순서를 추적하고 누락을 감지한다.

---

## 본문

**Sequence Number (시퀀스 번호)**

송신측이 수신측에게 알려주는 값이다. "이번 데이터는 전체 데이터 스트림에서 몇 번째 바이트부터 시작하는가"를 나타낸다.

```
예: 1000바이트 데이터를 300바이트씩 쪼개 전송

Segment 1: seq=0,    데이터 0~299바이트
Segment 2: seq=300,  데이터 300~599바이트
Segment 3: seq=600,  데이터 600~899바이트
Segment 4: seq=900,  데이터 900~999바이트
```

순서 없이 도착해도 수신측이 seq 값으로 재조립한다.

**Acknowledgement Number (확인 응답 번호)**

수신측이 송신측에게 알려주는 값이다. "다음에 받고 싶은 바이트 번호"를 의미한다 — 즉 "이 번호까지 모두 받았어"의 다음 번호다.

```
수신측이 0~299를 받았으면:
→ ack=300 (다음에 300번부터 보내줘)

수신측이 300~599를 받았으면:
→ ack=600 (다음에 600번부터 보내줘)
```

Sequence Number와 Acknowledgement Number는 서로 매칭된다 — 수신측의 ack는 송신측의 다음 seq다.

```
클라이언트(송신)               서버(수신)
seq=0, 300바이트 ──────────►
                 ◄────────── ack=300 ("300번까지 받았어")
seq=300, 300바이트 ────────►
                 ◄────────── ack=600 ("600번까지 받았어")
```

---

## 종합

Sequence/Acknowledgement Number 덕분에 TCP는 세 가지를 달성한다: 순서 보장(도착 순서가 달라도 seq로 재조립), 누락 감지(ack가 오지 않으면 해당 패킷 재전송), 중복 제거(이미 받은 seq는 버림). 이것이 TCP가 "신뢰성 있는 전송"을 제공하는 핵심 메커니즘이다.

---

---

# [UNVERIFIED] 재전송 제어(retransmission control)란 무엇인가?

## 도입

네트워크에서 패킷이 손실될 수 있다. TCP는 이를 감지하고 자동으로 재전송하여 데이터 손실이 없도록 보장한다. 이것이 재전송 제어다.

---

## 본문

재전송 제어는 Sequence Number와 Acknowledgement Number를 기반으로 동작한다. 매번 데이터를 보내고 확인 응답을 받는 과정에서 이상이 생기면 재전송한다.

**동작 원리:**

1. 송신측이 Segment를 보내고 ACK를 기다린다 (타이머 시작)
2. 수신측이 Segment를 받으면 ACK를 보낸다
3. 송신측이 ACK를 받으면 다음 데이터를 보낸다

**패킷 손실 감지:**

타이머가 만료될 때까지 ACK가 오지 않으면 패킷이 손실된 것으로 판단하고 재전송한다.

```
정상:
송신: seq=100 ──►  수신
       ◄── ack=200 (seq=100에서 100바이트 받았어)
송신: seq=200 ──►  수신
       ◄── ack=300

손실:
송신: seq=100 ──►  (패킷 손실!) 수신
      [타이머 만료 후]
송신: seq=100 ──►  수신 (재전송)
       ◄── ack=200
```

---

## 종합

재전송 제어는 TCP가 비신뢰적인 IP 계층 위에서 신뢰성 있는 전송을 제공하는 핵심 메커니즘이다. HTTP/1.1, HTTP/2는 TCP 위에서 동작하므로 패킷 손실을 신경 쓰지 않아도 TCP가 알아서 재전송한다. 반면 HTTP/3(QUIC)은 UDP 위에서 자체적으로 재전송 메커니즘을 구현했다. 이 재전송이 HTTP/2의 TCP HOL blocking의 원인이기도 하다 — 하나의 패킷이 손실되면 그 TCP 연결의 모든 스트림이 재전송을 기다려야 한다.

---

---

# [UNVERIFIED] TCP Header의 Window Size는 무엇이며, 언제 결정되는가?

## 도입

매 Segment를 보낼 때마다 ACK를 기다리는 것은 비효율적이다. TCP는 여러 Segment를 한꺼번에 보낼 수 있도록 "버퍼"를 두는데, 이 버퍼 크기가 Window Size다.

---

## 본문

Window Size는 수신측이 "ACK를 보내지 않고도 한 번에 받을 수 있는 최대 데이터 양"이다.

**Window Size가 없으면:**

```
1개 보내고 ACK 기다림
1개 보내고 ACK 기다림
1개 보내고 ACK 기다림
→ 매우 비효율적 (RTT마다 1개 단위로 진행)
```

**Window Size 활용:**

```
Window Size = 3000바이트면:
Segment 1 (seq=0, 1000바이트)  ──►
Segment 2 (seq=1000, 1000바이트) ──►  (ACK 안 기다리고 연달아 전송)
Segment 3 (seq=2000, 1000바이트) ──►
                               ◄── ack=3000 (한 번에 확인)
Segment 4 (seq=3000, 1000바이트) ──►
...
```

수신측이 처리할 수 있는 속도 이상으로 데이터가 오면 버퍼가 넘친다(버퍼 오버플로우). 수신측은 Window Size를 줄여서 "천천히 보내줘"라고 신호한다. 이것이 흐름 제어(flow control)다.

**Window Size가 결정되는 시점:**

3-way handshake 과정에서 서로의 Window Size를 교환하여 초기값을 설정한다. 이후 통신 중에도 동적으로 변경될 수 있다.

```
클라이언트            서버
SYN, win=4096 ──►
               ◄── SYN-ACK, win=8192
ACK ──────────►

이후 데이터 전송:
클라이언트는 서버의 버퍼(8192바이트)만큼 한 번에 전송 가능
서버는 클라이언트 버퍼(4096바이트)만큼 한 번에 전송 가능
```

---

## 종합

Window Size 기반의 흐름 제어는 "빠른 송신측이 느린 수신측을 압도하지 않도록" 보장한다. 서버가 빠르게 데이터를 내려보내도 브라우저의 버퍼 크기 이상으로 한 번에 보내지 않는다. TCP가 이 조율을 자동으로 처리하기 때문에 HTTP/애플리케이션 레벨에서는 신경 쓸 필요가 없다.

---

---

# [UNVERIFIED] TCP Header에는 그 외에 어떤 필드가 있는가?

## 도입

TCP 헤더에는 code bits(플래그), Sequence Number, Acknowledgement Number, Window Size 외에도 통신 식별에 필수적인 Port 번호가 포함된다.

---

## 본문

**Source Port Number (출발지 포트)**

이 패킷을 보낸 애플리케이션의 포트 번호다. 운영 체제가 각 네트워크 소켓에 임시 포트(ephemeral port, 보통 49152~65535 범위)를 할당한다.

**Destination Port Number (목적지 포트)**

이 패킷을 받을 서버 애플리케이션의 포트 번호다. HTTP는 80, HTTPS는 443, Express 개발 서버는 보통 3000이다.

**포트의 역할:**

IP 주소가 "어느 컴퓨터"를 나타낸다면, 포트는 "그 컴퓨터의 어느 애플리케이션"을 나타낸다. 같은 서버에서 포트 80은 nginx, 포트 3000은 Node.js 앱, 포트 5432는 PostgreSQL이 각자 listen할 수 있다.

```
TCP Segment 헤더 구조:
┌─────────────────────────────────────────────────┐
│ Source Port (16 bits) │ Destination Port (16 bits)│
├─────────────────────────────────────────────────┤
│           Sequence Number (32 bits)              │
├─────────────────────────────────────────────────┤
│        Acknowledgement Number (32 bits)          │
├─────────────────────────────────────────────────┤
│Data │Reserved│U│A│P│R│S│F│    Window Size        │
│Offset│       │R│C│S│S│Y│I│   (16 bits)           │
│      │       │G│K│H│T│N│N│                       │
├─────────────────────────────────────────────────┤
│       Checksum (16 bits) │  Urgent Pointer        │
└─────────────────────────────────────────────────┘
```

```js
// fetch()가 만드는 TCP 연결의 포트 구조:
// Source: 브라우저의 임시 포트 (예: 52341)
// Destination: 서버의 443 (HTTPS)

// Express 서버 설정:
app.listen(3000)  // Destination Port = 3000
```

---

## 종합

(Source IP + Source Port + Destination IP + Destination Port + Protocol)의 조합을 5-tuple이라 하며, 이것이 네트워크 연결을 고유하게 식별한다. 같은 서버의 같은 포트로 여러 클라이언트가 연결해도 Source IP와 Source Port가 다르기 때문에 서버가 연결을 구분할 수 있다. Node.js의 `server.on('connection', socket => ...)` 이벤트에서 `socket.remoteAddress`(Source IP)와 `socket.remotePort`(Source Port)로 클라이언트를 식별하는 것이 이 원리다.
