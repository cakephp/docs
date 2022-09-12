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

Routing
-------

- The ``_ssl`` option for ``Router::url()`` has been deprecated. Use ``_https``
  instead. HTTPs is no longer entirely based on ``ssl``, and this rename aligns
  the CakePHP parameters with the broader web.

