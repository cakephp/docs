ヘルパー
########


ヘルパーはプレゼンテーションレイヤーのためのコンポーネントのようなクラスです。
多くのビューやエレメント、レイアウトで共有される表示ロジックを含んでいます。
この章ではヘルパーの作り方とCakePHPのコアヘルパーでできる基本的なタスクの概要を説明します。

CakePHPにはビューの作成に役立ついくつかの特徴的なヘルパーがあります。それらは、
整形式のマークアップ(フォーム含む)、テキスト、時間、数値の整形に役立ったり、Ajax機能をスピードアップさせたりします。
CakePHPのヘルパーに関するさらなる情報は :ref:`core-helpers` を見て下さい。

.. _configuring-helpers:

ヘルパーの設定と使用
====================

CakePHPでヘルパーを有効にするにはコントローラに認識させる必要があります。各コントローラは
:php:attr:`~Controller::$helpers` プロパティを持っており、そのプロパティにはビューで利用できるヘルパーの一覧が保持されています。
ビューでヘルパーを使用するにはヘルパーの名前をコントローラの ``$helpers`` 配列に追加して下さい。::

    class BakeriesController extends AppController {
        public $helpers = array('Form', 'Html', 'Js', 'Time');
    }

プラグインからヘルパーを追加するにはCakePHPの様々な場所で使われている :term:`プラグイン記法` を使います。::

    class BakeriesController extends AppController {
        public $helpers = array('Blog.Comment');
    }

あるアクションの間だけヘルパーを追加することができます。言い換えると、あるヘルパーの利用を特定のコントローラアクションに限定し、
同じコントローラの他のアクションでは利用できないようにすることができます。このことはコントローラが整理された状態を維持するのに役立つだけでなく、
さらに、ヘルパーを使わない他のアクションの処理コストを抑えることになります。::

    class BakeriesController extends AppController {
        public function bake {
            $this->helpers[] = 'Time';
        }
        public function mix {
            // ここにTimeヘルパーは読み込まれないので利用出来ません
        }
    }

もしすべてのコントローラでヘルパーを有効にする必要がある場合ヘルパーの名前を ``/app/Controller/AppController.php``
(見つからない場合は作成して下さい)の ``$helpers`` 配列に追加して下さい。デフォルトのHtmlヘルパーとFormヘルパーも忘れずに読み込んで下さい。::

    class AppController extends Controller {
        public $helpers = array('Form', 'Html', 'Js', 'Time');
    }

ヘルパーにはオプションを渡すことが出来ます。このオプションは属性の値を設定したり、ヘルパーの動作を変えるために使うことができます。::

    class AwesomeHelper extends AppHelper {
        public function __construct(View $view, $settings = array()) {
            parent::__construct($view, $settings);
            debug($settings);
        }
    }

    class AwesomeController extends AppController {
        public $helpers = array('Awesome' => array('option1' => 'value1'));
    }

すべてのヘルパーで共通して使える設定に ``className`` オプションがあります。このオプションを設定するとビューの中に別名のヘルパーを作ることができます。
この機能は ``$this->Html`` や他の共通ヘルパーの参照を独自の実装に置き換えたい時に役立ちます。::

    // app/Controller/PostsController.php
    class PostsController extends AppController {
        public $helpers = array(
            'Html' => array(
                'className' => 'MyHtml'
            )
        );
    }

    // app/View/Helper/MyHtmlHelper.php
    App::uses('HtmlHelper', 'View/Helper');
    class MyHtmlHelper extends HtmlHelper {
        // コアHtmlHelperを上書きするためのコードを追加して下さい
    }

上記の例ではビューの中で ``MyHtmlHelper`` が ``$this->Html`` の *別名* になっています。

.. note::

    別名が付けられたヘルパーはどこで使われていたとしてもそのインスタンスを置き換えます。
    それには他のヘルパーの内部も含まれます。

.. tip::

    HtmlやSessionの別名を付けられたヘルパーはコアのPagesControllerで使うとうまく動かないでしょう。
    そのため、``lib/Cake/Controller/PagesController.php`` を ``app/Controller/`` フォルダにコピーした方が良いです。

