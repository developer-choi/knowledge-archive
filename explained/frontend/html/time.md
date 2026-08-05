# `<time>`은 어떤 내용을 마크업할 때 쓰는가?

## 도입

날짜와 시각은 페이지에 흔히 등장한다. 글 쓴 날, 공연 일시, 상품 출시일 같은 것이다.

화면에 보이는 것은 그저 글자라서 `<span>`으로 감싸도 똑같이 보인다.

그런데 날짜에는 다른 텍스트에 없는 사정이 하나 있다. 같은 하루를 가리키는 표기 방식이 사람마다 나라마다 다르다는 점이다.

HTML은 이 사정을 위한 요소를 따로 두고 있다.

---

## 본문

> HTML also provides the `<time>` element for marking up times and dates in a machine-readable format.

"HTML은 시각과 날짜를 기계가 읽을 수 있는 형식으로 마크업하기 위한 `<time>` 요소도 제공한다."

- **times and dates**: 시각과 날짜. 둘 다 이 요소가 담당한다.
- **machine-readable**: 기계가 읽을 수 있는. 사람이 읽고 이해하는 것과 프로그램이 해석하는 것을 갈라 놓는 낱말이다.
- **format**: 형식. 뜻이 아니라 적는 방식을 가리킨다. 같은 날짜라도 적는 방식은 여러 가지일 수 있다는 전제가 여기 깔려 있다.

```html
<time datetime="2016-01-20">20 January 2016</time>
```

한 요소 안에 같은 날짜가 두 벌 들어 있다. 태그 사이의 `20 January 2016`은 화면에 보이는 사람용 표기이고, `datetime` 속성의 `2016-01-20`은 프로그램이 읽는 표기다.

```
<time datetime="2016-01-20">20 January 2016</time>
                │           │
                │           └─ 사람이 읽는 표기
                └─ 프로그램이 읽는 표기
```

### 왜 두 벌로 적는가

> Well, there are many different ways that humans write down dates.

"사람이 날짜를 적는 방식이 아주 여러 가지이기 때문이다."

- **many different ways**: 아주 여러 가지 방식. 표기가 하나로 정해져 있지 않다는 것이 문제의 출발점이다.
- **write down**: 적어 두다. 날짜라는 같은 사실을 글자로 옮기는 단계에서 갈라진다는 말이다.

MDN이 같은 하루를 적는 방식을 나열한 것을 보면 갈라지는 폭이 드러난다.

```
20 January 2016
20th January 2016
Jan 20 2016
20/01/16
01/20/16
The 20th of next month
20e Janvier 2016
2016 年 1 月 20 日
And so on.
```

같은 날을 가리키는데 생김새가 전부 다르다. 눈여겨볼 것이 몇 가지 있다.

- `20/01/16`과 `01/20/16`은 날짜와 달의 자리가 서로 뒤바뀌어 있다. 앞자리를 날짜로 읽는 곳과 달로 읽는 곳이 갈리기 때문에, `03/04/16` 같은 표기는 3월 4일인지 4월 3일인지 정할 수 없다.
- `The 20th of next month`는 "다음 달"이 언제인지 알아야만 풀린다. 글자 안에 답이 없고 기준이 밖에 있다.
- `20e Janvier 2016`과 `2016 年 1 月 20 日`은 언어 자체가 다르다.

> But these different forms cannot be easily recognized by computers — what if you wanted to automatically grab the dates of all events in a page and insert them into a calendar?

"그런데 이렇게 제각각인 형태는 컴퓨터가 쉽게 알아보지 못한다. 페이지에 있는 모든 일정의 날짜를 자동으로 긁어다 달력에 넣고 싶다면 어떻게 할까?"

- **these different forms**: 앞에 나열한 제각각인 표기들.
- **cannot be easily recognized**: 쉽게 알아보지 못한다. 아예 불가능하다가 아니라 표기마다 규칙을 따로 만들어야 해서 감당이 안 된다는 쪽에 가깝다.
- **automatically grab**: 자동으로 긁어오다. 사람이 하나씩 읽어 옮기는 것이 아니라 프로그램이 훑어 뽑아내는 것이다.
- **insert them into a calendar**: 달력에 집어넣다. 뽑아낸 날짜를 다른 프로그램이 곧바로 쓰는 상황이다.

이 물음이 `datetime` 속성이 있는 이유를 그대로 말해준다. 화면 글자는 사람이 읽기 좋은 대로 두고, 프로그램이 볼 표기를 따로 붙여 두면 양쪽이 다 만족된다.

