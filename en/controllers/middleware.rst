Middleware
##########

Middleware objects give you the ability to 'wrap' your application in re-usable,
composable layers of Request handling, or response building logic. Visually,
your application ends up at the center, and middleware is wrapped around the app
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
* ``Cake\Http\Middleware\EncryptedCookieMiddleware`` gives you the ability to
  manipulate encrypted cookies in case you need to manipulate cookie with
  obfuscated data.
* ``Cake\Http\Middleware\BodyParserMiddleware`` allows you to decode JSON, XML
  and other encoded request bodies based on ``Content-Type`` header.
* :doc:`Cake\Http\Middleware\HttpsEnforcerMiddleware </security/https-enforcer>`
  requires HTTPS to be used.
* :doc:`Cake\Http\Middleware\CsrfProtectionMiddleware </security/csrf>` adds
  double-submit cookie based CSRF protection to your application.
* :doc:`Cake\Http\Middleware\SessionCsrfProtectionMiddleware </security/csrf>`
  adds session based CSRF protection to your application.
* :doc:`Cake\Http\Middleware\CspMiddleware </security/content-security-policy>`
  makes it simpler to add Content-Security-Policy headers to your application.
* :doc:`Cake\Http\Middleware\SecurityHeadersMiddleware </security/security-headers>`
  makes it possible to add security related headers like ``X-Frame-Options`` to
  responses.

.. _using-middleware:

Using Middleware
================

Middleware can be applied to your application globally, to individual
routing scopes, or to specific controllers.

To apply middleware to all requests, use the ``middleware`` method of your
``App\Application`` class. Your application's ``middleware`` hook method will be
called at the beginning of the request process, you can use the
``MiddlewareQueue`` object to attach middleware::

    namespace App;

    use Cake\Core\Configure;
    use Cake\Error\Middleware\ErrorHandlerMiddleware;
    use Cake\Http\BaseApplication;
    use Cake\Http\MiddlewareQueue;

    class Application extends BaseApplication
    {
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            // Bind the error handler into the middleware queue.
            $middlewareQueue->add(new ErrorHandlerMiddleware(Configure::read('Error'), $this));

            // Add middleware by classname.
            // As of 4.5.0 classname middleware are optionally resolved
            // using the DI container. If the class is not found in the
            // container then an instance is created by the middleware queue.
            $middlewareQueue->add(UserRateLimiting::class);

            return $middlewareQueue;
        }
    }

In addition to adding to the end of the ``MiddlewareQueue`` you can do
a variety of operations::

        $layer = new \App\Middleware\CustomMiddleware;

        // Added middleware will be last in line.
        $middlewareQueue->add($layer);

        // Prepended middleware will be first in line.
        $middlewareQueue->prepend($layer);

        // Insert in a specific slot. If the slot is out of
        // bounds, it will be added to the end.
        $middlewareQueue->insertAt(2, $layer);

        // Insert before another middleware.
        // If the named class cannot be found,
        // an exception will be raised.
        $middlewareQueue->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // Insert after another middleware.
        // If the named class cannot be found, the
        // middleware will added to the end.
        $middlewareQueue->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );


If your middleware is only applicable to a subset of routes or individual
controllers you can use :ref:`Route scoped middleware <route-scoped-middleware>`,
or :ref:`Controller middleware <controller-middleware>`.

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
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            $middlewareQueue->add(new ContactManagerContextMiddleware());

            return $middlewareQueue;
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
        public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
        {
            // Add your simple middleware onto the queue
            $middlewareQueue->add(new TrackingCookieMiddleware());

            // Add some more middleware onto the queue

            return $middlewareQueue;
        }
    }


.. _routing-middleware:

Routing Middleware
==================

Routing middleware is responsible for applying your application's routes and
resolving the plugin, controller, and action a request is going to::

    // In Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        // ...
        $middlewareQueue->add(new RoutingMiddleware($this));
    }

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

    $middlewareQueue->add($cookies);

.. note::
    It is recommended that the encryption key you use for cookie data, is used
    *exclusively* for cookie data.

The encryption algorithms and padding style used by the cookie middleware are
backwards compatible with ``CookieComponent`` from earlier versions of CakePHP.

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

.. meta::
    :title lang=en: Http Middleware
    :keywords lang=en: http, middleware, psr-7, request, response, wsgi, application, baseapplication, https
