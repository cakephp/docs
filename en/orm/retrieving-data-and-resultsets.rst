Retrieving Data & Results Sets
##############################

.. php:namespace:: Cake\ORM

.. php:class:: Table

While table objects provide an abstraction around a 'repository' or collection
of objects, when you query for individual records you get 'entity' objects.
While this section discusses the different ways you can find and load entities,
you should read the :doc:`/orm/entities` section for more information on
entities.

Debugging Queries and ResultSets
================================

Since the ORM now returns Collections and Entities, debugging these objects can
be more complicated than in previous CakePHP versions. There are now various
ways to inspect the data returned by the ORM.

- ``debug($query)`` Shows the SQL and bound parameters, does not show results.
- ``sql($query)`` Shows the final rendered SQL when DebugKit is installed.
- ``debug($query->all())`` Shows the ResultSet properties (not the results).
- ``debug($query->toList())`` Show results in an array.
- ``debug(iterator_to_array($query))`` Shows query results in an array format.
- ``debug(json_encode($query, JSON_PRETTY_PRINT))`` More human readable results.
- ``debug($query->first())`` Show the properties of a single entity.
- ``debug((string)$query->first())`` Show the properties of a single entity as JSON.

Getting a Single Entity by Primary Key
======================================

.. php:method:: get($id, $options = [])

It is often convenient to load a single entity from the database when editing or
viewing entities and their related data. You can do this by using ``get()``::

    // In a controller or table method.

    // Get a single article
    $article = $articles->get($id);

    // Get a single article, and related comments
    $article = $articles->get($id, contain: ['Comments']);

If the get operation does not find any results a
``Cake\Datasource\Exception\RecordNotFoundException`` will be raised. You can
either catch this exception yourself, or allow CakePHP to convert it into a 404
error.

Like ``find()``, ``get()`` also has caching integrated. You can use the
``cache`` option when calling ``get()`` to perform read-through caching::

    // In a controller or table method.

    // Use any cache config or CacheEngine instance & a generated key
    $article = $articles->get($id, cache: 'custom');

    // Use any cache config or CacheEngine instance & specific key
    $article = $articles->get($id, cache: 'custom', key: 'mykey');

    // Explicitly disable caching
    $article = $articles->get($id, cache: false);

Optionally you can ``get()`` an entity using :ref:`custom-find-methods`. For
example you may want to get all translations for an entity. You can achieve that
by using the ``finder`` option::

    $article = $articles->get($id, 'translations');

The list of options supported by get() are:

-  ``cache`` cache config.
-  ``key`` cache key.
-  ``finder`` custom finder function.
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


Using Finders to Load Data
==========================

.. php:method:: find($type, mixed ...$args)

Before you can work with entities, you'll need to load them. The easiest way to
do this is using the ``find()`` method. The find method provides a short and
extensible way to find the data you are interested in::

    // In a controller or table method.

    // Find all the articles
    $query = $articles->find('all');

The return value of any ``find()`` method is always
a :php:class:`Cake\\ORM\\Query\\SelectQuery` object. The SelectQuery class allows you to further
refine a query after creating it. SelectQuery objects are evaluated lazily, and do not
execute until you start fetching rows, convert it to an array, or when the
``all()`` method is called::

    // In a controller or table method.

    // Find all the articles.
    // At this point the query has not run.
    $query = $articles->find('all');

    // Calling all() will execute the query
    // and return the result set.
    $results = $query->all();

    // Once we have a result set we can get all the rows
    $data = $results->toList();

    // Converting the query to a key-value array will also execute it.
    $data = $query->toArray();

.. note::

    Once you've started a query you can use the :doc:`/orm/query-builder`
    interface to build more complex queries, adding additional conditions,
    limits, or include associations using the fluent interface.

::

    // In a controller or table method.
    $query = $articles->find('all')
        ->where(['Articles.created >' => new DateTime('-10 days')])
        ->contain(['Comments', 'Authors'])
        ->limit(10);

You can also provide many commonly used options to ``find()``::

    // In a controller or table method.
    $query = $articles->find('all',
        conditions: ['Articles.created >' => new DateTime('-10 days')],
        contain: ['Authors', 'Comments'],
        limit: 10
    );

