# HTTP/1.1의 파이프라이닝은 어떤 최적화를 시도했고, 왜 실패했는가?

> HTTP/1.1 added also HTTP pipelining in order to further reduce lag time when using persistent connections by allowing clients to send multiple requests before waiting for each response.
> This optimization was never considered really safe because a few web servers and many proxy servers, specially transparent proxy servers placed in Internet / Intranets between clients and servers, did not handle pipelined requests properly (they served only the first request discarding the others, they closed the connection because they saw more data after the first request or some proxies even returned responses out of order etc.).
> Because of this, only HEAD and some GET requests could be pipelined in a safe and idempotent mode.
> After many years of struggling with the problems introduced by enabling pipelining, this feature was first disabled and then removed from most browsers also because of the announced adoption of HTTP/2.

---

**도입**

keep-alive로 연결은 재사용했지만 여전히 "한 요청 보내고 응답 기다린 뒤 다음 요청"이었습니다. 응답이 오기를 기다리는 시간이 아까웠죠. 파이프라이닝은 "응답 안 기다리고 요청을 연달아 보내기"라는 자연스러운 다음 단계 최적화였지만, 결국 실패했습니다. 좋은 아이디어가 현실의 호환성 문제로 실패한 사례입니다.

---

**본문**

> HTTP/1.1 added also HTTP pipelining in order to further reduce lag time when using persistent connections by allowing clients to send multiple requests before waiting for each response.

HTTP/1.1은 영속 연결 사용 시 지연을 더 줄이기 위해, 클라이언트가 각 응답을 기다리지 않고도 여러 요청을 보낼 수 있도록 HTTP 파이프라이닝을 추가했다.

- **pipelining**: 파이프(관)에 여러 요청을 한 번에 흘려보내는 그림. 응답이 오기 전에 다음 요청이 이미 출발해 있는 상태.
- **further reduce lag time**: keep-alive가 줄여준 지연을 더 줄이는 게 목표. RTT가 100ms이고 요청 10개가 있으면 순차 처리는 1000ms, 파이프라이닝은 이론상 100ms+α.
- **before waiting for each response**: 응답을 기다리지 않고 요청을 연달아 보냄. 단, 응답은 요청 순서대로 와야 합니다 — 이게 중요한 제약.

> This optimization was never considered really safe because a few web servers and many proxy servers, specially transparent proxy servers placed in Internet / Intranets between clients and servers, did not handle pipelined requests properly

이 최적화는 결코 충분히 안전하다고 여겨지지 않았는데, 왜냐하면 일부 웹 서버와 많은 프록시 서버 — 특히 인터넷/인트라넷에서 클라이언트와 서버 사이에 위치한 transparent 프록시 — 가 파이프라이닝된 요청을 제대로 처리하지 못했기 때문이다.

- **never considered really safe**: 표준에는 들어갔지만 실무에서 신뢰할 수 없었습니다.
- **transparent proxy servers**: 클라이언트가 자기가 프록시를 거치는지 모르는 채로 통과하는 프록시. ISP가 캐시용으로 두는 경우가 많아 회피 불가능.
- **placed in Internet / Intranets**: 인터넷 곳곳, 회사 내부망 곳곳. 어디에 있는지 클라이언트는 모릅니다.
- **did not handle properly**: 파이프라이닝은 표준 스펙은 있었지만 많은 구현체가 이를 따르지 않거나 버그가 있었습니다.

> (they served only the first request discarding the others, they closed the connection because they saw more data after the first request or some proxies even returned responses out of order etc.).

(첫 요청만 처리하고 나머지를 버리거나, 첫 요청 뒤에 추가 데이터가 보이자 연결을 닫거나, 일부 프록시는 응답을 순서가 뒤바뀐 채 반환하기까지 했다.)

- **served only the first request**: 두 번째 요청부터 무시. 페이지 로드가 멈추거나 일부만 그려짐.
- **closed the connection**: "왜 응답도 안 받고 또 보내?" 하면서 연결을 닫아버림. 다시 새 연결 → 파이프라이닝 의미 없음.
- **out of order**: 요청은 1, 2, 3 순서로 보냈는데 응답이 3, 1, 2 순서로 옴. 클라이언트가 어느 응답이 어느 요청에 대한 것인지 알 수 없게 됨 — 데이터 매칭 자체가 깨짐.

