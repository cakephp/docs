バリデーション
###############

.. php:namespace:: Cake\Validation

CakePHP のバリデーションは、任意の配列データに対するバリデーションを簡単に行うための
バリデーター構築のパッケージを提供します。 `API 中の利用可能なバリデーションルールの一覧
<https://api.cakephp.org/3.x/class-Cake.Validation.Validation.html>`__
をご覧ください。

.. _creating-validators:

バリデーターを作成する
======================

.. php:class:: Validator

バリデーターオブジェクトは１セットのフィールドに適用されるルールを定義します。
バリデーターオブジェクトはフィールドとバリデーションセットとの間のマッピングを含みます。
その引き換えに、バリデーションセットは、関係するフィールドに適用されるルールの集合体を
提供します。バリデーターを作成するのは簡単です。 ::

    use Cake\Validation\Validator;

    $validator = new Validator();

一度作成した後、バリデーションを適用したいフィールドに対して、実際にルールを設定して行きます。 ::

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

上記例に見られるように、バリデーションは、実際にバリデーションを実行したいフィールドに対して
ルールを適用するような形で、流暢なインターフェイスとともに構築されて行きます。

上記例には、いくつかのメソッドが呼ばれていたので、様々な特徴について見て行きましょう。
``add()`` メソッドを用いることにより、バリデーターに対して新しいルールを加えることができます。
上記のように個別にルールを加えることもできますし、グループ単位でルールを加えることもできます。

フィールドが実在することを求める
--------------------------------

``requirePresence()`` メソッドは、バリデーションの対象となる配列について、
フィールドが実在することを求めます。もし、フィールドが存在していなければ、
バリデーションは失敗します。 ``requirePresence()`` には4つのモードがあります:

* ``true`` この場合、フィールドが存在することが常に求められます。
* ``false`` この場合、フィールドが存在することは必要なくなります。
* ``create`` **create** 実行時にバリデーションを行う場合、このフィールドが存在することが求められます。
* ``update`` **update** 実行時にバリデーションを行う場合、このフィールドが存在することが求められます。

デフォルトでは、 ``true`` が用いられます。キーの存在は、 ``array_key_exists()``
を用いることによりチェックされるため、 null 値は、「存在する」としてカウントされます。
モードについては、２番目のパラメーターを用いることにより設定できます。 ::

    $validator->requirePresence('author_id', 'create');

もし要求するフィールドが複数ある場合、それらをリストとして定義することができます。 ::

    // create として複数フィールドを定義
    $validator->requirePresence(['author_id', 'title'], 'create');

    // 混在したモードで複数フィールドを定義
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
    ``requirePresence()`` は、3.3.0 でフィールドの配列を受け取ります。

空のフィールドを認める
----------------------

``allowEmpty()`` と ``notEmpty()`` のメソッドを用いることにより、どのフィールドが
空欄であってもよいかを制御することができます。 ``notEmpty()`` メソッドを用いると、
フィールドが空欄であったときに無効となります。 ``allowEmpty()`` を用いると、
空欄のフィールドを用いることが可能となります。 ``allowEmpty()`` と ``notEmpty()``
ともに、フィールドが空欄でも良いか否かについてを制御するためのパラメーターを提供します。

* ``false`` フィールドが空欄であることが認められません。
* ``create`` **create** 実行時にバリデーションを行う場合、フィールドは空欄にすることができます。
* ``update`` **update** 実行時にバリデーションを行う場合、フィールドは空欄にすることができます。

``''`` や、 ``null`` 、そして ``[]`` といった値（空の配列）は、フィールドが空欄であることが
認められないときは、バリデーションエラーを引き起こします。一方、フィールドが空欄であることが
認められる場合は、 ``''`` や、 ``null`` 、 ``[]`` , ``0`` , ``'0'`` といった値が
認められます。

これらのメソッドの例は以下の通りです。 ::

    $validator->allowEmpty('published')
        ->notEmpty('title', 'Title cannot be empty')
        ->notEmpty('body', 'Body cannot be empty', 'create')
        ->allowEmpty('header_image', 'update');

