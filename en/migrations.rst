Migrations
##########

Migrations is another plugin supported by the core team that helps you
do schema changes in your database by writing PHP files that can be tracked
using your version control system.

It allows you to evolve your database tables over time. Instead of writing
schema modifications in SQL, this plugin allows you to use an intuitive set
of methods to implement your database changes.

This plugin is a wrapper for the database migrations library `Phinx <https://phinx.org/>`_

Installation
============

By default Migrations is installed with the default application skeleton. If
you've removed it and want to re-install it, you can do so by running the
following from your application's ROOT directory (where composer.json file is
located)::

        php composer.phar require cakephp/migrations "@stable"

You will need to add the following line to your application's bootstrap.php file::

        Plugin::load('Migrations');

Additionally, you will need to configure the default database configuration in your
config/app.php file as explained in the :ref:`Database Configuration section <database-configuration>`.

Overview
========

A migration is basically a single PHP file that describes a new 'version' of
the database. A migration file can create tables, add or remove columns, create
indexes and even insert data into the database.

Here's an example of a migration::

        class CreateProductsTable extends AbstractMigration
        {
            /**
             * This method gets executed when applying the changes to
             * the database.
             *
             * Changes to the database can also be reverted without any
             * additional code for non-destructive operations.
             */
            public function change()
            {
                // create the table
                $table = $this->table('products');
                $table->addColumn('name', 'string')
                      ->addColumn('description', 'text')
                      ->addColumn('created', 'datetime')
                      ->create();
            }


This migration adds a table called products with a string column called ``name``, a text
``description`` column and a column called ``created`` with a datetime type.
A primary key column called ``id`` will also be added implicitly.

Note that this file describes how the database should look like after applying
the change, at this point no ``products`` table exist, but we have created
a file that is both able to create the table with the right column as well as
to drop it if we rollback the migration.

Once the file has been created in the **config/Migrations** folder, you will be
able to execute the following command to create the table in your database::

        bin/cake migrations migrate

Creating Migrations
===================

Migration files are stored in the **config/Migration** directory of your
application. The name of the migration files are prefixed with the date in
which they were created, in the format **YYYYMMDDHHMMSS_my_new_migration.php**.

The easiest way of creating a migrations file is by using the command line.
Let's imagine that you'd like to add a new ``products`` table::

        bin/cake bake migration CreateProducts name:string description:text created modified

The above line will create a migration file looking like this::

        class CreateProductsTable extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('name', 'string')
                      ->addColumn('description', 'text')
                      ->addColumn('created', 'datetime')
                      ->addColumn('modified', 'datetime')
                      ->create();
            }

If the migration name in the command line is of the form "AddXXXToYYY" or "RemoveXXXFromYYY"
and is followed by a list of column names and types then a migration file
containing the code for creating or dropping the columns will be generated::

        bin/cake bake migration AddPriceToProducts price:decimal

Executing the command line above will generate::

        class AddPriceToProducts extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('name', 'string')
                      ->addColumn('price', 'decimal')
                      ->save();
            }

It is also possible to add indexes to columns::

        bin/cake bake migration AddNameIndexToProducts name:string:index

will generate::

        class AddNameIndexToProducts extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('name', 'string')
                      ->addIndex(['name'])
                      ->save();
            }


When using fields in the command line it may be handy to remember that they
follow the following pattern::

        field:fieldType:indexType:indexName

For instance, the following are all valid ways of specifying an email field:

* ``email:string:unique``
* ``email:string:unique:EMAIL_INDEX``

Fields named ``created`` and ``modified`` will automatically be set to the type
``datetime``.

In the same way, you can generate a migration to remove a column by using the
command line::

         bin/cake bake migration RemovePriceFromProducts price

creates the file::

        class RemovePriceFromProducts extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->removeColumn('price');
            }

Migration Names can follow any of the following patterns:

* Create a table: (``/^(Create)(.*)/``) Creates the specified table.
* Drop a table: (``/^(Drop)(.*)/``) Drops the specified table. Ignores specified field arguments.
* Add a field: (``/^(Add).*(?:To)(.*)/``) Adds fields to the specified table.
* Remove a field: (``/^(Remove).*(?:From)(.*)/``) Removes fields from the specified table.
* Alter a table:  (``/^(Alter)(.*)/``) Alters the specified table. An alias for CreateTable and AddField.

Field types a those generically made available by the ``Phinx`` library. Those
can be:

* string
* text
* integer
* biginteger
* float
* decimal
* datetime
* timestamp
* time
* date
* binary
* boolean
* uuid

Additionally you can create an empty migrations file if you want full control
over what needs to be executed::

        bin/cake migrations create MyCustomMigration

Please make sure you read the official `Phinx documentation <http://docs.phinx.org/en/latest/migrations.html>`_
in order to know the complete list of methods you can use for writing migration files.

Generating Migrations From Existing Databases
---------------------------------------------

If you are dealing with a pre-existing database and want to start using
migrations, or to version control the initial schema of your application's
database, you can run the ``migration_snapshot`` command::

        bin/cake bake migration_snapshot Initial

It will generate a migration file called **Initial** containing all the create
statements for all tables in your database.

Creating Custom Primary Keys
----------------------------

If you need to avoid the automatic creation of the ``id`` primary key when
adding new tables to the database, you can use the second argument of the
``table()`` method::

        class CreateProductsTable extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products', ['id' => false, 'primary_key' => ['id']]);
                $table
                      ->addColumn('id', 'uuid')
                      ->addColumn('name', 'string')
                      ->addColumn('description', 'text')
                      ->create();
            }

The above will create a ``CHAR(36)`` ``id`` column that is also the primary key.

Collations
----------

If you need to create a table with a different collation than the database
default one, you can define it with the ``table()`` method, as an option::

        class CreateCategoriesTable extends AbstractMigration
        {
            public function change()
            {
                $table = $this
                    ->table('categories', [
                        'collation' => 'latin1_german1_ci'
                    ])
                    ->addColumn('title', 'string', [
                        'default' => null,
                        'limit' => 255,
                        'null' => false,
                    ])
                    ->create();
            }

Note however this can only be done on table creation : there is currently
no way of adding a column to an existing table with a different collation than
the table or the database.
Only ``MySQL`` and ``SqlServer`` supports this configuration key for the time being.

Applying Migrations
===================

Once you have generated or written your migration file, you need to execute the
following command to apply the changes to your database::

        bin/cake migrations migrate

To migrate to a specific version then use the --target parameter or -t for short::

        bin/cake migrations migrate -t 20150103081132

That corresponds to the timestamp that is prefixed to the migrations file name.

Reverting Migrations
====================

The Rollback command is used to undo previous migrations executed by this
plugin. It is the reverse action of the ``migrate`` command.

You can rollback to the previous migration by using the ``rollback`` command::

        bin/cake migrations rollback

You can also pass a migration version number to rollback to a specific version::

         bin/cake migrations rollback -t 20150103081132

Migrations Status
=================

The Status command prints a list of all migrations, along with their current status.
You can use this command to determine which migrations have been run::

        bin/cake migrations status

Marking a migration as migrated
===============================

.. versionadded:: cakephp/migrations 1.1.0

It can sometimes be useful to mark a migration as migrated without actually running it.
In order to do this, you can use the ``mark_migrated`` command. This command
expects the migration version number as argument::

    bin/cake migrations mark_migrated 20150420082532

Note that when you bake a snapshot with the ``cake bake migration_snapshot``
command, the created migration will automatically be marked as migrated.

Using Migrations In Plugins
===========================

Plugins can also provide migration files. This makes plugins that are intended
to be distributed much more portable and easy to install. All commands in the
Migrations plugin support the ``--plugin`` or ``-p`` option that will scope the
execution to the migrations relative to that plugin::

        bin/cake migrations status -p PluginName

        bin/cake migrations migrate -p PluginName

