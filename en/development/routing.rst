Routing
#######

.. php:namespace:: Cake\Routing

.. php:class:: RouterBuilder

Routing provides you tools that map URLs to controller actions. By defining
routes, you can separate how your application is implemented from how its URLs
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
this to your **config/routes.php** file::

    /** @var \Cake\Routing\RouteBuilder $routes */
    $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);

This will execute the index method in the ``ArticlesController`` when the
homepage of your site is visited. Sometimes you need dynamic routes that will
accept multiple parameters, this would be the case, for example of a route for
viewing an article's content::

    $routes->connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

The above route will accept any URL looking like ``/articles/15`` and invoke the
method ``view(15)`` in the ``ArticlesController``. This will not, though,
prevent people from trying to access URLs looking like ``/articles/foobar``. If
you wish, you can restrict some parameters to conform to a regular expression::

    // Using fluent interface
    $routes->connect(
        '/articles/{id}',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    ->setPatterns(['id' => '\d+'])
    ->setPass(['id']);

    // Using options array
    $routes->connect(
        '/articles/{id}',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    );

The previous example changed the star matcher by a new placeholder ``{id}``.
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

    // In routes.php
    $routes->connect(
        '/upgrade',
        ['controller' => 'Subscriptions', 'action' => 'create'],
        ['_name' => 'upgrade']
    );

    use Cake\Routing\Router;

    echo Router::url(['_name' => 'upgrade']);
    // Will output
    /upgrade

To help keep your routing code DRY, the Router has the concept of 'scopes'.
A scope defines a common path segment, and optionally route defaults. Any routes
connected inside a scope will inherit the path/defaults from their wrapping
scopes::

    $routes->scope('/blog', ['plugin' => 'Blog'], function (RouteBuilder $routes) {
        $routes->connect('/', ['controller' => 'Articles']);
    });

The above route would match ``/blog/`` and send it to
``Blog\Controller\ArticlesController::index()``.

The application skeleton comes with a few routes to get you started. Once you've
added your own routes, you can remove the default routes if you don't need them.

.. index:: {controller}, {action}, {plugin}
.. index:: greedy star, trailing star
.. _connecting-routes:
.. _routes-configuration:

Connecting Routes
=================

To keep your code :term:`DRY` you should use 'routing scopes'. Routing
scopes not only let you keep your code DRY, they also help Router optimize its
operation. This method defaults to the ``/`` scope. To create a scope and connect
some routes we'll use the ``scope()`` method::

    // In config/routes.php
    use Cake\Routing\RouteBuilder;
    use Cake\Routing\Route\DashedRoute;

    $routes->scope('/', function (RouteBuilder $routes) {
        // Connect the generic fallback routes.
        $routes->fallbacks(DashedRoute::class);
    });

The ``connect()`` method takes up to three parameters: the URL template you wish
to match, the default values for your route elements, and the options for the
route. Options frequently include regular expression rules to help the router
match elements in the URL.

The basic format for a route definition is::

    $routes->connect(
        '/url/template',
        ['targetKey' => 'targetValue'],
        ['option' => 'matchingRegex']
    );

The first parameter is used to tell the router what sort of URL you're trying to
control. The URL is a normal slash delimited string, but can also contain
a wildcard (\*) or :ref:`route-elements`.  Using a wildcard tells the router
that you are willing to accept any additional arguments supplied. Routes without
a \* only match the exact template pattern supplied.

Once you've specified a URL, you use the last two parameters of ``connect()`` to
tell CakePHP what to do with a request once it has been matched. The second
parameter defines the route 'target'. This can be defined either as an array, or
as a destination string. A few examples of route targets are::

    // Array target to an application controller
    $routes->connect(
        '/users/view/*',
        ['controller' => 'Users', 'action' => 'view']
    );
    $routes->connect('/users/view/*', 'Users::view');

    // Array target to a prefixed plugin controller
    $routes->connect(
        '/admin/cms/articles',
        ['prefix' => 'Admin', 'plugin' => 'Cms', 'controller' => 'Articles', 'action' => 'index']
    );
    $routes->connect('/admin/cms/articles', 'Cms.Admin/Articles::index');

The first route we connect matches URLs starting with ``/users/view`` and maps
those requests to the ``UsersController->view()``. The trailing ``/*`` tells the
router to pass any additional segments as method arguments. For example,
``/users/view/123`` would map to ``UsersController->view(123)``.

The above example also illustrates string targets. String targets provide
a compact way to define a route's destination. String targets have the following
syntax::

    [Plugin].[Prefix]/[Controller]::[action]

Some example string targets are::

    // Application controller
    'Articles::view'

    // Application controller with prefix
    Admin/Articles::view

    // Plugin controller
    Cms.Articles::edit

    // Prefixed plugin controller
    Vendor/Cms.Management/Admin/Articles::view

Earlier we used the greedy star (``/*``) to capture additional path segments,
there is also the trailing star (``/**``). Using a trailing double star,
will capture the remainder of a URL as a single passed argument. This is useful
when you want to use an argument that included a ``/`` in it::

    $routes->connect(
        '/pages/**',
        ['controller' => 'Pages', 'action' => 'show']
    );

The incoming URL of ``/pages/the-example-/-and-proof`` would result in a single
passed argument of ``the-example-/-and-proof``.

The second parameter of ``connect()`` can define any parameters that
compose the default route parameters::

    $routes->connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );

This example uses the second parameter of ``connect()`` to
define default parameters. If you built an application that features products for
different categories of customers, you might consider creating a route. This
allows you to link to ``/government`` rather than ``/pages/display/5``.

A common use for routing is to rename controllers and their actions. Instead of
accessing our users controller at ``/users/some-action/5``, we'd like to be able
to access it through ``/cooks/some-action/5``. The following route takes care of
that::

    $routes->connect(
        '/cooks/{action}/*', ['controller' => 'Users']
    );

This is telling the Router that any URL beginning with ``/cooks/`` should be
sent to the ``UsersController``. The action called will depend on the value of
the ``{action}`` parameter. By using :ref:`route-elements`, you can create
variable routes, that accept user input or variables. The above route also uses
the greedy star.  The greedy star indicates that this route should accept any
additional positional arguments given. These arguments will be made available in
the :ref:`passed-arguments` array.

When generating URLs, routes are used too. Using
``['controller' => 'Users', 'action' => 'some-action', 5]`` as
a URL will output ``/cooks/some-action/5`` if the above route is the
first match found.

The routes we've connected so far will match any HTTP verb. If you are building
a REST API you'll often want to map HTTP actions to different controller methods.
The ``RouteBuilder`` provides helper methods that make defining routes for
specific HTTP verbs simpler::

    // Create a route that only responds to GET requests.
    $routes->get(
        '/cooks/{id}',
        ['controller' => 'Users', 'action' => 'view'],
        'users:view'
    );

    // Create a route that only responds to PUT requests
    $routes->put(
        '/cooks/{id}',
        ['controller' => 'Users', 'action' => 'update'],
        'users:update'
    );

The above routes map the same URL to different controller actions based on the
HTTP verb used. GET requests will go to the 'view' action, while PUT requests
will go to the 'update' action. There are HTTP helper methods for:

* GET
* POST
* PUT
* PATCH
* DELETE
* OPTIONS
* HEAD

All of these methods return the route instance allowing you to leverage the
:ref:`fluent setters <route-fluent-methods>` to further configure your route.

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
        '/{controller}/{id}',
        ['action' => 'view']
    )->setPatterns(['id' => '[0-9]+']);

    $routes->connect(
        '/{controller}/{id}',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

The above example illustrates how to create a quick way to view
models from any controller by crafting a URL that looks like
``/controller-name/{id}``. The URL provided to ``connect()`` specifies two
route elements: ``{controller}`` and ``{id}``. The ``{controller}`` element
is a CakePHP default route element, so the router knows how to match and
identify controller names in URLs. The ``{id}`` element is a custom
route element, and must be further clarified by specifying a
matching regular expression in the third parameter of ``connect()``.

CakePHP does not automatically produce lowercased and dashed URLs when using the
``{controller}`` parameter. If you need this, the above example could be
rewritten like so::

    use Cake\Routing\Route\DashedRoute;

    // Create a builder with a different route class.
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setRouteClass(DashedRoute::class);
        $routes->connect('/{controller}/{id}', ['action' => 'view'])
            ->setPatterns(['id' => '[0-9]+']);

        $routes->connect(
            '/{controller}/{id}',
            ['action' => 'view'],
            ['id' => '[0-9]+']
        );
    });

The ``DashedRoute`` class will make sure that the ``{controller}`` and
``{plugin}`` parameters are correctly lowercased and dashed.

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

    $routes->connect('/{action}', ['controller' => 'Home']);

If you would like to provide a case insensitive URL, you can use regular
expression inline modifiers::

    $routes->connect(
        '/{userShortcut}',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
    )->setPatterns(['userShortcut' => '(?i:principal)']);

One more example, and you'll be a routing pro::

    $routes->connect(
        '/{controller}/{year}/{month}/{day}',
        ['action' => 'index']
    )->setPatterns([
        'year' => '[12][0-9]{3}',
        'month' => '0[1-9]|1[012]',
        'day' => '0[1-9]|[12][0-9]|3[01]'
    ]);

This is rather involved, but shows how powerful routes can be. The URL supplied
has four route elements. The first is familiar to us: it's a default route
element that tells CakePHP to expect a controller name.

Next, we specify some default values. Regardless of the controller,
we want the ``index()`` action to be called.

Finally, we specify some regular expressions that will match years,
months and days in numerical form. Note that parenthesis (capturing groups)
are not supported in the regular expressions. You can still specify
alternates, as above, but not grouped with parenthesis.

Once defined, this route will match ``/articles/2007/02/01``,
``/articles/2004/11/16``, handing the requests to
the ``index()`` actions of their respective controllers, with the date
parameters in ``$this->request->getParam()``.

Reserved Route Elements
-----------------------

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
* ``_full``  If ``true`` the value of ``App.fullBaseUrl`` mentioned in
  :ref:`general-configuration` will be prepended to generated URLs.
* ``#`` Allows you to set URL hash fragments.
* ``_https`` Set to ``true`` to convert the generated URL to https or ``false``
  to force http. Prior to 4.5.0 use ``_ssl``.
* ``_method`` Define the HTTP verb/method to use. Useful when working with
  :ref:`resource-routes`.
* ``_name`` Name of route. If you have setup named routes, you can use this key
  to specify it.

.. _route-fluent-methods:

Configuring Route Options
-------------------------

There are a number of route options that can be set on each route. After
connecting a route you can use its fluent builder methods to further configure
the route. These methods replace many of the keys in the ``$options`` parameter
of ``connect()``::

    $routes->connect(
        '/{lang}/articles/{slug}',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    // Allow GET and POST requests.
    ->setMethods(['GET', 'POST'])

    // Only match on the blog subdomain.
    ->setHost('blog.example.com')

    // Set the route elements that should be converted to passed arguments
    ->setPass(['slug'])

    // Set the matching patterns for route elements
    ->setPatterns([
        'slug' => '[a-z0-9-_]+',
        'lang' => 'en|fr|es',
    ])

    // Also allow JSON file extensions
    ->setExtensions(['json'])

    // Set lang to be a persistent parameter
    ->setPersist(['lang']);

Passing Parameters to Action
----------------------------

When connecting routes using :ref:`route-elements` you may want to have routed
elements be passed arguments instead. The ``pass`` option indicates which route
elements should also be made available as arguments passed into the controller
functions::

    // src/Controller/BlogsController.php
    public function view($articleId = null, $slug = null)
    {
        // Some code here...
    }

    // routes.php
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->connect(
            '/blog/{id}-{slug}', // For example, /blog/3-CakePHP_Rocks
            ['controller' => 'Blogs', 'action' => 'view']
        )
        // Define the route elements in the route template
        // to prepend as function arguments. Order matters as this
        // will pass the `$id` and `$slug` elements as the first and
        // second parameters. Any additional passed parameters in your
        // route will be added after the setPass() arguments.
        ->setPass(['id', 'slug'])
        // Define a pattern that `id` must match.
        ->setPatterns([
            'id' => '[0-9]+',
        ]);
    });

Now thanks to the reverse routing capabilities, you can pass in the URL array
like below and CakePHP will know how to form the URL as defined in the routes::

    // view.php
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

.. _path-routing:

Using Path Routing
------------------

We talked about string targets above. The same also works for URL generation using
``Router::pathUrl()``::

    echo Router::pathUrl('Articles::index');
    // outputs: /articles

    echo Router::pathUrl('MyBackend.Admin/Articles::view', [3]);
    // outputs: /admin/my-backend/articles/view/3

.. tip::

    IDE support for Path Routing autocomplete can be enabled with `CakePHP IdeHelper Plugin <https://github.com/dereuromark/cakephp-ide-helper>`_.

.. _named-routes:

Using Named Routes
------------------

Sometimes you'll find typing out all the URL parameters for a route too verbose,
or you'd like to take advantage of the performance improvements that named
routes have. When connecting routes you can specify a ``_name`` option, this
option can be used in reverse routing to identify the route you want to use::

    // Connect a route with a name.
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // Name a verb specific route
    $routes->post(
        '/logout',
        ['controller' => 'Users', 'action' => 'logout'],
        'logout'
    );

    // Generate a URL using a named route.
    $url = Router::url(['_name' => 'logout']);

    // Generate a URL using a named route,
    // with some query string args.
    $url = Router::url(['_name' => 'login', 'username' => 'jimmy']);

If your route template contains any route elements like ``{controller}`` you'll
need to supply those as part of the options to ``Router::url()``.

.. note::

    Route names must be unique across your entire application. The same
    ``_name`` cannot be used twice, even if the names occur inside a different
    routing scope.

When building named routes, you will probably want to stick to some conventions
for the route names. CakePHP makes building up route names easier by allowing
you to define name prefixes in each scope::

    $routes->scope('/api', ['_namePrefix' => 'api:'], function (RouteBuilder $routes) {
        // This route's name will be `api:ping`
        $routes->get('/ping', ['controller' => 'Pings'], 'ping');
    });
    // Generate a URL for the ping route
    Router::url(['_name' => 'api:ping']);

    // Use namePrefix with plugin()
    $routes->plugin('Contacts', ['_namePrefix' => 'contacts:'], function (RouteBuilder $routes) {
        // Connect routes.
    });

    // Or with prefix()
    $routes->prefix('Admin', ['_namePrefix' => 'admin:'], function (RouteBuilder $routes) {
        // Connect routes.
    });

You can also use the ``_namePrefix`` option inside nested scopes and it works as
you'd expect::

    $routes->plugin('Contacts', ['_namePrefix' => 'contacts:'], function (RouteBuilder $routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function (RouteBuilder $routes) {
            // This route's name will be `contacts:api:ping`
            $routes->get('/ping', ['controller' => 'Pings'], 'ping');
        });
    });

    // Generate a URL for the ping route
    Router::url(['_name' => 'contacts:api:ping']);

Routes connected in named scopes will only have names added if the route is also
named. Nameless routes will not have the ``_namePrefix`` applied to them.

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

    $routes->prefix('Admin', function (RouteBuilder $routes) {
        // All routes here will be prefixed with `/admin`, and
        // have the `'prefix' => 'Admin'` route element added that
        // will be required when generating URLs for these routes
        $routes->fallbacks(DashedRoute::class);
    });

Prefixes are mapped to sub-namespaces in your application's ``Controller``
namespace. By having prefixes as separate controllers you can create smaller and
simpler controllers. Behavior that is common to the prefixed and non-prefixed
controllers can be encapsulated using inheritance,
:doc:`/controllers/components`, or traits.  Using our users example, accessing
the URL ``/admin/users/edit/5`` would call the ``edit()`` method of our
**src/Controller/Admin/UsersController.php** passing 5 as the first parameter.
The view file used would be **templates/Admin/Users/edit.php**

You can map the URL /admin to your ``index()`` action of pages controller using
following route::

    $routes->prefix('Admin', function (RouteBuilder $routes) {
        // Because you are in the admin scope,
        // you do not need to include the /admin prefix
        // or the Admin route element.
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

When creating prefix routes, you can set additional route parameters using
the ``$options`` argument::

    $routes->prefix('Admin', ['param' => 'value'], function (RouteBuilder $routes) {
        // Routes connected here are prefixed with '/admin' and
        // have the 'param' routing key set.
        $routes->connect('/{controller}');
    });

Note the additional route parameters will be added to all the connected routes defined
inside the prefix block. You will need to use all the parameters in the url array to
build the route later, if you don't use them you'll get a ``MissingRouteException``.

Multi word prefixes are by default converted using dasherize inflection, ie ``MyPrefix``
would be mapped to ``my-prefix`` in the URL. Make sure to set a path for such prefixes
if you want to use a different format like for example underscoring::

    $routes->prefix('MyPrefix', ['path' => '/my_prefix'], function (RouteBuilder $routes) {
        // Routes connected here are prefixed with '/my_prefix'
        $routes->connect('/{controller}');
    });

You can define prefixes inside plugin scopes as well::

    $routes->plugin('DebugKit', function (RouteBuilder $routes) {
        $routes->prefix('Admin', function (RouteBuilder $routes) {
            $routes->connect('/{controller}');
        });
    });

The above would create a route template like ``/debug-kit/admin/{controller}``.
The connected route would have the ``plugin`` and ``prefix`` route elements set.

When defining prefixes, you can nest multiple prefixes if necessary::

    $routes->prefix('Manager', function (RouteBuilder $routes) {
        $routes->prefix('Admin', function (RouteBuilder $routes) {
            $routes->connect('/{controller}/{action}');
        });
    });

The above would create a route template like ``/manager/admin/{controller}/{action}``.
The connected route would have the ``prefix`` route element set to
``Manager/Admin``.

The current prefix will be available from the controller methods through
``$this->request->getParam('prefix')``

When using prefix routes it's important to set the ``prefix`` option, and to
use the same CamelCased format that is used in the ``prefix()`` method. Here's
how to build this link using the HTML helper::

    // Go into a prefixed route.
    echo $this->Html->link(
        'Manage articles',
        ['prefix' => 'Manager/Admin', 'controller' => 'Articles', 'action' => 'add']
    );

    // Leave a prefix
    echo $this->Html->link(
        'View Post',
        ['prefix' => false, 'controller' => 'Articles', 'action' => 'view', 5]
    );

.. index:: plugin routing

Creating Links to Prefix Routes
-------------------------------

You can create links that point to a prefix, by adding the prefix key to your
URL array::

    echo $this->Html->link(
        'New admin todo',
        ['prefix' => 'Admin', 'controller' => 'TodoItems', 'action' => 'create']
    );

When using nesting, you need to chain them together::

    echo $this->Html->link(
        'New todo',
        ['prefix' => 'Admin/MyPrefix', 'controller' => 'TodoItems', 'action' => 'create']
    );

This would link to a controller with the namespace ``App\Controller\Admin\MyPrefix`` and the file path
``src/Controller/Admin/MyPrefix/TodoItemsController.php``.

.. note::

    The prefix is always CamelCased here, even if the routing result is dashed.
    The route itself will do the inflection if necessary.

Plugin Routing
--------------

.. php:staticmethod:: plugin($name, $options = [], $callback)

Routes for :doc:`/plugins` should be created using the ``plugin()``
method. This method creates a new routing scope for the plugin's routes::

    $routes->plugin('DebugKit', function (RouteBuilder $routes) {
        // Routes connected here are prefixed with '/debug-kit' and
        // have the plugin route element set to 'DebugKit'.
        $routes->connect('/{controller}');
    });

When creating plugin scopes, you can customize the path element used with the
``path`` option::

    $routes->plugin('DebugKit', ['path' => '/debugger'], function (RouteBuilder $routes) {
        // Routes connected here are prefixed with '/debugger' and
        // have the plugin route element set to 'DebugKit'.
        $routes->connect('/{controller}');
    });

When using scopes you can nest plugin scopes within prefix scopes::

    $routes->prefix('Admin', function (RouteBuilder $routes) {
        $routes->plugin('DebugKit', function (RouteBuilder $routes) {
            $routes->connect('/{controller}');
        });
    });

The above would create a route that looks like ``/admin/debug-kit/{controller}``.
It would have the ``prefix``, and ``plugin`` route elements set. The
:ref:`plugin-routes` section has more information on building plugin routes.

Creating Links to Plugin Routes
-------------------------------

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

By setting ``'plugin' => null`` you tell the Router that you want to
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

    $routes->plugin('ToDo', ['path' => 'to-do'], function (RouteBuilder $routes) {
        $routes->fallbacks(DashedRoute::class);
    });

Matching Specific HTTP Methods
------------------------------

Routes can match specific HTTP methods using the HTTP verb helper methods::

    $routes->scope('/', function (RouteBuilder $routes) {
        // This route only matches on POST requests.
        $routes->post(
            '/reviews/start',
            ['controller' => 'Reviews', 'action' => 'start']
        );

        // Match multiple verbs
        $routes->connect(
            '/reviews/start',
            [
                'controller' => 'Reviews',
                'action' => 'start',
            ]
        )->setMethods(['POST', 'PUT']);
    });

You can match multiple HTTP methods by using an array. Because the ``_method``
parameter is a routing key, it participates in both URL parsing and URL
generation. To generate URLs for method specific routes you'll need to include
the ``_method`` key when generating the URL::

    $url = Router::url([
        'controller' => 'Reviews',
        'action' => 'start',
        '_method' => 'POST',
    ]);

Matching Specific Hostnames
---------------------------

Routes can use the ``_host`` option to only match specific hosts. You can use
the ``*.`` wildcard to match any subdomain::

    $routes->scope('/', function (RouteBuilder $routes) {
        // This route only matches on http://images.example.com
        $routes->connect(
            '/images/default-logo.png',
            ['controller' => 'Images', 'action' => 'default']
        )->setHost('images.example.com');

        // This route only matches on http://*.example.com
        $routes->connect(
            '/images/old-logo.png',
            ['controller' => 'Images', 'action' => 'oldLogo']
        )->setHost('*.example.com');
    });

The ``_host`` option is also used in URL generation. If your ``_host`` option
specifies an exact domain, that domain will be included in the generated URL.
However, if you use a wildcard, then you will need to provide the ``_host``
parameter when generating URLs::

    // If you have this route
    $routes->connect(
        '/images/old-logo.png',
        ['controller' => 'Images', 'action' => 'oldLogo']
    )->setHost('images.example.com');

    // You need this to generate a url
    echo Router::url([
        'controller' => 'Images',
        'action' => 'oldLogo',
        '_host' => 'images.example.com',
    ]);

.. index:: file extensions
.. _file-extensions:

Routing File Extensions
-----------------------

.. php:staticmethod:: extensions(string|array|null $extensions, $merge = true)

To handle different file extensions in your URLs, you can define the extensions
using the :php:meth:`Cake\\Routing\\RouteBuilder::setExtensions()` method::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setExtensions(['json', 'xml']);
    });

This will enable the named extensions for all routes that are being connected in
that scope **after** the ``setExtensions()`` call, including those that are being
connected in nested scopes.

.. note::

    Setting the extensions should be the first thing you do in a scope, as the
    extensions will only be applied to routes connected **after** the extensions
    are set.

    Also be aware that re-opened scopes will **not** inherit extensions defined in
    previously opened scopes.

By using extensions, you tell the router to remove any matching file extensions
from the URL, and then parse what remains. If you want to create a URL such as
/page/title-of-page.html you would create your route using::

    $routes->scope('/page', function (RouteBuilder $routes) {
        $routes->setExtensions(['json', 'xml', 'html']);
        $routes->connect(
            '/{title}',
            ['controller' => 'Pages', 'action' => 'view']
        )->setPass(['title']);
    });

Then to create links which map back to the routes simply use::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

.. _route-scoped-middleware:

Route Scoped Middleware
=======================

While Middleware can be applied to your entire application, applying middleware
to specific routing scopes offers more flexibility, as you can apply middleware
only where it is needed allowing your middleware to not concern itself with
how/where it is being applied.

.. note::

    Applied scoped middleware will be run by :ref:`RoutingMiddleware <routing-middleware>`,
    normally at the end of your application's middleware queue.

Before middleware can be applied to a scope, it needs to be
registered into the route collection::

    // in config/routes.php
    use Cake\Http\Middleware\CsrfProtectionMiddleware;
    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
    $routes->registerMiddleware('cookies', new EncryptedCookieMiddleware());

Once registered, scoped middleware can be applied to specific
scopes::

    $routes->scope('/cms', function (RouteBuilder $routes) {
        // Enable CSRF & cookies middleware
        $routes->applyMiddleware('csrf', 'cookies');
        $routes->get('/articles/{action}/*', ['controller' => 'Articles']);
    });

In situations where you have nested scopes, inner scopes will inherit the
middleware applied in the containing scope::

    $routes->scope('/api', function (RouteBuilder $routes) {
        $routes->applyMiddleware('ratelimit', 'auth.api');
        $routes->scope('/v1', function (RouteBuilder $routes) {
            $routes->applyMiddleware('v1compat');
            // Define routes here.
        });
    });

In the above example, the routes defined in ``/v1`` will have 'ratelimit',
'auth.api', and 'v1compat' middleware applied. If you re-open a scope, the
middleware applied to routes in each scope will be isolated::

    $routes->scope('/blog', function (RouteBuilder $routes) {
        $routes->applyMiddleware('auth');
        // Connect the authenticated actions for the blog here.
    });
    $routes->scope('/blog', function (RouteBuilder $routes) {
        // Connect the public actions for the blog here.
    });

In the above example, the two uses of the ``/blog`` scope do not share
middleware. However, both of these scopes will inherit middleware defined in
their enclosing scopes.

Grouping Middleware
-------------------

To help keep your route code :abbr:`DRY (Do not Repeat Yourself)` middleware can
be combined into groups. Once combined groups can be applied like middleware
can::

    $routes->registerMiddleware('cookie', new EncryptedCookieMiddleware());
    $routes->registerMiddleware('auth', new AuthenticationMiddleware());
    $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
    $routes->middlewareGroup('web', ['cookie', 'auth', 'csrf']);

    // Apply the group
    $routes->applyMiddleware('web');

.. _resource-routes:

RESTful Routing
===============

Router helps generate RESTful routes for your controllers. RESTful routes are
helpful when you are creating API endpoints for your application. If we wanted
to allow REST access to a recipe controller, we'd do something like this::

    // In config/routes.php...

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setExtensions(['json']);
        $routes->resources('Recipes');
    });

The first line sets up a number of default routes for REST
access where method specifies the desired result format, for example, xml,
json and rss. These routes are HTTP Request Method sensitive.

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

.. note::

    The default for pattern for resource IDs only matches integers or UUIDs.
    If your IDs are different you will have to supply a regular expression pattern
    via the  ``id`` option, for example, ``$builder->resources('Recipes', ['id' => '.*'])``.

The HTTP method being used is detected from a few different sources.
The sources in order of preference are:

#. The ``_method`` POST variable
#. The ``X_HTTP_METHOD_OVERRIDE`` header.
#. The ``REQUEST_METHOD`` header

The ``_method`` POST variable is helpful in using a browser as a
REST client (or anything else that can do POST). Just set
the value of ``_method`` to the name of the HTTP request method you
wish to emulate.

Creating Nested Resource Routes
-------------------------------

Once you have connected resources in a scope, you can connect routes for
sub-resources as well. Sub-resource routes will be prepended by the original
resource name and a id parameter. For example::

    $routes->scope('/api', function (RouteBuilder $routes) {
        $routes->resources('Articles', function (RouteBuilder $routes) {
            $routes->resources('Comments');
        });
    });

Will generate resource routes for both ``articles`` and ``comments``. The
comments routes will look like::

    /api/articles/{article_id}/comments
    /api/articles/{article_id}/comments/{id}

You can get the ``article_id`` in ``CommentsController`` by::

    $this->request->getParam('article_id');

By default resource routes map to the same prefix as the containing scope. If
you have both nested and non-nested resource controllers you can use a different
controller in each context by using prefixes::

    $routes->scope('/api', function (RouteBuilder $routes) {
        $routes->resources('Articles', function (RouteBuilder $routes) {
            $routes->resources('Comments', ['prefix' => 'Articles']);
        });
    });

The above would map the 'Comments' resource to the
``App\Controller\Articles\CommentsController``. Having separate controllers lets
you keep your controller logic simpler. The prefixes created this way are
compatible with :ref:`prefix-routing`.

.. note::

    While you can nest resources as deeply as you require, it is not recommended
    to nest more than 2 resources together.

Limiting the Routes Created
---------------------------

By default CakePHP will connect 6 routes for each resource. If you'd like to
only connect specific resource routes you can use the ``only`` option::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

Would create read only resource routes. The route names are ``create``,
``update``, ``view``, ``index``, and ``delete``.

The default **route name and controller action used** are as follows:

=========== =======================
Route name  Controller action used
=========== =======================
create      add
----------- -----------------------
update      edit
----------- -----------------------
view        view
----------- -----------------------
index       index
----------- -----------------------
delete      delete
=========== =======================


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
`/articles/delete-all`. By default the path segment will match the key name. You
can use the 'path' key inside the resource definition to customize the path
name::

    $routes->resources('Articles', [
        'map' => [
            'updateAll' => [
                'action' => 'updateAll',
                'method' => 'PUT',
                'path' => '/update-many',
            ],
        ],
    ]);
    // This would connect /articles/update-many

If you define 'only' and 'map', make sure that your mapped methods are also in
the 'only' list.

Prefixed Resource Routing
-------------------------

Resource routes can be connected to controllers in routing prefixes by
connecting routes within a prefixed scope or by using the ``prefix`` option::

    $routes->resources('Articles', [
        'prefix' => 'Api',
    ]);

.. _custom-rest-routing:

Custom Route Classes for Resource Routes
----------------------------------------

You can provide ``connectOptions`` key in the ``$options`` array for
``resources()`` to provide custom setting used by ``connect()``::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->resources('Books', [
            'connectOptions' => [
                'routeClass' => 'ApiRoute',
            ]
        ];
    });

URL Inflection for Resource Routes
----------------------------------

By default, multi-worded controllers' URL fragments are the dashed
form of the controller's name. For example, ``BlogPostsController``'s URL fragment
would be **/blog-posts**.

You can specify an alternative inflection type using the ``inflect`` option::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->resources('BlogPosts', [
            'inflect' => 'underscore' // Will use ``Inflector::underscore()``
        ]);
    });

