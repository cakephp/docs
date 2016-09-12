Data Validation
###############

Data validation is an important part of any application, as it
helps to make sure that the data in a Model conforms to the
business rules of the application. For example, you might want to
make sure that passwords are at least eight characters long, or
ensure that usernames are unique. Defining validation rules makes
form handling much, much easier.

There are many different aspects to the validation process. What
we'll cover in this section is the model side of things.
Essentially: what happens when you call the save() method of your
model. For more information about how to handle the displaying of
validation errors, check out
:doc:`/core-libraries/helpers/form`.

The first step to data validation is creating the validation rules
in the Model. To do that, use the Model::validate array in the
Model definition, for example::

    class User extends AppModel {
        public $validate = array();
    }

In the example above, the ``$validate`` array is added to the User
Model, but the array contains no validation rules. Assuming that
the users table has login, password, email and born fields, the
example below shows some simple validation rules that apply to
those fields::

    class User extends AppModel {
        public $validate = array(
            'login' => 'alphaNumeric',
            'email' => 'email',
            'born' => 'date'
        );
    }

This last example shows how validation rules can be added to model
fields. For the login field, only letters and numbers will be
accepted, the email should be valid, and born should be a valid
date. Defining validation rules enables CakePHP's automagic showing
of error messages in forms if the data submitted does not follow
the defined rules.

CakePHP has many validation rules and using them can be quite easy.
Some of the built-in rules allow you to verify the formatting of
emails, URLs, and credit card numbers – but we'll cover these in
detail later on.

Here is a more complex validation example that takes advantage of
some of these built-in validation rules::

    class User extends AppModel {
        public $validate = array(
            'login' => array(
                'alphaNumeric' => array(
                    'rule' => 'alphaNumeric',
                    'required' => true,
                    'message' => 'Letters and numbers only'
                ),
                'between' => array(
                    'rule' => array('lengthBetween', 5, 15),
                    'message' => 'Between 5 to 15 characters'
                )
            ),
            'password' => array(
                'rule' => array('minLength', '8'),
                'message' => 'Minimum 8 characters long'
            ),
            'email' => 'email',
            'born' => array(
                'rule' => 'date',
                'message' => 'Enter a valid date',
                'allowEmpty' => true
            )
        );
    }

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

Now that you've seen the big picture on how validation works, let's
look at how these rules are defined in the model. There are three
different ways that you can define validation rules: simple arrays,
single rule per field, and multiple rules per field.


Simple Rules
============

As the name suggests, this is the simplest way to define a
validation rule. The general syntax for defining rules this way
is::

    public $validate = array('fieldName' => 'ruleName');

Where, 'fieldName' is the name of the field the rule is defined
for, and 'ruleName' is a pre-defined rule name, such as
'alphaNumeric', 'email' or 'isUnique'.

For example, to ensure that the user is giving a well formatted
email address, you could use this rule::

    public $validate = array('user_email' => 'email');


One Rule Per Field
==================

This definition technique allows for better control of how the
validation rules work. But before we discuss that, let's see the
general usage pattern adding a rule for a single field::

    public $validate = array(
        'fieldName1' => array(
            // or: array('ruleName', 'param1', 'param2' ...)
            'rule' => 'ruleName',
            'required' => true,
            'allowEmpty' => false,
            // or: 'update'
            'on' => 'create',
            'message' => 'Your Error Message'
        )
    );

The 'rule' key is required. If you only set 'required' => true, the
form validation will not function correctly. This is because
'required' is not actually a rule.

As you can see here, each field (only one field shown above) is
associated with an array that contains five keys: 'rule',
'required', 'allowEmpty', 'on' and 'message'. Let's have a closer
look at these keys.

rule
----

The 'rule' key defines the validation method and takes either a
single value or an array. The specified 'rule' may be the name of a
method in your model, a method of the core Validation class, or a
regular expression. For more information on the rules available by
default, see
:ref:`core-validation-rules`.

If the rule does not require any parameters, 'rule' can be a single
value e.g. ::

    public $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric'
        )
    );

If the rule requires some parameters (like the max, min or range),
'rule' should be an array::

    public $validate = array(
        'password' => array(
            'rule' => array('minLength', 8)
        )
    );

Remember, the 'rule' key is required for array-based rule
definitions.

required
--------

This key accepts either a boolean, or ``create`` or ``update``. Setting this
key to ``true`` will make the field always required. While setting it to
``create`` or ``update`` will make the field required only for update or  create
operations. If 'required' is evaluated to true, the field must be present in the
data array. For example, if the validation rule has been defined as follows::

    public $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'required' => true
        )
    );

The data sent to the model's save() method must contain data for
the login field. If it doesn't, validation will fail. The default
value for this key is boolean false.

``required => true`` does not mean the same as the validation rule
``notBlank()``. ``required => true`` indicates that the array *key*
must be present - it does not mean it must have a value. Therefore
validation will fail if the field is not present in the dataset,
but may (depending on the rule) succeed if the value submitted is
empty ('').

.. versionchanged:: 2.1
    Support for ``create`` and ``update`` were added.

allowEmpty
----------

If set to ``false``, the field value must be **nonempty**, where
"nonempty" is defined as ``!empty($value) || is_numeric($value)``.
The numeric check is so that CakePHP does the right thing when
``$value`` is zero.

The difference between ``required`` and ``allowEmpty`` can be
confusing. ``'required' => true`` means that you cannot save the
model without the *key* for this field being present in
``$this->data`` (the check is performed with ``isset``); whereas,
``'allowEmpty' => false`` makes sure that the current field *value*
is nonempty, as described above.

on
--

The 'on' key can be set to either one of the following values:
'update' or 'create'. This provides a mechanism that allows a
certain rule to be applied either during the creation of a new
record, or during update of a record.

If a rule has defined 'on' => 'create', the rule will only be
enforced during the creation of a new record. Likewise, if it is
defined as 'on' => 'update', it will only be enforced during the
updating of a record.

The default value for 'on' is null. When 'on' is null, the rule
will be enforced during both creation and update.

message
-------

The message key allows you to define a custom validation error
message for the rule::

    public $validate = array(
        'password' => array(
            'rule' => array('minLength', 8),
            'message' => 'Password must be at least 8 characters long'
        )
    );

.. note::

    Regardless of the rule, validation failure without a defined message defaults to "This field cannot be left blank."

Multiple Rules per Field
========================

The technique outlined above gives us much more flexibility than
simple rules assignment, but there's an extra step we can take in
order to gain more fine-grained control of data validation. The
next technique we'll outline allows us to assign multiple
validation rules per model field.

If you would like to assign multiple validation rules to a single
field, this is basically how it should look::

    public $validate = array(
        'fieldName' => array(
            'ruleName' => array(
                'rule' => 'ruleName',
                // extra keys like on, required, etc. go here...
            ),
            'ruleName2' => array(
                'rule' => 'ruleName2',
                // extra keys like on, required, etc. go here...
            )
        )
    );

As you can see, this is quite similar to what we did in the
previous section. There, for each field we had only one array of
validation parameters. In this case, each 'fieldName' consists of
an array of rule indexes. Each 'ruleName' contains a separate array
of validation parameters.

This is better explained with a practical example::

    public $validate = array(
        'login' => array(
            'loginRule-1' => array(
                'rule' => 'alphaNumeric',
                'message' => 'Only alphabets and numbers allowed',
             ),
            'loginRule-2' => array(
                'rule' => array('minLength', 8),
                'message' => 'Minimum length of 8 characters'
            )
        )
    );

The above example defines two rules for the login field:
loginRule-1 and loginRule-2. As you can see, each rule is
identified with an arbitrary name.

When using multiple rules per field the 'required' and 'allowEmpty'
keys need to be used only once in the first rule.

last
----

In case of multiple rules per field by default if a particular rule
fails error message for that rule is returned and the following rules
for that field are not processed. If you want validation to continue
in spite of a rule failing set key ``last`` to ``false`` for that rule.

In the following example even if "rule1" fails "rule2" will be processed
and error messages for both failing rules will be returned if "rule2" also
fails::

    public $validate = array(
        'login' => array(
            'rule1' => array(
                'rule' => 'alphaNumeric',
                'message' => 'Only alphabets and numbers allowed',
                'last' => false
             ),
            'rule2' => array(
                'rule' => array('minLength', 8),
                'message' => 'Minimum length of 8 characters'
            )
        )
    );

When specifying validation rules in this array form it's possible to avoid
providing the ``message`` key. Consider this example::

    public $validate = array(
        'login' => array(
            'Only alphabets and numbers allowed' => array(
                'rule' => 'alphaNumeric',
             ),
        )
    );

