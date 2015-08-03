..
    Validation


バリデーション
############

.. php:namespace:: Cake\Validation

..
    The validation package in CakePHP provides features to build validators that can
    validate arbitrary arrays of data with ease.


CakePHPにおけるバリデーションは、任意の配列データに対するバリデーションを簡単に行うためのバリデータ構築のパッケージを提供する。

.. _creating-validators:

.. 
    Creating Validators

バリデータを作成する
===================

.. php:class:: Validator

..
    Validator objects define the rules that apply to a set of fields.
    Validator objects contain a mapping between fields and validation sets. In
    turn, the validation sets contain a collection of rules that apply to the field
    they are attached to. Creating a validator is simple::

バリデータオブジェクトは一セットのフィールドに適用されるルールを定義します。バリデータオブジェクトはフィールドとバリデーションセットとの間のマッピングを含みます。その引き換えに、バリデーションセットは、関係するフィールドに適用されるルールの集合体を提供するのです。バリデータを作成するのは簡単です。

::

    use Cake\Validation\Validator;

    $validator = new Validator();


..
    Once created, you can start defining sets of rules for the fields you want to
    validate::


一度作成した後、バリデーションを適用したいフィールドに対して、実際にルールを設定して行きます。

::
 
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


.. 
    As seen in the example above, validators are built with a fluent interface that
    allows you to define rules for each field you want to validate.


上記例に見られるように、バリデーションは、実際にバリデーションを実行したいフィールドに対してルールを適用するような形で、流暢なインターフェースとともに構築されて行きます。

..
    There were a few methods called in the example above, so let's go over the
    various features. The ``add()`` method allows you to add new rules to
    a validator. You can either add rules individually or in groups as seen above.


上記例には、いくつかのメソッドが呼ばれていたので、様々な特徴について見て行きましょう。``add()`` メソッドを用いることにより、バリデータに対して新しいルールを加えることができます。上記のように個別にルールを加えることもできますし、グループ単位でルールを加えることもできます。

..　
    Requiring Field Presence

フィールドが実在することを求める
----------------------------

..
    The ``requirePresence()`` method requires the field to be present in any
    validated array. If the field is absent, validation will fail. The
    ``requirePresence()`` method has 4 modes:

``requirePresence()`` メソッドは、バリデーションの対象となる配列について、フィールドが実在することを求めます。もし、フィールドが存在していなければ、バリデーションは失敗します。``requirePresence()`` には4つのモードがあります:

..
    * ``true`` The field's presence is always required.
    * ``false`` The field's presence is not required.
    * ``create`` The field's presence is required when validating a **create**
      operation.
    * ``update`` The field's presence is required when validating an **update**
      operation.

*   ``true``    この場合、フィールドが存在することが常に求められます。
*   ``false``   この場合、フィールドが存在しなくてもOKとなります。
*   ``create``  **create** 実行時にバリデーションを行う場合、このフィールドが存在することが求められます。
*   ``update``  **update** 実行時にバリデーションを行う場合、このフィールドが存在することが求められます。

..
    By default, ``true`` is used. Key presence is checked by using
    ``array_key_exists()`` so that null values will count as present. You can set
    the mode using the second parameter::

デフォルトでは、``true`` が用いられます。キーの存在は、``array_key_exists()`` を用いることによりチェックされるため、null値は、「存在する」としてカウントされます。モードにについては、２番目のパラメーターを用いることにより設定できます。

::

    $validator->requirePresence('author_id', 'create');

..
    Allowing Empty Fields

空のフィールドを認める
-------------------

..
    The ``allowEmpty()`` and ``notEmpty()`` methods allow you to control which
    fields are allowed to be 'empty'. By using the ``notEmpty()`` method, the given
    field will be marked invalid when it is empty. You can use ``allowEmpty()`` to
    allow a field to be empty. Both ``allowEmpty()`` and ``notEmpty()`` support a
    mode parameter that allows you to control when a field can or cannot be empty:

``allowEmpty()`` と ``notEmpty()`` のメソッドを用いることにより、どのフィールドが空欄であってもよいかを制御することができます。``notEmpty()`` メソッドを用いると、フィールドが空欄であったときに無効となります。``allowEmpty()`` を用いると、空欄のフィールドを用いることが可能となります。``allowEmpty()`` と ``notEmpty()`` ともに、フィールドが空欄でも良いか否かについてを制御するためのパラメーターを提供します。

..
    * ``false`` The field is not allowed to be empty.
    * ``create`` The field is required when validating a **create**
        operation.
    * ``update`` The field is required when validating an **update**
        operation.
  
*   ``false`` フィールドが空欄であることが認められません。
*   ``create`` **create** 実行時にバリデーションを行う場合、フィールドが空欄でないことが求められます。
*   ``update`` **update** 実行時にバリデーションを行う場合、フィールドが空欄でないことが求められます。

..
    The values ``''``, ``null`` and ``[]`` (empty array) will cause validation
    errors when fields are not allowed to be empty.  When fields are allowed to be
    empty, the values ``''``, ``null``, ``false``, ``[]``, ``0``, ``'0'`` are
    accepted.


``''`` や、 ``null``、そして ``[]`` といった値（空の配列）は、フィールドが空欄であることが認められないときは、バリデーションエラーを引き起こします。一方、フィールドが空欄であることが認められる場合は、``''`` や、``null`` 、``[]`` , ``0`` , ``'0'`` といった値が認められます。

..
    An example of these methods in action is::


これらのメソッドの例は以下の通りです。


::

    $validator->allowEmpty('published')
        ->notEmpty('title', 'A title is required')
        ->notEmpty('body', 'A body is required', 'create')
        ->allowEmpty('header_image', 'update');

..
    Notice that these examples take a ``provider`` key.  Adding ``Validator``
    providers is further explained in the following sections.


これらの例は、``provider`` キーを使用しております。``Validator`` プロバイダーを加えることについては、以下のセクションにてより詳しく述べます。

..
    Marking Rules as the Last to Run


最後に適用されるルールとして設定する
--------------------------------

..
    When fields have multiple rules, each validation rule will be run even if the
    previous one has failed. This allows you to collect as many validation errors as
    you can in a single pass. However, if you want to stop execution after
    a specific rule has failed, you can set the ``last`` option to ``true``::


フィールドに複数のルールが存在する場合は、前回のバリデーションが上手く機能しなかった場合でも、個々のバリデーションルールは適用されます。このことにより、一回のパスにより、好きなだけバリデーションエラーを設定することが可能となります。ただし、あるルールが上手くいかなかった後にその後のバリデーションを適用したくない場合は、``last`` オプションを ``true`` に設定すればOKです。


::

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


..
    If the minLength rule fails in the example above, the maxLength rule will not be
    run.


上記例にて、minLengthルール適用によりエラーとなった場合は、maxLengthルールは適用されません。


..
    Adding Validation Providers

バリデーションプロバイダーを加える
-----------------------------

..
    The ``Validator``, ``ValidationSet`` and ``ValidationRule`` classes do not
    provide any validation methods themselves. Validation rules come from
    'providers'. You can bind any number of providers to a Validator object.
    Validator instances come with a 'default' provider setup automatically. The
    default provider is mapped to the :php:class:`~Cake\\Validation\\Validation`
    class. This makes it simple to use the methods on that class as validation
    rules. When using Validators and the ORM together, additional providers are
    configured for the table and entity objects. You can use the ``provider()`` method
    to add any additional providers your application needs::


``Validator``, ``ValidationSet`` and ``ValidationRule`` の各クラスは、自らのバリデーションメソッドを提供するわけではありません。バリデーションルールは'プロバイダー'からもたらされるのです。バリデータオブジェクトに対しては、いくつでもプロバイダーを設定することができます。バリデータインスタンスには、自動的にデフォルトのプロバイダー設定が付随しています。デフォルトのプロバイダーは、:php:class:`~Cake\\Validation\\Validation`　のクラスにマッピングされております。このことが、このクラスにおけるメソッドをバリデーションルールとして使用することを容易にします。バリデータとORMをともに用いる場合は、テーブル及びエンティティのオブジェクトのために追加のプロバーダーが設定されます。アプリケーションの用途に応じてプロバイダーを追加したい場合は、``provider()`` メソッドを用います。


