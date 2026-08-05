# `<div>`는 어떤 내용을 마크업할 때 쓰는가?

## 도입

HTML에는 덩어리를 감싸는 요소가 여럿 있다. 완결된 글이면 `<article>`, 기능이나 주제로 묶였으면 `<section>`, 본문 곁에 붙는 것이면 `<aside>`다.

그런데 어느 쪽에도 해당하지 않는 덩어리가 남는다. 감싸긴 해야 하는데 붙일 이름이 없는 경우다.

`<div>`는 그 자리를 위해 준비된, 의미가 비어 있는 블록 요소다.

---

## 본문

> `<div>` is a block level non-semantic element, which you should only use if you can't think of a better semantic block element to use, or don't want to add any specific meaning.

"`<div>`는 의미를 담지 않는 블록 수준 요소로, 의미를 담은 더 나은 블록 요소가 떠오르지 않거나 특정한 의미를 덧붙이고 싶지 않을 때에만 써야 한다."

- **block level**: 블록 수준. 줄 전체를 차지하며 위아래로 쌓이는 요소다. 문장 속 몇 글자를 감싸는 인라인 요소와 여기서 갈린다.
- **non-semantic**: 의미를 담지 않는. 그 자리가 무엇인지에 대한 역할 정보를 문서에 남기지 않는다는 뜻이다. `<article>`은 "완결된 글", `<nav>`는 "주된 통로"를 기록하지만 `<div>`는 아무것도 기록하지 않는다.
- **only use if**: ~인 경우에만 쓴다. 기본 선택지가 아니라 마지막에 남는 선택지라는 제한이다.
- **can't think of a better semantic block element**: 의미를 담은 더 나은 블록 요소가 떠오르지 않는다. 조건이 "없다"가 아니라 "떠오르지 않는다"로 적힌 데 주의한다. 먼저 찾아보는 절차가 전제되어 있다.
- **don't want to add any specific meaning**: 특정한 의미를 덧붙이고 싶지 않다. 두 번째 조건이다. 의미를 못 찾은 경우와, 의미를 붙이면 오히려 틀리는 경우가 나뉜다.

### 어떻게 `<div>`까지 내려오는가

MDN은 사이트 어디서나 열 수 있는 장바구니 위젯을 예로 들어, 후보를 하나씩 탈락시키며 `<div>`에 도달하는 과정을 보여준다.

> This isn't really an `<aside>`, as it doesn't necessarily relate to the main content of the page (you want it viewable from anywhere).

"이것은 사실 `<aside>`가 아니다. 페이지의 본문과 반드시 관련되지는 않기 때문이다(어디서든 볼 수 있기를 원한다)."

- **isn't really**: 사실은 아니다. 화면상 위치가 사이드바처럼 보여도 조건이 맞지 않는다는 어감이다.
- **doesn't necessarily relate to the main content**: 본문과 반드시 관련되지는 않는다. `<aside>`의 조건이 "본문과 간접적으로라도 관련된 것"이었는데 그 고리가 없다.
- **viewable from anywhere**: 어디서든 볼 수 있다. 어느 페이지의 본문 곁이 아니라 사이트 전체에 걸쳐 떠 있는 것이라, 곁들여질 본문 자체가 특정되지 않는다.

> It doesn't even particularly warrant using a `<section>`, as it isn't part of the main content of the page.

"`<section>`을 쓸 만한 근거도 딱히 없다. 페이지 본문의 일부가 아니기 때문이다."

- **doesn't ... warrant**: ~할 근거가 되지 못한다. 쓰면 안 된다기보다 쓸 이유가 서지 않는다는 쪽이다.
- **isn't part of the main content of the page**: 페이지 본문의 일부가 아니다. `<section>`의 조건이 "페이지의 한 부분"이었으니 여기서 걸린다.
- **even**: ~조차. 앞서 `<aside>`가 탈락한 데 이어 이쪽도 안 된다는 흐름을 잇는 낱말이다.

> So a `<div>` is fine in this case.

"그러니 이 경우엔 `<div>`로 충분하다."

- **So**: 앞의 탈락 과정 전체를 근거로 삼는 접속사다. `<div>`를 먼저 고른 것이 아니라 마지막에 남은 것이다.
- **is fine**: 충분하다. 최선이라거나 권장한다는 말이 아니라, 이 경우엔 문제되지 않는다는 정도다.

```
장바구니 위젯을 무엇으로 감쌀까
├── <aside>?    본문과 맞물리지 않음        → 탈락
├── <section>?  페이지 본문의 일부가 아님   → 탈락
└── <div>       남은 자리
```

---

## 종합

`<div>`의 정체는 "역할 정보를 남기지 않는 블록 요소"이고, 쓰는 조건은 "더 나은 요소를 찾아본 뒤에도 남을 때"다.

장바구니 위젯 예시가 보여주는 것은 결론이 아니라 순서다. 후보를 먼저 놓고 조건에 맞는지 하나씩 따진 다음 전부 걸렸을 때 `<div>`에 닿는다.

