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

Controller
----------

- ``Controller::$components`` was marked protected. It was previously documented
  as protected. This should not impact most application code as implementations
  can change the visibility to public.


Breaking Changes
================

Behind the API, some breaking changes are necessary moving forward.
They usually only affect tests.

- The fixture names around UUIDs have been consolidated (``UuidItemsFixture``, ``BinaryUuidItemsFixture``).
  If you use any of them, make sure you updated these names.
  The ``UuidportfoliosFixture`` was unused in core and removed now.

New Features
============

Database
----

- ``SqlServer`` now creates client-side buffered cursors for prepared statements by default.
  This was changed to fix significant performance issues with server-side SCROLL cursors.
  Users should see a performance boost with most results sets.

  .. warning::
      For users with large query results, this may cause an error allocating the client-side buffer unless
      ``Query::disableBufferedResults()`` is called.
      The maximum buffer size can be configured in ``php.ini`` with ``pdo_sqlsrv.client_buffer_max_kb_size``.
      See https://docs.microsoft.com/en-us/sql/connect/php/cursor-types-pdo-sqlsrv-driver?view=sql-server-ver15#pdo_sqlsrv-and-client-side-cursors
      for more information.
- ``Query::isResultsCastingEnabled()`` was added to get the current result
  casting mode.

Http
----

- ``Http\Middleware\SessionCsrfProtectionMiddleware`` was added. Instead of
  storing CSRF tokens in a cookie, this middleware stores tokens in the session.
  This makes CSRF tokens user scoped and time based with the session, offering
  enhanced security over cookie based CSRF tokens. This middleware is a drop in
  replacement for the ``CsrfProtectionMiddleware``.
- The ``hal+json``, ``hal+xml``, and ``jsonld`` types were added to
  ``Response`` making them usable with ``withType()``.

ORM
---

- ``Table::subquery()`` and  ``Query::subquery()`` were added. These methods
  lets you create query objects that don't have automatic aliasing. This helps
  reduce overhead and complexity of building subqueries and common table
  expressions.

TestSuite
---------

- ``EmailTrait::assertMailSubjectContains()`` and
  ``assertMailSubjectContainsAt()`` were added.