::

    $validator = new Validator();

    // オブジェクトインスタンスを用いる。
    $validator->provider('custom', $myObject);

    // クラス名を用いる。メソッドは静的なものでなければならない。
    $validator->provider('custom', 'App\Model\Validation');

..
    Validation providers can be objects, or class names. If a class name is used the
    methods must be static. To use a provider other than 'default', be sure to set
    the ``provider`` key in your rule::


バリデーションプロバイダは、オブジェクトか、あるいはクラス名で設定されます。クラス名が使用されるのであれば、メソッドは静的でなければなりません。デフォルト以外のプロバイダーを使うには、ルールの中に ``provider`` キーを挿入することを忘れないこと。

::

    //　テーブルプロバイダーからのルールを使用する
    $validator->add('title', 'unique', [
        'rule' => 'uniqueTitle',
        'provider' => 'table'
    ]);

..
    Custom Validation Rules


カスタムバリデーションルール
------------------------

..
    In addition to using methods coming from providers, you can also use any
    callable, including anonymous functions, as validation rules::


プロバイダーから与えられるメソッドを使うことに加え、匿名関数を含めたいかなるコールバック関数をも、バリデーションルールとして用いることができます。


::

    //　グローバル関数を利用する
    $validator->add('title', 'custom', [
        'rule' => 'validate_title'
    ]);

    //　プロバイダーではないコールバック関数を利用する
    $validator->add('title', 'custom', [
        'rule' => [$this, 'method']
    ]);

    //　クロージャーを利用する
    $extra = 'Some additional value needed inside the closure';
    $validator->add('title', 'custom', [
        'rule' => function ($value, $context) use ($extra) {
            // true/falseを返すカスタムロジックを記入
        }
    ]);

    // カスタムプロバイダーからのルールを利用する
    $validator->add('title', 'unique', [
        'rule' => 'uniqueTitle',
        'provider' => 'custom'
    ]);

..
    Closures or callable methods will receive 2 arguments when called. The first
    will be the value for the field being validated. The second is a context array
    containing data related to the validation process:

クロージャーやコールバックメソッドは、呼び出された際に2つの設定を受けることとなります。最初は、バリデーションが行われるフィールド値であり、２番目はバリデーションプロセスに関連するデータを含む配列です。

..
    - **data**: The original data passed to the validation method, useful if you
    plan to create rules comparing values.
    - **providers**: The complete list of rule provider objects, useful if you
    need to create complex rules by calling multiple providers.
    - **newRecord**: Whether the validation call is for a new record or
    a pre-existent one.

- **data**: バリデーションメソッドに与えられた元々のデータのことです。値を比較するようなルールを作る場合には、利用価値が高いといえます。
- **providers**: プロバイダーオブジェクトについての完成されたリストのことです。複数のプロバイダーを呼び出すことにより複雑なルールを作りたいときに、利用価値が高いといえます。
- **newRecord**:　バリデーションコールが新しいレコードのためのものか、すでにあるレコードのためのものかを示します。

..
    Conditional Validation

条件付バリデーション
------------------

..
    When defining validation rules, you can use the ``on`` key to define when
    a validation rule should be applied. If left undefined, the rule will always be
    applied. Other valid values are ``create`` and ``update``. Using one of these
    values will make the rule apply to only create or update operations.


バリデーションルールを定義する際、``on`` キーを用いることで、バリデーションルールが適用されるべきか否かを定義することができます。未定義のままにすると、ルールは常に適用されます。他に有効な値は、``create`` 及び ``update`` です。これらの値を利用することにより、``create`` や ``update`` 実行時にのみ、ルールが適用されることとなります。

..
    Additionally, you can provide a callable function that will determine whether or
    not a particular rule should be applied::


加えて、特定なルールが適用されるべきか決めるためのコールバック関数を活用することもできます。


::

    $validator->add('picture', 'file', [
        'rule' => ['mimeType', ['image/jpeg', 'image/png']],
        'on' => function ($context) {
            return !empty($context['data']['show_profile_picture']);
        }
    ]);

..
    You can access the other submitted fields values using the ``$context['data']``
    array.
    The above example will make the rule for 'picture' optional depending on whether
    the value for ``show_profile_picture`` is empty. You could also use the
    ``uploadedFile`` validation rule to create optional file upload inputs::


``$context['data']`` 配列を用いることで、他の送信されたフィールドにアクセスすることができます。上記例では、``show_profile_picture`` の値が空かどうかで'picture'のルールを任意なものとします。また、``uploadedFile`` を用いることで、任意のファイルアップロードに関する入力を設定することができます。


::

    $validator->add('picture', 'file', [
        'rule' => ['uploadedFile', ['optional' => true]],
    ]);


..
    The ``allowEmpty()`` and ``notEmpty()`` methods will also accept a callback
    function as their last argument. If present, the callback determines whether or
    not the rule should be applied. For example, a field can be sometimes allowed
    to be empty::


``allowEmpty()`` 及び ``notEmpty()`` メソッドは、最後に引数としてコールバック関数を受け付けることができます。もしこれがあれば、ルールが適用されるべきか否かをコールバック関数が決めます。例えば、以下のように、フィールド値が空のままでも許容される時もあります。


::

    $validator->allowEmpty('tax', function ($context) {
        return !$context['data']['is_taxable'];
    });


..
    Likewise, a field can be required to be populated when certain conditions are
    met::


一方で、以下のように、一定の条件が満たされた場合にのみ、フィールド値が求められる（空欄が許容されない）場合もあります。

::

    $validator->notEmpty('email_frequency', 'This field is required', function ($context) {
        return !empty($context['data']['wants_newsletter']);
    });

..
    In the above example, the ``email_frequency`` field cannot be left empty if the
    the user wants to receive the newsletter.


上記例は、ユーザーがニュースレターを受領したい場合には、``email_frequency`` フィールドが空欄のまま残されてはいけない、という例です。

..
    Nesting Validators


バリデータをネストする
-------------------

.. 
    versionadded:: 3.0.5

..
    When validating :doc:`/core-libraries/form` with nested data, or when working
    with models that contain array data types, it is necessary to validate the
    nested data you have. CakePHP makes it simple to add validators to specific
    attributes. For example, assume you are working with a non-relational database
    and need to store an article and its comments::


3.0.5バージョンにて追加:: 3.0.5

ネストされたデータで :doc:`/core-libraries/form` をバリデートする場合、また配列データを含むモデルを使用する場合、保有するネストされたデータをバリデートすることが必要となります。CakePHPでは、簡単に特定の属性に対してバリデータを加えることが可能となります。例えば、非リレーショナルデータベースを用いて作業しており、とある記事とそれに対するコメントを保存したいとします。


::

    $data = [
        'title' => 'Best article',
        'comments' => [
            ['comment' => '']
        ]
    ];


..
    To validate the comments you would use a nested validator::


コメントに対してバリデーションをかけたい場合は、ネストされたバリデータを使用します。


::

    $validator = new Validator();
    $validator->add('title', 'not-blank', ['rule' => 'notBlank']);

    $commentValidator = new Validator();
    $commentValidator->add('comment', 'not-blank', ['rule' => 'notBlank']);

    // ネストされたバリデータをつなげる
    $validator->addNestedMany('comments', $commentValidator);

    //　ネストされたバリデータからのエラーを含むすべてのエラーを取得する
    $validator->errors($data);

