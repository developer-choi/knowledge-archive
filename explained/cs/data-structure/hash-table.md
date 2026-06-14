# Hashing이란?

## 도입

Hashing은 임의 크기의 입력을 고정 크기 출력으로 변환하는 기법이다. 결과값(해시값)만 보고 원래 입력을 역으로 알아내기가 매우 어렵다는 특성이 있다. 비밀번호 저장, 데이터베이스 인덱싱, 해시 테이블 구현 모두 이 기법에 기반한다.

---

## 본문

> Hashing is a technique that generates a fixed-size output (hash value) using hash functions.

"Hashing은 해시 함수를 사용해 고정 크기 출력(해시값)을 생성하는 기법이다."

- **fixed-size output**: 입력이 1바이트든 1GB든 출력 크기는 항상 동일하다 (예: SHA-256은 항상 256비트). 이 고정 크기 덕분에 출력을 배열 인덱스로 쓸 수 있다.
- **hash value**: 해시 함수가 만들어낸 숫자값. 테이블의 "주소"로 변환된다.

운영자가 내 비밀번호를 몰라도 이 값이 내 비밀번호인지는 알 수 있다 — 입력한 값의 해시값과 저장된 해시값을 비교하면 되니까. 역변환은 매우 어렵다 (단방향성).

---

## 종합

Hashing의 핵심 가치는 "어떤 키든 고정 크기 숫자로 변환한다"는 것이다. 이 숫자를 배열 인덱스로 쓰면, JS의 `Map`처럼 문자열 키로도 O(1) 접근이 가능해진다. 비밀번호 저장(단방향 해시), 파일 무결성 검사(다운로드한 파일의 해시값 비교), 블록체인(이전 블록의 해시값을 다음 블록에 포함)이 모두 이 고정 크기 출력 속성을 활용한다.

---

---

# Hash function이란?

## 도입

해시 함수는 임의의 키(key)를 해시 테이블의 특정 인덱스(index)로 변환하는 수학적 공식이다. "어떤 키가 어느 슬롯에 들어가는가"를 결정하는 주소 계산기라고 볼 수 있다.

---

## 본문

> A hash function creates a mapping from an input key to an index in hash table, this is done through the use of mathematical formulas known as hash functions.

"해시 함수는 입력 키에서 해시 테이블의 인덱스로의 매핑을 생성한다. 이는 해시 함수라 불리는 수학적 공식을 통해 이루어진다."

- **mapping**: 키 → 인덱스로의 변환 관계. 같은 키는 항상 같은 인덱스를 반환해야 한다(결정론적).
- **mathematical formulas**: 나머지 연산(mod), 비트 연산, 다항식 등을 조합한다.

예시 (OA): 전화번호를 키로 쓰고 테이블 크기가 100이면, 전화번호의 마지막 두 자리를 인덱스로 사용하는 단순 해시 함수가 가능하다.

```js
function hash(phoneNumber) {
  return phoneNumber % 100;  // 마지막 두 자리
}
hash(01012345678) → 78  // 78번 슬롯에 저장
```

:
- 해시 함수 = 알고리즘 그 자체
- 해시 = 해시 함수를 사용해서 출력 만들기
- "해시"가 더 넓은 범위의 개념

---

## 종합

해시 함수의 품질이 해시 테이블 전체 성능을 결정한다. 좋은 해시 함수는 키들을 테이블 전체에 균등하게 분포시켜 충돌을 줄인다. 나쁜 해시 함수는 모든 키가 같은 슬롯으로 몰려 O(1) 접근이 O(n)으로 퇴보한다. JS의 `Map` 내부에서도 키를 해시값으로 변환하는 과정이 일어난다 — 사용자는 보이지 않지만 엔진이 처리한다.

---

---

# [UNVERIFIED] 해시 함수의 출력이 고정 크기(fixed-size)여야 하는 이유는?

## 도입

해시 함수가 매번 다른 크기의 출력을 낸다면 그 값을 배열 인덱스로 쓸 수 없다. 고정 크기는 기술적 필요성과 보안·효율성 양쪽에서 요구된다.

---

## 본문

AI Answer를 기반으로 네 가지 이유를 해설한다:

**1. 해시 테이블의 효율적인 인덱싱**
고정 크기 출력이면 `해시값 mod 테이블크기`로 유효 인덱스를 항상 만들 수 있다. 가변 크기라면 어떻게 인덱스를 계산해야 할지 알 수 없다 — O(1) 접근의 기반이 무너진다.

