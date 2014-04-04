Request and Response Objects
############################

.. php:namespace:: Cake\Network

The request and response objects provide an abstraction around HTTP request and
responses. The request object in CakePHP allows you to easily introspect an
incoming request, while the response object allows you to effortlessly create
HTTP responses from your controllers.

.. index:: $this->request
.. _cake-request:

Request
#######

:php:class:`Cake\\Network\\Request` is the default request object used in CakePHP. It centralizes
a number of features for interrogating and interacting with request data.
On each request one Request is created and then passed by reference to the various
layers of an application that use request data. By default ``Request`` is assigned to
``$this->request``, and is available in Controllers, Views and Helpers. You can
also access it in Components by using the controller reference. Some of the duties
``Request`` performs include:

* Process the GET, POST, and FILES arrays into the data structures you are
  familiar with.
* Provide environment introspection pertaining to the request. Things like the
  headers sent, the client's IP address, and the subdomain/domain information
  about the application the server is running on.
* Provide access to request parameters both as array indexes and object
  properties.

Accessing Request Parameters
============================

Request exposes several interfaces for accessing request parameters. The first is as object
properties, the second is array indexes, and the third is through ``$this->request->params``::

    $this->request->controller;
    $this->request['controller'];
    $this->request->params['controller'];

All of the above will both access the same value. Multiple ways of accessing the
parameters was done to ease migration for existing applications. All
:ref:`route-elements` are accessed through this interface.

In addition to :ref:`route-elements` you also often need access to
:ref:`passed-arguments`. These are available on the request object as well::

    // Passed arguments
    $this->request->pass;
    $this->request['pass'];
    $this->request->params['pass'];

Will all provide you access to the passed arguments. There
are several important/useful parameters that CakePHP uses internally, these
are also all found in the request parameters:

* ``plugin`` The plugin handling the request, will be null for no plugin.
* ``controller`` The controller handling the current request.
* ``action`` The action handling the current request.
* ``prefix`` The prefix for the current action. See :ref:`prefix-routing` for
  more information.
* ``bare`` Present when the request came from :php:meth:`~Controller::requestAction()` and included the
  bare option. Bare requests do not have layouts rendered.
* ``requested`` Present and set to true when the action came from :php:meth:`~Controller::requestAction()`.


Accessing Querystring Parameters
================================

Querystring parameters can be read from using :php:attr:`~Cake\\Network\\Request::$query`::

    // URL is /posts/index?page=1&sort=title
    $this->request->query['page'];

    // You can also access it via array access
    // Note: BC accessor, will be deprecated in future versions
    $this->request['url']['page'];

You can either directly access the query property, or you can use
:php:meth:`~Cake\\Network\\Request::query()` to read the URL query array in an error free manner.
Any keys that do not exist will return ``null``::

    $foo = $this->request->query('value_that_does_not_exist');
    // $foo === null

Accessing POST Data
===================

All POST data can be accessed using :php:meth:`Cake\\Network\\Request::data()`. Any form data
that contains a ``data`` prefix, will have that data prefix removed. For example::

    // An input with a name attribute equal to 'MyModel[title]' is accessible at
    $this->request->data('MyModel.title');

Any keys that do not exist will return ``null``::

    $foo = $this->request->data('Value.that.does.not.exist');
    // $foo == null

Accessing PUT, PATCH or DELETE Data
===================================

When building REST services you often accept request data on ``PUT`` and
``DELETE`` requests. As of 2.2 any ``application/x-www-form-urlencoded``
request body data will automatically be parsed and set to ``$this->data`` for
``PUT`` and ``DELETE`` requests. If you are accepting JSON or XML data, see
below for how you can access those request bodies.

Accessing / Setting Environment Variables (from $_SERVER and $_ENV)
===================================================================

.. versionadded:: 3.0

:php:meth:`Cake\\Network\\Request::env()` is a wrapper for ``env()`` global function and
acts as a getter/setter for enviroment variables without having to modify globals
``$_SERVER`` and ``$_ENV``::

    //Get a value
    $value = $this->request->env('HTTP_HOST');

    //Set a value. Generally helpful in testing.
    $this->request->env('REQUEST_METHOD', 'POST');

Accessing XML or JSON Data
==========================

Applications employing :doc:`/development/rest` often exchange data in non
URL encoded post bodies. You can read input data in any format using
:php:meth:`~Cake\\Network\\Request::input()`. By providing a decoding function you can
receive the content in a deserialized format::

    // Get JSON encoded data submitted to a PUT/POST action
    $data = $this->request->input('json_decode');

Since some deserializing methods require additional parameters when being called,
such as the 'as array' parameter on ``json_decode`` or if you want XML converted
into a DOMDocument object, :php:meth:`~Cake\\Network\\Request::input()` supports passing
in additional parameters as well::

    // Get Xml encoded data submitted to a PUT/POST action
    $data = $this->request->input('Xml::build', array('return' => 'domdocument'));

Accessing Path Information
==========================

The request object also provides useful information about the paths in your
application. :php:attr:`Cake\\Network\\Request::$base` and
:php:attr:`Cake\\Network\\Request::$webroot` are useful for generating URLs, and
determining whether or not your application is in a subdirectory.

.. _check-the-request:

Inspecting the Request
======================

The request object provides an easy way to inspect certain conditions in a given
request. By using the ``is()`` method you can check a number of common
conditions, as well as inspect other application specific request criteria::

    $this->request->is('post');

You can also easily extend the request detectors that are available, by using
:php:meth:`Cake\\Network\\Request::addDetector()` to create new kinds of
detectors. There are four different types of detectors that you can create:

* Environment value comparison - An environment value comparison, compares a
  value fetched from :php:func:`env()` to a known value the environment value is
  equality checked against the provided value.
* Pattern value comparison - Pattern value comparison allows you to compare a
  value fetched from :php:func:`env()` to a regular expression.
* Option based comparison -  Option based comparisons use a list of options to
  create a regular expression. Subsequent calls to add an already defined
  options detector will merge the options.
* Callback detectors - Callback detectors allow you to provide a 'callback' type
  to handle the check. The callback will receive the request object as its only
  parameter.

Some examples would be::

    // Add an environment detector.
    $this->request->addDetector(
        'post',
        array('env' => 'REQUEST_METHOD', 'value' => 'POST')
    );

    // Add a pattern value detector.
    $this->request->addDetector(
        'iphone',
        array('env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i')
    );

    // Add an option detector
    $this->request->addDetector('internalIp', array(
        'env' => 'CLIENT_IP',
        'options' => array('192.168.0.101', '192.168.0.100')
    ));

    // Add a callback detector. Can either be an anonymous function
    // or a regular callable.
    $this->request->addDetector(
        'awesome',
        array('callback' => function ($request) {
            return isset($request->awesome);
        })
    );

``Request`` also includes methods like
:php:meth:`Cake\\Network\\Request::domain()`,
:php:meth:`Cake\\Network\\Request::subdomains()` and
:php:meth:`Cake\\Network\\Request::host()` to help applications with subdomains,
have a slightly easier life.

There are several built-in detectors that you can use:

* ``is('get')`` Check to see if the current request is a GET.
* ``is('put')`` Check to see if the current request is a PUT.
* ``is('post')`` Check to see if the current request is a POST.
* ``is('delete')`` Check to see if the current request is a DELETE.
* ``is('head')`` Check to see if the current request is HEAD.
* ``is('options')`` Check to see if the current request is OPTIONS.
* ``is('ajax')`` Check to see of the current request came with
  X-Requested-with = XmlHttpRequest.
* ``is('ssl')`` Check to see if the request is via SSL
* ``is('flash')`` Check to see if the request has a User-Agent of Flash
* ``is('mobile')`` Check to see if the request came from a common list
  of mobile agents.

Interacting with Other Aspects of the Request
=============================================

You can use `Request` to introspect a variety of things about the request.
Beyond the detectors, you can also find out other information from various
properties and methods.

* ``$this->request->webroot`` contains the webroot directory.
* ``$this->request->base`` contains the base path.
* ``$this->request->here`` contains the full address to the current request
* ``$this->request->query`` contains the query string parameters.


Request API
===========

.. php:class:: Request

    Request encapsulates request parameter handling, and introspection.

.. php:method:: env($key, $value = null)

    Getter / setter for environment variables.

.. php:method:: domain($tldLength = 1)

    Returns the domain name your application is running on.

.. php:method:: subdomains($tldLength = 1)

    Returns the subdomains your application is running on as an array.

.. php:method:: host()

    Returns the host your application is on.

.. php:method:: method()

    Returns the HTTP method the request was made with.

.. php:method:: onlyAllow($methods)

    Set allowed HTTP methods, if not matched will throw MethodNotAllowedException
    The 405 response will include the required ``Allow`` header with the passed methods

.. php:method:: referer($local = false)

    Returns the referring address for the request.

.. php:method:: clientIp($safe = true)

    Returns the current visitor's IP address.

.. php:method:: header($name)

    Allows you to access any of the ``HTTP_*`` headers that were used
    for the request::

        $this->request->header('User-Agent');

    Would return the user agent used for the request.

.. php:method:: input($callback, [$options])

    Retrieve the input data for a request, and optionally pass it through a
    decoding function. Useful when interacting with XML or JSON
    request body content. Additional parameters for the decoding function
    can be passed as arguments to input()::

        $this->request->input('json_decode');

.. php:method:: data($name)

    Provides dot notation access to request data. Allows for reading and
    modification of request data, calls can be chained together as well::

        // Modify some request data, so you can prepopulate some form fields.
        $this->request->data('Post.title', 'New post')
            ->data('Comment.1.author', 'Mark');

        // You can also read out data.
        $value = $this->request->data('Post.title');

.. php:method:: query($name)

    Provides dot notation access to URL query data::

        // URL is /posts/index?page=1&sort=title
        $value = $this->request->query('page');

.. php:method:: is($type)

    Check whether or not a Request matches a certain criteria. Uses
    the built-in detection rules as well as any additional rules defined
    with :php:meth:`Cake\\Network\\Request::addDetector()`.

.. php:method:: addDetector($name, $options)

    Add a detector to be used with :php:meth:`CakeRequest::is()`. See :ref:`check-the-request`
    for more information.

.. php:method:: accepts($type = null)

    Find out which content types the client accepts or check if they accept a
    particular type of content.

    Get all types::

        $this->request->accepts();

    Check for a single type::

        $this->request->accepts('application/json');

.. php:method:: acceptLanguage($language = null)

    Get either all the languages accepted by the client,
    or check if a specific language is accepted.

    Get the list of accepted languages::

        $this->request->acceptLanguage();

    Check if a specific language is accepted::

        $this->request->acceptLanguage('es-es');

.. php:method:: param($name)

    Safely read values in ``$request->params``. This removes the need to call
    ``isset()`` or ``empty()`` before using param values.

.. php:attr:: data

    An array of POST data. You can use :php:meth:`Cake\\Network\\Request::data()`
    to read this property in a way that suppresses notice errors.

.. php:attr:: query

    An array of query string parameters.

.. php:attr:: params

    An array of route elements and request parameters.

.. php:attr:: here

    Returns the current request uri.

.. php:attr:: base

    The base path to the application, usually ``/`` unless your
    application is in a subdirectory.

.. php:attr:: webroot

    The current webroot.

.. index:: $this->response

Response
########

:php:class:`Cake\\Network\\Response` is the default response class in CakePHP. It
encapsulates a number of features and functionality for generating HTTP
responses in your application. It also assists in testing, as it can be
mocked/stubbed allowing you to inspect headers that will be sent.
Like :php:class:`Cake\\Network\\Request`, :php:class:`Cake\\Network\\Response` consolidates a number
of methods previously found on :php:class:`Controller`,
:php:class:`RequestHandlerComponent` and :php:class:`Dispatcher`. The old
methods are deprecated in favour of using :php:class:`Cake\\Network\\Response`.

``Response`` provides an interface to wrap the common response related
tasks such as:

* Sending headers for redirects.
* Sending content type headers.
* Sending any header.
* Sending the response body.

Changing the Response Class
===========================

CakePHP uses ``Response`` by default. ``Response`` is a flexible and
transparent to use class. If you need to replace it with an application
specific class, you can override and replace ``Response`` with
your own class by replacing Response in app/webroot/index.php.

This will make all the controllers in your application use ``CustomResponse``
instead of :php:class:`Cake\\Network\\Response`. You can also replace the response
instance by setting ``$this->response`` in your controllers. Overriding the
response object is handy during testing, as it allows you to stub
out the methods that interact with :php:meth:`~CakeResponse::header()`. See the section on
:ref:`cakeresponse-testing` for more information.

Dealing with Content Types
==========================

You can control the Content-Type of your application's responses with using
:php:meth:`Cake\\Network\\Response::type()`. If your application needs to deal with
content types that are not built into Response, you can map those types
with ``type()`` as well::

    // Add a vCard type
    $this->response->type(array('vcf' => 'text/v-card'));

    // Set the response Content-Type to vcard.
    $this->response->type('vcf');

Usually you'll want to map additional content types in your controller's
:php:meth:`~Controller::beforeFilter()` callback, so you can leverage the automatic view switching
features of :php:class:`RequestHandlerComponent` if you are using it.

.. _cake-response-file:

Sending Files
=============

There are times when you want to send files as responses for your requests.
You can accomplish that by using :php:meth:`Cake\\Network\\Response::file()`::

    public function sendFile($id) {
        $file = $this->Attachment->getFile($id);
        $this->response->file($file['path']);
        // Return response object to prevent controller from trying to render
        // a view
        return $this->response;
    }

As shown in the above example, you have to pass the file path to the method.
CakePHP will send proper content type header if it's a known file type listed in
`Cake\\Network\\Reponse::$_mimeTypes`. You can add new types prior to calling
:php:meth:`Cake\\Network\\Response::file()` by using the
:php:meth:`Cake\\Network\\Response::type()` method.

If you want you can also force a file to be downloaded instead of being displayed in
the browser by specifying the options::

    $this->response->file(
        $file['path'],
        array('download' => true, 'name' => 'foo')
    );

Sending a String as File
========================

You can respond with a file that does not exist on the disk, for instance with
a pdf or an ics generated on the fly, and serve the generated string as a file by using::

    public function sendIcs() {
        $icsString = $this->Calendar->generateIcs();
        $this->response->body($icsString);
        $this->response->type('ics');

        //Optionally force file download
        $this->response->download('filename_for_download.ics');

        // Return response object to prevent controller from trying to render
        // a view
        return $this->response;
    }

Setting Headers
===============

Setting headers is done with the :php:meth:`Cake\\Network\\Response::header()` method. It
can be called with a few different parameter configurations::

    // Set a single header
    $this->response->header('Location', 'http://example.com');

    // Set multiple headers
    $this->response->header(array(
        'Location' => 'http://example.com',
        'X-Extra' => 'My header'
    ));

    $this->response->header(array(
        'WWW-Authenticate: Negotiate',
        'Content-type: application/pdf'
    ));

Setting the same :php:meth:`~CakeResponse::header()` multiple times will result in overwriting the previous
values, just like regular header calls. Headers are not sent when
:php:meth:`Cake\\Network\\Response::header()` is called; instead they are buffered
until the response is actually sent.

You can now use the convenience method :php:meth:`Cake\\Network\\Response::location()` to directly set or get
the redirect location header.

Interacting with Browser Caching
================================

You sometimes need to force browsers not to cache the results of a controller
action. :php:meth:`Cake\\Network\\Response::disableCache()` is intended for just that::

    public function index() {
        // do something.
        $this->response->disableCache();
    }

