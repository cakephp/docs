# Associations - Linking Tables Together

Defining relations between different objects in your application should be
a natural process. For example, an article may have many comments, and belong to
an author. Authors may have many articles and comments. The four association
types in CakePHP are: hasOne, hasMany, belongsTo, and belongsToMany.

| Relationship | Association Type | Example                            |
|--------------|------------------|------------------------------------|
| one to one   | hasOne           | A user has one profile.            |
| one to many  | hasMany          | A user can have multiple articles. |
| many to one  | belongsTo        | Many articles belong to a user.    |
| many to many | belongsToMany    | Tags belong to many articles.      |

Associations are defined during the `initialize()` method of your table
object. Methods matching the association type allow you to define the
associations in your application. For example if we wanted to define a belongsTo
association in our ArticlesTable:

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->belongsTo('Authors');
    }
}
```

The simplest form of any association setup takes the table alias you want to
associate with. By default all of the details of an association will use the
CakePHP conventions. If you want to customize how your associations are handled
you can modify them with setters:

``` php
class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->belongsTo('Authors', [
                'className' => 'Publishing.Authors'
            ])
            ->setForeignKey('author_id')
            ->setProperty('author');
    }
}
```

The property name will be the property key (of the associated entity) on the entity object, in this case:

``` php
$authorEntity = $articleEntity->author;
```

You can also use arrays to customize your associations:

``` php
$this->belongsTo('Authors', [
    'className' => 'Publishing.Authors',
    'foreignKey' => 'author_id',
    'propertyName' => 'author'
]);
```

However, arrays do not offer the typehinting and autocomplete benefits that the fluent interface does.

The same table can be used multiple times to define different types of
associations. For example consider a case where you want to separate
approved comments and those that have not been moderated yet:

``` php
class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->hasMany('Comments')
            ->setFinder('approved');

        $this->hasMany('UnapprovedComments', [
                'className' => 'Comments'
            ])
            ->setFinder('unapproved')
            ->setProperty('unapproved_comments');
    }
}
```

As you can see, by specifying the `className` key, it is possible to use the
same table as different associations for the same table. You can even create
self-associated tables to create parent-child relationships:

``` php
class CategoriesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->hasMany('SubCategories', [
            'className' => 'Categories',
        ]);

        $this->belongsTo('ParentCategories', [
            'className' => 'Categories',
        ]);
    }
}
```

You can also setup associations in mass by making a single call to
`Table::addAssociations()` which accepts an array containing a set of
table names indexed by association type as an argument:

``` php
class PostsTable extends Table
{
    public function initialize(array $config): void
    {
       $this->addAssociations([
           'belongsTo' => [
               'Users' => ['className' => 'App\Model\Table\UsersTable'],
           ],
           'hasMany' => ['Comments'],
           'belongsToMany' => ['Tags'],
       ]);
    }
}
```

Each association type accepts multiple associations where the keys are the
aliases, and the values are association config data. If numeric keys are used
the values will be treated as association aliases.

<a id="has-one-associations"></a>

## HasOne Associations

Let's set up a Users table with a hasOne relationship to the Addresses table.

First, your database tables need to be keyed correctly. For a hasOne
relationship to work, one table has to contain a foreign key that points to a
record in the other table. In this case, the Addresses table will contain a field
called 'user_id'. The basic pattern is:

**hasOne:** the *other* model contains the foreign key.

| Relation               | Schema            |
|------------------------|-------------------|
| Users hasOne Addresses | addresses.user_id |
| Doctors hasOne Mentors | mentors.doctor_id |

> [!NOTE]
> It is not mandatory to follow CakePHP conventions, you can override the name
> of any `foreignKey` in your associations definitions. Nevertheless, sticking
> to conventions will make your code less repetitive, easier to read and to
> maintain.

Once you create the `UsersTable` and `AddressesTable` classes, you can make
the association with the following code:

``` php
class UsersTable extends Table
{
    public function initialize(array $config): void
    {
        $this->hasOne('Addresses');
    }
}
```

If you need more control, you can define your associations using the setters.
For example, you might want to limit the association to include only certain
records:

``` php
class UsersTable extends Table
{
    public function initialize(array $config): void
    {
        $this->hasOne('Addresses')
            ->setName('Addresses')
            ->setFinder('primary')
            ->setDependent(true);
    }
}
```

If you want to break different addresses into multiple associations, you can do something like:

``` php
class UsersTable extends Table
{
    public function initialize(array $config): void
    {
        $this->hasOne('HomeAddresses', [
                'className' => 'Addresses'
            ])
            ->setProperty('home_address')
            ->setConditions(['HomeAddresses.label' => 'Home'])
            ->setDependent(true);

        $this->hasOne('WorkAddresses', [
                'className' => 'Addresses'
            ])
            ->setProperty('work_address')
            ->setConditions(['WorkAddresses.label' => 'Work'])
            ->setDependent(true);
    }
}
```

> [!NOTE]
> If a column is shared by multiple hasOne associations, you must qualify it with the association alias.
> In the above example, the 'label' column is qualified with the 'HomeAddresses' and 'WorkAddresses' aliases.

Possible keys for hasOne association arrays include:

- **className**: The class name of the other table. This is the same name used
  when getting an instance of the table. In the 'Users hasOne Addresses' example,
  it should be 'Addresses'. The default value is the name of the association.
- **foreignKey**: The name of the foreign key column in the other table. The
  default value is the underscored, singular name of the current model,
  suffixed with '\_id' such as 'user_id' in the above example.
- **bindingKey**: The name of the column in the current table used to match the
  `foreignKey`. The default value is the primary key of the current table
  such as 'id' of Users in the above example.
- **conditions**: An array of find() compatible conditions such as
  `['Addresses.primary' => true]`
- **joinType**: The type of the join used in the SQL query. Accepted values are
  'LEFT' and 'INNER'. You can use 'INNER' to get results only where the
  association is set. The default value is 'LEFT'.
- **dependent**: When the dependent key is set to `true`, and an entity is
  deleted, the associated model records are also deleted. In this case we set it
  to `true` so that deleting a User will also delete her associated Address.
- **cascadeCallbacks**: When this and **dependent** are `true`, cascaded
  deletes will load and delete entities so that callbacks are properly
  triggered. When `false`, `deleteAll()` is used to remove associated data
  and no callbacks are triggered.
- **propertyName**: The property name that should be filled with data from the
  associated table into the source table results. By default this is the
  underscored & singular name of the association so `address` in our example.
- **strategy**: The query strategy used to load matching record from the other table.
  Accepted values are `'join'` and `'select'`. Using `'select'` will generate a separate query
  and can be useful when the other table is in different database. The default is `'join'`.
- **finder**: The finder method to use when loading associated records.

Once this association has been defined, find operations on the Users table can
contain the Address record if it exists:

``` php
// In a controller or table method.
$query = $users->find('all')->contain(['Addresses'])->all();
foreach ($query as $user) {
    echo $user->address->street;
}
```

The above would emit SQL that is similar to:

``` sql
SELECT * FROM users INNER JOIN addresses ON addresses.user_id = users.id;
```

<a id="belongs-to-associations"></a>

## BelongsTo Associations

Now that we have Address data access from the User table, let's define
a belongsTo association in the Addresses table in order to get access to related
User data. The belongsTo association is a natural complement to the hasOne and
hasMany associations - it allows us to see related data from the other
direction.

When keying your database tables for a belongsTo relationship, follow this
convention:

**belongsTo:** the *current* model contains the foreign key.

| Relation                  | Schema            |
|---------------------------|-------------------|
| Addresses belongsTo Users | addresses.user_id |
| Mentors belongsTo Doctors | mentors.doctor_id |

> [!TIP]
> If a table contains a foreign key, it belongs to the other table.

We can define the belongsTo association in our Addresses table as follows:

``` php
class AddressesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->belongsTo('Users');
    }
}
```

We can also define a more specific relationship using the setters:

``` php
class AddressesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->belongsTo('Users')
            ->setForeignKey('user_id')
            ->setJoinType('INNER');
    }
}
```

Possible keys for belongsTo association arrays include:

- **className**: The class name of the other table. This is the same name used
  when getting an instance of the table. In the 'Addresses belongsTo Users' example,
  it should be 'Users'. The default value is the name of the association.
- **foreignKey**: The name of the foreign key column in the current table. The
  default value is the underscored, singular name of the other model,
  suffixed with '\_id' such as 'user_id' in the above example.
- **bindingKey**: The name of the column in the other table used to match the
  `foreignKey`. The default value is the primary key of the other table
  such as 'id' of Users in the above example.
- **conditions**: An array of find() compatible conditions or SQL strings such
  as `['Users.active' => true]`
- **joinType**: The type of the join used in the SQL query. Accepted values are
  'LEFT' and 'INNER'. You can use 'INNER' to get results only where the
  association is set. The default value is 'LEFT'.
- **propertyName**: The property name that should be filled with data from the
  associated table into the source table results. By default this is the
  underscored & singular name of the association so `user` in our example.
- **strategy**: The query strategy used to load matching record from the other table.
  Accepted values are `'join'` and `'select'`. Using `'select'` will generate a separate query
  and can be useful when the other table is in different database. The default is `'join'`.
- **finder**: The finder method to use when loading associated records.

Once this association has been defined, find operations on the Addresses table can
contain the User record if it exists:

``` php
// In a controller or table method.
$query = $addresses->find('all')->contain(['Users'])->all();
foreach ($query as $address) {
    echo $address->user->username;
}
```

The above would output SQL similar to:

``` sql
SELECT * FROM addresses LEFT JOIN users ON addresses.user_id = users.id;
```

<a id="has-many-associations"></a>

## HasMany Associations

An example of a hasMany association is "Articles hasMany Comments". Defining this
association will allow us to fetch an article's comments when the article is
loaded.

When creating your database tables for a hasMany relationship, follow this
convention:

**hasMany:** the *other* model contains the foreign key.

| Relation                  | Schema              |
|---------------------------|---------------------|
| Articles hasMany Comments | Comments.article_id |
| Products hasMany Options  | Options.product_id  |
| Doctors hasMany Patients  | Patients.doctor_id  |

We can define the hasMany association in our Articles model as follows:

``` php
class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->hasMany('Comments');
    }
}
```

We can also define a more specific relationship using the setters:

``` php
class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->hasMany('Comments')
            ->setForeignKey('article_id')
            ->setDependent(true);
    }
}
```

Sometimes you may want to configure composite keys in your associations:

``` php
// Within ArticlesTable::initialize() call
$this->hasMany('Comments')
    ->setForeignKey([
        'article_id',
        'article_hash',
    ]);
