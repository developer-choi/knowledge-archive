# HTML에서 문단과 제목은 각각 어떤 요소로 마크업하는가?

## 도입

브라우저는 HTML 소스에 적힌 줄바꿈과 공백을 그대로 화면에 옮기지 않는다. 에디터에서 Enter를 아무리 눌러 문단을 나눠도, 태그로 감싸지 않은 텍스트는 한 덩어리로 흘러나온다. 그래서 "여기부터 여기까지가 한 문단", "이 줄은 제목"이라는 사실은 사람이 눈으로 알아보는 배치가 아니라 태그로 적어줘야 한다.

HTML에서 그 역할을 맡는 가장 기본적인 두 요소가 `<p>`와 `<h1>`~`<h6>`이다.

---

## 본문

> Most structured text consists of headings and paragraphs, whether you are reading a story, a newspaper, a college textbook, a magazine, etc.

"소설이든 신문이든 대학 교재든 잡지든, 구조화된 텍스트 대부분은 제목과 문단으로 이루어져 있다."

- **structured text**: 글자가 그냥 이어진 것이 아니라 "제목 아래 본문" 같은 짜임새를 가진 텍스트.
- **consists of**: ~로 구성된다. 제목과 문단이 글의 기본 부품이라는 뜻이다.

> Structured content makes the reading experience easier and more enjoyable.

"구조화된 콘텐츠는 읽는 경험을 더 수월하고 즐겁게 만든다."

독자는 제목만 훑어 원하는 부분으로 건너뛰고, 문단 사이 여백으로 생각의 단위를 나눈다. 구조는 장식이 아니라 읽기 방식 그 자체다.

> They aren't marked up in any way, but they are separated with line breaks (Enter/Return pressed to go onto the next line).
> However, when you open the document in your browser, you'll see that the text appears as a big chunk!

"마크업 없이 줄바꿈(Enter)으로만 구분해 둔 문서를 브라우저로 열면 텍스트가 한 덩어리로 뭉쳐 보인다."

MDN은 후무스 레시피를 담은 `text-start.html` 예제로 이 상황을 보여준다. 소스에서는 재료 목록과 조리법이 줄바꿈으로 가지런히 나뉘어 있지만, 브라우저 화면에서는 전부 한 줄기로 이어져 나온다.

- **marked up**: 태그로 감싸 의미를 표시한 상태. 이게 없으면 브라우저 입장에서는 그냥 글자열일 뿐이다.
- **line breaks**: 소스 파일의 줄바꿈. 사람 눈에는 구분선이지만 브라우저는 이를 공백 하나로 취급해 렌더링에 반영하지 않는다.
- **a big chunk**: 한 덩어리. 무엇이 제목이고 무엇이 문단인지 브라우저가 알 방법이 없으니 전부 같은 텍스트로 흘려보낸 결과다.

> In HTML, each paragraph has to be wrapped in a `<p>` element, like so:
>
> ```html
> <p>I am a paragraph, oh yes I am.</p>
> ```

"HTML에서 각 문단은 `<p>` 요소로 감싸야 한다."

- **each**: 문단마다 하나씩. 문단 세 개를 `<p>` 하나에 몰아넣는 것이 아니라 `<p>` 세 개를 쓴다.
- **wrapped in**: 여는 태그와 닫는 태그 사이에 넣어 감싼다. 감싸는 행위 자체가 "이 범위가 한 문단"이라는 선언이다.

> Each heading has to be wrapped in a heading element:
>
> ```html
> <h1>I am the title of the story.</h1>
> ```

"각 제목은 헤딩 요소로 감싸야 한다."

- **heading element**: 제목을 나타내는 요소. `<h1>`부터 `<h6>`까지 여섯 개가 있다.
- **has to**: 선택이 아니라 요구사항이라는 어감. 제목처럼 보이게 굵고 크게만 만드는 것으로는 제목이 되지 않는다.

---

## 종합

문단과 제목을 태그로 감싸는 일은 "보기 좋게 만들기"가 아니라 "브라우저에게 이 텍스트가 무엇인지 알려주기"다. 태그가 없으면 줄바꿈은 렌더링에서 사라지고, 브라우저는 제목과 본문을 구별할 근거를 하나도 갖지 못한다.

`<p>`로 감싸는 순간 그 범위가 하나의 문단이 되고 앞뒤로 여백이 생기며, `<h1>`으로 감싸는 순간 그 줄이 제목이 된다.

`<div>`로 감싸도 화면상 비슷하게 만들 수는 있다. 다만 그때 브라우저에게 전달되는 정보는 "여기 구획이 하나 있다"뿐이고, 문단인지 제목인지는 전달되지 않는다.

태그를 고를 때의 기준이 생김새가 아니라 "이 텍스트가 무엇인가"인 이유가 여기 있다.

---

# 헤딩 요소 `<h1>`~`<h6>`의 숫자는 무엇을 의미하는가?

## 도입

`<h1>`이 크고 `<h6>`이 작게 보이는 탓에 숫자를 글자 크기 단계로 오해하기 쉽다. 하지만 그 크기 차이는 브라우저가 넣어둔 기본 스타일일 뿐이고, CSS 한 줄이면 `<h6>`을 `<h1>`보다 크게 만들 수도 있다.

숫자가 진짜로 나타내는 것은 글의 목차상 깊이, 곧 내용의 위계다.

---

## 본문

> There are six heading elements: h1, h2, h3, h4, h5, and h6. Each element represents a different level of content in the document;

"헤딩 요소는 여섯 개이며, 각 요소는 문서 안에서 서로 다른 내용 수준을 나타낸다."

- **level of content**: 글자 크기 단계가 아니라 내용의 깊이. 목차를 그렸을 때 몇 번째 들여쓰기에 놓이는지에 해당한다.
- **represents**: 그렇게 보이게 만든다가 아니라 그것을 뜻한다. 겉모습은 CSS의 몫이고, 요소가 지는 책임은 의미 표시다.

> `<h1>` represents the main heading, `<h2>` represents subheadings, `<h3>` represents sub-subheadings, and so on.

"`<h1>`은 주요 제목, `<h2>`는 그 아래 제목, `<h3>`은 다시 그 아래 제목을 나타내며, 이런 식으로 이어진다."

- **main heading**: 문서 전체를 대표하는 제목.
- **sub-**: 바로 위 단계에 딸려 있음을 뜻하는 접두사. `<h3>`은 아무 데나 붙는 것이 아니라 직전 `<h2>`의 하위 절이다.

> For example, in this story, the `<h1>` element represents the title of the story, the `<h2>` elements represent the title of each chapter, and the `<h3>` elements represent subsections of each chapter:

"예를 들어 소설에서 `<h1>`은 소설 제목, `<h2>`는 각 장의 제목, `<h3>`은 각 장의 하위 절을 나타낸다."

```html
<h1>The Crushing Bore</h1>

<p>By Chris Mills</p>

<h2>Chapter 1: The dark night</h2>

<p>
  It was a dark night. Somewhere, an owl hooted. The rain lashed down on the…
</p>

<h2>Chapter 2: The eternal silence</h2>

<p>Our protagonist could not so much as a whisper out of the shadowy figure…</p>

<h3>The specter speaks</h3>

<p>
  Several more hours had passed, when all of a sudden the specter sat bolt
  upright and exclaimed, "Please have mercy on my soul!"
</p>
```

이 마크업이 만들어내는 위계를 그림으로 펴면 이렇게 된다.

```
h1  The Crushing Bore                 문서 전체 제목
├── p   By Chris Mills
├── h2  Chapter 1: The dark night     1장
│   └── p   It was a dark night…
└── h2  Chapter 2: The eternal silence 2장
    ├── p   Our protagonist…
    └── h3  The specter speaks         2장의 하위 절
        └── p   Several more hours…
```

`<h3>`이 두 번째 `<h2>` 뒤에 왔으므로 이 절은 2장에 속한다. 위치와 숫자만으로 소속이 결정된다는 점이 핵심이다.

> It's really up to you what the elements involved represent, as long as the hierarchy makes sense.

"위계만 말이 된다면, 각 요소가 무엇을 나타낼지는 작성자에게 달려 있다."

