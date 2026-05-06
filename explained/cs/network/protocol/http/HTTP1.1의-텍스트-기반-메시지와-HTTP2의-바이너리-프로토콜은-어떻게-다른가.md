# HTTP/1.1의 텍스트 기반 메시지와 HTTP/2+의 바이너리 프로토콜은 어떻게 다른가?

> Later versions, HTTP/2 and HTTP/3, use a binary protocol, where headers are encoded in a single HEADERS and zero or more CONTINUATION frames using HPACK (HTTP/2) or QPACK (HTTP/3), which both provide efficient header compression.
> The request or response line from HTTP/1 has also been replaced by several pseudo-header fields, each beginning with a colon (:).

---

**도입**

HTTP/1.1까지는 메시지를 텔넷으로 직접 타이핑할 수 있을 만큼 사람이 읽기 좋은 텍스트였습니다. HTTP/2부터는 바이너리로 바뀌어 직접 읽을 수 없습니다 — 대신 컴퓨터가 처리하기 빠르고, 압축으로 트래픽이 줄어듭니다. 무엇이 어떻게 바뀌었는지 봅니다.

---

**본문**

> Later versions, HTTP/2 and HTTP/3, use a binary protocol,

후속 버전인 HTTP/2와 HTTP/3는 바이너리 프로토콜을 사용한다.

- **binary protocol**: 사람이 직접 읽을 수 없는 0과 1의 비트 단위 메시지. 패킷 캡처 도구로 봐도 의미 없는 바이트로 보임.
- **Later versions**: HTTP/1.x 다음 세대. HTTP/2(2015), HTTP/3(2022)가 모두 바이너리.

> where headers are encoded in a single HEADERS and zero or more CONTINUATION frames

헤더는 하나의 HEADERS 프레임과 0개 이상의 CONTINUATION 프레임으로 인코딩된다.

- **HEADERS frame**: 헤더 정보를 담는 메인 프레임. HTTP/2의 메시지는 여러 종류의 프레임으로 분해됨 — HEADERS(헤더), DATA(본문), SETTINGS(설정), 등등.
- **CONTINUATION frames**: HEADERS가 한 프레임에 다 안 들어갈 때 추가로 이어지는 프레임. 매우 큰 헤더(쿠키 등)를 분할 가능.
- **frames**: 프레임. 바이너리 데이터의 최소 단위. 각 프레임이 자기 타입과 길이를 명시 — 파서가 명확히 구분 가능.

> using HPACK (HTTP/2) or QPACK (HTTP/3), which both provide efficient header compression.

HPACK(HTTP/2)이나 QPACK(HTTP/3)을 사용해 효율적인 헤더 압축을 제공한다.

- **HPACK / QPACK**: HTTP 헤더 전용 압축 알고리즘. 자주 등장하는 헤더(`Content-Type`, `User-Agent` 등)를 사전 인덱스로 표현.
- **header compression**: 헤더 압축. 같은 요청이 반복되면 두 번째부터는 헤더 거의 없이 인덱스만 보냄. 모바일·고지연 환경에서 큰 효과.

> The request or response line from HTTP/1 has also been replaced by several pseudo-header fields, each beginning with a colon (:).

HTTP/1의 요청·응답 라인은 콜론(:)으로 시작하는 여러 pseudo-header 필드로 대체됐다.

- **request or response line**: HTTP/1.x의 시작 줄. 요청은 `GET / HTTP/1.1`, 응답은 `HTTP/1.1 200 OK`.
- **pseudo-header fields**: 가짜 헤더. 일반 헤더처럼 생겼지만 시작 줄의 정보(메서드, 경로, 상태 코드 등)를 담는 특수 필드.
- **beginning with a colon (:)**: 콜론으로 시작. `:method`, `:path`, `:scheme`, `:authority`, `:status` — 일반 헤더와 시각적으로 구분.

---

**종합**

HTTP/1.1과 HTTP/2+의 비교:

| 항목 | HTTP/1.1 | HTTP/2+ |
|---|---|---|
| 인코딩 | ASCII 텍스트 | 바이너리 프레임 |
| 사람이 읽기 | 가능 (텔넷으로 타이핑 가능) | 불가능 |
| 헤더 압축 | 없음 (gzip은 본문만) | HPACK / QPACK |
| 시작 줄 | `GET / HTTP/1.1` 형태 | pseudo-header (`:method: GET`, `:path: /`) |
| 메시지 단위 | 한 메시지 = 한 덩어리 | 한 메시지 = 여러 프레임 |
| 멀티플렉싱 | 직렬 | 병렬 (스트림 단위) |

HTTP/1.1 요청:

```
GET /api/users HTTP/1.1
Host: example.com
Accept: application/json
```

HTTP/2 같은 요청을 의미상 표현하면:

```
:method: GET
:scheme: https
:authority: example.com
:path: /api/users
accept: application/json
```

(실제로는 위 텍스트가 HPACK 압축 + 바이너리 프레임으로 인코딩됩니다)

JS 개발자에게 와닿는 지점:

- `fetch()` 코드는 동일. 같은 코드가 HTTP/1.1·HTTP/2·HTTP/3 모두에서 작동
- DevTools Network 탭은 HTTP/2 메시지도 HTTP/1.1 형식으로 보여줌 — 사람이 이해하기 위해 디코딩해서 표시
- DevTools Protocol 컬럼으로 실제 어느 버전인지 확인 가능 (`http/1.1`, `h2`, `h3`)

이게 없으면 어떻게 되는가:

- 바이너리화가 없었다면 — 메시지 파싱이 더 복잡(각 헤더 끝을 찾기 위해 줄 단위 스캔 필요), 멀티플렉싱이 거의 불가능(텍스트 메시지를 어떻게 인터리브할지 모호).
- HPACK/QPACK 같은 헤더 압축이 없었다면 — 매 요청마다 같은 쿠키·User-Agent를 또 보내야 함. 모바일 데이터 낭비 + 트래픽 비용 증가.

오개념 예방: HTTP/2가 바이너리라고 해서 HTTP/1.1의 "의미"가 바뀐 건 아닙니다. 메서드, 경로, 헤더, 상태 코드, 본문 — 모두 그대로입니다. 단지 전송 형식만 바뀐 거예요. 그래서 DevTools가 HTTP/2 응답도 HTTP/1.1 형식으로 디코딩해 보여줄 수 있습니다.

Official Annotation 보충: HTTP는 HTTP/2의 프레임 인캡슐레이션이 추가된 후에도 일반적으로 사람이 읽기 쉽도록 설계됩니다. 원본 HTTP 메시지의 일부만 이 버전에서 전송되더라도, 각 메시지의 의미는 변하지 않으며 클라이언트는 (가상으로) 원본 HTTP/1.1 요청을 재구성합니다. 따라서 HTTP/2 메시지도 HTTP/1.1 형식으로 이해하는 것이 유용합니다.

AI Annotation 보충: HTTP/2는 전송 최적화이지 프로토콜 의미의 변경이 아닙니다. DevTools가 HTTP/2 요청도 HTTP/1.1 형식으로 보여주는 이유가 이 때문입니다 — 의미상 동일하기 때문에 사람이 이해하기 쉬운 텍스트 형식으로 디코딩 가능합니다.
