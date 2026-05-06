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
