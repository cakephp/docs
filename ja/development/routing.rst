ルーティング
##############

ルーティングはURLをどコントローラーのアクションと関連付けてマッピングするか決める機能です。
これはCakePHP でURLをより細かく柔軟に設定できるようにするために作られました。
 Apache の mod\_rewrite はルーティングのために必要でないです。しかし、これはアドレスバーを綺麗に見せます。

CakePHP でのルーティングはまた 配列による引数を文字列によるURLに変換するリバースルーティングも含みます。
リバースルーティングによって、簡単にアプリのURLの構造を全部のコードの書き直しをせずにリファクタリングできます。

.. index:: routes.php

.. _routes-configuration:

ルーティングの設定
====================

ルーティングの設定は ``app/Config/routes.php`` でできます。
このファイルは必要なルートを制御し特定のルートを指定することを許可するときに :php:class:`Dispatcher` によってインクルードされます。
リクエストが一致した時にこのファイルの中で宣言されているルートが最初から最後まで生成されます。
 この意味はルーティングの設定はどのようにルートがパースされるかにちて影響を与えるということです。
 これは頻繁アクセスするトップのルートファイルにアクセス可能な場合にルーティング（URLを切り替える）する一般的に良いアイディアです。
 リクエストと一致しないたくさんのルートをチェックする必要性をなくします。

ルートは接続先に合わせてパースされ一致させられます。
2つの似たルートを定義する場合、最初に定義されたルートがあとに定義されたものより優先されます。
接続後ルーティングを :php:meth:`Router::promote()` で設定できます。

CakePHP はまた、開発を簡単に始めるためのいくつかのデフォルトルーティングがあります。
 これらは、後でそれが必要になったときに無効化できます。無効化する方法は、
:ref:`disabling-default-routes` です。


デフォルトルーティング
===============

自分のルーティングを設定する方法を知る前に、
CakePHP がデフォルトの設定をされていることを知るべきです。
CakePHP のデフォルトルーティングはほかのアプリに比べてとても進んでいます。
一つのアクションに対して直接URLにアクション名を書くことでアクセスできます。
アクションに対してURLを使って引数も渡すことができます。 ::

        URL pattern default routes:
        http://example.com/controller/action/param1/param2/param3

 /posts/view は PostsController の view() アクションに接続することを示しています。
 それと、 /products/view\_clearance は  ProductsController の view\_clearance() アクションを示しています。
 指定したアドレスにアクションがない場合、 index() を読んでいると推定されます。

デフォルトルーティングの設定は引数をURLを使って渡すことを許可します。
 /posts/view/25 へのリクエストは、 PostsController の view(25) を呼ぶのと同じです。
 たとえば、デフォルトのルーティングはプラグインへのルーティングも提供します。
そのために、プレフィックスを使うプラグインや機能に合わせて選択します。

あらかじめ用意されているルーティングの設定は、 ``Cake/Config/routes.php`` にあります。
デフォルト設定を :term:`routes.php` を削除することによって無効化できます。


.. index:: :controller, :action, :plugin
.. _connecting-routes:

ルーティングによる接続
=====================

ルーティングを設定することで、与えられたURLに対してどのようにアプリが反応するのか決められます。
``app/Config/routes.php`` でルーティングを :php:meth:`Router::connect()` メソッドを使って設定できます。

``connect()`` メソッドは３つの引数をとります。それは、ルーティングするURL、ルーティングする対象のデフォルトの値、
正規表現でどのURLの構成要素と何の条件が一致するかを表現します。

