JSONとXMLビュー
###############

CakePHP 2.1 には新しい二つのビュークラスがあります。 ``XmlView`` と ``JsonView``
を使うと XML と JSON のレスポンスを簡単に作成でき、
:php:class:`RequestHandlerComponent` と結合できます。

``RequestHandlerComponent`` を有効にして、 ``xml`` と ``json`` 拡張のサポートを
有効にすることで、自動的に新しいビュークラスに影響を与えることができます。 ``XmlView`` と
``JsonView`` はこのページの残りの部分でデータビューとして参照します。

データビューを生成するには二つの方法があります。一つ目は ``_serialize`` キーを使う方法です。
二つ目は、普通のビューファイルを作成する方法です。

データビューを有効にする
========================

データビュークラスを使う前に、ちょっとした設定が必要になります。:

#. :php:meth:`Router::parseExtensions()` を使って json と xml 拡張子を有効にして下さい。
   この設定によってルータが複数の拡張子をハンドリングできるようになります。
#. :php:class:`RequestHandlerComponent` をコントローラのコンポーネントリストに追加して下さい。
   この設定によってコンテンツタイプによって自動的にビュークラスが切り替わるようになります。
   また、カスタムクラスや他のデータタイプとコンテンツタイプをマッピングするために、
   ``viewClassMap`` 設定でコンポーネントをセットすることができます。

.. versionadded:: 2.3
    :php:meth:`RequestHandlerComponent::viewClassMap()` メソッドは、
    ビュークラスとタイプをマッピングするために追加されました。
    viewClassMap 設定は、以前のバージョンでは動作しません。

``Router::parseExtensions('json');`` をルータファイルに追加すると、 ``.json`` 拡張子の
リクエストを受けた時や、 ``application/json`` ヘッダを受け取った時に CakePHP は自動的に
ビュークラスを切り替えるようになります。

シリアライズキーと一緒にデータビューを使う
==========================================

``_serialize`` キーはデータビューを使っているときに他のビュー変数が
シリアライズされるべきかどうかを示している特別なビュー変数です。
データが json/xml に変換される前にカスタムフォーマッタが必要なければ、
コントローラアクションのためのビューファイルの定義を省略できます。

もしレスポンスを生成する前にビュー変数の操作や整形が必要であればビューファイルを使うべきです。
そのとき、 ``_serialize`` の値は文字列かシリアライズされるビュー変数の配列になります。::

    class PostsController extends AppController {
        public $components = array('RequestHandler');

        public function index() {
            $this->set('posts', $this->Paginator->paginate());
            $this->set('_serialize', array('posts'));
        }
    }

連結されたビュー変数の配列として ``_serialize`` を定義することも出来ます。 ::

    class PostsController extends AppController {
        public $components = array('RequestHandler');

        public function index() {
            // some code that created $posts and $comments
            $this->set(compact('posts', 'comments'));
            $this->set('_serialize', array('posts', 'comments'));
        }
    }

配列として ``_serialize`` を定義すると :php:class:`XmlView` を使っているときに
トップレベルの要素として ``<response>``  が自動で追加されるという利点があります。
もし ``_serialize`` に文字列を設定し XmlView を使っている場合、
ビュー変数が単一のトップレベル要素となっていることを確認して下さい。
単一のトップレベル要素が無いと Xml の生成は失敗するでしょう。

ビューファイルと一緒にデータビューを使う
========================================

最終出力を作成する前にビューのコンテンツに何らかの操作が必要なときにはビューファイルを使うべきです。
例えば、自動生成された HTML を含んだフィールドが posts にあったとすると、
おそらく JSON レスポンスから除外したいと思うでしょう。
このような状況でビューファイルは役立ちます。 ::

    // コントローラ コード
    class PostsController extends AppController {
        public function index() {
            $this->set(compact('posts', 'comments'));
        }
    }

    // ビューコード - app/View/Posts/json/index.ctp
    foreach ($posts as &$post) {
        unset($post['Post']['generated_html']);
    }
    echo json_encode(compact('posts', 'comments'));

もっともっと複雑な操作をすることができますし、また、整形のためにヘルパーを使うこともできます。

.. note::

    データビュークラスはレイアウトをサポートしていません。ビューファイルが
    シリアライズされたコンテンツを出力することを想定しています。

.. php:class:: XmlView

    Xml ビューデータを生成するためのクラスです。 XmlView の使い方は上記の説明を参照して下さい。

    XmlView は、 ``_serialize`` を使用する場合、デフォルトで ``<response>`` ノードで
    シリアライズされたビュー変数をラップします。このノードを ``_rootNode`` ビュー変数を
    使って名前のカスタマイズができます。

    .. versionadded:: 2.3
        ``_rootNode`` 機能が追加されました。

    ..  versionadded:: 2.6
        XmlView クラスは、XML 生成に使用するオプションをカスタマイズできる
        ``_xmlOptions`` 変数に対応しました。例） ``タグ`` vs ``要素``

.. php:class:: JsonView

    Json ビューデータを生成するためのクラスです。JsonView の使い方は上記の説明を参照して下さい。

    ..  versionadded:: 2.6
        JsonView は、 ``_jsonOptions`` ビュー変数に対応しました。
        これは、JSON を生成する時に使用されるビットマスクオプションの設定ができます。

JSONP レスポンス
================

.. versionadded:: 2.4

JsonView を使用している時、JSONP レスポンスを有効にするために特別なビュー変数
``_jsonp`` を使用できます。 ``true`` に設定することで、ビュークラスは "callback" と
名付けられたクエリ文字列パラメータが設定されると、関数名の中に json レスポンスをラップします。
もし、 "callback" の代わりに別のクエリ文字列パラメータ名を使用したい場合、 ``_jsonp`` には
``true`` の代わりに使用する名前を設定してください。
