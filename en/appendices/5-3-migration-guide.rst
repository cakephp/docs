5.3 Migration Guide
###################

The 5.3.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

Upgrade to PHP 8.2
==================

If you are not running on **PHP 8.2 or higher**, you will need to upgrade PHP before updating CakePHP.

.. note::
    CakePHP 5.3 requires **a minimum of PHP 8.2**.

Behavior Changes
================

Database
--------

- ``Query::with()`` now accepts an array of expressions to align with other query clauses. This also
   allows clearing the expressions with an empty array.

Validation
----------

- The signature of ``Validator::validate(array $data, bool $newRecord = true, array $context = [])`` has now a additional third parameter ``$context``.
  It can be used to pass necessary context into the validation when marshalling.

View
----

- The ``format()`` and ``currency()`` methods of ``NumberHelper`` now accept also null as input and can return any default string here.
  This allows for easier templates, in particular baked ones. Make sure to adjust any extending helper (plugin or app level) by adding that type.

Deprecations
============

Database
--------
- ``Query::newExpr()`` is deprecated. Use ``Query::expr()`` instead.

Form
----

- ``Form::_execute()`` is deprecated. You should rename your ``_execute``
  methods to ``process()`` which accepts the same parameters and has the same
  return type.

Http
----

- Using ``$request->getParam('?')`` to get the query params is deprecated.
  Use ``$request->getQueryParams()`` instead.

ORM
---

- Calling behavior methods on table instances is now deprecated. To call
  a method of an attached behavior you need to use
  ``$table->getBehavior('Sluggable')->slugify()`` instead of ``$table->slugify()``.
- ``EntityTrait::isEmpty()`` is deprecated. Use ``hasValue()`` instead.

Plugin
------

- Loading of plugins without a plugin class is deprecated. For your existing plugins
  which don't have one, you can use the ``bin/cake bake plugin MyPlugin --class-only``
  command, which will create the file ``plugins/MyPlugin/src/MyPlugin.php``.

New Features
============

Cache
-----

- Added Redis Cluster support to ``RedisEngine``. Configure the ``cluster`` option
  with an array of server addresses to enable cluster mode.
- Several :ref:`cache-events` were added to allow monitoring the caching behavior.

Command
-------

- ``cake plugin assets symlink`` command now supports a ``--relative`` option to
  create relative path symlinks. This is useful when creating symlinks within
  containers that use volume mounts.
- ``cake server`` now supports a ``--frankenphp`` option that will start the
  development server with `FrankenPHP <https://frankenphp.dev/>`__.

Console
-------

- Added ``TreeHelper`` which outputs an array as a tree such as an array of filesystem
  directories as array keys and files as lists under each directory.
- Commands can now implement ``getGroup()`` to customize how commands are
  grouped in ``bin/cake -h`` output.

Core
----

- Added ``Configure`` attribute to support injecting ``Configure`` values into
  constructor arguments. See ref:`configure-dependency-injection`.

Database
--------

- Added support for Entra authentication to SqlServer driver.
- Added ``Query::optimizerHint()`` which accepts engine-specific optimizer hints.
- Added ``Query::getDriver()`` helper which returns the ``Driver`` for the current connection
  role by default.
- Added support for ``year`` column types in MySQL.
- Added support for ``inet``, ``cidr`` and ``macaddr`` network column types to
  postgres driver.
- Added ``TypeFactory::getMapped()`` to retrieve the mapped class name for a specific type.
  This provides a cleaner API compared to using ``TypeFactory::getMap()`` with a type argument.

Error
-----

- ``Debugger`` now replaces :php:const:``ROOT` with ` the
  ``Debugger.editorBasePath`` Configure value if defined. This improves
  debugging workflows within containerized environments.

I18n
----

- Added ``DateTimePeriod`` which wraps a php ``DatePeriod`` and returns ``DateTime``
  instances when iterating.
- Added ``DatePeriod`` which wraps a php ``DatePeriod`` and returns ``Date`` instances
  when iterating.
- Added ``toQuarterRange()`` method to ``DateTime`` and ``FrozenTime`` classes which returns
  an array containing the start and end dates of the quarter for the given date.
- Added ``Date::getTimestamp()``. This method returns an int of the date's
  timestamp.

Mailer
------

- Added ``Message::addAttachment()`` for adding attachments to a message. Like
  other message methods, it can be accessed via the ``Mailer`` instance as ``$mailer->addAttachment()``.

ORM
---

- ``Table::patchEntity()``, ``Table::newEntity()``, ``Marshaller::one()`` and
  ``Marshaller::many()`` now accept a ``strictFields`` option that only applies
  validation to the fields listed in the ``fields`` option.
- Added ``TableContainer`` that you can register in your Application::services() to
  add dependency injection for your Tables.

Routing
-------

- ``EntityRoute`` now handles enum value conversions. This enables you to use
  enum backed properties as route parameters. When an enum backed property is
  used in routing, the enum's ``value`` or ``name`` will be used.

TestSuite
---------

- ``assertRedirectBack()`` added to assert a successful redirect has been made to the same previous URL.
- ``assertRedirectBackToReferer()`` added to assert a successful redirect has been made to the referer URL.
- ``assertFlashMessageContains()`` and ``assertFlashMessageContainsAt()`` were added. These methods enable
  substring matching of flash message content.
- ``TestFixture::$tableAlias`` was added. This property lets you define the
  table alias that will be used to load an ``ORM\Table`` instance for a fixture.
  This improves compatibility for schemas that do not closely follow naming conventions.

Utility
-------

- ``Text::uuid()`` now supports configurable UUID generation. You can set a custom
  UUID generator using ``Configure::write('Text.uuidGenerator', $closure)`` to
  integrate your own UUID generation strategy or third-party libraries.

Validation
----------

- ``ipOrRange()`` validation has has been added to check for an IP or a range (subnet).
- When validating within CakePHP marshalling context, the entity will be passed into the ``context`` argument for use inside custom validation rules.
  This can be useful when patching partially and then needing to get that data from the entity instead of the passed data.

View
----

- :php:meth:`HtmlHelper::scriptStart()` and ``scriptEnd()`` now allow simple
  wrapping script tags (``<script>...</script>``) around inline JavaScript. This
  enables syntax highlighting in many editors to work. The wrapping script tag
  will be removed and replaced with a script tag generated by the helper.

- :php:class:`FormHelper` now supports a new option ``nestedCheckboxAndRadio``.
  By default, the helper generates inputs of type checkbox and radio nested
  inside their label. Setting the ``nestedCheckboxAndRadio`` option to ``false``
  will turn off the nesting.
