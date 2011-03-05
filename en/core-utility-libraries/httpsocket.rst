HttpSocket
##########

.. php:class:: HttpSocket

CakePHP includes an HttpSocket class which can be used easily for
making requests, such as those to web services.

.. php:method:: get($uri, $query, $request)

    :param string $uri: is the web address where the request is being made;
    :param mixed $query: is any query string parameters, either in string form:
        "param1=foo&param2=bar" or as a keyed array: array('param1' =>
        'foo', 'param2' => 'bar').

    The get method makes a simple HTTP GET request returning the
    results::
    
        <?php
        App::import('Core', 'HttpSocket');
        $HttpSocket = new HttpSocket();
        $results = $HttpSocket->get('http://www.google.com/search', 'q=cakephp');
        //returns html for Google's search results for the query "cakephp"

.. php:method:: post($uri, $data, $request)

    The post method makes a simple HTTP POST request returning the
    results.

    The parameters for the ``post`` method are almost the same as the
    get method, ``$uri`` is the web address where the request is being
    made; ``$query`` is the data to be posted, either in string form:
    "param1=foo&param2=bar" or as a keyed array: array('param1' =>
    'foo', 'param2' => 'bar').::
    
        <?php
        App::import('Core', 'HttpSocket');
        $HttpSocket = new HttpSocket();
        $results = $HttpSocket->post('www.somesite.com/add', array('name' => 'test', 'type' => 'user'));
        //$results contains what is returned from the post.


.. php:method:: request($request)

    The base request method, which is called from all the wrappers
    (get, post, put, delete). Returns the results of the request.

    $request is a keyed array of various options. Here is the format
    and default settings::

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


    .. todo:: 

    	This class changed quite a bit in 2.0, update the docs, and include all the missing methods + examples.