4.3 Migration Guide
###################

CakePHP 4.3 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.3.

Upgrading to 4.3.0
==================

You can can use composer to upgrade to CakePHP 4.3.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.3"

Deprecations
============

4.3 introduces a few deprecations. All of these features will continue for the
duration of 4.x but will be removed in 5.0. You can use the
:ref:`upgrade tool <upgrade-tool-use>` to automate updating usage of deprecated
features::

    bin/cake upgrade rector --rules cakephp43 <path/to/app/src>

.. note::
    This only updates CakePHP 4.3 changes. Make sure you apply CakePHP 4.2 changes first.

A new configuration option has been added to disable deprecations on a path by
path basis. See :ref:`deprecation-warnings` for more information.

Connection
----------

- ``Connection::supportsDynamicConstraints()`` was deprecated now that fixtures don't try to dynamically
  drop and create constraints.

Controller
----------

- The components' ``Controller.shutdown`` event callback has been renamed from
  ``shutdown`` to ``afterFilter`` to match the controller one. This makes the callbacks more consistent.

Database
--------

- Using mutable datetime classes with ``DateTimeType`` and other time related type classes is deprecated.
  Hence methods ``DateTimeType::useMutable()``, ``DateTimeType::useImmutable()`` and similar methods
  in other type classes are deprecated.
- ``DriverInterface::supportsQuoting()`` and ``DriverInterface::supportSavepoints()`` are now deprecated
  in favor of ``DriverInterface::supports()`` which accepts feature constants defined in ``DriverInterface``.
- ``DriverInterface::supportsDynamicConstraints()`` was deprecated now that fixtures don't try to dynamically
  drop and create constraints.

I18n
----

- The datetime classes ``Time`` and ``Date`` are deprecated.
  Use their immutable alternatives ``FrozenTime`` and ``FrozenDate`` instead.

Log
---

- ``FileLog`` moved the ``dateFormat`` config option to ``DefaultFormatter``.
- ``ConsoleLog`` moved the ``dateFormat`` config option to ``DefaultFormatter``.
- ``SyslogLog`` moved the ``format`` config option to ``LegacySyslogFormatter``.
  Defaults to ``DefaultFormatter`` now.

Middleware
----------

- "Double pass" middlewares, i.e. classes with ``__invoke($request, $response, $next)``
  method are deprecated.  Instead use ``Closure`` with signature
  ``function($request, $handler)`` or classes which implement
  ``Psr\Http\Server\MiddlewareInterface`` instead.

Network
-------

- ``Socket::$connected`` is deprecated. Use ``isConnected()`` instead.
- ``Socket::$description`` is deprecated.
- ``Socket::$encrypted`` is deprecated. Use ``isEncrypted()`` instead.
- ``Socket::$lastError`` is deprecated. Use ``lastError()`` instead.

ORM
---

- ``ModelAwareTrait::loadModel()`` is deprecated. Use the new ``LocatorAwareTrait::fetchTable()`` instead.
  For example, in controllers you can do ``$this->fetchTable()`` to get the default table instance or use
  ``$this->fetchTable('Foos')`` for a non-default table.  You can set the ``LocatorAwareTrait::$defaultTable``
  property to specify the default table alias for ``fetchTable()``. But be aware that
  ``LocatorAwareTrait::fetchTable()`` does not create a property with the name of the table alias on the
  calling object, e.g. ``$this->Articles``, as  ``ModelAwareTrait::loadModel()`` does.
- Query proxying all ``ResultSetInterface`` methods (including ```CollectionInterface```), which forces
  fetching results and calls the proxied method on the results, is now deprecated. An example of the
  deprecated usage is ``$query->combine('id', 'title');``. This should be
  updated to ``$query->all()->combine('id', 'title');`` instead.
- Passing a validator object to ``Table::save()`` via the ``validate`` option is
  deprecated. Define the validator within the table class or use ``setValidator()`` instead.
- ``Association::setName()`` is deprecated. Association names should be defined
  when the association is.
- ``QueryExpression::addCase()`` is deprecated. Use ``case()`` instead. The ``['value' => 'literal']``
  and ``['column' => 'identifier']`` syntax is not supported in the new fluent case builder, inserting raw
  SQL or identifiers requires to explicitly use expressions.

Routing
-------

