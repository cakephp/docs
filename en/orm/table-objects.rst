Table Objects
#############

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

Table objects provide access to the collection of entities stored in a specific
table. Each table in your application should have an associated Table class
which is used to interact with a given table. If you do not need to customize
the behavior of a given table CakePHP will generate a Table instance for you to
use.

Before trying to use Table objects and the ORM, you should ensure that you have
configured your :ref:`database connection <database-configuration>`.

Basic Usage
===========

To get started, create a Table class. These classes live in
**src/Model/Table**. Tables are a type model collection specific to relational
databases, and the main interface to your database in CakePHP's ORM. The most
basic table class would look like::

    // src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
    }

Note that we did not tell the ORM which table to use for our class. By
convention table objects will use a table that matches the lower cased and
underscored version of the class name. In the above example the ``articles``
table will be used. If our table class was named ``BlogPosts`` your table should
be named ``blog_posts``. You can specify the table to using the ``setTable()``
method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->setTable('my_table');
            
            // Prior to 3.4.0
            $this->table('my_table');
        }

    }

No inflection conventions will be applied when specifying a table. By convention
the ORM also expects each table to have a primary key with the name of ``id``.
If you need to modify this you can use the ``setPrimaryKey()`` method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->setPrimaryKey('my_id');
            
            // Prior to 3.4.0
            $this->primaryKey('my_id');
        }
    }

Customizing the Entity Class a Table Uses
-----------------------------------------

By default table objects use an entity class based on naming conventions. For
example if your table class is called ``ArticlesTable`` the entity would be
``Article``. If the table class was ``PurchaseOrdersTable`` the entity would be
``PurchaseOrder``. If however, you want to use an entity that doesn't follow the
conventions you can use the ``setEntityClass()`` method to change things up::

    class PurchaseOrdersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->setEntityClass('App\Model\Entity\PO');
            
            // Prior to 3.4.0
            $this->entityClass('App\Model\Entity\PO');
        }
    }

As seen in the examples above Table objects have an ``initialize()`` method
which is called at the end of the constructor. It is recommended that you use
this method to do initialization logic instead of overriding the constructor.

Getting Instances of a Table Class
----------------------------------

Before you can query a table, you'll need to get an instance of the table. You
can do this by using the ``TableRegistry`` class::

    // In a controller or table method.
    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

The TableRegistry class provides the various dependencies for constructing
a table, and maintains a registry of all the constructed table instances making
it easier to build relations and configure the ORM. See
:ref:`table-registry-usage` for more information.

If your table class is in a plugin, be sure to use the correct name for your
table class. Failing to do so can result in validation rules, or callbacks not
being triggered as a default class is used instead of your actual class. To
correctly load plugin table classes use the following::

    // Plugin table
    $articlesTable = TableRegistry::get('PluginName.Articles');

    // Vendor prefixed plugin table
    $articlesTable = TableRegistry::get('VendorName/PluginName.Articles');

.. _table-callbacks:

Lifecycle Callbacks
===================

As you have seen above table objects trigger a number of events. Events are
useful if you want to hook into the ORM and add logic in without subclassing or
overriding methods. Event listeners can be defined in table or behavior classes.
You can also use a table's event manager to bind listeners in.

When using callback methods behaviors attached in the
``initialize()`` method will have their listeners fired **before** the table
callback methods are triggered. This follows the same sequencing as controllers
& components.

To add an event listener to a Table class or Behavior simply implement the
method signatures as described below. See the :doc:`/core-libraries/events` for
more detail on how to use the events subsystem.

Event List
----------

* ``Model.initialize``
* ``Model.beforeMarshal``
* ``Model.beforeFind``
* ``Model.buildValidator``
* ``Model.buildRules``
* ``Model.beforeRules``
* ``Model.afterRules``
* ``Model.beforeSave``
* ``Model.afterSave``
* ``Model.afterSaveCommit``
* ``Model.beforeDelete``
* ``Model.afterDelete``
* ``Model.afterDeleteCommit``

initialize
----------

.. php:method:: initialize(Event $event, ArrayObject $data, ArrayObject $options)

The ``Model.initialize`` event is fired after the constructor and initialize
methods are called. The ``Table`` classes do not listen to this event by
default, and instead use the ``initialize`` hook method.

To respond to the ``Model.initialize`` event you can create a listener class
which implements ``EventListenerInterface``::

    use Cake\Event\EventListenerInterface;
    class ModelInitializeListener implements EventListenerInterface
    {
        public function implementedEvents()
        {
            return array(
                'Model.initialize' => 'initializeEvent',
            );
        }
        public function initializeEvent($event)
        {
            $table = $event->getSubject();
            // do something here
        }
    }

and attach the listener to the ``EventManager`` as below::

    use Cake\Event\EventManager;
    $listener = new ModelInitializeListener();
    EventManager::instance()->attach($listener);

This will call the ``initializeEvent`` when any ``Table`` class is constructed.

