データの取り出しと結果セット
############################

.. php:namespace:: Cake\ORM

.. php:class:: Table

テーブルオブジェクトが「リポジトリー」やオブジェクトのコレクション周りの抽象化を提供してくれますので、
クエリーを実行した際には「エンティティー」オブジェクトとして個々のレコードを取得することができます。
このセクションではエンティティーを検索したりロードしたりする様々な方法について説明します。
詳細は :doc:`/orm/entities` セクションをご覧ください。

クエリーのデバッグと結果セット
==============================

ORM はいまや、コレクションとエンティティーを返しますので、それらのオブジェクトをデバッグすることは以前の
CakePHP よりも複雑になりえます。いまでは、様々な方法で ORM が返すデータを調査する方法が存在します。

- ``debug($query)`` SQL とバインドパラメーターが表示されます。結果は表示されません。
- ``debug($query->all())`` ResultSet のプロパティー (結果ではなく) が表示されます。
- ``debug($query->toArray())`` 結果を個々に見る簡単な方法です。
- ``debug(json_encode($query, JSON_PRETTY_PRINT))`` 人に読みやすい形で結果を表示します。
- ``debug($query->first())`` 単一のエンティティーのプロパティーを表示します。
- ``debug((string)$query->first())`` 単一のエンティティーのプロパティーを JSON として表示します。

主キーで単一のエンティティーを取得する
======================================

.. php:method:: get($id, $options = [])

エンティティーとそれに関連するデータを編集・閲覧する際に、データベースから単一のエンティティーを
ロードするというのは、もっともよく使う方法です。この場合は ``get()`` を使います。 ::

    // コントローラーやテーブルのメソッド内で

    // 単一の article を取得する
    $article = $articles->get($id);

    // 単一の article と、それに関連する comment を取得する。
    $article = $articles->get($id, [
        'contain' => ['Comments']
    ]);

get の操作がどの結果も見つけられない場合は、
``Cake\Datasource\Exception\RecordNotFoundException`` が発生します。
この例外を catch してもいいですし、CakePHP に 404 エラーへと変えさせてもかまいません。

``find()`` のように ``get()`` もキャッシュ機能を持ってます。
``get()`` を呼ぶ際にキャッシュを読ませるために ``cache`` オプションを使うことができます。 ::

    // コントローラーやテーブルのメソッド内で

    // いずれかのキャッシュの config もしくは CacheEngine インスタンスと生成されたキーを使う
    $article = $articles->get($id, [
        'cache' => 'custom',
    ]);

    // いずれかのキャッシュの config もしくは CacheEngine インスタンスと指定したキーを使う
    $article = $articles->get($id, [
        'cache' => 'custom', 'key' => 'mykey'
    ]);

    // キャッシュを使わないと明示する
    $article = $articles->get($id, [
        'cache' => false
    ]);

選択肢として、:ref:`custom-find-methods` を使ってエンティティーを ``get()`` することもできます。
たとえば、あるエンティティーの translations すべてを取得したいことがあるかもしれません。
``finder`` オプションを使えば、それを獲得することができます。 ::

    $article = $articles->get($id, [
        'finder' => 'translations',
    ]);

データのロードに Finder を使う
==============================

.. php:method:: find($type, $options = [])

エンティティーを使うには、それらをロードする必要があります。
これを最も簡単に行えるのが ``find()`` メソッドを使うことです。
find メソッドは、あなたが求めるデータを検索するための簡単で拡張性の高い方法を提供します。 ::

    // コントローラーやテーブルのメソッド内で

    // すべての article を検索する
    $query = $articles->find('all');

``find()`` メソッドの戻り値は常に :php:class:`Cake\\ORM\\Query` オブジェクトです。
Query クラスにより、それの生成後は、クエリーをより精錬することができるようになります。
Query オブジェクトは怠惰に評価され、行のフェッチ、配列への変換、
もしくは ``all()`` メソッドの呼び出しをするまでは実行されません。 ::

    // コントローラーやテーブルのメソッド内で

    // すべての article を検索
    // この時点ではクエリーは走らない。
    $query = $articles->find('all');

    // イテレーションはクエリーを実行する
    foreach ($query as $row) {
    }

    // all() の呼び出しはクエリーを実行し、結果セットを返す
    $results = $query->all();

    // 結果セットがあれば すべての行を取得できる
    $data = $results->toArray();

    // クエリーから配列への変換はクエリーを実行する
    $data = $query->toArray();

.. note::

    クエリーが開始されたら、 :doc:`/orm/query-builder` インターフェースを使うことができ、
    この便利なインターフェースにより、条件、リミット、保持する関連の追加などが行えます。
    より複雑なクエリーを構築することができます。

::

    // コントローラーやテーブルのメソッド内で
    $query = $articles->find('all')
        ->where(['Articles.created >' => new DateTime('-10 days')])
        ->contain(['Comments', 'Authors'])
        ->limit(10);

``find()`` に対するとても一般的なオプションも提供します。これがあればテストの際にモックする
メソッドを少なくできます。 ::

    // コントローラーやテーブルのメソッド内で
    $query = $articles->find('all', [
        'conditions' => ['Articles.created >' => new DateTime('-10 days')],
        'contain' => ['Authors', 'Comments'],
        'limit' => 10
    ]);

find() で使えるオプションは次の通りです:

- ``conditions`` クエリーの WHERE 句に使う条件を提供します。
- ``limit`` 欲しい行数をセットします。
- ``offset`` 欲しいページオフセットをセットします。 ``page`` をあわせて使うことで計算を簡単にできます。
- ``contain`` 関連をイーガーロード (eager load) するように定義します。
- ``fields`` エンティティーへとロードされる列を制限します。いくつかの列だけがロードされることになるので
  エンティティーが正しく動かないこともありえます。
- ``group`` クエリーに GROUP BY 句を加えます。集約関数を使う際に便利です。
- ``having`` クエリーに HAVING 句を加えます。
- ``join`` カスタム JOIN を追加で定義します。
- ``order`` 結果セットに並び順を設定します。

このリストに無いオプションはどれも beforeFind リスナに渡され、クエリーオブジェクトの変更に使われます。
クエリーオブジェクトの ``getOptions()`` メソッドを使うことで、利用中のオプションを取得することができます。
クエリーオブジェクトをコントローラーに渡すよりも、 :ref:`custom-find-methods` でクエリーを
まとめることをお勧めします。カスタム finder メソッドを使うことでクエリーを再利用できるようになり、
テストが簡単になります。

デフォルトでクエリーと結果セットは :doc:`/orm/entities` オブジェクトを返します。
変換 (hydrate) を無効化すれば、素となる配列を取得することができます。 ::

    $query->hydrate(false);

    // $data は配列のデータを含む ResultSet です。
    $data = $query->all();

.. _table-find-first:

１つ目の結果を取得する
======================

``first()`` メソッドによりクエリーから１つ目の行だけをフェッチすることができます。
クエリーがまだ実行されいないなら、 ``LIMIT 1`` 句が適用されます。 ::

    // コントローラーやテーブルのメソッド内で
    $query = $articles->find('all', [
        'order' => ['Articles.created' => 'DESC']
    ]);
    $row = $query->first();

このアプローチは CakePHP 旧バージョンの ``find('first')`` を置き換えるものです。
また、主キーでエンティティーをロードするなら ``get()`` メソッドも使いたいかもしれません。

.. note::

    ``first()`` メソッドは、結果が見つからない場合、 ``null`` を返します。

結果の件数を取得する
====================

クエリーオブジェクトを作成したら、 ``count()`` メソッドを使うことでクエリー結果の件数を
取得することができます。 ::

    // コントローラーやテーブルのメソッド内で
    $query = $articles->find('all', [
        'conditions' => ['Articles.title LIKE' => '%Ovens%']
    ]);
    $number = $query->count();

``count()`` メソッドのさらなる用法は :ref:`query-count` を参照してください。

.. _table-find-list:

キー/値のペアを検索する
=======================

自分のアプリケーションのデータから関連する連想配列のデータを生成できると便利なときがよくあります
たとえば、 ``<select>`` エレメントを生成する際にはとても便利です。
CakePHP ではデータの 'list' を生成するメソッドを使うことで簡単にできます。 ::

    // コントローラーやテーブルのメソッド内で
    $query = $articles->find('list');
    $data = $query->toArray();

    // データは下記のようになっています
    $data = [
        1 => '最初の投稿',
        2 => '私が書いた２つ目の記事',
    ];

追加のオプションがない場合、 ``$data`` のキーはテーブルの主キーになり、値はテーブルの
'displayField' になります。テーブルオブジェクトの ``displayField()`` メソッドを使うことで
テーブルの表示列を設定できます。 ::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->displayField('title');
        }
    }

``list`` を呼び出す際、 ``keyField`` と ``valueField`` オプションを使うことで、それぞれキー、
値に使われるフィールドを設定することができます。 ::

    // コントローラーやテーブルのメソッド内で
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'title'
    ]);
    $data = $query->toArray();

    // データは下記のようになっています
    $data = [
        'first-post' => '最初の投稿',
        'second-article-i-wrote' => '私が書いた２つ目の記事',
    ];

結果はネストされた配列へとグルーピングすることができます。これは bucket された set が欲しい時や
FormHelper で ``<optgroup>`` エレメントを構築したいときに便利です。 ::

    // コントローラーやテーブルのメソッド内で
    $query = $articles->find('list', [
        'keyField' => 'slug',
        'valueField' => 'title',
        'groupField' => 'author_id'
    ]);
    $data = $query->toArray();

    // データは下記のようになっています
    $data = [
        1 => [
            'first-post' => '最初の投稿',
            'second-article-i-wrote' => '私が書いた２つ目の記事',
        ],
        2 => [
            // さらなるデータ
        ]
    ];

join でつながっている関連テーブルからリストのデータを生成することもできます。 ::

    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => 'author.name'
    ])->contain(['Authors']);

キーと値の出力をカスタマイズ
----------------------------

最後に、リストの find の中で、エンティティーのアクセッサーメソッドにアクセスするために
クロージャを使用することができます。 ::

    // Authors の中で、エンティティーは displayFild として使用するために仮想フィールドを作成
    protected function _getLabel()
    {
        return $this->_properties['first_name'] . ' ' . $this->_properties['last_name']
          . ' / ' . __('User ID %s', $this->_properties['user_id']);
    }

この例は、Author エンティティーの ``_getLabel()``
アクセッサーメソッドを使うことを示しています。 ::

    // ファインダーやコントローラーの中で
    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => function ($article) {
            return $article->author->get('label');
        }
    ]);

オプション指定なしで、ラベルを取得することもできます。 ::

    // AuthorsTable::initialize() の中で
    $this->displayField('label'); // Author::_getLabel() を利用します。
    // ファインダーやコントローラーの中で
    $query = $authors->find('list'); // AuthorsTable::displayField() を利用します。

スレッド状のデータを検索する
============================

``find('threaded')`` finder はキーフィールドを通じて一つにネストされたエンティティーを返します。
デフォルトで、このフィールドは、 ``parent_id`` です。この finder は、'隣接リスト' スタイルの
テーブルに保存されたデータにアクセスすることができます。与えられた ``parent_id`` にマッチする
すべてのエンティティーは、 ``children`` 属性の下に配置されます。 ::

    // コントローラーやテーブルのメソッド内で
    $query = $comments->find('threaded');

    // デフォルト値を拡張
    $query = $comments->find('threaded', [
        'keyField' => $comments->primaryKey(),
        'parentField' => 'parent_id'
    ]);
    $results = $query->toArray();

    echo count($results[0]->children);
    echo $results[0]->children[0]->comment;

``parentField`` と ``keyField`` のキーを使うことでそれらのフィールドでスレッドとなるよう
定義することができます。

.. tip::
    より高度なツリー状のデータを扱う必要があるなら、代わりに :doc:`/orm/behaviors/tree`
    の利用を検討してください。

.. _custom-find-methods:

カスタム Finder メソッド
========================

上記の例ではビルドインの ``all`` と ``list`` という finder の使い方を見てきました。
しかしながら、独自の finder メソッドを実装することは可能ですし、お勧めです。
finder メソッドは共通で使うクエリーをパッケージ化する理想的な方法です。
クエリーを抽象化できるようにすることで、メソッドは使いやすくなります。
fineder メソッドは、あなたが作成したい finder の名前が ``Foo`` の場合、 ``findFoo``
というように規約に則ったメソッドを作成することで定義されます。
例えば、公開された記事を見つけるために atricles テーブルに finder を追加したい場合、
次のようになります。 ::

    use Cake\ORM\Query;
    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function findOwnedBy(Query $query, array $options)
        {
            $user = $options['user'];
            return $query->where(['author_id' => $user->id]);
        }

    }

    // コントローラーやテーブルのメソッド内で
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('ownedBy', ['user' => $userEntity]);

Finder メソッドはクエリーを必要応じて変更したり、 ``$options`` を使うことで関連するアプリケーションの
ロジックにあわせて finder の操作をカスタマイズしたりすることができます。
Finder の 'stack' (重ね呼び) もまた、複雑なクエリーを難なく表現できるようにしてくれます。
'published' と 'recent' の両方の Finder を持っているとすると、次のようになります。 ::

    // コントローラーやテーブルのメソッド内で
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published')->find('recent');

ここまではいずれも、テーブルクラスの Finder メソッドを例に見てきましたが、Finder メソッドは
:doc:`/orm/behaviors` で定義することも可能です。

フェッチ後に結果を変更する必要があるなら、 :ref:`map-reduce` 機能を使って結果を変更してください。
map reduce 機能は、旧バージョンの CakePHP にあった 'afterFind' コールバックに代わるものです。

.. _dynamic-finders:

動的な Finder
=============

CakePHP の ORM は動的に構築する Finder メソッドを提供します。
これにより追加コーディングなしで簡単なクエリーを表現できます。
たとえば、 username でユーザーを検索したいなら、次のようにできます。 ::

    // コントローラーの中
    // 下記の２つは同じ
    $query = $this->Users->findByUsername('joebob');
    $query = $this->Users->findAllByUsername('joebob');

    // テーブルメソッドの中
    $users = TableRegistry::get('Users');
    // 下記の２つは同じ
    $query = $users->findByUsername('joebob');
    $query = $users->findAllByUsername('joebob');

動的 Finder を使う際には、複数フィールドを使うこともできます。 ::

    $query = $users->findAllByUsernameAndApproved('joebob', 1);

``OR`` 条件を生成することもできます。 ::

    $query = $users->findAllByUsernameOrEmail('joebob', 'joe@example.com');

OR や AND 条件のどちらも使えますが、１つの動的 Finder の中に２つを混ぜて使うことはできません。
``contain`` のような他のクエリーオプションも動的 Finder には対応していません。
より複雑なクエリーを詰め込みたいなら :ref:`custom-find-methods` を使ってください。
なお、動的 Finder とカスタム Finder を混ぜて使うことは可能です。 ::

    $query = $users->findTrollsByUsername('bro');

上記は下記のように読み替えられます。 ::

    $users->find('trolls', [
        'conditions' => ['username' => 'bro']
    ]);

動的クエリーからクエリーオブジェクトを得た後、１つ目の結果が欲しい場合、``first()`` を呼ぶ必要があります。

.. note::

    動的 Finder はクエリーを簡単にしてくれますが、追加のオーバーヘッドが発生することになります。

関連付いたデータを取得する
==========================

関連付いたデータを取得したい、もしくは関連付いたデータを基に抽出したい場合、２つの方法があります:

- ``contain()`` や ``matching()`` のような CakePHP ORM クエリー関数を使う
- ``innerJoin()`` や ``leftJoin()`` 、 ``rightJoin()`` のような join 関数を使う

最初のモデルとそれに関連付くデータをロードしたいなら、 ``contain()`` を使ってください。
``contain()`` により、ロードされる関連データには追加条件を適用することになりますが、
関連データをベースに、最初のモデルを条件付けることはできません。

関連データをベースに最初のモデルを条件付けたいなら ``matching()`` を使ってください。
たとえば、特定の tag を持つ article をすべてロードしたい場合などです。
詳細は ``matching()`` にありますので :ref:`filtering-by-associated-data` を参照してください。

join 関数を使いたい場合の詳細は :ref:`adding-joins` を参照してください。

.. _eager-loading-associations:

contain を用いた関連データのイーガーロード
============================================

