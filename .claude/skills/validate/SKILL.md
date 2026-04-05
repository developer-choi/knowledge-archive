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
