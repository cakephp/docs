8.8.1 get
---------

The get method makes a simple HTTP GET request returning the
results.

``string get($uri, $query, $request)``

``$uri`` is the web address where the request is being made;
``$query`` is any query string parameters, either in string form:
"param1=foo&param2=bar" or as a keyed array: array('param1' =>
'foo', 'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->get('http://www.google.com/search', 'q=cakephp');  
    //returns html for Google's search results for the query "cakephp"


#. ``App::import('Core', 'HttpSocket');``
#. ``$HttpSocket = new HttpSocket();``
#. ``$results = $HttpSocket->get('http://www.google.com/search', 'q=cakephp');``
#. ``//returns html for Google's search results for the query "cakephp"``

8.8.1 get
---------

The get method makes a simple HTTP GET request returning the
results.

``string get($uri, $query, $request)``

``$uri`` is the web address where the request is being made;
``$query`` is any query string parameters, either in string form:
"param1=foo&param2=bar" or as a keyed array: array('param1' =>
'foo', 'param2' => 'bar').

::

    App::import('Core', 'HttpSocket');
    $HttpSocket = new HttpSocket();
    $results = $HttpSocket->get('http://www.google.com/search', 'q=cakephp');  
    //returns html for Google's search results for the query "cakephp"


#. ``App::import('Core', 'HttpSocket');``
#. ``$HttpSocket = new HttpSocket();``
#. ``$results = $HttpSocket->get('http://www.google.com/search', 'q=cakephp');``
#. ``//returns html for Google's search results for the query "cakephp"``
