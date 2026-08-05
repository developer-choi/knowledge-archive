# `<ul>`은 어떤 내용을 마크업할 때 쓰는가?

## 도입

목록은 항목 여러 개를 나란히 늘어놓은 텍스트다. 화면에서는 점이나 번호가 앞에 붙어 보이지만, 그 점과 번호는 브라우저가 얹어준 기본 표시일 뿐이다.

HTML이 목록 태그를 두 벌 준비해 둔 이유는 모양이 두 가지라서가 아니다. 늘어놓은 항목들 사이에 순서라는 뜻이 있느냐 없느냐가 갈리기 때문이다.

---

## 본문

> Unordered lists are used to mark up lists of items for which the order of the items doesn't matter.

"순서 없는 목록은 항목의 순서가 중요하지 않은 목록을 마크업할 때 쓴다."

- **unordered**: 순서가 매겨지지 않은. 항목이 화면에 위에서 아래로 놓이기는 하지만, 그 위아래가 아무 뜻도 담지 않는다는 말이다.
- **mark up**: 태그로 감싸 "이 부분이 무엇인지"를 표시하는 일. 여기서는 "이 텍스트 덩어리가 목록이다"를 적는 것이다.
- **the order of the items doesn't matter**: 항목 순서가 중요하지 않다. 판정하는 방법은 간단하다. 항목들을 섞어서 다시 늘어놓아도 문서가 말하는 바가 그대로면 여기에 해당한다.

장 보러 갈 때 적는 목록이 전형적인 예다. 우유, 달걀, 빵을 어느 순서로 적든 사야 할 물건은 똑같다.

```html
<ul>
  <li>milk</li>
  <li>eggs</li>
  <li>bread</li>
</ul>
```

바깥의 `<ul>`이 "여기부터 여기까지가 하나의 목록"이라는 범위를 잡고, 안쪽의 `<li>`가 항목 하나씩을 감싼다. 목록이라는 사실과 항목의 경계, 두 가지가 이 마크업으로 문서에 기록된다.

---

## 종합

`<ul>`이 나타내는 것은 점이 찍힌 모양이 아니라 "이것들은 한 묶음의 항목이고 순서는 뜻이 없다"는 사실이다. 앞에 붙는 점은 CSS로 없앨 수도, 다른 모양으로 바꿀 수도 있지만 그 사실은 그대로 남는다.

이 표시가 없으면 어떻게 되는지를 뒤집어 보면 존재 이유가 분명해진다. 항목마다 `<p>`를 쓰고 앞에 점 문자를 직접 찍어 두면 화면은 비슷해 보이지만, 문서에는 문단 세 개가 우연히 나란히 있는 것으로만 남는다.

이 판단은 앞서 본 [`headings-paragraphs.md`](./headings-paragraphs.md)의 문단·제목 선택과 같은 결의 판단이다. 눈에 보이는 모양을 보고 고르는 것이 아니라 그 텍스트가 무엇인지를 보고 고른다.

---

# `<ol>`은 어떤 내용을 마크업할 때 쓰는가?

## 도입

`<ul>`과 `<ol>`을 가르는 기준은 하나뿐이다. 항목의 순서를 바꿔도 뜻이 그대로인가, 아니면 뜻이 무너지는가.

앞의 것이 `<ul>`이고, 뒤의 것이 `<ol>`이다.

---

## 본문

> Ordered lists are lists in which the order of the items does matter.

"순서 있는 목록은 항목의 순서가 실제로 중요한 목록이다."

- **ordered**: 순서가 매겨진. 항목의 위아래 배치 자체가 정보를 담고 있다는 뜻이다.
- **does matter**: 중요하다. `matters`가 아니라 `does`를 앞세운 강조형이고, 앞서 나온 `doesn't matter`와 정확히 반대말 자리에 놓인다.

길 안내가 전형적인 예다. 항목을 섞으면 다른 장소에 도착하므로 순서가 곧 내용이다.

