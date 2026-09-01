---
tags: [browser, network, performance]
source: official
priority: 1
---

# Questions
- 주소창에 URL을 입력하면 브라우저가 수행하는 전체 흐름은?
- DNS lookup이란 무엇이며 왜 캐싱되는가?

---

# Answers

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

