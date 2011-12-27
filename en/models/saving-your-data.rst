Saving Your Data
################

CakePHP makes saving model data a snap. Data ready to be saved
should be passed to the model’s ``save()`` method using the
following basic format::

    Array
    (
        [ModelName] => Array
        (
            [fieldname1] => 'value'
            [fieldname2] => 'value'
        )
    )

Most of the time you won’t even need to worry about this format:
CakePHP's :php:class:`FormHelper`, and model find methods all
package data in this format. If you're using either of the helpers,
the data is also conveniently available in ``$this->request->data`` for
quick usage.

Here's a quick example of a controller action that uses a CakePHP
model to save data to a database table::

    <?php
    function edit($id) {
        // Has any form data been POSTed?
        if ($this->request->is('post')) {
            // If the form data can be validated and saved...
            if ($this->Recipe->save($this->request->data)) {
                // Set a session flash message and redirect.
                $this->Session->setFlash("Recipe Saved!");
                $this->redirect('/recipes');
            }
        }
     
        // If no form data, find the recipe to be edited
        // and hand it to the view.
        $this->set('recipe', $this->Recipe->findById($id));
    }

When save is called, the data passed to it in the first parameter is validated
using CakePHP validation mechanism (see :doc:`/models/data-validation` chapter for more
information). If for some reason your data isn't saving, be sure to check to see
if some validation rules are being broken. You can debug this situation by
outputting :php:attr:`Model::$validationErrors`::

    <?php
    if ($this->Recipe->save($this->request->data)) {
        // handle the success.
    }
    debug($this->Recipe->validationErrors);

There are a few other save-related methods in the model that you'll
find useful:

:php:meth:`Model::set($one, $two = null)`
=========================================

``Model::set()`` can be used to set one or many fields of data to the
data array inside a model. This is useful when using models with
the ActiveRecord features offered by Model::

    <?php
    $this->Post->read(null, 1);
    $this->Post->set('title', 'New title for the article');
    $this->Post->save();

Is an example of how you can use ``set()`` to update and save
single fields, in an ActiveRecord approach. You can also use
``set()`` to assign new values to multiple fields::

    <?php
    $this->Post->read(null, 1);
    $this->Post->set(array(
        'title' => 'New title',
        'published' => false
    ));
    $this->Post->save();

The above would update the title and published fields and save them
to the database.

:php:meth:`Model::save(array $data = null, boolean $validate = true, array $fieldList = array())`
=================================================================================================

Featured above, this method saves array-formatted data. The second
parameter allows you to sidestep validation, and the third allows
you to supply a list of model fields to be saved. For added
security, you can limit the saved fields to those listed in
``$fieldList``.

.. note::

    If ``$fieldList`` is not supplied, a malicious user can add additional
    fields to the form data (if you are not using
    :php:class:`SecurityComponent`), and by this change fields that were not
    originally intended to be changed.

The save method also has an alternate syntax::

    <?php
    save(array $data = null, array $params = array())

``$params`` array can have any of the following available options
as keys:

* ``validate`` Set to true/false to enable disable validation.
* ``fieldList`` An array of fields you want to allow for saving.
* ``callbacks`` Set to false to disable callbacks.  Using 'before' or 'after'
  will enable only those callbacks.

More information about model callbacks is available
:doc:`here <callback-methods>`


.. tip::

    If you don't want the updated field to be updated when saving some
    data add ``'updated' => false`` to your ``$data`` array

Once a save has been completed, the ID for the object can be found
in the ``$id`` attribute of the model object - something especially
handy when creating new objects.

::

    <?php
    $this->Ingredient->save($newData);
    $newIngredientId = $this->Ingredient->id;

Creating or updating is controlled by the model's ``id`` field. If
``$Model->id`` is set, the record with this primary key is updated.
Otherwise a new record is created::

    <?php
    // Create: id isn't set or is null
    $this->Recipe->create();
    $this->Recipe->save($this->request->data);
    
    // Update: id is set to a numerical value 
    $this->Recipe->id = 2;
    $this->Recipe->save($this->request->data);

.. tip::

    When calling save in a loop, don't forget to call ``create()``


If you want to update a value, rather than create a new one, make sure
your are passing the primary key field into the data array::

    <?php
    $data = array('id' => 10, 'title' => 'My new title');
    // This will update Recipe with id 10
    $this->Recipe->save($data);

:php:meth:`Model::create(array $data = array())`
================================================

This method resets the model state for saving new information.

If the ``$data`` parameter (using the array format outlined above)
is passed, the model instance will be ready to save with that data
(accessible at ``$this->data``).

If ``false`` is passed instead of an array, the model instance will
not initialize fields from the model schema that are not already
set, it will only reset fields that have already been set, and
leave the rest unset. Use this to avoid updating fields in the
database that were already set.

:php:meth:`Model::saveField(string $fieldName, string $fieldValue, $validate = false)`
======================================================================================

Used to save a single field value. Set the ID of the model
(``$this->ModelName->id = $id``) just before calling
``saveField()``. When using this method, ``$fieldName`` should only
contain the name of the field, not the name of the model and
field.

For example, to update the title of a blog post, the call to
``saveField`` from a controller might look something like this::

    <?php
    $this->Post->saveField('title', 'A New Title for a New Day');

.. warning::

    You can't stop the updated field being updated with this method, you
    need to use the save() method.

:php:meth:`Model::updateAll(array $fields, array $conditions)`
==============================================================

Updates many records in a single call. Records to be updated are
identified by the ``$conditions`` array, and fields to be updated,
along with their values, are identified by the ``$fields`` array.

For example, to approve all bakers who have been members for over a
year, the update call might look something like::

    <?php
    $this_year = date('Y-m-d h:i:s', strtotime('-1 year'));
    
    $this->Baker->updateAll(
        array('Baker.approved' => true),
        array('Baker.created <=' => $this_year)
    );

.. tip::

    The $fields array accepts SQL expressions. Literal values should be
    quoted manually.

.. note::

    Even if the modified field exists for the model being updated, it is
    not going to be updated automatically by the ORM. Just add it
    manually to the array if you need it to be updated.

For example, to close all tickets that belong to a certain
customer::

    <?php
    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.customer_id' => 453)
    );

By default, updateAll() will automatically join any belongsTo
association for databases that support joins. To prevent this,
temporarily unbind the associations.

:php:meth:`Model::saveMany(array $data = null, array $options = array())`
=========================================================================

Method used to save multiple rows of the same model at once. The following
options may be used:

* validate: Set to false to disable validation, true to validate each record before saving,
  'first' to validate *all* records before any are saved (default),
* atomic: If true (default), will attempt to save all records in a single transaction.
  Should be set to false if database/table does not support transactions.
*  fieldList: Equivalent to the $fieldList parameter in Model::save()

For saving multiple records of single model, $data needs to be a
numerically indexed array of records like this::

    <?php
    array(
        array('title' => 'title 1'),
        array('title' => 'title 2'),
    )

.. note::

    Note that we are passing numerical indices instead of usual
    ``$data`` containing the Article key. When saving multiple records
    of same model the records arrays should be just numerically indexed
    without the model key.

It is also acceptable to have the data in the following format::

    <?php
    array(
        array('Article' => array('title' => 'title 1')),
        array('Article' => array('title' => 'title 2')),
    )

Keep in mind that if you want to update a record instead of creating a new one
you just need to add the primary key index to the data row::

    <?php
    array(
        array('Article' => array('title' => 'New article')), // This creates a new row
        array('Article' => array('id' => 2, 'title' => 'title 2')), // This updates an existing row
    )


:php:meth:`Model::saveAssociated(array $data = null, array $options = array())`
===============================================================================

Method used to save multiple model associations at once. The following
options may be used:

* validate: Set to false to disable validation, true to validate each record before saving,
  'first' to validate *all* records before any are saved (default),
* atomic: If true (default), will attempt to save all records in a single transaction.
  Should be set to false if database/table does not support transactions.
*  fieldList: Equivalent to the $fieldList parameter in Model::save()

For saving a record along with its related record having a hasOne
or belongsTo association, the data array should be like this::

    <?php
    array(
        'User' => array('username' => 'billy'),
        'Profile' => array('sex' => 'Male', 'occupation' => 'Programmer'),
    )

For saving a record along with its related records having hasMany
association, the data array should be like this::

    <?php
    array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array('body' => 'Comment 2', 'user_id' => 12),
            array('body' => 'Comment 3', 'user_id' => 40),
        ),
    )

.. note::

    Saving related data with ``saveAssociated()`` will only work for directly
    associated models. If successful, the foreign key of the main model will be stored in 
    the related models' id field, i.e. $this->RelatedModel->id.

.. warning::
    
    Be careful when checking saveAssociated calls with atomic option set to
    false. It returns an array instead of boolean.


:php:meth:`Model::saveAll(array $data = null, array $options = array())`
========================================================================

