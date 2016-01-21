Migrations
##########

Migrations is another plugin supported by the core team that helps you
do schema changes in your database by writing PHP files that can be tracked
using your version control system.

It allows you to evolve your database tables over time. Instead of writing
schema modifications in SQL, this plugin allows you to use an intuitive set
of methods to implement your database changes.

This plugin is a wrapper for the database migrations library `Phinx <https://phinx.org/>`_.

Installation
============

By default Migrations is installed with the default application skeleton. If
you've removed it and want to re-install it, you can do so by running the
following from your application's ROOT directory (where composer.json file is
located)::

        $ php composer.phar require cakephp/migrations "@stable"
        
        // Or if composer is installed globally
        
        $ composer require cakephp/migrations "@stable"

To use the plugin you'll need to load it in your application's **config/bootstrap.php** file.
You can use :ref:`CakePHP's Plugin shell <plugin-shell>` to load and unload plugins from
your **config/bootstrap.php**::

        $ bin/cake plugin load Migrations
        
Or you can load the plugin by editing your **config/bootstrap.php** file and adding the
following statement::

        Plugin::load('Migrations');

Additionally, you will need to configure the default database configuration for your 
application in your **config/app.php** file as explained in the
:ref:`Database Configuration section <database-configuration>`.

Overview
========

A migration is basically a single PHP file that describes a new 'version' of
the database. A migration file can create tables, add or remove columns, create
indexes and even insert data into your database.

Here's an example of a migration::

        <?php

        use Migrations\AbstractMigration;

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
        }


The migration will add a table to your database named ``products`` with the following
column definitions:

- ``id`` column of type ``integer``
- ``name`` column of type ``string``
- ``description`` column of type ``text``
- ``created`` column of type ``datetime``

.. tip::

        A primary key column named ``id`` will be added **implicitly**.

.. note::

        Note that this file describes how the database will look **after** applying
        the migration. At this point no ``products`` table exists in your database, we
        have merely created a file that is able to both create the ``products`` table
        with the specified columns as well as drop it when a ``rollback`` operation of
        the migration is performed.

Once the file has been created in the **config/Migrations** folder, you will be
able to execute the following ``migrations`` command to create the table in
your database::

        bin/cake migrations migrate

The following ``migrations`` command will perform a ``rollback`` and drop the
table from your database::

        bin/cake migrations rollback

Creating Migrations
===================

Migration files are stored in the **config/Migrations** directory of your
application. The name of the migration files are prefixed with the date in
which they were created, in the format **YYYYMMDDHHMMSS_my_new_migration.php**::

        -rw-rw-r-- 1 root root 1066 Aug 21 22:05 20150822030519_create_articles.php

The easiest way to create a migrations file is by using the :doc:`/bake/usage` CLI command.
The following ``Bake`` command would create a migration to add a ``products`` table::

        $ bin/cake bake migration CreateProducts name:string description:text created modified
        
        Welcome to CakePHP v3.1.7 Console
        ---------------------------------------------------------------
        App : src
        Path: /home/user/Work/php/cakeblog/src/
        PHP : 5.5.28-1+deb.sury.org~precise+1
        ---------------------------------------------------------------
        
        Creating file /home/user/Work/php/cakeblog/config/Migrations/20160121163249_CreateProducts.php
        Wrote `/home/user/Work/php/cakeblog/config/Migrations/20160121163249_CreateProducts.php`

.. note::

        You can also use the ``underscore_form`` as the name for your migrations
        i.e. create_products::

                $ bin/cake bake migration create_products name:string description:text created modified
            
                Welcome to CakePHP v3.0.13 Console
                ---------------------------------------------------------------
                App : src
                Path: /home/user/Work/php/cakeblog/src/
                ---------------------------------------------------------------
                
                Creating file /home/user/Work/php/cakeblog/config/Migrations/20160121164955_create_products.php
                Wrote `/home/user/Work/php/cakeblog/config/Migrations/20160121164955_create_products.php`

The command above line will generate a migration file that resembles::

        <?php
        use Migrations\AbstractMigration;
        
        class CreateProducts extends AbstractMigration
        {
            /**
             * Change Method.
             *
             * More information on this method is available here:
             * http://docs.phinx.org/en/latest/migrations.html#the-change-method
             * @return void
             */
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('name', 'string', [
                    'default' => null,
                    'limit' => 255,
                    'null' => false,
                ]);
                $table->addColumn('description', 'text', [
                    'default' => null,
                    'null' => false,
                ]);
                $table->addColumn('created', 'datetime', [
                    'default' => null,
                    'null' => false,
                ]);
                $table->addColumn('modified', 'datetime', [
                    'default' => null,
                    'null' => false,
                ]);
                $table->create();
            }
        }


If the migration name in the command line is of the form "AddXXXToYYY" or "RemoveXXXFromYYY"
and is followed by a list of column names and types then a migration file
containing the code for creating or dropping the columns will be generated::

        bin/cake bake migration AddPriceToProducts price:decimal

Executing the command line above will generate::

        <?php

        use Migrations\AbstractMigration;

        class AddPriceToProducts extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('price', 'decimal')
                      ->update();
            }
        }

.. versionadded:: cakephp/migrations 1.4

If you need to specify a field length, you can do it within brackets in the
field type, ie::

        bin/cake bake migration AddFullDescriptionToProducts full_description:string[60]

Executing the command line above will generate::

        <?php

        use Migrations\AbstractMigration;

        class AddFullDescriptionToProducts extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('full_description', 'string', [
                        'default' => null,
                        'limit' => 60,
                        'null' => false,
                     ])
                      ->update();
            }
        }

It is also possible to add indexes to columns::

        bin/cake bake migration AddNameIndexToProducts name:string:index

