ヘルパー
########

ヘルパーはアプリケーションのプレゼンテーション層のためのコンポーネントのようなクラスです。
多くのビューやエレメント、レイアウトで共有される表示ロジックを含んでいます。
この章ではヘルパーの作り方と CakePHP のコアヘルパーでできる基本的なタスクの概要を説明します。

CakePHP にはビューの作成に役立ついくつかの特徴的なヘルパーがあります。それらは、
整形式のマークアップ(フォーム含む)、テキスト、時間、数値の整形に役立ったり、
Ajax 機能をスピードアップさせたりします。CakePHP のヘルパーに関するさらなる情報は、
各ヘルパーの章をご覧ください。

.. include:: /core-libraries/toc-helpers.rst
    :start-line: 11

.. _configuring-helpers:

ヘルパーの設定と使用
====================

CakePHP でヘルパーを有効にするにはコントローラに認識させる必要があります。各コントローラは
:php:attr:`~Controller::$helpers` プロパティを持っており、そのプロパティにはビューで
利用できるヘルパーの一覧が保持されています。ビューでヘルパーを使用するにはヘルパーの名前を
コントローラの ``$helpers`` 配列に追加して下さい。 ::

    class BakeriesController extends AppController {
        public $helpers = array('Form', 'Html', 'Js', 'Time');
    }

プラグインからヘルパーを追加するには CakePHP の様々な場所で使われている
:term:`プラグイン記法` を使います。::

    class BakeriesController extends AppController {
        public $helpers = array('Blog.Comment');
    }

あるアクションの間だけヘルパーを追加することができます。言い換えると、あるヘルパーの利用を
特定のコントローラアクションに限定し、同じコントローラの他のアクションでは利用できないように
することができます。このことはコントローラが整理された状態を維持するのに役立つだけでなく、
さらに、ヘルパーを使わない他のアクションの処理コストを抑えることになります。 ::

    class BakeriesController extends AppController {
        public function bake() {
            $this->helpers[] = 'Time';
        }
        public function mix() {
            // ここに Time ヘルパーは読み込まれないので利用出来ません
        }
    }

もしすべてのコントローラでヘルパーを有効にする必要がある場合ヘルパーの名前を
``/app/Controller/AppController.php`` (見つからない場合は作成して下さい) の
``$helpers`` 配列に追加して下さい。デフォルトの Html ヘルパーと Form ヘルパーも
忘れずに読み込んで下さい。 ::

    class AppController extends Controller {
        public $helpers = array('Form', 'Html', 'Js', 'Time');
    }

ヘルパーにはオプションを渡すことが出来ます。このオプションは属性の値を設定したり、
ヘルパーの動作を変えるために使うことができます。 ::

    class AwesomeHelper extends AppHelper {
        public function __construct(View $view, $settings = array()) {
            parent::__construct($view, $settings);
            debug($settings);
        }
    }

    class AwesomeController extends AppController {
        public $helpers = array('Awesome' => array('option1' => 'value1'));
    }

2.3 から、オプションはヘルパーの ``Helper::$settings`` プロパティにマージされます。

すべてのヘルパーで共通して使える設定に ``className`` オプションがあります。
このオプションを設定するとビューの中に別名のヘルパーを作ることができます。この機能は
``$this->Html`` や他の共通ヘルパーの参照を独自の実装に置き換えたい時に役立ちます。 ::

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

ヘルパーを設定することで宣言的にヘルパーを設定することができるようになり、また、
コントローラアクションの外に設定のロジックを置けるようになります。もし、
クラス宣言の一部に含めることができない設定項目がある場合、コントローラの
beforeRender コールバックの中でそれらを設定することが出来ます。::

    class PostsController extends AppController {
        public function beforeRender() {
            parent::beforeRender();
            $this->helpers['CustomStuff'] = $this->_getCustomStuffSettings();
        }
    }

ヘルパーを使う
==============

コントローラの中でどのヘルパーが使いたいのかを一度設定してしまえば、各ヘルパーは
ビューの中でパブリックプロパティのように扱えます。例えば :php:class:`HtmlHelper` を
使っているとします。その場合、次のようにヘルパーにアクセスできます。 ::

    echo $this->Html->css('styles');

上記の例では HtmlHelper の ``css`` メソッドを呼び出しています。読み込み済みの
ヘルパーであれば ``$this->{$helperName}`` の形式でアクセスすることが出来ます。
ビューの内部から動的にヘルパーを読み込む必要に迫られる時が来るかもしません。
その時は、 ビューの :php:class:`HelperCollection` を使ってこのようにできます。 ::

    $mediaHelper = $this->Helpers->load('Media', $mediaSettings);

HelperCollection は :doc:`コレクション </core-libraries/collections>` であり、
CakePHP の他の箇所でも使われているコレクション API をサポートしています。

コールバックメソッド
====================

ヘルパーはビューの描画工程を増やすようないくつかのコールバックを特徴としています。
さらに情報が欲しい場合は、 :ref:`helper-api` と :doc:`/core-libraries/collections`
ドキュメントを参照して下さい。

ヘルパーを作る
==============

もし、コアヘルパー (または GitHub や Bakery にあるヘルパー) でやりたいことが
できなかったとしても、ヘルパーを作るのは簡単なので大丈夫です。