The ``saveAll`` function is just a wrapper around the ``saveMany`` and ``saveAssociated``
methods. it will inspect the data and determine what type of save it should perform. If
data is formatted in a numerical indexed array, ``saveMany`` will be called, otherwise
``saveAssociated`` is used.

This function receives the same options as the former two, and is generally a backwards
compatible function. It is recommended using either ``saveMany`` or ``saveAssociated``
depending on the case.


Saving Related Model Data (hasOne, hasMany, belongsTo)
======================================================

When working with associated models, it is important to realize
that saving model data should always be done by the corresponding
CakePHP model. If you are saving a new Post and its associated
Comments, then you would use both Post and Comment models during
the save operation.

If neither of the associated model records exists in the system yet
(for example, you want to save a new User and their related Profile
records at the same time), you'll need to first save the primary,
or parent model.

To get an idea of how this works, let's imagine that we have an
action in our UsersController that handles the saving of a new User
and a related Profile. The example action shown below will assume
that you've POSTed enough data (using the FormHelper) to create a
single User and a single Profile::

    <?php
    function add() {
        if (!empty($this->request->data)) {
            // We can save the User data:
            // it should be in $this->request->data['User']

            $user = $this->User->save($this->request->data);

            // If the user was saved, Now we add this information to the data
            // and save the Profile.

            if (!empty($user)) {
                // The ID of the newly created user has been set
                // as $this->User->id.
                $this->request->data['Profile']['user_id'] = $this->User->id;

                // Because our User hasOne Profile, we can access
                // the Profile model through the User model:
                $this->User->Profile->save($this->request->data);
            }
        }
    }

As a rule, when working with hasOne, hasMany, and belongsTo
associations, it's all about keying. The basic idea is to get the
key from one model and place it in the foreign key field on the
other. Sometimes this might involve using the ``$id`` attribute of
the model class after a ``save()``, but other times it might just
involve gathering the ID from a hidden input on a form that’s just
been POSTed to a controller action.

To supplement the basic approach used above, CakePHP also offers a
very handy method ``saveAssociated()``, which allows you to validate and
save multiple models in one shot. In addition, ``saveAssociated()``
provides transactional support to ensure data integrity in your
database (i.e. if one model fails to save, the other models will
not be saved either).

.. note::

    For transactions to work correctly in MySQL your tables must use
    InnoDB engine. Remember that MyISAM tables do not support
    transactions.

Let's see how we can use ``saveAssociated()`` to save Company and Account
models at the same time.

