# Static test란 무엇인가?

## 도입

Testing Trophy의 가장 아래 레이어다. 코드를 실행하지 않고도 문법 오류, 타입 불일치를 잡아주는 도구들로, 별도의 테스트를 작성하지 않아도 자동으로 동작한다.

---

## 본문

> Static: Catch typos and type errors as you write the code.

"Static: 코드를 작성하는 동안 오타와 타입 오류를 잡는다."

- **typos**: 변수 이름 오타, 존재하지 않는 프로퍼티 접근 등. `user.naem`처럼 타이핑 실수.
- **type errors**: 타입 불일치. 숫자를 기대하는 함수에 문자열을 넘기는 것처럼.

ESLint와 TypeScript가 대표 도구다. 에디터에서 실시간으로 빨간 줄로 표시되고, CI에서 `tsc --noEmit`으로 확인한다. 테스트 작성 없이 커버되는 레이어라 cost가 가장 낮다.

> In particular, static analysis tools are incapable of giving you confidence in your business logic.

"특히 정적 분석 도구는 비즈니스 로직에 대한 자신감을 줄 수 없다."

static은 코드를 실행하지 않으므로 타입·문법만 검증한다. "할인율이 올바르게 계산되는가" 같은 비즈니스 로직의 정확성은 static의 blind spot이며, unit 이상의 레이어가 담당한다.

```
Testing Trophy 구조

     ┌──────────┐
     │   E2E    │  ← 가장 높은 자신감, 가장 높은 비용
     ├──────────┤
     │integration│  ← 가장 큰 비중 (Kent C. Dodds 권장)
     ├──────────┤
     │   unit   │
     ├──────────┤
     │  static  │  ← 가장 낮은 비용, 자동 적용
     └──────────┘
```

---

## 종합

Static 레이어가 없으면 unit test에서야 타입 오류를 발견한다. TypeScript와 ESLint를 설정하면 에디터에서 바로 피드백이 오므로 피드백 루프가 가장 짧다. 테스트를 쓰지 않아도 되는 버그는 static 레이어에 맡기고, 그 위 레이어에서는 비즈니스 로직과 사용자 흐름 검증에 집중하는 전략이 Trophy의 핵심이다.

---

---

# Snapshot Testing이란 무엇이며 Unit/Integration/E2E와 어떤 관계인가?

## 도입

Snapshot Testing은 컴포넌트의 렌더 결과를 파일로 저장해두고, 이후 변화가 생겼는지 비교하는 방식이다. Unit/Integration/E2E와 같은 "범위" 축이 아니라, 보조 검증 방식이다.

---

## 본문

> Snapshot Testing involves capturing the rendered output of a component and saving it to a snapshot file. When tests run, the current rendered output of the component is compared against the saved snapshot. Changes in the snapshot are used to indicate unexpected changes in behavior.

"Snapshot Testing은 컴포넌트의 렌더된 출력을 캡처하여 스냅샷 파일에 저장하는 것이다. 테스트 실행 시 컴포넌트의 현재 렌더된 출력이 저장된 스냅샷과 비교된다. 스냅샷의 변화는 동작의 예상치 못한 변화를 나타내는 데 사용된다."

```
Snapshot Testing 동작 방식

첫 실행  → 스냅샷 파일 생성 (컴포넌트 HTML 저장)
이후 실행 → 현재 렌더 결과와 저장된 스냅샷 비교
변화 발생 → 테스트 실패 → 의도적 변경이면 jest --updateSnapshot
```

Snapshot은 Unit/Integration/E2E 중 어느 레벨에서도 사용할 수 있다. "범위"가 아닌 "검증 방식"의 차이다.

---

## 종합

Snapshot Testing은 의도치 않은 UI 변경을 감지하는 데 유용하지만, "스냅샷이 맞다"는 것이 "동작이 올바르다"는 의미는 아니다. 스냅샷이 잘못된 렌더 결과를 담고 있어도 테스트는 통과한다. 또한 스냅샷이 너무 크면 변경이 생길 때마다 검토 없이 업데이트하게 되어 의미를 잃는다. 핵심 UI 구조 변경 감지에는 유용하지만, 구체적인 동작 검증은 RTL의 `getByRole` 기반 어서션이 더 신뢰할 수 있다.
