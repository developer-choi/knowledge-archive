# 처리량(Throughput)이란 무엇인가?

## 도입

네트워크의 "빠름"을 이야기할 때 흔히 "속도"라고 말하지만, 정확한 용어는 처리량(Throughput)이다. 처리량은 단위 시간에 실제로 전달된 데이터의 양이다. bps(bits per second)로 측정되며, 이론상 최대치와 실제 측정값이 다를 수 있다는 점이 핵심이다.

---

## 본문

> Network throughput (or just throughput, when in context) refers to the rate of message delivery over a communication channel in a communication network, such as Ethernet.

"네트워크 처리량은 이더넷 같은 통신 네트워크에서 통신 채널을 통해 메시지를 전달하는 속도(rate)를 뜻한다."

- **rate**: 단순한 속도(km/h처럼 거리/시간)가 아니라 단위 시간당 처리된 작업량(빈도)에 가까운 개념이다.
- **message**: OSI 7계층 중 애플리케이션 계층의 데이터 단위. `fetch()` 응답 본문처럼 사람이 보내려는 데이터 자체가 여기에 해당한다. 하위 계층으로 내려가면서 패킷(Packet)으로 잘게 쪼개진다.
- **communication channel**: 데이터가 흐르는 물리·논리적 경로. 이더넷 케이블, 와이파이 채널, 광섬유 등이 해당한다.

> The data that these messages contain may be delivered over physical or logical links, or through network nodes.
> Throughput is usually measured in bits per second (bps).

"메시지에 담긴 데이터는 물리 또는 논리 링크를 통해, 또는 네트워크 노드를 거쳐 전달될 수 있다. 처리량은 보통 초당 비트(bps)로 측정된다."

> The aggregate throughput is the sum of the data rates that are delivered over all channels in a network.

"집계 처리량은 네트워크 내 모든 채널에 걸쳐 전달된 데이터 속도의 합이다."

- **aggregate**: "합산된". 단일 채널이 100Mbps라도 여러 채널을 묶으면(Link Aggregation) 전체 처리량은 그 합만큼 늘어날 수 있다.

---

## 종합

처리량은 "실제로 전달된 데이터의 양"이다. 인터넷 요금제에서 "1Gbps 인터넷"이라고 하면 이론상 최대 처리량이 1Gbps라는 뜻이지, 실제로 항상 그 속도가 나온다는 보장이 아니다. 실제 처리량은 물리 매체의 한계·장비 성능·프로토콜 오버헤드에 의해 낮아진다 — 그 원인은 다음 질문에서 다룬다.

---

---

# 대역폭(Bandwidth)과 처리량(Throughput)을 비교하라

## 도입

Bandwidth와 Throughput은 자주 혼용되지만 의미가 다르다. Bandwidth는 "이론상 최대 전송 용량"이고, Throughput은 "실제로 처리된 양"이다. 최대 차선이 10개인 고속도로라도 실제로 통과하는 차 수가 그보다 적을 수 있는 것과 같다.

---

## 본문

> Throughput represents digital bandwidth consumption.

"처리량은 디지털 대역폭 소비량을 나타낸다."

- **represents**: 처리량은 대역폭의 "얼마나 쓰였는가"를 표현한다. 대역폭이 최대치라면 처리량은 실제로 사용된 부분이다.
- **digital bandwidth**: 데이터 전송에서의 대역폭. 물리학에서 주파수 범위를 뜻하는 대역폭과 구분하기 위해 "digital"을 붙인다.

```
Bandwidth vs Throughput

Bandwidth (이론 최대치)
├─────────────────────────────────────────┤ 1Gbps

Throughput (실제 사용량)
├─────────────────────────┤ 600Mbps
                          (나머지는 overhead, 장비 한계, 혼잡으로 손실)
```

고속도로 비유:
- **Bandwidth (도로 폭)**: 차선이 10개인 고속도로 — 이론상 최대 처리 가능량.
- **Throughput (처리량)**: 톨게이트를 실제로 통과한 자동차 수 — 사고, 혼잡, 도로 좁아짐 등에 따라 줄어든다.

---

## 종합

Bandwidth는 물리 매체나 계약 스펙이 정하는 상한선이고, Throughput은 그 상한선 안에서 실제로 달성된 값이다. 인터넷 속도 테스트(fast.com, speedtest.net)에서 측정하는 것이 Throughput이다. Bandwidth가 높다고 Throughput이 항상 높지는 않으며, 그 차이를 만드는 원인이 다음 질문의 주제다.

---

---

# 처리량이 낮아지는 원인은?

## 도입

처리량이 이론상 최대치(Bandwidth)만큼 나오지 않는 이유는 여러 층위에 걸쳐 있다. 물리적 매체부터 장비 성능, 사용자 행동, 프로토콜 오버헤드까지 — 이 중 하나라도 병목이 되면 전체 처리량이 깎인다.

---

## 본문

> The throughput of a communication system may be affected by various factors, including the limitations of the underlying physical medium, available processing power of the system components, end-user behavior, etc.

