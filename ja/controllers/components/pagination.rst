ページネーション
#################

..  php:namespace:: Cake\Controller\Component

..  php:class:: PaginatorComponent

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

Controller::paginate() の使用
=============================

コントローラーでは、ページネーションで使用する ``$paginate`` コントローラー変数に
デフォルトの検索条件を定義することから始めます。これらの条件は、
ページネーション検索の基礎となります。これらに対して、URL から指定された ``sort`` 、
``direction`` 、 ``limit`` 、 ``page`` パラメーターが加えられます。
``order`` キーは、以下のような配列構造で定義しなければならないことに注意してください。 ::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Paginator');
        }
    }

また ``fields`` のように、 :php:meth:`~Cake\\ORM\\Table::find()`
によってサポートされたオプションのいずれも含めることができます。 ::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'fields' => ['Articles.id', 'Articles.created'],
            'limit' => 25,
            'order' => [
                'Articles.title' => 'asc'
            ]
        ];

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Paginator');
        }
    }

Paginate プロパティーからほとんどの検索オプションを指定することができるものの、
:ref:`custom-find-methods` に含めた方が、綺麗でかつ単純に指定することが可能となります。
``finder`` オプションを設定することで、 ファインダーを使ったページネーションを
定義することができます。 ::

    class ArticlesController extends AppController
    {
        public $paginate = [
            'finder' => 'published',
        ];
    }

「カスタム Finder メソッド」もオプションを指定することができるため、以下のように、
ページネーションのプロパティーの中のカスタム Finder メソッドにオプションを
受け渡すことができます。 ::

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
            $this->paginate = [
                'finder' => [
                    'tagged' => $customFinderOptions
                ]
            ];
            $articles = $this->paginate($this->Articles);
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


``Articles`` や ``Authors`` のキーの値は、モデル/キーが有する全てのプロパティーから、
``$paginate`` 配列を差し引いた分だけ、含めることができます。

``$paginate`` プロパティーが定義された後、ページネーションデータを作成するためには、
:php:meth:`~Cake\\Controller\\Controller::paginate()` メソッドを使用し、
``PaginatorHelper`` がまだ加えられていない場合は PaginatorHelper を加えます。
Controller の paginate メソッドは、ページ分けされた検索結果を返し、
ページネーションのメタデータを request にセットします。ページネーションのメタデータは、
``$this->request->getParam('paging')`` でアクセスできます。
``paginate()`` を使用するもっとまとまった例としては、 ::

    class ArticlesController extends AppController
    {
        public function index()
        {
            $this->set('articles', $this->paginate());
        }
    }

デフォルトの ``paginate()`` メソッドは、デフォルトのモデルをコントローラーとして使います。
また、find メソッドの検索結果を渡すこともできます。 ::

     public function index()
     {
        $query = $this->Articles->find('popular')->where(['author_id' => 1]);
        $this->set('articles', $this->paginate($query));
     }

異なるモデルを paginate したい場合は、そのための検索結果を渡すか、
テーブルオブジェクトそのものを渡すか、モデルの名称を渡すか、いずれかをすればいいです。 ::

    // クエリー（検索結果）を用いる場合
    $comments = $this->paginate($commentsTable->find());

    // モデル名を用いる場合
    $comments = $this->paginate('Comments');

    // テーブルオブジェクトを用いる場合
    $comments = $this->paginate($commentTable);

Paginator を直接使用する場合
============================

他のコンポーネントからデータを paginate する必要がある場合は、
PaginatorComponent を直接使用するのがよいです。こちらは、
コントローラーメソッドと類似した API となっております。 ::

    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    // または、
    $articles = $this->Paginator->paginate($articleTable, $config);

最初のパラメーターは、ページネーションしたい対象のテーブルオブジェクトにおける検索結果の
オブジェクトでなければいけません。この代替として、テーブルオブジェクトそのものを引き渡し、
クエリーを構築するという方法もあります。２番目のパラメーターは、ページネーションを
するにあたっての設定を示した配列でなければなりません。この配列は、コントローラーにおける
``$paginate`` プロパティーと同一の構造を有する必要があります。 ``Query`` オブジェクトで
ページネーションする時、 ``finder`` オプションは無視されます。
それは、あなたがページネーションしたいクエリーが渡されたとみなします。

