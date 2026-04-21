---
description: 구글 문서나 외부 문서(PDF/MD)를 knowledge/ Q&A 형식으로 변환한다. 사용자가 PDF 파일을 주거나, 구글 문서를 export 했다고 말하거나, "변환해줘", "convert", "이 문서 knowledge로 옮겨줘" 등을 요청하면 이 스킬을 사용한다. 파일 경로(.pdf, .md)가 포함된 변환 요청이라면 거의 확실히 이 스킬이 필요하다. 단, 사용자가 직접 학습 내용을 텍스트로 타이핑하거나 공식문서를 읽으며 학습하는 경우는 digest 스킬이 담당한다.
argument-hint: [PDF/MD 파일 경로]
---

# 외부 문서 변환

구글 문서 등 외부 필기를 knowledge/ Q&A 형식으로 변환한다.

## 원칙

- **원문만 변환**: convert는 사용자가 작성한 원문을 Q&A 형식으로 재배치하는 작업이다. AI가 외부 지식을 검색·주입하지 않는다.
- **Official Answer 신규 생성 금지**: AI가 Wikipedia/MDN 등에서 영문 원문을 WebFetch/WebSearch하여 `Official Answer`를 새로 구성하지 않는다. convert의 출력은 기본적으로 User Answer + 사용자 필기 다듬은 Annotation으로만 구성된다.
- **사용자 필기에 없는 Q 추가 금지**: 사용자 필기에 등장하지 않는 개념·질문을 AI 판단으로 새로 만들지 않는다.
- **변환 거부 조건**: 사실이 아니거나, 출처 불명확하거나, 회사 특정 정보는 변환을 거부한다.
- **저작권 주의**: Getty Images 등 외부 이미지는 텍스트 설명으로 대체.

## 내용 판정 (2단계)

각 Q&A 항목에 대해 아래 순서로 판정한다:

1. **(a) 사용자 필기의 설명이 검증 가능한 일반 CS 내용 또는 경험·해석**
   → `User Answer`로 배치
   → 한국어 다듬기 허용 범위는 [content-format.md](../../contexts/content-format.md)의 "작성 원칙" 참고
2. **(b) 사실 검증 불가 또는 원문에 내용이 부족함**
   → drop 후보로 보고

**예외**: 사용자 원문에 공식 문서 원문(영어 블록쿼트·인용)이 이미 포함되어 있다면, 그 부분만 `Official Answer`로 배치하고 출처를 `Reference`에 그대로 옮긴다. AI가 추가 검색으로 보강하지 않는다.

## 이미지·링크 처리

- **AI 답변 캡처**: 이미지 내 텍스트를 `AI Annotation`으로
- **공식 문서 캡처**(다이어그램, 표): 텍스트 설명으로 변환
- **강의 슬라이드 스크린샷**: 변환하지 않음 (드롭)
- **내부 Google Docs 링크**: Reference에서 제외 (외부 접근 불가)
- **외부 하이퍼링크**(위키피디아/MDN/공식문서): `Reference`로 사용

## 드롭 대상

아래는 변환하지 않고 사용자에게 드롭 목록으로 보고한다:
- "TODO", "일단 넘어감" 등 미완성 표시된 섹션
- 강의 슬라이드 이미지
- 정전 대응이 없고 사실 검증도 불가한 항목

## 기존 knowledge 병합

기존 `knowledge/` 파일과 주제가 겹치는 경우:
- 기존 Official Answer는 보존. 신규 입력의 한국어는 `AI Annotation`/`User Annotation`으로만 추가
- 동일 개념 Q가 양쪽에 있으면 기존 Q 유지, 신규 Q는 삭제

## 작업 순서

### Step 1. Before

[production-guide.md](../../contexts/production-guide.md)의 **Before** 읽기.

구글 문서는 PDF + MD 두 형식을 대조 읽기한다. 파일이 없으면 export 요청 후 대기.

### Step 2. Q 목록 초안 + 큐레이션 (사용자 대기)

원문에서 Q 목록을 추출하고, 아래 후보를 목록화하여 사용자 확인을 받는다. **자동 적용 금지**:
- **drop 후보**: 면접 가치 낮은 Q, "TODO"/"넘어감" 표시 섹션, 정전 대응 없는 Q
- **merge 후보**: 같은 개념을 다른 각도로 묻는 Q들
- **reorder 제안**: 개념 → 동작 원리 → 엣지 케이스 순 재배치

### Step 3. 판정 & 매핑

[content-format.md](../../contexts/content-format.md)를 읽고, 위 "내용 판정 (2단계)"에 따라 각 Q&A의 섹션을 결정한다. 기존 knowledge 파일이 있으면 "기존 knowledge 병합" 규칙 적용.

### Step 4. 링크 보완 (사용자 대기)

PDF에서 하이퍼링크 텍스트만 보이고 URL을 알 수 없는 경우, [content-format.md](../../contexts/content-format.md)의 **URL 불명확 시** 규칙을 적용하고 사용자에게 확인을 요청한 뒤 대기한다.

### Step 5. After

[production-guide.md](../../contexts/production-guide.md)의 **After** 실행.

추가 검증:
- Step 2에서 사용자가 확정한 큐레이션 결정이 반영되었는가?
- 원본의 핵심 답변 내용이 (드롭 합의 제외) 빠짐없이 포함되었는가?
- 사용자 원문에 없던 내용을 AI가 외부 리서치로 추가하지 않았는가?
- 사용자 원문에 없던 Q를 AI 판단으로 새로 만들지 않았는가?
- **자기모순 스캔**: 각 Q 내부에 상충하는 문장 쌍이 없는가? (예: "증가하는 값이며 랜덤값이다")
- **확립된 사실 대조**: 표준 수치(IANA 포트 범위, IP 클래스별 비트 수 등)와 핵심 용어 정의(CPU 레지스터·헤더 필드 역할)가 위키피디아 수준의 확립된 지식과 일치하는가? WebFetch 아님, 내부 지식과 대조.
- 자기모순·사실 오류 발견 시 `User Answer`/`User Annotation`/`AI Annotation`에 한해 정정하고 `Official Answer`는 그대로 둔다. 정정 내역은 사용자 보고서에 기록한다.
