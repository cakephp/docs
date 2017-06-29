CakePHP Conventions
###################

We are big fans of convention over configuration. While it takes a bit of time
to learn CakePHP's conventions, you save time in the long run. By following
conventions, you get free functionality, and you liberate yourself from the
maintenance nightmare of tracking config files. Conventions also make for a very
uniform development experience, allowing other developers to jump in and help.

Controller Conventions
======================

Controller class names are plural, CamelCased, and end in ``Controller``.
``UsersController`` and ``ArticleCategoriesController`` are both examples of
conventional controller names.

Public methods on Controllers are often exposed as 'actions' accessible through
a web browser. For example the ``/users/view`` maps to the ``view()`` method
of the ``UsersController`` out of the box. Protected or private methods
cannot be accessed with routing.

URL Considerations for Controller Names
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

As you've just seen, single word controllers map to a simple lower case URL
path. For example, ``UsersController`` (which would be defined in the file name
**UsersController.php**) is accessed from http://example.com/users.

While you can route multiple word controllers in any way you like, the
convention is that your URLs are lowercase and dashed using the ``DashedRoute``
class, therefore ``/article-categories/view-all`` is the correct form to access
the ``ArticleCategoriesController::viewAll()`` action.

When you create links using ``this->Html->link()``, you can use the following
conventions for the url array::

    $this->Html->link('link-title', [
        'prefix' => 'MyPrefix' // CamelCased
        'plugin' => 'MyPlugin', // CamelCased
        'controller' => 'ControllerName', // CamelCased
        'action' => 'actionName' // camelBacked
    ]

For more information on CakePHP URLs and parameter handling, see
:ref:`routes-configuration`.

.. _file-and-classname-conventions:

File and Class Name Conventions
===============================

In general, filenames match the class names, and follow the PSR-0 or PSR-4
standards for autoloading. The following are some examples of class names and
their filenames:

-  The Controller class ``LatestArticlesController`` would be found in a file
   named **LatestArticlesController.php**
-  The Component class ``MyHandyComponent`` would be found in a file named
   **MyHandyComponent.php**
-  The Table class ``OptionValuesTable`` would be found in a file named
   **OptionValuesTable.php**.
-  The Entity class ``OptionValue`` would be found in a file named
   **OptionValue.php**.
-  The Behavior class ``EspeciallyFunkableBehavior`` would be found in a file
   named **EspeciallyFunkableBehavior.php**
-  The View class ``SuperSimpleView`` would be found in a file named
   **SuperSimpleView.php**
-  The Helper class ``BestEverHelper`` would be found in a file named
   **BestEverHelper.php**

Each file would be located in the appropriate folder/namespace in your app
folder.

.. _model-and-database-conventions:

Model and Database Conventions
==============================

Table class names are plural, CamelCased and end in ``Table``. ``UsersTable``, ``ArticleCategoriesTable``,
and ``UserFavoritePagesTable`` are all examples of conventional model names.

Table names corresponding to CakePHP models are plural and underscored. The
underlying tables for the above mentioned models would be ``users``,
``article_categories``, and ``user_favorite_pages``, respectively.

The convention is to use English words for table and column names. If you use
words in another language, CakePHP might not be able to process the right
inflections (from singular to plural and vice-versa). If you need to add your
own language rules for some words, you can use the utility class
:php:class:`Cake\\Utility\\Inflector`. Besides defining those custom inflection
rules, this class also allows you to check that CakePHP understands your custom
syntax for plurals and singulars words. See the documentation about
:doc:`/core-libraries/inflector` for more information.

Field names with two or more words are underscored: ``first_name``.

Foreign keys in hasMany, belongsTo/hasOne relationships are recognized by
default as the (singular) name of the related table followed by ``_id``. So if
Users hasMany Articles, the ``articles`` table will refer to the ``users``
table via a ``user_id`` foreign key. For a table like ``article_categories``
whose name contains multiple words, the foreign key would be
``article_category_id``.

Join tables, used in BelongsToMany relationships between models, should be named
after the model tables they will join, arranged in alphabetical order
(``articles_tags`` rather than ``tags_articles``). In case you want to add aditional
data to the intermediate table you will need to to add an individual ``id`` field to 
the join table, so the ``articles_tags`` table will have at least these keys ``article_id``,
``tag_id`` and ``id``.

In addition to use an auto-increment key as the primary key, you may also use
UUID columns. CakePHP will create a unique 36 character UUID
(:php:meth:`Cake\\Utility\\Text::uuid()`) whenever you save a new record using
the ``Table::save()`` method.

View Conventions
================

View template files are named after the controller functions they display, in an
underscored form. The ``viewAll()`` function of the ``ArticlesController`` class
will look for a view template in **src/Template/Articles/view_all.ctp**.

The basic pattern is
**src/Template/Controller/underscored_function_name.ctp**.

By naming the pieces of your application using CakePHP conventions, you gain
functionality without the hassle and maintenance tethers of configuration.
Here's a final example that ties the conventions together:

-  Database table: "articles"
-  Table class: ``ArticlesTable``, found at **src/Model/Table/ArticlesTable.php**
-  Entity class: ``Article``, found at **src/Model/Entity/Article.php**
-  Controller class: ``ArticlesController``, found at
   **src/Controller/ArticlesController.php**
-  View template, found at **src/Template/Articles/index.ctp**

Using these conventions, CakePHP knows that a request to
http://example.com/articles/ maps to a call on the ``index()`` function of the
ArticlesController, where the Articles model is automatically available (and
automatically tied to the 'articles' table in the database), and renders to a
file. None of these relationships have been configured by any means other than
by creating classes and files that you'd need to create anyway.

Now that you've been introduced to CakePHP's fundamentals, you might try a run
through the :doc:`/tutorials-and-examples/bookmarks/intro` to see how things fit
together.

.. meta::
    :title lang=en: CakePHP Conventions
    :keywords lang=en: web development experience,maintenance nightmare,index method,legacy systems,method names,php class,uniform system,config files,tenets,articles,conventions,conventional controller,best practices,maps,visibility,news articles,functionality,logic,cakephp,developers
