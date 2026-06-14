---
tags: [styling, concept]
source: official
publishable: false
priority:
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

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS custom property를 `--` 문법으로 정의하면 캐스케이드와 상속이 어떻게 적용되는가?

### Official Answer
Custom properties defined using two dashes (`--`) are subject to the cascade and inherit their value from their parent.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## `@property` at-rule은 `--` 문법 대비 어떤 추가 제어를 제공하는가?

### Official Answer
The `@property` at-rule allows more control over the custom property and lets you specify whether it inherits its value from a parent, what the initial value is, and the type constraints that should apply.

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

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## `var()` 함수는 CSS의 어디에서 사용할 수 있고, 어디에서 사용할 수 없는가?

### Official Answer
You can use the `var()` function in any part of a value in any property on an element.
You cannot use `var()` for property names, selectors, or anything aside from property values, which means you can't use it in a media query or container query.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS custom property가 해결하는 두 가지 문제는 무엇인가?

### Official Answer
Custom properties allow a value to be defined in one place, then referenced in multiple other places so that it's easier to work with.
Another benefit is readability and semantics.
For example, `--main-text-color` is easier to understand than the hexadecimal color `#00ff00`, especially if the color is used in different contexts.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS custom property의 스코프는 어떻게 결정되며, 전역으로 사용하려면 어떻게 하는가?

### Official Answer
The selector given to the ruleset defines the scope in which the custom property can be used.
For this reason, a common practice is to define custom properties on the `:root` pseudo-class, so that it can be referenced globally.
This doesn't always have to be the case: you maybe have a good reason for limiting the scope of your custom properties.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS custom property 이름은 대소문자를 구분하는가?

### Official Answer
Custom property names are case sensitive — `--my-color` will be treated as a separate custom property to `--My-color`.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS custom property의 상속은 프로그래밍 언어의 변수와 어떻게 다른가?

### Official Answer
One aspect of custom properties that the examples above demonstrate is that they don't behave exactly like variables in other programming languages.
The value is computed where it is needed, not stored and reused in other places of a stylesheet.
For instance, you cannot set a property's value and expect to retrieve the value in a sibling's descendant's rule.
The property is only set for the matching selector and its descendants.

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

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties

---

## CSS 커스텀 프로퍼티의 값은 왜 파싱 시점이 아닌 computed time에 유효성이 판별되는가?

### Official Answer
When the values of custom properties are parsed, the browser doesn't yet know where they will be used, so it must consider nearly all values as *valid*.
Unfortunately, these valid values can be used, via the `var()` functional notation, in a context where they might not make sense.
Properties and custom variables can lead to invalid CSS statements, leading to the concept of *valid at computed time*.

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

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties
