データの保存
############

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

:doc:`データを読み出した</orm/retrieving-data-and-resultsets>` 後は、
おそらく更新を行ってその変更を保存したいでしょう。

データ保存の概要
================

アプリケーションは通常、データが保存されるいくつかの方法を持っています。
最初のひとつは言うまでもなくウェブフォームを通して、
また他の方法としてはコード中で直接データを生成または変更して、
データベースに送られるようにすることです。

データの挿入
------------

データベースにデータを挿入する最も簡単な方法は、新しいエンティティを作成して
それを ``Table`` クラスの ``save()`` に渡すことです。 ::

    use Cake\ORM\TableRegistry;

    $articlesTable = TableRegistry::get('Articles');
    $article = $articlesTable->newEntity();

    $article->title = '新しい記事';
    $article->body = 'これは記事の本文です';

    if ($articlesTable->save($article)) {
        // $article エンティティは今や id を持っています
        $id = $article->id;
    }

データの更新
------------

データの更新は同じく簡単で、そして ``save()`` メソッドはこの目的でもまた使用されます。 ::

    use Cake\ORM\TableRegistry;

    $articlesTable = TableRegistry::get('Articles');
    $article = $articlesTable->get(12); // id 12 の記事を返します

    $article->title = 'CakePHP は最高のフレームワークです！';
    $articlesTable->save($article);

CakePHP は挿入または更新のいずれの処理を行うかを ``isNew()`` メソッドの返値に基づいて知ります。
``get()`` や ``find()`` で返されたエンティティは、 ``isNew()`` が呼ばれた時には常に ``false``
を返します。

アソシエーションの保存
----------------------

既定では ``save()`` メソッドはアソシエーションの一階層目も保存します。 ::

    $articlesTable = TableRegistry::get('Articles');
    $author = $articlesTable->Authors->findByUserName('mark')->first();

    $article = $articlesTable->newEntity();
    $article->title = 'mark の記事';
    $article->author = $author;

    if ($articlesTable->save($article)) {
        // 外部キー値は自動でセットされます。
        echo $article->author_id;
    }

``save()`` メソッドはアソシエーションのレコードも作成することができます。 ::

    $firstComment = $articlesTable->Comments->newEntity();
    $firstComment->body = 'CakePHP の機能は傑出しています';

    $secondComment = $articlesTable->Comments->newEntity();
    $secondComment->body = 'CakePHP のパフォーマンスは素晴らしい！';

    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag2 = $articlesTable->Tags->newEntity();
    $tag2->name = 'すごい';

    $article = $articlesTable->get(12);
    $article->comments = [$firstComment, $secondComment];
    $article->tags = [$tag1, $tag2];

    $articlesTable->save($article);

多対多レコードの関連付け
------------------------

前の例は一つの記事といくつかのタグを関連付ける方法を例示しています。
同じことをするための別の方法として、アソシエーション側で
``link()`` メソッドを使用する方法があります。 ::

    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag2 = $articlesTable->Tags->newEntity();
    $tag2->name = 'すごい';

    $articlesTable->Tags->link($article, [$tag1, $tag2]);

結合用テーブルへのデータ保存
----------------------------

結合用テーブルへのデータ保存は、特別な ``_joinData`` プロパティを使用して行われます。
このプロパティは結合用の Table クラスの ``Entity`` インスタンスになっているはずです。 ::

    // 最初にレコードを紐付けます。
    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag1->_joinData = $articlesTable->ArticlesTags->newEntity();
    $tag1->_joinData->tagComment = 'CakePHP の ORM は実に強力です！';

    $articlesTable->Tags->link($article, [$tag1]);

    // 既存のアソシエーションを更新します。
    $article = $articlesTable->get(1, ['contain' => ['Tags']]);
    $article->tags[0]->_joinData->tagComment = '新しいコメント。'

    // 必須です。なぜならプロパティを直接変更しているからです。
    $article->dirty('tags', true);

    $articlesTable->save($article, ['associated' => ['Tags']]);

``newEntity()`` や ``patchEntity()`` を使う時に、結合用テーブルの情報もまた
作成／更新することができます。 POST データはこうなります。 ::

    $data = [
        'title' => '私の素晴らしいブログ投稿',
        'body' => '何かのコンテンツが少し続きます。',
        'tags' => [
            [
                'id' => 10,
                '_joinData' => [
                    'tagComment' => '素晴らしい記事です！',
                ]
            ],
        ]
    ];
    $articlesTable->newEntity($data, ['associated' => ['Tags']]);

多対多レコードの紐付け解除
--------------------------

多対多レコードの紐付け解除は ``unlink()`` メソッドを通して行われます。 ::

    $tags = $articlesTable
        ->Tags
        ->find()
        ->where(['name IN' => ['cakephp', 'すごい']])
        ->toArray();

    $articlesTable->Tags->unlink($article, $tags);

プロパティを直接設定または変更してレコードを更新した時は、データ検証は行われませんので、
フォームデータを受け取る時にはこれは問題になります。次のセクションでは、
データが検証されて保存されるように、効果的にエンティティに変換するための方法を例示します。

.. _converting-request-data:

リクエストデータのエンティティへの変換
======================================

