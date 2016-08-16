REST
####

最近のアプリケーションプログラマーは、サービスのコア機能を
ユーザにオープンにする必要があると気付き始めています。
簡単に提供でき、自由にコアAPIにアクセスできれば、広く受け入れられ、
マッシュアップされたり、簡単に他のシステムと統合できます。

簡単にあなたの作ったアプリケーションロジックにアクセスさせる方法は色々ありますが、
REST はその中でもすばらしい方法でしょう。とてもシンプルで、大抵は XML ベース
(SOAP のようなものではなく、単純な XML のこと) で、HTTP ヘッダによって制御されます。
CakePHP を使って REST の API を提供するのはすごく簡単です。

簡単なセットアップ
==================

REST を動かすための手っ取り早い方法は、 app/Config/routes.php ファイルに数行追記することです。
Router オブジェクトは、 ``mapResources()`` というメソッドを提供していて、
これはコントローラへの REST アクセスのために、いくつかのデフォルトルートを設定するものです。
``mapResources()`` は、routes.php の最後にある
``require CAKE . 'Config' . DS . 'routes.php';`` の記述や、
routes をオーバーライドする他の routes よりも前に呼び出す必要があります。
例えば、レシピ (recipe) データベースにアクセスする REST は、下記のようにします ::

    //In app/Config/routes.php...

    Router::mapResources('recipes');
    Router::parseExtensions();

最初の行は、簡単に REST アクセス可能にするために、いくつかのデフォルトルートをセットしています。
``parseExtensions()`` メソッドで、最終的に受け取りたいフォーマット (例えば xml, json, rss) の
指定が必要です。これらのルーティングは、HTTP リクエストメソッドに対応しています。

=========== ===================== ==============================
HTTP format URL format            対応するコントローラアクション
=========== ===================== ==============================
GET         /recipes.format       RecipesController::index()
----------- --------------------- ------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- ------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- ------------------------------
POST        /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
=========== ===================== ==============================

CakePHP のルータクラスは、いくつかの異なる方法で HTTP リクエストメソッドを判定します。
下記がその判定順序です。

#. POSTリクエストの中で、 *\_method* が存在する場合それを利用
#. X\_HTTP\_METHOD\_OVERRIDE
#. REQUEST\_METHOD ヘッダ

POST リクエストの中の、 *\_method* の値を使う方法は、ブラウザを使った REST クライアントの場合に
便利です。単純に POST メソッドの中で、\_method キーの値に HTTP メソッド名を入れるだけです。

