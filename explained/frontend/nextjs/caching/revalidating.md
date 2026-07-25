# 재검증(revalidation)이란 무엇인가?

## 도입

캐싱을 배울 때 "어떻게 저장하는가"는 절반이다. 나머지 절반은 "저장해둔 것을 언제 버리는가"다. 이 문서 전체가 그 나머지 절반을 다루고, 그 일에 붙은 이름이 재검증이다.

---
## 본문

> Revalidation is the process of updating cached data. It lets you keep serving fast, cached responses while ensuring content stays fresh.

"재검증이란 캐시된 데이터를 갱신하는 과정이다. 덕분에 캐시에서 빠른 응답을 계속 내주면서도 내용이 낡지 않게 유지할 수 있다."

- **revalidation**: 직역하면 "다시 검증하기". 실제 의미는 "낡은 것을 새것으로 갈아 끼우기"에 가깝다.
- **serving**: 요청에 응답을 내주는 것.
- **stays fresh**: 내용이 최신인 상태로 남아 있는 것.

### 캐시의 두 얼굴을 동시에 갖겠다는 말

캐시는 원래 속도와 최신성을 맞바꾸는 장치다. 저장해두면 빠르지만 낡고, 매번 새로 가져오면 최신이지만 느리다.

```
캐시 없음    항상 최신   ·  항상 느림
캐시만 있음  항상 빠름   ·  점점 낡음
재검증       빠름을 유지하되, 낡는 지점을 내가 정함
```

재검증은 이 맞바꿈을 없애는 게 아니라, **낡음이 허용되는 구간을 개발자가 지정하게** 해준다. "얼마나 낡아도 괜찮은가"를 답할 수 있으면 캐시를 쓸 수 있고, 답할 수 없으면 캐시를 쓰면 안 된다는 뜻이기도 하다.

### 갱신 시점을 정하는 두 가지 방식

갱신을 촉발하는 방아쇠는 둘 중 하나다.

```
시간이 당긴다    "한 시간 지났으니 다시"
사건이 당긴다    "방금 데이터를 고쳤으니 다시"
```

이 문서의 나머지 질문들은 전부 이 둘 중 하나에 속한다. 앞쪽은 시간 기반, 뒤쪽은 사건 기반이다.

### 이 파일에는 두 세대의 API가 섞여 있다

Next.js 16에는 캐싱 모델이 두 개 공존한다. 손잡이 이름이 세대마다 다르니, 코드에서 본 이름이 어느 쪽인지 알아두면 검색할 때 헤매지 않는다.

| 하려는 일 | 이전 모델 | Cache Components 모델 |
|---|---|---|
| 시간으로 갱신 | `fetch`의 `next.revalidate`, 라우트의 `export const revalidate` | `use cache` 안의 `cacheLife` |
| 이름표 달기 | `fetch`의 `next.tags` | `cacheTag` |
| 이름표로 지우기 | `revalidateTag` | `revalidateTag` (인자 하나 더) |
| 경로로 지우기 | `revalidatePath` | `revalidatePath` |

시간 기반 갱신이 새 모델에서 사라진 게 아니라 `cacheLife`로 자리를 옮긴 것이다. 이 파일의 시간 기반 질문들은 이전 모델 기준이고, `revalidateTag`의 둘째 인자처럼 새 모델 문서에서만 나오는 내용은 해당 섹션에 따로 표시해두었다.

---
## 종합

재검증은 캐시에 담아둔 데이터를 갱신하는 과정이며, 캐시의 속도를 유지하면서 내용이 낡는 것을 막으려는 장치다. 갱신을 당기는 방아쇠는 시간과 사건 둘뿐이고, 이후 질문들은 모두 그 둘 중 하나를 다룬다.

---

# 캐시된 데이터를 정해둔 시간이 지난 뒤 다시 가져오게 하려면 어떻게 하는가?

## 도입

