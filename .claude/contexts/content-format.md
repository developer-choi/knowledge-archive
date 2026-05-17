# 내용 작성 규칙

문서의 각 섹션을 작성할 때 지켜야 하는 형식 및 내용 규칙입니다.

---

## 0. 기본 원칙

- **Fact-First**: 객관적 사실만 Official Answer에 기록. 해석·보충은 `> OO Annotation:`으로 구분. (Official / AI / User)
- **원문 보존**: 공식 문서 원문의 핵심 내용을 그대로 보존. 문장 간 연결이 어색하더라도 AI가 임의로 가공하지 않는다.
- **Official Answer 언어**: Official Answer는 공식 문서 원문을 그대로 보존한다. 공식 출처가 영어이면 영어 원문을 유지하며, 한글 번역·요약·의역으로 대체하지 않는다. 그 외 편집·주석 성격(Questions, AI Annotation, Review Note, Frequent Mistakes 등)은 한글로 작성한다.
- **출처 없으면 작업 중단**: 출처가 제공되지 않으면, 내용 작성 전에 출처 링크를 요청하고 대기한다.

---

## 1. Frontmatter

### tags

#### 참고 자료
- [공식 태그 목록](tags.md)

#### 작성 규칙
- [공식 태그 목록](tags.md)에서 선택
- 최소 1개, 최대 4개 선택
- 우선순위: 기술명 > 카테고리 > 특성

예시:
```markdown
---
tags: [react, performance, concept]
---
```

#### 새 태그 추가
- 기존 태그 목록에 적합한 태그가 없는 경우, `tags.md`에 먼저 추가 제안
- 비슷한 뜻을 가진 새로운 태그가 생기지 않도록 주의 (예: `error-handling` 대신 `troubleshooting` 사용)

---

### source

**파일이 어떤 맥락에서 만들어졌는가**를 나타낸다. Q&A 개별 출처 신뢰도가 아님 — 개별 신뢰도는 `[UNVERIFIED]` 마커와 `### Reference`가 담당한다.

| 값 | 의미 |
|----|------|
| `official` | MDN·Wikipedia 등 1차 소스를 직접 읽으면서 작성 |
| `google-doc` | `/convert`로 구글 문서에서 변환된 파일 |
| `unverified` | 출처 미추적 (유튜브·교재·개인 메모 등 기반) |

- 필수 키. 누락 시 `list-candidates` 출력에서 "출처 미상" 그룹으로 빠짐.
- 파일 안에 출처가 섞여 있어도 **파일을 만든 맥락** 기준으로 하나를 선택한다.
- **파일 분리 시 반드시 상속**: 기존 파일을 여러 파일로 분리할 때, 원본의 `source` 값을 모든 파생 파일에 복사한다. 누락의 대부분이 이 경우에서 발생한다.

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
- **빈 섹션 금지**: 채울 본문이 없는 섹션 헤딩(`### Official Answer`, `### AI Answer`, `### User Answer`, `### Reference`, `> #### Key Terms:`, Annotation 등)은 만들지 않는다. 본문이 생기는 시점에 섹션을 추가한다. 섹션 본문을 비우면 마커 정합성 검증과 마커 사용 조건 판단이 무너진다.
- **OA 단락 통합**: 같은 출처 또는 다른 공식 출처의 원문 단락 여러 개를 하나의 Official Answer 안에 단락으로 이어 붙여도 된다. 단락 사이는 빈 줄로 구분한다. 단락을 묶기 위한 추가 표현(접속사·요약 문장 등)을 AI가 임의로 만들지 않는다 — 원문을 그대로 이어 붙인다.
- **출처 표기는 Reference에만**: OA 본문(또는 H4 서브섹션 본문)에 인라인 `— URL` 표기를 두지 않는다. 모든 출처는 `### Reference` 섹션에 URL로 모은다. 다른 출처의 원문 단락을 통합할 때는 그 URL을 Reference에 추가한다.
- **OA 내부 위계화 (권장)**: OA가 단락 3개 이상으로 통합되거나 명확한 카테고리로 묶이는 경우(예: "정의 / 구성요소 / 동작 방식"), `####` H4 헤딩으로 내부 위계를 표현한다. 사용자 가독성 우선. 단락 1~2개로 흐름이 자연스러우면 H4 없이 둔다.
- **OA 길이 관리**: 한 단락이 6문장을 초과하면 문장 정리를 검토한다. OA 전체가 15문장을 초과하면 질문 분리를 검토한다. 테이블·코드블록·리스트는 문장 수에서 제외한다.
- **원문 보존**: 공식 문서 원문은 절대 수정하지 않는다. 마이그·재편 시에도 영어 원문(Official 콘텐츠)을 삭제해서는 안 된다 — 형태가 바뀌더라도(OA 단락 통합, Official Annotation → OA 흡수 등) 원문 자체는 반드시 어딘가에 보존되어야 한다.
- **OA 앞 한글 추가 금지**: `### Official Answer` 헤딩과 첫 번째 영어 원문 사이에, 또는 `#### H4` 서브섹션 헤딩과 영어 원문 사이에 AI-authored 한글 도입 문장(요약·설명·번역)을 삽입하지 않는다. OA 섹션은 영어 원문으로만 시작한다.
- **원본 언어 유지 (번역 금지)**: User Answer/User Annotation이 한글이면 한글 그대로 작성한다. 이 규칙은 User 섹션에만 적용되며, Official 섹션에는 적용되지 않는다.
  - 허용 편집: 맞춤법, 조사, 문장 흐름, 전문 용어 정확화
  - **명백한 사실 오류 정정은 필수**: 위키피디아 수준의 확립된 지식(표준 수치·프로토콜 헤더 필드·레지스터 정의 등)과 충돌하거나 같은 섹션 내 자기모순이 있으면 `User Answer`/`User Annotation`/`AI Annotation`에 한해 정정한다. **`Official Answer`는 예외 없이 수정 금지**.
  - 금지: 소스에 없는 새 사실 덧붙이기, 뉘앙스 변경, 근거 없는 주장
