---
tags: [styling, concept]
---
# Questions
- CSS custom property란 무엇이며, 어떻게 정의하고 사용하는가?
- CSS custom property를 `--` 문법으로 정의하면 캐스케이드와 상속이 어떻게 적용되는가?
- `@property` at-rule은 `--` 문법 대비 어떤 추가 제어를 제공하는가?
  - `@property` at-rule의 세 가지 디스크립터(`syntax`, `inherits`, `initial-value`)는 각각 무엇을 제어하는가?
- `var()` 함수는 CSS의 어디에서 사용할 수 있고, 어디에서 사용할 수 없는가?
- CSS custom property가 해결하는 두 가지 문제는 무엇인가?
- CSS custom property의 스코프는 어떻게 결정되며, 전역으로 사용하려면 어떻게 하는가?
- CSS custom property 이름은 대소문자를 구분하는가?
- CSS custom property의 상속은 프로그래밍 언어의 변수와 어떻게 다른가?
- 다음 CSS에서 `.four`의 `background-color`는 무엇이 되는가? 그 이유는?
- `@property`에서 `inherits: false`를 설정하면, 자식 요소에서 해당 커스텀 프로퍼티를 참조했을 때 어떤 값이 사용되는가?
- `var()` 함수의 폴백 값은 어떻게 지정하며, 쉼표가 여러 개 있을 때 어떻게 파싱되는가?
- `var()`로 둘 이상의 커스텀 프로퍼티를 폴백 체인으로 사용하려면 어떻게 해야 하는가?
- `var()` 폴백과 `@property`의 `initial-value` 폴백은 어떤 상황에서 각각 동작하는가?
- 일반 CSS 프로퍼티에 유효하지 않은 값을 넣었을 때와, `var()`를 통해 유효하지 않은 값이 대입되었을 때, 브라우저의 처리 방식은 어떻게 다른가?
- CSS 커스텀 프로퍼티의 값은 왜 파싱 시점이 아닌 computed time에 유효성이 판별되는가?
- JavaScript에서 CSS 커스텀 프로퍼티 값을 읽고 쓰는 API는 무엇인가?

---

# Answers

## CSS custom property란 무엇이며, 어떻게 정의하고 사용하는가?

### Official Answer
**Custom properties** (sometimes referred to as **CSS variables** or **cascading variables**) are entities defined by CSS authors that represent specific values to be reused throughout a document.
They are set using the `@property` at-rule or by custom property syntax (e.g., `--primary-color: blue;`).
Custom properties are accessed using the CSS `var()` function (e.g., `color: var(--primary-color);`).

> #### AI Annotation:
> 선언은 `--name: value`, 사용은 `var(--name)` 쌍으로 동작한다.
> 선언 방법은 두 가지: (1) `--` 접두사로 직접 선언, (2) `@property` at-rule로 타입/상속/초기값까지 명시하며 선언.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS custom property를 `--` 문법으로 정의하면 캐스케이드와 상속이 어떻게 적용되는가?

### Official Answer
Custom properties defined using two dashes (`--`) are subject to the cascade and inherit their value from their parent.

> #### AI Annotation:
> `--` 문법으로 선언하면 일반 CSS 프로퍼티처럼 specificity, source order 등 캐스케이드 규칙이 적용되며, **항상 상속**된다.
> 자식 요소에서 따로 선언하지 않으면 부모 값을 물려받는다.
> `@property`를 사용하면 `inherits: false`로 상속을 끌 수 있지만, `--` 문법에는 그 옵션이 없다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## `@property` at-rule은 `--` 문법 대비 어떤 추가 제어를 제공하는가?

### Official Answer
The `@property` at-rule allows more control over the custom property and lets you specify whether it inherits its value from a parent, what the initial value is, and the type constraints that should apply.

> #### AI Annotation:
> `@property`가 제공하는 세 가지 추가 제어:
> 1. **상속 여부** (`inherits: true/false`) - `--` 문법은 항상 상속이지만, `@property`는 끌 수 있다
> 2. **초기값** (`initial-value`) - 잘못된 값이 할당되면 이 값으로 폴백
> 3. **타입 제약** (`syntax: "<color>"` 등) - 유효하지 않은 타입의 값을 거부

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## `@property` at-rule의 세 가지 디스크립터(`syntax`, `inherits`, `initial-value`)는 각각 무엇을 제어하는가?

### Official Answer
The `@property` at-rule allows you to be more expressive with the definition of a custom property with the ability to associate a type with the property, set default values, and control inheritance.
The following example creates a custom property called `--logo-color` which expects a `<color>`:

