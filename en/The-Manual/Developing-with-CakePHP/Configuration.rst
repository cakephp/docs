Configuration
#############

Configuring a CakePHP application is a piece of cake. After you have
installed CakePHP, creating a basic web application requires only that
you setup a database configuration.

There are, however, other optional configuration steps you can take in
order to take advantage of CakePHP flexible architecture. You can easily
add to the functionality inherited from the CakePHP core, configure
additional/different URL mappings (routes), and define
additional/different inflections.

Database Configuration
======================

CakePHP expects database configuration details to be in a file at
app/config/database.php. An example database configuration file can be
found at app/config/database.php.default. A finished configuration
should look something like this.

::

    var $default = array('driver'      => 'mysql',
                         'persistent'  => false,
                         'host'        => 'localhost',
                         'login'       => 'cakephpuser',
                         'password'    => 'c4k3roxx!',
                         'database'    => 'my_cakephp_project',
                         'prefix'      => '');

The $default connection array is used unless another connection is
specified by the $useDbConfig property in a model. For example, if my
application has an additional legacy database in addition to the default
one, I could use it in my models by creating a new $legacy database
connection array similar to the $default array, and by setting var
$useDbConfig = ‘legacy’; in the appropriate models.

Fill out the key/value pairs in the configuration array to best suit
your needs.

+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Key                   | Value                                                                                                                                                                                                                                                                      |
+=======================+============================================================================================================================================================================================================================================================================+
| driver                | The name of the database driver this configuration array is for. Examples: mysql, postgres, sqlite, pear-drivername, adodb-drivername, mssql, oracle, or odbc. Note that for non-database sources (e.g. LDAP, Twitter), leave this blank and use "datasource".             |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| persistent            | Whether or not to use a persistent connection to the database.                                                                                                                                                                                                             |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| host                  | The database server’s hostname (or IP address).                                                                                                                                                                                                                            |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| login                 | The username for the account.                                                                                                                                                                                                                                              |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| password              | The password for the account.                                                                                                                                                                                                                                              |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| database              | The name of the database for this connection to use.                                                                                                                                                                                                                       |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| prefix (*optional*)   | The string that prefixes every table name in the database. If your tables don’t have prefixes, set this to an empty string.                                                                                                                                                |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| port (*optional*)     | The TCP port or Unix socket used to connect to the server.                                                                                                                                                                                                                 |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| encoding              | Indicates the character set to use when sending SQL statements to the server. This defaults to the database's default encoding for all databases other than DB2. If you wish to use UTF-8 encoding with mysql/mysqli connections you must use 'utf8' without the hyphen.   |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| schema                | Used in PostgreSQL database setups to specify which schema to use.                                                                                                                                                                                                         |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| datasource            | non-DBO datasource to use, e.g. 'ldap', 'twitter'                                                                                                                                                                                                                          |
+-----------------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

The prefix setting is for tables, **not** models. For example, if you
create a join table for your Apple and Flavor models, you name it
prefix\_apples\_flavors (**not** prefix\_apples\_prefix\_flavors), and
set your prefix setting to 'prefix\_'.

At this point, you might want to take a look at the :doc:`/The-Manual/Basic-Principles-of-CakePHP/CakePHP-Conventions`. The correct naming for
your tables (and the addition of some columns) can score you some free
functionality and help you avoid configuration. For example, if you name
your database table big\_boxes, your model BigBox, your controller
BigBoxesController, everything just works together automatically. By
convention, use underscores, lower case, and plural forms for your
database table names - for example: bakers, pastry\_stores, and
savory\_cakes.

Core Configuration
==================

Application configuration in CakePHP is found in /app/config/core.php.
This file is a collection of Configure class variable definitions and
constant definitions that determine how your application behaves. Before
we dive into those particular variables, you’ll need to be familiar with
Configure, CakePHP’s configuration registry class.

The Configuration Class
=======================

Despite few things needing to be configured in CakePHP, it’s sometimes
useful to have your own configuration rules for your application. In the
past you may have defined custom configuration values by defining
variable or constants in some files. Doing so forces you to include that
configuration file every time you needed to use those values.

CakePHP’s new Configure class can be used to store and retrieve
application or runtime specific values. Be careful, this class allows
you to store anything in it, then use it in any other part of your code:
a sure temptation to break the MVC pattern CakePHP was designed for. The
main goal of Configure class is to keep centralized variables that can
be shared between many objects. Remember to try to live by "convention
over configuration" and you won't end up breaking the MVC structure
we’ve set in place.

