# 정보 은닉이란 무엇인가?

## 도입

먼저 이름에서 오는 오해를 걷어내야 한다. "정보 은닉"은 영어 information hiding의 역어이고, 한국어 위키백과도 「정보 은닉」을 표제어로 쓰면서 「정보 감춤」·「정보 은폐」를 같은 뜻의 다른 표기로 병기한다. 억지 번역이 아니라 정착된 역어다.

문제는 "은닉"이라는 말이 **보안**처럼 읽힌다는 점이다. 비밀을 감춰 남이 못 보게 막는 것, 권한 없는 접근을 차단하는 것. 이 개념은 그런 이야기가 아니다. 영어 원문 문서도 첫 줄에 "메시지나 파일 안에 데이터를 숨기는 기법(스테가노그래피)이나 암호화(cryptography)를 찾는다면 다른 문서로 가라"는 안내를 따로 달아둔다. 헷갈리기 쉬운 지점이라 문서가 아예 못을 박아둔 것이다.

이 원칙의 요점은 "바깥에서 못 보게 한다"가 아니라 **"바뀔 것 같은 결정을 한 군데 몰아넣어, 그게 바뀌었을 때 프로그램의 나머지가 흔들리지 않게 한다"**이다. 목적이 기밀 유지가 아니라 변경 파급 차단이다.

---

## 본문

> In computer science, information hiding is the principle of segregation of the design decisions in a computer program that are most likely to change, thus protecting other parts of the program from extensive modification if the design decision is changed.

"컴퓨터 과학에서 정보 은닉은, 프로그램 안에서 가장 바뀔 가능성이 큰 설계 결정들을 따로 떼어 격리하는 원칙이다. 그렇게 해서 그 설계 결정이 실제로 바뀌었을 때 프로그램의 다른 부분들이 대대적으로 고쳐지는 일을 막는다."

- **segregation**: "격리·분리". hiding(숨김)이 아니라 segregation을 정의어로 쓴 것이 이 개념의 성격을 그대로 드러낸다. 감추는 행위가 아니라 **한곳에 몰아 가두는 배치**가 본질이다.
- **design decisions**: 코드를 쓸 때 내린 선택. "이 값을 배열로 담을까 객체로 담을까", "저장은 localStorage로 할까 서버로 할까" 같은 것들. 감춰야 할 대상이 비밀번호 같은 *데이터*가 아니라 *결정*이라는 점이 중요하다.
- **most likely to change**: 전부를 숨기라는 게 아니다. **바뀔 확률이 높은 것**만 골라 격리하라는 것이다. 무엇을 숨길지 고르는 기준이 여기 있다.
- **extensive modification**: "광범위한 수정". 한 줄 고치려다 서른 파일을 열게 되는 상황. 이게 이 원칙이 막으려는 대상이다.

> The protection involves providing a stable interface which protects the remainder of the program from the implementation (whose details are likely to change).

"그 보호는, 안정적인 인터페이스를 제공해서 프로그램의 나머지 부분을 구현(그 세부는 바뀌기 쉽다)으로부터 차단하는 방식으로 이뤄진다."

- **stable interface**: 자주 바뀌지 않는 약속된 접점. 함수 시그니처, 모듈이 `export`하는 것들, 컴포넌트의 props 타입이 여기 해당한다.
- **protects ... from the implementation**: 이 표현의 방향이 재밌다. 보호받는 쪽은 구현이 아니라 **프로그램의 나머지**다. 즉 "구현을 지킨다"가 아니라 "구현이 흔들려도 나머지가 안 다치게 한다"는 뜻이다. 보안 뉘앙스가 아니라는 증거가 여기 또 있다.
- **the remainder of the program**: 호출하는 쪽 전부. 이 개념의 수혜자다.

```
정보 은닉이 아닌 것              정보 은닉인 것

기밀 유지                        변경 파급 차단
"권한 없는 자가 못 본다"          "바뀌어도 남이 안 깨진다"
공격자가 상대                    미래의 변경이 상대
암호화·스테가노그래피 영역        모듈 설계 영역
```

> Information hiding serves as an effective criterion for dividing any piece of equipment, software, or hardware, into modules of functionality.

"정보 은닉은 어떤 장비든, 소프트웨어든 하드웨어든, 기능 단위 모듈로 쪼갤 때 쓸 수 있는 효과적인 기준 역할을 한다."

- **criterion**: "기준". 이 단어가 핵심이다. 정보 은닉은 결과물이 아니라 **어디에 선을 그을지 정하는 잣대**다. 모듈을 나눠야 하는데 어디서 잘라야 할지 모를 때, "이 경계 안에 바뀔 것 같은 결정이 갇히나?"를 물어 답을 얻는다.
- **any piece of equipment, software, or hardware**: 소프트웨어 전용 원칙이 아니라는 선언. 실제로 원문은 뒤에서 자동차를 예로 들어 설명한다.
- **modules of functionality**: 기능 단위 모듈. 결합도를 낮추는 접근으로 이미 본 "기능 설계"와 같은 방향이다.

---

## 종합

세 조각을 이으면 이렇게 된다.

- **무엇을**: 바뀔 확률이 높은 설계 결정을
- **어떻게**: 한 자리에 격리하고, 그 앞에 잘 안 바뀌는 인터페이스를 세워서
- **왜**: 그 결정이 실제로 바뀔 때 프로그램의 나머지가 안 흔들리게

