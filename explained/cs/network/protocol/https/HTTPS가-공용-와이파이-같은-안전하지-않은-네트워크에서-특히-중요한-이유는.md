# HTTPS가 공용 와이파이 같은 안전하지 않은 네트워크에서 특히 중요한 이유는?

> HTTPS is especially important over insecure networks and networks that may be subject to tampering.
> Insecure networks, such as public Wi-Fi access points, allow anyone on the same local network to packet-sniff and discover sensitive information not protected by HTTPS.
> Additionally, some free-to-use and paid WLAN networks have been observed tampering with webpages by engaging in packet injection in order to serve their own ads on other websites.
> This practice can be exploited maliciously in many ways, such as by injecting malware onto webpages and stealing users' private information.

---

**도입**

카페·공항·호텔의 무료 와이파이를 한 번도 쓰지 않은 사람은 거의 없을 겁니다. 같은 와이파이에 접속한 사람이 누군지도 모르는 채로요. HTTP 평문 사이트를 그 와이파이에서 쓴다면 — 누구나 패킷 스니퍼로 우리의 비밀번호와 세션을 가로챌 수 있습니다. HTTPS가 이런 상황에서 특히 중요한 이유를 짚습니다.

---

**본문**

> HTTPS is especially important over insecure networks and networks that may be subject to tampering.

HTTPS는 안전하지 않은 네트워크와 변조 대상이 될 수 있는 네트워크에서 특히 중요하다.

- **insecure networks**: 안전하지 않은 네트워크. 공용 와이파이, 공유 LAN 등.
- **subject to tampering**: 변조 대상. 누가 트래픽을 가로채 변경할 수 있는 환경.

> Insecure networks, such as public Wi-Fi access points, allow anyone on the same local network to packet-sniff

공용 와이파이 같은 안전하지 않은 네트워크는 같은 로컬 네트워크 상의 누구든 패킷 스니핑을 할 수 있게 한다.

- **public Wi-Fi access points**: 공용 와이파이. 카페·공항·호텔의 무료 와이파이.
- **anyone on the same local network**: 같은 네트워크의 누구든. 같은 와이파이에 접속한 모든 사람이 잠재적 도청자.
- **packet-sniff**: 패킷 스니핑. Wireshark 같은 도구로 네트워크 트래픽을 들여다보기.

> and discover sensitive information not protected by HTTPS.

그리고 HTTPS로 보호되지 않은 민감 정보를 발견할 수 있게 한다.

- **sensitive information**: 민감 정보. 비밀번호, 세션 쿠키, 개인 메시지 등.
- **not protected by HTTPS**: HTTPS로 보호 안 됨. 즉 평문 HTTP. 누구나 읽을 수 있음.

> Additionally, some free-to-use and paid WLAN networks have been observed tampering with webpages by engaging in packet injection

게다가 일부 무료·유료 WLAN 네트워크가 패킷 인젝션을 통해 웹페이지를 변조하는 것이 관찰됐다.

- **free-to-use and paid WLAN networks**: 무료뿐 아니라 유료 WLAN도. 돈 내고 쓰는 네트워크조차 신뢰할 수 없을 수 있음.
- **packet injection**: 패킷 인젝션. 정상 트래픽 사이에 자기 패킷을 끼워 넣음.
- **tampering with webpages**: 웹페이지 변조. 서버가 보낸 페이지에 변경을 가함.

> in order to serve their own ads on other websites.

다른 웹사이트에 자신들의 광고를 표시하기 위해.

- **serve their own ads**: 자기 광고 표시. 사용자가 보는 페이지에 네트워크 운영자의 광고를 강제 삽입.
- **on other websites**: 다른 웹사이트에. 광고를 자기 사이트가 아닌 사용자가 방문 중인 사이트에.

> This practice can be exploited maliciously in many ways, such as by injecting malware onto webpages and stealing users' private information.

이 관행은 다양하게 악의적으로 악용될 수 있다 — 웹페이지에 멀웨어를 주입하거나 사용자의 개인 정보를 훔치는 식으로.

- **exploited maliciously**: 악의적으로 악용. 광고 삽입은 비교적 약한 사례, 더 위험한 것들이 있음.
- **injecting malware**: 멀웨어 주입. 페이지에 악성 JS를 삽입해 사용자 기기 감염.
- **stealing users' private information**: 개인정보 탈취. 폼 입력 가로채기, 세션 토큰 절도 등.

