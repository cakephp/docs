Models
######

What is a model?
================

What does it do? It separates domain logic from the presentation,
isolating application logic.

A model is generally an access point to the database, and more
specifically, to a certain table in the database. By default, each model
uses the table who's name is plural of its own, i.e. a 'User' model uses
the 'users' table. Models can also contain data validation rules,
association information, and methods specific to the table it uses.
Here's what a simple User model might look like in Cake:

Example User Model, saved in /app/models/user.php
-------------------------------------------------

::

    <?php

    //AppModel gives you all of Cake's Model functionality

    class User extends AppModel
    {
        // Its always good practice to include this variable.
        var $name = 'User';

        // This is used for validation, see Chapter "Data Validation".
        var $validate = array();

        // You can also define associations.
        // See section 6.3 for more information.

        var $hasMany = array('Image' =>
                       array('className' => 'Image')
                       );

        // You can also include your own functions:
        function makeInactive($uid)
        {
            //Put your own logic here...
        }
    }

Model Functions
===============

From a PHP view, models are classes extending the AppModel class. The
AppModel class is originally defined in the cake/ directory, but should
you want to create your own, place it in **app/app\_model.php**. It
should contain methods that are shared between two or more models. It
itself extends the Model class which is a standard Cake library defined
in **cake/libs/model.php**.

While this section will treat most of the often-used functions in Cake's
Model, it's important to remember to use
`https://api.cakephp.org <https://api.cakephp.org>`_ for a full reference.

User-Defined Functions
----------------------

An example of a table-specific method in the model is a pair of methods
for hiding/unhiding posts in a blog.


Example Model Functions
-----------------------

::

    <?php
    class Post extends AppModel
    {
       var $name = 'Post';

       function hide ($id=null)
       {
          if ($id)
          {
              $this->id = $id;
              $this->saveField('hidden', '1');
          }
       }

       function unhide ($id=null)
       {
          if ($id)
          {
              $this->id = $id;
              $this->saveField('hidden', '0');
          }
       }
    }

Retrieving Your Data
--------------------

Below are a few of the standard ways of getting to your data using a
model:

-  **findAll**
-  string *$conditions*
-  array *$fields*
-  string *$order*
-  int *$limit*
-  int *$page*
-  int *$recursive*

Returns the specified fields up to $limit records matching $conditions
(if any), start listing from page $page (default is page 1). $conditions
should look like they would in an SQL statement: $conditions = "race =
'wookie' AND thermal\_detonators > 3", for example.

When the $recursive option is set to an integer value greater than 1,
the findAll() operation will make an effort to return the models
associated to the ones found by the findAll(). If your property has many
owners who in turn have many contracts, a recursive findAll() on your
Property model will return those associated models.

Set $recursive to -1 if you want no associated data fetched during the
find.

-  **find**
-  string *$conditions*
-  array *$fields*
-  string *$order*
-  int *$recursive*

Returns the specified (or all if not specified) fields from the first
record that matches $conditions.

When the $recursive option is set to an integer value between 1 and 3,
the find() operation will make an effort to return the models associated
to the ones found by the find(). The recursive find can go up to three
levels deep. If your property has many owners who in turn have many
contracts, a recursive find() on your Property model will return up to
three levels deep of associated models.

Set $recursive to -1 if you want no associated data fetched durint the
find.

-  **findBy<fieldName>**
-  string *$value*

-  **findAllBy<fieldName>**
-  string *$value*

These magic functions can be used as a shortcut to search your tables
for a row given a certain field, and a certain value. Just tack on the
name of the field you wish to search, and CamelCase it (depending on
your PHP version). Examples (as used in a Controller) might be:

::

    <?php
    //PHP 5 Users
    $this->Post->findByTitle('My First Blog Post');
    $this->Author->findByLastName('Rogers');
    $this->Property->findAllByState('AZ');
    $this->Specimen->findAllByKingdom('Animalia');
    $this->Foo->findAllByThreeWordField('bar');

    //PHP 4 Users
    $this->Post->findByTitle('My First Blog Post');
    $this->Author->findByLast_name('Rogers');        //PHP4 isn't as case-friendly
    $this->Property->findAllByState('AZ');
    $this->Specimen->findAllByKingdom('Animalia');
    $this->Foo->findAllByThree_word_field('bar');    //PHP4 isn't as case-friendly

The returned result is an array formatted just as would be from find()
or findAll().

-  **findNeighbours**
-  string *$conditions*
-  array *$field*
-  string *$value*

Returns an array with the neighboring models (with only the specified
fields), specified by $field and $value, filtered by the SQL conditions,
$conditions.

This is useful in situations where you want 'Previous' and 'Next' links
that walk users through some ordered sequence through your model
entries. It only works for numeric and date based fields::

    <?php
    class ImagesController extends AppController
    {
        function view($id)
        {
            // Say we want to show the image...

            $this->set('image', $this->Image->find("id = $id"));

            // But we also want the previous and next images...

            $this->set('neighbours', $this->Image->findNeighbours(null, 'id', $id));

        }
    }

This gives us the full $image['Image'] array, along with
$neighbours['prev']['Image']['id'] and
$neighbours['next']['Image']['id'] in our view.

-  **field**
-  string *$name*
-  string *$conditions*
-  string *$order*

Returns as a string a single field from the first record matched by
**$conditions** as ordered by **$order**.

-  **findCount**
-  string *$conditions*

Returns the number of records that match the given conditions.

-  **generateList**
-  string *$conditions*
-  string *$order*
-  int *$limit*
-  string *$keyPath*
-  string *$valuePath*

This function is a shortcut to getting a list of key value pairs -
especially handy for creating a html select tag from a list of your
models. Use the $conditions, $order, and $limit parameters just as you
would for a findAll() request. The $keyPath and $valuePath are where you
tell the model where to find the keys and values for your generated
list. For example, if you wanted to generate a list of roles based on
your Role model, keyed by their integer ids, the full call might look
something like::

    <?php
    $this->set(
        'Roles',
        $this->Role->generateList(null, 'role_name ASC', null, '{n}.Role.id', '{n}.Role.role_name')
    );

    //This would return something like:
    array(
        '1' => 'Account Manager',
        '2' => 'Account Viewer',
        '3' => 'System Manager',
        '4' => 'Site Visitor'
    );

-  **read**
-  string *$fields*
-  string *$id*

Use this function to get the fields and their values from the currently
loaded record, or the record specified by $id.

The recursiveness of the result depends on the value of $recursive in
the model.

-  **query**
-  string *$query*

-  **execute**
-  string *$query*

Custom SQL calls can be made using the model's query() and execute()
methods. The difference between the two is that query() is used to make
custom SQL queries (the results of which are returned), and execute() is
used to make custom SQL commands (which require no return value).

Custom Sql Calls with query()
-----------------------------

