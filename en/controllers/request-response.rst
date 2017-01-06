Request & Response Objects
##########################

.. php:namespace:: Cake\Http

The request and response objects provide an abstraction around HTTP requests and
responses. The request object in CakePHP allows you to introspect an incoming
request, while the response object allows you to effortlessly create HTTP
responses from your controllers.

.. index:: $this->request
.. _cake-request:

Request
=======

.. php:class:: ServerRequest

``ServerRequest`` is the default request object used in CakePHP. It centralizes a
number of features for interrogating and interacting with request data.
On each request one Request is created and then passed by reference to the
various layers of an application that use request data. By default the request
is assigned to ``$this->request``, and is available in Controllers, Cells, Views
and Helpers. You can also access it in Components using the controller
reference. Some of the duties ``ServerRequest`` performs include:

* Processing the GET, POST, and FILES arrays into the data structures you are
  familiar with.
* Providing environment introspection pertaining to the request. Information
  like the headers sent, the client's IP address, and the subdomain/domain
  names the server your application is running on.
* Providing access to request parameters both as array indexes and object
  properties.

As of 3.4.0, CakePHP's request object implements the `PSR-7
ServerRequestInterface <http://www.php-fig.org/psr/psr-7/>`_ making it easier to
use libraries from outside of CakePHP.

Request Parameters
------------------

The request exposes the routing parameters through the ``getParam()`` method::

    $controllerName = $this->request->getParam('controller');

All :ref:`route-elements` are accessed through this interface.

In addition to :ref:`route-elements`, you also often need access to
:ref:`passed-arguments`. These are both available on the request object as
well::

    // Passed arguments
    $passedArgs = $this->request->getParam('pass');

Will all provide you access to the passed arguments. There
are several important/useful parameters that CakePHP uses internally, these
are also all found in the routing parameters:

* ``plugin`` The plugin handling the request. Will be null when there is no
  plugin.
* ``controller`` The controller handling the current request.
* ``action`` The action handling the current request.
* ``prefix`` The prefix for the current action. See :ref:`prefix-routing` for
  more information.

Query String Parameters
-----------------------

.. php:method:: query($name)

Query string parameters can be read using the ``getQuery()`` method::

    // URL is /posts/index?page=1&sort=title
    $page = $this->request->getQuery('page');

    // Prior to 3.4.0 
    $page = $this->request->query('page');

You can either directly access the query property, or you can use
``query()`` method to read the URL query array in an error-free manner.
Any keys that do not exist will return ``null``::

    $foo = $this->request->getQuery('value_that_does_not_exist');
    // $foo === null

    // You can also provide default values
    $foo = $this->request->getQuery('does_not_exist', 'default val');

If you want to access all the query parameters you can use
``getQueryParams()``::

    $query = $this->request->getQueryParams();

.. versionadded:: 3.4.0
    ``getQueryParams()`` and ``getQuery()`` were added in 3.4.0

Request Body Data
-----------------

.. php:method:: getData($name, $default = null)

All POST data can be accessed using
:php:meth:`Cake\\Network\\ServerRequest::getData()`.  Any form data that
contains a ``data`` prefix will have that data prefix removed. For example::

    // An input with a name attribute equal to 'MyModel[title]' is accessible at
    $title = $this->request->getData('MyModel.title');

Any keys that do not exist will return ``null``::

    $foo = $this->request->getData('Value.that.does.not.exist');
    // $foo == null

PUT, PATCH or DELETE Data
-------------------------

.. php:method:: input($callback, [$options])

When building REST services, you often accept request data on ``PUT`` and
``DELETE`` requests. Any ``application/x-www-form-urlencoded`` request body data
will automatically be parsed and set to ``$this->data`` for ``PUT`` and
``DELETE`` requests. If you are accepting JSON or XML data, see below for how
you can access those request bodies.

When accessing the input data, you can decode it with an optional function.
This is useful when interacting with XML or JSON request body content.
Additional parameters for the decoding function can be passed as arguments to
``input()``::

    $jsonData = $this->request->input('json_decode');

Environment Variables (from $_SERVER and $_ENV)
-----------------------------------------------

