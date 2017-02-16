Saving Data
###########

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

After you have :doc:`loaded your data</orm/retrieving-data-and-resultsets>` you
will probably want to update and save the changes.

A Glance Over Saving Data
=========================

Applications will usually have a couple of ways in which data is saved. The
first one is obviously through web forms and the other is by directly generating
or changing data in the code to be sent to the database.

Inserting Data
--------------

The easiest way to insert data in the database is by creating a new entity and
passing it to the ``save()`` method in the ``Table`` class::

    use Cake\ORM\TableRegistry;

    $articlesTable = TableRegistry::get('Articles');
    $article = $articlesTable->newEntity();

    $article->title = 'A New Article';
    $article->body = 'This is the body of the article';

    if ($articlesTable->save($article)) {
        // The $article entity contains the id now
        $id = $article->id;
    }

Updating Data
-------------

Updating your data is equally easy, and the ``save()`` method is also used for
that purpose::

    use Cake\ORM\TableRegistry;

    $articlesTable = TableRegistry::get('Articles');
    $article = $articlesTable->get(12); // Return article with id 12

    $article->title = 'CakePHP is THE best PHP framework!';
    $articlesTable->save($article);

CakePHP will know whether to perform an insert or an update based on the return
value of the ``isNew()`` method. Entities that were retrieved with ``get()`` or
``find()`` will always return ``false`` when ``isNew()`` is called on them.

Saving With Associations
------------------------

By default the ``save()`` method will also save one level of associations::

    $articlesTable = TableRegistry::get('Articles');
    $author = $articlesTable->Authors->findByUserName('mark')->first();

    $article = $articlesTable->newEntity();
    $article->title = 'An article by mark';
    $article->author = $author;

    if ($articlesTable->save($article)) {
        // The foreign key value was set automatically.
        echo $article->author_id;
    }

The ``save()`` method is also able to create new records for associations::

    $firstComment = $articlesTable->Comments->newEntity();
    $firstComment->body = 'The CakePHP features are outstanding';

    $secondComment = $articlesTable->Comments->newEntity();
    $secondComment->body = 'CakePHP performance is terrific!';

    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag2 = $articlesTable->Tags->newEntity();
    $tag2->name = 'awesome';

    $article = $articlesTable->get(12);
    $article->comments = [$firstComment, $secondComment];
    $article->tags = [$tag1, $tag2];

    $articlesTable->save($article);

Associate Many To Many Records
------------------------------

The previous example demonstrates how to associate a few tags to an article.
Another way of accomplishing the same thing is by using the ``link()``
method in the association::

    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag2 = $articlesTable->Tags->newEntity();
    $tag2->name = 'awesome';

    $articlesTable->Tags->link($article, [$tag1, $tag2]);

Saving Data To The Join Table
-----------------------------

Saving data to the join table is done by using the special ``_joinData``
property. This property should be an ``Entity`` instance from the join Table
class::

    // Link records for the first time.
    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag1->_joinData = $articlesTable->ArticlesTags->newEntity();
    $tag1->_joinData->tagComment = 'The CakePHP ORM is so powerful!';

    $articlesTable->Tags->link($article, [$tag1]);

    // Update an existing association.
    $article = $articlesTable->get(1, ['contain' => ['Tags']]);
    $article->tags[0]->_joinData->tagComment = 'Fresh comment.'

    // Necessary because we are changing a property directly
    $article->dirty('tags', true);

    $articlesTable->save($article, ['associated' => ['Tags']]);

You can also create/update join table information when using ``newEntity()`` or
``patchEntity()``. Your POST data should look like::

    $data = [
        'title' => 'My great blog post',
        'body' => 'Some content that goes on for a bit.',
        'tags' => [
            [
                'id' => 10,
                '_joinData' => [
                    'tagComment' => 'Great article!',
                ]
            ],
        ]
    ];
    $articlesTable->newEntity($data, ['associated' => ['Tags']]);

