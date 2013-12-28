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

Validating data
===============

* Using errors()



Validation rules
================

* Core validation class.
* Validation providers.
