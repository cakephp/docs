.. _https-enforcer-middleware:

HTTPS Enforcer Middleware
#########################

If you want your application to only be available via HTTPS connections you can
use the ``HttpsEnforcerMiddleware``::

    use Cake\Http\Middleware\HttpsEnforcerMiddleware;

    // Always raise an exception and never redirect.
    $https = new HttpsEnforcerMiddleware([
        'redirect' => false,
    ]);

    // Send a 302 status code when redirecting
    $https = new HttpsEnforcerMiddleware([
        'redirect' => true,
        'statusCode' => 302,
    ]);

    // Send additional headers in the redirect response.
    $https = new HttpsEnforcerMiddleware([
        'headers' => ['X-Https-Upgrade' => 1],
    ]);

    // Disable HTTPs enforcement when ``debug`` is on.
    $https = new HttpsEnforcerMiddleware([
        'disableOnDebug' => true,
    ]);

If a non-HTTP request is received that does not use GET a ``BadRequestException`` will be raised.


.. meta::
    :title lang=en: HTTPS Enforcer Middleware
    :keywords lang=en: security, https, require https
