JSONとXMLビュー 
###############

CakePHP2.1には新しい二つのビュークラスがあります。 ``XmlView`` と ``JsonView`` を使うとXMLとJSONのレスポンスを簡単に作成でき、
:php:class:`RequestHandlerComponent` と結合できます。

``RequestHandlerComponent`` を有効にして、``xml`` と ``json`` 拡張のサポートを有効にすることで、
自動的に新しいビュークラスに影響を与えることができます。 ``XmlView`` と ``JsonView`` はこのページの残りの部分でデータビューとして参照します。

データビューを生成するには二つの方法があります。一つ目は ``_serialize`` キーを使う方法です。
二つ目は、普通のビューファイルを作成する方法です。

データビューを有効にする 
========================

データビュークラスを使う前に、ちょっとした設定が必要になります。:

#. :php:meth:`Router::parseExtensions()` を使ってjsonとxml拡張子を有効にして下さい。
   この設定によってルータが複数の拡張子をハンドリングできるようになります。
#. :php:class:`RequestHandlerComponent` をコントローラのコンポーネントリストに追加して下さい。
   この設定によってコンテンツのタイプによって自動的にビュークラスが切り替わるようになります。 

``Router::parseExtensions('json');`` をルータファイルに追加すると、``.json`` 拡張子のリクエストを受けた時や、
``application/json`` ヘッダを受け取った時にCakePHPは自動的にビュークラスを切り替えるようになります。 

シリアライズキーと一緒にデータビューを使う 
==========================================

``_serialize`` キーはデータビューを使っているときに他のビュー変数がシリアライズされるべきかどうかを示している特別なビュー変数です。
データがjson/xmlに変換される前にカスタムフォーマッタが必要なければ、コントローラアクションのためのビューファイルの定義を省略できます。

もしレスポンスを生成する前にビュー変数の操作や整形が必要であればビューファイルを使うべきです。
そのとき、 ``_serialize`` の値は文字列かシリアライズされるビュー変数の配列になります。::

    class PostsController extends AppController {
        public function index() {
            $this->set('posts', $this->paginate());
            $this->set('_serialize', array('posts'));
        }
    }

連結されたビュー変数の配列として ``_serialize`` を定義することも出来ます。::

    class PostsController extends AppController {
        public function index() {
            // some code that created $posts and $comments
            $this->set(compact('posts', 'comments'));
            $this->set('_serialize', array('posts', 'comments'));
        }
    }

配列として ``_serialize`` を定義すると :php:class:`XmlView` を使っているときにトップレベルの要素として
``<response>``  が自動で追加されるという利点があります。もし ``_serialize`` に文字列を設定しXmlViewを使っている場合、
ビュー変数が単一のトップレベル要素となっていることを確認して下さい。単一のトップレベル要素が無いとXmlの生成は失敗するでしょう。

ビューファイルと一緒にデータビューを使う
========================================

最終出力を作成する前にビューのコンテンツに何らかの操作が必要なときにはビューファイルを使うべきです。
例えば、自動生成されたHTMLを含んだフィールドがpostsにあったとすると、
おそらくJSONレスポンスから除外したいと思うでしょう。このような状況でビューファイルは役立ちます。::

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

    データビュークラスはレイアウトをサポートしていません。ビューファイルがシリアライズされたコンテンツを出力することを想定しています。

.. php:class:: XmlView

    Xmlビューデータを生成するためのクラスです。XmlViewの使い方は上記の説明を参照して下さい。

.. php:class:: JsonView

    Jsonビューデータを生成するためのクラスです。JsonViewの使い方は上記の説明を参照して下さい。

