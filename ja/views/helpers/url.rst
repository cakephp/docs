Url
###

.. php:namespace:: Cake\View\Helper

.. php:class:: UrlHelper(View $view, array $config = [])

UrlHelper は他のヘルパーから URL を生成することが容易になります。
アプリケーションのヘルパーでコアヘルパーをオーバーライドすることによって URL の生成方法を
カスタマイズする単一の場所を提供します。このやり方は :ref:`aliasing-helpers`
セクションをご覧ください。

URL の生成
==========

.. php:method:: build(mixed $url = null, boolean|array $full = false)

コントローラーとアクションの組み合わせを指定することで URL を生成して返します。
``$url`` が空の場合、 ``REQUEST\_URI`` を返します。そうでない場合、
コントローラーとアクションの組み合わせで URL を生成します。
``full`` が ``true`` の場合、結果がフルベース URL で返されます。 ::

    echo $this->Url->build([
        "controller" => "Posts",
        "action" => "view",
        "bar"
    ]);

    // 出力結果
    /posts/view/bar

さらにいつかの使用例は、こちら:

拡張子つきの URL::

    echo $this->Url->build([
        "controller" => "Posts",
        "action" => "list",
        "_ext" => "rss"
    ]);

    // 出力結果
    /posts/list.rss

フルベース URL を前につけた ('/' から始まる) URL::

    echo $this->Url->build('/posts', true);

    // 出力結果
    http://somedomain.com/posts

GET パラメータとフラグメントアンカーの URL::

    echo $this->Url->build([
        "controller" => "Posts",
        "action" => "search",
        "?" => ["foo" => "bar"],
        "#" => "first"
    ]);

    // 出力結果
    /posts/search?foo=bar#first

上記の例で使用している ``?`` キーは、あなたが使用しているクエリ文字列パラメータを
明示したい場合やクエリ文字列パラメータをあなたのルートプレースホルダーの一つと名前を
共有したい場合に便利です。

名前付きルートの URL::

    echo $this->Url->build(['_name' => 'product-page', 'slug' => 'i-m-slug']);

    // 以下のようにルートをセットアップすることを仮定:
    // $router->connect(
    //     '/products/:slug',
    //     [
    //         'controller' => 'Products',
    //         'action' => 'view'
    //     ],
    //     [
    //         '_name' => 'product-page'
    //     ]
    // );
    /products/i-m-slug

第２パラメータは、HTML エスケープやベースパスを追加するかどうかを制御するオプションを
定義できます。 ::

    $this->Url->build('/posts', [
        'escape' => false,
        'fullBase' => true
    ]);

.. versionadded:: 3.3.5
    ``build()`` は、3.3.5 より第２引数として配列を受け取ります。

CSS や JavaScript、または画像ファイルの URL を生成する場合、
これらのアセットタイプのためのヘルパーメソッドがあります。 ::

    // 出力結果 /img/icon.png
    $this->Url->image('icon.png');

    // 出力結果 /js/app.js
    $this->Url->script('app.js');

    // 出力結果 /css/app.css
    $this->Url->css('app.css');

.. versionadded:: 3.2.4
    アセットヘルパーメソッドは 3.2.4 で追加されました。

詳細は API の
`Router::url <https://api.cakephp.org/3.x/class-Cake.Routing.Router.html#_url>`_
を確認してください。

.. meta::
    :title lang=ja: Urlヘルパー
    :description lang=ja: UrlヘルパーはURLの生成を簡単にする。
    :keywords lang=ja: urlヘルパー,url,ヘルパー,URLヘルパー
