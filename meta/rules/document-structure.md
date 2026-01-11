# 문서 구조 규칙

문서를 작성하거나 편집할 때 반드시 지켜야 하는 구조적 규칙입니다.

---

## [CRITICAL] 목차(TOC)와 본문 순서 동기화

질문 목록(Table of Contents)과 본문(Answers)의 질문 순서는 **반드시 1:1로 일치**해야 합니다.

### 체크리스트
- [ ] 새로운 질문을 본문의 중간에 삽입했다면, 상단 목차(Questions)에서도 동일한 위치에 링크를 삽입했는가?
- [ ] 본문의 질문 순서를 변경했다면, 목차의 순서도 동일하게 변경했는가?
- [ ] 질문의 들여쓰기(계층 구조)가 목차와 본문 간에 논리적으로 일치하는가?
- [ ] **최종 확인**: 파일을 저장하기 전에 위에서 아래로 훑어보며 목차의 순서대로 본문이 전개되는지 눈으로 검증했는가?

---

## 계층 구조 표현

### Questions 섹션
- **소제목(Header)**: 질문들이 카테고리로 분류되어 있다면, 해당 소제목을 유지합니다.
- **위계(Indent)**: 질문 하위에 꼬리 질문(들여쓰기, 하위 불렛)이 있다면, 이를 반영하여 중첩된 리스트 구조로 작성합니다.

예시:
```markdown
# Questions
- [Main Question 1](#main-question-1)
  - [Follow-up Question 1](#follow-up-question-1)
  - [Follow-up Question 2](#follow-up-question-2)
- [Main Question 2](#main-question-2)
```

### Answers 섹션
본문에서는 헤더 레벨(H2, H3 등)을 통해 위계를 표현할 수 있습니다.

예시:
```markdown
# Answers

## Main Question 1
...

## Follow-up Question 1
...

## Follow-up Question 2
...

## Main Question 2
...
```

---

## TODO 질문 처리

답변이 아직 작성되지 않은 질문은 다음과 같이 처리합니다:

1. **Questions 목록**: 질문 왼쪽에 `[TODO]` 접두사를 붙입니다.
   ```markdown
   - [[TODO] What is the domain?](#todo-whats-the-domain)
   ```

2. **Answers 섹션**: 제목과 하위 구조(Keywords, Official Answer 등)를 미리 만들어두되 내용은 비워둡니다.
   ```markdown
   ## [TODO] What is the domain?
   ### Keywords

   ### Official Answer

   ### Reference
   ```

---

## 질문 추가/이동 규칙

- **문맥 고려**: 새로운 질문은 관련된 주제(Context) 근처에 배치합니다.
- **들여쓰기 활용**: 특정 질문에 종속된 심화 질문(꼬리 질문)이라면, 목차에서 들여쓰기를 사용하여 계층 구조를 명확히 합니다.

---

## 원본 대조 검증

외부 문서를 변환하거나 내용을 추가할 때는 다음을 확인합니다:

- [ ] **질문 개수 일치**: 원본 문서의 질문 개수와 변환된 파일의 질문 개수가 정확히 일치하는가?
- [ ] **질문 텍스트 일치**: 질문 텍스트가 원본과 100% 동일한가? (AI가 임의로 수정하지 않았는가?)
- [ ] **답변 누락 확인**: 원본의 핵심 답변 내용이 빠짐없이 포함되었는가?
