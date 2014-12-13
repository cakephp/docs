Les Objets Table
################

.. php:namespace:: Cake\ORM

.. php:class:: Table

Les objets Table fournissent un accès à la collection des entities stockées
dans une table spécifique. Chaque table dans votre application devra avoir une
classe Table associée qui est utilisée pour interagir avec une table
donnée. Si vous n'avez pas besoin de personnaliser le behavior d'une table
donnée, CakePHP va générer une instance Table à utiliser pour vous.

Avant d'essayer d'utiliser les objets Table et l'ORM, vous devriez vous assurer
que vous avez configuré votre
:ref:`database connection <database-configuration>`.

Utilisation Basique
===================

Pour commencer, créez une classe Table. Ces classes se trouvent dans
``src/Model/Table``. Les Tables sont une collection de type model spécifique
aux bases de données relationnelles, et sont l'interface principal pour
votre base de données dans l'ORM de CakePHP. La classe table la plus
basique devrait ressembler à ceci::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
    }

Notez que nous ne disons pas à l'ORM quelle table utiliser pour notre classe.
Par convention, les objets table vont utiliser une table avec la notation en
minuscule et avec des underscores pour le nom de la classe. Dans l'exemple du
dessus, la table ``articles`` va être utilisée. Si notre classe table était
nommée ``BlogPosts``, votre table serait nommée ``blog_posts``. Vous pouvez
spécifier la table en utilisant la méthode ``table()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function initialize(array $config) {
            $this->table('my_table');
        }

    }

Aucune convention d'inflection ne sera appliquée quand on spécifie une table.
Par convention, l'ORM s'attend aussi à ce que chaque table ait une clé primaire
avec le nom de ``id``. Si vous avez besoin de modifier ceci, vous pouvez
utiliser la méthode ``primaryKey()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->primaryKey('my_id');
        }
    }


Personnalisaliser la Classe Entity qu'une Table Utilise
-------------------------------------------------------

Par défaut, les objets table utilisent une classe entity basée sur les
conventions de nommage. Par exemple, si votre classe de table est appelée
``ArticlesTable`` l'entity sera ``Article``. Si la classe table est
``PurchaseOrdersTable`` l'entity sera ``PurchaseOrder``. Cependant si vous
souhaitez utiliser une entity qui ne suit pas les conventions, vous pouvez
utiliser la méthode ``entityClass`` pour changer les choses::

    class PurchaseOrdersTable extends Table {
        public function initialize(array $config) {
            $this->entityClass('App\Model\PO');
        }
    }

Comme vu dans les exemples ci-dessus, les objets Table ont une méthode
``initialize()`` qui est appelée à la fin du constructeur. Il est recommandé que
vous utilisiez cette méthode pour faire la logique d'initialisation au lieu
de surcharger le constructeur.

Obtenir les Instances d'une Classe Table
----------------------------------------

Avant de pouvoir requêter sur une table, vous aurez besoin d'obtenir une
instance de la table. Vous pouvez faire ceci en utilisant la classe
``TableRegistry``::

    // Dans un controller ou dans une méthode table.
    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

La classe TableRegistry fournit les divers dépendances pour construire la table,
et maintenir un registre de toutes les instances de table construites,
faciliter la construction de relations et configurer l'ORM. Regardez
:ref:`table-registry-usage` pour plus d'informations.


.. _table-callbacks:

Lifecycle Callbacks
===================

As you have seen above table objects trigger a number of events. Events are
useful if you want to hook into the ORM and add logic in without subclassing or
overriding methods. Event listeners can be defined in table or behavior classes.
You can also use a table's event manager to bind listeners in.

When using callback methods behaviors attached in the
``initialize`` method will have their listeners fired **before** the table
callback methods are triggered. This follows the same sequencing as controllers
& components.

To add an event listener to a Table class or Behavior simply implement the
method signatures as described below. See the :doc:`/core-libraries/events` for
more detail on how to use the events subsystem.

beforeFind
----------

.. php:method:: beforeFind(Event $event, Query $query, array $options, boolean $primary)

The ``Model.beforeFind`` event is fired before each find operation. By stopping
the event and supplying a return value you can bypass the find operation
entirely. Any changes done to the $query instance will be retained for the rest
of the find. The ``$primary`` parameter indicates whether or not this is the root
query, or an associated query. All associations participating in a query will
have a ``Model.beforeFind`` event triggered. For associations that use joins,
a dummy query will be provided. In your event listener you can set additional
fields, conditions, joins or result formatters. These options/features will be
copied onto the root query.