**2. 저장 공간의 효율성**
버킷(슬롯) 하나당 얼마의 공간이 필요한지 예측 가능해야 배열을 미리 할당할 수 있다. 출력 크기가 가변이면 슬롯 크기도 가변이 되어 배열로 관리가 불가능해진다.

**3. 일관성과 예측 가능성**
SHA-256은 어떤 파일이든 256비트 해시를 낸다. 그래서 두 해시값을 비교(`===`)할 때 항상 같은 길이끼리 비교할 수 있다. 블록체인에서 이전 블록의 해시값을 다음 블록에 포함할 때도 크기가 고정이어야 구조가 일정해진다.

**4. 충돌 처리 용이성**
충돌(collision) 처리 로직은 "같은 인덱스에 두 개 이상의 키가 몰렸을 때"를 가정한다. 출력이 고정 크기여야 슬롯이 언제 충돌하는지를 일관되게 탐지할 수 있다.

```
해시값 → mod 연산 → 인덱스
1234   → % 7      → 2번 슬롯
5678   → % 7      → 0번 슬롯
9999   → % 7      → 3번 슬롯
```

---

## 종합

고정 크기 출력은 해시 테이블이 O(1) 접근을 보장하기 위한 전제 조건이다. 크기가 고정되어 있으니 mod 연산으로 인덱스를 만들 수 있고, 인덱스가 항상 유효 범위에 들어오기 때문에 직접 배열 슬롯에 접근할 수 있다. "고정 크기"는 단순한 구현 편의가 아니라 O(1) 성능의 수학적 근거다.

---

---

# [UNVERIFIED] Hashing은 어떻게 동작하는가?

## 도입

Hashing은 해시 함수 하나로 끝나지 않는다. 함수 호출 이후에도 추가 단계가 있어야 실제 테이블 인덱스가 나온다.

---

## 본문

동작 3단계:

1. **해시 함수로 1차 변환**: 입력값을 해시 함수에 넣어 해시값(정수)을 만든다.
2. **테이블 크기로 mod 연산**: `해시값 % 테이블크기` → 유효 인덱스 범위로 압축한다.
3. **해당 인덱스를 슬롯 주소로 사용**: 그 위치에 데이터를 저장하거나 읽는다.

```js
function insert(table, key, value) {
  const rawHash = hashFunction(key);         // 단계 1: 해시 함수
  const index = rawHash % table.length;      // 단계 2: mod 연산
  table[index] = value;                      // 단계 3: 저장
}
```

해시 함수를 쓴 뒤에도 추가 절차(mod)가 있다. 해시 함수는 해시의 일부다.

---

## 종합

해시 함수 자체는 매우 큰 정수를 출력할 수 있다. 그 값을 그대로 배열 인덱스로 쓰면 메모리가 터진다. mod 연산이 이 값을 유효 범위 `[0, 테이블크기-1]`로 좁혀주는 역할을 한다. 따라서 Hashing = 해시 함수(1차 변환) + mod 연산(범위 압축) + 슬롯 접근(실제 저장/읽기) 세 단계다.

---

---

# [UNVERIFIED] 해시 함수에서 mod 연산이 중요한 이유는?

## 도입

해시 함수의 출력은 테이블 크기를 훨씬 넘는 큰 정수일 수 있다. mod 연산은 이 큰 값을 "테이블 안에서 유효한 인덱스"로 좁혀주는 핵심 단계다.

---

## 본문

**1. 인덱스 범위 제한**
해시값이 아무리 커도 테이블 크기는 유한하다. `해시값 % 테이블크기`로 결과를 `[0, 테이블크기-1]` 범위에 강제한다.

예: 테이블 크기 7이면, 해시값 1000이라도 `1000 % 7 = 6` → 인덱스 6에 저장.

**2. 균등 분포 시도**
좋은 해시 함수와 mod 연산을 조합하면 키들이 테이블 전체에 비교적 균등하게 분포된다. 특정 슬롯에 몰리면 충돌이 증가해 O(n)으로 퇴보한다.

```
테이블 크기: 7
key "alice" → hashCode: 291 → 291 % 7 = 4번 슬롯
key "bob"   → hashCode: 205 → 205 % 7 = 2번 슬롯
key "carol" → hashCode: 314 → 314 % 7 = 6번 슬롯
```

---

## 종합

mod 연산이 없으면 해시값을 인덱스로 직접 쓸 수 없다 — 해시값 범위가 배열 크기와 다르기 때문이다. mod는 무한한 키 공간을 유한한 슬롯으로 매핑하는 "축소 함수"다. 테이블 크기를 소수(prime number)로 설정하면 mod 결과의 분포가 더 균등해진다는 것이 수학적으로 알려져 있다 — 그래서 해시 테이블 크기를 보면 종종 소수를 만난다.

