# 파일 위치 선정 규칙

새로운 문서를 생성하거나 기존 문서를 재배치할 때 지켜야 하는 규칙입니다.

---

## 1. 폴더 선택

### 선정 기준
- 기존 트리를 직접 훑어(`ls`·`Glob`) 같은 주제를 다루는 폴더가 이미 있는지 먼저 확인한다. 별도의 폴더 구조 문서는 두지 않는다 — 실물 트리가 유일한 근거다
- 계층 구조를 준수하여 정확한 위치 결정
  - 예: React Hooks → `knowledge/frontend/react/core/`
  - 예: HTTP Protocol → `knowledge/cs/network/protocol/`

### 폴더 = 같은 주제 파일 모음

한 폴더는 **같은 주제**의 파일들을 담는다. 같은 하위 주제(도구·라이브러리·세부 개념 등) 파일이 **2개 이상** 모이면 그 하위 주제로 자식 폴더를 만든다. 파일이 하나뿐이면 부모 폴더에 flat하게 둔다 — 단일 파일에 폴더를 씌우지 않는다.

- 나중에 2번째 파일이 생기면 그때 폴더로 접고, 짝꿍 explained·assets 미러도 같은 경로로 함께 옮긴다 ([directory-roles.md](directory-roles.md)「원본 이동 시 미러 동반 이동」).
- 기존에 만들어진 단일 파일 폴더(예: `vitest/`, `storybook/`)는 소급 정리 대상이 아니다 — 이 규칙은 앞으로의 배치에 적용한다.

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
knowledge/frontend/react/core/
  ├── react-hooks.md          ← useState, useEffect 등 내용
  ├── react-rendering.md      ← 렌더링 프로세스
  └── react-component-lifecycle.md

knowledge/cs/network/protocols/
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

### 경고 기준

**knowledge 문서가 400줄을 초과하면 사용자에게 경고한다.**
AI가 임의로 분할하지 않는다. 분할, 꼬리질문 분리, 답변 축약 등 구체적 액션은 사용자가 판단한다.

### 분할 실행 시 고려사항

사용자가 분할을 결정한 경우:

1. **주제별 분류**: 현재 문서 내에서 독립적인 주제들을 식별합니다.
2. **폴더 구조 확인**: 각 주제에 맞는 적절한 폴더를 선택합니다.
3. **파일명 결정**: 분할된 각 파일의 핵심 키워드를 파일명에 반영합니다.
4. **검색 최적화**: 분할 후에도 3-Way Search Protocol로 검색 가능한지 확인합니다.