最後に適用されるルールとして設定する
------------------------------------

フィールドに複数のルールが存在する場合は、前回のバリデーションが上手く機能しなかった場合でも、
個々のバリデーションルールは適用されます。このことにより、一回のパスにより、好きなだけ
バリデーションエラーを設定することが可能となります。ただし、あるルールが上手くいかなかった後に
その後のバリデーションを適用したくない場合は、 ``last`` オプションを ``true``
に設定することができます。 ::

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

上記例にて、minLength ルール適用によりエラーとなった場合は、maxLength ルールは適用されません。

バリデーションメソッドの短縮
----------------------------

3.2 から、Validator オブジェクトは、少ない記述でバリデーターを構築する多くの新しいメソッドがあります。
例えば、バリデーションルールを username フィールドに追加するには以下のようになります。 ::

    $validator = new Validator();
    $validator
        ->email('username')
        ->ascii('username')
        ->lengthBetween('username', [4, 8]);

バリデーションプロバイダーを加える
----------------------------------

``Validator``, ``ValidationSet``, ``ValidationRule`` の各クラスは、
自らのバリデーションメソッドを提供するわけではありません。バリデーションルールは
'プロバイダー' からもたらされるのです。バリデーターオブジェクトに対しては、
いくつでもプロバイダーを設定することができます。バリデーターインスタンスには、
自動的にデフォルトのプロバイダー設定が付随しています。デフォルトのプロバイダーは、
:php:class:`~Cake\\Validation\\Validation` のクラスにマッピングされております。
このことが、このクラスにおけるメソッドをバリデーションルールとして使用することを容易にします。
バリデーターと ORM をともに用いる場合は、テーブル及びエンティティーのオブジェクトのために
追加のプロバーダーが設定されます。アプリケーションの用途に応じてプロバイダーを追加したい場合は、
``setProvider()`` メソッドを用います。 ::

    $validator = new Validator();

    // オブジェクトインスタンスを使います。
    $validator->setProvider('custom', $myObject);

    // クラス名を使います。メソッドは静的なものでなければなりません。
    $validator->setProvider('custom', 'App\Model\Validation');

バリデーションプロバイダーは、オブジェクトか、あるいはクラス名で設定されます。
クラス名が使用されるのであれば、メソッドは静的でなければなりません。
デフォルト以外のプロバイダーを使うには、ルールの中に ``provider``
キーを挿入することを忘れないこと。 ::

    // テーブルプロバイダーからのルールを使用する
    $validator->add('title', 'custom', [
        'rule' => 'customTableMethod',
        'provider' => 'table'
    ]);

今後作成される全ての ``Validator`` オブジェクトに ``provider`` を追加したい場合、
以下のように ``addDefaultProvider()`` メソッドを使用できます。 ::

    use Cake\Validation\Validator;

    // オブジェクトインスタンスを使います。
    Validator::addDefaultProvider('custom', $myObject);

    // クラス名を使います。メソッドは静的なものでなければなりません。
    Validator::addDefaultProvider('custom', 'App\Model\Validation');

.. note::

    デフォルトプロバイダーは、 ``Validator`` オブジェクトが作成される前に追加されなければなりません。
    そのため **config/bootstrap.php** がデフォルトプロバイダーの設定に最適な場所です。

.. versionadded:: 3.5.0

国に基いて提供するための `Localized プラグイン <https://github.com/cakephp/localized>`_
が利用できます。このプラグインで、国に依存するモデルのフィールドをバリデートできます。
例::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class PostsTable extends Table
    {
        public function validationDefault(Validator $validator)
        {
            // バリデーターにプロバイダーを追加
            $validator->setProvider('fr', 'Localized\Validation\FrValidation');
            // フィールドのバリデーションルールの中にプロバイダーを利用
            $validator->add('phoneField', 'myCustomRuleNameForPhone', [
                'rule' => 'phone',
                'provider' => 'fr'
            ]);

            return $validator;
        }
    }

Localized プラグインは、バリデーションのための国の２文字の ISO コード
(例えば en, fr, de) を使用します。

`ValidationInterface インターフェイス <https://github.com/cakephp/localized/blob/master/src/Validation/ValidationInterface.php>`_
によって定義されたすべてのクラスに共通する幾つかのメソッドがあります。 ::

    電話番号のチェックのための phone()
    郵便番号のチェックのための postal()
    国が定めた個人 ID のチェックのための personId()

カスタムバリデーションルール
----------------------------

プロバイダーから与えられるメソッドを使うことに加え、匿名関数を含めたいかなるコールバック関数をも、
バリデーションルールとして用いることができます。 ::

    // グローバル関数を利用する
    $validator->add('title', 'custom', [
        'rule' => 'validate_title',
        'message' => 'タイトルが正しくありません'
    ]);

    // プロバイダーではないコールバック関数を利用する
    $validator->add('title', 'custom', [
        'rule' => [$this, 'method'],
        'message' => 'タイトルが正しくありません'
    ]);

    // クロージャーを利用する
    $extra = 'Some additional value needed inside the closure';
    $validator->add('title', 'custom', [
        'rule' => function ($value, $context) use ($extra) {
            // true/falseを返すカスタムロジックを記入
        },
        'message' => 'タイトルが正しくありません'
    ]);

    // カスタムプロバイダーからのルールを利用する
    $validator->add('title', 'custom', [
        'rule' => 'customRule',
        'provider' => 'custom',
        'message' => 'タイトルが十分にユニークではありません'
    ]);

クロージャーやコールバックメソッドは、呼び出された際に2つの設定を受けることとなります。
最初は、バリデーションが行われるフィールド値であり、２番目はバリデーションプロセスに関連する
データを含む配列です。

- **data**: バリデーションメソッドに与えられた元々のデータのことです。
  値を比較するようなルールを作る場合には、利用価値が高いといえます。
- **providers**: プロバイダーオブジェクトについての完成されたリストのことです。
  複数のプロバイダーを呼び出すことにより複雑なルールを作りたいときに、利用価値が高いといえます。
- **newRecord**:　バリデーションコールが新しいレコードのためのものか、
  すでにあるレコードのためのものかを示します。

既存ユーザーの ID のようにあなたのバリデーションメソッドに追加のデータを渡す必要がある場合、
あなたのコントローラーからカスタム動的プロバイダー利用できます。 ::

    $this->Examples->validator('default')->provider('passed', [
        'count' => $countFromController,
        'userid' => $this->Auth->user('id')
    ]);

そのとき、あなたのバリデーションメソッドが、第２コンテキストパラメーターを持つことを保証します。 ::

    public function customValidationMethod($check, array $context)
    {
        $userid = $context['providers']['passed']['userid'];
    }

条件付バリデーション
--------------------

バリデーションルールを定義する際、``on`` キーを用いることで、バリデーションルールが
適用されるべきか否かを定義することができます。未定義のままにすると、ルールは常に適用されます。
他に有効な値は、 ``create`` 及び ``update`` です。これらの値を利用することにより、
``create`` や ``update`` 実行時にのみ、ルールが適用されることとなります。

加えて、特定なルールが適用されるべきか決めるためのコールバック関数を活用することもできます。 ::

    $validator->add('picture', 'file', [
        'rule' => ['mimeType', ['image/jpeg', 'image/png']],
        'on' => function ($context) {
            return !empty($context['data']['show_profile_picture']);
        }
    ]);

``$context['data']`` 配列を用いることで、他の送信されたフィールドにアクセスすることが
できます。上記例では、 ``show_profile_picture`` の値が空かどうかで 'picture'
のルールを任意なものとします。また、 ``uploadedFile`` を用いることで、
任意のファイルアップロードに関する入力を設定することができます。 ::

    $validator->add('picture', 'file', [
        'rule' => ['uploadedFile', ['optional' => true]],
    ]);