이게 없으면 어떻게 되는가. 날짜 포맷을 `"2026-07-29"` 문자열로 정한 결정이 서른 개 파일에 흩어져 있다고 해보자. Date 객체로 바꾸기로 하면 서른 개를 다 열어야 하고, 하나 빠뜨리면 런타임에서 터진다. 반대로 그 결정이 `date.ts` 한 파일 안에만 있고 나머지는 `formatDate()`만 부르고 있었다면, 고칠 곳은 한 파일이다.

그래서 이 원칙은 "무엇을 숨길까"보다 **"무엇이 바뀔 것 같은가"**를 먼저 묻게 만든다. 안 바뀔 것을 숨겨봐야 얻는 게 없고, 바뀔 것을 노출해두면 나중에 값을 치른다. 모듈 경계를 어디 그을지 헤맬 때 쓰는 잣대라는 점에서, 응집도·결합도와 같은 층에 있는 설계 원칙이다.

---

# 정보 은닉은 코드에서 어떤 수단으로 이뤄지는가?

## 도입

앞에서 본 것이 "왜"라면 여기는 "어떻게"다. 격리를 실제로 강제하는 수단은 크게 두 종류다. 언어가 문법으로 막아주는 것과, 팀이 규칙으로 정하는 것.

---

## 본문

> Written in another way, information hiding is the ability to prevent certain aspects of a class or software component from being accessible to its clients, using either programming language features (like private variables) or an explicit exporting policy.

"달리 표현하면, 정보 은닉은 클래스나 소프트웨어 컴포넌트의 특정 측면을 그 사용자들이 접근하지 못하게 막는 능력이다. 프로그래밍 언어가 제공하는 기능(private 변수 같은 것)을 쓰거나, 명시적인 공개 정책을 통해 이뤄진다."

- **Written in another way**: 앞 정의를 다른 각도에서 다시 쓴 것이라는 표시. 새 내용이 아니라 같은 것의 실행 관점 서술이다.
- **certain aspects**: "특정 측면". 전부가 아니라 일부다. 다 막으면 모듈은 아무 쓸모가 없다. 쓰라고 열어둔 문이 인터페이스이고, 그 뒤가 막는 대상이다.
- **clients**: 그 모듈을 가져다 쓰는 쪽. 사람 고객이 아니라 **호출하는 코드**다. 다른 모듈, 다른 컴포넌트, 다른 패키지가 전부 client다.
- **programming language features**: 문법이 강제하는 수단. JS라면 클래스의 `#privateField`, 모듈에서 `export`하지 않은 최상위 변수, 클로저에 갇힌 변수가 여기 해당한다. 이건 안 지키면 **에러가 나거나 애초에 못 닿는다**.
- **explicit exporting policy**: 문법이 아니라 정해둔 공개 방침. 무엇을 바깥에 내놓을지 명시하는 규칙이다. npm 패키지의 `exports` 필드로 진입점을 몇 개만 열어두거나, 폴더의 `index.ts`만 공개 창구로 삼고 내부 파일 직접 import를 lint 규칙으로 막는 방식이 그 예다.

```js
// 언어 기능: 문법이 막는다
class Counter {
  #count = 0;            // 밖에서 counter.#count 하면 문법 에러
  increment() { this.#count++; }
  get value() { return this.#count; }   // 열어둔 문
}

// 모듈 스코프: export 안 한 것은 애초에 닿을 수 없다
let cache = new Map();   // 파일 밖에서 접근 불가
export function get(key) { return cache.get(key); }
```

`#count`를 숨긴 이유가 "이 숫자가 비밀이라서"가 아니라는 점을 다시 짚어둘 만하다. `value`가 노출돼 있으니 값 자체는 다 보인다. 숨긴 것은 **"이 카운터를 숫자 하나로 들고 있기로 한 결정"**이다. 나중에 이력을 배열로 쌓아 길이를 세는 방식으로 바꿔도, 밖에서 쓰던 `increment()`·`value`는 그대로다.

두 수단의 차이는 **강제력**이다.

- 언어 기능: 어길 수 없다. 대신 언어가 주는 만큼만 쓸 수 있다.
- 공개 정책: 무엇에든 적용할 수 있다. 대신 사람이나 도구(lint)가 지켜야 하고, 마음먹으면 뚫린다.

---

## 종합

정보 은닉은 원칙이지 문법이 아니다. 그래서 이 문장은 원칙을 실물로 만드는 두 갈래를 함께 제시한다.

- 언어가 막아주는 것: `#private`, `export` 안 함, 클로저
- 팀이 정해서 지키는 것: 공개 진입점 지정, import 제한 규칙

한쪽만으로는 부족하다. 언어 기능은 클래스·모듈 같은 작은 단위에서만 통하고, 패키지·레이어·서비스 같은 큰 경계는 문법이 지켜주지 않으니 명시적 정책이 필요하다. 반대로 정책만 있고 언어 수단을 안 쓰면, 급할 때 누군가 내부를 직접 만지고 그때 격리가 무너진다.

---

# 데이터를 물리적으로 어떤 형태로 담고 있는지를 숨기면 무엇이 달라지는가?

## 도입

정보 은닉이 실제로 가장 자주 쓰이는 자리가 여기다. "이 데이터를 어떤 모양으로 담아둘 것인가"는 프로그램에서 유난히 잘 바뀌는 결정이고, 그래서 격리 대상 1순위가 된다.

---

## 본문

> A common use of information hiding is to hide the physical storage layout for data so that if it is changed, the change is restricted to a small subset of the total program.

"정보 은닉의 흔한 용도 하나는 데이터의 물리적 저장 배치를 숨기는 것이다. 그렇게 하면 그 배치가 바뀌더라도 변경이 프로그램 전체 중 작은 일부로 제한된다."

- **physical storage layout**: 데이터를 메모리·저장소에 실제로 어떤 모양으로 늘어놓았는가. 변수 몇 개로 흩어놨는지, 배열 하나에 몰아넣었는지, 객체 필드로 묶었는지 같은 것. "논리적으로 무엇인가"(3차원 좌표)와 "물리적으로 어떻게 담겨 있는가"(변수 3개 vs 길이 3짜리 배열)는 별개다.
- **restricted to a small subset**: "작은 일부로 제한". 변경이 사라지는 게 아니다. 반드시 어딘가는 고쳐야 한다. 다만 **고칠 곳의 개수**가 달라진다. 이 원칙이 파는 것은 무변경이 아니라 변경 범위의 축소다.

원문이 드는 예가 정확히 이 상황이다.

> For example, if a three-dimensional point (x, y, z) is represented in a program with three floating-point scalar variables and later, the representation is changed to a single array variable of size three, a module designed with information hiding in mind would protect the remainder of the program from such a change.

3차원 좌표를 실수형 변수 세 개로 들고 있다가, 나중에 크기 3짜리 배열 하나로 바꾸기로 했다고 하자. 좌표가 "3차원의 점"이라는 사실은 하나도 안 바뀌었다. 바뀐 것은 담는 모양뿐이다. 그런데 이 모양을 바깥이 다 알고 있었다면 좌표를 만지던 코드가 전부 깨진다.

```js
// 표현이 노출된 경우: 쓰는 쪽이 "변수 3개"라는 모양을 알고 있다
const p = { x: 1, y: 2, z: 3 };
draw(p.x, p.y, p.z);          // ← 배열로 바꾸면 여기가 전부 깨진다

// 표현이 격리된 경우: 쓰는 쪽은 모양을 모른다
const p = createPoint(1, 2, 3);
draw(...toArray(p));          // 내부가 변수 3개든 배열이든 여기는 그대로
```

`p.x`를 쓰는 곳이 프로젝트 전체에 200군데 있다면 표현 변경은 200군데 수정이다. `createPoint`·`toArray`만 쓰고 있었다면 고칠 곳은 그 함수들이 사는 파일 하나다.

```
표현이 노출됐을 때              표현이 격리됐을 때

  [모듈 A] p.x, p.y, p.z         [모듈 A] ─┐
  [모듈 B] p.x, p.y, p.z         [모듈 B] ─┼→ createPoint / toArray
  [모듈 C] p.x, p.y, p.z         [모듈 C] ─┘        │
                                                    ↓
  표현 변경 → A·B·C 전부 수정     표현 변경 → 이 한 곳만 수정
```

---

## 종합

저장 형태는 바뀌기 쉬운 대표적 결정이다. 성능 때문에 바꾸기도 하고(객체 배열 → 인덱스 맵), 라이브러리 요구 때문에 바꾸기도 하고, 데이터가 커져서 바꾸기도 한다. 그래서 앞 섹션에서 본 "가장 바뀔 가능성이 큰 것을 골라 격리하라"의 가장 전형적인 적용 대상이 된다.

여기서 얻는 이득은 **고칠 곳의 개수가 프로젝트 크기와 무관해진다**는 점이다. 표현이 노출돼 있으면 수정 비용이 사용처 수에 비례해 커지고, 프로젝트가 클수록 그 결정을 바꾸기 두려워진다. 격리해두면 프로젝트가 아무리 커져도 수정 지점은 한 자리로 유지된다.

---

# 정보 은닉으로 잘 나뉜 프로그램에서 변경은 어떻게 달라지는가?

## 도입

앞 섹션이 "한 번의 변경이 얼마나 퍼지는가"를 다뤘다면, 여기는 그게 프로그램의 **수명 전체**에 무슨 의미인지를 다룬다. 프로그램은 한 번 만들고 끝나지 않고 계속 고쳐지는데, 그 반복되는 수정이 쉬운가 어려운가가 갈린다.

---

## 본문

> As can be seen by this example, information hiding provides flexibility.

"이 예에서 보이듯, 정보 은닉은 유연성을 제공한다."

- **flexibility**: "유연성". 막연한 칭찬처럼 들리지만 여기선 뜻이 좁다. **나중에 마음을 바꿀 수 있는 여지**다. 지금 잘 돌아가는 것이 아니라, 나중에 바꿀 때 싸게 바꿀 수 있는 것.

원문이 가리키는 "이 예"는 자동차 이야기인데, 그중 이해에 특히 도움이 되는 것이 "플랫폼"이다. 자동차 회사는 여러 모델이 같은 바닥 구조를 공유하게 만든다. 그리고 그 바닥 구조는 **세단에 쓰일지 해치백에 쓰일지 정해지지 않은 채로도** 설계하고 만들 수 있다. 위에 뭘 얹을지 몰라도 되도록 경계와 접점을 정해뒀기 때문이다. 유연성이란 이런 것이다. 결정을 나중으로 미룰 수 있고, 미뤄둔 쪽을 바꿔도 바닥은 그대로다.

