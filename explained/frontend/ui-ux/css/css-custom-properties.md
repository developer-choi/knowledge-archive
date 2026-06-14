# CSS custom property란 무엇이며, 어떻게 정의하고 사용하는가?

## 도입

같은 색상 값을 수십 군데에 반복해 쓰다가 디자인이 바뀌면 전부 찾아 바꿔야 하는 문제를 CSS custom property가 해결한다. 한 번 정의하고 여러 곳에서 참조하는 방식이다.

---
## 본문

> **Custom properties** (sometimes referred to as **CSS variables** or **cascading variables**) are entities defined by CSS authors that represent specific values to be reused throughout a document. They are set using the `@property` at-rule or by custom property syntax (e.g., `--primary-color: blue;`). Custom properties are accessed using the CSS `var()` function (e.g., `color: var(--primary-color);`).

"커스텀 프로퍼티(CSS 변수 또는 cascading 변수라고도 불림)는 CSS 작성자가 문서 전체에서 재사용할 특정 값을 나타내기 위해 정의하는 엔티티다. `@property` at-rule이나 커스텀 프로퍼티 문법(`--primary-color: blue;`)으로 설정한다. CSS `var()` 함수로 접근한다(`color: var(--primary-color);`)."

- **cascading variables**: CSS cascade(명시도, 소스 순서)의 영향을 받는 변수라는 의미. 일반 CSS 프로퍼티처럼 더 구체적인 선택자의 값이 우선한다.
- **reused throughout a document**: 한 번 선언하고 여러 곳에서 `var()`로 참조한다. 값이 바뀌면 선언 지점 하나만 수정하면 된다.

선언과 사용 패턴:
```css
:root {
  --primary-color: blue;
  --spacing-md: 16px;
}

.button {
  color: var(--primary-color);
  padding: var(--spacing-md);
}
```

선언 방법 두 가지:
1. `--` 접두사로 직접 선언 (cascade + 항상 상속)
2. `@property` at-rule로 타입/상속/초기값까지 명시하며 선언

---
## 종합

CSS custom property는 "CSS 파일 내 단일 진실 공급원(single source of truth)"이다. Tailwind의 `theme.colors`, styled-components의 theme 객체와 유사한 역할이지만 CSS 네이티브로 동작한다. JS에서도 `getComputedStyle(el).getPropertyValue('--primary-color')`로 접근할 수 있어 CSS와 JS 사이의 값 공유 채널로도 쓰인다.

---
# CSS custom property를 `--` 문법으로 정의하면 캐스케이드와 상속이 어떻게 적용되는가?

## 도입

`--` 문법으로 선언된 커스텀 프로퍼티는 일반 CSS 프로퍼티와 같은 cascade 규칙을 따르고, 자동으로 상속된다.

---
## 본문

> Custom properties defined using two dashes (`--`) are subject to the cascade and inherit their value from their parent.

"`--` 두 개로 정의된 커스텀 프로퍼티는 cascade의 영향을 받으며 부모로부터 값을 상속받는다."

- **subject to the cascade**: 같은 요소에 여러 규칙이 충돌하면 명시도(specificity)와 소스 순서에 따라 값이 결정된다.
  ```css
  :root { --color: blue; }
  .special { --color: red; }  /* .special 요소에서는 red가 우선 */
  ```
- **inherit their value from their parent**: 자식 요소에서 `--color`를 선언하지 않으면 부모의 `--color` 값을 자동으로 물려받는다.
- **`@property`의 차이**: `inherits: false`로 상속을 끌 수 있지만, `--` 문법에는 이 옵션이 없다. 항상 상속된다.

---
## 종합

`:root`에 선언한 커스텀 프로퍼티가 어디서든 접근 가능한 이유가 바로 상속 때문이다. `<html>` 요소부터 모든 자손에게 상속되므로 사실상 전역 변수처럼 동작한다. 특정 컴포넌트에만 스코프를 제한하려면 `:root` 대신 해당 컴포넌트의 선택자(예: `.card`)에 선언하면 된다.

---
# `@property` at-rule은 `--` 문법 대비 어떤 추가 제어를 제공하는가?

## 도입

`--` 문법은 빠르고 간단하지만 타입 검사도 없고 상속을 끌 수도 없다. `@property`는 이 제약들을 해소한다.

