CakePHP Conventions
###################

We are big fans of convention over configuration. While it takes a
bit of time to learn CakePHP's conventions, you save time in the
long run: by following convention, you get free functionality, and
you free yourself from the maintenance nightmare of tracking config
files. Convention also makes for a very uniform system development,
allowing other developers to jump in and help more easily.

CakePHP's conventions have been distilled from years of web
development experience and best practices. While we suggest you use
these conventions while developing with CakePHP, we should mention
that many of these tenets are easily overridden – something that is
especially handy when working with legacy systems.

Controller Conventions
======================

Controller class names are plural, CamelCased, and end in
``Controller``. ``PeopleController`` and
``LatestArticlesController`` are both examples of conventional
controller names.

The first method you write for a controller might be the
``index()`` method. When a request specifies a controller but not
an action, the default CakePHP behavior is to execute the
``index()`` method of that controller. For example, a request for
http://www.example.com/apples/ maps to a call on the ``index()``
method of the ``ApplesController``, whereas
http://www.example.com/apples/view/ maps to a call on the
``view()`` method of the ``ApplesController``.

You can also change the visibility of controller methods in CakePHP
by prefixing controller method names with underscores. If a
controller method has been prefixed with an underscore, the method
will not be accessible directly from the web but is available for
internal use. For example::

    class NewsController extends AppController {

        public function latest() {
            $this->_findNewArticles();
        }

        protected function _findNewArticles() {
            // Logic to find latest news articles
        }
    }


While the page http://www.example.com/news/latest/ would be
accessible to the user as usual, someone trying to get to the page
http://www.example.com/news/\_findNewArticles/ would get an error,
because the method is preceded with an underscore. You can also use
PHP's visibility keywords to indicate whether or not a method can be
accessed from a URL. Non-public methods cannot be accessed.

URL Considerations for Controller Names
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

As you've just seen, single word controllers map easily to a simple
lower case URL path. For example, ``ApplesController`` (which would
be defined in the file name 'ApplesController.php') is accessed
from http://example.com/apples.

Multiple word controllers *can* be any 'inflected' form which
equals the controller name so:


-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

will all resolve to the index of the RedApples controller. However,
the convention is that your URLs are lowercase and underscored,
therefore /red\_apples/go\_pick is the correct form to access the
``RedApplesController::go_pick`` action.

For more information on CakePHP URLs and parameter handling, see
:ref:`routes-configuration`. If you have files/directories in your ``/webroot``
directory that share a name with one of your routes/controllers, you will be
directed to the file/directory and, not to your controller.

.. _file-and-classname-conventions:

File and Class Name Conventions
===============================

In general, filenames match the class names, which are
CamelCased. So if you have a class **MyNiftyClass**, then in CakePHP,
the file should be named **MyNiftyClass.php**. Below are
examples of how to name the file for each of the different types of
classes you would typically use in a CakePHP application:


-  The Controller class **KissesAndHugsController** would be found
   in a file named **KissesAndHugsController.php**
-  The Component class **MyHandyComponent** would be found in a
   file named **MyHandyComponent.php**
-  The Model class **OptionValue** would be found in a file named
   **OptionValue.php**
-  The Behavior class **EspeciallyFunkableBehavior** would be found
   in a file named **EspeciallyFunkableBehavior.php**
-  The View class **SuperSimpleView** would be found in a file
   named **SuperSimpleView.php**
-  The Helper class **BestEverHelper** would be found in a file
   named **BestEverHelper.php**

Each file would be located in the appropriate folder in your app folder.

Model and Database Conventions
==============================

Model class names are singular and CamelCased. Person, BigPerson,
and ReallyBigPerson are all examples of conventional model names.

Table names corresponding to CakePHP models are plural and
underscored. The underlying tables for the above mentioned models
would be ``people``, ``big_people``, and ``really_big_people``,
respectively.

You can use the utility library :php:class:`Inflector` to check the
singular/plural of words. See the
:doc:`/core-utility-libraries/inflector` for more
information.

Field names with two or more words are underscored:
first\_name.

Foreign keys in hasMany, belongsTo or hasOne relationships are
recognized by default as the (singular) name of the related table
followed by \_id. So if a Baker hasMany Cake, the cakes table will
refer to the bakers table via a baker\_id foreign key. For a
table like category\_types whose name contains multiple words,
the foreign key would be category\_type\_id.

Join tables, used in hasAndBelongsToMany (HABTM) relationships
between models, must be named after the model tables they will
join, e.g. users HABTM groups would be joined by groups_users, and
should be arranged in alphabetical order, e.g. apes\_zoos
is better than zoos\_apes.

All tables with which CakePHP models interact (with the exception
of join tables) require a singular primary key to uniquely
identify each row. If you wish to model a table that does not already have
a single-field primary key, CakePHP's convention is that a
single-field primary key is added to the table. You must add a
single-field primary key if you want to use that table's model.

If primary key's name is not ``id``, then you must set the ``Model.primaryKey``
attribute.

CakePHP does not support composite primary keys. If you want to
directly manipulate your join table data, use direct
:ref:`query <model-query>` calls or add a primary key to act on it
as a normal model. For example::

    CREATE TABLE posts_tags (
        id INT(10) NOT NULL AUTO_INCREMENT,
        post_id INT(10) NOT NULL,
        tag_id INT(10) NOT NULL,
        PRIMARY KEY(id)
    );

Rather than using an auto-increment key as the primary key, you may
also use char(36). CakePHP will then use a unique 36 character UUID
(String::uuid) whenever you save a new record using the Model::save
method.

View Conventions
================

View template files are named after the controller functions they
display, in an underscored form. The getReady() function of the
PeopleController class will look for a view template in
/app/View/People/get\_ready.ctp.

The basic pattern is
/app/View/Controller/underscored\_function\_name.ctp.

By naming the pieces of your application using CakePHP conventions,
you gain functionality without the hassle and maintenance tethers
of configuration. Here's a final example that ties the conventions
together:

-  Database table: "people"
-  Model class: "Person", found at /app/Model/Person.php
-  Controller class: "PeopleController", found at
   /app/Controller/PeopleController.php
-  View template, found at /app/View/People/index.ctp

Using these conventions, CakePHP knows that a request to
http://example.com/people/ maps to a call on the index() function
of the PeopleController, where the Person model is automatically
available (and automatically tied to the 'people' table in the
database), and renders to a file. None of these relationships have
been configured by any means other than by creating classes and
files that you'd need to create anyway.

Now that you've been introduced to CakePHP's fundamentals, you
might try a run through the
:doc:`/tutorials-and-examples/blog/blog` to see how things fit
together.


.. meta::
    :title lang=en: CakePHP Conventions
    :keywords lang=en: web development experience,maintenance nightmare,index method,legacy systems,method names,php class,uniform system,config files,tenets,apples,conventions,conventional controller,best practices,maps,visibility,news articles,functionality,logic,cakephp,developers
