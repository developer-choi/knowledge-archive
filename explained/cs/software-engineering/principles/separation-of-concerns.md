# 모든 layer 컴포넌트에서 hooks(useContext/useQuery/useSelector 등)를 직접 호출하면 책임 분리가 깨지는가?

## 도입

전통적인 SoC(Separation of Concerns) 시각에서는 컴포넌트가 "그리기"와 "데이터 가져오기"를 동시에 하면 책임이 섞인다고 본다. 그러나 hooks 등장 이후 같은 사실을 두 가지 방식으로 해석할 수 있게 되었다. OA의 결론은 단정이 아니라 "tradeoffs"다.

---

## 본문

> In summary, it's all tradeoffs. There is no free lunch.

"요약하면, 모든 것은 트레이드오프다. 공짜 점심은 없다."

- **tradeoffs**: X를 얻으려면 Y를 포기해야 하는 맞바꿈 관계. "이 방식이 항상 옳다"는 답은 존재하지 않는다.
- **no free lunch**: 모든 면에서 좋기만 한 선택은 없다. 특정 아키텍처를 선택하면 그에 따른 비용이 항상 따라온다.

> What might work in one situation might not work in others.

"한 상황에서 작동하는 것이 다른 상황에서는 작동하지 않을 수 있다."

hooks 직접 호출도 마찬가지다. `<TodoList>`에서 `useQuery`를 직접 호출하는 건 자연스럽지만, `<Button>`에서 특정 쿼리를 호출하면 재사용성이 망가진다.

> Should a reusable Button component do data fetching? Probably not.

"재사용 가능한 Button 컴포넌트가 데이터 패칭을 해야 하는가? 아마도 아닐 것이다."

- **reusable Button component**: Button은 어떤 데이터든 받아 쓸 수 있어야 재사용 가치가 있다. 특정 쿼리에 묶이면 그 쿼리가 있는 맥락에서만 쓸 수 있게 되어 재사용 가치가 사라진다.

> Does it make sense to split your Dashboard into a DashboardView and a DashboardContainer that passes data down? Also, probably not.

"Dashboard를 DashboardView와 DashboardContainer로 나눠서 데이터를 내려보내는 것이 말이 되는가? 아마도 아닐 것이다."

- **DashboardView and DashboardContainer**: hooks 이전의 smart-vs-dumb 패턴. Container가 데이터를 받아 View에 props로 내려주는 방식. hooks로 직접 데이터를 가져올 수 있는 지금, 이 분리는 보일러플레이트만 늘어난다.

> So it's on us to know the tradeoffs and apply the right tool for the right job.

"따라서 트레이드오프를 알고 상황에 맞는 도구를 적용하는 것은 우리의 몫이다."

- **right tool for the right job**: 단일 규칙으로 환원 불가능하다는 뜻이다.

```
hooks 직접 호출의 두 해석

"더 결합됨 (Coupled)"            "더 독립적 (Independent)"
  컴포넌트가 특정                  트리 어디 둬도 알아서 동작
  QueryClient/Store에 직접 의존    부모가 props로 내려줄 필요 없음

→ 어느 쪽이 맞다고 단정 불가 → tradeoffs

안티패턴 (판단이 비교적 명확한 경우)
  <Button useQuery 직접 호출>  No — 재사용성 파괴
  <Dashboard> → DashboardView + DashboardContainer  No — hooks로 이미 해결됨
```

---

## 종합

"hooks를 컴포넌트에서 직접 호출하면 SoC가 깨지는가?"에 단일 답은 없다. 컴포넌트의 본래 책임에 부합하는가, 재사용성이 핵심인가, 분리가 도메인 경계를 따르는가를 각 상황마다 판단해야 한다. 시니어가 코드리뷰에서 "이 결정의 tradeoff가 뭐예요?"라고 물을 때, "X를 얻기 위해 Y를 포기했습니다" 형태로 답할 수 있으면 충분하다. "X가 항상 정답이에요"라는 단언은 설계 경험 부족의 신호다 — 정답 대신 tradeoff를 명확히 이해하는 것이 목표다.