データを変更してデータベースに保存して戻す前に、リクエストデータを
リクエスト中の配列形式から変換する必要があります。ORM が使用するエンティティです。
Table クラスは、リクエストデータを一つまたは複数のエンティティに変換するための
簡単で効果的な方法を提供します。単一のエンティティの変換には次の方法を使います。 ::

    // コントローラの中で
    $articles = TableRegistry::get('Articles');

    // 検証して Entity オブジェクトに変換します。
    $entity = $articles->newEntity($this->request->data());

.. note::

    もし newEntity() を使っていて、返されてきたエンティティが渡したデータのいくつか
    またはすべてを失っている場合は、設定したいカラムがそのエンティティの
    ``$_accessible`` プロパティに列挙されているかをもう一度確認してみてください。
    :ref:`entities-mass-assignment` をご覧ください。

リクエストデータはあなたのエンティティの構造に従っていなければなりません。
例えば、もしも一つの記事が、一人のユーザーに属していて、複数のコメントを持っているなら、
リクエストデータはこうなっているはずです。 ::

    $data = [
        'title' => '勝利のための CakePHP',
        'body' => 'CakePHP でのベーキングはウェブ開発を楽しくします！',
        'user_id' => 1,
        'user' => [
            'username' => 'mark'
        ],
        'comments' => [
            ['body' => 'CakePHP の機能は傑出しています'],
            ['body' => 'CakePHP のパフォーマンスは素晴らしい！'],
        ]
    ];

既定では、 :ref:`validating-request-data` のセクションで説明している通り、 ``newEntity()``
メソッドは渡されたデータを検証します。もし、検証を回避したければ ``'validate' => false``
オプションを渡してください。 ::

    $entity = $articles->newEntity($data, ['validate' => false]);

入れ子になったアソシエーションを保存するフォームを作る時は、
どのアソシエーションが変換されるべきかを定義する必要があります。 ::

    // コントローラの中で
    $articles = TableRegistry::get('Articles');

    // 入れ子になったアソシエーション付きの新しいエンティティ
    $entity = $articles->newEntity($this->request->data(), [
        'associated' => [
            'Tags', 'Comments' => ['associated' => ['Users']]
        ]
    ]);

入れ子になったアソシエーションの変換を無効にする時は、次のようになります。 ::

    $entity = $articles->newEntity($data, ['associated' => []]);
    // または...
    $entity = $articles->patchEntity($entity, $data, ['associated' => []]);

上記は 'Tags' 、 'Comments' そして Comments 用の 'Users' が変換されるべきであること
を示しています。代わりに、簡潔にするためにドット記法を使うことができます。 ::

    // コントローラの中で
    $articles = TableRegistry::get('Articles');

    // ドット記法を用いた、入れ子になったアソシエーション付きの新しいエンティティ
    $entity = $articles->newEntity($this->request->data(), [
        'associated' => ['Tags', 'Comments.Users']
    ]);

関連付けられたデータもまた、指定しない限り、既定では検証されます。
アソシエーションごとに使われる検証セットを変更することもできます。 ::

    // コントローラの中で
    $articles = TableRegistry::get('Articles');

    // Tags アソシエーションの検証を回避して
    // Comments.Users 用に 'signup' の検証セットを指定します
    $entity = $articles->newEntity($this->request->data(), [
        'associated' => [
            'Tags' => ['validate' => false],
            'Comments.Users' => ['validate' => 'signup']
        ]
    ]);

関連付けられた変換のために、異なる検証を使用する方法に関する詳しい情報は、
:ref:`using-different-validators-per-association` の章をご覧ください。

以下の図表は ``newEntity()`` または ``patchEntity()`` メソッドの内部で
どんなことが起きるのかの概要を示しています。

.. figure:: /_static/img/validation-cycle.png
   :align: left
   :alt: Flow diagram showing the marshalling/validation process.

``newEntity()`` からはいつでもエンティティが返されることを当てにすることができます。
もし検証に失敗した場合、エンティティはエラーを含んでいる状態になり、
無効なフィールドはどれも作成されたエンティティ上には設定されません。

BelongsToMany データの変換
--------------------------

もし belongsToMany アソシエーションを保存しようとしている場合は、
エンティティデータのリストまたは ID のリストを使うことができます。
エンティティデータのリストを使うときはリクエストデータはこうなるべきです。 ::

    $data = [
        'title' => '私のタイトル',
        'body' => '本文',
        'user_id' => 1,
        'tags' => [
            ['tag' => 'CakePHP'],
            ['tag' => 'インターネット'],
        ]
    ];

上記は二つの新しいタグを作成します。もし既存のタグをある記事に紐付けたいのであれば
ID のリストを使うことができます。リクエストデータはこうなるべきです。 ::

    $data = [
        'title' => '私のタイトル',
        'body' => '本文',
        'user_id' => 1,
        'tags' => [
            '_ids' => [1, 2, 3, 4]
        ]
    ];

もし何らかの既存の belongsToMany レコードを紐付ける必要があって、かつ同時に
新規のものも作成する必要があるのであれば、拡張の形式を使うことができます。 ::

    $data = [
        'title' => '私のタイトル',
        'body' => '本文',
        'user_id' => 1,
        'tags' => [
            ['name' => '新しいタグ'],
            ['name' => '別の新しいタグ'],
            ['id' => 5],
            ['id' => 21]
        ]
    ];

上記のデータがエンティティに変換されるとき、四つのタグを持つことになります。
最初の二つは新規オブジェクトで、次の二つは既存レコードを参照することになります。

belongsToMany データを変換するときは、 ``onlyIds`` オプションを使って、
新しいエンティティの作成を行わなくすることができます。有効にすると、このオプションは
belongsToMany の変換を ``_ids`` キーの使用のみに制限して、他のすべてのデータを無視します。

.. versionadded:: 3.1.0
    ``onlyIds`` オプションは 3.1.0 で追加されました。

HasMany データの変換
--------------------

もし、既存の hasMeny アソシエーションを更新したり、それらのプロパティを更新したい場合、
エンティティに hasMany アソシエーションが設定されていることを最初に確認する必要があります。
そのとき、以下のようなリクエストデータが使えます。 ::

    $data = [
        'title' => 'My Title',
        'body' => 'The text',
        'comments' => [
            ['id' => 1, 'comment' => 'Update the first comment'],
            ['id' => 2, 'comment' => 'Update the second comment'],
            ['comment' => 'Create a new comment'],
        ]
    ];

もし hasMany アソシエーションを保存しようとしている場合で、既存のレコードを
新しい親レコードに紐付けたいのであれば、 ``_ids`` 形式を使うことができます。 ::

    $data = [
        'title' => '私の新しい記事',
        'body' => '本文',
        'user_id' => 1,
        'comments' => [
            '_ids' => [1, 2, 3, 4]
        ]
    ];

hasMany データを変換するときは、 ``onlyIds`` オプションを使って、
新しいエンティティの作成を行わなくすることができます。有効にすると、このオプションは
belongsToMany の変換を ``_ids`` キーの使用のみに制限して、他のすべてのデータを無視します。

.. versionadded:: 3.1.0
    ``onlyIds`` オプションは 3.1.0 で追加されました。

複数レコードの変換
------------------

一度に複数のレコードを作成／更新するフォームを作るときは、 ``newEntities()``
を使うことができます。 ::

    // コントローラの中で。
    $articles = TableRegistry::get('Articles');
    $entities = $articles->newEntities($this->request->data());

この場合には、複数の記事用のリクエストデータはこうなるべきです。 ::

    $data = [
        [
            'title' => '一番目の投稿',
            'published' => 1
        ],
        [
            'title' => '二番目の投稿',
            'published' => 1
        ],
    ];

リクエストデータをエンティティに変換し終えたら、それらを ``save()`` または ``delete()``
できます。 ::

    // コントローラの中で。
    foreach ($entities as $entity) {
        // エンティティを保存
        $articles->save($entity);

        // エンティティを削除
        $articles->delete($entity);
    }

上記は各エンティティの保存で個別のトランザクションが走ります。もし単一のトランザクションで
すべてのエンティティを処理したいのであれば、 ``transactional()`` を使うことができます。 ::

    // コントローラの中で。
    $articles->connection()->transactional(function () use ($articles, $entities) {
        foreach ($entities as $entity) {
            $articles->save($entity, ['atomic' => false]);
        }
    });


.. _changing-accessible-fields:

アクセス可能なフィールドの変更
------------------------------

``newEntity()`` に、アクセス不可能なフィールドに書き込ませることもできます。
例えば ``id`` は通常は ``_accessible`` プロパティから外れます。
そうした場合には、 ``accessibleFields`` オプションを使うことができます。
これは関連付けられたエンティティの ID を維持するために便利かもしれません。 ::

    // コントローラの中で
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->data(), [
        'associated' => [
            'Tags', 'Comments' => [
                'associated' => [
                    'Users' => [
                        'accessibleFields' => ['id' => true]
                    ]
                ]
            ]
        ]
    ]);

上記では、問題のエンティティについては Comments と Users の間でのアソシエーションが
変わらずに維持されます。

.. note::

    もし newEntity() を使っていて、返されてきたエンティティが渡したデータのいくつか
    またはすべてを失っている場合は、設定したいカラムがそのエンティティの
    ``$_accessible`` プロパティに列挙されているかをもう一度確認してみてください。
    :ref:`entities-mass-assignment` をご覧ください。

リクエストデータをエンティティにマージ
--------------------------------------

エンティティを更新するためには、既存のエンティティに対して直接リクエストデータを適用することを
選んでもよいです。これは、データベースに保存するためにすべてのフィールドを送るのとは対照的に、
実際に変更されたフィールドのみが保存されるようにできる利点があります。 ``patchEntity()`` を使って、
生データの配列を既存のエンティティにマージすることができます。 ::

    // コントローラの中で。
    $articles = TableRegistry::get('Articles');
    $article = $articles->get(1);
    $articles->patchEntity($article, $this->request->data());
    $articles->save($article);


検証と patchEntity
~~~~~~~~~~~~~~~~~~

``newEntity()`` と同じように、 ``patchEntity`` メソッドは、データがエンティティにコピーされる前に
検証を行います。このメカニズムは :ref:`validating-request-data` のセクションで説明されています。
エンティティにパッチを当てる際に検証を無効にしたいのであれば、 ``validate``
オプションを渡してください。 ::

    // コントローラの中で。
    $articles = TableRegistry::get('Articles');
    $article = $articles->get(1);
    $articles->patchEntity($article, $data, ['validate' => false]);

当該のエンティティ、または何らかのアソシエーションに対して使われる検証セットを
変更することもできます。 ::

    $articles->patchEntity($article, $this->request->data(), [
        'validate' => 'custom',
        'associated' => ['Tags', 'Comments.Users' => ['validate' => 'signup']]
    ]);

HasMany と BelongsToMany へのパッチ
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

前のセクションで説明したように、リクエストデータはあなたのエンティティの構造に従っていなければ
なりません。 ``patchEntity()`` メソッドはアソシエーションをマージする能力も同じく持っていて、
既定ではアソシエーションの一階層目のみがマージされますが、マージされるアソシエーションを制御したい、
または深い深い階層についてマージしたい場合、メソッドの第三引数を使うことができます。 ::

    // コントローラの中で。
    $associated = ['Tags', 'Comments.Users'];
    $article = $articles->get(1, ['contain' => $associated]);
    $articles->patchEntity($article, $this->request->data(), [
        'associated' => $associated
    ]);
    $articles->save($article);

アソシエーションは、元のエンティティの主キーフィールドを、データ配列中に含まれているフィールドに
マッチさせることでマージを行います。もしもアソシエーションの対象のプロパティに
前のエンティティがなければ、アソシエーションは新しくエンティティを構築します。

例えば、次のような何らかのリクエストデータを与えます。 ::

    $data = [
        'title' => '私のタイトル',
        'user' => [
            'username' => 'mark'
        ]
    ];

user プロパティの中にエンティティない状態で、エンティティへのパッチを試みると、
新しい user エンティティが作成されます。 ::

    // コントローラの中で
    $entity = $articles->patchEntity(new Article, $data);
    echo $entity->user->username; // 'mark' を出力します

hasMany の belongsToMany アソシエーションについても同じことが言えますが、
以下の注意点があります。

.. note::

    belongsToMany アソシエーションについては、関連付けられたエンティティ用のプロパティが
    アクセス可能になっているようにしてください。

もし、 Product belongsToMany Tag であれば、こうなります。 ::

    // Product エンティティの中で
    protected $_accessible = [
        // .. 他のプロパティ
       'tags' => true,
    ];

.. note::

    hasMany と belongsToMany アソシエーションでは、もしデータ配列中のレコードと
    主キーがマッチしないエンティティがあった場合、それらのレコードは結果のエンティティから
    除かれてしまいます。

    ``patchEntity()`` も ``patchEntities()`` もデータを保存するわけではないことを
    覚えていてください。単に与えられたエンティティを変更（または作成）するだけです。
    エンティティを保存するためには、そのテーブルの ``save()`` メソッドを呼ばなければなりません。

例えば、以下の場合を考えてみてください。 ::

    $data = [
        'title' => '私のタイトル',
        'body' => '本文',
        'comments' => [
            ['body' => '一番目のコメント', 'id' => 1],
            ['body' => '二番目のコメント', 'id' => 2],
        ]
    ];
    $entity = $articles->newEntity($data);
    $articles->save($entity);

    $newData = [
        'comments' => [
            ['body' => '変更されたコメント', 'id' => 1],
            ['body' => '新しいコメント'],
        ]
    ];
    $articles->patchEntity($entity, $newData);
    $articles->save($entity);


最後に、もしエンティティが配列に変換されて戻されたとしたら、
以下のような結果を得ることになります。 ::

    [
        'title' => '私のタイトル',
        'body' => '本文',
        'comments' => [
            ['body' => '変更されたコメント', 'id' => 1],
            ['body' => '新しいコメント'],
        ]
    ];

ご覧のように、id が 2 のコメントはもはやなくなっています。 ``$newData`` 配列の
どのレコードにもマッチしなかったためです。これは、 CakePHP がリクエストデータに示された、
それが新規なのかどうかを反映させているために起こります。

この方法のいくつかの利点は、エンティティを再び保存する際に実行される多くの操作を
削減することにあります。

ただ、これは id 2 のコメントがデータベースから削除されたことを意味するものではない点に
注意してください。もし当該の記事へのコメントで、当該のエンティティの中にないもの
を削除したいのであれば、その主キーを集約してリストにないものの一括削除を実行してください。 ::

    // コントローラの中で。
    $comments = TableRegistry::get('Comments');
    $present = (new Collection($entity->comments))->extract('id')->filter()->toArray();
    $comments->deleteAll([
        'article_id' => $article->id,
        'id NOT IN' => $present
    ]);

ご覧のように、これはまたアソシエーションがシングルセットのように実装される必要がある場所で
問題を解決するのを助けます。

また一回で複数のエンティティに対してパッチをあてることもできます。
hasMany と belongsToMany アソシエーションに対してのパッチのために作られた考えでは、
主キーフィールドの値でマッチさせ、元のエンティティ配列の内、マッチできなかったものは
結果配列から取り除かれて現れない、というように複数のエンティティにパッチをあてます。 ::

    // コントローラの中で。
    $articles = TableRegistry::get('Articles');
    $list = $articles->find('popular')->toArray();
    $patched = $articles->patchEntities($list, $this->request->data());
    foreach ($patched as $entity) {
        $articles->save($entity);
    }

