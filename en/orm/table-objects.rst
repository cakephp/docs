.. _table-objects:

.. php:namespace:: Cake\ORM

Table objects
#############

.. php:class:: Table

Table objects provide a access to the collection of entities stored in
a specific table. Each table in your application should have an associated Table
class which is used to interact with a given table. If you do not need to
customize the behavior of a given table CakePHP will generate a Table instance for you to use.

Before trying to use Table objects and the ORM, you should ensure that you have
configured your :ref:`database connection <database-configuration>`.

Basic Usage
===========

To get started, create a Table class. These classes live in
``App/Model/Repository`` as tables are a type of Repository specific to
relational databases. The most basic table class would look like::

    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
    }

Note that we did not tell the ORM which table to use for our class. By
convention table objects will use a table that matches the lower cased and
underscored version of the class name. In the above example the ``articles``
table will be used. You can specify the table to using the ``table()``
method::

    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function intitalize(array $config) {
            $this->table('my_table');
        }

    }

No inflection conventions will be applied when specifying a table. By convention
the ORM also expects each table to have a primary key with the name of ``id``.
If you need to modify this you can use the ``primaryKey()`` method::

    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public function initialize(array $config) {
            $this->primaryKey('my_id');
        }
    }

As seen in the examples above Table objects have an ``initialize()`` method
which is called at the end of the constructor. It is recommended that you use
this method to do initialization logic instead of overriding the constructor.

Getting instances of a table class
----------------------------------

Before you can query a table, you'll need to get an instance of the table. You
and do this using the ``TableRegistry`` class::

    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

The TableRegistry class provides the various dependencies for constructing
a table, and maintains a registry of all the constructed Table instances making
it easier to build relations and configure the ORM. See
:ref:`table-registry-usage` for more information.

Fetching all entities
---------------------

The best way to fetch entities from a table object is to use the ``find`` method. It
allows you to access the various built-in finder methods and provide your own
:ref:`custom-find-methods`::

    $query = $articles->find('all');
    foreach ($query as $row) {
        // Do work
    }

Entity objects represent a single record or row in your database. Entities allow
you to define custom behavior on a per-record basis and model the domain of your
application. See the :doc:`/orm/entities` documentation for more information on
creating and customizing your entity objects.

Building associations
=====================

* Types of associations
* Configuring the property name
* Building your own associations.
* Adding conditions
* Choosing fields + ordering conditions.

Loading entities
================

* Using finders
* Magic finders
* Eager loading associations


Saving entities
===============

Bulk updates
------------

Deleting entities
=================

Cascading deletes
-----------------

Bulk deletes
------------

Lifecycle callbacks
===================

* Find callbacks
* Link to map reduce.
* Delete callbacks
* Save callbacks

Behaviors
=========

* Adding behaviors
* Configuring behaviors
* Link to behavior docs.


.. _configuring-table-connections:

Configuring connections
=======================

By default all table instances use the ``default`` database connection. If your
application uses multiple database connections you will want to configure which
tables use which connections. This is the ``defaultConnectionName`` method::

    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {
        public static function defaultConnectionName() {
            return 'second';
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

Configuring table objects
-------------------------

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

If your table also does additional configuration in its ``initialize()`` method,
those values will overwrite the ones provided to the registry.

You can also pre-configure the registry using the ``config()`` method.
Configuration data is stored *per alias*, and can be overridden by an object's
``initialize()`` method::

    TableRegistry::config('Users', ['table' => 'my_users']);

.. note::

    You can only configure a table before, or during the **first** time you
    create that alias.  Doing it after the registry is populated will have no
    effect.

Flushing the registry
---------------------

During test cases you may want to flush the registry. Doing so is often useful
when you are using mock objects, or modifing a table's dependencies::

    TableRegistry::clear();

