# `<b>`·`<i>`·`<u>`는 원래 무엇을 위해 생긴 태그이며, 왜 이제 쓰지 말라고 하는가?

## 도입

이름부터 bold, italic, underline이라 무엇을 하는 태그인지가 곧바로 드러난다. 이름이 모양을 가리킨다는 사실 자체가 이 세 태그의 출신과 문제를 동시에 설명한다.

HTML에서 태그를 고르는 일은 "이 텍스트가 무엇인지"를 적는 행위인데, 이 셋은 "이 텍스트가 어떻게 보여야 하는지"를 적는다.

---

## 본문

> The situation with `<b>`, `<i>`, and `<u>` is somewhat more complicated. They came about so people could write bold, italics, or underlined text in an era when CSS was still supported poorly or not at all.

"`<b>`·`<i>`·`<u>`는 사정이 조금 더 복잡하다. 이들은 CSS 지원이 형편없거나 아예 없던 시절에 굵은 글씨, 기울임, 밑줄을 쓰기 위해 생겨났다."

- **came about**: 생겨났다. 설계된 것이 아니라 필요에 밀려 등장했다는 어감이다.
- **in an era when CSS was still supported poorly or not at all**: CSS가 제대로 지원되지 않던 시절. 모양을 바꿀 다른 수단이 없어 HTML 태그가 그 일을 떠맡았다는 배경이다.

> Elements like this, which only affect presentation and not semantics, are known as presentational elements and should no longer be used

"이처럼 겉모습에만 영향을 주고 의미에는 영향을 주지 않는 요소를 presentational element라 부르며, 더는 사용하지 않는 것이 좋다."

- **presentation**: 겉모습. 글자가 굵은지 기울었는지 같은 시각적 표현을 말한다.
- **semantics**: 의미. 브라우저·검색엔진·스크린리더가 읽어낼 수 있는 역할 정보다.
- **presentational elements**: 겉모습만 담당하는 요소들을 묶어 부르는 이름.
- **no longer**: 이제는 더 이상. 과거에는 쓸 이유가 있었으나 그 이유가 사라졌다는 뜻이다.

> because, as we've seen before, semantics is so important to accessibility, SEO, etc.

"앞서 봤듯 의미는 접근성과 검색엔진 최적화 등에 매우 중요하기 때문이다."

- **accessibility**: 접근성. 스크린리더 같은 보조 기술이 문서를 제대로 전달할 수 있는 정도를 말한다.
- **SEO**: 검색엔진 최적화. 검색엔진이 문서 구조를 읽어 무엇이 중요한 내용인지 판단하는 데 의미 정보를 쓴다.

의미가 없으면 왜 문제가 되는지는 기울임을 예로 들면 구체적으로 보인다.

> The concept of italics isn't very helpful to people using screen readers, or to people using a writing system other than the Latin alphabet.

"기울임이라는 개념은 스크린리더를 쓰는 사람에게도, 라틴 알파벳이 아닌 문자 체계를 쓰는 사람에게도 그다지 도움이 되지 않는다."

- **screen readers**: 화면의 내용을 음성으로 읽어주는 보조 기술. 글자가 기울어졌다는 시각 정보는 소리로 옮길 것이 마땅치 않다.
- **a writing system other than the Latin alphabet**: 라틴 알파벳 외의 문자 체계. 기울임은 라틴 문자권의 표기 관행이라 한글이나 한자에는 대응하는 관습이 없다.

```
<i>Archilochus colubris</i>          <span style="font-style: italic">…</span>

화면          기울어진 글자            기울어진 글자  (동일)
문서 정보     "관행상 기울이는 무언가"   없음
음성 낭독     기울기는 소리가 없음        기울기는 소리가 없음
```

시각 표현에 뜻을 실어 두면, 그 시각 표현을 볼 수 없는 경로에서는 뜻이 통째로 사라진다. 이것이 모양이 아니라 의미를 적어야 하는 이유다.

---

## 종합

세 태그의 출신은 "CSS가 없어서 HTML로 모양을 낼 수밖에 없던 시절"이고, 퇴출 사유는 "그 일을 이제 CSS가 하며 태그는 의미를 맡아야 한다"이다. 도구가 갈라진 뒤에도 옛 도구가 남아 있는 상태에 가깝다.

여기서 배울 점은 태그 세 개를 외우는 것이 아니라 판단 기준이다. 이름이 모양을 가리키는 태그는 대체로 그 자리에 쓸 태그가 아니다.

기울임을 예로 든 마지막 문장이 핵심을 짚는다. 문서에 "기울임"이라고만 적어두면 그 정보는 화면을 보는 사람에게만 전달되고, 음성으로 듣는 사람과 기울임 관행이 없는 문자권에는 아무것도 전달되지 않는다.

같은 자리에 "학명"이라고 적어두면 사정이 달라진다. 화면에서는 여전히 기울여 보여주면 되고, 다른 경로에서는 각자의 방식으로 그 뜻을 다룰 여지가 생긴다.

---

# 그런데도 `<b>`·`<i>`·`<u>`를 쓰는 것이 적절한 경우는 언제인가?

## 도입

앞에서 겉모습만 담당하는 요소라고 했지만, HTML 표준에서 이 셋이 사라진 것은 아니다. 지금의 `<b>`·`<i>`·`<u>`는 "굵게 하라"가 아니라 "관행상 굵게 표기해 온 어떤 뜻"을 나타내는 요소로 재정의되어 남아 있다.

문제는 그 자리가 매우 좁다는 점이다.

---

## 본문

> It's only appropriate to use `<b>`, `<i>`, or `<u>` to convey a meaning traditionally conveyed with bold, italics, or underline when there isn't a more suitable element;

"`<b>`·`<i>`·`<u>`는 굵은 글씨·기울임·밑줄로 전통적으로 전달해 온 뜻을 나타낼 때, 그리고 더 적합한 요소가 없을 때만 쓰는 것이 적절하다."

- **only appropriate**: ~할 때만 적절하다. 허용 조건을 좁게 못 박는 표현이다.
- **convey a meaning**: 뜻을 전달한다. 모양을 내는 것이 아니라 뜻을 나타내는 용도라는 점을 분명히 한다.
- **traditionally conveyed with**: 전통적으로 그 표기로 전달해 온. 이 태그들이 붙잡고 있는 것은 오래된 인쇄 표기 관행이다.
- **when there isn't a more suitable element**: 더 적합한 요소가 없을 때. 조건이 하나 더 붙는다.

> and there usually is.

"그리고 대개는 (더 적합한 요소가) 있다."

- **usually**: 대개. 예외가 없다는 말은 아니지만 기본 기대는 "있다" 쪽이라는 뜻이다.

짧지만 이 문장이 앞 문장의 무게를 결정한다. 조건은 "더 적합한 요소가 없을 때"인데, 그런 요소는 보통 존재하므로 조건이 충족되는 경우 자체가 드물다.

> Consider whether `<strong>`, `<em>`, `<mark>`, or `<span>` might be more appropriate.

"`<strong>`·`<em>`·`<mark>`·`<span>` 중에 더 적합한 것이 없는지 먼저 따져보라."

- **consider whether**: ~인지 검토하라. 곧장 `<b>`를 쓰지 말고 후보를 먼저 훑으라는 절차 지시다.
- **`<mark>`**: 본문에서 특정 부분을 눈에 띄게 표시해 두는 요소. 검색어 하이라이트처럼 "지금 이 맥락에서 관련이 있어 짚어둔 부분"을 나타낸다.

`<strong>`·`<em>`은 [`em-strong.md`](./em-strong.md)가, `<span>`은 [`div-span.md`](./div-span.md)가 다룬다.

---

## 종합

정리하면 판단은 순서가 있는 검토다. 굵게·기울여·밑줄로 표기하고 싶은 자리를 만나면 아래 순으로 훑는다.

- **놓치면 곤란한 대목인가** → `<strong>`
- **세게 읽어야 하는 낱말인가** → `<em>`
- **지금 맥락에서 관련 있어 짚어두는 부분인가** → `<mark>`
- **나타낼 의미가 아예 없고 모양만 필요한가** → `<span>` + CSS
- **위 어디에도 안 맞는데 그 표기로 전달해 온 특정한 뜻이 있는가** → 그제야 `<b>`·`<i>`·`<u>`

