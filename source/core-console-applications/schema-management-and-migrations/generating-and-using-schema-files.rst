9.2.1 Generating and using Schema files
---------------------------------------

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

9.2.1 Generating and using Schema files
---------------------------------------

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