> This flexibility allows a programmer to modify the functionality of a computer program during normal evolution as the computer program is changed to better fit the needs of users.

"이 유연성 덕분에 프로그래머는 통상적인 발전 과정에서 프로그램의 기능을 수정할 수 있다. 사용자의 필요에 더 잘 맞도록 프로그램이 바뀌어 가는 그 과정에서 말이다."

- **normal evolution**: "통상적인 진화". 이 단어 선택이 중요하다. 변경을 사고나 실패가 아니라 **정상적이고 당연한 일**로 못 박는다. 요구사항은 원래 바뀐다는 전제에서 출발하는 원칙이다.
- **to better fit the needs of users**: 변경의 이유. 코드가 나빠서 고치는 게 아니라 사용자에게 더 맞추려고 고친다. 즉 변경은 계속 일어날 수밖에 없다.

> When a computer program is well designed, decomposing the source code solution into modules using the principle of information hiding, evolutionary changes are much easier because the changes typically are local rather than global changes.

"프로그램이 잘 설계되어, 정보 은닉 원칙에 따라 소스 코드를 모듈로 분해해뒀다면, 진화적 변경이 훨씬 쉬워진다. 변경이 대체로 전역이 아니라 지역에 머물기 때문이다."

- **decomposing ... into modules**: "분해". 모듈로 나누는 행위 자체가 아니라, **정보 은닉을 기준 삼아** 나누는 것이 조건이다. 아무렇게나 파일을 쪼개는 것과는 다르다.
- **local rather than global**: 이 문장의 결론. 지역 변경이란 한 모듈 안에서 끝나는 수정이고, 전역 변경이란 여러 모듈을 함께 건드려야 하는 수정이다.

```
전역 변경 (badly decomposed)      지역 변경 (well decomposed)

  [A]──┐                            [A]──┐
  [B]──┼─ 함께 고쳐야 함             [B]──┼→ [경계] → [C] ← 여기만 고침
  [C]──┘                            [D]──┘
  ↑ 어디까지 퍼지는지 모름          ↑ 퍼지는 범위가 경계에서 멈춤
```

---

## 종합

세 문장이 하나의 논지를 이룬다. 변경은 정상이고(normal evolution), 잘 나뉜 프로그램에서는 그 변경이 지역에 머물며(local rather than global), 그 결과가 유연성(flexibility)이다.

실무에서 이 차이는 체감으로 먼저 온다. 지역 변경만 나는 코드베이스에서는 티켓 하나에 파일 두세 개를 열고 끝나고, 리뷰도 짧고, 회귀 위험도 그 모듈 안에 갇힌다. 전역 변경이 잦은 코드베이스에서는 "이거 고치면 어디까지 영향 가지?"를 아무도 자신 있게 답하지 못하고, 그 불확실성이 쌓이면 팀은 결국 고치는 대신 우회로를 만든다. 우회로가 쌓이면 다음 변경은 더 어려워진다.

그래서 정보 은닉이 파는 것은 오늘의 편의가 아니라 **미래 변경의 예측 가능성**이다. 지금 경계를 긋는 비용을 내고, 나중에 고칠 때 "여기만 보면 된다"는 확신을 산다.

---

# 객체지향에서 정보 은닉은 코드의 의존 대상을 어떻게 바꾸는가?

## 도입

지금까지는 "변경이 덜 퍼진다"를 결과로 봤다. 여기서는 그 결과가 나오는 **구조적 이유**를 짚는다. 핵심은 의존의 화살표가 무엇을 가리키느냐가 바뀐다는 것이다.

---

## 본문

> In object-oriented programming, information hiding (by way of nesting of types) reduces software development risk by shifting the code's dependency on an uncertain implementation (design decision) onto a well-defined interface.

"객체지향 프로그래밍에서 정보 은닉은 (타입을 중첩하는 방식으로) 소프트웨어 개발 위험을 줄인다. 코드가 불확실한 구현(설계 결정)에 걸고 있던 의존을 잘 정의된 인터페이스 쪽으로 옮김으로써 그렇게 한다."

- **nesting of types**: 타입 안에 타입을 품는 것. 클래스가 자기 내부에서만 쓰는 자료구조를 안쪽에 두고 바깥에 안 내놓는 배치다. 안쪽에 있는 것은 바깥에서 이름조차 부를 수 없으니 의존이 생길 수 없다.
- **risk**: "위험". 여기서 위험이란 **바뀔 줄 몰랐던 것이 바뀌어 코드가 깨질 가능성**이다. 위험이 줄어드는 이유는 의존 대상을 바뀔 것에서 안 바뀔 것으로 옮겼기 때문이다.
- **shifting ... onto**: "옮긴다". 의존을 없애는 게 아니라 **대상을 바꾼다**. 의존 자체는 남는다. 아무것에도 의존하지 않는 코드는 아무 일도 못 한다.
- **uncertain implementation**: "불확실한 구현". 구현이 틀렸다는 뜻이 아니라, **앞으로 바뀔지 어떨지 확신할 수 없다**는 뜻이다. 앞에서 본 "가장 바뀔 가능성이 큰 설계 결정"이 여기서는 uncertain으로 불린다.
- **well-defined interface**: 무엇을 받고 무엇을 돌려주는지가 확정된 접점. uncertain의 반대말로 놓였다는 데 주목할 만하다. 대비 축이 "감춤 vs 드러남"이 아니라 **"불확실 vs 확정"**이다.

