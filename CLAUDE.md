# Knowledge Archive

## 디렉터리 구조

```
knowledge/   학습 Q&A 문서 (원본, 진실의 원천)
explained/   /explain 스킬이 생성·저장하는 설명 캐시
techniques/  도구·기법 학습 정리 (검색·참조용, Q&A 아님)
archives/    학습 중 파생된 심층 보충 노트 (특정 Q&A와 1:1 대응 안 하는 깊은 탐구)
scripts/     마이그레이션·검증·후보 추출 스크립트
```

`explained/<rel>.md`는 `knowledge/<rel>.md`와 1:1 대응한다. 질문별 설명 섹션이 `\n\n---\n\n` 구분자로 이어붙여져 있고, 각 섹션은 H1(질문 제목)으로 시작한다.

어느 스킬이 어떤 파일을 read/write하는지는 [`.claude/contexts/lifecycle.md`](.claude/contexts/lifecycle.md) 참고.

## 폴더 규칙

### 대주제 (이 콘텐츠가 KA에 속하는가)

콘텐츠 추가 전 AC `deploy/contexts/placement.md`(글로벌 분업 정책)를 본다. KA로 갈지, MP(예제 코드)·AC(공통 원칙)로 갈지 먼저 판단한다.

### 소주제 (KA 안에서 어디로)

- **역할 디렉토리** (knowledge/ vs techniques/ vs explained/) — [`.claude/contexts/directory-roles.md`](.claude/contexts/directory-roles.md)
- **도메인 트리** (frontend/, cs/, infra/, …) — [`.claude/contexts/folder-blueprint.md`](.claude/contexts/folder-blueprint.md)
- **파일명·검색** — [`.claude/contexts/file-placement.md`](.claude/contexts/file-placement.md)

## npm 스크립트

| 명령 | 역할 |
|------|------|
| `npm run list-candidates` | `knowledge/` 스캔 → AC `full-refresh`에 전달할 후보 JSON 출력. 입출력·skip 규칙·폴더구조 변경 영향범위는 [`.claude/contexts/list-candidates.md`](.claude/contexts/list-candidates.md) |
| `npm run merge-explained` | `explained/<rel>/<slug>.md` 파일들을 `explained/<rel>.md` 단일 파일로 통합. `--dry-run`(기본) / `--apply` 플래그 사용 |
| `npm run verify-merge` | 통합 후 각 섹션이 원본 파일과 바이트 동일한지 검증 |

## explained/ 마이그레이션 절차

구조 변경이 필요할 때:

1. `npm run merge-explained --dry-run` — 플랜 미리보기, 오류 없으면
2. `npm run merge-explained --apply` — 실제 통합 실행
3. `npm run verify-merge` — 바이트 동일 검증 (전체 OK 확인 후 커밋)

## explained 문서 보충

사용자가 세션 중 explained 문서에 있는 내용을 이해 못 해 질문하면:
1. 답변한다.
2. 사용자가 해당 주제를 이해했다는 신호(ㅇㅇ, 다음, 아하, 고마워 등)를 보내는 시점에 "explained에 방금 물어본 내용 보충할까요?" 라고 묻는다. 대화가 다른 주제로 넘어가기 전에 반드시 묻는다.
3. 사용자가 승인하면 해당 설명을 explained 파일의 관련 섹션에 보충한다.

### 보충 헤딩 규칙

explained 문서의 헤딩 계층은 `## 본문 → ### 1계층 소주제 → #### 2계층 세부설명`이다. 보충 내용도 이 계층을 따른다.

- 기존 `###` 섹션(예: `### Process state`) 안에 넣는 보충이면 `####`을 사용한다.
- 보충 내용이 여러 소주제로 나뉘면 각각 `####`으로 구분한다.

## brain.yaml

`.claude/contexts/brain.yaml` — 사용자가 아는 것/모르는 것을 도메인별로 관리하는 파일.

### 라이프사이클

**읽기**
- 세션 시작 시 반드시 Read한다. 설명할 때 `unknown` 항목이 등장하면 먼저 정의한 뒤 이어서 설명한다.

**쓰기 (자동)**
- `/pre-exit` 시점에 이번 세션에서 새로 등장한 키워드를 `unknown`에 추가하고, 설명 완료된 것은 `known`으로 이동한다.
- exam 전 라운드 통과(오답 0) 시 해당 파일의 관련 키워드를 `unknown` → `known`으로 이동한다.

