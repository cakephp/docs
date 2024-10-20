5.2 Migration Guide
###################

The 5.2.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

Behavior Changes
================

- ``ValidationSet::add()`` will now raise errors when a rule is added with
  a name that is already defined. This change aims to prevent rules from being
  overwritten by accident.

New Features
============

ORM
---

- ``CounterCacheBehavior::updateCounterCache()`` has been addded. This method
  allows you to update the counter cache values for all records of the configured
  associations.

Error
-----

- Custom exceptions can have specific error handling logic defined in
  ``ErrorController``.