```

Relying on the example above, we have passed an array containing the desired
composite keys to `setForeignKey()`. By default the `bindingKey` would be
automatically defined as `id` and `hash` respectively, but let's assume that
you need to specify different binding fields than the defaults. You can setup it
manually with `setBindingKey()`:

``` php
// Within ArticlesTable::initialize() call
$this->hasMany('Comments')
    ->setForeignKey([
        'article_id',
        'article_hash',
    ])
    ->setBindingKey([
        'whatever_id',
        'whatever_hash',
    ]);
```

Like hasOne associations, `foreignKey` is in the other (Comments)
table and `bindingKey` is in the current (Articles) table.

Possible keys for hasMany association arrays include:

- **className**: The class name of the other table. This is the same name used
  when getting an instance of the table. In the 'Articles hasMany Comments' example,
  it should be 'Comments'. The default value is the name of the association.
- **foreignKey**: The name of the foreign key column in the other table. The
  default value is the underscored, singular name of the current model,
  suffixed with '\_id' such as 'article_id' in the above example.
- **bindingKey**: The name of the column in the current table used to match the
  `foreignKey`. The default value is the primary key of the current table
  such as 'id' of Articles in the above example.
- **conditions**: an array of find() compatible conditions or SQL
  strings such as `['Comments.visible' => true]`. It is recommended to
  use the `finder` option instead.
- **sort**: an array of find() compatible order clauses or SQL
  strings such as `['Comments.created' => 'ASC']`
- **dependent**: When dependent is set to `true`, recursive model
  deletion is possible. In this example, Comment records will be
  deleted when their associated Article record has been deleted.
- **cascadeCallbacks**: When this and **dependent** are `true`, cascaded
  deletes will load and delete entities so that callbacks are properly
  triggered. When `false`, `deleteAll()` is used to remove associated data
  and no callbacks are triggered.
- **propertyName**: The property name that should be filled with data from the
  associated table into the source table results. By default this is the
  underscored & plural name of the association so `comments` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'select'. The
  other valid value is 'subquery', which replaces the `IN` list with an
  equivalent subquery.
- **saveStrategy**: Either 'append' or 'replace'. Defaults to 'append'. When 'append' the current
  records are appended to any records in the database. When 'replace' associated
  records not in the current set will be removed. If the foreign key is a nullable
  column or if `dependent` is true records will be orphaned.
- **finder**: The finder method to use when loading associated records. See the
  [Association Finder](#association-finder) section for more information.

Once this association has been defined, find operations on the Articles table
can contain the Comment records if they exist:

``` php
// In a controller or table method.
$query = $articles->find('all')->contain(['Comments'])->all();
foreach ($query as $article) {
    echo $article->comments[0]->text;
}
```

The above would output SQL similar to:

``` sql
SELECT * FROM articles;
SELECT * FROM comments WHERE article_id IN (1, 2, 3, 4, 5);
```

When the subquery strategy is used, SQL similar to the following will be
generated:

``` sql
SELECT * FROM articles;
SELECT * FROM comments WHERE article_id IN (SELECT id FROM articles);
```

You may want to cache the counts for your hasMany associations. This is useful
when you often need to show the number of associated records, but don't want to
load all the records just to count them. For example, the comment count on any
given article is often cached to make generating lists of articles more
efficient. You can use the [CounterCacheBehavior](../orm/behaviors/counter-cache) to cache counts of associated records.

You should make sure that your database tables do not contain columns that match
association property names. If for example you have counter fields that conflict
with association properties, you must either rename the association property, or
the column name.

<a id="belongs-to-many-associations"></a>

## BelongsToMany Associations

An example of a BelongsToMany association is "Article BelongsToMany Tags", where
the tags from one article are shared with other articles. BelongsToMany is
often referred to as "has and belongs to many", and is a classic "many to many"
association.

The main difference between hasMany and BelongsToMany is that the link between
the models in a BelongsToMany association is not exclusive. For example, we are
joining our Articles table with a Tags table. Using 'funny' as a Tag for my
Article, doesn't "use up" the tag. I can also use it on the next article
I write.

Three database tables are required for a BelongsToMany association. In the
example above we would need tables for `articles`, `tags` and
`articles_tags`. The `articles_tags` table contains the data that links
tags and articles together. The joining table is named after the two tables
involved, separated with an underscore by convention. In its simplest form, this
table consists of `article_id` and `tag_id` and a multi-column
`PRIMARY KEY` index spanning both columns.

**belongsToMany** requires a separate join table that includes both *model*
names.

| Relationship | Join Table Fields |
|----|----|
| Articles belongsToMany Tags | articles_tags.id, articles_tags.tag_id, articles_tags.article_id |
| Patients belongsToMany Doctors | doctors_patients.id, doctors_patients.doctor_id, doctors_patients.patient_id. |

We can define the belongsToMany association in both our models as follows:

``` php
// In src/Model/Table/ArticlesTable.php
class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->belongsToMany('Tags');
    }
}

