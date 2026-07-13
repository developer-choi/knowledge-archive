---
tags: [testing, react, concept]
source: unverified
publishable: true
---
# Questions
- 커스텀 훅 중 어떤 훅에 독립 테스트가 필요한가?
- 재사용 커스텀 훅은 구체적으로 어떻게 테스트하는가?
- 훅을 쓰는 실제 컴포넌트를 만들어 테스트하는 방식은 어떤 약점이 있고, 이를 어떻게 보완할 수 있는가?
- renderHook은 어떤 문제 때문에 등장했으며, 내부적으로 하는 일은 무엇인가?

---

# Answers

## 커스텀 훅 중 어떤 훅에 독립 테스트가 필요한가?

### Official Answer
And I'm not talking about the one-off custom hook you pull out just to make your component body smaller and organize your code (those should be covered by your component tests), I'm talking about that reusable hook you've published to github/npm (or you've been talking with your legal department about it).

### Reference
- https://kentcdodds.com/blog/how-to-test-custom-react-hooks

---

## 재사용 커스텀 훅은 구체적으로 어떻게 테스트하는가?

### Official Answer
if you were to test this manually, rather simply calling the function, you'd probably write a component that uses the hook, and then interact with that component rendered to the page (perhaps using storybook).

### Reference
- https://kentcdodds.com/blog/how-to-test-custom-react-hooks

---

## 훅을 쓰는 실제 컴포넌트를 만들어 테스트하는 방식은 어떤 약점이 있고, 이를 어떻게 보완할 수 있는가?

### Official Answer
However, sometimes the component that you need to write is pretty complicated and you end up getting test failures not because the hook is broken, but because the example you wrote is which is pretty frustrating.

That problem is compounded by another one. In some scenarios sometimes you have a hook that can be difficult to create a single example for all the use cases it supports so you wind up making a bunch of different example components to test.

Now, having those example components is probably a good idea anyway (they're great for storybook for example), but sometimes it can be nice to create a little helper that doesn't actually have any UI associated with it and you interact with the hook return value directly.

### Reference
- https://kentcdodds.com/blog/how-to-test-custom-react-hooks

---

## renderHook은 어떤 문제 때문에 등장했으며, 내부적으로 하는 일은 무엇인가?

### Official Answer
Now, sometimes you have more complicated hooks where you need to wait for mocked HTTP requests to finish, or you want to "rerender" the component that's using the hook with different props etc. Each of these use cases complicates your setup function or your real world example which will make it even more domain-specific and difficult to follow.

This is why renderHook from @testing-library/react exists.

You'll notice it's very similar to our custom setup function. Under the hood, @testing-library/react is doing something very similar to our original setup function above.

### Reference
- https://kentcdodds.com/blog/how-to-test-custom-react-hooks
