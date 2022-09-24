5.0 Migration Guide
###################

CakePHP 5.0 contains breaking changes, and is not backwards compatible with 4.x
releases. Before attempting to upgrade to 5.0, first upgrade to 4.5 and resolve
all deprecation warnings.

Refer to the :doc:`/appendices/5-0-upgrade-guide` for step by step instructions
on how to upgrade to 5.0.

Deprecated Features Removed
===========================

All methods, properties and functionality that were emitting deprecation warnings
as of 4.5 have been removed.

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

- The method signature for ``Controller::__constructor()`` has changed.
  So you need to adjust your code accordingly if you are overriding the constructor.
- After loading components are no longer set as dynamic properties. Instead
  ``Controller`` uses ``__get()`` to provide property access to components. This
  change can impact applications that use ``property_exists()`` on components.
- The components' ``Controller.shutdown`` event callback has been renamed from
  ``shutdown`` to ``afterFilter`` to match the controller one. This makes the callbacks more consistent.

Core
----

- The ``services()`` method was added to ``PluginInterface``.
- The function ``getTypeName()`` has been dropped. Use PHP's ``get_debug_type()`` instead.
- The dependency on ``league/container`` was updated to ``4.x``. This will
  require the addition of typehints to your ``ServiceProvider`` implementations.
- ``deprecationWarning()`` now has a ``$vesrion`` parameter.
- The ``App.uploadedFilesAsObjects`` configuration option has been removed
  alongside of support for PHP file upload shaped arrays throughout the
  framework.

Database
--------

- ``Query`` now accepts only ``\Closure`` parameters instead of ``callable``. Callables can be converted
  to closures using the new first-class array syntax in PHP 8.1.
- ``Query::execute()`` no longer runs results decorator callbacks. You must use ``Query::all()`` instead.
- ``getMaxAliasLength()`` and ``getConnectionRetries()`` were added
  to ``DriverInterface``.
- ``TableSchemaAwareInterface`` was removed.
- Supported drivers now automatically add auto-increment only to integer primary keys named "id" instead
  of all integer primary keys. Setting 'autoIncrement' to false always disables on all supported drivers.
- ``Driver::quote()`` was removed. Use prepared statements instead.

Datasource
----------

- The ``getAccessible()`` method was added to ``EntityInterface``.

Event
-----

- Event payloads must be an array. Other object such as ``ArrayAccess`` are no longer cast to array.

Filesystem
----------

- The Filesystem package was removed, and ``Filesystem`` class was moved to the Utility package.

Http
----

- ``ServerRequest`` is no longer compatible with ``files`` as arrays. This
  behavior has been disabled by default since 4.1.0. The ``files`` data will now
  always contain ``UploadedFileInterfaces`` objects.

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

- Finder arguments are now required to be associative arrays as they were always expected to be.
- ``TranslateBehavior`` now defaults to the ``ShadowTable`` strategy. If you are
  using the ``Eav`` strategy you will need to update your behavior configuration
  to retain the previous behavior.
- ``allowMultipleNulls`` option for ``isUnique`` rule now default to true matching
  the original 3.x behavior.

TestSuite
---------

- ``TestSuite`` was removed. Users should use environment variables to customize
  unit test settings instead.
- ``TestListenerTrait`` was removed. PHPUnit dropped support for these listeners.

Validation
----------

- ``Validation::isEmpty()`` is no longer compatible with file upload shaped
  arrays. Support for PHP file upload arrays has been removed from
  ``ServerRequest`` as well so you should not see this as a problem outside of
  tests.

View
----

- ``ViewBuilder`` options are now truly associative (string keys).
- ``NumberHelper`` and ``TextHelper`` no longer accept an ``engine`` config.
- ``ViewBuilder::setHelpers()`` parameter ``$merge`` was removed. Use ``ViewBuilder::addHelpers()`` instead.
- Inside ``View::initialize()``, prefer using ``addHelper()`` instead of ``loadHelper()``.
  All configured helpers will be loaded afterwards, anyway.
- ``View\Widget\FileWidget`` is no longer compatible with PHP file upload shaped
  arrays. This is aligned with ``ServerRequest`` and ``Validation`` changes.

New Features
============

Improved type checking
-----------------------

CakePHP 5 leverages the expanded type system feature available in PHP8.1+.
CakePHP also uses ``assert()`` to provide improved error messages and additional
type soundness. In production mode, you can configure PHP to not generate
code for ``assert()`` yielding improved application performance. See the
:ref:`symlink-assets` for how to do this.

Database
--------

- ``Query::all()`` was added which runs result decorator callbacks and returns a result set for select queries.
- ``EnumType`` was added to allow mapping between PHP backed enums and a string or integer column.
