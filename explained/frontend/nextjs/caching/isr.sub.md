# 빌드 때 만들어지지 않은 주소로 요청이 들어오면 어떻게 되는가?

## 도입

빌드 시점에 글이 25개였는데 그 뒤에 26번째 글이 생겼다. 다시 빌드하지 않은 상태에서 `/blog/26`으로 들어오면 404일까?

---
## 본문

> If `/blog/26` is requested, and it exists, the page will be generated on-demand.

"빌드 목록에 없던 `/blog/26`으로 요청이 들어왔는데 그 글이 실제로 있으면, 그 페이지는 요청받은 그 자리에서 만들어진다."

- **on-demand**: 미리가 아니라 요청받은 시점에.

즉 빌드 때 만든 목록은 **울타리가 아니라 출발점**이다. 목록에 없다고 막히는 게 아니라, 그때 만들어서 내주고 이후 요청을 위해 캐시한다.

> This behavior can be changed by using a different `dynamicParams` value.

"이 동작은 `dynamicParams` 값을 다르게 주어 바꿀 수 있다."

- **dynamicParams**: 목록에 없는 주소로 들어왔을 때 만들어줄지 말지를 정하는 라우트 설정.

기본값은 "만들어준다"이고, 이를 꺼두면 목록 밖 주소는 만들지 않고 404가 된다. 상품 목록처럼 존재하는 것이 확실히 정해져 있는 경우에 쓴다.

> However, if the post does not exist, then 404 is returned.

"다만 그 글 자체가 없으면 404가 돌아간다."

두 가지 404를 헷갈리지 않는 게 중요하다.

```
목록에 없지만 데이터는 있음   → 그 자리에서 만들어 내줌
데이터 자체가 없음            → 404
목록에 없고 dynamicParams 꺼둠 → 데이터 유무와 무관하게 404
```

---
## 종합

빌드 때 만든 목록에 없는 주소여도, 그 대상이 실제로 존재하면 요청받은 자리에서 만들어 내준다. 대상 자체가 없으면 404다. 목록 밖 주소를 아예 막고 싶으면 `dynamicParams`를 꺼서 404로 떨어뜨린다.

---

# 정적으로 두려던 라우트가 의도치 않게 동적 렌더링으로 넘어가는 경우는?

## 도입

`revalidate`를 걸어뒀는데 빌드 결과를 보니 그 페이지가 정적으로 잡히지 않는다. 설정을 잘못 쓴 걸까? 대개는 라우트 설정이 아니라 **그 안의 `fetch` 한 줄**이 원인이다.

---
## 본문

> If any of the `fetch` requests used on a route have a `revalidate` time of `0`, or an explicit `no-store`, the route will be dynamically rendered.

"라우트에서 쓰는 `fetch` 중 하나라도 `revalidate` 시간이 `0`이거나 명시적으로 `no-store`면, 그 라우트는 동적으로 렌더링된다."

- **any of**: 하나라도. 전부가 아니라 한 개면 충분하다.
- **explicit**: 기본값으로 그렇게 된 게 아니라 코드에 직접 적어 넣은.
- **dynamically rendered**: 요청이 올 때마다 그 자리에서 그리는 방식.

### 방향이 반대인 두 규칙

라우트 설정과 개별 요청은 서로를 밀어낸다.

```
라우트 설정 → fetch     dynamic = 'force-static' 등으로 전체를 정적으로 몰기
fetch → 라우트          no-store 한 줄이 라우트 전체를 동적으로 끌어내리기
```

아래쪽 방향이 사고를 만든다. 페이지 열 곳에서 데이터를 가져오는데 그중 하나에 `no-store`가 박혀 있으면, 나머지 아홉이 아무리 캐시 가능해도 그 라우트는 통째로 동적이 된다. 미리 만들어둔 페이지가 없으니 ISR도 함께 사라진다.

`0`과 `no-store`가 같은 취급을 받는 것도 이 맥락이다. "0초 뒤에 낡는다"는 곧 "언제나 낡았다"이고, 그건 캐시하지 않겠다는 말과 같다.

---

## 종합

라우트에서 쓰는 `fetch` 중 하나라도 `revalidate: 0`이거나 `no-store`면 그 라우트 전체가 동적으로 넘어간다. ISR이 조용히 꺼지는 가장 흔한 경로이고, 원인은 라우트 설정이 아니라 그 안의 요청 한 줄이라 눈에 잘 띄지 않는다.

---

# 한 라우트에 재검증 주기가 다른 `fetch`가 여럿이면 ISR 주기는 어떻게 정해지는가?

## 도입

한 페이지에서 상품 정보는 한 시간마다, 재고는 1분마다 가져온다고 하자. 이 페이지는 얼마마다 다시 만들어질까?

---
## 본문

> If you have multiple `fetch` requests in a prerendered route, and each has a different `revalidate` frequency, the lowest time will be used for ISR.

