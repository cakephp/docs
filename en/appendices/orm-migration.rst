New ORM Upgrade Guide
#####################

CakePHP 3.0 features a new ORM that has been re-written from the ground up.
While the ORM used in 1.x and 2.x has served us well for a long time it had
a few issues that we wanted to fix.

* Frankenstein - Is it a record, or a table? Currently it's both.
* Inconsistent API - Model::read() for example.
* No query object - Queries are always defined as arrays, this has some
  limitations and restrictions. For example it makes doing unions and
  sub-queries much harder.
* Returns arrays - This is a common complaint about CakePHP, and has probably
  reduced adoption at some levels.
* No record object - This makes attaching formatting methods
  difficult/impossible.
* Containable - Should be part of the ORM, not a crazy hacky behavior.
* Recursive - This should be better controlled as defining which associations
  are included, not a level of recursiveness.
* DboSource - It is a beast, and Model relies on it more than datasource.  That
  separation could be cleaner and simpler.
* Validation - Should be separate, it's a giant crazy function right now.  Making
  it a reusable bit would make the framework more extensible.

The ORM in CakePHP 3.0 solves these and many more problems. The new ORM
focuses on relational data stores right now. In the future and through plugins
we will add non relational stores like ElasticSearch and others.

Design of the New ORM
=====================

The new ORM solves several problems by having more specialized and focused
classes. In the past you would use ``Model`` and a Datasource for all
operations. Now the ORM is split into more layers:

* ``Cake\Database\Connection`` - Provides a platform independent way to create
  and use connections. This class provides a way to use transactions,
  execute queries and access schema data.
* ``Cake\Database\Dialect`` - The classes in this namespace provide platform
  specific SQL and transform queries to work around platform specific
  limitations.
* ``Cake\Database\Type`` - Is the gateway class to CakePHP database type
  conversion system. It is a pluggable framework for adding abstract column
  types and providing mappings between database,  PHP representations and PDO
  bindings for each data type. For example datetime columns are represented as
  ``DateTime`` instances in your code now.
* ``Cake\ORM\Table`` - The main entry point into the new ORM. Provides access
  to a single table. Handles the definition of association, use of behaviors and
  creation of entities and query objects.
* ``Cake\ORM\Behavior`` - The base class for behaviors, which act very similar
  to behaviors in previous versions of CakePHP.
* ``Cake\ORM\Query`` - A fluent object based query builder that replaces
  the deeply nested arrays used in previous versions of CakePHP.
* ``Cake\ORM\ResultSet`` - A collection of results that gives powerful tools
  for manipulating data in aggregate.
* ``Cake\ORM\Entity`` - Represents a single row result. Makes accessing data
  and serializing to various formats a snap.

Now that you are more familiar with some of the classes you'll interact with
most frequently in the new ORM it is good to look at the three most important
classes. The ``Table``, ``Query`` and ``Entity`` classes do much of the heavy
lifting in the new ORM, and each serves a different purpose.

Table Objects
-------------

Table objects are the gateway into your data. They handle many of the tasks that
``Model`` did in previous releases. Table classes handle tasks like:

- Creating queries.
- Providing finders.
- Validating and saving entities.
- Deleting entities.
- Defining and accessing associations.
- Triggering callback events.
- Interacting with behaviors.

The documentation chapter on :doc:`/orm/table-objects` provides far more detail
on how to use table objects than this guide can. Generally when moving existing
model code over it will end up in a table object. Table objects don't contain
any platform dependent SQL. Instead they collaborate with entities and the query
builder to do their work. Table objects also interact with behaviors and other
interested parties through published events.

Query Objects
-------------

While these are not classes you will build yourself, your application code will
make extensive use of the :doc:`/orm/query-builder` which is central to the new
ORM. The query builder makes it easy to build simple or complex queries
including those that were previously very difficult in CakePHP like ``HAVING``,
``UNION`` and sub-queries.

The various find() calls your application has currently will need to be updated
to use the new query builder. The Query object is responsible for containing the
data to make a query without executing the query itself. It collaborates with
the connection/dialect to generate platform specific SQL which is executed
creating a ``ResultSet`` as the output.

Entity Objects
--------------

In previous versions of CakePHP the ``Model`` class returned dumb arrays that
could not contain any logic or behavior. While the community made this
short-coming less painful with projects like CakeEntity, the array results were
often a short coming that caused many developers trouble. For CakePHP 3.0, the
ORM always returns object result sets unless you explicitly disable that
feature. The chapter on :doc:`/orm/entities` covers the various tasks you can
accomplish with entities.

Entities are created in one of two ways. Either by loading data from the
database, or converting request data into entities. Once created, entities allow
you to manipulate the data they contain and persist their data by collaborating
with table objects.