- Colon prefixed route placeholders like ``:controller`` are deprecated. Use
  braced placeholders like ``{controller}`` instead.

TestSuite
---------

- ``TestFixture::$fields`` and ``TestFixture::$import`` are deprecated. You
  should convert your application to the :doc:`new fixture system <./fixture-upgrade>`.
- ``TestCase::$dropTables`` is deprecated. Dropping tables during a test run is
  not compatible with the new migration/schema dump based fixtures and will be
  removed in 5.0.

View
----

- FormHelper methods' non-associative options (for example, ``['disabled']``) are now deprecated.
- Second argument ``$merge`` of ``ViewBuilder::setHelpers()`` has been deprecated in favor of dedicated
  ``ViewBuilder::addHelpers()`` method to cleanly separate merge from overwrite operation.

Behavior Changes
================

While the following changes do not change the signature of any methods they do
change the semantics or behavior of methods.

Collection
----------

- Renamed ``$preserveKeys`` parameter to ``$keepKeys`` with same implementation.

Command
-------

- ``cake i18n extract`` no longer has a ``--relative-paths`` option. This option
  is on by default now.

Core
----

- ``Configure::load()`` will now raise an exception when an invalid
  configuration engine is used.

Database
--------

- ``ComparisonExpression`` no longer wraps generated ``IdentifierExpression`` sql in (). This affects
  ``Query::where()`` and anywhere else a ``ComparisonExpression`` is generated.
- The SQLite implementation of ``listTables()`` now returns tables **and**
  views. This change aligns SQLite with other database dialects.

Datasource
----------

- Switched ``ConnectionManager::alias()`` ``$alias`` and ``$source`` parameter names to match what they are.
  This only affects documentation and named parameters.

Http
----

- ``Http\Client`` now uses ``ini_get('user_agent')`` with 'CakePHP' as
  a fallback for its user-agent.

ORM
---

- Aligned ``Entity::isEmpty()`` and ``Entity::hasValue()`` to treat '0' as a non-empty value.
  This aligns the behavior with documentation and original intent.
- ``TranslateBehavior`` entity validation errors are now set in the
  ``_translations.{lang}`` path instead of ``{lang}``. This normalizes the
  entity error path with the fields used for request data. If you have forms
  that modify multiple translations at once, you may need to update how you
  render validation errors.
- The types specified in function expressions now take precedence over default types set for
  columns when selecting columns. For example, using ``$query->select(['id' => $query->func()->min('id')])``
  the value for `id` in fetched entity will be `float` instead of `integer`.

Routing
-------

- ``Router::connect()``, ``Router::prefix()``, ``Router::plugin()`` and ``Router::scope()``
  are deprecated. Use the corresponding non-static ``RouteBuilder`` methods instead.
- ``RouteBuilder::resources()`` now generates routes that use 'braced'
  placeholders.

TestSuite
---------

- ``TestCase::deprecated()`` now asserts that at least one deprecation warning
  was triggered by the callback.

Validation
----------

- ``Validator::setProvider()`` now raises an exception when a non-object,
  non-string provider name is used. Previously there would be no error, but the
  provider would also not work.

View
----

- The ``$vars`` parameter of  ``ViewBuilder::build()`` is deprecated. Use
  ``setVar()`` instead.
- ``HtmlHelper::script()`` and ``HtmlHelper::css()`` now escape absolute URLs
  that include a scheme.

Breaking Changes
================

Behind the API, some breaking changes are necessary moving forward.
They usually only affect tests.

Log
---

- ``BaseLog::_getFormattedDate()`` and ``dateFormat`` config were removed
  since the message formatting logic was moved into log formatters.

View
----
- ``TimeHelper::fromString()`` now returns an instance of ``FrozenTime`` instead of ``Time``.

New Features
============

Controller
----------

- ``Controller::middleware()`` was added which allows you to define middleware
  for a single controller only. See :ref:`controller-middleware` for more information.
- Controllers now support action parameters with ``float``, ``int``, ``bool`` or ``array`` type declarations.
  Boolean passed parameters must be either ``0`` or ``1``.

Core
----

- ``deprecationWarning()`` no longer emits duplicate notices. Instead only the
  first instance of a deprecation will be displayed. This improves the
  readability of test output, and visual noise in an HTML context. You can
  restore duplicate notice output by setting the
  ``Error.allowDuplicateDeprecations`` to ``true`` in your ``app_local.php``.
