---
tags: [software-engineering, comparison]
source: official
priority:
---
# Questions
- Testing Pyramid 대신 Testing Trophy를 쓰는 이유는?

---

# Answers

## Testing Pyramid 대신 Testing Trophy를 쓰는 이유는?

### Official Answer
As you move up the testing trophy, the tests become more costly.
This comes in the form of actual money to run the tests in a continuous integration environment, but also in the time it takes engineers to write and maintain each individual test.

As you move up the testing trophy, the tests typically run slower.
This is due to the fact that the higher you are on the testing trophy, the more code your test is running.

The cost and speed trade-offs are typically referenced when people talk about the testing pyramid.
If those were the only trade-offs though, then I would focus 100% of my efforts on unit tests and totally ignore any other form of testing when regarding the testing pyramid.
Of course we shouldn't do that and this is because of one super important principle that you've probably heard me say before:

The more your tests resemble the way your software is used, the more confidence they can give you.

What does this mean?
It means that there's no better way to ensure that your Aunt Marie will be able to file her taxes using your tax software than actually having her do it.
But we don't want to wait on Aunt Marie to find our bugs for us right?
It would take too long and she'd probably miss some features that we should probably be testing.
Compound that with the fact that we're regularly releasing updates to our software there's no way any amount of humans would be able to keep up.

So what do we do?
We make trade-offs.
And how do we do that?
We write software that tests our software.
And the trade-off we're always making when we do that is now our tests don't resemble the way our software is used as reliably as when we had Aunt Marie testing our software.
But we do it because we solve real problems we had with that approach.
And that's what we're doing at every level of the testing trophy.

### Reference
- https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests
