# Memory Management

- [How JavaScript works: memory management + how to handle 4 common memory leaks | Alexander Zlatkov | SessionStack Blog](https://blog.sessionstack.com/how-javascript-works-memory-management-how-to-handle-4-common-memory-leaks-3f28b94cfbec) — 이 글이 지금은 이해가 될까
- [Memory Management — JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

## Memory Lifecycle

### Allocate

메모리에 저장할 데이터 크기만큼 할당합니다. 하지만 JS는 C같이 로우레벨 언어가 아니기 때문에, 이걸 개발자가 하지 않습니다.

### Read & Write

메모리에 저장된 데이터의 시작 주소값을 변수에 저장하고, 그 변수를 통해 값을 읽거나 쓸 수 있습니다.

### Release

더 이상 필요 없어지면 가비지콜렉터가 회수해 갑니다. (+ 마크 스윕 알고리즘) JS는 C같이 로우레벨 언어가 아니기 때문에, 이걸 개발자가 직접 하지 않는 것은 맞습니다.

함수 안에 지역변수 선언해놓고, 그 함수 호출하면 할당도 알아서 되고, 호출된 그 함수가 종료되면 그 할당된 지역변수는 알아서 해제가 됩니다.

다만, 메모리 누수가 발생하는 유명한 사례가 몇 개 있기 때문에 이걸 조심해야 합니다.

1. **전역변수**는 정말 필요한 경우에만 사용해야 합니다. 지역변수는 함수 호출이 종료되면 수거되지만, 전역변수는 그렇지 않고 `window` 객체 안에 저장되기 때문입니다.
2. **등록을 했으면, 나중에 삭제를 해야 합니다.**
   1. `addEventListener` 했으면, `removeEventListener` 해야 하고
   2. `URL.createObjectURL()` 했으면, `URL.revokeObjectURL()` 해야 함.
   3. `setInterval` 했으면, 더 이상 필요 없어졌을 때 `clearInterval()` 해야 함.

## What's the Memory Leak

회수되지 않는 메모리. (= 못 씀. 여기에 새로운 거 할당해서 다른 용도로 못 씀.)
