Urlヘルパー
###

.. php:namespace:: Cake\View\UrlHelper

.. php:class:: UrlHelper(View $view, array $config = [])

UrlヘルパーはURLを他のヘルパーよりも簡単に生成します。
アプリケーションのヘルパーをコアヘルパーでオーバーライドすることで
URLをカスタマイズする場を提供します。
:ref:`aliasing-helpers` に詳細があります。

URLの生成
===============

.. php:method:: build(mixed $url = NULL, boolean $full = false)

コントローラーとアクションの組み合わせを指定することでURLを生成して返します。
``$url`` が空だったら、 ``REQUEST\_URI`` を返します。そうでなかったら、コントローラーとアクションの組み合わせで
URLを生成します。 ``full`` が ``true`` だったら、結果の前にフルパスURLで返されます。::

    echo $this->Url->build([
        "controller" => "Posts",
        "action" => "view",
        "bar"
    ]);

    // Output
    /posts/view/bar

もう幾つかの役立つ例:

URLに文字列変数を渡す::

    echo $this->Url->build([
        "controller" => "Posts",
        "action" => "view",
        "foo" => "bar"
    ]);

    // Output
    /posts/view/foo:bar

拡張子の指定::

    echo $this->Url->build([
        "controller" => "Posts",
        "action" => "list",
        "_ext" => "rss"
    ]);

    // Output
    /posts/list.rss

ドメインの直後に ('/' で開始する)　文字列を追加したURLを生成する。 ::

    echo $this->Url->build('/posts', true);

    // Output
    http://somedomain.com/posts

URL の末尾に GET と名前付きアンカーを生成::

    echo $this->Url->build([
        "controller" => "Posts",
        "action" => "search",
        "?" => ["foo" => "bar"],
        "#" => "first"
    ]);

    // Output
    /posts/search?foo=bar#first

ルーティング::

    echo $this->Url->build(['_name' => 'product-page', 'slug' => 'i-m-slug']);

    // Assuming route is setup like:
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

詳細はAPIの `Router::url <http://api.cakephp.org/3.0/class-Cake.Routing.Router.html#_url>`_ にて.

.. meta::
    :title lang=ja: Urlヘルパー
    :description lang=ja: UrlヘルパーはURLの生成を簡単にする。
    :keywords lang=ja: urlヘルパー,url,ヘルパー,URLヘルパー
