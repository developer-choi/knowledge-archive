# Production Guide

knowledge/ 문서를 생성하거나 수정하는 **모든 스킬**은 반드시 Before/After를 따른다.

---

## Before

스킬 고유 작업을 시작하기 전에 읽는다.

- [content-format.md](content-format.md) — 기본 원칙 및 내용 작성 규칙

---

## After

스킬 고유 작업이 끝난 뒤 실행한다.

### 파일 배치

[file-placement.md](file-placement.md)를 읽고 대상 파일을 결정한다. 폴더가 주제에 맞는지·파일명에 핵심 키워드가 들어갔는지는 뜻으로 갈리므로 사람이 정한다.

### 양식 검증 — 린터가 한다

저장한 파일을 넣어 돌리고, 나온 위반은 사용자에게 알리지 않고 직접 고친다.

```bash
npm run validate-lint -- <저장한 파일 경로>
```

헤딩 위계·목차 순서·마커 정합·태그 등록 여부·frontmatter 필수 키·파일명·길이 상한을 이 한 번이 전부 본다. [document-structure.md](document-structure.md)·[tags.md](tags.md)를 열어 눈으로 대조하지 않는다 — 그 문서들은 규칙의 단일 출처이지 검사 절차가 아니고, 무엇을 보는지는 `scripts/validate-lint.mts`의 체크 등록부가 정본이다.

### Official Answer 원문 대조

문서를 최종 생성하기 전에, 각 Official Answer가 사용자가 제공한 원문과 1:1로 일치하는지 대조한다. 임의로 문장을 합성하거나 누락한 부분이 없는지 확인하고, 불일치가 있으면 수정한다.

---

## 스킬 종료 시

스킬 작업이 모두 끝나는 시점에 한 번만 실행한다. 같은 세션에서 여러 번 저장하는 스킬(예: digest 대화형 모드)이라도 매 저장마다 반복하지 않는다.

### 분할 경고

길이 상한 초과는 위 「양식 검증」이 이미 잡는다. 여기서는 그 위반이 나왔을 때 **사용자에게 경고만** 하고 끝낸다 — 어떻게 나눌지는 [file-placement.md의 문서 분할 기준](file-placement.md#4-문서-분할)대로 사용자가 정하고, AI가 임의로 분할하지 않는다.
