.. _security-header-middleware:

セキュリティヘッダーミドルウェア
#########################################

``セキュリティヘッダーミドルウェア`` レイヤーを使用すると、
セキュリティ関連のヘッダーをレスポンスに追加できます。

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``X-Permitted-Cross-Domain-Policies``
* ``Referrer-Policy``

このミドルウェアは、アプリケーションのミドルウェアスタックに
追加される前に、流暢なインターフェイスを使用して構成されます。

このミドルウェアは、ミドルウェアスタックに適用される前に、
スマートなインターフェイスを使用して構成されます。::

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
   :title lang=ja: Security Header Middleware
   :keywords lang=ja: x-frame-options, cross-domain, referrer-policy, download-options, middleware, content-type-options