..
    You can create 1:1 'relationships' with ``addNested()`` and 1:N 'relationships'
    with ``addNestedMany()``. With both methods, the nested validator's errors will
    contribute to the parent validator's errors and influence the final result.


``addNested()`` を用いることで、1:1の関係を構築することができ、``addNestedMany()`` を用いることで1:Nの関係を築くことができます。両方のメソッドを用いることにより、ネストされたバリデータのエラーは親バリデータのエラーに貢献し、最終結果に影響を与えます。


.. _reusable-validators:

..
    Creating Reusable Validators


再利用可能なバリデータを作成する
----------------------------

.. 
    While defining validators inline where they are used makes for good example
    code, it doesn't lead to easily maintainable applications. Instead, you should
    create ``Validator`` sub-classes for your reusable validation logic::


バリデータを、使用されている場所で定義するのは、良いサンプルコードにはなるが、簡単にメンテナンス可能なアプリケーションには結びつきません。実際には、再利用可能なバリデーションのロジックを使用する際、``Validator`` サブクラスを使うべきです。

 
::

    // src/Model/Validation/ContactValidator.phpにて
    namespace App\Model\Validation;

    use Cake\Validation\Validator;

    class ContactValidator extends Validator
    {
        public function __construct()
        {
            parent::__construct();
            //　バリデーションのルールを加える
        }
    }

..
    Validating Data


データをバリデートする
===================

..
    Now that you've created a validator and added the rules you want to it, you can
    start using it to validate data. Validators are able to validate array based
    data. For example, if you wanted to validate a contact form before creating and
    sending an email you could do the following::


バリデータを作成し、適用したいルールを加えたので、実際にデータを用いてバリデーションを実施して行きましょう。バリデータを用いることにより、配列ベースのデータのバリデーションが可能となります。例えば、e-mailを作成し、送る前にコンタクト先のバリデーションを行いたい場合は、以下のようにするとよいでしょう。


::

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

    $errors = $validator->errors($this->request->data());
    if (!empty($errors)) {
        // emailを送る。
    }


..
    The ``errors()`` method will return a non-empty array when there are validation
    failures. The returned array of errors will be structured like::


``errors()``メソッドは、バリデーションエラーがあった場合に、空でない配列を返します。返されたエラー配列は、以下のような構造となっております。


::

    $errors = [
        'email' => ['E-mail must be valid']
    ];

..
    If you have multiple errors on a single field, an array of error messages will
    be returned per field. By default the ``errors()`` method applies rules for
    the 'create' mode. If you'd like to apply 'update' rules you can do the
    following::


もし単一のフィールドに複数のエラーがあった場合は、エラーメッセージの配列はフィールドごとに返されます。デフォルトでは``errors()``メソッドは、'create'を実行する際のルールが適用されますが、'update'を実行する際のルールを適用したい場合は、以下のことが可能となります。

::

    $errors = $validator->errors($this->request->data(), false);
    if (!empty($errors)) {
        // emailを送る。
    }


..
    If you need to validate entities you should use methods like


.. note::

    もし、エンティティをバリデーションしたい場合は、エンティティのバリデーションのために用意された次のようなメソッドを利用するべきです。
    :php:meth:`~Cake\\ORM\\Table::newEntity()`,
    :php:meth:`~Cake\\ORM\\Table::newEntities()`,
    :php:meth:`~Cake\\ORM\\Table::patchEntity()`,
    :php:meth:`~Cake\\ORM\\Table::patchEntities()` or
    :php:meth:`~Cake\\ORM\\Table::save()`


..
    Validating Entities

エンティティをバリデーションする
===========================

..
    While entities are validated as they are saved, you may also want to validate
    entities before attempting to do any saving. Validating entities before
    saving is done automatically when using the ``newEntity()``, ``newEntities()``,
    ``patchEntity()`` or ``patchEntities()``::


エンティティは保存される際にバリデーションが実行されるが、保存を試みる前にエンティティのバリデーションを行いたいようなケースがあるかもしれない。``newEntity()``, ``newEntities()``,``patchEntity()`` または ``patchEntities()`` を使った場合、保存前のエンティティのバリデーションは自動的に実行される。


