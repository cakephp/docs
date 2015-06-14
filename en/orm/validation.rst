Validating Data
###############

Before you :doc:`save your data</orm/saving-data>` you
will probably want to ensure the data is correct and consistent. In CakePHP we
have two stages of validation:

1. Before request data is converted into entities validation rules around
   data types, and formatting can be applied.
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

    $article = $articles->newEntity($this->request->data);
    if ($article->errors()) {
        // Entity failed validation.
    }

When building an entity with validation enabled the following things happen:

1. The validator object is created.
2. The ``table`` and ``default`` validation provider are attached.
3. The named validation method is invoked. For example, ``validationDefault``.
4. The ``Model.buildValidator`` event will be triggered.
5. Request data will be validated.
6. Request data will be type cast into types that match the column types.
7. Errors will be set into the entity.
8. Valid data will be set into the entity, while fields that failed validation
   will be left out.

If you'd like to disable validation when converting request data, set the
``validate`` option to false::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => false]
    );

In addition to disabling validation you can choose which validation rule set you
want applied::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => 'update']
    );

The above would call the ``validationUpdate()`` method on the table instance to
build the required rules. By default the ``validationDefault()`` method will be
used. A sample validator for our articles table would be::

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

You can have as many validation sets as you need. See the :doc:`validation
chapter </core-libraries/validation>` for more information on building
validation rule-sets.

Validation rules can use functions defined on any known providers. By default
CakePHP sets up a few providers:

1. Methods on the table class, or its behaviors are available on the ``table``
   provider.
2. The core :php:class:`~Cake\\Validation\\Validation` class is setup as the
   ``default`` provider.

When a validation rule is created you can name the provider of that rule. For
example, if your entity had a 'isValidRole' method you could use it as
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

Default Validator Class
=======================

As stated above by default the validation methods receive an instance of
``Cake\Validation\Validator`. Instead if you want your custom validator's
instance to be used each time you can use table's ``$_validatorClass`` property::

    // In your table class
    public function initialize()
    {
        $this->_validatorClass = '\FullyNamespaced\Custom\Validator';
    }

.. _application-rules:

Applying Application Rules
==========================

While basic data validation is done when :ref:`request data is converted into
entities <validating-request-data>`, many applications also have more complex
validation that should only be applied after basic validation has completed.
These types of rules are often referred to as 'domain rules' or 'application
rules'. CakePHP exposes this concept through 'RulesCheckers' which are applied
before entities are persisted. Some example domain rules are:

* Ensuring email uniqueness
* State transitions or workflow steps, for example updating an invoice's status.
* Preventing modification of soft deleted items.
* Enforcing usage/rate limit caps.

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
            // Return a boolean to indicate pass/fail
        }, 'ruleName');

        // Add a rule for create.
        $rules->addCreate(function ($entity, $options) {
        }, 'ruleName');

        // Add a rule for update
        $rules->addUpdate(function ($entity, $options) {
        }, 'ruleName');

        // Add a rule for the deleting.
        $rules->addDelete(function ($entity, $options) {
        }, 'ruleName');

        return $rules;
    }

Your rules functions can expect to get the Entity being checked, and an array of
options. The options array will contain ``errorField``, ``message``, and
``repository``. The ``repository`` option will contain the table class the rules
are attached to. Because rules accept any ``callable``, you can also use
instance functions::

    $rules->addCreate([$this, 'uniqueEmail'], 'uniqueEmail');

or callable classes::

    $rules->addCreate(new IsUnique(['email']), 'uniqueEmail');

When adding rules you can define the field the rule is for, and the error
message as options::

    $rules->add([$this, 'isValidState'], 'validState', [
        'errorField' => 'status',
        'message' => 'This invoice cannot be moved to that status.'
    ]);

Creating Unique Field Rules
---------------------------

Because unique rules are quite common, CakePHP includes a simple Rule class that
allows you to easily define unique field sets::

    use Cake\ORM\Rule\IsUnique;

    // A single field.
    $rules->add($rules->isUnique(['email']));

    // A list of fields
    $rules->add($rules->isUnique(['username', 'account_id']));

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

Using Entity Methods as Rules
-----------------------------

You may want to use entity methods as domain rules::

    $rules->add(function ($entity, $options) {
        return $entity->isOkLooking();
    }, 'ruleName');

Creating Custom Rule objects
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
