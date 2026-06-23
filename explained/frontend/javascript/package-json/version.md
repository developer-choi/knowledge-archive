# [UNVERIFIED] dependencies/devDependencies/peerDependencies는 왜 존재하는가?

## 도입

세 필드 모두 "이 패키지가 어떤 외부 모듈에 의존하는가"를 선언한다. 분리된 이유는 "누가, 언제, 왜 필요한가"가 다르기 때문이다.

---

## 본문

세 필드 존재 이유는 OA 없이 실무 원칙으로 정리한다.

```
dependencies     → 런타임에 필요. 사용자가 설치 시 함께 설치됨.
devDependencies  → 개발/빌드/테스트 시에만 필요. 사용자 설치 시 포함 안 됨.
peerDependencies → "나와 함께 쓸 때는 이 패키지가 이미 설치돼 있어야 해."
                   (중복 설치 방지 + 호환 버전 명시)
```

```json
{
  "dependencies": {
    "react": "^18.0.0"      // 런타임 필요
  },
  "devDependencies": {
    "typescript": "^5.0.0", // 빌드에만 필요, 최종 번들에 안 들어감
    "vitest": "^1.0.0"      // 테스트에만 필요
  },
  "peerDependencies": {
    "react": ">=17.0.0"     // 호스트 프로젝트에 이미 있어야 함
  }
}
```

이 필드들이 없다면 `npm install react`를 매번 버전 찾아서 수동으로 설치해야 한다. 패키지 선언으로 인해 `npm install`만 하면 필요한 것들이 자동으로 설치된다.

---

## 종합

세 필드의 분리는 "패키지 설치 크기 최소화"와 "의존성 충돌 방지"를 동시에 달성한다. `devDependencies`가 없으면 사용자가 내 라이브러리를 설치할 때 테스트 도구까지 전부 받아야 한다. `peerDependencies`가 없으면 같은 패키지의 다른 버전이 중복 설치되어 충돌이 생긴다.

---

# devDependencies는 무엇을 위한 필드인가?

## 도입

라이브러리를 만들 때 Vitest, TypeScript, ESLint 같은 도구는 개발할 때만 필요하다. 사용자가 그 라이브러리를 설치할 때 이런 도구까지 함께 받을 필요는 없다.

---

## 본문

> If someone is planning on downloading and using your module in their program, then they probably don't want or need to download and build the external test or documentation framework that you use.

"누군가 당신의 모듈을 자신의 프로그램에서 사용하려 한다면, 당신이 사용하는 외부 테스트나 문서화 프레임워크를 다운로드하거나 빌드하고 싶지도 필요하지도 않을 것이다."

- **download and build**: npm install은 단순 파일 복사가 아니라 생명주기 스크립트(`postinstall` 등)도 실행한다. 불필요한 빌드 의존성이 있으면 설치 시간이 늘어난다.
- **test or documentation framework**: Vitest, Jest, Storybook, typedoc 등. 사용자는 당신의 테스트 코드를 실행할 필요가 없다.

```json
{
  "dependencies": {
    "lodash-es": "^4.17.21"   // 런타임에 필요
  },
  "devDependencies": {
    "typescript": "^5.3.0",   // 빌드만
    "vite": "^5.0.0",         // 빌드만
    "vitest": "^1.0.0",       // 테스트만
    "eslint": "^8.0.0"        // 린트만
  }
}
```

사용자가 `npm install my-lib`를 실행하면 `lodash-es`만 함께 설치된다. `typescript`, `vite`, `vitest`는 설치되지 않는다.

---

## 종합

`devDependencies`로 분리하면 라이브러리를 설치하는 사용자의 설치 시간과 용량이 줄어든다. 앱 개발자 입장에서도 `npm install --production` 또는 `npm ci --omit=dev`로 프로덕션 배포 시 devDependencies를 제외하여 서버 컨테이너 크기를 줄일 수 있다.

---

# peerDependencies는 무엇을 위한 필드인가? (Purpose)

## 도입

React 플러그인이나 ESLint 플러그인처럼 "호스트 패키지와 함께 쓰이는" 패키지는 호스트를 `dependencies`로 설치하면 중복 설치 문제가 생긴다. `peerDependencies`가 이 문제를 해결한다.

---

## 본문

> In some cases, you want to express the compatibility of your package with a host tool or library.

"어떤 경우에는 패키지가 호스트 도구나 라이브러리와의 호환성을 표현하고 싶다."

- **compatibility**: 단순히 "필요하다"가 아니라 "이 버전과 호환된다"는 의미다. 버전 범위를 명시해서 호환 여부를 선언한다.
- **host tool or library**: `@next/eslint-plugin-next`에게 Next.js는 "내가 플러그인으로 들어가는 호스트"다. 호스트는 이미 프로젝트에 있어야 한다.

