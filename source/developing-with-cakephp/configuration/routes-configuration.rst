3.4.5 Routes Configuration
--------------------------

Routing is a feature that maps URLs to controller actions. It was
added to CakePHP to make pretty URLs more configurable and
flexible. Using Apache’s mod\_rewrite is not required for using
routes, but it will make your address bar look much more tidy.

Default Routing
~~~~~~~~~~~~~~~

Before you learn about configuring your own routes, you should know
that CakePHP comes configured with a default set of routes.
CakePHP’s default routing will get you pretty far in any
application. You can access an action directly via the URL by
putting its name in the request. You can also pass parameters to
your controller actions using the URL.

::

        URL pattern default routes: 
        http://example.com/controller/action/param1/param2/param3

The URL /posts/view maps to the view() action of the
PostsController, and /products/view\_clearance maps to the
view\_clearance() action of the ProductsController. If no action is
specified in the URL, the index() method is assumed.

The default routing setup also allows you to pass parameters to
your actions using the URL. A request for /posts/view/25 would be
equivalent to calling view(25) on the PostsController, for
example.

Passed arguments
~~~~~~~~~~~~~~~~

Passed arguments are additional arguments or path segments that are
used when making a request. They are often used to pass parameters
to your controller methods.

::

    http://localhost/calendars/view/recent/mark

In the above example, both ``recent`` and ``mark`` are passed
arguments to ``CalendarsController::view()``. Passed arguments are
given to your controllers in three ways. First as arguments to the
action method called, and secondly they are available in
``$this->params['pass']`` as a numerically indexed array. Lastly
there is ``$this->passedArgs`` available in the same way as the
second one. When using custom routes you can force particular
parameters to go into the passed arguments as well. See
`passing parameters to an action </view/945/Routes-Configuration#Passing-parameters-to-action-949>`_
for more information.

**Arguments to the action method called**

::

    CalendarsController extends AppController{
        function view($arg1, $arg2){
            debug($arg1);
            debug($arg2);
            debug(func_get_args());
        }
    }

For this, you will have...
::

    recent

::

    mark

::

    Array
    (
        [0] => recent
        [1] => mark
    )

**$this->params['pass'] as a numerically indexed array**

::

    debug($this->params['pass'])

For this, you will have...
::

    Array
    (
        [0] => recent
        [1] => mark
    )

**$this->passedArgs as a numerically indexed array**

::

    debug($this->passedArgs)

::

    Array
    (
        [0] => recent
        [1] => mark
    )

$this->passedArgs may also contain Named parameters as a named
array mixed with Passed arguments.

Named parameters
~~~~~~~~~~~~~~~~

You can name parameters and send their values using the URL. A
request for /posts/view/title:first/category:general would result
in a call to the view() action of the PostsController. In that
action, you’d find the values of the title and category parameters
inside $this->passedArgs[‘title’] and $this->passedArgs[‘category’]
respectively. You can also access named parameters from
``$this->params['named']``. ``$this->params['named']`` contains an
array of named parameters indexed by their name.

Some summarizing examples for default routes might prove helpful.

::

    URL to controller action mapping using default routes:  
        
    URL: /monkeys/jump
    Mapping: MonkeysController->jump();
     
    URL: /products
    Mapping: ProductsController->index();
     
    URL: /tasks/view/45
    Mapping: TasksController->view(45);
     
    URL: /donations/view/recent/2001
    Mapping: DonationsController->view('recent', '2001');
    
    URL: /contents/view/chapter:models/section:associations
    Mapping: ContentsController->view();
    $this->passedArgs['chapter'] = 'models';
    $this->passedArgs['section'] = 'associations';
    $this->params['named']['chapter'] = 'models';
    $this->params['named']['section'] = 'associations';

When making custom routes, a common pitfall is that using named
parameters will break your custom routes. In order to solve this
you should inform the Router about which parameters are intended to
be named parameters. Without this knowledge the Router is unable to
determine whether named parameters are intended to actually be
named parameters or routed parameters, and defaults to assuming you
intended them to be routed parameters. To connect named parameters
in the router use ``Router::connectNamed()``.

