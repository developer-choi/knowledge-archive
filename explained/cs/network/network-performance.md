# 처리량(Throughput)이란 무엇인가?

> Network throughput (or just throughput, when in context) refers to the rate of message delivery over a communication channel in a communication network, such as Ethernet.
>
> The data that these messages contain may be delivered over physical or logical links, or through network nodes.
> Throughput is usually measured in bits per second (bps).
> The aggregate throughput is the sum of the data rates that are delivered over all channels in a network.

---

**도입**

"이 회선 100Mbps야"라는 말과 "지금 50Mbps 나와"라는 말은 같은 단어("Mbps")를 쓰지만 다른 것을 가리킵니다. 앞은 회선의 이론상 폭, 뒤는 실제로 처리되고 있는 양 — 후자가 throughput입니다. 단순한 속도가 아니라 **단위 시간당 실제 처리된 양**이라는 점이 핵심입니다.

---

**본문**

> Network throughput (or just throughput, when in context) refers to the rate of message delivery over a communication channel in a communication network, such as Ethernet.

네트워크 처리량(또는 문맥상 throughput)은 통신 네트워크의 통신 채널 위에서 일어나는 메시지 전달의 비율(rate)을 가리킨다 — 이더넷 같은.

- **rate of message delivery**: 메시지 전달의 비율(rate). 단순한 속도(speed)가 아니라 단위 시간당 처리된 일의 양에 가까움. "100m/s"보다 "초당 메시지 N개"의 뉘앙스.
- **communication channel**: 통신 채널. 데이터가 흐르는 통로 — 케이블, Wi-Fi 신호 같은 매체.
- **communication network**: 통신 네트워크. 채널들이 모여 만든 더 큰 시스템.
- **such as Ethernet**: 예시. 가정·사무실 LAN의 대표 기술.

> The data that these messages contain may be delivered over physical or logical links, or through network nodes.

이 메시지들이 담은 데이터는 물리적 또는 논리적 링크를 통해, 또는 네트워크 노드들을 통해 전달될 수 있다.

- **physical or logical links**: 물리 링크(실제 케이블)와 논리 링크(VPN 터널·VLAN 같은 가상 경로) 둘 다 포함.
- **through network nodes**: 라우터·스위치 같은 노드들을 거쳐서. throughput은 한 구간만이 아니라 노드를 거치는 흐름 전체를 측정할 수 있음.

> Throughput is usually measured in bits per second (bps).

처리량은 보통 초당 비트(bps)로 측정된다.

- **bits per second (bps)**: 초당 몇 비트가 처리되었는가. Mbps(메가비피에스), Gbps(기가비피에스) 같은 단위가 여기서 파생.

> The aggregate throughput is the sum of the data rates that are delivered over all channels in a network.

집계 처리량(aggregate throughput)은 네트워크의 모든 채널에서 전달된 데이터 비율의 합이다.

- **aggregate throughput**: 여러 채널을 묶어 잰 전체 처리량. 단일 채널이 100Mbps라도 4개를 묶으면(link aggregation) 집계 처리량은 400Mbps에 근접할 수 있음.

---

**종합**

throughput을 다른 비슷한 개념과 구분하면:

| 용어 | 의미 | 단위 |
|---|---|---|
| Bandwidth (대역폭) | 이론상 최대 전송 능력 | bps (예: 100Mbps 회선) |
| Throughput (처리량) | 실제로 처리된 양 | bps (예: 그 회선에서 지금 50Mbps 나옴) |
| Goodput | 헤더·재전송 등 부가 비용 뺀 순 데이터량 | bps (예: 그 50Mbps 중 사용자 데이터는 45Mbps) |
| Latency (지연시간) | 한 메시지가 갔다 오는 시간 | ms |

브라우저 개발자가 throughput을 직접 보는 곳:
- Chrome DevTools Network 탭에서 한 응답을 클릭하면 Timing → "Content Download" 시간이 보입니다. 큰 파일을 다운로드하는 동안 평균 throughput을 가늠할 수 있음.
- DevTools 우측 상단의 Network throttling으로 "Slow 3G" 같은 옵션을 켜면 throughput을 인위로 낮춰 저속 환경을 시뮬레이션할 수 있습니다 — 모바일 사용자 체감 시간 측정에 유용.
- 큰 번들을 처음 로드할 때 사용자가 느끼는 "느림"은 보통 latency(첫 응답까지 걸리는 시간)와 throughput(전체 다운로드 시간) 둘이 합쳐진 결과입니다.

