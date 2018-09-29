3.0 Migration Guide
###################

This page summarizes the changes from CakePHP 2.x that will assist in migrating
a project to 3.0, as well as a reference to get up to date with the changes made
to the core since the CakePHP 2.x branch. Be sure to read the other pages in
this guide for all the new features and API changes.

Requirements
============

- CakePHP 3.x supports PHP Version 5.4.16 and above.
- CakePHP 3.x requires the mbstring extension.
- CakePHP 3.x requires the intl extension.

.. warning::

    CakePHP 3.0 will not work if you do not meet the above requirements.

Upgrade Tool
============

While this document covers all the breaking changes and improvements made in
CakePHP 3.0, we've also created a console application to help you complete some
of the time consuming mechanical changes. You can `get the upgrade tool from
github <https://github.com/cakephp/upgrade>`_.

Application Directory Layout
============================

The application directory layout has changed and now follows
`PSR-4 <http://www.php-fig.org/psr/psr-4/>`_. You should use the
`app skeleton <https://github.com/cakephp/app>`_ project as a reference point
when updating your application.

CakePHP should be installed with Composer
=========================================

Since CakePHP can no longer be installed via PEAR, or in a shared
directory, those options are no longer supported. Instead you should use
`Composer <http://getcomposer.org>`_ to install CakePHP into your application.

Namespaces
==========

All of CakePHP's core classes are now namespaced and follow PSR-4 autoloading
specifications. For example **src/Cache/Cache.php** is namespaced as
``Cake\Cache\Cache``.  Global constants and helper methods like :php:meth:`__()`
and :php:meth:`debug()` are not namespaced for convenience sake.

Removed Constants
=================

The following deprecated constants have been removed:

* ``IMAGES``
* ``CSS``
* ``JS``
* ``IMAGES_URL``
* ``JS_URL``
* ``CSS_URL``
* ``DEFAULT_LANGUAGE``

Configuration
=============

Configuration in CakePHP 3.0 is significantly different than in previous
versions. You should read the :doc:`/development/configuration` documentation
for how configuration is done in 3.0.

You can no longer use ``App::build()`` to configure additional class paths.
Instead you should map additional paths using your application's autoloader. See
the section on :ref:`additional-class-paths` for more information.

Three new configure variables provide the path configuration for plugins,
views and locale files. You can add multiple paths to ``App.paths.templates``,
``App.paths.plugins``, ``App.paths.locales`` to configure multiple paths for
templates, plugins and locale files respectively.

The config key ``www_root`` has been changed to ``wwwRoot`` for consistency. Please adjust
your **app.php** config file as well as any usage of ``Configure::read('App.wwwRoot')``.

New ORM
=======

CakePHP 3.0 features a new ORM that has been re-built from the ground up. The
new ORM is significantly different and incompatible with the previous one.
Upgrading to the new ORM will require extensive changes in any application that
is being upgraded. See the new :doc:`/orm` documentation for information on how
to use the new ORM.

Basics
======

* ``LogError()`` was removed, it provided no benefit and is rarely/never used.
* The following global functions have been removed: ``config()``, ``cache()``,
  ``clearCache()``, ``convertSlashes()``, ``am()``, ``fileExistsInPath()``,
  ``sortByKey()``.

Debugging
=========

* ``Configure::write('debug', $bool)`` does not support 0/1/2 anymore. A simple boolean
  is used instead to switch debug mode on or off.

Object settings/configuration
=============================

* Objects used in CakePHP now have a consistent instance-configuration storage/retrieval
  system. Code which previously accessed for example: ``$object->settings`` should instead
  be updated to use ``$object->config()``.

Cache
=====

* ``Memcache`` engine has been removed, use :php:class:`Cake\\Cache\\Cache\\Engine\\Memcached` instead.
* Cache engines are now lazy loaded upon first use.
* :php:meth:`Cake\\Cache\\Cache::engine()` has been added.
* :php:meth:`Cake\\Cache\\Cache::enabled()` has been added. This replaced the
  ``Cache.disable`` configure option.
* :php:meth:`Cake\\Cache\\Cache::enable()` has been added.
* :php:meth:`Cake\\Cache\\Cache::disable()` has been added.
* Cache configurations are now immutable. If you need to change configuration
  you must first drop the configuration and then re-create it. This prevents
  synchronization issues with configuration options.
* ``Cache::set()`` has been removed. It is recommended that you create multiple
  cache configurations to replace runtime configuration tweaks previously
  possible with ``Cache::set()``.
* All ``CacheEngine`` subclasses now implement a ``config()`` method.
* :php:meth:`Cake\\Cache\\Cache::readMany()`, :php:meth:`Cake\\Cache\\Cache::deleteMany()`,
  and :php:meth:`Cake\\Cache\\Cache::writeMany()` were added.

All :php:class:`Cake\\Cache\\Cache\\CacheEngine` methods now honor/are responsible for handling the
configured key prefix. The :php:meth:`Cake\\Cache\\CacheEngine::write()` no longer permits setting
the duration on write - the duration is taken from the cache engine's runtime config. Calling a
cache method with an empty key will now throw an :php:class:`InvalidArgumentException`, instead
of returning ``false``.

Core
====

App
---

- ``App::pluginPath()`` has been removed. Use ``CakePlugin::path()`` instead.
- ``App::build()`` has been removed.
- ``App::location()`` has been removed.
- ``App::paths()`` has been removed.
- ``App::load()`` has been removed.
- ``App::objects()`` has been removed.
- ``App::RESET`` has been removed.
- ``App::APPEND`` has been removed.
- ``App::PREPEND`` has been removed.
- ``App::REGISTER`` has been removed.

Plugin
------

- :php:meth:`Cake\\Core\\Plugin::load()` does not setup an autoloader unless
  you set the ``autoload`` option to ``true``.
- When loading plugins you can no longer provide a callable.
- When loading plugins you can no longer provide an array of config files to
  load.

Configure
---------

