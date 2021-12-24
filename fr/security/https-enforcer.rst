.. _https-enforcer-middleware:

Middleware HTTPS Enforcer
=========================

Si vous voulez que votre application soit accessible uniquement par des
connexions HTTPS, vous pouvez utiliser le ``HttpsEnforcerMiddleware``::

    use Cake\Http\Middleware\HttpsEnforcerMiddleware;

    // Toujours soulever une exception et ne jamais rediriger.
    $https = new HttpsEnforcerMiddleware([
        'redirect' => false,
    ]);

    // Envoyer un code de statut 302 en cas de redirection
    $https = new HttpsEnforcerMiddleware([
        'redirect' => true,
        'statusCode' => 302,
    ]);

    // Envoyer des headers supplémentaires dans la réponse de redirection.
    $https = new HttpsEnforcerMiddleware([
        'headers' => ['X-Https-Upgrade' => 1],
    ]);

    // Désactiver le HTTPs forcé quand ``debug`` est activé.
    $https = new HttpsEnforcerMiddleware([
        'disableOnDebug' => true,
    ]);

À la réception d'une requête non-HTTP qui n'utilise pas GET, un
``BadRequestException`` sera soulevée.
