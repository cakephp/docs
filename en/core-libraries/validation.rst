Validation
##########

.. php:namespace:: Cake\Validation

The validation package in CakePHP provides features to build validators that can
validate arbitrary arrays of data with ease. You can find a `list of available
Validation rules in the API
<https://api.cakephp.org/3.x/class-Cake.Validation.Validation.html>`__.

.. _creating-validators:

Creating Validators
===================

.. php:class:: Validator

Validator objects define the rules that apply to a set of fields.
Validator objects contain a mapping between fields and validation sets. In
turn, the validation sets contain a collection of rules that apply to the field
they are attached to. Creating a validator is simple::

    use Cake\Validation\Validator;

    $validator = new Validator();

Once created, you can start defining sets of rules for the fields you want to
validate::

    $validator
        ->requirePresence('title')
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
        ->requirePresence('body')
        ->add('body', 'length', [
            'rule' => ['minLength', 50],
            'message' => 'Articles must have a substantial body.'
        ]);

As seen in the example above, validators are built with a fluent interface that
allows you to define rules for each field you want to validate.

There were a few methods called in the example above, so let's go over the
various features. The ``add()`` method allows you to add new rules to
a validator. You can either add rules individually or in groups as seen above.

Requiring Field Presence
------------------------

The ``requirePresence()`` method requires the field to be present in any
validated array. If the field is absent, validation will fail. The
``requirePresence()`` method has 4 modes:

* ``true`` The field's presence is always required.
* ``false`` The field's presence is not required.
* ``create`` The field's presence is required when validating a **create**
  operation.
* ``update`` The field's presence is required when validating an **update**
  operation.

By default, ``true`` is used. Key presence is checked by using
``array_key_exists()`` so that null values will count as present. You can set
the mode using the second parameter::

    $validator->requirePresence('author_id', 'create');

If you have multiple fields that are required, you can define them as a list::

    // Define multiple fields for create
    $validator->requirePresence(['author_id', 'title'], 'create');

    // Define multiple fields for mixed modes
    $validator->requirePresence([
        'author_id' => [
            'mode' => 'create',
            'message' => 'An author is required.',
        ],
        'published' => [
            'mode' => 'update',
            'message' => 'The published state is required.',
        ]
    ]);

.. versionadded:: 3.3.0
    ``requirePresence()`` accepts an array of fields as of 3.3.0

Allowing Empty Fields
---------------------

The ``allowEmpty()`` and ``notEmpty()`` methods allow you to control which
fields are allowed to be 'empty'. By using the ``notEmpty()`` method, the given
field will be marked invalid when it is empty. You can use ``allowEmpty()`` to
allow a field to be empty. Both ``allowEmpty()`` and ``notEmpty()`` support a
mode parameter that allows you to control when a field can or cannot be empty:

* ``false`` The field is not allowed to be empty.
* ``create`` The field can be empty when validating a **create**
  operation.
* ``update`` The field can be empty when validating an **update**
  operation.

The values ``''``, ``null`` and ``[]`` (empty array) will cause validation
errors when fields are not allowed to be empty.  When fields are allowed to be
empty, the values ``''``, ``null``, ``false``, ``[]``, ``0``, ``'0'`` are
accepted.

An example of these methods in action is::

    $validator->allowEmpty('published')
        ->notEmpty('title', 'Title cannot be empty')
        ->notEmpty('body', 'Body cannot be empty', 'create')
        ->allowEmpty('header_image', 'update');

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

Validation Methods Less Verbose
-------------------------------

Since 3.2, the Validator object has a number of new methods that make building
validators less verbose. For example adding validation rules to a username field
can now look like::

    $validator = new Validator();
    $validator
        ->email('username')
        ->ascii('username')
        ->lengthBetween('username', [4, 8]);

Adding Validation Providers
---------------------------

The ``Validator``, ``ValidationSet`` and ``ValidationRule`` classes do not
provide any validation methods themselves. Validation rules come from
'providers'. You can bind any number of providers to a Validator object.
Validator instances come with a 'default' provider setup automatically. The
default provider is mapped to the :php:class:`~Cake\\Validation\\Validation`
class. This makes it simple to use the methods on that class as validation
rules. When using Validators and the ORM together, additional providers are
configured for the table and entity objects. You can use the ``setProvider()``
method to add any additional providers your application needs::

    $validator = new Validator();

    // Use an object instance.
    $validator->setProvider('custom', $myObject);

    // Use a class name. Methods must be static.
    $validator->setProvider('custom', 'App\Model\Validation');

Validation providers can be objects, or class names. If a class name is used the
methods must be static. To use a provider other than 'default', be sure to set
the ``provider`` key in your rule::

    // Use a rule from the table provider
    $validator->add('title', 'custom', [
        'rule' => 'customTableMethod',
        'provider' => 'table'
    ]);

If you wish to add a ``provider`` to all ``Validator`` objects that are created
in the future, you can use the ``addDefaultProvider()`` method as follows::

    use Cake\Validation\Validator;

    // Use an object instance.
    Validator::addDefaultProvider('custom', $myObject);

    // Use a class name. Methods must be static.
    Validator::addDefaultProvider('custom', 'App\Model\Validation');

