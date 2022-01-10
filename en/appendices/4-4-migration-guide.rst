4.4 Migration Guide
###################

CakePHP 4.4 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.4.

Upgrading to 4.3.0
==================

You can can use composer to upgrade to CakePHP 4.4.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.4@RC"

.. note::
    CakePHP 4.4 requires PHP 7.4 or greater.

Deprecations
============

4.4 introduces a few deprecations. All of these features will continue for the
duration of 4.x but will be removed in 5.0. You can use the
:ref:`upgrade tool <upgrade-tool-use>` to automate updating usage of deprecated
features::

    bin/cake upgrade rector --rules cakephp44 <path/to/app/src>

.. note::
    This only updates CakePHP 4.4 changes. Make sure you apply CakePHP 4.3 changes first.

A new configuration option has been added to disable deprecations on a path by
path basis. See :ref:`deprecation-warnings` for more information.

* Defining view class mappings with ``RequestHandlerComponent`` is deprecated.
  Use :ref:`controller-viewclasses` instead.

Behavior Changes
================

While the following changes do not change the signature of any methods they do
change the semantics or behavior of methods.

* ``Router::parseRequest()`` now raises ``BadRequestException`` instead of
  ``InvalidArgumentException`` when an invalid HTTP method is used by a client.

Breaking Changes
================

Behind the API, some breaking changes are necessary moving forward.
They usually only affect tests.

Global
------

* Increased minimum requirement to PHP 7.4.

New Features
============

Command
-------

* ``bin/cake routes`` now highlights collisions in route templates.

Controller
----------

* ``Controller::viewClasses()`` was added. This method should be implemented by
  controllers that need to perform content-type negotiation. View classes will
  need to implement the static method ``contentType()`` to participate in
  content-type negotiation.

Database
--------

* The ``SQLite`` driver now supports shared in memory databases in PHP8.1+.
* ``Query::expr()`` was added as an alternative to ``Query::newExpr()``.
* The ``QueryExpression::case()`` builder now supports inferring the type
  from expressions passed to ``then()`` and ``else()`` that implement
  ``\Cake\Database\TypedResultInterface``.

Http
----

* ``BaseApplication::handle()`` now adds the ``$request`` into the service
  container all the time.
* ``HttpsEnforcerMiddleware`` now has an ``hsts`` option that allows you to
  configure the ``Strict-Transport-Security`` header.
  
Mailer
------

* ``Mailer`` now accepts a ``autoLayout`` config which disabled auto layout
  in the ``ViewBuilder`` if set to ``false``.
