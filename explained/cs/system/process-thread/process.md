# 프로세스란 무엇이며, 프로그램과 어떻게 다른가?

## 도입

프로세스와 프로그램은 이름이 비슷해서 혼용하기 쉽지만, OS 레벨에서는 완전히 다른 개념이다. 프로그램은 디스크에 저장된 정적 파일이고, 프로세스는 그 파일을 메모리에 올려 실제로 실행 중인 상태다. 둘의 관계는 OOP의 클래스와 인스턴스 관계와 같다.

---

## 본문

> In computing, a process is the instance of a computer program that is being executed by one or many threads.

"프로세스는 하나 혹은 여러 스레드에 의해 실행되고 있는 컴퓨터 프로그램의 인스턴스다."

- **instance**: OOP의 인스턴스와 같은 의미. 클래스로부터 메모리에 실체화된 객체처럼, 프로세스는 프로그램 파일로부터 메모리에 실체화된 실행 단위다. 같은 프로그램(예: Chrome)을 두 번 실행하면 인스턴스가 두 개 생긴다.
- **being executed**: 실행 중인 상태를 강조. 디스크에 있는 파일과 달리, 프로세스는 CPU가 실제로 명령어를 처리하고 있는 것이다.

> While a computer program is typically stored in a file on disk, a process is the execution of those instructions after being loaded from the disk into memory.

"프로그램은 보통 디스크의 파일로 저장되어 있고, 프로세스는 그 파일이 메모리에 로드된 후 명령어들이 실행되는 것이다."

- **stored in a file on disk**: 프로그램은 수동적(passive) 존재다. `app.js`, `chrome.exe` 같은 파일 — CPU가 직접 읽지 못하고, OS나 런타임이 메모리에 올려줘야 한다.
- **loaded from the disk into memory**: 실행의 첫 단계. `node app.js`를 터미널에 치는 순간 OS가 `app.js`를 RAM에 올리고 프로세스를 생성한다.

**JS/Node.js 비유:**
- **프로그램** = `app.js` 파일. 디스크에 가만히 있다. 아무것도 하지 않는다.
- **프로세스** = `node app.js` 명령으로 OS가 만든 실행 단위. RAM 공간을 할당받고, CPU 시간을 받아 코드를 실행한다.

같은 `app.js`를 두 터미널에서 동시에 실행하면 두 개의 독립적인 프로세스가 생긴다. 이것이 "하나의 프로그램, 여러 프로세스"다.

User Annotation이 짚듯, 프로세스는 "잡(job)"이라는 단어로도 불린다. 잡 스케줄링 = 프로세스 스케줄링이다.

---

## 종합

프로그램은 명령어의 집합이 디스크에 저장된 정적 파일이고, 프로세스는 그것이 메모리에 올라와 실제로 실행 중인 동적 단위다. Windows Task Manager(작업 관리자)에서 보이는 항목들이 바로 프로세스다 — Chrome.exe, node.exe 각각이 살아있는 인스턴스다.

```
디스크 (정적)              RAM (실행 중, 동적)
app.js ──────────────→  프로세스 A (node app.js, PID 1234)
(프로그램)               프로세스 B (node app.js, PID 1235)
chrome.exe ──────────→  프로세스 C (chrome.exe, PID 5678)
```

---

---

# 프로세스는 무엇으로 구성되는가?

## 도입

프로세스가 실행되려면 단순히 코드만 있으면 안 된다. 코드를 실행하기 위한 메모리, 파일 접근 권한, OS와 소통하기 위한 자료구조까지 한 묶음으로 갖춰야 한다. OA는 이 묶음을 핵심 정의 한 문장과 5가지 구성 요소 목록으로 정리한다.

---

## 본문

> A process comprises the program code, assigned system resources, physical and logical access permissions, and data structures to initiate, control and coordinate execution activity.

"프로세스는 프로그램 코드, 할당된 시스템 자원, 물리적·논리적 접근 권한, 그리고 실행 활동을 시작·제어·조율하기 위한 자료구조로 구성된다."

- **comprises**: "포함한다"가 아니라 "구성된다" — 이 네 가지가 프로세스 전체를 이룬다는 뜻이다.
- **assigned system resources**: OS가 프로세스에게 "배정한" 자원. 프로세스가 마음대로 가져가는 게 아니라 OS가 허가해준 것이다.
- **data structures to initiate, control and coordinate**: PCB(프로세스 제어 블록)를 가리킨다. 시작(initiate)할 때 초기값 저장, 실행 중 제어(control), 스케줄링 조율(coordinate)을 담당한다.

> A process is a unit of resources, while a thread is a unit of scheduling and execution.

"프로세스는 자원의 단위이고, 스레드는 스케줄링과 실행의 단위다."

이 한 문장이 프로세스와 스레드의 역할 분리를 가장 명확하게 정의한다. 프로세스가 메모리·파일 핸들 등을 확보하면, 스레드가 그 위에서 코드를 한 줄씩 실행한다.

---

**5가지 구성 요소:**

> An image of the executable machine code associated with a program.

"프로그램과 연관된 실행 가능한 기계어 코드의 이미지."

- **image**: 디스크의 코드를 메모리에 복사한 것. `app.js`가 V8에 의해 JIT 컴파일되어 기계어로 변환된 코드가 메모리에 올라간 상태.

> Memory (typically some region of virtual memory); which includes the executable code, process-specific data (input and output), a call stack (to keep track of active subroutines and/or other events), and a heap to hold intermediate computation data generated during run time.

"메모리(보통 가상 메모리의 일정 영역); 여기에는 실행 코드, 프로세스별 데이터(입출력), 활성 서브루틴을 추적하는 콜 스택, 런타임에 생성되는 중간 계산 데이터를 보관하는 힙이 포함된다."

- **virtual memory**: 물리 RAM과 1:1 대응이 아닌 논리적 주소 공간. 각 프로세스는 자신이 메모리 전체를 독점한 것처럼 착각한다.
- **call stack**: 함수 호출 추적. JS 개발자가 에러 스택 트레이스에서 보는 바로 그것.
- **heap**: 동적 할당 영역. JS에서 `new Object()`, 배열, 클로저 등이 여기에 쌓인다.

> Operating system descriptors of resources that are allocated to the process, such as file descriptors (Unix terminology) or handles (Windows), and data sources and sinks.

"파일 디스크립터(Unix) 또는 핸들(Windows) 같은, OS가 프로세스에 할당한 자원 식별자와 데이터 소스·싱크."

- **file descriptors**: `fs.readFile()`을 호출하면 OS가 파일을 열고 번호를 부여한다. 이 번호가 파일 디스크립터. stdin(0), stdout(1), stderr(2)가 기본으로 열려있다.

> Security attributes, such as the process owner and the process' set of permissions (allowable operations).

"프로세스 소유자, 허용 연산 집합 같은 보안 속성."

- **process owner**: 누가 이 프로세스를 실행했는가. `app.js`가 `/etc/passwd`를 읽을 수 있는지 없는지는 이 소유자 정보로 결정된다.

> Processor state (context), such as the content of registers and physical memory addressing.

"레지스터 내용, 물리 메모리 주소 등 프로세서 상태(컨텍스트)."

- **Processor state**: CPU가 이 프로세스를 실행하다가 다른 프로세스로 전환될 때 저장해야 하는 "작업 진행 상태". 이걸 저장·복구하는 것이 컨텍스트 스위치다.

---

## 종합

프로세스는 단순히 코드를 실행하는 것이 아니라, 실행에 필요한 모든 자원의 묶음이다. `node app.js`를 치는 순간 OS가 만드는 것들을 시각화하면:

```
프로세스 (node app.js, PID 1234)
├── 기계어 코드 이미지 (V8이 컴파일한 app.js)
├── 메모리
│   ├── 텍스트 영역   실행 기계어 (읽기 전용)
│   ├── 데이터 영역   전역변수 (let count = 0 등)
│   ├── 스택          콜 스택, 지역변수
│   └── 힙            객체/배열/클로저 동적 할당
├── OS 자원 식별자
│   ├── stdin (fd 0), stdout (fd 1), stderr (fd 2)
│   └── 열린 파일 핸들들
├── 보안 속성
│   └── 소유자 UID, 허용 권한
└── 자료구조 (PCB)
    ├── initiate  PID, Program Counter 초기값, 권한 등
    ├── control   CPU 레지스터(CPU 칩) → PCB(RAM) 백업
    └── coordinate 스케줄링 우선순위, 상태
```

AI Annotation이 짚듯, Docker 컨테이너나 VM도 결국 호스트 OS의 프로세스 위에서 돈다. "프로세스 = 자원의 단위"라는 정의는 시스템 소프트웨어 전반에 걸쳐 일관되게 적용된다.

---

---

# [UNVERIFIED] 프로세스를 처음 만들 때, OS는 자료구조에 무엇을 저장해야 하나요?

## 도입

`node app.js`를 입력하는 순간 OS는 프로세스를 생성하고 즉시 PCB(프로세스 제어 블록)라는 자료구조를 만든다. PCB가 없으면 OS는 이 프로세스의 존재 자체를 알 수 없다. "처음 만드는 순간"에 OS가 PCB에 기록해야 하는 것들은 아래와 같다.

---

## 본문

**PID (Process ID)**

OS는 동시에 수십~수백 개의 프로세스를 관리한다. 각 프로세스를 구분하려면 고유 번호가 필요하다. Task Manager에서 각 행에 표시되는 숫자가 PID다. PID가 없으면 OS가 "Chrome을 종료해" 같은 명령을 어느 프로세스에게 전달해야 할지 알 수 없다.

**Program Counter 초기값**

V8이 `app.js`를 컴파일한 기계어의 첫 번째 명령어 주소. CPU에게 "여기서부터 실행해"를 알려주는 포인터다. 이 값이 없으면 OS가 CPU를 처음 줄 때 어디서 시작할지 몰라 프로세스를 띄울 수 없다.

**메모리 한도와 할당된 주소 범위**

`node app.js` 하나가 RAM 전체를 먹어버리지 못하도록 한도를 설정한다. 또한 이 프로세스에게 배정된 가상 메모리 범위를 기록해두어야, 나중에 CPU가 메모리를 읽을 때 다른 프로세스 영역을 침범하지 않는다.

**부모 PID**

셸에서 `node app.js`를 실행했다면 셸 프로세스가 부모다. 자식 프로세스가 종료됐을 때 부모에게 알려야 하므로(exit signal), 부모의 PID를 기록해둔다.

**권한 정보**

이 프로세스가 어떤 파일·소켓·시스템 콜에 접근할 수 있는지. `app.js`가 `/etc/passwd`를 읽을 수 있는지는 이 권한 정보로 결정된다.

---

## 종합

"이 프로세스가 누구고(PID), 어디서 시작하고(Program Counter 초기값), 얼마나 쓸 수 있고(메모리 한도), 누가 낳았고(부모 PID), 뭘 할 수 있는지(권한)"를 생성 시점에 PCB에 기록한다. 이 정보가 없으면 OS는 프로세스를 생성하자마자 어떻게 실행해야 할지, 어떤 권한으로 동작해야 할지, 종료 시 누구에게 알려야 할지 알 수 없다.

---

---

# [UNVERIFIED] 프로세스 실행 중 컨텍스트 스위치가 발생할 때, OS는 자료구조에 무엇을 저장해야 하나요?

## 도입

컨텍스트 스위치는 CPU가 프로세스 A를 실행하다가 프로세스 B로 전환하는 것이다. 이때 나중에 A를 재개하려면 "A가 어디까지 했는지"를 반드시 어딘가에 저장해두어야 한다. 그 저장소가 PCB다.

---

## 본문

**Program Counter (현재 실행 지점)**

`for (let i = 0; i < 100000000; i++)` 루프를 돌다 컨텍스트 스위치가 발생하면, 중단된 시점의 명령어 주소를 PCB에 저장한다. 이게 없으면 재개 시 루프가 처음부터 다시 시작되거나, 엉뚱한 주소에서 재개된다.

**CPU 레지스터 상태 전체**

CPU에는 범용 레지스터(rax, rbx 등), 스택 포인터, 플래그 레지스터 등이 있다. 예를 들어 `i = 42571819`까지 진행한 상태에서 중단됐을 때, `i`의 현재 값이 CPU 레지스터 어딘가에 들어있다. 이 전체 레지스터 스냅샷을 PCB에 저장해두지 않으면 재개 시 `i`가 날아가서 처음부터 다시 돈다.

**스택 포인터**

현재 콜 스택의 위치. 어떤 함수가 호출된 상태인지, 지역변수가 스택 어느 위치에 있는지를 나타낸다. 이게 없으면 재개 시 함수 호출 맥락을 잃는다.

---

## 종합

컨텍스트 스위치 시 OS는 "지금 CPU가 어디서 무엇을 하고 있었는지"의 스냅샷을 PCB에 저장하고 CPU를 다음 프로세스에게 준다. 나중에 이 프로세스의 차례가 다시 오면 PCB에서 스냅샷을 읽어 CPU 레지스터를 복원하고 중단 지점부터 재개한다. 이 저장-복원 사이클이 없으면 멀티태스킹 자체가 불가능하다.

---

---

# [UNVERIFIED] 여러 프로세스가 CPU를 동시에 원할 수 있는 상황에서, OS가 실행 순서를 정하려면 자료구조에 무엇을 저장해야 하나요?

## 도입

수십 개의 프로세스가 동시에 "내가 CPU를 써야 해"를 외치고 있다. OS 스케줄러는 누구를 먼저 실행할지 결정해야 하는데, 그러려면 각 프로세스의 상태와 우선순위 정보가 PCB에 저장되어 있어야 한다.

---

## 본문

**현재 프로세스 상태**

스케줄러는 `ready` 상태인 프로세스들 중에서만 다음 실행자를 고른다. `blocked` 상태(I/O 대기 중)인 프로세스는 선택 대상에서 제외된다. 따라서 각 프로세스가 지금 어떤 상태인지를 PCB에 기록해두지 않으면 스케줄러가 작동할 수 없다.

