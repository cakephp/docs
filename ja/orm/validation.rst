データの検証
############

:doc:`データを保存する</orm/saving-data>` 前におそらくそのデータが正しく
矛盾がないことを保証したいはずです。
CakePHP ではデータの検証には二つの段階があります:

1. リクエストデータがエンティティにコンバートされる前、
   データ型や書式まわりのバリデーションルールが適用されます。
2. データが保存される前、ドメインまたはアプリケーションルールが適用されます。
   これらのルールはアプリケーションのデータの一貫性の保証に役立ちます。

.. _validating-request-data:

エンティティ構築前のデータ検証
==============================

データからエンティティを構築する時、データの検証 (バリデーション) ができます。
データのバリデーションではデータの型、形状およびサイズなどを確認することができます。
既定ではリクエストデータがエンティティに変換される前に検証が行われます。
もしも何らかのバリデーションルールが通らなかった場合、
返されたエンティティはエラーを含んだ状態になります。
エラーのあるフィールドは返されたエンティティには含まれません。 ::

    $article = $articles->newEntity($this->request->getData());
    if ($article->errors()) {
        // エンティティ検証失敗。
    }

バリデーションが有効になっている状態でエンティティを構築すると、次のことが起こります:

1. バリデータオブジェクトが作成されます。
2. ``table`` および ``default`` バリデーションプロバイダが追加されます。
3. 命名に沿ったバリデーションメソッドが呼び出されます。たとえば ``validationDefault`` 。
4. ``Model.buildValidator`` イベントが発動します。
5. リクエストデータが検証されます。
6. リクエストデータがそのカラム型に対応する型に変換されます。
7. エラーがエンティティにセットされます。
8. 正しいデータはエンティティに設定されますが、
   検証を通らなかったフィールドは除外されます。

もしもリクエストデータを変換する時にバリデーションを無効にしたければ、
``validate`` オプションに偽を指定してください。 ::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => false]
    );

``patchEntity()`` メソッドについても同じことが言えます。 ::

    $article = $articles->patchEntity($article, $newData, [
        'validate' => false
    ]);

既定のバリデーションセットの作成
================================

バリデーションルールは規約ではテーブルクラス中で定義されます。
何のデータが検証されるかとあわせてどこで保存されるかも定義します。


テーブル中で既定のバリデーションオブジェクトを作るには、
``validationDefault()`` 関数を作成します。 ::

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

有効なバリデーションメソッドやルールは ``Validator`` クラスによって提供され
:ref:`creating-validators` の節に記載されています。

.. note::

    バリデーションオブジェクトは主にユーザー入力の検証用に意図されています。
    たとえば、フォームやその他の投稿されたリクエストデータです。


異なるバリデーションセットの使用
================================

バリデーションを無効にすることに加えて
適用させたいバリデーションルールを選ぶこともできます。 ::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => 'update']
    );

上記は必要なルールを構築するために、そのテーブルインスタンスの ``validationUpdate()``
メソッドを呼び出します。既定では ``validationDefault()`` メソッドが使用されます。
記事テーブル用のバリデータの一例はこのようになります。 ::

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

必要に応じていくつものバリデーションセットを設けることができます。
バリデーションルールセットの構築についてのより多くの情報は :doc:`バリデーション
</core-libraries/validation>` を参照してください。


.. _using-different-validators-per-association:

アソシエーションに異なるバリデーションセットを使用
--------------------------------------------------

バリデーションセットはアソシエーションごとに定義することもできます。
``newEntity()`` または ``patchEntity()`` メソッドを使用する時、
変換されるアソシエーション各々に追加のオプションを渡すことができます。 ::

   $data = [
        'title' => '私の肩書き',
        'body' => 'テキスト',
        'user_id' => 1,
        'user' => [
            'username' => 'マーク'
        ],
        'comments' => [
            ['body' => '一番目のコメント'],
            ['body' => '二番目のコメント'],
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
その構築過程を複数の手順に分割することは簡単です。 ::

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

上の手順では、 ``hardened`` バリデーションセットを使う時には
``default`` セット中で定義されているバリデーションルールも含むことになります。

バリデーションプロバイダ
========================

バリデーションルールは既知のあらゆるプロバイダで定義されている関数を使うことができます。
既定では CakePHP はいくつかのプロバイダを設定します:

1. ``table`` プロバイダではテーブルクラスまたはそのビヘイビアのメソッドが有効です。
2. コアの :php:class:`~Cake\\Validation\\Validation` クラスが
   ``default`` プロバイダとしてセットアップされます。

バリデーションルールを作る時に、そのルールのプロバイダ名を指定できます。
たとえば、もしあなたのテーブルが ``isValidRole`` メソッドを持っているとすれば
それをバリデーションルールとして使うことができます。 ::

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            $validator
                ->add('role', 'validRole', [
                    'rule' => 'isValidRole',
                    'message' => __('有効な権限を指定する必要があります'),
                    'provider' => 'table',
                ]);
            return $validator;
        }

        public function isValidRole($value, array $context)
        {
            return in_array($value, ['admin', 'editor', 'author'], true);
        }

    }

バリデーションルールにはクロージャも使うことができます。 ::

    $validator->add('name', 'myRule', [
        'rule' => function ($data, $provider) {
            if ($data > 1) {
                return true;
            }
            return '適切な値ではありません。';
        }
    ]);

バリデーションメソッドは通らない時にエラーメッセージを返すことができます。
これは渡された値に動的に基づくエラーメッセージを作るための簡単な方法です。

テーブルからのバリデータ取得
============================

テーブルクラスにバリデーションセットを作成した後は、
名前を指定して結果のオブジェクトを取得できるようになります。 ::

    $defaultValidator = $usersTable->validator('default');

    $hardenedValidator = $usersTable->validator('hardened');

既定のバリデータクラス
======================

上述の通り、既定ではバリデーションメソッドは
``Cake\Validation\Validator`` のインスタンスを受け取ります。
そうではなくて、カスタムバリデータのインスタンスが毎回ほしいのであれば、
テーブルの ``$_validatorClass`` プロパティを使うことができます。 ::

    // あなたのテーブルクラスの中で
    public function initialize(array $config)
    {
        $this->_validatorClass = '\FullyNamespaced\Custom\Validator';
    }

.. _application-rules:

アプリケーションルールの適用
============================

:ref:`リクエストデータがエンティティに変換される <validating-request-data>` 時、
基本的なデータ検証が行われますが、多くのアプリケーションは
基本的な検証が完了した後にのみ適用されるもっと複雑な検証も設けています。

バリデーションはデータの形式や構文が正しいことを保証する一方、 ルールは
あなたのアプリケーションやネットワークの既存の状態に対してデータを比較することに
焦点を当てます。

この種のルールはしばしば「ドメインルール」や「アプリケーションルール」と言われます。
CakePHP は、エンティティが保存される前に適用される「ルールチェッカー」を通して
これを行います。いくつかのドメインルールの例は次のようになります:

* メールアドレスの一意性の保証。
* ステータス遷移や業務フローの手順 (たとえば、請求書のステータス更新)。
* 論理削除されたアイテムの更新の抑制。
* 使用量／料金の上限の強制。

ドメインルールは ``save()`` および ``delete()`` メソッドを呼ぶとチェックされます。

ルールチェッカーの作成
----------------------

ルールチェッカークラスは一般にテーブルクラスの ``buildRules()``
メソッドで定義されます。ビヘイビアや他のイベントの受け手は
与えられたテーブルクラスのルールチェッカーを受け取るために ``Model.buildRules``
イベントを使うことができます。 ::

    use Cake\ORM\RulesChecker;

    // テーブルクラスの中で
    public function buildRules(RulesChecker $rules)
    {
        // 作成および更新操作に提供されるルールを追加
        $rules->add(function ($entity, $options) {
            // 失敗／成功を示す真偽値を返す
        }, 'ruleName');

        // 作成のルールを追加
        $rules->addCreate(function ($entity, $options) {
            // 失敗／成功を示す真偽値を返す
        }, 'ruleName');

        // 更新のルールを追加
        $rules->addUpdate(function ($entity, $options) {
            // 失敗／成功を示す真偽値を返す
        }, 'ruleName');

        // 削除のルールを追加
        $rules->addDelete(function ($entity, $options) {
            // 失敗／成功を示す真偽値を返す
        }, 'ruleName');

        return $rules;
    }

ルールの関数はチェックされるエンティティとオプションの配列を期待します。
オプションの配列は ``errorField`` 、 ``message`` 、そして ``repository`` を含みます。
``repository`` オプションはルールが追加されるテーブルクラスを含みます。 
ルールはあらゆる ``callable`` を受け取るので、インスタンス関数を使うこともできます。 ::

    $rules->addCreate([$this, 'uniqueEmail'], 'uniqueEmail');

または呼び出し可能なクラスも使えます。 ::

    $rules->addCreate(new IsUnique(['email']), 'uniqueEmail');

