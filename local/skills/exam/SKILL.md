---
disable-model-invocation: true
argument-hint: [knowledge 파일 경로 또는 검색 키워드]
---

# HTML 일괄 시험 (exam)

[`knowledge/`](../local/contexts/directory-roles.md) 문서 Q&A를 HTML 시험지로 출력하고 일괄 채점한다.
마커 처리·해설 기준·explained 캐시 규칙은 /review·/explain·/digest와 동일하게 적용한다.

## 공통 규칙

### 마커 처리

- `[UNVERIFIED]` 질문: 출제 포함. 결과 HTML 해당 문항에 "공식 출처 미확보 — 자체 지식 기반 채점" 표기.
- Official Answer 없는 질문: 출제 제외
- 부모·자식 질문: 모두 별개 문항으로 출제

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

각 문항에 대해 `explained/<rel>.md`의 해당 섹션을 확인하여 fence 없는 코드블록(다이어그램)이 있는지 체크한다. 있으면 해당 문항을 "diagram_hint" 플래그로 표시 — 시험 HTML 생성 시 문항 위에 안내 문구가 박히고, 결과 HTML에는 그 다이어그램이 인라인으로 표시된다. 다이어그램 판별 기준은 [explanation-guide.md §4](../local/contexts/explanation-guide.md) 참고.

### HTML 생성 및 오픈

1. 아래 시험 HTML 구조로 파일을 생성한다.
2. `$env:TEMP\ka-exam-<slug>.html` 에 UTF-8로 저장한다. `<slug>`는 knowledge 파일 상대 경로를 `-`로 연결한 값 (예: `cs-system-process-thread-process`)
3. PowerShell `Start-Process "<경로>"` 로 기본 브라우저에서 오픈한다.
4. 사용자에게 안내: "브라우저에서 시험지를 열었습니다. 답변 작성 후 **제출** 버튼을 누르고, 나타나는 텍스트를 복사해서 여기에 붙여넣으세요."

