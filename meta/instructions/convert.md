# 외부 문서 변환 가이드

## 개요

구글 문서 등에 작성된 필기를 fact-archive 표준 양식에 맞춰 마크다운으로 변환하는 가이드입니다.

**사용 상황**:
- 구글 문서로 정리한 학습 내용을 fact-archive에 추가하고 싶을 때
- PDF/MD 파일을 표준 템플릿 형식으로 변환하고 싶을 때

---

## AI 행동 가이드

### 배경 지식

원본 문서(구글 문서)는 다음 패턴으로 작성되어 있습니다:

**텍스트**:
- **영어**: 공식 문서에서 인용한 원문 (출처 있음)
- **한글**: 사용자의 개인적인 해석 및 보충 설명

**이미지**:
1. **Gemini 답변 캡처**: AI(Gemini)가 설명한 내용의 스크린샷
2. **공식 문서 캡처**: 공식 문서의 다이어그램, 표, 스크린샷

**링크**:
- 주로 위키피디아, 공식 문서 등으로 연결되는 하이퍼링크

### 시작 전 준비

사용자에게 다음을 요청합니다:
- 구글 문서를 **PDF와 MD 두 가지 형식으로 export**
- PDF: 이미지 + 링크 모두 보존
- MD: 텍스트 추출 용이

### [CRITICAL] 지켜야 할 원칙

- **질문 텍스트 절대 보존**: 원본 질문은 문법적으로 어색하거나 구어체(예: "Then, how...")라도 **수정 없이 그대로 사용**합니다. AI가 임의로 Paraphrasing 하는 것을 금지합니다.
- **Step 1 검증 실패 시 작업 거부**: 사실(Fact)이 아니거나, 출처 불명확하거나, 회사 특정 정보는 변환 거부
- **Step 6에서 사용자 대기**: 링크 URL 보완은 사용자 역할이므로 여기서 멈추고 승인 대기
- **저작권 주의**: Getty Images 등 외부 이미지는 텍스트로 대체

---

## Step별 상세 내용

### Step 2. PDF 읽기
- [ ] 텍스트 추출 (영어/한글 분류)
- [ ] 이미지 내용 파악 (Gemini 캡처 vs 공식 문서)
- [ ] 링크 텍스트 확인 (URL은 별도 확인 필요)

### Step 3. 템플릿 매핑
- [ ] Questions 추출/생성
- [ ] Keywords 추출
- [ ] 영어 → Official Answer 본문
- [ ] Gemini 캡처 → `> AI Annotation`
- [ ] 한글 보충 설명 → `> User Annotation`
- [ ] 공식 문서 다이어그램 → 텍스트 설명으로 변환

#### 3-1. 매핑 규칙

**Frontmatter (tags)**:
- [공식 태그 목록](../tags.md) 참고
- 최소 1개, 최대 4개 선택
- 우선순위: 기술명 > 카테고리 > 특성

**Questions 섹션**:
- 원본에서 질문 형태로 정리된 내용 추출
- **계층 구조 유지**:
  - **소제목(Header)**: 원본 문서에 질문들이 카테고리로 분류되어 있다면, 해당 소제목을 유지합니다.
  - **위계(Indent)**: 질문 하위에 꼬리 질문(들여쓰기, 하위 불렛)이 있다면, 이를 반영하여 중첩된 리스트 구조로 작성합니다.
- 질문이 명시되지 않았다면, **면접 질문 형태**로 생성
  - 예: "React의 렌더링 과정" → "React의 렌더링은 어떤 단계로 이루어지는가?"
- **답변이 없는 질문 처리**: 원본에 질문만 있고 상세 답변 내용이 없는 경우, `Questions` 목록의 해당 질문 왼쪽에 `[TODO]` 접두사를 붙입니다. `Answers` 섹션에도 제목과 하위 구조(Keywords, Official Answer 등)를 미리 만들어두되 내용은 비워둡니다.

**Keywords**:
- 영어로 작성된 핵심 용어 2-3개 추출
- 원본에 별도로 표시되어 있으면 그대로 사용

**Official Answer**:
- **영어 텍스트** → 이 섹션의 본문으로 매핑
- 공식 문서 원문 또는 객관적 사실
- 출처가 명확해야 함

**인용 블록 (Official Answer 내부)**:
- `> AI Annotation`: **Gemini 답변 캡처 이미지**의 텍스트를 여기에 옮김
- `> User Annotation`: **한글로 작성된 보충 설명** 중 부연 설명 성격인 것

예시:
```markdown
### Official Answer
A network is a group of communicating computers...

> AI Annotation: 네트워크의 3요소는 Node, Link, Protocol입니다.
> User Annotation: 여기서 말하는 Protocol이 그 HTTPS 같은거 말하는거임
```