**쓰기 (제안 후 승인)**
- 설명 도중 brain.yaml에 없는 새 키워드가 등장하면 "brain.yaml에 추가할까요?"를 묻고 승인 시 추가한다.

### 양식

```yaml
known:
  도메인:
    키워드:
      하위키워드:   # 자식이 없으면 빈 값

unknown:
  도메인:
    키워드:
      하위키워드:
```

## 새 루트 폴더 추가 시 체크리스트

새 루트 디렉토리(예: `archives/`)를 추가할 때 수정해야 할 파일:

- `CLAUDE.md` — 디렉터리 구조 표에 추가
- `.claude/contexts/directory-roles.md` — 역할 정의 추가
- `.claude/contexts/list-candidates.md` — 스캔 대상 여부 명시 (외부 노출 포함/제외)
- `list-candidates.mts` — 외부 노출 대상이면 스캔 로직 추가

`archives/`는 외부 노출 제외 — `list-candidates.mts` 수정 불필요.

## knowledge 파일 구조 규칙

- 폴더명과 동일한 파일명을 그 폴더 안에 두지 않는다.
  - 나쁜 예: `process/process.md` (폴더와 파일 이름 동일)
  - 좋은 예: `process-thread/process.md` (부모 폴더가 더 넓은 범위를 기술)

## 약어
- OA = Official Answer

## 학습 출처 선호도

사용자가 개념·용어·동작 방식을 질문하면 아래 순위로 출처를 탐색하여 답한다.

- 1순위: Wikipedia — 개념 정의의 기본값. 항상 여기서 먼저 찾는다.
- 2순위 (도메인별 공식 1차 소스):
  - MDN — 웹 API, HTTP, 브라우저 동작
  - man7.org — Linux 시스템 콜 (`fork`, `exec`, `wait` 등)
  - RFC (datatracker.ietf.org) — 네트워크 프로토콜 원문 (HTTP, TCP 등)
  - OSTEP (ostep.org) — OS 개념 (프로세스, 스케줄링, 메모리 관리 등)
  - POSIX spec (pubs.opengroup.org) — 시스템 콜 표준 정의
- 공식문서 원문(영어)을 Official Answer로 사용

## frontmatter `source` 키

**파일이 어떤 맥락에서 만들어졌는가**를 나타낸다. Q&A별 출처 신뢰도가 아님 — 개별 신뢰도는 `[UNVERIFIED]` 마커 + `### Reference`가 담당한다. `scripts/list-candidates.mts`가 그대로 export하여 full-refresh dry-run에서 출처별 그룹화에 쓰인다.

상세 규칙은 `.claude/contexts/content-format.md`의 `source` 섹션 참고.

| 값 | 의미 |
|----|------|
| `official` | MDN·Wikipedia 등 1차 소스를 직접 읽으면서 작성 |
| `google-doc` | `/convert`로 구글 문서에서 변환된 파일 |
| `unverified` | 출처 미추적 (유튜브·교재·개인 메모 등) |

**파일 분리 시 반드시 상속**: 파일을 여러 개로 쪼갤 때 원본의 `source` 값을 모든 파생 파일에 복사한다. 누락의 대부분이 이 경우에서 발생한다.

## 변경 시 동기화

### contexts (양식·규칙)

`.claude/contexts/` 변경 시 `knowledge/` 전체를 `/validate`로 재검증하고, AC `full-refresh`·`doc-router`가 KA 양식을 참조하니 함께 점검한다.

### knowledge frontmatter

`tags`/`source`/`publishable` 키 변경 시 `scripts/list-candidates.mts`(파싱)와 AC `full-refresh`(JSON 입력)를 함께 점검한다.

### knowledge 본문 구조

헤딩 위계나 `[TODO]`/`[UNVERIFIED]` 마커 변경 시 `scripts/list-candidates.mts`(파싱)와 `/validate`(검증)를 함께 점검한다.

### list-candidates 출력 형식

`scripts/list-candidates.mts`의 Candidate 인터페이스 변경 시 AC `full-refresh`가 받는 JSON 인터페이스도 함께 수정한다.

### convert 스킬 절차

`.claude/skills/convert/SKILL.md` 변경 시 AC `doc-router`가 참조하는 절차도 함께 점검한다.