- **up to you**: 정하는 몫이 작성자에게 있다. 소설이면 장·절, 문서 페이지면 섹션·소섹션처럼 대상에 맞게 배정하면 된다.
- **hierarchy**: 위계. 상위·하위 관계가 있는 층 구조.
- **makes sense**: 앞뒤가 맞는다. `<h2>` 없이 `<h1>` 다음에 곧장 `<h3>`이 나오면 "무엇의 하위 절인가"에 답할 수 없어 위계가 깨진다.

---

## 종합

헤딩의 숫자는 목차의 들여쓰기 깊이다. `<h1>`은 문서 전체, `<h2>`는 그 아래 묶음, `<h3>`은 다시 그 아래 묶음이며, 어떤 헤딩이 누구에게 속하는지는 숫자와 등장 순서로 정해진다.

그래서 소설이라면 제목·장·절에, 제품 소개 페이지라면 페이지 제목·섹션·소섹션에 각각 배정하면 된다.

주의할 점은 크기와 위계를 맞바꾸는 실수다. "이 줄을 작게 쓰고 싶어서 `<h4>`"는 위계를 크기 조절 손잡이로 쓰는 것이고, 그 순간 문서 구조는 화면에 보이는 것과 달라진다.

크기가 마음에 안 들면 CSS의 `font-size`를 바꾸는 것이 맞다. 요소 선택은 "이 텍스트가 몇 번째 깊이의 제목인가"만 보고 한다.

---

# 한 페이지에 `<h1>`은 몇 개 두는 것이 권장되며, 왜인가?

## 도입

한 페이지에 큰 제목이 여러 개 필요해 보이는 상황은 흔하다. 이때 전부 `<h1>`로 쓰면 어떻게 되는지, 그리고 왜 하나만 쓰라고 권하는지를 위계의 관점에서 보면 답이 단순해진다.

---

## 본문

> Preferably, you should use a single `<h1>` per page—this is the top level heading, and all others sit below this in the hierarchy.

"되도록 페이지당 `<h1>`은 하나만 쓰는 것이 좋다. 이것이 최상위 제목이고, 나머지 헤딩은 모두 그 아래 위계에 놓인다."

- **preferably**: 되도록이면. 문법 오류가 되는 금지 규칙이 아니라 권장이라는 뜻이다.
- **a single ... per page**: 페이지당 하나. 페이지 전체를 한마디로 대표하는 제목은 하나뿐이라는 관점에서 나온다.
- **top level heading**: 위계의 꼭대기. 트리로 치면 뿌리에 해당한다.
- **sit below this**: 나머지가 그 아래에 자리 잡는다. `<h1>`이 하나여야 나머지 헤딩이 매달릴 지점이 하나로 정해진다.

`<h1>`이 여럿이면 위계가 어떻게 갈라지는지 비교해 보면 분명해진다.

```
[h1 하나]                      [h1 여럿]
h1 제품 소개                    h1 제품 소개
├── h2 기능                     ├── h2 기능
│   └── h3 오프라인 모드         h1 가격          ← 새 뿌리
└── h2 가격                     └── h2 연간 결제
                                h1 고객 지원      ← 또 새 뿌리
"이 페이지는 무엇에 관한 글인가"   → 페이지 하나에 문서가 셋
→ 답이 하나                     → 답이 셋
```

왼쪽에서는 모든 헤딩이 하나의 뿌리 아래 모여 페이지 전체가 한 그루 나무가 된다. 오른쪽에서는 `<h1>`이 나올 때마다 뿌리가 새로 생겨, 문서 하나가 아니라 서로 무관한 문서 여러 개가 한 페이지에 붙어 있는 모양이 된다.

이 상태에서는 "이 페이지가 무엇에 관한 글인가"라는 질문에 문서 스스로 답하지 못한다.

---

## 종합

`<h1>` 하나 규칙의 근거는 개수 제한 자체가 아니라 위계에 뿌리가 하나여야 한다는 데 있다. 뿌리가 하나면 나머지 헤딩이 자기 자리를 찾고, 목차를 뽑아도 한 장의 트리가 나온다.

뿌리가 여럿이면 같은 페이지 안에서 서로 대등한 문서가 여러 개 있다는 뜻이 되어, 헤딩을 따라 읽는 쪽에서 글의 범위를 잡을 수 없다.