### 시험 HTML 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>시험: {파일명}</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 780px; margin: 48px auto; padding: 0 24px; color: #111; }
    h1 { font-size: 1.3rem; margin-bottom: 4px; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 40px; }
    .q { margin: 28px 0; }
    .q-label { font-weight: 600; margin-bottom: 6px; }
    .diagram-hint { font-size: 0.85rem; color: #555; background: #fff8e1; padding: 6px 10px; margin-bottom: 8px; border-left: 3px solid #ffb300; border-radius: 3px; }
    textarea { width: 100%; min-height: 216px; padding: 8px; font-size: 0.95rem; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; resize: vertical; }
    button { margin-top: 28px; padding: 10px 28px; font-size: 1rem; background: #111; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #333; }
    #output { display: none; margin-top: 28px; }
    #output p { font-weight: 600; margin-bottom: 8px; }
    #result { background: #f4f4f4; min-height: 100px; }
    #copy-btn { margin-top: 8px; background: #4a6cf7; }
  </style>
</head>
<body>
  <h1>시험: {파일명}</h1>
  <p class="meta">총 {N}문항 — 모든 답변을 작성한 뒤 제출 버튼을 누르세요.</p>

  {각 문항 — 번호 1부터 순서대로 반복:}
  <div class="q">
    <div class="q-label">Q{번호}. {질문 제목}</div>
    {diagram_hint 플래그가 있는 문항만:}
    <div class="diagram-hint">이 질문은 그림으로도 표현할 수 있어요. 종이/태블릿/Excalidraw 등 편한 도구로 옆에 그려보세요.</div>
    <textarea id="q{번호}" placeholder="답변을 입력하세요..."></textarea>
  </div>

  <button onclick="collect()">제출</button>

  <div id="output">
    <p>아래 전체를 복사해서 Claude에 붙여넣으세요:</p>
    <textarea id="result" readonly></textarea>
    <br><button id="copy-btn" onclick="copyAll()">클립보드 복사</button>
  </div>

  <script>
    const qIds = [{콤마로 구분된 문자열 배열: 'q1', 'q2', ...}];
    function collect() {
      const parts = qIds.map((id, i) => {
        const v = document.getElementById(id).value.trim();
        return 'Q' + (i + 1) + ':\n' + (v || '(미응답)');
      });
      document.getElementById('result').value = parts.join('\n\n---\n\n');
      document.getElementById('output').style.display = 'block';
      document.getElementById('result').select();
    }
    function copyAll() {
      const ta = document.getElementById('result');
      ta.select();
      document.execCommand('copy');
      document.getElementById('copy-btn').textContent = '복사됨 ✓';
      setTimeout(() => document.getElementById('copy-btn').textContent = '클립보드 복사', 1500);
    }
  </script>
</body>
</html>
```

---

## Phase 2: 답변 파싱

사용자가 붙여넣은 텍스트를 `Q{번호}:` 헤더와 `---` 구분자 기준으로 파싱하여 각 문항의 답변 텍스트를 추출한다.

### 스킵 마커 처리

답변 텍스트가 `(스킵)` 또는 `(생략)`(단독 혹은 앞뒤 공백 포함)이면 해당 문항을 **스킵**으로 분류한다.

- 채점하지 않는다. 결과 HTML에 판정 없이 "스킵" 표시만 한다.
- 점수 분모에도 포함하지 않는다.
- 다음 라운드 출제 목록에도 포함하지 않는다.

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

채점 완료 후 결과 HTML을 생성하여 `$env:TEMP\ka-exam-<slug>-result.html` 에 UTF-8로 저장하고 브라우저에서 오픈한다.

### 결과 HTML 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>결과: {파일명}</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 780px; margin: 48px auto; padding: 0 24px; color: #111; }
    h1 { font-size: 1.3rem; }
    .score { font-size: 1.1rem; margin: 8px 0 40px; }
    .q { margin: 32px 0; border-top: 1px solid #e0e0e0; padding-top: 20px; }
    .verdict { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
    .verdict.pass   { color: #2a7a2a; }
    .verdict.partial { color: #c47c00; }
    .verdict.fail   { color: #c0392b; }
    .user-ans { background: #f9f9f9; border-left: 3px solid #ccc; padding: 8px 12px; margin: 8px 0; font-size: 0.9rem; white-space: pre-wrap; }
    .reason { font-size: 0.9rem; color: #555; }
    .unverified-note { font-size: 0.8rem; color: #888; margin-bottom: 4px; }
    .diagram-compare { margin-top: 12px; }
    .diagram-compare p { font-size: 0.9rem; color: #444; margin-bottom: 6px; font-weight: 600; }
    .diagram-compare pre { background: #f4f4f4; padding: 12px; font-size: 0.85rem; overflow-x: auto; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>결과: {파일명}</h1>
  <div class="score">
    점수: {통과수}/{전체수} &nbsp;|&nbsp; ✓ {통과수} &nbsp; △ {부분수} &nbsp; ✗ {오답수}
  </div>

  {각 문항 반복:}
  <div class="q">
    <div class="verdict {pass|partial|fail}">Q{번호}. {질문 제목} &nbsp;{✓|△|✗}</div>
    {[UNVERIFIED] 문항인 경우:}
    <div class="unverified-note">공식 출처 미확보 — 자체 지식 기반 채점</div>
    <div class="user-ans">{사용자 답변 또는 "미응답"}</div>
    {✓가 아닌 경우:}
    <div class="reason">{판정 이유 1-2줄}</div>
    {diagram_hint 플래그가 있는 문항만:}
    <div class="diagram-compare">
      <p>본인이 그린 그림과 비교해보세요:</p>
      <pre>{explained 섹션의 다이어그램 코드블록 내용}</pre>
    </div>
  </div>

  {결과 HTML 하단 — 다음 라운드 안내:}
  <div style="margin-top:48px; padding:20px; background:#f9f9f9; border-radius:6px;">
    {오답 0개:}
    <strong>모든 문항 통과. 시험 종료.</strong>

    {오답 1개:}
    <strong>1문항 남았습니다.</strong>
    Claude에게 <code>다음 라운드</code>라고 입력하면 채팅으로 진행합니다.

    {오답 ≥ 2개:}
    <strong>오답 {오답수}문항이 남았습니다.</strong>
    Claude에게 <code>다음 라운드</code>라고 입력하면 해당 문항만 다시 시험지로 출제합니다.
  </div>
</body>
</html>
```

---

## Phase 5: 다음 라운드 처리

사용자가 "다음 라운드"를 입력하면:

| 오답 수 | 처리 |
|---|---|
| 0 | 시험 종료 |
| 1 | /review 진행 방식으로 채팅 핑퐁 전환. 해당 질문 1개를 직접 출제하고 답변 검증 |
| ≥ 2 | 오답 문항만으로 Phase 1로 돌아가 새 시험 HTML 생성 |
