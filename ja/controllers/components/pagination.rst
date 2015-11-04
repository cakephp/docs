ページネーション
####################

..  php:namespace:: Cake\Controller\Component

..  php:class:: PaginatorComponent

..
    One of the main obstacles of creating flexible and user-friendly web
    applications is designing an intuitive user interface. Many applications tend to
    grow in size and complexity quickly, and designers and programmers alike find
    they are unable to cope with displaying hundreds or thousands of records.
    Refactoring takes time, and performance and user satisfaction can suffer.


フレキシブルでかつユーザーフレンドリーなウェブアプリケーションを作成する際の主たる障害の一つとなるのが、直感的なユーザーインターフェイスです。多くのアプリケーションはすぐに巨大となりかつ複雑になり、デザイナーやプログラマーは、何百件、何千件ものレコードが表示されることに対応しきれなくなってきます。リファクタリングするには時間がかかり、パフォーマンスやユーザー満足度が犠牲になることが多いです。


..
    Displaying a reasonable number of records per page has always been a critical
    part of every application and used to cause many headaches for developers.
    CakePHP eases the burden on the developer by providing a quick, easy way to
    paginate data.


一ページあたりに表示されるレコードの数を一定数に抑えることは、すべてのアプリケーションにとって重大な課題であり、ディベロッパーにとって頭の痛い問題でした。CakePHPは素早く、かつ簡単に、データをページ分けする方法を提供することで、ディベロパーへの負担を軽減させます。


..
    Pagination in CakePHP is offered by a Component in the controller, to make
    building paginated queries easier. In the View
    :php:class:`~Cake\\View\\Helper\\PaginatorHelper` is used to make the generation
    of pagination links & buttons simple.


CakePHPにおけるページネーションは、コントローラーにおけるコンポーネントによって提供され、ページ分けされたクエリーをより簡単にビルドできるようにします。ビューの中の :php:class:`~Cake\\View\\Helper\\PaginatorHelper` は、ページネーションのリンクやボタンを作り出すことを容易にすることに使われます。


..
    Using Controller::paginate()


Controller::paginate()の使用
============================

..
    In the controller, we start by defining the default query conditions pagination
    will use in the ``$paginate`` controller variable. These conditions, serve as
    the basis for your pagination queries. They are augmented by the sort, direction
    limit, and page parameters passed in from the URL. It is important to note
    that the order key must be defined in an array structure like below::


コントローラーにおいては、$paginateパラメーターの中でページネーションが使用するデフォルトの検索条件を定義することから始めます。これらの条件は、ページネーション検索を行うにあたっての基本的な条件となります。これらに対して、URLから指定された、並び替え、件数上限、ページパラメーター等が加えられます。重要なこととして、”表示順”のキーが、以下のような配列構造にとって定義される必要があることを指摘します。


::

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


..
    You can also include any of the options supported by
    :php:meth:`~Cake\\ORM\\Table::find()`, such as ``fields``::


また ``fields`` のように、:php:meth:`~Cake\\ORM\\Table::find()` によってサポートされたオプションのいずれも含めることができます。


::

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


..
    While you can pass most of the query options from the paginate property it is
    often cleaner and simpler to bundle up your pagination options into
    a :ref:`custom-find-methods`. You can define the finder pagination uses by
    setting the ``finder`` option::


Paginate プロパティからほとんどの検索オプションを指定することができるものの、 :ref:`custom-find-methods` に含めた方が、綺麗でかつ単純に指定することが可能となります。Finderオプションを設定することで、ページネーションを定義することができます。


::

    class ArticlesController extends AppController
    {

        public $paginate = [
            'finder' => 'published',
        ];
    }


..
    Because custom finder methods can also take in options,
    this is how you pass in options into a custom finder method within the paginate property::


「カスタムファインダーメソッド」もオプションを指定することができるため、以下のように、ページネーションのプロパティの中のカスタムファインダーメソッドにオプションを受け渡すことができます。


