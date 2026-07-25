---
tags: [react, nextjs, principle]
source: official
publishable: false
priority:
---

# Questions
- `"use client"`가 없는 3rd-party 컴포넌트를 Server Component 안에서 그대로 쓸 수 있는가?
- Context Provider를 Server Component 아래에서 쓰려면 어떻게 감싸야 하는가?
- Provider는 트리의 어느 위치에 두어야 하는가?

---

# Answers

## `"use client"`가 없는 3rd-party 컴포넌트를 Server Component 안에서 그대로 쓸 수 있는가?

### Official Answer
When using a third-party component that relies on client-only features, you can wrap it in a Client Component to ensure it works as expected.

However, if you try to use it directly within a Server Component, you'll see an error. This is because Next.js doesn't know `<Carousel />` is using client-only features.

If you’re building a component library, add the `"use client"` directive to entry points that rely on client-only features. This lets your users import components into Server Components without needing to create wrappers.

It's worth noting some bundlers might strip out `"use client"` directives.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components


---

## Context Provider를 Server Component 아래에서 쓰려면 어떻게 감싸야 하는가?

### Official Answer
To use context, create a Client Component that accepts `children`.

Your Server Component will now be able to directly render your provider, and all other Client Components throughout your app will be able to consume this context.

### User Answer
Provider를 직접 쓰지 않고 별도 파일로 빼서 `"use client"`를 붙여 CC로 만들면, 기존 CC의 규칙 그대로 사용 가능하다 (SC 밑에서도 사용 가능, CC 밑에서도 사용 가능).

다른 곳에서 만든 Provider도 SC 환경에서는 그대로 쓸 수 없으니, 한번 감싸서 `"use client"`를 붙이고 원래 CC 규칙에 맞게 다른 곳에서 쓰는 식이다.

SC에서는 context에 접근하지 못한다는 의미다. redux도 마찬가지로 SC에서는 접근하지 못할 것이다.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components


---

## Provider는 트리의 어느 위치에 두어야 하는가?

### Official Answer
You should render providers as deep as possible in the tree – notice how `ThemeProvider` only wraps `{children}` instead of the entire `<html>` document. This makes it easier for Next.js to optimize the static parts of your Server Components.

### Reference
- https://nextjs.org/docs/app/getting-started/server-and-client-components
