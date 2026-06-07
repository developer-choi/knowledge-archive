# Knowledge Archive 라이프사이클

KA 레포는 학습 콘텐츠를 생성·소비하는 사이클이 명확히 분리되어 있다. 어느 스킬에서 어떤 파일이 생성되고, 어디서 소비되는지를 한눈에 본다.

## 데이터 흐름

**Write 사이클 (knowledge·explained 생성)**

```
외부 PDF/MD       ──/convert──►  knowledge/  또는 techniques/  또는 tips/
공식문서 URL      ──/digest───►  knowledge/  (+ OFF 시 explained/<rel>)
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

## 스킬·스크립트 입출력

| 도구 | Read | Write | 트리거 |
|------|------|------|------|
| `/convert` | 사용자가 제공한 PDF·MD 외부 문서 | `knowledge/<rel>.md` · `techniques/<rel>.md` · `tips/` (신규 또는 기존 병합) | "변환해줘", 파일 경로 명시 |
| `/digest` | 공식 문서 URL (WebFetch), 사용자 텍스트, 기존 `knowledge/` 파일 | `knowledge/<rel>.md` (실시간 저장), `explained/<rel>.md` (OFF 시 확정 질문 + 세션 오해), `assets/<rel>/` (데모·이미지) | 공식 URL + "같이 읽자" / 원문 + "필기해줘" |
| `/explain` | `knowledge/<rel>.md`, `explained/<rel>.md` (캐시 hit 확인 + 발판 보정) | `explained/<rel>.md` (질문별 H1 섹션 추가·덮어쓰기) | "설명해줘", "이게 뭐야" 등 자동 |
| `/exam` | `knowledge/<rel>.md` | `$env:TEMP/ka-exam-*.html` (시험지·결과) | "시험", "/exam" 명시 |
| `/review` | `knowledge/<rel>.md`, `explained/<rel>.md` (다음 질문 전 해설 캐시) | 복습 중 Key Terms 추가 요청 시 `knowledge/` 일부 수정 | "복습하자", "면접 연습" 명시 |
| `/validate` | `knowledge/`, `explained/`, contexts 전반 | `knowledge/<rel>.md` 위반 수정, `explained/<rel>.md` 고아 섹션·파일 삭제 | "검증해줘", "/validate" 명시 |
| `list-candidates` (npm) | `knowledge/` 하위 모든 `.md`, git log | stdout 또는 `--out` 경로에 Candidate[] JSON | CLI |

## Write 대상별 정리

- `knowledge/`: `/convert`, `/digest` (생성·추가) · `/validate`, `/review` (수정)
- `explained/`: `/explain` (생성·갱신) · `/digest` OFF (세션 확정 질문 생성, 기존 섹션 보존) · `/validate` (고아 삭제)
- `assets/`: `/digest`·`/explain` (explained에 임베드할 데모·이미지)
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

## explained/ 트리 = 학습자 모델

별도 데이터 파일(아는 것/모르는 것 저장소) 없이, `explained/` 트리 자체가 학습자가 아는 것의 창고다. 어떤 개념이 explained 섹션(H1 헤딩)으로 존재하면 학습자가 한 번 이상 설명을 받은(=어렴풋이 아는) 것으로 본다. 학습 스킬은 설명 생성 전 explained 트리를 훑어 발판 높이를 보정한다 — [explanation-guide.md §0](explanation-guide.md) 참고. 막혀서 못 푼 항목은 KA가 아니라 AC 백로그로 정리되므로 KA에는 "모르는 것" 저장소가 필요 없다.
