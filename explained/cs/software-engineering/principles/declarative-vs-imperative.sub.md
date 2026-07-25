# imperative 방식으로 UI를 조작하는 코드는 폼 하나에서는 잘 작동한다. 여러 폼이 섞인 복잡한 시스템으로 규모가 커지면 어떤 문제가 생기는가?

> Imagine updating a page full of different forms like this one. Adding a new UI element or a new interaction would require carefully checking all existing code to make sure you haven't introduced a bug (for example, forgetting to show or hide something).

"이런 폼들로 가득한 페이지를 업데이트하는 상황을 상상해보라. 새 UI 요소나 새 상호작용을 추가하면, 버그를 심지 않았는지 확인하기 위해 기존 코드 전체를 주의 깊게 점검해야 한다. 예: 무언가를 show하거나 hide하는 것을 빠뜨리는 경우."

- **carefully checking all existing code**: 새 요소 하나를 추가할 때 기존 코드 전체를 다시 읽어야 한다. 코드가 늘어날수록 이 비용도 선형이 아니라 지수적으로 커진다.
- **introduced a bug**: 기존 흐름을 깨서 버그를 심는 것. 명령형에서는 새 이벤트 핸들러를 추가할 때 기존 핸들러 안에 그것이 영향을 줄 `show`/`hide` 호출이 있는지 모두 확인해야 한다.
- **forgetting to show or hide something**: 명령형의 전형적 버그. `show(spinner)` 호출 후 에러 경로에서 `hide(spinner)`를 빠뜨리면 에러 후 스피너가 영원히 남는다.
