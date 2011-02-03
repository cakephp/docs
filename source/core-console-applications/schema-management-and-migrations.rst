Schema management and migrations
################################

The SchemaShell provides a functionality to create schema objects,
schema sql dumps as well as create snapshots and restore database
snapshots.

Generating and using Schema files
=================================

A generated schema file allows you to easily transport a database
agnostic schema. You can generate a schema file of your database
using:

::

    $ cake schema generate

This will generate a schema.php file in your ``app/config/schema``
directory.

The schema shell will only process tables for which there are
models defined. To force the schema shell to process all the
tables, you must add the ``-f`` option in the command line.

To later rebuild the database schema from your previously made
schema.php file run:

::

    $ cake schema create

This will drop and create the tables based on the contents of the
schema.php.

Schema files can also be used to generate sql dump files. To
generate a sql file containing the ``CREATE TABLE`` statements,
run:

::

    $ cake schema dump -write filename.sql

Where filename.sql is the desired filename for the sql dump. If you
omit filename.sql the sql dump will be output to the console but
not written to a file.

Migrations with CakePHP schema shell
====================================

Migrations allow for versioning of your database schema, so that as
you develop features you have an easy and database agnostic way to
distribute database changes. Migrations are achieved through either
SCM controlled schema files or schema snapshots. Versioning a
schema file with the schema shell is quite easy. If you already
have a schema file created running

::

    $ cake schema generate

Will bring up the following choices:

::

    Generating Schema...
    Schema file exists.
     [O]verwrite
     [S]napshot
     [Q]uit
    Would you like to do? (o/s/q)

Choosing [s] (snapshot) will create an incremented schema.php. So
if you have schema.php, it will create schema\_2.php and so on. You
can then restore to any of these schema files at any time by
running:

::

    $ cake schema update -s 2

Where 2 is the snapshot number you wish to run. The schema shell
will prompt you to confirm you wish to perform the ``ALTER``
statements that represent the difference between the existing
database the currently executing schema file.

You can perform a dry run by adding a ``-dry`` to your command.
