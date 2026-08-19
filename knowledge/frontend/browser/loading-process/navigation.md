---
tags: [browser, network, performance]
source: official
priority: 1
---

# Questions
- Navigation이란 무엇이며 언제 발생하는가?
- 주소창에 URL을 입력하면 브라우저가 수행하는 전체 흐름은?
- DNS lookup이란 무엇이며 왜 캐싱되는가?
- Redirect는 왜 성능에 부정적인가?

---

# Answers

## Navigation이란 무엇이며 언제 발생하는가?

### Official Answer
Navigation is the first step in loading a web page.
It occurs whenever a user requests a page by entering a URL into the address bar, clicking a link, submitting a form, as well as other actions.

One of the goals of web performance is to minimize the amount of time navigation takes to complete.
In ideal conditions, this usually doesn't take too long, but latency and bandwidth are foes that can cause delays.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## 주소창에 URL을 입력하면 브라우저가 수행하는 전체 흐름은?

### Official Answer
The browser goes to the DNS server and finds the real address of the server that the website lives on.

The browser sends an HTTP request message to the server, asking it to send the website.

The browser and the server exchange data over your internet using TCP/IP.

If the server approves the client's request, it sends a '200 OK' message along with the website's files, split into small chunks called data packets.

The browser assembles the small chunks into a complete web page and displays it to you.

### Reference
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works

---

## DNS lookup이란 무엇이며 왜 캐싱되는가?

### Official Answer
The first step of navigating to a web page is finding where the assets for that page are located.
If you navigate to https://example.com, the HTML page is located on the server with IP address of 93.184.216.34.
If you've never visited this site, a DNS lookup must happen.

A DNS lookup returns an IP address, which is cached to speed up future requests.

### Reference
- https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work

---

## Redirect는 왜 성능에 부정적인가?

### Official Answer
When a resource is requested, the server may respond with a redirect, either with a permanent redirect (a 301 Moved Permanently response) or a temporary one (a 302 Found response).
Redirects slow down page load speed because it requires the browser to make an additional HTTP request at the new location to retrieve the resource.

### Reference
- https://web.dev/learn/performance/general-html-performance#minimize_redirects

