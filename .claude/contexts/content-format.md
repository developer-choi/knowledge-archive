# 내용 작성 규칙

문서의 각 섹션을 작성할 때 지켜야 하는 형식 및 내용 규칙입니다.

---

## 0. 기본 원칙

- **Fact-First**: 객관적 사실만 Official Answer에 기록. 해석·보충은 `> OO Annotation:`으로 구분. (Official / AI / User)
- **원문 보존**: 공식 문서 원문의 핵심 내용을 그대로 보존. 문장 간 연결이 어색하더라도 AI가 임의로 가공하지 않는다.
- **영어 사용 범위**: 문서 내 영어는 공식 문서 원문(Official Answer, Official Annotation)에만 사용한다. 그 외 편집·주석 성격의 내용(Questions, AI Annotation, Review Note, Frequent Mistakes 등)은 한글로 작성한다.
- **출처 없으면 작업 중단**: 출처가 제공되지 않으면, 내용 작성 전에 출처 링크를 요청하고 대기한다.

---

## 1. Frontmatter (tags)

### 참고 자료
- [공식 태그 목록](tags.md)

### 작성 규칙
-[공식 태그 목록](tags.md)에서 선택
-최소 1개, 최대 4개 선택
-우선순위: 기술명 > 카테고리 > 특성

예시:
```markdown
---
tags: [react, performance, concept]
---
```

### 새 태그 추가
- 기존 태그 목록에 적합한 태그가 없는 경우, `tags.md`에 먼저 추가 제안
- 비슷한 뜻을 가진 새로운 태그가 생기지 않도록 주의 (예: `error-handling` 대신 `troubleshooting` 사용)

---

## 2. Questions 섹션

### 질문 생성
질문이 명시되지 않았다면, **면접 질문 형태**로 생성합니다.

#### 절대 원칙
- 질문은 반드시 **답변 섹션(Official Answer, AI Answer, User Answer)의 내용으로 답할 수 있어야** 한다.
- Official Answer가 확보 가능하면 반드시 포함한다. 아직 공식 출처를 찾지 못한 경우 AI/User Answer만으로 구성할 수 있다.

#### 답변 분할
- 하나의 Official Answer가 여러 독립된 내용을 포함하면, 내용 덩어리별로 질문을 분리한다.
- 하나의 어색한 질문보다 여러 개의 자연스러운 질문이 낫다.

#### 질문 유형 (우선순위)
1. **오개념 타파(Trick Questions)**: Official Answer가 흔한 오해를 반박하는 내용을 포함할 때만 가능. 답변이 뒷받침하지 않는 오개념 질문을 억지로 만들지 않는다.
   - 예: "useEffect는 항상 paint 이후에 실행되는가?" (Official Answer에 "No"에 해당하는 근거가 있을 때)
2. **일반 질문**: Official Answer가 서술형 설명인 경우 그에 맞는 질문을 생성한다.
   - 예: "tooltip 같은 DOM 요소를 측정할 때 useLayoutEffect가 필요한 이유는?"

### 계층 구조
자세한 내용은 [문서 구조 규칙](document-structure.md)을 참고하세요.

---

## 3. Answer 섹션

세 가지 Answer 유형이 있다. 모든 유형이 필수는 아니며, 해당하는 것만 작성한다.

| 섹션 | 출처 | 용도 |
|---|---|---|
| `### Official Answer` | 공식 문서 | 검증된 사실. 확보 가능하면 반드시 포함 |
| `### AI Answer` | AI 생성 | 공식 출처를 아직 찾지 못한 경우의 답변 |
| `### User Answer` | 사용자 작성 | 사용자의 해석, 경험 기반 답변 |

### 작성 원칙
- **원문 보존**: 공식 문서 원문은 절대 수정하지 않는다.
- **원본 언어 유지 (번역 금지)**: 사용자가 작성한 필기나 요약이 한글이면 한글로 유지한다.
  - 허용 편집: 맞춤법, 조사, 문장 흐름, 전문 용어 정확화
  - **명백한 사실 오류 정정은 필수**: 위키피디아 수준의 확립된 지식(표준 수치·프로토콜 헤더 필드·레지스터 정의 등)과 충돌하거나 같은 섹션 내 자기모순이 있으면 `User Answer`/`User Annotation`/`AI Annotation`에 한해 정정한다. **`Official Answer`는 예외 없이 수정 금지**.
  - 금지: 소스에 없는 새 사실 덧붙이기, 뉘앙스 변경, 근거 없는 주장
- **출처 명확성**: Official Answer는 반드시 Reference에 출처를 명시.

### Key Terms

Official Answer 원문에서 복습 시 꼬리질문할 가치가 있는 영단어를 선별하여 정의를 붙인다.