Unlink Many To Many Records
---------------------------

Unlinking many to many records is done via the ``unlink()`` method::

    $tags = $articlesTable
        ->Tags
        ->find()
        ->where(['name IN' => ['cakephp', 'awesome']])
        ->toArray();

    $articlesTable->Tags->unlink($article, $tags);

When modifying records by directly setting or changing the properties no
validation happens, which is a problem when accepting form data. The following
sections will demonstrate how to efficiently convert form data into entities so
that they can be validated and saved.

.. _converting-request-data:

Converting Request Data into Entities
=====================================

Before editing and saving data back to your database, you'll need to convert
the request data from the array format held in the request, and the entities
that the ORM uses. The Table class provides an easy and efficient way to convert
one or many entities from request data. You can convert a single entity using::

    // In a controller
    $articles = TableRegistry::get('Articles');

    // Validate and convert to an Entity object
    $entity = $articles->newEntity($this->request->getData());

.. note::

    If you are using newEntity() and the resulting entities are missing some or
    all of the data they were passed, double check that the columns you want to
    set are listed in the ``$_accessible`` property of your entity. See :ref:`entities-mass-assignment`.

The request data should follow the structure of your entities. For example if
you have an article, which belonged to a user, and had many comments, your
request data should resemble::

    $data = [
        'title' => 'CakePHP For the Win',
        'body' => 'Baking with CakePHP makes web development fun!',
        'user_id' => 1,
        'user' => [
            'username' => 'mark'
        ],
        'comments' => [
            ['body' => 'The CakePHP features are outstanding'],
            ['body' => 'CakePHP performance is terrific!'],
        ]
    ];

By default, the ``newEntity()`` method validates the data that gets passed to
it, as explained in the :ref:`validating-request-data` section. If you wish to
bypass data validation pass the ``'validate' => false`` option::

    $entity = $articles->newEntity($data, ['validate' => false]);

When building forms that save nested associations, you need to define which
associations should be marshalled::

    // In a controller
    $articles = TableRegistry::get('Articles');

    // New entity with nested associations
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => [
            'Tags', 'Comments' => ['associated' => ['Users']]
        ]
    ]);

You may also disable marshalling of possible nested associations like so::

    $entity = $articles->newEntity($data, ['associated' => []]);
    // or...
    $entity = $articles->patchEntity($entity, $data, ['associated' => []]);

The above indicates that the 'Tags', 'Comments' and 'Users' for the Comments
should be marshalled. Alternatively, you can use dot notation for brevity::

    // In a controller
    $articles = TableRegistry::get('Articles');

    // New entity with nested associations using dot notation
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => ['Tags', 'Comments.Users']
    ]);

Associated data is also validated by default unless told otherwise. You may also
change the validation set to be used per association::

    // In a controller
    $articles = TableRegistry::get('Articles');

    // Bypass validation on Tags association and
    // Designate 'signup' validation set for Comments.Users
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => [
            'Tags' => ['validate' => false],
            'Comments.Users' => ['validate' => 'signup']
        ]
    ]);

The :ref:`using-different-validators-per-association` chapter has more
information on how to use different validators for associated marshalling.

The following diagram gives an overview of what happens inside the
``newEntity()`` or ``patchEntity()`` method:

.. figure:: /_static/img/validation-cycle.png
   :align: left
   :alt: Flow diagram showing the marshalling/validation process.

You can always count on getting an entity back from ``newEntity()``. If
validation fails your entity will contain errors, and any invalid fields will
not be populated in the created entity.

Converting BelongsToMany Data
-----------------------------

If you are saving belongsToMany associations you can either use a list of entity
data or a list of ids. When using a list of entity data your request data should
look like::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'tags' => [
            ['tag' => 'CakePHP'],
            ['tag' => 'Internet'],
        ]
    ];

