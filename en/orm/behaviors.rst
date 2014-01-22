Behaviors
#########

Behaviors are a way to organize and enable horizontal re-use of Model layer
logic. Conceptually they are similar to traits. However, behaviors are
implemented as separate class objects. This allows them to hook into the
life-cycle callbacks that models emit, while providing trait-like features.

Behaviors provide a convenient way to package up behavior that is common across
many models. For example, CakePHP includes a ``TimestampBehavior`` as many
models will want timestamps, and the logic to create and update timestamps is
not specific to any one model.

Using Behaviors
===============

.. include:: ./table-objects.rst
    :start-after: start-behaviors
    :end-before: end-behaviors

Core Behaviors
==============


.. include:: ../core-libraries/toc-behaviors.rst
    :start-after: start-toc
    :end-before: end-toc

Creating a Behavior
===================

In the following examples we will create a very simple ``SluggableBehavior``.
This behavior will allow us to populate a slug field with the results of
``Inflector::slug()`` based on another field.

Before we can create our behavior we should understand the conventions for
behaviors:

- Behavior files are located in ``App/Model/Behavior``, or
  ``MyPlugin\Model\Behavior``.
- Behavior classes should be in the ``App\Model\Behavior`` namespace, or
  ``MyPlugin\Model\Behavior`` namespace.
- Behavior classnames end in ``Behavior``.
- Behaviors extend ``Cake\ORM\Behavior``.

Now we can create our sluggable behavior. Create the file
``App/Model/Behavior/SluggableBehavior.php``. In it put the following::

    <?php
    namespace App\Model\Behavior;

    use Cake\ORM\Behavior;

    class SluggableBehavior extends Behavior {
    }

We can now add this behavior to one of our table classes. In this example we'll
use an ``ArticlesTable``, as articles often have slug properties to generate
readable URLs::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function initialize(array $config) {
            $this->addBehavior('Sluggable');
        }
    }

Our new behavior doesn't do much of anything right now. Next, we'll add a mixin
method, and an event listener so that when we save entities we can automatically
slug a field.
Defining Mixin Methods
----------------------

Any public method defined on a behavior will be exposed as a 'mixin' method on
the table objects it is attached to. Behavior mixin methods will receive the
exact same arguments that are provided to the table. For example, if our
SluggableBehavior defined the following method::

    public function slug($value) {
        return Inflector::slug($value, $this->_config['replacement']);
    }

It could be invoked using::

    $slug = $articles->slug('My article name');

Defining Event Listeners
------------------------

Now that our behavior has a mixin method to slug fields, we can implement
a callback listener to automatically slug fields when entities are saved. Our
behavior should look like::

    namespace App\Model\Behavior;

    use Cake\Event\Event;
    use Cake\ORM\Behavior;
    use Cake\ORM\Entity;
    use Cake\Utility\Inflector;

    class SluggableBehavior extends Behavior {
        proteted static $_defaultConfig = [
            'field' => 'title',
            'slug' => 'slug',
            'replacement' => '-',
        ];

        public function slug($value) {
            return Inflector::slug($value, $this->_config['replacement']);
        }

        public function beforeSave(Event $event, Entity $entity) {
            $config = $this->_config;
            $slug = $this->slug($entity->get($config['field']));
            $entity->set($config['slug'], $slug);
        }

    }

The above code shows a few interesting features of behaviors:

- Behaviors can define callback methods by defining methods that follow the
  :ref:`table-callbacks` conventions.
- Any public method defined on a behavior can be accessed as a 'mixin' method on
  the tables it is attached to.
- Behaviors can define a default configuration property. This property is merged
  with the overrides when a behavior is attached to the table.

Defining Finders
----------------

Now that we are able to save articles with slug values, we should implement
a finder method so we can easily fetch articles by their slug. Behavior finder
methods, use the same conventions as :ref:`custom-find-methods` do. Our
``find('slug')`` method would look like::

    public function findSlug(Query $query, array $options = []) {
        return $query->where(['slug' => $options['slug']]);
    }

Once our behavior has the above method we can call it::

    $article = $articles->find('slug', ['slug' => $value])->first();

