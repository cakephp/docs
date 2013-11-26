.. _table-objects:

.. php:namespace:: Cake\ORM

Table objects
#############

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
``App/Model/Repository``. Tables are a type of repository specific to relational
databases, and the main interface to your database in CakePHP's ORM. The most
basic table class would look like::

    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
    }

Note that we did not tell the ORM which table to use for our class. By
convention table objects will use a table that matches the lower cased and
underscored version of the class name. In the above example the ``articles``
table will be used. If our table class was named ``BlogPosts`` you table should
be named ``blog_posts``. You can specify the table to using the ``table()``
method::

    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function intitalize(array $config) {
            $this->table('my_table');
        }

    }

No inflection conventions will be applied when specifying a table. By convention
the ORM also expects each table to have a primary key with the name of ``id``.
If you need to modify this you can use the ``primaryKey()`` method::

    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->primaryKey('my_id');
        }
    }

As seen in the examples above Table objects have an ``initialize()`` method
which is called at the end of the constructor. It is recommended that you use
this method to do initialization logic instead of overriding the constructor.

Getting instances of a table class
----------------------------------

Before you can query a table, you'll need to get an instance of the table. You
and do this by using the ``TableRegistry`` class::

    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

The TableRegistry class provides the various dependencies for constructing
a table, and maintains a registry of all the constructed Table instances making
it easier to build relations and configure the ORM. See
:ref:`table-registry-usage` for more information.

Fetching all entities
---------------------

The best way to fetch entities from a table object is to use the ``find`` method. It
allows you to access the various built-in finder methods and your own custom
ones. See :ref:`custom-find-methods` for more information::

    $query = $articles->find('all');
    foreach ($query as $row) {
        // Do work
    }

Entity objects represent a single record or row in your database. Entities allow
you to define custom behavior on a per-record basis and model the domain of your
application. See the :doc:`/orm/entities` documentation for more information on
creating and customizing your entity objects.

Building associations
=====================

Defining relations between different objects in your application should be
a natural process. For example, an article may have many comments, and belong
to a author. Authors may have many articles and comments. CakePHP makes
managing these associations easy. The four association types in CakePHP are:
hasOne, hasMany, belongsTo, and belongsToMany.

============= ===================== =======================================
Relationship  Association Type      Example
============= ===================== =======================================
one to one    hasOne                A user has one profile.
------------- --------------------- ---------------------------------------
one to many   hasMany               A user can have multiple articles.
------------- --------------------- ---------------------------------------
many to one   belongsTo             Many articles belong to a user.
------------- --------------------- ---------------------------------------
many to many  belongsToMany         Tags belong to many Articles.
============= ===================== =======================================

Associations are defined during the ``inititalize()`` method of your table
object. Methods matching the association type allow you to define the
associations in your application. For example if we wanted to define a belongsTo
association in our ArticlesTable::

    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function intitalize(array $config) {
            $this->belongsTo('Authors');
        }

    }

The simplest form of any association setup takes the table alias you want to
associate with. By default all of the details of an association will use the
CakePHP conventions. If you want to customize how your associations are handled
you can do so with the second parameter::

    class ArticlesTable extends Table {

        public function intitalize(array $config) {
            $this->belongsTo('Authors', [
                'className' => 'Publishing.Authors',
                'foreignKey' => 'authorid',
                'property' => 'person'
            ]);
        }

    }

HasOne associations
-------------------

Let's set up a User model with a hasOne relationship to an Address Table.

First, your database tables need to be keyed correctly. For a hasOne
relationship to work, one table has to contain a foreign key that points to
a record in the other. In this case the addresses table will contain a field
called ``user_id``. The basic pattern is:

**hasOne:** the *other* model contains the foreign key.

====================== ==================
Relation               Schema
====================== ==================
Users hasOne Addresses addresses.user\_id
---------------------- ------------------
Doctors hasOne Mentors mentors.doctor\_id
====================== ==================

.. note::

    It is not mandatory to follow CakePHP conventions, you can easily override
    the use of any foreignKey in your associations definitions. Nevertheless sticking
    to conventions will make your code less repetitive, easier to read and to maintain.

If we had the ``UsersTable`` and ``AddressesTable`` classes made we could make
the association with the following code::

    class UsersTable extends Table {
        public function initialize(array $config) {
            $this->hasOne('Addresses');
        }
    }

If you need more control, you can define your associations using
array syntax. For example, you might want to limit the association
to include only certain records::

    class UsersTable extends Table {
        public function initialize(array $config) {
            $this->hasOne('Addresses', [
                'className' => 'Profiles',
                'conditions' => ['Addresses.primary' => '1'],
                'dependent' => true
            ]);
        }
    }

Possible keys for hasOne association arrays include:

- **className**: the class name of the table being associated to
  the current model. If you're defining a 'User hasOne Address'
  relationship, the className key should equal 'Addresses.'
- **foreignKey**: the name of the foreign key found in the other
  model. This is especially handy if you need to define multiple
  hasOne relationships. The default value for this key is the
  underscored, singular name of the current model, suffixed with
  '\_id'. In the example above it would default to 'user\_id'.
- **conditions**: an array of find() compatible conditions
  such as ``['Addresses.primary' => true]``
- **joinType**: the type of the join to use in the SQL query, default
  is INNER. You may want to use LEFT if your hasOne association is optional.
- **dependent**: When the dependent key is set to true, and an
  entity is deleted, the associated model records are also deleted. In this
  case we set it true so that deleting a User will also delete her associated
  Address.
- **cascadeCallbacks**: When this and **dependent** are true, cascaded deletes will
  load and delete entities so that callbacks are properly triggered. When false,
  ``deleteAll()`` is used to remove associated data and no callbacks are
  triggered.
- **property**: The property name that should be filled with data from the associated
  table into the source table results. By default this is the underscored & singular name of
  the association so ``address`` in our example.

Once this association has been defined, find operations on the Users table can
contain the Address record if it exists::

    $query = $users->find('all')->contain(['Addresses']);
    foreach ($query as $user) {
        echo $user->address->street;
    }

The above would emit SQL that is similar to::

    SELECT * FROM users INNER JOIN addresses ON addresses.user_id = users.id;

BelongsTo associations
----------------------

Now that we have Address data access from the User table, let's
define a belongsTo association in the Addresses table in order to get
access to related User data. The belongsTo association is a natural
complement to the hasOne and hasMany associations.

When keying your database tables for a belongsTo relationship,
follow this convention:

**belongsTo:** the *current* model contains the foreign key.

========================= ==================
Relation                  Schema
========================= ==================
Addresses belongsTo Users addresses.user\_id
------------------------- ------------------
Mentors belongsTo Doctors mentors.doctor\_id
========================= ==================

.. tip::

    If a Table contains a foreign key, it belongs to the other
    Table.

We can define the belongsTo association in our Addresses table as follows::

    class Addresses extends Table {

        public function intitalize(array $config) {
            $this->belongsTo('Users');
        }
    }

We can also define a more specific relationship using array
syntax::

    class Addresses extends Table {

        public function intitalize(array $config) {
            $this->belongsTo('Users', [
                'foreignKey' => 'userid',
                'joinType' => 'INNER',
            ]);
        }
    }

Possible keys for belongsTo association arrays include:

- **className**: the class name of the model being associated to
  the current model. If you're defining a 'Profile belongsTo User'
  relationship, the className key should equal 'Users'.
- **foreignKey**: the name of the foreign key found in the current model. This
  is especially handy if you need to define multiple belongsTo relationships to
  the same model. The default value for this key is the underscored, singular
  name of the other model, suffixed with ``_id``.
- **conditions**: an array of find() compatible conditions or SQL
  strings such as ``['Users.active' => true]``