``patchEntity()`` を使うのに似ていて、配列中の各エンティティにマージされることになる
アソシエーションを制御するための第三引数を利用することができます。 ::

    // コントローラの中で。
    $patched = $articles->patchEntities(
        $list,
        $this->request->data(),
        ['associated' => ['Tags', 'Comments.Users']]
    );


.. _before-marshal:

エンティティ構築前のリクエストデータ変更
----------------------------------------

もしリクエストデータがエンティティに変換される前にそれらを変更する必要がある時は、
``Model.beforeMarshal`` イベントを利用することができます。
このイベントはエンティティが作成される直前に、リクエストデータを操作させてくれます。 ::

    // ファイルの先頭に use ステートメントを入れること。
    use Cake\Event\Event;
    use ArrayObject;

    // テーブルまたはビヘイビアクラスの中で
    public function beforeMarshal(Event $event, ArrayObject $data, ArrayObject $options)
    {
       if (isset($data['username'])) {
           $data['username'] = mb_strtolower($data['username']);
       }

``$data`` パラメータは ``ArrayObject`` のインスタンスですので、
エンティティを作成するのに使われるデータを変更するために return する必要はありません。

``beforeMarshal`` の主な目的は、単純な誤りを自動的に解決できる時や、
データが正しいフィールドに入るように再構成される必要がある時に、
検証プロセスを通過できるようにユーザーを支援することです。

``Model.beforeMarshal`` イベントは検証プロセスの開始時に引き起こされますが、
その理由は ``beforeMarshal`` では検証ルールや、フィールドのホワイトリストのような
保存オプションを変更できるようになっているからです。
検証はこのイベントが終了した直後に行われます。検証が行われる前にデータを変更をする
ありふれた例は、保存前に全フィールドをトリムすることです。 ::

    // ファイルの先頭に use ステートメントを入れること。
    use Cake\Event\Event;
    use ArrayObject;

    // テーブルまたはビヘイビアクラスの中で
    public function beforeMarshal(Event $event, ArrayObject $data, ArrayObject $options)
    {
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = trim($value);
            }
        }
    }

変換プロセスの動作の仕方の理由で、もしあるフィールドが検証に渡されない場合
それは自動的にデータ配列から削除されてエンティティにはコピーされません。
これはエンティティオブジェクトへの入力から整合性のないデータを防止するためです。

それから、 ``beforeMarshal`` 中のデータは渡されたデータのコピーです。
これは、他のどこかで使われるかもしれない、元のユーザー入力を保持するために重要だからです。

エンティティ構築前のデータ検証
------------------------------

:doc:`/orm/validation` の章には、データが正しく整合性を保ち続けられるようにするために
CakePHP の検証機能をどう使うかについてより詳しい情報があります。

プロパティのマスアサインメント攻撃の回避
----------------------------------------

リクエストデータからエンティティを作成またはマージする時には、エンティティ中で
ユーザーに何を変更させるか、または追加させるかについて注意深くある必要があります。
例えば、 ``user_id`` を含んでいるリクエスト中の配列を送ることで、
攻撃者は記事の所有者を変更することができ、望まない影響を引き起こします。 ::

    // ['user_id' => 100, 'title' => 'ハックしました！'] を含んでいます。
    $data = $this->request->data;
    $entity = $this->patchEntity($entity, $data);
    $this->save($entity);

この攻撃を防御するための二つの方法があります。最初の一つはエンティティの
:ref:`entities-mass-assignment` 機能を使うリクエストに対して安全に設定されるように
既定のカラムを設定することです。

二番目の方法はエンティティを作成またはマージする時に ``fieldList`` オプションを
利用することです。 ::

    // ['user_id' => 100, 'title' => 'ハックしました！'] を含んでいます。
    $data = $this->request->data;

    // タイトルのみ変更することを許します
    $entity = $this->patchEntity($entity, $data, [
        'fieldList' => ['title']
    ]);
    $this->save($entity);

アソシエーションにどのプロパティが割り当てられるかを制御することもできます。 ::

    // タイトルとタグのみ変更することを許し、
    // かつ、タグ名のみが設定可能なカラムです
    $entity = $this->patchEntity($entity, $data, [
        'fieldList' => ['title', 'tags'],
        'associated' => ['Tags' => ['fieldList' => ['name']]]
    ]);
    $this->save($entity);

この機能の利用は、多くの違った機能にユーザーがアクセス可能で、ユーザーに
権限に基づいて異なるデータを編集できるようにしたい時に便利です。

``fieldList`` オプションは ``newEntity()`` 、 ``newEntities()``
および ``patchEntities()`` メソッドでも受け入れられます。

.. _saving-entities:

エンティティの保存
==================

.. php:method:: save(Entity $entity, array $options = [])

リクエストデータをデータベースに保存する時は、 ``save()`` に渡すために、まず最初に
``newEntity()`` を使って新しいエンティティをハイドレートする必要があります。
例えばこうです。 ::

  // コントローラのの中で
  $articles = TableRegistry::get('Articles');
  $article = $articles->newEntity($this->request->data);
  if ($articles->save($article)) {
      // ...
  }

ORM は、挿入か更新のいずれが実行されるべきかを決定するために、エンティティの ``isNew()``
メソッドを使用します。もし ``isNew()`` が真を返し、エンティティが主キー値を持っていれば、
'exists' クエリが発行されます。 'exists' クエリは ``$options`` 引数に
``'checkExisting' => false`` を渡すことで抑制することができます。 ::

    $articles->save($article, ['checkExisting' => false]);

いくつかのエンティティが読み出した後は、おそらくそれらを変更して、
データベースを更新したいでしょう。これは CakePHP では実に単純な課題です。 ::

    $articles = TableRegistry::get('Articles');
    $article = $articles->find('all')->where(['id' => 2])->first();

    $article->title = '私の新しいタイトル';
    $articles->save($article);

保存する時は、 CakePHP は :ref:`ルールを適用して <application-rules>` 、
データベーストンザクションの保存操作を巻き取ります。また、変更のあったプロパティのみを更新します。
上記の ``save()`` の呼び出しは、こんな SQL を生成します。 ::

    UPDATE articles SET title = '私の新しいタイトル' WHERE id = 2;

もし新しいエンティティであれば、こんな SQL が生成されます。 ::

    INSERT INTO articles (title) VALUES ('私の新しいタイトル');

エンティティが保存されると、いくつかのことが起こります。

1. もし無効になっていなければ、ルールのチェックが開始されます。
2. ルールのチェックが ``Model.beforeRules`` イベントを引き起こします。もしイベントが
   停止されると、保存操作は失敗し、 ``false`` を返します。
3. ルールがチェックされます。もしエンティティが作成されようとしているのであれば、
   ``create`` ルールが使われます。もしエンティティが更新されようとしているのであれば、
   ``update`` ルールが使われます。
4. ``Model.afterRules`` イベントが引き起こされます。
5. ``Model.beforeSave`` イベントが発動されます。もし停止されると、保存は中止され、
   save() は ``false`` を返します。
6. 親のアソシエーションが保存されます。例えば、列挙されたあらゆる belongsTo アソシエーション
   が保存されます。
7. エンティティの modified フィールドが保存されます。
8. 子のアソシエーションが保存されます。例えば、列挙されたあらゆる hasMany 、 hasOne 、
   または belongsToMany アソシエーションが保存されます。
9. ``Model.afterSave`` イベントが発動されます。
10. ``Model.afterSaveCommit`` イベントが発動されます。

以下の図表は上記の工程を図解しています。

.. figure:: /_static/img/save-cycle.png
   :align: left
   :alt: Flow diagram showing the save process.

作成および更新のルールについてのより詳しい情報は :ref:`application-rules` のセクションを
参照してください。

.. warning::

    もしエンティティが保存される時に何も変更が行われていなければ、
    コールバックは呼び出されません。なぜなら、保存が実行されないからです。

``save()`` メソッドは成功時には変更されたエンティティを返し、失敗時には ``false`` を返します。
また save の ``$options`` 引数を使って、ルールやトランザクションを
無効にすることができます。 ::

    // コントローラまたはテーブルメソッドの中で
    $articles->save($article, ['checkRules' => false, 'atomic' => false]);

アソシエーションの保存
----------------------

エンティティを保存する時には、いくつかの、またはすべての関連付けらえれたエンティティを
保存するように選択することもできます。既定では、すべての一階層目のエンティティが保存されます。
例えば、 Article の保存は、 articles テーブルに直接関連付けられている
あらゆる dirty なエンティティもまた自動的に更新します。

``associated`` オプションを使うことで、どのエンティティが保存されるかを、
調整することができます。 ::

    // コントローラの中で

    // comments アソシエーションのみを保存します
    $articles->save($entity, ['associated' => ['Comments']]);

ドット記法を使うことで、遠くの、または深い入れ子のアソシエーションを
定義することができます。 ::

    // compaty 、その employees とそれぞれに関連する addresses を保存します。
    $companies->save($entity, ['associated' => ['Employees.Addresses']]);

さらに、アソシエーションのドット記法はオプションの配列で組み合わせることができます。 ::

    $companies->save($entity, [
      'associated' => [
        'Employees',
        'Employees.Addresses'
      ]
    ]);

エンティティはデータベースから読み出された時と同じ方法で構造化されていなければいけません。
:ref:`アソシエーションの入力をどう構築するか <associated-form-inputs>` についての
フォームヘルパーのドキュメントを参照してください。

もしもエンティティが構築された後で、アソシエーションのデータを構築または変更しようとしているなら、
アソシエーションのプロパティが変更されたことを ``dirty()`` で印さなければいけません。 ::

    $company->author->name = 'Master Chef';
    $company->dirty('author', true);

BelongsTo アソシエーションの保存
--------------------------------

belongsTo アソシエーションを保存する時は、 ORM は単一の入れ子のエンティティを、単数形で命名された、
:ref:`アンダースコア区切り <inflector-methods-summary>` のアソシエーション名で期待しています。
例えばこうです。 ::

    // コントローラの中で。
    $data = [
        'title' => '一番目の投稿',
        'user' => [
            'id' => 1,
            'username' => 'mark'
        ]
    ];
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Users']
    ]);

    $articles->save($article);

HasOne アソシエーションの保存
-----------------------------

