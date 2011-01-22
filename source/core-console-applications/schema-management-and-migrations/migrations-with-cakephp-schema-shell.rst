9.2.2 Migrations with CakePHP schema shell
------------------------------------------

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
