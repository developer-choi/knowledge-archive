---
tags: [ai, best-practice]
---
# Questions
- Claude가 이미 아는 일반 코딩 지식을 스킬에 적으면 어떤 문제가 생기며, 스킬에는 어떤 정보를 담아야 하는가?
- Gotchas 섹션이란 무엇이며, 어떻게 구축되고, 왜 스킬에서 가장 가치 있는 부분인가?
- 스킬 작성에서 "Avoid Railroading"은 무엇을 의미하며, 왜 중요한가?
- 스킬이 사용자별 설정(채널명, 자격증명 등)을 필요로 할 때 권장되는 패턴은?

---

# Answers

## Claude가 이미 아는 일반 코딩 지식을 스킬에 적으면 어떤 문제가 생기며, 스킬에는 어떤 정보를 담아야 하는가?
### Official Answer
Claude Code knows a lot about your codebase, and Claude knows a lot about coding, including many default opinions.
If you're publishing a skill that is primarily about knowledge, try to focus on information that pushes Claude out of its normal way of thinking.

> AI Annotation: Claude가 이미 아는 일반 코딩 지식을 스킬에 적으면 토큰만 낭비된다.
> 스킬에는 Claude의 기본 사고방식에서 벗어나게 하는 조직 특화 정보를 담아야 한다.

### Reference
- https://www.linkedin.com/pulse/lessons-from-building-claude-code-how-we-use-skills-thariq-shihipar-iclmc/

---

## Gotchas 섹션이란 무엇이며, 어떻게 구축되고, 왜 스킬에서 가장 가치 있는 부분인가?
### Official Answer
The highest-signal content in any skill is the Gotchas section.
These sections should be built up from common failure points that Claude runs into when using your skill.
Ideally, you will update your skill over time to capture these gotchas.

> AI Annotation: gotchas = Claude가 스킬 사용 시 반복적으로 실패하는 지점 모음.
> 처음부터 완벽하게 쓰는 게 아니라, 시간이 지나면서 축적하는 것이다.
> 스킬에서 가장 높은 시그널(highest-signal)을 가진 부분.

### Reference
- https://www.linkedin.com/pulse/lessons-from-building-claude-code-how-we-use-skills-thariq-shihipar-iclmc/

---

## 스킬 작성에서 "Avoid Railroading"은 무엇을 의미하며, 왜 중요한가?
### Official Answer
Claude will generally try to stick to your instructions, and because Skills are so reusable you'll want to be careful of being too specific in your instructions.
Give Claude the information it needs, but give it the flexibility to adapt to the situation.

> AI Annotation: 지시를 너무 구체적으로 적으면 Claude의 상황 적응력이 떨어진다.
> 스킬은 재사용되므로 다양한 상황에 적응할 수 있도록 유연성을 남겨야 한다.

### Reference
- https://www.linkedin.com/pulse/lessons-from-building-claude-code-how-we-use-skills-thariq-shihipar-iclmc/

---

## 스킬이 사용자별 설정(채널명, 자격증명 등)을 필요로 할 때 권장되는 패턴은?
### Official Answer
A good pattern to do this is to store this setup information in a config.json file in the skill directory.
If the config is not set up, the agent can then ask the user for information.

> AI Annotation: 사용자별 설정은 스킬 디렉토리의 config.json에 저장.
> 설정이 없으면 에이전트가 사용자에게 물어보는 패턴.

### Reference
- https://www.linkedin.com/pulse/lessons-from-building-claude-code-how-we-use-skills-thariq-shihipar-iclmc/