The above will create 2 new tags. If you want to link an article with existing
tags you can use a list of ids. Your request data should look like::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'tags' => [
            '_ids' => [1, 2, 3, 4]
        ]
    ];

If you need to link against some existing belongsToMany records, and create new
ones at the same time you can use an expanded format::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'tags' => [
            ['name' => 'A new tag'],
            ['name' => 'Another new tag'],
            ['id' => 5],
            ['id' => 21]
        ]
    ];

When the above data is converted into entities, you will have 4 tags. The first
two will be new objects, and the second two will be references to existing
records.

When converting belongsToMany data, you can disable the new entity creation, by
using the ``onlyIds`` option. When enabled, this option restricts belongsToMany
marshalling to only use the ``_ids`` key and ignore all other data.

.. versionadded:: 3.1.0
    The ``onlyIds`` option was added in 3.1.0

Converting HasMany Data
-----------------------

If you want to update existing hasMany associations and update their
properties, you should first ensure your entity is loaded with the hasMany
association populated. You can then use request data similar to::

    $data = [
        'title' => 'My Title',
        'body' => 'The text',
        'comments' => [
            ['id' => 1, 'comment' => 'Update the first comment'],
            ['id' => 2, 'comment' => 'Update the second comment'],
            ['comment' => 'Create a new comment'],
        ]
    ];

If you are saving hasMany associations and want to link existing records to a
new parent record you can use the ``_ids`` format::

    $data = [
        'title' => 'My new article',
        'body' => 'The text',
        'user_id' => 1,
        'comments' => [
            '_ids' => [1, 2, 3, 4]
        ]
    ];

When converting hasMany data, you can disable the new entity creation, by using
the ``onlyIds`` option. When enabled, this option restricts hasMany marshalling
to only use the ``_ids`` key and ignore all other data.

.. versionadded:: 3.1.0
    The ``onlyIds`` option was added in 3.1.0

Converting Multiple Records
---------------------------

When creating forms that create/update multiple records at once you can use
``newEntities()``::

    // In a controller.
    $articles = TableRegistry::get('Articles');
    $entities = $articles->newEntities($this->request->getData());

In this situation, the request data for multiple articles should look like::

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


.. _changing-accessible-fields:

Changing Accessible Fields
--------------------------

It's also possible to allow ``newEntity()`` to write into non accessible fields.
For example, ``id`` is usually absent from the ``_accessible`` property.
In such case, you can use the ``accessibleFields`` option. It could be useful to keep
ids of associated entities::

    // In a controller
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => [
            'Tags', 'Comments' => [
                'associated' => [
                    'Users' => [
                        'accessibleFields' => ['id' => true]
                    ]
                ]
            ]
        ]
    ]);

The above will keep the association unchanged between Comments and Users for the
concerned entity.

.. note::

    If you are using newEntity() and the resulting entities are missing some or
    all of the data they were passed, double check that the columns you want to
    set are listed in the ``$_accessible`` property of your entity. See :ref:`entities-mass-assignment`.

Merging Request Data Into Entities
----------------------------------

In order to update entities you may choose to apply request data directly to an
existing entity. This has the advantage that only the fields that actually
changed will be saved, as opposed to sending all fields to the database to be
persisted. You can merge an array of raw data into an existing entity using the
``patchEntity()`` method::

    // In a controller.
    $articles = TableRegistry::get('Articles');
    $article = $articles->get(1);
    $articles->patchEntity($article, $this->request->getData());
    $articles->save($article);


Validation and patchEntity
~~~~~~~~~~~~~~~~~~~~~~~~~~

Similar to ``newEntity()``, the ``patchEntity`` method will validate the data
before it is copied to the entity. The mechanism is explained in the
:ref:`validating-request-data` section. If you wish to disable validation while
patching an entity, pass the ``validate`` option as follows::

    // In a controller.
    $articles = TableRegistry::get('Articles');
    $article = $articles->get(1);
    $articles->patchEntity($article, $data, ['validate' => false]);

You may also change the validation set used for the entity or any of the
associations::

    $articles->patchEntity($article, $this->request->getData(), [
        'validate' => 'custom',
        'associated' => ['Tags', 'Comments.Users' => ['validate' => 'signup']]
    ]);

Patching HasMany and BelongsToMany
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

As explained in the previous section, the request data should follow the
structure of your entity. The ``patchEntity()`` method is equally capable of
merging associations, by default only the first level of associations are
merged, but if you wish to control the list of associations to be merged or
merge deeper to deeper levels, you can use the third parameter of the method::

    // In a controller.
    $associated = ['Tags', 'Comments.Users'];
    $article = $articles->get(1, ['contain' => $associated]);
    $articles->patchEntity($article, $this->request->getData(), [
        'associated' => $associated
    ]);
    $articles->save($article);

Associations are merged by matching the primary key field in the source entities
to the corresponding fields in the data array. Associations will construct new
entities if no previous entity is found for the association's target property.

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

The same can be said about hasMany and belongsToMany associations, with
an important caveat:

.. note::

    For belongsToMany associations, ensure the relevant entity has
    a property accessible for the associated entity.

If a Product belongsToMany Tag::

    // in the Product Entity
    protected $_accessible = [
        // .. other properties
       'tags' => true,
    ];

.. note::

    For hasMany and belongsToMany associations, if there were any entities that
    could not be matched by primary key to a record in the data array, then
    those records will be discarded from the resulting entity.

    Remember that using either ``patchEntity()`` or ``patchEntities()`` does not
    persist the data, it just edits (or creates) the given entities. In order to
    save the entity you will have to call the table's ``save()`` method.

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
    $articles->save($entity);

    $newData = [
        'comments' => [
            ['body' => 'Changed comment', 'id' => 1],
            ['body' => 'A new comment'],
        ]
    ];
    $articles->patchEntity($entity, $newData);
    $articles->save($entity);

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
matched to anything in the ``$newData`` array. This happens because CakePHP is
reflecting the new state described in the request data.

Some additional advantages of this approach is that it reduces the number of
operations to be executed when persisting the entity again.

Please note that this does not mean that the comment with id 2 was removed from
the database, if you wish to remove the comments for that article that are not
present in the entity, you can collect the primary keys and execute a batch
delete for those not in the list::

    // In a controller.
    $comments = TableRegistry::get('Comments');
    $present = (new Collection($entity->comments))->extract('id')->filter()->toArray();
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
    $patched = $articles->patchEntities($list, $this->request->getData());
    foreach ($patched as $entity) {
        $articles->save($entity);
    }

Similarly to using ``patchEntity()``, you can use the third argument for
controlling the associations that will be merged in each of the entities in the
array::

    // In a controller.
    $patched = $articles->patchEntities(
        $list,
        $this->request->getData(),
        ['associated' => ['Tags', 'Comments.Users']]
    );


.. _before-marshal:

Modifying Request Data Before Building Entities
-----------------------------------------------

If you need to modify request data before it is converted into entities, you can
use the ``Model.beforeMarshal`` event. This event lets you manipulate the
request data just before entities are created::

    // Include use statements at the top of your file.
    use Cake\Event\Event;
    use ArrayObject;

    // In a table or behavior class
    public function beforeMarshal(Event $event, ArrayObject $data, ArrayObject $options)
    {
       if (isset($data['username'])) {
           $data['username'] = mb_strtolower($data['username']);
       }

The ``$data`` parameter is an ``ArrayObject`` instance, so you don't have to
return it to change the data used to create entities.

The main purpose of ``beforeMarshal`` is to assist the users to pass the
validation process when simple mistakes can be automatically resolved, or when
data needs to be restructured so it can be put into the right fields.

The ``Model.beforeMarshal`` event is triggered just at the start of the
validation process, one of the reasons is that ``beforeMarshal`` is allowed to
change the validation rules and the saving options, such as the field whitelist.
Validation is triggered just after this event is finished. A common example of
changing the data before it is validated is trimming all fields before saving::

    // Include use statements at the top of your file.
    use Cake\Event\Event;
    use ArrayObject;

    // In a table or behavior class
    public function beforeMarshal(Event $event, ArrayObject $data, ArrayObject $options)
    {
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = trim($value);
            }
        }
    }

