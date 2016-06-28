2.0 Migration Guide
###################

This page summarizes the changes from CakePHP 1.3 that will assist in a project
migration to 2.0, as well as for a developer reference to get up to date with
the changes made to the core since the CakePHP 1.3 branch. Be sure to read the
other pages in this guide for all the new features and API changes.

.. tip::

    Be sure to checkout the :ref:`upgrade-shell` included in the 2.0 core to help you
    migrate your 1.3 code to 2.0.

PHP Version Support
===================

CakePHP 2.x supports PHP Version 5.2.8 and above. PHP4 support has been dropped.
For developers that are still working with production PHP4 environments, the
CakePHP 1.x versions continue to support PHP4 for the lifetime of their
development and support lifetime.

The move to PHP 5 means all methods and properties have been updated with
visibility keywords. If your code is attempting access to private or protected
methods from a public scope, you will encounter errors.

While this does not really constitute a large framework change, it means that
access to tighter visibility methods and variables is now not possible.

File and Folder naming
======================

In CakePHP 2.0 we rethought the way we are structuring our files and folders.
Given that PHP 5.3 is supporting namespaces we decided to prepare our code base
for adopting in a near future this PHP version, so we adopted the
https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md. At first
we glanced at the internal structure of CakePHP 1.3 and realized that after all
these years there was no clear organization in the files, nor did the directory
structure really hint where each file should be located. With this change we
would be allowed to experiment a little with (almost) automatic class loading
for increasing the overall framework performance.

Biggest roadblock for achieving this was maintaining some sort of backwards
compatibility in the way the classes are loaded right now, and we definitely did
not want to become a framework of huge class prefixes, having class names like
``My_Huge_Class_Name_In_Package``. We decided adopting a strategy of keeping simple
class names while offering a very intuitive way of declaring class locations and
clear migration path for future PHP 5.3 version of CakePHP. First let's
highlight the main changes in file naming standard we adopted:

File names
----------

All files containing classes should be named after the class it contains. No
file should contain more than one class. So, no more lowercasing and
underscoring your file names. Here are some examples:

* ``my_things_controller.php`` becomes ``MyThingsController.php``
* ``form.php`` (a Helper) becomes ``FormHelper.php``
* ``session.php`` (a Component) becomes ``SessionComponent.php``

This makes file naming a lot more clear and consistent across applications,
and also avoids a few edge cases where the file loader would get confused in the
past and load files it should not.

Folder Names
------------

Most folders should be also CamelCased, especially when containing classes.
Think of namespaces, each folder represents a level in the namespacing
hierarchy, folders that do not contain classes, or do not constitute a
namespace on themselves, should be lowercased.

CamelCased Folders:

* Config
* Console
* Controller
* Controller/Component
* Lib
* Locale
* Model
* Model/Behavior
* Plugin
* Test
* Vendor
* View
* View/Helper

lowercased Folders:

* tmp
* webroot

htaccess (URL Rewriting)
========================

In your ``app/webroot/.htaccess`` replace line ``RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]`` with ``RewriteRule ^(.*)$ index.php [QSA,L]``

AppController / AppModel / AppHelper / AppShell
===============================================

The ``app/app_controller.php``, ``app/app_model.php``, ``app/app_helper.php`` are now located and
named as ``app/Controller/AppController.php``, ``app/Model/AppModel.php`` and ``app/View/Helper/AppHelper.php`` respectively.

Also all shell/task now extend AppShell. You can have your custom AppShell.php at ``app/Console/Command/AppShell.php``

Internationalization / Localization
===================================

:php:func:`__()` (Double underscore shortcut function) always returns the translation
(not echo anymore).

If you want to echo the result of the translation, use::

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

    // Will return something like "Called: MyClass:myMethod"
    echo __('Called: %s:%s', $className, $methodName);

It is valid for all shortcut translation methods.

More information about the specifiers, you can see in
`sprintf <http://php.net/manual/en/function.sprintf.php>`_ function.


Class location and constants changed
====================================

The constants ``APP`` and ``CORE_PATH``
have consistent values between the web and console environments. In previous
versions of CakePHP these values changed depending on your environment.

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
-  Global var called ``$TIME_START`` was removed use the constant
   ``TIME_START`` or ``$_SERVER['REQUEST_TIME']`` instead.

Removed Constants
-----------------

A number of constants were removed, as they were no longer accurate, or
duplicated.

* APP_PATH
* BEHAVIORS
* COMPONENTS
* CONFIGS
* CONSOLE_LIBS
* CONTROLLERS
* CONTROLLER_TESTS
* ELEMENTS
* HELPERS
* HELPER_TESTS
* LAYOUTS
* LIB_TESTS
* LIBS
* MODELS
* MODEL_TESTS
* SCRIPTS
* VIEWS

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
This attribute now contains the url without the leading slash ``/`` prepended.

Note: For the homepage itself (``http://domain/``) $this->request->url now returns
boolean ``false`` instead of ``/``. Make sure you check on that accordingly::

    if (!$this->request->url) {} // instead of $this->request->url === '/'

Components
==========

Component is now the required base class for all components. You should update
your components and their constructors, as both have changed::

    class PrgComponent extends Component {
        public function __construct(ComponentCollection $collection,
          $settings = array()) {
            parent::__construct($collection, $settings);
        }
    }

As with helpers it is important to call ``parent::__construct()`` in components with
overridden constructors. Settings for a component are also passed into the
constructor now, and not the ``initialize()`` callback. This makes getting well
constructed objects easier, and allows the base class to handle setting the
properties up.

Since settings have been moved to the component constructor, the
``initialize()`` callback no longer receives ``$settings`` as its 2nd parameter.
You should update your components to use the following method signature::

    public function initialize(Controller $controller) { }

Additionally, the initialize() method is only called on components that are
enabled. This usually means components that are directly attached to the
controller object.

Deprecated callbacks removed
----------------------------

All the deprecated callbacks in Component have not been transferred to
ComponentCollection. Instead you should use the `trigger()` method to interact
with callbacks. If you need to trigger a callback you could do so by calling::

    $this->Components->trigger('someCallback', array(&$this));

Changes in disabling components
-------------------------------

In the past you were able to disable components via `$this->Auth->enabled =
false;` for example. In CakePHP 2.0 you should use the ComponentCollection's
disable method, `$this->Components->disable('Auth');`. Using the enabled
property will not work.

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

The ``cakeError()`` method has been removed. It's recommended that you switch all
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

The API for ``App::build()`` has changed to ``App::build($paths, $mode).`` It
now allows you to either append, prepend or reset/replace existing paths. The
$mode param can take any of the following 3 values: App::APPEND,
App::PREPEND, ``App::RESET``. The default behavior of the function remains the
same (ie. Prepending new paths to existing list).

App::path()
~~~~~~~~~~~

* Now supports plugins, App::path('Controller', 'Users') will return the folder
  location of the controllers in the Users plugin.
* Won't merge core paths anymore, it will
  only return paths defined in App::build() or default ones in app (or
  corresponding plugin).

App::build()
~~~~~~~~~~~~

* Will not merge app path with core paths anymore.

App::objects()
~~~~~~~~~~~~~~

* Now supports plugins, App::objects('Users.Model') will return the models in
  plugin Users.
* Returns array() instead of false for empty results or invalid types.
* Does not return core objects anymore, App::objects('core') will return array().
* Returns the complete class name.

App class lost the following properties, use method App::path() to access their value

* App::$models
* App::$behaviors
* App::$controllers
* App::$components
* App::$datasources
* App::$libs
* App::$views
* App::$helpers
* App::$plugins
* App::$vendors
* App::$locales
* App::$shells

App::import()
~~~~~~~~~~~~~

* No longer looks for classes recursively, it strictly uses the values for the
  paths defined in App::build().
* Will not be able to load App::import('Component', 'Component') use
  App::uses('Component', 'Controller');
* Using App::import('Lib', 'CoreClass') to load core classes is no longer
  possible.
* Importing a non-existent file, supplying a wrong type or package name, or null
  values for $name and $file parameters will result in a false return value.
* App::import('Core', 'CoreClass') is no longer supported, use App::uses()
  instead and let the class autoloading do the rest.
* Loading Vendor files does not look recursively in the vendors folder, it will
  also no longer convert the file to underscored as it did in the past.

App::core()
~~~~~~~~~~~

* First parameter is no longer optional, it will always return one path
* It can't be used anymore to get the vendors paths
* It will only accept new style package names

Class loading with App::uses()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Although there has been a huge refactoring in how the classes are loaded, in very
few occasions you will need to change your application code to respect the way you were
used to doing it. The biggest change is the introduction of a new method::

    App::uses('AuthComponent', 'Controller/Component');

We decided the function name should emulate PHP 5.3's ``use`` keyword, just as a way
of declaring where a class name should be located. The first parameter of
:php:meth:`App::uses()` is the complete name of the class you intend to load,
and the second one, the package name (or namespace) where it belongs to. The
main difference with CakePHP 1.3's :php:meth:`App::import()` is that the former
won't actually import the class, it will just setup the system so when the class
is used for the first time it will be located.

Some examples on using :php:meth:`App::uses()` when migrating from
:php:meth:`App::import()`::

    App::import('Controller', 'Pages');
    // becomes
    App::uses('PagesController', 'Controller');

    App::import('Component', 'Auth');
    // becomes
    App::uses('AuthComponent', 'Controller/Component');

    App::import('View', 'Media');
    // becomes
    App::uses('MediaView', 'View');

    App::import('Core', 'Xml');
    // becomes
    App::uses('Xml', 'Utility');

    App::import('Datasource', 'MongoDb.MongoDbSource');
    // becomes
    App::uses('MongoDbSource', 'MongoDb.Model/Datasource');

All classes that were loaded in the past using ``App::import('Core', $class);``
will need to be loaded using ``App::uses()`` referring to the correct package.
See the API to locate the classes in their new folders. Some examples::

    App::import('Core', 'CakeRoute');
    // becomes
    App::uses('CakeRoute', 'Routing/Route');

    App::import('Core', 'Sanitize');
    // becomes
    App::uses('Sanitize', 'Utility');

    App::import('Core', 'HttpSocket');
    // becomes
    App::uses('HttpSocket', 'Network/Http');

In contrast to how :php:meth:`App::import()` worked in the past, the new class
loader will not locate classes recursively. This led to an impressive
performance gain even on develop mode, at the cost of some seldom used features
that always caused side effects. To be clear again, the class loader will only
fetch the class in the exact package in which you told it to find it.

App::build() and core paths
~~~~~~~~~~~~~~~~~~~~~~~~~~~

:php:meth:`App::build()` will not merge app paths with core paths anymore.

Examples::

    App::build(array('controllers' => array('/full/path/to/controllers')));
    //becomes
    App::build(array('Controller' => array('/full/path/to/Controller')));

    App::build(array('helpers' => array('/full/path/to/controllers')));
    //becomes
    App::build(array('View/Helper' => array('/full/path/to/View/Helper')));

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

    Cache::config('something');
    Cache::write('key', $value);

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
- ``Router::defaults()`` has been removed. Delete the core routes file
  inclusion from your applications routes.php file to disable default routing.
  Conversely if you want default routing, you will have to add an include to
  ``Cake/Config/routes.php`` in your routes file.
- When using Router::parseExtensions() the extension parameter is no longer
  under ``$this->params['url']['ext']``. Instead it is available at
  ``$this->request->params['ext']``.
- Default plugin routes have changed. Plugin short routes are no longer built
  in for any actions other than index. Previously ``/users`` and ``/users/add``
  would map to the UsersController in the Users plugin. In 2.0, only the
  ``index`` action is given a short route. If you wish to continue using short
  routes, you can add a route like::

    Router::connect(
      '/users/:action',
      array('controller' => 'users', 'plugin' => 'users')
    );

  To your routes file for each plugin you need short routes on.

Your app/Config/routes.php file needs to be updated adding this line at the bottom of the file::

    require CAKE . 'Config' . DS . 'routes.php';

This is needed in order to generate the default routes for your application. If you do not wish to have such routes,
or want to implement your own standard you can include your own file with custom router rules.

Dispatcher
----------

- Dispatcher has been moved inside of cake/libs, you will have to update your
  ``app/webroot/index.php`` file.
- ``Dispatcher::dispatch()`` now takes two parameters. The request and
  response objects. These should be instances of ``CakeRequest`` &
  ``CakeResponse`` or a subclass thereof.
- ``Dispatcher::parseParams()`` now only accepts a ``CakeRequest`` object.
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

   -  ``views/scaffolds/edit.ctp`` -> ``View/Scaffolds/form.ctp``
   -  ``views/posts/scaffold.edit.ctp`` -> ``View/Posts/scaffold.form.ctp``

Xml
---

-  The class Xml was completely re-factored. Now this class does not manipulate
   data anymore, and it is a wrapper to SimpleXMLElement. You can use the following
   methods:

   -  ``Xml::build()``: static method that you can pass an xml string, array, path
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
``SessionComponent`` are wrappers and sugar for it. It can now easily be used
in models or other contexts. All of its methods are called statically.

Session configuration has also changed :doc:`see the session section for more
information </development/sessions>`

HttpSocket
----------

- HttpSocket doesn't change the header keys. Following other places in core,
  the HttpSocket does not change the headers. :rfc:`2616` says that headers are case
  insensitive, and HttpSocket preserves the values the remote host sends.
- HttpSocket returns responses as objects now. Instead of arrays, HttpSocket
  returns instances of HttpResponse. See the :php:class:`HttpSocket`
  documentation for more information.
- Cookies are stored internally by host, not per instance. This means that, if
  you make two requests to different servers, cookies from domain1 won't be sent
  to domain2. This was done to avoid possible security problems.


Helpers
=======

Constructor changed
-------------------

In order to accommodate View being removed from the ClassRegistry, the signature
of Helper::__construct() was changed. You should update any subclasses to use
the following::

    public function __construct(View $View, $settings = array())

When overriding the constructor you should always call `parent::__construct` as
well. `Helper::__construct` stores the view instance at `$this->_View` for
later reference. The settings are not handled by the parent constructor.

HelperCollection added
----------------------

After examining the responsibilities of each class involved in the View layer,
it became clear that View was handling much more than a single task. The
responsibility of creating helpers is not central to what View does, and was
moved into HelperCollection. HelperCollection is responsible for loading and
constructing helpers, as well as triggering callbacks on helpers. By default,
View creates a HelperCollection in its constructor, and uses it for subsequent
operations. The HelperCollection for a view can be found at `$this->Helpers`

The motivations for refactoring this functionality came from a few issues.

* View being registered in ClassRegistry could cause registry poisoning issues
  when requestAction or the EmailComponent were used.
* View being accessible as a global symbol invited abuse.
* Helpers were not self contained. After constructing a helper, you had to
  manually construct several other objects in order to get a functioning object.

You can read more about HelperCollection in the
:doc:`/core-libraries/collections` documentation.

Deprecated properties
---------------------

The following properties on helpers are deprecated, you should use the request
object properties or Helper methods instead of directly accessing these
properties as they will be removed in a future release.

-  ``Helper::$webroot`` is deprecated, use the request object's webroot
   property.
-  ``Helper::$base`` is deprecated, use the request object's base property.
-  ``Helper::$here`` is deprecated, use the request object's here property.
-  ``Helper::$data`` is deprecated, use the request object's data property.
-  ``Helper::$params`` is deprecated, use the ``$this->request`` instead.

XmlHelper, AjaxHelper and JavascriptHelper removed
--------------------------------------------------

The AjaxHelper and JavascriptHelper have been removed as they were deprecated in
version 1.3. The XmlHelper was removed, as it was made obsolete and redundant
with the improvements to :php:class:`Xml`. The ``Xml`` class should be used to
replace previous usage of XmlHelper.

The AjaxHelper, and JavascriptHelper are replaced with the JsHelper and HtmlHelper.

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
   The default key has been removed.
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
created. The effected methods are:

-  FormHelper::select()
-  FormHelper::dateTime()
-  FormHelper::year()
-  FormHelper::month()
-  FormHelper::day()
-  FormHelper::hour()
-  FormHelper::minute()
-  FormHelper::meridian()

Default URLs on forms is the current action
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The default url for all forms, is now the current url including passed, named,
and querystring parameters. You can override this default by supplying
``$options['url']`` in the second parameter of ``$this->Form->create()``.

FormHelper::hidden()
~~~~~~~~~~~~~~~~~~~~

Hidden fields no longer remove the class attribute. This means that if there are
validation errors on hidden fields, the ``error-field`` class name will be
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

Helper Attribute format more flexible
-------------------------------------

The Helper class has more 3 protected attributes:

* ``Helper::_minimizedAttributes``: array with minimized attributes (ie:
  ``array('checked', 'selected', ...)``);
* ``Helper::_attributeFormat``: how attributes will be generated (ie:
  ``%s="%s"``);
* ``Helper::_minimizedAttributeFormat``: how minimized attributes will be
  generated: (ie ``%s="%s"``)

By default the values used in CakePHP 1.3 were not changed. But now you can
use boolean attributes from HTML, like ``<input type="checkbox" checked />``. To
this, just change ``$_minimizedAttributeFormat`` in your AppHelper to ``%s``.

To use with Html/Form helpers and others, you can write::

    $this->Form->checkbox('field', array('checked' => true, 'value' => 'some_value'));

Other facility is that minimized attributes can be passed as item and not as
key. For example::

    $this->Form->checkbox('field', array('checked', 'value' => 'some_value'));

Note that ``checked`` have a numeric key.

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
- ``Controller::$Component`` has been moved to ``Controller::$Components``. See
  the :doc:`/core-libraries/collections` documentation for more information.
- ``Controller::$view`` has been renamed to ``Controller::$viewClass``.
  ``Controller::$view`` is now used to change which view file is rendered.
- ``Controller::render()`` now returns a CakeResponse object.

The deprecated properties on Controller will be accessible through a ``__get()``
method. This method will be removed in future versions, so it's recommended that
you update your application.

Controller now defines a maxLimit for pagination. This maximum limit is set to
100, but can be overridden in the $paginate options.


Pagination
----------

Pagination has traditionally been a single method in Controller, this created a
number of problems though. Pagination was hard to extend, replace, or modify. For
2.0 pagination has been extracted into a component. :php:meth:`Controller::paginate()` still
exists, and serves as a convenience method for loading and using the
:php:class:`PaginatorComponent`.

For more information on the new features offered by pagination in 2.0, see the
:doc:`/core-libraries/components/pagination` documentation.

View
====

View no longer registered in ClassRegistry
------------------------------------------

The view being registered ClassRegistry invited abuse and affectively created a
global symbol. In 2.0 each Helper receives the current `View` instance in its
constructor. This allows helpers access to the view in a similar fashion as in
the past, without creating global symbols. You can access the view instance at
`$this->_View` in any helper.

Deprecated properties
---------------------

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
method. This method will be removed in future versions, so it's recommended that
you update your application.

Removed methods
---------------

* ``View::_triggerHelpers()`` Use ``$this->Helpers->trigger()`` instead.
* ``View::_loadHelpers()`` Use ``$this->loadHelpers()`` instead. Helpers now lazy
  load their own helpers.

Added methods
-------------

* ``View::loadHelper($name, $settings = array());`` Load a single helper.
* ``View::loadHelpers()`` Loads all the helpers indicated in ``View::$helpers``.

View->Helpers
-------------

By default View objects contain a :php:class:`HelperCollection` at ``$this->Helpers``.

Themes
------

To use themes in your Controller you no longer set ``public $view = 'Theme';``.
Use ``public $viewClass = 'Theme';`` instead.

Callback positioning changes
----------------------------

beforeLayout used to fire after scripts_for_layout and content_for_layout were
prepared. In 2.0, beforeLayout is fired before any of the special variables are
prepared, allowing you to manipulate them before they are passed to the layout.
The same was done for beforeRender. It is now fired well before any view
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

    public function beforeRender($viewFile) {

    }

    public function afterRender($viewFile) {

    }

    public function beforeLayout($layoutFile) {

    }

    public function afterLayout($layoutFile) {

    }


Element caching, and view callbacks have been changed in 2.0 to help provide you
with more flexibility and consistency. :doc:`Read more about those
changes </views>`.

CacheHelper decoupled
---------------------

In previous versions there was a tight coupling between :php:class:`CacheHelper`
and :php:class:`View`. For 2.0 this coupling has been removed and CacheHelper
just uses callbacks like other helpers to generate full page caches.


CacheHelper ``<cake:nocache>`` tags changed
-------------------------------------------

In previous versions, CacheHelper used a special ``<cake:nocache>`` tag as
markers for output that should not be part of the full page cache. These tags
were not part of any XML schema, and were not possible to validate in HTML or
XML documents. For 2.0, these tags have been replaced with HTML/XML comments::

    <cake:nocache> becomes <!--nocache-->
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
PHPUnit 3.7. Of course you can continue to use SimpleTest in your application by
replacing the related files. No further support will be given for SimpleTest and
it is recommended that you migrate to PHPUnit as well. For some additional
information on how to migrate your tests see PHPUnit migration hints.

No more group tests
-------------------

PHPUnit does not differentiate between group tests and single test cases in the
runner. Because of this, the group test options, and support for old style group
tests has been removed. It is recommended that GroupTests be ported to
``PHPUnit_Framework_Testsuite`` subclasses. You can find several examples of this
in CakePHP's test suite. Group test related methods on ``TestManager`` have also
been removed.

Testsuite shell
---------------

The testsuite shell has had its invocation simplified and expanded. You no
longer need to differentiate between ``case`` and ``group``. It is assumed that
all tests are cases. In the past you would have done
``cake testsuite app case models/post`` you can now do ``cake testsuite app
Model/Post``.


The testsuite shell has been refactored to use the PHPUnit CLI tool. It now
supports all the command line options supported by PHPUnit.
``cake testsuite help`` will show you a list of all possible modifiers.

Model
=====

Model relationships are now lazy loaded. You can run into a situation where
assigning a value to a nonexistent model property will throw errors::

    $Post->inexistentProperty[] = 'value';

will throw the error "Notice: Indirect modification of overloaded property
$inexistentProperty has no effect". Assigning an initial value to the property
solves the issue::

    $Post->nonexistentProperty = array();
    $Post->nonexistentProperty[] = 'value';

Or just declare the property in the model class::

    class Post {
        public $nonexistentProperty = array();
    }

Either of these approaches will solve the notice errors.

The notation of ``find()`` in CakePHP 1.2 is no longer supported. Finds should use
notation ``$model->find('type', array(PARAMS))`` in CakePHP 1.3.

- ``Model::$_findMethods`` is now ``Model::$findMethods``. This property is now
  public and can be modified by behaviors.



Database objects
----------------

CakePHP 2.0 introduces some changes to Database objects that should not greatly
affect backwards compatibility. The biggest one is the adoption of PDO for
handling database connections. If you are using a vanilla installation of PHP 5
you will already have installed the needed extensions, but you may need to
activate individual extensions for each driver you wish to use.

Using PDO across all DBOs let us homogenize the code for each one and provide
more reliable and predictable behavior for all drivers. It also allowed us to
write more portable and accurate tests for database related code.

The first thing users will probably miss is the "affected rows" and "total rows"
statistics, as they are not reported due to the more performant and lazy design
of PDO, there are ways to overcome this issue but very specific to each
database. Those statistics are not gone, though, but could be missing or even
inaccurate for some drivers.

A nice feature added after the PDO adoption is the ability to use prepared
statements with query placeholders using the native driver if available.

List of Changes
~~~~~~~~~~~~~~~

* DboMysqli was removed, we will support DboMysql only.
* API for DboSource::execute has changed, it will now take an array of query
  values as second parameter::

    public function execute($sql, $params = array(), $options = array())

  became::

    public function execute($sql, $options = array(), $params = array())

  third parameter is meant to receive options for logging, currently it only
  understands the "log" option.

* DboSource::value() looses its third parameter, it was not used anyways
* DboSource::fetchAll() now accepts an array as second parameter, to pass values
  to be bound to the query, third parameter was dropped. Example::

    $db->fetchAll(
      'SELECT
        * from users
      WHERE
        username = ?
      AND
        password = ?',
      array('jhon', '12345')
    );
    $db->fetchAll(
      'SELECT
        * from users
      WHERE
          username = :username
      AND
        password = :password',
      array('username' => 'jhon', 'password' => '12345')
    );

The PDO driver will automatically escape those values for you.

* Database statistics are collected only if the "fullDebug" property of the
  corresponding DBO is set to true.
* New method DboSource::getConnection() will return the PDO object in case you
  need to talk to the driver directly.
* Treatment of boolean values changed a bit to make it more cross-database
  friendly, you may need to change your test cases.
* PostgreSQL support was immensely improved, it now correctly creates schemas,
  truncate tables, and is easier to write tests using it.
* DboSource::insertMulti() will no longer accept sql string, just pass an array
  of fields and a nested array of values to insert them all at once
* TranslateBehavior was refactored to use model virtualFields, this makes the
  implementation more portable.
* All tests cases with MySQL related stuff were moved to the corresponding
  driver test case. This left the DboSourceTest file a bit skinny.
* Transaction nesting support. Now it is possible to start a transaction several
  times. It will only be committed if the commit method is called the same
  amount of times.
* SQLite support was greatly improved. The major difference with cake 1.3 is
  that it will only support SQLite 3.x . It is a great alternative for
  development apps, and quick at running test cases.
* Boolean column values will be casted to PHP native boolean type automatically,
  so make sure you update your test cases and code if you were expecting the
  returned value to be a string or an integer: If you had a "published" column in
  the past using MySQL all values returned from a find would be numeric in the
  past, now they are strict boolean values.

Behaviors
=========

BehaviorCollection
------------------

-  ``BehaviorCollection`` no longer ``strtolower()'s`` mappedMethods. Behavior
   mappedMethods are now case sensitive.

AclBehavior and TreeBehavior
----------------------------

- No longer supports strings as configuration. Example::

    public $actsAs = array(
        'Acl' => 'Controlled',
        'Tree' => 'nested'
    );

  became::

    public $actsAs = array(
        'Acl' => array('type' => 'Controlled'),
        'Tree' => array('type' => 'nested')
    );


Plugins
=======

Plugins no longer magically append their plugin prefix to components, helpers
and models used within them. You must be explicit with the components, models,
and helpers you wish to use. In the past::

    public $components = array('Session', 'Comments');

Would look in the controller's plugin before checking app/core components. It
will now only look in the app/core components. If you wish to use objects from a
plugin you must put the plugin name::

    public $components = array('Session', 'Comment.Comments');

This was done to reduce hard to debug issues caused by magic misfiring. It also
improves consistency in an application, as objects have one authoritative way to
reference them.

Plugin App Controller and Plugin App Model
------------------------------------------

The plugin AppController and AppModel are no longer located directly in the
plugin folder. They are now placed into the plugin's Controller and Model
folders as such::

    /app
        /Plugin
            /Comment
                /Controller
                    CommentAppController.php
                /Model
                    CommentAppModel.php

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

It's recommended that you use the help on shells you use to see what if any
parameters have changed. It's also recommended that you read the console new
features for more information on new APIs that are available.

Debugging
=========

The ``debug()`` function now defaults to outputting HTML safe strings. This is
disabled if being used in the console. The ``$showHtml`` option for ``debug()``
can be set to false to disable HTML-safe output from debug.

ConnectionManager
=================

``ConnectionManager::enumConnectionObjects()`` will now return the current
configuration for each connection created, instead of an array with filename,
class name and plugin, which wasn't really useful.

When defining database connections you will need to make some changes to the way
configs were defined in the past. Basically in the database configuration class,
the key "driver" is not accepted anymore, only "datasource", in order to make it
more consistent. Also, as the datasources have been moved to packages you will
need to pass the package they are located in. Example::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'login' => 'root',
        'password' => 'root',
        'database' => 'cake',
    );


.. meta::
    :title lang=en: 2.0 Migration Guide
    :description lang=en: This page summarizes the changes from CakePHP 1.3 that will assist in a project migration to 2.0, as well as for a developer reference to get up to date with the changes made to the core since the CakePHP 1.3 branch.
    :keywords lang=en: cakephp upgrade,cakephp migration,migration guide,1.3 to 2.0,update cakephp,backwards compatibility,api changes,x versions,directory structure,new features
