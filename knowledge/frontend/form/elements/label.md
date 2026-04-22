---
tags: [a11y, concept]
---
# Questions
- `<label>` 요소는 무엇이며, 폼 컨트롤과 연결하면 어떤 이점을 얻는가?
- `<label>`과 폼 컨트롤을 연결하는 두 가지 방법(explicit / implicit)은 각각 어떻게 쓰며, 코드로 표현하면?

---

# Answers

## `<label>` 요소는 무엇이며, 폼 컨트롤과 연결하면 어떤 이점을 얻는가?
### Official Answer
The `<label>` HTML element represents a caption for an item in a user interface.

Associating a `<label>` with a form control, such as `<input>` or `<textarea>` offers some major advantages:

- The label text is not only visually associated with its corresponding text input; it is programmatically associated with it too.
  This means that, for example, a screen reader will read out the label when the user is focused on the form input, making it easier for an assistive technology user to understand what data should be entered.
- When a user clicks or touches/taps a label, the browser passes the focus to its associated input (the resulting event is also raised for the input).
  That increased hit area for focusing the input provides an advantage to anyone trying to activate it — including those using a touch-screen device.

> #### Key Terms:
> - **caption**: UI 항목에 붙는 설명 텍스트
> - **form control**: 사용자 입력을 받는 요소 (`<input>`, `<textarea>`, `<select>` 등)
> - **programmatically associated**: DOM 관계로 연결되어 보조 기술이 그 관계를 인식할 수 있는 상태
> - **screen reader**: 시각 장애 사용자를 위해 화면 내용을 음성으로 읽어 주는 보조 기술
> - **assistive technology**: 장애 사용자의 컴퓨터 사용을 돕는 소프트웨어·하드웨어 총칭
> - **hit area**: 클릭·탭이 유효하게 먹히는 영역

> #### AI Annotation:
> 단순히 `<span>`으로 설명 텍스트를 그리는 것과 의미가 다르다.
> `<label>`은 DOM 레벨에서 특정 컨트롤과 묶이기 때문에, 스크린리더는 입력 필드로 포커스가 가면 라벨 텍스트를 함께 읽어 준다.
> 또 라벨 영역 자체가 컨트롤의 클릭 히트존으로 확장되어, 체크박스·라디오처럼 작은 컨트롤에서도 라벨 텍스트만 눌러 토글할 수 있다 (모바일 터치 환경에서 특히 유용).

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label

---

## `<label>`과 폼 컨트롤을 연결하는 두 가지 방법(explicit / implicit)은 각각 어떻게 쓰며, 코드로 표현하면?
### Official Answer
There are two ways to associate a `<label>` with a form control, commonly referred to as explicit and implicit association.

To explicitly associate a `<label>` element with an `<input>` element, you first need to add the id attribute to the `<input>` element.
Next, you add the `for` attribute to the `<label>` element, where the value of `for` is the same as the id in the `<input>` element.

```html
<label for="peas">I like peas.</label>
<input type="checkbox" name="peas" id="peas" />
```

Alternatively, you can nest the `<input>` directly inside the `<label>`, in which case the `for` and `id` attributes are not needed because the association is implicit:

```html
<label>
  I like peas.
  <input type="checkbox" name="peas" />
</label>
```

> #### Official Annotation:
> A `<label>` element can have both a `for` attribute and a contained control element, as long as the `for` attribute points to the contained control element.

> #### Key Terms:
> - **explicit association**: `for`/`id`로 두 요소를 명시적으로 연결하는 방식
> - **implicit association**: `<label>` 안에 컨트롤을 중첩하여 암묵적으로 연결하는 방식
> - **nest**: 한 요소를 다른 요소 안에 포함시키다

> #### AI Annotation:
> explicit은 라벨과 컨트롤이 형제 요소로 떨어져 있어도 연결이 유지되므로, 그리드·플렉스로 자유롭게 배치할 수 있다.
> implicit은 `id` 충돌 걱정이 없고 간단하지만, 일부 보조 기술이 암묵 연결을 지원하지 않는 경우가 있다.
> 최대 호환성을 위해 `for` + 중첩을 동시에 쓰는 패턴도 허용되며, 이때 `for`는 반드시 중첩된 그 컨트롤을 가리켜야 한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label
