ルーティング
##############

.. php:namespace:: Cake\Routing

.. php:class:: Router

ルーティングは URL をどコントローラーのアクションと関連付けてマッピングするか決める機能です。
ルーティングを設定することで、アプリケーションの動きと URL の構造を分離できます。

CakePHP でのルーティングはまた 配列による引数を文字列による URL に変換する
リバースルーティングも含みます。リバースルーティングによって、アプリケーションの
URL の構造を全部のコードの書き直しをせずにリファクタリングできます。

.. index:: routes.php

概要
=======

ここでは、 CakePHP の最も一般的なルーティングの方法について例を出して説明します。
ランディングページのように見せたい時がよくあるでしょう。そのときは、 **routes.php**
に以下を加えます。 ::

    use Cake\Routing\Router;

    // カッコで囲まれたルーティングビルダーを使います。
    Router::scope('/', function ($routes) {
        $routes->connect('/', ['controller' => 'Articles', 'action' => 'index']);
    });

    // 静的メソッドを使います。
    Router::connect('/', ['controller' => 'Articles', 'action' => 'index']);

``Router`` はルーティングするための2つのインターフェイスを提供します。
この静的メソッドはカッコ付きビルダーで複数のルーティングをするための
より短い表現方法をもつ後方互換性のあるより良い性能のインターフェイスです。

これはサイトのホームページにアクセスした時に ``ArticlesController`` の
index メソッドを実行します。時々、複数のパラメーターを受け取る動的ルーティングが
必要になると思います。それが必要になるケースは、例えば、表示している article (記事) の
コンテンツへのルーティングです。 ::

    Router::connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

上記のルーティングは、  ``/articles/15`` のような URL を全て受け入れ、 ``ArticlesController``
の ``view(15)`` メソッドを呼びます。しかし、これは ``/articles/foobar`` のような URL からの
アクセスを防ぐわけではありません。もし、あなたが望むなら、いくつかの正規表現を満たすパラメーターに
置き換えができます。 ::

    Router::connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    );

上の例はスターマッチャーを新たにプレースホルダ ``:id`` に変更しました。
プレースホルダを使うことで、URL 部分のバリデーションができます。
このケースでは ``\d+`` という正規表現を使いました。なので、数字のみが一致します。
最後に、 Router に ``id`` プレースホルダを ``view()`` 関数の引数として渡すように
``pass`` オプションで伝えます。このオプションの詳細は後で説明します。

CakePHP の Router はリバースルーティングできます。それは、URL 文字列を生成でき、
一致するか判定する条件を含む配列から成ることを意味します。 ::

    use Cake\Routing\Router;

    echo Router::url(['controller' => 'Articles', 'action' => 'view', 'id' => 15]);
    // 出力結果
    /articles/15

ルーティングは固有の名前を付けられます。これはルーティングを素早く参照し、
リンクを個別のルーティングパラメーターを特定する代わりに生成します。 ::

    use Cake\Routing\Router;

    Router::connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

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
``Blog\Controller\ArticlesController::index()`` に送ります。.

アプリケーションの雛形は、いくつかのルートをはじめから持った状態で作られます。
一度自分でルートを追加したら、デフォルトルートが必要ない場合は除去できます。

.. index:: :controller, :action, :plugin
.. index:: greedy star, trailing star
.. _connecting-routes:
.. _routes-configuration:

ルーティングによる接続
========================

.. php:staticmethod:: connect($route, $defaults = [], $options = [])

コードを :term:`DRY` に保つために 'ルーティングスコープ' を使いましょう。
ルーティングスコープはコードを DRY に保つためだけではなく、Router の操作を最適化します。
上記を参照すると、 ``Router::connect()`` をルートを接続するために使えることがわかります。
``/`` スコープにこのメソッドはデフォルトに設定されています。スコープを作成しいくつかのルートに
接続するために、 ``scope()`` メソッドを使います。 ::

    // config/routes.php 内で、
    Router::scope('/', function ($routes) {
        $routes->fallbacks('DashedRoute');
    });

``connect()`` メソッドは３つの引数を持ちます。あなたが一致させたい URL テンプレート、
ルート要素のためのデフォルト値、そしてルーティングオプションの３つです。
オプションはしばしば正規表現を他の URL 要素に一致するかどうか判断するために含みます。

ルートを定義するための基本のフォーマットは以下です。 ::

    $routes->connect(
        'URL テンプレート',
        ['default' => 'defaultValue'],
        ['option' => 'matchingRegex']
    );

１番目の引数は、Router にどの URL を制御しようとしているのか伝えます。この URL は
普通のスラッシュで区切られた文字列ですが、ワイルドカード (\*) や :ref:`route-elements`
を含むことができます。ワイルドカードは、すべての引数を受け付けることを意味します。
\* なしだと、文字列に完全一致するものだけに絞られます。

URL が特定されたら、一致したときにどのような動作をするかを CakePHP に伝えるために
``connect()`` の残り２つの引数を使います。２番目の引数は、連想配列です。この配列のキーは、
URL テンプレートが示すルート要素に因んで命名すべきです。配列の値はキーのためのデフォルトの
値になります。connect() の３番目の引数を使う前に基本的な例を見てみましょう。 ::

    $routes->connect(
        '/pages/*',
        ['controller' => 'Pages', 'action' => 'display']
    );

このルートは CakePHP によってあらかじめ用意されている routes.php ファイルにあります。
それは ``/pages/`` ではじまるすべての URL に一致し、 ``PagesController`` の
``display()`` アクションに渡します。 /pages/products へのリクエストは、
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

``connect()`` の第二引数は ルートの初期値から構成されているすべての引数を
生成するために使えます。 ::

    $routes->connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );

この例では、 ``connect()`` の第二引数をデフォルトの値を定義するために使う方法を
示しています。もし、いろいろなカテゴリの製品を顧客に対して提供するサイトを作るのであれば、
ルーティングすることを考えるべきです。この例では、 ``/pages/display/5`` にアクセスするために
``/government``  がURLとして使えます。

Router の別の一般的な使い方は、コントローラーの "エイリアス" (**ailias**) を定義することです。
``/users/some_action/5`` の代わりに、 ``/cooks/some_action/5`` で同じ場所に
アクセスしたい場合、以下のように簡単にできます。 ::

    $routes->connect(
        '/cooks/:action/*', ['controller' => 'Users']
    );

これは Router に ``/cooks/`` で始まるすべての URL は users コントローラに送るように
伝えています。 アクションは  ``:action`` の値によって呼ばれるかどうか決まります。
:ref:`route-elements` を使って、ユーザーの入力や変数を受け付けるいろいろなルーティングが
できます。上記のルーティングの方法は、貧欲なスター (greedy star） を使います。
貧欲なスターは  :php:class:`Router` がすべての位置指定引数を受け取ることを意味します。
それらの引数は :ref:`passed-arguments` 配列で有効化されます。

URL を生成するときにもルーティングは使われます。もし最初に一致するものがあった場合、
``array('controller' => 'users', 'action' => 'some_action', 5)`` を使って
``/cooks/some_action/5`` と出力します。

.. _route-elements:

ルート要素
-----------------------------------

あなたは独自のルート要素を特定し、コントローラのアクションのパラメータを
URL のどこに配置すべきなのかを定義することができます。リクエストされたとき、
これらのルート要素の値は、コントローラーの ``$this->request->params`` から取得できます。
カスタムルート要素を定義した場合、正規表現をオプションで指定できます。
これは CakePHP にどんな URL が正しいフォーマットなのかを伝えます。
正規表現を使用しなかった場合、 ``/`` 以外はすべて値の一部として扱われます。 ::

    $routes->connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

この単純な例は、どうやって素早く view アクションをすべてのコントローラから URL によって
``/controllername/:id`` のような形で呼べるようにするかを示しています。この URL は connect() で
``:controller`` と ``:id`` という２つのルート要素を指定するために使われます。
この ``:controller`` 要素は CakePHP のデフォルトルート要素で、URL が
どのコントローラを示しているのか識別できます。 ``:id`` 要素はカスタムルート要素で、
connect() の第三引数の中で正規表現でより明確にされなければなりません。

CakePHP は小文字とダッシュによって表された URL を ``:controller`` を使った時には出力しません。
これを出力したかったら、上の例を下のように書きなおしてください。 ::

    $routes->connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+', 'routeClass' => 'DashedRoute']
    );

``DashedRoute`` クラス ``:controller`` を確認し、
``:plugin`` パラメーターを正しく小文字とダッシュによって表します。

CakePHP 2.x アプリケーションからマイグレーションするときに、小文字と ``_`` による
URL が必要であったら、 ``InflectedRoute`` クラスを代わりに使用できます。

.. note::

    ルート要素で使用する正規表現パターンはキャプチャグループを含んではいけません。
    もし含んでいると、Router は正しく機能しません。

一度、ルートが定義されたら、 ``/apples/5`` を呼ぶと
ApplesController の view() メソッドを呼びます。  view() メソッドの中で、
``$this->request->params['id']`` で渡された ID にアクセスする必要がある。

アプリの中で一つのコントローラーだけがあるとき、URL にコントローラー名が含まれている必要がない。
そのときは、すべての URL がアクション名だけで一つのコントローラーに示すことができる。
たとえば、 ``home`` コントローラーにすべての URL でアクセスするように設定したとして、
``/home/demo`` の代わりに ``/demo``  という URL を使う場合以下の通りに設定します ::

    $routes->connect('/:action', ['controller' => 'Home']);

もし、大文字小文字を区別しないURLを提供したいと思ったら、正規表現の修飾子だけを使えます。 ::

    $routes->connect(
        '/:userShortcut',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
        ['userShortcut' => '(?i:principal)']
    );

もう一つ例を挙げます。これであなたはルーティングのプロです。 ::

    $routes->connect(
        '/:controller/:year/:month/:day',
        ['action' => 'index'],
        [
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        ]
    );

