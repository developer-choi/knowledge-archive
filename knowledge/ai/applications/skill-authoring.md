---
tags: [ai, best-practice]
---
# Questions
- [If you write general coding knowledge that Claude already knows into a skill, what problem arises? What kind of information should a skill contain?](#dont-state-the-obvious)
- [What is a Gotchas section, how should it be built, and why is it the most valuable part of a skill?](#gotchas-section)
- [What does "Avoid Railroading" mean in skill authoring, and why is it important?](#avoid-railroading)
- [When a skill needs user-specific settings (channel name, credentials, etc.), what is the recommended pattern?](#skill-setup-pattern)

---

# Answers

## Don't State the Obvious
### Official Answer
Claude Code knows a lot about your codebase, and Claude knows a lot about coding, including many default opinions.
If you're publishing a skill that is primarily about knowledge, try to focus on information that pushes Claude out of its normal way of thinking.

> AI Annotation: Claude가 이미 아는 일반 코딩 지식을 스킬에 적으면 토큰만 낭비된다.
> 스킬에는 Claude의 기본 사고방식에서 벗어나게 하는 조직 특화 정보를 담아야 한다.

### Reference
- https://www.linkedin.com/pulse/lessons-from-building-claude-code-how-we-use-skills-thariq-shihipar-iclmc/

---

## Gotchas section
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

## Avoid Railroading
### Official Answer
Claude will generally try to stick to your instructions, and because Skills are so reusable you'll want to be careful of being too specific in your instructions.
Give Claude the information it needs, but give it the flexibility to adapt to the situation.

> AI Annotation: 지시를 너무 구체적으로 적으면 Claude의 상황 적응력이 떨어진다.
> 스킬은 재사용되므로 다양한 상황에 적응할 수 있도록 유연성을 남겨야 한다.

### Reference
- https://www.linkedin.com/pulse/lessons-from-building-claude-code-how-we-use-skills-thariq-shihipar-iclmc/

---

## Skill setup pattern
### Official Answer
A good pattern to do this is to store this setup information in a config.json file in the skill directory.
If the config is not set up, the agent can then ask the user for information.

> AI Annotation: 사용자별 설정은 스킬 디렉토리의 config.json에 저장.
> 설정이 없으면 에이전트가 사용자에게 물어보는 패턴.

### Reference
- https://www.linkedin.com/pulse/lessons-from-building-claude-code-how-we-use-skills-thariq-shihipar-iclmc/
