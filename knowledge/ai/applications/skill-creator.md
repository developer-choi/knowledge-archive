---
tags: [ai, concept]
---
# Questions
- 스킬 작성자는 모델 업데이트 후 호환성, 트리거 정확도, 편집 후 품질 변화를 체계적으로 측정할 수 없었다. skill-creator는 이를 어떻게 해결하는가?
- 스킬에는 두 가지 범주가 있다: 베이스 모델이 못 하는 것을 가능하게 하는 것과, 이미 할 수 있는 것을 순서대로 엮는 것. 모델이 발전하면 어느 쪽이 먼저 불필요해지며, 왜 그런가?
- 여러 프롬프트 테스트를 순차적으로 실행할 때, 앞 테스트의 컨텍스트가 뒤 테스트로 묻어날 수 있다. 이 문제는 어떻게 해결할 수 있는가?
- 스킬 수가 늘어나면서 왜 description 정밀도가 중요해지는가? 어떤 구체적 문제가 발생하는가?
- 현재 스킬은 작업을 수행하는 "방법(how)"을 상세히 기술한다. 모델 역량이 계속 향상된다면 스킬의 역할은 어떻게 바뀔 수 있는가?

---

# Answers

## 스킬 작성자는 모델 업데이트 후 호환성, 트리거 정확도, 편집 후 품질 변화를 체계적으로 측정할 수 없었다. skill-creator는 이를 어떻게 해결하는가?
### Official Answer
We are bringing some of the rigor of software development (testing, benchmarking, iterative improvement) to skill authoring without requiring anyone to write code.
Testing turns a skill that seems to work into one you know works.

> AI Annotation: 소프트웨어 개발의 엄밀함(테스트, 벤치마크, 반복 개선)을 코드 없이 스킬 작성에 적용했다.
> "되는 것 같은" 스킬을 "된다고 확인된" 스킬로 바꿔주는 것이 핵심.

### Reference
- https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills

---

## 스킬에는 두 가지 범주가 있다: 베이스 모델이 못 하는 것을 가능하게 하는 것과, 이미 할 수 있는 것을 순서대로 엮는 것. 모델이 발전하면 어느 쪽이 먼저 불필요해지며, 왜 그런가?
### Official Answer
Capability uplift skills help Claude do something the base model either can't do or can't do consistently.
Encoded preference skills document workflows where Claude can already do each piece, but the skill sequences them according to your team's process.
Capability uplift skills may become less necessary as models improve.
Encoded preference skills are more durable, but only as valuable as their fidelity to your actual workflow.

> AI Annotation: capability uplift은 모델이 못 하는 걸 가능하게 하는 스킬, encoded preference는 이미 가능한 걸 팀 프로세스에 맞게 엮는 스킬.
> 모델이 좋아지면 capability uplift이 먼저 불필요해진다. encoded preference는 워크플로우가 안 바뀌는 한 유지된다.

### Reference
- https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills

---

## 여러 프롬프트 테스트를 순차적으로 실행할 때, 앞 테스트의 컨텍스트가 뒤 테스트로 묻어날 수 있다. 이 문제는 어떻게 해결할 수 있는가?
### Official Answer
Accumulating context can bleed between test runs.
Skill-creator now spins up independent agents to run evals in parallel — each in a clean context with its own token and timing metrics.

> AI Annotation: 순차 실행 시 앞 테스트의 컨텍스트가 뒤 테스트에 묻어난다.
> 독립 에이전트를 병렬로 띄워 각각 깨끗한 컨텍스트에서 실행해서 해결.

### Reference
- https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills

---

## 스킬 수가 늘어나면서 왜 description 정밀도가 중요해지는가? 어떤 구체적 문제가 발생하는가?
### Official Answer
As your skill count grows, description precision becomes critical: too broad and you get false triggers, too narrow and it never fires.

> AI Annotation: description이 너무 넓으면 엉뚱한 상황에서 트리거(false positive), 너무 좁으면 필요한 상황에서 안 트리거(false negative).

### Reference
- https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills

---

## 현재 스킬은 작업을 수행하는 "방법(how)"을 상세히 기술한다. 모델 역량이 계속 향상된다면 스킬의 역할은 어떻게 바뀔 수 있는가?
### Official Answer
Today, a SKILL.md file is essentially an implementation plan, providing detailed instructions telling Claude how to do something.
Over time, a natural-language description of what the skill should do may be enough, with the model figuring out the rest.
Evals already describe the "what."
Eventually, that description may be the skill itself.

> AI Annotation: 현재 스킬은 "어떻게(how)"를 상세히 지시한다. 모델이 좋아지면 "무엇을(what)"만 기술해도 충분해질 것이다.
> eval이 이미 "what"을 기술하고 있으므로, 결국 eval이 스킬 자체가 될 수 있다.

### Reference
- https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills
