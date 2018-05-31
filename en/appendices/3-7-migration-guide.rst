3.7 Migration Guide
###################

CakePHP 3.7 is an API compatible upgrade from 3.6. This page outlines the
changes and improvements made in 3.7.

To upgrade to 3.7.x run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.7.*"

Deprecations
============

The following is a list of deprecated methods, properties and behaviors. These
features will continue to function until 4.0.0 after which they will be removed.

* ``Cake\View\View:$request`` is protected now. Use
  ``View::getRequest()/setRequest()`` to access a View's request instance in
  other contexts.
* ``Cake\View\View:$response`` is protected now. Use
  ``View::getResponse()/setResponse()`` to access a View's response instance in
  other contexts.
* ``Cake\View\Cell:$request`` is protected now. Use calling controller's/view's
  request instance instead.
* ``Cake\View\Cell:$response`` is protected now. Use calling controller's/view's
  response instance instead.
* ``Cake\Filesystem\Folder::normalizePath()`` is deprecated. You should use
  ``correctSlashFor()`` instead.


Soft Deprecations
=================

The following methods, properties and features have been deprecated but will not
be removed until 5.0.0:

* ``Cake\TestSuite\ConsoleIntegrationTestCase`` is deprecated. You should
  include ``Cake\TestSuite\ConsoleIntegrationTestTrait`` into your test case
  class instead.

Behavior Changes
================

* ``Cake\Database\Statement\StatementDecorator::fetchAll()`` now returns an
  empty array instead of ``false`` when no result is found.
* ``Cake\Database\Statement\BufferedStatement`` no longer inherits from
  ``StatementDecorator`` and no longer implements the ``IteratorAggregate``
  interface. Instead it directly implements the ``Iterator`` interface to better
  support using statements with collections.


New Features
============

Database
--------

* ``Cake\Database\FunctionsBuilder::rand()`` was added.

Filesystem
----------

* ``Cake\Filesystem\Folder::normalizeFullPath()`` was added.

TestSuite
---------

* ``Cake\TestSuite\IntegrationTestCase::assertResponseNotEquals()`` was added.
* The custom assertions provided by ``IntegrationTestCase`` and
  ``ConsoleIntegrationTestCase`` are now implemented through constraint classes.
* The ``assertFlashMessage()``, ``assertFlashMessageAt()``,
  ``assertFlashElement()``, ``assertFlashElementAt()`` methods were added to
  ``IntegrationTestTrait``.


Utility
-------

* ``Cake\Utility\Text::getTransliterator()`` was added.
* ``Cake\Utility\Text::setTransliterator()`` was added.

Validation
----------

* ``Cake\Validation\Validation::iban()`` was added for validating international
  bank account numbers.

View
----

* ``FormHelper`` now supports a ``confirmJs`` template variable which allows the
  javascript snippet generated for confirmation boxes to be customized.
