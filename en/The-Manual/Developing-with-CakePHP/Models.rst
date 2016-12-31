Models
######

Models represent data and are used in CakePHP applications for data
access. A model usually represents a database table but can be used to
access anything that stores data such as files, LDAP records, iCal
events, or rows in a CSV file.

A model can be associated with other models. For example, a Recipe may
be associated with the Author of the recipe as well as the Ingredient in
the recipe.

This section will explain what features of the model can be automated,
how to override those features, and what methods and properties a model
can have. It'll explain the different ways to associate your data. It'll
describe how to find, save, and delete data. Finally, it'll look at
Datasources.

Understanding Models
====================

A Model represents your data model. In object-oriented programming a
data model is an object that represents a "thing", like a car, a person,
or a house. A blog, for example, may have many blog posts and each blog
post may have many comments. The Blog, Post, and Comment are all
examples of models, each associated with another.

Here is a simple example of a model definition in CakePHP:

::

    <?php

    class Ingredient extends AppModel {
        var $name = 'Ingredient';
    }

    ?>

With just this simple declaration, the Ingredient model is bestowed with
all the functionality you need to create queries along with saving and
deleting data. These magic methods come from CakePHP's Model class by
the magic of inheritance. The Ingredient model extends the application
model, AppModel, which extends CakePHP's internal Model class. It is
this core Model class that bestows the functionality onto your
Ingredient model.

This intermediate class, AppModel, is empty and if you haven't created
your own is taken from within the /cake/ folder. Overriding the AppModel
allows you to define functionality that should be made available to all
models within your application. To do so, you need to create your own
app\_model.php file that resides in the root of the /app/ folder.
Creating a project using `Bake </view/113/code-generation-with-bake>`_
will automatically generate this file for you.

Create your model PHP file in the /app/models/ directory or in a
subdirectory of /app/models. CakePHP will find it anywhere in the
directory. By convention it should have the same name as the class; for
this example ingredient.php.

CakePHP will dynamically create a model object for you if it cannot find
a corresponding file in /app/models. This also means that if your model
file isn't named correctly (i.e. Ingredient.php or ingredients.php)
CakePHP will use a instance of AppModel rather than your missing (from
CakePHP's perspective) model file. If you're trying to use a method
you've defined in your model, or a behavior attached to your model and
you're getting SQL errors that are the name of the method you're calling
- it's a sure sign CakePHP can't find your model and you either need to
check the file names, clear your tmp files, or both.

See also `Behaviors </view/88/behaviors>`_ for more information on how
to apply similar logic to multiple models.

The ``$name`` property is necessary for PHP4 but optional for PHP5.

With your model defined, it can be accessed from within your
`Controller </view/49/controllers>`_. CakePHP will automatically make
the model available for access when its name matches that of the
controller. For example, a controller named IngredientsController will
automatically initialize the Ingredient model and attach it to the
controller at ``$this->Ingredient``.

::

    <?php
    class IngredientsController extends AppController {
        function index() {
            //grab all ingredients and pass it to the view:
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

    ?>

Associated models are available through the main model. In the following
example, Recipe has an association with the Ingredient model.

::

    <?php
    class RecipesController extends AppController {
        function index() {
            $ingredients = $this->Recipe->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }
    ?>

If models have absolutely NO association between them, you can use
Controller::loadModel() to get the model.

::

    <?php
    class RecipesController extends AppController {
        function index() {
           $recipes = $this->Recipe->find('all');
           
           $this->loadModel('Car');
           $cars = $this->Car->find('all');
           
           $this->set(compact('recipes', 'cars'));
        }
    }
    ?>

Some class names are not usable for model names. For instance "File"
cannot be used as "File" is a class already existing in the CakePHP
core.

Creating Database Tables
========================

While CakePHP can have datasources that aren't database driven, most of
the time, they are. CakePHP is designed to be agnostic and will work
with MySQL, MSSQL, Oracle, PostgreSQL and others. You can create your
database tables as you normally would. When you create your Model
classes, they'll automatically map to the tables that you've created.

Table names are by convention lowercase and pluralized with multi-word
table names separated by underscores. For example, a Model name of
Ingredient expects the table name ingredients. A Model name of
EventRegistration would expect a table name of event\_registrations.
CakePHP will inspect your tables to determine the data type of each
field and uses this information to automate various features such as
outputting form fields in the view.

Field names are by convention lowercase and separated by underscores.

Model to table name associations can be overridden with the ``useTable``
attribute of the model explained later in this chapter.

In the rest of this section, you'll see how CakePHP maps database field
types to PHP data types and how CakePHP can automate tasks based on how
your fields are defined.

Data Type Associations by Database
----------------------------------

Every
`RDBMS <https://en.wikipedia.org/wiki/Relational_database_management_system>`_
defines data types in slightly different ways. Within the datasource
class for each database system, CakePHP maps those types to something it
recognizes and creates a unified interface, no matter which database
system you need to run on.

This breakdown describes how each one is mapped.

MySQL
~~~~~

+----------------+----------------------------+
| CakePHP Type   | Field Properties           |
+================+============================+
| primary\_key   | NOT NULL auto\_increment   |
+----------------+----------------------------+
| string         | varchar(255)               |
+----------------+----------------------------+
| text           | text                       |
+----------------+----------------------------+
| integer        | int(11)                    |
+----------------+----------------------------+
| float          | float                      |
+----------------+----------------------------+
| datetime       | datetime                   |
+----------------+----------------------------+
| timestamp      | datetime                   |
+----------------+----------------------------+
| time           | time                       |
+----------------+----------------------------+
| date           | date                       |
+----------------+----------------------------+
| binary         | blob                       |
+----------------+----------------------------+
| boolean        | tinyint(1)                 |
+----------------+----------------------------+

A *tinyint(1)* field is considered a boolean by CakePHP.

MySQLi
~~~~~~

+----------------+--------------------------------+
| CakePHP Type   | Field Properties               |
+================+================================+
| primary\_key   | DEFAULT NULL auto\_increment   |
+----------------+--------------------------------+
| string         | varchar(255)                   |
+----------------+--------------------------------+
| text           | text                           |
+----------------+--------------------------------+
| integer        | int(11)                        |
+----------------+--------------------------------+
| float          | float                          |
+----------------+--------------------------------+
| datetime       | datetime                       |
+----------------+--------------------------------+
| timestamp      | datetime                       |
+----------------+--------------------------------+
| time           | time                           |
+----------------+--------------------------------+
| date           | date                           |
+----------------+--------------------------------+
| binary         | blob                           |
+----------------+--------------------------------+
| boolean        | tinyint(1)                     |
+----------------+--------------------------------+

ADOdb
~~~~~

+----------------+--------------------+
| CakePHP Type   | Field Properties   |
+================+====================+
| primary\_key   | R(11)              |
+----------------+--------------------+
| string         | C(255)             |
+----------------+--------------------+
| text           | X                  |
+----------------+--------------------+
| integer        | I(11)              |
+----------------+--------------------+
| float          | N                  |
+----------------+--------------------+
| datetime       | T (Y-m-d H:i:s)    |
+----------------+--------------------+
| timestamp      | T (Y-m-d H:i:s)    |
+----------------+--------------------+
| time           | T (H:i:s)          |
+----------------+--------------------+
| date           | T (Y-m-d)          |
+----------------+--------------------+
| binary         | B                  |
+----------------+--------------------+
| boolean        | L(1)               |
+----------------+--------------------+

DB2
~~~

+----------------+----------------------------------------------------------------------------+
| CakePHP Type   | Field Properties                                                           |
+================+============================================================================+
| primary\_key   | not null generated by default as identity (start with 1, increment by 1)   |
+----------------+----------------------------------------------------------------------------+
| string         | varchar(255)                                                               |
+----------------+----------------------------------------------------------------------------+
| text           | clob                                                                       |
+----------------+----------------------------------------------------------------------------+
| integer        | integer(10)                                                                |
+----------------+----------------------------------------------------------------------------+
| float          | double                                                                     |
+----------------+----------------------------------------------------------------------------+
| datetime       | timestamp (Y-m-d-H.i.s)                                                    |
+----------------+----------------------------------------------------------------------------+
| timestamp      | timestamp (Y-m-d-H.i.s)                                                    |
+----------------+----------------------------------------------------------------------------+
| time           | time (H.i.s)                                                               |
+----------------+----------------------------------------------------------------------------+
| date           | date (Y-m-d)                                                               |
+----------------+----------------------------------------------------------------------------+
| binary         | blob                                                                       |
+----------------+----------------------------------------------------------------------------+
| boolean        | smallint(1)                                                                |
+----------------+----------------------------------------------------------------------------+

Firebird/Interbase
~~~~~~~~~~~~~~~~~~

+----------------+--------------------------------------------------------+
| CakePHP Type   | Field Properties                                       |
+================+========================================================+
| primary\_key   | IDENTITY (1, 1) NOT NULL                               |
+----------------+--------------------------------------------------------+
| string         | varchar(255)                                           |
+----------------+--------------------------------------------------------+
| text           | BLOB SUB\_TYPE 1 SEGMENT SIZE 100 CHARACTER SET NONE   |
+----------------+--------------------------------------------------------+
| integer        | integer                                                |
+----------------+--------------------------------------------------------+
| float          | float                                                  |
+----------------+--------------------------------------------------------+
| datetime       | timestamp (d.m.Y H:i:s)                                |
+----------------+--------------------------------------------------------+
| timestamp      | timestamp (d.m.Y H:i:s)                                |
+----------------+--------------------------------------------------------+
| time           | time (H:i:s)                                           |
+----------------+--------------------------------------------------------+
| date           | date (d.m.Y)                                           |
+----------------+--------------------------------------------------------+
| binary         | blob                                                   |
+----------------+--------------------------------------------------------+
| boolean        | smallint                                               |
+----------------+--------------------------------------------------------+

MS SQL
~~~~~~

+----------------+----------------------------+
| CakePHP Type   | Field Properties           |
+================+============================+
| primary\_key   | IDENTITY (1, 1) NOT NULL   |
+----------------+----------------------------+
| string         | varchar(255)               |
+----------------+----------------------------+
| text           | text                       |
+----------------+----------------------------+
| integer        | int                        |
+----------------+----------------------------+
| float          | numeric                    |
+----------------+----------------------------+
| datetime       | datetime (Y-m-d H:i:s)     |
+----------------+----------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)    |
+----------------+----------------------------+
| time           | datetime (H:i:s)           |
+----------------+----------------------------+
| date           | datetime (Y-m-d)           |
+----------------+----------------------------+
| binary         | image                      |
+----------------+----------------------------+
| boolean        | bit                        |
+----------------+----------------------------+

Oracle
~~~~~~

+----------------+----------------------+
| CakePHP Type   | Field Properties     |
+================+======================+
| primary\_key   | number NOT NULL      |
+----------------+----------------------+
| string         | varchar2(255)        |
+----------------+----------------------+
| text           | varchar2             |
+----------------+----------------------+
| integer        | numeric              |
+----------------+----------------------+
| float          | float                |
+----------------+----------------------+
| datetime       | date (Y-m-d H:i:s)   |
+----------------+----------------------+
| timestamp      | date (Y-m-d H:i:s)   |
+----------------+----------------------+
| time           | date (H:i:s)         |
+----------------+----------------------+
| date           | date (Y-m-d)         |
+----------------+----------------------+
| binary         | bytea                |
+----------------+----------------------+
| boolean        | boolean              |
+----------------+----------------------+
| number         | numeric              |
+----------------+----------------------+
| inet           | inet                 |
+----------------+----------------------+

PostgreSQL
~~~~~~~~~~

+----------------+---------------------------+
| CakePHP Type   | Field Properties          |
+================+===========================+
| primary\_key   | serial NOT NULL           |
+----------------+---------------------------+
| string         | varchar(255)              |
+----------------+---------------------------+
| text           | text                      |
+----------------+---------------------------+
| integer        | integer                   |
+----------------+---------------------------+
| float          | float                     |
+----------------+---------------------------+
| datetime       | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| time           | time (H:i:s)              |
+----------------+---------------------------+
| date           | date (Y-m-d)              |
+----------------+---------------------------+
| binary         | bytea                     |
+----------------+---------------------------+
| boolean        | boolean                   |
+----------------+---------------------------+
| number         | numeric                   |
+----------------+---------------------------+
| inet           | inet                      |
+----------------+---------------------------+

SQLite
~~~~~~

+----------------+---------------------------+
| CakePHP Type   | Field Properties          |
+================+===========================+
| primary\_key   | integer primary key       |
+----------------+---------------------------+
| string         | varchar(255)              |
+----------------+---------------------------+
| text           | text                      |
+----------------+---------------------------+
| integer        | integer                   |
+----------------+---------------------------+
| float          | float                     |
+----------------+---------------------------+
| datetime       | datetime (Y-m-d H:i:s)    |
+----------------+---------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| time           | time (H:i:s)              |
+----------------+---------------------------+
| date           | date (Y-m-d)              |
+----------------+---------------------------+
| binary         | blob                      |
+----------------+---------------------------+
| boolean        | boolean                   |
+----------------+---------------------------+

Sybase
~~~~~~

+----------------+-------------------------------------+
| CakePHP Type   | Field Properties                    |
+================+=====================================+
| primary\_key   | numeric(9,0) IDENTITY PRIMARY KEY   |
+----------------+-------------------------------------+
| string         | varchar(255)                        |
+----------------+-------------------------------------+
| text           | text                                |
+----------------+-------------------------------------+
| integer        | int(11)                             |
+----------------+-------------------------------------+
| float          | float                               |
+----------------+-------------------------------------+
| datetime       | datetime (Y-m-d H:i:s)              |
+----------------+-------------------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)             |
+----------------+-------------------------------------+
| time           | datetime (H:i:s)                    |
+----------------+-------------------------------------+
| date           | datetime (Y-m-d)                    |
+----------------+-------------------------------------+
| binary         | image                               |
+----------------+-------------------------------------+
| boolean        | bit                                 |
+----------------+-------------------------------------+

Titles
------

An object, in the physical sense, often has a name or a title that
refers to it. A person has a name like John or Mac or Buddy. A blog post
has a title. A category has a name.

By specifying a ``title`` or ``name`` field, CakePHP will automatically
use this label in various circumstances:

-  Scaffolding — page titles, fieldset labels
-  Lists — normally used for ``<select>`` drop-downs
-  TreeBehavior — reordering, tree views

If you have a title *and* name field in your table, the title will be
used.

If you want to use something other than the convention set
``var $displayField = 'some_field';``. Only one field can be set here.

created and modified
--------------------

By defining a ``created`` or ``modified`` field in your database table
as ``datetime`` fields, CakePHP will recognize those fields and populate
them automatically whenever a record is created or saved to the database
(unless the data being saved already contains a value for these fields).

The ``created`` and ``modified`` fields will be set to the current date
and time when the record is initially added. The ``modified`` field will
be updated with the current date and time whenever the existing record
is saved.

Note: A field named ``updated`` will exhibit the same behavior as
``modified``. These fields need to be datetime fields with the default
value set to NULL to be recognized by CakePHP.

If you have ``updated``, ``created`` or ``modified`` data in your
``$this->data`` (e.g. from a ``Model::read`` or ``Model::set``) before a
``Model::save()`` then the values will be taken from ``$this->data`` and
not automagically updated.

Either use ``unset($this->data['Model']['modified'])``, etc.
Alternatively you can override the ``Model::save()`` to always do it for
you:-

::

    class AppModel extends Model {
    //
    //
        function save($data = null, $validate = true, $fieldList = array()) {

            //clear modified field value before each save
            if (isset($this->data) && isset($this->data[$this->name]))
                unset($this->data[$this->name]['modified']);
            if (isset($data) && isset($data[$this->name]))
                unset($data[$this->name]['modified']);

            return parent::save($data, $validate, $fieldList);
        }
    //
    //
    }

Using UUIDs as Primary Keys
---------------------------

Primary keys are normally defined as INT fields. The database will
automatically increment the field, starting at 1, for each new record
that gets added. Alternatively, if you specify your primary key as a
CHAR(36) or BINARY(36), CakePHP will automatically generate
`UUIDs <https://en.wikipedia.org/wiki/UUID>`_ when new records are
created.

A UUID is a 32 byte string separated by four hyphens, for a total of 36
characters. For example:

::

    550e8400-e29b-41d4-a716-446655440000

UUIDs are designed to be unique, not only within a single table, but
also across tables and databases. If you require a field to remain
unique across systems then UUIDs are a great approach.

Retrieving Your Data
====================

find
----

``find($type, $params)``

Find is the multifunctional workhorse of all model data-retrieval
functions. ``$type`` can be either ``'all'``, ``'first'``, ``'count'``,
``'list'``, ``'neighbors'`` or ``'threaded'``. The default find type is
``'first'``. Keep in mind that ``$type`` is case sensitive. Using a
upper case character (for example ``'All'``) will not produce the
expected results.

``$params`` is used to pass all parameters to the various finds, and has
the following possible keys by default - all of which are optional:

::

    array(
        'conditions' => array('Model.field' => $thisValue), //array of conditions
        'recursive' => 1, //int
        'fields' => array('Model.field1', 'DISTINCT Model.field2'), //array of field names
        'order' => array('Model.created', 'Model.field3 DESC'), //string or array defining order
        'group' => array('Model.field'), //fields to GROUP BY
        'limit' => n, //int
        'page' => n, //int
        'offset'=>n, //int   
        'callbacks' => true //other possible values are false, 'before', 'after'
    )

It's also possible to add and use other parameters, as is made use of by
some find types, behaviors and of course possible with your own model
methods

More information about model callbacks is available
:doc:`/The-Manual/Developing-with-CakePHP/Models`

find('first')
~~~~~~~~~~~~~

``find('first', $params)``

'first' is the default find type, and will return one result, you'd use
this for any use where you expect only one result. If no results are
found, false is returned. Below are a couple of simple (controller code)
examples:

::

    function some_function() {
       ...
       $this->Article->order = null; // resetting if it's set
       $semiRandomArticle = $this->Article->find();
       $this->Article->order = 'Article.created DESC'; // simulating the model having a default order
       $lastCreated = $this->Article->find();
       $alsoLastCreated = $this->Article->find('first', array('order' => array('Article.created DESC')));
       $specificallyThisOne = $this->Article->find('first', array('conditions' => array('Article.id' => 1)));
       ...
    }

In the first example, no parameters at all are passed to find -
therefore no conditions or sort order will be used. The format returned
from ``find('first')`` call is of the form:

::

    Array
    (
        [ModelName] => Array
            (
                [id] => 83
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )

        [AssociatedModelName] => Array
            (
                [id] => 1
                [field1] => value1
                [field2] => value2
                [field3] => value3
            )
    )

There are no additional parameters used by ``find('first')``.

find('count')
~~~~~~~~~~~~~

``find('count', $params)``

``find('count', $params)`` returns an integer value. Below are a couple
of simple (controller code) examples:

::

    function some_function() {
       ...
       $total = $this->Article->find('count');
       $pending = $this->Article->find('count', array('conditions' => array('Article.status' => 'pending')));
       $authors = $this->Article->User->find('count');
       $publishedAuthors = $this->Article->find('count', array(
          'fields' => 'DISTINCT Article.user_id',
          'conditions' => array('Article.status !=' => 'pending')
       ));
       ...
    }

Don't pass ``fields`` as an array to ``find('count')``. You would only
need to specify fields for a DISTINCT count (since otherwise, the count
is always the same - dictated by the conditions).

There are no additional parameters used by ``find('count')``.

find('all')
~~~~~~~~~~~

``find('all', $params)``

``find('all')`` returns an array of (potentially multiple) results. It
is in fact the mechanism used by all ``find()`` variants, as well as
``paginate``. Below are a couple of simple (controller code) examples:

::

    function some_function() {
       ...
       $allArticles = $this->Article->find('all');
       $pending = $this->Article->find('all', array('conditions' => array('Article.status' => 'pending')));
       $allAuthors = $this->Article->User->find('all');
       $allPublishedAuthors = $this->Article->User->find('all', array('conditions' => array('Article.status !=' => 'pending')));
       ...
    }

In the above example ``$allAuthors`` will contain every user in the
users table, there will be no condition applied to the find as none were
passed.

The results of a call to ``find('all')`` will be of the following form:

::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

            )
    )

There are no additional parameters used by ``find('all')``.

find('list')
~~~~~~~~~~~~

``find('list', $params)``

``find('list', $params)`` returns an indexed array, useful for any use
where you would want a list such as for populating input select boxes.
Below are a couple of simple (controller code) examples:

::

    function some_function() {
       ...
        $allArticles = $this->Article->find('list');
        $pending = $this->Article->find('list', array(
            'conditions' => array('Article.status' => 'pending')
        ));
        $allAuthors = $this->Article->User->find('list');
        $allPublishedAuthors = $this->Article->find('list', array(
            'fields' => array('User.id', 'User.name'),
            'conditions' => array('Article.status !=' => 'pending'),
            'recursive' => 0
        ));
       ...
    }

In the above example ``$allAuthors`` will contain every user in the
users table, there will be no condition applied to the find as none were
passed.

The results of a call to ``find('list')`` will be in the following form:

::

    Array
    (
        //[id] => 'displayValue',
        [1] => 'displayValue1',
        [2] => 'displayValue2',
        [4] => 'displayValue4',
        [5] => 'displayValue5',
        [6] => 'displayValue6',
        [3] => 'displayValue3',
    )

When calling ``find('list')`` the ``fields`` passed are used to
determine what should be used as the array key, value and optionally
what to group the results by. By default the primary key for the model
is used for the key, and the display field (which can be configured
using the model attribute :doc:`/The-Manual/Developing-with-CakePHP/Models`) is
used for the value. Some further examples to clarify:.

::

    function some_function() {
       ...
       $justusernames = $this->Article->User->find('list', array('fields' => array('User.username')));
       $usernameMap = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name')));
       $usernameGroups = $this->Article->User->find('list', array('fields' => array('User.username', 'User.first_name', 'User.group')));
       ...
    }

With the above code example, the resultant vars would look something
like this:

::


    $justusernames = Array
    (
        //[id] => 'username',
        [213] => 'AD7six',
        [25] => '_psychic_',
        [1] => 'PHPNut',
        [2] => 'gwoo',
        [400] => 'jperras',
    )

    $usernameMap = Array
    (
        //[username] => 'firstname',
        ['AD7six'] => 'Andy',
        ['_psychic_'] => 'John',
        ['PHPNut'] => 'Larry',
        ['gwoo'] => 'Gwoo',
        ['jperras'] => 'Joël',
    )

    $usernameGroups = Array
    (
        ['User'] => Array
            (
            ['PHPNut'] => 'Larry',
            ['gwoo'] => 'Gwoo',
            )

        ['Admin'] => Array
            (
            ['_psychic_'] => 'John',
            ['AD7six'] => 'Andy',
            ['jperras'] => 'Joël',
            )

    )

find('threaded')
~~~~~~~~~~~~~~~~

``find('threaded', $params)``

``find('threaded', $params)`` returns a nested array, and is appropriate
if you want to use the ``parent_id`` field of your model data to build
nested results. Below are a couple of simple (controller code) examples:

::

    function some_function() {
       ...
       $allCategories = $this->Category->find('threaded');
       $aCategory = $this->Category->find('first', array('conditions' => array('parent_id' => 42))); // not the root
       $someCategories = $this->Category->find('threaded', array(
        'conditions' => array(
            'Article.lft >=' => $aCategory['Category']['lft'], 
            'Article.rght <=' => $aCategory['Category']['rght']
        )
       ));
       ...
    }

It is not necessary to use :doc:`/The-Manual/Core-Behaviors/Tree` to use
this method - but all desired results must be possible to be found in a
single query.

In the above code example, ``$allCategories`` will contain a nested
array representing the whole category structure. The second example
makes use of the data structure used by the :doc:`/The-Manual/Core-Behaviors/Tree` the return a partial, nested, result for
``$aCategory`` and everything below it. The results of a call to
``find('threaded')`` will be of the following form:

::

    Array
    (
        [0] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 83
                        [parent_id] => null
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                [AssociatedModelName] => Array
                    (
                        [id] => 1
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
                [children] => Array
                    (
                [0] => Array
                (
                    [ModelName] => Array
                    (
                        [id] => 42
                                [parent_id] => 83
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )

                    [AssociatedModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        [field3] => value3
                    )
                        [children] => Array
                    (
                    )
                        )
                ...
                    )
            )
    )

The order results appear can be changed as it is influence by the order
of processing. For example, if ``'order' => 'name ASC'`` is passed in
the params to ``find('threaded')``, the results will appear in name
order. Likewise any order can be used, there is no inbuilt requirement
of this method for the top result to be returned first.

There are no additional parameters used by ``find('threaded')``.

find('neighbors')
~~~~~~~~~~~~~~~~~

``find('neighbors', $params)``

'neighbors' will perform a find similar to 'first', but will return the
row before and after the one you request. Below is a simple (controller
code) example:

::

    function some_function() {
       $neighbors = $this->Article->find('neighbors', array('field' => 'id', 'value' => 3));
    }

You can see in this example the two required elements of the ``$params``
array: field and value. Other elements are still allowed as with any
other find (Ex: If your model acts as containable, then you can specify
'contain' in ``$params``). The format returned from a
``find('neighbors')`` call is in the form:

::

    Array
    (
        [prev] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 2
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
                [AssociatedModelName] => Array
                    (
                        [id] => 151
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
            )
        [next] => Array
            (
                [ModelName] => Array
                    (
                        [id] => 4
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
                [AssociatedModelName] => Array
                    (
                        [id] => 122
                        [field1] => value1
                        [field2] => value2
                        ...
                    )
            )
    )

Note how the result always contains only two root elements: prev and
next. This function does not honor a model's default recursive var. The
recursive setting must be passed in the parameters on each call.

Does not honor the recursive attribute on a model. You must set the
recursive param to utilize the recursive feature.

findAllBy
---------

``findAllBy<fieldName>(string $value, array $fields, array $order, int $limit, int $page, int $recursive)``

These magic functions can be used as a shortcut to search your tables by
a certain field. Just add the name of the field (in CamelCase format) to
the end of these functions, and supply the criteria for that field as
the first parameter.

+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| PHP5 findAllBy<x> Example                                                                | Corresponding SQL Fragment                                 |
+==========================================================================================+============================================================+
| $this->Product->findAllByOrderStatus(‘3’);                                               | Product.order\_status = 3                                  |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);                                                  | Recipe.type = ‘Cookie’                                     |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| $this->User->findAllByLastName(‘Anderson’);                                              | User.last\_name = ‘Anderson’                               |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| $this->Cake->findAllById(7);                                                             | Cake.id = 7                                                |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+
| $this->User->findAllByUserName(‘psychic’, array(), array('User.user\_name' => 'asc'));   | User.user\_name = ‘psychic’ ORDER BY User.user\_name ASC   |
+------------------------------------------------------------------------------------------+------------------------------------------------------------+

PHP4 users have to use this function a little differently due to some
case-insensitivity in PHP4:

+-------------------------------------------------+--------------------------------+
| PHP4 findAllBy<x> Example                       | Corresponding SQL Fragment     |
+=================================================+================================+
| $this->Product->findAllByOrder\_status(‘3’);    | Product.order\_status = 3      |
+-------------------------------------------------+--------------------------------+
| $this->Recipe->findAllByType(‘Cookie’);         | Recipe.type = ‘Cookie’         |
+-------------------------------------------------+--------------------------------+
| $this->User->findAllByLast\_name(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+-------------------------------------------------+--------------------------------+
| $this->Cake->findAllById(7);                    | Cake.id = 7                    |
+-------------------------------------------------+--------------------------------+
| $this->User->findAllByUser\_name(‘psychic’);    | User.user\_name = ‘psychic’    |
+-------------------------------------------------+--------------------------------+

The returned result is an array formatted just as it would be from
findAll().

findBy
------

``findBy<fieldName>(string $value);``

The findBy magic functions also accept some optional parameters:

``findBy<fieldName>(string $value[, mixed $fields[, mixed $order]]);``

These magic functions can be used as a shortcut to search your tables by
a certain field. Just add the name of the field (in CamelCase format) to
the end of these functions, and supply the criteria for that field as
the first parameter.

+--------------------------------------------+--------------------------------+
| PHP5 findBy<x> Example                     | Corresponding SQL Fragment     |
+============================================+================================+
| $this->Product->findByOrderStatus(‘3’);    | Product.order\_status = 3      |
+--------------------------------------------+--------------------------------+
| $this->Recipe->findByType(‘Cookie’);       | Recipe.type = ‘Cookie’         |
+--------------------------------------------+--------------------------------+
| $this->User->findByLastName(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+--------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                  | Cake.id = 7                    |
+--------------------------------------------+--------------------------------+
| $this->User->findByUserName(‘psychic’);    | User.user\_name = ‘psychic’    |
+--------------------------------------------+--------------------------------+

PHP4 users have to use this function a little differently due to some
case-insensitivity in PHP4:

+----------------------------------------------+--------------------------------+
| PHP4 findBy<x> Example                       | Corresponding SQL Fragment     |
+==============================================+================================+
| $this->Product->findByOrder\_status(‘3’);    | Product.order\_status = 3      |
+----------------------------------------------+--------------------------------+
| $this->Recipe->findByType(‘Cookie’);         | Recipe.type = ‘Cookie’         |
+----------------------------------------------+--------------------------------+
| $this->User->findByLast\_name(‘Anderson’);   | User.last\_name = ‘Anderson’   |
+----------------------------------------------+--------------------------------+
| $this->Cake->findById(7);                    | Cake.id = 7                    |
+----------------------------------------------+--------------------------------+
| $this->User->findByUser\_name(‘psychic’);    | User.user\_name = ‘psychic’    |
+----------------------------------------------+--------------------------------+

findBy() functions like find('first',...), while findAllBy() functions
like find('all',...).

In either case, the returned result is an array formatted just as it
would be from find() or findAll(), respectively.

query
-----

``query(string $query)``

SQL calls that you can't or don't want to make via other model methods
(this should only rarely be necessary) can be made using the model's
``query()`` method.

If you’re ever using this method in your application, be sure to check
out CakePHP’s :doc:`/The-Manual/Common-Tasks-With-CakePHP/Data-Sanitization`, which
aids in cleaning up user-provided data from injection and cross-site
scripting attacks.

``query()`` does not honour $Model->cachequeries as its functionality is
inherently disjoint from that of the calling model. To avoid caching
calls to query, supply a second argument of false, ie:
``query($query, $cachequeries = false)``

``query()`` uses the table name in the query as the array key for the
returned data, rather than the model name. For example,

::

    $this->Picture->query("SELECT * FROM pictures LIMIT 2;");

might return

::

    Array
    (
        [0] => Array
            (
                [pictures] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [pictures] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

To use the model name as the array key, and get a result consistent with
that returned by the Find methods, the query can be rewritten:

::

    $this->Picture->query("SELECT * FROM pictures AS Picture LIMIT 2;");

which returns

::

    Array
    (
        [0] => Array
            (
                [Picture] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [Picture] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

This syntax and the corresponding array structure is valid for MySQL
only. Cake does not provide any data abstraction when running queries
manually, so exact results will vary between databases.

field
-----

``field(string $name, array $conditions = null, string $order = null)``

Returns the value of a single field, specified as ``$name``, from the
first record matched by $conditions as ordered by $order. If no
conditions are passed and the model id is set, will return the field
value for the current model result. If no matching record is found
returns false.

::

    $this->Post->id = 22;
    echo $this->Post->field('name'); // echo the name for row id 22

    echo $this->Post->field('name', array('created <' => date('Y-m-d H:i:s')), 'created DESC'); // echo the name of the last created instance

read()
------

``read($fields, $id)``

``read()`` is a method used to set the current model data
(``Model::$data``)--such as during edits--but it can also be used in
other circumstances to retrieve a single record from the database.

``$fields`` is used to pass a single field name, as a string, or an
array of field names; if left empty, all fields will be fetched.

``$id`` specifies the ID of the record to be read. By default, the
currently selected record, as specified by ``Model::$id``, is used.
Passing a different value to ``$id`` will cause that record to be
selected.

``read()`` always returns an array (even if only a single field name is
requested). Use ``field`` to retrieve the value of a single field.

::

    function beforeDelete($cascade) {
       ...
       $rating = $this->read('rating'); // gets the rating of the record being deleted.
       $name = $this->read('name', 2); // gets the name of a second record.
       $rating = $this->read('rating'); // gets the rating of the second record.
       $this->id = 3; //
       $this->read(); // reads a third record
       $record = $this->data // stores the third record in $record
       ...
    }

Notice that the third call to ``read()`` fetches the rating of the same
record read before. That is because ``read()`` changes ``Model::$id`` to
any value passed as ``$id``. Lines 6-8 demonstrate how ``read()``
changes the current model data. ``read()`` will also unset all
validation errors on the model. If you would like to keep them, use
``find('first')`` instead.

The example above works if you run this code within the beforeDelete()
method of the model itself. If you want to call read() from a
controller, it would look something like this:

::

    function article($action) {
       ...
       $this->Article->id = 3; //
       $this->Article->read(); // reads a third record
       $record = $this->Article->data // stores the third record in $record
       ...
    }

Complex Find Conditions
-----------------------

Most of the model's find calls involve passing sets of conditions in one
way or another. The simplest approach to this is to use a WHERE clause
snippet of SQL. If you find yourself needing more control, you can use
arrays.

Using arrays is clearer and easier to read, and also makes it very easy
to build queries. This syntax also breaks out the elements of your query
(fields, values, operators, etc.) into discrete, manipulatable parts.
This allows CakePHP to generate the most efficient query possible,
ensure proper SQL syntax, and properly escape each individual part of
the query.

At it's most basic, an array-based query looks like this:

::

    $conditions = array("Post.title" => "This is a post");
    //Example usage with a model:
    $this->Post->find('first', array('conditions' => $conditions));

The structure here is fairly self-explanatory: it will find any post
where the title equals "This is a post". Note that we could have used
just "title" as the field name, but when building queries, it is good
practice to always specify the model name, as it improves the clarity of
the code, and helps prevent collisions in the future, should you choose
to change your schema.

What about other types of matches? These are equally simple. Let's say
we wanted to find all the posts where the title is not "This is a post":

::

    array("Post.title <>" => "This is a post")

Notice the '<>' that follows the field name. CakePHP can parse out any
valid SQL comparison operator, including match expressions using LIKE,
BETWEEN, or REGEX, as long as you leave a space between field name and
the operator. The one exception here is IN (...)-style matches. Let's
say you wanted to find posts where the title was in a given set of
values:

::

    array(
        "Post.title" => array("First post", "Second post", "Third post")
    )

To do a NOT IN(...) match to find posts where the title is not in the
given set of values:

::

    array(
        "NOT" => array("Post.title" => array("First post", "Second post", "Third post"))
    )

Adding additional filters to the conditions is as simple as adding
additional key/value pairs to the array:

::

    array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
    )

You can also create finds that compare two fields in the database

::

    array("Post.created = Post.modified")

This above example will return posts where the created date is equal to
the modified date (ie it will return posts that have never been
modified).

Remember that if you find yourself unable to form a WHERE clause in this
method (ex. boolean operations), you can always specify it as a string
like:

::

    array(
        'Model.field & 8 = 1',
        //other conditions as usual
    )

By default, CakePHP joins multiple conditions with boolean AND; which
means, the snippet above would only match posts that have been created
in the past two weeks, and have a title that matches one in the given
set. However, we could just as easily find posts that match either
condition:

::

    array( "OR" => array (
        "Post.title" => array("First post", "Second post", "Third post"),
        "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

Cake accepts all valid SQL boolean operations, including AND, OR, NOT,
XOR, etc., and they can be upper or lower case, whichever you prefer.
These conditions are also infinitely nest-able. Let's say you had a
belongsTo relationship between Posts and Authors. Let's say you wanted
to find all the posts that contained a certain keyword (“magic”) or were
created in the past two weeks, but you want to restrict your search to
posts written by Bob:

::

    array (
        "Author.name" => "Bob", 
        "OR" => array (
            "Post.title LIKE" => "%magic%",
            "Post.created >" => date('Y-m-d', strtotime("-2 weeks"))
        )
    )

If you need to set multiple conditions on the same field, like when you
want to do a LIKE search with multiple terms, you can do so by using
conditions similar to:

::

     array(
        'OR' => array(
        array('Post.title LIKE' => '%one%'),
        array('Post.title LIKE' => '%two%')
        )
    );

Cake can also check for null fields. In this example, the query will
return records where the post title is not null:

::

    array ("NOT" => array (
            "Post.title" => null
        )
    )

To handle BETWEEN queries, you can use the following:

::

    array('Post.id BETWEEN ? AND ?' => array(1,10))

Note: CakePHP will quote the numeric values depending on the field type
in your DB.

How about GROUP BY?

::

    array('fields'=>array('Product.type','MIN(Product.price) as price'), 'group' => 'Product.type');

The data returned for this would be in the following format:

::

    Array
    (
        [0] => Array
            (
                [Product] => Array
                    (
                        [type] => Clothing
                    )
                [0] => Array
                    (
                        [price] => 32
                    )
            )
        [1] => Array....

A quick example of doing a DISTINCT query. You can use other operators,
such as MIN(), MAX(), etc., in a similar fashion

::

    array('fields'=>array('DISTINCT (User.name) AS my_column_name'), 'order'=>array('User.id DESC'));

You can create very complex conditions, by nesting multiple condition
arrays:

::

    array(
       'OR' => array(
          array('Company.name' => 'Future Holdings'),
          array('Company.city' => 'CA')
       ),
       'AND' => array(
          array(
             'OR'=>array(
                array('Company.status' => 'active'),
                'NOT'=>array(
                   array('Company.status'=> array('inactive', 'suspended'))
                )
             )
         )
       )
    );

Which produces the following SQL:

::

    SELECT `Company`.`id`, `Company`.`name`, 
    `Company`.`description`, `Company`.`location`, 
    `Company`.`created`, `Company`.`status`, `Company`.`size`

    FROM
       `companies` AS `Company`
    WHERE
       ((`Company`.`name` = 'Future Holdings')
       OR
       (`Company`.`name` = 'Steel Mega Works'))
    AND
       ((`Company`.`status` = 'active')
       OR (NOT (`Company`.`status` IN ('inactive', 'suspended'))))

**Sub-queries**

For the example, imagine we have a "users" table with "id", "name" and
"status". The status can be "A", "B" or "C". And we want to get all the
users that have status different than "B" using sub-query.

In order to achieve that we are going to get the model data source and
ask it to build the query as if we were calling a find method, but it
will just return the SQL statement. After that we make an expression and
add it to the conditions array.

::

    $conditionsSubQuery['`User2`.`status`'] = 'B';

    $dbo = $this->User->getDataSource();
    $subQuery = $dbo->buildStatement(
        array(
            'fields' => array('`User2`.`id`'),
            'table' => $dbo->fullTableName($this->User),
            'alias' => 'User2',
            'limit' => null,
            'offset' => null,
            'joins' => array(),
            'conditions' => $conditionsSubQuery,
            'order' => null,
            'group' => null
        ),
        $this->User
    );
    $subQuery = ' `User`.`id` NOT IN (' . $subQuery . ') ';
    $subQueryExpression = $dbo->expression($subQuery);

    $conditions[] = $subQueryExpression;

    $this->User->find('all', compact('conditions'));

This should generate the following SQL:

::

    SELECT 
        `User`.`id` , 
        `User`.`name` , 
        `User`.`status`  
    FROM 
        `users` AS `User` 
    WHERE 
        `User`.`id` NOT IN (
            SELECT 
                `User2`.`id` 
            FROM 
                `users` AS `User2` 
            WHERE 
                `User2`.`status` = 'B' 
        )

Also, if you need to pass just part of your query as raw SQL as the
above, datasource **expressions** with raw SQL work for any part of the
find query.

Saving Your Data
================

CakePHP makes saving model data a snap. Data ready to be saved should be
passed to the model’s ``save()`` method using the following basic
format:

::

    Array
    (
        [ModelName] => Array
            (
                [fieldname1] => 'value'
                [fieldname2] => 'value'
            )
    )

Most of the time you won’t even need to worry about this format:
CakePHP's ``HtmlHelper``, ``FormHelper``, and find methods all package
data in this format. If you're using either of the helpers, the data is
also conveniently available in ``$this->data`` for quick usage.

Here's a quick example of a controller action that uses a CakePHP model
to save data to a database table:

::

    function edit($id) {
        //Has any form data been POSTed?
        if(!empty($this->data)) {
            //If the form data can be validated and saved...
            if($this->Recipe->save($this->data)) {
                //Set a session flash message and redirect.
                $this->Session->setFlash("Recipe Saved!");
                $this->redirect('/recipes');
            }
        }
     
        //If no form data, find the recipe to be edited
        //and hand it to the view.
        $this->data = $this->Recipe->findById($id);
    }

One additional note: when save is called, the data passed to it in the
first parameter is validated using CakePHP validation mechanism (see the
Data Validation chapter for more information). If for some reason your
data isn't saving, be sure to check to see if some validation rules are
being broken.

There are a few other save-related methods in the model that you'll find
useful:

``set($one, $two = null)``

Model::set() can be used to set one or many fields of data to the data
array inside a model. This is useful when using models with the
ActiveRecord features offered by Model.

::

    $this->Post->read(null, 1);
    $this->Post->set('title', 'New title for the article');
    $this->Post->save();

Is an example of how you can use ``set()`` to update and save single
fields, in an ActiveRecord approach. You can also use ``set()`` to
assign new values to multiple fields.

::

    $this->Post->read(null, 1);
    $this->Post->set(array(
        'title' => 'New title',
        'published' => false
    ));
    $this->Post->save();

The above would update the title and published fields and save them to
the database.

``save(array $data = null, boolean $validate = true, array $fieldList = array())``

Featured above, this method saves array-formatted data. The second
parameter allows you to sidestep validation, and the third allows you to
supply a list of model fields to be saved. For added security, you can
limit the saved fields to those listed in ``$fieldList``.

If ``$fieldList`` is not supplied, a malicious user can add additional
fields to the form data (if you are not using Security component), and
by this change fields that were not originally intended to be changed.

The save method also has an alternate syntax:

``save(array $data = null, array $params = array())``

``$params`` array can have any of the following available options as
keys:

::

    array(
        'validate' => true,
        'fieldList' => array(),
        'callbacks' => true //other possible values are false, 'before', 'after'
    )

More information about model callbacks is available
`here </view/76/Callback-Methods>`_

If you don't want the updated field to be updated when saving some data
add ``'updated' => false`` to your ``$data`` array

Once a save has been completed, the ID for the object can be found in
the ``$id`` attribute of the model object - something especially handy
when creating new objects.

::

    $this->Ingredient->save($newData);

    $newIngredientId = $this->Ingredient->id;

Creating or updating is controlled by the model's ``id`` field. If
``$Model->id`` is set, the record with this primary key is updated.
Otherwise a new record is created.

::

    //Create: id isn't set or is null
    $this->Recipe->create();
    $this->Recipe->save($this->data);

    //Update: id is set to a numerical value 
    $this->Recipe->id = 2;
    $this->Recipe->save($this->data);

When calling save in a loop, don't forget to call ``create()``.

``create(array $data = array())``

This method resets the model state for saving new information.

If the ``$data`` parameter (using the array format outlined above) is
passed, the model instance will be ready to save with that data
(accessible at ``$this->data``).

If ``false`` is passed instead of an array, the model instance will not
initialize fields from the model schema that are not already set, it
will only reset fields that have already been set, and leave the rest
unset. Use this to avoid updating fields in the database that were
already set and are intended to be updated.

``saveField(string $fieldName, string $fieldValue, $validate = false)``

Used to save a single field value. Set the ID of the model
(``$this->ModelName->id = $id``) just before calling ``saveField()``.
When using this method, ``$fieldName`` should only contain the name of
the field, not the name of the model and field.

For example, to update the title of a blog post, the call to
``saveField`` from a controller might look something like this:

::

    $this->Post->saveField('title', 'A New Title for a New Day');

You cant stop the updated field being updated with this method, you need
to use the save() method.

``updateAll(array $fields, array $conditions)``

Updates many records in a single call. Records to be updated are
identified by the ``$conditions`` array, and fields to be updated, along
with their values, are identified by the ``$fields`` array. It returns
true on success and false on failure. If no results are updated, true is
returned.

For example, to approve all bakers who have been members for over a
year, the update call might look something like:

::

    $this_year = date('Y-m-d h:i:s', strtotime('-1 year'));

    $this->Baker->updateAll(
        array('Baker.approved' => true),
        array('Baker.created <=' => $this_year)
    );

The $fields array accepts SQL expressions. Literal values should be
quoted manually.

Even if the modified field exists for the model being updated, it is not
going to be updated automatically by the ORM. Just add it manually to
the array if you need it to be updated.

For example, to close all tickets that belong to a certain customer:

::

    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.customer_id' => 453)
    );

By default, updateAll() will automatically join any belongsTo
association for databases that support joins. To prevent this,
temporarily unbind the associations.

``saveAll(array $data = null, array $options = array())``

Used to save (a) multiple individual records for a single model or (b)
this record, as well as all associated records

The following options may be used:

validate: Set to false to disable validation, true to validate each
record before saving, 'first' to validate \*all\* records before any are
saved (default), or 'only' to only validate the records, but not save
them.

atomic: If true (default), will attempt to save all records in a single
transaction. Should be set to false if database/table does not support
transactions. If false, we return an array similar to the $data array
passed, but values are set to true/false depending on whether each
record saved successfully.

fieldList: Equivalent to the $fieldList parameter in ``Model::save()``

For saving multiple records of single model, $data needs to be a
numerically indexed array of records like this:

::

    Array
    (
        [Article] => Array(
                [0] => Array
                    (
                                [title] => title 1
                            )
                [1] => Array
                    (
                                [title] => title 2
                            )
                    )
    )

The command for saving the above $data array would look like this:

::

    $this->Article->saveAll($data['Article']);

Note that we are passing ``$data['Article']`` instead of usual
``$data``. When saving multiple records of same model the records arrays
should be just numerically indexed without the model key.

For saving a record along with its related record having a hasOne or
belongsTo association, the data array should be like this:

::

    Array
    (
        [User] => Array
            (
                [username] => billy
            )
        [Profile] => Array
            (
                [sex] => Male
            [occupation] => Programmer
            )
    )

The command for saving the above $data array would look like this:

::

    $this->Article->saveAll($data);

For saving a record along with its related records having hasMany
association, the data array should be like this:

::

    Array
    (
        [Article] => Array
            (
                [title] => My first article
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [comment] => Comment 1
                [user_id] => 1
                    )
            [1] => Array
                    (
                        [comment] => Comment 2
                [user_id] => 2
                    )
            )
    )

The command for saving the above $data array would look like this:

::

    $this->Article->saveAll($data);

Saving related data with ``saveAll()`` will only work for directly
associated models. If successful, ``last_insert_id()``'s will be stored
in the related models id field, i.e. ``$this->RelatedModel->id``.

Calling a saveAll before another saveAll has completed will cause the
first saveAll to return false. One or both of the saveAll calls must
have atomic set to false to correct this behavior.

Saving Related Model Data (hasOne, hasMany, belongsTo)
------------------------------------------------------

When working with associated models, it is important to realize that
saving model data should always be done by the corresponding CakePHP
model. If you are saving a new Post and its associated Comments, then
you would use both Post and Comment models during the save operation.

If neither of the associated model records exists in the system yet (for
example, you want to save a new User and their related Profile records
at the same time), you'll need to first save the primary, or parent
model.

To get an idea of how this works, let's imagine that we have an action
in our UsersController that handles the saving of a new User and a
related Profile associated by belongsTo association. Your form would
look something like this:

::

    echo $form->create('User', array('action'=>'add'));
    echo $form->input('first_name');
    echo $form->input('last_name');

    echo $form->input('Profile.address');
    echo $form->input('Profile.telephone');

    echo $form->end('Add');

Then using saveAll() you can save your data like this:

::

    <?php
    function add() {
        if (!empty($this->data)) {
            if ($this->User->saveAll($this->data)) {
                // User and Profile created successfully
            } else {
                // Error creating user
            }
        }
    }
    ?>

As a rule, when working with hasOne, hasMany, and belongsTo
associations, its all about keying. The basic idea is to get the key
from one model and place it in the foreign key field on the other.
Sometimes this might involve using the ``$id`` attribute of the model
class after a ``save()``, but other times it might just involve
gathering the ID from a hidden input on a form that’s just been POSTed
to a controller action.

To supplement the basic approach used above, CakePHP also offers a very
handy method ``saveAll()``, which allows you to validate and save
multiple models in one shot. In addition, ``saveAll()`` provides
transactional support to ensure data integrity in your database (i.e. if
one model fails to save, the other models will not be saved either).

For transactions to work correctly in MySQL your tables must use InnoDB
engine. Remember that MyISAM tables do not support transactions.

Let's see how we can use ``saveAll()`` to save Company and Account
models at the same time.

First, you need to build your form for both Company and Account models
(we'll assume that Company hasMany Account).

::


    echo $form->create('Company', array('action'=>'add'));
    echo $form->input('Company.name', array('label'=>'Company name'));
    echo $form->input('Company.description');
    echo $form->input('Company.location');

    echo $form->input('Account.0.name', array('label'=>'Account name'));
    echo $form->input('Account.0.username');
    echo $form->input('Account.0.email');

    echo $form->end('Add');

Take a look at the way we named the form fields for the Account model.
If Company is our main model, ``saveAll()`` will expect the related
model's (Account) data to arrive in a specific format. And having
``Account.0.fieldName`` is exactly what we need.

The above field naming is required for a hasMany association. If the
association between the models is hasOne, you have to use
ModelName.fieldName notation for the associated model.

Now, in our companies\_controller we can create an ``add()`` action:

::


    function add() {
       if(!empty($this->data)) {
          //Use the following to avoid   validation errors:
          unset($this->Company->Account->validate['company_id']);
          $this->Company->saveAll($this->data, array('validate'=>'first'));
       }
    }

That's all there is to it. Now our Company and Account models will be
validated and saved all at the same time. A quick thing to point out
here is the use of ``array('validate'=>'first')``; this option will
ensure that both of our models are validated. Note that
``array('validate'=>'first')`` is the default option on cakephp 1.3.

counterCache - Cache your count()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This function helps you cache the count of related data. Instead of
counting the records manually via ``find('count')``, the model itself
tracks any addition/deleting towards the associated ``$hasMany`` model
and increases/decreases a dedicated integer field within the parent
model table.

The name of the field consists of the singular model name followed by a
underscore and the word "count".

::

    my_model_count

Let's say you have a model called ``ImageComment`` and a model called
``Image``, you would add a new INT-field to the ``image`` table and name
it ``image_comment_count``.

Here are some more examples:

+-------------+--------------------+---------------------------------------------+
| Model       | Associated Model   | Example                                     |
+=============+====================+=============================================+
| User        | Image              | users.image\_count                          |
+-------------+--------------------+---------------------------------------------+
| Image       | ImageComment       | images.image\_comment\_count                |
+-------------+--------------------+---------------------------------------------+
| BlogEntry   | BlogEntryComment   | blog\_entries.blog\_entry\_comment\_count   |
+-------------+--------------------+---------------------------------------------+

Once you have added the counter field you are good to go. Activate
counter-cache in your association by adding a ``counterCache`` key and
set the value to ``true``.

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array('counterCache' => true)
        );
    }

From now on, every time you add or remove a ``Image`` associated to
``ImageAlbum``, the number within ``image_count`` is adjusted
automatically.

You can also specify ``counterScope``. It allows you to specify a simple
condition which tells the model when to update (or when not to,
depending on how you look at it) the counter value.

Using our Image model example, we can specify it like so:

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array(
                'counterCache' => true,
                'counterScope' => array('Image.active' => 1) // only count if "Image" is active = 1
        ));
    }

Saving Related Model Data (HABTM)
---------------------------------

Saving models that are associated by hasOne, belongsTo, and hasMany is
pretty simple: you just populate the foreign key field with the ID of
the associated model. Once that's done, you just call the save() method
on the model, and everything gets linked up correctly.

With HABTM, you need to set the ID of the associated model in your data
array. We'll build a form that creates a new tag and associates it on
the fly with some recipe.

The simplest form might look something like this (we'll assume that
$recipe\_id is already set to something):

::

    <?php echo $form->create('Tag');?>
        <?php echo $form->input(
            'Recipe.id', 
            array('type'=>'hidden', 'value' => $recipe_id)); ?>
        <?php echo $form->input('Tag.name'); ?>
        <?php echo $form->end('Add Tag'); ?>

In this example, you can see the ``Recipe.id`` hidden field whose value
is set to the ID of the recipe we want to link the tag to.

When the ``save()`` method is invoked within the controller, it'll
automatically save the HABTM data to the database.

::

    function add() {
        
        //Save the association
        if ($this->Tag->save($this->data)) {
            //do something on success            
        }
    }

With the preceding code, our new Tag is created and associated with a
Recipe, whose ID was set in $this->data['Recipe']['id'].

Other ways we might want to present our associated data can include a
select drop down list. The data can be pulled from the model using the
``find('list')`` method and assigned to a view variable of the model
name. An input with the same name will automatically pull in this data
into a ``<select>``.

::

    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // in the view:
    $form->input('tags');

A more likely scenario with a HABTM relationship would include a
``<select>`` set to allow multiple selections. For example, a Recipe can
have multiple Tags assigned to it. In this case, the data is pulled out
of the model the same way, but the form input is declared slightly
different. The tag name is defined using the ``ModelName`` convention.

::

    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // in the view:
    $form->input('Tag');

Using the preceding code, a multiple select drop down is created,
allowing for multiple choices to automatically be saved to the existing
Recipe being added or saved to the database.

**What to do when HABTM becomes complicated?**

By default when saving a HasAndBelongsToMany relationship, Cake will
delete all rows on the join table before saving new ones. For example if
you have a Club that has 10 Children associated. You then update the
Club with 2 children. The Club will only have 2 Children, not 12.

Also note that if you want to add more fields to the join (when it was
created or meta information) this is possible with HABTM join tables,
but it is important to understand that you have an easy option.

HasAndBelongsToMany between two models is in reality shorthand for three
models associated through both a hasMany and a belongsTo association.

Consider this example:

::

    Child hasAndBelongsToMany Club

Another way to look at this is adding a Membership model:

::

    Child hasMany Membership
    Membership belongsTo Child, Club
    Club hasMany Membership.

These two examples are almost the exact same. They use the same amount
and named fields in the database and the same amount of models. The
important differences are that the "join" model is named differently and
its behavior is more predictable.

When your join table contains extra fields besides two foreign keys, in
most cases it's easier to make a model for the join table and setup
hasMany, belongsTo associations as shown in example above instead of
using HABTM association.

Deleting Data
=============

These methods can be used to remove data.

delete
------

``delete(int $id = null, boolean $cascade = true);``

Deletes the record identified by $id. By default, also deletes records
dependent on the record specified to be deleted.

For example, when deleting a User record that is tied to many Recipe
records (User 'hasMany' or 'hasAndBelongsToMany' Recipes):

-  if $cascade is set to true, the related Recipe records are also
   deleted if the models dependent-value is set to true.
-  if $cascade is set to false, the Recipe records will remain after the
   User has been deleted.

deleteAll
---------

``deleteAll(mixed $conditions, $cascade = true, $callbacks = false)``

Same as with ``delete()`` and ``remove()``, except that ``deleteAll()``
deletes all records that match the supplied conditions. The
``$conditions`` array should be supplied as an SQL fragment or array.

**conditions** Conditions to match
**cascade** Boolean, Set to true to delete records that depend on this
record. Note that you will need to set dependent to true in the relevant
model associations
**callbacks** Boolean, Run callbacks


Associations: Linking Models Together
=====================================

One of the most powerful features of CakePHP is the ability to link
relational mapping provided by the model. In CakePHP, the links between
models are handled through associations.

Defining relations between different objects in your application should
be a natural process. For example: in a recipe database, a recipe may
have many reviews, reviews have a single author, and authors may have
many recipes. Defining the way these relations work allows you to access
your data in an intuitive and powerful way.

The purpose of this section is to show you how to plan for, define, and
utilize associations between models in CakePHP.

While data can come from a variety of sources, the most common form of
storage in web applications is a relational database. Most of what this
section covers will be in that context.

For information on associations with Plugin models, see :doc:`/The-Manual/Developing-with-CakePHP/Plugins`.

Relationship Types
------------------

The four association types in CakePHP are: hasOne, hasMany, belongsTo,
and hasAndBelongsToMany (HABTM).

+----------------+-----------------------+------------------------------------------+
| Relationship   | Association Type      | Example                                  |
+================+=======================+==========================================+
| one to one     | hasOne                | A user has one profile.                  |
+----------------+-----------------------+------------------------------------------+
| one to many    | hasMany               | A user can have multiple recipes.        |
+----------------+-----------------------+------------------------------------------+
| many to one    | belongsTo             | Many recipes belong to a user.           |
+----------------+-----------------------+------------------------------------------+
| many to many   | hasAndBelongsToMany   | Recipes have, and belong to many tags.   |
+----------------+-----------------------+------------------------------------------+

Associations are defined by creating a class variable named after the
association you are defining. The class variable can sometimes be as
simple as a string, but can be as complete as a multidimensional array
used to define association specifics.

::

    <?php

    class User extends AppModel {
        var $name = 'User';
        var $hasOne = 'Profile';
        var $hasMany = array(
            'Recipe' => array(
                'className'  => 'Recipe',
                'conditions' => array('Recipe.approved' => '1'),
                'order'      => 'Recipe.created DESC'
            )
        );
    }

    ?>

In the above example, the first instance of the word 'Recipe' is what is
termed an 'Alias'. This is an identifier for the relationship and can be
anything you choose. Usually, you will choose the same name as the class
that it references. However, **aliases for each model must be unique app
wide**. E.g. it is appropriate to have

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $hasMany = array(
            'MyRecipe' => 'Recipe',
        );
        var $hasAndBelongsToMany = array('Member' => 'User');
    }

    class Group extends AppModel {
        var $name = 'Group';
        var $hasMany = array(
            'MyRecipe' => array(
                'className'  => 'Recipe',
            )
        );
        var $hasAndBelongsToMany = array('MemberOf' => 'Group');
    }
    ?>

but the following will not work well in all circumstances:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $hasMany = array(
            'MyRecipe' => 'Recipe',
        );
        var $hasAndBelongsToMany = array('Member' => 'User');
    }

    class Group extends AppModel {
        var $name = 'Group';
        var $hasMany = array(
            'MyRecipe' => array(
                'className'  => 'Recipe',
            )
        );
        var $hasAndBelongsToMany = array('Member' => 'Group');
    }
    ?>

because here we have the alias 'Member' referring to both the User (in
Group) and the Group (in User) model in the HABTM associations. Choosing
non-unique names for model aliases across models can cause unexpected
behavior.

Cake will automatically create links between associated model objects.
So for example in your ``User`` model you can access the ``Recipe``
model as

::

    $this->Recipe->someFunction();

Similarly in your controller you can access an associated model simply
by following your model associations and without adding it to the
``$uses`` array:

::

    $this->User->Recipe->someFunction();

Remember that associations are defined 'one way'. If you define User
hasMany Recipe that has no effect on the Recipe Model. You need to
define Recipe belongsTo User to be able to access the User model from
your Recipe model

hasOne
------

Let’s set up a User model with a hasOne relationship to a Profile model.

First, your database tables need to be keyed correctly. For a hasOne
relationship to work, one table has to contain a foreign key that points
to a record in the other. In this case the profiles table will contain a
field called user\_id. The basic pattern is:

+------------------------+----------------------+
| Relation               | Schema               |
+========================+======================+
| Apple hasOne Banana    | bananas.apple\_id    |
+------------------------+----------------------+
| User hasOne Profile    | profiles.user\_id    |
+------------------------+----------------------+
| Doctor hasOne Mentor   | mentors.doctor\_id   |
+------------------------+----------------------+

Table: **hasOne:** the *other* model contains the foreign key.

The User model file will be saved in /app/models/user.php. To define the
‘User hasOne Profile’ association, add the $hasOne property to the model
class. Remember to have a Profile model in /app/models/profile.php, or
the association won’t work.

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasOne = 'Profile';   
    }
    ?>

