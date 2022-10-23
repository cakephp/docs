4.5 Migration Guide
###################

CakePHP 4.5 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.5.

Upgrading to 4.5.0
==================

You can can use composer to upgrade to CakePHP 4.5.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.5"

.. note::
    CakePHP 4.5 requires PHP 7.4 or greater.

Deprecations
============

4.5 introduces a few deprecations. All of these features will continue for the
duration of 4.x but will be removed in 5.0.

You can use the
:ref:`upgrade tool <upgrade-tool-use>` to automate updating usage of deprecated
features::

    bin/cake upgrade rector --rules cakephp45 <path/to/app/src>

.. note::
    This only updates CakePHP 4.5 changes. Make sure you apply CakePHP 4.4 changes first.

A new configuration option has been added to disable deprecations on a path by
path basis. See :ref:`deprecation-warnings` for more information.

ORM Query API deprecations
--------------------------

There are some potentially impactful changes to the ORM coming in 5.x. The 4.5
release introduces deprecations and new ``ORM\Query`` subclasses. The new
classes offer an API that is consistent with ``ORM\Query`` but emit deprecations
from all methods that will **not** be present in 5.x.

The new classes are:

- ``Cake\ORM\Query\DeleteQuery`` Used for building ``delete`` queries.
- ``Cake\ORM\Query\InsertQuery`` Used for building ``insert`` queries.
- ``Cake\ORM\Query\SelectQuery`` Used for building ``select`` queries.
- ``Cake\ORM\Query\UpdateQuery`` Used for building ``update`` queries.

Each of these classes no longer offer methods that don't make sense for that
query type. For example, ``DeleteQuery`` has no ``select()`` clause. In 4.5,
calling ``select()`` on a query intended to be used as a delete.

To help you adopt the new query interfaces and define the kind of query you want
earlier. To encourage planning ahead, ``Table::query()`` is deprecated.
Replacing it are new methods on ``Table``. The ``deleteQuery()``,
``insertQuery()``, ``selectQuery()``, ``updateQuery()`` methods will returrn the
new query instances which will emit deprecations if you are using the new
classes incorrectly.

Our hope is that these methods will allow you to incrementally adopt the new
APIs that will exist in the future.

Http
----

- Calling ``ServerRequest::is()`` with an unknown detector will now raise an
  exception.

ORM
---

- ``Table::_initializeSchema()`` is deprecated. Override ``getSchema()``
  instead, or re-map columns in ``initialize()``.
- ``QueryInterface::repository()`` is deprecated. Use ``setRepository()``
  instead.
- ``Query::selectAlso()`` was added.

Routing
-------

- The ``_ssl`` option for ``Router::url()`` has been deprecated. Use ``_https``
  instead. HTTPs is no longer entirely based on ``ssl``, and this rename aligns
  the CakePHP parameters with the broader web.


New Features
============

Database
--------

- ``ConnectionManager`` now supports read and role connection roles. Roles are determined by
  the datasource/config name. A read role always has a ":read" suffix and a write role does not.
- ``ConnectionManager::get()`` now has ``$role`` parameter to find the connection for a role. You
  can pass any connection name in to find the read or write connection for it.
- ``ConnectionManager::aliases()`` was added.
- ``Query::useRole()``, ``Query::useReadRole()``, and ``Query::useWriteRole()`` were added to let you
  switch a query to a specific connection role. This immediately changes the current connection if
  the current connection role does not match.
- ``Conection::role()`` was added to return the role of the connection.
- New query subclasses, and query methods added to ``Table``.

Error
-----

- The development error page design has been improved. It now renders chained
  exceptions and makes navigating stack traces easier as each frame can be
  collapsed individually.
- Console exception messages now include stack traces for chained exceptions.