これは、もっとカスタマイズしています。でも、ルーティングがとても強力になったことを示しています。
この URL は４つの要素を操作しています。１番目は、なじみがあります。デフォルトのルート要素で
CakePHP にコントローラー名が必要なことを伝えています。

次に、デフォルト値を特定します。 コントローラーにかかわらず index() がをばれるようにしたい。

最後に、数字による"年月日"の表現と一致する正規表現を紹介します。この括り（グルーピング）は
正規表現ではサポートされていません。ほかにも特定可能ですが上記のように括弧でくくりません。

一回定義されたら、このル－ティングが ``/articles/2007/02/01`` , ``/articles/2004/11/16``
に一致したら、index() へのリクエストをそれが属するコントローラーに ``$this->request->params``
に *date* を格納して渡します。

いくつかの特別な意味を持つルーティング要素があります。
そして、特別な意味を持たせたくないなら、使ってはいけません。

* ``controller`` コントローラー名に使います。
* ``action`` アクション名に使います。
* ``plugin`` コントローラーにあるプラグイン名に使います。
* ``prefix`` :ref:`prefix-routing` のために使います。
* ``ext`` :ref:`file-extensions` ルーティングのために使います。
* ``_base`` false にセットすると、ベースURLを除去します。
  ルートディレクトリに作っているアプリがない場合、 'CakePHP relative' な URL の生成に使えます。
* ``_scheme``  リンクに `webcal` や `ftp` のように違うスキーマをセットする。
  現在のスキーマにデフォルト設定されています。
* ``_host`` リンクのためのホストを設定します。デフォルトは、現在のホストです。
* ``_port`` 非スタンダートなポートにリンクを生成するときにポートを設定します。
* ``_full`` ``true`` にすると `FULL_BASE_URL` 定数が
  生成された URL の前に加えられます。
* ``#`` URL のハッシュフラグメントをセットします。
* ``_ssl`` ``true`` にすると普通の URL から https に変換します。
  ``false`` にすると、強制的に http になります。
* ``_method`` HTTP 動詞/メソッドを使うために定義します。
  :ref:`resource-routes` と一緒に使うときに役に立ちます。.
* ``_name`` ルートの名前。名前付きルートをセットアップするときに、測定するためのキーとして使えます。

値をアクションに渡す
--------------------------------------

:ref:`route-elements` を使ってルーティングしている時に、ルート要素で
引数を渡したい時があると思います。 ``pass`` オプションはルート要素が
コントローラーの関数rに引数を渡せるようにするためのホワイトリスト ::

    // src/Controller/BlogsController.php
    public function view($articleId = null, $slug = null)
    {
        // Some code here...
    }

    // routes.php
    Router::scope('/', function ($routes) {
        $routes->connect(
            '/blog/:id-:slug', // E.g. /blog/3-CakePHP_Rocks
            ['controller' => 'Blogs', 'action' => 'view'],
            [
                // 関数に引数を渡すためのルーティングテンプレートの中で、ルート要素を定義します。
                // テンプレートの中で、ルート要素を定義します。
                //  ":id" をアクション内の $articleId にマップします。
                'pass' => ['id', 'slug'],
                // `id` が一致するパターンを定義します。
                'id' => '[0-9]+'
            ]
        );
    });

今、リバースルーティング機能のおかげで、下記のように URL 配列を渡し、
ルーティングで定義された URL をどのように整えるのか CakePHP は知ることができます。 ::

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
-----------------------------

時々、ルーティングのためにすべての URL パラメーターを記述することがとても煩雑で、
名前付きルートでパフォーマンスを上げたいと思うようになるでしょう。
ルートに接続するときに、 ``_name`` オプションを特定できます。このプションは、
あなたが使いたいルーティングを特定するために、リバースルーティングで使われます。 ::

    // 名前でルートを決める。
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // 名前付きルートで URL の生成
    $url = Router::url(['_name' => 'login']);

    // クエリー文字列引数付きの
    // 名前付きルートでの URL の生成
    $url = Router::url(['_name' => 'login', 'username' => 'jimmy']);

``:controller`` のようなルート要素を含むテンプレートを使用している場合、
``Router::url()`` にオプションの一部としてそれらを提供したい場合があると思います。

.. note::

    ルーティング名をアプリケーション全てで一意にする必要があります。
    違うルーティングスコープ出ない限り、同じ ``_name`` を二度使えません。

名前付きルーティングを構築する時、ルーティング名にいくつかの命名規則を適用したいでしょう。
CakePHP はそれぞれのスコープのプレフィックス名を定義することで、より簡単に
ルーティング名をきめられます。 ::

    Router::scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
        // このルーティング名は `api:ping` になります。
        $routes->connect('/ping', ['controller' => 'Pings'], ['_name' => 'ping']);
    });
    // ping ルートのための URL を生成
    Router::url(['_name' => 'api:ping']);

    // plugin() で namePrefix を使う
    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        // ルーティング接続
    });

    // または、 prefix() で
    Router::prefix('Admin', ['_namePrefix' => 'admin:'], function ($routes) {
        // ルーティング接続
    });

