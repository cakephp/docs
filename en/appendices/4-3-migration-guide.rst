4.3 Migration Guide
###################

CakePHP 4.3 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.3.

Upgrading to 4.3.0
==================

You can can use composer to upgrade to CakePHP 4.3.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.3@beta"

Deprecations
============

4.3 introduces a few deprecations. All of these features will continue for the
duration of 4.x but will be removed in 5.0. You can use the
:ref:`upgrade tool <upgrade-tool-use>` to automate updating usage of deprecated
features::

    bin/cake upgrade rector --rules cakephp43 <path/to/app/src>

.. note::
    This only updates CakePHP 4.3 changes. Make sure you apply CakePHP 4.2 changes first.

A new configuration option has been added to disable deprecations on a path by
path basis. See :ref:`deprecation-warnings` for more information.


Behavior Changes
================

While the following changes do not change the signature of any methods they do
change the semantics or behavior of methods.


Breaking Changes
================

Behind the API, some breaking changes are necessary moving forward.
They usually only affect tests.


New Features
============

ORM
---

- Queries that ``contain()`` HasMany and BelongsToMany associations now
  propagate the status of result casting. This ensures that results from all
  associations are either cast with type mapping objects or not at all.
- ``Table`` now includes ``label`` in the list of fields that are candidates for
  ``displayField`` defaults.
- Added ``Query::whereNotInListOrNull()`` and ``QueryExpression::notInOrNull()`` to support
  nullable columns to avoid ``NOT IN`` failing ``null != value`` checks.
