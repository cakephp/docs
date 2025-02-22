5.2 Migration Guide
###################

The 5.2.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

Behavior Changes
================

- ``ValidationSet::add()`` will now raise errors when a rule is added with
  a name that is already defined. This change aims to prevent rules from being
  overwritten by accident.
- ``Http\Session`` will now raise an exception when an invalid session preset is
  used.
- ``FormProtectionComponent`` now raises ``Cake\Controller\Exception\FormProtectionException``. This
  class is a subclass of ``BadRequestException``, and offers the benefit of
  being filterable from logging.
- ``NumericPaginator::paginate()`` now uses the ``finder`` option even when a ``SelectQuery`` instance is passed to it.

Deprecations
============

Console
-------

- ``Arguments::getMultipleOption()`` is deprecated. Use ``getArrayOption()``
  instead.

Datasource
----------

- The ability to cast an ``EntityInterface`` instance to string has been deprecated.
  You should ``json_encode()`` the entity instead.

Event
-----

- Returning values from event listeners / callbacks is deprecated. Use ``$event->setResult()``
  instead or ``$event->stopPropogation()`` to just stop the event propogation.

View
----

- The ``errorClass`` option of ``FormHelper`` has been deprecated in favour of
  using a template string. To upgrade move your ``errorClass`` definition to
  a template set. See :ref:`customizing-templates`.


New Features
============

Console
-------

- The ``cake counter_cache`` command was added. This command can be used to
  regenerate counters for models that use ``CounterCacheBehavior``.
- ``ConsoleIntegrationTestTrait::debugOutput()`` makes it easier to debug
  integration tests for console commands.
- ``ConsoleInputArgument`` now supports a ``separator`` option. This option
  allows positional arguments to be delimited with a character sequence like
  ``,``. CakePHP will split the positional argument into an array when arguments
  are parsed.
- ``Arguments::getArrayArgumentAt()``, and ``Arguments::getArrayArgument()``
  were added. These methods allow you to read ``separator`` delimitered
  positional arguments as arrays.
- ``ConsoleInputOption`` now supports a ``separator`` option. This option
  allows option values to be delimited with a character sequence like
  ``,``. CakePHP will split the option value into an array when arguments
  are parsed.
- ``Arguments::getArrayArgumentAt()``, ``Arguments::getArrayArgument()``, and
  ``Arguments::getArrayOption()``
  were added. These methods allow you to read ``separator`` delimitered
  positional arguments as arrays.

Database
--------

- The ``nativeuuid`` type was added. This type enables ``uuid`` columns to be
  used in Mysql connections with MariaDB. In all other drivers, ``nativeuuid``
  is an alias for ``uuid``.
- ``Cake\Database\Type\JsonType::setDecodingOptions()`` was added. This method
  lets you define the value for the ``$flags`` argument of ``json_decode()``.
- ``CounterCacheBehavior::updateCounterCache()`` was added. This method allows
  you to update the counter cache values for all records of the configured
  associations. ``CounterCacheCommand`` was also added to do the same through the
  console.
- ``Cake\Database\Driver::quote()`` was added. This method provides a way to
  quote values to be used in SQL queries where prepared statements cannot be
  used.

ORM
---

- ``CounterCacheBehavior::updateCounterCache()`` has been addded. This method
  allows you to update the counter cache values for all records of the configured
  associations.
- ``BelongsToMany::setJunctionProperty()`` and ``getJunctionProperty()`` were
  added. These methods allow you to customize the ``_joinData`` property that is
  used to hydrate junction table records.


View
----

- ``FormHelper::deleteLink()`` has been added as convenience wrapper for delete links in
   templates using ``DELETE`` method.
- ``HtmlHelper::importmap()`` was added. This method allows you to define
  import maps for your JavaScript files.
- ``FormHelper`` now uses the ``containerClass`` template to apply a class to
  the form control div. The default value is ``input``.

Error
-----

- Custom exceptions can have specific error handling logic defined in
  ``ErrorController``.
