# 현대 OS(Linux, Windows, macOS)가 채택한 1:1 스레딩 모델이란 무엇인가?

> Threads created by the user in a 1:1 correspondence with schedulable entities in the kernel are the simplest possible threading implementation.
> OS/2 and Win32 used this approach from the start, while on Linux the GNU C Library implements this approach (via the NPTL or older LinuxThreads).
> This approach is also used by Solaris, NetBSD, FreeBSD, macOS, and iOS.

---

**도입**

스레딩 모델은 "사용자가 만든 스레드 N개를 커널 스레드 몇 개에 매핑할 것인가"의 문제입니다. 현대 주류 OS는 1:1 — 사용자가 스레드 1개 만들면 커널도 스레드 1개 만들어 1:1로 짝짓습니다. 단순하지만 멀티코어 활용이 자연스럽다는 큰 장점이 있습니다.

---

**본문**

> Threads created by the user in a 1:1 correspondence with schedulable entities in the kernel are the simplest possible threading implementation.

사용자가 만든 스레드와 커널의 스케줄 가능한 단위가 1:1로 대응되는 것이 가장 단순한 스레딩 구현이다.

- **created by the user**: 사용자 코드(애플리케이션)가 만든 스레드. 예: `pthread_create()`, `new Thread()`.
- **1:1 correspondence**: 사용자 스레드 1개당 커널 스레드 1개. 사용자가 보는 스레드와 OS가 보는 스레드가 정확히 같은 단위.
- **schedulable entities in the kernel**: 커널이 스케줄링 대상으로 인식하는 단위. 즉, OS가 CPU에 직접 올릴 수 있는 객체.
- **simplest possible threading implementation**: 가장 단순한 구현. 매핑 로직이 거의 없으니 런타임 스케줄러를 따로 만들 필요 없음.

> OS/2 and Win32 used this approach from the start,

OS/2와 Win32는 처음부터 이 방식을 사용했고,

- **from the start**: 초기 설계부터 1:1을 채택. Windows의 일관된 스레드 모델.

> while on Linux the GNU C Library implements this approach (via the NPTL or older LinuxThreads).

리눅스에서는 GNU C 라이브러리가 이 방식을 구현한다(NPTL 또는 더 오래된 LinuxThreads를 통해).

- **GNU C Library (glibc)**: 리눅스의 표준 C 라이브러리. `pthread_create()` 호출이 결국 glibc를 거쳐 커널의 `clone()` 시스템 콜로 이어집니다.
- **NPTL (Native POSIX Thread Library)**: 현대 리눅스의 표준 스레드 라이브러리. LinuxThreads의 후속.
- **LinuxThreads**: 초기 리눅스 스레드 구현. NPTL로 대체됨.

> This approach is also used by Solaris, NetBSD, FreeBSD, macOS, and iOS.

이 방식은 Solaris, NetBSD, FreeBSD, macOS, iOS에서도 사용된다.

- **Solaris, NetBSD, FreeBSD, macOS, and iOS**: 사실상 우리가 쓰는 모든 주요 OS. 1:1이 표준이라는 강력한 증거.

---

**종합**

세 가지 스레딩 모델을 한눈에:

| 모델 | 매핑 | 멀티코어 활용 | 전환 비용 | 예시 |
|---|---|---|---|---|
| 1:1 | 유저 1 ↔ 커널 1 | 자연스럽게 가능 | 보통 | 현대 Linux/Windows/macOS pthread |
| M:1 | 유저 M ↔ 커널 1 | 불가능 (코어 1개만 사용) | 매우 빠름 | 초창기 그린 스레드 |
| M:N | 유저 M ↔ 커널 N | 가능 | 빠름 + 복잡 | Go goroutine, 초기 Solaris |

JS/Node.js와의 관계: Node.js의 Worker Thread API로 만든 워커 스레드는 결국 1:1 모델로 OS 커널 스레드에 매핑됩니다. `new Worker()`를 호출하면 커널에 스레드 1개가 만들어지고, OS가 직접 스케줄링. 그래서 멀티코어 CPU 위에서 Worker가 진짜 병렬로 돌 수 있는 것.

이게 없으면 어떻게 되는가 — M:1만 있다면: 모든 사용자 스레드가 커널 스레드 1개에 묶이니, 8코어 CPU여도 한 번에 1코어만 쓸 수 있습니다. 더 큰 문제는 한 스레드가 블로킹 시스템 콜을 부르면 그 커널 스레드 = 프로세스 전체가 멈춘다는 점. 그래서 현대 OS가 1:1로 옮긴 것.

오개념 예방: "1:1이 가장 단순하고 모두가 채택한다면 M:N은 의미 없는가?"는 너무 단순한 결론입니다. Go의 goroutine은 M:N으로 수만 개의 가벼운 실행 단위를 만들면서도 멀티코어를 활용합니다 — Go 런타임이 사용자 공간 스케줄러를 잘 만들었기 때문에 가능. 다만 OS 차원에서는 1:1이 합리적 기본값이라는 것.

AI Annotation 보충: 1:1 모델이 표준이 된 이유는 (a) 멀티코어 시대에 자연스럽게 병렬화되고, (b) 블로킹 시스템 콜 문제가 없으며(한 스레드 블로킹돼도 OS가 다른 커널 스레드를 굴림), (c) 구현이 단순하다는 세 가지가 합쳐진 결과입니다. CPU 코어 수가 늘어나는 추세에서 이 선택은 더 굳어지고 있습니다.