캐시는 켜는 것만으로 끝나지 않는다. 켜두면 언젠가는 낡는다. 언제 다시 가져올지를 정하는 방법이 둘 있는데, 그중 시간으로 정하는 쪽이다.

---
## 본문

> Use the `next.revalidate` option on `fetch` to revalidate data after a specified number of seconds:

"`fetch`의 `next.revalidate` 옵션을 쓰면 정해둔 초가 지난 뒤 데이터를 갱신한다."

- **revalidate**: 캐시를 버리고 다시 가져오는 것. "재검증"보다는 "갱신"에 가깝다.
- **next**: 표준 `fetch`에는 없는, Next.js가 얹은 전용 옵션 주머니.

```tsx
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

> For non-`fetch` functions, `unstable_cache` accepts a `revalidate` option in its configuration.

"`fetch`가 아닌 함수는 `unstable_cache`의 설정에서 `revalidate` 옵션을 받는다."

### `cache`와 `next`는 자리가 다르다

같은 옵션 객체 안이지만 한 칸 더 들어간다.

```tsx
{ cache: 'force-cache' }              // 표준 fetch의 옵션
{ next: { revalidate: 3600 } }        // Next.js가 얹은 옵션
```

`cache`는 브라우저 표준에 원래 있는 것이고, `next`는 Next.js가 자기 것만 모아둔 주머니다. 그래서 `revalidate`를 바깥쪽에 바로 쓰면 안 걸린다.

### 시간이 지나면 무슨 일이 일어나나

3600초가 지나는 순간 캐시가 지워지는 게 아니다. 그 시점 이후 첫 요청이 오면 낡은 것을 일단 내보내고, 뒤에서 새로 가져와 캐시를 갈아 끼운다.

```
0초 ────────── 3600초 ──────────────────▶
   캐시 그대로       │  다음 요청이 오면
                     │  낡은 걸 먼저 주고
                     │  뒤에서 새로 채움