There are two ways to describe this relationship in your model files.
The simplest method is to set the $hasOne attribute to a string
containing the classname of the associated model, as we’ve done above.

If you need more control, you can define your associations using array
syntax. For example, you might want to limit the association to include
only certain records.

::

    <?php

    class User extends AppModel {
        var $name = 'User';          
        var $hasOne = array(
            'Profile' => array(
                'className'    => 'Profile',
                'conditions'   => array('Profile.published' => '1'),
                'dependent'    => true
            )
        );    
    }
    ?>

Possible keys for hasOne association arrays include:

-  **className**: the classname of the model being associated to the
   current model. If you’re defining a ‘User hasOne Profile’
   relationship, the className key should equal ‘Profile.’
-  **foreignKey**: the name of the foreign key found in the other model.
   This is especially handy if you need to define multiple hasOne
   relationships. The default value for this key is the underscored,
   singular name of the current model, suffixed with ‘\_id’. In the
   example above it would default to 'user\_id'.
-  **conditions**: An SQL fragment used to filter related model records.
   It’s good practice to use model names in SQL fragments:
   “Profile.approved = 1” is always better than just “approved = 1.”
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for the
   returned associated rows.
-  **dependent**: When the dependent key is set to true, and the model’s
   delete() method is called with the cascade parameter set to true,
   associated model records are also deleted. In this case we set it
   true so that deleting a User will also delete her associated Profile.

Once this association has been defined, find operations on the User
model will also fetch a related Profile record if it exists:

::

    //Sample results from a $this->User->find() call.

    Array
    (
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )
    )

belongsTo
---------

Now that we have Profile data access from the User model, let’s define a
belongsTo association in the Profile model in order to get access to
related User data. The belongsTo association is a natural complement to
the hasOne and hasMany associations: it allows us to see the data from
the other direction.

When keying your database tables for a belongsTo relationship, follow
this convention:

+---------------------------+----------------------+
| Relation                  | Schema               |
+===========================+======================+
| Banana belongsTo Apple    | bananas.apple\_id    |
+---------------------------+----------------------+
| Profile belongsTo User    | profiles.user\_id    |
+---------------------------+----------------------+
| Mentor belongsTo Doctor   | mentors.doctor\_id   |
+---------------------------+----------------------+

Table: **belongsTo:** the *current* model contains the foreign key.

If a model(table) contains a foreign key, it belongsTo the other
model(table).

We can define the belongsTo association in our Profile model at
/app/models/profile.php using the string syntax as follows:

::

    <?php

    class Profile extends AppModel {
        var $name = 'Profile';                
        var $belongsTo = 'User';   
    }
    ?>

We can also define a more specific relationship using array syntax:

::

    <?php

    class Profile extends AppModel {
        var $name = 'Profile';                
        var $belongsTo = array(
            'User' => array(
                'className'    => 'User',
                'foreignKey'    => 'user_id'
            )
        );  
    }
    ?>

Possible keys for belongsTo association arrays include:

-  **className**: the classname of the model being associated to the
   current model. If you’re defining a ‘Profile belongsTo User’
   relationship, the className key should equal ‘User.’
-  **foreignKey**: the name of the foreign key found in the current
   model. This is especially handy if you need to define multiple
   belongsTo relationships. The default value for this key is the
   underscored, singular name of the other model, suffixed with ‘\_id’.
-  **conditions**: An SQL fragment used to filter related model records.
   It’s good practice to use model names in SQL fragments: “User.active
   = 1” is always better than just “active = 1.”
-  **type**: the type of the join to use in the SQL query, default is
   LEFT which may not fit your needs in all situations, INNER may be
   helpful when you want everything from your main and associated models
   or nothing at all!(effective when used with some conditions of
   course). **(NB: type value is in lower case - i.e. left, inner)**
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for the
   returned associated rows.
-  **counterCache**: If set to true the associated Model will
   automatically increase or decrease the
   “[singular\_model\_name]\_count” field in the foreign table whenever
   you do a save() or delete(). If its a string then its the field name
   to use. The value in the counter field represents the number of
   related rows.
-  **counterScope**: Optional conditions array to use for updating
   counter cache field.

Once this association has been defined, find operations on the Profile
model will also fetch a related User record if it exists:

::

    //Sample results from a $this->Profile->find() call.

    Array
    (
       [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )    
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
    )

hasMany
-------

Next step: defining a “User hasMany Comment” association. A hasMany
association will allow us to fetch a user’s comments when we fetch a
User record.

When keying your database tables for a hasMany relationship, follow this
convention:

**hasMany:** the *other* model contains the foreign key.

Relation

Schema

User hasMany Comment

Comment.user\_id

Cake hasMany Virtue

Virtue.cake\_id

Product hasMany Option

Option.product\_id

We can define the hasMany association in our User model at
/app/models/user.php using the string syntax as follows:

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasMany = 'Comment';   
    }
    ?>

We can also define a more specific relationship using array syntax:

::

    <?php

    class User extends AppModel {
        var $name = 'User';                
        var $hasMany = array(
            'Comment' => array(
                'className'     => 'Comment',
                'foreignKey'    => 'user_id',
                'conditions'    => array('Comment.status' => '1'),
                'order'    => 'Comment.created DESC',
                'limit'        => '5',
                'dependent'=> true
            )
        );  
    }
    ?>

Possible keys for hasMany association arrays include:

-  **className**: the classname of the model being associated to the
   current model. If you’re defining a ‘User hasMany Comment’
   relationship, the className key should equal ‘Comment.’
-  **foreignKey**: the name of the foreign key found in the other model.
   This is especially handy if you need to define multiple hasMany
   relationships. The default value for this key is the underscored,
   singular name of the actual model, suffixed with ‘\_id’.
-  **conditions**: An SQL fragment used to filter related model records.
   It’s good practice to use model names in SQL fragments:
   “Comment.status = 1” is always better than just “status = 1.”
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for the
   returned associated rows.
-  **limit**: The maximum number of associated rows you want returned.
-  **offset**: The number of associated rows to skip over (given the
   current conditions and order) before fetching and associating.
-  **dependent**: When dependent is set to true, recursive model
   deletion is possible. In this example, Comment records will be
   deleted when their associated User record has been deleted.
-  **exclusive**: When exclusive is set to true, recursive model
   deletion does the delete with a deleteAll() call, instead of deleting
   each entity separately. This greatly improves performance, but may
   not be ideal for all circumstances.
-  **finderQuery**: A complete SQL query CakePHP can use to fetch
   associated model records. This should be used in situations that
   require very custom results.
   If a query you're building requires a reference to the associated
   model ID, use the special ``{$__cakeID__$}`` marker in the query. For
   example, if your Apple model hasMany Orange, the query should look
   something like this:

   ::

       SELECT Orange.* from oranges as Orange WHERE Orange.apple_id = {$__cakeID__$};

Once this association has been defined, find operations on the User
model will also fetch related Comment records if they exist:

::

    //Sample results from a $this->User->find() call.

    Array
    (  
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [user_id] => 121
                        [title] => On Gwoo the Kungwoo
                        [body] => The Kungwooness is not so Gwooish
                        [created] => 2006-05-01 10:31:01
                    )
                [1] => Array
                    (
                        [id] => 124
                        [user_id] => 121
                        [title] => More on Gwoo
                        [body] => But what of the ‘Nut?
                        [created] => 2006-05-01 10:41:01
                    )
            )
    )

One thing to remember is that you’ll need a complimentary Comment
belongsTo User association in order to get the data from both
directions. What we’ve outlined in this section empowers you to get
Comment data from the User. Adding the Comment belongsTo User
association in the Comment model empowers you to get User data from the
Comment model - completing the connection and allowing the flow of
information from either model’s perspective.

hasAndBelongsToMany (HABTM)
---------------------------

Alright. At this point, you can already call yourself a CakePHP model
associations professional. You're already well versed in the three
associations that take up the bulk of object relations.

Let's tackle the final relationship type: hasAndBelongsToMany, or HABTM.
This association is used when you have two models that need to be joined
up, repeatedly, many times, in many different ways.

The main difference between hasMany and HABTM is that a link between
models in HABTM is not exclusive. For example, we're about to join up
our Recipe model with a Tag model using HABTM. Attaching the "Italian"
tag to my grandma's Gnocchi recipe doesn't "use up" the tag. I can also
tag my Honey Glazed BBQ Spaghettio's with "Italian" if I want to.

Links between hasMany associated objects are exclusive. If my User
hasMany Comments, a comment is only linked to a specific user. It's no
longer up for grabs.

Moving on. We'll need to set up an extra table in the database to handle
HABTM associations. This new join table's name needs to include the
names of both models involved, in alphabetical order, and separated with
an underscore ( \_ ). The contents of the table should be two fields,
each foreign keys (which should be integers) pointing to both of the
primary keys of the involved models. To avoid any issues - don't define
a combined primary key for these two fields, if your application
requires it you can define a unique index. If you plan to add any extra
information to this table, it's a good idea to add an additional primary
key field (by convention 'id') to make acting on the table as easy as
any other model.

**HABTM** requires a separate join table that includes both *model*
names.

+--------------------+---------------------------------------------------------------------------------------+
| Relation           | Schema (HABTM table in bold)                                                          |
+====================+=======================================================================================+
| Recipe HABTM Tag   | **recipes\_tags.**\ id, **recipes\_tags.**\ recipe\_id, **recipes\_tags.**\ tag\_id   |
+--------------------+---------------------------------------------------------------------------------------+
| Cake HABTM Fan     | **cakes\_fans.**\ id, **cakes\_fans.**\ cake\_id, **cakes\_fans.**\ fan\_id           |
+--------------------+---------------------------------------------------------------------------------------+
| Foo HABTM Bar      | **bars\_foos.**\ id, **bars\_foos.**\ foo\_id, **bars\_foos.**\ bar\_id               |
+--------------------+---------------------------------------------------------------------------------------+

Table names are by convention in alphabetical order.

Make sure primary keys in tables **cakes** and **recipes** have "id"
fields as assumed by convention. If they're different than assumed, it
:doc:`/The-Manual/Developing-with-CakePHP/Models`

Once this new table has been created, we can define the HABTM
association in the model files. We're gonna skip straight to the array
syntax this time:

::

    <?php

    class Recipe extends AppModel {
        var $name = 'Recipe';   
        var $hasAndBelongsToMany = array(
            'Tag' =>
                array(
                    'className'              => 'Tag',
                    'joinTable'              => 'recipes_tags',
                    'foreignKey'             => 'recipe_id',
                    'associationForeignKey'  => 'tag_id',
                    'unique'                 => true,
                    'conditions'             => '',
                    'fields'                 => '',
                    'order'                  => '',
                    'limit'                  => '',
                    'offset'                 => '',
                    'finderQuery'            => '',
                    'deleteQuery'            => '',
                    'insertQuery'            => ''
                )
        );
    }
    ?>

Possible keys for HABTM association arrays include:

-  **className**: the classname of the model being associated to the
   current model. If you're defining a ‘Recipe HABTM Tag' relationship,
   the className key should equal ‘Tag.'
-  **joinTable**: The name of the join table used in this association
   (if the current table doesn't adhere to the naming convention for
   HABTM join tables).
-  **with**: Defines the name of the model for the join table. By
   default CakePHP will auto-create a model for you. Using the example
   above it would be called RecipesTag. By using this key you can
   override this default name. The join table model can be used just
   like any "regular" model to access the join table directly.
-  **foreignKey**: the name of the foreign key found in the current
   model. This is especially handy if you need to define multiple HABTM
   relationships. The default value for this key is the underscored,
   singular name of the current model, suffixed with ‘\_id'.
-  **associationForeignKey**: the name of the foreign key found in the
   other model. This is especially handy if you need to define multiple
   HABTM relationships. The default value for this key is the
   underscored, singular name of the other model, suffixed with ‘\_id'.
-  **unique**: If true (default value) cake will first delete existing
   relationship records in the foreign keys table before inserting new
   ones, when updating a record. So existing associations need to be
   passed again when updating.
-  **conditions**: An SQL fragment used to filter related model records.
   It's good practice to use model names in SQL fragments:
   "Comment.status = 1" is always better than just "status = 1."
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for the
   returned associated rows.
-  **limit**: The maximum number of associated rows you want returned.
-  **offset**: The number of associated rows to skip over (given the
   current conditions and order) before fetching and associating.
-  **finderQuery, deleteQuery, insertQuery**: A complete SQL query
   CakePHP can use to fetch, delete, or create new associated model
   records. This should be used in situations that require very custom
   results.

Once this association has been defined, find operations on the Recipe
model will also fetch related Tag records if they exist:

::

    //Sample results from a $this->Recipe->find() call.

    Array
    (  
        [Recipe] => Array
            (
                [id] => 2745
                [name] => Chocolate Frosted Sugar Bombs
                [created] => 2007-05-01 10:31:01
                [user_id] => 2346
            )
        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Breakfast
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Dessert
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Heart Disease
                    )
            )
    )

Remember to define a HABTM association in the Tag model if you'd like to
fetch Recipe data when using the Tag model.

It is also possible to execute custom find queries based on HABTM
relationships. Consider the following examples:

Assuming the same structure in the above example (Recipe HABTM Tag),
let's say we want to fetch all Recipes with the tag 'Dessert', one
potential (wrong) way to achieve this would be to apply a condition to
the association itself:

::

    $this->Recipe->bindModel(array(
        'hasAndBelongsToMany' => array(
            'Tag' => array('conditions'=>array('Tag.name'=>'Dessert'))
    )));
    $this->Recipe->find('all');

::

    //Data Returned
    Array
    (  
        0 => Array
            {
            [Recipe] => Array
                (
                    [id] => 2745
                    [name] => Chocolate Frosted Sugar Bombs
                    [created] => 2007-05-01 10:31:01
                    [user_id] => 2346
                )
            [Tag] => Array
                (
                   [0] => Array
                        (
                            [id] => 124
                            [name] => Dessert
                        )
                )
        )
        1 => Array
            {
            [Recipe] => Array
                (
                    [id] => 2745
                    [name] => Crab Cakes
                    [created] => 2008-05-01 10:31:01
                    [user_id] => 2349
                )
            [Tag] => Array
                (
                }
            }
    }

Notice that this example returns ALL recipes but only the "Dessert"
tags. To properly achieve our goal, there are a number of ways to do it.
One option is to search the Tag model (instead of Recipe), which will
also give us all of the associated Recipes.

::

    $this->Recipe->Tag->find('all', array('conditions'=>array('Tag.name'=>'Dessert')));

We could also use the join table model (which CakePHP provides for us),
to search for a given ID.

::

    $this->Recipe->bindModel(array('hasOne' => array('RecipesTag')));
    $this->Recipe->find('all', array(
            'fields' => array('Recipe.*'),
            'conditions'=>array('RecipesTag.tag_id'=>124) // id of Dessert
    ));

It's also possible to create an exotic association for the purpose of
creating as many joins as necessary to allow filtering, for example:

::

    $this->Recipe->bindModel(array(
        'hasOne' => array(
            'RecipesTag',
            'FilterTag' => array(
                'className' => 'Tag',
                'foreignKey' => false,
                'conditions' => array('FilterTag.id = RecipesTag.tag_id')
    ))));
    $this->Recipe->find('all', array(
            'fields' => array('Recipe.*'),
            'conditions'=>array('FilterTag.name'=>'Dessert')
    ));

Both of which will return the following data:

::

    //Data Returned
    Array
    (  
        0 => Array
            {
            [Recipe] => Array
                (
                    [id] => 2745
                    [name] => Chocolate Frosted Sugar Bombs
                    [created] => 2007-05-01 10:31:01
                    [user_id] => 2346
                )
        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Breakfast
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Dessert
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Heart Disease
                    )
            )
    }

The same binding trick can be used to easily paginate your HABTM models.
Just one word of caution: since paginate requires two queries (one to
count the records and one to get the actual data), be sure to supply the
``false`` parameter to your ``bindModel();`` which essentially tells
CakePHP to keep the binding persistent over multiple queries, rather
than just one as in the default behavior. Please refer to the API for
more details.

For more information on saving HABTM objects see :doc:`/The-Manual/Developing-with-CakePHP/Models`

For more information on binding model associations on the fly see
:doc:`/The-Manual/Developing-with-CakePHP/Models`

Mix and match techniques to achieve your specific objective.

hasMany through (The Join Model)
--------------------------------

It is sometimes desirable to store additional data with a many to many
association. Consider the following

Student hasAndBelongsToMany Course Course hasAndBelongsToMany Student

In other words, a Student can take many Courses and a Course can be
taken my many Students. This is a simple many to many association
demanding a table such as this

::

    id | student_id | course_id

Now what if we want to store the number of days that were attended by
the student on the course and their final grade? The table we'd want
would be

::

    id | student_id | course_id | days_attended | grade

The trouble is, hasAndBelongsToMany will not support this type of
scenario because when hasAndBelongsToMany associations are saved, the
association is deleted first. You would lose the extra data in the
columns as it is not replaced in the new insert.

The way to implement our requirement is to use a **join model**,
otherwise known (in Rails) as a **hasMany through** association. That
is, the association is a model itself. So, we can create a new model
CourseMembership. Take a look at the following models.

::

            student.php
            
            class Student extends AppModel
            {
                public $hasMany = array(
                    'CourseMembership'
                );

                public $validate = array(
                    'first_name' => array(
                        'rule' => 'notEmpty',
                        'message' => 'A first name is required'
                    ),
                    'last_name' => array(
                        'rule' => 'notEmpty',
                        'message' => 'A last name is required'
                    )
                );
            }      
            
            course.php
            
            class Course extends AppModel
            {
                public $hasMany = array(
                    'CourseMembership'
                );

                public $validate = array(
                    'name' => array(
                        'rule' => 'notEmpty',
                        'message' => 'A course name is required'
                    )
                );
            }
            
            course_membership.php

            class CourseMembership extends AppModel
            {
                public $belongsTo = array(
                    'Student', 'Course'
                );

                public $validate = array(
                    'days_attended' => array(
                        'rule' => 'numeric',
                        'message' => 'Enter the number of days the student attended'
                    ),
                    'grade' => array(
                        'rule' => 'notEmpty',
                        'message' => 'Select the grade the student received'
                    )
                );
            }   

The CourseMembership join model uniquely identifies a given Student's
participation on a Course in addition to extra meta-information.

Working with join model data
----------------------------

Now that the models have been defined, let's see how we can save all of
this. Let's say the Head of Cake School has asked us the developer to
write an application that allows him to log a student's attendance on a
course with days attended and grade. Take a look at the following code.

::

        controllers/course_membership_controller.php
        
        class CourseMembershipsController extends AppController
        {
            public $uses = array('CourseMembership');
            
            public function index() {
                $this->set('course_memberships_list', $this->CourseMembership->find('all'));
            }
            
            public function add() {
                
                if (! empty($this->data)) {
                    
                    if ($this->CourseMembership->saveAll(
                        $this->data, array('validate' => 'first'))) {

                        
                        $this->redirect(array('action' => 'index'));
                    }
                }
            }
        }
        
        views/course_memberships/add.ctp

        <?php echo $form->create('CourseMembership'); ?>
            <?php echo $form->input('Student.first_name'); ?>
            <?php echo $form->input('Student.last_name'); ?>
            <?php echo $form->input('Course.name'); ?>
            <?php echo $form->input('CourseMembership.days_attended'); ?>
            <?php echo $form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $form->end(); ?>
        

You can see that the form uses the form helper's dot notation to build
up the data array for the controller's save which looks a bit like this
when submitted.

::

        Array
        (
            [Student] => Array
                (
                    [first_name] => Joe
                    [last_name] => Bloggs
                )

            [Course] => Array
                (
                    [name] => Cake
                )

            [CourseMembership] => Array
                (
                    [days_attended] => 5
                    [grade] => A
                )

        )

Cake will happily be able to save the lot together and assigning the
foreign keys of the Student and Course into CourseMembership with a
saveAll call with this data structure. If we run the index action of our
CourseMembershipsController the data structure received now from a
find('all') is:

::

        Array
        (
            [0] => Array
                (
                    [CourseMembership] => Array
                        (
                            [id] => 1
                            [student_id] => 1
                            [course_id] => 1
                            [days_attended] => 5
                            [grade] => A
                        )

                    [Student] => Array
                        (
                            [id] => 1
                            [first_name] => Joe
                            [last_name] => Bloggs
                        )

                    [Course] => Array
                        (
                            [id] => 1
                            [name] => Cake
                        )

                )

        )

There are of course many ways to work with a join model. The version
above assumes you want to save everything at-once. There will be cases
where you want to create the Student and Course independently and at a
later point associate the two together with a CourseMembership. So you
might have a form that allows selection of existing students and courses
from picklists or ID entry and then the two meta-fields for the
CourseMembership, e.g.

