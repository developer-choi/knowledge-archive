# 웹에서 TLS 인증은 보통 어느 한쪽만 수행되는데, 어느 쪽이 인증되며 그 이유는?

> SSL/TLS is especially suited for HTTP, since it can provide some protection even if only one side of the communication is authenticated.
> This is the case with HTTP transactions over the Internet, where typically only the server is authenticated (by the client examining the server's certificate).

---

**도입**

HTTPS 사이트에 접속할 때 — 브라우저는 서버의 인증서를 검증합니다. 그런데 서버는 클라이언트(우리)의 신원을 어떻게 검증할까요? 사실 — 보통 검증하지 않습니다. 웹의 TLS 인증은 한쪽만(서버) 수행되며, 사용자 인증은 그 위 애플리케이션 레벨(로그인)에서 처리됩니다. 이 비대칭이 자연스러운 이유가 있습니다.

---

**본문**

> SSL/TLS is especially suited for HTTP, since it can provide some protection even if only one side of the communication is authenticated.

SSL/TLS는 HTTP에 특히 적합한데, 통신의 한쪽만 인증되어도 어느 정도 보호를 제공할 수 있기 때문이다.

- **especially suited for HTTP**: HTTP에 특히 적합. SSL/TLS의 한쪽 인증 모델이 HTTP의 사용 패턴과 맞음.
- **only one side of the communication is authenticated**: 한쪽만 인증. 양쪽 모두 인증할 수도 있지만 한쪽만으로도 의미 있는 보안 가능.
- **some protection**: 어느 정도 보호. 완벽하진 않아도 충분한 보안.

> This is the case with HTTP transactions over the Internet,

이는 인터넷에서의 HTTP 트랜잭션에서 그렇다.

- **HTTP transactions over the Internet**: 인터넷의 일반 HTTP 트랜잭션. 일반 웹사이트 접속.

> where typically only the server is authenticated (by the client examining the server's certificate).

여기서는 보통 서버만 인증된다(클라이언트가 서버의 인증서를 검사함으로써).

- **typically only the server**: 보통 서버만. 클라이언트(브라우저)는 자기 신원을 TLS 레벨에서 증명하지 않음.
- **client examining the server's certificate**: 클라이언트가 서버 인증서를 검사. 이 일방향 검증이 표준 모델.

---

**종합**

웹 HTTPS의 인증 모델:

| 주체 | 인증되는가 | 어떻게 |
|---|---|---|
| 서버 | ○ TLS 레벨 인증 | CA가 서명한 인증서 제시 |
| 클라이언트 (브라우저) | × TLS 레벨 인증 안 함 | — |
| 사용자 | △ 애플리케이션 레벨 | 로그인 (ID/PW, OAuth, JWT) |

왜 서버만 인증하는가:

**확장성 측면**: 수십억 명의 웹 사용자가 모두 자기 인증서를 가지고 있다고 상상해보세요. CA가 모든 사용자에게 인증서를 발급하고, 갱신하고, 폐기 관리하는 비용은 비현실적입니다. 사용자 인증은 사이트별로 ID/PW나 OAuth로 처리하는 게 훨씬 실용적.

**보안 모델 측면**: 사용자가 정말 보호받고 싶은 건 "내가 진짜 내 은행에 접속했나?" — 이게 서버 인증입니다. "은행이 진짜 나인지 알고 싶은가?"는 — 은행이 ID/PW나 OTP로 직접 확인합니다. TLS가 이 둘을 모두 책임질 필요가 없죠.

**프라이버시 측면**: 사용자에게 TLS 클라이언트 인증서가 있으면, 그 사용자는 어느 사이트에 접속하든 같은 인증서를 제시 — 여러 사이트가 한 사용자를 추적하기 쉬워집니다. ID/PW는 사이트별로 다르므로 추적 가능성이 낮음.

**한쪽 인증만으로도 보안이 의미 있는 이유**:

```
시나리오: 사용자 → 은행 사이트

서버만 인증되면:
1. 사용자는 진짜 은행에 접속한 게 확실 (인증서 검증)
2. 통신이 암호화되어 도청·변조 불가
3. 그러므로 사용자가 ID/PW를 보낼 때 진짜 은행에 안전하게 도달
4. 은행이 ID/PW로 사용자 검증 → 보안 완성

클라이언트도 TLS 레벨에서 인증하면 (mTLS):
- 추가 보안이지만, ID/PW로도 충분히 사용자 인증됨
- 추가 인증서 관리 부담만 큼
```

언제 mTLS(상호 인증)를 쓰는가 — Official Annotation 영역:

- **마이크로서비스 간 통신**: 백엔드 서비스 A와 B가 서로 통신할 때. ID/PW 같은 사용자 인증 없이 서비스끼리 인증.
- **VPN, 기업 내부 시스템**: 회사 직원만 접근 가능한 시스템. 직원에게 클라이언트 인증서 발급.
- **금융권 API**: 매우 높은 보안이 필요한 B2B API.
- **IoT 기기**: 사용자 인증이 적합하지 않은 자동화 환경.

JS 개발자가 만지는 부분:

```js
// 일반 웹 — 서버 인증만, 사용자는 ID/PW로 로그인
await fetch('https://api.example.com/login', {
  method: 'POST',
  body: JSON.stringify({ id, password })
});
// TLS는 브라우저 자동 처리. 사용자 인증은 서버가 ID/PW 검증

// mTLS — 브라우저에서는 거의 못 보지만, 사내 도구에서 가끔 등장
// 클라이언트 인증서를 OS에 설치하면 브라우저가 자동으로 제시
```

이게 없으면 어떻게 되는가:

- 만약 양쪽 인증을 강제했다면 — 모든 웹 사용자가 클라이언트 인증서를 가져야 함. CA의 발급·관리 부담, 사용자의 인증서 보관 부담, 디바이스 변경 시 마이그레이션 등 — 비현실적. HTTPS 보급이 훨씬 늦어졌을 것.
- 서버 인증만으로 부족한 경우 — 마이크로서비스, 금융 API 등에선 mTLS로 보강. 도구가 다양해 선택 가능.

오개념 예방: "TLS 클라이언트 인증서 = 사용자 로그인"이 아닙니다. 클라이언트 인증서는 디바이스/계정 단위의 강한 인증이지만 — 사용자는 보통 ID/PW + (옵션) 2FA로 인증. 둘은 다른 계층입니다. 클라이언트 인증서만으로 모바일 앱 로그인을 처리하면 디바이스 변경 시 매우 불편(인증서 마이그레이션 필요).

또 다른 오개념: "HTTPS는 사용자 신원도 검증해준다"는 잘못입니다. HTTPS는 서버 신원만 검증 — 사용자 신원은 애플리케이션이 알아서 할 일. 사용자 인증을 HTTPS에 의존하면 보안이 무너집니다.

Official Annotation 보충: 클라이언트 인증서는 웹서버 접근을 인증된 사용자로 제한할 때 사용됩니다. 사이트 관리자가 각 사용자에게 인증서를 만들고 사용자가 브라우저에 로드합니다. 인증서엔 보통 사용자 이름과 이메일이 담겨 있고, 매 연결마다 서버가 자동 검증해 사용자 신원을 — 패스워드 없이도 — 확인할 수 있습니다.

AI Annotation 보충: 웹에서는 서버만 인증됩니다 — 브라우저가 서버의 인증서를 검사하여 신원을 확인합니다. 클라이언트(사용자)의 신원은 TLS 레벨이 아닌 애플리케이션 레벨(로그인, JWT 등)에서 처리합니다. 다만 mutual TLS(mTLS)도 가능하며, 마이크로서비스 간 통신에서 널리 쓰입니다.
