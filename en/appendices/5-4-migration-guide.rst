5.4 Migration Guide
###################

The 5.4.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

Upgrade Tool
============

The :doc:`upgrade tool </appendices/migration-guides>` provides rector rules for
automating some of the migration work. Run rector before updating your
``composer.json`` dependencies::

    bin/cake upgrade rector --rules cakephp54 <path/to/app/src>

Behavior Changes
================

- WIP

Deprecations
============

- WIP

New Features
============

Utility
-------

- New ``Cake\Utility\Fs\Finder`` class provides a fluent, iterator-based API for
  discovering files and directories with support for pattern matching, depth
  control, and custom filters. The ``Cake\Utility\Fs\Path`` class offers
  cross-platform utilities for path manipulation.