---

---

# 좋은 해시 함수의 조건은?

## 도입

해시 테이블의 O(1) 성능은 보장이 아니라 평균이다. 해시 함수의 품질에 따라 O(1)이 O(n)으로 퇴보할 수 있다. 좋은 해시 함수는 세 가지 조건을 만족한다.

---

## 본문

> A good hash function should have the following properties:
> 1. Should uniformly distribute the keys to each index of hash table.
> 2. Should minimize collisions.
> 3. Should have a low load factor (number of items in the table divided by the size of the table).

"좋은 해시 함수의 세 가지 조건:
1. 키를 해시 테이블의 각 인덱스에 균등하게 분포시켜야 한다.
2. 충돌을 최소화해야 한다.
3. 부하율(테이블의 항목 수 / 테이블 크기)이 낮아야 한다."

- **uniformly distribute**: 모든 슬롯에 비슷한 수의 키가 들어가야 한다. 특정 슬롯에 쏠리면 그 슬롯에서의 충돌이 많아져 O(n)으로 퇴보한다.
- **minimize collisions**: 서로 다른 키가 같은 인덱스로 매핑되는 것이 충돌이다. 완전히 없앨 수는 없지만 최소화해야 한다.
- **low load factor**: `n_items / table_size`. 예를 들어 100개 슬롯에 70개가 차 있으면 load factor = 0.7. 높을수록 충돌 가능성이 커진다. JS의 `Map`은 내부적으로 load factor가 임계치를 넘으면 테이블을 자동으로 확장(rehash)한다.

```
나쁜 해시 함수:
  key1 → 슬롯 2
  key2 → 슬롯 2  ← 충돌!
  key3 → 슬롯 2  ← 충돌!
  → 슬롯 2에만 체인 형성 → O(n) 탐색

좋은 해시 함수:
  key1 → 슬롯 2
  key2 → 슬롯 7
  key3 → 슬롯 4
  → 균등 분포 → O(1) 평균
```

---

## 종합

세 조건은 모두 연결되어 있다. 균등 분포가 되면 충돌이 줄고, 충돌이 줄면 load factor를 낮게 유지할 수 있다. JS `Map`은 키에 대한 해시 함수를 V8 엔진이 내부적으로 최적화해 처리하므로, 직접 해시 함수를 작성할 일은 드물다. 하지만 커스텀 해시 테이블을 구현하거나 알고리즘 문제에서 충돌 처리를 직접 해야 할 때 이 세 조건이 설계 기준이 된다.

---

---

# Hash Collision이란?

## 도입

해시 함수가 아무리 좋아도, 무한한 키 공간을 유한한 슬롯 수로 매핑하기 때문에 두 개 이상의 키가 같은 인덱스로 매핑되는 상황은 반드시 발생한다. 이것이 충돌(Collision)이다.

---

## 본문

> When two or more keys have the same hash value, a collision happens. To handle this collision, we use Collision Resolution Techniques.

"두 개 이상의 키가 같은 해시값을 가지면 충돌이 발생한다. 이 충돌을 처리하기 위해 충돌 해결 기법을 사용한다."

- **same hash value**: 서로 다른 키가 같은 인덱스로 매핑되는 상황. 예: `hash("alice") % 7 === hash("dave") % 7`.
- **Collision Resolution Techniques**: 대표적으로 두 가지가 있다.
  - **Chaining**: 같은 슬롯에 Linked List를 달아 여러 키-값 쌍을 연결한다.
  - **Open Addressing**: 충돌 시 다른 빈 슬롯을 찾아 이동한다(Linear Probing 등).

```
Chaining 방식 (슬롯 2에 충돌):
  슬롯 2: [("alice", 30)] → [("dave", 25)] → null

Open Addressing (Linear Probing):
  슬롯 2: ("alice", 30)
  슬롯 2 충돌 → 슬롯 3: ("dave", 25)  ← 다음 빈 슬롯으로 이동
```

---

## 종합

충돌은 해시 테이블의 숙명이다 — 비둘기집 원리(Pigeonhole Principle)에 의해 키 수가 슬롯 수를 넘으면 충돌은 반드시 발생한다. 해시 테이블 성능이 "평균 O(1)"인 이유는 충돌 자체가 없어서가 아니라, 좋은 해시 함수와 충돌 해결 기법으로 충돌을 드물게 유지하기 때문이다. 충돌이 많아지면 Chaining의 체인이 길어지거나 Open Addressing의 클러스터가 형성되어 O(n)에 가까워진다.

