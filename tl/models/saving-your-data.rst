Saving Your Data
################

CakePHP makes saving model data a snap. Data ready to be saved
should be passed to the model's ``save()`` method using the
following basic format::

    Array
    (
        [ModelName] => Array
        (
            [fieldname1] => 'value'
            [fieldname2] => 'value'
        )
    )

Most of the time you won't even need to worry about this format:
CakePHP's :php:class:`FormHelper`, and model find methods all
package data in this format. If you're using :php:class:`FormHelper`,
the data is also conveniently available in ``$this->request->data`` for
quick usage.

Here's a quick example of a controller action that uses a CakePHP
model to save data to a database table::

    public function edit($id) {
        // Has any form data been POSTed?
        if ($this->request->is('post')) {
            // If the form data can be validated and saved...
            if ($this->Recipe->save($this->request->data)) {
                // Set a session flash message and redirect.
                $this->Session->setFlash('Recipe Saved!');
                return $this->redirect('/recipes');
            }
        }

        // If no form data, find the recipe to be edited
        // and hand it to the view.
        $this->set('recipe', $this->Recipe->findById($id));
    }

When save is called, the data passed to it in the first parameter is validated
using CakePHP's validation mechanism (see :doc:`/models/data-validation` chapter for more
information). If for some reason your data isn't saving, be sure to check to see
if some validation rules are being broken. You can debug this situation by
outputting :php:attr:`Model::$validationErrors`::

    if ($this->Recipe->save($this->request->data)) {
        // handle the success.
    }
    debug($this->Recipe->validationErrors);

There are a few other save-related methods in the model that you'll
find useful:

Model::set($one, $two = null)
=============================

``Model::set()`` can be used to set one or many fields of data to the
data array inside a model. This is useful when using models with
the ActiveRecord features offered by Model::

    $this->Post->read(null, 1);
    $this->Post->set('title', 'New title for the article');
    $this->Post->save();

Is an example of how you can use ``set()`` to update
single fields, in an ActiveRecord approach. You can also use
``set()`` to assign new values to multiple fields::

    $this->Post->read(null, 1);
    $this->Post->set(array(
        'title' => 'New title',
        'published' => false
    ));
    $this->Post->save();

The above would update the title and published fields and save the
record to the database.

Model::clear()
==============

This method can be used to reset model state and clear out any unsaved data and
validation errors.

.. versionadded:: 2.4


Model::save(array $data = null, boolean $validate = true, array $fieldList = array())
=====================================================================================

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

    save(array $data = null, array $params = array())

``$params`` array can have any of the following available options
as keys:

* ``validate`` Set to true/false to enable/disable validation.
* ``fieldList`` An array of fields you want to allow for saving.
* ``callbacks`` Set to false to disable callbacks. Using 'before' or 'after'
  will enable only those callbacks.
* ``counterCache`` (since 2.4) Boolean to control updating of counter caches (if any)
* ``atomic`` (since 2.6) Boolean to indicate you want records saved in
  a transaction.

More information about model callbacks is available
:doc:`here <callback-methods>`

.. tip::

    If you don't want the ``modified`` field to be automatically updated when saving some
    data add ``'modified' => false`` to your ``$data`` array

Once a save has been completed, the ID for the object can be found
in the ``$id`` attribute of the model object - something especially
handy when creating new objects.

::

    $this->Ingredient->save($newData);
    $newIngredientId = $this->Ingredient->id;

Creating or updating is controlled by the model's ``id`` field. If
``$Model->id`` is set, the record with this primary key is updated.
Otherwise a new record is created::

    // Create: id isn't set or is null
    $this->Recipe->create();
    $this->Recipe->save($this->request->data);

    // Update: id is set to a numerical value
    $this->Recipe->id = 2;
    $this->Recipe->save($this->request->data);

.. tip::

    When calling save in a loop, don't forget to call ``clear()``.


If you want to update a value, rather than create a new one, make sure
you are passing the primary key field into the data array::

    $data = array('id' => 10, 'title' => 'My new title');
    // This will update Recipe with id 10
    $this->Recipe->save($data);

Model::create(array $data = array())
====================================

This method resets the model state for saving new information.
It does not actually create a record in the database but clears
Model::$id and sets Model::$data based on your database field defaults. If you have
not defined defaults for your database fields, Model::$data will be set to an empty array.

If the ``$data`` parameter (using the array format outlined above) is passed, it will be merged with the database
field defaults and the model instance will be ready to save with that data (accessible at ``$this->data``).

If ``false`` or ``null`` are passed for the ``$data`` parameter, Model::$data will be set to an empty array.

.. tip::

    If you want to insert a new row instead of updating an existing one you should always call create() first.
    This avoids conflicts with possible prior save calls in callbacks or other places.

Model::saveField(string $fieldName, string $fieldValue, $validate = false)
==========================================================================

Used to save a single field value. Set the ID of the model
(``$this->ModelName->id = $id``) just before calling
``saveField()``. When using this method, ``$fieldName`` should only
contain the name of the field, not the name of the model and
field.

For example, to update the title of a blog post, the call to
``saveField`` from a controller might look something like this::

    $this->Post->saveField('title', 'A New Title for a New Day');

.. warning::

    You can't stop the ``modified`` field being updated with this method, you
    need to use the save() method.

The saveField method also has an alternate syntax::

    saveField(string $fieldName, string $fieldValue, array $params = array())

``$params`` array can have any of the following available options
as keys:

* ``validate`` Set to true/false to enable/disable validation.
* ``callbacks`` Set to false to disable callbacks. Using 'before' or 'after'
  will enable only those callbacks.
* ``counterCache`` (since 2.4) Boolean to control updating of counter caches (if any)

Model::updateAll(array $fields, mixed $conditions)
==================================================

Updates one or more records in a single call. Fields to be updated,
along with their values, are identified by the ``$fields`` array.
Records to be updated are identified by the ``$conditions`` array.
If ``$conditions`` argument is not supplied or it is set to ``true``,
all records will be updated.

For example, to approve all bakers who have been members for over a
year, the update call might look something like::

    $thisYear = date('Y-m-d H:i:s', strtotime('-1 year'));

    $this->Baker->updateAll(
        array('Baker.approved' => true),
        array('Baker.created <=' => $thisYear)
    );


The ``$fields`` array accepts SQL expressions. Literal values should be
quoted manually using :php:meth:`DboSource::value()`. For example if one of your
model methods was calling ``updateAll()`` you would do the following::

    $db = $this->getDataSource();
    $value = $db->value($value, 'string');
    $this->updateAll(
        array('Baker.status' => $value),
        array('Baker.status' => 'old')
    );

.. note::

    Even if the modified field exists for the model being updated, it is
    not going to be updated automatically by the ORM. Just add it
    manually to the array if you need it to be updated.

For example, to close all tickets that belong to a certain
customer::

    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.customer_id' => 453)
    );

By default, updateAll() will automatically join any belongsTo
association for databases that support joins. To prevent this,
temporarily unbind the associations.

Model::saveMany(array $data = null, array $options = array())
=============================================================

Method used to save multiple rows of the same model at once. The following
options may be used:

* ``validate``: Set to false to disable validation, true to validate each record before saving,
  'first' to validate *all* records before any are saved (default),
* ``atomic``: If true (default), will attempt to save all records in a single transaction.
  Should be set to false if database/table does not support transactions.
* ``fieldList``: Equivalent to the $fieldList parameter in Model::save()
* ``deep``: (since 2.1) If set to true, also associated data is saved; see also
  :ref:`saveAssociated() <Model-saveAssociated>`
* ``callbacks`` Set to false to disable callbacks. Using 'before' or 'after'
  will enable only those callbacks.
* ``counterCache`` (since 2.4) Boolean to control updating of counter caches (if any)

For saving multiple records of single model, $data needs to be a
numerically indexed array of records like this::

    $data = array(
        array('title' => 'title 1'),
        array('title' => 'title 2'),
    );

.. note::

    Note that we are passing numerical indexes instead of usual
    ``$data`` containing the Article key. When saving multiple records
    of same model the records arrays should be just numerically indexed
    without the model key.

It is also acceptable to have the data in the following format::

    $data = array(
        array('Article' => array('title' => 'title 1')),
        array('Article' => array('title' => 'title 2')),
    );

