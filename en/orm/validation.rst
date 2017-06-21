Validating Data
###############

Before you :doc:`save your data</orm/saving-data>` you
will probably want to ensure the data is correct and consistent. In CakePHP we
have two stages of validation:

1. Before request data is converted into entities, validation rules around
   data types and formatting can be applied.
2. Before data is saved, domain or application rules can be applied. These rules
   help ensure that your application's data remains consistent.

.. _validating-request-data:

Validating Data Before Building Entities
========================================

When marshalling data into entities, you can validate data. Validating data
allows you to check the type, shape and size of data. By default request data
will be validated before it is converted into entities.
If any validation rules fail, the returned entity will contain errors. The
fields with errors will not be present in the returned entity::

    $article = $articles->newEntity($this->request->getData());
    if ($article->errors()) {
        // Entity failed validation.
    }

.. versionadded:: 3.4.0
    The ``getErrors()`` function was added.	

When building an entity with validation enabled the following occurs:

1. The validator object is created.
2. The ``table`` and ``default`` validation provider are attached.
3. The named validation method is invoked. For example ``validationDefault``.
4. The ``Model.buildValidator`` event will be triggered.
5. Request data will be validated.
6. Request data will be type-cast into types that match the column types.
7. Errors will be set into the entity.
8. Valid data will be set into the entity, while fields that failed validation
   will be excluded.

If you'd like to disable validation when converting request data, set the
``validate`` option to false::

    $article = $articles->newEntity(
        $this->request->getData(),
        ['validate' => false]
    );

The same can be said about the ``patchEntity()`` method::

    $article = $articles->patchEntity($article, $newData, [
        'validate' => false
    ]);

Creating A Default Validation Set
=================================

Validation rules are defined in the Table classes for convenience. This defines
what data should be validated in conjunction with where it will be saved.


To create a default validation object in your table, create the
``validationDefault()`` function::

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            $validator
                ->requirePresence('title', 'create')
                ->notEmpty('title');

            $validator
                ->allowEmpty('link')
                ->add('link', 'valid-url', ['rule' => 'url']);

            ...

            return $validator;
        }
    }

The available validation methods and rules come from the ``Validator`` class and
are documented in the :ref:`creating-validators` section.

.. note::

    Validation objects are intended primarily for validating user input, i.e.
    forms and any other posted request data.


Using A Different Validation Set
================================

In addition to disabling validation you can choose which validation rule set you
want applied::

    $article = $articles->newEntity(
        $this->request->getData(),
        ['validate' => 'update']
    );

The above would call the ``validationUpdate()`` method on the table instance to
build the required rules. By default the ``validationDefault()`` method will be
used. An example validator for our articles table would be::

    class ArticlesTable extends Table
    {
        public function validationUpdate($validator)
        {
            $validator
                ->add('title', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => __('You need to provide a title'),
                ])
                ->add('body', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => __('A body is required')
                ]);
            return $validator;
        }
    }

You can have as many validation sets as necessary. See the :doc:`validation
chapter </core-libraries/validation>` for more information on building
validation rule-sets.


.. _using-different-validators-per-association:

Using A Different Validation Set For Associations
-------------------------------------------------

Validation sets can also be defined per association. When using the
``newEntity()`` or ``patchEntity()`` methods, you can pass extra options to each
of the associations to be converted::

   $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'user' => [
            'username' => 'mark'
        ],
        'comments' => [
            ['body' => 'First comment'],
            ['body' => 'Second comment'],
        ]
    ];

    $article = $articles->patchEntity($article, $data, [
        'validate' => 'update',
        'associated' => [
            'Users' => ['validate' => 'signup'],
            'Comments' => ['validate' => 'custom']
        ]
    ]);

Combining Validators
====================

Because of how validator objects are built, it is easy to break their
construction process into multiple reusable steps::

    // UsersTable.php

    public function validationDefault(Validator $validator)
    {
        $validator->notEmpty('username');
        $validator->notEmpty('password');
        $validator->add('email', 'valid-email', ['rule' => 'email']);
        ...

        return $validator;
    }

    public function validationHardened(Validator $validator)
    {
        $validator = $this->validationDefault($validator);

        $validator->add('password', 'length', ['rule' => ['lengthBetween', 8, 100]]);
        return $validator;
    }

Given the above setup, when using the ``hardened`` validation set, it will also
contain the validation rules declared in the ``default`` set.

Validation Providers
====================

Validation rules can use functions defined on any known providers. By default
CakePHP sets up a few providers:

1. Methods on the table class or its behaviors are available on the ``table``
   provider.
2. The core :php:class:`~Cake\\Validation\\Validation` class is setup as the
   ``default`` provider.

When a validation rule is created you can name the provider of that rule. For
example, if your table has an ``isValidRole`` method you can use it as
a validation rule::

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            $validator
                ->add('role', 'validRole', [
                    'rule' => 'isValidRole',
                    'message' => __('You need to provide a valid role'),
                    'provider' => 'table',
                ]);
            return $validator;
        }

        public function isValidRole($value, array $context)
        {
            return in_array($value, ['admin', 'editor', 'author'], true);
        }

    }

You can also use closures for validation rules::

    $validator->add('name', 'myRule', [
        'rule' => function ($data, $provider) {
            if ($data > 1) {
                return true;
            }
            return 'Not a good value.';
        }
    ]);

Validation methods can return error messages when they fail. This is a simple
way to make error messages dynamic based on the provided value.

Getting Validators From Tables
==============================

Once you have created a few validation sets in your table class, you can get the
resulting object by name::

    $defaultValidator = $usersTable->validator('default');

    $hardenedValidator = $usersTable->validator('hardened');

Default Validator Class
=======================

As stated above, by default the validation methods receive an instance of
``Cake\Validation\Validator``. Instead, if you want your custom validator's
instance to be used each time, you can use table's ``$_validatorClass`` property::

    // In your table class
    public function initialize(array $config)
    {
        $this->_validatorClass = '\FullyNamespaced\Custom\Validator';
    }

.. _application-rules:

Applying Application Rules
==========================

While basic data validation is done when :ref:`request data is converted into
entities <validating-request-data>`, many applications also have more complex
validation that should only be applied after basic validation has completed.

Where validation ensures the form or syntax of your data is correct, rules
focus on comparing data against the existing state of your application and/or
network.

These types of rules are often referred to as 'domain rules' or 'application
rules'. CakePHP exposes this concept through 'RulesCheckers' which are applied
before entities are persisted. Some example domain rules are:

