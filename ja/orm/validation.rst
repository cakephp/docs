データの検証 (バリデーション)
#############################

:doc:`データを保存する</orm/saving-data>` 前におそらくそのデータが正しく
矛盾がないことを保証したいはずです。
CakePHPではデータの検証には二つの段階があります:

1. リクエストデータがエンティティにコンバートされる前、
   データ型や書式まわりの検証ルールが適用されます。
2. データが保存される前、ドメインまたはアプリケーションルールが適用されます。
   これらのルールはアプリケーションのデータの一貫性の保証に役立ちます。

.. _validating-request-data:

エンティティ構築前のデータ検証
==============================

データからエンティティを構築する時, データの検証ができます。
データの検証ではデータの型、形状およびサイズなどを確認することができます。
既定ではリクエストデータがエンティティに変換される前に検証が行われます。
もしも何らかの検証ルールが通らなかった場合、
返されたエンティティはエラーを含んだ状態になります。
エラーのあるフィールドは返されたエンティティには含まれません::

    $article = $articles->newEntity($this->request->data);
    if ($article->errors()) {
        // エンティティは検証を通りませんでした。
    }

検証が有効になっている状態でエンティティを構築すると、次のことが起こります:

1. バリデータオブジェクトが作成されます。
2. ``table`` および ``default`` 検証プロバイダが追加されます。
3. 命名にそった検証メソッドが呼び出されます。たとえば ``validationDefault`` 。
4. ``Model.buildValidator`` イベントが発動します。
5. リクエストデータが検証されます。
6. リクエストデータがそのカラム型に対応する型に変換されます。
7. エラーがエンティティにセットされます。
8. 正しいデータはエンティティに設定されますが、
   検証を通らなかったフィールドは除外されます。

もしもリクエストデータを変換する時に検証を無効にしたければ、
``validate`` オプションに偽を指定してください::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => false]
    );

``patchEntity()`` メソッドについても同じことが言えます::

    $article = $articles->patchEntity($article, $newData, [
        'validate' => false
    ]);

既定の検証セットの作成
======================

検証ルールは規約ではテーブルクラス中で定義されます。
何のデータが検証されるかとあわせてどこで保存されるかも定義します。


テーブル中で既定の検証オブジェクトを作るには、
``validationDefault()`` 関数を作成します::

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

有効な検証メソッドやルールは ``Validator`` クラスによって提供され
:ref:`creating-validators` の節に記載されています。

.. note::

    検証オブジェクトは主にユーザー入力の検証用に意図されています。
    たとえば、フォームやその他の投稿されたリクエストデータです。


異なる検証セットの使用
======================

検証を無効にすることに加えて適用させたい検証ルールを選ぶこともできます::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => 'update']
    );

上記は必要なルールを構築するために、そのテーブルインスタンスの ``validationUpdate()``
メソッドを呼び出します。既定では ``validationDefault()`` メソッドが使用されます。
記事テーブル用のバリデータの一例はこのようになります::

    class ArticlesTable extends Table
    {
        public function validationUpdate($validator)
        {
            $validator
                ->add('title', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => __('タイトルを設定してください'),
                ])
                ->add('body', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => __('本文は必須です')
                ]);
            return $validator;
        }
    }

必要に応じていくつもの検証セットを設けることができます。
検証ルールセットの構築についてのより多くの情報は :doc:`バリデーション
</core-libraries/validation>` を参照してください。

アソシエーションに異なる検証セットを使用
----------------------------------------

検証セットはアソシエーションごとに定義することもできます。
``newEntity()`` または ``patchEntity()`` メソッドを使用する時、
変換されるアソシエーション各々に追加のオプションを渡すことができます::

   $data = [
        'title' => '私の肩書き',
        'body' => 'テキスト',
        'user_id' => 1,
        'user' => [
            'username' => 'マーク'
        ],
        'comments' => [
            ['body' => '１番目のコメント'],
            ['body' => '２番目のコメント'],
        ]
    ];

    $article = $articles->patchEntity($article, $data, [
        'validate' => 'update',
        'associated' => [
            'Users' => ['validate' => 'signup'],
            'Comments' => ['validate' => 'custom']
        ]
    ]);

バリデータの組み合わせ
======================

バリデータオブジェクトはこのように構築されるので、
その構築過程を複数の手順に分割することは簡単です::

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

上の手順では、 ``hardened`` 検証セットを使う時には
``default`` セット中で定義されている検証ルールも含むことになります。

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


Validation vs. Application Rules
================================

The CakePHP ORM is unique in that it uses a two-layered approach to validation.
As you already discovered, the first layer is done through the ``Validator``
objects when calling ``newEntity()`` or ``patchEntity()``::

    $validatedEntity = $articlesTable->newEntity($unsafeData);
    $validatedEntity = $articlesTable->patchEntity($entity, $unsafeData);

Validation is defined using the ``validationCustomName()`` methods::

    public function validationCustom($validator)
    {
        $validator->add(...);
        return $validator;
    }

Validation is meant for forms and request data. This means that validation rule
sets can assume things about the structure of a form and validate fields not in
the schema of the database. Validation assumes strings or array are passed
since that is what is received from any request::

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