- CakePHP's dependency on ``league/container`` was bumped to ``^4.1.1``. While
  the DI container is marked as experimental, this upgrade could require you to
  upgrade your service provider definitions.

Database
--------

- Database mapping types can now implement
  ``Cake\Database\Type\ColumnSchemaAwareInterface`` to specify
  column sql generation and column schema reflection. This allows
  custom types handle non-standard columns.
- Logged queries now use ``TRUE`` and ``FALSE`` for postgres, sqlite and mysql
  drivers. This makes it easier to copy queries and run them in an interactive
  prompt.
- The ``DateTimeType`` can now convert request data from the user's timezone
  to the application timezone. See
  :ref:`converting-request-data-from-user-timezone` for more information.
- ``JsonType::setEncodingOptions()`` was added. This method lets you define
  ``json_encode()`` options for when the ORM serializes JSON when persisting
  data.
- Added ``DriverInterface::supports()`` which consolidates all feature checks into one function.
  Drivers can support custom feature names or any of the feature constants:

  * ``FEATURE_CTE``
  * ``FEATURE_JSON``
  * ``FEATURE_QUOTE``
  * ``FEATURE_SAVEPOINT``
  * ``FEATURE_WINDOW``

- Added ``DriverInterface::inTransaction()`` which reflects the status returned by
  ``PDO::inTranaction()``.
- A fluent builder for ``CASE, WHEN, THEN`` statements has been added.
- The ``listTablesWithoutViews()`` was added to ``SchemaCollection`` and Driver
  Dialects. This method returns the list of tables excluding views. This is
  primarily used to truncate tables in tests.


Form
----

* ``Form::execute()`` now accepts an ``$options`` parameter. This parameter can
  be used to choose which validator is applied or disable validation.
* ``Form::validate()`` now accepts a ``$validator`` parameter which chooses the
  validation set to be applied.

Http
----

- The ``CspMiddleware`` now sets the ``cspScriptNonce`` and ``cspStyleNonce``
  request attributes which streamlines the adoption of strict
  content-security-policy rules.
- ``Client::addMockResponse()`` and ``clearMockResponses()`` were added.

Log
---

- Log engines now use formatters to format the message string before writing.
  This can be configured with the ``formatter`` config option. See the
  :ref:`logging-formatters` section for more details.
- ``JsonFormatter`` was added and can be set as the ``formatter`` option for
  any log engine.

ORM
---

- Queries that ``contain()`` HasMany and BelongsToMany associations now
  propagate the status of result casting. This ensures that results from all
  associations are either cast with type mapping objects or not at all.
- ``Table`` now includes ``label`` in the list of fields that are candidates for
  ``displayField`` defaults.
- Added ``Query::whereNotInListOrNull()`` and ``QueryExpression::notInOrNull()`` for nullable
  columns since ``null != value`` is always false and the ``NOT IN`` test will always fail when
  the column is null.
- ``LocatorAwareTrait::fetchTable()`` was added. This allows you to use ``$this->fetchTable()``
  to get a table instance in classes which use the trait, like controllers,
  commands, mailers and cells. You can set the ``LocatorAwareTrait::$defaultTable`` property
  to specify the default table alias.

TestSuite
---------

- ``IntegrationTestTrait::enableCsrfToken()`` now lets you use custom CSRF
  cookie/session key names.
- ``HttpClientTrait`` was added to make writing HTTP mocks easier.
  See :ref:`httpclient-testing` for more information.
- A new fixture system has been introduced. This fixture system separates schema
  and data enabling you to re-use your existing migrations to define test
  schema. The :doc:`./fixture-upgrade` guide covers how to upgrade.

View
----

- ``HtmlHelper::script()`` and ``HtmlHelper::css()`` now add the ``nonce``
  attribute to generated tags when the ``cspScriptNonce`` and ``cspStyleNonce``
  request attributes are present.
- ``FormHelper::control()`` will now populate the ``aria-invalid``,
  ``aria-required``, and ``aria-describedby``  attributes based on
  metadata from the validator. The ``aria-label`` attribute will be set if
  you disable the automatic label element and provide a placeholder.
- ``ViewBuilder::addHelpers()`` has been added to cleanly separate merge from overwrite operation.
