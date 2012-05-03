2.2 Migration Guide
###################

CakePHP 2.2 is a fully API compatible upgrade from 2.0/2.1.  This page outlines the
changes and improvements made for 2.2.

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

The ``$userOffset`` parameter has been replaced with ``$timezone`` parameter in all relevant functions.
So instead of numeric offset you can now pass in a timezone string or DateTimeZone object.
Passing numeric offsets for ``$timezone`` parameter is still possible for backwards compatibility.

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

Since 2.1, TimeHelper uses the CakeTime class for all its relevant methods. The ``$userOffset`` parameter
has been replaced with ``$timezone`` parameter.


Configuration
=============

``app/Config/bootstrap.php`` changed to add configuration related to Dispatcher
filters. If your application relies on assets in themes or plugins being
dispatched, or if your are using the full page caching feature you need to copy
the relevant configuration to your bootstrap file. Basically you only need to
add the following lines::

    <?php
    Configure::write('Dispatcher.filters', array(
	    'AssetDispatcher',
	    'CacheDispatcher'
    ));

Check the full documentation for this new features in
:doc:`/development/dispatch-filters`
