Schema System
#############

.. php:namespace:: Cake\Database\Schema

CakePHP features a schema system that is capable of reflecting and generating
schema information for tables in SQL datastores. The schema system can
generate/reflect schema for any SQL platform that CakePHP supports.

The main pieces of the schema system are ``Cake\Database\Schema\Table`` and
``Cake\Database\Schema\Collection``. These classes give you access to
database wide and individual table object features respectively.

The primary use of the schema system is for :ref:`test-fixtures`. However, it
can also be used in your applications if required.

Schema\\Table objects
=====================

.. php:class:: Table

The schema subsystem provides a simple Table object to hold data about a table
in a database. This object is returned by the schema reflection features::

    use Cake\Database\Schema\Table;

    // Create a table one column at a time.
    $t = new Table('posts');
    $t->addColumn('id', [
      'type' => 'integer',
      'length' => 11,
      'null' => false,
      'default' => null,
    ]);
    $t->addColumn('title', [
      'type' => 'string',
      'length' => 255,
      'fixed' => true // Create a fixed length (char field)
    ]);
    $t->addConstraint('primary', [
      'type' => 'primary',
      'columns' => ['id']
    ]);

    // Schema\Table classes could also be created with array data
    $t = new Table('posts', $columns);

Schema\Table objects allow you build up information about a table's schema. It helps to
normalize and validate the data used to describe a table. For example, the
following two forms are equivalent::

    $t->addColumn('title', 'string');
    // and
    $t->addColumn('title', [
      'type' => 'string'
    ]);

While equivalent, the 2nd form allows more detail and control. This emulates
the existing features available in Schema files + fixture schema in 2.x.

Accessing column data
---------------------

Columns are either added as constructor arguments, or via `addColumn()`. Once
fields are added information can be fetched using `column()` or `columns()`::

    // Get the array of data about a column
    $c = $t->column('title');

    // Get the list of all columns.
    $cols = $t->columns();


Indexes and constraints
-----------------------

Indexes are added using the ``addIndex()``. Constraints are added using
``addConstraint()``.  Indexes & constraints cannot be added for columns that do
not exist, as it would result in an invalid state. Indexes are different from
constraints and exceptions will be raised if you try to mix types beween the
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


Reading indexes and constraints
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


Adding table options
--------------------

Some drivers (primarily MySQL) support & require additional table metadata. In
the case of MySQL the ``CHARSET``, ``COLLATE`` and ``ENGINE`` properties are
required for maintaining a table's structure in MySQL. The following could be
used to add table options::

    $t->options([
      'engine' => 'InnoDB',
      'collate' => 'utf8_unicode_ci',
    ]);

Platform dialects only handle the keys they are interested in
and ignore the rest. Not all options are support on all platforms.

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
require multiple statements to create tables with comments, and or indexes. An
array of queries is always returned.


Schema Collections
==================

.. php:class:: Collection

``Collection`` provides access to the various tables available on a connection.
You an use it to get the list of tables or reflect tables into
:php:class:`Table` objects. Basic usage of the class looks like::

    $db = ConnectionManager::get('default');

    // Create a schema collection.
    $collection = $db->schemaCollection();

    // Get the table names
    $tables = $collection->listTables();

    // Get a single table (instance of Schema\Table)
    $table = $collection->describe('posts')
