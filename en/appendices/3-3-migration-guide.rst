3.3 Migration Guide
###################

CakePHP 3.3 is an API compatible upgrade from 3.2. This page outlines the
changes and improvements made in 3.3.

Deprecations
============

* ``Router::mapResources()`` is deprecated. Use routing scopes and
  ``$routes->resources()`` instead.
* ``Router::redirect()`` is deprecated. Use routing scopes and
  ``$routes->redirect()`` instead.
* ``Router::parseNamedParams()`` is deprecated. Named parameter backwards
  compatibility will be removed in 4.0.0

Routing
=======

- ``Router::parse()``, ``RouteCollection::parse()`` and ``Route::parse()`` had
  a ``$method`` argument added. It defaults to 'GET'. This new parameter reduces
  reliance on global state, and necessary for the PSR7 work integration to be done.
- When building resource routes, you can now define a prefix. This is useful
  when defining nested resources as you can create specialized controllers for
  nested resources.

Console
=======

- Shell tasks that are invoked directly from the CLI no longer have their
  ``_welcome`` method invoked. They will also have the ``requested`` parameter
  set now.

Request
=======

- ``Request::is()`` and ``Request::addDetector()`` now supports additional
  arguments in detectors. This allows detector callables to operate on
  additional parameters.

ORM
===

- Additional support has been added for mapping complex data types. This makes
  it easier to work with geo-spatial types, and data that cannot be represented
  by strings in SQL queries. See the
  :ref:`mapping-custom-datatypes-to-sql-expressions` for more information.
- A new ``JsonType`` was added. This new type lets you use the native JSON types
  available in MySQL and Postgres. In other database providers the ``json`` type
  will map to ``TEXT`` columns.
- ``Association::unique()`` was added. This method proxies the target table's
  ``unique()`` method, but ensures that association conditions are applied.
- ``isUnique`` rules now apply association conditions.

Debugging Functions
===================

- The ``pr()``, ``debug()``, and ``pj()`` functions now return the value being
  dumped. This makes them easier to use when values are being returned.
