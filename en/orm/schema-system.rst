Schema System
#############

.. php:namespace:: Cake\Database\Schema

CakePHP features a schema system that is capable of reflecting and generating
schema information for tables in SQL datastores. The schema system can
generate/reflect a schema for any SQL platform that CakePHP supports.

The main pieces of the schema system are ``Cake\Database\Schema\Collection`` and
``Cake\Database\Schema\Table``. These classes give you access to
database-wide and individual Table object features respectively.

The primary use of the schema system is for :ref:`test-fixtures`. However, it
can also be used in your application if required.

Schema\\Table Objects
=====================

.. php:class:: Table

The schema subsystem provides a simple Table object to hold data about a table
in a database. This object is returned by the schema reflection features::

    use Cake\Database\Schema\Table;

    // Create a table one column at a time.
    $t = new Table('posts');
    $t->addColumn('id', 'integer', [
      'length' => 11,
      'null' => false,
      'default' => null,
    ])->addColumn('title', 'string', [
      'length' => 255,
      // Create a fixed length (char field)
      'fixed' => true
    ])->addConstraint('primary', [
      'type' => 'primary',
      'columns' => ['id']
    ]);

    // Schema\Table classes could also be created with array data
    $t = new Table('posts', $columns);

``Schema\Table`` objects allow you to build up information about a table's schema. It helps to
normalize and validate the data used to describe a table. For example, the
following two forms are equivalent::

    $t->addColumn('title', 'string');
    // and
    $t->addColumn('title', 'string', [
      'null' => true,
      'default' => 'root beer'
    ]);

While equivalent, the 2nd form allows more detail and control. This emulates
the existing features available in Schema files + the fixture schema in 2.x.

Accessing Column Data
---------------------

Columns are either added as constructor arguments, or via `addColumn()`. Once
fields are added information can be fetched using `column()` or `columns()`::

    // Get the array of data about a column
    $c = $t->column('title');

    // Get the list of all columns.
    $cols = $t->columns();


Indexes and Constraints
-----------------------

Indexes are added using the ``addIndex()``. Constraints are added using
``addConstraint()``.  Indexes and constraints cannot be added for columns that do
not exist, as it would result in an invalid state. Indexes are different from
constraints, and exceptions will be raised if you try to mix types between the
methods. An example of both methods is::

    $t = new Table('posts');
    $t->addColumn('id', 'integer')
      ->addColumn('author_id', 'integer')
      ->addColumn('title', 'string')
      ->addColumn('slug', 'string');

    // Add a primary key.
    $t->addConstraint('primary', [
      'type' => 'primary',
      'columns' => ['id']
    ]);
    // Add a unique key
    $t->addConstraint('slug_idx', [
      'columns' => ['slug'],
      'type' => 'unique',
    ]);
    // Add index
    $t->addIndex('slug_title', [
      'columns' => ['slug', 'title'],
      'type' => 'index'
    ]);
    // Add a foreign key
    $t->addConstraint('author_id_idx', [
      'columns' => ['author_id'],
      'type' => 'foreign',
      'references' => ['authors', 'id'],
      'update' => 'cascade',
      'delete' => 'cascade'
    ]);

If you add a primary key constraint to a single integer column it will automatically
be converted into a auto-increment/serial column depending on the database
platform::

    $t = new Table('posts');
    $t->addColumn('id', 'integer')
    ->addConstraint('primary', [
        'type' => 'primary',
        'columns' => ['id']
    ]);

In the above example the ``id`` column would generate the following SQL in
MySQL::

    CREATE TABLE `posts` (
        `id` INTEGER AUTO_INCREMENT,
        PRIMARY KEY (`id`)
    )

If your primary key contains more than one column, none of them will
automatically be converted to an auto-increment value. Instead you will need to
tell the table object which column in the composite key you want to
auto-increment::

    $t = new Table('posts');
    $t->addColumn('id', 'integer', [
        'autoIncrement' => true,
    ])
    ->addColumn('account_id', 'integer')
    ->addConstraint('primary', [
        'type' => 'primary',
        'columns' => ['id', 'account_id']
    ]);

The ``autoIncrement`` option only works with ``integer`` and ``biginteger``
columns.

Reading Indexes and Constraints
-------------------------------

Indexes and constraints can be read out of a table object using accessor
methods. Assuming that ``$t`` is a populated Table instance you could do the
following::

    // Get contraints. Will return the
    // names of all constraints.
    $constraints = $t->constraints()

    // Get data about a single constraint.
    $constraint = $t->constraint('author_id_idx')

    // Get indexes. Will return the
    // names of all indexes.
    $indexes = $t->indexes()

    // Get data about a single index.
    $index = $t->index('author_id_idx')


Adding Table Options
--------------------

Some drivers (primarily MySQL) support and require additional table metadata. In
the case of MySQL the ``CHARSET``, ``COLLATE`` and ``ENGINE`` properties are
required for maintaining a table's structure in MySQL. The following could be
used to add table options::

    $t->options([
      'engine' => 'InnoDB',
      'collate' => 'utf8_unicode_ci',
    ]);

Platform dialects only handle the keys they are interested in
and ignore the rest. Not all options are supported on all platforms.

Converting Tables into SQL
--------------------------

Using the ``createSql()`` or ``dropSql()`` you can get
platform specific SQL for creating or dropping a specific table::

    $db = ConnectionManager::get('default');
    $schema = new Table('posts', $fields, $indexes);

    // Create a table
    $queries = $schema->createSql($db);
    foreach ($queries as $sql) {
      $db->execute($sql);
    }

    // Drop a table
    $sql = $schema->dropSql($db);
    $db->execute($sql);

By using a connection's driver the schema data can be converted into platform
specific SQL. The return of ``createSql`` and ``dropSql`` is a list of SQL
queries required to create a table and the required indexes. Some platforms may
require multiple statements to create tables with comments and/or indexes. An
array of queries is always returned.


Schema Collections
==================

.. php:class:: Collection

``Collection`` provides access to the various tables available on a connection.
You can use it to get the list of tables or reflect tables into
:php:class:`Table` objects. Basic usage of the class looks like::

    $db = ConnectionManager::get('default');

    // Create a schema collection.
    $collection = $db->schemaCollection();

    // Get the table names
    $tables = $collection->listTables();

    // Get a single table (instance of Schema\Table)
    $table = $collection->describe('posts');
