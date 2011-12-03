HttpSocket
##########

.. php:class:: HttpSocket(mixed $config = array())

CakePHP includes an HttpSocket class which can be used easily for
making requests. It is a great way to communicate with external webservices, or
remote apis.

Making a request
================

You can use HttpSocket to create most kinds of HTTP requests with the different
HTTP methods.

.. php:method:: get($uri, $query, $request)

    The ``$query`` parameter, can either be a query string, or an array of keys
    and values. The get method makes a simple HTTP GET request returning the
    results::

        <?php
        App::uses('HttpSocket', 'Network/Http');

        $HttpSocket = new HttpSocket();

        // string query
        $results = $HttpSocket->get('http://www.google.com/search', 'q=cakephp');
        
        // array query
        $results = $HttpSocket->get('http://www.google.com/search', array('q' => 'cakephp'));

.. php:method:: post($uri, $data, $request)

    The post method makes a simple HTTP POST request returning the
    results.

    The parameters for the ``post`` method are almost the same as the
    get method, ``$uri`` is the web address where the request is being
    made; ``$query`` is the data to be posted, either as s string, or as 
    an array of keys and values::

        <?php
        App::uses('HttpSocket', 'Network/Http');

        $HttpSocket = new HttpSocket();

        // string data
        $results = $HttpSocket->post(
            'http://example.com/add',
            'name=test&type=user'
        );
        
        // array data
        $data = array('name' => 'test', 'type' => 'user');
        $results = $HttpSocket->post('http://example.com/add', $data);

.. php:method:: put($uri, $data, $request)

    The put method makes a simple HTTP PUT request returning the
    results.

    The parameters for the ``put`` method is the same as the
    :php:meth:`~HttpSocket::post()` method.

.. php:method:: delete($uri, $query, $request)

    The put method makes a simple HTTP PUT request returning the
    results.

    The parameters for the ``delete`` method is the same as the
    :php:meth:`~HttpSocket::get()` method. The ``$query`` parameter can either be a string or an array
    of query string arguments for the request.

.. php:method:: request($request)

    The base request method, which is called from all the wrappers
    (get, post, put, delete). Returns the results of the request.

    $request is a keyed array of various options. Here is the format
    and default settings::

        public $request = array(
            'method' => 'GET',
            'uri' => array(
                'scheme' => 'http',
                'host' => null,
                'port' => 80,
                'user' => null,
                'pass' => null,
                'path' => null,
                'query' => null,
                'fragment' => null
            ),
            'auth' => array(
                'method' => 'Basic',
                'user' => null,
                'pass' => null
            ),
            'version' => '1.1',
            'body' => '',
            'line' => null,
            'header' => array(
                'Connection' => 'close',
                'User-Agent' => 'CakePHP'
            ),
            'raw' => null,
            'cookies' => array()
        );

Handling the response
=====================

Responses from requests made with ``HttpSocket`` are instances of
``HttpResponse``.  This object gives you a few accessor methods to access the
contents of an HTTP response. This class implements the
`ArrayAccess <http://php.net/manual/en/class.arrayaccess.php>`_ and
`__toString() <http://www.php.net/manual/en/language.oop5.magic.php#language.oop5.magic.tostring>`_,
so you can continue using the ``$http->response`` as array and the return of
request methods as string::

    <?php
    App::uses('HttpSocket', 'Network/Http');

    $http = new HttpSocket();
    $response = $http->get('http://www.cakephp.org');

    // Check the body for the presence of a title tag.
    $titlePos = strpos($response->body, '<title>');

    // Get the status code for the response.
    $code = $response->code;

The ``HttpResponse`` has the following attributes:

* ``body`` returns body of HTTP response (normally the HTML).
* ``headers`` returns array with headers.
* ``cookies`` returns array with new cookies (cookies from others request are not stored here).
* ``httpVersion`` returns string with HTTP version (from first line in response).
* ``code`` returns the integer with HTTP code.
* ``reasonPhrase`` returns the string with HTTP code response.
* ``raw`` returns the unchanged response from server.

The ``HttpResponse`` also exposes the following methods:

* ``body()`` returns the body
* ``isOk()`` returns if code is 200;
* ``getHeader()`` allows you to fetch headers, see the next section.

Getting headers from a response
-------------------------------

Following others places in core, the HttpSocket does not change the casing of
headers.  :rfc:`2616` states that headers are case insensitive, and HttpSocket
preserves the values the remote host sends::

    HTTP/1.1 200 OK
    Date: Mon, 16 Apr 2007 04:14:16 GMT
    server: CakeHttp Server
    content-tyPe: text/html

Your ``$response->headers`` (or ``$response['header']``) will contain the exact
keys sent. In order to safely access the header fields, it's best to use
``getHeader()``.  If your headers looks like::

    Date: Mon, 16 Apr 2007 04:14:16 GMT
    server: CakeHttp Server
    content-tyPe: text/html

You could fetch the above headers by calling::

    <?php
    // $response is an instance of HttpResponse
    // get the Content-Type header.
    $response->getHeader('Content-Type');

    // get the date
    $response->getHeader('date');

Headers can be fetched case-insensitively.

Creating a custom response class
--------------------------------

You can create your own response class to use with HttpSocket. You could create
the file ``app/Lib/Network/Http/YourResponse.php`` with the content::

    <?php
    App::uses('HttpResponse', 'Network/Http');

    class YourResponse extends HttpResponse {

        public function parseResponse($message) {
            parent::parseResponse($message);
            // Make what you want
        }
    }


Before your request you'll need to change the responseClass property::

    <?php
    App::uses('HttpSocket', 'Network/Http');

    $http = new HttpSocket();
    $http->responseClass = 'YourResponse';

Downloading the results
-----------------------

HttpSocket has a new method called `setContentResource()`. By setting a resource
with this method, the content will be written to this resource, using
`fwrite()`. To you download a file, you can do::

    <?php
    App::uses('HttpSocket', 'Network/Http');

    $http = new HttpSocket();
    $f = fopen(TMP . 'bakery.xml', 'w');
    $http->setContentResource($f);
    $http->get('http://bakery.cakephp.org/comments.rss');
    fclose($f);

.. note::

    The headers are not included in file, you will only get the body content
    written to your resource. To disable saving into the resource, use
    ``$http->setContentResource(false)``.

Using authentication
====================

HttpSocket supports a HTTP Basic and Digest authentication methods out of the
box.  You can also create custom authentication objects to support protocols
like OAuth.  To use any authentication system you need to configure the
``HttpSocket`` instance::

    <?php
    App::uses('HttpSocket', 'Network/Http');

    $http = new HttpSocket();
    $http->configAuth('Basic', 'user', 'password');

The above would configure the ``HttpSocket`` instance to use Basic
authentication using ``user`` and ``password`` as the credentials.

Creating a custom authentication object
---------------------------------------

You can now create your own authentication method to use with HttpSocket. You
could create the file ``app/Lib/Network/Http/YourMethodAuthentication.php`` with the
content::

    <?php

    class YourMethodAuthentication {

    /**
     * Authentication
     *
     * @param HttpSocket $http
     * @param array $authInfo
     * @return void
     */
        public static function authentication(HttpSocket $http, &$authInfo) {
            // Do something, for example set $http->request['header']['Authentication'] value
        }

    }

To configure HttpSocket to use your auth configuration, you can use the new
method ``configAuth()``::

    <?php
    $http->configAuth('YourMethod', array('config1' => 'value1', 'config2' => 'value2'));
    $http->get('http://secure.your-site.com');

The ``authentication()`` method will be called to append the request headers.

Using a HttpSocket with a proxy
-------------------------------

As part of auth configuration, you can configure proxy authentication. You can
create your customized method to proxy authentication in the same class of
authentication. For example::

    <?php

    class YourMethodAuthentication {

    /**
     * Authentication
     *
     * @param HttpSocket $http
     * @param array $authInfo
     * @return void
     */
        public static function authentication(HttpSocket $http, &$authInfo) {
            // Do something, for example set $http->request['header']['Authentication'] value
        }

    /**
     * Proxy Authentication
     *
     * @param HttpSocket $http
     * @param array $proxyInfo
     * @return void
     */
        public static function proxyAuthentication(HttpSocket $http, &$proxyInfo) {
            // Do something, for example set $http->request['header']['Proxy-Authentication'] value
        }

    }

.. note::

    To use a proxy, you must call the ``HttpSocket::configProxy()`` similar to
    ``HttpSocket::configAuth()``.



.. meta::
    :title lang=en: HttpSocket
    :keywords lang=en: array name,array data,query parameter,query string,php class,string query,test type,string data,google,query results,webservices,apis,parameters,cakephp,meth,search results