---
## 본문

> The `@property` at-rule allows more control over the custom property and lets you specify whether it inherits its value from a parent, what the initial value is, and the type constraints that should apply.

"`@property` at-rule은 커스텀 프로퍼티에 대해 더 많은 제어를 가능하게 하며, 부모로부터 값을 상속받을지 여부, 초기값, 적용해야 할 타입 제약을 지정할 수 있다."

세 가지 추가 제어:

| 디스크립터 | 역할 |
|---|---|
| `syntax` | 허용 타입 제약 (`"<color>"`, `"<length>"` 등) |
| `inherits` | 상속 여부 (`true`/`false`) |
| `initial-value` | 값이 없거나 유효하지 않을 때의 기본값 |

`--` 문법은 항상 상속이고 타입 체크 없음. `@property`는 이 세 가지를 명시적으로 제어한다.

---
## 종합

`@property`의 가장 실용적인 이점은 잘못된 값에 대한 안전망이다. `--color: 16px`처럼 잘못된 값이 할당되면 `initial-value`로 폴백되어 예측 가능한 동작이 보장된다. 반면 `--` 문법으로는 잘못된 값이 그대로 사용되다가 computed time에야 문제가 드러난다.

---
# `@property` at-rule의 세 가지 디스크립터(`syntax`, `inherits`, `initial-value`)는 각각 무엇을 제어하는가?

## 도입

`@property`를 사용하려면 세 가지 디스크립터를 모두 이해해야 한다. 각각의 역할과 서로 어떻게 연동되는지를 본다.

---
## 본문

> The `@property` at-rule allows you to be more expressive with the definition of a custom property with the ability to associate a type with the property, set default values, and control inheritance.

"`@property` at-rule은 프로퍼티에 타입을 연결하고, 기본값을 설정하고, 상속을 제어하는 기능으로 커스텀 프로퍼티를 더 표현적으로 정의할 수 있게 한다."

```css
@property --logo-color {
  syntax: "<color>";
  inherits: false;
  initial-value: #c0ffee;
}
```

- **`syntax`**: 허용하는 값 타입을 지정한다.
  - `"<color>"`, `"<length>"`, `"<number>"`, `"<percentage>"` 등.
  - 타입에 맞지 않는 값이 할당되면 `initial-value`로 폴백된다.
  - 타입이 지정되면 CSS transition/animation으로 해당 값을 보간할 수 있다.

- **`inherits`**: 부모로부터 값을 상속받을지 여부.
  - `false`이면 자식 스코프에서 선언 없이 참조 시 부모 값이 아닌 `initial-value`가 사용된다.

- **`initial-value`**: 값이 없거나 타입에 맞지 않을 때 사용되는 기본값.
  - `syntax`에 맞는 유효한 값이어야 한다.

---
## 종합

`syntax`가 `"<color>"`로 타입을 지정하면 CSS transition으로 색상 보간이 가능해진다. 이것이 `@property`의 핵심 이점 중 하나다 — `--` 문법 변수는 보간할 타입 정보가 없어 transition이 불가능하지만, `@property`로 타입을 지정하면 `transition: --my-color 0.3s` 같은 커스텀 프로퍼티 transition이 가능해진다.

---
# `var()` 함수는 CSS의 어디에서 사용할 수 있고, 어디에서 사용할 수 없는가?

## 도입

`var()`는 CSS 값 위치에서만 사용할 수 있다. 선택자나 프로퍼티 이름 자리에는 사용할 수 없다.

---
## 본문

> You can use the `var()` function in any part of a value in any property on an element.

"요소의 모든 프로퍼티의 값 어디에서든 `var()` 함수를 사용할 수 있다."

> You cannot use `var()` for property names, selectors, or anything aside from property values, which means you can't use it in a media query or container query.

"프로퍼티 이름, 선택자, 또는 프로퍼티 값 이외에는 `var()`를 사용할 수 없다. 즉 미디어 쿼리나 컨테이너 쿼리에서는 사용할 수 없다."

```css
/* 사용 가능 */
color: var(--x);
margin: 10px var(--gap);
background: rgb(var(--r), var(--g), var(--b));

/* 사용 불가 */
var(--prop-name): blue;        /* 프로퍼티 이름 자리 */
.var(--class) { }              /* 선택자 자리 */
@media (max-width: var(--bp)) /* 미디어 쿼리 */
```

- **프로퍼티 값 위치에서만**: `var()`는 CSS 엔진이 값을 계산하는 단계에서 대입되는 방식이다. 프로퍼티 이름이나 선택자는 파싱 단계에서 처리되므로 그 시점에는 커스텀 프로퍼티 값이 계산되지 않았다.
- **미디어 쿼리 불가**: `@media`는 별도 처리 단계에서 평가되며, 특정 요소와 무관하게 전역적으로 동작하므로 DOM 기반 상속을 사용하는 커스텀 프로퍼티를 참조할 수 없다.

---
## 종합

반응형 breakpoint를 CSS custom property로 관리하고 싶어도 `@media (max-width: var(--bp))` 같은 것은 동작하지 않는다. 이 경우는 CSS custom property 대신 Sass 변수나 PostCSS 플러그인, 또는 `@layer`와 `:root` 기반 breakpoint 전략을 써야 한다.

---
# CSS custom property가 해결하는 두 가지 문제는 무엇인가?

## 도입

커스텀 프로퍼티가 없었을 때 CSS 작성의 두 가지 고통스러운 문제가 있었다.

---
## 본문

> Custom properties allow a value to be defined in one place, then referenced in multiple other places so that it's easier to work with.

"커스텀 프로퍼티는 값을 한 곳에서 정의하고 여러 곳에서 참조할 수 있어 작업을 쉽게 한다."

> Another benefit is readability and semantics. For example, `--main-text-color` is easier to understand than the hexadecimal color `#00ff00`, especially if the color is used in different contexts.

"또 다른 이점은 가독성과 의미론이다. 예를 들어 `--main-text-color`는 특히 색상이 다양한 컨텍스트에서 사용될 때 16진수 색상 `#00ff00`보다 이해하기 쉽다."

두 가지 문제:

1. **반복 값의 일괄 변경 어려움**: 같은 색상 `#2196F3`이 수백 곳에 하드코딩되어 있으면 변경 시 전부 찾아 바꿔야 한다. 커스텀 프로퍼티는 단일 선언 지점을 변경하면 모든 참조가 업데이트된다.

2. **가독성/의미론 부족**: `#00ff00`보다 `--success-color`가 코드의 의도를 명확히 드러낸다. 값 자체가 아니라 용도를 이름으로 표현할 수 있다.

---
## 종합

디자인 토큰(Design Token) 개념이 바로 이 두 이점을 체계화한 것이다. `--color-primary: #2196F3`, `--spacing-4: 16px` 같은 네이밍으로 값에 의미를 부여하고 중앙에서 관리한다. Tailwind CSS의 내부 CSS custom properties, shadcn/ui의 테마 변수가 이 패턴을 구현한 대표적 사례다.

---
# CSS custom property의 스코프는 어떻게 결정되며, 전역으로 사용하려면 어떻게 하는가?

## 도입

CSS custom property는 선언된 선택자의 범위(스코프)를 가진다. 전역으로 쓰려면 가장 넓은 범위에 선언해야 한다.

---
## 본문

> The selector given to the ruleset defines the scope in which the custom property can be used. For this reason, a common practice is to define custom properties on the `:root` pseudo-class, so that it can be referenced globally. This doesn't always have to be the case: you maybe have a good reason for limiting the scope of your custom properties.

"규칙셋에 주어진 선택자가 커스텀 프로퍼티를 사용할 수 있는 스코프를 정의한다. 이런 이유로 커스텀 프로퍼티를 `:root` pseudo-class에 정의하여 전역으로 참조할 수 있게 하는 것이 일반적인 관행이다. 항상 그럴 필요는 없다 — 커스텀 프로퍼티의 스코프를 제한하는 타당한 이유가 있을 수 있다."

- **스코프 = 선택자 + 자손**: `section { --color: red; }` 이면 `<section>`과 그 자손만 `var(--color)`로 접근 가능하다.
- **`:root`**: HTML 문서에서 `<html>` 요소를 가리키는 pseudo-class. `<html>`은 모든 요소의 조상이므로 `:root`에 선언하면 상속으로 모든 요소에서 접근 가능하다.
- **의도적 스코프 제한**: `.card { --bg: white; }` 처럼 컴포넌트 내부에서만 쓰는 변수는 해당 선택자에 선언하면 외부 오염 없이 캡슐화된다.

