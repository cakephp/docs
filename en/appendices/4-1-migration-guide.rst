4.1 Migration Guide
###################

CakePHP 4.1 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.1.


Deprecations
============

Database
--------

* ``TableSchema::getPrimary()`` was deprecated. Use ``getPrimaryKey()`` instead.
* ``Cake\Database\Schema\BaseSchema`` was renamed to
  ``Cake\Database\Schema\SchemaDialect``.
* ``Cake\Database\Schema\MysqlSchema`` was renamed to
  ``Cake\Database\Schema\MysqlSchemaDialect`` and marked as internal.
* ``Cake\Database\Schema\SqliteSchema`` was renamed to
  ``Cake\Database\Schema\SqliteSchemaDialect`` and marked as internal.
* ``Cake\Database\Schema\SqlserverSchema`` was renamed to
  ``Cake\Database\Schema\SqlserverSchemaDialect`` and marked as internal.
* ``Cake\Database\Schema\PostgresSchema`` was renamed to
  ``Cake\Database\Schema\PostgresSchemaDialect`` and marked as internal.
* ``DateTimeType::setTimezone()`` was deprecated. use ``setDatabaseTimezone()`` instead.
* The magic method signature for ``FunctionBuilder::cast([...])`` is deprecated.
  Use ``FunctionBuilder::cast('field', 'type')`` instead.

Form
----

* ``Form::schema()`` has been deprecated. Use ``Form::getSchema()`` or
  ``Form::setSchema()`` instead.

Http
----

* ``ServerRequest::input()`` is deprecated. Use ``(string)$request->getBody()``
   to get the raw PHP input as string; use ``BodyParserMiddleware`` to parse the
   request body so that it's available as array/object through ``$request->getParsedBody()``
* The ``httpOnly`` option for ``CsrfProtectionMiddleware`` is now ``httponly``
  to improve consistency with cookie creation elsewhere in the framework.

ORM
---

* ``QueryExpression::or_()`` and ``QueryExpression::and_()`` have been
  deprecated. Use ``or()`` and ``and()`` instead.

Routing
-------

* ``Cake\Routing\Exception\RedirectException`` is deprecated. Use
  ``Cake\Http\Exception\RedirectException`` instead.

View
----

* ``Form/ContextInterface::primaryKey()`` was deprecated. Use ``getPrimaryKey()``
  instead.


Behavior Changes
================

While the following changes do not change the signature of any methods they do
change the semantics or behavior of methods.

Database
--------

* MySQL: The display widths for integers now are ignored except for ``TINYINT(1)`` which
  still maps to boolean type. Display widths are deprecated in MySQL 8.

Http
----

* Uploaded file normalization has been moved from ``ServerRequest`` to
  ``ServerRequestFactory``. This could impact your tests if you are creating
  request objects that use nested file upload arrays. Tests using
  ``IntegrationTestCaseTrait`` should not need to change.

ORM
---

* ``Cake\ORM\TableRegistry`` has been deprecated. Use ``Cake\ORM\Locator\LocatorAwareTrait::getTableLocator()``
  or ``Cake\Datasource\FactoryLocator::get('Table')`` to get the table locator instance instead.
* BelongsToMany associations now respect the bindingKey set in the junction table's BelongsTo association.
  Previously, the target table's primary key was always used instead.
* ``Cake\ORM\AssociationCollection`` no longer lower cases association names
  to generate keys for the object map it maintains internally. One should
  use the association name with same casing in calls to methods like
  ``AssociationCollection::get()``, ``Query::contain()`` etc. as they have used
  when declaring the association.

TestSuite
---------

* ``TestCase::setAppNamespace()`` now returns the previous app namespace for easier save and restore.

View
----

* ``FormHelper`` now has its default value sources set to ``data, context``
  instead of ``context``. If you use ``setValueSources()`` to changes the value
  sources you may need to update your code.
* The ``FormHelper`` Context classes provided by CakePHP no longer take
  a ``$request`` object in their constructor anymore.


New Features
============

Datasource
----------

* ``EntityInterface::getAccessible()`` has been added.

Console
-------

* When the ``NO_COLOR`` environment variable is set all output will not include
  ANSI escape codes for colours. See `no-color.org <https://no-color.org/>`__
  for more information.
* Commands now have the same possibility to disable interactive mode Shells had using
  ``$io->setInteractivate(false)``.
  Here prompting will be avoided where applicable and the defaults used.
  Using ``--quiet``/``-q`` can now also invoke this directly for all existing commands.

Database
--------

