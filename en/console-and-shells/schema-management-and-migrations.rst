Schema management and migrations
################################

The SchemaShell provides a functionality to create schema objects,
schema sql dumps as well as create snapshots and restore database
snapshots.

Generating and using Schema files
=================================

A generated schema file allows you to easily transport a database
agnostic schema. You can generate a schema file of your database
using::

    $ Console/cake schema generate

This will generate a schema.php file in your ``app/Config/Schema``
directory.

.. note::

    The schema shell will only process tables for which there are
    models defined. To force the schema shell to process all the
    tables, you must add the ``-f`` option in the command line.

To later rebuild the database schema from your previously made
schema.php file run::

    $ Console/cake schema create

This will drop and create the tables based on the contents of the
schema.php.

Schema files can also be used to generate sql dump files. To
generate a sql file containing the ``CREATE TABLE`` statements,
run::

    $ Console/cake schema dump --write filename.sql

Where filename.sql is the desired filename for the sql dump. If you
omit filename.sql the sql dump will be output to the console but
not written to a file.

CakeSchema callbacks
====================

After generating a schema you might want to insert data on some
tables to get your app started. This can be achieved through
CakeSchema callbacks. Every schema file is generated with a
``before($event = array())`` and a ``after($event = array())`` method.

The ``$event`` param holds an array with two keys. One to tell if a
table is being dropped or created and another for errors. Examples::

    array('drop' => 'posts', 'errors' => null)
    array('create' => 'posts', 'errors' => null)

Adding data to a posts table for example would like this::

    App::uses('Post', 'Model');
    public function after($event = array()) {
        if (isset($event['create'])) {
            switch ($event['create']) {
                case 'posts':
                    App::uses('ClassRegistry', 'Utility');
                    $post = ClassRegistry::init('Post');
                    $post->create();
                    $post->save(
                        array('Post' =>
                            array('title' => 'CakePHP Schema Files')
                        )
                    );
                    break;
            }
        }
    }

The ``before()`` and ``after()`` callbacks run each time a table is created
or dropped on the current schema.

When inserting data to more than one table you'll need to flush the database
cache after each table is created. Cache can be disable by setting
``$db->cacheSources = false`` in the before action(). ::

    public $connection = 'default';

    public function before($event = array()) {
        $db = ConnectionManager::getDataSource($this->connection);
        $db->cacheSources = false;
        return true;
    }

If you use models in your callbacks make sure to initialize them with the
correct datasource, lest they fallback to their default datasources::

    public function before($event = array()) {
        $articles = ClassRegistry::init('Articles', array(
            'ds' => $this->connection
        ));
        // Do things with articles.
    }

Writing CakePHP Schema by Hand
==============================

The CakeSchema class is the base class for all database schemas. Each schema
class is able to generate a set of tables.  The schema shell console class
``SchemaShell`` in the ``lib/Cake/Console/Command`` directory interprets command
line, and base schema class can read from the database, or generate the database
table.

CakeSchema can now locate, read and write schema files to plugins. The
SchemaShell also exposes this functionality.

CakeSchema also supports ``tableParameters``. Table Parameters are non column
specific table information such as collation, charset, comments, and table
engine type. Each Dbo implements the tableParameters they support.

Example
-------

Here is a full example from the acl class ::

    /**
     * ACO - Access Control Object - Something that is wanted
     */
        public $acos = array(
            'id' => array(
                'type' => 'integer',
                'null' => false,
                'default' => null,
                'length' => 10,
                'key' => 'primary'
            ),
            'parent_id' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'model' => array('type' => 'string', 'null' => true),
            'foreign_key' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'alias' => array('type' => 'string', 'null' => true),
            'lft' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'rght' => array(
                'type' => 'integer',
                'null' => true,
                'default' => null,
                'length' => 10
            ),
            'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
        );


Columns
-------

Each column is encoded as a key value associative array.
The field name is the key of the field, the value is another array with some of
the following attributes.

Example column::

    'id' => array(
        'type' => 'integer',
        'null' => false,
        'default' => null,
        'length' => 10,
        'key' => 'primary'
     ),

key
    The ``primary`` key defines the primary key index.

null
    Is the field nullable?

default
    What is the default value of the field?

limit
    The limit of the type of the field.

length
    What is the length of the field?

type
    One of the following types

    * integer
    * date
    * time
    * datetime
    * timestamp
    * boolean
    * biginteger
    * float
    * string
    * text
    * binary


Table key `indexes`
===================

The key name `indexes` is put in the table array instead of a field name.