.. php:method:: env($key, $value = null)

``ServerRequest::env()`` is a wrapper for ``env()`` global function and acts as
a getter/setter for enviromnent variables without having to modify globals
``$_SERVER`` and ``$_ENV``::

    // Get the host
    $host = $this->request->env('HTTP_HOST');

    // Set a value, generally helpful in testing.
    $this->request->env('REQUEST_METHOD', 'POST');

To access all the environment variables in a request use ``getServerParams()``::

    $env = $this->request->getServerParams();

.. versionadded:: 3.4.0
    ``getServerParams()`` was added in 3.4.0

XML or JSON Data
----------------

Applications employing :doc:`/development/rest` often exchange data in
non-URL-encoded post bodies. You can read input data in any format using
:php:meth:`~Cake\\Network\\ServerRequest::input()`. By providing a decoding function,
you can receive the content in a deserialized format::

    // Get JSON encoded data submitted to a PUT/POST action
    $jsonData = $this->request->input('json_decode');

Some deserializing methods require additional parameters when called, such as
the 'as array' parameter on ``json_decode``. If you want XML converted into a
DOMDocument object, :php:meth:`~Cake\\Network\\ServerRequest::input()` supports
passing in additional parameters as well::

    // Get XML encoded data submitted to a PUT/POST action
    $data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);

Path Information
----------------

The request object also provides useful information about the paths in your
application. The ``base`` and ``webroot`` attributes are useful for
generating URLs, and determining whether or not your application is in a
subdirectory. The attributes you can use are::

    // Assume the current request URL is /subdir/articles/edit/1?page=1

    // Holds /subdir/articles/edit/1?page=1
    $here = $request->here();

    // Holds /subdir
    $base = $request->getAttribute('base');

    // Holds /subdir/
    $base = $request->getAttribute('base');

    // Prior to 3.4.0
    $webroot = $request->webroot;
    $base = $request->base;

.. _check-the-request:

Checking Request Conditions
---------------------------

.. php:method:: is($type, $args...)

The request object provides an easy way to inspect certain conditions in a given
request. By using the ``is()`` method you can check a number of common
conditions, as well as inspect other application specific request criteria::

    $isPost = $this->request->is('post');

You can also extend the request detectors that are available, by using
:php:meth:`Cake\\Http\\ServerRequest::addDetector()` to create new kinds of
detectors. There are four different types of detectors that you can create:

* Environment value comparison - Compares a value fetched from :php:func:`env()`
  for equality with the provided value.
* Pattern value comparison - Pattern value comparison allows you to compare a
  value fetched from :php:func:`env()` to a regular expression.
* Option based comparison -  Option based comparisons use a list of options to
  create a regular expression. Subsequent calls to add an already defined
  options detector will merge the options.
* Callback detectors - Callback detectors allow you to provide a 'callback' type
  to handle the check. The callback will receive the request object as its only
  parameter.

.. php:method:: addDetector($name, $options)

Some examples would be::

    // Add an environment detector.
    $this->request->addDetector(
        'post',
        ['env' => 'REQUEST_METHOD', 'value' => 'POST']
    );

    // Add a pattern value detector.
    $this->request->addDetector(
        'iphone',
        ['env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i']
    );

    // Add an option detector
    $this->request->addDetector('internalIp', [
        'env' => 'CLIENT_IP',
        'options' => ['192.168.0.101', '192.168.0.100']
    ]);

    // Add a callback detector. Must be a valid callable.
    $this->request->addDetector(
        'awesome',
        function ($request) {
            return $request->getParam('awesome');
        }
    );

    // Add a detector that uses additional arguments. As of 3.3.0
    $this->request->addDetector(
        'controller',
        function ($request, $name) {
            return $request->getParam('controller') === $name;
        }
    );

``Request`` also includes methods like
:php:meth:`Cake\\Http\\ServerRequest::domain()`,
:php:meth:`Cake\\Http\\ServerRequest::subdomains()` and
:php:meth:`Cake\\Http\\ServerRequest::host()` to help applications with subdomains,
have a slightly easier life.

There are several built-in detectors that you can use:

* ``is('get')`` Check to see whether the current request is a GET.
* ``is('put')`` Check to see whether the current request is a PUT.
* ``is('patch')`` Check to see whether the current request is a PATCH.
* ``is('post')`` Check to see whether the current request is a POST.
* ``is('delete')`` Check to see whether the current request is a DELETE.
* ``is('head')`` Check to see whether the current request is HEAD.
* ``is('options')`` Check to see whether the current request is OPTIONS.
* ``is('ajax')`` Check to see whether the current request came with
  X-Requested-With = XMLHttpRequest.
* ``is('ssl')`` Check to see whether the request is via SSL.
* ``is('flash')`` Check to see whether the request has a User-Agent of Flash.
* ``is('requested')`` Check to see whether the request has a query param
  'requested' with value 1.
* ``is('json')`` Check to see whether the request has 'json' extension and
  accept 'application/json' mimetype.
* ``is('xml')`` Check to see whether the request has 'xml' extension and accept
  'application/xml' or 'text/xml' mimetype.

.. versionadded:: 3.3.0
    Detectors can take additional parameters as of 3.3.0.


Session Data
------------

To access the session for a given request use the ``session()`` method::

    $userName = $this->request->session()->read('Auth.User.name');

For more information, see the :doc:`/development/sessions` documentation for how
to use the session object.

Host and Domain Name
--------------------

.. php:method:: domain($tldLength = 1)

Returns the domain name your application is running on::

    // Prints 'example.org'
    echo $request->domain();

.. php:method:: subdomains($tldLength = 1)

Returns the subdomains your application is running on as an array::

    // Returns ['my', 'dev'] for 'my.dev.example.org'
    $subdomains = $request->subdomains();

.. php:method:: host()

Returns the host your application is on::

    // Prints 'my.dev.example.org'
    echo $request->host();

Reading the HTTP Method
-----------------------

.. php:method:: getMethod()

Returns the HTTP method the request was made with::

    // Output POST
    echo $request->getMethod();

    // Prior to 3.4.0
    echo $request->method();

Restricting Which HTTP method an Action Accepts
-----------------------------------------------

.. php:method:: allowMethod($methods)

Set allowed HTTP methods. If not matched, will throw
``MethodNotAllowedException``. The 405 response will include the required
``Allow`` header with the passed methods::

    public function delete()
    {
        // Only accept POST and DELETE requests
        $this->request->allowMethod(['post', 'delete']);
        ...
    }

Reading HTTP Headers
--------------------

Allows you to access any of the ``HTTP_*`` headers that were used
for the request. For example::

    // Get the header as a string
    $userAgent = $this->request->getHeaderLine('User-Agent');

    // Get an array of all values.
    $acceptHeader = $this->request->getHeader('Accept');

    // Check if a header exists
    $hasAcceptHeader = $this->request->hasHeader('Accept');

    // Prior to 3.4.0
    $userAgent = $this->request->header('User-Agent');

While some apache installs don't make the ``Authorization`` header accessible,
CakePHP will make it available through apache specific methods as required.

.. php:method:: referer($local = false)

Returns the referring address for the request.

.. php:method:: clientIp()

Returns the current visitor's IP address.

Trusting Proxy Headers
----------------------

If your application is behind a load balancer or running on a cloud service, you
will often get the load balancer host, port and scheme in your requests. Often
load balancers will also send ``HTTP-X-Forwarded-*`` headers with the original
values. The forwarded headers will not be used by CakePHP out of the box. To
have the request object use these headers set the ``trustProxy`` property to
``true``::

    $this->request->trustProxy = true;

    // These methods will now use the proxied headers.
    $port = $this->request->port();
    $host = $this->request->host();
    $scheme = $this->request->scheme();
    $clientIp = $this->request->clientIp();

Checking Accept Headers
-----------------------

.. php:method:: accepts($type = null)

Find out which content types the client accepts, or check whether it accepts a
particular type of content.

Get all types::

    $accepts = $this->request->accepts();

Check for a single type::

    $acceptsJson = $this->request->accepts('application/json');

.. php:method:: acceptLanguage($language = null)

Get all the languages accepted by the client,
or check whether a specific language is accepted.

Get the list of accepted languages::

    $acceptsLanguages = $this->request->acceptLanguage();

Check whether a specific language is accepted::

    $acceptsSpanish = $this->request->acceptLanguage('es-es');

.. index:: $this->response

Response
========

.. php:class:: Response

:php:class:`Cake\\Http\\Response` is the default response class in CakePHP.
It encapsulates a number of features and functionality for generating HTTP
responses in your application. It also assists in testing, as it can be
mocked/stubbed allowing you to inspect headers that will be sent.
Like :php:class:`Cake\\Http\\ServerRequest`, :php:class:`Cake\\Http\\Response`
consolidates a number of methods previously found on :php:class:`Controller`,
:php:class:`RequestHandlerComponent` and :php:class:`Dispatcher`. The old
methods are deprecated in favour of using :php:class:`Cake\\Http\\Response`.

``Response`` provides an interface to wrap the common response-related
tasks such as:

* Sending headers for redirects.
* Sending content type headers.
* Sending any header.
* Sending the response body.

Dealing with Content Types
--------------------------

.. php:method:: withType($contentType = null)

You can control the Content-Type of your application's responses with
:php:meth:`Cake\\Http\\Response::withType()`. If your application needs to deal
with content types that are not built into Response, you can map them with
``type()`` as well::

    // Add a vCard type
    $this->response->type(['vcf' => 'text/v-card']);

    // Set the response Content-Type to vcard.
    $this->response = $this->response->withType('vcf');

    // Prior to 3.4.0
    $this->response->type('vcf');

Usually, you'll want to map additional content types in your controller's
:php:meth:`~Controller::beforeFilter()` callback, so you can leverage the
automatic view switching features of :php:class:`RequestHandlerComponent` if you
are using it.

.. _cake-response-file:

Sending Files
-------------

.. php:method:: withFile($path, $options = [])

There are times when you want to send files as responses for your requests.
You can accomplish that by using :php:meth:`Cake\\Http\\Response::withFile()`::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $response = $this->response->withFile($file['path']);
        // Return the response to prevent controller from trying to render
        // a view.
        return $response;
    }

As shown in the above example, you must pass the file path to the method.
CakePHP will send a proper content type header if it's a known file type listed
in `Cake\\Http\\Reponse::$_mimeTypes`. You can add new types prior to calling
:php:meth:`Cake\\Http\\Response::withFile()` by using the
:php:meth:`Cake\\Http\\Response::type()` method.

If you want, you can also force a file to be downloaded instead of displayed in
the browser by specifying the options::

    $response = $this->response->withFile(
        $file['path'],
        ['download' => true, 'name' => 'foo']
    );

The supported options are:

name
    The name allows you to specify an alternate file name to be sent to
    the user.
download
    A boolean value indicating whether headers should be set to force
    download.

Sending a String as File
------------------------

You can respond with a file that does not exist on the disk, such as a pdf or an
ics generated on the fly from a string::

    public function sendIcs()
    {
        $icsString = $this->Calendars->generateIcs();
        $response = $this->response;
        $response->body($icsString);

        $response = $response->withType('ics');

        // Optionally force file download
        $response = $response->withDownload('filename_for_download.ics');

        // Return response object to prevent controller from trying to render
        // a view.
        return $response;
    }

Streaming Resources
-------------------

You can use a callable with ``body()`` to convert resource streams into
responses::

    $file = fopen('/some/file.png', 'r');
    $this->response->body(function () use ($file) {
        rewind($file);
        fpassthru($file);
        fclose($file);
    });

Callbacks can also return the body as a string::

    $path = '/some/file.png';
    $this->response->body(function () use ($path) {
        return file_get_contents($path);
    });

Setting Headers
---------------

.. php:method:: withHeader($header, $value)

Setting headers is done with the :php:meth:`Cake\\Http\\Response::withHeader()`
method. Like all of the PSR-7 interface methods, this method returns a *new*
instance with the new header::

    // Add/replace a header
    $response = $response->withHeader('X-Extra', 'My header');

    // Set multiple headers
    $response = $response->withHeader('X-Extra', 'My header')
        ->withHeader('Location', 'http://example.com');

    // Append a value to an existing header
    $response = $response->withAddedHeader('Set-Cookie', 'remember_me=1');

    // Prior to 3.4.0 - Set a header
    $this->response->header('Location', 'http://example.com');

Headers are not sent when set. Instead, they are held until the response is
emitted by ``Cake\Http\Server``.

You can now use the convenience method
:php:meth:`Cake\\Http\\Response::withLocation()` to directly set or get the
redirect location header.

Setting the Character Set
-------------------------

.. php:method:: withCharset($charset)

Sets the charset that will be used in the response::

    $this->response = $this->response->withCharset('UTF-8');

    // Prior to 3.4.0
    $this->response->charset('UTF-8');

Interacting with Browser Caching
--------------------------------

.. php:method:: withDisabledCache()

You sometimes need to force browsers not to cache the results of a controller
action. :php:meth:`Cake\\Http\\Response::withDisabledCache()` is intended for just
that::

    public function index()
    {
        // Disable caching
        $this->response = $this->response->withDisabledCache();
    }

.. warning::

    Disabling caching from SSL domains while trying to send
    files to Internet Explorer can result in errors.

.. php:method:: withCache($since, $time = '+1 day')

You can also tell clients that you want them to cache responses. By using
:php:meth:`Cake\\Http\\Response::withCache()`::

    public function index()
    {
        // Enable caching
        $this->response = $this->response->withCache('-1 minute', '+5 days');
    }

The above would tell clients to cache the resulting response for 5 days,
hopefully speeding up your visitors' experience.
The ``withCache()`` method sets the ``Last-Modified`` value to the first
argument. ``Expires`` header and the ``max-age`` directive are set based on the
second parameter. Cache-Control's ``public`` directive is set as well.

.. _cake-response-caching:

Fine Tuning HTTP Cache
----------------------

One of the best and easiest ways of speeding up your application is to use HTTP
cache. Under this caching model, you are only required to help clients decide if
they should use a cached copy of the response by setting a few headers such as
modified time and response entity tag.

Rather than forcing you to code the logic for caching and for invalidating
(refreshing) it once the data has changed, HTTP uses two models, expiration and
validation, which usually are much simpler to use.

Apart from using :php:meth:`Cake\\Http\\Response::withCache()`, you can also use
many other methods to fine-tune HTTP cache headers to take advantage of browser
or reverse proxy caching.

The Cache Control Header
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withSharable($public, $time = null)

Used under the expiration model, this header contains multiple indicators that
can change the way browsers or proxies use the cached content. A
``Cache-Control`` header can look like this::

    Cache-Control: private, max-age=3600, must-revalidate

``Response`` class helps you set this header with some utility methods that will
produce a final valid ``Cache-Control`` header. The first is the
``withSharable()`` method, which indicates whether a response is to be
considered sharable across different users or clients. This method actually
controls the ``public`` or ``private`` part of this header.  Setting a response
as private indicates that all or part of it is intended for a single user. To
take advantage of shared caches, the control directive must be set as public.

The second parameter of this method is used to specify a ``max-age`` for the
cache, which is the number of seconds after which the response is no longer
considered fresh::

    public function view()
    {
        // ...
        // Set the Cache-Control as public for 3600 seconds
        $this->response = $this->response->withSharable(true, 3600);
    }

    public function my_data()
    {
        // ...
        // Set the Cache-Control as private for 3600 seconds
        $this->response = $this->response->withSharable(false, 3600);
    }

``Response`` exposes separate methods for setting each of the directives in
the ``Cache-Control`` header.

The Expiration Header
~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withExpires($time)

You can set the ``Expires`` header to a date and time after which the response
is no longer considered fresh. This header can be set using the
``withExpires()`` method::

    public function view()
    {
        $this->response = $this->response->withExpires('+5 days');
    }

This method also accepts a :php:class:`DateTime` instance or any string that can
be parsed by the :php:class:`DateTime` class.

The Etag Header
~~~~~~~~~~~~~~~

.. php:method:: withEtag($tag, $weak = false)

