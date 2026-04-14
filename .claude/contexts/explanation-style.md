# 설명 스타일 가이드

explain, review, digest에서 해설·비유·예시를 만들 때 참조한다.

---

## 예시는 사용자 기술 스택 기반으로

사용자는 프론트엔드(JS/HTML/CSS) 개발자다.
비유나 코드 예시를 들 때 JS/브라우저/Node.js 생태계에서 가져온다.

- ✅ `console.log` 실행 흐름, 이벤트 루프, Web Worker, `async/await`
- ❌ Java의 `synchronized`, C의 `pthread`, Python의 GIL 중심 설명

다른 언어를 언급하는 것 자체는 괜찮지만, 핵심 비유와 첫 예시는 JS 기반이어야 한다.

---

## Official Answer 핵심 단어의 "왜"를 짚기

Official Answer에서 특정 단어가 선택된 이유를 설명한다.
정의를 외우는 것이 아니라, 왜 그 단어가 쓰였는지 이해시키는 것이 목표다.

- 예: "thread는 왜 sequence인가?" → 명령어가 순서대로 하나씩 이어지는 흐름이니까
- 예: "program은 왜 passive인가?" → 스스로 아무것도 하지 않는 정적 파일이니까