::

        
        views/course_memberships/add.ctp
        
        <?php echo $form->create('CourseMembership'); ?>
            <?php echo $form->input('Student.id', array('type' => 'text', 'label' => 'Student ID', 'default' => 1)); ?>
            <?php echo $form->input('Course.id', array('type' => 'text', 'label' => 'Course ID', 'default' => 1)); ?>
            <?php echo $form->input('CourseMembership.days_attended'); ?>
            <?php echo $form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $form->end(); ?>

And the resultant POST

::

     
        Array
        (
            [Student] => Array
                (
                    [id] => 1
                )

            [Course] => Array
                (
                    [id] => 1
                )

            [CourseMembership] => Array
                (
                    [days_attended] => 10
                    [grade] => 5
                )

        )

Again Cake is good to us and pulls the Student id and Course id into the
CourseMembership with the saveAll.

Join models are pretty useful things to be able to use and Cake makes it
easy to do so with its built-in hasMany and belongsTo associations and
saveAll feature.

Creating and Destroying Associations on the Fly
-----------------------------------------------

Sometimes it becomes necessary to create and destroy model associations
on the fly. This may be for any number of reasons:

-  You want to reduce the amount of associated data fetched, but all
   your associations are on the first level of recursion.
-  You want to change the way an association is defined in order to sort
   or filter associated data.

This association creation and destruction is done using the CakePHP
model bindModel() and unbindModel() methods. (There is also a very
helpful behavior called "Containable", please refer to manual section
about Built-in behaviors for more information). Let's set up a few
models so we can see how bindModel() and unbindModel() work. We'll start
with two models:

::

    <?php

    class Leader extends AppModel {
        var $name = 'Leader';
     
        var $hasMany = array(
            'Follower' => array(
                'className' => 'Follower',
                'order'     => 'Follower.rank'
            )
        );
    }

    ?>

    <?php

    class Follower extends AppModel {
        var $name = 'Follower';
    }

    ?>

Now, in the LeadersController, we can use the find() method in the
Leader model to fetch a Leader and its associated followers. As you can
see above, the association array in the Leader model defines a "Leader
hasMany Followers" relationship. For demonstration purposes, let's use
unbindModel() to remove that association in a controller action.

::

    function someAction() {
        // This fetches Leaders, and their associated Followers
        $this->Leader->find('all');
      
        // Let's remove the hasMany...
        $this->Leader->unbindModel(
            array('hasMany' => array('Follower'))
        );
      
        // Now using a find function will return 
        // Leaders, with no Followers
        $this->Leader->find('all');
      
        // NOTE: unbindModel only affects the very next 
        // find function. An additional find call will use 
        // the configured association information.
      
        // We've already used find('all') after unbindModel(), 
        // so this will fetch Leaders with associated 
        // Followers once again...
        $this->Leader->find('all');
    }

Removing or adding associations using bind- and unbindModel() only works
for the *next* find operation only unless the second parameter has been
set to false. If the second parameter has been set to *false*, the bind
remains in place for the remainder of the request.

Here’s the basic usage pattern for unbindModel():

::

    $this->Model->unbindModel(
        array('associationType' => array('associatedModelClassName'))
    );

Now that we've successfully removed an association on the fly, let's add
one. Our as-of-yet unprincipled Leader needs some associated Principles.
The model file for our Principle model is bare, except for the var $name
statement. Let's associate some Principles to our Leader on the fly (but
remember–only for just the following find operation). This function
appears in the LeadersController:

::

    function anotherAction() {
        // There is no Leader hasMany Principles in 
        // the leader.php model file, so a find here, 
        // only fetches Leaders.
        $this->Leader->find('all');
     
        // Let's use bindModel() to add a new association 
        // to the Leader model:
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );
     
        // Now that we're associated correctly, 
        // we can use a single find function to fetch 
        // Leaders with their associated principles:
        $this->Leader->find('all');
    }

There you have it. The basic usage for bindModel() is the encapsulation
of a normal association array inside an array whose key is named after
the type of association you are trying to create:

::

    $this->Model->bindModel(
            array('associationName' => array(
                    'associatedModelClassName' => array(
                        // normal association keys go here...
                    )
                )
            )
        );

Even though the newly bound model doesn't need any sort of association
definition in its model file, it will still need to be correctly keyed
in order for the new association to work properly.

Multiple relations to the same model
------------------------------------

There are cases where a Model has more than one relation to another
Model. For example you might have a Message model that has two relations
to the User model. One relation to the user that sends a message, and a
second to the user that receives the message. The messages table will
have a field user\_id, but also a field recipient\_id. Now your Message
model can look something like:

::

    <?php
    class Message extends AppModel {
        var $name = 'Message';
        var $belongsTo = array(
            'Sender' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            ),
            'Recipient' => array(
                'className' => 'User',
                'foreignKey' => 'recipient_id'
            )
        );
    }
    ?>

Recipient is an alias for the User model. Now let's see what the User
model would look like.

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $hasMany = array(
            'MessageSent' => array(
                'className' => 'Message',
                'foreignKey' => 'user_id'
            ),
            'MessageReceived' => array(
                'className' => 'Message',
                'foreignKey' => 'recipient_id'
            )
        );
    }
    ?>

It is also possible to create self associations as shown below.

::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        
        var $belongsTo = array(
            'Parent' => array(
                'className' => 'Post',
                'foreignKey' => 'parent_id'
            )
        );

        var $hasMany = array(
            'Children' => array(
                'className' => 'Post',
                'foreignKey' => 'parent_id'
            )
        );
    }
    ?>

**An alternate method** of associating a model with itself (without
assuming a parent/child relationship) is to have both the ``$belongsTo``
and ``$hasMany`` relationships of a model each to declare an identical
alias, className, and foreignKey [property].

::

    <?php
    class MySchema extends CakeSchema {
        public $users = array (
            'id' => array ('type' => 'integer', 'default' => null, 'key' => 'primary'),
            'username' => array ('type' => 'string', 'null' => false, 'key' => 'index'),
            // more schema properties...
            'last_user_id' => array ('type' => 'integer', 'default' => null, 'key' => 'index'),

            'indexes' => array (
                'PRIMARY' => array ('column' => 'id', 'unique' => true),
                // more keys...
                'last_user' => array ('column' => 'last_user_id', 'unique' => false)
            )
        );
    }

    class User extends AppModel {
        public $hasMany = array (
            'Tag' => array (
                'foreignKey' => 'last_user_id'
            ),
            // more hasMany relationships...
            'LastUser' => array (
                'className' => 'User',
                'foreignKey' => 'last_user_id'
            )
        );
        public $belongsTo = array (
            // in most cases this would be the only belongsTo relationship for this model
            'LastUser' => array (
                'className' => 'User',
                'foreignKey' => 'last_user_id',
                'dependent' => true
            )
        );
    }
    ?>

**Reasoning** [for this particular self-association method]: Say there
are many models which contain the property ``$modelClass.lastUserId``.
Each model has the foreign key ``last_user_id``, a reference to the last
user that updated/modified the record in question. The model ``User``
*also contains* the same property (last\_user\_id), since it may be neat
to know if someone has committed a security breach through the
modification of any User record other than their own (you could also use
strict ACL behaviors).

**Fetching a nested array of associated records:**

If your table has ``parent_id`` field you can also use
```find('threaded')`` <https://book.cakephp.org/view/1023/find-threaded>`_
to fetch nested array of records using a single query without setting up
any associations.

Joining tables
--------------

In SQL you can combine related tables using the JOIN statement. This
allows you to perform complex searches across multiples tables (i.e:
search posts given several tags).

In CakePHP some associations (belongsTo and hasOne) perform automatic
joins to retrieve data, so you can issue queries to retrieve models
based on data in the related one.

But this is not the case with hasMany and hasAndBelongsToMany
associations. Here is where forcing joins comes to the rescue. You only
have to define the necessary joins to combine tables and get the desired
results for your query.

Remember you need to set the recursion to -1 for this to work. I.e:
$this->Channel->recursive = -1;

To force a join between tables you need to use the "modern" syntax for
Model::find(), adding a 'joins' key to the $options array. For example:

::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $Item->find('all', $options);

Note that the 'join' arrays are not keyed.

In the above example, a model called Item is left joined to the channels
table. You can alias the table with the Model name, so the retrieved
data complies with the CakePHP data structure.

The keys that define the join are the following:

-  **table**: The table for the join.
-  **alias**: An alias to the table. The name of the model associated
   with the table is the best bet.
-  **type**: The type of join: inner, left or right.
-  **conditions**: The conditions to perform the join.

With joins, you could add conditions based on Related model fields:

::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $options['conditions'] = array(
        'Channel.private' => 1
    );

    $privateItems = $Item->find('all', $options);

You could perform several joins as needed in hasBelongsToMany:

Suppose a Book hasAndBelongsToMany Tag association. This relation uses a
books\_tags table as join table, so you need to join the books table to
the books\_tags table, and this with the tags table:

::

    $options['joins'] = array(
        array('table' => 'books_tags',
            'alias' => 'BooksTag',
            'type' => 'inner',
            'conditions' => array(
                'Books.id = BooksTag.books_id'
            )
        ),
        array('table' => 'tags',
            'alias' => 'Tag',
            'type' => 'inner',
            'conditions' => array(
                'BooksTag.tag_id = Tag.id'
            )
        )
    );

    $options['conditions'] = array(
        'Tag.tag' => 'Novel'
    );

    $books = $Book->find('all', $options);

Using joins with Containable behavior could lead to some SQL errors
(duplicate tables), so you need to use the joins method as an
alternative for Containable if your main goal is to perform searches
based on related data. Containable is best suited to restricting the
amount of related data brought by a find statement.

Callback Methods
================

If you want to sneak in some logic just before or after a CakePHP model
operation, use model callbacks. These functions can be defined in model
classes (including your AppModel) class. Be sure to note the expected
return values for each of these special functions.

beforeFind
----------

``beforeFind(mixed $queryData)``

Called before any find-related operation. The ``$queryData`` passed to
this callback contains information about the current query: conditions,
fields, etc.

If you do not wish the find operation to begin (possibly based on a
decision relating to the ``$queryData`` options), return *false*.
Otherwise, return the possibly modified ``$queryData``, or anything you
want to get passed to find and its counterparts.

You might use this callback to restrict find operations based on a
user’s role, or make caching decisions based on the current load.

afterFind
---------

``afterFind(array $results, bool $primary)``

Use this callback to modify results that have been returned from a find
operation, or to perform any other post-find logic. The $results
parameter passed to this callback contains the returned results from the
model's find operation, i.e. something like:

::

    $results = array(
      0 => array(
        'ModelName' => array(
          'field1' => 'value1',
          'field2' => 'value2',
        ),
      ),
    );

The return value for this callback should be the (possibly modified)
results for the find operation that triggered this callback.

The ``$primary`` parameter indicates whether or not the current model
was the model that the query originated on or whether or not this model
was queried as an association. If a model is queried as an association
the format of ``$results`` can differ; instead of the result you would
normally get from a find operation, you may get this:

::

    $results = array(
      'field_1' => 'value1',
      'field_2' => 'value2'
    );

Code expecting ``$primary`` to be true will probably get a "Cannot use
string offset as an array" fatal error from PHP if a recursive find is
used.

Below is an example of how afterfind can be used for date formating.

::

    function afterFind($results) {
        foreach ($results as $key => $val) {
            if (isset($val['Event']['begindate'])) {
                $results[$key]['Event']['begindate'] = $this->dateFormatAfterFind($val['Event']['begindate']);
            }
        }
        return $results;
    }

    function dateFormatAfterFind($dateString) {
        return date('d-m-Y', strtotime($dateString));
    }

beforeValidate
--------------

``beforeValidate()``

Use this callback to modify model data before it is validated, or to
modify validation rules if required. This function must also return
*true*, otherwise the current save() execution will abort.

beforeSave
----------

``beforeSave(array $options)``

Place any pre-save logic in this function. This function executes
immediately after model data has been successfully validated, but just
before the data is saved using Model::save(). This function should also
return true if you want the save operation to continue.

The ``$options`` array holds the ``$fieldList`` and ``$validate``
variables from ``Model::save()``.

This callback is especially handy for any data-massaging logic that
needs to happen before your data is stored. If your storage engine needs
dates in a specific format, access it at $this->data and modify it.

Below is an example of how beforeSave can be used for date conversion.
The code in the example is used for an application with a begindate
formatted like YYYY-MM-DD in the database and is displayed like
DD-MM-YYYY in the application. Of course this can be changed very
easily. Use the code below in the appropriate model.

::

    function beforeSave($options) {
        if (!empty($this->data['Event']['begindate']) && !empty($this->data['Event']['enddate'])) {
                $this->data['Event']['begindate'] = $this->dateFormatBeforeSave($this->data['Event']['begindate']);
                $this->data['Event']['enddate'] = $this->dateFormatBeforeSave($this->data['Event']['enddate']);
        }
        return true;
    }

    function dateFormatBeforeSave($dateString) {
        return date('Y-m-d', strtotime($dateString)); // Direction is from 
    }

Be sure that beforeSave() returns true, or your save is going to fail.

afterSave
---------

``afterSave(boolean $created)``

If you have logic you need to be executed just after every save
operation, place it in this callback method.

The value of ``$created`` will be true if a new record was created
(rather than an update).

beforeDelete
------------

``beforeDelete(boolean $cascade)``

Place any pre-deletion logic in this function. This function should
return true if you want the deletion to continue, and false if you want
to abort.

The value of ``$cascade`` will be ``true`` if records that depend on
this record will also be deleted.

Be sure that beforeDelete() returns true, or your delete is going to
fail.

