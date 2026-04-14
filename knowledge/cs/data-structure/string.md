---
tags: [data-structure, concept]
---

# Questions
- 문자열(String)이란 무엇인가?
- 문자열이 불변(Immutable)이라는 것은 무엇을 의미하는가?
  - 문자열이 불변인 것이 왜 중요한가?
- 문자열은 메모리에 어떻게 저장되는가?
- 문자열의 길이를 구하는 시간 복잡도는?
- 두 문자열의 동일성 비교(equality check)의 시간 복잡도는?

---

# Answers

## 문자열(String)이란 무엇인가?

### Official Answer
A string is a sequence of characters.

### Reference
- https://www.geeksforgeeks.org/string-data-structure/

---

## 문자열이 불변(Immutable)이라는 것은 무엇을 의미하는가?

### Official Answer
Strings are typically immutable in most of the programming languages like Java, Python and JavaScript.
In Python, Java and JavaScript, strings are immutable.

> #### User Annotation:
> name = 'Another' 하더라도, 기존 'Hello'가 저장된 메모리 주소로 접근해서 저 값으로 바꾸는게 아님.
> array = [1,2,3,4,5] 하는거랑 똑같이 동작함.
> 문자열에 특정 문자를 insert / delete 하는것도, 기존 문자열을 수정하는 게 아니라 새로운 문자열을 생성하는 것임.
> (원문: "This operation usually involves creating a new string without the specified character.")

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-strings-data-structure-and-algorithm-tutorials/

---

## 문자열이 불변인 것이 왜 중요한가?

### User Answer
1. **안전성 (Thread-Safety)**: 여러 기능(스레드)이 하나의 문자열 데이터를 동시에 참조해도, 어차피 수정이 불가능하므로 데이터가 꼬일(race condition) 걱정이 없다.
2. **효율성 (String Pool)**: "hello" 라는 문자열을 코드 100군데서 사용해도, 실제 메모리에는 "hello"를 딱 하나만 저장해두고 100개의 변수가 그 주소를 '공유'할 수 있다.
수정이 불가능하니까 공유해도 안전하다.
3. **해시(Hash) 자료구조**: 해시맵(Map)이나 셋(Set)의 키(Key) 값으로 문자열을 안심하고 쓸 수 있다.
값이 변하지 않으니 해시값도 변하지 않는다.

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-strings-data-structure-and-algorithm-tutorials/

---

## 문자열은 메모리에 어떻게 저장되는가?

### User Answer
Python, Java, JavaScript에서 문자열의 문자들은 배열처럼 **연속된(contiguous)** 메모리 위치에 저장된다.
contiguous 하기 때문에, str[3] 이렇게 접근하는게 O(1)로 보장됨.
Linked List는 이게 안됨.

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-strings-data-structure-and-algorithm-tutorials/

---

## 문자열의 길이를 구하는 시간 복잡도는?

### Official Answer
The length of a string refers to the total number of characters present in it, including letters, digits, spaces, and special characters.

> #### User Annotation:
> C언어의 strlen()은 문자열의 끝을 알리는 \0을 만날 때까지 문자를 하나하나 세기 때문에 O(N)의 시간이 걸린다.
> 반면, JavaScript, Java, Python 등 현대 언어들은 문자열 객체 내부에 '길이' 값을 별도로 저장하고 있으므로 .length에 접근하는 것은 O(1)(상수 시간)이다.

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-strings-data-structure-and-algorithm-tutorials/

---

## 두 문자열의 동일성 비교(equality check)의 시간 복잡도는?

### User Answer
문자열 2개의 === 비교는 O(n)이다.
문자를 하나하나 비교해야 하기 때문.

### Reference
- https://www.geeksforgeeks.org/dsa/program-to-check-if-two-strings-are-same-or-not/
