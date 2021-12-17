ページネーション
#################

.. php:namespace:: Cake\Controller\Component

.. php:class:: PaginatorComponent

フレキシブルでかつユーザーフレンドリーなウェブアプリケーションを作成する際の主たる障害の
一つとなるのが、直感的なユーザーインターフェイスです。多くのアプリケーションはすぐに巨大となり
かつ複雑になり、デザイナーやプログラマーは、何百件、何千件ものレコードが表示されることに
対応しきれなくなってきます。リファクタリングするには時間がかかり、パフォーマンスやユーザー満足度が
犠牲になることが多いです。

１ページあたりに表示されるレコードの数を一定数に抑えることは、すべてのアプリケーションにとって
重大な課題であり、開発者にとって頭の痛い問題でした。CakePHP は素早く、かつ簡単に、
データをページ分けする方法を提供することで、開発者への負担を軽減します。

CakePHP におけるページネーションは、コントローラーにおけるコンポーネントによって提供され、
ページ分けされたクエリーをより簡単にビルドできるようにします。ビューの中の
:php:class:`~Cake\\View\\Helper\\PaginatorHelper` は、ページネーションのリンクや
ボタンを作り出すことを容易にすることに使われます。

基本的な使用方法
================

クエリをページ分割するには、まず ``PaginatorComponent`` をロードする必要があります。 ::

    class ArticlesController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Paginator');
        }
    }

一度ロードされれば、ORMテーブルクラスや ``Query`` オブジェクトをページ分割することができます。 ::

    public function index()
    {
        // ORM テーブルのページ分割
        $this->set('articles', $this->paginate($this->Articles));

        // 部分的に完了したクエリをページ分割する
        $query = $this->Articles->find('published');
        $this->set('articles', $this->paginate($query));
    }

高度な使用方法
==============

``PaginatorComponent`` は、 ``$paginate`` のコントローラプロパティや ``paginate()`` の引数
``$settings`` として設定することで、より複雑なユースケースをサポートしています。
これらの条件はページ分割クエリの基礎となります。
これらの条件は URLから渡される ``sort``, ``direction``, ``limit``, ``page``
のパラメータによって拡張されます。　::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];
    }

.. tip::
    デフォルトの ``order`` オプションは配列として定義されていなければなりません。

:php:meth:`~Cake\\ORM\\Table::find()` でサポートされているオプションのいずれかを
ページ分割の設定に含めることができます。
ページネーションオプションを :ref:`custom-find-methods` にバンドルする方が
すっきりしていてシンプルです。
``finder`` オプションを使用することで、ページ分割の際にファインダーを使用することができます。 ::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'finder' => 'published',
        ];
    }

ファインダーメソッドに追加のオプションが必要な場合は、これらの値を finder: に渡すことができます。 ::

    class ArticlesController extends AppController
    {
        // タグごとに記事を検索する
        public function tags()
        {
            $tags = $this->request->getParam('pass');

            $customFinderOptions = [
                'tags' => $tags
            ];

            // カスタム Finder メソッドは、ArticlesTable.php の中で "findTagged" と呼ばれる
            // 以下のような構文となっている
            // public function findTagged(Query $query, array $options) {
            // そのため、taggedをキーとして使用する
            $settings = [
                'finder' => [
                    'tagged' => $customFinderOptions
                ]
            ];
            $articles = $this->paginate($this->Articles, $settings);
            $this->set(compact('articles', 'tags'));
        }
    }

一般的なページネーションの値を定義することに加え、コントローラーには１セット以上の
ページネーションに関するデフォルト設定を定義することができます。そのためには、
設定を加えたいモデルの後に、配列におけるキー名称を加えるだけです。 ::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'Articles' => [],
            'Authors' => [],
        ];
    }

``Articles`` や ``Authors`` のキーの値は、基本的な ``$paginate`` 配列に含まれる
すべてのプロパティを含めることができます。

一度 ``paginate()`` を使って結果を作成した後は コントローラのリクエストは
ページングパラメータで更新されます。
ページングのメタデータは ``$this->request->getParam('paging')`` で取得できます。

シンプルなページネーション
==========================

デフォルトではページネーションは ``count()`` クエリを使って結果セットのサイズを計算し、
ページ番号のリンクを表示できるようにしています。
非常に大きなデータセットでは、このcountクエリは非常に高価になります。
'Next' と 'Previous' リンクだけを表示したい場合は、カウントクエリを行わない
'simple' paginator を使うことができます。 ::

    public function initialize(): void
    {
        parent::initialize();

        // Load the paginator component with the simple paginator strategy.
        $this->loadComponent('Paginator', [
            'paginator' => new \Cake\Datasource\SimplePaginator(),
        ]);
    }

``SimplePaginator`` を使っている場合、ページ番号やカウンターデータ、最後のページへのリンク、
総レコード数のコントロールを生成することはできません。

PaginatorComponent を直接使用する
=================================

他のコンポーネントからデータをページ分割する必要がある場合は
``PaginatorComponent`` を直接使うと良いでしょう。
``PaginatorComponent`` はコントローラメソッドと似たようなAPIを持っています。　::

    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    // または
    $articles = $this->Paginator->paginate($articleTable, $config);