Key Differences
===============

The new ORM is a large departure from the existing ``Model`` layer. There are
many important differences that are important in understanding how the new ORM
operates and how to update your code.

Inflection Rules Updated
------------------------

You may have noticed that table classes have a pluralized name. In addition to
tables having pluralized names, associations are also referred in the plural
form. This is in contrast to ``Model`` where class names and association aliases
were singular. There are a few reasons for this change:

* Table classes represent **collections** of data, not single rows.
* Associations link tables together, describing the relations between many
  things.

While the conventions for table objects are to always use plural forms, your
entity association properties will be populated based on the association type.

.. note::

    BelongsTo and HasOne associations will use the singular form in entity
    properties, while HasMany and BelongsToMany (HABTM) will use plural forms.

The convention change for table objects is most apparent when building queries.
Instead of expressing queries like::

    // Wrong
    $query->where(['User.active' => 1]);

You need to use the plural form::

    // Correct
    $query->where(['Users.active' => 1]);

Find returns a Query Object
---------------------------

One important difference in the new ORM is that calling ``find`` on a table will
not return the results immediately, but will return a Query object; this serves
several purposes.

It is possible to alter queries further, after calling ``find``::

    $articles = TableRegistry::get('Articles');
    $query = $articles->find();
    $query->where(['author_id' => 1])->order(['title' => 'DESC']);

It is possible to stack custom finders to append conditions, sorting, limit and
any other clause to the same query before it is executed::

    $query = $articles->find('approved')->find('popular');
    $query->find('latest');

You can compose queries one into the other to create subqueries easier than
ever::

    $query = $articles->find('approved');
    $favoritesQuery = $article->find('favorites', ['for' => $user]);
    $query->where(['id' => $favoritesQuery->select(['id'])]);

You can decorate queries with iterators and call methods without even touching
the database. This is great when you have parts of your view cached and having
the results taken from the database is not actually required::

    // No queries made in this example!
    $results = $articles->find()
        ->order(['title' => 'DESC'])
        ->formatResults(function ($results) {
            return $results->extract('title');
        });

Queries can be seen as the result object, trying to iterate the query, calling
``toArray()`` or any method inherited from :doc:`collection </core-libraries/collections>`,
will result in the query being executed and results returned to you.

The biggest difference you will find when coming from CakePHP 2.x is that
``find('first')`` does not exist anymore. There is a trivial replacement for it,
and it is the ``first()`` method::

    // Before
    $article = $this->Article->find('first');

    // Now
    $article = $this->Articles->find()->first();

    // Before
    $article = $this->Article->find('first', [
        'conditions' => ['author_id' => 1]
    ]);

    // Now
    $article = $this->Articles->find('all', [
        'conditions' => ['author_id' => 1]
    ])->first();

    // Can also be written
    $article = $this->Articles->find()
        ->where(['author_id' => 1])
        ->first();

If you are loading a single record by its primary key, it will be better to
just call ``get()``::

    $article = $this->Articles->get(10);

Finder Method Changes
---------------------

Returning a query object from a find method has several advantages, but comes at
a cost for people migrating from 2.x. If you had some custom find methods in
your models, they will need some modifications. This is how you create custom
finder methods in 3.0::

    class ArticlesTable
    {

        public function findPopular(Query $query, array $options)
        {
            return $query->where(['times_viewed' > 1000]);
        }

        public function findFavorites(Query $query, array $options)
        {
            $for = $options['for'];
            return $query->matching('Users.Favorites', function ($q) use ($for) {
                return $q->where(['Favorites.user_id' => $for]);
            });
        }
    }

As you can see, they are pretty straightforward, they get a Query object instead
of an array and must return a Query object back. For 2.x users that implemented
afterFind logic in custom finders, you should check out the :ref:`map-reduce`
section, or use the features found on the
:doc:`collection objects </core-libraries/collections>`. If in your
models you used to rely on having an afterFind for all find operations you can
migrate this code in one of a few ways:

1. Override your entity constructor method and do additional formatting there.
2. Create accessor methods in your entity to create the virtual properties.
3. Redefine ``findAll()`` and use ``formatResults``.

In the 3rd case above your code would look like::

    public function findAll(Query $query, array $options)
    {
        return $query->formatResults(function ($results) {
            return $results->map(function ($row) {
                // Your afterfind logic
            });
        })
    }

You may have noticed that custom finders receive an options array. You can pass
any extra information to your finder using this parameter. This is great
news for people migrating from 2.x. Any of the query keys that were used in
previous versions will be converted automatically for you in 3.x to the correct
functions::

    // This works in both CakePHP 2.x and 3.0
    $articles = $this->Articles->find('all', [
        'fields' => ['id', 'title'],
        'conditions' => [
            'OR' => ['title' => 'Cake', 'author_id' => 1],
            'published' => true
        ],
        'contain' => ['Authors'], // The only change! (notice plural)
        'order' => ['title' => 'DESC'],
        'limit' => 10,
    ]);

If your application uses 'magic' or :ref:`dynamic-finders`, you will have to
adapt those calls. In 3.x the ``findAllBy*`` methods have been removed, instead
``findBy*`` always returns a query object. To get the first result, you need to
use the ``first()`` method::

    $article = $this->Articles->findByTitle('A great post!')->first();

Hopefully, migrating from older versions is not as daunting as it first seems.
Many of the features we have added will help you remove code as you can better
express your requirements using the new ORM and at the same time the
compatibility wrappers will help you rewrite those tiny differences in a fast
and painless way.

One of the other nice improvements in 3.x around finder methods is that
behaviors can implement finder methods with no fuss. By simply defining a method
with a matching name and signature on a Behavior the finder will automatically
be available on any tables the behavior is attached to.

Recursive and ContainableBehavior Removed
-----------------------------------------

In previous versions of CakePHP you needed to use ``recursive``,
``bindModel()``, ``unbindModel()`` and ``ContainableBehavior`` to reduce the
loaded data to the set of associations you were interested in. A common tactic
to manage associations was to set ``recursive`` to ``-1`` and use Containable to
manage all associations. In CakePHP 3.0 ContainableBehavior, recursive,
bindModel, and unbindModel have all been removed. Instead the ``contain()``
method has been promoted to be a core feature of the query builder. Associations
are only loaded if they are explicitly turned on. For example::

    $query = $this->Articles->find('all');

Will **only** load data from the ``articles`` table as no associations have been
included. To load articles and their related authors you would do::

    $query = $this->Articles->find('all')->contain(['Authors']);

By only loading associated data that has been specifically requested you spend
less time fighting the ORM trying to get only the data you want.

No afterFind Event or Virtual Fields
------------------------------------

In previous versions of CakePHP you needed to make extensive use of the
``afterFind`` callback and virtual fields in order to create generated data
properties. These features have been removed in 3.0. Because of how ResultSets
iteratively generate entities, the ``afterFind`` callback was not possible.
Both afterFind and virtual fields can largely be replaced with virtual
properties on entities. For example if your User entity has both first and last
name columns you can add an accessor for `full_name` and generate the property
on the fly::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {
        protected function _getFullName()
        {
            return $this->first_name . '  ' . $this->last_name;
        }
    }

Once defined you can access your new property using ``$user->full_name``.
Using the :ref:`map-reduce` features of the ORM allow you to build aggregated
data from your results, which is another use case that the ``afterFind``
callback was often used for.

While virtual fields are no longer an explicit feature of the ORM, adding
calculated fields is easy to do in your finder methods. By using the query
builder and expression objects you can achieve the same results that virtual
fields gave::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ReviewsTable extends Table
    {
        public function findAverage(Query $query, array $options = [])
        {
            $avg = $query->func()->avg('rating');
            $query->select(['average' => $avg]);
            return $query;
        }
    }

Associations No Longer Defined as Properties
--------------------------------------------

In previous versions of CakePHP the various associations your models had were
defined in properties like ``$belongsTo`` and ``$hasMany``. In CakePHP 3.0,
associations are created with methods. Using methods allows us to sidestep the
many limitations class definitions have, and provide only one way to define
associations. Your ``initialize()`` method and all other parts of your application
code, interact with the same API when manipulating associations::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;

    class ReviewsTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Movies');
            $this->hasOne('Ratings');
            $this->hasMany('Comments')
            $this->belongsToMany('Tags')
        }

    }

As you can see from the example above each of the association types uses
a method to create the association. One other difference is that
``hasAndBelongsToMany`` has been renamed to ``belongsToMany``. To find out more
about creating associations in 3.0 see the section on :doc:`/orm/associations`.

Another welcome improvement to CakePHP is the ability to create your own
association classes. If you have association types that are not covered by the
built-in relation types you can create a custom ``Association`` sub-class and
define the association logic you need.

Validation No Longer Defined as a Property
------------------------------------------

Like associations, validation rules were defined as a class property in previous
versions of CakePHP. This array would then be lazily transformed into
a ``ModelValidator`` object. This transformation step added a layer of
indirection, complicating rule changes at runtime. Furthermore, validation rules
being defined as a property made it difficult for a model to have multiple sets
of validation rules. In CakePHP 3.0, both these problems have been remedied.
Validation rules are always built with a ``Validator`` object, and it is trivial
to have multiple sets of rules::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\Query;
    use Cake\Validation\Validator;

    class ReviewsTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            $validator->requirePresence('body')
                ->add('body', 'length', [
                    'rule' => ['minLength', 20],
                    'message' => 'Reviews must be 20 characters or more',
                ])
                ->add('user_id', 'numeric', [
                    'rule' => 'numeric'
                ]);
            return $validator;
        }

    }

You can define as many validation methods as you need. Each method should be
prefixed with ``validation`` and accept a ``$validator`` argument.

In previous versions of CakePHP 'validation' and the related callbacks covered
a few related but different uses. In CakePHP 3.0, what was formerly called
validation is now split into two concepts:

#. Data type and format validation.
#. Enforcing application, or business rules.

Validation is now applied before ORM entities are created from request data.
This step lets you ensure data matches the data type, format, and basic shape
your application expects. You can use your validators when converting request
data into entities by using the ``validate`` option. See the documentation on
:ref:`converting-request-data` for more information.

:ref:`Application rules <application-rules>` allow you to define rules that
ensure your application's rules, state and workflows are enforced. Rules are
defined in your Table's ``buildRules()`` method. Behaviors can add rules using
the ``buildRules()`` hook method. An example ``buildRules()`` method for our
articles table could be::

    // In src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\ORM\RulesChecker;

    class ArticlesTable extends Table
    {
        public function buildRules(RulesChecker $rules)
        {
            $rules->add($rules->existsIn('user_id', 'Users'));
            $rules->add(
                function ($article, $options) {
                    return ($article->published && empty($article->reviewer));
                },
                'isReviewed',
                [
                    'errorField' => 'published',
                    'message' => 'Articles must be reviewed before publishing.'
                ]
            );
            return $rules;
        }
    }

Identifier Quoting Disabled by Default
--------------------------------------

In the past CakePHP has always quoted identifiers. Parsing SQL snippets and
attempting to quote identifiers was both error prone and expensive. If you are
following the conventions CakePHP sets out, the cost of identifier quoting far
outweighs any benefit it provides. Because of this identifier quoting has been
disabled by default in 3.0. You should only need to enable identifier quoting if
you are using column names or table names that contain special characters or are
reserved words. If required, you can enable identifier quoting when configuring
a connection::

    // In config/app.php
    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Driver\Mysql',
            'username' => 'root',
            'password' => 'super_secret',
            'host' => 'localhost',
            'database' => 'cakephp',
            'quoteIdentifiers' => true
        ]
    ],

.. note::

    Identifiers in ``QueryExpression`` objects will not be quoted, and you will
    need to quote them manually or use IdentifierExpression objects.

Updating Behaviors
==================

Like most ORM related features, behaviors have changed in 3.0 as well. They now
attach to ``Table`` instances which are the conceptual descendant of the
``Model`` class in previous versions of CakePHP. There are a few key
differences from behaviors in CakePHP 2.x:

- Behaviors are no longer shared across multiple tables. This means you no
  longer have to 'namespace' settings stored in a behavior. Each table using
  a behavior will get its own instance.
- The method signatures for mixin methods have changed.
- The method signatures for callback methods have changed.
- The base class for behaviors have changed.
- Behaviors can add finder methods.

New Base Class
--------------

The base class for behaviors has changed. Behaviors should now extend
``Cake\ORM\Behavior``; if a behavior does not extend this class an exception
will be raised. In addition to the base class changing, the constructor for
behaviors has been modified, and the ``startup()`` method has been removed.
Behaviors that need access to the table they are attached to should define
a constructor::

    namespace App\Model\Behavior;

    use Cake\ORM\Behavior;

    class SluggableBehavior extends Behavior
    {

        protected $_table;

        public function __construct(Table $table, array $config)
        {
            parent::__construct($table, $config);
            $this->_table = $table;
        }

    }

Mixin Methods Signature Changes
-------------------------------

Behaviors continue to offer the ability to add 'mixin' methods to Table objects,
however the method signature for these methods has changed. In CakePHP 3.0,
behavior mixin methods can expect the **same** arguments provided to the table
'method'. For example::

    // Assume table has a slug() method provided by a behavior.
    $table->slug($someValue);

The behavior providing the ``slug()`` method will receive only 1 argument, and its
method signature should look like::

    public function slug($value)
    {
        // Code here.
    }

Callback Method Signature Changes
---------------------------------

Behavior callbacks have been unified with all other listener methods. Instead of
their previous arguments, they need to expect an event object as their first
argument::

    public function beforeFind(Event $event, Query $query, array $options)
    {
        // Code.
    }

See :ref:`table-callbacks` for the signatures of all the callbacks a behavior
can subscribe to.
