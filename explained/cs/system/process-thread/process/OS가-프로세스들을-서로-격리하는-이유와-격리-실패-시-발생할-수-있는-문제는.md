# OS가 프로세스들을 서로 격리하는 이유와, 격리 실패 시 발생할 수 있는 문제는?

> The operating system keeps its processes separate and allocates the resources they need, so that they are less likely to interfere with each other and cause system failures (e.g., deadlock or thrashing).
> The operating system may also provide mechanisms for inter-process communication to enable processes to interact in safe and predictable ways.

---

**도입**

`node app.js`를 두 번 실행하면 두 Node 프로세스가 만들어지는데, 한 쪽이 다른 쪽의 메모리를 들여다볼 수 없습니다. 왜 OS가 일부러 이렇게 칸을 막아둘까요? 한 쪽이 망가져도 다른 쪽은 무사하기 위해서입니다. 그리고 그렇게 막아두면서도 필요할 땐 통신할 수 있도록 OS가 별도의 통로(IPC)를 열어둡니다.

---

**본문**

> The operating system keeps its processes separate and allocates the resources they need,

OS는 프로세스들을 서로 분리해 두고, 각 프로세스에 필요한 자원을 할당한다.

- **keeps its processes separate**: 각 프로세스에 별도의 가상 메모리 공간을 부여. A 프로세스의 변수와 B 프로세스의 변수는 같은 이름이라도 물리적으로 다른 RAM 영역에 저장됩니다.
- **allocates the resources they need**: OS가 자원의 분배자 역할. 메모리, 파일 핸들, 소켓 등 각 프로세스가 필요로 하는 만큼만 떼어줍니다. 분배자가 없으면 프로세스끼리 자원 쟁탈전이 벌어집니다.

> so that they are less likely to interfere with each other and cause system failures (e.g., deadlock or thrashing).

그래서 서로 간섭하거나 시스템 장애(예: 데드락, 스래싱)를 일으킬 가능성이 낮아진다.

- **interfere**: A 프로세스가 B의 메모리를 직접 망가뜨리거나, B가 쓰던 파일을 막 닫아버리는 상황. 격리되어 있지 않으면 한 프로세스의 버그가 다른 프로세스를 즉사시킵니다.
- **deadlock**: A가 B의 자원을 기다리고, B가 A의 자원을 기다려 둘 다 영원히 멈추는 상태. 식당에서 두 손님이 서로의 포크를 잡고 "먼저 놓아야지" 하며 영원히 안 먹는 그림.
- **thrashing**: 메모리가 부족해서 OS가 디스크와 RAM 사이에 페이지를 미친 듯이 옮기는 상태. 실제 작업보다 페이지 교체에 시간을 더 써서 시스템 전체가 거의 멈춥니다.

> The operating system may also provide mechanisms for inter-process communication to enable processes to interact in safe and predictable ways.

OS는 또한 프로세스가 안전하고 예측 가능한 방식으로 상호작용할 수 있도록 IPC 메커니즘을 제공할 수 있다.

- **inter-process communication (IPC)**: 격리된 프로세스끼리 데이터를 주고받기 위한 통제된 통로. 파이프, 소켓, 공유 메모리, 메시지 큐 등의 형태로 OS가 중재합니다.
- **safe and predictable**: A가 B의 메모리를 함부로 읽지 못하고, OS가 정해둔 규칙대로만 데이터가 오갑니다. 무법지대가 아니라 검문소.

---

**종합**

격리가 없으면 어떻게 되는지 상상해보면 명확합니다. Chrome 탭 50개가 같은 메모리를 공유한다면, 1개 탭의 메모리 누수가 전체 브라우저를 죽일 수 있습니다. 실제로 Chrome은 이 문제를 해결하려고 탭마다 별도 프로세스를 띄웁니다 — 한 탭이 크래시해도 다른 탭은 살아있죠.

격리의 두 가지 효과:

- **보안**: A 프로세스가 B의 비밀번호를 메모리에서 훔쳐볼 수 없습니다.
- **안정성**: A가 죽어도 B는 무사. 한 프로세스의 SEGFAULT가 OS 전체를 다운시키지 않습니다.

격리만 하면 데이터를 주고받을 수 없으니, OS는 IPC라는 "공식 통로"를 제공합니다. `ls | grep .md`의 파이프가 IPC의 가장 익숙한 사례 — `ls` 프로세스의 stdout이 OS 커널의 파이프 버퍼를 거쳐 `grep` 프로세스의 stdin으로 전달됩니다. 두 프로세스가 직접 메모리를 공유하는 게 아니라 OS가 중간에서 데이터를 옮겨줍니다.

오개념 예방: 격리는 "절대 통신 불가"가 아니라 "통제된 통신만 허용"입니다. IPC 자체가 OS가 격리 규칙 안에서 합법적으로 열어둔 창구라서, 격리와 IPC는 반대 개념이 아니라 한 묶음으로 봐야 합니다.
