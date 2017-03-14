Доступ к Базе Данных и объектно-реляционное отображение ORM
###########################################################

В CakePHP работа с данными из Базы Данных осуществляется с помощью двух основных
типов объектов. Первый тип - **repositories** (репозитории) или по другому **table objects**
(объекты таблицы). Эти объекты предоставляют доступ к наборам данных. Они позволяют сохранять
новые записи, редактировать/удалять существующие, определять отношения между данными и
выполнять различные массовые операции.
Второй тип объектов - **entities** (сущности). Сущности представляют собой конкретные отдельные
записи таблицы и позволяют работать со строкой таблицы как с объектом.

Эти два класса несут ответсвенность почти за все, что связано с обработкой ваших данных, например
валидация, взаимодействие с другими даными и управление информационными потоками данных в вашем
веб-приложении.

CakePHP имеет встроенное объектно-реляционное отображение **ORM** позволяющее работать с
реляционными Базами Данных, но, тем не менее, может быть раширено для поддержки альтернативных
Баз Данных.

The CakePHP ORM borrows ideas and concepts from both ActiveRecord and Datamapper
patterns. It aims to create a hybrid implementation that combines aspects of
both patterns to create a fast, simple to use ORM.

Before we get started exploring the ORM, make sure you :ref:`configure your
    database connections <database-configuration>`.

.. note::

    If you are familiar with previous versions of CakePHP, you should read the
    :doc:`/appendices/orm-migration` for important differences between CakePHP 3.0
    and older versions of CakePHP.

Quick Example
=============

To get started you don't have to write any code. If you've followed the :ref:`CakePHP
    conventions for your database tables <model-and-database-conventions>`
    you can just start using the ORM. For example if we wanted to load some data from our ``articles``
table we could do::

    use Cake\ORM\TableRegistry;

    $articles = TableRegistry::get('Articles');

    $query = $articles->find();

    foreach ($query as $row) {
        echo $row->title;
    }

Note that we didn't have to create any code or wire any configuration up.
The conventions in CakePHP allow us to skip some boilerplate code and allow the
framework to insert base classes when your application has not created
a concrete class. If we wanted to customize our ArticlesTable class adding some
associations or defining some additional methods we would add the following to
**src/Model/Table/ArticlesTable.php** after the ``<?php`` opening tag::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

    }

Table classes use the CamelCased version of the table name with the ``Table``
suffix as the class name. Once your class has been created you get a reference
to it using the :php:class:`~Cake\\ORM\\TableRegistry` as before::

    use Cake\ORM\TableRegistry;

    // Now $articles is an instance of our ArticlesTable class.
    $articles = TableRegistry::get('Articles');

Now that we have a concrete table class, we'll probably want to use a concrete
entity class. Entity classes let you define accessor and mutator methods, define
custom logic for individual records and much more. We'll start off by adding the
following to **src/Model/Entity/Article.php** after the ``<?php`` opening tag::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {

    }

Entities use the singular CamelCase version of the table name as their class
name by default. Now that we have created our entity class, when we
load entities from the database we'll get instances of our new Article class::

    use Cake\ORM\TableRegistry;

    // Now an instance of ArticlesTable.
    $articles = TableRegistry::get('Articles');
    $query = $articles->find();

    foreach ($query as $row) {
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
        console-and-shells/orm-cache