CakePHP は ``find()`` を使う際、デフォルトでは関連データを **いずれも** ロードしません。
結果の中にロードしたい各関連データは 'contain' で指定するか、イーガーロード (eager load)
する必要があります。

.. start-contain

イーガーロードは、ORM のレイジーロード (lazy load) 周辺に潜むパフォーマンス問題の多くを避けるのに役立ちます。
イーガーロードで生成されたクエリーは JOIN に影響を与えて、効率的なクエリーが作られるようになります。
CakePHP では 'contain' メソッドを使って関連データのイーガーロードを定義します。 ::

    // コントローラーやテーブルのメソッド内で

    // find() のオプションとして
    $query = $articles->find('all', ['contain' => ['Authors', 'Comments']]);

    // クエリーオブジェクトのメソッドとして
    $query = $articles->find('all');
    $query->contain(['Authors', 'Comments']);

上記では関連する author と comment を結果セットの article ごとにロードします。
ロードする関連データを定義するためのネストされた配列を使って、ネストされた関連データを
ロードすることができます。 ::

    $query = $articles->find()->contain([
        'Authors' => ['Addresses'], 'Comments' => ['Authors']
    ]);

または、ドット記法を使ってネストされた関連データを表現することもできます。 ::

    $query = $articles->find()->contain([
        'Authors.Addresses',
        'Comments.Authors'
    ]);

好きなだけ深く関連データをイーガーロードできます。 ::

    $query = $products->find()->contain([
        'Shops.Cities.Countries',
        'Shops.Managers'
    ]);

複数の簡単な ``contain()`` 文を使って全ての関連データからフィールドを選択できます。 ::

    $query = $this->find()->select([
        'Realestates.id',
        'Realestates.title',
        'Realestates.description'
    ])
    ->contain([
        'RealestateAttributes' => [
            'Attributes' => [
                'fields' => [
                    // contain() の中で別名がつけられたフィールドは、
                    // 正しくマップされたモデルのプレフィックスが含まれていなければなりません。
                    'Attributes__name' => 'attr_name'
                ]
            ]
        ]
    ])
    ->contain([
        'RealestateAttributes' => [
            'fields' => [
                'RealestateAttributes.realestate_id',
                'RealestateAttributes.value'
            ]
        ]
    ])
    ->where($condition);


クエリー上の contain を再設定する必要があるなら、第２引数に ``true`` を指定することができます。 ::

    $query = $articles->find();
    $query->contain(['Authors', 'Comments'], true);

contain に条件を渡す
--------------------

``contain()`` を使う際、関連によって返される列を限定し、条件によってフィルターすることができます。 ::

    // コントローラーやテーブルのメソッド内で

    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q
                ->select(['body', 'author_id'])
                ->where(['Comments.approved' => true]);
        }
    ]);

これは、またコントローラーレベルでページネーションが働きます。 ::

    $this->paginate['contain'] = [
        'Comments' => function (\Cake\ORM\Query $query) {
            return $query->select(['body', 'author_id'])
            ->where(['Comments.approved' => true]);
        }
    ];

.. note::

    関連によってフェッチされるフィールドを限定する場合、外部キーの列が確実に select
    **されなければなりません** 。外部キーのカラムが select されない場合、関連データが
    最終的な結果の中に無いということがおこります。

ドット記法を使って、深くネストされた関連データを制限することも可能です。 ::

    $query = $articles->find()->contain([
        'Comments',
        'Authors.Profiles' => function ($q) {
            return $q->where(['Profiles.is_published' => true]);
        }
    ]);

関連テーブルにカスタム Finder メソッドをいくつか定義しているなら、 ``contain()`` の中で
それらを使うことができます。 ::

    // すべての article を取り出すが、承認され (approved)、人気のある (popular) ものだけに限定する
    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q->find('approved')->find('popular');
        }
    ]);

.. note::

    ``BelongsTo`` と ``HasOne`` の関連で関連するレコードをロードする際には ``where`` 句と
    ``select`` 句だけが使用可能です。これ以外の関連タイプであれば、クエリーオブジェクトが提供する
    すべての句を使うことができます。

生成されたクエリー全体を完全にコントロールする必要があるなら、生成されたクエリーに ``contain()`` に
``foreignKey`` 制約を追加しないようにと指示を出すことができます。この場合、配列を使って
``foreignKey`` と ``queryBuilder`` を渡してください。 ::

    $query = $articles->find()->contain([
        'Authors' => [
            'foreignKey' => false,
            'queryBuilder' => function ($q) {
                return $q->where(...); // フィルターのための完全な条件
            }
        ]
    ]);

``select()`` でロードするフィールドを限定しているが、contain している関連データのフィールドも
またロードしたいなら、 ``select()`` に関連オブジェクトを渡すこともできます。 ::

    // Articles から id と title を、 Users から全列を select する
    $query = $articles->find()
        ->select(['id', 'title'])
        ->select($articles->Users)
        ->contain(['Users']);

別の方法として、複数の関連がある場合には、 ``autoFields()`` を使うことができます。 ::

    // Articles から id と title を、 Users、Comments、Tags から全列を select する
    $query->select(['id', 'title'])
        ->contain(['Comments', 'Tags'])
        ->autoFields(true)
        ->contain(['Users' => function($q) {
            return $q->autoFields(true);
        }]);

.. versionadded:: 3.1
    関連オブジェクトを介して列を select する機能は 3.1 で追加されました。

関連を含んだソード
------------------

関連を HasMany や BelongsToMany でロードした時、 ``sort`` オプションで、これら関連データを
ソートすることができます。 ::

    $query->contain([
        'Comments' => [
            'sort' => ['Comments.created' => 'DESC']
        ]
    ]);

