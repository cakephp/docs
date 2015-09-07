ルーティング
##############

.. php:namespace:: Cake\Routing

.. php:class:: Router

ルーティングはURLをどコントローラーのアクションと関連付けてマッピングするか決める機能です。
ルーティングを設定することで、アプリケーションの動きとURLの構造を分離できます。

CakePHP でのルーティングはまた 配列による引数を文字列によるURLに変換するリバースルーティングも含みます。
リバースルーティングによって、簡単にアプリのURLの構造を全部のコードの書き直しをせずにリファクタリングできます。

.. index:: routes.php

概要
==========

ここでは、 CakePHPの最も一般的なルーティングの方法について例を出して説明します。
ランディングページのように見せたい時がよくあるでしょう。そのときは、 **routes.php** に以下を加えます。::

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

これはサイトのホームページにアクセスした時に ``ArticlesController`` の index メソッドを実行します。::
時々、複数のパラメーターを受け取る。動的ルーティングが必要になると思います。
それが必要になるケースは、この現在見ている article(記事)のコンテンツへのルーティングです。::

    Router::connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

上記のルーティングは、  ``/articles/15`` のようなURLを全て受け入れ、
``ArticlesController`` の ``view(15)`` メソッドを呼びます。
でもこれは、 ``/articles/foobar`` みたいなURLからのアクセスを防ぐわけではないです。
もし、いくつかの正規表現からなるパラメーターを文字列に直せるようにしたいなら、::

    Router::connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    );

上の例は新しいプレースホルダ ``:id``　によるスターマッチャーを変えました。
プレースホルダを使うことで、URLの部分バリデーションができます。
このケースでは ``\d+`` という正規表現を使いました。なので、0-9 のみが一致します。
最後に、ルーターに ``id`` プレースホルダを ``view()`` 関数に ``pass``
オプションで特定した引数を渡すように伝えます。
このオプションの詳細は後で説明します。

CakePHP はリバースルーティングできます。それは、URL文字列を生成でき、
一致するか判定する条件を含む配列から成ることを意味します。::

    use Cake\Routing\Router;

    echo Router::url(['controller' => 'Articles', 'action' => 'view', 'id' => 15]);
    // 以下を出力します。
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
    // 出力
    /login

ルーティングコードをドライに保つために、ルーターは 'scopes' （スコープ）というコンセプトを持っています。
スコープは一般的なパスセグメントを定義し、オプションとして、デフォルトにルーティングします。
すべてのスコープの内側に接続されているルートは、ラップしているスコープのパスとデフォルトを継承します。::

    Router::scope('/blog', ['plugin' => 'Blog'], function ($routes) {
        $routes->connect('/', ['controller' => 'Articles']);
    });

上記のルートは ``/blog/`` と一致し、それを
``Blog\Controller\ArticlesController::index()`` に送ります。.

このスケルトンは、いくつかのルートをはじめから持った状態で作られます。
一度自分でルートを追加したら、デフォルトルートが必要ない場合は除去できます。

.. index:: :controller, :action, :plugin
.. index:: greedy star, trailing star
.. _connecting-routes:
.. _routes-configuration:

ルーティングによる接続
========================

.. php:staticmethod:: connect($route, $defaults = [], $options = [])

コードを :term:`DRY` に保つために 'routing scopes' を使いましょう。
ルーティングスコープはコードをDRYに保つためだけではなく、ルーターの動きをオプティマイズします。
上記を参照すると、 ``Router::connect()`` をルートを接続するために使えることがわかります。
``/`` スコープにこのメソッドはデフォルトに設定されています。スコー雨を作りいくつかのルートを接続するために、
``scope()`` メソッドを使います。::

    // In config/routes.php
    Router::scope('/', function ($routes) {
        $routes->fallbacks('DashedRoute');
    });


``connect()`` メソッドは３つの引数をとります。このURLのテンプレートは、
ルーティング要素のためのデフォルト値とルーティングオプションが一致するかどうか確かめます。

オプションはしばしば正規表現を他のURL要素に一致するかどうか判断するために含みます。

基本のフォーマットは以下です。 ::

    $routes->connect(
        'URL template',
        ['default' => 'defaultValue'],
        ['option' => 'matchingRegex']
    );

１番目の引数は、ルーターにどのURLを制御しようとしているのか伝えます。
このURLは普通のスラッシュで区切られた文字列ですが、ワイルドカード (\*)
や :ref:`route-elements` を含むことができます。
ワイルドカードは、すべての引数を受け付けることを意味します。
\* なしだと、文字列に完全一致するものだけに絞られます。

URLが特定されたら、一致したときに同様な動作をするかを ``connect()`` の残り二つの引数を使います。
２番目の引数は、連想配列です。この配列の添え字は、 URLのルーティング要素に合わせるか、
デフォルト要素である、 ``:controller``, ``:action`` や ``:plugin`` とつけられます。
配列の値はキーのためのデフォルトの値になります。３番目の引数を使う前に基本的な例を見ましょう。 ::

    $routes->connect(
        '/pages/*',
        ['controller' => 'Pages', 'action' => 'display']
    );

