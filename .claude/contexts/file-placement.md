# 파일 위치 선정 규칙

새로운 문서를 생성하거나 기존 문서를 재배치할 때 지켜야 하는 규칙입니다.

---

## 1. 폴더 선택

### 참고 자료
- [폴더 구조도](../folder-blueprint.md)

### 선정 기준
- [ ] [폴더 구조도](../folder-blueprint.md)를 참고하여 적절한 폴더 선택
- [ ] 계층 구조를 준수하여 정확한 위치 결정
  - 예: React Hooks → `knowledge/frontend/react/core/`
  - 예: HTTP Protocol → `knowledge/cs/network/protocols/`

---

## 2. 파일명 작성

파일명은 **검색 용이성**과 **내용 명확성**을 고려하여 작성합니다.

### 명명 규칙
- [ ] 소문자 사용 (예: `react-hooks.md`)
- [ ] 단어 구분은 하이픈(`-`) 사용
- [ ] 핵심 키워드를 파일명에 포함 (Filename Search 최적화)
  - 예: `react-rendering-process.md` (✅)
  - 예: `process.md` (❌ - 키워드 누락)
- [ ] 너무 길지 않게 (2-4 단어 권장)

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

저장하기 전에 [3-Way Search Protocol](../search-guide.md)을 고려하여 다음을 확인합니다:

### 체크리스트
- [ ] **Tag Search**: 선정한 태그가 frontmatter에 올바르게 작성되었는가?
- [ ] **Filename Search**: 파일명에 핵심 키워드가 포함되었는가?
  - 사용자가 "React 관련 문서 찾아줘"라고 했을 때 이 파일이 검색되는가?
- [ ] **Directory Search**: 폴더 구조가 주제별로 올바르게 분류되었는가?
  - `knowledge/frontend/react/` 폴더에서 검색 시 이 파일이 포함되는가?

---

## 4. 문서 분할 시 고려사항

문서의 내용이 너무 방대해져 분할이 필요한 경우:

1. **주제별 분류**: 현재 문서 내에서 독립적인 주제들을 식별합니다.
2. **폴더 구조 확인**: 각 주제에 맞는 적절한 폴더를 선택합니다.
3. **파일명 결정**: 분할된 각 파일의 핵심 키워드를 파일명에 반영합니다.
4. **검색 최적화**: 분할 후에도 3-Way Search Protocol로 검색 가능한지 확인합니다.
