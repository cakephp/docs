ルーティング
############

.. php:namespace:: Cake\Routing

.. php:class:: Router

ルーティングは URL とコントローラーのアクションをマップするツールを提供します。
ルートを設定することで、アプリケーションの実装方法を URL の構造から分離できます。

CakePHP でのルーティングはまた パラメーターの配列を URL 文字列に変換する
リバースルーティングというアイディアも含まれます。リバースルーティングを使用することによって、
アプリケーションの URL の構造を全部のコードの書き直しをせずに再調整できます。

.. index:: routes.php

クイックツアー
==============

ここでは、 CakePHP の最も一般的なルーティングの方法について例を出して説明します。
ランディングページとして何かを表示したい時がよくあるでしょう。そのときは、 **routes.php**
ファイルに以下を加えます。 ::

    use Cake\Routing\Router;

    // スコープ付きルートビルダーを使用。
    Router::scope('/', function ($routes) {
        $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);
    });

    // static メソッドを使用。
    Router::connect('/', ['controller' => 'Articles', 'action' => 'index']);

``Router`` はルーティングするための2つのインターフェースを提供します。
この static メソッドは後方互換性のあるインターフェースですが、
スコープ付きビルダーで複数のルートを構築するためのより簡潔な構文を提供し、
パフォーマンスは向上します。

これはサイトのホームページにアクセスした時に ``ArticlesController`` の
index メソッドを実行します。時々、複数のパラメーターを受け取る動的なルートが
必要になると思います。それが必要になるケースは、例えば、記事の内容を表示するためのルートです。 ::

    $routes->connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

上記のルートは、  ``/articles/15`` のような URL を受け取り、 ``ArticlesController``
の ``view(15)`` メソッドを呼びます。しかし、これは ``/articles/foobar`` のような URL からの
アクセスを防ぐわけではありません。もし、あなたが望むなら、いくつかのパラメーターを正規表現に従うように
制限することができます。 ::

    $routes->connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    ->setPatterns(['id' => '\d+'])
    ->setPass(['id']);

    // 3.5 より前はオプション配列を使用
    $routes->connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    );

上の例はスターマッチャーを新たにプレースホルダー ``:id`` に変更しました。
プレースホルダーを使うことで、URL 部分のバリデーションができます。
このケースでは ``\d+`` という正規表現を使いました。なので、数字のみが一致します。
最後に、 Router に ``id`` プレースホルダーを ``view()`` 関数の引数として渡すように
``pass`` オプションで伝えます。このオプションの詳細は後で説明します。

CakePHP の Router はルートを逆にできます。それは、一致するパラメーターを含む配列から、
URL 文字列を生成できることを意味します。 ::

    use Cake\Routing\Router;

    echo Router::url(['controller' => 'Articles', 'action' => 'view', 'id' => 15]);
    // 出力結果
    /articles/15

ルートは一意の名前を付けることもできます。これは、リンクを構築する際に、
ルーティングパラメーターをそれぞれ指定する代わりに、ルートを素早く参照することができます。 ::

    // routes.php の中で
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    use Cake\Routing\Router;

    echo Router::url(['_name' => 'login']);
    // 出力結果
    /login

ルーティングコードを DRY に保つために、Router は 'スコープ' (scopes) というコンセプトを
持っています。スコープは一般的なパスセグメントを定義し、オプションとして、デフォルトに
ルーティングします。すべてのスコープの内側に接続されているルートは、ラップしているスコープの
パスとデフォルトを継承します。 ::

    Router::scope('/blog', ['plugin' => 'Blog'], function ($routes) {
        $routes->connect('/', ['controller' => 'Articles']);
    });

上記のルートは ``/blog/`` と一致し、それを
``Blog\Controller\ArticlesController::index()`` に送ります。

アプリケーションの雛形は、いくつかのルートをはじめから持った状態で作られます。
一度自分でルートを追加したら、デフォルトルートが必要ない場合は除去できます。

.. index:: :controller, :action, :plugin
.. index:: greedy star, trailing star
.. _connecting-routes:
.. _routes-configuration:

ルートを接続
============

.. php:method:: connect($route, $defaults = [], $options = [])

コードを :term:`DRY` に保つために 'ルーティングスコープ' を使用してください。
ルーティングスコープはコードを DRY に保つためだけではなく、Router の操作を最適化します。
このメソッドは ``/`` スコープがデフォルトです。スコープを作成しいくつかのルートを
接続するために、 ``scope()`` メソッドを使います。 ::

    // config/routes.php 内で、
    use Cake\Routing\Route\DashedRoute;

    Router::scope('/', function ($routes) {
        // 標準のフォールバックルートを接続します。
        $routes->fallbacks(DashedRoute::class);
    });

``connect()`` メソッドは３つのパラメーターを持ちます。あなたが一致させたい URL テンプレート、
ルート要素のためのデフォルト値、そしてルートのためのオプションの３つです。
しばしば、オプションには、ルーターが URL の要素を一致することに役立つ
正規表現ルールが含まれます。

ルートを定義するための基本のフォーマットは、次の通りです。 ::

    $routes->connect(
        '/url/template',
        ['default' => 'defaultValue'],
        ['option' => 'matchingRegex']
    );

１番目のパラメーターは、Router にどの URL を制御しようとしているのか伝えます。この URL は
普通のスラッシュで区切られた文字列ですが、ワイルドカード (\*) や :ref:`route-elements`
を含むことができます。ワイルドカードは、すべての引数を受け付けることを意味します。
\* なしだと、文字列に完全一致するものだけに絞られます。

URL が特定されたら、一致したときにどのような動作をするかを CakePHP に伝えるために
``connect()`` の残り２つのパラメーターを使います。２番目のパラメーターは、連想配列です。
この配列のキーは、URL テンプレートが示すルート要素に因んで命名すべきです。
配列の値はキーのためのデフォルトの値になります。 ``connect()`` の３番目のパラメーターを
使う前に基本的な例を見てみましょう。 ::

    $routes->connect(
        '/pages/*',
        ['controller' => 'Pages', 'action' => 'display']
    );

このルートは CakePHP によってあらかじめ用意されている routes.php ファイルにあります。
それは ``/pages/`` ではじまるすべての URL に一致し、 ``PagesController`` の
``display()`` アクションに渡します。 ``/pages/products`` へのリクエストは、
``PagesController->display('products')`` にマップされます。

