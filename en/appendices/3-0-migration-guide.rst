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

.. warning::

    CakePHP 3.0 will not work if you do not meet the above requirements.


Namespaces
==========

All of CakePHP's core classes are now namespaced under names matching the
filesystem directories.  For example ``Cake/Cache/Cache.php`` is named
``Cake\Cache\Cache``.  Global constants and helper methods like :php:meth:`__()`
and :php:meth:`debug()` are not namespaced for convenience sake.


Basics
======

* ``LogError()`` was removed, it provided no benefit and is rarely/never used.


Cache
=====

* Caching engines for :php:class:`Cake\\Cache\\Cache` are now configured using
  :php:meth:`Cake\\Core\\Configure` instead of using the ``config()`` method.
  ``Cache::config()`` will be removed for 3.0.0 stable.
* Cache engines are now lazy loaded upon first use.
* :php:meth:``Cake\\Cache\\Cache::engine()`` has been added.


Log
===

* :php:class:`Cake\\Log\\Log` is now configured using
  :php:meth:`Cake\\Core\\Configure` instead of using the ``config()`` method.
  ``Log::config()`` will be removed for 3.0.0 stable.
* Log engines are now lazily loaded upon the first write to the logs.
* :php:meth:``Cake\\Log\\Log::engine()`` has been added.
* ``Log::defaultLevels()`` was removed.
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

Controller
==========

Controller
----------

- The ``$helpers``, ``$components``, and ``$uses`` properties are now merged
  with **all** parent classes not just ``AppController`` and the plugin
  app controller.

Controller\Components
=====================

CookieComponent
---------------

- Uses :php:meth:`Request::cookie()` to read cookie data,
  this eases testing, and allows for ControllerTestCase to set cookies.


TestSuite
=========

ControllerTestCase
------------------

- You can now simulate both query string, post data and cookie values when using ``testAction()``


View\Helper
===========

FormHelper
----------

- The ``data[`` prefix was removed from all generated inputs.  The prefix served no real purpose anymore.


Core
=====

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
