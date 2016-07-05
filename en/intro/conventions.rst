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
``PeopleController`` and ``LatestArticlesController`` are both examples of
conventional controller names.

Public methods on Controllers are often exposed as 'actions' accessible through
a web browser. For example the ``/articles/view`` maps to the ``view()`` method
of the ``ArticlesController`` out of the box. Protected or private methods
cannot be accessed with routing.

URL Considerations for Controller Names
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

As you've just seen, single word controllers map to a simple lower case URL
path. For example, ``ApplesController`` (which would be defined in the file name
'ApplesController.php') is accessed from http://example.com/apples.

Multiple word controllers *can* be any "inflected" form which equals the
controller name so:

*  /redApples
*  /RedApples
*  /Red_apples
*  /red_apples

Will all resolve to the index of the RedApples controller. However, the
convention is that your URLs are lowercase and dashed using the ``DashedRoute``
class, therefore ``/red-apples/go-pick`` is the correct form to access the
``RedApplesController::goPick()`` action.

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

-  The Controller class **KissesAndHugsController** would be found in a file
   named **KissesAndHugsController.php**
-  The Component class **MyHandyComponent** would be found in a file named
   **MyHandyComponent.php**
-  The Table class **OptionValuesTable** would be found in a file named
   **OptionValuesTable.php**.
-  The Entity class **OptionValue** would be found in a file named
   **OptionValue.php**.
-  The Behavior class **EspeciallyFunkableBehavior** would be found in a file
   named **EspeciallyFunkableBehavior.php**
-  The View class **SuperSimpleView** would be found in a file named
   **SuperSimpleView.php**
-  The Helper class **BestEverHelper** would be found in a file named
   **BestEverHelper.php**

Each file would be located in the appropriate folder/namespace in your app
folder.

.. _model-and-database-conventions:

Model and Database Conventions
==============================

Table class names are plural and CamelCased. People, BigPeople, and
ReallyBigPeople are all examples of conventional model names.

Table names corresponding to CakePHP models are plural and underscored. The
underlying tables for the above mentioned models would be ``people``,
``big_people``, and ``really_big_people``, respectively.

The convention is to use English words for table and column names. If you use
words in another language, CakePHP might not be able to process the right
inflections (from singular to plural and vice-versa).
For some reason, if you need to add your own language rules for some words, you
can use the utility class :php:class:`Cake\\Utility\\Inflector`. Besides
defining those custom inflection rules, this class also allows you to check
that CakePHP understands your custom syntax for plurals and singulars words. See
the documentation about :doc:`/core-libraries/inflector` for more information.

Field names with two or more words are underscored: first\_name.

Foreign keys in hasMany, belongsTo or hasOne relationships are recognized by
default as the (singular) name of the related table followed by \_id. So if
Bakers hasMany Cakes, the cakes table will refer to the bakers table via a
baker\_id foreign key. For a table like category\_types whose name contains
multiple words, the foreign key would be category\_type\_id.

Join tables, used in BelongsToMany relationships between models, should be named
after the model tables they will join, arranged in alphabetical order
(apples\_zebras rather than zebras\_apples).

Rather than using an auto-increment key as the primary key, you may also use
char(36). CakePHP will then use a unique 36 character UUID (Text::uuid) whenever
you save a new record using the ``Table::save()`` method.

View Conventions
================

View template files are named after the controller functions they display, in an
underscored form. The getReady() function of the PeopleController class will
look for a view template in **src/Template/People/get_ready.ctp**.

The basic pattern is
**src/Template/Controller/underscored_function_name.ctp**.

By naming the pieces of your application using CakePHP conventions, you gain
functionality without the hassle and maintenance tethers of configuration.
Here's a final example that ties the conventions together:

-  Database table: "people"
-  Table class: "PeopleTable", found at **src/Model/Table/PeopleTable.php**
-  Entity class: "Person", found at **src/Model/Entity/Person.php**
-  Controller class: "PeopleController", found at
   **src/Controller/PeopleController.php**
-  View template, found at **src/Template/People/index.ctp**

Using these conventions, CakePHP knows that a request to
http://example.com/people/ maps to a call on the ``index()`` function of the
PeopleController, where the Person model is automatically available (and
automatically tied to the 'people' table in the database), and renders to a
file. None of these relationships have been configured by any means other than
by creating classes and files that you'd need to create anyway.

Now that you've been introduced to CakePHP's fundamentals, you might try a run
through the :doc:`/tutorials-and-examples/bookmarks/intro` to see how things fit
together.


.. meta::
    :title lang=en: CakePHP Conventions
    :keywords lang=en: web development experience,maintenance nightmare,index method,legacy systems,method names,php class,uniform system,config files,tenets,apples,conventions,conventional controller,best practices,maps,visibility,news articles,functionality,logic,cakephp,developers