貧欲なスター (greedy star) ``/*``  に加えて、 ``/**`` 流れ星 (trailing star) 構文が
あります。２つのアスタリスクをつなげると、URL の残りを１つの引数として取り込みます。
これは、 ``/`` を含む引数を使用したい時に便利です。 ::

    $routes->connect(
        '/pages/**',
        ['controller' => 'Pages', 'action' => 'show']
    );

``/pages/the-example-/-and-proof`` が URL として渡ってきたときに、
``the-example-/-and-proof`` を引数として渡せます。

``connect()`` の２番目のパラメーターは ルートの初期値から構成されているすべての引数を
生成するために使えます。 ::

    $routes->connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );

この例では、 ``connect()`` の２番目のパラメーターをデフォルトの値を定義するために使う方法を
示しています。もし、いろいろなカテゴリーの製品を顧客に対して提供するサイトを作るのであれば、
ルーティングすることを考えるべきです。上記は、 ``/pages/display/5`` ではなく ``/government``
にリンクすることができます。

ルーティングの一般的な用途は、コントローラーまたはモデル名と一致しない URL セグメントを作成することです。
``/users/some_action/5`` で標準の URL にアクセスするのではなく、 ``/cooks/some_action/5``
でアクセスしたいとしましょう。次のルートでそれが処理できます。 ::

    $routes->connect(
        '/cooks/:action/*', ['controller' => 'Users']
    );

これは Router に ``/cooks/`` で始まるすべての URL は ``UsersController`` に送るように
伝えています。 アクションは  ``:action`` パラメーターの値によって呼ばれるかどうか決まります。
:ref:`route-elements` を使って、ユーザーの入力や変数を受け付けるいろいろなルーティングが
できます。上記のルーティングの方法は、貧欲なスター (greedy star） を使います。
貧欲なスターは  :php:class:`Router` がすべての位置指定引数を受け取ることを意味します。
それらの引数は :ref:`passed-arguments` 配列で有効化されます。

URL を生成するときにもルーティングは使われます。もし最初に一致するものがあった場合、
``['controller' => 'users', 'action' => 'some_action', 5]`` を使って
``/cooks/some_action/5`` と出力します。

これまでに接続したルートは、任意の HTTP 動詞と一致します。REST API を構築している際、
HTTP アクションを異なるコントローラメソッドにマップすることがよくあります。
``RouteBuilder`` はヘルパーメソッドを提供し、特定の HTTP 動詞のルートをより簡単に定義します。 ::

    // GET リクエストへのみ応答するルートの作成
    $routes->get(
        '/cooks/:id',
        ['controller' => 'Users', 'action' => 'view'],
        'users:view'
    );

    // PUT リクエストへのみ応答するルートの作成
    $routes->put(
        '/cooks/:id',
        ['controller' => 'Users', 'action' => 'update'],
        'users:update'
    );

上記のルートは、使用される HTTP 動詞に基づいて、同じ URL を異なるコントローラーアクションに
マップします。GET リクエストは 'view' アクションに行き、PUT リクエストは 'update' アクションに
行きます。次の HTTP ヘルパーメソッドがあります。

* GET
* POST
* PUT
* PATCH
* DELETE
* OPTIONS
* HEAD

これらのメソッドはすべてルートインスタンスを返すので、 :ref:`流暢なセッター
<route-fluent-methods>` を活用してルートをさらに設定することができます。

.. versionadded:: 3.5.0
    HTTP 動詞ヘルパーメソッドは 3.5.0 で追加されました。

.. _route-elements:

ルート要素
----------

あなたは独自のルート要素を指定し、コントローラーのアクションのパラメーターを
URL のどこに配置すべきなのかを定義することができます。リクエストされたとき、
これらのルート要素の値は、コントローラーの ``$this->request->getParam()`` から取得できます。
カスタムルート要素を定義した場合、正規表現をオプションで指定できます。
これは CakePHP にどんな URL が正しいフォーマットなのかを伝えます。
正規表現を使用しなかった場合、 ``/`` 以外の文字はパラメーターの一部として扱われます。 ::

    $routes->connect(
        '/:controller/:id',
        ['action' => 'view']
    )->setPatterns(['id' => '[0-9]+']);

    // 3.5 より前はオプション配列を使用
    $routes->connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

上記の例は、 ``/コントローラー名/:id`` のような形の URL で、任意のコントローラーの
モデルを表示するための、素早く作成する方法を示しています。 ``connect()`` に渡した URL は
``:controller`` と ``:id`` という２つのルート要素を指定します。この ``:controller`` 要素は
CakePHP のデフォルトルート要素であるため、ルーターが URL のコントローラー名をどのように照合し識別するかを
知っています。 ``:id`` 要素はカスタムルート要素で、 ``connect()`` の３番目のパラメーターに
一致する正規表現を指定することで、より明確にする必要があります。

CakePHP は小文字とダッシュによって表された URL を ``:controller`` を使った時には出力しません。
これを出力したい場合、上記の例を次のように書きなおしてください。 ::

    use Cake\Routing\Route\DashedRoute;

    // 異なるルートクラスを持つビルダーを作成します。
    $routes->scope('/', function ($routes) {
        $routes->setRouteClass(DashedRoute::class);
        $routes->connect('/:controller/:id', ['action' => 'view'])
            ->setPatterns(['id' => '[0-9]+']);

        // 3.5 より前はオプション配列を使用
        $routes->connect(
            '/:controller/:id',
            ['action' => 'view'],
            ['id' => '[0-9]+']
        );
    });

``DashedRoute`` クラス ``:controller`` を確認し、
``:plugin`` パラメーターを正しく小文字とダッシュによって表します。

CakePHP 2.x アプリケーションから移行するときに、小文字とアンダースコアーによる
URL が必要であるなら、 ``InflectedRoute`` クラスを代わりに使用できます。

.. note::

    ルート要素で使用する正規表現パターンはキャプチャーグループを含んではいけません。
    もし含んでいると、Router は正しく機能しません。

一度、ルートが定義されたら、 ``/apples/5`` を呼ぶと
ApplesController の ``view()`` メソッドを呼びます。  ``view()`` メソッドの中で、
``$this->request->getParam('id')`` で渡された ID にアクセスする必要があります。

アプリケーションの中に一つのコントローラーがあり、URL にコントローラー名を表示されないようにするには、
全ての URL をコントローラーのアクションにマップすることができます。
たとえば、 ``home`` コントローラーのアクションにすべての URL をマップするために、
``/home/demo`` の代わりに ``/demo``  という URL を持つとすると、次のようにできます。 ::

    $routes->connect('/:action', ['controller' => 'Home']);

もし、大文字小文字を区別しない URL を提供したい場合、正規表現インライン修飾子を使います。 ::

    // 3.5 より前は setPatterns() の代わりにオプション配列を使用
    $routes->connect(
        '/:userShortcut',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
    )->setPatterns(['userShortcut' => '(?i:principal)']);

もう一つ例を挙げます。これであなたはルーティングのプロです。 ::

    // 3.5 より前は setPatterns() の代わりにオプション配列を使用
    $routes->connect(
        '/:controller/:year/:month/:day',
        ['action' => 'index']
    )->setPatterns([
        'year' => '[12][0-9]{3}',
        'month' => '0[1-9]|1[012]',
        'day' => '0[1-9]|[12][0-9]|3[01]'
    ]);

これは、いっそう複雑になりますが、ルーティングがとても強力になったことを示しています。
この URL は４つのルート要素を持っています。１番目は、なじみがあります。デフォルトのルート要素で
CakePHP にコントローラー名が必要なことを伝えています。

次に、デフォルト値を指定します。コントローラーにかかわらず ``index()`` アクションを呼び出す必要があります。

最後に、数字形式の年と月と日に一致する正規表現を指定しています。正規表現の中で、丸括弧（グループ化）は
サポートされていないことに注意してください。上記のように、代わりのものを指定できますが、
丸括弧によるグループ化はできません。

一度定義されると、このルートは ``/articles/2007/02/01`` , ``/articles/2004/11/16``
にマッチし、 ``$this->request->getParam()`` の中の日付パラメーターを伴って
それぞれのコントローラーの ``index()`` アクションにリクエストを渡します。

CakePHP には、いくつかの特別な意味を持つルート要素があります。
そして、特別な意味を持たせたくないなら、使わないでください。

* ``controller`` ルートのためのコントローラー名に使います。
* ``action`` ルートのためのコントローラーアクション名に使います。
* ``plugin`` コントローラーが配置されているプラグイン名に使います。
* ``prefix`` :ref:`prefix-routing` のために使います。
* ``_ext`` :ref:`ファイル拡張子ルーティング <file-extensions>` のために使います。
* ``_base`` 生成された URL からベースパスを削除するには ``false`` をセットしてください。
  アプリケーションがルートディレクトリーにない場合、 'cake relative' な URL の生成に使えます。
* ``_scheme`` `webcal` や `ftp` のように異なるスキーマのリンクを作成するために設定します。
  現在のスキーマがデフォルトに設定されています。
* ``_host`` リンクで使用するホストを設定します。デフォルトは、現在のホストです。
* ``_port`` 非標準のポートにリンクを作成するときにポートを設定します。
* ``_full`` ``true`` にすると `FULL_BASE_URL` 定数が
  生成された URL の前に加えられます。
* ``#`` URL のハッシュフラグメントを設定できます。
* ``_ssl`` ``true`` にすると生成された URL を https に変換します。
  ``false`` にすると、強制的に http になります。
* ``_method`` HTTP 動詞/メソッドを使うために定義します。
  :ref:`resource-routes` と一緒に使うときに役に立ちます。.
* ``_name`` ルートの名前。名前付きルートをセットアップするときに、
  それを指定するためのキーとして使えます。

.. _route-fluent-methods:

ルートオプションの設定
----------------------

各ルートに設定できる多くのルートオプションがあります。ルートを接続したら、
その流れるようなビルダーメソッドを使用してルートをさらに設定できます。
これらのメソッドは、 ``connect()`` の ``$options`` パラメータの多くのキーを置き換えます。 ::

    $routes->connect(
        '/:lang/articles/:slug',
        ['controller' => 'Articles', 'action' => 'view'],
    )
    // GET と POST リクエストを許可
    ->setMethods(['GET', 'POST'])

    // blog サブドメインにのみ一致
    ->setHost('blog.example.com')

    // 渡された引数に変換されるルート要素を設定
    ->setPass(['slug'])

    // ルート要素の一致するパターンを設定
    ->setPatterns([
        'slug' => '[a-z0-9-_]+',
        'lang' => 'en|fr|es',
    ])

    // JSON ファイル拡張子も許可
    ->setExtensions(['json'])

    // lang を永続的なパラメータに設定
    ->setPersist(['lang']);

.. versionadded:: 3.5.0
    流れるようなビルダーメソッドは 3.5.0 で追加されました。

アクションへのパラメーター渡し
------------------------------

:ref:`route-elements` を使ってルートを接続している時に、ルート要素で
引数を渡したい時があると思います。 ``pass`` オプションはルート要素が
コントローラーの関数に引数を渡せるようにするためのホワイトリストです。 ::

    // src/Controller/BlogsController.php
    public function view($articleId = null, $slug = null)
    {
        // いくつかのコードがここに...
    }

    // routes.php
    Router::scope('/', function ($routes) {
        $routes->connect(
            '/blog/:id-:slug', // 例えば /blog/3-CakePHP_Rocks
            ['controller' => 'Blogs', 'action' => 'view'],
        )
        // 関数に引数を渡すためのルーティングテンプレートの中で、ルート要素を定義します。
        // テンプレートの中で、ルート要素を定義します。
        // ":id" をアクション内の $articleId にマップします。
        ->setPass(['id', 'slug'])
        // `id` が一致するパターンを定義します。
        ->setPatterns([
            'id' => '[0-9]+',
        ]);
    });

今、リバースルーティング機能のおかげで、下記のように URL 配列を渡し、
CakePHP はルートに定義された URL をどのように整えるのかを知ることができます。 ::

    // view.ctp
    // これは /blog/3-CakePHP_Rocks　へのリンクを返します
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        'id' => 3,
        'slug' => 'CakePHP_Rocks'
    ]);

    // 数字のインデックスを持つパラメーターを使えます。
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        3,
        'CakePHP_Rocks'
    ]);

.. _named-routes:

名前付きルートの使用
--------------------

時々、ルートのためにすべての URL パラメーターを記述することがとても煩雑で、
名前付きルートでパフォーマンスを上げたいと思うようになるでしょう。
ルートを接続するときに、 ``_name`` オプションを指定できます。このプションは、
あなたが使いたいルートを識別するために、リバースルーティングで使われます。 ::

    // 名前付きでルートを接続
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // HTTP メソッド指定でルートを命名 (3.5.0 以降)
    $routes->post(
        '/logout',
        ['controller' => 'Users', 'action' => 'logout'],
        'logout'
    );

    // 名前付きルートで URL の生成
    $url = Router::url(['_name' => 'logout']);

    // クエリー文字列引数付きの
    // 名前付きルートで URL の生成
    $url = Router::url(['_name' => 'login', 'username' => 'jimmy']);

あなたのルートテンプレートに ``:controller`` のようなルート要素が含まれている場合、
``Router::url()`` にオプションの一部としてそれらを提供したい場合があると思います。

.. note::

    ルート名はアプリケーション全体で一意でなければなりません。
    違うルーティングスコープであっても、同じ ``_name`` を二度使えません。

名前付きルートを構築する時、ルート名にいくつかの命名規則を適用したいでしょう。
CakePHP は、各スコープで名前のプレフィックスを定義することで、
より簡単にルート名を構築できます。 ::

    Router::scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
        // このルートの名前は `api:ping` になります。
        $routes->get('/ping', ['controller' => 'Pings'], 'ping');
    });
    // ping ルートのための URL を生成
    Router::url(['_name' => 'api:ping']);

    // plugin() で namePrefix を使用
    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        // ルートを接続。
    });

    // または、 prefix() で
    Router::prefix('Admin', ['_namePrefix' => 'admin:'], function ($routes) {
        // ルートを接続。
    });

``_namePrefix`` オプションはネストしたスコープの中でも使えます。
それは、あなたの期待通りに動きます。 ::

    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
            // このルートの名前は `contacts:api:ping` になります。
            $routes->get('/ping', ['controller' => 'Pings'], 'ping');
        });
    });

    // ping ルートのための URL を生成
    Router::url(['_name' => 'contacts:api:ping']);

名前付きスコープに接続されているルートは命名されていているルートのみ追加されます。
名前なしルートはそれらに適用される ``_namePrefix`` がありません。

.. versionadded:: 3.1
     ``_namePrefix`` オプションは 3.1 で追加されました。

.. index:: admin routing, prefix routing
.. _prefix-routing:

プレフィックスルーティング
--------------------------

.. php:staticmethod:: prefix($name, $callback)

多くのアプリケーションは特権を持ったユーザーが変更を加えるための管理者領域が必要です。
これはしばしば、特別な ``/admin/users/edit/5`` のような URL を通してなされます。
CakePHP では、プレフィックスルーティングは,  ``prefix`` スコープメソッドによって
有効化されます。 ::

    use Cake\Routing\Route\DashedRoute;

    Router::prefix('admin', function ($routes) {
        // この全てのルートは `/admin` によってプレフィックスされます。
        // そのために、 prefix => admin をルート要素として追加します。
        $routes->fallbacks(DashedRoute::class);
    });

プレフィックスは ``Controller`` 名前空間に属するようにマップされます。コントローラーと
分離してプレフィックスすることによって、小さくて単純なコントローラーをもつことができます。
プレフィックス付き及び付かないコントローラーに共通の動作は、継承や
:doc:`/controllers/components` やトレイトを使用してカプセル化できます。
このユーザーの例を使うと、 ``/admin/users/edit/5`` にアクセスしたとき、
**src/Controller/Admin/UsersController.php** の ``edit()`` メソッドを
5 を１番目のパラメーターとして渡しながら呼びます。
ビューファイルは、 **src/Template/Admin/Users/edit.ctp** が使われます。

/admin へのアクセスを pages コントローラーの ``index()`` アクションに
以下のルートを使ってマップします。 ::

    Router::prefix('admin', function ($routes) {
        // admin スコープの中なので、/admin プレフィックスや、
        // admin ルート要素を含める必要はありません。
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

プレフィックスルートを作成するときに、 ``$options`` 引数で、追加のルートのパラメーターを
設定できます。 ::

    Router::prefix('admin', ['param' => 'value'], function ($routes) {
        // ここで接続されているルートは '/admin' でプレフィックスされており、
        // 'param' ルーティングキーを持っています。
        $routes->connect('/:controller');
    });

このようにプラグインスコープの中で、プレフィックスを定義できます。 ::

    Router::plugin('DebugKit', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

上記は ``/debug_kit/admin/:controller`` のようなルートテンプレートを作ります。
接続されたルートは、 ``plugin`` と ``prefix`` というルート要素を持ちます。

プレフィックスを定義したときに、必要ならば複数のプレフィックスをネストできます。 ::

    Router::prefix('manager', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

上記のコードは、 ``/manager/admin/:controller`` のようなルートテンプレートを生成します。
接続されたルートは ``prefix`` というルート要素を ``manager/admin`` に設定します。

現在のプレフィックスはコントローラーのメソッドから ``$this->request->getParam('prefix')``
を通して利用可能です。

プレフィックスルーティングを使っているときは、prefix オプションを設定することが重要です。
以下は、リンクを HTML ヘルパーで作る方法です。 ::

    // プレフィックスルーティングする
    echo $this->Html->link(
        'Manage articles',
        ['prefix' => 'manager', 'controller' => 'Articles', 'action' => 'add']
    );

    // プレフィックスルーティングをやめる
    echo $this->Html->link(
        'View Post',
        ['prefix' => false, 'controller' => 'Articles', 'action' => 'view', 5]
    );

.. note::

    フォールバックルートを接続する *前* にプレフィックスルートを接続してください。

.. index:: plugin routing

プラグインのルーティング
------------------------

.. php:staticmethod:: plugin($name, $options = [], $callback)

:doc:`/plugins` のためのルートは ``plugin()`` メソッドを使って作成してください。
このメソッドは、プラグインのルートのための新しいルーティングスコープを作成します。 ::

    Router::plugin('DebugKit', function ($routes) {
        // ここに接続されるルートは '/debug_kit' というプレフィックスが付き、
        // このプラグインのルート要素には 'DebugKit' がセットされています。
        $routes->connect('/:controller');
    });

プラグインスコープを作るときに、 ``path`` オプションでパス要素をカスタマイズできます。 ::

    Router::plugin('DebugKit', ['path' => '/debugger'], function ($routes) {
        // ここに接続されるルートは '/debugger' というプレフィックスが付き、
        // このプラグインのルート要素には 'DebugKit' がセットされています。
        $routes->connect('/:controller');
    });

スコープを使うときに、プレフィックススコープ内でプラグインスコープをネストできます。 ::

    Router::prefix('admin', function ($routes) {
        $routes->plugin('DebugKit', function ($routes) {
            $routes->connect('/:controller');
        });
    });

上記は、 ``/admin/debug_kit/:controller`` のようなルーティングを作ります。
これは、 ``prefix`` と ``plugin`` をルート要素として持ちます。

URL 配列に plugin キーを追加することによって、プラグインを指すリンクを作成できます。 ::

    echo $this->Html->link(
        'New todo',
        ['plugin' => 'Todo', 'controller' => 'TodoItems', 'action' => 'create']
    );

逆に、現在のリクエストがプラグインに対してのリクエストであり、
プラグインではないリンクを作成する場合、次のようにできます。 ::

    echo $this->Html->link(
        'New todo',
        ['plugin' => null, 'controller' => 'Users', 'action' => 'profile']
    );

``plugin => null`` を設定することで、プラグインの一部ではないリンクを作成したいことを
Router に伝えられます。

SEO に親和性があるルーティング
------------------------------

良い検索エンジンのランキングを得るために、URL の中でダッシュを使うのを好む開発者もいるでしょう。
``DashedRoute`` クラスは、アプリケーションの中で、プラグイン、コントローラー、および
キャメルケースで書かれたアクション名をダッシュ記法の URL にルーティングすることができます。

例えば、 ``TodoItems`` コントローラーの ``showItems()`` アクションを持つ
``ToDo`` プラグインを使っていたとして、 ``/to-do/todo-items/show-items``
でアクセスできるように、以下のルーター接続で可能になります。 ::

    Router::plugin('ToDo', ['path' => 'to-do'], function ($routes) {
        $routes->fallbacks('DashedRoute');
    });

指定した HTTP メソッドとの照合
------------------------------

ルートは、HTTP 動詞へルパーを使用して指定した HTTP メソッドとマッチできます。 ::

    Router::scope('/', function($routes) {
        // このルートは POST リクエスト上でのみマッチします。
        $routes->post(
            '/reviews/start',
            ['controller' => 'Reviews', 'action' => 'start']
        );

        // 複数 HTTP メソッドとマッチします
        // 3.5 より前は $options['_method'] をメソッドにセットして使用
        $routes->connect(
            '/reviews/start',
            [
                'controller' => 'Reviews',
                'action' => 'start',
            ]
        )->setMethods(['POST', 'PUT']);
    });

配列を使うことで複数の HTTP メソッドとマッチできます。 ``_method`` パラメーターは
ルーティングキーなので、 URL の解析と URL の生成の両方に使われます。
メソッド固有のルートの URL を生成するには、URL を生成する際に
``_method`` キーを含める必要があります。 ::

    $url = Router::url([
        'controller' => 'Reviews',
        'action' => 'start',
        '_method' => 'POST',
    ]);

指定したホスト名との照合
------------------------

ルートは、指定のホストのみとマッチするように ``_host`` オプションを使用できます。
任意のサブドメインとマッチするために ``*.`` ワイルドカードを使用できます。 ::

    Router::scope('/', function($routes) {
        // このルートは http://images.example.com のみマッチします。
        // 3.5 より前は _host オプションを使用
        $routes->connect(
            '/images/default-logo.png',
            ['controller' => 'Images', 'action' => 'default']
        )->setHost('images.example.com');

        // このルートは http://*.example.com のみマッチします。
        $routes->connect(
            '/images/old-log.png',
            ['controller' => 'Images', 'action' => 'oldLogo']
        )->setHost('images.example.com');
    });

``_host`` オプションは URL 生成でも使用されます。 ``_host`` オプションで正確なドメインを
指定する場合、そのドメインは生成された URL に含まれます。しかし、もしワイルドカードを
使用する場合、URL の生成時に ``_host`` パラメーターを指定する必要があります。 ::

    // このルートを持つ場合、
    $routes->connect(
        '/images/old-log.png',
        ['controller' => 'Images', 'action' => 'oldLogo']
    )->setHost('images.example.com');

    // url を生成するために指定が必要です。
    echo Router::url([
        'controller' => 'Images',
        'action' => 'oldLogo',
        '_host' => 'images.example.com',
    ]);

.. versionadded:: 3.4.0
    ``_host`` オプションは 3.4.0 で追加されました。

.. index:: file extensions
.. _file-extensions:

ファイル拡張子のルーティング
----------------------------

.. php:staticmethod:: extensions(string|array|null $extensions, $merge = true)

異なるファイルの拡張子をルートで処理するために、スコープレベルだけでなくグローバルでも
拡張子を定義できます。グローバルな拡張子を定義するには、スタティックな
:php:meth:`Router::extensions()` メソッドを介して保存できます。 ::

    Router::extensions(['json', 'xml']);
    // ...

これは、スコープに関係なく、 **以後に** 接続された **全て** のルートに影響します。

拡張子を特定のスコープに制限するために、 :php:meth:`Cake\\Routing\\RouteBuilder::setExtensions()`
メソッドを使用して定義することができます。 ::

    Router::scope('/', function ($routes) {
        // 3.5.0 より前は `extensions()` を使用
        $routes->setExtensions(['json', 'xml']);
    });

これは、 ``setExtensions()`` が呼ばれた **後の** スコープの中で接続されている
全てのルートのために名前付き拡張子を有効にします。それは、ネストされたスコープの中で
接続されているルートも含まれます。グローバルの :php:meth:`Router::extensions()` メソッドと
同様に、呼び出し前に接続されたルートは、拡張子を継承しません。

.. note::

    拡張子がセットされた **後** でのみ拡張子がルーティングに適用されるので、
    拡張子を設定することはスコープの中で一番最初にやるべきことです。

    また、再度開かれたスコープは、前回開いたスコープで定義した拡張子を **継承しない** ことにも
    注意してください。

拡張子を使うことで、一致したファイルの拡張子を除去し、残りをパースするように
伝えられます。もし /page/title-of-page.html のような URL を生成したいなら、
以下を使ってルートを設定します。 ::

    Router::scope('/page', function ($routes) {
        // 3.5.0 より前は `extensions()` を使用
        $routes->setExtensions(['json', 'xml', 'html']);
        $routes->connect(
            '/:title',
            ['controller' => 'Pages', 'action' => 'view']
        )->setPass(['title']);
    });

そして、ルートに対応するリンクを作成するために、次のようにします。 ::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

拡張子が :doc:`/controllers/components/request-handling` で使われ、それによって
コンテンツタイプに合わせた自動的なビューの切り替えを行います。

.. _connecting-scoped-middleware:

スコープ付きミドルウェアの接続
------------------------------

ミドルウェアをアプリケーション全体に適用することができますが、特定のルーティングスコープに
ミドルウェアを適用すると、ミドルウェアが必要な場所にのみ適用できるため、適用の方法や範囲の
配慮がいらないミドルウェアにすることができます。

ミドルウェアをスコープに適用する前に、ルートコレクションに登録する必要があります。 ::

    // config/routes.php の中で
    use Cake\Http\Middleware\CsrfProtectionMiddleware;
    use Cake\Http\Middleware\EncryptedCookieMiddleware;

    Router::scope('/', function ($routes) {
        $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
        $routes->registerMiddleware('cookies', new EncryptedCookiesMiddleware());
    });

一度登録されると、スコープ付きミドルウェアは特定のスコープに適用されます。 ::

    $routes->scope('/cms', function ($routes) {
        // CSRF & cookies ミドルウェアを有効化
        $routes->applyMiddleware('csrf', 'cookies');
        $routes->get('/articles/:action/*', ['controller' => 'Articles'])
    });

ネストされたスコープがある状況では、内部スコープは、
スコープ内に適用されたミドルウェアを継承します。 ::

    $routes->scope('/api', function ($routes) {
        $routes->applyMiddleware('ratelimit', 'auth.api');
        $routes->scope('/v1', function ($routes) {
            $routes->applyMiddleware('v1compat');
            // ここにルートを定義。
        });
    });

上記の例では、 ``/v1`` で定義されたルートは 'ratelimit'、 'auth.api'、および 'v1compat'
ミドルウェアが適用されます。スコープを再度開くと、各スコープ内のルートに適用されたミドルウェアが
分離されます。 ::

    $routes->scope('/blog', function ($routes) {
        $routes->applyMiddleware('auth');
        // ここに blog の認証が必要なアクションを接続
    });
    $routes->scope('/blog', function ($routes) {
        // ここに blog の公開アクションを接続
    });

上記の例では、 ``/blog`` スコープの2つの用途はミドルウェアを共有しません。
ただし、これらのスコープは両方とも、そのスコープ内で定義されたミドルウェアを継承します。

ミドルウェアのグループ化
------------------------

ルートコードを :abbr:`DRY (Do not Repeat Yourself)` に保つ助けになるよう、
ミドルウェアをグループにまとめることができます。一度まとめられたグループは、
ミドルウェアのように適用することができます。 ::

    $routes->registerMiddleware('cookie', new EncryptedCookieMiddleware());
    $routes->registerMiddleware('auth', new AuthenticationMiddleware());
    $routes->registerMiddleware('csrf', new CsrfProtectionMiddleware());
    $routes->middlewareGroup('web', ['cookie', 'auth', 'csrf']);

    // グループの適用
    $routes->applyMiddleware('web');

.. versionadded:: 3.5.0
    スコープ付きミドルウェアとミドルウェアグループは 3.5.0 で追加されました。

.. _resource-routes:

RESTful なルートの作成
======================

Router はコントローラーへの RESTful なルートを簡単に生成します。
RESTful なルートはアプリケーションの API エンドポイントを作るときに有効です。
recipe コントローラーに REST アクセスできるようにしたい場合、このようにします。 ::

    // config/routes.php 内で...

    Router::scope('/', function ($routes) {
        // 3.5.0 より前は `extensions()` を使用
        $routes->setExtensions(['json']);
        $routes->resources('Recipes');
    });

最初の行は、簡単に REST アクセス可能にするために、いくつかのデフォルトルートをセットしています。
アクセス対象のメソッドには、最終的に受け取りたいフォーマット (例えば xml, json, rss) の指定が
必要です。これらのルートは、HTTP リクエストメソッドに対応しています。

=========== ===================== ==============================
HTTP format URL.format            対応するコントローラーアクション
=========== ===================== ==============================
GET         /recipes.format       RecipesController::index()
----------- --------------------- ------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- ------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- ------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
PATCH       /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
=========== ===================== ==============================

CakePHP の Router クラスは、いくつかの異なる方法で HTTP リクエストメソッドを判定します。
下記がその判定順序です。

#. POST リクエストの中の \_method 変数
#. X\_HTTP\_METHOD\_OVERRIDE
#. REQUEST\_METHOD ヘッダ

POST リクエストの中の、 \_method の値を使う方法は、ブラウザーを使った REST クライアントの場合に
便利です。単純に POST メソッドの中で、\_method キーの値に HTTP メソッド名を入れるだけです。

ネストされたリソースのルートを作成
----------------------------------

スコープの中で一度リソースに接続すると、サブリソース (リソースの下層) にもルートを接続できます。
サブリソースのルートは、オリジナルのリソース名と id パラメーターの後に追加されます。例えば::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments');
        });
    });

これで ``articles`` と ``comments`` 両方のリソースルートを生成します。
この comments のルートは次のようになります。 ::

    /api/articles/:article_id/comments
    /api/articles/:article_id/comments/:id

``CommentsController`` の ``article_id`` を次のように取得できます。 ::

    $this->request->getParam('article_id');

デフォルトでは、リソースルートは、スコープに含まれる同じプレフィックスにマップします。
もし、ネストしたリソースのコントローラーとそうでないリソースのコントローラー両方を持つ場合、
プレフィックスを利用して各コンテキスト内で異なるコントローラーを使用できます。 ::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments', ['prefix' => 'articles']);
        });
    });

上記は、「Comments」リソースを ``App\Controller\Articles\CommentsController`` に
マップします。コントローラーを分けることで、あなたのコントローラーのロジックをシンプルに保つことが
できます。このやり方で作成されたプレフィックスは、 :ref:`prefix-routing` と互換性があります。

.. note::

    あなたが望む深さまでリソースをネストできますが、
    ２段階以上の深さにネストさせることはお勧めしません。

.. versionadded:: 3.3
    3.3 で ``resources()`` に ``prefix`` オプションが追加されました。

ルートの作成を制限
------------------

デフォルトでは CakePHP は、各リソースに対して６つのルートを接続します。
特定のリソースに対して、特定のルートのみを接続させたい場合、 ``only``
オプションを使います。 ::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

これで読み込み専用のリソースルートが作られます。このルート名は ``create``,
``update``, ``view``, ``index``, と ``delete`` です。

使用するコントローラーアクションの変更
--------------------------------------

ルートを接続するときに使われるコントローラーのアクション名を変更したい場合があるでしょう。
例えば、 ``edit()`` アクションを ``put()`` で呼びたいときに、
``actions`` キーをアクション名のリネームに使います。 ::

    $routes->resources('Articles', [
        'actions' => ['update' => 'put', 'create' => 'add']
    ]);

上記は ``put()`` を ``edit()`` アクションの代わりに使い、 ``add()``
を ``create()`` の代わりに使います。

追加のリソースへのルートをマップする
------------------------------------

``map`` オプションを使用して、追加のリソースメソッドをマップできます。 ::

     $routes->resources('Articles', [
        'map' => [
            'deleteAll' => [
                'action' => 'deleteAll',
                'method' => 'DELETE'
            ]
        ]
     ]);
     // これは /articles/deleteAll へ接続します。

デフォルトルートに加えて、これは `/articles/delete_all` へのルートに接続します。
デフォルトでは、パスセグメントはキー名に一致します。'path' キーを、パスをカスタマイズするための
リソースの定義の中で使えます。 ::

    $routes->resources('Articles', [
        'map' => [
            'updateAll' => [
                'action' => 'updateAll',
                'method' => 'DELETE',
                'path' => '/update_many'
            ],
        ]
    ]);
    // これは /articles/update_many に接続します。

'only' と 'map' を定義した場合、マップされたメソッドが 'only' リストにもあるか確かめましょう。.

.. _custom-rest-routing:

リソースルートのためのカスタムルートクラス
------------------------------------------

``resources()`` の ``$options`` 配列の ``connectOptions`` キーで ``connect()``
を使った設定ができます。  ::

    Router::scope('/', function ($routes) {
        $routes->resources('Books', [
            'connectOptions' => [
                'routeClass' => 'ApiRoute',
            ]
        ];
    });

リソースルートのための URL 語形変化
-----------------------------------

デフォルトで、複数語のコントローラーの URL フラグメントは、コントローラー名のアンダースコアー形式です。
例えば、 ``BlogPosts`` の URL フラグメントは、 **/blog_posts** になります。