::

    Router::connectNamed(array('chapter', 'section'));

Will ensure that your chapter and section parameters reverse route
correctly.

Defining Routes
~~~~~~~~~~~~~~~

Defining your own routes allows you to define how your application
will respond to a given URL. Define your own routes in the
/app/config/routes.php file using the ``Router::connect()``
method.

The ``connect()`` method takes up to three parameters: the URL you
wish to match, the default values for your route elements, and
regular expression rules to help the router match elements in the
URL.

The basic format for a route definition is:

::

    Router::connect(
        'URL',
        array('paramName' => 'defaultValue'),
        array('paramName' => 'matchingRegex')
    )

The first parameter is used to tell the router what sort of URL
you're trying to control. The URL is a normal slash delimited
string, but can also contain a wildcard (\*) or route elements
(variable names prefixed with a colon). Using a wildcard tells the
router what sorts of URLs you want to match, and specifying route
elements allows you to gather parameters for your controller
actions.

Once you've specified a URL, you use the last two parameters of
``connect()`` to tell CakePHP what to do with a request once it has
been matched. The second parameter is an associative array. The
keys of the array should be named after the route elements in the
URL, or the default elements: :controller, :action, and :plugin.
The values in the array are the default values for those keys.
Let's look at some basic examples before we start using the third
parameter of connect().

::

    Router::connect(
        '/pages/*',
        array('controller' => 'pages', 'action' => 'display')
    );

This route is found in the routes.php file distributed with CakePHP
(line 40). This route matches any URL starting with /pages/ and
hands it to the ``display()`` method of the ``PagesController();``
The request /pages/products would be mapped to
``PagesController->display('products')``, for example.

::

    Router::connect(
        '/government',
        array('controller' => 'products', 'action' => 'display', 5)
    );

This second example shows how you can use the second parameter of
``connect()`` to define default parameters. If you built a site
that features products for different categories of customers, you
might consider creating a route. This allows you link to
/government rather than /products/display/5.

Another common use for the Router is to define an "alias" for a
controller. Let's say that instead of accessing our regular URL at
/users/someAction/5, we'd like to be able to access it by
/cooks/someAction/5. The following route easily takes care of
that:

::

    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

This is telling the Router that any url beginning with /cooks/
should be sent to the users controller.

When generating urls, routes are used too. Using
``array('controller' => 'users', 'action' => 'someAction', 5)`` as
a url will output /cooks/someAction/5 if the above route is the
first match found

If you are planning to use custom named arguments with your route,
you have to make the router aware of it using the
``Router::connectNamed`` function. So if you want the above route
to match urls like ``/cooks/someAction/type:chef`` we do:

::

    Router::connectNamed(array('type'));
    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

You can specify your own route elements, doing so gives you the
power to define places in the URL where parameters for controller
actions should lie. When a request is made, the values for these
route elements are found in $this->params of the controller. This
is different than named parameters are handled, so note the
difference: named parameters (/controller/action/name:value) are
found in $this->passedArgs, whereas custom route element data is
found in $this->params. When you define a custom route element, you
also need to specify a regular expression - this tells CakePHP how
to know if the URL is correctly formed or not.

::

    Router::connect(
        '/:controller/:id',
        array('action' => 'view'),
        array('id' => '[0-9]+')
    );

This simple example illustrates how to create a quick way to view
models from any controller by crafting a URL that looks like
/controllername/id. The URL provided to connect() specifies two
route elements: :controller and :id. The :controller element is a
CakePHP default route element, so the router knows how to match and
identify controller names in URLs. The :id element is a custom
route element, and must be further clarified by specifying a
matching regular expression in the third parameter of connect().
This tells CakePHP how to recognize the ID in the URL as opposed to
something else, such as an action name.

Once this route has been defined, requesting /apples/5 is the same
as requesting /apples/view/5. Both would call the view() method of
the ApplesController. Inside the view() method, you would need to
access the passed ID at ``$this->params['id']``.

If you have a single controller in your application and you want
that controller name does not appear in url, e.g have urls like
/demo instead of /home/demo:

::

     Router::connect('/:action', array('controller' => 'home')); 

One more example, and you'll be a routing pro.

::

    Router::connect(
        '/:controller/:year/:month/:day',
        array('action' => 'index', 'day' => null),
        array(
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        )
    );

This is rather involved, but shows how powerful routes can really
become. The URL supplied has four route elements. The first is
familiar to us: it's a default route element that tells CakePHP to
expect a controller name.

Next, we specify some default values. Regardless of the controller,
we want the index() action to be called. We set the day parameter
(the fourth element in the URL) to null to flag it as being
optional.

Finally, we specify some regular expressions that will match years,
months and days in numerical form. Note that parenthesis (grouping)
are not supported in the regular expressions. You can still specify
alternates, as above, but not grouped with parenthesis.

Once defined, this route will match /articles/2007/02/01,
/posts/2004/11/16, and /products/2001/05 (as defined, the day
parameter is optional as it has a default), handing the requests to
the index() actions of their respective controllers, with the date
parameters in $this->params.

Passing parameters to action
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Assuming your action was defined like this and you want to access
the arguments using ``$articleID`` instead of
``$this->params['id']``, just add an extra array in the 3rd
parameter of ``Router::connect()``.

::

    // some_controller.php
    function view($articleID = null, $slug = null) {
        // some code here...
    }
    
    // routes.php
    Router::connect(
        // E.g. /blog/3-CakePHP_Rocks
        '/blog/:id-:slug',
        array('controller' => 'blog', 'action' => 'view'),
        array(
            // order matters since this will simply map ":id" to $articleID in your action
            'pass' => array('id', 'slug'),
            'id' => '[0-9]+'
        )
    );

And now, thanks to the reverse routing capabilities, you can pass
in the url array like below and Cake will know how to form the URL
as defined in the routes.

::

    // view.ctp
    // this will return a link to /blog/3-CakePHP_Rocks
    <?php echo $html->link('CakePHP Rocks', array(
        'controller' => 'blog',
        'action' => 'view',
        'id' => 3,
        'slug' => Inflector::slug('CakePHP Rocks')
    )); ?>

Prefix Routing
~~~~~~~~~~~~~~

Many applications require an administration section where
privileged users can make changes. This is often done through a
special URL such as /admin/users/edit/5. In CakePHP, prefix routing
can be enabled from within the core configuration file by setting
the prefixes with Routing.prefixes. Note that prefixes, although
related to the router, are to be configured in
/app/config/core.php

::

    Configure::write('Routing.prefixes', array('admin'));

In your controller, any action with an ``admin_`` prefix will be
called. Using our users example, accessing the url
/admin/users/edit/5 would call the method ``admin_edit`` of our
``UsersController`` passing 5 as the first parameter. The view file
used would be app/views/users/admin\_edit.ctp

You can map the url /admin to your ``admin_index`` action of pages
controller using following route

::

    Router::connect('/admin', array('controller' => 'pages', 'action' => 'index', 'admin' => true)); 

You can configure the Router to use multiple prefixes too. By
adding additional values to ``Routing.prefixes``. If you set

::

    Configure::write('Routing.prefixes', array('admin', 'manager'));

Cake will automatically generate routes for both the admin and
manager prefixes. Each configured prefix will have the following
routes generated for it.

::

    $this->connect("/{$prefix}/:plugin/:controller", array('action' => 'index', 'prefix' => $prefix, $prefix => true));
    $this->connect("/{$prefix}/:plugin/:controller/:action/*", array('prefix' => $prefix, $prefix => true));
    Router::connect("/{$prefix}/:controller", array('action' => 'index', 'prefix' => $prefix, $prefix => true));
    Router::connect("/{$prefix}/:controller/:action/*", array('prefix' => $prefix, $prefix => true));

Much like admin routing all prefix actions should be prefixed with
the prefix name. So ``/manager/posts/add`` would map to
``PostsController::manager_add()``.

When using prefix routes its important to remember, using the HTML
helper to build your links will help maintain the prefix calls.
Here's how to build this link using the HTML helper:

::

    // Go into a prefixed route.
    echo $html->link('Manage posts', array('manager' => true, 'controller' => 'posts', 'action' => 'add'));
    
    // leave a prefix
    echo $html->link('View Post', array('manager' => false, 'controller' => 'posts', 'action' => 'view', 5));

