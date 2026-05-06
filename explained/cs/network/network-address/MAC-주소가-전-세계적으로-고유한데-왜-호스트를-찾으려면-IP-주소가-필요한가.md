# MAC 주소가 전 세계적으로 고유한데 왜 호스트를 찾으려면 IP 주소가 필요한가?

> An IP address serves two principal functions: it identifies the host, or more specifically, its network interface, and it provides the location of the host in the network, and thus, the capability of establishing a path to that host.

---

**도입**

"MAC이 전 세계 유일하다면 그 MAC만 보고 어디로든 보낼 수 있어야 하는 거 아닌가?"는 자연스러운 질문입니다. 하지만 답은 No — **유일성과 위치 지정은 다른 문제**입니다. 주민등록번호가 전국에서 유일해도 그 번호만으로 그 사람 집을 찾아갈 수 없는 것과 같은 원리입니다.

---

**본문**

> An IP address serves two principal functions:

IP 주소는 두 가지 주요 기능을 한다.

- **two principal functions**: "두 가지"라고 못 박는 점. 식별 하나로 끝나지 않습니다.

> it identifies the host, or more specifically, its network interface,

호스트를(더 정확히는 그 네트워크 인터페이스를) 식별하고,

- **identifies**: 식별. "이 인터페이스가 누구냐"를 가리킨다 — 이건 MAC도 합니다.
- **more specifically, its network interface**: 한 host에 인터페이스가 여러 개면 IP도 여러 개. IP가 붙는 건 host가 아니라 인터페이스.

> and it provides the location of the host in the network,

네트워크 안에서 호스트의 위치를 제공하며,

- **provides the location**: **위치**를 제공한다는 게 IP만의 특기. MAC에는 이 능력이 없습니다.
- **in the network**: 네트워크 안의 위치 — 어느 서브넷에 속하는지가 IP 주소 자체에 인코딩되어 있습니다.

> and thus, the capability of establishing a path to that host.

따라서 그 호스트로 가는 경로를 수립할 능력을 제공한다.

- **establishing a path**: 경로 수립. 라우터가 "여기로 가려면 다음 hop은 저쪽이고, 그 다음은 또 저쪽"이라는 일련의 단계를 만들어낼 수 있게 됩니다.
- **thus**: 위치를 알기 때문에 경로를 만들 수 있다 — 인과관계가 명시됨. 위치 정보 없이는 경로 계산이 불가능.

---

**종합**

MAC과 IP의 본질적 차이는 주소 체계의 형식에 있습니다:

| | MAC 주소 | IP 주소 |
|---|---|---|
| 주소 체계 | flat addressing (평면) | hierarchical addressing (계층) |
| 위치 정보 | 없음 (제조사별 영역만) | 네트워크 프리픽스에 인코딩 |
| 경로 계산 | 불가능 | 가능 |
| 비유 | 주민등록번호 | 시→구→동→번지 집 주소 |

주민번호와 집 주소 비유가 가장 직관적입니다:
- 주민번호(MAC)는 5천만 명에서 유일하지만, 그 번호만 보고는 그 사람이 어디 사는지 알 수 없습니다 — 5천만 명 전부에게 "당신 번호 OOO입니까?" 물어봐야 합니다 (flat addressing의 한계).
- 집 주소(IP)는 "서울 → 강남구 → 역삼동 → 123-4번지"처럼 계층적이라, 우체부가 "강남구"까지만 보고 다음 배송지점을 결정할 수 있습니다 (hierarchical addressing의 효율).
- ARP는 "이 집(IP)에 사는 사람 주민번호(MAC) 뭐예요?"를 동네에 방송해 묻는 행위와 같습니다 — 동네(같은 LAN) 안에서만 통합니다.

브라우저 개발자가 `fetch('https://api.example.com/users')`를 호출했을 때 일어나는 일을 라우팅 관점에서 보면:
1. DNS가 도메인 → IP(`203.0.113.42`)로 변환
2. 노트북은 IP의 네트워크 프리픽스를 보고 "내 LAN 밖이네"라고 판단 → 게이트웨이로 보냄
3. 게이트웨이(공유기) → ISP 라우터 → 백본 라우터들이 IP의 앞부분(prefix)만 비교하며 다음 hop을 정함
4. 목적지 LAN 도착 후 마지막에 ARP로 MAC 변환

이 모든 hop마다 라우터들이 들고 있는 라우팅 테이블 entry가 prefix 단위라서 50억 호스트가 아니라 수십만 prefix 단위로 관리됩니다. 만약 MAC처럼 flat이었다면 라우터마다 50억 entry짜리 테이블이 필요했을 것이고, 그건 물리적으로 불가능합니다.

오개념 예방: "전 세계에서 유일하면 식별이 끝난 거 아닌가?"라는 직관에 빠지기 쉽지만, 통신은 식별만으로 안 됩니다 — **위치를 알아야 갈 수 있습니다**. MAC은 "이 사람이 누구다"는 알지만 "이 사람이 어디 있다"를 모르고, IP는 둘 다 합니다. 그래서 인터넷 라우팅은 IP가 담당하고 MAC은 마지막 한 홉의 인도 작업만 맡습니다.

이게 없으면 어떻게 되는가: 만약 IP 없이 MAC만으로 인터넷을 운영한다면, 모든 라우터가 전 세계 모든 NIC의 MAC을 들고 있어야 합니다. 새 장치가 출시될 때마다 그 MAC을 전 세계 라우터 테이블에 추가해야 하고, MAC 자체에 위치 정보가 없으니 어디로 보낼지 매번 brute force로 묻는 수밖에 없습니다. IP의 계층 주소는 이 모든 부담을 "prefix 단위 집계"로 해결합니다.
