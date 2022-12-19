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

There are some potentially impactful changes to the ORM coming in 5.x. To make
querybuilding more typesafe and have fewer silent errors 5.x will be
transitioning to separate query objects for each type of query. The new classes
are:

- ``Cake\ORM\Query\DeleteQuery`` Used for building ``delete`` queries.
- ``Cake\ORM\Query\InsertQuery`` Used for building ``insert`` queries.
- ``Cake\ORM\Query\SelectQuery`` Used for building ``select`` queries.
- ``Cake\ORM\Query\UpdateQuery`` Used for building ``update`` queries.

Each of these classes lack methods that don't make sense for that query type.
For example, ``DeleteQuery`` has no ``select()`` clause, and ``InsertQuery`` has
no ``limit()`` method. 5.x will also offer new ``*query()`` methods on ``Table``
to replace ``query()``.

The 4.5 release also introduces these new query classes and methods on
``Table`` to provide an opt-in upgrade path. In 4.5, the new query classes are
sub-classes of ``ORM\Query`` and have full backwards compatibility, but they
also emit deprecations from all methods that will **not** be present in 5.x.

When upgrading you can upgrade to the new query classes by replacing calls to
``Table::query()``. Replacing it are new methods on ``Table``. The
``deleteQuery()``, ``insertQuery()``, ``selectQuery()``, ``updateQuery()``
methods will returrn the new query instances which will emit deprecations if you
are using the new classes incorrectly.

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

View
----

- It is recommended to replace ``loadHelper()`` with new ``addHelper()`` method to add helpers in ``View::initialize()``.

New Features
============

Controller
----------

- ``ComponentRegistry`` is now automatically added to your application's
  :term:`DI container`.

Core
-----------

- The current container instance is now registered in the :term:`DI container`
  and available as dependency for application services or controllers/commands.


Database
--------

- ``ConnectionManager`` now supports read and write connection roles. Roles can be configured
  with ``read`` and ``write`` keys in the connection config that override the shared config.
- ``ConnectionManager::aliases()`` was added.
- ``SelectQuery::setConnectionRole()``, ``SelectQuery::useReadRole()``, and ``SelectQuery::useWriteRole()``
  were added to let you switch a query to a specific connection role.

Error
-----

- The development error page design has been improved. It now renders chained
  exceptions and makes navigating stack traces easier as each frame can be
  collapsed individually.
- Console exception messages now include stack traces for chained exceptions.
- Listeners of the ``Exception.beforeRender`` event can now replace the trapped
  exception or override the rendering step by returning a ``Response`` object.
- Listeners of the ``Error.beforeRender`` event can now replace the rendering
  step for an error by returning the desired output.

Http
----

- The ``HttpsEnforcerMiddleware`` now supports a ``trustedProxies`` option that
  lets you define which proxies your application trusts.

View
----

- ``View::addHelper()`` was added. This method compliments ``addBehavior()`` and
  ``addComponent()``.