- **출처 명확성**: Official Answer는 반드시 Reference에 출처를 명시.
- **출처-Answer 매핑**: Reference에 공식 출처 URL이 있고 Official Answer가 아직 비어 있는 상태(학습 진행 중)는 위반이 아니다. 단 이 경우 `### Official Answer` 빈 헤딩을 만들지 말고 `### Reference`만 둔다.
- **동일 헤딩 중복 금지**: 하나의 Q&A 내에서 동일한 섹션 헤딩은 최대 1개만 허용한다. `### Official Answer` / `### AI Answer` / `### User Answer` / `### Reference` 각각 최대 1개. `> #### AI Annotation:` / `> #### User Annotation:` / `> #### Key Terms:` 각각 최대 1개. 중복 발생 시 내용을 합쳐 하나의 헤딩 아래 통합한다.

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
- **폐지 키 — Official Annotation**: `> #### Official Annotation:` 블록은 폐지되었다. 공식 출처의 보충은 Annotation으로 분리하지 않고 OA 본문에 단락으로 통합한다 (위 "OA 단락 통합" 참고). 출처·신뢰도가 Official Answer와 동일하므로 분리할 이유가 없다. digest/convert/explain 어떤 스킬도 이 키를 신규 생성하지 않는다.

| Annotation 유형 | 형식 | 출처 | 용도 |
|---|---|---|---|
| AI Annotation | `> #### AI Annotation:` | AI 생성 | OA에 없는 **새 비유·실생활 매핑·실무 통찰·외부 도구 매핑**(예: Chrome DevTools, Node.js API) |
| User Annotation | `> #### User Annotation:` | 사용자 작성 | 사용자의 **새 메모·경험·통찰**(OA에 없는 다른 시각, 학습 중 떠오른 비유 등) |

**Annotation 작성 정책 — 한글 풀이 금지**: AI Annotation도 User Annotation도 OA 영어 원문의 한글 번역·요약·풀이로 채우지 않는다. **한글 line-by-line 해설은 `/explain` 스킬이 `explained/<rel>.md`에 담당**하므로, knowledge/ 파일에 이중으로 둘 필요가 없다. digest/convert 등 어떤 스킬도 한글 풀이 Annotation을 생성하지 않는다. 사용자가 직접 한글 풀이를 적었으면 마이그·검증 시 정리를 제안한다.

**Annotation 중복 금지**: OA(또는 Key Terms)에서 이미 다룬 정의·예시·메커니즘을 단순 반복하는 Annotation은 삭제한다. AI·User 모두 적용. 위 "한글 풀이 금지"와 함께 적용 — OA 원문의 다른 언어 풀이도 "단순 반복"으로 본다. 새 비유·매핑·통찰·시각을 더할 때만 유지하고, 일부만 중복이면 중복 부분만 삭제한다. User Annotation은 자동 삭제하지 않고 사용자에게 정리를 확인받는다 (사용자가 직접 작성한 메모이므로).

```markdown
### Official Answer
A network is a group of communicating computers...

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

## 6. 이미지 처리

### Case 1: 다른 AI 답변 캡처
다른 AI(예: ChatGPT, Gemini 등) 답변 이미지를 옮길 때는 AI Annotation 블록쿼트로 부착한다:
```markdown
### Official Answer
[공식 문서 원문]

> #### AI Annotation:
> [AI 캡처 이미지 내 텍스트를 여기에 옮김]
```

### Case 2: 공식 문서 캡처 (다이어그램, 표)
- 이미지가 핵심 정보를 담고 있으면 텍스트로 변환
- 다이어그램은 구조를 텍스트로 설명

### Case 3: 외부 이미지
- 저작권 주의 (예: Getty Images)
- 가능하면 텍스트 설명으로 대체
- 원본 이미지 출처를 Reference에 명시