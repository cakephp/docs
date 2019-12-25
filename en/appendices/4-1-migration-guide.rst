4.1 Migration Guide
###################

CakePHP 4.1 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.1.

Deprecations
============

Database
--------

* ``TableSchema::getPrimary()`` was deprecated. Use ``getPrimaryKey()`` instead.

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

Log
---

* Log messages can now contain ``{foo}`` style placeholders. These placeholders
  will be replaced by values from the ``$context`` parameter if available.

