---
tags: [data-structure, concept]
---

# Questions
- [Hashing이란?](#hashing이란)
  - [Hash function이란?](#hash-function이란)
- [해시 함수의 출력이 고정 크기(fixed-size)여야 하는 이유는?](#해시-함수의-출력이-고정-크기fixed-size여야-하는-이유는)
- [Hashing은 어떻게 동작하는가?](#hashing은-어떻게-동작하는가)
  - [해시 함수에서 mod 연산이 중요한 이유는?](#해시-함수에서-mod-연산이-중요한-이유는)
- [좋은 해시 함수의 조건은?](#좋은-해시-함수의-조건은)
- [Hash Collision이란?](#hash-collision이란)

---

# Answers

## Hashing이란?

### Official Answer
Hashing is a technique that generates a fixed-size output (hash value) using hash functions.

> #### User Annotation:
> 운영자가 내 비번은 모르지만, 이 값이 내 비번인지는 알 수 있음.
> 역변환은 매우힘듬.

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-hashing-2/

---

## Hash function이란?

### Official Answer
A hash function creates a mapping from an input key to an index in hash table, this is done through the use of mathematical formulas known as hash functions.
For example: Consider phone numbers as keys and a hash table of size 100.
A simple example hash function can be to consider the last two digits of phone numbers so that we have valid array indexes as output.

> #### User Annotation:
> 해시함수 = 알고리즘 그 자체.
> 해시 = 해시함수 사용해서 출력만들기.
> 해시가 좀 더 큰 범위의 개념.

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-hashing-2/

---

## 해시 함수의 출력이 고정 크기(fixed-size)여야 하는 이유는?

### AI Answer
1. **해시 테이블의 효율적인 인덱싱**: 고정된 크기의 출력이면 나머지 연산(%)으로 쉽게 인덱스로 변환 가능.
이는 O(1) 시간 접근의 핵심 기반.
2. **저장 공간의 효율성**: 가변적이면 버킷/슬롯 공간 예측 불가.
고정 크기면 효율적 관리 가능.
3. **일관성과 예측 가능성**: 길이가 항상 동일하여 데이터 무결성 검증, 블록체인 등에서 해시 값 비교 가능.
4. **충돌 처리 용이성**: 고정 크기여서 충돌 처리 메커니즘을 일관되게 적용 가능.

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-hashing-2/

---

## Hashing은 어떻게 동작하는가?

### User Answer
1. 해시함수로 입력된 값을 1차변환 하고,
2. 그 값을 다시 테이블 크기로 나눈 나머지 값을
3. 인덱스로 쓴다.

> #### User Annotation:
> 해시함수를 쓰고 나서도 추가적인 절차가 있음.
> 즉 해시함수는 해시의 일부가 맞음.

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-hashing-2/

---

## 해시 함수에서 mod 연산이 중요한 이유는?

### AI Answer
1. **인덱스 범위 제한**: 해시 값이 아무리 크더라도 테이블 크기는 유한.
mod 연산으로 유효한 인덱스 범위(0 ~ 테이블크기-1)에 강제.
예: 테이블 크기 7이면 해시 값 1000이라도 `1000 mod 7`로 0~6 사이의 인덱스 획득.
2. **균등한 분포 시도**: 좋은 해시 함수와 mod 연산으로 키들이 해시 테이블 전체에 비교적 균등하게 분포.
충돌 최소화에 기여.

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-hashing-2/

---

## 좋은 해시 함수의 조건은?

### Official Answer
A good hash function should have the following properties:
1. Should uniformly distribute the keys to each index of hash table.
2. Should minimize collisions.
3. Should have a low load factor (number of items in the table divided by the size of the table).

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-hashing-2/

---

## Hash Collision이란?

### Official Answer
When two or more keys have the same hash value, a collision happens.
To handle this collision, we use Collision Resolution Techniques.

### Reference
- https://www.geeksforgeeks.org/dsa/introduction-to-hashing-2/
