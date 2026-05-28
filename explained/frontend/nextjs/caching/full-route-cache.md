# Full Route Cache는 무엇을 저장하는가?

## 도입

Full Route Cache는 라우트 렌더링의 최종 산출물 — HTML과 RSC payload — 을 서버에 영구 저장한다. 사용자 요청이 들어오면 다시 렌더링하지 않고 저장된 결과물을 그대로 반환하므로, CPU와 시간 비용 모두 절감된다.

---

## 본문

> By default, the Full Route Cache is **persistent**. This means that the render output is cached **across** user requests.

"기본적으로 Full Route Cache는 **영구적**이다. 이는 렌더 출력이 여러 사용자 요청에 **걸쳐** 캐시됨을 의미한다."

- **persistent**: 영구적으로 유지된다. 단, 이 영구성은 "새 배포가 있을 때까지"의 조건부 영구성이다. 새 배포 시 Full Route Cache는 초기화된다(Data Cache와 다른 점).
- **render output**: HTML과 RSC payload로 구성된 라우트 렌더링 결과물. HTML은 초기 페이지 로드에, RSC payload는 클라이언트 사이드 네비게이션 시 사용된다.
- **across user requests**: 1만 명이 같은 정적 페이지에 접근해도 렌더링은 한 번만 수행하고, 저장된 결과를 1만 번 서빙한다.

```
Full Route Cache 위치

서버 (빌드 시 또는 첫 요청 시 생성)
├── /products       → HTML + RSC payload 저장됨
├── /about          → HTML + RSC payload 저장됨
└── /blog/[slug]    → 각 slug별 HTML + RSC payload 저장됨

사용자 요청 → Full Route Cache HIT → 저장된 결과 반환 (렌더링 없음)
```

---

## 종합

Full Route Cache가 없다면 정적 콘텐츠 페이지도 요청마다 서버에서 React 트리를 렌더링해야 한다. 수천 명이 동시에 같은 블로그 글을 읽을 때, 렌더링을 한 번만 하고 결과를 캐싱하면 서버 부하가 극적으로 줄어든다. 이것이 없으면 정적 콘텐츠 사이트가 CDN 없이는 트래픽을 감당하기 어려워진다.

---

---

# Full Route Cache를 invalidate 하는 두 가지 방법은?

## 도입

Full Route Cache를 비우는 방법은 두 가지다. 하나는 데이터 갱신에 의한 연쇄 무효화이고, 다른 하나는 새 배포다. 두 방법 모두 "렌더 결과의 원재료가 바뀌었으니 다시 만들어라"는 논리에서 출발한다.

---

## 본문

> There are two ways you can invalidate the Full Route Cache:
> - **Revalidating Data**: Revalidating the Data Cache, will in turn invalidate the Router Cache by re-rendering components on the server and caching the new render output.
> - **Redeploying**: Unlike the Data Cache, which persists across deployments, the Full Route Cache is cleared on new deployments.

"Full Route Cache를 무효화하는 두 가지 방법:
- **데이터 재검증**: Data Cache를 재검증하면, 서버에서 컴포넌트를 다시 렌더링하고 새 렌더 출력을 캐싱함으로써 연쇄적으로 Router Cache도 무효화된다.
- **재배포**: 배포를 넘어 유지되는 Data Cache와 달리, Full Route Cache는 새 배포 시 초기화된다."

- **Revalidating Data**: `revalidatePath('/products')` 또는 `revalidateTag('products')`를 호출하면 Data Cache가 무효화되고, 이에 의존하는 Full Route Cache도 자동으로 무효화된다. 다음 요청 시 새로 렌더링한 결과가 저장된다.
- **Redeploying**: 새 코드를 배포하면 Full Route Cache 전체가 초기화된다. 코드가 바뀌었으니 이전 렌더 결과물을 믿을 수 없기 때문이다.

```
무효화 트리거 비교

revalidateTag('products')
    → Data Cache 무효화
    → Full Route Cache 무효화 (연쇄)
    → 다음 요청 시 새 렌더링 후 캐시 재생성

새 배포 (npm run build + 서버 재시작)
    → Full Route Cache 초기화
    → Data Cache 유지 (배포를 넘어 영속)
```

---

## 종합

두 방법의 차이는 Data Cache의 생존 여부다. `revalidateTag`로 무효화하면 Data Cache도 비워지고 Full Route Cache도 따라 비워진다. 하지만 새 배포를 하면 Full Route Cache만 초기화되고 Data Cache는 살아있어 다음 빌드에서 재활용된다. 이 구분은 "배포 후 왜 데이터가 그대로인가?"를 디버깅할 때 중요하다.

---

---

# Full Route Cache와 Data Cache의 배포(deployment) 간 지속성 차이는?

## 도입

두 캐시의 가장 뚜렷한 차이 중 하나는 새 배포 시 생존 여부다. Data Cache는 배포를 넘어서도 살아있고, Full Route Cache는 새 배포 시 초기화된다. 이 차이를 이해하면 "배포 후 캐시 워밍업"이 필요한 이유도 납득된다.

---

## 본문

> Unlike the Data Cache, which persists across deployments, the Full Route Cache is cleared on new deployments.

"배포를 넘어 유지되는 Data Cache와 달리, Full Route Cache는 새 배포 시 초기화된다."

- **persists across deployments**: Data Cache는 서버의 영구 파일시스템에 저장되므로 코드가 배포되어도 데이터 자체는 남아 있다. 다음 빌드 후 처음 요청이 들어왔을 때 Data Cache가 살아있으면 외부 API를 다시 호출하지 않고 캐시에서 응답할 수 있다.
- **cleared on new deployments**: Full Route Cache는 코드 변경과 묶여 있다. 코드가 바뀌면 렌더 결과도 달라질 수 있으므로, 이전 렌더 결과물을 무조건 초기화한다.

```
배포 전후 캐시 상태 비교

                    배포 전    배포 후
Data Cache          살아있음   살아있음 (계속 유지)
Full Route Cache    살아있음   초기화됨 (배포와 함께 비워짐)
```

---

## 종합

배포 직후에는 Full Route Cache가 비어있으므로, 첫 요청들이 들어올 때 서버가 라우트를 렌더링하고 캐시를 다시 채운다. 이 과정이 "캐시 워밍업"이다. 반면 Data Cache는 살아있으므로 렌더링 중 데이터를 가져올 때 외부 API 호출 없이 캐시에서 빠르게 얻을 수 있다. 대용량 배포 직후 서버 부하가 순간적으로 올라가는 이유 중 하나가 바로 Full Route Cache 재생성이다.