ヘルパーを設定することで宣言的にヘルパーを設定することができるようになり、また、
コントローラアクションの外に設定のロジックを置けるようになります。もし、クラス宣言の一部に含めることができない設定項目がある場合、
コントローラのbeforeRenderコールバックの中でそれらを設定することが出来ます。::

    class PostsController extends AppController {
        public function beforeRender() {
            parent::beforeRender();
            $this->helpers['CustomStuff'] = $this->_getCustomStuffSettings();
        }
    }

ヘルパーを使う
==============

コントローラの中でどのヘルパーが使いたいのかを一度設定してしまえば、各ヘルパーはビューの中でパブリックプロパティのように扱えます。
例えば :php:class:`HtmlHelper` を使っているとします。その場合、次のようにヘルパーにアクセスできます。::

    echo $this->Html->css('styles');

上記の例ではHtmlHelperの ``css`` メソッドを呼び出しています。読み込み済みのヘルパーであれば
``$this->{$helperName}`` の形式でアクセスすることが出来ます。ビューの内部から動的にヘルパーを読み込む必要に迫られる時が来るかもしません。
その時は、 ビューの :php:class:`HelperCollection` を使ってこのようにできます。::

    $mediaHelper = $this->Helpers->load('Media', $mediaSettings);

HelperCollectionは :doc:`コレクション </core-libraries/collections>` であり、CakePHPの他の箇所でも使われているコレクションAPIをサポートしています。

コールバックメソッド
====================

ヘルパーはビューの描画工程を増やすようないくつかのコールバックを特徴としています。
さらに情報が欲しい場合は、 :ref:`helper-api` と :doc:`/core-libraries/collections` ドキュメントを参照して下さい。

ヘルパーを作る
==============

もし、コアヘルパー(またはgithubやBakeryにあるヘルパー) でやりたいことができなかったとしても、
ヘルパーを作るのは簡単なので大丈夫です。

ここで、アプリケーション内の様々な場所で必要とされるCSSスタイルのリンクを出力するヘルパーを作りたかったとしましょう。
CakePHPの既存のヘルパーの構造にロジックをあわせる為には、``/app/View/Helper`` に新しいクラスを作成する必要があります。
これから作るヘルパーをLinkHelperと呼ぶことにしましょう。実際のPHPクラスファイルはこのようになるでしょう。::

    /* /app/View/Helper/LinkHelper.php */
    App::uses('AppHelper', 'View/Helper');

    class LinkHelper extends AppHelper {
        public function makeEdit($title, $url) {
            // 特別に整形されたリンクを作るためのロジックはここ...
        }
    }

.. note::

    ヘルパーは ``AppHelper`` または :php:class:`Helper` を継承するか :ref:`helper-api` で定義されているすべてのコールバックを実装しなければなりません。


他のヘルパーを読み込む
-----------------------

他のヘルパーに既に存在している機能を使いたいと思うかもしれません。その場合、``$helpers``
配列に使いたいヘルパーを明示することで実現出来ます。フォーマットは、コントローラで指定する場合と同じようにして下さい。::

    /* /app/View/Helper/LinkHelper.php (他のヘルパーを使っている) */
    App::uses('AppHelper', 'View/Helper');

    class LinkHelper extends AppHelper {
        public $helpers = array('Html');

        public function makeEdit($title, $url) {
            // 整形されたデータを出力するために
            // HTMLヘルパーを使う:

            $link = $this->Html->link($title, $url, array('class' => 'edit'));

            return '<div class="editOuter">' . $link . '</div>';
        }
    }


.. _using-helpers:

自作のヘルパーを使う
--------------------

一旦ヘルパーを作って ``/app/View/Helper/`` に配置すると、コントローラで :php:attr:`~Controller::$helpers`
という特別な変数を使うことでそのヘルパーを読み込めるようになります。::

    class PostsController extends AppController {
        public $helpers = array('Link');
    }

一旦コントローラがこの新しいクラスを認識すると、ヘルパーの名前にちなんで名付けられたオブジェクトにアクセスすることで、ビューの中からこのヘルパーを使えるようになります。::

    <!-- 新しいヘルパーを使ってリンクを作る -->
    <?php echo $this->Link->makeEdit('Change this Recipe', '/recipes/edit/5'); ?>


