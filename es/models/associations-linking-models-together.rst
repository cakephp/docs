Associations: Linking Models Together
#####################################

One of the most powerful features of CakePHP is the ability to link
relational mapping provided by the model. In CakePHP, the links
between models are handled through associations.

Defining relations between different objects in your application
should be a natural process. For example: in a recipe database, a
recipe may have many reviews, reviews have a single author, and
authors may have many recipes. Defining the way these relations
work allows you to access your data in an intuitive and powerful
way.

The purpose of this section is to show you how to plan for, define,
and utilize associations between models in CakePHP.

While data can come from a variety of sources, the most common form
of storage in web applications is a relational database. Most of
what this section covers will be in that context.

For information on associations with Plugin models, see
:ref:`plugin-models`.

Relationship Types
------------------

The four association types in CakePHP are: hasOne, hasMany,
belongsTo, and hasAndBelongsToMany (HABTM).

============= ===================== =======================================
Relationship  Association Type      Example
============= ===================== =======================================
one to one    hasOne                A user has one profile.
------------- --------------------- ---------------------------------------
one to many   hasMany               A user can have multiple recipes.
------------- --------------------- ---------------------------------------
many to one   belongsTo             Many recipes belong to a user.
------------- --------------------- ---------------------------------------
many to many  hasAndBelongsToMany   Recipes have, and belong to many tags.
============= ===================== =======================================

Associations are defined by creating a class variable named after
the association you are defining. The class variable can sometimes
be as simple as a string, but can be as complete as a
multidimensional array used to define association specifics.

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

In the above example, the first instance of the word 'Recipe' is
what is termed an 'Alias'. This is an identifier for the
relationship and can be anything you choose. Usually, you will
choose the same name as the class that it references. However,
**aliases for each model must be unique app wide**. E.g. it is
appropriate to have
::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $hasMany = array(
            'MyRecipe' => 'Recipe',
        );
        var $hasAndBelongsToMany => array('Member' => 'User');
    }
    
    class Group extends AppModel {
        var $name = 'Group';
        var $hasMany = array(
            'MyRecipe' => array(
                'className'  => 'Recipe',
            )
        );
        var $hasAndBelongsToMany => array('MemberOf' => 'Group');
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
        var $hasAndBelongsToMany => array('Member' => 'User');
    }
    
    class Group extends AppModel {
        var $name = 'Group';
        var $hasMany = array(
            'MyRecipe' => array(
                'className'  => 'Recipe',
            )
        );
        var $hasAndBelongsToMany => array('Member' => 'Group');
    }
    ?>

because here we have the alias 'Member' referring to both the User
(in Group) and the Group (in User) model in the HABTM associations.
Choosing non-unique names for model aliases across models can cause
unexpected behavior.
Cake will automatically create links between associated model
objects. So for example in your ``User`` model you can access the
``Recipe`` model as
::

    $this->Recipe->someFunction();

Similarly in your controller you can access an associated model
simply by following your model associations and without adding it
to the ``$uses`` array:

::

    $this->User->Recipe->someFunction();

.. note::

    Remember that associations are defined 'one way'. If you define
    User hasMany Recipe that has no effect on the Recipe Model. You
    need to define Recipe belongsTo User to be able to access the User
    model from your Recipe model

hasOne
------

Let’s set up a User model with a hasOne relationship to a Profile
model.

First, your database tables need to be keyed correctly. For a
hasOne relationship to work, one table has to contain a foreign key
that points to a record in the other. In this case the profiles
table will contain a field called user\_id. The basic pattern is:

**hasOne:** the *other* model contains the foreign key.

==================== ==================
Relation             Schema            
==================== ==================
Apple hasOne Banana  bananas.apple\_id 
-------------------- ------------------
User hasOne Profile  profiles.user\_id 
-------------------- ------------------
Doctor hasOne Mentor mentors.doctor\_id
==================== ==================

The User model file will be saved in /app/models/user.php. To
define the ‘User hasOne Profile’ association, add the $hasOne
property to the model class. Remember to have a Profile model in
/app/models/profile.php, or the association won’t work::

    <?php
    
    class User extends AppModel {
        var $name = 'User';                
        var $hasOne = 'Profile';   
    }
    ?>

There are two ways to describe this relationship in your model
files. The simplest method is to set the $hasOne attribute to a
string containing the classname of the associated model, as we’ve
done above.

If you need more control, you can define your associations using
array syntax. For example, you might want to limit the association
to include only certain records.

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


-  **className**: the classname of the model being associated to
   the current model. If you’re defining a ‘User hasOne Profile’
   relationship, the className key should equal ‘Profile.’
-  **foreignKey**: the name of the foreign key found in the other
   model. This is especially handy if you need to define multiple
   hasOne relationships. The default value for this key is the
   underscored, singular name of the current model, suffixed with
   ‘\_id’. In the example above it would default to 'user\_id'.
-  **conditions**: An SQL fragment used to filter related model
   records. It’s good practice to use model names in SQL fragments:
   “Profile.approved = 1” is always better than just “approved = 1.”
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for
   the returned associated rows.
-  **dependent**: When the dependent key is set to true, and the
   model’s delete() method is called with the cascade parameter set to
   true, associated model records are also deleted. In this case we
   set it true so that deleting a User will also delete her associated
   Profile.

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

Now that we have Profile data access from the User model, let’s
define a belongsTo association in the Profile model in order to get
access to related User data. The belongsTo association is a natural
complement to the hasOne and hasMany associations: it allows us to
see the data from the other direction.

When keying your database tables for a belongsTo relationship,
follow this convention:

**belongsTo:** the *current* model contains the foreign key.

======================= ==================
Relation                Schema
======================= ==================
Banana belongsTo Apple  bananas.apple\_id
----------------------- ------------------
Profile belongsTo User  profiles.user\_id
----------------------- ------------------
Mentor belongsTo Doctor mentors.doctor\_id
======================= ==================

.. tip::

    If a model(table) contains a foreign key, it belongsTo the other
    model(table).

We can define the belongsTo association in our Profile model at
/app/models/profile.php using the string syntax as follows::

    <?php
    
    class Profile extends AppModel {
        var $name = 'Profile';                
        var $belongsTo = 'User';   
    }
    ?>

We can also define a more specific relationship using array
syntax::

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


-  **className**: the classname of the model being associated to
   the current model. If you’re defining a ‘Profile belongsTo User’
   relationship, the className key should equal ‘User.’
-  **foreignKey**: the name of the foreign key found in the current
   model. This is especially handy if you need to define multiple
   belongsTo relationships. The default value for this key is the
   underscored, singular name of the other model, suffixed with
   ‘\_id’.
-  **conditions**: An SQL fragment used to filter related model
   records. It’s good practice to use model names in SQL fragments:
   “User.active = 1” is always better than just “active = 1.”
-  **type**: the type of the join to use in the SQL query, default
   is LEFT which may not fit your needs in all situations, INNER may
   be helpful when you want everything from your main and associated
   models or nothing at all!(effective when used with some conditions
   of course).
   **(NB: type value is in lower case - i.e. left, inner)**
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for
   the returned associated rows.
-  **counterCache**: If set to true the associated Model will
   automatically increase or decrease the
   “[singular\_model\_name]\_count” field in the foreign table
   whenever you do a save() or delete(). If its a string then its the
   field name to use. The value in the counter field represents the
   number of related rows.
-  **counterScope**: Optional conditions array to use for updating
   counter cache field.

Once this association has been defined, find operations on the
Profile model will also fetch a related User record if it exists::

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
association will allow us to fetch a user’s comments when we fetch
a User record.

When keying your database tables for a hasMany relationship, follow
this convention:

**hasMany:** the *other* model contains the foreign key.

======================= ==================
Relation                Schema
======================= ==================
User hasMany Comment    Comment.user\_id
----------------------- ------------------
Cake hasMany Virtue     Virtue.cake\_id
----------------------- ------------------
Product hasMany Option  Option.product\_id
======================= ==================

We can define the hasMany association in our User model at
/app/models/user.php using the string syntax as follows::

    <?php
    
    class User extends AppModel {
        var $name = 'User';                
        var $hasMany = 'Comment';   
    }
    ?>

We can also define a more specific relationship using array
syntax::

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


-  **className**: the classname of the model being associated to
   the current model. If you’re defining a ‘User hasMany Comment’
   relationship, the className key should equal ‘Comment.’
-  **foreignKey**: the name of the foreign key found in the other
   model. This is especially handy if you need to define multiple
   hasMany relationships. The default value for this key is the
   underscored, singular name of the actual model, suffixed with
   ‘\_id’.
-  **conditions**: An SQL fragment used to filter related model
   records. It’s good practice to use model names in SQL fragments:
   “Comment.status = 1” is always better than just “status = 1.”
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for
   the returned associated rows.
-  **limit**: The maximum number of associated rows you want
   returned.
-  **offset**: The number of associated rows to skip over (given
   the current conditions and order) before fetching and associating.
-  **dependent**: When dependent is set to true, recursive model
   deletion is possible. In this example, Comment records will be
   deleted when their associated User record has been deleted.
-  **exclusive**: When exclusive is set to true, recursive model
   deletion does the delete with a deleteAll() call, instead of
   deleting each entity separately. This greatly improves performance,
   but may not be ideal for all circumstances.
-  **finderQuery**: A complete SQL query CakePHP can use to fetch
   associated model records. This should be used in situations that
   require very custom results.
   If a query you're building requires a reference to the associated
   model ID, use the special ``{$__cakeID__$}`` marker in the query.
   For example, if your Apple model hasMany Orange, the query should
   look something like this:
   ``SELECT Orange.* from oranges as Orange WHERE Orange.apple_id = {$__cakeID__$};``


Once this association has been defined, find operations on the User
model will also fetch related Comment records if they exist::

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
association in the Comment model empowers you to get User data from
the Comment model - completing the connection and allowing the flow
of information from either model’s perspective.

hasAndBelongsToMany (HABTM)
---------------------------

Alright. At this point, you can already call yourself a CakePHP
model associations professional. You're already well versed in the
three associations that take up the bulk of object relations.

Let's tackle the final relationship type: hasAndBelongsToMany, or
HABTM. This association is used when you have two models that need
to be joined up, repeatedly, many times, in many different ways.

The main difference between hasMany and HABTM is that a link
between models in HABTM is not exclusive. For example, we're about
to join up our Recipe model with a Tag model using HABTM. Attaching
the "Italian" tag to my grandma's Gnocci recipe doesn't "use up"
the tag. I can also tag my Honey Glazed BBQ Spaghettio's with
"Italian" if I want to.

Links between hasMany associated objects are exclusive. If my User
hasMany Comments, a comment is only linked to a specific user. It's
no longer up for grabs.

Moving on. We'll need to set up an extra table in the database to
handle HABTM associations. This new join table's name needs to
include the names of both models involved, in alphabetical order,
and separated with an underscore ( \_ ). The contents of the table
should be two fields, each foreign keys (which should be integers)
pointing to both of the primary keys of the involved models. To
avoid any issues - don't define a combined primary key for these
two fields, if your application requires it you can define a unique
index. If you plan to add any extra information to this table, it's
a good idea to add an additional primary key field (by convention
'id') to make acting on the table as easy as any other model.

**HABTM** requires a separate join table that includes both *model*
names.

Relation
    Schema (HABTM table in bold)

Recipe HABTM Tag
    ``recipes_tags.id``, ``recipes_tags.recipe_id``,
    ``recipes_tags.tag_id``

Cake HABTM Fan
    ``cakes_fans.id``, ``cakes_fans.cake_id``,
    ``cakes_fans.fan_id``

Foo HABTM Bar
    ``bars_foos.id``, ``bars_foos.foo_id``, ``bars_foos.bar_id``