If the ``alphaNumeric`` rules fails the array key for this rule
'Only alphabets and numbers allowed' will be returned as error message since
the ``message`` key is not set.

Custom Validation Rules
=======================

If you haven't found what you need thus far, you can always create
your own validation rules. There are two ways you can do this: by
defining custom regular expressions, or by creating custom
validation methods.

Custom Regular Expression Validation
------------------------------------

If the validation technique you need to use can be completed by
using regular expression matching, you can define a custom
expression as a field validation rule::

    public $validate = array(
        'login' => array(
            'rule' => '/^[a-z0-9]{3,}$/i',
            'message' => 'Only letters and integers, min 3 characters'
        )
    );

The example above checks if the login contains only letters and
integers, with a minimum of three characters.

The regular expression in the ``rule`` must be delimited by
slashes. The optional trailing 'i' after the last slash means the
reg-exp is case *i*\ nsensitive.

Adding your own Validation Methods
----------------------------------

Sometimes checking data with regular expression patterns is not
enough. For example, if you want to ensure that a promotional code
can only be used 25 times, you need to add your own validation
function, as shown below::

    class User extends AppModel {

        public $validate = array(
            'promotion_code' => array(
                'rule' => array('limitDuplicates', 25),
                'message' => 'This code has been used too many times.'
            )
        );

        public function limitDuplicates($check, $limit) {
            // $check will have value: array('promotion_code' => 'some-value')
            // $limit will have value: 25
            $existingPromoCount = $this->find('count', array(
                'conditions' => $check,
                'recursive' => -1
            ));
            return $existingPromoCount < $limit;
        }
    }

The current field to be validated is passed into the function as
first parameter as an associated array with field name as key and
posted data as value.

If you want to pass extra parameters to your validation function,
add elements onto the 'rule' array, and handle them as extra params
(after the main ``$check`` param) in your function.

Your validation function can be in the model (as in the example
above), or in a behavior that the model implements. This includes
mapped methods.

Model/behavior methods are checked first, before looking for a
method on the ``Validation`` class. This means that you can
override existing validation methods (such as ``alphaNumeric()``)
at an application level (by adding the method to ``AppModel``), or
at model level.

When writing a validation rule which can be used by multiple
fields, take care to extract the field value from the $check array.
The $check array is passed with the form field name as its key and
the field value as its value. The full record being validated is
stored in $this->data member variable::

    class Post extends AppModel {

        public $validate = array(
            'slug' => array(
                'rule' => 'alphaNumericDashUnderscore',
                'message' => 'Slug can only be letters,' .
                    ' numbers, dash and underscore'
            )
        );

        public function alphaNumericDashUnderscore($check) {
            // $data array is passed using the form field name as the key
            // have to extract the value to make the function generic
            $value = array_values($check);
            $value = $value[0];

            return preg_match('|^[0-9a-zA-Z_-]*$|', $value);
        }
    }

.. note::

    Your own validation methods must have ``public`` visibility. Validation
    methods that are ``protected`` and ``private`` are not supported.

The method should return ``true`` if the value is valid. If the validation
failed, return ``false``. The other valid return value are strings which will
be shown as the error message. Returning a string means the validation failed.
The string will overwrite the message set in the $validate array and be shown
in the view's form as the reason why the field was not valid.

Dynamically change validation rules
===================================

Using the ``$validate`` property to declare validation rules is a good way of
statically defining rules for each model. Nevertheless, there are cases when you
want to dynamically add, change or remove validation rules from the predefined
set.

All validation rules are stored in a ``ModelValidator`` object, which holds
every rule set for each field in your model. Defining new validation rules is as
easy as telling this object to store new validation methods for the fields you
want to.

Adding new validation rules
---------------------------

.. versionadded:: 2.2

The ``ModelValidator`` objects allows several ways for adding new fields to the
set. The first one is using the ``add`` method::

    // Inside a model class
    $this->validator()->add('password', 'required', array(
        'rule' => 'notBlank',
        'required' => 'create'
    ));

This will add a single rule to the ``password`` field in the model. You can
chain multiple calls to add to create as many rules as you like::

    // Inside a model class
    $this->validator()
        ->add('password', 'required', array(
            'rule' => 'notBlank',
            'required' => 'create'
        ))
        ->add('password', 'size', array(
            'rule' => array('lengthBetween', 8, 20),
            'message' => 'Password should be at least 8 chars long'
        ));

It is also possible to add multiple rules at once for a single field::

    $this->validator()->add('password', array(
        'required' => array(
            'rule' => 'notBlank',
            'required' => 'create'
        ),
        'size' => array(
            'rule' => array('lengthBetween', 8, 20),
            'message' => 'Password should be at least 8 chars long'
        )
    ));

Alternatively, you can use the validator object to set rules directly to fields
using the array interface::

    $validator = $this->validator();
    $validator['username'] = array(
        'unique' => array(
            'rule' => 'isUnique',
            'required' => 'create'
        ),
        'alphanumeric' => array(
            'rule' => 'alphanumeric'
        )
    );

Modifying current validation rules
----------------------------------

.. versionadded:: 2.2

Modifying current validation rules is also possible using the validator object,
there are several ways in which you can alter current rules, append methods to a
field or completely remove a rule from a field rule set::

    // In a model class
    $this->validator()->getField('password')->setRule('required', array(
        'rule' => 'required',
        'required' => true
    ));

You can also completely replace all the rules for a field using a similar
method::

    // In a model class
    $this->validator()->getField('password')->setRules(array(
        'required' => array(...),
        'otherRule' => array(...)
    ));

If you wish to just modify a single property in a rule you can set properties
directly into the ``CakeValidationRule`` object::

    // In a model class
    $this->validator()->getField('password')
        ->getRule('required')->message = 'This field cannot be left blank';

Properties in any ``CakeValidationRule`` get their name from the array keys
one is allowed to use when defining a validation rule's properties, such as the
array keys 'message' and 'allowEmpty' for example.

As with adding new rule to the set, it is also possible to modify existing rules
using the array interface::

    $validator = $this->validator();
    $validator['username']['unique'] = array(
        'rule' => 'isUnique',
        'required' => 'create'
    );

    $validator['username']['unique']->last = true;
    $validator['username']['unique']->message = 'Name already taken';


Removing rules from the set
---------------------------

.. versionadded:: 2.2

It is possible to both completely remove all rules for a field and to delete a
single rule in a field's rule set::

    // Completely remove all rules for a field
    $this->validator()->remove('username');

    // Remove 'required' rule from password
    $this->validator()->remove('password', 'required');

Optionally, you can use the array interface to delete rules from the set::

    $validator = $this->validator();
    // Completely remove all rules for a field
    unset($validator['username']);

    // Remove 'required' rule from password
    unset($validator['password']['required']);

.. _core-validation-rules:

Core Validation Rules
=====================

.. php:class:: Validation

The Validation class in CakePHP contains many validation rules that
can make model data validation much easier. This class contains
many oft-used validation techniques you won't need to write on your
own. Below, you'll find a complete list of all the rules, along
with usage examples.

.. php:staticmethod:: alphaNumeric(mixed $check)

    The data for the field must only contain letters and numbers. ::

        public $validate = array(
            'login' => array(
                'rule' => 'alphaNumeric',
                'message' => 'Usernames must only contain letters and numbers.'
            )
        );

.. php:staticmethod:: lengthBetween(string $check, integer $min, integer $max)

    The length of the data for the field must fall within the specified
    numeric range. Both minimum and maximum values must be supplied.
    Uses = not. ::

        public $validate = array(
            'password' => array(
                'rule'    => array('lengthBetween', 5, 15),
                'message' => 'Passwords must be between 5 and 15 characters long.'
            )
        );

    The data is checked by number of characters, not number of bytes.
    If you want to validate against pure ASCII input instead of UTF-8 compatible, 
    you will have to write your own custom validators.

.. php:staticmethod:: blank(mixed $check)

    This rule is used to make sure that the field is left blank or only
    white space characters are present in its value. White space
    characters include space, tab, carriage return, and newline. ::

        public $validate = array(
            'id' => array(
                'rule' => 'blank',
                'on' => 'create'
            )
        );


.. php:staticmethod:: boolean(string $check)

    The data for the field must be a boolean value. Valid values are
    true or false, integers 0 or 1 or strings '0' or '1'. ::

        public $validate = array(
            'myCheckbox' => array(
                'rule' => array('boolean'),
                'message' => 'Incorrect value for myCheckbox'
            )
        );


