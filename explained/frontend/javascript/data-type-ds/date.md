# Date 객체 두 개의 대소를 비교할 때 어떻게 해야 하는가?

## 도입

`Date` 객체에서 날짜 비교를 잘못하면 연도나 월이 다를 때 로직이 완전히 틀어진다. `getDate()`처럼 단일 필드만 비교하는 것이 왜 위험한지, 올바른 방법은 무엇인지를 본다.

---

## 본문

Date 비교는 OA 없이 실무 원칙으로 정리한다.

`getDate()`는 월 중 일(day of month)만 반환한다. 연도와 월 정보는 버려진다.

```ts
function some(value: Date): boolean {
  const endDate: Date = new Date('2024-10-12');
  return value.getDate() < endDate.getDate(); // 위험!
  // endDate.getDate() === 12
  // 2024-09-05 → getDate() === 5 → 5 < 12 → true (맞음처럼 보이지만...)
  // 2025-10-05 → getDate() === 5 → 5 < 12 → true (연도가 달라도 true, 버그!)
  // 2024-10-20 → getDate() === 20 → 20 < 12 → false (맞음)
  // 2024-11-05 → getDate() === 5 → 5 < 12 → true (월이 넘었는데도 true, 버그!)
}
```

올바른 방법은 타임스탬프로 변환해서 비교하는 것이다:

```ts
function some(value: Date): boolean {
  const endDate: Date = new Date('2024-10-12');
  return value.getTime() < endDate.getTime(); // 타임스탬프 비교
  // 또는 단순히 부등호 비교도 가능 (자동으로 valueOf() 호출)
  return value < endDate;
}
```

```
타임스탬프 비교의 장점:
getDate()    → day만 비교 (연/월 무시) → 오류
getTime()    → 유닉스 밀리초 비교 → 연/월/일 모두 반영 → 정확
```

---

## 종합

날짜 비교는 항상 `getTime()`이 반환하는 유닉스 타임스탬프(밀리초) 기준으로 해야 한다. `getFullYear()`, `getMonth()`, `getDate()`를 따로 추출해서 if 체인으로 비교하면 코드가 길고 실수할 여지가 크다. `value < endDate` 표현식은 JS가 내부적으로 `valueOf()`(= `getTime()`)를 호출해 비교하므로 동일하게 동작한다.

---

---

# 커스텀 Date 형식(`{year, month, date}`)에 +N일 산술을 직접 적용하면 어떤 문제가 생기고 어떻게 해결하는가?

## 도입

날짜에 N일을 더하는 산술을 `date + N`처럼 단순 덧셈으로 하면 월말에서 날짜가 넘칠 때 잘못된 값이 생긴다. `Date` 객체는 이 오버플로우를 자동으로 처리해주므로 반드시 `Date`를 거쳐야 한다.

---

## 본문

날짜 산술의 함정은 OA 없이 실무 원칙으로 정리한다.

```ts
interface DateProperty {
  year: number;
  month: number;
  date: number;
}

// 위험한 방법 — 단순 덧셈
const startDate: DateProperty = { year: 2024, month: 10, date: 30 };
const endDate: DateProperty = {
  year: startDate.year,
  month: startDate.month,
  date: startDate.date + 2 // 30 + 2 = 32 → 10월 32일이라는 불가능한 날짜
};
// endDate === { year: 2024, month: 10, date: 32 } ← 유효하지 않음

// 올바른 방법 — Date 객체를 통해 오버플로우 자동 처리
const end: Date = new Date(startDate.year, startDate.month - 1, startDate.date + 2);
// new Date(2024, 9, 32) → JS가 자동으로 2024-11-01로 변환
const endDateProperty: DateProperty = {
  year: end.getFullYear(),    // 2024
  month: end.getMonth() + 1, // 11
  date: end.getDate(),        // 1
};
```

`new Date(year, month, date)`에서 `date`가 해당 월의 마지막 날을 초과하면 JS 엔진이 자동으로 다음 달로 넘겨준다. 이것이 핵심이다.

---

## 종합

날짜 덧셈/뺄셈은 반드시 `Date` 객체를 경유해야 한다. 커스텀 `{year, month, date}` 구조체로만 산술하면 월말 경계에서 잘못된 날짜가 조용히 만들어진다. `dayjs`나 `date-fns` 같은 라이브러리를 쓰면 `dayjs(startDate).add(2, 'day').toDate()` 형태로 더 안전하고 명확하게 처리할 수 있다.