column
    This is either a single column name or an array of columns.

    e.g. Single ::

        'indexes' => array(
            'PRIMARY' => array(
                'column' => 'id',
                'unique' => 1
            )
        )

    e.g. Multiple ::

        'indexes' => array(
            'AB_KEY' => array(
                'column' => array(
                    'a_id',
                    'b_id'
                ),
                'unique' => 1
            )
        )


unique
    If the index is unique, set this to 1, otherwise 0.


Table key `tableParameters`
===========================

tableParameters are supported only in MySQL.

You can use tableParameters to set a variety of MySQL specific settings.


-  ``engine`` Control the storage engine used for your tables.
-  ``charset`` Control the character set used for tables.
-  ``encoding`` Control the encoding used for tables.

In addition to tableParameters MySQL dbo's implement
``fieldParameters``. ``fieldParameters`` allow you to control MySQL
specific settings per column.


-  ``charset`` Set the character set used for a column
-  ``encoding`` Set the encoding used for a column

See below for examples on how to use table and field parameters in
your schema files.

**Using tableParameters in schema files**

You use ``tableParameters`` just as you would any other key in a
schema file. Much like ``indexes``::

    var $comments => array(
        'id' => array(
            'type' => 'integer',
            'null' => false,
            'default' => 0,
            'key' => 'primary'
        ),
        'post_id' => array('type' => 'integer', 'null' => false, 'default' => 0),
        'comment' => array('type' => 'text'),
        'indexes' => array(
            'PRIMARY' => array('column' => 'id', 'unique' => true),
            'post_id' => array('column' => 'post_id'),
        ),
        'tableParameters' => array(
            'engine' => 'InnoDB',
            'charset' => 'latin1',
            'collate' => 'latin1_general_ci'
        )
    );

is an example of a table using ``tableParameters`` to set some
database specific settings. If you use a schema file that contains
options and features your database does not implement, those
options will be ignored.

Migrations with CakePHP schema shell
====================================

Migrations allow for versioning of your database schema, so that as
you develop features you have an easy and database agnostic way to
distribute database changes. Migrations are achieved through either
SCM controlled schema files or schema snapshots. Versioning a
schema file with the schema shell is quite easy. If you already
have a schema file created running::

    $ Console/cake schema generate

Will bring up the following choices::

    Generating Schema...
    Schema file exists.
     [O]verwrite
     [S]napshot
     [Q]uit
    Would you like to do? (o/s/q)

Choosing [s] (snapshot) will create an incremented schema.php. So
if you have schema.php, it will create schema\_2.php and so on. You
can then restore to any of these schema files at any time by
running::

    $ cake schema update -s 2

Where 2 is the snapshot number you wish to run. The schema shell
will prompt you to confirm you wish to perform the ``ALTER``
statements that represent the difference between the existing
database the currently executing schema file.

You can perform a dry run by adding a ``--dry`` to your command.

.. note::

    Please note that schema generation in 2.x does not handle foreign key
    constraints.

Workflow examples
=================

Create schema and commit
------------------------

On a project which use versioning, the usage of cake schema
would follow these steps:

1. Create or modify your database tables
2. Execute cake schema to export a full description of your
   database
3. Commit the created or updated schema.php file::

    $ # once your database has been updated
    $ Console/cake schema generate
    $ git commit -a

.. note::

    If the project is not versioned, managing schemas would
    be done through snapshots. (see previous section to
    manage snapshots)

Getting the last changes
------------------------

When you pull the last changes of your repository, and discover
changes in the structure of the database (possibly because
of an error message saying you are missing a table):

1. Execute cake schema to update your database::

    $ git pull
    $ Console/cake schema create
    $ Console/cake schema update

All these operations can be done in dry-run mode.

Rolling back
------------

If at some point you need to revert and get back to the state in which you were
before updating your database, you should be informed that this is currently not
supported by cake schema.

More specifically, you can't automatically drop your tables once they have
been created.

Using ``update`` will, on the contrary, drop any field which differ from the
schema file::

    $ git revert HEAD
    $ Console/cake schema update

Will bring up the following choices::

    The following statements will run.
    ALTER TABLE `roles`
    DROP `position`;
    Are you sure you want to alter the tables? (y/n)
    [n] >


.. meta::
    :title lang=en: Schema management and migrations
    :keywords lang=en: schema files,schema management,schema objects,database schema,table statements,database changes,migrations,versioning,snapshots,sql,snapshot,shell,config,functionality,choices,models,php files,php file,directory,running
