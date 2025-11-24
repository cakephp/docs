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
reference.

.. versionchanged:: 4.4.0
    The ``ServerRequest`` is available via DI.
    So you can get it from container or use it as a dependency for your service.

Some of the duties ``ServerRequest`` performs include:

* Processing the GET, POST, and FILES arrays into the data structures you are
  familiar with.
* Providing environment introspection pertaining to the request. Information
  like the headers sent, the client's IP address, and the subdomain/domain
  names the server your application is running on.
* Providing access to request parameters both as array indexes and object
  properties.

CakePHP's request object implements the `PSR-7
ServerRequestInterface <https://www.php-fig.org/psr/psr-7/>`_ making it easier to
use libraries from outside of CakePHP.

.. _request-parameters:

Request Parameters
------------------

The request exposes routing parameters through the ``getParam()`` method::

    $controllerName = $this->request->getParam('controller');

To get all routing parameters as an array use ``getAttribute()``::

    $parameters = $this->request->getAttribute('params');

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

.. php:method:: getQuery($name, $default = null)

Query string parameters can be read using the ``getQuery()`` method::

    // URL is /posts/index?page=1&sort=title
    $page = $this->request->getQuery('page');

You can either directly access the query property, or you can use
``getQuery()`` method to read the URL query array in an error-free manner.
Any keys that do not exist will return ``null``::

    $foo = $this->request->getQuery('value_that_does_not_exist');
    // $foo === null

    // You can also provide default values
    $foo = $this->request->getQuery('does_not_exist', 'default val');

If you want to access all the query parameters you can use
``getQueryParams()``::

    $query = $this->request->getQueryParams();

You can use the casting utility functions to provide typesafe access to request
data and other input::

    use function Cake\Core\toBool;
    use function Cake\Core\toInt;
    use function Cake\Core\toString;
    use function Cake\I18n\toDate;
    use function Cake\I18n\toDateTime;

    // $active is bool|null.
    $active = toBool($this->request->getQuery('active'));

    // $page is int|null.
    $page = toInt($this->request->getQuery('page'));

    // $query is string|null.
    $query = toString($this->request->getQuery('query'));

    // Parse a date based on the format or null
    $date = toDate($this->request->getQuery('date'), 'Y-m-d');

    // Parse a datetime based on a format or null
    $date = toDateTime($this->request->getQuery('datetime'), 'Y-m-d H:i:s');

.. versionadded:: 5.1.0
    Casting functions were added.

Request Body Data
-----------------

.. php:method:: getData($name, $default = null)

All POST data normally available through PHP's ``$_POST`` global variable can be
accessed using :php:meth:`Cake\\Http\\ServerRequest::getData()`. For example::

    // An input with a name attribute equal to 'title' is accessible at
    $title = $this->request->getData('title');

You can use a dot separated names to access nested data. For example::

    $value = $this->request->getData('address.street_name');

For non-existent names the ``$default`` value will be returned::

    $foo = $this->request->getData('value.that.does.not.exist');
    // $foo == null

You can also use :ref:`body-parser-middleware` to parse request body of different
content types into an array, so that it's accessible through ``ServerRequest::getData()``.

If you want to access all the data parameters you can use
``getParsedBody()``::

    $data = $this->request->getParsedBody();

.. _request-file-uploads:

File Uploads
------------

Uploaded files can be accessed through the request body data, using the :php:meth:`Cake\\Http\\ServerRequest::getData()`
method described above. For example, a file from an input element with a name attribute of ``attachment``, can
be accessed like this::

    $attachment = $this->request->getData('attachment');

By default file uploads are represented in the request data as objects that implement
`\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7/#16-uploaded-files>`__. In the current
implementation, the ``$attachment`` variable in the above example would by default hold an instance of
``\Laminas\Diactoros\UploadedFile``.

Accessing the uploaded file details is fairly simple, here's how you can obtain the same data as provided by the old
style file upload array::

    $name = $attachment->getClientFilename();
    $type = $attachment->getClientMediaType();
    $size = $attachment->getSize();
    $tmpName = $attachment->getStream()->getMetadata('uri');
    $error = $attachment->getError();

Moving the uploaded file from its temporary location to the desired target
location, doesn't require manually accessing the temporary file, instead it can
be easily done by using the objects ``moveTo()`` method::

    $attachment->moveTo($targetPath);

In an HTTP environment, the ``moveTo()`` method will automatically validate
whether the file is an actual uploaded file, and throw an exception in case
necessary. In an CLI environment, where the concept of uploading files doesn't
exist, it will allow to move the file that you've referenced irrespective of its
origins, which makes testing file uploads possible.

.. php:method:: getUploadedFile($path)

Returns the uploaded file at a specific path. The path uses the same dot syntax as the
:php:meth:`Cake\\Http\\ServerRequest::getData()` method::

    $attachment = $this->request->getUploadedFile('attachment');

Unlike :php:meth:`Cake\\Http\\ServerRequest::getData()`, :php:meth:`Cake\\Http\\ServerRequest::getUploadedFile()` would
only return data when an actual file upload exists for the given path, if there is regular, non-file request body data
present at the given path, then this method will return ``null``, just like it would for any non-existent path.

.. php:method:: getUploadedFiles()

Returns all uploaded files in a normalized array structure. For the above example with the file input name of
``attachment``, the structure would look like::

    [
          'attachment' => object(Laminas\Diactoros\UploadedFile) {
              // ...
          }
    ]

.. php:method:: withUploadedFiles(array $files)

This method sets the uploaded files of the request object, it accepts an array of objects that implement
`\\Psr\\Http\\Message\\UploadedFileInterface <https://www.php-fig.org/psr/psr-7/#16-uploaded-files>`__. It will
replace all possibly existing uploaded files::

    $files = [
        'MyModel' => [
            'attachment' => new \Laminas\Diactoros\UploadedFile(
                $streamOrFile,
                $size,
                $errorStatus,
                $clientFilename,
                $clientMediaType
            ),
            'anotherAttachment' => new \Laminas\Diactoros\UploadedFile(
                '/tmp/hfz6dbn.tmp',
                123,
                \UPLOAD_ERR_OK,
                'attachment.txt',
                'text/plain'
            ),
        ],
    ];

    $this->request = $this->request->withUploadedFiles($files);

.. note::

    Uploaded files that have been added to the request via this method, will *not* be available in the request body
    data, ie you cannot retrieve them via :php:meth:`Cake\\Http\\ServerRequest::getData()`! If you need them in the
    request data (too), then you have to set them via :php:meth:`Cake\\Http\\ServerRequest::withData()` or
    :php:meth:`Cake\\Http\\ServerRequest::withParsedBody()`.

PUT, PATCH or DELETE Data
-------------------------

.. php:method:: getBody()

When building REST services, you often accept request data on ``PUT`` and
``DELETE`` requests. Any ``application/x-www-form-urlencoded`` request body data
will automatically be parsed and available via ``$request->getData()`` for ``PUT`` and
``DELETE`` requests. If you are accepting JSON or XML data, you can
access the raw data with ``getBody()``::

    // Get the stream wrapper on the request body
    $body = $request->getBody();

    // Get the request body as a string
    $bodyString = (string)$request->getBody();

If your requests contain XML or JSON request content, you should consider using
:ref:`body-parser-middleware` to have CakePHP automatically parse those content
types making the parsed data available in ``$request->getData()`` and
``$request->getParsedBody()``.

Environment Variables (from $_SERVER and $_ENV)
-----------------------------------------------

.. php:method:: getEnv($key, $default = null)

``ServerRequest::getEnv()`` is a wrapper for ``getenv()`` global function and acts as
a getter for environment variables without possible undefined keys::

    $host = $this->request->getEnv('HTTP_HOST');

To access all the environment variables in a request use ``getServerParams()``::

    $env = $this->request->getServerParams();

.. php:method:: withEnv($key, $value)

``ServerRequest::withEnv()`` is a wrapper for ``putenv()`` global function and acts as
a setter for environment variables without having to modify globals
``$_SERVER`` and ``$_ENV``::

    // Set a value, generally helpful in testing.
    $this->request->withEnv('REQUEST_METHOD', 'POST');

XML or JSON Data
----------------

Applications employing :doc:`/development/rest` often exchange data in
non-URL-encoded post bodies. You can read input data in any format using
:php:meth:`~Cake\\Http\\ServerRequest::input()`. By providing a decoding function,
you can receive the content in a deserialized format::

    // Get JSON encoded data submitted to a PUT/POST action
    $jsonData = $this->request->input('json_decode');

Some deserializing methods require additional parameters when called, such as
the 'as array' parameter on ``json_decode``. If you want XML converted into a
DOMDocument object, :php:meth:`~Cake\\Http\\ServerRequest::input()` supports
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
    $here = $request->getRequestTarget();

    // Holds /subdir
    $base = $request->getAttribute('base');

    // Holds /subdir/
    $base = $request->getAttribute('webroot');

.. _check-the-request:

Checking Request Conditions
---------------------------

.. php:method:: is($type, $args...)

The request object provides a way to inspect certain conditions in a given
request. By using the ``is()`` method you can check a number of common
conditions, as well as inspect other application specific request criteria::

    $isPost = $this->request->is('post');

You can also extend the request detectors that are available, by using
:php:meth:`Cake\\Http\\ServerRequest::addDetector()` to create new kinds of
detectors. There are different types of detectors that you can create:

* Environment value comparison - Compares a value fetched from :php:func:`env()`
  for equality with the provided value.
* Header value comparison - If the specified header exists with the specified
  value, or if the callable returns true.
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


    // Add a header detector with value comparison
    $this->request->addDetector('fancy', [
        'env' => 'CLIENT_IP',
        'header' => ['X-Fancy' => 1]
    ]);

    // Add a header detector with callable comparison
    $this->request->addDetector('fancy', [
        'env' => 'CLIENT_IP',
        'header' => ['X-Fancy' => function ($value, $header) {
            return in_array($value, ['1', '0', 'yes', 'no'], true);
        }]
    ]);

    // Add a callback detector. Must be a valid callable.
    $this->request->addDetector(
        'awesome',
        function ($request) {
            return $request->getParam('awesome');
        }
    );

    // Add a detector that uses additional arguments.
    $this->request->addDetector(
        'csv',
        [
            'accept' => ['text/csv'],
            'param' => '_ext',
            'value' => 'csv',
        ]
    );

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
* ``is('json')`` Check to see whether the request URL has 'json' extension or the
  `Accept` header is set to 'application/json'.
* ``is('xml')`` Check to see whether the request URL has 'xml' extension or the `Accept` header is set to
  'application/xml' or 'text/xml'.

``ServerRequest`` also includes methods like
:php:meth:`Cake\\Http\\ServerRequest::domain()`,
:php:meth:`Cake\\Http\\ServerRequest::subdomains()` and
:php:meth:`Cake\\Http\\ServerRequest::host()` to make applications that use
subdomains simpler.

Session Data
------------

To access the session for a given request use the ``getSession()`` method or use the ``session`` attribute::

    $session = $this->request->getSession();
    $session = $this->request->getAttribute('session');

    $data = $session->read('sessionKey');

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

While some apache installs don't make the ``Authorization`` header accessible,
CakePHP will make it available through apache specific methods as required.

.. php:method:: referer($local = true)

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

Once proxies are trusted the ``clientIp()`` method will use the *last* IP
address in the ``X-Forwarded-For`` header. If your application is behind
multiple proxies, you can use ``setTrustedProxies()`` to define the IP addresses
of proxies in your control::

    $request->setTrustedProxies(['127.1.1.1', '127.8.1.3']);

After proxies are trusted ``clientIp()`` will use the first IP address in the
``X-Forwarded-For`` header providing it is the only value that isn't from a trusted
proxy.

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

.. _request-cookies:

Reading Cookies
---------------

Request cookies can be read through a number of methods::

    // Get the cookie value, or null if the cookie is missing.
    $rememberMe = $this->request->getCookie('remember_me');

    // Read the value, or get the default of 0
    $rememberMe = $this->request->getCookie('remember_me', 0);

    // Get all cookies as an hash
    $cookies = $this->request->getCookieParams();

    // Get a CookieCollection instance
    $cookies = $this->request->getCookieCollection()

See the :php:class:`Cake\\Http\\Cookie\\CookieCollection` documentation for how
to work with cookie collection.


Uploaded Files
--------------

Requests expose the uploaded file data in ``getData()`` or
``getUploadedFiles()`` as ``UploadedFileInterface`` objects::

    // Get a list of UploadedFile objects
    $files = $request->getUploadedFiles();

    // Read the file data.
    $files[0]->getStream();
    $files[0]->getSize();
    $files[0]->getClientFileName();

    // Move the file.
    $files[0]->moveTo($targetPath);

Manipulating URIs
-----------------

Requests contain a URI object, which contains methods for interacting with the
requested URI::

    // Get the URI
    $uri = $request->getUri();

    // Read data out of the URI.
    $path = $uri->getPath();
    $query = $uri->getQuery();
    $host = $uri->getHost();


.. index:: $this->response

Response
========

.. php:class:: Response

:php:class:`Cake\\Http\\Response` is the default response class in CakePHP.
It encapsulates a number of features and functionality for generating HTTP
responses in your application. It also assists in testing, as it can be
mocked/stubbed allowing you to inspect headers that will be sent.

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
``setTypeMap()`` as well::

    // Add a vCard type
    $this->response->setTypeMap('vcf', ['text/v-card']);

    // Set the response Content-Type to vcard.
    $this->response = $this->response->withType('vcf');

Usually, you'll want to map additional content types in your controller's
:php:meth:`~Controller::beforeFilter()` callback, so you can benefit from
automatic view switching provided by :ref:`controller-viewclasses`.

.. _cake-response-file:

Sending Files
-------------

.. php:method:: withFile(string $path, array $options = [])

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
in `Cake\\Http\\Response::$_mimeTypes`. You can add new types prior to calling
:php:meth:`Cake\\Http\\Response::withFile()` by using the
:php:meth:`Cake\\Http\\Response::withType()` method.

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

        // Inject string content into response body
        $response = $response->withStringBody($icsString);

        $response = $response->withType('ics');

        // Optionally force file download
        $response = $response->withDownload('filename_for_download.ics');

        // Return response object to prevent controller from trying to render
        // a view.
        return $response;
    }

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

Headers are not sent when set. Instead, they are held until the response is
emitted by ``Cake\Http\Server``.

You can now use the convenience method
:php:meth:`Cake\\Http\\Response::withLocation()` to directly set or get the
redirect location header.

Setting the Body
----------------

.. php:method:: withStringBody($string)

To set a string as the response body, do the following::

    // Set a string into the body
    $response = $response->withStringBody('My Body');

    // If you want a json response
    $response = $response->withType('application/json')
        ->withStringBody(json_encode(['Foo' => 'bar']));

.. php:method:: withBody($body)

To set the response body, use the ``withBody()`` method, which is provided by the
:php:class:`Laminas\\Diactoros\\MessageTrait`::

    $response = $response->withBody($stream);

Be sure that ``$stream`` is a :php:class:`Psr\\Http\\Message\\StreamInterface` object.
See below on how to create a new stream.

You can also stream responses from files using :php:class:`Laminas\\Diactoros\\Stream` streams::

    // To stream from a file
    use Laminas\Diactoros\Stream;

    $stream = new Stream('/path/to/file', 'rb');
    $response = $response->withBody($stream);

You can also stream responses from a callback using the ``CallbackStream``. This
is useful when you have resources like images, CSV files or PDFs you need to
stream to the client::

    // Streaming from a callback
    use Cake\Http\CallbackStream;

    // Create an image.
    $img = imagecreate(100, 100);
    // ...

    $stream = new CallbackStream(function () use ($img) {
        imagepng($img);
    });
    $response = $response->withBody($stream);

Setting the Character Set
-------------------------

.. php:method:: withCharset($charset)

