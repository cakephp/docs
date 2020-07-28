4.2 Migration Guide
###################

CakePHP 4.2 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.2.


Deprecations
============

4.2 introduces a few deprecations. All of these features will continue for the
duration of 4.x but will be removed in 5.0. You can use the
:ref:`upgrade tool <upgrade-tool-use>` to automate updating usage of deprecated
features::

    bin/cake upgrade rector --rules cakephp42 <path/to/app/src>

Behavior Changes
================

While the following changes do not change the signature of any methods they do
change the semantics or behavior of methods.

New Features
============

Database
----

- ``SqlServer`` now creates client-side buffered cursors for prepared statements by default.
  The maximum buffer size can be configured in ``php.ini`` with ``pdo_sqlsrv.client_buffer_max_kb_size``.
  See https://docs.microsoft.com/en-us/sql/connect/php/cursor-types-pdo-sqlsrv-driver?view=sql-server-ver15#pdo_sqlsrv-and-client-side-cursors
  for more information.

Http
----

- ``Http\Middleware\SessionCsrfProtectionMiddleware`` was added. Instead of
  storing CSRF tokens in a cookie, this middleware stores tokens in the session.
  This makes CSRF tokens user scoped and time based with the session, offering
  enhanced security over cookie based CSRF tokens. This middleware is a drop in
  replacement for the ``CsrfProtectionMiddleware``. 

ORM
---

- ``Table::subquery()`` and  ``Query::subquery()`` were added. These methods
  lets you create query objects that don't have automatic aliasing. This helps
  reduce overhead and complexity of building subqueries and common table
  expressions.