.. note::

    Table names are by convention in alphabetical order.

Make sure primary keys in tables **cakes** and **recipes** have
"id" fields as assumed by convention. If they're different than
assumed, it has to be changed in model's :ref:`model-primaryKey`

Once this new table has been created, we can define the HABTM
association in the model files. We're gonna skip straight to the
array syntax this time::

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


-  **className**: the classname of the model being associated to
   the current model. If you're defining a ‘Recipe HABTM Tag'
   relationship, the className key should equal ‘Tag.'
-  **joinTable**: The name of the join table used in this
   association (if the current table doesn't adhere to the naming
   convention for HABTM join tables).
-  **with**: Defines the name of the model for the join table. By
   default CakePHP will auto-create a model for you. Using the example
   above it would be called RecipesTag. By using this key you can
   override this default name. The join table model can be used just
   like any "regular" model to access the join table directly.
-  **foreignKey**: the name of the foreign key found in the current
   model. This is especially handy if you need to define multiple
   HABTM relationships. The default value for this key is the
   underscored, singular name of the current model, suffixed with
   ‘\_id'.
-  **associationForeignKey**: the name of the foreign key found in
   the other model. This is especially handy if you need to define
   multiple HABTM relationships. The default value for this key is the
   underscored, singular name of the other model, suffixed with
   ‘\_id'.
-  **unique**: If true (default value) cake will first delete
   existing relationship records in the foreign keys table before
   inserting new ones, when updating a record. So existing
   associations need to be passed again when updating.
-  **conditions**: An SQL fragment used to filter related model
   records. It's good practice to use model names in SQL fragments:
   "Comment.status = 1" is always better than just "status = 1."
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: An SQL fragment that defines the sorting order for
   the returned associated rows.
-  **limit**: The maximum number of associated rows you want
   returned.
-  **offset**: The number of associated rows to skip over (given
   the current conditions and order) before fetching and associating.
-  **finderQuery, deleteQuery, insertQuery**: A complete SQL query
   CakePHP can use to fetch, delete, or create new associated model
   records. This should be used in situations that require very custom
   results.

Once this association has been defined, find operations on the
Recipe model will also fetch related Tag records if they exist::

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

Remember to define a HABTM association in the Tag model if you'd
like to fetch Recipe data when using the Tag model.

It is also possible to execute custom find queries based on HABTM
relationships. Consider the following examples:



Assuming the same structure in the above example (Recipe HABTM
Tag), let's say we want to fetch all Recipes with the tag
'Dessert', one potential (wrong) way to achieve this would be to
apply a condition to the association itself:

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
tags. To properly achieve our goal, there are a number of ways to
do it. One option is to search the Tag model (instead of Recipe),
which will also give us all of the associated Recipes::

    $this->Recipe->Tag->find('all', array('conditions'=>array('Tag.name'=>'Dessert')));

We could also use the join table model (which CakePHP provides for
us), to search for a given ID::

    $this->Recipe->bindModel(array('hasOne' => array('RecipesTag')));
    $this->Recipe->find('all', array(
            'fields' => array('Recipe.*'),
            'conditions'=>array('RecipesTag.tag_id'=>124) // id of Dessert
    ));

It's also possible to create an exotic association for the purpose
of creating as many joins as necessary to allow filtering, for
example::

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

Both of which will return the following data::

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

The same binding trick can be used to easily paginate your HABTM
models. Just one word of caution: since paginate requires two
queries (one to count the records and one to get the actual data),
be sure to supply the ``false`` parameter to your ``bindModel();``
which essentially tells CakePHP to keep the binding persistent over
multiple queries, rather than just one as in the default behavior.
Please refer to the API for more details.

.. tip::

    For more information on saving HABTM objects see :ref:`saving-habtm`

.. tip::

    For more information on binding model associations on the fly see
    :ref:`dynamic-associations`

Mix and match techniques to achieve your specific objective.

hasMany through (The Join Model)
--------------------------------

It is sometimes desirable to store additional data with a many to
many association. Consider the following

