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
