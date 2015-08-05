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

``Router`` provides two interfaces for connecting routes. The static method is
a backwards compatible interface, while the scoped builders offer more terse
syntax when building multiple routes, and better performance.

This will execute the index method in the ``ArticlesController`` when the homepage
of your site is visited. Sometimes you need dynamic routes that will accept
multiple parameters, this would be the case, for example of a route for viewing
an article's content::

    Router::connect('/articles/*', ['controller' => 'Articles', 'action' => 'view']);

The above route will accept any URL looking like ``/articles/15`` and invoke the
method ``view(15)`` in the ``ArticlesController``. This will not, though,
prevent people from trying to access URLs looking like ``/articles/foobar``. If
you wish, you can restring some parameters to conform to a regular expression::

    Router::connect(
        '/articles/:id',
        ['controller' => 'Articles', 'action' => 'view'],
        ['id' => '\d+', 'pass' => ['id']]
    );

The previous example changed the star matcher by a new placeholder ``:id``.
Using placeholders allows us to validate parts of the URL, in this case we used
the ``\d+`` regular expression so that only digits are matched. Finally, we told
the Router to treat the ``id`` placeholder as a function argument to the
``view()`` function by specifying the ``pass`` option. More on using this
options later.

The CakePHP Router can also reverse match routes. That means that from an
array containing matching parameters, it is capable of generation a URL string::

    use Cake\Routing\Router;

    echo Router::url(['controller' => 'Articles', 'action' => 'view', 'id' => 15]);
    // Will output
    /articles/15

Routes can also be labelled with a unique name, this allows you to quickly
reference them when building links instead of specifying each of the routing
parameters::

    use Cake\Routing\Router;

    Router::connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    echo Router::url(['_name' => 'login']);
    // Will output
    /login

To help keep your routing code DRY, the Router has the concept of 'scopes'.
A scope defines a common path segment, and optionally route defaults. Any routes
connected inside a scope will inherit the path/defaults from their wrapping
scopes::

    Router::scope('/blog', ['plugin' => 'Blog'], function ($routes) {
        $routes->connect('/', ['controller' => 'Articles']);
    });

The above route would match ``/blog/`` and send it to
``Blog\Controller\ArticlesController::index()``.

The application skeleton comes with a few routes to get you started. Once you've
added your own routes, you can remove the default routes if you don't need them.

.. index:: :controller, :action, :plugin
.. index:: greedy star, trailing star
.. _connecting-routes:
.. _routes-configuration:

ルーティングによる接続
========================

.. php:staticmethod:: connect($route, $defaults = [], $options = [])

To keep your code :term:`DRY` you should use 'routing scopes'. Routing
scopes not only let you keep your code DRY, they also help Router optimize its
operation. As seen above you can also use ``Router::connect()`` to connect
routes. This method defaults to the ``/`` scope. To create a scope and connect
some routes we'll use the ``scope()`` method::

    // In config/routes.php
    Router::scope('/', function ($routes) {
        $routes->fallbacks('DashedRoute');
    });

the URL template you wish
to match, the default values for your route elements, and the options for the
route.

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

CakePHP does not automatically produce lowercased and dashed URLs when using the
``:controller`` parameter. If you need this, the above example could be
rewritten like so::

    $routes->connect(
        '/:controller/:id',
        ['action' => 'view'],
        ['id' => '[0-9]+', 'routeClass' => 'DashedRoute']
    );

The ``DashedRoute`` class will make sure that the ``:controller`` and
``:plugin`` parameters are correctly lowercased and dashed.

If you need lowercased and underscored URLs while migrating from a CakePHP
2.x application, you can instead use the ``InflectedRoute`` class.

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
* ``_base`` Set to ``false`` to remove the base path from the generated URL. If
  your application is not in the root directory, this can be used to generate
  URLs that are 'cake relative'. cake relative URLs are required when using
  requestAction.
