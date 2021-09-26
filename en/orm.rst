Database Access & ORM
#####################

In CakePHP working with data through the database is done with two primary object
types. The first are **repositories** or **table objects**. These objects
provide access to collections of data. They allow you to save new records,
modify/delete existing ones, define relations, and perform bulk operations. The
second type of objects are **entities**. Entities represent individual records
and allow you to define row/record level behavior & functionality.

These two classes are usually responsible for managing almost everything
that happens regarding your data, its validity, interactions and evolution
of the information workflow in your domain of work.

CakePHP's built-in ORM specializes in relational databases, but can be extended
to support alternative datasources.

The CakePHP ORM borrows ideas and concepts from both ActiveRecord and Datamapper
patterns. It aims to create a hybrid implementation that combines aspects of
both patterns to create a fast, simple to use ORM.

Before we get started exploring the ORM, make sure you :ref:`configure your
database connections <database-configuration>`.

Quick Example
=============

To get started you don't have to write any code. If you've followed the
:ref:`CakePHP conventions for your database tables
<model-and-database-conventions>` you can just start using the ORM. For example
if we wanted to load some data from our ``articles`` table we would start off
creating our ``Articles`` table class. Create
**src/Model/Table/ArticlesTable.php** with the following code::

    <?php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
    }

Then in a controller or command we can have CakePHP create an instance for us::

    public function someMethod()
    {
        $resultset = $this->getTable('Articles')->find()->all();

        foreach ($resultset as $row) {
            echo $row->title;
        }
    }

In other contexts, you can use the ``LocatorAwareTrait`` which add accessor methods for ORM tables::

    use Cake\ORM\Locator\LocatorAwareTrait;

    public function someMethod()
    {
        $articles = $this->getTableLocator()->get('Articles');
        // more code.
    }

Within a static method you can use the :php:class:`~Cake\\Datasource\\FactoryLocator`
to get the table locator::

    $articles = TableRegistry::getTableLocator()->get('Articles');

Table classes represent **collections** of **entities**. Next, lets create an
entity class for our Articles. Entity classes let you define accessor and
mutator methods, define custom logic for individual records and much more. We'll
start off by adding the following to **src/Model/Entity/Article.php** after the
``<?php`` opening tag::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
    }

Entities use the singular CamelCase version of the table name as their class
name by default. Now that we have created our entity class, when we
load entities from the database we'll get instances of our new Article class::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $articles = $this->getTableLocator()->get('Articles');
    $resultset = $articles->find()->all();

    foreach ($resultset as $row) {
        // Each row is now an instance of our Article class.
        echo $row->title;
    }

CakePHP uses naming conventions to link the Table and Entity class together. If
you need to customize which entity a table uses you can use the
``entityClass()`` method to set a specific classname.

See the chapters on :doc:`/orm/table-objects` and :doc:`/orm/entities` for more
information on how to use table objects and entities in your application.

More Information
================

.. toctree::
    :maxdepth: 2

    orm/database-basics
    orm/query-builder
    orm/table-objects
    orm/entities
    orm/retrieving-data-and-resultsets
    orm/validation
    orm/saving-data
    orm/deleting-data
    orm/associations
    orm/behaviors
    orm/schema-system
    console-commands/schema-cache
