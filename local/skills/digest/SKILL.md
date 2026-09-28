---
disable-model-invocation: true
argument-hint: ON [출처 URL] 또는 OFF
---

# Digest

## 목적

공식문서를 읽어 배우고, 그 주제의 [`knowledge/`](../../contexts/directory-roles.md)를 이번 출처 기준으로 다시 쓴다.

## 이번에 읽는 문서가 기준이다

이번에 읽는 문서가 그 주제의 현재 내용이고, KA에 이미 있는 것은 예전에 정리해둔 것이다. 기존 내용과 부딪히면 이번 문서가 이긴다. ON에서 알린 겹침 목록 안의 기존 Q&A는 지워도 된다.

## 공통 규칙

### 세션 중 질문은 질문 로그에 남긴다

ON부터 OFF까지 사용자가 채팅으로 물으면 채팅에 답한 뒤, `os.tmpdir()`의 `ka-digest-<slug>-questions.md`에 `- <대상(문장 head 또는 개념)> | <무엇을 헷갈렸나> | <어떻게 풀어줬나>` 한 줄을 붙인다. OFF 2단계가 이 로그를 explained 재료로 읽는다.

## 대화형 학습 (ON/OFF)

세션은 **URL 하나당 하나**다.

```
ON [URL] → 루프 — 페이지 순회 → OFF 1단계 — 질문 확정·저장 → OFF 2단계 — 산출물 생성
```

흐름마다 여는 파일이 다르다. 해당 시점에 연다.

- `ON [URL]`, 그리고 단락을 붙여넣을 때마다 → [loop.md](loop.md)를 따른다. 컨텍스트에 그 파일이 없으면(compact 뒤 등) 다시 연다.
- `OFF` 입력 → 질문을 뽑기 전에 [off.md](off.md)를 먼저 연다.