``inflect`` オプションを使って別の変化形を指定できます。 ::

    Router::scope('/', function ($routes) {
        $routes->resources('BlogPosts', [
            'inflect' => 'dasherize' // ``Inflector::dasherize()`` を使用
        ]);
    });

上記は、 **/blog-posts/\*** スタイルの URL を生成します。

.. note::

    CakePHP 3.1 から、公式の app スケルトンは、 ``DashedRoute`` をデフォルトルートクラス
    として使用します。 URL の一貫性を保つために、リソースルートを接続する際に
    ``'inflect' => 'dasherize'`` オプションを使用することを推奨します。

パス要素の変更
--------------

デフォルトでは、リソースルートは、URL セグメントのリソース名の語形変化された形式を使用します。
``path`` オプションでカスタム URL セグメントを設定することができます。 ::

    Router::scope('/', function ($routes) {
        $routes->resources('BlogPosts', ['path' => 'posts']);
    });

.. versionadded:: 3.5.0
    ``path`` オプションは 3.5.0 で追加されました。

.. index:: passed arguments
.. _passed-arguments:

渡された引数
============

渡された引数は、リクエストされた際に使用される追加の引数、もしくはパスセグメントです。
これらはしばしば、コントローラーメソッドにパラメーターを渡すために使われます。 ::

    http://localhost/calendars/view/recent/mark

