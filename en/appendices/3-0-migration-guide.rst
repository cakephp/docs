3.0 Migration Guide
###################

This page summarizes the changes from CakePHP 2.x that will assist in migrating
a project to 3.0, as well as a reference to get up to date with the changes made
to the core since the CakePHP 2.x branch. Be sure to read the other pages in
this guide for all the new features and API changes.


Requirements
============

- CakePHP 3.x supports PHP Version 5.4.19 and above.
- CakePHP 3.x requires the mbstring extension.
- CakePHP 3.x requires the mcrypt extension.

.. warning::

    CakePHP 3.0 will not work if you do not meet the above requirements.

Application Directory Layout
============================

The application directory layout has changed and now follows
`PSR-4 <http://www.php-fig.org/psr/psr-4/>`_. You should use the
`app skeleton <https://github.com/cakephp/app>`_ project as a reference point
when updating your application.

CakePHP should be installed with Composer
=========================================

Since CakePHP can no longer easily be installed via PEAR, or in a shared
directory, those options are no longer supported. Instead you should use
`Composer <http://getcomposer.org>`_ to install CakePHP into your application.

Namespaces
==========

All of CakePHP's core classes are now namespaced and follow PSR-4 autoloading
specifications. For example ``src/Cache/Cache.php`` is namespaced as
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

Two new configure variables provide the path configuration for plugins, and
views. You can add multiple paths to ``App.paths.views`` and
``App.paths.plugins`` to configure multiple paths for plugins & view files.

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

Debugging
=========

