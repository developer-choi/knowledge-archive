---
tags: [ai, concept]
---
# Questions
- [Skill authors couldn't systematically measure compatibility after model updates, trigger accuracy, or quality changes after edits. How does skill-creator solve this?](#skill-authors-couldnt-systematically-measure)
- [There are two categories of skills: one that enables what the base model can't do, and one that sequences what it already can. As models improve, which becomes unnecessary first, and why?](#two-categories-of-skills)
- [When running multiple prompt tests sequentially, earlier test context can bleed into later tests. How can this problem be solved?](#sequential-test-context-contamination)
- [As the number of skills grows, why does description precision become critical? What specific problems arise?](#skill-description-precision)
- [Currently, skills describe "how" to perform a task in detail. If model capabilities keep improving, how might the role of skills change?](#skills-how-to-what)

---

# Answers

## Skill authors couldn't systematically measure
### Official Answer
We are bringing some of the rigor of software development (testing, benchmarking, iterative improvement) to skill authoring without requiring anyone to write code.
Testing turns a skill that seems to work into one you know works.

> AI Annotation: 소프트웨어 개발의 엄밀함(테스트, 벤치마크, 반복 개선)을 코드 없이 스킬 작성에 적용했다.
> "되는 것 같은" 스킬을 "된다고 확인된" 스킬로 바꿔주는 것이 핵심.

### Reference
- https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills

---

## Two categories of skills
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

## Sequential test context contamination
### Official Answer
Accumulating context can bleed between test runs.
Skill-creator now spins up independent agents to run evals in parallel — each in a clean context with its own token and timing metrics.

> AI Annotation: 순차 실행 시 앞 테스트의 컨텍스트가 뒤 테스트에 묻어난다.
> 독립 에이전트를 병렬로 띄워 각각 깨끗한 컨텍스트에서 실행해서 해결.

### Reference
- https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills

---

## Skill description precision
### Official Answer
As your skill count grows, description precision becomes critical: too broad and you get false triggers, too narrow and it never fires.

> AI Annotation: description이 너무 넓으면 엉뚱한 상황에서 트리거(false positive), 너무 좁으면 필요한 상황에서 안 트리거(false negative).

### Reference
- https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills

---

## Skills how to what
### Official Answer
Today, a SKILL.md file is essentially an implementation plan, providing detailed instructions telling Claude how to do something.
Over time, a natural-language description of what the skill should do may be enough, with the model figuring out the rest.
Evals already describe the "what."
Eventually, that description may be the skill itself.

> AI Annotation: 현재 스킬은 "어떻게(how)"를 상세히 지시한다. 모델이 좋아지면 "무엇을(what)"만 기술해도 충분해질 것이다.
> eval이 이미 "what"을 기술하고 있으므로, 결국 eval이 스킬 자체가 될 수 있다.

### Reference
- https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills
