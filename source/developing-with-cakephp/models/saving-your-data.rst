3.7.4 Saving Your Data
----------------------

CakePHP makes saving model data a snap. Data ready to be saved
should be passed to the model’s ``save()`` method using the
following basic format:

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
CakePHP's ``HtmlHelper``, ``FormHelper``, and find methods all
package data in this format. If you're using either of the helpers,
the data is also conveniently available in ``$this->data`` for
quick usage.

Here's a quick example of a controller action that uses a CakePHP
model to save data to a database table:

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
        $this->set('recipe', $this->Recipe->findById($id));
    }

One additional note: when save is called, the data passed to it in
the first parameter is validated using CakePHP validation mechanism
(see the Data Validation chapter for more information). If for some
reason your data isn't saving, be sure to check to see if some
validation rules are being broken.

There are a few other save-related methods in the model that you'll
find useful:

``set($one, $two = null)``

Model::set() can be used to set one or many fields of data to the
data array inside a model. This is useful when using models with
the ActiveRecord features offered by Model.

::

    $this->Post->read(null, 1);
    $this->Post->set('title', 'New title for the article');
    $this->Post->save();

Is an example of how you can use ``set()`` to update and save
single fields, in an ActiveRecord approach. You can also use
``set()`` to assign new values to multiple fields.

::

    $this->Post->read(null, 1);
    $this->Post->set(array(
        'title' => 'New title',
        'published' => false
    ));
    $this->Post->save();

The above would update the title and published fields and save them
to the database.

``save(array $data = null, boolean $validate = true, array $fieldList = array())``

Featured above, this method saves array-formatted data. The second
parameter allows you to sidestep validation, and the third allows
you to supply a list of model fields to be saved. For added
security, you can limit the saved fields to those listed in
``$fieldList``.

If ``$fieldList`` is not supplied, a malicious user can add
additional fields to the form data (if you are not using Security
component), and by this change fields that were not originally
intended to be changed.

The save method also has an alternate syntax:

``save(array $data = null, array $params = array())``

``$params`` array can have any of the following available options
as keys:

::

    array(
        'validate' => true,
        'fieldList' => array(),
        'callbacks' => true //other possible values are false, 'before', 'after'
    )

More information about model callbacks is available
`here <http://docs.cakephp.org/view/76/Callback-Methods>`_

If you dont want the updated field to be updated when saving some
data add ``'updated' => false`` to your ``$data`` array

Once a save has been completed, the ID for the object can be found
in the ``$id`` attribute of the model object - something especially
handy when creating new objects.

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

If the ``$data`` parameter (using the array format outlined above)
is passed, the model instance will be ready to save with that data
(accessible at ``$this->data``).

If ``false`` is passed instead of an array, the model instance will
not initialize fields from the model schema that are not already
set, it will only reset fields that have already been set, and
leave the rest unset. Use this to avoid updating fields in the
database that were already set and are intended to be updated.

``saveField(string $fieldName, string $fieldValue, $validate = false)``

Used to save a single field value. Set the ID of the model
(``$this->ModelName->id = $id``) just before calling
``saveField()``. When using this method, ``$fieldName`` should only
contain the name of the field, not the name of the model and
field.

For example, to update the title of a blog post, the call to
``saveField`` from a controller might look something like this:

::

    $this->Post->saveField('title', 'A New Title for a New Day');

You cant stop the updated field being updated with this method, you
need to use the save() method.

``updateAll(array $fields, array $conditions)``

Updates many records in a single call. Records to be updated are
identified by the ``$conditions`` array, and fields to be updated,
along with their values, are identified by the ``$fields`` array.

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

Even if the modified field exist for the model being updated, it is
not going to be updated automatically by the ORM. Just add it
manually to the array if you need it to be updated.

For example, to close all tickets that belong to a certain
customer:

::

    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.customer_id' => 453)
    );

By default, updateAll() will automatically join any belongsTo
association for databases that support joins. To prevent this,
temporarily unbind the associations.

``saveAll(array $data = null, array $options = array())``

Used to save (a) multiple individual records for a single model or
(b) this record, as well as all associated records

The following options may be used:

validate: Set to false to disable validation, true to validate each
record before saving, 'first' to validate \*all\* records before
any are saved (default), or 'only' to only validate the records,
but not save them.

atomic: If true (default), will attempt to save all records in a
single transaction. Should be set to false if database/table does
not support transactions. If false, we return an array similar to
the $data array passed, but values are set to true/false depending
on whether each record saved successfully.

fieldList: Equivalent to the $fieldList parameter in
``Model::save()``

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
``$data``. When saving multiple records of same model the records
arrays should be just numerically indexed without the model key.

For saving a record along with its related record having a hasOne
or belongsTo association, the data array should be like this:

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
associated models.

Calling a saveAll before another saveAll has completed will cause
the first saveAll to return false. One or both of the saveAll calls
must have atomic set to false to correct this behavior.

Saving Related Model Data (hasOne, hasMany, belongsTo)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
single User and a single Profile.

::

    <?php
    function add() {
        if (!empty($this->data)) {
            // We can save the User data:
            // it should be in $this->data['User']
     
            $user = $this->User->save($this->data);
    
            // If the user was saved, Now we add this information to the data
            // and save the Profile.
          
            if (!empty($user)) {
                // The ID of the newly created user has been set
                // as $this->User->id.
                $this->data['Profile']['user_id'] = $this->User->id;
    
                // Because our User hasOne Profile, we can access
                // the Profile model through the User model:
                $this->User->Profile->save($this->data);
            }
        }
    }
    ?>

