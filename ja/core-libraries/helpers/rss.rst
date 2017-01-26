RssHelper
#########

.. php:class:: RssHelper(View $view, array $settings = array())

RssHelper は、RSS フィードのための XML を簡単に生成するために使用します。

RssHelper で RSS フィードを生成
===================================

この例では、すでに Posts コントローラと Post モデルがすでに作成されていて、
これに RSS 用のビューを用意すると仮定します。

CakePHP で posts/index の xml/rss バージョンはすぐに作成できます。
いくつかの簡単なステップの後、 ``posts/index`` に拡張子 (.rss)  を追加し、
``posts/index.rss`` という URL を作成します。このウェブサービスを
公開して実行する前にいくつか行う必要があります。最初に parseExtensions を
有効にします。これは ``app/Config/routes.php`` で行います。 ::

    Router::parseExtensions('rss');

上記のように実行すると、 .rss という拡張子が有効になります。
:php:meth:`Router::parseExtensions()` を使うことで、多くの引数や拡張子を
いくらでも渡すことが可能になります。これにより、アプリケーション中で使用する
拡張子やコンテンツタイプがそれぞれ有効になります。以上で、 ``posts/index.rss``
がリクエストされたときに ``posts/index`` の XML バージョンが取得できるように
なります。しかしながら、最初は RSS 仕様のコードを追加するために
コントローラを編集する必要があります。

コントローラのコード
--------------------

PostsController の $components 配列に RequestHandler を加えるのは
良いアイディアです。これで、多くのことが自動的に行われます。 ::

    public $components = array('RequestHandler');

ビューで :php:class:`TextHelper` を、フォーマットに使うために
コントローラに追加します。 ::

    public $helpers = array('Text');

posts/index の RSS バージョンが作れるようになる前に、いくつかのことを順番に
行う必要があります。コントローラのアクションの中で、 :php:meth:`Controller::set()`
を使ってチャンネルメタデータをセットし、それをビューに渡します。しかし、これは不適切です。
その情報は、ビューの中でも処理できます。それは後になりますが、今、もし RSS
フィードのためのデータと HTML ビューのためのデータ、それぞれ異なるロジックを
用意しているのであれば、 :php:meth:`RequestHandler::isRss()` メソッドが使えます。
それ以外、あなたのコントローラに手を加えずにすみます。 ::

    // Posts コントローラで RSS フィードの配信を行うアクション、
    // この例では index アクションを修正してください。

    public function index() {
        if ($this->RequestHandler->isRss() ) {
            $posts = $this->Post->find(
                'all',
                array('limit' => 20, 'order' => 'Post.created DESC')
            );
            return $this->set(compact('posts'));
        }

        // これは、RSS リクエストではありません。
        // ウェブサイトインターフェースで使用されるデータを配信します。
        $this->paginate['Post'] = array(
            'order' => 'Post.created DESC',
            'limit' => 10
        );

        $posts = $this->paginate();
        $this->set(compact('posts'));
    }

すべてのビューの変数セットで RSS レイアウトを作成する必要があります。

レイアウト
-----------

RSS レイアウトはとてもシンプルです。 ``app/View/Layouts/rss/default.ctp`` 内に
以下の内容を記述します。 ::

    if (!isset($documentData)) {
        $documentData = array();
    }
    if (!isset($channelData)) {
        $channelData = array();
    }
    if (!isset($channelData['title'])) {
        $channelData['title'] = $this->fetch('title');
    }
    $channel = $this->Rss->channel(array(), $channelData, $this->fetch('content'));
    echo $this->Rss->document($documentData, $channel);

そのようには見えませんが、 ``RssHelper`` のパワーのおかげで、
私たちのために多くのことをしてくれています。
``$documentData`` や ``$channelData`` はコントローラ内でセットしていませんが、
CakePHP では、あなたのビューからレイアウトに変数を渡すことができます。
``$channelData`` 配列がどこにあるかは、フィードのメタデータ全てをセットしてから
得られます。

次に posts/index のビューファイルを作成します。私たちが作成したレイアウトファイルのように
``View/Posts/rss/`` ディレクトリを作成し、そのフォルダの中に ``index.ctp`` を
作成する必要があります。ファイルの内容は以下の通りです。

ビュー
-------

私たちのビューは、 ``app/View/Posts/rss/index.ctp`` に置かれ、
レイアウトのための ``$documentData`` と ``$channelData`` 変数を設定を始めます。
これらの変数は、RSS フィードのためのすべてのメタデータを持っています。
これは、 :php:meth:`Controller::set()` メソッドと同様の :php:meth:`View::set()`
メソッドを使って行われます。ここでチャンネルのメタデータを渡すとレイアウトに戻ります。 ::

    $this->set('channelData', array(
        'title' => __("Most Recent Posts"),
        'link' => $this->Html->url('/', true),
        'description' => __("Most recent posts."),
        'language' => 'en-us'
    ));

