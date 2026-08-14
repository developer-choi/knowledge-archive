# list-candidates 스크립트 — 코드에 없는 맥락

`scripts/list-candidates.mts`가 **왜 그렇게 동작하는지**와 **누가 그 출력을 먹는지**를 적는다. KA CLAUDE.md의 「변경 시 동기화」 룰이 이 문서를 가리킨다.

명령·인자·출력 필드·skip 사유 목록은 여기 옮겨 적지 않는다 — 전부 스크립트에 있다(`Candidate` 인터페이스, `SkipReason` 유니온, `MIN_QUESTIONS`, argv 파싱). 옮겨 적으면 코드가 바뀔 때마다 두 곳을 고쳐야 하고, 안 고치면 이 문서가 조용히 거짓이 된다.

## 스캔 범위 — `knowledge/`만

`knowledge/`라는 디렉토리명이 스크립트에 하드코딩돼 있다. 아래 「폴더구조 변경 시 시나리오」가 이 사실 위에 서 있다.

`explained/`는 스캔 대상이 아니다 — `knowledge/`에서 파생된 해설 캐시라 외부 노출 후보로 다시 세면 같은 글이 두 번 잡힌다.

## 소비처 (downstream)

- AC `refresh-projects`의 KQ 배포 단계 — 외부 노출 후보 산출 시 입력
- KA CLAUDE.md 「변경 시 동기화」 — `tags`/`source`/`publishable` 변경 또는 헤딩 위계·마커 변경 시 본 스크립트 파싱과 `/validate`를 함께 점검

## KA 폴더구조 변경 시 시나리오

| 변경 | 영향 |
|------|------|
| `knowledge/` 디렉토리명 변경 | 스크립트 즉시 깨짐 (하드코딩) |
| `knowledge/` 안 서브 디렉토리 재배치 | 스크립트는 재귀 스캔이라 동작. `path` 필드 값만 바뀜. 다만 KQ 배포 등 downstream에서 path 기반 분류 로직이 있으면 추가 점검 |
| `knowledge/` 외부에 새 루트 디렉토리 (예: `reference/`, `tips/`, `archives/`, `assets/`) | 스크립트는 그 글들 **스캔 안 함**. 외부 노출 후보에서 빠짐. 의도가 "외부 노출 안 함"이면 정합. 그렇지 않으면 스크립트도 수정 필요. `archives/`·`assets/`는 외부 노출 제외 — 수정 불필요 |
| frontmatter 키 추가·변경 | `Candidate` 인터페이스 + AC refresh-projects의 KQ 배포가 받는 JSON 형식 함께 수정 |
| 헤딩 위계·마커 변경 | 파싱 로직 + `/validate` 함께 수정 |