To save also associated data with ``$options['deep'] = true`` (since 2.1), the two above examples would look like::

    $data = array(
        array('title' => 'title 1', 'Assoc' => array('field' => 'value')),
        array('title' => 'title 2'),
    );
    $data = array(
        array(
            'Article' => array('title' => 'title 1'),
            'Assoc' => array('field' => 'value')
        ),
        array('Article' => array('title' => 'title 2')),
    );
    $Model->saveMany($data, array('deep' => true));

Keep in mind that if you want to update a record instead of creating a new
one you just need to add the primary key index to the data row::

    $data = array(
        array(
            // This creates a new row
            'Article' => array('title' => 'New article')),
        array(
            // This updates an existing row
            'Article' => array('id' => 2, 'title' => 'title 2')),
    );


.. _Model-saveAssociated:

Model::saveAssociated(array $data = null, array $options = array())
===================================================================

Method used to save multiple model associations at once. The following
options may be used:

* ``validate``: Set to false to disable validation, true to validate each record
  before saving, 'first' to validate *all* records before any are saved
  (default),
* ``atomic``: If true (default), will attempt to save all records in a single
  transaction.  Should be set to false if database/table does not support
  transactions.
* ``fieldList``: Equivalent to the $fieldList parameter in Model::save()
* ``deep``: (since 2.1) If set to true, not only directly associated data is
  saved, but deeper nested associated data as well. Defaults to false.
* ``counterCache`` (since 2.4) Boolean to control updating of counter caches (if
  any)

For saving a record along with its related record having a hasOne
or belongsTo association, the data array should be like this::

    $data = array(
        'User' => array('username' => 'billy'),
        'Profile' => array('sex' => 'Male', 'occupation' => 'Programmer'),
    );

For saving a record along with its related records having hasMany
association, the data array should be like this::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array('body' => 'Comment 2', 'user_id' => 12),
            array('body' => 'Comment 3', 'user_id' => 40),
        ),
    );

And for saving a record along with its related records having hasMany with more
than two levels deep associations, the data array should be as follow::

    $data = array(
        'User' => array('email' => 'john-doe@cakephp.org'),
        'Cart' => array(
            array(
                'payment_status_id' => 2,
                'total_cost' => 250,
                'CartItem' => array(
                    array(
                        'cart_product_id' => 3,
                        'quantity' => 1,
                        'cost' => 100,
                    ),
                    array(
                        'cart_product_id' => 5,
                        'quantity' => 1,
                        'cost' => 150,
                    )
                )
            )
        )
    );

.. note::

    If successful, the foreign key of the main model will be stored in
    the related models' id field, i.e. ``$this->RelatedModel->id``.

For saving a record along with its related records having hasMany
association and deeper associated Comment belongsTo User data as well,
the data array should be like this::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array(
                'body' => 'Save a new user as well',
                'User' => array('first' => 'mad', 'last' => 'coder')
            ),
        ),
    );

And save this data with::

    $Article->saveAssociated($data, array('deep' => true));

.. warning::

    Be careful when checking saveAssociated calls with atomic option set to
    false. It returns an array instead of boolean.

Example of using ``fieldList`` with multiple models::

    $this->SomeModel->saveAll($data, array(
        'fieldList' => array(
            'SomeModel' => array('field_1'),
            'AssociatedModel' => array('field_2', 'field_3')
        )
    ));

The fieldList will be an array of model aliases as keys and arrays with fields
as values. The model names are not nested like in the data to be saved.

.. versionchanged:: 2.1
    ``Model::saveAll()`` and friends now support passing the `fieldList` for multiple models.

    You can now save deeper associated data as well with setting ``$options['deep'] = true;``