If your finder options are in an array, you can use the `splat operator <https://www.php.net/manual/en/functions.arguments.php#functions.variable-arg-list>`_ (``...``)
to pass them into ``find()``::

    $options = [
        'conditions' => ['Articles.created >' => new DateTime('-10 days')],
        'contain' => ['Authors', 'Comments'],
        'limit' => 10,
    ]
    $query = $articles->find('all', ...$options);

The list of named arguments supported by find() by default are:

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

Any options that are not in this list will be passed to ``beforeFind`` listeners
where they can be used to modify the query object. You can use the
``getOptions()`` method on a query object to retrieve the options used. While
you can pass query objects to your controllers, we recommend that you package
your queries up as :ref:`custom-find-methods` instead. Using custom finder
methods will let you re-use your queries and make testing easier.

By default queries and result sets will return :doc:`/orm/entities` objects. You
can retrieve basic arrays by disabling hydration::

    $query->disableHydration();

    // $data is ResultSet that contains array data.
    $data = $query->all();

.. _table-find-first:

Getting the First Result
========================

The ``first()`` method allows you to fetch only the first row from a query. If
the query has not been executed, a ``LIMIT 1`` clause will be applied::

    // In a controller or table method.
    $query = $articles->find('all', order: ['Articles.created' => 'DESC']);
    $row = $query->first();

This approach replaces ``find('first')`` in previous versions of CakePHP. You
may also want to use the ``get()`` method if you are loading entities by primary
key.

.. note::

    The ``first()`` method will return ``null`` if no results are found.

Getting a Count of Results
==========================

Once you have created a query object, you can use the ``count()`` method to get
a result count of that query::

    // In a controller or table method.
    $query = $articles->find('all', conditions: ['Articles.title LIKE' => '%Ovens%']);
    $number = $query->count();

See :ref:`query-count` for additional usage of the ``count()`` method.

.. _table-find-list:

Finding Key/Value Pairs
=======================

It is often useful to generate an associative array of data from your
application's data. For example, this is very useful when creating ``<select>``
elements. CakePHP provides a simple to use method for generating 'lists' of
data::

    // In a controller or table method.
    $query = $articles->find('list');
    $data = $query->toArray();

    // Data now looks like
    $data = [
        1 => 'First post',
        2 => 'Second article I wrote',
    ];

With no additional options the keys of ``$data`` will be the primary key of your
table, while the values will be the 'displayField' of the table. The default ‘displayField’ of the table is ``title`` or ``name``. While, you can use the
``setDisplayField()`` method on a table object to configure the display field of
a table::

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->setDisplayField('label');
        }
    }

When calling ``list`` you can configure the fields used for the key and value
with the ``keyField`` and ``valueField`` options respectively::

    // In a controller or table method.
    $query = $articles->find('list', keyField: 'slug', valueField: 'label');
    $data = $query->toArray();

    // Data now looks like
    $data = [
        'first-post' => 'First post',
        'second-article-i-wrote' => 'Second article I wrote',
    ];

Results can be grouped into nested sets. This is useful when you want
bucketed sets, or want to build ``<optgroup>`` elements with ``FormHelper``::

    // In a controller or table method.
    $query = $articles->find('list', keyField: 'slug', valueField: 'label', groupField: 'author_id');
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

    $query = $articles->find('list', keyField: 'id', valueField: 'author.name')
        ->contain(['Authors']);

The ``keyField``, ``valueField``, and ``groupField`` expression will operate on
entity attribute paths not the database columns. This means that you can use
virtual fields in the results of ``find(list)``.

Customize Key-Value Output
--------------------------

Lastly it is possible to use closures to access entity accessor methods in your
list finds. ::

    // In your Authors Entity create a virtual field to be used as the displayField:
    protected function _getLabel()
    {
        return $this->_fields['first_name'] . ' ' . $this->_fields['last_name']
          . ' / ' . __('User ID %s', $this->_fields['user_id']);
    }

This example shows using the ``_getLabel()`` accessor method from
the Author entity. ::

    // In your finders/controller:
    $query = $articles->find('list',
            keyField: 'id',
            valueField: function ($article) {
                return $article->author->get('label');
            }
        )
        ->contain('Authors');

You can also fetch the label in the list directly using. ::

    // In AuthorsTable::initialize():
    $this->setDisplayField('label'); // Will utilize Author::_getLabel()
    // In your finders/controller:
    $query = $authors->find('list'); // Will utilize AuthorsTable::getDisplayField()

