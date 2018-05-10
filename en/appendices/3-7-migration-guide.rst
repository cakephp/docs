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


New Features
============

* ``Cake\TestSuite\IntegrationTestCase::assertResponseNotEquals()`` was added.
