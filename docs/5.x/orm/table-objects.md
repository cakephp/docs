# Table Objects

`class` Cake\\ORM\\**Table**

Table objects provide access to the collection of entities stored in a specific
table. Each table in your application should have an associated Table class
which is used to interact with a given table. If you do not need to customize
the behavior of a given table CakePHP will generate a Table instance for you to
use.

Before trying to use Table objects and the ORM, you should ensure that you have
configured your [database connection](../orm/database-basics#database-configuration).

## Basic Usage

To get started, create a Table class. These classes live in
**src/Model/Table**. Tables are a type model collection specific to relational
databases, and the main interface to your database in CakePHP's ORM. The most
basic table class would look like:

``` php
// src/Model/Table/ArticlesTable.php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
}
```

Note that we did not tell the ORM which table to use for our class. By
convention table objects will use a table that matches the lower cased and
underscored version of the class name. In the above example the `articles`
table will be used. If our table class was named `BlogPosts` your table should
be named `blog_posts`. You can specify the table to use by using the `setTable()`
method:

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->setTable('my_table');
    }
}
```

No inflection conventions will be applied when specifying a table. By convention
the ORM also expects each table to have a primary key with the name of `id`.
If you need to modify this you can use the `setPrimaryKey()` method:

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->setPrimaryKey('my_id');
    }
}
```

### Customizing the Entity Class a Table Uses

By default table objects use an entity class based on naming conventions. For
example if your table class is called `ArticlesTable` the entity would be
`Article`. If the table class was `PurchaseOrdersTable` the entity would be
`PurchaseOrder`. If however, you want to use an entity that doesn't follow the
conventions you can use the `setEntityClass()` method to change things up:

``` php
class PurchaseOrdersTable extends Table
{
    public function initialize(array $config): void
    {
        $this->setEntityClass('App\Model\Entity\PO');
    }
}
```

As seen in the examples above Table objects have an `initialize()` method
which is called at the end of the constructor. It is recommended that you use
this method to do initialization logic instead of overriding the constructor.

### Getting Instances of a Table Class

Before you can query a table, you'll need to get an instance of the table. You
can do this by using the `TableLocator` class:

``` php
// In a controller

$articles = $this->fetchTable('Articles');
```

`TableLocator` provides the various dependencies for constructing
a table, and maintains a registry of all the constructed table instances making
it easier to build relations and configure the ORM. See
[Table Locator Usage](#table-locator-usage) for more information.

If your table class is in a plugin, be sure to use the correct name for your
table class. Failing to do so can result in validation rules, or callbacks not
being triggered as a default class is used instead of your actual class. To
correctly load plugin table classes use the following:

``` php
// Plugin table
$articlesTable = $this->fetchTable('PluginName.Articles');

// Vendor prefixed plugin table
$articlesTable = $this->fetchTable('VendorName/PluginName.Articles');
```

<a id="table-callbacks"></a>

## Lifecycle Callbacks

As you have seen above table objects trigger a number of events. Events are
useful if you want to hook into the ORM and add logic in without subclassing or
overriding methods. Event listeners can be defined in table or behavior classes.
You can also use a table's event manager to bind listeners in.

When using callback methods behaviors attached in the
`initialize()` method will have their listeners fired **before** the table
callback methods are triggered. This follows the same sequencing as controllers
& components.

To add an event listener to a Table class or Behavior simply implement the
method signatures as described below. See the [Events System](../core-libraries/events) for
more detail on how to use the events subsystem:

``` php
// In a controller
$articles->save($article, ['customVariable1' => 'yourValue1']);

// In ArticlesTable.php
public function afterSave(Event $event, EntityInterface $entity, ArrayObject $options)
{
    $customVariable = $options['customVariable1'];  // 'yourValue1'
    $options['customVariable2'] = 'yourValue2';
}

public function afterSaveCommit(Event $event, EntityInterface $entity, ArrayObject $options)
{
    $customVariable = $options['customVariable1'];  // 'yourValue1'
    $customVariable = $options['customVariable2'];  // 'yourValue2'
}
```

### Event List

- `Model.initialize`
- `Model.beforeMarshal`
- `Model.afterMarshal`
- `Model.beforeFind`
- `Model.buildValidator`
- `Model.buildRules`
- `Model.beforeRules`
- `Model.afterRules`
- `Model.beforeSave`
- `Model.afterSave`
- `Model.afterSaveCommit`
- `Model.beforeDelete`
- `Model.afterDelete`
- `Model.afterDeleteCommit`

### initialize

`method` Cake\\ORM\\Table::**initialize**(EventInterface $event, ArrayObject $data, ArrayObject $options)

The `Model.initialize` event is fired after the constructor and initialize
methods are called. The `Table` classes do not listen to this event by
default, and instead use the `initialize` hook method.

To respond to the `Model.initialize` event you can create a listener class
which implements `EventListenerInterface`:

``` php
use Cake\Event\EventListenerInterface;
class ModelInitializeListener implements EventListenerInterface
{
    public function implementedEvents(): array
    {
        return [
            'Model.initialize' => 'initializeEvent',
        ];
    }

    public function initializeEvent($event): void
    {
        $table = $event->getSubject();
        // do something here
    }
}
```

and attach the listener to the `EventManager` as below:

``` php
use Cake\Event\EventManager;
$listener = new ModelInitializeListener();
EventManager::instance()->attach($listener);
```

This will call the `initializeEvent` when any `Table` class is constructed.

### beforeMarshal

`method` Cake\\ORM\\Table::**beforeMarshal**(EventInterface $event, ArrayObject $data, ArrayObject $options)

The `Model.beforeMarshal` event is fired before request data is converted
into entities. See the [Before Marshal](../orm/saving-data#before-marshal) documentation for more information.

### afterMarshal

`method` Cake\\ORM\\Table::**afterMarshal**(EventInterface $event, EntityInterface $entity, ArrayObject $data, ArrayObject $options)

The `Model.afterMarshal` event is fired after request data is converted
into entities. Event handlers will get the converted entities, original request
data and the options provided to the `patchEntity()` or `newEntity()` call.

### beforeFind

`method` Cake\\ORM\\Table::**beforeFind**(EventInterface $event, SelectQuery $query, ArrayObject $options, boolean $primary)

The `Model.beforeFind` event is fired before each find operation. By stopping
the event, and feeding the query with a custom result set, you can bypass the find
operation entirely:

``` php
public function beforeFind(EventInterface $event, SelectQuery $query, ArrayObject $options, $primary): void
{
    if (/* ... */) {
        $event->stopPropagation();
        $query->setResult(new \Cake\Datasource\ResultSetDecorator([]));

        return;
    }
    // ...
}
```

In this example, no further `beforeFind` events will be triggered on the
related table or its attached behaviors (though behavior events are usually
invoked earlier given their default priorities), and the query will return
the empty result set that was passed via `SelectQuery::setResult()`.

Any changes done to the `$query` instance will be retained for the rest
of the find. The `$primary` parameter indicates whether or not this is the root
query, or an associated query. All associations participating in a query will
have a `Model.beforeFind` event triggered. For associations that use joins,
a dummy query will be provided. In your event listener you can set additional
fields, conditions, joins or result formatters. These options/features will be
copied onto the root query.

In previous versions of CakePHP there was an `afterFind` callback, this has
been replaced with the [Map Reduce](../orm/retrieving-data-and-resultsets#map-reduce) features and entity constructors.

### buildValidator

`method` Cake\\ORM\\Table::**buildValidator**(EventInterface $event, Validator $validator, $name)

The `Model.buildValidator` event is fired when `$name` validator is created.
Behaviors, can use this hook to add in validation methods.

### buildRules

`method` Cake\\ORM\\Table::**buildRules(RulesChecker $rules): RulesChecker**()

The `Model.buildRules` event is fired after a rules instance has been
created and after the `Table::buildRules()` method has been called.

### beforeRules

`method` Cake\\ORM\\Table::**beforeRules**(EventInterface $event, EntityInterface $entity, ArrayObject $options, $operation)

The `Model.beforeRules` event is fired before an entity has had rules applied. By
stopping this event, you can halt the rules checking and set the result
of applying rules.

### afterRules

`method` Cake\\ORM\\Table::**afterRules**(EventInterface $event, EntityInterface $entity, ArrayObject $options, $result, $operation)

The `Model.afterRules` event is fired after an entity has rules applied. By
stopping this event, you can return the final value of the rules checking
operation.

### beforeSave

`method` Cake\\ORM\\Table::**beforeSave**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

The `Model.beforeSave` event is fired before each entity is saved. Stopping
this event will abort the save operation. When the event is stopped the result
of the event will be returned.

### afterSave

`method` Cake\\ORM\\Table::**afterSave**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

The `Model.afterSave` event is fired after an entity is saved.

### afterSaveCommit

`method` Cake\\ORM\\Table::**afterSaveCommit**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

The `Model.afterSaveCommit` event is fired after the transaction in which the
save operation is wrapped has been committed. It's also triggered for non atomic
saves where database operations are implicitly committed. The event is triggered
only for the primary table on which `save()` is directly called. The event is
not triggered if a transaction is started before calling save.

### beforeDelete

`method` Cake\\ORM\\Table::**beforeDelete**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

The `Model.beforeDelete` event is fired before an entity is deleted. By
stopping this event you will abort the delete operation. When the event is stopped the result
of the event will be returned.

### afterDelete

`method` Cake\\ORM\\Table::**afterDelete**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

The `Model.afterDelete` event is fired after an entity has been deleted.

### afterDeleteCommit

`method` Cake\\ORM\\Table::**afterDeleteCommit**(EventInterface $event, EntityInterface $entity, ArrayObject $options)

The `Model.afterDeleteCommit` event is fired after the transaction in which the
delete operation is wrapped has been is committed. It's also triggered for non
atomic deletes where database operations are implicitly committed. The event is
triggered only for the primary table on which `delete()` is directly called.
The event is not triggered if a transaction is started before calling delete.

### Stopping Table Events

To prevent the save from continuing, simply stop event propagation in your callback:

``` php
public function beforeSave(EventInterface $event, EntityInterface $entity, ArrayObject $options): void
{
    if (...) {
        $event->stopPropagation();
        $event->setResult(false);

        return;
    }
    ...
}
```

Alternatively, you can return false from the callback. This has the same effect as stopping event propagation.

### Callback priorities

When using events on your tables and behaviors be aware of the priority
and the order listeners are attached. Behavior events are attached before Table
events are. With the default priorities this means that Behavior callbacks are
triggered **before** the Table event with the same name.

As an example, if your Table is using `TreeBehavior` the
`TreeBehavior::beforeDelete()` method will be called before your table's
`beforeDelete()` method, and you will not be able to work wth the child nodes
of the record being deleted in your Table's method.

You can manage event priorities in one of a few ways:

1.  Change the `priority` of a Behavior's listeners using the `priority`
    option. This will modify the priority of **all** callback methods in the
    Behavior:

    ``` php
    // In a Table initialize() method
    $this->addBehavior('Tree', [
        // Default value is 10 and listeners are dispatched from the
        // lowest to highest priority.
        'priority' => 2,
    ]);
    ```

2.  Modify the `priority` in your `Table` class by using the
    `Model.implementedEvents()` method. This allows you to assign a different
    priority per callback-function:

    ``` php
    // In a Table class.
    public function implementedEvents(): array
    {
        $events = parent::implementedEvents();
        $events['Model.beforeDelete'] = [
            'callable' => 'beforeDelete',
            'priority' => 3
        ];

        return $events;
    }
    ```

## Behaviors

`method` Cake\\ORM\\Table::**addBehavior**($name, array $options = [])

Behaviors provide a way to create horizontally re-usable pieces of logic
related to table classes. You may be wondering why behaviors are regular classes
and not traits. The primary reason for this is event listeners. While traits
would allow for re-usable pieces of logic, they would complicate binding events.

To add a behavior to your table you can call the `addBehavior()` method.
Generally the best place to do this is in the `initialize()` method:

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        $this->addBehavior('Timestamp');
    }
}
```

As with associations, you can use `plugin syntax` and provide additional
configuration options:

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
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
```

You can find out more about behaviors, including the behaviors provided by
CakePHP in the chapter on [Behaviors](../orm/behaviors).

<a id="configuring-table-connections"></a>

## Configuring Connections

By default all table instances use the `default` database connection. If your
application uses multiple database connections you will want to configure which
tables use which connections. This is the `defaultConnectionName()` method:

``` php
namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public static function defaultConnectionName(): string {
        return 'replica_db';
    }
}
```

> [!NOTE]
> The `defaultConnectionName()` method **must** be static.

<a id="table-locator-usage"></a>

## Using the TableLocator<span id="table-registry-usage"></span>

`class` Cake\\ORM\\**TableLocator**

As we've seen earlier, the TableLocator class provides a way to use a
factory/registry for accessing your applications table instances. It provides a
few other useful features as well.

### Configuring Table Objects

`method` Cake\\ORM\\TableLocator::**get**($alias, $config)

When loading tables from the registry you can customize their dependencies, or
use mock objects by providing an `$options` array:

``` php
$articles = FactoryLocator::get('Table')->get('Articles', [
    'className' => 'App\Custom\ArticlesTable',
    'table' => 'my_articles',
    'connection' => $connectionObject,
    'schema' => $schemaObject,
    'entityClass' => 'Custom\EntityClass',
    'eventManager' => $eventManager,
    'behaviors' => $behaviorRegistry
]);
```

Pay attention to the connection and schema configuration settings, they aren't
string values but objects. The connection will take an object of
`Cake\Database\Connection` and schema `Cake\Database\Schema\Collection`.

> [!NOTE]
> If your table also does additional configuration in its `initialize()` method,
> those values will overwrite the ones provided to the registry.

You can also pre-configure the registry using the `setConfig()` method.
Configuration data is stored *per alias*, and can be overridden by an object's
`initialize()` method:

``` php
FactoryLocator::get('Table')->setConfig('Users', ['table' => 'my_users']);
```

> [!NOTE]
> You can only configure a table before or during the **first** time you
> access that alias. Doing it after the registry is populated will have no
> effect.

### Flushing the Registry

`method` Cake\\ORM\\TableLocator::**clear**()

During test cases you may want to flush the registry. Doing so is often useful
when you are using mock objects, or modifying a table's dependencies:

``` php
FactoryLocator::get('Table')->clear();
```

### Configuring the Namespace to Locate ORM classes

If you have not followed the conventions it is likely that your Table or
Entity classes will not be detected by CakePHP. In order to fix this, you can
set a namespace with the `Cake\Core\Configure::write` method. As an example:

    /src
        /App
            /My
                /Namespace
                    /Model
                        /Entity
                        /Table

Would be configured with:

``` php
Cake\Core\Configure::write('App.namespace', 'App\My\Namespace');
```
