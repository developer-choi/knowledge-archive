---
tags: [concept, best-practice]
source: official
publishable: true
---

# Questions
- `<main>`은 어떤 내용을 마크업할 때 쓰는가?
  - `<main>`은 한 페이지에 몇 개 두며, 어디에 놓는가?
- `<article>`은 어떤 내용을 마크업할 때 쓰는가?
- `<section>`은 어떤 내용을 마크업할 때 쓰는가?
  - `<article>`과 `<section>`은 어느 한쪽만 다른 쪽을 품을 수 있는가?
- `<aside>`는 어떤 내용을 마크업할 때 쓰는가?
- `<header>`는 어떤 내용을 마크업할 때 쓰는가?
  - `<header>`는 놓이는 자리에 따라 무엇이 달라지는가?
- `<nav>`는 어떤 내용을 마크업할 때 쓰는가?
  - 부차적인 링크도 `<nav>` 안에 넣는가?
- `<footer>`는 어떤 내용을 마크업할 때 쓰는가?

---

# Answers

## `<main>`은 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
`<main>` is for content unique to this page.

main content: A big area in the center that contains most of the unique content of a given webpage, for example, the video you want to watch, or the main story you're reading, or the map you want to view, or the news headlines, etc.

main content: `<main>`, with various content subsections represented by `<article>`, `<section>`, and `<div>` elements.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## `<main>`은 한 페이지에 몇 개 두며, 어디에 놓는가?

### Official Answer
Use `<main>` only once per page, and put it directly inside `<body>`.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## `<article>`은 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
`<article>` encloses a block of related content that makes sense on its own without the rest of the page (for example, a single blog post).

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## `<section>`은 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
`<section>` is similar to `<article>`, but it is more for grouping together a single part of the page that constitutes one single piece of functionality (like a mini map, or a set of article headlines and summaries), or a theme.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## `<article>`과 `<section>`은 어느 한쪽만 다른 쪽을 품을 수 있는가?

### Official Answer
It's considered best practice to begin each section with a heading; also note that you can break `<article>`s up into different `<section>`s, or `<section>`s up into different `<article>`s, depending on the context.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## `<aside>`는 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
`<aside>` contains content that is not directly related to the main content but can provide additional information indirectly related to it (glossary entries, author biography, related links, etc.).

sidebar: Some peripheral info, links, quotes, ads, etc.

sidebar: `<aside>`; often placed inside `<main>`.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## `<header>`는 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
`<header>` represents a group of introductory content.

header: Usually a big strip across the top with a big heading, logo, and perhaps a tagline.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## `<header>`는 놓이는 자리에 따라 무엇이 달라지는가?

### Official Answer
If it is a child of `<body>` it defines the global header of a webpage, but if it's a child of an `<article>` or `<section>` it defines a specific header for that section (try not to confuse this with titles and headings).

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## `<nav>`는 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
`<nav>` contains the main navigation functionality for the page.

navigation bar: Links to the site's main sections; usually represented by menu buttons, links, or tabs.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## 부차적인 링크도 `<nav>` 안에 넣는가?

### Official Answer
Secondary links, etc., would not go in the navigation.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents

---

## `<footer>`는 어떤 내용을 마크업할 때 쓰는가?

### Official Answer
`<footer>` represents a group of end content for a page.

footer: A strip across the bottom of the page that generally contains fine print, copyright notices, or contact info.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents
