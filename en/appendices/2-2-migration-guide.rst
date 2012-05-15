2.2 Migration Guide
###################

CakePHP 2.2 is a fully API compatible upgrade from 2.0/2.1.  This page outlines the
changes and improvements made for 2.2.

.. _required-steps-to-upgrade-2-2:

Required steps to upgrade
=========================

When upgrading to CakePHP 2.2 its important to add a few new configuration
values to ``app/Config/bootstrap.php``.  Adding these will ensure consistent
behavior with 2.1.x::

    <?php
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

    <?php
    define('LOG_ERROR', LOG_ERR);

Models
======

- ``Model::_findCount()`` will now call the custom find methods with
  ``$state = 'before'`` and ``$queryData['operation'] = 'count'``.
  In many cases custom finds already return correct counts for pagination,
  but ``'operation'`` key allows more flexibility to build other queries,
  or drop joins which are required for the custom finder itself.
  As the pagination of custom find methods never worked quite well it required
  workarounds for this in the model level, which are now no longer needed

Datasources
===========

- Dbo datasources now supports real nested transactions. If you need to use this
  feature in your application, enable it using
  ``ConnectionManager::getDataSource('default')->useNestedTransactions = true;``

Testing
=======

- The webrunner now includes links to re-run a test with debug output.


Error Handling
==============

- When repeat exceptions, or exception are raised when rendering error pages,
  the new ``error`` layout will be used.  It's recommended to not use additional
  helpers in this layout as its intended for development level errors only. This
  fixes issues with fatal errors in rendering error pages due to helper usage in
  the ``default`` layout.
- It is important to copy the ``app/View/Layouts/error.ctp`` into your app
  directory.  Failing to do so will make error page rendering fail.
- You can now configure application specific console error handling.  By setting
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

- :php:meth:`Configure::dump()` was added.  It is used to persist configuration
  data in durable storage like files.  Both :php:class:`PhpReader` and
  :php:class:`IniReader` work with it.


Controller
==========

AuthComponent
-------------

- The options for adapters defined in :php:attr:`AuthComponent::$authenticate`
  now accepts a ``contain`` option. This is used to set containable options for
  when user records are loaded.

Network
=======

CakeEmail
---------

- :php:meth:`CakeEmail::charset()` and :php:meth:`CakeEmail::headerCharset()`
  were added.
- :php:meth:`CakeEmail::theme()` was added.
- :php:meth:`CakeEmail::domain()` was added. You can use this method to set the
  domain name used when sending email from a CLI script or if you want to
  control the hostname used to send email.

Utility
=======

Set
---

- The :php:class:`Set` class is now deprecated, and replaced by the :php:class:`Hash` class.
  Set will not be removed until 3.0.
- :php:meth:`Set::expand()` was added.

Hash
----

The :php:class:`Hash` class was added in 2.2.  It replaced Set providing a more
consistent, reliable and performant API to doing many of the same tasks Set
does. See the :doc:`/core-utility-libraries/hash` page for more detail.

CakeTime
--------

- The ``$userOffset`` parameter has been replaced with ``$timezone`` parameter
  in all relevant functions.  So instead of numeric offset you can now pass in a
  timezone string or DateTimeZone object.  Passing numeric offsets for
  ``$timezone`` parameter is still possible for backwards compatibility.
- :php:meth:`CakeTime::timeAgoInWords()` had the ``accuracy`` option added.
  This option allows you to specify how accurate formatted times should be.


Helpers
=======

FormHelper
----------

- FormHelper now better handles adding required classes to inputs.  It now
  honors the ``on`` key.
- :php:meth:`FormHelper::radio()` now supports an ``empty`` which works similar
  to the empty option on ``select()``.

TimeHelper
----------

- Since 2.1, TimeHelper uses the CakeTime class for all its relevant methods.
  The ``$userOffset`` parameter has been replaced with ``$timezone`` parameter.
- :php:meth:`TimeHelper::timeAgoInWords()` has the ``element`` option added.
  This allows you to specify an HTML element to wrap the formatted time.


Dispatcher
==========

With the addition of :doc:`/development/dispatch-filters` you'll need to update
``app/Config/bootstrap.php``.  See :ref:`required-steps-to-upgrade-2-2`, and see
the documentation in :doc:`/development/dispatch-filters`

Logging
=======

Changes in :php:class:`CakeLog` now require, some additional configuration
in your ``app/Config/bootstrap.php``.  See :ref:`required-steps-to-upgrade-2-2`,
and :doc:`/core-libraries/logging`.
