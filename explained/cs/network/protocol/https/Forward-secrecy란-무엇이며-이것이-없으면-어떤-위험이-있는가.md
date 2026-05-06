# Forward secrecy란 무엇이며, 이것이 없으면 어떤 위험이 있는가?

> An important property in this context is forward secrecy, which ensures that encrypted communications recorded in the past cannot be retrieved and decrypted should long-term secret keys or passwords be compromised in the future.
> Not all web servers provide forward secrecy.

---

**도입**

서버의 비밀키가 영원히 안전하다는 보장은 없습니다 — 5년 후, 10년 후 어느 시점엔가 유출되거나 양자컴퓨터로 해독될 수 있습니다. 그럼 과거에 가로챈 암호화 트래픽도 "지금부터" 다 풀 수 있을까요? Forward secrecy(전방 비밀성)가 있으면 — 안 됩니다. 미래 키 유출이 과거 통신에 영향 안 미치게 보호하는 메커니즘입니다.

---

**본문**

> An important property in this context is forward secrecy,

이 맥락에서 중요한 성질이 forward secrecy(전방 비밀성)다.

- **forward secrecy**: 전방 비밀성. "앞으로 키가 유출돼도 과거 통신은 안전"이라는 성질.
- **important property**: 중요한 성질. TLS 보안의 핵심 속성 중 하나.

> which ensures that encrypted communications recorded in the past cannot be retrieved and decrypted

과거에 기록된 암호화 통신이 검색되고 복호화될 수 없도록 보장한다.

- **encrypted communications recorded in the past**: 과거에 기록된 암호화 통신. 공격자가 미리 가로채 저장해둔 암호문.
- **cannot be retrieved and decrypted**: 검색·복호화 불가. 키가 유출돼도 그 키로 옛 트래픽을 못 풀어냄.

> should long-term secret keys or passwords be compromised in the future.

장기 비밀 키나 패스워드가 미래에 손상되더라도.

- **long-term secret keys**: 장기 비밀키. 서버의 인증서에 연결된 비밀키.
- **compromised in the future**: 미래에 손상. 서버 해킹, 양자컴퓨터 발전, 알고리즘 약점 발견 등.

> Not all web servers provide forward secrecy.

모든 웹서버가 forward secrecy를 제공하지는 않는다.

- **not all**: 모두는 아님. 구식 cipher suite를 쓰는 서버는 forward secrecy 없음.

---

**종합**

Forward secrecy의 핵심 시나리오:

```
2025년: 공격자가 사용자-서버 간 HTTPS 트래픽을 가로채 저장
        (암호문 상태라 당장은 못 읽음)

2030년: 공격자가 어떤 방법으로 서버 비밀키를 입수
        (해킹, 직원 매수, 양자컴퓨터 등)

forward secrecy 없으면:
  공격자가 그 비밀키로 2025년 트래픽 복호화 → 5년 전 비밀번호·메시지 모두 노출

forward secrecy 있으면:
  세션마다 새로운 일회성 키 사용 + 그 키는 어디에도 저장 안 됨
  서버 비밀키를 알아도 과거 세션 키를 역추정 불가능
  → 2025년 트래픽은 영원히 암호문으로 남음
```

Forward secrecy를 제공하는 키 교환 방식:

| 방식 | Forward Secrecy | 설명 |
|---|---|---|
| RSA Key Exchange (구식) | × | 서버 비밀키로 직접 세션 키 복호화. 비밀키 유출 시 과거 트래픽 풀림 |
| Diffie-Hellman Ephemeral (DHE) | ○ | 매번 일회성 키 쌍 생성. 비밀키와 무관 |
| Elliptic-curve Diffie-Hellman Ephemeral (ECDHE) | ○ | DHE의 ECC 버전. 더 빠르고 강력 |

Ephemeral의 의미: "일회성, 임시적". DHE/ECDHE의 "E"가 그것 — 매 세션마다 새 키 쌍을 생성하고 세션이 끝나면 폐기.

