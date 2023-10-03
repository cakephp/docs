.. _security-header-middleware:

Security Header Middleware
##########################

The ``SecurityHeaderMiddleware`` layer allows you to apply security related
headers to your application. Once setup the middleware can apply the following
headers to responses:

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``Referrer-Policy``
* ``Permissions-Policy``

This middleware is configured using a fluent interface before it is applied to
your application's middleware stack::

    use Cake\Http\Middleware\SecurityHeadersMiddleware;

    $securityHeaders = new SecurityHeadersMiddleware();
    $securityHeaders
        ->setReferrerPolicy()
        ->setXFrameOptions()
        ->noOpen()
        ->noSniff();

    $middlewareQueue->add($securityHeaders);

Here's a list of `common HTTP headers <https://en.wikipedia.org/wiki/List_of_HTTP_header_fields>`__,
and the Mozilla `recommended settings <https://infosec.mozilla.org/guidelines/web_security.html>`__
for securing web applications.

.. meta::
   :title lang=en: Security Header Middleware
   :keywords lang=en: x-frame-options, cross-domain, referrer-policy, download-options, middleware, content-type-options
