Middleware
##########

Middleware objects give you the ability to 'wrap' your application in re-usable,
composable layers of Request handling, or response building logic. Visually,
your application ends up at the center, and middleware is wrapped aroud the app
like an onion. Here we can see an application wrapped with Routes, Assets,
Exception Handling and CORS header middleware.

.. image:: /_static/img/middleware-setup.png

When a request is handled by your application it enters from the outermost
middleware. Each middleware can either delegate the request/response to the next
layer, or return a response. Returning a response prevents lower layers from
ever seeing the request. An example of that is the AssetMiddleware handling
a request for a plugin image during development.

.. image:: /_static/img/middleware-request.png

If no middleware take action to handle the request, a controller will be located
and have its action invoked, or an exception will be raised generating an error
page.

Middleware are part of the new HTTP stack in CakePHP that leverages the PSR-7
request and response interfaces. CakePHP also supports the PSR-15 standard for
server request handlers so you can use any PSR-15 compatible middleware available
on `The Packagist <https://packagist.org>`__.

Middleware in CakePHP
=====================

CakePHP provides several middleware to handle common tasks in web applications:

* ``Cake\Error\Middleware\ErrorHandlerMiddleware`` traps exceptions from the
  wrapped middleware and renders an error page using the
  :doc:`/development/errors` Exception handler.
* ``Cake\Routing\AssetMiddleware`` checks whether the request is referring to a
  theme or plugin asset file, such as a CSS, JavaScript or image file stored in
  either a plugin's webroot folder or the corresponding one for a Theme.
* ``Cake\Routing\Middleware\RoutingMiddleware`` uses the ``Router`` to parse the
  incoming URL and assign routing parameters to the request.
* ``Cake\I18n\Middleware\LocaleSelectorMiddleware`` enables automatic language
  switching from the ``Accept-Language`` header sent by the browser.
