---
disable-model-invocation: true
argument-hint: [knowledge 파일 경로 또는 검색 키워드]
---

# HTML 일괄 시험 (exam)

## 목적

[`knowledge/`](../../contexts/directory-roles.md)에 쌓인 질문을 유도 없이 혼자 풀어보게 한다.

/review 스킬로 하나씩 꼬리질문을 받아가며 진행하면 면접처럼 연습이 가능하지만, 시간이 오래걸린다는 단점이 있다.

그래서 이 스킬은 한번에 여러 질문을 답안지로 제출하여, 빠르게 복습을 할 수 있다는 장점을 챙기기 위해 작성되었다.

## 공통 규칙

마커 처리·해설 기준·explained 캐시 규칙은 `/review`·`/digest`와 동일하게 적용한다.

### 마커 처리

어느 질문을 출제하는지는 여기서 정하지 않는다. `/review`의 「미완성 질문 처리」가 단일 출처다. 출제 여부를 여기에 다시 적으면 그쪽이 바뀔 때 이 스킬만 어긋난 채 남고, 판정이 갈려도 어느 쪽이 맞는지 알 수 없다.

이 스킬에만 해당하는 것은 아래뿐이다.

- 출제된 `[UNVERIFIED]` 문항은 결과 HTML에 "공식 출처 미확보 — 자체 지식 기반 채점"을 표기한다
- 부모·자식 질문은 모두 별개 문항으로 출제한다

### [UNVERIFIED] 질문의 H1 형식 (explained 파일 작성 시)

`[UNVERIFIED]` 마커가 붙은 질문은 `explained/<rel>.md` H1에도 마커를 포함한다.

```
# [UNVERIFIED] 프로세스를 처음 만들 때, OS는 자료구조에 무엇을 저장해야 하나요?
```

별도 주석(`*공식 출처 미확보...*` 등)으로 분리하지 않는다.

---

## Phase 1: 시험 HTML 생성

### 출제 문항 추출

knowledge 파일을 읽고 공통 규칙을 적용하여 출제할 질문 목록을 확정한다.

각 문항에 대해 `explained/<rel>.md`의 해당 섹션을 확인하여 fence 없는 코드블록(다이어그램)이 있는지 체크한다. 있으면 해당 문항을 "diagram_hint" 플래그로 표시 — 시험 HTML 생성 시 문항 위에 안내 문구가 박히고, 결과 HTML에는 그 다이어그램이 인라인으로 표시된다. 다이어그램 판별 기준은 [explanation-guide.md §4](../../contexts/explanation-guide.md) 참고.

### HTML 생성 및 오픈

1. 출제 문항을 스펙 JSON으로 적는다 — `{ title, questions: [{ title, diagramHint }] }`. `title`은 knowledge 파일명, `diagramHint`는 위에서 표시한 플래그다.
2. 렌더러에 넘겨 그대로 연다. 페이지 골격·회수 payload는 렌더러가, 저장 경로·인코딩·오픈 방식은 그다음 스크립트가 정한다. 파일명에 쓸 슬러그도 렌더러가 knowledge 경로에서 뽑는다.

   **스펙 JSON은 레포 안에 만들지 않고 `os.tmpdir()` 아래에 쓴다.** 아래를 한 번에 실행한다 — 스펙을 Write 도구로 따로 만들지 말고 heredoc으로 그 자리에서 넘긴다.

   ```bash
   SPEC="$(node -p 'require("os").tmpdir()')/ka-exam-sheet.json"
   cat > "$SPEC" <<'SPEC_JSON'
   { ...스펙... }
   SPEC_JSON
   npm run --silent build-page -- exam-sheet < "$SPEC" \
     | node {{contexts}}/local-html-roundtrip.mjs open ka-exam - \
       --slug $(npm run --silent build-page -- exam-slug <knowledge 파일 경로>)
   ```

   - 쓸 자리를 따로 찾지 않는다. 위 `node -p`가 그 자리를 주므로 `mkdir`·`ls`·`find`·`echo %TEMP%`를 돌릴 일이 없다.
   - 중간 파일이 레포 안(특히 `.claude/` 하위)에 떨어지면 새 파일로 자동 staged되고, 지우려면 승인 프롬프트가 뜬다. 임시 폴더에 쓰면 둘 다 안 걸리므로 뒤처리도 하지 않는다 — 최종 HTML도 같은 곳에 떨어진다.

3. 사용자에게 안내: "브라우저에서 시험지를 열었습니다. 답변 작성 후 **제출** 버튼을 누르고 **클립보드 복사**를 누른 뒤, 여기에 **done**이라고 말하세요."

---

## Phase 2: 답변 회수

사용자가 "done"이라고 말하면 다음으로 회수한다. 마커·신선도 검증은 이 스크립트가 하고, 어긋나면 사용자에게 보여줄 안내 문구를 내며 0이 아닌 코드로 끝난다 — 그때는 채점하지 않는다.

```
node {{contexts}}/local-html-roundtrip.mjs collect ka-exam
```

페이로드 형태: `{ __skill: "ka-exam", ts: <ms>, answers: [<Q1 답변>, <Q2 답변>, ...] }`. `answers` 배열의 인덱스가 문항 순서(0-based)와 대응한다.

### 답변 자리에 답이 아닌 것이 들어온 경우

답변란은 사용자가 손으로 채우는 자리라 답 말고 다른 것이 들어온다. 어느 쪽이든 채점하지 않는다 — 대조할 답이 없기 때문이다. 무엇을 세고 무엇을 다시 낼지가 갈린다.

| 들어온 것 | Phase 4 `verdict` | 다음 라운드 |
|---|---|---|
| `(스킵)`·`(생략)` (단독 또는 앞뒤 공백 포함) | `skip` | 제외 |
| 빈 문자열 | `fail` | 출제 |
| 지시문 | `skip` | 제외 |

- **빈 문자열** — 몰라서 비운 것으로 본다. `reason`을 적지 않는다. 지적할 답이 없어 판정 이유를 쓰면 "답을 안 썼다"는 동어반복이 되고, 사용자가 볼 것은 `official` 원문이다. 스킵과 달리 분모에 남고 다시 출제된다 — 의도적으로 건너뛴 문항과 몰라서 못 쓴 문항은 다음에 다시 봐야 할 이유가 정반대다.
- **지시문** — 답이 아니라 요청이다(예: 그 질문을 `<이름>.sub.md`로 곁가지 분리해달라). 그대로 수행하고 나머지 문항 채점은 이어서 진행한다. 답변란에 지시를 쓸 수 있는지, 수행해도 되는지를 되묻지 않는다 — 되물으면 사용자는 이미 내린 지시를 한 번 더 내려야 한다.

---

## Phase 3: 채점

각 문항 답변을 Official Answer 원문과 대조한다.

| 판정 | 기준 |
|---|---|
| ✓ 통과 | OA 핵심 내용 전부 커버 |
| △ 부분 | 일부 커버, 누락 있음 |
| ✗ 오답 | 핵심이 빠지거나 틀림 |

---

## Phase 4: 결과 HTML 생성

채점 결과를 스펙 JSON으로 적어 같은 렌더러에 넘긴다. 결과 스펙도 Phase 1과 같이 `os.tmpdir()` 아래에 쓰고, 레포 안에는 만들지 않는다.

```bash
SPEC="$(node -p 'require("os").tmpdir()')/ka-exam-result.json"
cat > "$SPEC" <<'SPEC_JSON'
{ ...스펙... }
SPEC_JSON
npm run --silent build-page -- exam-result < "$SPEC" \
  | node {{contexts}}/local-html-roundtrip.mjs open ka-exam - \
    --slug $(npm run --silent build-page -- exam-slug <knowledge 파일 경로>)-result
```

`-result`를 붙이는 것은 시험지와 파일이 겹치지 않게 하기 위해서다.

스펙은 `{ title, questions: [{ title, verdict, answer, reason, official, unverified, diagram }] }`.

| 필드 | 담는 것 |
|---|---|
| `verdict` | Phase 3의 판정 — `pass`·`partial`·`fail`, 채점하지 않았으면 `skip` |
| `answer` | 회수한 사용자 답변 원문. 비었으면 렌더러가 "미응답"으로 채운다 |
| `reason` | 판정 이유 1~2줄. 채점하지 않은 문항과 통과 문항에는 적지 않는다 |
| `official` | 그 문항의 Official Answer 원문. 판정과 무관하게 **모든 문항에** 적는다 — 통과한 답도 원문과 나란히 놓고 봐야 무엇을 다르게 말했는지 보인다. 요약하지 말고 knowledge 파일의 `### Official Answer` 본문을 그대로 옮긴다 |
| `unverified` | 그 문항이 `[UNVERIFIED]`면 `true` — 「마커 처리」가 요구하는 표기를 렌더러가 붙인다 |
| `diagram` | 다이어그램 플래그가 선 문항만. `explained` 섹션의 코드블록 내용을 그대로 넣는다 |

점수·오답 수·하단 다음 라운드 안내는 `verdict`를 세어 렌더러가 만든다.

---

## Phase 5: 다음 라운드 처리

사용자가 "다음 라운드"를 입력하면:

| 오답 수 | 처리 |
|---|---|
| 0 | 시험 종료 |
| 1 | /review 진행 방식으로 채팅 핑퐁 전환. 해당 질문 1개를 직접 출제하고 답변 검증 |
| ≥ 2 | 오답 문항만으로 Phase 1로 돌아가 새 시험 HTML 생성 |
