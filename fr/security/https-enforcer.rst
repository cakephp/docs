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

Ajouter Strict-Transport-Security
=================================

Si votre application nécessite du SSL, une bonne idée serait de définir le
header ``Strict-Transport-Security``. La valeur de ce header est mise en cache
par le navigateur, et informe les navigateurs qu'ils devraient toujours se
connecter en HTTPS. Vous pouvez configurer ce header avec l'option ``hsts``::

    $https = new HttpsEnforcerMiddleware([
        'hsts' => [
            // La durée pendant laquelle la valeur du header devrait être mise en cache
            'maxAge' => 60 * 60 * 24 * 365,
            // cette politique s'applique-t-elle aux sous-domaines ?
            'includeSubdomains' => true,
            // La valeur de ce header devrait-elle être mise en cache dans le service
            // HSTS preload de Google ? Bien que ne faisant pas partie de la spécification, il est souvent implémenté.
            'preload' => true,
        ],
    ]);

.. versionadded:: 4.4.0
    L'option ``hsts`` a été ajoutée.

 .. meta::
     :title lang=fr: Middleware HTTPS Enforcer