beforeMarshal
-------------

.. php:method:: beforeMarshal(Event $event, ArrayObject $data, ArrayObject $options)

The ``Model.beforeMarshal`` event is fired before request data is converted
into entities. See the :ref:`before-marshal` documentation for more information.

beforeFind
----------

.. php:method:: beforeFind(Event $event, Query $query, ArrayObject $options, $primary)

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

buildValidator
--------------

.. php:method:: buildValidator(Event $event, Validator $validator, $name)

The ``Model.buildValidator`` event is fired when ``$name`` validator is created.
Behaviors, can use this hook to add in validation methods.

buildRules
----------

.. php:method:: buildRules(Event $event, RulesChecker $rules)

The ``Model.buildRules`` event is fired after a rules instance has been
created and after the table's ``buildRules()`` method has been called.

beforeRules
-----------

.. php:method:: beforeRules(Event $event, EntityInterface $entity, ArrayObject $options, $operation)

The ``Model.beforeRules`` event is fired before an entity has had rules applied. By
stopping this event, you can halt the rules checking and set the result
of applying rules.

afterRules
----------

.. php:method:: afterRules(Event $event, EntityInterface $entity, ArrayObject $options, $result, $operation)

The ``Model.afterRules`` event is fired after an entity has rules applied. By
stopping this event, you can return the final value of the rules checking
operation.

beforeSave
----------

.. php:method:: beforeSave(Event $event, EntityInterface $entity, ArrayObject $options)

The ``Model.beforeSave`` event is fired before each entity is saved. Stopping
this event will abort the save operation. When the event is stopped the result
of the event will be returned.
How to stop an event is documented :ref:`here <stopping-events>`.

afterSave
---------

.. php:method:: afterSave(Event $event, EntityInterface $entity, ArrayObject $options)

The ``Model.afterSave`` event is fired after an entity is saved.

afterSaveCommit
---------------

.. php:method:: afterSaveCommit(Event $event, EntityInterface $entity, ArrayObject $options)

The ``Model.afterSaveCommit`` event is fired after the transaction in which the
save operation is wrapped has been committed. It's also triggered for non atomic
saves where database operations are implicitly committed. The event is triggered
only for the primary table on which ``save()`` is directly called. The event is
not triggered if a transaction is started before calling save.

beforeDelete
------------

.. php:method:: beforeDelete(Event $event, EntityInterface $entity, ArrayObject $options)

The ``Model.beforeDelete`` event is fired before an entity is deleted. By
stopping this event you will abort the delete operation. When the event is stopped the result
of the event will be returned.
How to stop an event is documented :ref:`here <stopping-events>`.

afterDelete
-----------

.. php:method:: afterDelete(Event $event, EntityInterface $entity, ArrayObject $options)

The ``Model.afterDelete`` event is fired after an entity has been deleted.

afterDeleteCommit
-----------------

.. php:method:: afterDeleteCommit(Event $event, EntityInterface $entity, ArrayObject $options)

The ``Model.afterDeleteCommit`` event is fired after the transaction in which the
delete operation is wrapped has been is committed. It's also triggered for non
atomic deletes where database operations are implicitly committed. The event is
triggered only for the primary table on which ``delete()`` is directly called.
The event is not triggered if a transaction is started before calling delete.

Behaviors
=========

.. php:method:: addBehavior($name, array $options = [])

.. start-behaviors

Behaviors provide an easy way to create horizontally re-usable pieces of logic
related to table classes. You may be wondering why behaviors are regular classes
and not traits. The primary reason for this is event listeners. While traits
would allow for re-usable pieces of logic, they would complicate binding events.

To add a behavior to your table you can call the ``addBehavior()`` method.
Generally the best place to do this is in the ``initialize()`` method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

As with associations, you can use :term:`plugin syntax` and provide additional
configuration options::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
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
tables use which connections. This is the ``defaultConnectionName()`` method::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public static function defaultConnectionName() {
            return 'replica_db';
        }
    }

.. note::

    The ``defaultConnectionName()`` method **must** be static.

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
        'connection' => $connectionObject,
        'schema' => $schemaObject,
        'entityClass' => 'Custom\EntityClass',
        'eventManager' => $eventManager,
        'behaviors' => $behaviorRegistry
    ]);

Pay attention to the connection and schema configuration settings, they aren't
string values but objects. The connection will take an object of
``Cake\Database\Connection`` and schema ``Cake\Database\Schema\Collection``.

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

Configuring the Namespace to Locate ORM classes
-----------------------------------------------

If you have not followed the conventions it is likely that your Table or
Entity classes will not be detected by CakePHP. In order to fix this, you can
set a namespace with the ``Cake\Core\Configure::write`` method. As an example::

    /src
        /App
            /My
                /Namespace
                    /Model
                        /Entity
                        /Table

Would be configured with::

    Cake\Core\Configure::write('App.namespace', 'App\My\Namespace');

