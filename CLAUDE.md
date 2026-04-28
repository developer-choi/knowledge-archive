# Knowledge Archive

## 약어
- OA = Official Answer

## 학습 출처 선호도
- 1순위: Wikipedia, MDN
- 공식문서 원문(영어)을 Official Answer로 사용

## frontmatter `source` 키

KA 문서가 어떤 출처를 기반으로 작성됐는지 표기. `scripts/list-candidates.mts`가 이 값을 그대로 export하고, full-refresh dry-run에서 출처별 그룹화에 사용된다.

| 값 | 의미 |
|----|------|
| `official` | MDN·공식 docs 등 1차 소스 기반 |
| `google-doc` | 사용자 구글 문서 기반 (검증 약함) |
| `unverified` | 출처 명시 없거나 검증 안 됨 |

frontmatter에 `source` 키가 없으면 list-candidates 출력에서 빠진다 (full-refresh dry-run에서 "출처 미상" 그룹).