ルールを追加する時、任意でルールが適用されるフィールドやエラーメッセージ
を定義することができます。 ::

    $rules->add([$this, 'isValidState'], 'validState', [
        'errorField' => 'status',
        'message' => 'この請求書はそのステータスに遷移できません。'
    ]);

エンティティの ``errors()`` メソッドを呼ぶとエラーを確認できます。 ::

    $entity->errors(); // ドメインルールのエラーメッセージを含んでいます

一意フィールドルールの作成
--------------------------

一意ルールは極めて一般的なので、CakePHP は一意フィールドの組み合わせを定義できる
単純なルールクラスを内包しています。 ::

    use Cake\ORM\Rule\IsUnique;

    // 一つのフィールド
    $rules->add($rules->isUnique(['email']));

    // フィールドのリスト
    $rules->add($rules->isUnique(['username', 'account_id']));

外部キーフィールドのルールを設定する時には、
ルールでは列挙したフィールドのみが使われるのを覚えておくことが重要です。
これは ``$user->account->id`` を変更しても上記のルールは発動しないことを意味します。


外部キールール
--------------

制約を強制するためにデータベースエラーに頼ることもできますが、
ルールのコードはより良いユーザーエクスペリエンスを提供するのに役立ちます。
このために CakePHP は ``ExistsIn`` ルールクラスを内包しています。 ::

    // 一つのフィールド
    $rules->add($rules->existsIn('article_id', 'articles'));

    // 複数キー。複合主キーに役立ちます。
    $rules->add($rules->existsIn(['site_id', 'article_id'], 'articles'));

存在をチェックするための関連テーブルのフィールドは主キーの一部でなければなりません。

複合外部キーの null が可能な部分が null の時、 ``existsIn`` が通るように強制することができます。 ::

    // 例: NodesTable の複合主キーは (id, site_id) です。
    // Node は、親 Node を参照しますが、必須ではありません。参照しない場合、parent_id が null になります。
    // たとえ null が可能なフィールド (parent_id のような) が null であっても、このルールが通ることを許可します。
    $rules->add($rules->existsIn(
        ['parent_id', 'site_id'], // Schema: parent_id NULL, site_id NOT NULL
        'ParentNodes',
        ['allowNullableNulls' => true]
    ));

    // それに加えて Node は、常に Site を参照してください。
    $rules->add($rules->existsIn(['site_id'], 'Sites'));

.. versionadded:: 3.3.0
    ``allowNullableNulls`` オプションが追加されました。

アソシエーションカウントルール
------------------------------

プロパティやアソシエーションが正しい件数かどうかの検証が必要な場合、
``validCount()`` ルールが利用できます。 ::

    // 記事にタグは５つ以内。
    $rules->add($rules->validCount('tags', 5, '<=', 'You can only have 5 tags'));

ルールに基づく件数を定義する際、第３引数は、比較演算子を定義します。
比較には ``==``, ``>=``, ``<=``, ``>``, ``<``, そして ``!=`` が使えます。
プロパティの件数が範囲内であることを保証するために、２つのルールを使用してください。 ::

    // タグは３つ以上、５つ以内
    $rules->add($rules->validCount('tags', 3, '>=', 'タグは 3 つ以上必要です'));
    $rules->add($rules->validCount('tags', 5, '<=', 'タグは 5 つ以下です'));

.. versionadded:: 3.3.0
    ``validCount()`` メソッドは、3.3.0 で追加されました。
    

エンティティメソッドをルールとして使用
--------------------------------------

ドメインルールとしてエンティティのメソッドを使いたいかもしれません。 ::

    $rules->add(function ($entity, $options) {
        return $entity->isOkLooking();
    }, 'ruleName');

再利用可能なカスタムルールの作成
--------------------------------

カスタムドメインルールを再利用したい事もあるでしょう。それには、
独自の呼び出し可能なルールを作成することによって行います。 ::

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

そのようなルールを作成する方法の例として、コアのルールを確認してください。

カスタムルールオブジェクト作成
------------------------------

もしもアプリケーションがよく再利用されるルールを持っているのであれば、
再利用可能なクラスにそうしたルールをまとめると役に立ちます。 ::

    // src/Model/Rule/CustomRule.php の中で
    namespace App\Model\Rule;

    use Cake\Datasource\EntityInterface;

    class CustomRule
    {
        public function __invoke(EntityInterface $entity, array $options)
        {
            // 何かする
            return false;
        }
    }


    // カスタムルールの追加
    use App\Model\Rule\CustomRule;

    $rules->add(new CustomRule(...), 'ruleName');