```

즉 "3600초마다 갱신"이 아니라 "3600초가 지난 뒤 누가 찾아오면 그때 갱신"이다. 아무도 안 찾아오면 갱신도 안 일어난다.

---
## 종합

시간 기반 갱신은 `fetch`의 `next.revalidate`에 초를 적는 것이다. `cache`와 달리 `next` 주머니 안에 들어간다. 정해둔 시간이 지나면 자동으로 갱신되는 게 아니라, 그 뒤 첫 요청이 갱신을 촉발한다.

---

# layout이나 page 전체의 기본 갱신 시간을 정하려면 어떻게 하는가?

## 도입

`fetch`마다 초를 적는 대신 라우트 통째로 정하고 싶을 때가 있다. `dynamic`과 같은 자리에서 export하는 설정이다.

---
## 본문

> Set the default revalidation time for a layout or page.

"layout·page의 기본 갱신 시간을 정한다."

- **default**: 개별 `fetch`가 따로 안 정했을 때 적용되는 값이라는 뜻.

```tsx
export const revalidate = false
// false | 0 | number
```

> - **`false`** (default): The default heuristic to cache any `fetch` requests that set their `cache` option to `'force-cache'` or are discovered before a Request-time API is used. Semantically equivalent to `revalidate: Infinity` which effectively means the resource should be cached indefinitely.

"`false`(기본) — `cache`를 `'force-cache'`로 준 `fetch`, 또는 요청 시점 API가 쓰이기 전에 발견된 `fetch`를 캐시하는 기본 규칙. 의미상 `revalidate: Infinity`와 같고, 사실상 그 자원을 무기한 캐시하라는 뜻이다."

- **heuristic**: 딱 떨어지는 규칙이라기보다 프레임워크가 알아서 잘하려는 어림 판단.
- **discovered before**: 실행 순서상 먼저 만난. 쿠키를 읽은 뒤에 나오는 `fetch`는 이미 동적 구간이라 여기서 빠진다.
- **indefinitely**: 기한 없이. 시간으로는 안 만료된다는 말이지, 태그로도 못 지운다는 뜻이 아니다.

> - **`0`**: Ensure a layout or page is always dynamically rendered even if no Request-time APIs or uncached data fetches are discovered.

"`0` — 요청 시점 API도, 캐시 안 된 데이터 가져오기도 발견되지 않았더라도 layout·page가 항상 동적으로 렌더링되게 한다."

> - **`number`**: (in seconds) Set the default revalidation frequency of a layout or page to `n` seconds.

"숫자(초 단위) — layout·page의 기본 갱신 빈도를 n초로 정한다."

### 세 값이 한 축 위에 있다

이름만 보면 `false`가 "끄기"처럼 보이지만 그 반대다.

```
revalidate = 0        매번 새로          ← 가장 동적
revalidate = 60       60초마다
revalidate = 3600     1시간마다
revalidate = false    영원히 캐시        ← 가장 정적
```

`false`는 "갱신을 끈다"가 아니라 "시간으로는 갱신하지 않는다"다. 문서가 `revalidate: Infinity`와 같다고 적어둔 이유다. `0`은 반대쪽 끝으로, 유효 시간이 0초라 언제 봐도 이미 낡은 상태가 된다.

### "발견되기 전"이 무슨 말인가

`false`의 설명에 나오는 `discovered before a Request-time API is used`는 **코드가 실행되는 순서**를 가리킨다.

```tsx
const a = await fetch(url1)   // 쿠키 읽기 전 → 캐시 대상
const c = await cookies()     // ← 여기서부터 동적 구간
const b = await fetch(url2)   // 쿠키 읽은 뒤 → 캐시 안 됨
```

쿠키를 읽는 순간부터 그 아래는 "사용자마다 다를 수 있는 영역"이 되므로, 그 뒤에 나오는 `fetch`는 캐시 대상에서 빠진다. 파일의 위아래가 아니라 실행 순서 기준이라는 점이 함정이다.

---
## 종합

라우트 전체의 기본 갱신 시간은 `export const revalidate`로 정한다. 값은 `0`(매번 새로) → 숫자(n초) → `false`(시간으로는 갱신 안 함) 순으로 한 축 위에 놓인다. `false`가 기본이며 "끄기"가 아니라 "무기한 캐시"라는 점, 그리고 캐시 대상 판정이 요청 시점 API를 만나기 **전인지 후인지**로 갈린다는 점이 헷갈리기 쉬운 자리다.

---

# 라우트 설정의 `revalidate`와 개별 `fetch`의 `revalidate`가 다르면 어느 쪽이 적용되는가?

## 도입

같은 이름의 설정이 두 층에 있으면 반드시 나오는 질문이다. 위층이 이기는지 아래층이 이기는지.

---
## 본문

> This option does not override the `revalidate` value set by individual `fetch` requests.

"이 옵션은 개별 `fetch` 요청이 정한 `revalidate` 값을 덮어쓰지 않는다."

- **override**: 덮어쓰기. 위층이 아래층을 짓밟는 것.

### 좁은 쪽이 이긴다

라우트 설정은 위층이지만 아래층을 이기지 않는다. 이름 그대로 **기본값**이라, 아무도 안 정했을 때만 쓰인다.

```tsx
// app/blog/page.tsx
export const revalidate = 3600        // 이 라우트의 기본값

