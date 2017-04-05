3.5 Migration Guide
###################

CakePHP 3.5 is an API compatible upgrade from 3.4. This page outlines the
changes and improvements made in 3.5.

Deprecations
============

The following is a list of deprecated methods, properties and behaviors. These
features will continue to function until 4.0.0 after which they will be removed.

.. Add deprecations here.

Behavior Changes
================

While these changes are API compatible, they represent minor variances in
behavior that may affect your application:

* ``BehaviorRegistry``, ``HelperRegistry`` and ``ComponentRegistry`` will now
  raise exceptions when ``unload()`` is called with an unknown object name. This
  change should help find errors easier by making possible typos more visible.
* ``HasMany`` associations now gracefully handle empty values set for the
  association property, similar to ``BelongsToMany`` associations - that is they
  treat ``false``, ``null``, and empty strings the same way as empty arrays. For
  ``HasMany`` associations this now results in all associated records to be
  deleted/unlinked in case the ``replace`` save strategy is being used.
  Consequently this allows to use forms to delete/unlink all associated records
  by passing an empty string. Previously this would have required custom
  marshalling logic, without that it would have only been possible to remove all
  but one record, as form data cannot be used to describe empty arrays.

New Features
============

* ``Cake\Event\EventManager::on()`` and ``off()`` methods are now chainable
  making it simpler to set multiple events at once.
* ``Cake\Validation\Validator::regex()`` was added for a more convenient way
  to validate data against a regex pattern.
* ``Cake\Routing\Router::reverseToArray()`` was added. This method allow you to
  convert a request object into an array that can be used to generate URL
  strings.
* New abstract types were added for ``smallinteger`` and ``tinyinteger``.
  Existing ``SMALLINT`` and ``TINYINT`` columns will now be reflected as these
  new abstract types. ``TINYINT(1)`` columns will continue to be treated as
  boolean columns in MySQL.