CakePHP によってあらかじめ作られている routes.php ファイルでこのルーティングは見つけられます。
このルートは ``/pages/`` ではじまるすべてのURLに一致し、それを
``PagesController`` の ``display()`` アクションに渡します。
この場合、 /pages/products へのリクエストは、 ``PagesController->display('products')`` に送られます。

加えて、``/*``　を **greedy star** , ``/**`` を流れ星( **trailing star**)といいます。
二つのアスタリスクの流れ星で値を一つ渡すURLを表現します。
これは、 ``/`` を含む値を渡す の時に使えます。 ::

    $routes->connect(
        '/pages/**',
        ['controller' => 'Pages', 'action' => 'show']
    );

``/pages/the-example-/-and-proof`` がURLとして渡ってきたときに、
``the-example-/-and-proof`` を引数として渡せます。

``connect()`` の第二引数は ルートの
初期値から構成されているすべての引数を生成するために使えます。::

    $routes->connect(
        '/government',
        ['controller' => 'Pages', 'action' => 'display', 5]
    );

この例では、 ``connect()`` の第２引き数をデフォルトの値を定義するために使う方法を示しています。
もし、いろいろなカテゴリの製品を顧客に対して提供するサイトを作るのであれば、ルーティングすることを考えるべきです。
この例では、 ``/pages/display/5`` にアクセスするために ``/government``  がURLとして使えます。

ほかの一般的なルーティングの方法は、コントローラーの "エイリアス" (**ailias**)を決めることです。
``/users/some_action/5``の代わりに、 ``/cooks/some_action/5`` で同じ場所にアクセスしたい場合、
以下のように簡単にできます。 ::

    $routes->connect(
        '/cooks/:action/*', ['controller' => 'Users']
    );

これはルーターに ``/cooks/`` で始まるすべてのURLは users コントローラに送るように伝えています。
アクションは  ``:action`` の値によって呼ばれるかどうか決まります。
:ref:`route-elements` を使って、ユーザーの入力や変数を受け付けるいろいろなルーティングができます。

上記のルーティングの方法は、 "/*" （**greedy star**） を使います。
**greedy star** は  :php:class:`Router` がすべての位置指定引数
を受け取ることを意味します。 それらの引数は :ref:`passed-arguments` 配列で有効化されます。


URLを生成するときにもルーティングは使われます。
もし最初に一致するものがあった場合、``array('controller' => 'users', 'action' => 'some_action', 5)``
を使って /cooks/some_action/5 と出力します。

URLを生成するときにもルーティングは使われます。
もし最初に一致するものがあった場合、``array('controller' => 'users', 'action' => 'some_action', 5)``
を使って /cooks/some_action/5 と出力します。

.. _route-elements:

ルーティングのための要素
-----------------------------------

あなたは独自のルート要素を特定し、それはそのためにどこにコントローラのアクション
のための値があるべきなのかを定義する力をあたえる。リクエストされたときに、ルート要素のための
変数がコントローラー上で ``$this->request->params`` によってみつけられる。
カスタムルーティング要素を定義した場合、正規表現をオプションで指定できます。
これはCakePHPにどんなURLが正しいフォーマットなのかを伝えます。
正規表現を使用しなかった場合、 ``/`` 以外はすべて値の一部として扱われます。::

    $routes->connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+']
    );

この単純な例は、どうやって素早くviewアクションをすべてのコントローラからURLによって
``/controllername/:id`` のような形で呼べるようにするかを示しています。
このURLは connect() で ``:controller`` と ``:id`` という２つのルーティング要素を指定するために使われます。
この ``:controller`` 要素は CakePHP のデフォルトルーティング要素で、URLがどのコントローラーを示しているのか識別できます。
``:id`` 要素はカスタムルーティング要素で、 connect() の第三引数の中で正規表現でより明確にされなければなりません。

CakePHP は小文字とダッシュによって表されたURLを
``:controller`` を使った時には出力しません。これを出力したかったら、
上の例を下のように書きなおしてください。::

    $routes->connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+', 'routeClass' => 'DashedRoute']
    );

``DashedRoute`` クラス ``:controller`` を確認し、
``:plugin`` パラメーターを正しく小文字とダッシュによって表します。

2.x の CakePHP からマイグレーションするときに、小文字と ``_`` によるURLが必要であったら、
 ``InflectedRoute`` クラスを使う代わりにできます。

.. note::

    ルーティング要素に使用している正規表現のパターンははすべてキャプチャーグループを含んではならない。
    もし含んでいると、正しく動きません。

一度、ルートが定義されたら、 ``/apples/5`` を呼ぶと
ApplesControllerの view() メソッドを呼びます。  view() メソッドの中で、
``$this->request->params['id']`` で渡されたIDにアクセスする必要がある。

アプリの中で一つのコントローラーだけがあるとき、URLにコントローラー名が含まれている必要がない。
そのときは、すべてのURLがアクション名だけで一つのコントローラーに示すことができる。
たとえば、 ``home`` コントローラーにすべてのURLでアクセスするように設定したとして、
``/home/demo`` の代わりに ``/demo``  というURLを使う場合以下の通りに設定します ::

    $routes->connect('/:action', ['controller' => 'Home']);

もし、大文字小文字を区別しないURLを提供したいと思ったら、正規表現の修飾子だけを使えます。::

    $routes->connect(
        '/:userShortcut',
        ['controller' => 'Teachers', 'action' => 'profile', 1],
        ['userShortcut' => '(?i:principal)']
    );

もう一つ例を挙げます。これができたらプロ級 ::

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
このURLは４つの要素を操作しています。１番目は、なじみがあります。デフォルトのルーティング要素で
CakePHP にコントローラー名が必要なことを伝えています。

次に、デフォルト値を特定します。 コントローラーにかかわらず index() がをばれるようにしたい。

最後に、数字による"年月日"の表現と一致する正規表現を紹介します。この括り（グルーピング）は正規表現ではサポートされていません。
 ほかにも特定可能ですが上記のように　括弧でくくりません。

一回定義されたら、このル－ティングが ``/articles/2007/02/01`` , ``/articles/2004/11/16`` に一致したら、
index() へのリクエストをそれが属するコントローラーに ``$this->request->params`` に *date* を格納して渡します。

いくつかの特別な意味を持つルーティング要素があります。
そして、特別な意味を持たせたくないなら、使ってはいけません。

* ``controller`` コントローラー名に使います。
* ``action`` アクション名に使います。
* ``plugin`` コントローラーにあるプラグイン名に使います。
* ``prefix`` :ref:`prefix-routing` のために使います。
* ``ext`` :ref:`file-extensions` ルーティングのために使います。
* ``_base`` false にセットすると、ベースURLを除去します。
      ルートディレクトリに作っているアプリがない場合、 'CakePHP relative' なURLの生成に使えます。
* ``_scheme``  リンクに `webcal` or `ftp` のように違うスキーマをセットする。
  現在のスキーマにデフォルト設定されています。
* ``_host`` リンクのためのホストを設定します。デフォルトは、現在のホストです。
* ``_port`` 非スタンダートなポートにリンクを生成するときにポートを設定します。
* ``_full`` ``true`` にすると `FULL_BASE_URL` 定数が
  生成されたURLの前に加えられます。
* ``#`` URLのハッシュフラグメントをセットします。
* ``_ssl`` ``true`` にすると普通の URL から https に変換します。
  ``false`` にすると、強制的にhttp になります。
* ``_method`` HTTP 動詞/メソッドを使うために定義します。
  :ref:`resource-routes` と一緒に使うときに役に立ちます。.
* ``_name`` ルートの名前。名前付きルートをセットアップするときに、測定するためのキーとして使えます。

値をアクションに渡す
--------------------------------------

:ref:`route-elements` を使ってルーティングしている時に、ルーティング要素で
引数を渡したい時があると思います。 ``pass`` オプションはルーティング要素が
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
                // 関数に引数を渡すためのルーティングテンプレートの中で、ルーティング要素を定義します。
                // テンプレートの中で、ルーティング要素を定義します。
                //  ":id" をアクション内の $articleId にマップします。
                'pass' => ['id', 'slug'],
                // `id` が一致するパターンを定義します。
                'id' => '[0-9]+'
            ]
        );
    });

そして今、逆ルーティングのおかげで、下記のように url 配列を渡し、ルーティングで定義されたURLをどのように整えるのか
Cakeは知ることができます。 ::

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

名前付きルーティング
-----------------------------

時々、ルーティングのためにすべてのURLパラメーターを記述することが面倒になって、
パフォーマンスを上げるために名前付きのルーティングをしたいと思うようになるでしょう。
ルーティングするときに、 ``_name`` オプションを特定できます。このプションは、
あなたが使いたいルーティングを特定するために、リバースルーティングで使われます。::

    // 名前でルーティングを決める。
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // 名前付きルーティングでURLの生成
    $url = Router::url(['_name' => 'login']);

    // 文字列引数付きの
    // 名前付きルーティングでのURLの生成
    $url = Router::url(['_name' => 'login', 'username' => 'jimmy']);

``:controller`` のようなルーティング要素を含むテンプレートを使用している場合、
``Router::url()`` にオプションの一部としてそれらを提供したい場合があると思います。

.. note::

    ルーティング名をアプリケーション全てで一意にする必要があります。
    違うルーティングスコープ出ない限り、同じ ``_name`` を二度使えません。

名前付きルーティングをさくせうする時、ルーティング名にいくつかの命名規則を適用したいでしょう。
 CakePHP はそれぞれのスコープのプレフィックス名を定義することで、より簡単にルーティング名をきめられます。::

    Router::scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
        // このルーティング名は `api:ping` になります。
        $routes->connect('/ping', ['controller' => 'Pings'], ['_name' => 'ping']);
    });
    // ピンルートのためのURLを生成
    Router::url(['_name' => 'api:ping']);

    // plugin() で namePrefix を使う
    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        // ルーティング接続
    });

    // または、 prefix() で
    Router::prefix('Admin', ['_namePrefix' => 'admin:'], function ($routes) {
        // ルーティング接続
    });

``_namePrefix`` おプソンをネストしたスコープの中で使えます。
またそれは、あなたが期待したように動きます。::

    Router::plugin('Contacts', ['_namePrefix' => 'contacts:', function ($routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
            // このルーターの名前は `contacts:api:ping` になります。
            $routes->connect('/ping', ['controller' => 'Pings'], ['_name' => 'ping']);
        });
    });

    // ピンルートのためのURLを生成
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

多くのアプリケーションは特権を持ったユーザーが変更を加えられるよう
管理者領域を必要としている。 これはしばしば、特別な ``/admin/users/edit/5`` のようなURLを通してなされます。
In CakePHPでは、プレフィックスルーティングは,  ``prefix`` スコープメソッドによって有効化されます。::

    Router::prefix('admin', function ($routes) {
        // この全てのルートは `/admin` によってプレフィックスされｍす。
        // そのために、 prefix => admin をルーティング要素として追加します。
        $routes->fallbacks('DashedRoute');
    });

プレフィックスは ``Controller`` 名前空間に属するようにマップされます。
コントローラーと分離してプレフィックスすることによって、小さくて単純なコントローラーをもつことができます。
ビヘイビアはプレフィックスありのコントローラーも、なしコントローラーも継承や :doc:`/controllers/components`,
やトレイトを使用可能にするための一般的な方法です。

このユーザーの例を使うと、 ``/admin/users/edit/5`` にアクセスしたとき、
**src/Controller/Admin/UsersController.php**  の ``edit()``
メソッドを5を第一引数として渡しながら呼びます。
ビューファイルは、 **src/Template/Admin/Users/edit.ctp** が使われます。

/admin へのアクセスを page コントローラーの ``admin_index`` アクションに以下のルーティング設定を使ってマップします。::

    Router::prefix('admin', function ($routes) {
        // admin スコープにいることによって、
        //  /admin を含まなくても、admin ルーティングします。
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

プレフィックスルーティングをするときに、 ``$options`` 引数で、追加のルーティングを設定できます。::

    Router::prefix('admin', ['param' => 'value'], function ($routes) {
        //  ここで接続されているルートは '/admin' でプレフィックスされており、
        //  'param' ルーティングキーを持っています。
        $routes->connect('/:controller');
    });

このようにプラグインスコープの中で、プレフィックスを定義できます。::

    Router::plugin('DebugKit', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

上記は ``/debug_kit/admin/:controller`` のようなルーティングテンプレートを作ります。.
The connected route would have the ``plugin`` and ``prefix`` route elements set.

プレフィックスを定義したときに、必要ならば複数のプレフィックスをネストできます。::

    Router::prefix('manager', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

上記のコードは、 ``/manager/admin/:controller``のようなルーティングテンプレートを生成します。
ルーティングは ``prefix`` というルーティング要素を ``manager/admin`` に設定します。
 なので、 ``/manager/posts/add`` は ``PostsController::manager_add()`` に対してマップされています。

加えて、現在のプレフィックスはコントローラーのメソッドから ``$this->request->params['prefix']`` を通して利用可能です。

プレフィックスルーティングを使っているときは、HTMLヘルパーをプレフィックスつけることを忘れないために使うことが大事です。
これが、リンクをHTMLヘルパーで作る方法です。 ::

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

:doc:`/plugins` ルーティングは最も簡単に ``plugin()`` メソッドを使う方法です。
このメソッドは、プラグインルーティングのための新しいルーティングスコープを作ります。::

    Router::plugin('DebugKit', function ($routes) {
        // ここに接続されているルーティングは '/debug_kit' でプレフィックスされていて、
        // このプラグインのルーティング要素は 'DebugKit' にセットされています。
        $routes->connect('/:controller');
    });

プラグインスコープを作るときに、
``path`` オプションでパス要素をカスタマイズできます。::

    Router::plugin('DebugKit', ['path' => '/debugger'], function ($routes) {
        // ここにルーティングされると '/debugger' でプレフィックスされ、
        // 'DebugKit' に対してセットされたプラグインルーティング要素を持ちます。 .
        $routes->connect('/:controller');
    });

スコープを使うときに、プレフィックススコープ内でプラグインスコープをネストできます。::

    Router::prefix('admin', function ($routes) {
        $routes->plugin('DebugKit', function ($routes) {
            $routes->connect('/:controller');
        });
    });

上記は、 ``/admin/debug_kit/:controller`` のようなルーティングを作ります。.
これは、 ``prefix`` と ``plugin`` をルーティング要素として持ちます。

これでプラグインに対してのリンクを作れます。そのために **plugin** を添え字にしてURLを生成する配列に追加します。::

    echo $this->Html->link(
        'New todo',
        ['plugin' => 'Todo', 'controller' => 'TodoItems', 'action' => 'create']
    );

逆に、現在のリクエストがプラグインに対してのリクエストだったときに、プラグインでないリンクを生成したかったら・::

    echo $this->Html->link(
        'New todo',
        ['plugin' => null, 'controller' => 'Users', 'action' => 'profile']
    );

``plugin => null`` によってプラグインなしのリンクを設定できます。

SEOに親和性があるルーティング
---------------------------------------------

良い検索エンジンのランキングを得るために、URLの中でダッシュを使うのを好む開発者もいるでしょう。
この ``DashedRoute`` クラスは、ルーティングプラグイン、コントローラー、
およびキャメルケースで書かれたアクション名をダッシュ記法のURLで表現します。

``TodoItems`` コントローラーの ``showItems()`` アクションで例えば、
``ToDo`` プラグインを使っていたとして、 ``/to-do/todo-items/show-items``
でアクセスできるように、以下のルーティングで可能になります。::

    Router::plugin('ToDo', ['path' => 'to-do'], function ($routes) {
        $routes->fallbacks('DashedRoute');
    });

.. index:: file extensions
.. _file-extensions:

拡張子のルーティング
----------------------------------

.. php:staticmethod:: extensions(string|array|null $extensions, $merge = true)

違う拡張子のファイルをルーティングで扱うためには、もう一行ルーティングの設定ファイルに追加します。::

    Router::extensions(['html', 'rss']);

これはこのメソッドが呼ばれた **後** にすべてのルーティングが接続される
ための名前付き拡張子を有効にします。
前それに接続されたすべてのルートは、拡張機能を継承しません。
デフォルトでは、渡した拡張子は存在する拡張子のリストとマージされます。
``false`` 既存の拡張子のリストをオーバーライドするためにを第二引数として渡せます。
引数なしでこのメソッドを呼ぶと、既存の拡張子のリストが返ってきます。
スコープごとにこのように拡張子を設定できます。::

    Router::scope('/api', function ($routes) {
        $routes->extensions(['json', 'xml']);
    });

.. note::

    拡張子がセットされた後でのみ拡張子がルーティングに適用されるので、
    拡張子を設定することはスコープの中で一番最初にやるべきことです。

拡張子を使うことで、一致したファイルの拡張子を除去し、残りをパースするように
伝えられます。もし /page/title-of-page.html のようなURLを生成したいなら、
以下を使ってルートを設定します。::

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

そして、ルーティングに対応するリンクを生成するために、以下のようにします。 ::

    $this->Html->link(
        'Link title',
        ['controller' => 'Pages', 'action' => 'view', 'title' => 'super-article', '_ext' => 'html']
    );

拡張子が :php:class:`RequestHandlerComponent` で使われ、それによって
コンテンツタイプに合わせた自動的な振り分けがされます。

.. _resource-routes:

RESTフルなルーティング
===================================

.. php:staticmethod:: mapResources($controller, $options)

ルーターはコントローラーへの RESTフルなルーティングを簡単に生成します。
RESTフルなルーティングはアプリケーションのAPIのエンドポイントを作るときに有効です。
コントローラーに REST 接続をさせる必要があるときには、このようにします。::

    // In config/routes.php...

    Router::scope('/', function ($routes) {
        $routes->extensions(['json']);
        $routes->resources('Recipes');
    });

最初の行は、簡単にRESTアクセス可能にするために、いくつかのデフォルトルートをセットしています。
アクセス対象のメソッドには、最終的に受け取りたいフォーマット (例えば xml, json, rss) の指定が必要です。
これらのルーティングは、HTTPリクエストメソッドに対応しています。

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

CakePHPのルータクラスは、いくつかの異なる方法でHTTPリクエストメソッドを判定します。
下記がその判定順序です。

#. POSTリクエストの中の *\_method* 変数
#. X\_HTTP\_METHOD\_OVERRIDE
#. REQUEST\_METHOD ヘッダ

POSTリクエストの中の、 *\_method* の値を使う方法は、ブラウザを使ったRESTクライアントの場合に便利です。
単純にPOSTメソッドの中で、\_methodキーの値にHTTPメソッド名を入れるだけです。

ネストされたリソースへのルーティングを生成する
-----------------------------------------------------

スコープの中で一度リソースに接続すると、サブリソース(リソースの下層)にもルーティングで接続できます。
サブリソースへのルーティングは、オリジナルのリソース名と id パラメーターの後に追加されます。例えば、::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments');
        });
    });

これで ``articles`` と ``comments`` 両方のリソースへのルーティングを生成します。
この comments へのルーティングは以下のようになります。::

    /api/articles/:article_id/comments
    /api/articles/:article_id/comments/:id

``CommentsController`` の ``article_id`` を以下のように取得できます。::

    $this->request->params['article_id']

.. note::

    あなたが望む深さまでリソースをネストできますが、
    ２段階以上の深さにネストさせることはお勧めしません。

ルーティングの生成を制限する
----------------------------------

デフォルトの CakePHP は６っつのルーティングを一つのリソースに対して作ります。
特定のリソースに対して、特定のルーティングのみで接続させたい場合、 ``only``
オプションを使います。::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

これで読み込み専用のルーティングが作られます。このルーティング名は ``create``,
``update``, ``view``, ``index``, と ``delete`` です。.

コントローラーアクションの生成
----------------------------------------------

ルーティングされるときに使われるコントローラー名を変更したい場合があるでしょう。
例えば、 ``edit()`` アクションを ``update()`` で呼びたいときに、
``actions`` キーをアクション名のリネームに使います。::

    $routes->resources('Articles', [
        'actions' => ['edit' => 'update', 'add' => 'create']
    ]);

上記は ``update()`` を ``edit()`` アクションの代わりに使い、 ``create()``
を ``add()`` の代わりに使います。

追加のリソースへのルーティングをマップする
-----------------------------------------------------

``map`` オプションを使って、追加のリソース(アクションを含む)へのルーティングをマップする。::

     $routes->resources('Articles', [
        'map' => [
            'deleteAll' => [
                'action' => 'deleteAll',
                'method' => 'DELETE'
            ]
        ]
     ]);
     // これは /articles/deleteAll へ接続します。

デフォルトルーティングに加えて、これは `/articles/delete_all` へルーティングします。
デフォルトでは、パスセグメントはキー名に一致します。
'path' キーを、パスをカスタマイズするためのリソースの定義の中で使えます。::


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

'only' と 'map' を定義した場合、マップされたメソッドが
'only' リストにもあるか確かめましょう。.

.. _custom-rest-routing:

ルーティングリソースのためのカスタムルートクラス
--------------------------------------------------------------------

 ``resources()`` の ``$options`` 配列の ``connectOptions`` キーで ``connect()`` を使った設定ができます。  ::

    Router::scope('/', function ($routes) {
        $routes->resources('books', [
            'connectOptions' => [
                'routeClass' => 'ApiRoute',
            ]
        ];
    });

.. index:: passed arguments
.. _passed-arguments:

渡された引数
==========================

渡された引数は追加の引数かリクエストを生成するときに使用されるパスセグメントです。
これらはしばしば、コントローラーメソッドにパラメーターを渡すために使われます。 ::

    http://localhost/calendars/view/recent/mark

上記のたとえでは、両方の ``recent`` と ``mark`` が ``CalendarsController::view()`` に引数として渡されます。
渡された引数は３っつの方法でコントローラーに渡されます。
一番目は、引数としてアクションを呼ばれたときに渡し、２番目は、
``$this->request->params['pass']`` で数字を添え字とする配列で呼べるようになります。
最後は、 ``$this->passedArgs`` で２番目と同じ方法で呼べます。
カスタムルーティングを使用するときに、渡された引数を呼ぶために特定のパラメーターを強制することができます。

前のURLにアクセスしたい場合は、コントローラーアクションでこのようにします。 ::

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

コントローラーとビューとヘルパーで ``$this->request->params['pass']`` と ``$this->passedArgs``
でいくつかのデータが利用可能です。

    debug($this->request->params['pass']);

上記の出力は以下になります。::

    Array
    (
        [0] => recent
        [1] => mark
    )

URLを :term:`routing array` を使って生成するとき、文字列による添え字なしで配列に引数を加えます::

    ['controller' => 'Articles', 'action' => 'view', 5]

``5`` は引数として渡されるときには数字キーを持ちます。

URLの生成
===============

.. php:staticmethod:: url($url = null, $full = false)

URLの生成やリバースルーティングは CakePHP のすべてのコードの変更なしにURLの構造を簡単に変更する機能です。
:term:`ルーティング配列 <routing array>` をURLを定義するために使えます。
あとで変更を加えても、生成されたURLは自動的にアップデートされます。

URLを文字列によって以下のように生成します。:

    $this->Html->link('View', '/articles/view/' . $id);

``/posts`` がすべての残りのURLを通して本当に
'articles' の代わりに呼ばれるかあとで決められます。
また、リンクを以下のように定義した場合、::

    $this->Html->link(
        'View',
        ['controller' => 'Articles', 'action' => 'view', $id]
    );

そして、URLを変えたいと思ったら、ルーティングを定義することでできます。
これは両方受け取るURLマッピングも生成するURLも変えます。

配列のURLを使うとき、文字列パラメーターによるクエリと、特定のキーによるドキュメントフラグメントを定義できます。::

    Router::url([
        'controller' => 'Articles',
        'action' => 'index',
        '?' => ['page' => 1],
        '#' => 'top'
    ]);

    // こんなURLが生成されます
    /articles/index?page=1#top

ルーターはすべての配列の中のアンノウンパラメーターをクエリ文字列パラメーターに変換します。
``?`` は古いCakeに対して後方互換性があります。

URLを生成するときに、特殊なルーティング要素も使えます。:

* ``_ext``  :ref:`file-extensions` （拡張子）ルーティングにつかいます。.
* ``_base`` false にセットすると、ベースURLを除去します。
      ルートディレクトリに作っているアプリがない場合、 'CakePHP relative' なURLの生成に使えます。
* ``_scheme``  リンクに `webcal` or `ftp` のように違うスキーマをセットする。
  現在のスキーマにデフォルト設定されています。
* ``_host`` リンクのためのホストを設定します。デフォルトは、現在のホストです。
* ``_port`` 非スタンダートなポートにリンクを生成するときにポートを設定します。
* ``_full``  true にすると、 `FULL_BASE_URL` 定数 が
      生成されたURLの前に加えられます。
* ``_ssl`` ``true`` にすると普通の URL から https に変換します。
  ``false`` にすると、強制的にhttp になります。
* ``_name`` ルートの名前。名前付きルートをセットアップするときに、測定するためのキーとして使えます。

.. _redirect-routing:

リダイレクトルーティング
===========================

.. php:staticmethod:: redirect($route, $url, $options = [])

リダイレクトルーティングは入ってくるルーティングに HTTP ステータスの 30x リダイレクトを発行し違うURLに転送することができます。
これはクライアントアプリケーションにリソースが移動したことを同じコンテンツに対して２つのURLが存在することを知らせずに伝えるために使えます。

リダイレクトルーティングは通常のルーティング条件に一致した時の実際のヘッダーリダイレクトと違います。
これは、 アプリケーションかプリケーションの外に対してのリダイレクトのためにおきます。::

    $routes->redirect(
        '/home/*',
        ['controller' => 'Articles', 'action' => 'view'],
        ['persist' => true]
        // もしくは$idを引数として受け取るviewアクションの
        // デフォルトルーティングは ['persist'=>['id']]  のようにする
    );

``/home/*`` から ``/posts/view`` へのリダイレクトと ``/posts/view`` にパラメーターを渡すこと
配列をルートリダイレクト先を表現するために使うことで、文字列のURLがリダイレクトしている先を定義できるようにします。
文字列のURLで外部にリダイレクトできます。::

    $routes->redirect('/articles/*', 'http://google.com', ['status' => 302]);

これは、 ``/posts/*`` から ``http://google.com`` へwith a
HTTP  302　ステータスを出しながらリダイレクトさせます。

.. _custom-route-classes:

カスタムルーティングクラス
==============================

カスタムルーティングクラスは個別のルーティングが リクエストをパースしてリバースルーティングを扱えるようにします。

* ルートクラスは Cakeのアプリケーションかプラグイン内にある ``Routing\\Route`` 名前空間で見つけられるはずです。
* ルートクラス  :php:class:`Cake\\Routing\\Route` を拡張します。
* ルートクラスは  ``match()`` と ``parse()`` の一方もしくは両方を使います。

受け取ったURLパースするのは ``parse()`` メソッドです。 これは、コントローラーとアクションに
接続するためのリクエストパラメーターの配列を生成します。

``false`` を一致しなかった時に返します。

``match()`` メソッドはURLパラメーターの配列に一致するか確かめるために使い、URLを文字列で生成します。
URLパラメーターがルートに一尉しない時は、 ``false`` が返ります。

カスタムルーティングクラスを ``routeClass`` オプションを使って設定することができます。::

    $routes->connect(
         '/:slug',
         ['controller' => 'Articles', 'action' => 'view'],
         ['routeClass' => 'SlugRoute']
    );

このルーティングは ``SlugRoute`` のインスタンスを生成し、任意のパラメーター制御を提供します。
プラグインルーティングはスタンダードな :term:`plugin syntax` を使えます。.

デフォルトルーティングクラス
-----------------------------------------

.. php:staticmethod:: defaultRouteClass($routeClass = null)

デフォルト ``Route`` 以外のすべての他のルートクラスをデフォルトの基づくルートに使いたいときには、
``Router::defaultRouteClass()`` を呼ぶことによって すべてのルートをセットアップする前に、
それぞれのルートのための特定の``routeClass`` オプションを持つことを避けます。例えば、下記を使います::

    Router::defaultRouteClass('InflectedRoute');

これは、 ``DashedRoute`` ルートクラスを使うために、この後すべてのルーティング接続がされます。
引数なしにこのメソッドを呼ぶと、現在のデフォルトルートクラスが帰ってきます。

フォールバックメソッド
---------------------------------------

.. php:method:: fallbacks($routeClass = null)

フォールバックメソッドはデフォルトルーティングをショートカットする簡単な方法です。
このメソッドは、定義されたルールのために渡されたルーティングクラスです。
もし、クラスが定義されていない場合、 ``Router::defaultRouteClass()`` で使われている設定が返ります。

フォールバックを呼ぶには、こうします::

    $routes->fallbacks('DashedRoute');

これは正規の呼び出しに従うのと同じです。::

    $routes->connect('/:controller', ['action' => 'index'], ['routeClass' => 'DashedRoute']);
    $routes->connect('/:controller/:action/*', [], , ['routeClass' => 'DashedRoute']);

.. note::

     デフォルトルーティングクラスを (``Route``)もしくは、``:plugin`` もくは ``:controller`` またはその両方を
     フォールバックと一緒に使うとルーティング要素は矛盾するURLケースを出力する。


継続的なURL パラメーターを生成する。
=======================================

URL フィルター 関数でURLの生成プロセスをホックできます。
フィルター関数は、 ルーティングに一致する *前* に呼ばれます。
これは、ルーティングする前にURLを用意します。

コールバックフィルター関数は以下のパラメーターを持ちます。:

- ``$params`` 生成されているURLパラメーター。
- ``$request`` 現在のリクエスト

URLフィルター関数は *常に* フィルターされていなくても、パラメーターを返します。

URL フィルターは永続的なパラメーターなどを簡単に扱う機能を提供します。::

    Router::addUrlFilter(function ($params, $request) {
        if (isset($request->params['lang']) && !isset($params['lang'])) {
            $params['lang'] = $request->params['lang'];
        }
        return $params;
    });

フィルター関数は、それらが接続されている順番に適用されます。

URL内での名前付きパラメーターの扱い
==========================================

CakePHP 3.0 から名前付きパラメーターが削除されたとしても、
アプリケーションはURLにそれを含んだ状態で公開されています。
名前付きパラメーターを含んだURLを受け付けられるようにできます。

コントローラの ``beforeFilter()`` メソッドで、
``parseNamedParams()`` くぉ渡された引数のすべての名前付きパラメーターを展開できます。::

    public function beforeFilter()
    {
        parent::beforeFilter();
        Router::parseNamedParams($this->request);
    }

これは、 ``$this->request->params['named']`` にすべての渡された引数にある名前付きパラメーターを移します。
すべての名前付きパラメーターとして変換された引数は渡された引数のリストから除去されます。

.. _request-action:

RequestActionTrait
==================

.. php:trait:: RequestActionTrait

このトレイトは、それをインクルードしたクラスが、サブリクエストまたは、リクエストアクションを生成することを許可します。

.. php:method:: requestAction(string $url, array $options)

この関数は、すべてのロケーションからのコントローラーのアクションを呼び、
アクションからの *body* を返します。
この渡された ``$url`` は  CakePHP形式の URL (/controllername/actionname/params) です。
受け取ったコントローラーアクションに追加データを渡すために $options 配列に追加します。

.. note::

    ``requestAction()`` を ``requestAction($url, ['return']);`` オプションの中の 'return' で
    渡したレンダリングしたビュー受け取るために使えます。をto retrieve a rendered view by passing
    これは、コントローラーメソッドから  'return'  を使用して requestAction を作るために重要です。
    注意しないと、スクリプトやCSSのタグが正しく動きません。

一般的に、サブリクエストを :doc:`/views/cells` を使って送信するのを避ける事ができます。
セルは ``requestAction()`` に比べて軽い動作の再利用可能なビューコンポーネントです。


requestAction メソッドが実際に ``requestAction()`` から
生成されてインクルードされているか確かめる必要があります。確かめなかったら、
requestAction メソッドが直接望まないURLからアクセスできるようになってしまいます。

この関数を呼ぶためのシンプルな要素を生成します。::

    // src/View/Element/latest_comments.ctp
    echo $this->requestAction('/comments/latest');

この要素を出力を得たい場所ならどこにでも置けます。::

    echo $this->element('latest_comments');

この方法で書くと、要素がレンダリングされた時にはいつでも、データを取得するためにコントローラーに対して、リクエストが作られます。
そのデータは生成され、レンダリングされルーティングされます。
でも、上記の警告にしたがうと、それはエレメントキャッシュを不必要なプロセスを防ぐための使うのは一番よい方法です。
このような要素の呼出を編集するためにこうします。::

    echo $this->element('latest_comments', [], ['cache' => '+1 hour']);

``requestAction`` の呼び出しはキャッシュエレメントのビューファイルが存在し、利用可能な場合はできません。

加えて、 requestAction はURLのルーティング配列を使います::

    echo $this->requestAction(
        ['controller' => 'Articles', 'action' => 'featured']
    );

.. note::

    他の場所と違って、URL配列は文字列のURLと似ています。
    requestAction はそれらを違うものとして扱います。

このURLを基本とした配列は、 :php:meth:`Cake\\Routing\\Router::url()` が
使っているものとひつ違いがあるだけで同じです。
渡されたパラメーターを使っているなら、２つ目の配列にそれらを置き、正しいキーでラップする必要があります。
それは、 requestAction が追加のパラメーター(requestActionの第二引数）を
``request->params``のメンバ配列でマージし ``pass`` の下という正しい場所に置かないからです。
他の ``$option`` 配列の追加キーは
リクエストされたアクションの ``request->params`` プロパティーで利用可能になります。::

    echo $this->requestAction('/articles/view/5');

    requestAction の配列は次のようになります。::

    echo $this->requestAction(
        ['controller' => 'Articles', 'action' => 'view'],
        ['pass' => [5]]
    );

あなたは正しいキーを使って文字列で出来たクエリ、POSTデータ、クッキーを引数として渡せます。
クッキーは ``cookies`` キーで渡せます。
GETパラメーターは ``query`` で渡せます。POSTデータは ``post`` キーで遅れます。::

    $vars = $this->requestAction('/articles/popular', [
      'query' => ['page' = > 1],
      'cookies' => ['remember_me' => 1],
    ]);

requestAction() と併せてURL配列を使うときに
リクエストされたアクションで必要になる **全部** のパラメーターを特定する必要があります。
これは、 ``$this->request->data`` みたいにパラメーターをインクルードします。
すべての必要なパラメーターを渡すことに加えて、上記の２番目の配列に渡されなければなりません。

.. toctree::
    :glob:
    :maxdepth: 1

    /development/dispatch-filters

.. meta::
    :title lang=ja: Routing
    :keywords lang=ja: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