::

    <?php
    class Post extends AppModel
    {
        var $name = 'Post';

        function posterFirstName()
        {
            $ret = $this->query("SELECT first_name FROM posters_table
                                     WHERE poster_id = 1");
            $firstName = $ret[0]['first_name'];
            return $firstName;
        }
    }

Complex Find Conditions (using arrays)
--------------------------------------

Most of the model's finder calls involve passing sets of conditions in
one way or another. The simplest approach to this is to use a WHERE
clause snippet of SQL, but if you need more control, you can use arrays.
Using arrays is clearer and easier to read, and also makes it very easy
to build queries. This syntax also breaks out the elements of your query
(fields, values, operators, etc.) into discrete, manipulatable parts.
This allows Cake to generate the most efficient query possible, ensure
proper SQL syntax, and properly escape each individual part of the
query.

At it's most basic, an array-based query looks like this:

Basic find conditions array usage example:
------------------------------------------

::

    <?php
    $conditions = array("Post.title" => "This is a post");

    //Example usage with a model:
    $this->Post->find($conditions);

The structure is fairly self-explanatory: it will find any post where
the title matches the string "This is a post". Note that we could have
used just "title" as the field name, but when building queries, it is
good practice to always specify the model name, as it improves the
clarity of the code, and helps prevent collisions in the future, should
you choose to change your schema. What about other types of matches?
These are equally simple. Let's say we wanted to find all the posts
where the title is **not** "This is a post":

::

    <?php
    array("Post.title" => "<> This is a post")

All that was added was '<>' before the expression. Cake can parse out
any valid SQL comparison operator, including match expressions using
LIKE, BETWEEN, or REGEX, as long as you leave a space between the
operator an the expression or value. The one exception here is IN
(...)-style matches. Let's say you wanted to find posts where the title
was in a given set of values:

::

    <?php
    array("Post.title" => array("First post", "Second post", "Third post"))

Adding additional filters to the conditions is as simple as adding
additional key/value pairs to the array::

    <?php
    array
    (
        "Post.title"   => array("First post", "Second post", "Third post"),
        "Post.created" => "> " . date('Y-m-d', strtotime("-2 weeks"))
    )

By default, Cake joins multiple conditions with boolean AND; which
means, the snippet above would only match posts that have been created
in the past two weeks, **and** have a title that matches one in the
given set. However, we could just as easily find posts that match either
condition::

    <?php
    array
    ("or" =>
        array
        (
            "Post.title" => array("First post", "Second post", "Third post"),
            "Post.created" => "> " . date('Y-m-d', strtotime("-2 weeks"))
        )
    )

Cake accepts all valid SQL boolean operations, including AND, OR, NOT,
XOR, etc., and they can be upper or lower case, whichever you prefer.
These conditions are also infinitely nestable. Let's say you had a
hasMany/belongsTo relationship between Posts and Authors, which would
result in a LEFT JOIN on the find done on Post. Let's say you wanted to
find all the posts that contained a certain keyword **or** were created
in the past two weeks, but you want to restrict your search to posts
written by Bob::

    <?php
    array 
    ("Author.name" => "Bob", "or" => array
        (
            "Post.title" => "LIKE %magic%",
            "Post.created" => "> " . date('Y-m-d', strtotime("-2 weeks")
        )
    )

Saving Your Data
================

To save data to your model, you need to supply it with the data you wish
to save. The data handed to the save() method should be in the following
form::

    Array
    (
        [ModelName] => Array
            (
                [fieldname1] => 'value'
                [fieldname2] => 'value'
            )
    )

In order to get your data posted to the controller in this manner, it's
easiest just to use the HTML Helper to do this, because it creates form
elements that are named in the way Cake expects. You don't need to use
it however: just make sure your form elements have names that look like
**data[Modelname][fieldname]**. Using $html->input('Model/fieldname') is
the easiest, however.

Data posted from forms is automatically formatted like this and placed
in **$this->data** inside of your controller, so saving your data from
web forms is a snap. An edit function for a property controller might
look something like the following::

    <?php
    function edit($id)
    {

       //Note: The property model is automatically loaded for us at $this->Property.

       // Check to see if we have form data...
       if (empty($this->data))
       {
            $this->Property->id = $id;
            $this->data = $this->Property->read();//populate the form fields with the current row
       }
       else
       {
          // Here's where we try to save our data. Automagic validation checking
          if ($this->Property->save($this->data['Property']))
          {
             //Flash a message and redirect.
             $this->flash('Your information has been saved.',
                         '/properties/view/'.$this->data['Property']['id'], 2);
          }
          //if some fields are invalid or save fails the form will render
       }
    }

Notice how the save operation is placed inside a conditional: when you
try to save data to your model, Cake automatically attempts to validate
your data using the rules you've provided. To learn more about data
validation, see Chapter "Data Validation". If you do not want save() to
try to validate your data, use **save($data, false)**.

Other useful save functions:

-  **del**
-  string *$id*
-  boolean *$cascade*

Deletes the model specified by $id, or the current id of the model.

If this model is associated to other models, and the 'dependent' key has
been set in the association array, this method will also delete those
associated models if $cascade is set to true.

Returns true on success.

-  **saveField**
-  string *$name*
-  string *$value*

Used to save a single field value.

-  **getLastInsertId**

Returns the ID of the most recently created record.

Model Callbacks
===============

We've added some model callbacks that allow you to sneak in logic before
or after certain model operations. To gain this functionality in your
applications, use the parameters provided and override these functions
in your Cake models.

-  **beforeFind**
-  string *$conditions*

The beforeFind() callback is executed just before a find operation
begins. Place any pre-find logic in this method. When you override this
in your model, return **true** when you want the find to execute, and
**false** when you want it to abort.

-  **afterFind**
-  array *$results*

Use this callback to modify results that have been returned from a find
operation, or perform any other post-find logic. The parameter for this
function is the returned results from the model's find operation, and
the return value is the modified results.

-  **beforeValidate**

Use this callback to modify model data before it is validated. It can
also be used to add additional, more complex validation rules, using
**Model::invalidate()**. In this context, model data is accessible via
**$this->data**. This function must also return **true**, otherwise
save() execution will abort.

-  **beforeSave**

Place any pre-save logic in this function. This function executes
immediately after model data has been validated (assuming it validates,
otherwise the save() call aborts, and this callback will not execute),
but before the data is saved. This function should also return\ **true**
if you want the save operation to continue, and **false**\ if you want
to abort.

One usage of beforeSave might be to format time data for storage in a
specifc database engine::

    <?php
    // Date/time fields created by HTML Helper:
    // This code would be seen in a view

    $html->dayOptionTag('Event/start');
    $html->monthOptionTag('Event/start');
    $html->yearOptionTag('Event/start');
    $html->hourOptionTag('Event/start');
    $html->minuteOptionTag('Event/start');

    /*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/

    // Model callback functions used to stitch date
    // data together for storage
    // This code would be seen in the Event model:

    function beforeSave()
    {
        $this->data['Event']['start'] = $this->_getDate('Event', 'start');

        return true;
    }

    function _getDate($model, $field)
    {
        return date('Y-m-d H:i:s', mktime(
            intval($this->data[$model][$field . '_hour']),
            intval($this->data[$model][$field . '_min']),
            null,
            intval($this->data[$model][$field . '_month']),
            intval($this->data[$model][$field . '_day']),
            intval($this->data[$model][$field . '_year'])));
    }

-  **afterSave**

Place any logic that you want to be executed after every save in this
callback method.

-  **beforeDelete**

Place any pre-deletion logic in this function. This function should
return **true** if you want the deletion to continue, and **false** if
you want to abort.

-  **afterDelete**

Place any logic that you want to be executed after every deletion in
this callback method.

Model Variables
===============

When creating your models, there are a number of special variables you
can set in order to gain access to Cake functionality:

**$primaryKey**

If this model relates to a database table, and the table's primary key
is not named 'id', use this variable to tell Cake the name of the
primary key.

**$recursive**

This sets the number of levels you wish Cake to fetch associated model
data in find() and findAll() operations.

Imagine you have Groups which have many Users which in turn have many
Articles.

Model::recursive options
------------------------

+-------------------+----------------------------------------------------------------------------------+
| $recursive = -1   | No associated data is fetched.                                                   |
+-------------------+----------------------------------------------------------------------------------+
| $recursive = 0    | Cake fetches Group data                                                          |
+-------------------+----------------------------------------------------------------------------------+
| $recursive = 1    | Cake fetches a Group and its associated Users                                    |
+-------------------+----------------------------------------------------------------------------------+
| $recursive = 2    | Cake fetches a Group, its associated Users, and the Users' associated Articles   |
+-------------------+----------------------------------------------------------------------------------+

**$transactional**

Tells Cake whether or not to enable transactions for this model (i.e.
begin/commit/rollback). Set to a boolean value. Only available for
supporting databases.

**$useTable**

If the database table you wish to use isn't the plural form of the model
name (and you don't wish to change the table name), set this variable to
the name of the table you'd like this model to use.

**$validate**

An array used to validate the data passed to this model. See Chapter
"Data Validation".

**$useDbConfig**

Remember the database settings you can configure in
**/app/config/database.php**? Use this variable to switch between them -
just use the name of the database connection variable you've created in
your database configuration file. The default is, you guessed it,
'default'.

Associations
============

Introduction
------------

One of the most powerful features of CakePHP is the relational mapping
provided by the model. In CakePHP, the links between tables are handled
through associations. Associations are the glue between related logical
units.

There are four types of associations in CakePHP:

#. hasOne
#. hasMany
#. belongsTo
#. hasAndBelongsToMany

When associations between models have been defined, Cake will
automagically fetch models related to the model you are working with.
For example, if a Post model is related to an Author model using a
hasMany association, making a call to $this->Post->findAll() in a
controller will fetch Post records, as well as all the Author records
they are related to.

To use the association correctly it is best to follow the CakePHP naming
conventions (see Appendix "Cake Conventions"). If you use CakePHP's
naming conventions, you can use scaffolding to visualize your
application data, because scaffolding detects and uses the associations
between models. Of course you can always customize model associations to
work outside of Cake's naming conventions, but we'll save those tips for
later. For now, let's just stick to the conventions. The naming
conventions that concern us here are the foreign keys, model names, and
table names.

Here's a review of what Cake expects for the names of these different
elements: (see Appendix "Cake Conventions" for more information on
naming)

-  Foreign Keys: [singular model name]\_id. For example, a foreign key
   in the "authors" table pointing back to the Post a given Author
   belongs to would be named "post\_id".
-  Table Names: [plural object name]. Since we'd like to store
   information about blog posts and their authors, the table names are
   "posts" and "authors", respectively.
-  Model Names: [CamelCased, singular form of table name]. The model
   name for the "posts" table is "Post", and the model name for the
   "authors" table is "Author".

CakePHP's scaffolding expects your associations to be in the same order
as your columns. So if I have an Article that belongsTo three other
models (Author, Editor, and Publisher), I would need three keys:
author\_id, editor\_id, and publisher\_id. Scaffolding would expect your
associations in the same order as the keys in the table (e.g. first
Author, second Editor, lastly Publisher).

In order to illustrate how some of these associations work, let's
continue using the blog application as an example. Imagine that we're
going to create a simple user management system for the blog. I suppose
it goes without saying we'll want to keep track of Users, but we'd also
like each user to have an associated Profile (User hasOne Profile).
Users will also be able to create comments and remain associated to them
(User hasMany Comments). Once we have the user system working, we'll
move to allowing Posts to be related to Tag objects using the
hasAndBelongsToMany relationship (Post hasAndBelongsToMany Tags).

Defining and Querying with hasOne
---------------------------------

In order to set up this association, we'll assume that you've already
created the User and Profile models. To define the hasOne assocation
between them, we'll need to add an array to the models to tell Cake how
they relate:

/app/models/user.php hasOne
---------------------------

::

    <?php
    class User extends AppModel
    {
        var $name = 'User';
        var $hasOne = array('Profile' =>
                            array('className'    => 'Profile',
                                  'conditions'   => '',
                                  'order'        => '',
                                  'dependent'    =>  true,
                                  'foreignKey'   => 'user_id'
                            )
                      );
    }

The $hasOne array is what Cake uses to build the association between the
User and Profile models. Each key in the array allows you to further
configure the association:

#. className (required): the classname of the model you'd like to
   associate

   For our example, we want to specify the 'Profile' model class name.

#. conditions: SQL condition fragments that define the relationship

   We could use this to tell Cake to only associate a Profile that has a
   green header, if we wished. To define conditions like this, you'd
   specify a SQL conditions fragment as the value for this key:
   "Profile.header\_color = 'green'".

#. order: the ordering of the associated models

   If you'd like your associated models in a specific order, set the
   value for this key using an SQL order predicate: "Profile.name ASC",
   for example.

#. dependent: if set to true, the associated model is destroyed when
   this one is.

   For example, if the "Cool Blue" profile is associated to "Bob", and I
   delete the user "Bob", the profile "Cool Blue" will also be deleted.

#. foreignKey: the name of the foreign key that points to the associated
   model.

   This is here in case you're working with a database that doesn't
   follow Cake's naming conventions.

Now, when we execute find() or findAll() calls using the Profile model,
we should see our associated User model there as well::

    <?php
    $user = $this->User->read(null, '25');
    print_r($user);

    //output:

    Array
    (
        [User] => Array
            (
                [id] => 25
                [first_name] => John
                [last_name] => Anderson
                [username] => psychic
                [password] => c4k3roxx
            )

        [Profile] => Array
            (
                [id] => 4
                [name] => Cool Blue
                [header_color] => aquamarine
                [user_id] = 25
            )
    )

Defining and Querying with belongsTo
------------------------------------

Now that a User can see its Profile, we'll need to define an association
so Profile can see its User. This is done in Cake using the belongsTo
assocation. In the Profile model, we'd do the following:

/app/models/profile.php belongsTo
---------------------------------

::

    <?php
    class Profile extends AppModel
    {
        var $name = 'Profile';
        var $belongsTo = array('User' =>
                               array('className'  => 'User',
                                     'conditions' => '',
                                     'order'      => '',
                                     'foreignKey' => 'user_id'
                               )
                         );
    }

The $belongsTo array is what Cake uses to build the association between
the User and Profile models. Each key in the array allows you to further
configure the association:

#. className (required): the classname of the model you'd like to
   associate

   For our example, we want to specify the 'User' model class name.

#. conditions: SQL condition fragments that define the relationship

   We could use this to tell Cake to only associate a User that is
   active. You would do this by setting the value of the key to be
   "User.active = '1'", or something similar.

#. order: the ordering of the associated models

   If you'd like your associated models in a specific order, set the
   value for this key using an SQL order predicate: "User.last\_name
   ASC", for example.

#. foreignKey: the name of the foreign key that points to the associated
   model.

   This is here in case you're working with a database that doesn't
   follow Cake's naming conventions.

Now, when we execute find() or findAll() calls using the Profile model,
we should see our associated User model there as well::

    <?php
    $profile = $this->Profile->read(null, '4');
    print_r($profile);

    //output:

    Array
    (

        [Profile] => Array
            (
                [id] => 4
                [name] => Cool Blue
                [header_color] => aquamarine
                [user_id] = 25
            )

        [User] => Array
            (
                [id] => 25
                [first_name] => John
                [last_name] => Anderson
                [username] => psychic
                [password] => c4k3roxx
            )
    )

Defining and Querying with hasMany
==================================

Now that User and Profile models are associated and working properly,
let's build our system so that User records are associated to Comment
records. This is done in the User model like so:

/app/models/user.php hasMany
----------------------------

::

    <?php
    class User extends AppModel
    {
        var $name = 'User';
        var $hasMany = array('Comment' =>
                             array('className'     => 'Comment',
                                   'conditions'    => 'Comment.moderated = 1',
                                   'order'         => 'Comment.created DESC',
                                   'limit'         => '5',
                                   'foreignKey'    => 'user_id',
                                   'dependent'     => true,
                                   'exclusive'     => false,
                                   'finderQuery'   => '',
                                   'fields'        => '',
                                   'offset'        => '',
                                   'counterQuery'  => ''
                             )
                      );

        // Here's the hasOne relationship we defined earlier...
        var $hasOne = array('Profile' =>
                            array('className'    => 'Profile',
                                  'conditions'   => '',
                                  'order'        => '',
                                  'dependent'    =>  true,
                                  'foreignKey'   => 'user_id'
                            )
                      );
    }

The $hasMany array is what Cake uses to build the association between
the User and Comment models. Each key in the array allows you to further
configure the association:

#. className (required): the classname of the model you'd like to
   associate

   For our example, we want to specify the 'Comment' model class name.

#. conditions: SQL condition fragments that define the relationship

   We could use this to tell Cake to only associate a Comment that has
   been moderated. You would do this by setting the value of the key to
   be "Comment.moderated = 1", or something similar.

#. order: the ordering of the associated models

   If you'd like your associated models in a specific order, set the
   value for this key using an SQL order predicate: "Comment.created
   DESC", for example.

#. limit: the maximum number of associated models you'd like Cake to
   fetch.

   For this example, we didn't want to fetch \*all\* of the user's
   comments, just five.

#. foreignKey: the name of the foreign key that points to the associated
   model.

   This is here in case you're working with a database that doesn't
   follow Cake's naming conventions.

#. dependent: if set to true, the associated models are destroyed when
   this one is.

   For example, if the "Cool Blue" and "Hot Red" profiles are associated
   to "Bob", and I delete the user "Bob", the profiles "Cool Blue" and
   "Hot Red" will also be deleted.

#. exclusive: If set to true, all the associated objects are deleted in
   one SQL statement without having their beforeDelete callback run.

   Good for use for simpler associations, because it can be much faster.

#. finderQuery: Specify a complete SQL statement to fetch the
   association.

   This is a good way to go for complex associations that depends on
   multiple tables. If Cake's automatic assocations aren't working for
   you, here's where you customize it.

#. fields: Specify the fields from the associated model you wish to
   fetch.

   This is useful for associations where not all the fields are needed
   with every find() call. Limiting the amount of fields you request can
   increase database performance.

#. offset: The number of records to skip before associating to the
   current model.

#. counterQuery: Specify a complete SQL statement used to count the
   number of records that should be associated.

Now, when we execute find() or findAll() calls using the User model, we
should see our associated Comment models there as well::

    <?php
    $user = $this->User->read(null, '25');
    print_r($user);

    //output:

    Array
    (
        [User] => Array
            (
                [id] => 25
                [first_name] => John
                [last_name] => Anderson
                [username] => psychic
                [password] => c4k3roxx
            )

        [Profile] => Array
            (
                [id] => 4
                [name] => Cool Blue
                [header_color] => aquamarine
                [user_id] = 25
            )

        [Comment] => Array
            (
                [0] => Array
                    (
                        [id] => 247
                        [user_id] => 25
                        [body] => The hasMany assocation is nice to have.
                    )

                [1] => Array
                    (
                        [id] => 256
                        [user_id] => 25
                        [body] => The hasMany assocation is really nice to have.
                    )

                [2] => Array
                    (
                        [id] => 269
                        [user_id] => 25
                        [body] => The hasMany assocation is really, really nice to have.
                    )

                [3] => Array
                    (
                        [id] => 285
                        [user_id] => 25
                        [body] => The hasMany assocation is extremely nice to have.
                    )

                [4] => Array
                    (
                        [id] => 286
                        [user_id] => 25
                        [body] => The hasMany assocation is super nice to have.
                    )

            )
    )

While we won't document the process here, it would be a great idea to
define the "Comment belongsTo User" association as well, so that both
models can see each other. Not defining assocations from both models is
often a common gotcha when trying to use scaffolding.

Defining and Querying with hasAndBelongsToMany
==============================================

Now that you've mastered the simpler associations, let's move to the
last assocation: hasAndBelongsToMany (or HABTM). This last one is the
hardest to wrap your head around, but it is also one of the most useful.
The HABTM association is useful when you have two Models that are linked
together with a join table. The join table holds the individual rows
that are related to each other.

The difference between hasMany and hasAndBelongsToMany is that with
hasMany, the associated model is not shared. If a User hasMany Comments,
it is the \*only\* user associated to those comments. With HABTM, the
associated models are shared. This is great for what we're about to do
next: associate Post models to Tag models. When a Tag belongs to a Post,
we don't want it to be 'used up', we want to continue to associate it to
other Posts as well.

In order to do this, we'll need to set up the correct tables for this
association. Of course you'll need a "tags" table for you Tag model, and
a "posts" table for your posts, but you'll also need to create a join
table for this association. The naming convention for HABTM join tables
is [plural model name1]\_[plural model name2], where the model names are
in alphabetical order:

HABTM Join Tables: Sample models and their join table names
-----------------------------------------------------------

#. Posts and Tags: posts\_tags

#. Monkeys and IceCubes: ice\_cubes\_monkeys

#. Categories and Articles: articles\_categories

HABTM join tables need to at least consist of the two foreign keys of
the models they link. For our example, "post\_id" and "tag\_id" is all
we'll need.

Here's what the SQL dumps will look like for our Posts HABTM Tags
example::

    --
    -- Table structure for table `posts`
    --

    CREATE TABLE `posts` (
      `id` int(10) unsigned NOT NULL auto_increment,
      `user_id` int(10) default NULL,
      `title` varchar(50) default NULL,
      `body` text,
      `created` datetime default NULL,
      `modified` datetime default NULL,
      `status` tinyint(1) NOT NULL default '0',
      PRIMARY KEY  (`id`)
    ) TYPE=MyISAM;

    -- --------------------------------------------------------

    --
    -- Table structure for table `posts_tags`
    --

    CREATE TABLE `posts_tags` (
      `post_id` int(10) unsigned NOT NULL default '0',
      `tag_id` int(10) unsigned NOT NULL default '0',
      PRIMARY KEY  (`post_id`,`tag_id`)
    ) TYPE=MyISAM;

    -- --------------------------------------------------------

    --
    -- Table structure for table `tags`
    --

    CREATE TABLE `tags` (
      `id` int(10) unsigned NOT NULL auto_increment,
      `tag` varchar(100) default NULL,
      PRIMARY KEY  (`id`)
    ) TYPE=MyISAM;

With our tables set up, let's define the association in the Post model:

/app/models/post.php hasAndBelongsToMany
----------------------------------------

::

    <?php
    class Post extends AppModel
    {
        var $name = 'Post';
        var $hasAndBelongsToMany = array('Tag' =>
                                   array('className'    => 'Tag',
                                         'joinTable'    => 'posts_tags',
                                         'foreignKey'   => 'post_id',
                                         'associationForeignKey'=> 'tag_id',
                                         'conditions'   => '',
                                         'order'        => '',
                                         'limit'        => '',
                                         'unique'       => true,
                                         'finderQuery'  => '',
                                         'deleteQuery'  => '',
                                   )
                                   );
    }
    ?>

The $hasAndBelongsToMany array is what Cake uses to build the
association between the Post and Tag models. Each key in the array
allows you to further configure the association:

#. className (required): the classname of the model you'd like to
   associate

   For our example, we want to specify the 'Tag' model class name.

#. joinTable: this is here for a database that doesn't adhere to Cake's
   naming conventions. If your table doesn't look like [plural
   model1]\_[plural model2] in lexical order, you can specify the name
   of your table here.

#. foreignKey: the name of the foreign key in the join table that points
   to the current model.

   This is here in case you're working with a database that doesn't
   follow Cake's naming conventions.

#. associationForeignKey: the name of the foreign key that points to the
   associated model.

#. conditions: SQL condition fragments that define the relationship

   We could use this to tell Cake to only associate a Tag that has been
   approved. You would do this by setting the value of the key to be
   "Tag.approved = 1", or something similar.

#. order: the ordering of the associated models

   If you'd like your associated models in a specific order, set the
   value for this key using an SQL order predicate: "Tag.tag DESC", for
   example.

#. limit: the maximum number of associated models you'd like Cake to
   fetch.

   Used to limit the number of associated Tags to be fetched.

#. unique: If set to true, duplicate associated objects will be ignored
   by accessors and query methods.

   Basically, if the associations are distinct, set this to true. That
   way the Tag "Awesomeness" can only be assigned to the Post "Cake
   Model Associations" once, and will only show up once in result
   arrays.

#. finderQuery: Specify a complete SQL statement to fetch the
   association.

   This is a good way to go for complex associations that depends on
   multiple tables. If Cake's automatic assocations aren't working for
   you, here's where you customize it.

#. deleteQuery: A complete SQL statement to be used to remove
   assocations between HABTM models.

   If you don't like the way Cake is performing deletes, or your setup
   is customized in some way, you can change the way deletion works by
   supplying your own query here.

Now, when we execute find() or findAll() calls using the Post model, we
should see our associated Tag models there as well::

    <?php
    $post = $this->Post->read(null, '2');
    print_r($post);

    //output:

    Array
    (
        [Post] => Array
            (
                [id] => 2
                [user_id] => 25
                [title] => Cake Model Associations
                [body] => Time saving, easy, and powerful.
                [created] => 2006-04-15 09:33:24
                [modified] => 2006-04-15 09:33:24
                [status] => 1
            )

        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 247
                        [tag] => CakePHP
                    )

                [1] => Array
                    (
                        [id] => 256
                        [tag] => Powerful Software
                    )
            )
    )

