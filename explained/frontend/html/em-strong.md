# `<em>` 요소는 무엇을 나타내며, 어떤 자리에 쓰는가?

## 도입

같은 문장이라도 어느 낱말에 힘을 주느냐에 따라 전달되는 뜻이 달라진다. 말에서는 목소리로 힘을 주고, 글에서는 그 자리를 기울임꼴로 표시해 왔다.

`<em>`은 그 "힘이 실리는 자리"를 문서에 적어두는 요소다. 화면에서 기울어 보이는 것은 브라우저가 얹어둔 기본 스타일일 뿐이고, 요소가 지는 책임은 강조 지점을 표시하는 쪽이다.

---

## 본문

> When we want to add emphasis in spoken language, we stress certain words, subtly altering the meaning of what we are saying.

"말로 강조하고 싶을 때 우리는 특정 낱말에 힘을 주고, 그러면 하려는 말의 뜻이 미묘하게 달라진다."

- **emphasis**: 강조. 여기서는 "여러 낱말 중 하나에 힘을 실어 두드러지게 만드는 일"을 가리킨다.
- **stress**: 그 낱말을 더 세게, 더 길게 발음하는 것.
- **subtly altering**: 미묘하게 바꾼다. 문장을 다시 쓰지 않고 힘 주는 자리만 옮겨도 뜻이 달라진다는 말이다.

> Similarly, in written language we tend to stress words by putting them in italics.

"글에서도 마찬가지로, 낱말을 기울임꼴로 만들어 강조하는 편이다."

- **italics**: 기울임꼴.
- **tend to**: 그렇게 하는 편이라는 어감. 문법 규칙이 아니라 오래 굳어진 표기 관행이다.

MDN은 같은 문장을 기울임 없이 쓴 것과 기울여 쓴 것을 나란히 놓아 이 차이를 보여준다.

> I am glad you weren't late.
> I am *glad* you weren't *late*.

> The first sentence sounds genuinely relieved that the person wasn't late.

"첫 문장은 상대가 늦지 않아서 진심으로 안도한 것처럼 들린다."

- **genuinely relieved**: 진심으로 안도한. 말 그대로 다행이라는 뜻으로 읽힌다.

> In contrast, the second one, with both the words "glad" and "late" in italics, sounds sarcastic or passive-aggressive, expressing annoyance that the person arrived a bit late.

"반면 glad와 late 두 낱말에 기울임을 준 둘째 문장은 비꼬거나 은근히 불만을 드러내는 투로 들리며, 상대가 조금 늦은 데 대한 짜증을 표현한다."

- **in contrast**: 앞의 것과 대비해서.
- **sarcastic**: 비꼬는.
- **passive-aggressive**: 대놓고 화내지는 않으면서 은근히 불만을 내비치는 태도.
- **annoyance**: 짜증.

글자는 한 자도 바뀌지 않았는데 강조 위치만으로 뜻이 뒤집혔다. 이 뒤집힘을 문서에 남기는 수단이 `<em>`이다.

> In HTML we use the `<em>` (emphasis) element to mark up such instances.

"HTML에서는 이런 자리를 `<em>`(emphasis) 요소로 마크업한다."

- **mark up**: 태그로 감싸 "이 부분이 무엇인지"를 표시하는 일.
- **such instances**: 앞에서 말한 사례들, 곧 말이었다면 힘을 주었을 자리.

```html
<p>I am <em>glad</em> you weren't <em>late</em>.</p>
```

문장 전체가 아니라 힘이 실리는 낱말만 골라 감싼다는 점이 요점이다. 감싸는 범위가 곧 "어디에 힘이 실리는가"라서, 범위를 넓히면 강조 지점이 흐려진다.

---

## 종합

`<em>`이 나타내는 것은 기울임이라는 모양이 아니라 "여기에 힘이 실린다"는 사실이다. 말로 읽을 때 목소리가 올라갈 자리가 있으면 그 자리가 `<em>`을 쓸 자리다.

그래서 태그를 고르는 기준이 단순해진다.

- **낱말 하나를 강하게 읽어야 문장 뜻이 제대로 산다** → `<em>`
- **읽는 세기와 무관하게 그냥 기울여 보이기만 하면 된다** → `<em>`이 아니다

이 표시가 없으면 어떻게 되는지를 뒤집어 보면 존재 이유가 분명해진다. CSS로 `font-style: italic`만 주면 화면은 똑같이 기울어지지만, 문서에는 "이 낱말에 힘이 실린다"는 정보가 한 글자도 기록되지 않는다.

화면을 보는 사람은 기울기로 알아채겠지만, 문서를 글자 그대로 읽는 쪽에는 앞의 두 문장이 완전히 같은 문장으로 전달된다.

---

# `<strong>` 요소는 무엇을 나타내며, 어떤 자리에 쓰는가?

## 도입

강조와 중요도는 비슷해 보이지만 다른 것을 가리킨다. 강조는 "이 낱말을 세게 읽어라"이고, 중요도는 "이 대목을 놓치면 곤란하다"이다.

앞의 것을 맡는 요소가 `<em>`이고, 뒤의 것을 맡는 요소가 `<strong>`이다.

---

## 본문

> To emphasize important words, we tend to stress them in spoken language and bold them in written language.

"중요한 낱말을 두드러지게 하려고, 말에서는 힘을 주고 글에서는 굵게 만드는 편이다."

- **important**: 중요한. 여기서는 "읽는 사람이 반드시 알아야 하는"에 가깝다. 문장의 뉘앙스를 조절하는 `<em>`과 갈리는 지점이 바로 이 낱말이다.
- **bold**: 굵게 만들다. 기울임이 강조의 관행적 표기였듯, 굵게 쓰기는 중요도의 관행적 표기다.

> In HTML we use the `<strong>` (strong importance) element to mark up such instances.

"HTML에서는 이런 자리를 `<strong>`(strong importance) 요소로 마크업한다."

- **strong importance**: 강한 중요도. 요소 이름이 `bold`가 아니라 `strong`인 이유가 여기 있다. 나타내는 것이 굵기라는 모양이 아니라 중요도라는 성질이기 때문이다.

MDN이 든 두 예시를 보면 어떤 대목이 이에 해당하는지 감이 잡힌다.

> This liquid is highly toxic.
> I am counting on you. Do not be late!

"이 액체는 독성이 매우 강하다", "너만 믿는다. 늦지 마라!" 처럼 놓치면 곤란한 대목들이다. 문장의 어감을 다듬는 것이 아니라 경고와 지시를 담고 있다.

```html
<p>This liquid is <strong>highly toxic</strong>.</p>

<p>I am counting on you. <strong>Do not</strong> be late!</p>
```

둘째 예시에서 감싼 범위가 문장 전체가 아니라 `Do not` 두 낱말이라는 점을 볼 만하다. 지각하지 말라는 지시에서 사활이 걸린 부분은 부정어이므로 거기만 감쌌다.

---

## 종합

`<strong>`이 나타내는 것은 굵기가 아니라 "이 대목의 중요도가 높다"는 사실이다. 경고문, 필수 입력 안내, 하지 말아야 할 동작처럼 놓치면 사고가 나는 자리가 여기에 해당한다.

`<em>`과 나란히 놓으면 선택 기준이 갈린다.

```
                 <em>                        <strong>
나타내는 것      강조 (읽는 세기)             중요도 (놓치면 곤란함)
말로 치면        목소리를 세게                "이건 꼭 들어"
바꾸는 것        문장의 뉘앙스                내용의 무게
기본 모양        기울임                       굵게
전형적인 자리    뜻이 갈리는 낱말              경고 · 금지 · 필수 안내
```

기본 모양이 기울임이냐 굵기냐는 브라우저가 정한 관행일 뿐이고, CSS로 얼마든지 바꿀 수 있다. 요소를 고를 때 보는 것은 아래 두 줄, 곧 "무엇을 나타내는가"다.

이 구분이 없으면 어떻게 되는지도 분명하다. 경고 문구를 CSS로 굵게만 만들어 두면 화면에서는 눈에 띄지만, 문서상으로는 주변 문장과 똑같은 무게의 평범한 텍스트로 남는다.

