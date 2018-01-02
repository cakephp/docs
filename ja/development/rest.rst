REST
####

最近のアプリケーションプログラマーは、サービスのコア機能を
ユーザーにオープンにする必要があると気付き始めています。
簡単に提供でき、自由にコア API にアクセスできれば、広く受け入れられ、
マッシュアップされたり、簡単に他のシステムと統合できます。

簡単にあなたの作ったアプリケーションロジックにアクセスさせる方法は色々ありますが、
REST はその中でもすばらしい方法でしょう。とてもシンプルで、大抵は XML ベース
(SOAP のようなものではなく、単純な XML のこと) で、HTTP ヘッダーによって制御されます。
CakePHP を使って REST の API を提供するのはすごく簡単です。

簡単なセットアップ
===================

REST を動かすための手っ取り早い方法は、 config/routes.php ファイルに
:ref:`リソースルート <resource-routes>` をセットアップするための数行を追記することです。

一度、Router が REST リクエストを、コントローラーのアクションにマッピングしておけば、
そのコントローラーのアクションのロジックの作成に移ることができます。
基本的なコントローラーのサンプルは下記のようになります。 ::

    // src/Controller/RecipesController.php
    class RecipesController extends AppController
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            $recipes = $this->Recipes->find('all');
            $this->set([
                'recipes' => $recipes,
                '_serialize' => ['recipes']
            ]);
        }

        public function view($id)
        {
            $recipe = $this->Recipes->get($id);
            $this->set([
                'recipe' => $recipe,
                '_serialize' => ['recipe']
            ]);
        }

        public function add()
        {
            $recipe = $this->Recipes->newEntity($this->request->getData());
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
                '_serialize' => ['message', 'recipe']
            ]);
        }

        public function edit($id)
        {
            $recipe = $this->Recipes->get($id);
            if ($this->request->is(['post', 'put'])) {
                $recipe = $this->Recipes->patchEntity($recipe, $this->request->getData());
                if ($this->Recipes->save($recipe)) {
                    $message = 'Saved';
                } else {
                    $message = 'Error';
                }
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }

        public function delete($id)
        {
            $recipe = $this->Recipes->get($id);
            $message = 'Deleted';
            if (!$this->Recipes->delete($recipe)) {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }
    }

しばしば、RESTful なコントローラーは、リクエストの種類ごとに異なるビューファイルを扱うために
パースされた拡張子を使用します。REST リクエストが処理できるようになったので、XML ビューなどが
作成できます。CakePHP の組み込みの :doc:`/views/json-and-xml-views` を利用して
JSON ビューを作成できます。組み込みの :php:class:`XmlView` を扱うために、
``_serialize`` というビュー変数を定義します。この特別なビュー変数は、 ``XmlView`` の中に
取り込まれ、出力結果が XML に変換されます。

XML データに変換する前にデータを修正したい場合は、 ``_serialize`` ビュー変数ではなく、
ビューファイルを使いましょう。RecipesController に対する REST ビューを
**src/Template/Recipes/xml** 以下に置きます。 :php:class:`Xml` クラスを使えば、
このビューファイル内で簡単に素早く XML を出力させることができます。
下記に index ビューの例を載せます。 ::

    // src/Template/Recipes/xml/index.ctp
    // Do some formatting and manipulation on
    // the $recipes array.
    $xml = Xml::fromArray(['response' => $recipes]);
    echo $xml->asXML();

:php:meth:`Cake\\Routing\\Router::extensions()` を使って、特定のコンテンツタイプを扱う場合、
CakePHP は自動的にそのタイプに対応するビューヘルパーを探します。
ここではコンテンツタイプとして XML を利用していて、標準のビルトインヘルパーは存在しないのですが、
もし自作のヘルパーがあれば CakePHP はそれを自動読込みして利用可能にします。

レンダリングされた XML は下記のような感じになります。 ::

    <recipes>
        <recipe>
            <id>234</id>
            <created>2008-06-13</created>
            <modified>2008-06-14</modified>
            <author>
                <id>23423</id>
                <first_name>Billy</first_name>
                <last_name>Bob</last_name>
            </author>
            <comment>
                <id>245</id>
                <body>Yummy yummmy</body>
            </comment>
        </recipe>
        ...
    </recipes>

edit アクションのロジックを作るのは少しだけトリッキーです。XML 出力 の API を提供する場合、
入力も XML で受付けるほうが自然です。心配せずとも、
:php:class:`Cake\\Controller\\Component\\RequestHandler` と
:php:class:`Cake\\Routing\\Router` クラスが取り計らってくれます。
POST もしくは PUT リクエストのコンテンツタイプが XML であれば、入力データは CakePHP の
:php:class:`Xml` クラスに渡され、配列に変換され、 ``$this->request->getData()`` に入ります。
この機能によって、XML と POST データの処理はシームレスになるのです。コントローラーもモデルも
XML の入力を気にせずに、 ``$this->request->getData()`` のみを扱えば良いのです。

他のフォーマットのインプットデータ
==================================

REST アプリケーションの場合、様々なフォーマットのデータを扱います。
CakePHP では、 :php:class:`RequestHandlerComponent` クラスが助けてくれます。
デフォルトでは、POST や PUT で送られてくる JSON/XML の入力データはデコードされ、
配列に変換されてから ``$this->request->getData()`` に格納されます。独自のデコード処理も
:php:meth:`RequestHandler::addInputType()` を利用すれば追加可能です。

RESTful ルーティング
=====================

CakePHP の Router は、 RESTful なリソースルートへの接続は容易です。詳しくは、
:ref:`resource-routes` セクションをご覧ください。

.. meta::
    :title lang=ja: REST
    :keywords lang=ja: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api
