# margin collapsing이란 무엇인가? 합쳐진 마진의 크기는 어떻게 정해지는가?

## 도입

블록 요소끼리 세로로 만났을 때, 두 요소의 `margin`이 **각각 따로 적용되지 않고 하나로 합쳐지는** 현상이다. 처음 보면 "왜 내가 준 간격이 그대로 안 나오지?" 하고 당황하는 지점인데, CSS가 의도적으로 이렇게 동작한다.

## 본문

> The top and bottom margins of blocks are sometimes combined (collapsed) into a single margin whose size is the largest of the individual margins (or just one of them, if they are equal).

블록의 위/아래 마진이 때때로 하나의 마진으로 합쳐지고(collapse), 그 크기는 개별 마진 중 **가장 큰 값**(둘이 같으면 그 값)이 된다.

여기서 가장 자주 하는 오해 하나 — **"합(sum)"이 아니라 "최댓값(max)"이다.** `margin-bottom: 30px`인 박스 밑에 `margin-top: 20px`인 박스가 오면, 둘 사이 간격은 50px가 아니라 **30px**다. 두 마진이 더해지는 게 아니라, 더 큰 쪽 하나로 포개진다.

### 왜 "collapse"라고 부르나 (collision이 아니라)

두 마진이 "부딪히는" 거면 collision이어야 할 것 같은데 왜 collapse일까?

- **collision(충돌)**: 두 개가 부딪힘. 부딪힌 뒤에도 **둘은 여전히 둘**이다. 합쳐진다는 의미가 없다.
- **collapse(붕괴/접힘)**: 여러 개가 **무너져 하나로 줄어듦**. 접이식 의자가 접히듯, 여러 칸이 한 칸으로 포개진다. 핵심은 **개수가 줄어든다**는 것.

margin collapsing에서 실제 일어나는 일은 "두 마진(30px, 20px)이 **하나의 마진(30px)으로 합쳐지며 사라지는**" 것이다. 30과 20이 부딪혀 튕기는 게 아니라 둘이 포개져 하나만 남는다. 그래서 충돌이 아니라 접힘이다. CSS의 `border-collapse: collapse`(인접 셀의 두 테두리가 하나로 합쳐짐), 트리 UI의 "collapse a node"(펼쳐진 자식들이 부모 한 줄로 접힘)도 같은 어원 — **"여러 개가 하나로 포개져 줄어든다"**.

## 종합

요약하면: 맞닿은 세로 마진은 **합이 아니라 max로 합쳐진다.** 이름이 collapse인 이유도 "둘이 하나로 접혀 사라진다"는 동작을 그대로 가리키기 때문이다. 단, 가로 마진은 collapse되지 않으며 세로 방향에서만 일어난다.

세 가지 발생 경우와 실제 픽셀이 어떻게 줄어드는지는 데모로 직접 볼 수 있다: [margin collapsing 데모](../../../../assets/frontend/ui-ux/css/margin-collapsing-demo.html)

---

# margin collapsing이 일어나는 세 가지 경우는 각각 어떤 상황인가?

## 도입

collapse는 아무 데서나 일어나지 않고, **세로 마진이 직접 맞닿는** 세 가지 상황에서만 일어난다. 세 경우는 별개의 규칙처럼 보이지만 "맞닿은 마진이 포개진다"는 한 원리의 변주다.

## 본문

> The margins of adjacent siblings are collapsed.

**① 인접 형제.** 나란히 붙은 두 형제에서, 위 형제의 `margin-bottom`과 아래 형제의 `margin-top`이 맞닿아 합쳐진다.

> The vertical margins between a parent block and its descendants can collapse. This happens when there is no separating content between them.

**② 부모와 자식 사이에 분리 콘텐츠가 없을 때.** 부모와 자손 사이를 가로막는 것(테두리·여백·텍스트)이 없으면, 부모의 세로 마진이 자식의 세로 마진과 합쳐진다.

> If there is no border, padding, inline content, height, or min-height to separate a block's margin-top from its margin-bottom, then its top and bottom margins collapse.

**③ 빈 블록.** 위/아래 마진 사이를 가를 border·padding·인라인 콘텐츠·height·min-height가 하나도 없는 빈 블록은, 자기 자신의 `margin-top`과 `margin-bottom`이 서로 합쳐진다.
