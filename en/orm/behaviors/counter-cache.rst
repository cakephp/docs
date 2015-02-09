CounterCache
############

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: CounterCacheBehavior

Often times web applications need to display counts of related objects. For
example, when showing a list of articles you may want to display how many
comments it has. Or when showing a user you might want to show how many
friends/followers she has. The CounterCache behavior is intended for these
situations.

Basic Usage
===========

You enable the CounterCache behavior like any other behavior, but it won't do
anything until you configure some relations and the field counts that should be
stored on each of them. Using our example below, we could cache the comment
count for each article with the following::

    class CommentsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('CounterCache', [
                'Articles' => ['comment_count']
            ]);
        }
    }

The CounterCache configuration should be a map of relation names and the
specific configuration for that relation.

The counter's value will be updated each time an entity is saved or deleted. The
counter **will not** be updated when you use ``updateAll()`` or ``deleteAll()``,
or execute SQL you have written.

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
                'findType' => 'published'
            ]
        ]
    ]);

If you don't have a custom finder method you can provide an array of conditions
to find records instead::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'comment_count' => [
                'conditions' => ['Comments.spam' => false]
            ]
        ]
    ]);

Lastly, if a custom finder and conditions are not suitable you can provide
a callback method. This callable must return the count value to be stored::

    $this->addBehavior('CounterCache', [
        'Articles' => [
            'rating_avg' => function ($event, $entity, $table) {
                return 4.5;
            }
        ]
    ]);
