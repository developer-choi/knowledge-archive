# Knowledge Archive 개선 논의 정리

2026-03-09 논의 내용을 정리한 문서입니다.

---

## 당장 개선할 수 있는 것들

### 1. 잡일 정리
- 레포 폴더명 오타: `knowledge-acrchive` → `knowledge-archive`
- `package.json`, `AGENT.md`에서 옛 이름 "fact-archive" 잔존
- `GEMINI.md` 파일 필요 여부 확인

### 2. 양식 불일치 정리
- `network-basics.md` — `### AI answer`로 작성된 곳이 있음 (표준: `### Official Answer` + `> AI Annotation`)
- Annotation에 `> User Annotation` 접두사 누락된 곳 존재
- Questions에 앵커 링크 없는 항목 존재

### 3. TODO 관리
- TODO 질문이 방치되어 있음 (network-basics.md에 5개)
- TODO만 모아서 볼 수 있는 구조 부재

### 4. 파일 단위 재검토
- `network-basics.md`가 191줄에 질문 16개, 주제가 Host/Router/Switch/MAC/Throughput까지 혼재
- 하나의 개념 단위로 분리하는 게 나을 수 있음

### 5. instruction/playbook을 ai-contexts skill로 승격
- review, add-note, convert, scaffold, organize, validate → slash command로 전환
- knowledge-archive에는 데이터(Q&A)만 남기고, 규칙/워크플로우는 ai-contexts로 이동
- instruction-map.md 라우팅은 skill 시스템이 대체

### 6. 복습 스케줄링 (SRS)
- `meta/review-log.json`에 복습 메타데이터 분리 저장 (knowledge 파일 오염 방지)
- confidence, last_reviewed, review_count, history 추적
- 망각곡선 기반으로 "오늘 복습할 것" 자동 추천
- 약점 추적: 주제별 정답률 패턴 분석

---

## 근본적으로 고민해봐야 하는 것

### 이 레포의 현재 정체성

"공식 문서 내용을 Q&A로 옮겨 적고, AI가 면접관처럼 질문해주는 저장소"

### 근본적 한계

- 공식 문서는 이미 인터넷에 있고, AI는 그 내용을 이미 알고 있음
- Q&A를 직접 저장해둬야 AI가 복습을 도와줄 수 있는 건 아님
- "정리했다는 행위 자체"가 학습이지, 저장된 데이터의 가치는 시간이 갈수록 떨어짐 (공식 문서 업데이트 시 stale)

### 이 레포만의 고유 가치

1. **User Annotation** — 본인만의 해석, 비유, 연결고리. 공식 문서에도 AI에도 없는 것.
2. **어떤 걸 모르는지에 대한 기록** — TODO, confidence, 틀린 이력. 본인의 약점 지도.

### 방향 전환 가능성

"지식 저장소"가 아니라 **"나의 학습 상태 추적기"**로 정체성을 재정의하면:

- Official Answer 중심 → User Annotation 중심으로 무게 이동
- 지식 보관이 목적 → 약점 파악과 성장 추적이 목적
- 저장의 완성도 → 복습의 효과 측정이 핵심 지표
