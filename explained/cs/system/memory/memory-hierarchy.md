# 메모리 계층 구조(Memory Hierarchy)란 무엇인가?

## 도입

빠른 메모리는 비싸고 용량이 작다. 느린 메모리는 싸고 용량이 크다. 이 트레이드오프를 해결하는 방법이 계층 구조다 — 빠르고 작은 것을 CPU 가까이에, 느리고 큰 것을 멀리에 배치하여 프로그램이 자주 쓰는 데이터는 빠른 쪽에서, 나머지는 느린 쪽에서 가져오게 한다.

---

## 본문

> The lower levels of the memory hierarchy tend to be slower, but larger.

"메모리 계층의 아래 레벨들은 더 느리지만, 더 큰 경향이 있다."

- **lower levels**: 계층 구조에서 CPU에서 더 멀리 있는 쪽. 레지스터·캐시가 상위, RAM·디스크가 하위.
- **tend to be**: 경향. 법칙이 아니라 실증적 패턴이다.

> A program will achieve greater performance if it uses memory while it is cached in the upper levels of the memory hierarchy and avoids bringing other data into the upper levels of the hierarchy that will displace data that will be used shortly in the future.

"프로그램은 메모리 계층의 상위 레벨에 캐시된 상태에서 메모리를 사용하고, 곧 사용될 데이터를 밀어낼 다른 데이터를 상위 레벨로 가져오는 것을 피하면 더 높은 성능을 달성할 수 있다."

- **displace**: "밀어내다". 캐시는 용량이 작아서, 새 데이터를 올리려면 기존 데이터를 내려야 한다. 곧 쓸 데이터를 밀어내면 다음에 그 데이터를 다시 가져오는 비용이 발생한다.

> Modern machines tend to read blocks of lower memory into the next level of the memory hierarchy. If this displaces used memory, the operating system tries to predict which data will be accessed least (or latest) and move it down the memory hierarchy.

"현대 기계들은 하위 메모리 블록을 다음 계층 레벨로 읽어들이는 경향이 있다. 이때 사용된 메모리가 밀려나면, OS는 어떤 데이터가 가장 적게(또는 가장 늦게) 접근될지 예측하여 메모리 계층 아래로 이동시키려 한다."

**AI Annotation:** Register → L1 → L2 → L3 → RAM → Disk → Remote 순으로 계층이 구성된다. 위로 갈수록 빠르고 작고 비싸며, 아래로 갈수록 느리고 크고 저렴하다.

```
메모리 계층 (위 = CPU에 가까움, 아래 = 멀리)
┌──────────────────────────────────────────────┐
│ Register     수십 B    ~0.3ns   CPU 칩 내부   │ ← 가장 빠름
│ L1 Cache     수십 KB   ~1ns     CPU 칩 내부   │
│ L2 Cache     수백 KB   ~5ns     CPU 칩 내부   │
│ L3 Cache     수 MB     ~20ns    CPU 칩 내부   │
│ RAM          GB~TB     ~60ns    메인보드       │
│ SSD/HDD      TB        ~0.1ms~  보조저장장치  │ ← 가장 느림
└──────────────────────────────────────────────┘
```

---

## 종합

Node.js 프로세스가 파일을 읽는 `fs.readFile()` 호출은 가장 아래 계층(디스크)에 닿는 연산이다. 반면 `const x = a + b` 같은 연산은 레지스터에서 처리된다. 두 연산의 속도 차이가 수백만 배에 이르는 것은 메모리 계층 차이 때문이다. 메모리 계층 구조가 없으면 모든 데이터를 단일 속도의 메모리에서 가져와야 하는데, 그것이 빠른 쪽(레지스터급)이라면 비용이 천문학적이 되고, 느린 쪽(디스크급)이라면 현대적인 CPU 성능을 발휘할 수 없다.

---

---

# Register란 무엇인가?

## 도입

레지스터는 메모리 계층에서 CPU 칩 안에 있는 가장 빠른 저장 위치다. CPU가 연산하는 동안 현재 처리 중인 값들을 임시로 담아두는 곳이다.

---

## 본문

> It is a type of memory in which data is stored and accepted that are immediately stored in the CPU.

"레지스터는 데이터가 저장되고 받아들여지며 CPU 안에 즉시 저장되는 메모리의 한 유형이다."

- **immediately stored in the CPU**: CPU 칩 내부에 직접 위치한다. 외부 버스를 거치지 않아서 접근 시간이 0.3~1ns 수준으로 모든 메모리 중 가장 빠르다.

> The most commonly used register is Accumulator, Program counter, Address Register, etc.

"가장 흔히 사용되는 레지스터는 누산기, 프로그램 카운터, 주소 레지스터 등이다."

- **Accumulator (AC)**: 산술·논리 연산의 중간 결과를 보관하는 레지스터.
- **Program Counter (PC)**: 다음에 실행할 명령어의 메모리 주소를 저장. 이게 없으면 CPU가 다음에 어떤 명령어를 실행해야 할지 모른다.

**JS 비유:** V8이 `let x = a + b`를 실행할 때 `a`와 `b`의 값을 실제로 더하는 순간에 레지스터를 사용한다. 개발자는 레지스터에 직접 접근하지 않지만, 모든 연산은 결국 레지스터를 통해 일어난다.

---

## 종합

레지스터는 너무 작아서(수십 바이트 수준) 데이터를 오래 보관할 수 없다. 연산이 끝나면 결과를 캐시나 RAM에 내려쓰고 레지스터는 다음 연산을 위해 비운다. 레지스터가 없다면 CPU는 모든 중간값을 RAM에서 읽고 써야 하는데, 이 지연이 누적되면 CPU가 초당 수십억 번의 명령어를 실행하는 것이 불가능해진다.

---

---

# Cache Memory란 무엇인가?

## 도입

레지스터와 RAM 사이에서 속도 차이를 완충하는 중간 계층이 캐시메모리다. CPU가 RAM에 직접 접근하기보다 훨씬 빠른 속도로 자주 쓰는 데이터에 접근할 수 있도록 한다.

---

## 본문

> It is the fastest memory that has faster access time where data is temporarily stored for faster access.

"더 빠른 접근을 위해 데이터가 임시로 저장되는, 더 빠른 접근 시간을 가진 가장 빠른 메모리다."

- **fastest memory**: 레지스터를 제외하면 가장 빠른 메모리다. L1 기준 ~1ns, RAM의 60배 이상 빠르다.
- **temporarily stored**: 임시 저장. 캐시는 RAM의 데이터를 복사해 두는 것이다. 원본은 RAM에 있고, 캐시는 최근 접근 데이터의 복사본을 유지한다.
- **for faster access**: 빠른 접근이 목적. 캐시에 없으면 RAM까지 가야 하는데, 그 비용을 아끼는 것이다.

---

## 종합

Chrome이 자주 방문하는 사이트의 리소스를 브라우저 캐시에 보관하는 것처럼, CPU 캐시도 "자주 쓰는 데이터를 빠른 곳에 임시 보관"하는 원리다. 캐시메모리가 없다면 모든 연산에서 RAM 접근 비용이 발생하고, CPU의 실제 처리 능력 대비 실효 성능은 수십 배 낮아진다.

---

---

# Main Memory란 무엇인가?

## 도입

CPU가 현재 실행 중인 프로그램의 코드와 데이터를 담고 있는 메모리가 주기억장치(Main Memory)다. 프로세스가 살아있는 동안 데이터를 올려두는 공간이다.

---

## 본문

> It is the memory on which the computer works currently.

"주기억장치는 컴퓨터가 현재 작동하는 메모리다."

- **works currently**: "현재 작동하는". 디스크처럼 데이터를 장기 보관하는 것이 아니라, 지금 이 순간 실행 중인 프로그램이 사용하는 작업 공간이다.

> It is small in size and once power is off data no longer stays in this memory.

"크기가 작고, 전원이 꺼지면 데이터가 더 이상 이 메모리에 남아있지 않는다."

- **small in size**: 디스크에 비해 상대적으로 작다. 현재 소비자용 PC의 RAM은 보통 8~64GB.
- **once power is off**: 휘발성(volatile). 전원이 꺼지면 모든 내용이 사라진다. RAM이 아니라 HDD에 코드를 저장하는 이유가 여기 있다.

**JS 비유:** `node app.js`를 실행하면 `app.js`의 코드와 실행 중 생성되는 변수들이 모두 RAM에 올라간다. 프로세스를 종료하면 그 내용은 사라진다.

---

## 종합

주기억장치는 "지금 실행 중인 것"과 "전원이 꺼지면 사라지는 것"이라는 두 속성으로 정의된다. Windows Task Manager에서 "메모리 사용량"으로 표시되는 것이 각 프로세스가 RAM에서 점유하는 공간이다. 메모리가 부족하면 OS가 RAM의 내용을 디스크(페이지 파일/swap)로 내보내는데, 이때 디스크 속도가 개입되어 성능이 급락한다.

---

---

# Secondary Memory란 무엇인가?

## 도입

주기억장치가 "지금 실행 중인 것"을 담는다면, 보조기억장치는 "지금 실행하지 않아도 오래 보관해야 할 것"을 담는다. 전원이 꺼져도 데이터가 남는 비휘발성이 핵심이다.

---

## 본문

> It is external memory that is not as fast as the main memory but data stays permanently in this memory.

"보조기억장치는 주기억장치만큼 빠르지 않지만 데이터가 이 메모리에 영구적으로 남아있는 외부 메모리다."

- **external memory**: CPU 내부가 아닌 외부에 위치한다. 메인보드에 꽂히거나 케이블로 연결된다.
- **not as fast as the main memory**: RAM보다 느리다. HDD는 수천 배, SSD도 수십 배 느리다. 하지만 같은 용량 대비 훨씬 저렴하다.
- **stays permanently**: 영구 보관. 전원이 꺼져도 데이터가 유지된다. 파일, 프로그램 설치본, 데이터베이스가 여기에 있다.

**User Annotation:** 영어로는 "Storage"라는 표현을 쓴다. "Memory"는 RAM을 가리키는 경우가 많아 혼동을 피하기 위해 보조기억장치에는 Storage를 선호한다.

---

## 종합

`app.js` 파일이 디스크(보조기억장치)에 있고, `node app.js`를 실행하면 OS가 그것을 RAM(주기억장치)에 복사해 프로세스를 만든다. 보조기억장치가 없으면 컴퓨터를 켤 때마다 모든 프로그램을 다시 로드할 방법이 없다. 그리고 실행 중인 데이터를 저장할 수도 없으니 데이터베이스도 로그도 파일 시스템도 존재할 수 없다.
