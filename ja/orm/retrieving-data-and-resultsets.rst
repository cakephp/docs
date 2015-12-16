データの取り出しと結果セット
##############################

..
    Retrieving Data & Results Sets

.. php:namespace:: Cake\ORM

.. php:class:: Table

..
    While table objects provide an abstraction around a 'repository' or collection of
    objects, when you query for individual records you get 'entity' objects. While
    this section discusses the different ways you can find and load entities, you
    should read the :doc:`/orm/entities` section for more information on entities.

テーブルオブジェクトが「リポジトリ」やオブジェクトのコレクション周りの抽象化を提供してくれますので、
クエリを実行した際には「エンティティ」オブジェクトとして個々のレコードを取得することができます。
このセクションではエンティティを検索したりロードしたりする様々な方法について説明します。
詳細は :doc:`/orm/entities` の章を読んでください。

..
    Debugging Queries and ResultSets

クエリのデバッグと結果セット
================================

..
    Since the ORM now returns Collections and Entities, debugging these objects can
    be more complicated than in previous CakePHP versions. There are now various
    ways to inspect the data returned by the ORM.

ORMはいまや、コレクションとエンティティを返しますので、それらのオブジェクトをデバッグすることは以前の CakePHP よりも複雑になりえます。
いまでは、様々な方法で ORM が返すデータを調査する方法が存在します。

..
    - ``debug($query)`` Shows the SQL and bound params, does not show results.
    - ``debug($query->all())`` Shows the ResultSet properties (not the results).
    - ``debug($query->toArray())`` An easy way to show each of the results.
    - ``debug(json_encode($query, JSON_PRETTY_PRINT))`` More human readable results.
    - ``debug($query->first())`` Show the properties of a single entity.
    - ``debug((string)$query->first())`` Show the properties of a single entity as JSON.

- ``debug($query)`` SQL とバインドパラメータが表示されます。結果は表示されません。
- ``debug($query->all())`` ResultSet のプロパティ(結果ではなく)が表示されます。
- ``debug($query->toArray())`` 結果を個々に見る簡単な方法です。
- ``debug(json_encode($query, JSON_PRETTY_PRINT))`` 人に読みやすい形で結果を表示します。
- ``debug($query->first())`` 単一のエンティティのプロパティを表示します。
- ``debug((string)$query->first())`` 単一のエンティティのプロパティを JSON として表示します。

..
    Getting a Single Entity by Primary Key

主キーで単一のエンティティを取得する
======================================

.. php:method:: get($id, $options = [])

..
    It is often convenient to load a single entity from the database when editing or
    view entities and their related data. You can do this by using
    ``get()``::

エンティティとそれに関連するデータを編集・閲覧する際に、データベースから単一のエンティティをロードするというのは、もっともよく使う方法です。
この場合は ``get()`` を使います::

    // コントローラやテーブルのメソッド内で

    // 単一の article を取得する
    $article = $articles->get($id);

    // 単一の article と、それに関連する comment を取得する。
    $article = $articles->get($id, [
        'contain' => ['Comments']
    ]);

..
    If the get operation does not find any results
    a ``Cake\Datasource\Exception\RecordNotFoundException`` will be raised. You can either
    catch this exception yourself, or allow CakePHP to convert it into a 404 error.

get の操作がどの結果も見つけられない場合は、``Cake\Datasource\Exception\RecordNotFoundException`` が発生します。
この例外を catch してもいいですし、CakePHP に 404 エラーへと変えさせてもかまいません。

..
    Like ``find()`` get has caching integrated. You can use the ``cache`` option
    when calling ``get()`` to perform read-through caching::

``find()`` のように get はキャッシュ機能を持ってます。
``get()`` を呼ぶ際にキャッシュを読ませるために ``cache`` オプションを使うことができます::

    // コントローラやテーブルのメソッド内で

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

..
    Optionally you can ``get()`` an entity using :ref:`custom-find-methods`. For example you may want to get all translations for an entity. You can achieve that by using the ``finder`` option::

選択肢として、:ref:`custom-find-methods` を使ってエンティティを ``get()`` することもできます。
たとえば、あるエンティティの translations すべてを取得したいことがあるかもしれません。
``finder`` オプションを使えば、それを獲得することができます::

    $article = $articles->get($id, [
        'finder' => 'translations',
    ]);

..
    Using Finders to Load Data

データのロードに Finder を使う
=============================

.. php:method:: find($type, $options = [])

..
    Before you can work with entities, you'll need to load them. The easiest way to
    do this is using the ``find()`` method. The find method provides an easy and
    extensible way to find the data you are interested in::

エンティティを使うには、それらをロードする必要があります。
これを最も簡単に行えるのが ``find()`` メソッドを使うことです。
find メソッドは、あなたが求めるデータを検索するための簡単で拡張性の高い方法を提供します::

    // コントローラやテーブルのメソッド内で

    // すべての article を検索する
    $query = $articles->find('all');

..
    The return value of any ``find()`` method is always
    a :php:class:`Cake\\ORM\\Query` object. The Query class allows you to further
    refine a query after creating it. Query objects are evaluated lazily, and do not
    execute until you start fetching rows, convert it to an array, or when the
    ``all()`` method is called::

``find()`` メソッドの戻り値は常に :php:class:`Cake\\ORM\\Query` オブジェクトです。
Query クラスにより、それの生成後は、クエリをより精錬することができるようになります。
Query オブジェクトは怠惰に評価され、行のフェッチ、配列への変換、もしくは ``all()`` メソッドの呼び出しをするまでは実行されません::

    // コントローラやテーブルのメソッド内で

    // すべての article を検索
    // この時点ではクエリは走らない。
    $query = $articles->find('all');

    // イテレーションはクエリを実行する
    foreach ($query as $row) {
    }

    // all() の呼び出しはクエリを実行し、結果セットを返す
    $results = $query->all();

    // 結果セットがあれば すべての行を取得できる
    $data = $results->toArray();

    // クエリから配列への変換はクエリを実行する
    $results = $query->toArray();

.. note::

    クエリが開始されたら、 :doc:`/orm/query-builder` インターフェイスを使うことができ、この便利なインターフェイスにより、条件、リミット、保持する関連の追加などが行えます。
    より複雑なクエリを構築することができます。

..
    Once you've started a query you can use the :doc:`/orm/query-builder` interface
    to build more complex queries, adding additional conditions, limits, or include
    associations using the fluent interface.

::

    // コントローラやテーブルのメソッド内で
    $query = $articles->find('all')
        ->where(['Articles.created >' => new DateTime('-10 days')])
        ->contain(['Comments', 'Authors'])
        ->limit(10);

..
    You can also provide many commonly used options to ``find()``. This can help
    with testing as there are fewer methods to mock::

``find()`` に対するとても一般的なオプションも提供します。これがあればテストの際にモックするメソッドを少なくできます::

    // コントローラやテーブルのメソッド内で
    $query = $articles->find('all', [
        'conditions' => ['Articles.created >' => new DateTime('-10 days')],
        'contain' => ['Authors', 'Comments'],
        'limit' => 10
    ]);

..
    The list of options supported by find() are:

find() で使えるオプションは次の通りです:

- ``conditions`` クエリの WHERE 句に使う条件を提供します。
- ``limit`` 欲しい行数をセットします。
- ``offset`` 欲しいページオフセットをセットします。 ``page`` をあわせて使うことで計算を簡単にできます。
- ``contain`` 関連をイーガーロード(eager load)するように定義します。
- ``fields`` エンティティへとロードされる列を制限します。いくつかの列だけがロードされることになるのでエンティティが正しく動かないこともありえます。
- ``group`` クエリに GROUP BY 句を加えます。集約関数を使う際に便利です。
- ``having`` クエリに HAVING 句を加えます。
- ``join`` カスタム JOIN を追加で定義します。
- ``order`` 結果セットに並び順を設定します。

..
    Any options that are not in this list will be passed to beforeFind listeners
    where they can be used to modify the query object. You can use the
    ``getOptions()`` method on a query object to retrieve the options used. While you
    can pass query objects to your controllers, we recommend that you
    package your queries up as :ref:`custom-find-methods` instead. Using custom
    finder methods will let you re-use your queries and make testing
    easier.

このリストに無いオプションはどれも beforeFind リスナに渡され、クエリオブジェクトの変更に使われます。
クエリオブジェクトの ``getOptions()`` メソッドを使うことで、利用中のオプションを取得することができます。
クエリオブジェクトをコントローラに渡すよりも、 :ref:`custom-find-methods` でクエリをまとめることをお勧めします。
カスタム finder メソッドを使うことでクエリを再利用できるようになり、テストが簡単になります。

..
    By default queries and result sets will return :doc:`/orm/entities` objects. You
    can retrieve basic arrays by disabling hydration::

デフォルトでクエリと結果セットは :doc:`/orm/entities` オブジェクトを返します。
変換(hydrate)を無効化すれば、素となる配列を取得することができます::

    $query->hydrate(false);

    // $data は配列のデータを含む ResultSet です。
    $data = $query->all();

.. _table-find-first:

１つ目の結果を取得する
========================

..
    Getting the First Result

..
    The ``first()`` method allows you to fetch only the first row from a query. If
    the query has not been executed, a ``LIMIT 1`` clause will be applied::

``first()`` メソッドによりクエリから１つ目の行だけをフェッチすることができます。
クエリがまだ実行されいないなら、 ``LIMIT 1`` 句が適用されます::

    // コントローラやテーブルのメソッド内で
    $query = $articles->find('all', [
        'order' => ['Articles.created' => 'DESC']
    ]);
    $row = $query->first();

..
    This approach replaces ``find('first')`` in previous versions of CakePHP. You
    may also want to use the ``get()`` method if you are loading entities by primary
    key.

このアプローチは CakePHP 旧バージョンの ``find('first')`` を置き換えるものです。
また、主キーでエンティティをロードするなら ``get()`` メソッドも使いたいかもしれません。


..
    Getting a Count of Results

結果の件数を取得する
==========================

..
    Once you have created a query object, you can use the ``count()`` method to get
    a result count of that query::

クエリオブジェクトを作成したら、 ``count()`` メソッドを使うことでクエリ結果の件数を取得することができます::

    // コントローラやテーブルのメソッド内で
    $query = $articles->find('all', [
        'conditions' => ['Articles.title LIKE' => '%Ovens%']
    ]);
    $number = $query->count();

..
    See :ref:`query-count` for additional usage of the ``count()`` method.

``count()`` メソッドのさらなる用法は :ref:`query-count` を参照してください。

.. _table-find-list:

キー/値のペアを検索する
=======================

..
    Finding Key/Value Pairs

..
    It is often useful to generate an associative array of data from your application's
    data. For example, this is very useful when creating ``<select>`` elements. CakePHP
    provides a simple to use method for generating 'lists' of data::

自分のアプリケーションのデータから関連する連想配列のデータを生成できると便利なときがよくあります
たとえば、 ``<select>`` エレメントを生成する際にはとても便利です。
CakePHP ではデータの 'list' を生成するメソッドを使うことで簡単にできます::

    // コントローラやテーブルのメソッド内で
    $query = $articles->find('list');
    $data = $query->toArray();

    // データは下記のようになっています
    $data = [
        1 => '最初の投稿',
        2 => '私が書いた２つ目の記事',
    ];

..
    With no additional options the keys of ``$data`` will be the primary key of your
    table, while the values will be the 'displayField' of the table. You can use the
    ``displayField()`` method on a table object to configure the display field of
    a table::

追加のオプションがない場合、 ``$data`` のキーはテーブルの主キーになり、値はテーブルの 'displayField' になります。
テーブルオブジェクトの ``displayField()`` メソッドを使うことでテーブルの表示列を設定できます::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->displayField('title');
        }
    }

..
    When calling ``list`` you can configure the fields used for the key and value with
    the ``keyField`` and ``valueField`` options respectively::

``list`` を呼び出す際、``keyField`` と ``valueField`` オプションを使うことで、それぞれキー、値に使われる列を設定することができます::

    // コントローラやテーブルのメソッド内で
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

..
    Results can be grouped into nested sets. This is useful when you want
    bucketed sets, or want to build ``<optgroup>`` elements with FormHelper::

結果はネストされた配列へとグルーピングすることができます。
これは bucket された set が欲しい時や FormHelper で ``<optgroup>`` エレメントを構築したいときに便利です::

    // コントローラやテーブルのメソッド内で
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

..
    You can also create list data from associations that can be reached with joins::

join でつながっている関連テーブルからリストのデータを生成することもできます::

    $query = $articles->find('list', [
        'keyField' => 'id',
        'valueField' => 'author.name'
    ])->contain(['Authors']);

..
    Finding Threaded Data

スレッド状のデータを検索する
===========================

..
    The ``find('threaded')`` finder returns nested entities that are threaded
    together through a key field. By default this field is ``parent_id``. This
    finder allows you to access data stored in an 'adjacency list' style
    table. All entities matching a given ``parent_id`` are placed under the
    ``children`` attribute::

``find('threaded')`` finder はキー列を通じて一つにネストされたエンティティを返します::

    // コントローラやテーブルのメソッド内で
    $query = $comments->find('threaded');

    // デフォルト値を拡張
    $query = $comments->find('threaded', [
        'keyField' => $comments->primaryKey(),
        'parentField' => 'parent_id'
    ]);
    $results = $query->toArray();

    echo count($results[0]->children);
    echo $results[0]->children[0]->comment;

..
    The ``parentField`` and ``keyField`` keys can be used to define the fields that
    threading will occur on.

``parentField`` と ``keyField`` のキーを使うことでそれらの列でスレッドとなるよう定義することができます。

.. tip::
    より高度なツリー状のデータを扱う必要があるなら、代わりに :doc:`/orm/behaviors/tree` の利用を検討してください。

..
    If you need to manage more advanced trees of data, consider using
    :doc:`/orm/behaviors/tree` instead.

.. _custom-find-methods:

カスタム Finder メソッド
===========================================================================

..
    Custom Finder Methods

..
    The examples above show how to use the built-in ``all`` and ``list`` finders.
    However, it is possible and recommended that you implement your own finder
    methods. Finder methods are the ideal way to package up commonly used queries,
    allowing you to abstract query details into a simple to use method. Finder
    methods are defined by creating methods following the convention of ``findFoo``
    where ``Foo`` is the name of the finder you want to create. For example if we
    wanted to add a finder to our articles table for finding published articles we
    would do the following::

