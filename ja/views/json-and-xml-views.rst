JSON と XML ビュー
##################

``JsonView`` と ``XmlView`` を使用することで
JSON と XML レスポンスを作成できるようになり、
それらは :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent` と統合されます。

あなたのアプリケーションで ``RequestHandlerComponent`` を有効にして、
``json`` と ``xml`` またはいずれかの拡張子のサポートを有効にすることで、
自動的に新しいビュークラスを使用することが出来るようになります。
以降、このページでは ``JsonView`` と ``XmlView`` をデータビューと呼びます。

データビューを生成する方法は2つあります。
一つ目は ``serialize`` オプションを使用する方法、二つ目は通常のテンプレートファイルを使用する方法です。

あなたのアプリケーションでデータビューを有効化する
==================================================

データビュークラスを使用する前に、
まず :php:class:`Cake\\Controller\\Component\\RequestHandlerComponent`
をコントローラーでロードする必要があります。 ::

    public function initialize(): void
    {
        ...
        $this->loadComponent('RequestHandler');
    }

``AppController`` で上記のようにすることで、コンテンツタイプによる自動切り替えが有効化されます。
``viewClassMap`` 設定でコンポーネットを設定することで、カスタムクラスをマップしたり
他のデータ型をマップするも出来ます。

任意で :ref:`file-extensions` で json と xml 、もしくはどちらかの拡張子を有効化することが出来ます。
``http://example.com/articles.json`` の様に、URL の末尾でファイルの拡張子として
レスポンスタイプの名前を指定することで、 ``JSON`` 、 ``XML`` もしくはそれ以外の特定の
フォーマットビューにアクセスすることが出来ます。

デフォルトでは :ref:`file-extensions` が無効の場合、リクエストの ``Accept`` ヘッダーにより、
ユーザーにどのフォーマットをレンダリングするべきかが判断されます。例として、 ``JSON`` レスポンスを
レンダリングするために使用される ``Accept`` の設定値は ``application/json`` です。

シリアライズキーをデータビューで使用する
========================================

``serialize`` オプションは、データビューを使用する時に、どのビュー変数がシリアライズされるべきかを示します。
json/xml に変換する前に独自のフォーマット処理が不要な場合、
これはコントローラーのアクションでテンプレートファイルを定義する手間を省いてくれます。

レスポンスを生成する前にビュー変数へ独自のフォーマット処理や操作が必要な場合は、
テンプレートファイルを使用する必要があります。
``serialize`` の値は、文字列かシリアライズしたいビュー変数の配列のどちらかになります。 ::

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // シリアライズする必要があるビュー変数をセットする
            $this->set('articles', $this->paginate());
            // JsonView がシリアライズするべきビュー変数を指定する
            $this->viewBuilder()->setOption('serialize', 'articles');
        }
    }

``serialize`` をビュー変数の配列として定義し結合することも出来ます。 ::

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            // $articles と $comments を生成する何かのコード

            // シリアライズする必要があるビュー変数をセットする
            $this->set(compact('articles', 'comments'));

            // JsonView がシリアライズするべきビュー変数を指定する
            $this->viewBuilder()->setOption('serialize', ['articles', 'comments']);
        }
    }

:php:class:`XmlView` を使用するケースでは、配列として ``serialize`` を定義することには最上位に
``<response>`` 要素が自動的に付与されるという利点があります。 ``serialize`` と XmlView に
文字列を使用する時は、ビュー変数が最上位要素を一つ持つことに確認してください。
一つも最上位要素を持たない場合、XML の生成に失敗するでしょう。

テンプレートファイルをデータビューで使用する
============================================

最終的な出力の前にビュー変数に何かの処理を施したいケースでは、テンプレートファイルを
使用する必要があります。例えば、生成された HTML を要素として持つ記事があり、
JSON レスポンスからそれを取り除きたいとします。こういった状況ではビューファイルが役に立ちます。 ::

    // コントローラーのコード
    class ArticlesController extends AppController
    {
        public function index()
        {
            $articles = $this->paginate('Articles');
            $this->set(compact('articles'));
        }
    }

    // ビューのコード - templates/Articles/json/index.php
    foreach ($articles as &$article) {
        unset($article->generated_html);
    }
    echo json_encode(compact('articles'));

より複雑な操作を行ったり、ヘルパーを整形に使用することも出来ます。データビュークラスは、
ビューファイルはシリアライズされたコンテンツを出力することを前提としているため、
レイアウトをサポートしません。

XML ビューの作成
================

.. php:class:: XmlView

デフォルトでは ``serialize`` を使用する時、XmlView は
``<response>`` ノードでシリアル化されるビュー変数をラップします。
``rootNode`` オプションを使用することで、このノードに別の名前を設定することが出来ます。

XmlView クラスは、XML の生成に使用するオプション（例: ``tags`` vs ``attributes`` ）を
変更するための ``xmlOptions`` オプションをサポートしています。

``XmlView`` の使用例は `sitemap.xml
<https://www.sitemaps.org/protocol.html>`_ を生成することです。
このドキュメントタイプでは ``rootNode`` を変更し属性を設定する必要があります。
属性は ``@`` プレフィックスを使用して定義されます。 ::

    use Cake\View\XmlView;

    public function viewClasses(): array
    {
        return [XmlView::class];
    }

    public function sitemap()
    {
        $pages = $this->Pages->find()->all();
        $urls = [];
        foreach ($pages as $page) {
            $urls[] = [
                'loc' => Router::url(['controller' => 'Pages', 'action' => 'view', $page->slug, '_full' => true]),
                'lastmod' => $page->modified->format('Y-m-d'),
                'changefreq' => 'daily',
                'priority' => '0.5'
            ];
        }

        // 生成されたドキュメントにカスタムルートノードを定義します。
        $this->viewBuilder()
            ->setOption('rootNode', 'urlset')
            ->setOption('serialize', ['@xmlns', 'url']);
        $this->set([
            // ルートノードで属性を定義します。
            '@xmlns' => 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'url' => $urls
        ]);
    }

