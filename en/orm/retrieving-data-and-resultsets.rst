Retrieving Data & Results Sets
##############################

.. php:namespace:: Cake\ORM

.. php:class:: Table

While table objects provide an abstraction around a 'repository' or collection of
objects, when you query for individual records you get 'entity' objects. While
this section discusses the different ways you can find and load entities, you
should read the :doc:`/orm/entities` section for more information on entities.

Getting a Single Entity by Primary Key
======================================

.. php:method:: get($id, $options = [])

It is often convenient to load a single entity from the database when editing or
view entities and their related data. You can do this easily by using
``get()``::

    // In a controller or table method.

    // Get a single article
    $article = $articles->get($id);

    // Get a single article, and related comments
    $article = $articles->get($id, [
        'contain' => ['Comments']
    ]);

If the get operation does not find any results
a ``Cake\Datasource\Exception\RecordNotFoundException`` will be raised. You can either
catch this exception yourself, or allow CakePHP to convert it into a 404 error.

Like ``find()`` get has caching integrated. You can use the ``cache`` option
when calling ``get()`` to perform read-through caching::

    // In a controller or table method.

    // Use any cache config or CacheEngine instance & a generated key
    $article = $articles->get($id, [
        'cache' => 'custom',
    ]);

    // Use any cache config or CacheEngine instance & specific key
    $article = $articles->get($id, [
        'cache' => 'custom', 'key' => 'mykey'
    ]);

    // Explicitly disable caching
    $article = $articles->get($id, [
        'cache' => false
    ]);


Using Finders to Load Data
==========================

.. php:method:: find($type, $options = [])

Before you can work with entities, you'll need to load them. The easiest way to
do this is using the ``find()`` method. The find method provides an easy and
extensible way to find the data you are interested in::

    // In a controller or table method.

    // Find all the articles
    $query = $articles->find('all');

The return value of any ``find()`` method is always
a :php:class:`Cake\\ORM\\Query` object. The Query class allows you to further
refine a query after creating it. Query objects are evaluated lazily, and do not
execute until you start fetching rows, convert it to an array, or when the
``all()`` method is called::

    // In a controller or table method.

    // Find all the articles.
    // At this point the query has not run.
    $query = $articles->find('all');

    // Iteration will execute the query.
    foreach ($query as $row) {
    }

    // Calling execute will execute the query
    // and return the result set.
    $results = $query->all();

    // Once we have a result set we can get all the rows
    $data = $results->toArray();

    // Converting the query to an array will execute it.
    $results = $query->toArray();

.. note::

    Once you've started a query you can use the :doc:`/orm/query-builder` interface
    to build more complex queries, adding additional conditions, limits, or include
    associations using the fluent interface.

::

    // In a controller or table method.
    $query = $articles->find('all')
        ->where(['Articles.created >' => new DateTime('-10 days')])
        ->contain(['Comments', 'Authors'])
        ->limit(10);

You can also provide many commonly used options to ``find()``. This can help
with testing as there are fewer methods to mock::

    // In a controller or table method.
    $query = $articles->find('all', [
        'conditions' => ['Articles.created >' => new DateTime('-10 days')],
        'contain' => ['Authors', 'Comments'],
        'limit' => 10
    ]);

The list of options supported by find() are:

- ``conditions`` provide conditions for the WHERE clause of your query.
- ``limit`` Set the number of rows you want.
- ``offset`` Set the page offset you want. You can also use ``page`` to make
  the calculation simpler.
- ``contain`` define the associations to eager load.
- ``fields`` limit the fields loaded into the entity. Only loading some fields
  can cause entities to behave incorrectly.
- ``group`` add a GROUP BY clause to your query. This is useful when using
  aggregating functions.
- ``having`` add a HAVING clause to your query.
- ``join`` define additional custom joins.
- ``order`` order the result set.

Any options that are not in this list will be passed to beforeFind listeners
where they can be used to modify the query object. You can use the
``getOptions()`` method on a query object to retrieve the options used. While you
can very easily pass query objects to your controllers, we recommend that you
package your queries up as :ref:`custom-find-methods` instead. Using custom
finder methods will let you re-use your queries more easily and make testing
easier.

By default queries and result sets will return :doc:`/orm/entities` objects. You
can retrieve basic arrays by disabling hydration::

    $query->hydrate(false);

    // $data is ResultSet that contains array data.
    $data = $query->all();

.. _table-find-first:

Getting the First Result
========================

The ``first()`` method allows you to fetch only the first row from a query. If
the query has not been executed, a ``LIMIT 1`` clause will be applied::

    // In a controller or table method.
    $query = $articles->find('all', [
        'order' => ['Articles.created' => 'DESC']
    ]);
    $row = $query->first();

This approach replaces ``find('first')`` in previous versions of CakePHP. You
may also want to use the ``get()`` method if you are loading entities by primary
key.

Getting a Count of Results
==========================

Once you have created a query object, you can use the ``count()`` method to get
a result count of that query::

    // In a controller or table method.
    $query = $articles->find('all', [
        'where' => ['Articles.title LIKE' => '%Ovens%']
    ]);
    $number = $query->count();

See :ref:`query-count` for additional usage of the ``count()`` method.

.. _table-find-list:

Finding Key/Value Pairs
=======================

It is often useful to generate an associative array of data from your application's
data. For example, this is very useful when creating ``<select>`` elements. CakePHP
provides a simple to use method for generating 'lists' of data::

    // In a controller or table method.
    $query = $articles->find('list');
    $data = $query->toArray();

    // Data now looks like
    $data = [
        1 => 'First post',
        2 => 'Second article I wrote',
    ];

With no additional options the keys of ``$data`` will be the primary key of your
table, while the values will be the 'displayField' of the table. You can use the
``displayField()`` method on a table object to configure the display field of
a table::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->displayField('title');
        }
    }

When calling ``list`` you can configure the fields used for the key and value with
the ``keyField`` and ``valueField`` options respectively::

    // In a controller or table method.
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'title'
    ]);
    $data = $query->toArray();

    // Data now looks like
    $data = [
        'first-post' => 'First post',
        'second-article-i-wrote' => 'Second article I wrote',
    ];

Results can be grouped into nested sets. This is useful when you want
bucketed sets, or want to build ``<optgroup>`` elements with FormHelper::

    // In a controller or table method.
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'title',
        'groupField' => 'author_id'
    ]);
    $data = $query->toArray();

    // Data now looks like
    $data = [
        1 => [
            'first-post' => 'First post',
            'second-article-i-wrote' => 'Second article I wrote',
        ],
        2 => [
            // More data.
        ]
    ];

You can also create list data from associations that can be reached with joins::

    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => 'author.name'
    ])->contain(['Authors']);

Finding Threaded Data
=====================

The ``find('threaded')`` finder returns nested entities that are threaded
together through a key field. By default this field is ``parent_id``. This
finder allows you to easily access data stored in an 'adjacency list' style
table. All entities matching a given ``parent_id`` are placed under the
``children`` attribute::

    // In a controller or table method.
    $query = $comments->find('threaded');

    // Expanded default values
    $query = $comments->find('threaded', [
        'keyField' => $comments->primaryKey(),
        'parentField' => 'parent_id'
    ]);
    $results = $query->toArray();

    echo count($results[0]->children);
    echo $results[0]->children[0]->comment;

The ``parentField`` and ``keyField`` keys can be used to define the fields that
threading will occur on.

.. tip::
    If you need to manage more advanced trees of data, consider using
    :doc:`/orm/behaviors/tree` instead.

.. _custom-find-methods:

Custom Finder Methods
=====================

The examples above show how to use the built-in ``all`` and ``list`` finders.
However, it is possible and recommended that you implement your own finder
methods. Finder methods are the ideal way to package up commonly used queries,
allowing you to abstract query details into a simple to use method. Finder
methods are defined by creating methods following the convention of ``findFoo``
where ``Foo`` is the name of the finder you want to create. For example if we
wanted to add a finder to our articles table for finding published articles we
would do the following::

    use Cake\ORM\Query;
    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function findPublished(Query $query, array $options)
        {
            $query->where([
                'Articles.published' => true,
                'Articles.moderated' => true
            ]);
            return $query;
        }

    }

    // In a controller or table method.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published');

Finder methods can modify the query as required, or use the
``$options`` to customize the finder operation with relevant application logic.
You can also 'stack' finders, allowing you to express complex queries
effortlessly. Assuming you have both the 'published' and 'recent' finders, you
could do the following::

    // In a controller or table method.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published')->find('recent');

While all the examples so far have show finder methods on table classes, finder
methods can also be defined on :doc:`/orm/behaviors`.

If you need to modify the results after they have been fetched you should use
a :ref:`map-reduce` function to modify the results. The map reduce features
replace the 'afterFind' callback found in previous versions of CakePHP.

Dynamic Finders
===============

CakePHP's ORM provides dynamically constructed finder methods which allow you to
easily express simple queries with no additional code. For example if you wanted
to find a user by username you could do::

    // In a controller
    // The following two calls are equal.
    $query = $this->Users->findByUsername('joebob');
    $query = $this->Users->findAllByUsername('joebob');

    // In a table method
    $users = TableRegistry::get('Users');
    // The following two calls are equal.
    $query = $users->findByUsername('joebob');
    $query = $users->findAllByUsername('joebob');

When using dynamic finders you can constrain on multiple fields::

    $query = $users->findAllByUsernameAndApproved('joebob', 1);

You can also create ``OR`` conditions::

    $query = $users->findAllByUsernameOrEmail('joebob', 'joe@example.com');

While you can use either OR or AND conditions, you cannot combine the two in
a single dynamic finder. Other query options like ``contain`` are also not
supported with dynamic finders. You should use :ref:`custom-find-methods` to
encapsulate more complex queries.  Lastly, you can also combine dynamic finders
with custom finders::

    $query = $users->findTrollsByUsername('bro');

The above would translate into the following::

    $users->find('trolls', [
        'conditions' => ['username' => 'bro']
    ]);

.. note::

    While dynamic finders make it simple to express queries, they come with some
    additional performance overhead.


Retrieving Associated Data
==========================

When you want to grab associated data, or filter based on associated data, there
are two ways:

- use CakePHP ORM query functions like ``contain()`` and ``matching()``
- use join functions like ``innerJoin()``, ``leftJoin()``, and ``rightJoin()``

You should use ``contain()`` when you want to load the primary model, and its
associated data. While ``contain()`` will let you apply additional conditions to
the loaded associations, you cannot constrain the primary model based on the
associations. For more details on the ``contain()``, look at
:ref:`eager-loading-associations`.

You should use ``matching()`` when you want to restrict the primary model based
on associations. For example, you want to load all the articles that have
a specific tag on them. For more details on the ``matching()``, look at
:ref:`filtering-by-associated-data`.

If you prefer to use join functions, you can look at
:ref:`adding-joins` for more information.

.. _eager-loading-associations:

Eager Loading Associations
==========================

By default CakePHP does not load **any** associated data when using ``find()``.
You need to 'contain' or eager-load each association you want loaded in your
results.

.. start-contain

Eager loading helps avoid many of the potential performance problems
surrounding lazy-loading in an ORM. The queries generated by eager loading can
better leverage joins, allowing more efficient queries to be made. In CakePHP
you define eager loaded associations using the 'contain' method::

    // In a controller or table method.

    // As an option to find()
    $query = $articles->find('all', ['contain' => ['Authors', 'Comments']]);

    // As a method on the query object
    $query = $articles->find('all');
    $query->contain(['Authors', 'Comments']);

The above will load the related author and comments for each article in the
result set. You can load nested associations using nested arrays to define the
associations to be loaded::

    $query = $articles->find()->contain([
        'Authors' => ['Addresses'], 'Comments' => ['Authors']
    ]);

Alternatively, you can express nested associations using the dot notation::

    $query = $articles->find()->contain([
        'Authors.Addresses',
        'Comments.Authors'
    ]);

You can eager load associations as deep as you like::

    $query = $products->find()->contain([
        'Shops.Cities.Countries',
        'Shops.Managers'
    ]);

If you need to reset the containments on a query you can set the second argument
to ``true``::

    $query = $articles->find();
    $query->contain(['Authors', 'Comments'], true);

Passing Conditions to Contain
-----------------------------

When using ``contain`` you are able to restrict the data returned by the
associations and filter them by conditions::

    // In a controller or table method.

    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q
                ->select(['body', 'author_id'])
                ->where(['Comments.approved' => true]);
        }
    ]);

.. note::

    When you limit the fields that are fetched from an association, you **must**
    ensure that the foreign key columns are selected. Failing to select foreign
    key fields will cause associated data to not be present in the final result.

It is also possible to restrict deeply nested associations using the dot
notation::

    $query = $articles->find()->contain([
        'Comments',
        'Authors.Profiles' => function ($q) {
            return $q->where(['Profiles.is_published' => true]);
        }
    ]);

If you have defined some custom finder methods in your associated table, you can
use them inside ``contain``::

    // Bring all articles, but only bring the comments that are approved and
    // popular.
    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q->find('approved')->find('popular');
        }
    ]);

.. note::

    For ``BelongsTo`` and ``HasOne`` associations only the ``where`` and
    ``select`` clauses are used when loading the associated records. For the
    rest of the association types you can use every clause that the query object
    provides.

If you need full control over the query that is generated, you can tell ``contain``
to not append the ``foreignKey`` constraints to the generated query. In that
case you should use an array passing ``foreignKey`` and ``queryBuilder``::

    $query = $articles->find()->contain([
        'Authors' => [
            'foreignKey' => false,
            'queryBuilder' => function ($q) {
                return $q->where(...); // Full conditions for filtering
            }
        ]
    ]);

If you have limited the fields you are loading with ``select()`` but also want to
load fields off of contained associations, you can use ``autoFields()``::

    // Select id & title from articles, but all fields off of Users.
    $query->select(['id', 'title'])
        ->contain(['Users'])
        ->autoFields(true);

Sometimes you want to restrict the number associated data returned by a contain. That will cause a problem
because the rule will be applied to the whole query by the join.
The solution to do that is to move the fetcher out of the main query calling the option ``strategy``. 
That way you can apply rules such as ``limit()`` or ``order()``, to the subquery::

    // In the example below, we have several translated comments on any articles.
    // the Comments table could look like as shown:
    | id | articleId  | languageId  | comment          |
    |  1 |          1 |           1 | French comment   |
    |  2 |          1 |           3 | Spanish comment  |
    |  3 |          1 |           9 | English comment  |
    |  4 |          2 |           1 | French comment   |
    |  5 |          2 |           9 | English comment  |
    
    // What we want to do here is to return the comment in Spanish if it exists, if not, in English, if not, in French
    $languageFrId = 1;
    $languageEnId = 9;
    $reqLanguageId = $this->request->datas['reqLanguageId']; // for example

    $query = $articles->find()->contain([
        'Comments.strategy' => 'select',
        'Comments.queryBuilder' => function ($q) use ($reqLanguageId, $languageFrId, $languageEnId) {
            return $q
                ->select([
                    'isGivenLanguage' => $q->newExpr()->eq('languageId', $reqLanguageId), 
                    'articleId', 
                    'languageId', 
                    'comment',
                ])
                 ->where (['languageId IN ' => [$reqLanguageId, $languageFrId, $languageEnId]])
                ->order(['isGivenLanguage' => 'DESC', 'languageId' => 'DESC'])
                ->limit(1);
            },
    ]);  
    
    // If you ask for articleId 2 and languageId 3, you should get 'English comment'.
    

.. _filtering-by-associated-data:

Filtering by Associated Data
----------------------------

A fairly common query case with associations is finding records 'matching'
specific associated data. For example if you have 'Articles belongsToMany Tags'
you will probably want to find Articles that have the CakePHP tag. This is
extremely simple to do with the ORM in CakePHP::

    // In a controller or table method.

    $query = $articles->find();
    $query->matching('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

You can apply this strategy to HasMany associations as well. For example if
'Authors HasMany Articles', you could find all the authors with recently
published articles using the following::

    $query = $authors->find();
    $query->matching('Articles', function ($q) {
        return $q->where(['Articles.created >=' => new DateTime('-10 days')]);
    });

Filtering by deep associations is surprisingly easy, and the syntax should be
already familiar to you::

    // In a controller or table method.
    $query = $products->find()->matching(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

    // Bring unique articles that were commented by 'markstory' using passed variable
    $username = 'markstory';
    $query = $articles->find()->matching('Comments.Users', function ($q) use ($username) {
        return $q->where(['username' => $username]);
    });

.. note::

    As this function will create an ``INNER JOIN``, you might want to consider
    calling ``distinct`` on the find query as you might get duplicate rows if
    your conditions don't filter them already. This might be the case, for
    example, when the same users comments more than once on a single article.

The data from the association that is 'matched' will be available on the
``_matchingData`` property of entities. If you both match and contain the same
association, you can expect to get both the ``_matchingData`` and standard
association properties in your results.

.. end-contain

Lazy Loading Associations
-------------------------

While CakePHP makes it easy to eager load your associations, there may be cases
where you need to lazy-load associations. You should refer to the
:ref:`lazy-load-associations` section for more information.

Working with Result Sets
========================

Once a query is executed with ``all()``, you will get an instance of
:php:class:`Cake\\ORM\ResultSet`. This object offers powerful ways to manipulate
the resulting data from your queries.

Result set objects will lazily load rows from the underlying prepared statement.
By default results will be buffered in memory allowing you to iterate a result
set multiple times, or cache and iterate the results. If you need work with
a data set that does not fit into memory you can disable buffering on the query
to stream results::

    $query->bufferResults(false);

Turning buffering off has a few caveats:

#. You will not be able to iterate a result set more than once.
#. You will also not be able to iterate & cache the results.
#. Buffering cannot be disabled for queries that eager load hasMany or
   belongsToMany associations, as these association types require eagerly
   loading all results so that dependent queries can be generated. This
   limitation is not present when using the ``subquery`` strategy for those
   associations.

.. warning::

    Streaming results will still allocate memory for the entire results when
    using PostgreSQL and SQL Server. This is due to limitations in PDO.

Result sets allow you to easily cache/serialize or JSON encode results for API
results::

    // In a controller or table method.
    $results = $query->all();

    // Serialized
    $serialized = serialize($results);

    // Json
    $json = json_encode($results);

Both serializing and JSON encoding result sets work as you would expect. The
serialized data can be unserialized into a working result set. Converting to
JSON respects hidden & virtual field settings on all entity objects
within a result set.

In addition to making serialization easy, result sets are a 'Collection' object and
support the same methods that :ref:`collection objects<collection-objects>`
do. For example, you can extract a list of unique tags on a collection of
articles quite easily::

    // In a controller or table method.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find()->contain(['Tags']);

    $reducer = function ($output, $value) {
        if (!in_array($value, $output)) {
            $output[] = $value;
        }
        return $output;
    };

    $uniqueTags = $query->all()
        ->extract('tags.name')
        ->reduce($reducer, []);

The :doc:`/core-libraries/collections` chapter has more detail on what can be
done with result sets using the collections features.

Checking if a Query has no Results
----------------------------------

You can use the ``isEmpty()`` method on a Query or ResultSet object to see if it
has any rows in it. Calling ``isEmpty()`` on a Query object will evaluate the
query::

    // Check a query.
    $query->isEmpty();

    // Check results
    $results = $query->all();
    $results->isEmpty();

.. _map-reduce:

Modifying Results with Map/Reduce
==================================

More often than not, find operations require post-processing the data that is
found in the database. While entities' getter methods can take care of most of
the virtual property generation or special data formatting, sometimes you
need to change the data structure in a more fundamental way.

For those cases, the ``Query`` object offers the ``mapReduce()`` method, which
is a way of processing results once they are fetched from the database.

A common example of changing the data structure is grouping results together
based on certain conditions. For this task we can use the ``mapReduce()``
function. We need two callable functions the ``$mapper`` and the ``$reducer``.
The ``$mapper`` callable receives the current result from the database as first
argument, the iteration key as second argument and finally it receives an
instance of the ``MapReduce`` routine it is running::

    $mapper = function ($article, $key, $mapReduce) {
        $status = 'published';
        if ($article->isDraft() || $article->isInReview()) {
            $status = 'unpublished';
        }
        $mapReduce->emitIntermediate($article, $status);
    };

In the above example ``$mapper`` is calculating the status of an article, either
published or unpublished, then it calls ``emitIntermediate()`` on the
``MapReduce`` instance. The method stores the article in the list of articles
labelled as either published or unpublished.

The next step in the map-reduce process is to consolidate the final results. For
each status created in the mapper, the ``$reducer`` function will be called so
you can do any extra processing. This function will receive the list of articles
in a particular ``bucket`` as the first parameter, the name of the ``bucket`` it
needs to process as the second parameter, and again, as in the ``mapper()``
function, the instance of the ``MapReduce`` routine as the third parameter. In
our example, we did not have to do any extra processing, so we just ``emit()``
the final results::

    $reducer = function ($articles, $status, $mapReduce) {
        $mapReduce->emit($articles, $status);
    };

Finally, we can put these two functions together to do the grouping::

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
way without the help of a map-reduce process. Now, let's take a look at another
example in which the reducer function will be needed to do something more than
just emitting the results.

Calculating the most commonly mentioned words, where the articles contain
information about CakePHP, as usual we need a mapper function::

    $mapper = function ($article, $key, $mapReduce) {
        if (stripos('cakephp', $article['body']) === false) {
            return;
        }

        $words = array_map('strtolower', explode(' ', $article['body']));
        foreach ($words as $word) {
            $mapReduce->emitIntermediate($article['id'], $word);
        }
    };

It first checks for whether the "cakephp" word is in the article's body, and
then breaks the body into individual words. Each word will create its own
``bucket`` where each article id will be stored. Now let's reduce our results to
only extract the count::

    $reducer = function ($occurrences, $word, $mapReduce) {
        $mapReduce->emit(count($occurrences), $word);
    }

Finally, we put everything together::

    $articlesByStatus = $articles->find()
        ->where(['published' => true])
        ->andWhere(['published_date >=' => new DateTime('2014-01-01')])
        ->hydrate(false)
        ->mapReduce($mapper, $reducer);

This could return a very large array if we don't clean stop words, but it could
look something like this::

    [
        'cakephp' => 100,
        'awesome' => 39,
        'impressive' => 57,
        'outstanding' => 10,
        'mind-blowing' => 83
    ]

One last example and you will be a map-reduce expert. Imagine you have
a ``friends`` table and you want to find "fake friends" in our database, or
better said, people who do not follow each other. Let's start with our
``mapper()`` function::

    $mapper = function ($rel, $key, $mr) {
        $mr->emitIntermediate($rel['source_user_id'], $rel['target_user_id']);
        $mr->emitIntermediate($rel['target_user_id'], $rel['source_target_id']);
    };

We just duplicated our data to have a list of users each other user follows.
Now it's time to reduce it. For each call to the reducer, it will receive a list
of followers per user::

    // $friends list will look like
    // repeated numbers mean that the relationship existed in both directions
    [2, 5, 100, 2, 4]

    $reducer = function ($friendsList, $user, $mr) {
        $friends = array_count_values($friendsList);
        foreach ($friends as $friend => $count) {
            if ($count < 2) {
                $mr->emit($friend, $user);
            }
        }
    }

And we supply our functions to a query::

    $fakeFriends = $friends->find()
        ->hydrate(false)
        ->mapReduce($mapper, $reducer)
        ->toArray();

This would return an array similar to this::

    [
        1 => [2, 4],
        3 => [6]
        ...
    ]

The resulting array means, for example, that user with id ``1`` follows users
``2`` and ``4``, but those do not follow ``1`` back.


Stacking Multiple Operations
----------------------------

Using `mapReduce` in a query will not execute it immediately. The operation will
be registered to be run as soon as the first result is attempted to be fetched.
This allows you to keep chaining additional methods and filters to the query
even after adding a map-reduce routine::

   $query = $articles->find()
        ->where(['published' => true])
        ->mapReduce($mapper, $reducer);

    // At a later point in your app:
    $query->where(['created >=' => new DateTime('1 day ago')]);

This is particularly useful for building custom finder methods as described in the
:ref:`custom-find-methods` section::

    public function findPublished(Query $query, array $options)
    {
        return $query->where(['published' => true]);
    }

    public function findRecent(Query $query, array $options)
    {
        return $query->where(['created >=' => new DateTime('1 day ago')]);
    }

    public function findCommonWords(Query $query, array $options)
    {
        // Same as in the common words example in the previous section
        $mapper = ...;
        $reducer = ...;
        return $query->mapReduce($mapper, $reducer);
    }

    $commonWords = $articles
        ->find('commonWords')
        ->find('published')
        ->find('recent');

Moreover, it is also possible to stack more than one ``mapReduce`` operation for
a single query. For example, if we wanted to have the most commonly used words
for articles, but then filter it to only return words that were mentioned more
than 20 times across all articles::

    $mapper = function ($count, $word, $mr) {
        if ($count > 20) {
            $mr->emit($count, $word);
        }
    };

    $articles->find('commonWords')->mapReduce($mapper);

Removing All Stacked Map-reduce Operations
------------------------------------------

Under some circumstances you may want to modify a ``Query`` object so that no
``mapReduce`` operations are executed at all. This can be easily done by
calling the method with both parameters as null and the third parameter
(overwrite) as ``true``::

    $query->mapReduce(null, null, true);