* ``Configure::write('debug'`, $bool)`` does not support 0/1/2 anymore. A simple boolean
  is used instead to switch debug mode on or off.

Object settings/configuration
=============================

* Objects used in CakePHP now have a consistent instance-configuration storage/retrieval
  system. Code which previously accessed for example: `$object->settings` should instead
  be updated to use `$object->config()`.

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

All :php:class:`Cake\\Cache\\Cache\\CacheEngine` methods now honor/are responsible for handling the
configured key prefix. The :php:meth:`Cake\\Cache\\CacheEngine::write()` no longer permits setting
the duration on write - the duration is taken from the cache engine's runtime config. Calling a
cache method with an empty key will now throw an :php:class:`InvalidArgumentException`, instead
of returning false.


Core
====

App
---

- ``App::build()`` has been removed.
- ``App::location()`` has been removed.
- ``App::paths()`` has been removed.
- ``App::load()`` has been removed.
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

The config reader classes have been renamed:

- ``Cake\Configure\PhpReader`` renamed to :php:class:`Cake\\Configure\\Engine\PhpConfig`
- ``Cake\Configure\IniReader`` renamed to :php:class:`Cake\\Configure\\Engine\IniConfig`
- ``Cake\Configure\ConfigReaderInterface`` renamed to :php:class:`Cake\\Configure\\ConfigEngineInterface`
- :php:meth:`Cake\\Core\\Configure::consume()` was added.

Object
------

- ``Object::log()`` was removed from Object and added to the :php:trait:`Cake\\Log\\LogTrait` class.
- ``Object::requestAction()`` was removed from Object and added to the
  :php:trait:`Cake\\Routing\\RequestActionTrait`.

Console
=======

TaskCollection Replaced
-----------------------

This class has been renamed to :php:class:`Cake\\Console\\TaskRegistry`.
See the section on :doc:`/core-libraries/registry-objects` for more information
on the features provided by the new class. You can use the ``cake upgrade
rename_collections`` to assist in upgrading your code. Tasks no longer have
access to callbacks, as there were never any callbacks to use.

ApiShell Removed
----------------

The ApiShell was removed as it didn't provide any benefit over the file source itself
and the online documentation/`API <http://api.cakephp.org/>`_.

Event
=====

* The Event subsystem has had a number of optional features removed. When
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
* :php:trait:`Cake\\Log\\LogTrait` was added. You can use this trait in your classes to
  add the ``log()`` method.
* The logging scope passed to :php:meth:`Cake\\Log\\Log::write()` is now forwarded
  to the log engines' ``write()`` method in order to provide better context to
  the engines.

Routing
=======

Named Parameters
-----------------

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
been added to allow backwards compatiblity with existing URLs.


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
* `_scheme`, `_port`, `_host`, `_base`, `_full`, `_ext` options added.
* String URLs are no longer modified by adding the plugin/controller/prefix names.
* The default fallback route handling was removed.  If no routes
  match a parameter set `/` will be returned.
* Route classes are responsible for *all* URL generation including
  query string parameters. This makes routes far more powerful and flexible.
* Persistent parameters were removed. They were replaced with
  :php:meth:`Cake\\Routing\\Router::urlFilter()` which allows
  a more flexible way to mutate URLs being reverse routed.
* Calling :php:meth:`Cake\\Routing\\Router::parseExtensions()` with no
  parameters no longer parses all extensions.  You need to
  whitelist the extensions your application supports.

Route
-----

* ``CakeRoute`` was re-named to ``Route``.
* The signature of ``match()`` has changed to ``match($url, $context = array())``
  See :php:meth:`Cake\\Routing\\Route::match()` for information on the new signature.

Filter\AssetFilter
------------------

* Plugin & theme assets handled by the AssetFilter are no longer read via
  ``include`` instead they are treated as plain text files.  This fixes a number
  of issues with JavaScript libraries like TinyMCE and environments with
  short_tags enabled.
* Support for the ``Asset.filter`` configuration and hooks were removed. This
  feature can easily be replaced with a plugin or dispatcher filter.

Network
=======

Request
-------

* ``CakeRequest`` was renamed to :php:class:`Cake\\Network\\Request`.
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
  template adds detectors for "mobile" and "tablet" using `MobileDetect` lib.

Response
--------

* The mapping of mimetype ``text/plain`` to extension ``csv`` has been removed.
  As a consequence :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`
  doesn't set extension to ``csv`` if ``Accept`` header contains mimetype ``text/plain``
  which was a common annoyance when receiving a jQuery XHR request.

Network\\Session
================

* :php:class:`Cake\\Network\\Session` and related session classes have been
  moved under the ``Cake\Network`` namespace.

* ``SessionHandlerInterface`` has been removed in favor of the one provided by
  PHP itself.

* The property ``Session::$requestCountdown`` has been changed to protected.
  To specify the request countdown value you can now use the ``Session.requestCountdown``
  config variable.

Network\\Http
=============

* ``HttpSocket`` is now :php:class:`Cake\\Network\\Http\\Client`.
* Http\Client has been re-written from the ground up. It has a simpler/easier to
  use API, support for new authentication systems like OAuth, and file uploads.
  It uses PHP's stream APIs so there is no requirement for cURL. See the
  :doc:`/core-utility-libraries/httpclient` documentation for more information.

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
  from delivery profiles and allows you to easily re-use transports across email
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
  has been removed from CakePHP core, and will be provided as a standalone
  plugin.
- The ``Controller::$ext`` property has been removed. You now have to extend and
  overide the ``View::$_ext`` property if you want to use a non-default view file
  extension.

Scaffold Removed
----------------

The dynamic scaffolding in CakePHP has been removed from CakePHP core. It was
infrequently used, and never intended for production use. It will be replaced by
a standalone plugin that people requiring that feature can use.

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

Controller\\Components
======================

CookieComponent
---------------

- Uses :php:meth:`Cake\\Network\\Request::cookie()` to read cookie data,
  this eases testing, and allows for ControllerTestCase to set cookies.
- Cookies encrypted in previous versions of CakePHP using the ``cipher`` method
  are now un-readable because ``Security::cipher()`` has been removed. You will
  need to re-encrypt cookies with the ``rijndael`` method before upgrading.
- ``CookieComponent::type()`` has been renamed to more intuitive
  :php:meth:`Cake\\Controller\\Component\CookieComponent::encryption()`.
- Configuration options are no longer set as public properties.

AuthComponent
-------------

- ``Blowfish`` is now the default password hasher used by authentication classes.
  If you want to continue using SHA1 hashing used in 2.x use
  ``'passwordHasher' => 'Simple'`` in your authenticator configuration.
- ``BaseAuthenticate::_password()`` has been removed. Use a ``PasswordHasher``
  class instead.
- ``BlowfishAuthenticate`` class has been removed. Just use ``FormAuthenticate``
  with ``hashType`` set to ``Blowfish``.
- The ``loggedIn()`` method has been removed. Use ``user()`` instead.
- Configuration options are no longer set as public properties.

RequestHandlerComponent
-----------------------

- The following methods have been removed from RequestHandler component::
  ``isAjax()``, ``isFlash()``, ``isSSL()``, ``isPut()``, ``isPost()``, ``isGet()``, ``isDelete()``.
  Use the :php:meth:`Cake\\Network\\Request::is()` method instead with relevant argument.
- ``RequestHandler::setContent()`` has removed, use :php:meth:`Cake\\Network\\Response::type()` instead.
- ``RequestHandler::getReferer()`` has removed, use :php:meth:`Cake\\Network\\Request::referer()` instead.
- ``RequestHandler::getClientIP()`` has removed, use :php:meth:`Cake\\Network\\Request::clientIp()` instead.
- ``RequestHandler::mapType()`` has removed, use :php:meth:`Cake\\Network\\Response::mapType()` instead.
- Configuration options are no longer set as public properties.

SecurityComponent
-----------------

- The following methods and their related properties have been removed from Security component:
  ``requirePost()``, ``requireGet()``, ``requirePut()``, ``requireDelete()``.
  Use the :php:meth:`Cake\\Network\\Request::onlyAllow()` instead.
- ``SecurityComponent::$disabledFields()`` has been removed, use
  ``SecurityComponent::$unlockedFields()``.
- The CSRF related features in SecurityComponent have been extracted and moved
  into a separate CsrfComponent. This allows you more easily use CSRF protection
  without having to use form tampering prevention.
- Configuration options are no longer set as public properties.

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

- ConnectionManager has been moved to the ``Cake\\Database`` namespace.
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

TestSuite
=========

TestCase
--------

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

Note that some methods have switched the order, e.g. ``assertEqual($is, $expected)`` should now be
``assertEquals($expected, $is)``.
There is an upgrade shell command ``cake upgrade tests`` to assist in upgrading your code.

ControllerTestCase
------------------

- You can now simulate query strings, POST data and cookie values when using ``testAction()``.
  The default method for ``testAction()`` is now ``GET``.

View
====

View Folders Renamed
--------------------

The folders containing view files now go under `App/Template` instead of `App/View`.
This was done to separate the view files from files containing php classes (eg. Helpers, View classes).

The following View folders have been renamed to avoid naming collisions with controller names:

- ``Layouts`` is now ``Layout``
- ``Elements`` is now ``Element``
- ``Scaffolds`` is now ``Scaffold``
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

ViewBlock
---------

- ``ViewBlock::append()`` has been removed, use :php:meth:`Cake\\View\ViewBlock::concat()` instead.

JsonView
--------

- By default JSON data will have HTML entities encoded now. This prevents
  possible XSS issues when JSON view content is embedded in HTML files.
- :php:class:`Cake\\View\\JsonView` now supports the ``_jsonOptions`` view
  variable. This allows you to configure the bit-mask options used when generating
  JSON.


View\\Helper
============

- The ``$settings`` property is now called ``$_config`` and should be accessed
  through the ``config()`` method.
- Configuration options are no longer set as public properties.
- :php:meth:`Cake\\View\\Helper::clean()` was removed. It was never robust enough
  to fully prevent xss. instead you should escape content with :php:func:`h` or
  use a dedicated libray like htmlPurifier.
- :php:meth:`Cake\\View\\Helper::output()` was removed. This method was
  deprecated in 2.x.
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

* Helper::setEntity()
* Helper::entity()
* Helper::model()
* Helper::field()
* Helper::value()
* Helper::_name()
* Helper::_initInputField()
* Helper::_selectedArray()

These methods were part used only by FormHelper, and part of the persistent
field features that have proven to be problematic over time. FormHelper no
longer relies on these methods and the complexity they provide is not necessary
anymore.

The following methods have been removed:

* Helper::_parseAttributes()
* Helper::_formatAttribute()

These methods can now be found on the ``StringTemplate`` class that helpers
frequently use. See the ``StringTemplateTrait`` for an easy way to integrate
string templates into your own helpers.

FormHelper
----------

FormHelper has been entirely rewritten for 3.0. It features a few large changes:

* FormHelper works with the new ORM. But has an extensible system for
  integrating with other ORMs or datasources.
* FormHelper features an extensible widget system that allows you to create new
  custom input widgets and easily augment the built-in ones.
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
  one should use javascript event binding or set all required js code for ``onsubmit``.
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
- The ``inputs`` method no longer accepts ``legend`` and ``fieldset`` in the
  ``$fields`` parameter, you must use the ``$options`` parameter.
- The ``inline`` parameter has been removed from postLink() method.
  You should use the ``block`` option instead. Setting ``block => true`` will
  emulate the previous behavior.

It is recommended that you review the :doc:`/core-libraries/helpers/form`
documentation for more details on how to use the FormHelper in 3.0.

HtmlHelper
----------

- ``HtmlHelper::useTag()`` has been removed, use ``tag()`` instead.
- ``HtmlHelper::loadConfig()`` has been removed. Customizing the tags can now be
  done using ``templates()`` or the ``templates`` setting.
- The ``inline`` parameter has been removed from meta(), css(), script(), scriptBlock()
  methods. You should use the ``block`` option instead. Setting ``block =>
  true`` will emulate the previous behavior.


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
  templates.
- The ``%page%`` style placeholders have been removed from :php:meth:`Cake\\View\\Helper\\PaginatorHelper::counter()`.
  Use ``{{page}}`` style placeholders instead.

By default all links and inactive text is wrapped in ``<li>`` elements. This
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

I18n
====

- :php:class:`Cake\\I18n\\I18n` 's constructor now takes a :php:class:`Cake\\Network\\Request` instance as an argument.

- The methods below have been moved:

  - From ``Cake\I18n\Multibyte::utf8()`` to ``Cake\Utility\String::utf8()``
  - From ``Cake\I18n\Multibyte::ascii()`` to ``Cake\Utility\String::ascii()``
  - From ``Cake\I18n\Multibyte::checkMultibyte()`` to ``Cake\Utility\String::isMultibyte()``

- Since having the mbstring extension is now a requirement, the ``Multibyte`` class has been removed.
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

Utility
=======

Inflector
---------

Transliterations for :php:meth:`Cake\\Utility\\Inflector::slug()` have changed. If
you use custom transliterations you will need to update your code. Instead of
regular expressions, transliterations use simple string replacement. This
yielded significant performance improvements::

    // Instead of
    Inflector::rules('transliteration', array(
        '/ä|æ/' => 'ae',
        '/å/' => 'aa'
    ));

    // You should use
    Inflector::rules('transliteration', [
        'ä' => 'ae',
        'æ' => 'ae',
        'å' => 'aa'
    ]);


Sanitize
--------

- ``Sanitize`` class has been removed.

Security
--------

- ``Security::cipher()`` has been removed. It is insecure and promoted bad
  cryptographic practices. You should use :php:meth:`Security::rijndael()`
  instead.
- The Configure value ``Security.cipherSeed`` is no longer required. With the
  removal of ``Security::cipher()`` it serves no use.
- Backwards compatibility in :php:meth:`Cake\\Utility\\Security::rijndael()` for values encrypted prior
  to CakePHP 2.3.1 has been removed. You should re-encrypt values using a recent
  version of CakePHP 2.x before migrating.

Time
----

- ``CakeTime`` was renamed to :php:class:`Cake\\Utility\\Time`.
- ``Time::__set()`` and - ``Time::__get()`` were removed. These were
  magic setter/getter methods for backwards compatibility.
- ``CakeTime::serverOffset()`` has been removed.  It promoted incorrect time math practices.
- ``CakeTime::niceShort()`` has been removed.
