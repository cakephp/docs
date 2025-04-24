5.3 Migration Guide
###################

The 5.3.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

Upgrade to PHP 8.2
==================

If you are not running on **PHP 8.2 or higher**, you will need to upgrade PHP before updating CakePHP.

.. note::
    CakePHP 5.3 requires **a minimum of PHP 8.2**.

Behavior Changes
================

View
----

- The ``format()`` and ``currency()`` methods of ``NumberHelper`` now accept also null as input and can return any default string here.
  This allows for easier templates, in particular baked ones. Make sure to adjust any extending helper (plugin or app level) by adding that type.

Deprecations
============

Http
----

- Using `$request->getParam('?')` to get the query params is deprecated.
  Use `$request->getQueryParams()` instead.

ORM
---

- Calling behavior methods on table instances is now deprecated. To call
  a method of an attached behavior you need to use
  ``$table->getBehavior('Sluggable')->slugify()`` instead of ``$table->slugify()``.
- ``EntityTrait::isEmpty()`` is deprecated. Use ``hasValue()`` instead.

New Features
============

Valiation
---------

- ``ipOrRange()`` validation has has been added to check for an IP or a range (subnet).
