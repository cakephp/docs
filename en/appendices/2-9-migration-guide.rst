2.9 Migration Guide
###################

CakePHP 2.9 is a fully API compatible upgrade from 2.8. This page outlines
the changes and improvements made in 2.9.

PHP7 Compatibility
==================

CakePHP 2.9 is compatible with, and tested against PHP7.

Deprecations
============

* The ``Object`` class has been deprecated and renamed to ``CakeObject`` due to
  ``object`` becoming a reserved keyword in one of the next PHP7 minors (see
  [RFC](https://wiki.php.net/rfc/reserve_even_more_types_in_php_7)).

New Features
============

* ``DboSource::flushQueryCache()`` was added to allow more fine-grained control
  of query result caching when enabled.
* The log messages created by ``ErrorHandler`` can now be more easily customized
  in subclasses.
* Additional mime-types for 'jsonapi', and 'psd' were added.
* Time & Datetime inputs no longer set a ``maxlength`` attribute when rendered
  as 'text' input types.
* ``AuthComponent::user()`` now makes the user data available when using
  stateless authentication adapters.