上記の例では組込済の ``all`` と ``list`` という finder の使い方を見てきました。
しかしながら、独自の finder メソッドを実装することは可能ですし、お勧めです。
finder メソッドは共通で使うクエリをパッケージ化する理想的な方法です。
クエリを抽象化できるようにすることで、メソッドは使いやすくなります::

    use Cake\ORM\Query;
    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function findPublished(Query $query, array $options)
        {
            $query->where([
                'Articles.published' => true,
                'Articles.moderated' => true
            ]);
            return $query;
        }

    }

    // コントローラやテーブルのメソッド内で
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published');

..
    Finder methods can modify the query as required, or use the
    ``$options`` to customize the finder operation with relevant application logic.
    You can also 'stack' finders, allowing you to express complex queries
    effortlessly. Assuming you have both the 'published' and 'recent' finders, you
    could do the following::

Finder メソッドはクエリを必要応じて変更したり、``$options`` を使うことで関連するアプリケーションのロジックにあわせて finder の操作をカスタマイズしたりすることができます。
Finder の 'stack' (重ね呼び) もまた、複雑なクエリを難なく表現できるようにしてくれます。
'published' と 'recent' の両方の Finder を持っているとすると、次のようになります::

    // コントローラやテーブルのメソッド内で
    $articles = TableRegistry::get('Articles');
    $query = $articles->find('published')->find('recent');

..
    While all the examples so far have show finder methods on table classes, finder
    methods can also be defined on :doc:`/orm/behaviors`.

ここまではいずれも、テーブルクラスの Finder メソッドを例に見てきましたが、Finder メソッドは :doc:`/orm/behaviors` で定義することも可能です。

..
    If you need to modify the results after they have been fetched you should use
    a :ref:`map-reduce` function to modify the results. The map reduce features
    replace the 'afterFind' callback found in previous versions of CakePHP.

フェッチ後に結果を変更する必要があるなら、:ref:`map-reduce` 機能を使って結果を変更してください。
map reduce 機能は、旧バージョンの CakePHP にあった 'afterFind' コールバックに代わるものです。

.. _dynamic-finders:

動的な Finder
===============

..
    Dynamic Finders

..
    CakePHP's ORM provides dynamically constructed finder methods which allow you to
    express simple queries with no additional code. For example if you wanted
    to find a user by username you could do::

CakePHP の ORM は動的に構築する Finder メソッドを提供します。
これにより追加コーディングなしで簡単なクエリを表現できます。
たとえば、 username でユーザを検索したいなら、次のようにできます::

    // コントローラの中
    // 下記の２つは同じ
    $query = $this->Users->findByUsername('joebob');
    $query = $this->Users->findAllByUsername('joebob');

    // テーブルメソッドの中
    $users = TableRegistry::get('Users');
    // 下記の２つは同じ
    $query = $users->findByUsername('joebob');
    $query = $users->findAllByUsername('joebob');

..
    When using dynamic finders you can constrain on multiple fields::

動的 Finder を使う際には、複数列を使うこともできます::

    $query = $users->findAllByUsernameAndApproved('joebob', 1);

..
    You can also create ``OR`` conditions::

``OR`` 条件を生成することもできます::

    $query = $users->findAllByUsernameOrEmail('joebob', 'joe@example.com');

..
    While you can use either OR or AND conditions, you cannot combine the two in
    a single dynamic finder. Other query options like ``contain`` are also not
    supported with dynamic finders. You should use :ref:`custom-find-methods` to
    encapsulate more complex queries.  Lastly, you can also combine dynamic finders
    with custom finders::

OR や AND 条件のどちらも使えますが、１つの動的 Finder の中に２つを混ぜて使うことはできません。
``contain`` のような他のクエリオプションも動的 Finder には対応していません。
より複雑なクエリを詰め込みたいなら :ref:`custom-find-methods` を使ってください。
なお、動的 Finder とカスタム Finder を混ぜて使うことは可能です::

    $query = $users->findTrollsByUsername('bro');

..
    The above would translate into the following::

上記は下記のように読み替えられます::

    $users->find('trolls', [
        'conditions' => ['username' => 'bro']
    ]);

..
    Once you have a query object from a dynamic finder, you'll need to call
    ``first()`` if you want the first result.

動的クエリからクエリオブジェクトを得た後、１つ目の結果が欲しい場合、``first()`` を呼ぶ必要があります。

.. note::

    動的 Finder はクエリを簡単にしてくれますが、追加のオーバーヘッドが発生することになります。

..
    While dynamic finders make it simple to express queries, they come with some
    additional performance overhead.


..
    Retrieving Associated Data

関連付いたデータを取得する
==========================

..
    When you want to grab associated data, or filter based on associated data, there
    are two ways:

関連付いたデータを取得したい、もしくは関連付いたデータを基に抽出したい場合、２つの方法があります:

- ``contain()`` や ``matching()`` のような CakePHP ORM クエリ関数を使う
- ``innerJoin()`` や ``leftJoin()`` 、 ``rightJoin()`` のような join 関数を使う

..
    - use CakePHP ORM query functions like ``contain()`` and ``matching()``
    - use join functions like ``innerJoin()``, ``leftJoin()``, and ``rightJoin()``

..
    You should use ``contain()`` when you want to load the primary model, and its
    associated data. While ``contain()`` will let you apply additional conditions to
    the loaded associations, you cannot constrain the primary model based on the
    associations. For more details on the ``contain()``, look at
    :ref:`eager-loading-associations`.

最初のモデルとそれに関連付くデータをロードしたいなら、``contain()`` を使ってください。
``contain()`` により、ロードされる関連データには追加条件を適用することになりますが、関連データをベースに、最初のモデルを条件付けることはできません。

..
    You should use ``matching()`` when you want to restrict the primary model based
    on associations. For example, you want to load all the articles that have
    a specific tag on them. For more details on the ``matching()``, look at
    :ref:`filtering-by-associated-data`.

関連データをベースに最初のモデルを条件付けたいなら ``matching()`` を使ってください。
たとえば、特定の tag を持つ article をすべてロードしたい場合などです。
詳細は ``matching()`` にありますので :ref:`filtering-by-associated-data` を参照してください。

..
    If you prefer to use join functions, you can look at
    :ref:`adding-joins` for more information.

join 関数を使いたい場合の詳細は :ref:`adding-joins` を参照してください。

.. _eager-loading-associations:

関連データをイーガーロード(eager load)する
=========================================

..
    Eager Loading Associations

..
    By default CakePHP does not load **any** associated data when using ``find()``.
    You need to 'contain' or eager-load each association you want loaded in your
    results.

CakePHP は ``find()`` を使う際、デフォルトでは関連データを **いずれも** ロードしません。
結果の中にロードしたい各関連データは 'contain' で指定するか、イーガーロード(eager load)する必要があります。

.. start-contain

..
    Eager loading helps avoid many of the potential performance problems
    surrounding lazy-loading in an ORM. The queries generated by eager loading can
    better leverage joins, allowing more efficient queries to be made. In CakePHP
    you define eager loaded associations using the 'contain' method::

イーガーロードは、ORM のレイジーロード(lazy load)周辺に潜むパフォーマンス問題の多くを避けるのに役立ちます。
イーガーロードで生成されたクエリは JOIN に影響を与えて、効率的なクエリが作られるようになります。
CakePHP では 'contain' メソッドを使って関連データのイーガーロードを定義します::

    // コントローラやテーブルのメソッド内で

    // find() のオプションとして
    $query = $articles->find('all', ['contain' => ['Authors', 'Comments']]);

    // クエリオブジェクトのメソッドとして
    $query = $articles->find('all');
    $query->contain(['Authors', 'Comments']);

