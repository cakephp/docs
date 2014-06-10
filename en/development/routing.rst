Routing
#######

Routing is a feature that maps URLs to controller actions. It was
added to CakePHP to make pretty URLs more configurable and
flexible. Using Apache's mod\_rewrite is not required for using
routes, but it will make your address bar look much more tidy.

Routing in CakePHP also encompasses the idea of reverse routing,
where an array of parameters can be reversed into a string URL.
By using reverse routing, you can easily re-factor your application's
URL structure without having to update all your code.

.. index:: routes.php

.. _routes-configuration:

Routes Configuration
====================

Routes in an application are configured in ``App/Config/routes.php``.
Routes declared in this file are processed top to bottom when incoming requests
are matched. This means that the order you place routes can affect how
routes are parsed. It's generally a good idea to place most frequently
visited routes at the top of the routes file if possible. This will
save having to check a number of routes that won't match on each request.

Routes are parsed and matched in the order they are connected in.
If you define two similar routes, the first defined route will
have higher priority over the one defined latter. After connecting routes you
can manipulate the order of routes using :php:meth:`Cake\\Routing\\Router::promote()`.

CakePHP comes with a few default routes to get you started. These
can be disabled later on once you are sure you don't need them.
See :ref:`disabling-default-routes` on how to disable the default routing.

General Configuration
---------------------

In addition to the actual routes there are a few general configuration options
regarding routing:

Routing.prefixes
    Un-comment this definition if you’d like to take advantage of
    CakePHP prefixed routes like admin. Set this variable with an array
    of prefix names of the routes you’d like to use. See the section on
    :ref:`prefix-routing` for more information.


Default Routing
===============

Before you learn about configuring your own routes, you should know
that CakePHP comes configured with a default set of routes.
CakePHP's default routing will get you pretty far in any
application. You can access an action directly via the URL by
putting its name in the request. You can also pass parameters to
your controller actions using the URL.::

        URL pattern default routes:
        http://example.com/controller/action/param1/param2/param3

The URL /articles/view maps to the view() action of the
ArticlesController, and /products/view\_clearance maps to the
view\_clearance() action of the ProductsController. If no action is
specified in the URL, the index() method is assumed.

The default routing setup also allows you to pass parameters to
your actions using the URL. A request for /articles/view/25 would be
equivalent to calling view(25) on the ArticlesController, for
example. The default routing also provides routes for plugins,
and prefix routes should you choose to use those features.

The built-in routes live in ``Cake/Config/routes.php``. You can
disable the default routing by removing them from your application's
:term:`routes.php` file.

.. index:: :controller, :action, :plugin
.. _connecting-routes:

Connecting Routes
=================

Defining your own routes allows you to define how your application
will respond to a given URL. Define your own routes in the
``App/Config/routes.php`` file using the :php:meth:`Cake\\Routing\\Router::connect()`
method.

The ``connect()`` method takes up to three parameters: the URL you
wish to match, the default values for your route elements, and
regular expression rules to help the router match elements in the
URL.

The basic format for a route definition is::

    Router::connect(
        'URL template',
        ['default' => 'defaultValue'],
        ['option' => 'matchingRegex']
    );

The first parameter is used to tell the router what sort of URL
you're trying to control. The URL is a normal slash delimited
string, but can also contain a wildcard (\*) or :ref:`route-elements`.
Using a wildcard tells the router that you are willing to accept
any additional arguments supplied. Routes without a \* only match
the exact template pattern supplied.

Once you've specified a URL, you use the last two parameters of
``connect()`` to tell CakePHP what to do with a request once it has
been matched. The second parameter is an associative array. The
keys of the array should be named after the route elements the URL template
represents. The values in the array are the default values for those keys.
Let's look at some basic examples before we start using the third
parameter of connect()::

    Router::connect(
        '/pages/*',
        ['controller' => 'Pages', 'action' => 'display']
    );

This route is found in the routes.php file distributed with CakePHP.
This route matches any URL starting with ``/pages/`` and
hands it to the ``display()`` action of the ``PagesController();``
The request /pages/products would be mapped to
``PagesController->display('products')``.

In addition to the greedy star ``/*`` there is also the ``/**`` trailing star
syntax. Using a trailing double star, will capture the remainder of a URL as a
single passed argument. This is useful when you want to use an argument that
included a ``/`` in it::

    Router::connect(
        '/pages/**',
        ['controller' => 'Pages', 'action' => 'show']
    );

The incoming URL of ``/pages/the-example-/-and-proof`` would result in a single
passed argument of ``the-example-/-and-proof``.

You can use the second parameter of :php:meth:`Cake\\Routing\\Router::connect()`
to provide any routing parameters that are composed of the default values
of the route::

    Router::connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );

This example shows how you can use the second parameter of
``connect()`` to define default parameters. If you built a site
that features products for different categories of customers, you
might consider creating a route. This allows you link to
``/government`` rather than ``/pages/display/5``.

.. note::

    Although you can connect alternate routes, the default routes
    will continue to work. This could create situations, where
    content could end up with 2 URLs. See :ref:`disabling-default-routes`
    to disable default routes, and only provide the URLs you define.

Another common use for the Router is to define an "alias" for a
controller. Let's say that instead of accessing our regular URL at
``/users/some_action/5``, we'd like to be able to access it by
``/cooks/some_action/5``. The following route easily takes care of
that::

    Router::connect(
        '/cooks/:action/*', ['controller' => 'Users']
    );

This is telling the Router that any URL beginning with ``/cooks/``
should be sent to the users controller. The action called will
depend on the value of the ``:action`` parameter. By using
:ref:`route-elements`, you can create variable routes, that accept
user input or variables. The above route also uses the greedy star.
The greedy star indicates to :php:class:`Router` that this route
should accept any additional positional arguments given. These
arguments will be made available in the :ref:`passed-arguments`
array.

When generating URLs, routes are used too. Using
``['controller' => 'Users', 'action' => 'some_action', 5]`` as
a url will output /cooks/some_action/5 if the above route is the
first match found.

.. _route-elements:

Route Elements
--------------

You can specify your own route elements and doing so gives you the
power to define places in the URL where parameters for controller
actions should lie. When a request is made, the values for these
route elements are found in ``$this->request->params`` on the controller.
When you define a custom route element, you can optionally specify a regular
expression - this tells CakePHP how to know if the URL is correctly formed or
not. If you choose to not provide a regular expression, any non ``/`` will be
treated as part of the parameter::

    Router::connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

This simple example illustrates how to create a quick way to view
models from any controller by crafting a URL that looks like
``/controllername/:id``. The URL provided to connect() specifies two
route elements: ``:controller`` and ``:id``. The ``:controller`` element
is a CakePHP default route element, so the router knows how to match and
identify controller names in URLs. The ``:id`` element is a custom
route element, and must be further clarified by specifying a
matching regular expression in the third parameter of connect().

.. note::

    Patterns used for route elements must not contain any capturing
    groups. If they do, Router will not function correctly.

Once this route has been defined, requesting ``/apples/5`` is the same
as requesting ``/apples/view/5``. Both would call the view() method of
the ApplesController. Inside the view() method, you would need to
access the passed ID at ``$this->request->params['id']``.

If you have a single controller in your application and you do not want
the controller name to appear in the URL, you can map all URLs to actions
in your controller. For example, to map all URLs to actions of the
``home`` controller, e.g have URLs like ``/demo`` instead of
``/home/demo``, you can do the following::

    Router::connect('/:action', ['controller' => 'Home']);

If you would like to provide a case insensitive URL, you can use regular
expression inline modifiers::

    Router::connect(
        '/:userShortcut',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
        ['userShortcut' => '(?i:principal)']
    );

One more example, and you'll be a routing pro::

    Router::connect(
        '/:controller/:year/:month/:day',
        ['action' => 'index'],
        [
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        ]
    );

This is rather involved, but shows how powerful routes can really
become. The URL supplied has four route elements. The first is
familiar to us: it's a default route element that tells CakePHP to
expect a controller name.

Next, we specify some default values. Regardless of the controller,
we want the index() action to be called.

Finally, we specify some regular expressions that will match years,
months and days in numerical form. Note that parenthesis (grouping)
are not supported in the regular expressions. You can still specify
alternates, as above, but not grouped with parenthesis.

Once defined, this route will match ``/articles/2007/02/01``,
``/articles/2004/11/16``, handing the requests to
the index() actions of their respective controllers, with the date
parameters in ``$this->request->params``.

There are several route elements that have special meaning in
CakePHP, and should not be used unless you want the special meaning

* ``controller`` Used to name the controller for a route.
* ``action`` Used to name the controller action for a route.
* ``plugin`` Used to name the plugin a controller is located in.
* ``prefix`` Used for :ref:`prefix-routing`
* ``_ext`` Used for :ref:`file-extensions` routing.
* ``_base`` Set to false to remove the base path from the generated URL. If your application
  is not in the root directory, this can be used to generate URLs that are 'cake relative'.
  cake relative URLs are required when using requestAction.
* ``_scheme``  Set to create links on different schemes like `webcal` or `ftp`. Defaults
  to the current scheme.
* ``_host`` Set the host to use for the link.  Defaults to the current host.
* ``_port`` Set the port if you need to create links on non-standard ports.
* ``_full``  If true the `FULL_BASE_URL` constant will be prepended to generated URLs.
* ``#`` Allows you to set URL hash fragments.
* ``ssl`` Set to true to convert the generated URL to https, or false to force http.

Passing Parameters to Action
----------------------------

When connecting routes using :ref:`route-elements` you may want
to have routed elements be passed arguments instead. By using the 3rd
argument of :php:meth:`Cake\\Routing\\Router::connect()` you can define which route
elements should also be made available as passed arguments::

    // SomeController.php
    public function view($articleId = null, $slug = null) {
        // some code here...
    }

    // routes.php
    Router::connect(
        '/blog/:id-:slug', // E.g. /blog/3-CakePHP_Rocks
        ['controller' => 'Blog', 'action' => 'view'].
        [
            // order matters since this will simply map ":id" to $articleId in your action
            'pass' => ['id', 'slug'],
            'id' => '[0-9]+'
        ]
    );

And now, thanks to the reverse routing capabilities, you can pass
in the URL array like below and CakePHP will know how to form the URL
as defined in the routes::

    // view.ctp
    // this will return a link to /blog/3-CakePHP_Rocks
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        'id' => 3,
        'slug' => 'CakePHP_Rocks'
    ]);

.. _named-routes:

Using Named Routes
------------------

Sometimes you'll find typing out all the URL parameters for a route too verbose,
or you'd like to take advantage of the performance improvements that named routes
have. When connecting routes you can specifiy a ``_name`` option, this option
can be used in reverse routing to identify the route you want to use::

    // Connect a route with a name.
    Router::connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // Generate a URL using a named route.
    $url = Router::url('login');

    // Generate a URL using a named route,
    // with some query string args
    $url = Router::url('login', ['username' => 'jimmy']);

If your route template contains any route elements like ``:controller`` you'll
need to supply those as part of the options to ``Router::url()``.

.. versionadded:: 3.0.0
    Named routes were added in 3.0.0

.. index:: admin routing, prefix routing
.. _prefix-routing:

Prefix Routing
--------------

Many applications require an administration section where
privileged users can make changes. This is often done through a
special URL such as ``/admin/users/edit/5``.In CakePHP, prefix routing
can be enabled from within the core configuration file by setting
the prefixes with Routing.prefixes. Prefixes can either be enabled using the
``Routing.prefixes`` configure value, or by setting the ``prefix`` key in a call
to ``Router::connect()``::

    Configure::write('Routing.prefixes', ['admin']);

Prefixes are mapped to sub-namespaces in your applications ``Controller``
namespace. By having prefixes as separate controllers you can create smaller,
simpler controllers. Behavior that is common to the prefixed and non-prefixed
controllers can be encapsulated using inheritance,
:doc:`/controllers/components`, or traits.  Using our users example, accessing
the URL ``/admin/users/edit/5`` would call the ``edit`` method of our
``App\Controller\Admin\UsersController`` passing 5 as the first parameter. The
view file used would be ``App/Template/Admin/Users/edit.ctp``

You can map the URL /admin to your ``index`` action of pages
controller using following route::

    Router::connect(
        '/admin',
        ['controller' => 'Pages', 'action' => 'index', 'prefix' => 'admin']
    );

You can configure the Router to use multiple prefixes too. By
adding additional values to ``Routing.prefixes``. If you set::

    Configure::write('Routing.prefixes', ['admin', 'manager']);

CakePHP will automatically generate routes for both the admin and
manager prefixes. Each configured prefix will have the following
routes generated for it::

    Router::connect("/{$prefix}/:plugin/:controller", ['action' => 'index', 'prefix' => $prefix]);
    Router::connect("/{$prefix}/:plugin/:controller/:action/*", ['prefix' => $prefix]);
    Router::connect("/{$prefix}/:controller", ['action' => 'index', 'prefix' => $prefix]);
    Router::connect("/{$prefix}/:controller/:action/*", ['prefix' => $prefix]);

Additionally, the current prefix will be available from the controller methods
through ``$this->request->prefix``

When using prefix routes it's important to remember, using the HTML
helper to build your links will help maintain the prefix calls.
Here's how to build this link using the HTML helper::

    // Go into a prefixed route.
    echo $this->Html->link('Manage articles', ['prefix' => 'manager', 'controller' => 'Articles', 'action' => 'add']);

    // leave a prefix
    echo $this->Html->link('View Post', ['prefix' => false, 'controller' => 'Articles', 'action' => 'view', 5]);

.. index:: plugin routing

Plugin routing
--------------

Plugin routing uses the **plugin** key. You can create links that
point to a plugin, but adding the plugin key to your URL array::

    echo $this->Html->link('New todo', ['plugin' => 'Todo', 'controller' => 'TodoItems', 'action' => 'create']);

Conversely if the active request is a plugin request and you want
to create a link that has no plugin you can do the following::

    echo $this->Html->link('New todo', ['plugin' => null, 'controller' => 'Users', 'action' => 'profile']);

By setting ``plugin => null`` you tell the Router that you want to
create a link that is not part of a plugin.

.. index:: file extensions
.. _file-extensions:

File Extensions
---------------

To handle different file extensions with your routes, you need one
extra line in your routes config file::

    Router::parseExtensions(['html', 'rss']);

This will tell the router to remove any matching file extensions,
and then parse what remains.

If you want to create a URL such as /page/title-of-page.html you
would create your route as illustrated below::

    Router::connect(
        '/page/:title',
        ['controller' => 'Pages', 'action' => 'view'],
        [
            'pass' => ['title']
        ]
    );

Then to create links which map back to the routes simply use::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

File extensions are used by :php:class:`RequestHandlerComponent` to do automatic
view switching based on content types. See the RequestHandlerComponent for
more information.

.. _route-conditions:

Using Additional Conditions When Matching Routes
------------------------------------------------

When creating routes you might want to restrict certain URL's based on specific
request/environment settings. A good example of this is :doc:`rest`
routing. You can specify additional conditions in the ``$defaults`` argument for
:php:meth:`Router::connect()`. By default CakePHP exposes 3 environment
conditions, but you can add more using :ref:`custom-route-classes`. The built-in
options are:

- ``[type]`` Only match requests for specific content types.
- ``[method]`` Only match requests with specific HTTP verbs.
- ``[server]`` Only match when $_SERVER['SERVER_NAME'] matches the given value.

We'll provide a simple example here of how you can use the ``[method]``
option to create a custom RESTful route::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9]+")
    );

The above route will only match for ``PUT`` requests. Using these conditions,
you can create custom REST routing, or other request data dependent information.

.. index:: passed arguments
.. _passed-arguments:

Passed Arguments
================

Passed arguments are additional arguments or path segments that are
used when making a request. They are often used to pass parameters
to your controller methods.::

    http://localhost/calendars/view/recent/mark

In the above example, both ``recent`` and ``mark`` are passed
arguments to ``CalendarsController::view()``. Passed arguments are
given to your controllers in three ways. First as arguments to the
action method called, and secondly they are available in
``$this->request->params['pass']`` as a numerically indexed array. Lastly
there is ``$this->passedArgs`` available in the same way as the
second one. When using custom routes you can force particular
parameters to go into the passed arguments as well.

If you were to visit the previously mentioned URL, and you
had a controller action that looked like::

    CalendarsController extends AppController {
        public function view($arg1, $arg2) {
            debug(func_get_args());
        }
    }

You would get the following output::

    Array
    (
        [0] => recent
        [1] => mark
    )

This same data is also available at ``$this->request->params['pass']``
and ``$this->passedArgs`` in your controllers, views, and helpers.
The values in the pass array are numerically indexed based on the
order they appear in the called URL::

    debug($this->request->params['pass']);
    debug($this->passedArgs);

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

Reverse Routing
===============

Reverse routing is a feature in CakePHP that is used to allow you to
easily change your URL structure without having to modify all your code.
By using :term:`routing arrays <routing array>` to define your URLs, you can
later configure routes and the generated URLs will automatically update.

If you create URLs using strings like::

    $this->Html->link('View', '/articles/view/' + $id);

And then later decide that ``/articles`` should really be called
'articles' instead, you would have to go through your entire
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

    // will generate a URL like.
    /articles/index?page=1#top

Router will also convert any unknown parameters in a routing array to
querystring parameters.  The ``?`` is offered for backwards compatibility with
older versions of CakePHP.

Improving Performance of Routing
--------------------------------

After connecting many routes, or if you're reverse routing a higher than average
number of URL's generating URL's can start representing a measurable amout of
time.  The easiest way to address this issue is to use :ref:`named-routes`.
Using named routes dramatically changes the internal performance of finding
matching routes.  Instead of a linear search through a subset of routes, a
single route is fetched and used for generating a URL.

.. _redirect-routing:

Redirect Routing
================

Redirect routing allows you to issue HTTP status 30x redirects for
incoming routes, and point them at different URLs. This is useful
when you want to inform client applications that a resource has moved
and you don't want to expose two URLs for the same content

Redirection routes are different from normal routes as they perform an actual
header redirection if a match is found. The redirection can occur to
a destination within your application or an outside location::

    Router::redirect(
        '/home/*',
        ['controller' => 'Articles', 'action' => 'view'],
        ['persist' => true] // or ['persist'=>['id']] for default routing where the view action expects $id as an argument
    );

Redirects ``/home/*`` to ``/articles/view`` and passes the parameters to
``/articles/view``. Using an array as the redirect destination allows
you to use other routes to define where a URL string should be
redirected to. You can redirect to external locations using
string URLs as the destination::

    Router::redirect('/articles/*', 'http://google.com', ['status' => 302]);

This would redirect ``/articles/*`` to ``http://google.com`` with a
HTTP status of 302.

.. _disabling-default-routes:

Disabling the default Routes
============================

If you have fully customized all your routes, and want to avoid any
possible duplicate content penalties from search engines, you can
remove the default routes that CakePHP offers by deleting them from your
application's routes.php file.

This will cause CakePHP to serve errors, when users try to visit
URLs that would normally be provided by CakePHP but have not
been connected explicitly.

.. _custom-route-classes:

Custom Route Classes
====================

Custom route classes allow you to extend and change how individual
routes parse requests and handle reverse routing. A route class
should extend :php:class:`Cake\\Routing\\Route` and implement one or both of
``match()`` and/or ``parse()``. ``parse()`` is used to parse requests and
``match()`` is used to handle reverse routing.

You can use a custom route class when making a route by using the
``routeClass`` option, and loading the file containing your route
before trying to use it::

    App::uses('SlugRoute', 'Routing/Route');

    Router::connect(
         '/:slug',
         ['controller' => 'Articles', 'action' => 'view'],
         ['routeClass' => 'SlugRoute']
    );

This route would create an instance of ``SlugRoute`` and allow you
to implement custom parameter handling.

Handling Named Parameters in URLs
=================================

Although named parameters were removed in CakePHP 3.0, applications may have
published URLs containing them.  You can continue to accept URLs containing
named parameters.

In your controller's ``beforeFilter()`` method you can call
``parseNamedParams()`` to extract any named parameters from the passed
arguments::

    public function beforeFilter() {
        parent::beforeFilter();
        Router::parseNamedParams($this->request);
    }

This will populate ``$this->request->params['named']`` with any named parameters
found in the passed arguments.  Any passed argument that was interpreted as a
named parameter, will be removed from the list of passed arguments.

Router API
==========

.. php:namespace:: Cake\Routing

.. php:class:: Router

    Router manages generation of outgoing URLs, and parsing of incoming
    request uri's into parameter sets that CakePHP can dispatch.

.. php:staticmethod:: connect($route, $defaults = [], $options = [])

    :param string $route: A string describing the template of the route
    :param array $defaults: An array describing the default route parameters.
        These parameters will be used by default
        and can supply routing parameters that are not dynamic.
    :param array $options: An array matching the named elements in the route
        to regular expressions which that element should match. Also contains
        additional parameters such as which routed parameters should be
        shifted into the passed arguments, supplying patterns for routing
        parameters and supplying the name of a custom routing class.

    Routes are a way of connecting request URLs to objects in your application.
    At their core routes are a set or regular expressions that are used to
    match requests to destinations.

    Examples::

        Router::connect('/:controller/:action/*');

    The first parameter will be used as a controller name while the second is
    used as the action name. The '/\*' syntax makes this route greedy in that
    it will match requests like `/articles/index` as well as requests like
    ``/articles/edit/1/foo/bar`` .::

        Router::connect('/home-page', ['controller' => 'Pages', 'action' => 'display', 'home']);

    The above shows the use of route parameter defaults. And providing routing
    parameters for a static route.::

        Router::connect(
            '/:lang/:controller/:action/:id',
            [],
            ['id' => '[0-9]+', 'lang' => '[a-z]{3}']
        );

    Shows connecting a route with custom route parameters as well as providing
    patterns for those parameters. Patterns for routing parameters do not need
    capturing groups, as one will be added for each route params.

    $options offers three 'special' keys. ``pass``, ``persist`` and ``routeClass``
    have special meaning in the $options array.

    * ``pass`` is used to define which of the routed parameters should be
      shifted into the pass array. Adding a parameter to pass will remove
      it from the regular route array. Ex. ``'pass' => ['slug']``

    * ``routeClass`` is used to extend and change how individual routes parse
      requests and handle reverse routing, via a custom routing class.
      Ex. ``'routeClass' => 'SlugRoute'``


.. php:staticmethod:: redirect($route, $url, $options = [])

    :param string $route: A route template that dictates which URLs should
        be redirected.
    :param mixed $url: Either a :term:`routing array` or a string URL
        for the destination of the redirect.
    :param array $options: An array of options for the redirect.

    Connects a new redirection Route in the router.
    See :ref:`redirect-routing` for more information.

.. php:staticmethod:: promote($which = null)

    :param integer $which: A zero-based array index representing the route to move.
        For example, if 3 routes have been added, the last route would be 2.

    Promote a route (by default, the last one added) to the beginning of the list.
    This will move the chosen route to the top of its subsection in the named
    route table as well.

.. php:staticmethod:: url($url = null, $full = false)

    :param mixed $url: Cake-relative URL, like "/products/edit/92" or
        "/presidents/elect/4" or a :term:`routing array`
    :param bool|array $options: If (bool) true, the full base URL will be prepended to the result.
        If an array accepts the following keys.  If used with a named route you can provide
        a list of query string parameters.

    Generate a URL for the specified action. Returns a URL pointing
    to a combination of controller and action. $url can be:

    There are a few 'special' parameters that can change the final URL string that is generated

    * ``_base`` - Set to false to remove the base path from the generated URL. If your application
      is not in the root directory, this can be used to generate URLs that are 'cake relative'.
      cake relative URLs are required when using requestAction.
    * ``_scheme`` - Set to create links on different schemes like ``webcal`` or ``ftp``. Defaults
      to the current scheme.
    * ``_host`` - Set the host to use for the link.  Defaults to the current host.
    * ``_port`` - Set the port if you need to create links on non-standard ports.
    * ``_full`` - If true the value of :php:meth:`Router::baseUrl` will be prepended to generated URLs.
    * ``#`` - Allows you to set URL hash fragments.
    * ``ssl`` - Set to true to convert the generated URL to https, or false to force http.

.. php:staticmethod:: mapResources($controller, $options = [])

    Creates REST resource routes for the given controller(s). See
    the :doc:`/development/rest` section for more information.

.. php:staticmethod:: parseExtensions(string|array $extensions, $merge = true)

    Used in routes.php to set or add which :ref:`file-extensions` your application
    supports.

.. php:staticmethod:: defaultRouteClass($classname)

    Set the default route to be used when connecting routes in the future.

.. php:staticmethod:: fullBaseUrl($url = null)

    Get or set the baseURL used for generating URL's. When setting this value
    you should be sure to include the fully qualified domain name including
    protocol.

    Setting values with this method will also update ``App.fullBaseUrl`` in
    :php:class:`Cake\\Core\\Configure`.

.. php:class:: Route

    The base class for custom routes to be based on.

.. php:method:: parse($url)

    :param string $url: The string URL to parse.

    Parses an incoming URL, and generates an array of request parameters
    that Dispatcher can act upon. Extending this method allows you to customize
    how incoming URLs are converted into an array. Return ``false`` from
    URL to indicate a match failure.

.. php:method:: match($url, $context = [])

    :param array $url: The routing array to convert into a string URL.
    :param array $context: An array of the current request context.
        Contains information such as the current host, scheme, port, and base
        directory.

    Attempt to match a URL array. If the URL matches the route parameters
    and settings, then return a generated string URL. If the URL doesn't
    match the route parameters, false will be returned. This method handles
    the reverse routing or conversion of URL arrays into string URLs.

    .. versionchanged:: 3.0
        The ``$context`` parameter was added to support new routing features.

.. php:method:: compile()

    Force a route to compile its regular expression.


.. php:trait:: RequestActionTrait

    This trait allows classes which include it to create sub-requests or
    request actions.

.. php:method:: requestAction(string $url, array $options)

    This function calls a controller's action from any location and
    returns data from the action. The ``$url`` passed is a
    CakePHP-relative URL (/controllername/actionname/params). To pass
    extra data to the receiving controller action add to the $options
    array.

    .. note::

        You can use ``requestAction()`` to retrieve a fully rendered view
        by passing 'return' in the options:
        ``requestAction($url, ['return']);``. It is important to note
        that making a requestAction using 'return' from a controller method
        can cause script and css tags to not work correctly.

    .. warning::

        If used without caching ``requestAction`` can lead to poor
        performance. It is seldom appropriate to use in a controller.

    ``requestAction`` is best used in conjunction with (cached)
    elements – as a way to fetch data for an element before rendering.
    Let's use the example of putting a "latest comments" element in the
    layout. First we need to create a controller function that will
    return the data::

        // Controller/CommentsController.php
        class CommentsController extends AppController {
            public function latest() {
                if (!$this->request->is('requested')) {
                    throw new ForbiddenException();
                }
                return $this->Comments->find('all', [
                    'order' => 'Comment.created DESC',
                    'limit' => 10
               ]);
            }
        }

    You should always include checks to make sure your requestAction methods are
    actually originating from ``requestAction``.  Failing to do so will allow
    requestAction methods to be directly accessible from a URL, which is
    generally undesirable.

    If we now create a simple element to call that function::

        // View/Element/latest_comments.ctp

        $comments = $this->requestAction('/comments/latest');
        foreach ($comments as $comment) {
            echo $comment->title;
        }

    We can then place that element anywhere to get the output
    using::

        echo $this->element('latest_comments');

    Written in this way, whenever the element is rendered, a request
    will be made to the controller to get the data, the data will be
    processed, and returned. However in accordance with the warning
    above it's best to make use of element caching to prevent needless
    processing. By modifying the call to element to look like this::

        echo $this->element('latest_comments', [], ['cache' => '+1 hour']);

    The ``requestAction`` call will not be made while the cached
    element view file exists and is valid.

    In addition, requestAction now takes array based cake style URLs::

        echo $this->requestAction(
            ['controller' => 'Articles', 'action' => 'featured'],
            ['return']
        );

    The URL based array are the same as the ones that :php:meth:`HtmlHelper::link()`
    uses with one difference - if you are using passed parameters, you must put them
    in a second array and wrap them with the correct key. This is because
    requestAction merges the extra parameters (requestAction's 2nd parameter)
    with the ``request->params`` member array and does not explicitly place them
    under the ``pass`` key. Any additional keys in the ``$option`` array will
    be made available in the requested action's ``request->params`` property::

        echo $this->requestAction('/articles/view/5');

    As an array in the requestAction would then be::

        echo $this->requestAction(
            ['controller' => 'Articles', 'action' => 'view', 5],
        );

    You can also pass querystring arguments, post data or cookies using the
    appropriate keys. Cookies can be passed using the ``cookies`` key.
    Get parameters can be set with ``query`` and post data can be sent
    using the ``post`` key::

        $vars = $this->requestAction('/articles/popular', [
          'query' => ['page' = > 1],
          'cookies' => ['remember_me' => 1],
        ]);

    .. note::

        Unlike other places where array URLs are analogous to string URLs,
        requestAction treats them differently.

    When using an array URL in conjunction with requestAction() you
    must specify **all** parameters that you will need in the requested
    action. This includes parameters like ``$this->request->data``.  In addition
    to passing all required parameters, passed arguments must be done
    in the second array as seen above.


.. meta::
    :title lang=en: Routing
    :keywords lang=en: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