This class acts as a singleton and its methods can be called from
anywhere within your application, in a static context.

::

    <?php Configure::read('debug'); ?>

Configure Methods
-----------------

write
~~~~~

``write(string $key, mixed $value)``

Use ``write()`` to store data in the application’s configuration.

::

    Configure::write('Company.name','Pizza, Inc.');
    Configure::write('Company.slogan','Pizza for your body and soul');

The dot notation used in the ``$key`` parameter can be used to organize
your configuration settings into logical groups.

The above example could also be written in a single call:

::

    Configure::write(
        'Company',array('name'=>'Pizza, Inc.','slogan'=>'Pizza for your body and soul')
    );

You can use ``Configure::write('debug', $int)`` to switch between debug
and production modes on the fly. This is especially handy for AMF or
SOAP interactions where debugging information can cause parsing
problems.

read
~~~~

``read(string $key = 'debug')``

Used to read configuration data from the application. Defaults to
CakePHP’s important debug value. If a key is supplied, the data is
returned. Using our examples from write() above, we can read that data
back:

::

    Configure::read('Company.name');    //yields: 'Pizza, Inc.'
    Configure::read('Company.slogan');  //yields: 'Pizza for your body and soul'
     
    Configure::read('Company');
     
    //yields: 
    array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');

delete
~~~~~~

``delete(string $key)``

Used to delete information from the application’s configuration.

::

    Configure::delete('Company.name');

load
~~~~

``load(string $path)``

Use this method to load configuration information from a specific file.

::

    // /app/config/messages.php:
    <?php
    $config['Company']['name'] = 'Pizza, Inc.';
    $config['Company']['slogan'] = 'Pizza for your body and soul';
    $config['Company']['phone'] = '555-55-55';
    ?>
     
    <?php
    Configure::load('messages');
    Configure::read('Company.name');
    ?>

Every configure key-value pair is represented in the file with the
``$config`` array. Any other variables in the file will be ignored by
the ``load()`` function.

version
~~~~~~~

``version()``

Returns the CakePHP version for the current application.

CakePHP Core Configuration Variables
------------------------------------

The Configure class is used to manage a set of core CakePHP
configuration variables. These variables can be found in
app/config/core.php. Below is a description of each variable and how it
affects your CakePHP application.

Configure Variable

Description

debug

Changes CakePHP debugging output.
 0 = Production mode. No output.
 1 = Show errors and warnings.
 2 = Show errors, warnings, and SQL. [SQL log is only shown when you add $this->element('sql\_dump') to your view or layout.]

App.baseUrl

Un-comment this definition if you **don’t** plan to use Apache’s
mod\_rewrite with CakePHP. Don’t forget to remove your .htaccess files
too.

Routing.prefixes

Un-comment this definition if you’d like to take advantage of CakePHP
prefixed routes like admin. Set this variable with an array of prefix
names of the routes you’d like to use. More on this later.

Cache.disable

When set to true, caching is disabled site-wide.

Cache.check

If set to true, enables view caching. Enabling is still needed in the
controllers, but this variable enables the detection of those settings.

Session.save

Tells CakePHP which session storage mechanism to use.


useful in conjunction with Memcache (in setups with multiple application
servers) to store both cached data and sessions.


the table using the SQL file located at /app/config/sql/sessions.sql.

Session.model

The model name to be used for the session model. The model name set here
should \*not\* be used elsewhere in your application.

Session.table

This value has been deprecated as of CakePHP 1.3

Session.database

The name of the database that stores session information.

Session.cookie

The name of the cookie used to track sessions.

Session.timeout

Base session timeout in seconds. Actual value depends on Security.level.

Session.start

Automatically starts sessions when set to true.

Session.checkAgent

When set to false, CakePHP sessions will not check to ensure the user
agent does not change between requests.

Security.level

The level of CakePHP security. The session timeout time defined in
'Session.timeout' is multiplied according to the settings here.

 'high' = x 10
 'medium' = x 100
 'low' = x 300
 'high' and 'medium' also enable `session.referer\_check <https://www.php.net/manual/en/session.configuration.php#ini.session.referer-check>`_

'Security.level' is set to 'high'.

Security.salt

A random string used in security hashing.

Security.cipherSeed

A random numeric string (digits only) used to encrypt/decrypt strings.

Asset.timestamp

Appends a timestamp which is last modified time of the particular file
at the end of asset files urls (CSS, JavaScript, Image) when using
proper helpers.

