CounterCache
############

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: CounterCacheBehavior

Often times web applications need to display counts of related objects. For
example, when showing a list of articles you may want to display how many
comments it has. Or when showing a user you might want to show how many
friends/followers she has. The CounterCache behavior is intended for these
situations. CounterCache will update a field in the associated models assigned
in the options when it is invoked. The fields should exist in the database and
be of the type INT.

Basic Usage
===========

You enable the CounterCache behavior like any other behavior, but it won't do
anything until you configure some relations and the field counts that should be
stored on each of them. Using our example below, we could cache the comment
count for each article with the following::

    class CommentsTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('CounterCache', [
                'Articles' => ['comment_count']
            ]);
        }
    }


.. note::

    The column ``comment_count`` should exist in the ``articles`` table.

The CounterCache configuration should be a map of relation names and the
specific configuration for that relation.

As you see you need to add the behavior on the "other side" of the association
where you actually want the field to be updated. In this example the behavior
is added to the ``CommentsTable`` even though it updates the ``comment_count``
field in the ``ArticlesTable``.

The counter's value will be updated each time an entity is saved or deleted.
The counter **will not** be updated when you

- save the entity without changing data or
- use ``updateAll()`` or
- use ``deleteAll()`` or
- execute SQL you have written

Advanced Usage
==============

If you need to keep a cached counter for less than all of the related records,
you can supply additional conditions or finder methods to generate a
counter value::

    // Use a specific find method.
    // In this case find(published)
    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'finder' => 'published',
            ],
        ],
    ]);

If you don't have a custom finder method you can provide an array of conditions
to find records instead::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'conditions' => ['Comments.spam' => false],
            ],
        ],
    ]);

If you want CounterCache to update multiple fields, for example both showing a
conditional count and a basic count you can add these fields in the array::

    $this->addBehavior('CounterCache', [
        'Articles' => ['comment_count',
            'published_comment_count' => [
                'finder' => 'published',
            ],
        ],
    ]);

If you want to calculate the CounterCache field value on your own, you can set
the ``ignoreDirty`` option to ``true``.
This will prevent the field from being recalculated if you've set it dirty
before::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'ignoreDirty' => true,
            ],
        ],
    ]);

Lastly, if a custom finder and conditions are not suitable you can provide
a callback function. Your function must return the count value to be stored::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'rating_avg' => function ($event, $entity, $table, $original) {
                return 4.5;
            }
        ],
    ]);

Your function can return ``false`` to skip updating the counter column, or
a ``SelectQuery`` object that produced the count value. If you return a ``SelectQuery``
object, your query will be used as a subquery in the update statement.  The
``$table`` parameter refers to the table object holding the behavior (not the
target relation) for convenience. The callback is invoked at least once with
``$original`` set to ``false``. If the entity-update changes the association
then the callback is invoked a *second* time with ``true``, the return value
then updates the counter of the *previously* associated item.

.. note::

    The CounterCache behavior works for ``belongsTo`` associations only. For
    example for "Comments belongsTo Articles", you need to add the CounterCache
    behavior to the ``CommentsTable`` in order to generate ``comment_count`` for
    Articles table.

.. versionchanged:: 5.1.2

    As of CakePHP 5.1.2, the counter cache values are updated using a single
    query using sub-queries, instead of separate queries, to fetch the count and
    update a record. If required you can disable the use of sub-queries by
    setting `useSubQuery` key to `false` in the config
    `['Articles' => ['comment_count' => ['useSubQuery' => false]]`

Belongs to many Usage
=====================

It is possible to use the CounterCache behavior in a ``belongsToMany`` association.
First, you need to add the ``through`` and ``cascadeCallbacks`` options to the
``belongsToMany`` association::

    'through'          => 'CommentsArticles',
    'cascadeCallbacks' => true

Also see :ref:`using-the-through-option` how to configure a custom join table.

The ``CommentsArticles`` is the name of the junction table classname.
If you don't have it you should create it with the bake CLI tool.

In this ``src/Model/Table/CommentsArticlesTable.php`` you then need to add the behavior
with the same code as described above.::

    $this->addBehavior('CounterCache', [
        'Articles' => ['comments_count'],
    ]);

Finally clear all caches with ``bin/cake cache clear_all`` and try it out.

Manually updating counter caches
================================

.. php:method:: updateCounterCache(?string $assocName = null, int $limit = 100, ?int $page = null): void

The ``updateCounterCache()`` method allows you to update the counter cache values
for all records of one or all configured associations in batches. This can be useful,
for example, to update the counter cache after importing data directly into the database.::

    // Update the counter cache for all configured associations
    $table->updateCounterCache();

    // Update the counter cache for a specific association, 200 records per batch
    $table->updateCounterCache('Articles', 200);

    // Update only the first page of records
    $table->updateCounterCache('Articles', page: 1);

.. versionadded:: 5.2.0

.. note::

    This methods won't update the counter cache values for fields which are
    configured to use a closure to get the count value.
