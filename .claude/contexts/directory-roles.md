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
- **양식**: `# Questions` / `# Answers` 헤딩, `### Official Answer` / `### Reference` / `### User Answer` / `> #### Key Terms:` / `> #### User Annotation:` 등. 자세한 양식은 [document-structure.md](document-structure.md) 참고.
- **활용 스킬 예**: `/exam`, `/explain`, `/validate`, `/digest`, `/convert`, `/review`.

## explained/

`/explain` 스킬의 런타임 캐시. `knowledge/<rel>.md`와 1:1 대응한다.

- **자료 성격**: knowledge/의 각 글에 대해 `/explain`이 생성한 풀어쓴 설명. 사용자가 직접 작성하지 않는다.
- **양식**: 평문. `## 도입 / ## 본문 / ## 종합` 같은 구조. Q&A 아님.
- **라우팅 대상 여부**: doc-router·convert는 explained/로 콘텐츠를 보내지 않는다. `/explain`이 자동 생성한다.

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

## 도메인 축과의 관계

역할 디렉토리는 안에 도메인 트리를 둔다:

- `knowledge/cs/algorithm/...`
- `techniques/cs/algorithm/...`
- `tips/cs/algorithm/...`
- `explained/cs/algorithm/...`

도메인 트리는 [folder-blueprint.md](folder-blueprint.md)를 따른다. 글의 최종 위치 = 역할 / 도메인 / 파일명. 파일명 규칙은 [file-placement.md](file-placement.md) 참고.

## 한 글이 어느 역할에 가는지 결정 흐름

1. **explained/**: 사용자가 직접 결정하지 않는다 (`/explain` 자동 생성).
2. **knowledge/ vs techniques/ vs tips/**: 자료 성격으로 결정한다.
   - "외워서 설명" → knowledge/
   - "한 주제 묶어 정리한 도구·기법" → techniques/
   - "한 포인트 짤막한 단편 필기" → tips/
3. 결정 후 [folder-blueprint.md](folder-blueprint.md)·[file-placement.md](file-placement.md)로 도메인·파일명 정한다.

## OA(Official Answer)는 활용 라벨이 아니다

`Official Answer`(공식 답변)는 **출처 표시**일 뿐, `/exam` 출제 대상 같은 활용 라벨이 아니다. process/thread 글도, framer-motion 글도 OA가 있을 수 있다. 차이는 **활용 방법**이지 OA 유무가 아니다. 활용은 사용자/스킬이 결정한다.
