---
tags: [react, concept]
---
# Questions
- JSX란 무엇이며, HTML과 어떻게 다른가?
- 브라우저는 JSX를 직접 실행할 수 있는가?

---

# Answers

## JSX란 무엇이며, HTML과 어떻게 다른가?

### Official Answer
JSX looks like HTML, but it can also write powerful features of Javascript.

> #### User Annotation:
> JSX는 HTML과 비슷한 모양이지만, 다음과 같이 JavaScript의 강력한 기능들을 함께 활용할 수 있다.
>
> 함수 호출과 변수 값을 그대로 쓸 수 있다:
> ```
> <div>{getValue()}</div>
> <div>{someVariable}</div>
> ```
>
> 조건부로 활용할 수 있다:
> ```
> <div>{isVisible ? <Foo/> : <Bar/>}</div>
> ```
>
> Attribute에도 JS 표현식을 쓸 수 있다:
> ```
> <div className={someClassName}>...</div>
> ```
>
> 자식 요소도 동적으로 구성할 수 있다:
> ```
> <div>{children}</div>
> ```

### Reference
- React 공식 문서 (URL_UNKNOWN)

---

## 브라우저는 JSX를 직접 실행할 수 있는가?

### Official Answer
But browsers don't understand JSX out of the box,
so you'll need a JavaScript compiler, such as a Babel,
to transform your JSX code into regular JavaScript.

> #### Key Terms:
> - **out of the box**: 별도의 설정이나 추가 도구 없이, 기본 상태 그대로
> - **compiler**: 한 언어로 작성된 코드를 다른 언어(여기서는 일반 JavaScript)로 변환하는 도구

### Reference
- React 공식 문서 (URL_UNKNOWN)
