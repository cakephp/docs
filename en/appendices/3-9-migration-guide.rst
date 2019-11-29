3.9 Migration Guide
###################

CakePHP 3.9 is an API compatible upgrade from 3.8. This page outlines the
changes and improvements made.

To upgrade to 3.9.x run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.9.*"

Deprecations
============

* ``ConsoleIo::info()``, ``success()``,  ``warning()`` and ``error()`` will no
  longer accept ``null`` values in the ``message`` parameter in 4.0.
* Using a comma separated string for ``$fixtures`` in test cases is deprecated.
  Instead use an array, or implement the new ``getFixtures()`` method on your
  test case classes.
* ``Validator::errors()`` was renamed to ``Validator::validate()``.

New Features
============

Cache
-----

* ``MemcachedEngine::write()`` and ``add()`` no longer cap duration to 30 days.
  Instead all expiration values are forwarded to memcache.

Console
-------

* ``ConsoleIo::abort()`` was added.

Database
--------

* ``Driver::newTableSchema()`` was added. This hook method lets you customize
  which the class used for schema metadata.

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

TestSuite
---------

* ``TestCase::getFixtures()`` was added. This method lets you generate your
  fixture list using application specific logic if necessary.

Utility
-------

* ``Hash::sort()`` now accepts the ``SORT_ASC`` and ``SORT_DESC`` constants in the direction parameter.

Validation
----------

* The 'empty' field detection in ``Validator`` now considers
  ``UploadedFileInterface`` objects that have ``UPLOAD_ERR_NO_FILE`` as their
  error code to be empty.

View
----

* ``FormHelper`` had the ``selectedClass`` template variable added. This template
  key controls the class name used when a radio or checkbox is selected.