Valid values:
 (bool) false - Doesn't do anything (default)
 (bool) true - Appends the timestamp when debug > 0
 (string) 'force' - Appends the timestamp when debug >= 0

Acl.classname, Acl.database

Constants used for CakePHP’s Access Control List functionality. See the
Access Control Lists chapter for more information.

Cache configuration is also found in core.php — We’ll be covering that
later on, so stay tuned.

The Configure class can be used to read and write core configuration
settings on the fly. This can be especially handy if you want to turn
the debug setting on for a limited section of logic in your application,
for instance.

Configuration Constants
-----------------------

While most configuration options are handled by Configure, there are a
few constants that CakePHP uses during runtime.

+--------------+------------------------------------------------------------------------------------------------------------+
| Constant     | Description                                                                                                |
+==============+============================================================================================================+
| LOG\_ERROR   | Error constant. Used for differentiating error logging and debugging. Currently PHP supports LOG\_DEBUG.   |
+--------------+------------------------------------------------------------------------------------------------------------+

The App Class
=============

Loading additional classes has become more streamlined in CakePHP. In
previous versions there were different functions for loading a needed
class based on the type of class you wanted to load. These functions
have been deprecated, all class and library loading should be done
through App::import() now. App::import() ensures that a class is only
loaded once, that the appropriate parent class has been loaded, and
resolves paths automatically in most cases.

Make sure you follow the :doc:`/The-Manual/Basic-Principles-of-CakePHP/CakePHP-Conventions`.

Using App::import()
-------------------

``App::import($type, $name, $parent, $search, $file, $return);``

At first glance ``App::import`` seems complex, however in most use cases
only 2 arguments are required.

Importing Core Libs
-------------------

Core libraries such as Sanitize, and Xml can be loaded by:

::

    App::import('Core', 'Sanitize');

The above would make the Sanitize class available for use.

Importing Controllers, Models, Components, Behaviors, Views and Helpers
-----------------------------------------------------------------------

All application related classes should also be loaded with
App::import(). The following examples illustrate how to do so.

Loading Controllers
~~~~~~~~~~~~~~~~~~~

``App::import('Controller', 'MyController');``

Calling ``App::import`` is equivalent to ``require``'ing the file. It is
important to realize that the class subsequently needs to be
initialized.

::

    <?php
    // The same as require('controllers/users_controller.php');
    App::import('Controller', 'Users');

    // We need to load the class
    $Users = new UsersController;

    // If we want the model associations, components, etc to be loaded
    $Users->constructClasses();
    ?>

Loading Models
~~~~~~~~~~~~~~

``App::import('Model', 'MyModel');``

Loading Components
~~~~~~~~~~~~~~~~~~

``App::import('Component', 'Auth');``

::

    <?php
    App::import('Component', 'Mailer');

    // We need to load the class
    $Mailer = new MailerComponent();

    ?>

Loading Behaviors
~~~~~~~~~~~~~~~~~

``App::import('Behavior', 'Tree');``

Loading Views
~~~~~~~~~~~~~

``App::import('View', 'Media');``

Keep in mind that even though view class is named like ``MediaView``
when loading it with App::import() we only use 'Media' and not
'MediaView'

Loading Helpers
~~~~~~~~~~~~~~~

``App::import('Helper', 'Html');``

Loading from Plugins
--------------------

Loading classes in plugins works much the same as loading app and core
classes except you must specify the plugin you are loading from.

::

    App::import('Model', 'PluginName.Comment');

Loading views in plugins works much the same as well. If your View class
is called TwigView, then use the following

::

    App::import('View', 'PluginName.Twig');

To load APP/plugins/plugin\_name/vendors/flickr/flickr.php

::

    App::import('Vendor', 'PluginName.flickr/flickr');

Loading Vendor Files
--------------------

The vendor() function has been deprecated. Vendor files should now be
loaded through App::import() as well. The syntax and additional
arguments are slightly different, as vendor file structures can differ
greatly, and not all vendor files contain classes.

The following examples illustrate how to load vendor files from a number
of path structures. These vendor files could be located in any of the
vendor folders.

Vendor examples
~~~~~~~~~~~~~~~

To load **vendors/geshi.php**

::

    App::import('Vendor', 'geshi');

The geishi file must be a lower-case file name as Cake will not find it
otherwise.

To load **vendors/flickr/flickr.php**

::

    App::import('Vendor', 'flickr/flickr');

To load **vendors/some.name.php**

::

    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));