```
문제 상황 (peerDependencies 없음):
  프로젝트
  └── node_modules
      ├── eslint@9.0.0             ← 프로젝트 의존성
      └── @next/eslint-plugin-next
          └── node_modules
              └── eslint@8.0.0    ← 플러그인이 자체 설치한 eslint (중복!)

해결 (peerDependencies 사용):
  프로젝트
  └── node_modules
      ├── eslint@9.0.0             ← 하나만 설치됨
      └── @next/eslint-plugin-next  ← eslint를 직접 안 설치, 호스트 것 공유
```

---

## 종합

`peerDependencies`는 두 가지 역할을 동시에 한다 — 중복 설치 방지와 호환 버전 명시. ESLint 플러그인, Babel 플러그인, React 컴포넌트 라이브러리처럼 "다른 패키지의 생태계 확장"으로 만들어진 패키지에서 필수 패턴이다. 호스트 패키지가 이미 있다는 전제로 작동하기 때문에 직접 `npm install`하는 것이 아니라 프로젝트에 원래 있는 인스턴스를 공유한다.

---

# peerDependencies는 npm 버전에 따라 어떻게 동작하는가?

## 도입

같은 `peerDependencies` 선언이라도 npm 버전에 따라 자동 설치 여부가 달라진다. npm v7의 동작 변경이 실무에서 이슈가 됐다.

---

## 본문

> In npm versions 3 through 6, peerDependencies were not automatically installed, and would raise a warning if an invalid version of the peer dependency was found in the tree.
> As of npm v7, peerDependencies are installed by default.
> Trying to install another plugin with a conflicting requirement may cause an error if the tree cannot be resolved correctly.

"npm 3~6 버전에서 peerDependencies는 자동 설치되지 않았고, 트리에서 유효하지 않은 버전이 발견되면 경고만 발생했다. npm v7부터 peerDependencies는 기본으로 설치된다. 트리가 올바르게 해석될 수 없으면 충돌 요건을 가진 다른 플러그인 설치 시 에러가 발생할 수 있다."

- **not automatically installed (v3~6)**: 사용자가 `peerDependencies`를 직접 설치해야 했다. 경고는 떴지만 자동 해결이 안 됐다.
- **installed by default (v7+)**: npm이 peerDependencies를 자동으로 설치한다. 호스트가 없으면 자동으로 추가된다.
- **may cause an error**: 두 플러그인이 서로 다른 peer 버전을 요구하면 충돌 → 설치 실패.

```
npm v6:
  경고: "react@18이 필요한데 react@17이 설치됨"
  → 그냥 설치됨, 개발자가 수동으로 해결

npm v7+:
  에러: "react@18 >=18이어야 하는데 react@17이 있음"
  → 설치 실패, 버전 정합이 맞아야 진행됨
```

---

## 종합

npm v7 이후 peerDependencies 충돌이 설치 에러로 표면에 드러난다. 이는 충돌을 숨기는 것보다 낫지만, `--legacy-peer-deps` 플래그로 우회하는 경우가 생겼다. 이 플래그는 v6 동작으로 되돌리는 것이므로 근본적 해결이 아니다 — 실제로 peerDependencies 버전 범위를 맞추는 것이 올바른 해결이다.

---

# peerDependencies 버전 범위는 어떻게 작성해야 하는가?

## 도입

`peerDependencies`에 너무 좁은 버전 범위를 지정하면 사용자가 버전을 맞추지 못해 설치에 실패한다. 가능한 넓게 잡는 것이 원칙이다.

---

## 본문

> For this reason, make sure your plugin requirement is as broad as possible, and not to lock it down to specific patch versions.
> Assuming the host complies with semver, only changes in the host package's major version will break your plugin.
> Thus, if you've worked with every 1.x version of the host package, use "^1.0" or "1.x" to express this.
> If you depend on features introduced in 1.5.2, use "^1.5.2".

"플러그인 요구 사항을 가능한 한 넓게 만들고 특정 패치 버전에 고정하지 말 것. 호스트가 semver를 준수한다고 가정하면 호스트 패키지의 major 버전 변경만이 플러그인을 깨뜨린다. 따라서 1.x 모든 버전에서 동작하면 '^1.0' 또는 '1.x'를 쓴다. 1.5.2에서 도입된 기능에 의존하면 '^1.5.2'를 쓴다."

- **as broad as possible**: 좁게 잡으면 사용자가 정확히 그 버전을 쓰지 않으면 설치 에러가 난다.
- **semver**: Major.Minor.Patch. Major 변경만 breaking change. Minor/Patch는 하위 호환 보장.
- **"^1.0"**: `>=1.0.0 <2.0.0`을 의미하는 semver 범위. 1.x 전체 허용.

```json
{
  "peerDependencies": {
    "react": ">=16.8.0"  // hooks 도입 버전 이상 전부 허용
    // 나쁜 예: "react": "18.2.0"  ← 정확히 이 버전만 허용, 너무 좁음
  }
}
```

---

## 종합

좁은 peerDependencies 범위는 사용자 경험을 해친다. React 18.2.0을 정확히 요구하면 18.2.1을 쓰는 사용자도 설치 에러를 마주한다. semver 원칙상 major 버전 변경만이 API 호환을 깨뜨리므로, 검증된 major 범위 내에서는 `^X.0.0` 또는 `>=X.0.0` 형태로 넓게 지정하는 것이 라이브러리 사용성을 높인다.

---

# peerDependencies는 의존성 그래프에 어떻게 나타나는가?

## 도입

`npm install tea-latte`를 실행하면 `tea-latte`뿐 아니라 `peerDependencies`에 명시된 패키지도 함께 설치된다. 의존성 그래프에서 이 관계를 볼 수 있다.

---

## 본문

> This ensures your package @npm/tea-latte can be installed along with the second major version of the host package @npm/tea only.
> npm install tea-latte could possibly yield the following dependency graph:
> ```
> ├── @npm/tea-latte@1.3.5
> └── @npm/tea@2.2.0
> ```

"이렇게 하면 @npm/tea-latte 패키지가 호스트 패키지 @npm/tea의 두 번째 major 버전과 함께 설치될 수 있음을 보장한다. npm install tea-latte는 다음과 같은 의존성 그래프를 생성할 수 있다."

- **├── @npm/tea-latte@1.3.5**: 사용자가 직접 설치를 요청한 패키지.
- **└── @npm/tea@2.2.0**: peerDependencies에 의해 자동 설치된 호스트 패키지. 같은 최상위 레벨에 나타남 — 중첩되지 않고 나란히 위치한다.

`npm ls` 또는 `npm list` 명령으로 현재 프로젝트의 의존성 그래프를 확인할 수 있다:

```
$ npm ls
my-project@1.0.0
├── @npm/tea-latte@1.3.5
└── @npm/tea@2.2.0
```

---

## 종합

peerDependencies로 설치된 패키지는 `dependencies`로 설치된 것과 같은 레벨에 위치한다. `dependencies`는 각 패키지 아래에 중첩(nested) 설치되지만, peerDependencies는 최상위에 공유 인스턴스로 설치된다. `npm ls --depth=0`으로 최상위 패키지만 보면 peerDependencies가 함께 설치됐는지 확인할 수 있다.

---

# [UNVERIFIED] 의존성 그래프는 왜 보여주는가?

## 도입

`npm ls` 출력의 트리 구조는 "어떤 패키지가 어떤 패키지를 필요로 하는가"를 시각화한다. 버전 충돌 디버깅에서 핵심 도구다.

---

## 본문

의존성 그래프의 용도는 OA 없이 실무 원칙으로 정리한다.

```bash
$ npm ls react
my-project@1.0.0
└─┬ next@14.0.0
  └── react@18.2.0
└── react@18.2.0   ← 직접 의존성
```

---

# peerDependencies 사용 예시는?

## 도입

실제 패키지의 `peerDependencies` 선언을 보면 이 필드의 목적과 버전 범위 작성 방식을 구체적으로 이해할 수 있다.

---

## 본문

> ```json
> {
>   "name": "@next/eslint-plugin-next",
>   "version": "13.x.x",
>   "peerDependencies": {
>     "eslint": ">=8.0.0",
>     "react": ">=17.0.0 || >=18.0.0"
>   }
> }
> ```

"`@next/eslint-plugin-next` 패키지는 ESLint 8.0.0 이상이 반드시 설치되어 있어야 동작한다는 의미다."

- **">=8.0.0"**: ESLint 8 이상 전부 허용. 9.x도 포함. 최소 버전만 지정해서 넓은 호환성.
- **">=17.0.0 || >=18.0.0"**: React 17 이상이거나 18 이상. 실질적으로 `>=17.0.0`과 동일하지만, 의도를 명확히 표현한다.

라이브러리 프로젝트에서의 실천:
```json
// 컴포넌트 라이브러리의 package.json
{
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  },
  "devDependencies": {
    "react": "^18.0.0",       // 개발/테스트에는 최신 버전 사용
    "react-dom": "^18.0.0"
  }
}
// react는 peerDependencies로만 선언 → 번들에 포함 안 됨
// 소비자의 프로젝트에 있는 react를 공유해서 사용
```

---

## 종합

라이브러리 패키지에서 React, ESLint 같은 호스트 패키지를 `dependencies`에 넣으면 소비자 프로젝트에 두 개의 React 인스턴스가 생겨 훅(Hooks) 규칙 위반 에러가 발생한다 — React는 앱 전체에 단일 인스턴스여야 하기 때문이다. `peerDependencies`로 선언하면 소비자 프로젝트의 React를 공유해서 이 문제를 피할 수 있다.
