# Modal 구현 조건

## 필수 구현 조건

Dynamic Import로 초기 로딩 시점에 번들에서 빠져야 한다.

모바일 — 모달이 열린 상태에서 안드로이드 뒤로가기 물리 버튼을 누르면 모달이 닫혀야 한다.

모달이 뜨면 뒷배경 스크롤을 막아야 한다. 닫히면 다시 스크롤을 풀어야 한다.

## Portal

CSS Child Selector로 인한 스타일링 오염을 막기 위해 Portal로 감싸야 한다.

- store로 모달을 띄우면 기본적으로 이런 문제가 발생하지 않는다.
- local state로 띄우면 발생하므로 Portal로 감싸야 한다.

## Reference

- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
