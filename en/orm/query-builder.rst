Query Builder
#############

.. php:namespace:: Cake\ORM

.. php:class:: Query

The ORM's query builder provides a simple to use fluent interface for creating
and running queries. By composing queries together, you can create advanced
queries using unions and subqueries with ease.

Underneath the covers, the query builder uses PDO prepared statements which
protect against SQL injection attacks.

The Query Object
================

The easiest way to create a ``Query`` object is to use ``find()`` from a
``Table`` object. This method will return an incomplete query ready to be
modified. You can also use a table's connection object to access the lower level
Query builder that does not include ORM features, if necessary. See the
:ref:`database-queries` section for more information::

    use Cake\ORM\TableRegistry;
    $articles = TableRegistry::get('Articles');

    // Start a new query.
    $query = $articles->find();

When inside a controller, you can use the automatic table variable that is
created using the conventions system::

    // Inside ArticlesController.php

    $query = $this->Articles->find();

Selecting Rows From A Table
---------------------------

::

    use Cake\ORM\TableRegistry;

    $query = TableRegistry::get('Articles')->find();

    foreach ($query as $article) {
        debug($article->title);
    }

For the remaining examples, assume that ``$articles`` is a
:php:class:`~Cake\\ORM\\Table`. When inside controllers, you can use
``$this->Articles`` instead of ``$articles``.

Almost every method in a ``Query`` object will return the same query, this means
that ``Query`` objects are lazy, and will not be executed unless you tell them
to::

    $query->where(['id' => 1]); // Return the same query object
    $query->order(['title' => 'DESC']); // Still same object, no SQL executed

You can of course chain the methods you call on Query objects::

    $query = $articles
        ->find()
        ->select(['id', 'name'])
        ->where(['id !=' => 1])
        ->order(['created' => 'DESC']);

    foreach ($query as $article) {
        debug($article->created);
    }

If you try to call ``debug()`` on a Query object, you will see its internal
state and the SQL that will be executed in the database::

    debug($articles->find()->where(['id' => 1]));

    // Outputs
    // ...
    // 'sql' => 'SELECT * FROM articles where id = ?'
    // ...

You can execute a query directly without having to use ``foreach`` on it.
The easiest way is to either call the ``all()`` or ``toArray()`` methods::

    $resultsIteratorObject = $articles
        ->find()
        ->where(['id >' => 1])
        ->all();

    foreach ($resultsIteratorObject as $article) {
        debug($article->id);
    }

    $resultsArray = $articles
        ->find()
        ->where(['id >' => 1])
        ->toArray();

    foreach ($resultsArray as $article) {
        debug($article->id);
    }

    debug($resultsArray[0]->title);

In the above example, ``$resultsIteratorObject`` will be an instance of
``Cake\ORM\ResultSet``, an object you can iterate and apply several extracting
and traversing methods on.

Often, there is no need to call ``all()``, you can simply iterate the
Query object to get its results. Query objects can also be used directly as the
result object; trying to iterate the query, calling ``toArray()`` or some of the
methods inherited from :ref:`Collection <collection-objects>`, will result in the
query being executed and results returned to you.

Selecting A Single Row From A Table
-----------------------------------

You can use the ``first()`` method to get the first result in the query::

    $article = $articles
        ->find()
        ->where(['id' => 1])
        ->first();

    debug($article->title);

Getting A List Of Values From A Column
--------------------------------------

::

    // Use the extract() method from the collections library
    // This executes the query as well
    $allTitles = $articles->find()->extract('title');

    foreach ($allTitles as $title) {
        echo $title;
    }

You can also get a key-value list out of a query result::

    $list = $articles->find('list')->select(['id', 'title']);

    foreach ($list as $id => $title) {
        echo "$id : $title"
    }

Queries Are Collection Objects
------------------------------