```css
@property --logo-color {
  syntax: "<color>";
  inherits: false;
  initial-value: #c0ffee;
}
```

> #### AI Annotation:
> - `syntax`: 허용하는 값 타입을 지정한다. `"<color>"`, `"<length>"` 등. 이 타입에 맞지 않는 값이 할당되면 `initial-value`로 폴백된다.
> - `inherits`: 부모로부터 값을 상속받을지 여부. `false`이면 자식 요소에서 별도 선언 없이 참조할 때 부모 값이 아닌 `initial-value`가 사용된다.
> - `initial-value`: 값이 없거나 유효하지 않을 때 사용되는 기본값. `syntax`에 맞는 유효한 값이어야 한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## `var()` 함수는 CSS의 어디에서 사용할 수 있고, 어디에서 사용할 수 없는가?

### Official Answer
You can use the `var()` function in any part of a value in any property on an element.
You cannot use `var()` for property names, selectors, or anything aside from property values, which means you can't use it in a media query or container query.

> #### AI Annotation:
> 사용 가능: `color: var(--x)`, `margin: 10px var(--gap)`
> 사용 불가: `var(--prop-name): blue`, `.var(--class) { }`, `@media (max-width: var(--bp))`
> `var()`는 프로퍼티 **값** 위치에서만 동작한다는 점이 프로그래밍 언어 변수와 다른 핵심 제약이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS custom property가 해결하는 두 가지 문제는 무엇인가?

### Official Answer
Custom properties allow a value to be defined in one place, then referenced in multiple other places so that it's easier to work with.
Another benefit is readability and semantics.
For example, `--main-text-color` is easier to understand than the hexadecimal color `#00ff00`, especially if the color is used in different contexts.

> #### AI Annotation:
> 두 가지 문제:
> 1. **반복 값의 일괄 변경 어려움** - 같은 색상이 수백 곳에 하드코딩되면 변경 시 찾기-바꾸기를 해야 한다. 커스텀 프로퍼티는 단일 진실 공급원(single source of truth) 역할을 한다.
> 2. **가독성/의미론 부족** - `#00ff00`보다 `--main-text-color`가 코드의 의도를 명확히 드러낸다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS custom property의 스코프는 어떻게 결정되며, 전역으로 사용하려면 어떻게 하는가?

### Official Answer
The selector given to the ruleset defines the scope in which the custom property can be used.
For this reason, a common practice is to define custom properties on the `:root` pseudo-class, so that it can be referenced globally.
This doesn't always have to be the case: you maybe have a good reason for limiting the scope of your custom properties.

> #### AI Annotation:
> `section { --color: red; }` 이면 `<section>`과 그 자손만 `var(--color)`로 접근 가능하다.
> `:root`는 HTML 문서에서 `<html>` 요소를 가리키므로, 여기에 선언하면 모든 요소에서 상속받아 사용할 수 있다.
> 컴포넌트 전용 변수를 특정 선택자에만 선언하여 스코프를 의도적으로 제한하는 것도 유효한 패턴이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS custom property 이름은 대소문자를 구분하는가?

### Official Answer
Custom property names are case sensitive — `--my-color` will be treated as a separate custom property to `--My-color`.

> #### AI Annotation:
> 일반 CSS 프로퍼티(`color`, `Color` 등)는 대소문자를 구분하지 않지만, 커스텀 프로퍼티는 구분한다.
> `--my-color`와 `--My-color`는 완전히 별개의 변수이므로, 네이밍 컨벤션을 통일하지 않으면 버그 원인이 될 수 있다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS custom property의 상속은 프로그래밍 언어의 변수와 어떻게 다른가?

### Official Answer
One aspect of custom properties that the examples above demonstrate is that they don't behave exactly like variables in other programming languages.
The value is computed where it is needed, not stored and reused in other places of a stylesheet.
For instance, you cannot set a property's value and expect to retrieve the value in a sibling's descendant's rule.
The property is only set for the matching selector and its descendants.

> #### AI Annotation:
> JS 변수는 `const x = 1`하면 어디서든 `x`를 참조할 수 있지만, CSS 커스텀 프로퍼티는 DOM 트리의 상속 체인을 따라 "이 요소에서 이 프로퍼티의 값이 무엇인가"를 계산하는 방식이다.
> `.two { --color: red; }`를 선언하면, `.two`의 형제인 `.one`이나 그 자손에서는 `--color`를 참조할 수 없다.
> 스코프는 **자신 + 자손**이지, 형제가 아니다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## 다음 CSS에서 `.four`의 `background-color`는 무엇이 되는가? 그 이유는?

