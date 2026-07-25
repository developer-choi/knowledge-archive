# `loading.js` 파일을 두면 Next.js는 무엇을 대신 해주는가?

## 도입

`<Suspense>`를 직접 배치하지 않고도 스트리밍을 켜는 방법이 있다. 약속된 이름의 파일을 하나 두면 Next.js가 경계를 대신 만들어 준다.

---
## 본문

> The simplest way to add streaming is with a `loading.js` file. Place it alongside your `page.js` and Next.js automatically wraps the page content in a `<Suspense>` boundary, using your loading component as the fallback.

"스트리밍을 추가하는 가장 간단한 방법은 `loading.js` 파일이다. `page.js` 옆에 두면 Next.js가 페이지 내용을 자동으로 `<Suspense>` 경계로 감싸고, 그 로딩 컴포넌트를 대체 화면으로 사용한다."

- **alongside**: 같은 폴더 안 나란히. 파일 위치 자체가 어느 page에 적용될지를 정한다.
- **automatically wraps**: 개발자가 `<Suspense>`를 쓰지 않아도 프레임워크가 감싸 준다.

> Behind the scenes, `loading.js` is nested inside `layout.js` and wraps `page.js` in a `<Suspense>` boundary:

"내부적으로 `loading.js`는 `layout.js` 안에 중첩되며 `page.js`를 `<Suspense>` 경계로 감싼다."

- **Behind the scenes**: 겉으로 드러나지 않는 내부 동작. 개발자가 쓴 것은 파일 하나지만 실제 트리는 아래 모양이 된다.

```
loading.js가 만들어지는 트리

<Layout>                    ← 즉시 렌더 (정적 껍데기)
  <Suspense fallback={<Loading />}>
    <Page />                ← 여기가 준비되면 교체
  </Suspense>
</Layout>
```

> * The layout renders immediately as part of the static shell.
> * The loading skeleton is shown instantly as the Suspense fallback.
> * When the page component finishes loading, its HTML replaces the skeleton.

"레이아웃은 정적 껍데기의 일부로 즉시 렌더링된다. 로딩 스켈레톤은 Suspense 대체 화면으로 즉시 표시된다. page 컴포넌트의 로딩이 끝나면 그 HTML이 스켈레톤을 대체한다."

- **skeleton**: 실제 내용의 자리와 모양만 흉내 낸 회색 뼈대 화면.
- **replaces**: 대체한다. 앞 질문에서 본 인라인 스크립트의 바꿔치기가 여기서 일어난다.

> `loading.js` is useful when there's nothing meaningful to show until the page's data resolves. If the page needs to await data before it can render anything, a full-page skeleton is a reasonable fallback.

"`loading.js`는 페이지의 데이터가 준비되기 전까지 보여 줄 의미 있는 내용이 없을 때 유용하다. 페이지가 무엇이든 렌더링하기 전에 데이터를 기다려야만 한다면, 전체 화면 스켈레톤이 합당한 대체 화면이다."

- **nothing meaningful to show**: 껍데기에 담을 진짜 내용이 없는 경우. 반대로 제목·필터·탭처럼 데이터 없이도 그릴 게 있다면 그것들까지 스켈레톤으로 덮게 되므로 손해다.
- **reasonable**: "최선"이 아니라 "합당한". 상황이 그렇다면 무리가 없다는 정도의 표현이다.

---
## 종합

`loading.js`는 파일 하나로 페이지 전체를 감싸는 경계 하나를 만드는 단축 경로다. 레이아웃은 껍데기로 즉시 나가고, page는 준비될 때까지 스켈레톤이 자리를 지킨다. 대가는 경계의 굵기다. 경계가 페이지 전체이므로 "일부는 즉시, 일부는 나중에"라는 세밀한 구분이 불가능하다. 그래서 데이터 없이는 그릴 게 정말 없는 페이지에 어울리고, 그렇지 않은 페이지에서는 다음 질문의 방식이 낫다.

---

# layout이 캐시되지 않은 데이터를 읽으면 같은 구간의 `loading.js`는 어떻게 동작하는가?

## 도입

`loading.js`를 뒀으니 이 폴더 아래는 다 가려질 것 같다. 그런데 가려지는 범위에 layout 자신은 안 들어간다.

---
## 본문

> Because of this, a layout that accesses uncached or runtime data (e.g. `cookies()`, `headers()`, or uncached fetches) does not fall back to a same route segment `loading.js`. Instead, it blocks navigation until the layout finishes rendering. Cache Components prevents this by guiding you with a build-time error.

