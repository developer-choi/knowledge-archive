# 내용 작성 규칙

문서의 각 섹션을 작성할 때 지켜야 하는 형식 및 내용 규칙입니다.

---

## 0. 기본 원칙

- **Fact-First**: 객관적 사실만 Official Answer에 기록. 개인 해석은 `> User Annotation`으로 구분.
- **원문 보존**: 공식 문서 원문의 핵심 내용을 그대로 보존. 문장 간 연결이 어색하더라도 AI가 임의로 가공하지 않는다.
- **출처 없으면 작업 중단**: 출처가 제공되지 않으면, 내용 작성 전에 출처 링크를 요청하고 대기한다.

---

## 1. Frontmatter (tags)

### 참고 자료
- [공식 태그 목록](tags.md)

### 작성 규칙
-[공식 태그 목록](tags.md)에서 선택
-최소 1개, 최대 4개 선택
-우선순위: 기술명 > 카테고리 > 특성

예시:
```markdown
---
tags: [react, performance, concept]
---
```

### 새 태그 추가
- 기존 태그 목록에 적합한 태그가 없는 경우, `tags.md`에 먼저 추가 제안
- 비슷한 뜻을 가진 새로운 태그가 생기지 않도록 주의 (예: `error-handling` 대신 `troubleshooting` 사용)

---

## 2. Questions 섹션

### 질문 형식
- 원본 질문은 문법적으로 어색하거나 구어체(예: "Then, how...")라도 수정 없이 그대로 사용한다.
- Paraphrasing, 번역, 요약, 객관식 변환 등 일체 금지.

### 질문 언어
- 질문은 반드시 **영어**로 작성한다.
- 원본이 한글 질문/메모인 경우에도 영어 면접 질문으로 변환한다.

### 질문 생성
질문이 명시되지 않았다면, **면접 질문 형태**로 생성합니다. 이때 다음 규칙을 권장합니다:
- **오개념 타파(Trick Questions) 권장**: 단순한 정의보다는 사용자가 흔히 착각할 수 있는 부분(오개념)을 찌르는 질문을 포함하세요.
  - 예: "useDeferredValue는 네트워크 요청을 줄여주는가?" (단순히 "useDeferredValue란?"보다 더 깊은 이해를 요구함)
- 일반 질문: "React의 렌더링은 어떤 단계로 이루어지는가?"

### 계층 구조
자세한 내용은 [문서 구조 규칙](document-structure.md)을 참고하세요.

---

## 3. Official Answer

### 작성 원칙
- **원본 언어 유지**: 사용자가 작성한 필기나 요약이 한글이라면 **한글 그대로 작성**합니다.
- **출처 명확성**: 반드시 Reference에 출처를 명시
- **객관성**: 개인적 해석이 아닌 검증 가능한 사실만 포함

### Annotation

AI Annotation과 User Annotation 두 가지가 있다. 내용 길이에 따라 형식을 선택한다.

**짧은 경우** — `>` 블록쿼트로 Official Answer 내부에 작성:
```markdown
### Official Answer
A network is a group of communicating computers...

> AI Annotation: 네트워크의 3요소는 Node, Link, Protocol입니다.
> User Annotation: Protocol이 HTTPS 같은거 말하는거임
```

**긴 경우** — `###` 섹션으로 분리:
```markdown
### Official Answer
A network is a group of communicating computers...

### User Annotation
여기에 긴 내용을 여러 줄로 작성한다.
블록쿼트로 쓰면 가독성이 떨어지는 분량일 때 사용.
```

---

## 4. Reference

### 작성 규칙
- 공식 문서 URL 또는 위키피디아 링크 제공
- 링크 형식: 순수 URL만 기재 (Markdown 링크 문법 사용 X)

예시:
```markdown
### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://developer.mozilla.org/en-US/docs/Web/JavaScript
```

### URL 불명확 시
- 임시로 `URL_UNKNOWN` 표시
- 나중에 수동으로 보완

예시:
```markdown
- URL_UNKNOWN
```

---

## 5. 문장 단위 줄바꿈 (Semantic Line Breaks)

### 원칙
- 한 문장이 끝날 때마다 줄바꿈한다.
- 문장이 길어지더라도 온점(`.`)이나 물음표(`?`)로 문장이 종료되면 줄을 바꾼다.

### 이유
Git 등 버전 관리 시스템에서 Diff(변경 내역)를 문장 단위로 깔끔하게 확인하기 위함입니다.

### 예시

❌ 잘못된 예:
```markdown
A network is a group of communicating computers. The network allows computers to share resources and information. Networks can be classified by their size and scope.
```

✅ 올바른 예:
```markdown
A network is a group of communicating computers.
The network allows computers to share resources and information.
Networks can be classified by their size and scope.
```

---

## 6. 이미지 처리

### Case 1: AI 답변 캡처
Official Answer 섹션 내부에 인용 블록으로 추가:
```markdown
### Official Answer
[공식 문서 원문]

> AI Annotation: [AI 캡처 이미지 내 텍스트를 여기에 옮김]
```

### Case 2: 공식 문서 캡처 (다이어그램, 표)
- 이미지가 핵심 정보를 담고 있으면 텍스트로 변환
- 다이어그램은 구조를 텍스트로 설명

### Case 3: 외부 이미지
- 저작권 주의 (예: Getty Images)
- 가능하면 텍스트 설명으로 대체
- 원본 이미지 출처를 Reference에 명시