Associations - Linking Tables Together
######################################

Defining relations between different objects in your application should be
a natural process. For example, an article may have many comments, and belong
to an author. Authors may have many articles and comments. CakePHP makes
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
many to many  belongsToMany         Tags belong to many articles.
============= ===================== =======================================

Associations are defined during the ``initialize()`` method of your table
object. Methods matching the association type allow you to define the
associations in your application. For example if we wanted to define a belongsTo
association in our ArticlesTable::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Authors');
        }

    }

The simplest form of any association setup takes the table alias you want to
associate with. By default all of the details of an association will use the
CakePHP conventions. If you want to customize how your associations are handled
you can do so with the second parameter::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Authors', [
                'className' => 'Publishing.Authors',
                'foreignKey' => 'authorid',
                'propertyName' => 'person'
            ]);
        }

    }

The same table can be used multiple times to define different types of
associations. For example consider a case where you want to separate
approved comments and those that have not been moderated yet::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments', [
                'className' => 'Comments',
                'conditions' => ['approved' => true]
            ]);

            $this->hasMany('UnapprovedComments', [
                'className' => 'Comments',
                'conditions' => ['approved' => false],
                'propertyName' => 'unapproved_comments'
            ]);
        }
    }

As you can see, by specifying the ``className`` key, it is possible to use the
same table as different associations for the same table. You can even create
self-associated tables to create parent-child relationships::

    class CategoriesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('SubCategories', [
                'className' => 'Categories',
            ]);

            $this->belongsTo('ParentCategories', [
                'className' => 'Categories',
            ]);
        }
    }

You can also setup associations in mass by making a single call to
``Table::addAssociations()`` which accepts an array containing a set of
table names indexed by association type as an argument::

    class PostsTable extends Table
    {

      public function initialize(array $config)
      {
        $this->addAssociations([
          'belongsTo' => [
            'Users' => ['className' => 'App\Model\Table\UsersTable']
          ],
          'hasMany' => ['Comments'],
          'belongsToMany' => ['Tags']
        ]);
      }

    }

Each association type accepts multiple associations where the keys are the
aliases, and the values are association config data. If numeric keys are used
the values will be treated as association aliases.

HasOne Associations
===================

Let's set up a Users Table with a hasOne relationship to an Addresses Table.

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

    It is not mandatory to follow CakePHP conventions, you can override
    the use of any foreignKey in your associations definitions. Nevertheless sticking
    to conventions will make your code less repetitive, easier to read and to maintain.

If we had the ``UsersTable`` and ``AddressesTable`` classes made we could make
the association with the following code::

    class UsersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasOne('Addresses');
        }
    }

If you need more control, you can define your associations using
array syntax. For example, you might want to limit the association
to include only certain records::

    class UsersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasOne('Addresses', [
                'className' => 'Addresses',
                'conditions' => ['Addresses.primary' => '1'],
                'dependent' => true
            ]);
        }
    }

Possible keys for hasOne association arrays include:

- **className**: the class name of the table being associated to
  the current model. If you're defining a 'User hasOne Address'
  relationship, the className key should equal 'Addresses'.
- **foreignKey**: the name of the foreign key found in the other
  table. This is especially handy if you need to define multiple
  hasOne relationships. The default value for this key is the
  underscored, singular name of the current model, suffixed with
  '\_id'. In the example above it would default to 'user\_id'.
- **bindingKey**: The name of the column in the current table, that will be used
  for matching the ``foreignKey``. If not specified, the primary key (for example
  the id column of the ``Users`` table) will be used.
- **conditions**: an array of find() compatible conditions
  such as ``['Addresses.primary' => true]``
- **joinType**: the type of the join to use in the SQL query, default
  is LEFT. You can use INNER if your hasOne association is always present.
- **dependent**: When the dependent key is set to ``true``, and an
  entity is deleted, the associated model records are also deleted. In this
  case we set it to ``true`` so that deleting a User will also delete her associated
  Address.
- **cascadeCallbacks**: When this and **dependent** are ``true``, cascaded deletes will
  load and delete entities so that callbacks are properly triggered. When ``false``,
  ``deleteAll()`` is used to remove associated data and no callbacks are
  triggered.
- **propertyName**: The property name that should be filled with data from the associated
  table into the source table results. By default this is the underscored & singular name of
  the association so ``address`` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'join'. The other
  valid value is 'select', which utilizes sub-queries instead.
- **finder**: The finder method to use when loading associated records.

Once this association has been defined, find operations on the Users table can
contain the Address record if it exists::

    // In a controller or table method.
    $query = $users->find('all')->contain(['Addresses']);
    foreach ($query as $user) {
        echo $user->address->street;
   }

The above would emit SQL that is similar to::

    SELECT * FROM users INNER JOIN addresses ON addresses.user_id = users.id;

BelongsTo Associations
======================

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

    class AddressesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Users');
        }
    }

We can also define a more specific relationship using array
syntax::

    class AddressesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Users', [
                'foreignKey' => 'user_id',
                'joinType' => 'INNER',
            ]);
        }
    }

Possible keys for belongsTo association arrays include:

- **className**: the class name of the model being associated to
  the current model. If you're defining a 'Profile belongsTo User'
  relationship, the className key should equal 'Users'.
- **foreignKey**: the name of the foreign key found in the current table. This
  is especially handy if you need to define multiple belongsTo relationships to
  the same model. The default value for this key is the underscored, singular
  name of the other model, suffixed with ``_id``.
- **bindingKey**: The name of the column in the other table, that will be used
  for matching the ``foreignKey``. If not specified, the primary key (for example
  the id column of the ``Users`` table) will be used.
- **conditions**: an array of find() compatible conditions or SQL
  strings such as ``['Users.active' => true]``
- **joinType**: the type of the join to use in the SQL query, default
  is LEFT which may not fit your needs in all situations, INNER may
  be helpful when you want everything from your main and associated
  models or nothing at all.
- **propertyName**: The property name that should be filled with data from the
  associated table into the source table results. By default this is the
  underscored & singular name of the association so ``user`` in our example.
- **finder**: The finder method to use when loading associated records.

Once this association has been defined, find operations on the User table can
contain the Address record if it exists::

    // In a controller or table method.
    $query = $addresses->find('all')->contain(['Users']);
    foreach ($query as $address) {
        echo $address->user->username;
    }

The above would emit SQL that is similar to::

    SELECT * FROM addresses LEFT JOIN users ON addresses.user_id = users.id;


HasMany Associations
====================

An example of a hasMany association is "Article hasMany Comments".
Defining this association will allow us to fetch an article's comments
when the article is loaded.

When creating your database tables for a hasMany relationship, follow
this convention:

**hasMany:** the *other* model contains the foreign key.

========================== ===================
Relation                   Schema
========================== ===================
Article hasMany Comment    Comment.article\_id
-------------------------- -------------------
Product hasMany Option     Option.product\_id
-------------------------- -------------------
Doctor hasMany Patient     Patient.doctor\_id
========================== ===================

We can define the hasMany association in our Articles model as follows::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments');
        }
    }

We can also define a more specific relationship using array
syntax::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments', [
                'foreignKey' => 'article_id',
                'dependent' => true,
            ]);
        }
    }

Sometimes you may want to configure composite keys in your associations::

    $this->hasMany('Reviews', [
        'foreignKey' => [
            'article_id',
            'article_name'
        ],
        'bindingKey' => [
            'article_id',
            'article_name'
        ]
    ]);

In the example above, we have passed an array containing the desired composite
keys for both ``foreignKey`` and ``bindingKey`` configuration keys in the
relationship.

Possible keys for hasMany association arrays include:

- **className**: the class name of the model being associated to
  the current model. If you're defining a 'User hasMany Comment'
  relationship, the className key should equal 'Comments'.
- **foreignKey**: the name of the foreign key found in the other
  table. This is especially handy if you need to define multiple
  hasMany relationships. The default value for this key is the
  underscored, singular name of the actual model, suffixed with
  '\_id'.
- **bindingKey**: The name of the column in the current table, that will be used
  for matching the ``foreignKey``. If not specified, the primary key (for example
  the id column of the ``Articles`` table) will be used.
- **conditions**: an array of find() compatible conditions or SQL
  strings such as ``['Comments.visible' => true]``
- **sort**  an array of find() compatible order clauses or SQL
  strings such as ``['Comments.created' => 'ASC']``
- **dependent**: When dependent is set to ``true``, recursive model
  deletion is possible. In this example, Comment records will be
  deleted when their associated Article record has been deleted.
- **cascadeCallbacks**: When this and **dependent** are ``true``, cascaded
  deletes will load and delete entities so that callbacks are properly
  triggered. When ``false``, ``deleteAll()`` is used to remove associated data
  and no callbacks are triggered.
- **propertyName**: The property name that should be filled with data from the
  associated table into the source table results. By default this is the
  underscored & plural name of the association so ``comments`` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'select'. The other
  valid value is 'subquery', which replaces the ``IN`` list with an equivalent
  subquery.
- **saveStrategy**: Either 'append' or 'replace'. When 'append' the current records
  are appended to any records in the database. When 'replace' associated records
  not in the current set will be removed. If the foreign key is a null able column
  or if ``dependent`` is true records will be orphaned.
- **finder**: The finder method to use when loading associated records.

Once this association has been defined, find operations on the Articles table can
contain the Comment records if they exist::

    // In a controller or table method.
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
efficient. You can use the :doc:`CounterCacheBehavior
</orm/behaviors/counter-cache>` to cache counts of associated records.

You should make sure that your database tables do not contain columns that match
association property names. If for example you have counter fields that conflict
with association properties, you must either rename the association property, or
the column name.

BelongsToMany Associations
==========================

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

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Tags');
        }
    }

We can also define a more specific relationship using array
syntax::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Tags', [
                'joinTable' => 'article_tag',
            ]);
        }
    }

Possible keys for belongsToMany association arrays include:

- **className**: the class name of the model being associated to
  the current model. If you're defining a 'Article belongsToMany Tag'
  relationship, the className key should equal 'Tags.'
- **joinTable**: The name of the join table used in this
  association (if the current table doesn't adhere to the naming
  convention for belongsToMany join tables). By default this table
  name will be used to load the Table instance for the join/pivot table.
- **foreignKey**: the name of the foreign key found in the current
  model or list in case of composite foreign keys.
  This is especially handy if you need to define multiple
  belongsToMany relationships. The default value for this key is the
  underscored, singular name of the current model, suffixed with '\_id'.
- **targetForeignKey**: the name of the foreign key found in the target
  model or list in case of composite foreign keys.
  The default value for this key is the underscored, singular name of
  the target model, suffixed with '\_id'.
- **conditions**: an array of find() compatible conditions.  If you have
  conditions on an associated table, you should use a 'through' model, and
  define the necessary belongsTo associations on it.
- **sort** an array of find() compatible order clauses.
- **dependent**: When the dependent key is set to ``false``, and an entity is
  deleted, the data of the join table will not be deleted.
- **through** Allows you to provide a either the name of the Table instance you
  want used on the join table, or the instance itself. This makes customizing
  the join table keys possible, and allows you to customize the behavior of the
  pivot table.
- **cascadeCallbacks**: When this is ``true``, cascaded deletes will load and
  delete entities so that callbacks are properly triggered on join table
  records. When ``false``, ``deleteAll()`` is used to remove associated data and
  no callbacks are triggered. This defaults to ``false`` to help reduce
  overhead.
- **propertyName**: The property name that should be filled with data from the
  associated table into the source table results. By default this is the
  underscored & plural name of the association, so ``tags`` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'select'. The
  other valid value is 'subquery', which replaces the ``IN`` list with an
  equivalent subquery.
- **saveStrategy**: Either 'append' or 'replace'. Defaults to 'replace'.
  Indicates the mode to be used for saving associated entities. The former will
  only create new links between both side of the relation and the latter will
  do a wipe and replace to create the links between the passed entities when
  saving.
- **finder**: The finder method to use when loading associated records.


Once this association has been defined, find operations on the Articles table can
contain the Tag records if they exist::

    // In a controller or table method.
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
      AND article_id IN (SELECT id FROM articles)
    );

.. _using-the-through-option:

Using the 'through' Option
--------------------------

If you plan on adding extra information to the join/pivot table, or if you
need to use join columns outside of the conventions, you will need to define the
``through`` option. The ``through`` option provides you full control over how
the belongsToMany association will be created.

It is sometimes desirable to store additional data with a many to
many association. Consider the following::

    Student BelongsToMany Course
    Course BelongsToMany Student

A Student can take many Courses and a Course can be taken by many Students. This
is a simple many to many association. The following table would suffice::

    id | student_id | course_id

Now what if we want to store the number of days that were attended
by the student on the course and their final grade? The table we'd
want would be::

    id | student_id | course_id | days_attended | grade

The way to implement our requirement is to use a **join model**,
otherwise known as a **hasMany through** association.
That is, the association is a model itself. So, we can create a new
model CoursesMemberships. Take a look at the following models. ::

    class StudentsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Courses', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Students', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesMembershipsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsTo('Students');
            $this->belongsTo('Courses');
        }
    }

The CoursesMemberships join table uniquely identifies a given
Student's participation on a Course in addition to extra
meta-information.

Default Association Conditions
------------------------------

The ``finder`` option allows you to use a :ref:`custom finder
<custom-find-methods>` to load associated record data. This lets you encapsulate
your queries better and keep your code DRY'er. There are some limitations when
using finders to load data in associations that are loaded using
joins (belongsTo/hasOne). Only the following aspects of the query will be
applied to the root query:

- WHERE conditions.
- Additional joins.
- Contained associations.

Other aspects of the query, such as selected columns, order, group by, having
and other sub-statements, will not be applied to the root query. Associations
that are *not* loaded through joins (hasMany/belongsToMany), do not have the
above restrictions and can also use result formatters or map/reduce functions.

Loading Associations
--------------------

Once you've defined your associations you can :ref:`eager load associations
<eager-loading-associations>` when fetching results.