"그래서 캐시되지 않은 데이터나 실행 시점 데이터(`cookies()`·`headers()`·캐시 안 된 fetch 등)에 접근하는 layout은 같은 라우트 구간의 `loading.js`로 대체되지 않는다. 대신 layout 렌더링이 끝날 때까지 화면 이동 자체를 막는다. Cache Components는 빌드 시점 에러로 이 상황을 미리 알려 막아 준다."

- **Because of this**: 앞 문장, 즉 `loading.js`가 `layout.js` 안에 중첩된다는 사실을 받는 말이다.
- **runtime data**: 요청이 실제로 들어와야 값이 정해지는 데이터. 쿠키·헤더가 그렇다.
- **fall back to**: 그것으로 대체되다. 여기서는 대기 화면이 대신 나오는 것.
- **blocks navigation**: 화면 이동을 막는다. 링크를 눌렀는데 아무 반응이 없는 상태다.
- **build-time error**: 실행 전 빌드 단계에서 나는 에러.

### 중첩 관계를 그려 보면 당연한 결과다

`loading.js`는 layout 바깥이 아니라 안쪽에 놓인다. 경계는 자기 안쪽만 가릴 수 있으므로, 자기를 담고 있는 layout은 가릴 수 없다.

```
app/blog/
  layout.js
    └ <Suspense fallback={loading.js}>
        └ page.js

layout이 await하면?
  경계보다 바깥에서 멈추므로 아무도 못 가린다
```

### 증상이 유난히 나쁜 이유

이 상황이 특히 나쁜 것은 사용자에게 아무 신호도 안 간다는 점이다.

```
page가 느릴 때
  링크 클릭 → 즉시 새 화면 틀 + 대기 화면 → 내용

layout이 느릴 때
  링크 클릭 → (아무 변화 없음) → 내용
```

뒤쪽에서 사용자는 클릭이 먹혔는지조차 모른다. 그래서 한 번 더 누르게 된다. 브라우저 주소창은 이미 바뀌었는데 화면만 옛 페이지에 머물러 있는 상태다.

### Cache Components가 이것을 빌드 에러로 잡는다

이런 종류의 실수는 개발 중에는 데이터가 빨라서 잘 안 드러나고, 배포한 뒤 느린 회선에서 드러난다. 그래서 Cache Components는 런타임에 느려지게 두지 않고 빌드 때 "여기서 막힌다"고 알려 준다. 사고를 사용자보다 개발자가 먼저 만나게 하는 장치다.

---
## 종합

`loading.js`가 덮는 범위는 page와 그 아래이지 layout이 아니다. layout이 스스로 쿠키를 읽거나 캐시 안 된 데이터를 `await`하면 그 멈춤을 가려 줄 경계가 없어서, 대기 화면도 없이 화면 이동이 멈춰 선다.

---

# 화면 이동이 막히지 않게 하려면 어떻게 고치는가?

## 도입

방향은 둘이다. 멈추는 지점을 가릴 수 있게 경계를 새로 만들거나, 멈추는 코드를 이미 가려지는 곳으로 옮기거나.

---
## 본문

> To fix this, wrap the uncached access in its own `<Suspense>` boundary with a fallback, or move the data fetching into `page.js` where `loading.js` can cover it.

"고치려면 캐시되지 않은 접근을 대기 화면을 갖춘 자기만의 `<Suspense>` 경계로 감싸거나, 데이터 가져오기를 `loading.js`가 덮어 줄 수 있는 `page.js`로 옮긴다."

- **its own**: 그 접근만을 위한, 따로 만든.
- **cover**: 덮어 주다. 준비될 때까지 대기 화면으로 그 자리를 대신 채운다는 뜻이다.

> This is why, while `loading.js` works well for streaming route segments, using `<Suspense>` closer to the runtime or uncached data access is recommended.

"그래서 `loading.js`는 라우트 구간을 스트리밍하는 데는 잘 맞지만, 실행 시점 데이터나 캐시되지 않은 데이터에 접근하는 자리에는 그 가까이에 `<Suspense>`를 두는 편이 권장된다."

- **works well for**: ~에는 잘 맞는다. 전면 부정이 아니라 용도를 가르는 말이다.
- **closer to**: 그 지점에 더 가까이.

### 두 해법이 같은 말인 이유

