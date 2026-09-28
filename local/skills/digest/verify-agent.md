# Digest — OA 원문 충실도 검증 (에이전트용)

digest OFF 2단계가 위임한 독립 검증이다. 넘겨받은 knowledge 파일 목록이 이번 세션의 범위다. 위반은 경고로 보고한다.

**대상**: 이번 세션 diff에서 **추가·수정**된 Q&A 중 `source: official`이고 Reference URL이 있는 것. 신규 질문뿐 아니라 기존 OA를 수정·보충한 질문도 포함한다.

**OA↔Reference 대조**:
- 각 Q&A의 Reference URL(들)을 WebFetch로 가져와, OA의 각 영어 문장이 원문에 **verbatim substring**으로 존재하는지 대조한다.
- 매칭은 **문장 단위**다 — 서로 다른 출처·위치의 원문 문장을 그대로 이어 붙이는 것은 허용 정책이므로, 블록·단락 단위로 대조하면 정상 이어붙임이 오검출된다.
- 어느 Reference 원문에서도 못 찾은 문장은 **"원문 불일치" 경고**로 보고한다 (개작·합성·환각 후보).

**verdict 규칙 (환각 방지)**:
- "일치" verdict마다 매칭된 소스 원문 문장을 **인용**한다 — 인용 없는 "verified"는 무효.
- Reference를 fetch할 수 없으면(paywall·JS 렌더·dead link) silent pass 하지 않고 **"검증불가"** verdict로 분리 보고한다.