> The `<time>` element allows you to attach an unambiguous, machine-readable time/date for this purpose.

"`<time>` 요소는 이 목적을 위해 모호하지 않은, 기계가 읽을 수 있는 시각·날짜를 붙일 수 있게 해준다."

- **attach**: 붙이다. 화면 글자를 바꾸는 것이 아니라 옆에 하나 더 달아 둔다는 어감이다. 그래서 보이는 표기는 원하는 대로 유지된다.
- **unambiguous**: 모호하지 않은. `20/01/16`처럼 두 가지로 읽힐 여지가 없다는 뜻이다. 이 낱말이 앞서 나열한 표기들과 갈리는 지점이다.
- **for this purpose**: 이 목적을 위해. 바로 앞 물음, 곧 날짜를 프로그램이 뽑아 쓰는 일을 가리킨다.

#### `datetime`에 넣을 수 있는 값의 여러 모양

```html
<!-- Standard simple date -->
<time datetime="2016-01-20">20 January 2016</time>
<!-- Just year and month -->
<time datetime="2016-01">January 2016</time>
<!-- Just month and day -->
<time datetime="01-20">20 January</time>
<!-- Just time, hours and minutes -->
<time datetime="19:30">19:30</time>
<!-- You can do seconds and milliseconds too! -->
<time datetime="19:30:01.856">19:30:01.856</time>
<!-- Date and time -->
<time datetime="2016-01-20T19:30">7.30pm, 20 January 2016</time>
<!-- Date and time with timezone offset -->
<time datetime="2016-01-20T19:30+01:00">
  7.30pm, 20 January 2016 is 8.30pm in France
</time>
<!-- Calling out a specific week number -->
<time datetime="2016-W04">The fourth week of 2016</time>
```

값의 모양이 여러 가지인 것은 가리키려는 시점의 굵기가 상황마다 다르기 때문이다.

- **연·월까지만**: `2016-01`. 며칠인지는 말하지 않는 경우다.
- **월·일까지만**: `01-20`. 연도를 말하지 않는 경우다.
- **시각만**: `19:30`. 더 잘게는 `19:30:01.856`.
- **날짜와 시각을 함께**: `2016-01-20T19:30`. 가운데 `T`가 날짜 부분과 시각 부분을 잇는 자리다.
- **시간대 차이를 더해**: `2016-01-20T19:30+01:00`. 같은 순간이 나라마다 다른 시각으로 읽히는 것을 `+01:00`이 정리한다.
- **몇째 주를 가리켜**: `2016-W04`. `W` 뒤의 숫자가 그 해의 몇 번째 주인지다.

모양은 달라도 규칙은 하나다. 큰 단위를 왼쪽에 두고 작은 단위로 내려가며, 자리마다 자릿수가 정해져 있다.

그래서 어느 값이든 읽는 쪽이 헷갈릴 여지가 없다.

---

## 종합

`<time>`이 나타내는 것은 날짜처럼 보이는 글자가 아니라 "이 글자가 특정 시점을 가리킨다"는 사실이고, `datetime` 속성이 그 시점을 모호하지 않게 적어 둔다.

이 요소가 푸는 문제를 한 줄로 줄이면 이렇다. 사람이 읽기 좋은 표기와 프로그램이 읽기 좋은 표기가 서로 다른데, 화면에는 하나만 보여줄 수 있다.

`<time>`은 둘을 한 자리에 함께 두어 이 충돌을 없앤다.

```
                    보이는 글자                    datetime 속성
읽는 쪽             사람                           프로그램
고르는 기준         읽기 편한 표기                 정해진 형식
같은 날의 예        The 20th of next month         2016-01-20
```

이 표시가 없으면 어떻게 되는지도 분명하다. 날짜를 `<span>`으로만 감싸 두면 화면은 똑같이 보이지만, 페이지의 일정을 긁어 달력에 넣으려는 쪽은 `20/01/16`을 1월 20일로 읽을지 다른 날로 읽을지 판단할 근거가 없다.

`The 20th of next month` 같은 표기는 아예 풀 수 없다.

태그를 고르는 기준은 같은 폴더의 [`address.md`](./address.md)·[`em-strong.md`](./em-strong.md)와 같다. 글자가 어떻게 보이느냐가 아니라 그 글자가 무엇이냐로 갈린다.

여기서는 그 "무엇"이 시점이고, 시점은 표기가 흔들리는 대상이라 정확한 값을 함께 적어 두는 자리까지 요소가 마련해 둔 것이다.
