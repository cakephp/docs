8.8.2 post
----------

The post method makes a simple HTTP POST request returning the
results.

``string function post ($uri, $data, $request)``

The parameters for the ``post`` method are almost the same as the
get method, ``$uri`` is the web address where the request is being
made; ``$query`` is the data to be posted, either in string form:
"param1=foo&param2=bar" or as a keyed array: array('param1' =>
'foo', 'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->post('www.somesite.com/add', array('name' => 'test', 'type' => 'user'));  
    //$results contains what is returned from the post.


#. ``App::import('Core', 'HttpSocket');``
#. ``$HttpSocket = new HttpSocket();``
#. ``$results = $HttpSocket->post('www.somesite.com/add', array('name' => 'test', 'type' => 'user'));``
#. ``//$results contains what is returned from the post.``

8.8.2 post
----------

The post method makes a simple HTTP POST request returning the
results.

``string function post ($uri, $data, $request)``

The parameters for the ``post`` method are almost the same as the
get method, ``$uri`` is the web address where the request is being
made; ``$query`` is the data to be posted, either in string form:
"param1=foo&param2=bar" or as a keyed array: array('param1' =>
'foo', 'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->post('www.somesite.com/add', array('name' => 'test', 'type' => 'user'));  
    //$results contains what is returned from the post.


#. ``App::import('Core', 'HttpSocket');``
#. ``$HttpSocket = new HttpSocket();``
#. ``$results = $HttpSocket->post('www.somesite.com/add', array('name' => 'test', 'type' => 'user'));``
#. ``//$results contains what is returned from the post.``