.. end-contain

.. _filtering-by-associated-data:

matching と joins を用いた関連データによるフィルタリング
--------------------------------------------------------

.. start-filtering

関連データに関するクエリーでよくあるのは、指定の関連データに「マッチする (matching)」レコードを
見つけるものです。たとえば、 'Articles belongsToMany Tags' である場合、かなりの確率で、
CakePHP タグ (Tag) を持つ記事 (Article) を探したいはずです。
これは CakePHP の ORM では極めてシンプルにできます。 ::

    // コントローラーやテーブルのメソッド内で

    $query = $articles->find();
    $query->matching('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

この戦略は HasMany の関連にも同様に適用できます。たとえば、'Authors HasMany Articles' である場合、
下記のようにして、最近公開された記事 (Article) のすべての投稿者 (Author) を抽出したいかもしれません。 ::

    $query = $authors->find();
    $query->matching('Articles', function ($q) {
        return $q->where(['Articles.created >=' => new DateTime('-10 days')]);
    });

深い関連を使って抽出することも驚くほど簡単です。文法はすでによく知っているものです。 ::

    // コントローラーやテーブルのメソッド内で
    $query = $products->find()->matching(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

    // 渡された変数を使って 'markstory' によってコメントされた記事 (Article) をユニークに取り出す
    // ドット区切りのマッチングパスは、ネストされた matching() 呼び出しでも使われます
    $username = 'markstory';
    $query = $articles->find()->matching('Comments.Users', function ($q) use ($username) {
        return $q->where(['username' => $username]);
    });

.. note::

    この機能は ``INNER JOIN`` 句を生成しますので、条件によりすでに除外していない限り、
    取得した行が重複しているかもしれず、find クエリーでは ``distinct`` の呼び出しを考えたいことでしょう。
    これは、たとえば、同じユーザーが一つの記事 (Article) に複数回コメントした場合にありえます。

関連から「マッチ ('matched') した」ことで取得されるデータはエンティティーの ``_matchingData``
プロパティーで利用可能です。同一の関連を  match かつ contain している場合、結果には
``_matchingData`` プロパティーと標準の関連系のプロパティーの両方があることになります。

innerJoinWith を使う
--------------------

``matching()`` 関数を使うことで、すでに見てきたように、特定の関連との ``INNER JOIN`` が作成され、
結果セットにもフィールドがロードされます。

``matching()`` を使いたいものの、結果セットにフィールドをロードしたくない状況もあるかもしれません。
この目的で ``innerJoinWith()`` を使うことが出来ます。 ::

    $query = $articles->find();
    $query->innerJoinWith('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

``innerJoinWith()`` メソッドは ``matching()`` と同様に動きます。
つまり、ドット記法を使うことで深くネストする関連を join できます。 ::

    $query = $products->find()->innerJoinWith(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

違いは結果セットに追加のカラムが追加されず、 ``_matchingData`` プロパティーがセットされないことだけです。

.. versionadded:: 3.1
    Query::innerJoinWith() は 3.1 で追加されました。

notMatching を使う
------------------

``matching()`` の対義語となるのが ``notMatching()`` です。この関数は結果を、
特定の関連に繋がっていないものだけにフィルターするようにクエリーを変更します。 ::

    // コントローラーやテーブルのメソッド内で

    $query = $articlesTable
        ->find()
        ->notMatching('Tags', function ($q) {
            return $q->where(['Tags.name' => '退屈']);
        });

上記の例は ``退屈`` という単語でタグ付けされていない、すべての記事(Article)を検索します。
このメソッドを HasMany の関連にも同様に使うことができます。たとえば、10日以内に公開 (published)
されていない記事 (Article) のすべての作者 (Author) を検索することができます。 ::

    $query = $authorsTable
        ->find()
        ->notMatching('Articles', function ($q) {
            return $q->where(['Articles.created >=' => new \DateTime('-10 days')]);
        });

このメソッドを深い関連にマッチしないレコードだけにフィルターするために使うこともできます。
例えば、特定のユーザーによるコメントが付かなかった記事を見つけることができます。 ::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        });

コメント (Comment) がまったく付いていない記事 (Article) も上記の条件を満たしてしまいますので、
``matching()`` と ``notMatching()`` を混ぜて使いたくなるかもしれません。下記の例は
最低１件以上のコメント (Comment) を持つ記事 (Article) の中で特定ユーザーにコメントされているものを
除外して検索したものです。 ::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        })
        ->matching('Comments');

.. note::

    ``notMatching()`` は ``LEFT JOIN`` 句を生成しますので、条件により回避していない限り、
    取得した行が重複しているかもしれず、find クエリーでは ``distinct`` の呼び出しを
    考えたいことでしょう。

``matching()`` 関数の正反対となる ``notMatching()`` ですが、いかなるデータも結果セットの
``_matchingData`` プロパティーに追加しないということを覚えておいてください。

.. versionadded:: 3.1
    Query::notMatching() は 3.1 で追加されました。

leftJoinWith を使う
-------------------

時には、すべての関連レコードをロードしたくはないが、関連に基いて結果を計算したいということが
あるかもしれません。たとえば、記事 (Article) の全データと一緒に、記事ごとのコメント (Comment)
数をロードしたい場合には、 ``leftJoinWith()`` 関数が使えます。 ::

    $query = $articlesTable->find();
    $query->select(['total_comments' => $query->func()->count('Comments.id')])
        ->leftJoinWith('Comments')
        ->group(['Articles.id'])
        ->autoFields(true);

上記クエリーの結果は Article データの結果に加え、データごとに ``total_comments``
プロパティーが含まれます。