Plugin routing
~~~~~~~~~~~~~~

Plugin routing uses the **plugin** key. You can create links that
point to a plugin, but adding the plugin key to your url array.

::

    echo $html->link('New todo', array('plugin' => 'todo', 'controller' => 'todo_items', 'action' => 'create'));

Conversely if the active request is a plugin request and you want
to create a link that has no plugin you can do the following.

::

    echo $html->link('New todo', array('plugin' => null, 'controller' => 'users', 'action' => 'profile'));

By setting ``plugin => null`` you tell the Router that you want to
create a link that is not part of a plugin.

File extensions
~~~~~~~~~~~~~~~

To handle different file extensions with your routes, you need one
extra line in your routes config file:

::

    Router::parseExtensions('html', 'rss');

This will tell the router to remove any matching file extensions,
and then parse what remains.

If you want to create a URL such as /page/title-of-page.html you
would create your route as illustrated below:

::

        Router::connect(
            '/page/:title',
            array('controller' => 'pages', 'action' => 'view'),
            array(
                'pass' => array('title')
            )
        );  

Then to create links which map back to the routes simply use:

::

    $html->link('Link title', array('controller' => 'pages', 'action' => 'view', 'title' => Inflector::slug('text to slug', '-'), 'ext' => 'html'))

Custom Route classes
~~~~~~~~~~~~~~~~~~~~

Custom route classes allow you to extend and change how individual
routes parse requests and handle reverse routing. A route class
should extend ``CakeRoute`` and implement one or both of
``match()`` and ``parse()``. Parse is used to parse requests and
match is used to handle reverse routing.

You can use a custom route class when making a route by using the
``routeClass`` option, and loading the file containing your route
before trying to use it.

::

    Router::connect(
         '/:slug', 
         array('controller' => 'posts', 'action' => 'view'),
         array('routeClass' => 'SlugRoute')
    );

This route would create an instance of ``SlugRoute`` and allow you
to implement custom parameter handling

3.4.5 Routes Configuration
--------------------------

Routing is a feature that maps URLs to controller actions. It was
added to CakePHP to make pretty URLs more configurable and
flexible. Using Apache’s mod\_rewrite is not required for using
routes, but it will make your address bar look much more tidy.

Default Routing
~~~~~~~~~~~~~~~

Before you learn about configuring your own routes, you should know
that CakePHP comes configured with a default set of routes.
CakePHP’s default routing will get you pretty far in any
application. You can access an action directly via the URL by
putting its name in the request. You can also pass parameters to
your controller actions using the URL.

::

        URL pattern default routes: 
        http://example.com/controller/action/param1/param2/param3

The URL /posts/view maps to the view() action of the
PostsController, and /products/view\_clearance maps to the
view\_clearance() action of the ProductsController. If no action is
specified in the URL, the index() method is assumed.

The default routing setup also allows you to pass parameters to
your actions using the URL. A request for /posts/view/25 would be
equivalent to calling view(25) on the PostsController, for
example.

Passed arguments
~~~~~~~~~~~~~~~~

Passed arguments are additional arguments or path segments that are
used when making a request. They are often used to pass parameters
to your controller methods.

::

    http://localhost/calendars/view/recent/mark

In the above example, both ``recent`` and ``mark`` are passed
arguments to ``CalendarsController::view()``. Passed arguments are
given to your controllers in three ways. First as arguments to the
action method called, and secondly they are available in
``$this->params['pass']`` as a numerically indexed array. Lastly
there is ``$this->passedArgs`` available in the same way as the
second one. When using custom routes you can force particular
parameters to go into the passed arguments as well. See
`passing parameters to an action </view/945/Routes-Configuration#Passing-parameters-to-action-949>`_
for more information.

**Arguments to the action method called**

::

    CalendarsController extends AppController{
        function view($arg1, $arg2){
            debug($arg1);
            debug($arg2);
            debug(func_get_args());
        }
    }

For this, you will have...
::

    recent

::

    mark

