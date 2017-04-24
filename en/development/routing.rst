Routing
#######

.. php:namespace:: Cake\Routing

.. php:class:: Router

Routing provides you tools that map URLs to controller actions. By defining
routes, you can separate how your application is implemented from how its URL's
are structured.

Routing in CakePHP also encompasses the idea of reverse routing, where an array
of parameters can be transformed into a URL string. By using reverse routing,
you can re-factor your application's URL structure without having to update all
your code.

.. index:: routes.php

Quick Tour
==========

This section will teach you by example the most common uses of the CakePHP
Router. Typically you want to display something as a landing page, so you add
this to your **routes.php** file::

    use Cake\Routing\Router;

    // Using the scoped route builder.
    Router::scope('/', function ($routes) {
        $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);
    });

    // Using the static method.
    Router::connect('/', ['controller' => 'Articles', 'action' => 'index']);

``Router`` provides two interfaces for connecting routes. The static method is
a backwards compatible interface, while the scoped builders offer more terse
syntax when building multiple routes, and better performance.

The following will execute the index method in the ``ArticlesController`` when the
homepage of your site is visited. Sometimes you need dynamic routes that will
accept multiple parameters, this would be the case, for example of a route for
viewing an article's content::

    Router::connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

The above route will accept any URL looking like ``/articles/15`` and invoke the
method ``view(15)`` in the ``ArticlesController``. This will not, though,
prevent people from trying to access URLs looking like ``/articles/foobar``. If
you wish, you can restring some parameters to conform to a regular expression::

    Router::connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    );

The previous example changed the star matcher by a new placeholder ``:id``.
Using placeholders allows us to validate parts of the URL, in this case we used
the ``\d+`` regular expression so that only digits are matched. Finally, we told
the Router to treat the ``id`` placeholder as a function argument to the
``view()`` function by specifying the ``pass`` option. More on using this
option later.

The CakePHP Router can also reverse match routes. That means that from an
array containing matching parameters, it is capable of generating a URL string::

    use Cake\Routing\Router;

    echo Router::url(['controller' => 'Articles', 'action' => 'view', 'id' => 15]);
    // Will output
    /articles/15

Routes can also be labelled with a unique name, this allows you to quickly
reference them when building links instead of specifying each of the routing
parameters::

    use Cake\Routing\Router;

    Router::connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    echo Router::url(['_name' => 'login']);
    // Will output
    /login

To help keep your routing code DRY, the Router has the concept of 'scopes'.
A scope defines a common path segment, and optionally route defaults. Any routes
connected inside a scope will inherit the path/defaults from their wrapping
scopes::

    Router::scope('/blog', ['plugin' => 'Blog'], function ($routes) {
        $routes->connect('/', ['controller' => 'Articles']);
    });

The above route would match ``/blog/`` and send it to
``Blog\Controller\ArticlesController::index()``.

The application skeleton comes with a few routes to get you started. Once you've
added your own routes, you can remove the default routes if you don't need them.

.. index:: :controller, :action, :plugin
.. index:: greedy star, trailing star
.. _connecting-routes:
.. _routes-configuration:

Connecting Routes
=================

.. php:staticmethod:: connect($route, $defaults = [], $options = [])

To keep your code :term:`DRY` you should use 'routing scopes'. Routing
scopes not only let you keep your code DRY, they also help Router optimize its
operation. As seen above you can also use ``Router::connect()`` to connect
routes. This method defaults to the ``/`` scope. To create a scope and connect
some routes we'll use the ``scope()`` method::

    // In config/routes.php
    use Cake\Routing\Route\DashedRoute;

    Router::scope('/', function ($routes) {
        $routes->fallbacks(DashedRoute::class);
    });

The ``connect()`` method takes up to three parameters: the URL template you wish
to match, the default values for your route elements, and the options for the
route. Options frequently include regular expression rules to help the router
match elements in the URL.

The basic format for a route definition is::

    $routes->connect(
        'URL template',
        ['default' => 'defaultValue'],
        ['option' => 'matchingRegex']
    );

The first parameter is used to tell the router what sort of URL you're trying to
control. The URL is a normal slash delimited string, but can also contain
a wildcard (\*) or :ref:`route-elements`.  Using a wildcard tells the router
that you are willing to accept any additional arguments supplied. Routes without
a \* only match the exact template pattern supplied.

Once you've specified a URL, you use the last two parameters of ``connect()`` to
tell CakePHP what to do with a request once it has been matched. The second
parameter is an associative array. The keys of the array should be named after
the route elements the URL template represents. The values in the array are the
default values for those keys.  Let's look at some basic examples before we
start using the third parameter of ``connect()``::

    $routes->connect(
        '/pages/*',
        ['controller' => 'Pages', 'action' => 'display']
    );

This route is found in the routes.php file distributed with CakePHP.  It matches
any URL starting with ``/pages/`` and hands it to the ``display()`` action of
the ``PagesController``. A request to ``/pages/products`` would be mapped to
``PagesController->display('products')``.

In addition to the greedy star ``/*`` there is also the ``/**`` trailing star
syntax. Using a trailing double star, will capture the remainder of a URL as a
single passed argument. This is useful when you want to use an argument that
included a ``/`` in it::

    $routes->connect(
        '/pages/**',
        ['controller' => 'Pages', 'action' => 'show']
    );

The incoming URL of ``/pages/the-example-/-and-proof`` would result in a single
passed argument of ``the-example-/-and-proof``.

You can use the second parameter of ``connect()`` to provide any routing
parameters that are composed of the default values of the route::

    $routes->connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );

This example shows how you can use the second parameter of ``connect()`` to
define default parameters. If you built a site that features products for
different categories of customers, you might consider creating a route. This
allows you to link to ``/government`` rather than ``/pages/display/5``.

Another common use for the Router is to define an "alias" for a
controller. Let's say that instead of accessing our regular URL at
``/users/some_action/5``, we'd like to be able to access it by
``/cooks/some_action/5``. The following route takes care of
that::

    $routes->connect(
        '/cooks/:action/*', ['controller' => 'Users']
    );

This is telling the Router that any URL beginning with ``/cooks/`` should be
sent to the users controller. The action called will depend on the value of the
``:action`` parameter. By using :ref:`route-elements`, you can create variable
routes, that accept user input or variables. The above route also uses the
greedy star.  The greedy star indicates to ``Router`` that this route
should accept any additional positional arguments given. These arguments will be
made available in the :ref:`passed-arguments` array.

When generating URLs, routes are used too. Using
``['controller' => 'Users', 'action' => 'some_action', 5]`` as
a URL will output ``/cooks/some_action/5`` if the above route is the
first match found.

.. _route-elements:

Route Elements
--------------

You can specify your own route elements and doing so gives you the
power to define places in the URL where parameters for controller
actions should lie. When a request is made, the values for these
route elements are found in ``$this->request->getParam()`` in the controller.
When you define a custom route element, you can optionally specify a regular
expression - this tells CakePHP how to know if the URL is correctly formed or
not. If you choose to not provide a regular expression, any non ``/`` character
will be treated as part of the parameter::

    $routes->connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

The above example illustrates how to create a quick way to view
models from any controller by crafting a URL that looks like
``/controllername/:id``. The URL provided to ``connect()`` specifies two
route elements: ``:controller`` and ``:id``. The ``:controller`` element
is a CakePHP default route element, so the router knows how to match and
identify controller names in URLs. The ``:id`` element is a custom
route element, and must be further clarified by specifying a
matching regular expression in the third parameter of ``connect()``.

CakePHP does not automatically produce lowercased and dashed URLs when using the
``:controller`` parameter. If you need this, the above example could be
rewritten like so::

    use Cake\Routing\Route\DashedRoute;

    $routes->connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+', 'routeClass' => DashedRoute::class]
    );

The ``DashedRoute`` class will make sure that the ``:controller`` and
``:plugin`` parameters are correctly lowercased and dashed.

If you need lowercased and underscored URLs while migrating from a CakePHP
2.x application, you can instead use the ``InflectedRoute`` class.

.. note::

    Patterns used for route elements must not contain any capturing
    groups. If they do, Router will not function correctly.

Once this route has been defined, requesting ``/apples/5`` would call the ``view()``
method of the ApplesController. Inside the ``view()`` method, you would need to
access the passed ID at ``$this->request->getParam('id')``.

If you have a single controller in your application and you do not want the
controller name to appear in the URL, you can map all URLs to actions in your
controller. For example, to map all URLs to actions of the ``home`` controller,
e.g have URLs like ``/demo`` instead of ``/home/demo``, you can do the
following::

    $routes->connect('/:action', ['controller' => 'Home']);

If you would like to provide a case insensitive URL, you can use regular
expression inline modifiers::

    $routes->connect(
        '/:userShortcut',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
        ['userShortcut' => '(?i:principal)']
    );

One more example, and you'll be a routing pro::

    $routes->connect(
        '/:controller/:year/:month/:day',
        ['action' => 'index'],
        [
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        ]
    );

This is rather involved, but shows how powerful routes can be. The URL supplied
has four route elements. The first is familiar to us: it's a default route
element that tells CakePHP to expect a controller name.

Next, we specify some default values. Regardless of the controller,
we want the ``index()`` action to be called.

Finally, we specify some regular expressions that will match years,
months and days in numerical form. Note that parenthesis (grouping)
are not supported in the regular expressions. You can still specify
alternates, as above, but not grouped with parenthesis.

Once defined, this route will match ``/articles/2007/02/01``,
``/articles/2004/11/16``, handing the requests to
the ``index()`` actions of their respective controllers, with the date
parameters in ``$this->request->getParam()``.

There are several route elements that have special meaning in
CakePHP, and should not be used unless you want the special meaning

* ``controller`` Used to name the controller for a route.
* ``action`` Used to name the controller action for a route.
* ``plugin`` Used to name the plugin a controller is located in.
* ``prefix`` Used for :ref:`prefix-routing`
* ``_ext`` Used for :ref:`File extentions routing <file-extensions>`.
* ``_base`` Set to ``false`` to remove the base path from the generated URL. If
  your application is not in the root directory, this can be used to generate
  URLs that are 'cake relative'.
* ``_scheme``  Set to create links on different schemes like `webcal` or `ftp`.
  Defaults to the current scheme.
* ``_host`` Set the host to use for the link.  Defaults to the current host.
* ``_port`` Set the port if you need to create links on non-standard ports.
* ``_full``  If ``true`` the `FULL_BASE_URL` constant will be prepended to
  generated URLs.
* ``#`` Allows you to set URL hash fragments.
* ``_ssl`` Set to ``true`` to convert the generated URL to https or ``false``
  to force http.
* ``_method`` Define the HTTP verb/method to use. Useful when working with
  :ref:`resource-routes`.
* ``_name`` Name of route. If you have setup named routes, you can use this key
  to specify it.

Passing Parameters to Action
----------------------------

When connecting routes using :ref:`route-elements` you may want to have routed
elements be passed arguments instead. The ``pass`` option whitelists which route
elements should also be made available as arguments passed into the controller
functions::

    // src/Controller/BlogsController.php
    public function view($articleId = null, $slug = null)
    {
        // Some code here...
    }

    // routes.php
    Router::scope('/', function ($routes) {
        $routes->connect(
            '/blog/:id-:slug', // E.g. /blog/3-CakePHP_Rocks
            ['controller' => 'Blogs', 'action' => 'view'],
            [
                // Define the route elements in the route template
                // to pass as function arguments. Order matters since this
                // will simply map ":id" to $articleId in your action
                'pass' => ['id', 'slug'],
                // Define a pattern that `id` must match.
                'id' => '[0-9]+'
            ]
        );
    });

Now thanks to the reverse routing capabilities, you can pass in the URL array
like below and CakePHP will know how to form the URL as defined in the routes::

    // view.ctp
    // This will return a link to /blog/3-CakePHP_Rocks
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        'id' => 3,
        'slug' => 'CakePHP_Rocks'
    ]);

    // You can also used numerically indexed parameters.
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        3,
        'CakePHP_Rocks'
    ]);

.. _named-routes:

Using Named Routes
------------------

Sometimes you'll find typing out all the URL parameters for a route too verbose,
or you'd like to take advantage of the performance improvements that named
routes have. When connecting routes you can specifiy a ``_name`` option, this
option can be used in reverse routing to identify the route you want to use::

    // Connect a route with a name.
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // Generate a URL using a named route.
    $url = Router::url(['_name' => 'login']);

    // Generate a URL using a named route,
    // with some query string args.
    $url = Router::url(['_name' => 'login', 'username' => 'jimmy']);

If your route template contains any route elements like ``:controller`` you'll
need to supply those as part of the options to ``Router::url()``.

.. note::

    Route names must be unique across your entire application. The same
    ``_name`` cannot be used twice, even if the names occur inside a different
    routing scope.

When building named routes, you will probably want to stick to some conventions
for the route names. CakePHP makes building up route names easier by allowing
you to define name prefixes in each scope::

    Router::scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
        // This route's name will be `api:ping`
        $routes->connect('/ping', ['controller' => 'Pings'], ['_name' => 'ping']);
    });
    // Generate a URL for the ping route
    Router::url(['_name' => 'api:ping']);

    // Use namePrefix with plugin()
    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        // Connect routes.
    });

    // Or with prefix()
    Router::prefix('Admin', ['_namePrefix' => 'admin:'], function ($routes) {
        // Connect routes.
    });

You can also use the ``_namePrefix`` option inside nested scopes and it works as
you'd expect::

    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
            // This route's name will be `contacts:api:ping`
            $routes->connect('/ping', ['controller' => 'Pings'], ['_name' => 'ping']);
        });
    });

    // Generate a URL for the ping route
    Router::url(['_name' => 'contacts:api:ping']);

Routes connected in named scopes will only have names added if the route is also
named. Nameless routes will not have the ``_namePrefix`` applied to them.

.. versionadded:: 3.1
    The ``_namePrefix`` option was added in 3.1

.. index:: admin routing, prefix routing
.. _prefix-routing:

Prefix Routing
--------------

.. php:staticmethod:: prefix($name, $callback)

Many applications require an administration section where
privileged users can make changes. This is often done through a
special URL such as ``/admin/users/edit/5``. In CakePHP, prefix routing
can be enabled by using the ``prefix`` scope method::

    use Cake\Routing\Route\DashedRoute;

    Router::prefix('admin', function ($routes) {
        // All routes here will be prefixed with `/admin`
        // And have the prefix => admin route element added.
        $routes->fallbacks(DashedRoute::class);
    });

Prefixes are mapped to sub-namespaces in your application's ``Controller``
namespace. By having prefixes as separate controllers you can create smaller and
simpler controllers. Behavior that is common to the prefixed and non-prefixed
controllers can be encapsulated using inheritance,
:doc:`/controllers/components`, or traits.  Using our users example, accessing
the URL ``/admin/users/edit/5`` would call the ``edit()`` method of our
**src/Controller/Admin/UsersController.php** passing 5 as the first parameter.
The view file used would be **src/Template/Admin/Users/edit.ctp**

You can map the URL /admin to your ``index()`` action of pages controller using
following route::

    Router::prefix('admin', function ($routes) {
        // Because you are in the admin scope,
        // you do not need to include the /admin prefix
        // or the admin route element.
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

When creating prefix routes, you can set additional route parameters using
the ``$options`` argument::

    Router::prefix('admin', ['param' => 'value'], function ($routes) {
        // Routes connected here are prefixed with '/admin' and
        // have the 'param' routing key set.
        $routes->connect('/:controller');
    });

You can define prefixes inside plugin scopes as well::

    Router::plugin('DebugKit', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

The above would create a route template like ``/debug_kit/admin/:controller``.
The connected route would have the ``plugin`` and ``prefix`` route elements set.

When defining prefixes, you can nest multiple prefixes if necessary::

    Router::prefix('manager', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

The above would create a route template like ``/manager/admin/:controller``.
The connected route would have the ``prefix`` route element set to
``manager/admin``.

The current prefix will be available from the controller methods through
``$this->request->getParam('prefix')``

When using prefix routes it's important to set the prefix option. Here's how to
build this link using the HTML helper::

    // Go into a prefixed route.
    echo $this->Html->link(
        'Manage articles',
        ['prefix' => 'manager', 'controller' => 'Articles', 'action' => 'add']
    );

    // Leave a prefix
    echo $this->Html->link(
        'View Post',
        ['prefix' => false, 'controller' => 'Articles', 'action' => 'view', 5]
    );

.. note::

    You should connect prefix routes *before* you connect fallback routes.

.. index:: plugin routing

Plugin Routing
--------------

.. php:staticmethod:: plugin($name, $options = [], $callback)

Routes for :doc:`/plugins` should be created using the ``plugin()``
method. This method creates a new routing scope for the plugin's routes::

    Router::plugin('DebugKit', function ($routes) {
        // Routes connected here are prefixed with '/debug_kit' and
        // have the plugin route element set to 'DebugKit'.
        $routes->connect('/:controller');
    });

When creating plugin scopes, you can customize the path element used with the
``path`` option::

    Router::plugin('DebugKit', ['path' => '/debugger'], function ($routes) {
        // Routes connected here are prefixed with '/debugger' and
        // have the plugin route element set to 'DebugKit'.
        $routes->connect('/:controller');
    });

When using scopes you can nest plugin scopes within prefix scopes::

    Router::prefix('admin', function ($routes) {
        $routes->plugin('DebugKit', function ($routes) {
            $routes->connect('/:controller');
        });
    });

The above would create a route that looks like ``/admin/debug_kit/:controller``.
It would have the ``prefix``, and ``plugin`` route elements set.

You can create links that point to a plugin, by adding the plugin key to your
URL array::

    echo $this->Html->link(
        'New todo',
        ['plugin' => 'Todo', 'controller' => 'TodoItems', 'action' => 'create']
    );

Conversely if the active request is a plugin request and you want to create
a link that has no plugin you can do the following::

    echo $this->Html->link(
        'New todo',
        ['plugin' => null, 'controller' => 'Users', 'action' => 'profile']
    );

By setting ``plugin => null`` you tell the Router that you want to
create a link that is not part of a plugin.

SEO-Friendly Routing
--------------------

Some developers prefer to use dashes in URLs, as it's perceived to give
better search engine rankings. The ``DashedRoute`` class can be used in your
application with the ability to route plugin, controller, and camelized action
names to a dashed URL.

For example, if we had a ``ToDo`` plugin, with a ``TodoItems`` controller, and a
``showItems()`` action, it could be accessed at ``/to-do/todo-items/show-items``
with the following router connection::

    use Cake\Routing\Route\DashedRoute;

    Router::plugin('ToDo', ['path' => 'to-do'], function ($routes) {
        $routes->fallbacks(DashedRoute::class);
    });

Matching Specific HTTP Methods
------------------------------

Routes can match specific HTTP methods using the ``_method`` routing key::

    Router::scope('/', function($routes) {
        // This route only matches on POST requests.
        $routes->connect(
            '/reviews/start',
            ['controller' => 'Reviews', 'action' => 'start', '_method' => 'POST']
        );
    });

You can match multiple HTTP methods by using an array. Because the ``_method``
parameter is a routing key, it participates in both URL parsing and URL
generation.

Matching Specific Hostnames
---------------------------

Routes can use the ``_host`` option to only match specific hosts. You can use
the ``*.`` wildcard to match any subdomain::

    Router::scope('/', function($routes) {
        // This route only matches on http://images.example.com
        $routes->connect(
            '/images/default-logo.png',
            ['controller' => 'Images', 'action' => 'default'],
            ['_host' => 'images.example.com']
        );

        // This route only matches on http://*.example.com
        $routes->connect(
            '/images/old-log.png',
            ['controller' => 'Images', 'action' => 'oldLogo'],
            ['_host' => '*.example.com']
        );
    });

The ``_host`` option is also used in URL generation. If your ``_host`` option
specifies an exact domain, that domain will be included in the generated URL.
However, if you use a wildcard, then you will need to provide the ``_host``
parameter when generating URLs::

    // If you have this route
    $routes->connect(
        '/images/old-log.png',
        ['controller' => 'Images', 'action' => 'oldLogo'],
        ['_host' => '*.example.com']
    );

    // You need this to generate a url
    echo Router::url([
        'controller' => 'Images',
        'action' => 'oldLogo',
        '_host' => 'images.example.com'
    ]);

.. versionadded:: 3.4.0
    The ``_host`` option was added in 3.4.0

.. index:: file extensions
.. _file-extensions:

Routing File Extensions
-----------------------

.. php:staticmethod:: extensions(string|array|null $extensions, $merge = true)

To handle different file extensions with your routes, you can define extensions
on a global, as well as on a scoped level. Defining global extensions can be
achieved via the routers static :php:meth:`Router::extensions()` method::

    Router::extensions(['json', 'xml']);
    // ...

This will affect **all** routes that are being connected **afterwards**, no matter
their scope.

In order to restrict extensions to specific scopes, you can define them using the
:php:meth:`Cake\\Routing\\RouteBuilder::extensions()` method::

    Router::scope('/', function ($routes) {
        $routes->extensions(['json', 'xml']);
        // ...
    });

This will enable the named extensions for all routes that are being connected in
that scope **after** the ``extensions()`` call, including those that are being
connected in nested scopes. Similar to the global :php:meth:`Router::extensions()`
method, any routes connected prior to the call will not inherit the extensions.

.. note::

    Setting the extensions should be the first thing you do in a scope, as the
    extensions will only be applied to routes connected **after** the extensions
    are set.

    Also be aware that re-opened scopes will **not** inherit extensions defined in
    previously opened scopes.

By using extensions, you tell the router to remove any matching file extensions,
and then parse what remains. If you want to create a URL such as
/page/title-of-page.html you would create your route using::

    Router::scope('/page', function ($routes) {
        $routes->extensions(['json', 'xml', 'html']);
        $routes->connect(
            '/:title',
            ['controller' => 'Pages', 'action' => 'view'],
            [
                'pass' => ['title']
            ]
        );
    });

Then to create links which map back to the routes simply use::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

File extensions are used by :doc:`/controllers/components/request-handling`
to do automatic view switching based on content types.

.. _resource-routes:

Creating RESTful Routes
=======================

Router makes it easy to generate RESTful routes for your controllers. RESTful
routes are helpful when you are creating API endpoints for your application.  If
we wanted to allow REST access to a recipe controller, we'd do something like
this::

    // In config/routes.php...

    Router::scope('/', function ($routes) {
        $routes->extensions(['json']);
        $routes->resources('Recipes');
    });

The first line sets up a number of default routes for easy REST
access where method specifies the desired result format (e.g. xml,
json, rss). These routes are HTTP Request Method sensitive.

=========== ===================== ==============================
HTTP format URL.format            Controller action invoked
=========== ===================== ==============================
GET         /recipes.format       RecipesController::index()
----------- --------------------- ------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- ------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- ------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
PATCH       /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
=========== ===================== ==============================

CakePHP's Router class uses a number of different indicators to
detect the HTTP method being used. Here they are in order of
preference:

#. The \_method POST variable
#. The X\_HTTP\_METHOD\_OVERRIDE
#. The REQUEST\_METHOD header

The \_method POST variable is helpful in using a browser as a
REST client (or anything else that can do POST). Just set
the value of \_method to the name of the HTTP request method you
wish to emulate.

Creating Nested Resource Routes
-------------------------------

Once you have connected resources in a scope, you can connect routes for
sub-resources as well. Sub-resource routes will be prepended by the original
resource name and a id parameter. For example::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments');
        });
    });

Will generate resource routes for both ``articles`` and ``comments``. The
comments routes will look like::

    /api/articles/:article_id/comments
    /api/articles/:article_id/comments/:id

You can get the ``article_id`` in ``CommentsController`` by::

    $this->request->getParam('article_id');

By default resource routes map to the same prefix as the containing scope. If
you have both nested and non-nested resource controllers you can use a different
controller in each context by using prefixes::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments', ['prefix' => 'articles']);
        });
    });

The above would map the 'Comments' resource to the
``App\Controller\Articles\CommentsController``. Having separate controllers lets
you keep your controller logic simpler. The prefixes created this way are
compatible with :ref:`prefix-routing`.

.. note::

    While you can nest resources as deeply as you require, it is not recommended
    to nest more than 2 resources together.

.. versionadded:: 3.3
    The ``prefix`` option was added to ``resources()`` in 3.3.

Limiting the Routes Created
---------------------------

By default CakePHP will connect 6 routes for each resource. If you'd like to
only connect specific resource routes you can use the ``only`` option::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

Would create read only resource routes. The route names are ``create``,
``update``, ``view``, ``index``, and ``delete``.

Changing the Controller Actions Used
------------------------------------

You may need to change the controller action names that are used when connecting
routes. For example, if your ``edit()`` action is called ``put()`` you can
use the ``actions`` key to rename the actions used::

    $routes->resources('Articles', [
        'actions' => ['update' => 'put', 'create' => 'add']
    ]);

The above would use ``put()`` for the ``edit()`` action, and ``add()``
instead of ``create()``.

Mapping Additional Resource Routes
----------------------------------

You can map additional resource methods using the ``map`` option::

     $routes->resources('Articles', [
        'map' => [
            'deleteAll' => [
                'action' => 'deleteAll',
                'method' => 'DELETE'
            ]
        ]
     ]);
     // This would connect /articles/deleteAll

In addition to the default routes, this would also connect a route for
`/articles/delete_all`. By default the path segment will match the key name. You
can use the 'path' key inside the resource definition to customize the path
name::


    $routes->resources('Articles', [
        'map' => [
            'updateAll' => [
                'action' => 'updateAll',
                'method' => 'DELETE',
                'path' => '/update_many'
            ],
        ]
    ]);
    // This would connect /articles/update_many

If you define 'only' and 'map', make sure that your mapped methods are also in
the 'only' list.

.. _custom-rest-routing:

Custom Route Classes for Resource Routes
----------------------------------------

You can provide ``connectOptions`` key in the ``$options`` array for
``resources()`` to provide custom setting used by ``connect()``::

    Router::scope('/', function ($routes) {
        $routes->resources('Books', [
            'connectOptions' => [
                'routeClass' => 'ApiRoute',
            ]
        ];
    });

URL Inflection for Resource Routes
----------------------------------

By default, multi-worded controllers' URL fragments are the underscored
form of the controller's name. E.g., ``BlogPostsController``'s URL fragment
would be **/blog_posts**.

You can specify an alternative inflection type using the ``inflect`` option::

    Router::scope('/', function ($routes) {
        $routes->resources('BlogPosts', [
            'inflect' => 'dasherize' // Will use ``Inflector::dasherize()``
        ]);
    });

The above will generate URLs styled like: **/blog-posts/\***.

.. note::

    As of CakePHP 3.1 the official app skeleton uses ``DashedRoute`` as its
    default route class. Using the ``'inflect' => 'dasherize'`` option when
    connecting resource routes is recommended for URL consistency.

.. index:: passed arguments
.. _passed-arguments:

Passed Arguments
================

Passed arguments are additional arguments or path segments that are
used when making a request. They are often used to pass parameters
to your controller methods. ::

    http://localhost/calendars/view/recent/mark

In the above example, both ``recent`` and ``mark`` are passed arguments to
``CalendarsController::view()``. Passed arguments are given to your controllers
in three ways. First as arguments to the action method called, and secondly they
are available in ``$this->request->getParam('pass')`` as a numerically indexed
array. When using custom routes you can force particular parameters to go into
the passed arguments as well.

If you were to visit the previously mentioned URL, and you
had a controller action that looked like::

    class CalendarsController extends AppController
    {
        public function view($arg1, $arg2)
        {
            debug(func_get_args());
        }
    }

You would get the following output::

    Array
    (
        [0] => recent
        [1] => mark
    )

This same data is also available at ``$this->request->getParam('pass')`` in your
controllers, views, and helpers.  The values in the pass array are numerically
indexed based on the order they appear in the called URL::

    debug($this->request->getParam('pass'));

Either of the above would output::

    Array
    (
        [0] => recent
        [1] => mark
    )

When generating URLs, using a :term:`routing array` you add passed
arguments as values without string keys in the array::

    ['controller' => 'Articles', 'action' => 'view', 5]

Since ``5`` has a numeric key, it is treated as a passed argument.

Generating URLs
===============

.. php:staticmethod:: url($url = null, $full = false)

Generating URLs or Reverse routing is a feature in CakePHP that is used to
allow you to change your URL structure without having to modify all your
code. By using :term:`routing arrays <routing array>` to define your URLs, you
can later configure routes and the generated URLs will automatically update.

If you create URLs using strings like::

    $this->Html->link('View', '/articles/view/' . $id);

And then later decide that ``/articles`` should really be called
'posts' instead, you would have to go through your entire
application renaming URLs. However, if you defined your link like::

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

Then when you decided to change your URLs, you could do so by defining a
route. This would change both the incoming URL mapping, as well as the
generated URLs.

When using array URLs, you can define both query string parameters and
document fragments using special keys::

    Router::url([
        'controller' => 'Articles',
        'action' => 'index',
        '?' => ['page' => 1],
        '#' => 'top'
    ]);

    // Will generate a URL like.
    /articles/index?page=1#top

Router will also convert any unknown parameters in a routing array to
querystring parameters.  The ``?`` is offered for backwards compatibility with
older versions of CakePHP.

You can also use any of the special route elements when generating URLs:

* ``_ext`` Used for :ref:`file-extensions` routing.
* ``_base`` Set to ``false`` to remove the base path from the generated URL. If
  your application is not in the root directory, this can be used to generate
  URLs that are 'cake relative'.
* ``_scheme``  Set to create links on different schemes like ``webcal`` or
  ``ftp``. Defaults to the current scheme.
* ``_host`` Set the host to use for the link.  Defaults to the current host.
* ``_port`` Set the port if you need to create links on non-standard ports.
* ``_full``  If ``true`` the ``FULL_BASE_URL`` constant will be prepended to
  generated URLs.
* ``_ssl`` Set to ``true`` to convert the generated URL to https or ``false``
  to force http.
* ``_name`` Name of route. If you have setup named routes, you can use this key
  to specify it.

.. _redirect-routing:

Redirect Routing
================

Redirect routing allows you to issue HTTP status 30x redirects for
incoming routes, and point them at different URLs. This is useful
when you want to inform client applications that a resource has moved
and you don't want to expose two URLs for the same content.

Redirection routes are different from normal routes as they perform an actual
header redirection if a match is found. The redirection can occur to
a destination within your application or an outside location::

    Router::scope('/', function ($routes) {
        $routes->redirect(
            '/home/*',
            ['controller' => 'Articles', 'action' => 'view'],
            ['persist' => true]
            // Or ['persist'=>['id']] for default routing where the
            // view action expects $id as an argument.
        );
    })