The above will generate URLs styled like: **/blog_posts**.

Changing the Path Element
-------------------------

By default resource routes use an inflected form of the resource name for the
URL segment. You can set a custom URL segment with the ``path`` option::

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->resources('BlogPosts', ['path' => 'posts']);
    });

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
.. php:staticmethod:: reverse($params, $full = false)

Generating URLs or Reverse routing is a feature in CakePHP that is used to
allow you to change your URL structure without having to modify all your code.

If you create URLs using strings like::

    $this->Html->link('View', '/articles/view/' . $id);

And then later decide that ``/articles`` should really be called
'posts' instead, you would have to go through your entire
application renaming URLs. However, if you defined your link like::

    //`link()` uses Router::url() internally and accepts a routing array

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

or::

    //'Router::reverse()' operates on the request parameters array
    //and will produce a url string, valid input for `link()`

    $requestParams = Router::getRequest()->getAttribute('params');
    $this->Html->link('View', Router::reverse($requestParams));

Then when you decided to change your URLs, you could do so by defining a
route. This would change both the incoming URL mapping, as well as the
generated URLs.

The choice of technique is determined by how well you can predict the routing
array elements.

Using ``Router::url()``
-----------------------

``Router::url()`` allows you to use :term:`routing arrays <routing array>` in
situations where the array elements required are fixed or easily deduced.

It will provide reverse routing when the destination url is well defined::

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

It is also useful when the destination is unknown but follows a well
defined pattern::

    $this->Html->link(
        'View',
        ['controller' => $controller, 'action' => 'view', $id]
    );

Elements with numeric keys are treated as :ref:`passed-arguments`.

When using routing arrays, you can define both query string parameters and
document fragments using special keys::

    $routes->url([
        'controller' => 'Articles',
        'action' => 'index',
        '?' => ['page' => 1],
        '#' => 'top'
    ]);

    // Will generate a URL like.
    /articles/index?page=1#top

You can also use any of the special route elements when generating URLs:

* ``_ext`` Used for :ref:`file-extensions` routing.
* ``_base`` Set to ``false`` to remove the base path from the generated URL. If
  your application is not in the root directory, this can be used to generate
  URLs that are 'cake relative'.
* ``_scheme``  Set to create links on different schemes like ``webcal`` or
  ``ftp``. Defaults to the current scheme.
* ``_host`` Set the host to use for the link.  Defaults to the current host.
* ``_port`` Set the port if you need to create links on non-standard ports.
* ``_method`` Define the HTTP verb the URL is for.
* ``_full``  If ``true`` the value of ``App.fullBaseUrl`` mentioned in
  :ref:`general-configuration` will be prepended to generated URLs.