export default async function Page() {
  await fetch(a)                             // 3600초 (기본값 적용)
  await fetch(b, { next: { revalidate: 60 } })  // 60초 (자기가 정한 값이 이김)
}
```

CSS에서 더 구체적인 선택자가 이기는 것과 같은 감각이다.

### `dynamic`의 `force-` 계열과는 반대다

같은 라우트 설정인데 `revalidate`와 `dynamic = 'force-dynamic'`이 정반대로 동작한다. 이름에 답이 있다.

```
revalidate = 3600       기본값을 제시   →  개별 fetch가 이긴다
dynamic = 'force-...'   강제로 덮어씀   →  라우트 설정이 이긴다
```

`force-`가 붙었느냐가 갈림길이다. 붙어 있으면 아래층을 무시하겠다는 선언이고, 안 붙어 있으면 "아무도 안 정했으면 이걸로"라는 뜻이다.

---
## 종합

개별 `fetch`가 이긴다. 라우트 설정의 `revalidate`는 강제가 아니라 기본값이기 때문이다. 같은 라우트 설정이라도 `force-`가 붙은 값들은 반대로 아래층을 덮어쓰므로, 이름을 보고 구분하면 된다.

---

# 개발 환경에서 페이지 캐싱은 어떻게 동작하는가?

## 도입

개발 중에 관찰한 동작을 배포된 동작이라고 착각하기 쉬운 자리다. 개발 서버는 캐싱에 관한 한 완전히 다르게 움직인다.

---
## 본문

> In Development, Pages are *always* rendered on-demand and are never cached. This allows you to see changes immediately without waiting for a revalidation period to pass.

"개발 환경에서 페이지는 **항상** 요청할 때 렌더링되고 절대 캐시되지 않는다. 덕분에 갱신 주기가 지나기를 기다리지 않고 바뀐 내용을 바로 볼 수 있다."

- **In Development**: `next dev`로 돌릴 때.
- **on-demand**: 미리 만들어두는 게 아니라 요청이 올 때마다.

### 개발 중에는 캐시가 없는 셈이다

`revalidate: 3600`을 적어두고 개발 서버에서 새로고침하면 매번 새 데이터가 온다. 설정이 안 먹은 게 아니라 개발 환경이 캐싱을 통째로 건너뛰는 것이다.

```
next dev     설정과 무관하게 매번 새로 렌더링
next build   설정대로 캐싱·갱신이 동작
```

의도적인 선택이다. 코드를 고칠 때마다 한 시간을 기다려야 한다면 개발이 불가능하다.

### 그래서 생기는 함정

캐싱 관련 동작은 **개발 서버에서 확인할 수 없다.** 캐시가 제대로 걸리는지, `revalidate` 초가 맞는지, 태그로 지워지는지를 보려면 `next build && next start`로 프로덕션 빌드를 돌려야 한다.

개발 중에 잘 되던 것이 배포 후 안 바뀌는 문제(또는 그 반대)가 이 지점에서 나온다. 개발 서버는 캐시가 없어서 항상 최신이었고, 배포된 쪽은 캐시가 걸려 있기 때문이다.

---
## 종합

개발 서버는 페이지를 캐시하지 않고 매번 새로 렌더링한다. 코드 수정을 바로 보기 위한 의도적인 예외다. 그래서 캐싱·갱신 동작을 검증하려면 반드시 프로덕션 빌드로 확인해야 하고, 개발 중 관찰한 결과를 배포 동작의 근거로 삼으면 안 된다.

---

# 시간이 아니라 데이터가 바뀐 시점에 캐시를 갱신하려면 어떻게 하는가?

## 도입

시간 기반 갱신은 "언제 바뀔지 모르니 일단 한 시간마다 확인"에 가깝다. 하지만 언제 바뀌는지 아는 경우가 있다 — 내가 직접 바꿨을 때다.

---
## 본문

> To revalidate cached data after an event, use `revalidateTag` or `revalidatePath` in a Server Action or Route Handler.

"어떤 사건이 일어난 뒤 캐시된 데이터를 갱신하려면 Server Action이나 Route Handler에서 `revalidateTag` 또는 `revalidatePath`를 쓴다."

- **after an event**: 시간이 되어서가 아니라 무슨 일이 벌어져서.
- **Server Action**: 서버에서 실행되는 함수를 클라이언트에서 직접 부르는 방식.
- **Route Handler**: `route.ts`로 만드는 API 엔드포인트.

### 두 갈래를 나란히 놓으면

```
시간 기반    "한 시간 지났으니 다시 가져와"
             → 데이터가 안 바뀌었어도 가져오고,
               바뀌었어도 한 시간까지는 낡은 걸 보여준다

사건 기반    "방금 내가 글을 고쳤으니 그것만 지워"
             → 정확한 시점에, 정확한 대상만
```

시간 기반은 어림잡는 방식이고 사건 기반은 정확히 짚는 방식이다. 둘은 배타적이지 않아서 같이 쓸 수 있다.

### 부르는 자리가 정해져 있다

아무 데서나 부를 수 없다. **Server Action이나 Route Handler 안**이어야 한다. 렌더링 도중에 캐시를 지우는 것은 앞뒤가 안 맞기 때문이다 — 화면을 그리는 중에 그 재료를 버리는 셈이다.

자연스럽게 이 함수들은 데이터를 바꾸는 코드 바로 옆에 놓인다.

```tsx
export async function updateUser(id: string) {
  // 1. 데이터를 바꾸고
  // 2. 그 데이터를 담은 캐시를 지운다
}
```

---
## 종합

사건 기반 갱신은 데이터를 바꾼 쪽이 "이건 이제 낡았다"고 알려주는 방식이다. `revalidateTag`와 `revalidatePath` 두 함수가 있고, 렌더링 중이 아니라 Server Action·Route Handler처럼 데이터를 바꾸는 자리에서만 부른다.

---

# `revalidateTag`는 지울 대상을 어떻게 지정하는가?

## 도입

"이 데이터를 지워라"라고 말하려면 그 데이터를 가리킬 이름이 있어야 한다. 캐시에 담을 때 미리 붙여두는 이름표가 그 역할을 한다.

---
## 본문

> Tag `fetch` requests with `next.tags` to enable on-demand cache invalidation:

"`next.tags`로 `fetch` 요청에 태그를 달아 원할 때 캐시를 무효화할 수 있게 한다."

- **invalidation**: 무효화. 캐시를 "낡았다"고 표시해 다음에 다시 가져오게 하는 것.

```tsx
export async function getUserById(id: string) {
  const data = await fetch(`https://...`, {
    next: { tags: ['user'] },
  })
}
```

> For non-`fetch` functions, `unstable_cache` also accepts a `tags` option.

"`fetch`가 아닌 함수는 `unstable_cache`도 `tags` 옵션을 받는다."

> Invalidate cached data by tag using `revalidateTag`:

"`revalidateTag`로 태그를 기준 삼아 캐시된 데이터를 무효화한다."

```tsx
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  // Mutate data
  revalidateTag('user')
}
```

> You can reuse the same tag in multiple functions to revalidate them all at once.

"같은 태그를 여러 함수에 다시 써도 되고, 그러면 한 번에 전부 재검증된다."

- **reuse**: 같은 문자열을 다른 곳에 또 쓰는 것. 태그가 한 곳에만 붙는 고유값이 아니라는 뜻.
- **all at once**: 한 번의 호출로 그 태그가 달린 것들이 한꺼번에.

### 태그는 두 곳에서 짝을 맞춘다

한쪽에서 붙이고 다른 쪽에서 부른다. 둘을 잇는 건 **같은 문자열**뿐이다.

```
담을 때                          지울 때
─────────────────────────────    ─────────────────────
next: { tags: ['user'] }   ←→    revalidateTag('user')
```

두 곳이 서로를 모른다. 파일이 달라도, 폴더가 달라도 문자열만 같으면 걸린다. 반대로 오타가 나면 아무 일도 안 일어나고 **에러도 안 난다** — 그런 태그가 없으니 지울 것도 없을 뿐이다. 조용히 실패하므로 태그 문자열을 상수로 빼두는 편이 안전하다.

### 하나의 태그가 여러 요청을 묶는다

태그는 요청 하나에 붙는 고유 이름이 아니라 **묶음 이름**이다. 여러 `fetch`에 같은 태그를 달아두면 `revalidateTag` 한 번에 전부 지워진다.

```
next: { tags: ['user'] }  ──┐
next: { tags: ['user'] }  ──┼──  revalidateTag('user') 한 번에 전부
next: { tags: ['user'] }  ──┘
```

"사용자 정보를 건드리는 요청들"처럼 관심사 단위로 묶는 게 자연스러운 쓰임이다.

---
## 종합

캐시에 담을 때 `next.tags`로 이름표를 붙여두고, 지울 때 `revalidateTag`에 같은 문자열을 넘긴다. 둘을 잇는 것은 문자열뿐이라 오타가 나도 조용히 실패한다. 태그는 고유 식별자가 아니라 묶음 이름이어서, 같은 태그를 여러 요청에 달아 한 번에 지우는 것이 원래 쓰임이다.

---

# `revalidateTag`와 `revalidatePath`는 무엇이 다른가?

## 도입

둘 다 캐시를 지우지만 지목하는 방식이 다르다. 하나는 내가 붙인 이름표로, 다른 하나는 화면의 주소로 가리킨다.

---
## 본문

> Invalidate cached data by tag using `revalidateTag`.

"`revalidateTag`로 태그를 기준 삼아 캐시된 데이터를 무효화한다."

> Invalidate all cached data for a specific route path using `revalidatePath`:

"`revalidatePath`로 특정 라우트 경로의 캐시된 데이터를 **전부** 무효화한다."

- **all**: 골라내는 게 아니라 그 경로에 걸린 것 통째로.
- **route path**: 화면의 주소. `/profile` 같은 것.

```tsx
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // Mutate data
  revalidatePath('/profile')
}
```

### 기준이 데이터냐 화면이냐

```
revalidateTag('user')       "이 데이터를 쓰는 곳은 전부"
                            → 어느 화면에 걸쳐 있든 상관없다

revalidatePath('/profile')  "이 화면에 담긴 것은 전부"
                            → 어떤 데이터든 상관없다
```

한 데이터가 여러 화면에 나오면 태그가 편하고, 한 화면의 재료가 여러 개면 경로가 편하다. 축이 서로 직각이라 둘 중 하나가 더 나은 게 아니다.

### `revalidatePath`는 사전 준비가 없다

태그는 담을 때 미리 붙여둬야 하지만, 경로는 이미 존재하는 것이라 준비가 필요 없다. 아무 설정 없이 `revalidatePath('/profile')`를 부르면 그냥 걸린다.

그만큼 무디다. `/profile`에 캐시된 것이 열 개면 하나만 바뀌었어도 열 개가 다 날아간다. 태그는 "바뀐 것만" 지목할 수 있다.

```
정밀함        revalidateTag    ← 미리 이름표를 붙여야 함
간편함        revalidatePath   ← 준비 없이 바로 씀
```

### 그래서 기본값은 어느 쪽인가

> For most use cases, prefer revalidating entire paths.

"대부분의 경우에는 경로 전체를 재검증하는 쪽을 택하라."

> If you need more granular control, you can use the `revalidateTag` function.

"더 잘게 통제해야 하면 `revalidateTag` 함수를 쓸 수 있다."

- **granular**: 알갱이가 잘다 — 무효화 대상을 좁게 집어낼 수 있다는 뜻.

축이 직각이라는 것과 "무엇부터 손에 잡느냐"는 다른 얘기다. 준비가 필요 없는 쪽을 기본으로 두고, 통째로 날리는 낭비가 실제로 문제가 될 때 이름표를 붙이러 간다.

이 대목은 읽는 문서에 따라 반대로 보일 수 있다. `use cache` 기반의 새 캐싱 모델을 다루는 문서는 태그 쪽을 먼저 권한다. 여기 적힌 기본값은 그 모델을 켜지 않은 상태, 즉 `fetch`의 `next.tags`와 라우트 `revalidate`로 캐시를 다루는 쪽의 기준이다.

---
## 종합

`revalidateTag`는 내가 붙인 이름표로 데이터를 가리키고, `revalidatePath`는 화면 주소로 그 화면의 캐시를 통째로 가리킨다. 태그는 미리 붙여둬야 하는 대신 정밀하고, 경로는 준비 없이 쓸 수 있는 대신 무디다. 축 자체는 직각이지만 손에 먼저 잡을 것은 경로 쪽이고, 통째로 날리는 낭비가 걸릴 때 태그로 내려간다.

---

# 관리자가 콘텐츠를 수정하는 시스템에서 캐시 기간과 갱신 시점을 어떻게 잡는 것이 좋은가?

## 도입

블로그나 쇼핑몰처럼 관리자가 글·상품을 고치는 시스템은 캐싱 설계에서 가장 흔한 사례다. 시간 기반과 사건 기반 중 무엇을 쓸지, 이 사례에서 답이 갈린다.

---
## 본문

> For content management systems with update mechanisms, use tags with longer cache durations and rely on `revalidateTag` to refresh content when it actually changes, rather than expiring the cache preemptively.

"갱신 수단을 갖춘 콘텐츠 관리 시스템이라면, 캐시 기간을 길게 잡고 태그를 쓴 다음, 캐시를 미리 만료시키는 대신 내용이 실제로 바뀌는 시점에 `revalidateTag`로 갱신하도록 맡겨라."

- **content management systems**: 콘텐츠 관리 시스템. 관리자가 글·상품을 등록하고 고치는 도구.
- **update mechanisms**: 내용을 고칠 수 있는 수단. 즉 "언제 바뀌었는지 시스템이 안다"는 뜻.
- **cache durations**: 캐시 유지 기간.
- **rely on**: ~에 맡기다.
- **preemptively**: 미리 앞질러서.

### 짧은 기간으로 잡으면 헛수고가 쌓인다

캐시 기간을 5분으로 잡는다고 해보자. 관리자가 하루에 한 번 글을 고친다면, 나머지 287번의 갱신은 아무것도 안 바뀐 데이터를 다시 가져온 것이다.

```
짧게 잡기    5분마다 확인   →  대부분 헛걸음. 그런데도 최대 5분은 낡음
길게+태그    안 건드리면 유지 →  고치는 순간 즉시 갱신. 헛걸음 0
```

짧은 기간은 비용을 치르면서 최신성도 완전히 보장하지 못한다. 양쪽 다 지는 선택이다.

### 언제 바뀌는지 알면 추측할 이유가 없다

시간 기반 갱신은 본질적으로 추측이다. "언제 바뀔지 모르니 주기적으로 확인하자"는 것이다. 그런데 관리자 도구가 있는 시스템은 **바뀌는 순간을 시스템 자신이 안다.** 그 순간에 알려주면 되므로 추측할 필요가 없다.

```
관리자가 글 저장
   └─ 저장 처리 코드 안에서 revalidateTag('posts')
        └─ 그 태그가 붙은 캐시만 갱신
```

거꾸로, 외부 API처럼 **언제 바뀌는지 알 방법이 없는** 데이터에는 이 전략을 쓸 수 없다. 그때는 시간 기반이 유일한 수단이다. 두 방식을 가르는 기준은 "바뀌는 시점을 내가 아는가"다.

---
## 종합

관리자가 내용을 고치는 시스템에서는 캐시 기간을 길게 두고 태그를 붙인 뒤, 실제로 수정이 일어나는 시점에 `revalidateTag`로 갱신하는 편이 낫다. 짧은 시간 기반 갱신은 대부분 헛걸음이면서 최신성도 보장하지 못하기 때문이다. 바뀌는 시점을 시스템이 알 수 없는 데이터에 한해 시간 기반이 남는다.
