3.0 Migration Guide
###################

This page summarizes the changes from CakePHP 2.x that will assist in migrating
a project to 3.0, as well as reference to get up to date with the changes made
to the core since the CakePHP 2.x branch. Be sure to read the other pages in
this guide for all the new features and API changes.


Requirements
============

- CakePHP 3.x supports PHP Version 5.4.3 and above.
- CakePHP 3.x requires the mbstring extension.
- CakePHP 3.x requires the mcrypt extension.

.. warning::

    CakePHP 3.0 will not work if you do not meet the above requirements.

Application directory layout
============================

The application directory layout has changed to better implement PSR-0. You
should use the `app skeleton <https://github.com/cakephp/app>`_
project as a reference point when updating your application.

CakePHP should be installed with composer
=========================================


Since CakePHP can no longer easily be installed via PEAR, or in a shared
directory, those options are no longer supported.  Instead you should use
`composer <http://getcomposer.org>`_ to install CakePHP into your application.

Namespaces
==========

All of CakePHP's core classes are now namespaced under names matching the
filesystem directories.  For example ``Cake/Cache/Cache.php`` is named
``Cake\Cache\Cache``.  Global constants and helper methods like :php:meth:`__()`
and :php:meth:`debug()` are not namespaced for convenience sake.

Removed Constants
=================

The following deprecated constants have been removed::

* ``IMAGES``
* ``CSS``
* ``JS``
* ``IMAGES_URL``
* ``JS_URL``
* ``CSS_URL``

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

Basics
======

* ``LogError()`` was removed, it provided no benefit and is rarely/never used.

Cache
=====

* ``Memcache`` engine has been removed, use :php:class:`Cake\\Cache\\Cache\Engine\Memcached` instead.
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
=========

The config reader classes have been renamed::

* ``Cake\\Configure\\PhpReader`` renamed to :php:class:`Cake\\Configure\\Engine\PhpConfig`
* ``Cake\\Configure\\IniReader`` renamed to :php:class:`Cake\\Configure\\Engine\IniConfig`
* ``Cake\\Configure\\ConfigReaderInterface`` renamed to :php:class:`Cake\\Configure\\ConfigEngineInterface`

Console
=======

TaskCollection replaced
-----------------------

This class has been renamed to :php:class:`Cake\\Console\\TaskRegistry`.
See the section on :doc:`/core-libraries/registry-objects` for more information
on the features provided by the new class. You can use the ``cake upgrade
rename_collections`` to assist in upgrading your code. Tasks no longer have
access to callbacks, as there were never any callbacks to use.

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
* When configuring loggers you should use ``'levels'`` instead of 'types'.
* You can no longer specify custom log levels.  You must use the default set of
  log levels.  You should use logging scopes to create custom log files or
  specific handling for different sections of your application.
* :php:trait:`Cake\\Log\\LogTrait` was added. You can use this trait in your classes to
  add the ``log()`` method.


Routing
=======

Named Parameters
-----------------

Named parameters are removed in 3.0. Named parameters were added in 1.2.0 as
a 'pretty' version of query string parameters.  While the visual benefit is
arguable, the problems named parameters created are not.

Named parameters required special handling both in CakePHP as well as any PHP or
javascript library that needed to interact with them, as named parameters are
not implemented or understood by any library *except* CakePHP.  The additional
complexity and code required to support named parameters did not justify their
existance, and they have been removed.  In their place you should use standard
query string parameters or passed arguments.  By default ``Router`` will treat
any additional parameters to ``Router::url()`` as querystring arguments.

Since many applications will still need to parse incoming URL's containing named
parameters.  :php:meth:`Cake\\Routing\\Router::parseNamedParams()` has
been added to allow backwards compatiblity with existing URL's.


RequestActionTrait
------------------

- :php:meth:`Cake\\Routing\\RequestActionTrait::requestAction()` has had
  some of the extra options changed:

  - ``options[url]`` is now ``options[query]``.
  - ``options[data]`` is now ``options[post]``.

Router
------

* Named parameters have been removed, see above for more information.
* The ``full_base`` option has been replaced with the ``_full`` option.
* The ``ext`` option has been replaced with the ``_ext`` option.
* `_scheme`, `_port`, `_host`, `_base`, `_full`, `_ext` options added.
* String urls are no longer modified by adding the plugin/controller/prefix names.
* The default fallback route handling was removed.  If no routes
  match a parameter set `/` will be returned.
* Route classes are responsible for *all* url generation including
  query string parameters. This makes routes far more powerful and flexible.
* Persistent parameters were removed. They were replaced with
  :php:meth:`Cake\\Routing\\Router::urlFilter()` which allows
  a more flexible way to mutate urls being reverse routed.
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
  of issues with javascript libraries like TinyMCE and environments with
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

Response
-------