.. _paginating-multiple-queries:

複数クエリーのページネーション
==============================

コントローラーの ``$paginate`` プロパティーの中や ``paginate()`` メソッドを呼ぶ際に
``scope`` オプションを使うことで、単一のコントローラーアクションに複数モデルで
paginate できます。 ::

    // paginate プロパティー
    public $paginate = [
        'Articles' => ['scope' => 'article'],
        'Tags' => ['scope' => 'tag']
    ];

    // コントローラーのアクションの中で
    $articles = $this->paginate($this->Articles, ['scope' => 'article']);
    $tags = $this->paginate($this->Tags, ['scope' => 'tag']);
    $this->set(compact('articles', 'tags'));

``scope`` オプションは、 ``PaginatorComponent`` の中でスコープ指定のクエリー文字列パラメーターを
見て結果を返します。例えば、以下の URL は、tags と articles の両方同時に paginate するために
使用できます。 ::

    /dashboard?article[page]=1&tag[page]=3

ページネーションのためのスコープ指定の HTML 要素や URL の生成方法に関しては
:ref:`paginator-helper-multiple` セクションをご覧ください。

.. versionadded:: 3.3.0
    マルチページネーションは、3.3.0 で追加されました。

並び替えに使用するフィールドをコントロール
==========================================

テーブルが有する non-virtual な列であれば、デフォルトではいずれのに対しても並び替えが可能です。
しかし、インデックスされていない列でも並び替えが可能となってしまい、負荷がかかってしまいます。
これを防ぐため、 ``sortWhitelist`` オプションを使用することで、並び替えが可能となるフィールドの
ホワイトリストを設定することができます。ページネーションの検索結果の一部となりうる関係データや、
計算されたフィールドを並び替えしたい場合は、このオプションが必要となります。 ::

    public $paginate = [
        'sortWhitelist' => [
            'id', 'title', 'Users.username', 'created'
        ]
    ];

ホワイトリストに記載されていないフィールドを並び替えしようとしても、これらは無視されます。

取得できる行数の最大値を設定
============================

取得できる行数については、limit 変数によってユーザーが確認できます。一般的には、
ページネーションされたセットを取得するときは、すべての行を取得するべきではない、とされます。
CakePHP は、デフォルトでは取得できる行数の上限は 100 に設定されております。もしこれが
アプリケーションにとって適切でなければ、ページネーションのオプションとして調整できます。 ::

    public $paginate = [
        // その他のキーはこちら
        'maxLimit' => 10
    ];

リクエストの制限パラメーターがこの値よりも大きかった場合、この ``maxLimit`` の値に削減されます。

追加のアソシエーションを Join させる
====================================

``contain`` パラメーターを使用することで、ページネーションされたテーブルに
追加のアソシエーションをロードすることができます。 ::

    public function index()
    {
        $this->paginate = [
            'contain' => ['Authors', 'Comments']
        ];

        $this->set('articles', $this->paginate($this->Articles));
    }


範囲外のページリクエスト
=========================

存在しないページに対してアクセスを試みたり、リクエストされたページ数がトータルのページ数よりも
大きかった場合に、Paginator コンポーネントは、 ``NotFoundException`` を返します。

従って、 ``NotFoundException`` が返されたときは、通常のエラーページが表示されるようにしたり、
try-catch 構文を活用して、適切な処理をすればよいです。 ::

    use Cake\Network\Exception\NotFoundException;

    public function index()
    {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // こちらで最初や最後のページにリダイレクトするような何かをします。
            // $this->request->getParam('paging') に要求された情報が入ります。
        }
    }

ビューにおけるページネーション
==============================

ページネーションのナビゲーションのためのリンクを生成する方法については、
:php:class:`~Cake\\View\\Helper\\PaginatorHelper` ドキュメンテーションを
参照してください。

..
    meta::
    :title lang=ja: ページネーション
    :keywords lang=ja: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