- ``Cake\Configure\PhpReader`` renamed to
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig`
- ``Cake\Configure\IniReader`` renamed to
  :php:class:`Cake\\Core\\Configure\\Engine\IniConfig`
- ``Cake\Configure\ConfigReaderInterface`` renamed to
  :php:class:`Cake\\Core\\Configure\\ConfigEngineInterface`
- :php:meth:`Cake\\Core\\Configure::consume()` was added.
- :php:meth:`Cake\\Core\\Configure::load()` now expects the file name without
  extension suffix as this can be derived from the engine. E.g. using PhpConfig
  use ``app`` to load **app.php**.
- Setting a ``$config`` variable in PHP config file is deprecated.
  :php:class:`Cake\\Core\\Configure\\Engine\PhpConfig` now expects the config
  file to return an array.
- A new config engine :php:class:`Cake\\Core\\Configure\\Engine\JsonConfig` has
  been added.

Object
------

The ``Object`` class has been removed. It formerly contained a grab bag of
methods that were used in various places across the framework. The most useful
of these methods have been extracted into traits. You can use the
:php:trait:`Cake\\Log\\LogTrait` to access the ``log()`` method. The
:php:trait:`Cake\\Routing\\RequestActionTrait` provides ``requestAction()``.

Console
=======

The ``cake`` executable has been moved from the **app/Console** directory to the
**bin** directory within the application skeleton. You can now invoke CakePHP's
console with ``bin/cake``.

TaskCollection Replaced
-----------------------

This class has been renamed to :php:class:`Cake\\Console\\TaskRegistry`.
See the section on :doc:`/core-libraries/registry-objects` for more information
on the features provided by the new class. You can use the ``cake upgrade
rename_collections`` to assist in upgrading your code. Tasks no longer have
access to callbacks, as there were never any callbacks to use.

Shell
-----

- ``Shell::__construct()`` has changed. It now takes an instance of
  :php:class:`Cake\\Console\\ConsoleIo`.
- ``Shell::param()`` has been added as convenience access to the parameters.

Additionally all shell methods will be transformed to camel case when invoked.
For example, if you had a ``hello_world()`` method inside a shell and invoked it
with ``bin/cake my_shell hello_world``, you will need to rename the method
to ``helloWorld``. There are no changes required in the way you invoke commands.

ConsoleOptionParser
-------------------

- ``ConsoleOptionParser::merge()`` has been added to merge parsers.

ConsoleInputArgument
--------------------

- ``ConsoleInputArgument::isEqualTo()`` has been added to compare two arguments.

Shell / Task
============

Shells and Tasks have been moved from ``Console/Command`` and
``Console/Command/Task`` to ``Shell`` and ``Shell/Task``.

ApiShell Removed
----------------

The ApiShell was removed as it didn't provide any benefit over the file source
itself and the online documentation/`API <https://api.cakephp.org/>`_.

SchemaShell Removed
-------------------

The SchemaShell was removed as it was never a complete database migration implementation
and better tools such as `Phinx <https://phinx.org/>`_ have emerged. It has been replaced by
the `CakePHP Migrations Plugin <https://github.com/cakephp/migrations>`_ which acts as a wrapper between
CakePHP and `Phinx <https://phinx.org/>`_.

ExtractTask
-----------

- ``bin/cake i18n extract`` no longer includes untranslated validation
  messages. If you want translated validation messages you should wrap those
  messages in `__()` calls like any other content.

BakeShell / TemplateTask
------------------------

- Bake is no longer part of the core source and is superseded by
  `CakePHP Bake Plugin <https://github.com/cakephp/bake>`_
- Bake templates have been moved under **src/Template/Bake**.
- The syntax of Bake templates now uses erb-style tags (``<% %>``) to denote
  templating logic, allowing php code to be treated as plain text.
- The ``bake view`` command has been renamed ``bake template``.

Event
=====

The ``getEventManager()`` method,  was removed on all objects that had it.  An
``eventManager()`` method is now provided by the ``EventManagerTrait``. The
``EventManagerTrait`` contains the logic of instantiating and keeping
a reference to a local event manager.

The Event subsystem has had a number of optional features removed. When
dispatching events you can no longer use the following options:

* ``passParams`` This option is now enabled always implicitly. You
  cannot turn it off.
* ``break`` This option has been removed. You must now stop events.
* ``breakOn`` This option has been removed. You must now stop events.

Log
===

* Log configurations are now immutable. If you need to change configuration
  you must first drop the configuration and then re-create it. This prevents
  synchronization issues with configuration options.
* Log engines are now lazily loaded upon the first write to the logs.
* :php:meth:`Cake\\Log\\Log::engine()` has been added.
* The following methods have been removed from :php:class:`Cake\\Log\\Log` ::
  ``defaultLevels()``, ``enabled()``, ``enable()``, ``disable()``.
* You can no longer create custom levels using ``Log::levels()``.
* When configuring loggers you should use ``'levels'`` instead of ``'types'``.
* You can no longer specify custom log levels.  You must use the default set of
  log levels.  You should use logging scopes to create custom log files or
  specific handling for different sections of your application. Using
  a non-standard log level will now throw an exception.
* :php:trait:`Cake\\Log\\LogTrait` was added. You can use this trait in your
  classes to add the ``log()`` method.
* The logging scope passed to :php:meth:`Cake\\Log\\Log::write()` is now
  forwarded to the log engines' ``write()`` method in order to provide better
  context to the engines.
* Log engines are now required to implement ``Psr\Log\LogInterface`` instead of
  Cake's own ``LogInterface``. In general, if you extended :php:class:`Cake\\Log\\Engine\\BaseEngine`
  you just need to rename the ``write()`` method to ``log()``.
* :php:meth:`Cake\\Log\\Engine\\FileLog` now writes files in ``ROOT/logs`` instead of ``ROOT/tmp/logs``.

Routing
=======

Named Parameters
----------------

Named parameters were removed in 3.0. Named parameters were added in 1.2.0 as
a 'pretty' version of query string parameters.  While the visual benefit is
arguable, the problems named parameters created are not.

Named parameters required special handling in CakePHP as well as any PHP or
JavaScript library that needed to interact with them, as named parameters are
not implemented or understood by any library *except* CakePHP.  The additional
complexity and code required to support named parameters did not justify their
existence, and they have been removed.  In their place you should use standard
query string parameters or passed arguments.  By default ``Router`` will treat
any additional parameters to ``Router::url()`` as query string arguments.

Since many applications will still need to parse incoming URLs containing named
parameters.  :php:meth:`Cake\\Routing\\Router::parseNamedParams()` has
been added to allow backwards compatibility with existing URLs.

RequestActionTrait
------------------

- :php:meth:`Cake\\Routing\\RequestActionTrait::requestAction()` has had
  some of the extra options changed:

  - ``options[url]`` is now ``options[query]``.
  - ``options[data]`` is now ``options[post]``.
  - Named parameters are no longer supported.

Router
------

* Named parameters have been removed, see above for more information.
* The ``full_base`` option has been replaced with the ``_full`` option.
* The ``ext`` option has been replaced with the ``_ext`` option.
* ``_scheme``, ``_port``, ``_host``, ``_base``, ``_full``, ``_ext`` options added.
* String URLs are no longer modified by adding the plugin/controller/prefix names.
* The default fallback route handling was removed.  If no routes
  match a parameter set ``/`` will be returned.
