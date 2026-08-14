# Knowledge Archive

## 디렉터리 구조

```
knowledge/   학습 Q&A 문서 (원본, 진실의 원천)
explained/   knowledge와 1:1 대응하는 해설 캐시 (/digest가 생성, 복습 때 읽음)
reference/   검색·참조용 사실 창고 (도구·기법 + knowledge/에서 강등된 심화 사실. Q&A 구조이되 H1 없음)
tips/        짤막한 단편 필기 (알아두면 좋은데 외울 필요는 없는 것)
archives/    학습 중 파생된 심층 보충 노트 (특정 Q&A와 1:1 대응 안 하는 깊은 탐구)
assets/      explained 설명에 임베드되는 정적 자산 (데모 HTML·이미지 등, knowledge 경로 미러링)
scripts/     마이그레이션·검증·후보 추출 스크립트
```

`explained/<rel>.md`는 `knowledge/<rel>.md`와 1:1 대응한다. 질문별 설명 섹션이 `\n\n---\n\n` 구분자로 이어붙여져 있고, 각 섹션은 H1(질문 제목)으로 시작한다.

`explained/`·`assets/`는 `knowledge/`(진실의 원천) 경로를 미러링하는 파생물이다. **원본을 이동·개명하면 대응 explained·assets도 같은 경로로 동반 이동**한다 — [`local/contexts/directory-roles.md`](local/contexts/directory-roles.md)의 "원본 이동 시 미러 동반 이동" 참고.

어느 스킬이 어떤 파일을 read/write하는지는 [`local/contexts/lifecycle.md`](local/contexts/lifecycle.md) 참고.

## 폴더 규칙

### 대주제 (이 콘텐츠가 KA에 속하는가)

콘텐츠 추가 전 AC `deploy/contexts/placement.md`(글로벌 분업 정책)를 본다. KA로 갈지, MP(예제 코드)·AC(공통 원칙)로 갈지 먼저 판단한다.

### 소주제 (KA 안에서 어디로)

- **역할 디렉토리** (knowledge/ vs reference/ vs explained/) — [`local/contexts/directory-roles.md`](local/contexts/directory-roles.md)
- **도메인 폴더·파일명·검색** — [`local/contexts/file-placement.md`](local/contexts/file-placement.md)

## explained/ 마이그레이션 절차

구조 변경이 필요할 때 `merge-explained`로 플랜을 먼저 확인하고 통합한 뒤, `verify-merge`가 바이트 동일을 전부 OK로 낼 때까지 커밋하지 않는다.

## explained 문서 보충

사용자가 세션 중 explained 문서에 있는 내용을 이해 못 해 질문하면:
1. 답변한다.
2. 사용자가 해당 주제를 이해했다는 신호(ㅇㅇ, 다음, 아하, 고마워 등)를 보내는 시점에 "explained에 방금 물어본 내용 보충할까요?" 라고 묻는다. 대화가 다른 주제로 넘어가기 전에 반드시 묻는다.
3. 사용자가 승인하면 해당 설명을 explained 파일의 관련 섹션에 보충한다.

### 보충 헤딩 규칙

explained 문서의 헤딩 계층은 `## 본문 → ### 1계층 소주제 → #### 2계층 세부설명`이다. 보충 내용도 이 계층을 따른다.

- 기존 `###` 섹션(예: `### Process state`) 안에 넣는 보충이면 `####`을 사용한다.
- 보충 내용이 여러 소주제로 나뉘면 각각 `####`으로 구분한다.

## 새 루트 폴더 추가 시

새 루트 디렉토리(예: `archives/`)를 문서 세 곳(위 구조 표·`directory-roles.md`·`list-candidates.md`)에 적었는지는 `validate-lint`가 본다.

기계가 못 보는 것은 둘이다.

- 그 루트를 외부에 노출한다면 `scripts/list-candidates.mts`의 스캔 로직에 넣는다.
- `knowledge/` 경로를 미러링하는 루트라면 `directory-roles.md`의 "원본 이동 시 미러 동반 이동" 목록에도 넣는다.

## 약어
- OA = Official Answer

## 변경 시 동기화

### knowledge frontmatter

`tags`/`source`/`publishable` 키 변경 시 `scripts/list-candidates.mts`(파싱)와 AC `refresh-projects`의 KQ 배포 단계(JSON 입력)를 함께 점검한다.

### knowledge 본문 구조

헤딩 위계나 `[TODO]`/`[UNVERIFIED]` 마커 변경 시 `scripts/list-candidates.mts`(파싱)와 `/validate`(검증)를 함께 점검한다.

### list-candidates 출력 형식

`scripts/list-candidates.mts`의 Candidate 인터페이스 변경 시 AC `refresh-projects`의 KQ 배포 단계가 받는 JSON 인터페이스도 함께 수정한다.
