# OS 커널은 실행 중인 모든 프로세스의 PCB를 어디에 모아서 관리하는가?

> An operating system kernel stores PCBs in a process table.

---

**도입**

PCB가 프로세스 1개당 하나씩 만들어진다면, 시스템에 100개 프로세스가 있으면 PCB도 100개. 이걸 어떻게 모아서 관리할까요? OS는 PCB들을 한 자료구조에 모아두고 인덱스처럼 활용합니다. 그게 process table — `ps`나 `top`이 출력하는 그 목록의 원본.

---

**본문**

> An operating system kernel stores PCBs in a process table.

OS 커널은 PCB들을 프로세스 테이블에 저장한다.

- **operating system kernel**: OS의 핵심 영역. 사용자 프로그램이 접근 못 하는 보호 영역에서 동작.
- **stores**: 단순히 한 곳에 두는 것이 아니라, 조회·삽입·삭제가 효율적이도록 보관.
- **process table**: 모든 PCB를 모아두는 컨테이너 자료구조. 보통 배열 + 해시맵, 또는 연결 리스트 형태.

---

**종합**

process table의 역할을 한 줄로: "OS가 시스템에 어떤 프로세스가 살아 있는지 한눈에 보는 인덱스".

JS 비유로 풀면: `Map<PID, PCB>`처럼 생각하면 직관적입니다. PID를 키로, PCB를 값으로 하는 맵. 스케줄러가 "다음에 어느 프로세스 돌릴까?"를 결정할 때, 부모 프로세스가 자식의 상태를 조회할 때, 시그널(`kill -9 1234`)을 보낼 때 — 모두 process table을 거칩니다.

`ps aux` / Task Manager의 정체: 이 명령들이 출력하는 프로세스 목록의 본질이 process table을 읽은 결과입니다. 리눅스의 `/proc` 파일시스템도 마찬가지 — `/proc/1234/status` 같은 파일은 PID 1234 프로세스의 PCB 일부를 읽기 좋은 텍스트로 노출한 것.

Node.js와의 연결: `process.pid`가 반환하는 정수가 process table에서 이 프로세스를 찾는 키. `child_process.spawn()`으로 자식 프로세스를 띄우면, OS가 새 PCB를 만들어 process table에 등록하고, 그 PID를 부모(Node.js)에게 돌려줍니다.

이게 없으면 어떻게 되는가: process table이 없다면 "지금 시스템에 어떤 프로세스가 있는지" 조회할 방법이 없어집니다. 스케줄러는 다음 프로세스를 찾을 수 없고, `kill` 명령은 대상을 식별 못 하고, `ps`도 동작 안 함. 그냥 PCB만 메모리 어딘가에 흩어져 있으면 OS는 그것들을 통제할 수 없습니다. 프로세스 관리의 인덱스 = process table.

오개념 예방: "process table = 단순 배열"이라고 생각하면 큰 시스템에서 비효율적입니다. 현대 OS는 PID로 빠르게 찾을 해시 구조 + 부모/자식 관계를 따라갈 트리 구조 + 상태별(ready/waiting) 큐 구조를 함께 사용합니다. 한 자료구조가 아니라 여러 인덱스의 조합으로 PCB를 관리.

AI Annotation 보충: 리눅스에서 `ps aux`의 결과 한 줄 한 줄이 process table 한 항목 ≈ PCB 하나. 사용자가 직접 PCB를 못 봐도, `/proc/<pid>/`를 읽으면 PCB의 거의 모든 필드(상태, 메모리 사용량, 열린 파일 디스크립터, 환경 변수 등)를 텍스트로 확인 가능.
