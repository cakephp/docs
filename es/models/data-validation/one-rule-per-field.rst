One Rule Per Field
------------------------

This definition technique allows for better control of how the
validation rules work. But before we discuss that, let’s see the
general usage pattern adding a rule for a single field:

::

    var $validate = array(
        'fieldName1' => array(
            'rule' => 'ruleName', // or: array('ruleName', 'param1', 'param2' ...)
            'required' => true,
            'allowEmpty' => false,
            'on' => 'create', // or: 'update'
            'message' => 'Your Error Message'
        )
    );

The 'rule' key is required. If you only set 'required' => true, the
form validation will not function correctly. This is because
'required' is not actually a rule.

As you can see here, each field (only one field shown above) is
associated with an array that contains five keys: ‘rule’,
‘required’, ‘allowEmpty’, ‘on’ and ‘message’. Let’s have a closer
look at these keys.

rule
~~~~

The 'rule' key defines the validation method and takes either a
single value or an array. The specified 'rule' may be the name of a
method in your model, a method of the core Validation class, or a
regular expression. For more information on the rules available by
default, see
:ref:`core-validation-rules`.

If the rule does not require any parameters, 'rule' can be a single
value e.g.:

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric'
        )
    );

If the rule requires some parameters (like the max, min or range),
'rule' should be an array:

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8)
        )
    );

Remember, the 'rule' key is required for array-based rule
definitions.

required
~~~~~~~~

This key should be assigned to a boolean value. If ‘required’ is
true, the field must be present in the data array. For example, if
the validation rule has been defined as follows:

::

    var $validate = array(
        'login' => array(
            'rule' => 'alphaNumeric',
            'required' => true
        )
    );

The data sent to the model’s save() method must contain data for
the login field. If it doesn’t, validation will fail. The default
value for this key is boolean false.

``required => true`` does not mean the same as the validation rule
``notEmpty()``. ``required => true`` indicates that the array *key*
must be present - it does not mean it must have a value. Therefore
validation will fail if the field is not present in the dataset,
but may (depending on the rule) succeed if the value submitted is
empty ('').

allowEmpty
~~~~~~~~~~

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
~~

The ‘on’ key can be set to either one of the following values:
‘update’ or ‘create’. This provides a mechanism that allows a
certain rule to be applied either during the creation of a new
record, or during update of a record.

If a rule has defined ‘on’ => ‘create’, the rule will only be
enforced during the creation of a new record. Likewise, if it is
defined as ‘on’ => ‘update’, it will only be enforced during the
updating of a record.

The default value for ‘on’ is null. When ‘on’ is null, the rule
will be enforced during both creation and update.

message
~~~~~~~

The ‘message’ key allows you to define a custom validation error
message for the rule:

::

    var $validate = array(
        'password' => array(
            'rule' => array('minLength', 8),
            'message' => 'Password must be at least 8 characters long'
        )
    );