---

**종합**

공용 와이파이 환경의 위협 시나리오:

| 공격 유형 | 평문 HTTP에서 가능한가 | HTTPS면 막히는가 |
|---|---|---|
| 비밀번호 도청 | ○ 패킷 스니퍼로 즉시 | ○ 암호화로 차단 |
| 세션 쿠키 탈취 | ○ Set-Cookie 헤더 가로채기 | ○ 암호화로 차단 |
| 광고 삽입 | ○ 응답 본문에 광고 코드 추가 | ○ 변조 시 MAC 검증 실패 |
| 멀웨어 주입 | ○ JS 페이로드 삽입 | ○ 무결성 검증으로 차단 |
| DNS 변조 (피싱) | ○ DNS 응답 위조 | △ HTTPS는 도메인 일치 검증으로 일부 방어 |
| 트래픽 메타데이터 분석 | ○ 어디 접속하는지 보임 | × 도메인은 SNI에서 노출 |

JS 개발자에게 와닿는 사례:

```js
// 평문 HTTP에서 로그인 폼 제출
await fetch('http://example.com/login', {                     // 평문!
  method: 'POST',
  body: 'id=alice&password=secret123'
});

// 같은 와이파이의 누군가가 Wireshark로 보면:
//   POST /login HTTP/1.1
//   Host: example.com
//   ...
//   id=alice&password=secret123    ← 그대로 보임
```

```js
// HTTPS에서 같은 요청
await fetch('https://example.com/login', {
  method: 'POST',
  body: 'id=alice&password=secret123'
});

// 같은 와이파이의 누군가가 Wireshark로 보면:
//   알 수 없는 암호화된 바이트 덩어리
//   (도메인 example.com만 SNI에서 보임 — 비밀번호 노출 X)
```

**실제 사례들**:

- **광고 인젝션**: 미국의 일부 ISP가 평문 HTTP 페이지에 자기 광고를 삽입한 사례. AT&T가 공항 와이파이에서 이를 시행해 논란.
- **세션 하이재킹**: Firesheep(2010)이라는 Firefox 확장이 유명. 같은 와이파이의 페이스북·트위터 등 평문 사이트의 세션을 한 번 클릭으로 탈취 가능. 이 사건이 주요 사이트들의 HTTPS 전환을 가속.
- **HSTS preload**: Chrome이 주요 사이트(google.com, facebook.com 등)를 미리 HTTPS 전용으로 설정. 사용자가 `http://google.com`을 입력해도 자동으로 HTTPS로.

이게 없으면 어떻게 되는가:

- 공용 와이파이에서 HTTPS가 없다면 — 카페에서 페이스북 로그인하다 같은 카페에 있는 사람에게 계정 탈취. 호텔 와이파이에서 회사 메일 접속하다 회사 기밀 노출. 공용 환경에서 인터넷 사용이 사실상 불가능.
- HTTPS만으로도 메타데이터(어느 사이트 접속 중인지)는 노출되므로 — 완전한 익명성·프라이버시는 VPN, Tor 등 추가 도구 필요.

오개념 예방: "유료 와이파이는 안전하다"는 잘못된 직관. Official Answer가 명시하듯 — "free-to-use and paid WLAN networks have been observed tampering". 돈 내고 쓰는 네트워크도 광고 인젝션이나 트래픽 변조를 한 사례가 있습니다. 비용과 보안은 무관합니다.

또 다른 오해: "와이파이 비밀번호가 있으면 안전하다"는 것도 부분적으로만 맞습니다. WPA2/3 비밀번호는 외부에서 와이파이 접속을 막을 뿐 — 일단 같은 와이파이에 접속한 사람들끼리는 서로의 트래픽을 볼 수 있습니다 (특히 옛 WPA2 환경). 비밀번호의 역할은 "외부인 차단"이지 "내부 도청 방지"가 아닙니다.

AI Annotation 보충: 공용 와이파이에서 HTTP 사이트에 로그인하면 비밀번호가 평문으로 날아갑니다. 패킷 인젝션은 광고 삽입뿐 아니라 멀웨어 주입까지 가능하게 만듭니다 — HTTPS면 변조를 감지하여 차단합니다.
