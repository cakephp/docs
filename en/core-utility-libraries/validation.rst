.. php:namespace:: Cake\Validation

Validation
##########

The validation package in CakePHP provides features to build validators that can
validate arbitrary arrays of data with ease.

Creating validators
===================

.. php:class:: Validator

Validator objects are used to define the rules that apply to a set of fields.
Validator objects contain a mapping of field to validation sets. In turn the
validation sets contain a collection of rules that apply to the relevant field
data. Creating a validator is simple::

    use Cake\Validation\Validator;

    $validator = new Validator();

Once created you can start defining sets of rules for the fields you want to
validate::

    $validator
        ->validatePresence('title')
        ->add('title', [
            'notEmpty' => [
                'rule' => 'notEmpty'
            ]
            'length' => [
                'rule' => ['minLength', 10],
                'message' => 'Titles need to be at least 10 characters long',
            ]
        ])
        ->allowEmpty('published')
        ->add('published', 'boolean', [
            'rule' => 'boolean'
        ])
        ->validatePresence('body')
        ->add('body', 'length', [
            'rule' => ['minLength', 50],
            'message' => 'Articles must have a substantial body.'
        ]);

As seen in the example above validators are built with a fluent interface that
allows you to define rules for each field you want to validate.

There were a few methods called in the example above, so lets go over each one.
The ``add()`` method allows you to add new rules to a validator. You can either
add rules individually or in groups as seen above.

Defining conditions for validator
---------------------------------

When defining validation rules, you can use the ``on`` key to define when
a validation rule should apply. If left undefined the rule will always be
defined. Other valid values are ``create`` and ``update``. Using one of these
values will make the rule only apply to either create or update operations.

Marking rules as the last to run
--------------------------------

In case of multiple rules per field each validation rule will be run by default.
If however, you want to stop execution after a specific rule has failed you can
set the ``last`` option to ``true``::

    $validator = new Validator();
    $validator
        ->add('body', [
            'minLength' => [
                'rule' => ['minLength', 10],
                'last' => true,
                'message' => 'Comments must have a substantial body.'
            ],
            'maxLength' => [
                'rule' => ['maxLength', 250],
                'message' => 'Comments cannot be too long.'
            ]
        ]);

In the above example if the minLength rule fails, the maxLength rule will not be
run.

Validating field presence
-------------------------

The ``validatePresence()`` method requires the field to be present in any
validated array. If the field is absent validation will fail. The
``validatePresence()`` method has 3 modes:

* ``true`` The field is always required.
* ``create`` The field is required when validation is for a **create**
  operation.
* ``update`` The field is require when validation is for an **update**
  operation.

By default ``true`` is used. Key presence is checked for using
``array_key_exists()`` so null values will count as present.

Allowing empty fields
---------------------

The ``allowEmpty`` method indicates that if a field is 'empty' other validation
rules should be skipped as empty values are accepted. The ``allowEmpty()``
method has 3 modes:

* ``true`` The field is always required.
* ``create`` The field is required when validation is for a **create**
  operation.
* ``update`` The field is require when validation is for an **update**
  operation.

By default ``true`` is used. The values ``''``, ``null`` and ``[]`` (empty
array) will cause validation errors when fields are not allowed to be empty.
When fields are allowed to be empty, the values ``''``, ``null``, ``false``,
``[]``, ``0``, ``'0'`` are accepted.

Adding validation providers
---------------------------

The ``Validator``, ``ValidationSet`` and ``ValidationRule`` classes do not provide any
validation methods themselves. Validation rules come from 'providers'. You can
bind any number of providers to a Validator object. By default a 'default'
provider is configured to the :php:class:`~Cake\\Validation\\Validation` class
so that you can easily use the methods on that class. When using the Validators
with the ORM, additional providers are configured for the table and entity
objects. Use the ``provider`` method to add new providers::

    $validator = new Validator();

    // Use an object instance.
    $validator->provider('custom', $myObject);

    // Use a class name. Methods must be static.
    $validator->provider('custom', 'App\Model\Validation');

Validation providers can be objects, or class names. If a class name is used the
methods must be static. When defining rules, you will need to define the
provider when it is not ``default``::

    // Use a rule from the table provider
    $validator->add('title', 'unique', [
        'rule' => 'uniqueTitle',
        'provider' => 'table'
    ]);

Creating re-usable validators
-----------------------------

While defining validators inline where they are used makes for good example
code, it doesn't lead to easily maintainable applications. You can make
re-usable validators by creating ``Validator`` sub-classes::

    <?php
    // In App/Model/Validation/ContactValidator.php
    namespace App\Model\Validation;

    use Cake\Validation\Validator;

    class ContactValidator extends Validator {
        public function __construct() {
            // Add validation rules here.
        }
    }

Validating data
===============

Now that you've created a validator and added the rules you want to it, you can
start using it to validate data. Validators are able to validate array based
data. For example if you wanted to validate a contact form before creating and
sending an email you could do the following::

    use Cake\Validation\Validator;

    $validator = new Validator();
    $validator
        ->validatePresence('email')
        ->add('email', 'validFormat', [
            'rule' => 'email',
            'message' => 'E-mail must be valid'
        ])
        ->validatePresence('name')
        ->add('name', 'notEmpty', [
            'rule' => 'notEmpty',
            'message' => 'We need your name.'
        ])
        ->validatePresence('comment')
        ->add('name', 'notEmpty', [
            'rule' => 'notEmpty',
            'message' => 'You need to give a comment.'
        ]);

    $errors = $validator->errors($this->request->data());
    if (!empty($errors)) {
        // Send an email.
    }

The ``errors()`` method will return an non-empty array when there are validation
failures. The returnned array of errors will be structured like::

    $errors = [
        'email' => ['E-mail must be valid']
    ];

If you have multiple errors on a single field, an array of error messages will
be returned per field. By default the ``errors()`` method applies rules for
'create' mode. If you'd like to apply 'update' rules you can do the following::

    $errors = $validator->errors($this->request->data(), false);
    if (!empty($errors)) {
        // Send an email.
    }

.. note::

    If you need to validate entities you should use methods like
    :php:method:`~Cake\\ORM\\Table::validate()` or
    :php:method:`~Cake\\ORM\\Table::save()` as they are designed for that.

Core Validation rules
=====================

CakePHP provides a set of Validation methods in the ``Validation`` class. It is
a collection of static methods that provide validators for a number of common
validation situations.

The `API documentation
<http://api.cakephp.org/3.0/class-Cake.Validation.Validation.html>`_ for the
``Validation`` class provides a good list of the validation rules that are
available.

Some of the validation methods accept additional parameters to define boundary
conditions or valid options. You can provide these boundary conditions & options
as follows::

    $validator = new Validator();
    $validator
        ->add('title', 'minLength', [
            'rule' => ['minLength', 10]
        ])
        ->add('rating', 'validValue', [
            'rule' => ['between', 1, 5]
        ]);

Rules that take additional parameters should have an array for the ``rule`` key
that contains the rule as the first element, and the additional parameters as
the remaining parameters.
