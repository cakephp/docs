.. php:namespace:: Cake\ORM

.. _query-builder:

Query builder
#############

.. php:class:: Query

The ORM query builder provides a simple to use fluent interface to creating and
running queries. By composing queries together you can create advanced queries
using unions and subqueries with ease.

Underneath the covers, the query builder uses PDO prepared statements which
protect against SQL injection attacks.

Query objects are lazily evaluated. This means a query is not executed until one of
the following things occurs:

- The query is iterated with ``foreach``.
- The query's ``execute()`` method is called.
- The query's ``toArray()`` method is called.

Until one of these conditions is met the query can be modified with additional
SQL being sent to the database. It also means that if a Query is never evaluated
no SQL is ever sent to the database. Once executed, modifying and re-evaluating
a query will result in additional SQL being run.

Creating a query object
=======================

The easiest way to create a query object is to use ``find()`` from a table
object. This method will return an incomplete query ready to be modified. You
can also use a table's connection object to access the lower level Query builder
that does not include ORM features if necessary. See the :ref:`database-queries`
section for more information.  For the remaining examples, assume that
``$articles`` is a :php:class:`~Cake\\ORM\\Table`::

    // Start a new query.
    $query = $articles->find();

Selecting data
==============

Most web applications make heavy use of ``SELECT`` queries. CakePHP makes
building them a snap. To limit the fields fetched you can use the ``select``
method::

    $query = $articles->find();
    $query->select(['id', 'title', 'body']);
    foreach ($query as $row) {
        debug($row->title);
    }

You can set aliases for fields by providing fields as an associative array::

    // Results in SELECT id pk, title aliased_title, body ...
    $query = $articles->find();
    $query->select(['pk' => 'id', 'aliased_title' => 'title', 'body']);

To select distict fields you can use the ``distinct()`` method::

    // Results in SELECT DISTINCT country FROM ...
    $query = $articles->find();
    $query->select(['country'])
        ->distinct(['country']);

To set some basic conditions you can use ``where``::

    // Conditions are combined with AND
    $query = $articles->find();
    $query->where(['title' => 'First Post', 'published' => true]);

    // You can call where() multiple times
    $query = $articles->find();
    $query->where(['title' => 'First Post'])
        ->where(['published' => true]);

See the :ref:`advanced-query-conditions` section to find out how to construct more
complex ``WHERE`` conditions. To apply ordering you can use the ``order`` method::

    $query = $articles->find()
        ->order(['title' => 'ASC', 'id' => 'ASC']);

To limit the number of rows or set the row offset you can use the ``limit`` and ``page``
methods::

    // Fetch rows 50 to 100
    $query = $articles->find()
        ->limit(50)
        ->page(2);

As you can see from the examples above, all the methods that modify the query
provide a fluent interface allowing you to build a query though chained method
calls.

Using SQL functions
-------------------

CakePHP's ORM offers abstraction for some commonly used SQL functions. Using the
abstraction allows the ORM to select the platform specific implementation of the
function you are want. For example ``concat`` is implemented differently on
MySQL and Postgres, so using the abstraction allows your code to remain
portable::

    // Results in SELECT COUNT(*) count FROM ...
    $query = $articles->find();
    $query->select(['count' => $query->func()->count('*')]);

A number of commonly used functions can be created with the ``func()`` method:

- ``sum()``
- ``avg()``
- ``min()``
- ``max()``
- ``count()``
- ``concat()``
- ``coalesce()``
- ``dateDiff()``
- ``now()``

Aggregates - Group and having
-----------------------------

When using aggregate functions like ``count`` and ``sum`` you may want to use
``group by`` and ``having`` clauses::

    $query = $articles->find()
    $query->select([
        'count' => $query->func()->count('view_count')
        'published_date' => 'DATE(created)'
    ])
    ->group('published_date')
    ->having(['count >' => 3]);

Disabling hydration
-------------------

While ORMs and object result sets are powerful, hydrating entities is sometimes
unnecessary. For example when accessing aggregated data, building an Entity may
not make sense. In these situations you may want to disable entity hydration::

    $query = $articles->find();
    $query->hydrate(false);

.. note::

    When hydration is disabled results will be returned as basic arrays.

.. _advanced-query-conditions:

Advanced conditions
===================

* Using methods to build comparisons.
* Using expression objects.

Raw expressions
---------------

When you cannot construct the SQL you need using the query builder, you can use
expression objects to add snippets of SQL to your queries::

    $query = $articles->find();
    $expr = $query->newExpr()->add('1 + 1');
    $query->select(['two' => $expr]);

Expression objects can be used with any query builder methods like ``where``,
``limit``, ``group``, ``select`` and many other methods.

.. warning::

    Using expression objects leaves you vulnerable to SQL injection. You should
    avoid interpolating user data into expressions.

Loading associations
====================

.. include:: ./table-objects.rst
    :start-after: start-contain
    :end-before: end-contain

Adding Joins
------------

* Using join()


Inserting data
==============

Deleting data
=============


More complex queries
====================

Unions
------

Subqueries
----------


Modifying results with Map/Reduce
==================================

* Creating aggregate fields.
* Replacing afterFind

