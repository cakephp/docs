Request & Response Objects
##########################

.. php:namespace:: Cake\Network

The request and response objects provide an abstraction around HTTP requests and
responses. The request object in CakePHP allows you to introspect an incoming
request, while the response object allows you to effortlessly create HTTP
responses from your controllers.

.. index:: $this->request
.. _cake-request:

Request
=======

.. php:class:: Request

``Request`` is the default request object used in CakePHP. It centralizes a
number of features for interrogating and interacting with request data.
On each request one Request is created and then passed by reference to the
various layers of an application that use request data. By default the request
is assigned to ``$this->request``, and is available in Controllers, Cells, Views
and Helpers. You can also access it in Components using the controller
reference. Some of the duties ``Request`` performs include:

* Processing the GET, POST, and FILES arrays into the data structures you are
  familiar with.
* Providing environment introspection pertaining to the request. Information
  like the
  headers sent, the client's IP address, and the subdomain/domain names the
  server your application is running on.
* Providing access to request parameters both as array indexes and object
  properties.

Request Parameters
------------------

Request exposes several interfaces for accessing request parameters::

    $this->request->params['controller'];
    $this->request->param('controller');

All of the above will access the same value. All :ref:`route-elements` are
accessed through this interface.

In addition to :ref:`route-elements`, you also often need access to
:ref:`passed-arguments`. These are both available on the request object as
well::

    // Passed arguments
    $this->request->pass;
    $this->request['pass'];
    $this->request->params['pass'];

Will all provide you access to the passed arguments. There
are several important/useful parameters that CakePHP uses internally, these
are also all found in the request parameters:

* ``plugin`` The plugin handling the request. Will be null when there is no
  plugin.
* ``controller`` The controller handling the current request.
* ``action`` The action handling the current request.
* ``prefix`` The prefix for the current action. See :ref:`prefix-routing` for
  more information.
* ``bare`` Present when the request came from
  :php:meth:`~Cake\\Controller\\Controller::requestAction()` and included the
  bare option. Bare requests do not have layouts rendered.
* ``requested`` Present and set to ``true`` when the action came from
  :php:meth:`~Cake\\Controller\\Controller::requestAction()`.

Query String Parameters
-----------------------

.. php:method:: query($name)

Query string parameters can be read using
:php:attr:`~Cake\\Network\\Request::$query`::

    // URL is /posts/index?page=1&sort=title
    $this->request->query('page');

You can either directly access the query property, or you can use
``query()`` method to read the URL query array in an error-free manner.
Any keys that do not exist will return ``null``::

    $foo = $this->request->query('value_that_does_not_exist');
    // $foo === null

Request Body Data
-----------------

.. php:method:: data($name)

All POST data can be accessed using :php:meth:`Cake\\Network\\Request::data()`.
Any form data that contains a ``data`` prefix will have that data prefix
removed. For example::

    // An input with a name attribute equal to 'MyModel[title]' is accessible at
    $this->request->data('MyModel.title');

Any keys that do not exist will return ``null``::

    $foo = $this->request->data('Value.that.does.not.exist');
    // $foo == null

You can also access the array of data, as an array::

    $this->request->data['title'];
    $this->request->data['comments'][1]['author'];

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

    $this->request->input('json_decode');

Environment Variables (from $_SERVER and $_ENV)
-----------------------------------------------

.. php:method:: env($key, $value = null)

``Request::env()`` is a wrapper for ``env()`` global function and acts as
a getter/setter for enviromnent variables without having to modify globals
``$_SERVER`` and ``$_ENV``::

    // Get a value
    $value = $this->request->env('HTTP_HOST');

    // Set a value. Generally helpful in testing.
    $this->request->env('REQUEST_METHOD', 'POST');

XML or JSON Data
-----------------

Applications employing :doc:`/development/rest` often exchange data in
non-URL-encoded post bodies. You can read input data in any format using
:php:meth:`~Cake\\Network\\Request::input()`. By providing a decoding function,
you can receive the content in a deserialized format::

    // Get JSON encoded data submitted to a PUT/POST action
    $data = $this->request->input('json_decode');

Some deserializing methods require additional parameters when called, such as
the 'as array' parameter on ``json_decode``. If you want XML converted into a
DOMDocument object, :php:meth:`~Cake\\Network\\Request::input()` supports
passing in additional parameters as well::

    // Get Xml encoded data submitted to a PUT/POST action
    $data = $this->request->input('Cake\Utility\Xml::build', ['return' => 'domdocument']);

Path Information
----------------

The request object also provides useful information about the paths in your
application. ``$request->base`` and ``$request->webroot`` are useful for
generating URLs, and determining whether or not your application is in a
subdirectory. The various properties you can use are::

    // Assume the current request URL is /subdir/articles/edit/1?page=1

    // Holds /subdir/articles/edit/1?page=1
    $request->here;

    // Holds /subdir
    $request->base;

    // Holds /subdir/
    $request->webroot;

.. _check-the-request:

Checking Request Conditions
---------------------------

.. php:method:: is($type, $args...)

The request object provides an easy way to inspect certain conditions in a given
request. By using the ``is()`` method you can check a number of common
conditions, as well as inspect other application specific request criteria::

    $this->request->is('post');

You can also extend the request detectors that are available, by using
:php:meth:`Cake\\Network\\Request::addDetector()` to create new kinds of
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
            return isset($request->awesome);
        }
    );

    // Add a detector that uses additional arguments. As of 3.3.0
    $this->request->addDetector(
        'controller',
        function ($request, $name) {
            return $request->param('controller') === $name;
        }
    );

``Request`` also includes methods like
:php:meth:`Cake\\Network\\Request::domain()`,
:php:meth:`Cake\\Network\\Request::subdomains()` and
:php:meth:`Cake\\Network\\Request::host()` to help applications with subdomains,
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

    $this->request->session()->read('Auth.User.name');

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
    $request->subdomains();

.. php:method:: host()

Returns the host your application is on::

    // Prints 'my.dev.example.org'
    echo $request->host();

Working With HTTP Methods & Headers
-----------------------------------

.. php:method:: method()

Returns the HTTP method the request was made with::

    // Output POST
    echo $request->method();

.. php:method:: allowMethod($methods)

Set allowed HTTP methods. If not matched, will throw MethodNotAllowedException.
The 405 response will include the required ``Allow`` header with the passed methods

.. php:method:: header($name)

Allows you to access any of the ``HTTP_*`` headers that were used
for the request. For example::

    $this->request->header('User-Agent');

would return the user agent used for the request.

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

    // These methods will not use the proxied headers.
    $this->request->port();
    $this->request->host();
    $this->request->scheme();
    $this->request->clientIp();

Checking Accept Headers
-----------------------

.. php:method:: accepts($type = null)

Find out which content types the client accepts, or check whether it accepts a
particular type of content.

Get all types::

    $this->request->accepts();

Check for a single type::

    $this->request->accepts('application/json');

.. php:method:: acceptLanguage($language = null)

Get all the languages accepted by the client,
or check whether a specific language is accepted.

Get the list of accepted languages::

    $this->request->acceptLanguage();

Check whether a specific language is accepted::

    $this->request->acceptLanguage('es-es');

.. index:: $this->response

Response
========

.. php:class:: Response

:php:class:`Cake\\Network\\Response` is the default response class in CakePHP.
It encapsulates a number of features and functionality for generating HTTP
responses in your application. It also assists in testing, as it can be
mocked/stubbed allowing you to inspect headers that will be sent.
Like :php:class:`Cake\\Network\\Request`, :php:class:`Cake\\Network\\Response`
consolidates a number of methods previously found on :php:class:`Controller`,
:php:class:`RequestHandlerComponent` and :php:class:`Dispatcher`. The old
methods are deprecated in favour of using :php:class:`Cake\\Network\\Response`.

``Response`` provides an interface to wrap the common response-related
tasks such as:

* Sending headers for redirects.
* Sending content type headers.
* Sending any header.
* Sending the response body.

Changing the Response Class
---------------------------

CakePHP uses ``Response`` by default. ``Response`` is a flexible and transparent
class. If you need to override it with your own application-specific class, you
can replace ``Response`` in **webroot/index.php**.

This will make all the controllers in your application use ``CustomResponse``
instead of :php:class:`Cake\\Network\\Response`. You can also replace the
response instance by setting ``$this->response`` in your controllers. Overriding
the response object is handy during testing, as it allows you to stub out the
methods that interact with :php:meth:`Cake\\Network\\Response::header()`.

Dealing with Content Types
--------------------------

.. php:method:: type($contentType = null)

You can control the Content-Type of your application's responses with
:php:meth:`Cake\\Network\\Response::type()`. If your application needs to deal
with content types that are not built into Response, you can map them with
``type()`` as well::

    // Add a vCard type
    $this->response->type(['vcf' => 'text/v-card']);

    // Set the response Content-Type to vcard.
    $this->response->type('vcf');

Usually, you'll want to map additional content types in your controller's
:php:meth:`~Controller::beforeFilter()` callback, so you can leverage the
automatic view switching features of :php:class:`RequestHandlerComponent` if you
are using it.

Setting the Character Set
-------------------------

.. php:method:: charset($charset = null)

Sets the charset that will be used in the response::

    $this->response->charset('UTF-8');

.. _cake-response-file:

Sending Files
-------------

.. php:method:: file($path, $options = [])

There are times when you want to send files as responses for your requests.
You can accomplish that by using :php:meth:`Cake\\Network\\Response::file()`::

    public function sendFile($id)
    {
        $file = $this->Attachments->getFile($id);
        $this->response->file($file['path']);
        // Return response object to prevent controller from trying to render
        // a view.
        return $this->response;
    }

As shown in the above example, you must pass the file path to the method.
CakePHP will send a proper content type header if it's a known file type listed
in `Cake\\Network\\Reponse::$_mimeTypes`. You can add new types prior to calling
:php:meth:`Cake\\Network\\Response::file()` by using the
:php:meth:`Cake\\Network\\Response::type()` method.

If you want, you can also force a file to be downloaded instead of displayed in
the browser by specifying the options::

    $this->response->file(
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
        $this->response->body($icsString);
        $this->response->type('ics');

        // Optionally force file download
        $this->response->download('filename_for_download.ics');

        // Return response object to prevent controller from trying to render
        // a view.
        return $this->response;
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

.. php:method:: header($header = null, $value = null)

Setting headers is done with the :php:meth:`Cake\\Network\\Response::header()`
method. It can be called with a few different parameter configurations::

    // Set a single header
    $this->response->header('Location', 'http://example.com');

    // Set multiple headers
    $this->response->header([
        'Location' => 'http://example.com',
        'X-Extra' => 'My header'
    ]);

    $this->response->header([
        'WWW-Authenticate: Negotiate',
        'Content-type: application/pdf'
    ]);

Setting the same :php:meth:`~CakeResponse::header()` multiple times will result
in overwriting the previous values, just as regular header calls. Headers are
not sent when :php:meth:`Cake\\Network\\Response::header()` is called; instead
they are buffered until the response is actually sent.

You can now use the convenience method
:php:meth:`Cake\\Network\\Response::location()` to directly set or get the
redirect location header.

Interacting with Browser Caching
--------------------------------

.. php:method:: disableCache()

You sometimes need to force browsers not to cache the results of a controller
action. :php:meth:`Cake\\Network\\Response::disableCache()` is intended for just
that::

    public function index()
    {
        // Do something.
        $this->response->disableCache();
    }

.. warning::

    Using disableCache() with downloads from SSL domains while trying to send
    files to Internet Explorer can result in errors.

.. php:method:: cache($since, $time = '+1 day')

You can also tell clients that you want them to cache responses. By using
:php:meth:`Cake\\Network\\Response::cache()`::

    public function index()
    {
        // Do something.
        $this->response->cache('-1 minute', '+5 days');
    }

The above would tell clients to cache the resulting response for 5 days,
hopefully speeding up your visitors' experience.
:php:meth:`CakeResponse::cache()` sets the ``Last-Modified`` value to the first
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

Apart from using :php:meth:`Cake\\Network\\Response::cache()`, you can also use
many other methods to fine-tune HTTP cache headers to take advantage of browser
or reverse proxy caching.

The Cache Control Header
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: sharable($public = null, $time = null)

Used under the expiration model, this header contains multiple indicators that
can change the way browsers or proxies use the cached content. A
``Cache-Control`` header can look like this::

    Cache-Control: private, max-age=3600, must-revalidate

``Response`` class helps you set this header with some utility methods that
will produce a final valid ``Cache-Control`` header. The first is the
:php:meth:`Cake\\Network\\Response::sharable()` method, which indicates whether
a response is to be considered sharable across different users or clients. This
method actually controls the ``public`` or ``private`` part of this header.
Setting a response as private indicates that all or part of it is intended for a
single user. To take advantage of shared caches, the control directive must be
set as public.

The second parameter of this method is used to specify a ``max-age`` for the
cache, which is the number of seconds after which the response is no longer
considered fresh::

    public function view()
    {
        // ...
        // Set the Cache-Control as public for 3600 seconds
        $this->response->sharable(true, 3600);
    }

    public function my_data()
    {
        // ...
        // Set the Cache-Control as private for 3600 seconds
        $this->response->sharable(false, 3600);
    }

``Response`` exposes separate methods for setting each of the directives in
the ``Cache-Control`` header.

The Expiration Header
~~~~~~~~~~~~~~~~~~~~~

.. php:method:: expires($time = null)

You can set the ``Expires`` header to a date and time after which the response
is no longer considered fresh. This header can be set using the
:php:meth:`Cake\\Network\\Response::expires()` method::

    public function view()
    {
        $this->response->expires('+5 days');
    }

This method also accepts a :php:class:`DateTime` instance or any string that can
be parsed by the :php:class:`DateTime` class.

The Etag Header
~~~~~~~~~~~~~~~

.. php:method:: etag($tag = null, $weak = false)

Cache validation in HTTP is often used when content is constantly changing, and
asks the application to only generate the response contents if the cache is no
longer fresh. Under this model, the client continues to store pages in the
cache, but it asks the application every time
whether the resource has changed, instead of using it directly.
This is commonly used with static resources such as images and other assets.

The :php:meth:`~CakeResponse::etag()` method (called entity tag) is a string
that uniquely identifies the requested resource, as a checksum does for a file,
in order to determine whether it matches a cached resource.

To take advantage of this header, you must either call the
:php:meth:`Cake\\Network\\Response::checkNotModified()` method manually or
include the :php:class:`RequestHandlerComponent` in your controller::

    public function index()
    {
        $articles = $this->Articles->find('all');
        $this->response->etag($this->Articles->generateHash($articles));
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        // ...
    }

.. note::

    Most proxy users should probably consider using the Last Modified Header
    instead of Etags for performance and compatibility reasons.

The Last Modified Header
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: modified($time = null)

Also, under the HTTP cache validation model, you can set the ``Last-Modified``
header to indicate the date and time at which the resource was modified for the
last time. Setting this header helps CakePHP tell caching clients whether the
response was modified or not based on their cache.

To take advantage of this header, you must either call the
:php:meth:`Cake\\Network\\Response::checkNotModified()` method or include the
:php:class:`RequestHandlerComponent` in your controller::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $this->response->modified($article->modified);
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        // ...
    }

The Vary Header
~~~~~~~~~~~~~~~

.. php:method:: vary($header)

In some cases, you might want to serve different content using the same URL.
This is often the case if you have a multilingual page or respond with different
HTML depending on the browser. Under such circumstances you can use the ``Vary``
header::

    $this->response->vary('User-Agent');
    $this->response->vary('Accept-Encoding', 'User-Agent');
    $this->response->vary('Accept-Language');

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

1. The request has an ``Origin`` header.
2. The request's ``Origin`` value matches one of the allowed Origin values.

.. versionadded:: 3.2
    The ``CorsBuilder`` was added in 3.2

Sending the Response
--------------------

.. php:method:: send()

Once you are done creating a response, calling ``send()`` will send all the set
headers as well as the body. This is done automatically at the end of each
request by ``Dispatcher``.

.. meta::
    :title lang=en: Request and Response objects
    :keywords lang=en: request controller,request parameters,array indexes,purpose index,response objects,domain information,request object,request data,interrogating,params,previous versions,introspection,dispatcher,rout,data structures,arrays,ip address,migration,indexes,cakephp
