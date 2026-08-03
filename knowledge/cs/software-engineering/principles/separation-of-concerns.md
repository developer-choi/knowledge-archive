---
tags: [software-engineering, architecture, principle]
source: official
priority: 2
---
# Questions
- 관심사(concern)란 무엇인가?
- 관심사를 나누는 방식에는 무엇이 있는가?
- 사람마다 다르게 나눌 수 있는데, 그래도 관심사 분리가 성립하는가?
- 관심사 분리란 무엇인가?
- 관심사 분리를 하는 이유는?
- 관심사 분리를 지나치게 밀어붙이면 어떤 문제가 생기는가?
- 함수 하나에 관심사 분리를 적용하려면 무엇을 해야 하는가?
- 시스템 설계에 관심사 분리를 적용하려면 무엇을 해야 하는가?
- 모든 layer 컴포넌트에서 hooks(useContext/useQuery/useSelector 등)를 직접 호출하면 책임 분리가 깨지는가?

---

# Answers

## 관심사(concern)란 무엇인가?

### Official Answer
Separation of concerns (SoC) is a design principle in computer science and software engineering, it holds that a complex problem should be divided into distinct concerns — aspects or issues — that can be analyzed, addressed or managed individually, even when they belong to the same system.

It is what I sometimes have called "the separation of concerns", which, even if not perfectly possible, is yet the only available technique for effective ordering of one's thoughts, that I know of.

We know that a program must be correct and we can study it from that viewpoint only; we also know that it should be efficient and we can study its efficiency on another day, so to speak.

But nothing is gained —on the contrary!— by tackling these various aspects simultaneously.

### Reference
- https://en.wikipedia.org/wiki/Separation_of_concerns
- https://www.cs.utexas.edu/users/EWD/transcriptions/EWD04xx/EWD447.html (Dijkstra, "On the role of scientific thought", 1974)

---

## 관심사를 나누는 방식에는 무엇이 있는가?

### Official Answer
Separation of Concerns can be achieved in several ways: temporally (e.g., sequencing activities in a software lifecycle), by quality (e.g., treating correctness separately from efficiency), by view (e.g., analyzing data flow separately from control flow) or by size (modularity).

### User Answer
모듈·파일로 쪼개는 것(size = modularity)은 네 가지 중 하나일 뿐이다. 파일 분리 = 관심사 분리가 아니다.

### Reference
- https://en.wikipedia.org/wiki/Separation_of_concerns

---

## 사람마다 다르게 나눌 수 있는데, 그래도 관심사 분리가 성립하는가?

### Official Answer
This is what I mean by "focussing one's attention upon some aspect": it does not mean ignoring the other aspects, it is just doing justice to the fact that from this aspect's point of view, the other is irrelevant.

### User Answer
판별 기준은 "누가 봐도 같은 선으로 잘리는가"가 아니라 **A를 볼 때 B가 무관해지는가**다. 무관해지지 않으면 아직 안 나뉜 것이고, 여러 갈래로 나뉠 수 있다는 사실 자체는 반례가 아니다 — 다익스트라도 "even if not perfectly possible"이라고 썼다.

### Reference
- https://www.cs.utexas.edu/users/EWD/transcriptions/EWD04xx/EWD447.html

---

## 관심사 분리란 무엇인가?

### Official Answer
Separation of Concerns (SoC) is a fundamental principle in software engineering and design aimed at breaking down complex systems into smaller, more manageable parts.

### Reference
- https://www.geeksforgeeks.org/software-engineering/separation-of-concerns-soc/

---

## 관심사 분리를 하는 이유는?

### Official Answer
This allows focusing on one issue at a time, reducing cognitive load and complexity.

By separating concerns, software engineers aim to create clearer boundaries and reduce the interdependence between different parts of the system.

- Modularity: SoC encourages breaking down complex systems into smaller, more manageable parts, each addressing a single concern. This modular approach makes it easier to understand, develop, and maintain software systems, as developers can focus on individual components without being overwhelmed by the system as a whole.
- Maintainability: By separating concerns, changes and updates to one aspect of the system are less likely to impact other parts. This reduces the risk of unintended side effects and makes it easier to maintain and evolve the software over time. Additionally, when modifications are required, developers can locate and modify the relevant module without affecting the entire system.
- Scalability: SoC promotes a design that allows for easy scalability. As the requirements of a system change or grow, new concerns can be addressed by adding or modifying individual modules without necessitating extensive changes to other parts of the system. This flexibility allows software systems to adapt to evolving needs efficiently. SoC facilitates scalability by allowing different concerns or components of a system to be scaled independently. This helps accommodate increased workload or functionality without affecting the entire system.
- Reusability: Separating concerns often leads to the creation of reusable components. Once a concern has been isolated into a distinct module, it can be reused across different parts of the system or even in entirely different projects. This reduces development time and effort and promotes consistency across applications.
- Parallel Development: SoC facilitates parallel development by providing clear boundaries between different parts of the system. Multiple developers can work on separate concerns concurrently without stepping on each other's toes, leading to more efficient development workflows and shorter time-to-market.
- Understanding and Debugging: With concerns separated into distinct modules, it becomes easier to understand and debug software systems. Developers can focus on one concern at a time, isolating and analyzing issues without being distracted by unrelated functionality. This leads to faster diagnosis and resolution of problems.
- Clarity and Understandability: SoC promotes clear organization within software systems, making it easier for developers to understand the codebase.
- Maintainability and Extensibility: Software systems are often subject to change, whether due to bug fixes, feature enhancements, or evolving requirements. SoC facilitates maintainability and extensibility by localizing changes to specific concerns.
- Encapsulation: SoC encourages encapsulating related functionality within modules or components, making it easier to manage complexity and reduce dependencies between different parts of the system.
- Unit testing becomes more straightforward as developers can write focused tests for each module, ensuring that it behaves correctly under different conditions.

### Reference
- https://en.wikipedia.org/wiki/Separation_of_concerns
- https://www.geeksforgeeks.org/software-engineering/separation-of-concerns-soc/

---

## 관심사 분리를 지나치게 밀어붙이면 어떤 문제가 생기는가?

### Official Answer
- Overhead: Achieving a high level of separation of concerns can sometimes lead to increased complexity and overhead, especially in systems with many interacting components. This can result in higher development and maintenance costs.
- Coordination Overhead: In systems with highly separated concerns, coordinating interactions between different components or modules can become more challenging. This may require additional effort to ensure proper communication and integration between different parts of the system.
- Potential for Misuse: While SoC promotes modularity and encapsulation, there's a risk that developers may misinterpret the principle and overcomplicate the system by creating too many layers or modules. This can lead to unnecessary abstraction and reduced code maintainability.
- Learning Curve: Adopting SoC requires developers to understand and apply the principle effectively, which may involve a learning curve, especially for junior developers or those new to software engineering best practices.
- Increased Indirection: Achieving SoC often involves introducing layers of abstraction or indirection between different parts of the system. While this can promote flexibility and modularity, it can also make code more difficult to follow and debug, especially for developers unfamiliar with the system's architecture.

### Reference
- https://www.geeksforgeeks.org/software-engineering/separation-of-concerns-soc/

---

## 함수 하나에 관심사 분리를 적용하려면 무엇을 해야 하는가?

### Official Answer
- Single Responsibility Principle (SRP): Each function should ideally have a single responsibility or concern. This means that a function should focus on performing one specific task or action. For example, a function responsible for calculating the total price of items in a shopping cart should not also handle formatting the output for display.
- Clear and Descriptive Naming: Functions should have clear and descriptive names that reflect their purpose or concern. This makes it easier for developers to understand the function's behavior without needing to inspect its implementation. Good naming conventions help maintain readability and promote SoC by clearly delineating the responsibilities of each function.
- Encapsulating Logic: Functions should encapsulate related logic within themselves while keeping unrelated concerns separate. For example, if a function needs to perform data validation before processing input, the validation logic should be encapsulated within the function itself rather than spread across multiple functions or modules.
- Avoiding Side Effects: Functions should ideally be free of side effects, meaning they should not modify any state outside their scope or have unintended consequences beyond their intended purpose. This promotes SoC by ensuring that each function's behavior is predictable and isolated from other parts of the system.
- Modularization and Composition: Complex tasks can often be broken down into smaller, more manageable functions, each addressing a specific concern. These functions can then be composed together to achieve the desired behavior, following the principles of modularization and separation of concerns.
- Testing and Debugging: Applying SoC to functions makes it easier to write focused unit tests that verify each concern independently. By isolating concerns within functions, developers can test each concern in isolation, facilitating easier debugging and maintenance.

### Reference
- https://www.geeksforgeeks.org/software-engineering/separation-of-concerns-soc/

---

## 시스템 설계에 관심사 분리를 적용하려면 무엇을 해야 하는가?

### Official Answer
- Layered Architecture: Divide the system into layers, each responsible for a specific concern or aspect of functionality. Common layers include presentation/UI, business logic, data access, and infrastructure. This promotes modularity and allows for easier maintenance and scalability.
- Component-Based Design: Design the system as a collection of reusable, self-contained components, each addressing a specific concern. Components can be combined and composed to build larger systems, promoting reusability and maintainability.
- Clear Interfaces and Contracts: Define clear interfaces and contracts between different components or layers of the system. This helps to encapsulate implementation details and promotes loose coupling between modules, making the system more adaptable to change.
- Separate Cross-Cutting Concerns: Identify and separate cross-cutting concerns, such as logging, security, and error handling, from the core business logic of the system. Use aspect-oriented programming (AOP) or other techniques to modularize and encapsulate these concerns.

### Reference
- https://www.geeksforgeeks.org/software-engineering/separation-of-concerns-soc/

---

## 모든 layer 컴포넌트에서 hooks(useContext/useQuery/useSelector 등)를 직접 호출하면 책임 분리가 깨지는가?

### Official Answer
In summary, it's all tradeoffs.
There is no free lunch.
What might work in one situation might not work in others.
Should a reusable Button component do data fetching?
Probably not.
Does it make sense to split your Dashboard into a DashboardView and a DashboardContainer that passes data down?
Also, probably not.
So it's on us to know the tradeoffs and apply the right tool for the right job.

### Review Note
- OA가 7문장으로 길다. 분할 후보 — 본 질문(tradeoff 평가) + 별도 질문(Button/Dashboard 안티패턴)으로 쪼갤 수 있다.

### Reference
- https://tkdodo.eu/blog/react-query-as-a-state-manager
