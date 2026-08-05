# `<br>`은 어떤 상황에서 쓰는가?

## 도입

HTML은 소스 코드에 적은 줄바꿈과 연속된 공백을 대부분 무시한다. 코드에서 엔터를 아무리 눌러도 화면에서는 한 줄로 이어 붙는다.

문단을 나누는 일은 `<p>`가 맡으니 대개는 문제가 없다. 그런데 문단 안에서 줄만 나눠야 하는 글이 있다.

시나 주소처럼 줄이 어디서 끊기느냐가 내용의 일부인 경우다.

---

## 본문

> `<br>` creates a line break in a paragraph; it is the only way to force a rigid structure in a situation where you want a series of fixed short lines, such as in a postal address or a poem.

"`<br>`은 문단 안에 줄바꿈을 만든다. 짧은 줄이 정해진 대로 이어지기를 원하는 상황, 예컨대 우편 주소나 시에서 딱딱한 구조를 강제하는 유일한 방법이다."

- **a line break in a paragraph**: 문단 안의 줄바꿈. "문단 안"이라는 말이 핵심이다. 새 문단을 시작하는 것이 아니라 한 문단 안에서 줄만 끊는다.
- **the only way**: 유일한 방법. 다른 수단이 없다는 뜻이다. 코드에 엔터를 넣어도, 공백을 넣어도 화면은 바뀌지 않는다.
- **force**: 강제한다. 브라우저가 창 너비에 맞춰 알아서 줄을 접는 것과 반대로, 여기서 끊으라고 못 박는 일이다.
- **a rigid structure**: 딱딱한 구조. 창 크기가 바뀌어도 흔들리지 않는 줄 배치를 가리킨다.
- **a series of fixed short lines**: 정해진 짧은 줄이 이어지는 것. 줄 하나하나의 끝이 미리 정해져 있다는 뜻이다.
- **a postal address or a poem**: 우편 주소나 시. 둘 다 줄이 끊기는 위치 자체가 내용인 글이다.

### 시 예시

```html
<p>
  There once was a man named O'Dell<br />
  Who loved to write HTML<br />
  But his structure was bad, his semantics were sad<br />
  and his markup didn't read very well.
</p>
```

네 줄 전체가 `<p>` 하나 안에 들어 있고, 줄 끝마다 `<br>`이 붙어 있다.

> Without the `<br>` elements, the paragraph would just be rendered in one long line (as we said earlier in the course, HTML ignores most whitespace); with `<br>` elements in the code, the markup renders like this:

"`<br>` 요소가 없으면 이 문단은 그냥 한 줄로 길게 렌더링된다(앞서 말했듯 HTML은 대부분의 공백을 무시한다). 코드에 `<br>` 요소가 있으면 마크업이 이렇게 렌더링된다."

- **would just be rendered in one long line**: 그냥 한 줄로 길게 그려진다. 코드에서 네 줄로 보이는 것과 무관하게 화면은 한 줄이 된다.
- **HTML ignores most whitespace**: HTML은 대부분의 공백을 무시한다. "most"라고 적힌 것은 연속된 공백과 줄바꿈이 공백 한 칸으로 합쳐지기 때문이다. 아예 사라지는 것이 아니라 하나로 접힌다.
- **with `<br>` elements in the code**: 코드에 `<br>`이 있으면. 앞뒤로 같은 코드를 놓고 이것 하나의 유무만 비교하는 구성이다.

```
<br> 없음                                   <br> 있음
There once was a man named O'Dell Who ...   There once was a man named O'Dell
                                            Who loved to write HTML
                                            But his structure was bad, ...
                                            and his markup didn't read very well.
```

---

## 종합

`<br>`이 하는 일은 "줄을 여기서 끊는다"이지 "여기서부터 다른 이야기가 시작된다"가 아니다. 이 구분이 `<p>`와 갈리는 지점이다.

시 네 줄은 한 편의 시라서 문단 하나이고, 그 안에서 줄만 나뉜다. 각 줄을 `<p>`로 감싸면 문서에는 서로 다른 문단 네 개가 기록되어 사실과 어긋난다.

같은 판단을 같은 폴더의 [`address.md`](./address.md)에서 이미 한 번 만난다. 주소는 이름·도시·지역·국가가 줄마다 나뉘어야 하지만 그것들이 각각 별개의 문단은 아니다.

그래서 `<address>` 안의 `<p>` 하나에 `<br>`을 넣어 줄만 끊는다.

`<br>`이 없으면 어떻게 되는지는 위 비교가 그대로 보여준다. 브라우저가 창 너비에 맞춰 알아서 접어주는 줄바꿈은 창을 넓히면 사라지지만, 시의 행이 어디서 끝나는지는 창 크기와 아무 상관이 없다.

내용이 정한 줄바꿈을 문서에 적어두는 유일한 수단이 `<br>`이다.

거꾸로 이 요소를 여백 만드는 데 쓰는 것은 남용이다. 두 문단 사이를 띄우려고 `<br>`을 두세 개 늘어놓으면, 문서에는 존재하지 않는 빈 줄이 문단 안에 기록된다.

그 간격은 CSS가 할 일이다.

---

# `<hr>`은 무엇을 나타내는가?

## 도입

`<hr>`은 브라우저가 기본적으로 가로선을 그려준다. 그래서 구분선이 필요할 때 쓰는 장식용 태그로 오해하기 쉽다.

이름도 그 오해를 부추긴다. `hr`은 horizontal rule, 곧 가로선이다.

그런데 이 요소가 문서에 기록하는 것은 선이 아니다.

---

## 본문

> `<hr>` elements create a horizontal rule in the document that denotes a thematic change in the text (such as a change in topic or scene).

"`<hr>` 요소는 문서에 가로선을 만드는데, 이 선은 글의 주제적 전환(주제나 장면이 바뀌는 것 같은)을 나타낸다."

- **create a horizontal rule**: 가로선을 만든다. 앞부분은 화면에 그려지는 결과를 말한다.
- **that denotes**: 그것이 나타내는 것은. 앞의 가로선이 그냥 선이 아니라 무언가를 가리킨다는 쪽으로 문장이 꺾이는 자리다. 이 뒤가 요소의 정체다.
- **a thematic change**: 주제적 전환. 글의 겉모습이 아니라 내용이 바뀐다는 뜻이다.
- **in the text**: 글 안에서. 페이지 구획을 나누는 것이 아니라 이어지는 글 흐름 안의 일이다.
- **a change in topic or scene**: 주제나 장면의 변화. 다루던 이야기가 바뀌거나, 이야기의 무대가 옮겨가는 것이다.

### 장면이 바뀌는 예시

```html
<p>
  Ron was backed into a corner by the marauding netherbeasts. ...
</p>
<hr />
<p>
  Meanwhile, Harry was sitting at home, ...
</p>
```

앞 문단은 론이 괴물에게 몰린 장면이고, 뒤 문단은 "그동안 해리는"으로 시작해 다른 곳으로 무대를 옮긴다. 두 문단은 이어지지만 같은 장면이 아니다.

`<hr>`이 그 사이에 적어두는 것은 "여기서 장면이 바뀐다"이고, 화면의 가로선은 그 사실을 눈으로 보여주는 표현일 뿐이다.

```
<hr>이 기록하는 것       장면·주제가 여기서 바뀐다
브라우저가 그리는 것     가로선
```

---

## 종합

`<hr>`이 나타내는 것은 전환이고, 가로선은 그 전환을 브라우저가 기본으로 표현한 모습이다. 순서를 뒤집어 "선이 필요해서 `<hr>`을 쓴다"로 가면 틀린다.

판단 기준은 하나로 줄어든다. 이 자리에서 이야기가 바뀌는가.

바뀌면 `<hr>`이고, 바뀌지 않는데 그저 두 영역을 시각적으로 갈라놓고 싶은 것이라면 CSS의 `border`로 그린다. 선만 필요한 자리에 `<hr>`을 쓰면 문서에는 일어나지도 않은 전환이 기록된다.

이 요소가 [`address.md`](./address.md)·[`time.md`](./time.md)에서 본 요소들과 같은 결이라는 점도 눈여겨볼 만하다. 화면에 무엇이 그려지느냐가 아니라 그 자리가 무엇이냐로 태그가 정해진다.

`<hr>`은 그중에서도 기본 표현이 워낙 눈에 띄어 정체가 가려지기 쉬운 경우다.
