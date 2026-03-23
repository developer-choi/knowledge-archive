---
description: 구글 문서나 외부 문서(PDF/MD)를 knowledge/ Q&A 형식으로 변환한다. 사용자가 PDF 파일을 주거나, 구글 문서를 export 했다고 말하거나, "변환해줘", "convert", "이 문서 knowledge로 옮겨줘" 등을 요청하면 이 스킬을 사용한다. 파일 경로(.pdf, .md)가 포함된 변환 요청이라면 거의 확실히 이 스킬이 필요하다. 단, 사용자가 직접 학습 내용을 텍스트로 타이핑하는 경우는 add-note 스킬이, 공식문서를 단락별로 읽으며 학습하는 경우는 digest 스킬이 담당한다.
argument-hint: [PDF/MD 파일 경로]
---

# 외부 문서 변환

구글 문서 등 외부 필기를 knowledge/ Q&A 형식으로 변환한다.

## 원칙

- **변환 거부 조건**: 사실이 아니거나, 출처 불명확하거나, 회사 특정 정보는 변환을 거부한다.
- **저작권 주의**: Getty Images 등 외부 이미지는 텍스트 설명으로 대체.

## 원본 문서 패턴

구글 문서는 다음 패턴으로 작성되어 있다:

| 요소 | 패턴 | 변환 대상 |
|---|---|---|
| 영어 텍스트 | 공식 문서 인용 원문 | → Official Answer |
| 한글 텍스트 | 사용자의 해석/보충 | → User Annotation |
| AI 답변 캡처 | AI 답변 스크린샷 | → AI Annotation (텍스트로) |
| 공식 문서 캡처 | 다이어그램, 표 등 | → 텍스트 설명으로 변환 |
| 하이퍼링크 | 위키피디아, 공식 문서 등 | → Reference |

## 작업 순서

### Step 1. Before

[production-guide.md](../../contexts/production-guide.md)의 **Before** 읽기.

사용자에게 구글 문서를 **PDF와 MD 두 가지 형식으로 export**하도록 요청한다.
이미 파일이 제공된 경우 건너뛴다.

- **PDF**: 이미지(AI 답변 캡처, 다이어그램), 레이아웃, 서식을 확인하는 데 사용
- **MD**: 텍스트 추출과 하이퍼링크 URL 확보에 사용 (PDF에서는 하이퍼링크 URL이 보이지 않는 경우가 많음)

### Step 2. PDF 읽기 & 분류

PDF를 읽고 내용을 분류한다.

- 텍스트: 영어(공식 문서 인용) / 한글(사용자 해석) 분류
- 이미지: AI 답변 캡처 / 공식 문서 캡처 판별
- 링크: 텍스트로 보이는 URL과 하이퍼링크 텍스트 구분

### Step 3. 템플릿 매핑

[content-format.md](../../contexts/content-format.md)를 읽고 매핑한다.

**텍스트 → 섹션 매핑**:
- 핵심 답변 (영어 원문) → `Official Answer`. 원본 문서에 영어 원문이 없는 내용은 AI가 영어를 생성하지 않고, User Answer로 분류한다
- AI 답변 캡처 내용 → `> AI Annotation`
- 부가 설명 → `> User Annotation`
- 공식 문서 다이어그램 → 텍스트 설명

### Step 4. 링크 보완 (사용자 대기)

PDF에서 하이퍼링크 텍스트만 보이고 URL을 알 수 없는 경우:

```markdown
- [Domain Name Service](URL_UNKNOWN)
```

이런 항목을 목록으로 정리하여 사용자에게 제시하고, 실제 URL 확인을 요청한 뒤 **대기한다**.
URL이 텍스트로 보이는 경우는 그대로 사용.

### Step 5. After

[production-guide.md](../../contexts/production-guide.md)의 **After** 실행.

추가 검증:
- 원본 질문 개수와 변환된 질문 개수가 일치하는가?
- 원본의 핵심 답변 내용이 빠짐없이 포함되었는가?