上記の例では、 ``recent`` と ``mark`` の両方が ``CalendarsController::view()``
に引数として渡されます。渡された引数は３つの方法でコントローラーに渡されます。
１番目は、引数としてアクションを呼ばれたときに渡し、２番目は、
``$this->request->getParam('pass')`` で数字をインデックスとする配列で呼べるようになります。
カスタムルートを使用するときに、渡された引数を呼ぶために特定のパラメーターを強制することができます。

前述の URL にアクセスして、次のようなコントローラーアクションがあるとすると、 ::

    class CalendarsController extends AppController
    {
        public function view($arg1, $arg2)
        {
            debug(func_get_args());
        }
    }

次の出力を得ます。 ::

    Array
    (
        [0] => recent
        [1] => mark
    )

コントローラーとビューとヘルパーの ``$this->request->getParam('pass')`` でも、
これと同じデータが利用可能です。pass 配列中の値は、
呼ばれた URL に現れる順番をもとにした数字のインデックスになります。 ::

    debug($this->request->getParam('pass'));

上記の出力は以下になります。 ::

    Array
    (
        [0] => recent
        [1] => mark
    )

:term:`ルーティング配列` を使って URL を生成するとき、配列に文字列キーなしの値として
引数を加えます。 ::

    ['controller' => 'Articles', 'action' => 'view', 5]

