# 왜 매 턴 전체 대화를 다시 보내는가?

## 도입

Messages API는 Claude에게 메시지를 보내고 응답을 받는 HTTP API다. 원문의 답은 한 단어로 요약된다 — 이 API가 **stateless**이기 때문이다. HTTP에서 로그인 상태를 매 요청마다 쿠키나 토큰으로 증명하듯, Messages API에서는 클라이언트가 매 요청마다 **지금까지의 대화를 통째로** 실어 보낸다.

---

## 본문

> The Messages API is stateless,

"Messages API는 stateless다."

- **stateless**: API 쪽이 이전 요청의 내용을 보관하지 않는다는 뜻이다. HTTP의 stateless와 같은 의미로, **요청 하나하나가 서로 독립적**이다. 1번째 요청에서 "내 이름은 Alice야"라고 말했어도, 2번째 요청을 받은 API는 그 사실을 모른다. 대화의 "턴"이 이어지는 것처럼 보여도, API 입장에서는 매번 처음 받는 요청이다.

> which means that you always send the full conversational history to the API.

"그래서 API에 요청할 때는 항상 대화 이력 전체를 보내야 한다."

- **which means**: 앞의 stateless에서 바로 따라 나오는 귀결임을 잇는 말이다. 전체 이력을 보내는 것은 API가 기억하지 않는다는 성질에서 바로 나오는 결과다.
- **always**: 예외가 없다는 뜻이다. 두 번째 턴이든 열 번째 턴이든 매 요청이 같은 방식이다. 마지막 메시지만 보내면 API는 그 한 줄만 보고 응답한다 — 앞에서 무슨 이야기를 했는지 알 방법이 없다.
- **you**: 이력을 들고 있는 쪽이 API를 호출하는 클라이언트라는 점을 짚는다. **대화를 쌓고 보관하는 책임은 호출하는 코드에 있다.**
- **full conversational history**: 사용자 메시지뿐 아니라 Claude가 앞서 돌려준 응답까지 포함한, 지금까지 오간 메시지 전부다. TypeScript SDK에서는 `messages` 배열이 이 이력이다.

```ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const model = '...'; // 사용할 모델 id

// 1번째 턴
const messages: Anthropic.MessageParam[] = [{ role: 'user', content: '내 이름은 Alice야' }];
const first = await anthropic.messages.create({ model, max_tokens: 1024, messages });

// 2번째 턴 — 앞의 대화를 배열에 이어 붙인 뒤 배열 전체를 다시 보낸다
messages.push({ role: 'assistant', content: first.content });
messages.push({ role: 'user', content: '내 이름이 뭐였지?' });
const second = await anthropic.messages.create({ model, max_tokens: 1024, messages });
// ← messages에 첫 질문·응답이 없으면 API는 이름을 알 수 없다
```

---

## 종합

원문은 원인과 결과를 한 문장에 담았다. 원인은 API가 stateless라는 것이고, 결과는 대화를 이어 가려면 매 요청에 전체 이력을 보내야 한다는 것이다.

**대화의 기억은 호출하는 코드의 `messages` 배열에 있다.** Messages API 위에 만든 채팅 화면이 이전 대화를 기억하는 것처럼 보인다면, 그 기억은 클라이언트가 이력을 보관해 두었다가 매번 함께 보내서 생긴다.

턴이 진행될수록 요청에 실리는 이력이 쌓여 간다.

```
1번째 요청  messages: [user1]
            ← 응답 assistant1

2번째 요청  messages: [user1, assistant1, user2]
            ← 응답 assistant2

3번째 요청  messages: [user1, assistant1, user2, assistant2, user3]
            ← 응답 assistant3

API는 요청 사이에 아무것도 보관하지 않는다
→ 매 요청이 그때까지의 대화 전체를 담는다
```