First, you need to build your form for both Company and Account
models (we'll assume that Company hasMany Account)::

    <?php
    echo $form->create('Company', array('action' => 'add'));
    echo $form->input('Company.name', array('label' => 'Company name'));
    echo $form->input('Company.description');
    echo $form->input('Company.location');
    
    echo $form->input('Account.0.name', array('label' => 'Account name'));
    echo $form->input('Account.0.username');
    echo $form->input('Account.0.email');
    
    echo $form->end('Add');

Take a look at the way we named the form fields for the Account
model. If Company is our main model, ``saveAssociated()`` will expect the
related model's (Account) data to arrive in a specific format. And
having ``Account.0.fieldName`` is exactly what we need.

.. note::

    The above field naming is required for a hasMany association. If
    the association between the models is hasOne, you have to use
    ModelName.fieldName notation for the associated model.

Now, in our CompaniesController we can create an ``add()``
action::

    <?php
    function add() {
        if (!empty($this->request->data)) {
            // Use the following to avoid validation errors:
            unset($this->Company->Account->validate['company_id']);
            $this->Company->saveAssociated($this->request->data);
        }
    }

That's all there is to it. Now our Company and Account models will
be validated and saved all at the same time. By default ``saveAssociated``
will validate all values passed and then try to perform a save for each.

Saving hasMany through data
===========================

Let's see how data stored in a join table for two models is saved. As shown in the :ref:`hasMany-through`
section, the join table is associated to each model using a `hasMany` type of relationship.
Our example involves the Head of Cake School asking us to write an application that allows
him to log a student's attendance on a course with days attended and grade. Take
a look at the following code.::

   <?php
   // Controller/CourseMembershipController.php
   class CourseMembershipsController extends AppController {
       public $uses = array('CourseMembership');

       public function index() {
           $this->set('courseMembershipsList', $this->CourseMembership->find('all'));
       }

       public function add() {
           if ($this->request->is('post')) {
               if ($this->CourseMembership->saveAssociated($this->request->data)) {
                   $this->redirect(array('action' => 'index'));
               }
           }
       }
   }

   // View/CourseMemberships/add.ctp

   <?php echo $this->Form->create('CourseMembership'); ?>
       <?php echo $this->Form->input('Student.first_name'); ?>
       <?php echo $this->Form->input('Student.last_name'); ?>
       <?php echo $this->Form->input('Course.name'); ?>
       <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
       <?php echo $this->Form->input('CourseMembership.grade'); ?>
       <button type="submit">Save</button>
   <?php echo  $this->Form->end(); ?>
        

The data array will look like this when submitted.::

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

Cake will happily be able to save the lot together and assign
the foreign keys of the Student and Course into CourseMembership
with a `saveAssociated` call with this data structure. If we run the index
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
        
        // View/CourseMemberships/add.ctp
        
        <?php echo $form->create('CourseMembership'); ?>
            <?php echo $this->Form->input('Student.id', array('type' => 'text', 'label' => 'Student ID', 'default' => 1)); ?>
            <?php echo $this->Form->input('Course.id', array('type' => 'text', 'label' => 'Course ID', 'default' => 1)); ?>
            <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
            <?php echo $this->Form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $this->Form->end(); ?>

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
into the CourseMembership with the `saveAssociated`.

.. _saving-habtm:

Saving Related Model Data (HABTM)
---------------------------------

Saving models that are associated by hasOne, belongsTo, and hasMany
is pretty simple: you just populate the foreign key field with the
ID of the associated model. Once that's done, you just call the
save() method on the model, and everything gets linked up
correctly.

With HABTM, you need to set the ID of the associated model in your
data array. We'll build a form that creates a new tag and
associates it on the fly with some recipe.

The simplest form might look something like this (we'll assume that
$recipe\_id is already set to something)::

    <?php echo $this->Form->create('Tag');?>
        <?php echo $this->Form->input(
            'Recipe.id', 
            array('type' => 'hidden', 'value' => $recipe_id)); ?>
        <?php echo $this->Form->input('Tag.name'); ?>
    <?php echo $this->Form->end('Add Tag'); ?>

In this example, you can see the ``Recipe.id`` hidden field whose
value is set to the ID of the recipe we want to link the tag to.

When the ``save()`` method is invoked within the controller, it'll
automatically save the HABTM data to the database.

::

    <?php
    function add() {
        // Save the association
        if ($this->Tag->save($this->request->data)) {
            // do something on success
        }
    }

With the preceding code, our new Tag is created and associated with
a Recipe, whose ID was set in $this->request->data['Recipe']['id'].

Other ways we might want to present our associated data can include
a select drop down list. The data can be pulled from the model
using the ``find('list')`` method and assigned to a view variable
of the model name. An input with the same name will automatically
pull in this data into a ``<select>``::

    <?php
    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));
    
    // in the view:
    $form->input('tags');

A more likely scenario with a HABTM relationship would include a
``<select>`` set to allow multiple selections. For example, a
Recipe can have multiple Tags assigned to it. In this case, the
data is pulled out of the model the same way, but the form input is
declared slightly different. The tag name is defined using the
``ModelName`` convention::

    <?php
    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));
    
    // in the view:
    $this->Form->input('Tag');

Using the preceding code, a multiple select drop down is created,
allowing for multiple choices to automatically be saved to the
existing Recipe being added or saved to the database.

What to do when HABTM becomes complicated?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

By default when saving a HasAndBelongsToMany relationship, Cake
will delete all rows on the join table before saving new ones. For
example if you have a Club that has 10 Children associated. You
then update the Club with 2 children. The Club will only have 2
Children, not 12.

Also note that if you want to add more fields to the join (when it
was created or meta information) this is possible with HABTM join
tables, but it is important to understand that you have an easy
option.

HasAndBelongsToMany between two models is in reality shorthand for
three models associated through both a hasMany and a belongsTo
association.

Consider this example::

    Child hasAndBelongsToMany Club

Another way to look at this is adding a Membership model::

    Child hasMany Membership
    Membership belongsTo Child, Club
    Club hasMany Membership.

These two examples are almost the exact same. They use the same
amount of named fields in the database and the same amount of
models. The important differences are that the "join" model is
named differently and its behavior is more predictable.

.. tip::

    When your join table contains extra fields besides two foreign
    keys, you can prevent deletion of existing records by setting
    ``'unique'`` array key to ``'keepExisting'``.

However, in most cases it's easier to make a model for the join table
and setup hasMany, belongsTo associations as shown in example above
instead of using HABTM association.


.. meta::
    :title lang=en: Saving Your Data
    :keywords lang=en: doc models,validation rules,data validation,flash message,null model,table php,request data,php class,model data,database table,array,recipes,success,reason,snap,data model
