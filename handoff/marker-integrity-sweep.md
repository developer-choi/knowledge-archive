# Handoff — 마커 재정합성 일괄 작업

## 배경

`[BACKLOG]` / `[UNVERIFIED]` 마커 규칙이 단순화되면서 (Reference 유무는 마커와 무관, OA 본문만 기준), knowledge/ 전체에 대해 정합성을 다시 맞춰야 한다.

규칙 SSOT: `.claude/contexts/document-structure.md`

요약:
- `### Official Answer` 본문이 비어 있을 때만 마커를 붙인다 (섹션 자체가 없는 경우 포함)
- OA 본문이 채워져 있으면 마커를 붙이지 않는다
- `### Reference`는 마커 사용 조건과 무관
- 분류 힌트
  - `[BACKLOG]` — 떠오르는 대로 적은 임시 메모
  - `[UNVERIFIED]` — 질문이 다듬어졌고 공식 출처만 못 찾은 상태. **질문이 명확하면 [UNVERIFIED]**

## 직전 커밋 흐름 (refactor/marker-integrity-sweep 브랜치 기준)

규칙 변경 (이미 main 라인에 반영됨):
- `c12df34` refactor(contexts): 빈 섹션 금지 룰 명문화
- `43068cb` refactor(contexts): 마커 룰 약화 + 분류 힌트 추가

규칙 반영 (이 브랜치):
- `d6e8ccc` refactor(knowledge): 빈 섹션 금지 룰 일괄 반영 (8 files)
  - 본문 없는 `### Official Answer` / `### Reference` 헤딩 삭제
  - TLS handshake 질문에 `[UNVERIFIED]` 복원

## 현재 스캔 결과 (이 브랜치 HEAD 기준)

스캔 스크립트는 임시였고 커밋 전에 삭제됨. 재실행 필요 시 아래 로직으로 다시 작성한다.

```python
# 한 파일 안의 ## 질문마다:
#   - 마커 추출 (^## \[(BACKLOG|UNVERIFIED)\])
#   - ### Official Answer 본문 검사 (다음 ### 또는 --- 또는 다음 ## 까지)
#   - 마커 있는데 OA 채워짐 → A) 마커 제거 대상
#   - 마커 없는데 OA 비어있음(섹션 자체가 없는 경우 포함) → B) 마커 부여 대상
```

직전 스캔 결과:
- **A) 마커 있는데 OA 채워짐**: 0건
- **B) 마커 없는데 OA 비어있음**: **352건**

B 352건은 거의 다 `### Reference`만 적혀있고 OA 본문은 없는 stub 질문들. 새 규칙상 마커가 반드시 붙어야 함.

## 잔여 작업

### 1. 스캔 재실행 (브랜치 시작 시)

A/B 카테고리 건수가 직전 스캔(0/352)과 동일한지 확인. 그동안 다른 세션에서 변경됐을 수 있음.

### 2. B 352건 일괄 마커 부여

분류 기준:
- 질문이 한 문장으로 명확하게 다듬어져 있고 출처 링크까지 있다 → `[UNVERIFIED]`
- 질문이 메모처럼 거칠게 적혀있다 → `[BACKLOG]`

대다수가 `[UNVERIFIED]` 후보로 보임. 분류 방식 후보:
- **A안**: 전부 `[UNVERIFIED]`로 일괄 부여 → `[BACKLOG]` 후보를 사용자가 직접 골라 다운그레이드
- **B안**: 파일별/카테고리별로 보면서 판단
- **C안**: 다른 기준 (사용자와 합의 필요)

세션 시작 시 사용자에게 확인.

### 3. A 케이스 (있다면) 마커 제거

스캔에서 0건이었지만 그동안 변경됐을 수 있음.

### 4. 커밋 분리

- 빈 섹션 반영은 이미 커밋됨 (`d6e8ccc`)
- 마커 부여는 별도 커밋
- 카테고리/파일 묶음 단위로 적당히 분할 권장

## 참고 — 이미 처리된 8개 파일

`d6e8ccc`에서 빈 섹션이 이미 정리된 파일들. 이 파일들은 마커 부여 대상에 다시 포함될 수 있음 (예: `concurrent-react.md`의 5개 질문 모두 OA 비어있음).

- `knowledge/cs/network/protocol/https.md`
- `knowledge/cs/network/rest-api.md`
- `knowledge/cs/system/memory/cache-memory.md`
- `knowledge/frontend/browser/rendering-path/critical-rendering-path.md`
- `knowledge/frontend/fsd/layers-segments.md`
- `knowledge/frontend/react/core/managing-state.md`
- `knowledge/frontend/react/performance/concurrent-react.md`
- `knowledge/frontend/typescript/types/generic-vs-unknown.md`

## 위험 / 주의사항

- 마커는 `## [UNVERIFIED] 질문...` 형태로 H2 헤딩 바로 뒤에 붙음. 다른 위치/형식 금지.
- 같은 질문에 두 마커가 동시에 붙는 경우는 없음 (배타적).
- 직전 세션에서 사용자 강조: **"질문이 명확하다 = `[UNVERIFIED]` 힌트"**, 임의로 `[BACKLOG]`로 강등하지 않을 것.
- 사용자 강조 (이전 세션): **임의 추측·확장 금지**. 마커 의미는 "출처 미확보" 그 이상도 이하도 아님. 채점 정책·꼬리질문·상태 흐름 등 확장하지 말 것.

## 누락 방지 체크

이 인수인계 작성 시점 커밋 누락 없이 push 완료 여부:
- [ ] `d6e8ccc` (빈 섹션 반영) push
- [ ] 이 handoff 문서 push
- [ ] 본 브랜치명: `refactor/marker-integrity-sweep`