Sets the charset that will be used in the response::

    $this->response = $this->response->withCharset('UTF-8');

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
``isNotModified()`` method manually or include the
:doc:`/controllers/components/check-http-cache` in your controller::

    public function index()
    {
        $articles = $this->Articles->find('all')->all();

        // Simple checksum of the article contents.
        // You should use a more efficient implementation
        // in a real world application.
        $checksum = md5(json_encode($articles));

        $response = $this->response->withEtag($checksum);
        if ($response->isNotModified($this->request)) {
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
``isNotModified()`` method manually or include the
:doc:`/controllers/components/check-http-cache` in your controller::

    public function view()
    {
        $article = $this->Articles->find()->first();
        $response = $this->response->withModified($article->modified);
        if ($response->isNotModified($this->request)) {
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

.. php:method:: isNotModified(Request $request)

Compares the cache headers for the request object with the cache header from the
response and determines whether it can still be considered fresh. If so, deletes
the response content, and sends the `304 Not Modified` header::

    // In a controller action.
    if ($this->response->isNotModified($this->request)) {
        return $this->response;
    }

.. _response-cookies:

Setting Cookies
---------------

Cookies can be added to response using either an array or a :php:class:`Cake\\Http\\Cookie\\Cookie`
object::

    use Cake\Http\Cookie\Cookie;
    use DateTime;

    // Add a cookie
    $this->response = $this->response->withCookie(Cookie::create(
        'remember_me',
        'yes',
        // All keys are optional
        [
            'expires' => new DateTime('+1 year'),
            'path' => '',
            'domain' => '',
            'secure' => false,
            'httponly' => false,
            'samesite' => null // Or one of CookieInterface::SAMESITE_* constants
        ]
    ));

See the :ref:`creating-cookies` section for how to use the cookie object. You
can use ``withExpiredCookie()`` to send an expired cookie in the response. This
will make the browser remove its local cookie::

    $this->response = $this->response->withExpiredCookie(new Cookie('remember_me'));

.. _cors-headers:

Setting Cross Origin Request Headers (CORS)
-------------------------------------------

The ``cors()`` method returns a ``CorsBuilder`` instance which provides a fluent
interface for defining `HTTP Access Control
<https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS>`__
related headers::

    $this->response = $this->response->cors($this->request)
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

CorsBuilder Methods
~~~~~~~~~~~~~~~~~~~

.. php:class:: CorsBuilder

The ``CorsBuilder`` provides the following methods for configuring CORS:

.. php:method:: allowOrigin(array|string $domains)

    Set the list of allowed domains. You can use wildcards ``*.example.com`` to
    accept subdomains, or ``*`` to allow all domains::

        // Allow a specific domain
        ->allowOrigin('https://example.com')

        // Allow multiple domains
        ->allowOrigin(['https://example.com', 'https://app.example.com'])

        // Allow all subdomains
        ->allowOrigin(['*.example.com'])

        // Allow all origins (use with caution!)
        ->allowOrigin('*')

.. php:method:: allowMethods(array $methods)

    Set the list of allowed HTTP methods::

        ->allowMethods(['GET', 'POST', 'PUT', 'DELETE'])

.. php:method:: allowHeaders(array $headers)

    Define which headers can be sent in CORS requests::

        ->allowHeaders(['X-CSRF-Token', 'Content-Type', 'Authorization'])

.. php:method:: allowCredentials()

    Enable cookies to be sent in CORS requests. This sets the
    ``Access-Control-Allow-Credentials`` header to ``true``::

        ->allowCredentials()

.. php:method:: exposeHeaders(array $headers)

    Define which headers the client library/browser can expose to scripting::

        ->exposeHeaders(['X-Total-Count', 'Link'])

.. php:method:: maxAge(string|int $age)

    Define how long preflight OPTIONS requests are valid for (in seconds)::

        ->maxAge(3600) // Cache preflight for 1 hour

.. php:method:: build()

    Apply the configured headers to the response and return it. This must be
    called to actually apply the CORS headers::

        $response = $corsBuilder->build();

Practical CORS Examples
~~~~~~~~~~~~~~~~~~~~~~~

Here are some common CORS configurations:

**API accepting requests from a SPA frontend**::

    // In your controller
    public function beforeFilter(EventInterface $event)
    {
        parent::beforeFilter($event);

        if ($this->request->is('options')) {
            // Handle preflight requests
            $this->response = $this->response->cors($this->request)
                ->allowOrigin(['https://app.example.com'])
                ->allowMethods(['GET', 'POST', 'PUT', 'DELETE'])
                ->allowHeaders(['Content-Type', 'Authorization'])
                ->allowCredentials()
                ->maxAge(86400)
                ->build();
            
            return $this->response;
        }
    }

    public function index()
    {
        // Apply CORS to regular requests
        $this->response = $this->response->cors($this->request)
            ->allowOrigin(['https://app.example.com'])
            ->allowCredentials()
            ->build();

        // Your regular controller logic...
    }

**Public API with relaxed CORS**::

    $this->response = $this->response->cors($this->request)
        ->allowOrigin('*')
        ->allowMethods(['GET'])
        ->exposeHeaders(['X-Total-Count', 'X-Page'])
        ->maxAge(3600)
        ->build();

Creating CORS Middleware
~~~~~~~~~~~~~~~~~~~~~~~~

For consistent CORS handling across your application, create a middleware::

    // src/Middleware/CorsMiddleware.php
    namespace App\Middleware;

    use Psr\Http\Message\ResponseInterface;
    use Psr\Http\Message\ServerRequestInterface;
    use Psr\Http\Server\MiddlewareInterface;
    use Psr\Http\Server\RequestHandlerInterface;

    class CorsMiddleware implements MiddlewareInterface
    {
        public function process(
            ServerRequestInterface $request,
            RequestHandlerInterface $handler
        ): ResponseInterface {
            // Handle preflight requests
            if ($request->getMethod() === 'OPTIONS') {
                $response = new \Cake\Http\Response();
                $response = $response->cors($request)
                    ->allowOrigin(['*.myapp.com'])
                    ->allowMethods(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
                    ->allowHeaders(['Content-Type', 'Authorization'])
                    ->allowCredentials()
                    ->maxAge(3600)
                    ->build();
                
                return $response;
            }

            $response = $handler->handle($request);

            // Add CORS headers to regular requests
            return $response->cors($request)
                ->allowOrigin(['*.myapp.com'])
                ->allowCredentials()
                ->build();
        }
    }

Then add it to your application middleware stack in ``src/Application.php``::

    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $middlewareQueue
            // Add CORS middleware early in the stack
            ->add(new \App\Middleware\CorsMiddleware())
            // ... other middleware
            ->add(new ErrorHandlerMiddleware(Configure::read('Error')))
            ->add(new AssetMiddleware([
                'cacheTime' => Configure::read('Asset.cacheTime'),
            ]))
            ->add(new RoutingMiddleware($this));

        return $middlewareQueue;
    }

Running logic after the Response has been sent
----------------------------------------------

In fastcgi based environments you can listen to the ``Server.terminate`` event
to run logic **after** the response has been sent to the client. The
``terminate`` event will be passed a ``request`` and ``response``. The
``request`` is fetched from the applications' DI container, or from
``Router::getRequest()`` if the DI container does not have a request registered.

.. warning::
   In non fastcgi environments the ``Server.terminate`` event is fired before
   the response is sent.

.. versionadded:: 5.1.0

Common Mistakes with Immutable Responses
========================================

Response objects offer a number of methods that treat
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

.. php:namespace:: Cake\Http\Cookie

Cookie Collections
==================

.. php:class:: CookieCollection

``CookieCollection`` objects are accessible from the request and response objects.
They let you interact with groups of cookies using immutable patterns, which
allow the immutability of the request and response to be preserved.

.. _creating-cookies:

Creating Cookies
----------------

.. php:class:: Cookie

``Cookie`` objects can be defined through constructor objects, or by using the
fluent interface that follows immutable patterns::

    use Cake\Http\Cookie\Cookie;

    // All arguments in the constructor
    $cookie = new Cookie(
        'remember_me', // name
        1, // value
        new DateTime('+1 year'), // expiration time, if applicable
        '/', // path, if applicable
        'example.com', // domain, if applicable
        false, // secure only?
        true // http only ?
    );

    // Using the builder methods
    $cookie = (new Cookie('remember_me'))
        ->withValue('1')
        ->withExpiry(new DateTime('+1 year'))
        ->withPath('/')
        ->withDomain('example.com')
        ->withSecure(false)
        ->withHttpOnly(true);

Once you have created a cookie, you can add it to a new or existing
``CookieCollection``::

    use Cake\Http\Cookie\CookieCollection;

    // Create a new collection
    $cookies = new CookieCollection([$cookie]);

    // Add to an existing collection
    $cookies = $cookies->add($cookie);

    // Remove a cookie by name
    $cookies = $cookies->remove('remember_me');

.. note::
    Remember that collections are immutable and adding cookies into, or removing
    cookies from a collection, creates a *new* collection object.

Cookie objects can be added to responses::

    // Add one cookie
    $response = $this->response->withCookie($cookie);

    // Replace the entire cookie collection
    $response = $this->response->withCookieCollection($cookies);

Cookies set to responses can be encrypted using the
:ref:`encrypted-cookie-middleware`.

Reading Cookies
---------------

Once you have a ``CookieCollection`` instance, you can access the cookies it
contains::

    // Check if a cookie exists
    $cookies->has('remember_me');

    // Get the number of cookies in the collection
    count($cookies);

    // Get a cookie instance. Will throw an error if the cookie is not found
    $cookie = $cookies->get('remember_me');

    // Get a cookie or null
    $cookie = $cookies->remember_me;

    // Check if a cookie exists
    $exists = isset($cookies->remember_me)

Once you have a ``Cookie`` object you can interact with it's state and modify
it. Keep in mind that cookies are immutable, so you'll need to update the
collection if you modify a cookie::

    // Get the value
    $value = $cookie->getValue()

    // Access data inside a JSON value
    $id = $cookie->read('User.id');

    // Check state
    $cookie->isHttpOnly();
    $cookie->isSecure();

.. meta::
    :title lang=en: Request and Response objects
    :keywords lang=en: request controller,request parameters,array indexes,purpose index,response objects,domain information,request object,request data,interrogating,params,parameters,previous versions,introspection,dispatcher,rout,data structures,arrays,ip address,migration,indexes,cakephp,PSR-7,immutable