.. note::

    DefaultProviders must be added before the ``Validator`` object is created
    therefore **config/bootstrap.php** is the best place to set up your
    default providers.

.. versionadded:: 3.5.0

You can use the `Localized plugin <https://github.com/cakephp/localized>`_ to
get providers based on countries. With this plugin, you'll be able to validate
model fields, depending on a country, ie::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class PostsTable extends Table
    {
        public function validationDefault(Validator $validator)
        {
            // add the provider to the validator
            $validator->setProvider('fr', 'Localized\Validation\FrValidation');
            // use the provider in a field validation rule
            $validator->add('phoneField', 'myCustomRuleNameForPhone', [
                'rule' => 'phone',
                'provider' => 'fr'
            ]);

            return $validator;
        }
    }

The localized plugin uses the two letter ISO code of the countries for
validation, like en, fr, de.

There are a few methods that are common to all classes, defined through the
`ValidationInterface interface <https://github.com/cakephp/localized/blob/master/src/Validation/ValidationInterface.php>`_::

    phone() to check a phone number
    postal() to check a postal code
    personId() to check a country specific person ID

Custom Validation Rules
-----------------------

In addition to using methods coming from providers, you can also use any
callable, including anonymous functions, as validation rules::

    // Use a global function
    $validator->add('title', 'custom', [
        'rule' => 'validate_title',
        'message' => 'The title is not valid'
    ]);

    // Use an array callable that is not in a provider
    $validator->add('title', 'custom', [
        'rule' => [$this, 'method'],
        'message' => 'The title is not valid'
    ]);

    // Use a closure
    $extra = 'Some additional value needed inside the closure';
    $validator->add('title', 'custom', [
        'rule' => function ($value, $context) use ($extra) {
            // Custom logic that returns true/false
        },
        'message' => 'The title is not valid'
    ]);

    // Use a rule from a custom provider
    $validator->add('title', 'custom', [
        'rule' => 'customRule',
        'provider' => 'custom',
        'message' => 'The title is not unique enough'
    ]);

Closures or callable methods will receive 2 arguments when called. The first
will be the value for the field being validated. The second is a context array
containing data related to the validation process:

- **data**: The original data passed to the validation method, useful if you
  plan to create rules comparing values.
- **providers**: The complete list of rule provider objects, useful if you
  need to create complex rules by calling multiple providers.
- **newRecord**: Whether the validation call is for a new record or
  a preexisting one.

If you need to pass additional data to your validation methods such as the
current user's id, you can use a custom dynamic provider from your controller. ::

    $this->Examples->validator('default')->provider('passed', [
        'count' => $countFromController,
        'userid' => $this->Auth->user('id')
    ]);

Then ensure that your validation method has the second context parameter. ::

    public function customValidationMethod($check, array $context)
    {
        $userid = $context['providers']['passed']['userid'];
    }

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
        'on' => function ($context) {
            return !empty($context['data']['show_profile_picture']);
        }
    ]);

You can access the other submitted field values using the ``$context['data']``
array.
The above example will make the rule for 'picture' optional depending on whether
the value for ``show_profile_picture`` is empty. You could also use the
``uploadedFile`` validation rule to create optional file upload inputs::

    $validator->add('picture', 'file', [
        'rule' => ['uploadedFile', ['optional' => true]],
    ]);

The ``allowEmpty()``, ``notEmpty()`` and ``requirePresence()`` methods will also
accept a callback function as their last argument. If present, the callback
determines whether or not the rule should be applied. For example, a field is
sometimes allowed to be empty::

    $validator->allowEmpty('tax', function ($context) {
        return !$context['data']['is_taxable'];
    });

Likewise, a field can be required to be populated when certain conditions are
met::

    $validator->notEmpty('email_frequency', 'This field is required', function ($context) {
        return !empty($context['data']['wants_newsletter']);
    });

In the above example, the ``email_frequency`` field cannot be left empty if the
the user wants to receive the newsletter.

Further it's also possible to require a field to be present under certain
conditions only::

    $validator->requirePresence('full_name', function ($context) {
        if (isset($context['data']['action'])) {
            return $context['data']['action'] === 'subscribe';
        }
        return false;
    });
    $validator->requirePresence('email');

This would require the ``full_name`` field to be present only in case the user
wants to create a subscription, while the ``email`` field would always be
required, since it would also be needed when canceling a subscription.

.. versionadded:: 3.1.1
    The callable support for ``requirePresence()`` was added in 3.1.1

Nesting Validators
------------------

.. versionadded:: 3.0.5

When validating :doc:`/core-libraries/form` with nested data, or when working
with models that contain array data types, it is necessary to validate the
nested data you have. CakePHP makes it simple to add validators to specific
attributes. For example, assume you are working with a non-relational database
and need to store an article and its comments::

    $data = [
        'title' => 'Best article',
        'comments' => [
            ['comment' => '']
        ]
    ];