* ``_https`` Set to ``true`` to convert the generated URL to https or ``false``
  to force http. Prior to 4.5.0 use ``_ssl``
* ``_name`` Name of route. If you have setup named routes, you can use this key
  to specify it.

Using ``Router::reverse()``
---------------------------

``Router::reverse()`` allows you to use the :ref:`request-parameters` in cases
where the current URL with some modification is the basis for the destination
and the elements of the current URL are unpredictable.

As an example, imagine a blog that allowed users to create **Articles** and
**Comments**, and to mark both as either *published* or *draft*. Both the index
page URLs might include the user id. The **Comments** URL might also include
an article id to identify what article the comment refers to.

Here are urls for this scenario::

    /articles/index/42
    /comments/index/42/18

When the author uses these pages, it would be convenient to include links
that allow the page to be displayed with all results, published only,
or draft only.

To keep the code DRY, it would be best to include the links through
an element::

    // element/filter_published.php

    $params = $this->getRequest()->getAttribute('params');

    /* prepare url for Draft */
    $params = Hash::insert($params, '?.published', 0);
    echo $this->Html->link(__('Draft'), Router::reverse($params));

    /* Prepare url for Published */
    $params = Hash::insert($params, '?.published', 1);
    echo $this->Html->link(__('Published'), Router::reverse($params));

    /* Prepare url for All */
    $params = Hash::remove($params, '?.published');
    echo $this->Html->link(__('All'), Router::reverse($params));

