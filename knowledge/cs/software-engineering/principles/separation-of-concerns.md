---
tags: [software-engineering, architecture, principle]
source: unverified
priority:
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

### Review Note
- OA가 7문장으로 길다. 분할 후보 — 본 질문(tradeoff 평가) + 별도 질문(Button/Dashboard 안티패턴)으로 쪼갤 수 있다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager
