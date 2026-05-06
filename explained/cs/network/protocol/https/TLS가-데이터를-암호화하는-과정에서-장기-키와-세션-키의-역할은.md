# TLS가 데이터를 암호화하는 과정에서 장기 키와 세션 키의 역할은?

> The security of HTTPS is that of the underlying TLS, which typically uses long-term public and private keys to generate a short-term session key, which is then used to encrypt the data flow between the client and the server.
> X.509 certificates are used to authenticate the server (and sometimes the client as well).

---

**도입**

암호 알고리즘에는 두 종류가 있습니다 — 비대칭 키(공개키/비밀키, 안전하지만 느림)와 대칭 키(빠르지만 키 교환이 어려움). TLS는 둘의 장점을 결합하는 하이브리드 방식을 씁니다 — 비대칭으로 한 번만 안전하게 키 교환하고, 이후 데이터는 빠른 대칭키로 암호화. 이게 장기 키와 세션 키의 역할 분담입니다.

---

**본문**

> The security of HTTPS is that of the underlying TLS,

HTTPS의 보안은 그 기반인 TLS의 보안에 달려 있다.

- **security of HTTPS is that of TLS**: HTTPS가 안전하다 = TLS가 안전하다. HTTPS는 TLS에 보안을 위임하는 형태.

> which typically uses long-term public and private keys to generate a short-term session key,

TLS는 보통 장기 공개·비밀 키 쌍을 사용해 단기 세션 키를 생성한다.

- **long-term public and private keys**: 장기 공개·비밀 키. 비대칭 암호. 보통 RSA, ECDSA 등.
- **long-term**: 장기. 인증서의 유효기간 동안(보통 1~2년) 동일하게 사용.
- **short-term session key**: 단기 세션 키. 한 세션(연결) 동안만 유효한 일회성 키. 대칭 암호용.
- **generate**: 생성. 장기 키로 직접 데이터를 암호화하지 않고 — 일회성 키를 만드는 데만 사용.

> which is then used to encrypt the data flow between the client and the server.

이 세션 키는 클라이언트와 서버 사이의 데이터 흐름을 암호화하는 데 사용된다.

- **encrypt the data flow**: 데이터 흐름을 암호화. 실제 HTTP 메시지 본문이 이 키로 암호화.
- **between the client and the server**: 클라이언트와 서버 사이. 양방향 통신 모두.

> X.509 certificates are used to authenticate the server (and sometimes the client as well).

X.509 인증서는 서버를 인증하는 데 사용된다(때로는 클라이언트도).

- **X.509 certificates**: X.509 표준의 디지털 인증서. 공개키와 그 소유자 정보를 CA가 서명한 문서.
- **authenticate the server**: 서버 인증. 인증서를 통해 "이 공개키는 정말 example.com의 것"임을 보장.
- **sometimes the client as well**: 때로는 클라이언트도. mTLS의 경우 클라이언트도 자기 인증서로 인증.

---

**종합**

TLS의 키 분담:

| 키 종류 | 알고리즘 | 수명 | 역할 |
|---|---|---|---|
| 장기 공개키 | 비대칭 (RSA, ECDSA) | 수개월~수년 | 인증서에 담겨 서버 신원 증명 |
| 장기 비밀키 | 비대칭 | 수개월~수년 | 서버만 보관, handshake 시 서명/복호화 |
| 단기 세션 키 | 대칭 (AES, ChaCha20) | 한 세션 | 실제 데이터 암호화 |

왜 둘을 분리하는가:

```
비대칭 암호의 특징:
  - 안전하다 (공개키로 암호화한 걸 비밀키로만 풀 수 있음)
  - 매우 느리다 (RSA는 대칭 암호의 약 1000배 느림)

대칭 암호의 특징:
  - 빠르다 (AES는 하드웨어 가속까지 있음)
  - 키 교환이 어렵다 (어떻게 안전하게 같은 키를 양쪽이 가질 것인가)

TLS의 해결:
  1. 비대칭 키로 "안전하게 대칭 키를 교환" (느리지만 한 번만)
  2. 대칭 세션 키로 "빠르게 데이터 암호화" (빠르고 양은 많음)
```

TLS handshake의 흐름 (간단화):

```
1. 클라이언트 → 서버: "안녕, 나는 이런 cipher suite 지원해" (ClientHello)
2. 서버 → 클라이언트: "이 cipher suite로 가자" + 인증서(공개키 포함) 전송
3. 클라이언트: 인증서 검증 (CA 서명 확인, 도메인 일치 등)
4. 양쪽이 (Diffie-Hellman 등으로) 세션 키를 협상
   → 이 단계에서 장기 키가 사용됨 (안전한 키 교환을 위해)
5. 이후 모든 데이터: 세션 키로 대칭 암호화
   → 빠른 통신
```

JS 개발자에게 의미:

```js
await fetch('https://example.com/api');

// 보이지 않는 곳에서 일어나는 일:
// 1. TLS handshake (수십~수백 ms 소요)
//    - 인증서 검증
//    - 비대칭 키로 세션 키 협상
// 2. 세션 키로 요청 본문 암호화
// 3. 서버 응답을 세션 키로 복호화
// 4. JS 코드는 평문 응답을 받음
```

TLS 1.3에서는 handshake가 1-RTT로 단축되고, 세션 재개 시 0-RTT(데이터를 첫 패킷부터 보냄)도 가능합니다. 이 모든 게 장기 키와 세션 키의 분리 위에 만들어진 최적화.

이게 없으면 어떻게 되는가:

- 장기·세션 키 분리가 없다면 — 모든 데이터를 비대칭 키로 암호화해야 함. 너무 느려서 실시간 통신 불가능. HTTPS의 성능 부담이 막대해 보급이 어려웠을 것.
- 또는 대칭 키만 쓰면 — 키 교환 문제. 첫 통신부터 어떤 키로 암호화할지 결정 못 하므로 시작 자체가 불가능.

오개념 예방: 인증서의 공개키가 데이터 암호화에 직접 쓰이는 게 아닙니다. 공개키는 — RSA의 경우 키 교환 단계의 한 패스에 사용되거나, ECDHE 같은 현대 cipher suite에선 인증(서명 검증)에만 사용. 실제 데이터 암호화는 세션 키. 이 분리가 forward secrecy 같은 추가 보안을 가능하게 합니다.

또 다른 오개념: "TLS가 매번 전체 handshake를 한다"는 것도 잘못. TLS 1.3은 세션 재개(session resumption)를 지원해 — 짧은 시간 안에 같은 서버에 다시 접속하면 이전 세션 정보를 활용해 빠르게 재연결. 0-RTT 모드에서는 첫 데이터 패킷에 이미 암호화된 페이로드가 실림.

X.509 인증서의 구조 — 인증서엔 다음이 들어 있습니다:

```
Subject: CN=example.com (도메인)
Subject Alternative Names: example.com, www.example.com (서브도메인)
Issuer: CA의 이름
Validity: 2024-01-01 ~ 2025-01-01
Public Key: 서버의 공개키 (대칭 세션 키 협상에 사용)
Signature: CA가 위 정보 전체에 서명한 값 (위조 방지)
```

브라우저는 자물쇠 아이콘 옆에 이 정보를 보여줍니다 — 클릭해서 직접 확인 가능.

AI Annotation 보충: 비대칭 키(공개/비밀 키, 느림)로 대칭 세션 키(빠름)를 안전하게 교환하고, 이후 데이터 암호화는 세션 키로 수행하는 하이브리드 방식입니다. X.509 인증서는 서버의 공개 키가 진짜인지 CA가 보증하는 역할을 합니다.