```
정보 은닉 전                     정보 은닉 후

  [client]                         [client]
     │                                │
     ↓ 의존                           ↓ 의존
  [구현: 바뀔 수 있음]            [인터페이스: 확정, 잘 안 바뀜]
                                      ↑ 만족
                                  [구현: 바뀔 수 있음]

  구현 변경 → client 깨짐         구현 변경 → client 그대로
```

> Clients of the interface perform operations purely through the interface, so, if the implementation changes, the clients do not have to change.

"인터페이스의 사용자들은 오로지 인터페이스를 통해서만 동작을 수행한다. 그래서 구현이 바뀌어도 사용자들은 바뀌지 않아도 된다."

- **purely through**: "오로지 ~를 통해서만". 이 단어가 조건이다. 90%만 인터페이스로 쓰고 나머지 10%는 내부를 직접 만지면, 그 10% 때문에 구현 변경이 그대로 client를 깬다. 정보 은닉은 **한 군데만 새도 그만큼 무너지는** 원칙이다.
- **do not have to change**: "바뀔 필요가 없다". 바뀌지 않는다가 아니라 바뀔 **필요**가 없다는 것. 결과가 아니라 보장에 대한 서술이다.

---

## 종합

이 두 문장은 정보 은닉의 이득을 위험 관리의 언어로 다시 쓴 것이다.

- 코드는 무언가에 반드시 의존한다. 의존을 없앨 수는 없다.
- 그러니 **무엇에 의존할지**를 고른다.
- 바뀔지 모르는 것(구현)에 걸면 위험이 크고, 확정된 것(인터페이스)에 걸면 작다.

앞 섹션들과 이어보면 그림이 완성된다. 바뀔 것 같은 결정을 격리하고(첫 섹션), 언어 기능이나 공개 정책으로 접근을 막고(둘째), 그 결과 표현이 바뀌어도 고칠 곳이 한 자리로 줄고(셋째), 변경이 지역에 머물며(넷째), 그 이유는 모두가 확정된 접점만 바라보고 있기 때문이다(여기).

그리고 `purely through`라는 단서가 이 모든 것의 전제다. 인터페이스를 세워둬도 누군가 뒷문으로 내부를 만지기 시작하면, 그때부터 구현은 더 이상 자유롭게 바꿀 수 없는 것이 된다.

---

# 캡슐화란 무엇인가?

## 도입

정보 은닉을 이야기하면 거의 항상 캡슐화가 따라 나온다. 여기서는 먼저 캡슐화 자체의 정의를 본다. 인용된 정의는 객체지향 설계 책에서 Grady Booch가 내린 것이다.

---

## 본문

> In his book on object-oriented design, Grady Booch defined encapsulation as "the process of compartmentalizing the elements of an abstraction that constitute its structure and behavior; encapsulation serves to separate the contractual interface of an abstraction and its implementation."

"객체지향 설계에 관한 자신의 책에서 Grady Booch는 캡슐화를 이렇게 정의했다. '어떤 추상의 구조와 행동을 이루는 요소들을 칸막이로 나눠 담는 과정이다. 캡슐화는 추상의 계약적 인터페이스와 그 구현을 분리하는 역할을 한다.'"

- **compartmentalizing**: "칸으로 나눠 담기". compartment는 열차의 객실이나 서랍의 칸이다. 여기서도 "없앤다·감춘다"가 아니라 **칸을 지어 그 안에 넣는다**는 배치의 이미지다. 정보 은닉의 segregation과 같은 계열의 단어라는 점이 눈에 띈다.
- **abstraction**: 여기서는 "추상적 개념"이 아니라 **우리가 하나로 다루기로 한 대상**을 뜻한다. `Counter`, `HttpClient`, `useAuth` 같은 것 하나하나가 abstraction이다.
- **structure and behavior**: 그 대상이 가진 것 두 가지, 즉 들고 있는 데이터(구조)와 할 수 있는 일(행동). 클래스로 치면 필드와 메서드, 훅으로 치면 state와 그걸 다루는 함수들이다. 칸에 담기는 것은 이 둘 다이다.
- **contractual interface**: "계약으로서의 인터페이스". contract라는 말이 중요하다. 인터페이스는 단순한 접점이 아니라 **약속**이다. 이렇게 부르면 이렇게 응답하겠다는 것. 약속이니 함부로 못 바꾸고, 그래서 안정적일 수 있다.
- **separate ... and ...**: 정의문의 동사가 결국 "분리하다"다. 캡슐화의 결과물은 **약속(인터페이스)과 실행(구현) 사이에 그어진 선**이다.

이 정의를 실물로 옮기면 디지털 알람시계 이야기가 된다. 시계 내부에 어떤 부품이 들어 있는지 전혀 모르는 사람도 시계를 쓸 수 있다. 버튼과 화면이라는 접점만 알면 되기 때문이다. 게다가 시계를 다른 모델로 바꿔도, 버튼과 화면이 같은 방식으로 동작한다면 쓰던 대로 그냥 쓴다. 여기서 버튼과 화면이 contractual interface이고, 내부 부품이 implementation이다.

