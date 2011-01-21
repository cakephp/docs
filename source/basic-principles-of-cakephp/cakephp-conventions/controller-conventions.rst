2.4.3 Controller Conventions
----------------------------

Controller classnames are plural, CamelCased, and end in
``Controller``. ``PeopleController`` and
``LatestArticlesController`` are both examples of conventional
controller names.

The first method you write for a controller might be the
``index()`` method. When a request specifies a controller but not
an action, the default CakePHP behavior is to execute the
``index()`` method of that controller. For example, a request for
http://www.example.com/apples/ maps to a call on the ``index()``
method of the ``ApplesController``, whereas
http://www.example.com/apples/view/ maps to a call on the
``view()`` method of the ``ApplesController``.

You can also change the visibility of controller methods in CakePHP
by prefixing controller method names with underscores. If a
controller method has been prefixed with an underscore, the method
will not be accessible directly from the web but is available for
internal use. For example:

::

    <?php
    class NewsController extends AppController {
    
        function latest() {
            $this->_findNewArticles();
        }
        
        function _findNewArticles() {
            //Logic to find latest news articles
        }
    }
    
    ?>


#. ``<?php``
#. ``class NewsController extends AppController {``
#. ``function latest() {``
#. ``$this->_findNewArticles();``
#. ``}``
#. ````
#. ``function _findNewArticles() {``
#. ``//Logic to find latest news articles``
#. ``}``
#. ``}``
#. ``?>``

While the page http://www.example.com/news/latest/ would be
accessible to the user as usual, someone trying to get to the page
http://www.example.com/news/\_findNewArticles/ would get an error,
because the method is preceded with an underscore.

URL Considerations for Controller Names
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

As you've just seen, single word controllers map easily to a simple
lower case URL path. For example, ``ApplesController`` (which would
be defined in the file name 'apples\_controller.php') is accessed
from http://example.com/apples.

Multiple word controllers *can* be any 'inflected' form which
equals the controller name so:


-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

will all resolve to the index of the RedApples controller. However,
the convention is that your urls are lowercase and underscored,
therefore /red\_apples/go\_pick is the correct form to access the
``RedApplesController::go_pick`` action.

For more information on CakePHP URLs and parameter handling, see
`Routes Configuration </view/945/Routes-Configuration>`_.

2.4.3 Controller Conventions
----------------------------

Controller classnames are plural, CamelCased, and end in
``Controller``. ``PeopleController`` and
``LatestArticlesController`` are both examples of conventional
controller names.

The first method you write for a controller might be the
``index()`` method. When a request specifies a controller but not
an action, the default CakePHP behavior is to execute the
``index()`` method of that controller. For example, a request for
http://www.example.com/apples/ maps to a call on the ``index()``
method of the ``ApplesController``, whereas
http://www.example.com/apples/view/ maps to a call on the
``view()`` method of the ``ApplesController``.

You can also change the visibility of controller methods in CakePHP
by prefixing controller method names with underscores. If a
controller method has been prefixed with an underscore, the method
will not be accessible directly from the web but is available for
internal use. For example:

::

    <?php
    class NewsController extends AppController {
    
        function latest() {
            $this->_findNewArticles();
        }
        
        function _findNewArticles() {
            //Logic to find latest news articles
        }
    }
    
    ?>


#. ``<?php``
#. ``class NewsController extends AppController {``
#. ``function latest() {``
#. ``$this->_findNewArticles();``
#. ``}``
#. ````
#. ``function _findNewArticles() {``
#. ``//Logic to find latest news articles``
#. ``}``
#. ``}``
#. ``?>``

While the page http://www.example.com/news/latest/ would be
accessible to the user as usual, someone trying to get to the page
http://www.example.com/news/\_findNewArticles/ would get an error,
because the method is preceded with an underscore.

URL Considerations for Controller Names
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

As you've just seen, single word controllers map easily to a simple
lower case URL path. For example, ``ApplesController`` (which would
be defined in the file name 'apples\_controller.php') is accessed
from http://example.com/apples.

Multiple word controllers *can* be any 'inflected' form which
equals the controller name so:


-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

will all resolve to the index of the RedApples controller. However,
the convention is that your urls are lowercase and underscored,
therefore /red\_apples/go\_pick is the correct form to access the
``RedApplesController::go_pick`` action.

For more information on CakePHP URLs and parameter handling, see
`Routes Configuration </view/945/Routes-Configuration>`_.