Saving Related Model Data
=========================

One important thing to remember when working with associated models is
that saving model data should always be done by the corresponding Cake
model. If you are saving a new Post and its associated Comments, then
you would use both Post and Comment models during the save operation.

If neither of the associated models exists in the system yet (for
example, you want to save a new Post and a related Comment at the same
time), you'll need to first save the primary, or parent model. To get an
idea of how this works, let's imagine that we have an action in our
PostsController that handles the saving of a new Post and a related
Comment. The example action shown below will assume that you've posted a
single Post and a single Comment.

/app/controllers/posts\_controller.php (partial)
------------------------------------------------

::

    <?php
    function add()
    {
        if (!empty($this->data))
        {
            //We can save the Post data:
            //it should be in $this->data['Post']
           
            $this->Post->save($this->data);

            //Now, we'll need to save the Comment data
            //But first, we need to know the ID for the
            //Post we just saved...

            $post_id = $this->Post->getLastInsertId();

            //Now we add this information to the save data
            //and save the comment.

            $this->data['Comment']['post_id'] = $post_id;

            //Because our Post hasMany Comments, we can access
            //the Comment model through the Post model:

            $this->Post->Comment->save($this->data);

        }
    }

If, however, the parent model already exists in the system (for example,
adding a Comment to an existing Post), you need to know the ID of the
parent model before saving. You could pass this ID as a URL parameter,
or as a hidden element in a form...