```html
<ol>
  <li>Drive to the end of the road</li>
  <li>Turn right</li>
  <li>Go straight across the first two roundabouts</li>
</ol>
```

바깥 태그만 `<ul>`에서 `<ol>`로 바뀌었고 안쪽 `<li>`는 그대로다. 항목을 감싸는 방식은 같고, 달라지는 것은 그 항목들의 순서에 뜻이 있느냐 하나다.

---

## 종합

두 목록 태그를 고르는 절차는 한 문장으로 끝난다. 항목들을 머릿속에서 뒤섞어 본 다음, 문서가 여전히 같은 말을 하는지 확인하면 된다.

```
                     <ul>                        <ol>
갈리는 기준     순서를 바꿔도 뜻이 같다        순서를 바꾸면 뜻이 무너진다
전형적인 자리   장보기 목록 · 재료 목록        조리 순서 · 길 안내 · 설치 절차
기본 표시       점                             번호
```

기본 표시가 점이냐 번호냐는 브라우저가 정한 관행이고 CSS로 바꿀 수 있다. 태그를 고를 때 보는 것은 윗줄, 곧 순서에 뜻이 있느냐다.

그래서 "번호가 보였으면 좋겠다"는 이유로 `<ol>`을 고르는 것은 순서가 뒤집힌 판단이다. 순서가 뜻을 갖기 때문에 `<ol>`을 쓰고, 번호는 그 결과로 따라온다.

---

# `<dl>`은 어떤 내용을 마크업할 때 쓰는가?

## 도입

목록에는 한 줄짜리 항목이 늘어선 것 말고 다른 모양도 있다. 낱말 하나와 그 낱말을 풀어 쓴 문단이 짝을 지어 반복되는 형태로, 사전이 대표적이다.

이런 짝지음을 담당하는 세 번째 목록 태그가 `<dl>`이다.

---

## 본문

> The purpose of description lists is to mark up a set of items and their associated descriptions, such as terms and definitions, or questions and answers.

"설명 목록의 목적은 항목들과 그에 딸린 설명을 마크업하는 것이다. 용어와 정의, 또는 질문과 답 같은 것이 여기 해당한다."

- **description lists**: 설명 목록. 요소 이름 `<dl>`의 d와 l이 이 두 낱말이다.
- **a set of items**: 항목들의 집합. `<ul>`·`<ol>`과 마찬가지로 항목이 여럿 반복된다는 점은 같다.
- **their associated descriptions**: 그 항목들에 딸린 설명. `associated`는 아무 설명이나 옆에 놓인 것이 아니라 각 항목에 짝지어 붙는다는 뜻이다. 이 낱말이 `<ul>`과 갈리는 지점이다.
- **terms and definitions**: 용어와 정의. 사전이나 용어집이 이 모양이다.
- **questions and answers**: 질문과 답. 자주 묻는 질문 페이지가 이 모양이다.

원문이 예를 둘 든 것이 정의 전용이 아니라는 신호다. 짝을 이루는 두 덩어리가 반복되는 구조이기만 하면 되고, 그 두 덩어리가 꼭 낱말과 뜻풀이일 필요는 없다.

---

## 종합

목록 태그 세 개가 각자 나타내는 것을 나란히 놓으면 선택이 갈린다.

- **순서에 뜻이 없는 항목들** → `<ul>`
- **순서에 뜻이 있는 항목들** → `<ol>`
- **항목마다 짝지어 붙는 설명이 있는 경우** → `<dl>`

앞의 둘이 항목 하나에 덩어리 하나였다면, `<dl>`은 항목 하나에 덩어리 둘이다. 이 구조 차이 때문에 안쪽을 감싸는 요소도 `<li>` 하나가 아니라 두 가지로 나뉘는데, 그 이야기는 다음 질문에서 이어진다.

자주 묻는 질문 페이지를 `<dl>` 없이 만들면 어떻게 되는지 생각해 보면 쓸모가 잡힌다. 질문과 답을 문단으로만 늘어놓으면 화면에서는 굵기나 여백으로 구별되지만, 문서에는 어느 답이 어느 질문에 붙은 것인지가 남지 않는다.

---

# 설명 목록 안에서 용어와 설명은 각각 어떤 요소로 감싸는가?

## 도입

`<ul>`·`<ol>`은 안쪽 요소가 `<li>` 하나뿐이었다. 항목 하나가 덩어리 하나였으니 감쌀 것도 하나면 충분했다.

설명 목록은 항목 하나가 용어와 설명이라는 두 덩어리로 되어 있어서, 안쪽을 감싸는 요소도 두 가지가 필요하다.

---

## 본문

> Description lists use a different wrapper than the other list types — `<dl>`; in addition each term is wrapped in a `<dt>` (description term) element, and each description is wrapped in a `<dd>` (description definition) element.

"설명 목록은 다른 목록 종류와 다른 바깥 요소인 `<dl>`을 쓰고, 여기에 더해 각 용어는 `<dt>`(description term) 요소로, 각 설명은 `<dd>`(description definition) 요소로 감싼다."

- **wrapper**: 안쪽 내용을 통째로 감싸는 바깥 요소. `<ul>`·`<ol>`이 그 자리에 있던 것과 같은 자리다.
- **a different wrapper than the other list types**: 다른 목록 종류와는 다른 바깥 요소. 바깥이 `<dl>`이라는 사실 자체가 "이건 설명 목록이다"를 이미 말한다.
- **in addition**: 여기에 더해. 바깥이 달라지는 것으로 끝나지 않고 안쪽 요소까지 달라진다는 연결이다.
- **`<dt>` (description term)**: 설명 대상이 되는 용어 쪽을 감싼다. term은 뜻풀이의 대상이 되는 낱말이다.
- **`<dd>` (description definition)**: 그 용어를 풀어 쓴 설명 쪽을 감싼다.

MDN이 드는 예시를 보면 두 요소가 실제로 어떻게 배치되는지가 드러난다.

```html
<dl>
  <dt>soliloquy</dt>
  <dd>
    In drama, where a character speaks to themselves, representing their inner
    thoughts or feelings and in the process relaying them to the audience (but
    not to other characters.)
  </dd>
  <dt>monologue</dt>
  <dd>
    In drama, where a character speaks their thoughts out loud to share them
    with the audience and any other characters present.
  </dd>
  <dt>aside</dt>
  <dd>
    In drama, where a character shares a comment only with the audience for
    humorous or dramatic effect. This is usually a feeling, thought, or piece of
    additional background information.
  </dd>
</dl>
```

`<dt>`와 `<dd>`가 `<dl>` 안에서 번갈아 나열된다.

눈여겨볼 것은 한 항목을 통째로 감싸는 요소가 따로 없다는 점이다. `<li>`에 해당하는 자리가 비어 있고, 용어와 설명이 형제로 나란히 놓인다.

```
<ul> / <ol>              <dl>
├── <li> 항목            ├── <dt> 용어
├── <li> 항목            ├── <dd> 설명
└── <li> 항목            ├── <dt> 용어
                         ├── <dd> 설명
                         ├── <dt> 용어
                         └── <dd> 설명
```

짝지음은 감싸기가 아니라 순서로 표현된다. `<dt>` 뒤에 붙은 `<dd>`가 그 `<dt>`의 설명이라는 규칙이다.

> The browser default styles will display description lists with the descriptions indented somewhat from the terms.

"브라우저 기본 스타일은 설명 목록을 보여줄 때 설명을 용어보다 조금 들여쓴다."

- **default styles**: 작성자가 CSS로 지정하지 않았을 때 브라우저가 알아서 적용하는 스타일.
- **indented somewhat from the terms**: 용어보다 조금 안쪽으로 들여쓴. 화면에서 어느 쪽이 용어이고 어느 쪽이 설명인지 구별되게 해주는 표시다.

