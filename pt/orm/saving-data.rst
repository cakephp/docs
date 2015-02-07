Saving Data
###########

.. php:namespace:: Cake\ORM

.. php:class:: Table

After you have :doc:`loaded your data</orm/retrieving-data-and-resultsets>` you
will probably want to update & save the changes.

.. _converting-request-data:

Converting Request Data into Entities
=====================================

Before editing and saving data back into the database, you'll need to convert
the request data from the array format held in the request, and the entities
that the ORM uses. The Table class provides an easy way to convert one or many
entities from request data. You can convert a single entity using::

    // In a controller.
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->data());

The request data should follow the structure of your entities. For example if
you had an article, which belonged to a user, and had many comments, your
request data should look like::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'user' => [
            'username' => 'mark'
        ],
        'comments' => [
            ['body' => 'First comment'],
            ['body' => 'Second comment'],
        ]
    ];

If you are saving belongsToMany associations you can either use a list of
entity data or a list of ids. When using a list of entity data your request data
should look like::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'tags' => [
            ['tag' => 'CakePHP'],
            ['tag' => 'Internet'],
        ]
    ];

When using a list of ids, your request data should look like::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'tags' => [
            '_ids' => [1, 2, 3, 4]
        ]
    ];

The marshaller will handle both of these forms correctly, but only for
belongsToMany associations.

When building forms that save nested associations, you need to define which
associations should be marshalled::

    // In a controller
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->data(), [
        'associated' => [
            'Tags', 'Comments' => ['associated' => ['Users']]
        ]
    ]);

The above indicates that the 'Tags', 'Comments' and 'Users' for the Comments
should be marshalled. Alternatively, you can use dot notation for brevity::

    // In a controller.
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->data(), [
        'associated' => ['Tags', 'Comments.Users']
    ]);

You can convert multiple entities using::

    // In a controller.
    $articles = TableRegistry::get('Articles');
    $entities = $articles->newEntities($this->request->data());

When converting multiple entities, the request data for multiple articles should
look like::

    $data = [
        [
            'title' => 'First post',
            'published' => 1
        ],
        [
            'title' => 'Second post',
            'published' => 1
        ],
    ];

Once you've converted request data into entities you can ``save()`` or
``delete()`` them::

    // In a controller.
    foreach ($entities as $entity) {
        // Save entity
        $articles->save($entity);

        // Delete entity
        $articles->delete($entity);
    }

The above will run a separate transaction for each entity saved. If you'd like
to process all the entities as a single transaction you can use
``transactional()``::

    // In a controller.
    $articles->connection()->transactional(function () use ($articles, $entities) {
        foreach ($entities as $entity) {
            $articles->save($entity, ['atomic' => false]);
        }
    });

.. note::

    If you are using newEntity() and the resulting entities are missing some or
    all of the data they were passed, double check that the columns you want to
    set are listed in the ``$_accessible`` property of your entity.

Merging Request Data Into Entities
----------------------------------

In order to update entities you may choose to apply request data directly to an
existing entity. This has the advantage that only the fields that actually
changed will be saved, as opposed to sending all fields to the database to be
persisted. You can merge an array of raw data into an existing entity using the
``patchEntity`` method::

    // In a controller.
    $articles = TableRegistry::get('Articles');
    $article = $articles->get(1);
    $articles->patchEntity($article, $this->request->data());
    $articles->save($article);

As explained in the previous section, the request data should follow the
structure of your entity. The ``patchEntity`` method is equally capable of
merging associations, by default only the first level of associations are
merged, but if you wish to control the list of associations to be merged or
merge deeper to deeper levels, you can use the third parameter of the method::

    // In a controller.
    $article = $articles->get(1);
    $articles->patchEntity($article, $this->request->data(), [
        'associated' => ['Tags', 'Comments.Users']
    ]);
    $articles->save($article);

Associations are merged by matching the primary key field in the source entities
to the corresponding fields in the data array. For belongsTo and hasOne
associations, new entities will be constructed if no previous entity is found
for the target property.

For example give some request data like the following::

    $data = [
        'title' => 'My title',
        'user' => [
            'username' => 'mark'
        ]
    ];

Trying to patch an entity without an entity in the user property will create
a new user entity::

    // In a controller.
    $entity = $articles->patchEntity(new Article, $data);
    echo $entity->user->username; // Echoes 'mark'

The same can be said about hasMany and belongsToMany associations, but an
important note should be made.

.. note::

    For hasMany and belongsToMany associations, if there were any entities that
    could not be matched by primary key to any record in the data array, then
    those records will be discarded from the resulting entity.

    Remember that using either ``patchEntity()`` or ``patchEntities()`` does not
    persist the data, it just edits (or creates) the given entities. In order to
    save the entity you will have to call the ``save()`` method.

For example, consider the following case::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'comments' => [
            ['body' => 'First comment', 'id' => 1],
            ['body' => 'Second comment', 'id' => 2],
        ]
    ];
    $entity = $articles->newEntity($data);

    $newData = [
        'comments' => [
            ['body' => 'Changed comment', 'id' => 1],
            ['body' => 'A new comment'],
        ]
    ];
    $articles->patchEntity($entity, $newData);
    $articles->save($article);

At the end, if the entity is converted back to an array you will obtain the
following result::

    [
        'title' => 'My title',
        'body' => 'The text',
        'comments' => [
            ['body' => 'Changed comment', 'id' => 1],
            ['body' => 'A new comment'],
        ]
    ];

As you can see, the comment with id 2 is no longer there, as it could not be
matched to anything in the ``$newData`` array. This is done this way to better
capture the intention of a request data post. The sent data is reflecting the
new state that the entity should have.

Some additional advantages of this approach is that it reduces the number of
operations to be executed when persisting the entity again.

Please note that this does not mean that the comment with id 2 was removed from
the database, if you wish to remove the comments for that article that are not
present in the entity, you can collect the primary keys and execute a batch
delete for those not in the list::

    // In a controller.
    $comments = TableRegistry::get('Comments');
    $present = (new Collection($entity->comments))->extract('id');
    $comments->deleteAll([
        'article_id' => $article->id,
        'id NOT IN' => $present
    ]);

As you can see, this also helps creating solutions where an association needs to
be implemented like a single set.

You can also patch multiple entities at once. The consideration made for
patching hasMany and belongsToMany associations apply for patching multiple
entities: Matches are done by the primary key field value and missing matches in
the original entities array will be removed and not present in the result::

    // In a controller.
    $articles = TableRegistry::get('Articles');
    $list = $articles->find('popular')->toArray();
    $patched = $articles->patchEntities($list, $this->request->data());
    foreach ($patched as $entity) {
        $articles->save($entity);
    }

Similarly to using ``patchEntity``, you can use the third argument for
controlling the associations that will be merged in each of the entities in the
array::

    // In a controller.
    $patched = $articles->patchEntities(
        $list,
        $this->request->data(),
        ['associated' => ['Tags', 'Comments.Users']]
    );

.. _validating-request-data:

Validating Data Before Building Entities
----------------------------------------

When marshalling data into entities, you can validate data. Validating data
allows you to check the type, shape and size of data. By default request data
will be validated before it is converted into entities.
If any validation rules fail, the returned entity will contain errors. The
fields with errors will not be present in the returned entity::

    $article = $articles->newEntity($this->request->data);
    if ($article->errors()) {
        // Entity failed validation.
    }

When building an entity with validation enabled the following things happen:

1. The validator object is created.
2. The ``table`` and ``default`` validation provider are attached.
3. The named validation method is invoked. For example, ``validationDefault``.
4. The ``Model.buildValidator`` event will be triggered.
5. Request data will be validated.
6. Request data will be type cast into types that match the column types.
7. Errors will be set into the entity.
8. Valid data will be set into the entity, while fields that failed validation
   will be left out.

If you'd like to disable validation when converting request data, set the
``validate`` option to false::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => false]
    );

In addition to disabling validation you can choose which validation rule set you
want applied::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => 'update']
    );

