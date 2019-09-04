3.9 Migration Guide
###################

CakePHP 3.9 is an API compatible upgrade from 3.8. This page outlines the
changes and improvements made.

To upgrade to 3.9.x run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.9.*"

New Features
============

Console
-------

* ``ConsoleIo::abort()`` was added.

Datasource
----------

* ``Cake\Datasource\SimplePaginator`` was added. This class makes paginating
  very large results more efficient. It skips running the potentially expensive
  ``count()`` query. If you only use 'next' and 'previous' navigation in
  your pagination controls this class can be a good solution.

ORM
---

* ``Table::saveManyOrFail()`` method has been added that will throw ``PersistenceFailedException``
  with the specific entity that failed in case of an error. The entities are saved within a transaction.
* ``Table::deleteMany()`` and ``Table::deleteManyOrFail()`` methods have been added for removing many
  entities at once including callbacks. The entities are removed within a transaction.
* ``TableLocator::clear()`` now resets the internal ``options`` array.

Utility
-------

* ``Hash::sort()`` now accepts the ``SORT_ASC`` and ``SORT_DESC`` constants in the direction parameter.
