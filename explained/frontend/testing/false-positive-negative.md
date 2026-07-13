# 테스트에서 false positive와 false negative는 각각 무엇을 의미하는가?

## 본문

> The test is: "does the software work". If the test passes, then that means the test came back "positive" (found working software). If it does not, that means the test comes back "negative" (did not find working software). The term "False" refers to when the test came back with an incorrect result, meaning the software is actually broken but the test passes (false positive) or the software is actually working but the test fails (false negative).

방향이 헷갈리면 매핑 하나만 붙잡으면 된다 — **테스트 통과 = positive(동작하는 코드를 찾음)**, 실패 = negative(못 찾음)다. 앞에 붙는 **False**는 그 판정이 실제 코드 상태와 어긋났다는 뜻이고, 이름은 언제나 **테스트 결과 쪽**을 따른다.

| 구분 | 실제 코드 | 테스트 결과 | 무슨 일이 벌어지나 |
|---|---|---|---|
| **false positive** | 망가짐 | 통과(positive) | 버그를 못 잡고 놓침 |
| **false negative** | 멀쩡함 | 실패(negative) | 멀쩡한데 헛되이 깨짐 |

두 경우 모두 뿌리는 같다 — 테스트가 사용자가 겪는 **동작(behavior)**이 아니라 **내부 구현 세부**(내부 변수·내부 메서드처럼 사용자가 보지도 알지도 못하는 것)를 붙들 때 생긴다. React accordion(항목을 눌러 펼치고 접는 UI)으로 예를 들면:

- **false negative — 멀쩡한데 깨짐**: 열린 항목을 `openIndex`(숫자)에서 `openIndexes`(배열)로 바꾸는 리팩토링. 화면 동작은 그대로(여전히 하나만 펼침)인데, 내부 변수 `openIndex`를 직접 찌르던 테스트가 그 값이 사라져 `undefined`를 받고 실패한다. 코드는 멀쩡한데 테스트만 빨간불 → false negative.
- **false positive — 망가졌는데 통과**: 클릭 핸들러를 `onClick={() => setOpenIndex(index)}`에서 `onClick={setOpenIndex}`로 바꾸면, 핸들러가 `index` 대신 브라우저가 넘기는 클릭 이벤트 객체를 받아 버튼-핸들러 배선(wiring)이 끊긴다. 실제 아코디언은 망가진다. 그런데 테스트가 버튼 클릭 대신 내부 메서드 `setOpenIndex`를 코드에서 직접 호출해 상태만 확인했다면 통과한다 → 코드는 망가졌는데 통과 = false positive.

의료 검사와 정확히 같다 — 병이 없는데 "양성"이면 false positive, 병이 있는데 "음성"이면 false negative. 소프트웨어 테스트에선 "통과=positive"만 얹으면 그대로 대응된다.