/app/controllers/posts\_controller.php (partial)
------------------------------------------------

::

    <?php
    //Here's how it would look if the URL param is used...
    function addComment($post_id)
    {
        if (!empty($this->data))
        {
            //You might want to make the $post_id data more safe,
            //but this will suffice for a working example..

            $this->data['Comment']['post_id'] = $post_id;

            //Because our Post hasMany Comments, we can access
            //the Comment model through the Post model:

            $this->Post->Comment->save($this->data);
        }
    }

If the ID was passed as a hidden element in the form, you might want to
name the field (if you're using the HtmlHelper) so it ends up in the
posted data where it needs to be:

If the ID for the post is at $post['Post']['id']::

    <?php echo $html->hidden('Comment/post_id', array('value' => $post['Post']['id'])); ?>

Done this way, the ID for the parent Post model can be accessed at
$this->data['Comment']['post\_id'], and is all ready for a simple
$this->Post->Comment->save($this->data) call.

These same basic techniques will work if you're saving multiple child
models, just place those save() calls in a loop (and remember to clear
the model information using Model::create()).

In summary, if you're saving associated data (for belongsTo, hasOne, and
hasMany relations), the main point is getting the ID of the parent model
and saving it to the child model.

Saving hasAndBelongsToMany Relations
------------------------------------

