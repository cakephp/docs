.. _security-header-middleware:

Middleware de Cabeçalho de Segurança
####################################

A camada ``SecurityHeaderMiddleware`` permite aplicar cabeçalhos
relacionados à segurança à sua aplicação. Uma vez configurado, o middleware pode aplicar os seguintes
cabeçalhos às respostas:

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``Referrer-Policy``
* ``Permissions-Policy``

Este middleware é configurado usando uma interface fluente antes de ser aplicado à pilha de 
middleware do seu aplicativo::

    use Cake\Http\Middleware\SecurityHeadersMiddleware;

    $securityHeaders = new SecurityHeadersMiddleware();
    $securityHeaders
        ->setReferrerPolicy()
        ->setXFrameOptions()
        ->noOpen()
        ->noSniff();

    $middlewareQueue->add($securityHeaders);

Aqui está uma lista de `cabeçalhos HTTP comuns <https://en.wikipedia.org/wiki/List_of_HTTP_header_fields>`__,
e as `configurações recomendadas <https://infosec.mozilla.org/guidelines/web_security.html>`__
da Mozilla para proteger aplicativos web.

.. meta::
   :title lang=pt: Middleware de Cabeçalho de Segurança
   :keywords lang=pt: x-frame-options, cross-domain, referrer-policy, download-options, middleware, content-type-options