Because of how the marshalling process works, if a field does not pass
validation it will automatically be removed from the data array and not be
copied into the entity. This is to prevent inconsistent data from entering the
entity object.

Moreover, the data in ``beforeMarshal`` is a copy of the passed data. This is
because it is important to preserve the original user input, as it may be used
elsewhere.

Validating Data Before Building Entities
----------------------------------------

The :doc:`/orm/validation` chapter has more information on how to use the
validation features of CakePHP to ensure your data stays correct and consistent.

Avoiding Property Mass Assignment Attacks
-----------------------------------------

When creating or merging entities from request data you need to be careful of
what you allow your users to change or add in the entities. For example, by
sending an array in the request containing the ``user_id`` an attacker could
change the owner of an article, causing undesirable effects::

    // Contains ['user_id' => 100, 'title' => 'Hacked!'];
    $data = $this->request->getData();
    $entity = $this->patchEntity($entity, $data);
    $this->save($entity);

There are two ways of protecting you against this problem. The first one is by
setting the default columns that can be safely set from a request using the
:ref:`entities-mass-assignment` feature in the entities.

The second way is by using the ``fieldList`` option when creating or merging
data into an entity::

    // Contains ['user_id' => 100, 'title' => 'Hacked!'];
    $data = $this->request->getData();

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
``newEntities()`` and ``patchEntities()`` methods.

.. _saving-entities:

Saving Entities
===============

.. php:method:: save(Entity $entity, array $options = [])

When saving request data to your database you need to first hydrate a new entity
using ``newEntity()`` for passing into ``save()``. For example::

  // In a controller
  $articles = TableRegistry::get('Articles');
  $article = $articles->newEntity($this->request->getData());
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
10. The ``Model.afterSaveCommit`` event will be dispatched.

The following diagram illustrates the above process:

.. figure:: /_static/img/save-cycle.png
   :align: left
   :alt: Flow diagram showing the save process.

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
    $articles->save($entity, ['associated' => ['Comments']]);

You can define save distant or deeply nested associations by using dot notation::

    // Save the company, the employees and related addresses for each of them.
    $companies->save($entity, ['associated' => ['Employees.Addresses']]);

Moreover, you can combine the dot notation for associations with the options
array::

    $companies->save($entity, [
      'associated' => [
        'Employees',
        'Employees.Addresses'
      ]
    ]);

Your entities should be structured in the same way as they are when loaded from
the database. See the form helper documentation for :ref:`how to build inputs
for associations <associated-form-inputs>`.

If you are building or modifying association data after building your entities
you will have to mark the association property as modified with ``dirty()``::

    $company->author->name = 'Master Chef';
    $company->dirty('author', true);

Saving BelongsTo Associations
-----------------------------

When saving belongsTo associations, the ORM expects a single nested entity named with
the singular, :ref:`underscored <inflector-methods-summary>` version of the association name. For example::

    // In a controller.
    $data = [
        'title' => 'First Post',
        'user' => [
            'id' => 1,
            'username' => 'mark'
        ]
    ];
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Users']
    ]);

    $articles->save($article);

Saving HasOne Associations
--------------------------

When saving hasOne associations, the ORM expects a single nested entity named with the
singular, :ref:`underscored <inflector-methods-summary>` version of the association name. For example::

    // In a controller.
    $data = [
        'id' => 1,
        'username' => 'cakephp',
        'profile' => [
            'twitter' => '@cakephp'
        ]
    ];
    $users = TableRegistry::get('Users');
    $user = $users->newEntity($data, [
        'associated' => ['Profiles']
    ]);
    $users->save($user);

