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
``UsersController`` and ``MenuLinksController`` are both examples of
conventional controller names.

Public methods on Controllers are often exposed as 'actions' accessible through
a web browser. They are camelBacked. For example the ``/users/view-me`` maps to the ``viewMe()`` method
of the ``UsersController`` out of the box (if one uses default dashed inflection in routing).
Protected or private methods cannot be accessed with routing.

For inflection of acronyms it is useful to treat them as words, so ``CMS`` would be ``Cms``.

URL Considerations for Controller Names
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

As you've just seen, single word controllers map to a simple lower case URL
path. For example, ``UsersController`` (which would be defined in the file name
**UsersController.php**) is accessed from ``http://example.com/users``.

While you can route multiple word controllers in any way you like, the
convention is that your URLs are lowercase and dashed using the ``DashedRoute``
class, therefore ``/menu-links/view-all`` is the correct form to access
the ``MenuLinksController::viewAll()`` action.

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

In general, filenames match the class names, and follow the PSR-4 standard for
autoloading. The following are some examples of class names and their filenames:

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

Database Conventions
====================

Table names corresponding to CakePHP models are plural and underscored. For
example ``users``, ``menu_links``, and ``user_favorite_pages``
respectively. Table name whose name contains multiple words should only
pluralize the last word, for example, ``menu_links``.

Column names with two or more words are underscored, for example, ``first_name``.

Foreign keys in hasMany, belongsTo/hasOne relationships are recognized by
default as the (singular) name of the related table followed by ``_id``. So if
Users hasMany Articles, the ``articles`` table will refer to the ``users``
table via a ``user_id`` foreign key. For a table like ``menu_links``
whose name contains multiple words, the foreign key would be
``menu_link_id``.

Join (or "junction") tables are used in BelongsToMany relationships between
models. These should be named for the tables they connect. The names should be
pluralized and sorted alphabetically: ``articles_tags``, not ``tags_articles``
or ``article_tags``. *The bake command will not work if this convention is not
followed.* If the junction table holds any data other than the linking foreign
keys, you should create a concrete entity/table class for the table.

In addition to using an auto-incrementing integer as primary keys, you can also
use UUID columns. CakePHP will create UUID values automatically using
(:php:meth:`Cake\\Utility\\Text::uuid()`) whenever you save new records using
the ``Table::save()`` method.

Model Conventions
=================

Table class names are plural, CamelCased and end in ``Table``. ``UsersTable``,
``MenuLinksTable``, and ``UserFavoritePagesTable`` are all examples of
table class names matching the ``users``, ``menu_links`` and
``user_favorite_pages`` tables respectively.

Entity class names are singular CamelCased and have no suffix. ``User``,
``MenuLink``, and ``UserFavoritePage`` are all examples of entity names
matching the ``users``, ``menu_links`` and ``user_favorite_pages``
tables respectively.

Enum class names should use a ``{Entity}{Column}`` convention, and enum cases
should use CamelCased names.


View Conventions
================

View template files are named after the controller functions they display, in an
underscored form. The ``viewAll()`` function of the ``ArticlesController`` class
will look for a view template in **templates/Articles/view_all.php**.

The basic pattern is
**templates/Controller/underscored_function_name.php**.

.. note::

    By default CakePHP uses English inflections. If you have database
    tables/columns that use another language, you will need to add inflection
    rules (from singular to plural and vice-versa).  You can use
    :php:class:`Cake\\Utility\\Inflector` to define your custom inflection
    rules. See the documentation about :doc:`/core-libraries/inflector` for more
    information.

Plugins Conventions
===================

It is useful to prefix a CakePHP plugin with "cakephp-" in the package name.
This makes the name semantically related on the framework it depends on.

Do **not** use the CakePHP namespace (cakephp) as vendor name as this is
reserved to CakePHP owned plugins.  The convention is to use lowercase letters
and dashes as separator::

    // Bad
    cakephp/foo-bar

    // Good
    your-name/cakephp-foo-bar

See `awesome list recommendations
<https://github.com/FriendsOfCake/awesome-cakephp/blob/master/CONTRIBUTING.md#tips-for-creating-cakephp-plugins>`__
for details.

Summarized
==========

By naming the pieces of your application using CakePHP conventions, you gain
functionality without the hassle and maintenance tethers of configuration.
Here's a final example that ties the conventions together:

-  Database table: "articles", "menu_links"
-  Table class: ``ArticlesTable``, found at **src/Model/Table/ArticlesTable.php**
-  Entity class: ``Article``, found at **src/Model/Entity/Article.php**
-  Controller class: ``ArticlesController``, found at
   **src/Controller/ArticlesController.php**
-  View template, found at **templates/Articles/index.php**

Using these conventions, CakePHP knows that a request to
``http://example.com/articles`` maps to a call on the ``index()`` method of the
``ArticlesController``, where the ``Articles`` model is automatically available.
None of these relationships have been configured by any means other than by
creating classes and files that you'd need to create anyway.

+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Example    | articles                    | menu_links              |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Database   | articles                    | menu_links              | Table names corresponding to CakePHP                 |
| Table      |                             |                         | models are plural and underscored.                   |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| File       | ArticlesController.php      | MenuLinksController.php |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Table      | ArticlesTable.php           | MenuLinksTable.php      | Table class names are plural,                        |
|            |                             |                         | CamelCased and end in Table                          |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Entity     | Article.php                 | MenuLink.php            | Entity class names are singular,                     |
|            |                             |                         | CamelCased: Article and MenuLink                     |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Class      | ArticlesController          | MenuLinksController     |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Controller | ArticlesController          | MenuLinksController     | Plural, CamelCased, end in Controller                |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Templates  | Articles/index.php          | MenuLinks/index.php     | View template files are named after                  |
|            | Articles/add.php            | MenuLinks/add.php       | the controller functions they                        |
|            | Articles/get_list.php       | MenuLinks/get_list.php  | display, in an underscored form                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Behavior   | ArticlesBehavior.php        | MenuLinksBehavior.php   |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| View       | ArticlesView.php            | MenuLinksView.php       |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Helper     | ArticlesHelper.php          | MenuLinksHelper.php     |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Component  | ArticlesComponent.php       | MenuLinksComponent.php  |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Plugin     | Bad: cakephp/articles       | cakephp/menu-links      | Useful to prefix a CakePHP plugin with "cakephp-"    |
|            | Good: you/cakephp-articles  | you/cakephp-menu-links  | in the package name. Do not use the CakePHP          |
|            |                             |                         | namespace (cakephp) as vendor name as this is        |
|            |                             |                         | reserved to CakePHP owned plugins. The convention    |
|            |                             |                         | is to use lowercase letters and dashes as separator. |
|            |                             |                         |                                                      |
+------------+-----------------------------+-------------------------+------------------------------------------------------+
| Each file would be located in the appropriate folder/namespace in your app folder.                                        |
+------------+-----------------------------+-------------------------+------------------------------------------------------+


Database Convention Summary
===========================
+-----------------+--------------------------------------------------------------+
| Foreign keys    | Relationships are recognized by default as the               |
|                 | (singular) name of the related table followed by ``_id``.    |
| hasMany         | Users hasMany Articles, ``articles`` table will refer        |
| belongsTo/      | to the ``users`` table via a ``user_id`` foreign key.        |
| hasOne          |                                                              |
| BelongsToMany   |                                                              |
|                 |                                                              |
+-----------------+--------------------------------------------------------------+
| Multiple Words  | ``menu_links`` whose name contains multiple words,           |
|                 | the foreign key would be ``menu_link_id``.                   |
+-----------------+--------------------------------------------------------------+
| Auto Increment  | In addition to using an auto-incrementing integer as         |
|                 | primary keys, you can also use UUID columns.                 |
|                 | CakePHP will create UUID values automatically                |
|                 | using (:php:meth:`Cake\\Utility\\Text::uuid()`)              |
|                 | whenever you save new records using the                      |
|                 | ``Table::save()`` method.                                    |
+-----------------+--------------------------------------------------------------+
| Join tables     | Should be named after the model tables they will join        |
|                 | or the bake command won't work, arranged in alphabetical     |
|                 | order (``articles_tags`` rather than ``tags_articles``).     |
|                 | Additional columns on the junction table you should create   |
|                 | a separate entity/table class for that table.                |
+-----------------+--------------------------------------------------------------+

Now that you've been introduced to CakePHP's fundamentals, you might try a run
through the :doc:`/tutorials-and-examples/cms/installation` to see how things fit
together.


.. meta::
    :title lang=en: CakePHP Conventions
    :keywords lang=en: web development experience,maintenance nightmare,index method,legacy systems,method names,php class,uniform system,config files,tenets,articles,conventions,conventional controller,best practices,maps,visibility,news articles,functionality,logic,cakephp,developers