``leftJoinWith()`` はまた深くネストした関連にも使うことができます。たとえばこれは、
特定の単語でタグ (Tag) 付けされた記事 (Article) の数を投稿者 (Author) ごとに出したい場合に便利です。 ::

    $query = $authorsTable
        ->find()
        ->select(['total_articles' => $query->func()->count('Articles.id')])
        ->leftJoinWith('Articles.Tags', function ($q) {
            return $q->where(['Tags.name' => 'awesome']);
        })
        ->group(['Authors.id'])
        ->autoFields(true);

この関数は指定した関連からいずれのカラムも結果セットへとロードしません。

.. versionadded:: 3.1
    Query::leftJoinWith() は 3.1 で追加されました。

.. end-filtering

フェッチの戦略の変更する
========================

すでにご存知の通り、 ``belongsTo`` と ``hasOne`` の関連はメインとなる Finder クエリーの中で
``JOIN`` を使ってロードされます。これにより、データ取得の際には、クエリーとフェッチ速度が改善され、
より表現力の高い条件文を作成できるようになります。ただ一方で、 ``order()`` や ``limit()`` など、
関連に影響する特定の句を Finder クエリーに追加したい場合に、問題となりえます。

たとえば、記事 (Article) の最初のコメント (Comment) を関連データとして取得したい場合::

   $articles->hasOne('FirstComment', [
        'className' => 'Comments',
        'foreignKey' => 'article_id'
   ]);

この関連からデータをただしくフェッチするには、特定のカラムで order by したいので、
クエリーに ``select`` 戦略 (strategy) を使うのだと教える必要があります。 ::

    $query = $articles->find()->contain([
        'FirstComment' => [
                'strategy' => 'select',
                'queryBuilder' => function ($q) {
                    return $q->order(['FirstComment.created' =>'ASC'])->limit(1);
                }
        ]
    ]);

この方法での戦略 (strategy) の動的な変更は指定したクエリーのみに適用されます。
もしも戦略の変更を永続的に行いたいなら次のようにできます。 ::

    $articles->FirstComment->strategy('select');

``select`` 戦略の利用は、別データベースにあるテーブルとの関連を作るのに優れた方法です。
なぜなら、その場合は ``joins`` を使ってレコードをフェッチできないためです。

サブクエリー戦略でフェッチする
------------------------------

テーブルのサイズが増えてくると、そのテーブルの関連のフェッチは遅くなっていきます。
一度に大きなデータを扱うクエリーの場合には、なおのことです。 ``hasMany`` と ``belongsToMany``
の関連データをロードする際、関連を最適化する良い方法は、 ``subquery`` 戦略を使うことです。 ::

    $query = $articles->find()->contain([
        'Comments' => [
                'strategy' => 'subquery',
                'queryBuilder' => function ($q) {
                    return $q->where(['Comments.approved' => true]);
                }
        ]
    ]);

結果はデフォルトの戦略と同じになりますが、データベースによってはクエリーとフェッチ時間が
著しく改善されます。とりわけ、この戦略により、 **Microsoft SQL Server** などのように
クエリーごとのバインド変数のサイズに制限があるデータベースであっても、大きなデータの塊を
一度に扱うことが可能になります。

関連データの戦略を永続的にしたいなら次のようにできます。 ::

    $articles->Comments->strategy('subquery');

関連をレイジーロード(Lazy Load)する
====================================

CakePHP は簡単に関連付くデータをイーガーロード (Eager Load) できますが、レイジーロード (Lazy Load)
したいという場合もありえるでしょう。その場合は :ref:`lazy-load-associations` と
:ref:`loading-additional-associations` を参照してください。

結果セットを使いこなす
======================

``all()`` を使ってクエリーが実行されたら、 :php:class:`Cake\\ORM\\ResultSet` のインスタンスが
得られます。このオブジェクトはクエリーから得られた結果のデータを強力に操作する方法を提供します。
クエリーオブジェクトと同様に、ResultSets は :doc:`Collection </core-libraries/collections>`
ですので、 ResultSet オブジェクトのコレクションメソッドをどれでも使うことができます。

ResultSet オブジェクトは基本となるプリペアードステートメント (prepared statement) から行を
レイジーロード (Lazy Load) します。デフォルトでは、結果をメモリーにバッファしますので、結果セットを
何度もイテレートすることができるようになり、まだバッファされていなければ、結果をキャッシュしつつ
イテレートします。 ::

    $query->bufferResults(false);

バッファを OFF に切り替える場合にはいくつか注意点があります:

#. 結果セットを複数回イテレートできません。
#. 結果をイテレートしてキャッシュすることもできません。
#. hasMany や belongsToMany の関連をイーガーロード (Eager Load) するクエリーでは、バッファを
   無効化できません。なぜなら、これら関連タイプでは、結果のすべてに依存してクエリーを生成しますので、
   全データのイーガーロードが必須となるのです。

.. warning::

    PostgreSQL や SQL Server を使った際の、ストリーミング結果 (Streaming results) であっても
    エンティティー結果 (entire results) 用にメモリーが割り当てられます。
    これは PDO の制約によるものです。

結果セットの結果は cache/serialize したり、API 用に JSON エンコードしたりすることができます。 ::

    // コントローラーやテーブルのメソッド内で
    $results = $query->all();

    // Serialized
    $serialized = serialize($results);

    // Json
    $json = json_encode($results);

結果セットを serialize する場合も json_encode する場合も期待通りに動きます。
serialize されたデータは unserialized により結果セットに戻ります。 JSON への変換は、
結果セット間のすべてのエンティティーオブジェクト上の、 hidden と virtual field の設定を考慮します。