::

    Array
    (
        [0] => recent
        [1] => mark
    )

**$this->params['pass'] as a numerically indexed array**

::

    debug($this->params['pass'])

For this, you will have...
::

    Array
    (
        [0] => recent
        [1] => mark
    )

**$this->passedArgs as a numerically indexed array**

::

    debug($this->passedArgs)

::

    Array
    (
        [0] => recent
        [1] => mark
    )

$this->passedArgs may also contain Named parameters as a named
array mixed with Passed arguments.

Named parameters
~~~~~~~~~~~~~~~~

You can name parameters and send their values using the URL. A
request for /posts/view/title:first/category:general would result
in a call to the view() action of the PostsController. In that
action, you’d find the values of the title and category parameters
inside $this->passedArgs[‘title’] and $this->passedArgs[‘category’]
respectively. You can also access named parameters from
``$this->params['named']``. ``$this->params['named']`` contains an
array of named parameters indexed by their name.

Some summarizing examples for default routes might prove helpful.

::

    URL to controller action mapping using default routes:  
        
    URL: /monkeys/jump
    Mapping: MonkeysController->jump();
     
    URL: /products
    Mapping: ProductsController->index();
     
    URL: /tasks/view/45
    Mapping: TasksController->view(45);
     
    URL: /donations/view/recent/2001
    Mapping: DonationsController->view('recent', '2001');
    
    URL: /contents/view/chapter:models/section:associations
    Mapping: ContentsController->view();
    $this->passedArgs['chapter'] = 'models';
    $this->passedArgs['section'] = 'associations';
    $this->params['named']['chapter'] = 'models';
    $this->params['named']['section'] = 'associations';

When making custom routes, a common pitfall is that using named
parameters will break your custom routes. In order to solve this
you should inform the Router about which parameters are intended to
be named parameters. Without this knowledge the Router is unable to
determine whether named parameters are intended to actually be
named parameters or routed parameters, and defaults to assuming you
intended them to be routed parameters. To connect named parameters
in the router use ``Router::connectNamed()``.

::

    Router::connectNamed(array('chapter', 'section'));

Will ensure that your chapter and section parameters reverse route
correctly.

Defining Routes
~~~~~~~~~~~~~~~

Defining your own routes allows you to define how your application
will respond to a given URL. Define your own routes in the
/app/config/routes.php file using the ``Router::connect()``
method.

The ``connect()`` method takes up to three parameters: the URL you
wish to match, the default values for your route elements, and
regular expression rules to help the router match elements in the
URL.

The basic format for a route definition is:

::

    Router::connect(
        'URL',
        array('paramName' => 'defaultValue'),
        array('paramName' => 'matchingRegex')
    )

The first parameter is used to tell the router what sort of URL
you're trying to control. The URL is a normal slash delimited
string, but can also contain a wildcard (\*) or route elements
(variable names prefixed with a colon). Using a wildcard tells the
router what sorts of URLs you want to match, and specifying route
elements allows you to gather parameters for your controller
actions.

Once you've specified a URL, you use the last two parameters of
``connect()`` to tell CakePHP what to do with a request once it has
been matched. The second parameter is an associative array. The
keys of the array should be named after the route elements in the
URL, or the default elements: :controller, :action, and :plugin.
The values in the array are the default values for those keys.
Let's look at some basic examples before we start using the third
parameter of connect().

::

    Router::connect(
        '/pages/*',
        array('controller' => 'pages', 'action' => 'display')
    );

This route is found in the routes.php file distributed with CakePHP
(line 40). This route matches any URL starting with /pages/ and
hands it to the ``display()`` method of the ``PagesController();``
The request /pages/products would be mapped to
``PagesController->display('products')``, for example.

::

    Router::connect(
        '/government',
        array('controller' => 'products', 'action' => 'display', 5)
    );

This second example shows how you can use the second parameter of
``connect()`` to define default parameters. If you built a site
that features products for different categories of customers, you
might consider creating a route. This allows you link to
/government rather than /products/display/5.

Another common use for the Router is to define an "alias" for a
controller. Let's say that instead of accessing our regular URL at
/users/someAction/5, we'd like to be able to access it by
/cooks/someAction/5. The following route easily takes care of
that:

::

    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

This is telling the Router that any url beginning with /cooks/
should be sent to the users controller.

When generating urls, routes are used too. Using
``array('controller' => 'users', 'action' => 'someAction', 5)`` as
a url will output /cooks/someAction/5 if the above route is the
first match found

If you are planning to use custom named arguments with your route,
you have to make the router aware of it using the
``Router::connectNamed`` function. So if you want the above route
to match urls like ``/cooks/someAction/type:chef`` we do:

::

    Router::connectNamed(array('type'));
    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

You can specify your own route elements, doing so gives you the
power to define places in the URL where parameters for controller
actions should lie. When a request is made, the values for these
route elements are found in $this->params of the controller. This
is different than named parameters are handled, so note the
difference: named parameters (/controller/action/name:value) are
found in $this->passedArgs, whereas custom route element data is
found in $this->params. When you define a custom route element, you
also need to specify a regular expression - this tells CakePHP how
to know if the URL is correctly formed or not.

::

    Router::connect(
        '/:controller/:id',
        array('action' => 'view'),
        array('id' => '[0-9]+')
    );

This simple example illustrates how to create a quick way to view
models from any controller by crafting a URL that looks like
/controllername/id. The URL provided to connect() specifies two
route elements: :controller and :id. The :controller element is a
CakePHP default route element, so the router knows how to match and
identify controller names in URLs. The :id element is a custom
route element, and must be further clarified by specifying a
matching regular expression in the third parameter of connect().
This tells CakePHP how to recognize the ID in the URL as opposed to
something else, such as an action name.

Once this route has been defined, requesting /apples/5 is the same
as requesting /apples/view/5. Both would call the view() method of
the ApplesController. Inside the view() method, you would need to
access the passed ID at ``$this->params['id']``.

If you have a single controller in your application and you want
that controller name does not appear in url, e.g have urls like
/demo instead of /home/demo:

::

     Router::connect('/:action', array('controller' => 'home')); 

One more example, and you'll be a routing pro.

::

    Router::connect(
        '/:controller/:year/:month/:day',
        array('action' => 'index', 'day' => null),
        array(
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        )
    );

This is rather involved, but shows how powerful routes can really
become. The URL supplied has four route elements. The first is
familiar to us: it's a default route element that tells CakePHP to
expect a controller name.

Next, we specify some default values. Regardless of the controller,
we want the index() action to be called. We set the day parameter
(the fourth element in the URL) to null to flag it as being
optional.

Finally, we specify some regular expressions that will match years,
months and days in numerical form. Note that parenthesis (grouping)
are not supported in the regular expressions. You can still specify
alternates, as above, but not grouped with parenthesis.

Once defined, this route will match /articles/2007/02/01,
/posts/2004/11/16, and /products/2001/05 (as defined, the day
parameter is optional as it has a default), handing the requests to
the index() actions of their respective controllers, with the date
parameters in $this->params.

Passing parameters to action
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Assuming your action was defined like this and you want to access
the arguments using ``$articleID`` instead of
``$this->params['id']``, just add an extra array in the 3rd
parameter of ``Router::connect()``.

::

    // some_controller.php
    function view($articleID = null, $slug = null) {
        // some code here...
    }
    
    // routes.php
    Router::connect(
        // E.g. /blog/3-CakePHP_Rocks
        '/blog/:id-:slug',
        array('controller' => 'blog', 'action' => 'view'),
        array(
            // order matters since this will simply map ":id" to $articleID in your action
            'pass' => array('id', 'slug'),
            'id' => '[0-9]+'
        )
    );

And now, thanks to the reverse routing capabilities, you can pass
in the url array like below and Cake will know how to form the URL
as defined in the routes.

::

    // view.ctp
    // this will return a link to /blog/3-CakePHP_Rocks
    <?php echo $html->link('CakePHP Rocks', array(
        'controller' => 'blog',
        'action' => 'view',
        'id' => 3,
        'slug' => Inflector::slug('CakePHP Rocks')
    )); ?>

Prefix Routing
~~~~~~~~~~~~~~