::

    class ArticlesController extends AppController
    {

        // タグごとに記事を検索する
        public function tags()
        {
            $tags = $this->request->params['pass'];

            $customFinderOptions = [
                'tags' => $tags
            ];

            // カスタムファインダーメソッドは、ArticlesTable.phpの中で"findTagged"と呼ばれる
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


..
    In addition to defining general pagination values, you can define more than one
    set of pagination defaults in the controller, you just name the keys of the
    array after the model you wish to configure::


一般的なページネーションの値を定義することに加え、コントローラーには１セット以上のページネーションに関するデフォルト設定を定義することができます。そのためには、設定を加えたいモデルの後に、配列におけるキー名称を加えるだけです。


::

    class ArticlesController extends AppController
    {

        public $paginate = [
            'Articles' => [],
            'Authors' => [],
        ];
    }


..
    The values of the ``Articles`` and ``Authors`` keys could contain all the properties
    that a model/key less ``$paginate`` array could.


``Articles`` や ``Authors`` のキーの値は、モデル/キーが有する全てのプロパティから、 ``$paginate`` 配列を差し引いた分だけ、含めることができます。

..
    Once the ``$paginate`` property has been defined, we can use the
    :php:meth:`~Cake\\Controller\\Controller::paginate()` method to create the
    pagination data, and add the ``PaginatorHelper`` if it hasn't already been
    added. The controller's paginate method will return the result set of the
    paginated query, and set pagination metadata to the request. You can access the
    pagination metadata at ``$this->request->params['paging']``. A more complete
    example of using ``paginate()`` would be::


``$paginate`` プロパティが定義された後、ページネーションデータを作成するためには、 :php:meth:`~Cake\\Controller\\Controller::paginate()` メソッドを使用し、 ``PaginatorHelper`` がまだ加えられていない場合はPaginatorHelperを加えます。Controllerのpaginateメソッドは、ページ分けされた検索結果を返し、ページネーションのメタデータをrequestにセットします。ページネーションのメタデータは、 ``$this->request->params['paging']`` でアクセスできます。 ``paginate()`` を使用するもっとまとまった例としては、


::

    class ArticlesController extends AppController
    {

        public function index()
        {
            $this->set('articles', $this->paginate());
        }
    }


..
    By default the ``paginate()`` method will use the default model for
    a controller. You can also pass the resulting query of a find method::


デフォルトの ``paginate()`` メソッドは、デフォルトのモデルをコントローラーとして使います。また、findメソッドの検索結果を渡すこともできます。


::

     public function index()
     {
        $query = $this->Articles->find('popular')->where(['author_id' => 1]);
        $this->set('articles', $this->paginate($query));
    }


..
    If you want to paginate a different model you can provide a query for it, the
    table object itself, or its name::


異なるモデルをpaginateしたい場合は、そのための検索結果を渡すか、テーブルオブジェクトそのものを渡すか、モデルの名称を渡すか、いずれかをすればいいです。


::

    // クエリー（検索結果）を用いる場合
    $comments = $this->paginate($commentsTable->find());

    // モデル名を用いる場合
    $comments = $this->paginate('Comments');

    // テーブルオブジェクトを用いる場合
    $comments = $this->paginate($commentTable);


..
    Using the Paginator Directly


Paginatorを直接使用する場合
================================


..
    If you need to paginate data from another component you may want to use the
    PaginatorComponent directly. It features a similar API to the controller
    method::


他のコンポーネントからデータをpaginateする必要がある場合は、PaginatorComponentを直接使用するのがよいです。こちらは、コントローラーメソッドと類似したAPIとなっております。


::


    $articles = $this->Paginator->paginate($articleTable->find(), $config);

    // Or
    $articles = $this->Paginator->paginate($articleTable, $config);


..
    The first parameter should be the query object from a find on table object you wish
    to paginate results from. Optionally, you can pass the table object and let the query
    be constructed for you. The second parameter should be the array of settings to use for
    pagination. This array should have the same structure as the ``$paginate``
    property on a controller.


最初のパラメーターは、ページネーションしたい対象のテーブルオブジェクトにおける検索結果のオブジェクトでなければいけません。この代替として、テーブルオブジェクトそのものを引き渡す、という方法もあります。２番目のパラメーターは、ページネーションをするにあたっての設定を示した配列でなければなりません。この配列は、コントローラーにおける ``$paginate`` プロパティと同一の構造を有する必要があります。


..
    Control which Fields Used for Ordering


並び替えに使用するフィールドをコントロール
===============================================


..
    By default sorting can be done on any non-virtual column a table has. This is
    sometimes undesirable as it allows users to sort on un-indexed columns that can
    be expensive to order by. You can set the whitelist of fields that can be sorted
    using the ``sortWhitelist`` option. This option is required when you want to
    sort on any associated data, or computed fields that may be part of your
    pagination query::


テーブルが有するnon-virtualな列であれば、デフォルトではいずれのに対しても並び替えが可能です。しかし、インデックスされていない列でも並び替えが可能となってしまい、負荷がかかってしまいます。これを防ぐため、 ``sortWhitelist`` オプションを使用することで、並び替えが可能となるフィールドのホワイトリストを設定することができます。ページネーションの検索結果の一部となりうる関係データや、計算されたフィールドを並び替えしたい場合は、このオプションが必要となります。


::

    public $paginate = [
        'sortWhitelist' => [
            'id', 'title', 'Users.username', 'created'
        ]
    ];


..
    Any requests that attempt to sort on fields not in the whitelist will be
    ignored.


ホワイトリストに記載されていないフィールドを並び替えしようとしても、これらは無視されます。


..
    Limit the Maximum Number of Rows that can be Fetched


取得できる行数の最大値を設定
====================================================

..
    The number of results that are fetched is exposed to the user as the
    ``limit`` parameter. It is generally undesirable to allow users to fetch all
    rows in a paginated set. By default CakePHP limits the maximum number of rows
    that can be fetched to 100. If this default is not appropriate for your
    application, you can adjust it as part of the pagination options::


取得できる行数については、limit変数によってユーザーが確認できます。一般的には、ページネーションされたセットを取得するときは、すべての行を取得するべきではない、とされます。CakePHPは、デフォルトでは取得できる行数の上限は100に設定されております。もしこれがアプリケーションにとって適切でなければ、ページネーションのオプションとして調整できます。


::

    public $paginate = [
        // Other keys here.
        'maxLimit' => 10
    ];


..
    If the request's limit param is greater than this value, it will be reduced to
    the ``maxLimit`` value.


リクエストの制限パラメーターがこの値よりも大きかった場合、この ``maxLimit`` の値に削減されます。


..
    Joining Additional Associations


追加のアソシエーションをJoinさせる
=======================================


..
    Additional associations can be loaded to the paginated table by using the
    ``contain`` parameter::


``contain`` パラメーターを使用することで、ページネーションされたテーブルに追加のアソシエーションをロードすることができます。


::

    public function index()
    {
        $this->paginate = [
            'contain' => ['Authors', 'Comments']
        ];

        $this->set('articles', $this->paginate($this->Articles));
    }


..
    Out of Range Page Requests


領域外のページリクエスト
==========================

..
    The PaginatorComponent will throw a ``NotFoundException`` when trying to
    access a non-existent page, i.e. page number requested is greater than total
    page count.


存在しないページに対してアクセスを試みたり、リクエストされたページ数がトータルのページ数よりも大きかった場合に、Paginatorコンポーネントは、 ``NotFoundException`` を返します。

..
    So you could either let the normal error page be rendered or use a try catch
    block and take appropriate action when a ``NotFoundException`` is caught::


従って、 ``NotFoundException`` が返されたときは、通常のエラーページが表示されるようにしたり、try-catch構文を活用して、適切な処理をすればよいです。


::

    use Cake\Network\Exception\NotFoundException;

    public function index()
    {
        try {
            $this->paginate();
        } catch (NotFoundException $e) {
            // Do something here like redirecting to first or last page.
            // $this->request->params['paging'] will give you required info.
        }
    }

..
    Pagination in the View


ビューにおけるページネーション
=================================

..
    Check the :php:class:`~Cake\\View\\Helper\\PaginatorHelper` documentation for
    how to create links for pagination navigation.


ページネーションのナビゲーションのためのリンクを生成する方法については、 :php:class:`~Cake\\View\\Helper\\PaginatorHelper` ドキュメンテーションを参照のこと。

..
    meta::
    :title lang=ja: Pagination
    :keywords lang=ja: order array,query conditions,php class,web applications,headaches,obstacles,complexity,programmers,parameters,paginate,designers,cakephp,satisfaction,developers
