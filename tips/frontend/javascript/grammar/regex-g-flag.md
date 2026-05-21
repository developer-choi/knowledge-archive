# Regex `g` 플래그 재사용 문제

`regex.test()`, `regex.exec()` 이런 식으로 쓸 때 `g` 플래그가 있으면 재사용할 때 문제된다.

다만 react-hook-form에서 `register`의 `options.pattern`에 정규식을 넣을 때는 문제가 되지 않는다.

`g` 플래그는 `replace`에 들어가는 정규식 만들 때 주로 쓰지, `test`/`exec` 같은 경우에 쓸 이유가 없다. 애초에 `g`의 의미가 전체 검색이라서 (매칭되는 거 다 replace하려고 쓰는 것), 하나라도 걸리는지 보는 `test`와는 서로 의미가 다르다.

## References

- [Javascript Regex literal with /g used multiple times — Stack Overflow](https://stackoverflow.com/questions/2141974/javascript-regex-literal-with-g-used-multiple-times)