**Reference**:
- 공식 문서 URL 또는 위키피디아 링크
- PDF에서 링크 클릭해서 실제 URL 확인 필요
- 링크 추출 안 되면 `URL_UNKNOWN` 표시 후 수동 보완

#### 3-2. 이미지 처리

**Case 1: Gemini 답변 캡처**
Official Answer 섹션 내부에 인용 블록으로 추가:
```markdown
### Official Answer
[공식 문서 원문]

> AI Annotation: [Gemini 캡처 이미지 내 텍스트를 여기에 옮김]
```

**Case 2: 공식 문서 캡처 (다이어그램, 표)**
- 이미지가 핵심 정보를 담고 있으면 텍스트로 변환
- 다이어그램은 구조를 텍스트로 설명

**Case 3: Getty Images 등 외부 이미지**
- 저작권 주의
- 가능하면 텍스트 설명으로 대체
- 원본 이미지 출처를 Reference에 명시

### Step 4. 태그 선정
- [ ] [공식 태그](../tags.md)에서 선택
- [ ] 새 태그 필요 시 tags.md에 먼저 추가 제안

### Step 5. 파일 저장 위치 결정
- [ ] [폴더 구조도](../folder-blueprint.md) 참고
- [ ] 예: React Hooks → `knowledge/frontend/react/core/hooks.md`

### Step 6. 링크 보완 (사용자 역할)
- [ ] MD 파일의 `URL_UNKNOWN`을 실제 URL로 교체

#### 6-1. 링크 처리 방법

**URL이 텍스트로 보이는 경우**:
```markdown
https://react.dev/learn
```
→ 그대로 복사 또는 `[설명](URL)` 형태로

**하이퍼링크 텍스트인 경우**:
PDF 읽기만으로는 URL을 알 수 없음
```markdown
- [Domain Name Service](URL_UNKNOWN)
```
→ 사용자가 PDF에서 링크 클릭하여 실제 URL 확인 후 교체

### Step 7. 파일 생성 및 저장
이 단계는 [검색 가이드](../search-guide.md)의 3-Way Search Protocol을 고려하여 파일을 저장합니다.

#### 7-1. 폴더 선택
- [ ] [폴더 구조도](../folder-blueprint.md)를 참고하여 적절한 폴더 선택
- [ ] 계층 구조를 준수하여 정확한 위치 결정
  - 예: React Hooks → `knowledge/frontend/react/core/`
  - 예: HTTP Protocol → `knowledge/network/protocols/`

#### 7-2. 파일명 결정
파일명은 **검색 용이성**과 **내용 명확성**을 고려하여 작성합니다.

**명명 규칙:**
- [ ] 소문자 사용 (예: `react-hooks.md`)
- [ ] 단어 구분은 하이픈(`-`) 사용
- [ ] 핵심 키워드를 파일명에 포함 (Filename Search 최적화)
  - 예: `react-rendering-process.md` (X: `process.md`)
  - 예: `http-status-codes.md` (X: `codes.md`)
- [ ] 너무 길지 않게 (2-4 단어 권장)

**파일명 예시:**
```
knowledge/frontend/react/core/
  ├── react-hooks.md          ← useState, useEffect 등 내용
  ├── react-rendering.md      ← 렌더링 프로세스
  └── react-component-lifecycle.md

knowledge/network/protocols/
  ├── http-basics.md
  └── tcp-ip.md
```

#### 7-3. 원본 대조 검증
원본 내용이 왜곡되거나 누락되지 않았는지 확인합니다.

- [ ] **질문 개수 일치**: 원본 문서의 질문 개수와 변환된 파일의 질문 개수가 정확히 일치하는가?
- [ ] **질문 텍스트 일치**: [CRITICAL] 원칙에 따라, 질문 텍스트가 원본과 100% 동일한가? (AI가 임의로 수정하지 않았는가?)
- [ ] **답변 누락 확인**: 원본의 핵심 답변 내용이 빠짐없이 포함되었는가?

#### 7-4. 검색 최적화 검증
저장하기 전에 다음을 확인합니다:

- [ ] **Tag Search**: Step 4에서 선정한 태그가 frontmatter에 올바르게 작성되었는가?
- [ ] **Filename Search**: 파일명에 핵심 키워드가 포함되었는가?
  - 사용자가 "React 관련 문서 찾아줘"라고 했을 때 이 파일이 검색되는가?
- [ ] **Directory Search**: 폴더 구조가 주제별로 올바르게 분류되었는가?
  - `knowledge/frontend/react/` 폴더에서 검색 시 이 파일이 포함되는가?

#### 7-5. 파일 생성
- [ ] 결정된 경로에 파일 생성
- [ ] 템플릿 형식이 올바르게 적용되었는지 최종 확인

---

## 참고 자료
- [표준 양식](../template.md)
- [공식 태그](../tags.md)
- [폴더 구조도](../folder-blueprint.md)
- [검색 가이드](../search-guide.md)