.. php:staticmethod:: cc(mixed $check, mixed $type = 'fast', boolean $deep = false, string $regex = null)

    This rule is used to check whether the data is a valid credit card
    number. It takes three parameters: 'type', 'deep' and 'regex'.

    The 'type' key can be assigned to the values of 'fast', 'all' or
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

    If 'type' is set to 'fast', it validates the data against the major
    credit cards' numbering formats. Setting 'type' to 'all' will check
    with all the credit card types. You can also set 'type' to an array
    of the types you wish to match.

    The 'deep' key should be set to a boolean value. If it is set to
    true, the validation will check the Luhn algorithm of the credit
    card
    (`http://en.wikipedia.org/wiki/Luhn\_algorithm <http://en.wikipedia.org/wiki/Luhn_algorithm>`_).
    It defaults to false.

    The 'regex' key allows you to supply your own regular expression
    that will be used to validate the credit card number::

        public $validate = array(
            'ccnumber' => array(
                'rule' => array('cc', array('visa', 'maestro'), false, null),
                'message' => 'The credit card number you supplied was invalid.'
            )
        );


.. php:staticmethod:: comparison(mixed $check1, string $operator = null, integer $check2 = null)

    Comparison is used to compare numeric values. It supports "is
    greater", "is less", "greater or equal", "less or equal", "equal
    to", and "not equal". Some examples are shown below::

        public $validate = array(
            'age' => array(
                'rule' => array('comparison', '>=', 18),
                'message' => 'Must be at least 18 years old to qualify.'
            )
        );

        public $validate = array(
            'age' => array(
                'rule' => array('comparison', 'greater or equal', 18),
                'message' => 'Must be at least 18 years old to qualify.'
            )
        );


.. php:staticmethod:: custom(mixed $check, string $regex = null)

    Used when a custom regular expression is needed::

        public $validate = array(
            'infinite' => array(
                'rule' => array('custom', '\u221E'),
                'message' => 'Please enter an infinite number.'
            )
        );


.. php:staticmethod:: date(string $check, mixed $format = 'ymd', string $regex = null)

    This rule ensures that data is submitted in valid date formats. A
    single parameter (which can be an array) can be passed that will be
    used to check the format of the supplied date. The value of the
    parameter can be one of the following:

    -  'dmy' e.g. 27-12-2006 or 27-12-06 (separators can be a space,
       period, dash, forward slash)
    -  'mdy' e.g. 12-27-2006 or 12-27-06 (separators can be a space,
       period, dash, forward slash)
    -  'ymd' e.g. 2006-12-27 or 06-12-27 (separators can be a space,
       period, dash, forward slash)
    -  'dMy' e.g. 27 December 2006 or 27 Dec 2006
    -  'Mdy' e.g. December 27, 2006 or Dec 27, 2006 (comma is optional)
    -  'My' e.g. (December 2006 or Dec 2006)
    -  'my' e.g. 12/2006 or 12/06 (separators can be a space, period,
       dash, forward slash)
    -  'ym' e.g. 2006/12 or 06/12 (separators can be a space, period,
       dash, forward slash)
    -  'y' e.g. 2006 (separators can be a space, period,
       dash, forward slash)

    If no keys are supplied, the default key that will be used is
    'ymd'::

        public $validate = array(
            'born' => array(
                'rule' => array('date', 'ymd'),
                'message' => 'Enter a valid date in YY-MM-DD format.',
                'allowEmpty' => true
            )
        );

    While many data stores require a certain date format, you might
    consider doing the heavy lifting by accepting a wide-array of date
    formats and trying to convert them, rather than forcing users to
    supply a given format. The more work you can do for your users, the
    better.

    .. versionchanged:: 2.4
        The ``ym`` and ``y`` formats were added.


.. php:staticmethod:: datetime(array $check, mixed $dateFormat = 'ymd', string $regex = null)

    This rule ensures that the data is a valid datetime format. A
    parameter (which can be an array) can be passed to specify the format
    of the date. The value of the parameter can be one or more of the
    following:

    -  'dmy' e.g. 27-12-2006 or 27-12-06 (separators can be a space,
       period, dash, forward slash)
    -  'mdy' e.g. 12-27-2006 or 12-27-06 (separators can be a space,
       period, dash, forward slash)
    -  'ymd' e.g. 2006-12-27 or 06-12-27 (separators can be a space,
       period, dash, forward slash)
    -  'dMy' e.g. 27 December 2006 or 27 Dec 2006
    -  'Mdy' e.g. December 27, 2006 or Dec 27, 2006 (comma is optional)
    -  'My' e.g. (December 2006 or Dec 2006)
    -  'my' e.g. 12/2006 or 12/06 (separators can be a space, period,
       dash, forward slash)

    If no keys are supplied, the default key that will be used is
    'ymd'::

        public $validate = array(
            'birthday' => array(
                'rule' => array('datetime', 'dmy'),
                'message' => 'Please enter a valid date and time.'
            )
        );

    Also a second parameter can be passed to specify a custom regular
    expression. If this parameter is used, this will be the only
    validation that will occur.

    Note that unlike date(), datetime() will validate a date and a time.

