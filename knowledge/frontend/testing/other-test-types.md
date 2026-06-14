---
tags: [testing, concept]
source: official
priority:
---
# Questions
- Static test란 무엇인가?
- Snapshot Testing이란 무엇이며 Unit/Integration/E2E와 어떤 관계인가?

---

# Answers

## Static test란 무엇인가?

### Official Answer
Static: Catch typos and type errors as you write the code.

In particular, static analysis tools are incapable of giving you confidence in your business logic.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests

---

## Snapshot Testing이란 무엇이며 Unit/Integration/E2E와 어떤 관계인가?

### Official Answer
Snapshot Testing involves capturing the rendered output of a component and saving it to a snapshot file.
When tests run, the current rendered output of the component is compared against the saved snapshot.
Changes in the snapshot are used to indicate unexpected changes in behavior.

### Reference
- https://nextjs.org/docs/app/guides/testing
