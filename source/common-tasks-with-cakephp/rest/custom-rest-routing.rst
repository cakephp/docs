4.10.2 Custom REST Routing
--------------------------

If the default routes created by mapResources() don't work for you,
use the Router::connect() method to define a custom set of REST
routes. The connect() method allows you to define a number of
different options for a given URL. The first parameter is the URL
itself, and the second parameter allows you to supply those
options. The third parameter allows you to specify regex patterns
to help CakePHP identify certain markers in the specified URL.

We'll provide a simple example here, and allow you to tailor this
route for your other RESTful purposes. Here's what our edit REST
route would look like, without using mapResources():

::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9]+")
    )

Advanced routing techniques are covered elsewhere, so we'll focus
on the most important point for our purposes here: the [method] key
of the options array in the second parameter. Once that key has
been set, the specified route works only for that HTTP request
method (which could also be GET, DELETE, etc.)

4.10.2 Custom REST Routing
--------------------------

If the default routes created by mapResources() don't work for you,
use the Router::connect() method to define a custom set of REST
routes. The connect() method allows you to define a number of
different options for a given URL. The first parameter is the URL
itself, and the second parameter allows you to supply those
options. The third parameter allows you to specify regex patterns
to help CakePHP identify certain markers in the specified URL.

We'll provide a simple example here, and allow you to tailor this
route for your other RESTful purposes. Here's what our edit REST
route would look like, without using mapResources():

::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9]+")
    )

Advanced routing techniques are covered elsewhere, so we'll focus
on the most important point for our purposes here: the [method] key
of the options array in the second parameter. Once that key has
been set, the specified route works only for that HTTP request
method (which could also be GET, DELETE, etc.)
