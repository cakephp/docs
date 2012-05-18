13 Data Validation
------------------

Creating custom validation rules can help to make sure the data in a
Model conforms to the business rules of the application, such as
passwords can only be eight characters long, user names can only have
letters, etc.

The first step to data validation is creating the validation rules in
the Model. To do that, use the Model::validate array in the Model
definition, for example:

/app/models/user.php
~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class User extends AppModel
    {
       var $name = 'User';

       var $validate = array(
          'login' => '/[a-z0-9\_\-]{3,}$/i',
          'password' => VALID_NOT_EMPTY,
          'email' => VALID_EMAIL,
          'born' => VALID_NUMBER
       );
    }
    ?>

Validations are defined using Perl-compatibile regular expressions, some
of which are pre-defined in /libs/validators.php. These are:

-  VALID\_NOT\_EMPTY
-  VALID\_NUMBER
-  VALID\_EMAIL
-  VALID\_YEAR

If there are any validations present in the model definition (i.e. in
the $validate array), they will be parsed and checked during saves (i.e.
in the Model::save() method). To validate the data directly use the
Model::validates() (returns false if data is incorrect) and
Model::invalidFields() (which returns an array of error messages).

But usually the data is implicit in the controller code. The following
example demonstrates how to create a form-handling action:

Form-handling Action in /app/controllers/blog\_controller.php
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class BlogController extends AppController {

       var $uses = array('Post');

       function add ()
       {
          if (empty($this->data))
          {
             $this->render();
          }
          else
          {
             if($this->Post->save($this->data))
             {
                 //ok cool, the stuff is valid
             }
             else
             {
                //Danger, Will Robinson. Validation errors.
                $this->set('errorMessage', 'Please correct errors below.');
                $this->render();
             }
          }
       }
    }
    ?>

The view used by this action can look like this:

The add form view in /app/views/blog/add.thtml
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <h2>Add post to blog</h2>
    <form action="<?php echo $html->url('/blog/add')?>" method="post">
        <div class="blog_add">
            <p>Title:
                <?php echo $html->input('Post/title', array('size'=>'40'))?>
                <?php echo $html->tagErrorMsg('Post/title', 'Title is required.')?>
            </p>
            <p>Body
                <?php echo $html->textarea('Post/body') ?>
                <?php echo $html->tagErrorMsg('Post/body', 'Body is required.')?>
            </p> 
            <p><?=$html->submit('Save')?></p>
        </div>
    </form>

The Controller::validates($model[, $model...]) is used to check any
custom validation added in the model. The Controller::validationErrors()
method returns any error messages thrown in the model so they can be
displayed by tagErrorMsg() in the view.

If you'd like to perform some custom validation apart from the regex
based Cake validation, you can use the invalidate() function of your
model to flag a field as erroneous. Imagine that you wanted to show an
error on a form when a user tries to create a username that already
exists in the system. Because you can't just ask Cake to find that out
using regex, you'll need to do your own validation, and flag the field
as invalid to invoke Cake's normal form invalidation process.

Remember to use a field name that isn't already in the model, in order
to avoid any conflicts.

The controller might look something like this:

::

    <?php

    class UsersController extends AppController
    {
        function create()
        {
            // Check to see if form data has been submitted
            if (!empty($this->data['User']))
            {
                //See if a user with that username exists
                $user = $this->User->findByUsername($this->data['User']['username']);

                // Invalidate the field to trigger the HTML Helper's error messages
                if (!empty($user['User']['username']))
                {
                    $this->User->invalidate('username_unique');//populates tagErrorMsg('User/username_unique')
                }

                //Try to save as normal, shouldn't work if the field was invalidated.
                if($this->User->save($this->data))
                {
                    $this->redirect('/users/index/saved');
                }
                else
                {
                     $this->render();
                }
            }
        }
    }

    ?>

If you want to invalidate a piece of data that is outside of the Model
itself, be sure to add that data to the Model using the set() method.
This informs the model about that data so it can be handled properly.