이 순서를 건너뛰고 처음부터 `<div>`를 쓰면, 실제로는 `<nav>`나 `<article>`이었어야 할 덩어리까지 아무 이름 없이 묻힌다.

`<div>`가 없으면 어떻게 되는지도 짚어둘 만하다. 감쌀 요소가 필요한데 이름 없는 상자가 없으면, 뜻이 맞지도 않는 `<section>`이나 `<aside>`를 끌어다 쓰게 된다.

그 순간 문서에는 사실이 아닌 역할 정보가 기록된다. 아무 말도 하지 않는 것이 틀린 말을 하는 것보다 낫다.

---

# `<span>` 요소는 어떤 용도로 쓰는 요소인가?

## 도입

HTML 요소는 대부분 자기 이름값을 한다. `<p>`로 감싸면 그 범위가 문단이 되고, `<h1>`으로 감싸면 그 줄이 페이지의 최상위 제목이 된다.

태그를 고르는 행위 자체가 "이 텍스트가 무엇인지"를 브라우저에 알려주는 선언이다.

그런데 문장 한가운데 몇 글자만 빨갛게 칠하고 싶을 때처럼, 알려줄 의미가 애초에 없는 경우가 있다. `<span>`은 바로 그 자리를 위해 준비된, 의미가 비어 있는 요소다.

---

## 본문

> This is a `<span>` element. It has no semantics.

"이것은 `<span>` 요소다. 아무 의미도 갖지 않는다."

- **semantics**: 의미. 여기서는 "브라우저·검색엔진·스크린리더가 읽어낼 수 있는 역할 정보"를 가리킨다. `<p>`의 semantics는 "문단", `<h1>`의 semantics는 "최상위 제목"이다.
- **no**: 있는데 약하다는 뜻이 아니라 아예 없다는 뜻이다. `<span>`을 아무리 많이 써도 문서에 추가되는 역할 정보는 0이다.

의미가 없다는 성질이 왜 결함이 아니라 용도인지는 다음 조각에서 드러난다.

> You use it to wrap content when you want to apply CSS to it (or do something to it with JavaScript)

"CSS를 입히고 싶을 때(또는 JavaScript로 무언가 하고 싶을 때) 콘텐츠를 감싸는 데 쓴다."

- **wrap**: 감싼다. 스타일이나 스크립트를 붙이려면 붙일 대상이 하나의 요소로 잡혀 있어야 하는데, 문장 속 몇 글자에는 그런 요소가 없다. `<span>`은 그 손잡이를 만들어 준다.
- **apply CSS**: 글자색·굵기·배경 같은 시각 속성을 준다.
- **do something with JavaScript**: `querySelector`로 집어 텍스트를 갈아끼우거나 클래스를 토글하는 등의 조작을 말한다.

즉 `<span>`을 쓰는 동기는 "이 부분이 무엇인지 알리고 싶어서"가 아니라 "이 부분을 붙잡을 손잡이가 필요해서"다.

> without giving it any extra meaning.

"그러면서 아무 추가 의미도 부여하지 않는다."

- **extra meaning**: 감싸는 행위 때문에 딸려 들어오는 역할 정보. `<em>`으로 감싸면 강조라는 의미가, `<strong>`으로 감싸면 중요도라는 의미가 함께 붙는다.
- **without**: 그런 부작용이 없다는 뜻이다. 굵게만 만들고 싶은데 `<strong>`을 쓰면 "이 부분이 특별히 중요하다"까지 문서에 기록된다. 화면 결과는 같아도 문서가 말하는 내용은 달라진다.

### 손잡이만 필요한 자리의 예

MDN은 연극 대본에 편집자 주석이 끼어든 상황을 예로 든다.

```html
<p>
  The King walked drunkenly back to his room at 01:00, the beer doing nothing to
  aid him as he staggered through the door.
  <span class="editor-note">
    [Editor's note: At this point in the play, the lights should be down low].
  </span>
</p>
```

> In this case, the editor's note is supposed to merely provide extra direction for the director of the play; it is not supposed to have extra semantic meaning.

"이 경우 편집자 주석은 연출가에게 추가 지시를 주기 위한 것일 뿐이며, 추가적인 의미를 가져서는 안 된다."

- **merely**: 단지 ~일 뿐. 그 이상의 역할을 지우지 말라는 신호다.
- **extra direction**: 추가 지시. 대본 본문이 아니라 곁에 붙은 안내다.
- **is not supposed to have**: 가져서는 안 된다. 의미가 없어도 괜찮다가 아니라, 의미를 붙이면 틀린다는 쪽이다. 이 주석을 `<em>`으로 감싸면 문서에는 "이 부분을 강조해 읽으라"가 기록되는데, 편집자 주석은 강조된 대사가 아니다.

문장 속에 끼어 있으니 줄을 새로 시작하지도 않는다. `<span>`이 인라인 요소인 이유가 여기서 드러난다.

감싸는 대상이 문장 흐름 안의 일부라서 흐름을 끊지 않아야 한다.

### 겉모습만 흉내 낼 때 생기는 일

의미가 없다는 점이 실제로 어떤 결과를 낳는지는 CSS로 겉모습만 제목처럼 만든 예시에서 가장 잘 보인다.

```html
<span style="font-size: 32px; margin: 21px 0; display: block;">
  Is this a top level heading?
</span>
```

글자 크기를 키우고 위아래 여백을 주고 블록으로 만들었으니, 화면에서는 `<h1>`으로 쓴 제목과 구분되지 않는다. 그러나 이 줄이 "이 페이지의 최상위 제목"이라는 사실은 문서 어디에도 기록되지 않았다.

```
<h1>Is this a top level heading?</h1>     <span style="font-size: 32px …">…</span>

화면        큼직한 한 줄                    큼직한 한 줄  (동일)
문서 구조   최상위 제목                     역할 없음
목차 추출   항목으로 잡힘                   잡히지 않음
스크린리더  헤딩으로 읽어 아웃라인 제공      그냥 본문 글자
```

CSS가 바꾸는 것은 픽셀이고, 태그가 정하는 것은 역할이다. 겉모습을 아무리 정확히 흉내 내도 역할은 따라오지 않는다.

헤딩 요소가 실제로 어떤 역할을 지고 위계를 어떻게 만드는지는 같은 폴더의 [`headings-paragraphs.md`](./headings-paragraphs.md)에서 다룬다.

> `<span>` is an inline non-semantic element, which you should only use if you can't think of a better semantic text element to wrap your content, or don't want to add any specific meaning.

"`<span>`은 의미를 담지 않는 인라인 요소로, 감쌀 내용에 의미를 담은 더 나은 텍스트 요소가 떠오르지 않거나 특정한 의미를 덧붙이고 싶지 않을 때에만 써야 한다."

- **inline**: 인라인. 줄 전체를 차지하지 않고 문장 흐름 안에 끼어든다.
- **a better semantic text element**: 의미를 담은 더 나은 텍스트 요소. `<em>`·`<strong>`·`<code>`·`<time>`처럼 문장 속 일부를 감싸며 의미를 남기는 요소들이다.
- **only use if**: ~인 경우에만 쓴다. `<div>` 설명에 나온 조건과 문장 모양까지 같다. 다른 것은 `block`이 `inline`으로, `block element`가 `text element`로 바뀐 것뿐이다.

---

## 종합

`<span>`의 정체는 "의미가 없는 인라인 요소"이고, 용도는 "의미를 붙이지 않은 채 스타일이나 스크립트를 걸 손잡이를 만드는 것"이다. 이 둘은 같은 성질의 앞뒤 면이다.

그래서 선택 기준이 단순해진다.

- **감싸려는 부분에 이름 붙일 역할이 있다** (문단·제목·강조·인용·코드 등) → 그 역할에 해당하는 요소를 쓴다.
- **역할은 없고 스타일이나 스크립트만 필요하다** → `<span>`을 쓴다.

`<span>`이 없으면 어떻게 되는지를 뒤집어 보면 존재 이유가 분명해진다. 문장 속 몇 글자에 색을 주려고 `<em>`이나 `<strong>`을 끌어다 쓰게 되고, 그 순간 원하지도 않은 강조·중요도가 문서에 섞여 들어간다.

두 요소가 실제로 무엇을 기록하는지는 같은 폴더의 [`em-strong.md`](./em-strong.md)에서 다룬다.

반대 방향의 실수가 `<div>`·`<span>` 도배다. 제목 자리에 스타일 입힌 `<span>`을 쓰면 화면은 통과하지만, 목차를 뽑는 도구도 스크린리더도 검색엔진도 그 줄을 제목으로 보지 않는다.

눈에 보이지 않는 손해라 발견이 늦다는 점이 특히 나쁘다.

### `<div>`와 `<span>`은 무엇으로 갈리는가

두 요소의 원문을 나란히 놓으면 다른 낱말이 몇 개 없다.

```
<div>    block level  non-semantic element   … better semantic block element
<span>   inline       non-semantic element   … better semantic text element
```

의미가 없다는 점도, "더 나은 요소가 떠오르지 않을 때에만"이라는 조건도, "특정한 의미를 덧붙이고 싶지 않을 때"라는 두 번째 갈래도 똑같다.

갈리는 곳은 감싸는 범위 하나다. 줄 전체를 차지하는 덩어리면 `<div>`, 문장 흐름 안의 일부면 `<span>`이다.

정리하면 둘 다 "고를 태그가 없을 때의 기본값"이지 "고르기 귀찮을 때의 기본값"이 아니다. 의미에 맞는 태그를 먼저 찾고, 찾아도 없을 때 남는 자리가 `<div>`와 `<span>`이다.