둘 다 "멈추는 지점을 경계 안쪽으로 넣는다"는 한 가지를 한다. 경계를 데이터 쪽으로 옮기든, 데이터를 경계 쪽으로 옮기든 결과는 같다.

```
문제 상태
  layout: await cookies()   ← 경계 밖
    └ 경계
        └ page

해법 1 — 경계를 데이터 쪽으로
  layout
    └ 경계 ── UserMenu에서 cookies() 사용
    └ 경계 ── page

해법 2 — 데이터를 경계 쪽으로
  layout (아무것도 await 안 함)
    └ 경계
        └ page: await cookies()
```

### 결론이 "경계를 데이터 가까이"인 까닭

`loading.js`는 위치가 정해져 있다. 폴더 하나에 하나, 경계는 항상 page 전체를 덮는 굵기다. 반면 데이터 접근은 트리 어디서든 일어난다. 굵기와 위치가 고정된 도구로 아무 데나 생기는 멈춤을 덮으려니 어긋나는 것이다.

`<Suspense>`는 원하는 자리에 원하는 굵기로 놓을 수 있어서 그 어긋남이 없다. `loading.js`는 페이지 전체가 데이터에 매달려 있는 단순한 경우의 단축 경로로 쓰고, 그 밖에는 멈추는 자리마다 경계를 놓는 쪽이 기본이 된다.

---
## 종합

멈춤은 반드시 경계 안쪽에 있어야 가려진다. layout에서 데이터를 건드려야 한다면 그 접근만 따로 `<Suspense>`로 감싸고, 그럴 이유가 없다면 page로 내려 `loading.js`가 덮게 한다. 일반화하면 경계는 데이터 접근 지점 가까이 두는 것이 안전하다.

---

# `loading.js` 대신 `<Suspense>`를 직접 놓으면 무엇이 달라지는가?

## 도입

`loading.js`가 만드는 경계는 페이지 전체 하나로 고정된다. `<Suspense>`를 직접 쓰면 그 경계의 크기와 개수를 개발자가 정한다.

---
## 본문

> `<Suspense>` lets you control exactly which parts of the page stream independently.

"`<Suspense>`는 페이지의 어느 부분이 독립적으로 스트리밍될지를 정확히 제어하게 해 준다."

- **exactly which parts**: 어느 부분인지를 정확히. 프레임워크의 기본값이 아니라 개발자가 지정한다.

> Instead of a full-page skeleton, you can push fallbacks down into specific sections so the static shell includes more real content.

"전체 화면 스켈레톤 대신, 대체 화면을 특정 구역 안쪽으로 밀어 넣어 정적 껍데기가 더 많은 진짜 내용을 담게 할 수 있다."

- **push ... down**: 트리에서 아래쪽으로 밀어 내린다. 경계가 아래로 내려갈수록 그 위쪽은 껍데기에 포함된다.
- **more real content**: 스켈레톤이 아닌 진짜 내용. 껍데기가 두꺼워질수록 첫 화면이 실제 페이지에 가까워진다.

```
경계 위치와 껍데기 두께

loading.js                     <Suspense> 직접 배치
┌──────────────┐               ┌──────────────┐
│ layout       │ ← 껍데기       │ layout       │ ← 껍데기
│ ┌──────────┐ │               │ 제목·탭·필터  │ ← 껍데기 (진짜 내용)
│ │ 스켈레톤  │ │               │ ┌──────────┐ │
│ │ (page 전체)│ │               │ │ 스켈레톤  │ │ ← 느린 목록만
│ └──────────┘ │               │ └──────────┘ │
└──────────────┘               └──────────────┘
```

> |                | `loading.js`                             | `<Suspense>`                     |
> | -------------- | ---------------------------------------- | -------------------------------- |
> | **Scope**      | Entire page                              | Any component                    |
> | **Setup**      | Drop in a file                           | Wrap components explicitly       |
> | **Navigation** | Prefetched as instant fallback           | Not prefetched by default        |
> | **Best for**   | Pages where nothing renders without data | Most pages, for granular control |

- **Scope / Entire page vs Any component**: 적용 범위. 한쪽은 페이지 통째, 다른 쪽은 아무 컴포넌트나 골라서.
- **Setup / Drop in a file vs Wrap components explicitly**: 준비 방법. 파일을 떨어뜨려 놓기 vs 감쌀 대상을 직접 지정하기.
- **Prefetched as instant fallback**: 화면 이동을 위해 미리 받아 두는 것을 prefetch라고 한다. `loading.js`의 대체 화면은 미리 받아져 있어, 링크를 누르는 즉시 로딩 화면이 뜬다. `<Suspense>` 대체 화면은 기본적으로 미리 받아지지 않는다.
- **granular**: 알갱이가 작은, 즉 세밀한. 경계를 여러 개로 잘게 나눌 수 있다는 뜻이다.