* The mapping of mimetype ``text/plain`` to extension ``csv`` has been removed.
  As a consequence :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`
  doesn't set extension to ``csv`` if ``Accept`` header contains mimetype ``text/plain``
  which was a common annoyance when receiving jquery's xhr requests.


Network\Http
============

* ``HttpSocket`` is now :php:class:`Cake\\Network\\Http\\Client`.
* Http\Client has been re-written from the ground up. It has a simpler/easy to
  use API, support for new authentication systems like Oauth, and file uploads.
  It uses PHP's stream API's so there is no requirement for curl. See the
  :doc:`/core-utility-libraries/httpclient` documentation for more information.

Network\Email
=============

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

- The ``$helpers``, ``$components``, and ``$uses`` properties are now merged
  with **all** parent classes not just ``AppController`` and the plugin
  app controller.
- ``Controller::httpCodes()`` has been removed, use :php:meth::`Cake\\Network\\Response::httpCodes()` instead.
- ``Controller::disableCache()`` has been removed, use :php:meth::`Cake\\Network\\Response::disableCache()` instead.

ComponentCollection replaced
----------------------------

This class has been renamed to :php:class:`Cake\\Controller\\ComponentRegistry`.
See the section on :doc:`/core-libraries/registry-objects` for more information
on the features provided by the new class. You can use the ``cake upgrade
rename_collections`` to assist in upgrading your code.

Component
---------

* The ``_Collection`` property is now ``_registry``. It contains an instance
  of :php:class:`Cake\\Controller\\ComponentRegistry` now.

Controller\\Components
======================

CookieComponent
---------------

- Uses :php:meth:`Cake\\Network\\Request::cookie()` to read cookie data,
  this eases testing, and allows for ControllerTestCase to set cookies.
- Cookies encrypted in previous versions of CakePHP using the ``cipher`` method
  are now un-readable because ``Security::cipher()`` has been removed. You will
  need to re-encrypt cookies with the ``rijndael`` method before upgrading.

AuthComponent
-------------

- ``BaseAuthenticate::_password()`` has been removed. Use a ``PasswordHasher``
  class instead.
- ``BlowfishAuthenticate`` class has been removed. Just use ``FormAuthenticate``
  with ``hashType`` set to ``Blowfish``.

RequestHandlerComponent
-----------------------

- The following methods have been removed from RequestHandler component::
  ``isAjax()``, ``isFlash()``, ``isSSL()``, ``isPut()``, ``isPost()``, ``isGet()``, ``isDelete()``.
  Use the :php:meth:`Cake\\Network\\Request::is()` method instead with relevant argument.
- ``RequestHandler::setContent()`` has removed, use :php:meth:`Cake\\Network\\Response::type()` instead.
- ``RequestHandler::getReferer()`` has removed, use :php:meth:`Cake\\Network\\Request::referer()` instead.
- ``RequestHandler::getClientIP()`` has removed, use :php:meth:`Cake\\Network\\Request::clientIp()` instead.
- ``RequestHandler::mapType()`` has removed, use :php:meth:`Cake\\Network\\Response::mapType()` instead.

SecurityComponent
-----------------

- The following methods and their related properties have been removed from Security component::
  ``requirePost()``, ``requireGet()``, ``requirePut()``, ``requireDelete()``.
  Use the :php:meth:`Cake\\Network\\Request::onlyAllow()`instead.
- ``SecurityComponent::$disabledFields()`` has been removed, use ```SecurityComponent::$unlockedFields()``.

Model
=====

ConnectionManager
-----------------

- ConnectionManager has been moved to the ``Cake\Database`` namespace.
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

ControllerTestCase
------------------

- You can now simulate both query string, post data and cookie values when using ``testAction()``

View
====

View folders renamed
-------------------------

The following View folders have been renamed to avoid naming collisions with controller names:

- ``Layouts`` is now ``Layout``
- ``Elements`` is now ``Element``
- ``Scaffolds`` is now ``Scaffold``
- ``Errors`` is now ``Error``
- ``Emails`` is now ``Email`` (same for ``Email`` inside ``Layout``)


HelperCollection replaced
-------------------------

This class has been renamed to :php:class:`Cake\\View\\HelperRegistry`.
See the section on :doc:`/core-libraries/registry-objects` for more information
on the features provided by the new class. You can use the ``cake upgrade
rename_collections`` to assist in upgrading your code.

View
====

- Key ``plugin`` has been removed from ``$options`` argument of :php:meth:`Cake\\View\\View::element()`.
  Specify the element name as ``SomePlugin.element_name`` instead.
- ``View::getVar()`` has been removed, use :php:meth:`Cake\\View\\View::get()` instead.

ViewBlock
---------

- ``ViewBlock::append()`` has been removed, use :php:meth:`Cake\\View\ViewBlock::concat()` instead.


View\\Helper
============

FormHelper
----------

- The ``data[`` prefix was removed from all generated inputs.  The prefix served no real purpose anymore.

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

Core
=====

Configure
---------

- :php:meth:`Cake\\Core\\Configure::consume()` was added.

Object
------

- ``Object::log()`` was removed from Object and added to the :php:trait:`Cake\\Log\\LogTrait` class.
- ``Object::requestAction()`` was removed from Object and added to the
  :php:trait:`Cake\\Routing\\RequestActionTrait`.

I18n
====

- The methods below has been moved:

  - From ``Cake\I18n\Multibyte::utf8()`` to ``Cake\Utility\String::utf8()``
  - From ``Cake\I18n\Multibyte::ascii()`` to ``Cake\Utility\String::ascii()``
  - From ``Cake\I18n\Multibyte::checkMultibyte()`` to ``Cake\Utility\String::isMultibyte()``

- Since having mbstring extension is now a requirement, the ``Multibyte`` class has been removed.

Utility
=======

Sanitize
--------

- ``Sanitize`` class has been removed.

Security
--------

- ``Security::cipher()`` has been removed. It is insecure and promotes bad
  cryptographic practices. You should use :php:meth:`Security::rijndael()`
  instead.
- The Configure value ``Security.cipherSeed`` is no longer required. With the
  removal of ``Security::cipher()`` it served no use.
- Backwards compatibility in :php:meth:`Cake\\Utility\\Security::rijndael()` for values encrypted prior
  to CakePHP 2.3.1 has been removed. You should re-encrypt values using a recent
  version of CakePHP 2.x before migrating.