Saving models that are associated by hasOne, belongsTo, and hasMany is
pretty simple: you just populate the foreign key field with the ID of
the associated model. Once that's done, you just call the save() method
on the model, and everything gets linked up correctly.

With hasAndBelongsToMany, its a bit trickier, but we've gone out of our
way to make it as simple as possible. In keeping along with our example,
we'll need to make some sort of form that relates Tags to Posts. Let's
now create a form that creates posts, and associates them to an existing
list of Tags.

You might actually like to create a form that creates new tags and
associates them on the fly - but for simplicity's sake, we'll just show
you how to associate them and let you take it from there.

When you're saving a model on its own in Cake, the tag name (if you're
using the Html Helper) looks like 'Model/field\_name'. Let's just start
out with the part of the form that creates our post:

/app/views/posts/add.thtml Form for creating posts
--------------------------------------------------

::

    <h1>Write a new post</h1>
    <form method="post" action="<?php echo $html->url('/posts/add'); ?>">
    <table>   
        <tr>   
            <td>Title:</td> 
            <td><?php echo $html->input('Post/title')?></td>
        </tr>
        <tr>       
            <td>Body:<td>
            <td><?php echo $html->textarea('Post/body')?></td>
        </tr>
        <tr>
            <td colspan="2">
                <?php echo $html->hidden('Post/user_id', array('value' => $session->read('User.id')))?>
                <?php echo $html->hidden('Post/status' , array('value' => '0'))?>
                <?php echo $html->submit('Save Post')?>
            </td>
        </tr>
    </table>
    </form>

