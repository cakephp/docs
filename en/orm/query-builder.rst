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

When providing arguments for SQL functions there are two kinds of parameters you
can use; literal arguments and bound parameters. Literal parameters allow you to
reference columns or other SQL literals. Bound parameters can be used to safely
add user data to SQL functions. For example::

    $query = $articles->find();
    $concat = $query->func()->concat([
        'title' => 'literal',
        ' NEW'
    ]);
    $query->select(['title' => $concat]);

By making arguments with a value of ``literal`` the ORM will know that
the key should be treated as a literal SQL value. The above would generate the
following SQL on MySQL::

    SELECT CONCAT(title, :c0) FROM articles;

The ``:c0`` value will have the ``' NEW'`` text bound when the query is
executed.

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

The query builder makes it simple to build complex where clauses.
Grouped conditions can be expressed by providing combining ``where``,
``andWhere`` and ``orWhere``. The ``where`` method works similar to the
conditions arrays in previous versions of CakePHP::

    $query = $articles->find()
        ->where([
            'author_id' => 3,
            'OR' => ['author_id' => 2],
        ]);

The above would generate SQL like::

    SELECT * FROM articles WHERE (author_id = 2 OR author_id = 3)

If you'd prefer to avoid deeply nested arrays, you can use the ``orWhere`` and
``andWhere`` methods to build your queries. Each method sets the combining
operator used between the current and previous condition. For example::

    $query = $articles->find()
        ->where(['author_id' => 2])
        ->orWhere(['author_id' => 3]);

The above will output SQL similar to::

    SELECT * FROM articles WHERE (author_id = 2 OR author_id = 3)

By combining ``orWhere`` & ``andWhere`` you can express complex conditions that
use a mixture of operators::

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
    WHERE (promoted = 1
    OR (published = true AND view_count > 10)
    AND (author_id = 2 OR author_id = 3))

By using functions as the parameters to ``orWhere`` & ``andWhere`` you can
easily compose conditions together with the expression objects::

    $query = $articles->find()
        ->where(['title LIKE' => '%First%'])
        ->orWhere(function($exp) {
            return $exp->or_(['author_id' => 1])
                ->eq('author_id', 2);
            ]);
        });

The above would create SQL like::

    SELECT *
    FROM articles
    WHERE ((author_id = 1 OR author_id = 2)
    OR title LIKE '%First%')

The expression object that is passed into where functions has two kinds of
methods. The first type of methods are **combinators**. The ``and_`` & ``or_``
methods create new expression objects that change **how** conditions are
combined. The second type of methods are **conditions**. Conditions are added
into an expression where they are combined with the current combinator. For
example calling ``$exp->and_(...)`` will create a new expression object that
combines all conditions it contains with ``AND``. While ``$exp->or_()`` will
create a new expression object that combines all conditions added to it with
``OR``. An example of adding conditions with an expression object would be::

    $query = $articles->find()
        ->where(function($exp) {
            return $exp
                ->eq('author_id', 2)
                ->eq('published', true)
                ->notEq('spam', true)
                ->gt('view_count', 10);
        });

Since we started off using ``where`` we don't need to call ``and_``, as that
happens implicitly. Much like how we would not need to call ``or_`` had we
started our query with ``orWhere``. The above shows a few new condition methods
being combined with ``AND``. The resulting SQL would look like::

    SELECT *
    FROM articles
    WHERE (
    author_id = 2
    AND published = 1
    AND spam != 1
    AND view_count > 10)

If however we wanted to use both ``AND`` & ``OR`` conditions we could do the
following::

    $query = $articles->find()
        ->where(function($exp) {
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

The ``or_`` & ``and_`` methods also allow you to use functions as their
parameters. This is often easier to read than method chaining::

    $query = $articles->find()
        ->where(function($exp) {
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
        ->where(function($exp) {
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

In addition to loading related data with ``contain()`` you can also add
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

As seen above when adding joins the alias can be the outer array key. Join
conditions can also be expressed as an array of conditions::

    $query = $articles->find()
        ->hydrate(false)
        ->join([
            'c' => [
                'table' => 'comments',
                'type' => 'LEFT',
                'conditions' => [
                    'c.created >' => new DateTime('-5 days')
                    'c.moderated' => true,
                    'c.article_id = articles.id'
                ]
            ],
        ], ['a.created' => 'datetime', 'c.moderated' => 'boolean']);

When creating joins by hand and using array based conditions, you need to
provide the datatypes for each column in the join conditions. By providing
datatypes for the join conditions, the ORM can correctly convert data types into
SQL.

Inserting data
==============

Unlike earlier examples, you should not use ``find()`` to create insert queries.
Instead, create new query objects using ``query()``::

    $query = $articles->query();
    $query->insert($articles->table(), ['title', 'body'])
        ->values([
            'title' => 'First post',
            'body' => 'Some body text'
        ])
        ->execute();

Generally it is easier to insert data using entities and
:php:method:`~Cake\\ORM\\Table::save()`. By composing a ``SELECT`` and
``INSERT`` query together you can create ``INSERT INTO ... SELECT`` style
queries::

    $select = $articles->find()
        ->select(['title', 'body', 'published'])
        ->where(['id' => 3]);

    $query = $articles->query()
        ->insert($articles->table(), ['title', 'body', 'published'])
        ->values($select)
        ->execute();

Updating data
=============

As with insert queries, you should not use ``find()`` to create delete queries.
Instead,create new query objects using ``query()``::

    $query = $articles->query();
    $query->delete($articles->table())
        ->where(['id' => $id])
        ->execute();

Generally it is easier to delete data using entities and
:php:method:`~Cake\\ORM\\Table::delete()`.

Deleting data
=============

As with insert queries, you should not use ``find()`` to create delete queries.
Instead, create new query objects using ``query()``::

    $query = $articles->query();
    $query->delete($articles->table())
        ->where(['id' => $id])
        ->execute();

Generally it is easier to delete data using entities and
:php:method:`~Cake\\ORM\\Table::delete()`.

More complex queries
====================

The query builder is capable of building complex queries like ``UNION`` queries,
and sub-queries.

Unions
------

Unions are created by composing one or more select queries together::

    $inReview = $articles->find()
        ->where(['need_review' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->union($inReview);

You can create ``UNION ALL`` queries using the ``unionAll`` method::

    $inReview = $articles->find()
        ->where(['need_review' => true]);

    $unpublished = $articles->find()
        ->where(['published' => false]);

    $unpublished->unionAll($inReview);

Subqueries
----------

Subqueries are a powerful feature in relational databases and building them in
CakePHP is fairly intuitive. By composing queries together you can make
subqueries::

    $matchingComment = $articles->association('Comments')->find()
        ->select(['article_id'])
        ->distinct('article_id')
        ->where(['comment LIKE' => '%CakePHP%']);

    $query = $articles->find()
        ->where(['id' => $matchingComment]);

Subqueries are accepted anywhere a query expression can be used.

.. _map-reduce:

Modifying results with Map/Reduce
==================================

More often than not, find operations require post-processing the data that is
found in the database. While entities' getter methods can take care of most of
the virtual properties generation or special data formatting, sometimes you
need to change the data structure in a more fundamental way.

On common example of changing the data structure is grouping results together
based on certain conditions. For this task we can use the ``mapReduce``
function. We need two callable functions the ``$mapper`` and the ``$reducer``.
The ``$mapper`` callable receives the iteration key as first argument, the current
result from the database as second argument and finally it receives an instance
of the ``MapReduce`` routine it is running::

    $mapper = function($key, $article, $mapReduce) {
        $status = 'published';
        if ($article->isDraft() || $article->isInReview()) {
            $status = 'unpublished';
        }
        $mapReduce->emitIntermediate($status, $article);
    };

In the above example ``$mapper`` is calculating the status of an article, either
published or unpublished, then it calls ``emitIntermediate`` on the
``MapReduce`` instance. What this functions does is basically to store the
article in the list of articles labelled as either published or unpublished.

The next step in the map-reduce process is to consolidate the final results. For
each status created in the mapper, the ``$reducer`` function will be called so
you can do any extra processing. This function will receive  the name of the
``bucket`` it needs to process as first param, the list of articles in that
bucket as second parameter and again, as in the ``mapper`` function the instance
of the ``MapReduce`` routine. In our example, we did not have to do any extra
processing, so we just ``emit`` the final results::

    $reducer = function($status, $articles, $mapReduce) {
        $mapReduce->emit($articles, $status);
    };

Finally, we can put this two functions together to do the grouping::

    $articlesByStatus = $articles->find()
        ->where(['author_id' => 1])
        ->mapReduce($mapper, $reducer);

    foreach ($articlesByStatus as $status => $articles) {
        echo sprintf("The are %d %s articles", count($articles), $status);
    }

The above will ouput the following lines::

    There are 4 published articles
    There are 5 unpublished articles

Of course, this is a simplistic example that could actually be solved in another
way without the help of a map-reduce process. Now let's take a look at another
example in which the reducer function will be needed to do something more than
just emitting the results.

Calculating the most common mentioned words, where the articles contain
information about CakePHP. as usual we need a mapper function::



It first checks for whether the "cakephp" word in in the article's body, and
then breaks the body into individual words. Each word will create its own
``bucket`` where each article id will be stored. Now let's reduce our results to
only extract the count::

    $reducer = function($word, $occurrences, $mapReduce) {
        $mapReduce->emit(count($occurrences), $word);
    }

That was easy, again. We just count the list of articles per each word bucket.
Finally we put everything together::

    $articlesByStatus = $articles->find()
        ->where(['published' => true])
        ->andWhere(['published_date >=' => new DateTime('2014-01-01')])
        ->hydrate(false)
        ->mapReduce($mapper, $reducer);

This could return a very large array if we don't clean stop words, but it could
look something like like this::

    [
        'cakephp' => 100,
        'awesome' => 39,
        'impressive' => 57,
        'outstanding' => 10,
        'mind-blowing' => 83
    ]

A last example an you will be a map-reduce expert. Imagine you have
a ``friends`` table and you want to find "fake friends" in our database, or
better said, people that do not follow each other. Let's start with our
``mapper`` function::

    $mapper = function($key, $rel, $mr) {
        $mr->emitIntermediate($rel['source_user_id'], $rel['target_user_id']);
        $mr->emitIntermediate($rel['target_user_id'], $rel['source_target_id']);
    };

We just duplicated out data, to have a list of users each other user follows.
Now it's time to reduce it::

    $reducer = function($user, $friendsList, $mr) {
        $fiends = array_count_values($friendsList);
        foreach ($friends as $friend => $count) {
            if ($count < 2) {
                $mr->emit($friend), $user;
            }
        }
    }

And we supply our functions to a query::

    $fakeFriends = $friends->find()
        ->hydrate(false)
        ->mapReduce($mapper, $reducer);

This would return an array similar to this::

    [
        1 => [2, 4],
        3 => [6]
        ...
    ]

The resulting array means, for example, that user with id ``1`` is follows users
``2`` and ``4``, but those do not follow ``1`` back.
