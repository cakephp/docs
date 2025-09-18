<a id="security-header-middleware"></a>

# Security Header Middleware

The `SecurityHeaderMiddleware` layer allows you to apply security related
headers to your application. Once setup the middleware can apply the following
headers to responses:

- `X-Content-Type-Options`
- `X-Download-Options`
- `X-Frame-Options`
- `X-Permitted-Cross-Domain-Policies`
- `Referrer-Policy`

This middleware is configured using a fluent interface before it is applied to
your application's middleware stack:

``` php
use Cake\Http\Middleware\SecurityHeadersMiddleware;

$securityHeaders = new SecurityHeadersMiddleware();
$securityHeaders
    ->setCrossDomainPolicy()
    ->setReferrerPolicy()
    ->setXFrameOptions()
    ->setXssProtection()
    ->noOpen()
    ->noSniff();

$middlewareQueue->add($securityHeaders);
```
