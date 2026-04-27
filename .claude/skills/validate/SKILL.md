---
description: KA 문서를 검증하고 위반 사항을 수정한다. 문서 검증, 규칙 위반 탐지, knowledge 문서 점검 요청 시 사용.
argument-hint: [대상 파일/디렉토리 경로 또는 "전체"]
---

# KA 문서 검증

`knowledge/` 하위 문서가 KA 규칙을 준수하는지 검증하고, 위반을 수정한다.

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

- **Official Answer 언어**: Official Answer/Official Annotation 본문이 공식 문서 원문(대체로 영어)으로 유지되어 있는가. 한글 의역·요약으로 대체된 경우 위반.
- **목차-본문 순서**: Questions 목차와 Answers 본문의 질문 순서가 1:1로 일치하는가.
- **마커 정합성**: `[BACKLOG]` / `[UNVERIFIED]` 마커가 Questions 목록과 본문 헤딩 양쪽에 동일하게 붙어 있는가. 마커가 붙은 질문은 `### Official Answer`와 `### Reference`가 모두 비어 있는가 (둘 중 하나라도 채워져 있으면 마커를 제거해야 함). 마커 없이 Official Answer가 비어 있고 Reference도 비어 있는 경우 위반 (마커 추가 필요). 정의는 [document-structure.md](../../contexts/document-structure.md)의 "미완성 질문 처리" 참고.

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