같은 구조가 자동차와 운전자 사이에도 있다. 자동차는 페달·핸들·변속레버·방향지시등·계기판이라는 표준 접점을 운전자에게 내놓는다. 사람들이 배우고 면허를 따는 대상은 이 접점이지 특정 차종의 내부가 아니다. 그래서 새 모델을 탈 때마다 운전을 처음부터 다시 배우지 않는다.

```
        contractual interface          implementation
알람시계   버튼 · 화면              ↔  내부 회로·부품
자동차     페달 · 핸들 · 계기판      ↔  엔진·변속기 구조
Counter    increment() · value      ↔  #count를 숫자로 들고 있음
```

---

## 종합

정의를 조각내면 이렇다.

- **무엇을 담나**: 한 대상의 구조(데이터)와 행동(기능)을
- **어떻게**: 하나의 칸 안에 함께 넣고
- **그래서 무엇이 생기나**: 바깥에 내놓는 약속과 안쪽의 실행 사이에 선이 그어진다

주목할 점은 이 정의에 "숨긴다"는 말이 없다는 것이다. 나눠 담고 분리한다는 말뿐이다. 그런데 결과적으로 안쪽이 바깥에서 안 보이게 되니, 정보 은닉과 캡슐화가 자주 겹쳐 쓰이게 된다. 둘의 관계는 다음 질문에서 다룬다.

또 하나. 구조와 행동을 **함께** 담는다는 점이 중요하다. 데이터만 칸에 넣고 그걸 다루는 기능은 바깥에 흩어져 있으면, 결국 바깥이 데이터의 모양을 알아야 하므로 선이 그어지지 않는다.

---

# 정보 은닉과 캡슐화는 어떤 관계인가?

## 도입

두 용어는 실무에서 거의 같은 뜻으로 쓰이고, 실제로 구분이 합의되어 있지도 않다. 원문이 이 상황을 그대로 서술하면서, 구분하고 싶다면 이렇게 볼 수 있다는 한 가지 관점을 제시한다.

---

## 본문

> The term encapsulation is often used interchangeably with information hiding.

"캡슐화라는 용어는 정보 은닉과 자주 바꿔 쓰인다."

- **interchangeably**: "서로 바꿔서". 혼동이라고 하지 않고 **관행**으로 서술한다. 두 단어를 같은 뜻으로 쓰는 사람을 틀렸다고 할 근거는 없다는 뜻이다.

> Not all agree on the distinctions between the two, though; one may think of information hiding as being the principle and encapsulation being the technique.

"다만 둘의 구분에 모두가 동의하는 것은 아니다. 정보 은닉을 원칙으로, 캡슐화를 기법으로 볼 수도 있다."

- **Not all agree**: 이 구분이 **정설이 아니라는 명시적 단서**다. 표준 정의처럼 외울 것이 아니라, 유용한 한 가지 관점으로 받아들이면 된다.
- **one may think of**: "~로 생각해 볼 수 있다". 단정이 아니라 제안의 어법이다. 앞의 Not all agree와 짝을 이룬다.
- **principle**: 원칙. **무엇을 왜 해야 하는가**. 바뀔 것 같은 결정을 격리하라는 지침 자체.
- **technique**: 기법. **그것을 어떻게 하는가**. 인터페이스를 앞세운 칸에 담는 실행 방법.

> A software module hides information by encapsulating the information into a module or other construct which presents an interface.

"소프트웨어 모듈은 정보를 인터페이스를 제공하는 모듈이나 다른 구조물 안에 캡슐화함으로써 정보를 숨긴다."

- **hides ... by encapsulating**: 이 문장의 뼈대가 곧 앞의 구분을 문법으로 보여준다. 숨김이 목표이고 캡슐화가 수단이다.
- **or other construct**: 모듈만이 아니라 다른 구조물도 된다는 여지. 클래스, 함수, 패키지, 서비스 무엇이든 인터페이스를 내놓으면 된다.
- **presents an interface**: 캡슐화가 캡슐화이려면 갖춰야 할 조건. 그냥 담아 놓기만 하고 쓸 문을 안 내놓으면 그건 캡슐화가 아니라 그저 못 쓰는 코드다.

```
정보 은닉 (principle)   "바뀔 것 같은 결정을 격리해서 파급을 막아라"  ← 무엇을·왜
       │ 이것을 실현하는 수단이
       ↓
캡슐화 (technique)      "인터페이스를 내놓는 칸에 넣어라"           ← 어떻게
```

---

## 종합

정리하면 이렇다.

- 두 용어는 현실에서 자주 바꿔 쓰인다. 그렇게 쓴다고 틀린 것은 아니다.
- 굳이 나눈다면 정보 은닉이 목적이고 캡슐화가 그 목적을 이루는 수단이다.
- 이 구분은 합의된 정설이 아니라 하나의 관점이다.

실무에서 이 구분이 쓸모 있는 자리는, 캡슐화를 했는데도 정보 은닉이 안 되는 경우를 설명할 때다. 클래스로 잘 묶어놓고 필드를 전부 공개해두면 칸은 있으되 선이 없다. 형태(기법)는 갖췄지만 목적(원칙)은 달성하지 못한 상태다. 목적과 수단을 구분해두면 이런 상황을 정확히 짚을 수 있다.