* Route classes are responsible for *all* URL generation including
  query string parameters. This makes routes far more powerful and flexible.
* Persistent parameters were removed. They were replaced with
  :php:meth:`Cake\\Routing\\Router::urlFilter()` which allows
  a more flexible way to mutate URLs being reverse routed.
* ``Router::parseExtensions()`` has been removed.
  Use :php:meth:`Cake\\Routing\\Router::extensions()` instead. This method
  **must** be called before routes are connected. It won't modify existing
  routes.
* ``Router::setExtensions()`` has been removed.
  Use :php:meth:`Cake\\Routing\\Router::extensions()` instead.
* ``Router::resourceMap()`` has been removed.
* The ``[method]`` option has been renamed to ``_method``.
* The ability to match arbitrary headers with ``[]`` style parameters has been
  removed. If you need to parse/match on arbitrary conditions consider using
  custom route classes.
* ``Router::promote()`` has been removed.
* ``Router::parse()`` will now raise an exception when a URL cannot be handled
  by any route.
* ``Router::url()`` will now raise an exception when no route matches a set of
  parameters.
* Routing scopes have been introduced. Routing scopes allow you to keep your
  routes file DRY and give Router hints on how to optimize parsing & reverse
  routing URLs.

Route
-----

* ``CakeRoute`` was re-named to ``Route``.
* The signature of ``match()`` has changed to ``match($url, $context = [])``
  See :php:meth:`Cake\\Routing\\Route::match()` for information on the new signature.

Dispatcher Filters Configuration Changed
----------------------------------------

Dispatcher filters are no longer added to your application using ``Configure``.
You now append them with :php:class:`Cake\\Routing\\DispatcherFactory`. This
means if your application used ``Dispatcher.filters``, you should now use
:php:meth:`Cake\\Routing\\DispatcherFactory::add()`.

In addition to configuration changes, dispatcher filters have had some
conventions updated, and features added. See the
:doc:`/development/dispatch-filters` documentation for more information.

Filter\AssetFilter
------------------

* Plugin & theme assets handled by the AssetFilter are no longer read via
  ``include`` instead they are treated as plain text files.  This fixes a number
  of issues with JavaScript libraries like TinyMCE and environments with
  short_tags enabled.
* Support for the ``Asset.filter`` configuration and hooks were removed. This
  feature should be replaced with a plugin or dispatcher filter.

Network
=======

Request
-------

* ``CakeRequest`` has been renamed to :php:class:`Cake\\Network\\Request`.
* :php:meth:`Cake\\Network\\Request::port()` was added.
* :php:meth:`Cake\\Network\\Request::scheme()` was added.
* :php:meth:`Cake\\Network\\Request::cookie()` was added.
* :php:attr:`Cake\\Network\\Request::$trustProxy` was added.  This makes it easier to put
  CakePHP applications behind load balancers.
* :php:attr:`Cake\\Network\\Request::$data` is no longer merged with the prefixed data
  key, as that prefix has been removed.
* :php:meth:`Cake\\Network\\Request::env()` was added.
* :php:meth:`Cake\\Network\\Request::acceptLanguage()` was changed from static method
  to non-static.
* Request detector for "mobile" has been removed from the core. Instead the app
  template adds detectors for "mobile" and "tablet" using ``MobileDetect`` lib.
* The method ``onlyAllow()`` has been renamed to ``allowMethod()`` and no longer accepts "var args".
  All method names need to be passed as first argument, either as string or array of strings.

Response
--------

