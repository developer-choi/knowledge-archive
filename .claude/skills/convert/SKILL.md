---
description: 구글 문서(PDF/MD)를 knowledge 문서로 변환한다. 변환, convert, 구글 문서, PDF 시 사용.
argument-hint: [PDF/MD 파일 경로]
---

# 외부 문서 변환

구글 문서 등 외부 필기를 knowledge/ Q&A 형식으로 변환한다.

## 원칙

- **Fact-First**: 사실이 아니거나, 출처 불명확하거나, 회사 특정 정보는 변환을 거부한다.
- **원본 언어 존중**: 사용자의 원본 필기(한글 등)가 핵심 내용이면 억지로 영문 번역하지 않고 그대로 Official Answer에 포함.
- **원문 보존**: AI가 임의로 내용을 가공하지 않는다. 문장 간 연결이 어색하더라도 원문 보존 우선.
- **저작권 주의**: Getty Images 등 외부 이미지는 텍스트 설명으로 대체.

## 원본 문서 패턴

구글 문서는 다음 패턴으로 작성되어 있다:

| 요소 | 패턴 | 변환 대상 |
|---|---|---|
| 영어 텍스트 | 공식 문서 인용 원문 | → Official Answer |
| 한글 텍스트 | 사용자의 해석/보충 | → User Annotation |
| Gemini 캡처 | AI 답변 스크린샷 | → AI Annotation (텍스트로) |
| 공식 문서 캡처 | 다이어그램, 표 등 | → 텍스트 설명으로 변환 |
| 하이퍼링크 | 위키피디아, 공식 문서 등 | → Reference |

## 작업 순서

### Step 1. 시작 전 준비

사용자에게 구글 문서를 **PDF와 MD 두 가지 형식으로 export**하도록 요청한다.
- PDF: 이미지 + 링크 보존
- MD: 텍스트 추출 용이

이미 파일이 제공된 경우 이 단계를 건너뛴다.

### Step 2. PDF 읽기 & 분류

PDF를 읽고 내용을 분류한다.

- 텍스트: 영어(공식 문서 인용) / 한글(사용자 해석) 분류
- 이미지: Gemini 캡처 / 공식 문서 캡처 판별
- 링크: 텍스트로 보이는 URL과 하이퍼링크 텍스트 구분

### Step 3. 템플릿 매핑

[content-format.md](../../contexts/content-format.md)와 [document-structure.md](../../contexts/document-structure.md)를 읽고 매핑한다.

**Questions**:
- 원본에서 질문 형태로 정리된 내용을 추출. 없으면 면접 질문 형태로 생성.
- 오개념 타파(Trick Question) 포함 권장.
- 답변 없는 질문은 `[TODO]` 처리.

**텍스트 → 섹션 매핑**:
- 핵심 답변 (영어 원문 or 한글 정리) → `Official Answer`
- Gemini 캡처 내용 → `> AI Annotation`
- 부가 설명 → `> User Annotation`
- 공식 문서 다이어그램 → 텍스트 설명

**태그**: [tags.md](../../contexts/tags.md)에서 선택.

### Step 4. 파일 위치 결정

[file-placement.md](../../contexts/file-placement.md)와 [folder-blueprint.md](../../contexts/folder-blueprint.md)를 읽고 폴더와 파일명을 결정한다.

### Step 5. 링크 보완 (사용자 대기)

PDF에서 하이퍼링크 텍스트만 보이고 URL을 알 수 없는 경우:

```markdown
- [Domain Name Service](URL_UNKNOWN)
```

이런 항목을 목록으로 정리하여 사용자에게 제시하고, 실제 URL 확인을 요청한 뒤 **대기한다**.
URL이 텍스트로 보이는 경우는 그대로 사용.

### Step 6. 파일 생성 & 검증

[template.md](../../contexts/template.md) 양식으로 파일을 생성한다.

검증 항목:
- 원본 질문 개수와 변환된 질문 개수가 일치하는가?
- 원본의 핵심 답변 내용이 빠짐없이 포함되었는가?
- Questions 목록과 Answers 본문의 순서가 1:1로 일치하는가?

문제가 있으면 직접 수정한다.