- **joinType**: the type of the join to use in the SQL query, default
  is LEFT which may not fit your needs in all situations, INNER may
  be helpful when you want everything from your main and associated
  models or nothing at all.
- **property**: The property name that should be filled with data from the associated
  table into the source table results. By default this is the underscored & singular name of
  the association so ``user`` in our example.

Once this association has been defined, find operations on the User table can
contain the Address record if it exists::

    $query = $addresses->find('all')->contain(['Users']);
    foreach ($query as $address) {
        echo $address->user->username;
    }

The above would emit SQL that is similar to::

    SELECT * FROM addresses LEFT JOIN users ON addresses.user_id = users.id;


HasMany associations
--------------------

An example of a hasMany association is "Article hasMany Comments".
Defining this association will allow us to fetch an article's comments
when the article is loaded.

When creating your database tables for a hasMany relationship, follow
this convention:

**hasMany:** the *other* model contains the foreign key.

========================== ===================
Relation                   Schema
========================== ===================
Article hasMany Comment    Comment.user\_id
-------------------------- -------------------
Product hasMany Option     Option.product\_id
-------------------------- -------------------
Doctor hasMany Appointment Patient.doctor_id
========================== ===================

We can define the hasMany association in our Articles model as follows::

    class Addresses extends Table {

        public function intitalize(array $config) {
            $this->hasMany('Comments');
        }
    }

We can also define a more specific relationship using array
syntax::

    class Addresses extends Table {

        public function intitalize(array $config) {
            $this->hasMany('Comments', [
                'foreignKey' => 'articleid',
                'dependent' => true,
            ]);
        }
    }

Possible keys for hasMany association arrays include:

- **className**: the class name of the model being associated to
  the current model. If you're defining a 'User hasMany Comment'
  relationship, the className key should equal 'Comment.'
- **foreignKey**: the name of the foreign key found in the other
  model. This is especially handy if you need to define multiple
  hasMany relationships. The default value for this key is the
  underscored, singular name of the actual model, suffixed with
  '\_id'.
- **conditions**: an array of find() compatible conditions or SQL
  strings such as ``['Comments.visible' => true]``
- **sort**  an array of find() compatible order clauses or SQL
  strings such as ``['Comments.created' => 'ASC']``
- **dependent**: When dependent is set to true, recursive model
  deletion is possible. In this example, Comment records will be
  deleted when their associated Article record has been deleted.
- **cascadeCallbacks**: When this and **dependent** are true, cascaded deletes will
  load and delete entities so that callbacks are properly triggered. When false,
  ``deleteAll()`` is used to remove associated data and no callbacks are
  triggered.
- **property**: The property name that should be filled with data from the associated
  table into the source table results. By default this is the underscored & plural name of
  the association so ``comments`` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'SELECT'. The other
  valid value is 'subquery', which replaces the ``IN`` list with an equivalent
  subquery.

Once this association has been defined, find operations on the Articles table can
contain the Comment records if they exists::

    $query = $articles->find('all')->contain(['Comments']);
    foreach ($query as $article) {
        echo $article->comments[0]->text;
    }

The above would emit SQL that is similar to::

    SELECT * FROM articles;
    SELECT * FROM comments WHERE article_id IN (1, 2, 3, 4, 5);

When the subquery strategy is used, SQL similar to the following will be
generated::

    SELECT * FROM articles;
    SELECT * FROM comments WHERE article_id IN (SELECT id FROM articles);

You may want to cache the counts for your hasMany associations. This is useful
when you often need to show the number of associated records, but don't want to
load all the records just to count them. For example, the comment count on any
given article is often cached to make generating lists of articles more
efficient. You can use the :doc:`CounterCacheBehvaior
</core-libraries/behaviors/counter-cache>` to cache counts of associated
records.

BelongsToMany associations
--------------------------

An example of a BelongsToMany association is "Article BelongsToMany Tags", where
the tags from one article are shared with other articles.  BelongsToMany is
often referred to as "has and belongs to many", and is a classic "many to many"
association.

The main difference between hasMany and BelongsToMany is that the link between
the models in a BelongsToMany association are not exclusive. For example, we are
joining our Articles table with a Tags table. Using 'funny' as a Tag for my
Article, doesn't "use up" the tag. I can also use it on the next article
I write.

Three database tables are required for a BelongsToMany association. In the
example above we would need tables for ``articles``, ``tags`` and
``articles_tags``.  The ``articles_tags`` table contains the data that links
tags and articles together. The joining table is named after the two tables
involved, separated with an underscore by convention. In its simplest form, this
table consists of ``article_id`` and ``tag_id``.

**belongsToMany** requires a separate join table that includes both *model*
names.

============================ ================================================================
Relationship                 Pivot Table Fields
============================ ================================================================
Article belongsToMany Tag    articles_tags.id, articles_tags.tag_id, articles_tags.article_id
---------------------------- ----------------------------------------------------------------
Patient belongsToMany Doctor doctors_patients.id, doctors_patients.doctor_id,
                             doctors_patients.patient_id.
============================ ================================================================

We can define the belongsToMany association in our Articles model as follows::

    class Articles extends Table {

        public function intitalize(array $config) {
            $this->belongsToMany('Tags');
        }
    }

We can also define a more specific relationship using array
syntax::

    class Articles extends Table {

        public function intitalize(array $config) {
            $this->belongsToMany('Tags', [
                'joinTable' => 'article_tag',
            ]);
        }
    }

Possible keys for belongsToMany association arrays include:

.. _ref-habtm-arrays:

- **className**: the class name of the model being associated to
  the current model. If you're defining a 'Article belongsToMany Tag'
  relationship, the className key should equal 'Tags.'
- **joinTable**: The name of the join table used in this
  association (if the current table doesn't adhere to the naming
  convention for belongsToMany join tables). By default this table
  name will be used to load the Table instance for the join/pivot table.
- **foreignKey**: the name of the foreign key found in the current
  model. This is especially handy if you need to define multiple
  belongsToMany relationships. The default value for this key is the
  underscored, singular name of the current model, suffixed with
  '\_id'.
- **conditions**: an array of find() compatible conditions.  If you have
  conditions on an associated table, you should use a 'through' model, and
  define the necessary belongsTo associations on it.
- **sort** an array of find() compatible order clauses.
- **through** Allows you to provide a either the name of the Table instance you
  want used on the join table, or the instance itself. This makes customizing
  the join table keys possible, and allows you to customize the behavior of the
  pivot table.
- **cascadeCallbacks**: When this is true, cascaded deletes will load and delete
  entities so that callbacks are properly triggered on join table records. When
  false, ``deleteAll()`` is used to remove associated data and no callbacks are
  triggered. This defaults to false to help reduce overhead.
- **property**: The property name that should be filled with data from the associated
  table into the source table results. By default this is the underscored & plural name of
  the association, so ``tags`` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'SELECT'. The other
  valid value is 'subquery', which replaces the ``IN`` list with an equivalent
  subquery.

Once this association has been defined, find operations on the Articles table can
contain the Tag records if they exist::

    $query = $articles->find('all')->contain(['Tags']);
    foreach ($query as $article) {
        echo $article->tags[0]->text;
    }

The above would emit SQL that is similar to::

    SELECT * FROM articles;
    SELECT * FROM tags
    INNER JOIN articles_tags ON (
      tags.id = article_tags.tag_id
      AND article_id IN (1, 2, 3, 4, 5)
    );

When the subquery strategy is used, SQL similar to the following will be
generated::

    SELECT * FROM articles;
    SELECT * FROM tags
    INNER JOIN articles_tags ON (
      tags.id = article_tags.tag_id
      AND article_id IN (SELECT id FROM tasks)
    );

Using the 'through' option
~~~~~~~~~~~~~~~~~~~~~~~~~~

If you plan on adding extra information to the join/pivot table, or if you
need to use join columns outside of the conventions, you will need to define the
``through`` option. The ``through`` option provides you full control over how the
belongsToMany association will be created.

It is sometimes desirable to store additional data with a many to
many association. Consider the following::

    Student hasAndBelongsToMany Course
    Course hasAndBelongsToMany Student

A Student can take many Courses and a Course can be taken by many Students. This
is a simple many to many association. The following table would suffice::

    id | student_id | course_id

Now what if we want to store the number of days that were attended
by the student on the course and their final grade? The table we'd
want would be::

    id | student_id | course_id | days_attended | grade

The trouble is, a simple belongsToMany will not support this type of
scenario because when belongsToMany associations are saved,
the association is deleted first. You would lose the extra data in
the columns as it is not replaced in the new insert.

The way to implement our requirement is to use a **join model**,
otherwise known as a **hasMany through** association.
That is, the association is a model itself. So, we can create a new
model CoursesMemberships. Take a look at the following models.::

    class StudentsTable extends Table {
        public function initialize(array $config) {
            $this->belongsToMany('Courses', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesTable extends Table {
        public function initialize(array $config) {
            $this->belongsToMany('Students', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesMembershipsTable extends Table {
        public function initialize(array $config) {
            $this->belongsTo('Students');
            $this->belongsTo('Courses');
        }
    }

The CoursesMemberships join table uniquely identifies a given
Student's participation on a Course in addition to extra
meta-information.

Saving belongsToMany data
~~~~~~~~~~~~~~~~~~~~~~~~~

.. TODO:: This relies on saving actually working, which it doesn't right now.

Building your own association types
-----------------------------------

.. TODO:: Finish this. Need a reasonable example that fits into the docs..

Loading entities
================

While table objects provide an abstraction around a 'repository' or table of
objects, when you query for individual records you get 'entity' objects. While
this section discusses the different ways you can find and load entities, you
should read the :doc:`/orm/entities` section for more information on entities.

Using finders to load data
--------------------------

.. php:staticmethod:: find($type, $options = [])

Before you can work with entities, you'll need to load them. The easiest way to
do this is using the ``find`` method. The find method provides an easy and
extensible way to find the data you are interested in::

    // Find all the articles
    $query = $articles->find('all');

The return value of any ``find`` method is always
a :php:class:`Cake\\ORM\\Query` object. The Query class allows you to further
refine a query after creating it. Query objects are evaluated lazily, and do not
execute until you start fetching rows, convert it to an array, or when th
``execute()`` method is called::

    // Find all the articles.
    // At this point the query has not run.
    $query = $articles->find('all');

    // Iteration will execute the query.
    foreach ($query as $row) {
    }

    // Calling execute will execute the query.
    $results = $query->execute();

    // Converting the query to an array will execute it.
    $results = $query->execute();

Once you've started a query you can use the :doc:`/orm/query-builder` interface
to build more complex queries, adding additional conditions, limits, or include
associations using the fluent interface::

    $query = $articles->find('all')
        ->where(['Articles.created >' => new DateTime('-10 days')])
        ->contain(['Comments', 'Author'])
        ->limit(10);

You can also provide many commonly used options to ``find()``. This can help
with testing as there are fewer methods to mock::

    $query = $articles->find('all', [
        'conditions' => ['Articles.created >' => new DateTime('-10 days')],
        'contain' => ['Authors', 'Comments']
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
where they can be used to modify the query object.

.. _table-find-first::

Getting the first result
------------------------

The ``first()`` method allows you to fetch only the first row from a query. If
the query has not been executed, a ``LIMIT 1`` clause will be applied::

    $query = $articles->find('all', [
        'order' => ['Article.created' => 'DESC']
    ]);
    $row = $query->first();

This approach replaces ``find('first')`` in previous versions of CakePHP.

.. _table-find-list:

Finding key/value pairs
-----------------------

It is often useful to generate an associative array of data from your application's
data. For example, this is very useful when creating `<select>` elements. CakePHP
provides a simple to use method for generating 'lists' of data::

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

    class Articles extends Table {

        public function intitalize(array $config) {
            $this->displayField('title');
        }
    }

When calling list you can configure the fields used for the key and value with
the ``fields`` option::

    $query = $articles->find('list', [
        'fields' => ['slug', 'title']
    ]);
    $data = $query->toArray();

    // Data now looks like
    $data = [
        'first-post' => 'First post',
        'second-article-i-wrote' => 'Second article I wrote',
    ];

Results can be grouped into nested sets. This is useful when you want
bucketed sets, or want to build ``<optgroup>`` elements with FormHelper::

    $query = $articles->find('list', [
        'fields' => ['slug', 'title']
        'groupField' => ['author_id']
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

Creating finder methods
-----------------------

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

        public function findPublished(Query $query, array $options = []) {
            $query->where([
                'Articles.published' => true,
                'Articles.moderated' => true
            ]);
            return $query;
        }

    }

    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published');

Finder methods can modify the query as required, or use the
``$options`` to customize the finder operation with relevant application logic.
You can also 'stack' finders, allowing you to express complex queries
effortlessly. Assuming you have both the 'published' and 'recent' finders, you
could do the following::

    $articles = TableRegistry::get('Articles');
    $query = $articles->find('publshed')->find('recent');

While all the examples so far have show finder methods on table classes, finder
methods can also be defined on :doc:`/orm/behaviors`.

If you need to modify the results after they have been fetched you should use
a :ref:`map-reduce` function to modify the results. The map reduce features
replace the 'afterFind' callback found in previous versions of CakePHP.

Magic finders
-------------

.. TODO::
    There is no code for this yet. This section will need to be written
    when the code exists.

Using the 'matching' option with belongsToMany associations.
------------------------------------------------------------

Eager loading associations
--------------------------

By default CakePHP does not load **any** associated data when using ``find()``.
You need to 'contain' or eager-load each association you want loaded in your
results. Eager loading helps avoid many of the potential performance problems
surrounding lazy-loading in an ORM. The queries generated by eager loading can
better leverage joins, allowing more efficient queries to be made. In CakePHP
you define eager loaded associations using the 'contain' method::

    // As an option to find()
    $query = $articles->find('all', ['contain' => ['Authors', 'Comments']]);

    // As a method on the query objecy
    $query = $articles->find('all');
    $query->contain(['Authors', 'Comments']);

The above will load the related author and comments for each article in the
result set. You can also contain nested associations by separating the
associations with ``.``::

    $query = $articles->find('all', [
        'contain' => ['Authors.Addresses', 'Comments.Authors']
    ]);

If you need to reset the containments on a query you can set the second argument
to ``true``::

    $query = $articles->find('all');
    $query->contain(['Authors', 'Comments'], true);


Lazy loading associations
-------------------------

.. TODO:: Link to relevant section in entity docs.


Saving entities
===============

Bulk updates
------------

Deleting entities
=================

Cascading deletes
-----------------

Bulk deletes
------------

Lifecycle callbacks
===================

* Find callbacks
* Delete callbacks
* Save callbacks

Behaviors
=========

* Adding behaviors
* Configuring behaviors
* Link to behavior docs.


.. _configuring-table-connections:

Configuring connections
=======================

By default all table instances use the ``default`` database connection. If your
application uses multiple database connections you will want to configure which
tables use which connections. This is the ``defaultConnectionName`` method::

    namespace App\Model\Repository;

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

Configuring table objects
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

Flushing the registry
---------------------

.. php:staticmethod:: clear()

During test cases you may want to flush the registry. Doing so is often useful
when you are using mock objects, or modifying a table's dependencies::

    TableRegistry::clear();