To validate the comments you would use a nested validator::

    $validator = new Validator();
    $validator->add('title', 'not-blank', ['rule' => 'notBlank']);

    $commentValidator = new Validator();
    $commentValidator->add('comment', 'not-blank', ['rule' => 'notBlank']);

    // Connect the nested validators.
    $validator->addNestedMany('comments', $commentValidator);

    // Get all errors including those from nested validators.
    $validator->errors($data);

You can create 1:1 'relationships' with ``addNested()`` and 1:N 'relationships'
with ``addNestedMany()``. With both methods, the nested validator's errors will
contribute to the parent validator's errors and influence the final result.

.. _reusable-validators:

Creating Reusable Validators
----------------------------

While defining validators inline where they are used makes for good example
code, it doesn't lead to maintainable applications. Instead, you should
create ``Validator`` sub-classes for your reusable validation logic::

    // In src/Model/Validation/ContactValidator.php
    namespace App\Model\Validation;

    use Cake\Validation\Validator;

    class ContactValidator extends Validator
    {
        public function __construct()
        {
            parent::__construct();
            // Add validation rules here.
        }
    }

Validating Data
===============

Now that you've created a validator and added the rules you want to it, you can
start using it to validate data. Validators are able to validate array
data. For example, if you wanted to validate a contact form before creating and
sending an email you could do the following::

    use Cake\Validation\Validator;

    $validator = new Validator();
    $validator
        ->requirePresence('email')
        ->add('email', 'validFormat', [
            'rule' => 'email',
            'message' => 'E-mail must be valid'
        ])
        ->requirePresence('name')
        ->notEmpty('name', 'We need your name.')
        ->requirePresence('comment')
        ->notEmpty('comment', 'You need to give a comment.');

    $errors = $validator->errors($this->request->getData());
    if (empty($errors)) {
        // Send an email.
    }

The ``errors()`` method will return a non-empty array when there are validation
failures. The returned array of errors will be structured like::

    $errors = [
        'email' => ['E-mail must be valid']
    ];

If you have multiple errors on a single field, an array of error messages will
be returned per field. By default the ``errors()`` method applies rules for
the 'create' mode. If you'd like to apply 'update' rules you can do the
following::

    $errors = $validator->errors($this->request->getData(), false);
    if (empty($errors)) {
        // Send an email.
    }

.. note::

    If you need to validate entities you should use methods like
    :php:meth:`~Cake\\ORM\\Table::newEntity()`,
    :php:meth:`~Cake\\ORM\\Table::newEntities()`,
    :php:meth:`~Cake\\ORM\\Table::patchEntity()`,
    :php:meth:`~Cake\\ORM\\Table::patchEntities()` or
    :php:meth:`~Cake\\ORM\\Table::save()` as they are designed for that.

Validating Entities
===================

While entities are validated as they are saved, you may also want to validate
entities before attempting to do any saving. Validating entities before
saving is done automatically when using the ``newEntity()``, ``newEntities()``,
``patchEntity()`` or ``patchEntities()``::

    // In the ArticlesController class
    $article = $this->Articles->newEntity($this->request->getData());
    if ($article->errors()) {
        // Do work to show error messages.
    }

Similarly, when you need to pre-validate multiple entities at a time, you can
use the ``newEntities()`` method::

    // In the ArticlesController class
    $entities = $this->Articles->newEntities($this->request->getData());
    foreach ($entities as $entity) {
        if (!$entity->errors()) {
            $this->Articles->save($entity);
        }
    }

The ``newEntity()``, ``patchEntity()``, ``newEntities()`` and ``patchEntities()``
methods allow you to specify which associations are validated, and which
validation sets to apply using the ``options`` parameter::

    $valid = $this->Articles->newEntity($article, [
      'associated' => [
        'Comments' => [
          'associated' => ['User'],
          'validate' => 'special',
        ]
      ]
    ]);

Validation is commonly used for user-facing forms or interfaces, and thus it is
not limited to only validating columns in the table schema. However,
maintaining integrity of data regardless where it came from is important. To
solve this problem CakePHP offers a second level of validation which is called
"application rules". You can read more about them in the
:ref:`Applying Application Rules <application-rules>` section.

Core Validation Rules
=====================

CakePHP provides a basic suite of validation methods in the ``Validation``
class. The Validation class contains a variety of static methods that provide
validators for several common validation situations.

The `API documentation
<https://api.cakephp.org/3.x/class-Cake.Validation.Validation.html>`_ for the
``Validation`` class provides a good list of the validation rules that are
available, and their basic usage.

Some of the validation methods accept additional parameters to define boundary
conditions or valid options. You can provide these boundary conditions and
options as follows::

    $validator = new Validator();
    $validator
        ->add('title', 'minLength', [
            'rule' => ['minLength', 10]
        ])
        ->add('rating', 'validValue', [
            'rule' => ['range', 1, 5]
        ]);

Core rules that take additional parameters should have an array for the
``rule`` key that contains the rule as the first element, and the additional
parameters as the remaining parameters.
