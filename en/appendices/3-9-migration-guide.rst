3.9 Migration Guide
###################

CakePHP 3.8 is an API compatible upgrade from 3.8. This page outlines the
changes and improvements made in 3.9.

To upgrade to 3.9.x run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.9.*"

New Features
============

* ``Hash::sort()`` now accepts the ``SORT_ASC`` and ``SORT_DESC`` constants in the direction parameter.
