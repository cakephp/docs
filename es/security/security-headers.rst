.. _security-header-middleware:

Middleware SecurityHeader
#########################

El ``SecurityHeaderMiddleware`` te permite agregar headers
relacionados con la seguridad a tu aplicación. Una vez configurado, el middleware
agregará los siguientes headers a las respuestas:

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``Referrer-Policy``

Este middleware debe ser configurado antes de agregarlo a la cola de middlewares::

    use Cake\Http\Middleware\SecurityHeadersMiddleware;

    $securityHeaders = new SecurityHeadersMiddleware();
    $securityHeaders
        ->setReferrerPolicy()
        ->setXFrameOptions()
        ->noOpen()
        ->noSniff();

    $middlewareQueue->add($securityHeaders);

Aqui está uina lista de `Headers HTTP comunes <https://en.wikipedia.org/wiki/List_of_HTTP_header_fields>`__,
y  la `configuración recomendada <https://infosec.mozilla.org/guidelines/web_security.html>`__ de Mozzilla para
aplicaciones web seguras.

.. meta::
   :title lang=en: Middleware SecurityHeader
   :keywords lang=en: x-frame-options, cross-domain, referrer-policy, download-options, middleware, content-type-options
