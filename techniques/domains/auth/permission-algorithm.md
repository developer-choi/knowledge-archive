---
tags: [auth, algorithm, concept]
source: google-doc
publishable: false
---
# Questions

## Permission 구조
- 계층형 리소스 권한 문자열 포맷은 어떻게 설계하는가?
  - 액션(Action)에 ALL이 있고 리소스(Resource)에는 ALL이 없는 이유는?
  - 루트 권한은 어떻게 표현하는가?
- 권한 데이터에서 중복·충돌은 어떤 경우에 발생하는가?

## 권한 체크 알고리즘
- 계층형 리소스 권한을 재귀 없이 체크하는 방법은?
  - 재귀 방식과 문자열 포함(prefix) 방식의 차이는?
  - Step별 절차는?
- ALL 액션 도입의 트레이드오프는?

---

# Answers

## 계층형 리소스 권한 문자열 포맷은 어떻게 설계하는가?

### User Answer

권한 문자열은 `리소스이름.계층.계층.계층:액션` 형태로 표현한다.

```
RESOURCE:READ
RESOURCE.PATH1:READ
RESOURCE.PATH1.PATH2:READ
RESOURCE.PATH1.PATH2.PATH3:READ
```

- `RESOURCE:READ` — 해당 리소스 하위 모든 계층에 READ 가능
- `RESOURCE.PATH1:READ` — RESOURCE.PATH1와 그 하위 모든 리소스에 READ 가능

API 응답 예시:

```json
"permissions": [
  "B2B.INQUIRY.LIST:ALL",
  "BOARD.TEACHER.LIST:GET"
]
```

의미:
1. B2B 문의하기 목록에 모든 액션 가능
2. 게시물 > 선생님 게시물 > 리스트에 GET 가능 (= 학습자 게시물은 접근 불가능)

## 액션(Action)에 ALL이 있고 리소스(Resource)에는 ALL이 없는 이유는?

### User Answer

**규칙:**

1. 액션에는 ALL이 있음. `B2B:ALL` (B2B CRUD 가능)
2. 리소스에는 ALL이 없음. `ALL:READ` (모든 리소스 읽기 가능)이라는 권한은 없음
3. 리소스의 하위 계층에는 ALL이 **명시적**으로는 없지만, **기능적**으로는 있음
   - `LESSON.PATH1.ALL:READ` (레슨 PATH1 하위 전부 읽기 가능)이라고 표기하지 않고
   - `LESSON.PATH1:READ` 라고 표기함

즉, 상위 리소스 권한이 있으면 하위 계층 전체에 해당 액션이 적용된다는 것이 암묵적 규칙.

## 루트 권한은 어떻게 표현하는가?

### User Answer

모든 리소스별로 ALL 액션으로 만들어서 제공한다.

```json
"permission": [
  "B2B:ALL",
  "BOARD:ALL",
  "LESSON:ALL",
  "USER:ALL",
  "ETC:ALL"
]
```

루트 권한 = 각 최상위 리소스에 대해 ALL 액션을 부여하는 방식.

## 권한 데이터에서 중복·충돌은 어떤 경우에 발생하는가?

### User Answer

권한 체크 자체에 지장은 없지만, 아래 두 경우는 API 데이터 오류로 판단한다.

**오류 케이스:**

```json
"permissions": [
  "B2B.INQUIRY.LIST:ALL",
  "B2B.INQUIRY.LIST:GET",
  "BOARD.TEACHER.LIST:ALL",
  "BOARD:ALL"
]
```

1. 이미 `B2B.INQUIRY.LIST:ALL`이 있는데 `B2B.INQUIRY.LIST:GET`이 또 응답된다면 API 오류 (ALL이 GET을 포함하므로 중복)
2. `BOARD:ALL`로 게시물 전체 리소스 권한이 있는데, `BOARD.TEACHER.LIST:ALL`이 또 있다면 역시 API 오류 (상위 권한이 하위를 포함하므로 중복)

단, 이 중복이 있어도 권한 체크 알고리즘 자체는 정상 동작한다.

## 계층형 리소스 권한을 재귀 없이 체크하는 방법은?

### User Answer

권한 문자열을 리소스와 액션으로 분리한 뒤, 문자열 포함(prefix) 비교로 처리한다.

**Step 1. 권한을 리소스와 액션으로 분리**

- 보유 권한 = `RESOURCE.PATH1:ALL` → `RESOURCE.PATH1` + `ALL`로 분리
- 확인하려는 권한 = `RESOURCE.PATH1.PATH2:ALL` → `RESOURCE.PATH1.PATH2` + `ALL`로 분리

**Step 2. 보유 권한의 리소스 문자열이, 확인하려는 리소스 문자열에 포함되는지 체크**

- 예시 1. `B2B:ALL` 보유 → `b2b.inquiry.list` 접근 가능한지 체크 → `B2B.INQUIRY.LIST`에 `B2B`가 포함되는지 확인 → true → 접근 가능
- 예시 2. `B2B.INQUIRY.LIST:ALL` 보유 → `B2B.INQUIRY.LIST` 접근 가능한지 체크 → `B2B.INQUIRY.LIST`에 `B2B.INQUIRY.LIST`가 포함되는지 확인 → true
- 예시 3. `COUPON:ALL` 보유 → `B2B.INQUIRY.LIST` 접근 가능한지 체크 → `B2B.INQUIRY.LIST`에 `COUPON`이 포함되는지 확인 → false → 접근 불가

이렇게 문자열 포함 비교 로직으로, 재귀 없이 간단하게 파악이 가능.

**Step 3. 액션 비교**

- ALL 권한 보유 → READ 가능 → 가능
- READ 권한 보유 → READ 가능 → 가능
- READ 권한만 보유 → DELETE 가능 → 불가능

## 재귀 방식과 문자열 포함(prefix) 방식의 차이는?

### User Answer

**기존 방식 (재귀):** `RESOURCE.PATH1.PATH2.PATH3`에 대한 READ 권한 체크 시 8단계 순차 체크가 필요.

```
1. "RESOURCE.PATH1.PATH2.PATH3:READ" 가 있는지 체크
2. "RESOURCE.PATH1.PATH2.PATH3:ALL" 이 있는지 체크
3. "RESOURCE.PATH1.PATH2:READ" 가 있는지 체크
4. "RESOURCE.PATH1.PATH2:ALL" 이 있는지 체크
5. "RESOURCE.PATH1:READ" 가 있는지 체크
6. "RESOURCE.PATH1:ALL" 이 있는지 체크
7. "RESOURCE:READ" 가 있는지 체크
8. "RESOURCE:ALL" 이 있는지 체크
```

**현재 방식 (문자열 포함 비교):** 보유 권한 리소스가 확인하려는 리소스의 prefix인지 한 번만 비교하면 됨. 재귀 불필요.

## ALL 액션 도입의 트레이드오프는?

### User Answer

복잡성과 데이터 크기 두 가지를 고려하여 설계된 결정.

**데이터 크기 감소 (장점):**

```json
// ALL 미도입
"permission": ["B2B:READ", "B2B:CREATE", "B2B:DELETE", "B2B:UPDATE"]

// ALL 도입
"permission": ["B2B:ALL"]
```

ALL 액션 도입 시 데이터 크기를 1/4로 줄일 수 있음.

**복잡성 증가 (단점):**

ALL 도입 전에는 READ 체크만 하면 됐던 것을, ALL 도입 후에는 READ 체크 외에 ALL도 체크해야 하므로 권한 체크 로직의 복잡성이 늘어남.

이 정책은 실제 어드민 사용 사례를 바탕으로 양쪽을 고려하여 결정됨.