``allowEmpty()``, ``notEmpty()`` 及び ``requirePresence()`` メソッドは、
最後に引数としてコールバック関数を受け付けることができます。もしこれがあれば、
ルールが適用されるべきか否かをコールバック関数が決めます。例えば、以下のように、
フィールド値が空のままでも許容される時もあります。 ::

    $validator->allowEmpty('tax', function ($context) {
        return !$context['data']['is_taxable'];
    });

一方で、以下のように、一定の条件が満たされた場合にのみ、フィールド値が求められる
（空欄が許容されない）場合もあります。 ::

    $validator->notEmpty('email_frequency', 'This field is required', function ($context) {
        return !empty($context['data']['wants_newsletter']);
    });

上記例は、ユーザーがニュースレターを受領したい場合には、 ``email_frequency``
フィールドが空欄のまま残されてはいけない、という例です。

さらに、一定の条件の下でのみフィールドが存在することを求めることも可能です。 ::

    $validator->requirePresence('full_name', function ($context) {
        if (isset($context['data']['action'])) {
            return $context['data']['action'] === 'subscribe';
        }
        return false;
    });
    $validator->requirePresence('email');

これは、申し込みを作成したいユーザーの場合のみ ``full_name`` フィールドの存在を求め、
``email`` フィールドは常に要求されます。申し込みをキャンセルした時にも必要とされます。

.. versionadded:: 3.1.1
    ``requirePresence()`` の callable 対応は、 3.1.1 で追加されました。

バリデーターをネストする
------------------------

.. versionadded:: 3.0.5

ネストされたデータで :doc:`/core-libraries/form` をバリデートする場合、
また配列データを含むモデルを使用する場合、保有するネストされたデータをバリデートすることが
必要となります。CakePHP では、簡単に特定の属性に対してバリデーターを加えることが可能となります。
例えば、非リレーショナルデータベースを用いて作業しており、とある記事とそれに対するコメントを
保存したいとします。 ::

    $data = [
        'title' => 'Best article',
        'comments' => [
            ['comment' => '']
        ]
    ];

コメントに対してバリデーションをかけたい場合は、ネストされたバリデーターを使用します。 ::

    $validator = new Validator();
    $validator->add('title', 'not-blank', ['rule' => 'notBlank']);

    $commentValidator = new Validator();
    $commentValidator->add('comment', 'not-blank', ['rule' => 'notBlank']);

    // ネストされたバリデーターをつなげる
    $validator->addNestedMany('comments', $commentValidator);

    // ネストされたバリデーターからのエラーを含むすべてのエラーを取得する
    $validator->errors($data);

``addNested()`` を用いることで、1:1 の関係を構築することができ、 ``addNestedMany()``
を用いることで 1:N の関係を築くことができます。両方のメソッドを用いることにより、
ネストされたバリデーターのエラーは親バリデーターのエラーに貢献し、最終結果に影響を与えます。

.. _reusable-validators:

再利用可能なバリデーターを作成する
----------------------------------

バリデーターを、使用されている場所で定義するのは、良いサンプルコードにはなりますが、
簡単にメンテナンス可能なアプリケーションには結びつきません。実際には、
再利用可能なバリデーションのロジックを使用する際、
``Validator`` サブクラスを使うべきです。 ::

    // src/Model/Validation/ContactValidator.php にて
    namespace App\Model\Validation;

    use Cake\Validation\Validator;

    class ContactValidator extends Validator
    {
        public function __construct()
        {
            parent::__construct();
            // バリデーションのルールを加える
        }
    }

データをバリデートする
======================

バリデーターを作成し、適用したいルールを加えたので、実際にデータを用いてバリデーションを
実施して行きましょう。バリデーターを用いることにより、配列ベースのデータのバリデーションが
可能となります。例えば、 email を作成し、送る前にコンタクト先のバリデーションを行いたい場合は、
以下のようにするとよいでしょう。 ::

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
        // email を送る。
    }

``errors()`` メソッドは、バリデーションエラーがあった場合に、空でない配列を返します。
返されたエラー配列は、以下のような構造となっております。 ::

    $errors = [
        'email' => ['E-mail must be valid']
    ];

