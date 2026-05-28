# Internet이란 무엇인가?

## 도입

우리가 매일 쓰는 인터넷은 하나의 거대한 네트워크처럼 느껴지지만, 사실은 수많은 네트워크들이 서로 연결된 "네트워크의 네트워크"다. OA는 이 점을 강조하며 인터넷의 본질을 정의한다.

---

## 본문

> The Internet is a vast network that connects many networks around the world.

"인터넷은 전 세계의 많은 네트워크를 연결하는 광대한 네트워크다."

- **vast**: 방대한. 인터넷은 단일 네트워크가 아니라 전 세계 통신사·기업·학교·가정 네트워크가 상호 연결된 복합체다.
- **connects many networks**: 인터넷의 핵심 정의. LAN·WAN·데이터센터 네트워크 등이 TCP/IP라는 공통 프로토콜을 써서 서로 연결된 것이다.

> If we only have one computer without internet connection, our capabilities are very limited.
> But if the computer is connected to another computer, many possibilities open up.
> Everything like web surfing becomes possible because computers can exchange data with each other.

"인터넷 연결 없이 컴퓨터 한 대만 있으면 할 수 있는 것이 매우 제한적이다. 그러나 컴퓨터가 다른 컴퓨터에 연결되면 많은 가능성이 열린다. 컴퓨터들이 서로 데이터를 교환할 수 있기 때문에 웹 서핑 같은 모든 것이 가능해진다."

- **exchange data with each other**: 네트워크가 만들어내는 가장 근본적인 능력. `fetch()`를 호출하는 순간 이 데이터 교환이 일어난다.

---

## 종합

인터넷은 전 세계 네트워크들이 TCP/IP라는 공통 언어로 연결된 구조다. 내 노트북이 카페 와이파이(LAN)에 연결되고, 그 LAN이 통신사(ISP)를 통해 더 큰 네트워크(WAN)에 연결되고, 그 WAN이 또 다른 WAN들과 연결되어 결국 지구 반대편 서버까지 닿는다. 인터넷은 "망들의 망(network of networks)"이다.

---

---

# LAN이란?

## 도입

네트워크를 규모로 분류하면 LAN과 WAN이 대표적이다. LAN은 가정·사무실·학교 같은 제한된 공간 안의 네트워크를 말한다. 공유기 하나가 만드는 와이파이 네트워크가 전형적인 LAN이다.

---

## 본문

> LAN is a Local area network.
> When classified by scale, it refers to small-scale networks such as homes, offices, and schools.

"LAN은 로컬 에어리어 네트워크(Local Area Network)다. 규모로 분류했을 때 가정, 사무실, 학교 같은 소규모 네트워크를 가리킨다."

- **Local area**: "로컬 지역" — 지리적으로 한정된 범위. 건물 한 동이나 캠퍼스 정도.
- **small-scale**: 소규모. 수십~수백 대 장치를 연결하는 수준이 일반적이다.

LAN의 주요 특성:
- 사설망을 구축해 연결한다 — 외부 네트워크에서는 직접 접근이 제한된다.
- 인터넷 공유기(게이트웨이)를 중심으로 사설망을 구성하고 다양한 기기를 연결한다.
- ISP(Internet Service Provider, KT·SKT·LGU+처럼 인터넷 접속 수단을 제공하는 사업자)를 통해 인터넷(WAN)과 연결된다.

```
LAN 구성 예시

[노트북] ──┐
[스마트폰] ─┤── [공유기] ── [ISP] ── [인터넷(WAN)]
[데스크탑] ─┘

  └─────── LAN (사설망) ──────┘
         192.168.0.x 대역
```

---

## 종합

LAN은 물리적으로 가까운 장치들이 사설 주소 공간을 공유하는 네트워크다. 같은 LAN 안의 장치끼리는 라우터를 거치지 않고 스위치만으로 통신할 수 있어 빠르고 안정적이다. LAN 밖으로 나가려면 공유기의 NAT을 거쳐 ISP의 네트워크로 진입해야 한다.

---

---

# WAN이란?

## 도입

LAN이 건물·캠퍼스 단위 소규모 네트워크라면, WAN은 도시·국가·대륙을 가로지르는 대규모 네트워크다. 인터넷 자체가 가장 큰 WAN이라고 볼 수 있다.

---

## 본문

> WAN is a wide area network.
> It refers to large-scale networks such as connections between countries or continents.

"WAN은 광역 네트워크(Wide Area Network)다. 국가 간 또는 대륙 간 연결 같은 대규모 네트워크를 가리킨다."

- **Wide area**: "광역" — LAN보다 훨씬 넓은 지리적 범위를 커버한다.
- **countries or continents**: 국가·대륙 단위. 해저 광케이블이 대륙 간 WAN의 물리적 인프라다.

WAN의 특성:
- 통신사(ISP·백본 사업자)가 운영하는 인프라를 사용한다.
- LAN보다 기본적으로 속도가 느리고 지연이 크다 (거리 때문).
- LAN보다 보안 위협에 더 많이 노출된다 (공공 인프라 경유).

---

## 종합

WAN은 LAN들을 서로 묶어주는 상위 구조다. 가정 공유기의 WAN 포트가 ISP 선과 연결되는 순간, 가정 LAN은 WAN(인터넷)에 합류한다. 서울과 뉴욕의 서버가 통신할 수 있는 것은 두 LAN 사이를 연결하는 수만 km의 WAN 인프라가 있기 때문이다.

---

---

# LAN과 WAN의 차이는?

## 도입

LAN과 WAN의 가장 직관적인 차이는 크기지만, 크기에서 파생된 속도와 보안 차이도 함께 이해해야 한다.

---

## 본문

> There are three differences: space, speed, safety.
> The LAN is a local area and the WAN is a wide area.
> LAN is faster than WAN by default.
> LAN is safer than WAN basically.

"세 가지 차이가 있다: 공간, 속도, 보안. LAN은 로컬 영역이고 WAN은 광역이다. LAN은 기본적으로 WAN보다 빠르다. LAN은 기본적으로 WAN보다 안전하다."

- **space (공간)**: LAN은 건물·캠퍼스 단위, WAN은 도시·국가·대륙 단위. 물리적 범위가 다르다.
- **faster by default**: LAN은 전용 케이블·스위치로 구성되고 홉 수가 적어 지연이 낮다. WAN은 여러 라우터·링크를 거치고 거리가 멀어 지연이 크다.
- **safer basically**: LAN은 물리적 접근이 제한된 사설망이라 외부 공격자가 직접 침입하기 어렵다. WAN은 공공 인프라를 경유하므로 암호화 없이는 도청·변조 위험이 있다.

```
LAN vs WAN 비교

                LAN                 WAN
규모          건물/캠퍼스 단위      도시/국가/대륙 단위
속도          빠름 (낮은 지연)      느림 (높은 지연)
보안          사설망, 접근 제한     공공 인프라, 위협 노출
대표 예       가정 와이파이         인터넷(ISP 네트워크)
장치          스위치, 공유기        라우터, 해저케이블
```

---

## 종합

LAN의 빠름과 안전함은 물리적 격리 덕분이고, WAN의 느림과 위험성은 공공 인프라를 쓰고 거리가 멀기 때문이다. 개발할 때 `localhost`(LAN 내 루프백)가 프로덕션 서버(WAN 경유)보다 압도적으로 빠른 이유가 여기 있다. HTTPS가 WAN에서 필수인 이유도 공공망 경유 시 도청 위험이 있기 때문이다.