To load **vendors/services/well.named.php**

::

    App::import('Vendor', 'WellNamed', array('file' => 'services'.DS.'well.named.php'));

It wouldn't make a difference if your vendor files are inside your
/app/vendors directory. Cake will automatically find it.

To load **app/vendors/vendorName/libFile.php**

::

    App::import('Vendor', 'aUniqueIdentifier', array('file' =>'vendorName'.DS.'libFile.php'));

Routes Configuration
====================

Routing is a feature that maps URLs to controller actions. It was added
to CakePHP to make pretty URLs more configurable and flexible. Using
Apache’s mod\_rewrite is not required for using routes, but it will make
your address bar look much more tidy.

Default Routing
---------------

Before you learn about configuring your own routes, you should know that
CakePHP comes configured with a default set of routes. CakePHP’s default
routing will get you pretty far in any application. You can access an
action directly via the URL by putting its name in the request. You can
also pass parameters to your controller actions using the URL.

::

        URL pattern default routes: 
        http://example.com/controller/action/param1/param2/param3

The URL /posts/view maps to the view() action of the PostsController,
and /products/view\_clearance maps to the view\_clearance() action of
the ProductsController. If no action is specified in the URL, the
index() method is assumed.

The default routing setup also allows you to pass parameters to your
actions using the URL. A request for /posts/view/25 would be equivalent
to calling view(25) on the PostsController, for example.

Passed arguments
----------------

Passed arguments are additional arguments or path segments that are used
when making a request. They are often used to pass parameters to your
controller methods.

::

    http://localhost/calendars/view/recent/mark

In the above example, both ``recent`` and ``mark`` are passed arguments
to ``CalendarsController::view()``. Passed arguments are given to your
controllers in three ways. First as arguments to the action method
called, and secondly they are available in ``$this->params['pass']`` as
a numerically indexed array. Lastly there is ``$this->passedArgs``
available in the same way as the second one. When using custom routes
you can force particular parameters to go into the passed arguments as
well. See :doc:`/The-Manual/Developing-with-CakePHP/Configuration`
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

$this->passedArgs may also contain Named parameters as a named array
mixed with Passed arguments.

Named parameters
----------------

You can name parameters and send their values using the URL. A request
for /posts/view/title:first/category:general would result in a call to
the view() action of the PostsController. In that action, you’d find the
values of the title and category parameters inside
$this->passedArgs[‘title’] and $this->passedArgs[‘category’]
respectively. You can also access named parameters from
``$this->params['named']``. ``$this->params['named']`` contains an array
of named parameters indexed by their name.

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
parameters will break your custom routes. In order to solve this you
should inform the Router about which parameters are intended to be named
parameters. Without this knowledge the Router is unable to determine
whether named parameters are intended to actually be named parameters or
routed parameters, and defaults to assuming you intended them to be
routed parameters. To connect named parameters in the router use
``Router::connectNamed()``.

::

    Router::connectNamed(array('chapter', 'section'));

Will ensure that your chapter and section parameters reverse route
correctly.

Defining Routes
---------------

Defining your own routes allows you to define how your application will
respond to a given URL. Define your own routes in the
/app/config/routes.php file using the ``Router::connect()`` method.

The ``connect()`` method takes up to three parameters: the URL you wish
to match, the default values for your route elements, and regular
expression rules to help the router match elements in the URL.

The basic format for a route definition is:

::

    Router::connect(
        'URL',
        array('paramName' => 'defaultValue'),
        array('paramName' => 'matchingRegex')
    )

The first parameter is used to tell the router what sort of URL you're
trying to control. The URL is a normal slash delimited string, but can
also contain a wildcard (\*) or route elements (variable names prefixed
with a colon). Using a wildcard tells the router what sorts of URLs you
want to match, and specifying route elements allows you to gather
parameters for your controller actions.

Once you've specified a URL, you use the last two parameters of
``connect()`` to tell CakePHP what to do with a request once it has been
matched. The second parameter is an associative array. The keys of the
array should be named after the route elements in the URL, or the
default elements: :controller, :action, and :plugin. The values in the
array are the default values for those keys. Let's look at some basic
examples before we start using the third parameter of connect().

::

    Router::connect(
        '/pages/*',
        array('controller' => 'pages', 'action' => 'display')
    );

This route is found in the routes.php file distributed with CakePHP
(line 40). This route matches any URL starting with /pages/ and hands it
to the ``display()`` method of the ``PagesController();`` The request
/pages/products would be mapped to
``PagesController->display('products')``, for example.

