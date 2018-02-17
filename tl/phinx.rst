Phinx Migrations
################

Phinx is a standalone command line tool for managing database Migrations. The official Migrations plugin for CakePHP is based on this tool.

Phinx makes it ridiculously easy to manage the database migrations for your PHP app. In less than 5 minutes, you can install Phinx using Composer and create your first database migration. Phinx is just about migrations without all the bloat of a database ORM system or application framework.

Introduction
============

Good developers always version their code using a SCM system, so why don't they
do the same for their database schema?

Phinx allows developers to alter and manipulate databases in a clear and
concise way. It avoids the use of writing SQL by hand and instead offers a
powerful API for creating migrations using PHP code. Developers can then
version these migrations using their preferred SCM system. This makes Phinx
migrations portable between different database systems. Phinx keeps track of
which migrations have been run, so you can worry less about the state of your
database and instead focus on building better software.

Goals
=====

Phinx was developed with the following goals in mind:

* Be portable amongst the most popular database vendors.
* Be PHP framework independent.
* Have a simple install process.
* Have an easy to use command-line operation.
* Integrate with various other PHP tools (Phing, PHPUnit) and web frameworks.

Installation
============

Phinx should be installed using Composer, which is a tool for dependency
management in PHP. Please visit the `Composer <https://getcomposer.org/>`_
website for more information.

.. note::

    Phinx requires at least PHP 5.4 (or later).

To install Phinx, simply require it using Composer:

.. code-block:: bash

    php composer.phar require robmorgan/phinx

Create folders in your project following the structure ``db/migrations`` with adequate permissions.
It is where your migration files will live and should be writable.

Phinx can now be executed from within your project:

.. code-block:: bash

    vendor/bin/phinx init

Contents
========

.. toctree::
   :maxdepth: 2

   phinx/migrations
   phinx/seeding
   phinx/commands
   phinx/configuration
