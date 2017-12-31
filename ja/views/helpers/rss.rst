Rss
#########

.. php:namespace:: Cake\View\Helper

.. php:class:: RssHelper(View $view, array $config = [])

RssHelper は `RSS feeds <https://en.wikipedia.org/wiki/RSS>`_ である XML の作成が簡単にできます。

.. deprecated:: 3.5.0
    RssHelper は 3.5.0 から非推奨になり、4.0.0 で削除されます。

RssHelper で RSS フィードを生成
=======================================

この例では、Articles コントローラーと Articles テーブル、Article エンティティーがすでに作成されていて、
これに RSS 用のビューを作成すると仮定します。

CakePHP で ``articles/index`` の XML/RSS バージョンがすぐに作成できます。
いくつかの簡単なステップの後、 ``articles/index`` に拡張子 (.rss) を追加し、
``articles/index.rss`` という URL を作成します。
このウェブサービスを公開して実行する前にいくつか行う必要があります。
最初に拡張子パースを有効にします。これは **config/routes.php** で行います。
::

    Router::extensions('rss');

上記のように宣言すると、.rss 拡張子を利用できます。
:php:meth:`Cake\\Routing\\Router::extensions()` を使用する時、
文字列もしくは配列の拡張子を最初の引数として渡すことができます。
これはあなたのアプリに各拡張子 / コンテンツタイプを有効化するでしょう。

これで、 ``articles/index.rss`` がリクエストされたときに ``articles/index`` の XML バージョンが取得できるようになります。
しかし、RSS 仕様のコードを追加するためには、まず最初にコントローラーを編集する必要があります。

コントローラーのコード
-----------------------------------
ArticlesController の ``initialize()`` メソッドに RequestHandler を加えるのは 良いアイディアです。これで、多くのことが自動的に行われます。
::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
    }

``articles/index`` の RSS バージョンが作れる前に、いくつかのことを順番に行う必要があります。
コントローラーのアクションで、 :php:meth:`Cake\\Controller\\Controller::set()` を使ってチャンネルメタデータをセットし、
それをビューに渡したくなりますが、これは不適切です。
その情報はビューの中でも処理できます。

後述しますが、もし RSS フィードを作成するためのデータと HTML ビュー用のデータがそれぞれ異なるロジックを用意しているのであれば、
:php:meth:`Cake\\Controller\\Component\\RequestHandler::isRss()` メソッドが利用でき、そうでなければあなたのコントローラーは手を加えずにすみます。
::

    // Articles コントローラーで RSS フィードの配信を行うアクションを編集、
    // この例は Index アクションです。

    public function index()
    {
        if ($this->RequestHandler->isRss() ) {
            $articles = $this->Articles
                ->find()
                ->limit(20)
                ->order(['created' => 'desc']);
            $this->set(compact('articles'));
        } else {
            // これは RSS リクエストではありません。
            // ウェブサイトインターフェースで使用されるデータを配信します。
            $this->paginate = [
                'order' => ['created' => 'desc'],
                'limit' => 10
            ];
            $this->set('articles', $this->paginate($this->Articles));
            $this->set('_serialize', ['articles']);
        }
    }

すべてのビューの変数セットで RSS レイアウトを作成する必要があります。

レイアウト
-----------------------------------

RSS レイアウトはとてもシンプルです。 **src/Template/Layout/rss/default.ctp** 内に以下の内容を記述します。
::

    if (!isset($documentData)) {
        $documentData = [];
    }
    if (!isset($channelData)) {
        $channelData = [];
    }
    if (!isset($channelData['title'])) {
        $channelData['title'] = $this->fetch('title');
    }
    $channel = $this->Rss->channel([], $channelData, $this->fetch('content'));
    echo $this->Rss->document($documentData, $channel);

そのようには見えませんが、 ``RssHelper`` のパワーのおかげで、私たちのために多くのことをしてくれています。
``$documentData`` や ``$channelData`` はコントローラー内でセットしていませんが、CakePHP では、ビューからレイアウトに変数を渡すことができます。
``$channelData`` 配列がどこにあるかは、フィードのメタデータ全てをセットしてから得られます。