ここで、アプリケーション内の様々な場所で必要とされる CSS スタイルのリンクを出力する
ヘルパーを作りたかったとしましょう。CakePHP の既存のヘルパーの構造にロジックを
あわせる為には、 ``/app/View/Helper`` に新しいクラスを作成する必要があります。
これから作るヘルパーを LinkHelper と呼ぶことにしましょう。実際の PHP クラスファイルは
このようになるでしょう。 ::

    /* /app/View/Helper/LinkHelper.php */
    App::uses('AppHelper', 'View/Helper');

    class LinkHelper extends AppHelper {
        public function makeEdit($title, $url) {
            // 特別に整形されたリンクを作るためのロジックはここ...
        }
    }

.. note::

    ヘルパーは ``AppHelper`` または :php:class:`Helper` を継承するか
    :ref:`helper-api` で定義されているすべてのコールバックを実装しなければなりません。


他のヘルパーを読み込む
----------------------

他のヘルパーに既に存在している機能を使いたいと思うかもしれません。その場合、 ``$helpers``
配列に使いたいヘルパーを明示することで実現出来ます。フォーマットは、コントローラで
指定する場合と同じようにして下さい。 ::

    /* /app/View/Helper/LinkHelper.php (他のヘルパーを使っている) */
    App::uses('AppHelper', 'View/Helper');

    class LinkHelper extends AppHelper {
        public $helpers = array('Html');

        public function makeEdit($title, $url) {
            // 整形されたデータを出力するために
            // HTML ヘルパーを使う:

            $link = $this->Html->link($title, $url, array('class' => 'edit'));

            return '<div class="editOuter">' . $link . '</div>';
        }
    }


.. _using-helpers:

自作のヘルパーを使う
--------------------

一旦ヘルパーを作って ``/app/View/Helper/`` に配置すると、コントローラで
:php:attr:`~Controller::$helpers` という特別な変数を使うことでそのヘルパーを
読み込めるようになります。 ::

    class PostsController extends AppController {
        public $helpers = array('Link');
    }

一旦コントローラがこの新しいクラスを認識すると、ヘルパーの名前にちなんで
名付けられたオブジェクトにアクセスすることで、ビューの中からこのヘルパーを
使えるようになります。 ::

    <!-- 新しいヘルパーを使ってリンクを作る -->
    <?php echo $this->Link->makeEdit('Change this Recipe', '/recipes/edit/5'); ?>


すべてのヘルパーのための機能を作成する
======================================

すべてのヘルパーは特別なクラス AppHelper を (モデルが AppModel を継承し、コントローラが
AppController を継承するのと同じように）継承します。すべてのヘルパーで利用できる機能を
作成するためには、 ``/app/View/Helper/AppHelper.php`` を作成して下さい。 ::

    App::uses('Helper', 'View');

    class AppHelper extends Helper {
        public function customMethod() {
        }
    }


.. _helper-api:

ヘルパー API
============

.. php:class:: Helper

    ヘルパーの基底クラスです。いくつかのユーティリティメソッドと他のヘルパーを
    読み込む機能を提供しています。

.. php:method:: webroot($file)

    ファイル名をアプリケーションの webroot で解決します。テーマがアクティブで
    現在のテーマの webroot にファイルが存在しているとき、テーマのファイルへのパスが返ります。

.. php:method:: url($url, $full = false)

    HTML がエスケープされた URL を生成し、 :php:meth:`Router::url()` に委譲します。

.. php:method:: value($options = array(), $field = null, $key = 'value')

    与えられた input 名に対応する値を取得します。

.. php:method:: domId($options = null, $id = 'id')

    現在選択されているフィールドに対応するキャメルケースのid値を生成します。
    AppHelper にてこのメソッドを上書きすることで CakePHP が ID 属性を生成する方法を
    変更することができます。

コールバック
------------

.. php:method:: beforeRenderFile($viewFile)

    各ビューファイルが描画される前に呼び出されます。これにはエレメント、
    ビュー、親ビュー、レイアウトを含みます。

.. php:method:: afterRenderFile($viewFile, $content)

    各ビューファイルが描画された後に呼び出されます。これにはエレメント、ビュー、親ビュー、
    レイアウトを含みます。コールバックは描画されたコンテンツがブラウザにどのように
    描画されるかを変えるために ``$content`` を変更して返すことができます。

.. php:method:: beforeRender($viewFile)

    beforeRender メソッドはコントローラの beforeRender メソッドの後に呼び出されます。
    しかし、コントローラがビューとレイアウトを描画する前です。描画されるファイルを
    引数として受け取ります。

.. php:method:: afterRender($viewFile)

    ビューが描画された後に呼び出されます。しかし、レイアウトの描画開始前です。

.. php:method:: beforeLayout($layoutFile)

    レイアウトの描画開始前に呼び出されます。レイアウトファイル名を引数として受け取ります。

.. php:method:: afterLayout($layoutFile)

    レイアウトの描画が完了した時に呼び出されます。レイアウトファイル名を引数として受け取ります。


.. meta::
    :title lang=ja: Helpers
    :keywords lang=ja: php class,time function,presentation layer,processing power,ajax,markup,array,functionality,logic,syntax,elements,cakephp,plugins