---

---

# Hash Table의 장점은?

## 도입

Hash Table의 핵심 장점은 검색·삽입·삭제를 평균 O(1)에 처리한다는 것이다. 단, "평균"이라는 단어가 중요하다 — O(1)은 최선/평균 시간복잡도이고, 충돌이 집중되면 최악은 O(n)이다.

---

## 본문

> It mainly supports search, insert and delete in O(1) time on average.

"Hash Table은 주로 검색, 삽입, 삭제를 평균 O(1) 시간에 지원한다."

- **on average**: 충돌이 없거나 드문 경우의 평균값. 충돌이 많으면 O(n)으로 퇴보한다.

중요한 뉘앙스: "search"는 실제로 "access(접근)"에 가깝다.
- `Map`에 값을 저장해두고 키로 꺼내는 것: O(1) → 진짜 강점
- `Map` 안에서 "제일 큰 값 찾기": O(n) → 배열 선형 탐색과 동일

배열 vs Hash Table 비교:
- 배열: 특정 인덱스로 값 가져오기 O(1), 하지만 특정 값이 있는지 찾기 O(n)
- Hash Table: 키로 값 가져오기 O(1), 특정 키가 있는지 확인 O(1)

```js
// 배열: 값 7이 있는지 → O(n)
const arr = [1, 3, 7, 5, 2];
arr.includes(7);  // 처음부터 순회

// Hash Table(Map): 키 "alice"가 있는지 → O(1)
const map = new Map([["alice", 30], ["bob", 25]]);
map.has("alice");  // 해시 계산 → 슬롯 직접 확인
```

---

## 종합

Hash Table의 O(1)은 "키를 알 때 그 값을 가져오는" 연산에 한정된다. 최대값 찾기, 정렬, 범위 탐색은 Hash Table의 강점이 아니다 — 그런 연산이 필요하면 BST나 정렬 배열이 낫다. JS에서 `Map`과 `Set`이 존재하는 이유가 바로 이 O(1) 키 접근이다. 객체(`{}`)도 해시 테이블과 유사하게 동작하지만, `Map`이 비문자열 키 지원, 삽입 순서 보장, `size` 프로퍼티 등에서 더 명확하다.

---

---

# Hash Set과 Hash Map의 차이는?

## 도입

Hash Set과 Hash Map은 둘 다 해시 테이블 기반이지만 저장하는 것이 다르다. Set은 "키만" 저장하고, Map은 "키-값 쌍"을 저장한다.

---

## 본문

> - **Hash Set**: Collection of unique keys (Implemented as Set in JavaScript, HashSet in Java).
> - **Hash Map**: Collection of key value pairs with keys being unique (Implemented as Map in JavaScript, HashMap in Java).

"Hash Set: 고유한 키의 모음 (JavaScript의 Set, Java의 HashSet으로 구현됨). Hash Map: 키가 고유한 키-값 쌍의 모음 (JavaScript의 Map, Java의 HashMap으로 구현됨)."

- **unique keys**: 두 자료구조 모두 중복 키를 허용하지 않는다. Set에서는 같은 값을 두 번 추가해도 한 번만 저장된다.
- **key value pairs**: Map은 키에 연관된 값을 함께 저장한다. Set은 키만 있고 별도의 값이 없다.

```js
// Set: 고유 키만 저장
const set = new Set();
set.add("apple");
set.add("banana");
set.add("apple");  // 무시됨
console.log(set);  // Set { "apple", "banana" }

// Map: 키-값 쌍 저장
const map = new Map();
map.set("apple", 150);
map.set("banana", 100);
map.get("apple");  // 150 → O(1)
```

사용 시점:
- **Set**: 중복 제거, 특정 원소 포함 여부 확인 (`has()`), 집합 연산(교집합, 합집합 등)
- **Map**: 키에 연관된 값을 O(1)에 저장·조회 (카운팅, 캐시, 룩업 테이블 등)

---

## 종합

Set은 Map의 "값" 부분을 제거한 특수 형태다. 내부 구현은 동일하게 해시 테이블이다. 알고리즘 문제에서 "이 값을 이전에 봤는가"를 O(1)에 확인하려면 Set, "이 키에 대한 값을 O(1)에 저장하고 꺼내려면" Map을 선택한다. JS에서 배열의 `includes()`가 O(n)인 반면 Set의 `has()`가 O(1)인 차이를 활용하면 선형 탐색을 해시 조회로 최적화할 수 있다.