ビューの後半部分は、実際のフィードのレコードのための要素を生成します。
これは、ビューの $items に渡されたデータをループし、
:php:meth:`RssHelper::item()` を使うことによって実現します。
その他のメソッドも使用できます。 :php:meth:`RssHelper::items()`
はコールバックとフィードの items 配列を受け取とります。
``transformRss()`` と呼ばれるコールバックを使用しているのを見かけます。
メソッドの中のスコープは、その中まで他のヘルパークラスを通すことができないため、
コールバックメソッドの中でデータを用意するために他のヘルパークラスを利用できません。
だから、 TimeHelper や他の必要なヘルパーにアクセスすることができません。
:php:meth:`RssHelper::item()` は、連想配列をキーと値のペアを持つ要素に変換します。


.. note::

    アプリケーションに適切な $postLink 変数を更新する必要があります。

::

    foreach ($posts as $post) {
        $postTime = strtotime($post['Post']['created']);

        $postLink = array(
            'controller' => 'posts',
            'action' => 'view',
            'year' => date('Y', $postTime),
            'month' => date('m', $postTime),
            'day' => date('d', $postTime),
            $post['Post']['slug']
        );

        // フィードの本文が正しくなるよう HTML の削除とエスケープ
        $bodyText = h(strip_tags($post['Post']['body']));
        $bodyText = $this->Text->truncate($bodyText, 400, array(
            'ending' => '...',
            'exact'  => true,
            'html'   => true,
        ));

        echo  $this->Rss->item(array(), array(
            'title' => $post['Post']['title'],
            'link' => $postLink,
            'guid' => array('url' => $postLink, 'isPermaLink' => 'true'),
            'description' => $bodyText,
            'pubDate' => $post['Post']['created']
        ));
    }

上記は、ループして XML 要素の中に変換するデータを用意しています。
特にブログの本文のためのリッチテキストエディタを使用している場合には、
プレーンテキストではない文字を除外することは重要です。上記のコードでは、
``strip_tags()`` と :php:func:`h()` を使って、バリデーションエラーを引き起こす
XML 特殊文字を本文から削除・エスケープしています。一度、フィードのためのデータを
セットアップしたら、 RSS　形式の XML を作成するために :php:meth:`RssHelper::item()`
メソッドを使用します。一度、このセットアップをすべて行ったら、あなたのサイトの
``/posts/index.rss`` へ行って RSS フィードをテストできます。そして、新しいフィードを
確認します。本番で作成する前にあなたの RSS フィードを検証することは重要です。
Feed Validator や w3c サイトの http://validator.w3.org/feed/ など、
XML を検証するサイトで確認することができます。

.. note::

    正しいフィードを取得するために core 設定内で 'debug' の値を 1 か 0 に
    セットする必要があります。debug の値を高くすると、自動的に追加される様々な
    デバッグ情報が XML 構文やフィードのバリデーションルールを壊すからです。
    

Rss ヘルパー API
=================

.. php:attr:: action

    現在のアクション

.. php:attr:: base

    ベース URL

.. php:attr:: data

    ポストされたモデルデータ

.. php:attr:: field

    現在のフィールドの名前

.. php:attr:: helpers

    RssHelper で使われるヘルパー

.. php:attr:: here

    現在のアクションの URL

.. php:attr:: model

    現在のモデルの名前

.. php:attr:: params

    パラメータ配列

.. php:attr:: version

    デフォルトの生成された RSS の仕様バージョン

.. php:method:: channel(array $attrib = array (), array $elements = array (), mixed $content = null)

    :rtype: string

    RSS　の ``<channel />`` 要素を返します。

.. php:method:: document(array $attrib = array (), string $content = null)

    :rtype: string

    ``<rss />`` タグで囲まれた RSS ドキュメントを返します。

.. php:method:: elem(string $name, array $attrib = array (), mixed $content = null, boolean $endTag = true)

    :rtype: string

    XML 要素を生成します。

.. php:method:: item(array $att = array (), array $elements = array ())

    :rtype: string

    配列を ``<item />`` エレメントとそのコンテンツに変換します。

.. php:method:: items(array $items, mixed $callback = null)

    :rtype: string

    任意のコールバック可能な関数を使ってデータ配列を変換し、 ``<item />`` タグの
    集合に変換します。

.. php:method:: time(mixed $time)

    :rtype: string

    任意の形式の時間を RSS 時間に変換します。
    :php:meth:`TimeHelper::toRSS()` をご覧ください。


.. meta::
    :title lang=ja: RssHelper
    :description lang=ja: The RSS helper makes generating XML for RSS feeds easy.
    :keywords lang=ja: rss helper,rss feed,isrss,rss item,channel data,document data,parse extensions,request handler
