# Function

## function statement vs function expression

function statement 이게

```js
function myFunc()
{
}
```

이거고

function expression 이게

```js
var myFunc = function() {...}
```

이거다.

위에서 생성하는 것 모두 함수리터럴방식이라고 한다.

function statement 방식은 반드시 function name이 있어야 하고
function expression 방식은 function name이 선택사항이다. (있으면 재귀함수처럼 응용 가능)

```js
var factorialVar = function factorial(n) {
    if(n <= 1) {
        return 1;
    }
    return n * factorial(n-1);
};
```

<!-- 다이어그램, PDF p.1: factorialVar(함수 변수) → factorial() 함수, factorial() 재귀 호출 -->

이렇게 되어있다.

그래서 외부에서는 `factorial()`로 접근이 불가능하지만, factorial 내부에서는 `factorial()`로 접근이 가능하다.

## first class citizen

javascript에서 function은 first class citizen이다. (직역 = 일급객체)

1. literal에 의해 생성가능
2. 변수, 배열의 요소, 객체의 프로퍼티에 할당가능
3. function의 parameter로 전달가능
4. function에서 function을 return할 수 있음.
5. **동적으로 프로퍼티를 생성 / 할당가능**

## prototype과 constructor

prototype과 constructor라는 프로퍼티로 서로를 참조하게 된다.

```js
function hello() {}
// undefined
hello === hello.prototype.constructor
// true
```

## closure

```js
var person = function () {
    var parent = "i'm parent";

    var child = function () {
        console.log("i'm child1");
        console.log(parent);
    };

    return child();
};

person();
```

person()으로 반환된 함수는 child()이기 때문에, 빨간박스(`var child = function () { ... };`)에 해당되는 내용만 참조돼야 하는데 outer function의 variable도 참조가 된다.

이렇게 실행이 끝난 outer function의 variable을 참조하는 **inner function을 closure라고 한다.**

음 정확하게 표현하려면 child()가 클로저라서 그렇습니다, 라고 말하는 게 제일 맞겠네. 클로저 때문에 그렇습니다, 라기 보다는..

## instanceof vs typeof

instanceof 연산자는 `object instanceof constructor`로 쓰며, object가 constructor로부터 생성되었는지를 체크한다기보다, `object.proto === constructor.prototype`인지를 체크한다고 보는 게 정확하다.

그래서 **reference type의 타입체크는 `instanceof`, primitive type의 변수의 타입체크는 `typeof`**가 제일 적절한 거 같다.

참고) typeof는 연산자로써, 피 연산자의 타입을 string type으로 반환한다. 그리고 string type은 primitive type이다.

## 자유변수 — switch로 분기된 클로저

```js
function createCloser() {
    var x = 1;
    return {
        func1 : function() {
            x += 10;
            console.log(x);
        },
        func2 : function () {
            x -= 10;
            console.log(x);
        }
    };
}

var CLOSER_TYPE = {TYPE1 : 1, TYPE2 : 2};

function createCloser2(closerType) {
    var x = 1;

    switch (closerType) {
        case CLOSER_TYPE.TYPE1:
            return function () {
                x += 10;
                console.log(x);
            };

        case CLOSER_TYPE.TYPE2:
            return function () {
                x -= 10;
                console.log(x);
            };
    }
}
```

좌측의 `func1`, `func2`는 동일한 자유변수를 참조하지만, 우측의 function 2개는 서로 다른 자유변수를 참조한다. (둘 다 `x`지만)

```js
var closer1 = createCloser2(CLOSER_TYPE.TYPE1);
```

이렇게 closer를 할당받을 그 당시에는 아래의 Type2의 함수는 Execution Context 안의 Activation Object에 없었으니까.

둘 다 쓰임새에 따라 다양하게 활용될 수 있을 거 같다. 물론 `CLOSER_TYPE`은 반드시 `const`로 선언하고.
