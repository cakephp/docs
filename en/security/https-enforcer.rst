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

    // Only trust HTTP_X_ headers from the listed servers.
    $https = new HttpsEnforcerMiddleware([
        'trustProxies' => ['192.168.1.1'],
    ]);

If a non-HTTP request is received that does not use GET a ``BadRequestException`` will be raised.

Adding Strict-Transport-Security
================================

When your application requires SSL it is a good idea to set the
``Strict-Transport-Security`` header. This header value is cached in the
browser, and informs browsers that they should always connect with HTTPS connections.
You can configure this header with the ``hsts`` option::

    $https = new HttpsEnforcerMiddleware([
        'hsts' => [
            // How long the header value should be cached for.
            'maxAge' => 60 * 60 * 24 * 365,
            // should this policy apply to subdomains?
            'includeSubDomains' => true,
            // Should the header value be cacheable in google's HSTS preload
            // service? While not part of the spec it is widely implemented.
            'preload' => true,
        ],
    ]);

.. versionadded:: 4.4.0
    The ``hsts`` option was added.

.. versionadded:: 4.5.0
   The ``trustedProxies`` option was added.


.. meta::
    :title lang=en: HTTPS Enforcer Middleware
    :keywords lang=en: security, https, require https
