---
disable-model-invocation: true
argument-hint: [PDF/MD 파일 경로]
---

# 외부 문서 변환

구글 문서 등 외부 필기를 KA 소주제(knowledge/·techniques/·tips/)에 맞춰 변환한다. 소주제 정의는 [directory-roles.md](../../contexts/directory-roles.md) 참고.

## 원칙

- **원문만 변환**: convert는 사용자가 작성한 원문을 Q&A 형식으로 재배치하는 작업이다. AI가 외부 지식을 검색·주입하지 않는다.
- **Official Answer 신규 생성 금지**: convert의 출력은 기본적으로 User Answer로만 구성된다. AI가 OA를 새로 구성하지 않는 공통 원칙은 [content-format.md](../../contexts/content-format.md)의 "AI의 OA 신규 생성 금지" 참고.
- **사용자 필기에 없는 Q 추가 금지**: 사용자 필기에 등장하지 않는 개념·질문을 AI 판단으로 새로 만들지 않는다.
- **변환 거부 조건**: 사실이 아니거나, 출처 불명확하거나, 회사 특정 정보는 변환을 거부한다.
- **저작권 주의**: Getty Images 등 외부 이미지는 텍스트 설명으로 대체.

## 소주제 결정

변환 시작 전, 자료 성격으로 출력 소주제(knowledge/·techniques/·tips/)를 결정한다. 결정 기준은 [directory-roles.md](../../contexts/directory-roles.md)에 위임한다.

소주제별 처리 절차:

- knowledge/·techniques/ → 양식이 동일(Q&A)하므로 아래 본문 절차를 그대로 적용한다.
- tips/ → 아래 '## tips 가벼운 정리' 섹션 참고. 본문 Q&A 절차는 적용하지 않는다.

## Frontmatter publishable

- **새로 만드는 knowledge/·techniques/ 파일의 frontmatter에 `publishable: false`를 자동으로 박는다.** convert는 사용자 구글 문서 필기 기반이라 공식 출처 검증이 약하므로 외부 채널(Blog/KQ) 자동 노출 대상에서 제외한다. tips/는 외부 노출 대상이 아니므로 frontmatter를 강제하지 않는다.
- 사용자가 추후 검증을 거쳐 `publishable: true`로 승격할 수 있다.
- 기존 파일에 병합할 때는 frontmatter를 건드리지 않는다 (이미 있는 값 유지).

## 내용 판정 (2단계)

각 Q&A 항목에 대해 아래 순서로 판정한다:

1. **(a) 사용자 필기의 설명이 검증 가능한 일반 CS 내용 또는 경험·해석**
   → `User Answer`로 배치
   → 한국어 다듬기 허용 범위는 [content-format.md](../../contexts/content-format.md)의 "작성 원칙" 참고
2. **(b) 사실 검증 불가 또는 원문에 내용이 부족함**
   → drop 후보로 보고

**예외**: 사용자 원문에 공식 문서 원문(영어 블록쿼트·인용)이 이미 포함되어 있다면, 그 부분만 `Official Answer`로 배치하고 출처를 `Reference`에 그대로 옮긴다. AI가 추가 검색으로 보강하지 않는다.

## 이미지·링크 처리

- **AI 답변 캡처**: 다른 AI(ChatGPT, Gemini 등) 답변 이미지 내 텍스트는 면접 답변 수준이면 `### Additional Answer`로, 보조 컨텍스트 수준이면 dropped (필요하면 `/digest` 세션에서 explained/에 다룸)
- **공식 문서 캡처**(다이어그램, 표): 텍스트 설명으로 변환
- **강의 슬라이드 스크린샷**: 변환하지 않음 (드롭)
- **내부 Google Docs 링크**: Reference에서 제외 (외부 접근 불가)
- **외부 하이퍼링크**(위키피디아/MDN/공식문서): `Reference`로 사용

## 콘텐츠 분류 정책

사용자가 작성한 한국어는 User Answer로 분류한다. OA 영어 원문의 한글 번역·요약·해설은 만들지 않는다 (그 역할은 `explained/`가 담당).

**사용자 메모 중복 검토**: 사용자가 작성한 User Answer가 OA(또는 통합 후 OA 단락) 내용을 단순 반복하면 정리 제안을 사용자에게 보고한다. 자동 삭제하지 않는다.

## 드롭 대상

아래는 변환하지 않고 사용자에게 드롭 목록으로 보고한다:
- "TODO", "일단 넘어감" 등 미완성 표시된 섹션
- 강의 슬라이드 이미지
- 정전 대응이 없고 사실 검증도 불가한 항목

## 파일 경계

구글 문서 여러 개를 한 번에 변환 요청받은 경우, 꼭 소스 파일 단위로 출력 파일을 만들 필요는 없다. 주제 응집도를 보고 소스끼리 합치거나 기존 knowledge 파일에 병합하는 판단을 AI가 스스로 한다.

## 기존 Q&A 파일 병합 (knowledge/·techniques/)

신규 변환 시작 전에 같은 개념을 다루는 기존 Q&A가 있는지 `Glob`/`Grep`으로 검색한다 (예: `'use client'` 관련은 `react/rendering/`, `nextjs/rendering/`, `bundler/` 등 여러 디렉토리).

기존 파일과 주제가 겹치는 경우:
- 기존 Official Answer는 보존. 신규 입력의 한국어는 `User Answer`로만 추가
- 동일 개념 Q가 양쪽에 있으면 기존 Q 유지, 신규 Q는 삭제
- 기존 파일이 같은 Official Answer(영문 원문)를 이미 인용 중이면, 신규 파일에서 다시 인용하지 않는다. 기존 파일을 `Reference`로 가리키고 `User Answer`만 추가

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
- 자기모순·사실 오류 발견 시 `User Answer`/`Additional Answer`에 한해 정정하고 `Official Answer`는 그대로 둔다. 정정 내역은 사용자 보고서에 기록한다.

### Step 6. 스킬 종료 시

[production-guide.md](../../contexts/production-guide.md)의 **스킬 종료 시** 실행.

---

## tips 가벼운 정리

tips/는 캡처·메모성 단편 필기. Q&A 양식이 아니므로 위 본문 절차(Step 1~6)를 적용하지 않는다.

**단, 위 「원칙」 섹션은 tips에도 동일하게 적용된다.** 원문만 변환·AI 외부 지식 주입 금지·사용자 필기에 없는 Q/설명 추가 금지가 양식과 무관하게 강제된다. tips는 Q&A 검증 절차가 없어 LLM이 "왜 그런지" 보충 설명을 임의로 추가하는 유혹이 더 강하다 — 사용자가 짧게 "이렇게 하면 된다"라고만 적었으면 이유·근거·확장 예시를 보태지 않고 그대로 둔다.

- **캡처·스크린샷**: 텍스트 설명으로 다듬는다. 이미지 그대로 두지 않음.
- **중복된 항목**: 삭제.
- **사용자 말투**: 자연스럽게 다듬는다. 직역 금지. 단, 말투를 다듬는 것과 내용을 추가하는 것은 다르다 — 문장 구조만 다듬고 정보는 원문 범위를 벗어나지 않는다.
- **기본 섹션**: 제목(H1) + 본문/코드. Q&A 헤딩 안 만든다.
- **자체 검증**: 작성 완료 후 사용자 원문(PDF/MD)과 1:1 대조하여 원문에 없는 문장이 들어갔는지 확인. 발견 시 즉시 제거.

frontmatter는 강제하지 않는다 (외부 노출 대상이 아님).
