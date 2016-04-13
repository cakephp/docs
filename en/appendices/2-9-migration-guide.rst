2.9 Migration Guide
###################

CakePHP 2.9 is a fully API compatible upgrade from 2.8. This page outlines
the changes and improvements made in 2.9.

PHP7 Compatibility
==================

CakePHP 2.9 is compatible with, and tested against PHP7.

Deprecations
============

* The ``Object`` class has been deprecated due to upcoming PHP7 collisions.
  Please see below for details.

Core
====

Object
------

- The ``Object`` class been renamed to ``CakeObject`` due to `object` becoming a
  reserved keyword in one of the next PHP7 minors (see
  [RFC](https://wiki.php.net/rfc/reserve_even_more_types_in_php_7)).
