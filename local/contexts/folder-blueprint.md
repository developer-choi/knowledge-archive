# Folder Blueprint

역할 디렉토리(knowledge/·techniques/·tips/·explained/)가 공유하는 도메인 트리를 정의한다. 같은 도메인 주제(예: `cs/network/`)에 대해 네 역할 디렉토리 모두 같은 트리를 가진다. 역할 디렉토리 정의는 [directory-roles.md](directory-roles.md) 참고.

---

## 1. 도메인 트리 (Tech)

### 1.1. Frontend & Web

#### **Languages**
- **`frontend/javascript/`**: `data-type-ds/`, `grammar/`, `internal/`, `async/`, `module/`, `package-json/`
- **`frontend/typescript/`**: `types/`, `generics/`

#### **React & Next.js Ecosystem**
- **`frontend/react/`**:
    - `core/`: Basic, Logic, Reconciliation, JSX, Children, Compound Components
    - `rendering/`: Server/Client Component, RSC Payload, useLayoutEffect
    - `performance/`: R18, Suspense, Concurrent Features, useDeferredValue, react-cache, Streaming
- **`frontend/nextjs/`**:
    - `routing/`: App Router, Prefetching
    - `caching/`: Router Cache, Data Cache, Full Route Cache, Request Memoization, Router Refresh
    - `data-fetching/`: App Router Data Fetching
    - `rendering/`: SSR/SSG/CSR, Partial Prerendering, Streaming, Loading Sequence
- **`frontend/form/`**:
    - `library/`: **RHF (React Hook Form)** (`useForm`, `register`, `controller`)
    - `elements/`: Checkbox, File Input, Mobile Keypad Handling
    - `patterns/`: Complex Forms, Validations
- **`frontend/ui-ux/`**:
    - **Markup & Styling**: `layout/`, `animation/`, `css/`, `font/`, `image/`
    - **Design System**: `figma-collab/`, `components/`, `modal/`
    - **Interaction**: `scroll/`, `url-query/`, `gestures/`
    - **Visual Testing**: `storybook/`

#### **Testing**
- **`frontend/testing/`**: Test Adoption, Testing Library, Jest, RTL, Storybook

#### **Browser & Web Standard**
- **`frontend/browser/`**: `loading-process/`, `rendering-path/`, `devtools/`
- **`frontend/standard/`**: `web-api/`, `webview/`, `seo/`, `accessibility/`

#### **State & Data Fetching**
- **`frontend/react-query/`**: TanStack Query (caching, refetch, SSR hydration, state manager 활용)

#### **Architecture**
- **`frontend/fsd/`**: Feature-Sliced Design (Motivation, Philosophy, Layers·Segments, Dependency Rules, Shared Logic)

#### **Design System**
- **`frontend/design-system/`**: Design System overview

#### **Build & Tooling**
- **`frontend/bundler/`**:
    - `vite/`: Vite-specific architecture, config
- **`frontend/monorepo/`**: Workspaces, Task Runner, Polyrepo vs Monorepo
- **`frontend/package-manager/`**: npm·Yarn·pnpm, Yarn Berry
- **`frontend/publishing/`**: Library Publishing, GitHub Packages

---

### 1.2. Computer Science (CS)

#### **Network**
- **`cs/network/`**:
    - `layers/`: OSI 7 Layer, Transport (TCP/UDP), Network, Datalink
    - `protocol/`: HTTP/1.1 vs 2 vs 3, HTTPS, WebSocket

#### **Data Structure & Algorithm**
- **`cs/data-structure/`**: `array/`, `list/`, `tree/`, `heap/`, `graph/`
- **`cs/algorithm/`**: `search/`, `sort/`, `recursion/`, `dp/`

#### **OS & System**
- **`cs/system/`**: `os/`, `process-thread/`, `memory/`

#### **Software Engineering**
- **`cs/software-engineering/`**: `principles/` (Cohesion, Coupling, Readability)
- **`cs/design-pattern/`**: `singleton/`, `observer/`, `factory/` (Architecture)

---

### 1.3. Infrastructure & DevOps

- **`infra/aws/`**: `ec2/`, `s3/`, `cloudfront/`, `lambda/`
- **`infra/devops/`**: `git/`, `ci-cd/`, `docker/`
- **`infra/monitoring/`**: `sentry/` (Error Tracking Setup)

---

### 1.4. Domain Knowledge (General)

특정 회사에 종속되지 않는 **일반화된 도메인 기술 지식**입니다.
- **`domains/e-commerce/`**: `cart/`, `payment-flow/`, `order-processing/`
- **`domains/auth/`**: `oauth/`, `jwt/`, `session/`, `sso/`
- **`domains/security/`**: `sensitive-data/`, `xss-csrf/`

---

### 1.5. AI Technology
- **`ai/llm/`**: `models/`, `prompt-engineering/`
- **`ai/applications/`**: `workflows/`, `agents/`
