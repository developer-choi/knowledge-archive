---
tags: [algorithm, concept, performance]
---
# Questions
- Time Complexity란?
- Time Complexity가 필요한 이유는?
- Time Complexity를 점근 표기법(asymptotic notation)으로 표현하는 이유는?
- Time Complexity를 어떻게 계산하는가?
- 시간복잡도별 알고리즘 종류는?
- Time Complexity의 한계는?

---

# Answers

## Time Complexity란?

### Official Answer
Time complexity is **a way** to describe how the execution time of an algorithm grows as the input size increases.

### Reference
- https://www.geeksforgeeks.org/dsa/analysis-of-algorithms/

---

## Time Complexity가 필요한 이유는?

### User Answer
입력값이 커졌을 때 실행시간이 얼마나 될지 점근적으로 따져보기 위해.
알고리즘끼리 비교할 때 활용한다.

### Reference
- https://www.geeksforgeeks.org/dsa/analysis-of-algorithms/

---

## Time Complexity를 점근 표기법(asymptotic notation)으로 표현하는 이유는?

### User Answer
정확한 실행시간을 알기 위함이 아니라, 입력값이 커졌을 때 어림잡아보기 위함이다.
따라서 상수는 무시하고 최고차항만 본다.

정확한 실행시간을 구하는 것 자체가 무의미하기도 하다.
로직을 실행해도 컴퓨터마다 성능이 다 다르고, 그 로직이 실행되는 데 영향을 주는 변수가 너무 많기 때문이다.

### Reference
- https://www.geeksforgeeks.org/dsa/analysis-of-algorithms/

---

## Time Complexity를 어떻게 계산하는가?

### User Answer
**방법 1 — 코드 라인별로 따지기**

예) 배열 values의 길이가 n이면, 루프 안의 연산을 n번 반복한다.
최고차항만 남기고 나머지를 제거하면 f(n) = n → O(n).

**방법 2 — 방식을 말로 설명해서 수식 세우기**

예) Binary Search: 1회 실행할 때마다 배열의 길이가 1/2씩 줄어든다.
n × (1/2)^k = 1 이 되려면 k = log₂n → O(log n).

> #### AI Annotation:
> 피보나치처럼 직접 계산하기 어려운 경우도 있다.
> 코테 실전에서는 "시간복잡도별 알고리즘을 미리 공부하고, 문제에서 요구하는 시간복잡도를 역산해서 접근"하는 방식이 더 중요하다.
>
> **문제에서 요구하는 시간복잡도 파악 방법:**
> 데이터 크기 × 알고리즘 O(n)값이 **1억**을 넘으면 안 된다.
> 예) 데이터 크기가 10만이면 O(n²) = 10억 → 불가. O(n log n) 이하로 풀어야 한다.

### Reference
- https://www.geeksforgeeks.org/dsa/analysis-of-algorithms/

---

## 시간복잡도별 알고리즘 종류는?

### User Answer
| 시간복잡도 | 알고리즘 예시 |
|---|---|
| O(n!) / O(2ⁿ) | 완전탐색(Brute Force) |
| O(n³) | 플로이드-워샬(그래프 모든 쌍 최단거리) |
| O(n²) | 벨만-포드, Bubble Sort (최악), Selection Sort (최악) |
| O(n log n) | Merge Sort, Quick Sort (평균), Heap Sort |
| O(n) | Linear Search |
| O(log n) | Binary Search |
| O(1) | Hash Table 조회 |

> #### User Annotation:
> `array.indexOf()`도 O(n)이다.
> `array.splice()`도 O(n)이다 — 제거 후 내부 재배치 작업도 필요하므로 코테에서 절대 금물.

### Reference
- https://www.geeksforgeeks.org/dsa/analysis-of-algorithms/

---

## Time Complexity의 한계는?

### User Answer
시간복잡도가 알고리즘 속도의 모든 것을 표현할 수 없다.
더 빠른 알고리즘임에도 불구하고 시간복잡도는 같은 경우가 있다.

예) Bubble Sort < Selection Sort < Insertion Sort (실제 속도 순서).
셋 다 최악의 경우 O(n²)로 같지만, Selection Sort는 Bubble Sort보다 스왑을 훨씬 적게 한다.

### Reference
- https://www.geeksforgeeks.org/dsa/analysis-of-algorithms/