오개념 예방 — "Mbps가 곧 속도"라는 단순화:
- "내 회선이 100Mbps인데 다운로드가 60Mbps밖에 안 나와"는 정상일 수 있습니다. Bandwidth(이론상 100)와 Throughput(실측 60)은 다른 개념이고, 둘 사이에는 매체 한계·장비 처리 능력·다른 사용자 트래픽 등 여러 손실이 있습니다.
- "rate"라는 단어가 단순 속도가 아니라 "단위 시간당 처리량"이라는 빈도 개념이라는 점이 throughput 이해의 시작.

User Annotation 보충 — "처리량이라는 단어가 와닿지 않으면 '데이터 이동량'이나 '작업 완료 속도'로 이해해도 무방하다"는 정확한 직관입니다. 영어 "throughput"의 어원도 **through(통과해서) + put(놓다)** — 시스템을 통과해 내보낸 양이라는 뜻이니, 한국어 "처리량"이 이 뉘앙스를 잘 잡았습니다.

이게 없으면 어떻게 되는가: throughput 개념 없이 bandwidth만 놓고 시스템을 평가하면 "100Mbps 회선이니 서비스가 100Mbps로 동작해야 한다"는 잘못된 기대가 생깁니다. 실제로는 라우터·CPU·디스크 I/O·다른 프로세스 등 어디서든 병목이 생겨 throughput이 그보다 한참 낮을 수 있습니다. throughput은 시스템의 **실제 능력**을 측정하는 단위이고, bandwidth는 그 상한선입니다.

---

# 대역폭(Bandwidth)과 처리량(Throughput)을 비교하라

> Throughput represents digital bandwidth consumption.

---

**도입**

ISP 광고에서 "1Gbps"라고 부르는 그 숫자가 bandwidth, Chrome DevTools에서 다운로드 진행 중에 보이는 그 속도가 throughput입니다. 둘 다 같은 단위(Mbps·Gbps)를 쓰지만 가리키는 대상이 다릅니다. 앞은 **회선의 폭**, 뒤는 **실제로 채워지고 있는 양**.

---

**본문**

> Throughput represents digital bandwidth consumption.

처리량은 디지털 대역폭의 소비량을 나타낸다.

- **represents**: 나타낸다. throughput이라는 측정값이 의미하는 것은 "bandwidth라는 자원의 소비량".
- **digital bandwidth**: 디지털 회선의 대역폭. 단위 시간당 보낼 수 있는 비트 수의 이론적 최대치.
- **consumption**: 소비. 즉 throughput = 그 회선에서 **실제로 사용된** 정도. 빈 회선이라면 throughput은 0이고, 회선을 가득 채우면 throughput이 bandwidth에 근접.

---

**종합**

가장 직관적인 비유는 **고속도로 톨게이트**입니다:

| 요소 | bandwidth | throughput |
|---|---|---|
| 비유 | 차선이 10개인 고속도로의 폭 | 실제로 톨게이트를 통과한 자동차 수 |
| 의미 | 이론상 최대 처리 가능량 | 그 시점에 실제 처리된 양 |
| 예시 | 1Gbps 회선 (이론상 한도) | 그 회선에서 지금 600Mbps 나옴 |
| 변하는가 | 회선 자체를 바꾸지 않으면 고정 | 시점·부하·간섭에 따라 매번 다름 |

차가 아무리 많아도 사고가 나거나 톨게이트 처리가 늦어지면 실제 통과량은 차선 수보다 훨씬 적습니다. 마찬가지로 1Gbps 회선이라도 라우터 CPU 한계·다른 트래픽·재전송·매체 노이즈 등으로 throughput은 1Gbps보다 낮을 수밖에 없습니다.

브라우저 개발자가 매일 마주치는 두 값:
- **Bandwidth**: ISP 약정 속도(1Gbps), 사무실 회선 등급, 모바일 5G의 이론 속도 — 이 숫자는 **마케팅·계약**의 영역.
- **Throughput**: Chrome DevTools Network 탭에서 큰 파일이 다운로드될 때 보이는 실측 속도, `speedtest.net`에서 측정되는 숫자 — 이 숫자가 **실제 사용자 체감**의 영역.

