---
tags: [ai, concept, comparison]
---
# Questions
- [Claude Code에서 subagent와 agent team의 근본적인 차이는 무엇인가?](#claude-code에서-subagent와-agent-team의-근본적인-차이는-무엇인가)
- [Agent team이 단일 세션보다 비효율적인 상황은 언제인가?](#agent-team이-단일-세션보다-비효율적인-상황은-언제인가)

---

# Answers

## Claude Code에서 subagent와 agent team의 근본적인 차이는 무엇인가?

### Official Answer
Agent teams let you coordinate multiple Claude Code instances working together.
One session acts as the team lead, coordinating work, assigning tasks, and synthesizing results.
Teammates work independently, each in its own context window, and communicate directly with each other.

Unlike subagents, which run within a single session and can only report back to the main agent, you can also interact with individual teammates directly without going through the lead.

> #### AI Annotation:
> subagent는 메인 에이전트 안에서 실행되어 결과만 보고하는 "일꾼" 구조인 반면, agent team의 teammate는 독립된 세션으로 서로 직접 소통하고 사용자도 개별 teammate에 직접 개입할 수 있다.
> subagent가 "비서에게 심부름 시키기"라면, agent team은 "팀원들과 회의하기"에 가깝다.

### Reference
- https://code.claude.com/docs/en/agent-teams

---

## Agent team이 단일 세션보다 비효율적인 상황은 언제인가?

### Official Answer
Agent teams add coordination overhead and use significantly more tokens than a single session.
They work best when teammates can operate independently.
For sequential tasks, same-file edits, or work with many dependencies, a single session or subagents are more effective.

> #### AI Annotation:
> 병렬로 독립 작업할 수 있을 때만 이점이 있다.
> 순차적 작업, 같은 파일 수정, 의존성이 많은 작업에서는 coordination overhead만 늘어나고 토큰 비용도 크게 증가한다.

### Reference
- https://code.claude.com/docs/en/agent-teams
