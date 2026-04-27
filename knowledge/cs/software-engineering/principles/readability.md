---
tags: [react, architecture, best-practice]
---
# Questions

- 전통적인 `if (isLoading)` 로딩 처리의 문제점은?
- Suspense는 어떻게 관심사 분리를 달성하는가?
- Child.loading 패턴의 장점은 무엇인가?
- 추출(Extraction)이 해로운 이유와 추상화(Abstraction)가 이를 어떻게 해결하는가?

---

# Answers

## 전통적인 `if (isLoading)` 로딩 처리의 문제점은?

### Official Answer
1. **방어적 코드 증가:** 데이터가 null일 가능성을 컴포넌트 내부 곳곳에서 체크해야 한다 (`user?.name`).  
2. **관심사의 혼재:** 비즈니스 로직을 처리하는 컴포넌트가 '로딩 상태'라는 UI 상태까지 관리해야 한다.  
3. **암시적 흐름:** 부모 컴포넌트가 자식의 로딩 상태를 알기 어렵거나, 불필요한 Prop Drilling이 발생한다.

### Reference
- 토스 딥 리서치 결과물 (URL_UNKNOWN)

---

## Suspense는 어떻게 관심사 분리를 달성하는가?

### Official Answer
**성공 케이스에만 집중해서 UI를 작성하겠다라는 선언**이라고 정의한다.

Suspense를 사용하면 컴포넌트 내부에서는 데이터가 반드시 존재한다고 가정할 수 있다.
이는 코드의 복잡도를 획기적으로 낮춰준다.

* **컴포넌트:** 데이터를 어떻게 보여줄지만 고민한다.  
* **Suspense Boundary:** 데이터가 없을 때 무엇을 보여줄지(Fallback)를 담당한다.  
* **Error Boundary:** 데이터 가져오기에 실패했을 때를 담당한다.

### Reference
- https://velog.io/@alice0751/%ED%86%A0%EC%8A%A4-Frontend-Fundamentals-%EB%AA%A8%EC%9D%98%EA%B3%A0%EC%82%AC-%EB%A6%AC%EB%B7%B0-%ED%9B%84%EA%B8%B0-%EC%A0%95%EB%A6%AC

---

## Child.loading 패턴의 장점은 무엇인가?

### Official Answer
일반적으로 Suspense를 사용할 때, 부모 컴포넌트가 `fallback={<Spinner />}`를 주입한다.
하지만 부모는 자식 컴포넌트의 크기나 모양(Skeleton)을 정확히 알지 못하는 경우가 많다.
이로 인해 부모 컴포넌트에 자식의 스타일링 정보가 누수(Leak)된다.
이를 해결하기 위해 자식 컴포넌트가 자신의 로딩 상태 UI를 정적 프로퍼티(Static Property)로 수출(Export)하는 패턴을 사용한다.

이 패턴의 장점은 다음과 같다:

1. **캡슐화 강화:** 자식 컴포넌트의 디자인이 변경되어도 부모 컴포넌트의 fallback 코드를 수정할 필요가 없다 (자동 반영).  
2. **명시적 의존성:** 부모 컴포넌트 코드만 봐도 AccountInfo가 로딩될 때 어떤 UI가 나올지 AccountInfo.Skeleton이라는 이름을 통해 명확히 알 수 있다.  
3. **암묵적 의존성 제거:** 연구 자료에서 우려했던 "부모 Suspense Boundary에 암묵적으로 의존하는 문제"를 해결한다.

### Reference
- https://velog.io/@alice0751/%ED%86%A0%EC%8A%A4-Frontend-Fundamentals-%EB%AA%A8%EC%9D%98%EA%B3%A0%EC%82%AC-%EB%A6%AC%EB%B7%B0-%ED%9B%84%EA%B8%B0-%EC%A0%95%EB%A6%AC

---

## 추출(Extraction)이 해로운 이유와 추상화(Abstraction)가 이를 어떻게 해결하는가?

### Official Answer
"이 파일 하나만 보고 이 페이지가 어떤 페이지인지 파악할 수 있는가?"

| 구분 | 나쁜 예 (과도한 분리/추출) | 좋은 예 (적절한 추상화/응집) |
| :---- | :---- | :---- |
| **파일 구조** | hooks/, components/, utils/, types/로 파편화되어 로직을 찾기 위해 5개의 파일을 열어야 함 | 관련된 로직, 스타일, 타입이 FeaturePage.tsx 또는 해당 디렉토리 내에 **공존(Colocation)**함 |
| **가독성** | useLogic()과 같은 모호한 훅 사용으로 내부 구현을 확인해야 흐름 파악 가능 | 컴포넌트 이름과 Props만으로 역할이 명확하며, 코드가 위에서 아래로 자연스럽게 읽힘 |
| **의존성** | 부모 컴포넌트가 자식의 구현 상세(State 등)를 알고 제어하려 함 (Leaky Abstraction) | 자식 컴포넌트가 필요한 데이터를 스스로 요구하거나(Suspense), 명확한 인터페이스로 통신함 |

코드를 분리할 때마다 우리는 독자(리뷰어)에게 **문맥 교환(Context Switch)** 비용을 청구한다.

* **나쁜 추출:** 하나의 논리적 흐름인 100줄짜리 코드를 단순히 20줄씩 5개의 함수로 나누고, 그 함수들이 서로 강하게 결합(Coupling)되어 있다면, 독자는 5개의 함수를 오가며 머릿속으로 조립해야 한다.
이는 인지 부하를 폭발시킨다.
* **좋은 추상화:** 100줄 중 50줄이 "날짜를 포맷팅하고 상대 시간(방금 전, 1시간 전)을 계산하는 로직"이라면, 이를 `formatRelativeTime(date)`라는 함수로 분리한다.
독자는 함수 이름만 보고 내부 구현을 보지 않아도 된다.
이것이 인지 부하를 줄이는 추상화다.

* **테스트:** `__tests__` 폴더에 몰아넣지 않고, `Component.test.tsx`를 `Component.tsx` 옆에 둔다.
* **상태 로직:** 해당 컴포넌트에서만 쓰이는 커스텀 훅은 별도 hooks 폴더가 아닌 해당 컴포넌트 파일 내부나 같은 디렉토리에 둔다.

"재사용될 것이 확실하지 않다면 분리하지 않는다"는 원칙을 고수하라.
파일이 200줄이 넘더라도, 하나의 완결된 이야기를 담고 있다면 쪼개진 10개의 파일보다 낫다.

### Reference
- 토스 딥 리서치 결과물 (URL_UNKNOWN)