.. php:staticmethod:: decimal(string $check, integer $places = null, string $regex = null)

    This rule ensures that the data is a valid decimal number. A
    parameter can be passed to specify the number of digits required
    after the decimal point. If no parameter is passed, the data will
    be validated as a scientific float, which will cause validation to
    fail if no digits are found after the decimal point::

        public $validate = array(
            'price' => array(
                'rule' => array('decimal', 2)
            )
        );


.. php:staticmethod:: email(string $check, boolean $deep = false, string $regex = null)

    This checks whether the data is a valid email address. Passing a
    boolean true as the second parameter for this rule will also
    attempt to verify that the host for the address is valid::

        public $validate = array('email' => array('rule' => 'email'));

        public $validate = array(
            'email' => array(
                'rule' => array('email', true),
                'message' => 'Please supply a valid email address.'
            )
        );


.. php:staticmethod:: equalTo(mixed $check, mixed $compareTo)

    This rule will ensure that the value is equal to, and of the same
    type as the given value.

    ::

        public $validate = array(
            'food' => array(
                'rule' => array('equalTo', 'cake'),
                'message' => 'This value must be the string cake'
            )
        );

.. php:staticmethod:: extension(mixed $check, array $extensions = array('gif', 'jpeg', 'png', 'jpg'))

    This rule checks for valid file extensions like .jpg or .png. Allow
    multiple extensions by passing them in array form.

    ::

        public $validate = array(
            'image' => array(
                'rule' => array(
                    'extension',
                    array('gif', 'jpeg', 'png', 'jpg')
                ),
                'message' => 'Please supply a valid image.'
            )
        );

.. php:staticmethod:: fileSize($check, $operator = null, $size = null)

    This rule allows you to check filesizes. You can use ``$operator`` to
    decide the type of comparison you want to use. All the operators supported
    by :php:func:`~Validation::comparison()` are supported here as well. This
    method will automatically handle array values from ``$_FILES`` by reading
    from the ``tmp_name`` key if ``$check`` is an array and contains that key::

        public $validate = array(
            'image' => array(
                'rule' => array('fileSize', '<=', '1MB'),
                'message' => 'Image must be less than 1MB'
            )
        );

    .. versionadded:: 2.3
        This method was added in 2.3

.. php:staticmethod:: inList(string $check, array $list, boolean $caseInsensitive = false)

    This rule will ensure that the value is in a given set. It needs an
    array of values. The field is valid if the field's value matches
    one of the values in the given array.

    Example::

        public $validate = array(
            'function' => array(
                 'allowedChoice' => array(
                     'rule' => array('inList', array('Foo', 'Bar')),
                     'message' => 'Enter either Foo or Bar.'
                 )
             )
         );

    Comparison is case sensitive by default. You can set ``$caseInsensitive`` to true
    if you need case insensitive comparison.

.. php:staticmethod:: ip(string $check, string $type = 'both')

    This rule will ensure that a valid IPv4 or IPv6 address has been
    submitted. Accepts as option 'both' (default), 'IPv4' or 'IPv6'.

    ::

        public $validate = array(
            'clientip' => array(
                'rule' => array('ip', 'IPv4'), // or 'IPv6' or 'both' (default)
                'message' => 'Please supply a valid IP address.'
            )
        );


.. php:method:: Model::isUnique()

    The data for the field must be unique, it cannot be used by any
    other rows::

        public $validate = array(
            'login' => array(
                'rule' => 'isUnique',
                'message' => 'This username has already been taken.'
            )
        );

    You can validate that a set of fields are unique by providing multiple
    fields and set ``$or`` to ``false``::

        public $validate = array(
            'email' => array(
                'rule' => array('isUnique', array('email', 'username'), false),
                'message' => 'This username & email combination has already been used.'
            )
        );

    Make sure to include the original field in the list of fields when making
    a unique rule across multiple fields.

    If a listed field isn't included in the model data, then it's treated as a null value.
    You may consider marking the listed fields as ``required``.

.. php:staticmethod:: luhn(string|array $check, boolean $deep = false)

    The Luhn algorithm: A checksum formula to validate a variety of
    identification numbers. See http://en.wikipedia.org/wiki/Luhn_algorithm for
    more information.


.. php:staticmethod:: maxLength(string $check, integer $max)

    This rule ensures that the data stays within a maximum length
    requirement::

        public $validate = array(
            'login' => array(
                'rule' => array('maxLength', 15),
                'message' => 'Usernames must be no larger than 15 characters long.'
            )
        );

    This will ensure that the 'login' field is less than or equal to 15
    characters, not 15 bytes.

.. php:staticmethod:: mimeType(mixed $check, array|string $mimeTypes)

    .. versionadded:: 2.2

    This rule checks for valid mime types. Comparison is case sensitive.

    .. versionchanged:: 2.5

    Since 2.5 ``$mimeTypes`` can be a regex string.

    ::

        public $validate = array(
            'image' => array(
                'rule' => array('mimeType', array('image/gif')),
                'message' => 'Invalid mime type.'
            ),
            'logo' => array(
                'rule' => array('mimeType', '#image/.+#'),
                'message' => 'Invalid mime type.'
            ),
        );

.. php:staticmethod:: minLength(string $check, integer $min)

    This rule ensures that the data meets a minimum length
    requirement::

        public $validate = array(
            'login' => array(
                'rule' => array('minLength', 8),
                'message' => 'Usernames must be at least 8 characters long.'
            )
        );

    The length here is number of characters, not the number of bytes.
    If you want to validate against pure ASCII input instead of UTF-8 compatible, 
    you will have to write your own custom validators.

.. php:staticmethod:: money(string $check, string $symbolPosition = 'left')

    This rule will ensure that the value is in a valid monetary
    amount.

    Second parameter defines where symbol is located (left/right).

    ::

        public $validate = array(
            'salary' => array(
                'rule' => array('money', 'left'),
                'message' => 'Please supply a valid monetary amount.'
            )
        );

.. php:staticmethod:: multiple(mixed $check, mixed $options = array(), boolean $caseInsensitive = false)

    Use this for validating a multiple select input. It supports
    parameters "in", "max" and "min".

    ::

        public $validate = array(
            'multiple' => array(
                'rule' => array('multiple', array(
                    'in'  => array('do', 're', 'mi', 'fa', 'sol', 'la', 'ti'),
                    'min' => 1,
                    'max' => 3
                )),
                'message' => 'Please select one, two or three options'
            )
        );

    Comparison is case sensitive by default. You can set ``$caseInsensitive`` to true
    if you need case insensitive comparison.

.. php:staticmethod:: notEmpty(mixed $check)

    .. deprecated:: 2.7

    Use ``notBlank`` instead.

.. php:staticmethod:: notBlank(mixed $check)

    .. versionadded:: 2.7

    The basic rule to ensure that a field is not empty. ::

        public $validate = array(
            'title' => array(
                'rule' => 'notBlank',
                'message' => 'This field cannot be left blank'
            )
        );

    Do not use this for a multiple select input as it will cause an
    error. Instead, use "multiple".


.. php:staticmethod:: numeric(string $check)

    Checks if the data passed is a valid number. ::

        public $validate = array(
            'cars' => array(
                'rule' => 'numeric',
                'message' => 'Please supply the number of cars.'
            )
        );

.. php:staticmethod:: naturalNumber(mixed $check, boolean $allowZero = false)

    .. versionadded:: 2.2

    This rule checks if the data passed is a valid natural number.
    If ``$allowZero`` is set to true, zero is also accepted as a value.

    ::

        public $validate = array(
            'wheels' => array(
                'rule' => 'naturalNumber',
                'message' => 'Please supply the number of wheels.'
            ),
            'airbags' => array(
                'rule' => array('naturalNumber', true),
                'message' => 'Please supply the number of airbags.'
            ),
        );


.. php:staticmethod:: phone(mixed $check, string $regex = null, string $country = 'all')

    Phone validates US phone numbers. If you want to validate non-US
    phone numbers, you can provide a regular expression as the second
    parameter to cover additional number formats.

    ::

        public $validate = array(
            'phone' => array(
                'rule' => array('phone', null, 'us')
            )
        );

.. php:staticmethod:: postal(mixed $check, string $regex = null, string $country = 'us')

    Postal is used to validate ZIP codes from the U.S. (us), Canada
    (ca), U.K (uk), Italy (it), Germany (de) and Belgium (be). For
    other ZIP code formats, you may provide a regular expression as the
    second parameter.

    ::

        public $validate = array(
            'zipcode' => array(
                'rule' => array('postal', null, 'us')
            )
        );


.. php:staticmethod:: range(string $check, integer $lower = null, integer $upper = null)

    This rule ensures that the value is in a given range. If no range
    is supplied, the rule will check to ensure the value is a legal
    finite on the current platform.

    ::

        public $validate = array(
            'number' => array(
                'rule' => array('range', -1, 11),
                'message' => 'Please enter a number between -1 and 11'
            )
        );

    The above example will accept any value which is larger than -1
    (e.g., -0.99) and less than 11 (e.g., 10.99).

    .. note::

        The range lower/upper are not inclusive


.. php:staticmethod:: ssn(mixed $check, string $regex = null, string $country = null)

    Ssn validates social security numbers from the U.S. (us), Denmark
    (dk), and the Netherlands (nl). For other social security number
    formats, you may provide a regular expression.

    ::

        public $validate = array(
            'ssn' => array(
                'rule' => array('ssn', null, 'us')
            )
        );

.. php:staticmethod:: time(string $check)

    Time validation, determines if the string passed is a valid time. Validates
    time as 24hr (HH:MM) or am/pm ([H]H:MM[a|p]m) Does not allow/validate
    seconds.

.. php:staticmethod:: uploadError(mixed $check)

    .. versionadded:: 2.2

    This rule checks if a file upload has an error.

    ::

        public $validate = array(
            'image' => array(
                'rule' => 'uploadError',
                'message' => 'Something went wrong with the upload.'
            ),
        );

.. php:staticmethod:: url(string $check, boolean $strict = false)

    This rule checks for valid URL formats. Supports http(s), ftp(s),
    file, news, and gopher protocols::

        public $validate = array(
            'website' => array(
                'rule' => 'url'
            )
        );

    To ensure that a protocol is in the url, strict mode can be enabled
    like so::

        public $validate = array(
            'website' => array(
                'rule' => array('url', true)
            )
        );

    This validation method uses a complex regular expression that can sometimes
    cause issues with Apache2 on Windows using mod\_php.


.. php:staticmethod:: userDefined(mixed $check, object $object, string $method, array $args = null)

    Runs an user-defined validation.


.. php:staticmethod:: uuid(string $check)

    Checks that a value is a valid UUID: http://tools.ietf.org/html/rfc4122


Localized Validation
====================

The validation rules phone() and postal() will pass off any country prefix
they do not know how to handle to another class with the appropriate name. For
example if you lived in the Netherlands you would create a class like::

    class NlValidation {
        public static function phone($check) {
            // ...
        }
        public static function postal($check) {
            // ...
        }
    }

This file could be placed in ``APP/Validation/`` or
``App/PluginName/Validation/``, but must be imported via App::uses() before
attempting to use it. In your model validation you could use your NlValidation
class by doing the following::

    public $validate = array(
        'phone_no' => array('rule' => array('phone', null, 'nl')),
        'postal_code' => array('rule' => array('postal', null, 'nl')),
    );

When your model data is validated, Validation will see that it cannot handle
the ``nl`` locale and will attempt to delegate out to
``NlValidation::postal()`` and the return of that method will be used as the
pass/fail for the validation. This approach allows you to create classes that
handle a subset or group of locales, something that a large switch would not
have. The usage of the individual validation methods has not changed, the
ability to pass off to another validator has been added.

.. tip::

    The Localized Plugin already contains a lot of rules ready to use:
    https://github.com/cakephp/localized
    Also feel free to contribute with your localized validation rules.

.. toctree::
    :maxdepth: 1

    data-validation/validating-data-from-the-controller


.. meta::
    :title lang=en: Data Validation
    :keywords lang=en: validation rules,validation data,validation errors,data validation,credit card numbers,core libraries,password email,model fields,login field,model definition,php class,many different aspects,eight characters,letters and numbers,business rules,validation process,date validation,error messages,array,formatting