* The mapping of mimetype ``text/plain`` to extension ``csv`` has been removed.
  As a consequence :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`
  doesn't set extension to ``csv`` if ``Accept`` header contains mimetype ``text/plain``
  which was a common annoyance when receiving a jQuery XHR request.

Sessions
========

The session class is no longer static, instead the session can be accessed
through the request object. See the :doc:`/development/sessions` documentation
for using the session object.

* :php:class:`Cake\\Network\\Session` and related session classes have been
  moved under the ``Cake\Network`` namespace.
* ``SessionHandlerInterface`` has been removed in favor of the one provided by
  PHP itself.
* The property ``Session::$requestCountdown`` has been removed.
* The session checkAgent feature has been removed. It caused a number of bugs
  when chrome frame, and flash player are involved.
* The conventional sessions database table name is now ``sessions`` instead of
  ``cake_sessions``.
* The session cookie timeout is automatically updated in tandem with the timeout
  in the session data.
* The path for session cookie now defaults to app's base path instead of "/".
  A new configuration variable ``Session.cookiePath`` has been added to
  customize the cookie path.
* A new convenience method :php:meth:`Cake\\Network\\Session::consume()` has been added
  to allow reading and deleting session data in a single step.
* The default value of :php:meth:`Cake\\Network\\Session::clear()`'s argument ``$renew`` has been changed
  from ``true`` to ``false``.

Network\\Http
=============

* ``HttpSocket`` is now :php:class:`Cake\\Network\\Http\\Client`.
* Http\Client has been re-written from the ground up. It has a simpler/easier to
  use API, support for new authentication systems like OAuth, and file uploads.
  It uses PHP's stream APIs so there is no requirement for cURL. See the
  :doc:`/core-libraries/httpclient` documentation for more information.

Network\\Email
==============

* :php:meth:`Cake\\Network\\Email\\Email::config()` is now used to define
  configuration profiles. This replaces the ``EmailConfig`` classes in previous
  versions.
* :php:meth:`Cake\\Network\\Email\\Email::profile()` replaces ``config()`` as
  the way to modify per instance configuration options.
* :php:meth:`Cake\\Network\\Email\\Email::drop()` has been added to allow the
  removal of email configuration.
* :php:meth:`Cake\\Network\\Email\\Email::configTransport()` has been added to allow the
  definition of transport configurations. This change removes transport options
  from delivery profiles and allows you to re-use transports across email
  profiles.
* :php:meth:`Cake\\Network\\Email\\Email::dropTransport()` has been added to allow the
  removal of transport configuration.

Controller
==========

Controller
----------

- The ``$helpers``, ``$components`` properties are now merged
  with **all** parent classes not just ``AppController`` and the plugin
  AppController. The properties are merged differently now as well. Instead of
  all settings in all classes being merged together, the configuration defined
  in the child class will be used. This means that if you have some
  configuration defined in your AppController, and some configuration defined in
  a subclass, only the configuration in the subclass will be used.
- ``Controller::httpCodes()`` has been removed, use
  :php:meth:`Cake\\Network\\Response::httpCodes()` instead.
- ``Controller::disableCache()`` has been removed, use
  :php:meth:`Cake\\Network\\Response::disableCache()` instead.
- ``Controller::flash()`` has been removed. This method was rarely used in real
  applications and served no purpose anymore.
- ``Controller::validate()`` and ``Controller::validationErrors()`` have been
  removed. They were left over methods from the 1.x days where the concerns of
  models + controllers were far more intertwined.
- ``Controller::loadModel()`` now loads table objects.
- The ``Controller::$scaffold`` property has been removed. Dynamic scaffolding
  has been removed from CakePHP core.  An improved scaffolding plugin, named CRUD, can be found here: https://github.com/FriendsOfCake/crud
- The ``Controller::$ext`` property has been removed. You now have to extend and
  override the ``View::$_ext`` property if you want to use a non-default view file
  extension.
- The ``Controller::$methods`` property has been removed. You should now use
  ``Controller::isAction()`` to determine whether or not a method name is an
  action. This change was made to allow easier customization of what is and is
  not counted as an action.
- The ``Controller::$Components`` property has been removed and replaced with
  ``_components``. If you need to load components at runtime you should use
  ``$this->loadComponent()`` on your controller.
- The signature of :php:meth:`Cake\\Controller\\Controller::redirect()` has been
  changed to ``Controller::redirect(string|array $url, int $status = null)``.
  The 3rd argument ``$exit`` has been dropped. The method can no longer send
  response and exit script, instead it returns a ``Response`` instance with
  appropriate headers set.
- The ``base``, ``webroot``, ``here``, ``data``,  ``action``, and ``params``
  magic properties have been removed. You should access all of these properties
  on ``$this->request`` instead.
- Underscore prefixed controller methods like ``_someMethod()`` are no longer
  treated as private methods. Use proper visibility keywords instead. Only
  public methods can be used as controller actions.

Scaffold Removed
----------------

The dynamic scaffolding in CakePHP has been removed from CakePHP core. It was
infrequently used, and never intended for production use. An improved
scaffolding plugin, named CRUD, can be found here:
https://github.com/FriendsOfCake/crud

ComponentCollection Replaced
----------------------------

This class has been renamed to :php:class:`Cake\\Controller\\ComponentRegistry`.
See the section on :doc:`/core-libraries/registry-objects` for more information
on the features provided by the new class. You can use the ``cake upgrade
rename_collections`` to assist in upgrading your code.

Component
---------

* The ``_Collection`` property is now ``_registry``. It contains an instance
  of :php:class:`Cake\\Controller\\ComponentRegistry` now.
* All components should now use the ``config()`` method to get/set
  configuration.
* Default configuration for components should be defined in the
  ``$_defaultConfig`` property. This property is automatically merged with any
  configuration provided to the constructor.
* Configuration options are no longer set as public properties.
* The ``Component::initialize()`` method is no longer an event listener.
  Instead, it is a post-constructor hook like ``Table::initialize()`` and
  ``Controller::initialize()``. The new ``Component::beforeFilter()`` method is
  bound to the same event that ``Component::initialize()`` used to be. The
  initialize method should have the following signature ``initialize(array
  $config)``.

Controller\\Components
======================

CookieComponent
---------------

- Uses :php:meth:`Cake\\Network\\Request::cookie()` to read cookie data,
  this eases testing, and allows for ControllerTestCase to set cookies.
- Cookies encrypted in previous versions of CakePHP using the ``cipher()`` method
  are now un-readable because ``Security::cipher()`` has been removed. You will
  need to re-encrypt cookies with the ``rijndael()`` or ``aes()`` method before upgrading.
- ``CookieComponent::type()`` has been removed and replaced with configuration
  data accessed through ``config()``.
- ``write()`` no longer takes ``encryption`` or ``expires`` parameters. Both of
  these are now managed through config data. See
  :doc:`/controllers/components/cookie` for more information.
- The path for cookies now defaults to app's base path instead of "/".

AuthComponent
-------------

- ``Default`` is now the default password hasher used by authentication classes.
  It uses exclusively the bcrypt hashing algorithm. If you want to continue using
  SHA1 hashing used in 2.x use ``'passwordHasher' => 'Weak'`` in your authenticator configuration.
- A new ``FallbackPasswordHasher`` was added to help users migrate old passwords
  from one algorithm to another. Check AuthComponent's documentation for more
  info.
- ``BlowfishAuthenticate`` class has been removed. Just use ``FormAuthenticate``
- ``BlowfishPasswordHasher`` class has been removed. Use
  ``DefaultPasswordHasher`` instead.
- The ``loggedIn()`` method has been removed. Use ``user()`` instead.
- Configuration options are no longer set as public properties.
- The methods ``allow()`` and ``deny()`` no longer accept "var args". All method names need
  to be passed as first argument, either as string or array of strings.
- The method ``login()`` has been removed and replaced by ``setUser()`` instead.
  To login a user you now have to call ``identify()`` which returns user info upon
  successful identification and then use ``setUser()`` to save the info to
  session for persistence across requests.

- ``BaseAuthenticate::_password()`` has been removed. Use a ``PasswordHasher``
  class instead.
- ``BaseAuthenticate::logout()`` has been removed.
- ``AuthComponent`` now triggers two events ``Auth.afterIdentify`` and
  ``Auth.logout`` after a user has been identified and before a user is
  logged out respectively. You can set callback functions for these events by
  returning a mapping array from ``implementedEvents()`` method of your
  authenticate class.

ACL related classes were moved to a separate plugin. Password hashers, Authentication and
Authorization providers where moved to the ``\Cake\Auth`` namespace. You are
required to move your providers and hashers to the ``App\Auth`` namespace as
well.

RequestHandlerComponent
-----------------------

- The following methods have been removed from RequestHandler component::
  ``isAjax()``, ``isFlash()``, ``isSSL()``, ``isPut()``, ``isPost()``, ``isGet()``, ``isDelete()``.
  Use the :php:meth:`Cake\\Network\\Request::is()` method instead with relevant argument.
- ``RequestHandler::setContent()`` was removed, use :php:meth:`Cake\\Network\\Response::type()` instead.
- ``RequestHandler::getReferer()`` was removed, use :php:meth:`Cake\\Network\\Request::referer()` instead.
- ``RequestHandler::getClientIP()`` was removed, use :php:meth:`Cake\\Network\\Request::clientIp()` instead.
- ``RequestHandler::getAjaxVersion()`` was removed.
- ``RequestHandler::mapType()`` was removed, use :php:meth:`Cake\\Network\\Response::mapType()` instead.
- Configuration options are no longer set as public properties.

SecurityComponent
-----------------

- The following methods and their related properties have been removed from Security component:
  ``requirePost()``, ``requireGet()``, ``requirePut()``, ``requireDelete()``.
  Use the :php:meth:`Cake\\Network\\Request::allowMethod()` instead.
- ``SecurityComponent::$disabledFields()`` has been removed, use
  ``SecurityComponent::$unlockedFields()``.
- The CSRF related features in SecurityComponent have been extracted and moved
  into a separate CsrfComponent. This allows you to use CSRF protection
  without having to use form tampering prevention.
- Configuration options are no longer set as public properties.
- The methods ``requireAuth()`` and ``requireSecure()`` no longer accept "var args".
  All method names need to be passed as first argument, either as string or array of strings.

SessionComponent
----------------

- ``SessionComponent::setFlash()`` is deprecated. You should use
  :doc:`/controllers/components/flash` instead.

Error
-----

Custom ExceptionRenderers are now expected to either return
a :php:class:`Cake\\Network\\Response` object or string when rendering errors. This means
that any methods handling specific exceptions must return a response or string
value.

Model
=====

The Model layer in 2.x has been entirely re-written and replaced. You should
review the :doc:`/appendices/orm-migration` for information on how to use the
new ORM.

- The ``Model`` class has been removed.
- The ``BehaviorCollection`` class has been removed.
- The ``DboSource`` class has been removed.
- The ``Datasource`` class has been removed.
- The various datasource classes have been removed.

ConnectionManager
-----------------

- ConnectionManager has been moved to the ``Cake\Datasource`` namespace.
- ConnectionManager has had the following methods removed:

  - ``sourceList``
  - ``getSourceName``
  - ``loadDataSource``
  - ``enumConnectionObjects``

- :php:meth:`~Cake\\Database\\ConnectionManager::config()` has been added and is
  now the only way to configure connections.
- :php:meth:`~Cake\\Database\\ConnectionManager::get()` has been added. It
  replaces ``getDataSource()``.
- :php:meth:`~Cake\\Database\\ConnectionManager::configured()` has been added. It
  and ``config()`` replace ``sourceList()`` & ``enumConnectionObjects()`` with
  a more standard and consistent API.
- ``ConnectionManager::create()`` has been removed.
  It can be replaced by ``config($name, $config)`` and ``get($name)``.

Behaviors
---------
- Underscore prefixed behavior methods like ``_someMethod()`` are no longer
  treated as private methods. Use proper visibility keywords instead.

TreeBehavior
------------

The TreeBehavior was completely re-written to use the new ORM. Although it works
the same as in 2.x, a few methods were renamed or removed:

- ``TreeBehavior::children()`` is now a custom finder ``find('children')``.
- ``TreeBehavior::generateTreeList()`` is now a custom finder ``find('treeList')``.
- ``TreeBehavior::getParentNode()`` was removed.
- ``TreeBehavior::getPath()`` is now a custom finder ``find('path')``.
- ``TreeBehavior::reorder()`` was removed.
- ``TreeBehavior::verify()`` was removed.

TestSuite
=========

TestCase
--------

- ``_normalizePath()`` has been added to allow path comparison tests to run across all
  operation systems regarding their DS settings (``\`` in Windows vs ``/`` in UNIX, for example).