..
    The above will load the related author and comments for each article in the
    result set. You can load nested associations using nested arrays to define the
    associations to be loaded::

上記では関連する author と comment を結果セットの article ごとにロードします。
ロードする関連データを定義するためのネストされた配列を使って、ネストされた関連データをロードすることができます::

    $query = $articles->find()->contain([
        'Authors' => ['Addresses'], 'Comments' => ['Authors']
    ]);

..
    Alternatively, you can express nested associations using the dot notation::

または、ドット記法を使ってネストされた関連データを表現することもできます::

    $query = $articles->find()->contain([
        'Authors.Addresses',
        'Comments.Authors'
    ]);

..
    You can eager load associations as deep as you like::

好きなだけ深く関連データをイーガーロードできます::

    $query = $products->find()->contain([
        'Shops.Cities.Countries',
        'Shops.Managers'
    ]);

..
    If you need to reset the containments on a query you can set the second argument
    to ``true``::

クエリ上の contain を再設定する必要があるなら、第２引数に ``true`` を指定することができます::

    $query = $articles->find();
    $query->contain(['Authors', 'Comments'], true);

..
    Passing Conditions to Contain

contain に条件を渡す
-----------------------------

..
    When using ``contain()`` you are able to restrict the data returned by the
    associations and filter them by conditions::

``contain()`` を使う際、関連によって返される列を限定し、条件によってフィルターすることができます::

    // コントローラやテーブルのメソッド内で

    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q
                ->select(['body', 'author_id'])
                ->where(['Comments.approved' => true]);
        }
    ]);

.. note::

    関連によってフェッチされる列を限定する場合、外部キーの列が確実に select  **されなければなりません** 。
    外部キーの列が select されない場合、関連データが最終的な結果の中に無いということがおこります。

..
    When you limit the fields that are fetched from an association, you **must**
    ensure that the foreign key columns are selected. Failing to select foreign
    key fields will cause associated data to not be present in the final result.

..
    It is also possible to restrict deeply-nested associations using the dot
    notation::

ドット記法を使って、深くネストされた関連データを制限することも可能です::

    $query = $articles->find()->contain([
        'Comments',
        'Authors.Profiles' => function ($q) {
            return $q->where(['Profiles.is_published' => true]);
        }
    ]);

..
    If you have defined some custom finder methods in your associated table, you can
    use them inside ``contain()``::

関連テーブルにカスタム Finder メソッドをいくつか定義しているなら、 ``contain()`` の中でそれらを使うことができます::

    // すべての article を取り出すが、承認され(approved)、人気のある(popular)ものだけに限定する
    $query = $articles->find()->contain([
        'Comments' => function ($q) {
           return $q->find('approved')->find('popular');
        }
    ]);

.. note::

    ``BelongsTo`` と ``HasOne`` の関連で関連するレコードをロードする際には ``where`` 句と ``select`` 句だけが使用可能です。
    これ以外の関連タイプであれば、クエリオブジェクトが提供するすべての句を使うことができます。

..
    For ``BelongsTo`` and ``HasOne`` associations only the ``where`` and
    ``select`` clauses are used when loading the associated records. For the
    rest of the association types you can use every clause that the query object
    provides.

..
    If you need full control over the query that is generated, you can tell ``contain()``
    to not append the ``foreignKey`` constraints to the generated query. In that
    case you should use an array passing ``foreignKey`` and ``queryBuilder``::

生成されたクエリ全体を完全にコントロールする必要があるなら、
生成されたクエリに ``contain()`` に ``foreignKey`` 制約を追加しないと指示を出すことができます。
この場合、配列を使って ``foreignKey`` と ``queryBuilder`` を渡してください::

    $query = $articles->find()->contain([
        'Authors' => [
            'foreignKey' => false,
            'queryBuilder' => function ($q) {
                return $q->where(...); // フィルタのための完全な条件
            }
        ]
    ]);

..
    If you have limited the fields you are loading with ``select()`` but also want to
    load fields off of contained associations, you can pass the association object
    to ``select()``::

``select()`` でロードする列を限定しているが、contain している関連データの列もまたロードしたいなら、 ``select()`` に関連オブジェクトを渡すこともできます::

    // Articles から id と title を、 Users から全列を select する
    $articlesTable
        ->select(['id', 'title'])
        ->select($articlesTable->Users)
        ->contain(['Users']);

..
    Alternatively, if you have multiple associations, you can use ``autoFields()``::

別の方法として、複数の関連がある場合には、 ``autoFields()`` を使うことができます::

    // Articles から id と title を、 Users、Comments、Tags から全列を select する
    $query->select(['id', 'title'])
        ->contain(['Comments', 'Tags'])
        ->autoFields(true)
        ->contain(['Users' => function($q) {
            return $q->autoFields(true);
        }]);

.. versionadded:: 3.1
    関連オブジェクトを介して列を select する機能は 3.1 で追加されました

..
    Selecting columns via an association object was added in 3.1

.. end-contain

.. _filtering-by-associated-data:

関連データによるフィルタリング
-------------------------------

..
    Filtering by Associated Data

.. start-filtering

..
    A fairly common query case with associations is finding records 'matching'
    specific associated data. For example if you have 'Articles belongsToMany Tags'
    you will probably want to find Articles that have the CakePHP tag. This is
    extremely simple to do with the ORM in CakePHP::

