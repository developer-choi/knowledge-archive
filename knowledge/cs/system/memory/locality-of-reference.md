---
tags: [os, performance, concept]
---

# Questions
- [Locality of reference(참조 지역성)란 무엇인가?](#locality-of-reference참조-지역성란-무엇인가)
  - [Temporal locality란 무엇인가?](#temporal-locality란-무엇인가)
  - [Spatial locality란 무엇인가?](#spatial-locality란-무엇인가)
    - [Sequential locality란 무엇인가?](#sequential-locality란-무엇인가)
- [캐시가 locality of reference를 활용하는 방식은?](#캐시가-locality-of-reference를-활용하는-방식은)
  - [캐시에 저장된 데이터는 메인 메모리에서 공간적으로 가까운 데이터끼리 모여있는가?](#캐시에-저장된-데이터는-메인-메모리에서-공간적으로-가까운-데이터끼리-모여있는가)

---

# Answers

## Locality of reference(참조 지역성)란 무엇인가?

### Official Answer
In computer science, locality of reference, also known as the principle of locality, is the tendency of a processor to access the same set of memory locations repetitively over a short period of time.
There are two basic types of reference locality – temporal and spatial locality.
Locality is a type of predictable behavior that occurs in computer systems.

### Reference
- https://en.wikipedia.org/wiki/Locality_of_reference

---

## Temporal locality란 무엇인가?

### Official Answer
Temporal locality refers to the reuse of specific data and/or resources within a relatively small time duration.
Temporal locality is a special case of spatial locality, namely when the prospective location is identical to the present location.

> #### Official Annotation:
> In this case it is common to make efforts to store a copy of the referenced data in faster memory storage, to reduce the latency of subsequent references.

> #### AI Annotation: for 루프의 카운터 변수 `i`는 매 반복마다 읽고 쓰므로 temporal locality가 매우 높은 대표적 예시다.

### Reference
- https://en.wikipedia.org/wiki/Locality_of_reference

---

## Spatial locality란 무엇인가?

### Official Answer
Spatial locality (also termed data locality) refers to the use of data elements within relatively close storage locations.

> #### AI Annotation: 배열 순회 시 `arr[0]`을 읽으면 `arr[1]`, `arr[2]`도 곧 읽을 가능성이 높다. CPU는 이를 이용해 cache line 단위(보통 64바이트)로 인접 데이터를 함께 가져온다.

### Reference
- https://en.wikipedia.org/wiki/Locality_of_reference

---

## Sequential locality란 무엇인가?

### Official Answer
Sequential locality, a special case of spatial locality, occurs when data elements are arranged and accessed linearly, such as traversing the elements in a one-dimensional array.

### Reference
- https://en.wikipedia.org/wiki/Locality_of_reference

---

## 캐시가 locality of reference를 활용하는 방식은?

### Official Answer
A cache is a simple example of exploiting temporal locality, because it is a specially designed, faster but smaller memory area, generally used to keep recently referenced data and data near recently referenced data, which can lead to potential performance increases.
Temporal locality plays a role on the lowest level, since results that are referenced very closely together can be kept in the machine registers.

> #### Official Annotation:
> Data elements are brought into cache one cache line at a time.
> This means that spatial locality is again important: if one element is referenced, a few neighboring elements will also be brought into cache.

### Reference
- https://en.wikipedia.org/wiki/Locality_of_reference

---

## 캐시에 저장된 데이터는 메인 메모리에서 공간적으로 가까운 데이터끼리 모여있는가?

### Official Answer
Data elements in a cache do not necessarily correspond to data elements that are spatially close in the main memory; however, data elements are brought into cache one cache line at a time.

### Reference
- https://en.wikipedia.org/wiki/Locality_of_reference
