---
tags: [react, performance]
---

# useDeferredValue

# Questions
- [What is the concept and role of `useDeferredValue`?](#what-is-the-concept-and-role-of-usedeferredvalue)
- [Since `useDeferredValue` causes an additional re-render, doesn't it actually make the app slower without `memo`?](#since-usedeferredvalue-causes-an-additional-re-render-doesnt-it-actually-make-the-app-slower-without-memo)
- [What is the difference in Suspense behavior when using `useDeferredValue` versus immediate updates?](#what-is-the-difference-in-suspense-behavior-when-using-usedeferredvalue-versus-immediate-updates)
- [Why should you avoid passing objects created during render to `useDeferredValue`?](#why-should-you-avoid-passing-objects-created-during-render-to-usedeferredvalue)
- [How does `useDeferredValue` manage background re-renders and handling interruptions?](#how-does-usedeferredvalue-manage-background-re-renders-and-handling-interruptions)
- [Does implementing `useDeferredValue` reduce the number of API calls sent to the server?](#does-implementing-usedeferredvalue-reduce-the-number-of-api-calls-sent-to-the-server)
- [What is the default timeout in milliseconds for `useDeferredValue`?](#what-is-the-default-timeout-in-milliseconds-for-usedeferredvalue)
- [Does wrapping a slow component with `useDeferredValue` make its rendering faster?](#does-wrapping-a-slow-component-with-usedeferredvalue-make-its-rendering-faster)
- [Won't a heavy deferred render eventually delay the next keystroke update if the main thread is busy with the list?](#wont-a-heavy-deferred-render-eventually-delay-the-next-keystroke-update-if-the-main-thread-is-busy-with-the-list)
- [How does `useDeferredValue` differ from traditional optimization techniques like debouncing or throttling?](#how-does-usedeferredvalue-differ-from-traditional-optimization-techniques-like-debouncing-or-throttling)

# Answers

## What is the concept and role of `useDeferredValue`?

### Official Answer
useDeferredValue is a React Hook that lets you defer updating a part of the UI.

To get a deferred version of that value.

#### Parameters
value: The value you want to defer. It can have any type.

#### Returns
During the initial render, the same as the value you provided.

During updates, React will first attempt a re-render with the old value (so it will return the old value),

and then try another re-render in the background with the new value (so it will return the updated value).

### Reference
- https://react.dev/reference/react/useDeferredValue

## Since `useDeferredValue` causes an additional re-render, doesn't it actually make the app slower without `memo`?

### Official Answer
This optimization requires SlowList to be wrapped in memo.

During that re-render, deferredText still has its previous value, so SlowList is able to skip re-rendering (its props have not changed).

Without memo, it would have to re-render anyway, defeating the point of the optimization.

> User Annotation
> - 렌더링이 두번씩 발생하니까 memo()를 감싸서 props가 바뀌지 않았을 때 리렌더링이 되지않게 할 수 있습니다.

### Reference
- https://react.dev/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui

## What is the difference in Suspense behavior when using `useDeferredValue` versus immediate updates?

### Official Answer
```typescript jsx
function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

The query will update immediately, so the input will display the new value.

However, the deferredQuery will keep its previous value until the data has loaded, so SearchResults will show the stale results for a bit.

### Reference
- https://react.dev/reference/react/useDeferredValue#showing-stale-content-while-fresh-content-is-loading

## Why should you avoid passing objects created during render to `useDeferredValue`?

### Official Answer
The values you pass to useDeferredValue should either be primitive values (like strings and numbers) or objects created outside of rendering.

If you create a new object during rendering and immediately pass it to useDeferredValue,
it will be different on every render, causing unnecessary background re-renders.

### Reference
- https://react.dev/reference/react/useDeferredValue#caveats

## How does `useDeferredValue` manage background re-renders and handling interruptions?

### Official Answer
When useDeferredValue receives a different value (compared with Object.is), in addition to the current render (when it still uses the previous value), it schedules a re-render in the background with the new value.

You can think of it as happening in two steps:

First, React re-renders with the new query ("ab") but with the old deferredQuery (still "a").

The deferredQuery value, which you pass to the result list, is deferred: it “lags behind” the query value.

In the background, React tries to re-render with both query and deferredQuery updated to "ab".

If this re-render completes, React will show it on the screen.

### Reference
- https://react.dev/reference/react/useDeferredValue#how-does-deferred-value-work-under-the-hood

## Does implementing `useDeferredValue` reduce the number of API calls sent to the server?

### Official Answer
useDeferredValue does not by itself prevent extra network requests.

Note that there is still a network request per each keystroke.

What’s being deferred here is displaying results (until they’re ready), not the network requests themselves.

### Reference
- https://react.dev/reference/react/useDeferredValue#deferring-a-value-does-not-prevent-network-requests

## What is the default timeout in milliseconds for `useDeferredValue`?

### Official Answer
There is no fixed delay caused by useDeferredValue itself.

### Reference
- https://react.dev/reference/react/useDeferredValue

## Does wrapping a slow component with `useDeferredValue` make its rendering faster?

### Official Answer
useDeferredValue lets you prioritize updating the input (which must be fast) over updating the result list (which is allowed to be slower):

This does not make re-rendering of the SlowList faster.

However, it tells React that re-rendering the list can be deprioritized so that it doesn’t block the keystrokes.

The list will “lag behind” the input and then “catch up”.

Like before, React will attempt to update the list as soon as possible, but will not block the user from typing.

### Reference
- https://react.dev/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui

## Won't a heavy deferred render eventually delay the next keystroke update if the main thread is busy with the list?

### Official Answer
The background re-render is interruptible: if there’s another update to the value, React will restart the background re-render from scratch.

For example, if the user is typing into an input faster than a chart receiving its deferred value can re-render, the chart will only re-render after the user stops typing.

As soon as React finishes the original re-render, React will immediately start working on the background re-render with the new deferred value.

Any updates caused by events (like typing) will interrupt the background re-render and get prioritized over it.

### Reference
- https://react.dev/reference/react/useDeferredValue

## How does `useDeferredValue` differ from traditional optimization techniques like debouncing or throttling?

### Official Answer
There are two common optimization techniques you might have used before in this scenario:

Debouncing means you’d wait for the user to stop typing (e.g. for a second) before updating the list.

Throttling means you’d update the list every once in a while (e.g. at most once a second).

While these techniques are helpful in some cases, useDeferredValue is better suited to optimizing rendering because it is deeply integrated with React itself and adapts to the user’s device.

Unlike debouncing or throttling, it doesn’t require choosing any fixed delay.

If the user’s device is fast (e.g. powerful laptop), the deferred re-render would happen almost immediately and wouldn’t be noticeable.

If the user’s device is slow, the list would “lag behind” the input proportionally to how slow the device is.

Also, unlike with debouncing or throttling, deferred re-renders done by useDeferredValue are interruptible by default.

This means that if React is in the middle of re-rendering a large list, but the user makes another keystroke, React will abandon that re-render, handle the keystroke, and then start rendering in the background again.

By contrast, debouncing and throttling still produce a janky experience because they’re blocking: they merely postpone the moment when rendering blocks the keystroke.

If the work you’re optimizing doesn’t happen during rendering, debouncing and throttling are still useful. For example, they can let you fire fewer network requests. You can also use these techniques together.

### Reference
- https://react.dev/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui
