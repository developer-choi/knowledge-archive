# Handoff — TkDodo "React Query as a State Manager" digest 세션

## 작업 개요

- **출처**: https://tkdodo.eu/blog/react-query-as-a-state-manager
- **스킬**: `/digest` 대화형 모드 (ON/OFF)
- **세션 날짜**: 2026-04-28
- **모델**: Claude Opus 4.7 (1M context)

## 산출물 (커밋 `a7029eb`)

| 파일 | 변경 | Q&A 수 |
|---|---|---|
| `knowledge/frontend/react-query/as-state-manager.md` | 신규 | 22개 |
| `knowledge/cs/software-engineering/principles/separation-of-concerns.md` | 신규 | 1개 |

### `as-state-manager.md` 톱레벨 질문 (22개 중 톱레벨만)

article 본문 흐름 그대로 따라간다.

1. React Query는 무엇인가? (async state manager 정의)
2. 두 컴포넌트가 동시에 같은 useQuery를 호출하면 네트워크 요청은 몇 번? (deduplication)
3. React Query를 'data synchronization tool'이라고 부르는 이유는? (server state 철학)
4. React Query 이전 frontend 데이터 페칭 두 가지 접근은? (옛 안티패턴)
5. React Query가 사용하는 캐싱 메커니즘은? (Stale While Revalidate)
6. React Query는 어떤 시점에 refetch를 트리거하는가? (Smart refetches)
7. staleTime 디폴트는 얼마이며 결과는?
8. fetch 빈도가 거슬릴 때 흔한 우회 방법과 평가는?
9. lazy mount + "fetch 줄이기 + background refetch 살리기" 동시 달성?
10. Query Key별 디폴트 다르게 설정하기? (setQueryDefaults)
11. (시나리오) 디폴트 fetch 빈도 거슬려 우회하는 시도에 대한 저자의 평가와 정공법은? (Takeaways 통째로)

각 톱레벨 아래 꼬리질문 0~2개씩 매달려 있음.

### `separation-of-concerns.md`

- 단일 Q&A: "모든 layer 컴포넌트에서 hooks(useContext/useQuery/useSelector 등)를 직접 호출하면 책임 분리가 깨지는가?"
- AI Annotation에 `tradeoffs` / `no free lunch` 풀이, 응집도/결합도와의 연결, 면접 활용 팁 풍부.

## 미처리 / 별도 처리 필요

### 분할 미처리

- `as-state-manager.md`가 **582줄** — 400줄 분할 기준 초과.
- AI 임의 분할 안 함 (KA 규칙).
- **권장 분할 후보**:
  - `as-state-manager.md` — 정의 + deduplication + sync tool (Q1~Q4)
  - `caching-and-refetch.md` — SWR + Smart refetches + staleTime + setQueryDefaults (Q5~Q10)
  - `before-react-query.md` 또는 `letting-it-do-magic.md` — 옛 안티패턴 + 디폴트 거슬릴 때 (Q11)
- 별도 세션에서 처리 권장.

### 이번 작업 외 git 상태 (커밋 안 함)

CLAUDE.md "내 작업 외 변경은 커밋하지 않는다" 규칙으로 손대지 않음. 사용자가 별도 확인 필요.

- `modified`: `https.md`, `rest-api.md`, `cache-memory.md`, `critical-rendering-path.md`, `layers-segments.md`, `managing-state.md`, `concurrent-react.md`, `generic-vs-unknown.md`
- `untracked`: `apply_empty.py`, `scan_empty.py`, `scan_markers.py`

### Q1 스킵 처리됨

- article 마지막 단락 "A note on separation of concerns"의 옛 패턴 회상 질문(`smart-vs-dumb` / `container-vs-presentational`).
- 옵션으로 제안했으나 사용자가 OFF 명시했고 별도 답 없음 → 스킵.
- 학습 가치: hooks 시대에 직접 마주칠 일 거의 없음, 시니어 면접에서 가끔 회상 질문으로 등장. 필요 시 별도 세션에서 추가 가능.

## 세션 중 시행착오 / 핵심 대화

다음 세션 / 다른 학습자 / 미래의 AI가 같은 실수를 반복하지 않도록 기록.

### 1. 질문 위계 구조 일관성

- 첫 단락 5 Q&A 승인 단계에서 사용자가 "톱레벨 + 꼬리질문" 위계를 확립.
- 이후 단락도 같은 위계로 자발 구성하는 게 자연스럽다 (digest 스킬에 명시된 규칙).
- 매 단락 위계 일관성 유지에 대체로 성공했으나, 한 번씩 flat 5+로 돌아가려는 충동이 있어 의식적으로 톱레벨 + 꼬리로 묶음.

### 2. OA 짜깁기 vs 원문 보존 충돌 — 옵션 A 채택

**상황**: "Letting React Query do its magic" 단락의 우회 시도 3가지 — props / Context / refetch flag 끄기 — 가 article에서 **한 문장 안에 or로 묶여** 있음.

사용자가 "(2) Context 시나리오는 학습에서 빼"라고 요청.

**문제**: OA에서 (2)만 빼면 단어 단위 짜깁기 → "원문 합성 금지" 위반.

**옵션 A 채택**: OA는 3개 우회 그대로 인용 (원문 무결성 보존), 질문 본문 / 해설 / Annotation에서만 Context를 빼고 props + 플래그 끄기 2개에 집중.

