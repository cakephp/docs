Table Objects
#############

.. php:namespace:: Cake\ORM

.. php:class:: Table

Table objects provide access to the collection of entities stored in a specific
table. Each table in your application should have an associated Table class
which is used to interact with a given table. If you do not need to customize
the behavior of a given table CakePHP will generate a Table instance for you to
use.

Before trying to use Table objects and the ORM, you should ensure that you have
configured your :ref:`database connection <database-configuration>`.

Basic Usage
===========

To get started, create a Table class. These classes live in
``src/Model/Table``. Tables are a type model collection specific to relational
databases, and the main interface to your database in CakePHP's ORM. The most
basic table class would look like::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
    }

Note that we did not tell the ORM which table to use for our class. By
convention table objects will use a table that matches the lower cased and
underscored version of the class name. In the above example the ``articles``
table will be used. If our table class was named ``BlogPosts`` your table should
be named ``blog_posts``. You can specify the table to using the ``table()``
method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function initialize(array $config) {
            $this->table('my_table');
        }

    }

No inflection conventions will be applied when specifying a table. By convention
the ORM also expects each table to have a primary key with the name of ``id``.
If you need to modify this you can use the ``primaryKey()`` method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->primaryKey('my_id');
        }
    }

Customizing the Entity Class a Table Uses
-----------------------------------------

By default table objects use an entity class based on naming conventions. For
example if your table class is called ``ArticlesTable`` the entity would be
``Article``. If the table class was ``PurchaseOrdersTable`` the entity would be
``PurchaseOrder``. If however, you want to use an entity that doesn't follow the
conventions you can use the ``entityClass`` method to change things up::

    class PurchaseOrdersTable extends Table {
        public function initialize(array $config) {
            $this->entityClass('App\Model\PO');
        }
    }

As seen in the examples above Table objects have an ``initialize()`` method
which is called at the end of the constructor. It is recommended that you use
this method to do initialization logic instead of overriding the constructor.

Getting Instances of a Table Class
----------------------------------

Before you can query a table, you'll need to get an instance of the table. You
can do this by using the ``TableRegistry`` class::

    // In a controller or table method.
    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

The TableRegistry class provides the various dependencies for constructing
a table, and maintains a registry of all the constructed table instances making
it easier to build relations and configure the ORM. See
:ref:`table-registry-usage` for more information.

Loading Entities
================

While table objects provide an abstraction around a 'repository' or collection of
objects, when you query for individual records you get 'entity' objects. While
this section discusses the different ways you can find and load entities, you
should read the :doc:`/orm/entities` section for more information on entities.

Getting a Single Entity by Primary Key
--------------------------------------

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
a ``Cake\ORM\Exception\RecordNotFoundException`` will be raised. You can either
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


Fetching All Entities
---------------------

The best way to fetch entities from a table object is to use the ``find`` method. It
allows you to access the various built-in finder methods and your own custom
ones. See :ref:`custom-find-methods` for more information::

    // In a controller or table method.
    $query = $articles->find('all');
    foreach ($query as $row) {
        // Do work
    }

Entity objects represent a single record or row in your database. Entities allow
you to define custom behavior on a per-record basis and model the domain of your
application. See the :doc:`/orm/entities` documentation for more information on
creating your entity objects.

Using Finders to Load Data
--------------------------

.. php:method:: find($type, $options = [])

Before you can work with entities, you'll need to load them. The easiest way to
do this is using the ``find`` method. The find method provides an easy and
extensible way to find the data you are interested in::

    // In a controller or table method.

    // Find all the articles
    $query = $articles->find('all');

The return value of any ``find`` method is always
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

    // Converting the query to an array will execute it.
    $results = $query->toArray();

Once you've started a query you can use the :doc:`/orm/query-builder` interface
to build more complex queries, adding additional conditions, limits, or include
associations using the fluent interface::

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
``getOptions`` method on a query object to retrieve the options used.

.. _table-find-first:

Getting the First Result
------------------------

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
--------------------------

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
-----------------------

It is often useful to generate an associative array of data from your application's
data. For example, this is very useful when creating `<select>` elements. CakePHP
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
``displayField()`` method on a table object to configure the display field on
a table::

    class ArticlesTable extends Table {

        public function initialize(array $config) {
            $this->displayField('title');
        }
    }

When calling ``list`` you can configure the fields used for the key and value with
the ``idField`` and ``valueField`` options respectively::

    // In a controller or table method.
    $query = $articles->find('list', [
        'idField' => 'slug', 'valueField' => 'title'
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
        'idField' => 'slug',
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

Finding Threaded Data
---------------------

The ``find('threaded')`` finder returns nested entities that are threaded
together through a key field. By default this field is ``parent_id``. This
finder allows you to easily access data stored in an 'adjacency list' style
table. All entities matching a given ``parent_id`` are placed under the
``children`` attribute::

    // In a controller or table method.
    $query = $comments->find('threaded');

    // Expanded default values
    $query = $comments->find('threaded', [
        'idField' => $comments->primaryKey(),
        'parentField' => 'parent_id'
    ]);
    $results = $query->toArray();

    echo count($results[0]->children);
    echo $results[0]->children[0]->comment;

The ``parentField`` and ``idField`` keys can be used to define the fields that
threading will occur on.

.. tip::
    If you need to manage more advanced trees of data, consider using
    :doc:`/orm/behaviors/tree` instead.

.. _custom-find-methods:

Custom Finder Methods
---------------------

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

    class ArticlesTable extends Table {

        public function findPublished(Query $query, array $options) {
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
---------------

CakePHP's ORM provides dynamically constructed finder methods which allow you to
easily express simple queries with no additional code. For example if you wanted
to find a user by username you could do::

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


Eager Loading Associations
--------------------------

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
                return $q->where(...) // Full conditions for filtering
            }
        ]
    ]);

If you have limited the fields you are loading with ``select()`` but also want to
load fields off of contained associations, you can use ``autoFields()``::

    // Select id & title from articles, but all fields off of Users.
    $query->select(['id', 'title'])
        ->contain(['Users'])
        ->autoFields(true);

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
            return $q->where(['Country.name' => 'Japan'])
        }
    );

    // Bring unique articles that were commented by 'markstory' using passed variable
    $username = 'markstory';
    $query = $articles->find()->matching('Comments.Users', function ($q) use ($username) {
        return $q->where(['username' => $username])
    });

.. note::

    As this function will create an ``INNER JOIN``, you might want to consider
    calling ``distinct`` on the find query as you might get duplicate rows if
    your conditions don't filter them already. This might be the case, for example,
    when the same users comments more than once on a single article.

.. end-contain

Lazy Loading Associations
-------------------------

While CakePHP makes it easy to eager load your associations, there may be cases
where you need to lazy-load associations. You should refer to the
:ref:`lazy-load-associations` section for more information.

Working with Result Sets
------------------------

Once a query is executed with ``all()``, you will get an instance of
:php:class:`Cake\\ORM\ResultSet`. This object offers powerful ways to manipulate
the resulting data from your queries.

Result set objects will lazily load rows from the underlying prepared statement.
By default results will be buffered in memory allowing you to iterate a result
set multiple times, or cache and iterate the results. If you need to disable
buffering because you are working with a data set that does not fit into memory you
can disable buffering on the query to stream results::

    $query->bufferResults(false);

.. warning::

    Streaming results is not possible when using SQLite, or queries with eager
    loaded hasMany or belongsToMany associations.

Result sets allow you to easily cache/serialize or JSON encode results for API results::

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

.. _table-callbacks:

Lifecycle Callbacks
===================

As you have seen above table objects trigger a number of events. Events are
useful if you want to hook into the ORM and add logic in without subclassing or
overriding methods. Event listeners can be defined in table or behavior classes.
You can also use a table's event manager to bind listeners in.

When using callback methods behaviors attached in the
``initialize`` method will have their listeners fired **before** the table
callback methods are triggered. This follows the same sequencing as controllers
& components.

To add an event listener to a Table class or Behavior simply implement the
method signatures as described below. See the :doc:`/core-libraries/events` for
more detail on how to use the events subsystem.

beforeFind
----------

.. php:method:: beforeFind(Event $event, Query $query, ArrayObject $options, boolean $primary)

The ``Model.beforeFind`` event is fired before each find operation. By stopping
the event and supplying a return value you can bypass the find operation
entirely. Any changes done to the $query instance will be retained for the rest
of the find. The ``$primary`` parameter indicates whether or not this is the root
query, or an associated query. All associations participating in a query will
have a ``Model.beforeFind`` event triggered. For associations that use joins,
a dummy query will be provided. In your event listener you can set additional
fields, conditions, joins or result formatters. These options/features will be
copied onto the root query.

You might use this callback to restrict find operations based on a user's role,
or make caching decisions based on the current load.

In previous versions of CakePHP there was an ``afterFind`` callback, this has
been replaced with the :ref:`map-reduce` features and entity constructors.

beforeValidate
--------------

.. php:method:: beforeValidate(Event $event, Entity $entity, ArrayObject $options, Validator $validator)

The ``Model.beforeValidate`` method is fired before an entity is validated. By
stopping this event, you can abort the validate + save operations.

afterValidate
-------------

.. php:method:: afterValidate(Event $event, Entity $entity, ArrayObject $options, Validator $validator)

The ``Model.afterValidate`` event is fired after an entity is validated.

beforeSave
----------

.. php:method:: beforeSave(Event $event, Entity $entity, ArrayObject $options)

The ``Model.beforeSave`` event is fired before each entity is saved. Stopping
this event will abort the save operation. When the event is stopped the result
of the event will be returned.

afterSave
---------

.. php:method:: afterSave(Event $event, Entity $entity, ArrayObject $options)

The ``Model.afterSave`` event is fired after an entity is saved.

beforeDelete
------------

.. php:method:: beforeDelete(Event $event, Entity $entity, ArrayObject $options)

The ``Model.beforeDelete`` event is fired before an entity is deleted. By
stopping this event you will abort the delete operation.

afterDelete
-----------

.. php:method:: afterDelete(Event $event, Entity $entity, ArrayObject $options)

Fired after an entity has been deleted.

Behaviors
=========

.. php:method:: addBehavior($name, $config = [])

.. start-behaviors

Behaviors provide an easy way to create horizontally re-usable pieces of logic
related to table classes. You may be wondering why behaviors are regular classes
and not traits. The primary reason for this is event listeners. While traits
would allow for re-usable pieces of logic, they would complicate binding events.

To add a behavior to your table you can call the ``addBehavior`` method.
Generally the best place to do this is in the ``initialize`` method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Timestamp');
        }
    }

As with associations, you can use :term:`plugin syntax` and provide additional
configuration options::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'modified_at' => 'always'
                    ]
                ]
            ]);
        }
    }

.. end-behaviors

You can find out more about behaviors, including the behaviors provided by
CakePHP in the chapter on :doc:`/orm/behaviors`.

.. _configuring-table-connections:

Configuring Connections
=======================

By default all table instances use the ``default`` database connection. If your
application uses multiple database connections you will want to configure which
tables use which connections. This is the ``defaultConnectionName`` method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public static function defaultConnectionName() {
            return 'slavedb';
        }
    }

.. note::

    The ``defaultConnectionName`` method **must** be static.

.. _table-registry-usage:

Using the TableRegistry
=======================

.. php:class:: TableRegistry

As we've seen earlier, the TableRegistry class provides an easy to use
factory/registry for accessing your applications table instances. It provides a
few other useful features as well.

Configuring Table Objects
-------------------------

.. php:staticmethod:: get($alias, $config)

When loading tables from the registry you can customize their dependencies, or
use mock objects by providing an ``$options`` array::

    $articles = TableRegistry::get('Articles', [
        'className' => 'App\Custom\ArticlesTable',
        'table' => 'my_articles',
        'connection' => $connection,
        'schema' => $schemaObject,
        'entityClass' => 'Custom\EntityClass',
        'eventManager' => $eventManager,
        'behaviors' => $behaviorRegistry
    ]);

.. note::

    If your table also does additional configuration in its ``initialize()`` method,
    those values will overwrite the ones provided to the registry.

You can also pre-configure the registry using the ``config()`` method.
Configuration data is stored *per alias*, and can be overridden by an object's
``initialize()`` method::

    TableRegistry::config('Users', ['table' => 'my_users']);

.. note::

    You can only configure a table before or during the **first** time you
    access that alias. Doing it after the registry is populated will have no
    effect.

Flushing the Registry
---------------------

.. php:staticmethod:: clear()

During test cases you may want to flush the registry. Doing so is often useful
when you are using mock objects, or modifying a table's dependencies::

    TableRegistry::clear();