もし単一のフィールドに複数のエラーがあった場合は、エラーメッセージの配列はフィールドごとに
返されます。デフォルトでは ``errors()`` メソッドは、 'create' を実行する際のルールが
適用されますが、 'update' を実行する際のルールを適用したい場合は、
以下のことが可能となります。 ::

    $errors = $validator->errors($this->request->getData(), false);
    if (empty($errors)) {
        // email を送る。
    }

.. note::

    もし、エンティティーをバリデーションしたい場合は、エンティティーのバリデーションのために
    用意された次のようなメソッドを利用するべきです。
    :php:meth:`~Cake\\ORM\\Table::newEntity()`,
    :php:meth:`~Cake\\ORM\\Table::newEntities()`,
    :php:meth:`~Cake\\ORM\\Table::patchEntity()`,
    :php:meth:`~Cake\\ORM\\Table::patchEntities()` または
    :php:meth:`~Cake\\ORM\\Table::save()`

エンティティーをバリデーションする
==================================

エンティティーは保存される際にバリデーションが実行されますが、保存を試みる前にエンティティーの
バリデーションを行いたいようなケースがあるかもしれません。 ``newEntity()``,
``newEntities()``, ``patchEntity()`` または ``patchEntities()`` を使った場合、
保存前のエンティティーのバリデーションは自動的に実行されます。 ::

    // ArticlesController クラスにおいて
    $article = $this->Articles->newEntity($this->request->getData());
    if ($article->errors()) {
        // エラーメッセージが表示されるためのコードを書く
    }

同様に、いくつかのエンティティーに対して同時に事前のバリデーションを実行したい場合は、
``newEntities()`` メソッドを用いることができます。 ::

    // ArticlesController クラスにおいて
    $entities = $this->Articles->newEntities($this->request->getData());
    foreach ($entities as $entity) {
        if (!$entity->errors()) {
            $this->Articles->save($entity);
        }
    }

``newEntity()``, ``patchEntity()``, ``newEntities()`` 及び ``patchEntities()``
メソッドを用いることによりどのアソシエーションがバリデーションされたか、
``options`` パラメーターを用いることによりどのバリデーションセットを適用させるかを
特定することができます。 ::

    $valid = $this->Articles->newEntity($article, [
      'associated' => [
        'Comments' => [
          'associated' => ['User'],
          'validate' => 'special',
        ]
      ]
    ]);

バリデーションは、ユーザーフォームやインターフェイスに主に利用され、その用途はテーブル内の
コラムをバリデーションすることに限られません。しかしながら、データ元がどこであったとしても、
データの統一性を維持することは重要です。この問題を解決するために、CakePHP は
"アプリケーションルール" と呼ばれる２段階目のバリデーションを提供します。
本件については、 :ref:`アプリケーションルールの適用 <application-rules>`
セクションにて詳述します。

コアバリデーションルール
=========================

CakePHP は ``Validation`` クラス内にバリデーションメソッドに関する基本的な構文を提供します。
バリデーションクラスには、色々な一般的なバリデーションのシチュエーションに対する、
様々な静的なメソッドが含まれます。

``Validation`` クラスにおける `API ドキュメント
<https://api.cakephp.org/3.x/class-Cake.Validation.Validation.html>`_ では、
利用可能なバリデーションのルールについてのリスト及び基本的な使い方が案内されております。

いくつかのバリデーションメソッドは、上限下限に関する条件や有効なオプションを設定することができます。
このような上限下限に関する条件や有効なオプションは、以下のように提供可能です。 ::

    $validator = new Validator();
    $validator
        ->add('title', 'minLength', [
            'rule' => ['minLength', 10]
        ])
        ->add('rating', 'validValue', [
            'rule' => ['range', 1, 5]
        ]);

追加のパラメーターが設定できるコアなルールには、 ``rule`` キーの中に、最初の要素として
ルールそのものを含むような配列が設定されるべきであり、その後のパラメーターには、
残りのパラメーターを含ませるべきです。