* ``Cake\Http\Middleware\HttpsEnforcerMiddleware`` requires HTTPS to be used.
* ``Cake\Http\Middleware\SecurityHeadersMiddleware`` makes it easy to add
  security related headers like ``X-Frame-Options`` to responses.
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` gives you the ability to
  manipulate encrypted cookies in case you need to manipulate cookie with
  obfuscated data.
* ``Cake\Http\Middleware\CsrfProtectionMiddleware`` adds CSRF protection to your
  application.
* ``Cake\Http\Middleware\BodyParserMiddleware`` allows you to decode JSON, XML
  and other encoded request bodies based on ``Content-Type`` header.
* ``Cake\Http\Middleware\CspMiddleware`` makes it simpler to add
  Content-Security-Policy headers to your application.

.. _using-middleware:

Using Middleware
================

Middleware can be applied to your application globally, or to individual
routing scopes.

To apply middleware to all requests, use the ``middleware`` method of your
``App\Application`` class. Your application's ``middleware`` hook method will be
called at the beginning of the request process, you can use the
``MiddlewareQueue`` object to attach middleware::

    namespace App;

    use Cake\Http\BaseApplication;
    use Cake\Http\MiddlewareQueue;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;

    class Application extends BaseApplication
    {
        public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
        {
            // Bind the error handler into the middleware queue.
            $middlwareQueue->add(new ErrorHandlerMiddleware());
            return $middlwareQueue;
        }
    }

In addition to adding to the end of the ``MiddlewareQueue`` you can do
a variety of operations::

        $layer = new \App\Middleware\CustomMiddleware;

        // Added middleware will be last in line.
        $middlwareQueue->add($layer);

        // Prepended middleware will be first in line.
        $middlwareQueue->prepend($layer);

        // Insert in a specific slot. If the slot is out of
        // bounds, it will be added to the end.
        $middlwareQueue->insertAt(2, $layer);

        // Insert before another middleware.
        // If the named class cannot be found,
        // an exception will be raised.
        $middlwareQueue->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // Insert after another middleware.
        // If the named class cannot be found, the
        // middleware will added to the end.
        $middlwareQueue->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

In addition to applying middleware to your entire application, you can apply
middleware to specific sets of routes using
:ref:`Scoped Middleware <connecting-scoped-middleware>`.

Adding Middleware from Plugins
------------------------------

Plugins can use their ``middleware`` hook method to apply any middleware they
have to the application's middleware queue::

    // in plugins/ContactManager/src/Plugin.php
    namespace ContactManager;

    use Cake\Core\BasePlugin;
    use Cake\Http\MiddlewareQueue;
    use ContactManager\Middleware\ContactManagerContextMiddleware;

    class Plugin extends BasePlugin
    {
        public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
        {
            $middlwareQueue->add(new ContactManagerContextMiddleware());

            return $middlwareQueue;
        }
    }

Creating Middleware
===================

Middleware can either be implemented as anonymous functions (Closures), or classes
which extend ``Psr\Http\Server\MiddlewareInterface``. While Closures are suitable
for smaller tasks they make testing harder, and can create a complicated
``Application`` class. Middleware classes in CakePHP have a few conventions:

* Middleware class files should be put in **src/Middleware**. For example:
  **src/Middleware/CorsMiddleware.php**
* Middleware classes should be suffixed with ``Middleware``. For example:
  ``LinkMiddleware``.
* Middleware must implement ``Psr\Http\Server\MiddlewareInterface``.

Middleware can return a response either by calling ``$handler->handle()`` or by
creating their own response. We can see both options in our simple middleware::

    // In src/Middleware/TrackingCookieMiddleware.php
    namespace App\Middleware;

    use Cake\Http\Cookie\Cookie;
    use Cake\I18n\Time;
    use Psr\Http\Message\ResponseInterface;
    use Psr\Http\Message\ServerRequestInterface;
    use Psr\Http\Server\RequestHandlerInterface;
    use Psr\Http\Server\MiddlewareInterface;

    class TrackingCookieMiddleware implements MiddlewareInterface
    {
        public function process(
            ServerRequestInterface $request,
            RequestHandlerInterface $handler
        ): ResponseInterface
        {
            // Calling $handler->handle() delegates control to the *next* middleware
            // In your application's queue.
            $response = $handler->handle($request);

            if (!$request->getCookie('landing_page')) {
                $expiry = new Time('+ 1 year');
                $response = $response->withCookie(new Cookie(
                    'landing_page',
                    $request->getRequestTarget(),
                    $expiry
                ));
            }

            return $response;
        }
    }

Now that we've made a very simple middleware, let's attach it to our
application::

    // In src/Application.php
    namespace App;

    use App\Middleware\TrackingCookieMiddleware;
    use Cake\Http\MiddlewareQueue;

    class Application
    {
        public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
        {
            // Add your simple middleware onto the queue
            $middlwareQueue->add(new TrackingCookieMiddleware());

            // Add some more middleware onto the queue

            return $middlwareQueue;
        }
    }


.. _routing-middleware:

Routing Middleware
==================

Routing middleware is responsible for applying your application's routes and
resolving the plugin, controller, and action a request is going to. It can cache
the route collection used in your application to increase startup time. To
enable cached routes, provide the desired :ref:`cache configuration
<cache-configuration>` as a parameter::

    // In Application.php
    public function middleware(MiddlewareQueue $middlwareQueue): MiddlewareQueue
    {
        // ...
        $middlwareQueue->add(new RoutingMiddleware($this, 'routing'));
    }

The above would use the ``routing`` cache engine to store the generated route
collection.

.. _security-header-middleware:

Security Header Middleware
==========================

The ``SecurityHeaderMiddleware`` layer makes it easy to apply security related
headers to your application. Once setup the middleware can apply the following
headers to responses:

* ``X-Content-Type-Options``
* ``X-Download-Options``
* ``X-Frame-Options``
* ``X-Permitted-Cross-Domain-Policies``
* ``Referrer-Policy``

This middleware is configured using a fluent interface before it is applied to
your application's middleware stack::

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

Content Security Policy Header Middleware
=========================================

The ``CspMiddleware`` makes it simpler to add Content-Security-Policy headers in
your application. Before using it you should install ``paragonie/csp-builder``:

.. code-block::bash

    composer require paragonie/csp-builder

You can then configure the middleware using an array, or passing in a built
``CSPBuilder`` object::

    use Cake\Http\Middleware\CspMiddleware;

    $csp = new CspMiddleware([
        'script-src' => [
            'allow' => [
                'https://www.google-analytics.com',
            ],
            'self' => true,
            'unsafe-inline' => false,
            'unsafe-eval' => false,
        ],
    ]);

    $middlewareQueue->add($csp);

.. _encrypted-cookie-middleware:

Encrypted Cookie Middleware
===========================

If your application has cookies that contain data you want to obfuscate and
protect against user tampering, you can use CakePHP's encrypted cookie
middleware to transparently encrypt and decrypt cookie data via middleware.
Cookie data is encrypted with via OpenSSL using AES::

    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $cookies = new EncryptedCookieMiddleware(
        // Names of cookies to protect
        ['secrets', 'protected'],
        Configure::read('Security.cookieKey')
    );

    $middlwareQueue->add($cookies);

.. note::
    It is recommended that the encryption key you use for cookie data, is used
    *exclusively* for cookie data.

The encryption algorithms and padding style used by the cookie middleware are
backwards compatible with ``CookieComponent`` from earlier versions of CakePHP.

.. _csrf-middleware:

Cross Site Request Forgery (CSRF) Middleware
============================================

CSRF protection can be applied to your entire application, or to specific routing scopes.

.. note::

    You cannot use both of the following approaches together, you must choose
    only one.  If you use both approaches together, a CSRF token mismatch error
    will occur on every `PUT` and `POST` request

By applying the ``CsrfProtectionMiddleware`` to your Application middleware
stack you protect all the actions in application::

    // in src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function middleware($middlwareQueue) {
        $options = [
            // ...
        ];
        $csrf = new CsrfProtectionMiddleware($options);

        $middlwareQueue->add($csrf);
        return $middlwareQueue;
    }

By applying the ``CsrfProtectionMiddleware`` to routing scopes, you can include
or exclude specific route groups::

    // in src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function routes($routes) {
        $options = [
            // ...
        ];
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware($options));
        parent::routes($routes);
    }

    // in config/routes.php
    Router::scope('/', function (RouteBuilder $routes) {
        $routes->applyMiddleware('csrf');
    });


Options can be passed into the middleware's constructor.
The available configuration options are:

- ``cookieName`` The name of the cookie to send. Defaults to ``csrfToken``.
- ``expiry`` How long the CSRF token should last. Defaults to browser session.
- ``secure`` Whether or not the cookie will be set with the Secure flag. That is,
  the cookie will only be set on a HTTPS connection and any attempt over normal HTTP
  will fail. Defaults to ``false``.
- ``httpOnly`` Whether or not the cookie will be set with the HttpOnly flag. Defaults to ``false``.
- ``field`` The form field to check. Defaults to ``_csrfToken``. Changing this
  will also require configuring FormHelper.

When enabled, you can access the current CSRF token on the request object::

    $token = $this->request->getAttribute('csrfToken');

You can use the whitelisting callback feature for more fine grained control over
URLs for which CSRF token check should be done::

    // in src/Application.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;

    public function middleware($middlewareQueue) {
        $csrf = new CsrfProtectionMiddleware();

        // Token check will be skipped when callback returns `true`.
        $csrf->whitelistCallback(function ($request) {
            // Skip token check for API URLs.
            if ($request->getParam('prefix') === 'Api') {
                return true;
            }
        });

        // Ensure routing middleware is added to the queue before CSRF protection middleware.
        $middlewareQueue->add($csrf);

        return $middlewareQueue;
    }

.. note::

    You should apply the CSRF protection middleware only for URLs which handle stateful
    requests using cookies/session. Stateless requests, for e.g. when developing an API,
    are not affected by CSRF so the middleware does not need to be applied for those URLs.

Integration with FormHelper
---------------------------

The ``CsrfProtectionMiddleware`` integrates seamlessly with ``FormHelper``. Each
time you create a form with ``FormHelper``, it will insert a hidden field containing
the CSRF token.

.. note::

    When using CSRF protection you should always start your forms with the
    ``FormHelper``. If you do not, you will need to manually create hidden inputs in
    each of your forms.

CSRF Protection and AJAX Requests
---------------------------------

In addition to request data parameters, CSRF tokens can be submitted through
a special ``X-CSRF-Token`` header. Using a header often makes it easier to
integrate a CSRF token with JavaScript heavy applications, or XML/JSON based API
endpoints.

The CSRF Token can be obtained in JavaScript via the Cookie ``csrfToken``, or in PHP
via the request object attribute named ``csrfToken``. Using the cookie might be easier
when your JavaScript code resides in files separate from the CakePHP view templates,
and when you already have functionality for parsing cookies via JavaScript.

If you have separate JavaScript files but don't want to deal with handling cookies,
you could for example set the token in a global JavaScript variable in your layout, by
defining a script block like this::

    echo $this->Html->scriptBlock(sprintf(
        'var csrfToken = %s;',
        json_encode($this->request->getAttribute('csrfToken'))
    ));

You can then access the token as ``csrfToken`` or ``window.csrfToken`` in any script
file that is loaded after this script block.

Another alternative would be to put the token in a custom meta tag like this::

    echo $this->Html->meta('csrfToken', $this->request->getAttribute('csrfToken'));

which could then be accessed in your scripts by looking for the ``meta`` element with
the name ``csrfToken``, which could be as simple as this when using jQuery::

    var csrfToken = $('meta[name="csrfToken"]').attr('content');


.. _body-parser-middleware:

Body Parser Middleware
======================

If your application accepts JSON, XML or other encoded request bodies, the
``BodyParserMiddleware`` will let you decode those requests into an array that
is available via ``$request->getParsedData()`` and ``$request->getData()``. By
default only ``json`` bodies will be parsed, but XML parsing can be enabled with
an option. You can also define your own parsers::

    use Cake\Http\Middleware\BodyParserMiddleware;

    // only JSON will be parsed.
    $bodies = new BodyParserMiddleware();

    // Enable XML parsing
    $bodies = new BodyParserMiddleware(['xml' => true]);

    // Disable JSON parsing
    $bodies = new BodyParserMiddleware(['json' => false]);

    // Add your own parser matching content-type header values
    // to the callable that can parse them.
    $bodies = new BodyParserMiddleware();
    $bodies->addParser(['text/csv'], function ($body, $request) {
        // Use a CSV parsing library.
        return Csv::parse($body);
    });

.. _https-enforcer-middleware:

HTTPS Enforcer Middleware
=========================

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
        'headers' => ['X-Https-Upgrade', => true],
    ]);

    // Disable HTTPs enforcement when ``debug`` is on.
    $https = new HttpsEnforcerMiddleware([
        'disableOnDebug' => true,
    ]);

If a non-HTTPs request is received that doesn't use GET
a ``BadRequestException`` will be raised.

.. meta::
    :title lang=en: Http Middleware
    :keywords lang=en: http, middleware, psr-7, request, response, wsgi, application, baseapplication, https