실무에서 큰 제목이 여럿 필요해지는 경우 대부분은 진짜로 최상위 제목이 여럿인 게 아니라, 페이지의 큰 구획들이 같은 층에 나란히 있는 상황이다. 그럴 때는 페이지 제목을 `<h1>`으로 하나 두고 구획들을 `<h2>`로 내리면 위계가 맞는다.

크기가 아쉬우면 CSS로 키우면 되고, 그 편이 화면 모습과 문서 구조를 동시에 만족시킨다.

---

# 왜 한 페이지의 헤딩 레벨을 세 단계 이내로 쓰라고 권하는가?

## 도입

헤딩은 여섯 단계까지 있지만, 여섯 단계를 다 쓰는 페이지는 거의 없다. 깊이를 늘리는 일에는 대가가 따르기 때문이다. 그 대가가 무엇인지가 이 권장의 근거다.

---

## 본문

> Of the six heading levels available, you should aim to use no more than three per page, unless you feel it is necessary.

"사용할 수 있는 여섯 단계 중, 꼭 필요하다고 판단되지 않는 한 페이지당 세 단계를 넘지 않도록 하는 것이 좋다."

- **aim to**: ~하도록 지향한다. 반드시 지켜야 하는 제약이 아니라 기본값으로 삼을 목표라는 어감이다.
- **no more than three**: 세 단계 이하. 헤딩 개수가 아니라 깊이의 종류를 세는 것이다. `<h2>`가 열 개 있어도 `<h1>`·`<h2>`·`<h3>`만 쓰면 세 단계다.
- **unless you feel it is necessary**: 필요하다고 판단되면 예외를 둘 수 있다. 규격 문서나 긴 매뉴얼처럼 깊이가 실제로 필요한 글이 있다.

> Documents with many levels (for example, a deep heading hierarchy) become unwieldy and difficult to navigate.

"단계가 많은 문서, 즉 헤딩 위계가 깊은 문서는 다루기 힘들고 훑어 나가기 어려워진다."

- **deep heading hierarchy**: 깊은 헤딩 위계. `<h1>` 아래 `<h2>`, 그 아래 `<h3>`, 다시 `<h4>`·`<h5>`처럼 층이 계속 쌓인 상태.
- **unwieldy**: 크고 복잡해서 다루기 버거운. 글을 쓰는 쪽에서도 새 항목을 어느 층에 넣을지 매번 헷갈리게 된다.
- **navigate**: 문서 안을 돌아다니며 원하는 곳을 찾는 일. 헤딩은 원래 그 이동을 돕는 이정표인데, 층이 너무 많으면 이정표가 오히려 길을 헷갈리게 만든다.

깊이가 늘어날 때 목차가 어떻게 변하는지 보면 체감이 된다.

```
세 단계                        여섯 단계
h1 가이드                      h1 가이드
├── h2 설치                    └── h2 설치
│   ├── h3 macOS                   └── h3 macOS
│   └── h3 Windows                     └── h4 Homebrew
└── h2 설정                                └── h5 버전 고정
    └── h3 환경 변수                           └── h6 예시

한눈에 전체가 잡힌다           끝 항목이 어디 소속인지
                              위로 다섯 줄 되짚어야 안다
```

---

## 종합

세 단계 권장의 근거는 미관이 아니라 읽는 쪽과 쓰는 쪽 모두의 부담이다. 헤딩의 쓸모는 글 전체 지도를 짧게 보여주는 데 있는데, 층이 깊어지면 지도 자체가 원문만큼 복잡해져 훑어보는 이득이 사라진다.

쓰는 쪽에서도 새 내용을 넣을 때 "이건 `<h4>`인가 `<h5>`인가"를 매번 판단해야 하고, 그 판단이 흔들리면 위계는 금세 어긋난다.

깊이가 자꾸 늘어난다면 대개는 헤딩 레벨이 모자란 것이 아니라 한 페이지가 너무 많은 주제를 담고 있다는 신호다. 그럴 때는 `<h5>`·`<h6>`을 동원하기보다 페이지를 나누는 편이 낫다.

나누고 나면 각 페이지가 다시 `<h1>` 하나에 두세 단계짜리 얕은 위계를 갖게 되고, 앞의 `<h1>` 하나 규칙과도 자연스럽게 맞물린다.
