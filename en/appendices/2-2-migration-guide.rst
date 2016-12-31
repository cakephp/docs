2.2 Migration Guide
###################

CakePHP 2.2 is a fully API compatible upgrade from 2.0/2.1. This page outlines the
changes and improvements made for 2.2.

.. _required-steps-to-upgrade-2-2:

Required steps to upgrade
=========================

When upgrading to CakePHP 2.2 its important to add a few new configuration
values to ``app/Config/bootstrap.php``. Adding these will ensure consistent
behavior with 2.1.x::

    // Enable the Dispatcher filters for plugin assets, and
    // CacheHelper.
    Configure::write('Dispatcher.filters', array(
        'AssetDispatcher',
        'CacheDispatcher'
    ));

    // Add logging configuration.
    CakeLog::config('debug', array(
        'engine' => 'FileLog',
        'types' => array('notice', 'info', 'debug'),
        'file' => 'debug',
    ));
    CakeLog::config('error', array(
        'engine' => 'FileLog',
        'types' => array('warning', 'error', 'critical', 'alert', 'emergency'),
        'file' => 'error',
    ));

You will also need to modify ``app/Config/core.php``. Change the value of
:php:const:`LOG_ERROR` to :php:const:`LOG_ERR`::

    define('LOG_ERROR', LOG_ERR);

When using ``Model::validateAssociated()`` or ``Model::saveAssociated()`` and
primary model validation fails, the validation errors of associated models are no longer wiped out.
``Model::$validationErrors`` will now always show all the errors.
You might need to update your test cases to reflect this change.

Console
=======

I18N extract shell
------------------

- An option was added to overwrite existing POT files by default::

    ./Console/cake i18n extract --overwrite


Models
======

- ``Model::find('count')`` will now call the custom find methods with
  ``$state = 'before'`` and ``$queryData['operation'] = 'count'``.
  In many cases custom finds already return correct counts for pagination,
  but ``'operation'`` key allows more flexibility to build other queries,
  or drop joins which are required for the custom finder itself.
  As the pagination of custom find methods never worked quite well it required
  workarounds for this in the model level, which are now no longer needed.
- ``Model::find('first')`` will now return an empty array when no records are found.

Datasources
===========

- Dbo datasources now supports real nested transactions. If you need to use this
  feature in your application, enable it using
  ``ConnectionManager::getDataSource('default')->useNestedTransactions = true;``

Testing
=======

- The webrunner now includes links to re-run a test with debug output.
- Generated test cases for Controller now subclass
  :php:class:`ControllerTestCase`.


Error Handling
==============

- When repeat exceptions, or exception are raised when rendering error pages,
  the new ``error`` layout will be used. It's recommended to not use additional
  helpers in this layout as its intended for development level errors only. This
  fixes issues with fatal errors in rendering error pages due to helper usage in
  the ``default`` layout.
- It is important to copy the ``app/View/Layouts/error.ctp`` into your app
  directory. Failing to do so will make error page rendering fail.
- You can now configure application specific console error handling. By setting
  ``Error.consoleHandler``, and ``Exception.consoleHandler`` you can define the
  callback that will handle errors/exceptions raised in console applications.
- The handler configured in ``Error.handler`` and ``Error.consoleHandler`` will
  receive fatal error codes (ie. ``E_ERROR``, ``E_PARSE``, ``E_USER_ERROR``).

Exceptions
----------

- The :php:class:`NotImplementedException` was added.


Core
====

Configure
---------

- :php:meth:`Configure::dump()` was added. It is used to persist configuration
  data in durable storage like files. Both :php:class:`PhpReader` and
  :php:class:`IniReader` work with it.
- A new config parameter 'Config.timezone' is available in which you can set
  users' timezone string. eg. You can do ``Configure::write('Config.timezone',
  'Europe/Paris')``. If a method of ``CakeTime`` class is called with
  ``$timezone`` parameter as null and 'Config.timezone' is set, then the value
  of 'Config.timezone' will be used. This feature allows you to set users'
  timezone just once instead of passing it each time in function calls.


Controller
==========

AuthComponent
-------------

- The options for adapters defined in :php:attr:`AuthComponent::$authenticate`
  now accepts a ``contain`` option. This is used to set containable options for
  when user records are loaded.

CookieComponent
---------------

- You can now encrypt cookie values with the rijndael cipher. This requires
  the `mcrypt <https://secure.php.net/mcrypt>`_ extension to be installed. Using
  rijndael gives cookie values actual encryption, and is recommended in place of
  the XOR cipher available in previous releases. The XOR cipher is still the
  default cipher scheme to maintain compatibility with previous releases. You
  can read more in the :php:meth:`Security::rijndael()` documentation.

Pagination
==========

- Paginating custom finders will now return correct counts, see Model changes
  for more info.


Network
=======

CakeEmail
---------

- :php:meth:`CakeEmail::charset()` and :php:meth:`CakeEmail::headerCharset()`
  were added.
- Legacy Japanese encodings are now handled correctly. ``ISO-2202-JP`` is used
  when the encoding is ``ISO-2202-JP-MS`` which works around a number of issues
  in mail clients when dealing with the CP932 and Shift_JIS encodings.
- :php:meth:`CakeEmail::theme()` was added.
- :php:meth:`CakeEmail::domain()` was added. You can use this method to set the
  domain name used when sending email from a CLI script or if you want to
  control the hostname used to send email.
- You can now define ``theme`` and ``helpers`` in your EmailConfig class.

CakeRequest
-----------

- CakeRequest will now automatically decode
  ``application/x-www-form-urlencoded`` request bodies on ``PUT`` and ``DELETE``
  requests. This data will be available as ``$this->data`` just like POST data
  is.

Utility
=======

Set
---

- The :php:class:`Set` class is now deprecated, and replaced by the :php:class:`Hash` class.
  Set will not be removed until 3.0.
- :php:meth:`Set::expand()` was added.

Hash
----

The :php:class:`Hash` class was added in 2.2. It replaced Set providing a more
consistent, reliable and performant API to doing many of the same tasks Set
does. See the :doc:`/core-utility-libraries/hash` page for more detail.

CakeTime
--------

- The ``$userOffset`` parameter has been replaced with ``$timezone`` parameter
  in all relevant functions. So instead of numeric offset you can now pass in a
  timezone string or DateTimeZone object. Passing numeric offsets for
  ``$timezone`` parameter is still possible for backwards compatibility.
- :php:meth:`CakeTime::timeAgoInWords()` had the ``accuracy`` option added.
  This option allows you to specify how accurate formatted times should be.

- New methods added:

  * :php:meth:`CakeTime::toServer()`
  * :php:meth:`CakeTime::timezone()`
  * :php:meth:`CakeTime::listTimezones()`

- The ``$dateString`` parameter in all methods now accepts a DateTime object.


Helpers
=======

FormHelper
----------

- FormHelper now better handles adding required classes to inputs. It now
  honors the ``on`` key.
- :php:meth:`FormHelper::radio()` now supports an ``empty`` which works similar
  to the empty option on ``select()``.
- Added :php:meth:`FormHelper::inputDefaults()` to set common properties for
  each of the inputs generated by the helper

TimeHelper
----------

- Since 2.1, TimeHelper uses the CakeTime class for all its relevant methods.
  The ``$userOffset`` parameter has been replaced with ``$timezone`` parameter.
- :php:meth:`TimeHelper::timeAgoInWords()` has the ``element`` option added.
  This allows you to specify an HTML element to wrap the formatted time.

HtmlHelper
----------

- :php:meth:`HtmlHelper::tableHeaders()` now supports setting attributes per
  table cell.


Routing
=======

Dispatcher
----------

- Event listeners can now be attached to the dispatcher calls, those will have
  the ability to change the request information or the response before it is
  sent to the client. Check the full documentation for this new features in
  :doc:`/development/dispatch-filters`
- With the addition of :doc:`/development/dispatch-filters` you'll need to
  update ``app/Config/bootstrap.php``. See
  :ref:`required-steps-to-upgrade-2-2`.

Router
------

- :php:meth:`Router::setExtensions()` has been added. With the new method you can
  now add more extensions to be parsed, for example within a plugin routes file.

Cache
=====

Redis Engine
------------

A new caching engine was added using the `phpredis extension
<https://github.com/nicolasff/phpredis>`_ it is configured similarly to the
Memcache engine.

Cache groups
------------

It is now possible to tag or label cache keys under groups. This makes it
simpler to mass-delete cache entries associated to the same label. Groups are
declared at configuration time when creating the cache engine::

    Cache::config(array(
        'engine' => 'Redis',
        ...
        'groups' => array('post', 'comment', 'user')
    ));

You can have as many groups as you like, but keep in mind they cannot be
dynamically modified.

The :php:meth:`Cache::clearGroup()` class method was added. It takes the group
name and deletes all entries labeled with the same string.

Log
===

Changes in :php:class:`CakeLog` now require, some additional configuration in
your ``app/Config/bootstrap.php``. See :ref:`required-steps-to-upgrade-2-2`,
and :doc:`/core-libraries/logging`.

- The :php:class:`CakeLog` class now accepts the same log levels as defined in
  `RFC 5424 <http://tools.ietf.org/html/rfc5424>`_. Several convenience
  methods have also been added:

  * :php:meth:`CakeLog::emergency($message, $scope = array())`
  * :php:meth:`CakeLog::alert($message, $scope = array())`
  * :php:meth:`CakeLog::critical($message, $scope = array())`
  * :php:meth:`CakeLog::error($message, $scope = array())`
  * :php:meth:`CakeLog::warning($message, $scope = array())`
  * :php:meth:`CakeLog::notice($message, $scope = array())`
  * :php:meth:`CakeLog::info($message, $scope = array())`
  * :php:meth:`CakeLog::debug($message, $scope = array())`

- A third argument ``$scope`` has been added to :php:meth:`CakeLog::write`.
  See :ref:`logging-scopes`.
- A new log engine: :php:class:`ConsoleLog` has been added.

Model Validation
================

- A new object ``ModelValidator`` was added to delegate the work of validating
  model data, it should be transparent to the application and fully backwards
  compatible. It also exposes a rich API to add, modify and remove validation
  rules. Check docs for this object in :doc:`/models/data-validation`.

- Custom validation functions in your models need to have "public" visibility
  so that they are accessible by ``ModelValidator``.

- New validation rules added:

  * :php:meth:`Validation::naturalNumber()`
  * :php:meth:`Validation::mimeType()`
  * :php:meth:`Validation::uploadError()`

