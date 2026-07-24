# DOM이란 무엇인가?

## 도입

브라우저는 HTML 파일을 받으면 그것을 그냥 텍스트로 처리하지 않는다. JavaScript가 `<button>`을 클릭 핸들러로 제어할 수 있으려면, HTML의 태그 구조를 JS가 다룰 수 있는 객체로 변환해야 한다. 이 변환된 표현이 DOM이다.

---

## 본문

> The DOM is an object representation of the HTML elements.

"DOM은 HTML 요소들의 객체 표현이다."

- **object representation**: 객체 표현. HTML 태그(`<div>`, `<button>` 등)를 JS 객체로 변환한 것. `document.getElementById('btn')`이 반환하는 그 객체가 DOM의 구성 요소다.
- **HTML elements**: HTML 문서를 구성하는 태그 단위. `<div>`, `<p>`, `<img>` 등 각각이 DOM 노드가 된다.

> It acts as a bridge between your code and the user interface, and has a tree-like structure with parent and child relationships.

"DOM은 코드와 사용자 인터페이스 사이의 다리 역할을 하며, 부모-자식 관계를 가진 트리 구조를 띤다."

- **bridge**: 다리. JS 코드는 DOM을 통해서만 화면의 HTML에 접근하고 수정할 수 있다. DOM이 없으면 JS는 HTML을 전혀 건드릴 수 없다.
- **tree-like structure**: 트리 구조. HTML의 중첩된 태그 관계가 그대로 트리로 표현된다.
- **parent and child relationships**: 부모-자식 관계. `<div>` 안의 `<p>`는 `<div>`의 자식 노드다.

DOM 트리 구조:

```
document
└── html
    ├── head
    │   └── title
    │       └── "My Page" (텍스트 노드)
    └── body
        ├── h1
        │   └── "제목" (텍스트 노드)
        └── div
            ├── p
            │   └── "단락" (텍스트 노드)
            └── button
                └── "클릭" (텍스트 노드)
```

DOM의 약자 풀이:

- **D** (Document): HTML 문서 자체
- **O** (Object): JS 객체 형태로 표현
- **M** (Model): 구조를 모델링하여 나타낸 것

JS에서 DOM 접근:

```js
// DOM 노드를 JS 객체로 가져오기
const btn = document.getElementById('btn')  // HTMLButtonElement 객체
const items = document.querySelectorAll('.item')  // NodeList

// DOM 수정 → 화면 즉시 반영
btn.textContent = '새 텍스트'
btn.style.color = 'red'
btn.addEventListener('click', () => alert('클릭!'))

// 새 노드 생성 및 추가
const newDiv = document.createElement('div')
document.body.appendChild(newDiv)
```

---

## 종합

DOM이 없으면 JS는 HTML을 읽거나 수정할 방법이 없다. 브라우저가 HTML 파일을 파싱해서 DOM 트리를 만들어 주기 때문에 JS는 `document.querySelector`로 트리를 탐색하고, `.textContent`나 `.style`로 수정하며, `.addEventListener`로 이벤트를 붙일 수 있다. React나 Vue 같은 프레임워크도 내부적으로는 이 DOM API를 사용하거나 Virtual DOM을 통해 DOM 업데이트를 최적화한다. 결국 브라우저 화면에 무언가 표시되고 변경되는 모든 것은 DOM을 거친다.
