<a id="security-header-middleware"></a>

# Security Header Middleware

The `SecurityHeaderMiddleware` layer allows you to apply security related
headers to your application. Once setup the middleware can apply the following
headers to responses:

- `X-Content-Type-Options`
- `X-Download-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`

This middleware is configured using a fluent interface before it is applied to
your application's middleware stack:

``` php
use Cake\Http\Middleware\SecurityHeadersMiddleware;

$securityHeaders = new SecurityHeadersMiddleware();
$securityHeaders
    ->setReferrerPolicy()
    ->setXFrameOptions()
    ->noOpen()
    ->noSniff();

$middlewareQueue->add($securityHeaders);
```

Here's a list of [common HTTP headers](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields),
and the Mozilla [recommended settings](https://infosec.mozilla.org/guidelines/web_security.html)
for securing web applications.