As a rule, when working with hasOne, hasMany, and belongsTo
associations, its all about keying. The basic idea is to get the
key from one model and place it in the foreign key field on the
other. Sometimes this might involve using the ``$id`` attribute of
the model class after a ``save()``, but other times it might just
involve gathering the ID from a hidden input on a form that’s just
been POSTed to a controller action.

To supplement the basic approach used above, CakePHP also offers a
very handy method ``saveAll()``, which allows you to validate and
save multiple models in one shot. In addition, ``saveAll()``
provides transactional support to ensure data integrity in your
database (i.e. if one model fails to save, the other models will
not be saved either).

For transactions to work correctly in MySQL your tables must use
InnoDB engine. Remember that MyISAM tables do not support
transactions.

Let's see how we can use ``saveAll()`` to save Company and Account
models at the same time.

First, you need to build your form for both Company and Account
models (we'll assume that Company hasMany Account).

::

    
    echo $form->create('Company', array('action'=>'add'));
    echo $form->input('Company.name', array('label'=>'Company name'));
    echo $form->input('Company.description');
    echo $form->input('Company.location');
    
    echo $form->input('Account.0.name', array('label'=>'Account name'));
    echo $form->input('Account.0.username');
    echo $form->input('Account.0.email');
    
    echo $form->end('Add');

Take a look at the way we named the form fields for the Account
model. If Company is our main model, ``saveAll()`` will expect the
related model's (Account) data to arrive in a specific format. And
having ``Account.0.fieldName`` is exactly what we need.

The above field naming is required for a hasMany association. If
the association between the models is hasOne, you have to use
ModelName.fieldName notation for the associated model.

Now, in our companies\_controller we can create an ``add()``
action:

::

    
    function add() {
       if(!empty($this->data)) {
          //Use the following to avoid   validation errors:
          unset($this->Company->Account->validate['company_id']);
          $this->Company->saveAll($this->data, array('validate'=>'first'));
       }
    }

That's all there is to it. Now our Company and Account models will
be validated and saved all at the same time. A quick thing to point
out here is the use of ``array('validate'=>'first')``; this option
will ensure that both of our models are validated. Note that
``array('validate'=>'first')`` is the default option on cakephp
1.3.

counterCache - Cache your count()
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This function helps you cache the count of related data. Instead of
counting the records manually via ``find('count')``, the model
itself tracks any addition/deleting towards the associated
``$hasMany`` model and increases/decreases a dedicated integer
field within the parent model table.

The name of the field consists of the singular model name followed
by a underscore and the word "count".

::

    my_model_count

Let's say you have a model called ``ImageComment`` and a model
called ``Image``, you would add a new INT-field to the ``image``
table and name it ``image_comment_count``.

Here are some more examples:

Model
Associated Model
Example
User
Image
users.image\_count
Image
ImageComment
images.image\_comment\_count
BlogEntry
BlogEntryComment
blog\_entries.blog\_entry\_comment\_count
Once you have added the counter field you are good to go. Activate
counter-cache in your association by adding a ``counterCache`` key
and set the value to ``true``.

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array('counterCache' => true)
        );
    }

From now on, every time you add or remove a ``Image`` associated to
``ImageAlbum``, the number within ``image_count`` is adjusted
automatically.

You can also specify ``counterScope``. It allows you to specify a
simple condition which tells the model when to update (or when not
to, depending on how you look at it) the counter value.

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
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Saving models that are associated by hasOne, belongsTo, and hasMany
is pretty simple: you just populate the foreign key field with the
ID of the associated model. Once that's done, you just call the
save() method on the model, and everything gets linked up
correctly.

With HABTM, you need to set the ID of the associated model in your
data array. We'll build a form that creates a new tag and
associates it on the fly with some recipe.

The simplest form might look something like this (we'll assume that
$recipe\_id is already set to something):

::

    <?php echo $form->create('Tag');?>
        <?php echo $form->input(
            'Recipe.id', 
            array('type'=>'hidden', 'value' => $recipe_id)); ?>
        <?php echo $form->input('Tag.name'); ?>
        <?php echo $form->end('Add Tag'); ?>

In this example, you can see the ``Recipe.id`` hidden field whose
value is set to the ID of the recipe we want to link the tag to.

When the ``save()`` method is invoked within the controller, it'll
automatically save the HABTM data to the database.

::

    function add() {
        
        //Save the association
        if ($this->Tag->save($this->data)) {
            //do something on success            
        }
    }

With the preceding code, our new Tag is created and associated with
a Recipe, whose ID was set in $this->data['Recipe']['id'].

Other ways we might want to present our associated data can include
a select drop down list. The data can be pulled from the model
using the ``find('list')`` method and assigned to a view variable
of the model name. An input with the same name will automatically
pull in this data into a ``<select>``.

::

    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));
    
    // in the view:
    $form->input('tags');

A more likely scenario with a HABTM relationship would include a
``<select>`` set to allow multiple selections. For example, a
Recipe can have multiple Tags assigned to it. In this case, the
data is pulled out of the model the same way, but the form input is
declared slightly different. The tag name is defined using the
``ModelName`` convention.

::

    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));
    
    // in the view:
    $form->input('Tag');

Using the preceding code, a multiple select drop down is created,
allowing for multiple choices to automatically be saved to the
existing Recipe being added or saved to the database.

**What to do when HABTM becomes complicated?**

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

Consider this example:

::

    Child hasAndBelongsToMany Club

Another way to look at this is adding a Membership model:

::

    Child hasMany Membership
    Membership belongsTo Child, Club
    Club hasMany Membership.

These two examples are almost the exact same. They use the same
amount and named fields in the database and the same amount of
models. The important differences are that the "join" model is
named differently and its behavior is more predictable.

When your join table contains extra fields besides two foreign
keys, in most cases it's easier to make a model for the join table
and setup hasMany, belongsTo associations as shown in example above
instead of using HABTM association.