.. _finding-threaded-data:

Finding Threaded Data
=====================

The ``find('threaded')`` finder returns nested entities that are threaded
together through a key field. By default this field is ``parent_id``. This
finder allows you to access data stored in an 'adjacency list' style table. All
entities matching a given ``parent_id`` are placed under the ``children``
attribute::

    // In a controller or table method.
    $query = $comments->find('threaded');

    // Expanded default values
    $query = $comments->find('threaded',
        keyField: $comments->primaryKey(),
        parentField: 'parent_id'
    );
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
wanted to add a finder to our articles table for finding articles written by a
given user, we would do the following::

    use App\Model\Entity\User;
    use Cake\ORM\Query\SelectQuery;
    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function findOwnedBy(SelectQuery $query, User $user)
        {
            return $query->where(['author_id' => $user->id]);
        }
    }

    $query = $articles->find('ownedBy', user: $userEntity);

Finder methods can modify the query as required, or use the ``$options`` to
customize the finder operation with relevant application logic. You can also
'stack' finders, allowing you to express complex queries effortlessly. Assuming
you have both the 'published' and 'recent' finders, you could do the following::

    $query = $articles->find('published')->find('recent');

While all the examples so far have shown finder methods on table classes, finder
methods can also be defined on :doc:`/orm/behaviors`.

If you need to modify the results after they have been fetched you should use
a :ref:`map-reduce` function to modify the results. The map reduce features
replace the 'afterFind' callback found in previous versions of CakePHP.

.. _dynamic-finders:

Dynamic Finders
===============

CakePHP's ORM provides dynamically constructed finder methods which allow you to
express simple queries with no additional code. For example if you wanted to
find a user by username you could do::

    // In a controller
    // The following two calls are equal.
    $query = $this->Users->findByUsername('joebob');
    $query = $this->Users->findAllByUsername('joebob');

When using dynamic finders you can constrain on multiple fields::

    $query = $users->findAllByUsernameAndApproved('joebob', 1);

You can also create ``OR`` conditions::

    $query = $users->findAllByUsernameOrEmail('joebob', 'joe@example.com');

While you can use either ``OR`` or ``AND`` conditions, you cannot combine the
two in a single dynamic finder. Other query options like ``contain`` are also
not supported with dynamic finders. You should use :ref:`custom-find-methods` to
encapsulate more complex queries.  Lastly, you can also combine dynamic finders
with custom finders::

    $query = $users->findTrollsByUsername('bro');

The above would translate into the following::

    $users->find('trolls', conditions: ['username' => 'bro']);

Once you have a query object from a dynamic finder, you'll need to call
``first()`` if you want the first result.

.. note::

    While dynamic finders make it simple to express queries, they add a small
    amount of overhead. You cannot call ``findBy`` methods from a query object.
    When using a finder chain the dynamic finder must be called first.

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

Eager Loading Associations Via Contain
======================================

By default CakePHP does not load **any** associated data when using ``find()``.
You need to 'contain' or eager-load each association you want loaded in your
results.

.. start-contain

Eager loading helps avoid many of the potential performance problems
surrounding lazy-loading in an ORM. The queries generated by eager loading can
better leverage joins, allowing more efficient queries to be made. In CakePHP
you state which associations should be eager loaded using the 'contain' method::

    // In a controller or table method.

    // As an option to find()
    $query = $articles->find('all', contain: ['Authors', 'Comments']);

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

Which is equivalent to calling::

    $query = $products->find()->contain([
        'Shops' => ['Cities.Countries', 'Managers']
    ]);

You can select fields from all associations with multiple ``contain()``
statements::

    $query = $this->find()->select([
        'Realestates.id',
        'Realestates.title',
        'Realestates.description'
    ])
    ->contain([
        'RealestateAttributes' => [
            'Attributes' => [
                'fields' => [
                    // Aliased fields in contain() must include
                    // the model prefix to be mapped correctly.
                    'Attributes__name' => 'attr_name',
                ],
            ],
        ],
    ])
    ->contain([
        'RealestateAttributes' => [
            'fields' => [
                'RealestateAttributes.realestate_id',
                'RealestateAttributes.value',
            ],
        ],
    ])
    ->where($condition);

If you need to reset the containments on a query you can set the second argument
to ``true``::

    $query = $articles->find();
    $query->contain(['Authors', 'Comments'], true);

.. note::

    Association names in ``contain()`` calls should use the same association casing as
    in your association definitions,  not the property name used to hold the association record(s).
    For example, if you have declared an association as ``belongsTo('Users')`` then you must
    use ``contain('Users')`` and not ``contain('users')`` or ``contain('user')``.


Passing Conditions to Contain
-----------------------------

When using ``contain()`` you are able to restrict the data returned by the
associations and filter them by conditions. To specify conditions, pass an anonymous
function that receives as the first argument a query object, ``\Cake\ORM\Query\SelectQuery``::

    // In a controller or table method.
    $query = $articles->find()->contain('Comments', function (SelectQuery $q) {
        return $q
            ->select(['body', 'author_id'])
            ->where(['Comments.approved' => true]);
    });

This also works for pagination at the Controller level::

    $this->paginate['contain'] = [
        'Comments' => function (SelectQuery $query) {
            return $query->select(['body', 'author_id'])
            ->where(['Comments.approved' => true]);
        }
    ];

.. warning::

    If the results are missing association entities, make sure the foreign key columns
    are selected in the query.  Without the foreign keys, the ORM cannot find matching rows.

It is also possible to restrict deeply-nested associations using the dot
notation::

    $query = $articles->find()->contain([
        'Comments',
        'Authors.Profiles' => function (SelectQuery $q) {
            return $q->where(['Profiles.is_published' => true]);
        }
    ]);

In the above example, you'll still get authors even if they don't have
a published profile. To only get authors with a published profile use
:ref:`matching() <filtering-by-associated-data>`. If you have defined custom
finders in your associations, you can use them inside ``contain()``::

    // Bring all articles, but only bring the comments that are approved and
    // popular.
    $query = $articles->find()->contain('Comments', function (SelectQuery $q) {
        return $q->find('approved')->find('popular');
    });

.. note::

    With ``BelongsTo`` and ``HasOne`` associations only ``select`` and ``where`` clauses
    are valid in the ``contain()`` query.  With ``HasMany`` and ``BelongsToMany`` all
    clauses such as ``order()`` are valid.

You can control more than just the query clauses used by ``contain()``.  If you pass an array
with the association, you can override the ``foreignKey``, ``joinType`` and ``strategy``.
See :doc:`/orm/associations` for details on the default value and options for each association
type.

You can pass ``false`` as the new ``foreignKey`` to disable foreign key constraints entirely.
Use the ``queryBuilder`` option to customize the query when using an array::

    $query = $articles->find()->contain([
        'Authors' => [
            'foreignKey' => false,
            'queryBuilder' => function (SelectQuery $q) {
                return $q->where(/* ... */); // Full conditions for filtering
            }
        ]
    ]);

If you have limited the fields you are loading with ``select()`` but also want to
load fields off of contained associations, you can pass the association object
to ``select()``::

    // Select id & title from articles, but all fields off of Users.
    $query = $articles->find()
        ->select(['id', 'title'])
        ->select($articles->Users)
        ->contain(['Users']);

Alternatively, you can use ``enableAutoFields()`` in an anonymous function::

    // Select id & title from articles, but all fields off of Users.
    $query = $articles->find()
        ->select(['id', 'title'])
        ->contain(['Users' => function(SelectQuery $q) {
            return $q->enableAutoFields();
        }]);

Sorting Contained Associations
------------------------------

When loading HasMany and BelongsToMany associations, you can use the ``sort``
option to sort the data in those associations::

    $query->contain([
        'Comments' => [
            'sort' => ['Comments.created' => 'DESC']
        ]
    ]);

.. end-contain

.. _filtering-by-associated-data:

Filtering by Associated Data Via Matching And Joins
===================================================

.. start-filtering

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

Filtering by deep associations uses the same predictable syntax from ``contain()``::

    // In a controller or table method.
    $query = $products->find()->matching(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

    // Bring unique articles that were commented by `markstory` using passed variable
    // Dotted matching paths should be used over nested matching() calls
    $username = 'markstory';
    $query = $articles->find()->matching('Comments.Users', function ($q) use ($username) {
        return $q->where(['username' => $username]);
    });

.. note::

    As this function will create an ``INNER JOIN``, you might want to consider
    calling ``distinct`` on the find query as you might get duplicate rows if
    your conditions don't exclude them already. This might be the case, for
    example, when the same users comments more than once on a single article.

The data from the association that is 'matched' will be available on the
``_matchingData`` property of entities. If both match and contain the same
association, you can expect to get both the ``_matchingData`` and standard
association properties in your results.

Using innerJoinWith
-------------------

Sometimes you need to match specific associated data but without actually
loading the matching records like ``matching()``. You can create just the
``INNER JOIN`` that ``matching()`` uses with ``innerJoinWith()``::

    $query = $articles->find();
    $query->innerJoinWith('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

``innerJoinWith()`` allows you to the same parameters and dot notation::

    $query = $products->find()->innerJoinWith(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

You can combine ``innerJoinWith()`` and ``contain()`` with the same association
when you want to match specific records and load the associated data together.
The example below matches Articles that have specific Tags and loads the same Tags::

    $filter = ['Tags.name' => 'CakePHP'];
    $query = $articles->find()
        ->distinct($articles->getPrimaryKey())
        ->contain('Tags', function (SelectQuery $q) use ($filter) {
            return $q->where($filter);
        })
        ->innerJoinWith('Tags', function (SelectQuery $q) use ($filter) {
            return $q->where($filter);
        });

.. note::
    If you use ``innerJoinWith()`` and want to ``select()`` fields from that association,
    you need to use an alias for the field::

        $query
            ->select(['country_name' => 'Countries.name'])
            ->innerJoinWith('Countries');

    If you don't use an alias, you will see the data in ``_matchingData`` as described
    by ``matching()`` above.  This is an edge case from ``matching()`` not knowing you
    manually selected the field.

.. warning::
    You should not combine ``innerJoinWith()`` and ``matching()`` with the same association.
    This will produce multiple ``INNER JOIN`` statements and might not create the query you
    expected.

Using notMatching
-----------------

The opposite of ``matching()`` is ``notMatching()``. This function will change
the query so that it filters results that have no relation to the specified
association::

    // In a controller or table method.

    $query = $articlesTable
        ->find()
        ->notMatching('Tags', function ($q) {
            return $q->where(['Tags.name' => 'boring']);
        });

The above example will find all articles that were not tagged with the word
``boring``.  You can apply this method to HasMany associations as well. You could,
for example, find all the authors with no published articles in the last 10
days::

    $query = $authorsTable
        ->find()
        ->notMatching('Articles', function ($q) {
            return $q->where(['Articles.created >=' => new \DateTime('-10 days')]);
        });

It is also possible to use this method for filtering out records not matching
deep associations. For example, you could find articles that have not been
commented on by a certain user::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        });

Since articles with no comments at all also satisfy the condition above, you may
want to combine ``matching()`` and ``notMatching()`` in the same query. The
following example will find articles having at least one comment, but not
commented by a certain user::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        })
        ->matching('Comments');

.. note::

    As ``notMatching()`` will create a ``LEFT JOIN``, you might want to consider
    calling ``distinct`` on the find query as you can get duplicate rows
    otherwise.

Keep in mind that contrary to the ``matching()`` function, ``notMatching()``
will not add any data to the ``_matchingData`` property in the results.

Using leftJoinWith
------------------

On certain occasions you may want to calculate a result based on an association,
without having to load all the records for it. For example, if you wanted to
load the total number of comments an article has along with all the article
data, you can use the ``leftJoinWith()`` function::

    $query = $articlesTable->find();
    $query->select(['total_comments' => $query->func()->count('Comments.id')])
        ->leftJoinWith('Comments')
        ->groupBy(['Articles.id'])
        ->enableAutoFields(true);

The results for the above query will contain the article data and the
``total_comments`` property for each of them.

``leftJoinWith()`` can also be used with deeply nested associations. This is
useful, for example, for bringing the count of articles tagged with a certain
word, per author::

    $query = $authorsTable
        ->find()
        ->select(['total_articles' => $query->func()->count('Articles.id')])
        ->leftJoinWith('Articles.Tags', function ($q) {
            return $q->where(['Tags.name' => 'awesome']);
        })
        ->groupBy(['Authors.id'])
        ->enableAutoFields(true);

This function will not load any columns from the specified associations into the
result set.

.. end-filtering

Changing Fetching Strategies
============================

As mentioned in earlier, you can customize the ``strategy``
used by an association in a ``contain()``.

If you look at ``BelongsTo`` and ``HasOne`` :doc:`association </orm/associations>`
options, the default 'join' strategy and 'INNER' ``joinType`` can be changed to
'select'::

    $query = $articles->find()->contain([
        'Comments' => [
            'strategy' => 'select',
        ]
    ]);

This can be useful when you need to add conditions that don't
work well in a join.  This also makes it possible to query tables
that are not allowed in joins such as separate databases.

Usually, you set the strategy for an association when defining it
in ``Table::initialize()``, but you can permanently change the strategy manually::

    $articles->Comments->setStrategy('select');

Fetching With The Subquery Strategy
-----------------------------------

As your tables grow in size, fetching associations from them can become
slower, especially if you are querying big batches at once. A good way of
optimizing association loading for ``hasMany`` and ``belongsToMany``
associations is by using the ``subquery`` strategy::

    $query = $articles->find()->contain([
        'Comments' => [
                'strategy' => 'subquery',
                'queryBuilder' => function ($q) {
                    return $q->where(['Comments.approved' => true]);
                }
        ]
    ]);

The result will remain the same as with using the default strategy, but this
can greatly improve the query and fetching time in some databases, in
particular it will allow to fetch big chunks of data at the same time in
databases that limit the amount of bound parameters per query, such as
**Microsoft SQL Server**.

Lazy Loading Associations
=========================

While CakePHP uses eager loading to fetch your associations, there may be cases
where you need to lazy-load associations. You should refer to the
:ref:`lazy-load-associations` and :ref:`loading-additional-associations`
sections for more information.

Working with Result Sets
========================

Once a query is executed with ``all()``, you will get an instance of
:php:class:`Cake\\ORM\\ResultSet`. This object offers powerful ways to manipulate
the resulting data from your queries. ResultSets are a :doc:`Collection </core-libraries/collections>`
and you can use any collection method on ResultSet objects.

Result set objects will lazily load rows from the underlying prepared statement.
By default results will be buffered in memory allowing you to iterate a result
set multiple times, or cache and iterate the results.

Result sets allow you to cache/serialize or JSON encode results for API
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

Result sets are a 'Collection' object and support the same methods that
:doc:`collection objects </core-libraries/collections>` do. For example, you can
extract a list of unique tags on a collection of articles by running::

    // In a controller or table method.
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

Some other examples of the collection methods being used with result sets are::

    // Filter the rows by a calculated property
    $filtered = $results->filter(function ($row) {
        return $row->is_recent;
    });

    // Create an associative array from result properties
    $results = $articles->find()->contain(['Authors'])->all();

    $authorList = $results->combine('id', 'author.name');

The :doc:`/core-libraries/collections` chapter has more detail on what can be
done with result sets using the collections features. The :ref:`format-results`
section show how you can add calculated fields, or replace the result set.

.. warning::

    When working with large data sets (especially when calling collection methods
    like ``extract()`` on the result set), you may encounter high memory usage
    due to the entire result set being buffered in memory.

    You can work around this issue by disabling results buffering for the query::

        $results = $articles->find()
            ->disableBufferedResults()
            ->all();

    Depending on your use case, you may also consider using disabling hydration::

        $results = $articles->find()
            ->disableHydration()
            ->all();

    The above will disable creation of entity objects and return rows as arrays instead.

Getting the First & Last Record From a ResultSet
------------------------------------------------

You can use the ``first()`` and ``last()`` methods to get the respective records
from a result set::

    $result = $articles->find('all')->all();

    // Get the first and/or last result.
    $row = $result->first();
    $row = $result->last();

Getting an Arbitrary Index From a ResultSet
-------------------------------------------

You can use ``skip()`` and ``first()`` to get an arbitrary record from
a ResultSet::

    $result = $articles->find('all')->all();

    // Get the 5th record
    $row = $result->skip(4)->first();

Checking if a ResultSet is Empty
-----------------------------------------

You can use the ``isEmpty()`` method on a ResultSet object to see if it
has any rows in it.::

    // Check results
    $results = $query->all();
    $results->isEmpty();

.. _loading-additional-associations:

Loading Additional Associations
-------------------------------

Once you've created a result set, you may need to load
additional associations. This is the perfect time to lazily eager load data. You
can load additional associations using ``loadInto()``::

    $articles = $this->Articles->find()->all();
    $withMore = $this->Articles->loadInto($articles, ['Comments', 'Users']);

It is possible to restrict the data returned by the associations and filter them
by conditions. To specify conditions, pass an anonymous function that receives
as the first argument a query object, ``\Cake\ORM\Query``::

    $user = $this->Users->get($id);
    $withMore = $this->Users->loadInto($user, ['Posts' => function (Query $query) {
        return $query->where(['Posts.status' => 'published']);
    }]);

You can eager load additional data into a single entity, or a collection of
entities.

.. _map-reduce:

Modifying Results with Map/Reduce
=================================

More often than not, find operations require post-processing the data that is
found in the database. While entities' getter methods can take care of most of
the virtual field generation or special data formatting, sometimes you
need to change the data structure in a more fundamental way.

For those cases, the ``SelectQuery`` object offers the ``mapReduce()`` method, which
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
``MapReduce`` instance. This method stores the article in the list of articles
labelled as either published or unpublished.

The next step in the map-reduce process is to consolidate the final results. For
each status created in the mapper, the ``$reducer`` function will be called so
you can do any extra processing. This function will receive the list of articles
in a particular "bucket" as the first parameter, the name of the "bucket" it
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
        ->mapReduce($mapper, $reducer)
        ->all();

    foreach ($articlesByStatus as $status => $articles) {
        echo sprintf("There are %d %s articles", count($articles), $status);
    }

The above will output the following lines::

    There are 4 published articles
    There are 5 unpublished articles

Of course, this is a simplistic example that could actually be solved in another
way without the help of a map-reduce process. Now, let's take a look at another
example in which the reducer function will be needed to do something more than
just emitting the results.

Calculating the most commonly mentioned words, where the articles contain
information about CakePHP, as usual we need a mapper function::

    $mapper = function ($article, $key, $mapReduce) {
        if (stripos($article['body'], 'cakephp') === false) {
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

    $wordCount = $articles->find()
        ->where(['published' => true])
        ->andWhere(['published_date >=' => new DateTime('2014-01-01')])
        ->disableHydration()
        ->mapReduce($mapper, $reducer)
        ->all()
        ->toArray();

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
        $mr->emitIntermediate($rel['target_user_id'], $rel['source_user_id']);
        $mr->emitIntermediate(-$rel['source_user_id'], $rel['target_user_id']);
    };

The intermediate array will be like the following::

    [
        1 => [2, 3, 4, 5, -3, -5],
        2 => [-1],
        3 => [-1, 1, 6],
        4 => [-1],
        5 => [-1, 1],
        6 => [-3],
        ...
    ]

Positive numbers mean that a user, indicated with the first-level key, is
following them, and negative numbers mean that the user is followed by them.

Now it's time to reduce it. For each call to the reducer, it will receive a list
of followers per user::

    $reducer = function ($friends, $user, $mr) {
        $fakeFriends = [];

        foreach ($friends as $friend) {
            if ($friend > 0 && !in_array(-$friend, $friends)) {
                $fakeFriends[] = $friend;
            }
        }

        if ($fakeFriends) {
            $mr->emit($fakeFriends, $user);
        }
    };

And we supply our functions to a query::

    $fakeFriends = $friends->find()
        ->disableHydration()
        ->mapReduce($mapper, $reducer)
        ->all()
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

Using ``mapReduce`` in a query will not execute it immediately. The operation will
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

    public function findPublished(SelectQuery $query)
    {
        return $query->where(['published' => true]);
    }

    public function findRecent(SelectQuery $query)
    {
        return $query->where(['created >=' => new DateTime('1 day ago')]);
    }

    public function findCommonWords(SelectQuery $query)
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

    $articles->find('commonWords')->mapReduce($mapper)->all();

Removing All Stacked Map-reduce Operations
------------------------------------------

Under some circumstances you may want to modify a ``SelectQuery`` object so that no
``mapReduce`` operations are executed at all. This can be done by
calling the method with both parameters as null and the third parameter
(overwrite) as ``true``::

    $query->mapReduce(null, null, true);
