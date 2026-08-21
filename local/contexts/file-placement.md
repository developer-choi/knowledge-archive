# 파일 위치 선정 규칙

새로운 문서를 생성하거나 기존 문서를 재배치할 때 지켜야 하는 규칙입니다.

---

## 1. 폴더 선택

### 선정 기준
- 기존 트리를 직접 훑어(`ls`·`Glob`) 같은 주제를 다루는 폴더가 이미 있는지 먼저 확인한다. 별도의 폴더 구조 문서는 두지 않는다 — 실물 트리가 유일한 근거다
- 계층 구조를 준수하여 정확한 위치 결정
  - 예: React 렌더 절차 → `knowledge/frontend/react/rendering/`
  - 예: HTTP Protocol → `knowledge/cs/network/protocol/`

### 폴더 = 같은 주제 파일 모음

한 폴더는 **같은 주제**의 파일들을 담는다. 같은 하위 주제(도구·라이브러리·세부 개념 등) 파일이 **2개 이상** 모이면 그 하위 주제로 자식 폴더를 만든다. 파일이 하나뿐이면 부모 폴더에 flat하게 둔다 — 단일 파일에 폴더를 씌우지 않는다.

- 나중에 2번째 파일이 생기면 그때 폴더로 접고, 짝꿍 explained·assets 미러도 같은 경로로 함께 옮긴다 ([directory-roles.md](directory-roles.md)「원본 이동 시 미러 동반 이동」).
- 기존에 만들어진 단일 파일 폴더(예: `testing/vitest/`, `ui-ux/gestures/`)는 소급 정리 대상이 아니다 — 이 규칙은 앞으로의 배치에 적용한다.

선례: `cs/software-engineering/ddd.md`(부모에 flat) + `cs/software-engineering/principles/**`(원칙 문서 2개 이상이라 폴더).

---

## 2. 파일명 작성

파일명은 **검색 용이성**과 **내용 명확성**을 고려하여 작성합니다.

### 명명 규칙
- 소문자 사용 (예: `react-hooks.md`)
- 단어 구분은 하이픈(`-`) 사용
- 핵심 키워드를 파일명에 포함 (Filename Search 최적화)
  - 예: `react-rendering-process.md` (✅)
  - 예: `process.md` (❌ - 키워드 누락)
- 너무 길지 않게 (2-4 단어 권장)

### 파일명 예시
```
knowledge/frontend/react/rendering/
  ├── render-and-commit.md    ← 렌더링 프로세스
  ├── state-as-a-snapshot.md  ← 렌더 안에서 state 값이 고정되는 성질
  └── react-reconciliation.md

knowledge/cs/network/protocol/
  ├── http-basics.md
  └── tcp-ip.md
```

---

## 3. 검색 최적화 검증

저장하기 전에 다음을 확인합니다:

### 체크리스트
- **Tag Search**: 선정한 태그가 frontmatter에 올바르게 작성되었는가?
- **Filename Search**: 파일명에 핵심 키워드가 포함되었는가?
  - 사용자가 "React 관련 문서 찾아줘"라고 했을 때 이 파일이 검색되는가?
- **Directory Search**: 폴더 구조가 주제별로 올바르게 분류되었는가?
  - `knowledge/frontend/react/` 폴더에서 검색 시 이 파일이 포함되는가?

---

## 4. 문서 분할

### 길이 상한

**knowledge 문서는 400줄을 초과할 수 없다.**
AI가 임의로 분할하지 않는다. 분할, 꼬리질문 분리, 답변 축약 등 구체적 액션은 사용자가 판단한다.

### 두 갈래 — 곁가지로 떼기 vs 대등하게 쪼개기

큰 문서를 나눌 때 방식이 둘이다. **주인이 있느냐**로 고른다.