| 항목 | 규칙 |
|---|---|
| 위치 | Official Answer 바로 아래, Annotation 위 |
| 형식 | `> #### Key Terms:` 블록쿼트 |
| 키워드 출처 | **반드시 Official Answer 원문에 등장하는 영단어**만 사용 |
| 정의 | 이 Q&A 문맥에서 막히지 않을 최소 정의 (한 줄 한국어). 별도 Q&A가 있어도 여기선 정의 수준만. |
| 작성 시점 | digest 시 AI가 제안, review 시 사용자가 제안 |

```markdown
### Official Answer
In computing, a process is the instance of a computer program that is being executed by one or many threads.

> #### Key Terms:
> - **instance**: 클래스(설계도)로부터 만들어진 실체

> #### AI Annotation:
> ...
```

### Annotation

Answer 내부에 짧은 보충 설명을 추가할 때 `>` 블록쿼트 + `#### 헤딩`을 사용한다.

- Annotation은 Answer(Official/AI/User)의 보충이다. Answer 없이 Annotation만 단독으로 존재하면, 해당 Annotation은 Answer로 승격시킨다.

| Annotation 유형 | 형식 | 출처 | 용도 |
|---|---|---|---|
| Official Annotation | `> #### Official Annotation:` | 공식 문서 | Official Answer를 보충하는 공식 문서 원문. 같은 출처 또는 다른 공식 출처에서 가져온 부연 설명 |
| AI Annotation | `> #### AI Annotation:` | AI 생성 | AI가 추가한 해설, 비유, 코드 예시 등 |
| User Annotation | `> #### User Annotation:` | 사용자 작성 | 사용자의 메모, 경험 기반 보충 |

```markdown
### Official Answer
A network is a group of communicating computers...

> #### Official Annotation:
> The CSSStyleDeclaration interface is the base class for...

> #### AI Annotation:
> 네트워크의 3요소는 Node, Link, Protocol입니다.

> #### User Annotation:
> Protocol이 HTTPS 같은거 말하는거임
```

---

## 4. Reference

### 작성 규칙
- 공식 문서 URL 또는 위키피디아 링크 제공
- 링크 형식: 순수 URL만 기재 (Markdown 링크 문법 사용 X)

예시:
```markdown
### Reference
- https://feature-sliced.design/docs/get-started/overview
- https://developer.mozilla.org/en-US/docs/Web/JavaScript
```

### URL 불명확 시

| 상황 | 처리 |
|------|------|
| 출처는 아는데 URL 모름 | `- 출처 설명 (URL_UNKNOWN)` |
| 출처 자체를 모름 | 해당 질문·답변을 삭제 |

예시:
```markdown
- 토스 딥 리서치 결과물 (URL_UNKNOWN)
```

---

## 5. Review Note / Frequent Mistakes

Answer 하위에 추가할 수 있는 선택적 섹션이다.

| 섹션 | 용도 |
|---|---|
| `### Review Note` | 복습·평가 시 참고사항 (중요하지 않은 부분, 집중할 부분 등) |
| `### Frequent Mistakes` | 복습 시 자주 혼동한 키워드나 오개념 기록 |

- 두 섹션 모두 선택 사항이며, 해당하는 경우에만 작성한다.
- Answer 내 위치: Reference 바로 위에 배치한다.

---

## 6. 문장 단위 줄바꿈 (Semantic Line Breaks)

### 원칙
- 한 문장이 끝날 때마다 줄바꿈한다.
- 문장이 길어지더라도 온점(`.`)이나 물음표(`?`)로 문장이 종료되면 줄을 바꾼다.

### 이유
Git 등 버전 관리 시스템에서 Diff(변경 내역)를 문장 단위로 깔끔하게 확인하기 위함입니다.

### 예시

❌ 잘못된 예:
```markdown
A network is a group of communicating computers. The network allows computers to share resources and information. Networks can be classified by their size and scope.
```

✅ 올바른 예:
```markdown
A network is a group of communicating computers.
The network allows computers to share resources and information.
Networks can be classified by their size and scope.
```

---

## 7. 이미지 처리

### Case 1: AI 답변 캡처
Official Answer 섹션 내부에 인용 블록으로 추가:
```markdown
### Official Answer
[공식 문서 원문]

> AI Annotation: [AI 캡처 이미지 내 텍스트를 여기에 옮김]
```

### Case 2: 공식 문서 캡처 (다이어그램, 표)
- 이미지가 핵심 정보를 담고 있으면 텍스트로 변환
- 다이어그램은 구조를 텍스트로 설명

### Case 3: 외부 이미지
- 저작권 주의 (예: Getty Images)
- 가능하면 텍스트 설명으로 대체
- 원본 이미지 출처를 Reference에 명시