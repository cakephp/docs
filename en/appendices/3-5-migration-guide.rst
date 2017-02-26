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

.. Add behavior changes here.

New Features
============

* ``Cake\Event\EventManager::on()`` and ``off()`` methods are now chainable
  making it simpler to set multiple events at once.

* ``Cake\Validation\Validator::regex()`` was added for a more convenient way
  to validate data against a regex pattern.