> Because of this, only HEAD and some GET requests could be pipelined in a safe and idempotent mode.

이 때문에 안전하고 멱등한 방식으로는 HEAD와 일부 GET 요청만 파이프라이닝할 수 있었다.

- **HEAD and some GET**: 부작용이 없는 안전한 메서드만. POST 같은 비멱등 메서드는 응답 매칭이 꼬이면 데이터 정합성이 깨지므로 절대 파이프라이닝 불가.
- **safe and idempotent**: 여러 번 보내도 같은 결과인 메서드만 허용 — 응답이 순서가 뒤바뀌어도 의미상 안전한 것들.

> After many years of struggling with the problems introduced by enabling pipelining, this feature was first disabled and then removed from most browsers also because of the announced adoption of HTTP/2.

파이프라이닝 활성화로 인한 문제와 수년간 씨름한 끝에, 이 기능은 먼저 비활성화되었다가 결국 대부분의 브라우저에서 제거됐다. HTTP/2 채택이 발표된 것도 이유 중 하나였다.

- **disabled**: 브라우저들이 기본값을 off로 바꿈. Firefox는 한때 켜져 있었지만 점차 비활성화.
- **removed**: 코드에서 아예 삭제. 사용자가 옵션으로 켤 수도 없게 됨.
- **adoption of HTTP/2**: 멀티플렉싱이 파이프라이닝의 모든 한계를 근본적으로 해결하므로, 파이프라이닝을 살릴 동기가 사라짐.

---

**종합**

파이프라이닝과 그 후속 해결책의 비교:

| 방식 | 동작 | 한계 |
|---|---|---|
| HTTP/1.1 (직렬) | 요청 → 응답 → 요청 → 응답 | 응답 대기로 지연 누적 |
| HTTP/1.1 + 파이프라이닝 | 요청1, 2, 3 동시 송신, 응답은 순서대로 | 호환성 + HOL blocking |
| HTTP/2 멀티플렉싱 | 한 연결에 여러 스트림이 독립적으로 진행 | 진정한 동시 처리 |

파이프라이닝의 본질적 한계 — Head-of-Line(HOL) blocking — 도 짚고 가야 합니다. 호환성 문제가 없었더라도, 응답이 요청 순서대로 와야 한다는 제약이 있었습니다. 첫 요청의 응답이 느리면 뒤따르는 응답들도 그만큼 늦게 옵니다. HTTP/2의 멀티플렉싱은 응답 순서 제약을 없애 이 문제까지 해결했습니다.

이게 없으면 어떻게 되는가: 파이프라이닝이 성공했다면 HTTP/1.1만으로도 페이지 로드가 상당히 빨라졌을 것입니다. 하지만 호환성 문제로 좌절되면서 브라우저들은 "도메인당 동시 6~8개 TCP 연결"이라는 차선책에 의존했습니다 — 이는 서버 부하를 가중시키고 도메인 샤딩(domain sharding) 같은 우회 기법을 낳았습니다. HTTP/2의 멀티플렉싱이 이런 우회의 필요성을 모두 제거했죠.

오개념 예방: "파이프라이닝 = 멀티플렉싱"이 아닙니다. 파이프라이닝은 "요청을 연달아 보내되 응답은 보낸 순서대로 받기"이고, 멀티플렉싱은 "여러 스트림을 독립적으로 진행하여 응답 순서가 자유"입니다. 파이프라이닝은 HOL blocking을 못 피하지만 멀티플렉싱은 피합니다.

AI Annotation 보충: 파이프라이닝의 실패는 표준화된 기능도 현실 인프라(특히 통제 못 하는 중간 노드)와 호환되지 않으면 살아남지 못함을 보여주는 사례입니다. HTTP/2가 비호환 변화(바이너리 프레임)를 도입하면서도 채택될 수 있었던 건 HTTPS 위에서만 동작하도록 강제하여 평문 프록시의 간섭을 차단했기 때문이기도 합니다.
