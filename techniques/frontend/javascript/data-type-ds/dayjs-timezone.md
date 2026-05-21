---
tags: [javascript, concept]
source: google-doc
publishable: false
---
# Questions

- dayjs로 timezone 기반 포매팅할 때 `.format()`과 `.tz(...).format()`은 어떻게 다른가?

---

# Answers

## dayjs로 timezone 기반 포매팅할 때 `.format()`과 `.tz(...).format()`은 어떻게 다른가?

### User Answer

```ts
// 이거 2줄은 같은 뜻임. new Date()처럼, dayjs().format()도 현재 시간대에 맞춰서 보정을 해줌.
const formatInDayjs: string =
  dayjs(data).format('DD일 HH시mm분');

const formatInDayjsWithTimezone: string =
  dayjs(data)
    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
    .format('DD일 HH시mm분'); // ex: Asia/Seoul
```