hasOne アソシエーションを保存する時は、 ORM は単一の入れ子のエンティティを、単数形で命名された、
:ref:`アンダースコア区切り <inflector-methods-summary>` のアソシエーション名で期待しています。
例えばこうです。 ::

    // コントローラの中で。
    $data = [
        'id' => 1,
        'username' => 'cakephp',
        'profile' => [
            'twitter' => '@cakephp'
        ]
    ];
    $users = TableRegistry::get('Users');
    $user = $users->newEntity($data, [
        'associated' => ['Profiles']
    ]);
    $users->save($user);

HasMany アソシエーションの保存
------------------------------

hasMany アソシエーションを保存する時は、 ORM はエンティティの配列を、複数形で命名された、
:ref:`アンダースコア区切り <inflector-methods-summary>` のアソシエーション名で期待しています。
例えばこうです。 ::

    // コントローラの中で。
    $data = [
        'title' => '一番目の投稿',
        'comments' => [
            ['body' => 'これまでで最高の投稿'],
            ['body' => '私は実にこれが好きだ。']
        ]
    ];
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Comments']
    ]);
    $articles->save($article);

hasMany アソシエーションを保存する時は、 関連付けられたレコードは、更新されるか挿入されるかの
いずれかになります。レコードがデータベース中ですでに関連付けられたレコードを持っている場合、
二つの保存方法の選択肢があります。

append
    関連付けられたレコードはデータベース中で更新されるか、もしくは既存のどのレコードにも
    マッチしなければ、挿入されます。
replace
    与えられたレコードのいずれにもマッチしない既存のレコードはデータベースから削除され、
    与えられたレコードのみが残ります（もしくは挿入されます）。

既定では ``append`` の方法が使われます。

新しいレコードを既存のアソシエーションに追加する時はいつでも、そのアソシエーションのプロパティを
'dirty' として印さなければいけません。これが ORM に、アソシエーションのプロパティが
保存されなければならないことを伝えます。 ::

    $article->comments[] = $comment;
    $article->dirty('comments', true);

``dirty()`` の呼び出しがないと、更新された comments は保存されません。

BelongsToMany アソシエーションの保存
------------------------------------

belongsToMany アソシエーションを保存する時は、 ORM はエンティティの配列を、複数形で、
アンダースコア区切りのアソシエーション名で期待しています。例えばこうです。 ::

    // コントローラの中で。
    $data = [
        'title' => 'First Post',
        'tags' => [
            ['tag' => 'CakePHP'],
            ['tag' => 'Framework']
        ]
    ];
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Tags']
    ]);
    $articles->save($article);

リクエストデータをエンティティに変換する時は、 ``newEntity()`` と ``newEntities()``
メソッドが、両方のプロパティの配列や、 ``_ids`` キーでの ID のリストについても扱います。

``_ids`` キーの使用は、belongs to many アソシエーション用に、フォームコントロール上の
セレクトボックスやチェックボックスを構築するのを簡単にします。詳しくは
:ref:`converting-request-data` のセクションを参照してください。

belongsToMany アソシエーションを保存する時は、二つの保存方法の選択肢があります。

append
    新しい紐付けのみが、このアソシエーションのそれぞれの側に作成されます。
    この方法は、既存の紐付けについては、保存されるエンティティの配列に与えられなかったとしても
    解除しません。
replace
    保存する時に、既存の紐付けは除去されて、新しい紐付けか結合テーブルに作成されます。
    もし、保存しようとしているエンティティのいくつかが、データベース中に
    既存の紐付けとしてある場合、それらのリンクは削除ではなく更新されて、再保存されます。

既定は ``replace`` の方法が使われます。新しいレコードを既存のアソシエーションに追加する時は
いつでも、そのアソシエーションのプロパティを 'dirty' として印さなければいけません。
これが ORM に、アソシエーションのプロパティが保存されなければならないことを伝えます。 ::

    $article->tags[] = $tag;
    $article->dirty('tags', true);

``dirty()`` の呼び出しがないと、更新された tags は保存されません。

二つの既存のエンティティ間でアソシエーションを作りたいことがしばしばあるかもしれません。例えば、
ユーザーがある記事を共同で編集するなど。これは ``link`` メソッドを使って、こんなふうに行います。 ::

    $article = $this->Articles->get($articleId);
    $user = $this->Users->get($userId);

    $this->Articles->Users->link($article, [$user]);

belongsToMany アソシエーションを保存する時に、いくつかの追加データを結合テーブルに保存することは
ありそうなことです。前のタグの例では、記事に投票した人の ``vote_type`` になるかもしれません。
``vote_type`` は ``upvote`` や ``downvote`` で、文字列で表現されます。関係は Users と Articles
の間になります。

アソシエーションと ``vote_type`` の保存は、まず ``_joinData`` に何らかのデータを追加して、
そして ``link()`` でそのアソシエーションを保存します。例はこうです。 ::

    $article = $this->Articles->get($articleId);
    $user = $this->Users->get($userId);

    $user->_joinData = new Entity(['vote_type' => $voteType], ['markNew' => true]);
    $this->Articles->Users->link($article, [$user]);

結合テーブルへの追加データの保存
--------------------------------

いくつかの状況では、BelongsToMany アソシエーションを結合するテーブルは、追加のカラムを持ちます。
CakePHP では、これらのカラムへのプロパティを保存は簡単です。
belongsToMany アソシエーションのそれぞれのエンティティは、 ``_joinData`` プロパティを持っていて、
これは結合テーブル上の追加のカラムを含んでいます。このデータは配列か Entity
インターフェイスになります。例えば、もしも Students BelongsToMany Courses であれば、
こんな結合テーブルになるかもしれません。 ::

    id | student_id | course_id | days_attended | grade

