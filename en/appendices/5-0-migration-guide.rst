5.0 Migration Guide
###################

CakePHP 5.0 contains breaking changes, and is not backwards compatible with 4.x
releases. Before attempting to upgrade to 5.0, first upgrade to 4.3 and resolve
all deprecation warnings.

Refer to the :doc:`/appendices/5-0-upgrade-guide` for step by step instructions
on how to upgrade to 5.0.

Deprecated Features Removed
===========================

All methods, properties and functionality that were emitting deprecation warnings
as of 4.3 have been removed.

Deprecations
============

The following is a list of deprecated methods, properties and behaviors. These
features will continue to function in 5.x and will be removed in 6.0.

n/a

Breaking Changes
================

In addition to the removal of deprecated features there have been breaking
changes made:

Global
------

- Type declarations were added to all function parameter and returns where possible. These are intended
  to match the docblock annotations, but include fixes for incorrect annotations.
- Type declarations were added to all class properties where possible. These also include some fixes for
  incorrect annotations.

Cache
-----

- The ``Wincache`` engine was removed. The wincache extension is not supported
  on PHP 8.

Controller
----------

- The components' ``Controller.shutdown`` event callback has been renamed from
  ``shutdown`` to ``afterFilter`` to match the controller one. This makes the callbacks more consistent.

Core
----

- The ``services()`` method was added to ``PluginInterface``.
- The function ``getTypeName()`` has been dropped. Use PHP's ``get_debug_type()`` instead.
- The dependency on ``league/container`` was updated to ``4.x``. This will
  require the addition of typehints to your ``ServiceProvider`` implementations.

Database
--------

- The ``getMaxAliasLength()`` and ``getConnectionRetries()`` methods were added
  to ``DriverInterface``.

Datasource
----------

- The ``getAccessible()`` method was added to ``EntityInterface``.

Event
-----

- Event payloads must be an array. Other object such as ``ArrayAccess`` are no longer cast to array.

Filesystem
----------

- The Filesystem package was removed, and the ``Filesystem`` was moved to the Utility package.

I18n
----

- `Time` was renamed to `DateTime` to allow for future time-only types.
- Translation files for plugins with vendor prefixed names (``FooBar/Awesome``) will now have that
  prefix in the file name, e.g. ``foo_bar_awesome.po`` to avoid collision with a ``awesome.po`` file
  from a corresponding plugin (``Awesome``).

Log
---

- Log engine config now uses ``null`` instead of ``false`` to disable scopes.
  So instead of ``'scopes' => false`` you need to use ``'scopes' => null`` in your log config.

ORM
---

- ``TranslateBehavior`` now defaults to the ``ShadowTable`` strategy. If you are
  using the ``Eav`` strategy you will need to update your behavior configuration
  to retain the previous behavior.

View
----

- ``NumberHelper`` and ``TextHelper`` no longer accept an ``engine`` config.
- ``ViewBuilder::setHelpers()`` has no second (merge) param anymore. Use ``addHelpers()`` here instead.


New Features
============