**스케줄링 우선순위**

프로세스마다 우선순위 값이 있다. OS가 높은 우선순위 프로세스를 먼저 실행하거나, Linux CFS(Completely Fair Scheduler)처럼 CPU를 가장 적게 받은 프로세스에게 먼저 줄 때 이 값을 참조한다.

**CPU 사용 시간 통계**

얼마나 오래 CPU를 썼는지 누적 기록. 공정 스케줄러는 이 값으로 "이 프로세스는 충분히 썼으니 다른 프로세스 차례"를 판단한다.

---

## 종합

OS 스케줄러가 실행 순서를 결정하려면 세 가지 정보가 필요하다: 지금 실행 가능한가(상태), 얼마나 중요한가(우선순위), 얼마나 이미 썼는가(CPU 사용 통계). 이 세 가지가 PCB에 없으면 스케줄러는 눈을 감고 임의로 선택하는 셈이다. 실제 Linux에서는 이 정보를 기반으로 CFS가 각 프로세스의 "가상 런타임"을 계산해 가장 적게 실행된 프로세스를 다음 실행자로 선택한다.

---

---

# 프로세스의 메모리 영역은 어떤 구성 요소를 포함하는가?

## 도입

프로세스가 사용하는 메모리는 단일한 덩어리가 아니라 역할별로 나뉜 영역들의 집합이다. 각 영역은 서로 다른 종류의 데이터를 담당한다. JS 개발자에게 익숙한 콜 스택과 힙이 바로 이 메모리 영역에서 온다.

---

## 본문

> Memory (typically some region of virtual memory); which includes the executable code, process-specific data (input and output), a call stack (to keep track of active subroutines and/or other events), and a heap to hold intermediate computation data generated during run time.

"메모리(보통 가상 메모리의 일정 영역); 여기에는 실행 가능한 코드, 프로세스별 데이터(입출력), 활성 서브루틴을 추적하는 콜 스택, 런타임에 생성된 중간 계산 데이터를 보관하는 힙이 포함된다."

**executable code (텍스트 영역)**

CPU가 실행하는 기계어 코드가 저장된 영역. `app.js`가 V8에 의해 컴파일된 기계어가 여기 들어간다. 읽기 전용으로 보호되어 있어 실행 중 코드 자체가 바뀌지 않는다.

**process-specific data (데이터 영역)**

전역 변수, 정적 변수가 저장되는 곳. `let count = 0`처럼 모듈 최상위에 선언된 변수가 여기 들어간다. 프로세스가 시작할 때 초기화되어 종료 시까지 존재한다.

**call stack (콜 스택)**

- **to keep track of active subroutines**: "활성 서브루틴(함수)을 추적하기 위해" — 재귀 호출이나 중첩 함수 호출에서 어느 함수가 어느 함수를 불렀는지 역순으로 추적할 수 있다.

함수가 호출될 때 스택 프레임(지역 변수, 반환 주소)이 쌓이고, 함수가 리턴되면 제거된다. Chrome DevTools에서 에러 발생 시 보이는 스택 트레이스가 바로 이것이다. 스택이 가득 차면 "Maximum call stack size exceeded" 에러가 난다.

**heap (힙)**

런타임에 동적으로 할당되는 데이터 영역. JS에서 `{}`, `[]`, `new Map()` 등으로 생성한 객체가 힙에 올라간다. 스택과 달리 크기가 유동적이고, GC(가비지 컬렉터)가 관리한다.

- **intermediate computation data generated during run time**: "런타임에 생성되는 중간 계산 데이터" — 컴파일 시점에 크기를 알 수 없는 데이터들이다.

---

## 종합

프로세스 메모리는 4가지 영역으로 구성된다:

```
프로세스 메모리 (가상 주소 공간)
├── 텍스트 영역   실행 기계어 코드 (읽기 전용)
├── 데이터 영역   전역·정적 변수 (프로세스 시작~종료)
├── 스택          콜 스택, 지역변수, 함수 반환 주소 (함수 호출 시 자동 관리)
└── 힙            동적 할당 객체/배열 (GC 관리)
```

JS 개발자라면 이미 이 구조를 매일 쓰고 있다. `function foo() { const x = 1 }` — `x`는 스택, `const obj = {}`의 `obj`가 가리키는 실제 객체는 힙이다. `node app.js`로 프로세스를 실행하는 순간 OS가 이 4개 영역을 모두 설정한다.

스택 오버플로우(Maximum call stack size exceeded)는 스택 영역이 꽉 차는 것이고, 메모리 누수는 힙에서 참조가 끊기지 않은 객체가 GC되지 않고 쌓이는 것이다.
