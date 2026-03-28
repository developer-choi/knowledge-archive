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
2. **Reference 보완**: Official Answer가 영어 원문이고 Reference가 비어 있거나 `URL_UNKNOWN`이면, WebFetch로 출처 URL을 탐색하여 채운다
3. 위반 목록을 보고한다
4. 사용자 승인 후 수정한다. 수정 1건당 커밋 1개.

대상이 "전체"이면 `knowledge/` 하위 모든 .md 파일을 순회한다. 파일이 많으면 서브에이전트로 병렬 검증한다.
