3.3 Migration Guide
###################

CakePHP 3.3 is an API compatible upgrade from 3.2. This page outlines the
changes and improvements made in 3.3.

Routing
=======

- ``Router::parse()``, ``RouteCollection::parse()`` and ``Route::parse()`` had
  a ``$method`` argument added. It defaults to 'GET'. This new parameter reduces
  reliance on global state, and necessary for the PSR7 work integration to be done.
- When building resource routes, you can now define a prefix. This is useful
  when defining nested resources as you can create specialized controllers for
  nested resources.

ORM
===

- A new ``JsonType`` was added. This new type lets you use the native JSON types
  available in MySQL and Postgres. In other database providers the ``json`` type
  will map to ``TEXT`` columns.
- ``Association::unique()`` was added. This method proxies the target table's
  ``unique()`` method, but ensures that association conditions are applied.
- ``isUnique`` rules now apply association conditions.