Student hasAndBelongsToMany Course Course hasAndBelongsToMany
Student

In other words, a Student can take many Courses and a Course can be
taken my many Students. This is a simple many to many association
demanding a table such as this::

    id | student_id | course_id

Now what if we want to store the number of days that were attended
by the student on the course and their final grade? The table we'd
want would be::

    id | student_id | course_id | days_attended | grade

The trouble is, hasAndBelongsToMany will not support this type of
scenario because when hasAndBelongsToMany associations are saved,
the association is deleted first. You would lose the extra data in
the columns as it is not replaced in the new insert.

The way to implement our requirement is to use a **join model**,
otherwise known (in Rails) as a **hasMany through** association.
That is, the association is a model itself. So, we can create a new
model CourseMembership. Take a look at the following models.::

            <?php
            //student.php
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
            
            //course.php
            
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
            
            //course_membership.php
    
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

The CourseMembership join model uniquely identifies a given
Student's participation on a Course in addition to extra
meta-information.

Working with join model data
----------------------------

Now that the models have been defined, let's see how we can save
all of this. Let's say the Head of Cake School has asked us the
developer to write an application that allows him to log a
student's attendance on a course with days attended and grade. Take
a look at the following code.::

   <?php
    //controllers/course_membership_controller.php
    
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
    
    //views/course_memberships/add.ctp

    <?php echo $form->create('CourseMembership'); ?>
        <?php echo $form->input('Student.first_name'); ?>
        <?php echo $form->input('Student.last_name'); ?>
        <?php echo $form->input('Course.name'); ?>
        <?php echo $form->input('CourseMembership.days_attended'); ?>
        <?php echo $form->input('CourseMembership.grade'); ?>
        <button type="submit">Save</button>
    <?php echo $form->end(); ?>
        

You can see that the form uses the form helper's dot notation to
build up the data array for the controller's save which looks a bit
like this when submitted.::

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

Cake will happily be able to save the lot together and assigning
the foreign keys of the Student and Course into CourseMembership
with a saveAll call with this data structure. If we run the index
action of our CourseMembershipsController the data structure
received now from a find('all') is::

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

There are of course many ways to work with a join model. The
version above assumes you want to save everything at-once. There
will be cases where you want to create the Student and Course
independently and at a later point associate the two together with
a CourseMembership. So you might have a form that allows selection
of existing students and courses from picklists or ID entry and
then the two meta-fields for the CourseMembership, e.g.::

        
        //views/course_memberships/add.ctp
        
        <?php echo $form->create('CourseMembership'); ?>
            <?php echo $form->input('Student.id', array('type' => 'text', 'label' => 'Student ID', 'default' => 1)); ?>
            <?php echo $form->input('Course.id', array('type' => 'text', 'label' => 'Course ID', 'default' => 1)); ?>
            <?php echo $form->input('CourseMembership.days_attended'); ?>
            <?php echo $form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $form->end(); ?>

And the resultant POST::

     
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

Again Cake is good to us and pulls the Student id and Course id
into the CourseMembership with the saveAll.

Join models are pretty useful things to be able to use and Cake
makes it easy to do so with its built-in hasMany and belongsTo
associations and saveAll feature.

.. _dynamic-associations:

Creating and Destroying Associations on the Fly
-----------------------------------------------

Sometimes it becomes necessary to create and destroy model
associations on the fly. This may be for any number of reasons:


-  You want to reduce the amount of associated data fetched, but
   all your associations are on the first level of recursion.
-  You want to change the way an association is defined in order to
   sort or filter associated data.

This association creation and destruction is done using the CakePHP
model bindModel() and unbindModel() methods. (There is also a very
helpful behavior called "Containable", please refer to manual
section about Built-in behaviors for more information). Let's set
up a few models so we can see how bindModel() and unbindModel()
work. We'll start with two models::

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
Leader model to fetch a Leader and its associated followers. As you
can see above, the association array in the Leader model defines a
"Leader hasMany Followers" relationship. For demonstration
purposes, let's use unbindModel() to remove that association in a
controller action::

    <?php
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

