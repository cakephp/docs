3.8 Migration Guide
###################

CakePHP 3.8 is an API compatible upgrade from 3.7. This page outlines the
changes and improvements made in 3.8.

To upgrade to 3.8.x run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.8.*"

Deprecations
============

* ``Validator::allowEmptyString()``, ``allowEmptyArray()``,
  ``allowEmptyFile()``, ``allowEmptyDate()``, ``allowEmptyTime()``, and
  ``allowEmptyDateTime()`` now emit a deprecation warning when using the
  ``$field, $when, $message`` signature. Instead you should use
  ``$field, $message, $when``.

Behavior Changes
================

* ``Cake\ORM\Table::findOrCreate()`` now throws a ``PersistenceFailedException``
  if the find fails and the entity created from ``$search`` contains invalid
  data. Previously an invalid entity would be saved.

* ``Command`` classes that have their ``$modelClass`` property set, will now autoload that model.
The manual ``loadModel()`` call with empty argument is not necessary anymore. This makes it consistent to how Shell classes worked.

New Features
============

Collection
==========

* ``CollectionTrait`` now uses the ``newCollection`` method to create clones
  now. This allows sub-classes to have collection methods create instances of
  themselves instead of using ``Collection``.

Datasource
----------

* ``Cake\Datasource\ModelAwareTrait::get()`` can now locate model classes by
  fully-qualified class names, enabling you to use ``ArticlesTable::class`` as
  a parameter to ``get()``.

Email
-----

* ``Email::setHeaders()`` and ``Email::addHeaders()`` now allow setting multiple
  headers of the same name. For that the value for the particular header key in
  the array argument passed to above functions must be an array.
  e.g. ``$email->addHeaders(['og:tag' => ['foo', 'bar']]);``

ORM
---

* ``Cake\ORM\Locator\TableLocator`` can now locate table classes in alternative
  locations. You can either provide a list of namespaces to the constructor, or
  use the ``addLocation()`` method.

Validator
---------

* ``Validator::notEmptyString()``, ``notEmptyArray()``,
  ``notEmptyFile()``, ``notEmptyDate()``, ``notEmptyTime()``, and
  ``notEmptyDateTime()`` were added. They act as compliments to the
  ``allowEmpty*`` methods added in 3.7.

View
----

* Radio buttons can now customize the generated label by using the ``label`` key
  inside a complex option definition. This key will be used instead of the
  ``label`` key defined at the top level options.
