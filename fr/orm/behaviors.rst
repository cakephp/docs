Behaviors (Comportements)
#########################

Les behaviors (comportements) sont une manière d'organiser et de réutiliser
la logique de la couche Model. Conceptuellement, ils sont similaires aux traits.
Cependant, les behaviors sont implémentés en classes séparées. Ceci leur permet
de hook dans le cycle de vie des callbacks que les models emettent, tout en
fournissant des fonctionnalités de type trait.

Behaviors provide a convenient way to package up behavior that is common across
many models. For example, CakePHP includes a ``TimestampBehavior``. Many
models will want timestamp fields, and the logic to manage these fields is
not specific to any one model. It is these kinds of scenarios that behaviors are
a perfect fit for.

Utiliser les Behaviors
======================

.. include:: ./table-objects.rst
    :start-after: start-behaviors
    :end-before: end-behaviors

Behaviors du Coeur
==================

.. include:: ../core-libraries/toc-behaviors.rst
    :start-after: start-toc
    :end-before: end-toc

Créer un Behavior
=================

In the following examples we will create a very simple ``SluggableBehavior``.
This behavior will allow us to populate a slug field with the results of
``Inflector::slug()`` based on another field.

Before we create our behavior we should understand the conventions for
behaviors:

- Behavior files are located in ``App/Model/Behavior``, or
  ``MyPlugin\Model\Behavior``.
- Behavior classes should be in the ``App\Model\Behavior`` namespace, or
  ``MyPlugin\Model\Behavior`` namespace.
- Behavior class names end in ``Behavior``.
- Behaviors extend ``Cake\ORM\Behavior``.

To create our sluggable behavior. Put the following into
``App/Model/Behavior/SluggableBehavior.php``::

    namespace App\Model\Behavior;

    use Cake\ORM\Behavior;

    class SluggableBehavior extends Behavior {
    }

We can now add this behavior to one of our table classes. In this example we'll
use an ``ArticlesTable``, as articles often have slug properties for creating
friendly URLs::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function initialize(array $config) {
            $this->addBehavior('Sluggable');
        }
    }

Our new behavior doesn't do much of anything right now. Next, we'll add a mixin
method and an event listener so that when we save entities we can automatically
slug a field.

Définir les Méthodes Mixin
--------------------------

Any public method defined on a behavior will be added as a 'mixin' method on the
table object it is attached to. If you attach two behaviors that provide the
same methods an exception will be raised. If a behavior provides the same method
as a table class, the behavior method will not be callable from the table.
Behavior mixin methods will receive the exact same arguments that are provided
to the table. For example, if our SluggableBehavior defined the following
method::

    public function slug($value) {
        return Inflector::slug($value, $this->_config['replacement']);
    }

It could be invoked using::

    $slug = $articles->slug('My article name');

Limiter ou renommer les Méthodes Mixin Exposed
----------------------------------------------

When creating behaviors, there may be situations where you don't want to expose
public methods as mixin methods. In these cases you can use the
``implementedMethods`` configuration key to rename or exclude mixin methods. For
example if we wanted to prefix our slug() method we could do the following::

    public static $_defaultConfig = [
        'implementedMethods' => [
            'slug' => 'superSlug',
        ]
    ];

Applying this configuration will make ``slug()`` not callable, however it will
add a ``superSlug()`` mixin method to the table. Notably if our behavior
implemented other public methods they would **not** be available as mixin
methods with the above configuration.

Since the exposed methods are decided by configuration you can also
rename/remove mixin methods when adding a behavior to a table. For example::

    // In a table's initialize() method.
    $this->addBehavior('Sluggable', [
        'implementedMethods' => [
            'slug' => 'superSlug',
        ]
    ]);

Définir des Event Listeners
---------------------------

Now that our behavior has a mixin method to slug fields, we can implement
a callback listener to automatically slug a field when entities are saved. We'll
also modify our slug method to accept an entity instead of just a plain value. Our
behavior should now look like::

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

        public function slug(Entity $entity) {
            $config = $this->_config;
            $value = $entity->get($config['field']);
            $entity->set($config['slug'], Inflector::slug($value, $config['replacement']));
        }

        public function beforeSave(Event $event, Entity $entity) {
            $this->slug($entity);
        }

    }

The above code shows a few interesting features of behaviors:

- Behaviors can define callback methods by defining methods that follow the
  :ref:`table-callbacks` conventions.
- Behaviors can define a default configuration property. This property is merged
  with the overrides when a behavior is attached to the table.

Définir des Finders
-------------------

Now that we are able to save articles with slug values, we should implement
a finder method so we can easily fetch articles by their slug. Behavior finder
methods, use the same conventions as :ref:`custom-find-methods` do. Our
``find('slug')`` method would look like::

    public function findSlug(Query $query, array $options = []) {
        return $query->where(['slug' => $options['slug']]);
    }

Once our behavior has the above method we can call it::

    $article = $articles->find('slug', ['slug' => $value])->first();

Limiter ou renommer les Méthodes de Exposed Finder
--------------------------------------------------

When creating behaviors, there may be situations where you don't want to expose
finder methods, or you need to rename finders to avoid duplicated methods. In
these cases you can use the ``implementedFinders`` configuration key to rename
or exclude finder methods. For example if we wanted to rename our ``find(slug)``
method we could do the following::

    public static $_defaultConfig = [
        'implementedFinders' => [
            'slugged' => 'findSlug',
        ]
    ];

Applying this configuration will make ``find('slug')`` trigger an error. However
it will make ``find('slugged')`` available. Notably if our behavior implemented
other finder methods they would **not** be available, as they are not included
in the configuration.

Since the exposed methods are decided by configuration you can also
rename/remove finder methods when adding a behavior to a table. For example::

    // In a table's initialize() method.
    $this->addBehavior('Sluggable', [
        'implementedFinders' => [
            'slugged' => 'findSlug',
        ]
    ]);
