4.1 Migration Guide
###################

CakePHP 4.1 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.1.

Deprecations
============

Database
--------

* ``TableSchema::getPrimary()`` was deprecated. Use ``getPrimaryKey()`` instead.


View
----

* ``Form/ContextInteface::primaryKey()`` was deprecated. Use ``getPrimaryKey()``
  instead.