関連データに関するクエリでよくあるのは、指定の関連データに「マッチする(matching)」レコードを見つけるものです。
たとえば、 'Articles belongsToMany Tags' である場合、かなりの確率で、CakePHP タグ(Tag)を持つ記事(Article)を探したいはずです。
これは CakePHP の ORM では極めてシンプルにできます::

    // コントローラやテーブルのメソッド内で

    $query = $articles->find();
    $query->matching('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

..
    You can apply this strategy to HasMany associations as well. For example if
    'Authors HasMany Articles', you could find all the authors with recently
    published articles using the following::

この戦略は HasMany の関連にも同様に適用できます。
たとえば、'Authors HasMany Articles' である場合、下記のようにして、最近公開された記事(Article)のすべての投稿者(Author)を抽出したいかもしれません::

    $query = $authors->find();
    $query->matching('Articles', function ($q) {
        return $q->where(['Articles.created >=' => new DateTime('-10 days')]);
    });

..
    Filtering by deep associations is surprisingly easy, and the syntax should be
    already familiar to you::

深い関連を使って抽出することも驚くほど簡単です。文法はすでによく知っているものです::

    // コントローラやテーブルのメソッド内で
    $query = $products->find()->matching(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

    // 渡された変数を使って 'markstory' によってコメントされた記事(Article)をユニークに取り出す
    $username = 'markstory';
    $query = $articles->find()->matching('Comments.Users', function ($q) use ($username) {
        return $q->where(['username' => $username]);
    });

.. note::

    この機能は ``INNER JOIN`` 句を生成しますので、条件によりすでにフィルタしていない限り、取得した行が重複しているかもしれず、find クエリでは ``distinct`` の呼び出しを考えたいことでしょう。
    これは、たとえば、同じユーザが一つの記事(Article)に複数回コメントした場合にありえます。

..
    As this function will create an ``INNER JOIN``, you might want to consider
    calling ``distinct`` on the find query as you might get duplicate rows if
    your conditions don't filter them already. This might be the case, for
    example, when the same users comments more than once on a single article.

関連から「マッチ('matched')した」ことで取得されるデータはエンティティの ``_matchingData`` プロパティで利用可能です。
同一の関連を  match かつ contain している場合、結果には ``_matchingData`` プロパティと標準の関連系のプロパティの両方があることになります。

..
    The data from the association that is 'matched' will be available on the
    ``_matchingData`` property of entities. If you both match and contain the same
    association, you can expect to get both the ``_matchingData`` and standard
    association properties in your results.

..
    Using innerJoinWith

innerJoinWith を使う
~~~~~~~~~~~~~~~~~~~~~~

..
    Using the ``matching()`` function, as we saw already, will create an ``INNER
    JOIN`` with the specified association and will also load the fields into the
    result set.

``matching()`` 関数を使うことで、すでに見てきたように、特定の関連との ``INNER JOIN`` が作成され、
結果セットにも列がロードされます。

..
    There may be cases where you want to use ``matching()`` but are not interested
    in loading the fields into the result set. For this purpose, you can use
    ``innerJoinWith()``::

``matching()`` を使いたいものの、結果セットに列をロードしたくない状況もあるかもしれません。
この目的で ``innerJoinWith()`` を使うことが出来ます::

    $query = $articles->find();
    $query->innerJoinWith('Tags', function ($q) {
        return $q->where(['Tags.name' => 'CakePHP']);
    });

..
    The ``innerJoinWith()`` method works the same as ``matching()``, that
    means that you can use dot notation to join deeply nested
    associations::

``innerJoinWith()`` メソッドは ``matching()`` と同様に動きます。
つまり、ドット記法を使うことで深くネストする関連を join できます::

    $query = $products->find()->innerJoinWith(
        'Shops.Cities.Countries', function ($q) {
            return $q->where(['Countries.name' => 'Japan']);
        }
    );

..
    Again, the only difference is that no additional columns will be added to the
    result set, and no ``_matchingData`` property will be set.

違いは結果セットに追加のカラムが追加されず、 ``_matchingData`` プロパティがセットされないことだけです。

.. versionadded:: 3.1
    Query::innerJoinWith() は 3.1 で追加されました。

..
    Query::innerJoinWith() was added in 3.1

..
    Using notMatching

notMatching を使う
~~~~~~~~~~~~~~~~~~~

..
    The opposite of ``matching()`` is ``notMatching()``. This function will change
    the query so that it filters results that have no relation to the specified
    association::

``matching()`` の対義語となるのが ``notMatching()`` です。
この関数は結果を、特定の関連に繋がっていないものだけにフィルタするようにクエリを変更します::

    // コントローラやテーブルのメソッド内で

    $query = $articlesTable
        ->find()
        ->notMatching('Tags', function ($q) {
            return $q->where(['Tags.name' => '退屈']);
        });

..
    The above example will find all articles that were not tagged with the word
    ``boring``.  You can apply this method to HasMany associations as well. You could,
    for example, find all the authors with no published articles in the last 10
    days::

上記の例は ``退屈`` という単語でタグ付けされていない、すべての記事(Article)を検索します。
このメソッドを HasMany の関連にも同様に使うことができます。
たとえば、10日以内に公開(published)されていない記事(Article)のすべての作者(Author)を検索することができます::

    $query = $authorsTable
        ->find()
        ->notMatching('Articles', function ($q) {
            return $q->where(['Articles.created >=' => new \DateTime('-10 days')]);
        });

..
    It is also possible to use this method for filtering out records not matching
    deep associations. For example, you could find articles that have not been
    commented on by a certain user::

このメソッドを深い関連にマッチしないレコードだけにフィルタするために使うこともできます::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        });


..
    Since articles with no comments at all also satisfy the condition above, you may
    want to combine ``matching()`` and ``notMatching()`` in the same query. The
    following example will find articles having at least one comment, but not
    commented by a certain user::

コメント(Comment)がまったく付いていない記事(Article)も上記の条件を満たしてしまいますので、
``matching()`` と ``notMatching()`` を混ぜて使いたくなるかもしれません。
下記の例は最低１件以上のコメント(Comment)を持つ記事(Article)の中で特定ユーザにコメントされているものを除外して検索したものです::

    $query = $articlesTable
        ->find()
        ->notMatching('Comments.Users', function ($q) {
            return $q->where(['username' => 'jose']);
        })
        ->matching('Comments');

.. note::

    ``notMatching()`` は ``LEFT JOIN`` 句を生成しますので、条件により回避していない限り、
    取得した行が重複しているかもしれず、find クエリでは ``distinct`` の呼び出しを考えたいことでしょう。

..
    As ``notMatching()`` will create a ``LEFT JOIN``, you might want to consider
    calling ``distinct`` on the find query as you can get duplicate rows
    otherwise.

..
    Keep in mind that contrary to the ``matching()`` function, ``notMatching()``
    will not add any data to the ``_matchingData`` property in the results.

``matching()`` 関数の正反対となる ``notMatching()`` ですが、
いかなるデータも結果セットの ``_matchingData`` プロパティに追加しないということを覚えておいてください。

.. versionadded:: 3.1
    Query::notMatching() は 3.1 で追加されました

..
    Using leftJoinWith

leftJoinWith を使う
~~~~~~~~~~~~~~~~~~~~

..
    On certain occasions you may want to calculate a result based on an association,
    without having to load all the records for it. For example, if you wanted to
    load the total number of comments an article has along with all the article
    data, you can use the ``leftJoinWith()`` function::

時には、すべての関連レコードをロードしたくはないが、関連に基いて結果を計算したいということがあるかもしれません。
たとえば、記事(Article)の全データと一緒に、記事ごとのコメント(Comment)数をロードしたい場合には、``leftJoinWith()`` 関数が使えます::

    $query = $articlesTable->find();
    $query->select(['total_comments' => $query->func()->count('Comments.id')])
        ->leftJoinWith('Comments')
        ->group(['Articles.id'])
        ->autoFields(true);

..
    The results for the above query will contain the article data and the
    ``total_comments`` property for each of them.

上記クエリの結果は Article データの結果に加え、データごとに ``total_comments`` プロパティが含まれます。

..
    ``leftJoinWith()`` can also be used with deeply nested associations. This is
    useful, for example, for bringing the count of articles tagged with a certain
    word, per author::

``leftJoinWith()`` はまた深くネストした関連にも使うことができます。
たとえばこれは、特定の単語でタグ(Tag)付けされた記事(Article)の数を投稿者(Author)ごとに出したい場合に便利です::

    $query = $authorsTable
        ->find()
        ->select(['total_articles' => $query->func()->count('Articles.id')])
        ->leftJoinWith('Articles.Tags', function ($q) {
            return $q->where(['Tags.name' => 'awesome']);
        })
        ->group(['Authors.id'])
        ->autoFields(true);

..
    This function will not load any columns from the specified associations into the
    result set.

この関数は指定した関連からいずれのカラムも結果セットへとロードしません。

.. versionadded:: 3.1
    Query::leftJoinWith() は 3.1 で追加されました

.. end-filtering

..
    Changing Fetching Strategies

フェッチの戦略の変更する
----------------------------

..
    As you may know already, ``belongsTo`` and ``hasOne`` associations are loaded
    using a ``JOIN`` in the main finder query. While this improves query and
    fetching speed and allows for creating more expressive conditions when
    retrieving data, this may be a problem when you want to apply certain clauses to
    the finder query for the association, such as ``order()`` or ``limit()``.