> Prefer explicit `<Suspense>` boundaries close to the dynamic access.

"동적 데이터에 접근하는 지점 가까이에 `<Suspense>` 경계를 명시적으로 두는 쪽을 택하라."

- **close to the dynamic access**: 데이터를 실제로 읽는 그 자리 근처. 경계가 데이터 접근 지점에서 멀수록(위쪽일수록) 불필요하게 많은 화면이 대체 화면으로 덮인다.

---
## 종합

두 방식의 차이는 결국 경계를 어디에 두느냐 하나로 요약된다. `loading.js`는 경계를 페이지 꼭대기에 고정하고, `<Suspense>`는 원하는 깊이에 원하는 개수로 둔다. 경계가 아래로 내려갈수록 껍데기에 진짜 내용이 더 많이 담기므로 첫 화면의 완성도가 올라간다. 대신 화면 이동 시 즉시 뜨는 로딩 화면은 `loading.js` 쪽의 장점으로 남는다. 공식 문서의 권고는 명확하다. 기본은 데이터 접근 지점에 가까운 `<Suspense>`다.

---

# 미리 렌더링하는 쪽이 가변 작업을 만나면 어떻게 행동하는가?

## 도입

빌드 시점에 HTML을 미리 만들어 두는 과정에서, 요청이 와야만 값을 알 수 있는 코드를 만나면 계속 진행할 수가 없다. 이때 프레임워크가 무엇을 찾아 어디까지 거슬러 올라가는지가 이 질문의 내용이다.

---
## 본문

> When the prerenderer encounters dynamic work, it walks up the tree looking for the nearest Suspense boundary.

"미리 렌더링하는 쪽이 동적 작업을 만나면, 트리를 거슬러 올라가며 가장 가까운 Suspense 경계를 찾는다."

- **prerenderer**: 요청 전에 HTML을 미리 만들어 두는 주체.
- **dynamic work**: 요청 시점에야 값이 정해지는 작업. 쿠키 읽기, 요청 헤더 읽기, 요청마다 달라지는 데이터 가져오기 등이다.
- **walks up the tree**: 컴포넌트 트리를 자식에서 부모 방향으로 거슬러 오른다. "여기서 멈춰도 되는 지점"을 위쪽에서 찾는 것이다.
- **the nearest**: 가장 가까운. 여러 경계가 있으면 제일 아래(가까운) 것에서 멈추므로, 덮이는 범위가 최소가 된다.

> If none is found, the build fails with a blocking route error.

"아무것도 못 찾으면 빌드가 실패하며 blocking route 오류가 난다."

- **the build fails**: 런타임에 느려지는 정도로 끝나는 게 아니라 빌드 자체가 실패한다. 경계 없이 페이지 전체가 요청 시점 작업에 막히는 상태를 아예 못 만들게 막는 것이다.

> A `loading.js` high in the tree is a valid boundary, so the framework finds it and stops, but now the entire page falls back to a full-page skeleton instead of streaming granularly.

"트리 위쪽에 있는 `loading.js`도 유효한 경계이므로 프레임워크는 그것을 찾아 멈춘다. 다만 그렇게 되면 페이지 전체가 세밀한 스트리밍 대신 전체 화면 스켈레톤으로 대체된다."

- **valid boundary**: 유효한 경계. 오류는 안 난다는 뜻이다.
- **falls back to**: ~로 물러난다. 오류를 면하는 대신 품질이 한 단계 내려앉는다는 어감이다.

```
경계를 찾아 올라가는 과정

<Layout>                     ← loading.js가 만든 경계 (여기서 멈춤 = 전체 스켈레톤)
  <Page>
    <Suspense>               ← 여기 있었다면 여기서 멈춤 (이 안만 스켈레톤)
      <Chart/>  ← cookies() 발견, 위로 탐색 시작
```

여기서 주의할 점이 있다. 빌드가 통과했다는 사실만으로는 스트리밍이 잘 되고 있다는 보장이 되지 않는다. 위쪽의 `loading.js` 하나가 모든 동적 작업을 받아 내면서 오류를 없애 버리고, 그 결과 페이지 전체가 스켈레톤으로 바뀐 상태일 수 있기 때문이다.