The form as it stands now will just create Post records. Let's add some
code to allow us to bind a given Post to one or many Tags:

/app/views/posts/add.thtml (Tag association code added)
-------------------------------------------------------

::

    <h1>Write a new post</h1>
    <form method="post" action="<?php echo $html->url('/posts/add'); ?>">
    <table>
        <tr>
            <td>Title:</td>
            <td><?php echo $html->input('Post/title')?></td>
        </tr>
        <tr>
            <td>Body:</td>
            <td><?php echo $html->textarea('Post/body')?></td>
        </tr>
        <tr>
            <td>Related Tags:</td>
            <td><?php echo $html->selectTag('Tag/Tag', $tags, null, array('multiple' => 'multiple')) ?>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <?php echo $html->hidden('Post/user_id', array('value' => $session->read('User.id')))?>
                <?php echo $html->hidden('Post/status' , array('value' => '0'))?>
                <?php echo $html->submit('Save Post')?>
            </td>
        </tr>
    </table>
    </form>

In order for a call to $this->Post->save() in the controller to save the
links between this new Post and its associated Tags, the name of the
field must be in the form "Tag/Tag" (the rendered name attribute would
look something like 'data[ModelName][ModelName][]'). The submitted data
must be a single ID, or an array of IDs of linked records. Because we're
using a multiple select here, the submitted data for Tag/Tag will be an
array of IDs.