The following assertion methods have been removed as they have long been deprecated and replaced by
their new PHPUnit counterpart:

- ``assertEqual()`` in favor of ``assertEquals()``
- ``assertNotEqual()`` in favor of ``assertNotEquals()``
- ``assertIdentical()`` in favor of ``assertSame()``
- ``assertNotIdentical()`` in favor of ``assertNotSame()``
- ``assertPattern()`` in favor of ``assertRegExp()``
- ``assertNoPattern()`` in favor of ``assertNotRegExp()``
- ``assertReference()`` if favor of ``assertSame()``
- ``assertIsA()`` in favor of ``assertInstanceOf()``

Note that some methods have switched the argument order, e.g. ``assertEqual($is, $expected)`` should now be
``assertEquals($expected, $is)``.

The following assertion methods have been deprecated and will be removed in the future:

- ``assertWithinMargin()`` in favor of ``assertWithinRange()``
- ``assertTags()`` in favor of ``assertHtml()``

Both method replacements also switched the argument order for a consistent assert method API
with ``$expected`` as first argument.

The following assertion methods have been added:

- ``assertNotWithinRange()`` as counter part to ``assertWithinRange()``

View
====

Themes are now Basic Plugins
----------------------------

Having themes and plugins as ways to create modular application components has
proven to be limited, and confusing. In CakePHP 3.0, themes no longer reside
**inside** the application. Instead they are standalone plugins. This solves
a few problems with themes:

- You could not put themes *in* plugins.
- Themes could not provide helpers, or custom view classes.

Both these issues are solved by converting themes into plugins.

View Folders Renamed
--------------------

The folders containing view files now go under **src/Template** instead of **src/View**.
This was done to separate the view files from files containing php classes (eg. Helpers, View classes).

The following View folders have been renamed to avoid naming collisions with controller names:

- ``Layouts`` is now ``Layout``
- ``Elements`` is now ``Element``
- ``Errors`` is now ``Error``
- ``Emails`` is now ``Email`` (same for ``Email`` inside ``Layout``)

HelperCollection Replaced
-------------------------

This class has been renamed to :php:class:`Cake\\View\\HelperRegistry`.
See the section on :doc:`/core-libraries/registry-objects` for more information
on the features provided by the new class. You can use the ``cake upgrade
rename_collections`` to assist in upgrading your code.

View Class
----------

- The ``plugin`` key has been removed from ``$options`` argument of :php:meth:`Cake\\View\\View::element()`.
  Specify the element name as ``SomePlugin.element_name`` instead.
- ``View::getVar()`` has been removed, use :php:meth:`Cake\\View\\View::get()` instead.
- ``View::$ext`` has been removed and instead a protected property ``View::$_ext``
  has been added.
- ``View::addScript()`` has been removed. Use :ref:`view-blocks` instead.
- The ``base``, ``webroot``, ``here``, ``data``,  ``action``, and ``params``
  magic properties have been removed. You should access all of these properties
  on ``$this->request`` instead.
- ``View::start()`` no longer appends to an existing block. Instead it will
  overwrite the block content when end is called. If you need to combine block
  contents you should fetch the block content when calling start a second time,
  or use the capturing mode of ``append()``.