DHE/ECDHE의 동작 원리 (간단화):

```
양쪽이 비밀 난수를 각자 생성 (Alice의 a, Bob의 b)
양쪽이 (g^a mod p), (g^b mod p) 만 교환
각자 상대 값에 자기 비밀로 곱: g^(ab) — 이게 세션 키
공격자는 g^a, g^b를 봐도 g^(ab)를 못 계산 (이산 로그 문제)
세션 종료 후 a, b 폐기 → 키 영구 소실
```

세션 키가 양쪽 메모리에서만 잠깐 존재하고 디스크에 저장 안 되며, 세션 종료와 함께 소멸 — 미래에 누구도 복원 불가.

JS 개발자에게 의미:

```js
await fetch('https://example.com/api');
// TLS handshake 시 — 사용 cipher suite는 자동 협상
// 모던 환경: ECDHE-based suite (forward secrecy ○)
// 구식 환경: RSA-based suite (forward secrecy ×)
// DevTools Security 탭에서 cipher suite 확인 가능
```

Chrome DevTools에서 확인:

```
DevTools → Security 탭 (Lock 아이콘 옆) →
"Connection" 섹션에서 "Key exchange" 보기
- "ECDHE_RSA" 또는 "ECDHE_ECDSA" → forward secrecy 활성
- "RSA" → forward secrecy 없음 (취약)
```

TLS 1.3의 forward secrecy:

TLS 1.3은 forward secrecy 없는 cipher suite를 아예 표준에서 제거했습니다. 즉 — TLS 1.3을 쓰는 서버는 자동으로 forward secrecy 보장. 구식 RSA Key Exchange는 더 이상 사용 불가.

이게 없으면 어떻게 되는가:

- forward secrecy가 없다면 — 정부·기업이 모든 HTTPS 트래픽을 일단 가로채 저장해두고 — 미래에 키를 입수해 일괄 복호화 가능. 이를 "store now, decrypt later" 공격이라 함. 양자컴퓨터의 위협이 현실화되면서 더 중요해진 개념.
- 잘못된 직관: "지금 안전하면 미래에도 안전"은 forward secrecy 없는 환경에선 거짓. 비밀키 유출은 미래에 일어날 수 있는 사건이고, 한 번 유출되면 역사 전체가 노출.

오개념 예방: forward secrecy는 "지금 보내는 데이터가 안전"하다는 게 아니라 — "미래에 무슨 일이 있어도 과거 통신은 안전"하다는 보장입니다. 두 개의 다른 시간축에 대한 보호.

또 다른 오개념: "TLS 1.2도 forward secrecy 가능"은 맞지만 cipher suite 선택에 달림. ECDHE 기반을 쓰면 TLS 1.2도 forward secrecy 활성. 하지만 RSA Key Exchange를 fallback으로 두면 깨질 수 있어 — TLS 1.3이 더 안전한 이유. 구식 옵션 자체가 없음.

Official Annotation 보충: 2013년 기준 forward secrecy를 제공하는 유일한 방식은 Diffie-Hellman key exchange (DHE)와 Elliptic-curve Diffie-Hellman key exchange (ECDHE)였습니다. TLS 1.3(2018년 8월 발표)은 forward secrecy 없는 cipher들의 지원을 제거했습니다. 2023년 7월 기준 조사된 웹서버의 99.6%가 어떤 형태로든 forward secrecy를 지원하며, 75.2%가 대부분 브라우저에서 forward secrecy를 사용합니다.

AI Annotation 보충: forward secrecy가 없으면 — 공격자가 암호화된 트래픽을 녹화해두고, 나중에 서버 비밀키를 탈취하면 과거 통신을 전부 복호화할 수 있습니다. forward secrecy가 있으면 — 매 세션마다 고유한 일회성 키를 생성하므로, 장기 키가 유출되어도 과거 세션 키를 역추적할 수 없습니다. TLS 1.3은 FS 없는 cipher를 아예 제거하여, TLS 1.3을 사용하면 FS가 자동으로 보장됩니다.
