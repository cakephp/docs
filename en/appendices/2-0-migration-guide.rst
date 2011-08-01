2.0 Migration Guide
###################

This page summarises the changes from CakePHP 1.3 that will assist in a project
migration to 2.0, as well as for a developer reference to get up to date with
the changes made to the core since the CakePHP 1.3 branch. Be sure to read the
other pages in this guide for all the new features and API changes.

PHP Version Support
===================

CakePHP 2.x supports PHP Version 5.2.6 and above. PHP4 support has been dropped.
For developers that are still working with production PHP4 environments, the
CakePHP 1.x versions continue to support PHP4 for the lifetime of their
development and support lifetime.

The move to PHP 5 means all methods and properties have been updated with
visibility keywords. If your code is attempting access to private or protected
methods from a public scope, you will encounter errors.

While this does not really constitute a large framework change, it means that
access to tighter visibility methods and variables is now not possible.

File naming and class loading
=============================

Changes in file naming, folder structure and class loading are summarized int
the 2.0 Class loading page.

Internationalization / Localization
===================================

:php:func:`__()` (Double underscore shortcut function) always returns the translation
(not echo anymore).

If you want to echo the result of the translation, use::

    <?php
    echo __('My Message');
    
This change includes all shortcut translation methods::

    __()
    __n()
    __d()
    __dn()
    __dc()
    __dcn()
    __c()

Alongside this, if you pass additional parameters, the translation will call
`sprintf <http://php.net/manual/en/function.sprintf.php>`_  with these
parameters before returning. For example::

    <?php
    // Will return something like "Called: MyClass:myMethod"
    echo __('Called: %s:%s', $className, $methodName);

It is valid for all shortcut translation methods.

More information about the specifiers, you can see in
`sprintf <http://php.net/manual/en/function.sprintf.php>`_ function.

Renamed files
=============

-  cake/libs/error.php -> cake/libs/error_handler.php
-  cake/console/error.php -> cake/console/console_error_handler.php
-  cake/dispatcher.php -> cake/libs/dispatcher.php
-  cake/console/libs/* -> cake/console/shells/*

Class location and constants changed
====================================

Bootstrapping CakePHP no longer uses PHP's ``include_path`` by default any more.
Instead you should define ``CAKE_CORE_INCLUDE_PATH`` in
``app/webroot/index.php``, and ``app/webroot/test.php``, or use symlinks if you
have CakePHP in a shared directory. You can also use bake to generate projects
with all the paths setup. This change was done primarily to make the
``APP_PATH`` and ``CORE_PATH`` constants have consistent values between the web
and console environments. You can still use PHP's include_path by setting
``CAKE_CORE_INCLUDE_PATH`` to an empty value.

Basics.php
==========

-  ``getMicrotime()`` has been removed. Use the native ``microtime(true)``
   instead.
-  ``e()`` was removed. Use ``echo``.
-  ``r()`` was removed. Use ``str_replace``.
-  ``a()`` was removed. ``Use array()``
-  ``aa()`` was removed. Use ``array()``
-  ``up()`` was removed. Use ``strtoupper()``
-  ``low()`` was removed. Use ``strtolower()``
-  ``params()`` was removed. It was not used anywhere in CakePHP.
-  ``ife()`` was removed. Use a ternary operator.
-  ``uses()`` was removed. Use ``App::import()`` instead.
-  Compatibility functions for PHP4 have been removed.
-  PHP5 constant has been removed.
-  Global var called ``$TIME_START`` was removed use
   ``$_SERVER['REQUEST_TIME']`` instead.

Removed Constants
-----------------

A number of constants were removed, as they were no longer accurate, or
duplicated.

- CONTROLLERS
- ... more needed ...

CakeRequest
===========

This new class encapsulates the parameters and functions related to an incoming
request. It replaces many features inside ``Dispatcher``,
``RequestHandlerComponent`` and Controller. It also replaces
``$this->params`` array in all places. ``CakeRequest`` implements
``ArrayAccess`` so many interactions with the old params array do not need to
change. See the CakeRequest new features for more information.

Request handling, $_GET['url'] and .htaccess files
==================================================

CakePHP no longer uses ``$_GET['url']`` for handling application request paths.
Instead it uses ``$_SERVER['PATH_INFO']``. This provides a more uniform way of
handling requests between servers with URL rewriting and those without. Because
of these changes, you'll need to update your .htaccess files and
``app/webroot/index.php``, as these files were changed to accommodate the
changes. Additionally ``$this->params['url']['url']`` no longer exists. Instead
you should be using $this->request->url to access the same value.

Components
==========

Component is now the required base class for all components. See the component
refactor page for more information.

AclComponent
------------

-  ``AclComponent`` implementations are now required to implement
   ``AclInterface``.
-  ``AclComponent::adapter()`` has been added to allow runtime modification of
   the ``ACL`` implementation the component uses.
-  ``AclComponent::grant()`` has been deprecated, it will be removed in a future
   version. Use ``AclComponent::allow()`` instead.
-  ``AclComponent::revoke()`` has been deprecated, it will be removed in a
   future version. Use AclComponent::deny() instead.

RequestHandlerComponent
-----------------------

Many of RequestHandlerComponent's methods are just proxies for ``CakeRequest``
methods. The following methods have been deprecated and will be removed in
future versions:

-  ``isSsl()``
-  ``isAjax()``
-  ``isPost()``
-  ``isPut()``
-  ``isFlash()``
-  ``isDelete()``
-  ``getReferer()``
-  ``getClientIp()``
-  ``accepts()``, ``prefers()``, ``requestedWith()`` All deal in mapped content
   types now. They no longer work with mime-types. You can use
   ``RequestHandler::setContent()`` to create new content types.
-  ``RequestHandler::setContent()`` no longer accepts an array as a single
   argument, you must supply both arguments.

SecurityComponent
-----------------

SecurityComponent no longer handles Basic and Digest Authentication. These are
both handled by the new AuthComponent. The following methods have been removed
from SecurityComponent:

-  requireLogin()
-  generateDigestResponseHash()
-  loginCredentials()
-  loginRequest()
-  parseDigestAuthData()

In addition the following properties were removed:

-  $loginUsers
-  $requireLogin

Moving these features to AuthComponent was done to provide a single place for
all types of authentication and to streamline the roles of each component.

AuthComponent
-------------

The AuthComponent was entirely re-factored for 2.0, this was done to help reduce
developer confusion and frustration. In addition, AuthComponent was made more
flexible and extensible. You can find out more in 
the :doc:`/core-libraries/components/authentication` guide.

EmailComponent
--------------

The EmailComponent has been deprecated and has created a new library class to
send e-mails. See :doc:`/core-utility-libraries/email` Email changes for more details.

SessionComponent
----------------

Session component has lost the following methods.

* activate()
* active()
* __start()

cakeError removed
=================

The ``cakeError()`` method has been removed. Its recommended that you switch all
uses of ``cakeError`` to use exceptions. ``cakeError`` was removed because it
was simulating exceptions. Instead of simulation, real exceptions are used in
CakePHP 2.0.

Error handling
==============

The error handling implementation has dramatically changed in 2.0. Exceptions
have been introduced throughout the framework, and error handling has been
updated to offer more control and flexibility. You can read more in the
:doc:`/development/exceptions` and :doc:`/development/errors` section.

Lib classes
===========

App
---

-  The API for ``App::build()`` has changed to ``App::build($paths, $mode).`` It
   now allows you to either append, prepend or reset/replace existing paths. The
   $mode param can take any of the following 3 values: App::APPEND,
   App::PREPEND, ``App::RESET``. The default behavior of the function remains
   same (ie. Prepending new paths to existing list).

CakeLog
-------

-  Log streams now need to implement :php:class:`CakeLogInterface`. Exceptions will be raised
   if a configured logger does not.

Cache
-----

-  :php:class:`Cache` is now a static class, it no longer has a getInstance() method.
-  CacheEngine is now an abstract class. You cannot directly create instances of 
   it anymore.
-  CacheEngine implementations must extend CacheEngine, exceptions will be
   raised if a configured class does not.
-  FileCache now requires trailing slashes to be added to the path setting when
   you are modifying a cache configuration.
-  Cache no longer retains the name of the last configured cache engine. This
   means that operations you want to occur on a specific engine need to have the
   $config parameter equal to the config name you want the operation to occur
   on.

::

    <?php
    Cache::config('something');
    Cache::write('key, $value);
    
    // would become
    Cache::write('key', $value, 'something');

Router
------

- You can no longer modify named parameter settings with
  ``Router::setRequestInfo()``. You should use ``Router::connectNamed()`` to
  configure how named parameters are handled.
- Router no longer has a ``getInstance()`` method. It is a static class, call
  its methods and properties statically.
- ``Router::getNamedExpressions()`` is deprecated. Use the new router
  constants. ``Router::ACTION``, ``Router::YEAR``, ``Router::MONTH``,
  ``Router::DAY``, ``Router::ID``, and ``Router::UUID`` instead.
- ``Router::defaults()`` has been removed.  Delete the core routes file
  inclusion from your applications routes.php file to disable default routing.
  Conversely if you want default routing, you will have add an include to 
  ``Cake/Config/routes.php`` in your routes file.

Dispatcher
----------

- Dispatcher has been moved inside of cake/libs, you will have to update your
  ``app/webroot/index.php`` file.
- ``Dispatcher::dispatch()`` now takes two parameters.  The request and
  response objects.  These should be instances of ``CakeRequest`` &
  ``CakeResponse`` or a subclass thereof.
- ``Dispather::parseParams()`` now only accepts a ``CakeRequest`` object.
- ``Dispatcher::baseUrl()`` has been removed.
- ``Dispatcher::getUrl()`` has been removed.
- ``Dispatcher::uri()`` has been removed.
- ``Dispatcher::$here`` has been removed.

Configure
---------

-  ``Configure::read()`` with no parameter no longer returns the value of
   'debug' instead it returns all values in Configure. Use
   ``Configure::read('debug');`` if you want the value of debug.
-  ``Configure::load()`` now requires a ConfigReader to be setup. Read 
   :ref:`loading-configuration-files` for more information.
-  ``Configure::store()`` now writes values to a given Cache configuration. Read
   :ref:`loading-configuration-files` for more information.

Scaffold
--------

-  Scaffold 'edit' views should be renamed to 'form'. This was done to make
   scaffold and bake templates consistent.

   -  ``views/scaffolds/edit.ctp -> ``views/scaffolds/form.ctp``
   -  ``views/posts/scaffold.edit.ctp -> ``views/posts/scaffold.form.ctp``

File
----

-  This class has been deprecated, use ``SplFileObject`` instead.

Folder
------

-  ``Folder::pwd()`` has been removed. Use $folder->path instead.
-  ``Folder::read()`` has been removed. Use DirectoryIterator instead.
-  ``Folder::normalizePath()`` has been removed.
-  ``Folder::correctSlashFor()`` has been removed.
-  ``Folder::slashTerm()`` has been removed.
-  ``Folder::isSlashTerm()`` has been removed.
-  ``Folder::addPathElement()`` has been removed.
- ``Folder::dirsize()`` renamed to ``Folder::dirSize()``.

Xml
---

-  The class Xml was completely re-factored. Now this class does not manipulate
   data anymore, and it is a wrapper to SimpleXMLElement. You can use the follow
   methods:
-  ``Xml::build()``: static method that you can pass a xml string, array, path
   to file or url. The result will be a SimpleXMLElement instance or an
   exception will be thrown in case of error.
-  ``Xml::fromArray():`` static method that returns a SimpleXMLElement from an
   array.
-  ``Xml::toArray()``: static method that returns an array from
   SimpleXMLElement.

You should see the :php:class:`Xml` documentation for more information on the changes made to
the Xml class.

Inflector
---------

-  Inflector no longer has a ``getInstance()`` method.
-  ``Inflector::slug()`` no longer supports the $map argument. Use
   ``Inflector::rules()`` to define transliteration rules.

CakeSession
-----------

CakeSession is now a fully static class, both ``SessionHelper`` and
``SessionComponent`` are wrappers and sugar for it.  It can now easily be used
in models or other contexts.  All of its methods are called statically.

Session configuration has also changed :doc:`/development/sessions <see the
session section for more information>`

Helpers
=======

The following properties on helpers are deprecated, you should use the request
object properties or Helper methods instead of directly accessing these
properties as they will be removed in a future release.

-  ``Helper::$webroot`` is deprecated, use the request object's webroot
   property.
-  ``Helper::$base`` is deprecated, use the request object's base property.
-  ``Helper::$here`` is deprecated, use the request object's here property.
-  ``Helper::$data`` is deprecated, use the request object's data property.
-  ``Helper::$params`` is deprecated, use the ``$this->request`` instead.

AjaxHelper and JavascriptHelper removed
---------------------------------------

The AjaxHelper and JavascriptHelper have been removed as they were deprecated in
version 1.3.

They are replaced with the JsHelper and HtmlHelper.

JsHelper
--------

-  ``JsBaseEngineHelper`` is now abstract, you will need to implement all the
   methods that previously generated errors.

PaginatorHelper
---------------

-  ``PaginatorHelper::sort()`` now takes the title and key arguments in the
   reverse order. $key will always be first now. This was done to prevent
   needing to swap arguments when adding a second one.
-  PaginatorHelper had a number of changes to the paging params used internally.
   The defaults key has been removed.
-  PaginatorHelper now supports generating links with paging parameters in the
   querystring.

There have been a few improvements to pagination in general. For more
information on that you should read the new pagination features page.

FormHelper
----------

$selected parameter removed
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``$selected`` parameter was removed from several methods in ``FormHelper``.
All methods now support a ``$attributes['value']`` key now which should be used
in place of ``$selected``. This change simplifies the ``FormHelper`` methods,
reducing the number of arguments, and reduces the duplication that ``$selected``
created. The affected methods are:

-  FormHelper::select()
-  FormHelper::dateTime()
-  FormHelper::year()
-  FormHelper::month()
-  FormHelper::day()
-  FormHelper::hour()
-  FormHelper::minute()
-  FormHelper::meridian()

Default urls on forms is the current action
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The default url for all forms, is now the current url including passed, named,
and querystring parameters. You can override this default by supplying
``$options['url']`` in the second parameter of ``$this->Form->create()``.

FormHelper::hidden()
~~~~~~~~~~~~~~~~~~~~

Hidden fields no longer remove the class attribute. This means that if there are
validation errors on hidden fields, the ``error-field`` classname will be
applied.

CacheHelper
-----------

CacheHelper has been fully decoupled from View, and uses helper callbacks to
generate caches. You should remember to place CacheHelper after other helpers
that modify content in their ``afterRender`` and ``afterLayout`` callbacks. If
you don't some changes will not be part of the cached content.

CacheHelper also no longer uses ``<cake:nocache>`` to indicate un-cached
regions. Instead it uses special HTML/XML comments. ``<!--nocache-->`` and
``<!--/nocache-->``. This helps CacheHelper generate valid markup and still
perform the same functions as before. You can read more CacheHelper and View
changes.

Controller
==========

- Controller's constructor now takes two parameters. A CakeRequest, and 
  CakeResponse objects. These objects are used to populate several deprecated 
  properties and will be set to $request and $response inside the controller.
- ``Controller::$webroot`` is deprecated, use the request object's webroot
  property.
- ``Controller::$base`` is deprecated, use the request object's base property.
- ``Controller::$here`` is deprecated, use the request object's here property.
- ``Controller::$data`` is deprecated, use the request object's data property.
- ``Controller::$params`` is deprecated, use the ``$this->request`` instead.
- ``Controller::$Component`` has been moved to ``Controller::$Components``.
- ``Controller::$view`` has been renamed to ``Controller::$viewClass``.
  ``Controller::$view`` is now used to change which view file is rendered.
- ``Controller::render()`` now returns a CakeResponse object.

The deprecated properties on Controller will be accessible through a ``__get()``
method. This method will be removed in future versions, so its recommended that
you update your application.

Controller now defines a maxLimit for pagination. This maximum limit is set to
100, but can be overridden in the $paginate options.

View
====

-  ``View::$webroot`` is deprecated, use the request object's webroot property.
-  ``View::$base`` is deprecated, use the request object's base property.
-  ``View::$here`` is deprecated, use the request object's here property.
-  ``View::$data`` is deprecated, use the request object's data property.
-  ``View::$params`` is deprecated, use the ``$this->request`` instead.
-  ``View::$loaded`` has been removed. Use the ``HelperCollection`` to access
   loaded helpers.
- ``View::$model`` has been removed. This behavior is now on :php:class:`Helper`
- ``View::$modelId`` has been removed. This behavior is now on
  :php:class:`Helper`
- ``View::$association`` has been removed. This behavior is now on
  :php:class:`Helper`
- ``View::$fieldSuffix`` has been removed. This behavior is now on
  :php:class:`Helper`
- ``View::entity()`` has been removed. This behavior is now on
  :php:class:`Helper`
-  ``View::_loadHelpers()`` has been removed, used ``View::loadHelpers()``
   instead.
-  How ``View::element()`` uses caching has changed, see below for more
   information.
-  View callbacks have been shifted around, see below for more information
-  API for ``View::element()`` has changed. Read here for more info.

The deprecated properties on View will be accessible through a ``__get()``
method. This method will be removed in future versions, so its recommended that
you update your application.

Callback positioning changes
----------------------------

beforeLayout used to fire after scripts_for_layout and content_for_layout were
prepared. In 2.0, beforeLayout is fired before any of the special variables are
prepared, allowing you to manipulate them before they are passed to the layout,
the same was done for beforeRender. It is now fired well before any view
variables are manipulated. In addition to these changes, helper callbacks always
receive the name of the file about to be rendered. This combined with helpers
being able to access the view through ``$this->_View`` and the current view
content through ``$this->_View->output`` gives you more power than ever before.

Helper callback signature changes
---------------------------------

Helper callbacks now always get one argument passed in. For beforeRender and
afterRender it is the view file being rendered. For beforeLayout and afterLayout
it is the layout file being rendered. Your helpers function signatures should
look like::

    function beforeRender($viewFile) {

    }

    function afterRender($viewFile) {

    }

    function beforeLayout($layoutFile) {

    }

    function afterLayout($layoutFile) {

    }


Element caching, and view callbacks have been changed in 2.0 to help provide you
with more flexibility and consistency. :doc:`views <Read more about those changes>`.

CacheHelper decoupled
---------------------

In previous versions there was a tight coupling between :php:class:`CacheHelper`
and :php:class:`View`. For 2.0 this coupling has been removed and CacheHelper
just uses callbacks like other helpers to generate full page caches.


CacheHelper ``<cake:nocache>`` tags changed
-------------------------------------------

In previous versions, CacheHelper used a special ``<cake:noncache>`` tag as
markers for output that should not be part of the full page cache. These tags
were not part of any XML schema, and were not possible to validate in HTML or
XML documents. For 2.0, these tags have been replaced with HTML/XML comments::

    <cake:noncache> becomes <!--nocache-->
    </cake:nocache> becomes <!--/nocache-->

The internal code for full page view caches has also changed, so be sure to
clear out view cache files when updating.

MediaView changes
-----------------

:php:func:`MediaView::render()` now forces download of unknown file types
instead of just returning false. If you want you provide an alternate download
filename you now specify the full name including extension using key 'name' in
the array parameter passed to the function.


PHPUnit instead of SimpleTest
=============================

All of the core test cases and supporting infrastructure have been ported to use
PHPUnit 3.5. Of course you can continue to use SimpleTest in your application by
replacing the related files. No further support will be given for SimpleTest and
it is recommended that you migrate to PHPUnit as well. For some additional
information on how to migrate your tests see PHPUnit migration hints

No more group tests
-------------------

PHPUnit does not differentiate between group tests and single test cases in the
runner. Because of this, the group test options, and support for old style group
tests has been removed. It is recommended that GroupTests be ported to
``PHPUnit_Framework_Testsuite`` subclasses. You can find several examples ofthis
in CakePHP's test suite. Group test related methods on ``TestManager`` have also
been removed.

Testsuite shell
---------------

The testsuite shell has had its invocation simplified and expanded. You no
longer need to differentiate between ``case`` and ``group``. It is assumed that
all tests are cases. In the past you would have done
``cake testsuite app case models/post`` you can now do ``cake testsuite app
Model/Post``.


The testsuite shell have been refactored to use the PHPUnit cli tool, it now
support all the command line options supported by PHPUnit.
``cake testsuite help`` will show you a list of all possible modifiers.

Models
======

As now models relationships are lazy loaded. You can run into situation when
assigning a value to an inexistent model property will throw errors::

    <?php
    $Post->inexistentProperty[] = 'value';

will throw the error "Notice: Indirect modification of overloaded property
$inexistentProperty has no effect". Assigning an initial value to the property
solves the issue::

    <?php
    $Post->inexistentProperty = array();
    $Post->inexistentProperty[] = 'value';

Or just declare the property in the model class::

    <?php
    class Post {
        var $inexistantPropert = array();
    }

Either of these approaches will solve the notice errors.

The notation of ``find()`` in Cake 1.2 is no longer supported. Finds should use
notation ``$model->find('type', array(PARAMS))`` as Cake 1.3.

Database objets
---------------

DBOs were refactored for this version, being the use of PDO the major change.
Check the DBO changes page for more information.

BehaviorCollection
------------------

-  ``BehaviorCollection`` no longer ``strtolower()'s`` mappedMethods. Behavior
   mappedMethods are now case sensitive.

Plugins
=======

Plugins no longer magically append their plugin prefix to components, helpers
and models used within them. You must be explicit with the components, models,
and helpers you wish to use. In the past::

    var $components = array('Session', 'Comments');

Would look in the controller's plugin before checking app/core components, it
will now only look in the app/core components. If you wish to use objects from a
plugin you must put the plugin name::

    var $components = array('Session', 'Comment.Comments');

This was done to reduce hard to debug issues caused by magic misfiring. It also
improves consistency in an application, as objects have one authoritative way to
reference them.

Console
=======

Much of the console framework was rebuilt for 2.0 to address many of the
following issues:

-  Tightly coupled.
-  It was difficult to make help text for shells.
-  Parameters for shells were tedious to validate.
-  Plugin tasks were not reachable.
-  Objects with too many responsibilities.

Backwards incompatible Shell API changes
----------------------------------------

-  ``Shell`` no longer has an ``AppModel`` instance. This ``AppModel`` instance
   was not correctly built and was problematic.
-  ``Shell::_loadDbConfig()`` has been removed. It was not generic enough to
   stay in Shell. You can use the ``DbConfigTask`` if you need to ask the user
   to create a db config.
-  Shells no longer use ``$this->Dispatcher`` to access stdin, stdout, and
   stderr. They have ``ConsoleOutput`` and ``ConsoleInput`` objects to handle
   that now.
-  Shells lazy load tasks, and use ``TaskCollection`` to provide an interface
   similar to that used for Helpers, Components, and Behaviors for on the fly
   loading of tasks.
-  ``Shell::$shell`` has been removed.
-  ``Shell::_checkArgs()`` has been removed. Configure a ``ConsoleOptionParser``
-  Shells no longer have direct access to ``ShellDispatcher``. You should use
   the ``ConsoleInput``, and ``ConsoleOutput`` objects instead. If you need to
   dispatch other shells, see the section on 'Invoking other shells from your
   shell'.

Backwards incompatible ShellDispatcher API changes
--------------------------------------------------

-  ``ShellDispatcher`` no longer has stdout, stdin, stderr file handles.
-  ``ShellDispatcher::$shell`` has been removed.
-  ``ShellDispatcher::$shellClass`` has been removed.
-  ``ShellDispatcher::$shellName`` has been removed.
-  ``ShellDispatcher::$shellCommand`` has been removed.
-  ``ShellDispatcher::$shellPaths`` has been removed, use
   ``App::path('shells');`` instead.
-  ``ShellDispatcher`` no longer uses 'help' as a magic method that has special
   status. Instead use the ``--help/-h`` options, and an option parser.

Backwards incompatible Shell Changes
------------------------------------

-  Bake's ControllerTask no longer takes ``public`` and ``admin`` as passed
   arguments. They are now options, indicated like ``--admin`` and ``--public``.

Its recommended that you use the help on shells you use to see what if any
arameters have changed. Its also recommended that you read the console new
features for more information on new API's that are available.

Debugging
=========

The ``debug()`` function now defaults to outputting html safe strings. This is
disabled if being used in the console. The ``$showHtml`` option for ``debug()``
can be set to false to disable html-safe output from debug.

ConnectionManager
=================

``ConnectionManager::enumConnectionObjects()`` will now return the current
configuration for each connection created, instead of an array with filename,
classname and plugin, that wasn't really useful.

When defining database connections you will need to made some changes to the way
configs were defined in the past. Basically in the database configuration class,
the key "driver" is not accepted anymore, only "datasource", in order to make it
more consistent. Also, as the datasources have been moved to packages you will
need to pass the package they are located in. Example::

    <?php
    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'login' => 'root',
        'password' => 'root',
        'database' => 'cake',
    );

