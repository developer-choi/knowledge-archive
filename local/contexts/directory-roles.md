# 디렉토리 역할

KA는 같은 도메인 트리에 대해 여러 **역할 디렉토리**를 둔다. 한 글이 어느 디렉토리에 들어가는지는 그 글의 **자료 성격**(양식·내용·휘발성)으로 결정한다. **활용 방식이 아니다** — 같은 글도 여러 스킬이 다양하게 활용할 수 있고, 글 위치에 활용 라벨을 박지 않는다. 도메인 분기는 별도 차원이며 [folder-blueprint.md](folder-blueprint.md) 참고.

## 본질

글이 **머릿속에 적재할 이론**이냐, **필요할 때 꺼내 쓰는 도구**냐의 차이가 knowledge/와 techniques/를 가른다.

| | 이론·원리 (knowledge/) | 도구·기법 (techniques/) |
|---|---|---|
| 성격 | 외워서 설명해야 하는 것 | 알고리즘 = 코드로 푸는 도구. 라이브러리 = API 사용법 |
| 활용 | 머릿속에 적재해 즉시 꺼냄 | 코드로 짜거나 검색해서 가져다 씀 |
| 면접 | 단골 | 안 물어봄 (알고리즘은 코딩테스트로 검증, 라이브러리는 잘 안 물음) |
| 휘발성 | 안 변함. 외워야 함 | 라이브러리는 버전·교체로 변함. 알고리즘은 안 변하지만 외울 의무 없음 |
| 비유 | RAM | 외장 메모리 |

tips/는 통합 정리되지 않은 단편 누적, explained/는 knowledge/에 대한 풀어쓴 캐시.

## knowledge/

Q&A 형식으로 정리된 학습 노트. 사용자가 면접관(AI)에게 질문받고 답변하는 형식이다.

- **자료 성격**: 이론·원리. "외워서 설명해야 하는 것".
- **판단 질문**: "이게 뭐야? / 왜?" 면접에서 단골로 물어보는 것.
- **예시**: process/thread, OS, 네트워크, 알고리즘 이론, React core, cs/data-structure.
- **양식**: `# Questions` / `# Answers` 헤딩, `### Official Answer` / `### Additional Answer` / `### User Answer` / `### Reference` 등. 자세한 양식은 [document-structure.md](document-structure.md) 참고.
- **활용 스킬 예**: `/exam`, `/explain`, `/validate`, `/digest`, `/convert`, `/review`.

## explained/

`/explain` 스킬의 런타임 캐시. `knowledge/<rel>.md`와 1:1 대응한다.

- **자료 성격**: knowledge/의 각 글에 대해 풀어쓴 설명. 사용자가 직접 작성하지 않는다.
- **양식**: 평문. `## 도입 / ## 본문 / ## 종합` 같은 구조. Q&A 아님.
- **생성 주체**: `/explain`(질문별 캐시) + `/digest` OFF(세션 확정 질문 전체, 세션 중 사용자 오해를 본문에 녹여 저장). 같은 양식을 공유하며, 이미 있는 질문 섹션은 서로 덮어쓰지 않는다.
- **라우팅 대상 여부**: doc-router·convert는 explained/로 콘텐츠를 보내지 않는다.
- **경로 결합**: `knowledge/<rel>.md`의 경로를 미러링한다. 원본이 이동·개명되면 대응 `explained/<rel>.md`도 같은 경로로 동반 이동한다 (아래 "원본 이동 시 미러 동반 이동" 참고).

## assets/

explained 설명에 임베드되는 정적 자산(데모 HTML, 이미지, 다이어그램 등). 사용자가 직접 만들거나 스킬이 생성한다.

- **자료 성격**: 글 자체가 아니라, explained 설명을 보조하는 외부 파일. 예: margin collapsing을 눈으로 보여주는 데모 HTML.
- **경로 결합**: `knowledge/<rel>` 경로를 미러링한다 (`assets/<rel>/<asset-file>`). explained 문서에서 상대 경로로 링크한다. 원본이 이동·개명되면 대응 자산도 같은 경로로 동반 이동한다.
- **외부 노출**: 제외. `list-candidates.mts` 스캔 대상 아님.

## techniques/

도구·기법 학습 정리. 코드로 푸는 도구, API 사용법, 라이브러리 사용 기법.

