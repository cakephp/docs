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

* ``Cake\View\View::$request`` is protected now. Use
  ``View::getRequest()/setRequest()`` to access a View's request instance in
  other contexts.
* ``Cake\View\View::$response`` is protected now. Use
  ``View::getResponse()/setResponse()`` to access a View's response instance in
  other contexts.
* ``Cake\View\View::$templatePath`` is protected now. Use
  ``getTemplatePath()/setTemplatePath()`` instead.
* ``Cake\View\View::$template`` is protected now. Use
  ``getTemplate()/setTemplate()`` instead.
* ``Cake\View\View::$layout`` is protected now. Use ``getLayout()/setLayout()``
  instead.
* ``Cake\View\View::$layoutPath`` is protected now. Use
  ``getLayoutPath()/setLayoutPath()`` instead.
* ``Cake\View\View::$autoLayout`` is protected now. Use
  ``enableAutoLayout()/isAutoLayoutEnabled()`` instead.
* ``Cake\View\View::$theme`` is protected now. Use
  ``getTheme()/setTheme()`` instead.
* ``Cake\View\View::$subDir`` is protected now. Use ``getSubDir()/setSubDir()`` instead.
* ``Cake\View\View::$plugin`` is protected now. Use ``getPlugin()/setPlugin()``
  instead.
* ``Cake\View\View::$name`` is protected now. Use ``getName()/setName()``
  instead.
* ``Cake\View\View::$elementCache`` is protected now. Use
  ``getElementCache()/setElementCache()`` instead.
* ``Cake\View\View::$Blocks`` is protected now. Use public methods on View to
  interact with blocks.
* ``Cake\View\View:$helpers`` is protected now. Use ``helpers()`` to interact
  with the HelperRegistry instead.
* ``Cake\View\Cell::$template`` is protected now. Use
  ``viewBuilder()->getTemplate()/setTemplate()`` instead.
* ``Cake\View\Cell::$plugin`` is protected now. Use
  ``viewBuilder()->getPlugin()/setPlugin()`` instead.
* ``Cake\View\Cell::$helpers`` is protected now. Use
  ``viewBuilder()->getHelpers()/setHelpers()`` instead.
* ``Cake\View\Cell::$action`` is protected now.
* ``Cake\View\Cell::$args`` is protected now.
* ``Cake\View\Cell::$View`` is protected now.
* ``Cake\View\Cell::$request`` is protected now.
* ``Cake\View\Cell::$response`` is protected now.
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

Form
----

* ``Cake\Form\Form::setData()`` was added. This method makes defining default
  values for forms simpler.
* ``Cake\Form\Form::getData()`` was added.

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
* ``FormHelper`` now has a ``autoSetCustomValidity`` option for setting HTML5
  validity messages from custom validation messages. See: :ref:`html5-validity-messages`
