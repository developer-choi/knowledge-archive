# list-candidates 스크립트 명세

`scripts/list-candidates.mts`의 입출력·skip 규칙·소비처·KA 폴더구조 변경 영향범위를 정의한다. KA CLAUDE.md의 「변경 시 동기화」 룰이 이 문서를 가리킨다.

## 실행

- 본체: `scripts/list-candidates.mts`
- 명령: `npm run list-candidates`
- env: `KA_HEAD` (선택, git 시점 지정)
- CLI: `--out <path>` (선택, 출력 파일 경로)

## Input

`knowledge/` 하위 모든 `.md`. **`knowledge/`라는 디렉토리명이 하드코딩**되어 있다 (`KNOWLEDGE_DIR = path.join(KA_ROOT, 'knowledge')`).

## Output

각 `.md` 파일당 `Candidate` 객체 1개를 JSON 배열로 반환.

| 필드 | 의미 |
|------|------|
| `slug`, `path`, `title`, `tags` | 파일 식별·메타 |
| `questionCount`, `questions[]` | H2 질문 중 Official Answer 있고 마커(`[TODO]`/`[UNVERIFIED]`) 없는 것 |
| `firstCommitDate`, `lastCommitDate` | git log 기반 |
| `source` | frontmatter `source` (`official` / `google-doc` / `unverified`) |
| `publishable` | frontmatter `publishable` (boolean) |
| `skipped.reason` | 제외 사유 — `no-answers` / `too-few-questions` (4 미만) / `no-official-answer` / `unfinished-only` / `unpublishable` |

## Skip 규칙

- `publishable: false` → 즉시 skip (사용자 의도적 제외)
- `# Answers` H1 없음 → skip
- H2 질문 전부 `[TODO]`/`[UNVERIFIED]` 마커 → skip
- 통과 질문이 4개 미만 → skip
- 단, skip된 것도 baseMeta는 유지하여 reason 포함해 반환

## 소비처 (downstream)

- AC `full-refresh` 스킬 — 외부 노출 후보 산출 시 입력
- KA CLAUDE.md 「변경 시 동기화」 — `tags`/`source`/`publishable` 변경 또는 헤딩 위계·마커 변경 시 본 스크립트 파싱과 `/validate`를 함께 점검

## KA 폴더구조 변경 시 시나리오

| 변경 | 영향 |
|------|------|
| `knowledge/` 디렉토리명 변경 | 스크립트 즉시 깨짐 (하드코딩) |
| `knowledge/` 안 서브 디렉토리 재배치 | 스크립트는 재귀 스캔이라 동작. `path` 필드 값만 바뀜. 다만 full-refresh 등 downstream에서 path 기반 분류 로직이 있으면 추가 점검 |
| `knowledge/` 외부에 새 루트 디렉토리 (예: `techniques/`, `tips/`, `archives/`) | 스크립트는 그 글들 **스캔 안 함**. 외부 노출 후보에서 빠짐. 의도가 "외부 노출 안 함"이면 정합. 그렇지 않으면 스크립트도 수정 필요. `archives/`는 외부 노출 제외 — 수정 불필요 |
| frontmatter 키 추가·변경 | `Candidate` 인터페이스 + AC `full-refresh` 받는 JSON 형식 함께 수정 |
| 헤딩 위계·마커 변경 | 파싱 로직 + `/validate` 함께 수정 |