---

# 캡슐화가 노리는 것은 무엇인가?

## 도입

캡슐화가 무엇인지, 정보 은닉과 어떤 관계인지를 봤으니 이제 그것이 실제로 무엇을 벌어주는지를 본다. 원문은 세 가지를 제시한다.

---

## 본문

> The purpose is to achieve the potential for change: the internal mechanisms of the component can be improved without impact on other components, or the component can be replaced with a different one that supports the same public interface.

"목적은 변경의 여지를 확보하는 것이다. 컴포넌트의 내부 기계장치를 다른 컴포넌트에 영향을 주지 않고 개선할 수 있고, 또는 같은 공개 인터페이스를 지원하는 다른 것으로 그 컴포넌트를 통째로 교체할 수 있다."

- **potential for change**: "변경의 잠재력·여지". 앞에서 본 flexibility와 같은 것을 다르게 부른 말이다. 지금 당장의 이득이 아니라 **나중에 쓸 수 있는 선택권**을 사는 것이다.
- **internal mechanisms**: "내부 기계장치". 안쪽에서 실제로 일을 해내는 부분. mechanism이라는 단어가 "정보"보다 "장치"에 가깝다는 점이 다시 한번 보안과 무관함을 보여준다.
- **improved without impact**: 개선하되 영향은 없다. 성능을 고치거나 알고리즘을 바꾸는 일을 **남의 허락 없이** 할 수 있게 된다.
- **replaced with a different one**: 개선을 넘어 **통째 교체**. 조건은 하나다. same public interface.

원문의 자동차 예가 이 두 가지를 그대로 보여준다. 같은 차의 고급형과 일반형은 서로 다른 엔진을 쓴다. 고급형 엔진은 배기량이 더 크고 연료 분사 방식도 다르다. 그런데 두 엔진은 **같은 인터페이스**를 제공하도록 설계된다. 같은 엔진룸에 들어가고, 같은 변속기에 물리고, 같은 마운트와 조작계를 쓴다. 그래서 엔진이 달라도 나머지 차는 그대로다. 좌석도 마찬가지다. 가죽이든 플라스틱이든, 허리 지지대가 있든 없든, 고정부 규격만 같으면 나머지에 아무 영향이 없다.

> Encapsulation also protects the integrity of the component, by preventing users from setting the internal data of the component into an invalid or inconsistent state.

"캡슐화는 또한 컴포넌트의 무결성을 보호한다. 사용자가 컴포넌트의 내부 데이터를 유효하지 않거나 앞뒤가 안 맞는 상태로 만드는 것을 막음으로써 그렇게 한다."

- **integrity**: "무결성". 값이 항상 말이 되는 상태로 유지되는 성질. 보안의 기밀성과는 다른 개념이다. 나쁜 사람이 훔쳐보는 것을 막는 게 아니라, 선의의 사용자가 실수로 앞뒤 안 맞는 값을 넣는 것을 막는다.
- **invalid or inconsistent**: 둘이 다르다. invalid는 값 하나가 규칙을 어긴 것(나이가 -1), inconsistent는 값들끼리 앞뒤가 안 맞는 것(장바구니 목록은 비었는데 합계가 3000원). 내부 데이터를 직접 만지게 두면 특히 두 번째가 쉽게 깨진다.

```js
// 내부 노출: 앞뒤 안 맞는 상태를 만들 수 있다
cart.items = [];              // 목록만 비웠다
                              // cart.total은 3000 그대로 ← inconsistent

// 캡슐화: 상태 변경이 정해진 문을 통과한다
cart.clear();                 // 목록과 합계를 함께 정리한다
```

> Another benefit of encapsulation is that it reduces system complexity and thus increases robustness, by limiting the interdependencies between software components.

"캡슐화의 또 다른 이점은 시스템 복잡도를 낮추고 그로써 견고함을 높인다는 것이다. 소프트웨어 컴포넌트 사이의 상호의존을 제한함으로써 그렇게 한다."

- **interdependencies**: 컴포넌트들이 서로를 알고 있는 관계. 결합도에서 이미 본 그 상호의존이다. 캡슐화는 서로 알 수 있는 범위를 인터페이스로 좁혀 이 수를 줄인다.
- **complexity → robustness**: 인과의 방향이 눈여겨볼 만하다. 복잡도가 낮아져서 견고해진다. 사람이 전체를 머리에 담을 수 있으면 실수가 줄고, 예상 못 한 연쇄 반응도 줄어든다.
- **limiting**: "제한". 없애는 게 아니라 제한이다. 컴포넌트들은 서로 협력해야 하므로 의존은 남는다.

---

## 종합

세 가지 이득을 정리하면 이렇다.

- **바꿀 수 있게 된다**: 내부를 개선하거나, 같은 인터페이스를 지키는 다른 것으로 통째 교체할 수 있다.
- **깨지지 않게 된다**: 내부 데이터를 직접 못 만지니 유효하지 않거나 앞뒤 안 맞는 상태가 생기지 않는다.
- **단순해진다**: 서로 알아야 하는 관계의 수가 줄어 시스템 전체가 견고해진다.

첫 번째는 미래를 위한 것이고, 두 번째와 세 번째는 지금 당장의 것이다. 정보 은닉 쪽 서술이 주로 "나중에 바꿀 때 싸다"에 초점을 맞췄다면, 캡슐화 쪽은 여기에 **오늘의 안정성**을 더한다.

세 번째의 "상호의존을 제한한다"는 결합도 낮추기와 같은 이야기다. 캡슐화가 결합도를 낮추는 구체적 수단 중 하나라고 봐도 된다. 인터페이스만 알게 만들면 그 이상으로는 엮일 방법이 없다.

---

# 캡슐화는 객체지향 프로그래밍에서만 성립하는 개념인가?

## 도입

캡슐화는 보통 클래스·private 필드와 함께 배우기 때문에 객체지향 전용 문법 기능처럼 느껴진다. 원문은 그 반대를 말한다.

---

## 본문

> In this sense, the idea of encapsulation is more general than how it is applied in object-oriented programming.

"이런 의미에서 캡슐화라는 개념은 객체지향 프로그래밍에서 적용되는 방식보다 더 일반적이다."

- **In this sense**: 앞에서 말한 의미, 즉 "구조와 행동을 칸에 담아 약속과 구현 사이에 선을 긋는다"는 의미. 이 정의 어디에도 클래스나 객체가 없다는 점이 논지의 근거다.
- **more general than how it is applied**: 개념 자체가 넓고, 객체지향은 그 개념을 적용하는 **한 가지 방식**일 뿐이라는 것. 객체지향이 캡슐화의 정의가 아니라 사례다.

원문이 드는 예가 관계형 데이터베이스다. 데이터베이스가 바깥에 내놓는 공개 접점은 SQL 같은 질의 언어 하나뿐이고, 그것이 데이터베이스 관리 시스템의 내부 기계장치와 자료구조를 전부 가린다. 데이터가 디스크에 어떤 형식으로 쌓여 있는지, 인덱스가 어떤 자료구조인지, 질의를 어떤 순서로 처리하는지, 쓰는 쪽은 하나도 모르고, 알 필요도 없다. 여기 클래스도 객체도 없지만 캡슐화의 정의는 그대로 성립한다.

프론트엔드에서도 마찬가지 사례가 얼마든지 있다.

```js
// 객체도 클래스도 없다: 클로저가 칸 역할을 한다
function createStore(reducer, initial) {
  let state = initial;                    // 바깥에서 닿을 수 없음
  const listeners = new Set();            // 역시 닿을 수 없음

  return {                                // 내놓는 약속은 이 셋뿐
    getState: () => state,
    dispatch(action) { /* ... */ },
    subscribe(fn) { /* ... */ },
  };
}
```

`state`를 배열로 들든 Map으로 들든, 리스너를 Set으로 관리하든 배열로 관리하든, 쓰는 쪽은 `getState`·`dispatch`·`subscribe`만 안다. 클래스 문법을 한 글자도 안 썼지만 구조와 행동은 한 칸에 담겼고 약속과 구현 사이에 선이 그어졌다.

> As such, encapsulation is a core principle of good software architecture, at every level of granularity.

"그러므로 캡슐화는 좋은 소프트웨어 아키텍처의 핵심 원칙이며, 모든 크기 수준에서 그렇다."

- **core principle**: 여러 기법 중 하나가 아니라 핵심 원칙이라는 격상. 앞 질문에서 캡슐화를 "기법"으로 봤던 관점과 층위가 다른 서술인데, 여기서는 아키텍처 전반을 놓고 말하는 맥락이다.
- **at every level of granularity**: "모든 알갱이 크기 수준에서". 이 표현이 결론의 핵심이다. 함수 하나부터 시스템 전체까지, 크기와 무관하게 같은 원칙이 적용된다.

```
granularity (작음 → 큼)

  함수        내부 지역변수를 감추고 인자·반환값만 노출
  모듈        export한 것만 공개, 나머지는 파일 안에 갇힘
  패키지      진입점 몇 개만 열고 내부 파일 직접 import 금지
  서비스      HTTP API만 공개, DB 스키마는 바깥에서 안 보임
  시스템      질의 언어(SQL)만 공개, 저장 구조·인덱스는 전부 내부
```

---

## 종합

캡슐화가 객체지향 전용으로 오해받는 이유는, 대부분의 사람이 그것을 클래스와 `private` 키워드로 처음 배우기 때문이다. 하지만 정의를 다시 보면 클래스가 필요하다는 조건이 없다. 필요한 것은 두 가지뿐이다. 구조와 행동이 함께 담기는 칸, 그리고 그 칸이 바깥에 내놓는 약속.

이 조건은 어느 크기에서나 만족시킬 수 있다. 클로저를 쓴 함수도, `export`로 공개 범위를 정한 모듈도, HTTP API만 노출하는 서비스도, SQL만 내놓는 데이터베이스도 전부 같은 원칙의 사례다. 크기가 달라지면 칸을 만드는 수단(클로저·모듈 시스템·네트워크 경계)이 달라질 뿐, 원칙은 그대로다.

그래서 코드를 볼 때 물어야 할 것은 "이게 객체지향인가"가 아니라 **"이 경계 안쪽의 결정이 바뀌어도 바깥이 그대로인가"**다. 답이 그렇다면 이름이 클래스든 함수든 서비스든 캡슐화는 성립한 것이고, 답이 아니라면 클래스와 private 필드를 아무리 써도 성립하지 않은 것이다.