DevTools에서 큰 이미지나 번들을 다운로드할 때 Timing → Content Download 시간을 파일 크기로 나누면 그 요청의 throughput을 구할 수 있습니다. 회선이 1Gbps라도 그 한 요청에서 50Mbps만 나왔다면 — 서버 CPU·디스크·중간 라우터·동시 연결 어딘가에 병목이 있다는 신호입니다.

오개념 예방: "Bandwidth = 속도, Throughput = 다른 개념"이 아니라 "Bandwidth = 상한선, Throughput = 실측치"입니다. 두 값은 **같은 단위**(bps)를 공유하며 서로 같은 차원의 양을 가리킵니다. 단지 한쪽은 회선이 줄 수 있는 최대치이고, 다른 쪽은 그 회선에서 실제로 흘러간 양일 뿐.

throughput이 bandwidth에 가까울수록 회선을 효율적으로 쓰고 있다는 뜻이고, 큰 격차가 있다면 어딘가 비효율(헤더 오버헤드, 재전송, 처리 병목)이 있다는 신호입니다. 그래서 네트워크 튜닝의 목표는 종종 "throughput / bandwidth 비율을 높이는 것"으로 표현됩니다.

이게 없으면 어떻게 되는가: 두 개념을 구분하지 않으면 회선 업그레이드(bandwidth ↑)가 곧 성능 향상(throughput ↑)이라고 단순 가정하게 됩니다. 실제로는 회선이 100Mbps → 1Gbps로 10배 늘어도 서버 CPU가 병목이면 throughput은 거의 안 늘어납니다. 두 개념을 분리해두기 때문에 "대역폭은 충분한데 throughput이 안 나온다 → 다른 곳이 병목"이라는 진단이 가능해집니다.

---

# 처리량이 낮아지는 원인은?

> The throughput of a communication system may be affected by various factors, including the limitations of the underlying physical medium, available processing power of the system components, end-user behavior, etc.
>
> When taking various protocol overheads into account, the useful rate of the data transfer can be significantly lower than the maximum achievable throughput; the useful part is usually referred to as goodput.

---

**도입**

회선이 1Gbps인데 실측이 600Mbps밖에 안 나오는 경우가 흔합니다. 이 격차는 어디서 오는지 — 이 질문이 다루는 내용입니다. 원인은 한두 개가 아니라 물리·장비·사용자 행동·프로토콜 오버헤드까지 여러 층에서 누적됩니다. 그래서 throughput 튜닝은 여러 곳을 동시에 봐야 합니다.

---

**본문**

> The throughput of a communication system may be affected by various factors,

통신 시스템의 처리량은 여러 요소에 영향을 받을 수 있다.

- **various factors**: "여러 요소". 한 가지 원인이 아니라 여러 원인이 동시에 작용함을 미리 못 박는 표현.
- **may be affected**: "영향받을 수 있다" — 항상 그렇다는 게 아니라 가능성. 환경에 따라 어떤 요인이 지배적인지 다름.

> including the limitations of the underlying physical medium,

기반이 되는 물리 매체의 한계를 포함하여,

- **underlying physical medium**: 신호가 실제로 흐르는 물리 매체 — 구리 케이블, 광섬유, 무선 주파수.
- **limitations**: 매체 자체의 한계. 오래된 랜선의 노화, Cat5 케이블의 1Gbps 한계, Wi-Fi 신호 간섭 같은 것.

> available processing power of the system components,

시스템 구성요소의 가용 처리 능력,

- **processing power**: 처리 능력. 라우터·스위치·서버 CPU의 성능.
- **system components**: 시스템 구성요소. 송신자·수신자뿐 아니라 중간의 라우터·스위치도 포함. 한 곳만 느려도 전체 throughput이 그 수준으로 끌려내려갑니다 (가장 약한 고리).

> end-user behavior, etc.

최종 사용자 행동 등.

- **end-user behavior**: 사용자가 어떻게 회선을 쓰는가. 토렌트·대용량 다운로드 같은 활동이 다른 사용자의 throughput을 끌어내림.

> When taking various protocol overheads into account, the useful rate of the data transfer can be significantly lower than the maximum achievable throughput;

여러 프로토콜 오버헤드를 고려하면, 데이터 전송의 유용한 비율은 달성 가능한 최대 처리량보다 상당히 낮을 수 있다.

- **protocol overheads**: 프로토콜 오버헤드 — 헤더·재전송·확인 응답 등 사용자 데이터가 아닌 부가 정보. TCP/IP 헤더만 해도 패킷마다 수십 바이트.
- **useful rate**: "유용한" 비율. 사용자가 실제로 받는 데이터의 양만 세는 것.
- **significantly lower**: 상당히 낮음. 헤더 오버헤드가 작은 것 같지만 누적되면 측정 가능한 수준의 격차를 만듭니다.

> the useful part is usually referred to as goodput.

유용한 부분을 보통 goodput이라 부른다.

- **goodput**: throughput에서 헤더·재전송 같은 비효율을 뺀 순수 데이터 전송 속도. 사용자가 체감하는 진짜 속도.

---

**종합**

throughput이 떨어지는 원인을 층별로 정리하면:

| 층위 | 원인 | 구체적 예 | 해결 방향 |
|---|---|---|---|
| 물리 | 매체 한계 | 낡은 랜선, Wi-Fi 간섭, 광섬유 휨 | 매체 교체·간섭원 제거 |
| 장비 | 처리 능력 | 라우터 CPU 100%, 스위치 처리 한도 | 장비 업그레이드 |
| 사용자 | 행동 | 토렌트, 대용량 백업, 동시 스트리밍 | QoS 정책, 대역 분리 |
| 프로토콜 | 오버헤드 | TCP 헤더, 재전송, 확인 응답 | 더 효율적인 프로토콜(HTTP/2, QUIC) |

브라우저 개발자가 매일 마주치는 사례:
- 같은 페이지가 사무실 Wi-Fi에서는 빠른데 카페 Wi-Fi에서는 느림 → 매체·간섭 또는 ISP 회선 차이.
- 큰 webpack 번들 다운로드 시 Chrome DevTools Network 탭에서 Time이 들쑥날쑥 → 서버·CDN 처리 능력 또는 다른 사용자 트래픽.
- HTTP/1.1보다 HTTP/2·HTTP/3로 전환하면 같은 회선에서도 throughput이 개선 → 프로토콜 오버헤드 감소.

**Goodput**의 직관적 예: 1MB 파일을 다운로드받는데 TCP/IP 헤더 오버헤드까지 합쳐 1.05MB가 흘렀다면, 회선 throughput은 1.05MB/s지만 goodput은 1MB/s. 택배에서 "택배상자(헤더)를 뺀 내용물(사용자 데이터)만의 무게"를 재는 것과 같은 발상.

오개념 예방: "throughput이 낮으면 회선을 늘려라"는 단순한 처방은 자주 빗나갑니다. 회선(bandwidth)이 충분한데 throughput이 안 나오면 문제는 라우터 CPU·서버 처리 능력·프로토콜 효율 같은 다른 곳에 있을 가능성이 큽니다. 그래서 진단의 첫 단계는 "어느 층에서 막히는가"를 가리는 것입니다.

이게 없으면 어떻게 되는가: 모든 throughput 문제를 회선 탓으로 돌리면 비싸게 회선만 늘리고도 효과가 없는 경우가 흔합니다. 원인을 물리·장비·사용자·프로토콜로 나눠 진단하는 프레임이 있어야 — 예를 들어 사무실 인터넷이 느릴 때 ISP 탓인지(물리), 사내 라우터 한계인지(장비), 동료가 큰 파일 받는 중인지(사용자), 오래된 HTTP/1.1 서버 탓인지(프로토콜)를 가려낼 수 있습니다.

```
            [Throughput 저하 원인 -- 4개 층위]

   throughput 낮음
         |
         +-- 물리 (Physical)
         |     +-- 낡은 랜선 (Cat5의 1Gbps 한계)
         |     +-- Wi-Fi 신호 간섭 / 거리
         |     +-- 광섬유 휨 / 노이즈
         |
         +-- 장비 (System Components)
         |     +-- 라우터 CPU 100%
         |     +-- 스위치 처리 한도 초과
         |     +-- 서버 CPU / 디스크 I/O 병목
         |
         +-- 사용자 행동 (End-user Behavior)
         |     +-- 토렌트 / 대용량 백업
         |     +-- 동시 스트리밍
         |     +-- 다른 사용자의 트래픽 점유
         |
         +-- 프로토콜 오버헤드 (Protocol)
               +-- TCP/IP 헤더
               +-- 재전송 / ACK
               +-- HTTP/1.1의 직렬 처리
                   (HTTP/2, QUIC으로 완화 가능)

   가장 약한 고리 하나가 전체 throughput을 끌어내린다.
   진단의 첫 단계는 "어느 층에서 막히는가"를 가리는 것.
```
