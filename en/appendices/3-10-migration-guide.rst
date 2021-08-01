3.10 Migration Guide
####################

CakePHP 3.10 is an API compatible upgrade from 3.8. This page outlines the
changes and improvements made.

To upgrade to 3.10.x run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.10.*"

Deprecations
============

No features were deprecated in 3.10

New Features
============

* Improved API documentation.
* Backported improvements to ``Validation::time()`` from 4.x.
* ``EmailTrait::assertMailSentFrom()`` now accepts an array with an address
  & alias.