* ``AggregateExpression`` was added to represent aggregate SQL functions. ``FunctionsBuilder::aggregate()``
  can be used to wrap new aggregate SQL functions.
* Window function support was added for any aggregate expression. ``AggregateExpression`` wraps the window
  expression making it easy to extend any instance with call chaining.
* Postgres and SQLServer now support ``HAVING`` conditions on aggregate
  functions with aliases.
* ``FunctionsBuilder::cast()`` was added.
* Common Table Expression (CTE) support was added. CTEs can be attached to a query
  using `Query::with()`.
* ``Query::orderAsc()`` and ``Query::orderDesc()`` now accept Closure's as their
  field enabling you to use build complex order expressions with the provided
  ``QueryExpression`` object.

Error
-----

* ``debug()`` and ``Debugger::printVar()`` now emit HTML in web contexts, and
  ANSI styled output in CLI contexts. Output of cyclic structures and repeated objects
  is much simpler. Cyclic objects are only dumped once and use reference ids to
  point back to the full value.
* ``Debugger::addEditor()`` and ``Debugger::setEditor()`` have been added. These
  methods let you add additional editor formats and set your preferred editor
  respectively.
* The ``Debugger.editor`` configure value has been added. This value is used as
  the preferred editor link format.
* ``ErrorHandlerMiddleware`` now handles
  ``Http\Exception\RedirectException`` and converts those exceptions into HTTP
  redirect responses.
* ``BaseErrorHandler`` now uses the configured error logger to log PHP warnings
  and errors.
* ``ErrorLoggerInterface`` was added to formalize the interface required for
  custom error loggers.

Form
----

* ``Form::set()`` was added. This method lets you add additional data to the
  form object similar to how ``View::set()`` or ``Controller::set()`` works.

Http
----

* ``BaseApplication::addOptionalPlugin()`` was added. This method handles
  loading plugins, and handling errors for plugins that may not exist because
  they are dev dependencies.
* ``Cake\Http\Exception\RedirectException`` was added. This exception replaces
  the ``RedirectException`` in the Routing package and can be raised anywhere in
  your application to signal to the error handling middleware to create
  a redirect response.
* ``CsrfProtectionMiddleware`` can now create cookies with the ``samesite`` attribute set.
* ``Session::read()`` now allows default values to be set with the second
  parameter.
* ``Session::readOrFail()`` has been added as convenience wrapper
  around ``read()`` operations where you want an exception when the key is
  missing.

I18n
----

* The ``setJsonEncodeFormat`` method on  ``Time``, ``FrozenTime``, ``Date`` and
  ``FrozenDate`` now accepts a callable that can be used to return a custom
  string.
* Lenient parsing can be disabled for ``parseDateTime()`` and ``parseDate()`` using
  ``disableLenientParsing()``. The default is enabled - the same as IntlDateFormatter.

Log
---

* Log messages can now contain ``{foo}`` style placeholders. These placeholders
  will be replaced by values from the ``$context`` parameter if available.

ORM
---

* The ORM now triggers an ``Model.afterMarshal`` event which is triggered after
  each entity is marshaled from request data.
* You can use the ``locale`` finder option to modify the locale of a single find
  call when using the ``TranslateBehavior``.
* ``Query::clearResult()`` was added. This method lets you remove the result
  from a query so you can re-execute it.
* ``Table::delete()`` will now abort a delete operation and return false if a
  dependent association fails to delete during cascadeCallback operations.
* ``Table::saveMany()`` will now trigger the ``Model.afterSaveCommit`` event on
  entities that are saved.

Routing
-------
* A convenience function ``urlArray()`` has been introduced to quickly generate URL arrays
from a route path string.

TestSuite
---------

* ``FixtureManager::unload()`` no longer truncates tables at the *end* of a test
  whilst fixtures are unloaded. Tables will still be truncated during fixture
  setup. You should see faster test suite runs as fewer truncation operations
  are being done.
* Email body assertions now include the email contents in their failure messages
  making tests easier to debug.
* ``TestCase::addFixture()`` has been added to allow chainable fixture setup, that is also
auto-completable in IDEs.

View
----

* Added ``TextHelper::slug()``. This method delegates to
  ``Cake\Utility\Text::slug()``.
* Added ``ViewBuilder::addHelper()`` as chainable wrapper method to add helpers.
* Added ``HtmlHelper::linkFromPath()`` and ``UrlHelper::urlFromPath()`` to build
  links and URLs from route paths more easily and with IDE support in the View layer.

Utility
-------

* ``Hash::combine()`` now accepts ``null`` for the ``$keyPath`` parameter.
  Providing null will result in a numerically indexed output array.
