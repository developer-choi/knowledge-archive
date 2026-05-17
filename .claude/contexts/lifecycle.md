# Knowledge Archive 라이프사이클

KA 레포는 학습 콘텐츠를 생성·소비하는 사이클이 명확히 분리되어 있다. 어느 스킬에서 어떤 파일이 생성되고, 어디서 소비되는지를 한눈에 본다.

## 데이터 흐름

**Write 사이클 (knowledge·explained 생성)**

```
외부 PDF/MD       ──/convert──►  knowledge/  또는 techniques/  또는 tips/
공식문서 URL      ──/digest───►  knowledge/
knowledge/<rel>   ──/explain──►  explained/<rel>
```

**Read 사이클 (knowledge 소비)**

```
knowledge/  ──/explain  ──►  개념 해설 (+ explained/ 캐시)
knowledge/  ──/review   ──►  면접 검증 (1:1 핑퐁)
knowledge/  ──/exam     ──►  HTML 시험지 → 채점 결과
knowledge/  ──/validate ──►  양식 위반 수정
knowledge/  ──list-candidates──►  외부 채널용 JSON (AC full-refresh)
```

**브레인 사이클**

```
/exam (전체 통과)  ──►  brain.yaml (unknown → known)
/pre-exit          ──►  brain.yaml (새 키워드 등록)
```

## 스킬·스크립트 입출력

| 도구 | Read | Write | 트리거 |
|------|------|------|------|
| `/convert` | 사용자가 제공한 PDF·MD 외부 문서 | `knowledge/<rel>.md` · `techniques/<rel>.md` · `tips/` (신규 또는 기존 병합) | "변환해줘", 파일 경로 명시 |
| `/digest` | 공식 문서 URL (WebFetch), 사용자 텍스트, 기존 `knowledge/` 파일 | `knowledge/<rel>.md` (실시간 저장) | 공식 URL + "같이 읽자" / 원문 + "필기해줘" |
| `/explain` | `knowledge/<rel>.md`, `explained/<rel>.md` (캐시 hit 확인), `brain.yaml` (unknown 사전 정의) | `explained/<rel>.md` (질문별 H1 섹션 추가·덮어쓰기) | "설명해줘", "이게 뭐야" 등 자동 |
| `/exam` | `knowledge/<rel>.md` | `$env:TEMP/ka-exam-*.html` (시험지·결과), `brain.yaml` (전체 통과 시 unknown → known) | "시험", "/exam" 명시 |
| `/review` | `knowledge/<rel>.md`, `explained/<rel>.md` (다음 질문 전 해설 캐시) | 기본 없음. 복습 중 Key Terms 추가 요청 시 `knowledge/` 일부 수정 | "복습하자", "면접 연습" 명시 |
| `/validate` | `knowledge/`, `explained/`, contexts 전반 | `knowledge/<rel>.md` 위반 수정, `explained/<rel>.md` 고아 섹션·파일 삭제 | "검증해줘", "/validate" 명시 |
| `list-candidates` (npm) | `knowledge/` 하위 모든 `.md`, git log | stdout 또는 `--out` 경로에 Candidate[] JSON | CLI |

## Write 대상별 정리

- `knowledge/`: `/convert`, `/digest` (생성·추가) · `/validate`, `/review` (수정)
- `explained/`: `/explain` (생성·갱신) · `/validate` (고아 삭제)
- `brain.yaml`: `/exam` (Phase 6 전체 통과 시) · `/pre-exit` (세션 종료 시)
- `$env:TEMP/*.html`: `/exam` (시험지·결과)
- 외부 JSON: `list-candidates`

## Read 전용 스킬

- `/review`: `knowledge/` + `explained/` Read만 (기본). 복습 중 사용자 요청 시 Key Terms 추가 가능.
- `/explain` 캐시 hit 시: `explained/` Read만 (재생성 X)

## 동기화 규칙

### knowledge → explained

`knowledge/<rel>.md`가 변경되면 1:1 대응 `explained/<rel>.md`도 outdated가 된다. **자동 재생성은 없으며**, 사용자가 `/explain <path>`를 명시 호출해야 갱신된다. 마이그·재편 후에는 명시 트리거로 일괄 재생성 필요.

### contexts → 양식 위반 검출

`.claude/contexts/` (양식·규칙) 변경 시 `/validate` 전체 재실행으로 기존 `knowledge/`가 새 규칙을 위반하는지 점검한다.

### 영향 범위 점검

상세 매핑은 `CLAUDE.md`의 "변경 시 동기화" 섹션 참고.

## brain.yaml 라이프사이클

`CLAUDE.md`의 "brain.yaml" 섹션 참고. 짧게:
- 세션 시작: Read (unknown 항목 사전 정의용)
- `/pre-exit`: Write (새 키워드 unknown 등록, 설명 완료된 것 known 이동)
- `/exam` 전 라운드 통과: Write (해당 키워드 unknown → known)
- 설명 중 미정의 키워드 발견: 사용자 승인 후 Write