.. note::

    Removing or adding associations using bind- and unbindModel() only
    works for the *next* find operation only unless the second
    parameter has been set to false. If the second parameter has been
    set to *false*, the bind remains in place for the remainder of the
    request.

Here’s the basic usage pattern for unbindModel()::

    <?php
    $this->Model->unbindModel(
        array('associationType' => array('associatedModelClassName'))
    );

Now that we've successfully removed an association on the fly,
let's add one. Our as-of-yet unprincipled Leader needs some
associated Principles. The model file for our Principle model is
bare, except for the var $name statement. Let's associate some
Principles to our Leader on the fly (but remember–only for just the
following find operation). This function appears in the
LeadersController::

    <?php
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

There you have it. The basic usage for bindModel() is the
encapsulation of a normal association array inside an array whose
key is named after the type of association you are trying to
create::

    <?php
    $this->Model->bindModel(
            array('associationName' => array(
                    'associatedModelClassName' => array(
                        // normal association keys go here...
                    )
                )
            )
        );

Even though the newly bound model doesn't need any sort of
association definition in its model file, it will still need to be
correctly keyed in order for the new association to work properly.

Multiple relations to the same model
------------------------------------

There are cases where a Model has more than one relation to another
Model. For example you might have a Message model that has two
relations to the User model. One relation to the user that sends a
message, and a second to the user that receives the message. The
messages table will have a field user\_id, but also a field
recipient\_id. Now your Message model can look something like::

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

Recipient is an alias for the User model. Now let's see what the
User model would look like::

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

It is also possible to create self associations as shown below::

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
assuming a parent/child relationship) is to have both the
``$belongsTo`` and ``$hasMany`` relationships of a model each to
declare an identical alias, className, and foreignKey [property]::

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

**Reasoning** [for this particular self-association method]: Say
there are many models which contain the property
``$modelClass.lastUserId``. Each model has the foreign key
``last_user_id``, a reference to the last user that
updated/modified the record in question. The model ``User``
*also contains* the same property (last\_user\_id), since it may be
neat to know if someone has committed a security breach through the
modification of any User record other than their own (you could
also use strict ACL behaviors).

**Fetching a nested array of associated records:**

If your table has ``parent_id`` field you can also use :ref:`model-find-threaded`
to fetch nested array of records using a single query without
setting up any associations.

Joining tables
--------------

In SQL you can combine related tables using the JOIN statement.
This allows you to perform complex searches across multiples tables
(i.e: search posts given several tags).

In CakePHP some associations (belongsTo and hasOne) performs
automatic joins to retrieve data, so you can issue queries to
retrieve models based on data in the related one.

But this is not the case with hasMany and hasAndBelongsToMany
associations. Here is where forcing joins comes to the rescue. You
only have to define the necessary joins to combine tables and get
the desired results for your query.

.. note::

    Remember you need to set the recursion to -1 for this to work. I.e:
    $this->Channel->recursive = -1;

To force a join between tables you need to use the "modern" syntax
for Model::find(), adding a 'joins' key to the $options array. For
example::

    <?php
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

.. note::

    Note that the 'join' arrays are not keyed.

In the above example, a model called Item is left joined to the
channels table. You can alias the table with the Model name, so the
retrieved data complies with the CakePHP data structure.

The keys that define the join are the following:


-  **table**: The table for the join.
-  **alias**: An alias to the table. The name of the model
   associated with the table is the best bet.
-  **type**: The type of join: inner, left or right.
-  **conditions**: The conditions to perform the join.

With joins, you could add conditions based on Related model
fields::

    <?php
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

Suppose a Book hasAndBelongsToMany Tag association. This relation
uses a books\_tags table as join table, so you need to join the
books table to the books\_tags table, and this with the tags
table::

    <?php
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
alternative for Containable if your main goal is to perform
searches based on related data. Containable is best suited to
restricting the amount of related data brought by a find
statement.