serialize が簡単にできるだけでなく、結果セットは 'Collection' オブジェクトですので、
:doc:`collection objects </core-libraries/collections>` でサポートされるすべてのメソッドが
使えます。たとえば、記事 (Article) のコレクションにあるタグ (Tag) をユニークに取り出すことができます。 ::


    // コントローラーやテーブルのメソッド内で
    $articles = TableRegistry::get('Articles');
    $query = $articles->find()->contain(['Tags']);

    $reducer = function ($output, $value) {
        if (!in_array($value, $output)) {
            $output[] = $value;
        }
        return $output;
    };

    $uniqueTags = $query->all()
        ->extract('tags.name')
        ->reduce($reducer, []);

以下は、結果セットで使うコレクションメソッドの別の例です。 ::

    // 計算されたプロパティーにより行をフィルターします
    $filtered = $results->filter(function ($row) {
        return $row->is_recent;
    });

    // 結果のプロパティーから連想配列を作成する
    $articles = TableRegistry::get('Articles');
    $results = $articles->find()->contain(['Authors'])->all();

    $authorList = $results->combine('id', 'author.name');

コレクションの機能を使った結果セットの詳細は :doc:`/core-libraries/collections` を参照してください。
:ref:`format-results` では計算列の追加方法や結果セットの置き換え方法が示されています。

ResultSet から最初/最後のレコードを取得する
-------------------------------------------

``first()`` と ``last()`` メソッドを使うことで、結果セットから該当のレコードを取得することができます。 ::

    $result = $articles->find('all')->all();

    // 最初・最後の結果を取得します。
    $row = $result->first();
    $row = $result->last();

ResultSet から任意の場所を指定して取得する
------------------------------------------

``skip()`` と ``first()`` を使うことで ResultSet から任意のレコードを取得できます。 ::

    $result = $articles->find('all')->all();

    // ５番目のレコードを取得する
    $row = $result->skip(4)->first();

Query や ResultSet が空かどうかをチェックする
---------------------------------------------

Query や ResultSet オブジェクトの ``isEmpty()`` メソッドを使うことで１行以上あるかどうかを確認できます。
Query オブジェクトで ``isEmpty()`` メソッドを呼び出した場合はクエリーが評価されます。 ::

    // クエリーをチェックします
    $query->isEmpty();

    // 結果をチェックします
    $results = $query->all();
    $results->isEmpty();

.. _loading-additional-associations:

追加で関連をロードする
----------------------

結果セットを作成した後に、追加の関連をロードする必要があるかもしれません。
これはレイジー (Lazy) にイーガーロード (Eager Load) する絶好のタイミングです。
``loadInto()`` を使うことで追加の関連をロードできます。 ::

    $articles = $this->Articles->find()->all();
    $withMore = $this->Articles->loadInto($articles, ['Comments', 'Users']);

エンティティーが単一であれ、コレクションであれ、
追加のデータをその中にイーガーロード (Eager Load) することができます。

.. versionadded: 3.1
    Table::loadInto() は 3.1 で追加されました。

.. _map-reduce:

結果を Map/Reduce で変更する
============================

大抵の場合、find 操作でデータベースから取り出したデータは事後処理が必要となります。
エンティティーの getter 系メソッドは仮想プロパティーの生成や、
特別なデータフォーマッティングの多くを面倒みてくれますが、
ときには、より基本的な方法でデータ構造を変更する必要があることもあります。

このような場合に、データベースからフェッチした後で結果を処理する方法として、
``Query`` オブジェクトは ``mapReduce()`` を提供します。

データ構造を変更するよくある事例は、結果をとある条件に基いて仕分けするものです。
このために ``mapReduce()`` 関数を使うことができます。
２つの callable な関数 ``$mapper`` と ``$reducer`` が必要となります。
``$mapper`` callable は第１引数としてデータベースから現在の結果を受け取り、
第２引数としてイテレーションのキーを受け取ります。
最後の引数として、走っている ``MapReduce`` ルーチンのインスタンスを受け取ります。 ::

    $mapper = function ($article, $key, $mapReduce) {
        $status = 'published';
        if ($article->isDraft() || $article->isInReview()) {
            $status = 'unpublished';
        }
        $mapReduce->emitIntermediate($article, $status);
    };

上記の例では ``$mapper`` が article の status を published にするか unpublished にするか
計算しており、その後で ``MapReduce`` インスタンスの ``emitIntermediate()`` が呼ばれます。
このメソッドは published か unpublished のどちらかでラベル付けされた article リストの中に現在の
article を追加します。

MapReduce 処理の次のステップは最終的な結果を確定させるためのものです。 mapper の中で生成される各
status ごとに ``$reducer`` 関数が呼ばれ、追加の処理を何でも実行することができます。
この関数は第１引数で該当の "bucket" の中にある article リストを受け取り、第２引数で処理対象の
"bucket" 名を受け取り、第３引数で ``mapper()`` 関数と同じように ``MapReduce`` ルーチンの
インスタンスを受け取ります。この例では何も追加の処理を行っていませんでしたが、最終的な結果に
``emit()`` だけを行っています。 ::

    $reducer = function ($articles, $status, $mapReduce) {
        $mapReduce->emit($articles, $status);
    };

最終的には、２つの関数を配置することで仕分けすることができます。 ::

    $articlesByStatus = $articles->find()
        ->where(['author_id' => 1])
        ->mapReduce($mapper, $reducer);

    foreach ($articlesByStatus as $status => $articles) {
        echo sprintf("%d 件の %s の article が存在します", count($articles), $status);
    }