::

    // using app/models/ProductCategory.php
    // In the following example, do not let a product category be deleted if it still contains products.
    // A call of $this->Product->delete($id) from ProductsController.php has set $this->id .
    // Assuming 'ProductCategory hasMany Product', we can access $this->Product in the model.
    function beforeDelete()
    {
        $count = $this->Product->find("count", array(
            "conditions" => array("product_category_id" => $this->id)
        ));
        if ($count == 0) {
            return true;
        } else {
            return false;
        }
    }

afterDelete
-----------

``afterDelete()``

Place any logic that you want to be executed after every deletion in
this callback method.

onError
-------

``onError()``

Called if any problems occur.

Model Attributes
================

Model attributes allow you to set properties that can override the
default model behavior.

For a complete list of model attributes and their descriptions visit the
CakePHP API. Check out
`https://api.cakephp.org/class/model <https://api.cakephp.org/class/model>`_.

useDbConfig
-----------

The ``useDbConfig`` property is a string that specifies the name of the
database connection to use to bind your model class to the related
database table. You can set it to any of the database connections
defined within your database configuration file. The database
configuration file is stored in /app/config/database.php.

The ``useDbConfig`` property is defaulted to the 'default' database
connection.

Example usage:

::

    class Example extends AppModel {
       var $useDbConfig = 'alternate';
    }

useTable
--------

The ``useTable`` property specifies the database table name. By default,
the model uses the lowercase, plural form of the model's class name. Set
this attribute to the name of an alternate table, or set it to ``false``
if you wish the model to use no database table.

Example usage:

::

    class Example extends AppModel {
       var $useTable = false; // This model does not use a database table
    }

Alternatively:

::

    class Example extends AppModel {
       var $useTable = 'exmp'; // This model uses a database table 'exmp'
    }

tablePrefix
-----------

The name of the table prefix used for the model. The table prefix is
initially set in the database connection file at
/app/config/database.php. The default is no prefix. You can override the
default by setting the ``tablePrefix`` attribute in the model.

Example usage:

::

    class Example extends AppModel {
       var $tablePrefix = 'alternate_'; // will look for 'alternate_examples'
    }

If you want to use fixtures in your test cases, it is better not to use
the tablePrefix attribute but add the prefix in the useTable attribute,
instead.

primaryKey
----------

Each table normally has a primary key, ``id``. You may change which
field name the model uses as its primary key. This is common when
setting CakePHP to use an existing database table.

Example usage:

::

    class Example extends AppModel {
        var $primaryKey = 'example_id'; // example_id is the field name in the database
    }

displayField
------------

The ``displayField`` attribute specifies which database field should be
used as a label for the record. The label is used in scaffolding and in
``find('list')`` calls. The model will use ``name`` or ``title``, by
default.

For example, to use the ``username`` field:

::

    class User extends AppModel {
       var $displayField = 'username';
    }

Multiple field names cannot be combined into a single display field. For
example, you cannot specify, ``array('first_name', 'last_name')`` as the
display field. Instead create a virtual field with the Model attribute
virtualFields

recursive
---------

The recursive property defines how deep CakePHP should go to fetch
associated model data via ``find()``, ``findAll()`` and ``read()``
methods.

Imagine your application features Groups which belong to a domain and
have many Users which in turn have many Articles. You can set $recursive
to different values based on the amount of data you want back from a
$this->Group->find() call:

+---------+----------------------------------------------------------------------------------------------+
| Depth   | Description                                                                                  |
+=========+==============================================================================================+
| -1      | Cake fetches Group data only, no joins.                                                      |
+---------+----------------------------------------------------------------------------------------------+
| 0       | Cake fetches Group data and its domain                                                       |
+---------+----------------------------------------------------------------------------------------------+
| 1       | Cake fetches a Group, its domain and its associated Users                                    |
+---------+----------------------------------------------------------------------------------------------+
| 2       | Cake fetches a Group, its domain, its associated Users, and the Users' associated Articles   |
+---------+----------------------------------------------------------------------------------------------+

Set it no higher than you need. Having CakePHP fetch data you aren’t
going to use slows your app unnecessarily. Also note that the default
recursive level is 1.

If you want to combine $recursive with the ``fields`` functionality, you
will have to add the columns containing the required foreign keys to the
``fields`` array manually. In the example above, this could mean adding
``domain_id``.

order
-----

The default ordering of data for any find operation. Possible values
include:

::

    var $order = "field"
    var $order = "Model.field";
    var $order = "Model.field asc";
    var $order = "Model.field ASC";
    var $order = "Model.field DESC";
    var $order = array("Model.field" => "asc", "Model.field2" => "DESC");

data
----

The container for the model’s fetched data. While data returned from a
model class is normally used as returned from a find() call, you may
need to access information stored in $data inside of model callbacks.

\_schema
--------

Contains metadata describing the model’s database table fields. Each
field is described by:

-  name
-  type (integer, string, datetime, etc.)
-  null
-  default value
-  length

Example Usage:

::

    var $_schema = array(
        'first_name' => array(
            'type' => 'string', 
            'length' => 30
        ),
        'last_name' => array(
            'type' => 'string', 
            'length' => 30
        ),
        'email' => array(
            'type' => 'string',
            'length' => 30
        ),
        'message' => array('type' => 'text')
    );

validate
--------

This attribute holds rules that allow the model to make data validation
decisions before saving. Keys named after fields hold regex values
allowing the model to try to make matches.

It is not necessary to call validate() before save() as save() will
automatically validate your data before actually saving.

For more information on validation, see the `Data Validation
chapter </view/125/data-validation>`_ later on in this manual.

virtualFields
-------------

Array of virtual fields this model has. Virtual fields are aliased SQL
expressions. Fields added to this property will be read as other fields
in a model but will not be saveable.

Example usage for MySQL:

::

    var $virtualFields = array(
        'name' => "CONCAT(User.first_name, ' ', User.last_name)"
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not advisable
to create virtual fields with the same names as columns on the database,
this can cause SQL errors.

For more information on the ``virtualFields`` property, its proper
usage, as well as limitations, see :doc:`/The-Manual/Developing-with-CakePHP/Models`.

name
----

As you saw earlier in this chapter, the name attribute is a
compatibility feature for PHP4 users and is set to the same value as the
model name.

Example usage:

::

    class Example extends AppModel {
       var $name = 'Example';
    }

cacheQueries
------------

If set to true, data fetched by the model during a single request is
cached. This caching is in-memory only, and only lasts for the duration
of the request. Any duplicate requests for the same data is handled by
the cache.

Additional Methods and Properties
=================================

While CakePHP’s model functions should get you where you need to go,
don’t forget that model classes are just that: classes that allow you to
write your own methods or define your own properties.

Any operation that handles the saving and fetching of data is best
housed in your model classes. This concept is often referred to as the
fat model.

::

    class Example extends AppModel {

       function getRecent() {
          $conditions = array(
             'created BETWEEN (curdate() - interval 7 day) and (curdate() - interval 0 day)'
          );
          return $this->find('all', compact('conditions'));
       }
    }

This ``getRecent()`` method can now be used within the controller.

::

    $recent = $this->Example->getRecent();

Using virtualFields
-------------------

Virtual fields are a new feature in the Model for CakePHP 1.3. Virtual
fields allow you to create arbitrary SQL expressions and assign them as
fields in a Model. These fields cannot be saved, but will be treated
like other model fields for read operations. They will be indexed under
the model's key alongside other model fields.

**How to create virtual fields**

Creating virtual fields is easy. In each model you can define a
$virtualFields property that contains an array of
``field => expressions``. An example of virtual field definitions would
be:

::

    var $virtualFields = array(
        'name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not advisable
to create virtual fields with the same names as columns on the database,
this can cause SQL errors.

**Using virtual fields**

Creating virtual fields is straightforward and easy, interacting with
virtual fields can be done through a few different methods.

**``Model::hasField()``**

``Model::hasField()`` has been updated so that it returns true if the
model has a ``virtualField`` with the correct name. By setting the
second parameter of ``hasField`` to true, ``virtualFields`` will also be
checked when checking if a model has a field. Using the example field
above,

::

    $this->User->hasField('name'); // Will return false, as there is no concrete field called name
    $this->User->hasField('name', true); // Will return true as there is a virtual field called name

**``Model::isVirtualField()``**

This method can be used to check if a field/column is a virtual field or
a concrete field. Will return true if the column is virtual.

::

    $this->User->isVirtualField('name'); //true
    $this->User->isVirtualField('first_name'); //false

**``Model::getVirtualField()``**

This method can be used to access the SQL expression that comprises a
virtual field. If no argument is supplied it will return all virtual
fields in a Model.

::

    $this->User->getVirtualField('name'); //returns 'CONCAT(User.first_name, ' ', User.last_name)'

**``Model::find()`` and virtual fields**

As stated earlier ``Model::find()`` will treat virtual fields much like
any other field in a model. The value of a virtual field will be placed
under the model's key in the resultset. Unlike the behavior of
calculated fields in 1.2

::

    $results = $this->User->find('first');

    // results contains the following
    array(
        'User' => array(
            'first_name' => 'Mark',
            'last_name' => 'Story',
            'name' => 'Mark Story',
            //more fields.
        )
    );

**Pagination and virtual fields**

Since virtual fields behave much like regular fields when doing find's,
``Controller::paginate()`` has been updated to allows sorting by virtual
fields.

Virtual fields
==============

Virtual fields are a new feature in the Model for CakePHP 1.3. Virtual
fields allow you to create arbitrary SQL expressions and assign them as
fields in a Model. These fields cannot be saved, but will be treated
like other model fields for read operations. They will be indexed under
the model's key alongside other model fields.

Creating virtual fields
-----------------------

Creating virtual fields is easy. In each model you can define a
``$virtualFields`` property that contains an array of field =>
expressions. An example of a virtual field definition using MySQL would
be:

::

    var $virtualFields = array(
        'full_name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

And with PostgreSQL:

::

    var $virtualFields = array(
        'name' => 'User.first_name || \' \' || User.last_name'
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not advisable
to create virtual fields with the same names as columns on the database,
this can cause SQL errors.

It is not always useful to have **User.first\_name** fully qualified. If
you do not follow the convention (i.e. you have multiple relations to
other tables) this would result in an error. In this case it may be
better to just use **first\_name \|\| \\'\\' \|\| last\_name** without
the Model Name.

Using virtual fields
--------------------

Creating virtual fields is straightforward and easy, interacting with
virtual fields can be done through a few different methods.

Model::hasField()

Model::hasField() has been updated so that it can return true if the
model has a virtualField with the correct name. By setting the second
parameter of hasField to true, virtualFields will also be checked when
checking if a model has a field. Using the example field above,

::

    $this->User->hasField('name'); // Will return false, as there is no concrete field called name
    $this->User->hasField('name', true); // Will return true as there is a virtual field called name

Model::isVirtualField()

This method can be used to check if a field/column is a virtual field or
a concrete field. Will return true if the column is virtual.

::

    $this->User->isVirtualField('name'); //true
    $this->User->isVirtualField('first_name'); //false

Model::getVirtualField()

This method can be used to access the SQL expression that comprises a
virtual field. If no argument is supplied it will return all virtual
fields in a Model.

::

    $this->User->getVirtualField('name'); //returns 'CONCAT(User.first_name, ' ', User.last_name)'

Model::find() and virtual fields

As stated earlier ``Model::find()`` will treat virtual fields much like
any other field in a model. The value of a virtual field will be placed
under the model's key in the resultset. Unlike the behavior of
calculated fields in 1.2

::

    $results = $this->User->find('first');

    // results contains the following
    array(
        'User' => array(
            'first_name' => 'Mark',
            'last_name' => 'Story',
            'name' => 'Mark Story',
            //more fields.
        )
    );

**Pagination and virtual fields**

Since virtual fields behave much like regular fields when doing find's,
``Controller::paginate()`` has been updated to allow sorting by virtual
fields.

Virtual fields and model aliases
--------------------------------

When you are using virtualFields and models with aliases that are not
the same as their name, you can run into problems as virtualFields do
not update to reflect the bound alias. If you are using virtualFields in
models that have more than one alias it is best to define the
virtualFields in your model's constructor

::

    function __construct($id = false, $table = null, $ds = null) {
        parent::__construct($id, $table, $ds);
        $this->virtualFields['name'] = sprintf('CONCAT(%s.first_name, " ", %s.last_name)', $this->alias, $this->alias);
    }

This will allow your virtualFields to work for any alias you give a
model.

Limitations of virtualFields
----------------------------

The implementation of ``virtualFields`` in 1.3 has a few limitations.
First you cannot use ``virtualFields`` on associated models for
conditions, order, or fields arrays. Doing so will generally result in
an SQL error as the fields are not replaced by the ORM. This is because
it's difficult to estimate the depth at which an associated model might
be found.

A common workaround for this implementation issue is to copy
``virtualFields`` from one model to another at runtime when you need to
access them.

::

    $this->virtualFields['full_name'] = $this->Author->virtualFields['full_name'];

Alternatively, you can define ``$virtualFields`` in your model's
constructor, using ``$this->alias``, like so:

::

    public function __construct($id=false,$table=null,$ds=null){
      parent::__construct($id,$table,$ds);
      $this->virtualFields = array(
        'name'=>"CONCAT(`{$this->alias}`.`first_name`,' ',`{$this->alias}`.`last_name`)"
      );
    }

Transactions
============

To perform a transaction, a model's tables must be of a type that
supports transactions.

All transaction methods must be performed on a model's DataSource
object. To get a model's DataSource from within the model, use:

::

        $dataSource = $this->getDataSource();

You can then use the data source to start, commit, or roll back
transactions.

::

        $dataSource->begin($this);
        
        //Perform some tasks

        if(/*all's well*/) {
            $dataSource->commit($this);
        } else {
            $dataSource->rollback($this);
        }

Nested transactions are currently not supported. If a nested transaction
is started, a commit will return false on the parent transaction.