The above would call the ``validationUpdate`` method on the table instance to
build the required rules. By default the ``validationDefault`` method will be
used. A sample validator for our articles table would be::

    class ArticlesTable extends Table
    {
        public function validationUpdate($validator)
        {
            $validator
                ->add('title', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => __('You need to provide a title'),
                ])
                ->add('body', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => __('A body is required')
                ]);
            return $validator;
        }
    }

You can have as many validation sets as you need. See the :doc:`validation
chapter </core-libraries/validation>` for more information on building
validation rule-sets.

Validation rules can use functions defined on any known providers. By default
CakePHP sets up a few providers:

1. Methods on the table class, or its behaviors are available on the ``table``
   provider.
2. The core :php:class:`~Cake\\Validation\\Validation` class is setup as the
   ``default`` provider.

When a validation rule is created you can name the provider of that rule. For
example, if your entity had a 'isValidRole' method you could use it as
a validation rule::

    class UsersTable extends Table
    {

        public function validationDefault($validator)
        {
            $validator
                ->add('role', 'validRole', [
                    'rule' => 'isValidRole',
                    'message' => __('You need to provide a valid role'),
                    'provider' => 'table',
                ]);
            return $validator;
        }

    }

Avoiding Property Mass Assignment Attacks
-----------------------------------------

When creating or merging entities from request data you need to be careful of
what you allow your users to change or add in the entities. For example, by
sending an array in the request containing the ``user_id`` an attacker could
change the owner of an article, causing undesirable effects::

    // Contains ['user_id' => 100, 'title' => 'Hacked!'];
    $data = $this->request->data;
    $entity = $this->patchEntity($entity, $data);
    $this->save($entity);

There are two ways of protecting you against this problem. The first one is by
setting the default columns that can be safely set from a request using the
:ref:`entities-mass-assignment` feature in the entities.

The second way is by using the ``fieldList`` option when creating or merging
data into an entity::

    // Contains ['user_id' => 100, 'title' => 'Hacked!'];
    $data = $this->request->data;

    // Only allow title to be changed
    $entity = $this->patchEntity($entity, $data, [
        'fieldList' => ['title']
    ]);
    $this->save($entity);

You can also control which properties can be assigned for associations::

    // Only allow changing the title and tags
    // and the tag name is the only column that can be set
    $entity = $this->patchEntity($entity, $data, [
        'fieldList' => ['title', 'tags'],
        'associated' => ['Tags' => ['fieldList' => ['name']]]
    ]);
    $this->save($entity);

Using this feature is handy when you have many different functions your users
can access and you want to let your users edit different data based on their
privileges.

The ``fieldList`` options is also accepted by the ``newEntity()``,
``newEntities()`` and ``patchEntitites()`` methods.

.. _saving-entities:

Saving Entities
===============

.. php:method:: save(Entity $entity, array $options = [])

When saving request data to your database you need to first hydrate a new entity
using ``newEntity()`` for passing into ``save()``. For example::

  // In a controller
  $articles = TableRegistry::get('Articles');
  $article = $articles->newEntity($this->request->data);
  if ($articles->save($article)) {
      // ...
  }

The ORM uses the ``isNew()`` method on an entity to determine whether or not an
insert or update should be performed. If the ``isNew()`` method returns ``true``
and the entity has a primary key value, an 'exists' query will be issued. The
'exists' query can be suppressed by passing ``'checkExisting' => false`` in the
``$options`` argument::

    $articles->save($article, ['checkExisting' => false]);

Once you've loaded some entities you'll probably want to modify them and update
your database. This is a pretty simple exercise in CakePHP::

    $articles = TableRegistry::get('Articles');
    $article = $articles->find('all')->where(['id' => 2])->first();

    $article->title = 'My new title';
    $articles->save($article);

When saving, CakePHP will :ref:`apply your rules <application-rules>`, and wrap
the save operation in a database transaction. It will also only update
properties that have changed. The above ``save()`` call would generate SQL
like::

    UPDATE articles SET title = 'My new title' WHERE id = 2;

If you had a new entity, the following SQL would be generated::

    INSERT INTO articles (title) VALUES ('My new title');

When an entity is saved a few things happen:

1. Rule checking will be started if not disabled.
2. Rule checking will trigger the ``Model.beforeRules`` event. If this event is
   stopped, the save operation will fail and return ``false``.
3. Rules will be checked. If the entity is being created, the ``create`` rules
   will be used. If the entity is being updated, the ``update`` rules will be
   used.
4. The ``Model.afterRules`` event will be triggered.
5. The ``Model.beforeSave`` event is dispatched. If it is stopped, the save will
   be aborted, and save() will return ``false``.
6. Parent associations are saved. For example, any listed belongsTo
   associations will be saved.
7. The modified fields on the entity will be saved.
8. Child associations are saved. For example, any listed hasMany, hasOne, or
   belongsToMany associations will be saved.
9. The ``Model.afterSave`` event will be dispatched.

See the :ref:`application-rules` section for more information on creating and
using rules.

.. warning::

    If no changes are made to the entity when it is saved, the callbacks will
    not fire because no save is performed.

The ``save()`` method will return the modified entity on success, and ``false``
on failure. You can disable rules and/or transactions using the
``$options`` argument for save::

    // In a controller or table method.
    $articles->save($article, ['checkRules' => false, 'atomic' => false]);

Saving Associations
-------------------

When you are saving an entity, you can also elect to save some or all of the
associated entities. By default all first level entities will be saved. For
example saving an Article, will also automatically update any dirty entities
that are directly related to articles table.

