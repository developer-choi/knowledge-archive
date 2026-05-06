# 터미널에서 `cd`를 실행하면 변경된 현재 디렉토리 경로는 OS가 어디에 보관하는가?

> The current working directory of a process is one of the properties that the kernel stores in the process's PCB.

---

**도입**

터미널에서 `cd /home/user`를 실행한 뒤 `ls`를 치면 그 디렉토리의 파일 목록이 나옵니다. "지금 어느 디렉토리에 있는지"라는 정보는 어딘가에 저장되어 있을 텐데, 그 자리가 바로 PCB. 프로세스마다 따로 가지는 속성이라 셸 A에서 cd해도 셸 B의 현재 디렉토리는 변하지 않는 이유가 여기 있습니다.

---

**본문**

> The current working directory of a process is one of the properties that the kernel stores in the process's PCB.

프로세스의 현재 작업 디렉토리는, 커널이 그 프로세스의 PCB에 저장하는 속성 중 하나다.

- **current working directory (CWD)**: 프로세스가 현재 작업 중이라고 보는 디렉토리. 상대 경로 해석의 기준점.
- **one of the properties**: 여러 PCB 속성 중 하나. PID·메모리 한계·열린 파일 등과 같은 위계.
- **stores in the process's PCB**: 그 프로세스의 PCB에. 다른 프로세스의 PCB와는 격리되어 있어, 프로세스마다 자기만의 CWD를 가짐.

---

**종합**

CWD가 PCB에 저장된다는 사실의 실질적 함의:

- **상대 경로의 기준점**: `fs.readFile('config.json')`처럼 상대 경로로 파일을 열면, OS는 그 프로세스의 PCB에서 CWD를 읽어 절대 경로로 변환합니다. 즉 같은 코드를 다른 디렉토리에서 실행하면 다른 파일을 엽니다.
- **프로세스마다 독립**: 셸 A에서 `cd /tmp`를 해도 셸 B의 CWD는 변하지 않습니다. 각 셸 프로세스가 자기 PCB를 가지니까.
- **자식 프로세스로 상속**: 새 프로세스를 띄우면 부모의 CWD가 기본값으로 복사됨. 그래서 셸에서 띄운 프로그램이 셸과 같은 CWD를 가집니다.

JS/Node.js로 매핑:

```js
process.cwd();          // 현재 프로세스 PCB의 CWD를 읽어옴
process.chdir('/tmp');  // 시스템 콜을 통해 PCB의 CWD를 변경

fs.readFileSync('a.txt'); // 상대경로 → CWD + 'a.txt' 절대경로로 해석
```

`process.cwd()`가 반환하는 문자열이 사실상 PCB에 저장된 그 값. `process.chdir()`은 chdir 시스템 콜을 호출해 커널에게 "내 PCB의 CWD를 이걸로 바꿔줘"라고 부탁하는 셈.

`cd`의 정체:

| 무엇 | 어떻게 |
|---|---|
| `cd`는 외부 프로그램이 아닌 셸 빌트인 | 셸 자기 자신의 CWD를 바꿔야 하니, 자식 프로세스가 아닌 셸 안에서 처리해야 함 |
| 자식 프로세스가 `cd` 했다면 | 그 자식의 CWD만 바뀌고 셸은 그대로 — 셸이 종료되면 자식도 사라지니 변경 효과 없음 |

이 메커니즘 때문에 `cd`는 다른 명령(`ls`, `cp`)과 달리 셸 빌트인으로 구현되어 있습니다. 단순히 "어느 위치로 이동"이 아니라 "이 셸 프로세스의 PCB CWD를 바꾸라"는 동작.

스크립트 안에서 `cd`의 함정: 셸 스크립트(`script.sh`) 안에서 `cd /tmp` 했더라도, 스크립트가 끝나면 부모 셸의 CWD는 안 바뀝니다. 스크립트는 자식 프로세스로 실행되니 자기 PCB만 변경하고 종료, 부모 PCB는 그대로. 이 덕분에 `bash script.sh` 후에도 원래 디렉토리에 그대로 있을 수 있는 것.

이게 없으면 어떻게 되는가 — CWD가 PCB에 없다면: 모든 파일 접근은 절대 경로로만 해야 합니다. `fs.readFile('config.json')`이 안 되고 `fs.readFile('/home/user/project/config.json')`처럼 매번 풀 경로. 더 큰 문제는 한 시스템에 한 CWD만 있으면 셸 여러 개 동시 사용이 불가능 — 한 셸에서 cd하면 다른 셸도 같이 옮겨가는 비정상 동작.

오개념 예방: "CWD는 환경변수 같은 거 아닌가"는 비슷하지만 다릅니다. 환경변수는 PCB의 별도 영역(environment block)에 저장되고 자식에게 복사되는 건 비슷하지만, CWD는 단일 문자열이고 시스템 콜(`chdir`)로만 변경 가능한 별개 필드. PWD라는 환경변수도 있지만 그건 셸이 사용자 편의를 위해 따로 관리하는 사본이고, 진짜 CWD는 PCB에 있습니다.

AI Annotation 보충: `process.cwd()`가 반환하는 값과 `process.env.PWD`는 보통 같지만, 같은 게 아닙니다. PWD는 셸이 자기 환경변수에 자주 갱신하는 사본이고, `process.cwd()`는 커널 PCB의 진짜 CWD. 셸을 거치지 않고 띄운 프로세스에서는 PWD가 부정확할 수 있어요.