* ``_scheme``  Set to create links on different schemes like `webcal` or `ftp`.
  Defaults to the current scheme.
* ``_host`` Set the host to use for the link.  Defaults to the current host.
* ``_port`` Set the port if you need to create links on non-standard ports.
* ``_full``  If ``true`` the `FULL_BASE_URL` constant will be prepended to
  generated URLs.
* ``#`` Allows you to set URL hash fragments.
* ``_ssl`` Set to ``true`` to convert the generated URL to https or ``false``
  to force http.
* ``_method`` Define the HTTP verb/method to use. Useful when working with
  :ref:`resource-routes`.
* ``_name`` Name of route. If you have setup named routes, you can use this key
  to specify it.

値をアクションに渡す
--------------------------------------

:ref:`route-elements` を使ってルーティングしている時に、ルーティング要素で
引数を渡したい時があると思います。The ``pass`` option whitelists which route
elements should also be made available as arguments passed into the controller
functions::

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
                // Define the route elements in the route template
                // to pass as function arguments. Order matters since this
                // will simply map ":id" to $articleId in your action
                'pass' => ['id', 'slug'],
                // Define a pattern that `id` must match.
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

    // You can also used numerically indexed parameters.
    echo $this->Html->link('CakePHP Rocks', [
        'controller' => 'Blog',
        'action' => 'view',
        3,
        'CakePHP_Rocks'
    ]);

.. _named-routes:

Using Named Routes
------------------

Sometimes you'll find typing out all the URL parameters for a route too verbose,
or you'd like to take advantage of the performance improvements that named routes
have. When connecting routes you can specifiy a ``_name`` option, this option
can be used in reverse routing to identify the route you want to use::

    // Connect a route with a name.
    $routes->connect(
        '/login',
        ['controller' => 'Users', 'action' => 'login'],
        ['_name' => 'login']
    );

    // Generate a URL using a named route.
    $url = Router::url(['_name' => 'login']);

    // Generate a URL using a named route,
    // with some query string args.
    $url = Router::url(['_name' => 'login', 'username' => 'jimmy']);

If your route template contains any route elements like ``:controller`` you'll
need to supply those as part of the options to ``Router::url()``.

.. note::

    Route names must be unique across your entire application. The same
    ``_name`` cannot be used twice, even if the names occur inside a different
    routing scope.

When building named routes, you will probably want to stick to some conventions
for the route names. CakePHP makes building up route names easier by allowing
you to define name prefixes in each scope::

    Router::scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
        // This route's name will be `api:ping`
        $routes->connect('/ping', ['controller' => 'Pings'], ['_name' => 'ping']);
    });
    // Generate a URL for the ping route
    Router::url(['_name' => 'api:ping']);

    // Use namePrefix with plugin()
    Router::plugin('Contacts', ['_namePrefix' => 'contacts:'], function ($routes) {
        // Connect routes.
    });

    // Or with prefix()
    Router::prefix('Admin', ['_namePrefix' => 'admin:'], function ($routes) {
        // Connect routes.
    });

