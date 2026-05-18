---
description: KA 문서를 검증하고 위반 사항을 수정한다. 문서 검증, 규칙 위반 탐지, knowledge 문서 점검 요청 시 사용.
argument-hint: [대상 파일/디렉토리 경로 또는 "전체"]
---

# KA 문서 검증

[`knowledge/`](../../contexts/directory-roles.md) 하위 문서가 KA 규칙을 준수하는지 검증하고, 위반을 수정한다.

## 규칙 소스

검증 기준은 컨텍스트 파일에 정의되어 있다. 검증 전 반드시 읽는다:

| 규칙 | 파일 |
|------|------|
| 문서 구조 | [document-structure.md](../../contexts/document-structure.md) |
| 콘텐츠 포맷 | [content-format.md](../../contexts/content-format.md) |
| 파일 배치 | [file-placement.md](../../contexts/file-placement.md) |
| 태그 목록 | [tags.md](../../contexts/tags.md) |
| 템플릿 | [template.md](../../contexts/template.md) |
| 폴더 구조 | [folder-blueprint.md](../../contexts/folder-blueprint.md) |

## 필수 체크 항목

규칙 소스 전체를 대조하되, 다음 항목은 누락 없이 확인한다:

- **Official Answer 언어**: Official Answer 본문이 공식 문서 원문(대체로 영어)으로 유지되어 있는가. 한글 의역·요약으로 대체된 경우 위반.
- **Official Annotation 잔재**: `> #### Official Annotation:` 블록이 남아 있으면 위반. 폐지된 키이며 모든 공식 보충은 Official Answer에 단락으로 통합되어야 한다.
- **목차-본문 순서**: Questions 목차와 Answers 본문의 질문 순서가 1:1로 일치하는가.
- **마커 정합성**: `[UNVERIFIED]` 마커가 Questions 목록과 본문 헤딩 양쪽에 동일하게 붙어 있는가. 마커가 붙은 질문은 `### Official Answer` 본문이 비어 있는가 (채워져 있으면 마커 제거). 마커 없이 Official Answer가 비어 있는 경우 위반 (마커 추가 필요). 정의는 [document-structure.md](../../contexts/document-structure.md)의 "미완성 질문 처리" 참고.
- **빈 섹션 검출**: `### Official Answer`, `### AI Answer`, `### User Answer`, `### Reference` 등의 헤딩 본문이 비어 있는 경우 위반 — 헤딩 자체를 삭제해야 한다. 정의는 [content-format.md](../../contexts/content-format.md) '작성 원칙'의 '빈 섹션 금지' 참고.
- **동일 헤딩 중복**: 하나의 Q&A 내에서 `### Official Answer` / `### AI Answer` / `### User Answer` / `### Reference` / `> #### AI Annotation:` / `> #### User Annotation:` / `> #### Key Terms:` 중 동일 헤딩이 2개 이상 등장하면 위반. 내용을 합쳐 하나로 통합한다.
- **Annotation 중복**: OA(또는 Key Terms)에서 이미 다룬 정의·예시·메커니즘을 단순 반복하는 AI/User Annotation이 남아 있으면 위반. OA 영어 원문의 한글 번역·요약·풀이도 "단순 반복"으로 본다 (한글 해설은 explained 영역). 정의는 [content-format.md](../../contexts/content-format.md)의 'Annotation 작성 정책 — 한글 풀이 금지' 및 'Annotation 중복 금지' 참고. AI Annotation은 자동 삭제, User Annotation은 사용자에게 정리 확인 후 삭제.
- **인라인 출처 표기**: OA 본문(또는 H4 서브섹션 본문)에 `— URL` 형태의 인라인 출처가 있으면 위반. 해당 URL을 `### Reference`로 이동하고 인라인 표기를 제거한다.
- **OA 앞 한글 삽입**: `### Official Answer` 또는 `#### H4` 헤딩 직후 첫 번째 본문 줄이 한글 문장이면 위반 (AI-authored 한글 도입 문장). OA 섹션은 영어 원문으로만 시작한다. 해당 한글을 삭제하거나 AI Annotation으로 이동.
- **영어 원문 보존**: 과거 Official Annotation 또는 OA 본문이 있던 Q에서 영어 원문이 사라졌으면 위반 (마이그 중 삭제 사고). 원문을 OA로 복원하거나 Reference로 추적한다.
- **OA 길이**: 한 OA 단락이 6문장을 초과하거나 OA 전체가 15문장을 초과하면 정리·분리를 사용자에게 제안한다. 테이블·코드블록·리스트는 문장 수 제외.

각 항목에서 위반 발견 시 아래 "## 검증 및 수정" 절차에 따라 처리한다.

## 검증 및 수정

1. 대상 파일을 규칙 소스와 대조하여 위반을 찾는다
2. **중복 설명 탐지** (전체 검증 시에만): 전용 문서가 존재하는 주제를 다른 문서에서 설명하고 있으면 위반이다.
   - 위반(설명): 개념·동작·원리를 서술하는 단락이나 Q&A ("TLS는 핸드셰이크로 키를 교환하고…")
   - 허용(언급): 사실만 언급하거나 내부 링크 동반 ("HTTPS는 TLS를 사용한다")
   - 전용 문서 판별: knowledge/ 폴더 구조와 파일명 기준
3. **Reference 보완**: Official Answer가 영어 원문이고 Reference가 비어 있거나 `URL_UNKNOWN`이면, WebFetch로 출처 URL을 탐색하여 채운다
4. 위반 목록을 보고한다
5. 사용자 승인 후 수정한다. 수정 1건당 커밋 1개.

대상이 "전체"이면 `knowledge/` 하위 모든 .md 파일을 순회한다. 서브에이전트로 병렬 검증하되, 각 에이전트에게 전체 파일 경로 목록을 함께 전달하여 중복 설명 탐지 시 전용 문서 존재 여부를 판별할 수 있게 한다.

---

## explained/ 검증

knowledge 파일 검증과 함께 수행한다. 대상이 특정 파일이면 해당 `explained/<rel>.md`만, "전체"이면 `explained/` 전체를 검증한다.

### 검증 항목

explained 파일은 사용자가 학습 흐름에 따라 선택적으로 만든다. **explained 파일 자체가 없는 것은 위반이 아니다.** 검증은 explained 파일이 존재하는 경우에만 적용한다.

**커버리지** — knowledge → explained 방향 (explained 파일이 있을 때만)
- `explained/<rel>.md`가 존재하면, `knowledge/<rel>.md`의 모든 질문이 explained에 동일 제목 H1 섹션으로 있어야 한다. (`[UNVERIFIED]` 질문 포함)
- cross-link 항목(`[질문 제목](other.md)` 형식)은 제외한다.

**고아 섹션** — explained → knowledge 방향
- `explained/<rel>.md`의 각 H1 제목이 대응 `knowledge/<rel>.md`의 Questions 목록에 존재해야 한다. 없으면 고아 — 리팩토링 후 잔재.

**고아 파일**
- `explained/<rel>.md`에 대응하는 `knowledge/<rel>.md`가 없으면 고아 파일.

### 수정 방침

| 위반 | 조치 |
|------|------|
| 커버리지 누락 (explained 존재 + 일부 질문 누락) | 자동 수정 불가 — `/explain [파일]`로 해당 질문 설명 후 저장 필요. 사용자에게 누락 목록만 보고한다. |
| 고아 섹션 | 사용자 확인 후 섹션 삭제 |
| 고아 파일 | 사용자 확인 후 파일 삭제 |
