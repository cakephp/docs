Rss
#########

.. php:namespace:: Cake\View\Helper

.. php:class:: RssHelper(View $view, array $config = [])

RssHelper は `RSS feeds <https://en.wikipedia.org/wiki/RSS>`_ である XML の作成が簡単にできます。

Creating an RSS Feed with the RssHelper
=======================================

This example assumes you have a Articles Controller, Articles Table and an
Article Entity already created and want to make an alternative view for RSS.

Creating an XML/RSS version of ``articles/index`` is a snap with CakePHP.
After a few simple steps you can simply append the desired extension .rss to
``articles/index`` making your URL ``articles/index.rss``. Before we jump too
far ahead trying to get our webservice up and running we need to do a few
things. First extensions parsing needs to be activated, this is done in
**config/routes.php**::

    Router::extensions('rss');

上記のように宣言すると、.rss 拡張子を利用できます。
:php:meth:`Cake\\Routing\\Router::extensions()` を使用すると、
文字列もしくは配列の拡張子を最初の引数として渡すことができます。
これはあなたのアプリに各拡張子 / コンテンツタイプを有効化するでしょう。

これで、 ``articles/index.rss`` がリクエストされたときに ``articles/index`` の XML バージョンが取得できるようになります。
しかし、RSS 仕様のコードを追加するためには、まず最初にコントローラを編集する必要があります。

コントローラのコード
-----------------------------------
ArticlesController の ``initialize()`` メソッドに RequestHandler を加えるのは 良いアイディアです。これで、多くのことが自動的に行われます。
::

    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('RequestHandler');
    }

``articles/index`` の RSS バージョンが作れる前に、いくつかのことを順番に行う必要があります。
コントローラのアクションで、 :php:meth:`Cake\\Controller\\Controller::set()` を使ってチャンネルメタデータをセットし、
それをビューに渡したくなりますが、これは不適切です。
その情報はビューの中でも処理できます。

後述しますが、もし RSS フィードを作成するためのデータと HTML ビュー用のデータがそれぞれ異なるロジックを用意しているのであれば、
:php:meth:`Cake\\Controller\\Component\\RequestHandler::isRss()` メソッドが利用でき、そうでなければあなたのコントローラは手を加えずにすみます。
::

    // Articles コントローラで RSS フィードの配信を行うアクションを編集、
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
``$documentData`` や ``$channelData`` はコントローラ内でセットしていませんが、CakePHP では、ビューからレイアウトに変数を渡すことができます。
``$channelData`` 配列がどこにあるかは、フィードのメタデータ全てをセットしてから得られます。


Next up is view file for my articles/index. Much like the layout file
we created, we need to create a **src/Template/Posts/rss/** directory and
create a new **index.ctp** inside that folder. The contents of the file
are below.

View
----

Our view, located at **src/Template/Posts/rss/index.ctp**, begins by setting the
``$documentData`` and ``$channelData`` variables for the layout, these contain
all the metadata for our RSS feed. This is done by using the
:php:meth:`Cake\\View\\View::set()` method which is analogous to the
:php:meth:`Cake\\Controller\\Controller::set()` method. Here though we are
passing the channel's metadata back to the layout::

    $this->set('channelData', [
        'title' => __("Most Recent Posts"),
        'link' => $this->Url->build('/', true),
        'description' => __("Most recent posts."),
        'language' => 'en-us'
    ]);

The second part of the view generates the elements for the actual records of
the feed. This is accomplished by looping through the data that has been passed
to the view ($items) and using the :php:meth:`RssHelper::item()` method. The
other method you can use, :php:meth:`RssHelper::items()` which takes a callback
and an array of items for the feed. The callback method is usually called
``transformRss()``. There is one downfall to this method, which is that you
cannot use any of the other helper classes to prepare your data inside the
callback method because the scope inside the method does not include anything
that is not passed inside, thus not giving access to the TimeHelper or any
other helper that you may need. The :php:meth:`RssHelper::item()` transforms
the associative array into an element for each key value pair.

.. note::

    You will need to modify the $link variable as appropriate to
    your application. You might also want to use a
    :ref:`virtual property <entities-virtual-properties>` in your Entity.

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

        // Remove & escape any HTML to make sure the feed content will validate.
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

You can see above that we can use the loop to prepare the data to be transformed
into XML elements. It is important to filter out any non-plain text characters
out of the description, especially if you are using a rich text editor for the
body of your blog. In the code above we used ``strip_tags()`` and
:php:func:`h()` to remove/escape any XML special characters from the content,
as they could cause validation errors. Once we have set up the data for the
feed, we can then use the :php:meth:`RssHelper::item()` method to create the XML
in RSS format. Once you have all this setup, you can test your RSS feed by going
to your site ``/posts/index.rss`` and you will see your new feed. It is always
important that you validate your RSS feed before making it live. This can be
done by visiting sites that validate the XML such as Feed Validator or the w3c
site at http://validator.w3.org/feed/.

.. note::

    You may need to set the value of 'debug' in your core configuration
    to ``false`` to get a valid feed, because of the various debug
    information added automagically under higher debug settings that
    break XML syntax or feed validation rules.

.. meta::
    :title lang=ja: RssHelper
    :description lang=ja: The RssHelper makes generating XML for RSS feeds easy.
    :keywords lang=ja: rss helper,rss feed,isrss,rss item,channel data,document data,parse extensions,request handler