上記は下記のように出力されます。 ::

    4 件の published の article が存在します
    5 件の unpublished の article が存在します

もちろん、これは、実際には MapReduce 処理を使わずとも別の方法で解決できるような、ごく単純な例です。
次は、結果を emit する以上のことが求められるような reducer 関数を使った別の例を見てみましょう。

CakePHP についての情報を含む記事 (article) でもっともよく発言された単語を計算する場合、
例によって mapper 関数が必要です。 ::

    $mapper = function ($article, $key, $mapReduce) {
        if (stripos('cakephp', $article['body']) === false) {
            return;
        }

        $words = array_map('strtolower', explode(' ', $article['body']));
        foreach ($words as $word) {
            $mapReduce->emitIntermediate($article['id'], $word);
        }
    };

まずは "cakephp" という単語が記事の本文中にあるかどうかをチェックし、次に本文を個々の単語に分解します。
各単語ごとに ``bucket`` を生成し、その中に各記事の id を入れます。こうなればあとは結果を reduce して、
カウントを取り出すだけです。 ::

    $reducer = function ($occurrences, $word, $mapReduce) {
        $mapReduce->emit(count($occurrences), $word);
    }

最後に、すべてを一緒にします。 ::

    $articlesByStatus = $articles->find()
        ->where(['published' => true])
        ->andWhere(['published_date >=' => new DateTime('2014-01-01')])
        ->hydrate(false)
        ->mapReduce($mapper, $reducer);

これは、ストップワードを除去しない場合、非常に大きな配列を返すこともありえますが、
このようなものを返します。 ::

    [
        'cakephp' => 100,
        'awesome' => 39,
        'impressive' => 57,
        'outstanding' => 10,
        'mind-blowing' => 83
    ]

最後の例を見ればもはや MapReduce のエキスパートです。 ``friends`` (友人) テーブルが存在し、
データベースから "嘘の友人" を検索することを想像してください。
わかりやすく言えば、双方向でフォローしあっていない人たちのことです。
``mapper()`` 関数を見てみましょう。 ::

    $mapper = function ($rel, $key, $mr) {
        $mr->emitIntermediate($rel['source_user_id'], $rel['target_user_id']);
        $mr->emitIntermediate($rel['target_user_id'], $rel['source_target_id']);
    };

互いにフォローしあっているユーザーリストを得るためにデータをコピーしていきました。
それでは reduce しましょう。
reducer が呼ばれるごとに、reducer はユーザーごとのフォロワーのリストを受け取ります。 ::

    // $friendsList は次のようになっています
    // 繰り返し登場する数字は双方向で関係が繋がっていることを意味しています
    [2, 5, 100, 2, 4]

    $reducer = function ($friendsList, $user, $mr) {
        $friends = array_count_values($friendsList);
        foreach ($friends as $friend => $count) {
            if ($count < 2) {
                $mr->emit($friend, $user);
            }
        }
    }

そして、クエリーにこの関数を渡します。 ::

    $fakeFriends = $friends->find()
        ->hydrate(false)
        ->mapReduce($mapper, $reducer)
        ->toArray();

これは下記のような配列を返します。 ::

    [
        1 => [2, 4],
        3 => [6]
        ...
    ]

結果の配列は、たとえば、 id ``1`` のユーザーは ``2`` と ``4`` をフォローしていますが、
彼らは ``1`` をフォローし返していないということを意味します。

複数の操作を stack する(重ねて呼ぶ)
-----------------------------------

クエリーの中で `mapReduce` を使用しても、すぐには実行されません。
代わりに最初の結果をフェッチしようとしたらただちに実行されるように登録されます。
これにより、別のメソッドやフィルターをチェーン (chain) 呼び出しでクエリーに加えたり、
さらには、 MapReduce ルーチンを追加することもできるようになるのです。 ::

    $query = $articles->find()
        ->where(['published' => true])
        ->mapReduce($mapper, $reducer);

    // 後工程で下記のようにします:
    $query->where(['created >=' => new DateTime('1 day ago')]);

これは :ref:`custom-find-methods` セクションで説明しているように、
カスタム Finder メソッドを構築するのに非常に便利です。 ::

    public function findPublished(Query $query, array $options)
    {
        return $query->where(['published' => true]);
    }

    public function findRecent(Query $query, array $options)
    {
        return $query->where(['created >=' => new DateTime('1 day ago')]);
    }

    public function findCommonWords(Query $query, array $options)
    {
        // 前のセクションで説明した共通の単語の件と同じもの
        $mapper = ...;
        $reducer = ...;
        return $query->mapReduce($mapper, $reducer);
    }

    $commonWords = $articles
        ->find('commonWords')
        ->find('published')
        ->find('recent');

さらに、１回のクエリーで複数回の ``mapReduce`` 操作を stack する (重ねて呼ぶ) ことも可能です。
たとえば、記事の中でもっとも頻出する単語が知りたいのに加え、記事すべての中で 20 回よりも
多く発言された単語だけを返すようにフィルターもしたい場合は下記のようになります。 ::

    $mapper = function ($count, $word, $mr) {
        if ($count > 20) {
            $mr->emit($count, $word);
        }
    };

    $articles->find('commonWords')->mapReduce($mapper);

stack されたすべての MapReduce 操作をを取り除く
-----------------------------------------------

ときには ``mapReduce`` 操作をまったく実行させずに ``Query`` オブジェクトを更新したいという
状況もあるかもしれません。これは両方の引数に null を指定し、第３引数 (overwrite) で ``true``
を呼び出すことで達成できます。 ::

    $query->mapReduce(null, null, true);