```css
:root { --global-color: blue; }     /* 전역 */
.card { --card-bg: white; }         /* .card 내부만 */
```

---
## 종합

React에서 CSS Modules나 styled-components를 쓸 때 컴포넌트 스코프 변수를 커스텀 프로퍼티로 관리하는 패턴이 있다. 부모 요소에 `style={{ '--size': props.size }}`처럼 인라인으로 선언하면 하위 CSS에서 `var(--size)`로 접근할 수 있다. JS 값을 CSS에 전달하는 채널로 활용하는 것이다.

---
# CSS custom property 이름은 대소문자를 구분하는가?

## 도입

CSS의 대부분의 프로퍼티와 값은 대소문자를 구분하지 않는다. 하지만 커스텀 프로퍼티는 예외다.

---
## 본문

> Custom property names are case sensitive — `--my-color` will be treated as a separate custom property to `--My-color`.

"커스텀 프로퍼티 이름은 대소문자를 구분한다 — `--my-color`는 `--My-color`와 별개의 커스텀 프로퍼티로 취급된다."

- **일반 CSS 프로퍼티**: `color`, `Color`, `COLOR`은 동일하게 처리된다. CSS 파서가 소문자로 정규화한다.
- **커스텀 프로퍼티**: `--my-color`와 `--My-color`는 완전히 다른 변수다. `--` 이후 문자열을 파서가 그대로 보존하기 때문이다.

---
## 종합

팀에서 CSS custom property를 쓸 때 네이밍 컨벤션을 통일해야 하는 이유가 여기 있다. 일부는 kebab-case(`--primary-color`), 일부는 camelCase(`--primaryColor`)를 혼용하면 서로 다른 변수가 되어 한 쪽은 적용되지 않는 버그가 생긴다. 커뮤니티 관행은 kebab-case이며, CSS 네이티브 프로퍼티 이름과 일관성이 있다.

---
# CSS custom property의 상속은 프로그래밍 언어의 변수와 어떻게 다른가?

## 도입

커스텀 프로퍼티를 "CSS 변수"라고 부르지만, 프로그래밍 언어의 변수와는 작동 방식이 다르다. DOM 트리의 상속 체인을 따른다는 점이 핵심 차이다.

---
## 본문

> One aspect of custom properties that the examples above demonstrate is that they don't behave exactly like variables in other programming languages. The value is computed where it is needed, not stored and reused in other places of a stylesheet.

"커스텀 프로퍼티가 다른 프로그래밍 언어의 변수처럼 정확히 동작하지 않는다는 점을 예시들이 보여준다. 값은 필요한 곳에서 계산되며, stylesheet의 다른 곳에 저장되어 재사용되지 않는다."

> For instance, you cannot set a property's value and expect to retrieve the value in a sibling's descendant's rule. The property is only set for the matching selector and its descendants.

"예를 들어, 프로퍼티 값을 설정하고 형제의 자손 규칙에서 그 값을 가져오기를 기대할 수 없다. 프로퍼티는 일치하는 선택자와 그 자손에 대해서만 설정된다."

- **JS 변수**: `const x = 1`은 어디서든 `x`를 참조할 수 있다. 파일 스코프나 함수 스코프로 동작한다.
- **CSS custom property**: "이 DOM 요소에서 `--color`의 값이 무엇인가"를 DOM 트리 상속 체인을 따라 계산한다. 스코프는 **자신 + 자손**이지, 형제가 아니다.

```html
<div class="two">   <!-- --color: red -->
  ...
</div>
<div class="one">   <!-- --color 선언 없음 → .two에서 상속받지 못함 -->
  ...
</div>
```

`.two`에 `--color: red`를 선언했을 때, 형제인 `.one`은 `var(--color)`를 참조할 수 없다.

---
## 종합

이 차이가 CSS custom property 디버깅에서 가장 자주 만나는 혼란이다. "분명히 선언했는데 왜 안 되지?"라고 의심될 때는 선언 요소와 사용 요소 사이의 DOM 관계(조상-자손인지, 형제인지)를 확인한다. 선언 요소의 자손이 아니면 접근할 수 없다.

---
# 다음 CSS에서 `.four`의 `background-color`는 무엇이 되는가? 그 이유는?