---
## 종합

미리 렌더링하는 쪽은 동적 작업을 만나면 위로 올라가며 가장 가까운 경계를 찾고, 없으면 빌드를 실패시킨다. 이 규칙 덕분에 "경계 없는 동적 페이지"는 배포되기 전에 걸러진다. 다만 경계가 어디에 있느냐에 따라 결과의 품질이 크게 갈린다. 데이터 접근 지점 바로 위에 있으면 그 부분만 스켈레톤이 되고, 페이지 꼭대기에 있으면 화면 전체가 스켈레톤이 된다. 앞에서 "경계를 데이터 접근 지점 가까이에 두라"고 한 권고가 여기서 구체적인 손익으로 드러난다.

---

# `params`나 `cookies()`를 layout·page 맨 위에서 `await`하면 무슨 일이 벌어지는가?

## 도입

서버 코드에서 값이 필요하면 `await`으로 풀어서 쓰는 것이 몸에 밴 습관이다. 그런데 layout·page의 맨 윗줄에서 그렇게 하면, 그 한 줄이 페이지 전체의 성격을 바꿔 놓는다.

---
## 본문

> The key to maximizing what streams instantly is to defer dynamic data access to the component that actually needs it.

"즉시 흘러 나가는 부분을 최대로 키우는 열쇠는, 동적 데이터 접근을 그것을 실제로 필요로 하는 컴포넌트까지 미루는 것이다."

- **defer**: 미룬다. 하지 않는 게 아니라 나중에, 더 아래에서 한다는 뜻이다.
- **actually needs it**: 실제로 그 값을 쓰는 컴포넌트. 값을 받아서 아래로 넘기기만 하는 중간 컴포넌트는 여기 해당하지 않는다.

> This applies to `params`, `searchParams`, `cookies()`, `headers()`, and data fetches.

"이는 `params`, `searchParams`, `cookies()`, `headers()`, 그리고 데이터 가져오기에 모두 적용된다."

- 공통점은 전부 **요청이 와야 값이 정해지는 것**들이라는 점이다. 어느 주소로 들어왔는지, 어떤 쿠키를 갖고 있는지는 빌드 시점에 알 수 없다.

> If you `await` any of these at the top of a layout or page, everything below that point becomes dynamic and cannot be prerendered as part of the static shell.

"이 중 무엇이든 layout이나 page의 맨 위에서 `await`하면, 그 지점 아래의 모든 것이 동적이 되어 정적 껍데기의 일부로 미리 렌더링될 수 없다."

- **everything below that point**: 그 지점 아래의 전부. 손해의 범위가 그 값을 쓰는 컴포넌트 하나가 아니라 하위 트리 전체다.
- **becomes dynamic**: 동적이 된다. `await`이 그 줄에서 실행을 멈춰 세우므로, 그 아래 코드는 요청이 와서 값이 정해진 뒤에야 실행될 수 있다.

```
await 한 줄의 파급

export default async function Layout({ children }) {
  const cookieStore = await cookies()   // ← 여기서 멈춤
  return (
    <div>
      <Header />      ← 쿠키와 무관한데도 대기
      <Nav />         ← 대기
      {children}      ← 페이지 전체가 대기
    </div>
  )
}

정적 껍데기에 담기는 것: (없음)
```

- **cannot be prerendered as part of the static shell**: 정적 껍데기에 포함될 수 없다. 껍데기가 비면 첫 덩어리에 보낼 게 없어지고, 스트리밍을 켜 둔 의미가 사라진다.

`await` 한 줄의 손해를 구체적으로 그려 보면 이렇다. 헤더·내비게이션은 쿠키를 전혀 쓰지 않는데도 쿠키를 기다리는 신세가 된다. 이 페이지는 CDN에서 즉시 내려줄 수 있는 부분을 잃고, 첫 화면 시각은 다시 데이터 속도에 묶인다. 앞 질문의 규칙까지 겹치면 상황은 더 나빠진다. 위쪽에 `loading.js`가 있으면 오류는 안 나지만 화면 전체가 스켈레톤이 되고, 경계가 아예 없으면 빌드가 실패한다.

---
## 종합

