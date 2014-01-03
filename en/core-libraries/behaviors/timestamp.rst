Timestamp behavior
##################

.. php:namespace:: Cake\Model\Behavior

.. php:class:: TimestampBehavior

The timestamp behavior allows your table objects to update one or more timestamp
on each model event. This is primarily used to populate data into ``created``
and ``updated`` fields. With some additional configuration, you can update any
timestamp/datetime column on any event the table publishes.

Basic usage
===========

You enable the timestamp behavior like any other behavior::

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Timestamp');
        }
    }

The default configuration will do the following:

- When a new entity is saved the ``created`` and ``updated`` fields will be set
  to the current time.
- When an entity is updated, the ``updated`` field is updated.

Using and configuring the behavior
==================================

If you need to modify fields with different names, or want to update additional
timestamp fields on custom events you can add the TimestampBehavior with some
additional configuration::

    class OrdersTable extends Table {
        public function initialize(array $config) {
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

The above shows how you can use customized column names and subscribe to
additional events as well.

Updating timestamps on entities
===============================

Sometimes you'll want to update the just the timestamps on an entity without
changing any other properties. This is sometimes refered to as 'touching'
a record. In CakePHP you can use the ``touch()`` method to do exactly this::

    // Touch based on the Model.beforeSave event.
    $articles->touch($article);

    // Touch based on a specific event.
    $orders->touch($order, 'Orders.completed');

Touching records can be useful when you want to signal that a parent resource
has changed when a child resource is added/updated. For example updating an
article when a new comment is added.
