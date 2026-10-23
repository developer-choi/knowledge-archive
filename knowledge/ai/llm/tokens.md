---
tags: [ai, concept]
source: official
publishable: true
---
# Questions
- LLM에서 토큰(token)이란 무엇인가?
  - Claude에서 토큰 하나가 몇 글자에 해당하는지는 어떻게 알 수 있는가?

---

# Answers

## LLM에서 토큰(token)이란 무엇인가?

### Official Answer
Tokens are the smallest individual units of a language model, and can correspond to words, subwords, characters, or even bytes (in the case of Unicode).

When Claude is provided with text to evaluate, the text (consisting of a series of characters) is encoded into a series of tokens for the model to process.

### Reference
- https://platform.claude.com/docs/en/about-claude/glossary

## Claude에서 토큰 하나가 몇 글자에 해당하는지는 어떻게 알 수 있는가?

### Official Answer
For Claude, the number of characters a token represents depends on the model and the language.

To get exact counts, use token counting with the model you plan to use.

### Reference
- https://platform.claude.com/docs/en/about-claude/glossary
