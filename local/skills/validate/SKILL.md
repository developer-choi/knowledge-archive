---
disable-model-invocation: true
argument-hint: [대상 파일/디렉토리 경로 또는 "전체"]
---

# KA 문서 검증

[`knowledge/`](../local/contexts/directory-roles.md)·`explained/` 하위 문서가 KA 규칙을 준수하는지 검증하고, 위반을 수정한다.

검증은 두 층으로 나뉜다. **결정론 체크**(grep·구조 판정)는 린터 스크립트가 전수 처리하고, **판단 체크**(의미 이해 필요)는 LLM이 본다.

## 규칙 소스

규칙 정의의 단일 출처는 컨텍스트 파일이다. 판단 체크 전 반드시 읽는다:

| 규칙 | 파일 |
|------|------|
| 문서 구조 | [document-structure.md](../local/contexts/document-structure.md) |
| 콘텐츠 포맷 | [content-format.md](../local/contexts/content-format.md) |
| 파일 배치 | [file-placement.md](../local/contexts/file-placement.md) |
| 태그 목록 | [tags.md](../local/contexts/tags.md) |
| 템플릿 | [template.md](../local/contexts/template.md) |
| 폴더 구조 | [folder-blueprint.md](../local/contexts/folder-blueprint.md) |

## 결정론 체크 — 린터 스크립트

기계가 딱 떨어지게 판정하는 항목은 `scripts/validate-lint.mts`가 전담한다. LLM이 통독으로 같은 일을 하지 않는다.

```bash
npm run validate-lint -- <대상 경로|--changed <baseRef>>   # 위반 목록 출력 (텍스트)
npm run validate-lint -- --changed <baseRef> --json        # 기계 소비용 JSON
```

- 대상 미지정 → `knowledge/` + `explained/` 전체.
- 경로 지정 가능 (`knowledge/cs` 등). 회차 변경분만 보려면 `--changed <baseRef>` (그 ref..HEAD diff).
- hard violation 있으면 exit 1, warning(제안성)만이면 exit 0.

린터가 보는 항목(근거 룰은 스크립트 주석 참조): 코드 펜스 불균형, Official Annotation 잔재, 빈 섹션, 동일 헤딩 중복, 인라인 출처 `— URL`, OA 앞 한글, `[UNVERIFIED]` 마커 정합성, 목차-본문 순서, 허용 H1, explained 커버리지·고아 섹션·고아 파일·구분자 중복, (warning) OA 길이.

## 판단 체크 — LLM

린터가 못 보는, 의미 이해가 필요한 항목만 LLM이 본다.

- **OA 언어**: Official Answer 본문이 공식 문서 원문(대체로 영어)으로 유지되는가. 한글 의역·요약으로 대체된 경우 위반. (린터의 'OA 앞 한글'은 도입 문장만 잡고, 본문 전체가 의역인지는 판정 못 함.)
- **영어 원문 보존**: 과거 Official Annotation 또는 OA 본문이 있던 Q에서 영어 원문이 사라졌으면 위반 (마이그 중 삭제 사고). 이전 버전 대비가 필요하므로 git diff로 확인한다. 원문을 OA로 복원하거나 Reference로 추적한다.
- **중복 설명 탐지** (전체 검증 시): 전용 문서가 존재하는 주제를 다른 문서에서 *설명*하면 위반.
  - 위반(설명): 개념·동작·원리를 서술하는 단락이나 Q&A ("TLS는 핸드셰이크로 키를 교환하고…")
  - 허용(언급): 사실만 언급하거나 내부 링크 동반 ("HTTPS는 TLS를 사용한다")
  - 전용 문서 판별: `knowledge/` 폴더 구조와 파일명 기준. 서브에이전트로 병렬 검증 시 각 에이전트에게 전체 파일 경로 목록을 전달한다.
- **Reference 보완**: Official Answer가 영어 원문이고 Reference가 비어 있거나 `URL_UNKNOWN`이면, WebFetch로 출처 URL을 탐색하여 채운다.

`priority`는 검출 대상이 아니다 — AI가 추가하지 않으며, 키가 없어도 위반이 아니고, 채워져 있으면 보존한다 ([content-format.md](../local/contexts/content-format.md)의 priority 참고).

## 검증 및 수정

1. `npm run validate-lint`로 결정론 위반을 수집한다 (전체면 전체, 회차면 `--changed`).
2. 판단 체크를 수행한다. 전체 검증이면 중복 설명 탐지를 위해 서브에이전트로 병렬 처리하되 전체 파일 경로 목록을 함께 전달한다.
3. **Reference 보완**: 위 조건의 Q에 WebFetch로 URL을 탐색해 채운다.
4. 결정론 + 판단 위반 목록을 합쳐 보고한다.
5. 사용자 승인 후 수정한다.

### 수정 방침 (자동 수정 불가 항목)

| 위반 | 조치 |
|------|------|
| explained 커버리지 누락 (explained 존재 + 일부 질문 누락) | 자동 수정 불가 — `/explain [파일]`로 해당 질문 설명 후 저장. 누락 목록만 보고. |
| explained 고아 섹션 | 사용자 확인 후 섹션 삭제 |
| explained 고아 파일 | 사용자 확인 후 파일 삭제 |

그 외 결정론 위반(빈 섹션·중복 헤딩·인라인 출처·구분자 중복·마커·펜스 등)은 승인 후 직접 수정한다.
