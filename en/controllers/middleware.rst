Middleware
##########

Middleware objects give you the ability to 'wrap' your application in re-usable,
composable layers of Request handling, or response building logic. Middleware
are part of the new HTTP stack in CakePHP that leverages the PSR7 request and
response interfaces. By leveraging the PSR7 standard you can use any PSR7
compatible middleware available on `The Packagist <https://packagist.org>`__.

CakePHP provides several middleware out of the box:

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

.. _using-middleware:

Using Middleware
================

You attach middleware in your ``App\Application`` class' ``middleware`` method.
If you don't have an ``App\Application`` class, see the section on
:ref:`adding-http-stack` for more information. Your application's ``middleware``
hook method will be called early in the request process, you can use the
``Middleware`` object to attach middleware::

    namespace App;

    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function middleware($middleware)
        {
            $error = new \Cake\Error\Middleware\ErrorHandlerMiddleware();
            $middleware->push($error);
            return $middleware;
        }
    }

In addition to pushing onto the end of the ``MiddlewareStack`` you can do
a variety of operations::

        $layer = new \App\Middleware\CustomMiddleware;

        // Pushed middleware will be last in line.
        $middleware->push($layer);

        // Prepended middleware will be first in line.
        $middleware->prepend($layer);

        // Insert in a specific slot. If the slot is out of
        // bounds, it will be added to the end.
        $middleware->insertAt(2, $layer);

        // Insert before another middleware.
        // If the named class cannot be found,
        // an exception will be raised.
        $middleware->insertBefore(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

        // Insert after another middleware.
        // If the named class cannot be found, the
        // middleware will added to the end.
        $middleware->insertAfter(
            'Cake\Error\Middleware\ErrorHandlerMiddleware',
            $layer
        );

Adding Middleware from Plugins
------------------------------

After the middleware stack has been prepared by the application, the
``Server.buildMiddleware`` event is triggered. This event can be useful to add
middleware from plugins. Plugins can register listeners in their bootstrap
scripts, that add middleware::

    // In ContactManager plugin bootstrap.php
    use Cake\Event\EventManager;

    EventManager::instance()->on(
        'Server.buildMiddleware',
        function ($event, $middleware) {
            $middleware->push(new ContactPluginMiddleware());
        });

PSR7 Requests and Responses
===========================

Middleware and the new HTTP stack are built on top of the `PSR7 Request
& Response Interfaces <http://www.php-fig.org/psr/psr-7/>`__. While all
middleware will be exposed to these interfaces, your controllers, components,
and views will *not*.

Interacting with Requests
-------------------------

The ``RequestInterface`` provides methods for interacting with the headers,
method, URI, and body of a request. To interact with the headers, you can::

    // Read a header as text
    $value = $request->getHeaderLine(‘Content-Type’);

    // Read header as an array
    $value = $request->getHeader(‘Content-Type’);

    // Read all the headers as an associative array.
    $headers = $request->getHeaders();

Requests also give access to the cookies and uploaded files they contain::

    // Get an array of cookie values.
    $cookies = $request->getCookieParams();

    // Get a list of UploadedFile objects
    $files = $request->getUploadedFiles();

    // Read the file data.
    $files[0]->getStream();
    $files[0]->getSize();
    $files[0]->getClientFileName();

    // Move the file.
    $files[0]->moveTo($targetPath);

Requests contain a URI object, which contains methods for interacting with the
requested URI::

    // Get the URI
    $uri = $request->getUri();

    // Read data out of the URI.
    $path = $uri->getPath();
    $query = $uri->getQuery();
    $host = $uri->getHost();

Lastly, you can interact with a request's 'attributes'. CakePHP uses these
attributes to carry framework specific request parameters. There are a few
important attributes in any request handled by CakePHP:

* ``base`` contains the base directory for your application if there is one.
* ``webroot`` contains the webroot directory for your application.
* ``params`` contains the results of route matching once routing rules have been
  processed.
* ``session`` contains an instance of CakePHP's ``Session`` object. See
  :ref:`accessing-session-object` for more information on how to use the session
  object.


Interacting with Responses
--------------------------

The methods available to create a server response are the same as those
available when interacting with :ref:`httpclient-response-objects`. While the
interface is the same the usage scenarios are different.

When modifying the response, it is important to remember that responses are
**immutable**. You must always remember to store the results of any setter
method. For example::

    // This does *not* modify $response. The new object was not
    // assigned to a variable.
    $response->withHeader('Content-Type', 'application/json');

    // This works!
    $newResponse = $response->withHeader('Content-Type', 'application/json');

Most often you'll be setting headers and response bodies on requests::

    // Assign headers and a status code
    $response = $response->withHeader('Content-Type', 'application/json')
        ->withHeader('Pragma', 'no-cache')
        ->withStatus(422);

    // Write to the body
    $body = $response->getBody();
    $body->write(json_encode(['errno' => $errorCode]));

Creating Middleware
===================

Middleware can either be implemented as anonymous functions (Closures), or as
invokable classes. While Closures are suitable for smaller tasks they make
testing harder, and can create a complicated ``Application`` class. Middleware
classes in CakePHP have a few conventions:

* Middleware class files should be put in **src/Middleware**. For example:
  **src/Middleware/CorsMiddleware.php**
* Middleware classes should be suffixed with ``Middleware``. For example:
  ``LinkMiddleware``.
* Middleware are expected to implement the middleware protocol.

Middleware Protocol
-------------------

While not a formal interface (yet), Middleware do have a soft-interface or
protocol. The protocol is as follows:

#. Middleware must implement ``__invoke($request, $response, $next)``.
#. Middleware must return an object implementing the PSR7 ``ResponseInterface``.

Middleware can return a response either by calling ``$next`` or by creating
their own response. We can see both options in our simple middleware::

    // In src/Middleware/SimpleMiddleware.php
    namespace App\Middleware;

    class SimpleMiddleware
    {
        function __invoke($request, $response, $next)
        {
            // If we find /simple/ in the URL return a simple response.
            if (strpos($request->getUri()->getPath(), '/simple/') !== false) {
                $body = $response->getBody();
                $body->write('Thanks!');
                return $response->withStatus(202)
                    ->withHeader('Content-Type', 'text/plain')
                    ->withBody($body);
            }

            // Calling $next() delegates control to then *next* middleware
            // In your application's stack.
            $response = $next($request, $response);

            // We could further modify the response before returning it.
            return $response;
        }
    }

Now that we've made a very simple middleware, let's attach it to our
application::

    // In src/Application.php
    namespace App;

    use App\Middleware\SimpleMiddleware;

    class Application
    {
        public function middleware($middleware)
        {
            // Push your simple middleware onto the stack
            $middleware->push(new SimpleMiddleware());

            // Push some more middleware onto the stack

            return $middleware;
        }
    }

.. _adding-http-stack:

Adding the new HTTP Stack to an Existing Application
====================================================

Using HTTP Middleware in an existing application requires a few changes to your
application.

#. First update your ``webroot/index.php``. Copy the file contents from the `app
   skeleton <https://github.com/cakephp/app/tree/master/webroot/index.php>`__.
#. Create an ``Application`` class. See the :ref:`using-middleware` section
   above for how to do that. Or copy the example in the `app skeleton
   <https://github.com/cakephp/app/tree/master/src/Application.php>`__.

Once those two steps are complete, you are ready to start re-implementing any
application/plugin dispatch filters as HTTP middleware.

.. meta::
    :title lang=en: Http Middleware
    :keywords lang=en: http, middleware, psr7, request, response, wsgi, application, baseapplication
