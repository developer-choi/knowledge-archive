---
disable-model-invocation: true
argument-hint: [knowledge 파일 경로 또는 검색 키워드]
---

# HTML 일괄 시험 (exam)

## 목적

[`knowledge/`](../../contexts/directory-roles.md)에 쌓인 질문을 답안지 한 장으로 한꺼번에, 유도 없이 혼자 풀어 /review의 꼬리질문 핑퐁보다 빠르게 복습한다.

## 출제 대상

마커에 따른 출제 여부는 [`/review`의 「미완성 질문 처리」](../review/SKILL.md#미완성-질문-처리)가 단일 출처다. 여기에 다시 적으면 그쪽이 바뀔 때 이 스킬만 어긋난 채 남는다.

이 스킬에만 해당하는 것은 하나다 — 부모·자식 질문을 모두 별개 문항으로 출제한다. 한꺼번에 푸는 시험이라 /review처럼 부모 답을 보고 자식을 건너뛸 수 없다.

---

## Phase 1: 시험 HTML 생성

### 출제 문항 추출

knowledge 파일을 읽고 「출제 대상」대로 출제할 질문 목록을 확정한다.

각 문항의 `explained/<rel>.md` 섹션에 다이어그램(fence 없는 코드블록)이 있으면 그 문항의 `diagramHint`를 켠다. 판별 기준은 explanation-guide의 [코드블록 fence 규칙](../../contexts/explanation-guide.md#코드블록-fence-규칙)이다.

### HTML 생성 및 오픈

1. 출제 문항을 스펙 JSON으로 적는다 — `{ title, questions: [{ title, diagramHint }] }`. `title`은 knowledge 파일명이다.
2. 스펙을 heredoc으로 렌더러에 바로 넘겨 연다.

   ```bash
   npm run --silent build-page -- exam-sheet <<'SPEC_JSON' \
     | node "{{contexts}}/local-html-roundtrip.mjs" open ka-exam - \
       --slug $(npm run --silent build-page -- exam-slug <knowledge 파일 경로>)
   { ...스펙... }
   SPEC_JSON
   ```

   스펙을 Write 도구로 파일에 따로 만들지 않는다. 레포 안(특히 `.claude/` 하위)에 떨어지면 새 파일로 자동 staged되고, 지우려면 승인 프롬프트가 뜬다.

3. 사용자에게 안내: "브라우저에서 시험지를 열었습니다. 답변 작성 후 **제출** 버튼을 누르고 **클립보드 복사**를 누른 뒤, 복사된 JSON을 여기에 그대로 붙여넣으세요."

---

## Phase 2: 답변 받기

사용자가 붙여넣은 JSON이 답안이다. 클립보드를 뒤지지 않는다.

페이로드는 `{ __skill: "ka-exam", ts, sum, answers }`다. `answers[i]`가 i번째 문항의 답변이고, `sum`은 시험지가 답변들로 찍은 지문이다.

- `__skill`이 `ka-exam`이 아니면 다른 폼의 값이다. 채점하지 않고 "시험지의 [클립보드 복사]를 다시 눌러 붙여넣어 주세요"라고 안내한다.

### payload를 파일로 남긴다

채점을 시작하기 전에, 붙여넣은 JSON을 **한 글자도 바꾸지 않고** 임시 폴더에 쓴다. `sum`까지 통째로 한 번에 옮기고, 문항별로 나누거나 요약·줄바꿈 정돈을 하지 않는다. Phase 4가 이 파일로 답변 원문을 채운다.

```bash
PAYLOAD="$(node -p 'require("os").tmpdir()')/ka-exam-answers.json"
cat > "$PAYLOAD" <<'PAYLOAD_JSON'
{ ...붙여넣은 JSON 전문... }
PAYLOAD_JSON
```

### 답변 자리에 답이 아닌 것이 들어온 경우

답이 아닌 것이 들어오면 대조할 답이 없어 채점하지 않는다.

| 들어온 것 | Phase 4 `verdict` | 다음 라운드 |
|---|---|---|
| `(스킵)`·`(생략)` (단독 또는 앞뒤 공백 포함) | `skip` | 제외 |
| 빈 문자열 | `fail` | 출제 |
| 지시문 | `skip` | 제외 |

- **빈 문자열** — 몰라서 비운 것으로 본다. 의도적으로 건너뛴 문항과 몰라서 못 쓴 문항은 다음에 다시 봐야 할 이유가 정반대라, 스킵과 달리 분모에 남고 다시 출제된다.
- **지시문** — 답이 아니라 요청이다(예: 그 질문을 `<이름>.sub.md`로 떼어 달라). 그대로 수행하고 나머지 문항 채점을 이어 간다. 답변란에 지시를 써도 되는지, 수행해도 되는지를 되묻지 않는다 — 되물으면 사용자는 이미 내린 지시를 한 번 더 내려야 한다.

  수행은 원본 체크아웃이 아니라 워크트리에서 한다.

  - 워크트리는 시험 한 번에 하나만 떠서 그 시험의 지시문 전부에 쓴다.
  - 이미 있는 파일을 건드리기 전에 `git status`·`git diff`로 그 파일이 이미 갖고 있던 내용을 확인한다. 옮길 `.sub.md`에 다른 세션이 먼저 분리해 둔 질문이 들어 있으면, 새로 쓰는 순간 그 질문이 사라진다.
  - 수행이 끝나면 워크트리에서 커밋하고 `main` 위로 rebase한 뒤 채점을 이어 간다. 결과지를 열었다고 알릴 때 머지할 브랜치와 머지·워크트리 정리 명령을 함께 안내한다.

---

## Phase 3: 채점

각 문항 답변을 Official Answer 원문과 대조한다. `[UNVERIFIED]` 문항은 자체 지식으로 채점한다.

| 판정 | 기준 |
|---|---|
| ✓ 통과 | Official Answer 핵심 내용 전부 커버 |
| △ 부분 | 일부 커버, 누락 있음 |
| ✗ 오답 | 핵심이 빠지거나 틀림 |

---

## Phase 4: 결과 HTML 생성

채점 결과를 스펙 JSON으로 적어 Phase 1과 같은 방식으로 렌더러에 넘긴다. 슬러그의 `-result`는 시험지와 파일이 겹치지 않게 붙인다.

```bash
npm run --silent build-page -- exam-result --answers "$(node -p 'require("os").tmpdir()')/ka-exam-answers.json" <<'SPEC_JSON' \
  | node "{{contexts}}/local-html-roundtrip.mjs" open ka-exam - \
    --slug $(npm run --silent build-page -- exam-slug <knowledge 파일 경로>)-result
{ ...스펙... }
SPEC_JSON
```

스펙은 `{ title, questions: [...] }`이고, 문항 필드는 아래 표와 같다.

- **답변 원문을 적는 자리는 없다.** 렌더러가 payload의 `answers[i]`를 i번째 문항에 붙인다.
- 스킵 문항도 빼먹지 말고 `questions`에 남긴다. 문항 수와 답변 수가 어긋나면 렌더러가 그리지 않는다.

| 필드 | 담는 것 |
|---|---|
| `verdict` | Phase 3의 판정 — `pass`·`partial`·`fail`. 답이 아닌 것이 들어온 문항은 Phase 2 표를 따른다 |
| `reason` | 판정 이유 1~2줄. `partial`·`fail`에만 적고, 답이 빈 문항에는 적지 않는다 — 지적할 답이 없어 "답을 안 썼다"는 동어반복이 된다 |
| `explanation` | `explained/<rel>.md`에서 그 질문 섹션의 `## 본문` 아래 내용. 판정과 무관하게 **모든 문항에** 적는다 — 통과한 답도 해설과 나란히 놓고 봐야 무엇을 다르게 말했는지 보인다. 요약하지 말고 영어 인용까지 그대로 옮긴다 |
| `official` | 그 질문 섹션에 `## 본문`이 없는 문항만(섹션이 아예 없는 경우 포함) `explanation` 대신 적는다. knowledge 파일의 `### Official Answer` 본문을 그대로 옮긴다 |
| `unverified` | 그 문항이 `[UNVERIFIED]`면 `true` — 결과지에 미확보 표기가 붙는다 |
| `diagram` | `diagramHint`를 켠 문항만. `explained` 섹션의 코드블록 내용을 그대로 넣는다 |

---

## Phase 5: 다음 라운드 처리

사용자가 "다음 라운드"를 입력하면, 완전히 통과하지 못한 문항(✗ 오답 + △ 부분) 수로 갈린다.

| 남은 문항 수 | 처리 |
|---|---|
| 0 | 시험 종료 |
| 1 | /review 방식으로 채팅에서 그 질문 1개를 진행 |
| ≥ 2 | 남은 문항(오답+부분)만으로 Phase 1로 돌아가 새 시험 HTML 생성 |