JSON ビューの作成
=================

.. php:class:: JsonView

JsonView クラスは、JSON の生成に使用するビットマスクを変更するためための
``jsonOptions`` オプションをサポートします。このオプションの有効な値は
`json_encode <https://php.net/json_encode>`_  を参照してください。

例えば、一貫した JSON 形式で CakePHP エンティティーの検証エラーをシリアライズするには::

    // コントローラーのアクションの中で、保存に失敗した時
    $this->set('errors', $articles->errors());
    $this->viewBuilder()
        ->setOption('serialize', ['errors'])
        ->setOption('jsonOptions', JSON_FORCE_OBJECT);

JSONP レスポンス
----------------

``JsonView`` を使用する時は、特別なビュー変数 ``_jsonp`` を使用することで
JSONP レスポンスの返すことが出来ます。これに ``true`` を設定することで、ビュークラスに
"callback" という名前のクエリー文字列パラメーターがセットされているかをチェックさせ、
それ同時に提供された関数名で JSON レスポンスをラップさせることが出来ます。
"callback" の代わりにカスタムクエリー文字列パラメーターを使用したい場合は、
``_jsonp`` に ``true`` の代わりの名前を指定してください。

使用例
======

リクエストのコンテンツタイプまたは拡張子によって、
:doc:`RequestHandlerComponent </controllers/components/request-handling>`
が自動的にビューをセットするのに対して、あなたも同様にコントローラーのなかでビューマッピングを
操作することが出来ます。 ::

    // src/Controller/VideosController.php
    namespace App\Controller;

    use App\Controller\AppController;
    use Cake\Http\Exception\NotFoundException;

    class VideosController extends AppController
    {
        public function export($format = '')
        {
            $format = strtolower($format);

            // ビューマッピングの形式
            $formats = [
              'xml' => 'Xml',
              'json' => 'Json',
            ];

            // 未知の形式の時はエラー
            if (!isset($formats[$format])) {
                throw new NotFoundException(__('Unknown format.'));
            }

            // ビューに出力形式をセット
            $this->viewBuilder()->setClassName($formats[$format]);

            // データを取得
            $videos = $this->Videos->find('latest')->all();

            // ビューにデータをセット
            $this->set(compact('videos'));
            $this->viewBuilder()->setOption('serialize', ['videos']);

            // ダウンロードを指定
            return $this->response->withDownload('report-' . date('YmdHis') . '.' . $format);
        }
    }

