# Easy ESI, browser caching made easy

It is fairly common for websites to have generated content. It could be because of changing content like catalogues or forums, or because of personalisation. This creates a problem for caching systems. To overcome this problem the ESI specification was developed.

When it comes to processing ESI fragments while caching HTTP responses, Varnish and Akamai are two of the best-known options. Unfortunately, it is not always possible for developers to use them on a local environment.

Easy ESI was created to avoid this kind of problem.
It allows to process ESI and CSI fragments directly in the browser, without installing any third-party tool.

Both ESI and CSI requests will always be done using GET methods, as reverse-proxies would do.

## Edge-Side Includes (ESI)

ESI fragments are fetched from the server, the HTML tags are then replaced by the data received.

More information can be found here: [Wikipedia: Edge Side Includes](https://en.wikipedia.org/wiki/Edge_Side_Includes)

Caching these ESI fragments will only be done according to the `Cache-Control` HTTP header that might be set. This can't leverage the default browser behaviour, as browsers will cache Ajax responses regardless of the cache headers.

## Client-Side Includes (CSI)

Generally, user-related information shouldn't be stored in public caches but it is a pity to lose the benefits of a shared cache simply because of that.

Some scenarios require a shared cache taking into consideration personal data, this is why Client-Side Includes were introduced.

These CSI fragments are only processed by browsers, in an asynchronous manner.
This allows to fetch a cached page, then to let the browser place any user-related information in it.

To avoid any flickering on the page, CSI fragments are cached locally on the browser in order to display temporary data while the contents are being fetched.

Setting the `Cache-Control` HTTP header for those fragments will further improve the performance of this mechanism.

## How to use it?

Simply copy `easy-esi.js` into your project and declare it in your HTML pages, for example:

    <script type="text/javascript" src="/js/easy-esi-min.js"/>

jQuery must also be present. This project has been tested against jQuery >= 3.2.1 but older versions might work too.

### Defining ESI fragments

Edge-Side Includes can be defined in several manners:

1. Include: `<esi:include src="/popular-shared-fragment"/>`
* A request will be sent to the URL in the `src` attribute.
* The `<esi:include/>` tag will be replaced by the contents of the response.

2. Remove: `<esi:remove>...</esi:remove>`
* While this one might not be useful in the browser itself, it can be useful on tools such as Akamai.
* Support for it was provided for compatibility reasons.

3. Comment: `<!--esi ... -->`
* While this one might not be useful in the browser itself, it can be useful on tools such as Akamai.
* Support for it was provided for compatibility reasons. 

### Defining CSI fragments

Client-Side Includes can be defined in the same way as ESI fragments, only the namespace changes. For example:

    <csi:include src="/my-personal-data"/>