## 도입

커스텀 프로퍼티 상속이 실제로 어떻게 동작하는지 구체적인 예시로 확인한다.

---
## 본문

```css
div { background-color: var(--box-color); }
.two { --box-color: teal; }
.three { --box-color: pink; }
```

```html
<div class="one">
  <div class="two">
    <div class="three"><p>Three</p></div>
    <div class="four"><p>Four</p></div>
  </div>
</div>
```

> The results of `var(--box-color)` depending on inheritance are as follows:
> - `class="one"`: *invalid value*
> - `class="two"`: `teal`
> - `class="three"`: `pink`
> - `class="four"`: `teal` (inherited from its parent)

DOM 트리와 상속 체인:

```
.one  → 조상에 --box-color 없음 → invalid value (default)
  └─ .two  → --box-color: teal 선언 → teal
       ├─ .three → --box-color: pink 선언 → pink (부모 .two를 오버라이드)
       └─ .four  → 선언 없음 → 부모 .two에서 teal 상속
```

- **`.one`의 invalid value**: `--` 문법으로 선언된 커스텀 프로퍼티는 선언이 없으면 "guaranteed invalid value"가 초기값이다. `background-color: invalid value`는 적용되지 않아 브라우저 기본값이 사용된다.
- **`.four`의 teal**: 자신에게 선언이 없으면 DOM 트리를 올라가며 가장 가까운 조상의 값을 사용한다. `.four`의 부모는 `.two`이고, `.two`에는 `teal`이 선언되어 있다.

---
## 종합

이 예시가 CSS custom property 상속의 핵심을 보여준다. "가장 가까운 조상의 선언"이 우선한다. `.three`가 `pink`로 오버라이드해도 형제인 `.four`에는 영향을 주지 않는다. 각자 자신의 조상 체인을 따라 독립적으로 계산된다.

---
# `@property`에서 `inherits: false`를 설정하면, 자식 요소에서 해당 커스텀 프로퍼티를 참조했을 때 어떤 값이 사용되는가?

## 도입

`inherits: false`는 부모의 값이 자식에게 내려오지 않도록 하는 설정이다. 자식에서 선언이 없을 때 어떤 값이 사용되는지가 핵심이다.

---
## 본문

> Because `inherits: false;` is set in the at-rule, and a value for the `--box-color` property is not declared within the `.child` scope, the initial value of `teal` is used instead of `green` that would have been inherited from the parent.

"`inherits: false`가 설정되어 있고 `.child` 스코프에 `--box-color` 값이 선언되지 않았으므로, 부모에서 상속받았을 `green` 대신 초기값인 `teal`이 사용된다."

```css
@property --box-color {
  syntax: "<color>";
  inherits: false;
  initial-value: teal;
}

.parent {
  --box-color: green;
  background-color: var(--box-color);  /* green */
}

.child {
  background-color: var(--box-color);  /* teal (상속 차단 → initial-value 사용) */
}
```

- **`inherits: false`**: 부모의 `--box-color: green` 선언이 자식에게 내려오지 않는다.
- **`initial-value`로 폴백**: 자식 스코프에 선언도 없고 상속도 차단됐으므로 `@property`의 `initial-value: teal`이 사용된다.
- **`--` 문법이었다면**: `.child`는 부모의 `green`을 상속받았을 것이다.

---
## 종합

`inherits: false`는 컴포넌트 내부 변수를 캡슐화할 때 유용하다. 부모에서 설정한 값이 예상치 못하게 자식 컴포넌트에 영향을 주는 것을 방지한다. Shadow DOM과 유사한 스코프 격리 효과를 일반 DOM에서 구현할 수 있다.

---
# `var()` 함수의 폴백 값은 어떻게 지정하며, 쉼표가 여러 개 있을 때 어떻게 파싱되는가?

## 도입

`var()`의 두 번째 인자는 폴백 값이다. 쉼표가 여러 개 있을 때 파싱 규칙을 모르면 의도치 않은 폴백이 적용된다.

---
## 본문

> The first argument to the function is the name of the custom property. The second argument to the function is an optional fallback value, which is used as the substitution value when the referenced custom property is invalid. The function accepts two parameters, assigning everything following the first comma as the second parameter.

"`var()` 함수의 첫 번째 인자는 커스텀 프로퍼티의 이름이다. 두 번째 인자는 선택적 폴백 값으로, 참조된 커스텀 프로퍼티가 유효하지 않을 때 대체 값으로 사용된다. 함수는 두 개의 파라미터를 받으며, 첫 번째 쉼표 이후의 모든 것을 두 번째 파라미터로 할당한다."

> The syntax of the fallback, like that of custom properties, allows commas. For example, `var(--foo, red, blue)` defines a fallback of `red, blue` — anything between the first comma and the end of the function is considered a fallback value.

"폴백 문법은 커스텀 프로퍼티처럼 쉼표를 허용한다. 예를 들어 `var(--foo, red, blue)`는 `red, blue` 전체를 폴백으로 정의한다 — 첫 번째 쉼표와 함수 끝 사이의 모든 것이 폴백 값으로 간주된다."

```css
var(--foo, red)         /* 폴백: red */
var(--foo, red, blue)   /* 폴백: red, blue (둘 다 폴백 값의 일부!) */
var(--foo, 1px, 2em)    /* 폴백: 1px, 2em (예: border shorthand) */
```

- **첫 번째 쉼표만 구분자**: `var(--name, fallback)` 형식에서 `--name`과 `fallback` 사이만 구분한다.
- **나머지 쉼표는 폴백의 일부**: `background: var(--bg, red, blue)` 에서 폴백은 `red, blue`가 아니라 `red`일 것이라는 예상이 틀린다. 실제로는 `red, blue`가 통째로 폴백이 된다.

---
## 종합

`box-shadow: var(--shadow, 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05))` 같이 쉼표가 포함된 shorthand 값을 폴백으로 쓸 때 이 파싱 규칙이 중요하다. 첫 번째 쉼표 이후가 전부 폴백이므로, 복잡한 값도 그대로 폴백으로 사용할 수 있다.

---
# `var()`로 둘 이상의 커스텀 프로퍼티를 폴백 체인으로 사용하려면 어떻게 해야 하는가?

## 도입

"A가 없으면 B를, B도 없으면 C를"처럼 여러 커스텀 프로퍼티를 순서대로 시도하는 폴백 체인을 만들고 싶을 때의 올바른 방법이다.

---
## 본문

> Including a custom property as a fallback, as seen in the second example above (`var(--my-var, var(--my-background, pink))`), is the correct way to provide more than one fallback with `var()`. You should be aware of the performance impact of this method, however, as it takes more time to parse through the nested variables.

"`var()`를 중첩하는 것이 두 개 이상의 폴백을 제공하는 올바른 방법이다. 단, 중첩 변수를 파싱하는 데 더 많은 시간이 걸리므로 성능 영향을 인지해야 한다."

```css
/* 올바른 방법: var() 중첩 */
.two {
  color: var(--my-var, var(--my-background, pink));
}

/* 잘못된 방법: 두 번째 쉼표 이후가 통째로 폴백 */
.three {
  color: var(--my-var, --my-background, pink);  /* "--my-background, pink"가 폴백 */
}
```

- **`var(--a, var(--b, c))`**: 올바른 체인. `--a` 없으면 `--b` 시도, `--b` 없으면 `c` 사용.
- **`var(--a, --b, c)`**: 틀린 패턴. `--b, c` 전체가 폴백이 되어 "커스텀 프로퍼티 이름인 `--b`와 `c`라는 문자열"로 처리된다. 유효한 CSS 값이 아니면 폴백 자체가 실패한다.

---
## 종합

폴백 체인이 깊어질수록 브라우저 파싱 비용이 증가한다. 2~3단계까지는 무방하지만 과도한 중첩은 피한다. 디자인 토큰 시스템에서 "컴포넌트 토큰 → 글로벌 토큰" 2단계 폴백 패턴이 대표적인 실용적 사용례다.

---
# `var()` 폴백과 `@property`의 `initial-value` 폴백은 어떤 상황에서 각각 동작하는가?

## 도입

폴백 메커니즘이 두 가지 있다. 각각이 어떤 상황에서 발동하는지를 구분해야 의도한 동작을 만들 수 있다.

---
## 본문

> You can define fallback values for custom properties using the `var()` function, and the `initial-value` of the `@property` at-rule.

"커스텀 프로퍼티의 폴백 값은 `var()` 함수와 `@property` at-rule의 `initial-value`를 사용해 정의할 수 있다."

