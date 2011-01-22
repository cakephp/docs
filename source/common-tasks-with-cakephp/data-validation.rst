4.1 Data Validation
-------------------

Data validation is an important part of any application, as it
helps to make sure that the data in a Model conforms to the
business rules of the application. For example, you might want to
make sure that passwords are at least eight characters long, or
ensure that usernames are unique. Defining validation rules makes
form handling much, much easier.

There are many different aspects to the validation process. What
we’ll cover in this section is the model side of things.
Essentially: what happens when you call the save() method of your
model. For more information about how to handle the displaying of
validation errors, check out
:doc:`/core-helpers/form`.

The first step to data validation is creating the validation rules
in the Model. To do that, use the Model::validate array in the
Model definition, for example:

::

    <?php
    class User extends AppModel {  
        var $name = 'User';
        var $validate = array();
    }
    ?>

In the example above, the $validate array is added to the User
Model, but the array contains no validation rules. Assuming that
the users table has login, password, email and born fields, the
example below shows some simple validation rules that apply to
those fields:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => 'alphaNumeric',
            'email' => 'email',
            'born' => 'date'
        );
    }
    ?>

This last example shows how validation rules can be added to model
fields. For the login field, only letters and numbers will be
accepted, the email should be valid, and born should be a valid
date. Defining validation rules enables CakePHP’s automagic showing
of error messages in forms if the data submitted does not follow
the defined rules.

CakePHP has many validation rules and using them can be quite easy.
Some of the built-in rules allow you to verify the formatting of
emails, URLs, and credit card numbers – but we’ll cover these in
detail later on.

Here is a more complex validation example that takes advantage of
some of these built-in validation rules:

::

    <?php
    class User extends AppModel {
        var $name = 'User';
        var $validate = array(
            'login' => array(
                'alphaNumeric' => array(
                    'rule' => 'alphaNumeric',
                    'required' => true,
                    'message' => 'Alphabets and numbers only'
                    ),
                'between' => array(
                    'rule' => array('between', 5, 15),
                    'message' => 'Between 5 to 15 characters'
                )
            ),
            'password' => array(
                'rule' => array('minLength', '8'),
                'message' => 'Mimimum 8 characters long'
            ),
            'email' => 'email',
            'born' => array(
                'rule' => 'date',
                'message' => 'Enter a valid date',
                'allowEmpty' => true
            )
        );
    }
    ?>

Two validation rules are defined for login: it should contain
letters and numbers only, and its length should be between 5 and
15. The password field should be a minimum of 8 characters long.
The email should be a valid email address, and born should be a
valid date. Also, notice how you can define specific error messages
that CakePHP will use when these validation rules fail.

As the example above shows, a single field can have multiple
validation rules. And if the built-in rules do not match your
criteria, you can always add your own validation rules as
required.

Now that you’ve seen the big picture on how validation works, let’s
look at how these rules are defined in the model. There are three
different ways that you can define validation rules: simple arrays,
single rule per field, and multiple rules per field.