**규칙**: OA 무결성은 review/explain 인용 신뢰의 기반이므로 짜깁기 금지가 우선. "학습에서 빼고 싶다"는 의도는 질문·해설 레벨에서 달성.

### 3. 리스트 암기 금지 위반 (Takeaways 단락)

**최초 시도**: "React Query를 효과적으로 쓰기 위한 저자의 핵심 권장은?"

**사용자 지적**: "Q3 질문 뭐야 ㅠㅠ 내가 핵심권장이 뭐지 라는걸 외워야되? /digest 스킬 개판이네 진짜"

**원인**: 답이 3가지 권장사항 리스트 → 사용자에게 키워드 목록 외우기를 강요. digest 스킬의 "리스트 암기 금지" 규칙 명시 위반.

**잘못된 자기 합리화**: "Takeaways는 한 단락이라 단일 질문이 자연스럽다"고 합리화하면서 규칙 우회.

### 4. "let it"은 면접 자연어 아님 (Takeaways 두 번째 시도)

**두 번째 시도**: 'if you let it'을 키워드로 박은 질문 — "여기서 'let it'한다는 게 무슨 의미인가?"

**사용자 지적**: "let it? 뭐? 시발? 면접관이 let it 하겠어?"

**원인**: `if you let it`은 article 저자(TkDodo)의 캐주얼한 영어 표현이지 면접관이 쓸 일반화된 기술 용어가 아니다. 키워드를 박는 데만 집중하고 "그 키워드가 면접 질문으로 자연스러운지" 검증 안 함.

**최종 채택**: 시나리오 기반 — "디폴트 fetch 빈도가 거슬려 refetch flag를 끄거나 server data를 별도 state manager에 보관하는 식으로 우회하려는 시도에 대해, 저자는 어떻게 평가하며 정공법으로 무엇을 권하는가?"
- 시나리오 진입 → 평가/권장 묻기 → 면접관이 흔히 던지는 형태
- article 저자 표현 ("let it") 일반 기술 용어로 대체

**규칙 추가 제안 (writing-guide / digest 스킬에 반영 가능)**:
- 질문에 박는 키워드는 **면접관이 쓸 법한 일반 기술 용어**여야 한다.
- article 저자의 캐주얼한 표현 (slang, idiom)은 OA에는 보존하되 질문 텍스트에는 박지 않는다.

### 5. 위치 잘못 (SoC를 react-query 폴더에 둠)

**처음**: SOC 우려 답변(tradeoff/no-free-lunch)을 react-query 영역의 톱레벨 질문으로 둘 뻔함.

**사용자 지적**: "이건 여기 있으면 안될거 같은데. code-quality, 응집도/결합도 그쪽에 있어야할거같아."

**시정**: `cs/software-engineering/principles/separation-of-concerns.md` 새 파일로 분리. 응집도/결합도(`cohesion.md`/`coupling.md`)와 같은 폴더.

**규칙**: 학습 내용이 article 출처 도메인(react-query)에 한정되지 않는 일반 원칙(CS, 소프트웨어 공학)이면 도메인이 아닌 원칙 영역에 둔다.

### 6. 사용자가 모르는 영어 관용어는 즉시 풀이

**사용자 질문**: "tradeoff가 정확히 뭔지 모르고 free lunch가 뭔소린지 몰라"

**대응**: 해당 용어들의 어원/의미/JS-React 예시/면접 활용 팁을 풍부하게 풀이. 그리고 `separation-of-concerns.md`의 Key Terms와 AI Annotation에도 같은 풀이 포함.

**교훈**: 면접관이 자주 쓰는 관용어 (`tradeoff`, `no free lunch`, `boilerplate`, `coupling`, `cohesion` 등)는 사용자가 모를 수 있다. Key Terms로 반드시 정의를 박아두고, 본문 해설에서도 가볍게라도 풀어준다.

### 7. fresh / stale 흐름 다이어그램 풀이

**사용자 질문**: "staleTime이 fresh인 게 뭔지 모르겠어"

**대응**: ASCII 흐름도로 풀이.

```
fetch 성공
    ↓
[fresh] ← 캐시 데이터가 "최신으로 신뢰되는" 상태
   │  같은 키 호출 → 캐시에서만 응답 (네트워크 0번)
   ↓ staleTime 만료
[stale] ← 캐시 데이터가 "더 이상 최신 보장 없음" 상태
   │  트리거 시 캐시 즉시 + background refetch (SWR)
   ↓ refetch 성공
[fresh] (다시 카운트다운)
```

해당 흐름도는 `as-state-manager.md`의 톱레벨 staleTime 질문 AI Annotation에도 동일하게 박아둠.

## 다음 세션 권장 액션

- [ ] `as-state-manager.md` 582줄 분할 (위 권장 후보 참고)
- [ ] 사용자 외 변경 8개 파일 + Python 스크립트 3개 별도 처리
- [ ] (선택) Q1 (smart-vs-dumb 회상 질문) 시니어 면접 대비로 추가할지 결정

## 디스커션

- 모델: Claude Opus 4.7 (1M context)
- 컨텍스트 사용: 약 200k / 1M (20%) — 같은 article 추가 학습 여유 충분
- 사용자 톤: 후반 화남 (Q3 시행착오 단계). 정확한 지적이었고, 즉시 시정 + 규칙 위반 인정으로 진정.