### Official Answer

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

The results of `var(--box-color)` depending on inheritance are as follows:

- `class="one"`: *invalid value*, which is the default value of a custom property defined in this way
- `class="two"`: `teal`
- `class="three"`: `pink`
- `class="four"`: `teal` (inherited from its parent)

> #### AI Annotation:
> `.four`는 `--box-color`를 직접 선언하지 않았지만, 부모인 `.two`에서 `teal`을 상속받아 `background-color: teal`이 된다.
> `.one`은 조상 어디에도 `--box-color` 선언이 없으므로 invalid value — `--` 문법으로 선언된 커스텀 프로퍼티는 선언이 없으면 초기값이 guaranteed invalid value이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## `@property`에서 `inherits: false`를 설정하면, 자식 요소에서 해당 커스텀 프로퍼티를 참조했을 때 어떤 값이 사용되는가?

### Official Answer
Because `inherits: false;` is set in the at-rule, and a value for the `--box-color` property is not declared within the `.child` scope, the initial value of `teal` is used instead of `green` that would have been inherited from the parent.

```css
@property --box-color {
  syntax: "<color>";
  inherits: false;
  initial-value: teal;
}

.parent {
  --box-color: green;
  background-color: var(--box-color);
}

.child {
  background-color: var(--box-color);
}
```

> #### AI Annotation:
> `inherits: false`이면 자식은 부모의 값을 물려받지 않는다.
> 자식 스코프에서 별도 선언이 없으면 `initial-value`(여기서는 `teal`)로 폴백된다.
> `--` 문법이었다면 `.child`는 부모의 `green`을 상속받았을 것이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## `var()` 함수의 폴백 값은 어떻게 지정하며, 쉼표가 여러 개 있을 때 어떻게 파싱되는가?

### Official Answer
The first argument to the function is the name of the custom property.
The second argument to the function is an optional fallback value, which is used as the substitution value when the referenced custom property is invalid.
The function accepts two parameters, assigning everything following the first comma as the second parameter.
If the second parameter is invalid, the fallback will fail.

The syntax of the fallback, like that of custom properties, allows commas.
For example, `var(--foo, red, blue)` defines a fallback of `red, blue` — anything between the first comma and the end of the function is considered a fallback value.

> #### AI Annotation:
> `var(--foo, red, blue)`에서 폴백은 `red`가 아니라 `red, blue` 전체다.
> 첫 번째 쉼표만 구분자이고, 나머지 쉼표는 폴백 값의 일부다.
> `background` shorthand 등 쉼표가 포함된 값을 폴백으로 넣을 때 이 파싱 규칙을 알아야 한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## `var()`로 둘 이상의 커스텀 프로퍼티를 폴백 체인으로 사용하려면 어떻게 해야 하는가?

### Official Answer
Including a custom property as a fallback, as seen in the second example above (`var(--my-var, var(--my-background, pink))`), is the correct way to provide more than one fallback with `var()`.
You should be aware of the performance impact of this method, however, as it takes more time to parse through the nested variables.

```css
.two {
  /* pink if --my-var and --my-background are not defined */
  color: var(--my-var, var(--my-background, pink));
}

.three {
  /* Invalid: "--my-background, pink" */
  color: var(--my-var, --my-background, pink);
}
```

> #### AI Annotation:
> `var()`를 중첩하는 것이 올바른 방법이다: `var(--a, var(--b, pink))`.
> `var(--a, --b, pink)`는 `--b, pink`가 통째로 폴백 값이 되어 유효한 CSS 값이 아니므로 실패한다.
> 중첩이 깊어지면 파싱 성능에 영향을 줄 수 있으므로, 과도한 체이닝은 피하는 것이 좋다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## `var()` 폴백과 `@property`의 `initial-value` 폴백은 어떤 상황에서 각각 동작하는가?

### Official Answer
You can define fallback values for custom properties using the `var()` function, and the `initial-value` of the `@property` at-rule.

Fallbacks cover the case where the browser supports CSS custom properties and is able to use a different value if the desired variable isn't defined yet or has an invalid value.

Aside from using `var()`, the `initial-value` defined in the `@property` at-rule can be used as a fallback mechanism.

```css
@property --box-color {
  syntax: "<color>";
  initial-value: teal;
  inherits: false;
}

.two {
  --box-color: peenk;
  background-color: var(--box-color);
}

.three {
  --box-color: 2rem;
  background-color: var(--box-color);
}
```

