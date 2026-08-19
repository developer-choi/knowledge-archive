---
tags: [webview, javascript, concept]
source: official
publishable: true
priority: 2
---
# Questions
- react-native-webview에서 앱 코드와 웹뷰 안의 웹 페이지는 어느 방향으로 무엇을 주고받는가?
- 웹 페이지에서 React Native 앱 코드로 메시지를 보내려면 웹 코드에서 무엇을 부르며, 인자에 어떤 제약이 있는가?
  - 웹에서 `window.ReactNativeWebView.postMessage`를 불렀는데 그런 함수가 없다고 나온다. 원인은 무엇인가?

---

# Answers

## react-native-webview에서 앱 코드와 웹뷰 안의 웹 페이지는 어느 방향으로 무엇을 주고받는가?

### Official Answer

1. React Native -> Web: The `injectedJavaScript` prop
2. React Native -> Web: The `injectJavaScript` method
3. Web -> React Native: The `postMessage` method and `onMessage` prop

### Reference
- https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native

## 웹 페이지에서 React Native 앱 코드로 메시지를 보내려면 웹 코드에서 무엇을 부르며, 인자에 어떤 제약이 있는가?

### Official Answer

`window.ReactNativeWebView.postMessage` only accepts one argument which must be a string.

```jsx
import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class App extends Component {
  render() {
    const html = `
      <html>
      <head></head>
      <body>
        <script>
          setTimeout(function () {
            window.ReactNativeWebView.postMessage("Hello!")
          }, 2000)
        </script>
      </body>
      </html>
    `;

    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{ html }}
          onMessage={(event) => {
            alert(event.nativeEvent.data);
          }}
        />
      </View>
    );
  }
}
```

### Reference
- https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native

## 웹에서 `window.ReactNativeWebView.postMessage`를 불렀는데 그런 함수가 없다고 나온다. 원인은 무엇인가?

### Official Answer

You _must_ set `onMessage` or the `window.ReactNativeWebView.postMessage` method will not be injected into the web page.

### Reference
- https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native
