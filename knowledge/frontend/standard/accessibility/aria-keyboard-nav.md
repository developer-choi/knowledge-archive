---
tags: [a11y, best-practice]
---

# Questions

## 접근성 일반
- 웹 접근성을 챙겨본 경험이 있나요?
- 색상으로만 정보를 전달하면 안 되는 이유는?

## ARIA
- ARIA가 뭐고, 언제 쓰나요?
- ARIA를 잘못 쓰면 어떤 일이 생기나요?

## 키보드 내비게이션
- 키보드만으로 사이트를 사용할 수 있게 하려면 뭘 신경 써야 하나요?
- `tabindex`는 어떻게 사용하나요?

## 모달·드롭다운 패턴
- 모달이나 드롭다운 만들 때 접근성을 어떻게 챙기나요?
- focus trap은 어떻게 구현하나요?

---

# Answers

## 웹 접근성을 챙겨본 경험이 있나요?

### AI Answer
웹 접근성은 장애인을 포함한 모든 사용자가 동등하게 사이트를 쓸 수 있게 만드는 일입니다. 실무에서는 크게 네 축으로 챙깁니다.

**첫째, 시맨틱 HTML이 우선**입니다. `<button>`이 할 수 있는 일을 `<div role="button">`으로 만들지 않습니다. 네이티브 태그가 키보드, 포커스, 스크린 리더 전부 자동으로 챙겨줘요.

**둘째, ARIA**는 네이티브 HTML로 표현 못하는 걸 보완할 때만 씁니다. 토글 상태, 동적으로 바뀌는 알림 메시지 같은 거요.

**셋째, 키보드 내비게이션**입니다. 마우스 없이 Tab, Shift+Tab, Enter, Space, 화살표만으로 모든 기능을 쓸 수 있어야 합니다. 모달은 focus trap이 필수고요.

**넷째, 검증**입니다. Lighthouse, axe DevTools, WAVE 같은 자동 도구로 1차 점검하고, NVDA(윈도우)나 VoiceOver(맥) 같은 실제 스크린 리더로 직접 들어보는 게 가장 정확합니다.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn/Accessibility

---

## 색상으로만 정보를 전달하면 안 되는 이유는?

### AI Answer
색맹·색약 사용자가 구별 못합니다. 빨간색 에러 메시지에 아이콘이나 텍스트("오류:")를 같이 넣어서, 색이 안 보여도 의미가 전달되게 해야 합니다. WCAG 1.4.1 (Use of Color) 기준이에요.

### Reference
- https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html

---

## ARIA가 뭐고, 언제 쓰나요?

### AI Answer
W3C "Using ARIA"의 First Rule of ARIA Use 원문은 *"If you can use a native HTML element or attribute with the semantics and behavior you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so."* 입니다. 즉, 네이티브 HTML로 표현되는 걸 ARIA로 대체하지 말라는 뜻이에요.

ARIA를 쓰는 건 **네이티브 HTML로 표현 못하는 걸 보완**할 때입니다. 예를 들면 토글 버튼의 열림/닫힘 상태(`aria-expanded`), 동적으로 바뀌는 알림 메시지(`aria-live`) 같은 거요.

ARIA는 세 종류로 나뉩니다:
- **Role**: 요소가 무엇인지 (예: `role="dialog"`, `role="tablist"`)
- **Property**: 본질적 특성 (예: `aria-required`, `aria-labelledby`)
- **State**: 동적 상태 (예: `aria-expanded`, `aria-disabled`)

빈도로만 구분되진 않습니다 — `aria-valuenow`처럼 자주 바뀌어도 Property로 분류된 경우가 있어서, 스펙(WAI-ARIA)이 어디로 분류했는지가 기준이에요.

### Reference
- https://www.w3.org/TR/using-aria/#firstrule
- https://www.w3.org/TR/wai-aria-1.2/

---

## ARIA를 잘못 쓰면 어떤 일이 생기나요?

### AI Answer
잘못된 ARIA는 ARIA가 없는 것보다 나쁩니다. 예를 들어 `<button>`에 `role="link"`를 붙이면 시각 사용자에겐 버튼인데 스크린 리더 사용자에겐 링크라고 읽혀서 오히려 혼란스러워져요. WAI-ARIA Authoring Practices에 *"No ARIA is better than bad ARIA"*라는 격언이 있습니다.

### Reference
- https://www.w3.org/WAI/ARIA/apg/

---

## 키보드만으로 사이트를 사용할 수 있게 하려면 뭘 신경 써야 하나요?

### AI Answer
핵심은 **마우스로 가능한 모든 동작이 키보드로도 가능해야 한다**는 거예요.

- **자연 탭 순서**: `<button>`, `<a href>`, `<input>` 같은 네이티브 인터랙티브 요소만 써도 Tab 순서가 자동으로 잡힙니다. 커스텀 요소는 `tabindex="0"`을 붙여야 들어와요.
- **포커스 표시 유지**: `outline: none`을 절대 그냥 끄지 않습니다. 끄려면 `:focus-visible`로 키보드 포커스만 따로 스타일링해서, 마우스 클릭 때는 안 보이고 Tab 이동 때는 명확히 보이게 합니다.
- **단축키 의미 매핑**: 메뉴 안 화살표, 폼 안 Enter 제출, Esc로 모달 닫기 같은 관습적인 키 동작을 지킵니다.
- **Skip link**: `<a href="#main">본문 바로가기</a>` 같은 링크를 페이지 최상단에 둬서, 매번 헤더 메뉴 전부 Tab으로 통과 안 해도 되게 합니다.

---

## `tabindex`는 어떻게 사용하나요?

### AI Answer
- `tabindex="0"`: 자연 탭 순서에 포함시킴. 커스텀 인터랙티브 요소를 키보드로 잡히게 할 때.
- `tabindex="-1"`: 탭으로는 안 잡히지만 프로그래매틱 포커스(`element.focus()`)는 가능. 모달 컨테이너 같은 데 자주 씀.
- `tabindex="양수"`: **안티 패턴**. 자연 순서를 깨뜨려서 디버깅 지옥을 만듭니다. 절대 쓰지 않습니다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex

---

## 모달이나 드롭다운 만들 때 접근성을 어떻게 챙기나요?

### AI Answer
체크리스트로 정리하면:

- **포커스 진입**: 모달이 열리면 첫 번째 포커스 가능한 요소(보통 닫기 버튼이나 첫 input)로 포커스를 옮긴다.
- **focus trap**: 모달이 열려 있는 동안 Tab/Shift+Tab이 모달 바깥으로 나가지 않게 가둔다.
- **포커스 복귀**: 모달이 닫히면 모달을 연 트리거 버튼으로 포커스를 되돌린다.
- **Esc로 닫기**: 키보드 사용자도 닫을 수 있게 Esc 키 핸들러를 단다.
- **role/aria 속성**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`로 제목 연결.
- **드롭다운은 `aria-expanded`**: 트리거 버튼에 열림/닫힘 상태를 붙여서 스크린 리더가 현재 상태를 읽도록 한다.
- **배경 비활성화**: `inert` 속성으로 모달 뒤 배경의 포커스를 막는다. `aria-hidden`만으로는 스크린 리더에서만 숨길 뿐 키보드 포커스는 그대로 들어가므로 부적합 — MDN도 *"Do not use aria-hidden='true' on focusable elements"*라고 명시한다.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert

---

## focus trap은 어떻게 구현하나요?

### AI Answer
모달 열릴 때 첫 번째 포커스 가능한 요소로 포커스 옮기고, 모달 안의 마지막 요소에서 Tab 누르면 첫 요소로, 첫 요소에서 Shift+Tab 누르면 마지막 요소로 순환시킵니다. 보통 라이브러리(focus-trap, react-focus-lock)를 씁니다.