Saving HasMany Associations
---------------------------

When saving hasMany associations, the ORM expects an array of entities named with the
plural, :ref:`underscored <inflector-methods-summary>` version of the association name. For example::

    // In a controller.
    $data = [
        'title' => 'First Post',
        'comments' => [
            ['body' => 'Best post ever'],
            ['body' => 'I really like this.']
        ]
    ];
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Comments']
    ]);
    $articles->save($article);

When saving hasMany associations, associated records will either be updated, or
inserted. For the case that the record already has associated records in the
database, you have the choice between two saving strategies:

append
    Associated records are updated in the database or, if not matching any
    existing record, inserted.
replace
    Any existing records that do not match the records provided will be deleted
    from the database. Only provided records will remain (or be inserted).

By default the ``append`` saving strategy is used.
See :ref:`has-many-associations` for details on defining the ``saveStrategy``.

Whenever you add new records into an existing association you should always mark
the association property as 'dirty'. This lets the ORM know that the association
property has to be persisted::

    $article->comments[] = $comment;
    $article->dirty('comments', true);

Without the call to ``dirty()`` the updated comments will not be saved.

Saving BelongsToMany Associations
---------------------------------

When saving belongsToMany associations, the ORM expects an array of entities named with
the plural, :ref:`underscored <inflector-methods-summary>` version of the association name. For example::

    // In a controller.
    $data = [
        'title' => 'First Post',
        'tags' => [
            ['tag' => 'CakePHP'],
            ['tag' => 'Framework']
        ]
    ];
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Tags']
    ]);
    $articles->save($article);

When converting request data into entities, the ``newEntity()`` and
``newEntities()`` methods will handle both arrays of properties, as well as a
list of ids at the ``_ids`` key. Using the ``_ids`` key makes it easy to build a
select box or checkbox based form controls for belongs to many associations. See
the :ref:`converting-request-data` section for more information.

When saving belongsToMany associations, you have the choice between two saving
strategies:

append
    Only new links will be created between each side of this association. This
    strategy will not destroy existing links even though they may not be present
    in the array of entities to be saved.
replace
    When saving, existing links will be removed and new links will be created in
    the junction table. If there are existing link in the database to some of
    the entities intended to be saved, those links will be updated, not deleted
    and then re-saved.
    
See :ref:`belongs-to-many-associations` for details on defining the ``saveStrategy``.

By default the ``replace`` strategy is used. Whenever you add new records into
an existing association you should always mark the association property as
'dirty'. This lets the ORM know that the association property has to be
persisted::

    $article->tags[] = $tag;
    $article->dirty('tags', true);

Without the call to ``dirty()`` the updated tags will not be saved.

Often you'll find yourself wanting to make an association between two existing
entities, eg. a user coauthoring an article. This is done by using the method
``link()``, like this::

    $article = $this->Articles->get($articleId);
    $user = $this->Users->get($userId);

    $this->Articles->Users->link($article, [$user]);

When saving belongsToMany Associations, it can be relevant to save some
additional data to the junction Table. In the previous example of tags, it could
be the ``vote_type`` of person who voted on that article. The ``vote_type`` can
be either ``upvote`` or ``downvote`` and is represented by a string. The
relation is between Users and Articles.

Saving that association, and the ``vote_type`` is done by first adding some data
to ``_joinData`` and then saving the association with ``link()``, example::

    $article = $this->Articles->get($articleId);
    $user = $this->Users->get($userId);

    $user->_joinData = new Entity(['vote_type' => $voteType], ['markNew' => true]);
    $this->Articles->Users->link($article, [$user]);

Saving Additional Data to the Join Table
----------------------------------------