ルータが REST リクエストを、コントローラのアクションにマッピングすると、
そのアクションに移動します。基本的なコントローラのサンプルは下記のようになります ::

    // Controller/RecipesController.php
    class RecipesController extends AppController {

        public $components = array('RequestHandler');

        public function index() {
            $recipes = $this->Recipe->find('all');
            $this->set(array(
                'recipes' => $recipes,
                '_serialize' => array('recipes')
            ));
        }

        public function view($id) {
            $recipe = $this->Recipe->findById($id);
            $this->set(array(
                'recipe' => $recipe,
                '_serialize' => array('recipe')
            ));
        }

        public function add() {
            $this->Recipe->create();
            if ($this->Recipe->save($this->request->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }

        public function edit($id) {
            $this->Recipe->id = $id;
            if ($this->Recipe->save($this->request->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }

        public function delete($id) {
            if ($this->Recipe->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }
    }

:php:meth:`Router::parseExtensions()` の呼出しを追加したので、
ルータはリクエストの種類ごとに異なるビューファイルを扱います。
REST リクエストが処理できるようになったので、XML ビューなどが作成できます。
CakePHP に標準搭載している JSON ビュー ( :doc:`/views/json-and-xml-views` ) も簡単に扱えます。
:php:class:`XmlView` を扱うために、 ``_serialize`` というビュー変数を定義します。
この特別なビュー変数は、 ``XmlView`` の中に取り込まれ、出力結果が XML に変換されます。

XML データに変換する前にデータを修正したい場合は、 ``_serialize`` ビュー変数ではなく、
ビューファイルを使いましょう。
RecipesController に対するビューファイルを  ``app/View/recipes/xml`` 以下に置きます。
:php:class:`Xml` クラスを使えば、このビューファイル内で簡単に素早く XML を出力させることができます。
下記に index ビューの例を載せます。

::

    // app/View/Recipes/xml/index.ctp
    // Do some formatting and manipulation on
    // the $recipes array.
    $xml = Xml::fromArray(array('response' => $recipes));
    echo $xml->asXML();

parseExtensions() を使って、特定のコンテンツタイプを扱う場合、
CakePHP は自動的にそのタイプに対応するビューヘルパーを探します。
ここではコンテンツタイプとして XML を利用していて、
標準のビルトインヘルパーは存在しないのですが、
もし自作のヘルパーがあれば CakePHP はそれを自動読込みして利用可能にします。


レンダリングされた XML は下記のような感じになります::

    <recipes>
        <recipe id="234" created="2008-06-13" modified="2008-06-14">
            <author id="23423" first_name="Billy" last_name="Bob"></author>
            <comment id="245" body="Yummy yummmy"></comment>
        </recipe>
        <recipe id="3247" created="2008-06-15" modified="2008-06-15">
            <author id="625" first_name="Nate" last_name="Johnson"></author>
            <comment id="654" body="This is a comment for this tasty dish."></comment>
        </recipe>
    </recipes>


Edit アクションのロジックを作るのは少しだけトリッキーです。
XML 出力の API をクライアントに提供する場合、入力も XML で受付けるほうが自然です。
心配せずとも、 :php:class:`RequestHandler` と :php:class:`Router` クラスが
楽に取り計らってくれます。
POST もしくは PUT リクエストのコンテンツタイプが XML であれば、入力データは
CakePHP の :php:class:`Xml` クラスに渡され、配列に変換され、
``$this->request->data`` に入ります。
この機能によって、 XML と POST データのハンドリングはシームレスになるのです。
コントローラもモデルも XML の入力を気にせずに、 ``$this->request->data`` のみを扱えば良いのです。

他のフォーマットのインプットデータ
==================================

REST アプリケーションの場合、様々なフォーマットのデータを扱います。
CakePHP では、 :php:class:`RequestHandlerComponent` クラスが助けてくれます。
デフォルトでは、POST や PUT で送られてくる JSON/XML の入力データはデコードされ、
配列に変換されてから ``$this->request->data`` に格納されます。
独自のデコード処理も :php:meth:`RequestHandler::addInputType()` を利用すれば追加可能です。


デフォルトの REST ルーティングの修正
====================================

.. versionadded:: 2.1

デフォルトで用意している REST のルーティングではうまく動かない場合、
:php:meth:`Router::resourceMap()` を使って変更することができます。
このメソッドは、デフォルトのルーティングマップを再定義し、 :php:meth:`Router::mapResources()`
によって定義が適用されます。
このメソッドを利用する場合は、 *全ての* デフォルト定義を記載しておく必要があります。

::

    Router::resourceMap(array(
        array('action' => 'index', 'method' => 'GET', 'id' => false),
        array('action' => 'view', 'method' => 'GET', 'id' => true),
        array('action' => 'add', 'method' => 'POST', 'id' => false),
        array('action' => 'edit', 'method' => 'PUT', 'id' => true),
        array('action' => 'delete', 'method' => 'DELETE', 'id' => true),
        array('action' => 'update', 'method' => 'POST', 'id' => true)
    ));

デフォルトのリソースマップを上書きする際は、 ``mapResources()`` メソッドを呼ぶと、
新しい定義が利用できます。

.. _custom-rest-routing:

カスタム REST ルーティング
==========================

:php:meth:`Router::mapResources()` で生成したデフォルトルーティングがうまく動かない場合は、
:php:meth:`Router::connect()` メソッドを使い、REST ルーティングのカスタムセットを定義します。
``connect()`` メソッドは、URL ごとに異なる数のオプションがある場合の定義に利用できます。
詳しくは :ref:`route-conditions` セクションをご覧ください。

.. versionadded:: 2.5

:php:meth:`Router::mapResources()`  の ``$options`` 配列の ``connectOptions``
キーで :php:meth:`Router::connect()`` を使った設定ができます。  ::

    Router::mapResources('books', array(
        'connectOptions' => array(
            'routeClass' => 'ApiRoute',
        )
    ));


.. meta::
    :title lang=ja: REST
    :keywords lang=ja: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api
