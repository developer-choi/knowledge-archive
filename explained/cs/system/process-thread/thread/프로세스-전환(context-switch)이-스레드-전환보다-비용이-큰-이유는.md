# 프로세스 전환(context switch)이 스레드 전환보다 비용이 큰 이유는?

> A process is a heavyweight unit of kernel scheduling, as creating, destroying, and switching processes is relatively expensive.
> Processes are typically preemptively multitasked, and process switching is relatively expensive, beyond basic cost of context switching, due to issues such as cache flushing (in particular, process switching changes virtual memory addressing, causing invalidation and thus flushing of an untagged translation lookaside buffer (TLB), notably on x86).

---

**도입**

스레드 전환과 프로세스 전환 모두 컨텍스트 스위치 — 레지스터 저장/복원이라는 기본 비용은 같습니다. 그런데도 프로세스 전환이 훨씬 비싸다는데, 그 추가 비용은 어디서 나올까요? 답은 한 단어 — 주소 공간이 바뀌기 때문.

---

**본문**

> A process is a heavyweight unit of kernel scheduling,

프로세스는 커널 스케줄링의 무거운(heavyweight) 단위다.

- **heavyweight**: 메모리 맵·파일 디스크립터 테이블·권한 등 통째로 묶인 자원의 단위. 스레드가 lightweight unit으로 불리는 것과 대조.
- **kernel scheduling**: OS 커널이 직접 관리·전환하는 단위. 사용자 공간의 작업과 다름.

> as creating, destroying, and switching processes is relatively expensive.

프로세스를 생성·파괴·전환하는 비용이 비교적 비싸기 때문이다.

- **creating, destroying, and switching**: 세 가지 모두 비쌉니다. 생성은 PCB·주소 공간·파일 테이블 신규 할당, 파괴는 그 회수, 전환은 아래 설명할 캐시 플러시.

> Processes are typically preemptively multitasked,

프로세스는 보통 선점적으로 멀티태스킹된다.

- **preemptively multitasked**: OS가 프로세스의 동의 없이 강제로 CPU를 회수해 다른 프로세스에 줌. 협력적 방식이 아니라는 점이 현대 OS의 표준.

> and process switching is relatively expensive, beyond basic cost of context switching,

프로세스 전환은 컨텍스트 스위치의 기본 비용을 넘어서 비교적 비싸다.

- **beyond basic cost of context switching**: 레지스터 저장/복원이라는 기본 작업은 스레드 전환에서도 똑같이 발생. 프로세스 전환에는 그것을 넘어서는 추가 비용이 붙는다는 뜻.

> due to issues such as cache flushing (in particular, process switching changes virtual memory addressing, causing invalidation and thus flushing of an untagged translation lookaside buffer (TLB), notably on x86).

캐시 플러시 같은 문제 때문이다(특히, 프로세스 전환은 가상 메모리 주소 매핑을 바꿔 untagged TLB의 무효화·플러시를 유발하며, 특히 x86에서 그렇다).

- **cache flushing**: 캐시에 들어 있던 내용을 비우는 작업. 다음 프로세스는 cold cache에서 시작해야 하니 메모리 접근이 느려집니다.
- **changes virtual memory addressing**: 프로세스마다 자기만의 가상 주소 공간을 가지므로, 전환 시 매핑이 통째로 바뀝니다.
- **TLB invalidation/flushing**: TLB는 가상 → 물리 주소 변환을 캐시한 하드웨어. 매핑이 바뀌면 기존 TLB 엔트리는 의미가 없어져 전부 무효화해야 합니다.
- **untagged TLB**: 프로세스 ID 태그가 없는 TLB. 어느 프로세스의 매핑인지 구분 못 하니 전환 시 통째로 비워야 함. 태그된 TLB(ARM 등)는 일부 회피 가능.
- **notably on x86**: x86 CPU는 전통적으로 untagged TLB여서 이 비용이 더 두드러집니다.

---

**종합**

비용 구성을 분해하면:

| 비용 항목 | 스레드 전환 | 프로세스 전환 |
|---|---|---|
| 레지스터 저장/복원 | 발생 | 발생 |
| 스택 포인터 전환 | 발생 | 발생 |
| 가상 메모리 매핑 변경 | **없음** | **있음** |
| TLB 플러시 | **없음** | **있음** |
| CPU 캐시 무효 | 거의 없음 | **사실상 cold start** |

집/방 비유: 스레드 전환은 같은 집의 방을 옮기는 것 — 가구·주소·길 다 그대로. 프로세스 전환은 이사하는 것 — 새 동네 길을 다시 외워야 하고(TLB), 짐을 새로 풀어야 하고(캐시), 우편함을 새로 등록해야 합니다(파일 디스크립터).

JS 비유: Chrome이 탭마다 별도 프로세스를 띄우는 건 안전성(한 탭 크래시가 다른 탭에 영향 없음)을 위해서지만, 그 대가가 바로 이 컨텍스트 스위치 비용입니다. 탭 간 전환 시 OS가 프로세스를 갈아끼우니 캐시·TLB가 무효화되죠. 그래서 Chrome은 메모리·CPU를 많이 먹는 대신 안전한 격리를 얻은 셈.

이게 없으면 어떻게 되는가: 만약 OS가 프로세스 전환에서 TLB 플러시를 안 한다면, 새 프로세스가 이전 프로세스의 메모리를 잘못된 주소 변환으로 읽어 데이터 누설·크래시·보안 침해가 일어납니다. 비싸지만 필수 비용.

오개념 예방: "스레드는 가벼우니 무조건 좋다"는 부정확. 스레드 전환은 캐시는 살아 있어도 race condition 같은 동기화 비용이 새로 생깁니다. 가벼움(전환 비용)과 안전(격리·동기화)은 다른 차원의 트레이드오프.

AI Annotation 보충: TLB는 RAM보다 훨씬 빠른 하드웨어 캐시인데, 프로세스 전환 한 번에 전부 무효화되면 새 프로세스가 처음 몇 천 번의 메모리 접근에서 모두 풀 페이지 워크(가상 → 물리 변환을 페이지 테이블 따라 직접 계산)를 해야 합니다. 이게 "느림"의 정체.