| | 곁가지로 떼기 (`<name>.sub.md`) | 대등하게 쪼개기 (폴더) |
|---|---|---|
| 관계 | 본편이 주인, 곁가지가 딸림 | 주인 없음. 나뉜 파일들이 나란함 |
| 나누는 기준 | 취급 — 덜 외워도 되거나 `/exam`·`/review` 대상에서 빼고 싶은 질문을 덜어냄 | 주제 — 서로 다른 주제가 한 파일에 섞여 있음 |
| 결과 | 본편 이름·경로 그대로, 옆에 `.sub.md` 하나 추가 | 원본이 사라지고 새 이름 파일 여럿 생김 |

주제가 여럿이면서 그중 하나가 덜 중요한 경우엔 **먼저 폴더로 쪼개고**, 쪼갠 파일 각각에서 다시 곁가지를 뗀다. 한 번에 섞어서 처리하지 않는다.

### 곁가지 분리 — `<name>.sub.md`

원본 `<name>.md`에서 "덜 기억해도 되는" 또는 "`/exam`·`/review`로 시험 보고 싶지 않은" 질문만 떼어 같은 폴더의 `<name>.sub.md`로 옮긴다. 본편은 이름이 바뀌지 않으므로 링크·미러가 깨지지 않는다.

- **위치**: 본편과 같은 폴더. 별도 폴더를 만들지 않는다.
- **미러**: 짝꿍 `explained/<rel>/<name>.sub.md`도 같은 이름으로 함께 둔다. `.sub.md`도 knowledge↔explained 셋트 검사(고아 파일·짝 부재) 대상이다.
- **frontmatter**: 본편의 `tags`·`source`를 그대로 상속한다. `priority`는 상속하지 않는다 — 우선순위가 낮아서 덜어낸 파일이므로 사용자가 따로 부여하지 않는 한 키 자체를 두지 않는다.
- **깊이**: 한 단계만. `<name>.sub.sub.md`는 만들지 않는다.
- **스크립트 취급**: `list-candidates`·`validate-lint`는 일반 `.md`와 동일하게 스캔한다. 슬러그는 `<name>.sub`가 된다.
- **이동 시**: 본편을 옮기거나 개명하면 곁가지 4개(knowledge·explained × 본편·곁가지)를 **한 번에** 옮긴다. 본편만 옮기고 곁가지를 두고 오면 `validate-lint`의 본편 없는 곁가지 검사가 잡는다.

- **문서 통째로 덜 중요해지면**: 파일명을 건드리지 않고 frontmatter의 `priority`를 낮춘다. 본편을 `<name>.sub.md`로 개명하지 않는다 — 그러면 본편 없는 곁가지가 되어 같은 검사에 걸린다. `.sub.md`는 **한 문서 안에서** 일부 질문을 덜어내는 도구고, 문서 전체의 중요도는 `priority`가 담당한다 ([content-format.md](content-format.md)「priority」).
- **본편이 가치를 잃으면**: 본편 질문 전체가 기억할 가치가 없어져 지우게 되면, 곁가지를 **본편 이름으로 개명**한다 (`<name>.sub.md` → `<name>.md`, explained 미러도 함께). 곁가지만 남겨두지 않는다 — `.sub` 꼬리표는 "본편이 따로 있다"는 표시라서, 본편이 없으면 이름이 사실과 어긋난다. 남은 게 하나뿐이면 그게 본편이다.

선례: `knowledge/frontend/react/state/how-to-manage-state.sub.md`, `knowledge/cs/software-engineering/principles/declarative-vs-imperative.sub.md`.

### 분할 실행 시 고려사항

사용자가 분할을 결정한 경우:

1. **주제별 분류**: 현재 문서 내에서 독립적인 주제들을 식별합니다.
2. **폴더 구조 확인**: 각 주제에 맞는 적절한 폴더를 선택합니다.
3. **파일명 결정**: 분할된 각 파일의 핵심 키워드를 파일명에 반영합니다.
4. **검색 최적화**: 분할 후에도 §3의 세 검증(태그·파일명·폴더)으로 검색 가능한지 확인합니다.