---

## 종합

설명 목록의 마크업은 세 요소가 각자 다른 일을 맡는 구조다.

- **`<dl>`** → 여기부터 여기까지가 설명 목록이라는 범위를 잡는다
- **`<dt>`** → 설명의 대상이 되는 용어를 표시한다
- **`<dd>`** → 그 용어에 딸린 설명을 표시한다

`<li>`처럼 한 짝을 통째로 묶는 요소가 없다는 점은 처음에 어색하게 느껴지기 쉽다. 다만 이 구조 덕분에 한 용어에 설명을 여러 개 붙이는 일이 자연스럽게 가능해지는데, 그 이야기는 다음 질문에서 이어진다.

들여쓰기는 기본 스타일이므로 CSS로 얼마든지 바꿀 수 있다. 들여쓰기를 없앤다고 해서 `<dd>`가 설명이라는 사실이 사라지지는 않는다.

---

# 한 용어에 설명이 둘 이상 필요하면 어떻게 마크업하는가?

## 도입

같은 낱말이 분야에 따라 다른 뜻으로 쓰이는 일은 흔하다. 사전을 펼치면 표제어 하나 아래에 뜻풀이가 여러 줄 붙어 있는 것도 그래서다.

설명 목록도 같은 상황을 그대로 표현할 수 있다.

---

## 본문

> Note that it is permitted to have a single term with multiple descriptions, for example:

"용어 하나에 설명이 여럿 붙는 것도 허용된다는 점을 알아두라. 예를 들면 다음과 같다."

- **permitted**: 허용된다. 그렇게 해야 한다는 의무가 아니라 그래도 된다는 허용이다.
- **a single term**: 용어 하나, 곧 `<dt>` 하나.
- **multiple descriptions**: 설명 여럿, 곧 `<dd>` 여럿.

```html
<dl>
  <dt>aside</dt>
  <dd>
    In drama, where a character shares a comment only with the audience for
    humorous or dramatic effect. This is usually a feeling, thought, or piece of
    additional background information.
  </dd>
  <dd>
    In writing, a section of content that is related to the current topic, but
    doesn't fit directly into the main flow of content so is presented nearby
    (often in a box off to the side.)
  </dd>
</dl>
```

`<dt>` 하나 뒤에 `<dd>`가 둘 붙은 모습이다. 같은 낱말 aside가 연극에서 쓰일 때와 글쓰기에서 쓰일 때 뜻이 갈리는 경우라, 설명을 둘로 나눠 붙였다.

```
<dt> aside
├── <dd> 연극에서의 뜻
└── <dd> 글쓰기에서의 뜻
```

새로 배울 요소는 없고, 앞 질문에서 본 배치 규칙이 그대로 적용된 결과일 뿐이다. `<dt>` 뒤에 오는 `<dd>`가 그 용어의 설명이므로, 뒤에 둘을 붙이면 설명이 둘이 된다.

---

## 종합

설명이 여러 개인 경우를 별도 문법 없이 처리할 수 있는 이유는 `<dl>`이 짝지음을 감싸기가 아니라 순서로 표현하기 때문이다. `<li>` 같은 묶음 요소가 있었다면 그 안에 무엇을 몇 개 넣을지 규칙을 따로 정해야 했을 것이다.

마크업할 때 던질 질문은 하나로 정리된다.

- **설명 대상이 되는 낱말인가** → `<dt>`
- **그 낱말에 딸린 설명인가** → 앞의 `<dt>` 뒤에 `<dd>`를 놓는다. 필요하면 여러 개 놓는다

거꾸로 이 표현을 쓰지 않으면 어떻게 되는지도 분명하다. 뜻이 둘인 낱말을 `<dd>` 하나에 두 문단으로 몰아넣으면 화면에는 비슷하게 보이지만, 문서에는 뜻이 둘이라는 사실이 남지 않는다.
