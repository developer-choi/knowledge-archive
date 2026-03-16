# Knowledge Archive

공식 문서의 영어 원문을 토씨 하나 틀리지 않고 그대로 기록하는 저장소.
축적된 원문은 학습, 복습, 팩트체크의 기반이 된다.

---

## 3 Flow

```
┌─────────────────────────────────────────────────────────────┐
│  production-guide ## Before                                 │
│  - content-format.md 읽기 (원칙 확인)                       │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌──────────────┬───────────────────┬──────────────────────────┐
│  add-note    │  convert          │  digest                  │
│              │                   │                          │
│  사용자 내용 │  Step 2. PDF      │  /digest ON [URL]        │
│  → Q&A 작성  │    읽기/분류      │  안내 메시지 출력        │
│              │  Step 3. 매핑     │      ↓                   │
│              │  Step 4. 링크     │  ┌─루프──────────────┐   │
│              │    보완 (대기)    │  │ 사용자: 단락 붙여넣기│  │
│              │                   │  │ AI: 문장 해설       │  │
│              │                   │  │ AI: 질문 제안       │  │
│              │                   │  │ 사용자: 승인/거부   │  │
│              │                   │  └─반복───────────────┘  │
│              │                   │      ↓                   │
│              │                   │  /digest OFF             │
└──────┬───────┴─────────┬─────────┴─────────────┬────────────┘
       ↓                 ↓                       ↓
┌─────────────────────────────────────────────────────────────┐
│  production-guide ## After                                  │
│  - 파일 배치 (file-placement.md)                            │
│  - 구조 검증 (document-structure.md, template.md)           │
│  - 400줄 초과 경고                                          │
└─────────────────────────────────────────────────────────────┘
```

| Flow | 설명 | 스킬 |
|---|---|---|
| 생산 | 공식문서 원문을 그대로 옮겨 Q&A 축적 | `/add-note`, `/convert`, `/digest` |
| 복습 | 축적된 Q&A로 기술 면접 연습 | `/review` |
| 탐색 | 기존 지식 검색/참조/팩트체크 | AI가 knowledge/ 탐색 |

생산과 복습은 모두 학습 행위이고, 탐색은 축적된 영어 원문을 활용하는 것이다.

---

## 프로젝트 구조

```
knowledge-archive/
├── .claude/
│   ├── skills/           # 스킬 (add-note, convert, digest, review)
│   └── contexts/         # 스킬 공통 규칙 및 참조 파일
├── knowledge/            # Q&A 데이터
├── README.md
└── package.json
```

---

## 사용법

Claude Code에서 슬래시 커맨드로 호출한다.

```
/add-note  React Hooks 공부한 내용 정리해줘
/convert   구글 문서를 PDF+MD로 export 해왔어
/digest ON https://react.dev/reference/react/useMemo
/review    네트워크 관련 질문으로 복습하자
```