すでにご存知の通り、 ``belongsTo`` と ``hasOne`` の関連はメインとなる Finder クエリの中で ``JOIN`` を使ってロードされます。
これにより、データ取得の際には、クエリとフェッチ速度が改善され、より表現力の高い条件文を作成できるようになります。
ただ一方で、``order()`` や ``limit()`` など、関連に影響する特定の句を Finder クエリに追加したい場合に、問題となりえます。

..
    For example, if you wanted to get the first comment of an article as an
    association::

たとえば、記事(Article)の最初のコメント(Comment)を関連データとして取得したい場合::

   $articles->hasOne('FirstComment', [
        'className' => 'Comments',
        'foreignKey' => 'article_id'
   ]);

..
    In order to correctly fetch the data from this association, we will need to tell
    the query to use the ``select`` strategy, since we want order by a particular
    column::

この関連からデータをただしくフェッチするには、特定のカラムで order by したいので、
クエリに ``select`` 戦略(strategy)を使うのだと教える必要があります::

    $query = $articles->find()->contain([
        'FirstComment' => [
                'strategy' => 'select',
                'queryBuilder' => function ($q) {
                    return $q->order(['FirstComment.created' =>'ASC'])->limit(1);
                }
        ]
    ]);

..
    Dynamically changing the strategy in this way will only apply to a specific
    query. If you want to make the strategy change permanent you can do::

この方法での戦略(strategy)の動的な変更は指定したクエリのみに適用されます。
もしも戦略の変更を永続的に行いたいなら次のようにできます::

    $articles->FirstComment->strategy('select');

..
    Using the ``select`` strategy is also a great way of making associations with
    tables in another database, since it would not be possible to fetch records
    using ``joins``.

``select`` 戦略の利用は、別データベースにあるテーブルとの関連を作るのに優れた方法です。
なぜなら、その場合は ``joins`` を使ってレコードをフェッチできないためです。


..
    Fetching With The Subquery Strategy

サブクエリ戦略でフェッチする
-----------------------------------

..
    As your tables grow in size, fetching associations from them can become
    slower, especially if you are querying big batches at once. A good way of
    optimizing association loading for ``hasMany`` and ``belongsToMany``
    associations is by using the ``subquery`` strategy::

テーブルのサイズが増えてくると、そのテーブルの関連のフェッチは遅くなっていきます。
一度に大きなデータを扱うクエリの場合には、なおのことです。
``hasMany`` と ``belongsToMany`` の関連データをロードする際、関連を最適化する良い方法は、
``subquery`` 戦略を使うことです::

    $query = $articles->find()->contain([
        'Comments' => [
                'strategy' => 'subquery',
                'queryBuilder' => function ($q) {
                    return $q->where(['Comments.approved' => true]);
                }
        ]
    ]);

..
    The result will remain the same as with using the default strategy, but this
    can greatly improve the query and fetching time in some databases, in
    particular it will allow to fetch big chunks of data at the same time in
    databases that limit the amount of bound parameters per query, such as
    **Microsoft SQL Server**.

結果はデフォルトの戦略と同じになりますが、データベースによってはクエリとフェッチ時間が著しく改善されます。
とりわけ、この戦略により、
**Microsoft SQL Server** などのようにクエリごとのバインド変数のサイズに制限があるデータベースであっても、
大きなデータの塊を一度に扱うことが可能になります。

..
    You can also make the strategy permanent for the association by doing::

関連データの戦略を永続的にしたいなら次のようにできます::

    $articles->Comments->strategy('subquery');

..
    Lazy Loading Associations

関連をレイジーロード(Lazy Load)する
------------------------------------

..
    While CakePHP makes it easy to eager load your associations, there may be cases
    where you need to lazy-load associations. You should refer to the
    :ref:`lazy-load-associations` and :ref:`loading-additional-associations`
    sections for more information.

CakePHP は簡単に関連付くデータをイーガーロード(Eager Load)できますが、レイジーロード(Lazy Load)したいというばあいもありえるでしょう。
その場合は :ref:`lazy-load-associations` と :ref:`loading-additional-associations` を参照してください。

..
    Working with Result Sets

結果セットを使いこなす
========================

..
    Once a query is executed with ``all()``, you will get an instance of
    :php:class:`Cake\\ORM\\ResultSet`. This object offers powerful ways to manipulate
    the resulting data from your queries. Like Query objects, ResultSets are
    a :doc:`Collection </core-libraries/collections>` and you can use any collection
    method on ResultSet objects.

``all()`` を使ってクエリが実行されたら、 :php:class:`Cake\\ORM\\ResultSet` のインスタンスが得られます。
このオブジェクトはクエリから得られた結果のデータを強力に操作する方法を提供します。
クエリオブジェクトと同様に、ResultSets は :doc:`Collection </core-libraries/collections>` ですので、
ResultSet オブジェクトのコレクションメソッドをどれでも使うことができます。

..
    Result set objects will lazily load rows from the underlying prepared statement.
    By default results will be buffered in memory allowing you to iterate a result
    set multiple times, or cache and iterate the results. If you need work with
    a data set that does not fit into memory you can disable buffering on the query
    to stream results::

ResultSet オブジェクトは基本となるプリペアードステートメント(prepared statement)から行をレイジーロード(Lazy Load)します。
デフォルトでは、結果をメモリにバッファしますので、結果セットを何度もイテレートすることができるようになり、
まだバッファされていなければ、結果をキャッシュしつつイテレートします::

    $query->bufferResults(false);

..
    Turning buffering off has a few caveats:

バッファを OFF に切り替える場合にはいくつか注意点があります:

#. 結果セットを複数回イテレートできません。
#. 結果をイテレートしてキャッシュすることもできません。
#. hasMany や belongsToMany の関連をイーガーロード(Eager Load)するクエリでは、バッファを無効化できません。
   なぜなら、これら関連タイプでは、結果のすべてに依存してクエリを生成しますので、全データのイーガーロードが必須となるのです。
   この制限は、関連に ``subquery`` 戦略を利用している場合には関係ありません。

..
    #. You will not be able to iterate a result set more than once.
    #. You will also not be able to iterate & cache the results.
    #. Buffering cannot be disabled for queries that eager load hasMany or
       belongsToMany associations, as these association types require eagerly
       loading all results so that dependent queries can be generated. This
       limitation is not present when using the ``subquery`` strategy for those
       associations.

.. warning::

    PostgreSQL や SQL Server を使った際の、ストリーミング結果(Streaming results)であっても
    エンティティ結果(entire results)用にメモリが割り当てられます。
    これは PDO の制約によるものです。

..
    Streaming results will still allocate memory for the entire results when
    using PostgreSQL and SQL Server. This is due to limitations in PDO.

..
    Result sets allow you to cache/serialize or JSON encode results for API
    results::

結果セットの結果は cache/serialize したり、API 用に JSON エンコードしたりすることができます::

    // コントローラやテーブルのメソッド内で
    $results = $query->all();

    // Serialized
    $serialized = serialize($results);

    // Json
    $json = json_encode($results);

..
    Both serializing and JSON encoding result sets work as you would expect. The
    serialized data can be unserialized into a working result set. Converting to
    JSON respects hidden & virtual field settings on all entity objects
    within a result set.

