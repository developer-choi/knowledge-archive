# 필기 추가 가이드

공부하면서 알게 된 새로운 지식을 fact-archive에 필기하는 가이드입니다.

**사용 상황**:
- 공부 중 새로운 사실을 발견하여 기록하고 싶을 때
- 기존 질문에 대한 답변을 찾아서 추가하고 싶을 때
- 새로운 질문과 답변을 동시에 추가하고 싶을 때

---

## 참고 자료
- [문서 구조 규칙](../rules/document-structure.md)
- [파일 위치 선정 규칙](../rules/file-placement.md)
- [내용 작성 규칙](../rules/content-format.md)
- [표준 양식](../template.md)

---

## AI 행동 가이드

### [CRITICAL] 지켜야 할 원칙

- **규칙 준수**: [문서 구조 규칙](../rules/document-structure.md), [파일 위치 선정 규칙](../rules/file-placement.md), [내용 작성 규칙](../rules/content-format.md)을 반드시 따릅니다.
- **사실 검증**: 객관적인 사실(Fact)만 기록합니다. 개인적 의견이나 추측은 `> User Annotation`으로 구분합니다.
- **원문 보존**: Official Answer 섹션은 공식 문서의 원문을 모아두는 곳입니다. 문장 간의 연결이 매끄럽지 않더라도, AI가 임의로 내용을 가공하기보다 원문의 핵심 내용을 그대로 보존하는 것을 우선합니다.
- **출처 명시**: 공식 문서나 신뢰할 수 있는 출처를 Reference에 반드시 포함합니다. 만약 사용자가 필기 추가를 요청하면서 출처 링크를 제공하지 않았다면, Reference 섹션 작성을 위해 관련 링크를 제공해달라고 정중히 요청합니다.

---

## 작업 순서

### Step 1. 파일 위치 선정

[파일 위치 선정 규칙](../rules/file-placement.md)을 따라 필기를 추가할 파일을 결정합니다.

#### 체크리스트
- [ ] 이미 관련 파일이 있는가? → 기존 파일에 추가
- [ ] 새로운 주제인가? → 새 파일 생성
- [ ] 폴더 구조가 적절한가? → [폴더 구조도](../folder-blueprint.md) 참고

### Step 2. 내용 작성

[내용 작성 규칙](../rules/content-format.md)을 따라 필기를 작성합니다.

#### 체크리스트
- [ ] **Questions**: 질문 형태로 정리 (면접 질문 형태 권장)
- [ ] **Keywords**: 핵심 용어 2-3개 추출 (영어)
- [ ] **Official Answer**: 공식 문서 원문 또는 객관적 사실 (영어 우선)
  - [ ] AI가 설명한 내용: `> AI Annotation`으로 추가
  - [ ] 개인적 해석: `> User Annotation`으로 추가
- [ ] **Reference**: 출처 링크 추가

### Step 3. 문서 구조 확인

[문서 구조 규칙](../rules/document-structure.md)을 따라 구조를 검증합니다.

#### 체크리스트
- [ ] Questions와 Answers의 순서가 일치하는가?
- [ ] 앵커 링크가 올바르게 연결되는가?
- [ ] 계층 구조(들여쓰기)가 논리적으로 적절한가?

### Step 4. 최종 확인

- [ ] 문장 단위 줄바꿈 (Semantic Line Breaks) 적용
- [ ] 태그(tags) 선정 완료
- [ ] 파일명과 폴더 위치 적절성 재확인

---

## 사용 예시

### Case 1: 기존 파일에 새 질문/답변 추가

**상황**: `knowledge/cs/network/network-basics.md`에 "What is DNS?"를 추가하고 싶음

**작업**:
1. 파일을 읽고 Questions 섹션에 새 질문 추가
2. Answers 섹션에 답변 작성 (Keywords, Official Answer, Reference 포함)
3. Questions와 Answers의 순서 일치 확인

### Case 2: 새로운 파일 생성

**상황**: React Hooks에 대해 새로 공부한 내용을 정리하고 싶음

**작업**:
1. [파일 위치 선정 규칙](../rules/file-placement.md)에 따라 `knowledge/frontend/react/core/react-hooks.md` 생성
2. [표준 양식](../template.md)을 따라 내용 작성
3. [검색 가이드](../search-guide.md)를 고려하여 태그, 파일명, 폴더 구조 최적화

### Case 3: TODO 질문에 답변 채우기

**상황**: 기존에 `[TODO]`로 표시된 질문에 답변을 찾아서 추가하고 싶음

**작업**:
1. TODO 질문을 찾아서 `[TODO]` 접두사 제거
2. Keywords, Official Answer, Reference 작성
3. [내용 작성 규칙](../rules/content-format.md)을 따라 형식 준수