`<b>`·`<i>`·`<u>`가 목록의 맨 아래에 있다는 배치가 그대로 결론이다. 이름이 짧고 손에 익어 먼저 떠오르지만, 검토 순서에서는 마지막에 놓인다.

---

# `<i>`는 어떤 뜻을 나타낼 때 쓰는가?

## 도입

앞에서 본 조건을 통과한 뒤에야 쓰는 요소이므로, 남은 질문은 "그 좁은 자리가 구체적으로 어디인가"다. `<i>`의 경우 기울여 적어 온 인쇄 관행이 뚜렷한 몇 가지 부류가 여기에 해당한다.

---

## 본문

> `<i>` is used to convey a meaning traditionally conveyed by italic: foreign words, taxonomic designation, technical terms, a thought…

"`<i>`는 기울임꼴로 전달해 온 뜻을 나타낼 때 쓴다. 외국어 낱말, 분류학상 명칭, 전문 용어, 마음속 생각 등이다."

- **foreign words**: 본문 언어에 섞여 들어온 다른 언어 낱말.
- **taxonomic designation**: 생물 분류학에서 정한 학명. 속명과 종명을 기울여 쓰는 것이 학술 표기 관행이다.
- **technical terms**: 전문 용어. 그 분야에서 특별한 뜻으로 쓰는 낱말을 처음 꺼낼 때 기울여 표기해 왔다.
- **a thought**: 소리 내어 말하지 않은 등장인물의 속마음.

공통점은 넷 다 "강조"가 아니라는 것이다. 학명을 기울이는 이유는 세게 읽으라는 것이 아니라 그것이 학명이라서다.

```html
<!-- 학명 -->
<p>
  The Ruby-throated Hummingbird (<i>Archilochus colubris</i>) is the most common
  hummingbird in Eastern North America.
</p>
```

```html
<!-- 외국어 낱말 -->
<p>
  The menu was a sea of exotic words like <i lang="uk-latn">vatrushka</i>,
  <i lang="id">nasi goreng</i> and <i lang="fr">soupe à l'oignon</i>.
</p>
```

외국어 예시에서 눈여겨볼 것은 `lang` 속성이다. `<i>`만으로는 "본문과 다른 무언가"까지밖에 말하지 못하는데, `lang="fr"`을 붙이면 그 낱말이 프랑스어라는 사실까지 문서에 적힌다.

이 정보는 화면에 보이지 않지만 쓰임이 있다. 스크린리더 같은 보조 기술이 그 낱말만 제 언어의 발음으로 읽을 근거를 갖는다.

---

## 종합

`<i>`를 쓸 자리는 "기울여 보이고 싶은 곳"이 아니라 "기울여 적는 관행이 있는 특정한 부류"다. 학명, 외국어 낱말, 전문 용어, 속마음이 그 목록이고 강조는 목록에 없다.

그래서 실무 판단은 두 단계로 끝난다.

- **강조나 중요도인가** → `<em>`·`<strong>`이지 `<i>`가 아니다
- **위 부류 중 하나인가** → `<i>`를 쓰고, 가능하면 `lang` 같은 속성으로 정보를 더 얹는다

`lang`을 함께 쓰는 습관이 특히 값어치가 있다. `<i>` 하나만으로는 겉모습에서 한 발짝밖에 못 벗어나지만, 속성을 얹는 순간 "무엇인지"가 문서에 실제로 기록된다.

---

# `<b>`는 어떤 뜻을 나타낼 때 쓰는가?

## 도입

굵게 쓰는 관행에도 강조와 무관한 부류가 있다. 사전이나 안내서에서 표제어를 굵게 뽑아 두는 것이 그런 경우로, 세게 읽으라는 뜻이 아니라 눈으로 찾기 쉬우라고 굵게 한 것이다.

---

## 본문

> `<b>` is used to convey a meaning traditionally conveyed by bold: keywords, product names, lead sentence…

