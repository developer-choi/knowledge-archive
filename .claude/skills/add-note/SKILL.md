---
description: 사용자가 공부하거나 읽은 내용을 knowledge/ 문서에 Q&A 형식으로 저장한다. 사용자가 공식문서 원문, 한글 메모, 출처 URL을 제공하며 "필기해줘", "기록해둬", "정리해줘", "배운 거 추가해줘", "메모", "저장해줘" 등을 말하면 이 스킬을 사용한다. 기존 knowledge 문서의 [TODO] 빈 답변을 채우는 경우에도 사용한다. 사용자가 학습 내용을 언급하면서 출처 URL이나 영어 원문 인용이 포함되어 있다면 거의 확실히 이 스킬이 필요하다. 단, /digest나 /review 명령, PDF/구글문서 변환, 복습/면접 모드 요청은 다른 스킬이 담당한다.
argument-hint: [필기할 내용 또는 주제]
---

# 필기 추가

사용자가 제공한 학습 내용을 knowledge/ 문서에 Q&A 형식으로 기록한다.

## 작업 순서

### 1. Before

[production-guide.md](../../contexts/production-guide.md)의 **Before** 읽기.

### 2. 내용 파악

사용자가 제공한 내용에서 핵심 사실과 출처를 파악한다.

- 영어 원문이 있으면 그대로 보존하여 Official Answer로 사용
- 한글 메모는 Annotation으로 분류
- **영어 원문 없이 한글만 제공된 경우**: User Answer로 작성. AI가 영어 Official Answer를 생성하지 않는다
- 출처가 없으면 content-format.md 원칙에 따라 요청 후 대기

### 2-1. 범위 제한

사용자가 제공한 내용의 범위 내에서만 Q&A를 작성한다. 출처 URL을 방문하여 사용자가 언급하지 않은 추가 내용을 가져오지 않는다. 사용자가 "z-index는 stacking context 안에서만 동작함"이라고 했으면, 그 사실 하나만 Q&A로 만든다.

### 3. TODO 매칭

기존 knowledge/ 문서에 사용자 내용과 관련된 `[TODO]` 질문이 있는지 검색한다.

- **매칭됨**: 해당 `[TODO]` 질문의 Answer 섹션에 내용을 채우고, Questions 목록과 Answers 제목 양쪽에서 `[TODO]` 접두사를 제거
- **매칭 안 됨**: 새 Q&A를 작성 (Step 4로)

TODO 답변을 채울 때, 해당 질문에 대한 **직접적인 답**이 되는 내용을 작성한다. 같은 파일 내 다른 답변의 문장을 그대로 복사하지 않는다. 사용자가 제공한 내용이 질문에 직접 답하지 않는다면, 가장 관련성 높은 부분을 선택하여 배치한다.

### 4. Q&A 작성

[content-format.md](../../contexts/content-format.md)에 따라 Q&A를 작성한다.

### 5. After

[production-guide.md](../../contexts/production-guide.md)의 **After** 실행.

## 예시

### 예시 1: 새 Q&A 작성

**사용자 입력**: "React의 useMemo는 렌더링 사이에 계산 결과를 캐싱한다고 배웠어. 출처: https://react.dev/reference/react/useMemo"

**AI 행동**:
1. Before: content-format.md 원칙 확인
2. TODO 매칭: knowledge/ 검색 → 관련 TODO 없음
3. Q&A 작성:

```markdown
# Questions
- [What does useMemo do?](#what-does-usememo-do)

# Answers
## What does useMemo do?
### Official Answer
useMemo is a React Hook that lets you cache the result of a calculation between re-renders.

### Reference
- https://react.dev/reference/react/useMemo
```

4. After: 파일 배치, 구조 검증, 태그 확인

### 예시 2: TODO 답변 채우기

**사용자 입력**: "Host는 IP 주소를 가지고 실제로 데이터를 송수신할 수 있는 장치야. device는 스위치, 허브 같은 네트워크 장비도 포함하는 더 넓은 개념이고. 원문: 'A host is a computer or other device connected to a computer network.' 출처: https://en.wikipedia.org/wiki/Host_(network)"

**AI 행동**:
1. Before: content-format.md 원칙 확인
2. TODO 매칭: `[TODO] What is the technical difference between a simple device and a Host?` 발견 (network-basics.md)
3. 해당 질문의 Answer 채우기 + `[TODO]` 접두사 제거:

```markdown
## What is the technical difference between a simple device and a Host?
### Official Answer
A host is a computer or other device connected to a computer network.

> User Annotation: Host는 IP 주소를 가지고 실제로 데이터를 송수신할 수 있는 장치. device는 스위치, 허브 같은 네트워크 장비도 포함하는 더 넓은 개념.

### Reference
- https://en.wikipedia.org/wiki/Host_(network)
```

4. After: 구조 검증

### 예시 3: 한글만 제공된 경우

**사용자 입력**: "TCP 3-way handshake는 SYN → SYN-ACK → ACK 순서야. 출처: https://en.wikipedia.org/wiki/Handshaking"

**AI 행동**:
1. 영어 원문이 없으므로 Official Answer를 생성하지 않음
2. 한글 내용을 User Answer로 작성:

```markdown
## What is the TCP 3-way handshake?
### User Answer
TCP 3-way handshake는 SYN → SYN-ACK → ACK 순서.

### Reference
- https://en.wikipedia.org/wiki/Handshaking
```