You can also use the ``_namePrefix`` option inside nested scopes and it works as
you'd expect::

    Router::plugin('Contacts', ['_namePrefix' => 'contacts:', function ($routes) {
        $routes->scope('/api', ['_namePrefix' => 'api:'], function ($routes) {
            // This route's name will be `contacts:api:ping`
            $routes->connect('/ping', ['controller' => 'Pings'], ['_name' => 'ping']);
        });
    });

    // Generate a URL for the ping route
    Router::url(['_name' => 'contacts:api:ping']);

Routes connected in named scopes will only have names added if the route is also
named. Nameless routes will not have the ``_namePrefix`` applied to them.

.. versionadded:: 3.1
    The ``_namePrefix`` option was added in 3.1

.. index:: admin routing, prefix routing
.. _prefix-routing:

プレフィックスルーティング
-----------------------------------

.. php:staticmethod:: prefix($name, $callback)

多くのアプリケーションは特権を持ったユーザーが変更を加えられるよう
管理者領域を必要としている。 これはしばしば、特別な ``/admin/users/edit/5`` のようなURLを通してなされます。
 In CakePHP, prefix routing
can be enabled by using the ``prefix`` scope method::

    Router::prefix('admin', function ($routes) {
        // All routes here will be prefixed with `/admin`
        // And have the prefix => admin route element added.
        $routes->fallbacks('DashedRoute');
    });

Prefixes are mapped to sub-namespaces in your application's ``Controller``
namespace. By having prefixes as separate controllers you can create smaller and
simpler controllers. Behavior that is common to the prefixed and non-prefixed
controllers can be encapsulated using inheritance,
:doc:`/controllers/components`, or traits.
このユーザーの例を使うと、 ``/admin/users/edit/5`` にアクセスしたとき、
 **src/Controller/Admin/UsersController.php**  の ``edit()``
メソッドを5を第一引数として渡しながら呼びます。
ビューファイルは、 **src/Template/Admin/Users/edit.ctp** が使われます。

/admin へのアクセスを page コントローラーの ``admin_index`` アクションに以下のルーティング設定を使ってマップします。::

    Router::prefix('admin', function ($routes) {
        // Because you are in the admin scope,
        // you do not need to include the /admin prefix
        // or the admin route element.
        $routes->connect('/', ['controller' => 'Pages', 'action' => 'index']);
    });

プレフィックスルーティングをするときに、 ``$options`` 引数で、追加のルーティングを設定できます。::

    Router::prefix('admin', ['param' => 'value'], function ($routes) {
        // Routes connected here are prefixed with '/admin' and
        // have the 'param' routing key set.
        $routes->connect('/:controller');
    });

You can define prefixes inside plugin scopes as well::

    Router::plugin('DebugKit', function ($routes) {
        $routes->prefix('admin', function ($routes) {
            $routes->connect('/:controller');
        });
    });

The above would create a route template like ``/debug_kit/admin/:controller``.
The connected route would have the ``plugin`` and ``prefix`` route elements set.

When defining prefixes, you can nest multiple prefixes if necessary::

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

    You should connect prefix routes *before* you connect fallback routes.

.. index:: plugin routing

プラグインのためのルーティング
---------------------------------------

.. php:staticmethod:: plugin($name, $options = [], $callback)

Routes for :doc:`/plugins` are most easily created using the ``plugin()``
method. This method creates a new routing scope for the plugin's routes::

    Router::plugin('DebugKit', function ($routes) {
        // Routes connected here are prefixed with '/debug_kit' and
        // have the plugin route element set to 'DebugKit'.
        $routes->connect('/:controller');
    });

When creating plugin scopes, you can customize the path element used with the
``path`` option::

    Router::plugin('DebugKit', ['path' => '/debugger'], function ($routes) {
        // Routes connected here are prefixed with '/debugger' and
        // have the plugin route element set to 'DebugKit'.
        $routes->connect('/:controller');
    });

When using scopes you can nest plugin scopes within prefix scopes::

    Router::prefix('admin', function ($routes) {
        $routes->plugin('DebugKit', function ($routes) {
            $routes->connect('/:controller');
        });
    });

The above would create a route that looks like ``/admin/debug_kit/:controller``.
It would have the ``prefix``, and ``plugin`` route elements set.

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

SEO-Friendly Routing
--------------------

Some developers prefer to use dashes in URLs, as it's perceived to give
better search engine rankings. The ``DashedRoute`` class can be used in your
application with the ability to route plugin, controller, and camelized action
names to a dashed URL.

For example, if we had a ``ToDo`` plugin, with a ``TodoItems`` controller, and a
``showItems()`` action, it could be accessed at ``/to-do/todo-items/show-items``
with the following router connection::

    Router::plugin('ToDo', ['path' => 'to-do'], function ($routes) {
        $routes->fallbacks('DashedRoute');
    });

.. index:: file extensions
.. _file-extensions:

Routing File Extensions
-----------------------

.. php:staticmethod:: extensions(string|array|null $extensions, $merge = true)

違う拡張子のファイルをルーティングで扱うためには、もう一行ルーティングの設定ファイルに追加します。::

    Router::extensions(['html', 'rss']);

This will enable the named extensions for all routes connected **after** this
method call. Any routes connected prior to it will not inherit the extensions.
By default the extensions you passed will be merged with existing list of
extensions. You can pass ``false`` for the second argument to override existing
list. Calling the method without arguments will return existing list of
extensions. You can set extensions per scope as well::

    Router::scope('/api', function ($routes) {
        $routes->extensions(['json', 'xml']);
    });

.. note::

    Setting the extensions should be the first thing you do in a scope, as the
    extensions will only be applied to routes connected **after** the extensions
    are set.

By using extensions, you tell the router to remove any matching file extensions,
and then parse what remains. If you want to create a URL such as
/page/title-of-page.html you would create your route using::

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

Creating RESTful Routes
=======================

.. php:staticmethod:: mapResources($controller, $options)

Router makes it easy to generate RESTful routes for your controllers. RESTful
routes are helpful when you are creating API endpoints for your application.  If
we wanted to allow REST access to a recipe controller, we'd do something like
this::

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

Creating Nested Resource Routes
-------------------------------

Once you have connected resources in a scope, you can connect routes for
sub-resources as well. Sub-resource routes will be prepended by the original
resource name and a id parameter. For example::

    Router::scope('/api', function ($routes) {
        $routes->resources('Articles', function ($routes) {
            $routes->resources('Comments');
        });
    });

Will generate resource routes for both ``articles`` and ``comments``. The
comments routes will look like::

    /api/articles/:article_id/comments
    /api/articles/:article_id/comments/:id

You can get the ``article_id`` in ``CommentsController`` by::

    $this->request->params['article_id']

.. note::

    While you can nest resources as deeply as you require, it is not recommended
    to nest more than 2 resources together.

Limiting the Routes Created
---------------------------

By default CakePHP will connect 6 routes for each resource. If you'd like to
only connect specific resource routes you can use the ``only`` option::

    $routes->resources('Articles', [
        'only' => ['index', 'view']
    ]);

Would create read only resource routes. The route names are ``create``,
``update``, ``view``, ``index``, and ``delete``.

Changing the Controller Actions Used
------------------------------------

You may need to change the controller action names that are used when connecting
routes. For example, if your ``edit()`` action is called ``update()`` you can
use the ``actions`` key to rename the actions used::

    $routes->resources('Articles', [
        'actions' => ['edit' => 'update', 'add' => 'create']
    ]);

The above would use ``update()`` for the ``edit()`` action, and ``create()``
instead of ``add()``.

Mapping Additional Resource Routes
----------------------------------

You can map additional resource methods using the ``map`` option::

     $routes->resources('Articles', [
        'map' => [
            'deleteAll' => [
                'action' => 'deleteAll',
                'method' => 'DELETE'
            ]
        ]
     ]);
     // This would connect /articles/deleteAll

In addition to the default routes, this would also connect a route for
`/articles/delete_all`. By default the path segment will match the key name. You
can use the 'path' key inside the resource definition to customize the path
name::


    $routes->resources('Articles', [
        'map' => [
            'updateAll' => [
                'action' => 'updateAll',
                'method' => 'DELETE',
                'path' => '/update_many'
            ],
        ]
    ]);
    // This would connect /articles/update_many

If you define 'only' and 'map', make sure that your mapped methods are also in
the 'only' list.

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

Router will also convert any unknown parameters in a routing array to
querystring parameters.  The ``?`` is offered for backwards compatibility with
older versions of CakePHP.

You can also use any of the special route elements when generating URLs:

* ``_ext`` Used for :ref:`file-extensions` routing.
* ``_base`` Set to ``false`` to remove the base path from the generated URL. If
  your application is not in the root directory, this can be used to generate
  URLs that are 'cake relative'.  cake relative URLs are required when using
  requestAction.
* ``_scheme``  Set to create links on different schemes like ``webcal`` or
  ``ftp``. Defaults to the current scheme.
* ``_host`` Set the host to use for the link.  Defaults to the current host.
* ``_port`` Set the port if you need to create links on non-standard ports.
* ``_full``  If ``true`` the ``FULL_BASE_URL`` constant will be prepended to
  generated URLs.
* ``_ssl`` Set to ``true`` to convert the generated URL to https or ``false``
  to force http.
* ``_name`` Name of route. If you have setup named routes, you can use this key
  to specify it.

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

* Route classes are expected to be found in the ``Routing\\Route`` namespace of
  your application or plugin.
* ルートクラス  :php:class:`Cake\\Routing\\Route` を拡張します。
* ルートクラスは  ``match()`` と ``parse()``の一方もしくは両方を使います。

The ``parse()`` method is used to parse an incoming URL. It should generate an
array of request parameters that can be resolved into a controller & action.
Return ``false`` from this method to indicate a match failure.

The ``match()`` method is used to match an array of URL parameters and create a
string URL. If the URL parameters do not match the route ``false`` should be
returned.

カスタムルーティングクラスを ``routeClass`` オプションを使って設定することができます。:

    $routes->connect(
         '/:slug',
         ['controller' => 'Articles', 'action' => 'view'],
         ['routeClass' => 'SlugRoute']
    );

このルーティングは ``SlugRoute`` のインスタンスを生成し、任意のパラメーター制御を提供します。
You can use plugin route classes using
standard :term:`plugin syntax`.

Default Route Class
-------------------

.. php:staticmethod:: defaultRouteClass($routeClass = null)

If you want to use an alternate route class for all your routes besides the
default ``Route``, you can do so by calling ``Router::defaultRouteClass()``
before setting up any routes and avoid having to specify the ``routeClass``
option for each route. For example using::

    Router::defaultRouteClass('InflectedRoute');

will cause all routes connected after this to use the ``DashedRoute`` route class.
Calling the method without an argument will return current default route class.

Fallbacks Method
----------------

.. php:method:: fallbacks($routeClass = null)

The fallbacks method is a simple shortcut for defining default routes. The
method uses the passed routing class for the defined rules or if no class is
provided the class returned by ``Router::defaultRouteClass()`` is used.

Calling fallbacks like so::

    $routes->fallbacks('DashedRoute');

Is equivalent to the following explicit calls::

    $routes->connect('/:controller', ['action' => 'index'], ['routeClass' => 'DashedRoute']);
    $routes->connect('/:controller/:action/*', [], , ['routeClass' => 'DashedRoute']);

.. note::

    Using the default route class (``Route``) with fallbacks, or any route
    with ``:plugin`` and/or ``:controller`` route elements will result in
    inconsistent URL case.

Creating Persistent URL Parameters
==================================

You can hook into the URL generation process using URL filter functions. Filter
functions are called *before* the URLs are matched against the routes, this
allows you to prepare URLs before routing.

Callback filter functions should expect the following parameters:

- ``$params`` The URL params being processed.
- ``$request`` The current request.

The URL filter function should *always* return the params even if unmodified.

URL filters allow you to easily implement features like persistent parameters::

    Router::addUrlFilter(function ($params, $request) {
        if (isset($request->params['lang']) && !isset($params['lang'])) {
            $params['lang'] = $request->params['lang'];
        }
        return $params;
    });

Filter functions are applied in the order they are connected.

Handling Named Parameters in URLs
=================================

Although named parameters were removed in CakePHP 3.0, applications may have
published URLs containing them.  You can continue to accept URLs containing
named parameters.

In your controller's ``beforeFilter()`` method you can call
``parseNamedParams()`` to extract any named parameters from the passed
arguments::

    public function beforeFilter()
    {
        parent::beforeFilter();
        Router::parseNamedParams($this->request);
    }

This will populate ``$this->request->params['named']`` with any named parameters
found in the passed arguments.  Any passed argument that was interpreted as a
named parameter, will be removed from the list of passed arguments.

.. _request-action:

RequestActionTrait
==================

.. php:trait:: RequestActionTrait

    This trait allows classes which include it to create sub-requests or
    request actions.

.. php:method:: requestAction(string $url, array $options)

    This function calls a controller's action from any location and
    returns the response body from the action. The ``$url`` passed is a
    CakePHP-relative URL (/controllername/actionname/params). To pass
    extra data to the receiving controller action add to the $options
    array.

    .. note::

        You can use ``requestAction()`` to retrieve a rendered view by passing
        'return' in the options: ``requestAction($url, ['return']);``. It is
        important to note that making a requestAction using 'return' from
        a controller method may cause script and css tags to not work correctly.

    Generally you can avoid dispatching sub-requests by using
    :doc:`/views/cells`. Cells give you a lightweight way to create re-usable
    view components when compared to ``requestAction()``.

    You should always include checks to make sure your requestAction methods are
    actually originating from ``requestAction()``.  Failing to do so will allow
    requestAction methods to be directly accessible from a URL, which is
    generally undesirable.

    If we now create a simple element to call that function::

        // src/View/Element/latest_comments.ctp
        echo $this->requestAction('/comments/latest');

    We can then place that element anywhere to get the output
    using::

        echo $this->element('latest_comments');

    Written in this way, whenever the element is rendered, a request will be
    made to the controller to get the data, the data will be processed, rendered
    and returned. However in accordance with the warning above it's best to make
    use of element caching to prevent needless processing. By modifying the call
    to element to look like this::

        echo $this->element('latest_comments', [], ['cache' => '+1 hour']);

    The ``requestAction`` call will not be made while the cached
    element view file exists and is valid.

    In addition, requestAction takes routing array URLs::

        echo $this->requestAction(
            ['controller' => 'Articles', 'action' => 'featured']
        );

    .. note::

        Unlike other places where array URLs are analogous to string URLs,
        requestAction treats them differently.

    The URL based array are the same as the ones that
    :php:meth:`Cake\\Routing\\Router::url()` uses with one difference - if you
    are using passed parameters, you must put them in a second array and wrap
    them with the correct key. This is because requestAction merges the extra
    parameters (requestAction's 2nd parameter) with the ``request->params``
    member array and does not explicitly place them under the ``pass`` key. Any
    additional keys in the ``$option`` array will be made available in the
    requested action's ``request->params`` property::

        echo $this->requestAction('/articles/view/5');

    As an array in the requestAction would then be::

        echo $this->requestAction(
            ['controller' => 'Articles', 'action' => 'view'],
            ['pass' => [5]]
        );

    You can also pass querystring arguments, post data or cookies using the
    appropriate keys. Cookies can be passed using the ``cookies`` key.
    Get parameters can be set with ``query`` and post data can be sent
    using the ``post`` key::

        $vars = $this->requestAction('/articles/popular', [
          'query' => ['page' = > 1],
          'cookies' => ['remember_me' => 1],
        ]);

    When using an array URL in conjunction with requestAction() you
    must specify **all** parameters that you will need in the requested
    action. This includes parameters like ``$this->request->data``.  In addition
    to passing all required parameters, passed arguments must be done
    in the second array as seen above.

.. toctree::
    :glob:
    :maxdepth: 1

    /development/dispatch-filters

.. meta::
    :title lang=en: Routing
    :keywords lang=en: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
