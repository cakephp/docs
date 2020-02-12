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

Form
----

* ``Form::schema()`` has been deprecated. Use ``Form::getSchema()`` or
  ``Form::setSchema()`` instead.

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

Error
-----

* ``debug()`` and ``Debugger::printVar()`` now emit styled HTML, or ANSI styled
  output in web and CLI contexts. Cyclic references and duplicate objects are
  only dumped once and have reference ids to the full value. This greatly
  simplifies output for cyclic structures.
* ``Debugger::addEditor()`` and ``Debugger::setEditor()`` have been added. These
  methods let you add additional editor formats, and set your preferred editor
  respectively.
* The ``Debugger.editor`` configure value has been added. This value is used as
  the preferred editor link format.

Log
---

* Log messages can now contain ``{foo}`` style placeholders. These placeholders
  will be replaced by values from the ``$context`` parameter if available.

TestSuite
---------

* ``FixtureManager::unload()`` no longer truncates tables at the *end* of a test
  whilst fixtures are unloaded. Tables will still be truncated during fixture
  setup. You should see faster test suite runs as fewer truncation operations
  are being done.
