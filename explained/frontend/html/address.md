# `<address>`는 어떤 내용을 마크업할 때 쓰는가?

## 도입

웹 페이지 아래쪽에는 글쓴이 이름, 주소, 전화번호, 이메일 같은 것이 자주 붙는다. 생김새만 놓고 보면 짧은 문단이거나 몇 줄짜리 목록이라 `<p>`나 `<ul>`로 감싸도 될 것처럼 보인다.

HTML은 이 자리를 위한 요소를 따로 두고 있다. 담긴 글자가 어떤 모양이냐가 아니라 그것이 연락처라는 사실을 문서에 적어두기 위해서다.

---

## 본문

> HTML has an element for marking up contact details — `<address>`.

"HTML에는 연락처를 마크업하기 위한 요소가 있다. `<address>`다."

- **contact details**: 연락처. 이름·주소·전화번호·이메일처럼 그 문서를 쓴 쪽에 닿는 데 필요한 정보를 가리킨다.
- **mark up**: 태그로 감싸 "이 부분이 무엇인지"를 표시하는 일. 여기서는 "이 덩어리가 연락처다"를 적는 것이다.
- **an element**: 요소 하나. 문장 끝에 그 요소의 이름을 대는 구조라, 앞의 설명이 곧 `<address>`의 뜻이 된다.

### 가장 단순한 모양

```html
<address>Chris Mills, Manchester, The Grim North, UK</address>
```

한 줄짜리 연락처를 그대로 감쌌다. 안에 다른 태그가 하나도 없고 글자만 들어 있다.

### 안에 복잡한 마크업이 들어가는 경우

> It could also include more complex markup, and other forms of contact information, for example:

"안에 더 복잡한 마크업이나 다른 형태의 연락 수단을 넣을 수도 있다. 예를 들면 이렇다."

- **more complex markup**: 더 복잡한 마크업. 글자만 들어가는 것이 아니라 문단·목록 같은 요소가 안에 겹쳐 들어갈 수 있다는 말이다.
- **other forms of contact information**: 다른 형태의 연락 수단. 주소 말고 전화번호나 이메일 같은 것도 여기 해당한다.

```html
<address>
  <p>
    Chris Mills<br />
    Manchester<br />
    The Grim North<br />
    UK
  </p>

  <ul>
    <li>Tel: 01234 567 890</li>
    <li>Email: me@grim-north.co.uk</li>
  </ul>
</address>
```

앞의 한 줄짜리와 이 예시를 나란히 놓으면 안쪽 생김새가 전혀 다르다.

```
<address>                     <address>
└── 글자 한 줄                ├── <p> 주소 여러 줄
                              └── <ul>
                                  ├── <li> 전화
                                  └── <li> 이메일
```

안쪽이 이렇게 달라져도 바깥 태그는 그대로다. 태그를 고르는 근거가 담긴 내용의 생김새가 아니라 그것이 연락처라는 사실이기 때문이다.

#### 연락처가 있는 곳으로 링크만 거는 경우

> Note that something like this would also be OK, if the linked page contained the contact information:

"링크가 가리키는 문서에 연락처가 들어 있다면 이런 모양도 괜찮다는 점을 알아두라."

- **the linked page**: 링크가 가리키는 문서. 조건이 붙어 있다는 데 주의한다. 그 문서에 연락처가 실제로 있어야 한다.
- **contained the contact information**: 연락처를 담고 있다. 이 조건만 맞으면 연락처 본문을 이 자리에 직접 적지 않아도 된다.

```html
<address>
  Page written by <a href="../authors/chris-mills/">Chris Mills</a>.
</address>
```

연락처 글자는 한 자도 없고 링크 하나만 들어 있다. 그래도 이 자리가 연락처를 가리키는 자리라는 사실은 같아서 `<address>`가 맞다.

---

## 종합

`<address>`가 나타내는 것은 특정한 배치나 모양이 아니라 "여기가 연락 수단을 적은 자리"라는 사실이다. 예시 세 가지의 안쪽이 각각 글자 한 줄, 문단과 목록, 링크 하나로 전부 다른데도 바깥 태그가 같다는 점이 이를 보여준다.

그래서 마크업할 때 던지는 질문은 하나다.

- **이 덩어리가 연락 수단을 적은 자리인가** → `<address>`
- **연락처가 있는 곳으로 링크만 걸어 두는 자리인가** → 그것도 `<address>`
- **여러 줄로 늘어놓거나 목록으로 만들어야 하는가** → 그건 태그를 고르는 근거가 아니다

이 표시가 없으면 어떻게 되는지를 뒤집어 보면 쓰는 이유가 잡힌다. 연락처를 `<p>`와 `<ul>`로만 적어두면 문서에는 문단 하나와 목록 하나가 나란히 있는 것으로만 남는다.

그것이 이 문서의 연락처라는 사실은 어디에도 기록되지 않는다.

이 판단은 같은 폴더의 [`lists.md`](./lists.md)나 [`em-strong.md`](./em-strong.md)에서 본 것과 같은 결의 판단이다. 눈에 보이는 모양을 보고 태그를 고르는 것이 아니라 그 텍스트가 무엇인지를 보고 고른다.