``5`` は引数として渡されるときには数字キーを持ちます。

URL の生成
==========

.. php:staticmethod:: url($url = null, $full = false)

URL の生成やリバースルーティングは、すべてのコードの変更なしに URL の構造を簡単に変更する
CakePHP の機能です。URL を定義するために :term:`ルーティング配列` を使用することで、
あとで変更を加えても、生成された URL は自動的に更新されます。

次のように URL を文字列で作成し、 ::

    $this->Html->link('View', '/articles/view/' . $id);

そして、あとで ``/articles`` は本当は 'posts' と呼ぶべきであると判断した場合、
アプリケーション全体で URL を変更する必要があります。一方、次のように link を定義し、 ::

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

そして、URL を変更すると判断した場合、ルートを定義することで変更できます。
これは、受け取る URL のマッピングと生成される URL の両方を変更します。

URL 配列を使うとき、特別なキーを使用して、文字列パラメーターによるクエリーと
ドキュメントフラグメントを定義できます。 ::

    Router::url([
        'controller' => 'Articles',
        'action' => 'index',
        '?' => ['page' => 1],
        '#' => 'top'
    ]);

    // このような URL が生成されます
    /articles/index?page=1#top

Router はルーティング配列の中の未知のパラメーターをクエリー文字列パラメーターに変換します。
``?`` は CakePHP の古いバージョンとの後方互換性のために提供します。

