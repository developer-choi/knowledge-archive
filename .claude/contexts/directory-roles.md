# 디렉토리 역할

KA는 같은 도메인 트리에 대해 여러 **역할 디렉토리**를 둔다. 한 글이 어느 디렉토리에 들어가는지는 그 글의 **자료 성격**으로 결정한다. 도메인 분기는 별도 차원이며 [folder-blueprint.md](folder-blueprint.md) 참고.

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
- **활용**: 활용 방식은 자유 (knowledge/와 달리 Q&A 양식 아님). 검색용, AI 설명 요청용 등.

## 도메인 축과의 관계

역할 디렉토리는 안에 도메인 트리를 둔다:

- `knowledge/cs/algorithm/...`
- `techniques/cs/algorithm/...`
- `explained/cs/algorithm/...`

도메인 트리는 [folder-blueprint.md](folder-blueprint.md)를 따른다. 글의 최종 위치 = 역할 / 도메인 / 파일명. 파일명 규칙은 [file-placement.md](file-placement.md) 참고.

## 한 글이 어느 역할에 가는지 결정 흐름

1. **explained/**: 사용자가 직접 결정하지 않는다 (`/explain` 자동 생성).
2. **knowledge/ vs techniques/**: 자료 성격으로 결정한다.
   - "외워서 설명" → knowledge/
   - "검색·참조" (도구·기법) → techniques/
3. 결정 후 [folder-blueprint.md](folder-blueprint.md)·[file-placement.md](file-placement.md)로 도메인·파일명 정한다.