Many applications require an administration section where
privileged users can make changes. This is often done through a
special URL such as /admin/users/edit/5. In CakePHP, prefix routing
can be enabled from within the core configuration file by setting
the prefixes with Routing.prefixes. Note that prefixes, although
related to the router, are to be configured in
/app/config/core.php

::

    Configure::write('Routing.prefixes', array('admin'));

In your controller, any action with an ``admin_`` prefix will be
called. Using our users example, accessing the url
/admin/users/edit/5 would call the method ``admin_edit`` of our
``UsersController`` passing 5 as the first parameter. The view file
used would be app/views/users/admin\_edit.ctp

You can map the url /admin to your ``admin_index`` action of pages
controller using following route

::

    Router::connect('/admin', array('controller' => 'pages', 'action' => 'index', 'admin' => true)); 

You can configure the Router to use multiple prefixes too. By
adding additional values to ``Routing.prefixes``. If you set

::

    Configure::write('Routing.prefixes', array('admin', 'manager'));

Cake will automatically generate routes for both the admin and
manager prefixes. Each configured prefix will have the following
routes generated for it.

::

    $this->connect("/{$prefix}/:plugin/:controller", array('action' => 'index', 'prefix' => $prefix, $prefix => true));
    $this->connect("/{$prefix}/:plugin/:controller/:action/*", array('prefix' => $prefix, $prefix => true));
    Router::connect("/{$prefix}/:controller", array('action' => 'index', 'prefix' => $prefix, $prefix => true));
    Router::connect("/{$prefix}/:controller/:action/*", array('prefix' => $prefix, $prefix => true));

Much like admin routing all prefix actions should be prefixed with
the prefix name. So ``/manager/posts/add`` would map to
``PostsController::manager_add()``.

When using prefix routes its important to remember, using the HTML
helper to build your links will help maintain the prefix calls.
Here's how to build this link using the HTML helper:

::

    // Go into a prefixed route.
    echo $html->link('Manage posts', array('manager' => true, 'controller' => 'posts', 'action' => 'add'));
    
    // leave a prefix
    echo $html->link('View Post', array('manager' => false, 'controller' => 'posts', 'action' => 'view', 5));

Plugin routing
~~~~~~~~~~~~~~

Plugin routing uses the **plugin** key. You can create links that
point to a plugin, but adding the plugin key to your url array.

::

    echo $html->link('New todo', array('plugin' => 'todo', 'controller' => 'todo_items', 'action' => 'create'));

Conversely if the active request is a plugin request and you want
to create a link that has no plugin you can do the following.

::

    echo $html->link('New todo', array('plugin' => null, 'controller' => 'users', 'action' => 'profile'));

By setting ``plugin => null`` you tell the Router that you want to
create a link that is not part of a plugin.

File extensions
~~~~~~~~~~~~~~~

To handle different file extensions with your routes, you need one
extra line in your routes config file:

::

    Router::parseExtensions('html', 'rss');

This will tell the router to remove any matching file extensions,
and then parse what remains.

If you want to create a URL such as /page/title-of-page.html you
would create your route as illustrated below:

::

        Router::connect(
            '/page/:title',
            array('controller' => 'pages', 'action' => 'view'),
            array(
                'pass' => array('title')
            )
        );  

Then to create links which map back to the routes simply use:

::

    $html->link('Link title', array('controller' => 'pages', 'action' => 'view', 'title' => Inflector::slug('text to slug', '-'), 'ext' => 'html'))

Custom Route classes
~~~~~~~~~~~~~~~~~~~~

Custom route classes allow you to extend and change how individual
routes parse requests and handle reverse routing. A route class
should extend ``CakeRoute`` and implement one or both of
``match()`` and ``parse()``. Parse is used to parse requests and
match is used to handle reverse routing.

You can use a custom route class when making a route by using the
``routeClass`` option, and loading the file containing your route
before trying to use it.

::

    Router::connect(
         '/:slug', 
         array('controller' => 'posts', 'action' => 'view'),
         array('routeClass' => 'SlugRoute')
    );

This route would create an instance of ``SlugRoute`` and allow you
to implement custom parameter handling
