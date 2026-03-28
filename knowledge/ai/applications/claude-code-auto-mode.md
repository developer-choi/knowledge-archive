---
tags: [ai, concept]
---
# Questions
- [Claude Code의 auto mode는 기존 권한 모드들 사이에서 어떤 문제를 해결하기 위해 도입되었는가?](#claude-code의-auto-mode는-기존-권한-모드들-사이에서-어떤-문제를-해결하기-위해-도입되었는가)
  - [Auto mode에서 위험한 tool call이 차단되면 어떤 일이 일어나는가?](#auto-mode에서-위험한-tool-call이-차단되면-어떤-일이-일어나는가)

---

# Answers

## Claude Code의 auto mode는 기존 권한 모드들 사이에서 어떤 문제를 해결하기 위해 도입되었는가?

### Official Answer
Auto mode provides a safer long-running alternative to --dangerously-skip-permissions.

Claude Code's default permissions are purposefully conservative: every file write and bash command asks for approval.
It's a safe default, but it means you can't kick off a large task and walk away, since Claude will request frequent human approvals along the way.
While some developers choose to bypass permission checks with --dangerously-skip-permissions, skipping permissions can result in dangerous and destructive outcomes and should not be used outside of isolated environments.

Auto mode is a middle path that lets you run longer tasks with fewer interruptions while introducing less risk than skipping all permissions.

> AI Annotation: 세 가지 모드의 스펙트럼 — 기본 모드(매번 승인, 안전하지만 번거로움) / Auto mode(분류기가 판단, 중간 지점) / --dangerously-skip-permissions(전부 허용, 편하지만 위험)

### Reference
- https://claude.com/blog/auto-mode

---

## Auto mode에서 위험한 tool call이 차단되면 어떤 일이 일어나는가?

### Official Answer
Before each tool call runs, a classifier reviews it to check for potentially destructive actions like mass deleting files, sensitive data exfiltration, or malicious code execution.

Actions that the classifier deems as safe proceed automatically, and risky ones get blocked, redirecting Claude to take a different approach.
If Claude insists on taking actions that are continually blocked, it will eventually trigger a permission prompt to the user.

> AI Annotation: 3단계 안전장치 구조 — 분류기가 차단 → Claude가 우회 시도 → 반복 차단 시 사용자에게 권한 요청

### Reference
- https://claude.com/blog/auto-mode