``_namePrefix`` オプションをネストしたスコープの中で使えます。
またそれは、あなたが期待したように動きます。 ::

    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
            // このルートの名前は `contacts:api:ping` になります。
            $routes->connect('/ping', ['controller' => 'Pings'], ['_name' => 'ping']);
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
-----------------------------------

.. php:staticmethod:: prefix($name, $callback)

多くのアプリケーションは特権を持ったユーザーが変更を加えるための管理者領域が必要です。
これはしばしば、特別な ``/admin/users/edit/5`` のような URL を通してなされます。
CakePHP では、プレフィックスルーティングは,  ``prefix`` スコープメソッドによって
有効化されます。 ::

    Router::prefix('admin', function ($routes) {
        // この全てのルートは `/admin` によってプレフィックスされｍす。
        // そのために、 prefix => admin をルート要素として追加します。
        $routes->fallbacks('DashedRoute');
    });

プレフィックスは ``Controller`` 名前空間に属するようにマップされます。コントローラーと
分離してプレフィックスすることによって、小さくて単純なコントローラーをもつことができます。
ビヘイビアはプレフィックスありのコントローラーも、なしコントローラーも継承や
:doc:`/controllers/components` やトレイトを使用可能にするための一般的な方法です。
このユーザーの例を使うと、 ``/admin/users/edit/5`` にアクセスしたとき、
**src/Controller/Admin/UsersController.php**  の ``edit()`` メソッドを
5 を第一引数として渡しながら呼びます。
ビューファイルは、 **src/Template/Admin/Users/edit.ctp** が使われます。

