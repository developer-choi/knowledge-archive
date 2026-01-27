# 외부 문서 변환 가이드

## 개요

구글 문서 등에 작성된 필기를 fact-archive 표준 양식에 맞춰 마크다운으로 변환하는 가이드입니다.

**사용 상황**:
- 구글 문서로 정리한 학습 내용을 fact-archive에 추가하고 싶을 때
- PDF/MD 파일을 표준 템플릿 형식으로 변환하고 싶을 때

---

## 참고 자료
- [문서 구조 규칙](../rules/document-structure.md)
- [파일 위치 선정 규칙](../rules/file-placement.md)
- [내용 작성 규칙](../rules/content-format.md)
- [표준 양식](../template.md)
- [공식 태그](../tags.md)
- [폴더 구조도](../folder-blueprint.md)
- [검색 가이드](../search-guide.md)

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

- **규칙 준수**: [문서 구조 규칙](../rules/document-structure.md), [파일 위치 선정 규칙](../rules/file-placement.md), [내용 작성 규칙](../rules/content-format.md)을 반드시 따릅니다.
- **원본 언어 존중**: 사용자의 원본 필기(한글 등)가 핵심 내용인 경우, 이를 억지로 영문 번역하지 말고 그대로 `Official Answer`에 포함합니다.
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

[내용 작성 규칙](../rules/content-format.md)과 [문서 구조 규칙](../rules/document-structure.md)을 따라 원본 내용을 템플릿에 매핑합니다.

#### 체크리스트
- [ ] Questions 추출/생성
- [ ] Keywords 추출
- [ ] 핵심 내용(영어 원문 or 사용자 정리) → Official Answer 본문
- [ ] Gemini 캡처 → `> AI Annotation`
- [ ] 부가 설명 → `> User Annotation`
- [ ] 공식 문서 다이어그램 → 텍스트 설명으로 변환

#### 핵심 매핑 방법

**Questions → Answers**:
- 원본에서 질문 형태로 정리된 내용 추출
- 질문이 없다면 면접 질문 형태로 생성
- 답변 없는 질문은 `[TODO]` 처리

**텍스트 → 섹션**:
- **핵심 답변(Core Fact)**: 영어 원문이든 사용자 정리(한글)든 `Official Answer`에 배치.
- **Gemini 캡처**: `> AI Annotation`으로 이동.
- **부가 설명(Side Note)**: `> User Annotation`으로 이동.

자세한 규칙은 [내용 작성 규칙](../rules/content-format.md)을 참고하세요.

### Step 4. 태그 선정
- [ ] [공식 태그](../tags.md)에서 선택
- [ ] 새 태그 필요 시 tags.md에 먼저 추가 제안

자세한 규칙은 [내용 작성 규칙 - Tags](../rules/content-format.md#1-frontmatter-tags)를 참고하세요.

### Step 5. 파일 저장 위치 결정

[파일 위치 선정 규칙](../rules/file-placement.md)을 따라 적절한 폴더와 파일명을 결정합니다.

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

[파일 위치 선정 규칙](../rules/file-placement.md)과 [문서 구조 규칙](../rules/document-structure.md)을 따라 파일을 생성합니다.

#### 체크리스트
- [ ] 폴더 선택 (파일 위치 선정 규칙 참조)
- [ ] 파일명 결정 (파일 위치 선정 규칙 참조)
- [ ] 원본 대조 검증 (문서 구조 규칙 참조)
- [ ] 검색 최적화 검증 (파일 위치 선정 규칙 참조)
- [ ] 파일 생성 및 최종 확인