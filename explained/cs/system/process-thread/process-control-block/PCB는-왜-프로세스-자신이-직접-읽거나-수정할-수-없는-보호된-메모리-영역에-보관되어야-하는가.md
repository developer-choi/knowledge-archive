# PCB는 왜 프로세스 자신이 직접 읽거나 수정할 수 없는 보호된 메모리 영역에 보관되어야 하는가?

> PCB must be kept in an area of memory protected from normal process access.
> In some operating systems the PCB is placed at the bottom of the process stack.

---

**도입**

PCB에는 PID, 권한, 메모리 한계, 스케줄링 우선순위 등이 들어 있습니다. 만약 프로세스가 자기 PCB를 직접 수정할 수 있다면? "내 권한을 root로 올리자", "내 우선순위를 최고로 하자" — OS의 모든 통제가 무너집니다. 그래서 PCB는 보호된 메모리에 둡니다.

---

**본문**

> PCB must be kept in an area of memory protected from normal process access.

PCB는 일반 프로세스 접근으로부터 보호된 메모리 영역에 보관되어야 한다.

- **must be kept**: 강한 의무. 선택이 아니라 보안상 강제 사항.
- **area of memory protected**: 보호된 메모리 영역. 보통 커널 영역(kernel space). 사용자 프로세스가 읽기/쓰기를 시도하면 OS가 거부하고 보통 SIGSEGV 같은 신호를 보냅니다.
- **normal process access**: 일반 사용자 프로세스의 접근. 커널 자체나 권한 있는 시스템 콜은 예외.

> In some operating systems the PCB is placed at the bottom of the process stack.

일부 OS에서는 PCB가 프로세스 스택의 맨 아래에 배치된다.

- **placed at the bottom of the process stack**: 스택의 맨 아래. 스택은 위에서 아래로 자라거나 그 반대인데, "맨 아래"는 일반 사용자 코드가 정상 사용 시 절대 도달 못 할 위치.
- 스택 오버플로우가 일어나야 PCB 영역에 닿을 정도. 정상적인 함수 호출로는 결코 닿지 않습니다.

---

**종합**

PCB가 보호되어야 하는 보안 위협을 구체적으로:

| 위협 | 시나리오 | 결과 |
|---|---|---|
| PID 변조 | 자기 PID를 다른 값으로 위장 | 프로세스 추적 불가, 로깅 우회 |
| Process Privilege 상승 | 권한 비트를 root/admin으로 변경 | OS 전체 탈취 |
| 우선순위 조작 | 자기 스케줄링 우선순위를 최대로 | CPU 독점, 다른 프로세스 starvation |
| 메모리 한계 변경 | Memory Limit을 무한으로 | 시스템 메모리 점유 |
| 부모 PID 위장 | 부모 프로세스 ID를 init으로 변경 | 종료 추적·시그널 흐름 교란 |

JS/Node.js와의 연결: 사용자가 `process.pid = 1`처럼 PID를 바꿀 수 없는 게 이 보호 메커니즘의 결과입니다. JS에서 `process.xxx`를 통해 보이는 값은 사실 PCB의 사본(또는 커널이 내려준 일부)이라 수정해봐야 OS의 진짜 PCB는 변하지 않습니다. 권한이 있는 일부 변경(예: `process.chdir()`)은 시스템 콜을 통해 커널에게 부탁하는 형태로만 가능 — 직접 수정이 아니라.

권한 분리 구조:

```
┌────────────────────────────────┐
│       사용자 공간 (user)         │
│   - JS 코드, 변수, 객체           │
│   - process.pid (사본)           │
└──────────────┬─────────────────┘
               │ 시스템 콜 (보호 게이트)
┌──────────────▼─────────────────┐
│       커널 공간 (kernel)         │
│   - PCB (진짜 본체)              │
│   - process table               │
│   - 메모리 관리, 스케줄러          │
└────────────────────────────────┘
```

스택 맨 아래에 두는 이유: 메모리 레이아웃상 PCB를 스택 끝에 두면 (1) 사용자 코드가 정상 실행으로는 닿을 수 없고, (2) 스택 오버플로우가 발생하면 즉시 감지 가능. 일종의 "방어선 + 경보장치" 역할.

이게 없으면 어떻게 되는가 — PCB 보호가 없다면: 프로세스 격리·보안·권한 시스템이 통째로 무너집니다. 악성 사용자 프로세스가 자기 권한을 root로 올리면 OS는 "이 프로세스는 root 권한이 있다"고 믿고 모든 자원을 허용. 멀티유저 시스템·컨테이너·샌드박스 모두 PCB 보호 위에 세워진 추상화.

오개념 예방: "사용자가 `process.pid`를 보니 PCB를 본 것 아닌가?"는 부분적으로만 맞습니다. JS가 보는 건 PCB의 일부 필드의 사본 또는 시스템 콜로 가져온 값이지, PCB 메모리 자체에 직접 접근하는 게 아닙니다. 읽기는 시스템 콜로 허용, 쓰기는 거의 불가능 또는 매우 제한된 시스템 콜로만.

AI Annotation 보충: 컨테이너 보안(Docker), 샌드박스(Chrome 탭), 세분화된 권한(SELinux)도 결국 PCB(또는 그에 준하는 커널 자료구조)에 신뢰성 있는 권한 정보가 박혀 있고, 그것을 사용자 프로세스가 못 건드린다는 가정 위에서 작동. PCB 보호는 현대 컴퓨팅 보안의 가장 밑단 토대.
