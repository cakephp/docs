Data Validation
###############

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
:doc:`/core-libraries/helpers/form`.

The first step to data validation is creating the validation rules
in the Model. To do that, use the Model::validate array in the
Model definition, for example::

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
those fields::

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
some of these built-in validation rules::

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

.. _core-validation-rules:

Core Validation Rules
=====================

.. php:class:: Validation

The Validation class in CakePHP contains many validation rules that
can make model data validation much easier. This class contains
many oft-used validation techniques you won’t need to write on your
own. Below, you'll find a complete list of all the rules, along
with usage examples.

.. php:staticmethod:: alphaNumeric()

    The data for the field must only contain letters and numbers.::

        <?php
        var $validate = array(
            'login' => array(
                'rule' => 'alphaNumeric',
                'message' => 'Usernames must only contain letters and numbers.'
            )
        );

.. php:staticmethod:: between()

    The length of the data for the field must fall within the specified
    numeric range. Both minimum and maximum values must be supplied.
    Uses = not.::

        <?php
        var $validate = array(
            'password' => array(
                'rule' => array('between', 5, 15),
                'message' => 'Passwords must be between 5 and 15 characters long.'
            )
        );

    The length of data is "the number of bytes in the string
    representation of the data". Be careful that it may be larger than
    the number of characters when handling non-ASCII characters.

.. php:staticmethod:: blank

    This rule is used to make sure that the field is left blank or only
    white space characters are present in its value. White space
    characters include space, tab, carriage return, and newline.::

        <?php
        var $validate = array(
            'id' => array(
                'rule' => 'blank',
                'on' => 'create'
            )
        );

.. php:staticmethod:: boolean

    The data for the field must be a boolean value. Valid values are
    true or false, integers 0 or 1 or strings '0' or '1'.::

        <?php
        var $validate = array(
            'myCheckbox' => array(
                'rule' => array('boolean'),
                'message' => 'Incorrect value for myCheckbox'
            )
        );

.. php:staticmethod:: cc()

    This rule is used to check whether the data is a valid credit card
    number. It takes three parameters: ‘type’, ‘deep’ and ‘regex’.

    The ‘type’ key can be assigned to the values of ‘fast’, ‘all’ or
    any of the following:


    -  amex
    -  bankcard
    -  diners
    -  disc
    -  electron
    -  enroute
    -  jcb
    -  maestro
    -  mc
    -  solo
    -  switch
    -  visa
    -  voyager

    If ‘type’ is set to ‘fast’, it validates the data against the major
    credit cards’ numbering formats. Setting ‘type’ to ‘all’ will check
    with all the credit card types. You can also set ‘type’ to an array
    of the types you wish to match.

    The ‘deep’ key should be set to a boolean value. If it is set to
    true, the validation will check the Luhn algorithm of the credit
    card
    (`http://en.wikipedia.org/wiki/Luhn\_algorithm <http://en.wikipedia.org/wiki/Luhn_algorithm>`_).
    It defaults to false.

    The ‘regex’ key allows you to supply your own regular expression
    that will be used to validate the credit card number.

    ::

        <?php
        var $validate = array(
            'ccnumber' => array(
                'rule' => array('cc', array('visa', 'maestro'), false, null),
                'message' => 'The credit card number you supplied was invalid.'
            )
        );

.. php:staticmethod:: comparison()

    Comparison is used to compare numeric values. It supports “is
    greater”, “is less”, “greater or equal”, “less or equal”, “equal
    to”, and “not equal”. Some examples are shown below:

    ::

        <?php
        var $validate = array(
            'age' => array(
                'rule' => array('comparison', '>=', 18),
                'message' => 'Must be at least 18 years old to qualify.'
            )
        );
    
        var $validate = array(
            'age' => array(
                'rule' => array('comparison', 'greater or equal', 18),
                'message' => 'Must be at least 18 years old to qualify.'
            )
        );