基本のフォーマットは以下です。 ::

    Router::connect(
        'URL',
        array('default' => 'defaultValue'),
        array('option' => 'matchingRegex')
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

    Router::connect(
        '/pages/*',
        array('controller' => 'pages', 'action' => 'display')
    );

CakePHP によってあらかじめ作られている routes.php ファイルでこのルーティングは見つけられます。
このルートは ``/pages/`` ではじまるすべてのURLに一致し、それを
``PagesController();`` の ``display()`` アクションに渡します。
 この場合、 /pages/products へのリクエストは、 ``PagesController->display('products')`` に送られます。.

 加えて、``/*``　を **greedy star**  ,  ``/**`` を流れ星( **trailing star**)といいます。
 二つのアスタリスクの流れ星で値を一つ渡すURLを表現します。
 これは、 ``/``を含む値を渡す の時に使えます。 ::

    Router::connect(
        '/pages/**',
        array('controller' => 'pages', 'action' => 'show')
    );

``/pages/the-example-/-and-proof`` がURLとして渡ってきたときに、
``the-example-/-and-proof`` を引数として渡せます。

.. versionadded:: 2.1

     2.1　で　``/**`` は追加されました。

:php:meth:`Router::connect()` の第二引数は ルートの
初期値から構成されているすべての引数を生成するために使えます。
::

    Router::connect(
        '/government',
        array('controller' => 'pages', 'action' => 'display', 5)
    );

この例では、 ``connect()`` の第２引き数をデフォルトの値を定義するために使う方法を示しています。
もし、いろいろなカテゴリの製品を顧客に対して提供するサイトを作るのであれば、ルーティングすることを考えるべきです。
この例では、 ``/pages/display/5`` にアクセするために ``/government``  がURLとして使えます。。

.. note::

    デフォルトルートが動かしたままで、別のルートからも接続できます。
    これは、２つのURLからコンテンツをたどることができるようにします。
    :ref:`disabling-default-routes` はデフォルトルーティングを無効化し
    自分で定義したURLのみを使用する方法です。

ほかの一般的なルーティングの方法は、コントローラーの "エイリアス" (**ailias**)を決めることです。
``/users/some_action/5``の代わりに、 ``/cooks/some_action/5`` で同じ場所にアクセスしたい場合、
以下のように簡単にできます。 ::

    Router::connect(
        '/cooks/:action/*', array('controller' => 'users')
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

デフォルトでは、すべての命名されてw足された引数は、テンプレートと照合して展開されます。
しかしながら、必要なときにどうやってどの命名された引数がパースされて :php:meth:`Router::connectNamed()`
を使うのかを設定できます。


.. _route-elements:

ルーティングのための要素
-----------------------------------

あなたは独自のルート要素を特定し、それはそのためにどこにコントローラのアクション
のための値があるべきなのかを定義する力をあたえる。リクエストされたときに、ルート要素のための
変数がコントローラー上で ``$this->request->params`` によってみつけられる。
これは、どのように命名された引数を扱うかよりも難しい、なので、違いを記します。
命名された引数 (/controller/action/name:value) は ``$this->request->params['named']``
で見つけられ、それと比較して、カスタムルーティング要素のデータは ``$this->request->params`` で見つけられます。
カスタムルーティング要素を定義した場合、正規表現をオプションで指定できます。
これはCakePHPにどんなURLが正しいフォーマットなのかを伝えます。
正規表現を使用しなかった場合、 ``/`` 以外はすべて値の一部として扱われます。::

    Router::connect(
        '/:controller/:id',
        array('action' => 'view'),
        array('id' => '[0-9]+')
    );

この単純な例は、どうやって素早くviewアクションをすべてのコントローラからURLによって
``/controllername/:id`` のような形で呼べるようにするかを示しています。
このURLは connect() で ``:controller`` と ``:id`` という２つのルーティング要素を指定するために使われます。
 この ``:controller`` 要素は CakePHP のデフォルトルーティング要素で、URLがどのコントローラーを示しているのか識別できます。
 ``:id`` 要素はカスタムルーティング要素で、 connect() の第三引数の中で正規表現でより明確にされなければなりません。

.. note::

    ルーティング要素に使用している正規表現のパターンははすべてキャプチャーグループを含んではならない。
    もし含んでいると、正しく動きません。

一度、ルートが定義されたら、 ``/apples/5`` を呼ぶ区とは、 ``/apples/view/5`` を呼ぶことと同じになります。
両方とも、ApplesControllerの view() メソッドを呼びます。  view() メソッドの中で、
``$this->request->params['id']`` で渡されたIDにアクセスする必要がある。

アプリの中で一つのコントローラーだけがあるとき、URLにコントローラー名が含まれている必要がない。
そのときは、すべてのURLがアクション名だけで一つのコントローラーに示すことができる。
たとえば、 ``home`` コントローラーにすべてのURLでアクセスするように設定したとして、
``/home/demo`` の代わりに ``/demo``  というURLを使う場合以下の通りに設定します ::

    Router::connect('/:action', array('controller' => 'home'));

もし、大文字小文字を区別しないURLを提供したいと思ったら、正規表現の修飾子だけを使えます。::

    Router::connect(
        '/:userShortcut',
        array('controller' => 'teachers', 'action' => 'profile', 1),
        array('userShortcut' => '(?i:principal)')
    );

もう一つ例を挙げます。これができたらプロ級 ::

    Router::connect(
        '/:controller/:year/:month/:day',
        array('action' => 'index'),
        array(
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        )
    );

これは、もっとカスタマイズしています。でも、ルーティングがとても強力になったことを示しています。
このURLは４つの要素を操作しています。１番目は、なじみがあります。デフォルトのルーティング要素で
CakePHP にコントローラー名が必要なことを伝えています。

次に、デフォルト値を特定します。 コントローラーにかかわらず index() がをばれるようにしたい。

最後に、数字による"年月日"の表現と一致する正規表現を紹介します。この括り（グルーピング）は正規表現ではサポートされていません。
 ほかにも特定可能ですが上記のように　括弧でくくりません。

一回定義されたら、このル－ティングが ``/articles/2007/02/01`` , ``/posts/2004/11/16`` に一致したら、
  index() へのリクエストをそれが属するコントローラーに ``$this->request->params`` に *date* を格納して渡します。

いくつかの特別な意味を持つルーティング要素があります。
そして、特別な意味を持たせたくないなら、使ってはいけません。

* ``controller`` コントローラー名に使います。
* ``action`` アクション名に使います。
* ``plugin`` コントローラーにあるプラグイン名に使います。
* ``prefix`` :ref:`prefix-routing` のために使います。
* ``ext`` :ref:`file-extensions` ルーティングのために使います。

値をアクションに渡す
--------------------------------------

:ref:`route-elements` を使ってルーティングしている時に、ルーティング要素で
引数を渡したい時があると思います。
:php:meth:`Router::connect()` の第３引数でどのルーティング要素が引数として利用可能なのか定義できます。 ::

    // SomeController.php
    public function view($articleId = null, $slug = null) {
        // some code here...
    }

    // routes.php
    Router::connect(
        '/blog/:id-:slug', // E.g. /blog/3-CakePHP_Rocks
        array('controller' => 'blog', 'action' => 'view'),
        array(
            // order matters since this will simply map ":id" to
            // $articleId in your action
            'pass' => array('id', 'slug'),
            'id' => '[0-9]+'
        )
    );

そして今、逆ルーティングのおかげで、下記のように url 配列を渡し、ルーティングで定義されたURLをどのように整えるのか
Cakeは知ることができます。 ::

    // view.ctp
    // これは /blog/3-CakePHP_Rocks　へのリンクを返します。
    echo $this->Html->link('CakePHP Rocks', array(
        'controller' => 'blog',
        'action' => 'view',
        'id' => 3,
        'slug' => 'CakePHP_Rocks'
    ));

ルーティングごとの名前付きパラメーター
------------------------------------------------------

:php:meth:`Router::connectNamed()` を使ってグローバル空間で名前付きパラメーターをコントロール可能な間、
名前付きパラメーターのルーティングレベルでの振る舞いを``Router::connect()`` の第三引数を使って管理できます。 ::

    Router::connect(
        '/:controller/:action/*',
        array(),
        array(
            'named' => array(
                'wibble',
                'fish' => array('action' => 'index'),
                'fizz' => array('controller' => array('comments', 'other')),
                'buzz' => 'val-[\d]+'
            )
        )
    );

上記のルーティングの定義は ``named`` キーを複数の名前付きパラメーターを管理するために使っています。
いくつかのルールを紹介します。
one-by-one:

* 'wibble' は追加情報を持ちません。これは、URLがルーティングにマッチする場合、常にパースします。
* 'fish' は一つの 'action' を含む配列を持ちます。これは、indexアクションの場合に名前付きパラメーターとしてパースされます。
* 'fizz' は配列による条件指定を持ちます。しかし、二つのコントローラーを含みます。
  その意味は、どちらかのコントローラーに入ったら一致するということです。
* 'buzz' は文字列による条件指定を持ちます。 文字列は正規表現として扱われます。
  パターンに一致したときのみパースされます。

名前付き引数が使われ、用意された基準と一致しない場合、渡された引数として名前付きパラメーターのかわりに 扱われます。

.. index:: admin routing, prefix routing
.. _prefix-routing:

プレフィックスルーティング
-----------------------------------

多くのアプリケーションは特権を持ったユーザーが変更を加えられるよう
管理者領域を必要としている。 これはしばしば、特別な ``/admin/users/edit/5`` のようなURLを通してなされます。
CakePHP ではプレフィックスルーティングをコア設定ファイルで設定可能です。
このプレフィックスがルーターにどのように関連づけられているかは、
``app/Config/core.php`` で設定されます。 ::

    Configure::write('Routing.prefixes', array('admin'));

コントローラーでは、すべてのn ``admin_`` プレフィックス付きのアクションが呼ばれることがあるでしょう。
このユーザーの例を使うと、 ``/admin/users/edit/5`` にアクセスしたとき、  ``UsersController``  の ``admin_edit``
メソッドを5を第一引数として渡しながら呼びます。このとき ``app/View/Users/admin_edit.ctp`` にあるビューファイルを呼びます。
 /admin へのアクセスを page コントローラーの ``admin_index`` アクションに以下のルーティング設定を使ってマップします。::

    Router::connect(
        '/admin',
        array('controller' => 'pages', 'action' => 'index', 'admin' => true)
    );

複数のプレフィックスを使ったルーティングも設定できます。 ``Routing.prefixes``
に変数を追加設定することでできます。もしこのように設定したら、::

    Configure::write('Routing.prefixes', array('admin', 'manager'));

CakePHP は自動的に両方のプレフィックスを使用したルーティングをします。
それぞれの設定されたプレフィックスは以下のルーティングを生成します。 ::

    Router::connect(
        "/{$prefix}/:plugin/:controller",
        array('action' => 'index', 'prefix' => $prefix, $prefix => true)
    );
    Router::connect(
        "/{$prefix}/:plugin/:controller/:action/*",
        array('prefix' => $prefix, $prefix => true)
    );
    Router::connect(
        "/{$prefix}/:controller",
        array('action' => 'index', 'prefix' => $prefix, $prefix => true)
    );
    Router::connect(
        "/{$prefix}/:controller/:action/*",
        array('prefix' => $prefix, $prefix => true)
    );

admin ルーティングのように、すべてのプレフィックス付きアクションは、プレフィックス名を持っています。
 なので、 ``/manager/posts/add`` は ``PostsController::manager_add()`` に対してマップされています。.

加えて、現在のプレフィックスはコントローラーのメソッドから ``$this->request->prefix`` を通して利用可能です。

プレフィックスルーティングを使っているときは、HTMLヘルパーをプレフィックスつけることを忘れないために使うことが大事です。
これが、リンクをHTMLヘルパーで作る方法です。 ::

    // プレフィックスルーティングする
    echo $this->Html->link(
        'Manage posts',
        array('manager' => true, 'controller' => 'posts', 'action' => 'add')
    );

    // プレフィックスルーティングをやめる
    echo $this->Html->link(
        'View Post',
        array('manager' => false, 'controller' => 'posts', 'action' => 'view', 5)
    );

.. index:: plugin routing

プラグインのためのルーティング
---------------------------------------

プラグインのためのルーティングには **plugin** キーを使います。
これでプラグインに対してのリンクを作れます。そのために **plugin** を添え字にしてURLを生成する配列に追加します。::

    echo $this->Html->link(
        'New todo',
        array('plugin' => 'todo', 'controller' => 'todo_items', 'action' => 'create')
    );

逆に、現在のリクエストがプラグインに対してのリクエストだったときに、プラグインでないリンクを生成したかったら・::

    echo $this->Html->link(
        'New todo',
        array('plugin' => null, 'controller' => 'users', 'action' => 'profile')
    );

``plugin => null`` によってプラグインなしのリンクを設定できます。

.. index:: file extensions
.. _file-extensions:

拡張子
---------------

違う拡張子のファイルをルーティングで扱うためには、もう一行ルーティングの設定ファイルに追加します。::

    Router::parseExtensions('html', 'rss');

これは、一致する拡張子をすべて除去して残りをパースします。

/page/title-of-page.html みたいなURLを生成したかったら、下記のようにします。::

    Router::connect(
        '/page/:title',
        array('controller' => 'pages', 'action' => 'view'),
        array(
            'pass' => array('title')
        )
    );

そして、ルーティングに対応するリンクを生成するために、以下のようにします。 ::

    $this->Html->link(
        'Link title',
        array(
            'controller' => 'pages',
            'action' => 'view',
            'title' => 'super-article',
            'ext' => 'html'
        )
    );

拡張子が :php:class:`RequestHandlerComponent` で使われ、それによって
コンテンツタイプに合わせた自動的な振り分けがされます。
RequestHandlerComponent に詳細がありｍす。

.. _route-conditions:

ルーティング条件に一致したときの追加の条件
------------------------------------------------------------------------------

ルーティングをリクエストと環境の設定によって決まったURLのみに限定したいときがあるでしょう。
 これのよいたとえは、 :doc:`rest` ルーティングです。
 ``$defaults`` 引数で :php:meth:`Router::connect()` のための追加の条件を特定できます。
 デフォルトの CakePHP では３っつの環境条件があります。でも :ref:`custom-route-classes` を使ってもっと追加できます。
あらかじめ用意されているオプションは、 :

- ``[type]`` 特定のコンテンツタイプにマッチするか。
- ``[method]`` 特定の HTTP  動詞(**verbs**)を伴ったリクエストであるか。
- ``[server]`` $_SERVER['SERVER_NAME'] が与えられた変数に一致するか。

簡単な例をここで紹介します。  ``[method]`` オプションを
使ってRESTフルなカスタムルーティングをします。::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9]+")
    );

これは ``PUT`` リクエストのときだけに一致します。 それらの条件を設定することで、
REST ルーティングやほかのリクエストデータ依存情報をカスタマイズすることができます。

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

    CalendarsController extends AppController {
        public function view($arg1, $arg2) {
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

配列には、URLの中での並び順に合わせた数字のキーとともに値が入れられます。 ::

    debug($this->request->params['pass']);
    debug($this->passedArgs);

上記の出力は以下になります。::

    Array
    (
        [0] => recent
        [1] => mark
    )

.. note::

    $this->passedArgs は名前付きパラメーターを、渡された引数と併せて名前付きの配列として含みます。

URLを :term:`routing array` を使って生成するとき、文字列による添え字なしで配列に引数を加えます::

    array('controller' => 'posts', 'action' => 'view', 5)

``5`` は引数として渡されるときには数字キーを持ちます。

.. index:: named parameters

.. _named-parameters:

名前付きパラメーター
=================================

パラメーターに名前をつけてURLとして値を送れます。
``/posts/view/title:first/category:general`` に対するリクエストが
PostsController の view()　を呼びます。そのアクションでは、 title と category の値を引数として
``$this->params['named']`` で取り出せます。 ``$this->passedArgs`` でも取り出せます。
両方のケースでは、名前付きパラメーターにインデックスを使ってアクセスできます。
名前付きパラメーターが省略された場合それらはセットされません。are omitted, they will not be set.


.. note::

    名前付きパラメーターとしてパースされたものは、
    :php:meth:`Router::connectNamed()` によって制御されます。もし、名前付きパラメーターが逆ルーティングされていないか
    正しくパースされていれば、 :php:class:`Router` にそれらの情報を伝える必要があるでしょう。

デフォルトルーティングの例をいくつかまとめて出します。::

    URL to controller action mapping using default routes:

    URL: /monkeys/jump
    Mapping: MonkeysController->jump();

    URL: /products
    Mapping: ProductsController->index();

    URL: /tasks/view/45
    Mapping: TasksController->view(45);

    URL: /donations/view/recent/2001
    Mapping: DonationsController->view('recent', '2001');

    URL: /contents/view/chapter:models/section:associations
    Mapping: ContentsController->view();
    $this->passedArgs['chapter'] = 'models';
    $this->passedArgs['section'] = 'associations';
    $this->params['named']['chapter'] = 'models';
    $this->params['named']['section'] = 'associations';

カスタムルーティングするときに、よくある落とし穴lは名前付きパラメーターがカスタムルーティングを壊すことです。
これを解決するためには、ルーターにどのパラメーターが名前付きパラメーターと指定とされているのか伝える必要があります。
この知識なしでは、ルーターは名前付きパラメーターが本当に名前付きパラメーターなのかルーティングパラメーターなのか区別できません。
加えて、デフォルトでは、 ルーティングパラメーターであるとみなします。
名前付きパラメーターにルーティングで接続するときには、 :php:meth:`Router::connectNamed()` を使います。::

    Router::connectNamed(array('chapter', 'section'));

これは chapter（章） と section（項目） パラメーターを確実に正しくリバースルーティングするようにします。

URLを生成するときに、 :term:`routing array` を名前付きパラメーターを文字列キーが名前に一致する値として追加するために使います。 ::

    array('controller' => 'posts', 'action' => 'view', 'chapter' => 'association')

'chapter' がすべての定義されたルーティング要素に一致しなければ、名前付きパラメーターとして扱われます。

.. note::

    療法の名前付きパラメーターとルーティング要素は名前キー空間を共有します。
    これはルーティング要素と名前付きパラメーターの療法を再使用することを避けるもっともよい方法です。

名前付きパラメーターはまたURLをパースし生成するための配列をサポートします。
この文法は GET で使われる配列の文法ととても似た働きをします。URLを生成するときに以下の文法を使えます。 ::

    $url = Router::url(array(
        'controller' => 'posts',
        'action' => 'index',
        'filter' => array(
            'published' => 1,
            'frontpage' => 1
        )
    ));

``/posts/index/filter[published]:1/filter[frontpage]:1`` というURLが上記のコードで生成されます。
このパラメーターはコントローラーの passedArgs 変数に :php:meth:`Router::url` に送るために
配列として保存されパースされます。just as you sent them to ::

    $this->passedArgs['filter'] = array(
        'published' => 1,
        'frontpage' => 1
    );

配列は渡された引数と同じぐらい柔軟に深くネストできます。 ::

    $url = Router::url(array(
        'controller' => 'posts',
        'action' => 'search',
        'models' => array(
            'post' => array(
                'order' => 'asc',
                'filter' => array(
                    'published' => 1
                )
            ),
            'comment' => array(
                'order' => 'desc',
                'filter' => array(
                    'spam' => 0
                )
            ),
        ),
        'users' => array(1, 2, 3)
    ));

とても長いURLも簡単に読めるようにラップして使えます。 ::

    posts/search
      /models[post][order]:asc/models[post][filter][published]:1
      /models[comment][order]:desc/models[comment][filter][spam]:0
      /users[]:1/users[]:2/users[]:3

コントローラーに渡された配列での結果出力以下のルーターに渡された配列と一致します。 ::

    $this->passedArgs['models'] = array(
        'post' => array(
            'order' => 'asc',
            'filter' => array(
                'published' => 1
            )
        ),
        'comment' => array(
            'order' => 'desc',
            'filter' => array(
                'spam' => 0
            )
        ),
    );

.. _controlling-named-parameters:

名前付きパラメーターの制御
-----------------------------------------------

名前付きパラメーターの設定をルーティングごとまたは、全て一度に設定することができます。
``Router::connectNamed()`` ですべての設定を一土に変えられます。
下記にいくつかの名前付きパラメーターを  connectNamed() でパースして制御する例を出します。

すべての名前付きパラメーターをパースしない::

    Router::connectNamed(false);

Cakeのページネーションで使うデフォルトのパラメーターだけパースする。 ::

    Router::connectNamed(false, array('default' => true));

数字の **page** パラメーターだけパースする。::

    Router::connectNamed(
        array('page' => '[\d]+'),
        array('default' => false, 'greedy' => false)
    );

すべての **page** パラメーターをパースする::

    Router::connectNamed(
        array('page'),
        array('default' => false, 'greedy' => false)
    );

 'index' アクションが呼ばれた時、**page** パラメーターをパースする::

    Router::connectNamed(
        array('page' => array('action' => 'index')),
        array('default' => false, 'greedy' => false)
    );

  コントローラーが 'pages' で 'index' アクションが呼ばれた時、**page** パラメーターをパースする::

    Router::connectNamed(
        array('page' => array('action' => 'index', 'controller' => 'pages')),
        array('default' => false, 'greedy' => false)
    );


connectNamed() は色々なオプションをサポートしています。:

* ``greedy`` を true に設定すると、すべての名前付きパラメーターをパースするようになります。
  false にすると、接続された名前付きパラメーターだけパースします。
* ``default`` を true に設定すると、名前付きパラメーターの集合にマージされます。
* ``reset`` を true に設定すると、既存のルールを消します。
* ``separator`` 文字列を変更すると、名前付きパラメーターの区切りを変えられます。デフォルトでは `:` です。

リバースルーティング
===============

リバースルーティングは CakePHP のすべてのコードの変更なしにURLの構造を簡単に変更する機能です。
:term:`ルーティング配列 <routing array>` をURLを定義するために使えます。
 あとで変更を加えても、生成されたURLは自動的にアップデートされます。

URLを文字列によって以下のように生成します。::

    $this->Html->link('View', '/posts/view/' + $id);

``/posts`` がすべての残りのURLを通して本当に
'articles' の代わりに呼ばれるかあとで決められます。
また、リンクを以下のように定義した場合、::

    $this->Html->link(
        'View',
        array('controller' => 'posts', 'action' => 'view', $id)
    );

そして、URLを変えたいと思ったら、ルーティングを定義することでできます。
これは両方受け取るURLマッピングも生成するURLも変えます。

配列のURLを使うとき、文字列パラメーターによるクエリと、特定のキーによるドキュメントフラグメントを定義できます。::

    Router::url(array(
        'controller' => 'posts',
        'action' => 'index',
        '?' => array('page' => 1),
        '#' => 'top'
    ));

    // こんなURLが生成されます
    /posts/index?page=1#top

.. _redirect-routing:

リダイレクトルーティング
===========================

リダイレクトルーティングは入ってくるルーティングに HTTP ステータスの 30x リダイレクトを発行し違うURLに転送することができます。
これはクライアントアプリケーションにリソースが移動したことを同じコンテンツに対して２つのURLが存在することを知らせずに伝えるために使えます。

リダイレクトルーティングは通常のルーティング条件に一致した時の実際のヘッダーリダイレクトと違います。
これは、 アプリケーションかプリケーションの外に対してのリダイレクトのためにおきます。::

    Router::redirect(
        '/home/*',
        array('controller' => 'posts', 'action' => 'view'),
        // もしくは$idを引数として受け取るviewアクションデフォルトルーティングのための
        //array('persist'=>array('id'))
        array('persist' => true)
    );

``/home/*`` から ``/posts/view`` へのリダイレクトと ``/posts/view`` にパラメーターを渡すこと
配列をルートリダイレクト先を表現するために使うことで、文字列のURLがリダイレクトしている先を定義できるようにします。
文字列のURLで外部にリダイレクトできます。::

    Router::redirect('/posts/*', 'http://google.com', array('status' => 302));

これは、 ``/posts/*`` から ``http://google.com`` へwith a
HTTP  302　ステータスを出しながらリダイレクトさせます。

.. _disabling-default-routes:

デフォルトルーティングの無効化
============================

フルカスタマイズされたルーティングをして、重複するコンテンツによる検索エンジンのペナルティを回避していた場合、
 routes.php から削除することで、Cakeのデフォルトルーティングを削除することができます。

これは CakePHP 通常提供するURLに明示的にアクセスしなかった時にがエラーを吐く原因になります。

.. _custom-route-classes:

カスタムルートクラス
====================

Custom route classes allow you to extend and change how individual
routes parse requests and handle reverse routing. A custom route class
should be created in ``app/Routing/Route`` and should extend
:php:class:`CakeRoute` and implement one or both of ``match()``
and/or ``parse()``. ``parse()`` is used to parse requests and
``match()`` is used to handle reverse routing.

You can use a custom route class when making a route by using the
``routeClass`` option, and loading the file containing your route
before trying to use it::

    App::uses('SlugRoute', 'Routing/Route');

    Router::connect(
         '/:slug',
         array('controller' => 'posts', 'action' => 'view'),
         array('routeClass' => 'SlugRoute')
    );

This route would create an instance of ``SlugRoute`` and allow you
to implement custom parameter handling.

Router API
==========

.. php:class:: Router

    Router manages generation of outgoing URLs, and parsing of incoming
    request uri's into parameter sets that CakePHP can dispatch.

.. php:staticmethod:: connect($route, $defaults = array(), $options = array())

    :param string $route: A string describing the template of the route
    :param array $defaults: An array describing the default route parameters.
        These parameters will be used by default
        and can supply routing parameters that are not dynamic.
    :param array $options: An array matching the named elements in the route
        to regular expressions which that element should match. Also contains
        additional parameters such as which routed parameters should be
        shifted into the passed arguments, supplying patterns for routing
        parameters and supplying the name of a custom routing class.

    Routes are a way of connecting request URLs to objects in your application.
    At their core routes are a set of regular expressions that are used to
    match requests to destinations.

    Examples::

        Router::connect('/:controller/:action/*');

    The first parameter will be used as a controller name while the second is
    used as the action name. The '/\*' syntax makes this route greedy in that
    it will match requests like ``/posts/index`` as well as requests like
    ``/posts/edit/1/foo/bar`` . ::

        Router::connect(
            '/home-page',
            array('controller' => 'pages', 'action' => 'display', 'home')
        );

    The above shows the use of route parameter defaults. And providing routing
    parameters for a static route. ::

        Router::connect(
            '/:lang/:controller/:action/:id',
            array(),
            array('id' => '[0-9]+', 'lang' => '[a-z]{3}')
        );

    Shows connecting a route with custom route parameters as well as providing
    patterns for those parameters. Patterns for routing parameters do not need
    capturing groups, as one will be added for each route params.

    $options offers three 'special' keys. ``pass``, ``persist`` and ``routeClass``
    have special meaning in the $options array.

    * ``pass`` is used to define which of the routed parameters should be
      shifted into the pass array. Adding a parameter to pass will remove
      it from the regular route array. Ex. ``'pass' => array('slug')``

    * ``persist`` is used to define which route parameters should be automatically
      included when generating new URLs. You can override persistent parameters
      by redefining them in a URL or remove them by setting the parameter to
      ``false``. Ex. ``'persist' => array('lang')``

    * ``routeClass`` is used to extend and change how individual routes parse
      requests and handle reverse routing, via a custom routing class.
      Ex. ``'routeClass' => 'SlugRoute'``

    * ``named`` is used to configure named parameters at the route level.
      This key uses the same options as :php:meth:`Router::connectNamed()`

.. php:staticmethod:: redirect($route, $url, $options = array())

    :param string $route: A route template that dictates which URLs should
        be redirected.
    :param mixed $url: Either a :term:`routing array` or a string url
        for the destination of the redirect.
    :param array $options: An array of options for the redirect.

    Connects a new redirection Route in the router.
    See :ref:`redirect-routing` for more information.

.. php:staticmethod:: connectNamed($named, $options = array())

    :param array $named: A list of named parameters. Key value pairs are accepted where
        values are either regex strings to match, or arrays.
    :param array $options: Allows control of all settings:
        separator, greedy, reset, default

    Specifies what named parameters CakePHP should be parsing out of
    incoming URLs. By default CakePHP will parse every named parameter
    out of incoming URLs. See :ref:`controlling-named-parameters` for
    more information.

.. php:staticmethod:: promote($which = null)

    :param integer $which: A zero-based array index representing the route to move.
        For example, if 3 routes have been added, the last route would be 2.

    Promote a route (by default, the last one added) to the beginning of the list.

.. php:staticmethod:: url($url = null, $full = false)

    :param mixed $url: Cake-relative URL, like "/products/edit/92" or
        "/presidents/elect/4" or a :term:`routing array`
    :param mixed $full: If (boolean) true, the full base URL will be prepended
        to the result. If an array accepts the following keys

           * escape - used when making URLs embedded in HTML escapes query
             string '&'
           * full - if true the full base URL will be prepended.

    Generate a URL for the specified action. Returns a URL pointing
    to a combination of controller and action. $url can be:

    * Empty - the method will find the address to the actual controller/action.
    * '/' - the method will find the base URL of application.
    * A combination of controller/action - the method will find the URL for it.

    There are a few 'special' parameters that can change the final URL string that is generated:

    * ``base`` - Set to false to remove the base path from the generated URL.
      If your application is not in the root directory, this can be used to
      generate URLs that are 'CakePHP relative'. CakePHP relative URLs are
      required when using requestAction.
    * ``?`` - Takes an array of query string parameters
    * ``#`` - Allows you to set URL hash fragments.
    * ``full_base`` - If true the value of :php:meth:`Router::fullBaseUrl()` will
      be prepended to generated URLs.

.. php:staticmethod:: mapResources($controller, $options = array())

    Creates REST resource routes for the given controller(s). See
    the :doc:`/development/rest` section for more information.

.. php:staticmethod:: parseExtensions($types)

    Used in routes.php to declare which :ref:`file-extensions` your application
    supports. By providing no arguments, all file extensions will be supported.

.. php:staticmethod:: setExtensions($extensions, $merge = true)

    .. versionadded:: 2.2

    Set or add valid extensions. To have the extensions parsed, you are still
    required to call :php:meth:`Router::parseExtensions()`.

.. php:staticmethod:: defaultRouteClass($classname)

    .. versionadded:: 2.1

    Set the default route to be used when connecting routes in the future.

.. php:staticmethod:: fullBaseUrl($url = null)

    .. versionadded:: 2.4

    Get or set the baseURL used for generating URL's. When setting this value
    you should be sure to include the fully qualified domain name including
    protocol.

    Setting values with this method will also update ``App.fullBaseUrl`` in
    :php:class:`Configure`.

.. php:class:: CakeRoute

    The base class for custom routes to be based on.

.. php:method:: parse($url)

    :param string $url: The string URL to parse.

    Parses an incoming URL, and generates an array of request parameters
    that Dispatcher can act upon. Extending this method allows you to customize
    how incoming URLs are converted into an array. Return ``false`` from
    URL to indicate a match failure.

.. php:method:: match($url)

    :param array $url: The routing array to convert into a string URL.

    Attempt to match a URL array. If the URL matches the route parameters
    and settings, then return a generated string URL. If the URL doesn't
    match the route parameters, false will be returned. This method handles
    the reverse routing or conversion of URL arrays into string URLs.

.. php:method:: compile()

    Force a route to compile its regular expression.


.. meta::
    :title lang=en: Routing
    :keywords lang=en: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