データを保存する時、データを ``_joinData`` プロパティに設定することで、結合テーブル上の
追加のカラムに投入することができます。 ::

    $student->courses[0]->_joinData->grade = 80.12;
    $student->courses[0]->_joinData->days_attended = 30;

    $studentsTable->save($student);

``_joinData`` プロパティはエンティティになるか、もしリクエストデータからエンティティを構築したなら
データの配列になります。リクエストデータで結合テーブルのデータを保存する場合、 POST データは
このようになります。 ::

    $data = [
        'first_name' => 'Sally',
        'last_name' => 'Parker',
        'courses' => [
            [
                'id' => 10,
                '_joinData' => [
                    'grade' => 80.12,
                    'days_attended' => 30
                ]
            ],
            // 他のコース
        ]
    ];
    $student = $this->Students->newEntity($data, [
        'associated' => ['Courses._joinData']
    ]);

``FormHelper`` で入力をどやって正しく構築するかについては :ref:`associated-form-inputs`
のドキュメントを参照してください。

.. _saving-complex-types:

複雑な型の保存
--------------

テーブルは、文字列、整数、浮動小数、真偽などの基本的な型で表現されたデータを
格納することができます。しかし、配列やオブジェクトのようなより複雑な型を受け入れるように
拡張することができ、こうしたデータをデータベースに保存できるような単純な型にシリアライズします。

この機能は、カスタム型システムを使って行われます。カスタムカラム型をどう構築するかについては
:ref:`adding-custom-database-types` のセクションを参照してください。 ::

    // config/bootstrap.php の中で
    use Cake\Database\Type;
    Type::map('json', 'App\Database\Type\JsonType');

    // src/Model/Table/UsersTable.php の中で
    use Cake\Database\Schema\Table as Schema;

    class UsersTable extends Table
    {

        protected function _initializeSchema(Schema $schema)
        {
            $schema->columnType('preferences', 'json');
            return $schema;
        }

    }

上記のコードは ``preferences`` カラムを ``json`` カスタムタイプにマップします。
これは、このカラムのデータを取得する時には、 JSON 文字列がアンシリアライズされて、
エンティティの中に配列として置かれることを意味します。

同様に、保存された時は、配列は JSON の表現に変換されて戻されます。 ::

    $user = new User([
        'preferences' => [
            'sports' => ['サッカー', '野球'],
            'books' => ['マスタリング PHP', 'ハムレット']
        ]
    ]);
    $usersTable->save($user);

複雑なデータ型を使用する時、エンドユーザーから受け取ったデータが正しい型かを
検証することは重要です。複雑なデータを正しく処理するのに失敗することは、
悪意のあるユーザーが通常ではできないデータを保存できてしまう結果になります。

複数のエンティティの保存
========================

.. php:method:: saveMany($entities, $options = [])


このメソッドを使うと、複数のエンティティを自動で保存することができます。 ``$entites`` は
``newEntities()`` / ``patchEntities()`` で作成されたエンティティの配列です。
``$options`` は ``save()`` で受け入れるいくつかのオプションを持っています。 ::

    $data = [
        [
            'title' => '一番目の投稿',
            'published' => 1
        ],
        [
            'title' => '二番目の投稿',
            'published' => 1
        ],
    ];
    $articles = TableRegistry::get('Articles');
    $entities = $articles->newEntities($data);
    $result = $articles->saveMany($entities);

結果は成功時には更新されたエンティティを、失敗時には ``false`` を返します。

.. versionadded:: 3.2.8

一括更新
========

.. php:method:: updateAll($fields, $conditions)

時には行を個別に更新するのが効率的ではない、または必要でないことがあるかもしれません。
こうした場合には、一括更新を使って一度の多くの行を更新するのがより効率的です。 ::

    // すべての公開されていない記事を公開します。
    function publishAllUnpublished()
    {
        $this->updateAll(
            ['published' => true], // フィールド
            ['published' => false]); // 条件
    }

もし 一括更新をしつつ、かつ SQL 式を使う必要がある場合、内部的に ``updateAll()`` が
準備済みステートメントを使うので、式オブジェクトを使う必要があります。 ::

    use Cake\Database\Expression\QueryExpression;

    ...

    function incrementCounters()
    {
        $expression = new QueryExpression('view_count = view_count + 1');
        $this->updateAll([$expression], ['published' => true]);
    }

一括更新は一行またはそれ以上の行が更新されると成功したとみなされます。

.. warning::

    updateAll は beforeSave/afterSave イベントを *引き起こしません* 。もしこれらが必要であれば、
    まずレコードのコレクションを読み出して、そして、それらを更新してください。


``updateAll()`` は利便性のためだけにあります。
次のような、より柔軟なインターフェイスを使うこともできます。 ::

    // すべての公開されていない記事を公開します。
    function publishAllUnpublished()
    {
        $this->query()
            ->update()
            ->set(['published' => true])
            ->where(['published' => false])
            ->execute();
    }

:ref:`query-builder-updating-data` も参照してください。