will generate::

        <?php

        use Migrations\AbstractMigration;

        class AddNameIndexToProducts extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('name', 'string')
                      ->addIndex(['name'])
                      ->update();
            }
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

        <?php

        use Migrations\AbstractMigration;

        class RemovePriceFromProducts extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->removeColumn('price');
            }
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

        <?php

        use Migrations\AbstractMigration;

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
        }

The above will create a ``CHAR(36)`` ``id`` column that is also the primary key.

.. note::

        When specifying a custom primary key on the command line, you must note it as the primary key in the id field, otherwise you may get an error regarding duplicate id fields, i.e.::

            bin/cake bake migration CreateProducts id:uuid:primary name:string description:text created modified


Additionally, since Migrations 1.3, a new way to deal with primary key was
introduced. To do so, your migration class should extend the new
``Migrations\AbstractMigration`` class.
You can specify a ``autoId`` property in the Migration class and set it to
``false``, which will turn off the automatic ``id`` column creation. You will
need to manually create the column that will be used as a primary key and add
it to the table declaration::

        <?php

        use Migrations\AbstractMigration;

        class CreateProductsTable extends AbstractMigration
        {

            public $autoId = false;

            public function up()
            {
                $table = $this->table('products');
                $table
                    ->addColumn('id', 'integer', [
                        'autoIncrement' => true,
                        'limit' => 11
                    ])
                    ->addPrimaryKey('id')
                    ->addColumn('name', 'string')
                    ->addColumn('description', 'text')
                    ->create();
            }
        }

Compared to the previous way of dealing with primary key, this method gives you
the ability to have more control over the primary key column definition :
unsigned or not, limit, comment, etc.

All baked migrations and snapshot will use this new way when necessary.

.. warning::

    Dealing with primary key can only be done on table creation operations.
    This is due to limitations for some database servers the plugin supports.

Collations
----------

If you need to create a table with a different collation than the database
default one, you can define it with the ``table()`` method, as an option::

        <?php

        use Migrations\AbstractMigration;

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

To migrate to a specific version then use the ``--target`` parameter or -t for short::

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

.. versionadded:: 1.4.0

It can sometimes be useful to mark a set of migrations as migrated without
actually running them.
In order to do this, you can use the ``mark_migrated`` command.
The command works seamlessly as the other commands.

You can mark all migrations as migrated using this command::

    bin/cake migrations mark_migrated

You can also mark all migrations up to a specific version as migrated using
the ``--target`` option::

    bin/cake migrations mark_migrated --target=20151016204000

If you do not want the targeted migration to be marked as migrated during the
process, you can use the ``--exclude`` flag with it::

    bin/cake migrations mark_migrated --target=20151016204000 --exclude

Finally, if you wish to mark only the targeted migration as migrated, you can
use the ``--only`` flag::

    bin/cake migrations mark_migrated --target=20151016204000 --only

.. note::

    When you bake a snapshot with the ``cake bake migration_snapshot``
    command, the created migration will automatically be marked as migrated.

.. deprecated:: 1.4.0

    The following way of using the command has been deprecated. Use it only
    if you are using a version of the plugin < 1.4.0.

This command expects the migration version number as argument::

    bin/cake migrations mark_migrated 20150420082532

If you wish to mark all migrations as migrated, you can use the ``all`` special
value. If you use it, it will mark all found migrations as migrated::

    bin/cake migrations mark_migrated all

Using Migrations In Plugins
===========================

Plugins can also provide migration files. This makes plugins that are intended
to be distributed much more portable and easy to install. All commands in the
Migrations plugin support the ``--plugin`` or ``-p`` option that will scope the
execution to the migrations relative to that plugin::

        bin/cake migrations status -p PluginName

        bin/cake migrations migrate -p PluginName


Running Migrations in a non-shell environment
=============================================

.. versionadded:: cakephp/migrations 1.2.0

Since the release of version 1.2 of the migrations plugin, you can run
migrations from a non-shell environment, directly from an app, by using the new
``Migrations`` class. This can be handy in case you are developing a plugin
installer for a CMS for instance.
The ``Migrations`` class allows you to run the following commands from the
migrations shell :

* migrate
* rollback
* markMigrated
* status

Each of these commands has a method defined in the ``Migrations`` class.

Here is how to use it::

    use Migrations\Migrations;

    $migrations = new Migrations();

    // Will return an array of all migrations and their status
    $status = $migrations->status();

    // Will return true if success. If an error occurred, an exception will be thrown
    $migrate = $migrations->migrate();

    // Will return true if success. If an error occurred, an exception will be thrown
    $rollback = $migrations->rollback();

    // Will return true if success. If an error occurred, an exception will be thrown
    $markMigrated = $migrations->markMigrated(20150804222900);

The methods can accept an array of parameters that should match options from
the commands::

    use Migrations\Migrations;

    $migrations = new Migrations();

    // Will return an array of all migrations and their status
    $status = $migrations->status(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

You can pass any options the shell commands would take.
The only exception is the ``markMigrated`` command which is expecting the
version number of the migrations to mark as migrated as first argument. Pass
the array of parameters as the second argument for this method.

Optionally, you can pass these parameters in the constructor of the class.
They will be used as default and this will prevent you from having to pass
them on each method call::

    use Migrations\Migrations;

    $migrations = new Migrations(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

    // All the following calls will be done with the parameters passed to the Migrations class constructor
    $status = $migrations->status();
    $migrate = $migrations->migrate();

If you need to override one or more default parameters for one call, you can
pass them to the method::

    use Migrations\Migrations;

    $migrations = new Migrations(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

    // This call will be made with the "custom" connection
    $status = $migrations->status();
    // This one with the "default" connection
    $migrate = $migrations->migrate(['connection' => 'default']);