.. warning::

    Using disableCache() with downloads from SSL domains while trying to send
    files to Internet Explorer can result in errors.

You can also tell clients that you want them to cache responses. By using
:php:meth:`Cake\\Network\\Response::cache()`::

    public function index() {
        //do something
        $this->response->cache('-1 minute', '+5 days');
    }

The above would tell clients to cache the resulting response for 5 days,
hopefully speeding up your visitors' experience. :php:meth:`CakeResponse::cache()` sets the
``Last-Modified`` value to the first argument.
``Expires`` header and the ``max-age`` directive are set based on the second parameter.
Cache-Control's ``public`` directive is set as well.


.. _cake-response-caching:

Fine Tuning HTTP Cache
======================

One of the best and easiest ways of speeding up your application is using HTTP
cache. Under this caching model you are only required to help clients decide if
they should use a cached copy of the response by setting a few headers such as
modified time, response entity tag and others.

Opposed to having to code the logic for caching and for invalidating (refreshing)
it once the data has changed, HTTP uses two models, expiration and validation,
which usually are a lot simpler than having to manage the cache yourself.

Apart from using :php:meth:`Cake\\Network\\Response::cache()` you can also use many other
methods to fine tune HTTP cache headers to take advantage of browser or reverse
proxy caching.

The Cache Control Header
------------------------

Used under the expiration model, this header contains multiple indicators
that can change the way browsers or proxies use the cached content. A
``Cache-Control`` header can look like this::

    Cache-Control: private, max-age=3600, must-revalidate

``Response`` class helps you set this header with some utility methods that
will produce a final valid ``Cache-Control`` header. First of them is :php:meth:`Cake\\Network\\Response::sharable()`
method, which indicates whether a response in to be considered sharable across
different users or clients or users. This method actually controls the ``public``
or ``private`` part of this header. Setting a response as private indicates that
all or part of it is intended for a single user. To take advantage of shared
caches it is needed to set the control directive as public

Second parameter of this method is used to specify a ``max-age`` for the cache,
which is the number of seconds, after which the response is no longer considered
fresh::

    public function view() {
        // ...
        // set the Cache-Control as public for 3600 seconds
        $this->response->sharable(true, 3600);
    }

    public function my_data() {
        // ...
        // set the Cache-Control as private for 3600 seconds
        $this->response->sharable(false, 3600);
    }

``Response`` exposes separate methods for setting each of the directives in
the ``Cache-Control`` header.

The Expiration Header
---------------------

You can set the ``Expires`` header to a date and time after which the response is
no longer considered fresh. This header can be set using the
:php:meth:`Cake\\Network\\Response::expires()` method::

    public function view() {
        $this->response->expires('+5 days');
    }

This method also accepts a :php:class:`DateTime` instance or any string that can be parsed by the
:php:class:`DateTime` class.

The Etag Header
---------------

Cache validation in HTTP is often used when content is constantly changing, and
asks the application to only generate the response contents if the cache is no
longer fresh. Under this model, the client continues to store pages in the
cache, but it asks the application every time
whether the resource has changed, instead of using it directly.
This is commonly used with static resources such as images and other assets.

The :php:meth:`~CakeResponse::etag()` method (called entity tag) is a string that uniquely identifies the
requested resource. It is very much like a checksum of a file; caching
will compare checksums to tell whether they match or not.

To take advantage of this header you have to either call the
:php:meth:`Cake\\Network\\Response::checkNotModified()` method manually or to have the
:php:class:`RequestHandlerComponent` included in your controller::

    public function index() {
        $articles = $this->Article->find('all');
        $this->response->etag($this->Article->generateHash($articles));
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        // ...
    }

The Last Modified Header
------------------------

Also, under the HTTP cache validation model, you can set the ``Last-Modified``
header to indicate the date and time at which the resource was modified for the
last time. Setting this header helps CakePHP to tell caching clients whether
the response was modified or not based on the their cache.

To actually get advantage of using this header you have to either call manually
:php:meth:`Cake\\Network\\Response::checkNotModified()` method or have the
:php:class:`RequestHandlerComponent` included in your controller::

    public function view() {
        $article = $this->Article->find('first');
        $this->response->modified($article['Article']['modified']);
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        // ...
    }

The Vary Header
---------------

In some cases you might want to serve different content using the same URL.
This is often the case if you have a multilingual page or respond with different
HTML depending on the browser. Under such circumstances you can use the ``Vary`` header::

    $this->response->vary('User-Agent');
    $this->response->vary('Accept-Encoding', 'User-Agent');
    $this->response->vary('Accept-Language');

.. _cakeresponse-testing:

Response and Testing
====================

Probably one of the biggest wins from ``Response`` comes from how it makes
testing controllers and components easier. Instead of having methods spread across
several objects, you only have to mock a single object, since controllers and
components delegate to ``Response``. This helps you to get closer to a 'unit'
test and makes testing controllers easier::

    public function testSomething() {
        $this->controller->response = $this->getMock('Cake\Network\Response');
        $this->controller->response->expects($this->once())->method('header');
        // ...
    }

Additionally, you can run tests from the command line more easily, as you can use
mocks to avoid the 'headers sent' errors, which can come up from trying to set
headers in CLI.


Response API
============

.. php:class:: Response

    Response provides a number of useful methods for interacting with
    the response you are sending to a client.

.. php:method:: header($header = null, $value = null)

    Allows you to directly set one or more headers to be sent with the response.

.. php:method:: location($url = null)

    Allows you to directly set the redirect location header to be sent with the response::

        // Set the redirect location
        $this->response->location('http://example.com');

        // Get the current redirect location header
        $location = $this->response->location();

.. php:method:: charset($charset = null)

    Sets the charset that will be used in the response.

.. php:method:: type($contentType = null)

    Sets the content type of the response. You can either use a known content
    type alias or the full content type name.

.. php:method:: cache($since, $time = '+1 day')

    Allows you to set caching headers in the response.

.. php:method:: disableCache()

    Sets the headers to disable client caching for the response.

.. php:method:: sharable($public = null, $time = null)

    Sets the ``Cache-Control`` header to be either ``public`` or ``private`` and
    optionally sets a ``max-age`` directive of the resource

.. php:method:: expires($time = null)

    Allows to set the ``Expires`` header to a specific date.

.. php:method:: etag($tag = null, $weak = false)

    Sets the ``Etag`` header to uniquely identify a response resource.

.. php:method:: modified($time = null)

    Sets the ``Last-Modified`` header to a specific date and time in the correct
    format.

.. php:method:: checkNotModified(Request $request)

    Compares the cache headers for the request object with the cache header from
    the response and determines if it can still be considered fresh. If so,
    deletes the response content, and sends the `304 Not Modified` header.

.. php:method:: compress()

    Turns on gzip compression for the request.

.. php:method:: download($filename)

    Allows you to send a response as an attachment, and to set its filename.

.. php:method:: statusCode($code = null)

    Allows you to set the status code of the response.

.. php:method:: body($content = null)

    Set the content body of the response.

.. php:method:: send()

    Once you are done creating a response, calling :php:meth:`~CakeResponse::send()` will send all
    the set headers as well as the body. This is done automatically at the
    end of each request by :php:class:`Dispatcher`

.. php:method:: file($path, $options = array())

    Allows you to set the ``Content-Disposition`` header of a file either to display or to download.

    ``name``
        The name allows you to specify an alternate file name to be sent to
        the user.

    ``download``
        A boolean value indicating whether headers should be set to force
        download.

.. meta::
    :title lang=en: Request and Response objects
    :keywords lang=en: request controller,request parameters,array indexes,purpose index,response objects,domain information,request object,request data,interrogating,params,previous versions,introspection,dispatcher,rout,data structures,arrays,ip address,migration,indexes,cakephp
