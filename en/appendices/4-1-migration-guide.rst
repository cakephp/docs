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

Form
----

* ``Form::schema()`` has been deprecated. Use ``Form::getSchema()`` or
  ``Form::setSchema()`` instead.

Http
----

* ``ServerRequest::input()`` is deprecated. Use ``(string)$request->getBody()``
   to get the raw PHP input as string; use ``BodyParserMiddleware`` to parse the
   request body so that it's available as array/object through ``$request->getParsedBody()``

ORM
---

* ``QueryExpression::or_()`` and ``QueryExpression::and_()`` have been
  deprecated. Use ``or()`` and ``and()`` instead.

View
----

* ``Form/ContextInteface::primaryKey()`` was deprecated. Use ``getPrimaryKey()``
  instead.

Behavior Changes
================

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

* BelongsToMany associations now respect the bindingKey set in the junction table's BelongsTo association.
  Previously, the target table's primary key was always used instead.

TestSuite
---------

* ``TestCase::setAppNamespace()`` now returns the previous app namespace for easier save and restore.

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

Database
--------

* ``AggregateExpression`` was added to represent aggregate SQL functions. ``FunctionsBuilder::aggregate()``
  can be used to wrap new aggregate SQL functions.
* Window function support was added for any aggregate expression. ``AggregateExpression`` wraps the window
  expression making it easy to extend any instance with call chaining.
* Postgres and SQLServer now support ``HAVING`` conditions on aggregate
  functions with aliases.

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

Log
---

* Log messages can now contain ``{foo}`` style placeholders. These placeholders
  will be replaced by values from the ``$context`` parameter if available.

ORM
---

* The ORM now triggers an ``Model.afterMarshal`` event which is triggered after
  each entity is marshaled from request data.

TestSuite
---------

* ``FixtureManager::unload()`` no longer truncates tables at the *end* of a test
  whilst fixtures are unloaded. Tables will still be truncated during fixture
  setup. You should see faster test suite runs as fewer truncation operations
  are being done.

View
----

* Added ``TextHelper::slug()``. This method delegates to
  ``Cake\Utility\Text::slug()``.

Utility
-------

* ``Hash::combine()`` now accepts ``null`` for the ``$keyPath`` parameter.
  Providing null will result in a numerically indexed output array.
