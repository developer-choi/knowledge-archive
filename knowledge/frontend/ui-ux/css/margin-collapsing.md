---
tags: [styling, concept]
source: official
publishable: true
---
# Questions
- margin collapsing이란 무엇인가? 합쳐진 마진의 크기는 어떻게 정해지는가?
  - margin collapsing이 일어나는 세 가지 경우는 각각 어떤 상황인가?

---

# Answers

## margin collapsing이란 무엇인가? 합쳐진 마진의 크기는 어떻게 정해지는가?

### Official Answer
The top and bottom margins of blocks are sometimes combined (collapsed) into a single margin whose size is the largest of the individual margins (or just one of them, if they are equal), a behavior known as margin collapsing.

Collapsing margins is only relevant in the vertical direction.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_model/Margin_collapsing

## margin collapsing이 일어나는 세 가지 경우는 각각 어떤 상황인가?

### Official Answer
The margins of adjacent siblings are collapsed (except when the latter sibling needs to be cleared past floats).

The vertical margins between a parent block and its descendants can collapse. This happens when there is no separating content between them.

If there is no border, padding, inline content, height, or min-height to separate a block's margin-top from its margin-bottom, then its top and bottom margins collapse.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_model/Margin_collapsing