The links generated by these method calls would include one or two pass
parameters depending on the structure of the current URL. And the code
would work for any future URL, for example, if you started using
pathPrefixes or if you added more pass parameters.

Routing Arrays vs Request Parameters
-------------------------------------

The significant difference between the two arrays and their use in these
reverse routing methods is in the way they include pass parameters.

Routing arrays include pass parameters as un-keyed values in the array::

    $url = [
        'controller' => 'Articles',
        'action' => 'View',
        $id, //a pass parameter
        'page' => 3, //a query argument
    ];

Request parameters include pass parameters on the 'pass' key of the array::

    $url = [
        'controller' => 'Articles',
        'action' => 'View',
        'pass' => [$id], //the pass parameters
        '?' => ['page' => 3], //the query arguments
    ];

So it is possible, if you wish, to convert the request parameters into
a routing array or vice versa.

.. _asset-routing:

Generating Asset URLs
=====================

The ``Asset`` class provides methods for generating URLs to your application's
css, javascript, images and other static asset files::

    use Cake\Routing\Asset;

    // Generate a URL to APP/webroot/js/app.js
    $js = Asset::scriptUrl('app.js');

    // Generate a URL to APP/webroot/css/app.css
    $css = Asset::cssUrl('app.css');

    // Generate a URL to APP/webroot/image/logo.png
    $img = Asset::imageUrl('logo.png');

    // Generate a URL to APP/webroot/files/upload/photo.png
    $file = Asset::url('files/upload/photo.png');