`await`은 "값을 얻는다"와 "여기서 멈춘다"를 동시에 뜻한다. 서버 코드에서 흔히 쓰는 이 한 줄이, layout·page 최상단에 놓이는 순간 그 아래 전부를 요청 시점으로 끌어내린다. 그래서 스트리밍 관점에서 최적화의 대상은 데이터 자체의 속도가 아니라 **`await`이 어느 줄에 있는가**다. 값이 필요한 컴포넌트가 열 단계 아래에 있다면, 기다림도 열 단계 아래에서 일어나야 그 위쪽 아홉 단계가 껍데기로 남는다.

---

# 그럼 그 값들을 어떻게 다뤄야 하는가?

## 도입

기존 습관과 정반대의 답이 나오는 대목이다. 서버에서 `await`해 값으로 만든 뒤 자식에게 넘기는 게 아니라, **아직 풀지 않은 약속(promise)을 그대로 자식에게 넘긴다**.

---
## 본문

> Instead, pass the promise down and let the consuming component resolve it inside a `<Suspense>` boundary:

"대신, promise를 아래로 넘기고 그것을 소비하는 컴포넌트가 `<Suspense>` 경계 안에서 풀게 하라."

- **pass the promise down**: 값이 아니라 promise 자체를 내려보낸다. promise는 "나중에 값이 될 것"을 나타내는 객체이므로, 아직 값이 없어도 넘길 수 있다.
- **the consuming component**: 그 값을 실제로 소비(사용)하는 컴포넌트.
- **resolve it inside a `<Suspense>` boundary**: 경계 안에서 푼다. 기다림이 경계 안에서 일어나므로, 기다리는 동안 경계 밖은 정상적으로 렌더링돼 껍데기가 된다.

```tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies() // Start the work, but don't await

  return (
    <div>
      <Nav>
        <Suspense fallback={<p>Loading user...</p>}>
          <UserMenu cookiePromise={cookieStore} />
        </Suspense>
      </Nav>
      {children}
    </div>
  )
}
```

주석 그대로 `cookies()`를 **호출은 하되 `await`하지 않는다**. 호출은 작업을 시작시키고, `await`은 그 자리에서 멈춰 세운다. 이 둘을 분리하는 것이 요령이다. 함수가 `async`조차 아니라는 점도 눈여겨볼 만하다.

> In this example, `<Nav>` and `{children}` render as part of the static shell because nothing in the layout awaits. Only `<UserMenu>` suspends when it resolves the cookie promise.

"이 예시에서 `<Nav>`와 `{children}`은 정적 껍데기의 일부로 렌더링된다. layout 안에서 아무것도 `await`하지 않기 때문이다. 오직 `<UserMenu>`만이 쿠키 promise를 풀 때 중단된다."

- **nothing in the layout awaits**: layout 안에 멈춤 지점이 없다는 것이 껍데기가 살아남는 이유다.
- **suspends**: 중단된다. 그 컴포넌트가 "아직 못 그리겠다"고 신호를 보내면 가장 가까운 경계가 대체 화면을 대신 내보낸다.

> If the layout had called `await cookies()` at the top instead, the entire layout and all its children would be blocked from prerendering.

"만약 layout이 대신 맨 위에서 `await cookies()`를 호출했다면, layout 전체와 그 모든 자식이 미리 렌더링에서 차단됐을 것이다."

```
같은 데이터, 다른 위치

await을 위에서                    promise를 내려보낼 때
┌──────────────────┐             ┌──────────────────┐
│ (전부 대기)       │             │ Nav      ← 껍데기 │
│                  │             │ children ← 껍데기 │
│                  │             │ ┌ UserMenu ────┐ │
│                  │             │ │ Loading user…│ │
└──────────────────┘             └─┴──────────────┴─┘
```

> You can also unwrap the promise inline with `.then()`, so the child component receives a plain value instead of a promise:

"promise를 `.then()`으로 그 자리에서 풀 수도 있다. 그러면 자식 컴포넌트는 promise 대신 평범한 값을 받는다."

- **unwrap ... inline**: 그 자리에서 껍질을 벗긴다. 별도 컴포넌트를 만들지 않고 JSX 안에서 처리한다는 뜻이다.
- **a plain value**: promise가 아닌 보통 값. 자식 쪽 타입이 `string`으로 유지된다.

```tsx
<Suspense fallback={<p>Loading products...</p>}>
  {params.then(({ category }) => (
    <ProductGrid category={category} />
  ))}
</Suspense>
```

> This keeps `ProductGrid` simple (it takes a `string`, not a `Promise`) while still deferring the `params` access to inside the Suspense boundary.

"이렇게 하면 `ProductGrid`를 단순하게 유지하면서도(`Promise`가 아니라 `string`을 받는다) `params` 접근은 여전히 Suspense 경계 안쪽으로 미룬다."

- 요점은 `.then()`이 경계 **안쪽**에 놓여 있다는 것이다. 기다림의 위치가 경계 안이면, 자식이 promise를 받든 값을 받든 껍데기는 그대로 살아남는다.

---
## 종합

핵심은 "기다림을 값이 필요한 자리까지 데려간다"는 한 문장이다. 값을 미리 풀어서 넘기면 기다림이 위쪽에 남아 하위 전체를 붙잡지만, 풀지 않은 promise를 넘기면 기다림도 함께 아래로 내려간다. 자식이 promise를 직접 받는 형태가 부담스러우면 `.then()`으로 경계 안에서 풀어 평범한 값으로 바꿔 줄 수도 있다. 두 방식 모두 판단 기준은 같다. 멈춤이 `<Suspense>` 경계 안에서 일어나는가, 밖에서 일어나는가.

---

# 서버에서 시작한 데이터 요청을 클라이언트 컴포넌트가 이어받게 하려면 어떻게 하는가?

## 도입

앞에서 promise를 자식 Server Component에 넘겼다. 같은 방식이 경계를 넘어 Client Component에도 통한다. 서버가 요청을 시작해 두고, 그 결과를 브라우저에서 실행되는 컴포넌트가 받아 쓰는 구조다.

---
## 본문

> You can start a fetch in a Server Component and pass the unresolved promise as a prop to a Client Component.

"Server Component에서 fetch를 시작하고, 아직 풀리지 않은 promise를 Client Component에 prop으로 넘길 수 있다."

- **unresolved**: 아직 값이 정해지지 않은. 결과가 아니라 진행 중인 작업을 넘긴다.
- 요청이 서버에서 일찍 출발한다는 점이 이득이다. 브라우저가 JavaScript를 받고 실행한 뒤에야 요청을 보내는 것보다 앞선다.

> The promise can be passed through as many layers as needed. Only the component that calls React's `use` API to read the value needs a `<Suspense>` boundary around it:

"promise는 필요한 만큼 여러 층을 거쳐 전달될 수 있다. 값을 읽기 위해 React의 `use` API를 호출하는 컴포넌트만 자기 주위에 `<Suspense>` 경계가 필요하다."

- **as many layers as needed**: 몇 층을 거쳐도 된다. 중간 컴포넌트들은 promise를 그냥 전달만 하므로 멈추지 않는다.
- **`use` API**: promise를 컴포넌트 안에서 읽어 값으로 만드는 React의 함수. 값이 아직 없으면 그 컴포넌트를 중단시킨다.
- **Only the component that calls ... needs**: 경계가 필요한 곳은 실제로 읽는 그 한 곳뿐이다.

```tsx
export default function Dashboard() {
  // Start the fetch during server render, don't await it
  const statsPromise = getStats()

  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <StatsChart dataPromise={statsPromise} />
    </Suspense>
  )
}
```

```tsx
'use client'

import { use } from 'react'

export function StatsChart({ dataPromise }: { dataPromise: Promise<Stats> }) {
  const stats = use(dataPromise)

  return <div>{/* render chart with stats */}</div>
}
```

주석의 `don't await it`이 앞 질문과 같은 요령이다. 서버는 요청을 출발시키기만 하고 기다리지 않으며, 기다림은 `use(dataPromise)`가 있는 경계 안에서 일어난다.

> The fallback is sent immediately with the static shell. When the promise resolves, React streams the completed HTML into the page.

"대체 화면은 정적 껍데기와 함께 즉시 전송된다. promise가 풀리면 React는 완성된 HTML을 페이지 안으로 흘려보낸다."

- **streams the completed HTML into the page**: Client Component인데도 서버가 만든 HTML이 흘러 들어온다. 브라우저에서만 그려지는 게 아니라, 첫 화면은 서버 쪽 결과로 채워진다.

```
데이터 요청이 출발하는 시점

브라우저에서 요청할 때:  HTML 도착 → JS 다운로드 → 실행 → fetch 시작 → 응답
서버에서 시작할 때:      fetch 시작 ─────────────────────▶ 응답 (HTML과 함께 도착)
```

---
## 종합