最初のパラメータは、ページ分割したいテーブルオブジェクトの検索結果からの
クエリオブジェクトでなければなりません。
オプションで、テーブルオブジェクトを渡してクエリを作成することもできます。
2番目のパラメータは、ページ分割に使用する設定の配列です。
この配列はコントローラの ``$paginate`` プロパティと同じ構造でなければなりません。
``Query`` オブジェクトをページ分割する際には、 ``finder`` オプションは無視されます。
これは、ページ分割したいクエリを渡していることを前提としています。

.. _paginating-multiple-queries:

複数のクエリのページ分割
========================

コントローラの ``$paginate`` プロパティと ``paginate()`` メソッドを呼び出す際に
``scope`` オプションを使うことで、1つのコントローラのアクションの中で複数のモデルを
ページ分割することができます。 ::

    // ページ分割するプロパティ
    public $paginate = [
        'Articles' => ['scope' => 'article'],
        'Tags' => ['scope' => 'tag']
    ];

    // コントローラーアクションにおいて
    $articles = $this->paginate($this->Articles, ['scope' => 'article']);
    $tags = $this->paginate($this->Tags, ['scope' => 'tag']);
    $this->set(compact('articles', 'tags'));

``scope`` オプションを指定すると、 ``PaginatorComponent`` がスコープされた
クエリ文字列パラメータを検索するようになります。
例えば、以下のURLはタグと記事を同時にページ分割するのに使えます。 ::

    /dashboard?article[page]=1&tag[page]=3

スコープされたHTML要素やページネーション用のURLを生成する方法については
:ref:`paginator-helper-multiple` のセクションを参照してください。

同じモデルを複数回ページ分割する
==================================

1つのコントローラアクション内で同じモデルを複数回ページ分割するには、
モデルのエイリアスを定義する必要があります。
テーブルレジストリの使用方法の詳細については、 :ref:`table-registry-usage` を参照してください。 ::

    // コントローラーアクションにおいて
    $this->paginate = [
        'ArticlesTable' => [
            'scope' => 'published_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
        'UnpublishedArticlesTable' => [
            'scope' => 'unpublished_articles',
            'limit' => 10,
            'order' => [
                'id' => 'desc',
            ],
        ],
    ];

    $publishedArticles = $this->paginate(
        $this->Articles->find('all', [
            'scope' => 'published_articles'
        ])->where(['published' => true])
    );

    // ページ分割コンポーネントで差別化できるようにテーブルオブジェクトを追加登録します。
    $unpublishedArticlesTable = $this->fetchTable('UnpublishedArticles', [
        'className' => 'App\Model\Table\ArticlesTable',
        'table' => 'articles',
        'entityClass' => 'App\Model\Entity\Article',
    ]);

    $unpublishedArticles = $this->paginate(
        $unpublishedArticlesTable->find('all', [
            'scope' => 'unpublished_articles'
        ])->where(['published' => false])
    );

.. _control-which-fields-used-for-ordering:

ソート時に使用するフィールドの制御
==================================

デフォルトでは、テーブルが持つ非仮想カラムに対してソートを行うことができます。
これはインデックス化されていないカラムをソートしてしまうことになり、
ソートするのにコストがかかるため、望ましくないこともあります。
ソートできるフィールドのホワイトリストを ``sortableFields`` オプションを使って設定することができます。
このオプションは関連するデータやページ分割クエリの一部である計算フィールドをソートしたい場合に必要です。 ::

    public $paginate = [
        'sortableFields' => [
            'id', 'title', 'Users.username', 'created'
        ]
    ];

ホワイトリストにないフィールドでソートしようとするリクエストは無視されます。

1ページあたりの最大行数を制限する
=================================

ページごとに取得される結果の数は ``limit`` パラメータとしてユーザに公開されます。
一般的に、ユーザがページ分割されたセットのすべての行を取得できるようにすることは望ましくありません。
オプションの ``maxLimit`` は、外部からこの制限値を高く設定することはできないことを保証します。
デフォルトでは、CakePHPはフェッチできる行の最大数を100に制限しています。
もしこのデフォルト値がアプリケーションにとって適切でない場合は、
ページ分割オプションの一部として調整することができます。 ::

    public $paginate = [
        // 他のキーはこちら
        'maxLimit' => 10
    ];

リクエストのリミットパラメータがこの値よりも大きければ、 ``maxLimit`` の値まで減らされます。

追加の関連付けへのジョイン
===============================

追加の関連付けをページ分割されたテーブルにロードするには、 ``contain`` パラメータを使用します。 ::

    public function index()
    {
        $this->paginate = [
            'contain' => ['Authors', 'Comments']
        ];

        $this->set('articles', $this->paginate($this->Articles));
    }

範囲外のページ要求
==================

PaginatorComponent は、存在しないページにアクセスしようとすると ``NotFoundException``` をスローします。

そのため、通常のエラーページをレンダリングさせるか、 try catch ブロックを使用して
``NotFoundException`` が発生した場合に適切な処理を行うことができます。 ::

    use Cake\Http\Exception\NotFoundException;

    public function index()
    {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // 最初のページや最後のページにリダイレクトするようにします。
            // $this->request->getAttribute('page')を指定すると、必要な情報が得られます。
        }
    }

ビューのページネーション
========================

ページネーションナビゲーションのリンクの作り方は、 :php:class:`~Cake\\View\\Helper\PaginatorHelper`
のドキュメントを確認してください。

..
    meta::
    :title lang=ja: ページネーション
    :keywords lang=ja: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
