HttpSocket
##########

CakePHP includes an HttpSocket class which can be used easily for making
requests, such as those to web services.

get
===

The get method makes a simple HTTP GET request returning the results.

``string get($uri, $query, $request)``

``$uri`` is the web address where the request is being made; ``$query``
is any query string parameters, either in string form:
"param1=foo&param2=bar" or as a keyed array: array('param1' => 'foo',
'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->get('https://www.google.com/search', 'q=cakephp');
    //returns html for Google's search results for the query "cakephp"

post
====

The post method makes a simple HTTP POST request returning the results.

``string function post ($uri, $data, $request)``

The parameters for the ``post`` method are almost the same as the get
method, ``$uri`` is the web address where the request is being made;
``$data`` is the data to be posted, either in string form:
"param1=foo&param2=bar" or as a keyed array: array('param1' => 'foo',
'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->post('www.somesite.com/add', array('name' => 'test', 'type' => 'user'));  
    //$results contains what is returned from the post.

request
=======

The base request method, which is called from all the wrappers (get,
post, put, delete). Returns the results of the request.

``string function request($request)``

$request is a keyed array of various options. Here is the format and
default settings:

::

    var $request = array(
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

