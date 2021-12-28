Middleware des Headers de Sécurité
==================================

La couche ``SecurityHeaderMiddleware`` vous permet d'ajouter à votre application
des headers liés à la sécurité. Une fois configuré, le middleware peut ajouter
les headers suivants aux réponses:

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``X-Permitted-Cross-Domain-Policies``
* ``Referrer-Policy``

Ce middleware peut être configuré en utilisant l'interface fluide avant d'être
appliqué au stack de middlewares::

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

.. meta::
   :title lang=fr: Middleware des Headers de Sécurité
   :keywords lang=fr: x-frame-options, cross-domain, referrer-policy, download-options, middleware, content-type-options