Server Component와 Client Component 사이에 promise를 그대로 건네는 것이 이 패턴의 전부다. 데이터 요청은 서버 렌더링이 시작되는 이른 시점에 출발하고, 그 결과를 기다리는 일만 브라우저 쪽 컴포넌트가 맡는다. 중간 컴포넌트들은 promise를 전달만 하므로 경계도, `use`도 필요 없다. 결과적으로 "서버가 데이터를 미리 당겨 오는 이득"과 "클라이언트에서만 가능한 상호작용"을 둘 다 챙기게 된다.

---

# 여러 컴포넌트가 같은 데이터를 필요로 하면 어떻게 하는가?

## 도입

같은 데이터를 여러 컴포넌트가 쓴다면 promise를 prop으로 일일이 내려보내기가 번거롭다. 이때는 promise 하나를 context에 담아 하위 트리 어디서든 꺼내 쓰게 한다.

---
## 본문

> When multiple components need the same data, start the fetch once and pass the promise through a context provider so any component in the subtree can resolve it with `use()`:

"여러 컴포넌트가 같은 데이터를 필요로 하면, fetch를 한 번만 시작하고 그 promise를 context provider를 통해 넘겨서 하위 트리의 어떤 컴포넌트든 `use()`로 풀 수 있게 하라."

- **start the fetch once**: 요청은 한 번만. promise 하나를 공유하므로 몇 곳에서 읽든 네트워크 요청은 한 번이다.
- **context provider**: React에서 값을 하위 트리 전체에 뿌리는 장치. 여기 담기는 것이 값이 아니라 promise라는 점이 요점이다.
- **any component in the subtree**: 하위 트리의 아무 컴포넌트나. 중간 층을 거쳐 prop을 넘길 필요가 없어진다.

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  const userPromise = getUser()

  return <UserProvider userPromise={userPromise}>{children}</UserProvider>
}
```

여기서도 layout은 `await`하지 않는다. provider에 담기는 것은 아직 풀리지 않은 promise이므로 layout은 멈추지 않고, `{children}`은 정적 껍데기로 남는다. 각 소비 컴포넌트는 자기가 `use()`로 읽는 시점에, 자기 주변 경계 안에서 중단된다.

```
promise 하나를 나눠 쓰는 구조

Layout: getUser() ──┐  (await 없음 → 껍데기 유지)
                    │
        UserProvider(userPromise)
                    ├── <Suspense> Header  → use(userPromise)
                    ├── <Suspense> Sidebar → use(userPromise)
                    └── <Suspense> Profile → use(userPromise)

네트워크 요청: 1회
```

> You can share fetched data across both Server and Client Components by combining `React.cache` with context providers.

"`React.cache`와 context provider를 조합하면 가져온 데이터를 서버 컴포넌트와 클라이언트 컴포넌트 양쪽에서 공유할 수 있다."

- **across both A and B**: A와 B 양쪽에 걸쳐서.
- **combining A with B**: A와 B를 조합해서.

### 왜 `React.cache`가 같이 나오는가

context는 클라이언트 컴포넌트가 promise를 받아 가는 통로일 뿐, 서버 컴포넌트에는 통하지 않는다. 서버 쪽에서는 그냥 함수를 직접 부르는 게 자연스러운데, 그러면 provider에 담은 것과 별개의 호출이 되어 요청이 두 번 나갈 수 있다.

가져오는 함수를 `React.cache`로 감싸면 그 걱정이 사라진다. 어느 경로로 부르든 같은 요청 안에서는 한 번만 실행되기 때문이다.

```
getUser()  ← cache로 감싼 함수
   │
   ├── layout이 불러 provider에 담음 → 클라이언트가 use()로 읽음
   └── 다른 서버 컴포넌트가 직접 await

실제 실행: 1회
```

`React.cache` 자체의 동작 범위는 [../data-fetching/server-components.md](../data-fetching/server-components.md)의 「`React.cache`로 감싼 함수를 한 화면에서 여러 번 호출하면 그때마다 실행되는가?」에서 다룬다.

---
## 종합

promise 자체가 공유 가능한 값이라는 점이 이 패턴을 성립시킨다. 한 번 시작한 작업을 여러 곳에서 각자 읽어도 요청은 한 번이고, 각 소비 지점은 자기 경계 안에서 독립적으로 기다린다. 그리고 provider를 두는 layout이 `await`하지 않으므로, 데이터가 아무리 느려도 껍데기는 즉시 나간다. 앞 두 질문과 같은 원리(멈춤을 소비 지점까지 미루기)를 전달 수단만 prop에서 context로 바꿔 적용한 것이다.