---

---

# `new Date(year, month, date)` (숫자 인자)와 `new Date('YYYY-MM-DD')` (문자열 인자)는 어떻게 다른가?

## 도입

`Date` 생성자에 같은 날짜를 숫자로 넣으냐 문자열로 넣으냐에 따라 Month가 1 차이 나고, 시간대도 달라진다. 이 차이를 모르면 날짜 계산이 조용히 틀어진다.

---

## 본문

두 생성 방식의 차이는 OA 없이 실무 원칙으로 정리한다.

**Month 차이:**
- `new Date(year, month, date)` — `month`는 **0-indexed**다. 1월 = 0, 12월 = 11.
- `new Date('YYYY-MM-DD')` — 문자열의 월은 **1-indexed**다. `01`이 1월.

```js
new Date(2021, 0, 1)     // 0 = 1월 → 2021년 1월 1일
new Date('2021-01-01')   // '01' = 1월 → 2021년 1월 1일 (같은 날)

new Date(2021, 1, 1)     // 1 = 2월 → 2021년 2월 1일
new Date('2021-02-01')   // '02' = 2월 → 2021년 2월 1일
```

**시간대(Timezone) 차이:**
- `new Date(year, month, date)` — **로컬 시간** 기준으로 자정(00:00:00) 생성.
- `new Date('YYYY-MM-DD')` — **UTC 기준** 자정(00:00:00Z) 생성. 로컬 시간대로 읽으면 오프셋이 적용된다.

```js
const numberDate = new Date(2021, 0, 1) // 한국(UTC+9) 로컬 기준 2021-01-01 00:00
const stringDate = new Date('2021-01-01') // UTC 기준 2021-01-01 00:00Z

// 한국 환경(UTC+9)에서
numberDate.getHours() // 0  — 로컬 자정
stringDate.getHours() // 9  — UTC 자정 = 한국 오전 9시
```

---

## 종합

같은 날짜라도 생성 방식에 따라 `getHours()`가 달라지는 것은 타임존 오프셋 때문이다. 문자열 `'YYYY-MM-DD'`는 ISO 8601 날짜 형식으로 UTC로 파싱되어, 한국(UTC+9)에서 읽으면 9시간 앞당겨진다. 날짜만 다루고 시간은 무시하고 싶다면 숫자 생성자(`new Date(year, month - 1, date)`)를 쓰는 것이 로컬 기준으로 예측 가능하다.

---

---

# UTC 기준 시각 데이터를 다른 시간대에서 접근하면 어떻게 동작하는가?

## 도입

서버가 UTC 기준으로 timestamp를 내려줄 때, 클라이언트가 어느 시간대에 있느냐에 따라 표시되는 시각이 달라진다. `Date` 객체는 내부적으로 UTC 밀리초로 저장하고, `getHours()` 같은 getter는 로컬 시간대 기준으로 변환해서 반환한다.

---

## 본문

UTC 시각 접근은 OA 없이 실무 원칙으로 정리한다.

```ts
// 서버 응답: UTC 기준 2024-11-11 00:15
const data = '2024-11-11T00:15:55.000Z'; // ISO 8601, Z = UTC

const dateObject = new Date(data);

// 한국(UTC+9)에서 접근하면 자동으로 +9시간 변환
dateObject.getHours();   // 9  (UTC 00시 = 한국 09시)
dateObject.getDate();    // 11 (아직 11일, 자정을 넘지 않음)

// dayjs로 다른 시간대 명시
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

// 서울 기준
dayjs(data).tz('Asia/Seoul').format('DD일 HH시mm분'); // '11일 09시15분'

// 뉴욕 기준 (UTC-5)
dayjs(data).tz('America/New_York').format('DD일 HH시mm분'); // '10일 19시15분'
```

---

## 종합

`Date` 객체는 "어느 시간대의 시각인지"를 내부에 저장하지 않는다. 항상 UTC 밀리초로 저장하고, 읽을 때 로컬 시간대 오프셋을 적용한다. 글로벌 서비스처럼 여러 시간대 사용자를 다뤄야 한다면 `dayjs.tz()`나 `Intl.DateTimeFormat`의 `timeZone` 옵션으로 명시적으로 시간대를 지정해야 한다. 서버는 항상 UTC 기준으로 timestamp를 내려주고, 클라이언트에서 시간대 변환을 처리하는 것이 일반적인 설계 원칙이다.
