.. _table-objects:

.. php:namespace:: Cake\ORM

Table objects
#############

.. php:class:: Table

Table objects provide access to the collection of entities stored in
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
and do this by using the ``TableRegistry`` class::

    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

The TableRegistry class provides the various dependencies for constructing
a table, and maintains a registry of all the constructed Table instances making
it easier to build relations and configure the ORM. See
:ref:`table-registry-usage` for more information.

Fetching all entities
---------------------

The best way to fetch entities from a table object is to use the ``find`` method. It
allows you to access the various built-in finder methods and your own custom
ones. See :ref:`custom-find-methods` for more information::

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

Defining relations between different objects in your application should be
a natural process. For example, an article may have many comments, and belongs
to a author. Authors may have many articles, and comments. CakePHP makes
managing these associations easy. The four association types in CakePHP are:
hasOne, hasMany, belongsTo, and belongsToMany.

============= ===================== =======================================
Relationship  Association Type      Example
============= ===================== =======================================
one to one    hasOne                A user has one profile.
------------- --------------------- ---------------------------------------
one to many   hasMany               A user can have multiple articles.
------------- --------------------- ---------------------------------------
many to one   belongsTo             Many articles belong to a user.
------------- --------------------- ---------------------------------------
many to many  belongsToMany         Tags belong to many Articles.
============= ===================== =======================================

Associations are defined during the ``inititalize()`` method of your table
object. Methods that match the association types allow you to define the
associations in your application. For example if we wanted to define a belongsTo
association in our ArticlesTable::

    namespace App\Model\Repository;

    use Cake\ORM\Table;

    class ArticlesTable extends Table {

        public function intitalize(array $config) {
            $this->belongsTo('Authors');
        }

    }

The simplest form of any association setup takes the table alias you want to
associate with. By default all of the details of an association will use the
CakePHP conventions. If you want to customize how your associations are handled
you can do so with an additional $config argument::

    class ArticlesTable extends Table {

        public function intitalize(array $config) {
            $this->belongsTo('Authors', [
                'className' => 'Plugin.Authors',
                'foreignKey' => 'authorid',
                'property' => 'person'
            ]);
        }

    }

HasOne associations
-------------------

Let's set up a User model with a hasOne relationship to an Address
Table.

First, your database tables need to be keyed correctly. For a
hasOne relationship to work, one table has to contain a foreign key
that points to a record in the other. In this case the addresses
table will contain a field called user\_id. The basic pattern is:

**hasOne:** the *other* model contains the foreign key.

====================== ==================
Relation               Schema
====================== ==================
Users hasOne Addresses addresses.user\_id
---------------------- ------------------
Doctors hasOne Mentors mentors.doctor\_id
====================== ==================

.. note::

    It is not mandatory to follow CakePHP conventions, you can easily override
    the use of any foreignKey in your associations definitions. Nevertheless sticking
    to conventions will make your code less repetitive, easier to read and to maintain.

If we had the ``UsersTable`` and ``AddressesTable`` classes made we could make
the association with the following code::

    class UsersTable extends Table {
        public function initialize(array $config) {
            $this->hasOne('Addresses');
        }
    }

If you need more control, you can define your associations using
array syntax. For example, you might want to limit the association
to include only certain records::

    class UsersTable extends Table {
        public function initialize(array $config) {
            $this->hasOne('Addresses', [
                'className' => 'Profiles',
                'conditions' => ['Profiles.published' => '1'],
                'dependent' => true
            ]);
        }
    }

Possible keys for hasOne association arrays include:

-  **className**: the class name of the table being associated to
   the current model. If you're defining a 'User hasOne Address'
   relationship, the className key should equal 'Addresses.'
-  **foreignKey**: the name of the foreign key found in the other
   model. This is especially handy if you need to define multiple
   hasOne relationships. The default value for this key is the
   underscored, singular name of the current model, suffixed with
   '\_id'. In the example above it would default to 'user\_id'.
-  **conditions**: an array of find() compatible conditions
   such as ``['Addresses.primary' => true]``
-  **joinType**: the type of the join to use in the SQL query, default
   is INNER. You may want to use LEFT if your hasOne association is optional.
-  **dependent**: When the dependent key is set to true, and an
   entity is deleted, the associated model records are also deleted. In this
   case we set it true so that deleting a User will also delete her associated
   Address.
- **cascadeCallbacks**: When this and dependent are true cascaded deletes will
  load and delete entities so that callbacks are properly triggered. When false,
  ``deleteAll()`` is used to remove associated data and no callbacks are
  triggered.
- **property**: The property name that should be filled with data from the associated
  table into the source table results. By default this is the underscored & singular name of
  the association so ``address`` in our example.

Once this association has been defined, find operations on the User table can
contain the Address record if it exists::

    $query = $users->find('all')->contain('Addresses');
    foreach ($query as $user) {
        echo $user->address->street;
    }

The above would emit SQL that is similar to::

    SELECT * FROM users INNER JOIN addresses ON addresses.user_id = users.id;

BelongsTo associations
----------------------

Now that we have Address data access from the User table, let's
define a belongsTo association in the Addresses table in order to get
access to related User data. The belongsTo association is a natural
complement to the hasOne and hasMany associations.

When keying your database tables for a belongsTo relationship,
follow this convention:

**belongsTo:** the *current* model contains the foreign key.

========================= ==================
Relation                  Schema
========================= ==================
Addresses belongsTo Users addresses.user\_id
------------------------- ------------------
Mentors belongsTo Doctors mentors.doctor\_id
========================= ==================

.. tip::

    If a model(table) contains a foreign key, it belongsTo the other
    model(table).

We can define the belongsTo association in our Addresses table as follows::

    class Addresses extends Table {

        public function intitalize(array $config) {
            $this->belongsTo('Users');
        }
    }

We can also define a more specific relationship using array
syntax::

    class Addresses extends Table {

        public function intitalize(array $config) {
            $this->belongsTo('Users', [
                'foreignKey' => 'userid',
                'joinType' => 'INNER',
            ]);
        }
    }

Possible keys for belongsTo association arrays include:


-  **className**: the class name of the model being associated to
   the current model. If you're defining a 'Profile belongsTo User'
   relationship, the className key should equal 'Users'.
-  **foreignKey**: the name of the foreign key found in the current
   model. This is especially handy if you need to define multiple
   belongsTo relationships. The default value for this key is the
   underscored, singular name of the other model, suffixed with
   ``_id``.
-  **conditions**: an array of find() compatible conditions or SQL
   strings such as ``['Users.active' => true]``
-  **joinType**: the type of the join to use in the SQL query, default
   is LEFT which may not fit your needs in all situations, INNER may
   be helpful when you want everything from your main and associated
   models or nothing at all.
- **property**: The property name that should be filled with data from the associated
  table into the source table results. By default this is the underscored & singular name of
  the association so ``user`` in our example.

Once this association has been defined, find operations on the User table can
contain the Address record if it exists::

    $query = $addresses->find('all')->contain('Users');
    foreach ($query as $address) {
        echo $address->user->username;
    }

The above would emit SQL that is similar to::

    SELECT * FROM addresses LEFT JOIN users ON addresses.user_id = users.id;


HasMany associations
--------------------

BelongsToMany associations
--------------------------

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

Flushing the registry
---------------------

During test cases you may want to flush the registry. Doing so is often useful
when you are using mock objects, or modifying a table's dependencies::

    TableRegistry::clear();

