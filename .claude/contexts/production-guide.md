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

[file-placement.md](file-placement.md)를 읽고 대상 파일을 결정한다.

- 기존 파일에 관련 내용이 있으면 → 해당 파일에 추가
- 새로운 주제면 → [folder-blueprint.md](folder-blueprint.md) 참고하여 새 파일 생성

### 구조 검증

[document-structure.md](document-structure.md)를 읽고 검증한다.

- Questions 목록과 Answers 본문의 순서가 1:1로 일치하는가?
- 앵커 링크가 올바르게 연결되는가?
- [template.md](template.md) 양식을 준수하는가?

문제가 있으면 사용자에게 알리지 않고 직접 수정한다.

### 분할 경고

완성된 파일이 400줄을 초과하면 사용자에게 경고한다. AI가 임의로 분할하지 않는다.