The $tags variable here is just an array where the keys are the IDs of
the possible Tags, and the values are the displayed names of the Tags in
the multi-select element.

Changing Associations on the Fly using bindModel() and unbindModel()
====================================================================

You might occasionally wish to change model association information for
exceptional situations when building your application. If your
association settings in the model file are giving you too much (or not
enough) information, you can use two model functions to bind and unbind
model associations for your next find.

Let's set up a few models so we can see how bindModel() and
unbindModel() work. We'll start with two models:

leader.php and follower.php
---------------------------

::

    <?php

    class Leader extends AppModel
    {
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

    class Follower extends AppModel
    {
        var $name = 'Follower';
    }

    ?>

Now, in a LeadersController, we can use the find() method in the Leader
Model to come up with a Leader and its associated followers. As you can
see above, the association array in the Leader model defines a "Leader
hasMany Followers" relationship. For demonstration purposes, let's use
unbindModel() to remove that association mid-controller.

leaders\_controller.php (partial)
---------------------------------

::

    <?php
    function someAction()
    {
        //This fetches Leaders, and their associated Followers
        $this->Leader->findAll();

        //Let's remove the hasMany...
        $this->Leader->unbindModel(array('hasMany' => array('Follower')));
       
        //Now a using a find function will return Leaders, with no Followers
        $this->Leader->findAll();

        //NOTE: unbindModel only affects the very next find function.
        //An additional find call will use the configured association information.

        //We've already used findAll() after unbindModel(), so this will fetch
        //Leaders with associated Followers once again...
        $this->Leader->findAll();
    }

The unbindModel() function works similarly with other associations: just
change the name of the association type and model classname. The basic
usage for unbindModel() is:

Generic unbindModel() example
-----------------------------

::

    <?php
    $this->Model->unbindModel(array('associationType' => array('associatedModelClassName')));

Now that we've successfully removed an association on the fly, let's add
one. Our as-of-yet unprincipled Leader needs some associated Principles.
The model file for our Principle model is bare, except for the var $name
statement. Let's associate some Principles to our Leader on the fly (but
only for just the following find function call):

leaders\_controller.php (partial)
---------------------------------

::

    <?php
    function anotherAction()
    {
        //There is no Leader hasMany Principles in the leader.php model file, so
        //a find here, only fetches Leaders.
        $this->Leader->findAll();

        //Let's use bindModel() to add a new association to the Principle model:
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );

        //Now that we're associated correctly, we can use a single find function
        //to fetch Leaders with their associated principles:
        $this->Leader->findAll();
    }

The bindModel() function can be handy for creating new assocations, but
it can also be useful if you want to change the sorting or other
parameters in a given association on the fly.

There you have it. The basic usage for bindModel is to encapsulate a
normal association array inside an array who's key is named after the
type of assocation you are trying to create:

Generic bindModel() example
---------------------------

::

    <?php
    $this->Model->bindModel(
            array('associationName' => array(
                    'associatedModelClassName' => array(
                        // normal association keys go here...
                    )
                )
            )
        );

Please note that your tables will need to be keyed correctly (or
association array properly configured) to bind models on the fly.