::

    Router::connect(
        '/government',
        array('controller' => 'products', 'action' => 'display', 5)
    );

This second example shows how you can use the second parameter of
``connect()`` to define default parameters. If you built a site that
features products for different categories of customers, you might
consider creating a route. This allows you link to /government rather
than /products/display/5.

Another common use for the Router is to define an "alias" for a
controller. Let's say that instead of accessing our regular URL at
/users/someAction/5, we'd like to be able to access it by
/cooks/someAction/5. The following route easily takes care of that:

::

    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

This is telling the Router that any url beginning with /cooks/ should be
sent to the users controller.

When generating urls, routes are used too. Using
``array('controller' => 'users', 'action' => 'someAction', 5)`` as a url
will output /cooks/someAction/5 if the above route is the first match
found

If you are planning to use custom named arguments with your route, you
have to make the router aware of it using the ``Router::connectNamed``
function. So if you want the above route to match urls like
``/cooks/someAction/type:chef`` we do:

::

    Router::connectNamed(array('type'));
    Router::connect(
        '/cooks/:action/*', array('controller' => 'users', 'action' => 'index')
    );

You can specify your own route elements, doing so gives you the power to
define places in the URL where parameters for controller actions should
lie. When a request is made, the values for these route elements are
found in $this->params of the controller. This is different than named
parameters are handled, so note the difference: named parameters
(/controller/action/name:value) are found in $this->passedArgs, whereas
custom route element data is found in $this->params. When you define a
custom route element, you also need to specify a regular expression -
this tells CakePHP how to know if the URL is correctly formed or not.

::

    Router::connect(
        '/:controller/:id',
        array('action' => 'view'),
        array('id' => '[0-9]+')
    );

This simple example illustrates how to create a quick way to view models
from any controller by crafting a URL that looks like
/controllername/id. The URL provided to connect() specifies two route
elements: :controller and :id. The :controller element is a CakePHP
default route element, so the router knows how to match and identify
controller names in URLs. The :id element is a custom route element, and
must be further clarified by specifying a matching regular expression in
the third parameter of connect(). This tells CakePHP how to recognize
the ID in the URL as opposed to something else, such as an action name.

Once this route has been defined, requesting /apples/5 is the same as
requesting /apples/view/5. Both would call the view() method of the
ApplesController. Inside the view() method, you would need to access the
passed ID at ``$this->params['id']``.

If you have a single controller in your application and you want that
controller name does not appear in url, e.g have urls like /demo instead
of /home/demo:

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
become. The URL supplied has four route elements. The first is familiar
to us: it's a default route element that tells CakePHP to expect a
controller name.

Next, we specify some default values. Regardless of the controller, we
want the index() action to be called. We set the day parameter (the
fourth element in the URL) to null to flag it as being optional.

Finally, we specify some regular expressions that will match years,
months and days in numerical form. Note that parenthesis (grouping) are
not supported in the regular expressions. You can still specify
alternates, as above, but not grouped with parenthesis.

Once defined, this route will match /articles/2007/02/01,
/posts/2004/11/16, and /products/2001/05 (as defined, the day parameter
is optional as it has a default), handing the requests to the index()
actions of their respective controllers, with the date parameters in
$this->params.

Passing parameters to action
----------------------------

Assuming your action was defined like this and you want to access the
arguments using ``$articleID`` instead of ``$this->params['id']``, just
add an extra array in the 3rd parameter of ``Router::connect()``.

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

And now, thanks to the reverse routing capabilities, you can pass in the
url array like below and Cake will know how to form the URL as defined
in the routes.

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
--------------

Many applications require an administration section where privileged
users can make changes. This is often done through a special URL such as
/admin/users/edit/5. In CakePHP, prefix routing can be enabled from
within the core configuration file by setting the prefixes with
Routing.prefixes. Note that prefixes, although related to the router,
are to be configured in /app/config/core.php

::

    Configure::write('Routing.prefixes', array('admin'));

In your controller, any action with an ``admin_`` prefix will be called.
Using our users example, accessing the url /admin/users/edit/5 would
call the method ``admin_edit`` of our ``UsersController`` passing 5 as
the first parameter. The view file used would be
app/views/users/admin\_edit.ctp

You can map the url /admin to your ``admin_index`` action of pages
controller using following route

::

    Router::connect('/admin', array('controller' => 'pages', 'action' => 'index', 'admin' => true)); 

You can configure the Router to use multiple prefixes too. By adding
additional values to ``Routing.prefixes``. If you set

::

    Configure::write('Routing.prefixes', array('admin', 'manager'));

Cake will automatically generate routes for both the admin and manager
prefixes. Each configured prefix will have the following routes
generated for it.

::

    $this->connect("/{$prefix}/:plugin/:controller", array('action' => 'index', 'prefix' => $prefix, $prefix => true));
    $this->connect("/{$prefix}/:plugin/:controller/:action/*", array('prefix' => $prefix, $prefix => true));
    Router::connect("/{$prefix}/:controller", array('action' => 'index', 'prefix' => $prefix, $prefix => true));
    Router::connect("/{$prefix}/:controller/:action/*", array('prefix' => $prefix, $prefix => true));

Much like admin routing all prefix actions should be prefixed with the
prefix name. So ``/manager/posts/add`` would map to
``PostsController::manager_add()``.

When using prefix routes its important to remember, using the HTML
helper to build your links will help maintain the prefix calls. Here's
how to build this link using the HTML helper:

::

    // Go into a prefixed route.
    echo $html->link('Manage posts', array('manager' => true, 'controller' => 'posts', 'action' => 'add'));

    // leave a prefix
    echo $html->link('View Post', array('manager' => false, 'controller' => 'posts', 'action' => 'view', 5));

Plugin routing
--------------

Plugin routing uses the **plugin** key. You can create links that point
to a plugin, but adding the plugin key to your url array.

::

    echo $html->link('New todo', array('plugin' => 'todo', 'controller' => 'todo_items', 'action' => 'create'));

Conversely if the active request is a plugin request and you want to
create a link that has no plugin you can do the following.

::

    echo $html->link('New todo', array('plugin' => null, 'controller' => 'users', 'action' => 'profile'));

By setting ``plugin => null`` you tell the Router that you want to
create a link that is not part of a plugin.

File extensions
---------------

To handle different file extensions with your routes, you need one extra
line in your routes config file:

::

    Router::parseExtensions('html', 'rss');

This will tell the router to remove any matching file extensions, and
then parse what remains.

If you want to create a URL such as /page/title-of-page.html you would
create your route as illustrated below:

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
--------------------

Custom route classes allow you to extend and change how individual
routes parse requests and handle reverse routing. A route class should
extend ``CakeRoute`` and implement one or both of ``match()`` and
``parse()``. Parse is used to parse requests and match is used to handle
reverse routing.

You can use a custom route class when making a route by using the
``routeClass`` option, and loading the file containing your route before
trying to use it.

::

    Router::connect(
         '/:slug', 
         array('controller' => 'posts', 'action' => 'view'),
         array('routeClass' => 'SlugRoute')
    );

This route would create an instance of ``SlugRoute`` and allow you to
implement custom parameter handling

Inflections
===========

Cake's naming conventions can be really nice - you can name your
database table big\_boxes, your model BigBox, your controller
BigBoxesController, and everything just works together automatically.
The way CakePHP knows how to tie things together is by *inflecting* the
words between their singular and plural forms.

There are occasions (especially for our non-English speaking friends)
where you may run into situations where CakePHP's inflector (the class
that pluralizes, singularizes, camelCases, and under\_scores) might not
work as you'd like. If CakePHP won't recognize your Foci or Fish, you
can tell CakePHP about your special cases.

**Loading custom inflections**

You can use ``Inflector::rules()`` in the file app/config/bootstrap.php
to load custom inflections.

::

    Inflector::rules('singular', array(
        'rules' => array('/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

or

::

    Inflector::rules('plural', array('irregular' => array('phylum' => 'phyla')));

Will merge the supplied rules into the inflection sets defined in
cake/libs/inflector.php, with the added rules taking precedence over the
core rules.

Bootstrapping CakePHP
=====================

If you have any additional configuration needs, use CakePHP’s bootstrap
file, found in /app/config/bootstrap.php. This file is executed just
after CakePHP’s core bootstrapping.

This file is ideal for a number of common bootstrapping tasks:

-  Defining convenience functions
-  Registering global constants
-  Defining additional model, view, and controller paths

Be careful to maintain the MVC software design pattern when you add
things to the bootstrap file: it might be tempting to place formatting
functions there in order to use them in your controllers.

Resist the urge. You’ll be glad you did later on down the line.

You might also consider placing things in the AppController class. This
class is a parent class to all of the controllers in your application.
AppController is a handy place to use controller callbacks and define
methods to be used by all of your controllers.