> Fallbacks cover the case where the browser supports CSS custom properties and is able to use a different value if the desired variable isn't defined yet or has an invalid value.

"폴백은 브라우저가 CSS custom property를 지원하고, 원하는 변수가 아직 정의되지 않았거나 유효하지 않은 값을 가질 때 다른 값을 사용할 수 있는 경우를 커버한다."

```css
@property --box-color {
  syntax: "<color>";
  initial-value: teal;
  inherits: false;
}

.two {
  --box-color: peenk;   /* 유효하지 않은 색상 */
  background-color: var(--box-color);
}

.three {
  --box-color: 2rem;    /* 유효하지 않은 색상 */
  background-color: var(--box-color);
}
/* 두 케이스 모두 initial-value: teal이 적용됨 */
```

두 폴백 비교:

| 폴백 방식 | 발동 조건 |
|---|---|
| `var(--x, fallback)` | `--x`가 미정의 또는 guaranteed invalid value일 때 |
| `@property` `initial-value` | `syntax` 타입 제약에 맞지 않는 값이 할당됐을 때 (선언 시점 거부) |

- **`var()` 폴백**: 커스텀 프로퍼티 자체가 없거나 `--` 문법의 invalid value일 때 동작.
- **`initial-value`**: `@property`의 `syntax`가 값을 거부할 때 동작. `peenk`(문자열)이 `<color>` 타입에 맞지 않으면 즉시 `teal`로 대체.

---
## 종합

`var()` 폴백은 "변수가 없을 때" 대비, `initial-value`는 "변수가 있지만 잘못된 타입일 때" 대비다. `@property`의 `initial-value`는 타입 안전성 도구로, 잘못된 값이 UI를 깨뜨리는 것을 방지한다.

---
# 일반 CSS 프로퍼티에 유효하지 않은 값을 넣었을 때와, `var()`를 통해 유효하지 않은 값이 대입되었을 때, 브라우저의 처리 방식은 어떻게 다른가?

## 도입

"무효한 값을 `var()`로 넣으면 이전 규칙이 살아남겠지"라는 직관이 틀린 경우가 있다. `var()`를 통한 무효 값은 이전 규칙을 덮어씌우는 방식으로 다르게 처리된다.

---
## 본문

> When the browser encounters an invalid value for a regular CSS property (for example, a value of `16px` for the `color` property), it discards the declaration, and elements are assigned the values that they would have had if the declaration did not exist.

"브라우저가 일반 CSS 프로퍼티의 유효하지 않은 값을 만나면, 그 선언을 버리고 해당 선언이 없었을 때의 값을 요소에 할당한다."

> When the browser encounters an invalid `var()` substitution, then the initial or inherited value of the property is used.

"브라우저가 유효하지 않은 `var()` 대입을 만나면 프로퍼티의 initial 또는 inherited 값이 사용된다."

```css
:root { --text-color: 16px; }

p {
  color: blue;       /* 규칙 1 */
}
p {
  color: var(--text-color);  /* 규칙 2: --text-color = 16px, 색상 아님 */
}
```

- **일반 CSS (`color: 16px`)**: 파싱 시점에 유효하지 않아 버려진다. 이전 규칙 `color: blue`가 살아남는다.
- **`var()` 대입 (`color: var(--text-color)`)**: `color: var(--text-color)` 자체는 파싱 시점에 유효하다. 이전 규칙 `color: blue`를 덮어쓴다. 대입 실패 시 `blue`로 돌아가지 않고 상속 또는 initial value로 리셋된다.

처리 흐름:
1. `color: var(--text-color)` → 이전 `color: blue`를 덮어씀
2. `--text-color`가 `16px`이므로 대입 실패
3. `color` 프로퍼티가 상속 가능한가? → yes지만 부모에 `color` 없음
4. → initial value(black)로 리셋

결과: `color: blue`가 아니라 `color: black`

---
## 종합

이 동작이 커스텀 프로퍼티 디버깅에서 가장 혼란스러운 부분이다. "이전 규칙이 살아남을 것"이라는 기대가 깨진다. `var()`로 잘못된 값을 주입하면 이전 규칙이 아니라 initial/inherited value로 리셋된다. `@property`의 `initial-value`를 명시하면 이 리셋의 결과를 예측 가능하게 만들 수 있다.