カスタムルールクラスを作ることでコードを *重複がない状態* 
(訳注：DRY = Don't Repeat Yourself の訳)
に保つことができ、またドメインルールを簡単にテストできるようになります。

ルールの無効化
--------------

エンティティを保存する時、必要であればルールを無効にできます。 ::

    $articles->save($article, ['checkRules' => false]);


バリデーション対アプリケーションルール
======================================

CakePHP の ORM は検証に二層のアプローチを使う点がユニークです。

一層目はバリデーションです。バリデーションルールは、ステートレスな方法の操作を意図しています。
それらは、形状、データ型、データの書式が正しいことを保証するために最もよく作用します。

二層目は、アプリケーションルールです。アプリケーションルールは、あなたのエンティティの
ステートフルなプロパティのチェックに最もよく作用します。例えば、バリデーションルールは、
メールアドレスが有効なことを保証することができますが、アプリケーションルールは、
メールアドレスがユニークであることを保証できます。

すでに見てきた通りに、一層目は ``newEntity()`` か ``patchEntity()`` を呼ぶ時に
``Validator`` オブジェクトを通して行われます。 ::

    $validatedEntity = $articlesTable->newEntity(
        $unsafeData,
        ['validate' => 'customName']
    );
    $validatedEntity = $articlesTable->patchEntity(
        $entity,
        $unsafeData,
        ['validate' => 'customName']
    );

上記の例では、 ``validationCustomName()`` メソッドを使って定義される
「カスタム」バリデータを使用します。 ::

    public function validationCustom($validator)
    {
        $validator->add(...);
        return $validator;
    }

バリデーションは文字列や配列を渡されることを想定しています。
それらがリクエストから得られるものですので::

    // src/Model/Table/UsersTable.php の中で
    public function validatePasswords($validator)
    {
        $validator->add('confirm_password', 'no-misspelling', [
            'rule' => ['compareWith', 'password'],
            'message' => 'パスワードが一致しません',
        ]);

        ...
        return $validator;
    }

バリデーションはエンティティのプロパティを直接設定した時には起動 **しません** 。 ::

    $userEntity->email = 'not an email!!';
    $usersTable->save($userEntity);

上記の例では、バリデーションは ``newEntity()`` と ``patchEntity()``
メソッドのためにのみ起動されるので、エンティティは保存されてしまうことになります。
検証の第二層がこの状況に対処します。

アプリケーションルールは上で説明したように
``save()`` か ``delete()`` が呼ばれるといつでもチェックされます。 ::

    // src/Model/Table/UsersTable.php の中で
    public function buildRules(RulesChecker $rules)
    {
        $rules->add($rules->isUnique('email'));
        return $rules;
    }

    // アプリケーションのコード中のどこかで
    $userEntity->email = 'a@duplicated.email';
    $usersTable->save($userEntity); // 偽を返します

バリデーションは直接のユーザ入力を意図しており、アプリケーションルールは
アプリケーション中で生成されたデータの変更に特化しています。 ::

    // src/Model/Table/OrdersTable.php の中で
    public function buildRules(RulesChecker $rules)
    {
        $check = function($order) {
            return $order->price < 100 && $order->shipping_mode === 'free';
        };
        $rules->add($check, [
            'errorField' => 'shipping_mode',
            'message' => '100ドル以下の注文を送料無料にはできません！'
        ]);
        return $rules;
    }

    // アプリケーションのコード中のどこかで
    $order->price = 50;
    $order->shipping_mode = 'free';
    $ordersTable->save($order); // 偽を返します


バリデーションをアプリケーションルールとして使用
------------------------------------------------

ある状況ではユーザーあるいはアプリケーションによって生成されたデータの
両方に対して同じ検証の処理を走らせたいかもしれません。
これは、エンティティのプロパティを直接設定するようなCLIスクリプトを走らせる時に
起こり得るでしょう。 ::

    // src/Model/Table/UsersTable.php の中で
    public function validationDefault(Validator $validator)
    {
        $validator->add('email', 'valid', [
            'rule' => 'email',
            'message' => '無効なメールアドレスです'
        ]);
        ...
        return $validator;
    }

    public function buildRules(RulesChecker $rules)
    {
        // アプリケーションルールの追加
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

保存が実行されると、追加された新しいアプリケーションのおかげで失敗します。 ::

    $userEntity->email = 'not an email!!!';
    $usersTable->save($userEntity);
    $userEntity->errors('email'); // 無効なメールアドレスです

同じ結果が ``newEntity()`` や ``patchEntity()`` を使う時にも期待できます。 ::

    $userEntity = $usersTable->newEntity(['email' => 'not an email!!']);
    $userEntity->errors('email'); // 無効なメールアドレスです
