---
disable-model-invocation: true
argument-hint: ON [출처 URL] 또는 OFF
---

# Digest

## 목적

공식문서를 읽어 배우고, 그 주제의 [`knowledge/`](../../contexts/directory-roles.md)를 이번 출처 기준으로 다시 쓴다. KA에 이미 있는 것은 예전에 정리해 둔 것이라, 부딪히면 이번 문서가 이긴다.

## 공통 규칙

### 세션 중 질문은 질문 로그에 남긴다

사용자가 채팅으로 물으면 채팅에 답한 뒤 질문 로그에 남긴다. OFF의 explained 생성 단계가 이 로그를 재료로 읽는다.

```bash
npm run --silent digest -- append <slug> <<'LOG'
<대상 — 카드 원문 첫머리 또는 개념>
<무엇을 헷갈렸나>
<어떻게 풀어줬나>
LOG
```

### slug는 ON의 URL로 정해 끝까지 쓴다

`<slug>`는 `ON`에서 받은 URL로 `npm run --silent digest -- slug <URL>`을 돌려 얻는다.

## 대화형 학습 (ON/OFF)

시점마다 아래 파일을 따른다. 컨텍스트에 그 파일이 없으면 다시 연다.

- `ON [URL]`부터 `OFF` 입력 전까지 — 단락·선택 JSON → [loop.md](loop.md)
- `OFF` 입력부터 끝까지 → [off.md](off.md)