結果セットを serialize する場合も json_encode する場合も期待通りに動きます。
serialize されたデータは unserialized により結果セットに戻ります。
JSON への変換は、結果セット間のすべてのエンティティオブジェクト上の、 hidden と virtual field の設定を考慮します。

..
    In addition to making serialization easy, result sets are a 'Collection' object and
    support the same methods that :doc:`collection objects </core-libraries/collections>`
    do. For example, you can extract a list of unique tags on a collection of
    articles by running::

serialize が簡単にできるだけでなく、結果セットは 'Collection' オブジェクトですので、
:doc:`collection objects </core-libraries/collections>` でサポートされるすべてのメソッドが使えます。
たとえば、記事(Article)のコレクションにあるタグ(Tag)をユニークに取り出すことができます::


    // コントローラやテーブルのメソッド内で
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

..
    Some other examples of the collection methods being used with result sets are::

以下は、結果セットで使うコレクションメソッドの別の例です::

    // 計算されたプロパティにより行をフィルタします
    $filtered = $results->filter(function ($row) {
        return $row->is_recent;
    });

    // 結果のプロパティから連想配列を作成する
    $articles = TableRegistry::get('Articles');
    $results = $articles->find()->contain(['Authors'])->all();

    $authorList = $results->combine('id', 'author.name');

..
    The :doc:`/core-libraries/collections` chapter has more detail on what can be
    done with result sets using the collections features. The :ref:`format-results`
    section show how you can add calculated fields, or replace the result set.

コレクションの機能を使った結果セットの詳細は :doc:`/core-libraries/collections` を参照してください。
:ref:`format-results` では計算列の追加方法や結果セットの置き換え方法が示されています。

..
    Getting the First & Last Record From a ResultSet

ResultSet から最初/最後のレコードを取得する
------------------------------------------------


..
    You can use the ``first()`` and ``last()`` methods to get the respective records
    from a result set::

``first()`` と ``last()`` メソッドを使うことで、結果セットから該当のレコードを取得することができます::

    $result = $articles->find('all')->all();

    // 最初・最後の結果を取得します。
    $row = $result->first();
    $row = $result->last();

..
    Getting an Arbitrary Index From a ResultSet

ResultSet から任意の場所を指定して取得する
-------------------------------------------

..
    You can use ``skip()`` and ``first()`` to get an arbitrary record from
    a ResultSet::

``skip()`` と ``first()`` を使うことで ResultSet から任意のレコードを取得できます::

    $result = $articles->find('all')->all();

    // ５番目のレコードを取得する
    $row = $result->skip(4)->first();

..
    Checking if a Query or ResultSet is Empty

Query や ResultSet が空かどうかをチェックする
---------------------------------------------

..
    You can use the ``isEmpty()`` method on a Query or ResultSet object to see if it
    has any rows in it. Calling ``isEmpty()`` on a Query object will evaluate the
    query::

Query や ResultSet オブジェクトの ``isEmpty()`` メソッドを使うことで１行以上あるかどうかを確認できます。
Query オブジェクトで ``isEmpty()`` メソッドを呼び出した場合はクエリが評価されます::

    // クエリをチェックします
    $query->isEmpty();

    // 結果をチェックします
    $results = $query->all();
    $results->isEmpty();

.. _loading-additional-associations:

追加で関連をロードする
-------------------------------

..
    Loading Additional Associations

..
    Once you've created a result set, you may need to load
    additional associations. This is the perfect time to lazily eager load data. You
    can load additional associations using ``loadInto()``::

結果セットを作成した後に、追加の関連をロードする必要があるかもしれません。
これはレイジー(Lazy)にイーガーロード(Eager Load)する絶好のタイミングです。
``loadInto()`` を使うことで追加の関連をロードできます::

    $articles = $this->Articles->find()->all();
    $withMore = $this->Articles->loadInto($articles, ['Comments', 'Users']);

..
    You can eager load additional data into a single entity, or a collection of
    entities.

エンティティが単一であれ、コレクションであれ、
追加のデータをその中にイーガーロード(Eager Load)することができます。

.. versionadded: 3.1
    Table::loadInto() は 3.1 で追加されました

.. _map-reduce:

結果を Map/Reduce で変更する
=================================

..
    Modifying Results with Map/Reduce

..
    More often than not, find operations require post-processing the data that is
    found in the database. While entities' getter methods can take care of most of
    the virtual property generation or special data formatting, sometimes you
    need to change the data structure in a more fundamental way.

大抵の場合、find 操作でデータベースから取り出したデータは事後処理が必要となります。
エンティティの getter 系メソッドは仮想プロパティの生成や、
特別なデータフォーマッティングの多くを面倒みてくれますが、
ときには、より基本的な方法でデータ構造を変更する必要があることもあります。

..
    For those cases, the ``Query`` object offers the ``mapReduce()`` method, which
    is a way of processing results once they are fetched from the database.

このような場合に、データベースからフェッチした後で結果を処理する方法として、
``Query`` オブジェクトは ``mapReduce()`` を提供します。

..
    A common example of changing the data structure is grouping results together
    based on certain conditions. For this task we can use the ``mapReduce()``
    function. We need two callable functions the ``$mapper`` and the ``$reducer``.
    The ``$mapper`` callable receives the current result from the database as first
    argument, the iteration key as second argument and finally it receives an
    instance of the ``MapReduce`` routine it is running::

データ構造を変更するよくある事例は、結果をとある条件に基いて仕分けするものです。
このために ``mapReduce()`` 関数を使うことができます。
２つの callable な関数 ``$mapper`` と ``$reducer`` が必要となります。
``$mapper`` callable は第１引数としてデータベースから現在の結果を受け取り、
第２引数としてイテレーションのキーを受け取ります。
最後の引数として、走っている ``MapReduce`` ルーチンのインスタンスを受け取ります::

    $mapper = function ($article, $key, $mapReduce) {
        $status = 'published';
        if ($article->isDraft() || $article->isInReview()) {
            $status = 'unpublished';
        }
        $mapReduce->emitIntermediate($article, $status);
    };

..
    In the above example ``$mapper`` is calculating the status of an article, either
    published or unpublished, then it calls ``emitIntermediate()`` on the
    ``MapReduce`` instance. This method stores the article in the list of articles
    labelled as either published or unpublished.

上記の例では ``$mapper`` が article の status を published にするか unpublished にするか計算しており、
その後で ``MapReduce`` インスタンスの ``emitIntermediate()`` が呼ばれます。
このメソッドは published か unpublished のどちらかでラベル付けされた article リストの中に現在の article を追加します。

..
    The next step in the map-reduce process is to consolidate the final results. For
    each status created in the mapper, the ``$reducer`` function will be called so
    you can do any extra processing. This function will receive the list of articles
    in a particular "bucket" as the first parameter, the name of the "bucket" it
    needs to process as the second parameter, and again, as in the ``mapper()``
    function, the instance of the ``MapReduce`` routine as the third parameter. In
    our example, we did not have to do any extra processing, so we just ``emit()``
    the final results::

MapReduce 処理の次のステップは最終的な結果を確定させるためのものです。
mapper の中で生成される各 status ごとに ``$reducer`` 関数が呼ばれ、
追加の処理を何でも実行することができます。
この関数は第１引数で該当の "bucket" の中にある article リストを受け取り、
第２引数で処理対象の "bucket" 名を受け取り、
第３引数で ``mapper()`` 関数と同じように ``MapReduce`` ルーチンのインスタンスを受け取ります。
この例では何も追加の処理を行っていませんでしたが、最終的な結果に ``emit()`` だけを行っています::

    $reducer = function ($articles, $status, $mapReduce) {
        $mapReduce->emit($articles, $status);
    };

..
    Finally, we can put these two functions together to do the grouping::

最終的には、２つの関数を配置することで仕分けすることができます::

    $articlesByStatus = $articles->find()
        ->where(['author_id' => 1])
        ->mapReduce($mapper, $reducer);

    foreach ($articlesByStatus as $status => $articles) {
        echo sprintf("%d 件の %s の article が存在します", count($articles), $status);
    }

..
    The above will ouput the following lines::

上記は下記のように出力されます::

    4 件の published の article が存在します
    5 件の unpublished の article が存在します

..
    Of course, this is a simplistic example that could actually be solved in another
    way without the help of a map-reduce process. Now, let's take a look at another
    example in which the reducer function will be needed to do something more than
    just emitting the results.

もちろん、これは、実際には MapReduce 処理を使わずとも別の方法で解決できるような、ごく単純な例です。
次は、結果を emit する以上のことが求められるような reducer 関数を使った別の例を見てみましょう。

..
    Calculating the most commonly mentioned words, where the articles contain
    information about CakePHP, as usual we need a mapper function::

CakePHP についての情報を含む記事(article)でもっともよく発言された単語を計算する場合、
例によって mapper 関数が必要です::

    $mapper = function ($article, $key, $mapReduce) {
        if (stripos('cakephp', $article['body']) === false) {
            return;
        }

        $words = array_map('strtolower', explode(' ', $article['body']));
        foreach ($words as $word) {
            $mapReduce->emitIntermediate($article['id'], $word);
        }
    };

..
    It first checks for whether the "cakephp" word is in the article's body, and
    then breaks the body into individual words. Each word will create its own
    ``bucket`` where each article id will be stored. Now let's reduce our results to
    only extract the count::

まずは "cakephp" という単語が記事の本文中にあるかどうかをチェックし、
次に本文を個々の単語に分解します。
各単語ごとに ``bucket`` を生成し、その中に各記事の id を入れます。
こうなればあとは結果を reduce して、カウントを取り出すだけです::

    $reducer = function ($occurrences, $word, $mapReduce) {
        $mapReduce->emit(count($occurrences), $word);
    }

..
    Finally, we put everything together::

最後に、すべてを一緒にします::

    $articlesByStatus = $articles->find()
        ->where(['published' => true])
        ->andWhere(['published_date >=' => new DateTime('2014-01-01')])
        ->hydrate(false)
        ->mapReduce($mapper, $reducer);

..
    This could return a very large array if we don't clean stop words, but it could
    look something like this::

これは、ストップワードを除去しない場合、非常に大きな配列を返すこともありえますが、このようなものを返します::

    [
        'cakephp' => 100,
        'awesome' => 39,
        'impressive' => 57,
        'outstanding' => 10,
        'mind-blowing' => 83
    ]

..
    One last example and you will be a map-reduce expert. Imagine you have
    a ``friends`` table and you want to find "fake friends" in our database, or
    better said, people who do not follow each other. Let's start with our
    ``mapper()`` function::

最後の例を見ればもはや MapReduce のエキスパートです。
``friends`` (友人) テーブルが存在し、データベースから "嘘の友人" を検索することを想像してください。
わかりやすく言えば、双方向でフォローしあっていない人たちのことです。
``mapper()`` 関数を見てみましょう::

    $mapper = function ($rel, $key, $mr) {
        $mr->emitIntermediate($rel['source_user_id'], $rel['target_user_id']);
        $mr->emitIntermediate($rel['target_user_id'], $rel['source_target_id']);
    };

..
    We just duplicated our data to have a list of users each other user follows.
    Now it's time to reduce it. For each call to the reducer, it will receive a list
    of followers per user::

互いにフォローしあっているユーザリストを得るためにデータをコピーしていきました。
それでは reduce しましょう。
reducer が呼ばれるごとに、reducer はユーザごとのフォロワーのリストを受け取ります::

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

..
    And we supply our functions to a query::

そして、クエリにこの関数を渡します::

    $fakeFriends = $friends->find()
        ->hydrate(false)
        ->mapReduce($mapper, $reducer)
        ->toArray();

..
    This would return an array similar to this::

これは下記のような配列を返します::

    [
        1 => [2, 4],
        3 => [6]
        ...
    ]

..
    The resulting array means, for example, that user with id ``1`` follows users
    ``2`` and ``4``, but those do not follow ``1`` back.

結果の配列は、たとえば、 id ``1`` のユーザは ``2`` と ``4`` をフォローしていますが、
彼らは ``1`` をフォローし返していないということを意味します。

..
    Stacking Multiple Operations

複数の操作を stack する(重ねて呼ぶ)
-----------------------------------

..
    Using `mapReduce` in a query will not execute it immediately. The operation will
    be registered to be run as soon as the first result is attempted to be fetched.
    This allows you to keep chaining additional methods and filters to the query
    even after adding a map-reduce routine::

クエリの中で `mapReduce` を使用しても、すぐには実行されません。
代わりに最初の結果をフェッチしようとしたらただちに実行されるように登録されます。
これにより、別のメソッドやフィルタをチェーン(chain)呼び出しでクエリに加えたり、
さらには、 MapReduce ルーチンを追加することもできるようになるのです::

   $query = $articles->find()
        ->where(['published' => true])
        ->mapReduce($mapper, $reducer);

    // 後工程で下記のようにします:
    $query->where(['created >=' => new DateTime('1 day ago')]);

..
    This is particularly useful for building custom finder methods as described in the
    :ref:`custom-find-methods` section::

これは :ref:`custom-find-methods` で説明しているように、
カスタム Finder メソッドを構築するのに非常に便利です::

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
        // 前の章で説明した共通の単語の件と同じもの
        $mapper = ...;
        $reducer = ...;
        return $query->mapReduce($mapper, $reducer);
    }

    $commonWords = $articles
        ->find('commonWords')
        ->find('published')
        ->find('recent');

..
    Moreover, it is also possible to stack more than one ``mapReduce`` operation for
    a single query. For example, if we wanted to have the most commonly used words
    for articles, but then filter it to only return words that were mentioned more
    than 20 times across all articles::

さらに、１回のクエリで複数回の ``mapReduce`` 操作を stack する(重ねて呼ぶ)ことも可能です。
たとえば、記事の中でもっとも頻出する単語が知りたいのに加え、
記事すべての中で 20 回よりも多く発言された単語だけを返すようにフィルタもしたい場合は下記のようになります::

    $mapper = function ($count, $word, $mr) {
        if ($count > 20) {
            $mr->emit($count, $word);
        }
    };

    $articles->find('commonWords')->mapReduce($mapper);

..
    Removing All Stacked Map-reduce Operations

stack されたすべての MapReduce 操作をを取り除く
----------------------------------------------

..
    Under some circumstances you may want to modify a ``Query`` object so that no
    ``mapReduce`` operations are executed at all. This can be done by
    calling the method with both parameters as null and the third parameter
    (overwrite) as ``true``::

ときには ``mapReduce`` 操作をまったく実行させずに ``Query`` オブジェクトを更新したいという状況もあるかもしれません。
これは両方の引数に null を指定し、第３引数(overwrite)で ``true`` を呼び出すことで達成できます::

    $query->mapReduce(null, null, true);