- **자료 성격**: "외워서 설명"하지 않고 **검색·참조**하는 것.
- **판단 질문**: "이걸 어떻게 짜? / 어떻게 써?"
- **예시**: binary-search 알고리즘 구현, framer-motion useMotionValue 사용, label HTML element.
- **knowledge/와의 구분**: 라이브러리 버전·교체로 휘발되면 techniques/, 시간이 지나도 안 변하면 knowledge/. 면접에서 단골로 물어보지 않는 것은 techniques/.
- **양식**: knowledge/와 동일 (Q&A). [document-structure.md](document-structure.md) 참고.
- **활용**: 활용 방식은 자유. 검색용, AI 설명 요청용 등.

## tips/

면접에 나올 정도는 아니지만 알아두면 좋은 짤막한 팁들의 필기장.

- **자료 성격**: 한 가지 깨달음·트릭·주의사항을 적은 단편. 통합 정리 의도 없음.
- **판단 질문**: "알아두면 좋은데 외울 필요까진 없는 것."
- **예시**: regex `/g` flag 재사용 시 함정, TypeScript `is` keyword 사용 예.
- **techniques/와의 구분**: 한 주제를 묶어 정리하면 techniques/, 흩뿌려진 단편 누적이면 tips/.
- **양식**: 자유 (Q&A 양식 아님). 제목 + 본문/코드, 출처 선택.
- **파일 단위**: 주제별 파일에 누적하다가 많아지면 분리.
- **수명**: 영구 보관 가능 (techniques/·knowledge/로의 승격 의무 없음).

## archives/

학습 중 특정 개념에서 파생된 심층 보충 노트. knowledge/ Q&A와 1:1 대응하지 않는 깊은 탐구 기록.

- **자료 성격**: 학습 흐름에서 옆길로 샌 심층 탐구. 특정 질문에 국한되지 않고 한 개념 전체를 깊이 파고든 것.
- **판단 질문**: "이건 Q&A로 정리하기엔 너무 넓고, tips/로 두기엔 너무 깊다."
- **예시**: `archives/file.md` — 프로세스 학습 중 파일 디스크립터 개념 전체를 별도로 정리한 노트.
- **외부 노출**: 제외. `list-candidates.mts` 스캔 대상 아님.
- **도메인 트리**: 없음. 루트 바로 아래 파일로 둔다.

## 도메인 축과의 관계

역할 디렉토리는 안에 도메인 트리를 둔다:

- `knowledge/cs/algorithm/...`
- `techniques/cs/algorithm/...`
- `tips/cs/algorithm/...`
- `explained/cs/algorithm/...`

도메인 트리는 [folder-blueprint.md](folder-blueprint.md)를 따른다. 글의 최종 위치 = 역할 / 도메인 / 파일명. 파일명 규칙은 [file-placement.md](file-placement.md) 참고.

## 원본 이동 시 미러 동반 이동

`knowledge/`가 **진실의 원천**이고, `explained/`·`assets/`는 그 경로를 1:1 미러링하는 파생물이다. 따라서 `knowledge/<rel>.md`를 이동·개명할 때는 다음을 같은 경로로 함께 옮긴다:

- `explained/<rel>.md` (대응 설명 캐시가 있으면)
- `assets/<rel>/` (대응 자산이 있으면) + explained 문서 안의 링크 경로

미러를 따라 옮기지 않으면 `/validate`의 explained 고아 파일·커버리지 검사에 걸리고, assets 링크가 깨진다.

## 한 글이 어느 역할에 가는지 결정 흐름

1. **explained/**: 사용자가 직접 결정하지 않는다 (`/explain` 또는 `/digest` OFF가 생성).
2. **knowledge/ vs techniques/ vs tips/**: 자료 성격으로 결정한다.
   - "외워서 설명" → knowledge/
   - "한 주제 묶어 정리한 도구·기법" → techniques/
   - "한 포인트 짤막한 단편 필기" → tips/
3. 결정 후 [folder-blueprint.md](folder-blueprint.md)·[file-placement.md](file-placement.md)로 도메인·파일명 정한다.

## OA(Official Answer)는 활용 라벨이 아니다

`Official Answer`(공식 답변)는 **출처 표시**일 뿐, `/exam` 출제 대상 같은 활용 라벨이 아니다. process/thread 글도, framer-motion 글도 OA가 있을 수 있다. 차이는 **활용 방법**이지 OA 유무가 아니다. 활용은 사용자/스킬이 결정한다.
