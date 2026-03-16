# Folder Blueprint

앞으로 만들 폴더 구조를 미리 잡아둔 문서입니다.

---

## 2. Knowledge Structure (Tech Only)

### 2.1. Frontend & Web

#### **Languages**
- **`frontend/javascript/`**: `data-type-ds/`, `grammar/`, `internal/`, `async/`
- **`frontend/typescript/`**: `types/`, `generics/`

#### **React & Next.js Ecosystem**
- **`frontend/react/`**:
    - `core/`: Basic, Logic
    - `rendering/`: Rendering Process, Render Phase/Commit Phase
    - `performance/`: R18, N14, Suspense, Concurrent Features
    - `project-mgmt/`: Project Requirements, Package Mgmt, `package.json`
    - `module/`: Monorepo, Bundler, Vite
- **`frontend/nextjs/`**:
    - `routing/`: Pages Router, App Router, Layouts
    - `caching/`: Caching Mechanism, Data Fetching
    - `device/`: PC/Mobile Separation Strategies
- **`frontend/form/`**:
    - `library/`: **RHF (React Hook Form)** (`useForm`, `register`, `controller`)
    - `elements/`: Checkbox, File Input, Mobile Keypad Handling
    - `patterns/`: Complex Forms, Validations
- **`frontend/ui-ux/`**:
    - **Markup & Styling**: `layout/`, `animation/`, `css/`, `font/`, `image/`
    - **Design System**: `figma-collab/`, `components/`, `modal/`
    - **Interaction**: `scroll/`, `url-query/`, `gestures/`
    - **Testing**: `jest/`, `rtl/`, `storybook/`

#### **Browser & Web Standard**
- **`frontend/browser/`**: `loading-process/`, `rendering-path/`, `devtools/`
- **`frontend/standard/`**: `web-api/`, `webview/`, `seo/`, `accessibility/`

---

### 2.2. Computer Science (CS)

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
- **`cs/design-pattern/`**: `singleton/`, `observer/`, `factory/`, `fsd/` (Architecture)

---

### 2.3. Infrastructure & DevOps

- **`infra/aws/`**: `ec2/`, `s3/`, `cloudfront/`, `lambda/`
- **`infra/devops/`**: `git/`, `ci-cd/`, `docker/`
- **`infra/monitoring/`**: `sentry/` (Error Tracking Setup)

---

### 2.4. Domain Knowledge (General)

특정 회사에 종속되지 않는 **일반화된 도메인 기술 지식**입니다.
- **`domains/e-commerce/`**: `cart/`, `payment-flow/`, `order-processing/`
- **`domains/auth/`**: `oauth/`, `jwt/`, `session/`, `sso/`
- **`domains/security/`**: `sensitive-data/`, `xss-csrf/`

---

### 2.5. AI Technology
- **`ai/llm/`**: `models/`, `prompt-engineering/`
- **`ai/applications/`**: `workflows/`, `agents/`