Once you get familiar with the Query object methods, it is strongly encouraged
that you visit the :ref:`Collection <collection-objects>` section to improve
your skills in efficiently traversing the data. In short, it is important to
remember that anything you can call on a Collection object, you can also do in
a Query object::

    // Use the combine() method from the collections library
    // This is equivalent to find('list')
    $keyValueList = $articles->find()->combine('id', 'title');

    // An advanced example
    $results = $articles->find()
        ->where(['id >' => 1])
        ->order(['title' => 'DESC'])
        ->map(function ($row) { // map() is a collection method, it executes the query
            $row->trimmedTitle = trim($row->title);
            return $row;
        })
        ->combine('id', 'trimmedTitle') // combine() is another collection method
        ->toArray(); // Also a collections library method

    foreach ($results as $id $trimmedTitle) {
        echo "$id : $trimmedTitle";
    }

How Are Queries Lazily Evaluated
--------------------------------

Query objects are lazily evaluated. This means a query is not executed until one
of the following things occur:

- The query is iterated with ``foreach()``.
- The query's ``execute()`` method is called. This will return the underlying
  statement object, and is to be used with insert/update/delete queries.
- The query's ``first()`` method is called. This will return the first result in the set
  built by ``SELECT`` (it adds ``LIMIT 1`` to the query).
- The query's ``all()`` method is called. This will return the result set and
  can only be used with ``SELECT`` statements.
- The query's ``toArray()`` method is called.

Until one of these conditions are met, the query can be modified without additional
SQL being sent to the database. It also means that if a Query hasn't been
evaluated, no SQL is ever sent to the database. Once executed, modifying and
re-evaluating a query will result in additional SQL being run.

If you want to take a look at what SQL CakePHP is generating, you can turn
database :ref:`query logging <database-query-logging>` on.

The following sections will show you everything there is to know about using and
combining the Query object methods to construct SQL statements and extract data.

Selecting Data
==============

Most web applications make heavy use of ``SELECT`` queries. CakePHP makes
building them a snap. To limit the fields fetched, you can use the ``select()``
method::

    $query = $articles->find();
    $query->select(['id', 'title', 'body']);
    foreach ($query as $row) {
        debug($row->title);
    }

You can set aliases for fields by providing fields as an associative array::

    // Results in SELECT id AS pk, title AS aliased_title, body ...
    $query = $articles->find();
    $query->select(['pk' => 'id', 'aliased_title' => 'title', 'body']);

To select distinct fields, you can use the ``distinct()`` method::

    // Results in SELECT DISTINCT country FROM ...
    $query = $articles->find();
    $query->select(['country'])
        ->distinct(['country']);

To set some basic conditions you can use the ``where()`` method::

    // Conditions are combined with AND
    $query = $articles->find();
    $query->where(['title' => 'First Post', 'published' => true]);

    // You can call where() multiple times
    $query = $articles->find();
    $query->where(['title' => 'First Post'])
        ->where(['published' => true]);

See the :ref:`advanced-query-conditions` section to find out how to construct
more complex ``WHERE`` conditions. To apply ordering, you can use the ``order``
method::

    $query = $articles->find()
        ->order(['title' => 'ASC', 'id' => 'ASC']);

To limit the number of rows or set the row offset you can use the ``limit()``
and ``page()`` methods::

    // Fetch rows 50 to 100
    $query = $articles->find()
        ->limit(50)
        ->page(2);

As you can see from the examples above, all the methods that modify the query
provide a fluent interface, allowing you to build a query through chained method
calls.

Selecting All Fields From a Table
---------------------------------

By default a query will select all fields from a table, the exception is whe you
call the ``select()`` function yourself and pass certain fields::

    // Only select id and title from the articles table
    $articles->find()->select(['id', 'title']);

If you wish to still select all fields from a table after having called
``select($fields)``, you can pass the table instance to ``select()`` for this
purpose::

    // Only select id and title from the articles table
    $query = $articlesTable->find();
    $query
        ->select(['slug' => $query->func()->concat(['title', '-', 'id'])])
        ->select($articlesTable); // Select all fields from articles