---

# 기울임이나 굵은 글씨로 보이게 하려고 `<em>`·`<strong>`을 써도 되는가?

## 도입

`<em>`은 기울어 보이고 `<strong>`은 굵어 보이니, 그 모양이 필요할 때 손이 먼저 가기 쉽다. 그런데 이 두 요소는 모양을 만드는 도구가 아니라 의미를 적는 도구이고, 브라우저가 얹어준 기본 모양은 부수적으로 딸려오는 것에 가깝다.

모양만 원하면서 이 태그를 쓰면 원하지 않은 의미까지 문서에 함께 기록된다.

---

## 본문

> Browsers style this as italic by default, but you shouldn't use this tag purely to get italic styling.

"브라우저가 기본값으로 기울임꼴을 입혀주기는 하지만, 기울임 스타일을 얻으려는 목적만으로 이 태그를 써서는 안 된다."

- **by default**: 기본값으로. 작성자가 지정하지 않았을 때 브라우저가 알아서 적용하는 스타일이며, CSS로 덮어쓰면 사라진다.
- **purely**: 오로지 그 목적만으로. 의미도 맞으면서 모양도 원하는 경우까지 금지하는 것은 아니다.

> To do that, you'd use a `<span>` element and some CSS, or perhaps an `<i>` element (see below).

"그럴 때는 `<span>` 요소에 CSS를 쓰거나, 경우에 따라 `<i>` 요소를 쓴다."

- **`<span>` and some CSS**: 의미는 붙이지 않고 스타일만 걸고 싶을 때의 기본 선택지다. 아무 의미도 갖지 않는 요소라 원하지 않은 정보가 문서에 섞이지 않는다. 자세한 것은 같은 폴더의 [`div-span.md`](./div-span.md)가 다룬다.
- **perhaps an `<i>` element**: 기울여 표기하는 관행이 있는 특정한 뜻(학명, 외국어 낱말 등)일 때의 선택지다. 조건이 붙어 있어 "경우에 따라"라고 적었다.

굵은 글씨 쪽도 문장 구조가 그대로 반복된다.

> Browsers style this as bold text by default, but you shouldn't use this tag purely to get bold styling.
> To do that, you'd use a `<span>` element and some CSS, or perhaps a `<b>` element (see below).

"브라우저가 기본값으로 굵게 그려주기는 하지만 굵기만 얻으려고 이 태그를 쓰면 안 되고, 그럴 때는 `<span>`에 CSS를 쓰거나 경우에 따라 `<b>`를 쓴다."

같은 말을 기울임과 굵기 양쪽에 똑같이 한 번씩 한 셈이다. 요소가 다르고 기본 모양이 달라도 판단 기준은 하나라는 뜻이다.

---

## 종합

기준은 "어떤 모양을 원하는가"가 아니라 "이 텍스트가 무엇인가"다. 힘이 실리는 낱말이면 `<em>`, 놓치면 곤란한 대목이면 `<strong>`이고, 둘 다 아닌데 모양만 필요하면 그 자리에 이 태그를 쓰지 않는다.

모양만 필요할 때의 선택지는 두 갈래다.

- **나타낼 의미가 아예 없다** → `<span>` + CSS
- **기울임·굵게로 표기하는 관행이 있는 특정한 뜻이다** (학명, 제품명 등) → `<i>`·`<b>`

앞의 갈래가 [`div-span.md`](./div-span.md)에서 다룬 "의미를 주고 싶지 않을 때 `<span>`"과 정확히 같은 이야기다. 태그 선택은 역할 표시이고 CSS는 픽셀 조정이라는 구분이 여기서도 그대로 적용된다.

이 규칙을 어겼을 때의 손해는 화면에 드러나지 않아 발견이 늦다. 디자인상 굵게만 하고 싶어서 `<strong>`으로 감싼 낱말은 문서상 "특별히 중요한 대목"으로 기록되고, 정작 진짜 중요한 경고문과 같은 무게로 취급된다.

강조 표시가 여기저기 흩어지면 표시가 있다는 사실 자체가 정보를 잃는다.

---

# 한 부분이 중요하면서 동시에 강조도 필요하면 어떻게 마크업하는가?

## 도입

`<em>`과 `<strong>`은 서로 다른 것을 나타내므로 한쪽을 골라야 하는 양자택일이 아니다. "놓치면 곤란한 대목인데 그 안에서도 특히 한 낱말에 힘이 실린다"는 상황은 실제로 흔하다.

---

## 본문

> You can nest strong and emphasis inside one another if desired.

"원한다면 `<strong>`과 `<em>`을 서로 안쪽에 겹쳐 넣을 수 있다."

- **nest**: 한 요소 안에 다른 요소를 넣어 감싸는 것. HTML에서 태그를 겹쳐 쓰는 일반적인 방식 그대로다.
- **inside one another**: 서로 안쪽에. 어느 쪽이 바깥이어야 한다는 순서 규정은 없고, 바깥이 넓은 범위, 안쪽이 좁은 범위를 맡는다.
- **if desired**: 필요하면. 겹쳐야 한다는 의무가 아니라 그래도 된다는 허용이다.

```html
<p>This liquid is <strong>highly toxic</strong> — if you drink it, <strong>you may <em>die</em></strong>.</p>
```

바깥 `<strong>`이 "you may die" 전체를 중요한 대목으로 표시하고, 그 안의 `<em>`이 "die" 한 낱말에 힘을 싣는다. 겹친 결과를 말로 읽으면 문장 전체를 무겁게 읽되 마지막 낱말에서 목소리가 더 올라가는 모양이 된다.

MDN 실습의 정답 마크업을 보면 세 가지 경우가 한 화면에 모여 있다.

```html
<h1><em>Emphasis</em> and <strong>importance</strong></h1>

<p>
  My new coffee machine is called <strong>The Percolator 2000</strong>. It
  produces the most <em>sublime</em> and <em>wonderful</em> brew.
</p>

<p>
  In the dead of winter, it will be <strong>cold</strong>. You should
  <strong>wrap up warm to avoid <em>falling ill</em></strong>.
</p>
```

각 자리에 어느 요소가 왜 갔는지 짚으면 이렇다.

- **제품명 `The Percolator 2000`** → `<strong>`. 이 문단에서 독자가 기억해야 할 핵심 정보다.
- **커피를 묘사한 형용사 `sublime`·`wonderful`** → `<em>`. 중요한 사실이 아니라 말맛을 살리는 자리이므로 힘만 싣는다.
- **`cold`, `wrap up warm to avoid falling ill`** → `<strong>`. 알아둬야 할 사실과 따라야 할 행동이다.
- **`falling ill`** → `<strong>` 안의 `<em>`. 중요한 문장 안에서 특히 세게 읽히는 낱말이라 둘 다 필요하다.

---

## 종합

겹쳐 쓰기가 성립하는 이유는 두 요소가 같은 축 위에 있지 않기 때문이다. 중요도는 "이 대목을 놓치지 마라"를 말하고 강조는 "이 낱말을 세게 읽어라"를 말하므로, 한 텍스트가 두 성질을 동시에 가질 수 있다.

그래서 마크업할 때는 두 질문을 따로 던지면 된다.

- **이 범위가 놓치면 곤란한 대목인가** → 그 범위를 `<strong>`으로 감싼다
- **그 안에서 특히 힘이 실리는 낱말이 있는가** → 그 낱말만 `<em>`으로 한 겹 더 감싼다

범위가 넓은 쪽이 바깥, 좁은 쪽이 안쪽이 되므로 대개 `<strong>` 안에 `<em>`이 들어가는 모양이 된다. 반대로 강조하려는 문구 안의 일부만 특별히 중요한 상황이면 `<em>` 안에 `<strong>`이 들어가도 된다.

주의할 점은 겹치기를 "더 세게 만드는 손잡이"로 쓰는 것이다. 굵고 기울어진 모양을 얻으려고 두 태그를 함께 두르면, 문서에는 중요도와 강조가 둘 다 기록되어 정작 두 가지가 진짜로 겹치는 자리와 구별되지 않는다.