You can fine tune which associations are saved by using the ``associated``
option::

    // In a controller.

    // Only save the comments association
    $articles->save($entity, ['associated' => ['Comments']);

You can define save distant or deeply nested associations by using dot notation::

    // Save the company, the employees and related addresses for each of them.
    $companies->save($entity, ['associated' => ['Employees.Addresses']]);

If you need to run a different validation rule set for any association you can
specify it as an options array for the association::

    // In a controller.

    // Save the company, the employees and related addresses for each of them.
    // For employees use the 'special' validation group
    $companies->save($entity, [
      'associated' => [
        'Employees' => [
          'associated' => ['Addresses'],
          'validate' => 'special',
        ]
      ]
    ]);

Moreover, you can combine the dot notation for associations with the options
array::

    $companies->save($entity, [
      'associated' => [
        'Employees',
        'Employees.Addresses' => ['validate' => 'special']
      ]
    ]);

Your entities should be structured in the same way as they are when
loaded from the database. See the form helper documentation for :ref:`how to
build inputs for associations <associated-form-inputs>`.

Saving BelongsTo Associations
-----------------------------

When saving belongsTo associations, the ORM expects a single nested entity at
the singular, camel cased version the association name. For
example::

    // In a controller.
    use App\Model\Entity\Article;
    use App\Model\Entity\User;

    $article = new Article(['title' => 'First post']);
    $article->user = new User(['id' => 1, 'username' => 'mark']);

    $articles = TableRegistry::get('Articles');
    $articles->save($article);

Saving HasOne Associations
--------------------------

When saving hasOne associations, the ORM expects a single nested entity at the
singular, camel cased version the association name. For example::

    // In a controller.
    use App\Model\Entity\User;
    use App\Model\Entity\Profile;

    $user = new User(['id' => 1, 'username' => 'cakephp']);
    $user->profile = new Profile(['twitter' => '@cakephp']);

    $users = TableRegistry::get('Users');
    $users->save($user);

Saving HasMany Associations
---------------------------

When saving hasMany associations, the ORM expects an array of entities at the
plural, camel cased version the association name. For example::

    // In a controller.
    use App\Model\Entity\Article;
    use App\Model\Entity\Comment;

    $article = new Article(['title' => 'First post']);
    $article->comments = [
        new Comment(['body' => 'Best post ever']),
        new Comment(['body' => 'I really like this.']),
    ];

    $articles = TableRegistry::get('Articles');
    $articles->save($article);

When saving hasMany associations, associated records will either be updated, or
inserted. The ORM will not remove or 'sync' a hasMany association. Whenever you
add new records into an existing association you should always mark the
association property as 'dirty'. This lets the ORM know that the association
property has to be persisted::

    $article->comments[] = $comment;
    $article->dirty('comments', true);

Without the call to ``dirty()`` the updated comments will not be saved.

Saving BelongsToMany Associations
---------------------------------

When saving belongsToMany associations, the ORM expects an array of entities at the
plural, camel cased version the association name. For example::

    // In a controller.
    use App\Model\Entity\Article;
    use App\Model\Entity\Tag;

    $article = new Article(['title' => 'First post']);
    $article->tags = [
        new Tag(['tag' => 'CakePHP']),
        new Tag(['tag' => 'Framework']),
    ];

    $articles = TableRegistry::get('Articles');
    $articles->save($article);

When converting request data into entities, the ``newEntity`` and
``newEntities`` methods will handle both arrays of properties, as well as a list
of ids at the ``_ids`` key. Using the ``_ids`` key makes it easy to build a
select box or checkbox based form controls for belongs to many associations. See
the :ref:`converting-request-data` section for more information.

When saving belongsToMany associations, you have the choice between 2 saving
strategies:

append
    Only new links will be created between each side of this association. This
    strategy will not destroy existing links even though they may not be present
    in the array of entities to be saved.
replace
    When saving, existing links will be removed and new links will be created in
    the joint table. If there are existing link in the database to some of the
    entities intended to be saved, those links will be updated, not deleted and
    then re-saved.

By default the ``replace`` strategy is used. Whenever you add new records into
an existing association you should always mark the association property as
'dirty'. This lets the ORM know that the association property has to be
persisted::

    $article->tags[] = $tag;
    $article->dirty('tags', true);

Without the call to ``dirty()`` the updated tags will not be saved.

Saving Additional Data to the Joint Table
-----------------------------------------

In some situations the table joining your BelongsToMany association, will have
additional columns on it. CakePHP makes it simple to save properties into these
columns. Each entity in a belongsToMany association has a ``_joinData`` property
that contains the additional columns on the joint table. This data can be either
an array or an Entity instance. For example if Students BelongsToMany Courses,
we could have a joint table that looks like::

    id | student_id | course_id | days_attended | grade

When saving data you can populate the additional columns on the joint table by
setting data to the ``_joinData`` property::

    $student->courses[0]->_joinData->grade = 80.12;
    $student->courses[0]->_joinData->days_attended = 30;

    $studentsTable->save($student);

The ``_joinData`` property can be either an entity, or an array of data if you
are saving entities built from request data.

.. _saving-complex-types:

Saving Complex Types
--------------------

Tables are capable of storing data represented in basic types, like strings,
integers, floats, booleans, etc. But It can also be extended to accept more
complex types such as arrays or objects and serialize this data into simpler
types that can be saved in the database.

This functionality is achieved by using the custom types system. See the
:ref:`adding-custom-database-types` section to find out how to build custom
column Types::

    // In config/bootstrap.php
    use Cake\Database\Type;
    Type::map('json', 'App\Database\Type\JsonType');

    // In src/Model/Table/UsersTable.php
    use Cake\Database\Schema\Table as Schema;

    class UsersTable extends Table
    {

        protected function _initializeSchema(Schema $schema)
        {
            $schema->columnType('preferences', 'json');
            return $schema;
        }

    }

The code above maps the ``preferences`` column to the ``json`` custom type.
This means that when retrieving data for that column, it will be
unserialized from a JSON string in the database and put into an entity as an
array.

Likewise, when saved, the array will be transformed back into its JSON
representation::

    $user = new User([
        'preferences' => [
            'sports' => ['football', 'baseball'],
            'books' => ['Mastering PHP', 'Hamlet']
        ]
    ]);
    $usersTable->save($user);

When using complex types it is important to validate that the data you are
receiving from the end user is the correct type. Failing to correctly handle
complex data could result in malicious users being able to store data they
would not normally be able to.

.. _application-rules:

Applying Application Rules
==========================

While basic data validation is done when :ref:`request data is converted into
entities <validating-request-data>`, many applications also have more complex
validation that should only be applied to after basic validation has completed.
These types of rules are often referred to as 'domain rules' or 'application
rules'. CakePHP exposes this concept through 'RulesCheckers' which are applied
before entities are persisted. Some example domain rules are:

* Ensuring email uniqueness
* State transitions or workflow steps, for example updating an invoice's status.
* Preventing modification of soft deleted items.
* Enforcing usage/rate limit caps.

Creating a Rules Checker
------------------------

Rules checker classes are generally defined by the ``buildRules`` method in your
table class. Behaviors and other event subscribers can use the
``Model.buildRules`` event to augment the rules checker for a given Table
class::

    use Cake\ORM\RulesChecker;
    
    // In a table class
    public function buildRules(RulesChecker $rules)
    {
        // Add a rule that is applied for create and update operations
        $rules->add(function ($entity, $options) {
            // Return a boolean to indicate pass/fail
        });

        // Add a rule for create.
        $rules->addCreate(function ($entity, $options) {
        });

        // Add a rule for update
        $rules->addUpdate(function ($entity, $options) {
        });

        // Add a rule for the deleting.
        $rules->addDelete(function ($entity, $options) {
        });

        return $rules;
    }

Your rules functions can expect to get the Entity being checked, and an array of
options. The options array will contain ``errorField``, ``message``, and
``repository``. The ``repository`` option will contain the table class the rules
are attached to. Because rules accept any ``callable``, you can also use
instance functions::

    $rules->addCreate([$this, 'uniqueEmail']);

or callable classes::

    $rules->addCreate(new IsUnique(['email']));

When adding rules you can define the field the rule is for, and the error
message as options::

    $rules->add([$this, 'isValidState'], [
        'errorField' => 'status',
        'message' => 'This invoice cannot be moved to that status.'
    ]);

Creating Unique Field Rules
---------------------------

Because unique rules are quite common, CakePHP includes a simple Rule class that
allows you to easily define unique field sets::

    use Cake\ORM\Rule\IsUnique;

    // A single field.
    $rules->add($rules->isUnique(['email']));

    // A list of fields
    $rules->add($rules->isUnique(['username', 'account_id']));

Foreign Key Rules
-----------------

While you could rely on database errors to enforce constraints, using rules code
can help provide a nicer user experience. Because of this CakePHP includes an
``ExistsIn`` rule class::

    // A single field.
    $rules->add($rules->existsIn('article_id', 'articles'));

    // Multiple keys, useful for composite primary keys.
    $rules->add($rules->existsIn(['site_id', 'article_id'], 'articles'));

Using Entity Methods as Rules
-----------------------------

You may want to use entity methods as domain rules::

    $rules->add(function ($entity, $options) {
        return $entity->isOkLooking();
    });

Creating Custom Rule objects
----------------------------

If your application has rules that are commonly reused, it is helpful to package
those rules into re-usable classes::

    // in src/Model/Rule/CustomRule.php
    namespace App\Model\Rule;

    use Cake\Datasource\EntityInterface;

    class CustomRule
    {
        public function __invoke(EntityInterface $entity, array $options)
        {
            // Do work
            return false;
        }
    }


    // Add the custom rule
    use App\Model\Rule\CustomRule;

    $rules->add(new CustomRule(...));

By creating custom rule classes you can keep your code DRY and make your domain
rules easy to test.

Disabling Rules
---------------

When saving an entity, you can disable the rules if necessary::

    $articles->save($article, ['checkRules' => false]);

Bulk Updates
============

.. php:method:: updateAll($fields, $conditions)

There may be times when updating rows individually is not efficient or
necessary. In these cases it is more efficient to use a bulk-update to modify
many rows at once::

    // Publish all the unpublished articles.
    function publishAllUnpublished()
    {
        $this->updateAll(['published' => true], ['published' => false]);
    }

If you need to do bulk updates and use SQL expressions, you will need to use an
expression object as ``updateAll()`` uses prepared statements under the hood::

    function incrementCounters()
    {
        $expression = new QueryExpression('view_count = view_count + 1');
        $this->updateAll([$expression], ['published' => true]);
    }

A bulk-update will be considered successful if 1 or more rows are updated.

.. warning::

    updateAll will *not* trigger beforeSave/afterSave events. If you need those
    first load a collection of records and update them.
