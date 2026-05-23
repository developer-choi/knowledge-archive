---
tags: [programming-paradigm, concept]
source: google-doc
publishable: false
---
# Questions
- OOP란 무엇이며, 객체(Object)의 구성 요소는?
- 클래스(Class)와 인스턴스(Instance)의 차이는?
- 함수 대신 클래스를 선택하는 기준은?
- 추상화(Abstraction)와 상속(Inheritance)이 OOP에서 해결하는 문제는?
- 접근 제어자(Access Modifier)의 역할은?
- static 멤버를 사용하는 기준은?

---

# Answers

## OOP란 무엇이며, 객체(Object)의 구성 요소는?

### Official Answer
Object-oriented programming is about modeling a system as a collection of objects, where each object represents some particular aspect of the system.

Objects contain both functions (or methods) and data.

An object provides a public interface to other code that wants to use it but maintains its own private, internal state; other parts of the system don't have to care about what is going on inside the object.

> #### Key Terms:
> - **modeling a system as a collection of objects**: 시스템을 객체들의 집합으로 표현하는 방식
> - **public interface**: 외부에 노출된 메소드·프로퍼티 집합
> - **private, internal state**: 외부에서 접근 불가한 내부 데이터

> #### User Annotation:
> 객체는 필드(데이터)와 메소드(동작) 두 가지를 갖는다.
> 예를 들어 Array 객체는 `length` 필드를 갖고, `push`/`remove` 같은 메소드가 실행되면 `length`에 반영된다.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Object-oriented_programming

---

## 클래스(Class)와 인스턴스(Instance)의 차이는?

### Official Answer
On its own, a class doesn't do anything: it's a kind of template for creating concrete objects of that type.

> #### Key Terms:
> - **template**: 객체 생성을 위한 설계도
> - **concrete objects**: 클래스로부터 실제로 만들어진 객체

### User Answer
클래스는 그 자체로는 데이터(필드)도 없고 동작(메소드)도 할 수 없는 설계도다.
클래스에서 생성된 인스턴스는 실제로 데이터(필드)를 갖고, 특정 동작(메소드)을 수행할 수 있다.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Object-oriented_programming

---

## 함수 대신 클래스를 선택하는 기준은?

### User Answer
필드와 메소드로 구현하는 것이 더 적합한 경우에 클래스를 선택한다.

클래스가 유리한 두 가지 이유:
- **상태 유지**: 필드는 메소드 실행 후에도 객체 내부에 계속 유지된다. 함수는 실행 후 지역변수가 모두 사라진다.
- **상속**: 필드와 메소드를 부모 클래스에 선언하고 자식이 상속받아 달라지는 부분만 추가 구현할 수 있다.

대표적인 예시가 자료구조 직접 구현이다.
LinkedList를 구현할 때 `length`는 `add()` 메소드 실행 후에도 유지되어야 하고, 모든 List 공통 동작은 부모 클래스에 한 번만 선언하면 된다.

---

## 추상화(Abstraction)와 상속(Inheritance)이 OOP에서 해결하는 문제는?

### User Answer
필드와 메소드만으로 구현하면 중복 코드가 심하게 발생한다.

예를 들어 ArrayList와 LinkedList를 따로 구현하면 `length`, `add()` 같은 공통 로직을 각각 직접 선언하거나 복붙해야 한다.

- **추상화**: 클래스 간 공통점을 찾아 부모 클래스로 만드는 것
- **상속**: 자식 클래스가 부모 클래스로부터 필드·메소드를 내려받는 것

ArrayList와 LinkedList의 공통 부분을 `List` 부모 클래스로 추상화하고 각각 상속받으면, 재사용 가능한 코드를 작성할 수 있다.

> #### User Annotation:
> 규모가 커질수록 코드 하나 추가할 때마다 위(부모)와 아래(자식) 모두를 검토해야 한다는 것이 OOP가 어려운 이유다.
> `List`에 메소드 하나를 추가하면 이를 상속하는 모든 하위 클래스에 영향이 미치기 때문이다.

---

## 접근 제어자(Access Modifier)의 역할은?

### User Answer
외부에서 객체를 제작자의 의도대로 사용하도록 문법적으로 강제하는 수단이다.

예를 들어 `length` 필드는:
- 외부에서 읽을 수 있어야 하지만, 외부에서 수정하면 안 된다.
- 내부 및 자식 클래스(LinkedList 등)에서는 수정할 수 있어야 한다.

이를 주석으로 "외부에서 쓰지 마세요"라고 달아두는 대신, `protected`로 선언하고 별도 getter를 추가하면 위 조건을 모두 문법으로 강제할 수 있다.

---

## static 멤버를 사용하는 기준은?

### User Answer
모든 인스턴스가 동일하게 공유해야 하는 필드 또는 메소드이면서, 해당 멤버가 인스턴스 필드나 인스턴스 메소드에 접근하지 않는 경우 `static`으로 선언하면 메모리를 절약할 수 있다.

인스턴스마다 별도로 생성할 필요가 없기 때문이다.
실무에서는 객체 내부의 유효성 검증 메소드에 자주 사용된다.
