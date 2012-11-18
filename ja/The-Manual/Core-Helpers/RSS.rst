RSS
###

RSS ヘルパーは RSS フィードの XML の生成を容易にします。

RssHelper で RSS フィードを生成する
===================================

この例では、すでに Posts コントローラと Post
モデルが作成されており、これに RSS
用に代わりのビューを用意すると仮定します。

CakePHP 1.2 において posts/index の xml/rss
バージョンはすぐに作成できます。いくつかの簡単なステップのあと、単純に
posts/index に付けたい拡張子(.rss)を付与し、 posts/index.rss という URL
を作成します。このウェブサービスを公開して実行してしまう前にいくつか行うべきことがあります。まずは、
parseExtensions を有効にします。これは app/config/routes.php
で行います。

::

          Router::parseExtensions('rss');

次に、 PostsController の $components 配列に RequestHandler
を追加すると良いでしょう。これにより、様々なことが自動的に行うことができます。以上で、
.rss という拡張子を有効にできました。 Router::parseExtensions()
を使うことで、多くの引数や拡張子をいくらでも渡すことが可能になります。これによりアプリケーション中で使用するそれぞれの拡張子とコンテンツタイプが有効になりました。ここまでで、
posts/index.rss がリクエストされた時に posts/index の XML
バージョンのものが得られるようになりました。しかしながら、まず rss/xml
フィードを生成するためのビューファイルを作成しなければなりません。

ビューファイル
--------------

posts/index の RSS
バージョンを作成する前に、いくつかのことを順番に行う必要があります。最初に、
rss レイアウトを作成しなければなりません。このファイルを
app/view/layouts/rss に設置し、ファイル名は default.ctp とします。
PostsController において、ビューで必要な全ての変数をセットします。

::

    // Posts Controller 内でのコード
    $channelData = array('title' => 'Recent Writing | Mark Story',
                    'link' => array('controller' => 'posts', 'action' => 'index', 'ext' => 'rss'),
                    'url' => array('controller' => 'posts', 'action' => 'index', 'ext' => 'rss'),
                    'description' => 'Recent writing and musings of Mark Story',
                    'language' => 'en-us'
                    );
    $posts = $this->Post->find('all', array('limit' => 20,
                                            'order' => 'Post.created')
                                );
    $this->set(compact('channelData', 'posts'));

ビュー変数は前述したレイアウトファイルにセットされます。

レイアウト
~~~~~~~~~~

RSS のレイアウトはとてもシンプルです。次の例のようになります。

::

    echo $rss->header();
    $channel = $rss->channel(array(), $channelData, $items);
    echo $rss->document(array(), $channel);

RssHelper
が様々なことを行ってくれるため、コード量はとても少なくなります。コントローラ中で
$items 変数をセットしていませんが、 CakePHP1.2
においてはビューからレイアウトに変数を渡すことができ、今回はそうします。

次に posts/index
に対するビューファイルを作成します。作成したレイアウトファイルと同じように、
views/posts/rss/ ディレクトリを作成し、そこに index.ctp
を新規作成してください。そのファイルの中身は後述します。

ビュー
~~~~~~

ュー
~~~~

RSS のビューには、 ``items()``
のコールバックとして指定され、データを望ましいフォーマットに変換する関数を含んでおくべきです。

::

    function rss_transform($item) {
        return array('title' => $item['Post']['title'],
                    'link' => array('controller' => 'posts', 'action' => 'view', 'ext' => 'rss', $item['Post']['id']),
                    'guid' => array('controller' => 'posts', 'action' => 'view', 'ext' => 'rss', $item['Post']['id']),
                    'description' => strip_tags($item['Post']['abstract']),
                    'pubDate' => $item['Post']['created'],               
                    );
    }

    $this->set('items', $rss->items($posts, 'rss_transform'));

この関数は posts のデータを XML に変換し、 $this->set()
を経てレイアウトに変換したデータを渡します。この時点で、レイアウトはレンダリングされ、
XML フィードが完成します。 posts/index.rss を表示してみると、
posts/index の XML バージョンが見えるはずです。
