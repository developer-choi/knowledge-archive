---
tags: [network, performance, throughput, bandwidth]
---

# Questions
- [What’s the throughput?](#whats-the-throughput)
- [Please compare Bandwidth and Throughput.](#please-compare-bandwidth-and-throughput)
- [What causes low throughput?](#what-causes-low-throughput)
- [(번외) 왜 하필 번역이 '처리량'일까?](#번외-왜-하필-번역이-처리량일까)

---

# Answers

## What’s the throughput?
### Keywords
rate of message, communication channel, bits per second

### Official Answer
Network throughput (or just throughput, when in context) refers to the rate of message delivery over a [communication channel](https://en.wikipedia.org/wiki/Communication_channel) in a [communication network](https://en.wikipedia.org/wiki/Communication_network), such as [Ethernet](https://en.wikipedia.org/wiki/Ethernet).

The data that these messages contain may be delivered over physical or logical links, or through [network nodes](https://en.wikipedia.org/wiki/Network_nodes). Throughput is usually measured in [bits per second](https://en.wikipedia.org/wiki/Bits_per_second) (bps). The aggregate throughput is the sum of the data rates that are delivered over all channels in a network.

> AI Annotation: 
> - **Rate vs Speed**: 여기서 Rate는 단순한 속도(km/h)라기보다는 단위 시간당 처리되는 일의 양(빈도)에 가깝습니다.
> - **Message vs Packet**: 네트워크 통신은 계층 구조(OSI 7 Layer)로 이루어집니다. 가장 상위 계층인 Application Layer에서의 데이터 단위를 Message라고 하며, 이것이 하위 계층으로 내려가며 잘게 쪼개진 조각들을 Packet이라고 합니다.
> - **Aggregate Throughput**: 단일 채널이 100Mbps라도, 여러 채널을 묶어서(Link Aggregation) 동시에 쓰면 전체 처리량은 그 합만큼 늘어날 수 있습니다.

> User Annotation: 처리량이라는 단어가 와닿지 않으면 '데이터 이동량'이나 '작업 완료 속도'로 이해해도 무방할 듯.

### Reference
- [Network throughput - Wikipedia](https://en.wikipedia.org/wiki/Network_throughput)
- [Bits per second - Wikipedia](https://en.wikipedia.org/wiki/Bits_per_second)

---

## Please compare Bandwidth and Throughput.
### Keywords
digital bandwidth consumption

### Official Answer
Throughput represents [digital bandwidth](https://en.wikipedia.org/wiki/Bandwidth_(computing)) consumption.

> AI Annotation: **고속도로 톨게이트 비유**로 이해하면 쉽습니다.
> - **Bandwidth (도로 폭)**: 차선이 10개인 고속도로 (이론상 최대치).
> - **Throughput (처리량)**: 실제로 톨게이트를 통과한 자동차 수. 차가 아무리 많아도 사고가 나거나 도로가 좁아지면(Processing이 늦어지면) 실제 통과하는 차의 양은 줄어듭니다.
> 즉, Throughput은 단순히 지나간 양이 아니라, 시스템이 감당해낸(처리해낸) 결과물이라는 뉘앙스가 강합니다.

### Reference
- [Bandwidth (computing) - Wikipedia](https://en.wikipedia.org/wiki/Bandwidth_(computing))

---

## What causes low throughput?
### Keywords
physical medium, processing power, end-user behavior, goodput

### Official Answer
The throughput of a communication system may be affected by various factors, including the limitations of the underlying physical medium, available processing power of the system components, [end-user](https://en.wikipedia.org/wiki/End-user) behavior, etc.

When taking various [protocol overheads](https://en.wikipedia.org/wiki/Protocol_overhead) into account, the useful rate of the data transfer can be significantly lower than the maximum achievable throughput; the useful part is usually referred to as [goodput](https://en.wikipedia.org/wiki/Goodput).

> AI Annotation: 처리량이 이론상 최대치만큼 나오지 않는 이유들입니다.
> - **Physical medium**: 랜선이 낡았거나 물리적 한계가 있는 경우.
> - **Processing power**: 라우터나 장비의 CPU 성능이 낮아 패킷 처리가 늦어지는 경우.
> - **End-user behavior**: 사용자가 토렌트 등 과도한 트래픽을 유발하는 경우.
> - **Goodput**: 데이터 전송 시 헤더(Header) 등 부가 정보를 제외하고, 실제 사용자가 받는 '순수 데이터'의 속도를 의미합니다. (택배 상자 무게를 뺀 내용물만의 무게와 같음)

### Reference
- [Goodput - Wikipedia](https://en.wikipedia.org/wiki/Goodput)
- [(Legacy) Network Overview](https://docs.google.com/document/d/1iGVkhRpG4RBhbpmI-AkHjRnOE8r7JyfyIxfjZH4UHCI/edit?tab=t.0#heading=h.oulolko7jpu0)

---

## (번외) 왜 하필 번역이 '처리량'일까?
### Keywords
Throughput, Morphemic Analysis

> AI Annotation: **어원 분석 (LBL)**
> - **Through** (통과하여) + **Put** (놓다, 투입하다) = 시스템 내부의 과정을 거쳐 결과물로 변환되어 나온 총량.
> - **Hardware View**: 데이터는 단순히 흐르는 것이 아니라, 장비(라우터 등)가 매 순간 **패킷 분석(Parsing), 경로 계산(Routing), 에러 검사(Checksum), 다시 포장해서 보냄(Forwarding)** 등의 작업을 수행해야 합니다. 이 모든 과정이 CPU와 메모리를 쓰는 '일(Work/Process)'이기에 '처리해서(Through) 내보낸 양(Put)'이라는 의미에서 **처리량**으로 번역된 것입니다.