Using SQL Functions
-------------------

CakePHP's ORM offers abstraction for some commonly used SQL functions. Using the
abstraction allows the ORM to select the platform specific implementation of the
function you want. For example, ``concat`` is implemented differently in MySQL,
PostgreSQL and SQL Server. Using the abstraction allows your code to be portable::

    // Results in SELECT COUNT(*) count FROM ...
    $query = $articles->find();
    $query->select(['count' => $query->func()->count('*')]);

A number of commonly used functions can be created with the ``func()`` method:

- ``sum()`` Calculate a sum. The arguments will be treated as literal values.
- ``avg()`` Calculate an average. The arguments will be treated as literal values.
- ``min()`` Calculate the min of a column. The arguments will be treated as
  literal values.
- ``max()`` Calculate the max of a column. The arguments will be treated as
  literal values.
- ``count()`` Calculate the count. The arguments will be treated as literal
  values.
- ``concat()`` Concatenate two values together. The arguments are treated as
  bound parameters unless marked as literal.
- ``coalesce()`` Coalesce values. The arguments are treated as bound parameters
  unless marked as literal.
- ``dateDiff()`` Get the difference between two dates/times. The arguments are
  treated as bound parameters unless marked as literal.
- ``now()`` Take either 'time' or 'date' as an argument allowing you to get
  either the current time, or current date.

When providing arguments for SQL functions, there are two kinds of parameters
you can use, literal arguments and bound parameters. Literal parameters allow
you to reference columns or other SQL literals. Bound parameters can be used to
safely add user data to SQL functions. For example::

    $query = $articles->find();
    $concat = $query->func()->concat([
        'title' => 'literal',
        ' NEW'
    ]);
    $query->select(['title' => $concat]);

By making arguments with a value of ``literal``, the ORM will know that
the key should be treated as a literal SQL value. The above would generate the
following SQL on MySQL::

    SELECT CONCAT(title, :c0) FROM articles;

The ``:c0`` value will have the ``' NEW'`` text bound when the query is
executed.

In addition to the above functions, the ``func()`` method can be used to create any generic SQL function
such as ``year``, ``date_format``, ``convert``, etc. For example::

    $query = $articles->find();
    $year = $query->func()->year([
        'created' => 'literal'
    ]);
    $time = $query->func()->date_format([
        'created' => 'literal',
        "'%H:%i'" => 'literal'
    ]);
    $query->select([
        'yearCreated' => $year,
        'timeCreated' => $time
    ]);

Would result in::

    SELECT YEAR(created) as yearCreated, DATE_FORMAT(created, '%H:%i') as timeCreated FROM articles;

Aggregates - Group and Having
-----------------------------

When using aggregate functions like ``count`` and ``sum`` you may want to use
``group by`` and ``having`` clauses::

    $query = $articles->find();
    $query->select([
        'count' => $query->func()->count('view_count'),
        'published_date' => 'DATE(created)'
    ])
    ->group('published_date')
    ->having(['count >' => 3]);

Case statements
---------------

The ORM also offers the SQL ``case`` expression. The ``case`` expression allows
for implementing ``if ... then ... else`` logic inside your SQL. This can be useful
for reporting on data where you need to conditionally sum or count data, or where you
need to specific data based on a condition.

If we wished to know how many published articles are in our database, we'd need to generate the following SQL::

    SELECT SUM(CASE published = 'Y' THEN 1 ELSE 0) AS number_published, SUM(CASE published = 'N' THEN 1 ELSE 0) AS number_unpublished
    FROM articles GROUP BY published

To do this with the query builder, we'd use the following code::

    $query = $articles->find();
    $publishedCase = $query->newExpr()->addCase($query->newExpr()->add(['published' => 'Y']), 1, 'integer');
    $notPublishedCase = $query->newExpr()->addCase($query->newExpr()->add(['published' => 'N']), 1, 'integer');

    $query->select([
        'number_published' => $query->func()->sum($publishedCase),
        'number_unpublished' => $query->func()->sum($unpublishedCase)
    ])
    ->group('published');

Disabling Hydration
-------------------

While ORMs and object result sets are powerful, hydrating entities is sometimes
unnecessary. For example, when accessing aggregated data, building an Entity may
not make sense. In these situations you may want to disable entity hydration::

    $query = $articles->find();
    $query->hydrate(false);

.. note::

    When hydration is disabled results will be returned as basic arrays.

.. _advanced-query-conditions:

Advanced Conditions
===================

The query builder makes it simple to build complex ``where`` clauses.
Grouped conditions can be expressed by providing combining ``where()``,
``andWhere()`` and ``orWhere()``. The ``where()`` method works similar to the
conditions arrays in previous versions of CakePHP::

    $query = $articles->find()
        ->where([
            'author_id' => 3,
            'OR' => [['view_count' => 2], ['view_count' => 3]],
        ]);

The above would generate SQL like::

    SELECT * FROM articles WHERE author_id = 3 AND (view_count = 2 OR view_count = 3)

If you'd prefer to avoid deeply nested arrays, you can use the ``orWhere()`` and
``andWhere()`` methods to build your queries. Each method sets the combining
operator used between the current and previous condition. For example::

    $query = $articles->find()
        ->where(['author_id' => 2])
        ->orWhere(['author_id' => 3]);

The above will output SQL similar to::

    SELECT * FROM articles WHERE (author_id = 2 OR author_id = 3)

By combining ``orWhere()`` and ``andWhere()``, you can express complex
conditions that use a mixture of operators::

    $query = $articles->find()
        ->where(['author_id' => 2])
        ->orWhere(['author_id' => 3])
        ->andWhere([
            'published' => true,
            'view_count >' => 10
        ])
        ->orWhere(['promoted' => true]);

The above generates SQL similar to::

    SELECT *
    FROM articles
    WHERE (promoted = true
    OR (
      (published = true AND view_count > 10)
      AND (author_id = 2 OR author_id = 3)
    ))

By using functions as the parameters to ``orWhere()`` and ``andWhere()``,
you can easily compose conditions together with the expression objects::

    $query = $articles->find()
        ->where(['title LIKE' => '%First%'])
        ->andWhere(function ($exp) {
            return $exp->or_([
                'author_id' => 2,
                'is_highlighted' => true
            ]);
        });

The above would create SQL like::

    SELECT *
    FROM articles
    WHERE ((author_id = 2 OR is_highlighted = 1)
    AND title LIKE '%First%')

The expression object that is passed into ``where()`` functions has two kinds of
methods. The first type of methods are **combinators**. The ``and_()`` and
``or_()`` methods create new expression objects that change **how** conditions
are combined. The second type of methods are **conditions**. Conditions are
added into an expression where they are combined with the current combinator.

For example, calling ``$exp->and_(...)`` will create a new ``Expression`` object
that combines all conditions it contains with ``AND``. While ``$exp->or_()``
will create a new ``Expression`` object that combines all conditions added to it
with ``OR``. An example of adding conditions with an ``Expression`` object would
be::

    $query = $articles->find()
        ->where(function ($exp) {
            return $exp
                ->eq('author_id', 2)
                ->eq('published', true)
                ->notEq('spam', true)
                ->gt('view_count', 10);
        });

Since we started off using ``where()``, we don't need to call ``and_()``, as that
happens implicitly. Much like how we would not need to call ``or_()``, had we
started our query with ``orWhere()``. The above shows a few new condition
methods being combined with ``AND``. The resulting SQL would look like::

    SELECT *
    FROM articles
    WHERE (
    author_id = 2
    AND published = 1
    AND spam != 1
    AND view_count > 10)