- ``View::prepend()`` no longer has a capturing mode.
- ``View::startIfEmpty()`` has been removed. Now that start() always overwrites
  startIfEmpty serves no purpose.
- The ``View::$Helpers`` property has been removed and replaced with
  ``_helpers``. If you need to load helpers at runtime you should use
  ``$this->addHelper()`` in your view files.
- ``View`` will now raise ``Cake\View\Exception\MissingTemplateException`` when
  templates are missing instead of ``MissingViewException``.

ViewBlock
---------

- ``ViewBlock::append()`` has been removed, use :php:meth:`Cake\\View\ViewBlock::concat()` instead. However,
  ``View::append()`` still exists.

JsonView
--------

- By default JSON data will have HTML entities encoded now. This prevents
  possible XSS issues when JSON view content is embedded in HTML files.
- :php:class:`Cake\\View\\JsonView` now supports the ``_jsonOptions`` view
  variable. This allows you to configure the bit-mask options used when generating
  JSON.

XmlView
-------

- :php:class:`Cake\\View\\XmlView` now supports the ``_xmlOptions`` view
  variable. This allows you to configure the options used when generating
  XML.

View\\Helper
============

- The ``$settings`` property is now called ``$_config`` and should be accessed
  through the ``config()`` method.
- Configuration options are no longer set as public properties.
- ``Helper::clean()`` was removed. It was never robust enough
  to fully prevent XSS. instead you should escape content with :php:func:`h` or
  use a dedicated library like htmlPurifier.
- ``Helper::output()`` was removed. This method was
  deprecated in 2.x.
- Methods ``Helper::webroot()``, ``Helper::url()``, ``Helper::assetUrl()``,
  ``Helper::assetTimestamp()`` have been moved to new :php:class:`Cake\\View\\Helper\\UrlHelper`
  helper. ``Helper::url()`` is now available as :php:meth:`Cake\\View\\Helper\\UrlHelper::build()`.
- Magic accessors to deprecated properties have been removed. The following
  properties now need to be accessed from the request object:

  - base
  - here
  - webroot
  - data
  - action
  - params

Helper
------

Helper has had the following methods removed:

* ``Helper::setEntity()``
* ``Helper::entity()``
* ``Helper::model()``
* ``Helper::field()``
* ``Helper::value()``
* ``Helper::_name()``
* ``Helper::_initInputField()``
* ``Helper::_selectedArray()``

These methods were part used only by FormHelper, and part of the persistent
field features that have proven to be problematic over time. FormHelper no
longer relies on these methods and the complexity they provide is not necessary
anymore.

The following methods have been removed:

* ``Helper::_parseAttributes()``
* ``Helper::_formatAttribute()``

These methods can now be found on the ``StringTemplate`` class that helpers
frequently use. See the ``StringTemplateTrait`` for an easy way to integrate
string templates into your own helpers.

FormHelper
----------

FormHelper has been entirely rewritten for 3.0. It features a few large changes:

* FormHelper works with the new ORM. But has an extensible system for
  integrating with other ORMs or datasources.
* FormHelper features an extensible widget system that allows you to create new
  custom input widgets and augment the built-in ones.
* String templates are the foundation of the helper. Instead of munging arrays
  together everywhere, most of the HTML FormHelper generates can be customized
  in one central place using template sets.

In addition to these larger changes, some smaller breaking changes have been
made as well. These changes should help streamline the HTML FormHelper generates
and reduce the problems people had in the past:

- The ``data[`` prefix was removed from all generated inputs.  The prefix serves no real purpose anymore.
- The various standalone input methods like ``text()``, ``select()`` and others
  no longer generate id attributes.
- The ``inputDefaults`` option has been removed from ``create()``.
- Options ``default`` and ``onsubmit`` of ``create()`` have been removed. Instead
  one should use JavaScript event binding or set all required js code for ``onsubmit``.
- ``end()`` can no longer make buttons. You should create buttons with
  ``button()`` or ``submit()``.
- ``FormHelper::tagIsInvalid()`` has been removed. Use ``isFieldError()``
  instead.
- ``FormHelper::inputDefaults()`` has been removed. You can use ``templates()``
  to define/augment the templates FormHelper uses.
- The ``wrap`` and ``class`` options have been removed from the ``error()``
  method.
- The ``showParents`` option has been removed from select().
- The ``div``, ``before``, ``after``, ``between`` and ``errorMessage`` options
  have been removed from ``input()``.  You can use templates to update the
  wrapping HTML. The ``templates`` option allows you to override the loaded
  templates for one input.
- The ``separator``, ``between``, and ``legend`` options have been removed from
  ``radio()``. You can use templates to change the wrapping HTML now.
- The ``format24Hours`` parameter has been removed from ``hour()``.
  It has been replaced with the ``format`` option.
- The ``minYear``, and ``maxYear`` parameters have been removed from ``year()``.
  Both of these parameters can now be provided as options.
- The ``dateFormat`` and ``timeFormat`` parameters have been removed from
  ``datetime()``. You can use the template to define the order the inputs should
  be displayed in.
- The ``submit()`` has had the ``div``, ``before`` and ``after`` options
  removed. You can customize the ``submitContainer`` template to modify this
  content.
- The ``inputs()`` method no longer accepts ``legend`` and ``fieldset`` in the
  ``$fields`` parameter, you must use the ``$options`` parameter.
  It now also requires ``$fields`` parameter to be an array. The ``$blacklist``
  parameter has been removed, the functionality has been replaced by specifying
  ``'field' => false`` in the ``$fields`` parameter.
- The ``inline`` parameter has been removed from postLink() method.
  You should use the ``block`` option instead. Setting ``block => true`` will
  emulate the previous behavior.
- The ``timeFormat`` parameter for ``hour()``, ``time()`` and ``dateTime()`` now
  defaults to 24, complying with ISO 8601.
- The ``$confirmMessage`` argument of :php:meth:`Cake\\View\\Helper\\FormHelper::postLink()`
  has been removed. You should now use key ``confirm`` in ``$options`` to specify
  the message.
- Checkbox and radio input types are now rendered *inside* of label elements
  by default. This helps increase compatibility with popular CSS libraries like
  `Bootstrap <http://getbootstrap.com/>`_ and
  `Foundation <http://foundation.zurb.com/>`_.
- Templates tags are now all camelBacked. Pre-3.0 tags ``formstart``, ``formend``, ``hiddenblock``
  and ``inputsubmit`` are now ``formStart``, ``formEnd``, ``hiddenBlock`` and ``inputSubmit``.
  Make sure you change them if they are customized in your app.

It is recommended that you review the :doc:`/views/helpers/form`
documentation for more details on how to use the FormHelper in 3.0.

HtmlHelper
----------

- ``HtmlHelper::useTag()`` has been removed, use ``tag()`` instead.
- ``HtmlHelper::loadConfig()`` has been removed. Customizing the tags can now be
  done using ``templates()`` or the ``templates`` setting.
- The second parameter ``$options`` for ``HtmlHelper::css()`` now always requires an array as documented.
- The first parameter ``$data`` for ``HtmlHelper::style()`` now always requires an array as documented.
- The ``inline`` parameter has been removed from meta(), css(), script(), scriptBlock()
  methods. You should use the ``block`` option instead. Setting ``block =>
  true`` will emulate the previous behavior.
- ``HtmlHelper::meta()`` now requires ``$type`` to be a string. Additional options can
  further on be passed as ``$options``.
- ``HtmlHelper::nestedList()`` now requires ``$options`` to be an array. The forth argument for the tag type
  has been removed and included in the ``$options`` array.
- The ``$confirmMessage`` argument of :php:meth:`Cake\\View\\Helper\\HtmlHelper::link()`
  has been removed. You should now use key ``confirm`` in ``$options`` to specify
  the message.

PaginatorHelper
---------------

- ``link()`` has been removed. It was no longer used by the helper internally.
  It had low usage in user land code, and no longer fit the goals of the helper.
- ``next()`` no longer has 'class', or 'tag' options. It no longer has disabled
  arguments. Instead templates are used.
- ``prev()`` no longer has 'class', or 'tag' options. It no longer has disabled
  arguments. Instead templates are used.
- ``first()`` no longer has 'after', 'ellipsis', 'separator', 'class', or 'tag' options.
- ``last()`` no longer has 'after', 'ellipsis', 'separator', 'class', or 'tag' options.
- ``numbers()`` no longer has 'separator', 'tag', 'currentTag', 'currentClass',
  'class', 'tag', 'ellipsis' options. These options are now facilitated through
  templates. It also requires the ``$options`` parameter to be an array now.
- The ``%page%`` style placeholders have been removed from :php:meth:`Cake\\View\\Helper\\PaginatorHelper::counter()`.
  Use ``{{page}}`` style placeholders instead.
- ``url()`` has been renamed to ``generateUrl()`` to avoid method declaration clashes with ``Helper::url()``.

By default all links and inactive texts are wrapped in ``<li>`` elements. This
helps make CSS easier to write, and improves compatibility with popular CSS
frameworks.

Instead of the various options in each method, you should use the templates
feature. See the :ref:`paginator-templates` documentation for
information on how to use templates.

TimeHelper
----------

- ``TimeHelper::__set()``, ``TimeHelper::__get()``, and  ``TimeHelper::__isset()`` were
  removed. These were magic methods for deprecated attributes.
- ``TimeHelper::serverOffset()`` has been removed.  It promoted incorrect time math practices.
- ``TimeHelper::niceShort()`` has been removed.

NumberHelper
------------

- :php:meth:`NumberHelper::format()` now requires ``$options`` to be an array.

SessionHelper
-------------

- The ``SessionHelper`` has been deprecated. You can use ``$this->request->session()`` directly,
  and the flash message functionality has been moved into :doc:`/views/helpers/flash` instead.

JsHelper
--------

- ``JsHelper`` and all associated engines have been removed. It could only
  generate a very small subset of JavaScript code for selected library and
  hence trying to generate all JavaScript code using just the helper often
  became an impediment. It's now recommended to directly use JavaScript library
  of your choice.

CacheHelper Removed
-------------------

CacheHelper has been removed. The caching functionality it provided was
non-standard, limited and incompatible with non-HTML layouts and data views.
These limitations meant a full rebuild would be necessary. Edge Side Includes
have become a standardized way to implement the functionality CacheHelper used
to provide. However, implementing `Edge Side Includes
<http://en.wikipedia.org/wiki/Edge_Side_Includes>`_ in PHP has a number of
limitations and edge cases. Instead of building a sub-par solution, we recommend
that developers needing full response caching use `Varnish
<http://varnish-cache.org>`_ or `Squid <http://squid-cache.org>`_ instead.

I18n
====

The I18n subsystem was completely rewritten. In general, you can expect the same
behavior as in previous versions, specifically if you are using the ``__()``
family of functions.

Internally, the ``I18n`` class uses ``Aura\Intl``, and appropriate methods are
exposed to access the specific features of this library. For this reason most
methods inside ``I18n`` were removed or renamed.

Due to the use of ``ext/intl``, the L10n class was completely removed. It
provided outdated and incomplete data in comparison to the data available from
the ``Locale`` class in PHP.

The default application language will no longer be changed automatically by the
browser accepted language nor by having the ``Config.language`` value set in the
browser session. You can, however, use a dispatcher filter to get automatic
language switching from the ``Accept-Language`` header sent by the browser::

    // In config/bootstrap.php
    DispatcherFactory::addFilter('LocaleSelector');

There is no built-in replacement for automatically selecting the language by
setting a value in the user session.

The default formatting function for translated messages is no longer
``sprintf``, but the more advanced and feature rich ``MessageFormatter`` class.
In general you can rewrite placeholders in messages as follows::

    // Before:
    __('Today is a %s day in %s', 'Sunny', 'Spain');

    // After:
    __('Today is a {0} day in {1}', 'Sunny', 'Spain');

You can avoid rewriting your messages by using the old ``sprintf`` formatter::

    I18n::defaultFormatter('sprintf');

Additionally, the ``Config.language`` value was removed and it can no longer be
used to control the current language of the application. Instead, you can use
the ``I18n`` class::

    // Before
    Configure::write('Config.language', 'fr_FR');

    // Now
    I18n::setLocale('en_US');

- The methods below have been moved:

    - From ``Cake\I18n\Multibyte::utf8()`` to ``Cake\Utility\Text::utf8()``
    - From ``Cake\I18n\Multibyte::ascii()`` to ``Cake\Utility\Text::ascii()``
    - From ``Cake\I18n\Multibyte::checkMultibyte()`` to ``Cake\Utility\Text::isMultibyte()``

- Since CakePHP now requires the mbstring extension, the
  ``Multibyte`` class has been removed.
- Error messages throughout CakePHP are no longer passed through I18n
  functions. This was done to simplify the internals of CakePHP and reduce
  overhead. The developer facing messages are rarely, if ever, actually translated -
  so the additional overhead reaps very little benefit.

L10n
====

- :php:class:`Cake\\I18n\\L10n` 's constructor now takes a :php:class:`Cake\\Network\\Request` instance as argument.

Testing
=======

- The ``TestShell`` has been removed. CakePHP, the application skeleton and
  newly baked plugins all use ``phpunit`` to run tests.
- The webrunner (webroot/test.php) has been removed. CLI adoption has greatly
  increased since the initial release of 2.x. Additionaly, CLI runners offer
  superior integration with IDE's and other automated tooling.

  If you find yourself in need of a way to run tests from a browser you should
  checkout `VisualPHPUnit <https://github.com/NSinopoli/VisualPHPUnit>`_. It
  offers many additional features over the old webrunner.
- ``ControllerTestCase`` is deprecated and will be removed for CakePHP 3.0.0.
  You should use the new :ref:`integration-testing` features instead.
- Fixtures should now be referenced using their plural form::

    // Instead of
    $fixtures = ['app.article'];

    // You should use
    $fixtures = ['app.articles'];

Utility
=======

Set Class Removed
-----------------

The Set class has been removed, you should use the Hash class instead now.

Folder & File
-------------

The folder and file classes have been renamed:

- ``Cake\Utility\File`` renamed to :php:class:`Cake\\Filesystem\\File`
- ``Cake\Utility\Folder`` renamed to :php:class:`Cake\\Filesystem\\Folder`

Inflector
---------

- The default value for ``$replacement`` argument of :php:meth:`Cake\\Utility\\Inflector::slug()`
  has been changed from underscore (``_``) to dash (``-``). Using dashes to
  separate words in URLs is the popular choice and also recommended by Google.

- Transliterations for :php:meth:`Cake\\Utility\\Inflector::slug()` have changed.
  If you use custom transliterations you will need to update your code. Instead
  of regular expressions, transliterations use simple string replacement. This
  yielded significant performance improvements::

    // Instead of
    Inflector::rules('transliteration', [
        '/ä|æ/' => 'ae',
        '/å/' => 'aa'
    ]);

    // You should use
    Inflector::rules('transliteration', [
        'ä' => 'ae',
        'æ' => 'ae',
        'å' => 'aa'
    ]);

- Separate set of uninflected and irregular rules for pluralization and
  singularization have been removed. Instead we now have a common list for each.
  When using :php:meth:`Cake\\Utility\\Inflector::rules()` with type 'singular'
  and 'plural' you can no longer use keys like 'uninflected', 'irregular' in
  ``$rules`` argument array.

  You can add / overwrite the list of uninflected and irregular rules using
  :php:meth:`Cake\\Utility\\Inflector::rules()` by using values 'uninflected' and
  'irregular' for ``$type`` argument.

Sanitize
--------

- ``Sanitize`` class has been removed.

Security
--------

- ``Security::cipher()`` has been removed. It is insecure and promoted bad
  cryptographic practices. You should use :php:meth:`Security::encrypt()`
  instead.
- The Configure value ``Security.cipherSeed`` is no longer required. With the
  removal of ``Security::cipher()`` it serves no use.
- Backwards compatibility in :php:meth:`Cake\\Utility\\Security::rijndael()` for values encrypted prior
  to CakePHP 2.3.1 has been removed. You should re-encrypt values using
  ``Security::encrypt()`` and a recent version of CakePHP 2.x before migrating.
- The ability to generate a blowfish hash has been removed. You can no longer use type
  "blowfish" for ``Security::hash()``. One should just use PHP's `password_hash()`
  and `password_verify()` to generate and verify blowfish hashes. The compability
  library `ircmaxell/password-compat <https://packagist.org/packages/ircmaxell/password-compat>`_
  which is installed along with CakePHP provides these functions for PHP < 5.5.
- OpenSSL is now used over mcrypt when encrypting/decrypting data. This change
  provides better performance and future proofs CakePHP against distros dropping
  support for mcrypt.
- ``Security::rijndael()`` is deprecated and only available when using mcrypt.

.. warning::

    Data encrypted with Security::encrypt() in previous versions is not
    compatible with the openssl implementation. You should :ref:`set the
    implementation to mcrypt <force-mcrypt>` when upgrading.

Time
----

- ``CakeTime`` has been renamed to :php:class:`Cake\\I18n\\Time`.
- ``CakeTime::serverOffset()`` has been removed.  It promoted incorrect time math practises.
- ``CakeTime::niceShort()`` has been removed.
- ``CakeTime::convert()`` has been removed.
- ``CakeTime::convertSpecifiers()`` has been removed.
- ``CakeTime::dayAsSql()`` has been removed.
- ``CakeTime::daysAsSql()`` has been removed.
- ``CakeTime::fromString()`` has been removed.
- ``CakeTime::gmt()`` has been removed.
- ``CakeTime::toATOM()`` has been renamed to ``toAtomString``.
- ``CakeTime::toRSS()`` has been renamed to ``toRssString``.
- ``CakeTime::toUnix()`` has been renamed to ``toUnixString``.
- ``CakeTime::wasYesterday()`` has been renamed to ``isYesterday`` to match the rest
  of the method naming.
- ``CakeTime::format()`` Does not use ``sprintf`` format strings anymore, you can use
  ``i18nFormat`` instead.
- :php:meth:`Time::timeAgoInWords()` now requires ``$options`` to be an array.

Time is not a collection of static methods anymore, it extends ``DateTime`` to
inherit all its methods and adds location aware formatting functions with the
help of the ``intl`` extension.

In general, expressions looking like this::

    CakeTime::aMethod($date);

Can be migrated by rewriting it to::

    (new Time($date))->aMethod();

Number
------

The Number library was rewritten to internally use the ``NumberFormatter``
class.

- ``CakeNumber`` has been renamed to :php:class:`Cake\\I18n\\Number`.
- :php:meth:`Number::format()` now requires ``$options`` to be an array.
- :php:meth:`Number::addFormat()` was removed.
- ``Number::fromReadableSize()`` has been moved to :php:meth:`Cake\\Utility\\Text::parseFileSize()`.

Validation
----------

- The range for :php:meth:`Validation::range()` now is inclusive if ``$lower`` and
  ``$upper`` are provided.
- ``Validation::ssn()`` has been removed.

Xml
---

- :php:meth:`Xml::build()` now requires ``$options`` to be an array.
- ``Xml::build()`` no longer accepts a URL. If you need to create an XML
  document from a URL, use :ref:`Http\\Client <http-client-xml-json>`.
