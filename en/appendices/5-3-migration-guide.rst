5.3 Migration Guide
###################

The 5.3.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

Behavior Changes
================

View
----

- The ``format()`` and ``currency()`` methods of ``NumberHelper`` now accept also null as input and can return any default string here.
  This allows for easier templates, in particular baked ones. Make sure to adjust any extending helper (plugin or app level) by adding that type.

Deprecations
============

ORM
---

- Calling behavior methods on table instances is now deprecated. To call
  a method of an attached behavior you need to use
  ``$table->getBehavior('Sluggable')->slugify()`` instead of ``$table->slugify()``.

New Features
============

TODO