You might use this callback to restrict find operations based on a user's role,
or make caching decisions based on the current load.

In previous versions of CakePHP there was an ``afterFind`` callback, this has
been replaced with the :ref:`map-reduce` features and entity constructors.

beforeValidate
--------------

.. php:method:: beforeValidate(Event $event, Entity $entity, array $options, Validator $validator)

The ``Model.beforeValidate`` method is fired before an entity is validated. By
stopping this event, you can abort the validate + save operations.

afterValidate
-------------

.. php:method:: afterValidate(Event $event, Entity $entity, ArrayObject $options, Validator $validator)

The ``Model.afterValidate`` event is fired after an entity is validated.

beforeSave
----------

.. php:method:: beforeSave(Event $event, Entity $entity, ArrayObject $options)

The ``Model.beforeSave`` event is fired before each entity is saved. Stopping
this event will abort the save operation. When the event is stopped the result
of the event will be returned.

afterSave
---------

.. php:method:: afterSave(Event $event, Entity $entity, ArrayObject $options)

The ``Model.afterSave`` event is fired after an entity is saved.

beforeDelete
------------

.. php:method:: beforeDelete(Event $event, Entity $entity, ArrayObject $options)

The ``Model.beforeDelete`` event is fired before an entity is deleted. By
stopping this event you will abort the delete operation.

afterDelete
-----------

.. php:method:: afterDelete(Event $event, Entity $entity, ArrayObject $options)

Fired after an entity has been deleted.

Behaviors
=========

.. php:method:: addBehavior($name, $config = [])

.. start-behaviors

Behaviors provide an easy way to create horizonally re-usable pieces of logic
related to table classes. You may be wondering why behaviors are regular classes
and not traits. The primary reason for this is event listeners. While traits
would allow for re-usable pieces of logic, they would complicate binding events.

To add a behavior to your table you can call the ``addBehavior`` method.
Generally the best place to do this is in the ``initialize`` method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Timestamp');
        }
    }

As with associations, you can use :term:`syntaxe de plugin` and provide additional
configuration options::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'modified_at' => 'always'
                    ]
                ]
            ]);
        }
    }

.. end-behaviors

You can find out more about behaviors, including the behaviors provided by
CakePHP in the chapter on :doc:`/orm/behaviors`.

.. _configuring-table-connections:

Configuring Connections
=======================

By default all table instances use the ``default`` database connection. If your
application uses multiple database connections you will want to configure which
tables use which connections. This is the ``defaultConnectionName`` method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public static function defaultConnectionName() {
            return 'slavedb';
        }
    }

.. note::

    The ``defaultConnectionName`` method **must** be static.

.. _table-registry-usage:

Using the TableRegistry
=======================

.. php:class:: TableRegistry

As we've seen earlier, the TableRegistry class provides an easy to use
factory/registry for accessing your applications table instances. It provides a
few other useful features as well.

Configuring Table Objects
-------------------------

.. php:staticmethod:: get($alias, $config)

When loading tables from the registry you can customize their dependencies, or
use mock objects by providing an ``$options`` array::

    $articles = TableRegistry::get('Articles', [
        'className' => 'App\Custom\ArticlesTable',
        'table' => 'my_articles',
        'connection' => $connection,
        'schema' => $schemaObject,
        'entityClass' => 'Custom\EntityClass',
        'eventManager' => $eventManager,
        'behaviors' => $behaviorRegistry
    ]);

.. note::

    If your table also does additional configuration in its ``initialize()`` method,
    those values will overwrite the ones provided to the registry.

You can also pre-configure the registry using the ``config()`` method.
Configuration data is stored *per alias*, and can be overridden by an object's
``initialize()`` method::

    TableRegistry::config('Users', ['table' => 'my_users']);

.. note::

    You can only configure a table before or during the **first** time you
    access that alias. Doing it after the registry is populated will have no
    effect.

Flushing the Registry
---------------------

.. php:staticmethod:: clear()

During test cases you may want to flush the registry. Doing so is often useful
when you are using mock objects, or modifying a table's dependencies::

    TableRegistry::clear();