Both `2rem` and `peenk` are invalid color values, so the initial value of `teal` is applied.

> #### AI Annotation:
> `var()` 폴백: 커스텀 프로퍼티가 **미정의**이거나 **guaranteed invalid value**일 때 두 번째 인자가 사용된다.
> `@property` `initial-value` 폴백: `syntax` 타입 제약에 맞지 않는 값이 **할당 시점**에 거부되어 초기값으로 대체된다.
> `@property`는 선언 시점에 타입을 체크하므로, `--` 문법에서는 "유효"로 통과했을 값(`peenk`, `2rem`)도 즉시 거부할 수 있다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## 일반 CSS 프로퍼티에 유효하지 않은 값을 넣었을 때와, `var()`를 통해 유효하지 않은 값이 대입되었을 때, 브라우저의 처리 방식은 어떻게 다른가?

### Official Answer
When the browser encounters an invalid value for a regular CSS property (for example, a value of `16px` for the `color` property), it discards the declaration, and elements are assigned the values that they would have had if the declaration did not exist.

When the browser encounters an invalid `var()` substitution, then the initial or inherited value of the property is used.

The browser substitutes the value of `--text-color` in place of `var(--text-color)`, but `16px` is not a valid property value for `color`.
After substitution, the property doesn't make sense, so the browser handles this situation in two steps:

1. Check if the property `color` is inheritable. It is, but this `<p>` doesn't have any parent with the `color` property set. So we move on to the next step.
2. Set the value to its **default initial value**, which is black.

```css
:root {
  --text-color: 16px;
}

p {
  font-weight: bold;
  color: blue;
}

p {
  color: var(--text-color);
}
```

For such cases, the `@property` at-rule can prevent unexpected results by allowing to define the initial value of the property.

> #### AI Annotation:
> 일반 CSS: `color: 16px`은 파싱 시점에 버려지므로 이전 규칙 `color: blue`가 살아남는다.
> `var()` 대입: `color: var(--text-color)`은 파싱 시점에 유효하므로 `color: blue`를 덮어쓴다. 대입 실패 시 `blue`로 돌아가지 않고 initial/inherited로 리셋된다.
> 이 차이가 커스텀 프로퍼티 디버깅에서 가장 혼란스러운 부분이다 — 이전 규칙이 "살아남을 것"이라는 기대가 깨진다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS 커스텀 프로퍼티의 값은 왜 파싱 시점이 아닌 computed time에 유효성이 판별되는가?

### Official Answer
When the values of custom properties are parsed, the browser doesn't yet know where they will be used, so it must consider nearly all values as *valid*.
Unfortunately, these valid values can be used, via the `var()` functional notation, in a context where they might not make sense.
Properties and custom variables can lead to invalid CSS statements, leading to the concept of *valid at computed time*.

> #### AI Annotation:
> `--text-color: 16px`에서 브라우저는 이 값이 나중에 `color`에 쓰일지 `width`에 쓰일지 모른다.
> `16px`은 `width`에는 유효하지만 `color`에는 유효하지 않다.
> 사용처를 모르므로 파싱 시점에 유효/무효를 판단할 수 없고, 실제 프로퍼티에 대입되는 computed value 계산 시점까지 유효성 판단이 지연된다.
> 이것이 "valid at computed time" 개념이며, `@property`의 `syntax` 타입 제약은 이 문제를 선언 시점에 해결하는 방법이다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## JavaScript에서 CSS 커스텀 프로퍼티 값을 읽고 쓰는 API는 무엇인가?

### Official Answer
To use the values of custom properties in JavaScript, it is just like standard properties.

```js
// get variable from inline style
element.style.getPropertyValue("--my-var");

// get variable from wherever
getComputedStyle(element).getPropertyValue("--my-var");

// set variable on inline style
element.style.setProperty("--my-var", jsVar + 4);
```

> #### AI Annotation:
> - `element.style.getPropertyValue()`: 해당 요소의 인라인 `style` 속성에 직접 설정된 값만 반환한다. CSS 파일이나 상속으로 적용된 값은 가져오지 못한다.
> - `getComputedStyle(element).getPropertyValue()`: 캐스케이드, 상속, `var()` 대입 등을 모두 거친 최종 계산된 값을 반환한다. 실무에서 커스텀 프로퍼티 값을 읽을 때 가장 많이 쓰는 방법이다.
> - `element.style.setProperty()`: 인라인 스타일에 값을 설정한다. 인라인 스타일이므로 높은 specificity를 가진다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties
