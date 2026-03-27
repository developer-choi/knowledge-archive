---
tags: [software-engineering, best-practice]
---
# Questions
- [React Testing Library에서 컴포넌트 트리의 어느 레벨을 테스트해야 하나?](#react-testing-library에서-컴포넌트-트리의-어느-레벨을-테스트해야-하나)
- [Kent C. Dodds가 말하는 "test user"란 무엇이고, 왜 피해야 하나?](#kent-c-dodds가-말하는-test-user란-무엇이고-왜-피해야-하나)

---

# Answers

## React Testing Library에서 컴포넌트 트리의 어느 레벨을 테스트해야 하나?

### Official Answer
Following the guiding principle of this library, it is useful to break down how tests are organized around how the user experiences and interacts with application functionality rather than around specific components themselves.
In some cases, for example for reusable component libraries, it might be useful to include developers in the list of users to test for and test each of the reusable components individually.
Other times, the specific break down of a component tree is just an implementation detail and testing every component within that tree individually can cause issues (see https://kentcdodds.com/blog/avoid-the-test-user).

In practice this means that it is often preferable to test high enough up the component tree to simulate realistic user interactions.
The question of whether it is worth additionally testing at a higher or lower level on top of this comes down to a question of tradeoffs and what will provide enough value for the cost (see https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests on more info on different levels of testing).

### Reference
- https://testing-library.com/docs/react-testing-library/faq

---

## Kent C. Dodds가 말하는 "test user"란 무엇이고, 왜 피해야 하나?

### Official Answer
The two users your UI code has are 1) The end user that's interacting with your component and 2) the developer rendering your component.

These are the only two users that your component should be concerned with.
This component can experience a lot of changes over time.
If it makes changes that alter the developer's API or the end user's expectations, then additional changes need to be made.
If it changes the API, (like maybe it accepts a user prop instead of accessing it from context) then the developer user will have to alter its usage to account for that.
If it changes the user experience, then maybe there will need to be release notes explaining the updates, or some training material updated for example.

However, it can change in other ways too.
Internal refactorings which change how things are implemented (for example, to make the code easier to follow), but don't change the experience of the developer using the component or the end user using it.
With these kinds of changes, no additional work outside the component is needed.

So what does this have to do with testing?
One thing that I talk about a lot is "The more your tests resemble the way your software is used, the more confidence they can give you."
So knowing how your software is used is really valuable.
It gives you a guide for knowing how to test the component.

But far too often, I see tests which are testing implementation details.
When you do this, you introduce a third user.
The developer user and the end user are really all that matters for this component.
So long as it serves those two, then it has a reason to exist.
And when you're maintaining the component you need to keep those two users in mind to make sure that if you break the contract with them, you do something to handle that change.

But as soon as you start testing things which your developer user and end user don't know or care about (implementation details), you add a third testing user, you're now having to keep that third user in your head and make sure you account for changes that affect the testing user as well.

And for what? To get "confidence?"
But what are you getting confidence in when you test things this way?
You're getting confidence that things work for the testing user.
But nobody cares about the testing user.
The testing user doesn't pay the bills like the end user.
It doesn't affect the rest of the system like the developer user.

Writing tests that include implementation details is all downside and no upside.
Focus on the developer user and the end user and your tests will actually give you confidence that things will continue to work for them.
When your tests break it becomes a cue for you to know that you have other changes to make elsewhere to account for the changes you've made.
Avoid testing implementation details and you'll be much better off.

### Reference
- https://kentcdodds.com/blog/avoid-the-test-user
