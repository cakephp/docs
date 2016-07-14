Timestamp
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TimestampBehavior

..
    The timestamp behavior allows your table objects to update one or more
    timestamps on each model event. This is primarily used to populate data into
    ``created`` and ``modified`` fields. However, with some additional
    configuration, you can update any timestamp/datetime column on any event a table
    publishes.

TimestampビヘイビアはTableObjectを更新する度、もしくは各モデルのイベントのたびに許可し、 ``created`` や ``modified`` で使われています。
けれども、設定を追加すると、任意のtimestampとdatatimeカラムを任意のイベントで更新することができます。


Basic Usage
===========

You enable the timestamp behavior like any other behavior::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

The default configuration will do the following:

- When a new entity is saved the ``created`` and ``modified`` fields will be set
  to the current time.
- When an entity is updated, the ``modified`` field is set to the current time.

Using and Configuring the Behavior
==================================

If you need to modify fields with different names, or want to update additional
timestamp fields on custom events you can use some additional configuration::

    class OrdersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'updated_at' => 'always',
                    ],
                    'Orders.completed' => [
                        'completed_at' => 'always'
                    ]
                ]
            ]);
        }
    }

As you can see above, in addition to the standard ``Model.beforeSave`` event, we
are also updating the ``completed_at`` column when orders are completed.

Updating Timestamps on Entities
===============================

Sometimes you'll want to update just the timestamps on an entity without
changing any other properties. This is sometimes referred to as 'touching'
a record. In CakePHP you can use the ``touch()`` method to do exactly this::

    // Touch based on the Model.beforeSave event.
    $articles->touch($article);

    // Touch based on a specific event.
    $orders->touch($order, 'Orders.completed');

After you have saved the entity, the field is updated.

Touching records can be useful when you want to signal that a parent resource
has changed when a child resource is created/updated. For example: updating an
article when a new comment is added.

Saving Updates Without Modifying Timestamps
===========================================

To disable the automatic modification of the ``updated`` timestamp column when
saving an entity you can mark the attribute as 'dirty'::

    // Mark the modified column as dirty making
    // the current value be set on update.
    $order->dirty('modified', true);
