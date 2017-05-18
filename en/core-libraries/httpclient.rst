Http Client
###########

.. php:namespace:: Cake\Http

.. php:class:: Client(mixed $config = [])

CakePHP includes a basic but powerful HTTP client which can be used for
making requests. It is a great way to communicate with webservices, and
remote APIs.

.. versionchanged:: 3.3.0
    Prior to 3.3.0 you should use ``Cake\Network\Http\Client``.

Doing Requests
==============

Doing requests is simple and straight forward.  Doing a GET request looks like::

    use Cake\Network\Http\Client;

    $http = new Client();

    // Simple get
    $response = $http->get('http://example.com/test.html');

    // Simple get with querystring
    $response = $http->get('http://example.com/search', ['q' => 'widget']);

    // Simple get with querystring & additional headers
    $response = $http->get('http://example.com/search', ['q' => 'widget'], [
      'headers' => ['X-Requested-With' => 'XMLHttpRequest']
    ]);

Doing POST and PUT requests is equally simple::

    // Send a POST request with application/x-www-form-urlencoded encoded data
    $http = new Client();
    $response = $http->post('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post'
    ]);

    // Send a PUT request with application/x-www-form-urlencoded encoded data
    $response = $http->put('http://example.com/posts/add', [
      'title' => 'testing',
      'body' => 'content in the post'
    ]);

    // Other methods as well.
    $http->delete(...);
    $http->head(...);
    $http->patch(...);

Creating Multipart Requests with Files
======================================

You can include files in request bodies by including a filehandle in the array::

    $http = new Client();
    $response = $http->post('http://example.com/api', [
      'image' => fopen('/path/to/a/file', 'r'),
    ]);

The filehandle will be read until its end; it will not be rewound before being read.

.. warning::

    For compatibility reasons, strings beginning with ``@`` will be evaluated
    as local or remote file paths.

This functionality is deprecated as of CakePHP 3.0.5
and will be removed in a future version. Until that happens, user data being passed
to the Http Client must be sanitized as follows::

    $response = $http->post('http://example.com/api', [
        'search' => ltrim($this->request->getData('search'), '@'),
    ]);

If it is necessary to preserve leading ``@`` characters in query strings, you can pass
a pre-encoded query string from ``http_build_query()``::

    $response = $http->post('http://example.com/api', http_build_query([
        'search' => $this->request->getData('search'),
    ]));

Building Multipart Request Bodies by Hand
-----------------------------------------

There may be times when you need to build a request body in a very specific way.
In these situations you can often use ``Cake\Network\Http\FormData`` to craft
the specific multipart HTTP request you want::

    use Cake\Network\Http\FormData;

    $data = new FormData();

    // Create an XML part
    $xml = $data->newPart('xml', $xmlString);
    // Set the content type.
    $xml->type('application/xml');
    $data->add($xml);

    // Create a file upload with addFile()
    // This will append the file to the form data as well.
    $file = $data->addFile('upload', fopen('/some/file.txt', 'r'));
    $file->contentId('abc123');
    $file->disposition('attachment');

    // Send the request.
    $response = $http->post(
        'http://example.com/api',
        (string)$data,
        ['headers' => ['Content-Type' => $data->contentType()]]
    );

Sending Request Bodies
======================

When dealing with REST API's you often need to send request bodies that are not
form encoded. Http\\Client exposes this through the type option::

    // Send a JSON request body.
    $http = new Client();
    $response = $http->post(
      'http://example.com/tasks',
      json_encode($data),
      ['type' => 'json']
    );

The ``type`` key can either be a one of 'json', 'xml' or a full mime type.
When using the ``type`` option, you should provide the data as a string. If you're
doing a GET request that needs both querystring parameters and a request body
you can do the following::

    // Send a JSON body in a GET request with query string parameters.
    $http = new Client();
    $response = $http->get(
      'http://example.com/tasks',
      ['q' => 'test', '_content' => json_encode($data)],
      ['type' => 'json']
    );

.. _http_client_request_options:

Request Method Options
======================

Each HTTP method takes an ``$options`` parameter which is used to provide
addition request information.  The following keys can be used in ``$options``:

- ``headers`` - Array of additional headers
- ``cookie`` - Array of cookies to use.
- ``proxy`` - Array of proxy information.
- ``auth`` - Array of authentication data, the ``type`` key is used to delegate to
  an authentication strategy. By default Basic auth is used.
- ``ssl_verify_peer`` - defaults to ``true``. Set to ``false`` to disable SSL certification
  verification (not recommended).
- ``ssl_verify_peer_name`` - defaults to ``true``. Set to ``false`` to disable
  host name verification when verifying SSL certificates (not recommended).
- ``ssl_verify_depth`` - defaults to 5. Depth to traverse in the CA chain.
- ``ssl_verify_host`` - defaults to ``true``. Validate the SSL certificate against the host name.
- ``ssl_cafile`` - defaults to built in cafile. Overwrite to use custom CA bundles.
- ``timeout`` - Duration to wait before timing out in seconds.
- ``type`` - Send a request body in a custom content type. Requires ``$data`` to
  either be a string, or the ``_content`` option to be set when doing GET
  requests.
- ``redirect`` - Number of redirects to follow. Defaults to ``false``.

The options parameter is always the 3rd parameter in each of the HTTP methods.
They can also be used when constructing ``Client`` to create
:ref:`scoped clients <http_client_scoped_client>`.

Authentication
==============

``Cake\Http\Client`` supports a few different authentication systems.  Different
authentication strategies can be added by developers. Auth strategies are called
before the request is sent, and allow headers to be added to the request
context.

Using Basic Authentication
--------------------------

An example of basic authentication::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => ['username' => 'mark', 'password' => 'secret']
    ]);

By default ``Cake\Http\Client`` will use basic authentication if there is no
``'type'`` key in the auth option.


Using Digest Authentication
---------------------------

An example of basic authentication::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => [
        'type' => 'digest',
        'username' => 'mark',
        'password' => 'secret',
        'realm' => 'myrealm',
        'nonce' => 'onetimevalue',
        'qop' => 1,
        'opaque' => 'someval'
      ]
    ]);

By setting the 'type' key to 'digest', you tell the authentication subsystem to
use digest authentication.

OAuth 1 Authentication
----------------------

Many modern web-services require OAuth authentication to access their API's.
The included OAuth authentication assumes that you already have your consumer
key and consumer secret::

    $http = new Client();
    $response = $http->get('http://example.com/profile/1', [], [
      'auth' => [
        'type' => 'oauth',
        'consumerKey' => 'bigkey',
        'consumerSecret' => 'secret',
        'token' => '...',
        'tokenSecret' => '...',
        'realm' => 'tickets',
      ]
    ]);

OAuth 2 Authentication
----------------------

Because OAuth2 is often a single header, there is not a specialized
authentication adapter. Instead you can create a client with the access token::

    $http = new Client([
        'headers' => ['Authorization' => 'Bearer ' . $accessToken]
    ]);
    $response = $http->get('https://example.com/api/profile/1');

Proxy Authentication
--------------------

Some proxies require authentication to use them. Generally this authentication
is Basic, but it can be implemented by any authentication adapter.  By default
Http\\Client will assume Basic authentication, unless the type key is set::

    $http = new Client();
    $response = $http->get('http://example.com/test.php', [], [
      'proxy' => [
        'username' => 'mark',
        'password' => 'testing',
        'proxy' => '127.0.0.1:8080',
      ]
    ]);

The second proxy parameter must be a string with an IP or a domain without
protocol. The username and password information will be passed through the
request headers, while the proxy string will be passed through
`stream_context_create()
<http://php.net/manual/en/function.stream-context-create.php>`_.

.. _http_client_scoped_client:

Creating Scoped Clients
=======================

Having to re-type the domain name, authentication and proxy settings can become
tedious & error prone.  To reduce the chance for mistake and relieve some of the
tedium, you can create scoped clients::

    // Create a scoped client.
    $http = new Client([
      'host' => 'api.example.com',
      'scheme' => 'https',
      'auth' => ['username' => 'mark', 'password' => 'testing']
    ]);

    // Do a request to api.example.com
    $response = $http->get('/test.php');

The following information can be used when creating a scoped client:

* host
* scheme
* proxy
* auth
* port
* cookies
* timeout
* ssl_verify_peer
* ssl_verify_depth
* ssl_verify_host

Any of these options can be overridden by specifying them when doing requests.
host, scheme, proxy, port are overridden in the request URL::

    // Using the scoped client we created earlier.
    $response = $http->get('http://foo.com/test.php');

The above will replace the domain, scheme, and port.  However, this request will
continue using all the other options defined when the scoped client was created.
See :ref:`http_client_request_options` for more information on the options
supported.


Setting and Managing Cookies
============================

Http\\Client can also accept cookies when making requests. In addition to
accepting cookies, it will also automatically store valid cookies set in
responses. Any response with cookies, will have them stored in the originating
instance of Http\\Client. The cookies stored in a Client instance are
automatically included in future requests to domain + path combinations that
match::

    $http = new Client([
        'host' => 'cakephp.org'
    ]);

    // Do a request that sets some cookies
    $response = $http->get('/');

    // Cookies from the first request will be included
    // by default.
    $response2 = $http->get('/changelogs');

You can always override the auto-included cookies by setting them in the
request's ``$options`` parameters::

    // Replace a stored cookie with a custom value.
    $response = $http->get('/changelogs', [], [
        'cookies' => ['sessionid' => '123abc']
    ]);

.. _httpclient-response-objects:

Response Objects
================

.. php:namespace:: Cake\Http\Client

.. php:class:: Response

Response objects have a number of methods for inspecting the response data.

.. versionchanged:: 3.3.0
    As of 3.3.0 ``Cake\Http\Client\Response`` implements the `PSR-7
    ResponseInterface
    <http://www.php-fig.org/psr/psr-7/#3-3-psr-http-message-responseinterface>`__.


Reading Response Bodies
-----------------------

You read the entire response body as a string::

    // Read the entire response as a string.
    $response->body();

    // As a property
    $response->body;

You can also access the stream object for the response and use its methods::

    // Get a Psr\Http\Message\StreamInterface containing the response body
    $stream = $response->getBody();

    // Read a stream 100 bytes at a time.
    while (!$stream->eof()) {
        echo $stream->read(100);
    }

.. _http-client-xml-json:

Reading JSON and XML Response Bodies
------------------------------------

Since JSON and XML responses are commonly used, response objects provide easy to
use accessors to read decoded data. JSON data is decoded into an array, while
XML data is decoded into a ``SimpleXMLElement`` tree::

    // Get some XML
    $http = new Client();
    $response = $http->get('http://example.com/test.xml');
    $xml = $response->xml;

    // Get some JSON
    $http = new Client();
    $response = $http->get('http://example.com/test.json');
    $json = $response->json;

The decoded response data is stored in the response object, so accessing it
multiple times has no additional cost.

Accessing Response Headers
--------------------------

You can access headers through a few different methods. Header names are always
treated as case-insensitive values when accessing them through methods::

    // Get all the headers as an associative array.
    $response->getHeaders();

    // Get a single header as an array.
    $response->getHeader('content-type');

    // Get a header as a string
    $response->getHeaderLine('content-type');

    // Get the response encoding
    $response->getEncoding();

    // Get an array of key=>value for all headers
    $response->headers;

Accessing Cookie Data
---------------------

You can read cookies with a few different methods depending on how much
data you need about the cookies::

    // Get all cookies (full data)
    $response->getCookies();

    // Get a single cookie's value.
    $response->getCookie('session_id');

    // Get a the complete data for a single cookie
    // includes value, expires, path, httponly, secure keys.
    $response->getCookieData('session_id');

    // Access the complete data for all cookies.
    $response->cookies;

Checking the Status Code
------------------------

Response objects provide a few methods for checking status codes::

    // Was the response a 20x
    $response->isOk();

    // Was the response a 30x
    $response->isRedirect();

    // Get the status code
    $response->getStatusCode();

    // __get() helper
    $response->code;

.. meta::
    :title lang=en: HttpClient
    :keywords lang=en: array name,array data,query parameter,query string,php class,string query,test type,string data,google,query results,webservices,apis,parameters,cakephp,meth,search results
