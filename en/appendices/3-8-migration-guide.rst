3.8 Migration Guide
###################

CakePHP 3.8 is an API compatible upgrade from 3.7. This page outlines the
changes and improvements made in 3.8.

To upgrade to 3.8.x run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.8.*"

Behavior Changes
================

* ``Cake\ORM\Table::findOrCreate()`` now throws a ``PersistenceFailedException``
  if the find fails and the entity created from ``$search`` contains invalid
  data. Previously an invalid entity would be saved.

New Features
============

ORM
---

* ``Cake\ORM\Locator\TableLocator`` can now locate table classes in alternative
  locations. You can either provide a list of namespaces to the constructor, or
  use the ``addLocation()`` method.