::

    // ArticlesControllerクラスにおいて
    $article = $this->Articles->newEntity($this->request->data());
    if ($article->errors()) {
        //エラーメッセージが表示されるためのコードを書く

    }


..
    Similarly, when you need to pre-validate multiple entities at a time, you can
    use the ``newEntities()`` method::


同様に、いくつかのエンティティに対して同時に事前のバリデーションを実行したい場合は、``newEntities()`` メソッドを用いることができます。


::

    // ArticlesControllerクラスにおいて
    $entities = $this->Articles->newEntities($this->request->data());
    foreach ($entities as $entity) {
        if (!$entity->errors()) {
                $this->Articles->save($entity);
        }
    }


.. 
    The ``newEntity()``, ``patchEntity()`` and ``newEntities()`` methods
    allow you to specify which associations are validated, and which
    validation sets to apply using the ``options`` parameter::

``newEntity()``, ``patchEntity()`` and ``newEntities()`` メソッドを用いることによりどのアソシエーションがバリデーションされたか、``options`` パラメーターを用いることによりどのバリデーションセットを適用させるかを特定することができます。

::

    $valid = $this->Articles->newEntity($article, [
      'associated' => [
        'Comments' => [
          'associated' => ['User'],
          'validate' => 'special',
        ]
      ]
    ]);

..
    Validation is commonly used for user-facing forms or interfaces, and thus it is
    not limited to only validating columns in the table schema. However,
    maintaining integrity of data regardless where it came from is important. To
    solve this problem CakePHP offers a second level of validation which is called
    "application rules". You can read more about them in the
    :ref:`Applying Application Rules <application-rules>` section.


バリデーションは、ユーザーフォームやインターフェイスに主に利用され、その用途はテーブル内のコラムをバリデーションすることに限られません。しかしながら、データ元がどこであったとしても、データの統一性を維持することは重要です。この問題を解決するために、CakePHPは"アプリケーションルール"と呼ばれる２段階目のバリデーションを提供します。本件については、:ref:`Applying Application Rules <application-rules>` セクションにて詳述します。

..
    Core Validation Rules


コアバリデーションルール
=====================


..
    CakePHP provides a basic suite of validation methods in the ``Validation``
    class. The Validation class contains a variety of static methods that provide
    validators for a several common validation situations.


CakePHPは ``Validation`` クラス内にバリデーションメソッドに関する基本的な構文を提供します。バリデーションクラスには、色々な一般的なバリデーションのシチュエーションに対する、様々な静的なメソッドが含まれます。

..
    The `API documentation
    <http://api.cakephp.org/3.0/class-Cake.Validation.Validation.html>`_ for the
    ``Validation`` class provides a good list of the validation rules that are
    available, and their basic usage.

``Validation`` クラスにおける `API ドキュメンテーション <http://api.cakephp.org/3.0/class-Cake.Validation.Validation.html>`_ では、利用可能なバリデーションのルールについてのリスト及び基本的な使い方が案内されております。


..
    Some of the validation methods accept additional parameters to define boundary
    conditions or valid options. You can provide these boundary conditions & options
    as follows::


幾つかのバリデーションメソッドは、上限下限に関する条件や有効なオプションを設定することができます。　このような上限下限に関する条件や有効なオプションは、以下のように提供可能です。

::

    $validator = new Validator();
    $validator
        ->add('title', 'minLength', [
            'rule' => ['minLength', 10]
        ])
        ->add('rating', 'validValue', [
            'rule' => ['range', 1, 5]
        ]);

..
    Core rules that take additional parameters should have an array for the
    ``rule`` key that contains the rule as the first element, and the additional
    parameters as the remaining parameters.


追加のパラメーターが設定できるコアなルールには、``rule`` キーの中に、最初の要素としてルールそのものを含むような配列が設定されるべきであり、その後のパラメーターには、残りのパラメーターを含ませるべきです。

