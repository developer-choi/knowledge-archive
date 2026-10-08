# 수정·삭제는 id만 보지 말고 소유자도 같이 조건에 건다

리소스를 수정하거나 삭제할 때 `WHERE id = ?`만 쓰면 로그인한 사용자라면 누구든 남의 리소스의 id를 넣어 수정·삭제할 수 있다 (IDOR, Insecure Direct Object Reference). 조건에 **id와 소유자(user_id)를 같이** 건다.

```sql
-- 위험: id만 맞으면 누구 것이든 지워진다
DELETE FROM study_records WHERE pk = $1;

-- 안전: 내 것일 때만 지워진다
DELETE FROM study_records WHERE pk = $1 AND user_id = $2;
```

`user_id`는 요청 본문이나 URL이 아니라 **세션(서버가 검증한 값)에서 꺼낸다**. 클라이언트가 보낸 값을 쓰면 그 값도 조작할 수 있다.

## 소유권 검사를 쿼리 조건에 넣는 이유

"먼저 SELECT로 소유자를 확인하고, 맞으면 UPDATE/DELETE"로 짤 수도 있지만 조건에 넣는 쪽이 낫다.

- 검사 코드를 빼먹을 수 없다. 쿼리 자체에 들어 있다.
- 쿼리가 한 번이라 확인과 실행 사이에 상태가 바뀌는 틈(race condition)이 없다.

## 남의 리소스에는 403 대신 404

조건에 맞는 행이 없으면 "없다(404)"로 답한다. 403은 "그 리소스는 존재하지만 네 것이 아니다"를 알려주는 셈이라, 공격자가 id를 바꿔 가며 어떤 리소스가 존재하는지 알아낼 수 있다.

## 출처

- OWASP, Insecure Direct Object Reference Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