// In src/Model/Table/TagsTable.php
class TagsTable extends Table
{
    public function initialize(array $config): void
    {
        $this->belongsToMany('Articles');
    }
}
```

We can also define a more specific relationship using configuration:

``` php
// In src/Model/Table/TagsTable.php
class TagsTable extends Table
{
    public function initialize(array $config): void
    {
        $this->belongsToMany('Articles', [
            'joinTable' => 'articles_tags',
        ]);
    }
}
```

Possible keys for belongsToMany association arrays include:

- **className**: The class name of the other table. This is the same name used
  when getting an instance of the table. In the 'Articles belongsToMany Tags'
  example, it should be 'Tags'. The default value is the name of the association.
- **joinTable**: The name of the join table used in this
  association (if the current table doesn't adhere to the naming
  convention for belongsToMany join tables). By default this table
  name will be used to load the Table instance for the join table.
- **foreignKey**: The name of the foreign key that references the current model
  found on the join table, or list in case of composite foreign keys.
  This is especially handy if you need to define multiple
  belongsToMany relationships. The default value for this key is the
  underscored, singular name of the current model, suffixed with '\_id'.
- **bindingKey**: The name of the column in the current table, that will be used
  for matching the `foreignKey`. Defaults to the primary key.
- **targetForeignKey**: The name of the foreign key that references the target
  model found on the join model, or list in case of composite foreign keys.
  The default value for this key is the underscored, singular name of
  the target model, suffixed with '\_id'.
- **conditions**: An array of `find()` compatible conditions. If you have
  conditions on an associated table, you should use a 'through' model, and
  define the necessary belongsTo associations on it. It is recommended to
  use the `finder` option instead.
- **sort**: an array of find() compatible order clauses.
- **dependent**: When the dependent key is set to `false`, and an entity is
  deleted, the data of the join table will not be deleted.
- **through**: Allows you to provide either the alias of the Table instance you
  want used on the join table, or the instance itself. This makes customizing
  the join table keys possible, and allows you to customize the behavior of the
  pivot table.
- **cascadeCallbacks**: When this is `true`, cascaded deletes will load and
  delete entities so that callbacks are properly triggered on join table
  records. When `false`, `deleteAll()` is used to remove associated data and
  no callbacks are triggered. This defaults to `false` to help reduce
  overhead.
- **propertyName**: The property name that should be filled with data from the
  associated table into the source table results. By default this is the
  underscored & plural name of the association, so `tags` in our example.
- **strategy**: Defines the query strategy to use. Defaults to 'select'. The
  other valid value is 'subquery', which replaces the `IN` list with an
  equivalent subquery.
- **saveStrategy**: Either 'append' or 'replace'. Defaults to 'replace'.
  Indicates the mode to be used for saving associated entities. The former will
  only create new links between both side of the relation and the latter will
  do a wipe and replace to create the links between the passed entities when
  saving.
- **finder**: The finder method to use when loading associated records. See the
  [Association Finder](#association-finder) section for more information.

Once this association has been defined, find operations on the Articles table can
contain the Tag records if they exist:

``` php
// In a controller or table method.
$query = $articles->find('all')->contain(['Tags'])->all();
foreach ($query as $article) {
    echo $article->tags[0]->text;
}
```

The above would output SQL similar to:

``` sql
SELECT * FROM articles;
SELECT * FROM tags
INNER JOIN articles_tags ON (
  tags.id = article_tags.tag_id
  AND article_id IN (1, 2, 3, 4, 5)
);
```

When the subquery strategy is used, SQL similar to the following will be
generated:

``` sql
SELECT * FROM articles;
SELECT * FROM tags
INNER JOIN articles_tags ON (
  tags.id = article_tags.tag_id
  AND article_id IN (SELECT id FROM articles)
);
```

<a id="using-the-through-option"></a>

### Using the 'through' Option

If you plan on adding extra information to the join/pivot table, or if you need
to use join columns outside of the conventions, you will need to define the
`through` option. The `through` option provides you full control over how
the belongsToMany association will be created.

It is sometimes desirable to store additional data with a many to many
association. Consider the following:

    Student BelongsToMany Course
    Course BelongsToMany Student

A Student can take many Courses and a Course can be taken by many Students. This
is a simple many to many association. The following table would suffice:

    id | student_id | course_id

Now what if we want to store the number of days that were attended by the
student on the course and their final grade? The table we'd want would be:

    id | student_id | course_id | days_attended | grade

The way to implement our requirement is to use a **join model**, otherwise known
as a **hasMany through** association. That is, the association is a model
itself. So, we can create a new model CoursesMemberships. Take a look at the
following models:

``` php
class StudentsTable extends Table
{
    public function initialize(array $config): void
    {
        $this->belongsToMany('Courses', [
            'through' => 'CoursesMemberships',
        ]);
    }
}

class CoursesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->belongsToMany('Students', [
            'through' => 'CoursesMemberships',
        ]);
    }
}

class CoursesMembershipsTable extends Table
{
    public function initialize(array $config): void
    {
        $this->belongsTo('Students');
        $this->belongsTo('Courses');
    }
}
```

The CoursesMemberships join table uniquely identifies a given Student's
participation on a Course in addition to extra meta-information.

When using a query object with a BelongsToMany relationship with a `through`
model, add contain and matching conditions for the association target table into
your query object. The `through` table can then be referenced in other conditions
such as a where condition by designating the through table name before the field
you are filtering on:

``` php
$query = $this->find(
        'list',
        valueField: 'studentFirstName', order: 'students.id'
    )
    ->contain(['Courses'])
    ->matching('Courses')
    ->where(['CoursesMemberships.grade' => 'B']);
```

<a id="association-finder"></a>

### Using Association Finders

By default associations will load records based on the foreign key columns. If
you want to define additional conditions for associations, you can use
a `finder`. When an association is loaded the ORM will use your [custom
finder](../orm/retrieving-data-and-resultsets#custom-find-methods) to load, update, or delete associated records.
Using finders lets you encapsulate your queries and make them more reusable.
There are some limitations when using finders to load data in associations that
are loaded using joins (belongsTo/hasOne). Only the following aspects of the
query will be applied to the root query:

- Where conditions.
- Additional joins.
- Contained associations.

Other aspects of the query, such as selected columns, order, group by, having
and other sub-statements, will not be applied to the root query. Associations
that are *not* loaded through joins (hasMany/belongsToMany), do not have the
above restrictions and can also use result formatters or map/reduce functions.

## Association Conventions

By default, associations should be configured and referenced using the CamelCase style.
This enables property chains to related tables in the following way:

``` php
$this->MyTableOne->MyTableTwo->find()->...;
```

Association properties on entities do not use CamelCase conventions though. Instead for a hasOne/belongsTo relation like "User belongsTo Roles", you would get a <span class="title-ref">role</span> property instead of <span class="title-ref">Role</span> or \`Roles\`:

``` php
// A single entity (or null if not available)
$role = $user->role;
```

Whereas for the other direction "Roles hasMany Users" it would be:

``` php
// Collection of user entities (or null if not available)
$users = $role->users;
```

## Loading Associations

Once you've defined your associations you can [eager load associations](../orm/retrieving-data-and-resultsets#eager-loading-associations) when fetching results.
