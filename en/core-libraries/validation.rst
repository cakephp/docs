.. php:namespace:: Cake\Validation

Validation
##########

The validation package in CakePHP provides features to build validators that can
validate arbitrary arrays of data with ease.

Creating Validators
===================

.. php:class:: Validator

Validator objects define the rules that apply to a set of fields.
Validator objects contain a mapping between fields and validation sets. In turn, the
validation sets contain a collection of rules that apply to the field they are
attached to. Creating a validator is simple::

    use Cake\Validation\Validator;

    $validator = new Validator();

Once created, you can start defining sets of rules for the fields you want to
validate::

    $validator
        ->validatePresence('title')
        ->notEmpty('title', 'Please fill this field')
        ->add('title', [
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

As seen in the example above, validators are built with a fluent interface that
allows you to define rules for each field you want to validate.

There were a few methods called in the example above, so let's go over the
various features. The ``add()`` method allows you to add new rules to
a validator. You can either add rules individually or in groups as seen above.

Validating Field Presence
-------------------------

The ``validatePresence()`` method requires the field to be present in any
validated array. If the field is absent, validation will fail. The
``validatePresence()`` method has 4 modes:

* ``true`` The field's presence is always required.
* ``false`` The field's presence is not required.
* ``create`` The field's presence is required when validating a **create**
  operation.
* ``update`` The field's presence is required when validating an **update**
  operation.

By default, ``true`` is used. Key presence is checked by using
``array_key_exists()`` so that null values will count as present. You can set the
mode using the second parameter::

    $validator->validatePresence('author_id', 'create');

Allowing Empty Fields
---------------------

The ``allowEmpty()`` and ``notEmpty()`` methods allow you to control which fields are
allowed to be 'empty'. By using the ``notEmpty()`` method, the given field will be marked
invalid when it is empty. You can use ``allowEmpty()`` to allow a field to be
empty. Both ``allowEmpty()`` and ``notEmpty()`` support a mode parameter that
allows you to control when a field can or cannot be empty:

* ``false`` The field is not allowed to be empty.
* ``create`` The field is required when validating a **create**
  operation.
* ``update`` The field is required when validating an **update**
  operation.

The values ``''``, ``null`` and ``[]`` (empty array) will cause validation
errors when fields are not allowed to be empty.  When fields are allowed to be
empty, the values ``''``, ``null``, ``false``, ``[]``, ``0``, ``'0'`` are
accepted.

An example of these methods in action is::

    $validator->allowEmpty('published')
        ->notEmpty('title', 'A title is required')
        ->notEmpty('body', 'A title is required', 'create')
        ->allowEmpty('header_image', 'update');

Unique Fields
-------------

The ``Table`` class provides a validation rule to ensure that a given field
is unique within a table. For example, if you wanted to make sure that an e-mail
address is unique, you could do the following::

    $validator->add('email', [
        'unique' => ['rule' => 'validateUnique', 'provider' => 'table']
    ]);

If you wish to only ensure uniqueness of a field based on an another field in
your table, such as a foreign key of an associated table, you can scope it with
the following::

    $validator->add('email', [
        'unique' => [
            'rule' => ['validateUnique', ['scope' => 'site_id']],
            'provider' => 'table'
        ]
    ]);

This will ensure that the provided e-mail address is only unique to other 
records with the same ``site_id``.

Notice that these examples take a ``provider`` key.  Adding ``Validator``
providers is further explained in the following sections.

Marking Rules as the Last to Run
--------------------------------

When fields have multiple rules, each validation rule will be run even if the
previous one has failed. This allows you to collect as many validation errors as
you can in a single pass. However, if you want to stop execution after
a specific rule has failed, you can set the ``last`` option to ``true``::

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

If the minLength rule fails in the example above, the maxLength rule will not be
run.

Adding Validation Providers
---------------------------

The ``Validator``, ``ValidationSet`` and ``ValidationRule`` classes do not
provide any validation methods themselves. Validation rules come from
'providers'. You can bind any number of providers to a Validator object.
Validator instances come with a 'default' provider setup automatically. The
default provider is mapped to the :php:class:`~Cake\\Validation\\Validation`
class. This makes it simple to use the methods on that class as validation
rules. When using Validators and the ORM together, additional providers are
configured for the table and entity objects. You can use the ``provider`` method
to add any additional providers your application needs::

    $validator = new Validator();

    // Use an object instance.
    $validator->provider('custom', $myObject);

    // Use a class name. Methods must be static.
    $validator->provider('custom', 'App\Model\Validation');

Validation providers can be objects, or class names. If a class name is used the
methods must be static. To use a provider other than 'default', be sure to set
the ``provider`` key in your rule::

    // Use a rule from the table provider
    $validator->add('title', 'unique', [
        'rule' => 'uniqueTitle',
        'provider' => 'table'
    ]);

Custom Validation Rules
-----------------------

In addition to using methods coming from providers, you can also use any
callable, including anonymous functions, as validation rules::

    // Use a global function
    $validator->add('title', 'custom', [
        'rule' => 'validate_title'
    ]);

    // Use an array callable that is not in a provider
    $validator->add('title', 'custom', [
        'rule' => [$this, 'method']
    ]);

    // Use a closure
    $validator->add('title', 'custom', [
        'rule' => function($value, $context) {
            // Custom logic that returns true/false
        }
    ]);

Closures or callable methods will receive 2 arguments when called. The first
will be the value for the field being validated. The second is a context array
containing data related to the validation process:

- **data**: The original data passed to the validation method, useful if you
  plan to create rules comparing values.
- **providers**: The complete list of rule provider objects, useful if you
  need to create complex rules by calling multiple providers.
- **newRecord**: Whether the validation call is for a new record or
  a pre-existent one.

Conditional Validation
----------------------

When defining validation rules, you can use the ``on`` key to define when
a validation rule should be applied. If left undefined, the rule will always be
applied. Other valid values are ``create`` and ``update``. Using one of these
values will make the rule apply to only create or update operations.

Additionally, you can provide a callable function that will determine whether or
not a particular rule should be applied::

    $validator->add('picture', 'file', [
        'rule' => ['mimeType', ['image/jpeg', 'image/png']],
        'on' => function($context) {
            return !empty($context['data']['show_profile_picture']);
        }
    ]);

The above example will make the rule for 'picture' optional depending on whether
the value for ``show_profile_picture`` is empty.

The same can be done for the ``allowEmpty()`` and ``notEmpty`` validation method.
Both take a callable function as the last argument, which determines whether or not
the rule should be applied. For example, a field can be sometimes allowed to be
empty::

    $validator->allowEmpty('tax', function($context) {
        return !$context['data']['is_taxable'];
    });

Likewise, a field can be required to be populated when certain conditions are
met::

    $validator->notEmpty('email_frequency', 'This field is required', function($context) {
        return !empty($context['data']['wants_newsletter']);
    });

In the above example, the ``email_frequency`` field cannot be left empty if the
the user wants to receive the newsletter.

.. _reusable-validators:

Creating Reusable Validators
----------------------------

While defining validators inline where they are used makes for good example
code, it doesn't lead to easily maintainable applications. Instead, you should
create ``Validator`` sub-classes for your reusable validation logic::

    // In src/Model/Validation/ContactValidator.php
    namespace App\Model\Validation;

    use Cake\Validation\Validator;

    class ContactValidator extends Validator {
        public function __construct() {
            // Add validation rules here.
        }
    }

Validating Data
===============

Now that you've created a validator and added the rules you want to it, you can
start using it to validate data. Validators are able to validate array based
data. For example, if you wanted to validate a contact form before creating and
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
        ->notEmpty('name', 'We need your name.')
        ->validatePresence('comment')
        ->notEmpty('comment', 'You need to give a comment.');

    $errors = $validator->errors($this->request->data());
    if (!empty($errors)) {
        // Send an email.
    }

The ``errors()`` method will return a non-empty array when there are validation
failures. The returned array of errors will be structured like::

    $errors = [
        'email' => ['E-mail must be valid']
    ];

If you have multiple errors on a single field, an array of error messages will
be returned per field. By default the ``errors()`` method applies rules for
the 'create' mode. If you'd like to apply 'update' rules you can do the following::

    $errors = $validator->errors($this->request->data(), false);
    if (!empty($errors)) {
        // Send an email.
    }

.. note::

    If you need to validate entities you should use methods like
    :php:meth:`~Cake\\ORM\\Table::validate()` or
    :php:meth:`~Cake\\ORM\\Table::save()` as they are designed for that.

Core Validation Rules
=====================

CakePHP provides a basic suite of validation methods in the ``Validation``
class. The Validation class contains a variety of static methods that provide
validators for a several common validation situations.

The `API documentation
<http://api.cakephp.org/3.0/class-Cake.Validation.Validation.html>`_ for the
``Validation`` class provides a good list of the validation rules that are
available, and their basic usage.

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

Core rules that take additional parameters should have an array for the ``rule`` key
that contains the rule as the first element, and the additional parameters as
the remaining parameters.
