11.1.13 Routes
--------------

For some, CakePHP's default routing works well enough. Developers
who are sensitive to user-friendliness and general search engine
compatibility will appreciate the way that CakePHP's URLs map to
specific actions. So we'll just make a quick change to routes in
this tutorial.

For more information on advanced routing techniques, see
`"Routes Configuration" </view/945/>`_.

By default, CakePHP responds to a request for the root of your site
(i.e. http://www.example.com) using its PagesController, rendering
a view called "home". Instead, we'll replace this with our
PostsController by creating a routing rule.

Cake's routing is found in ``/app/config/routes.php``. You'll want
to comment out or remove the line that defines the default root
route. It looks like this:

::

    Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));


#. ``Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));``

This line connects the URL '/' with the default CakePHP home page.
We want it to connect with our own controller, so replace that line
with this one:

::

    Router::connect('/', array('controller' => 'posts', 'action' => 'index'));


#. ``Router::connect('/', array('controller' => 'posts', 'action' => 'index'));``

This should connect users requesting '/' to the index() action of
our PostsController.

CakePHP also makes use of 'reverse routing' - if with the above
route defined you pass
``array('controller' => 'posts', 'action' => 'index')`` to a
function expecting an array, the resultant URL used will be '/'.
It's therefore a good idea to always use arrays for URLs as this
means your routes define where a URL goes, and also ensures that
links point to the same place too.

11.1.13 Routes
--------------

For some, CakePHP's default routing works well enough. Developers
who are sensitive to user-friendliness and general search engine
compatibility will appreciate the way that CakePHP's URLs map to
specific actions. So we'll just make a quick change to routes in
this tutorial.

For more information on advanced routing techniques, see
`"Routes Configuration" </view/945/>`_.

By default, CakePHP responds to a request for the root of your site
(i.e. http://www.example.com) using its PagesController, rendering
a view called "home". Instead, we'll replace this with our
PostsController by creating a routing rule.

Cake's routing is found in ``/app/config/routes.php``. You'll want
to comment out or remove the line that defines the default root
route. It looks like this:

::

    Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));


#. ``Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));``

This line connects the URL '/' with the default CakePHP home page.
We want it to connect with our own controller, so replace that line
with this one:

::

    Router::connect('/', array('controller' => 'posts', 'action' => 'index'));


#. ``Router::connect('/', array('controller' => 'posts', 'action' => 'index'));``

This should connect users requesting '/' to the index() action of
our PostsController.

CakePHP also makes use of 'reverse routing' - if with the above
route defined you pass
``array('controller' => 'posts', 'action' => 'index')`` to a
function expecting an array, the resultant URL used will be '/'.
It's therefore a good idea to always use arrays for URLs as this
means your routes define where a URL goes, and also ensures that
links point to the same place too.
