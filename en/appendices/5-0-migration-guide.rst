5.0 Migration Guide
###################

CakePHP 5.0 contains breaking changes, and is not backwards compatible with 4.x
releases. Before attempting to upgrade to 5.0, first upgrade to 4.3 and resolve
all deprecation warnings.

Refer to the :doc:`/appendices/5-0-upgrade-guide` for step by step instructions
on how to upgrade to 5.0.

Deprecated Features Removed
===========================

All methods, properties and functionality that were emitting deprecation warnings
as of 4.3 have been removed.

Deprecations
============

The following is a list of deprecated methods, properties and behaviors. These
features will continue to function in 5.x and will be removed in 6.0.

Breaking Changes
================

In addition to the removal of deprecated features there have been breaking
changes made:

Event
-----

- Event payloads must be an array. Other object such as ArrayAccess are no longer cast to array.


New Features
============