The above methods also accept an array of options as their second parameter:

* ``fullBase`` Append the full URL with domain name.
* ``pathPrefix`` Path prefix for relative URLs.
* ``plugin``` You can provide ``false``` to prevent paths from being treated as
  a plugin asset.
* ``timestamp`` Overrides the value of ``Asset.timestamp`` in Configure.  Set to
  ``false`` to skip timestamp generation.  Set to ``true`` to apply timestamps
  when debug is true. Set to ``'force'`` to always enable timestamping
  regardless of debug value.

::

    // Generates http://example.org/img/logo.png
    $img = Asset::url('logo.png', ['fullBase' => true]);

    // Generates /img/logo.png?1568563625
    // Where the timestamp is the last modified time of the file.
    $img = Asset::url('logo.png', ['timestamp' => true]);

To generate asset URLs for files in plugins use :term:`plugin syntax`::

    // Generates `/debug_kit/img/cake.png`
    $img = Asset::imageUrl('DebugKit.cake.png');

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

    $routes->scope('/', function (RouteBuilder $routes) {
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

    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->redirect('/articles/*', 'http://google.com', ['status' => 302]);
    });

This would redirect ``/articles/*`` to ``http://google.com`` with a
HTTP status of 302.

.. _entity-routing:

Entity Routing
==============

Entity routing allows you to use an entity, an array or object implement
``ArrayAccess`` as the source of routing parameters. This allows you to refactor
routes more easily, and generate URLs with less code. For example, if you start
off with a route that looks like::

    $routes->get(
        '/view/{id}',
        ['controller' => 'Articles', 'action' => 'view'],
        'articles:view'
    );

You can generate URLs to this route using::

    // $article is an entity in the local scope.
    Router::url(['_name' => 'articles:view', 'id' => $article->id]);

Later on, you may want to expose the article slug in the URL for SEO purposes.
In order to do this you would need to update everywhere you generate a URL to
the ``articles:view`` route, which could take some time. If we use entity routes
we pass the entire article entity into URL generation allowing us to skip any
rework when URLs require more parameters::

    use Cake\Routing\Route\EntityRoute;

    // Create entity routes for the rest of this scope.
    $routes->setRouteClass(EntityRoute::class);

    // Create the route just like before.
    $routes->get(
        '/view/{id}/{slug}',
        ['controller' => 'Articles', 'action' => 'view'],
        'articles:view'
    );

Now we can generate URLs using the ``_entity`` key::

    Router::url(['_name' => 'articles:view', '_entity' => $article]);

This will extract both the ``id`` property and the ``slug`` property out of the
provided entity.

.. _custom-route-classes:

Custom Route Classes
====================

Custom route classes allow you to extend and change how individual routes parse
requests and handle reverse routing. Route classes have a few conventions:

* Route classes are expected to be found in the ``Routing\Route`` namespace of
  your application or plugin.
* Route classes should extend :php:class:`\\Cake\\Routing\\Route\\Route`.
* Route classes should implement one or both of ``match()`` and/or ``parse()``.

The ``parse()`` method is used to parse an incoming URL. It should generate an
array of request parameters that can be resolved into a controller & action.
Return ``null`` from this method to indicate a match failure.

The ``match()`` method is used to match an array of URL parameters and create a
string URL. If the URL parameters do not match the route ``false`` should be
returned.

You can use a custom route class when making a route by using the ``routeClass``
option::

    $routes->connect(
        '/{slug}',
        ['controller' => 'Articles', 'action' => 'view'],
        ['routeClass' => 'SlugRoute']
    );

    // Or by setting the routeClass in your scope.
    $routes->scope('/', function (RouteBuilder $routes) {
        $routes->setRouteClass('SlugRoute');
        $routes->connect(
            '/{slug}',
            ['controller' => 'Articles', 'action' => 'view']
        );
    });

This route would create an instance of ``SlugRoute`` and allow you
to implement custom parameter handling. You can use plugin route classes using
standard :term:`plugin syntax`.

Default Route Class
-------------------

.. php:staticmethod:: setRouteClass($routeClass = null)

If you want to use an alternate route class for your routes besides the
default ``Route``, you can do so by calling ``RouterBuilder::setRouteClass()``
before setting up any routes and avoid having to specify the ``routeClass``
option for each route. For example using::

    use Cake\Routing\Route\DashedRoute;

    $routes->setRouteClass(DashedRoute::class);

will cause all routes connected after this to use the ``DashedRoute`` route class.
Calling the method without an argument will return current default route class.

Fallbacks Method
----------------

.. php:method:: fallbacks($routeClass = null)

The fallbacks method is a simple shortcut for defining default routes. The
method uses the passed routing class for the defined rules or if no class is
provided the class returned by ``RouterBuilder::setRouteClass()`` is used.

Calling fallbacks like so::

    use Cake\Routing\Route\DashedRoute;

    $routes->fallbacks(DashedRoute::class);

Is equivalent to the following explicit calls::

    use Cake\Routing\Route\DashedRoute;

    $routes->connect('/{controller}', ['action' => 'index'], ['routeClass' => DashedRoute::class]);
    $routes->connect('/{controller}/{action}/*', [], ['routeClass' => DashedRoute::class]);

.. note::

    Using the default route class (``Route``) with fallbacks, or any route
    with ``{plugin}`` and/or ``{controller}`` route elements will result in
    inconsistent URL case.

.. warning::
    Fallback route templates are very generic and allow URLs to be generated
    and parsed for controllers & actions that do not exist. Fallback URLs can
    also introduce ambiguity and duplication in your URLs.

    As your application grows, it is recommended to move away from fallback URLs
    and explicitly define the routes in your application.

Creating Persistent URL Parameters
==================================

You can hook into the URL generation process using URL filter functions. Filter
functions are called *before* the URLs are matched against the routes, this
allows you to prepare URLs before routing.

Callback filter functions should expect the following parameters:

- ``$params`` The URL parameter array being processed.
- ``$request`` The current request (``Cake\Http\ServerRequest`` instance).

The URL filter function should *always* return the parameters even if unmodified.

URL filters allow you to implement features like persistent parameters::

    Router::addUrlFilter(function (array $params, ServerRequest $request) {
        if ($request->getParam('lang') && !isset($params['lang'])) {
            $params['lang'] = $request->getParam('lang');
        }

        return $params;
    });

Filter functions are applied in the order they are connected.

Another use case is changing a certain route on runtime (plugin routes for
example)::

    Router::addUrlFilter(function (array $params, ServerRequest $request) {
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

.. warning::
    If you are using the caching features of :ref:`routing-middleware` you must
    define the URL filters in your application ``bootstrap()`` as filters are
    not part of the cached data.

.. meta::
    :title lang=en: Routing
    :keywords lang=en: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
