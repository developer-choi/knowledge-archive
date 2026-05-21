# Dynamic Route — `[folderName]`

> When you don't know the exact segment names ahead of time and want to create routes from dynamic data, you can use Dynamic Segments that are filled in ***at request time*** or [prerendered](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params) ***at build time***.

와 진짜 궁금한 거 나왔다. App Router에서는 Request Time인지 Build Time인지 몰랐는데.

> Note: Dynamic Segments are equivalent to [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) in the pages directory.

> A Dynamic Segment can be created by wrapping a folder's name in square brackets: `[folderName]`. For example, `[id]` or `[slug]`.

기존하고 같은데 이제는 폴더이름에만 써야 하는 듯.

> Dynamic Segments are passed as the `params` prop to [layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout), [page](https://nextjs.org/docs/app/api-reference/file-conventions/page), [route](https://nextjs.org/docs/app/building-your-application/routing/router-handlers), and [generateMetadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata#generatemetadata) functions.

이 부분이 실질적으로 지금 당장 SEO하는 데 필요하네.