Cache validation in HTTP is often used when content is constantly changing, and
asks the application to only generate the response contents if the cache is no
longer fresh. Under this model, the client continues to store pages in the
cache, but it asks the application every time
whether the resource has changed, instead of using it directly.
This is commonly used with static resources such as images and other assets.

The ``withEtag()`` method (called entity tag) is a string
that uniquely identifies the requested resource, as a checksum does for a file,
in order to determine whether it matches a cached resource.

To take advantage of this header, you must either call the
``checkNotModified()`` method manually or include the
:doc:`/controllers/components/request-handling` in your controller::

    public function index()
    {
        $articles = $this->Articles->find('all');
        $response = $this->response->withEtag($this->Articles->generateHash($articles));
        if ($response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response = $response;
        // ...
    }

.. note::

    Most proxy users should probably consider using the Last Modified Header
    instead of Etags for performance and compatibility reasons.

The Last Modified Header
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: withModified($time)

Also, under the HTTP cache validation model, you can set the ``Last-Modified``
header to indicate the date and time at which the resource was modified for the
last time. Setting this header helps CakePHP tell caching clients whether the
response was modified or not based on their cache.


To take advantage of this header, you must either call the
``checkNotModified()`` method manually or include the
:doc:`/controllers/components/request-handling` in your controller::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $response = $this->response->withModified($article->modified);
        if ($response->checkNotModified($this->request)) {
            return $response;
        }
        $this->response;
        // ...
    }

The Vary Header
~~~~~~~~~~~~~~~

.. php:method:: withVary($header)

In some cases, you might want to serve different content using the same URL.
This is often the case if you have a multilingual page or respond with different
HTML depending on the browser. Under such circumstances you can use the ``Vary``
header::

    $response = $this->response->withVary('User-Agent');
    $response = $this->response->withVary('Accept-Encoding', 'User-Agent');
    $response = $this->response->withVary('Accept-Language');

Sending Not-Modified Responses
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkNotModified(Request $request)

Compares the cache headers for the request object with the cache header from the
response and determines whether it can still be considered fresh. If so, deletes
the response content, and sends the `304 Not Modified` header::

    // In a controller action.
    if ($this->response->checkNotModified($this->request)) {
        return $this->response;
    }

.. _cors-headers:

Setting Cross Origin Request Headers (CORS)
===========================================

As of 3.2 you can use the ``cors()`` method to define `HTTP Access Control
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`__
related headers with a fluent interface::

    $this->response->cors($this->request)
        ->allowOrigin(['*.cakephp.org'])
        ->allowMethods(['GET', 'POST'])
        ->allowHeaders(['X-CSRF-Token'])
        ->allowCredentials()
        ->exposeHeaders(['Link'])
        ->maxAge(300)
        ->build();

CORS related headers will only be applied to the response if the following
criteria are met:

#. The request has an ``Origin`` header.
#. The request's ``Origin`` value matches one of the allowed Origin values.

.. versionadded:: 3.2
    The ``CorsBuilder`` was added in 3.2

Common Mistakes with Immutable Responses
========================================

As of CakePHP 3.4.0, response objects offer a number of methods that treat
responses as immutable objects. Immutable objects help prevent difficult to
track accidental side-effects, and reduce mistakes caused by method calls caused
by refactoring that change ordering. While they offer a number of benefits,
immutable objects can take some getting used to. Any method that starts with
``with`` operates on the response in an immutable fashion, and will **always**
return a **new** instance. Forgetting to retain the modified instance is the most
frequent mistake people make when working with immutable objects::

    $this->response->withHeader('X-CakePHP', 'yes!');

In the above code, the response will be lacking the ``X-CakePHP`` header, as the
return value of the ``withHeader()`` method was not retained. To correct the
above code you would write::

    $this->response = $this->response->withHeader('X-CakePHP', 'yes!');

.. meta::
    :title lang=en: Request and Response objects
    :keywords lang=en: request controller,request parameters,array indexes,purpose index,response objects,domain information,request object,request data,interrogating,params,previous versions,introspection,dispatcher,rout,data structures,arrays,ip address,migration,indexes,cakephp,PSR-7,immutable
