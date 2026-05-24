---
tags: [react-toastify, toast, snackbar, notification, library]
source: official
publishable: false
---
# Questions

- react-toastify에서 스타일을 커스터마이즈하려면 무엇을 reset해야 하는가?
  - Toast와 ToastContainer 각각에서 reset/customize해야 하는 것은?
- ToastContainer를 여러 개 쓸 때 분기 기준은?
- ToastContainer는 애플리케이션에서 어떻게 렌더링해야 하는가?
- toast()를 디자인 시스템 타입에 맞춰 커스텀 래핑하는 패턴은?
- 주요 커스터마이즈 옵션은 무엇인가?
- 같은 토스트가 중복으로 뜨지 않게 하려면?
- ToastContainer의 className/id에 동적 CSS Module 값을 전달할 수 있는가?
- Stacked toasts 기능이란?

---

# Answers

## react-toastify에서 스타일을 커스터마이즈하려면 무엇을 reset해야 하는가?

### User Answer

Toast / ToastContainer 둘 다 reset / customize 해야 함.

스타일 파일이 총 3종 필요:
1. Util (공통 reset·믹스인)
2. ToastContainer (확장 컴포넌트 단위)
3. 각 토스트 타입별 (default, profile 등)

### Reference

- https://fkhadra.github.io/react-toastify/how-to-style

---

## Toast와 ToastContainer 각각에서 reset/customize해야 하는 것은?

### User Answer

**Toast:**
1. 토스트 박스 내부의 모든 스타일 요소 (박스영역, 텍스트영역)
2. 토스트 사이 간격 (기본 16px)
- Toast의 가로 길이는 ToastContainer의 가로 길이를 따라감

**ToastContainer:**
1. 반응형으로 480px 기준 스타일이 한 번 바뀜 (필요시 이것도 리셋)
2. 토스트 박스들의 위치 (position left, right, top, bottom)

---

## ToastContainer를 여러 개 쓸 때 분기 기준은?

### User Answer

**토스트의 가로 길이**를 기준으로 나눔. 토스트 내부 스타일(내용)이 달라도 가로 길이가 같으면 같은 ToastContainer를 쓸 수 있음.

---

## ToastContainer는 애플리케이션에서 어떻게 렌더링해야 하는가?

### Official Answer

Remember to **render** the ToastContainer **once** in your application tree. If you can't figure out where to put it, rendering it in the application root would be the best bet.

### User Answer

ToastContainer를 1개만 쓰라는 게 아니라 **렌더링을 1번만** 하라는 것.
토스트 종류가 여러 가지여서 ToastContainer를 여러 개 써야 하는 경우도 있음 (예: 텍스트 전용 / image+text 전용).

---

## toast()를 디자인 시스템 타입에 맞춰 커스텀 래핑하는 패턴은?

### User Answer

라이브러리 제공 타입(default/info/error/success)보다 디자인 시스템에 정의된 타입에 맞춰 래핑:

```ts
snackBar()
snackBar.error()
snackBar.info()
snackBar.<customType>()  // image + text 등 디자인 시스템 정의 타입
notification()
```

- default는 텍스트만 있으므로 content 타입을 `string`으로 제한
- 3rd parameter에 추가 커스텀 가능한 parameter 열어둠

---

## 주요 커스터마이즈 옵션은 무엇인가?

### User Answer

| 옵션 | 설명 |
|---|---|
| `icon: false` | 아이콘 숨기기 |
| `hideProgressBar: false` | 진행바 숨기기 (기본값 false, 대부분 true로 씀) |
| `autoClose: number` | 자동 닫힘 시간 (ms) |
| `draggable` | V10 기본값 `true` → `"touch"` 변경됨. PC에서도 드래그 삭제 원하면 `draggable={true}` 명시 |
| `closeOnClick` | V10 기본값 `true` → `false` 변경됨 |

### Reference

- https://fkhadra.github.io/react-toastify/icons
- https://fkhadra.github.io/react-toastify/api/toast
- https://fkhadra.github.io/react-toastify/autoClose
- https://fkhadra.github.io/react-toastify/drag-to-remove
- https://fkhadra.github.io/react-toastify/migration-v10#change-for-some-defaults

---

## 같은 토스트가 중복으로 뜨지 않게 하려면?

### User Answer

`updateId` / `toastId` 두 개를 똑같이 넣어주면 됨.

---

## ToastContainer의 className/id에 동적 CSS Module 값을 전달할 수 있는가?

### User Answer

불가. `<ToastContainer>`의 className / id는 string으로만 박을 수 있음 (정적 변수 할당 안 됨).
`toast()`는 Module CSS를 만들고 값을 전달하면 되지만, ToastContainer는 id 기반이라 동적 Module CSS 선언 후 전달이 안 됨.

---

## Stacked toasts 기능이란?

### User Answer

V10 기준 기능. 토스트가 쌓인 상태에서 마우스를 올리면 간격이 다시 벌어지는 UI.
`bottom-center` 등 일부 position에서 동작 안 하는 이슈 있음.

### Reference

- https://github.com/fkhadra/react-toastify/issues/1048
- https://github.com/fkhadra/react-toastify/issues/1067