次に articles/index のビューファイルを作成します。
私たちが作成したレイアウトファイルのように **src/Template/Posts/rss/** ディレクトリーを作成し、
そのフォルダーの中に **index.ctp** を作成する必要があります。ファイルの内容は以下の通りです。

ビュー
-----------------------------------

私たちのビューは **src/Template/Posts/rss/index.ctp** に置かれ、レイアウトのための ``$documentData`` と ``$channelData`` 変数を設定を始めます。
これらの変数は、RSS フィードのためのすべてのメタデータを含みます。
これは、 :php:meth:`Cake\\Controller\\Controller::set()` メソッドと同様の :php:meth:`Cake\\View\\View::set()` メソッドを使って行われます。
ここでチャンネルのメタデータを渡すとレイアウトに戻ります。
::

    $this->set('channelData', [
        'title' => __("Most Recent Posts"),
        'link' => $this->Url->build('/', true),
        'description' => __("Most recent posts."),
        'language' => 'en-us'
    ]);

ビューの後半部分は、実際のフィードのレコードのための要素を生成します。
これは、ビューの $items に渡されたデータをループし、 :php:meth:`RssHelper::item()` を使うことによって実現します。
その他のメソッドも使用できます。 :php:meth:`RssHelper::items()` はコールバックとフィードの items 配列を受け取とります。
コールバックメソッドとしてよく ``transformRss()`` が使用されます。

メソッドの中のスコープは、その中まで他のヘルパークラスを通すことができないため、
コールバックメソッドの中でデータを用意するために他のヘルパークラスを利用できません。
したがって、 TimeHelper や他の必要なヘルパーにアクセスすることができません。
:php:meth:`RssHelper::item()` は、連想配列をキーと値のペアを持つ要素に変換します。

.. note::
    アプリケーションに適切な $link 変数を修正する必要があります。
    また、Entity 内で :ref:`virtual property <entities-virtual-properties>` を使いたいでしょう。

::

    foreach ($articles as $article) {
        $created = strtotime($article->created);

        $link = [
            'controller' => 'Articles',
            'action' => 'view',
            'year' => date('Y', $created),
            'month' => date('m', $created),
            'day' => date('d', $created),
            'slug' => $article->slug
        ];

        // フィードの内容を確かにバリデートするため、HTML を取り除いたりエスケープします。
        $body = h(strip_tags($article->body));
        $body = $this->Text->truncate($body, 400, [
            'ending' => '...',
            'exact'  => true,
            'html'   => true,
        ]);

        echo  $this->Rss->item([], [
            'title' => $article->title,
            'link' => $link,
            'guid' => ['url' => $link, 'isPermaLink' => 'true'],
            'description' => $body,
            'pubDate' => $article->created
        ]);
    }

上記は、ループして XML 要素の中に変換するデータを用意しています。
特にブログの本文のためのリッチテキストエディターを使用している場合には、 プレーンテキストではない文字を除外することは重要です。
上記のコードでは、 ``strip_tags()`` と :php:func:`h()` を使って、バリデーションエラーを引き起こす XML 特殊文字を本文から削除・エスケープしています。
ひとたびフィードのためのデータをセットアップしたら、RSS 形式の XML を作成するために :php:meth:`RssHelper::item()` メソッドを使用します。
一旦このセットアップをすべて行ったら、あなたのサイトの ``/posts/index.rss`` へアクセスして RSS フィードをテストでき、新しいフィードを確認します。
本番で作成する前に RSS フィードを検証することは重要です。
Feed Validator や w3c サイトの http://validator.w3.org/feed/ など、XML を検証するサイトで確認することができます。

.. note::

    正しいフィードを取得するためにコア設定内で ‘debug’ の値を ``false`` にセットする必要があります。
    高い debug の設定下では様々なデバッグ情報が自動的に追加され、それが XML 構文やフィードのバリデーションルールを壊すからです。

.. meta::
    :title lang=ja: RssHelper
    :description lang=ja: RssHelper は RSS フィード用の XML 構文を簡単に作成します。
    :keywords lang=ja: rss helper,rss feed,isrss,rss item,channel data,document data,parse extensions,request handler