Redirects ``/home/*`` to ``/articles/view`` and passes the parameters to
``/articles/view``. Using an array as the redirect destination allows
you to use other routes to define where a URL string should be
redirected to. You can redirect to external locations using
string URLs as the destination::

    Router::scope('/', function ($routes) {
        $routes->redirect('/articles/*', 'http://google.com', ['status' => 302]);
    });

This would redirect ``/articles/*`` to ``http://google.com`` with a
HTTP status of 302.

.. _custom-route-classes:

Custom Route Classes
====================

Custom route classes allow you to extend and change how individual routes parse
requests and handle reverse routing. Route classes have a few conventions:

* Route classes are expected to be found in the ``Routing\\Route`` namespace of
  your application or plugin.
* Route classes should extend :php:class:`Cake\\Routing\\Route`.
* Route classes should implement one or both of ``match()`` and/or ``parse()``.

The ``parse()`` method is used to parse an incoming URL. It should generate an
array of request parameters that can be resolved into a controller & action.
Return ``false`` from this method to indicate a match failure.

The ``match()`` method is used to match an array of URL parameters and create a
string URL. If the URL parameters do not match the route ``false`` should be
returned.

You can use a custom route class when making a route by using the ``routeClass``
option::

    $routes->connect(
         '/:slug',
         ['controller' => 'Articles', 'action' => 'view'],
         ['routeClass' => 'SlugRoute']
    );

This route would create an instance of ``SlugRoute`` and allow you
to implement custom parameter handling. You can use plugin route classes using
standard :term:`plugin syntax`.

Default Route Class
-------------------

.. php:staticmethod:: defaultRouteClass($routeClass = null)

If you want to use an alternate route class for all your routes besides the
default ``Route``, you can do so by calling ``Router::defaultRouteClass()``
before setting up any routes and avoid having to specify the ``routeClass``
option for each route. For example using::

    use Cake\Routing\Route\InflectedRoute;

    Router::defaultRouteClass(InflectedRoute::class);

will cause all routes connected after this to use the ``InflectedRoute`` route class.
Calling the method without an argument will return current default route class.

Fallbacks Method
----------------

.. php:method:: fallbacks($routeClass = null)

The fallbacks method is a simple shortcut for defining default routes. The
method uses the passed routing class for the defined rules or if no class is
provided the class returned by ``Router::defaultRouteClass()`` is used.

Calling fallbacks like so::

    use Cake\Routing\Route\DashedRoute;

    $routes->fallbacks(DashedRoute::class);

Is equivalent to the following explicit calls::

    use Cake\Routing\Route\DashedRoute;

    $routes->connect('/:controller', ['action' => 'index'], ['routeClass' => DashedRoute:class]);
    $routes->connect('/:controller/:action/*', [], ['routeClass' => DashedRoute:class]);

.. note::

    Using the default route class (``Route``) with fallbacks, or any route
    with ``:plugin`` and/or ``:controller`` route elements will result in
    inconsistent URL case.

Creating Persistent URL Parameters
==================================

You can hook into the URL generation process using URL filter functions. Filter
functions are called *before* the URLs are matched against the routes, this
allows you to prepare URLs before routing.

Callback filter functions should expect the following parameters:

- ``$params`` The URL params being processed.
- ``$request`` The current request.

The URL filter function should *always* return the params even if unmodified.

URL filters allow you to implement features like persistent parameters::

    Router::addUrlFilter(function ($params, $request) {
        if ($request->getParam('lang') && !isset($params['lang'])) {
            $params['lang'] = $request->getParam('lang');
        }
        return $params;
    });

Filter functions are applied in the order they are connected.

Another use case is changing a certain route on runtime (plugin routes for
example)::

    Router::addUrlFilter(function ($params, $request) {
        if (empty($params['plugin']) || $params['plugin'] !== 'MyPlugin' || empty($params['controller'])) {
            return $params;
        }
        if ($params['controller'] === 'Languages' && $params['action'] === 'view') {
            $params['controller'] = 'Locations';
            $params['action'] = 'index';
            $params['language'] = $params[0];
            unset($params[0]);
        }
        return $params;
    });

This will alter the following route::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Languages', 'action' => 'view', 'es']);

into this::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Locations', 'action' => 'index', 'language' => 'es']);

Handling Named Parameters in URLs
=================================

Although named parameters were removed in CakePHP 3.0, applications may have
published URLs containing them.  You can continue to accept URLs containing
named parameters.

In your controller's ``beforeFilter()`` method you can call
``parseNamedParams()`` to extract any named parameters from the passed
arguments::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        Router::parseNamedParams($this->request);
    }

This will populate ``$this->request->getParam('named')`` with any named parameters
found in the passed arguments.  Any passed argument that was interpreted as a
named parameter, will be removed from the list of passed arguments.

.. toctree::
    :glob:
    :maxdepth: 1

    /development/dispatch-filters

.. meta::
    :title lang=en: Routing
    :keywords lang=en: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
