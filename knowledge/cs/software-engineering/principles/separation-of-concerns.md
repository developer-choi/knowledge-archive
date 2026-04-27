---
tags: [software-engineering, architecture, principle]
---
# Questions
- 모든 layer 컴포넌트에서 hooks(useContext/useQuery/useSelector 등)를 직접 호출하면 책임 분리가 깨지는가?

---

# Answers

## 모든 layer 컴포넌트에서 hooks(useContext/useQuery/useSelector 등)를 직접 호출하면 책임 분리가 깨지는가?

### Official Answer
In summary, it's all tradeoffs.
There is no free lunch.
What might work in one situation might not work in others.
Should a reusable Button component do data fetching?
Probably not.
Does it make sense to split your Dashboard into a DashboardView and a DashboardContainer that passes data down?
Also, probably not.
So it's on us to know the tradeoffs and apply the right tool for the right job.

> #### Key Terms:
> - **tradeoffs**: X를 얻으려면 Y를 포기해야 하는 맞바꿈 관계
> - **no free lunch**: 모든 면에서 좋기만 한 선택은 없다 — tradeoff가 어디에나 존재한다는 강한 일반화
> - **Button component do data fetching**: 재사용 Button이 fetch까지 하는 안티패턴. Button이 특정 데이터에 묶이면 재사용성이 망가짐
> - **DashboardView and DashboardContainer that passes data down**: 옛 smart-vs-dumb 패턴을 hooks 시대에도 강제 적용 — 이미 hook 직접 호출로 풀리는데 임의 분할
> - **right tool for the right job**: 상황에 맞는 도구. 단일 규칙으로 환원 불가

> #### AI Annotation:
> **우려의 출발점 (책임 혼합 관점)**:
> 전통적 SoC 시각에서는 한 컴포넌트가 "그리기"와 "데이터 가져오기" 두 책임을 동시에 지면 응집도가 낮아진다고 본다.
> leaf 컴포넌트(`<TodoItem>` 같은 작은 단위)에 `useQuery`를 박으면 그 컴포넌트가 UI + 데이터 출처에 동시에 묶여 SRP를 깨는 듯 보임.
>
> **하지만 hooks 등장 후 같은 사실이 두 해석 모두 가능**:
> - "더 결합됨 (more coupled)": 컴포넌트가 특정 데이터 출처(QueryClient/Context/Redux store)에 직접 의존
> - "더 독립적 (more independent)": 트리 어디 둬도 알아서 동작 — 부모가 props로 내려줄 필요 없음
>
> 어느 쪽이 맞다고 단정할 수 없으므로 결론은 **tradeoffs**.
>
> **두 구체 안티패턴**:
> - 재사용 `Button`이 `useQuery` 호출? **No** — Button은 어떤 데이터든 받아 쓸 수 있어야 재사용 가치가 있는데, 특정 쿼리에 묶이면 그 가치가 사라진다
> - `Dashboard`를 `DashboardView` + `DashboardContainer`로 분할? **No** — 이미 hook 직접 호출로 깔끔히 풀리는데 옛 패턴(smart-vs-dumb)을 강제하는 임의 분할일 뿐. 두 파일/두 export 보일러플레이트만 늘어남.
>
> **실무 판단 기준**:
> - 데이터에 묶이는 게 컴포넌트의 본래 책임에 부합하는가? (예: `<TodoList>`가 todos를 가져오는 것 — 자연스러움)
> - 재사용성이 핵심 가치인가? (예: `<Button>`, `<Input>` — 데이터에 묶이면 재사용 망가짐)
> - 분할이 도메인 경계를 따르는가? 패턴 강요인가?
>
> **응집도/결합도와의 연결**:
> SoC를 응집도(cohesion) 높이기로 보면, hooks 직접 호출은 컴포넌트 책임을 한 곳에 묶어 오히려 응집도를 높이는 측면도 있다 — UI와 그 UI에 필요한 데이터를 한 단위로 캡슐화.
> 결합도(coupling) 관점에서는 특정 store/Provider에 의존이 늘지만, props로 받는 경우도 부모의 props 형태에 의존하긴 마찬가지 — 단지 의존 방향만 다름.
>
> **`tradeoffs` / `no free lunch` 면접 활용**:
> - 시니어가 "이 결정의 tradeoff가 뭐예요?"라고 거의 매번 묻는다 — 답할 때 "X를 얻기 위해 Y를 포기했습니다" 형태로 말하면 됨
> - "X가 항상 정답인가요?"에 대한 답: "No free lunch입니다. use-case에 따라 다릅니다"
> - 단일 규칙으로 환원하는 답("X가 무조건 맞아요")은 시니어가 깊이를 의심하게 만든다

### Review Note
- OA가 7문장으로 길다. 분할 후보 — 본 질문(tradeoff 평가) + 별도 질문(Button/Dashboard 안티패턴)으로 쪼갤 수 있다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager
