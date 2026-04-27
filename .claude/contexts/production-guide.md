# Production Guide

knowledge/ 문서를 생성하거나 수정하는 **모든 스킬**은 반드시 Before/After를 따른다. 스킬 전체가 끝나는 시점에는 추가로 "스킬 종료 시" 절차를 실행한다.

---

## Before

스킬 고유 작업을 시작하기 전에 읽는다.

- [content-format.md](content-format.md) — 기본 원칙 및 내용 작성 규칙

---

## After

스킬 고유 작업이 끝난 뒤 실행한다.

### 파일 배치

[file-placement.md](file-placement.md)를 읽고 대상 파일을 결정한다.

- 기존 파일에 관련 내용이 있으면 → 해당 파일에 추가
- 새로운 주제면 → [folder-blueprint.md](folder-blueprint.md) 참고하여 새 파일 생성

### 구조 검증

[document-structure.md](document-structure.md)와 [template.md](template.md)를 읽고 검증한다. 문제가 있으면 사용자에게 알리지 않고 직접 수정한다.

### 태그 검증

[tags.md](tags.md)에서 적절한 태그가 선택되었는지 확인한다.

### Official Answer 원문 대조

문서를 최종 생성하기 전에, 각 Official Answer가 사용자가 제공한 원문과 1:1로 일치하는지 대조한다. 임의로 문장을 합성하거나 누락한 부분이 없는지 확인하고, 불일치가 있으면 수정한다.

---

## 스킬 종료 시

스킬 작업이 모두 끝나는 시점에 한 번만 실행한다. 같은 세션에서 여러 번 저장하는 스킬(예: digest 대화형 모드)이라도 매 저장마다 반복하지 않는다.

### 분할 경고

이번 스킬에서 변경한 파일에 대해 [file-placement.md의 문서 분할 기준](file-placement.md#4-문서-분할)을 확인하고, 기준 초과 시 사용자에게 경고한다.