Model::saveAll(array $data = null, array $options = array())
============================================================

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

    public function add() {
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
involve gathering the ID from a hidden input on a form that's just
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

    echo $this->Form->create('Company', array('action' => 'add'));
    echo $this->Form->input('Company.name', array('label' => 'Company name'));
    echo $this->Form->input('Company.description');
    echo $this->Form->input('Company.location');

    echo $this->Form->input('Account.0.name', array('label' => 'Account name'));
    echo $this->Form->input('Account.0.username');
    echo $this->Form->input('Account.0.email');

    echo $this->Form->end('Add');

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

    public function add() {
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
a look at the following code. ::

   // Controller/CourseMembershipController.php
   class CourseMembershipsController extends AppController {
       public $uses = array('CourseMembership');

       public function index() {
           $this->set(
                'courseMembershipsList',
                $this->CourseMembership->find('all')
            );
       }

       public function add() {
           if ($this->request->is('post')) {
               if ($this->CourseMembership->saveAssociated($this->request->data)) {
                   return $this->redirect(array('action' => 'index'));
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


The data array will look like this when submitted. ::

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

CakePHP will happily be able to save the lot together and assign
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
of existing students and courses from pick lists or ID entry and
then the two meta-fields for the CourseMembership, e.g. ::

        // View/CourseMemberships/add.ctp

        <?php echo $this->Form->create('CourseMembership'); ?>
            <?php
                echo $this->Form->input(
                    'Student.id',
                    array(
                        'type' => 'text',
                        'label' => 'Student ID',
                        'default' => 1
                    )
                );
            ?>
            <?php
                echo $this->Form->input(
                    'Course.id',
                    array(
                        'type' => 'text',
                        'label' => 'Course ID',
                        'default' => 1
                    )
                );
            ?>
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

Again CakePHP is good to us and pulls the Student id and Course id
into the CourseMembership with the `saveAssociated`.

.. _saving-habtm:

Saving Related Model Data (HABTM)
---------------------------------

Saving models that are associated by hasOne, belongsTo, and hasMany
is pretty simple: you just populate the foreign key field with the
ID of the associated model. Once that's done, you just call the
``save()`` method on the model, and everything gets linked up
correctly. An example of the required format for the data array
passed to ``save()`` for the Tag model is shown below::

    Array
    (
        [Recipe] => Array
            (
                [id] => 42
            )
        [Tag] => Array
            (
                [name] => Italian
            )
    )

You can also use this format to save several records and their
HABTM associations with ``saveAll()``, using an array like the
following::

    Array
    (
        [0] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 42
                    )
                [Tag] => Array
                    (
                        [name] => Italian
                    )
            )
        [1] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 43
                    )
                [Tag] => Array
                    (
                        [name] => Pasta
                    )
            )
        [2] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 51
                    )
                [Tag] => Array
                    (
                        [name] => Mexican
                    )
            )
        [3] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 17
                    )
                [Tag] => Array
                    (
                        [name] => American (new)
                    )
            )
    )

Passing the above array to ``saveAll()`` will create the contained tags,
each associated with their respective recipes.

Another example that is helpful is when you need to save many Tags to a Post.
You need to pass the associated HABTM data in the following HABTM array format. Note
you only need to pass in the id's of the associated HABTM model however it needs
to be nested again::

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Saving HABTM arrays'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(1, 2, 5, 9)
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Dr Who\'s Name is Revealed'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(7, 9, 15, 19)
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [title] => 'I Came, I Saw and I Conquered'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(11, 12, 15, 19)
                    )
            )
        [3] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Simplicity is the Ultimate Sophistication'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(12, 22, 25, 29)
                    )
            )
    )

Passing the above array to ``saveAll($data, array('deep' => true))``
will populate the posts_tags join table with the Tag to Post associations.

As an example, we'll build a form that creates a new tag and
generates the proper data array to associate it on the fly with
some recipe.

The simplest form might look something like this (we'll assume that
``$recipe_id`` is already set to something)::

    <?php echo $this->Form->create('Tag'); ?>
        <?php echo $this->Form->input(
            'Recipe.id',
            array('type' => 'hidden', 'value' => $recipe_id)
        ); ?>
        <?php echo $this->Form->input('Tag.name'); ?>
    <?php echo $this->Form->end('Add Tag'); ?>

In this example, you can see the ``Recipe.id`` hidden field whose
value is set to the ID of the recipe we want to link the tag to.

When the ``save()`` method is invoked within the controller, it'll
automatically save the HABTM data to the database::

    public function add() {
        // Save the association
        if ($this->Tag->save($this->request->data)) {
            // do something on success
        }
    }

With the preceding code, our new Tag is created and associated with
a Recipe, whose ID was set in ``$this->request->data['Recipe']['id']``.

Other ways we might want to present our associated data can include
a select drop down list. The data can be pulled from the model
using the ``find('list')`` method and assigned to a view variable
of the model name. An input with the same name will automatically
pull in this data into a ``<select>``::

    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // in the view:
    $this->Form->input('tags');

A more likely scenario with a HABTM relationship would include a
``<select>`` set to allow multiple selections. For example, a
Recipe can have multiple Tags assigned to it. In this case, the
data is pulled out of the model the same way, but the form input is
declared slightly different. The tag name is defined using the
``ModelName`` convention::

    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // in the view:
    $this->Form->input('Tag');

Using the preceding code, a multiple select drop down is created,
allowing for multiple choices to automatically be saved to the
existing Recipe being added or saved to the database.

Self HABTM
~~~~~~~~~~

Normally HABTM is used to bring 2 models together but it can also
be used with only 1 model, though it requires some extra attention.

The key is in the model setup the ``className``. Simply adding a
``Project`` HABTM ``Project`` relation causes issues saving data.
By setting the ``className`` to the models name and use the alias as
key we avoid those issues. ::

    class Project extends AppModel {
        public $hasAndBelongsToMany = array(
            'RelatedProject' => array(
                'className'              => 'Project',
                'foreignKey'             => 'projects_a_id',
                'associationForeignKey'  => 'projects_b_id',
            ),
        );
    }

Creating form elements and saving the data works the same as before but you use the alias instead. This::

    $this->set('projects', $this->Project->find('list'));
    $this->Form->input('Project');

Becomes this::

    $this->set('relatedProjects', $this->Project->find('list'));
    $this->Form->input('RelatedProject');

What to do when HABTM becomes complicated?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

By default when saving a HasAndBelongsToMany relationship, CakePHP
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
    keys, you can prevent losing the extra field values by setting
    ``'unique'`` array key to ``'keepExisting'``. You could think of
    this similar to 'unique' => true, but without losing data from
    the extra fields during save operation. Additionally, if you used
    bake in order to create the models, this is set automatically.
    See: :ref:`HABTM association arrays <ref-habtm-arrays>`.

However, in most cases it's easier to make a model for the join table
and setup hasMany, belongsTo associations as shown in example above
instead of using HABTM association.

Datatables
==========

While CakePHP can have datasources that aren't database driven, most of the
time, they are. CakePHP is designed to be agnostic and will work with MySQL,
Microsoft SQL Server, PostgreSQL and others. You can create your database tables as you
normally would. When you create your Model classes, they'll automatically map to
the tables that you've created. Table names are by convention lowercase and
pluralized with multi-word table names separated by underscores. For example, a
Model name of Ingredient expects the table name ingredients. A Model name of
EventRegistration would expect a table name of event_registrations. CakePHP will
inspect your tables to determine the data type of each field and uses this
information to automate various features such as outputting form fields in the
view. Field names are by convention lowercase and separated by underscores.

Using created and modified
--------------------------

By defining a ``created`` and/or ``modified`` field in your database table as datetime
fields (default null), CakePHP will recognize those fields and populate them automatically
whenever a record is created or saved to the database (unless the data being
saved already contains a value for these fields).

The ``created`` and ``modified`` fields will be set to the current date and time when
the record is initially added. The modified field will be updated with the
current date and time whenever the existing record is saved.

If you have ``created`` or ``modified`` data in your $this->data (e.g. from a
Model::read or Model::set) before a Model::save() then the values will be taken
from $this->data and not automagically updated. If you don't want that you can use
``unset($this->data['Model']['modified'])``, etc. Alternatively you can override
the Model::save() to always do it for you::

    class AppModel extends Model {

        public function save($data = null, $validate = true, $fieldList = array()) {
            // Clear modified field value before each save
            $this->set($data);
            if (isset($this->data[$this->alias]['modified'])) {
                unset($this->data[$this->alias]['modified']);
            }
            return parent::save($this->data, $validate, $fieldList);
        }

    }

If you are saving data with a ``fieldList`` and the ``created`` and ``modified``
fields are not present in the whitelist, the fields will continue to have the values
automatically assigned. When included in the ``fieldList``, the ``created`` and
``modified`` fields work like any other field.

.. meta::
    :title lang=en: Saving Your Data
    :keywords lang=en: doc models,validation rules,data validation,flash message,null model,table php,request data,php class,model data,database table,array,recipes,success,reason,snap,data model
