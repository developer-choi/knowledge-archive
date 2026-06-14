# Integration test란 무엇인가?

## 본문

> Integration: Verify that several units work together in harmony.

"Integration: 여러 단위가 조화롭게 함께 동작하는지 검증한다."

- **several units**: 컴포넌트 여러 개, 커스텀 훅, 유틸 함수의 조합. 개별적으로는 동작해도 연결에서 문제가 생길 수 있다.
- **in harmony**: 각자 동작하는 게 아니라 서로 올바르게 연결되어 동작하는 것.

> The idea behind integration tests is to mock as little as possible.

"Integration test의 핵심 아이디어는 가능한 한 적게 mock하는 것이다."

> Integration Testing involves testing how multiple units work together. This can be a combination of components, hooks, and functions.

"Integration testing은 여러 단위가 어떻게 함께 동작하는지 테스트하는 것이다. 컴포넌트, 훅, 함수의 조합이 될 수 있다."

```ts
// integration test 예시 — 실제 컴포넌트 트리 + MSW
render(
  <Providers>  {/* Router, ThemeProvider, AuthProvider 등 */}
    <CheckoutPage />
  </Providers>
);

await userEvent.click(screen.getByRole('button', { name: '결제하기' }));
expect(await screen.findByText('결제 완료')).toBeInTheDocument();
```

---

## 종합

Integration test는 Testing Trophy에서 가장 높은 ROI(투자 대비 효과)를 가진다. unit보다 더 많은 코드를 한 번에 검증하면서, E2E보다 훨씬 빠르다. 앱의 모든 Provider를 실제로 감싸고, 네트워크만 MSW로 대체하므로 실제 사용 환경과 가장 비슷하다. Kent C. Dodds가 Trophy에서 integration을 가장 큰 비중으로 권장하는 이유다.

---

# Integration test의 장점과 단점은?

> The size of these forms of testing on the trophy is relative to the amount of focus you should give them when testing your applications (in general).

"Trophy에서 각 테스트 형태의 크기는 일반적으로 애플리케이션을 테스트할 때 집중해야 하는 양에 비례한다."

> The idea behind integration tests is to mock as little as possible.

"Integration test의 핵심 아이디어는 가능한 한 적게 mock하는 것이다."

```
Integration test 장단점

장점
  ✓ 테스트 1개당 자신감이 unit보다 높음
  ✓ E2E보다 빠르고 저렴함
  ✓ mock 최소화 → 실제 동작에 가까움
  ✓ Provider, 훅, 컴포넌트 간 연결 검증

단점
  ✗ unit보다 느림
  ✗ 실패 시 원인 추적이 unit보다 어려움
  ✗ 실제 백엔드 연동 문제는 잡을 수 없음 (MSW가 네트워크를 가로채므로)
```

---

## 종합

Integration test는 unit보다 더 많은 코드를 한 번에 검증해 테스트 1개당 자신감이 높고, E2E보다 빠르고 저렴하다. 대신 unit보다 느리고 실패 시 원인 추적이 어렵다. mock을 최소화하므로 실제 동작에 가깝지만, MSW로 네트워크를 가로채는 한 실제 백엔드 연동 문제는 잡지 못한다. 무엇을 어디까지 mock할지의 구체적 기준은 별도로 다룬다.
