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

ORM
---

* ``QueryExpression::or_()`` and ``QueryExpression::and_()`` have been
  deprecated. Use ``or()`` and ``and()`` instead.

View
----

* ``Form/ContextInteface::primaryKey()`` was deprecated. Use ``getPrimaryKey()``
  instead.


New Features
============

Console
-------

* When the ``NO_COLOR`` environment variable is set all output will not include
  ANSI escape codes for colours. See `no-color.org <https://no-color.org/>`__
  for more information.

Log
---

* Log messages can now contain ``{foo}`` style placeholders. These placeholders
  will be replaced by values from the ``$context`` parameter if available.