URL を生成するときに、特別なルート要素が使用できます。

* ``_ext``  :ref:`file-extensions` （拡張子）ルーティングに使います。
* ``_base`` 生成された URL からベースパスを削除するには ``false`` をセットしてください。
  アプリケーションがルートディレクトリーにない場合、 'cake relative' な URL の生成に使います。
* ``_scheme`` ``webcal`` や ``ftp`` のように異なるスキーマのリンクを作成するために設定します。
  現在のスキーマにデフォルト設定されています。
* ``_host`` リンクのためのホストを設定します。デフォルトは、現在のホストです。
* ``_port`` 非標準なポートのリンクを作成するときにポートを設定します。
* ``_method``  URL が存在する HTTP メソッドを定義します。
* ``_full``  ``true`` にすると、 ``FULL_BASE_URL`` 定数 が
  生成された URL の前に加えられます。
* ``_ssl`` ``true`` にすると普通の URL から https に変換します。
  ``false`` にすると、強制的に http になります。
* ``_name`` ルートの名前。名前付きルートをセットアップするとき、それを指定するためのキーとして使います。

.. _redirect-routing:

リダイレクトルーティング
========================

リダイレクトルーティングは受け取るルートに対して HTTP ステータスの 30x リダイレクトを発行し、
異なる URL に転送することができます。これは、リソースが移動し、同じ内容の 2 つの URL を
公開したくないことをクライアントアプリケーションに通知する場合に便利です。

リダイレクトルートは通常のルートとは異なり、条件に一致した場合、
実際にヘッダーリダイレクトを実行します。
リダイレクトは、アプリケーション内部や外部へ遷移します。 ::

    Router::scope('/', function ($routes) {
        $routes->redirect(
            '/home/*',
            ['controller' => 'Articles', 'action' => 'view'],
            ['persist' => true]
            // もしくは $id を引数として受け取る view アクションの
            // デフォルトルーティングは ['persist'=>['id']] のようにする
        );
    });

``/home/*`` から ``/articles/view`` へのリダイレクトし ``/articles/view`` にパラメーターを渡します。
リダイレクト先として配列を使うことで、URL 文字列を定義するために、他のルートを使用できます。
文字列 URL を遷移先として使用することで外部にリダイレクトできます。 ::

    Router::scope('/', function ($routes) {
        $routes->redirect('/articles/*', 'http://google.com', ['status' => 302]);
    });

これは、 ``/articles/*`` から ``http://google.com`` へ HTTP 302 ステータスのリダイレクトをします。

.. _custom-route-classes:

カスタムルートクラス
====================

カスタムルートクラスは、個々のルートがリクエストをパースし、リバースルーティングを扱えるようにします。
Route クラスには、いくつかの規約があります。

* ルートクラスは、アプリケーションやプラグイン内にある ``Routing\\Route`` 名前空間で
  見つけられるはずです。
* ルートクラス  :php:class:`Cake\\Routing\\Route` を拡張します。
* ルートクラスは  ``match()`` と ``parse()`` の一方もしくは両方を使います。

``parse()`` メソッドは、受け取った URL をパースするために使用されます。
これは、コントローラーとアクションに分解されるリクエストパラメーターの配列を生成する必要があります。
このメソッドは、一致しなかった時に ``false`` を返します。

``match()`` メソッドは URL パラメーターの配列に一致するか確かめるために使い、
URL を文字列で生成します。URL パラメーターがルートに一致しない時は、 ``false`` を返します。

カスタムルートクラスを ``routeClass`` オプションを使って設定することができます。 ::

    $routes->connect(
         '/:slug',
         ['controller' => 'Articles', 'action' => 'view'],
         ['routeClass' => 'SlugRoute']
    );

    // また、スコープの中で routeClass を設定することもできます。
    $routes->scope('/', function ($routes) {
        // 3.5.0 以前では `routeClass()` を使用
        $routes->setRouteClass('SlugRoute');
        $routes->connect(
             '/:slug',
             ['controller' => 'Articles', 'action' => 'view']
        );
    });

このルートは ``SlugRoute`` のインスタンスを生成し、カスタムパラメーター処理を実装することができます。
標準的な :term:`プラグイン記法` を使ってプラグインルートクラスを使用できます。

デフォルトルートクラス
----------------------

.. php:staticmethod:: defaultRouteClass($routeClass = null)

デフォルト ``Route`` 以外のすべての他のルートクラスをデフォルトの基づくルートに
使いたいときには、 ``Router::defaultRouteClass()`` を呼ぶことによって すべてのルートを
セットアップする前に、それぞれのルートのための特定の ``routeClass`` オプションを持つことを
避けます。例えば、下記を使います。 ::

    use Cake\Routing\Route\InflectedRoute;

    Router::defaultRouteClass(InflectedRoute::class);

この後に接続されたすべてのルートに ``InflectedRoute`` ルートクラスが使用されます。
引数なしにこのメソッドを呼ぶと、現在のデフォルトルートクラスを返します。

フォールバックメソッド
----------------------

.. php:method:: fallbacks($routeClass = null)

fallbacks メソッドはデフォルトルートをショートカットする簡単な方法です。
このメソッドは、渡されたルーティングクラスによって定義されたルールを使用します。もし、
クラスが定義されていない場合、 ``Router::defaultRouteClass()`` で返されたクラスが使用されます。

フォールバックを次のように呼びます。 ::

    use Cake\Routing\Route\DashedRoute;

    $routes->fallbacks(DashedRoute::class);

次の明示的な呼び出しと同等です。 ::

    use Cake\Routing\Route\DashedRoute;

    $routes->connect('/:controller', ['action' => 'index'], ['routeClass' => DashedRoute::class]);
    $routes->connect('/:controller/:action/*', [], ['routeClass' => DashedRoute::class]);

.. note::

     フォールバックを使ったデフォルトルートクラス (``Route``) もしくは、
     ``:plugin`` や ``:controller`` ルート要素をもつ任意のルートを使用すると
     URL の大文字小文字の区別がなくなります。

永続的な URL パラメーターの生成
===============================

URL フィルター関数で URL の生成プロセスをホックできます。
フィルター関数は、 ルーティングに一致する *前* に呼ばれます。
これは、ルーティングする前に URL を用意します。

コールバックフィルター関数は以下のパラメーターを持ちます。

- ``$params`` 生成されている URL パラメーター。
- ``$request`` 現在のリクエスト

URL フィルター関数は *常に* フィルターされていなくても、パラメーターを返します。

URL フィルターは永続的なパラメーターなどを簡単に扱う機能を提供します。 ::

    Router::addUrlFilter(function ($params, $request) {
        if ($request->getParam('lang') && !isset($params['lang'])) {
            $params['lang'] = $request->getParam('lang');
        }
        return $params;
    });

フィルター関数は、それらが接続されている順番に適用されます。

別のユースケースでは、実行時に特定のルートを変更しています。 (プラグインルートの例) ::

    Router::addUrlFilter(function ($params, $request) {
        if (empty($params['plugin']) || $params['plugin'] !== 'MyPlugin' || empty($params['controller'])) {
            return $params;
        }
        if ($params['controller'] === 'Languages' && $params['action'] === 'view') {
            $params['controller'] = 'Locations';
            $params['action'] = 'index';
            $params['language'] = $params[0];
            unset($params[0]);
        }
        return $params;
    });

これは以下のルートを ::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Languages', 'action' => 'view', 'es']);

このように置き換えます。 ::

    Router::url(['plugin' => 'MyPlugin', 'controller' => 'Locations', 'action' => 'index', 'language' => 'es']);

URL 内での名前付きパラメーターの扱い
====================================

CakePHP 3.0 から名前付きパラメーターが削除されたとしても、
アプリケーションは URL にそれを含んだ状態で公開されています。
名前付きパラメーターを含んだ URL の受け付けを継続できます。

コントローラーの ``beforeFilter()`` メソッドで、 ``parseNamedParams()``
呼ぶことで渡された引数のすべての名前付きパラメーターを展開できます。 ::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        Router::parseNamedParams($this->request);
    }

これは、 ``$this->request->getParam('named')`` にすべての渡された引数にある
名前付きパラメーターを移します。すべての名前付きパラメーターとして変換された引数は
渡された引数のリストから除去されます。

.. toctree::
    :glob:
    :maxdepth: 1

    /development/dispatch-filters

.. meta::
    :title lang=ja: ルーティング
    :keywords lang=ja: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