In some situations the table joining your BelongsToMany association, will have
additional columns on it. CakePHP makes it simple to save properties into these
columns. Each entity in a belongsToMany association has a ``_joinData`` property
that contains the additional columns on the junction table. This data can be
either an array or an Entity instance. For example if Students BelongsToMany
Courses, we could have a junction table that looks like::

    id | student_id | course_id | days_attended | grade

When saving data you can populate the additional columns on the junction table
by setting data to the ``_joinData`` property::

    $student->courses[0]->_joinData->grade = 80.12;
    $student->courses[0]->_joinData->days_attended = 30;

    $studentsTable->save($student);

The ``_joinData`` property can be either an entity, or an array of data if you
are saving entities built from request data. When saving junction table data
from request data your POST data should look like::

    $data = [
        'first_name' => 'Sally',
        'last_name' => 'Parker',
        'courses' => [
            [
                'id' => 10,
                '_joinData' => [
                    'grade' => 80.12,
                    'days_attended' => 30
                ]
            ],
            // Other courses.
        ]
    ];
    $student = $this->Students->newEntity($data, [
        'associated' => ['Courses._joinData']
    ]);

See the :ref:`associated-form-inputs` documentation for how to build inputs with
``FormHelper`` correctly.

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
This means that when retrieving data for that column, it will be unserialized
from a JSON string in the database and put into an entity as an array.

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

Strict Saving
=============

.. php:method:: saveOrFail($entity, $options = [])


Using this method will throw an :php:exc:`Cake\\ORM\\Exception\\PersistenceFailedException`
if the application rules checks failed, the entity contains errors or the save was aborted by a callback.
Using this can be helpful when you performing complex database operations without human monitoring,
for example, inside a Shell task.

If you want to track down the entity that failed to save, you can use the
:php:meth:`Cake\\ORM\Exception\\PersistenceFailedException::getEntity()` method::

        try {
            $table->saveOrFail($entity);
        } catch (\Cake\ORM\Exception\PersistenceFailedException $e) {
            echo $e->getEntity();
        }

As this internally perfoms a :php:meth:`Cake\\ORM\\Table::save()` call, all corresponding save events
will be triggered.

.. versionadded:: 3.4.1

Saving Multiple Entities
========================

.. php:method:: saveMany($entities, $options = [])


Using this method you can save multiple entities atomically. ``$entites`` can
be an array of entities created using ``newEntities()`` / ``patchEntities()``.
``$options`` can have the same options as accepted by ``save()``::

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
    $articles = TableRegistry::get('Articles');
    $entities = $articles->newEntities($data);
    $result = $articles->saveMany($entities);

The result will be updated entities on success or ``false`` on failure.

.. versionadded:: 3.2.8

Bulk Updates
============

.. php:method:: updateAll($fields, $conditions)

There may be times when updating rows individually is not efficient or
necessary. In these cases it is more efficient to use a bulk-update to modify
many rows at once::

    // Publish all the unpublished articles.
    function publishAllUnpublished()
    {
        $this->updateAll(
            ['published' => true], // fields
            ['published' => false]); // conditions
    }

If you need to do bulk updates and use SQL expressions, you will need to use an
expression object as ``updateAll()`` uses prepared statements under the hood::

    use Cake\Database\Expression\QueryExpression;

    ...

    function incrementCounters()
    {
        $expression = new QueryExpression('view_count = view_count + 1');
        $this->updateAll([$expression], ['published' => true]);
    }

A bulk-update will be considered successful if 1 or more rows are updated.

.. warning::

    updateAll will *not* trigger beforeSave/afterSave events. If you need those
    first load a collection of records and update them.


``updateAll()`` is for convenience only. You can use this more flexible
interface as well::

    // Publish all the unpublished articles.
    function publishAllUnpublished()
    {
        $this->query()
            ->update()
            ->set(['published' => true])
            ->where(['published' => false])
            ->execute();
    }

Also see: :ref:`query-builder-updating-data`.