"통신 시스템의 처리량은 기반 물리 매체의 한계, 시스템 컴포넌트의 가용 처리 능력, 최종 사용자 행동 등 다양한 요인에 의해 영향을 받을 수 있다."

- **underlying physical medium**: 랜선의 품질·길이, 와이파이 신호 세기 등 물리적 제약. Cat5e 케이블과 Cat8 케이블은 지원 대역폭이 다르다.
- **available processing power**: 라우터·스위치의 CPU/ASIC 성능. 저가 공유기가 고속 회선에서도 처리량이 낮은 이유가 여기 있다.
- **end-user behavior**: 토렌트처럼 대역폭을 많이 쓰는 애플리케이션, 또는 여러 탭을 동시에 열어 병렬 다운로드하는 패턴.

> When taking various protocol overheads into account, the useful rate of the data transfer can be significantly lower than the maximum achievable throughput; the useful part is usually referred to as goodput.

"다양한 프로토콜 오버헤드를 고려하면, 실제 데이터 전송의 유용한 속도는 달성 가능한 최대 처리량보다 상당히 낮을 수 있으며, 이 유용한 부분을 보통 goodput이라고 한다."

- **protocol overheads**: HTTP 헤더, TCP 헤더, IP 헤더, 이더넷 헤더 등 데이터를 운반하는 데 필요하지만 실제 페이로드가 아닌 부분. 100MB 파일을 보내도 실제 전송 바이트는 더 많다.
- **goodput**: 사용자가 실제로 받는 "순수 페이로드" 속도. 프로토콜 헤더와 재전송·확인응답 트래픽을 제외한 진짜 유용한 데이터 전달 속도다. 택배 상자 무게를 제외한 내용물만의 무게에 비유할 수 있다.

```
처리량 구성

Bandwidth (물리 최대)
└── 실제 Throughput
    ├── Goodput (실제 페이로드)
    └── Protocol Overhead (헤더, ACK, 재전송 등)
```

---

## 종합

처리량이 낮을 때 원인을 찾으려면 계층별로 체크해야 한다. 물리 매체에서 시작해 장비 처리 능력, 네트워크 혼잡, 프로토콜 오버헤드까지 각 층이 모두 잠재적 병목이다. DevTools Network 탭에서 "Content Download" 시간이 예상보다 길면 goodput 문제이고, "Waiting (TTFB)"가 길면 서버·라우팅 문제일 가능성이 높다.

---

---

# Latency(지연시간)란?

## 도입

처리량이 "얼마나 많이"를 표현한다면, Latency는 "얼마나 빨리"를 표현한다. 두 가지 정의가 함께 쓰인다 — 요청 처리에 걸리는 시간, 그리고 두 장치 사이 왕복 시간. 네트워크 체감 성능에 큰 영향을 미치는 지표다.

---

## 본문

> The time it takes for a request to be processed.
> The time it takes for a message to travel round trip between two devices.

"요청이 처리되는 데 걸리는 시간. 두 장치 사이에 메시지가 왕복하는 데 걸리는 시간."

첫 번째 정의는 서버가 요청을 받아서 응답을 완성하는 처리 시간 관점이고, 두 번째는 클라이언트-서버 사이 왕복 시간(RTT, Round-Trip Time) 관점이다. DevTools의 Timing 패널에서 두 관점이 합쳐져 나타난다.

지연시간에 영향을 주는 세 요인:
- **Transmission Media (전송 매체)**: 광섬유 < 동축케이블 < 무선. 매체마다 신호 전파 속도가 다르다.
- **패킷 크기**: 패킷이 크면 전송(serialization)에 더 긴 시간이 걸린다.
- **라우터의 패킷 처리 시간**: 각 홉(hop)에서 라우터가 패킷 헤더를 읽고 다음 포트로 내보내는 데 시간이 소요된다.
- **두 장치 사이 거리**: 물리적 거리가 멀수록 전파 지연(propagation delay)이 늘어난다.

```
Latency 구성 요소

[클라이언트] → [라우터1] → [라우터2] → [서버]
     ↑                                      ↓
     └──────── RTT (왕복 시간) ─────────────┘

각 구간:
- 전파 지연 (propagation delay): 거리에 비례
- 전송 지연 (transmission delay): 패킷 크기 / 링크 속도
- 처리 지연 (processing delay): 라우터 패킷 처리 시간
- 큐잉 지연 (queuing delay): 라우터 혼잡 시 대기 시간
```

---

## 종합

처리량(Throughput)이 높아도 Latency가 크면 사용자 체감이 나쁘다. 예를 들어 대용량 파일 다운로드는 Throughput이 중요하지만, 실시간 게임이나 WebSocket 통신은 Latency가 핵심 지표다. CDN이 엣지 서버를 사용자 가까이 두는 이유도 바로 전파 거리를 줄여 Latency를 낮추기 위해서다. `fetch()`가 느릴 때 DevTools의 Timing 탭에서 어느 단계에 시간이 몰려 있는지 보면 Latency의 원인 구간을 좁힐 수 있다.
