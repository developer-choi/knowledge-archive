# 현대 OS가 프로세스 간 직접 통신을 막고 IPC를 제공하는 이유는?

> For security and reliability, most modern operating systems prevent direct communication between independent processes, providing strictly mediated and controlled inter-process communication.

---

**도입**

앞서 OS가 프로세스를 격리한다고 했죠. 근데 정말 격리만 하면 프로세스끼리 데이터를 못 주고받습니다. `ls | grep .md`처럼 출력을 다음 명령에 넘기는 일도 못 하고요. 격리하되 안전하게 통신할 수 있게 OS가 직접 만들어준 통로가 IPC입니다.

---

**본문**

> For security and reliability, most modern operating systems prevent direct communication between independent processes, providing strictly mediated and controlled inter-process communication.

보안과 안정성을 위해, 대부분의 현대 OS는 독립된 프로세스 간의 직접 통신을 막고, 엄격하게 중재되고 통제된 프로세스 간 통신(IPC)을 제공한다.

- **for security and reliability**: 두 가지 목적. 보안 = A가 B의 비밀번호를 훔칠 수 없게. 안정성 = A의 버그가 B를 망가뜨릴 수 없게.
- **prevent direct communication**: A 프로세스가 B의 메모리에 직접 쓰거나 읽는 것을 OS 차원에서 금지. 가상 메모리로 분리되어 있기 때문에 시도조차 안 됩니다 (잘못된 주소 접근으로 SEGFAULT).
- **strictly mediated and controlled**: OS가 중간에서 모든 통신을 검사·중재. "이건 허락된 통신이니 통과", "저건 금지된 영역이니 차단".
- **inter-process communication (IPC)**: 파이프, 소켓, 공유 메모리, 메시지 큐 등의 형태. 모두 OS가 제공하는 시스템 콜을 거칩니다.

---

**종합**

만약 IPC가 없고 직접 통신만 가능하다면:

- A 프로세스가 B의 메모리를 직접 읽기 → 비밀번호 평문 노출 위험.
- A의 잘못된 포인터 쓰기가 B의 변수 영역 침범 → B 크래시.

OS는 격리 + IPC 조합으로 두 가지 목표를 동시에 달성합니다:

- 격리로 직접 침입 차단.
- IPC로 합법적 통신만 허용.

JS 개발자가 매일 마주하는 IPC 사례:

- 터미널 파이프 `ls | grep .md`: `ls` 프로세스의 stdout이 OS 커널의 파이프 버퍼를 거쳐 `grep` 프로세스의 stdin으로 전달됩니다. 두 프로세스가 직접 메모리를 공유하지 않고, OS가 중간에서 데이터를 옮겨줍니다.
- Node.js `child_process.fork()` + `process.send()`: 부모-자식 프로세스가 메시지로 통신. 이게 IPC.
- Chrome 탭 프로세스와 메인 프로세스 간 통신도 OS의 IPC 메커니즘을 사용합니다. 한 탭이 죽어도 메인이 무사한 이유의 절반은 격리, 절반은 통제된 IPC 덕분.

오개념 예방: IPC와 스레드 통신은 다릅니다. 스레드는 같은 프로세스 안에 있으니 메모리를 그냥 공유합니다 (락이나 atomic 같은 동기화는 필요해도 OS 중재는 불필요). IPC는 별개 프로세스 간이라 OS를 반드시 거쳐야 합니다 — 그래서 일반적으로 스레드 간 통신보다 비용이 높습니다. "IPC가 항상 빠르겠지"가 아니라 "IPC는 안전하지만 약간의 오버헤드가 있다"가 정확한 이해입니다.