---
# CSS 커스텀 프로퍼티의 값은 왜 파싱 시점이 아닌 computed time에 유효성이 판별되는가?

## 도입

`--text-color: 16px` 선언을 보고 브라우저가 즉시 "이건 색상이 아니야"라고 거부하지 않는다. 왜 파싱 시점에 타입 체크를 못 하는지를 이해하면 CSS 커스텀 프로퍼티의 동작 원리가 명확해진다.

---
## 본문

> When the values of custom properties are parsed, the browser doesn't yet know where they will be used, so it must consider nearly all values as *valid*.

"커스텀 프로퍼티의 값이 파싱될 때, 브라우저는 어디서 사용될지 아직 모르므로 거의 모든 값을 *유효*로 간주해야 한다."

> Unfortunately, these valid values can be used, via the `var()` functional notation, in a context where they might not make sense. Properties and custom variables can lead to invalid CSS statements, leading to the concept of *valid at computed time*.

"안타깝게도 이 '유효한' 값들이 `var()` 함수 표기를 통해 의미가 통하지 않는 컨텍스트에서 사용될 수 있다. 이것이 *computed time에 유효*라는 개념으로 이어진다."

- **파싱 시점에 타입을 모르는 이유**: `--size: 16px`를 선언할 때 브라우저는 이 값이 나중에 `font-size`에 쓰일지 `color`에 쓰일지 `transform`에 쓰일지 알 수 없다. `16px`는 `font-size`에는 유효하고 `color`에는 유효하지 않다.
- **valid at computed time**: 값의 사용처(어떤 CSS 프로퍼티에 대입되는지)가 확정되는 computed value 계산 시점에야 유효성을 판단한다.

---
## 종합

이것이 `@property`의 `syntax` 디스크립터가 혁신적인 이유다. `syntax: "<color>"`를 선언하면 브라우저가 파싱 시점에 "이 변수는 color 타입이어야 한다"는 정보를 알게 된다. 그래서 `--logo-color: 16px`가 할당되면 즉시 `initial-value`로 폴백된다. "valid at computed time" 문제를 `@property`가 선언 시점으로 앞당기는 것이다.

---
# JavaScript에서 CSS 커스텀 프로퍼티 값을 읽고 쓰는 API는 무엇인가?

## 도입

CSS custom property는 JS에서도 읽고 쓸 수 있다. 단, 인라인 스타일로 설정된 것만 읽는 API와 cascade를 모두 거친 최종값을 읽는 API가 다르다.

---
## 본문

> To use the values of custom properties in JavaScript, it is just like standard properties.

"JavaScript에서 커스텀 프로퍼티 값을 사용하는 것은 표준 프로퍼티와 같다."

```js
// 인라인 style에 직접 설정된 값만 반환
element.style.getPropertyValue("--my-var");

// cascade, 상속, var() 대입까지 모두 거친 최종 계산값
getComputedStyle(element).getPropertyValue("--my-var");

// 인라인 style에 값 설정
element.style.setProperty("--my-var", jsVar + 4);
```

- **`element.style.getPropertyValue()`**: 해당 요소의 인라인 `style` 속성에 직접 설정된 값만 반환한다. CSS 파일이나 상속으로 적용된 값은 가져오지 못한다.
- **`getComputedStyle().getPropertyValue()`**: cascade, 상속, `var()` 대입 등을 모두 거친 최종 계산값을 반환한다. 실무에서 커스텀 프로퍼티 값을 읽을 때 가장 많이 쓰는 방법이다.
- **`element.style.setProperty()`**: 인라인 스타일에 값을 설정한다. 인라인 스타일의 높은 specificity 덕분에 CSS 파일의 선언을 오버라이드한다.

---
## 종합

React에서 `style={{ '--size': props.size }}`로 커스텀 프로퍼티를 전달하는 패턴이 바로 `element.style.setProperty`에 해당한다. 이 값을 자식 컴포넌트의 CSS에서 `var(--size)`로 읽어 사용하면, JS props를 CSS에 안전하게 전달하는 채널이 만들어진다. 특히 CSS transition이 가능한 값을 동적으로 제어할 때 JS state보다 커스텀 프로퍼티 경로가 리렌더 없이 성능적으로 더 유리하다.