.. php:staticmethod:: date()

    This rule ensures that data is submitted in valid date formats. A
    single parameter (which can be an array) can be passed that will be
    used to check the format of the supplied date. The value of the
    parameter can be one of the following:


    -  ‘dmy’ e.g. 27-12-2006 or 27-12-06 (separators can be a space,
       period, dash, forward slash)
    -  ‘mdy’ e.g. 12-27-2006 or 12-27-06 (separators can be a space,
       period, dash, forward slash)
    -  ‘ymd’ e.g. 2006-12-27 or 06-12-27 (separators can be a space,
       period, dash, forward slash)
    -  ‘dMy’ e.g. 27 December 2006 or 27 Dec 2006
    -  ‘Mdy’ e.g. December 27, 2006 or Dec 27, 2006 (comma is optional)
    -  ‘My’ e.g. (December 2006 or Dec 2006)
    -  ‘my’ e.g. 12/2006 or 12/06 (separators can be a space, period,
       dash, forward slash)

    If no keys are supplied, the default key that will be used is
    ‘ymd’.

    ::

        <?php
        var $validate = array(
            'born' => array(
                'rule' => array('date','ymd'),
                'message' => 'Enter a valid date in YY-MM-DD format.',
                'allowEmpty' => true
            )
        );

    While many data stores require a certain date format, you might
    consider doing the heavy lifting by accepting a wide-array of date
    formats and trying to convert them, rather than forcing users to
    supply a given format. The more work you can do for your users, the
    better.

.. php:staticmethod:: decimal()

    This rule ensures that the data is a valid decimal number. A
    parameter can be passed to specify the number of digits required
    after the decimal point. If no parameter is passed, the data will
    be validated as a scientific float, which will cause validation to
    fail if no digits are found after the decimal point.

    ::

        <?php
        var $validate = array(
            'price' => array(
                'rule' => array('decimal', 2)
            )
        );

.. php:staticmethod:: email()

    This checks whether the data is a valid email address. Passing a
    boolean true as the second parameter for this rule will also
    attempt to verify that the host for the address is valid.

    ::
    
        <?php
        var $validate = array('email' => array('rule' => 'email'));
     
        var $validate = array(
            'email' => array(
                'rule' => array('email', true),
                'message' => 'Please supply a valid email address.'
            )
        );

.. php:staticmethod:: equalTo()

    This rule will ensure that the value is equal to, and of the same
    type as the given value.

    ::

        <?php
        var $validate = array(
            'food' => array(
                'rule' => array('equalTo', 'cake'),  
                'message' => 'This value must be the string cake'
            )
        );

.. php:staticmethod:: extension()

    This rule checks for valid file extensions like .jpg or .png. Allow
    multiple extensions by passing them in array form.

    ::

        <?php
        var $validate = array(
            'image' => array(
                'rule' => array('extension', array('gif', 'jpeg', 'png', 'jpg')),
                'message' => 'Please supply a valid image.'
            )
        );


.. php:staticmethod:: ip()

    This rule will ensure that a valid IPv4 or IPv6 address has been
    submitted. Accepts as option 'both' (default), 'IPv4' or 'IPv6'.

    ::

        <?php
        var $validate = array(
            'clientip' => array(
                'rule' => array('ip', 'IPv4'), // or 'IPv6' or 'both' (default)
                'message' => 'Please supply a valid IP address.'
            )
        );

.. php:staticmethod:: isUnique()

    The data for the field must be unique, it cannot be used by any
    other rows.

    ::

        <?php
        var $validate = array(
            'login' => array(
                'rule' => 'isUnique',
                'message' => 'This username has already been taken.'
            )
        );

.. php:staticmethod:: minLength()

    This rule ensures that the data meets a minimum length
    requirement.

    ::

        <?php
        var $validate = array(
            'login' => array(
                'rule' => array('minLength', 8),  
                'message' => 'Usernames must be at least 8 characters long.'
            )
        );

    The length here is "the number of bytes in the string
    representation of the data". Be careful that it may be larger than
    the number of characters when handling non-ASCII characters.

.. php:staticmethod:: maxLength()

    This rule ensures that the data stays within a maximum length
    requirement.

    ::

        <?php
        var $validate = array(
            'login' => array(
                'rule' => array('maxLength', 15),  
                'message' => 'Usernames must be no larger than 15 characters long.'
            )
        );

    The length here is "the number of bytes in the string
    representation of the data". Be careful that it may be larger than
    the number of characters when handling non-ASCII characters.

.. php:staticmethod:: money()

    This rule will ensure that the value is in a valid monetary
    amount.

    Second parameter defines where symbol is located (left/right).

    ::

        <?php
        var $validate = array(
            'salary' => array(
                'rule' => array('money', 'left'),
                'message' => 'Please supply a valid monetary amount.'
            )
        );

.. php:staticmethod:: multiple()

    Use this for validating a multiple select input. It supports
    parameters "in", "max" and "min".

    ::

        <?php
        var $validate = array(
            'multiple' => array(
                'rule' => array('multiple', array(
                    'in' => array('do', 'ray', 'me', 'fa', 'so', 'la', 'ti'), 'min' => 1, 'max' => 3)
                ),
                'message' => 'Please select one, two or three options'
            )
        );

.. php:staticmethod:: inList()

    This rule will ensure that the value is in a given set. It needs an
    array of values. The field is valid if the field's value matches
    one of the values in the given array.

    Example::

        <?php
            var $validate = array(
              'function' => array(
                'allowedChoice' => array(
                    'rule' => array('inList', array('Foo', 'Bar')),
                    'message' => 'Enter either Foo or Bar.'
                )
              )
            );

.. php:staticmethod:: numeric()

    Checks if the data passed is a valid number.::

        <?php
        var $validate = array(
            'cars' => array(
                'rule' => 'numeric',  
                'message' => 'Please supply the number of cars.'
            )
        );

.. php:staticmethod:: notEmpty()

    The basic rule to ensure that a field is not empty.::

        <?php
        var $validate = array(
            'title' => array( 
                'rule' => 'notEmpty',
                'message' => 'This field cannot be left blank'
            )
        );

    Do not use this for a multiple select input as it will cause an
    error. Instead, use "multiple".

.. php:staticmethod:: phone()

    Phone validates US phone numbers. If you want to validate non-US
    phone numbers, you can provide a regular expression as the second
    parameter to cover additional number formats.

    ::

        <?php
        var $validate = array(
            'phone' => array(
                'rule' => array('phone', null, 'us')
            )
        );

.. php:staticmethod:: postal()

    Postal is used to validate ZIP codes from the U.S. (us), Canada
    (ca), U.K (uk), Italy (it), Germany (de) and Belgium (be). For
    other ZIP code formats, you may provide a regular expression as the
    second parameter.

    ::

        <?php
        var $validate = array(
            'zipcode' => array(
                'rule' => array('postal', null, 'us')
            )
        );

.. php:staticmethod:: range()

    This rule ensures that the value is in a given range. If no range
    is supplied, the rule will check to ensure the value is a legal
    finite on the current platform.

    ::

        <?php
        var $validate = array(
            'number' => array(
                'rule' => array('range', -1, 11),
                'message' => 'Please enter a number between 0 and 10'
            )
        );

    The above example will accept any value which is larger than 0
    (e.g., 0.01) and less than 10 (e.g., 9.99). 
    
    .. note::
    
        The range lower/upper are not inclusive

.. php:staticmethod:: ssn()

    Ssn validates social security numbers from the U.S. (us), Denmark
    (dk), and the Netherlands (nl). For other social security number
    formats, you may provide a regular expression.

    ::

        <?php
        var $validate = array(
            'ssn' => array(
                'rule' => array('ssn', null, 'us')
            )
        );

.. php:staticmethod:: url()

    This rule checks for valid URL formats. Supports http(s), ftp(s),
    file, news, and gopher protocols::

        <?php
        var $validate = array(
            'website' => array(
                'rule' => 'url'
            )
        );

    To ensure that a protocol is in the url, strict mode can be enabled
    like so.

    ::

        <?php
        var $validate = array(
            'website' => array(
                'rule' => array('url', true)
            )
        );


.. toctree::

    data-validation/simple-rules
    data-validation/one-rule-per-field
    data-validation/multiple-rules-per-field
    data-validation/custom-validation-rules
    data-validation/validating-data-from-the-controller
