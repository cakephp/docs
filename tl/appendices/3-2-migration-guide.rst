3.2 Migration Guide
###################

CakePHP 3.2 is an API compatible upgrade from 3.1. This page outlines the
changes and improvements made in 3.2.

Minimum PHP 5.5 Required
========================

CakePHP 3.2 requires at least PHP 5.5.9. By adopting PHP 5.5 we can provide
better Date and Time libraries and remove dependencies on password compatibility
libraries.

Deprecations
============

As we continue to improve CakePHP, certain features are deprecated as they are
replaced with better solutions. Deprecated features will not be removed until
4.0:

* ``Shell::error()`` is deprecated because its name does not clearly indicate
  that it both outputs a message and stops execution. Use ``Shell::abort()``
  instead.
* ``Cake\Database\Expression\QueryExpression::type()`` is deprecated. Use
  ``tieWith()`` instead.
* ``Cake\Database\Type\DateTimeType::$dateTimeClass`` is deprecated.  Use
  DateTimeType::useMutable() or DateTimeType::useImmutable() instead.
* ``Cake\Database\Type\DateType::$dateTimeClass`` is deprecated.  Use
  ``DateTimeType::useMutable()`` or ``DateType::useImmutable()`` instead.
* ``Cake\ORM\ResultSet::_calculateTypeMap()`` is now unused and deprecated.
* ``Cake\ORM\ResultSet::_castValues()`` is now unused and deprecated.
* The ``action`` key for ``FormHelper::create()`` has been deprecated. You
  should use the ``url`` key directly.

Disabling Deprecation Warnings
------------------------------

Upon upgrading you may encounter several deprecation warnings. These warnings
are emitted by methods, options and functionality that will be removed in
CakePHP 4.x, but will continue to exist throughout the lifetime of 3.x. While we
recommend addressing deprecation issues as they are encountered, that is not
always possible. If you'd like to defer fixing deprecation notices, you can
disable them in your **config/app.php**::

    'Error' => [
        'errorLevel' => E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED,
    ]

The above error level will suppress deprecation warnings from CakePHP.

New Enhancements
================

Carbon Replaced with Chronos
----------------------------

The Carbon library has been replaced with :doc:`cakephp/chronos </chronos>`.
This new library is a fork of Carbon with no additional dependencies. It also
offer a calendar date object, and immutable versions of both date and datetime
objects.

New Date Object
---------------

The ``Date`` class allows you to cleanly map ``DATE`` columns into PHP objects.
Date instances will always fix their time to ``00:00:00 UTC``. By default the
ORM creates instances of ``Date`` when mapping ``DATE`` columns now.

New Immutable Date and Time Objects
-----------------------------------

The ``FrozenTime``, and ``FrozenDate`` classes were added. These classes offer
the same API as the ``Time`` object has. The frozen classes provide immutable
variants of ``Time`` and ``Date``.  By using immutable objects, you can prevent
accidental mutations. Instead of in-place modifications, modifier methods return
*new* instances::

    use Cake\I18n\FrozenTime;

    $time = new FrozenTime('2016-01-01 12:23:32');
    $newTime = $time->modify('+1 day');

In the above code ``$time`` and ``$newTime`` are different objects. The
``$time`` object retains its original value, while ``$newTime`` has the modified
value. See the :ref:`immutable-time` section for more information. As of 3.2,
the ORM can map date/datetime columns into immutable objects. See the
:ref:`immutable-datetime-mapping` section for more information.

CorsBuilder Added
-----------------

In order to make setting headers related to Cross Origin Requests (CORS) easier,
a new ``CorsBuilder`` has been added. This class lets you define CORS related
headers with a fluent interface. See :ref:`cors-headers` for more information.

RedirectRoute raises an exception on redirect
---------------------------------------------

``Router::redirect()`` now raises ``Cake\Network\Routing\RedirectException``
when a redirect condition is reached. This exception is caught by the routing
filter and converted into a response. This replaces calls to
``response->send()`` and allows dispatcher filters to interact with redirect
responses.

ORM Improvements
----------------

* Containing the same association multiple times now works as expected, and the
  query builder functions are now stacked.
* Function expressions now correctly cast their results. This means that
  expressions like ``$query->func()->current_date()`` will return datetime
  instances.
* Field data that fails validation can now be accessed in entities via the
  ``invalid()`` method.
* Entity accessor method lookups are now cached and perform better.

Improved Validator API
----------------------

The Validator object has a number of new methods that make building validators
less verbose. For example adding validation rules to a username field can now
look like::

    $validator->email('username')
        ->ascii('username')
        ->lengthBetween('username', [4, 8]);

Console Improvements
--------------------

* ``Shell::info()``, ``Shell::warn()`` and ``Shell::success()`` were added.
  These helper methods make using commonly used styling simpler.
* ``Cake\Console\Exception\StopException`` was added.
* ``Shell::abort()`` was added to replace ``error()``.

StopException Added
-------------------

``Shell::_stop()`` and ``Shell::error()`` no longer call ``exit()``. Instead
they raise ``Cake\Console\Exception\StopException``. If your shells/tasks are
catching ``\Exception`` where these methods would have been called, those catch
blocks will need to be updated so they don't catch the ``StopException``. By not
calling ``exit()`` testing shells should be easier and require fewer mocks.

Helper initialize() added
-------------------------

Helpers can now implement an ``initialize(array $config)`` hook method like
other class types.

Fatal Error Memory Limit Handling
---------------------------------

A new configuration option ``Error.extraFatalErrorMemory`` can be set to the
number of megabytes to increase the memory limit by when a fatal error is
encountered. This allows breathing room to complete logging or error handling.

Migration Steps
===============

Updating setToStringFormat()
----------------------------

Before CakePHP 3.2 using Time::setToStringFormat() was working on Date Objects
as well. After upgrading you will need to add Date::setToStringFormat() in
addition to see the formatted Date again.
