# 디렉토리 역할

KA는 글을 여러 **역할 디렉토리**에 나눠 둔다. 한 글이 어느 디렉토리에 들어가는지는 그 글의 **자료 성격**으로 결정한다. **활용 방식이 아니다** — 같은 글도 여러 스킬이 다양하게 활용할 수 있고, 글 위치에 활용 라벨을 박지 않는다.

## 표기 — `reference/`(폴더)와 `### Reference`(섹션)

이름이 겹치므로 글자로 구분한다. **폴더는 슬래시를 붙여 소문자 `reference/`**, **출처 섹션은 슬래시 없이 대문자 `### Reference`**로 적는다.

## knowledge/

Q&A 형식으로 정리된 학습 노트. 사용자가 면접관(AI)에게 질문받고 답변하는 형식이다.

- **자료 성격**: 이론·원리. "외워서 설명해야 하는 것".
- **판단 질문**: "이게 뭐야? / 왜?" 면접에서 단골로 물어보는 것.
- **양식**: [document-structure.md](document-structure.md)를 따른다.

## explained/

`knowledge/<rel>.md`와 1:1 대응하는 해설 캐시. 복습 때 직접 읽는 산출물이다.

- **양식**: 평문(Q&A 아님). 헤딩 양식은 [document-structure.md](document-structure.md#explained-파일-구조)를 따른다.
- **생성 주체**: 사용자가 직접 쓰지 않는다. `/digest` OFF가 [해설 생성 규칙](../../.claude/skills/digest/off.md#off-2단계--산출물-생성)대로 만든다.
- **경로 결합**: `knowledge/<rel>.md`의 경로를 미러링한다.

## assets/

explained 설명에 임베드되는 정적 자산(데모 HTML, 이미지, 다이어그램 등).

- **경로 결합**: `knowledge/<rel>` 경로를 미러링한다 (`assets/<rel>/<asset-file>`). explained 문서에서 상대 경로로 링크한다.

## reference/

검색·참조하는 사실 창고. 코드로 푸는 도구, API 사용법, 라이브러리 사용 기법과 함께, knowledge/에서 "면접에는 안 나오겠다"고 판정돼 내려온 심화 사실도 여기 담는다.

- **판단 질문**: "이걸 어떻게 구현해? / 어떻게 써?"
- **knowledge/와의 구분**: 면접에서 단골로 물어 외워서 설명해야 하면 knowledge/, 아니면 reference/.
- **양식**: knowledge/와 같되 `# Questions` 목차와 `# Answers` H1이 없다. 헤딩 양식은 [document-structure.md](document-structure.md)를 따른다.
  - 목차를 두지 않는 이유: 목차는 출제 범위를 훑는 스킬이 쓰는데, 이 폴더는 출제 대상이 아니어서 목차를 두면 유지 비용만 남는다.
  - 파일 제목용 H1도 넣지 않는다 — 파일명과 중복이고, knowledge/에서 문서를 내려보낼 때마다 제목을 새로 지어야 해 강등 동선에 마찰이 생긴다.

## tips/

면접에 나올 정도는 아니지만 알아두면 좋은 짧은 팁들의 필기장.

- **자료 성격**: 한 가지 깨달음·트릭·주의사항을 적은 단편. 통합 정리 의도 없음.
- **reference/와의 구분**: 한 주제를 묶어 정리하면 reference/, 흩뿌려진 단편 누적이면 tips/.
- **양식**: 자유 (Q&A 양식 아님). 제목 + 본문/코드, 출처 선택.
- **수명**: 영구 보관 가능 (reference/·knowledge/로의 승격 의무 없음).

## archives/

학습 중 특정 개념에서 파생된 심층 보충 노트. knowledge/ Q&A와 1:1 대응하지 않는 깊은 탐구 기록.

- **판단 질문**: "이건 Q&A로 정리하기엔 너무 넓고, tips/로 두기엔 너무 깊다."

## 도메인 축과의 관계

역할 디렉토리는 안에 도메인 트리를 둔다. archives/만 도메인 트리 없이 루트 바로 아래에 파일로 둔다. 글의 최종 위치 = `<역할>/<도메인 경로>/<파일명>`. 도메인 폴더와 파일명 규칙은 [file-placement.md](file-placement.md) 참고.

## 원본 이동 시 미러 동반 이동

`explained/`·`assets/`는 `knowledge/` 경로를 미러링하므로, `knowledge/<rel>.md`를 이동·개명할 때는 다음을 같은 경로로 함께 옮긴다:

- `explained/<rel>.md`
- `assets/<rel>/` (대응 자산이 있으면)

`knowledge/`를 미러링하는 루트를 새로 만들면 이 목록에 넣는다.

## 한 글이 어느 역할에 가는지 결정 흐름

knowledge/·reference/·tips/·archives/ 중 자료 성격으로 고른다. explained/·assets/는 사용자가 고르는 자리가 아니다.

- "외워서 설명" → knowledge/
- "한 주제 묶어 정리한 도구·기법", "knowledge/에서 강등된 심화 사실" → reference/
- "한 포인트 짧은 단편 필기" → tips/
- "Q&A로 정리하기엔 너무 넓고 tips/로 두기엔 너무 깊은 탐구" → archives/