* Ensuring email uniqueness
* State transitions or workflow steps (e.g., updating an invoice's status).
* Preventing the modification of soft deleted items.
* Enforcing usage/rate limit caps.

Domain rules are checked when calling the Table ``save()`` and ``delete()`` methods.

Creating a Rules Checker
------------------------

Rules checker classes are generally defined by the ``buildRules()`` method in your
table class. Behaviors and other event subscribers can use the
``Model.buildRules`` event to augment the rules checker for a given Table
class::

    use Cake\ORM\RulesChecker;

    // In a table class
    public function buildRules(RulesChecker $rules)
    {
        // Add a rule that is applied for create and update operations
        $rules->add(function ($entity, $options) {
            // Return a boolean to indicate pass/failure
        }, 'ruleName');

        // Add a rule for create.
        $rules->addCreate(function ($entity, $options) {
            // Return a boolean to indicate pass/failure
        }, 'ruleName');

        // Add a rule for update
        $rules->addUpdate(function ($entity, $options) {
            // Return a boolean to indicate pass/failure
        }, 'ruleName');

        // Add a rule for the deleting.
        $rules->addDelete(function ($entity, $options) {
            // Return a boolean to indicate pass/failure
        }, 'ruleName');

        return $rules;
    }

Your rules functions can expect to get the Entity being checked and an array of
options. The options array will contain ``errorField``, ``message``, and
``repository``. The ``repository`` option will contain the table class the rules
are attached to. Because rules accept any ``callable``, you can also use
instance functions::

    $rules->addCreate([$this, 'uniqueEmail'], 'uniqueEmail');

or callable classes::

    $rules->addCreate(new IsUnique(['email']), 'uniqueEmail');

When adding rules you can define the field the rule is for and the error
message as options::

    $rules->add([$this, 'isValidState'], 'validState', [
        'errorField' => 'status',
        'message' => 'This invoice cannot be moved to that status.'
    ]);

The error will be visible when calling the ``errors()`` method on the entity::

    $entity->errors(); // Contains the domain rules error messages

Creating Unique Field Rules
---------------------------

Because unique rules are quite common, CakePHP includes a simple Rule class that
allows you to define unique field sets::

    use Cake\ORM\Rule\IsUnique;

    // A single field.
    $rules->add($rules->isUnique(['email']));

    // A list of fields
    $rules->add($rules->isUnique(
        ['username', 'account_id'],
        'This username & account_id combination has already been used.'
    ));

When setting rules on foreign key fields it is important to remember, that
only the fields listed are used in the rule. This means that setting
``$user->account->id`` will not trigger the above rule.


Foreign Key Rules
-----------------

While you could rely on database errors to enforce constraints, using rules code
can help provide a nicer user experience. Because of this CakePHP includes an
``ExistsIn`` rule class::

    // A single field.
    $rules->add($rules->existsIn('article_id', 'articles'));

    // Multiple keys, useful for composite primary keys.
    $rules->add($rules->existsIn(['site_id', 'article_id'], 'articles'));

The fields to check existence against in the related table must be part of the
primary key.

You can enforce ``existsIn`` to pass when nullable parts of your composite foreign key
are null::

    // Example: A composite primary key within NodesTable is (id, site_id).
    // A Node may reference a parent Node but does not need to. In latter case, parent_id is null.
    // Allow this rule to pass, even if fields that are nullable, like parent_id, are null:
    $rules->add($rules->existsIn(
        ['parent_id', 'site_id'], // Schema: parent_id NULL, site_id NOT NULL
        'ParentNodes',
        ['allowNullableNulls' => true] 
    ));

    // A Node however should in addition also always reference a Site.
    $rules->add($rules->existsIn(['site_id'], 'Sites'));

In most SQL databases multi-column ``UNIQUE`` indexes allow multiple null values
to exist as ``NULL`` is not equal to itself. While, allowing multiple null
values is the default behavior of CakePHP, you can include null values in your
unique checks using ``allowMultipleNulls``::

    // Only only null value can exist in `parent_id` and `site_id`
    $rules->add($rules->existsIn(
        ['parent_id', 'site_id'],
        'ParentNodes',
        ['allowMultipleNulls' => false]
    ));


.. versionadded:: 3.3.0
    The ``allowNullableNulls`` and ``allowMultipleNulls`` options were added.

Association Count Rules
-----------------------

If you need to validate that a property or association contains the correct
number of values, you can use the ``validCount()`` rule::

    // In the ArticlesTable.php file
    // No more than 5 tags on an article.
    $rules->add($rules->validCount('tags', 5, '<=', 'You can only have 5 tags'));

When defining count based rules, the third parameter lets you define the
comparison operator to use. ``==``, ``>=``, ``<=``, ``>``, ``<``, and ``!=``
are the accepted operators. To ensure a property's count is within a range, use
two rules::

    // In the ArticlesTable.php file
    // Between 3 and 5 tags
    $rules->add($rules->validCount('tags', 3, '>=', 'You must have at least 3 tags'));
    $rules->add($rules->validCount('tags', 5, '<=', 'You must have at most 5 tags'));
    $rules->add($rules->validCount('subscription', 0, '==', 'You may not have a subscription'));

.. note::

   ``validCount`` returns ``false`` if the property is not countable or does not exist.
   E.g. comparing via ``<``, ``<=`` or against ``0`` will return ``false``,
   if you do not supply at least an empty list of - say - subscriptions.

.. versionadded:: 3.3.0
    The ``validCount()`` method was added in 3.3.0.

Using Entity Methods as Rules
-----------------------------

You may want to use entity methods as domain rules::

    $rules->add(function ($entity, $options) {
        return $entity->isOkLooking();
    }, 'ruleName');

Creating Custom re-usable Rules
-------------------------------

You may want to re-use custom domain rules. You can do so by creating your own invokable rule::

    use App\ORM\Rule\IsUniqueWithNulls;
    // ...
    public function buildRules(RulesChecker $rules)
    {
        $rules->add(new IsUniqueWithNulls(['parent_id', 'instance_id', 'name']), 'uniqueNamePerParent', [
            'errorField' => 'name',
            'message' => 'Name must be unique per parent.'
        ]);
        return $rules;
    }

See the core rules for examples on how to create such rules.

Creating Custom Rule Objects
----------------------------

If your application has rules that are commonly reused, it is helpful to package
those rules into re-usable classes::

    // in src/Model/Rule/CustomRule.php
    namespace App\Model\Rule;

    use Cake\Datasource\EntityInterface;

    class CustomRule
    {
        public function __invoke(EntityInterface $entity, array $options)
        {
            // Do work
            return false;
        }
    }


    // Add the custom rule
    use App\Model\Rule\CustomRule;

    $rules->add(new CustomRule(...), 'ruleName');

By creating custom rule classes you can keep your code DRY and make your domain
rules easy to test.

Disabling Rules
---------------

When saving an entity, you can disable the rules if necessary::

    $articles->save($article, ['checkRules' => false]);


Validation vs. Application Rules
================================

The CakePHP ORM is unique in that it uses a two-layered approach to validation.

The first layer is validation. Validation rules are intended to operate in
a stateless way. They are best leveraged to ensure that the shape, data types
and format of data is correct.

The second layer is application rules. Application rules are best leveraged to
check stateful properties of your entities. For example, validation rules could
ensure that an email address is valid, while an application rule could ensure
that the email address is unique.

As you already discovered, the first layer is done through the ``Validator``
objects when calling ``newEntity()`` or ``patchEntity()``::

    $validatedEntity = $articlesTable->newEntity(
        $unsafeData,
        ['validate' => 'customName']
    );
    $validatedEntity = $articlesTable->patchEntity(
        $entity,
        $unsafeData,
        ['validate' => 'customName']
    );

In the above example, we'll use a 'custom' validator, which is defined using the
``validationCustomName()`` method::

    public function validationCustom($validator)
    {
        $validator->add(...);
        return $validator;
    }

Validation assumes strings or array are passed since that is what is received
from any request::

    // In src/Model/Table/UsersTable.php
    public function validatePasswords($validator)
    {
        $validator->add('confirm_password', 'no-misspelling', [
            'rule' => ['compareWith', 'password'],
            'message' => 'Passwords are not equal',
        ]);

        ...
        return $validator;
    }

Validation is **not** triggered when directly setting properties on your
entities::

    $userEntity->email = 'not an email!!';
    $usersTable->save($userEntity);

In the above example the entity will be saved as validation is only
triggered for the ``newEntity()`` and ``patchEntity()`` methods. The second
level of validation is meant to address this situation.

Application rules as explained above will be checked whenever ``save()`` or
``delete()`` are called::

    // In src/Model/Table/UsersTable.php
    public function buildRules(RulesChecker $rules)
    {
        $rules->add($rules->isUnique('email'));
        return $rules;
    }

    // Elsewhere in your application code
    $userEntity->email = 'a@duplicated.email';
    $usersTable->save($userEntity); // Returns false

While Validation is meant for direct user input, application rules are specific
for data transitions generated inside your application::

    // In src/Model/Table/OrdersTable.php
    public function buildRules(RulesChecker $rules)
    {
        $check = function($order) {
            return $order->price < 100 && $order->shipping_mode === 'free';
        };
        $rules->add($check, [
            'errorField' => 'shipping_mode',
            'message' => 'No free shipping for orders under 100!'
        ]);
        return $rules;
    }

    // Elsewhere in application code
    $order->price = 50;
    $order->shipping_mode = 'free';
    $ordersTable->save($order); // Returns false


Using Validation as Application Rules
-------------------------------------

In certain situations you may want to run the same data validation routines for
data that was both generated by users and inside your application. This could
come up when running a CLI script that directly sets properties on entities::

    // In src/Model/Table/UsersTable.php
    public function validationDefault(Validator $validator)
    {
        $validator->add('email', 'valid', [
            'rule' => 'email',
            'message' => 'Invalid email'
        ]);
        ...
        return $validator;
    }

    public function buildRules(RulesChecker $rules)
    {
        // Add validation rules
        $rules->add(function($entity) {
            $data = $entity->extract($this->schema()->columns(), true);
            $validator = $this->validator('default');
            $errors = $validator->errors($data, $entity->isNew());
            $entity->errors($errors);

            return empty($errors);
        });

        ...

        return $rules;
    }

When executed the save will fail thanks to the new application rule that
was added::

    $userEntity->email = 'not an email!!!';
    $usersTable->save($userEntity);
    $userEntity->errors('email'); // Invalid email

The same result can be expected when using ``newEntity()`` or
``patchEntity()``::

    $userEntity = $usersTable->newEntity(['email' => 'not an email!!']);
    $userEntity->errors('email'); // Invalid email