すべてのヘルパーのための機能を作成する
======================================

すべてのヘルパーは特別なクラスAppHelperを(モデルがAppModelを継承し、コントローラがAppControllerを継承するのと同じように）継承します。
すべてのヘルパーで利用できる機能を作成するためには、 ``/app/View/Helper/AppHelper.php`` を作成して下さい。::

    App::uses('Helper', 'View');

    class AppHelper extends Helper {
        public function customMethod() {
        }
    }


.. _helper-api:

ヘルパー API
============

.. php:class:: Helper

    ヘルパーの基底クラスです。いくつかのユーティリティメソッドと他のヘルパーを読み込む機能を提供しています。

.. php:method:: webroot($file)

    ファイル名をアプリケーションのwebrootで解決します。テーマがアクティブで現在のテーマのwebrootにファイルが存在しているとき、
    テーマのファイルへのパスが返ります。

.. php:method:: url($url, $full = false)

    HTMLがエスケープされたURLを生成し、 :php:meth:`Router::url()` に委譲します。

.. php:method:: value($options = array(), $field = null, $key = 'value')

    与えられたinput名に対応する値を取得します。

.. php:method:: domId($options = null, $id = 'id')

    現在選択されているフィールドに対応するキャメルケースのid値を生成します。AppHelperにてこのメソッドを上書きすることでCakePHPがID属性を生成する方法を変更することができます。

コールバック
------------

.. php:method:: beforeRenderFile($viewFile)

    各ビューファイルが描画される前に呼び出されます。これにはエレメント、
    ビュー、親ビュー、レイアウトを含みます。

.. php:method:: afterRenderFile($viewFile, $content)

    各ビューファイルが描画された後に呼び出されます。これにはエレメント、
    ビュー、親ビュー、レイアウトを含みます。コールバックは描画されたコンテンツがブラウザにどのように描画されるかを変えるために ``$content`` を変更して返すことができます。

.. php:method:: beforeRender($viewFile)

    beforeRenderメソッドはコントローラのbeforeRenderメソッドの後に呼び出されます。
    しかし、コントローラがビューとレイアウトを描画する前です。描画されるファイルを引数として受け取ります。

.. php:method:: afterRender($viewFile)

    ビューが描画された後に呼び出されます。しかし、レイアウトの描画開始前でく。

.. php:method:: beforeLayout($layoutFile)

    レイアウトの描画開始前に呼び出されます。レイアウトファイル名を引数として受け取ります。

.. php:method:: afterLayout($layoutFile)

    レイアウトの描画が完了した時に呼び出されます。レイアウトファイル名を引数として受け取ります。

コアヘルパー
============

:doc:`/core-libraries/helpers/cache`
    ビューコンテンツをキャッシュするためのコアによって使われます。
:doc:`/core-libraries/helpers/form`
    HTMLフォームと自動生成されるフォームエレメントを作成します。また、バリデーション問題をハンドリングします。
:doc:`/core-libraries/helpers/html`
    整形式のマークアップを作るための便利なメソッドです。画像、リンク、ヘッダタグなど。
:doc:`/core-libraries/helpers/js`
    様々なJavascriptライブラリと互換のあるJavascriptを作成するために使われます。
:doc:`/core-libraries/helpers/number`
    数値と通貨を整形します。
:doc:`/core-libraries/helpers/paginator`
    モデルデータのページ切り替えと並び替え。
:doc:`/core-libraries/helpers/rss`
    RSSフィードとXMLデータを出力するための便利なメソッドです。
:doc:`/core-libraries/helpers/session`
    ビューでセッションの値を読み込んでアクセスします。
:doc:`/core-libraries/helpers/text`
    スマートリンク、ハイライト、ワードスマートトランケート。
:doc:`/core-libraries/helpers/time`
    近傍検出(来年かどうか？)や、素晴らしい文字列整形(Today, 10:30 am)とタイムゾーンの変換をします。

.. meta::
    :title lang=en: Helpers
    :keywords lang=en: php class,time function,presentation layer,processing power,ajax,markup,array,functionality,logic,syntax,elements,cakephp,plugins