"`<b>`는 굵은 글씨로 전달해 온 뜻을 나타낼 때 쓴다. 핵심어, 제품명, 도입 문장 등이다."

- **keywords**: 문서에서 다루는 핵심 낱말. 사전의 표제어처럼 훑어보다가 찾아낼 수 있게 굵게 뽑아 두는 자리다.
- **product names**: 제품명. 소개 글에서 제품 이름을 굵게 쓰는 관행이 있다.
- **lead sentence**: 기사나 글의 첫 요약 문장. 신문에서 도입부를 굵게 조판해 온 데서 온다.

핵심어와 제품명은 `<strong>`으로 넘어가기 쉬운 자리라 구분이 필요하다. "이 낱말을 놓치면 곤란하다"고 말하려는 것이면 `<strong>`이고, "이 낱말이 여기서 다루는 용어다"라고 표시하려는 것이면 `<b>`다.

```html
<dl>
  <dt>Semantic HTML</dt>
  <dd>
    Use the elements based on their <b>semantic</b> meaning, not their
    appearance.
  </dd>
</dl>
```

용어 정의 목록에서 정의되는 용어를 굵게 표시한 예다. 여기서 `semantic`을 굵게 한 것은 경고나 강조가 아니라 "이 설명의 대상이 되는 용어가 이것"이라는 표시다.

---

## 종합

`<b>`의 자리는 "굵게 보이고 싶은 곳"이 아니라 "굵게 뽑아 두는 관행이 있는 부류"다. 핵심어, 제품명, 도입 문장이 그 목록이고 중요도 표시는 목록에 없다.

`<strong>`과 갈리는 지점을 문장으로 바꿔 보면 판단이 쉬워진다.

```
                 <b>                          <strong>
말하는 바        "이게 여기서 다루는 용어다"     "이건 놓치면 곤란하다"
전형적인 자리    표제어 · 제품명 · 도입 문장     경고 · 금지 · 필수 안내
읽는 사람에게    찾기 쉽게 해주는 표시           무게를 알려주는 표시
```

둘 다 화면에서는 굵게 보이므로 눈으로는 구별되지 않는다. 구별되는 것은 문서가 말하는 내용 쪽이고, 그래서 잘못 골라도 티가 나지 않는다.

판단이 애매하면 `<strong>`을 먼저 검토하라는 앞의 순서가 여기서도 유효하다. `<b>`는 그 검토를 통과하지 못한 자리에 남는 선택지다.

---

# `<u>`는 어떤 뜻을 나타낼 때 쓰는가?

## 도입

셋 중에서도 `<u>`는 쓸 자리가 가장 좁다. 밑줄이라는 표기가 웹에서는 이미 다른 뜻으로 굳어져 있기 때문인데, 그 사정은 다음 질문에서 따로 다룬다.

여기서는 밑줄로 표기해 온 관행이 어떤 부류에 있었는지를 본다.

---

## 본문

> `<u>` is used to convey a meaning traditionally conveyed by underline: proper name, misspelling…

"`<u>`는 밑줄로 전달해 온 뜻을 나타낼 때 쓴다. 고유명사, 맞춤법 오류 등이다."

- **proper name**: 고유명사. 중국어 문헌에서 인명·지명에 밑줄을 긋는 표기 관행이 대표적이다.
- **misspelling**: 철자가 틀린 낱말. 편집기가 오타 아래에 물결 밑줄을 긋는 그 표시와 같은 뜻이다.

```html
<!-- 맞춤법이 틀린 낱말 -->
<p>Someday I'll learn how to <u class="spelling-error">spel</u> better.</p>
```

여기서 `class="spelling-error"`가 붙어 있는 점이 중요하다. `<u>`의 기본 모양은 링크와 똑같은 실선 밑줄이라, 그대로 두면 읽는 사람이 클릭할 수 있는 것으로 오해한다.

클래스를 붙여 두면 CSS로 그 모양을 바꿀 수 있다. 빨간 물결 밑줄처럼 오타 표시로 통용되는 모양으로 바꾸면, 뜻은 문서에 남기고 겉모습은 오해 없는 쪽으로 가져가게 된다.

```css
.spelling-error {
  text-decoration: red wavy underline;
}
```

---

## 종합

`<u>`가 나타내는 것은 밑줄이라는 선이 아니라 밑줄로 표기해 온 뜻, 곧 고유명사나 오타 같은 부류다. 목록이 짧고 일상적인 웹 문서에서 마주칠 일도 드물다.

쓸 때는 거의 항상 클래스와 CSS가 따라붙는다고 보면 된다.

- **뜻은 `<u>`가 적는다** → 문서에 "여기가 그 부류다"가 남는다
- **모양은 CSS가 정한다** → 기본 실선 밑줄을 링크와 헷갈리지 않을 모양으로 바꾼다

태그로 의미를 적고 CSS로 픽셀을 정한다는 원칙이 이 예시 한 줄에 그대로 들어 있다. 겉모습이 문제라고 해서 태그를 포기하는 것이 아니라, 태그는 두고 겉모습만 바꾸는 방식이다.

---

# 웹에서 밑줄을 쓸 때 무엇을 조심해야 하는가?

## 도입

인쇄물에서 밑줄은 여러 뜻으로 쓰이지만 웹에서는 사실상 한 가지 뜻으로 굳었다. 브라우저가 오랫동안 링크를 밑줄로 그려 왔고, 사용자는 그 규칙을 학습한 채 페이지를 본다.

---

## 본문

> People strongly associate underlining with hyperlinks. Therefore, on the web, it's best to only underline links.

"사람들은 밑줄을 하이퍼링크와 강하게 연결지어 인식한다. 따라서 웹에서는 링크에만 밑줄을 긋는 것이 가장 좋다."

- **strongly associate A with B**: A를 보면 B를 떠올린다는 연결이 강하게 형성되어 있다는 뜻이다. 개인 취향이 아니라 사용자 다수가 공유하는 학습된 기대다.
- **it's best to only underline links**: 밑줄은 링크에만 쓰는 것이 최선이다. 링크가 아닌 글자에 밑줄이 있으면 클릭해도 아무 일이 없어 사용자가 헛짚게 된다.

> Use the `<u>` element when it's semantically appropriate, but consider using CSS to change the default underline to something more appropriate on the web.

"의미상 적절하면 `<u>` 요소를 쓰되, 기본 밑줄을 웹에 더 어울리는 모양으로 바꾸도록 CSS 사용을 고려하라."

- **semantically appropriate**: 의미상 적절한. 앞 질문에서 본 고유명사·오타 같은 부류에 해당하는 경우다.
- **default underline**: `<u>`에 브라우저가 기본으로 넣는 실선 밑줄. 링크의 밑줄과 구별되지 않는 바로 그 모양이다.
- **something more appropriate on the web**: 웹에서 더 어울리는 모양. 앞의 빨간 물결 밑줄처럼 링크로 오해되지 않는 표시를 말한다.

두 문장이 태그를 버리라고 말하지 않는다는 점이 요점이다. 쓰되 겉모습만 바꾸라는 지시다.

---

## 종합

밑줄 문제는 의미와 겉모습이 충돌하는 사례다. 의미상으로는 밑줄로 표기해 온 부류가 맞는데, 겉모습으로는 그 표기가 웹에서 이미 링크에 배정되어 있다.

해결은 둘을 떼어 각자 맞는 도구에 맡기는 것이다.

- **의미** → `<u>`로 문서에 적는다
- **겉모습** → CSS로 링크와 구별되는 표시로 바꾼다

반대로 링크가 아닌 글자를 밑줄로 꾸미고 싶을 때도 같은 원칙이 뒤집혀 적용된다. 밑줄이라는 모양 자체가 사용자에게는 "클릭 가능"이라는 신호이므로, 장식 목적의 밑줄은 헛클릭을 부른다.

`<u>`를 둘러싼 주의사항이 유독 긴 이유가 여기 있다. 다른 태그들은 잘못 써도 문서 정보가 어긋나는 선에서 끝나지만, 밑줄은 사용자가 실제로 클릭을 시도했다가 아무 일도 일어나지 않는 경험까지 만들어 낸다.