"미리 그려지는 라우트 안에 `fetch` 요청이 여럿이고 각각 `revalidate` 주기가 다르면, ISR에는 그중 가장 짧은 시간이 쓰인다."

- **prerendered route**: 요청 전에 미리 그려두는 라우트.
- **the lowest time**: 가장 짧은 시간.

페이지는 하나의 결과물이라 주기도 하나여야 한다. 서로 다른 주기가 섞이면 **가장 자주 바뀌어야 하는 것에 맞춘다** — 그래야 어느 조각도 약속보다 오래 낡아 있지 않는다. 위의 예라면 1분이 페이지 전체의 주기가 된다.

> However, those revalidate frequencies will still be respected by the cache.

"다만 각 요청의 재검증 주기 자체는 캐시에서 그대로 존중된다."

- **respected**: 무시되지 않고 그대로 지켜진다.

두 층이 따로 돈다는 뜻이다.

```
페이지를 다시 만드는 주기      = 가장 짧은 것 하나로 통일
각 데이터를 다시 가져오는 주기  = 저마다의 값 그대로
```

1분마다 페이지를 다시 만들더라도, 한 시간짜리 상품 정보는 그때마다 새로 가져오는 게 아니라 캐시에서 그대로 온다. 페이지를 자주 다시 만드는 것이 곧 모든 API를 자주 부르는 것은 아니다.

---
## 종합

페이지 재생성 주기는 그 라우트에서 가장 짧은 `revalidate` 값으로 정해진다. 다만 각 요청은 저마다의 주기를 그대로 지켜 캐시되므로, 페이지가 자주 다시 만들어진다고 모든 데이터를 매번 새로 가져오는 것은 아니다.

---

# 서버를 여러 대 띄워 돌릴 때, 필요할 때 부르는 재검증은 어디까지 먹는가?

## 도입

관리자가 글을 고치고 저장했다. 재검증도 분명히 호출됐다. 그런데 어떤 사용자는 새 내용을 보고, 어떤 사용자는 여전히 옛 내용을 본다. 새로고침하면 왔다 갔다 하기도 한다.

버그처럼 보이지만 설계된 동작이다.

---
## 본문

> When running multiple instances, the default file-system cache is per-instance.

"여러 대를 띄워 돌릴 때, 기본 파일시스템 캐시는 인스턴스마다 따로다."

- **instances**: 같은 앱을 여러 벌 띄운 각각의 실행 단위.
- **file-system cache**: 캐시를 서버의 파일로 저장하는 기본 방식.
- **per-instance**: 인스턴스마다 하나씩, 서로 공유되지 않음.

> On-demand revalidation only invalidates the instance that receives the call.

"필요할 때 부르는 재검증은 그 호출을 받은 인스턴스만 무효화한다."

호출은 한 번이지만 서버는 여러 대다. 그 요청을 받은 한 대만 캐시를 비우고, 나머지는 자기 캐시를 그대로 들고 있다.

```
관리자가 저장 → 로드밸런서 → 서버 A  (캐시 비움)
                            서버 B  (옛 캐시 그대로)
                            서버 C  (옛 캐시 그대로)

사용자가 서버 B로 배정되면 → 옛 내용
```

> Use a shared custom cache handler to coordinate across instances.

"인스턴스끼리 맞추려면 공유되는 사용자 정의 캐시 처리기를 쓰라."

- **cache handler**: 캐시를 어디에 어떻게 저장할지 직접 구현해 끼우는 모듈.
- **coordinate**: 여러 대의 동작을 서로 맞추는 것.

캐시를 각자의 디스크가 아니라 공용 저장소(예를 들면 공유 데이터베이스)에 두면 한 번의 무효화가 전부에 걸린다.

> Background regeneration (stale-while-revalidate) runs on the instance that receives the triggering request.

"뒤에서 도는 재생성(낡은 걸 주면서 갱신하기)은 그 방아쇠가 된 요청을 받은 인스턴스에서 실행된다."

- **triggering request**: 재생성을 시작시킨 그 요청.

> On platforms with per-request billing, this background work counts as additional compute.

"요청당 과금하는 플랫폼에서는 이 뒷작업이 추가 연산으로 계산된다."

- **compute**: 과금 대상이 되는 연산 사용량.

사용자에게는 응답이 이미 나갔지만 서버는 아직 일하고 있다는 뜻이다. 응답 시간만 보면 공짜처럼 보이는 재생성이 청구서에는 찍힌다.

---
## 종합

기본 캐시는 서버 한 대마다 따로 있어서, 재검증 호출은 그 호출을 받은 한 대에만 먹는다. 그래서 여러 대로 돌리는 환경에서는 사용자에 따라 옛 내용이 계속 보일 수 있고, 이를 없애려면 캐시를 공용 저장소에 두어야 한다. 뒤에서 도는 재생성도 방아쇠가 된 요청을 받은 서버에서 돌기 때문에, 요청당 과금 환경에서는 눈에 안 보이는 비용으로 쌓인다.