/admin へのアクセスを pages コントローラーの ``index()`` アクションに
以下のルートを使ってマップします。 ::

    Router::prefix('admin', function ($routes) {
        // admin スコープにいることによって、
        //  /admin を含まなくても、admin ルーティングします。
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

プレフィックスルーティングをするときに、 ``$options`` 引数で、追加のルーティングを
設定できます。 ::

    Router::prefix('admin', ['param' => 'value'], function ($routes) {
        //  ここで接続されているルートは '/admin' でプレフィックスされており、
        //  'param' ルーティングキーを持っています。
        $routes->connect('/:controller');
    });

このようにプラグインスコープの中で、プレフィックスを定義できます。 ::

    Router::plugin('DebugKit', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

上記は ``/debug_kit/admin/:controller`` のようなルーティングテンプレートを作ります。
接続されたルートは、 ``plugin`` と ``prefix`` というルート要素を持ちます。

プレフィックスを定義したときに、必要ならば複数のプレフィックスをネストできます。 ::

    Router::prefix('manager', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

上記のコードは、 ``/manager/admin/:controller`` のようなルーティングテンプレートを生成します。
接続されたルートは ``prefix`` というルート要素を ``manager/admin`` に設定します。

現在のプレフィックスはコントローラーのメソッドから ``$this->request->params['prefix']``
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

    フォールバックルーティングする *前* にプレフィックスルーティングをします。

.. index:: plugin routing

プラグインのためのルーティング
---------------------------------------

.. php:staticmethod:: plugin($name, $options = [], $callback)

:doc:`/plugins` のためのルートは ``plugin()`` メソッドを使って作成してください。
このメソッドは、プラグインルーティングのための新しいルーティングスコープを作成します。 ::

    Router::plugin('DebugKit', function ($routes) {
        // ここに接続されているルーティングは '/debug_kit' でプレフィックスされていて、
        // このプラグインのルート要素は 'DebugKit' にセットされています。
        $routes->connect('/:controller');
    });

プラグインスコープを作るときに、 ``path`` オプションでパス要素をカスタマイズできます。 ::

    Router::plugin('DebugKit', ['path' => '/debugger'], function ($routes) {
        // ここにルーティングされると '/debugger' でプレフィックスされ、
        // 'DebugKit' に対してセットされたプラグインルート要素を持ちます。
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

これでプラグインに対してのリンクを作れます。そのために **plugin** を添え字にして
URL を生成する配列に追加します。 ::

    echo $this->Html->link(
        'New todo',
        ['plugin' => 'Todo', 'controller' => 'TodoItems', 'action' => 'create']
    );

逆に、現在のリクエストがプラグインに対してのリクエストだったときに、
プラグインでないリンクを生成したかったら・ ::

    echo $this->Html->link(
        'New todo',
        ['plugin' => null, 'controller' => 'Users', 'action' => 'profile']
    );

``plugin => null`` を設定することで、プラグインの一部ではないリンクを作成したいことを
Router に伝えられます。

SEO に親和性があるルーティング
----------------------------------

良い検索エンジンのランキングを得るために、URL の中でダッシュを使うのを好む開発者もいるでしょう。
``DashedRoute`` クラスは、ルーティングプラグイン、コントローラー、およびキャメルケースで書かれた
アクション名をダッシュ記法の URL で表現します。

例えば、 ``TodoItems`` コントローラーの ``showItems()`` アクションを持つ
``ToDo`` プラグインを使っていたとして、 ``/to-do/todo-items/show-items``
でアクセスできるように、以下のルーティングで可能になります。 ::

    Router::plugin('ToDo', ['path' => 'to-do'], function ($routes) {
        $routes->fallbacks('DashedRoute');
    });

.. index:: file extensions
.. _file-extensions:

拡張子のルーティング
----------------------------------

.. php:staticmethod:: extensions(string|array|null $extensions, $merge = true)

異なる拡張子のファイルをルーティングで扱うためには、あなたの routes ファイルに
以下を追加します。 ::

    Router::scope('/', function ($routes) {
        $routes->extensions(['json', 'xml']);
        ...
    });

これは ``extensions()`` メソッドが呼ばれた **後** にすべてのルートが接続されるための
名前付き拡張子を有効にします。事前に接続されたルートは、拡張機能を継承しません。

.. note::

    拡張子がセットされた　**後**　でのみ拡張子がルーティングに適用されるので、
    拡張子を設定することはスコープの中で一番最初にやるべきことです。

拡張子を使うことで、一致したファイルの拡張子を除去し、残りをパースするように
伝えられます。もし /page/title-of-page.html のような URL を生成したいなら、
以下を使ってルートを設定します。 ::

    Router::scope('/page', function ($routes) {
        $routes->extensions(['json', 'xml', 'html']);
        $routes->connect(
            '/:title',
            ['controller' => 'Pages', 'action' => 'view'],
            [
                'pass' => ['title']
            ]
        );
    });

そして、ルートに対応するリンクを生成するために、以下のようにします。 ::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

拡張子が :doc:`/controllers/components/request-handling` で使われ、それによって
コンテンツタイプに合わせた自動的なビューの切り替えを行います。

.. _resource-routes:

RESTful なルーティング
===================================

.. php:staticmethod:: mapResources($controller, $options)

Router はコントローラーへの RESTful なルートを簡単に生成します。
RESTful なルーティングはアプリケーションの API のエンドポイントを作るときに有効です。
recipe コントローラーに REST アクセスできるようにしたい場合、このようにします。 ::

    // config/routes.php 内で...

    Router::scope('/', function ($routes) {
        $routes->extensions(['json']);
        $routes->resources('Recipes');
    });

最初の行は、簡単に REST アクセス可能にするために、いくつかのデフォルトルートをセットしています。
アクセス対象のメソッドには、最終的に受け取りたいフォーマット (例えば xml, json, rss) の指定が
必要です。これらのルーティングは、HTTP リクエストメソッドに対応しています。

=========== ===================== ==============================
HTTP format URL.format            対応するコントローラアクション
=========== ===================== ==============================
GET         /recipes.format       RecipesController::index()
----------- --------------------- ------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- ------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- ------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
----------- --------------------- ------------------------------
POST        /recipes/123.format   RecipesController::edit(123)
=========== ===================== ==============================

CakePHP の Router クラスは、いくつかの異なる方法で HTTP リクエストメソッドを判定します。
下記がその判定順序です。

#. POST リクエストの中の *\_method* 変数
#. X\_HTTP\_METHOD\_OVERRIDE
#. REQUEST\_METHOD ヘッダ

POST リクエストの中の、 *\_method* の値を使う方法は、ブラウザを使った REST クライアントの場合に
便利です。単純に POST メソッドの中で、\_method キーの値に HTTP メソッド名を入れるだけです。

ネストされたリソースへのルーティングを生成する
-----------------------------------------------------

スコープの中で一度リソースに接続すると、サブリソース (リソースの下層) にもルーティングで接続できます。
サブリソースへのルーティングは、オリジナルのリソース名と id パラメーターの後に追加されます。例えば、::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments');
        });
    });

これで ``articles`` と ``comments`` 両方のリソースへのルーティングを生成します。
この comments へのルーティングは以下のようになります。 ::

    /api/articles/:article_id/comments
    /api/articles/:article_id/comments/:id

``CommentsController`` の ``article_id`` を以下のように取得できます。 ::

    $this->request->params['article_id']

.. note::

    あなたが望む深さまでリソースをネストできますが、
    ２段階以上の深さにネストさせることはお勧めしません。

ルーティングの生成を制限する
----------------------------------

デフォルトの CakePHP は６つのルーティングを一つのリソースに対して作ります。
特定のリソースに対して、特定のルーティングのみで接続させたい場合、 ``only``
オプションを使います。 ::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

これで読み込み専用のルーティングが作られます。このルーティング名は ``create``,
``update``, ``view``, ``index``, と ``delete`` です。.

コントローラーアクションの生成
-------------------------------

ルーティングされるときに使われるコントローラー名を変更したい場合があるでしょう。
例えば、 ``edit()`` アクションを ``put()`` で呼びたいときに、
``actions`` キーをアクション名のリネームに使います。 ::

    $routes->resources('Articles', [
        'actions' => ['update' => 'put', 'create' => 'create']
    ]);

上記は ``put()`` を ``edit()`` アクションの代わりに使い、 ``create()``
を ``add()`` の代わりに使います。

追加のリソースへのルートをマップする
--------------------------------------------

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
-------------------------------------------------

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
------------------------------------------

デフォルトで、複数語のコントローラの URL フラグメントは、コントローラ名のアンダースコア形式です。
例えば、 ``BlogPosts`` の URL フラグメントは、 ``/blog_posts`` になります。

``inflect`` オプションを使って別の変化形を指定できます。 ::

    Router::scope('/', function ($routes) {
        $routes->resources('BlogPosts', [
            'inflect' => 'dasherize' // ``Inflector::dasherize()`` を使用
        ];
    })

上記は、 ``/blog-posts/*`` スタイルの URL を生成します。

.. note::

    CakePHP 3.1 から、公式の app スケルトンは、 ``DashedRoute`` をデフォルトルートクラス
    として使用します。 リソースルートに接続するとき ``'inflect' => 'dasherize'`` オプションを
    使用することは、URL フラグメントの語形変化一貫性にとって推奨されます。

.. index:: passed arguments
.. _passed-arguments:

渡された引数
==========================

渡された引数は追加の引数かリクエストを生成するときに使用されるパスセグメントです。
これらはしばしば、コントローラーメソッドにパラメーターを渡すために使われます。 ::

    http://localhost/calendars/view/recent/mark

上記のたとえでは、両方の ``recent`` と ``mark`` が ``CalendarsController::view()``
に引数として渡されます。渡された引数は３つの方法でコントローラーに渡されます。
一番目は、引数としてアクションを呼ばれたときに渡し、２番目は、
``$this->request->params['pass']`` で数字をインデックスとする配列で呼べるようになります。
最後は、 ``$this->passedArgs`` で２番目と同じ方法で呼べます。カスタムルーティングを
使用するときに、渡された引数を呼ぶために特定のパラメーターを強制することができます。

前の URL にアクセスしたい場合は、コントローラーアクションでこのようにします。 ::

    class CalendarsController extends AppController
    {
        public function view($arg1, $arg2)
        {
            debug(func_get_args());
        }
    }

下の出力を得ます::

    Array
    (
        [0] => recent
        [1] => mark
    )

コントローラーとビューとヘルパーで ``$this->request->params['pass']`` と
``$this->passedArgs`` でこれと同じデータが利用可能です。pass 配列中の値は、
呼ばれた URL に現れる順番をもとにした数字のインデックスになります。 ::

    debug($this->request->params['pass']);

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
===========

.. php:staticmethod:: url($url = null, $full = false)

URL の生成やリバースルーティングは CakePHP のすべてのコードの変更なしに URL の構造を
簡単に変更する機能です。 :term:`ルーティング配列` を URL を定義するために使えます。
あとで変更を加えても、生成された URL は自動的にアップデートされます。

URL を文字列によって以下のように生成します。 ::

    $this->Html->link('View', '/articles/view/' . $id);

``/posts`` がすべての残りの URL を通して本当に 'articles' の代わりに呼ばれるか
あとで決められます。また、リンクを以下のように定義した場合、 ::

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

そして、URL を変えたいと思ったら、ルーティングを定義することでできます。
これは両方受け取る URL マッピングも生成する URL も変えます。

配列の URL を使うとき、文字列パラメーターによるクエリと、特定のキーによる
ドキュメントフラグメントを定義できます。 ::

    Router::url([
        'controller' => 'Articles',
        'action' => 'index',
        '?' => ['page' => 1],
        '#' => 'top'
    ]);

    // こんな URL が生成されます
    /articles/index?page=1#top

Router はすべての配列の中のアンノウンパラメーターをクエリ文字列パラメーターに変換します。
``?`` は CakePHP の古いバージョンに対して後方互換性があります。

URL を生成するときに、特殊なルート要素も使えます。:

* ``_ext``  :ref:`file-extensions` （拡張子）ルーティングにつかいます。.
* ``_base`` false にセットすると、ベースURLを除去します。
  ルートディレクトリに作っているアプリがない場合、 'CakePHP relative' な URL の生成に使えます。
* ``_scheme``  リンクに `webcal` や `ftp` のように違うスキーマをセットする。
  現在のスキーマにデフォルト設定されています。
* ``_host`` リンクのためのホストを設定します。デフォルトは、現在のホストです。
* ``_port`` 非スタンダートなポートにリンクを生成するときにポートを設定します。
* ``_full``  true にすると、 `FULL_BASE_URL` 定数 が
  生成された URL の前に加えられます。
* ``_ssl`` ``true`` にすると普通の URL から https に変換します。
  ``false`` にすると、強制的に http になります。
* ``_name`` ルートの名前。名前付きルートをセットアップするときに、測定するためのキーとして使えます。

.. _redirect-routing:

リダイレクトルーティング
===========================

.. php:staticmethod:: redirect($route, $url, $options = [])

リダイレクトルーティングは入ってくるルーティングに HTTP ステータスの 30x リダイレクトを
発行し違う URL に転送することができます。これはクライアントアプリケーションにリソースが
移動したことを同じコンテンツに対して２つの URL が存在することを知らせずに伝えるために使えます。

リダイレクトルーティングは通常のルーティング条件に一致した時の実際のヘッダーリダイレクトと違います。
これは、 アプリケーションかプリケーションの外に対してのリダイレクトのためにおきます。 ::

    $routes->redirect(
        '/home/*',
        ['controller' => 'Articles', 'action' => 'view'],
        ['persist' => true]
        // もしくは $id を引数として受け取る view アクションの
        // デフォルトルーティングは ['persist'=>['id']]  のようにする
    );

``/home/*`` から ``/posts/view`` へのリダイレクトと ``/posts/view`` にパラメーターを渡すこと
配列をルートリダイレクト先を表現するために使うことで、文字列の URL がリダイレクトしている先を
定義できるようにします。文字列の URL で外部にリダイレクトできます。 ::

    $routes->redirect('/articles/*', 'http://google.com', ['status' => 302]);

これは、 ``/posts/*`` から ``http://google.com`` へ
HTTP 302 ステータスを出しながらリダイレクトさせます。

.. _custom-route-classes:

カスタムルーティングクラス
==============================

カスタムルーティングクラスは個別のルーティングが リクエストをパースしてリバースルーティングを
扱えるようにします。

* ルートクラスは、アプリケーションやプラグイン内にある ``Routing\\Route`` 名前空間で
  見つけられるはずです。
* ルートクラス  :php:class:`Cake\\Routing\\Route` を拡張します。
* ルートクラスは  ``match()`` と ``parse()`` の一方もしくは両方を使います。

受け取ったURLパースするのは ``parse()`` メソッドです。 これは、コントローラーとアクションに
接続するためのリクエストパラメーターの配列を生成します。

``false`` を一致しなかった時に返します。

``match()`` メソッドは URL パラメーターの配列に一致するか確かめるために使い、
URL を文字列で生成します。URL パラメーターがルートに一尉しない時は、
``false`` が返ります。

カスタムルーティングクラスを ``routeClass`` オプションを使って設定することができます。::

    $routes->connect(
         '/:slug',
         ['controller' => 'Articles', 'action' => 'view'],
         ['routeClass' => 'SlugRoute']
    );

このルーティングは ``SlugRoute`` のインスタンスを生成し、任意のパラメーター制御を提供します。
プラグインルーティングはスタンダードな :term:`プラグイン記法` を使えます。.

デフォルトルーティングクラス
-----------------------------

.. php:staticmethod:: defaultRouteClass($routeClass = null)

デフォルト ``Route`` 以外のすべての他のルートクラスをデフォルトの基づくルートに
使いたいときには、 ``Router::defaultRouteClass()`` を呼ぶことによって すべてのルートを
セットアップする前に、それぞれのルートのための特定の ``routeClass`` オプションを持つことを
避けます。例えば、下記を使います。 ::

    Router::defaultRouteClass('InflectedRoute');

これは、 ``DashedRoute`` ルートクラスを使うために、この後すべてのルーティング接続がされます。
引数なしにこのメソッドを呼ぶと、現在のデフォルトルートクラスが帰ってきます。

フォールバックメソッド
------------------------

.. php:method:: fallbacks($routeClass = null)

フォールバックメソッドはデフォルトルーティングをショートカットする簡単な方法です。
このメソッドは、定義されたルールのために渡されたルーティングクラスです。もし、
クラスが定義されていない場合、 ``Router::defaultRouteClass()`` で使われている設定が返ります。

フォールバックを呼ぶには、こうします。 ::

    $routes->fallbacks('DashedRoute');

これは正規の呼び出しに従うのと同じです。 ::

    $routes->connect('/:controller', ['action' => 'index'], ['routeClass' => 'DashedRoute']);
    $routes->connect('/:controller/:action/*', [], ['routeClass' => 'DashedRoute']);

.. note::

     デフォルトルーティングクラスを (``Route``) もしくは、 ``:plugin`` もくは ``:controller``
     またはその両方をフォールバックと一緒に使うとルート要素は矛盾する URL ケースを出力する。


継続的な URL パラメーターの生成
================================

URL フィルター 関数で URL の生成プロセスをホックできます。
フィルター関数は、 ルーティングに一致する *前* に呼ばれます。
これは、ルーティングする前に URL を用意します。

コールバックフィルター関数は以下のパラメーターを持ちます。:

- ``$params`` 生成されている URL パラメーター。
- ``$request`` 現在のリクエスト

URL フィルター関数は *常に* フィルターされていなくても、パラメーターを返します。

URL フィルターは永続的なパラメーターなどを簡単に扱う機能を提供します。 ::

    Router::addUrlFilter(function ($params, $request) {
        if (isset($request->params['lang']) && !isset($params['lang'])) {
            $params['lang'] = $request->params['lang'];
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
=====================================

CakePHP 3.0 から名前付きパラメーターが削除されたとしても、
アプリケーションは URL にそれを含んだ状態で公開されています。
名前付きパラメーターを含んだ URL を受け付けられるようにできます。

コントローラの ``beforeFilter()`` メソッドで、 ``parseNamedParams()``
呼ぶことで渡された引数のすべての名前付きパラメーターを展開できます。 ::

    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        Router::parseNamedParams($this->request);
    }

これは、 ``$this->request->params['named']`` にすべての渡された引数にある
名前付きパラメーターを移します。すべての名前付きパラメーターとして変換された引数は
渡された引数のリストから除去されます。

.. _request-action:

RequestActionTrait
==================

.. php:trait:: RequestActionTrait

    このトレイトは、それをインクルードしたクラスが、サブリクエストまたは、
    リクエストアクションを生成することを許可します。

.. php:method:: requestAction(string $url, array $options)

    この関数は、すべてのロケーションからのコントローラーのアクションを呼び、
    アクションからの *body* を返します。この渡された ``$url`` は  CakePHP
    形式の URL (/controllername/actionname/params) です。
    受け取ったコントローラーアクションに追加データを渡すために $options 配列に追加します。

    .. note::

        ``requestAction()`` を ``requestAction($url, ['return']);`` オプションの中の
        'return' で渡したレンダリングしたビュー受け取るために使えます。これは、
        コントローラーメソッドから  'return'  を使用して requestAction を作るために重要です。
        注意しないと、スクリプトや CSS のタグが正しく動きません。

    一般的に、サブリクエストを :doc:`/views/cells` を使って送信するのを避ける事ができます。
    セルは ``requestAction()`` に比べて軽い動作の再利用可能なビューコンポーネントです。

    requestAction メソッドが実際に ``requestAction()`` から
    生成されてインクルードされているか確かめる必要があります。確かめなかったら、
    requestAction メソッドが直接望まないURLからアクセスできるようになってしまいます。

    この関数を呼ぶためのシンプルな要素を生成します。 ::

        // src/View/Element/latest_comments.ctp
        echo $this->requestAction('/comments/latest');

    この要素を出力を得たい場所ならどこにでも置けます。 ::

        echo $this->element('latest_comments');

    この方法で書くと、要素がレンダリングされた時にはいつでも、データを取得するために
    コントローラーに対して、リクエストが作られます。そのデータは生成され、レンダリングされ
    ルーティングされます。でも、上記の警告にしたがうと、それはエレメントキャッシュを
    不必要なプロセスを防ぐための使うのは一番よい方法です。
    このような要素の呼出を編集するためにこうします。 ::

        echo $this->element('latest_comments', [], ['cache' => '+1 hour']);

    ``requestAction`` の呼び出しはキャッシュエレメントのビューファイルが存在し、
    利用可能な場合はできません。

    加えて、requestAction は URL のルーティング配列を使います。 ::

        echo $this->requestAction(
            ['controller' => 'Articles', 'action' => 'featured']
        );

    .. note::

        他の場所と違って、URL 配列は文字列の URL と似ています。
        requestAction はそれらを違うものとして扱います。

    この URL を基本とした配列は、 :php:meth:`Cake\\Routing\\Router::url()` が
    使っているものとひつ違いがあるだけで同じです。渡されたパラメーターを使っているなら、
    ２つ目の配列にそれらを置き、正しいキーでラップする必要があります。
    それは、 requestAction が追加のパラメーター (requestAction の第二引数）を
    ``request->params``のメンバ配列でマージし ``pass`` の下という正しい場所に置かないからです。
    他の ``$option`` 配列の追加キーはリクエストされたアクションの ``request->params``
    プロパティーで利用可能になります。 ::

        echo $this->requestAction('/articles/view/5');

    requestAction の配列は次のようになります。 ::

        echo $this->requestAction(
            ['controller' => 'Articles', 'action' => 'view'],
            ['pass' => [5]]
        );

    あなたは正しいキーを使って文字列で出来たクエリ、POST データ、クッキーを引数として渡せます。
    クッキーは ``cookies`` キーで渡せます。GET パラメーターは ``query`` で渡せます。
    POST データは ``post`` キーで遅れます。 ::

        $vars = $this->requestAction('/articles/popular', [
          'query' => ['page' = > 1],
          'cookies' => ['remember_me' => 1],
        ]);

    requestAction() と併せて URL 配列を使うときにリクエストされたアクションで必要になる
    **全部** のパラメーターを特定する必要があります。これは、 ``$this->request->data``
    みたいにパラメーターをインクルードします。すべての必要なパラメーターを渡すことに加えて、
    上記の２番目の配列に渡されなければなりません。

.. toctree::
    :glob:
    :maxdepth: 1

    /development/dispatch-filters

.. meta::
    :title lang=ja: Routing
    :keywords lang=ja: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