However, if we wanted to use both ``AND`` & ``OR`` conditions we could do the
following::

    $query = $articles->find()
        ->where(function ($exp) {
            $orConditions = $exp->or_(['author_id' => 2])
                ->eq('author_id', 5);
            return $exp
                ->add($orConditions)
                ->eq('published', true)
                ->gte('view_count', 10);
        });

Which would generate the SQL similar to::

    SELECT *
    FROM articles
    WHERE (
    (author_id = 2 OR author_id = 5)
    AND published = 1
    AND view_count > 10)

The ``or_()`` and ``and_()`` methods also allow you to use functions as their
parameters. This is often easier to read than method chaining::

    $query = $articles->find()
        ->where(function ($exp) {
            $orConditions = $exp->or_(function ($or) {
                return $or->eq('author_id', 2)
                    ->eq('author_id', 5);
            });
            return $exp
                ->not($orConditions)
                ->lte('view_count', 10);
        });

You can negate sub-expressions using ``not()``::

    $query = $articles->find()
        ->where(function ($exp) {
            $orConditions = $exp->or_(['author_id' => 2])
                ->eq('author_id', 5);
            return $exp
                ->not($orConditions)
                ->lte('view_count', 10);
        });

Which will generate the following SQL looking like::

    SELECT *
    FROM articles
    WHERE (
    NOT (author_id = 2 OR author_id = 5)
    AND view_count <= 10)

It is also possible to build expressions using SQL functions::

    $query = $articles->find()
        ->where(function ($exp, $q) {
            $year = $q->func()->year([
                'created' => 'literal'
            ]);
            return $exp
                ->gte($year, 2014)
                ->eq('published', true);
        });

Which will generate the following SQL looking like::

    SELECT *
    FROM articles
    WHERE (
    YEAR(created) >= 2014
    AND published = 1
    )

When using the expression objects you can use the following methods to create
conditions:

- ``eq()`` Creates an equality condition.
- ``notEq()`` Create an inequality condition
- ``like()`` Create a condition using the ``LIKE`` operator.
- ``notLike()`` Create a negated ``LIKE`` condition.
- ``in()`` Create a condition using ``IN``.
- ``notIn()`` Create a negated condition using ``IN``.
- ``gt()`` Create a ``>`` condition.
- ``gte()`` Create a ``>=`` condition.
- ``lt()`` Create a ``<`` condition.
- ``lte()`` Create a ``<=`` condition.
- ``isNull()`` Create an ``IS NULL`` condition.
- ``isNotNull()`` Create a negated ``IS NULL`` condition.
- ``between()`` Create a ``BETWEEN`` condition.

Automatically Creating IN Clauses
---------------------------------

When building queries using the ORM, you will generally not have to indicate the
data types of the columns you are interacting with, as CakePHP can infer the
types based on the schema data. If in your queries you'd like CakePHP to
automatically convert equality to ``IN`` comparisons, you'll need to indicate
the column data type::

    $query = $articles->find()
        ->where(['id' => $ids], ['id' => 'integer[]']);

    // Or include IN to automatically cast to an array.
    $query = $articles->find()
        ->where(['id IN' => $ids]);

The above will automatically create ``id IN (...)`` instead of ``id = ?``. This
can be useful when you do not know whether you will get a scalar or array of
parameters. The ``[]`` suffix on any data type name indicates to the query
builder that you want the data handled as an array. If the data is not an array,
it will first be cast to an array. After that, each value in the array will
be cast using the :ref:`type system <database-data-types>`. This works with
complex types as well. For example, you could take a list of DateTime objects
using::

    $query = $articles->find()
        ->where(['post_date' => $dates], ['post_date' => 'date[]']);

Automatic IS NULL Creation
--------------------------

When a condition value is expected to be ``null`` or any other value, you can use
the ``IS`` operator to automatically create the correct expression::

    $query = $categories->find()
        ->where(['parent_id IS' => $parentId]);


The above will create ``parent_id` = :c1`` or ``parent_id IS NULL`` depending on the type of ``$parentId``

Automatic IS NOT NULL Creation
------------------------------

When a condition value is expected not to be ``null`` or any other value, you can use
the ``IS NOT`` operator to automatically create the correct expression::

    $query = $categories->find()
        ->where(['parent_id IS NOT' => $parentId]);


The above will create ``parent_id` != :c1`` or ``parent_id IS NOT NULL`` depending on the type of ``$parentId``

Raw Expressions
---------------

When you cannot construct the SQL you need using the query builder, you can use
expression objects to add snippets of SQL to your queries::

    $query = $articles->find();
    $expr = $query->newExpr()->add('1 + 1');
    $query->select(['two' => $expr]);

``Expression`` objects can be used with any query builder methods like
``where()``, ``limit()``, ``group()``, ``select()`` and many other methods.

.. warning::

    Using expression objects leaves you vulnerable to SQL injection. You should
    avoid interpolating user data into expressions.

Getting Results
===============

Once you've made your query, you'll want to retrieve rows from it. There are
a few ways of doing this::

    // Iterate the query
    foreach ($query as $row) {
        // Do stuff.
    }

    // Get the results
    $results = $query->all();

You can use :doc:`any of the collection </core-libraries/collections>` methods
on your query objects to pre-process or transform the results::

    // Use one of the collection methods.
    $ids = $query->map(function ($row) {
        return $row->id;
    });

    $maxAge = $query->max(function ($row) {
        return $max->age;
    });

You can use ``first`` or ``firstOrFail`` to retrieve a single record. These
methods will alter the query adding a ``LIMIT 1`` clause::

    // Get just the first row
    $row = $query->first();

    // Get the first row or an exception.
    $row = $query->firstOrFail();

.. _query-count:

Returning the Total Count of Records
------------------------------------

Using a single query object, it is possible to obtain the total number of rows
found for a set of conditions::

    $total = $articles->find()->where(['is_active' => true])->count();

The ``count()`` method will ignore the ``limit``, ``offset`` and ``page``
clauses, thus the following will return the same result::

    $total = $articles->find()->where(['is_active' => true])->limit(10)->count();

This is useful when you need to know the total result set size in advance,
without having to construct another ``Query`` object. Likewise, all result
formatting and map-reduce routines are ignored when using the ``count()``
method.

Moreover, it is possible to return the total count for a query containing group
by clauses without having to rewrite the query in any way. For example, consider
this query for retrieving article ids and their comments count::

    $query = $articles->find();
    $query->select(['Articles.id', $query->func()->count('Comments.id')])
        ->matching('Comments')
        ->group(['Articles.id']);
    $total = $query->count();

After counting, the query can still be used for fetching the associated
records::

    $list = $query->all();

Sometimes, you may want to provide an alternate method for counting the total
records of a query. One common use case for this is providing
a cached value or an estimate of the total rows, or to alter the query to remove
expensive unneeded parts such as left joins. This becomes particularly handy
when using the CakePHP built-in pagination system which calls the ``count()``
method::

    $query = $query->where(['is_active' => true])->counter(function ($query) {
        return 100000;
    });
    $query->count(); // Returns 100000

In the example above, when the pagination component calls the count method, it
will receive the estimated hard-coded number of rows.

.. _caching-query-results:

Caching Loaded Results
----------------------

When fetching entities that don't change often you may want to cache the
results. The ``Query`` class makes this simple::

    $query->cache('recent_articles');

Will enable caching on the query's result set. If only one argument is provided
to ``cache()`` then the 'default' cache configuration will be used. You can
control which caching configuration is used with the second parameter::

    // String config name.
    $query->cache('recent_articles', 'dbResults');

    // Instance of CacheEngine
    $query->cache('recent_articles', $memcache);

In addition to supporting static keys, the ``cache()`` method accepts a function
to generate the key. The function you give it will receive the query as an
argument. You can then read aspects of the query to dynamically generate the
cache key::

    // Generate a key based on a simple checksum
    // of the query's where clause
    $query->cache(function ($q) {
        return 'articles-' . md5(serialize($q->clause('where')));
    });

The cache method makes it simple to add cached results to your custom finders or
through event listeners.

When the results for a cached query are fetched the following happens:

1. The ``Model.beforeFind`` event is triggered.
2. If the query has results set, those will be returned.
3. The cache key will be resolved and cache data will be read. If the cache data
   is not empty, those results will be returned.
4. If the cache misses, the query will be executed and a new ``ResultSet`` will be
   created. This ``ResultSet`` will be written to the cache and returned.

.. note::

    You cannot cache a streaming query result.

Loading Associations
====================

The builder can help you retrieve data from multiple tables at the same time
with the minimum amount of queries possible. To be able to fetch associated
data, you first need to setup associations between the tables as described in
the :doc:`/orm/associations` section. This technique of combining queries
to fetch associated data from other tables is called **eager loading**.

.. include:: ./retrieving-data-and-resultsets.rst
    :start-after: start-contain
    :end-before: end-contain

.. _adding-joins:

Adding Joins
------------

In addition to loading related data with ``contain()``, you can also add
additional joins with the query builder::

    $query = $articles->find()
        ->hydrate(false)
        ->join([
            'table' => 'comments',
            'alias' => 'c',
            'type' => 'LEFT',
            'conditions' => 'c.article_id = articles.id',
        ]);

You can append multiple joins at the same time by passing an associative array
with multiple joins::

    $query = $articles->find()
        ->hydrate(false)
        ->join([
            'c' => [
                'table' => 'comments',
                'type' => 'LEFT',
                'conditions' => 'c.article_id = articles.id',
            ],
            'u' => [
                'table' => 'users',
                'type' => 'INNER',
                'conditions' => 'u.id = articles.user_id',
            ]
        ]);

As seen above, when adding joins the alias can be the outer array key. Join
conditions can also be expressed as an array of conditions::

    $query = $articles->find()
        ->hydrate(false)
        ->join([
            'c' => [
                'table' => 'comments',
                'type' => 'LEFT',
                'conditions' => [
                    'c.created >' => new DateTime('-5 days'),
                    'c.moderated' => true,
                    'c.article_id = articles.id'
                ]
            ],
        ], ['a.created' => 'datetime', 'c.moderated' => 'boolean']);

When creating joins by hand and using array based conditions, you need to
provide the datatypes for each column in the join conditions. By providing
datatypes for the join conditions, the ORM can correctly convert data types into
SQL. In addition to ``join()`` you can use ``rightJoin()``, ``leftJoin()`` and
``innerJoin()`` to create joins::

    // Join with an alias and string conditions
    $query = $articles->find();
    $query->leftJoin(
        ['Authors' => 'authors'],
        ['Authors.id = Articles.author_id']);

    // Join with an alias, array conditions, and types
    $query = $articles->find();
    $query->innerJoin(
        ['Authors' => 'authors'],
        [
        'Authors.promoted' => true,
        'Authors.created' => new DateTime('-5 days'),
        'Authors.id = Articles.author_id'
        ],
        ['Authors.promoted' => 'boolean', 'Authors.created' => 'datetime']);

It should be noted that if you set the ``quoteIdentifiers`` option to ``true`` when
defining your ``Connection``, join conditions between table fields should be set as follow::

    $query = $articles->find()
        ->join([
            'c' => [
                'table' => 'comments',
                'type' => 'LEFT',
                'conditions' => [
                    'c.article_id' => new \Cake\Database\Expression\IdentifierExpression('articles.id')
                ]
            ],
        ]);

This ensures that all of your identifiers will be quoted across the Query, avoiding errors with
some database Drivers (PostgreSQL notably)

Inserting Data
==============

Unlike earlier examples, you should not use ``find()`` to create insert queries.
Instead, create a new ``Query`` object using ``query()``::

    $query = $articles->query();
    $query->insert(['title', 'body'])
        ->values([
            'title' => 'First post',
            'body' => 'Some body text'
        ])
        ->execute();

Generally, it is easier to insert data using entities and
:php:meth:`~Cake\\ORM\\Table::save()`. By composing a ``SELECT`` and
``INSERT`` query together, you can create ``INSERT INTO ... SELECT`` style
queries::

    $select = $articles->find()
        ->select(['title', 'body', 'published'])
        ->where(['id' => 3]);

    $query = $articles->query()
        ->insert(['title', 'body', 'published'])
        ->values($select)
        ->execute();

Updating Data
=============

As with insert queries, you should not use ``find()`` to create update queries.
Instead, create new a ``Query`` object using ``query()``::

    $query = $articles->query();
    $query->update()
        ->set(['published' => true])
        ->where(['id' => $id])
        ->execute();

Generally, it is easier to update data using entities and
:php:meth:`~Cake\\ORM\\Table::patchEntity()`.

Deleting Data
=============

As with insert queries, you should not use ``find()`` to create delete queries.
Instead, create new a query object using ``query()``::

    $query = $articles->query();
    $query->delete()
        ->where(['id' => $id])
        ->execute();

Generally, it is easier to delete data using entities and
:php:meth:`~Cake\\ORM\\Table::delete()`.

More Complex Queries
====================

The query builder is capable of building complex queries like ``UNION`` queries
and sub-queries.

Unions
------

Unions are created by composing one or more select queries together::

    $inReview = $articles->find()
        ->where(['need_review' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->union($inReview);

You can create ``UNION ALL`` queries using the ``unionAll()`` method::

    $inReview = $articles->find()
        ->where(['need_review' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->unionAll($inReview);

Subqueries
----------

Subqueries are a powerful feature in relational databases and building them in
CakePHP is fairly intuitive. By composing queries together, you can make
subqueries::

    $matchingComment = $articles->association('Comments')->find()
        ->select(['article_id'])
        ->distinct()
        ->where(['comment LIKE' => '%CakePHP%']);

    $query = $articles->find()
        ->where(['id' => $matchingComment]);

Subqueries are accepted anywhere a query expression can be used. For example, in
the ``select()`` and ``join()`` methods.

.. _format-results:

Adding Calculated Fields
========================

After your queries, you may need to do some post-processing. If you need to add
a few calculated fields or derived data, you can use the ``formatResults()``
method. This is a lightweight way to map over the result sets. If you need more
control over the process, or want to reduce results you should use
the :ref:`Map/Reduce <map-reduce>` feature instead. If you were querying a list
of people, you could easily calculate their age with a result formatter::

    // Assuming we have built the fields, conditions and containments.
    $query->formatResults(function (\Cake\Datasource\ResultSetInterface $results) {
        return $results->map(function ($row) {
            $row['age'] = $row['birth_date']->diff(new \DateTime)->y;
            return $row;
        });
    });

As you can see in the example above, formatting callbacks will get a
``ResultSetDecorator`` as their first argument. The second argument will be
the Query instance the formatter was attached to. The ``$results`` argument can
be traversed and modified as necessary.

Result formatters are required to return an iterator object, which will be used
as the return value for the query. Formatter functions are applied after all the
Map/Reduce routines have been executed. Result formatters can be applied from
within contained associations as well. CakePHP will ensure that your formatters
are properly scoped. For example, doing the following would work as you may
expect::

    // In a method in the Articles table
    $query->contain(['Authors' => function ($q) {
        return $q->formatResults(function ($authors) {
            return $authors->map(function ($author) {
                $author['age'] = $author['birth_date']->diff(new \DateTime)->y;
                return $author;
            });
        });
    });

    // Get results
    $results = $query->all();

    // Outputs 29
    echo $results->first()->author->age;

As seen above, the formatters attached to associated query builders are scoped
to operate only on the data in the association. CakePHP will ensure that
computed values are inserted into the correct entity.
